# Demande d'accès à l'API Google Business Profile

> Tout ce que le formulaire réclame est ci-dessous, prêt à copier. Il ne reste
> qu'à ouvrir le lien, coller, et envoyer au nom d'Aevia.
>
> **Formulaire** : https://support.google.com/business/workflow/16726127
> (choisir « Application for Basic API Access »)

---

## 1. Ce que le formulaire demande

| Champ | Valeur |
|---|---|
| **Google Cloud Project Number** | `1010414482681` |
| **Project ID** | `aevia-ws` |
| **Nom de l'application** | aevia.services |
| **Site web** | https://launch.aevia.services |
| **Politique de confidentialité** | https://launch.aevia.services/legal/confidentialite |
| **Mentions légales** | https://launch.aevia.services/legal/mentions-legales |
| **Contact** | v.milliand@gmail.com |
| **Type d'accès** | Basic API Access — lecture des avis |

**Vérification faite** : le client OAuth de production appartient bien au projet
`1010414482681`, celui pour lequel l'accès est demandé. Un décalage entre les
deux est l'erreur qui coûte le plus cher — l'accès est accordé par projet, et
une demande déposée pour le mauvais projet se découvre après quatorze jours.

---

## 2. Description de l'usage (à coller tel quel)

> Aevia builds and hosts websites for small local businesses in France —
> roofers, hairdressers, doctors, restaurants, independent professionals. Each
> customer fills in a short form and receives a published website for their own
> business.
>
> Customer reviews are the single most important trust signal on these sites.
> Today our customers have to copy their Google reviews by hand, one by one,
> which most of them never finish. We want to offer a one-click "Connect
> Google" button so that a business owner can display, on their own website,
> the reviews that customers have already left on their own Google Business
> Profile.
>
> **Scope requested**: `https://www.googleapis.com/auth/business.manage`, used
> read-only.
>
> **What we read**: `accounts.list`, then `locations.list` for that account,
> then `reviews.list` for the location. From each review we keep the reviewer's
> display name, the star rating and the comment text.
>
> **What we never do**: we do not post, edit, reply to or delete anything on
> the Business Profile. We do not read any other data from the Google account.
> We do not aggregate reviews across businesses, resell them, share them with
> third parties, use them to train models, or use them for advertising.
>
> **Who authorises it**: only the owner of the profile, through Google's own
> consent screen, for their own business, on their own website. The
> authorisation can be revoked at any time from their Google Account
> permissions page.
>
> **Storage**: the reviews are stored in that customer's own site data and
> deleted when the site is deleted.
>
> This is disclosed in our privacy policy, section "Sous-traitants" →
> "Google Search Console & Google Business Profile":
> https://launch.aevia.services/legal/confidentialite

---

## 3. État de la préparation technique

Tout est écrit, testé et déployé. Rien à coder le jour de l'accord.

| Élément | État |
|---|---|
| API `mybusinessaccountmanagement` | ✅ activée sur `aevia-ws` |
| API `mybusinessbusinessinformation` | ✅ activée sur `aevia-ws` |
| API `mybusiness` v4 (les avis) | ⏳ invisible tant que l'accès n'est pas accordé |
| Client OAuth dans le bon projet | ✅ vérifié (`1010414482681`) |
| Code de récupération des avis | ✅ `lib/google-avis.ts`, 6 tests |
| Branchement au callback OAuth | ✅ `app/api/google/callback/route.ts` |
| Scope `business.manage` | ✅ posé sous drapeau, éteint |
| Politique de confidentialité | ✅ section Business Profile publiée |
| Voie de repli sans l'API | ✅ collage des avis, en production |

### Le jour de l'accord

1. Vérifier que le quota est passé à 300 QPM dans la console Cloud
   (c'est le signe que le projet est approuvé).
2. Poser la variable sur Vercel :
   ```
   vercel env add GOOGLE_BUSINESS_REVIEWS production   # valeur : 1
   ```
3. Redéployer : `vercel --prod`.
4. Le bouton « Connecter Google » de l'aperçu demande alors le scope en plus et
   remplit les avis du client automatiquement.

**Pourquoi le drapeau** : demander `business.manage` avant l'approbation fait
refuser l'écran de consentement **en entier**. Le client perdrait Analytics et
Search Console pour un scope inutilisable. Le drapeau évite cela.

---

## 4. Ce à quoi s'attendre

- **Délai annoncé** : instruction sous 14 jours.
- **Signe d'approbation** : le quota des Business Profile APIs passe à 300 QPM
  dans la console Cloud du projet.
- **Motif de refus le plus courant** : politique de confidentialité qui ne
  décrit pas l'usage des données Google — traité ci-dessus.
- **Point d'attention** : `business.manage` est un scope sensible. L'écran de
  consentement du projet porte déjà deux scopes sensibles (`analytics.edit`,
  `webmasters`) et fonctionne en production ; l'ajout suit donc le même chemin
  plutôt que de repartir de zéro. Si Google demande une revue de l'écran de
  consentement, la démonstration à fournir est le parcours
  « Connecter Google » depuis un aperçu de site.
