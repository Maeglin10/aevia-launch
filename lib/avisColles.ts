/*
  Reconnaître des avis clients dans un bloc de texte collé.

  Le formulaire savait déjà saisir les avis un par un. Personne ne retape
  quarante avis Google à la main : le champ restait vide, le thème gardait ses
  exemples, et le site partait sans preuve sociale.

  On accepte donc le collage brut — la sélection de la page Google, de Planity,
  de Doctolib, d'un ancien site, ou d'un courriel — et on en tire les lignes
  auteur / note / texte. Ce que l'on ne reconnaît pas est rendu tel quel dans un
  avis à corriger à la main plutôt que jeté en silence.

  Rien n'est inventé ici : on découpe et on range, on n'écrit pas un mot.
*/

export interface AvisLu {
  author: string;
  text: string;
  rating: number;
  source?: string;
}

/* Les mentions que les plateformes intercalent et qui ne sont pas des avis. */
const BRUIT = new RegExp(
  [
    "^\\d+\\s*(avis|reviews?|opiniones|bewertungen|avaliações)\\b",
    "^(voir|afficher|lire)\\s+(plus|la suite|tous)",
    "^(see|read)\\s+more",
    "^(utile|helpful|partager|share|signaler|report|répondre|reply|traduire|translate)",
    "^(réponse|response|respuesta|antwort)\\s+(du|de la|de l|from|des)",
    "^(local\\s+guide|guide\\s+local)",
    "^(nouveau|new)$",
    "^\\d+\\s*(photos?|contributions?)$",
  ].join("|"),
  "i",
);

/* « il y a 3 mois », « 2 weeks ago », « hace un mes », « vor 2 Monaten ». */
const ANCIENNETE =
  /^(il y a|hace|vor|há)\s+.{1,20}$|^\d+\s*(minutes?|heures?|jours?|semaines?|mois|ans?|hours?|days?|weeks?|months?|years?)\s+ago$|^(aujourd'hui|hier|today|yesterday)$/i;

/* « 5/5 », « 4,5 étoiles », « ★★★★★ », « Note : 5 ». */
function noteDe(ligne: string): number | undefined {
  const etoiles = (ligne.match(/[★⭐]/g) ?? []).length;
  if (etoiles >= 1 && etoiles <= 5) return etoiles;
  const surCinq = /(\d)(?:[.,](\d))?\s*(?:\/|sur\s+)\s*5/i.exec(ligne);
  if (surCinq) return Math.round(Number(`${surCinq[1]}.${surCinq[2] ?? 0}`));
  const nommee = /(?:note|rating|puntuación|bewertung)\s*[:=]?\s*(\d)/i.exec(ligne);
  if (nommee) return Number(nommee[1]);
  const seule = /^(\d)(?:[.,]\d)?\s*(étoiles?|stars?|estrellas?|sterne)$/i.exec(ligne.trim());
  if (seule) return Number(seule[1]);
  return undefined;
}

/*
  Une ligne qui nomme quelqu'un : deux ou trois mots capitalisés, sans
  ponctuation de phrase. « Marie L. », « Jean-Pierre Dubois », « M. Leclerc ».
  Une phrase d'avis en est écartée par sa longueur et son point final.
*/
function ressembleAUnNom(ligne: string): boolean {
  const t = ligne.trim();
  if (t.length < 2 || t.length > 40) return false;
  if (/[.!?]$/.test(t) && !/\b[A-ZÀ-Ý]\.$/.test(t)) return false;
  if (/[,;:•|]/.test(t)) return false;
  const mots = t.split(/\s+/);
  if (mots.length > 4) return false;
  return mots.every((m) => /^[A-ZÀ-Ý]/.test(m) || /^(de|du|le|la|van|von|del|di)$/i.test(m));
}

/*
  Le texte de l'avis : une vraie phrase. On exige une longueur minimale pour ne
  pas prendre « Merci ! » posé seul entre deux noms — mais on garde les avis
  courts dès qu'ils portent un verbe et une ponctuation.
*/
function ressembleAUnAvis(ligne: string): boolean {
  const t = ligne.trim();
  if (t.length < 25) return false;
  return /\s/.test(t) && /[a-zà-ÿ]/.test(t);
}

/**
 * Lire un bloc collé et en tirer des avis.
 *
 * `source` sert d'étiquette par défaut — « Google », « Planity » — quand le
 * texte collé ne la porte pas lui-même.
 */
export function lireLesAvisColles(brut: string, source = ""): AvisLu[] {
  const lignes = brut
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !BRUIT.test(l) && !ANCIENNETE.test(l));

  const avis: AvisLu[] = [];
  let auteur = "";
  let note: number | undefined;
  let morceaux: string[] = [];

  /* Un avis se ferme quand on a de quoi l'écrire. */
  const fermer = () => {
    const texte = morceaux.join(" ").trim();
    if (texte) avis.push({ author: auteur, text: texte, rating: note ?? 5, source: source || undefined });
    auteur = "";
    note = undefined;
    morceaux = [];
  };

  for (const ligne of lignes) {
    const n = noteDe(ligne);
    /* Une ligne qui n'est QUE la note appartient à l'avis en cours de lecture. */
    if (n !== undefined && !ressembleAUnAvis(ligne)) {
      note = n;
      continue;
    }

    if (ressembleAUnNom(ligne)) {
      /*
        Un nom qui arrive alors qu'un texte est en cours ferme l'avis
        précédent. Deux cas : l'avis n'avait pas d'auteur — Google le met
        au-dessus, un ancien site en dessous — et ce nom est le sien ; ou il en
        avait déjà un, et ce nom ouvre l'avis suivant. Ne pas distinguer les
        deux faisait disparaître l'auteur du second avis d'un collage Google.
      */
      if (morceaux.length) {
        const ouvreLeSuivant = Boolean(auteur);
        if (!auteur) auteur = ligne;
        fermer();
        if (ouvreLeSuivant) auteur = ligne;
      } else {
        auteur = ligne;
      }
      continue;
    }

    if (ressembleAUnAvis(ligne)) {
      /* Deux paragraphes de suite appartiennent au même avis tant qu'aucun nom
         ni aucune note ne les sépare. */
      morceaux.push(ligne);
      continue;
    }

    /* Ni nom, ni note, ni phrase : un fragment. On le rattache au texte en
       cours plutôt que de le perdre. */
    if (morceaux.length) morceaux.push(ligne);
  }
  fermer();

  /* Un même avis collé deux fois — la page en montre souvent un extrait puis
     le texte entier. On garde le plus long. */
  const parDebut = new Map<string, AvisLu>();
  for (const a of avis) {
    const clef = a.text.slice(0, 40).toLowerCase().replace(/[^a-zà-ÿ0-9]/g, "");
    const vu = parDebut.get(clef);
    if (!vu || a.text.length > vu.text.length) parDebut.set(clef, a);
  }

  return [...parDebut.values()].map((a) => ({
    ...a,
    rating: Math.min(5, Math.max(1, Math.round(a.rating))),
  }));
}
