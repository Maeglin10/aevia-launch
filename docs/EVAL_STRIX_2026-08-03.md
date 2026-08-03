# Strix — évaluation pour le test de notre cybersécurité

Verdict : **à adopter, bloqué sur une clé LLM payante.** L'outil est installé et
fonctionne ; il ne peut simplement pas travailler avec les clés dont nous
disposons aujourd'hui.

## Ce que c'est

`usestrix/strix` — 46 700 étoiles, Apache-2.0, écrit en Python, dernière mise à
jour le jour de l'évaluation. Des agents autonomes qui cherchent des failles dans
une cible et proposent le correctif. La cible peut être un dossier local, un
dépôt, une URL, un domaine ou une IP.

Le dépôt est explicite sur le cadre : *« Only test apps you own or have
permission to test. »* Nos propres applications et notre propre infrastructure
entrent dans ce cadre.

## Installation, faite

```bash
curl -sSL https://strix.ai/install | bash     # pose ~/.strix/bin/strix
strix --version                               # 1.4.1
```

Prérequis : Docker en marche (le premier lancement tire une image bac à sable) et
une clé LLM. Le binaire est autonome, rien à installer côté Python.

Options utiles :

| option | à quoi ça sert |
|---|---|
| `-n` | mode non interactif, sans interface, sort en fin de course |
| `-m quick\|standard\|deep` | profondeur du test |
| `--max-budget USD` | plafond de dépense, indispensable |
| `--scope-mode diff --diff-base` | ne tester que ce qui a changé |
| `--mount` | monter un gros dépôt en lecture seule au lieu de le copier |

Les résultats sont écrits dans `strix_runs/<nom>/` : `findings.sarif`,
`run.json`, `strix.log`. Le format SARIF s'ouvre dans GitHub Code Scanning sans
conversion.

## Ce qui bloque, mesuré

| clé | état |
|---|---|
| `ANTHROPIC_API_KEY` (skybot-inbox) | *« Your credit balance is too low »* — crédit épuisé |
| `GEMINI_API_KEY` (skybot-inbox) | palier gratuit : **20 requêtes par jour** pour gemini-2.5-flash |
| skylaunch | aucune clé LLM dans `.env.local` |

Le test lancé sur `~/skylaunch/app/api` s'est arrêté sur un 429 après avoir
consommé 142 000 jetons pour 0,04 $ — le quota gratuit du jour y est passé en
moins d'une minute. Un balayage sérieux demande plusieurs centaines d'appels.

Strix signale par ailleurs que gemini-2.5-flash fait partie des modèles faibles
pour cet usage et recommande, parmi d'autres, `anthropic/claude-sonnet-4-6`,
`gemini/gemini-3.6-flash` ou `deepseek/deepseek-v4-pro`.

## Ce que ça coûterait

Le plafond `--max-budget` rend la dépense prévisible. Un ordre de grandeur
raisonnable pour commencer : 5 à 10 $ par balayage complet sur un modèle correct,
et bien moins en `--scope-mode diff` sur les seuls fichiers changés.

## Recommandation

1. Recharger le crédit Anthropic, ou passer la clé Gemini en facturation — c'est
   le seul obstacle.
2. Premier balayage sur `skybot-inbox/src` (le backend NestJS multi-tenant, où
   une fuite entre comptes coûterait le plus cher), en `-m standard`,
   `--max-budget 10`.
3. Puis `skylaunch/app/api`, où vivent les routes non authentifiées du tunnel :
   `/api/sessions`, `/api/upload`, `/api/generate`.
4. Ensuite, en régime : `--scope-mode diff` sur chaque branche avant fusion, avec
   un petit plafond. C'est là que le rapport qualité-prix est le meilleur.

Ne pas viser la production tant qu'un balayage local n'a pas tourné : les agents
sont autonomes et un test contre une URL vivante est un test d'intrusion réel.
