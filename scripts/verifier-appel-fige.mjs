/* L'appel évalué trop tôt.

   sessionData est affectée PENDANT le rendu du composant. Un clientPhone()
   écrit dans l'initialiseur d'une constante de module est donc évalué à
   l'import, quand la session vaut encore null : le repli gagne toujours,
   quoi que le client renseigne. Le câblage est là, il ne sert à rien.

   Première version de cette jauge : elle devinait la portée à
   l'indentation et annonçait 91 appels dans 90 fichiers — elle comptait
   du JSX de composant. Ici on suit les accolades : on n'entre QUE dans
   l'initialiseur d'un « const X = [ » ou « const X = { » déclaré en
   colonne 0, et on en sort quand la profondeur revient à zéro. Une
   fonction, elle, s'exécute au rendu : on l'ignore. */
import fs from "node:fs";

const suspects = [];
for (const f of fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d))
  .flatMap((d) => ["page.tsx", "layout.tsx", "shared.tsx"].map((n) => `app/templates/${d}/${n}`).filter(fs.existsSync))) {
  const L = fs.readFileSync(f, "utf8").split("\n");
  let dedans = null, profondeur = 0;

  for (let i = 0; i < L.length; i++) {
    const l = L[i];
    if (!dedans) {
      const m = /^(?:export\s+)?(?:const|let)\s+([A-Za-z0-9_]+)(?:\s*:\s*[^=]+)?\s*=\s*[[{]\s*$/.exec(l);
      /* une valeur qui contient une fonction s'évaluera au rendu */
      if (m && !/=>|function/.test(l)) { dedans = m[1]; profondeur = 0; }
    }
    if (dedans) {
      profondeur += (l.match(/[[{(]/g) ?? []).length - (l.match(/[\]})]/g) ?? []).length;
      const appel = /client(Phone|Email|Name|Address|City|Trade)\s*\(\s*(sessionData|__layoutSession)\s*\)/.exec(l);
      if (appel) suspects.push([f, i + 1, dedans, l.trim().slice(0, 100)]);
      if (profondeur <= 0) dedans = null;
    }
  }
}
const parFichier = new Set(suspects.map((s) => s[0]));
for (const [f, l, portee, txt] of suspects) console.log(`${f}:${l} · ${portee} · ${txt}`);
console.log(`\n${suspects.length} appels figés dans ${parFichier.size} fichiers`);
fs.writeFileSync("captures/contact/appels-figes.json", JSON.stringify(suspects, null, 2));
