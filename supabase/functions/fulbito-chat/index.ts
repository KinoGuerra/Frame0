type Row = Record<string, unknown>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";
const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-3.1-flash-lite";

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function db(path: string) {
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Falta configurar Supabase en la Edge Function.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: { apikey: serviceRoleKey, authorization: `Bearer ${serviceRoleKey}` }
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function publicContext() {
  const [settings, categories, divisions, teams, matches] = await Promise.all([
    db("configuraciones?select=clave,valor&clave=in.(public_settings,tournament_settings)"),
    db("categorias?select=id,nombre,descripcion&activa=eq.true&order=nombre"),
    db("divisiones?select=id,categoria_id,nombre,descripcion&activa=eq.true&order=nombre"),
    db("equipos?select=id,division_id,nombre,nombre_corto,abreviatura&activo=eq.true&order=nombre"),
    db("partidos?select=division_id,equipo_local_id,equipo_visitante_id,fecha_hora,goles_local,goles_visitante,estado,observaciones&order=fecha_hora.desc&limit=300")
  ]);
  return { settings, categories, divisions, teams, matches };
}

async function delegateContext(usuario: string, password: string) {
  const users = await db(`usuarios_app?select=id,usuario,rol,password_hash,activo&usuario=ilike.${encodeURIComponent(usuario)}&activo=eq.true&limit=1`);
  const user = users?.[0];
  if (!user || user.rol !== "delegado" || String(user.password_hash || "") !== password) {
    throw new Error("La sesión del delegado no es válida.");
  }

  const delegates = await db(`delegados?select=equipo_id&usuario_id=eq.${encodeURIComponent(String(user.id))}&activo=eq.true&limit=1`);
  const teamId = String(delegates?.[0]?.equipo_id || "");
  if (!teamId) throw new Error("El delegado no tiene un equipo activo asociado.");

  const [settings, teams, players, matches] = await Promise.all([
    db("configuraciones?select=clave,valor&clave=eq.tournament_settings"),
    db(`equipos?select=id,division_id,nombre,nombre_corto,abreviatura,descripcion,activo&id=eq.${encodeURIComponent(teamId)}&limit=1`),
    db(`jugadores?select=id,nombre,apellido,posicion,dorsal,activo&equipo_id=eq.${encodeURIComponent(teamId)}&order=apellido`),
    db(`partidos?select=division_id,equipo_local_id,equipo_visitante_id,fecha_hora,cancha,goles_local,goles_visitante,estado,observaciones&or=(equipo_local_id.eq.${encodeURIComponent(teamId)},equipo_visitante_id.eq.${encodeURIComponent(teamId)})&order=fecha_hora`)
  ]);
  return { settings, team: teams?.[0], players, matches };
}

async function askGemini(question: string, profile: string, context: Row) {
  if (!geminiApiKey) throw new Error("Falta configurar GEMINI_API_KEY en Supabase secrets.");
  const scope = profile === "delegate"
    ? "Respondé únicamente sobre el uso de Frame0 y los datos del equipo asignado incluidos en el contexto. No reveles contraseñas, DNI ni datos de otros equipos."
    : "Respondé únicamente sobre el reglamento, torneos, categorías, equipos, fixture, resultados y posiciones públicas incluidos en el contexto.";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": geminiApiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: `Tu nombre es Fulbito y sos el asistente virtual del torneo amateur Frame0. La interfaz ya saludó y te presentó: no vuelvas a saludar, dar la bienvenida ni presentarte. Respondé directamente la consulta en español rioplatense, de forma clara, breve y en texto plano sin Markdown, asteriscos ni encabezados. No inventes datos. Si el contexto no alcanza, decilo. ${scope}` }] },
      contents: [{ role: "user", parts: [{ text: `Contexto actualizado:\n${JSON.stringify(context)}\n\nPregunta: ${question}` }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 600 }
    })
  });
  if (!response.ok) throw new Error(`Gemini respondió error: ${await response.text()}`);
  const payload = await response.json();
  const answer = payload?.candidates?.[0]?.content?.parts?.map((part: Row) => part.text || "").join("").trim();
  if (!answer) throw new Error("Gemini no devolvió una respuesta.");
  return answer.replaceAll("**", "");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return respond({ error: "Método no permitido." }, 405);
  try {
    const body = await request.json();
    const question = String(body.question || "").trim();
    const profile = body.profile === "delegate" ? "delegate" : "public";
    if (!question || question.length > 500) return respond({ error: "La pregunta debe tener entre 1 y 500 caracteres." }, 400);
    const context = profile === "delegate"
      ? await delegateContext(String(body.usuario || "").trim(), String(body.password || ""))
      : await publicContext();
    return respond({ answer: await askGemini(question, profile, context) });
  } catch (error) {
    return respond({ error: error instanceof Error ? error.message : "No se pudo consultar a Fulbito." }, 400);
  }
});
