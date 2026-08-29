/*
  Comparer le métier qu'un thème raconte au métier auquel on le propose.

    node scripts/juger-catalogue.mjs

  Une organisatrice de mariages recevait impact-127, un site de promoteur de
  concerts — « UPCOMING EVENTS », « FEATURED ARTISTS », photos de foule. Un
  couvreur recevait impact-207, un transporteur de fret. Ce n'est pas un défaut
  de câblage : le client remplit tout, et la page reste celle d'un autre métier.

  Le rattachement thème→secteur avait été fait mécaniquement. Ici on le juge :
  chaque thème est lu pour ce qu'il raconte — son nom de démonstration, ses
  prestations, ses titres de section — et l'on regarde si cela correspond à
  l'industrie où le formulaire le propose.

  Le verdict n'est pas automatique : il signale, il ne réécrit rien. Un thème
  peut être volontairement neutre, et beaucoup le sont.
*/
import fs from "node:fs";
import path from "node:path";

/* Les mots qui trahissent un métier, par industrie du catalogue. */
const SIGNAUX = {
  "Restauration": /\b(menu|carte|plat|chef|cuisine|restaurant|dish|tasting|dining|bistro|brasserie|café|coffee|roaster|bakery|boulanger|pâtisserie|sommelier|wine|vin|cave|cocktail|bar|table|couvert|réserver une table|reserve.{0,10}table)\b/gi,
  "Santé": /\b(patient|consultation|cabinet médical|médecin|docteur|clinique|soin|thérapeut|dentaire|dentist|kiné|ostéopath|santé|health|clinic|diagnostic|ordonnance|rendez-vous médical|vétérinaire)\b/gi,
  "Beauté": /\b(salon|coiffure|coiffeur|beauté|esthétique|spa|manucure|ongle|nail|barber|barbier|massage|soin du visage|épilation|hair|grooming|institut)\b/gi,
  "Sport & Coaching": /\b(coach|entraîn|training|gym|fitness|musculation|séance|workout|athlète|sport|yoga|pilates|studio de sport|salle de sport|expedition|summit|climb)\b/gi,
  "Immobilier & Architecture": /\b(architect|architecture|immobilier|real estate|bien|logement|villa|résidence|chantier|maîtrise d.œuvre|urbanis|construction|building|interior|intérieur|aménagement|listing|property)\b/gi,
  "Droit & Finance": /\b(avocat|cabinet d.avocats|juridique|litige|contentieux|droit|law|legal|counsel|attorney|barreau|notaire|comptab|fiscal|finance|investis|fund|capital|portfolio de participation|trading|patrimoine)\b/gi,
  "Art & Création": /\b(atelier|céramique|artisan|artiste|œuvre|galerie|gallery|exposition|photograph|peintre|sculpt|craft|handmade|fait main|tirage|print|collection|design studio|studio de design)\b/gi,
  "Événementiel": /\b(mariage|wedding|événement|event|réception|traiteur|festival|concert|billetterie|ticket|venue|salle de réception|organisation de mariage|promoteur|line-?up|dj|club)\b/gi,
  "Hôtellerie & Voyage": /\b(hôtel|hotel|chambre|suite|séjour|nuitée|voyage|travel|safari|croisière|yacht|expédition touristique|maison d.hôtes|gîte|réservation de séjour|conciergerie|escapade)\b/gi,
  "Tech & Agences": /\b(saas|api|développement|developer|logiciel|software|plateforme|platform|agence web|startup|produit numérique|cloud|serveur|latence|latency|déploiement|deploy|open.?source|dashboard|analytics|podcast|blockchain|quantum)\b/gi,
  "Services & Artisanat": /\b(couvreur|toiture|plomb|électric|menuis|maçon|peintre en bâtiment|serrur|chauffag|dépann|devis|garantie décennale|artisanat du bâtiment|nettoyage|déménag|transport|fret|freight|logistique|jardin|paysagis)\b/gi,
};

const SECTEURS = JSON.parse(fs.readFileSync("/tmp/theme-secteurs.json", "utf8"));
const DOMAINES = JSON.parse(fs.readFileSync("/tmp/secteur-domaine.json", "utf8"));

/*
  Le nom de démonstration est le signal le plus sûr.

  Le texte seul se trompe une fois sur deux : « Galerie », « À Propos »,
  « collection » se trouvent partout et font pencher vers « Art & Création » six
  thèmes correctement rattachés — impact-300 est un cabinet d'ostéopathie,
  impact-301 un cabinet d'avocats. Le nom, lui, ne ment pas : « Clinique du Bois
  Vert » est une clinique, « Horizon Maritime Group » un affréteur.

  On ne signale donc un écart que si le nom ET le texte penchent du même côté,
  et que ce côté n'est pas celui du formulaire.
*/
const MARQUES = (() => {
  const src = fs.readFileSync("lib/templates/marquesDemo.ts", "utf8");
  const bloc = src.slice(src.indexOf("export const MARQUE_DEMO:"));
  const out = {};
  for (const m of bloc.matchAll(/"(impact-\d+)":\s*"((?:[^"\\]|\\.)*)"/g)) out[m[1]] = m[2];
  return out;
})();

function texteDuTheme(theme) {
  let t = "";
  for (const f of ["page.tsx", "shared.tsx", "layout.tsx"]) {
    const p = path.join("app/templates", theme, f);
    if (fs.existsSync(p)) t += fs.readFileSync(p, "utf8");
  }
  /* Seulement les chaînes affichées : le code lui-même parle de « services »
     et de « components » sans rien dire du métier. */
  return [...t.matchAll(/"([^"\\]{4,120})"|'([^'\\]{4,120})'|>([^<>{}\n]{4,120})</g)]
    .map((m) => m[1] ?? m[2] ?? m[3]).join(" ");
}

const rapport = [];
for (const theme of Object.keys(SECTEURS).sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)))) {
  const texte = texteDuTheme(theme);
  if (!texte) continue;

  const scores = Object.entries(SIGNAUX)
    .map(([industrie, motif]) => [industrie, (texte.match(motif) ?? []).length])
    .sort((a, b) => b[1] - a[1]);

  const [devine, points] = scores[0];
  const second = scores[1][1];
  /* Un thème neutre ne penche vers rien : on ne le juge pas. */
  const net = points >= 6 && points >= second * 1.6;

  /*
    Juger secteur par secteur, non pas thème par thème.

    impact-180 est un site de chauffagiste proposé à la fois aux toiletteurs et
    aux coiffeurs. En regardant le thème dans son ensemble, un seul secteur bien
    rattaché suffisait à le blanchir — et le coiffeur continuait de recevoir
    « URGENCE 4H » et un tableau électrique en couverture.
  */
  const secteurs = SECTEURS[theme] ?? [];
  const fautifs = secteurs.filter((s) => DOMAINES[s] && DOMAINES[s] !== devine);
  if (!net || fautifs.length === 0) continue;
  const proposes = [...new Set(fautifs.map((s) => DOMAINES[s]))];

  /* Le nom de démonstration doit pencher du même côté que le texte. */
  const marque = MARQUES[theme] ?? "";
  if (!marque) continue;
  const versLaMarque = Object.entries(SIGNAUX)
    .map(([industrie, motif]) => [industrie, (marque.match(motif) ?? []).length])
    .sort((a, b) => b[1] - a[1]);
  if (versLaMarque[0][1] === 0 || versLaMarque[0][0] !== devine) continue;

  rapport.push({ theme, raconte: devine, points, marque, secteurs: fautifs, propose: proposes.join(", ") });
}

console.log(`${rapport.length} thèmes racontent un métier autre que celui auquel on les propose :\n`);
for (const r of rapport) {
  console.log(`  ${r.theme.padEnd(12)} « ${r.marque} » raconte ${r.raconte} · proposé à ${r.secteurs.join(", ")} (${r.propose})`);
}
fs.writeFileSync("/tmp/catalogue-ecarts.json", JSON.stringify(rapport, null, 1));
