// Une capture par thème, avec les données d'un vrai client.
//
//   node scripts/captures-client.mjs --tranche 0 4 --sortie /tmp/vue
//
// Les planches de contact montrent quatre thèmes à la fois, sur un tiers de
// leur largeur : on y voit qu'une page existe, pas si elle est bien faite.
// Pour juger, il faut la voir seule, dans sa taille, et avec les données d'un
// client — pas celles de la démonstration.
//
// On photographie donc le premier écran et le déroulé complet, séparément :
// le premier dit si la page accueille, le second si toutes ses sections
// tiennent debout une fois remplies.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const args = process.argv.slice(2);
const sortie = args.includes("--sortie") ? args[args.indexOf("--sortie") + 1] : "/tmp/vue";
const entier = args.includes("--entier");
const largeur = args.includes("--telephone") ? 390 : 1440;
const hauteur = args.includes("--telephone") ? 844 : 900;

const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

fs.mkdirSync(sortie, { recursive: true });

/*
  Un client complet, mais ordinaire : un nom qui déborde un peu, une accroche
  d'une ligne et demie, quatre photos verticales prises au téléphone, et de quoi
  remplir chaque section — c'est ce que remplit quelqu'un qui prend le
  formulaire au sérieux.
*/
const PHOTO = (n) => `https://images.pexels.com/photos/${n}/pexels-photo-${n}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
const formDataBase = {
  businessName: "Ateliers Vidal & Fils",
  city: "Annecy",
  businessType: "plombier",
  tagline: "Plomberie, chauffage et énergies renouvelables à Annecy depuis 1998",
  email: "contact@ateliers-vidal.fr",
  phone: "04 50 11 22 33",
  brandColor: "#0f766e",
  photoUrls: [7937300, 8486944, 5691659, 6444258].map(PHOTO),
};
const profil = {
  services: [
    { name: "Dépannage d'urgence", description: "Une heure sur place, sept jours sur sept.", price: "90 €" },
    { name: "Chaudière et pompe à chaleur", description: "Installation, entretien, mise aux normes.", price: "Sur devis" },
    { name: "Salle de bains", description: "Du plan au dernier joint, un seul interlocuteur.", price: "Sur devis" },
    { name: "Recherche de fuite", description: "Caméra thermique, sans casse.", price: "180 €" },
  ],
  reputation: { featuredReviews: [
    { author: "Perrine A.", text: "Arrivés en cinquante minutes un dimanche, fuite réglée, prix annoncé tenu.", rating: 5 },
    { author: "Marc T.", text: "Chaudière remplacée en une journée, chantier laissé propre.", rating: 5 },
    { author: "Sylvie R.", text: "Devis clair, pas de surprise à la facture.", rating: 5 },
  ] },
  keyStats: [
    { value: "27", label: "ans de métier" }, { value: "4 200", label: "interventions" },
    { value: "1 h", label: "délai d'urgence" }, { value: "4,9", label: "note Google" },
  ],
  team: [
    { name: "Éloi Vidal", role: "Maître plombier" }, { name: "Léa Vidal", role: "Chauffagiste" },
    { name: "Karim B.", role: "Technicien PAC" },
  ],
  certifications: ["RGE Qualibat", "Qualigaz", "Garantie décennale", "Artisan de Haute-Savoie"],
  faq: [
    { q: "Intervenez-vous le dimanche ?", a: "Oui, sept jours sur sept, avec la même majoration annoncée d'avance." },
    { q: "Le devis est-il payant ?", a: "Non. Le déplacement d'urgence, lui, est facturé 90 € et déduit si vous signez." },
    { q: "Quels délais pour une salle de bains ?", a: "Trois semaines de chantier, six à huit de délai avant le début." },
  ],
  beforeAfter: [
    { caption: "Salle de bains, Annecy-le-Vieux", beforeUrl: PHOTO(6444258), afterUrl: PHOTO(7937300) },
    { caption: "Chaufferie collective, Seynod", beforeUrl: PHOTO(8486944), afterUrl: PHOTO(5691659) },
  ],
  openingHours: [
    { day: "lundi", open: "08:00", close: "18:30" }, { day: "mardi", open: "08:00", close: "18:30" },
    { day: "mercredi", open: "08:00", close: "18:30" }, { day: "jeudi", open: "08:00", close: "18:30" },
    { day: "vendredi", open: "08:00", close: "17:00" }, { day: "samedi", open: "09:00", close: "12:00" },
    { day: "dimanche", closed: true },
  ],
  geo: { address: "12 rue des Marquisats", primaryCity: "Annecy", serviceAreas: ["Annecy", "Seynod", "Cran-Gevrier", "Épagny"] },
  bookingSystem: { url: "https://exemple.fr/rendez-vous" },
  paymentMethods: ["Carte bancaire", "Virement", "Chèque"],
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: largeur, height: hauteur }, isMobile: largeur < 500, hasTouch: largeur < 500 });

for (const id of ids) {
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData: { ...formDataBase, template: id } }),
    });
    const { sessionId, editToken } = await r.json();
    await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
      method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
      body: JSON.stringify({ businessProfile: profil }),
    });

    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3000);

    if (entier) {
      /*
        Les sections n'apparaissent qu'au défilement : on descend par paliers
        pour les déclencher toutes, puis on remonte avant la photographie.
      */
      await p.evaluate(async () => {
        const pas = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += pas) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 220));
        }
        window.scrollTo(0, 0);
      });
      await p.waitForTimeout(900);
    }

    await p.screenshot({ path: path.join(sortie, `${id}.png`), fullPage: entier });
    await p.close();
    console.log(id);
  } catch (e) {
    console.log(`${id} ÉCHEC ${String(e.message).slice(0, 50)}`);
  }
}

await b.close();
