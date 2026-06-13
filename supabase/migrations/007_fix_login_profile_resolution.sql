-- ============================================================
-- FRAME0 - FIX LOGIN USUARIO -> SUPABASE AUTH
-- Permite resolver "admin" o "admin@frame0.local" contra
-- public.usuarios_app.usuario antes de autenticar en Supabase Auth.
-- ============================================================

create or replace function public.resolve_login_profile(login_usuario text)
returns table (
  id uuid,
  usuario text,
  auth_email text,
  rol text,
  activo boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ua.id,
    ua.usuario,
    lower(ua.usuario) || '@frame0.local' as auth_email,
    ua.rol,
    ua.activo
  from public.usuarios_app ua
  where lower(trim(ua.usuario)) = lower(trim(
    case
      when position('@' in coalesce(login_usuario, '')) > 0
        then split_part(login_usuario, '@', 1)
      else coalesce(login_usuario, '')
    end
  ))
  limit 1
$$;

grant execute on function public.resolve_login_profile(text) to anon, authenticated;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select ua.rol
  from public.usuarios_app ua
  where ua.activo = true
    and (
      ua.id = auth.uid()
      or lower(ua.usuario) = lower(auth.jwt() ->> 'email')
      or lower(ua.usuario) = lower(split_part(auth.jwt() ->> 'email', '@', 1))
    )
  order by case when ua.id = auth.uid() then 0 else 1 end
  limit 1
$$;

drop policy if exists "usuarios_ven_su_perfil" on public.usuarios_app;
create policy "usuarios_ven_su_perfil"
on public.usuarios_app for select
to authenticated
using (
  id = auth.uid()
  or lower(usuario) = lower(auth.jwt() ->> 'email')
  or lower(usuario) = lower(split_part(auth.jwt() ->> 'email', '@', 1))
  or public.is_admin_user()
);
