/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['sydhgjtsgqyglqulxfvh.supabase.co'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig