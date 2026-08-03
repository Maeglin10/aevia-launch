// Traduit les libellés d'interface que le client ne peut pas changer.
//
//   node scripts/wire-ui-language.mjs [--dry]
//
// 73 thèmes portent une démonstration en anglais. Leur contenu est remplacé par
// celui du client, mais pas la navigation, ni les boutons, ni les titres de
// section : « About », « Book Now », « Our Team » restent en anglais sur le site
// d'une entreprise française, et le wizard ne les demande nulle part.
//
// On ne touche qu'aux textes JSX qui correspondent exactement à une entrée du
// lexique — jamais à un fragment de phrase, jamais à un attribut, jamais à une
// ancre (« #contact ») ni à un identifiant de section. Un remplacement approximatif
// dans de la prose ferait bien plus de dégâts que l'anglais qu'il corrige.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const LABELS = [
  "Home", "About", "About Us", "Our Story", "Services", "Our Services",
  "Pricing", "Prices", "Team", "Our Team", "Testimonials", "Reviews",
  "Gallery", "Contact Us", "Get in Touch", "Book Now", "Get Started",
  "Learn More", "Read More", "View All", "See More", "Discover", "Explore",
  "Request a Quote", "Free Quote", "Get a Quote", "Call Us", "Email Us",
  "Follow Us", "Opening Hours", "Our Work", "Why Us", "Why Choose Us",
  "Send", "Subscribe", "Privacy Policy", "Terms",
];
// Casse indifférente, mais le libellé doit être le texte entier du nœud.
const RE = new RegExp(
  `>(\\s*)(${LABELS.map((l) => l.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|")})(\\s*)<`,
  "gi",
);

let touched = 0;
let count = 0;

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  let n = 0;

  src = src.replace(RE, (m, a, label, b) => {
    n++;
    return `>${a}{tr(SESSION_ARG, ${JSON.stringify(label)})}${b}<`;
  });
  if (n === 0) continue;

  // Le lexique lit formData.locale : sans session accessible, on ne touche rien.
  const hasModule = /\blet fd: any = null;/.test(src);
  const hasSessionData = /sessionData = session;/.test(src);
  if (!hasModule && !hasSessionData) continue;
  const arg = hasSessionData ? "sessionData" : "{ formData: fd }";
  src = src.replaceAll("SESSION_ARG", arg);

  if (!/from "@\/lib\/templates\/uiStrings"/.test(src)) {
    // La directive n'est pas toujours le premier caractère du fichier : certains
    // thèmes ont une ligne vide ou un commentaire avant elle. On la cherche.
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import { tr } from "@/lib/templates/uiStrings";\n` + src.slice(at);
  }

  if (src === before) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
  count += n;
}

console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s), ${count} libellé(s) traduit(s)`);
