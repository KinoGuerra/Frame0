// ============================================================
// FRAME0 - ADAPTADOR DE DATOS SUPABASE
// Archivo: apiClient.js
// Mantiene funciones usadas por la UI, pero todas consultan Supabase directo.
// ============================================================

const FRAME0_TABLES = {
  categorias: {
    table: "categorias",
    select: "id,nombre,descripcion,activa,created_at",
    activeColumn: "activa",
    orderBy: "nombre"
  },
  divisiones: {
    table: "divisiones",
    select: "id,categoria_id,nombre,descripcion,activa,created_at,categoria:categorias(id,nombre)",
    activeColumn: "activa",
    orderBy: "nombre"
  },
  usuarios: {
    table: "usuarios_app",
    select: "id,nombre,apellido,documento,contacto,usuario,rol,activo",
    activeColumn: "activo",
    orderBy: "nombre"
  },
  veedores: {
    table: "veedores",
    select: "id,usuario_id,activo,created_at,usuario:usuarios_app(id,nombre,apellido,documento,contacto,usuario,rol,activo)",
    activeColumn: "activo",
    orderBy: "created_at"
  },
  equipos: {
    table: "equipos",
    select: "id,division_id,nombre,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo,created_at",
    activeColumn: "activo",
    orderBy: "nombre"
  },
  jugadores: {
    table: "jugadores",
    select: "id,equipo_id,nombre,apellido,dni,fecha_nacimiento,posicion,dorsal,foto_url,activo,created_at",
    activeColumn: "activo",
    orderBy: "apellido"
  },
  delegados: {
    table: "delegados",
    select: "id,usuario_id,equipo_id,activo,created_at,usuario:usuarios_app(id,nombre,apellido,documento,contacto,usuario,rol,activo),equipo:equipos(id,nombre,division_id,abreviatura,nombre_corto,activo)",
    activeColumn: "activo",
    orderBy: "created_at"
  }
};

function getSupabaseClient() {
  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no está disponible. Revisá la carga de supabaseClient.js.");
  }

  return supabaseClient;
}

function parseDataEndpoint(endpoint) {
  const [path, queryString = ""] = String(endpoint || "").replace(/^\/+/, "").split("?");
  const [resource, id, action] = path.split("/");
  const params = new URLSearchParams(queryString);

  return {
    resource,
    id,
    action,
    includeInactive: params.get("verBajas") === "true"
  };
}

function getResourceConfig(resource) {
  const config = FRAME0_TABLES[resource];

  if (!config) {
    throw new Error(`Recurso Supabase no configurado: ${resource}`);
  }

  return config;
}

function cleanPayload(payload = {}) {
  return Object.entries(payload).reduce((clean, [key, value]) => {
    if (value !== undefined) clean[key] = value;
    return clean;
  }, {});
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function getAdminCredentials(body = {}) {
  const usuario = String(body.admin_usuario || "").trim();
  const password = String(body.admin_password || "").trim();
  if (!usuario || !password) {
    throw new Error("La sesión de administrador expiró. Volvé a ingresar.");
  }
  return { usuario, password };
}

async function apiGet(endpoint) {
  const { resource, id, includeInactive } = parseDataEndpoint(endpoint);
  const config = getResourceConfig(resource);
  let query = getSupabaseClient().from(config.table).select(config.select);

  if (id) {
    query = query.eq("id", id).single();
  } else {
    if (!includeInactive && config.activeColumn) {
      query = query.eq(config.activeColumn, true);
    }

    if (config.orderBy) {
      query = query.order(config.orderBy, { ascending: true });
    }
  }

  const { data, error } = await query;
  if (error) throw error;

  return data || (id ? null : []);
}

async function createObserver(body = {}) {
  const nombre = String(body.nombre || "").trim();
  const apellido = String(body.apellido || "").trim();
  const documento = String(body.documento || "").trim();
  const contacto = String(body.contacto || "").trim();
  const usuario = normalizeUsername(body.usuario);
  const password = String(body.password || "");

  if (!nombre || !apellido || !documento || !contacto || !usuario || !password) {
    throw new Error("Campos requeridos: nombre, apellido, documento, contacto, usuario, password");
  }

  const admin = getAdminCredentials(body);
  const { data, error } = await getSupabaseClient().rpc("guardar_veedor_admin", {
    p_admin_usuario: admin.usuario,
    p_admin_password: admin.password,
    p_veedor_id: null,
    p_nombre: nombre,
    p_apellido: apellido,
    p_documento: documento,
    p_contacto: contacto,
    p_usuario: usuario,
    p_password: password
  });

  if (error) throw error;
  return data;
}

async function createDelegate(body = {}) {
  const nombre = String(body.nombre || "").trim();
  const apellido = String(body.apellido || "").trim();
  const documento = String(body.documento || "").trim();
  const contacto = String(body.contacto || "").trim();
  const usuario = normalizeUsername(body.usuario);
  const password = String(body.password || "");
  const equipoId = String(body.equipo_id || "").trim();

  if (!nombre || !apellido || !documento || !contacto || !usuario || !password || !equipoId) {
    throw new Error("Campos requeridos: nombre, apellido, documento, contacto, usuario, password y equipo_id");
  }

  const admin = getAdminCredentials(body);
  const { data, error } = await getSupabaseClient().rpc("guardar_delegado_admin", {
    p_admin_usuario: admin.usuario,
    p_admin_password: admin.password,
    p_usuario_id: null,
    p_nombre: nombre,
    p_apellido: apellido,
    p_documento: documento,
    p_contacto: contacto,
    p_usuario: usuario,
    p_password: password,
    p_equipo_id: equipoId
  });

  if (error) throw error;
  return data;
}

async function updateDelegate(id, body = {}) {
  const admin = getAdminCredentials(body);
  const { data, error } = await getSupabaseClient().rpc("guardar_delegado_admin", {
    p_admin_usuario: admin.usuario,
    p_admin_password: admin.password,
    p_usuario_id: id,
    p_nombre: String(body.nombre || "").trim(),
    p_apellido: String(body.apellido || "").trim(),
    p_documento: String(body.documento || "").trim(),
    p_contacto: String(body.contacto || "").trim(),
    p_usuario: normalizeUsername(body.usuario),
    p_password: body.password ? String(body.password) : null,
    p_equipo_id: String(body.equipo_id || "").trim()
  });

  if (error) throw error;
  return data;
}

async function updateObserver(id, body = {}) {
  const admin = getAdminCredentials(body);
  const { data, error } = await getSupabaseClient().rpc("guardar_veedor_admin", {
    p_admin_usuario: admin.usuario,
    p_admin_password: admin.password,
    p_veedor_id: id,
    p_nombre: String(body.nombre || "").trim(),
    p_apellido: String(body.apellido || "").trim(),
    p_documento: String(body.documento || "").trim(),
    p_contacto: String(body.contacto || "").trim(),
    p_usuario: normalizeUsername(body.usuario),
    p_password: body.password ? String(body.password) : null
  });

  if (error) throw error;
  return data;
}

async function loginObserver(body = {}) {
  const usuario = normalizeUsername(body.usuario);
  const password = String(body.password || "");

  if (!usuario || !password) {
    throw new Error("Usuario y contraseña son requeridos.");
  }

  const { data: profiles, error: loginError } = await getSupabaseClient().rpc("iniciar_sesion_frame0", {
    p_usuario: usuario,
    p_password: password.trim()
  });
  if (loginError) throw loginError;

  const profile = profiles?.[0];
  if (!profile) throw new Error("Usuario o contraseña incorrectos.");

  if (!profile.activo || profile.rol !== "veedor") {
    throw new Error("El usuario no tiene perfil de veedor activo.");
  }

  const { data, error } = await getSupabaseClient()
    .from("veedores")
    .select("id,usuario_id,activo,created_at")
    .eq("usuario_id", profile.id)
    .eq("activo", true)
    .single();

  if (error) throw error;
  return { ...data, usuario: profile };
}

async function apiPost(endpoint, body) {
  const { resource, action } = parseDataEndpoint(endpoint);

  if (resource === "veedores" && action === "login") {
    return loginObserver(body);
  }

  if (resource === "delegados") {
    return createDelegate(body);
  }

  if (resource === "veedores") {
    return createObserver(body);
  }

  const config = getResourceConfig(resource);
  const { data, error } = await getSupabaseClient()
    .from(config.table)
    .insert(cleanPayload(body))
    .select(config.select)
    .single();

  if (error) throw error;
  return data;
}

async function apiPut(endpoint, body) {
  const { resource, id } = parseDataEndpoint(endpoint);

  if (!id) {
    throw new Error("Falta el id del registro a actualizar.");
  }

  if (resource === "veedores") {
    return updateObserver(id, body);
  }

  if (resource === "delegados") {
    return updateDelegate(id, body);
  }

  const config = getResourceConfig(resource);
  const { data, error } = await getSupabaseClient()
    .from(config.table)
    .update(cleanPayload(body))
    .eq("id", id)
    .select(config.select)
    .single();

  if (error) throw error;
  return data;
}

async function apiPatch(endpoint, body = {}) {
  const { resource, id, action } = parseDataEndpoint(endpoint);
  const config = getResourceConfig(resource);

  if (!id || !["activar", "desactivar"].includes(action)) {
    throw new Error(`Acción no soportada: ${endpoint}`);
  }

  if (["usuarios", "veedores"].includes(resource)) {
    const admin = getAdminCredentials(body);
    const { data, error } = await getSupabaseClient().rpc("cambiar_estado_usuario_admin", {
      p_admin_usuario: admin.usuario,
      p_admin_password: admin.password,
      p_tipo: resource === "usuarios" ? "delegado" : "veedor",
      p_registro_id: id,
      p_activo: action === "activar"
    });
    if (error) throw error;
    return data;
  }

  const { data, error } = await getSupabaseClient()
    .from(config.table)
    .update({ [config.activeColumn]: action === "activar" })
    .eq("id", id)
    .select(config.select)
    .single();

  if (error) throw error;

  if (resource === "categorias" && action === "desactivar") {
    const { error: divisionsError } = await getSupabaseClient()
      .from("divisiones")
      .update({ activa: false })
      .eq("categoria_id", id);

    if (divisionsError) throw divisionsError;
  }

  return data;
}
