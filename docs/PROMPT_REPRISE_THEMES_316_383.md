# Reprise des thèmes 316 à 383 — prompt de chantier

> À lancer dans `~/skylaunch`, branche dédiée, **sans jamais déployer**.
> Ces 66 thèmes ne sont pas en production : ils sont masqués de la galerie.
> Le travail peut donc être long et profond sans risque pour la vente.

---

## Ce qui ne va pas, mesuré et non ressenti

Le reproche du client est « ils se ressemblent tous, c'est pauvre ». Les
chiffres lui donnent raison. Moyennes comparées, thèmes en production (1-315)
contre thèmes masqués (316-383) :

| Mesure | En production | Masqués |
|---|---|---|
| Lignes de code | 1 370 | **510** |
| Appels d'animation | 46 | **29** |
| Images dans la page | 3 | **2** |
| Pages annexes | 2 | **0** |
| Sections | 8 | 8 |

Et sur les 66 : **57 affichent trois images ou moins**, 2 n'en affichent
aucune.

Le nombre de sections est identique — c'est bien la preuve du problème. Même
squelette partout, rempli plus vite et moins loin : moins de code, moins
d'animation, presque pas d'images, aucune page annexe. D'où l'impression de
répétition malgré des palettes différentes.

---

## Ce qu'il faut obtenir

Les mêmes exigences que celles tenues sur les 315 autres. **Ne pas changer les
niches** : chaque thème garde son métier et son public. Ce qui change, c'est la
profondeur.

1. **Une identité visuelle qui ne ressemble à aucune autre.** Palette,
   typographie, rythme des espacements, traitement des images. Deux thèmes du
   même métier doivent être reconnaissables l'un de l'autre au premier coup
   d'œil.
2. **Des animations qui servent le propos**, pas un effet appliqué partout :
   une entrée orchestrée, un déclenchement au défilement, une micro-réaction au
   survol. Respecter `prefers-reduced-motion`.
3. **Des images réelles et chargées.** Le hero doit porter une photographie ou
   un parti pris graphique assumé — plusieurs thèmes masqués ont un hero vide.
   Utiliser les banques (`/api/stock`, Pexels et Pixabay) pour les
   démonstrations.
4. **Au moins deux pages annexes** cohérentes avec le métier : une page qui
   détaille l'offre, une page de contact ou de réservation. Les 315 thèmes en
   production en ont deux en moyenne ; ceux-là n'en ont aucune.
5. **Toutes les sections lisent la donnée du client.** C'est le contrat déjà en
   place, décrit ci-dessous.

---

## Le contrat à respecter, sans exception

Ces règles ont été payées cher sur les 315 autres thèmes. Les enfreindre
recrée exactement les défauts qu'on vient de corriger.

### La donnée du client

- Lire par les fonctions de `lib/templates/clientContent.ts` :
  `clientServices`, `clientReviews`, `clientTeam`, `clientKeyStats`,
  `clientCertifications`, `clientFaq`, `clientMenu`, `clientProducts`,
  `clientBeforeAfter`, `clientPhotos`, `clientName`, `clientCity`,
  `clientAddress`, `clientPhone`.
- Fusionner avec la démonstration par `resolveList(reel, demo)` : la ligne du
  modèle fournit l'icône et l'image, celle du client écrase ce qu'il a saisi.
  Rendre le tableau du client tel quel laisse `icon` indéfini et **fait
  disparaître la page entière** (React #130).
- **Déclarer dans `lib/templates/capabilities.ts`** chaque bloc réellement
  affiché : c'est cette table qui décide des questions posées au formulaire.
  Une section non déclarée est une section que le client ne peut pas remplir.
- **Déclarer dans `lib/templates/photoSlots.ts`** le nombre exact de photos
  utilisées (`n`) et le total du thème. Un thème absent de la table réclame
  une photo par défaut — qui n'apparaît nulle part. Un thème sans photographie
  se déclare `{ n: 0, total: 0, labels: [] }`.

### Les pièges qui ont coûté des jours

- **`photo(i, clientPhotos(s)[j])` avec `i ≠ j`** : `photo(i, repli)` renvoie
  `photoUrls[i]`. Le second indice n'est qu'un repli. 282 emplacements ont
  ainsi été réclamés au client puis jamais affichés.
- **Un hook React dans le JSX** (`y: useTransform(...)` dans un style) n'est
  appelé que tant que la vue qui le porte est rendue. Elle disparaît, React
  compte moins de hooks et **démonte toute la page** (#300). Pire encore dans
  un `.map()` : le nombre de hooks suit alors la longueur d'une liste que le
  client remplit. Garde-fou : `scripts/check-hooks-dans-jsx.mjs`.
- **Une constante de module est figée à l'import**, quand la session est encore
  nulle. Tout tableau interpolant la donnée du client doit être recalculé une
  fois la session arrivée — et **après** la dernière affectation de
  `sessionData`, sinon il lit celle du rendu précédent.
- **Une variable employée sans être déclarée** (`bp`, `fd`, `c`, `sessionData`)
  ne casse pas la compilation — les thèmes portent `@ts-nocheck` — mais fait
  disparaître la page au premier rendu. Garde-fou :
  `scripts/check-variables-contrat.mjs`.
- **Une fonction du contrat employée sans import** : même effet, même silence.
  Garde-fou : `scripts/check-imports-contrat.mjs`.
- **La session doit survivre à la navigation interne.** Le motif est en place
  dans les 373 thèmes : lire `?session=` puis retenir dans `sessionStorage`
  sous `apercu-session:<theme>`. Le copier tel quel.

### Le responsive et le tactile

- Rien ne doit défiler horizontalement à 390 px de large.
- Aucun texte du client hors écran ni amputé — y compris avec un nom de
  cinquante lettres, une photo verticale ou une seule prestation.
- Les commandes se visent au doigt. La passe globale de `BrandColorVar`
  agrandit la zone cliquable par un pseudo-élément, sans déplacer un seul bloc :
  ne pas la contourner par du rembourrage, qui décale le contenu sur un bouton
  à largeur fixe.

---

## Comment vérifier — les instruments existent déjà

Ne pas croire une lecture du code : mesurer au navigateur, avec un serveur
lancé par `SESSIONS_RATE_LIMIT=1000000 npx next start -p 3000`.

| Question | Instrument |
|---|---|
| La page plante-t-elle avec un profil complet ? | `scripts/qa-plantage.mjs` |
| Chaque section déclarée porte-t-elle la donnée ? | `scripts/qa-sections.mjs` |
| Que reste-t-il de la démonstration ? | `scripts/qa-demo-residuelle.mjs` |
| Les photos réclamées s'affichent-elles ? | `scripts/qa-photos-client.mjs` |
| Les images se chargent-elles, sont-elles variées ? | `scripts/qa-images.mjs` |
| Téléphone : débordement, cibles tactiles | `scripts/qa-annexes-responsive.mjs` |
| Nom à rallonge, photo verticale, une prestation | `scripts/qa-cas-limites.mjs` |
| La session survit-elle au clic ? | `scripts/qa-navigation-session.mjs` |
| Les pages annexes tiennent-elles ? | `scripts/qa-sous-pages.mjs` |

**Règles de mesure, apprises en se trompant :**

- **Ne jamais compiler pendant une mesure.** `next start` sert les fragments du
  build en cours : chiffres catastrophiques et faux. C'est arrivé trois fois.
- **Armer un témoin de contrôle** dans chaque campagne — un cas qui *doit*
  échouer. S'il ne remonte rien, c'est la mesure qui est morte, pas le produit
  qui est sain. Un limiteur de débit à 30 requêtes par minute a déjà fait
  conclure « zéro défaut » sur 8 206 mesures de pages vides.
- **Six à huit navigateurs au maximum.** Au-delà, les délais d'attente
  explosent et l'on prend la charge machine pour un défaut du produit.
- **Repérer en statique, confirmer au navigateur.** Un scan de fichiers trouve
  en quelques secondes ce qu'une campagne met quarante minutes à voir.
- **Mesurer tout le site, pas la seule page d'accueil.** Une photo « perdue »
  vit souvent sur une page annexe.
- **Un relevé unique ne voit qu'une image d'un diaporama.** Cumuler sur une
  dizaine de secondes.

---

## Marche à suivre

1. Créer une branche dédiée depuis `chantier-2026-08`.
2. Établir l'état des lieux des 66 thèmes avec les instruments ci-dessus, et
   l'écrire dans `docs/` — chiffré, thème par thème.
3. Reprendre par lots de cinq à dix thèmes : identité visuelle, animations,
   images, deux pages annexes, câblage complet du contrat.
4. Après chaque lot : les trois garde-fous statiques, `npm test`, puis
   `qa-plantage` et `qa-sections` sur le lot.
5. Commits par lot, message décrivant ce qui a changé et ce qui a été mesuré.
6. **Ne pas déployer. Ne pas réintégrer ces thèmes à la galerie** sans accord
   explicite de Valentin.

## Ce qu'il ne faut pas faire

- Changer les niches ou les métiers : ils restent tels quels.
- Toucher aux thèmes 1 à 315, qui sont en production et vérifiés.
- Réintroduire une palette ou une mise en page déjà employée : c'est
  précisément le reproche de départ.
- Conclure sur une lecture du code. Chaque affirmation de fin de lot doit
  s'appuyer sur une mesure au navigateur.
