import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  recipientName?: string
  amount?: string
  currency?: string
  paidAt?: string
  sessionId?: string
  periodEnd?: string
}

const Email = ({
  recipientName,
  amount = '$199.00',
  currency = 'USD',
  paidAt = new Date().toISOString().slice(0, 10),
  sessionId = '',
  periodEnd = '',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Opus Drinks membership receipt · {amount}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>OPUS DRINKS</Text>
        <Heading style={h1}>Payment received</Heading>
        <Text style={text}>
          {recipientName ? `Hi ${recipientName}, thank ` : 'Thank '}
          you for joining Opus Drinks. This email confirms your $199 membership
          payment.
        </Text>

        <Section style={box}>
          <Row label="Item" value="Opus Drinks Membership" />
          <Row label="Amount" value={`${amount} ${currency}`} />
          <Row label="Paid" value={paidAt} />
          {periodEnd ? <Row label="Access until" value={periodEnd} /> : null}
          {sessionId ? <Row label="Reference" value={sessionId} /> : null}
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Keep this receipt for your records. Questions? Reply to this email and
          the Opus concierge team will help.
        </Text>
      </Container>
    </Body>
  </Html>
)

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={rowWrap}>
      <Text style={rowLabel}>{label}</Text>
      <Text style={rowValue}>{value}</Text>
    </div>
  )
}

export const template = {
  component: Email,
  subject: 'Your Opus Drinks receipt · $199',
  displayName: 'Membership receipt',
  previewData: {
    recipientName: 'Alexander',
    amount: '$199.00',
    currency: 'USD',
    paidAt: '2026-07-15',
    sessionId: 'cs_test_a1B2c3',
    periodEnd: '2027-07-15',
  },
} satisfies TemplateEntry

export default Email

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif', color: '#111' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = { fontSize: '11px', letterSpacing: '0.4em', color: '#8a6a1f', margin: '0 0 24px' }
const h1 = { fontSize: '28px', fontWeight: 400 as const, margin: '0 0 16px', color: '#111' }
const text = { fontSize: '14px', lineHeight: '1.6', color: '#333', margin: '0 0 20px' }
const box = { border: '1px solid #e5e0d3', padding: '16px 20px', margin: '20px 0' }
const rowWrap = { display: 'flex', justifyContent: 'space-between', padding: '6px 0' }
const rowLabel = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#888', margin: 0 }
const rowValue = { fontSize: '14px', color: '#111', margin: 0 }
const hr = { borderColor: '#e5e0d3', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#888', margin: 0 }
