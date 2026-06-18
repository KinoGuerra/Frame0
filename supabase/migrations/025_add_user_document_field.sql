-- Agrega documento personal para delegados y veedores.
-- Se mantiene nullable para no bloquear usuarios existentes.

alter table public.usuarios_app
add column if not exists documento text;

comment on column public.usuarios_app.documento is
  'DNI o pasaporte del usuario de la aplicacion.';
