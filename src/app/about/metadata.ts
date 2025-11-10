import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - The Story Behind ReadmeArchitect | Our Mission & Team',
  description: 'Learn about ReadmeArchitect, our mission to democratize great documentation, and the team building AI-powered tools for developers. Built by developers, for developers. Discover how we\'re revolutionizing GitHub documentation with AI technology.',
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
    'team behind ReadmeArchitect',
    'AI development tools',
    'documentation revolution',
    'developer productivity mission',
    'GitHub tools team'
  ],
  authors: [{ name: 'ReadmeArchitect Team' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  alternates: {
    canonical: 'https://readmearchitect.vercel.app/about'
  },
  openGraph: {
    title: 'About Us - The Story Behind ReadmeArchitect',
    description: 'Learn about ReadmeArchitect, our mission to democratize great documentation, and the team building AI-powered tools for developers.',
    url: 'https://readmearchitect.vercel.app/about',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-about.png',
        width: 1200,
        height: 630,
        alt: 'About ReadmeArchitect - Our Story and Mission'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - The Story Behind ReadmeArchitect',
    description: 'Learn about our mission to democratize great documentation with AI-powered tools for developers.',
    images: ['https://readmearchitect.vercel.app/og-about.png'],
    creator: '@readmearchitect'
  },
  category: 'Technology'
}
