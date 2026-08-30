/* Deux cartes, une seule clé.

   Quand le client n'a pas encore d'avis, le contrat rend une liste dont
   toutes les entrées portent le même auteur : « Avis à venir ». Les thèmes
   qui clavent sur cet auteur donnent alors la même clé à plusieurs enfants —
   c'est l'« issue » que Next affiche, et React peut y perdre l'identité des
   cartes entre deux rendus.

   Le champ n'est pas une identité : deux prestations peuvent porter le même
   titre, deux avis le même auteur. L'index, lui, est unique et stable pour
   ces listes qui ne sont ni triées ni filtrées à l'écran. On ne touche
   qu'aux expressions où l'index est DÉJÀ dans la portée — celles écrites
   « key={x.champ ?? idx} ». */
import fs from "node:fs";
import path from "node:path";

const motif = /key=\{([a-zA-Z_]\w*)\.(auteur|author|name|nom|label|titre|title|text|q|a)\s*\?\?\s*(idx|i|index)\}/g;
/* La forme NUE — « key={s.label} » — quand l'index est déjà utilisé sur la
   même ligne : « <Reveal key={s.label} delay={idx * 0.08}> ». On ne devine
   rien, la variable est là, sous les yeux. */
const motifNu = /key=\{([a-zA-Z_]\w*)\.(auteur|author|name|nom|label|titre|title|text|q|a)\}/;
let total = 0;
const fichiers = [];

function parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) parcourir(p);
    else if (e.name.endsWith(".tsx")) {
      const src = fs.readFileSync(p, "utf8");
      let sortie = src.replace(motif, (_t, _v, _c, i) => `key={${i}}`);
      let nNu = 0;
      sortie = sortie.split("\n").map((l) => {
        if (!motifNu.test(l)) return l;
        const idx = /\b(idx|index)\b/.exec(l);
        if (!idx) return l;
        nNu++;
        return l.replace(motifNu, `key={${idx[1]}}`);
      }).join("\n");
      if (sortie !== src) {
        const n = (src.match(motif) ?? []).length + nNu;
        fs.writeFileSync(p, sortie);
        total += n; fichiers.push(`${path.relative("app/templates", p)} (${n})`);
      }
    }
  }
}
parcourir("app/templates");
fichiers.forEach((f) => console.log(f));
console.log(`\n${total} clés corrigées dans ${fichiers.length} fichiers`);
