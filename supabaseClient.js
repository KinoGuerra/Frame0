// ============================================================
// FRAME0 - CLIENTE SUPABASE
// Archivo: supabaseClient.js
// Descripción:
// Centraliza la conexión entre el frontend de Frame0 y Supabase.
// ============================================================

// URL pública del proyecto Supabase.
// IMPORTANTE: no agregar "/rest/v1/" al final.
const SUPABASE_URL = 'https://yroxzqvqiyjxltkfklti.supabase.co';

// Clave pública anon / publishable.
// Esta clave puede usarse en frontend siempre que tengas RLS activo.
const SUPABASE_ANON_KEY = 'sb_publishable_BMIC3fCqPQ_EQ_r3hgBqrA_omxA-2q1';

// Validación básica para evitar errores difíciles de detectar.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Falta configurar SUPABASE_URL o SUPABASE_ANON_KEY en supabaseClient.js');
}

// Validación para confirmar que el CDN de Supabase está cargado antes de este archivo.
if (typeof supabase === 'undefined') {
  console.error(
    'Supabase no está cargado. Revisá que en index.html se cargue primero el CDN de Supabase.'
  );
}

// Cliente global de Supabase.
// La variable "supabase" viene del CDN cargado en index.html.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mensaje de control para verificar en consola que se está usando el proyecto correcto.
console.log('Supabase conectado a:', SUPABASE_URL);