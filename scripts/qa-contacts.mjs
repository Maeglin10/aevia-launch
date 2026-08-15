/*
  Les coordonnées affichées appartiennent-elles au client ?

    node scripts/qa-contacts.mjs [--parallele 4] [--sortie /tmp/contacts]

  Le balayage des pages annexes ne cherchait que les *noms* de marque de la
  démonstration. Il a laissé passer impact-16/propos, où un couvreur d'Annecy
  affichait « contact@obscura.fr » et « @obscuraphoto » — l'adresse et le compte
  Instagram du photographe de la démonstration, en toutes lettres, sous un
  bouton d'appel à l'action.

  Trois cent cinquante-deux fichiers portent une adresse écrite en dur. La
  plupart sont des replis légitimes (`clientEmail(s) ?? "contact@…"`), invisibles
  dès qu'un client remplit le formulaire. Seul le navigateur peut trancher : on
  rend chaque page avec un client dont on connaît l'adresse, et l'on relève tout
  ce qui ressemble à une coordonnée sans être la sienne.
*/
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

/* La marque de démonstration de chaque thème, extraite de son repli
   `clientName(...) ?? "X"`. Le balayage des pages annexes ne la cherchait que
   sur les annexes ; les accueils n'avaient jamais été contrôlés. */
const MARQUES = JSON.parse(fs.readFileSync("/tmp/marques.json", "utf8"));

const BASE = process.env.AUDIT_BASE ?? "http://127.0.0.1:3000";
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : d; };
const PARALLELE = Number(arg("parallele", 4));
const SORTIE = arg("sortie", "/tmp/contacts");
fs.mkdirSync(SORTIE, { recursive: true });

const COURRIEL = "contact@ateliers-vidal.fr";
const COMPTE = "ateliersvidal";
const FORM = {
  businessName: "Ateliers Vidal & Fils", businessType: "couvreur",
  tagline: "Zinc, ardoise et tuile plate depuis 1974", city: "Annecy",
  brandColor: "#7c3aed", email: COURRIEL, phone: "04 50 71 82 93",
  instagram: `@${COMPTE}`,
};
const PROFIL = {
  services: [{ name: "Réfection complète de toiture", price: "à partir de 9 400 €", description: "Dépose, charpente vérifiée." }],
  menu: [{ name: "Réfection complète de toiture", price: "9 400 €", category: "Toiture" }],
  legal: { companyAddress: "14 route des Creuses, 74000 Annecy", companyName: "Ateliers Vidal & Fils" },
  contacts: { general: { email: COURRIEL, phone: "04 50 71 82 93" } },
};

const RACINE = path.join(process.cwd(), "app/templates");
const PAGES = [];
for (const t of fs.readdirSync(RACINE).filter((d) => /^impact-\d+$/.test(d)).sort()) {
  PAGES.push([t, ""]);
  for (const e of fs.readdirSync(path.join(RACINE, t), { withFileTypes: true })) {
    if (e.isDirectory() && fs.existsSync(path.join(RACINE, t, e.name, "page.tsx"))) PAGES.push([t, e.name]);
  }
}
console.log(`${PAGES.length} pages à mesurer`);

const navigateur = await chromium.launch();
const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 } });
const sessions = new Map();

async function sessionDe(theme) {
  if (sessions.has(theme)) return sessions.get(theme);
  const attente = (async () => {
    const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { ...FORM, template: theme } }) });
    const { sessionId } = await r.json();
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ businessProfile: PROFIL }) });
    return sessionId;
  })();
  sessions.set(theme, attente);
  return attente;
}

const fiches = [];
let curseur = 0;
async function travailleur() {
  while (curseur < PAGES.length) {
    const [theme, annexe] = PAGES[curseur++];
    const fuites = [];
    try {
      const sid = await sessionDe(theme);
      const page = await ctx.newPage();
      /* Le build ne voit rien : les thèmes portent `@ts-nocheck`, et un symbole
         inexistant ne se manifeste qu'à l'exécution. `HERO_BOUQUETS_DEMO_SOURCE_LIVE
         is not defined` a servi une page d'erreur pendant que le build restait vert. */
      const erreurs = [];
      page.on("pageerror", (e) => erreurs.push(String(e).slice(0, 90)));
      const url = `${BASE}/templates/${theme}${annexe ? "/" + annexe : ""}?session=${sid}`;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
      await page.waitForTimeout(2400);
      /*
         Attendre que la session soit posée — vraiment.

         Six secondes suffisaient à un seul onglet ; à six en parallèle, le
         serveur répond plus tard et l'on lisait l'écran d'avant. impact-118
         affichait « CHRONOS HOROLOGY SA. GENÈVE » à une seconde et le nom du
         client à trois : la page était juste, la mesure fausse. On attend donc
         vingt secondes, et si le nom n'arrive pas, on le dit au lieu
         d'accuser le thème.
      */
      const chargee = await page
        .waitForFunction(() => (document.body.innerText ?? "").includes("Ateliers Vidal"), { timeout: 20000 })
        .then(() => true)
        .catch(() => false);
      if (!chargee) {
        fuites.push("session non chargée — mesure non concluante");
        await page.close();
        fiches.push({ page: `${theme}${annexe ? "/" + annexe : ""}`, fuites });
        console.log(`${String(fiches.length).padStart(4)}/${PAGES.length} ${theme}${annexe ? "/" + annexe : ""} ⏳ session non chargée`);
        continue;
      }
      /* Descente progressive : les sections `whileInView` se démontent dès qu'on
         les dépasse, il faut lire le texte pendant la descente, pas après. */
      const vus = await page.evaluate(async () => {
        const morceaux = [];
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 70));
          morceaux.push(document.body.innerText ?? "");
        }
        morceaux.push(document.body.innerText ?? "");
        return morceaux.join(" ").replace(/\s+/g, " ");
      });
      const sien = COURRIEL.toLowerCase();
      for (const m of new Set(vus.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? [])) {
        if (m.toLowerCase() !== sien) fuites.push(`courriel étranger : ${m}`);
      }
      /* Un compte social : une arobase suivie d'un mot, sans point de domaine
         derrière — sinon on rattrape la fin des adresses déjà relevées. */
      for (const m of new Set(vus.match(/@[a-z0-9._]{3,30}/gi) ?? [])) {
        const nu = m.slice(1).toLowerCase();
        if (nu.includes(".") || nu === COMPTE) continue;
        if (sien.includes(nu)) continue;
        fuites.push(`compte étranger : ${m}`);
      }
      if (erreurs.length) fuites.push(`erreur JS : ${erreurs[0]}`);
      if (vus.length < 300) fuites.push("page vide ou en erreur");
      const marque = MARQUES[theme];
      if (marque && vus.toLowerCase().includes(marque.toLowerCase())) fuites.push(`marque : ${marque}`);
      await page.close();
    } catch (e) {
      fuites.push(`plantage: ${String(e).slice(0, 70)}`);
    }
    const nom = `${theme}${annexe ? "/" + annexe : ""}`;
    fiches.push({ page: nom, fuites });
    if (fuites.length) console.log(`${String(fiches.length).padStart(4)}/${PAGES.length} ${nom} ✗ ${fuites.join(" · ").slice(0, 110)}`);
    else if (fiches.length % 100 === 0) console.log(`${String(fiches.length).padStart(4)}/${PAGES.length} …`);
  }
}
await Promise.all(Array.from({ length: PARALLELE }, travailleur));
await navigateur.close();

const casses = fiches.filter((f) => f.fuites.length);
fs.writeFileSync(path.join(SORTIE, "resultat.json"), JSON.stringify({ total: fiches.length, casses }, null, 1));
console.log(`\n${fiches.length} pages · ${casses.length} avec une coordonnée étrangère`);
