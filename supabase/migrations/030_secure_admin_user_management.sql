-- ============================================================
-- FRAME0 - GESTION SEGURA DE DELEGADOS Y VEEDORES
-- Mantiene las credenciales fuera de escrituras directas desde el
-- navegador y alinea el esquema final eliminando el email legado.
-- ============================================================

alter table public.usuarios_app
drop column if exists email;

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
    and coalesce(ua.password_hash, '') = trim(coalesce(p_admin_password, ''))
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
      lower(trim(p_usuario)), trim(p_password), 'delegado', true
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
          else trim(p_password)
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
    and coalesce(ua.password_hash, '') = trim(coalesce(p_admin_password, ''))
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
      lower(trim(p_usuario)), trim(p_password), 'veedor', true
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
          else trim(p_password)
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
  select ua.id
    into v_admin_id
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(coalesce(p_admin_usuario, '')))
    and coalesce(ua.password_hash, '') = trim(coalesce(p_admin_password, ''))
    and ua.rol in ('admin', 'superadmin')
    and ua.activo = true
  limit 1;

  if v_admin_id is null then
    raise exception using errcode = '42501', message = 'Credenciales de administrador inválidas.';
  end if;

  if p_tipo = 'delegado' then
    select ua.id into v_usuario_id
    from public.usuarios_app ua
    where ua.id = p_registro_id and ua.rol = 'delegado'
    limit 1;
  elsif p_tipo = 'veedor' then
    select v.usuario_id into v_usuario_id
    from public.veedores v
    join public.usuarios_app ua on ua.id = v.usuario_id and ua.rol = 'veedor'
    where v.id = p_registro_id
    limit 1;
  else
    raise exception using errcode = '22023', message = 'Tipo de usuario inválido.';
  end if;

  if v_usuario_id is null then
    raise exception using errcode = 'P0002', message = 'No se encontró el usuario solicitado.';
  end if;

  update public.usuarios_app set activo = p_activo where id = v_usuario_id;

  if p_tipo = 'delegado' then
    update public.delegados set activo = p_activo where usuario_id = v_usuario_id;
  else
    update public.veedores set activo = p_activo where id = p_registro_id;
  end if;

  return true;
end
$$;

revoke all on function public.guardar_delegado_admin(text, text, uuid, text, text, text, text, text, text, uuid) from public;
revoke all on function public.guardar_veedor_admin(text, text, uuid, text, text, text, text, text, text) from public;
revoke all on function public.cambiar_estado_usuario_admin(text, text, text, uuid, boolean) from public;
grant execute on function public.guardar_delegado_admin(text, text, uuid, text, text, text, text, text, text, uuid) to anon, authenticated;
grant execute on function public.guardar_veedor_admin(text, text, uuid, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.cambiar_estado_usuario_admin(text, text, text, uuid, boolean) to anon, authenticated;

revoke insert, update on table public.usuarios_app from anon, authenticated;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'usuarios_app'
      and column_name = 'email'
  ) then
    raise exception 'La columna email legada continúa presente en usuarios_app.';
  end if;

  if has_table_privilege('anon', 'public.usuarios_app', 'insert')
    or has_table_privilege('anon', 'public.usuarios_app', 'update') then
    raise exception 'usuarios_app conserva permisos de escritura anónimos directos.';
  end if;
end
$$;
