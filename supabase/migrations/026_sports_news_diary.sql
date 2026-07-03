-- Diario deportivo Frame0: ediciones por fecha y páginas por categoría/división.

create table if not exists public.fechas_deportivas (
  id uuid primary key default gen_random_uuid(),
  numero_fecha integer not null check (numero_fecha > 0),
  fecha_desde date not null,
  fecha_hasta date not null,
  fecha_edicion date not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'cerrada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fechas_deportivas_rango_check check (fecha_desde <= fecha_hasta),
  constraint fechas_deportivas_numero_unique unique (numero_fecha)
);

create table if not exists public.noticias_ediciones (
  id uuid primary key default gen_random_uuid(),
  fecha_deportiva_id uuid not null references public.fechas_deportivas(id) on delete restrict,
  titulo text not null default 'Frame0' check (length(trim(titulo)) between 1 and 150),
  slogan text check (slogan is null or length(slogan) <= 200),
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado', 'baja')),
  generado_por_ia boolean not null default false,
  fecha_publicacion timestamptz,
  fecha_baja timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint noticias_ediciones_fecha_unique unique (fecha_deportiva_id)
);

create table if not exists public.noticias_paginas (
  id uuid primary key default gen_random_uuid(),
  noticia_edicion_id uuid not null references public.noticias_ediciones(id) on delete cascade,
  categoria_id uuid not null references public.categorias(id) on delete restrict,
  division_id uuid not null references public.divisiones(id) on delete restrict,
  numero_pagina integer not null check (numero_pagina > 0),
  titulo text check (titulo is null or length(titulo) <= 150),
  resumen_general text,
  contenido_texto text,
  contenido_json jsonb not null default '{}'::jsonb,
  tabla_posiciones_snapshot jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint noticias_paginas_edicion_division_unique unique (noticia_edicion_id, division_id)
);

create index if not exists noticias_ediciones_publicadas_idx
  on public.noticias_ediciones(fecha_publicacion desc)
  where estado = 'publicado';
create index if not exists noticias_paginas_edicion_orden_idx
  on public.noticias_paginas(noticia_edicion_id, numero_pagina);
create index if not exists noticias_paginas_categoria_idx on public.noticias_paginas(categoria_id);
create index if not exists noticias_paginas_division_idx on public.noticias_paginas(division_id);

alter table public.fechas_deportivas enable row level security;
alter table public.noticias_ediciones enable row level security;
alter table public.noticias_paginas enable row level security;

drop policy if exists "fechas_deportivas_publicadas_select" on public.fechas_deportivas;
create policy "fechas_deportivas_publicadas_select" on public.fechas_deportivas
  for select to anon, authenticated
  using (exists (
    select 1 from public.noticias_ediciones e
    where e.fecha_deportiva_id = fechas_deportivas.id and e.estado = 'publicado'
  ));

drop policy if exists "noticias_ediciones_publicadas_select" on public.noticias_ediciones;
create policy "noticias_ediciones_publicadas_select" on public.noticias_ediciones
  for select to anon, authenticated using (estado = 'publicado');

drop policy if exists "noticias_paginas_publicadas_select" on public.noticias_paginas;
create policy "noticias_paginas_publicadas_select" on public.noticias_paginas
  for select to anon, authenticated
  using (exists (
    select 1 from public.noticias_ediciones e
    where e.id = noticias_paginas.noticia_edicion_id and e.estado = 'publicado'
  ));

grant select on public.fechas_deportivas, public.noticias_ediciones, public.noticias_paginas to anon, authenticated;

create or replace function public.guardar_diario_noticias(
  p_usuario text,
  p_password text,
  p_edicion jsonb,
  p_paginas jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
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
    or coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
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

create or replace function public.dar_baja_diario_noticias(p_usuario text, p_password text, p_edicion_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_usuario public.usuarios_app%rowtype;
begin
  select * into v_usuario from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, ''))) and activo = true limit 1;
  if not found or v_usuario.rol not in ('admin', 'superadmin')
    or coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
    raise exception 'Credenciales de administrador inválidas.';
  end if;
  update public.noticias_ediciones set estado = 'baja', fecha_baja = now(), updated_at = now()
  where id = p_edicion_id;
  if not found then raise exception 'Diario no encontrado.'; end if;
end;
$$;

create or replace function public.listar_diarios_noticias_admin(p_usuario text, p_password text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_usuario public.usuarios_app%rowtype; v_resultado jsonb;
begin
  select * into v_usuario from public.usuarios_app
  where lower(trim(usuario)) = lower(trim(coalesce(p_usuario, ''))) and activo = true limit 1;
  if not found or v_usuario.rol not in ('admin', 'superadmin')
    or coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
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

revoke all on function public.guardar_diario_noticias(text, text, jsonb, jsonb) from public;
revoke all on function public.dar_baja_diario_noticias(text, text, uuid) from public;
revoke all on function public.listar_diarios_noticias_admin(text, text) from public;
grant execute on function public.guardar_diario_noticias(text, text, jsonb, jsonb) to anon, authenticated;
grant execute on function public.dar_baja_diario_noticias(text, text, uuid) to anon, authenticated;
grant execute on function public.listar_diarios_noticias_admin(text, text) to anon, authenticated;
