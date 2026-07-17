import { ensureAiResponse, getFunctionFailure, missingAiKeyError } from "../_shared/ai-errors.ts";

type Row = Record<string, unknown>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const groqApiKey = Deno.env.get("GROQ_API_KEY") || "";
const groqModel = Deno.env.get("GROQ_MODEL") || "openai/gpt-oss-20b";

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function db(path: string) {
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en Supabase secrets.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: { apikey: serviceRoleKey, authorization: `Bearer ${serviceRoleKey}` }
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function validateAdmin(usuario: string, password: string) {
  const users = await db(`usuarios_app?select=*&usuario=ilike.${encodeURIComponent(usuario)}&activo=eq.true&limit=1`);
  const user = users?.[0];
  if (!user || !["admin", "superadmin"].includes(user.rol) || String(user.password_hash || "") !== password) {
    throw new Error("Credenciales de administrador inválidas.");
  }
}

function standings(teams: Row[], matches: Row[]) {
  const rows = new Map(teams.map((team) => [String(team.id), { equipo: String(team.nombre), puntos: 0, diferencia: 0, gf: 0 }]));
  matches.forEach((match) => {
    const home = rows.get(String(match.equipo_local_id));
    const away = rows.get(String(match.equipo_visitante_id));
    if (!home || !away) return;
    const hg = Number(match.goles_local || 0);
    const ag = Number(match.goles_visitante || 0);
    home.gf += hg; away.gf += ag; home.diferencia += hg - ag; away.diferencia += ag - hg;
    if (hg === ag) { home.puntos += 1; away.puntos += 1; }
    else if (hg > ag) home.puntos += 3;
    else away.puntos += 3;
  });
  return [...rows.values()].sort((a, b) => b.puntos - a.puntos || b.diferencia - a.diferencia || b.gf - a.gf);
}

function matchRound(match: Row) {
  return Number(String(match.observaciones || "").match(/fecha\s*(\d+)/i)?.[1] || 0);
}

function fallbackPage(category: Row, division: Row, matches: Row[], teams: Row[], cards: Row[], standingsMatches = matches) {
  const teamNames = new Map(teams.map((team) => [String(team.id), String(team.nombre)]));
  const sortedByGoals = [...matches].sort((a, b) => Number(b.goles_local) + Number(b.goles_visitante) - Number(a.goles_local) - Number(a.goles_visitante));
  const featured = sortedByGoals[0];
  const matchCards = new Map<string, number>();
  cards.forEach((card) => matchCards.set(String(card.partido_id), (matchCards.get(String(card.partido_id)) || 0) + 1));
  const heated = [...matches].sort((a, b) => (matchCards.get(String(b.id)) || 0) - (matchCards.get(String(a.id)) || 0))[0];
  const describe = (match?: Row) => match
    ? `${teamNames.get(String(match.equipo_local_id)) || "Local"} ${match.goles_local} - ${match.goles_visitante} ${teamNames.get(String(match.equipo_visitante_id)) || "Visitante"}`
    : "No hubo partidos finalizados con información suficiente.";
  return {
    categoria_id: category.id,
    division_id: division.id,
    titulo: `${category.nombre} - ${division.nombre}`,
    resumen_general: matches.length ? `La fecha dejó ${matches.length} partidos finalizados y ${matches.reduce((sum, match) => sum + Number(match.goles_local) + Number(match.goles_visitante), 0)} goles en la división.` : "La fecha tuvo poca información cargada para esta división.",
    contenido_texto: "La organización presenta el resumen deportivo de la fecha con datos confirmados por veedores y resultados oficiales.",
    contenido_json: { bloques: [
      { tipo: "partido_destacado", titulo: "El partido de la fecha", texto: describe(featured) },
      { tipo: "mas_goles", titulo: "Lluvia de goles", texto: describe(featured) },
      { tipo: "mas_sanciones", titulo: "Partido caliente", texto: heated && (matchCards.get(String(heated.id)) || 0) ? `${describe(heated)} registró ${matchCards.get(String(heated.id))} tarjetas.` : "No se registraron incidencias disciplinarias destacadas." }
    ] },
    tabla_posiciones_snapshot: standings(teams, standingsMatches)
  };
}

async function polishWithAi(diary: Row) {
  if (!groqApiKey) throw missingAiKeyError("Groq", "GROQ_API_KEY");
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { authorization: `Bearer ${groqApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: groqModel,
      temperature: 0.2,
      max_tokens: 2500,
      messages: [
        { role: "system", content: "Devolvé solo JSON válido. No inventes resultados, equipos, jugadores ni sanciones. Conservá ids y tabla_posiciones_snapshot exactamente." },
        { role: "user", content: `Reescribí con tono de diario deportivo claro y no agresivo el siguiente borrador. Mantené la misma estructura: ${JSON.stringify(diary)}` }
      ]
    })
  });
  await ensureAiResponse(response, {
    provider: "Groq",
    apiKeyName: "GROQ_API_KEY",
    modelName: "GROQ_MODEL"
  });
  const payload = await response.json();
  const raw = String(payload?.choices?.[0]?.message?.content || "").replace(/^```json\s*|```$/gi, "").trim();
  try {
    const parsed = JSON.parse(raw);
    return { ...diary, ...parsed, titulo: "Frame0", paginas: (diary.paginas as Row[]).map((page, index) => ({ ...page, ...(parsed.paginas?.[index] || {}), categoria_id: page.categoria_id, division_id: page.division_id, tabla_posiciones_snapshot: page.tabla_posiciones_snapshot })) };
  } catch (_error) {
    throw new Error("Groq devolvió una respuesta que no contiene JSON válido.");
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return respond({ error: "Método no permitido." }, 405);
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch (_error) {
      return respond({ success: false, error: "El body debe ser JSON válido." }, 400);
    }
    const usuario = String(body.usuario || "").trim();
    const password = String(body.password || "").trim();
    if (!usuario || !password) return respond({ success: false, error: "Faltan las credenciales del administrador." }, 400);
    await validateAdmin(usuario, password);
    const numeroFecha = Number(body.numero_fecha);
    if (!Number.isInteger(numeroFecha) || numeroFecha < 1) throw new Error("Seleccioná una fecha deportiva realizada.");

    const allMatches = await db("partidos?select=id,division_id,equipo_local_id,equipo_visitante_id,fecha_hora,goles_local,goles_visitante,estado,observaciones&estado=eq.finalizado&observaciones=not.is.null");
    const matches = allMatches.filter((match: Row) => matchRound(match) === numeroFecha);
    const cumulativeMatches = allMatches.filter((match: Row) => {
      const round = matchRound(match);
      return round > 0 && round <= numeroFecha;
    });
    if (!matches.length) throw new Error("La fecha deportiva seleccionada no tiene partidos finalizados.");
    const matchDates = matches.map((match: Row) => new Date(String(match.fecha_hora || ""))).filter((date: Date) => !Number.isNaN(date.getTime()));
    if (!matchDates.length) throw new Error("Los partidos de la fecha no tienen fecha y hora cargadas.");
    const firstDate = new Date(Math.min(...matchDates.map((date: Date) => date.getTime()))).toISOString().slice(0, 10);
    const lastDate = new Date(Math.max(...matchDates.map((date: Date) => date.getTime()))).toISOString().slice(0, 10);
    const fecha = { numero_fecha: numeroFecha, fecha_desde: firstDate, fecha_hasta: lastDate, fecha_edicion: lastDate };

    const [categories, divisions, teams, cards] = await Promise.all([
      db("categorias?select=id,nombre&activa=eq.true"),
      db("divisiones?select=id,nombre,categoria_id&activa=eq.true"),
      db("equipos?select=id,nombre,division_id&activo=eq.true"),
      db("tarjetas?select=id,partido_id,tipo")
    ]);
    const pages = divisions.map((division: Row, index: number) => {
      const category = categories.find((item: Row) => String(item.id) === String(division.categoria_id)) || { id: division.categoria_id, nombre: "Categoría" };
      const divisionTeams = teams.filter((item: Row) => String(item.division_id) === String(division.id));
      const divisionMatches = matches.filter((item: Row) => String(item.division_id) === String(division.id));
      const divisionCumulativeMatches = cumulativeMatches.filter((item: Row) => String(item.division_id) === String(division.id));
      return { ...fallbackPage(category, division, divisionMatches, divisionTeams, cards, divisionCumulativeMatches), numero_pagina: index + 1, categoria: category, division };
    });
    const diary = await polishWithAi({ titulo: "Frame0", slogan: "Un fin de semana a puro fútbol", estado: "borrador", generado_por_ia: true, fecha, paginas: pages });
    const { paginas, ...edicion } = diary;
    return respond({ success: true, edicion, paginas });
  } catch (error) {
    const failure = getFunctionFailure(error, "No se pudo generar el diario.");
    return respond({ success: false, error: failure.message, code: failure.code }, failure.status);
  }
});
