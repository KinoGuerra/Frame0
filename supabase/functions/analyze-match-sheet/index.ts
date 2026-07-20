import { ensureAiResponse, getFunctionFailure, missingAiKeyError } from "../_shared/ai-errors.ts";

type Row = Record<string, unknown>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const geminiApiKey = Deno.env.get("GEMINI_OCR_API_KEY") || "";
const geminiModel = Deno.env.get("GEMINI_OCR_MODEL") || "gemini-3.1-flash-lite";
const bucketName = "match-sheets";
const maxFileSize = 8 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const responseSchema = {
  type: "OBJECT",
  properties: {
    score: {
      type: "OBJECT",
      properties: {
        home: { type: "INTEGER", minimum: 0, maximum: 99 },
        away: { type: "INTEGER", minimum: 0, maximum: 99 },
        confidence: { type: "NUMBER", minimum: 0, maximum: 1 }
      },
      required: ["home", "away", "confidence"]
    },
    players: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          player_id: { type: "STRING" },
          goals: { type: "INTEGER", minimum: 0, maximum: 20 },
          yellow_cards: { type: "INTEGER", minimum: 0, maximum: 1 },
          red_cards: { type: "INTEGER", minimum: 0, maximum: 1 },
          observation: { type: "STRING" },
          confidence: { type: "NUMBER", minimum: 0, maximum: 1 }
        },
        required: ["player_id", "goals", "yellow_cards", "red_cards", "observation", "confidence"]
      }
    },
    warnings: { type: "ARRAY", items: { type: "STRING" } }
  },
  required: ["score", "players", "warnings"]
};

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

async function api(path: string, options: RequestInit = {}) {
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Falta configurar Supabase en la Edge Function.");
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      ...(options.headers || {})
    }
  });
  if (!response.ok) throw new Error(await response.text());
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function rpc(name: string, body: Row) {
  return api(`/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

async function db(path: string) {
  return api(`/rest/v1/${path}`);
}

function boundedInteger(value: unknown, maximum = 99) {
  return Math.min(Math.max(Math.trunc(Number(value) || 0), 0), maximum);
}

function boundedConfidence(value: unknown) {
  return Math.min(Math.max(Number(value) || 0, 0), 1);
}

export function hasValidFileSignature(mimeType: string, bytes: Uint8Array) {
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.slice(0, 8).every((value, index) => value === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]);
  if (mimeType === "image/webp") return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  if (mimeType === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  return false;
}

export function normalizeOcrResult(raw: Row, players: Row[], homeTeamId: string, awayTeamId: string) {
  const playerById = new Map(players.map((player) => [String(player.id || ""), player]));
  const warnings = Array.isArray(raw.warnings) ? raw.warnings.map(String).filter(Boolean) : [];
  const seen = new Set<string>();
  const incidences: Row[] = [];

  for (const item of Array.isArray(raw.players) ? raw.players as Row[] : []) {
    const playerId = String(item.player_id || "");
    const player = playerById.get(playerId);
    if (!player || seen.has(playerId)) {
      warnings.push("Una marca no pudo asociarse de forma segura con un jugador del partido.");
      continue;
    }
    seen.add(playerId);
    incidences.push({
      jugador_id: playerId,
      equipo_id: String(player.equipo_id || ""),
      goles: boundedInteger(item.goals, 20),
      amarillas: boundedInteger(item.yellow_cards, 1),
      rojas: boundedInteger(item.red_cards, 1),
      observacion: String(item.observation || "").trim().slice(0, 1000),
      confianza: boundedConfidence(item.confidence)
    });
  }

  const rawScore = raw.score && typeof raw.score === "object" ? raw.score as Row : {};
  const score = {
    home: boundedInteger(rawScore.home),
    away: boundedInteger(rawScore.away),
    confidence: boundedConfidence(rawScore.confidence)
  };
  const goalsByTeam = incidences.reduce((totals, item) => {
    totals[String(item.equipo_id)] = Number(totals[String(item.equipo_id)] || 0) + Number(item.goles || 0);
    return totals;
  }, {} as Record<string, number>);

  if ((goalsByTeam[homeTeamId] || 0) !== score.home || (goalsByTeam[awayTeamId] || 0) !== score.away) {
    warnings.push("El marcador no coincide con la suma de goles asignados a jugadores.");
  }

  return {
    score,
    incidences,
    warnings: [...new Set(warnings)],
    needs_review: score.confidence < 0.8 || incidences.some((item) => Number(item.confianza) < 0.8) || warnings.length > 0
  };
}

async function authenticate(usuario: string, password: string) {
  const data = await rpc("iniciar_sesion_frame0", { p_usuario: usuario, p_password: password });
  const user = Array.isArray(data) ? data[0] : null;
  if (!user || !["veedor", "admin", "superadmin"].includes(String(user.rol || ""))) {
    throw new Error("La sesión no está autorizada para analizar planillas.");
  }
  return user;
}

async function loadMatchContext(matchId: string) {
  const matches = await db(`partidos?select=id,fecha_hora,equipo_local_id,equipo_visitante_id&id=eq.${encodeURIComponent(matchId)}&limit=1`);
  const match = matches?.[0];
  if (!match) throw new Error("Partido no encontrado.");
  if (match.fecha_hora && new Date(match.fecha_hora).toISOString().slice(0, 10) > new Date().toISOString().slice(0, 10)) {
    throw new Error("No se puede analizar una planilla de un partido futuro.");
  }

  const teamIds = [String(match.equipo_local_id), String(match.equipo_visitante_id)];
  const idsFilter = teamIds.map((id) => `\"${id}\"`).join(",");
  const [teams, players] = await Promise.all([
    db(`equipos?select=id,nombre,nombre_corto,abreviatura&id=in.(${idsFilter})`),
    db(`jugadores?select=id,equipo_id,nombre,apellido,dni,dorsal&equipo_id=in.(${idsFilter})&activo=eq.true&order=apellido`)
  ]);
  return { match, teams: teams || [], players: players || [] };
}

async function askGemini(file: File, context: Row) {
  if (!geminiApiKey) throw missingAiKeyError("Gemini OCR", "GEMINI_OCR_API_KEY");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": geminiApiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: "Extraé únicamente los datos escritos o marcados en la planilla de fútbol. No inventes incidencias. Usá exclusivamente los player_id provistos. Si una marca es ambigua, reducí confidence y agregá una advertencia. TA y TR valen como máximo 1 por jugador." }] },
      contents: [{ role: "user", parts: [
        { text: `Partido y planteles oficiales:\n${JSON.stringify(context)}\n\nLeé marcador final, goles, tarjetas y observaciones disciplinarias. Ignorá firmas.` },
        { inlineData: { mimeType: file.type, data: bytes.toBase64() } }
      ] }],
      generationConfig: {
        temperature: 0,
        thinkingConfig: { thinkingLevel: "low" },
        responseMimeType: "application/json",
        responseSchema
      }
    })
  });
  await ensureAiResponse(response, {
    provider: "Gemini OCR",
    apiKeyName: "GEMINI_OCR_API_KEY",
    modelName: "GEMINI_OCR_MODEL"
  });
  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.map((part: Row) => part.text || "").join("").trim();
  if (!text) throw new Error("Gemini no devolvió datos de la planilla.");
  return JSON.parse(text);
}

function storagePath(matchId: string, file: File) {
  const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" }[file.type] || "bin";
  return `${matchId}/${crypto.randomUUID()}.${extension}`;
}

async function uploadFile(path: string, file: File) {
  await api(`/storage/v1/object/${bucketName}/${path.split("/").map(encodeURIComponent).join("/")}`, {
    method: "POST",
    headers: { "Content-Type": file.type, "x-upsert": "false" },
    body: file
  });
}

async function deleteFile(path: string) {
  try {
    await api(`/storage/v1/object/${bucketName}/${path.split("/").map(encodeURIComponent).join("/")}`, { method: "DELETE" });
  } catch (_error) {
    // La limpieza es de mejor esfuerzo; nunca se registran datos sensibles en logs.
  }
}

if (import.meta.main) Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return respond({ error: "Método no permitido." }, 405);

  try {
    const form = await request.formData();
    const usuario = String(form.get("usuario") || "").trim();
    const password = String(form.get("password") || "");
    const matchId = String(form.get("partido_id") || "").trim();
    const file = form.get("archivo");

    if (!usuario || !password) return respond({ error: "La sesión del veedor no está disponible." }, 401);
    if (!uuidPattern.test(matchId)) return respond({ error: "Partido inválido." }, 400);
    if (!(file instanceof File) || !file.size) return respond({ error: "Seleccioná una imagen o PDF." }, 400);
    if (!allowedMimeTypes.has(file.type)) return respond({ error: "Usá una imagen JPG, PNG, WebP o un PDF." }, 415);
    if (file.size > maxFileSize) return respond({ error: "El archivo supera el máximo de 8 MB." }, 413);
    const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (!hasValidFileSignature(file.type, signature)) return respond({ error: "El contenido del archivo no coincide con su formato." }, 415);

    await authenticate(usuario, password);
    const { match, teams, players } = await loadMatchContext(matchId);
    const homeTeamId = String(match.equipo_local_id);
    const awayTeamId = String(match.equipo_visitante_id);
    const extraction = await askGemini(file, {
      match: { id: match.id, home_team_id: homeTeamId, away_team_id: awayTeamId },
      teams,
      players
    });
    const normalized = normalizeOcrResult(extraction, players, homeTeamId, awayTeamId);
    const path = storagePath(matchId, file);
    await uploadFile(path, file);

    try {
      const sheetId = await rpc("registrar_planilla_partido_veedor", {
        p_usuario: usuario,
        p_password: password,
        p_partido_id: matchId,
        p_archivo_path: path,
        p_mime_type: file.type,
        p_tamano_bytes: file.size,
        p_resultado_ocr: normalized
      });
      return respond({ ...normalized, sheet_id: sheetId, file_name: file.name });
    } catch (error) {
      await deleteFile(path);
      throw error;
    }
  } catch (error) {
    const failure = getFunctionFailure(error, "No se pudo analizar la planilla.");
    return respond({ error: failure.message, code: failure.code }, failure.status);
  }
});
