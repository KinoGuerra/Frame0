import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno del backend.");
}

// Esta key solo debe vivir en backend. Nunca usar service_role en el frontend.
export const supabase = createClient(SUPABASE_URL || "", SUPABASE_SERVICE_ROLE_KEY || "");
