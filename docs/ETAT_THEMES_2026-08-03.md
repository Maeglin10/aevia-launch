# Les 373 thèmes — état mesuré au 2026-08-03

Document de reprise. Tout ce qui suit est mesuré, pas estimé : les compteurs de
code viennent d'une analyse des fichiers, les compteurs de rendu d'un parcours au
navigateur avec une vraie session.

## Comment mesurer, avant tout le reste

```bash
npm run build
(set -a; . ./.env.local; set +a; export SESSIONS_RATE_LIMIT=1000000; npx next start -p 3411)

node scripts/theme-audit.mjs impact-351          # un thème
AUDIT_INTERVAL_MS=0 node scripts/theme-audit.mjs $(ls app/templates | grep '^impact-')
node scripts/client-run.mjs "Santé" "Dentiste" "Cabinet Sourire" "Lyon"
```

**Ne jamais lancer `npm run build` pendant un balayage.** Le build remplace
`.next` sous le serveur qui tourne, et le balayage rapporte alors « aucune donnée
client » sur les 373 thèmes. Cette erreur a coûté quatre balayages et a bien
failli faire conclure que tout était cassé.

Le harnais distingue une page qui plante d'une page qui n'affiche rien : sans
cette distinction, l'erreur React #130 a été lue pendant des heures comme un
câblage manquant.

## Ce qui est fait

| bloc | thèmes qui l'affichent | qui lisent la donnée client | reste |
|---|---:|---:|---:|
| nom de l'entreprise | 373 | **373** | 0 |
| avis | 288 | 231 | 57 |
| prestations | 271 | 189 | 82 |
| chiffres clés | 158 | 112 | 46 |
| tarifs | 148 | 117 | 31 |
| FAQ | 73 | 64 | 9 |
| équipe | 49 | 34 | 15 |
| engagements | 45 | 22 | 23 |
| zones | 3 | 1 | 2 |

Par ailleurs : la ville est lue par 288 thèmes, l'adresse par 33, les photos par
223, et 368 thèmes sur 373 lisent le contrat.

**Zéro page plantée**, zéro débordement horizontal, aucune image chargée mais
jamais peinte.

## Ce qui reste, et pourquoi aucun codemod ne l'atteint

Les blocs restants ont leur contenu **écrit directement dans le JSX**, sans
constante nommée. Il n'y a pas de motif commun à exploiter : chaque thème a sa
structure, ses noms de champs et sa mise en forme. C'est du travail thème par
thème, avec du jugement à chaque fois.

La liste exacte est dans `/tmp/reste.json` au moment de l'écriture ; elle se
régénère avec le script d'audit.

## Les pièges rencontrés, pour ne pas les repayer

**Un test statique ne remplace pas un parcours client.** L'analyse disait
« 373/373 thèmes affichent le nom » — techniquement vrai. Sur cinq d'entre eux, le
nom s'affichait sur le bouton « Prendre RDV », parce que le codemod avait pris ce
libellé pour la marque. Seul le parcours réel, formulaire rempli et page
regardée, attrape ce genre d'erreur.

**Le manifeste sur-déclarait massivement.** Bâti sur les seuls noms de
constantes, il annonçait des sections que les thèmes n'ont pas. Le compteur
« engagements » a suivi cette trajectoire : 276 → 212 → 163 → 142 → 45. Chaque
resserrement a retiré une cause distincte — un vocabulaire absent, une phrase
trop courte, un mot sans limites de mots (`RGE` matchait dans d'autres mots),
puis une seule mention là où une section en aligne plusieurs. **La majorité des
défauts reprochés au catalogue n'ont jamais existé.**

**Trois vocabulaires pour deux idées.** `businessProfile.services` porte `name`,
`generatedContent.services` porte `title` ; les avis du client portent `author`,
ceux générés `name`, et neuf thèmes lisent `stars` là où tout le reste lit
`rating`. `lib/templates/clientContent.ts` est le seul endroit qui connaît les
trois, et il publie tous les alias exprès — c'est ce qui a rendu la conversion de
352 fichiers sûre.

**`resolveList` doit fusionner, pas remplacer.** Les lignes d'un thème portent une
icône, un identifiant, une couleur. Rendre le tableau du client tel quel laissait
`icon` indéfini et React refusait la page entière. La fusion ne s'applique qu'entre
objets : étaler une chaîne la transforme en objet indexé par caractère.

**Les hooks dans un `.map` tuent la page.** Leur nombre suit la longueur de la
liste, qui change quand la session arrive. Deux thèmes le faisaient ; chaque
élément a maintenant son composant.

**`use client` n'est pas toujours le premier caractère du fichier**, et un import
multiligne commence par une ligne qui ressemble à un import complet. Les deux ont
coûté un build.

**Un commentaire contenant quelque chose qui ressemble à une classe Tailwind** fait
émettre cette classe par le scanner, et Turbopack échoue ensuite à résoudre le
chemin qu'elle contient. Ne pas écrire d'exemple de classe dans un commentaire.

## Décisions de contenu, actées

- On n'invente rien. Les données du client passent devant ; la génération reste un
  repli, jamais une source.
- Aucune section n'est supprimée faute de données : le thème garde son exemple, et
  l'aperçu dit lesquelles.
- La ville n'est substituée que dans les positions de marque — après un séparateur,
  en fin d'adresse, dans un champ ville. **Jamais dans la prose** : « quinze ans
  entre Paris et Londres » raconte une histoire, y mettre Lyon produit une phrase
  fausse.
- Les caractéristiques que le wizard ne demande pas restent celles du thème :
  autonomie d'un avion, icône d'une certification, nombre de passagers.
