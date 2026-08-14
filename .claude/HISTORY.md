# HISTORY — Aevia Launch (skylaunch)

> Format par entrée :
> - **Fait** : ce qui a changé + commit(s)
> - **Comment** : approche technique choisie + alternatives rejetées
> - **Pourquoi** : motivation (bug, demande utilisateur, dette technique)
> - **Erreurs commises** : ce que j'ai raté + correction (pour ne pas répéter)
>
> Appendre UNE entrée par session. Plan → Mock (si UI) → Valider → Exécuter.

---

## 2026-06-06 — Session #1 : Quick wins + i18n + funnel analytics

**Fait :** `a8083be` `c5dce11`..`57814a7` (9 commits)
- Hero "Boutique en ligne"→"E-commerce" + fix overflowX:clip
- /pricing : plan Landing ajouté à 399€ (5 locales)
- Demo redirects corrigés → `/themes/ecommerce` etc (étaient impact-XX → 404)
- i18n complet : wizard StepForm, AeviaHeader, order, success, preview/theme chrome, configure, checkout + language switcher 5 langues
- Funnel analytics : `lib/funnel.ts` + `app/api/funnel/route.ts` + StepForm wiring

**Comment :**
- i18n : LangContext custom (pas next-intl) — hook `useLang()` + `t()` helper; switcher dans AeviaHeader; `localStorage["aevia-locale"]` pour persistance cross-pages
- Funnel : Vercel Blob par visitor (funnelId en sessionStorage); POST fire-and-forget (jamais bloquant); GET stats gated par FUNNEL_ADMIN_TOKEN
- Pricing : `lib/pricing.ts` centralisé (une seule source de vérité prix)

**Pourquoi :**
- Démo renvoyait vers des 404 (impact-XX ids ne matchent pas le router /themes/[id])
- Besoin de mesurer le taux de completion wizard
- i18n pour crédibiliser le produit FR/EN/ES/PT/DE

**Erreurs commises :**
- Demo redirects pointaient vers impact-168, impact-46 → 404. Cause : deux systèmes de thèmes (THEMES_META semantic ≠ impact-XX ids). Fix : utiliser les ids sémantiques (`ecommerce`, `vitrine`, `landing`).

---

## 2026-06-06 — Session #2 : Maison-Maria + multi-page pilot

**Fait :** `765899e` `8045a2d`
- Photo founder `public/maison-maria/maria.jpeg` + texte "Mon histoire" brand-élevé
- EcommerceTheme : multi-page pilot (Accueil/Boutique/Blog/CGV/Mentions + product detail + blog article)
- ThemeWrapper : slots optionnels backward-compatible (navSlot, navActions, onCtaClick, footerSlot)

**Comment :**
- Multi-page : state React `page` + `goTo()` dans le composant racine; nav/footer hors du gate `{page==="home" && ...}` (partagés); pages extra stylées depuis tokens du thème
- CGV/Mentions → FOOTER (pas nav top) — pattern établi pour tous les thèmes suivants
- ThemeWrapper modifié de façon additive (slots optionnels) → aucun autre thème cassé

**Pourquoi :**
- User veut des thèmes multi-page pour que le client reçoive un site complet (pas juste une landing)
- Maison-maria : photo réelle de la fondatrice + texte professionnel pour crédibiliser

**Erreurs commises :**
- Fichier déposé en `maria.jpeg` mais code référençait `maria.jpg` → image cassée. Fix : corriger l'extension dans le code (pas renommer le fichier).

---

## 2026-06-06 — Session #3 : 12 impact templates multi-page (design inchangé)

**Fait :** `6e8782d` `d7db3c0` `93d6b2f` `f6a0bc9` `8105310` `9da014e` `eba4fbc` `f244d81` `63903bb` `3ea8704` `dfd5312` `df33970` `89c381a` `15c2393` `f9be4a4`
Thèmes livrés : 168 (Éclat/fashion), 46 (Dumont/law), 192 (Quantum/tech), 215 (Flamme/chauffage), 47 (Pétales/fleuriste), 01 (NOVA/agency), 48 (Atelier/archi), 10 (Grand Palais/hotel), 99 (Ember/resto), 37 (Clos du Soir/vin), 86 (Aura/spa), 154 (Ivory/galerie)

**Comment :**
- Pattern : gate `{page==="home" && ...}` sur le contenu home; nav/footer partagés hors gate; pages extra = composants inline stylés depuis tokens du thème (`C` ou inline styles); mentions légales = Aevia WS sans adresse
- Sticky gap fix : `overflowX:"hidden"` → `overflowX:"clip"` sur le wrapper racine (clip ne crée pas de scroll container contrairement à hidden)
- Impact-10 accommodation section : rail scroll horizontal remplacé par CSS grid (le `overflowX:'hidden'` en single quotes était passé sous le radar du grep)
- Images : `images.unsplash.com/photo-XXX?w=800&q=80` + `loading="lazy"` (source.unsplash.com = déprécié)

**Pourquoi :**
- User : "ne change pas le design, ajoute les pages et adapte-les au design pas l'inverse"
- Sites multi-page pour que la démo reflète un vrai site client livrable

**Erreurs commises :**
- **registry.ts hors sync (ids > ~190)** : impact-192 = "Lumina Beauty" dans registry, en réalité = "Quantum Pulse" (tech). Toujours vérifier avec `grep "export default function"` avant de catégoriser.
- **impact-10 overflowX single quotes** : grep cherchait `overflowX: "hidden"` (double quotes) → a raté `overflowX: 'hidden'` (single quotes) dans la section accommodation. Fix : chercher les deux styles.
- **Pages ajoutées en FR sur thèmes EN** : impact-46 Dumont home = EN, pages ajoutées en FR → incohérence. Fix dans impact-01/10 (refaits en EN). impact-46 toujours légèrement incohérent.
- **Agents session-limited mid-task** : 3 agents coupés en cours. Pattern : review le diff, tsc + build, commiter le travail valide plutôt que recommencer.

---

## 2026-06-11 — Session #4 : Corrections Lot 6 + CSP dev-eval fix

**Fait :** `79508cd`
- Correction des conteneurs de pages et de la navigation pour `impact-21` (Forme Studio), `impact-22` (NimbusAI), `impact-23` (Studio Pelikan), et `impact-24` (Zero to One).
- Résolution des erreurs de syntaxe JSX (balises section et Reveal non fermées dans Pelikan et Zero to One).
- Fix de la CSP (Content Security Policy) en développement local pour autoriser `unsafe-eval` et les WebSockets HMR (`ws:` / `wss:`).

**Comment :**
- Validation de la compilation locale avec `npx tsc --noEmit` et succès du build de production (`npm run build`).
- Injection conditionnelle de `'unsafe-eval'` dans `script-src` et de `ws:`/`wss:` dans `connect-src` uniquement si `process.env.NODE_ENV !== "production"` pour maintenir une sécurité stricte en production tout en préservant le Fast Refresh des outils de dev Next.js/Turbopack.

**Pourquoi :**
- Les erreurs de balises JSX empêchaient toute compilation du projet.
- La CSP d'origine bloquait Fast Refresh et le chargement dynamique de scripts en développement, provoquant des crashs `eval()` en console locale.

**Erreurs commises :**
- L'absence de compilation globale de validation à la fin du batch précédent avait laissé passer des erreurs de structure JSX complexes sur Pelikan et Zero to One. Le passage systématique de `tsc` et `npm run build` a permis de les éradiquer.


---

## 2026-07-30 — Session #5 : Audit visuel mobile des 315 templates impact

**Fait :** `c674586` `fefc66f` `a1e7547` `fbd7c03` `945669d` `65f9121` `8f7ee9a` `38f0bf1` `976845b` `d829f57`
- Audit un par un des 315 templates impact, desktop (1280×900) + mobile (390×844), avec scroll complet pour déclencher le lazy loading.
- **Défaut systémique corrigé** : les grilles écrites en style inline ne se replient jamais sur mobile → colonnes de queue rognées. Des stats entières disparaissaient (« 98% » et « 12 » sur impact-108, « 48h » sur impact-50, « 4.9 »/« 100% » sur impact-104), ainsi que des cartes services, témoignages et colonnes de footer. Correctif unique dans `app/templates/layout.tsx`, couvrant ~200 grilles.
- Correctifs ciblés : chevauchements hint/CTA (03, 08, 20, 40, 74, 77), stats 4 colonnes tronquées (15 templates), marquee illisible (53), onglets services compressés (116), badges hors cadre (112), grille 12 colonnes à gouttières impossibles (80), flèches de carrousel hors écran (`components/ui/carousel.tsx`, 9 templates), liens légaux sans retour à la ligne (28, 43), boutons d'envoi chassés par un input (81, 134), barre d'action fixe décentrée (215), footer `span 2` (325), `.four-col` rigide (48).
- **Validation finale : 315/315 sans anomalie** sur deux balayages automatisés complets.

**Comment :**
- **Mesure DOM plutôt que l'œil.** Les captures ne montrent pas ce qui est rogné : le contenu coupé par l'`overflow-x` de la page ressemble à une mise en page voulue. Deux détecteurs Playwright écrits pour mesurer objectivement :
  - `sweep-clip.js` — enfants de grille dont le bord droit dépasse la boîte de la grille ou le viewport.
  - `detect-overlap.js` — éléments hors écran + chevauchements de texte/contrôles.
- **Cause racine** : une piste `1fr` ne peut pas descendre sous son `min-content` (son mot le plus long). À 390 px la rangée devient plus large que le viewport et les colonnes de queue sont rognées. Trois approches essayées avant la bonne :
  1. forcer 2 colonnes → insuffisant, certaines grilles débordaient encore (padding de section trop généreux : 2×115 px pour un mot de 180 px sur impact-50) ;
  2. `minmax(0,1fr)` → ne déborde plus mais coupe les mots en plein milieu (« Rembo/ursé ») ;
  3. **retenu** : `repeat(auto-fit, minmax(min(150px,100%), 1fr))` pour les grilles ≥4 pistes — tombe à 1 colonne quand 2 pistes lisibles ne rentrent pas ; `minmax(0,1fr)` pour les 3 pistes et footers.
- **Liste de sélecteurs générée**, pas écrite à la main : extraite des 131 littéraux `gridTemplateColumns` réellement présents dans `app/templates`. Un `[style*="…"]` sur le style inline sérialisé par React permet d'atteindre toutes les grilles sans toucher aux 315 fichiers — même argument que le fix des tap targets déjà présent dans ce layout. **Ordre important** : une valeur à 4 pistes matche aussi les sélecteurs 2 pistes par sous-chaîne, donc la règle `auto-fit` est énoncée en dernier pour l'emporter.
- Régression desktop vérifiée à chaque étape (impact-50, 57, 80, 108, 122) : inchangé.

**Pourquoi :**
- Demande utilisateur : « tu regardes TOUS les thèmes avec les images chargées donc avec un scroll effectué au besoin, que tout s'affiche rien ne dépasse et qu'il ne manque aucune section ».
- Ces templates sont livrés à des clients : une stat invisible ou un bouton hors écran sur téléphone est un défaut livré, pas cosmétique.

**Erreurs commises :**
- **Validé des templates trop vite à l'œil.** impact-87, 89 et 104 marqués « ✓ » sur capture alors que leurs colonnes 3 et 4 étaient en fait rognées — le rendu tronqué passait pour un cadrage voulu. Corrigé après avoir écrit le détecteur DOM. Leçon : pour « rien ne dépasse », mesurer, ne pas regarder.
- **Grep en guillemets doubles uniquement** (déjà commis session #3 avec `overflowX`, répété ici) : ma première liste de sélecteurs ratait la moitié des patrons, écrits en apostrophes → grilles encore rognées sur impact-52, 57, 58, 68, 102, 150. Fix : extraction régénérée avec `['\"]`. **À vérifier systématiquement dans ce repo.**
- **Trois balayages Playwright en parallèle ont saturé la RAM** (next-server à 14,4 Go / 88 %), provoquant une cascade de timeouts prise à tort pour des défauts de templates. Fix : un seul balayage à la fois, pré-chauffage des routes par `curl` avant les captures.
- **Faux positifs du détecteur, à connaître si on le réutilise** : les animations d'entrée Framer Motion laissent les éléments à un offset translaté tant qu'ils ne sont pas vus (6 templates flaggés à tort) ; les éléments inline repliés sur plusieurs lignes renvoient un rectangle-union qui chevauche naturellement leurs voisins ; les overlays fixes et les slides de carrousel débordent volontairement. Les trois sont désormais filtrés.
- **Turbopack ne recharge pas les éditions dans ce conteneur** (filesystem lent) : un redémarrage du serveur est nécessaire après chaque modification pour vérifier — sinon on teste l'ancien code et on conclut à tort.

**Limites connues (non résolues) :**
- **Images non vérifiables ici** : le proxy de l'environnement bloque `images.unsplash.com` (403), Chromium compris. Vérification statique faite à la place — les 315 templates utilisent le format `images.unsplash.com/photo-ID?w=…&q=…`, aucun `source.unsplash.com`. Le rendu réel (cadrage, contraste texte/image, hero bien visible) reste à contrôler en prod.
- **Compromis assumé** : sur les sections à fort padding, les stats passent en 1 colonne sur téléphone plutôt qu'en 2×2, pour éviter les coupures de mot.
- **Non déployé** : `push GitHub ≠ live`. `launch.aevia.services` est également bloqué depuis ce conteneur, donc un déploiement n'aurait pas pu être vérifié par `curl`.

---

## 2026-07-31 — Session #6 : Pose des héros premium (lots 1 et 2 du plan)

**Fait :** `e3404e16` `7aea78a8` `242e0c95` `cc488c2c` `1ffcbe61` (+ docs)
- **Lot 1 (les six qui rapportent le plus)** : impact-149 (spa, split bakery + pastilles), impact-147 (cyber-légal, WordFlight + ExpandFrame, faux terminal retiré), impact-248 / impact-243 (ostéo / médecin, château sur les trois axes que chaque page enseigne déjà), impact-50 (psy, château 2 vues dwell slow), impact-84 (clinique, château + plaque Retint).
- **Lot 2 (le plus faible de chaque métier)** : impact-213 (GhostSolid, sans photo), impact-53 (BentoCascade typographique), impact-108 (WordFlight comptable), impact-47 (HeldSwap bouquet en médaillon), impact-90 (split bakery, pains du catalogue), impact-120 (HeldSwap sur l'orbe CSS reteinte par parfum), impact-83 (LineMask + Retint, gemme synchronisée), impact-266 (château + vignette lieu suivant), impact-49 (matière tournante en HeldSwap dans le titre), impact-309 (BlurThrough plein cadre par style d'encre), impact-209 (BlurThrough + Retint par prestation), impact-131 (l'arche du lab vin, recolorée crème/bordeaux).
- Contrôles : tsc à la ligne de base (1942) après chaque groupe, `npm run build` vert, captures 1440×900 et 390×844 des 18 héros examinées, ancres des CTA vérifiées.

**Comment :**
- Mécaniques importées de `lib/templates/hero-kit-2.tsx` uniquement — timings intouchés (T.single 0.7s, DWELL.slow 5.6s, stagger 55ms). Textes réécrits dans la voix de chaque thème, jamais celui des labs ; slides construites sur les données DÉJÀ présentes dans chaque template (cuvées, pains, axes de soin, missions).
- **Images : aucune URL nouvelle.** Le proxy de cet environnement bloque unsplash/pexels, donc uniquement des URLs déjà présentes dans le repo et vérifiées au merge précédent (pour les bouteilles du 131 : paramètres d'URL identiques au lab). Templates sans photo → mécaniques sans photo (GhostSolid, bento typographique, orbe CSS, mot tournant) plutôt que des images posées à l'aveugle.
- Édition par scripts python (chaînes exactes), tsc après chaque groupe, commit tous les 3-4 thèmes.

**Pourquoi :** go utilisateur sur `docs/PLAN_HEROS_PREMIUM.md` — poser les mécaniques mesurées sur Slider Revolution sur les thèmes que l'audit de vendabilité désigne.

**Erreurs commises :**
- **Insertion regex au milieu d'un import multi-lignes** (impact-49) : `^import .*$` matche aussi la ligne `import {` seule → 5 erreurs de syntaxe. Fix : ancrer sur `} from "framer-motion";`. Leçon : pour insérer après les imports, ancrer sur la fin d'un bloc connu, pas sur « le dernier import ».
- **Hook dupliqué** (impact-84) : le tour interrompu avait déjà appliqué une partie du patch ; le relancer a inséré useSlides deux fois (+6 erreurs tsc). Vérifier l'état du fichier avant de rejouer un patch après interruption.
- **Splice trop large** (impact-131) : le remplacement du bloc titre a emporté les CTA — récupérés depuis `git show HEAD:`. Sur un gros bloc, préférer plusieurs remplacements étroits.
- **Le tableau de l'audit hérite du registre menteur** : impact-109 « conseil » est un site audio, impact-169 « restaurant » un magazine, impact-72 « garage » un SaaS. Vérifié chaque cible restante avant d'y toucher (grep métier) ; mécanique posée sur le vrai plus faible avéré quand il était connu (108 pour le conseil), sinon non traité et documenté.

**Restes à faire :**
- impact-169 (restaurant) et impact-72 (garage) : cibles réelles à re-déterminer en refaisant le scoring sur les pages, pas le registre.
- Lot 3 (reconversion des 49 templates SaaS) : chantier de contenu distinct, non entamé.
- Vérification du rendu photo réel en prod (proxy bloquant ici), et déploiement Vercel manuel.

---

## 2026-08-01 — Session #7 : Redistribution des signatures (tableau d'allocation révisé)

**Fait :** `626fce00` `cd6fd796` (+ correctifs de vérification)
- **Groupe A (photos, hero-kit-3)** : impact-309 → CrossPush plein cadre (ex-BlurThrough), impact-243 → PortalZoom porte (`inset … round`), impact-266 → PortalZoom arche (vignette « lieu suivant » conservée).
- **Groupe B** : impact-248 / impact-84 → MosaicPush plein cadre (3 et 2 tuiles, la dominante = axe courant), impact-209 → TrackingCollapse sur le mot de la prestation, impact-149 → TrackingCollapse sur le nom du soin.
- **Groupe C** : impact-90 → PanelDrop (rideau droit, bloc pain + prix + description FR dans le rideau), impact-213 → HardCutRebuild sur titre et métier + FixedRail gauche (masqué <700px), impact-83 → LineScroll (ex-LineMask), impact-53 → DifferentialExit (0.15 sur le mot, 0.85 sur le bento), impact-49 → section StickyProgress « 3bis. LE PARCOURS » (4 étapes, barres animées), impact-50 → PanelRise sur le bandeau stats.
- **Vérification visuelle des 13** : captures 1440×900 + 390×844 toutes examinées, puis sections sous la ligne de flottaison (StickyProgress 49, PanelRise 50) capturées séparément. tsc à 1942 après chaque groupe.

**Comment :**
- Règle du catalogue appliquée : une signature par thème, jamais deux thèmes du même métier avec la même ; les accessoires (SlideIndex, HairlineArrows, Retint) restent libres. AnchoredBackdrop retiré des trois thèmes qui le partageaient, BlurThrough retiré partout comme signature.
- Aucune URL d'image nouvelle (proxy bloquant) ; thèmes sans photo → gestes sans photo.

**Pourquoi :** demande utilisateur d'appliquer la doc révisée (`CATALOGUE_GESTES.md` + tableau d'allocation de `PLAN_HEROS_PREMIUM.md` + teardown 2) : chaque métier à >3 thèmes doit finir avec ≥3 signatures distinctes.

**Erreurs commises (et trouvées par la vérification, pas par la relecture du code) :**
- **`html,body { overflow-x: hidden }` (globals.css, posé en session #5) cassait TOUS les `position: sticky` du site** : `hidden` force `overflow-y: auto` → body devient un conteneur de défilement qui ne défile jamais, et chaque sticky se colle à lui, donc jamais. Découvert parce que le StickyProgress de l'impact-49 défilait avec la page. Fix : `overflow-x: clip` (même filet anti-scroll horizontal, pas de conteneur de défilement). C'est la règle du wrapper racine (« clip, pas hidden ») qui s'appliquait aussi au niveau body.
- **SlideIndex « flat » dans un FixedRail de 49px** : « 01 — 03 » (~70px) se replie et se colle au bord gauche de l'écran, le « 0 » au ras du pixel 0. Fix : wrapper `textAlign:center` + fontSize 12 dans impact-213.
- **Faux positif re-confirmé** : le premier scan DOM d'impact-49 signalait +22 à +46px de débordement mobile sur des conteneurs centrés — transforms d'entrée Framer Motion, pas un vrai débordement (`scrollWidth` = 390). Toujours re-mesurer après scroll complet + filtre `transform !== none`.
- **Localisateur de section trop lâche** : `/LE PARCOURS/i` a matché la section préexistante « Parcours guidés » — capture du mauvais bloc. Ancrer sur un texte propre à la nouvelle section (« Choisir son cours »).

**Restes à faire :**
- impact-169 / impact-72 : cibles réelles à re-scorer (registre menteur), non traités.
- Rendu photo réel + comportement sticky à contrôler en prod après déploiement Vercel manuel (`clip` touche tout le site — vérifier 2-3 templates à nav sticky en prod).

---

## 2026-07-31 — Session #7 : Audit produit + premiers correctifs vérifiés

**Fait :**
- **Rapport d'audit** (`63dce8c`) : `docs/AUDIT_PRODUIT_2026-07-31.md`, les 6 axes de `docs/PROMPT_AUDIT_PRODUIT.md`, sans correctif (lecture d'abord).
- **8 correctifs, un commit par sujet, chacun vérifié :**
  - `afb1d8e` fix(dashboard) : `/login` (404) → vraie init SSO Google (aevia_return_to + IDP), le parcours de connexion CMS était cassé. Vérifié : 0 réf `/login` dans le HTML rendu.
  - `3c0d2bf` fix(cron) : `preview-reminder` fail-**closed** — 503 si `CRON_SECRET` absent (avant : ouvert à tous → spam de la liste des previews). Vérifié runtime : 503.
  - `a092277` fix(idp) : rejet de la traversée `..` dans le proxy + garde-fou « URL sous IDP_BASE ». Vérifié runtime : `/api/idp/auth/../../secret` → 404.
  - `800fabe` fix(upload) : rate-limit 20/min par IP + extension dérivée du MIME (plus du nom client). Vérifié runtime : 400 sans fichier, 429 après 20.
  - `7a32bf7` fix(onboarding) : « skylaunch » → « Aevia Launch » (règle no-sky / branding).
  - `67e0d32` chore(security) : token `FUNNEL_ADMIN` (fnl_…) sorti de `.claude/CLAUDE.md` → pointeur env + note de rotation.
  - `10d4532` chore(deps) : `npm audit fix` — 6 vulns → 2, Next 16.2.10 → 16.2.12. Vérifié : build exit 0, vitest 20/20.
  - `9ff34df` docs(audit) : correction de la ligne de base tsc + rédaction du token dans le rapport.

**Comment :**
- Mesuré, pas jugé à l'œil : `build` (exit 0), `vitest` (20/20), balayage `curl` (315/315 templates + thèmes + locales → 200), Playwright localhost pour overflow@390 (aucun sur 16 pages) et erreurs JS. Chaque correctif de route revérifié en `next start` réel (codes HTTP ci-dessus).
- Périmètre volontairement restreint aux corrections **sûres et vérifiables ici**. Déférés et documentés dans le rapport (décision métier ou test externe requis) : PII en Blob public (B3), facture Stripe conforme (B4), domaine e-mail aevia.io↔aevia.services (V3), promesse « 2h » (V6), vérification des images (réseau bloqué) et paiement bout-en-bout (pas de clés Stripe).

**Pourquoi :** go utilisateur après lecture du rapport (« un commit par sujet, avec mesure avant/après »).

**Erreurs commises :**
- **Ligne de base tsc annoncée à « 0 » à tort.** Mon premier `tsc` tournait *avant* tout build : `tsconfig` exclut `app/templates`, donc 0. Une fois `.next/types` généré, les validateurs de routes ré-importent les pages et **1942 erreurs** apparaissent (toutes dans les templates, doublement masquées par l'`exclude` + `ignoreBuildErrors: true`). **La valeur 1942 est déjà écrite dans ce HISTORY (sessions #5/#6)** — j'aurais dû la recouper avant d'écrire « 0 ». Corrigé dans le rapport (Axe 1 + D6). Hors-templates : réellement 0.
- **`next build` exit 0 ≠ types propres** : `ignoreBuildErrors: true` masque tout. Ne jamais conclure « types OK » depuis un build vert sur ce repo — passer par `tsc` *après* un build.
- **Sous-shells `next start` détachés → confusion de ports** (serveurs sur 3210/3211 non tués, curl sur 3212 en 000). Fix : tout tuer (`pkill -9 next-server`) puis un seul serveur sur un port neuf avant de mesurer.
- **Le token que j'auditais s'est retrouvé en clair dans mon propre rapport** (je l'avais cité en entier) — rédigé a posteriori. Ne pas recopier un secret dans le livrable d'audit.

**Restes à faire (non corrigés, décision/verif requise) :**
- B3 PII Blob public, B4 facture conforme, V3 unification domaine e-mail, V6 promesse « 2h » : voir les trois listes du rapport.
- **Rotation effective** du token funnel (Vercel/env) — il reste dans l'historique git.
- Rejouer hors conteneur : chargement + sujet des images, et paiement Stripe bout-en-bout.
- Next reste en 16.2.12 (2 high non couvertes sans bump preview cassant) — à traiter séparément.
- **Non déployé** : push GitHub ≠ live ; déploiement Vercel manuel non effectué.

---

## 2026-08-01 — Session #8 : Cinq thèmes premium sur niches manquantes

**Fait :** `b78342ec` `75f5bbbd` `262a01ec` `258a5d65` `1e9d756a` + correctifs/rapport
- impact-326 notaire (ArcSwap plaque), impact-327 cuisiniste (ExpandFrame),
  impact-328 pompes funèbres (HeldSwap + DWELL.slow), impact-329 déménageur
  (HardCutRebuild sans photo), impact-330 pharmacie (MosaicPush tuiles CSS).
- Registre + i18n en/es/de/pt + 5 specialties dans sectors.ts.
- Vérif : build 0, balayage mesuré 1440×900 + 390×844 sur `next start`
  (jamais dev), captures toutes regardées, tsc 1942 → 1942 à chaque étape.
- Rapport : `docs/THEMES_PREMIUM_2026-08-01.md`.

**Comment :** un thème = structure du donneur + le geste assigné et lui seul ;
accessoires (SlideIndex, HairlineArrows) libres ; aucune URL d'image nouvelle
(proxy) ; métiers sans image vérifiable → héros sans photo (précédent 213).

**Pourquoi :** exécution de `docs/PROMPT_THEMES_PREMIUM.md` sur l'analyse
`docs/NICHES_MANQUANTES_2026-08-01.md` (demande utilisateur).

**Erreurs commises / découvertes :**
- **Deux « niches à zéro thème » existaient déjà** : impact-138 est un
  opticien complet (étiqueté « Prism Analytics/Tech ») et impact-192 un
  serrurier 24h/24 (étiqueté « Lumina Beauty/E-Commerce »). L'analyse des
  niches héritait du registre menteur. Remplacés par notaire et déménageur
  (liste d'alternatives du prompt), en le disant. Leçon déjà connue,
  reconfirmée : **toujours vérifier le contenu des pages, jamais le registre.**
- **Kickers 326 à 4,15:1** (#8a6d3f à 12px sur ivoire) — attrapés par la
  mesure, pas à l'œil ; passés à accentDark (6,05:1) + rebuild + re-mesure.
- **Faux positifs de l'analyseur de contraste** : il ignore l'alpha
  (blanc sur rgba(255,255,255,0.04) → « blanc sur blanc ») et textContent
  fusionne les mots autour d'un `<br/>` (« pharmacie,au-delà »). Recalcul
  manuel avant de « corriger » quoi que ce soit.
- **Capture pendant le temps mort du geste** : hero 329 mobile « vide » —
  c'était la coupe volontaire du HardCutRebuild ; re-capturer après
  stabilisation avant de conclure à un défaut.
- **EADDRINUSE au restart de next start** : l'ancien next-server survit au
  pkill du shell sandboxé mais sert les bundles relus depuis .next — la
  re-mesure post-rebuild reste valide ; vérifier quel process tient le port.

**Restes à faire :**
- Corriger les entrées registre de impact-138 et impact-192 (+ resync global
  du registre au-delà de ~190).
- Sujets des 11 photos réutilisées à contrôler en prod (proxy bloquant ici).
- Déploiement Vercel manuel puis curl de vérification.

---

## 2026-08-01 — Session #9 : 53 thèmes, toutes les niches à 2 variantes minimum

**Fait :** `a2a2980c` `56819312` `63ce8f30` `eb236177` `e7d441df` `02ac9bb3` `f34ccda0` `aed37972` `ca1db822` + rapport
- impact-331 → 383 : 53 thèmes en 8 lots, 24 nouvelles specialties dans
  `sectors.ts`, 53 entrées registre + 53×4 traductions.
- Rapport complet : `docs/THEMES_NICHES_2026-08-01.md`.
- Contrôles : build exit 0, balayage mesuré 106 pages (53 × 2 tailles)
  **images bloquées**, tsc 1942 → 1942 après chaque lot.

**Comment :**
- **Générateur** (`scratchpad/gen/gen.py`) : le squelette validé des 5 premium
  paramétré par un bloc de données métier par thème. Le générateur ne fabrique
  que la structure ; tout le contenu (services, tarifs, avis, mentions
  réglementaires) est écrit thème par thème. Six archétypes de héros couvrent
  les 53, chacun câblé sur le geste demandé. Aucune animation nouvelle.
- Deux variantes par niche = deux villes, deux positionnements, deux gestes.
- 45 thèmes sur 53 sans aucune photographie (proxy bloquant : on n'invente
  pas d'URL) — tuiles CSS, typographie, pictogrammes.

**Pourquoi :** demande utilisateur « go pour les 53 » après le décompte des
niches sous 2 variantes, avec la consigne explicite : *« même si les images
chargent pas, veille à ce que tout soit bon en responsive et sur PC on mettra
les photos »* → d'où le balayage images bloquées.

**Erreurs commises (toutes trouvées par la mesure, aucune à l'œil) :**
- **Le décompte de départ était faux dans les deux sens.** La doc des niches
  s'appuie sur `registry.ts`, qui ment. Refait par grep plein texte : véto,
  pisciniste et déménageur n'avaient besoin de rien (déjà ≥2) ; infirmier,
  audioprothésiste et couvreur étaient à 0 et non à 1-2. Leçon re-confirmée
  pour la 4e fois : **vérifier le contenu des pages, jamais le registre.**
- **Héros plein cadre sans fond de repli** (327, 366, 369, 370, + 309 des
  séries précédentes) : la section comptait sur la photo pour son fond ; sans
  image, texte blanc sur fond de page clair (1,88:1 mesuré, 1,09:1 sur 309).
  Fix : `background: C.bgDark` sur la section — invisible quand la photo charge.
- **Kicker accent dans InvertSweep** (344, 362) : le geste bascule clair↔sombre,
  aucune couleur d'accent ne contraste sur les deux (2,75:1). Fix : hériter la
  couleur pilotée par le composant.
- **`as const` sur un ternaire** (337, 353, 356) : TS1355 puis TS2322, **non
  masqués par `@ts-nocheck`** — d'où la ligne de base de 1942. Fix : cast
  explicite vers l'union littérale.
- **Analyseur aveugle à `color(srgb …)`** : Chromium sérialise certaines
  couleurs en canaux 0-1 ; l'analyseur les lisait en 0-255 et inventait des
  ratios. Corrigé dans le script — à reprendre pour les prochaines campagnes.
- **Serveur périmé = mesures fantômes** : `next start` relancé sur un port déjà
  tenu échoue en silence (EADDRINUSE) ; l'ancien serveur continue de répondre
  avec des chunks JS qui n'existent plus → 500, hydratation cassée, et
  `noCtaAboveFold` faux sur 8 thèmes. Toujours vérifier quel process tient le
  port, ou changer de port.
- **`tsc` lancé depuis le scratchpad** retourne 0 erreur (pas de tsconfig) —
  faux négatif dangereux. Toujours mesurer depuis la racine du dépôt.

**Restes à faire :**
- Corriger le registre : impact-138 (opticien), 192 (serrurier), 39
  (déménageur), 188 (vétérinaire), et resync global au-delà de l'id ~190.
- `components/CookieBanner.tsx` + lien « Skip to main content » : contraste
  faible, global et préexistant sur les 315 templates. À traiter une fois.
- Sujets des images réutilisées à contrôler en prod (proxy bloquant ici).
- Déploiement Vercel manuel puis curl de vérification.

---

## 2026-08-12 — Session #10 : reprise des thèmes 316-383 (49/66 faits)

**Fait :** `3ceeba63` `534918e6` `04ef6fae` + correctifs et lot 3 partiel
- Plan de différenciation des 66 thèmes : `docs/REPRISE_316_383_PLAN.md`
  (geste + archétype de héros + paire de fontes + palette, ligne par ligne).
- 49 thèmes réécrits : 316-319, 321-322, 324-350, 352-353, 355-362, 364,
  367, 370-371.
- Harnais de contrôle `scripts/qa-reprise.mjs` et aligneur
  `scripts/aligner-capabilites.mjs`.
- Reste à faire consigné : `docs/REPRISE_316_383_RESTE_A_FAIRE.md`.

**Comment :**
- Trois analyses préalables : structure réelle des 66 thèmes, thèmes de
  référence premium (245, 247, 83) et leur check-list, pattern de câblage des
  derniers jours. Puis un plan écrit avant toute ligne de code.
- Exécution par agents parallèles, trois thèmes chacun, sur une consigne
  commune ; contrôle systématique après chaque lot (4 scripts de contrat,
  comptage des URLs d'images avant/après, geste conforme au plan).

**Pourquoi :** les 66 thèmes étaient ultra-similaires — 58 sur un squelette
unique, 16 palettes recyclées à l'identique, trois paires de jumeaux stricts
(336/378, 339/367, 344/362) — et le câblage était creux là où il compte :
`clientHours`, `clientSiret`, `clientAreas`, `clientCodePostalVille` à zéro
usage sur les 66, `clientPhone` employé une fois.

**Erreurs commises / découvertes :**
- **L'instrument a menti avant le produit.** `innerText` rend le texte peint :
  une section en `text-transform: uppercase` renvoie « ZINGUERIE », pas
  « Zinguerie ». Le harnais comparait à la casse près et a compté trois thèmes
  « sans prestations ni avis » alors qu'ils les affichaient. Vérifié en
  listant le contenu réel des sections de 318 avant de corriger quoi que ce
  soit. Même famille que les cinq pannes de mesure du 7 août.
- **Ville écrite deux fois** sur 318 et 319 : `clientEyebrow` rend déjà
  « Métier · Ville » et le thème rajoutait la ville. Vu sur la capture, pas
  dans le code.
- **Blocs affichés mais jamais demandés** : 324 et 325 peignaient prestations,
  avis, chiffres, engagements, réalisations et tarifs sans qu'aucun ne soit
  déclaré dans `capabilities.ts` — ces sections restaient donc en
  démonstration sur un site livré. 27 blocs ajoutés sur 10 thèmes.
- **Prix du client jamais employés** là où le thème en affiche (317, 329). Sur
  317 le taux horaire n'est repris que s'il est vraiment horaire : un forfait
  multiplié par des heures donnerait une estimation absurde.
- **`pkill -f "next start"` a tué mon propre shell** — la commande contenait
  la chaîne cherchée.
- **Le plan peut contredire le contenu.** Sur 332 il prévoyait une bande
  « urgence 24 h » alors que le texte du thème dit qu'il n'y a pas de
  dépannage nocturne. Le contenu gagne, et on le signale.

**Restes à faire :** 17 thèmes (351, 354, 363, 365-366, 368-369, 372,
373-383), balayage visuel de 331-371, `capabilities.ts` au-delà de 330,
`photoSlots.ts`, `build-section-manifest.mjs`, déploiement Vercel. Détail
complet dans `docs/REPRISE_316_383_RESTE_A_FAIRE.md`.
