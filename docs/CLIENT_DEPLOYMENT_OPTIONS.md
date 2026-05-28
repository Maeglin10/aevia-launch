# Aevia Launch — déploiement des sites clients

Aujourd'hui, après le pipeline E2E, le client voit son site sur :

```
https://aevia-launch.vercel.app/preview/{sessionId}
```

C'est fonctionnel mais **pas brandé pour le client** (URL Aevia). Le but : que le client ait son **propre site live** avec son nom dans l'URL (ex: `maison-maria.vercel.app`) ou son propre domaine (`maison-maria.fr`).

## Les 4 options réelles

### Option A — Vercel API direct (sans repo) ✅ recommandée

**Principe** : à la fin du pipeline (webhook), notre code appelle l'API Vercel pour créer un nouveau projet + déployer le code généré.

**Implémentation** (route `/api/deploy-client`) :

```ts
import { put } from "@vercel/blob";
import { getSessionFromBlob } from "@/lib/sessions";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID!;

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  const session = await getSessionFromBlob(sessionId);
  if (!session?.generatedContent) {
    return NextResponse.json({ error: "Session not ready" }, { status: 400 });
  }

  // 1. Génère les fichiers Next.js depuis le brief
  const files = buildSiteFiles(session); // { "package.json": "...", "app/page.tsx": "...", ... }

  // 2. Crée le projet Vercel
  const slug = slugify(session.formData.businessName); // "maison-maria"
  const proj = await fetch(
    `https://api.vercel.com/v9/projects?teamId=${VERCEL_TEAM_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: slug,
        framework: "nextjs",
      }),
    },
  ).then((r) => r.json());

  // 3. Crée le déploiement (upload inline des fichiers en base64)
  const deploy = await fetch(
    `https://api.vercel.com/v13/deployments?teamId=${VERCEL_TEAM_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: slug,
        project: proj.id,
        target: "production",
        files: Object.entries(files).map(([file, data]) => ({
          file,
          data: Buffer.from(data).toString("base64"),
          encoding: "base64",
        })),
        projectSettings: {
          framework: "nextjs",
          installCommand: "npm install",
          buildCommand: "npm run build",
        },
      }),
    },
  ).then((r) => r.json());

  // 4. Optionnel : crée un alias custom plus court
  await fetch(
    `https://api.vercel.com/v2/deployments/${deploy.uid}/aliases?teamId=${VERCEL_TEAM_ID}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ alias: `${slug}.vercel.app` }),
    },
  );

  return NextResponse.json({
    success: true,
    url: `https://${slug}.vercel.app`,
    deployId: deploy.uid,
    projectId: proj.id,
  });
}
```

**Avantages** :
- Le plus rapide à dev (~1 jour)
- Vercel gère SSL, CDN, image opt, analytics gratuitement
- Free tier Vercel = ~6000 builds/mois, suffit pour ~500 clients
- Code source reste chez nous (Vercel ne supprime jamais)
- Re-deploy à tout moment depuis le brief en Blob

**Inconvénients** :
- Pas de versioning Git par défaut (mais on peut re-générer depuis Blob)
- Si Vercel ferme (très improbable), on perd l'infra (mais on a les fichiers)

**Coûts estimés (Vercel Pro $20/mois)** :
- Free tier : 100 GB-Hours serverless / 100 GB bandwidth / 1000 image opt / mois
- Si ≥ 200 sites clients avec ≥ 50 visites/jour, passer en Pro
- Pour 50 clients actifs : reste en Free

### Option B — Vercel + repo GitHub privé par client

**Principe** : on crée un repo privé GitHub par client, on push le code généré, on lie le repo au projet Vercel.

**Avantages** :
- Versioning + history complet
- Possibilité de vendre l'accès au code comme upsell premium ("votre site est votre propriété")
- Collaboration future possible (autre dev modifie)

**Inconvénients** :
- +1 jour dev
- +1 service externe (GitHub API, quotas, tokens à manager)
- Stockage : 1 repo/client = ~100-500 repos après 1 an
- Si le client annule, soft-delete le repo (privé inactif = ok GitHub Free)

**Quand l'utiliser** : si tu veux proposer un tier "Premium" qui inclut le code source comme livrable.

### Option C — Hostinger (et autres hébergements traditionnels)

**Pas adapté** pour Next.js dynamique :
- Hostinger = Apache/PHP, on perd API routes, ISR, Image Opt
- Next.js peut sortir en "static export" mais on perd la moitié des features
- DevOps manuel : FTP, SSL Let's Encrypt, cron jobs
- Économie ~5€/mois mais on récupère 10h/mois de tâches manuelles

**Skip** sauf si tu vises 1000+ clients à gérer en mode usine (et là il y a des tools dédiés type Coolify ou Cloud66).

### Option D — Cloudflare Pages

**Bonne alternative gratuite à Vercel** :
- Gratuit illimité (vraiment, pas comme Vercel)
- CDN excellent, parfois meilleur que Vercel sur certaines régions
- Workers (équivalent edge functions Vercel) très puissants

**Inconvénients** :
- DX un peu moins bon que Vercel (moins de "one-click features")
- Image optimization manuelle (pas de `next/image` auto-optimized)
- Build avec Wrangler ou via GitHub repo (pas d'upload inline aussi propre que Vercel)

**Quand l'utiliser** : si la facture Vercel commence à exploser (rare).

---

## Recommandation concrète pour Aevia Launch V2

### Court terme (MVP — 1 jour de dev)

**→ Option A** seulement.

À la fin du webhook Stripe (après paiement confirmé), on appelle `/api/deploy-client` qui :
1. Lit le brief depuis Blob
2. Génère les fichiers Next.js en mémoire
3. Crée un projet Vercel
4. Déploie via upload inline
5. Crée l'alias `{slug}.vercel.app`
6. Email au client avec le lien définitif

### Moyen terme (V2 — 1 jour de plus)

**→ Ajouter Option B en tier premium**.

Si le client achète un plan "Premium" (à 499€ par ex.), on duplique le code dans un repo GitHub privé `aevia-client-{slug}` et on lui envoie une invitation comme collaborator. Il a son code, peut le forker, le modifier, ou le confier à un autre dev plus tard.

### Domaine custom du client

Quand le client veut son domaine (`maison-maria.fr`) :

1. **Le client achète son domaine** sur Namecheap / OVH / Gandi (~10€/an)
2. **Il te donne accès DNS** (compte invité ou identifiants)
3. **Tu ajoutes le domaine** dans Vercel :

```bash
# CLI Vercel
vercel domains add maison-maria.fr --project maison-maria

# Ou via API
curl -X POST "https://api.vercel.com/v10/projects/{projectId}/domains?teamId=${TEAM_ID}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"maison-maria.fr"}'
```

4. **Vercel donne les enregistrements DNS** à mettre chez Namecheap/OVH (un CNAME ou des A records)
5. **Tu les configures** chez le registrar
6. **Vercel auto-provisionne le SSL** sous ~5min via Let's Encrypt

Tu peux le proposer comme service inclus dans le plan Premium, ou facturer à part (~50€ setup unique).

---

## Variables d'environnement à ajouter sur Vercel (pour Option A)

```bash
# Permet à Aevia Launch d'appeler l'API Vercel pour créer projets/deploys
VERCEL_API_TOKEN=vercel_xxxxxxxxxx     # Generate at vercel.com/account/tokens
VERCEL_TEAM_ID=team_xxxxxxxxxx          # Visible in URL of team settings
```

Le token doit avoir scope **full account** ou au minimum :
- `projects:create`
- `deployments:create`
- `aliases:create`
