import { supabase } from "../config/supabase.js";
import { errorResponse, successResponse } from "../utils/responses.js";

export const usuariosController = {
  async list(req, res) {
    const { data, error } = await supabase
      .from("usuarios_app")
      .select("id,nombre,email,rol,activo")
      .eq("activo", true)
      .order("nombre", { ascending: true });

    if (error) return errorResponse(res, error.message, 500);
    return successResponse(res, data || []);
  }
};
