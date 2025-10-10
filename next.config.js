/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <-- this makes it static (needed for GitHub Pages)
  images: { unoptimized: true }, // disable next/image optimization
  basePath: '/tumen-front', // <-- your repository name here
  assetPrefix: '/tumen-front/',
  images: {
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
