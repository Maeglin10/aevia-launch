/*
  De l'anglais sur un site français.

    node scripts/qa-anglais.mjs

  Vu à l'œil sur impact-01 et impact-47 : le client est français, ses textes
  sont français, et les titres de sections restent ceux de la démonstration —
  « Services built for impact », « What Our Clients Say », « Always Fresh.
  Never Repeated. ». Le visiteur d'un couvreur d'Annecy lit de l'anglais.

  On compte, sur le texte réellement affiché, les mots anglais courants qui
  n'existent pas en français. Le comptage sert à trier ; le jugement se fait
  ensuite sur la capture.
*/
import fs from "node:fs";

const fiches = JSON.parse(fs.readFileSync("/tmp/captures/fiches.json", "utf8"));

/* Des mots sans ambiguïté : pas de faux amis, pas de mots communs aux deux langues. */
const ANGLAIS = /\b(the|your|our|we|you|with|from|for every|about us|learn more|get started|read more|book now|contact us|our story|our process|what we do|why choose|how it works|pricing|features|testimonials|frequently asked|questions and answers|view all|see more|discover|explore|built|crafted|made by|trusted by|join|ready to|let's|don't|doesn't|everything|nothing|something|anything)\b/gi;

const lignes = [];
for (const f of fiches) {
  if (!f.texte) continue;
  const trouves = [...new Set((f.texte.match(ANGLAIS) ?? []).map((m) => m.toLowerCase()))];
  if (!trouves.length) continue;
  /* Combien de segments affichés contiennent de l'anglais ? */
  const segments = f.texte.split(" | ");
  const atteints = segments.filter((s) => ANGLAIS.test(s) && (ANGLAIS.lastIndex = 0) === 0);
  lignes.push({ theme: f.theme, domaine: f.domaine, mots: trouves.length, exemples: trouves.slice(0, 6), segments: atteints.length });
}
lignes.sort((a, b) => b.segments - a.segments);
for (const l of lignes.slice(0, 30)) {
  console.log(`${l.theme.padEnd(12)} ${String(l.segments).padStart(3)} segments · ${l.exemples.join(", ")}`);
}
console.log(`\n${lignes.length} thèmes sur ${fiches.length} portent de l'anglais visible`);
fs.writeFileSync("/tmp/anglais.json", JSON.stringify(lignes, null, 1));
