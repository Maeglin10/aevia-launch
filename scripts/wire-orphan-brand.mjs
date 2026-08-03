// Ajoute un pied de page minimal aux thèmes qui n'affichent le nom nulle part.
//
//   node scripts/wire-orphan-brand.mjs [--dry]
//
// Sept thèmes n'ont ni bloc logo, ni pied de page, ni ligne de copyright : leur
// marque est un titre découpé mot à mot pour être animé (« FORMES / VIDES »).
// Y injecter une chaîne casse l'animation, et les laisser tels quels donne au
// client un site où son nom n'apparaît nulle part — invendable.
//
// On ajoute donc ce qui manque, sobrement : une ligne en fin de page avec le nom
// et la ville, et rien d'autre. Si le client n'a rien renseigné, le nom du thème
// s'affiche, exactement comme partout ailleurs.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const CIBLES = ["impact-27", "impact-33", "impact-39", "impact-41", "impact-42", "impact-45", "impact-61"];

let touched = 0;

for (const id of CIBLES) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("PIED_MINIMAL")) continue;

  const decl = /\blet (?:fd|sessionData): any = null;/.exec(src);
  if (!decl) {
    console.log(`${id} : pas de fd — ignoré`);
    continue;
  }
  const arg = /sessionData = session;/.test(src) ? "sessionData" : "{ formData: fd }";

  // La dernière fermeture du JSX du composant exporté.
  const debutComposant = src.lastIndexOf("export default");
  const fin = src.lastIndexOf("\n  );\n}", debutComposant === -1 ? undefined : undefined);
  // Le point-virgule après la parenthèse est facultatif : certains thèmes
  // écrivent « ) \n } » sans lui.
  const m = /\n(\s*)<\/(\w+)>\s*\n\s*\);?\s*\n\}\s*$/.exec(src);
  if (!m) {
    console.log(`${id} : fin de rendu introuvable — ignoré`);
    continue;
  }

  const pied = `
${m[1]}  {/* PIED_MINIMAL — ce thème n'affichait le nom du client nulle part */}
${m[1]}  <footer
${m[1]}    style={{
${m[1]}      padding: "40px 24px",
${m[1]}      textAlign: "center",
${m[1]}      fontSize: 13,
${m[1]}      letterSpacing: "0.08em",
${m[1]}      opacity: 0.55,
${m[1]}    }}
${m[1]}  >
${m[1]}    {clientName(${arg}) ?? ${JSON.stringify(id)}}
${m[1]}    {clientCity(${arg}) ? \` · \${clientCity(${arg})}\` : ""}
${m[1]}  </footer>`;

  src = src.slice(0, m.index) + pied + src.slice(m.index);

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

console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) dotés d'un pied de page minimal`);
