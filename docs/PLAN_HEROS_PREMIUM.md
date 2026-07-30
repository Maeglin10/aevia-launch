# Plan d'exécution — poser les heros premium sur les thèmes faibles

> Pour Claude Code. Tout est déjà écrit et testé : il s'agit de **poser** des
> mécaniques existantes sur des thèmes nommés, pas d'inventer.
>
> Lire avant de commencer :
> - [AUDIT_VENDABILITE_2026-07-30.md](AUDIT_VENDABILITE_2026-07-30.md) — quels thèmes et pourquoi
> - [SLIDER_REVOLUTION_TEARDOWN_2.md](SLIDER_REVOLUTION_TEARDOWN_2.md) — d'où viennent les timings
> - `lib/templates/hero-kit-2.tsx` — le code des mécaniques
> - `app/hero-labs/page.tsx` — six heros complets qui les utilisent, à copier

## Ce qui est déjà fait

- `lib/templates/hero-kit-2.tsx` — douze mécaniques, testées, `prefers-reduced-motion` respecté.
- `app/hero-labs` — six heros de démonstration, vérifiés en 1440×900 et 390×844.
  Chacun est adressable : `/hero-labs#wine`, `#law`, `#bakery`, `#chateau`,
  `#event`, `#tailor`.
- Les timings viennent de la mesure image par image de 18 enregistrements
  Slider Revolution, pas d'une estimation.

## Les trois nombres à ne pas changer

Ils sont la raison pour laquelle nos anciens heros paraissaient bon marché :

1. **Une transition dure 0,6 à 1,0 s.** Jamais 0,3 s. Constantes : `T.single`
   (0,7 s pour un élément seul), `T.group` (1,0 s pour un groupe échelonné).
2. **Le temps d'arrêt vaut 3 à 6 fois la transition.** Constantes : `DWELL.brisk`
   (3 s), `DWELL.normal` (4,2 s), `DWELL.slow` (5,6 s). Ne jamais descendre sous 2,5 s.
3. **Les enfants d'un groupe sont décalés de 55 ms** (`T.stagger`). Un groupe qui
   bouge d'un bloc se lit comme un seul élément plat.

## Les mécaniques, et quand s'en servir

| Mécanique | Ce qu'elle fait | Métiers |
|---|---|---|
| `AnchoredBackdrop` | Le titre ne bouge pas, seule la photo se dissout. Option `blur` quand un produit passe devant. | Le choix par défaut. Artisan, santé, immobilier, mariage, éducation. |
| `WordFlight` | Le titre s'assemble mot par mot, chaque mot dans son propre masque. | Avocat, conseil, comptabilité — tout ce qui doit paraître grave. |
| `ExpandFrame` | La photo s'ouvre depuis un petit rectangle. Se marie à `WordFlight` : les deux atterrissent ensemble. | Idem. |
| `LineMask` | Le titre sort ligne par ligne sous masque horizontal. | Mode, couture, joaillerie. |
| `GhostSolid` | Ligne 1 en contour, ligne 2 pleine dans l'accent. | Sport, garage, tout ce qui est « musclé ». |
| `BlurThrough` | Le libellé se floute en sortie et en entrée, au lieu de disparaître. | Coiffure, tatouage, beauté. |
| `HeldSwap` | Sortie 0,57 s → **un demi-temps de vide tenu** → entrée 0,88 s. C'est ce vide qui fait cher. | Produit unique : bouteille, bouquet, assiette, flacon. |
| `BentoCascade` | Tuiles inégales qui se vident et se remplissent en cascade. | Événementiel, création, portfolio. |
| `Retint` | Une surface plate prend une couleur prise dans la photo courante. | Partout. Le meilleur rapport effet/travail du lot. |
| `CircularLabel` | Texte sur cercle qui tourne, qui **dit quelque chose**. | Cave, spa, atelier. |
| `SlideIndex` | Le compteur, en `flat` ou en `fraction`. | Tout hero à slides. |
| `HairlineArrows` | Flèches filaires, vrais `<button>`, cible 44 px. | Idem. |

## Procédure, thème par thème

### 1. Regarder le thème avant d'y toucher

```bash
open http://localhost:3000/templates/impact-NNN
```

Noter : la palette (constante `C` en haut du fichier), les polices, le ton
(vouvoiement, français ou anglais), et ce que le hero raconte aujourd'hui.
**Le nouveau hero doit ressembler au reste du thème** — on remplace la
mécanique, pas l'identité.

### 2. Copier le lab le plus proche

`app/hero-labs/page.tsx` contient six heros complets. Prendre celui qui
correspond au métier (le tableau de l'audit dit lequel), le coller dans le
thème, puis :

- remplacer les couleurs en dur par les tokens `C.*` du thème ;
- remplacer les polices par celles du thème ;
- réécrire **tout** le texte dans la voix du thème — jamais de lorem, jamais
  le texte du lab ;
- garder les `id="hero"` et les ancres que la nav utilise déjà.

### 3. Les photos

Toutes les images passent par `images.unsplash.com` ou `images.pexels.com` —
ce sont les seuls hôtes autorisés par le `img-src` de la CSP dans
`next.config.ts`. **Tout autre hôte est silencieusement bloqué en production**
(c'est ce qui est arrivé à `i.pravatar.cc` sur impact-317).

Vérifier chaque identifiant avant de le committer :

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://images.unsplash.com/photo-XXXX?w=200"
```

Un 404 ici veut dire une image vide sur le site livré. Trois l'étaient.

### 4. Vérifier en mesurant, pas à l'œil

C'est la leçon la plus chère de ces deux sessions. Une capture ne montre pas ce
qui est rogné, et un titre qui chevauche une image se voit mal sur un aperçu.

```bash
# le hero tient-il dans le premier écran, CTA compris ?
node scripts/audit-theme.mjs impact-NNN

# les ancres de la nav pointent-elles quelque part ?
node /tmp/verifyanch.mjs impact-NNN
```

Et pour un hero où du texte côtoie une image, **mesurer l'écart** plutôt que le
regarder — c'est comme ça qu'on a trouvé les 19 px de chevauchement du lab vin :

```js
const t = document.querySelector('h1 span').getBoundingClientRect();
const f = document.querySelector('[role="img"]').getBoundingClientRect();
console.log('écart', Math.round(f.left - t.right));   // doit rester positif
```

### 5. Contrôles avant de committer

```bash
npx tsc --noEmit -p .        # doit rester à 1942 erreurs, la ligne de base
npm run build                # doit passer
```

Captures en 1440×900 **et** 390×844, et les regarder vraiment. Sur téléphone,
un titre coupé en deux autour d'une image ne rentre pas : prévoir une
composition différente sous 768 px (le lab vin le fait — titre sur une ligne
au-dessus du cadre).

## Ordre conseillé

**Lot 1 — les six qui rapportent le plus** (métier vendeur, seul le hero cloche)

| # | Thème | Métier | Mécanique | Lab à copier |
|---|---|---|---|---|
| 1 | impact-149 | Spa / bien-être | split écran + pastilles teintées | `#bakery` |
| 2 | impact-147 | Avocat | `WordFlight` + `ExpandFrame` | `#law` |
| 3 | impact-248 | Ostéopathe | `AnchoredBackdrop` + `SlideIndex` | `#chateau` |
| 4 | impact-243 | Médecin | `AnchoredBackdrop` + `SlideIndex` | `#chateau` |
| 5 | impact-50 | Psychologue | `AnchoredBackdrop`, dwell `slow` | `#chateau` |
| 6 | impact-84 | Clinique (6 pages déjà écrites) | `AnchoredBackdrop` + `Retint` | `#chateau` |

**Lot 2 — le plus faible de chaque métier** (tableau complet dans l'audit)

impact-213 (artisan), impact-53 (création), impact-109 (conseil),
impact-169 (restaurant), impact-120 (boutique), impact-83 (mode),
impact-266 (événement), impact-90 (boulangerie), impact-49 (éducation),
impact-309 (tatouage), impact-209 (coiffure), impact-47 (fleuriste),
impact-72 (garage), impact-131 (cave).

**Lot 3 — reconvertir le bloc SaaS**

49 templates sont des sites SaaS/crypto/quantique : 16 % de la vitrine pour un
public qui n'achètera pas. Garder les 8 à 10 meilleurs, reconvertir les autres
vers un métier réel en gardant la mise en page et l'animation, en changeant le
contenu et les photos. Candidats, du moins vendable au plus : impact-119, 129,
161, 102, 101, 54, 165, 22, 18, 51, 113, 34, 219, 44.

## Deux choses à ne pas oublier

- **`registry.ts` ment sur une partie du catalogue.** impact-119 y est annoncé
  « IronX Fitness / Sports » alors que la page est une infra cloud ;
  impact-149 « Nørdic Furniture » alors que c'est un spa ; impact-147
  « Void Arch » alors que c'est un cabinet d'avocats. Un acheteur qui filtre par
  catégorie tombe à côté. À corriger en lisant chaque page, pas le registre.
- **Le serveur de développement meurt** sous un balayage complet des 315 routes
  (Turbopack compile chaque route à la demande et ne rend pas la mémoire).
  Pour tout audit de masse : `npm run build && npx next start`, jamais
  `npm run dev`. Et un seul balayage à la fois.
