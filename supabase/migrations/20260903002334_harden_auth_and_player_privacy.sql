-- Endurece autenticacion, privacidad de jugadores y controles del servidor.
-- La extension ya existe en Supabase; se declara en su esquema recomendado.
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create or replace function public.verificar_password_frame0(p_hash text, p_password text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(p_hash, '') <> ''
    and p_hash = extensions.crypt(trim(coalesce(p_password, '')), p_hash)
$$;

revoke all on function public.verificar_password_frame0(text, text) from public, anon, authenticated;

-- Conversión idempotente de credenciales históricas en texto plano a bcrypt.
update public.usuarios_app
set password_hash = extensions.crypt(password_hash, extensions.gen_salt('bf', 10))
where nullif(password_hash, '') is not null
  and password_hash not like '$2%';

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select ua.rol
  from public.usuarios_app ua
  where ua.id = auth.uid()
    and ua.activo = true
  limit 1
$$;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_user_role() in ('admin', 'superadmin')
$$;

revoke all on function public.resolve_login_profile(text) from public, anon, authenticated;

drop policy if exists "usuarios_ven_su_perfil" on public.usuarios_app;
create policy "usuarios_ven_su_perfil"
on public.usuarios_app for select
to authenticated
using (id = auth.uid() or public.is_admin_user());

-- Los datos personales dejan de ser legibles desde la tabla pública.
drop policy if exists "lectura_publica_jugadores" on public.jugadores;
revoke select on table public.jugadores from anon;

drop policy if exists "lectura_jugadores_autenticados" on public.jugadores;
create policy "lectura_jugadores_autenticados"
on public.jugadores for select
to authenticated
using (true);

grant select on table public.jugadores to authenticated;

create or replace function public.inscripcion_jugadores_abierta()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_valor jsonb;
  v_desde date;
  v_hasta date;
begin
  select c.valor into v_valor
  from public.configuraciones c
  where c.clave = 'tournament_settings'
    and c.activa = true
  limit 1;

  if v_valor is null then
    return true;
  end if;

  begin
    v_desde := nullif(trim(coalesce(v_valor ->> 'playerRegistrationFrom', '')), '')::date;
    v_hasta := nullif(trim(coalesce(v_valor ->> 'playerRegistrationTo', '')), '')::date;
  exception when invalid_datetime_format or datetime_field_overflow then
    return false;
  end;

  if v_desde is not null and v_hasta is not null and v_desde > v_hasta then
    return false;
  end if;

  return current_date between coalesce(v_desde, '-infinity'::date)
                          and coalesce(v_hasta, 'infinity'::date);
end
$$;

revoke all on function public.inscripcion_jugadores_abierta() from public, anon, authenticated;

create or replace function public.listar_jugadores_publicos(p_equipo_ids uuid[] default null)
returns table (
  id uuid,
  equipo_id uuid,
  nombre text,
  apellido text,
  posicion text,
  dorsal integer,
  foto_url text,
  activo boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select j.id, j.equipo_id, j.nombre, j.apellido, j.posicion, j.dorsal, j.foto_url, j.activo
  from public.jugadores j
  join public.equipos e on e.id = j.equipo_id
  where j.activo = true
    and e.activo = true
    and (p_equipo_ids is null or j.equipo_id = any(p_equipo_ids))
  order by j.dorsal nulls last, j.apellido, j.nombre
$$;

revoke all on function public.listar_jugadores_publicos(uuid[]) from public;
grant execute on function public.listar_jugadores_publicos(uuid[]) to anon, authenticated;

create or replace function public.listar_jugadores_frame0(
  p_usuario text,
  p_password text,
  p_equipo_ids uuid[] default null
)
returns table (
  id uuid,
  equipo_id uuid,
  nombre text,
  apellido text,
  dni text,
  fecha_nacimiento date,
  posicion text,
  dorsal integer,
  foto_url text,
  activo boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
begin
  select * into v_usuario
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_usuario, '')))
    and ua.activo = true
  limit 1;

  if not found or not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Usuario o contrasena incorrectos.';
  end if;

  if v_usuario.rol not in ('admin', 'superadmin', 'delegado', 'veedor') then
    raise exception 'Rol no autorizado para consultar jugadores.';
  end if;

  return query
  select j.id, j.equipo_id, j.nombre, j.apellido, j.dni, j.fecha_nacimiento,
         j.posicion, j.dorsal, j.foto_url, j.activo
  from public.jugadores j
  where (p_equipo_ids is null or j.equipo_id = any(p_equipo_ids))
    and (
      v_usuario.rol in ('admin', 'superadmin', 'veedor')
      or exists (
        select 1 from public.delegados d
        where d.usuario_id = v_usuario.id
          and d.equipo_id = j.equipo_id
          and d.activo = true
      )
    )
  order by j.dorsal nulls last, j.apellido, j.nombre;
end
$$;

revoke all on function public.listar_jugadores_frame0(text, text, uuid[]) from public;
grant execute on function public.listar_jugadores_frame0(text, text, uuid[]) to anon, authenticated;


-- Definicion vigente de guardar_configuracion_publica (010_save_public_settings_rpc.sql).
create or replace function public.guardar_configuracion_publica(
  p_usuario text,
  p_password text,
  p_valor jsonb
)
returns public.configuraciones
language plpgsql
security definer
set search_path = ''
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

  if not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
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


-- Definicion vigente de guardar_configuracion_torneo (016_save_tournament_settings_rpc.sql).
create or replace function public.guardar_configuracion_torneo(
  p_usuario text,
  p_password text,
  p_valor jsonb
)
returns public.configuraciones
language plpgsql
security definer
set search_path = ''
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

  if not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
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


-- Definicion vigente de guardar_fixture_partidos (020_replace_existing_fixture_completely.sql).
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

  if not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
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


-- Definicion vigente de guardar_detalle_partido_veedor (023_persist_observation_resolutions.sql).
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
set search_path = ''
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

  if not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
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


-- Definicion vigente de guardar_equipo_delegado (022_delegate_profile_write_rpcs.sql).
create or replace function public.guardar_equipo_delegado(
  p_usuario text,
  p_password text,
  p_equipo_id uuid,
  p_valor jsonb
)
returns public.equipos
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_equipo public.equipos%rowtype;
  v_key text;
begin
  select *
  into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found then
    raise exception 'Usuario delegado no encontrado o inactivo.';
  end if;

  if v_usuario.rol <> 'delegado' then
    raise exception 'Rol no autorizado para guardar equipo.';
  end if;

  if not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Contrasena incorrecta.';
  end if;

  if p_equipo_id is null then
    raise exception 'Falta equipo_id.';
  end if;

  if jsonb_typeof(coalesce(p_valor, '{}'::jsonb)) <> 'object' then
    raise exception 'p_valor debe ser un objeto JSON.';
  end if;

  for v_key in select jsonb_object_keys(coalesce(p_valor, '{}'::jsonb))
  loop
    if v_key not in (
      'abreviatura',
      'nombre_corto',
      'descripcion',
      'escudo_url',
      'color_principal',
      'color_secundario',
      'color_terciario'
    ) then
      raise exception 'Campo no permitido para equipo: %', v_key;
    end if;
  end loop;

  if not exists (
    select 1
    from public.delegados d
    where d.usuario_id = v_usuario.id
      and d.equipo_id = p_equipo_id
      and d.activo = true
  ) then
    raise exception 'El delegado no esta asociado al equipo informado.';
  end if;

  update public.equipos
  set
    abreviatura = case when p_valor ? 'abreviatura' then nullif(trim(coalesce(p_valor ->> 'abreviatura', '')), '') else abreviatura end,
    nombre_corto = case when p_valor ? 'nombre_corto' then nullif(trim(coalesce(p_valor ->> 'nombre_corto', '')), '') else nombre_corto end,
    descripcion = case when p_valor ? 'descripcion' then nullif(trim(coalesce(p_valor ->> 'descripcion', '')), '') else descripcion end,
    escudo_url = case when p_valor ? 'escudo_url' then nullif(trim(coalesce(p_valor ->> 'escudo_url', '')), '') else escudo_url end,
    color_principal = case when p_valor ? 'color_principal' then nullif(trim(coalesce(p_valor ->> 'color_principal', '')), '') else color_principal end,
    color_secundario = case when p_valor ? 'color_secundario' then nullif(trim(coalesce(p_valor ->> 'color_secundario', '')), '') else color_secundario end,
    color_terciario = case when p_valor ? 'color_terciario' then nullif(trim(coalesce(p_valor ->> 'color_terciario', '')), '') else color_terciario end
  where id = p_equipo_id
  returning *
  into v_equipo;

  if not found then
    raise exception 'Equipo no encontrado.';
  end if;

  return v_equipo;
end;
$$;


-- Definicion vigente de guardar_jugador_delegado (022_delegate_profile_write_rpcs.sql).
create or replace function public.guardar_jugador_delegado(
  p_usuario text,
  p_password text,
  p_equipo_id uuid,
  p_jugador_id uuid,
  p_valor jsonb
)
returns public.jugadores
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_jugador public.jugadores%rowtype;
  v_nombre text;
  v_apellido text;
  v_dni text;
  v_fecha_nacimiento date;
  v_dorsal integer;
  v_key text;
begin
  select *
  into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found then
    raise exception 'Usuario delegado no encontrado o inactivo.';
  end if;

  if v_usuario.rol <> 'delegado' then
    raise exception 'Rol no autorizado para guardar jugadores.';
  end if;

  if not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Contrasena incorrecta.';
  end if;

  if not public.inscripcion_jugadores_abierta() then
    raise exception 'El periodo de inscripcion de jugadores esta cerrado.';
  end if;

  if not exists (
    select 1
    from public.delegados d
    where d.usuario_id = v_usuario.id
      and d.equipo_id = p_equipo_id
      and d.activo = true
  ) then
    raise exception 'El delegado no esta asociado al equipo informado.';
  end if;

  if jsonb_typeof(coalesce(p_valor, '{}'::jsonb)) <> 'object' then
    raise exception 'p_valor debe ser un objeto JSON.';
  end if;

  for v_key in select jsonb_object_keys(coalesce(p_valor, '{}'::jsonb))
  loop
    if v_key not in (
      'equipo_id',
      'nombre',
      'apellido',
      'dni',
      'fecha_nacimiento',
      'dorsal',
      'activo'
    ) then
      raise exception 'Campo no permitido para jugador: %', v_key;
    end if;
  end loop;

  v_nombre := nullif(trim(coalesce(p_valor ->> 'nombre', '')), '');
  v_apellido := nullif(trim(coalesce(p_valor ->> 'apellido', '')), '');
  v_dni := nullif(trim(coalesce(p_valor ->> 'dni', '')), '');
  v_fecha_nacimiento := nullif(p_valor ->> 'fecha_nacimiento', '')::date;
  v_dorsal := nullif(p_valor ->> 'dorsal', '')::integer;

  if v_nombre is null or v_apellido is null or v_dni is null or v_dorsal is null then
    raise exception 'Nombre, apellido, DNI y dorsal son obligatorios.';
  end if;

  if exists (
    select 1
    from public.jugadores j
    where lower(trim(j.dni)) = lower(trim(v_dni))
      and (p_jugador_id is null or j.id <> p_jugador_id)
  ) then
    raise exception 'Ya existe un jugador registrado con ese DNI.';
  end if;

  if p_jugador_id is null then
    insert into public.jugadores (
      equipo_id,
      nombre,
      apellido,
      dni,
      fecha_nacimiento,
      dorsal,
      activo
    )
    values (
      p_equipo_id,
      v_nombre,
      v_apellido,
      v_dni,
      v_fecha_nacimiento,
      v_dorsal,
      true
    )
    returning *
    into v_jugador;
  else
    update public.jugadores
    set
      nombre = v_nombre,
      apellido = v_apellido,
      dni = v_dni,
      fecha_nacimiento = v_fecha_nacimiento,
      dorsal = v_dorsal
    where id = p_jugador_id
      and equipo_id = p_equipo_id
    returning *
    into v_jugador;

    if not found then
      raise exception 'Jugador no encontrado para el equipo del delegado.';
    end if;
  end if;

  return v_jugador;
end;
$$;


-- Definicion vigente de cambiar_estado_jugador_delegado (022_delegate_profile_write_rpcs.sql).
create or replace function public.cambiar_estado_jugador_delegado(
  p_usuario text,
  p_password text,
  p_jugador_id uuid,
  p_activo boolean
)
returns public.jugadores
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_jugador public.jugadores%rowtype;
begin
  select *
  into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found then
    raise exception 'Usuario delegado no encontrado o inactivo.';
  end if;

  if v_usuario.rol <> 'delegado' then
    raise exception 'Rol no autorizado para cambiar estado de jugadores.';
  end if;

  if not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Contrasena incorrecta.';
  end if;

  if not public.inscripcion_jugadores_abierta() then
    raise exception 'El periodo de inscripcion de jugadores esta cerrado.';
  end if;

  update public.jugadores j
  set activo = coalesce(p_activo, false)
  where j.id = p_jugador_id
    and exists (
      select 1
      from public.delegados d
      where d.usuario_id = v_usuario.id
        and d.equipo_id = j.equipo_id
        and d.activo = true
    )
  returning j.*
  into v_jugador;

  if not found then
    raise exception 'Jugador no encontrado para el equipo del delegado.';
  end if;

  return v_jugador;
end;
$$;


-- Definicion vigente de resolver_observacion_jugador_admin (023_persist_observation_resolutions.sql).
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
set search_path = ''
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

  if not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
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


-- Definicion vigente de marcar_resolucion_notificada_delegado (024_mark_delegate_resolution_notifications.sql).
create or replace function public.marcar_resolucion_notificada_delegado(
  p_usuario text,
  p_password text,
  p_sancion_id uuid
)
returns public.sanciones
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_sancion public.sanciones%rowtype;
begin
  select *
  into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found then
    raise exception 'Usuario delegado no encontrado o inactivo.';
  end if;

  if v_usuario.rol <> 'delegado' then
    raise exception 'Rol no autorizado para marcar notificaciones.';
  end if;

  if not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Contrasena incorrecta.';
  end if;

  select s.*
  into v_sancion
  from public.sanciones s
  join public.jugadores j on j.id = s.jugador_id
  join public.delegados d on d.equipo_id = j.equipo_id
  where s.id = p_sancion_id
    and d.usuario_id = v_usuario.id
    and d.activo = true
    and s.resuelta_at is not null
  for update of s;

  if not found then
    raise exception 'Resolucion no encontrada para este delegado.';
  end if;

  update public.sanciones
  set
    notificada_delegado = true,
    notificada_at = coalesce(notificada_at, now())
  where id = p_sancion_id
  returning * into v_sancion;

  return v_sancion;
end;
$$;


-- Definicion vigente de guardar_diario_noticias (026_sports_news_diary.sql).
create or replace function public.guardar_diario_noticias(
  p_usuario text,
  p_password text,
  p_edicion jsonb,
  p_paginas jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_fecha_id uuid;
  v_edicion_id uuid;
  v_estado text := coalesce(nullif(trim(p_edicion ->> 'estado'), ''), 'borrador');
  v_pagina jsonb;
begin
  select * into v_usuario from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, ''))) and activo = true limit 1;
  if not found or v_usuario.rol not in ('admin', 'superadmin')
    or not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Credenciales de administrador inválidas.';
  end if;
  if trim(coalesce(p_edicion ->> 'titulo', '')) = '' then raise exception 'El título es obligatorio.'; end if;
  if v_estado not in ('borrador', 'publicado') then raise exception 'Estado de diario inválido.'; end if;
  if jsonb_typeof(coalesce(p_paginas, '[]'::jsonb)) <> 'array' or jsonb_array_length(coalesce(p_paginas, '[]'::jsonb)) = 0 then
    raise exception 'El diario debe contener al menos una página.';
  end if;

  insert into public.fechas_deportivas(numero_fecha, fecha_desde, fecha_hasta, fecha_edicion, estado)
  values (
    (p_edicion ->> 'numero_fecha')::integer,
    (p_edicion ->> 'fecha_desde')::date,
    (p_edicion ->> 'fecha_hasta')::date,
    (p_edicion ->> 'fecha_edicion')::date,
    'cerrada'
  )
  on conflict (numero_fecha) do update set
    fecha_desde = excluded.fecha_desde,
    fecha_hasta = excluded.fecha_hasta,
    fecha_edicion = excluded.fecha_edicion,
    updated_at = now()
  returning id into v_fecha_id;

  v_edicion_id := nullif(p_edicion ->> 'id', '')::uuid;
  if v_edicion_id is null then
    insert into public.noticias_ediciones(fecha_deportiva_id, titulo, slogan, estado, generado_por_ia, fecha_publicacion)
    values (v_fecha_id, trim(p_edicion ->> 'titulo'), nullif(trim(p_edicion ->> 'slogan'), ''), v_estado,
      coalesce((p_edicion ->> 'generado_por_ia')::boolean, false), case when v_estado = 'publicado' then now() end)
    returning id into v_edicion_id;
  else
    update public.noticias_ediciones set
      fecha_deportiva_id = v_fecha_id, titulo = trim(p_edicion ->> 'titulo'), slogan = nullif(trim(p_edicion ->> 'slogan'), ''), estado = v_estado,
      generado_por_ia = coalesce((p_edicion ->> 'generado_por_ia')::boolean, generado_por_ia),
      fecha_publicacion = case when v_estado = 'publicado' then coalesce(fecha_publicacion, now()) else null end,
      fecha_baja = null, updated_at = now()
    where id = v_edicion_id;
    if not found then raise exception 'Diario no encontrado.'; end if;
    delete from public.noticias_paginas where noticia_edicion_id = v_edicion_id;
  end if;

  for v_pagina in select value from jsonb_array_elements(p_paginas) loop
    if trim(coalesce(v_pagina ->> 'contenido_texto', '')) = ''
      and trim(coalesce(v_pagina ->> 'resumen_general', '')) = '' then
      raise exception 'Cada página debe tener resumen o contenido.';
    end if;
    if not exists (
      select 1 from public.divisiones d
      where d.id = (v_pagina ->> 'division_id')::uuid
        and d.categoria_id = (v_pagina ->> 'categoria_id')::uuid
    ) then
      raise exception 'La división no pertenece a la categoría informada.';
    end if;
    insert into public.noticias_paginas(
      noticia_edicion_id, categoria_id, division_id, numero_pagina, titulo, resumen_general,
      contenido_texto, contenido_json, tabla_posiciones_snapshot
    ) values (
      v_edicion_id, (v_pagina ->> 'categoria_id')::uuid, (v_pagina ->> 'division_id')::uuid,
      (v_pagina ->> 'numero_pagina')::integer, nullif(trim(v_pagina ->> 'titulo'), ''),
      nullif(trim(v_pagina ->> 'resumen_general'), ''), nullif(trim(v_pagina ->> 'contenido_texto'), ''),
      coalesce(v_pagina -> 'contenido_json', '{}'::jsonb), coalesce(v_pagina -> 'tabla_posiciones_snapshot', '[]'::jsonb)
    );
  end loop;
  return v_edicion_id;
end;
$$;


-- Definicion vigente de dar_baja_diario_noticias (026_sports_news_diary.sql).
create or replace function public.dar_baja_diario_noticias(p_usuario text, p_password text, p_edicion_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_usuario public.usuarios_app%rowtype;
begin
  select * into v_usuario from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, ''))) and activo = true limit 1;
  if not found or v_usuario.rol not in ('admin', 'superadmin')
    or not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Credenciales de administrador inválidas.';
  end if;
  update public.noticias_ediciones set estado = 'baja', fecha_baja = now(), updated_at = now()
  where id = p_edicion_id;
  if not found then raise exception 'Diario no encontrado.'; end if;
end;
$$;


-- Definicion vigente de listar_diarios_noticias_admin (026_sports_news_diary.sql).
create or replace function public.listar_diarios_noticias_admin(p_usuario text, p_password text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_usuario public.usuarios_app%rowtype; v_resultado jsonb;
begin
  select * into v_usuario from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, ''))) and activo = true limit 1;
  if not found or v_usuario.rol not in ('admin', 'superadmin')
    or not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Credenciales de administrador inválidas.';
  end if;
  select coalesce(jsonb_agg(to_jsonb(e) || jsonb_build_object(
    'fecha', to_jsonb(f),
    'paginas', coalesce((select jsonb_agg(to_jsonb(p) || jsonb_build_object(
      'categoria', to_jsonb(c), 'division', to_jsonb(d)
    ) order by p.numero_pagina) from public.noticias_paginas p
      join public.categorias c on c.id = p.categoria_id
      join public.divisiones d on d.id = p.division_id
      where p.noticia_edicion_id = e.id), '[]'::jsonb)
  ) order by f.numero_fecha desc), '[]'::jsonb)
  into v_resultado
  from public.noticias_ediciones e
  join public.fechas_deportivas f on f.id = e.fecha_deportiva_id;
  return v_resultado;
end;
$$;


-- Definicion vigente de publicar_diario_noticias (027_publish_sports_news.sql).
create or replace function public.publicar_diario_noticias(
  p_usuario text,
  p_password text,
  p_edicion_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_estado text;
begin
  select * into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found
    or v_usuario.rol not in ('admin', 'superadmin')
    or not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Credenciales de administrador inválidas.';
  end if;

  select estado into v_estado
  from public.noticias_ediciones
  where id = p_edicion_id
  for update;

  if not found then raise exception 'Diario no encontrado.'; end if;
  if v_estado = 'baja' then raise exception 'No se puede publicar un diario dado de baja.'; end if;
  if not exists (
    select 1
    from public.noticias_paginas
    where noticia_edicion_id = p_edicion_id
      and (nullif(trim(resumen_general), '') is not null or nullif(trim(contenido_texto), '') is not null)
  ) then
    raise exception 'El diario debe contener al menos una página con contenido.';
  end if;

  update public.noticias_ediciones
  set estado = 'publicado',
      fecha_publicacion = coalesce(fecha_publicacion, now()),
      fecha_baja = null,
      updated_at = now()
  where id = p_edicion_id;
end;
$$;


-- Definicion vigente de iniciar_sesion_frame0 (028_secure_frame0_login.sql).
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
    and public.verificar_password_frame0(ua.password_hash, p_password)
  limit 1
$$;


-- Definicion vigente de registrar_planilla_partido_veedor (029_match_sheet_ocr.sql).
create or replace function public.registrar_planilla_partido_veedor(
  p_usuario text,
  p_password text,
  p_partido_id uuid,
  p_archivo_path text,
  p_mime_type text,
  p_tamano_bytes integer,
  p_resultado_ocr jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario public.usuarios_app%rowtype;
  v_planilla_id uuid;
  v_fecha_hora timestamptz;
begin
  select *
  into v_usuario
  from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, '')))
    and activo = true
  limit 1;

  if not found
    or not public.verificar_password_frame0(v_usuario.password_hash, p_password) then
    raise exception 'Credenciales invalidas.';
  end if;

  if v_usuario.rol not in ('veedor', 'admin', 'superadmin') then
    raise exception 'Rol no autorizado para registrar planillas.';
  end if;

  if v_usuario.rol = 'veedor' and not exists (
    select 1 from public.veedores v
    where v.usuario_id = v_usuario.id and v.activo = true
  ) then
    raise exception 'El perfil veedor no esta activo.';
  end if;

  select fecha_hora into v_fecha_hora
  from public.partidos
  where id = p_partido_id;

  if not found then
    raise exception 'Partido no encontrado.';
  end if;

  if v_fecha_hora is not null and v_fecha_hora::date > current_date then
    raise exception 'No se puede registrar una planilla de un partido futuro.';
  end if;

  if coalesce(p_archivo_path, '') not like p_partido_id::text || '/%' then
    raise exception 'Ruta de archivo invalida.';
  end if;

  if p_mime_type not in ('image/jpeg', 'image/png', 'image/webp', 'application/pdf') then
    raise exception 'Tipo de archivo no permitido.';
  end if;

  if coalesce(p_tamano_bytes, 0) <= 0 or p_tamano_bytes > 8388608 then
    raise exception 'Tamano de archivo invalido.';
  end if;

  if jsonb_typeof(coalesce(p_resultado_ocr, '{}'::jsonb)) <> 'object' then
    raise exception 'Resultado OCR invalido.';
  end if;

  insert into public.planillas_partido (
    partido_id,
    veedor_usuario_id,
    archivo_path,
    mime_type,
    tamano_bytes,
    resultado_ocr
  ) values (
    p_partido_id,
    v_usuario.id,
    trim(p_archivo_path),
    p_mime_type,
    p_tamano_bytes,
    p_resultado_ocr
  )
  returning id into v_planilla_id;

  return v_planilla_id;
end;
$$;


-- Definicion vigente de guardar_delegado_admin (030_secure_admin_user_management.sql).
create or replace function public.guardar_delegado_admin(
  p_admin_usuario text,
  p_admin_password text,
  p_usuario_id uuid,
  p_nombre text,
  p_apellido text,
  p_documento text,
  p_contacto text,
  p_usuario text,
  p_password text,
  p_equipo_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_id uuid;
  v_usuario_id uuid;
  v_relacion_id uuid;
  v_resultado jsonb;
begin
  select ua.id
    into v_admin_id
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_admin_usuario, '')))
    and public.verificar_password_frame0(ua.password_hash, p_admin_password)
    and ua.rol in ('admin', 'superadmin')
    and ua.activo = true
  limit 1;

  if v_admin_id is null then
    raise exception using errcode = '42501', message = 'Credenciales de administrador inválidas.';
  end if;

  if nullif(trim(coalesce(p_nombre, '')), '') is null
    or nullif(trim(coalesce(p_apellido, '')), '') is null
    or nullif(trim(coalesce(p_documento, '')), '') is null
    or nullif(trim(coalesce(p_contacto, '')), '') is null
    or nullif(trim(coalesce(p_usuario, '')), '') is null
    or p_equipo_id is null then
    raise exception using errcode = '22023', message = 'Faltan datos obligatorios del delegado.';
  end if;

  if not exists (
    select 1 from public.equipos e where e.id = p_equipo_id and e.activo = true
  ) then
    raise exception using errcode = '23503', message = 'El equipo seleccionado no está activo.';
  end if;

  if exists (
    select 1
    from public.usuarios_app ua
    where lower(trim(ua.usuario)) = lower(trim(p_usuario))
      and (p_usuario_id is null or ua.id <> p_usuario_id)
  ) then
    raise exception using errcode = '23505', message = 'El usuario ya existe. Ingresá otro nombre de usuario.';
  end if;

  if p_usuario_id is null then
    if nullif(trim(coalesce(p_password, '')), '') is null then
      raise exception using errcode = '22023', message = 'La contraseña es obligatoria para crear el delegado.';
    end if;

    insert into public.usuarios_app (
      nombre, apellido, documento, contacto, usuario, password_hash, rol, activo
    ) values (
      trim(p_nombre), trim(p_apellido), trim(p_documento), trim(p_contacto),
      lower(trim(p_usuario)), extensions.crypt(trim(p_password), extensions.gen_salt('bf', 10)), 'delegado', true
    )
    returning id into v_usuario_id;
  else
    select ua.id
      into v_usuario_id
    from public.usuarios_app ua
    where ua.id = p_usuario_id
      and ua.rol = 'delegado'
    limit 1;

    if v_usuario_id is null then
      raise exception using errcode = 'P0002', message = 'No se encontró el delegado solicitado.';
    end if;

    update public.usuarios_app
    set nombre = trim(p_nombre),
        apellido = trim(p_apellido),
        documento = trim(p_documento),
        contacto = trim(p_contacto),
        usuario = lower(trim(p_usuario)),
        password_hash = case
          when nullif(trim(coalesce(p_password, '')), '') is null then password_hash
          else extensions.crypt(trim(p_password), extensions.gen_salt('bf', 10))
        end,
        activo = true
    where id = v_usuario_id;
  end if;

  select d.id
    into v_relacion_id
  from public.delegados d
  where d.usuario_id = v_usuario_id
    and d.equipo_id = p_equipo_id
  limit 1;

  if v_relacion_id is null then
    select d.id
      into v_relacion_id
    from public.delegados d
    where d.usuario_id = v_usuario_id
    order by d.activo desc, d.created_at
    limit 1;
  end if;

  if v_relacion_id is null then
    insert into public.delegados (usuario_id, equipo_id, activo)
    values (v_usuario_id, p_equipo_id, true)
    returning id into v_relacion_id;
  else
    update public.delegados
    set equipo_id = p_equipo_id,
        activo = true
    where id = v_relacion_id;
  end if;

  update public.delegados
  set activo = false
  where usuario_id = v_usuario_id
    and id <> v_relacion_id;

  select jsonb_build_object(
    'id', d.id,
    'usuario_id', d.usuario_id,
    'equipo_id', d.equipo_id,
    'activo', d.activo,
    'usuario', jsonb_build_object(
      'id', ua.id,
      'nombre', ua.nombre,
      'apellido', ua.apellido,
      'documento', ua.documento,
      'contacto', ua.contacto,
      'usuario', ua.usuario,
      'rol', ua.rol,
      'activo', ua.activo
    )
  )
    into v_resultado
  from public.delegados d
  join public.usuarios_app ua on ua.id = d.usuario_id
  where d.id = v_relacion_id;

  return v_resultado;
end
$$;


-- Definicion vigente de guardar_veedor_admin (030_secure_admin_user_management.sql).
create or replace function public.guardar_veedor_admin(
  p_admin_usuario text,
  p_admin_password text,
  p_veedor_id uuid,
  p_nombre text,
  p_apellido text,
  p_documento text,
  p_contacto text,
  p_usuario text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_id uuid;
  v_usuario_id uuid;
  v_veedor_id uuid;
  v_resultado jsonb;
begin
  select ua.id
    into v_admin_id
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_admin_usuario, '')))
    and public.verificar_password_frame0(ua.password_hash, p_admin_password)
    and ua.rol in ('admin', 'superadmin')
    and ua.activo = true
  limit 1;

  if v_admin_id is null then
    raise exception using errcode = '42501', message = 'Credenciales de administrador inválidas.';
  end if;

  if nullif(trim(coalesce(p_nombre, '')), '') is null
    or nullif(trim(coalesce(p_apellido, '')), '') is null
    or nullif(trim(coalesce(p_documento, '')), '') is null
    or nullif(trim(coalesce(p_contacto, '')), '') is null
    or nullif(trim(coalesce(p_usuario, '')), '') is null then
    raise exception using errcode = '22023', message = 'Faltan datos obligatorios del veedor.';
  end if;

  if p_veedor_id is null then
    v_usuario_id := null;
  else
    select v.usuario_id
      into v_usuario_id
    from public.veedores v
    join public.usuarios_app ua on ua.id = v.usuario_id and ua.rol = 'veedor'
    where v.id = p_veedor_id
    limit 1;

    if v_usuario_id is null then
      raise exception using errcode = 'P0002', message = 'No se encontró el veedor solicitado.';
    end if;
  end if;

  if exists (
    select 1
    from public.usuarios_app ua
    where lower(trim(ua.usuario)) = lower(trim(p_usuario))
      and (v_usuario_id is null or ua.id <> v_usuario_id)
  ) then
    raise exception using errcode = '23505', message = 'El usuario ya existe. Ingresá otro nombre de usuario.';
  end if;

  if v_usuario_id is null then
    if nullif(trim(coalesce(p_password, '')), '') is null then
      raise exception using errcode = '22023', message = 'La contraseña es obligatoria para crear el veedor.';
    end if;

    insert into public.usuarios_app (
      nombre, apellido, documento, contacto, usuario, password_hash, rol, activo
    ) values (
      trim(p_nombre), trim(p_apellido), trim(p_documento), trim(p_contacto),
      lower(trim(p_usuario)), extensions.crypt(trim(p_password), extensions.gen_salt('bf', 10)), 'veedor', true
    )
    returning id into v_usuario_id;

    insert into public.veedores (usuario_id, activo)
    values (v_usuario_id, true)
    returning id into v_veedor_id;
  else
    update public.usuarios_app
    set nombre = trim(p_nombre),
        apellido = trim(p_apellido),
        documento = trim(p_documento),
        contacto = trim(p_contacto),
        usuario = lower(trim(p_usuario)),
        password_hash = case
          when nullif(trim(coalesce(p_password, '')), '') is null then password_hash
          else extensions.crypt(trim(p_password), extensions.gen_salt('bf', 10))
        end,
        activo = true
    where id = v_usuario_id;

    update public.veedores
    set activo = true
    where id = p_veedor_id
    returning id into v_veedor_id;
  end if;

  select jsonb_build_object(
    'id', v.id,
    'usuario_id', v.usuario_id,
    'activo', v.activo,
    'usuario', jsonb_build_object(
      'id', ua.id,
      'nombre', ua.nombre,
      'apellido', ua.apellido,
      'documento', ua.documento,
      'contacto', ua.contacto,
      'usuario', ua.usuario,
      'rol', ua.rol,
      'activo', ua.activo
    )
  )
    into v_resultado
  from public.veedores v
  join public.usuarios_app ua on ua.id = v.usuario_id
  where v.id = v_veedor_id;

  return v_resultado;
end
$$;


-- Definicion vigente de cambiar_estado_usuario_admin (031_fortuna_vouchers.sql).
create or replace function public.cambiar_estado_usuario_admin(
  p_admin_usuario text,
  p_admin_password text,
  p_tipo text,
  p_registro_id uuid,
  p_activo boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_id uuid;
  v_usuario_id uuid;
begin
  select ua.id into v_admin_id
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_admin_usuario, '')))
    and public.verificar_password_frame0(ua.password_hash, p_admin_password)
    and ua.rol in ('admin', 'superadmin') and ua.activo = true
  limit 1;
  if v_admin_id is null then
    raise exception using errcode = '42501', message = 'Credenciales de administrador invalidas.';
  end if;

  if p_tipo = 'delegado' then
    select id into v_usuario_id from public.usuarios_app
    where id = p_registro_id and rol = 'delegado';
  elsif p_tipo = 'veedor' then
    select v.usuario_id into v_usuario_id
    from public.veedores v
    join public.usuarios_app ua on ua.id = v.usuario_id and ua.rol = 'veedor'
    where v.id = p_registro_id;
  elsif p_tipo = 'constatador' then
    select id into v_usuario_id from public.usuarios_app
    where id = p_registro_id and rol = 'constatador';
  else
    raise exception using errcode = '22023', message = 'Tipo de usuario invalido.';
  end if;

  if v_usuario_id is null then
    raise exception using errcode = 'P0002', message = 'Usuario no encontrado.';
  end if;
  update public.usuarios_app set activo = p_activo where id = v_usuario_id;
  if p_tipo = 'delegado' then
    update public.delegados set activo = p_activo where usuario_id = v_usuario_id;
  elsif p_tipo = 'veedor' then
    update public.veedores set activo = p_activo where id = p_registro_id;
  end if;
  return true;
end
$$;


-- Definicion vigente de listar_solicitudes_jugador_delegado (031_fortuna_vouchers.sql).
create or replace function public.listar_solicitudes_jugador_delegado(
  p_usuario text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario_id uuid;
  v_equipo_id uuid;
  v_resultado jsonb;
begin
  select ua.id, d.equipo_id into v_usuario_id, v_equipo_id
  from public.usuarios_app ua
  join public.delegados d on d.usuario_id = ua.id and d.activo = true
  join public.equipos e on e.id = d.equipo_id and e.activo = true
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_usuario, '')))
    and public.verificar_password_frame0(ua.password_hash, p_password)
    and ua.rol = 'delegado' and ua.activo = true
  limit 1;

  if v_usuario_id is null then
    raise exception using errcode = '42501', message = 'Credenciales de delegado invalidas.';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id,
    'estado', s.estado,
    'created_at', s.created_at,
    'participante', jsonb_build_object(
      'id', p.id, 'nombre', p.nombre, 'apellido', p.apellido, 'documento', p.documento
    ),
    'jugador', jsonb_build_object(
      'id', j.id, 'nombre', j.nombre, 'apellido', j.apellido,
      'dni', j.dni, 'dorsal', j.dorsal, 'equipo_id', j.equipo_id
    )
  ) order by s.created_at), '[]'::jsonb)
  into v_resultado
  from public.solicitudes_vinculo_jugador s
  join public.participantes p on p.id = s.participante_id and p.activo = true
  join public.jugadores j on j.id = s.jugador_id
  where j.equipo_id = v_equipo_id and s.estado = 'pendiente';

  return v_resultado;
end
$$;


-- Definicion vigente de resolver_solicitud_jugador_delegado (031_fortuna_vouchers.sql).
create or replace function public.resolver_solicitud_jugador_delegado(
  p_usuario text,
  p_password text,
  p_solicitud_id uuid,
  p_aprobar boolean,
  p_motivo text default null
)
returns public.solicitudes_vinculo_jugador
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario_id uuid;
  v_equipo_id uuid;
  v_solicitud public.solicitudes_vinculo_jugador%rowtype;
begin
  select ua.id, d.equipo_id into v_usuario_id, v_equipo_id
  from public.usuarios_app ua
  join public.delegados d on d.usuario_id = ua.id and d.activo = true
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_usuario, '')))
    and public.verificar_password_frame0(ua.password_hash, p_password)
    and ua.rol = 'delegado' and ua.activo = true
  limit 1;

  if v_usuario_id is null then
    raise exception using errcode = '42501', message = 'Credenciales de delegado invalidas.';
  end if;

  select s.* into v_solicitud
  from public.solicitudes_vinculo_jugador s
  join public.jugadores j on j.id = s.jugador_id
  where s.id = p_solicitud_id
    and s.estado = 'pendiente'
    and j.equipo_id = v_equipo_id
    and j.activo = true
  for update of s;

  if v_solicitud.id is null then
    raise exception using errcode = 'P0002', message = 'Solicitud pendiente no encontrada para tu equipo.';
  end if;

  update public.solicitudes_vinculo_jugador
  set estado = case when p_aprobar then 'aprobada' else 'rechazada' end,
      revisado_por = v_usuario_id,
      motivo = nullif(trim(coalesce(p_motivo, '')), ''),
      reviewed_at = now()
  where id = v_solicitud.id
  returning * into v_solicitud;

  return v_solicitud;
end
$$;


-- Definicion vigente de guardar_constatador_admin (031_fortuna_vouchers.sql).
create or replace function public.guardar_constatador_admin(
  p_admin_usuario text,
  p_admin_password text,
  p_usuario_id uuid,
  p_nombre text,
  p_apellido text,
  p_documento text,
  p_contacto text,
  p_usuario text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_id uuid;
  v_usuario_id uuid;
  v_resultado jsonb;
begin
  select ua.id into v_admin_id
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_admin_usuario, '')))
    and public.verificar_password_frame0(ua.password_hash, p_admin_password)
    and ua.rol in ('admin', 'superadmin') and ua.activo = true
  limit 1;
  if v_admin_id is null then
    raise exception using errcode = '42501', message = 'Credenciales de administrador invalidas.';
  end if;

  if nullif(trim(coalesce(p_nombre, '')), '') is null
    or nullif(trim(coalesce(p_apellido, '')), '') is null
    or nullif(trim(coalesce(p_documento, '')), '') is null
    or nullif(trim(coalesce(p_contacto, '')), '') is null
    or nullif(trim(coalesce(p_usuario, '')), '') is null then
    raise exception using errcode = '22023', message = 'Faltan datos obligatorios del constatador.';
  end if;

  if exists (
    select 1 from public.usuarios_app ua
    where lower(trim(ua.usuario)) = lower(trim(p_usuario))
      and (p_usuario_id is null or ua.id <> p_usuario_id)
  ) then
    raise exception using errcode = '23505', message = 'El usuario ya existe.';
  end if;

  if p_usuario_id is null then
    if nullif(trim(coalesce(p_password, '')), '') is null then
      raise exception using errcode = '22023', message = 'La contrasena es obligatoria.';
    end if;
    insert into public.usuarios_app (nombre, apellido, documento, contacto, usuario, password_hash, rol, activo)
    values (trim(p_nombre), trim(p_apellido), trim(p_documento), trim(p_contacto),
      lower(trim(p_usuario)), extensions.crypt(trim(p_password), extensions.gen_salt('bf', 10)), 'constatador', true)
    returning id into v_usuario_id;
  else
    select id into v_usuario_id from public.usuarios_app
    where id = p_usuario_id and rol = 'constatador' for update;
    if v_usuario_id is null then
      raise exception using errcode = 'P0002', message = 'Constatador no encontrado.';
    end if;
    update public.usuarios_app
    set nombre = trim(p_nombre), apellido = trim(p_apellido), documento = trim(p_documento),
        contacto = trim(p_contacto), usuario = lower(trim(p_usuario)),
        password_hash = case when nullif(trim(coalesce(p_password, '')), '') is null
          then password_hash else extensions.crypt(trim(p_password), extensions.gen_salt('bf', 10)) end,
        activo = true
    where id = v_usuario_id;
  end if;

  select jsonb_build_object(
    'id', ua.id, 'nombre', ua.nombre, 'apellido', ua.apellido,
    'documento', ua.documento, 'contacto', ua.contacto,
    'usuario', ua.usuario, 'rol', ua.rol, 'activo', ua.activo
  ) into v_resultado from public.usuarios_app ua where ua.id = v_usuario_id;
  return v_resultado;
end
$$;


-- Definicion vigente de consultar_voucher_constatador (031_fortuna_vouchers.sql).
create or replace function public.consultar_voucher_constatador(
  p_usuario text,
  p_password text,
  p_codigo text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_constatador_id uuid;
  v_codigo_normalizado text;
  v_resultado jsonb;
begin
  select ua.id into v_constatador_id
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_usuario, '')))
    and public.verificar_password_frame0(ua.password_hash, p_password)
    and ua.rol = 'constatador' and ua.activo = true
  limit 1;
  if v_constatador_id is null then
    raise exception using errcode = '42501', message = 'Credenciales de constatador invalidas.';
  end if;

  v_codigo_normalizado := upper(regexp_replace(coalesce(p_codigo, ''), '[^[:alnum:]]', '', 'g'));
  select jsonb_build_object(
    'id', ve.id,
    'codigo', ve.codigo,
    'producto', ve.producto_nombre,
    'emitido_at', ve.emitido_at,
    'vence_at', ve.vence_at,
    'estado', case
      when ve.estado = 'anulado' then 'anulado'
      when ve.estado = 'usado' then 'usado'
      when ve.vence_at <= now() then 'vencido'
      else 'valido'
    end,
    'puede_usar', ve.estado = 'emitido' and ve.vence_at > now(),
    'usado_at', ve.usado_at,
    'titular', jsonb_build_object(
      'nombre', concat_ws(' ', p.nombre, p.apellido),
      'documento', p.documento
    )
  ) into v_resultado
  from public.vouchers_emitidos ve
  join public.participantes p on p.id = ve.participante_id
  where upper(regexp_replace(ve.codigo, '[^[:alnum:]]', '', 'g')) = v_codigo_normalizado
  limit 1;

  if v_resultado is null then
    raise exception using errcode = 'P0002', message = 'Voucher no encontrado.';
  end if;
  return v_resultado;
end
$$;


-- Definicion vigente de confirmar_entrega_voucher_constatador (031_fortuna_vouchers.sql).
create or replace function public.confirmar_entrega_voucher_constatador(
  p_usuario text,
  p_password text,
  p_voucher_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_constatador_id uuid;
  v_voucher public.vouchers_emitidos%rowtype;
begin
  select ua.id into v_constatador_id
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_usuario, '')))
    and public.verificar_password_frame0(ua.password_hash, p_password)
    and ua.rol = 'constatador' and ua.activo = true
  limit 1;
  if v_constatador_id is null then
    raise exception using errcode = '42501', message = 'Credenciales de constatador invalidas.';
  end if;

  select * into v_voucher from public.vouchers_emitidos
  where id = p_voucher_id for update;
  if v_voucher.id is null then
    raise exception using errcode = 'P0002', message = 'Voucher no encontrado.';
  end if;
  if v_voucher.estado <> 'emitido' then
    raise exception using errcode = '22023', message = 'El voucher ya fue usado o anulado.';
  end if;
  if v_voucher.vence_at <= now() then
    raise exception using errcode = '22023', message = 'El voucher esta vencido.';
  end if;

  update public.vouchers_emitidos
  set estado = 'usado', usado_at = now(), usado_por = v_constatador_id
  where id = v_voucher.id
  returning * into v_voucher;

  return jsonb_build_object(
    'id', v_voucher.id, 'codigo', v_voucher.codigo,
    'producto', v_voucher.producto_nombre, 'estado', 'usado',
    'usado_at', v_voucher.usado_at
  );
end
$$;


-- Correccion del generador de codigos con search_path vacio.
create or replace function public.canjear_voucher(p_tipo_voucher_id uuid)
returns public.vouchers_emitidos
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_temporada_id uuid;
  v_tipo public.tipos_voucher%rowtype;
  v_ganados bigint;
  v_gastados bigint;
  v_stock_usado bigint;
  v_codigo text;
  v_resultado public.vouchers_emitidos%rowtype;
  v_random text;
begin
  if v_uid is null then
    raise exception using errcode = '42501', message = 'Debes iniciar sesion.';
  end if;

  perform 1 from public.participantes p
  where p.id = v_uid and p.activo = true
  for update;
  if not found then
    raise exception using errcode = '42501', message = 'La cuenta participante no esta activa.';
  end if;

  select t.id into v_temporada_id
  from public.temporadas_fortuna t
  where t.estado = 'activa'
    and now() >= t.inicia_at
    and now() < t.finaliza_at
  limit 1;

  if v_temporada_id is null then
    raise exception using errcode = '22023', message = 'No hay una temporada Fortuna activa.';
  end if;

  select * into v_tipo
  from public.tipos_voucher
  where id = p_tipo_voucher_id
  for update;

  if v_tipo.id is null or not v_tipo.activo then
    raise exception using errcode = '22023', message = 'El voucher no esta disponible.';
  end if;

  select coalesce(sum(pf.puntos), 0) into v_ganados
  from public.puntajes_fortuna pf
  where pf.participante_id = v_uid and pf.temporada_id = v_temporada_id;

  select coalesce(sum(ve.costo_puntos), 0) into v_gastados
  from public.vouchers_emitidos ve
  where ve.participante_id = v_uid and ve.temporada_id = v_temporada_id;

  if v_ganados - v_gastados < v_tipo.costo_puntos then
    raise exception using errcode = '22023', message = 'No tenes puntos suficientes para este canje.';
  end if;

  select count(*) into v_stock_usado
  from public.vouchers_emitidos ve
  where ve.tipo_voucher_id = v_tipo.id
    and (
      ve.estado = 'usado'
      or (ve.estado = 'emitido' and ve.vence_at > now())
    );

  if v_stock_usado >= v_tipo.stock_total then
    raise exception using errcode = '22023', message = 'No queda stock disponible.';
  end if;

  loop
    v_random := upper(encode(extensions.gen_random_bytes(10), 'hex'));
    v_codigo := 'F0-' || substr(v_random, 1, 4) || '-' || substr(v_random, 5, 4)
      || '-' || substr(v_random, 9, 4) || '-' || substr(v_random, 13, 4)
      || '-' || substr(v_random, 17, 4);
    exit when not exists (select 1 from public.vouchers_emitidos where codigo = v_codigo);
  end loop;

  insert into public.vouchers_emitidos (
    tipo_voucher_id, temporada_id, participante_id, codigo,
    producto_nombre, costo_puntos, vence_at
  ) values (
    v_tipo.id, v_temporada_id, v_uid, v_codigo,
    v_tipo.nombre, v_tipo.costo_puntos, now() + make_interval(days => v_tipo.vigencia_dias)
  )
  returning * into v_resultado;

  return v_resultado;
end
$$;


-- Comprobaciones de seguridad al aplicar la migracion.
do $$
begin
  if has_table_privilege('anon', 'public.jugadores', 'select') then
    raise exception 'jugadores conserva SELECT directo para anon.';
  end if;
  if has_function_privilege('anon', 'public.resolve_login_profile(text)', 'execute') then
    raise exception 'resolve_login_profile continua expuesto.';
  end if;
  if exists (
    select 1 from public.usuarios_app
    where nullif(password_hash, '') is not null and password_hash not like '$2%'
  ) then
    raise exception 'Persisten contrasenas Frame0 sin cifrar.';
  end if;
end
$$;
