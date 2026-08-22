# Audit de qualité du catalogue — 12 août 2026

**Question posée** : maintenant que la reprise 316-383 a fixé un niveau de
référence, quels thèmes sont en dessous, lesquels sont les moins vendables,
et comment les remonter.

**Instrument** : `scripts/audit-qualite.mjs` — un score /100 par thème,
mesuré dans les fichiers (jamais estimé), en trois axes : design /40 (geste
de signature, `clamp()`, fontes dédiées, easing maîtrisé, media queries
locales, survols pilotés, reduced-motion, textures), câblage /40 (helpers du
contrat réellement appelés, `resolveList`, retouches `clientText`,
`LegalIdentity`, `var(--brand)`, photos du client) et vendabilité /20
(photos, présence au catalogue d'un métier, pages secondaires, matière).

Rejouer : `node scripts/audit-qualite.mjs` (tableau trié, pires en tête) ou
`--json` (fiches complètes).

## Ce que vaut l'instrument — et ce qu'il ne vaut pas

Le score mesure la **conformité au standard actuel** (la check-list du
[plan de reprise](REPRISE_316_383_PLAN.md), §4), pas la beauté. Trois
précautions ont été prises, et une réserve demeure :

- les thèmes multi-pages rangent tokens et fontes dans `shared.tsx` — il est
  intégré à la mesure (sans cela, impact-83 perdait 14 points) ;
- les vedettes historiques restent bien classées (impact-10 et impact-01 à
  77/100) : l'instrument ne pénalise pas l'ancien style riche ;
- le bas du classement a été **vérifié à l'écran** avec une session client
  réelle avant toute conclusion (voir plus bas) — l'instrument a déjà menti
  une fois cette semaine, la leçon est retenue ;
- réserve : un geste écrit à la main (la CraftSequence d'impact-245) ne
  compte pas comme « geste de signature » — 245/247 valent mieux que leurs
  64-66/100. Personne sous 40 n'est dans ce cas : le bas du classement est
  bas pour de vraies raisons.

## Résultat d'ensemble

373 thèmes · moyenne **56/100** (design 14/40, câblage 29/40, vendabilité
13/20). Distribution : **54 thèmes sous 40** · 131 entre 40 et 54 · 115
entre 55 et 69 · 61 à 70 et plus (la série 316-383 reprise occupe tout le
haut, 88-94).

Familles de défauts, sur les 373 :

| Défaut | Thèmes touchés |
|---|---|
| Aucun geste de signature (hero-kit) | 289 |
| Pas de `LegalIdentity` (SIREN en dur ou absent) | 283 |
| Pas de fontes dédiées (`@import`) | 199 |
| Moins de 8 `clamp()` (typo non fluide) | 182 |
| Moins de 10 helpers du contrat | 146 |
| Aucune media query locale | 143 |
| Zéro photographie | 57 |
| Hors du catalogue des métiers | 52 |
| Pas de `var(--brand)` (couleur client ignorée) | 25 |

## Vérification à l'écran (l'instrument ne suffit pas)

Six des pires ont été rendus avec une session client complète (couvreur à
Annecy : prestations tarifées, avis, chiffres, coordonnées, SIRET), photos
bloquées, aux deux tailles. Verdict sans appel :

- **impact-122 (17/100 câblage réel)** — c'est un **journal anglophone de
  démonstration** (« CHRONICLE. », articles sur l'architecture soviétique) :
  le nom du client est posé sur la manchette et *rien d'autre* ne lui
  appartient — ni prestations, ni tarifs, ni avis, ni téléphone, ni SIRET.
  D'immenses zones vides quand les photos ne chargent pas. Il est vendu 899 €
  au métier **formation** : un organisme de formation achète un journal
  anglais à son nom.
- **impact-41** — le héros affiche un **monogramme de la démonstration**
  (« VM ») au lieu du nom du client, et la page n'a aucun `h1`.
- **impact-51, 101, 146, 35** — même famille : la coquille se personnalise
  (nom, ville, accroche), le corps reste intégralement en démonstration.
- Point commun rassurant : **aucun débordement, aucune panne** — ces pages
  sont saines techniquement, elles sont juste vides du client et loin du
  niveau.

## Les moins vendables, par ordre d'urgence

### P0 — vendus au catalogue ET sous 40/100 (18 thèmes)

Un client peut les acheter aujourd'hui et recevoir de la démonstration :

`122` (formation, 30) · `146` (restaurant, 30) · `136` (décorateur, 32) ·
`160` (essentiel, 32) · `145` (33) · `35` (avocat/comptable/patrimoine, 33) ·
`44` (décorateur, 33) · `36` (avocat/comptable, 34) · `119` (formation, 35) ·
`100` (décorateur, 36) · `151` (36) · `140` `141` (37) · `97` `98` (37) ·
`11` (formation, 38) · `137` (38) · `39` (39).

### P0bis — facturés premium (1499 €) sous 45/100 (21 thèmes)

Le pire rapport prix/qualité ; presque tous sont aussi hors catalogue :
`113 110 161 18 65 06 09 62 76 124 135 142 24 70 116 78 58 69 93 219 305`.

### P1 — au catalogue entre 40 et 54 (120 thèmes)

La masse du milieu : vendables mais nettement sous le niveau. Liste complète
par `node scripts/audit-qualite.mjs` ; les séries 297-315 (48-54) et
124-198 y dominent.

### Hors catalogue (52 thèmes, dont 36 sous 45)

Invendables par construction — aucun métier ne les propose. Deux options par
thème : le **raccrocher** à un métier après remontée au niveau, ou
l'**assumer vitrine** (galerie seule) sans investissement. À trancher cas
par cas — la série mode/édition (41, 51, 113…) n'a pas de métier au
catalogue aujourd'hui.

### Métiers dont même le meilleur thème est faible

Ce sont les trous de l'offre, indépendamment des thèmes pris un à un :
**pisciniste** (max 52), **restauration rapide** (52), **vétérinaire** (55),
**salle de sport** (55), **photographe** (58), **architecte** (58),
**décorateur d'intérieur** (59, moyenne 45), **restaurant** (61, moyenne 51),
**école de musique** (61, moyenne 45). Nota : recrutement, brasserie,
vitrier, toiletteur remonteront seuls quand les 17 thèmes restants de la
reprise (373-383 et consorts) seront livrés.

## Deux découvertes de vendabilité hors classement

1. **Les 58 thèmes 326-383 sont sous-facturés de 600 €.** `TEMPLATE_TIER` ne
   couvre que 315 thèmes et le repli du sélecteur est « pro » (899 €)
   — `app/themes/page.tsx:530`. Or la série reprise compte désormais 8+
   sections, le critère du palier premium (1499 €). Régénérer la carte des
   paliers depuis les comptes de sections est le gain le plus rapide de tout
   ce document.
2. **Des thèmes anglophones sont vendus à des métiers français** (122 en est
   le cas extrême). La règle de cohérence de langue du contrat ne suffit pas
   quand le corps du thème est un contenu éditorial anglais non câblé.

## Comment les remonter

La méthode de la reprise 316-383 s'applique telle quelle — elle est écrite,
outillée et éprouvée sur 49 thèmes :

1. **Allocation d'abord** : étendre le tableau du
   [plan](REPRISE_316_383_PLAN.md) aux thèmes à reprendre (geste unique par
   métier, archétype de héros, paire de fontes, palette dédoublonnée). Les
   consignes d'agents sont reproduites dans
   [REPRISE_316_383_RESTE_A_FAIRE.md](REPRISE_316_383_RESTE_A_FAIRE.md).
2. **Ordre de bataille** : P0 (18 thèmes, trois lots) → P0bis en décidant
   d'abord catalogue ou vitrine → métiers faibles (un thème neuf au niveau
   vaut parfois mieux que trois remontées) → P1 par séries homogènes
   (297-315 partagent un squelette : un patron corrigé se décline).
3. **Quick wins transverses**, sans réécriture : régénérer `TEMPLATE_TIER`
   (une commande) ; poser `LegalIdentity` sur les 283 ; `var(--brand)` sur
   les 25 ; fonds de repli `C.bgDark` sur les sections plein cadre des
   thèmes à zones mortes (122 en tête).
4. **Mesurer avant/après** : `node scripts/audit-qualite.mjs` pour le score,
   `node scripts/qa-reprise.mjs impact-XX` pour l'écran — et regarder les
   captures. Un thème n'est « remonté » que quand les deux le disent.

## Ce que cet audit ne dit pas

Il n'a pas mesuré le rendu à l'écran des 367 thèmes non échantillonnés
(6 l'ont été), ni la pertinence commerciale des niches, ni la qualité des
photographies existantes (le mandataire du conteneur les bloque). Le score
est un ordre de priorité, pas un verdict final : chaque reprise commence par
ouvrir la page.
