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
  auctionTitle?: string
  lotTitle?: string
  previousBidCents?: number
  newBidCents?: number
  lotUrl?: string
}

function formatCurrency(cents: number | undefined) {
  if (cents == null) return '$—'
  return `$${(cents / 100).toLocaleString()}`
}

const Email = ({
  recipientName,
  auctionTitle = 'Butterflies & Barrels',
  lotTitle = 'A curated lot',
  previousBidCents,
  newBidCents,
  lotUrl = 'https://opusdrinks.com/auctions/dollywood-foundation-2026',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You have been outbid on {lotTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>OPUS DRINKS · AUCTION NOTIFICATION</Text>
        <Heading style={h1}>You&apos;ve been outbid{recipientName ? `, ${recipientName}` : ''}.</Heading>
        <Text style={text}>
          Another member has placed a higher bid on <strong>{lotTitle}</strong> in{' '}
          <strong>{auctionTitle}</strong>.
        </Text>
        <ul style={list}>
          <li style={li}>
            <strong>Your bid:</strong> {formatCurrency(previousBidCents)}
          </li>
          <li style={li}>
            <strong>Current high bid:</strong> {formatCurrency(newBidCents)}
          </li>
        </ul>
        <Button style={btn} href={lotUrl}>
          Raise Your Bid
        </Button>
        <Text style={footer}>
          This is a transactional auction alert. You can manage your notifications from your
          Opus Drinks dashboard.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) => `You've been outbid — ${data.lotTitle ?? 'Opus Drinks auction'}`,
  displayName: 'Outbid notification',
  previewData: {
    recipientName: 'Alexander',
    auctionTitle: 'Butterflies & Barrels',
    lotTitle: '1995 Screaming Eagle Cabernet Sauvignon · Napa Valley',
    previousBidCents: 450000,
    newBidCents: 460000,
    lotUrl: 'https://opusdrinks.com/auctions/dollywood-foundation-2026',
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
const footer = { fontSize: '12px', color: '#888', borderTop: '1px solid #e5e0d3', paddingTop: '16px', marginTop: '24px' }
