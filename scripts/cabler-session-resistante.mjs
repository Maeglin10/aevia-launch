/*
  Réessayer quand la session n'est pas encore lisible.

    node scripts/cabler-session-resistante.mjs [--ecrire]

  En production, la session est écrite dans un stockage distant : entre sa
  création et sa première lecture, il s'écoule parfois assez de temps pour
  qu'une page chargée dans la foulée reçoive une réponse vide. Le thème affiche
  alors le repli de la démonstration, et n'y revient jamais — la lecture n'a
  lieu qu'une fois, au montage.

  Mesuré sur launch.aevia.services : la même page d'impact-74 montre « Aevia
  Kitchen » si on la charge aussitôt, et le nom du client si on attend cinq
  secondes. En local, le stockage est en mémoire et la course ne se voit pas.

  Huit cent quatre-vingt-douze fichiers lisent la session de la même façon. On
  y ajoute trois tentatives espacées : la première immédiate, puis à six cents
  millisecondes et à deux secondes.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");

function* parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const c = path.join(d, e.name);
    if (e.isDirectory()) yield* parcourir(c);
    else if (e.name.endsWith(".tsx")) yield c;
  }
}

/*
  Les deux formes rencontrées, à la variable de dépôt près :

      fetch(`/api/sessions?id=${id}`)
        .then((r) => r.json())
        .then(POSER)
        .catch(() => {});

      fetch(`/api/sessions?id=${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((s) => s && POSER(s))
        .catch(() => {});
*/
const MOTIF = /fetch\(`\/api\/sessions\?id=\$\{([\w.$]+)\}`\)\s*\n\s*\.then\(\(r\) => \(?r\.ok \? r\.json\(\) : null\)?\)\s*\n\s*\.then\(\((\w+)\) => \2 && ([\w.$]+)\(\2(?: as [^)]+)?\)\)\s*\n\s*\.catch\(\(\) => \{\}\);|fetch\(`\/api\/sessions\?id=\$\{([\w.$]+)\}`\)\s*\n\s*\.then\(\(r\) => r\.json\(\)\)\s*\n\s*\.then\(([\w.$]+)\)\s*\n\s*\.catch\(\(\) => \{\}\);/g;

const rapport = [];
for (const p of [...parcourir("app/templates"), ...parcourir("lib/templates")]) {
  const src = fs.readFileSync(p, "utf8");
  let faits = 0;
  const sortie = src.replace(MOTIF, (tout, idA, s, poserA, idB, poserB) => {
    const id = idA ?? idB;
    const poser = poserA ?? poserB;
    faits++;
    return `(async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Trois tentatives. */
      for (const attente of [0, 600, 2000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(\`/api/sessions?id=\${${id}}\`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { ${poser}(donnees); return; }
        } catch {}
      }
    })();`;
  });
  if (!faits) continue;
  rapport.push({ fichier: p, faits });
  if (ECRIRE) fs.writeFileSync(p, sortie);
}

console.log(`${rapport.length} fichiers · ${rapport.reduce((a, r) => a + r.faits, 0)} lectures · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
