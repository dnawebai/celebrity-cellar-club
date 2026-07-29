import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  recipientName?: string
  periodEnd?: string
  renewUrl?: string
}

const Email = ({
  recipientName,
  periodEnd = '',
  renewUrl = 'https://opusdrinks.com/checkout/membership',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Opus Drinks membership renews soon</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>OPUS DRINKS · RENEWAL REMINDER</Text>
        <Heading style={h1}>
          {recipientName ? `${recipientName}, ` : ''}your access ends in ~30 days.
        </Heading>
        <Text style={text}>
          Your Opus Drinks membership {periodEnd ? `expires on ${periodEnd}` : 'is scheduled to expire soon'}.
          Renew for another year of unified auction access, watchlist, concierge
          bidding, and the collector portfolio.
        </Text>
        <Button style={btn} href={renewUrl}>Renew for $199</Button>
        <Text style={footer}>
          Renewals extend your access by 12 months from today. If you'd rather
          let your membership lapse, no action is needed.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Opus Drinks membership renews soon',
  displayName: 'Renewal reminder',
  previewData: {
    recipientName: 'Alexander',
    periodEnd: '2027-08-14',
    renewUrl: 'https://opusdrinks.com/checkout/membership',
  },
} satisfies TemplateEntry

export default Email

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif', color: '#111' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = { fontSize: '11px', letterSpacing: '0.4em', color: '#8a6a1f', margin: '0 0 20px' }
const h1 = { fontSize: '26px', fontWeight: 400 as const, margin: '0 0 16px' }
const text = { fontSize: '14px', lineHeight: '1.6', color: '#333', margin: '0 0 22px' }
const btn = { backgroundColor: '#111', color: '#ffffff', padding: '12px 20px', fontSize: '12px', letterSpacing: '0.2em', textDecoration: 'none', display: 'inline-block' }
const footer = { fontSize: '12px', color: '#888', marginTop: '24px', borderTop: '1px solid #e5e0d3', paddingTop: '16px' }
