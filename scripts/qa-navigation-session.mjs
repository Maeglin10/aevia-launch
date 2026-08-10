// Le client survit-il à la navigation interne ?
//
//   node scripts/qa-navigation-session.mjs --tranche 0 4
//
// Toutes les campagnes chargeaient chaque page avec « ?session= » dans
// l'adresse. Personne n'avait cliqué. Or un thème sur deux navigue par
// `goTo()` ou par `<Link>` sans reporter le paramètre : la page d'arrivée
// revenait à la démonstration, et le visiteur d'un aperçu perdait toute la
// personnalisation au premier clic.
//
// On ouvre la page d'accueil du thème avec la session, on clique le premier
// lien interne de l'en-tête, et on regarde si le nom du client tient.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const NOM = "Ateliers Vidal & Fils";

const tous = fs.readdirSync(path.join(process.cwd(), "app/templates"))
  .filter((d) => d.startsWith("impact-")).sort();
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (!ids.length) ids = tous;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  let fiche = { id, navigue: false, garde: null };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData: {
        businessName: NOM, city: "Annecy", businessType: "plombier",
        tagline: "Votre plombier de confiance à Annecy", template: id,
      } }),
    });
    const { sessionId } = await r.json();
    if (!sessionId) throw new Error("session non créée");

    const p = await ctx.newPage();
    /*
      Témoin de contrôle (--temoin) : on neutralise le sessionStorage, ce qui
      recrée l'état d'avant correction. L'instrument DOIT alors rapporter des
      pertes ; s'il n'en voit aucune, c'est lui qui est mort, pas le produit
      qui est sain — l'erreur qui m'a coûté quatre campagnes.
    */
    if (process.env.TEMOIN) {
      await p.addInitScript(() => {
        Object.defineProperty(window, "sessionStorage", {
          value: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
        });
      });
    }
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
    await p.waitForTimeout(2600);

    /*
      Le premier lien de l'en-tête qui mène ailleurs dans le même thème. On
      écarte le logo (il ramène à l'accueil, donc ne prouve rien) et tout ce
      qui sort du site.
    */
    const cible = await p.evaluate(() => {
      const dedans = [...document.querySelectorAll("header a, nav a, header button, nav button")];
      for (const e of dedans) {
        const t = (e.textContent ?? "").trim();
        if (!t || t.length > 24) continue;
        const href = e.getAttribute?.("href") ?? "";
        if (href.startsWith("http") || href.startsWith("#") || href === "/") continue;
        const versAccueil = /^(accueil|home|retour)/i.test(t);
        if (versAccueil) continue;
        return t;
      }
      return null;
    });
    if (!cible) { fiche = { id, navigue: false, garde: null }; fiches.push(fiche); await p.close(); continue; }

    await p.evaluate((t) => {
      const dedans = [...document.querySelectorAll("header a, nav a, header button, nav button")];
      dedans.find((e) => (e.textContent ?? "").trim() === t)?.click();
    }, cible);
    await p.waitForTimeout(2400);

    const texte = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
    fiche = { id, navigue: true, cible, garde: texte.includes(NOM) };
    await p.close();
  } catch (e) {
    fiche = { id, navigue: false, garde: null, erreur: String(e.message).slice(0, 50) };
  }
  fiches.push(fiche);
  if (fiche.navigue && !fiche.garde) console.log(`${id.padEnd(12)} perd le client en cliquant « ${fiche.cible} »`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const testes = fiches.filter((f) => f.navigue);
console.log(`\n${fiches.length} thèmes · ${testes.length} avec navigation interne · ${testes.filter((f) => !f.garde).length} perdent le client`);
