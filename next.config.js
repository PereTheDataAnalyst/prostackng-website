/** @type {import('next').NextConfig} */
const nextConfig = {
  // YouTube thumbnail images need to be whitelisted for next/image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',  // YouTube thumbnails
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com', // fallback YouTube CDN
      },
    ],
  },
  // Security headers are handled by vercel.json (which runs at CDN edge level).
  // Keeping these here as a fallback for local dev and non-Vercel deployments.
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',           value: 'DENY' },
        { key: 'X-Content-Type-Options',    value: 'nosniff' },
        { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ],
    }];
  },
};
module.exports = nextConfig;
