# Ce qu'il reste à faire sur les thèmes — 2026-08-03

Suite de `ETAT_THEMES_2026-08-03.md`, qui décrit l'état atteint et la méthode.
Ce document-ci ne liste que le travail restant, dans l'ordre où il rapporte.

## Avant de toucher quoi que ce soit

```bash
npm run build
(set -a; . ./.env.local; set +a; export SESSIONS_RATE_LIMIT=1000000; npx next start -p 3411)
```

**Redémarrer le serveur avant chaque balayage** (les sessions vivent en mémoire ;
au bout d'une dizaine de passes il tombe de 5 s à 60 s par thème) et **ne jamais
builder pendant une mesure** (le build remplace `.next` sous le serveur et le
balayage rapporte alors « aucune donnée » sur les 373).

---

## 1 · Les blocs dont le contenu est écrit dans le JSX

C'est le fond du sujet. Ces sections n'ont pas de constante nommée : le contenu
est écrit directement dans le rendu, avec une structure propre à chaque thème.
Aucun codemod ne les atteint — les cinq déjà écrits ont épuisé ce qui était
mécanisable.

| bloc | thèmes concernés |
|---|---:|
| prestations | 82 |
| avis | 57 |
| chiffres clés | 46 |
| tarifs | 31 |
| engagements | 23 |
| équipe | 15 |
| FAQ | 9 |
| zones | 2 |

**142 thèmes distincts, dont 62 n'ont qu'un seul bloc à traiter.** Commencer par
ceux-là : une passe rapide y ferme un thème entier.

Les huit thèmes les plus chargés, à garder pour la fin : impact-18 et impact-40
(5 blocs), impact-27, 54, 58, 59, 102, 120 (4 blocs).

Les listes complètes se régénèrent :

```bash
node -e '…' # voir scripts/theme-audit.mjs, ou refaire le croisement
             # capabilities.ts × présence de clientX( dans chaque fichier
```

### La méthode, pour chaque thème

1. Ouvrir le fichier, trouver la section concernée dans le JSX.
2. Extraire son contenu dans une constante `X_SOURCE` au niveau du module.
3. Déclarer `let X = X_SOURCE;` juste après.
4. Dans le corps du composant, après `fd = session?.formData;` :
   `X = resolveList(clientX(session)?.map(…), X_SOURCE);`
5. Remplacer le contenu en dur du JSX par `X.map(…)`.
6. Vérifier : `node scripts/theme-audit.mjs impact-NNN`.

Le repli reste toujours la donnée du thème : une section n'est jamais vidée.

---

## 2 · Les coordonnées encore en dur

- **170 numéros de téléphone** et **282 adresses e-mail** ne sont pas repliés
  derrière `fd?.phone` / `fd?.email`.
- Les positions sans ambiguïté (`href="tel:"`, `href="mailto:"`) sont déjà
  traitées : 104 liens. Le reste vit dans des chaînes et des constantes, à
  reprendre thème par thème.

C'est le défaut le plus coûteux commercialement : un client publie son site et y
affiche le numéro de quelqu'un d'autre, ce qu'il découvre au premier appel qu'il
ne reçoit pas.

---

## 3 · Les photos

223 thèmes lisent les photos du client. Le manifeste `photoSlots.ts` décrit 1367
emplacements sur 316 thèmes, et le wizard les demande un par un avec le libellé
du thème.

Restent les emplacements rangés dans des constantes que le codemod n'a pas
reconnues, et ceux des thèmes sans variable de module. À mesurer avant de
décider : `grep -c "clientPhotos\|photo(" app/templates/impact-NNN/page.tsx`.

---

## 4 · Ce qui n'est pas commencé

- **Strix** (test de cybersécurité) : installé et fonctionnel, bloqué sur une clé
  LLM financée. Crédit Anthropic épuisé, clé Gemini sur palier gratuit à 20
  requêtes par jour. Voir `docs/EVAL_STRIX_2026-08-03.md` pour l'ordre de
  balayage recommandé et les coûts.
- **`awesome-llm-apps`** : évaluation pour les agents, mise « à plus tard ».
- **Traduction du contenu de démonstration** : les libellés d'interface sont
  traduits (122 sur 66 thèmes), mais la prose de démonstration reste dans sa
  langue d'origine sur les thèmes anglophones. Elle est de toute façon remplacée
  dès que le client remplit la section — c'est donc le repli qui dépareille, pas
  le cas normal.

---

## 5 · Deux mesures à refaire après chaque lot

```bash
# état bloc par bloc sur les 373
AUDIT_INTERVAL_MS=0 node scripts/theme-audit.mjs $(ls app/templates | grep '^impact-')

# le parcours client, la seule mesure qui attrape les erreurs de placement
node scripts/client-run.mjs "Santé" "Dentiste" "Cabinet Sourire" "Lyon"
```

Le second est celui qui compte. L'analyse statique a dit « 373/373 thèmes
affichent le nom du client » alors que sur cinq d'entre eux il s'affichait sur le
bouton « Prendre RDV ». Seul le formulaire rempli et la page regardée l'ont vu.
