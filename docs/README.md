# Docs — Aevia Launch

Index de la documentation. Règle de rangement : **un seul « état » courant et un seul
« audit » courant**, mis à jour en place ; tout instantané daté part dans `archive/`.

## Commencer ici

| Fichier | Ce que c'est |
|---|---|
| [`OVERVIEW.md`](OVERVIEW.md) | **La doc générale** : rôle produit · architecture (2 systèmes de thèmes, contrat de contenu, IA-vs-plug-and-play) · tarifs canoniques · état juridique · liens. |
| [`GLOSSARY.md`](GLOSSARY.md) | Définitions : impact-XX vs thème sémantique, contrat de contenu, archétype, `clientX()`, passes BrandColorVar, session Blob, plug-and-play, « quasi-prêt »… |

## État courant

| Fichier | Portée |
|---|---|
| [`ETAT_THEMES_2026-08-07.md`](ETAT_THEMES_2026-08-07.md) | **L'état de référence des 373 thèmes** (sections de la page d'accueil). On met à jour ce fichier en place — tout nouveau daté va dans `archive/`. |
| [`ETAT_PAGES_ANNEXES_2026-08-10.md`](ETAT_PAGES_ANNEXES_2026-08-10.md) | État des **pages annexes** (produits, billetterie, sous-pages). |
| [`AUDIT_REPORT_LAUNCH.md`](AUDIT_REPORT_LAUNCH.md) | **L'audit d'ingénierie courant** (prod-readiness 4,4/10). |
| [`DOC_LEGAL_AUDIT_2026-08.md`](DOC_LEGAL_AUDIT_2026-08.md) | Audit juridique & conformité + inventaire documentaire. |

## Références (évergreen)

| Fichier | Sujet |
|---|---|
| [`PLAN_CONTRAT_CONTENU.md`](PLAN_CONTRAT_CONTENU.md) | Architecture du contrat de contenu (thème ↔ wizard). |
| [`PERSONNALISATION_PAR_THEME.md`](PERSONNALISATION_PAR_THEME.md) | Ce que le client peut changer, thème par thème (mesuré). |
| [`IA_OU_PLUG_AND_PLAY.md`](IA_OU_PLUG_AND_PLAY.md) | IA vs plug-and-play + coûts (Gemini 2.5 Flash + Groq). |
| [`CATALOGUE_GESTES.md`](CATALOGUE_GESTES.md) | Catalogue des mécaniques d'animation premium. |
| [`QA_VISUELLE_METHODE.md`](QA_VISUELLE_METHODE.md) | Méthode de QA visuelle (comment mesurer, comment se tromper). |
| [`SLIDER_REVOLUTION_TEARDOWN.md`](SLIDER_REVOLUTION_TEARDOWN.md) · [`_2`](SLIDER_REVOLUTION_TEARDOWN_2.md) | Teardowns d'animation (recherche). |
| [`CLIENT_DEPLOYMENT_OPTIONS.md`](CLIENT_DEPLOYMENT_OPTIONS.md) | Options de déploiement des sites clients (à revérifier vs pipeline actuel). |
| [`STRIPE_WEBHOOK_SETUP.md`](STRIPE_WEBHOOK_SETUP.md) | Setup du webhook Stripe (ops). |
| [`EVAL_STRIX_2026-08-03.md`](EVAL_STRIX_2026-08-03.md) | Éval de l'outil de test sécu (Strix). |

## Dossiers

- [`prompts/`](prompts/) — prompts réutilisables : `AUDIT_POLISH_PROMPT`,
  `PROMPT_AUDIT_PRODUIT`, `PROMPT_TEST_THEMES_LOCAL`, `PROMPT_ANTIGRAVITY_VISUEL`.
- [`archive/`](archive/) — instantanés datés et journaux de chantier (historique, git
  conservé) : séries `ETAT_THEMES` 08-03→08-06, audits juillet (produit/thèmes/vendabilité,
  responsive), niches/thèmes premium, plans héros, logo-rollout, listes de câblage, QA
  visuelle ponctuelle, pipeline E2E, plan wizard business-aware, etc.

> Le guide d'ingénierie vivant est `.claude/CLAUDE.md` (deploy manuel, deux systèmes de
> thèmes, correctifs responsive globaux, protocole de session). Le README public du dépôt
> est à la racine ([`../README.md`](../README.md)).
