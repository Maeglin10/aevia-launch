import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { estHotePlateforme, origineDeLaRequete } from '@/lib/hotePlateforme'

/*
  Sur le domaine d'un client, ce fichier servait le robots.txt d'Aevia :
  `host: https://launch.aevia.services` et un sitemap pointant notre catalogue.

  L'effet est exactement contraire à ce qui lui est vendu. La directive `host`
  désigne l'adresse canonique d'un site : la déclarer chez nous revient à dire
  aux moteurs que le site payé n'est qu'un miroir du nôtre. Et le plan de site
  proposé ne contenait aucune de ses pages, donc aucune n'était soumise.

  Chaque domaine annonce désormais sa propre adresse et son propre plan de site.
*/
export default async function robots(): Promise<MetadataRoute.Robots> {
  const hote = (await headers()).get('host')
  const origine = origineDeLaRequete(hote)
  const plateforme = estHotePlateforme(hote)

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /* Les chemins internes du constructeur n'ont rien à faire dans
           l'index — ni chez nous, ni chez le client dont le site est servi
           par la même application. */
        disallow: ['/api/', '/admin/', '/_next/', '/order', '/success', '/checkout', '/preview/'],
      },
    ],
    sitemap: `${origine}/sitemap.xml`,
    // `host` désigne l'adresse canonique : celle du site servi, jamais la nôtre.
    host: plateforme ? 'https://launch.aevia.services' : origine,
  }
}
