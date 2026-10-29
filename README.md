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

## Chatbot Fulbito con Gemini

Fulbito usa Gemini exclusivamente desde la Edge Function `fulbito-chat`; la API key nunca se incluye en el frontend.

```powershell
npx.cmd supabase secrets set GEMINI_API_KEY=tu_gemini_api_key GEMINI_MODEL=gemini-3.1-flash-lite
npx.cmd supabase functions deploy fulbito-chat
```

La consulta pública recibe únicamente datos públicos del torneo. La consulta del delegado valida sus credenciales de Frame0 y limita el contexto al equipo que tiene asignado.

## Datos y autenticacion

Las pantallas administrativas usan consultas directas a Supabase:

- `supabase.from("categorias").select/insert/update`
- `supabase.from("divisiones").select/insert/update`
- `supabase.from("veedores").select/insert/update`

Las bajas siguen siendo logicas mediante columnas `activa` o `activo`.

El login de Frame0 llama a la RPC `iniciar_sesion_frame0`, que valida
`usuarios_app.usuario` y la contrasena dentro de Postgres y devuelve solo los datos
minimos del perfil. La anon key no tiene permiso de lectura sobre `usuarios_app` y el
frontend nunca recibe `password_hash`.

Administrador mantiene una sesion de Supabase Auth para las escrituras protegidas por
RLS. Delegado y veedor usan exclusivamente el login propio de Frame0 y las RPCs que
validan `p_usuario` y `p_password`; no intentan crear cuentas `@frame0.local`.

## Fortuna, puntos y vouchers

La migracion `supabase/migrations/031_fortuna_vouchers.sql` agrega las cuentas publicas,
pronosticos, temporadas de puntos, vouchers y el rol `constatador`. Debe aplicarse antes
de publicar el frontend que carga `fortune.js`.

Las cuentas participantes usan Supabase Auth con email y contrasena. En el panel de
Supabase configurar:

- **Authentication > URL Configuration**: Site URL y Redirect URL de GitHub Pages.
- **Authentication > Providers > Email**: habilitar `Confirm email`.
- SMTP propio para confirmaciones y recuperacion de contrasena en produccion.

Administrador, delegado, veedor y constatador conservan el login propio de Frame0. Los
pronosticos cierran en PostgreSQL a las 00:00 del dia del partido en horario argentino; los puntos
y canjes nunca se calculan en el navegador.

`Fortuna` muestra el catalogo publico con stock disponible. `Jugar a Fortuna` abre el ingreso de participantes; al entrar se ve el fixture actual completo y el saldo de la campaña activa. Administradores y superadministradores tambien pueden ingresar en modo constatador con sus mismas credenciales.

### Comprobantes de Fortuna

La migracion `supabase/migrations/20261028000001_fortuna_receipts.sql` agrega una copia de la descripcion al voucher, una cola privada de correos y la consulta paginada de entregas para el constatador. Un comprobante se encola al canjear puntos y otro al confirmar la entrega. Los canjes y las entregas anteriores no generan correos retroactivos.

Para activar el envio, en este orden:

1. Aplicar las migraciones `20261028000000_archive_previous_tournament.sql` y `20261028000001_fortuna_receipts.sql`.
2. Verificar un dominio remitente en Resend. Configurar `RESEND_API_KEY` y `RECEIPT_FROM_EMAIL` como secretos de la Edge Function; nunca en archivos del navegador.
3. Desplegar `enviar-comprobantes-fortuna` con `supabase functions deploy enviar-comprobantes-fortuna --no-verify-jwt`. La funcion valida el bearer de la clave de servicio antes de procesar la cola. Si el secreto integrado `SUPABASE_SERVICE_ROLE_KEY` no coincide con la clave vigente, guardar esta ultima como secreto privado `FRAME0_SERVICE_ROLE_KEY`.
4. Guardar en Supabase Vault los secretos `frame0_project_url` (URL base del proyecto) y `frame0_service_role_key` (clave secreta del servidor). Ejecutar `supabase/cron/fortuna_receipts.sql` para activar el envio cada minuto. No incluir valores secretos en el SQL versionado.
5. Publicar el frontend actualizado. Probar un canje y una entrega con una casilla de correo propia; verificar ambos mensajes, la tabla del constatador y el estado de la cola.

Los envios fallidos se reintentan hasta cinco veces y luego aparecen en `Administrador > Fortuna y vouchers` para revision. La tabla del constatador muestra todas las entregas y solo los ultimos cuatro caracteres del documento. Si un resultado oficial cambia despues de un canje, el voucher permanece valido y el saldo ajustado puede ser negativo; no se permiten nuevos canjes hasta recuperar puntos.

El remitente de prueba `onboarding@resend.dev` solo permite verificar mensajes hacia la casilla de la cuenta Resend. Para envios reales, verificar un dominio propio, actualizar `RECEIPT_FROM_EMAIL` y recien entonces activar `supabase/cron/fortuna_receipts.sql`. Los comprobantes generados mientras el Cron esta desactivado permanecen pendientes en la cola.

## Fixture e historial del torneo

Aplicar `supabase/migrations/20261028000000_archive_previous_tournament.sql`, desplegar las Edge Functions modificadas y después publicar el frontend. El generador arma una rueda completa, invierte la localía en la siguiente y respeta la cantidad de fechas indicada. Solo permite reemplazar partidos programados sin resultados, planillas ni pronósticos vinculados.

En `Administrador > Configuraciones > Generales Torneo`, **Archivar torneo** guarda el fixture, los resultados y los datos necesarios para calcular las posiciones. Los partidos archivados permanecen en Supabase con sus registros vinculados, pero salen de las vistas activas. `Torneo anterior` permite consultar el último archivo sin controles de edición. El archivo se reemplaza al cerrar el torneo siguiente.

## Seguridad y RLS

El frontend esta preparado para trabajar con RLS usando solo la anon key. En Supabase deben existir politicas que permitan:

- Lectura publica de datos visibles del torneo.
- Escritura administrativa mediante RPCs de Frame0 o políticas RLS con la sesión Auth vinculada.
- Acciones de delegado limitadas mediante RPC a su equipo asociado.
- Acciones de veedor limitadas mediante RPC a los partidos que puede gestionar.
- Ninguna lectura anonima directa de `usuarios_app`.

Para operaciones administrativas sensibles, como cambiar contrasenas de otros usuarios, usar el panel de Supabase Auth o una Edge Function segura. Esa operacion no debe hacerse con `service_role_key` desde el navegador.

La migracion `supabase/migrations/006_enable_rls_policies.sql` agrega una base de politicas:

- lectura publica para datos visibles del torneo;
- escritura para usuarios autenticados con rol `admin` o `superadmin`;
- lectura del perfil propio para usuarios autenticados.
- una RPC `resolve_login_profile(login_usuario)` para resolver usuario visible a email interno sin exponer lectura anonima completa de `usuarios_app`.

La migracion `supabase/migrations/028_secure_frame0_login.sql` revoca los permisos
anonimos heredados, deshabilita el login legado que devolvia `password_hash` y agrega
las RPCs seguras usadas por el frontend. Debe aplicarse antes de publicar esta version.

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
