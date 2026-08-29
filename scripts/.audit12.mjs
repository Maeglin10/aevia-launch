import { chromium } from "playwright";
const cibles = [12,16,18,21,22,23,45,59,68,81,147,168];
const b = await chromium.launch({ headless: true });
console.log(`${"thème".padEnd(11)} ${"form".padEnd(6)} ${"champ mail".padEnd(11)} ${"mail en texte".padEnd(14)} ${"tel en texte".padEnd(13)} verdict`);
for (const n of cibles) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:3000/templates/impact-${n}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(3000);
    /* dérouler toute la page : certaines sections ne montent qu'au défilement */
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); } });
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const t = document.body.innerText;
      return {
        form: !!document.querySelector("form"),
        champMail: !!document.querySelector('input[type="email"]'),
        mailTexte: (t.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i) || [])[0] || null,
        telTexte: (t.match(/(?:\+33|0)\s?\d(?:[\s.\-]?\d\d){4}/) || [])[0] || null,
      };
    });
    const verdict = r.form || r.champMail ? "formulaire" : r.mailTexte || r.telTexte ? "coordonnées en texte, non cliquables" : "AUCUN MOYEN DE CONTACT";
    console.log(`impact-${String(n).padEnd(4)} ${(r.form?"oui":"—").padEnd(6)} ${(r.champMail?"oui":"—").padEnd(11)} ${String(r.mailTexte??"—").slice(0,13).padEnd(14)} ${String(r.telTexte??"—").padEnd(13)} ${verdict}`);
  } catch (e) { console.log(`impact-${n} : erreur ${e.message.split("\n")[0].slice(0,40)}`); }
  finally { await ctx.close(); }
}
await b.close();
