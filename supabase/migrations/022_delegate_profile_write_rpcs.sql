-- Escrituras seguras del perfil delegado con login propio de Frame0.
-- No depende de Supabase Auth; valida usuarios_app + relacion delegados.

alter table public.equipos
  add column if not exists abreviatura text,
  add column if not exists nombre_corto text,
  add column if not exists descripcion text,
  add column if not exists color_terciario text;

create or replace function public.guardar_equipo_delegado(
  p_usuario text,
  p_password text,
  p_equipo_id uuid,
  p_valor jsonb
)
returns public.equipos
language plpgsql
security definer
set search_path = public
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

  if coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
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
set search_path = public
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

  if coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
    raise exception 'Contrasena incorrecta.';
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

create or replace function public.cambiar_estado_jugador_delegado(
  p_usuario text,
  p_password text,
  p_jugador_id uuid,
  p_activo boolean
)
returns public.jugadores
language plpgsql
security definer
set search_path = public
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

  if coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
    raise exception 'Contrasena incorrecta.';
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

revoke all on function public.guardar_equipo_delegado(text, text, uuid, jsonb) from public;
grant execute on function public.guardar_equipo_delegado(text, text, uuid, jsonb) to anon, authenticated;

revoke all on function public.guardar_jugador_delegado(text, text, uuid, uuid, jsonb) from public;
grant execute on function public.guardar_jugador_delegado(text, text, uuid, uuid, jsonb) to anon, authenticated;

revoke all on function public.cambiar_estado_jugador_delegado(text, text, uuid, boolean) from public;
grant execute on function public.cambiar_estado_jugador_delegado(text, text, uuid, boolean) to anon, authenticated;
