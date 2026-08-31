/**
 * Traduit en français les descriptions des 373 modèles du catalogue.
 *
 * Pourquoi : `lib/templates/registry.ts` se présente comme la source française
 * du catalogue, mais ses `description` sont rédigées en anglais. Les 344 fiches
 * modèles ne pouvaient donc pas les afficher — un paragraphe anglais sur une
 * page destinée au marché français est pire que pas de paragraphe.
 *
 * Le modèle ne traduit QUE ce qui est écrit. Toute description qui reviendrait
 * plus longue que ce que l'anglais contient, ou qui inventerait une
 * fonctionnalité, est un défaut : la sortie est contrôlée entrée par entrée.
 */
import { readFileSync, writeFileSync } from 'node:fs';

/*
  Deux fournisseurs, parce qu'un seul ne suffit pas.

  Le palier gratuit de Gemini plafonne à 20 requêtes par minute ET à un quota
  journalier que la génération de sites consomme déjà : au premier essai la
  traduction est partie en 429 et n'a rendu aucune ligne. Groq sert donc de
  repli, avec la même consigne et les mêmes contrôles de sortie.

  Choisir : PROVIDER=gemini (défaut si GEMINI_API_KEY) ou PROVIDER=groq.
*/
const PROVIDER = process.env.PROVIDER ?? (process.env.GROQ_API_KEY ? 'groq' : 'gemini');
const KEY = PROVIDER === 'groq' ? process.env.GROQ_API_KEY : process.env.GEMINI_API_KEY;
if (!KEY) throw new Error(`clé manquante pour ${PROVIDER}`);

const MODEL =
  process.env.MODEL ?? (PROVIDER === 'groq' ? 'openai/gpt-oss-120b' : 'gemini-2.5-flash');
const LOT = Number(process.env.LOT ?? 20);

/*
  Le catalogue est lu directement dans registry.ts plutôt que dans un JSON
  intermédiaire : un fichier temporaire aurait vieilli à la première entrée
  ajoutée au catalogue, et personne ne s'en serait aperçu avant de voir une
  fiche sans description.
*/
const source = readFileSync(new URL('../lib/templates/registry.ts', import.meta.url), 'utf8');
const src = [...source.matchAll(
  /\{\s*id:\s*"([^"]+)",\s*name:\s*"((?:[^"\\]|\\.)*)",\s*description:\s*"((?:[^"\\]|\\.)*)"/g,
)].map((m) => ({ id: m[1], name: m[2], description: m[3] }));
if (src.length < 300) throw new Error(`registry.ts : ${src.length} entrées lues, lecture douteuse`);

const CONSIGNE = `Tu traduis en français les descriptions d'un catalogue de modèles de sites web.

Règles, sans exception :
- Traduis fidèlement. N'ajoute AUCUNE fonctionnalité, aucun bénéfice, aucun superlatif qui ne soit pas dans l'anglais.
- Français naturel et sobre, registre professionnel. Pas de « Découvrez », pas de « sublime », pas de point d'exclamation.
- Une à deux phrases. Entre 90 et 220 caractères.
- Garde les noms propres tels quels.
- Glossaire imposé — un client lit ces phrases, pas un développeur :
  masonry gallery → galerie en mosaïque · cart drawer → panier latéral ·
  scroll animations → animations au défilement · lookbook → lookbook ·
  hero → bandeau · pricing toggle → sélecteur de tarifs ·
  landing page → page unique (JAMAIS « page d'atterrissage ») ·
  modal → fenêtre · sticky → épinglé · wishlist → liste d'envies ·
  timeline → frise chronologique · UI cards → cartes · CTA → bouton d'action ·
  testimonials → témoignages · showcase → vitrine · booking → réservation ·
  parallax → parallaxe · carousel → carrousel · grid → grille ·
  filterable → filtrable · fullscreen → plein écran · dashboard → tableau de bord.
- N'emploie que le trait d'union ordinaire (-), jamais de tiret insécable.
- N'écris pas le nom du modèle au début : la phrase décrit le site, pas la marque.

Réponds UNIQUEMENT par un tableau JSON, sans balise de code, de la forme :
[{"id":"impact-01","fr":"..."}]`;

async function traduireLot(lot) {
  const demande =
    CONSIGNE +
    '\n\nÀ traduire :\n' +
    JSON.stringify(lot.map((e) => ({ id: e.id, en: e.description })), null, 0);

  if (PROVIDER === 'groq') {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            // Le mode JSON de Groq exige un objet racine, pas un tableau.
            content: demande + '\n\nEnveloppe le tableau dans {"traductions": [...]}.',
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const data = await res.json();
    const obj = JSON.parse(data.choices?.[0]?.message?.content ?? '{}');
    return obj.traductions ?? obj.translations ?? [];
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: demande },
        ],
      },
    ],
    generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const data = await res.json();
  const txt = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return JSON.parse(txt);
}

/*
  Le palier gratuit de Gemini plafonne à 20 requêtes par minute : à 700 ms
  d'intervalle la première salve part en 429 et le script rend zéro traduction.
  Mesuré. Trois secondes et demie entre deux appels tiennent le quota avec de
  la marge, et un 429 est respecté à la seconde près — l'API dit elle-même
  combien de temps attendre.
*/
const ENTRE_APPELS = 3500;

/*
  Reprise : une exécution interrompue (quota journalier, réseau) ne doit pas
  faire tout recommencer, ni surtout écraser ce qui était déjà traduit. Ce qui
  existe déjà dans registryFr.ts est relu et conservé ; seules les entrées
  manquantes sont demandées.
*/
/*
  Filet : le modèle glisse parfois un trait d'union insécable ou une espace fine
  au milieu d'un mot (« e‑commerce »), invisible en relecture et laid au rendu.
  On repasse derrière plutôt que d'espérer que la consigne suffise.
*/
function nettoyer(txt) {
  return txt
    .replace(/[\u2011\u2010]/g, '-')
    .replace(/[\u00a0\u202f\u2009]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const resultats = new Map();
try {
  const dejaLa = readFileSync(new URL('../lib/templates/registryFr.ts', import.meta.url), 'utf8');
  for (const m of dejaLa.matchAll(/^\s*"(impact-[^"]+)":\s*"((?:[^"\\]|\\.)*)",$/gm)) {
    resultats.set(m[1], JSON.parse(`"${m[2]}"`));
  }
  if (resultats.size) console.log('reprise :', resultats.size, 'déjà traduites');
} catch {
  /* premier passage */
}
const rates = [];

const aFaire = src.filter((e) => !resultats.has(e.id));
console.log('à traduire :', aFaire.length);

for (let i = 0; i < aFaire.length; i += LOT) {
  const lot = aFaire.slice(i, i + LOT);
  let ok = false;
  for (let essai = 0; essai < 3 && !ok; essai++) {
    try {
      const rep = await traduireLot(lot);
      for (const r of rep) {
        if (r?.id && typeof r.fr === 'string') resultats.set(r.id, nettoyer(r.fr));
      }
      ok = true;
    } catch (err) {
      const msg = String(err);
      // L'API dit combien de temps attendre : « Please retry in 38.2s ».
      const dit = msg.match(/retry in ([\d.]+)s/);
      const attente = dit ? Math.ceil(Number(dit[1]) * 1000) + 500 : 5000 * (essai + 1);
      if (essai === 2) rates.push({ lot: lot.map((e) => e.id), err: msg.slice(0, 160) });
      else await new Promise((r) => setTimeout(r, attente));
    }
  }
  console.log(`${resultats.size}/${src.length}`);
  // On écrit à chaque lot : une coupure ne doit pas coûter les lots précédents,
  // et c'est ce même fichier que la reprise relit.
  ecrire();
  await new Promise((r) => setTimeout(r, ENTRE_APPELS));
}

console.log('');
console.log('traduits :', resultats.size, '/', src.length);
if (rates.length) console.log('lots en échec :', JSON.stringify(rates).slice(0, 800));

// Contrôles : longueur, présence, et ce qui est resté anglais.
const suspects = [];
for (const e of src) {
  const fr = resultats.get(e.id);
  if (!fr) { suspects.push([e.id, 'MANQUANT']); continue; }
  if (fr.length < 60) suspects.push([e.id, 'trop court: ' + fr.length]);
  if (fr.length > 300) suspects.push([e.id, 'trop long: ' + fr.length]);
  if (/\b(with|and the|featuring|showcase|sticky|fullscreen)\b/i.test(fr)) suspects.push([e.id, 'anglais résiduel']);
}
console.log('suspects :', suspects.length);
console.log(JSON.stringify(suspects.slice(0, 20)));

function ecrire() {
  const entrees = src
    .filter((e) => resultats.has(e.id))
    .map((e) => `  "${e.id}": ${JSON.stringify(resultats.get(e.id))},`)
    .join('\n');

  const fichier = `// AUTO-GÉNÉRÉ — ne pas modifier à la main.
// Régénérer : GEMINI_API_KEY=… node scripts/traduire-descriptions.mjs
//
// Les \`description\` de lib/templates/registry.ts sont rédigées en anglais alors
// que ce fichier est censé être la source française du catalogue. Les fiches
// modèles (/themes/modele/[id]) s'adressent au marché français : leur poser un
// paragraphe anglais serait pire que de n'en poser aucun. Cette table porte donc
// la version française, traduite depuis l'anglais SANS rien y ajouter.
//
// ${resultats.size} entrées sur ${src.length}.

export const DESCRIPTION_FR: Record<string, string> = {
${entrees}
};
`;

  writeFileSync(new URL('../lib/templates/registryFr.ts', import.meta.url), fichier);
}

ecrire();
console.log('écrit : lib/templates/registryFr.ts —', resultats.size, 'entrées');
