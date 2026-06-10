// ============================================================
// FRAME0 - CLIENTE SUPABASE
// Archivo: supabaseClient.js
// Descripción:
// Centraliza la conexión entre el frontend de Frame0 y Supabase.
// ============================================================

// URL pública del proyecto Supabase.
// Se obtiene desde: Supabase → Project Settings → API → Project URL
const SUPABASE_URL = 'https://yroxzqvqiyjxltkfklti.supabase.co';

// Clave pública anon.
// Se obtiene desde: Supabase → Project Settings → API → anon public key.
// Esta clave puede usarse en frontend siempre que tengas RLS activo.
const SUPABASE_ANON_KEY = 'sb_publishable_BMIC3fCqPQ_EQ_r3hgBqrA_omxA-2q1';

// Validación básica para evitar errores difíciles de detectar.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Falta configurar SUPABASE_URL o SUPABASE_ANON_KEY en supabaseClient.js');
}

// Cliente global de Supabase.
// La variable "supabase" viene del CDN que vamos a cargar en index.html.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);