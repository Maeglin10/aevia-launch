/*
  Le parcours d'un vrai client, pour chacun des soixante-treize métiers.

    node scripts/parcours-tous-metiers.mjs [--depuis 0] [--jusqua 73]

  Un seul métier éprouvé ne dit rien des autres : chaque métier a ses thèmes,
  ses champs, son vocabulaire. On refait donc le formulaire en entier, en
  production, pour chacun — secteur, métier, design, sept étapes, génération,
  aperçu — et l'on relève ce qui bloque, ce qui prend du temps, et les erreurs
  de page.

  On s'arrête à l'aperçu : au-delà, c'est un paiement, et un paiement se teste
  une fois, pas soixante-treize.
*/
import { chromium } from "playwright";
import fs from "node:fs";
import { clientPour } from "./clients-types.mjs";

const BASE = process.env.BASE ?? "https://launch.aevia.services";
const METIERS = JSON.parse(fs.readFileSync("/tmp/metiers.json", "utf8"));
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? Number(process.argv[i + 1]) : d; };
const debut = arg("depuis", 0), fin = arg("jusqua", METIERS.length);
const SORTIE = "/tmp/parcours-tous";
fs.mkdirSync(SORTIE, { recursive: true });

const NAV = /continuer|suivant|retour|accepter|refuser|personnaliser|connexion|produits|templates|tarifs|changer|voir le th[èe]me|fran[çc]ais|english|espa|deutsch|portug|mentions|cgv|confidentialit|cookies|contact/i;

const nav = await chromium.launch();
const bilan = [];

for (let i = debut; i < fin && i < METIERS.length; i++) {
  const { domaine, label } = METIERS[i];
  const client = clientPour(domaine);
  const t0 = Date.now();
  const soucis = [];
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 1000 }, locale: "fr-FR" });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => soucis.push("erreur : " + String(e).slice(0, 90)));
  p.on("response", (r) => { if (r.status() >= 500 && !/favicon/.test(r.url())) soucis.push(`${r.status()} ${r.url().replace(BASE, "").slice(0, 60)}`); });

  let etat = "?", theme = "", apercu = "", texte = "";

  /*
    Un métier qui s'enlise ne doit pas retenir les soixante-douze autres — deux
    d'entre eux ont accaparé quinze minutes au premier passage. On borne donc le
    parcours dans une course contre la montre, et l'on ne ferme le navigateur
    qu'après, jamais pendant : fermer sous les pieds de la page produisait des
    erreurs en cascade qu'on prenait ensuite pour des défauts du produit.
  */
  const parcours = (async () => {
    await p.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(1200);
    await p.getByText("Tout accepter").click({ timeout: 5000 }).catch(() => {});
    await p.getByText(domaine).first().click({ timeout: 15000 });
    await p.waitForTimeout(900);
    await p.getByText(label, { exact: true }).first().click({ timeout: 15000 });
    await p.waitForTimeout(1100);

    for (let etape = 0; etape < 12; etape++) {
      await p.waitForTimeout(700);
      await remplir(p, client);
      if (await continuer(p)) continue;
      const modele = p.getByText(/^Modèle 1$/).first();
      if (await modele.count().catch(() => 0)) {
        await modele.click({ timeout: 8000 }).catch(() => {});
        await p.waitForTimeout(800);
        if (await continuer(p)) continue;
      }
      const carte = await premiereCarte(p);
      if (carte && (await continuer(p))) continue;
      break;
    }
    /* La génération dure une dizaine de secondes : on l'attend avant de juger. */
    await p.waitForURL(/\/preview\//, { timeout: 40000 }).catch(() => {});
  })();

  const budget = new Promise((r) => setTimeout(() => r("TROP LONG"), 150000));
  try {
    const issue = await Promise.race([parcours.then(() => "fini"), budget]);
    if (issue === "TROP LONG") etat = "TROP LONG (plus de 2 min)";
    else if (/\/preview\//.test(p.url())) {
      etat = "aperçu";
      theme = (await p.evaluate(() => document.body.innerHTML.match(/impact-\d+/)?.[0] ?? "").catch(() => "")) || "";
      /*
        L'aperçu tel que le client le reçoit. C'est la seule capture bâtie par le
        vrai chemin — les autres créent la session par l'API et ne prouvent donc
        rien du formulaire.
      */
      apercu = p.url();
      await p.waitForTimeout(3500);
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
        window.scrollTo(0, 0);
      }).catch(() => {});
      await p.waitForTimeout(1200);
      texte = (await p.evaluate(() => {
        const bouts = [];
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          const t = (n.nodeValue ?? "").trim();
          if (!t) continue;
          const e = n.parentElement;
          if (!e || e.closest("style,script,noscript,template")) continue;
          const r = e.getBoundingClientRect();
          if (r.width < 1 || r.height < 1) continue;
          bouts.push(t);
        }
        return bouts.join(" | ").slice(0, 12000);
      }).catch(() => "")) || "";
      await p.screenshot({ path: `${SORTIE}/${String(i + 1).padStart(2, "0")}-${label.replace(/\W+/g, "-")}.png`, fullPage: true }).catch(() => {});
    } else {
      const ou = (await p.locator("text=/étape \\d sur \\d/").first().innerText().catch(() => "")) || p.url().replace(BASE, "").slice(0, 40);
      etat = `BLOQUÉ · ${ou}`;
      await p.screenshot({ path: `${SORTIE}/BLOQUE-${label.replace(/\W+/g, "-")}.png`, fullPage: true }).catch(() => {});
    }
  } catch (e) {
    etat = "ERREUR · " + String(e).slice(0, 60);
  }

  const secondes = ((Date.now() - t0) / 1000).toFixed(1);
  bilan.push({ domaine, label, etat, theme, secondes, apercu, texte, soucis: [...new Set(soucis)] });
  console.log(`${String(i + 1).padStart(3)}/${METIERS.length} ${label.padEnd(26)} ${etat.padEnd(26)} ${secondes.padStart(6)} s ${theme}${soucis.length ? " · " + soucis.length + " souci(s)" : ""}`);
  fs.writeFileSync(`${SORTIE}/bilan.json`, JSON.stringify(bilan, null, 1));
  await ctx.close();
}
await nav.close();

const ko = bilan.filter((b) => b.etat !== "aperçu");
console.log(`\n${bilan.length - ko.length}/${bilan.length} métiers arrivent à l'aperçu`);
if (ko.length) console.log("à reprendre :\n" + ko.map((b) => `  ${b.label} — ${b.etat}`).join("\n"));

async function continuer(p) {
  for (const nom of ["Continuer", "Suivant", "Générer mon site", "Générer", "C'est parti", "Valider"]) {
    const tous = [
      ...(await p.getByRole("button", { name: new RegExp(nom, "i") }).elementHandles()),
      ...(await p.getByRole("link", { name: new RegExp(nom, "i") }).elementHandles()),
    ];
    for (const b of tous) {
      if (!(await b.isVisible().catch(() => false))) continue;
      if (!(await b.isEnabled().catch(() => false))) continue;
      if ((await b.getAttribute("aria-disabled").catch(() => null)) === "true") continue;
      await b.scrollIntoViewIfNeeded().catch(() => {});
      await b.click().catch(() => {});
      return true;
    }
  }
  return false;
}

async function premiereCarte(p) {
  const dans = p.locator("#main-content, main").first();
  const portee = (await dans.count().catch(() => 0)) ? dans : p.locator("body");
  for (const b of await portee.locator("button:visible").elementHandles()) {
    const t = ((await b.innerText().catch(() => "")) ?? "").trim();
    if (!t || t.length > 90 || NAV.test(t)) continue;
    if (/[\u{1F1E6}-\u{1F1FF}]/u.test(t)) continue;
    if (await b.evaluate((e) => Boolean(e.closest("header, footer, nav"))).catch(() => false)) continue;
    await b.click().catch(() => {});
    return t;
  }
  return null;
}

async function remplir(p, client) {
  const f = {
    nom: client.form.businessName, metier: client.form.businessType, ville: client.form.city,
    courriel: client.form.email, tel: client.form.phone, adresse: client.form.address,
    slogan: client.form.tagline ?? "", presta: client.profil.services.map((x) => x.name).join(", "),
    avantages: (client.profil.certifications ?? []).slice(0, 3),
  };
  await p.evaluate((f) => {
    for (const c of document.querySelectorAll("input, textarea")) {
      const type = (c.getAttribute("type") ?? "text").toLowerCase();
      if (["checkbox", "radio", "file", "hidden", "submit", "color", "range"].includes(type)) continue;
      const r = c.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      if (String(c.value ?? "").trim()) continue;
      let e = "";
      if (c.id) e = document.querySelector(`label[for="${CSS.escape(c.id)}"]`)?.textContent ?? "";
      if (!e) e = c.closest("label")?.textContent ?? "";
      if (!e) { let n = c.previousElementSibling; while (n && !e) { e = (n.textContent ?? "").trim(); n = n.previousElementSibling; } }
      if (!e) e = c.parentElement?.textContent ?? "";
      const cle = (e + " " + (c.placeholder ?? "")).toLowerCase();
      let v = "";
      /* Les trois avantages clés sont obligatoires à l'étape « Votre offre ». */
      const avantage = /avantage\s*([123])/.exec(cle);
      if (avantage) v = f.avantages[Number(avantage[1]) - 1] ?? "";
      else if (/mail|courriel/.test(cle)) v = f.courriel;
      else if (/t[ée]l[ée]?phone|portable/.test(cle)) v = f.tel;
      else if (/ville|city|commune/.test(cle)) v = f.ville;
      else if (/adresse|rue|voie/.test(cle)) v = f.adresse;
      else if (/instagram|facebook|linkedin|site|url|web/.test(cle)) v = "";
      else if (/ce que vous faites|activit|m[ée]tier|description|pr[ée]sent|propos/.test(cle)) v = [f.metier, f.slogan].filter(Boolean).join(" — ");
      else if (/prestation|service|offre/.test(cle)) v = f.presta;
      else if (/slogan|accroche|phrase/.test(cle)) v = f.slogan;
      else if (/nom|entreprise|soci[ée]t[ée]|raison|cabinet/.test(cle)) v = f.nom;
      if (!v) continue;
      const proto = c instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
      Object.getOwnPropertyDescriptor(proto.prototype, "value").set.call(c, v);
      c.dispatchEvent(new Event("input", { bubbles: true }));
      c.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, f);
}
