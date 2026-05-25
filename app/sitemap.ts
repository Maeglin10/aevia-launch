import type { MetadataRoute } from 'next'

const BASE = 'https://aevia-launch.vercel.app'

const SITE_THEME_IDS = [
  'landing', 'saas', 'agency', 'vitrine', 'consultant', 'portfolio', 'ecommerce',
  'restaurant', 'hotel', 'healthcare', 'realestate', 'fitness', 'event', 'nonprofit',
  'startup', 'luxury', 'brutalist', 'magazine', 'aurora', '3d-tech', 'minimal-pro',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const themePages: MetadataRoute.Sitemap = SITE_THEME_IDS.map((id) => ({
    url: `${BASE}/themes/${id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: BASE, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/themes`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/templates`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/configure`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/onboarding`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/showcase`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    ...themePages,
  ]
}
