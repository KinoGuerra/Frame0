-- Reemplaza por completo el fixture existente de una division.
-- Al generar un nuevo fixture, se borran todos los partidos de esa division
-- y se crean nuevamente desde el panel administrador.

create or replace function public.guardar_fixture_partidos(
  p_usuario text,
  p_password text,
  p_division_id uuid,
  p_partidos jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_insertados integer := 0;
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
    raise exception 'Rol no autorizado para guardar fixture.';
  end if;

  if coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
    raise exception 'Contrasena incorrecta.';
  end if;

  if p_division_id is null then
    raise exception 'Falta division_id.';
  end if;

  if jsonb_typeof(coalesce(p_partidos, '[]'::jsonb)) <> 'array' then
    raise exception 'p_partidos debe ser un array JSON.';
  end if;

  delete from public.partidos
  where division_id = p_division_id;

  insert into public.partidos (
    division_id,
    equipo_local_id,
    equipo_visitante_id,
    fecha_hora,
    goles_local,
    goles_visitante,
    estado,
    observaciones
  )
  select
    p_division_id,
    (item ->> 'equipo_local_id')::uuid,
    (item ->> 'equipo_visitante_id')::uuid,
    nullif(item ->> 'fecha_hora', '')::timestamptz,
    0,
    0,
    'programado',
    'Fecha ' || coalesce(nullif(item ->> 'fecha', ''), '1')
  from jsonb_array_elements(coalesce(p_partidos, '[]'::jsonb)) as item
  where (item ->> 'equipo_local_id') is not null
    and (item ->> 'equipo_visitante_id') is not null
    and (item ->> 'equipo_local_id') <> (item ->> 'equipo_visitante_id');

  get diagnostics v_insertados = row_count;
  return v_insertados;
end;
$$;

revoke all on function public.guardar_fixture_partidos(text, text, uuid, jsonb) from public;
grant execute on function public.guardar_fixture_partidos(text, text, uuid, jsonb) to anon, authenticated;
