# Frame0 - Guía para agentes

## Contexto
Frame0 es un frontend estático para una plataforma de torneos amateur de fútbol. Usa HTML5, CSS3, Bootstrap 5, Bootstrap Icons, JavaScript vanilla y Supabase como fuente de datos.

El sitio se publica desde la raíz del repositorio en GitHub Pages. Debe funcionar sin build system y sin backend local.

## Arquitectura
- `index.html`: estructura principal, modales y dependencias CDN.
- `styles.css`: estilos visuales, responsive, dark mode y componentes.
- `script.js`: navegación, roles, renderizado dinámico, login y lógica de interacción.
- `supabaseClient.js`: conexión pública del navegador a Supabase con `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
- `apiClient.js`: adaptador de datos directo a Supabase. No debe llamar a un backend local.
- `supabase/migrations/`: migraciones SQL, RLS y permisos.
- `assets/`: logos, escudos, SVG e imágenes.
- `deprecated-backend/`: backend Express archivado solo como referencia histórica.

## Reglas generales
- Mantener separados HTML, CSS y JavaScript.
- No agregar frameworks, bundlers ni package managers sin necesidad explícita.
- Conservar rutas relativas compatibles con GitHub Pages.
- No modificar estilos visuales salvo que la tarea lo pida o sea imprescindible.
- Evitar cambios amplios: preferir ediciones pequeñas y localizadas.
- No reactivar ni depender de `deprecated-backend/`.
- Validar JavaScript con `node --check script.js`; si se toca `apiClient.js`, validar también `node --check apiClient.js`.

## Supabase
- Usar solo anon key / publishable key en frontend.
- No usar `service_role_key` ni secretos privados en archivos del navegador.
- Las lecturas/escrituras deben usar `supabase-js` directo: `from().select()`, `insert()`, `update()`, `delete()` o `upsert()`.
- Mantener RLS y grants sincronizados con el flujo real de la UI.
- Para cambios de login o permisos, revisar y actualizar migraciones nuevas en `supabase/migrations/`.

## Login actual
El login admin/delegado usa la tabla `public.usuarios_app`, no Supabase Auth.

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
- No buscar en otra tabla.
- Comparar la contraseña ingresada contra `data.password_hash`.
- Usar `data.rol`, `data.nombre` y `data.id` para continuar el flujo.
- Admin acepta `rol = admin` o `rol = superadmin`.
- Delegado acepta `rol = delegado`.
- Mantener logs temporales mientras se depura: `usuarioLimpio`, `data usuarios_app`, `error usuarios_app`, y URL de Supabase si ayuda.
- Si el usuario existe pero `data` llega `null`, revisar que estén aplicados los grants/RLS de login, especialmente `supabase/migrations/009_grant_login_lookup_select.sql`.

## Configuraciones públicas
- `Administrador > Configuraciones > Redes y Contacto` guarda en `configuraciones` con clave `public_settings`.
- Al guardar, debe actualizar Supabase y refrescar la landing pública en la misma sesión.
- Al cargar la página, `script.js` debe leer `public_settings` desde Supabase y aplicar esos valores.

## Roles y navegación
- No romper los roles existentes: público, administrador, delegado y veedor.
- Los botones `Salir` de administrador, delegado y veedor deben compartir el mismo comportamiento.
- El delegado no debe quedar recargando o restaurando su propio perfil al salir.

## RLS y migraciones relevantes
- `006_enable_rls_policies.sql`: políticas base para datos públicos y escritura admin.
- `007_fix_login_profile_resolution.sql`: legado de resolución usuario/email; no usar para el login actual salvo que una tarea lo pida.
- `008_allow_password_hash_login_lookup.sql`: legado de login con RPC; no es el flujo principal actual.
- `009_grant_login_lookup_select.sql`: permisos necesarios para que la consulta directa de login lea usuarios activos con anon key.

## Limpieza
- Buscar referencias obsoletas con `localhost`, `127.0.0.1`, `/api`, `fetch(` y `axios` cuando se toque la capa de datos.
- No introducir dependencias del backend local.
- No borrar archivos archivados o migraciones sin confirmación explícita.

## Publicación
El sitio se publica como frontend estático en GitHub Pages desde la raíz del repositorio.
