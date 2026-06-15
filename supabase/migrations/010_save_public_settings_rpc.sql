-- ============================================================
-- FRAME0 - GUARDADO SEGURO DE CONFIGURACIÓN PÚBLICA
-- Permite al frontend estatico guardar public_settings sin abrir
-- escritura anónima directa sobre toda la tabla configuraciones.
-- ============================================================

create or replace function public.guardar_configuracion_publica(
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
    raise exception 'Rol no autorizado para guardar configuraciones públicas.';
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
    'public_settings',
    coalesce(p_valor, '{}'::jsonb),
    'Redes, contacto, ubicación y reglamento público de Frame0.',
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

revoke all on function public.guardar_configuracion_publica(text, text, jsonb) from public;
grant execute on function public.guardar_configuracion_publica(text, text, jsonb) to anon, authenticated;
