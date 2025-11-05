import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      // 🟢 FIX 1: Add the direct GitHub domain for the raw link access
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        // Target your specific repository path for security
        pathname: '/TechXplorers1/fancybyaifie/**', 
      },
      // 🟢 FIX 2: Add the GitHub CDN domain (where raw links often resolve to)
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        // Target your specific repository path
        pathname: '/TechXplorers1/fancybyaifie/**',
      },
    ],
  },
};

export default nextConfig;