// Pose la ligne nom + ville sur les thèmes qui gardent leur session en local.
//
//   node scripts/wire-local-session-footer.mjs [--dry]
//
// Dix thèmes déclarent `const fd = session?.formData` dans le corps du composant
// plutôt qu'en variable de module. Les codemods précédents cherchaient
// « let fd: any = null » et les ont donc tous laissés de côté.
//
// Leur composant exporté n'est pas non plus le dernier du fichier : chercher la
// fin du rendu à la fin du fichier tombait sur un accordéon de FAQ. On compte
// donc les accolades depuis « export default » pour trouver sa vraie fermeture.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

let touched = 0;
const laisses = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (/clientCity\s*\(/.test(src) || src.includes("PIED_MINIMAL")) continue;
  if (/\blet (?:fd|sessionData): any = null;/.test(src)) continue;

  const local = /\n\s*const fd = session\?\.formData[^\n]*\n/.exec(src);
  if (!local) {
    laisses.push(`${id} (pas de fd local)`);
    continue;
  }

  const dep = src.indexOf("export default", local.index);
  const depart = dep === -1 ? src.lastIndexOf("export default", local.index) : dep;
  if (depart === -1) {
    laisses.push(`${id} (composant exporté introuvable)`);
    continue;
  }
  // La fermeture du composant : on compte depuis sa première accolade.
  /*
    L'accolade du corps, pas celle du paramètre : ces composants sont déclarés
    « function Page({ session: initialSession }) », et compter depuis la première
    accolade rencontrée s'arrêtait sur la déstructuration.
  */
  const par = src.indexOf(")", depart);
  let i = src.indexOf("{", par === -1 ? depart : par);
  let d = 0;
  let fin = -1;
  for (; i < src.length; i++) {
    if (src[i] === "{") d++;
    else if (src[i] === "}") {
      d--;
      if (d === 0) {
        fin = i;
        break;
      }
    }
  }
  if (fin === -1) {
    laisses.push(`${id} (fermeture introuvable)`);
    continue;
  }

  // Le dernier « </x> » avant « ); } » de ce composant.
  const queue = src.slice(Math.max(0, fin - 400), fin);
  /*
    La fin du rendu peut être un fragment — « </> » — et pas seulement une balise
    nommée. Deux thèmes se terminent ainsi et étaient laissés de côté.
  */
  const m = /\n(\s*)<\/(?:\w+)?>\s*\n\s*\);?\s*$/.exec(queue);
  if (!m) {
    laisses.push(`${id} (fin de rendu introuvable)`);
    continue;
  }
  const pos = Math.max(0, fin - 400) + m.index;
  const ind = m[1];
  const pied =
    `\n${ind}  {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}\n` +
    `${ind}  <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.55 }}>\n` +
    `${ind}    {clientName({ formData: fd }) ?? ${JSON.stringify(id)}}\n` +
    `${ind}    {clientCity({ formData: fd }) ? \` · \${clientCity({ formData: fd })}\` : ""}\n` +
    `${ind}  </footer>`;
  src = src.slice(0, pos) + pied + src.slice(pos);

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (mm, b) => {
      const ont = new Set(b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean));
      ont.add("clientName");
      ont.add("clientCity");
      return `import {\n${[...ont].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
    });
  } else {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src =
      src.slice(0, at) +
      `import {\n  clientCity,\n  clientName,\n} from "@/lib/templates/clientContent";\n` +
      src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

if (laisses.length) console.log("laissés :", laisses.join(", "));
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) à session locale dotés de la ligne nom + ville`);
