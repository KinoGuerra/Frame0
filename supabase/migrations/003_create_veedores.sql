-- ============================================================
-- FRAME0 - TABLA VEEDORES
-- No ejecuta bajas fisicas. Usa activo = true / false.
-- ============================================================

create table if not exists public.veedores (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios_app(id) on delete cascade,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint veedores_usuario_unique unique (usuario_id)
);
