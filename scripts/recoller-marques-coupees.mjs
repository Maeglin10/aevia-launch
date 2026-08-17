/*
  Recoller les marques que le thème écrit en deux morceaux.

    node scripts/recoller-marques-coupees.mjs [--ecrire]

  Dix-sept thèmes écrivent leur nom à cheval sur le repli et le texte qui suit :

      {clientName(sessionData) ?? "Château"} de Valroc

  Le client reçoit alors « La Table du Thiou de Valroc ». Le passage global ne
  peut rien : le nom du client est déjà écrit, et « de Valroc » est un nœud de
  texte à part, dans le même élément — ni un frère à masquer, ni une marque à
  remplacer.

  On déplace donc la queue à l'intérieur du repli, où elle disparaît dès que le
  client a un nom :

      {clientName(sessionData) ?? "Château de Valroc"}

  La queue s'arrête au premier mot en minuscule ou à la première ponctuation :
  « de Valroc en 2005. Sa philosophie… » rend « de Valroc », et la phrase reste.
  « & Associés · Tous droits réservés » rend « & Associés », et la mention
  légale reste. Sans cette borne, on avalerait des paragraphes entiers.
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

/* `{clientName(x) ?? "Court"}` suivi d'une queue qui commence par un liant. */
const COUPE = /(\{clientName\((?:sessionData|session|__session)\)\s*\?\?\s*)"([^"]{2,40})"(\})(\s*)((?:de|du|des|d'|d’|la|le|les|&|et)\s+[^\n<{]{0,60})/g;

/* Ce qui, dans la queue, appartient encore au nom : le liant puis des mots capitalisés. */
const PART_DU_NOM = /^((?:de|du|des|d'|d’|la|le|les|&|et)\s+(?:[A-ZÀ-ÞŒ][\wÀ-ÿŒœ'’-]*(?:\s+|$))+)/;

/*
  Une queue dont le nom continue après un liant en minuscule n'appartient pas à
  la marque : « & Les Films du Worso » est le nom d'un coproducteur, pas la
  suite de « Studio Pelikan ». Recoller couperait « du Worso » de sa phrase.
*/
const NOM_QUI_CONTINUE = /^(?:de|du|des|d'|d’|la|le|les)\s+[A-ZÀ-ÞŒ]/;

const rapport = [];
for (const f of tsx("app/templates")) {
  const src = fs.readFileSync(f, "utf8");
  let faits = 0;
  const sortie = src.replace(COUPE, (tout, tete, court, accolade, espace, queue) => {
    const m = PART_DU_NOM.exec(queue);
    if (!m) return tout;
    const suite = m[1].trimEnd();
    /* Une queue qui n'ajoute rien de capitalisé n'est pas un nom. */
    if (!/[A-ZÀ-ÞŒ]/.test(suite)) return tout;
    const reste0 = queue.slice(m[1].length);
    if (NOM_QUI_CONTINUE.test(reste0.trim())) return tout;
    faits++;
    const reste = reste0;
    rapport.push(`${f.replace("app/templates/", "")} · « ${court} » + « ${suite} »`);
    return `${tete}"${court} ${suite}"${accolade}${reste ? espace + reste : ""}`;
  });
  if (faits && ECRIRE) fs.writeFileSync(f, sortie);
}

rapport.forEach((r) => console.log("  " + r));
console.log(`\n${rapport.length} marques recollées · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
