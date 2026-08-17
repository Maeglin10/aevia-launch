/*
  Photographier chaque thème en entier, avec la donnée d'un vrai client.

    node scripts/capturer-themes.mjs [--depuis 0] [--jusqua 373] [--largeur 1440]

  Les mesures automatiques ont montré leurs limites : elles disent « le nom est
  là » sans dire si la page est belle, si un texte déborde, si une section est
  vide. On photographie donc la page entière, à l'écran d'ordinateur et de
  téléphone, et l'on regarde.

  Le client de référence remplit tout — prestations, avis, chiffres, garanties,
  questions, équipe, horaires, réalisations — pour qu'aucune section ne reste
  sur l'exemple du thème. Un texte volontairement long sert à voir si la mise
  en page tient.
*/
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { clientPour } from "./clients-types.mjs";

const BASE = process.env.BASE ?? "http://127.0.0.1:3000";
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? Number(process.argv[i + 1]) : d; };
const SORTIE = process.env.SORTIE ?? "/tmp/captures";
fs.mkdirSync(SORTIE, { recursive: true });

/*
  Chaque thème est éprouvé avec le métier auquel le formulaire le propose.
  Juger un thème de restaurant avec les données d'un couvreur produisait des
  centaines de faux défauts : ce n'était pas le thème qui déraillait.
*/
const SECTEURS_DU_THEME = JSON.parse(fs.readFileSync("/tmp/theme-secteurs.json", "utf8"));
/*
  Le contenu généré, produit par la même fonction que `/api/generate` — voir
  scripts/contenu-genere.ts. Sans lui, chaque `c?.aboutText ?? …` du thème
  tombait sur l'exemple de la démonstration, et l'on comptait comme « anglais
  resté » de la prose qu'un vrai client n'aurait jamais vue.
*/
const CONTENU_GENERE = JSON.parse(fs.readFileSync("/tmp/contenu-genere.json", "utf8"));
const DOMAINE_DU_SECTEUR = JSON.parse(fs.readFileSync("/tmp/secteur-domaine.json", "utf8"));

function domainePour(theme) {
  const secteurs = SECTEURS_DU_THEME[theme] ?? [];
  for (const s of secteurs) if (DOMAINE_DU_SECTEUR[s]) return DOMAINE_DU_SECTEUR[s];
  return null; /* Thème que le formulaire ne propose à personne. */
}

const themes = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)));
const debut = arg("depuis", 0), fin = arg("jusqua", themes.length);

const nav = await chromium.launch();
const fiches = [];
for (let i = debut; i < fin && i < themes.length; i++) {
  const theme = themes[i];
  let fiche = { theme };
  try {
    const domaine = domainePour(theme);
    const client = clientPour(domaine ?? "Services & Artisanat");
    fiche.domaine = domaine ?? "(non proposé)";
    fiche.client = client.form.businessName;
    const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ formData: { ...client.form, template: theme } }) });
    const { sessionId } = await r.json();
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        businessProfile: client.profil,
        generatedContent: CONTENU_GENERE[domaine ?? "Services & Artisanat"],
      }),
    });

    for (const [nom, taille] of [["ordi", { width: 1440, height: 900 }], ["tel", { width: 390, height: 844 }]]) {
      const ctx = await nav.newContext({ viewport: taille, isMobile: nom === "tel", deviceScaleFactor: 1 });
      const p = await ctx.newPage();
      await p.goto(`${BASE}/templates/${theme}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      /* Attendre que la donnée du client soit à l'écran, pas seulement dans le DOM. */
      await p.waitForFunction((nomClient) => {
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          if (!(n.nodeValue ?? "").includes(nomClient)) continue;
          const e = n.parentElement; if (!e || e.closest("style,script")) continue;
          const rc = e.getBoundingClientRect();
          if (rc.width >= 1 && rc.height >= 1) return true;
        }
        return false;
      }, client.form.businessName, { timeout: 20000 }).catch(() => {});
      /* Descendre pour déclencher les animations d'apparition, puis remonter. */
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
        window.scrollTo(0, 0);
      });
      /*
         Attendre que la page se taise. Beaucoup de thèmes animent leurs
         chiffres en les faisant défiler jusqu'à la valeur finale : photographiés
         en plein vol, « 1974 » devient « 1 946,33 » et « 480 » devient
         « 473,3 ». La capture accusait alors le thème d'afficher n'importe quoi.
      */
      let empreinte = null;
      for (let essai = 0; essai < 14; essai++) {
        await p.waitForTimeout(450);
        const maintenant = await p.evaluate(() => (document.body.innerText ?? "").slice(0, 4000));
        if (maintenant === empreinte) break;
        empreinte = maintenant;
      }
      if (nom === "ordi") {
        /*
           Le texte visible, mot pour mot : c'est là qu'on voit l'anglais resté
           sur un site français, et les phrases du métier de la démonstration.
        */
        fiche.texte = await p.evaluate(() => {
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
        });
        fiche = { ...fiche, ...(await p.evaluate(() => ({
          hauteur: document.body.scrollHeight,
          sections: document.querySelectorAll("section").length,
          deCote: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        }))) };
      }
      await p.screenshot({ path: path.join(SORTIE, `${theme}-${nom}.png`), fullPage: true });
      await ctx.close();
    }
  } catch (e) {
    fiche.erreur = String(e).slice(0, 80);
  }
  fiches.push(fiche);
  console.log(`${String(i + 1).padStart(3)}/${themes.length} ${theme.padEnd(12)} ${fiche.erreur ? "✗ " + fiche.erreur : `${fiche.sections} sections · ${fiche.hauteur} px · déborde ${fiche.deCote} px`}`);
  fs.writeFileSync(path.join(SORTIE, "fiches.json"), JSON.stringify(fiches, null, 1));
}
await nav.close();
