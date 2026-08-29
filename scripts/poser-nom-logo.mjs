/* Le nom de la démonstration dans le logo de la barre.

   Beaucoup de thèmes écrivent, dans la branche « le client n'a pas fourni de
   logo », le nom du modèle en texte nu :

       {fd?.logoBase64 ? ( <img … /> ) : ( <> <span style={dot} /> Cabinet Soler </> )}

   Le client a donné son nom, la barre affiche celui d'un autre — à l'endroit
   le plus visible de la page. On remplace la ligne de texte nu par le nom du
   client, en gardant le nom du modèle en repli. Ancré sur les lignes de la
   branche, jamais sur un motif large. */
import fs from "node:fs";

const themes = process.argv.slice(2);
const rapport = [];

for (const t of themes) {
  for (const nom of ["page.tsx", "layout.tsx"]) {
    const f = `app/templates/${t}/${nom}`;
    if (!fs.existsSync(f)) continue;
    const L = fs.readFileSync(f, "utf8").split("\n");

    const iTernaire = L.findIndex((l) => /\{fd\?\.logoBase64 \? \(/.test(l));
    if (iTernaire < 0) continue;
    const iSinon = L.findIndex((l, k) => k > iTernaire && /^\s*\) : \(\s*$/.test(l));
    if (iSinon < 0) { rapport.push([f, "PAS DE BRANCHE SINON"]); continue; }
    const iFin = L.findIndex((l, k) => k > iSinon && /^\s*\)\}\s*$/.test(l));
    if (iFin < 0 || iFin - iSinon > 14) { rapport.push([f, "BRANCHE TROP LONGUE"]); continue; }

    /* la ligne de texte nu : ni balise, ni expression */
    let iTexte = -1;
    for (let k = iSinon + 1; k < iFin; k++) {
      const s = L[k].trim();
      if (!s || s.startsWith("<") || s.startsWith("{") || s.startsWith("//")) continue;
      if (/[<>{}]/.test(s)) continue;
      iTexte = k; break;
    }
    if (iTexte < 0) { rapport.push([f, "PAS DE TEXTE NU"]); continue; }

    const indent = (L[iTexte].match(/^(\s*)/) ?? ["", "  "])[1];
    const litteral = L[iTexte].trim().replace(/&nbsp;/g, " ").replace(/"/g, '\\"');
    const s = /\b__layoutSession\b/.test(L.join("\n")) ? "__layoutSession" : "sessionData";

    L[iTexte] = `${indent}{/* Le nom du modèle était écrit ici en texte nu : la barre du haut\n` +
                `${indent}    portait « ${litteral} » sur le site de n'importe quel client. */}\n` +
                `${indent}{clientName(${s}) ?? "${litteral}"}`;

    let src = L.join("\n");
    const tete = src.split('} from "@/lib/templates/clientContent";')[0] ?? "";
    if (!/\bclientName\b/.test(tete)) {
      const im = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
      if (!im) { rapport.push([f, "PAS D'IMPORT clientContent"]); continue; }
      const noms = [...new Set([...im[1].split(",").map((x) => x.trim()).filter(Boolean), "clientName"])].sort();
      src = src.replace(im[0], `import {\n  ${noms.join(",\n  ")},\n} from "@/lib/templates/clientContent";`);
    }
    fs.writeFileSync(f, src);
    rapport.push([f, `câblé · « ${litteral} »`]);
  }
}
for (const [f, m] of rapport) console.log(`${f} : ${m}`);
console.log(`\n${rapport.filter(([, m]) => m.startsWith("câblé")).length} logos câblés · ${rapport.filter(([, m]) => !m.startsWith("câblé")).length} à traiter à la main`);
