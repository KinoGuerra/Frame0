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

## Desarrollo local

Abrir `index.html` directamente o publicar desde la raiz del repositorio en GitHub Pages. No hace falta iniciar un backend local.

Validar JavaScript con:

```bash
node --check script.js
```
