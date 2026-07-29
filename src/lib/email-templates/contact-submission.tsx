import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface ContactSubmissionProps {
  name: string
  email: string
  company?: string
  message: string
}

export function ContactSubmissionEmail({
  name,
  email,
  company,
  message,
}: ContactSubmissionProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={{ backgroundColor: '#0a0a0a', color: '#f5f5f0', fontFamily: 'Geist, sans-serif' }}>
        <Container style={{ padding: '40px 24px' }}>
          <Section>
            <Text style={{ fontSize: '24px', fontWeight: 600, color: '#f5f5f0' }}>
              Opus Drinks — Contact Form
            </Text>
            <Text style={{ color: '#a3a3a3', fontSize: '14px' }}>
              A new message was submitted on opusdrinks.com/about.
            </Text>
            <Text style={{ marginTop: '24px', color: '#f5f5f0' }}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={{ color: '#f5f5f0' }}>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${email}`} style={{ color: '#c8e747' }}>
                {email}
              </a>
            </Text>
            {company && (
              <Text style={{ color: '#f5f5f0' }}>
                <strong>Company:</strong> {company}
              </Text>
            )}
            <Text style={{ color: '#f5f5f0', marginTop: '24px' }}>
              <strong>Message:</strong>
            </Text>
            <Text
              style={{
                color: '#d4d4ce',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                padding: '16px',
                backgroundColor: '#141414',
                borderRadius: '8px',
              }}
            >
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
