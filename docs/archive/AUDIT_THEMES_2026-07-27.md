# Audit qualité — 315 thèmes (2026-07-27)

Méthode : chaque thème chargé dans un vrai navigateur (Playwright), à 375 / 768 / 1440 px.
Mesures réelles (pas de lecture de code) : images cassées, chevauchements de texte, présence
d'image/vidéo dans le hero, densité d'animation, nombre de sections, volume de contenu.

---

## 1. Ce qui a été corrigé pendant l'audit

| Défaut | Portée | État |
|---|---|---|
| Images 404 (Unsplash morts) | 50 URLs / 41 thèmes | corrigé |
| Hero sans aucune image (fond plat) causé par ces 404 | impact-267/268/269/270 | corrigé |
| CTA invisible sous la ligne de flottaison mobile | 14 thèmes (famille `mb`) | corrigé |
| Indicateur de scroll posé sur le CTA/les stats | 27 thèmes | corrigé |
| Titre/kicker passant sous le header fixe | 12 thèmes | corrigé |
| Marques réelles sur des démos fictives | impact-81, impact-321 | corrigé |
| Photos identiques entre 2 thèmes du même métier | impact-244/266, 254/255 | corrigé |
| Notes/stats identiques sur toutes les cartes (4.9 / 12k+) | galerie `/themes` | corrigé |

**Résultat : 0 image cassée sur les 315 thèmes.**

---

## 2. Le vrai problème restant : les heros

C'est le point que tu avais identifié, et les chiffres le confirment.

**91 thèmes sur 315 (29 %) n'ont ni image, ni vidéo dans le hero.**

Ils se divisent en deux groupes très différents :

### 2a. Heros plats ET sans animation — 35 thèmes (le vrai problème)

Fond de couleur uni, typo, et presque rien qui bouge. C'est là que l'écart avec
Slider Revolution est le plus visible.

Les 15 pires (triés par pauvreté d'animation) :

| Thème | Animations | Métier |
|---|---|---|
| impact-219 | 1 | SaaS |
| impact-36 | 3 | agence |
| impact-46 | 6 | cabinet d'avocats |
| impact-37 | 7 | bar à vin |
| impact-61 | 7 | — |
| impact-41 | 8 | couture (mono-section) |
| impact-47 | 10 | événementiel |
| impact-102 | 10 | quantique |
| impact-131 | 11 | château / réception |
| impact-176 | 11 | data |
| impact-31 | 11 | bien-être |
| impact-53 | 11 | — |
| impact-33 | 13 | boulangerie |
| impact-83 | 13 | restaurant |
| impact-32 | 13 | vétérinaire |

### 2b. Heros sans photo mais très animés — 56 thèmes

Choix assumé (WebGL, canvas, typo cinétique, HUD). À ne pas "corriger" —
plusieurs sont parmi les meilleurs du catalogue.

---

## 3. Cas d'école : impact-37 (celui que tu as cité)

Tu avais raison, et la cause est précise.

Le hero affiche une bouteille SVG censée « se remplir au scroll ». Le remplissage
est piloté par `scrollYProgress` du hero, sur l'intervalle
`["start start", "end start"]` — donc il progresse **pendant que le hero sort de
l'écran**. Or le même scroll applique `heroOpacity → 0` dès 60 %.

Conséquence : l'animation ne joue qu'une fois le hero devenu invisible. Elle
"marche" techniquement, personne ne la voit jamais. À cela s'ajoute un fond
bordeaux uni, sans photo.

C'est le premier candidat à une reconstruction complète.

---

## 4. Classement

### Top 15 (les plus solides)

impact-199, 275, 88, 284, 06, 02, 280, 288, 283, 75, 287, 289, 278, 276, 281

Points communs : vraie photo plein cadre, 60-150 éléments animés, 8-12 sections,
900-1500 mots. Ce sont aussi majoritairement des métiers très vendables
(tatouage, droit, dentaire, mariage, comptabilité, kiné, électricité).

### Bas de classement — hors problèmes déjà corrigés

impact-41 (1 section, 113 mots), impact-61, impact-52, impact-53, impact-03,
impact-18, impact-44, impact-141, impact-102, impact-36, impact-68, impact-11,
impact-101, impact-35.

Beaucoup sont des concepts "tech/abstrait" (crypto, quantique, SaaS, sci-fi) —
c'est-à-dire précisément le segment le moins vendable pour Aevia.

---

## 5. Vendabilité

Le catalogue est déséquilibré vers des niches difficiles à vendre :
SaaS, crypto, quantique, sci-fi, showreels d'agence. Ces thèmes cumulent les
scores les plus bas **et** le plus faible potentiel commercial.

À l'inverse, les métiers à fort panier (droit, esthétique/dentaire, architecture,
immobilier de prestige, mariage haut de gamme) sont sous-représentés en heros
premium — alors que ce sont eux qui convertissent.

---

## 6. Suite

1. Reconstruire les heros de 5-8 thèmes du groupe 2a, en commençant par impact-37.
2. Étoffer le catalogue côté métiers à fort panier (droit, esthétique, architecture).
3. Photos dupliquées : 44 groupes partagent encore une image entre 2+ thèmes du
   même métier. Pas un bug, mais ça se voit quand on parcourt la galerie.
