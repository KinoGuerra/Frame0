alter table public.usuarios_app
add column if not exists apellido text,
add column if not exists contacto text,
add column if not exists usuario text,
add column if not exists password_hash text;

do $$
declare
  fk_name text;
begin
  select conname
  into fk_name
  from pg_constraint
  where conrelid = 'public.usuarios_app'::regclass
    and confrelid = 'auth.users'::regclass
    and contype = 'f'
  limit 1;

  if fk_name is not null then
    execute format('alter table public.usuarios_app drop constraint %I', fk_name);
  end if;
end $$;

alter table public.usuarios_app
alter column id set default gen_random_uuid();

alter table public.usuarios_app
alter column email drop not null;

drop index if exists public.usuarios_app_usuario_unique;

create unique index if not exists usuarios_app_usuario_unique
on public.usuarios_app (lower(trim(usuario)))
where usuario is not null;
