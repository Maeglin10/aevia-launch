// Sector-aware CGV (Conditions Générales de Vente).
//
// The legally meaningful thing that changes between a restaurant and an online
// shop is NOT the trade — it is the *regime of the transaction*: right of
// withdrawal (rétractation), deposit (acompte/arrhes) and delivery. So instead
// of one CGV per métier, we group the ~34 wizard niches (lib/templates/sectors.ts)
// into 8 legal archetypes by that regime, plus a generic fallback.
//
// These are CLIENT sites selling to consumers (B2C), so — unlike Aevia's own
// B2B product CGV — every archetype carries the mandatory "médiateur de la
// consommation" mention (art. L.612-1 Code de la consommation).
//
// Boilerplate templates with the business's fields substituted in; a client
// should still have them reviewed for their exact activity.

export type LegalArchetype =
  | "service_rdv" // appointment-based personal services (exempt from withdrawal)
  | "food" // on-site / takeaway catering (exempt)
  | "produits" // physical goods e-commerce (14-day withdrawal + delivery)
  | "domicile" // at-home trades / works on quote (deposit, works-withdrawal)
  | "expertise_b2b" // intellectual / regulated services on quote
  | "portfolio_projets" // creative made-to-order (author rights, exempt)
  | "immobilier" // real-estate agency (loi Hoguet)
  | "hotellerie" // accommodation (arrhes, exempt)
  | "default"; // generic services fallback

/** Complete niche → legal archetype map (covers every id in sectors.ts). */
export const NICHE_LEGAL_ARCHETYPE: Record<string, LegalArchetype> = {
  // Health & appointment-based personal services
  medecin: "service_rdv",
  dentiste: "service_rdv",
  kine: "service_rdv",
  osteo: "service_rdv",
  veterinaire: "service_rdv",
  coiffeur: "service_rdv",
  institut_beaute: "service_rdv",
  tatoueur: "service_rdv",
  coach: "service_rdv",
  salle_sport: "service_rdv",
  // At-home trades / works on quote
  plombier: "domicile",
  electricien: "domicile",
  paysagiste: "domicile",
  pisciniste: "domicile",
  menage: "domicile",
  garage_auto: "domicile",
  btp_construction: "domicile",
  // Regulated / intellectual services on quote
  avocat: "expertise_b2b",
  comptable: "expertise_b2b",
  architecte: "expertise_b2b",
  mariage: "expertise_b2b",
  // Catering
  restaurant: "food",
  restauration_rapide: "food",
  boulangerie: "food",
  cafe_bar: "food",
  // Physical goods e-commerce
  boutique_mode: "produits",
  bijouterie: "produits",
  fleuriste: "produits",
  // Creative made-to-order (author rights)
  photographe: "portfolio_projets",
  studio_creatif: "portfolio_projets",
  couture: "portfolio_projets",
  // Specific regimes
  agent_immobilier: "immobilier",
  hotel: "hotellerie",
};

export function legalArchetypeForNiche(
  niche?: string,
  businessType?: string,
): LegalArchetype {
  const key = (niche || businessType || "").trim().toLowerCase();
  return NICHE_LEGAL_ARCHETYPE[key] ?? "default";
}

// ─── Shared clause fragments ─────────────────────────────────────────────────

const h = (n: number, t: string) => `<h2>${n}. ${t}</h2>`;

function mediateur(businessName: string): string {
  return `
    <p>Conformément aux articles L.612-1 et suivants du Code de la consommation, le client
    consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue
    de la résolution amiable d'un litige qui l'opposerait à ${businessName}, après avoir tenté
    au préalable de résoudre le litige directement auprès de ${businessName} par une réclamation
    écrite. Les coordonnées du médiateur compétent sont communiquées sur demande et figureront
    sur les documents contractuels le cas échéant. Le client peut également recourir à la
    plateforme européenne de règlement en ligne des litiges (<a href="https://ec.europa.eu/consumers/odr">ec.europa.eu/consumers/odr</a>).</p>`;
}

const droitApplicable = `
  <p>Les présentes conditions générales de vente sont soumises au droit français. À défaut de
  résolution amiable, tout litige relève de la compétence des tribunaux français compétents.</p>`;

const prixPaiement = `
  <p>Les prix sont indiqués en euros, toutes taxes comprises le cas échéant (la TVA n'est pas
  applicable lorsque le professionnel relève de la franchise en base, art. 293 B du CGI). Le
  paiement s'effectue selon les modalités précisées lors de la commande, de la prise de rendez-vous
  ou du devis. Une facture est remise pour toute prestation.</p>`;

// ─── Per-archetype CGV bodies ────────────────────────────────────────────────
// `identity` is the shared "Identification du vendeur" block (built once in
// generateLegalPages). `name` = business name.

type Ctx = { name: string; identity: string };

function serviceRdv({ name, identity }: Ctx): string {
  return `
    ${h(1, "Identification du prestataire")}${identity}
    ${h(2, "Prestations")}
    <p>${name} propose des prestations de service sur rendez-vous décrites sur le présent site.
    Les prestations à caractère de soin ou de bien-être ne constituent pas un acte médical sauf
    mention expresse et n'engagent aucune obligation de résultat.</p>
    ${h(3, "Prix et paiement")}${prixPaiement}
    ${h(4, "Rendez-vous, acompte et annulation")}
    <p>La prise de rendez-vous peut être subordonnée au versement d'un acompte ou d'arrhes. Toute
    annulation doit être signalée dans un délai raisonnable ; en cas d'annulation tardive ou de
    non-présentation, l'acompte peut rester acquis au prestataire à titre de dédommagement.</p>
    ${h(5, "Droit de rétractation")}
    <p>Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne
    s'applique pas aux prestations de services pleinement exécutées avant la fin du délai, ni aux
    prestations de services fournies à une date ou selon une périodicité déterminée (rendez-vous).</p>
    ${h(6, "Responsabilité")}
    <p>${name} exécute ses prestations avec soin et diligence. Sa responsabilité ne saurait être
    engagée au-delà du montant de la prestation concernée, ni en cas de non-respect par le client
    des consignes ou contre-indications communiquées.</p>
    ${h(7, "Médiation de la consommation")}${mediateur(name)}
    ${h(8, "Droit applicable")}${droitApplicable}`;
}

function food({ name, identity }: Ctx): string {
  return `
    ${h(1, "Identification de l'établissement")}${identity}
    ${h(2, "Prestations")}
    <p>${name} propose la vente de produits de restauration sur place, à emporter ou en livraison.
    Les photographies et descriptions des produits sont non contractuelles.</p>
    ${h(3, "Allergènes et hygiène")}
    <p>Les informations relatives aux allergènes (règlement UE n°1169/2011) sont disponibles sur
    demande. Il appartient au client de signaler toute allergie ou intolérance avant la commande.
    ${name} respecte les normes d'hygiène applicables (paquet hygiène, HACCP).</p>
    ${h(4, "Prix et paiement")}${prixPaiement}
    ${h(5, "Réservation et annulation")}
    <p>Une réservation de table peut être demandée. En cas de forte affluence ou de non-présentation
    répétée, ${name} se réserve le droit de demander une empreinte bancaire ou un acompte, restant
    acquis en cas d'annulation tardive.</p>
    ${h(6, "Droit de rétractation")}
    <p>Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne
    s'applique pas à la fourniture de denrées alimentaires susceptibles de se périmer rapidement,
    ni aux prestations de restauration fournies à une date déterminée.</p>
    ${h(7, "Médiation de la consommation")}${mediateur(name)}
    ${h(8, "Droit applicable")}${droitApplicable}`;
}

function produits({ name, identity }: Ctx): string {
  return `
    ${h(1, "Identification du vendeur")}${identity}
    ${h(2, "Produits")}
    <p>${name} propose à la vente les produits présentés sur le présent site. Les caractéristiques
    essentielles et les prix figurent sur chaque fiche produit. Les photographies sont non
    contractuelles.</p>
    ${h(3, "Prix et paiement")}${prixPaiement}
    ${h(4, "Livraison")}
    <p>Les produits sont livrés à l'adresse indiquée par le client, dans les délais annoncés lors de
    la commande. Les risques sont transférés au client à la remise du bien. En cas de retard, le
    client peut solliciter la résolution de la vente dans les conditions légales.</p>
    ${h(5, "Droit de rétractation")}
    <p>Conformément aux articles L.221-18 et suivants du Code de la consommation, le client
    consommateur dispose d'un <strong>délai de quatorze (14) jours</strong> à compter de la réception
    du bien pour exercer son droit de rétractation, sans avoir à motiver sa décision. Les frais de
    retour sont à la charge du client sauf mention contraire. Sont exclus les biens confectionnés sur
    mesure, personnalisés, périssables, ou descellés ne pouvant être renvoyés pour des raisons
    d'hygiène.</p>
    ${h(6, "Garanties légales")}
    <p>Le client bénéficie de la garantie légale de conformité (art. L.217-3 et s. du Code de la
    consommation) et de la garantie des vices cachés (art. 1641 et s. du Code civil).</p>
    ${h(7, "Médiation de la consommation")}${mediateur(name)}
    ${h(8, "Droit applicable")}${droitApplicable}`;
}

function domicile({ name, identity }: Ctx): string {
  return `
    ${h(1, "Identification du prestataire")}${identity}
    ${h(2, "Prestations et devis")}
    <p>${name} réalise des prestations et travaux décrits au devis. Tout devis accepté et signé par
    le client vaut commande. Le devis précise la nature des travaux, les délais et le prix.</p>
    ${h(3, "Prix, acompte et paiement")}
    <p>Un acompte peut être demandé à la commande, le solde étant exigible à l'achevement des
    travaux. ${prixPaiement.trim().replace(/^<p>|<\/p>$/g, "")}</p>
    ${h(4, "Droit de rétractation")}
    <p>Pour les contrats conclus hors établissement, le client consommateur dispose d'un délai de
    quatorze (14) jours pour se rétracter (art. L.221-18 du Code de la consommation). Le client peut
    demander l'exécution des travaux avant la fin de ce délai ; en cas de rétractation après un tel
    commencement d'exécution à sa demande expresse, il règle le montant correspondant aux prestations
    déjà fournies. Le droit de rétractation ne s'applique pas aux travaux d'entretien ou de réparation
    urgents sollicités par le client à son domicile.</p>
    ${h(5, "Garanties")}
    <p>Selon la nature des travaux, ${name} est tenu des garanties légales applicables (garantie de
    parfait achèvement, garantie biennale, garantie décennale et assurance correspondante lorsque
    celles-ci sont obligatoires).</p>
    ${h(6, "Responsabilité")}
    <p>${name} exécute les travaux dans les règles de l'art. Sa responsabilité ne saurait être engagée
    en cas de mauvaise utilisation ou de modification par le client des ouvrages réalisés.</p>
    ${h(7, "Médiation de la consommation")}${mediateur(name)}
    ${h(8, "Droit applicable")}${droitApplicable}`;
}

function expertiseB2b({ name, identity }: Ctx): string {
  return `
    ${h(1, "Identification du prestataire")}${identity}
    ${h(2, "Prestations sur devis")}
    <p>${name} fournit des prestations intellectuelles décrites au devis ou à la lettre de mission.
    Lorsque l'activité est réglementée, elle est exercée dans le respect des règles déontologiques et,
    le cas échéant, de l'ordre professionnel dont relève le prestataire.</p>
    ${h(3, "Prix, acompte et paiement")}
    <p>Les honoraires sont fixés au devis ou à la lettre de mission. Un acompte peut être demandé à
    la commande. ${prixPaiement.trim().replace(/^<p>|<\/p>$/g, "")}</p>
    ${h(4, "Droit de rétractation")}
    <p>Le client consommateur bénéficie du délai de rétractation de quatorze (14) jours pour les
    contrats conclus à distance ou hors établissement (art. L.221-18 du Code de la consommation), sauf
    renonciation expresse en cas d'exécution immédiate à sa demande. Ce droit ne s'applique pas aux
    relations entre professionnels.</p>
    ${h(5, "Propriété intellectuelle")}
    <p>Sauf stipulation contraire au devis, les livrables et méthodes restent la propriété de ${name}
    jusqu'au paiement intégral. Les droits d'exploitation sont cédés au client dans les limites
    prévues au contrat.</p>
    ${h(6, "Responsabilité et confidentialité")}
    <p>${name} est tenu d'une obligation de moyens et d'une obligation de confidentialité sur les
    informations transmises. Sa responsabilité est plafonnée au montant des honoraires perçus au titre
    de la mission concernée.</p>
    ${h(7, "Médiation de la consommation")}${mediateur(name)}
    ${h(8, "Droit applicable")}${droitApplicable}`;
}

function portfolioProjets({ name, identity }: Ctx): string {
  return `
    ${h(1, "Identification du prestataire")}${identity}
    ${h(2, "Prestations de création")}
    <p>${name} réalise des créations et prestations sur commande (prise de vue, création graphique ou
    audiovisuelle, pièces sur mesure) décrites au devis accepté par le client.</p>
    ${h(3, "Prix, acompte et paiement")}
    <p>Un acompte est généralement demandé à la commande, le solde étant exigible à la livraison. ${prixPaiement.trim().replace(/^<p>|<\/p>$/g, "")}</p>
    ${h(4, "Droit de rétractation")}
    <p>Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne
    s'applique pas aux biens confectionnés selon les spécifications du client ou nettement
    personnalisés, ni aux prestations pleinement exécutées avant la fin du délai avec l'accord du
    client.</p>
    ${h(5, "Droits d'auteur et cession")}
    <p>Les œuvres réalisées sont protégées par le droit d'auteur. Sauf cession expresse au devis,
    ${name} conserve ses droits patrimoniaux et moraux ; la cession des droits d'exploitation au client
    est limitée aux usages, supports et durée expressément convenus, et prend effet au paiement
    intégral.</p>
    ${h(6, "Responsabilité")}
    <p>${name} s'engage à réaliser la prestation avec soin. Sa responsabilité est plafonnée au montant
    de la commande concernée.</p>
    ${h(7, "Médiation de la consommation")}${mediateur(name)}
    ${h(8, "Droit applicable")}${droitApplicable}`;
}

function immobilier({ name, identity }: Ctx): string {
  return `
    ${h(1, "Identification de l'agence")}${identity}
    ${h(2, "Activité et cadre légal")}
    <p>${name} exerce une activité d'entremise et de gestion immobilières régie par la loi n°70-9 du
    2 janvier 1970 (loi Hoguet) et son décret d'application. L'agence est titulaire d'une carte
    professionnelle et, le cas échéant, d'une garantie financière, dont les références sont
    communiquées sur demande.</p>
    ${h(3, "Mandats et honoraires")}
    <p>Toute mission fait l'objet d'un mandat écrit (de vente, de recherche ou de gestion). Le barème
    des honoraires est affiché et disponible sur demande ; la partie qui en a la charge est précisée
    au mandat et à l'annonce.</p>
    ${h(4, "Droit de rétractation")}
    <p>Pour les mandats conclus à distance ou hors établissement avec un consommateur, un délai de
    rétractation de quatorze (14) jours s'applique (art. L.221-18 du Code de la consommation).</p>
    ${h(5, "Responsabilité")}
    <p>${name} est tenu d'un devoir de conseil et d'information. Sa responsabilité s'apprécie dans les
    limites de sa mission telle que définie au mandat.</p>
    ${h(6, "Médiation de la consommation")}${mediateur(name)}
    ${h(7, "Droit applicable")}${droitApplicable}`;
}

function hotellerie({ name, identity }: Ctx): string {
  return `
    ${h(1, "Identification de l'établissement")}${identity}
    ${h(2, "Prestations")}
    <p>${name} propose des prestations d'hébergement et services associés. Les tarifs, conditions et
    équipements sont précisés au moment de la réservation.</p>
    ${h(3, "Réservation, arrhes et annulation")}
    <p>La réservation peut être garantie par le versement d'arrhes ou une empreinte bancaire. Les
    conditions d'annulation et les éventuelles pénalités sont indiquées lors de la réservation ; sauf
    tarif non remboursable, une annulation dans les délais convenus donne lieu à restitution des arrhes
    dans les conditions prévues.</p>
    ${h(4, "Prix et paiement")}${prixPaiement}
    ${h(5, "Droit de rétractation")}
    <p>Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne
    s'applique pas aux prestations d'hébergement, de transport, de restauration et de loisirs fournies
    à une date ou selon une périodicité déterminée.</p>
    ${h(6, "Responsabilité")}
    <p>${name} met tout en œuvre pour assurer la qualité de ses prestations. Sa responsabilité est
    encadrée par la réglementation applicable à l'hébergement.</p>
    ${h(7, "Médiation de la consommation")}${mediateur(name)}
    ${h(8, "Droit applicable")}${droitApplicable}`;
}

function generic({ name, identity }: Ctx): string {
  return `
    ${h(1, "Identification du vendeur")}${identity}
    ${h(2, "Prestations et produits")}
    <p>${name} propose à la vente les prestations et produits décrits sur le présent site. Les
    descriptions et prix affichés font foi au moment de la commande.</p>
    ${h(3, "Prix et paiement")}${prixPaiement}
    ${h(4, "Droit de rétractation")}
    <p>Lorsqu'il est applicable, le droit de rétractation s'exerce dans un délai de quatorze (14) jours
    dans les conditions des articles L.221-18 et suivants du Code de la consommation. Certaines
    prestations en sont exclues (services pleinement exécutés, biens personnalisés ou périssables,
    prestations fournies à une date déterminée — art. L.221-28).</p>
    ${h(5, "Responsabilité")}
    <p>${name} exécute ses prestations avec soin et diligence, sans garantie de résultat au-delà de ce
    qui est explicitement décrit. Sa responsabilité est plafonnée au montant de la commande concernée.</p>
    ${h(6, "Médiation de la consommation")}${mediateur(name)}
    ${h(7, "Droit applicable")}${droitApplicable}`;
}

const BUILDERS: Record<LegalArchetype, (ctx: Ctx) => string> = {
  service_rdv: serviceRdv,
  food,
  produits,
  domicile,
  expertise_b2b: expertiseB2b,
  portfolio_projets: portfolioProjets,
  immobilier,
  hotellerie,
  default: generic,
};

/** Build the sector-specific CGV body for a business. */
export function cgvForArchetype(archetype: LegalArchetype, ctx: Ctx): string {
  return (BUILDERS[archetype] ?? generic)(ctx).trim();
}
