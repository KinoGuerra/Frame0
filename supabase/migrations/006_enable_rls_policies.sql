-- ============================================================
-- FRAME0 - RLS Y POLITICAS PARA FRONTEND SUPABASE DIRECTO
-- Lectura publica de datos del torneo y escritura autenticada
-- para administradores/superadministradores.
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

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('admin', 'superadmin')
$$;

alter table public.categorias enable row level security;
alter table public.divisiones enable row level security;
alter table public.equipos enable row level security;
alter table public.jugadores enable row level security;
alter table public.partidos enable row level security;
alter table public.goles enable row level security;
alter table public.tarjetas enable row level security;
alter table public.sanciones enable row level security;
alter table public.usuarios_app enable row level security;
alter table public.delegados enable row level security;
alter table public.veedores enable row level security;
alter table public.configuraciones enable row level security;

drop policy if exists "lectura_publica_categorias" on public.categorias;
create policy "lectura_publica_categorias"
on public.categorias for select
using (true);

drop policy if exists "admin_escribe_categorias" on public.categorias;
create policy "admin_escribe_categorias"
on public.categorias for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "lectura_publica_divisiones" on public.divisiones;
create policy "lectura_publica_divisiones"
on public.divisiones for select
using (true);

drop policy if exists "admin_escribe_divisiones" on public.divisiones;
create policy "admin_escribe_divisiones"
on public.divisiones for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "lectura_publica_equipos" on public.equipos;
create policy "lectura_publica_equipos"
on public.equipos for select
using (true);

drop policy if exists "admin_escribe_equipos" on public.equipos;
create policy "admin_escribe_equipos"
on public.equipos for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "lectura_publica_jugadores" on public.jugadores;
create policy "lectura_publica_jugadores"
on public.jugadores for select
using (true);

drop policy if exists "admin_escribe_jugadores" on public.jugadores;
create policy "admin_escribe_jugadores"
on public.jugadores for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "lectura_publica_partidos" on public.partidos;
create policy "lectura_publica_partidos"
on public.partidos for select
using (true);

drop policy if exists "admin_escribe_partidos" on public.partidos;
create policy "admin_escribe_partidos"
on public.partidos for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "lectura_publica_goles" on public.goles;
create policy "lectura_publica_goles"
on public.goles for select
using (true);

drop policy if exists "admin_escribe_goles" on public.goles;
create policy "admin_escribe_goles"
on public.goles for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "lectura_publica_tarjetas" on public.tarjetas;
create policy "lectura_publica_tarjetas"
on public.tarjetas for select
using (true);

drop policy if exists "admin_escribe_tarjetas" on public.tarjetas;
create policy "admin_escribe_tarjetas"
on public.tarjetas for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "lectura_publica_sanciones" on public.sanciones;
create policy "lectura_publica_sanciones"
on public.sanciones for select
using (true);

drop policy if exists "admin_escribe_sanciones" on public.sanciones;
create policy "admin_escribe_sanciones"
on public.sanciones for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

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

drop policy if exists "admin_escribe_usuarios" on public.usuarios_app;
create policy "admin_escribe_usuarios"
on public.usuarios_app for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "admin_lee_delegados" on public.delegados;
create policy "admin_lee_delegados"
on public.delegados for select
to authenticated
using (public.is_admin_user() or usuario_id = auth.uid());

drop policy if exists "admin_escribe_delegados" on public.delegados;
create policy "admin_escribe_delegados"
on public.delegados for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "admin_lee_veedores" on public.veedores;
create policy "admin_lee_veedores"
on public.veedores for select
to authenticated
using (public.is_admin_user() or usuario_id = auth.uid());

drop policy if exists "admin_escribe_veedores" on public.veedores;
create policy "admin_escribe_veedores"
on public.veedores for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "lectura_publica_configuraciones" on public.configuraciones;
create policy "lectura_publica_configuraciones"
on public.configuraciones for select
using (true);

drop policy if exists "admin_escribe_configuraciones" on public.configuraciones;
create policy "admin_escribe_configuraciones"
on public.configuraciones for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());
