# Reprise 316–383 — ce qui reste à faire

**Branche** : `claude/prompt-reprise-themes-316-383-y5lfwc`
**Plan** : [REPRISE_316_383_PLAN.md](REPRISE_316_383_PLAN.md) — l'allocation
geste / archétype / fontes / palette par thème y est complète, c'est la
référence pour tout ce qui suit.
**Rapport de chantier** : [REPRISE_316_383_RAPPORT.md](REPRISE_316_383_RAPPORT.md)

## Où on en est

**49 thèmes sur 66 réécrits et poussés** : 316-319, 321-322, 324-330,
331-345, 346-350, 352-353, 355-362, 364, 367, 370-371.

Chacun a été contrôlé : les quatre scripts de contrat passent
(`check-imports-contrat`, `check-variables-contrat`, `check-frozen`,
`check-hooks-dans-jsx`), le geste posé est celui du plan, et **aucune URL
d'image n'a été inventée** — le comptage des identifiants d'images avant et
après réécriture est identique fichier par fichier.

## Les 17 thèmes restants

**Huit étaient en cours d'écriture par des agents au moment de l'arrêt** —
leur travail n'est pas dans le dépôt, il faut les refaire :

| id | métier | geste | héros | fontes | palette |
|---|---|---|---|---|---|
| 351 | couvreur-zingueur Toits de Loire | HardCutRebuild | H3 plein cadre | P9 Syne+Work Sans | D #12161a / #cc7722 |
| 354 | crèche cocon Le Nid Douillet | ScrollGrow | H4 éditorial | P8 Newsreader+Manrope | #faf5f3 / #c26565 |
| 363 | pédicure-podologue Podo'Marche | MosaicPush | H1 split droite | P8 Newsreader+Manrope | #f5f9fa / #12766b |
| 365 | producteur fermier Quatre Vents | HeldSwap | H7 magazine | P4 Fraunces+Inter | #fbfaf4 / #5f7a2e |
| 366 | maraîchage/AMAP Estuaire | CrossPush | H3 plein cadre | P12 Bricolage+Figtree | #f4f9f4 / #2e7d4f |
| 368 | sages-femmes Neuf Mois & Vous | WipeReveal (≠) | H2 split gauche | P5 DM Serif+DM Sans | #f9f6fb / #7a5296 |
| 369 | domaine de mariage Charmilles | PortalZoom | H3 plein cadre | P3 Cormorant+system-ui | #fbf9f5 / #9a7b4f |
| 372 | sécurité commerces Horizon | TrackingCollapse | H1 split droite | P10 Spectral+IBM Plex | #f4f7fa / #2f6098 |

**Neuf n'ont jamais été lancés** : 373 à 383. Leur ligne d'allocation est au
§3 du plan.

`impact-351` mérite une attention particulière : c'est le **patron de câblage
de référence** du dépôt. Son design doit être élevé sans dégrader la qualité
de son câblage existant.

## Comment reprendre

Les consignes données aux agents sont reproduites en annexe ci-dessous. Un
agent par lot de trois thèmes, avec pour chacun sa ligne du §3 du plan.

## Ce qui reste après les thèmes

1. **Balayage visuel des 36 thèmes non encore mesurés** (331-371). Seuls les
   13 premiers (316-330) ont été capturés et regardés.
   ```bash
   npm run build && SESSIONS_RATE_LIMIT=1000000 npx next start -p 3000
   node scripts/qa-reprise.mjs impact-331 impact-332 … --sortie /tmp/vue
   ```
   Un seul balayage à la fois. **Regarder les captures**, ne pas se contenter
   de la ligne de résultat. Les points d'attention signalés par les agents :
   - 331 : la queue du titre ne doit pas tomber sur la photo (chevauchement H4) ;
   - 338 : le bento repose sur `display: contents` — vérifier le placement des
     dix tuiles à 1440 et le repli en colonne sous 900 px ;
   - 339 : l'orbe doit passer sous le texte à 390 px, sans déborder ;
   - 345 : le titre chevauche le médaillon si le nom du client est long ;
   - 336 : le ruban d'avis est un marquee — vérifier qu'il ne crée pas de
     débordement de page.

2. **Alignement de `capabilities.ts`** pour les thèmes 331 et suivants :
   ```bash
   node scripts/aligner-capabilites.mjs            # rapport
   node scripts/aligner-capabilites.mjs --ecrire   # applique
   ```
   Fait pour 316-330 : 27 blocs ajoutés sur 10 thèmes. Le script n'enlève
   jamais rien — « horaires » est posé après rendu par `BrandColorVar` sans
   qu'aucun helper n'apparaisse dans le code.

3. **`photoSlots.ts`** : `n` (emplacements demandables, plafond 8) et `labels`
   par thème. Les données relevées par les agents sont dans les rapports de
   chantier ; à défaut, les compter dans le fichier.

4. **`scripts/build-section-manifest.mjs`** — obligatoire après tout ajout de
   `clientText`/`clientList`, sinon les retouches sont invisibles dans
   l'aperçu client. Chaque thème repris en pose 8 à 12.

5. **`npm run build`** en lisant le code de sortie, puis **déploiement Vercel
   manuel** (pousser sur GitHub ne met pas en ligne) :
   ```bash
   export VERCEL_API_TOKEN=$(grep '^VERCEL_API_TOKEN=' ~/skybot-inbox/.env | cut -d= -f2)
   npx vercel --prod --yes --token "$VERCEL_API_TOKEN"
   curl -sI https://launch.aevia.services | head -2
   ```

6. **`.claude/HISTORY.md`** — entrée de session au format Fait / Comment /
   Pourquoi / Erreurs commises.

## Les photographies

Le mandataire du conteneur bloque `images.unsplash.com` et
`images.pexels.com` : **aucune image nouvelle n'a pu être vérifiée, donc
aucune n'a été ajoutée**. Les URLs d'origine sont conservées à l'identique.
Les emplacements supplémentaires portent un repli dessiné en CSS et toute
section plein cadre porte `background: C.bgDark`, pour que la page tienne
sans photo.

Il ne reste donc, côté visuel, qu'à poser les images.

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
