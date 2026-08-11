# Prompt — cinq thèmes premium sur des niches non couvertes

À copier dans une session Claude Code, à la racine de `~/skylaunch`. Un seul
projet, une seule session. L'analyse qui a produit cette liste est dans
`docs/NICHES_MANQUANTES_2026-08-01.md` — la lire d'abord.

---

```
Construis cinq nouveaux thèmes premium pour le catalogue skylaunch, sur cinq
niches qui n'ont aujourd'hui aucun thème.

## Ce qui est déjà fait — ne le refais pas

- 315 thèmes existent et sont bons : images vérifiées, aucun mot coupé, aucun
  débordement, CTA visible sans défiler. Tu n'as rien à réparer.
- 25 gestes d'animation existent, mesurés image par image sur 18 captures de
  Slider Revolution. Ils sont dans `lib/templates/hero-kit-2.tsx` et
  `lib/templates/hero-kit-3.tsx`, documentés dans `docs/CATALOGUE_GESTES.md`.
  **N'écris aucune nouvelle animation.** Tu assembles, tu n'inventes pas.
- Les trois chiffres qui font qu'un hero paraît cher, déjà calibrés dans le
  kit : transition 0,6–1,0 s (`T.single` = 0,7 / `T.group` = 1,0), temps
  d'arrêt 3 à 6 fois la transition (`DWELL.brisk` 3 s, `normal` 4,2 s,
  `slow` 5,6 s, jamais sous 2,5 s), décalage entre enfants 55 ms
  (`T.stagger`).

## Le travail

Cinq thèmes. Pour chacun : pars de la structure du thème donneur indiqué,
change le métier, et donne-lui **le geste indiqué et lui seul** comme
signature de hero.

| # | Niche | Donneur | Geste signature |
|---|---|---|---|
| 1 | Opticien | impact-03 (Maison Dorée) | `ArcSwap` |
| 2 | Cuisiniste / agencement sur mesure | impact-230 (Atelier Ébénisterie) | `ExpandFrame` |
| 3 | Pompes funèbres | impact-95 (Lumière Clinic) | `HeldSwap` + `DWELL.slow` |
| 4 | Serrurier / dépannage 24-7 | impact-236 (ÉlectroPro Modern) | `HardCutRebuild` |
| 5 | Pharmacie / parapharmacie | impact-30 (Smile Studio) | `MosaicPush` |

Si une niche te paraît mauvaise, remplace-la par : notaire, auto-école,
centre de formation Qualiopi, ou déménageur. Dis-le, ne le fais pas en
silence.

## Le piège principal

Dans la série précédente, 15 des 18 échantillons ont fini avec le même geste
(`BlurThrough`) parce que la documentation le présentait comme « le choix par
défaut ». Le résultat était uniforme et le client l'a vu immédiatement.

`BlurThrough` peut apparaître en accessoire. Il ne doit être la signature
d'aucun de ces cinq thèmes.

## Contenu

- Le métier doit être français et crédible : vrais actes, vrais tarifs
  plausibles, vraie ville, vraies mentions réglementaires du métier (un
  opticien affiche son statut, des pompes funèbres leur habilitation
  préfectorale, une pharmacie son inscription à l'Ordre).
- **Les templates de démonstration gardent le SIREN d'Aevia** (852 546 225) —
  c'est volontaire, c'est la protection anti-copie. Un site acheté portera
  l'identité du client, pas celle-là.
- Aucune URL contenant « sky » dans le texte visible.
- Aucune marque ou référence client inventée.

## Vérification — obligatoire, mesurée

Ne juge pas à l'œil. Une capture ne montre pas ce qui est rogné, et une image
peut répondre 200 en montrant un tout autre sujet.

N'utilise jamais `npm run dev` pour un balayage : le serveur de développement
meurt sous la charge. Toujours `npm run build && npx next start`, un seul
balayage à la fois.

Pour chacun des cinq, à 1440×900 **et** à 390×844 :

1. La page répond 200.
2. Chaque `<img>` a `naturalWidth > 0` après rendu et défilement.
3. **Ouvre chaque image et regarde-la.** Sur la série précédente, 11 des 18
   échantillons avaient une image au mauvais sujet, toutes en 200 : une Game
   Boy pour un bouquet de fleuriste, le Taj Mahal pour une abbaye, un tabouret
   pour un ébéniste. Le `curl` ne l'attrape pas.
4. Aucun mot d'un `h1`/`h2` plus large que sa boîte de ligne (une césure sur
   trait d'union est correcte).
5. Aucun débordement horizontal du `body`.
6. Un appel à l'action visible sans défiler.
7. Cibles tactiles ≥ 44 px.
8. Contraste texte/fond ≥ 4,5:1, mesuré sur les pixels composités.
9. `prefers-reduced-motion` : le kit le gère, vérifie qu'il n'est pas contourné.

Deux pièges connus du kit :

- **Collision Tailwind `relative`/`absolute`** : Tailwind émet `relative`
  après `absolute`, donc un composant qui code `relative` en dur et reçoit
  `absolute inset-0` devient une boîte de hauteur zéro. Mets la position en
  style inline.
- **Une rangée flex centrée ne centre l'écart que si les deux moitiés pèsent
  pareil.** Utilise `grid-template-columns: minmax(0,1fr) <objet> minmax(0,1fr)`.

## Livrables

- Les cinq pages sous `app/templates/impact-<id>/`.
- Les cinq entrées dans `lib/templates/registry.ts` **et** dans
  `lib/templates/registry-i18n.ts` (fr/en/es).
- Les niches ajoutées à `lib/templates/sectors.ts` si elles manquent à la
  taxonomie.
- `npx tsc --noEmit` : compare au nombre d'erreurs **avant** ton travail
  (ligne de base 1942 au 1er août 2026). Il ne doit pas augmenter.
- `npm run build` doit sortir en 0.
- Un commit par thème, avec la mesure avant/après dans le message.
- Un fichier `docs/THEMES_PREMIUM_<AAAA-MM-JJ>.md` : ce que tu as construit,
  ce que tu as mesuré, ce que tu n'as pas pu vérifier.

## Ce que je ne veux pas

- Un « probablement bon » présenté comme vérifié. Si tu n'as pas mesuré,
  écris-le.
- Le même geste sur plusieurs thèmes.
- Une nav dont un lien ne mène nulle part. Si une section manque, **crée-la** —
  ne retire jamais l'entrée de nav.
- Un déploiement. Le déploiement est manuel (`vercel --prod`) et se fait après
  relecture.
```

---

## Notes pour moi

- Prévoir une session dédiée : cinq thèmes complets + balayage de vérification,
  c'est long. Ne pas l'enchaîner avec un audit.
- La ligne de base `tsc` bouge quand d'autres branches sont mergées — la
  remesurer au début de la session plutôt que de faire confiance au 1942.
- Après validation : `vercel --prod` depuis `~/skylaunch`, puis curl de
  vérification. Pousser sur GitHub ne met rien en ligne.
