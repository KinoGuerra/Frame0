-- ============================================================
-- FRAME0 - LOGIN LEGACY POR usuarios_app.password_hash
-- Permite que el frontend con anon key consulte usuarios activos
-- para validar usuario/password_hash en el navegador.
-- ============================================================

alter table public.usuarios_app enable row level security;

create or replace function public.login_legacy_profile(login_usuario text)
returns table (
  id uuid,
  nombre text,
  usuario text,
  rol text,
  activo boolean,
  password_hash text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ua.id,
    ua.nombre,
    ua.usuario,
    ua.rol,
    ua.activo,
    ua.password_hash
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(
    case
      when position('@' in coalesce(login_usuario, '')) > 0
        then split_part(login_usuario, '@', 1)
      else coalesce(login_usuario, '')
    end
  ))
    and ua.activo = true
  limit 1
$$;

grant execute on function public.login_legacy_profile(text) to anon, authenticated;

drop policy if exists "login_legacy_usuarios_activos" on public.usuarios_app;
create policy "login_legacy_usuarios_activos"
on public.usuarios_app for select
to anon, authenticated
using (activo = true);
