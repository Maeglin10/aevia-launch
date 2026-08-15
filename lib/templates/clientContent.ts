/**
 * Le contrat de lecture des thèmes : une forme unique par bloc, quelle que soit
 * la provenance de la donnée.
 *
 * Trois vocabulaires coexistent pour les mêmes idées.
 *
 *   businessProfile.services          { name, price, duration, description }
 *   generatedContent.services         { title, description }
 *
 *   businessProfile…featuredReviews   { author, text, rating, source }
 *   generatedContent.testimonials     { name, role, text, rating }
 *
 * Les thèmes lisaient l'un ou l'autre au hasard. impact-351 lisait `s.title` et
 * `r.name` : les services saisis par le client tombaient donc systématiquement
 * sur le titre de démonstration, et ses avis sur l'auteur de démonstration —
 * silencieusement, puisque `undefined` déclenche le repli sans erreur. Ce
 * module est le seul endroit qui connaît les trois vocabulaires.
 *
 * L'ordre est toujours le même : donnée du client, puis contenu généré, puis
 * rien. Le repli sur la démonstration reste au thème, qui seul sait quoi
 * afficher à la place.
 */

export interface ClientService {
  title: string;
  desc: string;
  /** Tel que saisi : un montant, une fourchette ou « sur devis ». */
  price?: string;
  duration?: string;
  /*
    Les deux vocabulaires sont émis ensemble, à dessein. 318 thèmes lisent
    `s.title` et 136 lisent `s.name` ; 182 lisent `r.name` et 76 `r.author`.
    Réécrire ces 700 lectures reviendrait à toucher chaque section de chaque
    fichier pour un gain nul et un risque réel. On publie donc les alias : la
    bascule d'un thème vers le contrat ne change qu'une ligne, celle de la
    source.
  */
  name: string;
  description: string;
}

export interface ClientReview {
  text: string;
  author: string;
  /** Ville, plateforme ou rôle — ce qui donne du poids à l'avis. */
  detail?: string;
  rating?: number;
  /** Alias : voir la note sur ClientService. `stars` est lu par neuf thèmes. */
  name: string;
  role?: string;
  location?: string;
  source?: string;
  stars?: number;
}

export interface ClientStat {
  value: string;
  label: string;
}

export interface ClientMember {
  name: string;
  role: string;
  photoUrl?: string;
}

export interface ClientFaq {
  q: string;
  a: string;
}

/** Ce qu'un thème reçoit de `/api/sessions`. Volontairement permissif. */
interface SessionLike {
  formData?: any;
  generatedContent?: any;
  businessProfile?: any;
  sectionOverrides?: Record<string, string>;
}

const trimmed = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** Écarte les entrées vides plutôt que d'afficher une carte sans titre. */
function keep<T>(rows: T[], has: (row: T) => boolean): T[] | undefined {
  const out = rows.filter(has);
  return out.length > 0 ? out : undefined;
}

/** Construit une prestation en publiant les deux vocabulaires. */
function service(title: string, desc: string, price?: string, duration?: string): ClientService {
  return { title, desc, price, duration, name: title, description: desc };
}

/** Idem pour un avis. */
function review(text: string, author: string, detail?: string, rating?: number): ClientReview {
  return {
    text,
    author,
    detail,
    rating,
    name: author,
    role: detail,
    location: detail,
    source: detail,
    stars: rating,
  };
}

/**
 * Une liste, quoi qu'on nous donne.
 *
 * Dix-neuf lectures du contrat faisaient `(champ ?? []).map(...)`. Le jour où
 * un profil arrive avec `openingHours` en objet — « { lundi: "9h-18h" } », ce
 * qu'un import ou une saisie produit très naturellement — `.map` n'existe pas,
 * l'exception remonte, et la page entière disparaît. Mesuré : quinze thèmes
 * blancs pour un seul champ de la mauvaise forme.
 *
 * Une donnée mal formée doit coûter une section, jamais la page.
 */
function enTableau(v: unknown): any[] {
  if (Array.isArray(v)) return v;
  if (v && typeof v === "object") return Object.values(v as Record<string, unknown>);
  return [];
}

export function clientServices(s: SessionLike | null | undefined): ClientService[] | undefined {
  const own = enTableau(s?.businessProfile?.services);
  const fromProfile = keep(
    own.map((r) => service(
      trimmed(r?.name) || trimmed(r?.title),
      trimmed(r?.description) || trimmed(r?.desc),
      trimmed(r?.price) || undefined,
      trimmed(r?.duration) || undefined,
    )),
    (r) => Boolean(r.title),
  );
  if (fromProfile) return fromProfile;

  /*
    Un restaurateur ne remplit pas de « prestations » : son archétype lui demande
    une carte, un commerçant un catalogue. Les thèmes, eux, lisent presque tous
    « clientServices » pour leur section d'offres — mesuré : trente-deux thèmes
    affichaient les plats de leur démonstration à un restaurateur qui avait
    rempli la sienne, faute de ce repli.

    On sert donc la carte, puis le catalogue, quand il n'y a pas de prestations.
    Un établissement qui remplit les deux garde ses prestations en premier.
  */
  const carte = clientMenu(s);
  if (carte) return carte.map((d) => service(d.name, d.description, d.price));
  const catalogue = clientProducts(s);
  if (catalogue) return catalogue.map((d) => service(d.name, d.description, d.price));

  /*
    L'agence immobilière saisit des biens. Cinq de ses sept thèmes affichent une
    section de prestations : sans ce dernier repli, elle y lisait « Détartrage
    Vidal » ou l'exemple du thème.
  */
  const biens = enTableau(s?.businessProfile?.listings);
  const desBiens = keep(
    biens.map((r) => service(
      trimmed(r?.title),
      [trimmed(r?.city), trimmed(r?.surface), trimmed(r?.rooms)].filter(Boolean).join(" · "),
      trimmed(r?.price) || undefined,
    )),
    (r) => Boolean(r.title),
  );
  if (desBiens) return desBiens;

  const gen = enTableau(s?.generatedContent?.services);
  return keep(
    gen.map((r) =>
      service(trimmed(r?.title) || trimmed(r?.name), trimmed(r?.description) || trimmed(r?.desc)),
    ),
    (r) => Boolean(r.title),
  );
}

export function clientReviews(s: SessionLike | null | undefined): ClientReview[] | undefined {
  const own = enTableau(s?.businessProfile?.reputation?.featuredReviews);
  const fromProfile = keep(
    own.map((r) =>
      review(
        trimmed(r?.text),
        trimmed(r?.author) || trimmed(r?.name),
        trimmed(r?.source) || trimmed(r?.location) || trimmed(r?.role) || undefined,
        typeof r?.rating === "number" ? r.rating : undefined,
      ),
    ),
    (r) => Boolean(r.text),
  );
  if (fromProfile) return fromProfile;

  // Les témoignages générés restent un repli : le client a demandé qu'ils ne
  // disparaissent pas, mais les siens passent devant.
  const gen = enTableau(s?.generatedContent?.testimonials);
  return keep(
    gen.map((r) =>
      review(
        trimmed(r?.text),
        trimmed(r?.name) || trimmed(r?.author),
        trimmed(r?.role) || trimmed(r?.source) || undefined,
        typeof r?.rating === "number" ? r.rating : undefined,
      ),
    ),
    (r) => Boolean(r.text),
  );
}

export function clientStats(s: SessionLike | null | undefined): ClientStat[] | undefined {
  const rows = enTableau(s?.businessProfile?.keyStats);
  return keep(
    rows.map((r) => ({ value: trimmed(r?.value), label: trimmed(r?.label) })),
    (r) => Boolean(r.value),
  );
}

export function clientCertifications(s: SessionLike | null | undefined): string[] | undefined {
  const rows = enTableau(s?.businessProfile?.certifications);
  return keep(rows.map(trimmed), Boolean);
}

export function clientFaq(s: SessionLike | null | undefined): ClientFaq[] | undefined {
  const rows = enTableau(s?.businessProfile?.faq);
  return keep(
    rows.map((r) => ({ q: trimmed(r?.q), a: trimmed(r?.a) })),
    (r) => Boolean(r.q),
  );
}

export function clientTeam(s: SessionLike | null | undefined): ClientMember[] | undefined {
  const rows = enTableau(s?.businessProfile?.team);
  return keep(
    rows.map((r) => ({
      name: trimmed(r?.name),
      role: trimmed(r?.role),
      photoUrl: trimmed(r?.photoUrl) || undefined,
    })),
    (r) => Boolean(r.name),
  );
}

export function clientAreas(s: SessionLike | null | undefined): string[] | undefined {
  const rows = enTableau(s?.businessProfile?.geo?.serviceAreas);
  return keep(rows.map(trimmed), Boolean);
}

/**
 * La retouche du client sur un texte de section, s'il en a fait une.
 *
 * Le wizard recueille la donnée structurée — prestations, tarifs, horaires,
 * équipe. Reste la prose : le titre d'une section, sa phrase d'introduction, le
 * libellé d'un bouton. Vingt questions de plus dans le wizard seraient
 * indigestes ; le client les retouche depuis l'aperçu, et le thème les lit ici.
 *
 * Sans retouche, la fonction ne rend rien et le thème garde son texte — la règle
 * de tout le catalogue.
 */
export function clientText(s: SessionLike | null | undefined, cle: string): string | undefined {
  return trimmed(s?.sectionOverrides?.[cle]) || undefined;
}

/**
 * La liste de libellés retouchée par le client, s'il en a retouché une.
 *
 * Beaucoup de sections rendent une liste de mots sans structure — les valeurs
 * d'une agence, le matériel d'un photographe, les étapes d'un sourcing. Aucun
 * champ du wizard ne leur correspond, et leur inventer un à chacune reviendrait
 * à poser cent questions. Le client les retouche depuis l'aperçu, une ligne par
 * entrée.
 *
 * Sans retouche, la fonction ne rend rien et le thème garde sa liste.
 */
export function clientList(s: SessionLike | null | undefined, cle: string): string[] | undefined {
  const brut = trimmed(s?.sectionOverrides?.[cle]);
  if (!brut) return undefined;
  return keep(brut.split("\n").map(trimmed), Boolean);
}

export interface ClientDish {
  /** Le nom du plat ou de l'article, tel que le client l'a écrit. */
  name: string;
  category: string;
  description: string;
  price: string;
  /** Alias, comme ailleurs dans ce fichier. */
  title: string;
  desc: string;
}

function dish(name?: string, category?: string, description?: string, price?: string): ClientDish {
  const n = name ?? "";
  const d = description ?? "";
  return { name: n, title: n, category: category ?? "", description: d, desc: d, price: price ?? "" };
}

/**
 * La carte du restaurant, telle que le client l'a saisie.
 *
 * Le wizard la demande depuis toujours — l'archétype « restauration » a un champ
 * « menu », et la session sait la stocker. Mais aucune fonction ne savait la
 * relire : dix-sept thèmes déclaraient une section « carte » et affichaient les
 * plats de leur démonstration, sur le site d'un restaurateur qui avait rempli la
 * sienne. Pour lui, c'est le contenu principal de sa page.
 */
export function clientMenu(s: SessionLike | null | undefined): ClientDish[] | undefined {
  const rows = enTableau(s?.businessProfile?.menu);
  const fromProfile = keep(
    rows.map((r) => dish(trimmed(r?.name) || trimmed(r?.title), trimmed(r?.category), trimmed(r?.description) || trimmed(r?.desc), trimmed(r?.price))),
    (r) => Boolean(r.name),
  );
  if (fromProfile) return fromProfile;

  // Le contenu généré emploie « menuItems » ; on l'accepte aussi.
  const gen = enTableau(s?.generatedContent?.menuItems);
  return keep(
    gen.map((r) => dish(trimmed(r?.name) || trimmed(r?.title), trimmed(r?.category), trimmed(r?.description) || trimmed(r?.desc), trimmed(r?.price))),
    (r) => Boolean(r.name),
  );
}

/**
 * Le catalogue de la boutique, tel que le client l'a saisi.
 *
 * Même histoire que la carte : quinze thèmes déclaraient une section
 * « produits » sans jamais lire ceux du client.
 */
export function clientProducts(s: SessionLike | null | undefined): ClientDish[] | undefined {
  const rows = enTableau(s?.businessProfile?.products);
  return keep(
    rows.map((r) => dish(trimmed(r?.name) || trimmed(r?.title), trimmed(r?.category), trimmed(r?.description) || trimmed(r?.desc), trimmed(r?.price))),
    (r) => Boolean(r.name),
  );
}

export interface ClientWork {
  title: string;
  /** Ce qui situe la réalisation : un lieu, une année, une catégorie. */
  detail: string;
  desc: string;
  imageUrl?: string;
  /** Alias, comme ailleurs dans ce fichier. */
  name: string;
  description: string;
}

/**
 * Les réalisations du client.
 *
 * Un architecte, un paysagiste, un photographe montrent des projets ; le wizard
 * les recueille sous `beforeAfter` pour les métiers de chantier, `listings` pour
 * l'immobilier, `products` pour les boutiques. Les thèmes, eux, affichaient
 * soixante-sept galeries d'exemples — d'où « ÉQUIPEMENT PUBLIC · BORDEAUX, 33 »
 * sur le site d'un client savoyard, jusqu'à ce qu'il fournisse les siennes.
 */
export function clientWorks(s: SessionLike | null | undefined): ClientWork[] | undefined {
  const oeuvre = (title: string, detail: string, desc: string, imageUrl?: string): ClientWork => ({
    title, detail, desc, imageUrl, name: title, description: desc,
  });

  const avantApres = enTableau(s?.businessProfile?.beforeAfter);
  const desChantiers = keep(
    avantApres.map((r) =>
      oeuvre(trimmed(r?.caption), "", trimmed(r?.caption), trimmed(r?.afterUrl) || trimmed(r?.beforeUrl) || undefined),
    ),
    (r) => Boolean(r.title || r.imageUrl),
  );
  if (desChantiers) return desChantiers;

  const biens = enTableau(s?.businessProfile?.listings);
  const desBiens = keep(
    biens.map((r) =>
      oeuvre(
        trimmed(r?.title),
        [trimmed(r?.city), trimmed(r?.surface), trimmed(r?.status)].filter(Boolean).join(" · "),
        trimmed(r?.price),
        trimmed(r?.photoUrl) || undefined,
      ),
    ),
    (r) => Boolean(r.title),
  );
  if (desBiens) return desBiens;

  const produits = enTableau(s?.businessProfile?.products);
  return keep(
    produits.map((r) =>
      oeuvre(trimmed(r?.name), trimmed(r?.price), trimmed(r?.description), trimmed(r?.photoUrl) || undefined),
    ),
    (r) => Boolean(r.title),
  );
}

/** Le nom de l'entreprise, tel qu'il doit apparaître partout. */
export function clientName(s: SessionLike | null | undefined): string | undefined {
  return trimmed(s?.formData?.businessName) || undefined;
}

/**
 * L'accroche du hero.
 *
 * `tagline` est un champ obligatoire du wizard — « ce que vous faites », écrit
 * par le client lui-même. Il passe donc avant `heroHeadline`, qui est rédigé
 * pour lui. Sans l'un ni l'autre, le thème garde son accroche de démonstration.
 */
export function clientTagline(s: SessionLike | null | undefined): string | undefined {
  return (
    trimmed(s?.formData?.tagline) ||
    trimmed(s?.formData?.slogan) ||
    trimmed(s?.generatedContent?.heroHeadline) ||
    undefined
  );
}

/**
 * L'accroche du client, répartie sur les lignes que le thème a prévues.
 *
 * Le titre d'un hero est rarement une chaîne : c'est deux, trois ou quatre
 * lignes, chacune avec sa couleur, sa graisse et son animation propre. Garder
 * celles du thème donnait « We build the internet's best. » sur le site d'un
 * plombier — la première chose que le visiteur lit parlait d'une autre
 * entreprise.
 *
 * On coupe donc l'accroche aux mots, en `total` parts d'à peu près même
 * longueur, et le thème garde tout le reste : le nombre de lignes, leurs
 * styles, leurs animations.
 *
 * Rien à répartir sans accroche : le thème garde alors la sienne.
 */
/**
 * Ce que le titre du hero a retenu, pour que le sous-titre ne le répète pas.
 *
 * Le titre est rendu avant lui : au moment où le sous-titre se calcule, cette
 * valeur est celle de la page en cours.
 */
let phraseRetenue: string | undefined;

/**
 * Découpe une phrase en `total` lignes d'à peu près même longueur.
 *
 * Couper au nombre de mots déséquilibre — « Votre plombier de / confiance à
 * Annecy depuis 1998 ». On vise pour chaque ligne une longueur écrite d'environ
 * un `total`-ième de la phrase, en gardant assez de mots pour les suivantes.
 */
function couperEnLignes(phrase: string, total: number): string[] {
  /*
    Un mot-outil ne tient pas une ligne à lui seul. « Photographe à Valence »
    coupé en trois donnait « Photographe / à / Valence », et le « à » solitaire
    en cinquante-six pixels se lit comme une coquille. On l'attache donc au mot
    qui le suit avant de répartir.
  */
  const bruts = phrase.split(/\s+/).filter(Boolean);
  const mots: string[] = [];
  for (let i = 0; i < bruts.length; i++) {
    if (bruts[i].length <= 3 && /^\p{L}+$/u.test(bruts[i]) && i + 1 < bruts.length) {
      mots.push(`${bruts[i]} ${bruts[i + 1]}`);
      i++;
    } else {
      mots.push(bruts[i]);
    }
  }
  if (mots.length <= total) {
    const out = mots.slice();
    while (out.length < total) out.push("");
    return out;
  }
  const longueur = phrase.length;
  const lignes: string[] = [];
  let courante = "";
  for (let i = 0; i < mots.length; i++) {
    const restantes = total - lignes.length;
    const motsRestants = mots.length - i;
    const cible = (longueur - lignes.join(" ").length) / restantes;
    const apres = courante ? courante.length + 1 + mots[i].length : mots[i].length;
    const trop = Boolean(courante) && Math.abs(apres - cible) > Math.abs(courante.length - cible);
    /*
      Après avoir poussé la ligne courante il restera `restantes - 1` lignes à
      remplir : exiger autant de mots que de lignes restantes était un cran trop
      strict, et « Charpentes Traditionnelles de Savoie » tenait tout entier sur
      la première ligne, la seconde vide.
    */
    if (trop && restantes > 1 && motsRestants >= restantes - 1) {
      lignes.push(courante);
      courante = mots[i];
    } else {
      courante = courante ? `${courante} ${mots[i]}` : mots[i];
    }
  }
  if (courante) lignes.push(courante);
  while (lignes.length < total) lignes.push("");
  while (lignes.length > total) lignes[total - 1] += ` ${lignes.pop()}`;
  return lignes;
}

/**
 * La phrase que le titre du hero peut accueillir sans casser sa mise en page.
 *
 * Un titre de hero est dessiné pour ce qu'il dit : « TAME YOUR BIOLOGY. » tient
 * en cent soixante-seize pixels parce que sa plus longue ligne fait neuf
 * caractères. Y verser « Votre coiffeur de confiance à Chambéry depuis 1998 »
 * couvrait l'écran entier et passait par-dessus l'en-tête.
 *
 * Ce qui compte est donc la ligne la plus longue, pas le total : on essaie
 * l'accroche, puis « Coiffeur à Chambéry », puis le nom, et l'on retient la
 * première dont aucune ligne ne dépasse le gabarit du thème. Si rien ne tient,
 * le thème garde son titre — son dessin passe avant.
 */
function phraseDeHero(
  s: SessionLike | null | undefined,
  total: number,
  maxLigne?: number,
): string | undefined {
  const large = maxLigne && maxLigne > 0 ? Math.max(maxLigne, 6) + 2 : Infinity;
  const metier = trimmed(s?.formData?.businessType);
  const majuscule = (x: string) => `${x[0].toUpperCase()}${x.slice(1)}`;
  const ville = clientCity(s);
  const candidates = [
    clientTagline(s),
    metier && ville ? `${majuscule(metier)} à ${ville}` : undefined,
    metier ? majuscule(metier) : undefined,
    clientName(s),
  ];
  for (const x of candidates) {
    if (!x) continue;
    if (couperEnLignes(x, total).every((l) => l.length <= large)) return x;
  }
  return undefined;
}

export function clientHeroLine(
  s: SessionLike | null | undefined,
  rang: number,
  total: number,
  maxLigne?: number,
): string | undefined {
  if (total < 1 || rang < 0 || rang >= total) return undefined;
  const phrase = phraseDeHero(s, total, maxLigne);
  if (!phrase) return undefined;
  phraseRetenue = phrase;
  /*
    Une ligne sans mot reste vide : rendre la main au thème pour la seule ligne
    en trop mélangeait les deux titres — « Plombier / à Annecy / de demain » sur
    le site d'un plombier annécien.
  */
  return couperEnLignes(phrase, total)[rang] ?? "";
}

/**
 * La ligne sous le titre du hero, quand le titre porte déjà l'accroche.
 *
 * Répéter l'accroche deux fois de suite — en très gros, puis en petit — se lit
 * comme un bégaiement. Le sous-titre annonce donc ce que l'entreprise fait :
 * ses trois premières prestations, à défaut les communes qu'elle dessert. Rien
 * n'est inventé ; sans ces données, le thème garde sa phrase.
 */
export function clientHeroSubtitle(s: SessionLike | null | undefined): string | undefined {
  /*
    L'accroche d'abord, si le titre ne l'a pas prise. Le gabarit du thème réduit
    souvent la phrase du client à « Plombier à Annecy » pour ne pas déborder — et
    ce qu'il a écrit ne se lisait alors nulle part. Le titre note ce qu'il a
    retenu ; le sous-titre reprend le reste.
  */
  const accroche = clientTagline(s);
  if (accroche && accroche !== phraseRetenue) return accroche;
  return clientHeroPrestations(s);
}

/**
 * Ce que l'entreprise fait, jamais son accroche.
 *
 * « phraseRetenue » n'est fiable que si le titre s'évalue avant le sous-titre —
 * or React ne le garantit pas, et l'ordre du JSX n'est pas celui de l'écran. Sur
 * seize thèmes, le paragraphe s'évaluait le premier, rendait l'accroche, puis le
 * titre la reprenait : le visiteur la lisait deux fois.
 *
 * Quand un thème porte déjà l'accroche ailleurs, il appelle cette fonction-ci.
 * Le choix se fait une fois, au câblage, et ne dépend plus de rien à
 * l'exécution.
 */
export function clientHeroPrestations(s: SessionLike | null | undefined): string | undefined {
  const presta = (clientServices(s) ?? []).map((x) => x.title).filter(Boolean).slice(0, 3);
  if (presta.length >= 2) return presta.join(" · ");
  const zones = clientAreas(s) ?? [];
  if (zones.length >= 2) return `Interventions à ${zones.slice(0, 4).join(", ")}`;
  const ville = clientCity(s);
  if (presta.length === 1 && ville) return `${presta[0]} · ${ville}`;
  return undefined;
}

/**
 * Le métier du client, tel qu'il l'a nommé au wizard.
 *
 * Les thèmes écrivent le leur en toutes lettres dans leurs sur-titres —
 * « Paysagiste · Nantes », « Ostéopathe · Lyon » — et le site d'un coiffeur
 * annonçait « PAYSAGISTE · CHAMBÉRY ». La ville était juste, le métier venait
 * de la démonstration.
 */
export function clientTrade(s: SessionLike | null | undefined): string | undefined {
  const brut = trimmed(s?.formData?.businessType) || trimmed(s?.formData?.niche);
  if (!brut) return undefined;
  return `${brut[0].toUpperCase()}${brut.slice(1)}`;
}

/**
 * L'accroche du client, si le titre ne l'a pas déjà prise.
 *
 * Sur les thèmes dont le titre ne tient qu'en sept caractères, le contrat y
 * écrit « Plombier à Annecy » pour ne pas déborder — et la phrase que le client
 * a écrite ne se lit alors nulle part. Cette fonction la rend, une seule fois,
 * et ne rend rien quand elle est déjà à l'écran.
 */
export function clientAccrocheRestante(
  s: SessionLike | null | undefined,
  total?: number,
  maxLigne?: number,
): string | undefined {
  const accroche = clientTagline(s);
  if (!accroche) return undefined;

  /*
    Avec le gabarit du titre, on sait sans rien mémoriser si celui-ci prendra
    l'accroche. C'est la seule façon fiable : « phraseRetenue » suppose que le
    titre s'évalue avant cette ligne, or React ne le garantit pas — sur seize
    thèmes le paragraphe passait le premier, rendait l'accroche, et le titre la
    reprenait. Le visiteur la lisait deux fois.
  */
  if (total && total > 0) return phraseDeHero(s, total, maxLigne) === accroche ? undefined : accroche;

  return accroche === phraseRetenue ? undefined : accroche;
}

/**
 * La courte ligne posée au-dessus du titre du hero.
 *
 * Les thèmes y écrivent leur propre identité — « VISUAL STORYTELLER », « PALACE
 * — FOUNDED 1887 » — et c'était la dernière ligne du hero à parler d'une autre
 * entreprise une fois le titre et le sous-titre branchés. Elle annonce le métier
 * et la ville, ce que le client a saisi lui-même.
 */
export function clientEyebrow(s: SessionLike | null | undefined): string | undefined {
  const metier = clientTrade(s);
  const ville = clientCity(s);
  if (metier && ville) return `${metier} · ${ville}`;
  return metier ?? undefined;
}

/** La ville, pour les sur-titres du genre « Couvreur-zingueur · Lyon ». */
export function clientCity(s: SessionLike | null | undefined): string | undefined {
  return (
    trimmed(s?.formData?.city) || trimmed(s?.businessProfile?.geo?.primaryCity) || undefined
  );
}

/**
 * L'adresse postale du client.
 *
 * Elle est saisie à l'étape légale, sous `legal.companyAddress` — et aucun thème
 * ne la lisait : 67 d'entre eux affichaient une adresse parisienne inventée sous
 * le nom du client, ce qui est pire qu'aucune adresse du tout.
 */
export function clientAddress(s: SessionLike | null | undefined): string | undefined {
  return (
    trimmed(s?.businessProfile?.legal?.companyAddress) ||
    trimmed(s?.businessProfile?.geo?.address) ||
    undefined
  );
}

/**
 * La forme juridique du client — « SAS », « entreprise individuelle ».
 *
 * Elle complète le nom dans le bloc éditeur des mentions légales : depuis que
 * l'acheteur d'un thème en devient l'éditeur, c'est sa forme qui doit y figurer
 * et non celle d'Aevia.
 */
export function clientLegalForm(s: SessionLike | null | undefined): string | undefined {
  return trimmed(s?.businessProfile?.legal?.legalForm) || undefined;
}

/**
 * Le numéro SIRET du client.
 *
 * Trente-huit pieds de page affichaient un numéro inventé juste après le nom
 * de l'entreprise — « © 2026 Ateliers Vidal & Fils · SIRET 456 789 123 00078 ».
 * Un identifiant faux attribué à une vraie société n'est pas une coquille de
 * démonstration : il figure sur la page que ses clients lisent.
 */
export function clientSiret(s: SessionLike | null | undefined): string | undefined {
  return trimmed(s?.businessProfile?.legal?.siret) || undefined;
}


export interface ClientHour {
  /** « Lundi », « Lun », tel que le thème l'écrit. */
  day: string;
  /** « 9h – 18h », ou « Fermé ». Une seule chaîne : c'est ce que les thèmes rendent. */
  hours: string;
  closed: boolean;
}

/**
 * Les horaires d'ouverture du client.
 *
 * Le wizard les recueille jour par jour depuis l'étape service ; aucun thème ne
 * les lisait. Cinquante-trois d'entre eux affichent pourtant une grille
 * d'horaires écrite en dur — un restaurant fermé le lundi sur le site d'un
 * salon ouvert sept jours sur sept.
 *
 * La forme rendue est celle des thèmes : un libellé de jour et une plage en une
 * seule chaîne, parce que c'est ainsi qu'ils l'écrivent tous.
 */
export function clientHours(s: SessionLike | null | undefined): ClientHour[] | undefined {
  /*
    Deux écritures cohabitent pour les horaires : une liste de
    « { day, open, close } », et un objet « { lundi: "12h-14h" } » — c'est la
    forme la plus naturelle à la saisie comme à l'import. On accepte les deux ;
    l'objet garde son jour, qui est la clé.
  */
  const brut = s?.businessProfile?.openingHours;
  const rows =
    brut && typeof brut === "object" && !Array.isArray(brut)
      ? Object.entries(brut as Record<string, unknown>).map(([day, h]) => ({ day, open: String(h ?? ""), close: "" }))
      : enTableau(brut);
  return keep(
    rows.map((r) => {
      const jour = trimmed(r?.day);
      const ouvre = trimmed(r?.open);
      const ferme = trimmed(r?.close);
      const closed = Boolean(r?.closed) || (!ouvre && !ferme);
      return {
        day: jour,
        hours: closed ? "Fermé" : [ouvre, ferme].filter(Boolean).join(" – "),
        closed,
      };
    }),
    (r) => Boolean(r.day),
  );
}

/** Le téléphone : la fiche d'entreprise d'abord, le formulaire ensuite. */
export function clientPhone(s: SessionLike | null | undefined): string | undefined {
  return (
    trimmed(s?.businessProfile?.contacts?.general?.phone) ||
    trimmed(s?.businessProfile?.contacts?.booking?.phone) ||
    trimmed(s?.formData?.phone) ||
    undefined
  );
}

/** L'adresse e-mail, même ordre. */
export function clientEmail(s: SessionLike | null | undefined): string | undefined {
  return (
    trimmed(s?.businessProfile?.contacts?.general?.email) ||
    trimmed(s?.businessProfile?.contacts?.booking?.email) ||
    trimmed(s?.formData?.email) ||
    undefined
  );
}

/*
  Le compte Instagram du client, sans arobase.

  Le formulaire le demande depuis toujours et le webhook le recopie dans
  `formData.instagram` — mais aucun thème ne savait le lire, faute de lecteur
  dans le contrat. Résultat mesuré sur impact-16/propos : un couvreur d'Annecy
  invitait ses visiteurs à suivre « @obscuraphoto », le compte du photographe
  de la démonstration.

  On accepte ce que les gens tapent réellement : « @nom », « nom »,
  « instagram.com/nom » ou l'URL complète.
*/
export function clientInstagram(s: SessionLike | null | undefined): string | undefined {
  const brut = trimmed(s?.formData?.instagram);
  if (!brut) return undefined;
  const nom = brut
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "")
    .trim();
  return nom || undefined;
}

/** Le site que le client avait déjà, quand il en déclare un. */
export function clientWebsite(s: SessionLike | null | undefined): string | undefined {
  const brut = trimmed(s?.formData?.website);
  if (!brut) return undefined;
  return /^https?:\/\//i.test(brut) ? brut : `https://${brut}`;
}

/** Le lien de réservation, quand le client en a un. */
export function clientBookingUrl(s: SessionLike | null | undefined): string | undefined {
  return trimmed(s?.businessProfile?.bookingSystem?.url) || undefined;
}

/** Les moyens de paiement acceptés. */
export function clientPayments(s: SessionLike | null | undefined): string[] | undefined {
  const rows = enTableau(s?.businessProfile?.paymentMethods);
  return keep(rows.map(trimmed), Boolean);
}

/*
  La session courante, retenue le temps d'un rendu.

  Soixante et un thèmes rangent leurs images et leurs catalogues dans un
  `shared.tsx` importé par la page et ses sous-pages. Ce fichier n'a pas de
  session : il est évalué à l'import, et rien n'y donne accès à ce que le client
  a saisi. Ses images restaient donc celles de la démonstration, quelles que
  soient celles téléversées.

  La page la retient ici au moment où elle la reçoit, et les modules partagés la
  lisent par `clientPhotoAt`. Les thèmes sont des composants clients : un rendu,
  une session, pas de mélange entre deux visiteurs.
*/
let sessionCourante: SessionLike | null = null;

export function memoriserSession(s: SessionLike | null | undefined): void {
  sessionCourante = s ?? null;
}

/** La ville du client, ou celle de la démonstration. Pour les modules partagés. */
export function clientCityOr(repli: string): string {
  return clientCity(sessionCourante) ?? repli;
}

/**
 * La ligne « code postal, ville » — sans jamais mêler les deux sources.
 *
 * Onze thèmes écrivaient le code postal de leur démonstration juste devant la
 * ville du client : un plombier annécien lisait « 75007 Annecy ». Ce n'est pas
 * une maladresse de mise en page, c'est une adresse fausse, et elle a l'air
 * vraie.
 *
 * L'adresse saisie prime ; à défaut, la ville seule, sans code postal emprunté ;
 * et sans rien du client, la ligne du thème mot pour mot.
 */
export function clientCodePostalVille(
  s: SessionLike | null | undefined,
  codeDemo: string,
  villeDemo: string,
): string {
  const adresse = clientAddress(s);
  if (adresse) return adresse;
  const ville = clientCity(s);
  if (ville) return ville;
  return `${codeDemo} ${villeDemo}`;
}

/**
 * L'accroche du client, ou celle de la démonstration.
 *
 * Une dizaine de thèmes animent leur titre lettre par lettre : y injecter la
 * phrase du client la collait en un seul mot — « VOTREPLOMBIERÀANNECY ». Le
 * titre reste donc celui du thème, et l'accroche prend la ligne juste dessous.
 */
export function clientTaglineOr(repli: string): string {
  return clientTagline(sessionCourante) ?? repli;
}

/** Le nom du client, ou celui de la démonstration. Pour les modules partagés. */
export function clientNameOr(repli: string): string {
  return clientName(sessionCourante) ?? repli;
}

/** L'adresse e-mail du client, ou celle de la démonstration. Modules partagés. */
export function clientEmailOr(repli: string): string {
  return clientEmail(sessionCourante) ?? repli;
}

/** La photo du client à cet emplacement, ou celle du thème. */
export function clientPhotoAt(i: number, repli: string): string {
  return clientPhotos(sessionCourante)[i] || repli;
}

/** Les photos du client. Jamais de photo de stock à la place. */
export function clientPhotos(s: SessionLike | null | undefined): string[] {
  const rows = enTableau(s?.formData?.photoUrls);
  return rows.map(trimmed).filter(Boolean);
}
