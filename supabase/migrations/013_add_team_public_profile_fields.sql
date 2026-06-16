alter table public.equipos
  add column if not exists abreviatura text,
  add column if not exists nombre_corto text,
  add column if not exists descripcion text,
  add column if not exists color_terciario text;

update public.equipos
set
  abreviatura = coalesce(
    nullif(trim(abreviatura), ''),
    upper(left(regexp_replace(trim(nombre), '\s+', '', 'g'), 3))
  ),
  nombre_corto = coalesce(nullif(trim(nombre_corto), ''), nombre),
  descripcion = coalesce(nullif(trim(descripcion), ''), 'Datos cargados desde Supabase.'),
  color_terciario = coalesce(nullif(trim(color_terciario), ''), '#ffffff');
