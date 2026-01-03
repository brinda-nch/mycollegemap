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
  // Optimize font loading
  optimizeFonts: true,
  // Next.js 15 configuration - removed deprecated options
}

export default nextConfig
