// Server-only helper that sends a transactional email through Lovable's
// managed email API and records the outcome in email_send_log.
// Callable from server routes (webhooks, cron) and server functions.
//
// Do NOT import from client code; this file uses SUPABASE_SERVICE_ROLE_KEY
// and LOVABLE_API_KEY.

import { createClient } from '@supabase/supabase-js'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

let _client: any = null
function client(): any {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }
  return _client
}

async function log(row: {
  template_name: string
  recipient_email: string
  status: 'sent' | 'suppressed' | 'failed'
  error_message?: string
  metadata?: Record<string, unknown>
}) {
  const { error } = await client().from('email_send_log').insert(row)
  if (error) {
    console.error('Failed to write email_send_log', {
      code: error.code,
      message: error.message,
    })
  }
}

export async function enqueueTransactionalEmail(params: {
  templateName: string
  recipientEmail: string
  templateData?: Record<string, unknown>
  idempotencyKey?: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const base = {
    template_name: params.templateName,
    recipient_email: params.recipientEmail,
    metadata: params.idempotencyKey
      ? { idempotency_key: params.idempotencyKey }
      : undefined,
  }

  try {
    const result = await sendTemplateEmail(
      params.templateName,
      params.recipientEmail,
      {
        templateData: params.templateData as Record<string, any> | undefined,
        idempotencyKey: params.idempotencyKey,
      },
    )

    if (!result.sent) {
      await log({ ...base, status: 'suppressed' })
      return { ok: false, error: 'Recipient is suppressed' }
    }

    await log({ ...base, status: 'sent' })
    return { ok: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email send failed'
    await log({ ...base, status: 'failed', error_message: message })
    return { ok: false, error: message }
  }
}
