// Parcourt le wizard comme un client, du choix du métier jusqu'à l'aperçu.
//
//   node scripts/client-run.mjs "Santé" "Dentiste" "Cabinet Dupont" "Lyon"
//
// Le test qui compte : pas d'appel d'API, pas de session semée à la main. On
// clique, on remplit, on téléverse une photo, on regarde ce que le client voit.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";
const [industrie, metier, entreprise, ville] = process.argv.slice(2);

// Une vraie image, assez grande pour passer le contrôle de dimensions.
const PNG = "/tmp/client-photo.png";
if (!fs.existsSync(PNG)) {
  const { execSync } = await import("node:child_process");
  execSync(`python3 -c "
import struct, zlib
def png(w,h,p):
    def ch(t,d):
        c=t+d
        return struct.pack('>I',len(d))+c+struct.pack('>I',zlib.crc32(c)&0xffffffff)
    raw=b''.join(b'\\x00'+b'\\x33\\x66\\x99'*w for _ in range(h))
    open(p,'wb').write(b'\\x89PNG\\r\\n\\x1a\\n'+ch(b'IHDR',struct.pack('>IIBBBBB',w,h,8,2,0,0,0))+ch(b'IDAT',zlib.compress(raw))+ch(b'IEND',b''))
png(1800,1200,'${PNG}')
"`);
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1100 } });
ctx.setDefaultTimeout(12000);
await ctx.addInitScript(() => {
  try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, ts: Date.now() }));
  } catch {}
});
const p = await ctx.newPage();
const erreurs = [];
p.on("pageerror", (e) => erreurs.push(String(e).slice(0, 160)));

const etapes = [];
await p.goto(`${BASE}/configure`, { waitUntil: "domcontentloaded" });
await p.getByRole("button", { name: industrie, exact: false }).first().click();
await p.waitForTimeout(500);
await p.getByRole("button", { name: metier, exact: false }).first().click();
await p.waitForTimeout(900);

// Choix du thème : la deuxième carte à image (la première est le logo).
const cartes = p.locator("button:has(img)");
const nbCartes = await cartes.count();
const carte = cartes.nth(nbCartes > 1 ? 1 : 0);
const nomTheme = (await carte.innerText().catch(() => "")).split("\n")[0].slice(0, 40);
await carte.click({ force: true });
await p.waitForTimeout(700);
etapes.push(`thème choisi : ${nomTheme}`);

const REPONSES = {
  "nom de votre entreprise": entreprise,
  entreprise: entreprise,
  ville: ville,
  accroche: `Votre ${metier.toLowerCase()} à ${ville}`,
  slogan: `Votre ${metier.toLowerCase()} à ${ville}`,
  // L'étiquette du champ d'accroche est « Ce que vous faites », pas « accroche » :
  // sans cette entrée, le harnais y écrivait son texte de repli et concluait que
  // l'accroche du client ne s'affichait pas.
  "ce que vous faites": `Votre ${metier.toLowerCase()} à ${ville}`,
  "que vous faites": `Votre ${metier.toLowerCase()} à ${ville}`,
  "e-mail": "client@exemple.fr",
  email: "client@exemple.fr",
  téléphone: "04 78 00 00 00",
};

for (let etape = 0; etape < 7; etape++) {
  const titre = await p.locator("h2").first().innerText().catch(() => "");
  // Déplier tout ce qui est repliable pour tout renseigner.
  const plis = p.locator('button[aria-expanded="false"]');
  for (let k = 0; k < (await plis.count()); k++) {
    await plis.nth(k).click({ timeout: 2000 }).catch(() => {});
  }
  await p.waitForTimeout(300);

  const champs = p.locator("input[type=text]:visible, input:not([type]):visible, input[type=email]:visible, input[type=tel]:visible, textarea:visible");
  for (let k = 0; k < (await champs.count()); k++) {
    const el = champs.nth(k);
    if ((await el.inputValue().catch(() => "x")) !== "") continue;
    const ph = ((await el.getAttribute("placeholder")) ?? "").toLowerCase();
    const aria = ((await el.getAttribute("aria-label")) ?? "").toLowerCase();
    /*
      L'étiquette n'est ni le placeholder ni l'aria-label : c'est un élément
      voisin, rendu par <Field>. Sans la lire, le champ « Ville » recevait le
      texte de repli et le test concluait que la ville ne s'affichait pas, alors
      qu'elle n'avait jamais été saisie.
    */
    const etiquette = (
      await el.evaluate((n) => {
        let e = n.parentElement;
        for (let k = 0; k < 4 && e; k++) {
          const t = e.querySelector("label, p, span");
          if (t && t.textContent && t.textContent.trim().length < 40) return t.textContent.trim();
          e = e.parentElement;
        }
        return "";
      }).catch(() => "")
    ).toLowerCase();
    let val = null;
    for (const [cle, v] of Object.entries(REPONSES)) {
      if (ph.includes(cle) || aria.includes(cle) || etiquette.includes(cle)) { val = v; break; }
    }
    if (!val) val = ph.includes("@") ? "client@exemple.fr" : `${entreprise} — ${ph.slice(0, 24) || "info"}`;
    await el.fill(val, { timeout: 2500 }).catch(() => {});
  }

  // Photos : remplir chaque emplacement du thème.
  const zones = p.locator('input[type="file"]:not([accept*="svg"])');
  for (let k = 0; k < Math.min(await zones.count(), 8); k++) {
    await zones.nth(k).setInputFiles(PNG).catch(() => {});
    await p.waitForTimeout(900);
  }

  etapes.push(`${titre.replace(/\n/g, " ")} — ${await champs.count()} champ(s)`);

  const suivant = p.getByRole("button", { name: /Continuer|Suivant|Générer|Créer/i });
  if ((await suivant.count()) === 0) break;
  await suivant.first().click({ force: true }).catch(() => {});
  await p.waitForTimeout(1600);
  if (p.url().includes("/preview/")) break;
}

// Attendre l'aperçu.
for (let k = 0; k < 40 && !p.url().includes("/preview/"); k++) await p.waitForTimeout(1000);
const surApercu = p.url().includes("/preview/");
console.log(JSON.stringify({
  metier, theme: nomTheme, etapes, surApercu, url: p.url().replace(BASE, ""), erreurs: erreurs.slice(0, 3),
}, null, 1));

if (surApercu) {
  await p.waitForTimeout(4000);
  const frame = p.frames().find((f) => f.url().includes("/templates/"));
  const texte = frame ? await frame.evaluate(() => document.body.innerText) : "";
  /*
    Ce qui reste du thème après le passage du client. Une ville de démonstration
    ou un e-mail d'exemple sur la page livrée est plus grave qu'un bloc générique :
    le client y lit les coordonnées de quelqu'un d'autre sans s'en apercevoir.
  */
  const VILLES_DEMO = ["Bordeaux", "Paris", "Marseille", "Toulouse", "Nantes", "Lille",
    "Strasbourg", "Rennes", "Montpellier", "Nice", "Grenoble", "Annecy", "Bourg-en-Bresse"]
    .filter((v) => v.toLowerCase() !== ville.toLowerCase());
  const restes = [];
  for (const v of VILLES_DEMO) if (new RegExp(`\\b${v}\\b`).test(texte)) restes.push(`ville ${v}`);
  for (const m of texte.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g) ?? [])
    if (m !== "client@exemple.fr") restes.push(`e-mail ${m}`);
  for (const m of texte.match(/\b0[1-9](?:[ .-]?\d{2}){4}\b/g) ?? [])
    if (m.replace(/\D/g, "") !== "0478000000") restes.push(`téléphone ${m}`);
  if (/Aevia WS|Valentin Milliand/.test(texte)) restes.push("éditeur Aevia");

  console.log(JSON.stringify({
    nomVu: texte.includes(entreprise),
    villeVue: texte.includes(ville),
    accrocheVue: texte.includes(`Votre ${metier.toLowerCase()} à ${ville}`),
    plantee: /couldn.t load/i.test(texte),
    theme: (frame?.url() ?? "").match(/templates\/(impact-[\w-]+)/)?.[1] ?? "?",
    restesDemo: [...new Set(restes)].slice(0, 8),
    extrait: texte.slice(0, 160).replace(/\n/g, " | "),
  }, null, 1));
  await p.screenshot({ path: `/tmp/client-${metier.replace(/\W/g, "")}.png`, fullPage: false });
}
await b.close();
