/** @type {import('next').NextConfig} */
const repoName = 'tumen-front';
const isProd = process.env.NODE_ENV === 'production';
const isGhPages = process.env.GH_PAGES === 'true';

const nextConfig = {
  output: 'export',
  // Only use basePath/assetPrefix when building for GitHub Pages
  basePath: isGhPages ? `/${repoName}` : '',
  assetPrefix: isGhPages ? `/${repoName}/` : '',
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
  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? `/${repoName}` : '',
  }
};

// Dev-only proxy to local backend to avoid CORS during next dev
nextConfig.rewrites = async () => {
  if (!isProd) {
    return [
      { source: '/api/search/:path*', destination: 'http://localhost:3000/search/:path*' },
      { source: '/api/lottery/:path*', destination: 'http://localhost:3000/lottery/:path*' },
      { source: '/api/invoice/:path*', destination: 'http://localhost:3000/invoice/:path*' },
    ];
  }
  return [];
};

module.exports = nextConfig;
