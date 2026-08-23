# Reprise 316–383 — ce qui reste à faire

**Branche** : `claude/prompt-reprise-themes-316-383-y5lfwc`
**Plan** : [REPRISE_316_383_PLAN.md](REPRISE_316_383_PLAN.md) — l'allocation
geste / archétype / fontes / palette par thème y est complète, c'est la
référence pour tout ce qui suit.
**Rapport de chantier** : [REPRISE_316_383_RAPPORT.md](REPRISE_316_383_RAPPORT.md)

## Où on en est — mis à jour le 23 août

**Les 66 thèmes de la reprise sont faits et poussés.** Les 17 restants ont
été terminés à la main (sans agents) : 6 récupérés des agents interrompus et
vérifiés avant d'être gardés (351, 365, 372, 374, 377, 380), 354 réécrit en
entier (H4 décalé, ScrollGrow 1 → 1.42), 363/366/369 complétés, la passe de
contrat commune appliquée à 368, 373, 375-379, 381-383 (téléphone/courriel
par bp.contacts, engagements retouchables, LegalIdentity complet), et les
deux remplacements de geste du plan exécutés : 368 PanelRise → WipeReveal
(H2, média à gauche), 381 HeldSwap → PortalZoom (la voûte de cave).

`capabilities.ts` est aligné (0 bloc manquant au rapport), le manifeste des
retouches est régénéré (2 485 retouches sur 371 thèmes).

## Ce qui reste sur ce chantier

1. **Balayage visuel** des thèmes non encore vus à l'écran (la règle du
   projet : rien n'est « fait » sans capture regardée) : 331-383 hors 316-330
   déjà mesurés. `node scripts/qa-reprise.mjs impact-XXX … --sortie /tmp/vue`
   sur `next start`, un seul balayage à la fois.
2. **Wizard** : quatre métiers (garage_auto, coiffeur, institut_beaute,
   pressing) affichent des blocs « produits » que leur archétype de wizard ne
   demande pas — rapport `couverture-wizard-themes.mjs`. C'est un manque côté
   `sector-questions`, pas côté thèmes.
3. **Déploiement Vercel manuel** puis contrôle au navigateur sur le domaine.

## La suite du programme « tout vendable »

Voir [AUDIT_QUALITE_2026-08-12.md](AUDIT_QUALITE_2026-08-12.md) et
[REPRISE_P0_PLAN.md](REPRISE_P0_PLAN.md) : les 18 thèmes P0 (vendus au
catalogue, corps en anglais ou hors sujet), puis P0bis (premium sous 45),
puis P1 par séries homogènes. Les paliers de prix sont déjà régénérés
(58 thèmes remis à leur vrai prix).

---

## Annexe — consignes données aux agents

Reproduites telles quelles pour que la reprise soit identique.

### À lire avant d'écrire
1. `docs/REPRISE_316_383_PLAN.md` en entier — le §4 est le cahier des charges
   opposable, la ligne du §3 est la spec du thème.
2. Le fichier actuel du thème — **conserver tout son contenu rédactionnel** :
   nom, ville, métier, prestations, tarifs, avis, mentions réglementaires,
   FAQ. On n'invente rien. Les URLs de photos existantes sont conservées
   telles quelles ; ne jamais en inventer.
3. Une référence de qualité lue en entier : `impact-245` (clair/artisanal),
   `impact-247` (technique) ou `impact-83` (héros sans photo).
4. `impact-351` — le patron de câblage.
5. Les exports réels des kits (`grep -n "^export" lib/templates/hero-kit-2.tsx
   lib/templates/hero-kit-3.tsx`) et l'implémentation du geste posé.

### Structure imposée
`"use client"` + `// @ts-nocheck` ; `let fd, c, bp, sessionData` au niveau
module ; chargement `?session=` avec repli
`sessionStorage["apercu-session:impact-XXX"]` ; affectations **dans le corps
du rendu**, avant tout appel de helper ; données démo en `XXX_SOURCE` +
fonctions `XXX_LIVE()` ré-appelées dans `Page()` ; **toute liste** par
`resolveList(clientXxx(sessionData)?.map(…), SOURCE)` en reprenant les champs
de présentation de la démo via `SOURCE[i % SOURCE.length]`.

Helpers à employer : `clientHeroLine` (maxLigne calibré sur le gabarit réel du
titre), `clientHeroSubtitle` **ou** `clientHeroPrestations` (choisi au
câblage), `clientEyebrow`, `clientTrade`, `clientName`, `clientCity`,
`clientServices` (avec `price`), `clientReviews`, `clientStats`,
`clientCertifications`, plus `clientFaq`/`clientTeam`/`clientWorks`/
`clientAreas` si le thème affiche ces blocs, `clientPhone`, `clientEmail`,
`clientAddress`, `clientCodePostalVille`, `clientPhotos`, `clientText`/
`clientList`, et `<LegalIdentity fallback="852 546 225" kind="siren" />` au
pied de page.

Attention : `clientEyebrow` rend déjà « Métier · Ville » — n'ajouter la ville
qu'aux replis, sinon elle s'écrit deux fois (défaut trouvé sur 318 et 319).

≥ 6 retouches de prose sous la forme exacte
`{/* TEXTE_SECTION */ clientText(sessionData, "section.titre") ?? (<>…</>)}`.

Photos : `fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli`
(`||`, pas `??`). Repli = URL existante s'il y en a une, sinon chaîne vide
avec un design CSS soigné.

**Ne pas recâbler** : lien de réservation, horaires, marque des sous-pages,
contraste, débordements, cibles tactiles — les passes globales
(`BrandColorVar`) s'en chargent. Couleur : `var(--brand, #hex)`.

### Design
Archétype et paire de fontes du plan (`@import` dans un `<style>` local).
L'ordre **et le dessin** des sections doivent s'écarter du squelette standard.
Une section-respiration après le héros. Micro-interactions en state local
(3+ propriétés, 0,45–0,55 s), nav collante à quatre propriétés, un détail
gratuit. `EASE=[0.16,1,0.3,1]` unique, répété littéralement en CSS. Textures
sans image. Geste unique du plan : transitions 0,6–1,0 s, DWELL 3–6×, stagger
55 ms, `prefers-reduced-motion` honoré, **un seul index pilote tout le héros**.

Responsive : grilles de cartes en
`repeat(auto-fit, minmax(min(280px,100%),1fr))` ; toute grille 2 colonnes
pilotée par une classe préfixée `iXXX-` avec sa media query locale ; sticky →
static au point de rupture ; `overflowX:"clip"` sur la racine, jamais
`hidden`. 800 à 1300 lignes par thème.

### Interdits
Aucun fichier partagé (`capabilities.ts`, `photoSlots.ts`, `layout.tsx`,
`BrandColorVar.tsx`, `registry*`, `sectors.ts`, `hero-kit*`) — uniquement
`app/templates/impact-XXX/page.tsx`. Aucune dépendance nouvelle, aucun commit,
aucun build, aucun serveur. Aucune URL contenant « sky », aucune adresse
physique sous le nom Aevia.

**Si le plan demande un élément que le contenu du thème contredit, ne pas
l'inventer** : garder le contenu et le signaler. C'est arrivé sur
`impact-332`, dont le texte dit qu'il n'y a pas de dépannage nocturne alors
que le plan prévoyait une bande « urgence 24 h ».

### Rapport attendu, par thème
```
impact-XXX
- geste: <nom + où/comment appliqué + params clés>
- blocs affichés (pour capabilities.ts): [...]
- photos: n=<demandables ≤8>, total=<slots>, labels=[...]
- clés clientText/clientList posées: [...]
- helpers contrat employés: [...]
- checks: <résultat des 4 scripts>
- points d'attention: <ce que la QA doit regarder>
```
