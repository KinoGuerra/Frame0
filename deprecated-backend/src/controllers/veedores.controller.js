import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { supabase } from "../config/supabase.js";
import { errorResponse, successResponse } from "../utils/responses.js";

const selectVeedores = "id,usuario_id,activo,created_at,usuario:usuarios_app(id,nombre,apellido,contacto,usuario,rol,activo)";
const duplicateUserMessage = "El usuario ya existe. Ingresá otro nombre de usuario.";

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [algorithm, salt, hash] = String(storedHash || "").split(":");
  if (algorithm !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(String(password), salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function getMissingCreateFields(body) {
  return ["nombre", "apellido", "contacto", "usuario", "password"].filter((field) => !String(body[field] || "").trim());
}

async function findUserByNormalizedUsername(username) {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) return null;

  const { data, error } = await supabase
    .from("usuarios_app")
    .select("id,usuario")
    .not("usuario", "is", null);

  if (error) throw error;
  return (data || []).find((user) => normalizeUsername(user.usuario) === normalizedUsername) || null;
}

async function getVeedorById(id) {
  const { data, error } = await supabase
    .from("veedores")
    .select(selectVeedores)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

function mapDuplicateError(error) {
  return error?.code === "23505" ? duplicateUserMessage : error?.message;
}

async function list(req, res) {
  let query = supabase.from("veedores").select(selectVeedores);

  if (req.query.verBajas !== "true") {
    query = query.eq("activo", true);
  }

  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, data || []);
}

async function getById(req, res) {
  try {
    return successResponse(res, await getVeedorById(req.params.id));
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
}

async function create(req, res) {
  const { nombre, apellido, contacto, password } = req.body;
  const usuario = normalizeUsername(req.body.usuario);
  const missingFields = getMissingCreateFields({ ...req.body, usuario });

  if (missingFields.length) {
    return errorResponse(res, `Campos requeridos: ${missingFields.join(", ")}`, 400);
  }

  try {
    const duplicatedUser = await findUserByNormalizedUsername(usuario);
    if (duplicatedUser) {
      return errorResponse(res, duplicateUserMessage, 409);
    }

    const { data: userData, error: userError } = await supabase
      .from("usuarios_app")
      .insert({
        nombre: String(nombre).trim(),
        apellido: String(apellido).trim(),
        contacto: String(contacto).trim(),
        usuario,
        password_hash: hashPassword(password),
        rol: "veedor",
        activo: true
      })
      .select("id")
      .single();

    if (userError) return errorResponse(res, mapDuplicateError(userError), userError.code === "23505" ? 409 : 500);

    const { data, error } = await supabase
      .from("veedores")
      .insert({ usuario_id: userData.id, activo: true })
      .select(selectVeedores)
      .single();

    if (error) return errorResponse(res, error.message, 500);
    return successResponse(res, data, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

async function update(req, res) {
  const { nombre, apellido, contacto, password } = req.body;
  const usuario = req.body.usuario ? normalizeUsername(req.body.usuario) : undefined;

  try {
    const { data: veedor, error: veedorError } = await supabase
      .from("veedores")
      .select("id,usuario_id")
      .eq("id", req.params.id)
      .single();

    if (veedorError) return errorResponse(res, veedorError.message, 404);

    if (usuario) {
      const duplicatedUser = await findUserByNormalizedUsername(usuario);
      if (duplicatedUser && String(duplicatedUser.id) !== String(veedor.usuario_id)) {
        return errorResponse(res, duplicateUserMessage, 409);
      }
    }

    const payload = {
      nombre: nombre === undefined ? undefined : String(nombre).trim(),
      apellido: apellido === undefined ? undefined : String(apellido).trim(),
      contacto: contacto === undefined ? undefined : String(contacto).trim(),
      usuario,
      rol: "veedor"
    };

    if (password) {
      payload.password_hash = hashPassword(password);
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });

    const { error: updateError } = await supabase
      .from("usuarios_app")
      .update(payload)
      .eq("id", veedor.usuario_id);

    if (updateError) return errorResponse(res, mapDuplicateError(updateError), updateError.code === "23505" ? 409 : 500);

    return successResponse(res, await getVeedorById(req.params.id));
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

async function setActive(req, res, activeValue) {
  const { data, error } = await supabase
    .from("veedores")
    .update({ activo: activeValue })
    .eq("id", req.params.id)
    .select(selectVeedores)
    .single();

  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, data);
}

async function login(req, res) {
  const usuario = normalizeUsername(req.body.usuario);
  const password = req.body.password;

  if (!usuario || !password) {
    return errorResponse(res, "Usuario y contraseña son requeridos.", 400);
  }

  try {
    const user = await findUserByNormalizedUsername(usuario);
    if (!user) return errorResponse(res, "Usuario o contraseña incorrectos.", 401);

    const { data: profile, error: profileError } = await supabase
      .from("usuarios_app")
      .select("id,password_hash,rol,activo")
      .eq("id", user.id)
      .single();

    if (profileError) return errorResponse(res, profileError.message, 500);
    if (!profile.activo || profile.rol !== "veedor" || !verifyPassword(password, profile.password_hash)) {
      return errorResponse(res, "Usuario o contraseña incorrectos.", 401);
    }

    const { data: veedorData, error: veedorError } = await supabase
      .from("veedores")
      .select(selectVeedores)
      .eq("usuario_id", profile.id)
      .eq("activo", true)
      .maybeSingle();

    if (veedorError) return errorResponse(res, veedorError.message, 500);
    if (!veedorData) return errorResponse(res, "El usuario no tiene perfil de veedor activo.", 403);

    return successResponse(res, veedorData);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

export const veedoresController = {
  list,
  getById,
  create,
  update,
  login,
  deactivate: (req, res) => setActive(req, res, false),
  activate: (req, res) => setActive(req, res, true)
};
