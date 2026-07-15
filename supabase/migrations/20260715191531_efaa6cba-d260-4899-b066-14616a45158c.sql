
-- (Re)schedule the daily expiry-reminder cron. Extensions pg_cron + pg_net
-- were enabled in a previous migration. Use the stable published URL.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'opus-expiry-reminders') THEN
    PERFORM cron.unschedule('opus-expiry-reminders');
  END IF;
END $$;

SELECT cron.schedule(
  'opus-expiry-reminders',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--05836ee3-6fe8-4582-8580-145fae04b449.lovable.app/api/public/cron/expiry-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dHlqc2p4aGplaHF1aGtybnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMjgyOTIsImV4cCI6MjA5OTcwNDI5Mn0.GR7zksGSk032DTvJouKpw7XF3W9CYwMlqaXyddbdCpM'
    ),
    body := '{}'::jsonb
  );
  $$
);
