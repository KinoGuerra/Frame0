# Frame0 - Guia para agentes

## Contexto
Frame0 es un frontend estatico para una plataforma de torneos amateur de futbol. Usa HTML5, CSS3, Bootstrap 5, Bootstrap Icons, JavaScript vanilla y Supabase como fuente de datos.

El sitio se publica desde la raiz del repositorio en GitHub Pages. Debe funcionar sin build system y sin backend local.

## Arquitectura
- `index.html`: estructura principal, modales y dependencias CDN.
- `styles.css`: estilos visuales, responsive, dark mode y componentes.
- `script.js`: navegacion, roles, renderizado dinamico, login y logica de interaccion.
- `supabaseClient.js`: conexion publica del navegador a Supabase con `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
- `apiClient.js`: adaptador de datos directo a Supabase. No debe llamar a un backend local.
- `supabase/migrations/`: migraciones SQL, RLS, RPC y permisos.
- `assets/`: logos, escudos, SVG e imagenes.
- `deprecated-backend/`: backend Express archivado solo como referencia historica.

## Reglas generales
- Mantener separados HTML, CSS y JavaScript.
- No agregar frameworks, bundlers ni package managers sin necesidad explicita.
- Conservar rutas relativas compatibles con GitHub Pages.
- No modificar estilos visuales salvo que la tarea lo pida o sea imprescindible.
- Evitar cambios amplios: preferir ediciones pequenas y localizadas.
- No reactivar ni depender de `deprecated-backend/`.
- Validar JavaScript con `node --check script.js`; si se toca `apiClient.js`, validar tambien `node --check apiClient.js`.

## Supabase
- Usar solo anon key / publishable key en frontend.
- No usar `service_role_key` ni secretos privados en archivos del navegador.
- Las lecturas/escrituras deben usar `supabase-js` directo: `from().select()`, `insert()`, `update()`, `delete()` o `upsert()`.
- Mantener RLS, grants y RPC sincronizados con el flujo real de la UI.
- Para cambios de login, permisos, configuraciones o escritura desde admin/delegado/veedor, revisar y actualizar migraciones nuevas en `supabase/migrations/`.
- Si una consulta usa columnas nuevas, agregar migracion y considerar fallback de lectura base para que la UI no se rompa mientras Supabase no esta actualizado.
- Las escrituras iniciadas por roles con login propio de Frame0 (`usuarios_app.usuario` + `password_hash`) deben usar RPC `security definer` con `p_usuario` y `p_password`; no depender de politicas `authenticated` salvo que ese rol use Supabase Auth real.

## Login actual
El login admin/delegado/veedor usa la tabla `public.usuarios_app`, no debe buscar usuarios por email.

Consulta obligatoria para login:

```js
const usuarioLimpio = usuarioIngresado.trim();

const { data, error } = await supabaseClient
  .from("usuarios_app")
  .select("*")
  .ilike("usuario", usuarioLimpio)
  .eq("activo", true)
  .maybeSingle();
```

Reglas del login:
- Buscar solo por columna `usuario`.
- No buscar por `nombre`.
- No buscar por email.
- No buscar en otra tabla para autenticar credenciales.
- Comparar la contrasena ingresada contra `data.password_hash`.
- Usar `data.rol`, `data.nombre` y `data.id` para continuar el flujo.
- Admin acepta `rol = admin` o `rol = superadmin`.
- Delegado acepta `rol = delegado`.
- Veedor acepta `rol = veedor`.
- Mantener logs temporales mientras se depura: `usuarioLimpio`, `data usuarios_app`, `error usuarios_app`, y URL de Supabase si ayuda.
- Si el usuario existe pero `data` llega `null`, revisar que esten aplicados los grants/RLS de login, especialmente `supabase/migrations/009_grant_login_lookup_select.sql`.

## Delegados
- Los delegados se autentican por `usuarios_app.usuario` y `usuarios_app.password_hash`.
- El equipo del delegado debe resolverse por relacion real:
  `usuarios_app.id -> delegados.usuario_id -> delegados.equipo_id -> equipos.id`.
- No resolver el equipo delegado por coincidencia de texto salvo como fallback temporal.
- En `Administrador > Delegados`, listar por la tabla `delegados` y mostrar el usuario de ingreso (`usuarios_app.usuario`), no UUIDs.
- Baja/reactivacion de delegados debe mantener sincronizados `usuarios_app.activo` y `delegados.activo` cuando exista la relacion.
- El atributo interno para guardar el equipo actual del delegado en el sidebar es `data-current-delegate-team`; no reutilizar `data-delegate-team`, porque ese selector pertenece al boton `Mi equipo`.

## Veedores
- Los veedores se autentican por `usuarios_app.usuario` y `usuarios_app.password_hash`.
- La carga inicial del perfil veedor depende de `loadObserverDataFromSupabase()`.
- Si se agregan columnas nuevas en `equipos`, mantener fallback de lectura base para no romper el perfil veedor.

## Configuraciones publicas
- `Administrador > Configuraciones > Public Page` guarda en `configuraciones` con clave `public_settings`.
- Incluye redes, WhatsApp, link de Drive de fotos, informacion del torneo, ubicacion, contacto, auspiciantes, carrusel de home y reglamento.
- Al guardar, debe actualizar Supabase y refrescar la landing publica en la misma sesion cuando corresponda.
- Al cargar la pagina, `script.js` debe leer `public_settings` desde Supabase y aplicar esos valores.
- El link de Drive para fotos se guarda como `drivePhotosLink`; puede ser URL completa de carpeta o ID de carpeta.

## Configuracion general del torneo
- `Administrador > Configuraciones > Generales Torneo` guarda en `configuraciones` con clave `tournament_settings`.
- La escritura se realiza con la RPC `guardar_configuracion_torneo`.
- Las fechas `playerRegistrationFrom` y `playerRegistrationTo` restringen carga, edicion, baja y reactivacion de jugadores desde delegado.
- El perfil delegado debe cargar `tournament_settings` antes de renderizar `Jugadores`.
- El submit de jugadores debe validar nuevamente `isPlayerRegistrationOpen()` aunque el boton aparezca deshabilitado.
- Si se cambian las fechas en UI, evitar rangos invertidos.

## Jugadores
- Los jugadores usan `dni`; no puede haber dos jugadores con el mismo DNI.
- La migracion `012_unique_player_dni.sql` crea indice unico parcial para DNI normalizado.
- Tablas de administrador, delegado y veedor deben mostrar DNI.
- Las bajas son logicas con `activo = false`; debe existir opcion para ver bajas y reactivar.

## Equipos y home
- No mostrar datos hardcodeados si ya existen datos de Supabase.
- Los campos publicos de equipo persisten en `equipos`: `abreviatura`, `nombre_corto`, `descripcion`, `color_terciario`.
- Si el delegado modifica `Mi equipo`, el cambio debe guardarse en Supabase y luego recargarse desde Supabase para impactar en home y otras vistas.
- La migracion `013_add_team_public_profile_fields.sql` agrega esos campos.
- La escritura del perfil de equipo delegado debe pasar por `guardar_equipo_delegado`.
- Altas, ediciones, bajas y reactivaciones de jugadores desde delegado deben pasar por RPCs de delegado que validen la relacion `usuarios_app.id -> delegados.usuario_id -> delegados.equipo_id`.

## Roles y navegacion
- No romper los roles existentes: publico, administrador, delegado y veedor.
- Los botones `Salir` de administrador, delegado y veedor deben compartir el mismo comportamiento.
- El delegado no debe quedar recargando o restaurando su propio perfil al salir.
- El menu delegado debe funcionar asi:
  - `Resumen` muestra el resumen.
  - `Mi equipo` muestra perfil del equipo.
  - `Jugadores` muestra tabla de jugadores.

## Confirmaciones
- Altas, ediciones, bajas y reactivaciones deben solicitar confirmacion por modal cuando la accion modifica registros.
- Esto aplica a jugadores de delegado, detalle/observaciones de veedor, resoluciones de administrador, categorias, divisiones, equipos, delegados y veedores.

## RLS y migraciones relevantes
- `006_enable_rls_policies.sql`: politicas base para datos publicos y escritura admin.
- `007_fix_login_profile_resolution.sql`: legado de resolucion usuario/email; no usar para el login actual salvo que una tarea lo pida.
- `008_allow_password_hash_login_lookup.sql`: legado de login con RPC; no es el flujo principal actual.
- `009_grant_login_lookup_select.sql`: permisos necesarios para que la consulta directa de login lea usuarios activos con anon key.
- `010_save_public_settings_rpc.sql`: RPC para guardar `public_settings`.
- `011_authenticated_role_write_policies.sql`: politicas de escritura por rol con Supabase Auth; revisar antes de tocar RLS.
- `012_unique_player_dni.sql`: unicidad de DNI de jugadores.
- `013_add_team_public_profile_fields.sql`: perfil publico extendido de equipos.
- `014_allow_active_delegates_lookup.sql`: lectura de relaciones activas de delegados.
- `015_allow_delegate_admin_status_management.sql`: baja/reactivacion de delegados desde admin.
- `016_save_tournament_settings_rpc.sql`: RPC para guardar `tournament_settings`.
- `022_delegate_profile_write_rpcs.sql`: RPCs para guardar equipo y jugadores desde perfil delegado con login propio.

## Limpieza
- Buscar referencias obsoletas con `localhost`, `127.0.0.1`, `/api`, `fetch(` y `axios` cuando se toque la capa de datos.
- No introducir dependencias del backend local.
- No borrar archivos archivados o migraciones sin confirmacion explicita.

## Publicacion
El sitio se publica como frontend estatico en GitHub Pages desde la raiz del repositorio.
