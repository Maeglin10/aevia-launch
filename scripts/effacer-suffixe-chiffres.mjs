/*
  Effacer l'unité de la démonstration quand le chiffre vient du client.

    node scripts/effacer-suffixe-chiffres.mjs [--ecrire]

  Trente-quatre thèmes écrivent leurs chiffres clés en trois morceaux — la
  valeur, une unité, un libellé :

      { value: "43", suffix: " countries", label: "Active Network" }

  Le câblage remplaçait la valeur et le libellé, jamais l'unité. Un couvreur
  d'Annecy affichait donc « 1974 countries » sous « année de création », et
  « 480 countries » sous « clients fidèles ». Le chiffre du client, l'unité de
  la démonstration : le nombre ne veut plus rien dire.

  L'unité disparaît dès que le client remplit le chiffre. Son libellé porte le
  sens — « année de création », « clients fidèles » — et s'il lui faut un signe,
  il l'écrit dans la valeur : « 98,4 % », « 480+ ». C'est déjà ce que fait le
  formulaire, qui ne demande qu'une valeur et un libellé.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");

function tsx(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const c = path.join(d, e.name);
    if (e.isDirectory()) out.push(...tsx(c));
    else if (c.endsWith(".tsx")) out.push(c);
  }
  return out;
}

/* Les noms d'unité rencontrés dans les thèmes. */
const UNITES = ["suffix", "unit", "unite", "suffixe", "plus"];

const rapport = [];
for (const f of tsx("app/templates")) {
  let src = fs.readFileSync(f, "utf8");
  let faits = 0;

  for (const unite of UNITES) {
    /*
       Le bloc de fusion des chiffres : on n'y touche que si la source déclare
       bien cette unité — sans quoi on ajouterait une clé que le thème ne lit
       pas, et le rendu changerait sans raison.
    */
    if (!new RegExp(`\\b${unite}\\s*:`).test(src)) continue;

    const motif = new RegExp(
      `(clientStats\\((?:sessionData|session|__session)\\)\\?\\.map\\(\\([^)]*\\) => \\(\\{[\\s\\S]{0,400}?)(\\n\\s*)(label\\s*:\\s*[^\\n,]+,)`,
      "g",
    );
    src = src.replace(motif, (tout, tete, marge, label) => {
      if (new RegExp(`\\b${unite}\\s*:`).test(tout)) return tout; // déjà traité
      faits++;
      return `${tete}${marge}${label}${marge}/* Le chiffre est celui du client : l'unité de la démonstration ne le suit pas. */${marge}${unite}: "",`;
    });
  }

  if (faits) {
    rapport.push(`${f.replace("app/templates/", "")} · ${faits}`);
    if (ECRIRE) fs.writeFileSync(f, src);
  }
}

rapport.forEach((r) => console.log("  " + r));
console.log(`\n${rapport.length} thèmes · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
