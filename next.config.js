/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
    // serverActions: true,
  },
  images: {
    domains: ["flowbite.com", "ffcwqjzgvnejkwdtjozl.supabase.co"],
  },
  reactStrictMode: true,
  swcMinify: true,

  webpack(config) {
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,

      fs: false, // the solution
    };

    return config;
  },
};

module.exports = nextConfig;
