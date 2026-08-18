/*
  Traduire ce qui reste en anglais dans les thèmes.

    node scripts/traduire-le-reste.mjs [--lots N] [--depuis N]

  Lit /tmp/anglais-restant.json (produit par anglais-restant.mjs) et demande à
  Claude les quatre langues pour chaque phrase, thème par thème. La sortie a la
  forme attendue par ecrire-traductions.mjs.

  Deux précautions tenues ici :

  — Le modèle rend parfois un objet incomplet, ou glisse une phrase qu'on ne lui
    a pas donnée. Chaque réponse est recoupée avec la demande : les phrases
    absentes sont redemandées, les inventées écartées.
  — Un nom propre ne se traduit pas. « The Obsidian Loft » est le nom d'un
    projet, pas une expression : la consigne le dit, et le thème garde le nom
    tel quel plutôt que de le franciser.
*/
import fs from "node:fs";

const ENV = fs.readFileSync(`${process.env.HOME}/skybot-inbox/.env`, "utf8");
const clef = (nom) => (ENV.match(new RegExp(`^${nom}=(.+)$`, "m")) ?? [])[1]?.trim();

/*
  Plusieurs fournisseurs plutôt qu'un seul.

  Le compte Anthropic est à sec ; GEMINI_API_KEY est au palier gratuit et rend
  429 dès la vingtième requête — 442 phrases sur 610 ont été perdues à ne pas
  l'avoir vu. On tourne donc sur les accès qui répondent, et un 429 fait passer
  au suivant au lieu d'attendre en vain.
*/
const ACCES = [
  { nom: "openai", cle: clef("OPENAI_API_KEY"), appel: openai },
  { nom: "gemini-agent", cle: clef("GEMINI_AGENT_API_KEY"), appel: gemini },
  { nom: "gemini-voice", cle: clef("GEMINI_VOICE_API_KEY"), appel: gemini },
].filter((a) => a.cle);
if (!ACCES.length) { console.error("aucun accès utilisable"); process.exit(1); }

async function openai(cle, phrases) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${cle}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: CONSIGNE }, { role: "user", content: JSON.stringify(phrases) }],
    }),
  });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 120)}`);
  return (await r.json()).choices?.[0]?.message?.content ?? "";
}

async function gemini(cle, phrases) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cle}`,
    { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: CONSIGNE }] },
        contents: [{ role: "user", parts: [{ text: JSON.stringify(phrases) }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 16000, responseMimeType: "application/json" },
      }) });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 120)}`);
  return (await r.json()).candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
}

const TOUT = JSON.parse(fs.readFileSync("/tmp/anglais-restant.json", "utf8"));
const DEPUIS = Number((process.argv.find((a) => a.startsWith("--depuis=")) ?? "").split("=")[1] ?? 0);
const LOTS = Number((process.argv.find((a) => a.startsWith("--lots=")) ?? "").split("=")[1] ?? TOUT.length);
const CHOISIS = TOUT.slice(DEPUIS, DEPUIS + LOTS);

const CONSIGNE = `Tu traduis les textes de démonstration d'un site vitrine, de l'anglais vers le français, l'espagnol, l'allemand et le portugais européen.

Règles :
- Rends UNIQUEMENT un objet JSON : chaque clé est le texte anglais reçu, mot pour mot, et sa valeur un tableau de quatre chaînes dans l'ordre [français, espagnol, allemand, portugais].
- Traduis TOUS les textes reçus, aucun de plus.
- Un nom propre (marque, nom de projet, nom de personne, nom de lieu) reste tel quel dans les quatre langues.
- Une unité, un chiffre ou un sigle reste tel quel ; seul le mot qui l'accompagne se traduit.
- Garde le registre et la longueur : un titre court reste court, une accroche reste une accroche.
- Garde la ponctuation et la casse d'origine (UN TITRE EN CAPITALES reste en capitales).
- Garde les entités HTML telles quelles (&apos;, &amp;, &nbsp;).`;

async function demander(phrases) {
  let derniere;
  for (const acces of ACCES) {
    let txt;
    try { txt = await acces.appel(acces.cle, phrases); }
    catch (e) { derniere = e; continue; }          /* 429 ou panne : accès suivant */
    const i = txt.indexOf("{"), j = txt.lastIndexOf("}");
    if (i < 0 || j < 0) { derniere = new Error("pas de JSON"); continue; }
    return JSON.parse(txt.slice(i, j + 1));
  }
  throw derniere ?? new Error("aucun accès n'a répondu");
}

/* Le modèle rend parfois un objet incomplet : on redemande ce qui manque. */
const ATTENTES = [20000, 45000, 90000, 90000, 90000];

async function traduire(phrases) {
  const out = {};
  let reste = [...phrases];
  for (let essai = 0; essai < ATTENTES.length && reste.length; essai++) {
    let rendu;
    try { rendu = await demander(reste); }
    catch (e) {
      /*
        Le 429 n'est pas une panne, c'est le service qui demande d'attendre.
        Deux secondes ne suffisent pas : à cinq requêtes de front, 442 phrases
        sur 610 avaient été perdues faute d'avoir attendu assez. On patiente
        vingt secondes, puis quarante-cinq, puis quatre-vingt-dix.
      */
      if (essai === ATTENTES.length - 1) throw e;
      await new Promise((r) => setTimeout(r, /429/.test(String(e)) ? ATTENTES[essai] : 3000));
      continue;
    }
    for (const [k, v] of Object.entries(rendu)) {
      /* Écarter ce qu'on n'a pas demandé, et les tableaux mal formés. */
      if (!phrases.includes(k)) continue;
      if (!Array.isArray(v) || v.length !== 4 || v.some((x) => typeof x !== "string" || !x.trim())) continue;
      out[k] = v;
    }
    reste = reste.filter((p) => !(p in out));
  }
  return { out, manquants: reste };
}

/* Par paquets de quinze phrases : au-delà le modèle en escamote. */
const paquets = [];
for (const { theme, restes } of CHOISIS) {
  for (let i = 0; i < restes.length; i += 15) paquets.push({ theme, phrases: restes.slice(i, i + 15) });
}
console.log(`${CHOISIS.length} thèmes · ${paquets.length} paquets`);

const lot = {};
let faits = 0, rates = 0;
const PARALLELE = 4;
for (let i = 0; i < paquets.length; i += PARALLELE) {
  const rendus = await Promise.all(paquets.slice(i, i + PARALLELE).map(async (p) => {
    try { return { ...p, ...(await traduire(p.phrases)) }; }
    catch (e) { return { ...p, out: {}, manquants: p.phrases, erreur: String(e).slice(0, 90) }; }
  }));
  for (const r of rendus) {
    lot[r.theme] = { ...(lot[r.theme] ?? {}), ...r.out };
    faits += Object.keys(r.out).length; rates += r.manquants.length;
    if (r.erreur) console.log(`  ⚠ ${r.theme} ${r.erreur}`);
  }
  /* Écrit à chaque tour : une interruption ne perd pas le travail déjà payé. */
  fs.writeFileSync("/tmp/lot-reste.json", JSON.stringify(lot, null, 1));
  process.stdout.write(`\r  ${Math.min(i + PARALLELE, paquets.length)}/${paquets.length} paquets · ${faits} traduites · ${rates} manquées   `);
}
console.log(`\n${faits} phrases traduites · ${rates} manquées · /tmp/lot-reste.json`);
