-- ============================================================
-- FRAME0 - LOGIN PROPIO SIN EXPONER usuarios_app
-- Valida credenciales dentro de Postgres y devuelve solo el
-- perfil minimo que necesita la interfaz.
-- ============================================================

alter table public.usuarios_app enable row level security;

revoke select, update on table public.usuarios_app from anon;
revoke update on table public.delegados from anon;

drop policy if exists "login_legacy_usuarios_activos" on public.usuarios_app;
drop policy if exists "login_usuarios_app_activos_anon" on public.usuarios_app;
drop policy if exists "gestion_delegados_usuarios_anon" on public.usuarios_app;
drop policy if exists "actualiza_delegados_usuarios_anon" on public.usuarios_app;
drop policy if exists "actualiza_delegados_todos_anon" on public.delegados;

revoke all on function public.login_legacy_profile(text) from public, anon, authenticated;

create or replace function public.iniciar_sesion_frame0(
  p_usuario text,
  p_password text
)
returns table (
  id uuid,
  nombre text,
  apellido text,
  documento text,
  contacto text,
  usuario text,
  rol text,
  activo boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    ua.id,
    ua.nombre,
    ua.apellido,
    ua.documento,
    ua.contacto,
    ua.usuario,
    ua.rol,
    ua.activo
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(
    case
      when position('@' in coalesce(p_usuario, '')) > 0
        then split_part(p_usuario, '@', 1)
      else coalesce(p_usuario, '')
    end
  ))
    and ua.activo = true
    and coalesce(ua.password_hash, '') = trim(coalesce(p_password, ''))
  limit 1
$$;

revoke all on function public.iniciar_sesion_frame0(text, text) from public;
grant execute on function public.iniciar_sesion_frame0(text, text) to anon, authenticated;

create or replace function public.obtener_delegados_publicos(
  p_equipo_ids uuid[]
)
returns table (
  equipo_id uuid,
  nombre text,
  contacto text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    d.equipo_id,
    coalesce(nullif(trim(concat_ws(' ', ua.nombre, ua.apellido)), ''), ua.usuario, '-') as nombre,
    coalesce(nullif(trim(ua.contacto), ''), '-') as contacto
  from public.delegados d
  join public.usuarios_app ua on ua.id = d.usuario_id
  join public.equipos e on e.id = d.equipo_id
  where d.activo = true
    and ua.activo = true
    and e.activo = true
    and d.equipo_id = any(coalesce(p_equipo_ids, array[]::uuid[]))
$$;

revoke all on function public.obtener_delegados_publicos(uuid[]) from public;
grant execute on function public.obtener_delegados_publicos(uuid[]) to anon, authenticated;

do $$
begin
  if has_table_privilege('anon', 'public.usuarios_app', 'select')
    or has_table_privilege('anon', 'public.usuarios_app', 'update') then
    raise exception 'usuarios_app conserva permisos anonimos directos.';
  end if;

  if has_function_privilege('anon', 'public.login_legacy_profile(text)', 'execute') then
    raise exception 'login_legacy_profile continua expuesto al rol anon.';
  end if;
end
$$;
