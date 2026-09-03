import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://dotverse.store';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/shop', '/products/'],
      disallow: ['/api/', '/account/', '/cart/', '/checkout/', '/payment/', '/track-order/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
