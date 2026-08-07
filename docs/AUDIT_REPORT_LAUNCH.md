# AUDIT_REPORT — Skylaunch (helper quasi-prêt pour vendre Inbox)

> Date : 2026-08-07. Mesuré sur le code + doc d'état navigateur `ETAT_THEMES_2026-08-05.md`.
> Rôle produit : **pas le produit vendu** — c'est le générateur de site qui sert à convertir les prospects sans site vers **Inbox**. Objectif : le finir, pas le relancer.
> Deploy : **aucun** tant que le fondateur ne dit pas « déploie ».

## Verdict en une ligne

Le **rendu est mûr et mesuré** (373/373 thèmes affichent tous leurs blocs, 0 plantage, 301/373 sans reste de démo) — c'est vendable. Mais **l'hygiène d'ingénierie est faible** : le système de types est de fait **désactivé**, et il n'y a quasi **aucun test**. Ça marche aujourd'hui ; ça casse en silence à la prochaine grosse modif.

## Scorecard prod-readiness (/10)

| Dimension | Note | Base mesurée |
|---|---|---|
| Qualité de rendu (le produit visible) | 8/10 | 373/373 blocs, 373/373 photos client, 352/373 couleur, **0 page plantée** (doc d'état). |
| Sûreté des types | 2/10 | `typescript.ignoreBuildErrors: true` **+ 5692 `any` + 516 `ts-ignore`** → le build passe même avec des erreurs de type. |
| Tests | 2/10 | **11 fichiers de test** pour ~toute l'app + 373 thèmes. Aucune régression visuelle automatisée. |
| Config / secrets | 4/10 | Pas de validation d'env. `reactCompiler:false` **OK** (footgun connu neutralisé). |
| Fiabilité images | 6/10 | 376 fichiers utilisent `logoBase64` en `<img>` **sans fallback** → logo vide si le client n'en fournit pas. Photos de banque OK à l'écran (doc d'état). |
| **Global** | **4,4/10** | Vitrine produit solide posée sur des fondations fragiles. |

## Findings priorisés

### P0

1. **Le typage est désactivé en pratique.** `next.config.ts:13 → typescript: { ignoreBuildErrors: true }`. Combiné à **5692 `any`** et **516 `@ts-ignore`**, une régression de type ne bloque jamais le build. Pour un « niveau grande boîte », c'est le trou n°1.
   - **Fix (progressif, ne rien casser)** : garder `ignoreBuildErrors:true` le temps de faire baisser les erreurs, mais ajouter un job `tsc --noEmit` **non bloquant qui compte** les erreurs et alerte si ça monte ; puis attaquer les `any` des zones chaudes (wizard, câblage des thèmes, adapters de données client), puis basculer `ignoreBuildErrors:false`.

### P1

2. **Quasi pas de tests (11).** Un produit à 373 thèmes sans filet. Ajouter : (a) un **smoke test de rendu** qui monte chaque thème avec une entreprise factice et vérifie « aucun throw + blocs déclarés présents » (automatise ce que la doc d'état fait à la main) ; (b) tests du wizard (archétypes → overrides).
3. **`logoBase64` sans fallback (376 fichiers).** Si le client ne fournit pas de logo, `<img src="">` → placeholder cassé. **Fix** : composant `<Logo>` partagé qui rend le nom de l'entreprise en toutes lettres quand `logoBase64` est vide (`??` ne rattrape pas `""` — tester la chaîne vide). Codemod prudent, thème par thème, ou point d'injection unique si le logo passe par un composant commun.

### P2

4. Pas de validation d'env au boot (mêmes clés que le reste de la suite).
5. Nettoyage racine/doc « présent vs passé » : archiver les docs d'état antérieurs au 2026-08-05, garder un seul `ETAT_THEMES` courant + un `CHANGELOG`.

## Ce qui est déjà bon (ne pas retoucher)

- Rendu mesuré au navigateur (373/373, 0 plantage) — ne pas « re-designer », c'est fini par dessein.
- `reactCompiler:false` — neutralise le bug connu (sous-composants sans props mémoïsés lisant `bp` module → données de démo en prod).
- Personnalisation par thème (clientText, sectionOverrides, archétypes) documentée et mesurée.

## Prochaines actions (ordre)

1. Composant `<Logo>` avec fallback nom d'entreprise (chaîne vide gérée) → codemod thème par thème.
2. Smoke test de rendu par thème (fige la garantie « 373/373, 0 throw »).
3. Job `tsc --noEmit` compteur d'erreurs (non bloquant) → baisser les `any` zones chaudes → `ignoreBuildErrors:false`.
4. Validation d'env + nettoyage doc racine.
