-- ============================================================
-- FRAME0 - DATOS INICIALES
-- Archivo: supabase/migrations/002_seed_initial_data.sql
-- ============================================================

insert into public.categorias (nombre, descripcion)
values
  ('Libre', 'Categoría libre del torneo'),
  ('Senior', 'Categoría senior del torneo'),
  ('Femenino', 'Categoría femenina del torneo')
on conflict (nombre) do nothing;

insert into public.divisiones (categoria_id, nombre)
select id, 'Primera División'
from public.categorias
where nombre = 'Libre'
on conflict do nothing;

insert into public.divisiones (categoria_id, nombre)
select id, 'Segunda División'
from public.categorias
where nombre = 'Libre'
on conflict do nothing;

insert into public.divisiones (categoria_id, nombre)
select id, 'Senior A'
from public.categorias
where nombre = 'Senior'
on conflict do nothing;

insert into public.divisiones (categoria_id, nombre)
select id, 'Senior B'
from public.categorias
where nombre = 'Senior'
on conflict do nothing;

insert into public.divisiones (categoria_id, nombre)
select id, 'Fem A'
from public.categorias
where nombre = 'Femenino'
on conflict do nothing;

insert into public.divisiones (categoria_id, nombre)
select id, 'Fem B'
from public.categorias
where nombre = 'Femenino'
on conflict do nothing;
