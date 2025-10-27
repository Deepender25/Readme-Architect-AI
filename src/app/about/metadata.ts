import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'About Us - The Story Behind ReadmeArchitect',
  description: 'Learn about ReadmeArchitect, our mission to democratize great documentation, and the team building AI-powered tools for developers. Built by developers, for developers with a passion for making documentation accessible to everyone.',
  keywords: [
    'about ReadmeArchitect',
    'ReadmeArchitect story',
    'our mission',
    'about us',
    'developer tools team',
    'AI documentation team',
    'open source project',
    'who we are',
    'company story',
    'documentation mission',
    'AI development tools',
    'developer productivity tools'
  ],
  canonical: '/about'
})
