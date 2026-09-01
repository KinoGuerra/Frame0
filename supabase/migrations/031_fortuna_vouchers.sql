-- ============================================================
-- FRAME0 - FORTUNA, PARTICIPANTES Y VOUCHERS
-- Cuentas publicas con Supabase Auth, pronosticos, puntos por
-- temporada, canjes atomicos y validacion por constatadores.
-- ============================================================

create extension if not exists "pgcrypto";

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- El rol constatador usa el login propio de Frame0.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.usuarios_app'::regclass
      and conname = 'usuarios_app_rol_check'
  ) then
    alter table public.usuarios_app drop constraint usuarios_app_rol_check;
  end if;

  alter table public.usuarios_app
    add constraint usuarios_app_rol_check check (
      rol in ('admin', 'superadmin', 'delegado', 'veedor', 'publico', 'constatador')
    );
end
$$;

create table if not exists public.participantes (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  apellido text not null,
  documento text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint participantes_nombre_check check (length(trim(nombre)) between 1 and 80),
  constraint participantes_apellido_check check (length(trim(apellido)) between 1 and 80),
  constraint participantes_documento_check check (length(trim(documento)) between 5 and 30)
);

create unique index if not exists participantes_documento_unique_idx
  on public.participantes (upper(regexp_replace(documento, '[^[:alnum:]]', '', 'g')));

create table if not exists public.solicitudes_vinculo_jugador (
  id uuid primary key default gen_random_uuid(),
  participante_id uuid not null references public.participantes(id) on delete cascade,
  jugador_id uuid not null references public.jugadores(id) on delete cascade,
  estado text not null default 'pendiente',
  revisado_por uuid references public.usuarios_app(id) on delete set null,
  motivo text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint solicitudes_vinculo_estado_check check (estado in ('pendiente', 'aprobada', 'rechazada'))
);

create unique index if not exists solicitudes_vinculo_participante_abierta_idx
  on public.solicitudes_vinculo_jugador (participante_id)
  where estado in ('pendiente', 'aprobada');

create unique index if not exists solicitudes_vinculo_jugador_abierta_idx
  on public.solicitudes_vinculo_jugador (jugador_id)
  where estado in ('pendiente', 'aprobada');

create index if not exists solicitudes_vinculo_jugador_estado_idx
  on public.solicitudes_vinculo_jugador (jugador_id, estado, created_at);

create table if not exists public.temporadas_fortuna (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  inicia_at timestamptz not null,
  finaliza_at timestamptz not null,
  estado text not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint temporadas_fortuna_nombre_check check (length(trim(nombre)) between 1 and 100),
  constraint temporadas_fortuna_rango_check check (inicia_at < finaliza_at),
  constraint temporadas_fortuna_estado_check check (estado in ('borrador', 'activa', 'cerrada'))
);

create unique index if not exists temporadas_fortuna_activa_unique_idx
  on public.temporadas_fortuna ((estado))
  where estado = 'activa';

create index if not exists temporadas_fortuna_fechas_idx
  on public.temporadas_fortuna (estado, inicia_at, finaliza_at);

create table if not exists public.pronosticos_fortuna (
  id uuid primary key default gen_random_uuid(),
  temporada_id uuid not null references public.temporadas_fortuna(id) on delete restrict,
  participante_id uuid not null references public.participantes(id) on delete cascade,
  partido_id uuid not null references public.partidos(id) on delete cascade,
  goles_local smallint not null,
  goles_visitante smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pronosticos_fortuna_goles_local_check check (goles_local between 0 and 99),
  constraint pronosticos_fortuna_goles_visitante_check check (goles_visitante between 0 and 99),
  constraint pronosticos_fortuna_unique unique (temporada_id, participante_id, partido_id)
);

create index if not exists pronosticos_fortuna_partido_idx
  on public.pronosticos_fortuna (partido_id, temporada_id);

create index if not exists pronosticos_fortuna_participante_idx
  on public.pronosticos_fortuna (participante_id, temporada_id, updated_at desc);

create table if not exists public.puntajes_fortuna (
  id uuid primary key default gen_random_uuid(),
  pronostico_id uuid not null references public.pronosticos_fortuna(id) on delete cascade,
  temporada_id uuid not null references public.temporadas_fortuna(id) on delete restrict,
  participante_id uuid not null references public.participantes(id) on delete cascade,
  puntos smallint not null default 0,
  goles_local_final smallint not null,
  goles_visitante_final smallint not null,
  evaluated_at timestamptz not null default now(),
  constraint puntajes_fortuna_puntos_check check (puntos in (0, 2, 5)),
  constraint puntajes_fortuna_pronostico_unique unique (pronostico_id)
);

create index if not exists puntajes_fortuna_saldo_idx
  on public.puntajes_fortuna (participante_id, temporada_id);

create table if not exists public.tipos_voucher (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  costo_puntos integer not null,
  stock_total integer not null,
  vigencia_dias integer not null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tipos_voucher_nombre_check check (length(trim(nombre)) between 1 and 120),
  constraint tipos_voucher_costo_check check (costo_puntos > 0),
  constraint tipos_voucher_stock_check check (stock_total >= 0),
  constraint tipos_voucher_vigencia_check check (vigencia_dias between 1 and 3650)
);

create index if not exists tipos_voucher_activos_idx
  on public.tipos_voucher (activo, costo_puntos, nombre);

create table if not exists public.vouchers_emitidos (
  id uuid primary key default gen_random_uuid(),
  tipo_voucher_id uuid not null references public.tipos_voucher(id) on delete restrict,
  temporada_id uuid not null references public.temporadas_fortuna(id) on delete restrict,
  participante_id uuid not null references public.participantes(id) on delete restrict,
  codigo text not null,
  producto_nombre text not null,
  costo_puntos integer not null,
  emitido_at timestamptz not null default now(),
  vence_at timestamptz not null,
  estado text not null default 'emitido',
  usado_at timestamptz,
  usado_por uuid references public.usuarios_app(id) on delete set null,
  anulado_at timestamptz,
  anulado_por uuid references public.usuarios_app(id) on delete set null,
  motivo_anulacion text,
  constraint vouchers_emitidos_codigo_unique unique (codigo),
  constraint vouchers_emitidos_costo_check check (costo_puntos > 0),
  constraint vouchers_emitidos_vigencia_check check (emitido_at < vence_at),
  constraint vouchers_emitidos_estado_check check (estado in ('emitido', 'usado', 'anulado'))
);

create unique index if not exists vouchers_emitidos_codigo_normalizado_idx
  on public.vouchers_emitidos (upper(regexp_replace(codigo, '[^[:alnum:]]', '', 'g')));

create index if not exists vouchers_emitidos_participante_idx
  on public.vouchers_emitidos (participante_id, temporada_id, emitido_at desc);

create index if not exists vouchers_emitidos_stock_idx
  on public.vouchers_emitidos (tipo_voucher_id, estado, vence_at);

-- Crea el perfil solo para altas publicas marcadas por nuestro formulario.
-- Los metadatos no se usan para autorizar: la identidad efectiva es auth.uid().
create or replace function private.crear_participante_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nombre text;
  v_apellido text;
  v_documento text;
begin
  if coalesce(new.raw_user_meta_data ->> 'tipo_cuenta', '') <> 'participante' then
    return new;
  end if;

  v_nombre := trim(coalesce(new.raw_user_meta_data ->> 'nombre', ''));
  v_apellido := trim(coalesce(new.raw_user_meta_data ->> 'apellido', ''));
  v_documento := upper(regexp_replace(coalesce(new.raw_user_meta_data ->> 'documento', ''), '[^[:alnum:]]', '', 'g'));

  if v_nombre = '' or v_apellido = '' or length(v_documento) < 5 then
    raise exception using errcode = '22023', message = 'Nombre, apellido y documento son obligatorios.';
  end if;

  insert into public.participantes (id, nombre, apellido, documento)
  values (new.id, v_nombre, v_apellido, v_documento);

  return new;
end
$$;

drop trigger if exists on_auth_user_created_frame0_participante on auth.users;
create trigger on_auth_user_created_frame0_participante
  after insert on auth.users
  for each row execute function private.crear_participante_auth();

create or replace function private.calcular_puntos_fortuna(
  p_pred_local integer,
  p_pred_visitante integer,
  p_final_local integer,
  p_final_visitante integer
)
returns smallint
language sql
immutable
set search_path = ''
as $$
  select case
    when p_pred_local = p_final_local and p_pred_visitante = p_final_visitante then 5
    when sign(p_pred_local - p_pred_visitante) = sign(p_final_local - p_final_visitante) then 2
    else 0
  end::smallint
$$;

-- Auto-prueba minima del contrato 0/2/5 al aplicar la migracion.
do $$
begin
  if private.calcular_puntos_fortuna(2, 1, 2, 1) <> 5
    or private.calcular_puntos_fortuna(3, 1, 2, 0) <> 2
    or private.calcular_puntos_fortuna(1, 1, 0, 0) <> 2
    or private.calcular_puntos_fortuna(0, 1, 2, 0) <> 0 then
    raise exception 'La regla de puntaje Fortuna no cumple 0/2/5.';
  end if;
end
$$;

create or replace function private.recalcular_puntajes_partido_fortuna()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.estado <> 'finalizado' then
    delete from public.puntajes_fortuna pf
    using public.pronosticos_fortuna pr
    where pf.pronostico_id = pr.id
      and pr.partido_id = new.id;
    return new;
  end if;

  insert into public.puntajes_fortuna (
    pronostico_id, temporada_id, participante_id, puntos,
    goles_local_final, goles_visitante_final, evaluated_at
  )
  select
    pr.id,
    pr.temporada_id,
    pr.participante_id,
    private.calcular_puntos_fortuna(
      pr.goles_local, pr.goles_visitante, new.goles_local, new.goles_visitante
    ),
    new.goles_local,
    new.goles_visitante,
    now()
  from public.pronosticos_fortuna pr
  where pr.partido_id = new.id
  on conflict (pronostico_id) do update set
    puntos = excluded.puntos,
    goles_local_final = excluded.goles_local_final,
    goles_visitante_final = excluded.goles_visitante_final,
    evaluated_at = excluded.evaluated_at;

  return new;
end
$$;

drop trigger if exists recalcular_puntajes_partido_fortuna on public.partidos;
create trigger recalcular_puntajes_partido_fortuna
  after update of estado, goles_local, goles_visitante on public.partidos
  for each row execute function private.recalcular_puntajes_partido_fortuna();

-- ----------------------------
-- RPC PARTICIPANTE
-- ----------------------------

create or replace function public.solicitar_vinculo_jugador(p_jugador_id uuid)
returns public.solicitudes_vinculo_jugador
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_solicitud public.solicitudes_vinculo_jugador%rowtype;
begin
  if v_uid is null or not exists (
    select 1 from public.participantes p where p.id = v_uid and p.activo = true
  ) then
    raise exception using errcode = '42501', message = 'La cuenta participante no esta activa.';
  end if;

  if not exists (
    select 1 from public.jugadores j
    join public.equipos e on e.id = j.equipo_id
    where j.id = p_jugador_id and j.activo = true and e.activo = true
  ) then
    raise exception using errcode = '23503', message = 'El jugador seleccionado no esta activo.';
  end if;

  if exists (
    select 1 from public.solicitudes_vinculo_jugador s
    where (s.participante_id = v_uid or s.jugador_id = p_jugador_id)
      and s.estado in ('pendiente', 'aprobada')
  ) then
    raise exception using errcode = '23505', message = 'La cuenta o el jugador ya tienen un vinculo pendiente o aprobado.';
  end if;

  insert into public.solicitudes_vinculo_jugador (participante_id, jugador_id)
  values (v_uid, p_jugador_id)
  returning * into v_solicitud;

  return v_solicitud;
end
$$;

create or replace function public.guardar_pronostico_fortuna(
  p_partido_id uuid,
  p_goles_local integer,
  p_goles_visitante integer
)
returns public.pronosticos_fortuna
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_temporada_id uuid;
  v_partido public.partidos%rowtype;
  v_resultado public.pronosticos_fortuna%rowtype;
begin
  if v_uid is null or not exists (
    select 1 from public.participantes p where p.id = v_uid and p.activo = true
  ) then
    raise exception using errcode = '42501', message = 'La cuenta participante no esta activa.';
  end if;

  if p_goles_local not between 0 and 99 or p_goles_visitante not between 0 and 99 then
    raise exception using errcode = '22023', message = 'Los goles deben estar entre 0 y 99.';
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

  select * into v_partido
  from public.partidos
  where id = p_partido_id
  for share;

  if v_partido.id is null then
    raise exception using errcode = 'P0002', message = 'Partido no encontrado.';
  end if;

  if v_partido.estado <> 'programado' or v_partido.fecha_hora is null then
    raise exception using errcode = '22023', message = 'El partido no admite pronosticos.';
  end if;

  if now() >= v_partido.fecha_hora - interval '30 minutes' then
    raise exception using errcode = '22023', message = 'El pronostico cerro 30 minutos antes del partido.';
  end if;

  if v_partido.fecha_hora >= (
    select finaliza_at from public.temporadas_fortuna where id = v_temporada_id
  ) then
    raise exception using errcode = '22023', message = 'El partido queda fuera de la temporada Fortuna activa.';
  end if;

  insert into public.pronosticos_fortuna (
    temporada_id, participante_id, partido_id, goles_local, goles_visitante
  ) values (
    v_temporada_id, v_uid, p_partido_id, p_goles_local, p_goles_visitante
  )
  on conflict (temporada_id, participante_id, partido_id) do update set
    goles_local = excluded.goles_local,
    goles_visitante = excluded.goles_visitante,
    updated_at = now()
  returning * into v_resultado;

  return v_resultado;
end
$$;

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
    v_random := upper(encode(gen_random_bytes(10), 'hex'));
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

-- ----------------------------
-- RPC DELEGADO
-- ----------------------------

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
    and coalesce(ua.password_hash, '') = trim(coalesce(p_password, ''))
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
    and coalesce(ua.password_hash, '') = trim(coalesce(p_password, ''))
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

-- ----------------------------
-- RPC ADMINISTRADOR
-- ----------------------------

create or replace function public.guardar_temporada_fortuna(
  p_id uuid,
  p_nombre text,
  p_inicia_at timestamptz,
  p_finaliza_at timestamptz,
  p_estado text
)
returns public.temporadas_fortuna
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_resultado public.temporadas_fortuna%rowtype;
  v_estado_actual text;
begin
  if auth.uid() is null or not coalesce(public.is_admin_user(), false) then
    raise exception using errcode = '42501', message = 'Solo un administrador puede guardar temporadas.';
  end if;

  if nullif(trim(coalesce(p_nombre, '')), '') is null
    or p_inicia_at is null or p_finaliza_at is null
    or p_inicia_at >= p_finaliza_at
    or p_estado not in ('borrador', 'activa') then
    raise exception using errcode = '22023', message = 'Datos de temporada invalidos.';
  end if;

  if p_id is null then
    insert into public.temporadas_fortuna (nombre, inicia_at, finaliza_at, estado)
    values (trim(p_nombre), p_inicia_at, p_finaliza_at, p_estado)
    returning * into v_resultado;
  else
    select estado into v_estado_actual
    from public.temporadas_fortuna where id = p_id for update;
    if v_estado_actual is null then
      raise exception using errcode = 'P0002', message = 'Temporada no encontrada.';
    end if;
    if v_estado_actual = 'cerrada' then
      raise exception using errcode = '22023', message = 'Una temporada cerrada no puede reabrirse.';
    end if;

    update public.temporadas_fortuna
    set nombre = trim(p_nombre), inicia_at = p_inicia_at, finaliza_at = p_finaliza_at,
        estado = p_estado, updated_at = now()
    where id = p_id
    returning * into v_resultado;
  end if;

  return v_resultado;
end
$$;

create or replace function public.cerrar_temporada_fortuna(p_id uuid)
returns public.temporadas_fortuna
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_resultado public.temporadas_fortuna%rowtype;
begin
  if auth.uid() is null or not coalesce(public.is_admin_user(), false) then
    raise exception using errcode = '42501', message = 'Solo un administrador puede cerrar temporadas.';
  end if;

  update public.temporadas_fortuna
  set estado = 'cerrada', updated_at = now()
  where id = p_id and estado <> 'cerrada'
  returning * into v_resultado;

  if v_resultado.id is null then
    raise exception using errcode = 'P0002', message = 'Temporada no encontrada o ya cerrada.';
  end if;
  return v_resultado;
end
$$;

create or replace function public.guardar_tipo_voucher(
  p_id uuid,
  p_nombre text,
  p_descripcion text,
  p_costo_puntos integer,
  p_stock_total integer,
  p_vigencia_dias integer
)
returns public.tipos_voucher
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_resultado public.tipos_voucher%rowtype;
  v_consumidos bigint;
begin
  if auth.uid() is null or not coalesce(public.is_admin_user(), false) then
    raise exception using errcode = '42501', message = 'Solo un administrador puede guardar vouchers.';
  end if;
  if nullif(trim(coalesce(p_nombre, '')), '') is null
    or p_costo_puntos <= 0 or p_stock_total < 0 or p_vigencia_dias not between 1 and 3650 then
    raise exception using errcode = '22023', message = 'Datos de voucher invalidos.';
  end if;

  if p_id is null then
    insert into public.tipos_voucher (nombre, descripcion, costo_puntos, stock_total, vigencia_dias)
    values (trim(p_nombre), nullif(trim(coalesce(p_descripcion, '')), ''), p_costo_puntos, p_stock_total, p_vigencia_dias)
    returning * into v_resultado;
  else
    perform 1 from public.tipos_voucher where id = p_id for update;
    if not found then
      raise exception using errcode = 'P0002', message = 'Tipo de voucher no encontrado.';
    end if;

    select count(*) into v_consumidos
    from public.vouchers_emitidos ve
    where ve.tipo_voucher_id = p_id
      and (ve.estado = 'usado' or (ve.estado = 'emitido' and ve.vence_at > now()));
    if p_stock_total < v_consumidos then
      raise exception using errcode = '22023', message = 'El stock no puede ser menor a los vouchers consumidos o vigentes.';
    end if;

    update public.tipos_voucher
    set nombre = trim(p_nombre), descripcion = nullif(trim(coalesce(p_descripcion, '')), ''),
        costo_puntos = p_costo_puntos, stock_total = p_stock_total,
        vigencia_dias = p_vigencia_dias, updated_at = now()
    where id = p_id
    returning * into v_resultado;
  end if;
  return v_resultado;
end
$$;

create or replace function public.cambiar_estado_tipo_voucher(p_id uuid, p_activo boolean)
returns public.tipos_voucher
language plpgsql
security definer
set search_path = ''
as $$
declare v_resultado public.tipos_voucher%rowtype;
begin
  if auth.uid() is null or not coalesce(public.is_admin_user(), false) then
    raise exception using errcode = '42501', message = 'Solo un administrador puede cambiar vouchers.';
  end if;
  update public.tipos_voucher set activo = p_activo, updated_at = now()
  where id = p_id returning * into v_resultado;
  if v_resultado.id is null then
    raise exception using errcode = 'P0002', message = 'Tipo de voucher no encontrado.';
  end if;
  return v_resultado;
end
$$;

create or replace function public.anular_voucher_fortuna(p_id uuid, p_motivo text)
returns public.vouchers_emitidos
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_resultado public.vouchers_emitidos%rowtype;
  v_admin_id uuid;
begin
  if auth.uid() is null or not coalesce(public.is_admin_user(), false) then
    raise exception using errcode = '42501', message = 'Solo un administrador puede anular vouchers.';
  end if;
  if nullif(trim(coalesce(p_motivo, '')), '') is null then
    raise exception using errcode = '22023', message = 'El motivo de anulacion es obligatorio.';
  end if;

  select ua.id into v_admin_id
  from public.usuarios_app ua
  where ua.activo = true
    and ua.rol in ('admin', 'superadmin')
    and (
      ua.id = auth.uid()
      or lower(ua.usuario) = lower(auth.jwt() ->> 'email')
      or lower(ua.usuario) = lower(split_part(auth.jwt() ->> 'email', '@', 1))
    )
  order by case when ua.id = auth.uid() then 0 else 1 end
  limit 1;

  update public.vouchers_emitidos
  set estado = 'anulado', anulado_at = now(), anulado_por = v_admin_id,
      motivo_anulacion = trim(p_motivo)
  where id = p_id and estado = 'emitido'
  returning * into v_resultado;
  if v_resultado.id is null then
    raise exception using errcode = '22023', message = 'Solo se pueden anular vouchers emitidos.';
  end if;
  return v_resultado;
end
$$;

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
    and coalesce(ua.password_hash, '') = trim(coalesce(p_admin_password, ''))
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
      lower(trim(p_usuario)), trim(p_password), 'constatador', true)
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
          then password_hash else trim(p_password) end,
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

-- Extiende la baja logica existente sin cambiar su firma.
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
    and coalesce(ua.password_hash, '') = trim(coalesce(p_admin_password, ''))
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

-- ----------------------------
-- RPC CONSTATADOR
-- ----------------------------

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
    and coalesce(ua.password_hash, '') = trim(coalesce(p_password, ''))
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
    and coalesce(ua.password_hash, '') = trim(coalesce(p_password, ''))
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

-- ----------------------------
-- RLS Y PRIVILEGIOS EXPLICITOS
-- ----------------------------

alter table public.participantes enable row level security;
alter table public.solicitudes_vinculo_jugador enable row level security;
alter table public.temporadas_fortuna enable row level security;
alter table public.pronosticos_fortuna enable row level security;
alter table public.puntajes_fortuna enable row level security;
alter table public.tipos_voucher enable row level security;
alter table public.vouchers_emitidos enable row level security;

revoke all on table public.participantes from public, anon, authenticated;
revoke all on table public.solicitudes_vinculo_jugador from public, anon, authenticated;
revoke all on table public.temporadas_fortuna from public, anon, authenticated;
revoke all on table public.pronosticos_fortuna from public, anon, authenticated;
revoke all on table public.puntajes_fortuna from public, anon, authenticated;
revoke all on table public.tipos_voucher from public, anon, authenticated;
revoke all on table public.vouchers_emitidos from public, anon, authenticated;

grant select on table public.participantes to authenticated;
grant select on table public.solicitudes_vinculo_jugador to authenticated;
grant select on table public.temporadas_fortuna to authenticated;
grant select on table public.pronosticos_fortuna to authenticated;
grant select on table public.puntajes_fortuna to authenticated;
grant select on table public.tipos_voucher to authenticated;
grant select on table public.vouchers_emitidos to authenticated;

drop policy if exists "participantes_ven_perfil" on public.participantes;
create policy "participantes_ven_perfil" on public.participantes for select to authenticated
using ((select auth.uid()) = id or (select public.is_admin_user()));

drop policy if exists "participantes_ven_solicitudes" on public.solicitudes_vinculo_jugador;
create policy "participantes_ven_solicitudes" on public.solicitudes_vinculo_jugador for select to authenticated
using ((select auth.uid()) = participante_id or (select public.is_admin_user()));

drop policy if exists "participantes_ven_temporadas" on public.temporadas_fortuna;
create policy "participantes_ven_temporadas" on public.temporadas_fortuna for select to authenticated
using (estado <> 'borrador' or (select public.is_admin_user()));

drop policy if exists "participantes_ven_pronosticos" on public.pronosticos_fortuna;
create policy "participantes_ven_pronosticos" on public.pronosticos_fortuna for select to authenticated
using ((select auth.uid()) = participante_id or (select public.is_admin_user()));

drop policy if exists "participantes_ven_puntajes" on public.puntajes_fortuna;
create policy "participantes_ven_puntajes" on public.puntajes_fortuna for select to authenticated
using ((select auth.uid()) = participante_id or (select public.is_admin_user()));

drop policy if exists "participantes_ven_tipos_voucher" on public.tipos_voucher;
create policy "participantes_ven_tipos_voucher" on public.tipos_voucher for select to authenticated
using (
  (activo and exists (
    select 1 from public.participantes p
    where p.id = (select auth.uid()) and p.activo = true
  )) or (select public.is_admin_user())
);

drop policy if exists "participantes_ven_vouchers" on public.vouchers_emitidos;
create policy "participantes_ven_vouchers" on public.vouchers_emitidos for select to authenticated
using ((select auth.uid()) = participante_id or (select public.is_admin_user()));

revoke all on function public.solicitar_vinculo_jugador(uuid) from public;
revoke all on function public.guardar_pronostico_fortuna(uuid, integer, integer) from public;
revoke all on function public.canjear_voucher(uuid) from public;
revoke all on function public.listar_solicitudes_jugador_delegado(text, text) from public;
revoke all on function public.resolver_solicitud_jugador_delegado(text, text, uuid, boolean, text) from public;
revoke all on function public.guardar_temporada_fortuna(uuid, text, timestamptz, timestamptz, text) from public;
revoke all on function public.cerrar_temporada_fortuna(uuid) from public;
revoke all on function public.guardar_tipo_voucher(uuid, text, text, integer, integer, integer) from public;
revoke all on function public.cambiar_estado_tipo_voucher(uuid, boolean) from public;
revoke all on function public.anular_voucher_fortuna(uuid, text) from public;
revoke all on function public.guardar_constatador_admin(text, text, uuid, text, text, text, text, text, text) from public;
revoke all on function public.cambiar_estado_usuario_admin(text, text, text, uuid, boolean) from public;
revoke all on function public.consultar_voucher_constatador(text, text, text) from public;
revoke all on function public.confirmar_entrega_voucher_constatador(text, text, uuid) from public;

grant execute on function public.solicitar_vinculo_jugador(uuid) to authenticated;
grant execute on function public.guardar_pronostico_fortuna(uuid, integer, integer) to authenticated;
grant execute on function public.canjear_voucher(uuid) to authenticated;
grant execute on function public.listar_solicitudes_jugador_delegado(text, text) to anon, authenticated;
grant execute on function public.resolver_solicitud_jugador_delegado(text, text, uuid, boolean, text) to anon, authenticated;
grant execute on function public.guardar_temporada_fortuna(uuid, text, timestamptz, timestamptz, text) to authenticated;
grant execute on function public.cerrar_temporada_fortuna(uuid) to authenticated;
grant execute on function public.guardar_tipo_voucher(uuid, text, text, integer, integer, integer) to authenticated;
grant execute on function public.cambiar_estado_tipo_voucher(uuid, boolean) to authenticated;
grant execute on function public.anular_voucher_fortuna(uuid, text) to authenticated;
grant execute on function public.guardar_constatador_admin(text, text, uuid, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.cambiar_estado_usuario_admin(text, text, text, uuid, boolean) to anon, authenticated;
grant execute on function public.consultar_voucher_constatador(text, text, text) to anon, authenticated;
grant execute on function public.confirmar_entrega_voucher_constatador(text, text, uuid) to anon, authenticated;

revoke all on function private.crear_participante_auth() from public, anon, authenticated;
revoke all on function private.calcular_puntos_fortuna(integer, integer, integer, integer) from public, anon, authenticated;
revoke all on function private.recalcular_puntajes_partido_fortuna() from public, anon, authenticated;

comment on table public.participantes is 'Perfiles privados para cuentas publicas de Fortuna autenticadas con Supabase Auth.';
comment on column public.vouchers_emitidos.estado is 'Expirado se deriva de vence_at; no se persiste ni requiere cron.';
