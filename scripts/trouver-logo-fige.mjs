/* Le logo de la barre, écrit en dur.

   On ne cherche pas la marque au hasard dans le fichier — une bannière de
   commentaire ou un témoignage la contient aussi. On ouvre le premier bloc
   <nav>/<header> et on rend la première portée de texte littéral qui n'est
   pilotée ni par clientName, ni par fd?.businessName. */
import fs from "node:fs";

const themes = process.argv.slice(2);
for (const t of themes) {
  const candidats = ["page.tsx", "layout.tsx"].map((n) => `app/templates/${t}/${n}`).filter((p) => fs.existsSync(p));
  for (const f of candidats) {
    const L = fs.readFileSync(f, "utf8").split("\n");
    const iNav = L.findIndex((l) => /<(motion\.)?(nav|header)\b/.test(l));
    if (iNav < 0) continue;
    /* la barre : au plus 60 lignes après son ouverture */
    const fenetre = L.slice(iNav, Math.min(iNav + 60, L.length));
    const lignes = [];
    fenetre.forEach((l, k) => {
      if (/client(Name|Trade)|fd\?\.businessName|logoBase64/.test(l)) return;
      /* du texte visible entre balises, au moins trois lettres */
      const m = />\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9'&.\- ]{2,})\s*</.exec(l);
      if (m && !/^(Accueil|Contact|Services|Menu|Réserver|Devis|Blog|Tarifs|À propos)$/i.test(m[1].trim()))
        lignes.push(`${f}:${iNav + k + 1}  ${l.trim().slice(0, 130)}`);
    });
    if (lignes.length) { console.log(`### ${t}`); lignes.slice(0, 3).forEach((x) => console.log("   ", x)); }
  }
}
