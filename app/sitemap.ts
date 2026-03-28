import { MetadataRoute } from 'next';
import { POSTS } from '@/lib/blog-data';

const BASE = 'https://www.prostackng.com.ng';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0  },
    { url: `${BASE}/products`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9  },
    { url: `${BASE}/technology`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE}/case-studies`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/pricing`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE}/demo`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/company`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7  },
    { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE}/media`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7  },
    { url: `${BASE}/blog`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/testimonials`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/press`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/investor`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE}/careers`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.75 },
    { url: `${BASE}/metrics`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7  },
    { url: `${BASE}/portal`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5  },
    { url: `${BASE}/academy`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE}/academy/verify`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5  },
    { url: `${BASE}/managed-services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9  },
  ];

  const blogRoutes: MetadataRoute.Sitemap = POSTS.map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...blogRoutes];
}
