# CLAUDE.md — Aevia Launch (skylaunch)

## Language
Respond only in French or English — match the user's current language. Never Portuguese or any other language, even mid-conversation.

## Deploy
```bash
export VERCEL_API_TOKEN=$(grep '^VERCEL_API_TOKEN=' ~/skybot-inbox/.env | cut -d= -f2)
npx vercel --prod --yes --token "$VERCEL_API_TOKEN"
```
Live URL: **launch.aevia.services** — vérifier : `curl -sI https://launch.aevia.services | head -2`

> ⚠️ push GitHub ≠ live. Deploy TOUJOURS manuellement.

## Architecture
- Next 16 + LangContext custom (`lib/LangContext.tsx`) · 5 locales : fr/en/es/pt/de
- Vercel project : `aevia-launch` (prj_kFi0uHX…)

## Deux systèmes de thèmes — NE PAS CONFONDRE

| Système | Route | ID utilisé | Fichiers |
|---|---|---|---|
| **Semantic themes** | `app/themes/[id]/page.tsx` | ids THEMES_META : `ecommerce`, `vitrine`, `landing`, `saas`… | `components/themes/` + `GeneratedSite.tsx` |
| **Impact templates** (templates client) | `app/templates/impact-XX/page.tsx` | numéros `impact-XX` | 219 dossiers dans `app/templates/` |

> Les impact-XX 404 à `/themes/impact-XX`. Ne jamais mélanger les deux systèmes dans les redirects/liens.

## Templates impact — pattern multi-page (12 curatés, multi-page actif)
Thèmes multi-page : 01, 10, 37, 46, 47, 86, 99, 154, 168, 192, 215, 154
**Pattern établi** (ne pas modifier le design) :
- State `page` + `goTo` dans le composant racine
- Nav + footer HORS du gate `{page==="home" && ...}` (partagés)
- Pages extra stylées depuis les tokens du thème (`C` ou inline)
- CGV / Mentions légales → **FOOTER** (jamais dans le nav top)
- Mentions légales = Aevia WS, SIREN 852 546 225, **sans adresse physique**
- Images : `images.unsplash.com/photo-ID?w=800&q=80` + `loading="lazy"` (JAMAIS `source.unsplash.com`)
- `overflowX: "clip"` sur le wrapper racine (pas `"hidden"` → casse sticky)

## Responsive mobile — correctifs globaux dans `app/templates/layout.tsx`
Deux règles y couvrent les 315 templates d'un coup (plutôt que 315 éditions) : tap targets 44px, et **repli des grilles inline**.

**Grilles inline** — une piste `1fr` ne descend jamais sous son `min-content` : à 390px la rangée dépasse le viewport et les colonnes de queue sont **rognées** par l'`overflow-x` de la page (stats, cartes services, colonnes de footer qui disparaissent). La règle cible les styles inline via `[style*="…"]`, à partir d'une **liste générée** des littéraux `gridTemplateColumns` du repo :
```bash
grep -rhoE "gridTemplateColumns:\s*['\"][^'\"]+['\"]" app/templates/ | sort -u
```
- ≥4 pistes → `repeat(auto-fit, minmax(min(150px,100%), 1fr))` · 3 pistes et footers → `minmax(0,1fr)`
- **Ordre important** : une valeur à 4 pistes matche aussi les sélecteurs 2 pistes par sous-chaîne → la règle `auto-fit` doit rester énoncée **en dernier**.
- **Si tu ajoutes un nouveau patron de grille inline, régénère la liste**, sinon il ne sera pas couvert.

> ⚠️ Grep en guillemets doubles seuls = la moitié du repo manquée (apostrophes). Erreur commise 2×. Toujours `['\"]`.

## Vérifier le responsive : mesurer, pas regarder
Une capture ne montre pas ce qui est rogné — le contenu coupé ressemble à un cadrage voulu. Mesurer le DOM : enfant dont `getBoundingClientRect().right` dépasse la boîte parente ou le viewport.
Faux positifs à filtrer : animations d'entrée Framer Motion (transform actif tant que non vu), éléments inline repliés (rectangle-union), overlays `fixed` et slides de carrousel (débordent volontairement).

> Un seul balayage Playwright à la fois — 3 en parallèle saturent la RAM (next-server à 14 Go) et produisent des timeouts pris à tort pour des défauts.
> Turbopack ne recharge pas les éditions dans le conteneur distant : **redémarrer le serveur** avant de vérifier, sinon on teste l'ancien code.

## registry.ts — hors sync pour ids > ~190
Toujours vérifier le vrai contenu : `grep "export default function" app/templates/impact-XX/page.tsx`

## Funnel analytics
- `lib/funnel.ts` → `recordFunnelStep()` + `getFunnelStats()`
- API : `app/api/funnel/route.ts` (POST fire-and-forget, GET protégé par `FUNNEL_ADMIN_TOKEN`)
- Token : **jamais en clair dans le dépôt** — variable d'env Vercel `FUNNEL_ADMIN_TOKEN`
  (la récupérer via le dashboard Vercel ou `vercel env pull`). ⚠️ L'ancienne valeur
  était commitée ici : elle doit être **rotée** dans Stripe/Vercel car elle reste
  lisible dans l'historique git.

## Fichiers clés
- `components/StepForm.tsx` — wizard principal (multi-étapes)
- `components/GeneratedSite.tsx` — rendu thème semantic
- `lib/templates/registry.ts` — registre impact-XX (partiellement hors sync)
- `lib/pricing.ts` — prix par plan
- `lib/sessions.ts` — Vercel Blob sessions wizard

## Règles métier
- Wizard → `/preview/[sessionId]` (flow principal)
- `/onboarding` = ancien flow Stripe-checkout — gardé mais retiré du sitemap
- Aucune URL avec "sky" dans le copy front

## Skills & Workflow Claude Code

### Protocole de session (obligatoire)
```
1. /context          → rappel contexte + mémoire active
2. /writing-plans    → plan + mockup UI si besoin → ATTENDRE VALIDATION
3. /executing-plans  → exécuter seulement après validation du plan
4. /code-review      → review avant commit
5. /security-review  → aucun secret / adresse / donnée perso exposée
6. /verification-before-completion → curl live avant de dire "done"
7. /using-superpowers → agents parallèles pour polish multi-thèmes
8. /writing-skills   → doc si nouveau pattern introduit
```

### Règle des plans
- Pour toute tâche > 1 fichier : écrire le plan en texte d'abord (quoi, comment, fichiers touchés)
- Pour tout changement UI : fournir un **mockup ASCII** avant de coder
- Ne commencer qu'après **validation explicite** de l'utilisateur

### Règle de fin de session
Appendre dans `.claude/HISTORY.md` (format : Fait / Comment / Pourquoi / Erreurs commises)

## Règle de vérification des thèmes (2026-08-03)

**Ne jamais annoncer un thème corrigé sans l'avoir ouvert dans un navigateur.**

Trois erreurs en une journée viennent toutes de la même cause : avoir conclu
depuis le code au lieu de la page rendue.

- Un comptage d'occurrences de `heroHeadline` donnait 347 thèmes « câblés » ;
  mesurés dans le navigateur, 5 sur 12 affichaient le titre du client et
  **aucun** ses services.
- Un `useEffect` qui mute les constantes du module sans déclencher de rendu
  existe dans une centaine de fichiers : le code est là, il ne produit rien.
- Un test « après correction » ne montrait aucun changement — le serveur local
  n'avait pas `BLOB_READ_WRITE_TOKEN`, donc `/api/sessions` répondait 404 et le
  thème retombait sur sa démo. Le test était faux, pas le code.

Avant de dire qu'un thème est fait, il faut donc :

1. une **session client réelle** (`?session=…`), avec services, tarifs, photos,
   ville et téléphone — et le serveur lancé avec le jeton Blob ;
2. une **mesure du DOM** : le contenu du client est présent, celui de la
   démonstration a disparu, aucune image chargée mais jamais peinte, aucun
   débordement horizontal ;
3. une **capture à 1440×900 et à 390×844**, regardée ;
4. `npm run build` dont on lit vraiment le code de sortie — un `&&` mal placé a
   déjà affiché `BUILD=0` sur un build en échec.

Règles de contenu décidées par le fondateur, valables pour les 373 thèmes :

- **On n'invente rien.** Pas de témoignage, de tarif ni de référence fabriqués.
- Si le client ne renseigne pas une section, **on garde celle du thème et on le
  lui rappelle**. On ne supprime aucune section.
- **Cohérence de langue** : un thème en anglais vendu à une entreprise française
  se traduit — dans les deux sens, pour fr/en/es.
- Le catalogue est **100 % impact** ; rien d'autre n'est vendu.
