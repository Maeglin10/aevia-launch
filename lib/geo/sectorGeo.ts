// Per-sector GEO defaults — the part of a site's structured data that is the
// SAME for every business of a given trade, so it can be "pre-loaded" the
// moment a niche is chosen, before the client fills their own details. This is
// what makes a generated site ~90% indexable up front: schema.org keywords and
// a sector FAQ (FAQPage = one of the strongest signals generative engines and
// Google use), which the client's real data then tops up.
//
// French client sites → French keywords/FAQ. `default` fallback keeps unknown
// niches useful. Keep entries concise; this is a base, not the whole page.

export interface SectorGeo {
  /** schema.org keywords (comma-joined into LocalBusiness.keywords). */
  keywords: string[];
  /** Default sector FAQ → FAQPage JSON-LD when the client provides none. */
  faq: { q: string; a: string }[];
}

const G = (keywords: string[], faq: [string, string][]): SectorGeo => ({
  keywords,
  faq: faq.map(([q, a]) => ({ q, a })),
});

export const SECTOR_GEO: Record<string, SectorGeo> = {
  // ── Santé ──
  medecin: G(
    ["médecin", "cabinet médical", "consultation", "prise de rendez-vous", "médecin généraliste", "téléconsultation"],
    [
      ["Comment prendre rendez-vous ?", "Vous pouvez prendre rendez-vous en ligne via le site ou par téléphone au cabinet."],
      ["Le cabinet est-il conventionné ?", "Les conditions de conventionnement et les tarifs sont indiqués sur la page contact et communiqués à l'accueil."],
      ["Proposez-vous la téléconsultation ?", "Selon la disponibilité du praticien, des téléconsultations peuvent être proposées pour certains motifs."],
    ],
  ),
  dentiste: G(
    ["dentiste", "cabinet dentaire", "soins dentaires", "détartrage", "implant dentaire", "urgence dentaire"],
    [
      ["Prenez-vous les urgences dentaires ?", "Les urgences sont prises en charge selon les disponibilités ; contactez le cabinet dès que possible."],
      ["Faut-il une ordonnance pour un détartrage ?", "Non, un détartrage se prend directement en rendez-vous sans ordonnance."],
      ["Les soins sont-ils remboursés ?", "La plupart des soins courants sont pris en charge par l'Assurance Maladie et votre mutuelle selon votre contrat."],
    ],
  ),
  kine: G(
    ["kinésithérapeute", "rééducation", "kiné", "séance de kinésithérapie", "masso-kinésithérapie"],
    [
      ["Faut-il une ordonnance ?", "Une prescription médicale est généralement nécessaire pour la prise en charge des séances."],
      ["Combien de temps dure une séance ?", "Une séance dure en moyenne 30 minutes selon le traitement."],
      ["Les séances sont-elles remboursées ?", "Les séances prescrites sont prises en charge par l'Assurance Maladie et votre mutuelle."],
    ],
  ),
  osteo: G(
    ["ostéopathe", "ostéopathie", "douleurs dorsales", "séance d'ostéopathie", "ostéopathe périnatal", "ostéopathe pédiatrique"],
    [
      ["L'ostéopathie est-elle remboursée ?", "L'ostéopathie n'est pas remboursée par l'Assurance Maladie mais de nombreuses mutuelles la prennent en charge."],
      ["Faut-il une ordonnance ?", "Non, l'ostéopathe est en accès direct, sans ordonnance."],
      ["Recevez-vous les nourrissons et femmes enceintes ?", "Oui, des consultations adaptées aux nourrissons, enfants et femmes enceintes sont proposées."],
    ],
  ),
  veterinaire: G(
    ["vétérinaire", "clinique vétérinaire", "soins animaux", "vaccination", "urgence vétérinaire", "stérilisation"],
    [
      ["Gérez-vous les urgences ?", "Les urgences vétérinaires sont prises en charge selon les disponibilités de la clinique."],
      ["Faut-il vacciner mon animal ?", "La vaccination est recommandée et parfois obligatoire ; le vétérinaire établit le protocole adapté."],
      ["Puis-je prendre rendez-vous en ligne ?", "Oui, la prise de rendez-vous est possible en ligne ou par téléphone."],
    ],
  ),
  // ── Services & artisanat (à domicile) ──
  plombier: G(
    ["plombier", "dépannage plomberie", "fuite d'eau", "installation sanitaire", "chauffe-eau", "plombier urgence"],
    [
      ["Intervenez-vous en urgence ?", "Oui, des interventions d'urgence sont proposées pour les fuites et dégâts des eaux."],
      ["Le devis est-il gratuit ?", "Un devis gratuit et sans engagement est établi avant toute intervention."],
      ["Quelles zones desservez-vous ?", "La zone d'intervention est indiquée sur la page contact ; contactez-nous pour vérifier votre secteur."],
    ],
  ),
  electricien: G(
    ["électricien", "installation électrique", "mise aux normes", "dépannage électrique", "tableau électrique", "domotique"],
    [
      ["Réalisez-vous les mises aux normes ?", "Oui, mises aux normes NF C 15-100, rénovation et installation de tableaux électriques."],
      ["Intervenez-vous en urgence ?", "Des dépannages électriques d'urgence sont assurés selon les disponibilités."],
      ["Fournissez-vous un devis ?", "Un devis détaillé et gratuit est fourni avant travaux."],
    ],
  ),
  paysagiste: G(
    ["paysagiste", "création de jardin", "entretien espaces verts", "élagage", "aménagement extérieur", "terrasse"],
    [
      ["Proposez-vous l'entretien annuel ?", "Oui, des contrats d'entretien régulier de jardins et espaces verts sont proposés."],
      ["Le devis est-il gratuit ?", "Un devis gratuit est établi après visite du terrain."],
      ["Réalisez-vous l'aménagement complet ?", "Conception, plantation, terrasses et clôtures : l'aménagement extérieur complet est assuré."],
    ],
  ),
  pisciniste: G(
    ["pisciniste", "construction piscine", "entretien piscine", "rénovation piscine", "local technique", "piscine sur mesure"],
    [
      ["Construisez-vous des piscines sur mesure ?", "Oui, conception et construction de piscines sur mesure, enterrées ou semi-enterrées."],
      ["Assurez-vous l'entretien ?", "Des contrats d'entretien et d'hivernage sont proposés."],
      ["Le devis est-il gratuit ?", "Un devis personnalisé et gratuit est établi après étude du projet."],
    ],
  ),
  menage: G(
    ["ménage", "nettoyage", "entreprise de nettoyage", "ménage à domicile", "nettoyage bureaux", "aide-ménagère"],
    [
      ["Intervenez-vous chez les particuliers et professionnels ?", "Oui, prestations de nettoyage pour particuliers, bureaux et locaux professionnels."],
      ["Les produits sont-ils fournis ?", "Le matériel et les produits peuvent être fournis selon la formule choisie."],
      ["Proposez-vous un devis gratuit ?", "Oui, un devis gratuit et adapté à vos besoins est établi."],
    ],
  ),
  garage_auto: G(
    ["garage automobile", "réparation auto", "entretien véhicule", "révision", "diagnostic", "pneus", "vidange"],
    [
      ["Faites-vous l'entretien toutes marques ?", "Oui, entretien et réparation toutes marques, révision, freinage, pneumatiques."],
      ["Établissez-vous un devis avant réparation ?", "Un devis est systématiquement établi et validé avant toute réparation."],
      ["Proposez-vous un véhicule de prêt ?", "Selon disponibilité, un véhicule de courtoisie peut être proposé."],
    ],
  ),
  btp_construction: G(
    ["BTP", "construction", "gros œuvre", "rénovation", "maçonnerie", "extension maison", "entreprise bâtiment"],
    [
      ["Réalisez-vous la rénovation complète ?", "Oui, du gros œuvre à la rénovation complète et l'extension de bâtiments."],
      ["Êtes-vous assuré en décennale ?", "Les travaux sont couverts par les garanties légales, dont la garantie décennale lorsqu'elle s'applique."],
      ["Le devis est-il gratuit ?", "Un devis détaillé et gratuit est établi après étude du projet."],
    ],
  ),
  // ── Droit & finance ──
  avocat: G(
    ["avocat", "cabinet d'avocats", "conseil juridique", "droit du travail", "droit de la famille", "contentieux"],
    [
      ["Proposez-vous une première consultation ?", "Une première consultation permet d'évaluer votre situation ; ses modalités sont indiquées au contact."],
      ["Dans quels domaines intervenez-vous ?", "Les domaines de compétence du cabinet sont détaillés sur la page des prestations."],
      ["Comment sont fixés les honoraires ?", "Les honoraires font l'objet d'une convention transparente établie en amont."],
    ],
  ),
  comptable: G(
    ["expert-comptable", "comptabilité", "bilan comptable", "déclaration fiscale", "gestion de paie", "création d'entreprise"],
    [
      ["Accompagnez-vous la création d'entreprise ?", "Oui, de la création au suivi comptable et fiscal de votre activité."],
      ["Gérez-vous la paie ?", "La gestion de la paie et des déclarations sociales fait partie des prestations proposées."],
      ["Travaillez-vous à distance ?", "Un suivi dématérialisé et à distance est possible partout en France."],
    ],
  ),
  // ── Restauration ──
  restaurant: G(
    ["restaurant", "réservation table", "menu", "cuisine maison", "restaurant midi", "carte", "produits frais"],
    [
      ["Faut-il réserver ?", "La réservation est conseillée, en ligne ou par téléphone, notamment le week-end."],
      ["Proposez-vous des options végétariennes ?", "La carte propose des options adaptées ; les allergènes sont disponibles sur demande."],
      ["Peut-on privatiser la salle ?", "La privatisation pour événements est possible ; contactez-nous pour les disponibilités."],
    ],
  ),
  restauration_rapide: G(
    ["fast-food", "snack", "burger", "à emporter", "livraison", "menu rapide", "restauration rapide"],
    [
      ["Proposez-vous la vente à emporter et la livraison ?", "Oui, commande sur place, à emporter et en livraison selon les zones desservies."],
      ["Où voir les allergènes ?", "Les informations allergènes sont disponibles sur demande et en caisse."],
      ["Quels sont les horaires ?", "Les horaires d'ouverture sont indiqués sur la page contact du site."],
    ],
  ),
  boulangerie: G(
    ["boulangerie", "pâtisserie", "pain artisanal", "viennoiserie", "baguette tradition", "pain au levain"],
    [
      ["Vos produits sont-ils faits maison ?", "Oui, pains et pâtisseries sont préparés sur place de façon artisanale."],
      ["Peut-on commander pour un événement ?", "Les commandes de pièces et gâteaux pour événements sont possibles sur demande."],
      ["Proposez-vous des produits sans gluten ?", "La disponibilité de produits spécifiques est indiquée en boutique ; renseignez-vous auprès de l'équipe."],
    ],
  ),
  cafe_bar: G(
    ["café", "bar à vin", "brunch", "cocktails", "terrasse", "petit-déjeuner", "afterwork"],
    [
      ["Proposez-vous une terrasse ?", "Selon l'établissement, une terrasse est disponible ; voir la page contact."],
      ["Peut-on privatiser le lieu ?", "La privatisation pour afterworks et événements est possible sur réservation."],
      ["Servez-vous à manger ?", "Une offre de petite restauration accompagne les boissons selon la carte du jour."],
    ],
  ),
  // ── Sport & coaching ──
  coach: G(
    ["coach sportif", "coaching personnel", "remise en forme", "perte de poids", "préparation physique", "coach à domicile"],
    [
      ["Proposez-vous des séances à domicile ?", "Oui, des séances à domicile ou en extérieur sont possibles selon la formule."],
      ["Établissez-vous un programme personnalisé ?", "Chaque suivi débute par un bilan et un programme adapté à vos objectifs."],
      ["Proposez-vous un suivi nutritionnel ?", "Des conseils en hygiène de vie et nutrition accompagnent le coaching."],
    ],
  ),
  salle_sport: G(
    ["salle de sport", "fitness", "musculation", "cours collectifs", "abonnement", "coach", "cardio"],
    [
      ["Quels abonnements proposez-vous ?", "Différentes formules d'abonnement sont proposées ; les détails figurent sur la page tarifs."],
      ["Y a-t-il des cours collectifs ?", "Oui, un planning de cours collectifs est disponible pour les adhérents."],
      ["Un coach est-il présent ?", "Des coachs sont disponibles pour l'accompagnement et les programmes personnalisés."],
    ],
  ),
  // ── Art & création ──
  tatoueur: G(
    ["tatoueur", "salon de tatouage", "tatouage", "flash tattoo", "projet personnalisé", "hygiène tatouage"],
    [
      ["Comment se passe un premier rendez-vous ?", "Un rendez-vous projet permet d'échanger sur votre idée et d'établir un devis."],
      ["Respectez-vous les normes d'hygiène ?", "Le salon respecte strictement les normes d'hygiène et de stérilisation en vigueur."],
      ["Faut-il un acompte ?", "Un acompte est généralement demandé pour réserver la séance."],
    ],
  ),
  couture: G(
    ["couture", "retouches", "sur-mesure", "atelier de couture", "création textile", "ajustement vêtement"],
    [
      ["Faites-vous les retouches ?", "Oui, retouches et ajustements de tous vêtements sont réalisés à l'atelier."],
      ["Réalisez-vous du sur-mesure ?", "Des créations et pièces sur mesure sont proposées sur devis."],
      ["Quels sont les délais ?", "Les délais dépendent de la prestation et sont communiqués lors du dépôt."],
    ],
  ),
  photographe: G(
    ["photographe", "shooting photo", "photographe mariage", "portrait", "reportage", "book photo", "photographe professionnel"],
    [
      ["Quels types de séances proposez-vous ?", "Portraits, mariages, événements et reportages ; voir la page prestations."],
      ["Les photos retouchées sont-elles incluses ?", "Un nombre de photos retouchées en haute définition est inclus selon la formule."],
      ["Faut-il verser un acompte ?", "Un acompte réserve la date ; le solde est réglé à la livraison."],
    ],
  ),
  fleuriste: G(
    ["fleuriste", "bouquet", "livraison de fleurs", "composition florale", "fleurs mariage", "plantes"],
    [
      ["Livrez-vous les fleurs ?", "Oui, livraison de bouquets et compositions dans les zones desservies."],
      ["Réalisez-vous les fleurs de mariage ?", "Décoration florale de mariages et événements sur devis."],
      ["Peut-on commander en ligne ?", "Les commandes sont possibles en ligne ou en boutique."],
    ],
  ),
  bijouterie: G(
    ["bijouterie", "horlogerie", "bijoux", "réparation montre", "alliance", "création sur mesure", "or"],
    [
      ["Réparez-vous les montres et bijoux ?", "Oui, réparation de montres, bijoux et remise à taille d'alliances."],
      ["Créez-vous des bijoux sur mesure ?", "Des créations et gravures sur mesure sont proposées."],
      ["Proposez-vous une garantie ?", "Les bijoux et montres bénéficient des garanties légales applicables."],
    ],
  ),
  studio_creatif: G(
    ["studio créatif", "production audiovisuelle", "vidéo", "motion design", "identité visuelle", "communication"],
    [
      ["Quelles prestations proposez-vous ?", "Vidéo, motion design, identité visuelle et communication ; voir le portfolio."],
      ["Travaillez-vous sur devis ?", "Chaque projet fait l'objet d'un devis personnalisé selon le cahier des charges."],
      ["Cédez-vous les droits d'exploitation ?", "Les droits sont cédés selon les usages et supports définis au contrat."],
    ],
  ),
  boutique_mode: G(
    ["boutique de mode", "prêt-à-porter", "vêtements", "accessoires", "boutique en ligne", "nouvelle collection"],
    [
      ["Livrez-vous les commandes ?", "Oui, livraison à domicile ; les délais et frais sont indiqués au paiement."],
      ["Puis-je retourner un article ?", "Vous disposez d'un droit de rétractation de 14 jours conformément à la loi."],
      ["Proposez-vous le retrait en boutique ?", "Le retrait en boutique peut être proposé selon disponibilité."],
    ],
  ),
  mariage: G(
    ["wedding planner", "organisation mariage", "décoration mariage", "coordination jour J", "planificateur d'événements"],
    [
      ["Que comprend l'organisation ?", "De la conception à la coordination du jour J : prestataires, décoration, planning."],
      ["Proposez-vous une formule partielle ?", "Des formules partielles (coordination jour J, conseil) sont proposées sur devis."],
      ["Comment réserver une date ?", "La date est réservée après signature du devis et versement d'un acompte."],
    ],
  ),
  coiffeur: G(
    ["coiffeur", "salon de coiffure", "barbier", "coupe", "coloration", "balayage", "coiffure mariage"],
    [
      ["Faut-il prendre rendez-vous ?", "La prise de rendez-vous est conseillée, en ligne ou par téléphone."],
      ["Proposez-vous des coiffures d'événement ?", "Coiffures de mariage et d'événement sont proposées sur rendez-vous."],
      ["Quels sont vos tarifs ?", "Les tarifs par prestation sont indiqués sur la page dédiée du site."],
    ],
  ),
  institut_beaute: G(
    ["institut de beauté", "spa", "soin du visage", "épilation", "massage", "manucure", "onglerie"],
    [
      ["Comment réserver un soin ?", "Réservation en ligne ou par téléphone ; un acompte peut être demandé."],
      ["Proposez-vous des forfaits ?", "Des forfaits et cartes cadeaux sont disponibles ; voir la page tarifs."],
      ["Quelles prestations proposez-vous ?", "Soins du visage et du corps, épilation, manucure et massages selon la carte."],
    ],
  ),
  // ── Immobilier ──
  agent_immobilier: G(
    ["agence immobilière", "achat immobilier", "vente maison", "estimation gratuite", "location", "appartement"],
    [
      ["Proposez-vous une estimation gratuite ?", "Oui, une estimation gratuite de votre bien est réalisée sur rendez-vous."],
      ["Comment sont fixés les honoraires ?", "Le barème des honoraires est affiché et précisé au mandat."],
      ["Gérez-vous la location ?", "L'agence accompagne la vente, l'achat et la location, ainsi que la gestion locative."],
    ],
  ),
  architecte: G(
    ["architecte", "maîtrise d'œuvre", "permis de construire", "rénovation", "extension", "plans", "conception"],
    [
      ["Réalisez-vous les permis de construire ?", "Oui, conception, dépôt de permis et suivi de chantier sont assurés."],
      ["Accompagnez-vous la rénovation ?", "Rénovation, extension et construction neuve font partie des missions proposées."],
      ["Comment se déroule un projet ?", "Le projet suit les phases habituelles : esquisse, conception, permis, chantier."],
    ],
  ),
  // ── Hôtellerie ──
  hotel: G(
    ["hôtel", "réservation chambre", "hébergement", "chambre d'hôtes", "séjour", "petit-déjeuner", "wifi gratuit"],
    [
      ["Comment réserver une chambre ?", "La réservation se fait en ligne ou par téléphone ; des arrhes peuvent être demandées."],
      ["Le petit-déjeuner est-il inclus ?", "Selon la formule choisie ; les détails figurent lors de la réservation."],
      ["Quelles sont les conditions d'annulation ?", "Les conditions d'annulation sont précisées au moment de la réservation."],
    ],
  ),
};

/** GEO defaults for a niche, with a safe generic fallback. */
export function sectorGeoFor(niche?: string): SectorGeo {
  const key = (niche || "").trim().toLowerCase();
  return (
    SECTOR_GEO[key] ?? {
      keywords: [],
      faq: [
        ["Comment vous contacter ?", "Retrouvez toutes nos coordonnées et horaires sur la page contact du site."],
        ["Proposez-vous un devis ?", "Contactez-nous pour un devis ou un rendez-vous adapté à votre besoin."],
      ].map(([q, a]) => ({ q, a })),
    }
  );
}
