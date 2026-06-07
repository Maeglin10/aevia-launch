# CLAUDE.md — Aevia Launch (skylaunch)

## Deploy
```bash
export VERCEL_API_TOKEN=$(grep '^VERCEL_API_TOKEN=' ~/skybot-inbox/.env | cut -d= -f2)
npx vercel --prod --yes --token "$VERCEL_API_TOKEN"
```
Live URL: **aevia-launch.vercel.app** — vérifier : `curl -sI https://aevia-launch.vercel.app | head -2`

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

## registry.ts — hors sync pour ids > ~190
Toujours vérifier le vrai contenu : `grep "export default function" app/templates/impact-XX/page.tsx`

## Funnel analytics
- `lib/funnel.ts` → `recordFunnelStep()` + `getFunnelStats()`
- API : `app/api/funnel/route.ts` (POST fire-and-forget, GET protégé par `FUNNEL_ADMIN_TOKEN`)
- Token : `fnl_8918b1d36ab8924058f502befdb2b57c`

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
