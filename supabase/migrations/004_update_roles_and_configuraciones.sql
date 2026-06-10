-- ============================================================
-- FRAME0 - ROLES Y CONFIGURACIONES
-- Agrega rol superadmin y tabla de configuraciones.
-- ============================================================

do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'usuarios_app'
      and constraint_name = 'usuarios_app_rol_check'
  ) then
    alter table public.usuarios_app drop constraint usuarios_app_rol_check;
  end if;
end $$;

alter table public.usuarios_app
add constraint usuarios_app_rol_check check (
  rol in ('admin', 'delegado', 'veedor', 'publico', 'superadmin')
);

create table if not exists public.configuraciones (
  id uuid primary key default gen_random_uuid(),
  clave text not null unique,
  valor jsonb not null default '{}'::jsonb,
  descripcion text,
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

insert into public.configuraciones (clave, valor, descripcion)
values (
  'habilitacion_edicion_jugadores',
  '{"fecha_inicio": null, "fecha_fin": null}'::jsonb,
  'Periodo en el que delegados pueden cargar o editar jugadores.'
)
on conflict (clave) do nothing;
