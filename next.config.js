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
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  
  // SEO and Performance optimizations
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Optimize for production
  swcMinify: true,
  reactStrictMode: true,
  
  // Production console stripping and security optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Strip console logs in production client-side builds
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
      
      // Add terser plugin for console removal
      const TerserPlugin = require('terser-webpack-plugin');
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        })
      );
    }
    return config;
  },
  
  // Enhanced Security headers
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://api.github.com https://github.com https://vercel.live https://vitals.vercel-insights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
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