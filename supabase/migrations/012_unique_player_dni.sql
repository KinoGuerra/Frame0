create unique index if not exists jugadores_dni_unique_idx
  on public.jugadores (lower(trim(dni)))
  where dni is not null and trim(dni) <> '';
