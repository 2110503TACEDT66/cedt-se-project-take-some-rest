/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['swd-practice-cgr-project.vercel.app', 'localhost'],
  },
  env: {
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
  },
}

module.exports = nextConfig
