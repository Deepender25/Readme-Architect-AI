/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // SEO and Performance optimizations
  experimental: {
    scrollRestoration: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Cache static assets
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.(png|jpg|jpeg|gif|webp|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/api/generate',
        destination: '/api/generate',
      },
      {
        source: '/api/stream',
        destination: '/api/stream',
      },
    ];
  },
  
  // Redirect common SEO patterns
  async redirects() {
    return [
      {
        source: '/readme-generator',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ai-readme',
        destination: '/',
        permanent: true,
      },
      {
        source: '/github-readme',
        destination: '/',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/documentation',
        permanent: true,
      },
      {
        source: '/help',
        destination: '/documentation',
        permanent: true,
      },
      {
        source: '/guide',
        destination: '/documentation',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;