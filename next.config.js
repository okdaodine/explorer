/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_TRON_NODE_API: process.env.NEXT_PUBLIC_TRON_NODE_API || '',
    NEXT_PUBLIC_SOLANA_NODE_API: process.env.NEXT_PUBLIC_SOLANA_NODE_API || '',
  }
};

module.exports = nextConfig;
