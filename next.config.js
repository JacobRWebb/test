/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',  // Allow all domains for development
      },
    ],
  },
}

module.exports = nextConfig
