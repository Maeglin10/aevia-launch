/* Le logo composé : icône + une ou deux portées de texte.

   On ne démonte pas la composition du modèle — on ajoute une branche AVANT
   elle : si le client a un nom, la barre porte son nom, dans le style du
   premier libellé du logo ; sinon la composition d'origine revient à
   l'identique.

       {fd?.logoBase64 ? ( <img … /> )
         : clientName(s) ? ( <span …>{clientName(s)}</span> )
         : ( <> …le modèle… </> )}
*/
import fs from "node:fs";

const rapport = [];
for (const t of process.argv.slice(2)) {
  const f = `app/templates/${t}/page.tsx`;
  if (!fs.existsSync(f)) { rapport.push([t, "PAS DE page.tsx"]); continue; }
  const L = fs.readFileSync(f, "utf8").split("\n");

  const iTernaire = L.findIndex((l) => /\{fd\?\.logoBase64 \? \(/.test(l));
  if (iTernaire < 0) { rapport.push([t, "PAS DE BRANCHE LOGO"]); continue; }
  const iSinon = L.findIndex((l, k) => k > iTernaire && /^\s*\) : \(\s*$/.test(l));
  if (iSinon < 0) { rapport.push([t, "PAS DE BRANCHE SINON"]); continue; }
  if (L.slice(iTernaire, iSinon).join("\n").includes("clientName")) { rapport.push([t, "déjà câblé"]); continue; }

  /* la première balise ouvrante de texte dans la branche du modèle */
  const fenetre = L.slice(iSinon + 1, Math.min(iSinon + 40, L.length)).join("\n");
  const m = /<span\b[^>]*?>/s.exec(fenetre);
  if (!m) { rapport.push([t, "PAS DE <span> DANS LA BRANCHE"]); continue; }
  const balise = m[0].replace(/\s+/g, " ").trim();

  const indent = (L[iSinon].match(/^(\s*)/) ?? ["", "  "])[1];
  const s = "sessionData";
  /* Le commentaire va AVANT le ternaire, jamais dans une de ses branches :
     une branche doit être UNE expression, et « {/* … *\/} <span> » en fait
     deux, ce qui casse le fichier. */
  const indentT = (L[iTernaire].match(/^(\s*)/) ?? ["", "  "])[1];
  L[iSinon] =
    `${indent}) : clientName(${s}) ? (\n` +
    `${indent}  ${balise}{clientName(${s})}</span>\n` +
    `${indent}) : (`;
  L[iTernaire] =
    `${indentT}{/* La barre portait le nom du modèle, à l'endroit le plus visible de\n` +
    `${indentT}    la page. Le client a donné le sien : c'est celui-là qu'on montre,\n` +
    `${indentT}    dans le style du libellé d'origine. Sans client, la composition du\n` +
    `${indentT}    modèle revient telle quelle. */}\n` +
    L[iTernaire];

  let src = L.join("\n");
  const tete = src.split('} from "@/lib/templates/clientContent";')[0] ?? "";
  if (!/\bclientName\b/.test(tete)) {
    const im = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
    if (!im) { rapport.push([t, "PAS D'IMPORT clientContent"]); continue; }
    const noms = [...new Set([...im[1].split(",").map((x) => x.trim()).filter(Boolean), "clientName"])].sort();
    src = src.replace(im[0], `import {\n  ${noms.join(",\n  ")},\n} from "@/lib/templates/clientContent";`);
  }
  fs.writeFileSync(f, src);
  rapport.push([t, `câblé · ${balise.slice(0, 60)}`]);
}
for (const [t, m] of rapport) console.log(`${t} : ${m}`);
console.log(`\n${rapport.filter(([, m]) => m.startsWith("câblé")).length} câblés · ${rapport.filter(([, m]) => !m.startsWith("câblé")).length} restants`);
