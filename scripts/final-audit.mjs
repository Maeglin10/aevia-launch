// L'audit final : chaque thème, avec des données différentes à chaque fois.
//
//   node scripts/final-audit.mjs impact-01 impact-02 …
//   node scripts/final-audit.mjs --tranche 0 5      (une tranche sur cinq)
//
// Les balayages précédents semaient la même session pour les 373 thèmes. Deux
// défauts leur échappaient : une donnée qui ne s'affiche que pour un métier
// donné, et une image ou une couleur qui ne bouge pas parce qu'on lui redonnait
// la même valeur.
//
// Ici chaque thème reçoit sa propre entreprise — nom, ville, métier, couleur,
// prestations, tarifs, avis, horaires — et ses propres images, tirées des deux
// banques. On vérifie ensuite trois choses sur la page rendue :
//
//   ce qui doit apparaître  — le nom, la ville, l'accroche, les prestations…
//   ce qui doit disparaître — la ville, l'e-mail et le téléphone de démonstration
//   ce qui ne doit pas casser — une page blanche, une erreur, un « NaN »
//
// La couleur de marque est vérifiée sur le rendu calculé, pas dans le source :
// un thème peut la lire et ne jamais la peindre.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";

const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
  ids = tous.filter((_, i) => i % n === k);
}
if (ids.length === 0) {
  console.error("usage: node scripts/final-audit.mjs impact-01 … | --tranche 0 5");
  process.exit(1);
}

// De quoi donner à chaque thème une entreprise qui ne ressemble pas aux autres.
const VILLES = ["Annecy", "Chambéry", "Grenoble", "Lyon", "Valence", "Aix-les-Bains", "Voiron", "Albertville"];
const METIERS = ["plombier", "coiffeur", "avocat", "restaurateur", "photographe", "architecte", "kinésithérapeute", "fleuriste"];
const COULEURS = ["#c2410c", "#0e7490", "#4d7c0f", "#7e22ce", "#be123c", "#1d4ed8", "#a16207", "#0f766e"];

async function imagesDe(metier, n) {
  try {
    const r = await fetch(`${BASE}/api/stock?q=${encodeURIComponent(metier)}&n=${n}`);
    const { images } = await r.json();
    return (images ?? []).map((x) => x.url).filter(Boolean);
  } catch {
    return [];
  }
}

function donneesPour(id, i) {
  const ville = VILLES[i % VILLES.length];
  const metier = METIERS[i % METIERS.length];
  const couleur = COULEURS[i % COULEURS.length];
  const nom = `Maison ${id.replace("impact-", "M")}`;
  return {
    nom, ville, metier, couleur,
    formData: {
      businessName: nom,
      city: ville,
      businessType: metier,
      tagline: `Votre ${metier} à ${ville}`,
      email: `contact@${id}.fr`,
      phone: "04 50 11 22 33",
      brandColor: couleur,
      template: id,
    },
    businessProfile: {
      services: [
        { name: `Prestation ${id}`, price: "137 €", description: "La première, décrite en une phrase." },
        { name: `Seconde prestation ${id}`, price: "249 €", description: "La seconde." },
      ],
      reputation: { featuredReviews: [{ author: `Client ${id}`, text: `Travail impeccable chez ${nom}.`, rating: 5 }] },
      keyStats: [{ value: "18", label: "années d'expérience" }],
      certifications: [`Label ${id}`],
      faq: [{ q: `Question ${id} ?`, a: "La réponse." }],
      team: [{ name: `Équipier ${id}`, role: "Responsable" }],
      openingHours: [
        { day: "Lundi", open: "08:30", close: "18:00" },
        { day: "Dimanche", closed: true },
      ],
      geo: { primaryCity: ville, address: `${(i % 40) + 1} rue des Alpes, ${ville}`, serviceAreas: [ville] },
    },
    generatedContent: { heroHeadline: `Votre ${metier} à ${ville}`, aboutTitle: `À propos de ${nom}` },
  };
}

const VILLES_DEMO = ["Paris", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Lille", "Strasbourg", "Rennes", "Montpellier", "Nice"];

/*
  Ce qu'un thème déclare afficher. Sans ce filtre, l'audit réclame une équipe à
  un thème qui n'en montre pas et le compte en échec pour un bloc absent par
  construction.
*/
const capabilites = fs.readFileSync(path.join(process.cwd(), "lib/templates/capabilities.ts"), "utf8");
const MANIFESTE = {};
for (const m of capabilites.matchAll(/"(impact-[\w-]+)":\s*\[([^\]]*)\]/g)) {
  MANIFESTE[m[1]] = [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]);
}
const BLOC_DE = {
  prestation: "prestations", prix: "tarifs", avis: "avis",
  chiffre: "chiffres", equipier: "equipe", label: "engagements", question: "faq",
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let n = 0;

for (const id of ids) {
  const d = donneesPour(id, n++);
  const photos = await imagesDe(d.metier, 6);

  const post = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: { ...d.formData, photoUrls: photos } }),
  });
  const { sessionId } = await post.json();
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ businessProfile: d.businessProfile, generatedContent: d.generatedContent }),
  });

  const p = await ctx.newPage();
  const erreurs = [];
  p.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 90)));
  try {
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2600);
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 900) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(500);

    const { texte, images, couleurVue } = await p.evaluate((couleur) => {
      const hex = couleur.replace("#", "").toLowerCase();
      const rgb = [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16));
      const cible = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      let vue = false;
      for (const e of document.querySelectorAll("*")) {
        const s = getComputedStyle(e);
        if (s.color === cible || s.backgroundColor === cible || s.borderColor === cible) { vue = true; break; }
      }
      return {
        texte: document.body.innerText,
        images: [...document.querySelectorAll("img")].map((i) => i.currentSrc || i.src),
        couleurVue: vue,
      };
    }, d.couleur);

    const bas = texte.toLowerCase();
    const manquent = Object.entries({
      nom: d.nom, ville: d.ville, accroche: d.formData.tagline,
      prestation: `Prestation ${id}`, prix: "137 €", avis: `Travail impeccable chez ${d.nom}`,
      chiffre: "18", equipier: `Équipier ${id}`, label: `Label ${id}`, question: `Question ${id}`,
    })
      .filter(([k]) => !BLOC_DE[k] || (MANIFESTE[id] ?? []).includes(BLOC_DE[k]))
      .filter(([, v]) => !bas.includes(String(v).toLowerCase()))
      .map(([k]) => k);

    const restes = [];
    for (const v of VILLES_DEMO) if (v !== d.ville && new RegExp(`\\b${v}\\b`, "i").test(texte)) restes.push(v);
    for (const m of texte.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g) ?? [])
      if (m !== d.formData.email) restes.push(m);
    if (/\bNaN\b|undefined/.test(texte)) restes.push("NaN/undefined");

    /*
      `next/image` réécrit l'adresse en `/_next/image?url=…%2F…`. Comparer les
      chaînes entières concluait que la photo du client n'était pas affichée
      alors qu'elle l'était : on cherche l'identifiant de la photo dans ce que
      le navigateur a réellement chargé.
    */
    const empreinte = (u) => (u.match(/\/([\w-]{6,})\.(jpe?g|png|webp)/i)?.[1] ?? u.split("/").pop() ?? "").slice(0, 24);
    const chargees = images.join(" ") + " " + decodeURIComponent(images.join(" "));
    const photosVues = photos.length === 0 ? "—" : (photos.some((u) => chargees.includes(empreinte(u))) ? "oui" : "non");

    console.log(
      `${id.padEnd(12)} manquent:${manquent.join(",") || "rien"}` +
      ` | restes:${[...new Set(restes)].slice(0, 3).join(",") || "rien"}` +
      ` | photos:${photosVues} | couleur:${couleurVue ? "oui" : "non"}` +
      (/couldn.t load/i.test(texte) ? " | PAGE PLANTÉE" : "") +
      (erreurs.length ? ` | ERREUR ${erreurs[0]}` : ""),
    );
  } catch (e) {
    console.log(`${id.padEnd(12)} ÉCHEC ${String(e).slice(0, 80)}`);
  } finally {
    await p.close();
  }
}

await b.close();
