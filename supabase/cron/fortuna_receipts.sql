-- Ejecutar despues de guardar en Vault los secretos frame0_project_url y
-- frame0_service_role_key, y de desplegar enviar-comprobantes-fortuna.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'frame0-fortuna-receipts',
  '* * * * *',
  $$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'frame0_project_url')
        || '/functions/v1/enviar-comprobantes-fortuna',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'frame0_service_role_key')
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 90000
    );
  $$
);
