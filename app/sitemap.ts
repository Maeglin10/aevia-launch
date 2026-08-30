import type { MetadataRoute } from 'next'
import { MODELES_INDEXABLES } from '@/lib/templates/modeleSeo'

const BASE = 'https://launch.aevia.services'

/** Les 21 gabarits du constructeur, servis par /themes/[id]. */
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

  /*
    Les fiches de modèles. Le plan de site n'en déclarait aucune : il listait 25
    URL au total pendant que le catalogue décrivait 373 modèles sans qu'aucune
    page ne les présente. Seuls les modèles au-dessus de la barrière de vente
    sont listés — la même règle que le catalogue, pour la même raison.
  */
  const modelePages: MetadataRoute.Sitemap = MODELES_INDEXABLES.map((t) => ({
    url: `${BASE}/themes/modele/${t.id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    { url: BASE, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/themes`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/themes/modeles`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/showcase`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/configure`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/legal/mentions-legales`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/cgu`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/confidentialite`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/cookies`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    ...themePages,
    ...modelePages,
  ]
}
