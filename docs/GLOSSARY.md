# Glossaire — Aevia Launch

Les termes qui reviennent dans le code et les docs. Définitions tirées de
l'architecture réelle mesurée (voir [`OVERVIEW.md`](OVERVIEW.md),
[`PLAN_CONTRAT_CONTENU.md`](PLAN_CONTRAT_CONTENU.md),
[`IA_OU_PLUG_AND_PLAY.md`](IA_OU_PLUG_AND_PLAY.md),
[`DOC_LEGAL_AUDIT_2026-08.md`](DOC_LEGAL_AUDIT_2026-08.md)).

---

**Impact template (`impact-XX`)** — Un des **373** designs de site vendus au client, dans
`app/templates/impact-XX/page.tsx`. C'est le catalogue réel (« 100 % impact »). Numéroté
`impact-01`…`impact-383` (avec des trous). Un `impact-XX` **404** à `/themes/impact-XX`.

**Semantic theme** — L'**ancien** système de thèmes, routé par `app/themes/[id]/page.tsx`
avec des ids sémantiques (`ecommerce`, `vitrine`, `landing`, `saas`…) rendus par
`components/themes/` + `GeneratedSite.tsx`. À ne jamais confondre avec les impact
templates. N'est pas ce qu'on vend au client.

**Contrat de contenu** — La discipline qui relie thème et wizard. Trois règles dans
l'ordre : (1) le **thème déclare** ce qu'il sait montrer ; (2) le **wizard demande** ce que
le thème déclare (plus le socle commun) ; (3) le **thème lit un contrat unique** de
fonctions, plus ses propres constantes. Câbler (3) sans (1) et (2) = « câbler du vide ».

**Ordre de lecture** — Dans chaque thème, toujours le même, jamais l'inverse :
`donnée du client (businessProfile)` → `contenu généré (generatedContent)` → `constante de
démonstration du thème`. La donnée du client passe toujours devant.

**`businessProfile`** — La donnée saisie par le client au wizard (nom, ville, prestations,
tarifs, avis, chiffres, équipe, FAQ, horaires, adresse, identité légale, couleur, photos).
Première source de vérité du contrat.

**`generatedContent`** — Le contenu produit par l'IA (`/api/generate`) : accroche,
sous-titre, « à propos », descriptions de services, témoignages, CTA, titre + description
SEO. **Repli**, jamais source première — n'apparaît que là où le client n'a rien saisi.

**clientX() / fonctions du contrat** — Les accesseurs uniques que les thèmes appellent pour
lire la donnée dans l'ordre de lecture (p. ex. un `clientText(...)`, `clientServices(...)`,
`sectionOverrides`…). Une fonction du contrat employée **sans être importée** ne casse pas
la compilation (les thèmes portent `@ts-nocheck`) mais **fait disparaître la page** au
premier rendu — vérifié par `scripts/check-imports-contrat.mjs`.

**`sectionOverrides`** — Mécanisme par lequel le client (ou l'archétype métier) réécrit le
contenu d'une section précise du thème, par-dessus la démo, sans toucher au design.

**Archétype (métier)** — Un des **8** regroupements de métiers (68 métiers au total) qui
détermine quelles étapes/questions le wizard pose et quelles CGV sont générées
(`lib/legal/legalArchetypes.ts`). Croisé aux thèmes par `scripts/audit-archetypes.mjs`
pour garantir : aucune section affichée sans question posée. Ex. `expertise_b2b`,
`immobilier`, `produits`.

**Passes BrandColorVar** — Les **cinq corrections globales** dans
`app/templates/BrandColorVar.tsx`, exécutées **après le rendu** sur les 373 thèmes d'un
coup (au lieu de 373 éditions) : lien de réservation sous les boutons qui le promettent,
horaires du client à la place du modèle, nom qui rétrécit au lieu d'être coupé, en-tête qui
cesse de déborder sous un nom long, marque des sous-pages. **Elles ne changent que la
valeur des nœuds texte déjà en place** — jamais la structure DOM, sinon React plante au
re-rendu (« NotFoundError: Failed to execute 'removeChild' »). Neutres si le client n'a
rien saisi. La passe pilote aussi la couleur de marque (`--brand`) avec garde-fou de
contraste.

**Session Blob** — Une session wizard stockée dans **Vercel Blob** (`lib/sessions.ts`),
lue par `/api/sessions` et référencée dans l'URL (`?session=…`, `/preview/[sessionId]`).
**Sans `BLOB_READ_WRITE_TOKEN` en local, `/api/sessions` répond 404** et le thème retombe
sur sa démo — source classique de faux négatifs en test. Le rate-limit par défaut est de
30 req/min ; le serveur de mesure le relève (`SESSIONS_RATE_LIMIT`).

**Plug-and-play** — Le mode par défaut du contenu : ce que le client tape s'affiche, ce
qu'il ne tape pas garde le contenu du thème. **Aucune donnée client ne passe par un
modèle.** Opposé à « généré par IA ».

**« Quasi-prêt »** — Le positionnement du produit : un site presque fini, pas un site
sur-mesure. C'est ce qui en fait un **aimant à leads** (voir ci-dessous), pas un livrable
premium. L'objectif est de le **finir**, pas de le relancer.

**Aimant à leads (lead magnet)** — Le rôle de Launch dans la suite : un site quasi-prêt est
l'offre qui convertit les prospects sans site vers **Aevia Inbox** (le produit réellement
vendu). Launch n'est pas vendu pour lui-même en priorité.

**Contenu de démonstration (démo)** — Le contenu par défaut d'un thème (services,
témoignages, chiffres factices). Règle fondateur : **on n'invente rien**, et si le client
ne remplit pas une section, **on garde celle du thème et on le lui dit** — aucune section
n'est supprimée. « reste » dans les tableaux d'état = ce qui subsiste de la démo.

**`generateLegalPages` / pages légales générées** — `lib/legal/generateLegalPages.ts`
fabrique **sans IA**, par gabarit, quatre documents à partir du `LegalStep` du wizard
(SIRET, forme juridique, adresse, capital) : mentions légales, CGV (variable **par
archétype**), confidentialité, CGU. Rendus par `app/templates/_shared/TemplateLegal.tsx`.

**Deux systèmes de thèmes** — Rappel : **impact** (vendu, `app/templates/`) vs **semantic**
(ancien, `app/themes/`). Le piège n°1 des liens/redirections.

**`reactCompiler:false`** — Réglage **délibéré** dans `next.config.ts` : le React Compiler
mémoïsait des sous-composants sans props lisant une variable de module `bp` → **données de
démo en prod** (dev OK). Le désactiver neutralise ce footgun.

**`ignoreBuildErrors:true`** — Dans `next.config.ts` : le build **passe même avec des
erreurs de type**. Combiné à ~5 700 `any` et 516 suppressions (`@ts-nocheck`/`@ts-ignore`),
le typage est **de fait désactivé**. Dette connue (audit P0).

**Impact multi-page** — Les thèmes impact qui gèrent plusieurs pages via un state `page`
+ `goTo` (nav et footer hors du gate `{page==="home" && …}`). CGV / mentions légales vont
au **footer**, jamais au nav top.
