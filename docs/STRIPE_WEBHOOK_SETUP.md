# Stripe Webhook — Setup guide

## C'est quoi, et pourquoi c'est obligatoire

Stripe utilise **deux clés différentes** :

| Clé | Format | Direction | Usage |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` / `sk_live_…` | **Toi → Stripe** | Créer des Checkout sessions, charger des cartes, lire des paiements |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | **Stripe → Toi** | Vérifier qu'une requête entrante vient bien de Stripe (pas d'un hacker) |

### Le flow concret

```
1. Client paye sur Stripe Checkout → paiement réussi
2. Stripe envoie un POST vers ton endpoint :
     URL    : https://aevia-launch.vercel.app/api/webhook
     Headers: stripe-signature: t=1716800000,v1=abc123def456...
     Body   : { type: "checkout.session.completed", data: { object: {...} } }
3. Ton code: stripe.webhooks.constructEvent(rawBody, sigHeader, WEBHOOK_SECRET)
   ├─ Signature valide  → on traite (générer site, envoyer email, etc.)
   └─ Signature invalide → on rejette (400) — c'est un attaquant
```

### Sans webhook secret = faille critique

N'importe qui peut envoyer un faux POST à ton `/api/webhook` :

```bash
curl -X POST https://aevia-launch.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed","data":{...}}'
```

Et te faire générer un site + envoyer les emails comme si quelqu'un avait payé. **C'est pour ça que la vérification de signature n'est pas négociable.**

## Procédure de setup (5 min)

### 1. Créer l'endpoint dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/webhooks (mode **test** d'abord)
2. Cliquer **"Add endpoint"**
3. **Endpoint URL** :
   ```
   https://aevia-launch.vercel.app/api/webhook
   ```
4. **Events to listen** : sélectionner au minimum :
   - `checkout.session.completed` (le seul actuellement géré dans le code)
5. (Optionnel pour V2) ajouter aussi :
   - `payment_intent.payment_failed` — pour notifier le client + Sentry
   - `charge.refunded` — pour invalider l'accès si remboursement
6. Cliquer **"Add endpoint"**

### 2. Copier le signing secret

Une fois créé, Stripe affiche le détail du webhook. Sous **"Signing secret"** → cliquer **"Reveal"** → copier la valeur qui commence par `whsec_…`.

### 3. Ajouter le secret sur Vercel

Via CLI (le plus rapide) :

```bash
cd /Users/milliandvalentin/skylaunch
echo "whsec_XXXXXXXXXXXXXXXX" | vercel env add STRIPE_WEBHOOK_SECRET production
```

Ou via dashboard Vercel :
- https://vercel.com/valentins-projects-7cad2c95/aevia-launch/settings/environment-variables
- Add → Name: `STRIPE_WEBHOOK_SECRET`, Value: `whsec_…`, Environment: Production

### 4. Redéployer

```bash
cd /Users/milliandvalentin/skylaunch
vercel --prod
```

### 5. Vérifier que ça marche

Dashboard Stripe → ton webhook → **"Send test event"** → choisir `checkout.session.completed` → cliquer envoi.

Tu devrais voir dans le log Stripe : `200 OK`.

Si `400 invalid signature` → la valeur du secret n'est pas la bonne.
Si `500` → le code Aevia Launch a planté (regarder les logs Vercel).

## Note : test mode vs live mode

Stripe distingue les keys + webhook secrets par environnement :
- **Test mode** : `sk_test_…`, `whsec_…` (de test) → faux paiements, vraie validation
- **Live mode** : `sk_live_…`, `whsec_…` (de live) → vrais paiements

Pour les tests E2E, **utilise test mode** : tu paies avec la CB `4242 4242 4242 4242`, 12/34, CVC 123 → ça simule un paiement réussi sans toucher à ton compte bancaire.

Quand tu passes en production réelle :
1. Remplacer `sk_test_…` par `sk_live_…` sur Vercel
2. Créer un 2ème webhook endpoint en mode live → récupérer un `whsec_…` live
3. Remplacer `STRIPE_WEBHOOK_SECRET` sur Vercel

## Validation rapide de ta clé Stripe

Avant de la mettre sur Vercel, teste qu'elle est valide :

```bash
curl -X POST https://api.stripe.com/v1/checkout/sessions \
  -u "sk_test_XXX:" \
  -d "mode=payment" \
  -d "line_items[0][price_data][currency]=eur" \
  -d "line_items[0][price_data][product_data][name]=Test" \
  -d "line_items[0][price_data][unit_amount]=599" \
  -d "line_items[0][quantity]=1" \
  -d "success_url=https://aevia-launch.vercel.app/success" \
  -d "cancel_url=https://aevia-launch.vercel.app/order"
```

- Si retour `{ "url": "https://checkout.stripe.com/…" }` → ta clé est OK, Aevia Launch va marcher.
- Si `invalid_request_error` → ta clé est une **restricted key** (`rk_*`), il faut une Standard `sk_*`.
- Si autre erreur → message Stripe est explicite.
