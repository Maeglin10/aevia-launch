# Niches sans thème — état du catalogue au 1er août 2026

315 templates. Méthode : les `name`, `description`, `tags` et `category` de
`lib/templates/registry.ts` ont été normalisés (accents retirés, minuscules)
puis testés contre une liste de mots-clés FR + EN par métier. Un thème compte
pour une niche dès qu'un de ces mots-clés apparaît.

C'est une mesure, pas un jugement : un thème peut convenir à un métier sans le
nommer. Le chiffre dit « aucun thème ne se présente comme ça », ce qui est
exactement ce qu'un prospect voit en parcourant la galerie.

## 1 · Trous dans la taxonomie déclarée

`lib/templates/sectors.ts` déclare 43 spécialités. Deux sont quasi vides :

| Niche | Thèmes | Détail |
|---|---|---|
| Vétérinaire | 1 | impact-32 |
| Pisciniste | 1 | impact-177 |

Puis, faiblement couvertes (3 à 4) : coiffeur, studio créatif, couture,
fleuriste, expert-comptable, coach sportif.

## 2 · Niches hors taxonomie, zéro thème

27 métiers réels, tous absents du catalogue **et** de la taxonomie :

Assurance/courtier · Audioprothésiste · Auto-école · Blanchisserie ·
Boucherie-poissonnerie-fromagerie · Centre de formation (Qualiopi) ·
Contrôle technique · Couvreur-zingueur · Crèche / garde d'enfants ·
Cuisiniste · Déménageur · Infirmier libéral · Laboratoire d'analyses ·
Location de matériel · Notaire · Opticien · Peintre en bâtiment ·
Pharmacie · Podologue · Pompes funèbres · Producteur fermier ·
Sage-femme · Salle de réception · Sécurité privée · Serrurier ·
VTC / taxi · Vitrier-miroiterie

Et 8 autres à un seul thème : brasserie artisanale, cabinet de recrutement,
caviste, école de musique, gestion de patrimoine, menuisier-ébéniste,
toiletteur / pension animale, pisciniste.

## 3 · Les cinq retenues pour la série premium

Critères : panier moyen élevé, intention d'achat d'un site forte, monde visuel
distinct (sinon le geste d'animation devient arbitraire), et marché français
réel et dense.

| # | Niche | Marché FR | Panier moyen | Geste | Pourquoi ce geste |
|---|---|---|---|---|---|
| 1 | Opticien | ~12 000 points de vente | 300–600 € | `ArcSwap` | Les montures se remplacent une par une devant le visage — le balancier au pivot bas est littéralement ce mouvement |
| 2 | Cuisiniste / agencement sur mesure | ~4 500 | 10–20 000 € | `ExpandFrame` | Le cadre qui s'ouvre = le plan qui devient la pièce |
| 3 | Pompes funèbres | ~3 500 | 3–6 000 € | `HeldSwap` + `DWELL.slow` | Le temps mort tenu (0,5 s) est ce qui rend un hero cher ; ici il porte aussi le respect |
| 4 | Serrurier / dépannage 24-7 | ~8 000 | 150–400 € par intervention | `HardCutRebuild` | Coupe franche puis reconstruction : l'urgence, lisible sur un téléphone à 3 h du matin |
| 5 | Pharmacie / parapharmacie | ~21 000 | récurrent | `MosaicPush` | La grille qui pousse = le rayonnage ; c'est le plus gros marché de la liste |

Alternatives sérieuses si l'une saute : notaire (panier très élevé, mais
visuellement proche des 11 thèmes d'avocat), auto-école (12 000 écoles, public
jeune), centre de formation Qualiopi (budget B2B), déménageur.

## 4 · Contrainte de fabrication

Les thèmes existants sont bons. La règle pour cette série : **on n'invente pas
une mise en page, on ajoute un geste.** Chaque nouveau thème part de la
structure d'un thème voisin déjà mesuré, reçoit sa signature d'animation, et
doit passer les mêmes contrôles que les 13 de la nuit du 29 juillet :

- 1440×900 et 390×844
- aucun mot coupé en plein mot dans un `h1`/`h2`
- aucun débordement horizontal
- un appel à l'action visible sans défiler
- toutes les images en 200 **et** au bon sujet (les ouvrir, pas les curler)
- `prefers-reduced-motion` respecté (déjà géré par le kit)

## 5 · Pourquoi en code et pas en Figma

Trois raisons, dans l'ordre :

1. Les 25 gestes existent déjà, mesurés image par image sur les enregistrements
   Slider Revolution (`docs/CATALOGUE_GESTES.md`). Un mockup Figma les
   redessinerait à la main, moins bien.
2. Les thèmes sont des composants React, pas des maquettes. Un fichier Figma
   demanderait une réimplémentation complète derrière.
3. Figma ne se mesure pas à 390×844. Les défauts qu'on cherche — mot coupé,
   débordement, CTA sous la ligne de flottaison — n'existent qu'une fois rendu.
