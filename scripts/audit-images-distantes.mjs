// Les images que les thèmes vont chercher ailleurs tiennent-elles encore ?
//
//   node scripts/audit-images-distantes.mjs [--tout]
//
// Soixante-quatorze thèmes pointent directement sur images.pexels.com, d'autres
// sur unsplash : si l'hébergeur refuse le lien direct ou si l'identifiant a
// disparu, le conteneur reste — souvent animé — et l'image ne vient jamais. Le
// client reçoit un site à trous sans que rien ne le signale.
//
// On relève ici toutes les adresses écrites en dur dans les sources, on demande
// leur en-tête, et l'on dit lesquelles ne répondent plus.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const tout = process.argv.includes("--tout");

const adresses = new Map(); // adresse → thèmes qui l'emploient
for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const fichiers = [];
  for (const f of ["page.tsx", "layout.tsx", "shared.tsx"]) {
    const c = path.join(dossier, f);
    if (fs.existsSync(c)) fichiers.push(c);
  }
  for (const sous of fs.readdirSync(dossier)) {
    const c = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(c)) fichiers.push(c);
  }
  for (const f of fichiers) {
    const src = fs.readFileSync(f, "utf8");
    for (const m of src.matchAll(/https:\/\/(?:images\.pexels\.com|images\.unsplash\.com|cdn\.pixabay\.com)\/[^\s"'`)]+/g)) {
      const url = m[0].replace(/[.,;]$/, "");
      if (!adresses.has(url)) adresses.set(url, new Set());
      adresses.get(url).add(id);
    }
  }
}

console.log(`${adresses.size} adresses distinctes, sur ${new Set([...adresses.values()].flatMap((s) => [...s])).size} thèmes`);

const liste = [...adresses.keys()];
const aTester = tout ? liste : liste.slice(0, 400);
const mortes = [];
let faites = 0;

// Par paquets : on interroge sans assommer l'hébergeur.
for (let i = 0; i < aTester.length; i += 12) {
  await Promise.all(aTester.slice(i, i + 12).map(async (url) => {
    try {
      const r = await fetch(url, { method: "HEAD", redirect: "follow" });
      if (!r.ok || !(r.headers.get("content-type") ?? "").startsWith("image")) {
        mortes.push(`${r.status} ${(r.headers.get("content-type") ?? "?").slice(0, 20)} ${url.slice(0, 90)}`);
      }
    } catch (e) {
      mortes.push(`échec ${String(e.message).slice(0, 30)} ${url.slice(0, 90)}`);
    }
    faites++;
  }));
  if (i % 120 === 0) process.stdout.write(`  ${faites}/${aTester.length}\r`);
}

console.log(`\n${faites} adresses interrogées · ${mortes.length} ne rendent pas d'image`);
for (const m of mortes.slice(0, 25)) {
  const url = m.split(" ").pop();
  console.log(`  ${m.slice(0, 120)}\n     employée par ${[...(adresses.get(url) ?? [])].slice(0, 6).join(", ")}`);
}
if (process.env.FICHES) {
  fs.writeFileSync(process.env.FICHES, JSON.stringify(
    mortes.map((m) => { const url = m.split(" ").pop(); return { url, motif: m, themes: [...(adresses.get(url) ?? [])] }; }), null, 1));
}
