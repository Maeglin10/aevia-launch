# Audit documentation & conformité juridique — Aevia Launch (skylaunch)

> Date : 2026-08-10 · Audit **lecture seule**. Aucun code produit modifié, aucun doc
> réécrit ou supprimé — ce fichier est le seul écrit.
> Produit : **Aevia Launch**, générateur de sites clients (373 thèmes « impact-XX »
> via wizard). Rôle : le « quasi-prêt » qui sert à convertir les prospects sans site
> vers **Inbox**. Ce n'est pas le produit vendu à l'unité, c'est l'aimant à leads.
> Mesuré sur le code au 2026-08-10 (branche `main`), pas sur la mémoire.

---

## 0. Résumé exécutif

- **Documentation : ~57 % strictement périmée/remplacée, ~80 % archivable.** Sur 47
  fichiers `.md` suivis (hors `node_modules`, worktrees et fixtures), **3 seulement
  décrivent l'état courant** (`.claude/CLAUDE.md`, `docs/AUDIT_REPORT_LAUNCH.md`,
  `docs/ETAT_THEMES_2026-08-07.md`). Le reste est soit un journal de chantier daté
  (états ETAT_THEMES antérieurs, logs logo-rollout, audits juillet), soit une
  référence évergreen mal rangée. L'intuition « ~90 % obsolète » est fondée si on
  entend « ne reflète pas l'état actuel et n'est pas nécessaire pour la suite ».
- **Le README (public) ment sur le produit** : « 15+ premium templates » (réel :
  **373**), « Claude Haiku generates all copy » (réel : **Gemini 2.5 Flash + Groq**,
  et le contenu est surtout **plug-and-play**, l'IA n'est qu'un repli). À réécrire en
  priorité — dépôt public.
- **Conformité — le propre site Aevia est bon, les sites VENDUS ne le sont pas.**
  Le site Aevia a bandeau cookies + GA4 sous consentement + 4 pages légales. Mais les
  **sites livrés aux clients chargent Google Analytics sans consentement ni bannière**
  (asymétrie critique), n'ont **pas de page cookies dédiée**, et **pas de CGV pour les
  propres ventes d'Aevia** (site qui vend 399–1499 € + 20 €/mois).
- **XSS stocké (HIGH), aussi un risque juridique** : le contenu client (avis, labels,
  et l'identité légale générée) est injecté via `dangerouslySetInnerHTML` **sans
  aucune désinfection** (11 points dans les thèmes + `TemplateLegal` + `LegalDocPage`).
  Aevia livre à des clients payants un site vulnérable. La CSP garde
  `script-src 'unsafe-inline'` en prod → elle **ne bloque pas** l'injection.

---

## PARTIE 1 — Inventaire documentaire

### 1.1 Verdicts (par fichier)

Verdict : **CURRENT** (reflète l'état actuel) · **REFERENCE** (évergreen ou prompt
réutilisable, à garder) · **SUPERSEDED** (remplacé par plus récent) · **OBSOLETE**
(faux / périmé / listes que le doc lui-même dit de régénérer).

| Fichier | Dernier commit | Verdict | Raison |
|---|---|---|---|
| `README.md` | 2026-06-10 | **OBSOLETE** | Dépôt public. « 15+ templates » (réel 373), « Claude Haiku generates all copy » (réel Gemini 2.5 Flash + Groq, et plug-and-play). Faux sur le produit. À réécrire. |
| `AGENTS.md` | 2026-04-12 | REFERENCE | Règles agent Next.js (« lire les docs avant de coder »). Minime, à garder. |
| `CLAUDE.md` (racine) | 2026-04-12 | REFERENCE | Un `@AGENTS.md`. À garder. |
| `.claude/CLAUDE.md` | 2026-08-03 | **CURRENT** | Le vrai guide d'ingénierie : deploy manuel, 2 systèmes de thèmes, correctifs responsive globaux, protocole session, règles métier. Canonique. |
| `.claude/HISTORY.md` | 2026-08-01 | REFERENCE | Journal de session append-only (Fait/Comment/Pourquoi/Erreurs). Sert de changelog. |
| `AUDIT_POLISH_PROMPT.md` | 2026-08-07 | REFERENCE | Prompt d'audit Fable réutilisable (perms 600). À ranger dans `docs/prompts/`. |
| `WIZARD_DESIGN.local.md` | *(gitignored, non suivi)* | SUPERSEDED | Design doc du wizard business-aware ; **réalisé** (LegalStep + archétypes livrés, cf. ETAT 08-07). Fichier perso `.local`, laisser tel quel. |
| `docs/AUDIT_REPORT_LAUNCH.md` | 2026-08-07 | **CURRENT** | Dernier audit ingénierie. Score prod-readiness 4,4/10 ; recommande lui-même ce nettoyage doc (P2). À garder comme audit de référence. |
| `docs/ETAT_THEMES_2026-08-07.md` | 2026-08-09 | **CURRENT** | Dernier état mesuré des 373 thèmes. **Le seul ETAT_THEMES à garder.** |
| `docs/ETAT_THEMES_2026-08-06.md` | 2026-08-07 | SUPERSEDED | Remplacé par 08-07. |
| `docs/ETAT_THEMES_2026-08-05.md` | 2026-08-05 | SUPERSEDED | Remplacé par 08-07. |
| `docs/ETAT_THEMES_2026-08-04.md` | 2026-08-04 | SUPERSEDED | Remplacé par 08-07. |
| `docs/ETAT_THEMES_2026-08-03.md` | 2026-08-03 | SUPERSEDED | Remplacé par 08-07. |
| `docs/AUDIT_PRODUIT_2026-07-31.md` | 2026-08-01 | SUPERSEDED | Remplacé par `AUDIT_REPORT_LAUNCH` (08-07). |
| `docs/AUDIT_THEMES_2026-07-27.md` | 2026-07-27 | SUPERSEDED | Base 315 templates (pré-373) ; remplacé par la série ETAT_THEMES. |
| `docs/AUDIT_VENDABILITE_2026-07-30.md` | 2026-07-30 | SUPERSEDED | Base 315 ; planning héros premium, chantier fait. Historique. |
| `docs/audit-themes-responsive-2026-07-07.md` | 2026-07-07 | SUPERSEDED | Responsive désormais corrigé globalement dans `app/templates/layout.tsx`. |
| `docs/audit-themes-responsive-2026-07-07-fixes.md` | 2026-07-07 | SUPERSEDED | Suite du précédent, fait. |
| `docs/CHANTIERS_RESTANTS.md` | 2026-08-03 | OBSOLETE | Listes de câblage que le doc lui-même dit de régénérer ; largement réalisé (archétypes, coordonnées via passes BrandColorVar, cf. ETAT 08-07). |
| `docs/LISTES_THEMES_A_CABLER.md` | 2026-08-03 | OBSOLETE | Idem — « elles vieillissent dès qu'un thème est traité ». |
| `docs/PLAN_CONTRAT_CONTENU.md` | 2026-08-03 | REFERENCE | Explique l'architecture du « contrat de contenu » (thème ↔ wizard). Réalisé mais valeur explicative. À fusionner dans une doc architecture. |
| `docs/PERSONNALISATION_PAR_THEME.md` | 2026-08-05 | REFERENCE | Ce que le client peut changer, thème par thème (mesuré). Recoupe IA_OU_PLUG_AND_PLAY. À fusionner. |
| `docs/IA_OU_PLUG_AND_PLAY.md` | 2026-08-05 | **CURRENT**/REFERENCE | IA vs plug-and-play + coûts (Gemini 2.5 Flash, ~0,0054 $/site). Exact et utile. À garder (architecture). |
| `docs/CATALOGUE_GESTES.md` | 2026-07-31 | REFERENCE | Catalogue des 25 mécaniques d'animation premium. Référence design évergreen. |
| `docs/QA_VISUELLE_METHODE.md` | 2026-08-05 | REFERENCE | Méthodologie de QA (comment mesurer, comment se tromper). Évergreen. |
| `docs/QA_VISUELLE.md` | 2026-08-05 | SUPERSEDED | Campagne de captures ponctuelle ; état remplacé par ETAT 08-07 (méthode conservée dans QA_VISUELLE_METHODE). |
| `docs/NICHES_MANQUANTES_2026-08-01.md` | 2026-08-01 | SUPERSEDED | Base 315 ; niches depuis comblées (68 métiers, min 5 modèles — ETAT 08-07). |
| `docs/THEMES_NICHES_2026-08-01.md` | 2026-08-01 | SUPERSEDED | Journal de construction (impact-331→383), fait. |
| `docs/THEMES_PREMIUM_2026-08-01.md` | 2026-08-01 | SUPERSEDED | Journal de construction (impact-326→330), fait. |
| `docs/PLAN_HEROS_PREMIUM.md` | 2026-07-31 | SUPERSEDED | Plan d'exécution héros ; chantier fait. |
| `docs/HEROS_ETAT_2026-07-27.md` | 2026-07-27 | SUPERSEDED | Doc de passation héros, remplacé par l'état courant. |
| `docs/ANTIGRAVITY_PROMPTS.md` | 2026-06-30 | OBSOLETE | Prompts batch de juin, épuisés. |
| `docs/PROMPT_ANTIGRAVITY_VISUEL.md` | 2026-08-03 | REFERENCE | Prompt réutilisable (tâches visuelles). À ranger dans `docs/prompts/`. |
| `docs/PROMPT_AUDIT_PRODUIT.md` | 2026-07-31 | REFERENCE | Prompt d'audit réutilisable. `docs/prompts/`. |
| `docs/PROMPT_TEST_THEMES_LOCAL.md` | 2026-08-02 | REFERENCE | Prompt de test local + faits utiles (tunnel réel). `docs/prompts/`. |
| `docs/PROMPT_THEMES_PREMIUM.md` | 2026-08-01 | SUPERSEDED | Prompt one-shot, exécuté (a produit THEMES_PREMIUM_2026-08-01). |
| `docs/SLIDER_REVOLUTION_TEARDOWN.md` | 2026-07-27 | REFERENCE | Teardown de recherche (animations). Référence. |
| `docs/SLIDER_REVOLUTION_TEARDOWN_2.md` | 2026-07-30 | REFERENCE | 2e teardown (enregistrements écran). Référence. |
| `docs/CLIENT_DEPLOYMENT_OPTIONS.md` | 2026-06-10 | REFERENCE (à revoir) | Options de déploiement des sites clients ; à revérifier vs pipeline actuel. |
| `docs/E2E_PIPELINE_STATUS.md` | 2026-06-10 | OBSOLETE | Statut de juin (test Maison Maria) ; remplacé. |
| `docs/STRIPE_WEBHOOK_SETUP.md` | 2026-06-10 | REFERENCE | Guide de setup webhook Stripe, évergreen ops. |
| `docs/EVAL_STRIX_2026-08-03.md` | 2026-08-03 | REFERENCE | Éval de l'outil de test sécu (Strix) ; encore en attente d'une clé LLM. À garder. |
| `docs/logo-rollout-01-99.md` | 2026-07-07 | SUPERSEDED | Log de chantier logo (append-only), fait. |
| `docs/logo-rollout-batch-a.md` | 2026-07-07 | SUPERSEDED | Idem. |
| `docs/logo-rollout-batch-b.md` | 2026-07-07 | SUPERSEDED | Idem. |
| `docs/logo-rollout-batch-c.md` | 2026-07-07 | SUPERSEDED | Idem. |
| `docs/logo-rollout-batch-d.md` | 2026-07-07 | SUPERSEDED | Idem. |
| `docs/plans/2026-07-23-wizard-business-aware-redesign.md` | 2026-07-24 | SUPERSEDED | Plan d'implémentation du wizard business-aware ; **livré** (LegalStep + archétypes). |
| `content/maison-maria/ebook.md` | 2026-07-22 | REFERENCE (fixture) | Contenu du client de démo, pas un doc. Laisser. |

**Note worktree** : `.worktrees/wizard-business-aware/` contient des copies (AGENTS,
README, docs/…) d'un ancien arbre de travail. Non comptées ici ; à supprimer avec
`git worktree remove` quand la branche est fusionnée/abandonnée (hors périmètre de cet
audit — le fondateur travaille en parallèle).

### 1.2 Décompte

- **47** fichiers doc suivis (hors worktrees, `node_modules`, fixture ebook).
- **CURRENT : 3** · REFERENCE : **17** · SUPERSEDED : **22** · OBSOLETE : **5**.
- Strictement périmé/remplacé (SUPERSEDED+OBSOLETE) = **27/47 ≈ 57 %**.
- Journaux de chantier ponctuels archivables (tous les datés + logs + audits juillet +
  plans réalisés) ≈ **35–38/47 ≈ 75–80 %**.

### 1.3 États datés — lequel est canonique

Série `ETAT_THEMES_*` = clichés ponctuels. **Canonique = `ETAT_THEMES_2026-08-07.md`**
(le plus récent, 0 plantage sur 373 avec profil client complet, archétypes alignés).
Les `08-03/04/05/06` sont **SUPERSEDED** → à archiver. Même logique pour la famille
audit : `AUDIT_REPORT_LAUNCH.md` (08-07) remplace `AUDIT_PRODUIT_2026-07-31` et
`AUDIT_THEMES_2026-07-27`.

---

## PARTIE 2 — Structure documentaire propre recommandée

Objectif fondateur : **UNE doc générale concise + un glossaire**, un seul ETAT_THEMES
courant, le reste archivé. Proposition (à exécuter par le fondateur, hors périmètre) :

```
skylaunch/
  README.md                    ← RÉÉCRIRE (public) : ce que c'est, stack réelle
                                  (Next 16/React 19/Gemini+Groq), 373 thèmes, run,
                                  deploy manuel Vercel, rôle « aimant à leads Inbox ».
  docs/
    OVERVIEW.md                ← LA doc générale : rôle produit · architecture
                                  (2 systèmes de thèmes, contrat de contenu,
                                  IA-vs-plug-and-play) · tarifs canoniques
                                  (399/599/899/1499 € + 20 €/mois) · état juridique ·
                                  résumé d'état + liens vers le reste.
    GLOSSARY.md                ← impact-XX vs thème sémantique, « contrat »,
                                  archétype, clientX(), passes BrandColorVar,
                                  session Blob, plug-and-play, « quasi-prêt », etc.
    ETAT_THEMES.md             ← LE seul état courant (= contenu de 2026-08-07,
                                  daté en tête). On met à jour ce fichier, on n'en
                                  crée plus un par jour.
    AUDIT.md                   ← audit ingénierie courant (= AUDIT_REPORT_LAUNCH).
    reference/
      ARCHITECTURE_CONTENU.md  ← fusion PLAN_CONTRAT_CONTENU + PERSONNALISATION_PAR_THEME
                                  + IA_OU_PLUG_AND_PLAY.
      CATALOGUE_GESTES.md
      QA_METHODE.md            ← QA_VISUELLE_METHODE.
      DEPLOIEMENT_CLIENT.md    ← CLIENT_DEPLOYMENT_OPTIONS (revérifié).
      STRIPE_WEBHOOK.md · EVAL_STRIX.md · teardowns/ (slider ×2).
    prompts/                   ← AUDIT_POLISH_PROMPT, PROMPT_AUDIT_PRODUIT,
                                  PROMPT_TEST_THEMES_LOCAL, PROMPT_ANTIGRAVITY_VISUEL.
    archive/                   ← tous les datés/chantier : ETAT_THEMES 03→06,
                                  AUDIT_PRODUIT/THEMES/VENDABILITE, NICHES/THEMES_*,
                                  PLAN/HEROS_*, logo-rollout-*, audit-responsive-*,
                                  E2E_PIPELINE_STATUS, ANTIGRAVITY_PROMPTS,
                                  CHANTIERS_RESTANTS, LISTES_THEMES_A_CABLER, QA_VISUELLE,
                                  plans/2026-07-23-*.
```

Règle simple pour la suite : **un seul fichier « état » et un seul « audit »**, mis à
jour en place ; tout instantané daté part directement dans `archive/`.

---

## PARTIE 3 — État juridique & conformité

Deux couches : **(a)** le juridique propre d'Aevia Launch, **(b)** les pages légales
des **sites générés pour les clients**.

### 3.a — Juridique propre d'Aevia Launch

**Entité** (constante dans `components/LegalIdentity.tsx`) : **Aevia WS**, entrepreneur
individuel (auto-entrepreneur), **SIREN 852 546 225**, RCS Bourg-en-Bresse, directeur
de publication Valentin Milliand, contact `valentinmilliand@aevia.services`, **TVA non
applicable (art. 293 B CGI)**, hébergeur **Vercel**. Adresse du siège **non imprimée**
(« communiquée sur demande »).

**Présent et correct** :
- `app/legal/mentions-legales`, `app/legal/cgu`, `app/legal/confidentialite`,
  `app/legal/cookies` (politique de cookies datée, réf. ePrivacy + CNIL).
- **Consentement cookies fonctionnel** : `components/CookieBanner.tsx` (accepter /
  refuser / personnaliser, 5 langues) monté dans `app/layout.tsx`, et
  `components/ConsentAwareAnalytics.tsx` **ne charge GA4 que si `analytics === true`**.
  → Le propre site Aevia est **conforme**.

**Manques (à ajouter/corriger)** :
1. **Pas de CGV pour les propres ventes d'Aevia.** Le site vend des prestations à prix
   affiché (399 / 599 / 899 / 1499 € en paiement unique **+ 20 €/mois** hébergement &
   maintenance) via Stripe. Un vendeur en ligne (B2C surtout) **doit** des CGV avec les
   mentions précontractuelles obligatoires : prix, **droit de rétractation** (ou son
   exclusion pour un site sur-mesure — art. L221-28 Code conso), délais de livraison,
   réclamations, **médiateur de la consommation**. Il existe `/maison-maria/legal/cgv`
   (démo client) mais **aucun `/legal/cgv` pour Aevia**. → **Manque #1.**
2. **Abonnement 20 €/mois = contrat à reconduction** : conditions de résiliation et de
   reconduction doivent figurer explicitement (loi Chatel / résiliation en 3 clics).
3. **Registre des sous-traitants / transferts hors UE** : la politique de
   confidentialité doit **nommer** les processeurs de données et signaler les
   transferts US : **Stripe** (paiement), **Vercel** (hébergement + Blob sessions),
   **Google Analytics 4**, **Anthropic / Google Gemini / Groq** (génération de contenu
   à partir du brief client), banques d'images (**Unsplash, Pexels, Pixabay, Picsum**).
   Mentionner le cadre de transfert (SCC / Data Privacy Framework).
4. **Adresse siège masquée** : acceptable pour un auto-entrepreneur (domicile) tant que
   le RCS et un contact sont fournis — c'est le cas. Zone grise mais tolérable.

### 3.b — Sites générés pour les clients

**Ce qui existe** : `lib/legal/generateLegalPages.ts` fabrique par gabarit, **sans appel
IA**, quatre documents à partir des données du wizard (`components/wizard/steps/LegalStep.tsx`
capture SIRET, forme juridique, adresse, capital) :
`mentionsLegales`, `cgv` (variable **par archétype de métier** via
`lib/legal/legalArchetypes.ts`), `confidentialite` (RGPD, droits, CNIL), `cgu`. Rendus
par `app/templates/_shared/TemplateLegal.tsx`. Couverture des pages requises **globalement
bonne**.

**Manques (à corriger — ce sont les sites qu'Aevia VEND)** :
1. **⚠️ Analytics client SANS consentement (violation ePrivacy/CNIL).**
   `app/templates/TemplateAnalytics.tsx` charge GA4 dès que `formData.ga4Id` est présent
   (`gtag('config', ga4Id, {anonymize_ip:true})`), monté inconditionnellement dans
   `app/templates/layout.tsx`. **Il n'y a AUCUN bandeau cookies sur les sites livrés** —
   `CookieBanner` n'est que dans `app/layout.tsx` (site Aevia), pas dans le layout des
   templates. Résultat : tout site client avec GA4 dépose des cookies de mesure **avant
   consentement**. `anonymize_ip` ne dispense pas du consentement pour GA4 en France.
   **Asymétrie centrale : le site d'Aevia est conforme, les sites vendus ne le sont pas.**
   Fix : passer `TemplateAnalytics` derrière un consentement (bannière embarquée dans le
   layout des templates, ou analytics désactivé par défaut jusqu'à opt-in).
2. **Pas de page « Politique de cookies » dédiée** sur les sites clients : les cookies ne
   sont qu'un paragraphe (§5) des mentions légales. Un site avec GA4 exige une politique
   cookies + bannière.
3. **XSS stocké (HIGH) — sécurité ET responsabilité.** Le contenu fourni par le client
   est injecté brut via `dangerouslySetInnerHTML`, **sans échappement** :
   - **Thèmes (11 points mesurés)** : ex. `app/templates/impact-291/page.tsx` (`t.quote`,
     `t.name`, `t.role` — issus des avis clients `r.text`/`r.author` de `formData`),
     `impact-201` (`s.label`, `info.label`, `info.val`), `impact-274` (`item.label`),
     `impact-280` (`item`, `desc`), `impact-288` (`t.text`, `t.name`).
   - **Pages légales** : `generateLegalPages.ts` interpole `businessName`, `email`,
     `companyAddress`, `siret` dans des chaînes HTML rendues par `TemplateLegal.tsx:93`
     (`dangerouslySetInnerHTML`) et `components/legal/LegalDocPage.tsx:81`.
   Une saisie malveillante (ou une apostrophe/`<` maladroite) persiste dans la session
   Blob et s'exécute sur le site livré. La CSP garde **`script-src 'unsafe-inline'` en
   prod** → elle **ne mitige pas** l'injection de gestionnaires inline. Fix : échapper
   (ou rendre en nœud texte — la plupart de ces champs n'ont pas besoin de HTML) tout
   texte dérivé du client, et échapper les champs d'identité dans `generateLegalPages`.
4. **Identité légale = correcte seulement si le client remplit `LegalStep`.** Si SIRET /
   adresse sont vides, les mentions légales n'affichent que le nom (repli propre
   « disponibles sur demande »). Or un site pro français doit afficher SIRET, forme
   juridique, RCS/RM. → Rendre l'identité légale **de fait obligatoire** avant mise en
   ligne d'un site professionnel.
5. **Hébergeur codé en dur = Vercel** dans les mentions générées : exact aujourd'hui
   (tout est déployé sur Vercel), faux si un client s'héberge ailleurs. Mineur.
6. **Politique de confidentialité générée incohérente avec le tracking réel** : elle
   parle du RGPD en général mais **ne nomme pas Google Analytics** ni la bannière/cookie,
   alors que le site charge GA4. À aligner avec le correctif #1.

### 3.c — Processeurs de données (récapitulatif)

| Processeur | Rôle | Où | Transfert |
|---|---|---|---|
| Stripe | Paiement | Checkout Aevia | US (DPF/SCC) |
| Vercel | Hébergement + Blob (sessions wizard) | Aevia + sites clients | US |
| Google Analytics 4 | Mesure d'audience | Aevia (consenti) + sites clients (**non consenti**) | US |
| Anthropic / Google Gemini / Groq | Génération de contenu (repli) | `/api/generate` | US |
| Unsplash / Pexels / Pixabay / Picsum | Images | Thèmes | US/UE |

À déclarer dans la politique de confidentialité (propre) et à répercuter dans la
politique générée (client).

---

## Annexe — Chiffres mesurés (2026-08-10, branche `main`)

- Thèmes : **373** dossiers `impact-*` (README dit « 15+ » → faux).
- Génération : **Gemini 2.5 Flash + Groq** en secours, `generateMockContent` en dernier
  repli (README dit « Claude Haiku » → faux). Contenu surtout **plug-and-play** ; IA =
  repli + métadonnées SEO. ~0,0054 $/site.
- Sûreté des types **de fait désactivée** : `next.config.ts` → `typescript.ignoreBuildErrors:true`,
  **~6 400 `any`**, **481 `@ts-nocheck`** + **35 `@ts-ignore`** (= **516** suppressions).
- Tests : **11** fichiers pour toute l'app + 373 thèmes.
- Rendu : **373/373, 0 plantage** (mesuré, ETAT 08-07) — solide, ne pas re-designer.
- `reactCompiler:false` = **délibéré** (neutralise le bug des sous-composants mémoïsés
  lisant `bp` module → données de démo en prod).
- Points `dangerouslySetInnerHTML` sur contenu client (thèmes) : **11** + `TemplateLegal`
  + `LegalDocPage` + `generateLegalPages`.
