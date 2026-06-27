import { NextResponse } from 'next/server'

const CONTENT = `# Aevia Launch

> Générateur de sites web professionnels par IA. Wizard 5 étapes, prévisualisation instantanée, mise en ligne en 2 heures. Sans compétences design ou technique.

## À propos
Aevia Launch est un service SaaS qui génère des sites web professionnels grâce à l'intelligence artificielle. L'utilisateur remplit un formulaire en 3 minutes, l'IA écrit les textes et adapte le design à son secteur d'activité, le site est livré en 2 heures.

## Cas d'usage
Restaurants, coachs, artisans, e-commerce, consultants, portfolios, agences, SaaS, hôtels, cliniques, associations, startups, professions libérales.

## Tarifs
- Essentiel : 599 € — site vitrine livré en 2 à 4 heures
- Pro : 899 € — site multi-sections, blog intégré, analytics
- Premium : 1 499 € — e-commerce, effets 3D, intégration Stripe

## Pages clés
- [Accueil](https://launch.aevia.services)
- [Tarifs](https://launch.aevia.services/pricing)
- [Thèmes disponibles](https://launch.aevia.services/themes)
- [Créer mon site](https://launch.aevia.services/configure)
- [Mentions légales](https://launch.aevia.services/legal)

## Contact
- Société : Aevia (auto-entrepreneur — SIREN 852 546 225)
- Email : contact@aevia.services
- Site : https://aevia.services

## Produits Aevia
- [Aevia Launch](https://launch.aevia.services) — création de sites web IA
- [Aevia Inbox](https://inbox.aevia.services) — agents IA multi-canaux (WhatsApp, email, voix)
- [Aevia Security](https://security.aevia.services) — audit de sécurité et performance web
`

export async function GET() {
  return new NextResponse(CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
