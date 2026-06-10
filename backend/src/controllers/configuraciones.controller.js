import { supabase } from "../config/supabase.js";
import { createCrudController } from "../utils/crudController.js";
import { errorResponse, successResponse } from "../utils/responses.js";

export const configuracionesCrudController = createCrudController({
  table: "configuraciones",
  select: "id,clave,valor,descripcion,activa,created_at,updated_at",
  activeColumn: "activa",
  orderBy: "clave",
  postRequired: ["clave"],
  createPayload: (body) => ({
    clave: body.clave,
    valor: body.valor || {},
    descripcion: body.descripcion || null,
    activa: body.activa ?? true
  }),
  updatePayload: (body) => ({
    valor: body.valor,
    descripcion: body.descripcion,
    activa: body.activa,
    updated_at: new Date().toISOString()
  })
});

export async function getByClave(req, res) {
  const { data, error } = await supabase
    .from("configuraciones")
    .select("id,clave,valor,descripcion,activa,created_at,updated_at")
    .eq("clave", req.params.clave)
    .single();

  if (error) return errorResponse(res, error.message, 404);
  return successResponse(res, data);
}

export async function updateByClave(req, res) {
  const { data, error } = await supabase
    .from("configuraciones")
    .update({
      valor: req.body.valor,
      descripcion: req.body.descripcion,
      activa: req.body.activa,
      updated_at: new Date().toISOString()
    })
    .eq("clave", req.params.clave)
    .select("id,clave,valor,descripcion,activa,created_at,updated_at")
    .single();

  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, data);
}

export async function setActiveByClave(req, res, activeValue) {
  const { data, error } = await supabase
    .from("configuraciones")
    .update({ activa: activeValue, updated_at: new Date().toISOString() })
    .eq("clave", req.params.clave)
    .select("id,clave,valor,descripcion,activa,created_at,updated_at")
    .single();

  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, data);
}

export async function getHabilitacionEdicionJugadores(req, res) {
  const { data, error } = await supabase
    .from("configuraciones")
    .select("valor")
    .eq("clave", "habilitacion_edicion_jugadores")
    .eq("activa", true)
    .maybeSingle();

  if (error) return errorResponse(res, error.message, 500);

  const valor = data?.valor || {};
  const hoy = new Date();
  const fechaInicio = valor.fecha_inicio ? new Date(valor.fecha_inicio) : null;
  const fechaFin = valor.fecha_fin ? new Date(valor.fecha_fin) : null;
  const habilitado = Boolean(fechaInicio && fechaFin && hoy >= fechaInicio && hoy <= fechaFin);

  return successResponse(res, {
    habilitado,
    fecha_inicio: valor.fecha_inicio || null,
    fecha_fin: valor.fecha_fin || null
  });
}
