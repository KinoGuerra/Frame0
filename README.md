# Frame0

Frontend estatico para una plataforma de torneos amateur de futbol. El sitio usa HTML5, CSS3, Bootstrap 5, Bootstrap Icons, JavaScript vanilla y Supabase como fuente unica de datos, autenticacion y almacenamiento.

## Arquitectura actual

- `index.html`: estructura principal, modales y carga de dependencias CDN.
- `styles.css`: estilos visuales, responsive, dark mode y componentes.
- `script.js`: navegacion, roles, renderizados dinamicos y logica de interaccion.
- `supabaseClient.js`: configuracion publica del cliente Supabase.
- `apiClient.js`: adaptador de datos que reemplaza la antigua API local y ejecuta operaciones directas con `supabase-js`.
- `supabase/migrations/`: estructura SQL inicial del proyecto.
- `deprecated-backend/`: backend Express anterior, conservado solo como referencia historica.

## Configuracion de Supabase

Frame0 es HTML/JS plano, por lo que no usa variables `VITE_*`. Configurar las claves publicas en `supabaseClient.js`:

```js
const SUPABASE_URL = "https://tu-proyecto.supabase.co";
const SUPABASE_ANON_KEY = "tu-anon-key";
```

No colocar `service_role_key` en el frontend. Esa clave es privada y solo debe usarse en entornos seguros de servidor o Edge Functions.

## Reporteria IA

La pantalla `Administrador > Reporteria IA` usa una Supabase Edge Function para generar reportes ejecutivos del torneo sin exponer claves privadas en GitHub Pages.

Configurar secretos en Supabase:

```bash
supabase secrets set GROQ_API_KEY=tu_groq_api_key
supabase secrets set GROQ_MODEL=openai/gpt-oss-20b
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Desplegar la funcion:

```bash
supabase functions deploy generate-ai-report
```

Si `GROQ_API_KEY` no existe, se supera el limite gratuito o Groq responde error, la funcion devuelve un reporte basico por reglas locales usando los mismos datos de Supabase.

Si la pantalla muestra `Failed to send a request to the Edge Function`, revisar:

- que `generate-ai-report` este desplegada;
- que el proyecto Supabase sea el mismo configurado en `supabaseClient.js`;
- que los secretos esten cargados;
- que la funcion responda a `OPTIONS` y `POST`.

## Datos y autenticacion

Las pantallas administrativas usan consultas directas a Supabase:

- `supabase.from("categorias").select/insert/update`
- `supabase.from("divisiones").select/insert/update`
- `supabase.from("usuarios_app").select/insert/update`
- `supabase.from("veedores").select/insert/update`
- `supabase.auth.signUp` y `supabase.auth.signInWithPassword` para veedores nuevos.

Las bajas siguen siendo logicas mediante columnas `activa` o `activo`.

Para ingresar como administrador, el usuario visible puede ser `admin` o
`admin@frame0.local`, sin importar mayusculas o minusculas. El frontend primero resuelve
el perfil por `usuarios_app.usuario = 'admin'` y luego autentica contra Supabase Auth con
`admin@frame0.local`, porque Supabase Auth requiere formato email. Debe existir ese
usuario en Auth y un perfil activo en `usuarios_app` con rol `admin` o `superadmin`.
No se valida manualmente contra `password_hash` cuando el login usa Supabase Auth.

## Seguridad y RLS

El frontend esta preparado para trabajar con RLS usando solo la anon key. En Supabase deben existir politicas que permitan:

- Lectura publica de datos visibles del torneo.
- Escritura administrativa solo para usuarios autenticados con rol permitido.
- Acciones de delegado limitadas al usuario autenticado y a su equipo asociado.
- Acciones de veedor limitadas a partidos y registros que pueda gestionar.

Para operaciones administrativas sensibles, como cambiar contrasenas de otros usuarios, usar el panel de Supabase Auth o una Edge Function segura. Esa operacion no debe hacerse con `service_role_key` desde el navegador.

La migracion `supabase/migrations/006_enable_rls_policies.sql` agrega una base de politicas:

- lectura publica para datos visibles del torneo;
- escritura para usuarios autenticados con rol `admin` o `superadmin`;
- lectura del perfil propio para usuarios autenticados.
- una RPC `resolve_login_profile(login_usuario)` para resolver usuario visible a email interno sin exponer lectura anonima completa de `usuarios_app`.

Si `006_enable_rls_policies.sql` ya estaba aplicada, aplicar tambien
`supabase/migrations/007_fix_login_profile_resolution.sql`, que actualiza la resolucion
`usuario -> auth_email` para el login con `admin`.

## Diario Noticias IA

El administrador usa el login propio de `usuarios_app` y la Edge Function valida esas credenciales internamente. Después de modificarla, desplegar sin verificación JWT del gateway:

```powershell
npx.cmd supabase functions deploy generate-sports-diary --no-verify-jwt
```

Secrets requeridos: `GROQ_API_KEY`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`. `GROQ_MODEL` es opcional. Ninguna clave privada debe incluirse en el frontend.

## Desarrollo local

Abrir `index.html` directamente o publicar desde la raiz del repositorio en GitHub Pages. No hace falta iniciar un backend local.

Validar JavaScript con:

```bash
node --check script.js
```
