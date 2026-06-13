// ============================================================
// FRAME0 - CLIENTE SUPABASE
// Archivo: supabaseClient.js
//
// Frontend HTML/JS plano:
// - colocar aca la URL publica del proyecto Supabase.
// - colocar aca solo la anon key / publishable key.
// - no usar service_role_key en el navegador.
// ============================================================

const SUPABASE_URL = "https://yroxzqvqiyjxltkfklti.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BMIC3fCqPQ_EQ_r3hgBqrA_omxA-2q1";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Falta configurar SUPABASE_URL o SUPABASE_ANON_KEY en supabaseClient.js.");
}

if (typeof supabase === "undefined") {
  console.error("Supabase no esta cargado. En index.html debe cargarse primero el CDN de Supabase.");
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
