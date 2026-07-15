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
  dashboardUrl?: string
  auctionsUrl?: string
}

const Email = ({
  recipientName,
  dashboardUrl = 'https://opusdrinks.com/dashboard',
  auctionsUrl = 'https://opusdrinks.com/auctions',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to Opus Drinks — your membership is live</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>OPUS DRINKS · MEMBERSHIP ACTIVATED</Text>
        <Heading style={h1}>Welcome{recipientName ? `, ${recipientName}` : ''}.</Heading>
        <Text style={text}>
          You now have full access to Opus Drinks — unified across Sotheby's,
          Christie's, Acker and Iron Gate auctions.
        </Text>
        <Text style={text}>Here's where to start:</Text>
        <ul style={list}>
          <li style={li}><strong>Auctions.</strong> A single calendar of live and upcoming wine + spirits sales.</li>
          <li style={li}><strong>Watchlist &amp; Bids.</strong> Save lots and request concierge bids on any partner house.</li>
          <li style={li}><strong>Opus Concierge.</strong> Message our team for provenance, condition, and delivery.</li>
        </ul>

        <Button style={btn} href={dashboardUrl}>Go to your dashboard</Button>
        <Text style={smallLink}>Or browse live auctions: <a style={link} href={auctionsUrl}>{auctionsUrl}</a></Text>

        <Text style={footer}>
          Your membership is valid for 12 months from today. We'll remind you
          30 days before it lapses so you never lose access.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Welcome to Opus Drinks',
  displayName: 'Membership welcome',
  previewData: {
    recipientName: 'Alexander',
    dashboardUrl: 'https://opusdrinks.com/dashboard',
    auctionsUrl: 'https://opusdrinks.com/auctions',
  },
} satisfies TemplateEntry

export default Email

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif', color: '#111' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = { fontSize: '11px', letterSpacing: '0.4em', color: '#8a6a1f', margin: '0 0 20px' }
const h1 = { fontSize: '32px', fontWeight: 400 as const, margin: '0 0 16px' }
const text = { fontSize: '14px', lineHeight: '1.6', color: '#333', margin: '0 0 14px' }
const list = { paddingLeft: '18px', margin: '4px 0 24px' }
const li = { fontSize: '14px', lineHeight: '1.7', color: '#333', margin: '4px 0' }
const btn = { backgroundColor: '#111', color: '#ffffff', padding: '12px 20px', fontSize: '12px', letterSpacing: '0.2em', textDecoration: 'none', display: 'inline-block' }
const smallLink = { fontSize: '12px', color: '#666', margin: '16px 0 30px' }
const link = { color: '#8a6a1f' }
const footer = { fontSize: '12px', color: '#888', borderTop: '1px solid #e5e0d3', paddingTop: '16px' }
