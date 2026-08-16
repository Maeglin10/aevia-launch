/*
  Donner une identité aux pages annexes qui n'en ont aucune.

    node scripts/poser-entete-annexe.mjs [--ecrire]

  Cent soixante-douze pages annexes n'affichent à l'écran ni le nom du client,
  ni celui de la démonstration : elles n'ont tout simplement pas d'en-tête. Le
  visiteur qui y arrive — par un lien, par une recherche — ne sait pas chez qui
  il est, et n'a aucun chemin de retour.

  Le balayage ne le voyait pas : il cherchait le nom dans `textContent`, qui
  compte aussi le titre masqué posé pour les moteurs de recherche.

  Neuf thèmes n'ont aucun `layout.tsx`. On leur en pose un, qui n'affiche la
  ligne d'identité que sur les annexes — l'accueil, lui, a déjà son en-tête.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const MARQUES = JSON.parse(fs.readFileSync("/tmp/marques.json", "utf8"));
const RACINE = "app/templates";

const themes = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const poses = [];

for (const theme of themes) {
  const dossier = path.join(RACINE, theme);
  const fichier = path.join(dossier, "layout.tsx");
  if (fs.existsSync(fichier)) {
    console.log(`  · ${theme} : layout déjà présent, laissé tel quel`);
    continue;
  }
  const marque = (MARQUES[theme] ?? "").replace(/"/g, '\\"');
  const contenu = `"use client";

/*
  L'identité du thème sur ses pages annexes.

  Les pages de ce thème n'avaient aucun en-tête commun : le visiteur qui
  arrivait sur « /mentions » ou « /contact » ne savait pas chez qui il était, et
  n'avait pas de chemin de retour. L'accueil, lui, porte déjà sa propre
  en-tête — la ligne n'apparaît donc que sur les annexes.
*/

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EnteteAnnexe } from "@/lib/templates/EnteteAnnexe";

export default function ${theme.replace(/-(\w)/g, (_, c) => c.toUpperCase())}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chemin = usePathname() ?? "";
  const surUneAnnexe = chemin.replace(/\\/+$/, "").split("/").length > 3;
  const [session, setSession] = useState<unknown>(null);

  useEffect(() => {
    if (!surUneAnnexe) return;
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cle = "apercu-session:${theme}";
      if (id) sessionStorage.setItem(cle, id);
      else id = sessionStorage.getItem(cle);
    } catch {}
    if (!id) return;
    fetch(\`/api/sessions?id=\${id}\`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && setSession(s))
      .catch(() => {});
  }, [surUneAnnexe]);

  return (
    <>
      {surUneAnnexe && (
        <EnteteAnnexe session={session} repli="${marque}" accueil="/templates/${theme}" />
      )}
      {children}
    </>
  );
}
`;
  poses.push(theme);
  if (ECRIRE) fs.writeFileSync(fichier, contenu);
}

console.log(`\n${poses.length} layout(s) ${ECRIRE ? "posés" : "à poser (--ecrire)"} : ${poses.join(" ")}`);
