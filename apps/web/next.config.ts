import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: false,
  cacheComponents: false,
  experimental: {
  },
  turbopack: {
     root: path.join(__dirname, '..', '..'), 
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.bytherix.com' },
      { protocol: 'https', hostname: 'r2.bytherix.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 14400,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}

export default nextConfig