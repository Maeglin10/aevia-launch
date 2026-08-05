# Regarder, mesurer, corriger — la QA visuelle des thèmes et du wizard

Ce document raconte ce qu'une campagne de captures a trouvé que la mesure du DOM
ne voyait pas, et surtout **comment se tromper en mesurant** — c'est la partie
qui a coûté le plus de temps.

## Les outils

    node scripts/visual-qa.mjs --tranche 0 5   # capture les 373 thèmes, relève les défauts
    node scripts/qa-hero.mjs --tranche 0 5     # le titre du client casse-t-il la mise en page ?
    node scripts/tighten-hero.mjs /tmp/hero*.json  # resserre les gabarits qui ont grandi
    node scripts/wizard-qa.mjs [--mobile]      # parcourt le tunnel comme un client
    node scripts/rapport-visuel.mjs /tmp/qa*.json

Les captures partent dans `/tmp/qa/<thème>-haut.jpg` (premier écran) et
`-page.jpg` (page entière) ; le tunnel dans `/tmp/wizard/`.

## Ce que le regard a trouvé, que la mesure ne voyait pas

**Les photos d'une banque sur deux ne s'affichaient jamais.** Trois causes
empilées : `pixabay.com` absent de `remotePatterns` (400 sur `/_next/image`), la
même absence dans `img-src` de la CSP, et surtout des adresses `pixabay.com/get/…`
**signées, valables vingt-quatre heures** — le site livré perdait ses photos le
lendemain. On dérive maintenant l'adresse permanente du CDN depuis `previewURL`.

**Les banques indexent en anglais.** « plombier » ramenait un cimetière
militaire, « avocat » des fruits. Cinquante-six métiers ont leur terme anglais
avec le cadrage : « plumber at work », « hair salon interior ».

**Le titre du hero parlait d'une autre entreprise** sur 242 thèmes sur 373 : « We
build the internet's best. » sur un site de plomberie. Le nom était bon dans
l'en-tête, l'accroche bonne sous le titre — mais la première chose qu'on lit
venait d'ailleurs. Trois cent cinq titres portent désormais la donnée du client,
répartie sur les lignes que le thème a dessinées.

**Les photos disparaissaient quand le client remplissait ses réalisations** :
`img: b.afterUrl ?? repli` — `??` ne rattrape pas la chaîne vide.

**Un carrousel lisait au-delà de la liste** dès que le client saisissait moins
d'avis que le thème n'en montre : la rotation capture la liste du premier rendu,
l'index monte, la session arrive, la liste raccourcit, la page plante.

## Comment se tromper en mesurant

Cinq erreurs d'instrument, toutes prises pour des défauts du produit :

| l'instrument disait | la vérité |
|---|---|
| « les thèmes n'affichent rien » | on reconstruisait pendant la mesure |
| « le compteur reste à zéro » | on remontait en haut avant de lire, et un compteur sorti du champ se remet à zéro |
| « ce thème n'affiche pas les photos » | il les réserve à ses vues intérieures |
| « tous les blocs manquent » | la page n'avait rien rendu à l'échéance ; trois essais règlent le cas |
| « cet en-tête est illisible » | texte blanc sur photo : la photo est une sœur du texte, pas une aïeule |

Deux règles en sont sorties :

1. **Mesurer avec une donnée client plus courte que l'exemple** (un avis contre
   quatre), **partielle** (une légende sans photo) et **écrite autrement**
   (« 137 € » contre « 137 »). C'est là que tout casse.
2. **Comparer avec et sans**, plutôt que deviner. Un gabarit compté en
   caractères ne dit pas où un titre casse — « Tame Your » fait neuf caractères
   et tient déjà sur deux lignes. On mesure, on resserre, on remesure.

Le contraste, lui, ne se calcule pas depuis le DOM sur un fond photographique :
trois campagnes de suite ont signalé des en-têtes parfaitement lisibles. Il reste
relevé dans les fiches, mais il se juge sur la capture.

## Le tunnel de création

Parcouru en client, en 1440 et en 390 pixels.

| ce que le client subissait | corrigé en |
|---|---|
| vignettes de 64 px pour choisir son design | grille de trois, vignette pleine largeur |
| « Dr. Beaumont · Strasbourg », « impact-243 » | modèle numéroté et sa vignette |
| descriptions anglaises sur la typographie | effacées — l'image parle |
| 2098 px de défilement avant « Continuer » | barre d'action collante : 0 px sur six écrans sur huit |
| la bulle de discussion par-dessus « Continuer » | elle quitte le tunnel |
| quatorze champs d'horaires vides | la semaine usuelle proposée, à corriger |
| emojis à contresens (le kiné en coureur) | cinquante-quatre icônes au trait |
| aucune étiquette liée à son champ | `htmlFor`, `id`, `aria-invalid` |
| « + Ajouter une prestation » qu'on ne voit pas | une ligne déjà ouverte, avec des exemples |
| pastilles numérotées muettes | « Votre offre · étape 4 sur 7 » |
