/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  allowedDevOrigins: ['172.20.10.2', 'localhost', '127.0.0.1'],
}

module.exports = nextConfig