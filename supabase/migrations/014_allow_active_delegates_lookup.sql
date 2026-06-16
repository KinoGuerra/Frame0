-- Permite que el frontend estático liste las asignaciones activas
-- equipo <-> delegado usando la anon key, sin depender de Supabase Auth.

grant select on table public.delegados to anon, authenticated;

alter table public.delegados enable row level security;

drop policy if exists "lectura_delegados_activos_anon" on public.delegados;
create policy "lectura_delegados_activos_anon"
on public.delegados
for select
to anon, authenticated
using (activo = true);
