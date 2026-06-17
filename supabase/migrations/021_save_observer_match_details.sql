-- Guarda el detalle cargado por veedor/admin y persiste estadisticas oficiales.

create index if not exists goles_partido_id_idx on public.goles(partido_id);
create index if not exists goles_jugador_id_idx on public.goles(jugador_id);
create index if not exists tarjetas_partido_id_idx on public.tarjetas(partido_id);
create index if not exists tarjetas_jugador_id_idx on public.tarjetas(jugador_id);
create index if not exists sanciones_jugador_id_idx on public.sanciones(jugador_id);
create index if not exists sanciones_partido_id_idx on public.sanciones(partido_id);

grant select on table public.goles to anon, authenticated;
grant select on table public.tarjetas to anon, authenticated;
grant select on table public.sanciones to anon, authenticated;

create or replace function public.guardar_detalle_partido_veedor(
  p_usuario text,
  p_password text,
  p_partido_id uuid,
  p_goles_local integer,
  p_goles_visitante integer,
  p_incidencias jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_partido public.partidos%rowtype;
  v_item jsonb;
  v_jugador_id uuid;
  v_equipo_id uuid;
  v_goles integer;
  v_amarillas integer;
  v_rojas integer;
  v_observacion text;
begin
  select *
  into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found then
    raise exception 'Usuario no encontrado o inactivo.';
  end if;

  if v_usuario.rol not in ('veedor', 'admin', 'superadmin') then
    raise exception 'Rol no autorizado para guardar detalle de partido.';
  end if;

  if coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
    raise exception 'Contrasena incorrecta.';
  end if;

  select *
  into v_partido
  from public.partidos
  where id = p_partido_id
  for update;

  if not found then
    raise exception 'Partido no encontrado.';
  end if;

  if jsonb_typeof(coalesce(p_incidencias, '[]'::jsonb)) <> 'array' then
    raise exception 'p_incidencias debe ser un array JSON.';
  end if;

  update public.partidos
  set
    goles_local = greatest(coalesce(p_goles_local, 0), 0),
    goles_visitante = greatest(coalesce(p_goles_visitante, 0), 0),
    estado = 'finalizado'
  where id = p_partido_id;

  delete from public.goles
  where partido_id = p_partido_id;

  delete from public.tarjetas
  where partido_id = p_partido_id;

  delete from public.sanciones
  where partido_id = p_partido_id
    and fechas_suspension = 0;

  for v_item in
    select value
    from jsonb_array_elements(coalesce(p_incidencias, '[]'::jsonb))
  loop
    v_jugador_id := nullif(v_item ->> 'jugador_id', '')::uuid;
    v_equipo_id := nullif(v_item ->> 'equipo_id', '')::uuid;
    v_goles := greatest(coalesce(nullif(v_item ->> 'goles', '')::integer, 0), 0);
    v_amarillas := greatest(coalesce(nullif(v_item ->> 'amarillas', '')::integer, 0), 0);
    v_rojas := greatest(coalesce(nullif(v_item ->> 'rojas', '')::integer, 0), 0);
    v_observacion := trim(coalesce(v_item ->> 'observacion', ''));

    if v_jugador_id is null or v_equipo_id is null then
      continue;
    end if;

    if v_equipo_id not in (v_partido.equipo_local_id, v_partido.equipo_visitante_id) then
      raise exception 'El equipo de una incidencia no pertenece al partido.';
    end if;

    if not exists (
      select 1
      from public.jugadores j
      where j.id = v_jugador_id
        and j.equipo_id = v_equipo_id
        and j.equipo_id in (v_partido.equipo_local_id, v_partido.equipo_visitante_id)
    ) then
      raise exception 'Un jugador informado no pertenece a los equipos del partido.';
    end if;

    insert into public.goles (partido_id, jugador_id, equipo_id, tipo)
    select p_partido_id, v_jugador_id, v_equipo_id, 'normal'
    from generate_series(1, v_goles);

    insert into public.tarjetas (partido_id, jugador_id, equipo_id, tipo)
    select p_partido_id, v_jugador_id, v_equipo_id, 'amarilla'
    from generate_series(1, v_amarillas);

    insert into public.tarjetas (partido_id, jugador_id, equipo_id, tipo)
    select p_partido_id, v_jugador_id, v_equipo_id, 'roja'
    from generate_series(1, v_rojas);

    if v_observacion <> '' then
      insert into public.sanciones (jugador_id, partido_id, motivo, fechas_suspension, cumplida)
      values (v_jugador_id, p_partido_id, v_observacion, 0, false);
    end if;
  end loop;
end;
$$;

revoke all on function public.guardar_detalle_partido_veedor(text, text, uuid, integer, integer, jsonb) from public;
grant execute on function public.guardar_detalle_partido_veedor(text, text, uuid, integer, integer, jsonb) to anon, authenticated;
