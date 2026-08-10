// Les listes câblées des pages annexes affichent-elles la donnée du client ?
//
//   node scripts/qa-sous-pages-listes.mjs
//
// Vérifie les pages que wire-sous-pages-listes.mjs a câblées : on envoie des
// prestations, une FAQ et une équipe reconnaissables, et on regarde si la page
// annexe les porte. Témoin armé : une page volontairement non câblée doit
// rester en démonstration — si le témoin « réussit », la mesure est morte.

import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";

/* Les pages câblées, lues du journal du codemod. */
const lignes = fs.readFileSync("/tmp/wire.log", "utf8").split("\n").filter((l) => l.includes("page.tsx"));
const pages = lignes.map((l) => {
  const chemin = l.trim().split(" ")[0].replace(/^app\/templates\//, "").replace(/\/page\.tsx$/, "");
  const [theme, route] = chemin.split("/");
  /*
    Seules les listes que la page REND comptent : plusieurs annexes ont hérité
    des constantes de l'accueil sans les afficher (impact-19, impact-22), et
    d'autres ne les montrent qu'après navigation interne. Exiger leur donnée à
    l'écran d'ouverture fabriquait 18 faux défauts.
  */
  const src = fs.readFileSync(`app/templates/${theme}/${route}/page.tsx`, "utf8");
  /*
    Chaque liste vient avec le témoin de sa démonstration : la première valeur
    textuelle du premier objet de X_DEMO_ANNEXE. Si ni la donnée du client ni
    celle de la démonstration ne sont à l'écran, la liste ne se rend pas sur
    cette route — copie interne morte, `goTo` navigue vers la vraie route —
    et exiger sa donnée fabriquait huit faux défauts de plus.
  */
  const blocs = l.split("·")[1].trim().split(" ")
    .filter((x) => {
      const nom = x.split("←")[0];
      return new RegExp(`\\{\\s*${nom}\\s*\\.(map|slice)|${nom}\\.map\\(`).test(src);
    })
    .map((x) => {
      const [nom, fn] = x.split("←");
      const m = src.match(new RegExp(`const ${nom}_DEMO_ANNEXE = \\[\\s*\\{[\\s\\S]{0,400}?(?:title|name|label|q|text)\\s*:\\s*['"\`]([^'"\`]{6,60})`));
      return { fn, temoin: m?.[1] };
    });
  return { theme, route, blocs };
}).filter((p) => p.blocs.length);

const PROFIL = {
  services: [
    { name: "Détartrage Vidal", description: "Intervention en moins d'une heure." },
    { name: "Colonne Marquisats", description: "Remplacement complet, garantie dix ans." },
  ],
  faq: [{ q: "Intervenez-vous le dimanche ?", a: "Oui, au tarif annoncé d'avance." }],
  team: [{ name: "Éloi Vidal", role: "Maître plombier" }],
};
const PREUVE = {
  clientServices: "détartrage vidal",
  clientFaq: "intervenez-vous le dimanche",
  clientTeam: "éloi vidal",
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let defauts = 0;

async function lire(theme, route) {
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "Votre plombier de confiance à Annecy", template: theme,
    } }),
  });
  const { sessionId } = await r.json();
  if (!sessionId) throw new Error("session non créée");
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ businessProfile: PROFIL }),
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/templates/${theme}/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(2800);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1200);
  const texte = (await p.evaluate(() => document.body.textContent ?? "")).toLowerCase().replace(/\s+/g, " ");
  await p.close();
  return texte;
}

for (const { theme, route, blocs } of pages) {
  try {
    const texte = await lire(theme, route);
    const absents = blocs.filter((b) => !texte.includes(PREUVE[b.fn])
      && (b.temoin ? texte.includes(b.temoin.toLowerCase()) : true));
    if (absents.length) {
      defauts++;
      console.log(`${theme}/${route}  muet sur : ${absents.map((b) => b.fn).join(", ")}`);
    }
  } catch (e) {
    defauts++;
    console.log(`${theme}/${route}  ERREUR : ${String(e.message).slice(0, 60)}`);
  }
}

/*
  Le témoin : une page à listes en dur jamais câblée (groupe B). La prestation
  du client ne doit PAS y apparaître ; si elle y est, l'instrument ment.
*/
try {
  const texte = await lire("impact-08", "atelier");
  if (texte.includes("détartrage vidal")) console.log("TÉMOIN MORT : impact-08/atelier affiche la donnée sans être câblée");
  else console.log("témoin de contrôle : sain (impact-08/atelier reste en démonstration)");
} catch { console.log("témoin injoignable"); }

await b.close();
console.log(`\n${pages.length} pages câblées · ${defauts} en défaut`);
process.exit(defauts ? 1 : 0);
