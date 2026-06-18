-- Marca como leidas las resoluciones disciplinarias vistas por un delegado.

create index if not exists sanciones_delegado_notificacion_idx
on public.sanciones(jugador_id, notificada_delegado, resuelta_at);

create or replace function public.marcar_resolucion_notificada_delegado(
  p_usuario text,
  p_password text,
  p_sancion_id uuid
)
returns public.sanciones
language plpgsql
security definer
set search_path = public
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

  if coalesce(v_usuario.password_hash, '') <> trim(coalesce(p_password, '')) then
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

revoke all on function public.marcar_resolucion_notificada_delegado(text, text, uuid) from public;
grant execute on function public.marcar_resolucion_notificada_delegado(text, text, uuid) to anon, authenticated;
