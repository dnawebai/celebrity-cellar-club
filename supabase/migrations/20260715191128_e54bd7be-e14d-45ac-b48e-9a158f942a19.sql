CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  PERFORM cron.unschedule('membership-expiry-reminders');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'membership-expiry-reminders',
  '23 4 * * *',
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