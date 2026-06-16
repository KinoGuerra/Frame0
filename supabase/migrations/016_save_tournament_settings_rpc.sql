-- Guarda la configuración general del torneo desde el frontend estático.
-- Usa el login propio de Frame0 sobre usuarios_app y no requiere service_role.

create or replace function public.guardar_configuracion_torneo(
  p_usuario text,
  p_password text,
  p_valor jsonb
)
returns public.configuraciones
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_configuracion public.configuraciones%rowtype;
begin
  select *
  into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found then
    raise exception 'Usuario administrador no encontrado o inactivo.';
  end if;

  if v_usuario.rol not in ('admin', 'superadmin') then
    raise exception 'Rol no autorizado para guardar configuración del torneo.';
  end if;

  if coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
    raise exception 'Contraseña incorrecta.';
  end if;

  insert into public.configuraciones as configuracion (
    clave,
    valor,
    descripcion,
    activa,
    updated_at
  )
  values (
    'tournament_settings',
    coalesce(p_valor, '{}'::jsonb),
    'Fechas y configuración general del torneo Frame0.',
    true,
    now()
  )
  on conflict (clave) do update
  set
    valor = excluded.valor,
    descripcion = excluded.descripcion,
    activa = true,
    updated_at = now()
  returning *
  into v_configuracion;

  return v_configuracion;
end;
$$;

revoke all on function public.guardar_configuracion_torneo(text, text, jsonb) from public;
grant execute on function public.guardar_configuracion_torneo(text, text, jsonb) to anon, authenticated;
