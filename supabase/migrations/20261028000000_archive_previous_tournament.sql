-- Conserva solo el torneo inmediato anterior como consulta publica.
-- Los partidos archivados permanecen en la base para no borrar incidencias ni pronosticos.

alter table public.partidos
  add column if not exists archivado boolean not null default false;

create index if not exists partidos_division_archivado_idx
  on public.partidos (division_id, archivado);

create table if not exists public.torneo_anterior (
  id smallint primary key default 1 check (id = 1),
  nombre text not null check (length(trim(nombre)) between 1 and 80),
  archivado_en timestamptz not null default now(),
  datos jsonb not null
);

alter table public.torneo_anterior enable row level security;
revoke all on public.torneo_anterior from public, anon, authenticated;
grant select on public.torneo_anterior to anon, authenticated;

drop policy if exists lectura_publica_torneo_anterior on public.torneo_anterior;
create policy lectura_publica_torneo_anterior
  on public.torneo_anterior for select to anon, authenticated using (true);

create or replace function public.impedir_cambio_partido_archivado()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.archivado then
    raise exception 'Un partido archivado no se puede modificar ni eliminar.';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists impedir_cambio_partido_archivado on public.partidos;
create trigger impedir_cambio_partido_archivado
  before update or delete on public.partidos
  for each row execute function public.impedir_cambio_partido_archivado();

create or replace function public.impedir_cambio_incidencia_archivada()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_anterior uuid;
  v_nuevo uuid;
begin
  if tg_op = 'INSERT' then
    v_nuevo := new.partido_id;
  elsif tg_op = 'DELETE' then
    v_anterior := old.partido_id;
  else
    v_anterior := old.partido_id;
    v_nuevo := new.partido_id;
  end if;

  if exists (select 1 from public.partidos where id in (v_anterior, v_nuevo) and archivado = true) then
    raise exception 'Los registros de un partido archivado son de solo lectura.';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists impedir_cambio_gol_archivado on public.goles;
create trigger impedir_cambio_gol_archivado before insert or update or delete on public.goles
  for each row execute function public.impedir_cambio_incidencia_archivada();
drop trigger if exists impedir_cambio_tarjeta_archivada on public.tarjetas;
create trigger impedir_cambio_tarjeta_archivada before insert or update or delete on public.tarjetas
  for each row execute function public.impedir_cambio_incidencia_archivada();
drop trigger if exists impedir_cambio_sancion_archivada on public.sanciones;
create trigger impedir_cambio_sancion_archivada before insert or update or delete on public.sanciones
  for each row execute function public.impedir_cambio_incidencia_archivada();
drop trigger if exists impedir_cambio_planilla_archivada on public.planillas_partido;
create trigger impedir_cambio_planilla_archivada before insert or update or delete on public.planillas_partido
  for each row execute function public.impedir_cambio_incidencia_archivada();
drop trigger if exists impedir_cambio_pronostico_archivado on public.pronosticos_fortuna;
create trigger impedir_cambio_pronostico_archivado before insert or update or delete on public.pronosticos_fortuna
  for each row execute function public.impedir_cambio_incidencia_archivada();

create or replace function public.archivar_torneo_actual(
  p_usuario text,
  p_password text,
  p_nombre text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_datos jsonb;
begin
  select * into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found or v_usuario.rol not in ('admin', 'superadmin')
    or not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Credenciales de administrador invalidas.';
  end if;

  if length(trim(coalesce(p_nombre, ''))) not between 1 and 80 then
    raise exception 'Ingresá un nombre de torneo de entre 1 y 80 caracteres.';
  end if;

  -- Serializa el cierre con la regeneracion del fixture.
  perform pg_catalog.pg_advisory_xact_lock(106081, 0);
  perform id from public.partidos where archivado = false for update;

  if not exists (select 1 from public.partidos where archivado = false) then
    raise exception 'No hay partidos del torneo actual para archivar.';
  end if;

  if exists (select 1 from public.temporadas_fortuna where estado <> 'cerrada') then
    raise exception 'Cerrá las temporadas de Fortuna abiertas antes de archivar el torneo.';
  end if;

  v_datos := jsonb_build_object(
    'categorias', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'nombre', nombre) order by nombre), '[]'::jsonb) from public.categorias),
    'divisiones', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'categoria_id', categoria_id, 'nombre', nombre) order by nombre), '[]'::jsonb) from public.divisiones),
    'equipos', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'division_id', division_id, 'nombre', nombre, 'nombre_corto', nombre_corto, 'abreviatura', abreviatura) order by nombre), '[]'::jsonb) from public.equipos),
    'partidos', (select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'division_id', division_id, 'equipo_local_id', equipo_local_id,
      'equipo_visitante_id', equipo_visitante_id, 'fecha_hora', fecha_hora,
      'cancha', cancha, 'goles_local', goles_local, 'goles_visitante', goles_visitante,
      'estado', estado, 'observaciones', observaciones
    ) order by fecha_hora nulls last, created_at), '[]'::jsonb)
    from public.partidos where archivado = false)
  );

  insert into public.torneo_anterior (id, nombre, archivado_en, datos)
  values (1, trim(p_nombre), now(), v_datos)
  on conflict (id) do update set
    nombre = excluded.nombre,
    archivado_en = excluded.archivado_en,
    datos = excluded.datos;

  update public.partidos set archivado = true where archivado = false;

  update public.configuraciones c
  set valor = jsonb_set(c.valor, '{divisions}',
    coalesce((select jsonb_object_agg(key, value - 'fixture' - 'startDate')
      from jsonb_each(coalesce(c.valor -> 'divisions', '{}'::jsonb))), '{}'::jsonb), true),
    updated_at = now()
  where c.clave = 'tournament_settings';
end;
$$;

revoke all on function public.archivar_torneo_actual(text, text, text) from public, anon, authenticated;
grant execute on function public.archivar_torneo_actual(text, text, text) to anon, authenticated;

-- Acepta el formato anterior (array) y el nuevo (objeto con partidos y configuracion)
-- para desplegar la migracion antes que el frontend sin interrumpir a usuarios conectados.
create or replace function public.guardar_fixture_partidos(
  p_usuario text,
  p_password text,
  p_division_id uuid,
  p_partidos jsonb
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_partidos jsonb;
  v_configuracion jsonb;
  v_insertados integer := 0;
begin
  select * into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found or v_usuario.rol not in ('admin', 'superadmin')
    or not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Credenciales de administrador invalidas.';
  end if;

  if p_division_id is null or not exists (
    select 1 from public.divisiones where id = p_division_id and activa = true
  ) then
    raise exception 'La division no existe o esta inactiva.';
  end if;

  -- Usa el mismo candado que archivar_torneo_actual.
  perform pg_catalog.pg_advisory_xact_lock(106081, 0);
  v_partidos := case when jsonb_typeof(p_partidos) = 'object'
    then p_partidos -> 'matches' else p_partidos end;
  v_configuracion := case when jsonb_typeof(p_partidos) = 'object'
    then p_partidos -> 'settings' else null end;

  if coalesce(jsonb_typeof(v_partidos), '') <> 'array' then
    raise exception 'El fixture debe contener partidos.';
  end if;
  if jsonb_array_length(v_partidos) = 0 then
    raise exception 'El fixture debe contener partidos.';
  end if;

  if jsonb_typeof(p_partidos) = 'object'
    and coalesce(jsonb_typeof(v_configuracion), '') <> 'object' then
    raise exception 'La configuracion del torneo no es valida.';
  end if;

  if exists (
    select 1 from jsonb_array_elements(v_partidos) item
    where nullif(item ->> 'equipo_local_id', '') is null
      or nullif(item ->> 'equipo_visitante_id', '') is null
      or nullif(item ->> 'fecha', '') is null
      or item ->> 'equipo_local_id' = item ->> 'equipo_visitante_id'
      or not exists (select 1 from public.equipos e
        where e.id = (item ->> 'equipo_local_id')::uuid
          and e.division_id = p_division_id and e.activo = true)
      or not exists (select 1 from public.equipos e
        where e.id = (item ->> 'equipo_visitante_id')::uuid
          and e.division_id = p_division_id and e.activo = true)
  ) then
    raise exception 'El fixture contiene equipos invalidos o ajenos a la division.';
  end if;

  if exists (
    select 1 from (
      select item ->> 'fecha' as fecha, item ->> 'equipo_local_id' as equipo_id from jsonb_array_elements(v_partidos) item
      union all
      select item ->> 'fecha', item ->> 'equipo_visitante_id' from jsonb_array_elements(v_partidos) item
    ) participantes
    group by fecha, equipo_id having count(*) > 1
  ) then
    raise exception 'Un equipo aparece dos veces en la misma fecha.';
  end if;

  perform id from public.partidos
  where division_id = p_division_id and archivado = false for update;

  if exists (
    select 1 from public.partidos p
    where p.division_id = p_division_id and p.archivado = false
      and (p.estado <> 'programado'
        or exists (select 1 from public.goles g where g.partido_id = p.id)
        or exists (select 1 from public.tarjetas t where t.partido_id = p.id)
        or exists (select 1 from public.sanciones s where s.partido_id = p.id)
        or exists (select 1 from public.planillas_partido f where f.partido_id = p.id)
        or exists (select 1 from public.pronosticos_fortuna r where r.partido_id = p.id))
  ) then
    raise exception 'La division ya tiene resultados o registros vinculados. Archivá el torneo antes de crear uno nuevo.';
  end if;

  delete from public.partidos
  where division_id = p_division_id and archivado = false;

  insert into public.partidos (
    division_id, equipo_local_id, equipo_visitante_id, fecha_hora,
    goles_local, goles_visitante, estado, observaciones
  )
  select p_division_id,
    (item ->> 'equipo_local_id')::uuid,
    (item ->> 'equipo_visitante_id')::uuid,
    nullif(item ->> 'fecha_hora', '')::timestamptz,
    0, 0, 'programado', 'Fecha ' || (item ->> 'fecha')
  from jsonb_array_elements(v_partidos) item;

  get diagnostics v_insertados = row_count;

  if v_configuracion is not null then
    insert into public.configuraciones (clave, valor, descripcion, activa, updated_at)
    values ('tournament_settings', v_configuracion, 'Fechas y configuracion general del torneo Frame0.', true, now())
    on conflict (clave) do update set valor = excluded.valor, activa = true, updated_at = now();
  end if;

  return v_insertados;
end;
$$;

revoke all on function public.guardar_fixture_partidos(text, text, uuid, jsonb) from public, anon, authenticated;
grant execute on function public.guardar_fixture_partidos(text, text, uuid, jsonb) to anon, authenticated;
