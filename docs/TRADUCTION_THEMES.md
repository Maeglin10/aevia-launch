# Traduction de la prose de démonstration — état

## Le problème

Deux pour cent du texte affiché sur les 373 thèmes reste en anglais. Ce n'est
plus du libellé — le lexique global de `app/templates/BrandColorVar.tsx` en porte
199 par langue — mais les paragraphes que chaque thème écrit en dur. Ils
disparaissent dès que le client remplit le bloc correspondant ; les traduire est
ce qui tient la page tant qu'il ne l'a pas fait.

## Le mécanisme

Chaque thème porte son dictionnaire : `app/templates/impact-XX/traductions.ts`.
`BrandColorVar` le charge dynamiquement d'après l'adresse, avec ce thème et avec
lui seul — 1 136 paragraphes en cinq langues dans un lexique global pèseraient
sur toutes les pages pour ne servir qu'à une.

## Reprendre le chantier

```bash
# ce qu'il reste, par thème
node -e 'const fs=require("fs");
 const t=JSON.parse(fs.readFileSync("docs/traduction-reste.json","utf8"));
 const faits=new Set(fs.readdirSync("app/templates").filter(d=>fs.existsSync(`app/templates/${d}/traductions.ts`)));
 const r=Object.entries(t).filter(([th])=>!faits.has(th)).sort((a,b)=>a[1].length-b[1].length);
 console.log(`reste ${r.length} thèmes · ${r.reduce((a,b)=>a+b[1].length,0)} phrases`);
 for (const [th,segs] of r.slice(0,5)) { console.log(`### ${th}`); segs.forEach(s=>console.log(`- ${s}`)); }'

# écrire un lot : { "impact-XX": { "phrase source": ["fr","es","de","pt"] } }
node scripts/ecrire-traductions.mjs /tmp/lot.json
```

Le script complète un fichier existant plutôt que de l'écraser : deux lots
peuvent traiter le même thème.

## Ce qui a été écarté à dessein

- **174 segments déjà français** — le détecteur comptait « design » comme anglais.
  « Motion design & habillage », « Design + Build intégré ».
- **Les noms propres et récompenses** — « The Wine Advocate », « Red Dot Design
  2022 » ne se traduisent pas.
- **9 segments portant la donnée du client** — le nom ou la ville y sont injectés
  par React avant tout passage ; aucune clé littérale ne peut les retrouver.
  Ceux-là demandent une écriture dans le thème lui-même.

## Vérifier

Après un lot, reconstruire puis :

```bash
SESSIONS_RATE_LIMIT=100000 npm run start
node scripts/verifier-marques.mjs impact-XX
```
