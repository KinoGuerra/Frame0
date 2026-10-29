-- Catalogo publico sin datos personales, plazo local de pronosticos y validacion por administradores.

create or replace function public.listar_catalogo_fortuna()
returns table (
  id uuid, nombre text, descripcion text, costo_puntos integer,
  vigencia_dias integer, disponibles bigint
)
language sql stable security definer set search_path = '' as $$
  select tv.id, tv.nombre, tv.descripcion, tv.costo_puntos,
    tv.vigencia_dias, greatest(tv.stock_total::bigint - count(ve.id), 0) as disponibles
  from public.tipos_voucher tv
  left join public.vouchers_emitidos ve on ve.tipo_voucher_id = tv.id
    and (ve.estado = 'usado' or (ve.estado = 'emitido' and ve.vence_at > now()))
  where tv.activo = true
  group by tv.id
  order by tv.costo_puntos, tv.nombre
$$;

revoke all on function public.listar_catalogo_fortuna() from public, anon, authenticated;
grant execute on function public.listar_catalogo_fortuna() to anon, authenticated, service_role;

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

  if (now() at time zone 'America/Argentina/Buenos_Aires')::date >=
    (v_partido.fecha_hora at time zone 'America/Argentina/Buenos_Aires')::date then
    raise exception using errcode = '22023', message = 'El pronostico cerro al comenzar el dia del partido.';
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
    and ua.rol in ('constatador', 'admin', 'superadmin') and ua.activo = true
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
    and public.verificar_password_frame0(ua.password_hash, p_password)
    and ua.rol in ('constatador', 'admin', 'superadmin') and ua.activo = true
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

create or replace function public.listar_entregas_constatador(
  p_usuario text, p_password text, p_pagina integer default 1
)
returns table (
  id uuid, codigo text, producto text, descripcion text, entregado_at timestamptz,
  titular text, documento_parcial text, constatador text, correo_estado text, total bigint
)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.usuarios_app ua
    where lower(trim(ua.usuario)) = lower(trim(coalesce(p_usuario, '')))
      and ua.rol in ('constatador', 'admin', 'superadmin') and ua.activo = true
      and public.verificar_password_frame0(ua.password_hash, p_password)
  ) then
    raise exception using errcode = '42501', message = 'Credenciales de constatador invalidas.';
  end if;

  return query
  select ve.id, ve.codigo, ve.producto_nombre, coalesce(ve.producto_descripcion, ''), ve.usado_at,
    concat_ws(' ', p.nombre, p.apellido), '••••' || right(p.documento, 4),
    coalesce(nullif(trim(concat_ws(' ', ua.nombre, ua.apellido)), ''), ua.usuario, '-'),
    coalesce(c.estado, 'sin registro'), count(*) over()
  from public.vouchers_emitidos ve
  join public.participantes p on p.id = ve.participante_id
  left join public.usuarios_app ua on ua.id = ve.usado_por
  left join public.comprobantes_fortuna c on c.voucher_id = ve.id and c.tipo = 'entrega'
  where ve.estado = 'usado'
  order by ve.usado_at desc, ve.id desc
  limit 50 offset (greatest(coalesce(p_pagina, 1), 1) - 1) * 50;
end;
$$;
