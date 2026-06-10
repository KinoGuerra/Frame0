import { supabase } from "../config/supabase.js";
import { errorResponse, successResponse } from "./responses.js";

function applyActiveFilter(query, activeColumn, verBajas) {
  if (!activeColumn || verBajas === "true") return query;
  return query.eq(activeColumn, true);
}

export function createCrudController({
  table,
  select = "*",
  activeColumn = "activo",
  orderBy = "created_at",
  postRequired = [],
  createPayload,
  updatePayload,
  listFilter
}) {
  async function list(req, res) {
    let query = supabase.from(table).select(select);
    query = applyActiveFilter(query, activeColumn, req.query.verBajas);
    if (listFilter) query = listFilter(query, req);
    if (orderBy) query = query.order(orderBy, { ascending: true });

    const { data, error } = await query;
    if (error) return errorResponse(res, error.message, 500);
    return successResponse(res, data || []);
  }

  async function getById(req, res) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .eq("id", req.params.id)
      .single();

    if (error) return errorResponse(res, error.message, 404);
    return successResponse(res, data);
  }

  async function create(req, res) {
    const missingFields = postRequired.filter((field) => !req.body[field]);
    if (missingFields.length) {
      return errorResponse(res, `Campos requeridos: ${missingFields.join(", ")}`, 400);
    }

    const payload = createPayload ? createPayload(req.body) : req.body;
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select(select)
      .single();

    if (error) return errorResponse(res, error.message, 500);
    return successResponse(res, data, 201);
  }

  async function update(req, res) {
    const payload = updatePayload ? updatePayload(req.body) : req.body;
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq("id", req.params.id)
      .select(select)
      .single();

    if (error) return errorResponse(res, error.message, 500);
    return successResponse(res, data);
  }

  async function setActive(req, res, activeValue) {
    const { data, error } = await supabase
      .from(table)
      .update({ [activeColumn]: activeValue })
      .eq("id", req.params.id)
      .select(select)
      .single();

    if (error) return errorResponse(res, error.message, 500);
    return successResponse(res, data);
  }

  return {
    list,
    getById,
    create,
    update,
    deactivate: (req, res) => setActive(req, res, false),
    activate: (req, res) => setActive(req, res, true)
  };
}
