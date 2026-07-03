-- Publicación del diario como transición explícita y controlada por la base.

create or replace function public.publicar_diario_noticias(
  p_usuario text,
  p_password text,
  p_edicion_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
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
    or coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
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

revoke all on function public.publicar_diario_noticias(text, text, uuid) from public;
grant execute on function public.publicar_diario_noticias(text, text, uuid) to anon, authenticated;
