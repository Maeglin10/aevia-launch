/* Le numéro d'un inconnu, affiché sans condition.

   Ceux-ci n'étaient dans aucune chaîne de repli : ils s'affichaient toujours,
   quoi que le client renseigne. Un par un, texte exact, jamais un motif
   gourmand — les contextes sont trop différents (valeur d'objet, texte JSX,
   phrase de foire aux questions, constante).

   Les gabarits de champ (placeholder) sont volontairement laissés : ils
   montrent la FORME attendue, ils ne prétendent pas être le numéro du client. */
import fs from "node:fs";

/* [fichier, texte exact à remplacer, texte de remplacement] */
const gestes = [];
const S = (f) => (f.endsWith("layout.tsx") ? "__layoutSession" : "sessionData");

/* ── 1. valeur d'objet : value: "+33 …" ─────────────────────────────────── */
for (const [n, fic, num] of [
  [13, "page", "+33 1 42 60 00 00"], [131, "page", "+33 5 56 23 78 90"],
  [166, "page", "+33 6 20 51 13 32"], [167, "page", "+33 1 45 48 23 67"],
  [168, "page", "+33 4 91 00 00 00"], [91, "page", "+33 1 42 60 29 14"],
]) gestes.push([`app/templates/impact-${n}/${fic}.tsx`, `value: "${num}"`, `value: clientPhone(sessionData) ?? "${num}"`]);

for (const [n, num] of [[208, "+33 4 78 77 30 30"], [210, "+33 1 42 56 78 90"], [216, "+33 1 84 88 92 10"], [41, "+33 1 44 72 90 00"]])
  gestes.push([n === 41 ? "app/templates/impact-41/shared.tsx" : `app/templates/impact-${n}/page.tsx`,
               `value: '${num}'`,
               n === 41 ? `value: clientPhoneOr('${num}')` : `value: clientPhone(sessionData) ?? '${num}'`]);

gestes.push(["app/templates/impact-207/page.tsx", `value: "+33 1 45 00 00 00 (24/7)",`, `value: (clientPhone(sessionData) ?? "+33 1 45 00 00 00") + " (24/7)",`]);
gestes.push(["app/templates/impact-209/page.tsx", `lines: ['+33 1 42 22 33 44']`, `lines: [clientPhone(sessionData) ?? '+33 1 42 22 33 44']`]);
gestes.push(["app/templates/impact-47/layout.tsx", `{ Icon: Phone, text: "+33 1 43 00 00 00" }`, `{ Icon: Phone, text: clientPhone(__layoutSession) ?? "+33 1 43 00 00 00" }`]);

/* ── 2. texte JSX nu ────────────────────────────────────────────────────── */
gestes.push(["app/templates/impact-20/page.tsx", "Téléphone : +33 1 42 60 00 00<br />", "Téléphone : {clientPhone(sessionData) ?? \"+33 1 42 60 00 00\"}<br />"]);
gestes.push(["app/templates/impact-26/page.tsx", "Téléphone : +33 1 44 55 66 77", "Téléphone : {clientPhone(sessionData) ?? \"+33 1 44 55 66 77\"}"]);
gestes.push(["app/templates/impact-37/layout.tsx", "<Phone size={14} color={C.gold} /> +33 1 42 60 80 20", "<Phone size={14} color={C.gold} /> {clientPhone(__layoutSession) ?? \"+33 1 42 60 80 20\"}"]);
gestes.push(["app/templates/impact-82/layout.tsx", '<p className="text-sm mb-4">+33 1 44 15 62 00</p>', '<p className="text-sm mb-4">{clientPhone(__layoutSession) ?? "+33 1 44 15 62 00"}</p>']);
gestes.push(["app/templates/impact-39/page.tsx", "Appelez-nous au +33 1 31 28 28 28 — 7j/7.", "Appelez-nous au {clientPhone(sessionData) ?? \"+33 1 31 28 28 28\"} — 7j/7."]);
gestes.push(["app/templates/impact-246/page.tsx", "24h/7j — 04 91 79 44 44", "24h/7j — {clientPhone(sessionData) ?? \"04 91 79 44 44\"}"]);
gestes.push(["app/templates/impact-273/page.tsx", "+33 3 88 79 44 44.", "{clientPhone(sessionData) ?? \"+33 3 88 79 44 44\"}."]);
gestes.push(["app/templates/impact-283/page.tsx", "04 67 20 51 51 · {fd?.email", "{clientPhone(sessionData) ?? \"04 67 20 51 51\"} · {fd?.email"]);

/* ── 3. dans une phrase (chaîne JavaScript) ─────────────────────────────── */
gestes.push(["app/templates/impact-04/page.tsx", `value: "+33 1 42 65 15 16\\nreserve@letoile." + (clientCity(sessionData) ?? "Paris")`,
             `value: (clientPhone(sessionData) ?? "+33 1 42 65 15 16") + "\\nreserve@letoile." + (clientCity(sessionData) ?? "Paris")`]);
gestes.push(["app/templates/impact-30/shared.tsx", "appelez-nous au 01 42 56 78 90 —", 'appelez-nous au " + clientPhoneOr("01 42 56 78 90") + " —']);
gestes.push(["app/templates/impact-95/page.tsx", "par téléphone au +33 1 45 72 98 30.", 'par téléphone au " + (clientPhone(sessionData) ?? "+33 1 45 72 98 30") + ".']);
gestes.push(["app/templates/impact-157/page.tsx", "+33 1 42 60 20 51", '" + (clientPhone(sessionData) ?? "+33 1 42 60 20 51") + "']);
gestes.push(["app/templates/impact-282/page.tsx", "Boulangerie du Beffroi — 03 20 79 44 44", "Boulangerie du Beffroi — {clientPhone(sessionData) ?? \"03 20 79 44 44\"}"]);

/* ── 4. constante locale ────────────────────────────────────────────────── */
gestes.push(["app/templates/impact-312/page.tsx", 'const phone = fd.phone || "01 73 82 62 30";', 'const phone = clientPhone(sessionData) || fd.phone || "01 73 82 62 30";']);
gestes.push(["app/templates/impact-314/page.tsx", 'const phone = fd?.phone || "01 75 16 68 52";', 'const phone = clientPhone(sessionData) || fd?.phone || "01 75 16 68 52";']);

/* ── 5. les trois occurrences identiques d'impact-222 ───────────────────── */
gestes.push(["app/templates/impact-222/page.tsx", "value: '+33 4 42 00 18 90',", "value: clientPhone(sessionData) ?? '+33 4 42 00 18 90',", "toutes"]);

/* ── 6. impact-53 : texte JSX sur sa propre ligne ───────────────────────── */
gestes.push(["app/templates/impact-53/layout.tsx", "+33 4 74 12 34 56", '{clientPhone(__layoutSession) ?? "+33 4 74 12 34 56"}']);
gestes.push(["app/templates/impact-235/page.tsx", "(fd?.email ?? 'contact@ateliervos", "(clientPhone(sessionData) ?? '') , (fd?.email ?? 'contact@ateliervos", "sauter"]);
gestes.push(["app/templates/impact-254/page.tsx", "(fd?.email ?? 'cabinet@v", "(fd?.email ?? 'cabinet@v", "sauter"]);

const rapport = [];
for (const [f, avant, apres, mode] of gestes) {
  if (mode === "sauter") continue;
  let src = fs.readFileSync(f, "utf8");
  const n = src.split(avant).length - 1;
  if (n === 0) { rapport.push([f, `INTROUVABLE : ${avant.slice(0, 40)}`]); continue; }
  if (n > 1 && mode !== "toutes") { rapport.push([f, `${n} OCCURRENCES, ambigu : ${avant.slice(0, 40)}`]); continue; }
  src = src.split(avant).join(apres);

  /* l'import qui va bien */
  const besoin = apres.includes("clientPhoneOr") ? "clientPhoneOr" : "clientPhone";
  if (!new RegExp(`\\b${besoin}\\b`).test(src.split("from \"@/lib/templates/clientContent\";")[0] ?? "")) {
    const im = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
    if (im) {
      const noms = [...new Set([...im[1].split(",").map((x) => x.trim()).filter(Boolean), besoin])].sort();
      src = src.replace(im[0], `import {\n  ${noms.join(",\n  ")},\n} from "@/lib/templates/clientContent";`);
    } else {
      src = `import { ${besoin} } from "@/lib/templates/clientContent";\n` + src;
    }
  }
  fs.writeFileSync(f, src);
  rapport.push([f, `${n} câblé(s)`]);
}
for (const [f, m] of rapport) console.log(`${f} : ${m}`);
console.log(`\n${rapport.length} gestes · ${rapport.filter(([, m]) => /INTROUVABLE|ambigu/.test(m)).length} en échec`);
