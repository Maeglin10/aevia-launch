# E-commerce réel — plan V1 (2026-09-06)

Décision produit : les thèmes « boutique/produits » doivent VENDRE réellement,
pas renvoyer vers Shopify. Constat de départ : catalogue affiché ✅, mais
paiement inexistant, panier fictif (impact-112 : checkout théâtral), champ
« Votre boutique » (storeUrl) saisi et jamais affiché, `mode: "stripe"` prévu
au schéma jamais implémenté.

## Architecture

Les sites clients sont servis par CE Next (routes des thèmes + domaines
custom) et les sessions vivent dans Vercel Blob — le backend Aevia porte donc
naturellement les APIs boutique. Aucune nouvelle infra.

- **Paiement : Stripe Connect (Standard)**. Chaque marchand relie SON compte
  Stripe (OAuth) ; les paiements arrivent chez lui ; Aevia peut prélever une
  `application_fee_percent` plus tard. `commerce.stripeAccountId` en session.
- **Panier : composants partagés**, pas de réécriture des thèmes.
  `components/boutique/` : `PanierProvider` (état localStorage par site),
  `BoutonAcheter`, `TiroirPanier`, `BarreBoutique`. Injectés par un wrapper
  monté quand le thème déclare le bloc `produits` et que la session a
  `commerce.stripeAccountId` (sinon : bouton « Voir la boutique » si
  `storeUrl`, sinon rien — vitrine).
- **Checkout : `POST /api/boutique/checkout`** { sessionId, lignes:[{id,qte}] }.
  Le serveur REVALIDE produits et prix depuis la session Blob (zéro confiance
  au navigateur), crée la Checkout Session sur le compte connecté
  (`stripeAccount`), retourne l'URL. Guest checkout (pas de comptes clients en
  V1 — Stripe collecte email + adresse + livraison).
- **Commandes : webhook `checkout.session.completed`** (endpoint Connect) →
  écrit `orders/<sessionId>/<orderId>.json` dans Blob + décrémente le stock +
  email au marchand (l'email de la session) via Resend si configuré, sinon
  visible dans son espace.
- **Stock (optionnel)** : `products[].stock?: number` saisi au wizard ;
  rupture → bouton désactivé « Épuisé » ; décrément au webhook.
- **Consultation marchand** : `GET /api/boutique/commandes?session=&token=`
  (editToken) — liste JSON, page `/boutique/commandes` minimaliste.

## Hors V1 (assumé)
- Comptes clients finaux (guest checkout d'abord — standard du marché).
- Mercado Libre / Amazon (phase 2 : flux export produits).
- Multi-devise (EUR d'abord ; USD suit la devise du wizard ensuite).
- Livraison calculée (V1 : frais fixes optionnels `commerce.fraisLivraison`).

## Étapes (chacune livrable et testable)
1. Schéma sessions.ts : `commerce.{mode,storeUrl,stripeAccountId,fraisLivraison}`,
   `products[].stock`, types commande.
2. `/api/boutique/checkout` + `/api/boutique/webhook` + persistance Blob.
3. Onboarding Connect : `/api/boutique/connecter` (redirige OAuth Stripe) +
   retour ; lien affiché après génération (page success + email).
4. Composants panier + injection sur thèmes `produits`.
5. `storeUrl` (mode external) : bouton « Voir la boutique » — les deux modes
   coexistent, le wizard demande lequel.
6. Commandes marchand (API + page).
7. QA e2e clés Stripe test : parcours achat complet sur 3 thèmes produits.
