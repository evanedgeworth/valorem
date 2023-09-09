/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  images: {
    domains: ["flowbite.com", "ffcwqjzgvnejkwdtjozl.supabase.co"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
