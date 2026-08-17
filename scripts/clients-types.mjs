/*
  Un client de référence par domaine.

  Juger un thème de restaurant avec les données d'un couvreur produit des
  centaines de faux défauts : ce n'est pas le thème qui déraille, c'est
  l'échantillon. Chaque thème est donc éprouvé avec le métier auquel le
  formulaire le propose.

  Chaque fiche remplit tous les blocs — prestations, avis, chiffres, garanties,
  questions, équipe, horaires, réalisations, zones — pour qu'aucune section ne
  reste sur l'exemple du thème. Les textes sont volontairement de longueurs
  variées : c'est ainsi qu'on voit si la mise en page tient.
*/

const commun = (v) => ({
  form: {
    businessName: v.nom,
    businessType: v.metier,
    tagline: v.accroche,
    city: v.ville,
    brandColor: v.couleur ?? "#7c3aed",
    email: v.courriel,
    phone: v.telephone,
    instagram: v.instagram,
    address: v.adresse,
  },
  profil: {
    services: v.prestations,
    menu: v.carte ?? v.prestations.map((p) => ({ name: p.name, price: p.price, category: v.categorie ?? "Nos offres" })),
    products: v.produits ?? v.prestations.slice(0, 2).map((p) => ({ name: p.name, price: p.price, description: p.description })),
    keyStats: v.chiffres,
    certifications: v.garanties,
    faq: v.questions,
    team: v.equipe,
    openingHours: v.horaires,
    beforeAfter: v.realisations,
    reputation: { featuredReviews: v.avis },
    geo: { serviceAreas: v.zones },
    legal: { companyName: v.nom, companyAddress: v.adresse },
    contacts: { general: { email: v.courriel, phone: v.telephone } },
  },
});

export const CLIENTS = {
  "Santé": commun({
    nom: "Cabinet Rive-Gauche", metier: "cabinet médical", ville: "Annecy",
    accroche: "Médecine générale et suivi au long cours, du nourrisson au grand âge",
    courriel: "contact@cabinet-rive-gauche.fr", telephone: "04 50 45 22 10",
    instagram: "@cabinetrivegauche", adresse: "8 quai des Clarisses, 74000 Annecy",
    couleur: "#0d9488",
    prestations: [
      { name: "Consultation de médecine générale", price: "26,50 €", description: "Trente minutes, sur rendez-vous ou en accès direct le matin." },
      { name: "Suivi de maladie chronique", price: "conventionné secteur 1", description: "Diabète, hypertension, asthme : un rendez-vous long tous les trois mois." },
      { name: "Bilan de prévention", price: "prise en charge à 100 %", description: "Dépistages, vaccinations, bilan sanguin commenté." },
    ],
    chiffres: [{ value: "1998", label: "année d'ouverture" }, { value: "4", label: "praticiens" }, { value: "48 h", label: "délai moyen" }, { value: "3 200", label: "patients suivis" }],
    garanties: ["Conventionné secteur 1", "Tiers payant intégral", "Accessible aux personnes à mobilité réduite", "Maître de stage universitaire"],
    questions: [
      { q: "Prenez-vous de nouveaux patients ?", a: "Oui, en médecin traitant, dans la limite de nos disponibilités." },
      { q: "Peut-on consulter sans rendez-vous ?", a: "Le matin de 8 h à 10 h, en accès direct, sans réservation." },
      { q: "Faites-vous les visites à domicile ?", a: "Pour les patients dépendants du secteur, sur appel avant 11 h." },
    ],
    equipe: [{ name: "Dr Claire Fontaine", role: "Médecin généraliste" }, { name: "Dr Samuel Ortiz", role: "Médecin généraliste" }, { name: "Nadia Belkacem", role: "Secrétaire médicale" }],
    horaires: [{ day: "Lundi — vendredi", open: "8h", close: "19h" }, { day: "Samedi", open: "8h", close: "12h" }],
    realisations: [{ beforeUrl: "", afterUrl: "", caption: "Salle d'attente repensée en 2024 — lumière naturelle et espace enfants" }],
    avis: [
      { author: "Martine L.", text: "Un médecin qui prend le temps d'expliquer. On ressort en ayant compris.", rating: 5, source: "Annecy" },
      { author: "Yannis B.", text: "Rendez-vous obtenu en deux jours, ce qui est rare aujourd'hui.", rating: 5, source: "Annecy-le-Vieux" },
    ],
    zones: ["Annecy", "Annecy-le-Vieux", "Cran-Gevrier", "Seynod"],
  }),

  "Services & Artisanat": commun({
    nom: "Ateliers Vidal & Fils", metier: "couvreur zingueur", ville: "Annecy",
    accroche: "Zinc, ardoise et tuile plate depuis 1974 — trois générations sur les toits du bassin annécien",
    courriel: "contact@ateliers-vidal.fr", telephone: "04 50 71 82 93",
    instagram: "@ateliersvidal", adresse: "14 route des Creuses, 74000 Annecy",
    prestations: [
      { name: "Réfection complète de toiture", price: "à partir de 9 400 €", description: "Dépose de l'ancienne couverture, vérification de la charpente, pose neuve garantie dix ans." },
      { name: "Zinguerie et gouttières", price: "de 90 à 140 € le mètre", description: "Chéneaux, descentes, habillages de lucarnes en zinc naturel ou prépatiné." },
      { name: "Recherche de fuite", price: "180 € forfait", description: "Diagnostic sous 24 h, rapport photographique, devis le jour même." },
    ],
    chiffres: [{ value: "1974", label: "année de création" }, { value: "3", label: "générations" }, { value: "10 ans", label: "de garantie" }, { value: "480", label: "toitures refaites" }],
    garanties: ["Qualibat 3212", "RGE Éco-artisan", "Assurance décennale AXA", "Artisan de France"],
    questions: [
      { q: "Intervenez-vous en urgence après une tempête ?", a: "Oui, sous 24 h sur tout le bassin annécien, avec bâchage immédiat." },
      { q: "Travaillez-vous en site classé ?", a: "Oui. Nous montons les dossiers auprès des Bâtiments de France." },
      { q: "Quels délais pour une réfection ?", a: "Trois semaines d'étude, huit à douze jours de chantier." },
    ],
    equipe: [{ name: "Julien Vidal", role: "Couvreur zingueur, gérant" }, { name: "Marc Vidal", role: "Charpentier" }, { name: "Sofiane Benali", role: "Compagnon couvreur" }],
    horaires: [{ day: "Lundi — vendredi", open: "7h30", close: "18h30" }, { day: "Samedi", open: "8h", close: "12h" }],
    realisations: [
      { beforeUrl: "", afterUrl: "", caption: "Corps de ferme du XVIIIe, Sévrier — 320 m² d'ardoise reposés à l'identique" },
      { beforeUrl: "", afterUrl: "", caption: "Immeuble haussmannien, Annecy centre — zinc à joint debout" },
    ],
    avis: [
      { author: "Hélène Brunet", text: "Toiture refaite en huit jours, chantier laissé impeccable, devis tenu au centime près.", rating: 5, source: "Annecy" },
      { author: "Patrick Meunier", text: "Une fuite que trois entreprises n'avaient pas trouvée. Diagnostic en une heure.", rating: 5, source: "Sévrier" },
    ],
    zones: ["Annecy", "Sévrier", "Veyrier-du-Lac", "Cran-Gevrier"],
  }),

  "Restauration": commun({
    nom: "La Table du Thiou", metier: "restaurant bistronomique", ville: "Annecy",
    accroche: "Une carte courte qui change chaque semaine, au fil du marché et des lacs",
    courriel: "reserver@latableduthiou.fr", telephone: "04 50 51 33 07",
    instagram: "@latableduthiou", adresse: "3 rue de l'Île, 74000 Annecy",
    couleur: "#b45309", categorie: "La carte",
    prestations: [
      { name: "Menu du marché — 3 services", price: "38 €", description: "Entrée, plat, dessert. Le midi en semaine, sur ardoise." },
      { name: "Menu dégustation — 6 services", price: "72 €", description: "Le soir, sur réservation. Accord mets et vins à 34 €." },
      { name: "Privatisation", price: "sur devis", description: "Jusqu'à trente-deux couverts, cuisine ouverte sur la salle." },
    ],
    carte: [
      { name: "Féra du lac, beurre blanc à l'oseille", price: "26 €", category: "Poissons" },
      { name: "Ris de veau croustillant, jus corsé", price: "31 €", category: "Viandes" },
      { name: "Soufflé à la chartreuse", price: "12 €", category: "Desserts" },
    ],
    chiffres: [{ value: "2016", label: "ouverture" }, { value: "32", label: "couverts" }, { value: "100 %", label: "fait maison" }, { value: "1", label: "toque au Gault&Millau" }],
    garanties: ["Maître Restaurateur", "Fait Maison", "Producteurs locaux à moins de 40 km", "Vins nature et bio"],
    questions: [
      { q: "Faut-il réserver ?", a: "Fortement conseillé le soir et le week-end : la salle compte trente-deux couverts." },
      { q: "Proposez-vous des plats végétariens ?", a: "Oui, un menu complet, à préciser à la réservation." },
      { q: "Peut-on venir avec un enfant ?", a: "Bien sûr, une demi-portion est proposée sur tous les plats." },
    ],
    equipe: [{ name: "Élise Marchand", role: "Cheffe" }, { name: "Tom Delaunay", role: "Second de cuisine" }, { name: "Inès Fabre", role: "Cheffe de salle et sommelière" }],
    horaires: [{ day: "Mardi — samedi", open: "12h", close: "14h" }, { day: "Mardi — samedi (soir)", open: "19h30", close: "22h" }],
    realisations: [{ beforeUrl: "", afterUrl: "", caption: "La salle ouverte sur le Thiou après les travaux de l'hiver 2025" }],
    avis: [
      { author: "Guillaume P.", text: "Une cuisine précise, sans esbroufe. Le soufflé à la chartreuse vaut le détour.", rating: 5, source: "Annecy" },
      { author: "Sarah N.", text: "Accueil chaleureux et carte des vins remarquable pour une si petite salle.", rating: 5, source: "Chambéry" },
    ],
    zones: ["Annecy", "Annecy-le-Vieux"],
  }),

  "Droit & Finance": commun({
    nom: "Ferrand & Associés", metier: "cabinet d'avocats", ville: "Lyon",
    accroche: "Droit des affaires et droit social, aux côtés des dirigeants depuis 1997",
    courriel: "contact@ferrand-associes.fr", telephone: "04 72 40 18 55",
    instagram: "@ferrandassocies", adresse: "22 rue de la République, 69002 Lyon",
    couleur: "#1e3a8a",
    prestations: [
      { name: "Conseil aux dirigeants", price: "280 € / heure", description: "Pactes d'associés, cession, gouvernance. Forfait annuel possible." },
      { name: "Contentieux prud'homal", price: "sur devis", description: "Défense de l'employeur, de la mise à pied à la cassation." },
      { name: "Audit de conformité", price: "à partir de 3 500 €", description: "RGPD, contrats-cadres, conditions générales." },
    ],
    chiffres: [{ value: "1997", label: "création du cabinet" }, { value: "6", label: "avocats" }, { value: "92 %", label: "d'issues favorables" }, { value: "340", label: "entreprises accompagnées" }],
    garanties: ["Barreau de Lyon", "Spécialisation en droit social", "Assurance RCP AXA", "Médiateur agréé"],
    questions: [
      { q: "Le premier rendez-vous est-il payant ?", a: "Non : trente minutes pour cerner votre situation, sans engagement." },
      { q: "Intervenez-vous hors de Lyon ?", a: "Oui, sur toute la région et en visioconférence." },
      { q: "Proposez-vous un forfait annuel ?", a: "Oui, pour les entreprises de plus de dix salariés." },
    ],
    equipe: [{ name: "Maître Anne Ferrand", role: "Associée fondatrice, droit social" }, { name: "Maître Paul Rivière", role: "Associé, droit des affaires" }, { name: "Maître Léa Chen", role: "Collaboratrice" }],
    horaires: [{ day: "Lundi — vendredi", open: "9h", close: "19h" }],
    realisations: [{ beforeUrl: "", afterUrl: "", caption: "Cession d'un groupe de quatre sociétés — 14 M€, closing en onze semaines" }],
    avis: [
      { author: "Bertrand M.", text: "Une lecture du risque très claire, sans jargon. On sait où l'on va.", rating: 5, source: "Lyon" },
      { author: "Sophie D.", text: "Dossier prud'homal gagné en première instance. Préparation minutieuse.", rating: 5, source: "Villeurbanne" },
    ],
    zones: ["Lyon", "Villeurbanne", "Saint-Étienne", "Grenoble"],
  }),

  "Sport & Coaching": commun({
    nom: "Atelier Mouvement", metier: "salle de sport et coaching", ville: "Bordeaux",
    accroche: "Petits groupes, suivi individuel, progression mesurée — pas de machine en libre-service",
    courriel: "bonjour@atelier-mouvement.fr", telephone: "05 56 44 21 09",
    instagram: "@ateliermouvement", adresse: "40 cours de l'Argonne, 33000 Bordeaux",
    couleur: "#ea580c",
    prestations: [
      { name: "Coaching individuel", price: "65 € la séance", description: "Une heure, bilan postural inclus à la première séance." },
      { name: "Petit groupe — 6 personnes", price: "22 € la séance", description: "Renforcement, mobilité, cardio. Douze créneaux par semaine." },
      { name: "Préparation à une course", price: "290 € le cycle", description: "Douze semaines, plan hebdomadaire et suivi hors séance." },
    ],
    chiffres: [{ value: "2019", label: "ouverture" }, { value: "6", label: "personnes par cours" }, { value: "180", label: "adhérents" }, { value: "94 %", label: "de réinscription" }],
    garanties: ["Coachs diplômés d'État", "Assurance responsabilité civile", "Matériel Eleiko", "Séance d'essai offerte"],
    questions: [
      { q: "Faut-il un certificat médical ?", a: "Oui, de moins d'un an, pour toute inscription annuelle." },
      { q: "Puis-je essayer avant de m'engager ?", a: "Une séance découverte est offerte, sans condition." },
      { q: "Y a-t-il des vestiaires ?", a: "Oui, avec douches et casiers, ouverts une heure avant chaque cours." },
    ],
    equipe: [{ name: "Nicolas Berthier", role: "Coach, fondateur" }, { name: "Amandine Sow", role: "Préparatrice physique" }, { name: "Léo Marchetti", role: "Coach mobilité" }],
    horaires: [{ day: "Lundi — vendredi", open: "6h30", close: "21h" }, { day: "Samedi", open: "9h", close: "13h" }],
    realisations: [{ beforeUrl: "", afterUrl: "", caption: "Plateau de force ouvert en 2025 — 120 m² et six postes complets" }],
    avis: [
      { author: "Claire T.", text: "Six personnes par cours, le coach corrige chaque geste. Rien à voir avec une salle classique.", rating: 5, source: "Bordeaux" },
      { author: "Mehdi A.", text: "Marathon fini en 3 h 24 après leur cycle de préparation. Plan tenu à la lettre.", rating: 5, source: "Mérignac" },
    ],
    zones: ["Bordeaux", "Mérignac", "Talence", "Pessac"],
  }),

  "Art & Création": commun({
    nom: "Atelier Céleste", metier: "atelier de céramique", ville: "Nantes",
    accroche: "Grès tourné à la main, cuit au bois — pièces uniques et cours à l'atelier",
    courriel: "atelier@atelier-celeste.fr", telephone: "02 40 12 76 31",
    instagram: "@ateliercelestenantes", adresse: "9 rue de la Distillerie, 44000 Nantes",
    couleur: "#7c2d12",
    prestations: [
      { name: "Pièce sur commande", price: "à partir de 120 €", description: "Service de table, vase, luminaire : dessin puis tournage sur mesure." },
      { name: "Cours de tournage — 4 séances", price: "240 €", description: "Six personnes maximum, terre et cuissons comprises." },
      { name: "Stage week-end", price: "180 €", description: "Deux jours, de la motte à l'émail, pièces cuites et rendues sous trois semaines." },
    ],
    chiffres: [{ value: "2015", label: "ouverture de l'atelier" }, { value: "1 240", label: "pièces sorties du four" }, { value: "6", label: "élèves par cours" }, { value: "1 280 °C", label: "cuisson au grès" }],
    garanties: ["Métiers d'Art", "Émaux sans plomb", "Terre française", "Pièces alimentaires certifiées"],
    questions: [
      { q: "Vos pièces passent-elles au lave-vaisselle ?", a: "Oui, toutes les pièces émaillées grès le supportent." },
      { q: "Peut-on offrir un cours ?", a: "Oui, la carte cadeau est valable un an." },
      { q: "Quels délais pour une commande ?", a: "Comptez six semaines : tournage, séchage, deux cuissons." },
    ],
    equipe: [{ name: "Camille Aubry", role: "Céramiste, fondatrice" }, { name: "Jonas Lefèvre", role: "Tourneur" }],
    horaires: [{ day: "Mercredi — samedi", open: "10h", close: "19h" }],
    realisations: [
      { beforeUrl: "", afterUrl: "", caption: "Service de trente-six pièces pour un restaurant étoilé de Nantes" },
      { beforeUrl: "", afterUrl: "", caption: "Suspension en grès émaillé pour le hall d'un hôtel" },
    ],
    avis: [
      { author: "Anne-Laure V.", text: "Des pièces qu'on a plaisir à prendre en main tous les matins.", rating: 5, source: "Nantes" },
      { author: "Théo R.", text: "Le stage week-end est parfaitement calibré pour un débutant complet.", rating: 5, source: "Rezé" },
    ],
    zones: ["Nantes", "Rezé", "Saint-Herblain"],
  }),

  "Événementiel": commun({
    nom: "Maison Nuptiale", metier: "agence d'organisation de mariages", ville: "Aix-en-Provence",
    accroche: "Un mariage par week-end, du premier repérage au dernier invité raccompagné",
    courriel: "bonjour@maison-nuptiale.fr", telephone: "04 42 27 55 18",
    instagram: "@maisonnuptiale", adresse: "5 cours Mirabeau, 13100 Aix-en-Provence",
    couleur: "#be185d",
    prestations: [
      { name: "Organisation complète", price: "à partir de 6 500 €", description: "Un an d'accompagnement : lieu, prestataires, budget, coordination du jour J." },
      { name: "Coordination du jour J", price: "1 900 €", description: "Nous reprenons votre dossier un mois avant et pilotons la journée." },
      { name: "Recherche de lieu", price: "900 €", description: "Cinq domaines présélectionnés et visités avec vous." },
    ],
    chiffres: [{ value: "2013", label: "première union" }, { value: "180", label: "mariages organisés" }, { value: "1", label: "mariage par week-end" }, { value: "42", label: "lieux partenaires" }],
    garanties: ["Assurance annulation", "Prestataires sous contrat", "Budget contractuel", "Repérage inclus"],
    questions: [
      { q: "Combien de mariages par week-end ?", a: "Un seul. Nous ne dédoublons jamais une équipe." },
      { q: "Travaillez-vous hors de Provence ?", a: "Oui, en France et en Italie du Nord, avec frais de déplacement." },
      { q: "Quand faut-il vous contacter ?", a: "Idéalement douze à dix-huit mois avant la date." },
    ],
    equipe: [{ name: "Juliette Ferrero", role: "Fondatrice, cheffe de projet" }, { name: "Marc Aubin", role: "Coordinateur jour J" }, { name: "Salomé Kacem", role: "Décoratrice" }],
    horaires: [{ day: "Lundi — vendredi", open: "9h30", close: "18h30" }, { day: "Samedi", open: "sur rendez-vous", close: "" }],
    realisations: [
      { beforeUrl: "", afterUrl: "", caption: "Bastide du Luberon — 140 convives, dîner sous les platanes centenaires" },
      { beforeUrl: "", afterUrl: "", caption: "Mariage franco-italien à Menton — deux cérémonies en deux langues" },
    ],
    avis: [
      { author: "Camille & Antoine", text: "Le jour J, nous n'avons rien eu à gérer. C'est exactement ce qu'on venait chercher.", rating: 5, source: "Aix-en-Provence" },
      { author: "Léa & Sofiane", text: "Budget tenu, prestataires irréprochables, et une écoute rare.", rating: 5, source: "Marseille" },
    ],
    zones: ["Aix-en-Provence", "Marseille", "Luberon", "Côte d'Azur"],
  }),

  "Beauté": commun({
    nom: "Studio Lumen", metier: "salon de coiffure et institut", ville: "Toulouse",
    accroche: "Coupe, couleur végétale et soin du cheveu — sur rendez-vous, sans précipitation",
    courriel: "bonjour@studio-lumen.fr", telephone: "05 61 23 44 90",
    instagram: "@studiolumen", adresse: "17 rue des Filatiers, 31000 Toulouse",
    couleur: "#a21caf",
    prestations: [
      { name: "Coupe et brushing", price: "48 €", description: "Diagnostic du cheveu, coupe, coiffage. Une heure." },
      { name: "Couleur végétale", price: "à partir de 75 €", description: "Henné et plantes tinctoriales, sans ammoniaque ni résorcine." },
      { name: "Soin profond et rituel cuir chevelu", price: "60 €", description: "Gommage, massage vingt minutes, masque sur mesure." },
    ],
    chiffres: [{ value: "2017", label: "ouverture" }, { value: "100 %", label: "produits végétaux" }, { value: "5", label: "coiffeuses" }, { value: "4,9", label: "de moyenne sur 620 avis" }],
    garanties: ["Salon engagé sans plastique", "Produits certifiés Cosmos Organic", "Formation continue L'Oréal Professionnel", "Retouche offerte sous quinze jours"],
    questions: [
      { q: "Faut-il un rendez-vous ?", a: "Oui : nous ne prenons pas de passage, pour garder le temps nécessaire." },
      { q: "La couleur végétale couvre-t-elle les cheveux blancs ?", a: "Oui, en deux à trois applications selon la proportion." },
      { q: "Coiffez-vous les enfants ?", a: "À partir de six ans, sur les créneaux du mercredi." },
    ],
    equipe: [{ name: "Marion Estève", role: "Coiffeuse coloriste, fondatrice" }, { name: "Yasmine Haddad", role: "Coiffeuse" }, { name: "Paul Reynaud", role: "Barbier" }],
    horaires: [{ day: "Mardi — samedi", open: "9h30", close: "19h" }],
    realisations: [{ beforeUrl: "", afterUrl: "", caption: "Transition vers le cheveu blanc accompagnée sur onze mois" }],
    avis: [
      { author: "Julie M.", text: "La première coloriste qui m'explique ce qu'elle met sur ma tête, et pourquoi.", rating: 5, source: "Toulouse" },
      { author: "Fanny D.", text: "Un salon calme, sans musique forte. On en ressort reposée.", rating: 5, source: "Blagnac" },
    ],
    zones: ["Toulouse", "Blagnac", "Balma"],
  }),

  "Immobilier & Architecture": commun({
    nom: "Atelier Nord Architecture", metier: "agence d'architecture", ville: "Lille",
    accroche: "Réhabilitation du bâti ancien et extensions bois — du permis à la réception",
    courriel: "contact@ateliernord.archi", telephone: "03 20 55 71 42",
    instagram: "@ateliernordarchi", adresse: "62 rue Nationale, 59000 Lille",
    couleur: "#334155",
    prestations: [
      { name: "Mission complète", price: "10 à 12 % du montant des travaux", description: "Esquisse, permis, consultation des entreprises, suivi de chantier." },
      { name: "Permis de construire", price: "à partir de 2 800 €", description: "Relevé, plans, notice, dépôt et suivi de l'instruction." },
      { name: "Étude de faisabilité", price: "1 200 €", description: "Ce que le terrain et le PLU autorisent vraiment, en trois semaines." },
    ],
    chiffres: [{ value: "2008", label: "fondation" }, { value: "210", label: "projets livrés" }, { value: "7", label: "architectes" }, { value: "0", label: "recours sur permis" }],
    garanties: ["Ordre des architectes", "Assurance décennale MAF", "RGE études", "Habilitation Bâtiments de France"],
    questions: [
      { q: "Intervenez-vous sur de petites surfaces ?", a: "Oui, à partir de 30 m² d'extension." },
      { q: "Quel délai pour un permis ?", a: "Six à huit semaines d'étude, puis deux à trois mois d'instruction." },
      { q: "Travaillez-vous le bâti classé ?", a: "Oui, c'est la moitié de notre activité." },
    ],
    equipe: [{ name: "Élodie Vasseur", role: "Architecte DPLG, associée" }, { name: "Hugo Delcourt", role: "Architecte, chef de projet" }, { name: "Rania Amrani", role: "Dessinatrice projeteuse" }],
    horaires: [{ day: "Lundi — vendredi", open: "9h", close: "18h" }],
    realisations: [
      { beforeUrl: "", afterUrl: "", caption: "Maison 1930 à Roubaix — extension bois de 42 m² et réfection thermique" },
      { beforeUrl: "", afterUrl: "", caption: "Ancienne filature reconvertie en huit logements, Tourcoing" },
    ],
    avis: [
      { author: "Famille Lambert", text: "Un projet tenu au budget annoncé, et un chantier suivi semaine après semaine.", rating: 5, source: "Roubaix" },
      { author: "SCI Deleval", text: "Permis obtenu du premier coup sur un bâtiment classé. Rare.", rating: 5, source: "Tourcoing" },
    ],
    zones: ["Lille", "Roubaix", "Tourcoing", "Villeneuve-d'Ascq"],
  }),

  "Hôtellerie & Voyage": commun({
    nom: "Le Clos des Vignes", metier: "maison d'hôtes", ville: "Beaune",
    accroche: "Cinq chambres dans une maison vigneronne du XVIIIe, au milieu des climats de Bourgogne",
    courriel: "reserver@closdesvignes.fr", telephone: "03 80 22 14 66",
    instagram: "@closdesvignesbeaune", adresse: "12 chemin des Perrières, 21200 Beaune",
    couleur: "#7f1d1d", categorie: "Nos chambres",
    prestations: [
      { name: "Chambre Climat — 2 personnes", price: "185 € la nuit", description: "22 m², vue sur les vignes, petit-déjeuner compris." },
      { name: "Suite Cuvée — 4 personnes", price: "290 € la nuit", description: "40 m², salon séparé, terrasse privative." },
      { name: "Table d'hôtes", price: "48 € par personne", description: "Trois services, accord avec trois verres, sur réservation la veille." },
    ],
    chiffres: [{ value: "1782", label: "année de la maison" }, { value: "5", label: "chambres" }, { value: "9,6", label: "sur 10 en satisfaction" }, { value: "1 ha", label: "de vignes" }],
    garanties: ["Gîtes de France 4 épis", "Clé Verte", "Petit-déjeuner 100 % local", "Parking clos gratuit"],
    questions: [
      { q: "Acceptez-vous les animaux ?", a: "Oui, les chiens, dans deux des cinq chambres, sans supplément." },
      { q: "Proposez-vous des visites de domaines ?", a: "Oui, nous organisons les rendez-vous chez six vignerons voisins." },
      { q: "Y a-t-il un accès pour les personnes à mobilité réduite ?", a: "Une chambre de plain-pied, avec douche adaptée." },
    ],
    equipe: [{ name: "Béatrice Nourrisson", role: "Hôtesse, propriétaire" }, { name: "Denis Nourrisson", role: "Vigneron, table d'hôtes" }],
    horaires: [{ day: "Arrivées", open: "16h", close: "20h" }, { day: "Départs", open: "jusqu'à 11h", close: "" }],
    realisations: [{ beforeUrl: "", afterUrl: "", caption: "Grange du XVIIIe transformée en salle de petit-déjeuner, hiver 2024" }],
    avis: [
      { author: "Marc & Julie", text: "La table d'hôtes vaut à elle seule le détour, et l'accueil est d'une gentillesse rare.", rating: 5, source: "Beaune" },
      { author: "Ingrid H.", text: "Chambre au calme absolu, vue sur les vignes au réveil.", rating: 5, source: "Dijon" },
    ],
    zones: ["Beaune", "Pommard", "Meursault", "Nuits-Saint-Georges"],
  }),
};

/* Chaque domaine a désormais sa fiche : aucun repli. */
export function clientPour(domaine) {
  return CLIENTS[domaine] ?? CLIENTS["Services & Artisanat"];
}
