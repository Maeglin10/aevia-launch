// Le vocabulaire de chaque métier, pour chaque bloc que le thème sait afficher.
//
// Un couvreur ne parle pas de « prestations » comme un notaire, et ses
// garanties ne sont pas les mêmes : décennale et Qualibat d'un côté, Chambre
// des notaires de l'autre. Un formulaire qui demande « Nom de la prestation »
// à un restaurateur ou « Garantie décennale » à un pharmacien se fait remplir
// n'importe comment — ou pas du tout.
//
// Cette table n'ajoute aucun champ : elle habille ceux de ThemeBlocks avec les
// mots du métier. Ce qui reste absent retombe sur le libellé générique, qui est
// correct mais neutre.

import type { ContentBlock } from "@/lib/templates/capabilities";

export interface BlockCopy {
  /** Titre de la section dans le wizard. */
  label?: string;
  /** Phrase d'aide sous le titre. */
  hint?: string;
  /** Exemples dans les champs, séparés par rôle. */
  ph?: Record<string, string>;
}

export type TradeLexicon = Partial<Record<ContentBlock, BlockCopy>>;

/** Libellés par défaut, employés quand le métier n'a pas d'entrée dédiée. */
export const DEFAULT_LEXICON: Required<Pick<TradeLexicon, "prestations" | "avis" | "engagements" | "chiffres" | "faq" | "equipe" | "zones">> = {
  prestations: {
    label: "Vos prestations et leurs tarifs",
    hint: "Ce que vous vendez, tel que vous le diriez à un client. Le tarif peut être un montant, une fourchette ou « sur devis ».",
    ph: { name: "Nom de la prestation", price: "Tarif", desc: "Description courte (optionnel)" },
  },
  avis: {
    label: "Vos avis clients",
    hint: "Des avis réels, tels qu'ils vous ont été laissés. Ils passent devant tout texte généré.",
    ph: { text: "Ce que le client a écrit", author: "Prénom, nom", source: "Ville ou plateforme" },
  },
  engagements: {
    label: "Vos garanties et certifications",
    hint: "Ce que vous pouvez prouver : assurance, label, agrément.",
    ph: { item: "Assurance responsabilité civile professionnelle" },
  },
  chiffres: {
    label: "Vos chiffres clés",
    hint: "Ce qui rassure en un coup d'œil.",
    ph: { value: "10 ans", label: "d'expérience" },
  },
  faq: {
    label: "Questions fréquentes",
    hint: "Ce qu'on vous demande au téléphone à chaque fois. Y répondre ici vous fait gagner des appels.",
    ph: { q: "La question", a: "Votre réponse" },
  },
  equipe: {
    label: "Votre équipe",
    hint: "Qui le client aura en face de lui.",
    ph: { name: "Prénom, nom", role: "Rôle" },
  },
  zones: {
    label: "Votre zone d'intervention",
    hint: "Les communes ou le rayon que vous couvrez.",
    ph: { areas: "Lyon, Villeurbanne, Caluire" },
  },
};

const santeCommun: TradeLexicon = {
  prestations: {
    label: "Vos actes et leurs tarifs",
    hint: "Les actes que vous pratiquez. Précisez le tarif conventionné ou le dépassement s'il y a lieu.",
    ph: { name: "Consultation de suivi", price: "25 €", desc: "Durée, conditions (optionnel)" },
  },
  engagements: {
    label: "Vos diplômes et conventionnements",
    hint: "Ce qui atteste votre exercice : diplôme, secteur, numéro RPPS, adhésion.",
    ph: { item: "Conventionné secteur 1" },
  },
  avis: {
    label: "Vos retours de patients",
    hint: "Des retours réels. Ne publiez rien qui permette d'identifier un patient sans son accord.",
    ph: { text: "Ce que le patient a écrit", author: "Prénom, initiale", source: "Ville" },
  },
  faq: {
    label: "Questions fréquentes des patients",
    hint: "Remboursement, délai de rendez-vous, documents à apporter.",
    ph: { q: "Faut-il une ordonnance ?", a: "Votre réponse" },
  },
};

const artisanCommun: TradeLexicon = {
  engagements: {
    label: "Vos garanties et qualifications",
    hint: "Décennale, Qualibat, RGE, assurance — ce que vous pouvez prouver.",
    ph: { item: "Garantie décennale" },
  },
  chiffres: {
    label: "Vos chiffres clés",
    hint: "Ce qui rassure : années de métier, chantiers livrés, délai d'intervention.",
    ph: { value: "30 ans", label: "de métier" },
  },
  zones: {
    label: "Votre zone d'intervention",
    hint: "Les communes ou le rayon que vous couvrez. Ce thème l'affiche.",
    ph: { areas: "Lyon, Villeurbanne, Caluire, Rhône sud" },
  },
};

export const TRADE_LEXICON: Record<string, TradeLexicon> = {
  // ─── Santé ────────────────────────────────────────────────────────────────
  medecin: santeCommun,
  dentiste: {
    ...santeCommun,
    prestations: {
      label: "Vos soins et leurs tarifs",
      hint: "Détartrage, soins conservateurs, prothèses, implants. Le devis type aide le patient à se projeter.",
      ph: { name: "Détartrage", price: "28,92 €", desc: "Durée, prise en charge (optionnel)" },
    },
  },
  kine: santeCommun,
  osteo: {
    ...santeCommun,
    prestations: {
      label: "Vos consultations et leurs tarifs",
      hint: "Adulte, nourrisson, femme enceinte, sportif — les motifs que vous prenez.",
      ph: { name: "Consultation adulte", price: "60 €", desc: "Durée (optionnel)" },
    },
  },
  veterinaire: {
    ...santeCommun,
    prestations: {
      label: "Vos actes vétérinaires et leurs tarifs",
      hint: "Consultation, vaccination, chirurgie, identification.",
      ph: { name: "Consultation vaccinale", price: "45 €", desc: "Espèces concernées (optionnel)" },
    },
    avis: { ...santeCommun.avis, label: "Vos avis de propriétaires" },
  },
  pharmacie: {
    prestations: {
      label: "Vos services au comptoir",
      hint: "Vaccination, tests rapides, entretiens pharmaceutiques, matériel médical, préparations.",
      ph: { name: "Vaccination grippe", price: "prise en charge", desc: "Conditions (optionnel)" },
    },
    engagements: {
      label: "Vos agréments",
      hint: "Inscription à l'Ordre, licence, préparatoire agréé, tiers payant.",
      ph: { item: "Inscrite à l'Ordre national des pharmaciens" },
    },
    faq: {
      label: "Questions fréquentes",
      hint: "Garde, ordonnance envoyée à l'avance, tiers payant, délai de commande.",
      ph: { q: "Puis-je envoyer mon ordonnance à l'avance ?", a: "Votre réponse" },
    },
  },
  opticien: {
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Examen de vue, montures, verres, lentilles, réparation, tiers payant.",
      ph: { name: "Examen de vue", price: "gratuit", desc: "Durée, conditions (optionnel)" },
    },
    engagements: {
      label: "Vos garanties",
      hint: "Adaptation, casse, 100 % Santé, agrément mutuelles.",
      ph: { item: "Garantie casse 2 ans" },
    },
  },
  audioprothesiste: {
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Bilan auditif, essai, appareillage, suivi, entretien.",
      ph: { name: "Bilan auditif complet", price: "gratuit", desc: "Durée (optionnel)" },
    },
    engagements: {
      label: "Vos agréments",
      hint: "Diplôme d'État, 100 % Santé, marques agréées.",
      ph: { item: "Diplôme d'État d'audioprothésiste" },
    },
  },
  infirmier: {
    ...santeCommun,
    prestations: {
      label: "Vos soins et leurs tarifs",
      hint: "Pansements, injections, perfusions, prises de sang, soins chroniques.",
      ph: { name: "Pansement simple", price: "tarif conventionné", desc: "À domicile ou au cabinet" },
    },
    zones: {
      label: "Votre secteur de tournée",
      hint: "Les communes où vous vous déplacez.",
      ph: { areas: "Limoges, Isle, Couzeix" },
    },
  },
  laboratoire: {
    prestations: {
      label: "Vos analyses et leurs tarifs",
      hint: "Prélèvements, bilans, tests rapides, délais de rendu.",
      ph: { name: "Bilan sanguin complet", price: "tarif conventionné", desc: "Délai de rendu" },
    },
    engagements: {
      label: "Vos accréditations",
      hint: "COFRAC, agréments, démarche qualité.",
      ph: { item: "Accréditation COFRAC" },
    },
  },
  podologue: {
    ...santeCommun,
    prestations: {
      label: "Vos soins et leurs tarifs",
      hint: "Pédicurie, semelles orthopédiques, suivi diabétique, bilan postural.",
      ph: { name: "Soin de pédicurie", price: "35 €", desc: "Durée (optionnel)" },
    },
  },
  sage_femme: {
    ...santeCommun,
    prestations: {
      label: "Vos accompagnements et leurs tarifs",
      hint: "Suivi de grossesse, préparation, rééducation, consultation post-natale.",
      ph: { name: "Suivi de grossesse", price: "tarif conventionné", desc: "Durée (optionnel)" },
    },
  },

  // ─── Services & artisanat ─────────────────────────────────────────────────
  plombier: {
    ...artisanCommun,
    prestations: {
      label: "Vos interventions et leurs tarifs",
      hint: "Dépannage, installation, chauffe-eau, salle de bains. Précisez si le déplacement est facturé.",
      ph: { name: "Dépannage fuite", price: "dès 90 €", desc: "Déplacement compris (optionnel)" },
    },
  },
  electricien: {
    ...artisanCommun,
    prestations: {
      label: "Vos interventions et leurs tarifs",
      hint: "Mise aux normes, tableau, rénovation, borne de recharge, dépannage.",
      ph: { name: "Mise aux normes du tableau", price: "dès 650 €", desc: "Détail (optionnel)" },
    },
  },
  paysagiste: {
    ...artisanCommun,
    prestations: {
      label: "Vos travaux et leurs tarifs",
      hint: "Création, entretien, élagage, clôture, arrosage automatique.",
      ph: { name: "Entretien annuel", price: "dès 45 €/h", desc: "Fréquence (optionnel)" },
    },
  },
  pisciniste: {
    ...artisanCommun,
    prestations: {
      label: "Vos réalisations et leurs tarifs",
      hint: "Construction, rénovation, entretien, hivernage, sécurité.",
      ph: { name: "Hivernage complet", price: "dès 290 €", desc: "Ce qui est compris" },
    },
  },
  menage: {
    ...artisanCommun,
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Ménage régulier, remise en état, vitrerie, fin de bail.",
      ph: { name: "Ménage hebdomadaire", price: "dès 28 €/h", desc: "Durée minimum (optionnel)" },
    },
    engagements: {
      label: "Vos garanties",
      hint: "Assurance, personnel déclaré, crédit d'impôt, agrément services à la personne.",
      ph: { item: "Crédit d'impôt 50 %" },
    },
  },
  garage_auto: {
    ...artisanCommun,
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Révision, freins, distribution, diagnostic, pneus, carrosserie.",
      ph: { name: "Révision complète", price: "dès 149 €", desc: "Ce qui est compris" },
    },
    engagements: {
      label: "Vos agréments",
      hint: "Agréments constructeurs, assurances, garantie pièces et main-d'œuvre.",
      ph: { item: "Garantie 2 ans pièces et main-d'œuvre" },
    },
  },
  btp_construction: {
    ...artisanCommun,
    prestations: {
      label: "Vos ouvrages et leurs tarifs",
      hint: "Gros œuvre, extension, rénovation, maçonnerie. Le prix au m² parle au client.",
      ph: { name: "Extension ossature bois", price: "1 400–1 800 €/m²", desc: "Ce qui est compris" },
    },
  },
  couvreur: {
    ...artisanCommun,
    prestations: {
      label: "Vos travaux de toiture et leurs tarifs",
      hint: "Réfection, zinguerie, isolation, urgence. Le prix au m² est ce que le client compare.",
      ph: { name: "Réfection tuile terre cuite", price: "95–130 €/m²", desc: "Dépose et évacuation comprises" },
    },
  },
  peintre: {
    ...artisanCommun,
    prestations: {
      label: "Vos travaux et leurs tarifs",
      hint: "Peinture intérieure, façade, enduits, papier peint, ravalement.",
      ph: { name: "Peinture intérieure", price: "25–35 €/m²", desc: "Préparation comprise" },
    },
  },
  vitrier: {
    ...artisanCommun,
    prestations: {
      label: "Vos interventions et leurs tarifs",
      hint: "Vitrage cassé, double vitrage, miroiterie, paroi de douche, urgence.",
      ph: { name: "Remplacement double vitrage", price: "dès 180 €", desc: "Délai d'intervention" },
    },
  },
  menuisier: {
    ...artisanCommun,
    prestations: {
      label: "Vos ouvrages et leurs tarifs",
      hint: "Mobilier sur mesure, agencement, restauration, marqueterie, pose.",
      ph: { name: "Bibliothèque sur mesure", price: "sur devis", desc: "Essences, finitions" },
    },
  },
  serrurier: {
    ...artisanCommun,
    prestations: {
      label: "Vos interventions et leurs tarifs",
      hint: "Ouverture de porte, changement de cylindre, blindage, urgence 24 h.",
      ph: { name: "Ouverture de porte claquée", price: "dès 149 €", desc: "Délai, déplacement" },
    },
    engagements: {
      label: "Vos garanties",
      hint: "Devis avant intervention, prix annoncé, assurance, certification A2P.",
      ph: { item: "Devis gratuit avant intervention" },
    },
  },
  demenageur: {
    ...artisanCommun,
    prestations: {
      label: "Vos formules et leurs tarifs",
      hint: "Économique, standard, clé en main, garde-meuble. Ce que chaque formule comprend.",
      ph: { name: "Formule éco", price: "dès 490 €", desc: "Ce qui est compris" },
    },
    engagements: {
      label: "Vos garanties",
      hint: "Inscription au registre des transporteurs, assurance ad valorem, lettre de voiture.",
      ph: { item: "Assurance ad valorem" },
    },
  },
  pompes_funebres: {
    prestations: {
      label: "Vos formules et leurs tarifs",
      hint: "Inhumation, crémation, cérémonie civile ou religieuse. La loi impose un devis-type : soyez précis.",
      ph: { name: "Inhumation complète", price: "à partir de 2 900 €", desc: "Ce qui est compris" },
    },
    engagements: {
      label: "Vos habilitations",
      hint: "Habilitation préfectorale, devis conforme à l'arrêté du 23 août 2010, permanence.",
      ph: { item: "Habilitation préfectorale n° …" },
    },
    avis: {
      label: "Les mots des familles",
      hint: "Ce que des familles ont écrit. Ne publiez rien sans leur accord.",
      ph: { text: "Ce que la famille a écrit", author: "Initiales", source: "Ville" },
    },
  },
  auto_ecole: {
    prestations: {
      label: "Vos formules et leurs tarifs",
      hint: "Forfait code, forfait conduite, heures supplémentaires, conduite accompagnée, permis boîte auto.",
      ph: { name: "Forfait 20 h", price: "1 190 €", desc: "Ce qui est compris" },
    },
    engagements: {
      label: "Vos agréments",
      hint: "Agrément préfectoral, label qualité, taux de réussite.",
      ph: { item: "Agrément préfectoral n° …" },
    },
    chiffres: {
      label: "Vos chiffres clés",
      hint: "Taux de réussite, délai moyen d'obtention, nombre d'élèves formés.",
      ph: { value: "78 %", label: "de réussite au permis" },
    },
  },
  pressing: {
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Nettoyage, repassage, retouches, blanchisserie, tapis et cuir.",
      ph: { name: "Costume 2 pièces", price: "18,90 €", desc: "Délai (optionnel)" },
    },
    engagements: {
      label: "Vos engagements",
      hint: "Écolabel, solvants, délais tenus, prise en charge des taches.",
      ph: { item: "Nettoyage sans perchloroéthylène" },
    },
  },
  securite: {
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Gardiennage, rondes, télésurveillance, événementiel, intervention sur alarme.",
      ph: { name: "Ronde de nuit", price: "sur devis", desc: "Fréquence, périmètre" },
    },
    engagements: {
      label: "Vos autorisations",
      hint: "Autorisation CNAPS, cartes professionnelles, assurance.",
      ph: { item: "Autorisation CNAPS n° …" },
    },
  },
  formation: {
    prestations: {
      label: "Vos formations et leurs tarifs",
      hint: "Intitulé, durée, modalité, financement possible.",
      ph: { name: "Titre professionnel — 6 mois", price: "4 200 €", desc: "Financements acceptés" },
    },
    engagements: {
      label: "Vos certifications",
      hint: "Qualiopi, France Compétences, OPCO, taux de réussite.",
      ph: { item: "Certifié Qualiopi" },
    },
    chiffres: {
      label: "Vos chiffres clés",
      hint: "Taux de réussite, taux d'insertion, stagiaires formés.",
      ph: { value: "92 %", label: "d'insertion à 6 mois" },
    },
  },
  controle_technique: {
    prestations: {
      label: "Vos contrôles et leurs tarifs",
      hint: "Contrôle périodique, contre-visite, véhicules utilitaires, gaz.",
      ph: { name: "Contrôle technique VL", price: "78 €", desc: "Durée, contre-visite comprise" },
    },
    engagements: {
      label: "Vos agréments",
      hint: "Agrément préfectoral, réseau, contrôleurs agréés.",
      ph: { item: "Centre agréé n° …" },
    },
  },
  creche: {
    prestations: {
      label: "Vos formules d'accueil et leurs tarifs",
      hint: "Temps plein, temps partiel, halte-garderie, urgence. Précisez la participation CAF.",
      ph: { name: "Accueil temps plein", price: "selon barème CAF", desc: "Amplitude horaire" },
    },
    engagements: {
      label: "Vos agréments",
      hint: "Agrément PMI, taux d'encadrement, projet pédagogique, personnel diplômé.",
      ph: { item: "Agrément PMI" },
    },
  },
  location_materiel: {
    prestations: {
      label: "Votre matériel et ses tarifs",
      hint: "À la journée, au week-end, à la semaine. Précisez la caution.",
      ph: { name: "Nacelle 12 m", price: "180 €/jour", desc: "Caution, livraison" },
    },
  },
  vtc: {
    prestations: {
      label: "Vos courses et leurs tarifs",
      hint: "Transfert aéroport, mise à disposition, longue distance, transport assis médical.",
      ph: { name: "Transfert aéroport", price: "dès 65 €", desc: "Attente comprise" },
    },
    engagements: {
      label: "Vos autorisations",
      hint: "Carte VTC, registre, assurance transport de personnes.",
      ph: { item: "Carte professionnelle VTC" },
    },
    zones: {
      label: "Votre zone de prise en charge",
      hint: "Villes et aéroports desservis.",
      ph: { areas: "Nice, Cannes, Monaco, aéroport de Nice" },
    },
  },
  toiletteur: {
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Toilettage complet, bain, tonte, pension. Le tarif dépend souvent de la taille.",
      ph: { name: "Toilettage complet petit chien", price: "45 €", desc: "Durée, ce qui est compris" },
    },
    avis: { label: "Vos avis de propriétaires", hint: "Des avis réels de vos clients." },
  },

  // ─── Droit & finance ──────────────────────────────────────────────────────
  avocat: {
    prestations: {
      label: "Vos domaines d'intervention et leurs honoraires",
      hint: "Le domaine, le mode de facturation, la première consultation.",
      ph: { name: "Droit du travail", price: "250 €/h HT", desc: "Convention d'honoraires" },
    },
    engagements: {
      label: "Votre inscription et vos spécialisations",
      hint: "Barreau, certificats de spécialisation, assurance, aide juridictionnelle.",
      ph: { item: "Barreau de Lyon" },
    },
  },
  notaire: {
    prestations: {
      label: "Vos domaines et leurs tarifs",
      hint: "Immobilier, famille, succession, entreprise. Les émoluments sont réglementés : dites-le.",
      ph: { name: "Vente immobilière", price: "tarif réglementé", desc: "Ce qui est compris" },
    },
    engagements: {
      label: "Votre étude",
      hint: "Nomination par le garde des Sceaux, Chambre des notaires, assurance.",
      ph: { item: "Membre de la Chambre des notaires du Rhône" },
    },
  },
  comptable: {
    prestations: {
      label: "Vos missions et leurs tarifs",
      hint: "Tenue, bilan, paie, conseil, création. Le forfait mensuel rassure.",
      ph: { name: "Forfait TPE", price: "dès 149 €/mois", desc: "Ce qui est compris" },
    },
    engagements: {
      label: "Votre inscription",
      hint: "Ordre des experts-comptables, assurance, outils agréés.",
      ph: { item: "Inscrit à l'Ordre des experts-comptables" },
    },
  },
  assurance: {
    prestations: {
      label: "Vos contrats et leurs tarifs",
      hint: "Auto, habitation, santé, professionnelle, prévoyance.",
      ph: { name: "Multirisque professionnelle", price: "sur étude", desc: "Garanties principales" },
    },
    engagements: {
      label: "Vos habilitations",
      hint: "ORIAS, statut de courtier, compagnies partenaires.",
      ph: { item: "Immatriculé ORIAS n° …" },
    },
  },
  gestion_patrimoine: {
    prestations: {
      label: "Vos accompagnements et leurs tarifs",
      hint: "Bilan patrimonial, placement, défiscalisation, transmission.",
      ph: { name: "Bilan patrimonial", price: "offert", desc: "Durée, livrable" },
    },
    engagements: {
      label: "Vos habilitations",
      hint: "CIF, ORIAS, association agréée, assurance.",
      ph: { item: "Conseiller en investissements financiers (CIF)" },
    },
  },
  recrutement: {
    prestations: {
      label: "Vos missions et leurs tarifs",
      hint: "Recrutement, chasse, évaluation, portage. Souvent un pourcentage du salaire.",
      ph: { name: "Recrutement cadre", price: "18 % du package", desc: "Garantie de remplacement" },
    },
    chiffres: {
      label: "Vos chiffres clés",
      hint: "Délai moyen de placement, taux de transformation, candidats placés.",
      ph: { value: "32 jours", label: "de délai moyen" },
    },
  },

  // ─── Restauration & commerce de bouche ────────────────────────────────────
  restaurant: {
    prestations: {
      label: "Vos formules et leurs tarifs",
      hint: "Menu du jour, carte, formule midi, menu dégustation.",
      ph: { name: "Formule déjeuner", price: "22 €", desc: "Entrée, plat, dessert" },
    },
    engagements: {
      label: "Vos labels",
      hint: "Fait maison, Maître Restaurateur, produits locaux, allergènes.",
      ph: { item: "Titre de Maître Restaurateur" },
    },
  },
  restauration_rapide: {
    prestations: {
      label: "Vos formules et leurs tarifs",
      hint: "Menus, à la carte, livraison, click and collect.",
      ph: { name: "Menu burger", price: "12,90 €", desc: "Ce qui est compris" },
    },
  },
  boulangerie: {
    prestations: {
      label: "Vos produits et leurs prix",
      hint: "Pains, viennoiseries, pâtisseries, formules.",
      ph: { name: "Pain au levain 1 kg", price: "5,20 €", desc: "Farine, fermentation" },
    },
    engagements: {
      label: "Vos labels",
      hint: "Boulanger de France, farine label rouge, levain naturel, bio.",
      ph: { item: "Boulanger de France" },
    },
  },
  cafe_bar: {
    prestations: {
      label: "Votre carte et vos prix",
      hint: "Cafés, vins au verre, planches, happy hour.",
      ph: { name: "Verre de vin nature", price: "6,50 €", desc: "Sélection (optionnel)" },
    },
  },
  brasserie: {
    prestations: {
      label: "Vos bières et leurs prix",
      hint: "Permanentes, saisonnières, formats, dégustation.",
      ph: { name: "IPA 33 cl", price: "4,20 €", desc: "Houblons, degré" },
    },
  },
  caviste: {
    prestations: {
      label: "Votre sélection et vos prix",
      hint: "Régions, gammes de prix, dégustations, box.",
      ph: { name: "Côtes-du-Rhône bio", price: "12–18 €", desc: "Domaine, millésime" },
    },
  },
  commerce_bouche: {
    prestations: {
      label: "Vos produits et leurs prix",
      hint: "Ce que vous vendez au comptoir, avec l'origine.",
      ph: { name: "Côte de bœuf maturée", price: "39 €/kg", desc: "Race, maturation" },
    },
    engagements: {
      label: "Vos origines et labels",
      hint: "Éleveurs, AOP, bio, circuit court.",
      ph: { item: "Viande de race Charolaise, élevage à 40 km" },
    },
  },
  producteur: {
    prestations: {
      label: "Vos produits et leurs prix",
      hint: "Paniers, vente directe, marchés, transformation.",
      ph: { name: "Panier de saison", price: "18 €", desc: "Contenu type" },
    },
    engagements: {
      label: "Vos labels",
      hint: "Bio, HVE, vente directe, circuits courts.",
      ph: { item: "Agriculture biologique (AB)" },
    },
  },

  // ─── Sport, beauté, création ──────────────────────────────────────────────
  coach: {
    prestations: {
      label: "Vos accompagnements et leurs tarifs",
      hint: "Séance individuelle, forfait, en ligne, préparation.",
      ph: { name: "Séance individuelle", price: "60 €", desc: "Durée, lieu" },
    },
  },
  salle_sport: {
    prestations: {
      label: "Vos abonnements et leurs tarifs",
      hint: "Mensuel, annuel, cours collectifs, accès libre.",
      ph: { name: "Abonnement mensuel", price: "39 €/mois", desc: "Sans engagement" },
    },
  },
  tatoueur: {
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Projet, taille, forfait journée, retouche comprise ou non.",
      ph: { name: "Pièce moyenne", price: "dès 350 €", desc: "Séances, retouche" },
    },
    engagements: {
      label: "Vos garanties d'hygiène",
      hint: "Formation hygiène, matériel à usage unique, déclaration ARS.",
      ph: { item: "Formation hygiène et salubrité" },
    },
  },
  coiffeur: {
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Coupe, couleur, brushing, barbe. Séparez femme, homme, enfant si vos prix diffèrent.",
      ph: { name: "Coupe femme + brushing", price: "45 €", desc: "Durée (optionnel)" },
    },
  },
  institut_beaute: {
    prestations: {
      label: "Vos soins et leurs tarifs",
      hint: "Visage, corps, épilation, ongles, forfaits.",
      ph: { name: "Soin visage éclat", price: "65 €", desc: "Durée, protocole" },
    },
  },
  couture: {
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Sur mesure, retouches, création, délais.",
      ph: { name: "Retouche ourlet", price: "dès 15 €", desc: "Délai" },
    },
  },
  photographe: {
    prestations: {
      label: "Vos forfaits et leurs tarifs",
      hint: "Mariage, portrait, entreprise, produit. Ce que comprend chaque forfait.",
      ph: { name: "Reportage mariage", price: "dès 1 400 €", desc: "Heures, photos livrées" },
    },
  },
  fleuriste: {
    prestations: {
      label: "Vos créations et leurs prix",
      hint: "Bouquets, compositions, deuil, mariage, abonnement.",
      ph: { name: "Bouquet du fleuriste", price: "dès 25 €", desc: "Saison, livraison" },
    },
  },
  bijouterie: {
    prestations: {
      label: "Vos services et leurs tarifs",
      hint: "Création, réparation, mise à taille, expertise, piles.",
      ph: { name: "Mise à taille d'alliance", price: "dès 45 €", desc: "Délai, métal" },
    },
  },
  studio_creatif: {
    prestations: {
      label: "Vos prestations et leurs tarifs",
      hint: "Film, motion, identité, web. Le forfait ou la journée.",
      ph: { name: "Film de marque", price: "dès 3 500 €", desc: "Livrables" },
    },
  },
  ecole_musique: {
    prestations: {
      label: "Vos cours et leurs tarifs",
      hint: "Instrument, formule, trimestre ou année, éveil.",
      ph: { name: "Cours de piano 45 min", price: "35 €", desc: "Fréquence, niveau" },
    },
  },
  boutique_mode: {
    prestations: {
      label: "Vos gammes et leurs prix",
      hint: "Marques, catégories, retouches offertes, personal shopper.",
      ph: { name: "Prêt-à-porter femme", price: "60–250 €", desc: "Marques principales" },
    },
  },

  // ─── Événementiel & habitat ───────────────────────────────────────────────
  mariage: {
    prestations: {
      label: "Vos formules et leurs tarifs",
      hint: "Coordination jour J, organisation complète, décoration.",
      ph: { name: "Coordination jour J", price: "dès 1 200 €", desc: "Ce qui est compris" },
    },
  },
  salle_reception: {
    prestations: {
      label: "Vos espaces et leurs tarifs",
      hint: "Capacité, durée de location, traiteur imposé ou libre.",
      ph: { name: "Grande salle — 220 couverts", price: "dès 3 500 €", desc: "Durée, ce qui est compris" },
    },
  },
  agent_immobilier: {
    prestations: {
      label: "Vos services et vos honoraires",
      hint: "Vente, location, gestion, estimation. Le barème doit être affiché.",
      ph: { name: "Vente", price: "4 % TTC", desc: "À la charge de qui" },
    },
    engagements: {
      label: "Vos garanties",
      hint: "Carte professionnelle, garantie financière, assurance.",
      ph: { item: "Carte professionnelle T n° …" },
    },
  },
  architecte: {
    prestations: {
      label: "Vos missions et leurs honoraires",
      hint: "Esquisse, permis, maîtrise d'œuvre complète. Souvent un pourcentage des travaux.",
      ph: { name: "Mission complète", price: "10–12 % des travaux", desc: "Phases comprises" },
    },
    engagements: {
      label: "Votre inscription",
      hint: "Ordre des architectes, assurance décennale, HMONP.",
      ph: { item: "Inscrit à l'Ordre des architectes" },
    },
  },
  cuisiniste: {
    ...artisanCommun,
    prestations: {
      label: "Vos réalisations et leurs tarifs",
      hint: "Cuisine, dressing, agencement. Le prix d'un projet type aide à se projeter.",
      ph: { name: "Cuisine sur mesure", price: "dès 9 000 €", desc: "Pose, électroménager compris ?" },
    },
  },
  hotel: {
    prestations: {
      label: "Vos chambres et leurs tarifs",
      hint: "Catégories, saison, petit-déjeuner compris ou non.",
      ph: { name: "Chambre double", price: "dès 120 €/nuit", desc: "Ce qui est compris" },
    },
  },
};

/** Le vocabulaire d'un bloc pour un métier, avec repli sur le libellé générique. */
export function copyFor(sector: string | undefined, block: ContentBlock): BlockCopy {
  const trade = (sector && TRADE_LEXICON[sector]) || {};
  const fallback = (DEFAULT_LEXICON as Record<string, BlockCopy>)[block] ?? {};
  const own = trade[block] ?? {};
  return { ...fallback, ...own, ph: { ...(fallback.ph ?? {}), ...(own.ph ?? {}) } };
}
