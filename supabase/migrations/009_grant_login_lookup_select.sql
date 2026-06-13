-- ============================================================
-- FRAME0 - PERMISOS EXPLICITOS PARA LOGIN POR usuarios_app
-- Necesario para que la consulta frontend:
--   from("usuarios_app").select("*").ilike("usuario", ...).eq("activo", true)
-- pueda ver usuarios activos con anon key.
-- ============================================================

grant usage on schema public to anon, authenticated;
grant select on table public.usuarios_app to anon, authenticated;

alter table public.usuarios_app enable row level security;

drop policy if exists "login_usuarios_app_activos_anon" on public.usuarios_app;
create policy "login_usuarios_app_activos_anon"
on public.usuarios_app
for select
to anon, authenticated
using (activo = true);
