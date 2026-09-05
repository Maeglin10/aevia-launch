// Le pied de page parle-t-il du client, ou de la démonstration ?
//
//   node scripts/qa-pied-de-page.mjs --tranche 0 4
//
// C'est le bloc qu'on regarde en dernier et qu'on relit le plus : téléphone,
// adresse, courriel, horaires, mentions. S'il porte encore le numéro de la
// démonstration, le visiteur appelle quelqu'un d'autre — et le client ne s'en
// aperçoit qu'en perdant un appel.
//
// On remplit le wizard avec des données reconnaissables entre mille, puis on lit
// le pied de page et l'on signale tout ce qui n'est pas au client : un autre
// numéro, un autre courriel, une autre ville, un autre nom.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const CLIENT = {
  nom: "Ateliers Vidal & Fils",
  ville: "Annecy",
  tel: "04 50 11 22 33",
  telCompact: "0450112233",
  adresse: "12 rue des Marquisats",
};

const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  const formData = {
    businessName: CLIENT.nom, city: CLIENT.ville, businessType: "plombier",
    tagline: "Votre plombier de confiance à Annecy depuis 1998",
    email: `contact@ateliers-vidal.fr`, phone: CLIENT.tel, address: CLIENT.adresse,
    brandColor: "#c2410c", template: id,
  };
  let fiche = { id, restes: [] };
  try {
    /*
      L'adresse ne vit pas dans le formulaire mais dans le profil : le wizard la
      range sous « businessProfile.geo.address », et c'est là que le contrat va
      la chercher. L'envoyer ailleurs faisait conclure que dix-sept thèmes
      gardaient la ville de leur démonstration.
    */
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData }),
    });
    const { sessionId, editToken } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ? lancer next start avec SESSIONS_RATE_LIMIT=100000)");
    // La création n'accepte que le formulaire ; le profil se pose ensuite.
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ businessProfile: { geo: { address: CLIENT.adresse, primaryCity: CLIENT.ville } } }),
    });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2200);
    fiche = await p.evaluate(({ identifiant, client }) => {
      /*
        Le pied de page n'est pas toujours une balise « footer » : certains
        thèmes le composent dans une section ordinaire. À défaut, on prend le
        dernier cinquième de la page, là où il se trouve toujours.
      */
      const pied = document.querySelector("footer")
        ?? [...document.querySelectorAll("section, div")].filter((e) => {
          const r = e.getBoundingClientRect();
          return r.top + window.scrollY > document.body.scrollHeight * 0.8 && r.height > 80;
        })[0];
      if (!pied) return { id: identifiant, restes: [], sansPied: true };

      const texte = (pied.innerText ?? "").replace(/\s+/g, " ");
      const restes = [];

      /*
        Un numéro qui n'est pas le sien. On compare les chiffres seuls : les
        thèmes écrivent « 02 40 12 34 56 », « +33 2 40 … », « 02.40.12.34.56 ».

        Deux précautions apprises en mesurant : un numéro d'ordre professionnel
        — RPPS, SIRET, SIREN, TVA, ADELI — n'est pas un téléphone, et « RPPS
        10234567890 » se lisait comme tel ; et un vrai numéro français compte
        exactement dix chiffres.
      */
      const IDENTIFIANTS = /(RPPS|SIRET|SIREN|ADELI|RCS|TVA|N°|IBAN|APE|NAF)[\s:\d]{0,12}$/i;
      for (const m of texte.matchAll(/(?:\+33\s?|0)[\d\s.\-]{8,16}\d/g)) {
        const chiffres = m[0].replace(/\D/g, "").replace(/^33/, "0");
        if (chiffres.length !== 10) continue;
        if (chiffres.endsWith(client.telCompact.slice(1))) continue;
        if (IDENTIFIANTS.test(texte.slice(Math.max(0, m.index - 26), m.index))) continue;
        restes.push(`téléphone ${m[0].trim()}`);
      }

      // Un courriel qui n'est pas le sien.
      for (const m of texte.matchAll(/[\w.+-]+@[\w.-]+\.\w{2,}/g)) {
        if (m[0].includes("ateliers-vidal")) continue;
        restes.push(`courriel ${m[0]}`);
      }

      /*
        Une ville française qui n'est pas la sienne. On s'en tient à celles que
        les démonstrations emploient — chercher « toute ville » ferait sonner
        chaque nom propre.
      */
      const villes = ["Nantes", "Bordeaux", "Lyon", "Marseille", "Paris", "Toulouse", "Rennes",
        "Strasbourg", "Nice", "Lille", "Montpellier", "Chambéry", "Grenoble", "Dijon", "Caen",
        "Angers", "Reims", "Tours", "Roubaix", "Avignon", "Aix-en-Provence", "Biarritz"];
      for (const v of villes) {
        const m = new RegExp(`(.{0,8})\\b${v}\\b`).exec(texte);
        if (!m) continue;
        // « RCS Paris » nomme un tribunal de commerce, pas la ville du client.
        if (/RCS|Tribunal|greffe/i.test(m[1])) continue;
        restes.push(`ville ${v}`);
      }

      return { id: identifiant, restes: [...new Set(restes)].slice(0, 5) };
    }, { identifiant: id, client: CLIENT });
    await p.close();
  } catch (e) {
    fiche = { id, restes: [], erreur: String(e.message).slice(0, 44) };
  }
  fiches.push(fiche);
  if (fiche.restes.length) console.log(`${id.padEnd(12)} ${fiche.restes.join(" · ")}`);
  else if (fiche.sansPied) console.log(`${id.padEnd(12)} pas de pied de page repérable`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.restes.length);
console.log(`\n${fiches.length} thèmes · ${ko.length} dont le pied de page porte encore la donnée de la démonstration`);
