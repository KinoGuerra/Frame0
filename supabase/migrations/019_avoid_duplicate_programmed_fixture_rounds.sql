-- Evita duplicar fechas del fixture cuando ya existen partidos reales.
-- Si una division ya tiene partidos finalizados/suspendidos para una Fecha N,
-- no se deben mostrar ni volver a crear partidos programados para esa misma fecha.

delete from public.partidos p
where p.estado = 'programado'
  and substring(lower(coalesce(p.observaciones, '')) from 'fecha[[:space:]]*([0-9]+)') is not null
  and exists (
    select 1
    from public.partidos real
    where real.division_id = p.division_id
      and real.estado <> 'programado'
      and substring(lower(coalesce(real.observaciones, '')) from 'fecha[[:space:]]*([0-9]+)') =
        substring(lower(coalesce(p.observaciones, '')) from 'fecha[[:space:]]*([0-9]+)')
  );

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
  where division_id = p_division_id
    and estado = 'programado';

  with incoming as (
    select
      coalesce(nullif(item ->> 'fecha', ''), '1') as fecha_num,
      (item ->> 'equipo_local_id')::uuid as equipo_local_id,
      (item ->> 'equipo_visitante_id')::uuid as equipo_visitante_id,
      nullif(item ->> 'fecha_hora', '')::timestamptz as fecha_hora
    from jsonb_array_elements(coalesce(p_partidos, '[]'::jsonb)) as item
    where (item ->> 'equipo_local_id') is not null
      and (item ->> 'equipo_visitante_id') is not null
      and (item ->> 'equipo_local_id') <> (item ->> 'equipo_visitante_id')
  )
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
    i.equipo_local_id,
    i.equipo_visitante_id,
    i.fecha_hora,
    0,
    0,
    'programado',
    'Fecha ' || i.fecha_num
  from incoming i
  where not exists (
    select 1
    from public.partidos real
    where real.division_id = p_division_id
      and real.estado <> 'programado'
      and substring(lower(coalesce(real.observaciones, '')) from 'fecha[[:space:]]*([0-9]+)') = i.fecha_num
  );

  get diagnostics v_insertados = row_count;
  return v_insertados;
end;
$$;

revoke all on function public.guardar_fixture_partidos(text, text, uuid, jsonb) from public;
grant execute on function public.guardar_fixture_partidos(text, text, uuid, jsonb) to anon, authenticated;
