-- Conserva planillas escaneadas en privado y registra borradores OCR sin tocar datos oficiales.

create table if not exists public.planillas_partido (
  id uuid primary key default gen_random_uuid(),
  partido_id uuid not null references public.partidos(id) on delete cascade,
  veedor_usuario_id uuid not null references public.usuarios_app(id) on delete restrict,
  archivo_path text not null unique,
  mime_type text not null,
  tamano_bytes integer not null,
  resultado_ocr jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint planillas_partido_mime_type_check check (
    mime_type in ('image/jpeg', 'image/png', 'image/webp', 'application/pdf')
  ),
  constraint planillas_partido_tamano_check check (
    tamano_bytes > 0 and tamano_bytes <= 8388608
  ),
  constraint planillas_partido_resultado_check check (
    jsonb_typeof(resultado_ocr) = 'object'
  )
);

create index if not exists planillas_partido_partido_created_idx
  on public.planillas_partido(partido_id, created_at desc);

create index if not exists planillas_partido_veedor_usuario_id_idx
  on public.planillas_partido(veedor_usuario_id);

alter table public.planillas_partido enable row level security;
revoke all on table public.planillas_partido from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'match-sheets',
  'match-sheets',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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
set search_path = public
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
    or coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
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

revoke all on function public.registrar_planilla_partido_veedor(text, text, uuid, text, text, integer, jsonb)
  from public, anon, authenticated;
grant execute on function public.registrar_planilla_partido_veedor(text, text, uuid, text, text, integer, jsonb)
  to service_role;
