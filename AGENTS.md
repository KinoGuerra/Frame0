# Frame0 - Guia para agentes

## Contexto del proyecto
Frame0 es un frontend estatico para una plataforma de torneos amateur de futbol. El proyecto usa HTML5, CSS3, Bootstrap 5, Bootstrap Icons, JavaScript vanilla y Supabase como fuente unica de datos, autenticacion y almacenamiento.

El sitio debe seguir funcionando como frontend estatico publicado desde la raiz del repositorio en GitHub Pages. No requiere backend local para ejecutarse.

## Arquitectura actual
- El frontend consulta Supabase directamente con `supabase-js` cargado por CDN.
- `supabaseClient.js` centraliza la configuracion publica de Supabase.
- `apiClient.js` es un adaptador de datos compatible con la UI existente, pero no debe llamar a APIs locales ni usar `fetch()` hacia un backend propio.
- `supabase/migrations/` contiene la estructura SQL y datos iniciales del proyecto.
- `deprecated-backend/` conserva el backend Express anterior solo como referencia historica. No agregar nuevas dependencias ni nuevas llamadas hacia esa carpeta.

## Archivos principales
- `index.html`: estructura principal, modales y carga de dependencias CDN.
- `styles.css`: estilos visuales, responsive, dark mode y componentes.
- `script.js`: datos demo, navegacion, roles, renderizados dinamicos y logica de interaccion.
- `supabaseClient.js`: cliente Supabase del navegador. Solo debe usar `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
- `apiClient.js`: consultas directas a Supabase para categorias, divisiones, usuarios, veedores y otros modulos que se migren.
- `assets/`: logos, escudos, SVG e imagenes usadas por la interfaz.
- `README.md`: documentacion de arquitectura y configuracion.

## Reglas de trabajo
- Mantener separados HTML, CSS y JavaScript.
- No agregar frameworks ni build system sin necesidad.
- Conservar rutas relativas para que funcione en GitHub Pages.
- Validar cambios de JavaScript con `node --check script.js`.
- Evitar romper el comportamiento existente de roles: publico, administrador, delegado y veedor.
- Cuidar contraste en modo claro y dark mode.
- No modificar estilos visuales salvo que sea necesario para la tarea.
- No reactivar ni depender del backend local archivado.

## Supabase
- Usar siempre la anon key / publishable key en el frontend.
- No usar `service_role_key` en archivos del frontend.
- No hardcodear secretos privados.
- Preparar consultas para funcionar con Row Level Security (RLS).
- El login administrador debe aceptar el usuario visible `admin` o `admin@frame0.local`, sin distinguir mayusculas/minusculas. Primero se resuelve por `usuarios_app.usuario`; luego se usa `admin@frame0.local` para Supabase Auth.
- El perfil administrador debe estar activo en `usuarios_app` con rol `admin` o `superadmin`.
- No validar manualmente `password_hash` cuando el login usa Supabase Auth.
- Para probar escrituras, aplicar las migraciones RLS, incluidas `supabase/migrations/006_enable_rls_policies.sql` y `supabase/migrations/007_fix_login_profile_resolution.sql`, en el proyecto Supabase remoto.
- Para datos visibles publicamente, usar consultas de lectura directas con `supabase.from("tabla").select()`.
- Para altas, bajas logicas y ediciones, usar `insert()`, `update()` y, solo cuando corresponda, `delete()`.
- Las operaciones de delegado deben depender del usuario autenticado y de su equipo asociado.
- Operaciones sensibles de Auth Admin, como cambiar contrasenas de otros usuarios, deben resolverse fuera del navegador mediante Supabase Dashboard o Edge Functions seguras.

## Backend deprecado
- `deprecated-backend/` no forma parte del flujo activo de la aplicacion.
- No moverlo, borrarlo ni reutilizarlo sin confirmacion explicita.
- Si se toma como referencia, migrar la logica al frontend con Supabase o a una Edge Function segura segun corresponda.

## Estilo de codigo
- Usar nombres descriptivos para clases, funciones y atributos `data-*`.
- Priorizar cambios pequenos y localizados.
- Reutilizar componentes visuales existentes antes de crear nuevos patrones.
- Mantener el diseno responsive.
- Agregar comentarios solo cuando aclaren una decision no evidente.

## Limpieza y validacion
- Buscar referencias obsoletas con terminos como `localhost`, `127.0.0.1`, `/api`, `fetch(` y `axios` cuando se toque la capa de datos.
- Revisar que no se introduzcan dependencias de backend local.
- Despues de cambios JavaScript, ejecutar `node --check script.js`.

## Publicacion
El sitio se publica como frontend estatico en GitHub Pages desde la raiz del repositorio.
