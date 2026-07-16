import { NextResponse } from 'next/server'

const CONTENT = `# AeviaLaunch — Sites web professionnels livrés en 2h à 7 jours

> Créez un site web professionnel, optimisé SEO et mobile-first, livré en 2h à 7 jours selon le plan, sans écrire une ligne de code. Plus de 100 thèmes par secteur d'activité.

## À propos
AeviaLaunch est un service de création de sites web pour entrepreneurs, commerçants et TPE/PME. On choisit un thème adapté à son secteur, on renseigne ses informations via un assistant guidé, et le site est livré prêt à l'emploi : hébergement inclus, référencement optimisé dès la mise en ligne, adapté au mobile. Pour les restaurants, la prise de commande en ligne est intégrée via HubRise (compatible caisses comme Popina). AeviaLaunch fait partie de la plateforme Aevia, aux côtés d'AeviaInbox (service client IA) et d'AeviaSecurity (audit de sécurité).

## Cas d'usage
Restaurants et food-trucks, coachs, artisans, e-commerce, consultants, portfolios, agences, hôtels, cliniques et cabinets, associations, professions libérales, immobilier.

## Tarifs (paiement unique, hébergement inclus)
- Landing : 399 € — une page unique et percutante, idéale pour valider une idée ou lancer un produit.
- Essentiel : 599 € — site vitrine complet multi-sections.
- Pro : 899 € — site avancé (blog, pages secteur, intégrations, analytics).
- Premium : 1 499 € — site sur-mesure, multi-pages, intégrations spécifiques.

## Délai de livraison
Entre 2h et 7 jours selon le plan choisi.

## Questions fréquentes
- Combien de temps pour avoir mon site ? De 2 heures à 7 jours selon la formule.
- Dois-je savoir coder ? Non, tout se fait via un assistant guidé.
- L'hébergement est-il compris ? Oui, inclus dans le prix.
- Le site est-il optimisé pour Google ? Oui : SEO technique, données structurées et mobile-first dès la livraison.
- Puis-je prendre des commandes en ligne ? Oui, notamment pour les restaurants via HubRise.

## Pages clés
- [Accueil](https://launch.aevia.services)
- [Tarifs](https://launch.aevia.services/pricing)
- [Thèmes disponibles](https://launch.aevia.services/templates)
- [Créer mon site](https://launch.aevia.services/configure)

## Contact
- Société : Aevia (SIREN 852 546 225)
- Email : valentinmilliand@aevia.services
- Site : https://aevia.services

## Produits Aevia
- [AeviaLaunch](https://launch.aevia.services) — création de sites web professionnels
- [AeviaInbox](https://inbox.aevia.services) — standard téléphonique IA + service client multicanal (téléphone, WhatsApp, Instagram, email)
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
