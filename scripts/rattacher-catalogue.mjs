/*
  Rattacher un thème au métier qu'il raconte vraiment.

    node scripts/rattacher-catalogue.mjs [--ecrire]

  Le rattachement thème→secteur avait été fait mécaniquement quand on a raccroché
  les cinquante-deux orphelins. Une organisatrice de mariages recevait donc un
  site de promoteur de concerts, un couvreur un site de transporteur de fret : le
  client remplit tout, et la page reste celle d'un autre métier.

  Le jugement s'est fait à la main, sur le nom de démonstration — le seul signal
  qui ne mente pas. Le texte seul se trompait une fois sur deux : « Galerie »,
  « À Propos », « collection » se trouvent partout et faisaient passer un cabinet
  d'ostéopathie pour un atelier d'artiste.

  Ne sont repris ici que les écarts francs, où le nom dit le métier :
  « Clinique du Bois Vert » n'est pas un atelier d'art, « CHRONOS HOROLOGY » n'est
  pas une agence immobilière. Les cas discutables — « Atelier du Bois », qui est
  autant menuiserie qu'artisanat d'art — sont laissés tels quels.
*/
import fs from "node:fs";

const ECRIRE = process.argv.includes("--ecrire");

/* thème → le secteur qui lui convient, jugé sur son nom de démonstration. */
const RATTACHEMENTS = {
  "impact-14":  { de: "Horizon Maritime Group",           vers: "hotel" },
  "impact-48":  { de: "Atelier Moreau·Leroy",             vers: "architecte" },
  "impact-118": { de: "CHRONOS HOROLOGY",                 vers: "bijouterie" },
  "impact-119": { de: "NEBULA CLOUD TECHNOLOGIES",        vers: "saas" },
  "impact-147": { de: "VANGUARD STRATEGIC LEGAL DEFENSE", vers: "avocat" },
  "impact-155": { de: "Pierre & Co",                      vers: "agent_immobilier" },
  "impact-178": { de: "Alta Transactions",                vers: "agent_immobilier" },
  "impact-182": { de: "Bâtir",                            vers: "plombier" },
  "impact-184": { de: "BrilloNet",                        vers: "menage" },
  "impact-185": { de: "Gentleman's Cut",                  vers: "coiffeur" },
  "impact-186": { de: "Dr. Léa Fontaine",                 vers: "medecin" },
  "impact-188": { de: "Clinique du Bois Vert",            vers: "veterinaire" },
};

let src = fs.readFileSync("lib/templates/sectors.ts", "utf8");
const faits = [], laisses = [];

for (const [theme, { de, vers }] of Object.entries(RATTACHEMENTS)) {
  /* Le thème quitte les secteurs où il ne raconte pas le bon métier. */
  /* Le catalogue mêle les deux guillemets : 'impact-14' et "impact-359". */
  const cite = (t) => new RegExp(`['"]${t}['"]`);
  let retires = 0;
  src = src.replace(/^ {2}([a-z_0-9]+):\s*\[([^\]]*)\]/gm, (tout, secteur, liste) => {
    if (secteur === vers || !cite(theme).test(liste)) return tout;
    retires++;
    const propre = liste.split(",").map((x) => x.trim()).filter((x) => x && !cite(theme).test(x));
    return `  ${secteur}: [${propre.join(", ")}]`;
  });

  /* Et rejoint celui qui lui convient, s'il n'y est pas déjà. */
  const cible = new RegExp(`^ {2}(${vers}):\\s*\\[([^\\]]*)\\]`, "m");
  const m = cible.exec(src);
  if (!m) { laisses.push(`${theme} · secteur « ${vers} » introuvable`); continue; }
  if (!cite(theme).test(m[2])) {
    const liste = m[2].split(",").map((x) => x.trim()).filter(Boolean).concat(`'${theme}'`);
    src = src.replace(cible, `  ${vers}: [${liste.join(", ")}]`);
  }
  faits.push(`${theme.padEnd(12)} « ${de} » → ${vers} (${retires} secteur(s) quitté(s))`);
}

if (ECRIRE) fs.writeFileSync("lib/templates/sectors.ts", src);
faits.forEach((f) => console.log("  " + f));
if (laisses.length) console.log("\nlaissés :\n" + laisses.map((l) => "  " + l).join("\n"));
console.log(`\n${faits.length} rattachés · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
