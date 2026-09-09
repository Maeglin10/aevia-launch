import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { MODELES_INDEXABLES } from '@/lib/templates/modeleSeo'
import { estHotePlateforme, origineDeLaRequete } from '@/lib/hotePlateforme'

const BASE = 'https://launch.aevia.services'

/** Les 21 gabarits du constructeur, servis par /themes/[id]. */
const SITE_THEME_IDS = [
  'landing', 'saas', 'agency', 'vitrine', 'consultant', 'portfolio', 'ecommerce',
  'restaurant', 'hotel', 'healthcare', 'realestate', 'fitness', 'event', 'nonprofit',
  'startup', 'luxury', 'brutalist', 'magazine', 'aurora', '3d-tech', 'minimal-pro',
]

/*
  Servi sur le domaine d'un client, ce plan de site listait les 25 pages
  d'Aevia et les 373 fiches de modèles — et pas une seule page du site payé.
  Un plan de site est ce qu'un moteur lit pour savoir QUOI indexer : le client
  n'y soumettait donc rien, pendant qu'on lui vend du référencement.

  Sur un domaine client, on ne déclare que son site.
*/
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const hote = (await headers()).get('host')
  if (!estHotePlateforme(hote)) {
    const origine = origineDeLaRequete(hote)
    /* Le middleware ne réécrit que la racine sur un domaine client : c'est la
       seule page qui existe pour un moteur. Déclarer davantage produirait des
       404 dans la Search Console du client — pire que rien. */
    return [{ url: origine, lastModified, changeFrequency: 'weekly', priority: 1.0 }]
  }

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
