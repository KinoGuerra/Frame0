-- ============================================================
-- FRAME0 - MIGRACIÓN INICIAL DE BASE DE DATOS
-- Base de datos: PostgreSQL / Supabase
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  descripcion text,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.divisiones (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias(id) on delete restrict,
  nombre text not null,
  descripcion text,
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  constraint divisiones_nombre_categoria_unique unique (categoria_id, nombre)
);

create table if not exists public.equipos (
  id uuid primary key default gen_random_uuid(),
  division_id uuid not null references public.divisiones(id) on delete restrict,
  nombre text not null,
  escudo_url text,
  color_principal text,
  color_secundario text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint equipos_nombre_division_unique unique (division_id, nombre)
);

create table if not exists public.jugadores (
  id uuid primary key default gen_random_uuid(),
  equipo_id uuid not null references public.equipos(id) on delete cascade,
  nombre text not null,
  apellido text not null,
  dni text,
  fecha_nacimiento date,
  posicion text,
  dorsal integer,
  foto_url text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint jugadores_dni_unique unique (dni)
);

create table if not exists public.partidos (
  id uuid primary key default gen_random_uuid(),
  division_id uuid not null references public.divisiones(id) on delete restrict,
  equipo_local_id uuid not null references public.equipos(id) on delete restrict,
  equipo_visitante_id uuid not null references public.equipos(id) on delete restrict,
  fecha_hora timestamptz,
  cancha text,
  goles_local integer not null default 0,
  goles_visitante integer not null default 0,
  estado text not null default 'programado',
  observaciones text,
  created_at timestamptz not null default now(),

  constraint partidos_estado_check check (
    estado in ('programado', 'en_juego', 'finalizado', 'suspendido', 'cancelado')
  ),

  constraint partidos_equipos_distintos check (
    equipo_local_id <> equipo_visitante_id
  )
);

create table if not exists public.goles (
  id uuid primary key default gen_random_uuid(),
  partido_id uuid not null references public.partidos(id) on delete cascade,
  jugador_id uuid references public.jugadores(id) on delete set null,
  equipo_id uuid not null references public.equipos(id) on delete restrict,
  minuto integer,
  tipo text not null default 'normal',
  created_at timestamptz not null default now(),

  constraint goles_tipo_check check (
    tipo in ('normal', 'penal', 'en_contra')
  )
);

create table if not exists public.tarjetas (
  id uuid primary key default gen_random_uuid(),
  partido_id uuid not null references public.partidos(id) on delete cascade,
  jugador_id uuid references public.jugadores(id) on delete set null,
  equipo_id uuid not null references public.equipos(id) on delete restrict,
  minuto integer,
  tipo text not null,
  motivo text,
  created_at timestamptz not null default now(),

  constraint tarjetas_tipo_check check (
    tipo in ('amarilla', 'roja')
  )
);

create table if not exists public.sanciones (
  id uuid primary key default gen_random_uuid(),
  jugador_id uuid not null references public.jugadores(id) on delete cascade,
  partido_id uuid references public.partidos(id) on delete set null,
  motivo text not null,
  fechas_suspension integer not null default 1,
  cumplida boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.usuarios_app (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  email text not null unique,
  rol text not null default 'delegado',
  activo boolean not null default true,
  created_at timestamptz not null default now(),

  constraint usuarios_app_rol_check check (
    rol in ('admin', 'delegado', 'veedor', 'publico')
  )
);

create table if not exists public.delegados (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios_app(id) on delete cascade,
  equipo_id uuid not null references public.equipos(id) on delete cascade,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint delegados_usuario_equipo_unique unique (usuario_id, equipo_id)
);
