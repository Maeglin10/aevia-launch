import { NextResponse } from 'next/server'

const CONTENT = `# AeviaLaunch — Sites web professionnels en 2h à 7j

> Créez votre site professionnel entre 2h et 7j selon le plan, sans compétences techniques.

## À propos
AeviaLaunch est un service SaaS de création de sites web pour entrepreneurs, TPE et PME. Plus de 290 thèmes optimisés SEO disponibles par secteur d'activité (restaurants, coachs, artisans, e-commerce, vitrines). Le site est livré mobile-first, avec hébergement inclus et connexion Google Search Console native. Intégration HubRise pour les restaurants.

## Cas d'usage
Restaurants, coachs, artisans, e-commerce, consultants, portfolios, agences, SaaS, hôtels, cliniques, associations, startups, professions libérales.

## Tarifs
- Essentiel : 599 € — site vitrine livré en 2 à 4 heures
- Pro : 899 € — site multi-sections, blog intégré, analytics
- Premium : 1 499 € — e-commerce, effets 3D, intégration Stripe

## Délai de livraison
Entre 2h et 7j selon le plan choisi.

## Pages clés
- [Accueil](https://launch.aevia.services)
- [Tarifs](https://launch.aevia.services/pricing)
- [Thèmes disponibles](https://launch.aevia.services/themes)
- [Créer mon site](https://launch.aevia.services/configure)
- [Mentions légales](https://launch.aevia.services/legal)

## Contact
- Société : Aevia (auto-entrepreneur — SIREN 852 546 225)
- Email : valentinmilliand@aevia.services
- Site : https://aevia.services

## Produits Aevia
- [AeviaLaunch](https://launch.aevia.services) — création de sites web professionnels
- [AeviaInbox](https://inbox.aevia.services) — agents IA multi-canaux (WhatsApp, email, voix)
- [AeviaSecurity](https://security.aevia.services) — audit de sécurité et performance web
`

export async function GET() {
  return new NextResponse(CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
