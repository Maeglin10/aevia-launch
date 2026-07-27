# Slider Revolution — ce qu'ils font vraiment (teardown mesuré)

Source : `oakgrove-wine-slider-template`, config d'animation extraite du payload
réel de la page (pas une lecture de code approximative — 129 étapes d'animation
décodées depuis leur JSON de layers).

---

## 1. Le chiffre qui résume tout

**129 étapes d'animation dans un seul hero.**

Nos meilleurs thèmes tournent autour de 60-150 *éléments animés*, mais il s'agit
essentiellement de `opacity` + `translateY` avec un `easeOut`. Eux orchestrent
129 *étapes* distinctes, sur plusieurs axes.

---

## 2. Leurs easings — c'est le premier écart

| Easing | Occurrences |
|---|---|
| `power3.inOut` | 82 |
| `power4.inOut` | 38 |
| `none` | 8 |
| `power2.inOut` | 1 |

Ils utilisent presque exclusivement des courbes **inOut fortes** (power3/power4).
Ça donne des mouvements qui démarrent lentement, accélèrent franchement, puis se
posent. C'est ce qui produit la sensation « lourde et chère ».

Nous utilisons majoritairement `[0.16, 1, 0.3, 1]` (easeOut) — le mouvement part
vite et freine. Plus discret, moins spectaculaire.

## 3. Le timing est un rythme, pas du hasard

Délais distincts sur tout le hero : **0, 300, 500 ms**. Trois temps, c'est tout.

Durées : médiane **300 ms**, max **15 000 ms** (boucles d'ambiance lentes).

Autrement dit : les entrées sont rapides et calées sur une grille de 3 temps,
et par-dessus tournent des boucles très lentes. Nos templates utilisent souvent
des délais dispersés (0.1, 0.15, 0.25, 0.4, 0.45…) qui donnent un résultat
« flou » rythmiquement.

## 4. Ils animent en 3D, nous en 2D

| Propriété | Occurrences |
|---|---|
| `x` / `y` | 243 / 245 |
| `o` (opacité) | 124 |
| **`pers` (perspective 3D)** | **75** |
| `rZ` (rotation Z) | 24 |
| `sX` / `sY` (échelle) | 20 / 18 |
| `rX` / `rY` (rotation 3D) | 16 / 9 |

**75 couches avec une perspective 3D.** C'est le deuxième grand écart : leurs
éléments arrivent depuis la profondeur, pas seulement du bas.

## 5. La structure du hero n'est pas un bandeau

Le hero OakGrove est un **sélecteur de produit** :

- 5 slides, une par vin
- chaque slide : image de fond + nom du vin + note de dégustation + `ORDER NOW` + fermeture
- un cercle de texte « CLICK THE BOTTLE » invite à l'interaction
- cliquer une bouteille transforme le hero en fiche produit

Le hero **est** le catalogue. Ce n'est pas une bannière suivie d'une grille de
produits plus bas.

Types de couches : `image` (8), `column` (4), `group` (3), `row` (2), `zone` (2),
`slidebg` (1) — un vrai système de mise en page, pas un empilement.

## 6. Effets additionnels

- `explodinglayers` : 30 occurrences (l'élément se désagrège en particules à la sortie)
- `particles` : 8 occurrences

---

## 7. Ce qu'on en retient pour Aevia (sans copier)

1. **Changer les courbes.** Passer de `easeOut` à des `inOut` fortes sur les
   entrées de hero. Changement peu coûteux, effet immédiat.
2. **Rythmer sur 3 temps.** Une grille 0 / 300 / 500 ms au lieu de délais dispersés.
3. **Ajouter de la profondeur.** `perspective` + `rotateX/Y` légers sur les
   couches du hero, pour que ça arrive « de loin » et pas « du bas ».
4. **Superposer une boucle lente.** Une ambiance très longue (10-15 s) par-dessus
   les entrées rapides.
5. **Rendre le hero interactif** quand le métier s'y prête (carte, prestations,
   chambres) : le hero devient le sélecteur, pas une image d'illustration.

Le point 5 est le plus gros levier et rejoint le travail « flux métier »
déjà fait sur le catalogue.

---

## Limite de ce teardown

Leur site bloque l'automatisation (screenshots vidéo impossibles : les
animations infinies empêchent Playwright de stabiliser la page, et le
`goto` finit en timeout derrière leur protection). Ce document s'appuie donc
sur la **config d'animation réelle** extraite du HTML, ce qui est plus précis
qu'une capture, mais ne remplace pas un visionnage image par image pour le
ressenti. À refaire manuellement si besoin.
