/*
  Produire le contenu généré des clients de référence, par le vrai chemin.

    npx tsx scripts/contenu-genere.ts

  La capture créait la session et son profil, puis photographiait — sans jamais
  passer par `/api/generate`. Toutes les pages étaient donc mesurées sans
  `generatedContent` : chaque `c?.aboutText ?? …` tombait sur l'exemple du
  thème, et l'on comptait comme « anglais resté » de la prose qu'un vrai client
  n'aurait jamais vue.

  Appeler la route pour trois cent soixante-treize thèmes se heurte à son
  limiteur — cinq requêtes par minute et par adresse. On appelle donc la même
  fonction qu'elle, celle du repli, et l'on dépose le résultat pour la capture.
  C'est exactement ce que la route produit en local, où aucune clé de génération
  n'est posée.
*/
import fs from "node:fs";
import { contenuDepuisLeClient } from "../lib/contenuDepuisLeClient";
import { CLIENTS } from "./clients-types.mjs";

const sortie: Record<string, unknown> = {};
for (const [domaine, client] of Object.entries(CLIENTS as Record<string, { form: Record<string, unknown> }>)) {
  sortie[domaine] = contenuDepuisLeClient(client.form as never);
}
fs.writeFileSync("/tmp/contenu-genere.json", JSON.stringify(sortie, null, 1));
console.log(`${Object.keys(sortie).length} domaines · /tmp/contenu-genere.json`);
for (const [d, c] of Object.entries(sortie)) {
  console.log(`  ${d.padEnd(24)} ${(c as { heroHeadline: string }).heroHeadline.slice(0, 60)}`);
}
