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
    sitemap: 'https://www.prostackng.com.ng/sitemap.xml',
    host: 'https://www.prostackng.com.ng',
  };
}
