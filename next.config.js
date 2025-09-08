/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'storage.googleapis.com',
      'whatsnext-61b27.appspot.com',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'cdn.jsdelivr.net'
    ],
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  // Disable static generation for pages that use client-side features
  experimental: {
  },
  // Force server-side rendering for problematic pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig