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
    select: "id,nombre,apellido,contacto,usuario,rol,activo",
    activeColumn: "activo",
    orderBy: "nombre"
  },
  veedores: {
    table: "veedores",
    select: "id,usuario_id,activo,created_at,usuario:usuarios_app(id,nombre,apellido,contacto,usuario,rol,activo)",
    activeColumn: "activo",
    orderBy: "created_at"
  },
  equipos: {
    table: "equipos",
    select: "id,division_id,nombre,escudo_url,color_principal,color_secundario,activo,created_at",
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
    select: "id,usuario_id,equipo_id,activo,created_at,usuario:usuarios_app(id,nombre,apellido,contacto,usuario,rol,activo),equipo:equipos(id,nombre,division_id,activo)",
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

function getObserverAuthEmail(username) {
  const normalizedUsername = normalizeUsername(username);
  return normalizedUsername.includes("@") ? normalizedUsername : `${normalizedUsername}@frame0.local`;
}

function getAuthEmail(username) {
  const normalizedUsername = normalizeUsername(username);
  return normalizedUsername.includes("@") ? normalizedUsername : `${normalizedUsername}@frame0.local`;
}

function getUsernameFromLogin(login) {
  const normalizedLogin = normalizeUsername(login);
  return normalizedLogin.includes("@") ? normalizedLogin.split("@")[0] : normalizedLogin;
}

async function getCurrentSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  return data?.session || null;
}

async function requireAuthenticatedSession() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    throw new Error("Necesit?s iniciar sesi?n con Supabase para guardar cambios.");
  }

  return session;
}

async function resolveLoginProfile(username) {
  const login = normalizeUsername(username);
  const lookupUsername = getUsernameFromLogin(login);

  if (!lookupUsername) {
    throw new Error("Ingresá un usuario.");
  }

  const { data: resolvedProfile, error: rpcError } = await getSupabaseClient()
    .rpc("resolve_login_profile", { login_usuario: login });

  if (!rpcError) {
    if (resolvedProfile?.length) {
      return resolvedProfile[0];
    }

    throw new Error(`Usuario "${lookupUsername}" no encontrado en usuarios_app.`);
  }

  const { data, error } = await getSupabaseClient()
    .from("usuarios_app")
    .select("id,usuario,rol,activo")
    .ilike("usuario", lookupUsername)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("No se pudo consultar usuarios_app. Revisá las políticas RLS para resolver el usuario antes del login.");
  }

  if (!data) {
    throw new Error(`Usuario "${lookupUsername}" no encontrado en usuarios_app.`);
  }

  return {
    ...data,
    auth_email: getAuthEmail(data.usuario || lookupUsername)
  };
}

async function apiSignInWithRole(role, username, password) {
  const profileForLogin = await resolveLoginProfile(username);
  const authEmail = profileForLogin.auth_email || getAuthEmail(profileForLogin.usuario);

  if (profileForLogin.activo === false) {
    throw new Error(`El usuario "${profileForLogin.usuario}" esta inactivo.`);
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  if (!allowedRoles.includes(profileForLogin.rol)) {
    throw new Error(`El rol "${profileForLogin.rol}" no esta autorizado para este ingreso.`);
  }

  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: authEmail,
    password: String(password || "")
  });

  if (error) {
    throw new Error(`Error de autenticaci?n en Supabase Auth: ${error.message}`);
  }

  const { data: profile, error: profileError } = await getSupabaseClient()
    .from("usuarios_app")
    .select("id,usuario,rol,activo")
    .or(`id.eq.${data.user.id},usuario.eq.${profileForLogin.usuario}`)
    .limit(1)
    .single();

  if (profileError) {
    await getSupabaseClient().auth.signOut();
    throw new Error("La autenticaci?n fue correcta, pero no se pudo validar el perfil en usuarios_app.");
  }

  if (!profile.activo) {
    await getSupabaseClient().auth.signOut();
    throw new Error(`El usuario "${profile.usuario}" esta inactivo.`);
  }

  if (!allowedRoles.includes(profile.rol)) {
    await getSupabaseClient().auth.signOut();
    throw new Error(`El rol "${profile.rol}" no esta autorizado para este ingreso.`);
  }

  return profile;
}

async function apiSignInWithPasswordHash(role, username, password) {
  const usuarioLimpio = String(username || "").trim();
  const allowedRoles = Array.isArray(role) ? role : [role];

  const { data, error } = await getSupabaseClient()
    .from("usuarios_app")
    .select("*")
    .ilike("usuario", usuarioLimpio)
    .eq("activo", true)
    .maybeSingle();

  console.log("usuarioLimpio:", usuarioLimpio);
  console.log("data usuarios_app:", data);
  console.log("error usuarios_app:", error);

  if (error) {
    throw new Error(`Error consultando Supabase: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Usuario "${usuarioLimpio}" no encontrado en usuarios_app.`);
  }

  if (data.password_hash !== String(password || "").trim()) {
    throw new Error("Contraseña incorrecta.");
  }

  if (!allowedRoles.includes(data.rol)) {
    throw new Error(`El rol "${data.rol}" no esta autorizado para este ingreso.`);
  }

  return data;
}

async function ensureUniqueUsername(username, currentUserId = "") {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) return;

  const { data, error } = await getSupabaseClient()
    .from("usuarios_app")
    .select("id,usuario")
    .not("usuario", "is", null);

  if (error) throw error;

  const duplicatedUser = (data || []).find((user) =>
    normalizeUsername(user.usuario) === normalizedUsername &&
    String(user.id) !== String(currentUserId)
  );

  if (duplicatedUser) {
    throw new Error("El usuario ya existe. Ingresá otro nombre de usuario.");
  }
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
  const contacto = String(body.contacto || "").trim();
  const usuario = normalizeUsername(body.usuario);
  const password = String(body.password || "");

  if (!nombre || !apellido || !contacto || !usuario || !password) {
    throw new Error("Campos requeridos: nombre, apellido, contacto, usuario, password");
  }

  await ensureUniqueUsername(usuario);

  const { data: profile, error: profileError } = await getSupabaseClient()
    .from("usuarios_app")
    .insert({
      nombre,
      apellido,
      contacto,
      usuario,
      rol: "veedor",
      password_hash: password,
      activo: true
    })
    .select("id,nombre,apellido,contacto,usuario,rol,activo")
    .single();

  if (profileError) throw profileError;

  const { data, error } = await getSupabaseClient()
    .from("veedores")
    .insert({ usuario_id: profile.id, activo: true })
    .select(FRAME0_TABLES.veedores.select)
    .single();

  if (error) throw error;
  return data;
}

async function createDelegate(body = {}) {
  const nombre = String(body.nombre || "").trim();
  const apellido = String(body.apellido || "").trim();
  const contacto = String(body.contacto || "").trim();
  const usuario = normalizeUsername(body.usuario);
  const password = String(body.password || "");
  const equipoId = String(body.equipo_id || "").trim();

  if (!nombre || !apellido || !contacto || !usuario || !password || !equipoId) {
    throw new Error("Campos requeridos: nombre, apellido, contacto, usuario, password y equipo_id");
  }

  await ensureUniqueUsername(usuario);

  const { data: profile, error: profileError } = await getSupabaseClient()
    .from("usuarios_app")
    .insert({ nombre, apellido, contacto, usuario, rol: "delegado", password_hash: password, activo: true })
    .select("id,nombre,apellido,contacto,usuario,rol,activo")
    .single();

  if (profileError) throw profileError;

  const { data, error } = await getSupabaseClient()
    .from("delegados")
    .insert({ usuario_id: profile.id, equipo_id: equipoId, activo: true })
    .select(FRAME0_TABLES.delegados.select)
    .single();

  if (error) throw error;
  return data;
}

async function updateDelegate(id, body = {}) {
  const { data: delegate, error: delegateError } = await getSupabaseClient()
    .from("delegados")
    .select("id,usuario_id")
    .eq("id", id)
    .single();

  if (delegateError) throw delegateError;

  const usuario = body.usuario ? normalizeUsername(body.usuario) : undefined;
  if (usuario) await ensureUniqueUsername(usuario, delegate.usuario_id);

  const payload = cleanPayload({
    nombre: body.nombre === undefined ? undefined : String(body.nombre).trim(),
    apellido: body.apellido === undefined ? undefined : String(body.apellido).trim(),
    contacto: body.contacto === undefined ? undefined : String(body.contacto).trim(),
    usuario,
    password_hash: body.password ? String(body.password) : undefined,
    rol: "delegado"
  });

  const { error: updateError } = await getSupabaseClient()
    .from("usuarios_app")
    .update(payload)
    .eq("id", delegate.usuario_id);

  if (updateError) throw updateError;

  const { data, error } = await getSupabaseClient()
    .from("delegados")
    .select(FRAME0_TABLES.delegados.select)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

async function updateObserver(id, body = {}) {
  const { data: observer, error: observerError } = await getSupabaseClient()
    .from("veedores")
    .select("id,usuario_id")
    .eq("id", id)
    .single();

  if (observerError) throw observerError;

  const usuario = body.usuario ? normalizeUsername(body.usuario) : undefined;
  if (usuario) {
    await ensureUniqueUsername(usuario, observer.usuario_id);
  }

  const payload = cleanPayload({
    nombre: body.nombre === undefined ? undefined : String(body.nombre).trim(),
    apellido: body.apellido === undefined ? undefined : String(body.apellido).trim(),
    contacto: body.contacto === undefined ? undefined : String(body.contacto).trim(),
    usuario,
    password_hash: body.password ? String(body.password) : undefined,
    rol: "veedor"
  });

  const { error: updateError } = await getSupabaseClient()
    .from("usuarios_app")
    .update(payload)
    .eq("id", observer.usuario_id);

  if (updateError) throw updateError;

  const { data, error } = await getSupabaseClient()
    .from("veedores")
    .select(FRAME0_TABLES.veedores.select)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

async function loginObserver(body = {}) {
  const profileForLogin = await resolveLoginProfile(body.usuario);
  const email = profileForLogin.auth_email || getObserverAuthEmail(profileForLogin.usuario);
  const password = String(body.password || "");

  if (!email || !password) {
    throw new Error("Usuario y contraseña son requeridos.");
  }

  if (profileForLogin.activo === false) {
    throw new Error(`El usuario "${profileForLogin.usuario}" esta inactivo.`);
  }

  if (profileForLogin.rol !== "veedor") {
    throw new Error(`El rol "${profileForLogin.rol}" no esta autorizado para ingresar como veedor.`);
  }

  const { error: authError } = await getSupabaseClient().auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    throw new Error(`Error de autenticaci?n en Supabase Auth: ${authError.message}`);
  }

  const { data: profile, error: profileError } = await getSupabaseClient()
    .from("usuarios_app")
    .select("id,rol,activo")
    .or(`id.eq.${profileForLogin.id},usuario.eq.${profileForLogin.usuario}`)
    .single();

  if (profileError) throw profileError;
  if (!profile.activo || profile.rol !== "veedor") {
    throw new Error("El usuario no tiene perfil de veedor activo.");
  }

  const { data, error } = await getSupabaseClient()
    .from("veedores")
    .select(FRAME0_TABLES.veedores.select)
    .eq("usuario_id", profile.id)
    .eq("activo", true)
    .single();

  if (error) throw error;
  return data;
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

async function apiPatch(endpoint) {
  const { resource, id, action } = parseDataEndpoint(endpoint);
  const config = getResourceConfig(resource);

  if (!id || !["activar", "desactivar"].includes(action)) {
    throw new Error(`Acción no soportada: ${endpoint}`);
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

async function apiDelete(endpoint) {
  const { resource, id } = parseDataEndpoint(endpoint);
  const config = getResourceConfig(resource);

  if (!id) {
    throw new Error("Falta el id del registro a eliminar.");
  }

  const { error } = await getSupabaseClient()
    .from(config.table)
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
