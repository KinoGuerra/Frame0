-- Persiste resoluciones administrativas sobre observaciones cargadas por veedor.

alter table public.sanciones
  add column if not exists resolucion_detalle text,
  add column if not exists estado_jugador text,
  add column if not exists resuelta_por uuid references public.usuarios_app(id) on delete set null,
  add column if not exists resuelta_at timestamptz,
  add column if not exists notificada_delegado boolean not null default false,
  add column if not exists notificada_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'sanciones_estado_jugador_check'
      and conrelid = 'public.sanciones'::regclass
  ) then
    alter table public.sanciones
      add constraint sanciones_estado_jugador_check
      check (
        estado_jugador is null
        or estado_jugador in ('Habilitado', 'Inhabilitado', 'Suspendido')
      );
  end if;
end;
$$;

create index if not exists sanciones_partido_jugador_idx on public.sanciones(partido_id, jugador_id);
create index if not exists sanciones_resuelta_at_idx on public.sanciones(resuelta_at);

grant select on table public.sanciones to anon, authenticated;

create or replace function public.resolver_observacion_jugador_admin(
  p_usuario text,
  p_password text,
  p_sancion_id uuid,
  p_resolucion_detalle text,
  p_fechas_suspension integer,
  p_estado_jugador text
)
returns public.sanciones
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_sancion public.sanciones%rowtype;
  v_estado text;
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
    raise exception 'Rol no autorizado para resolver observaciones.';
  end if;

  if coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
    raise exception 'Contrasena incorrecta.';
  end if;

  v_estado := trim(coalesce(p_estado_jugador, ''));

  if v_estado not in ('Habilitado', 'Inhabilitado', 'Suspendido') then
    raise exception 'Estado de jugador invalido.';
  end if;

  select *
  into v_sancion
  from public.sanciones
  where id = p_sancion_id
  for update;

  if not found then
    raise exception 'Observacion disciplinaria no encontrada.';
  end if;

  update public.sanciones
  set
    resolucion_detalle = nullif(trim(coalesce(p_resolucion_detalle, '')), ''),
    fechas_suspension = greatest(coalesce(p_fechas_suspension, 0), 0),
    estado_jugador = v_estado,
    cumplida = (v_estado = 'Habilitado'),
    resuelta_por = v_usuario.id,
    resuelta_at = now(),
    notificada_delegado = false,
    notificada_at = null
  where id = p_sancion_id
  returning * into v_sancion;

  return v_sancion;
end;
$$;

revoke all on function public.resolver_observacion_jugador_admin(text, text, uuid, text, integer, text) from public;
grant execute on function public.resolver_observacion_jugador_admin(text, text, uuid, text, integer, text) to anon, authenticated;

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
    and resuelta_at is null;

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

    if v_observacion <> '' and not exists (
      select 1
      from public.sanciones s
      where s.partido_id = p_partido_id
        and s.jugador_id = v_jugador_id
        and s.resuelta_at is not null
    ) then
      insert into public.sanciones (jugador_id, partido_id, motivo, fechas_suspension, cumplida)
      values (v_jugador_id, p_partido_id, v_observacion, 0, false);
    end if;
  end loop;
end;
$$;

revoke all on function public.guardar_detalle_partido_veedor(text, text, uuid, integer, integer, jsonb) from public;
grant execute on function public.guardar_detalle_partido_veedor(text, text, uuid, integer, integer, jsonb) to anon, authenticated;
