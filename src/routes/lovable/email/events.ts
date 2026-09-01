import { createClient } from '@supabase/supabase-js'
import { createEmailWebhookHandler } from '@lovable.dev/email-js'
import { createFileRoute } from '@tanstack/react-router'

// Notification-only mirror of terminal email outcomes into the project's
// existing email tables. Lovable enforces suppression at send time; these
// rows are a convenience view for the app's own reporting.

type Reason = 'bounce' | 'complaint' | 'unsubscribe'

const STATUS: Record<Reason, 'bounced' | 'complained' | 'suppressed'> = {
  bounce: 'bounced',
  complaint: 'complained',
  unsubscribe: 'suppressed',
}

const MESSAGE: Record<Reason, string> = {
  bounce: 'Permanent bounce — email address is invalid or rejected',
  complaint: 'Spam complaint — recipient marked email as spam',
  unsubscribe: 'Recipient unsubscribed',
}

function admin() {
  return createClient(
    process.env['SUPABASE_URL'] ?? import.meta.env.VITE_SUPABASE_URL,
    process.env['SUPABASE_SERVICE_ROLE_KEY']!,
  )
}

async function record(
  reason: Reason,
  recipient: string,
  messageId: string | null,
  eventId: string,
) {
  const supabase = admin()
  const email = recipient.toLowerCase()

  const { error: suppressError } = await supabase
    .from('suppressed_emails')
    .upsert({ email, reason, metadata: null }, { onConflict: 'email' })

  if (suppressError) {
    console.error('Failed to upsert suppressed email', {
      code: suppressError.code,
      message: suppressError.message,
      event_id: eventId,
    })
    throw new Error('Failed to write suppression')
  }

  const { error: logError } = await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: 'system',
    recipient_email: email,
    status: STATUS[reason],
    error_message: MESSAGE[reason],
    metadata: null,
  })

  if (logError) {
    console.warn('Failed to insert email_send_log', {
      code: logError.code,
      message: logError.message,
      event_id: eventId,
    })
  }
}

export const Route = createFileRoute("/lovable/email/events")({
  server: {
    handlers: {
      POST: ({ request }) => {
        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) {
          console.error('Missing required environment variables')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }
        const handler = createEmailWebhookHandler({
          apiKey,
          on: {
            'email.bounced': async (event) => {
              await record(
                'bounce',
                event.data.recipient,
                event.data.message_id ?? null,
                event.event_id,
              )
            },
            'email.complaint': async (event) => {
              await record(
                'complaint',
                event.data.recipient,
                event.data.message_id ?? null,
                event.event_id,
              )
            },
            'email.unsubscribed': async (event) => {
              await record(
                'unsubscribe',
                event.data.recipient,
                event.data.message_id ?? null,
                event.event_id,
              )
            },
          },
        })
        return handler(request)
      },
    },
  },
})
