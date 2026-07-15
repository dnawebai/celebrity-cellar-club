// Server-only helper to enqueue a transactional email via the same pgmq
// queue the /lovable/email/transactional/send route uses. Callable from
// server routes (webhooks, cron) that already have service-role privileges.
//
// Do NOT import from client code; this file uses SUPABASE_SERVICE_ROLE_KEY.

import * as React from 'react'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Opus Drinks'
const SENDER_DOMAIN = 'notify.opusdrinks.com'
const FROM_DOMAIN = 'notify.opusdrinks.com'

let _client: ReturnType<typeof createClient> | null = null
function client() {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }
  return _client
}

export async function enqueueTransactionalEmail(params: {
  templateName: string
  recipientEmail: string
  templateData?: Record<string, unknown>
  idempotencyKey?: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const entry = TEMPLATES[params.templateName]
  if (!entry) return { ok: false, error: `Unknown template: ${params.templateName}` }

  const supabase = client()

  // Suppression check
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('email')
    .eq('email', params.recipientEmail.toLowerCase())
    .maybeSingle()
  if (suppressed) return { ok: false, error: 'Recipient is suppressed' }

  const messageId = crypto.randomUUID()
  const idem = params.idempotencyKey ?? messageId

  const props = { ...(entry.previewData ?? {}), ...(params.templateData ?? {}) }
  const element = React.createElement(entry.component, props)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject =
    typeof entry.subject === 'function' ? entry.subject(props) : entry.subject

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: params.templateName,
    recipient_email: params.recipientEmail,
    status: 'pending',
    metadata: { idempotency_key: idem },
  })

  const { error } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      idempotency_key: idem,
      to: params.recipientEmail,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: params.templateName,
      queued_at: new Date().toISOString(),
    },
  })

  if (error) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: params.templateName,
      recipient_email: params.recipientEmail,
      status: 'failed',
      error_message: 'enqueue failed',
    })
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
