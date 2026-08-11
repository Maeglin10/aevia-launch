# Audit de vendabilité — 315 templates, 30 juillet 2026

Quels thèmes se vendent mal, lesquels tirent leur métier vers le bas, et où
poser les mécaniques premium de `lib/templates/hero-kit-2.tsx`.

Le plan d'exécution pour Claude Code est dans
[PLAN_HEROS_PREMIUM.md](PLAN_HEROS_PREMIUM.md) — ce document-ci dit *quoi* et
*pourquoi*, l'autre dit *comment*.

## Méthode

Rien n'est jugé à l'œil seul. Pour chaque template :

- **Secteur réel**, lu sur la page (mots du contenu, marque, h1, nav) et non
  dans `registry.ts`. Le registre ment sur une partie du catalogue : il annonce
  « IronX Fitness / Sports » pour impact-119 qui est en réalité *NebulaCloud*,
  une infra cloud pour développeurs ; « Nørdic Furniture / Luxury » pour
  impact-149 qui est *Aether Wellness* ; « Void Arch / Minimal » pour
  impact-147 qui est *Vanguard Legal*. **Un acheteur qui filtre par catégorie
  dans la galerie tombe donc sur autre chose que ce qu'il a demandé.** À traiter
  séparément, c'est un problème de vente, pas de design.
- **Score de vendabilité** sur 100, composé de : photo ou vidéo dans le hero
  (25), nombre de photographies distinctes (20), densité d'animation (20),
  animation dans le hero (10), pages secondaires réelles (10), vidéo (8),
  volume de code (7).

Le score n'est pas une note de goût, c'est une mesure de ce qui fait vendre un
site vitrine : **une photo du métier dans le hero, du mouvement, et plus d'une
page.** Contrôle de cohérence : impact-10 (Grand Palais) sort à 86, le plus haut
du catalogue — c'est aussi celui que tu cites spontanément comme le meilleur.

## Ce qui va bien

La grande majorité du catalogue est solide. La médiane par secteur tourne autour
de 50, et les meilleurs sont vraiment bons :

| Thème | Score | Métier | Ce qui le porte |
|---|---|---|---|
| impact-10 | 86 | Hôtel | 16 photos, 86 animations, 6 pages |
| impact-01 | 81 | Agence | 9 photos, 89 animations, 7 pages |
| impact-02 | 79 | Photographe | Galerie masonry filtrable, modales plein écran |
| impact-04 | 77 | Restaurant | 11 photos, 6 pages |
| impact-130 | 77 | Conseil | 129 animations, split reveal au scroll |
| impact-89 | 75 | Création | 153 animations |
| impact-05 | 75 | SaaS | 20 pages secondaires |

Ceux-là n'ont besoin de rien.

## Le vrai problème : le bloc SaaS / tech

**49 templates sur 315 (16 %) sont des sites SaaS, crypto, quantique ou
open-source.** Médiane 38, la plus basse du catalogue, et 8 des 12 pires scores.

Ce n'est pas un défaut de fabrication : ces thèmes sont *voulus* sans
photographie, en typographie cinétique, HUD, terminal. Certains sont réussis
dans leur genre. Le problème est commercial : le boulanger, le kiné et le
maçon ne les achèteront jamais, et ils occupent 16 % de la vitrine.

**Recommandation** : garder les 8 à 10 meilleurs comme preuve de capacité
technique, et **reconvertir les autres vers un métier réel** — même mise en
page, même qualité d'animation, contenu et photos changés. Un HUD de trading
devient un tableau de bord d'artisan ; un terminal devient une page de garage.
C'est moins de travail que d'en écrire un nouveau, et ça transforme 30 thèmes
invendables en 30 thèmes vendables.

Les candidats à la reconversion, du moins vendable au plus :

`impact-119` `impact-129` `impact-161` `impact-102` `impact-101` `impact-54`
`impact-165` `impact-22` `impact-18` `impact-51` `impact-113` `impact-34`
`impact-219` `impact-44`

## Les 24 scores les plus bas

Secteur = ce que la page raconte réellement, pas ce que dit le registre.

| Thème | Score | Secteur réel | Hero | Photos | Anim. | Pages |
|---|---|---|---|---|---|---|
| impact-119 | 4 | SaaS / infra | — | 0 | 5 | 1 |
| impact-129 | 4 | SaaS / data | — | 0 | 5 | 1 |
| impact-149 | 6 | Beauté / spa | — | 1 | 7 | 1 |
| impact-147 | 9 | Avocat | — | 0 | 8 | 1 |
| impact-161 | 10 | SaaS | — | 0 | 18 | 1 |
| impact-44 | 11 | Gaming | — | 0 | 8 | 6 |
| impact-102 | 12 | Quantique | — | 0 | 8 | 1 |
| impact-101 | 13 | Blockchain | — | 0 | 21 | 1 |
| impact-54 | 14 | SaaS | — | 0 | 4 | 5 |
| impact-165 | 14 | SaaS | — | 0 | 35 | 1 |
| impact-22 | 14 | SaaS / IA | — | 0 | 24 | 6 |
| impact-84 | 16 | Santé | — | 2 | 6 | 6 |
| impact-18 | 17 | SaaS | — | 0 | 24 | 6 |
| impact-160 | 18 | Mode | — | 1 | 26 | 1 |
| impact-11 | 19 | Éducation | — | 0 | 20 | 7 |
| impact-148 | 19 | Beauté | — | 3 | 22 | 1 |
| impact-141 | 20 | Musique | — | 3 | 17 | 1 |
| impact-196 | 20 | Santé / robotique | — | 2 | 54 | 1 |
| impact-248 | 21 | Ostéopathe | — | 0 | 56 | 1 |
| impact-50 | 21 | Psychologue | — | 0 | 60 | 3 |
| impact-243 | 22 | Médecin | — | 0 | 61 | 1 |
| impact-53 | 22 | Création | — | 0 | 13 | 4 |
| impact-51 | 22 | SaaS | — | 0 | 15 | 5 |
| impact-59 | 23 | Optique | — | 2 | 9 | 5 |

Les six qui méritent une intervention en priorité, parce que leur métier se
vend et que seul le hero les tire vers le bas :

- **impact-149** — spa/bien-être, 1 photo, hero typographique nu. Le métier le
  plus photogénique du catalogue traité sans une seule image.
- **impact-147** — cabinet d'avocats sur fond de terminal vert. Aucun avocat
  n'achètera ça ; la mise en page, elle, est bonne.
- **impact-248 / impact-243 / impact-50** — ostéopathe, médecin, psychologue.
  Beaucoup d'animation (56 à 61), zéro photographie. Le patient veut voir le
  cabinet et le visage du praticien.
- **impact-84** — clinique, 6 pages déjà écrites, hero vide.

## Le plus faible de chaque métier

Quand un métier a plusieurs thèmes, c'est celui-ci qui traîne derrière — et
c'est là que l'ajout d'un hero premium rapporte le plus, puisque les autres
thèmes du même métier prouvent que la demande existe.

| Métier | Thèmes | Médiane | Le plus faible | Score | À poser |
|---|---|---|---|---|---|
| Bâtiment / artisan | 41 | 51 | impact-213 | 32 | `AnchoredBackdrop` |
| Santé / cabinet | 35 | 52 | impact-84 | 16 | `AnchoredBackdrop` + `SlideIndex` |
| Photo / création | 31 | 49 | impact-53 | 22 | `BentoCascade` |
| Avocat / juridique | 23 | 48 | impact-147 | 9 | `WordFlight` + `ExpandFrame` |
| Comptabilité / conseil | 18 | 53 | impact-109 | 34 | `WordFlight` + `ExpandFrame` |
| Restaurant / bar | 17 | 49 | impact-169 | 33 | `HeldSwap` (assiette) ou split |
| Boutique / e-commerce | 12 | 61 | impact-120 | 30 | `HeldSwap` + `CircularLabel` |
| Mode / joaillerie | 11 | 55 | impact-83 | 38 | `LineMask` + `Retint` |
| Mariage / événement | 11 | 57 | impact-266 | 32 | `AnchoredBackdrop` + vignette |
| Beauté / spa | 10 | 53 | impact-149 | 6 | split écran + pastilles |
| Fitness / sport | 9 | 48 | impact-139 | 42 | `GhostSolid` + bandeau compteur |
| Boulangerie | 8 | 55 | impact-90 | 31 | split écran + pastilles |
| Éducation | 8 | 43 | impact-49 | 23 | `AnchoredBackdrop` |
| Immobilier | 7 | 56 | impact-82 | 50 | `AnchoredBackdrop` + vignette |
| Tatouage | 7 | 56 | impact-309 | 44 | `BlurThrough` plein cadre |
| Coiffure / barbier | 4 | 56 | impact-209 | 39 | `BlurThrough` + `Retint` |
| Fleuriste | 3 | 51 | impact-47 | 34 | `HeldSwap` (bouquet) |
| Auto / garage | 3 | 45 | impact-72 | 25 | `GhostSolid` + bandeau |
| Vin / cave | 2 | 64 | impact-131 | 32 | `HeldSwap` + arche (déjà maquetté) |

Deux métiers n'ont qu'un ou deux thèmes et méritent surtout d'être **étoffés** :
hôtel/gîte (2), vin/cave (2), fleuriste (3), auto/garage (3),
coiffure/barbier (4). Un artisan qui cherche « garage » a le choix entre trois
thèmes dont un à 25.

## À traiter ensuite : les marques réelles citées comme clients

Une quinzaine de templates nomment des marques existantes **en tant que
clients, employeurs ou références**. C'est la même famille de problème que les
récompenses inventées retirées d'impact-106 (Awwwards, Cannes Lions) et les
salles réelles d'impact-127 : un site de démonstration qui affiche *Apple* ou
*Netflix* dans sa liste de clients énonce une fausse référence, et le client
qui achète le thème la garde telle quelle.

| Template | Ce qui est cité | Sous quelle forme |
|---|---|---|
| impact-58 | Adidas, Apple, Vuitton, Spotify, Balenciaga, Hermès | tableau `CLIENTS` |
| impact-96 | Netflix France, Cartier, Hermès, Louis Vuitton | références de production |
| impact-116 | Nike | étude de cas nommée |
| impact-57 | Nike EMEA, Dior, Balenciaga | intitulé de poste dans un témoignage |
| impact-24 | Linear, Uber, Atlassian | parcours d'un intervenant |
| impact-175, 322, 60, 83, 12, 281, 16, 23, 78 | Chanel, Dior, Cartier, Rolex, Patek, Lacoste, Nespresso | listes de marques ou de points de vente |

**À distinguer** : citer une marque automobile parce qu'un garage l'entretient
(impact-190 : Renault Zoe, Peugeot e-208, Tesla) est factuel et normal dans le
métier. C'est la liste de clients prestigieux qui pose problème, pas la mention
technique.

Correction : remplacer par des noms inventés, comme cela a été fait pour
impact-106 et impact-127. Un fichier à la fois, en relisant le contexte —
certaines occurrences sont légitimes.

## Un défaut de composition trouvé au passage

Deux titres se coupaient en plein milieu d'un mot, parce que la taille de
police dépassait la largeur de leur propre colonne et que `break-words` faisait
le reste :

- **impact-79** — « THE ARCHITECTU / RE ». Le mot fait 1029 px à 136 px de
  corps dans une boîte de 928 px à 1024, et 1332 px à 176 px dans 1304 px à
  1536. Retaillé sur ces mesures : 7,5 / 9,5 / 10,5 rem.
- **impact-98** — « TAMIN / G ENTRO / PY. » dès 1024 px : le titre est dans une
  cellule de grille à moitié de largeur (592 px à 1280) mais dimensionné comme
  s'il occupait tout l'écran (jusqu'à 14 rem).
- **impact-62** — « Surren / der » à 1024 px, même cause.

Les trois sont corrigés et revérifiés à 1024, 1280 et 1536 px : plus aucun mot
coupé sur les 315 templates. Le détecteur mesure chaque mot d'un `h1`/`h2`
contre sa boîte de ligne ; les césures sur trait d'union sont exclues, elles
sont correctes.

## Ce qui a été vérifié au passage

- **Images** : les 446 identifiants Unsplash et les 143 URL Pexels du catalogue
  ont été appelés un par un. Trois cassés, tous corrigés :
  impact-242 (id Unsplash tronqué d'un caractère, 404 partout),
  impact-46 et impact-312 (photos Pexels supprimées à la source).
  impact-317 chargeait ses avatars depuis `i.pravatar.cc`, **absent du
  `img-src` de la CSP** : les avatars étaient donc invisibles en production.
  Remplacés par des initiales, sans dépendance externe.
  Balayage final sur le **build de production** : 315 templates chargés, images
  paresseuses forcées, aucune image manquante. Les onze alertes restantes sont
  des requêtes `_next/image` annulées par la navigation — l'image est bien
  rendue dans tous les cas (`naturalWidth > 0`).
- **Responsive** : le travail de la session mobile (grilles inline qui ne se
  replient pas) a été revérifié au DOM — 0 colonne rognée, aucun défilement
  horizontal, desktop inchangé. Un doublon `maxWidth` introduit sur impact-215
  a été retiré (deux déclarations, la seconde l'emportait silencieusement).
- **Build** : `npm run build` passe, `tsc` reste à la ligne de base de 1942.

> Note d'outillage : le serveur de développement meurt sous un balayage des 315
> routes — Turbopack compile chaque route à la demande et ne rend pas la
> mémoire. Tout audit de masse doit passer par `npm run build && npx next start`.
