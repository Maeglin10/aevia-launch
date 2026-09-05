// Les pages annexes tiennent-elles sur un téléphone, avec la donnée du client ?
//
//   node scripts/qa-annexes-responsive.mjs --tranche 0 4
//
// Le responsive des pages d'accueil a été mesuré ; celui des 447 pages annexes
// ne l'a jamais été. Une boutique, une carte ou une page de réservation qui
// déborde sur téléphone est invendable, et c'est là que le client passe.
//
// Trois défauts, et rien d'autre :
//   1. la page défile horizontalement — le contenu ne tient pas dans l'écran ;
//   2. un texte du CLIENT sort de son cadre ou de l'écran ;
//   3. une cible tactile trop petite pour un doigt (moins de 32 px).
//
// On envoie un nom long et des prestations reconnaissables : ce sont les
// données du client qui doivent tenir, pas celles de la démonstration.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const LARGEUR = Number(process.env.LARGEUR ?? 390);
const HAUTEUR = Number(process.env.HAUTEUR ?? 844);

/*
  TEMOIN=1 arme un témoin de contrôle : un nom de deux cents lettres, qui DOIT
  produire du texte hors écran. S'il n'en produit aucun, c'est la mesure qui est
  morte, pas le produit qui est sain — l'erreur qui a coûté quatre campagnes.
*/
const NOM = process.env.TEMOIN
  ? "Ateliers Vidal Marquisats Bellevaux et Fils Réunis Plomberie Chauffage Sanitaire depuis Mille Neuf Cent Douze Maison Fondée à Annecy Haute Savoie France Européenne Internationale Mondiale Universelle"
  : "Ateliers Vidal & Fils";
const PROFIL = {
  services: [
    { name: "Détartrage Vidal", description: "Intervention en moins d'une heure.", price: "45€" },
    { name: "Colonne Marquisats", description: "Remplacement complet, garantie dix ans.", price: "1 250€" },
  ],
  faq: [{ q: "Intervenez-vous le dimanche ?", a: "Oui, au tarif annoncé d'avance." }],
  team: [{ name: "Éloi Vidal", role: "Maître plombier" }],
  reputation: { featuredReviews: [{ author: "Perrine Anselme", text: "Intervention nette, chantier laissé propre.", rating: 5 }] },
  geo: { address: "12 rue des Marquisats, 74000 Annecy" },
};

const LEGALES = new Set(["mentions", "mentions-legales", "cgu", "cgv", "confidentialite", "privacy", "legal"]);
const RACINE = path.join(process.cwd(), "app/templates");
const pages = [];
for (const theme of fs.readdirSync(RACINE).filter((d) => d.startsWith("impact-")).sort()) {
  for (const e of fs.readdirSync(path.join(RACINE, theme), { withFileTypes: true })) {
    if (!e.isDirectory() || LEGALES.has(e.name)) continue;
    if (fs.existsSync(path.join(RACINE, theme, e.name, "page.tsx"))) pages.push({ theme, route: e.name });
  }
}

const args = process.argv.slice(2);
let choisies = pages;
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  choisies = pages.filter((_, i) => i % n === k);
} else if (args.length) {
  choisies = pages.filter((p) => args.includes(p.theme) || args.includes(`${p.theme}/${p.route}`));
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: LARGEUR, height: HAUTEUR }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const fiches = [];

for (const { theme, route } of choisies) {
  let fiche = { theme, route };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData: {
        businessName: NOM, city: "Annecy", businessType: "plombier",
        tagline: "Votre plombier de confiance à Annecy depuis 1998",
        email: "contact@ateliers-vidal.fr", phone: "04 50 11 22 33",
        brandColor: "#c2410c", template: theme,
      } }),
    });
    const { sessionId, editToken } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ?)");
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ businessProfile: PROFIL }),
    });

    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${theme}/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
    // Les passes globales s'exécutent jusqu'à 4 s après le rendu.
    await p.waitForTimeout(4600);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    /*
      Une navigation qui pivote au défilement change de taille pendant son
      animation : mesuré trop tôt, un lien de 34 px de large en paraît 19. On
      laisse l'animation finir avant de conclure.
    */
    await p.waitForTimeout(2000);

    const releve = await p.evaluate(({ largeur, valeurs }) => {
      const marge = 2; // les arrondis de sous-pixel ne sont pas des défauts
      const doc = document.documentElement;
      const defile = doc.scrollWidth > largeur + marge;

      /*
        Un cadre qui défile ou masque à dessein (carrousel, bandeau animé)
        rogne son contenu volontairement : ce n'est pas un défaut.
      */
      const voulu = (e) => {
        for (let n = e; n && n !== document.body; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (["auto", "scroll", "hidden", "clip"].includes(s.overflowX)) return true;
          if (s.animation !== "none" || s.transform !== "none") return true;
        }
        return false;
      };

      const coupes = [];
      const dehors = [];
      for (const e of document.querySelectorAll("body *")) {
        if (e.children.length > 0) continue;
        const t = (e.textContent ?? "").replace(/\s+/g, " ").trim();
        if (!t) continue;
        // Seuls les textes du client comptent : le reste appartient au thème.
        if (!valeurs.some((v) => t.includes(v))) continue;
        const s = getComputedStyle(e);
        if (s.display === "none" || s.visibility === "hidden") continue;
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > largeur + marge || r.left < -marge) { dehors.push(t.slice(0, 40)); continue; }
        if (e.scrollWidth > e.clientWidth + marge && !voulu(e)) coupes.push(t.slice(0, 40));
      }

      /*
        Une cible tactile : ce qu'un doigt doit atteindre. On mesure la boîte
        réellement cliquable, pas l'icône à l'intérieur — un bouton de 44 px
        contenant un glyphe de 16 px est confortable.
      */
      const petites = [];
      const boites = [];
      for (const e of document.querySelectorAll("a, button, [role=button], input, select")) {
        const s = getComputedStyle(e);
        if (s.display === "none" || s.visibility === "hidden" || s.pointerEvents === "none") continue;
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.bottom < 0 || r.top > innerHeight * 12) continue;
        /*
          Deux exemptions, vérifiées à l'œil sur les premiers relevés :

          — le lien d'évitement « Aller au contenu principal », replié en 1×1
            tant qu'il n'a pas le focus, et pleine taille dès qu'il l'a ;
          — un lien de texte au fil d'un paragraphe : WCAG 2.5.8 les exempte
            explicitement, et les souligner ici noierait le vrai défaut.

          Reste ce qu'un doigt doit viser sans aide : boutons, liens isolés,
          champs. C'est là que vit le menu burger de 20 px de large.
        */
        if (/\bsr-only\b|lien-evitement|skip-link/.test(String(e.className ?? ""))) continue;
        if (s.display.startsWith("inline") && e.tagName === "A") continue;
        /*
          Une navigation qui pivote au défilement n'a pas de taille stable :
          impact-68 donne 34 px de large au repos et 19 en cours de rotation,
          d'une mesure à l'autre. C'est au repos que le doigt la vise — la même
          exemption que pour le texte d'un bandeau animé.
        */
        if (voulu(e)) continue;
        /*
          La zone touchable n'est pas la boîte : la passe globale l'étend par
          un pseudo-élément, précisément pour ne déplacer aucun voisin. La
          mesure doit lire cette extension, sinon elle continue de compter des
          défauts déjà corrigés.
        */
        const mx = parseFloat(s.getPropertyValue("--cible-x")) || 0;
        const my = parseFloat(s.getPropertyValue("--cible-y")) || 0;
        const zone = { left: r.left - mx, top: r.top - my, width: r.width + 2 * mx, height: r.height + 2 * my };
        if (Math.min(zone.width, zone.height) >= 32) continue;
        boites.push({ e, r: zone });
      }

      /*
        L'exception d'espacement de WCAG 2.5.8, sans quoi l'instrument
        sur-déclare massivement : une cible plus petite que 24 px reste
        conforme si un cercle de 24 px centré dessus ne touche aucune autre
        cible. Les liens de pied de page mesurent 22 px de haut mais sont
        espacés de 36 — un doigt ne peut pas se tromper de lien.

        Sans cette règle : 446 cibles sur 235 pages. Avec : 8, toutes le même
        bouton de menu. Le premier chiffre aurait noyé le seul vrai défaut.
      */
      const petitesBoites = boites;
      for (const { e, r } of petitesBoites) {
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const voisine = petitesBoites.some((a) => a.e !== e
          && Math.abs(a.r.left + a.r.width / 2 - cx) < 24
          && Math.abs(a.r.top + a.r.height / 2 - cy) < 24);
        if (!voisine && Math.min(r.width, r.height) >= 20 && Math.max(r.width, r.height) >= 24) continue;
        petites.push(`${((e.textContent ?? "").trim() || e.tagName).slice(0, 20)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }

      return { defile, largeurDoc: doc.scrollWidth, coupes, dehors, petites: [...new Set(petites)] };
    }, { largeur: LARGEUR, valeurs: [NOM, "Détartrage Vidal", "Colonne Marquisats", "Éloi Vidal", "Perrine Anselme", "Annecy", "04 50 11 22 33"] });

    await p.close();
    fiche = { theme, route, ...releve };
  } catch (e) {
    fiche = { theme, route, erreur: String(e.message).slice(0, 60) };
  }
  fiches.push(fiche);
  const souci = fiche.defile || fiche.coupes?.length || fiche.dehors?.length || fiche.petites?.length || fiche.erreur;
  if (souci) {
    const quoi = [
      fiche.defile ? `défile (${fiche.largeurDoc}px)` : "",
      fiche.dehors?.length ? `hors écran: ${fiche.dehors[0]}` : "",
      fiche.coupes?.length ? `amputé: ${fiche.coupes[0]}` : "",
      fiche.petites?.length ? `${fiche.petites.length} cibles < 32px` : "",
      fiche.erreur ?? "",
    ].filter(Boolean).join(" · ");
    console.log(`${theme}/${route}  ${quoi}`);
  }
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const d = fiches.filter((f) => f.defile).length;
const h = fiches.filter((f) => f.dehors?.length).length;
const c = fiches.filter((f) => f.coupes?.length).length;
const t = fiches.filter((f) => f.petites?.length).length;
console.log(`\n${fiches.length} pages à ${LARGEUR}px · ${d} défilent · ${h} avec du texte hors écran · ${c} amputé · ${t} avec des cibles trop petites`);
