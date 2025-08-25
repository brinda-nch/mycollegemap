/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Next.js 15 configuration
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

export default nextConfig
