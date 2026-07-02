/**
 * SEO defaults for AeviaLaunch client sites.
 * These helpers are called at site generation time to produce
 * the static SEO files bundled with every generated site.
 */

export function generateSitemap(domain: string, pages: string[]): string {
  const now = new Date().toISOString().split('T')[0]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>https://${domain}${page}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`
}

export function generateRobotsTxt(domain: string): string {
  return `User-agent: *
Allow: /
Sitemap: https://${domain}/sitemap.xml
`
}

export function generateLlmsTxt(
  siteName: string,
  domain: string,
  description: string,
  pages: Array<{ title: string; path: string; desc: string }>,
): string {
  return `# ${siteName}

> ${description}

## Pages

${pages.map((p) => `- [${p.title}](https://${domain}${p.path}): ${p.desc}`).join('\n')}

## Contact

- Site généré par AeviaLaunch: https://launch.aevia.services
`
}

export function generateLocalBusinessJsonLd(data: {
  name: string
  description: string
  url: string
  telephone?: string
  address?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  openingHours?: string[]
  priceRange?: string
  category: string // e.g. "Restaurant", "Coach", "Artisan"
}): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': data.category,
      name: data.name,
      description: data.description,
      url: data.url,
      ...(data.telephone && { telephone: data.telephone }),
      ...(data.address && {
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.address.street,
          addressLocality: data.address.city,
          postalCode: data.address.postalCode,
          addressCountry: data.address.country,
        },
      }),
      ...(data.openingHours && {
        openingHoursSpecification: data.openingHours,
      }),
      ...(data.priceRange && { priceRange: data.priceRange }),
    },
    null,
    2,
  )
}
