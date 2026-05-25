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
    sitemap: 'https://aevia-launch.vercel.app/sitemap.xml',
    host: 'https://aevia-launch.vercel.app',
  }
}
