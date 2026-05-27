# Aevia Launch — pipeline E2E client (statut)

Test réalisé avec brief réel: **Maison Maria** (institut beauté Lyon).

## Flow attendu

```
Client → /configure (wizard 5 étapes)
       ↓
   POST /api/sessions     (create session)
       ↓
   POST /api/generate     (Claude génère le contenu)
       ↓
   GET /order             (récap commande)
       ↓
   /onboarding            (brief détaillé + CGV)
       ↓
   POST /api/checkout     (Stripe Checkout session)
       ↓
   Stripe paiement
       ↓
   POST /api/webhook      (signature verif → process payment)
       ↓
   ├─ Claude regenerate from brief (Blob save)
   ├─ Email Valentin (brief + preview)
   └─ Email client (preview link)
       ↓
   GET /preview/{sessionId}  (site visible)
```

## État

| # | Étape | Endpoint | Statut |
|---|---|---|---|
| 1 | Create session | POST `/api/sessions` | ✅ OK (persisté en Blob) |
| 2 | Generate content | POST `/api/generate` | ✅ OK (Claude + fallback mock + JSON parse robust) |
| 3 | Order page (récap) | GET `/order` | ✅ OK (HTTP 200, contenu rendu) |
| 4 | Onboarding wizard | GET `/onboarding` | ✅ OK (CGV checkbox, brief 3 steps) |
| 5 | Preview live | GET `/preview/{id}` | ✅ OK (template rendu avec contenu Claude) |
| 6 | Checkout Stripe | POST `/api/checkout` | ⚠️ Fixé apiVersion — à retester en prod |
| 7 | Stripe webhook | POST `/api/webhook` | ⚠️ Non testable sans paiement réel |
| 8 | Email pipeline | Resend | ⚠️ Dépend de webhook + RESEND_FROM_EMAIL domaine vérifié |
| 9 | **Auto-deploy custom Vercel** | _non implémenté_ | ❌ Gap V2 |

## Bugs trouvés et fixés

- **B1** — `/api/generate` retournait "Generation failed"
  - Cause : Claude wrappait la réponse JSON dans ```` ```json ... ``` ````, `JSON.parse` plantait.
  - Fix : strip markdown fences + extraction first `{...}` + fallback `generateMockContent`. Commit `b6e07eb`.

- **B2** — Sessions disparaissaient entre `/api/sessions` et `/api/generate`
  - Cause : sauvegardes uniquement en mémoire (Map), perdues entre instances serverless Vercel.
  - Fix : `saveSessionToBlob` partout, `getSessionFromBlob` en lecture. Commit `3ff8a96`.

- **B3** — `/api/checkout` retournait "Impossible de créer la session"
  - Premier diagnostic (faux positif) : `apiVersion` hardcodé "2026-04-22.dahlia" — retiré (commit `46e8b25`).
  - **Vrai cause** : `StripeConnectionError: An error occurred with our connection to Stripe. Request was retried 2 times`.
  - Hypothèses (à vérifier côté config Vercel/Stripe) :
    1. La clé `STRIPE_SECRET_KEY` est une **restricted key** (`rk_test_*` ou `rk_live_*`) qui ne peut pas créer de Checkout Session — il faut une `sk_test_*` ou `sk_live_*`.
    2. Le compte Stripe est suspendu / pas encore activé.
    3. Problème réseau Vercel→Stripe (rare).
  - **Action requise (toi)** : aller sur dashboard.stripe.com → API keys → générer/copier une `sk_test_...` (Standard secret key) → la mettre dans `vercel env` à la place de la valeur actuelle, puis redéployer.

## Test pratique recommandé pour valider Stripe

```bash
# 1. Récupérer la clé sur Stripe Dashboard (sk_test_... ou sk_live_...)
# 2. Tester la clé directement :
curl -X POST https://api.stripe.com/v1/checkout/sessions \
  -u "sk_test_XXX:" \
  -d "mode=payment" \
  -d "line_items[0][price_data][currency]=eur" \
  -d "line_items[0][price_data][product_data][name]=Test" \
  -d "line_items[0][price_data][unit_amount]=599" \
  -d "line_items[0][quantity]=1" \
  -d "success_url=https://aevia-launch.vercel.app/success" \
  -d "cancel_url=https://aevia-launch.vercel.app/order"

# Si retour `{ "url": "https://checkout.stripe.com/..." }` → clé valide
# Sinon l'erreur précise apparaîtra
```

## Ce qui manque (V2)

### 1. Auto-deploy custom Vercel (BONUS dans le scope client)

Aujourd'hui : client reçoit `aevia-launch.vercel.app/preview/{id}` — URL avec marque Aevia.

Pour un produit pro premium :
- Le client devrait avoir son propre projet Vercel
- URL au choix : `son-business.vercel.app` ou `son-domaine.fr`

**Implémentation suggérée** (route `/api/deploy-client`) :

```ts
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  const session = await getSessionFromBlob(sessionId);

  // 1. Generate Next.js project files in memory
  const files = buildSiteFromSession(session); // returns { "package.json": "...", "app/page.tsx": "..." }

  // 2. Create Vercel project via API
  const project = await fetch("https://api.vercel.com/v9/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: slugify(session.formData.businessName),
      framework: "nextjs",
    }),
  }).then((r) => r.json());

  // 3. Upload files + create deployment
  const deployment = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}` },
    body: JSON.stringify({
      name: project.name,
      project: project.id,
      target: "production",
      files: Object.entries(files).map(([file, data]) => ({
        file,
        data: Buffer.from(data).toString("base64"),
        encoding: "base64",
      })),
    }),
  }).then((r) => r.json());

  return NextResponse.json({ url: deployment.url, projectId: project.id });
}
```

**Pas de repo GitHub** — déploiement direct par upload de fichiers (mode "inline files" de l'API Vercel).

Pour les repos privés (si plus tard tu veux versionner les sites clients) :
- Utiliser l'API GitHub pour créer un repo privé par client (`octokit`)
- Lier le repo au projet Vercel
- Push initial via `git` programmatique

### 2. Resend domaine vérifié

L'env `RESEND_FROM_EMAIL` pointe vers le domaine vérifié (ex: `hello@aevia.io`). Sinon Resend refuse l'envoi vers d'autres adresses que le compte propriétaire.

### 3. Stripe webhook secret

`STRIPE_WEBHOOK_SECRET` doit être configuré dans Vercel. Sinon `stripe.webhooks.constructEvent` rejette tous les events comme non signés.

### 4. CGV / Mentions légales finalisées

Quand l'auto-entreprise sera enregistrée : injecter SIRET dans `/legal/mentions-legales`.
