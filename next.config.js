/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/tumen-front',
  assetPrefix: '/tumen-front/',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
