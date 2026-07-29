import type { ComponentType } from 'react'
import { template as contactSubmissionTemplate } from './contact-submission'
import { template as membershipReceiptTemplate } from './membership-receipt'
import { template as membershipWelcomeTemplate } from './membership-welcome'
import { template as membershipExpiryReminderTemplate } from './membership-expiry-reminder'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-submission': contactSubmissionTemplate,
  'membership-receipt': membershipReceiptTemplate,
  'membership-welcome': membershipWelcomeTemplate,
  'membership-expiry-reminder': membershipExpiryReminderTemplate,
}
