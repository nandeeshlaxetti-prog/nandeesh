/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export for now to support dynamic routes
  // ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
