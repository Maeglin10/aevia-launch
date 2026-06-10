import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/order', '/success', '/checkout'],
      },
    ],
    sitemap: 'https://launch.aevia.services/sitemap.xml',
    host: 'https://launch.aevia.services',
  }
}
