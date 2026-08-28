/* Le nom de la démonstration en pied de page.

   Mesuré au rendu : la barre du haut porte bien le nom du client, le pied
   porte celui du modèle. Un visiteur qui descend jusqu'au copyright lit donc
   le nom d'une autre entreprise.

   Un geste par thème, texte exact. Le nom d'origine reste en repli : sans
   client, la démonstration s'affiche comme avant. */
import fs from "node:fs";

const gestes = [
  ["impact-02/page",    "{new Date().getFullYear()} Elena Korr Studio",                "{new Date().getFullYear()} {clientName(sessionData) ?? \"Elena Korr Studio\"}"],
  ["impact-59/layout",  "{new Date().getFullYear()} Luminal Ltd. &mdash; Valentin Milliand", "{new Date().getFullYear()} {clientName(__layoutSession) ?? \"Luminal Ltd.\"}"],
  ["impact-62/layout",  "{new Date().getFullYear()} Satori Gastronomy Group.",         "{new Date().getFullYear()} {clientName(__layoutSession) ?? \"Satori Gastronomy Group\"}."],
  ["impact-66/layout",  "{new Date().getFullYear()} L'Atelier de Beauté.",             "{new Date().getFullYear()} {clientName(__layoutSession) ?? \"L'Atelier de Beauté\"}."],
  ["impact-67/layout",  "{new Date().getFullYear()} Vision Real Estate SA.",           "{new Date().getFullYear()} {clientName(__layoutSession) ?? \"Vision Real Estate SA\"}."],
  ["impact-71/layout",  "{new Date().getFullYear()} ZEN SPACE Wellness Ltd.",          "{new Date().getFullYear()} {clientName(__layoutSession) ?? \"ZEN SPACE Wellness Ltd.\"}"],
  ["impact-74/layout",  "{new Date().getFullYear()} Aevia Kitchen",                    "{new Date().getFullYear()} {clientName(__layoutSession) ?? \"Aevia Kitchen\"}"],
  ["impact-76/layout",  "{new Date().getFullYear()} STRUCTURA ARCHITECTURE Inc.",      "{new Date().getFullYear()} {clientName(__layoutSession) ?? \"STRUCTURA ARCHITECTURE Inc.\"}"],
  ["impact-77/layout",  "{new Date().getFullYear()} HOROLOGS LUXE Inc.",               "{new Date().getFullYear()} {clientName(__layoutSession) ?? \"HOROLOGS LUXE Inc.\"}"],
  ["impact-78/layout",  "{new Date().getFullYear()} AETHER ROASTS Technologies Inc.",  "{new Date().getFullYear()} {clientName(__layoutSession) ?? \"AETHER ROASTS Technologies Inc.\"}"],
  ["impact-90/page",    "© 2025 — Boulangerie Artisanale",                             "© 2025 — {clientName(sessionData) ?? \"Boulangerie Artisanale\"}"],
  ["impact-247/page",   "© 2012–2026 Volt &amp; Lux ·",                                "© 2012–2026 {clientName(sessionData) ?? \"Volt & Lux\"} ·"],
  ["impact-252/page",   "© 2025–2026 Smile &amp; Co ·",                                "© 2025–2026 {clientName(sessionData) ?? \"Smile & Co\"} ·"],
  ["impact-254/page",   "© 1990–2026 Vaillant &amp; Associés.",                        "© 1990–2026 {clientName(sessionData) ?? \"Vaillant & Associés\"}."],
  ["impact-259/page",   "© 2009–2026 Le Fournil du Parlement ·",                       "© 2009–2026 {clientName(sessionData) ?? \"Le Fournil du Parlement\"} ·"],
  ["impact-270/page",   "© 2024–2026 Peau &amp; Plume ·",                              "© 2024–2026 {clientName(sessionData) ?? \"Peau & Plume\"} ·"],
];

const rapport = [];
for (const [chemin, avant, apres] of gestes) {
  const f = `app/templates/${chemin}.tsx`;
  let src = fs.readFileSync(f, "utf8");
  const n = src.split(avant).length - 1;
  if (n !== 1) { rapport.push([f, n === 0 ? "INTROUVABLE" : `${n} OCCURRENCES`]); continue; }
  src = src.split(avant).join(apres);

  const s = apres.includes("__layoutSession") ? "__layoutSession" : "sessionData";
  if (!new RegExp(`\\bclientName\\b`).test(src.split("} from \"@/lib/templates/clientContent\";")[0] ?? "")) {
    const im = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
    if (!im) { rapport.push([f, "PAS D'IMPORT clientContent"]); continue; }
    const noms = [...new Set([...im[1].split(",").map((x) => x.trim()).filter(Boolean), "clientName"])].sort();
    src = src.replace(im[0], `import {\n  ${noms.join(",\n  ")},\n} from "@/lib/templates/clientContent";`);
  }
  if (!new RegExp(`\\b${s}\\b`).test(src)) { rapport.push([f, `PAS DE ${s}`]); continue; }
  fs.writeFileSync(f, src);
  rapport.push([f, "câblé"]);
}
for (const [f, m] of rapport) console.log(`${f} : ${m}`);
console.log(`\n${rapport.length} thèmes · ${rapport.filter(([, m]) => m !== "câblé").length} en échec`);
