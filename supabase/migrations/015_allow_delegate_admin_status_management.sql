-- Permite administrar altas/bajas de delegados desde el frontend estático.
-- Frame0 usa login propio sobre usuarios_app, por eso estas operaciones no
-- dependen de Supabase Auth.

grant select, update on table public.usuarios_app to anon, authenticated;
grant select, update on table public.delegados to anon, authenticated;

alter table public.usuarios_app enable row level security;
alter table public.delegados enable row level security;

drop policy if exists "gestion_delegados_usuarios_anon" on public.usuarios_app;
create policy "gestion_delegados_usuarios_anon"
on public.usuarios_app
for select
to anon, authenticated
using (rol = 'delegado');

drop policy if exists "actualiza_delegados_usuarios_anon" on public.usuarios_app;
create policy "actualiza_delegados_usuarios_anon"
on public.usuarios_app
for update
to anon, authenticated
using (rol = 'delegado')
with check (rol = 'delegado');

drop policy if exists "lectura_delegados_todos_anon" on public.delegados;
create policy "lectura_delegados_todos_anon"
on public.delegados
for select
to anon, authenticated
using (true);

drop policy if exists "actualiza_delegados_todos_anon" on public.delegados;
create policy "actualiza_delegados_todos_anon"
on public.delegados
for update
to anon, authenticated
using (true)
with check (true);
