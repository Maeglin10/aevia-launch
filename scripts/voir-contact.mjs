/* Capture le pied de page avec une session factice : on interpose la réponse
   de /api/sessions pour que les coordonnées existent, puis on MESURE le lien
   rendu (href réel, hauteur, contraste) et on capture l'image. */
import { chromium } from "playwright";

const SESSION = {
  id: "verif-contact",
  formData: { businessName: "Atelier Vérification" },
  businessProfile: {
    contacts: { general: { phone: "+33 4 78 12 34 56", email: "bonjour@atelier-verif.fr" } },
    geo: { address: "12 rue des Capucins, 69001 Lyon" },
  },
  generatedContent: {},
};

const nav = await chromium.launch();
for (const n of [16, 18, 22, 147]) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route("**/api/sessions**", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(SESSION) }),
  );
  const p = await ctx.newPage();
  const erreurs = [];
  p.on("pageerror", (e) => erreurs.push(String(e)));
  await p.goto(`http://localhost:3000/templates/impact-${n}?session=verif-contact`, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(2500);

  const vu = await p.evaluate(() => {
    const bloc = document.querySelector(".aevia-contact-pied");
    if (!bloc) return { absent: true };
    bloc.scrollIntoView({ block: "center" });
    const liens = [...bloc.querySelectorAll("a")].map((a) => {
      const b = a.getBoundingClientRect();
      return { href: a.getAttribute("href"), texte: a.textContent.trim(), h: Math.round(b.height), l: Math.round(b.width) };
    });
    const b = bloc.getBoundingClientRect();
    return { liens, texte: bloc.textContent.trim().slice(0, 120), largeur: Math.round(b.width), dansEcran: b.right <= innerWidth + 1 };
  });
  await p.waitForTimeout(600);
  const debord = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await p.screenshot({ path: `captures/contact/impact-${n}-390.png` });
  console.log(`impact-${n} :`, JSON.stringify(vu), `· débord ${debord}px · ${erreurs.length} erreur(s)`, erreurs.slice(0, 1).join(""));
  await ctx.close();
}
await nav.close();
