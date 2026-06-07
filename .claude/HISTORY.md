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

## Template pour prochaine session

**Fait :** `xxxxx`
- ...

**Comment :**
- ...

**Pourquoi :**
- ...

**Erreurs commises :**
- ...
