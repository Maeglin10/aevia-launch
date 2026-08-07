# AUDIT & POLISH — Aevia Launch (skylaunch)

> Prompt d'audit profond pour Fable 5. Lance-le depuis `~/skylaunch`. **Dépôt PUBLIC** — aucune fuite de secret, README impeccable. Ne déploie rien sans go.

## Contexte produit
Générateur de sites web : **373 thèmes « impact »** + un wizard qui remplit un thème avec les données du client, puis checkout Stripe et déploiement. La **qualité perçue des thèmes et la facilité du wizard** SONT le produit.

## Stack & points d'entrée
- Next.js (Vercel). `app/templates/impact-XXX/` (373 thèmes), `app/configure/` (wizard), `lib/templates/` (registry, pricing, photoSlots, clientContent), `app/api/*` (checkout, stripe/webhook, sessions, generate, upload, extract-menu, idp/[...path], google).

## À VÉRIFIER / POLIR en priorité (déjà repéré)
- **Qualité visuelle des thèmes.** Les impact **326→383** sont cachés (`HIDDEN_IMPACT` dans `app/themes/page.tsx`) car trop « samey » + slots d'image d'animation vides. Sur les **315 visibles** : un cluster « éditorial serif » (≈237‑272) et une famille « service+stats » (≈273‑302) se ressemblent beaucoup ; 1‑236 sont distinctifs. **Fais un vrai QA VISUEL** (rends chaque thème, compare) — la ressemblance est perceptuelle, pas détectable par le code. Repère doublons + images vides. Ne « répare » que la qualité, n'ajoute pas de thèmes.
- **Fiabilité des images.** ≈74 thèmes hotlinkent `images.pexels.com` (fragile : si Pexels bloque/404 → conteneur visible, image vide). ≈266 thèmes ont `<img src={fd.logoBase64}>` **sans fallback** → logo/photos vides en preview. **Fiabilise** (fallback logo, self-host ou robustification des URL stock). C'est LE défaut client visible.
- **Wizard.** Vérifie que **tout** est personnalisable pour chaque thème, que le wizard est **complet mais beau, rapide, facile** pour le client. Repère champs non mappés, frictions, lenteurs.
- **Gotcha connu** : `reactCompiler:true` a déjà cassé des templates en PROD (mémoïsation de sous-composants sans props lisant un module → données démo en prod, dev OK) → `reactCompiler:false`. Vérifie.
- **Routes API** (déjà auditées, bien gardées — confirme) : `idp/[...path]` (allowlist + anti-`..`), `upload` (allowlist MIME + magic bytes), `checkout` (prix serveur), `extract-menu` (allowlist Blob = anti-SSRF), `sessions` (capability-URL UUID, **sans expiration** → à ajouter).

## Parcours client à tester (comme un vrai client)
Galerie → choisir un thème → wizard (uploader logo/photos, remplir infos) → génération → aperçu → checkout Stripe → site déployé. Sur mobile aussi. Chaque thème doit rendre proprement avec des données client réelles.

---
*(La méthode complète suit. Applique-la à ce contexte.)*
---

# 🎯 Mission

Tu es une **équipe de conseil senior externe** (staff engineer, lead sécurité, SRE, lead design/UX, lead DX) qui débarque sur CE dépôt avec un œil neuf. Objectif unique : **hisser ce produit au niveau de qualité et de performance d'une entreprise de premier plan**, pour qu'il justifie un prix *high-ticket* **par la seule qualité** — code, fiabilité, expérience client, sérieux des démarches de dev. Le propriétaire est le **premier client** : teste comme un client qui paie cher.

## Contrainte dure (à ne jamais violer)
- **N'AJOUTE AUCUNE fonctionnalité. NE CHANGE PAS le périmètre ni le comportement visible par le client.** On *polit, durcit, corrige, optimise, documente, automatise*. Si une feature te semble manquante ou une meilleure idée émerge → tu l'écris dans un **backlog** (`BACKLOG.md`), tu ne la construis pas.
- **Priorité au déjà livré / déjà utilisé.** Les zones non sorties (ex. marketing, marketplace) = **audit seulement + backlog**, on ne les polit pas encore.
- **Multi-tenant = sacré.** Toute fuite de données entre clients est une **Sev-1** qui arrête tout le reste.

# 🧭 Méthode de travail (non négociable)
1. **Mesurer avant de conclure.** Ton instrument ment plus souvent que le code (cache, rate-limit, build en cours, URL signée expirée, page plantée prise pour vide). Vérifie chaque affirmation contre le code qui tourne / le comportement réel.
2. **Ne jamais casser ce qui marche.** Petits changements revus, un par un. **Chaque correctif a un test de régression.** Pas de gros refactor sans filet.
3. **Honnêteté totale.** Si un test échoue, dis-le avec la preuve. Aucun « c'est fait » sans preuve exécutée.
4. **Actions irréversibles / vers l'extérieur** (deploy prod, suppression de docs, rotation de clé, force-push, `git push`) → **proposer d'abord, agir après validation**. Committer sur une branche est OK ; pousser/déployer non, sans go.
5. **Supply-chain.** Jamais de `npm/pnpm/yarn install` à l'aveugle → reinstall figé (`npm ci`, `pnpm install --frozen-lockfile`). Vérifier les advisories du jour, scanner les hooks `preinstall`. (Un garde-fou est déjà dans `.claude/settings.json`.)
6. **Secrets.** Jamais un secret dans un commit, un log, un artefact, ni dans le rapport (masquer les valeurs).
7. **Travaille en PHASES** (voir plus bas) : produis un rapport par phase, applique les correctifs sûrs sur une branche `audit/polish-<date>`, checkpoint entre phases. Tu peux être repris plus tard sans perdre le fil.

# 🔬 Dimensions d'audit (creuse CHACUNE à fond — chaque trouvaille = `fichier:ligne`, sévérité, impact, correctif concret, effort)

**A. Architecture & qualité de code.** Frontières de modules, code mort, duplication, nommage, typage strict, gestion d'erreurs, idiomes, complexité. *Est-ce du code qu'un ingénieur top-tier signerait ?* Repère les zones fragiles, les `any`, les `// TODO/FIXME` réels, les fonctions énormes, les abstractions qui fuient.

**B. Sécurité & multi-tenant.** Isolation tenant à TOUTES les couches : DB, API, cache, queue, websocket, jobs. AuthN/AuthZ, secrets, SSRF, injection SQL, XSS, CSRF, IDOR, mass-assignment, escalade de privilèges, CVE de dépendances. **Croise avec l'audit sécurité existant** (mémoire projet `project-security-audit-2026-08-05`) : **vérifie que les correctifs sont déployés en prod**, ne les refais pas, mais **étends** la couverture.

**C. Fiabilité & correction.** Cas limites, null/empty, races, idempotence, retries, timeouts, dégradation gracieuse, intégrité des données, migrations idempotentes, cohérence transactionnelle.

**D. Performance.** N+1, index manquants, caching, taille des bundles, Core Web Vitals, cold starts, tailles de payload, endpoints lents. **Mesure** (traces, timings) avant/après.

**E. Tests.** Couverture des chemins critiques en unit + intégration + e2e. Les tests sont-ils *significatifs* ou décoratifs ? Le harness de DB de test **tourne-t-il vraiment** ? Si cassé, répare-le (les tests d'isolation multi-tenant DOIVENT tourner en CI). Ajoute les tests manquants.

**F. Expérience client & onboarding 100% self-serve.** Parcours inscription → première valeur. Objectif dur : **un client s'installe entièrement SEUL, zéro geste manuel du propriétaire** (pas de seed DB à la main, pas de config back-office, pas d'e-mail à envoyer). Chaque intervention manuelle par client = un bug d'automatisation à corriger. Frictions, impasses, états vides/chargement/erreur, messages d'erreur *actionnables*, mobile, accessibilité (a11y WCAG), i18n. Chaque page se charge, zéro erreur console, zéro 500, images OK. Mesure le **time-to-value** (temps entre inscription et 1re valeur) — vise le plus court.

**G. Observabilité & ops.** Logs, métriques, tracing, alerting, health checks, runbooks. *Peux-tu savoir quand un client est cassé, avant lui ?*

**H. DX & automatisation.** CI/CD, gates lint/format/typecheck, pre-commit, setup dev en une commande, données de seed, builds reproductibles. **Réduis la charge annexe du propriétaire au minimum** : ce qui est manuel et répétitif doit devenir automatique.

**I. Documentation & propreté du dépôt.** Inventaire de TOUTE la doc et de TOUS les fichiers à la racine. Classe : *garder / mettre à jour / SUPPRIMER*. La doc doit décrire **ce qu'on propose AUJOURD'HUI**, pas le passé. Racine du projet nette, doc rangée, README GitHub professionnel. (Détail dans la section « Nettoyage » ci-dessous — c'est un **gros point**.)

# 🚀 Gates de production (go / no-go pour vendre high-ticket)
Un acheteur exigeant (ou son CTO) posera CES questions. Chaque gate = un livrable à auditer, corriger, documenter. Ce qui manque va dans le backlog avec une criticité.

1. **Sécurité des données & reprise après sinistre (DR).** Backups DB automatiques + **restauration RÉELLEMENT testée** (pas juste « activés ») ; point-in-time recovery ; **plan de rollback de migration** (une migration foireuse a déjà crashé la prod — cf. mémoire). Peux-tu perdre 0 donnée client et revenir en < X min ? Rétention.
2. **Intégrité du revenu / facturation.** Stripe robuste : idempotence des webhooks, échecs de paiement & relances (dunning), proration, synchro d'état d'abonnement, **application des limites de plan/quota**, remboursements, TVA. Zéro fuite de revenu, zéro client qui accède au-delà de son plan. (Des bugs Stripe critiques ont déjà existé — cf. mémoire.)
3. **Conformité & vie privée.** RGPD : export & suppression des données par client (vérifier que ça marche vraiment), rétention, chiffrement des PII au repos, liste des sous-traitants, DPA, consentement cookies, ToS/Politique de confidentialité présentes et justes. Pour du B2B high-ticket, c'est une **porte de vente**.
4. **Déploiement sûr.** Un **environnement de staging** proche prod (pour tester « comme un client » avant prod) ; déploiement reproductible ; **canary / rollback rapide** ; feature flags pour couper une feature sans redeploy ; health/readiness probes. (Aujourd'hui le deploy est manuel et a déjà cassé — c'est un risque.)
5. **Observabilité & réveil.** SLO définis (uptime, latence, taux d'erreur) ; **monitoring externe d'uptime** + alerting qui **te prévient AVANT le client** ; dashboards ; **status page** publique ; erreurs remontées (Sentry) côté back ET front.
6. **Délivrabilité e-mail.** SPF/DKIM/DMARC configurés, e-mails transactionnels (onboarding, reset, factures) qui **arrivent vraiment** (pas en spam), gestion des bounces. Un e-mail de reset qui n'arrive pas = « le produit ne marche pas ».
7. **Coûts & abus par tenant.** Rate-limits et **quotas par tenant** ; protection contre un tenant qui fait exploser les coûts usage (LLM/voix/API) ; anti-spam/scraping sur les surfaces publiques (webchat, formulaires) ; dégradation propre si un fournisseur externe (Meta, Stripe, Groq, ElevenLabs…) est down.
8. **Secrets & rotation.** Sortir de l'éparpillement `.env` vers un store géré ; **runbook de rotation** (le problème « clé à 6 endroits ») ; jamais de secret en clair versionné.
9. **Charge & capacité.** Test de charge/stress (k6 est présent) : tient-il à N tenants/utilisateurs concurrents ? Où casse-t-il en premier ? Plan de capacité.
10. **Cohérence de marque / design system.** À l'échelle de la SUITE : une identité visuelle et des composants cohérents entre produits → l'ensemble paraît **premium** (justifie le high-ticket). Note les incohérences (typo, couleurs, composants dupliqués) même si l'unification est un chantier futur (backlog).

Pour chaque gate : dis honnêtement **✅ prêt / ⚠️ partiel / ❌ absent**, avec la preuve, le correctif, l'effort. Le rapport final doit permettre au propriétaire de **savoir exactement ce qui bloque la vente**.

# 🧪 Tests « en prod » comme un vrai client (LE vrai test)
Ne te contente **pas** des tests de code. **Pilote le produit comme un client qui paie**, de bout en bout, dans un environnement proche de la prod (ou une instance jetable réaliste — jamais la vraie DB prod).

- **Drills d'isolation multi-tenant (focus Sev-1).** Crée **au moins 2 tenants**. Connecté comme tenant A, **tente de lire/écrire/voir les données de tenant B** par CHAQUE surface : UI, API, URL directe par `id` (IDOR), recherche, exports, cache, temps réel (websocket/rooms), webhooks, clés API. **Confirme ZÉRO fuite.** Quand un client se connecte, il voit **uniquement** ses données ; aucune réponse ne doit contenir celles d'un autre. Vérifie aussi qu'un client ne peut pas *écrire* chez un autre (création/màj/suppression cross-tenant).
- **Parcours complets.** Onboarding, l'action de valeur principale, facturation/limites, réglages, déconnexion/reconnexion, expiration de session, reset mot de passe. Chaque page charge, pas d'erreur console, pas de 500, états vide/chargement/erreur corrects.
- **Modes de défaillance par page.** Que se passe-t-il si : le backend est lent/down, un champ est vide, une saisie énorme, un réseau lent, un 2e onglet ouvert, des éditions concurrentes, un token expiré, un compte suspendu, un rechargement en plein flux.
- **Preuves.** Capture (screenshots, requêtes/réponses, timings). Rends une **liste de bugs priorisée**.

# 🧹 Nettoyage doc & propreté du dépôt (GROS livrable — prends-le au sérieux)
Le dépôt accumule des mois de notes, rapports, plans, backups, scripts one-shot. **Il faut faire le ménage à fond** : un top-tier repo est propre, sa doc décrit **le produit tel qu'il est aujourd'hui**, et sa racine ne contient que l'essentiel.

**1. Audit « présent vs passé ».** Pour trancher, tu dois d'abord **comprendre en profondeur ce que le produit propose ACTUELLEMENT** (lis le code qui tourne, les routes/écrans réels, la mémoire projet). Ensuite, tout document/fichier qui décrit une version passée, une décision révolue, un plan déjà exécuté ou abandonné, un état d'avancement daté, un rapport de nuit/de session, une migration finie → **candidat à la suppression**. Garde uniquement ce qui aide un dev/un client *maintenant*.

**2. Inventaire complet.** Liste **toute** la doc (`*.md`, `docs/`, `AGENTS.md`, notes) ET **tous les fichiers à la racine du projet**. Classe chacun :
- **Garder** (utile, à jour) · **Mettre à jour** (utile mais périmé → corriger contre la réalité) · **SUPPRIMER** (obsolète / dupliqué / passé / one-shot / rapport daté) · **DÉPLACER** (mal rangé → doit aller dans `docs/`).

**3. Nettoyer la RACINE.** La racine ne doit contenir que l'essentiel (README, LICENSE, configs, dossiers sources). Repère et traite : rapports/notes en vrac (`*_REPORT.md`, `NIGHT_SHIFT`, `STATUS`, `DEPLOY_*`, `.local.md`, backups `*.bak*`, `_backup_*`, `.tmp`), scripts one-shot jamais réutilisés, fichiers de sortie de test, dossiers d'artefacts. **Supprime ou range** (après validation pour les suppressions). Vérifie que rien de supprimé n'est référencé ailleurs.

**4. Ranger.** Ce qui reste va dans une arbo `docs/` claire (ex. `docs/architecture/`, `docs/ops/`, `docs/product/`), avec un `docs/README.md` index. Un seul endroit par sujet, zéro doublon.

**5. Réécris le README GitHub** au niveau pro : ce que c'est, pour qui, quickstart, schéma d'architecture, variables d'env/config, déploiement, tests, liens. Zéro info périmée — il doit refléter le produit **d'aujourd'hui**.

**6. Ajoute si absent** : `ARCHITECTURE.md` (comment ça tient debout), `CONTRIBUTING.md` (démarches dev), un court **« Comment un client utilise ce produit »**.

**Règle d'or :** avant de supprimer, tu confirmes la liste avec le propriétaire (`git rm` groupé, jamais de suppression silencieuse d'un truc encore utile). Mais sois **ambitieux** : mieux vaut proposer trop de suppressions que laisser pourrir la base.

# 📦 Livrables (à produire, dans le repo)
1. `AUDIT_REPORT.md` — trouvailles classées par sévérité (Sev-1 tenant/sécurité → cosmétique), chacune avec `fichier:ligne`, impact, correctif concret, effort.
2. **Correctifs appliqués** pour les cas sûrs/clairs (avec tests de régression), sur une branche `audit/polish-<date>` + PR. **Non déployés sans go.**
3. `PROD_TEST_REPORT.md` — parcours client + drills d'isolation, avec preuves.
4. Diff de nettoyage doc + **nouveau README**.
5. `BACKLOG.md` — tout ce qui est hors périmètre (features, idées) pour plus tard, avec priorité.
6. Un court **« État du produit »** en tête du rapport : est-ce vendable *high-ticket* aujourd'hui ? qu'est-ce qui bloque ? Inclut une **scorecard des 10 gates de production** (✅/⚠️/❌ + note globale de « prod-readiness » sur 10).

# ⛔ Hors périmètre / garde-fous
- Pas de nouvelle feature. Pas de changement visible par le client. Pas de refactor risqué sans tests. Pas de deploy prod sans confirmation. Aucun secret exposé. Ne touche pas à la DB prod (utilise une instance jetable).

# 🗺️ Déroulé conseillé (phases)
- **P0 — Reco (30 min).** Cartographie le repo, la stack, les points d'entrée, l'état git, ce qui est déjà audité/corrigé (lis la mémoire projet). Sors une carte + un plan.
- **P1 — Sécurité & isolation multi-tenant.** Le plus critique. Vérifie les correctifs existants sont déployés, puis drills d'isolation en instance jetable.
- **P2 — Fiabilité & correction + tests.** Répare le harness de test si cassé. Couvre les chemins critiques.
- **P3 — Parcours client & UX/onboarding.** Teste comme un client, page par page.
- **P4 — Perf & observabilité.** Mesure, indexe, cache, alerte.
- **P5 — Qualité de code & DX & automatisation.** Lint/format/CI, réduction de la charge manuelle.
- **P6 — Doc & propreté du dépôt.** Audit présent-vs-passé, inventaire doc + fichiers racine, liste de suppressions/déplacements (validée), racine nettoyée, `docs/` rangé, README réécrit. **Gros point.**
- **Clôture.** Rapport consolidé + backlog + « état du produit » + liste des gestes qui restent au propriétaire (deploy, rotations), rien d'autre.

Travaille en profondeur. Rends compte honnêtement. Objectif final : que le propriétaire se sente **confiant pour aller vendre**.
