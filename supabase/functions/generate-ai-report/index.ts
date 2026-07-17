import { ensureAiResponse, getFunctionFailure, missingAiKeyError } from "../_shared/ai-errors.ts";

type Dataset = {
  categorias: Record<string, unknown>[];
  divisiones: Record<string, unknown>[];
  equipos: Record<string, unknown>[];
  jugadores: Record<string, unknown>[];
  partidos: Record<string, unknown>[];
  goles: Record<string, unknown>[];
  tarjetas: Record<string, unknown>[];
  sanciones: Record<string, unknown>[];
};

type Report = {
  title: string;
  generatedAt: string;
  source: string;
  model: string;
  summary: string;
  metrics: Array<{ label: string; value: string | number }>;
  sections: Array<{ title: string; items: string[] }>;
  alerts: string[];
  recommendations: string[];
  warning?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const groqApiKey = Deno.env.get("GROQ_API_KEY") || "";
const groqModel = Deno.env.get("GROQ_MODEL") || "openai/gpt-oss-20b";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

async function supabaseGet(path: string) {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en la Edge Function.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Error consultando Supabase (${path}): ${await response.text()}`);
  }

  return response.json();
}

async function getActiveAdminUser(usuario: string, password: string) {
  const encodedUser = encodeURIComponent(usuario);
  const users = await supabaseGet(`usuarios_app?select=*&usuario=ilike.${encodedUser}&activo=eq.true&limit=1`);
  const user = Array.isArray(users) ? users[0] : null;

  if (!user) throw new Error("Usuario administrador no encontrado o inactivo.");
  if (!["admin", "superadmin"].includes(String(user.rol || ""))) {
    throw new Error("Rol no autorizado para generar reporteria IA.");
  }
  if (String(user.password_hash || "") !== password) {
    throw new Error("Contrasena incorrecta.");
  }

  return user;
}

async function getSanctions() {
  try {
    return await supabaseGet("sanciones?select=id,jugador_id,partido_id,motivo,fechas_suspension,cumplida,resolucion_detalle,estado_jugador,resuelta_at");
  } catch (_error) {
    return supabaseGet("sanciones?select=id,jugador_id,partido_id,motivo,fechas_suspension,cumplida");
  }
}

async function getDataset(): Promise<Dataset> {
  const [categorias, divisiones, equipos, jugadores, partidos, goles, tarjetas, sanciones] = await Promise.all([
    supabaseGet("categorias?select=id,nombre,activa"),
    supabaseGet("divisiones?select=id,nombre,categoria_id,activa"),
    supabaseGet("equipos?select=id,nombre,division_id,activo"),
    supabaseGet("jugadores?select=id,equipo_id,nombre,apellido,activo,dorsal"),
    supabaseGet("partidos?select=id,division_id,equipo_local_id,equipo_visitante_id,fecha_hora,goles_local,goles_visitante,estado,observaciones"),
    supabaseGet("goles?select=id,partido_id,jugador_id,equipo_id,tipo"),
    supabaseGet("tarjetas?select=id,partido_id,jugador_id,equipo_id,tipo"),
    getSanctions()
  ]);

  return {
    categorias,
    divisiones,
    equipos,
    jugadores,
    partidos,
    goles,
    tarjetas,
    sanciones
  };
}

function countBy(items: Record<string, unknown>[], keyGetter: (item: Record<string, unknown>) => string) {
  return items.reduce((map, item) => {
    const key = keyGetter(item) || "Sin dato";
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map<string, number>());
}

function topEntries(countMap: Map<string, number>, labelGetter: (key: string) => string, limit = 5) {
  return [...countMap.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, limit)
    .map(([key, count]) => `${labelGetter(key)} (${count})`);
}

function buildFallbackReport(dataset: Dataset, warning = ""): Report {
  const activeCategories = dataset.categorias.filter((item) => item.activa !== false);
  const activeDivisions = dataset.divisiones.filter((item) => item.activa !== false);
  const activeTeams = dataset.equipos.filter((item) => item.activo !== false);
  const activePlayers = dataset.jugadores.filter((item) => item.activo !== false);
  const finishedMatches = dataset.partidos.filter((item) => item.estado === "finalizado");
  const programmedMatches = dataset.partidos.filter((item) => item.estado === "programado");
  const suspendedMatches = dataset.partidos.filter((item) => ["suspendido", "cancelado"].includes(String(item.estado || "")));
  const yellowCards = dataset.tarjetas.filter((item) => item.tipo === "amarilla").length;
  const redCards = dataset.tarjetas.filter((item) => item.tipo === "roja").length;
  const pendingSanctions = dataset.sanciones.filter((item) => {
    const hasText = normalizeText(item.motivo);
    const hasResolution = item.resuelta_at || item.resolucion_detalle || item.estado_jugador;
    return hasText && !hasResolution;
  });
  const averagePlayers = activeTeams.length ? Math.round(activePlayers.length / activeTeams.length) : 0;
  const playerNameMap = new Map(activePlayers.map((player) => [
    String(player.id),
    `${player.apellido || ""} ${player.nombre || ""}`.trim() || "Jugador"
  ]));
  const teamNameMap = new Map(activeTeams.map((team) => [String(team.id), String(team.nombre || "Equipo")]));
  const topScorers = topEntries(
    countBy(dataset.goles.filter((goal) => goal.jugador_id), (goal) => String(goal.jugador_id || "")),
    (playerId) => playerNameMap.get(playerId) || "Jugador sin identificar"
  );
  const teamsByGoals = topEntries(
    countBy(dataset.goles.filter((goal) => goal.equipo_id), (goal) => String(goal.equipo_id || "")),
    (teamId) => teamNameMap.get(teamId) || "Equipo sin identificar"
  );
  const alerts = [
    !activeTeams.length ? "No hay equipos activos cargados para analizar." : "",
    !dataset.partidos.length ? "No hay partidos cargados en Supabase." : "",
    pendingSanctions.length ? `Hay ${pendingSanctions.length} observaciones disciplinarias pendientes de resolucion.` : "",
    suspendedMatches.length ? `Hay ${suspendedMatches.length} partidos suspendidos o cancelados para revisar.` : "",
    averagePlayers > 0 && averagePlayers < 7 ? "El promedio de jugadores por equipo es bajo; conviene revisar listas de buena fe." : ""
  ].filter(Boolean);

  return {
    title: "Resumen ejecutivo del torneo",
    generatedAt: new Date().toISOString(),
    source: warning ? "Fallback local Edge" : "Frame0 IA",
    model: warning ? "Reglas locales" : groqModel,
    summary: `El torneo registra ${activeCategories.length} categorias activas, ${activeDivisions.length} divisiones, ${activeTeams.length} equipos y ${activePlayers.length} jugadores activos. Hay ${dataset.partidos.length} partidos cargados, con ${finishedMatches.length} finalizados y ${programmedMatches.length} programados.`,
    metrics: [
      { label: "Categorias", value: activeCategories.length },
      { label: "Divisiones", value: activeDivisions.length },
      { label: "Equipos", value: activeTeams.length },
      { label: "Jugadores", value: activePlayers.length },
      { label: "Partidos finalizados", value: finishedMatches.length },
      { label: "Observaciones pendientes", value: pendingSanctions.length }
    ],
    sections: [
      {
        title: "Estado deportivo",
        items: [
          `Partidos programados: ${programmedMatches.length}.`,
          `Partidos finalizados: ${finishedMatches.length}.`,
          `Goles registrados: ${dataset.goles.length}.`
        ]
      },
      {
        title: "Rendimiento y estadisticas",
        items: [
          `Promedio de jugadores por equipo: ${averagePlayers}.`,
          `Goleadores destacados: ${topScorers.join(", ") || "sin goles registrados"}.`,
          `Equipos con mas goles: ${teamsByGoals.join(", ") || "sin goles registrados"}.`
        ]
      },
      {
        title: "Disciplina",
        items: [
          `Tarjetas amarillas: ${yellowCards}.`,
          `Tarjetas rojas: ${redCards}.`,
          `Sanciones/observaciones totales: ${dataset.sanciones.length}.`,
          `Pendientes de resolucion: ${pendingSanctions.length}.`
        ]
      }
    ],
    alerts: alerts.length ? alerts : ["No se detectan alertas criticas con los datos actuales."],
    recommendations: [
      pendingSanctions.length ? "Resolver las observaciones disciplinarias pendientes antes de la proxima fecha." : "Mantener la revision disciplinaria despues de cada fecha.",
      programmedMatches.length ? "Verificar canchas y horarios de los partidos programados." : "Generar o actualizar el fixture para sostener la planificacion.",
      "Revisar equipos con baja cantidad de jugadores activos para evitar problemas de presentacion.",
      "Publicar novedades relevantes para delegados si hubo cambios de fixture o sanciones."
    ],
    warning
  };
}

function buildPrompt(dataset: Dataset, fallbackReport: Report) {
  const compactData = {
    metrics: fallbackReport.metrics,
    sections: fallbackReport.sections,
    alerts: fallbackReport.alerts,
    recommendations: fallbackReport.recommendations,
    partidosPorEstado: Object.fromEntries(countBy(dataset.partidos, (item) => String(item.estado || "sin_estado"))),
    tarjetasPorTipo: Object.fromEntries(countBy(dataset.tarjetas, (item) => String(item.tipo || "sin_tipo")))
  };

  return [
    "Sos un asistente de reporteria para un torneo amateur de futbol llamado Frame0.",
    "Genera un reporte ejecutivo breve, operativo y en espanol rioplatense/neutro.",
    "Responde unicamente JSON valido con esta forma exacta:",
    '{"title":"...","summary":"...","sections":[{"title":"...","items":["..."]}],"alerts":["..."],"recommendations":["..."]}',
    "No inventes datos. Si algo falta, indica que falta cargarlo.",
    `Datos agregados: ${JSON.stringify(compactData)}`
  ].join("\n");
}

function parseModelJson(content: string) {
  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

async function generateWithGroq(dataset: Dataset) {
  if (!groqApiKey) {
    throw missingAiKeyError("Groq", "GROQ_API_KEY");
  }

  const fallbackReport = buildFallbackReport(dataset);
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${groqApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: groqModel,
      temperature: 0.2,
      max_tokens: 1600,
      messages: [
        { role: "system", content: "Devolves solo JSON valido. No uses markdown." },
        { role: "user", content: buildPrompt(dataset, fallbackReport) }
      ]
    })
  });

  await ensureAiResponse(response, {
    provider: "Groq",
    apiKeyName: "GROQ_API_KEY",
    modelName: "GROQ_MODEL"
  });

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content || "";
  const parsed = parseModelJson(content);

  return {
    ...fallbackReport,
    ...parsed,
    generatedAt: new Date().toISOString(),
    source: "Groq",
    model: groqModel,
    metrics: fallbackReport.metrics
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Metodo no permitido." }, 405);
  }

  try {
    const body = await request.json();
    const usuario = normalizeText(body.usuario);
    const password = normalizeText(body.password);

    if (!usuario || !password) {
      return jsonResponse({ error: "Faltan usuario o contrasena." }, 400);
    }

    await getActiveAdminUser(usuario, password);
    const dataset = await getDataset();

    try {
      const report = await generateWithGroq(dataset);
      return jsonResponse({ report });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido.";
      const report = buildFallbackReport(dataset, `No se pudo usar Groq. Se genero un reporte basico por reglas locales: ${message}`);
      return jsonResponse({ report });
    }
  } catch (error) {
    const failure = getFunctionFailure(error, "No se pudo generar el reporte.");
    return jsonResponse({ error: failure.message, code: failure.code }, failure.status);
  }
});
