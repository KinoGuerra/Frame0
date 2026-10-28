-- Comprobantes transaccionales y consulta de entregas de Fortuna.
-- Aplicar despues de 20261028000000_archive_previous_tournament.sql.

create or replace function private.exigir_email_participante()
returns trigger language plpgsql set search_path = '' as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'tipo_cuenta', '') = 'participante'
    and nullif(trim(new.email), '') is null then
    raise exception using errcode = '22023', message = 'El correo electronico es obligatorio para Fortuna.';
  end if;
  return new;
end;
$$;

drop trigger if exists exigir_email_participante on auth.users;
create trigger exigir_email_participante before insert or update of email, raw_user_meta_data on auth.users
  for each row execute function private.exigir_email_participante();

alter table public.vouchers_emitidos
  add column if not exists producto_descripcion text;

update public.vouchers_emitidos ve
set producto_descripcion = tv.descripcion
from public.tipos_voucher tv
where ve.tipo_voucher_id = tv.id and ve.producto_descripcion is null;

create table if not exists public.comprobantes_fortuna (
  id uuid primary key default gen_random_uuid(),
  voucher_id uuid not null references public.vouchers_emitidos(id) on delete restrict,
  tipo text not null check (tipo in ('canje', 'entrega')),
  destino_email text,
  titular_nombre text not null,
  producto_nombre text not null,
  producto_descripcion text,
  codigo text not null,
  costo_puntos integer not null,
  emitido_at timestamptz not null,
  vence_at timestamptz not null,
  entregado_at timestamptz,
  constatador_nombre text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'procesando', 'enviado', 'fallido')),
  intentos integer not null default 0,
  siguiente_intento_at timestamptz not null default now(),
  bloqueado_at timestamptz,
  enviado_at timestamptz,
  proveedor_id text,
  ultimo_error text,
  created_at timestamptz not null default now(),
  unique (voucher_id, tipo)
);

create index if not exists comprobantes_fortuna_pendientes_idx
  on public.comprobantes_fortuna (siguiente_intento_at, created_at)
  where estado in ('pendiente', 'procesando');

alter table public.comprobantes_fortuna enable row level security;
revoke all on public.comprobantes_fortuna from public, anon, authenticated;
grant select on public.comprobantes_fortuna to authenticated;
grant select, insert, update on public.comprobantes_fortuna to service_role;
drop policy if exists admin_lee_comprobantes_fortuna on public.comprobantes_fortuna;
create policy admin_lee_comprobantes_fortuna on public.comprobantes_fortuna
  for select to authenticated using ((select public.is_admin_user()));

create or replace function private.preparar_voucher_fortuna()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  select descripcion into new.producto_descripcion
  from public.tipos_voucher where id = new.tipo_voucher_id;
  return new;
end;
$$;

drop trigger if exists preparar_voucher_fortuna on public.vouchers_emitidos;
create trigger preparar_voucher_fortuna before insert on public.vouchers_emitidos
  for each row execute function private.preparar_voucher_fortuna();

create or replace function private.encolar_comprobante_fortuna()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_email text;
  v_titular text;
  v_constatador text;
  v_tipo text;
begin
  if tg_op = 'INSERT' then
    v_tipo := 'canje';
  elsif old.estado <> 'usado' and new.estado = 'usado' then
    v_tipo := 'entrega';
  else
    return new;
  end if;

  select nullif(trim(u.email), ''), concat_ws(' ', p.nombre, p.apellido)
    into v_email, v_titular
  from public.participantes p
  join auth.users u on u.id = p.id
  where p.id = new.participante_id;

  if v_tipo = 'entrega' then
    select coalesce(nullif(trim(concat_ws(' ', nombre, apellido)), ''), usuario)
      into v_constatador
    from public.usuarios_app where id = new.usado_por;
  end if;

  insert into public.comprobantes_fortuna (
    voucher_id, tipo, destino_email, titular_nombre, producto_nombre,
    producto_descripcion, codigo, costo_puntos, emitido_at, vence_at,
    entregado_at, constatador_nombre, estado, ultimo_error
  ) values (
    new.id, v_tipo, v_email, coalesce(v_titular, 'Participante'), new.producto_nombre,
    new.producto_descripcion, new.codigo, new.costo_puntos, new.emitido_at, new.vence_at,
    case when v_tipo = 'entrega' then new.usado_at else null end, v_constatador,
    case when v_email is null then 'fallido' else 'pendiente' end,
    case when v_email is null then 'No hay un correo de destino en la cuenta.' else null end
  ) on conflict (voucher_id, tipo) do nothing;

  return new;
end;
$$;

drop trigger if exists encolar_comprobante_fortuna on public.vouchers_emitidos;
create trigger encolar_comprobante_fortuna
  after insert or update of estado on public.vouchers_emitidos
  for each row execute function private.encolar_comprobante_fortuna();

-- Solo una Edge Function con service_role puede reclamar y finalizar envios.
create or replace function public.tomar_comprobantes_fortuna(p_limite integer default 20)
returns setof public.comprobantes_fortuna
language plpgsql security definer set search_path = '' as $$
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'Acceso no autorizado.';
  end if;

  update public.comprobantes_fortuna
  set estado = 'fallido', ultimo_error = 'Se agotaron los intentos de envio.'
  where estado = 'procesando' and bloqueado_at < now() - interval '5 minutes' and intentos >= 5;

  return query
  update public.comprobantes_fortuna c
  set estado = 'procesando', intentos = c.intentos + 1, bloqueado_at = now()
  where c.id in (
    select id from public.comprobantes_fortuna
    where ((estado = 'pendiente' and siguiente_intento_at <= now())
      or (estado = 'procesando' and bloqueado_at < now() - interval '5 minutes'))
      and intentos < 5
    order by siguiente_intento_at, created_at
    for update skip locked
    limit least(greatest(coalesce(p_limite, 20), 1), 20)
  )
  returning c.*;
end;
$$;

create or replace function public.finalizar_comprobante_fortuna(
  p_id uuid, p_intentos integer, p_proveedor_id text, p_error text
)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'Acceso no autorizado.';
  end if;

  update public.comprobantes_fortuna
  set estado = case when nullif(p_proveedor_id, '') is not null then 'enviado'
    when intentos >= 5 then 'fallido' else 'pendiente' end,
    enviado_at = case when nullif(p_proveedor_id, '') is not null then now() else enviado_at end,
    proveedor_id = nullif(p_proveedor_id, ''),
    ultimo_error = case when nullif(p_proveedor_id, '') is not null then null else left(coalesce(p_error, 'Error de envio.'), 500) end,
    siguiente_intento_at = case when nullif(p_proveedor_id, '') is not null then siguiente_intento_at
      else now() + case intentos when 1 then interval '1 minute' when 2 then interval '5 minutes'
        when 3 then interval '15 minutes' else interval '60 minutes' end end,
    bloqueado_at = null
  where id = p_id and estado = 'procesando' and intentos = p_intentos;

  if not found then
    raise exception using errcode = 'P0002', message = 'Comprobante no reclamado o ya finalizado.';
  end if;
end;
$$;

create or replace function public.reintentar_comprobante_fortuna(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not coalesce(public.is_admin_user(), false) then
    raise exception using errcode = '42501', message = 'Solo un administrador puede reintentar el envio.';
  end if;
  update public.comprobantes_fortuna
  set estado = 'pendiente', intentos = 0, siguiente_intento_at = now(), ultimo_error = null
  where id = p_id and estado = 'fallido' and destino_email is not null;
  if not found then
    raise exception using errcode = '22023', message = 'El comprobante no se puede reintentar.';
  end if;
end;
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
      and ua.rol = 'constatador' and ua.activo = true
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

revoke all on function private.preparar_voucher_fortuna() from public, anon, authenticated;
revoke all on function private.exigir_email_participante() from public, anon, authenticated;
revoke all on function private.encolar_comprobante_fortuna() from public, anon, authenticated;
revoke all on function public.tomar_comprobantes_fortuna(integer) from public, anon, authenticated;
revoke all on function public.finalizar_comprobante_fortuna(uuid, integer, text, text) from public, anon, authenticated;
revoke all on function public.reintentar_comprobante_fortuna(uuid) from public, anon, authenticated;
revoke all on function public.listar_entregas_constatador(text, text, integer) from public, anon, authenticated;
grant execute on function public.tomar_comprobantes_fortuna(integer) to service_role;
grant execute on function public.finalizar_comprobante_fortuna(uuid, integer, text, text) to service_role;
grant execute on function public.reintentar_comprobante_fortuna(uuid) to authenticated;
grant execute on function public.listar_entregas_constatador(text, text, integer) to anon, authenticated;
