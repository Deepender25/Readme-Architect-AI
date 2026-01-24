import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog - AI Documentation Insights & Tutorials | ReadmeArchitect',
    description: 'Explore the latest insights on AI development tools, documentation best practices, and ReadmeArchitect updates. Tutorials and stories for developers.',
    keywords: ['AI blog', 'developer documentation blog', 'README generator blog', 'software documentation insights'],
    openGraph: {
        title: 'Blog - AI Documentation Insights & Tutorials',
        description: 'Explore the latest insights on AI development tools and documentation best practices.',
        type: 'website',
    },
}

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Blog',
                        name: 'ReadmeArchitect Blog',
                        description: 'Insights and tutorials about AI-powered documentation',
                        url: 'https://readmearchitect.vercel.app/blog',
                        publisher: {
                            '@type': 'Organization',
                            name: 'ReadmeArchitect',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://readmearchitect.vercel.app/logo.png'
                            }
                        }
                    }),
                }}
            />
            {children}
        </>
    )
}
