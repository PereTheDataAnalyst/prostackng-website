import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/boardroom', '/api/', '/portal'],
      },
    ],
    sitemap: 'https://prostackng-website.vercel.app/sitemap.xml',
    host: 'https://prostackng-website.vercel.app',
  };
}
