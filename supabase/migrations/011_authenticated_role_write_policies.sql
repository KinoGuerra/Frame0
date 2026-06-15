-- ============================================================
-- FRAME0 - ESCRITURAS POR ROL CON SUPABASE AUTH
-- El frontend valida usuarios_app.password_hash y luego abre/crea
-- sesion Auth con usuario@frame0.local para que RLS pueda aplicar rol.
-- ============================================================

create or replace function public.current_user_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select ua.id
  from public.usuarios_app ua
  where ua.activo = true
    and (
      ua.id = auth.uid()
      or lower(ua.usuario) = lower(split_part(auth.jwt() ->> 'email', '@', 1))
    )
  limit 1
$$;

drop policy if exists "delegado_escribe_jugadores_propios" on public.jugadores;
create policy "delegado_escribe_jugadores_propios"
on public.jugadores for all
to authenticated
using (
  public.current_user_role() = 'delegado'
  and exists (
    select 1
    from public.delegados d
    where d.activo = true
      and d.usuario_id = public.current_user_profile_id()
      and d.equipo_id = jugadores.equipo_id
  )
)
with check (
  public.current_user_role() = 'delegado'
  and exists (
    select 1
    from public.delegados d
    where d.activo = true
      and d.usuario_id = public.current_user_profile_id()
      and d.equipo_id = jugadores.equipo_id
  )
);

drop policy if exists "delegado_actualiza_equipo_propio" on public.equipos;
create policy "delegado_actualiza_equipo_propio"
on public.equipos for update
to authenticated
using (
  public.current_user_role() = 'delegado'
  and exists (
    select 1
    from public.delegados d
    where d.activo = true
      and d.usuario_id = public.current_user_profile_id()
      and d.equipo_id = equipos.id
  )
)
with check (
  public.current_user_role() = 'delegado'
  and exists (
    select 1
    from public.delegados d
    where d.activo = true
      and d.usuario_id = public.current_user_profile_id()
      and d.equipo_id = equipos.id
  )
);
