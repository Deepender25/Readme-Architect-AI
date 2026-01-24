"use client"

import { usePathname } from 'next/navigation'

export default function BreadcrumbSchema() {
    const pathname = usePathname()

    // Don't render on homepage
    if (pathname === '/') return null

    const baseUrl = 'https://readmearchitect.vercel.app'
    const pathSegments = pathname.split('/').filter(segment => segment)

    const items = pathSegments.map((segment, index) => {
        const url = `${baseUrl}/${pathSegments.slice(0, index + 1).join('/')}`

        // Format label: "my-page" -> "My Page"
        const name = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

        return {
            '@type': 'ListItem',
            position: index + 1,
            name,
            item: url
        }
    })

    // Add Home as first item
    const breadcrumbList = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl
            },
            ...items.map(item => ({
                ...item,
                position: item.position + 1
            }))
        ]
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbList)
            }}
        />
    )
}
