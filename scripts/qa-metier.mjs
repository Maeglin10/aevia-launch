// Le métier affiché est-il celui du client ?
//
//   node scripts/qa-metier.mjs --tranche 0 4
//
// Sur impact-351, un plombier annécien lit « COUVREUR-ZINGUEUR · ANNECY » en
// surtitre et « Couvreur-zingueur » dans l'en-tête : la ville vient de lui, le
// métier de la démonstration. C'est le genre d'erreur qu'un prospect remarque
// avant tout le reste, parce que c'est la première ligne de la page.
//
// On charge donc chaque thème avec un métier improbable pour lui — plombier
// partout — et l'on cherche, dans le premier écran, le métier d'origine.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const args = process.argv.slice(2);
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

/*
  Les métiers que le catalogue met en scène. On ne cherche pas n'importe quel
  mot : seulement ceux qui désignent une profession, et jamais « plombier »,
  qui est celui du client de la mesure.
*/
const METIERS = [
  "couvreur", "zingueur", "électricien", "electricien", "menuisier", "serrurier", "peintre",
  "paysagiste", "maçon", "macon", "carreleur", "chauffagiste", "vitrier", "pisciniste",
  "dentiste", "médecin", "medecin", "kinésithérapeute", "ostéopathe", "osteopathe", "podologue",
  "vétérinaire", "veterinaire", "opticien", "audioprothésiste", "pharmacien", "sage-femme",
  "avocat", "notaire", "comptable", "expert-comptable", "architecte", "coiffeur", "esthéticienne",
  "tatoueur", "photographe", "traiteur", "boulanger", "pâtissier", "patissier", "caviste",
  "restaurateur", "fleuriste", "bijoutier", "couturier", "déménageur", "demenageur", "toiletteur",
  "auto-école", "auto-ecole", "moniteur", "coach sportif", "diététicienne", "dieteticienne",
  "infirmier", "agent immobilier", "assureur", "courtier", "ébéniste", "ebeniste", "brasseur",
];

/*
  Ce qui dit qui est l'entreprise, et non ce qu'elle fait. Un surtitre
  — « COUVREUR-ZINGUEUR · ANNECY » — tient en quelques mots ; une phrase de
  soixante caractères décrit une prestation, et le thème a le droit de garder la
  sienne tant que le client n'écrit pas la sienne.
*/
const premierEcran = () => {
  const out = [];
  for (const e of document.querySelectorAll("*")) {
    if (e.children.length > 0) continue;
    const r = e.getBoundingClientRect();
    if (r.top > 780 || r.height < 6) continue;
    const s = getComputedStyle(e);
    if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.15) continue;
    const t = (e.textContent ?? "").replace(/\s+/g, " ").trim();
    if (t.length >= 3 && t.length <= 60) out.push(t);
  }
  return out.join(" · ").toLowerCase();
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  let fiche = { id, restes: [] };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData: {
        businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
        tagline: "Votre plombier de confiance à Annecy depuis 1998",
        email: "contact@ateliers-vidal.fr", phone: "04 50 11 22 33", template: id,
      } }),
    });
    const { sessionId } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ?)");

    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
    await p.waitForTimeout(2800);
    const texte = await p.evaluate(premierEcran);
    await p.close();

    const restes = METIERS.filter((m) => texte.includes(m));
    fiche = { id, restes: restes.slice(0, 3), extrait: texte.slice(0, 60) };
  } catch (e) {
    fiche = { id, restes: [], erreur: String(e.message).slice(0, 50) };
  }
  fiches.push(fiche);
  if (fiche.restes.length) console.log(`${id.padEnd(12)} métier de la démonstration : ${fiche.restes.join(", ")}`);
  if (fiche.erreur) console.log(`${id.padEnd(12)} ERREUR ${fiche.erreur}`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.restes.length);
console.log(`\n${fiches.length} thèmes · ${ko.length} affichant le métier d'un autre`);
