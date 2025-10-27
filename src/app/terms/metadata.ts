import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service - ReadmeArchitect Usage Terms & Conditions',
  description: 'Terms and conditions for using ReadmeArchitect README generator. Service agreement, usage rights, legal information, user responsibilities, and intellectual property guidelines. Read our complete terms before using the service.',
  keywords: [
    'terms of service',
    'usage terms',
    'service agreement',
    'legal terms',
    'terms and conditions',
    'user agreement',
    'ReadmeArchitect terms',
    'service terms',
    'usage policy',
    'legal agreement',
    'terms of use'
  ],
  canonical: '/terms'
})
