// Les emplacements photo de chaque thème, dans l'ordre où ils apparaissent.
//
// Généré par mesure des thèmes : 1493 emplacements distincts sur 373 fichiers,
// médiane 4. Les libellés viennent du thème lui-même — son texte `alt` ou le
// titre de la carte à laquelle l'image appartient — donc on demande « Couvreurs
// sur une toiture » plutôt que « photo 3 », et le client sait quoi téléverser.
//
// Plafonné à huit : au-delà, la demande décourage plus qu'elle n'apporte, et les
// emplacements restants gardent l'exemple du thème, ce que l'aperçu annonce.
//
// À régénérer après tout ajout de thème.

export interface PhotoSlots {
  /** Ce qu'on demande au client. */
  n: number;
  /** Ce que le thème contient réellement, plafond compris. */
  total: number;
  /** Un libellé par emplacement, quand le thème en donne un. */
  labels: (string | null)[];
}

export const THEME_PHOTOS: Record<string, PhotoSlots> = {
 "impact-01": {
  n: 8,
  total: 10,
  labels: [
   "Performance",
   "Aether Labs",
   "Noir Studio",
   "Prisme Finance",
   "Lumina Health",
   "Onyx Records",
   null,
   null
  ]
 },
 "impact-02": {
  n: 8,
  total: 14,
  labels: [
   "Fluid Horizons",
   "Tokyo Neon",
   "Concrete Poetry",
   "Skin & Silk",
   "Human Form",
   "Desert Shadows",
   "Urban Pulse",
   "Editorial Photography"
  ]
 },
 "impact-04": {
  n: 8,
  total: 12,
  labels: [
   "Dinners Served",
   "Claire Dubois",
   "Thomas Wentworth",
   "Yuki Tanaka",
   "Marcus Lehmann",
   null,
   null,
   null
  ]
 },
 "impact-05": {
  n: 8,
  total: 19,
  labels: [
   "P99 Global Latency",
   "Security Breaches in 6 Years",
   "Official SDK Languages",
   "Official SDK Languages",
   "David Kim",
   "Elena Ruiz",
   "Marcus Lin",
   "Amara Osei"
  ]
 },
 "impact-06": {
  n: 6,
  total: 6,
  labels: [
   "Neural Link V2",
   "Oxy-Flow Serum",
   "Cyber Grid",
   "Bio Lab",
   "Soren Kvist",
   "Emi Nakamura"
  ]
 },
 "impact-07": {
  n: 6,
  total: 6,
  labels: [
   "Aether One",
   "Vortex Amp",
   "Sonic Prism",
   "Audio Studio",
   "Dieter Klaus",
   "Elena Volkov"
  ]
 },
 "impact-08": {
  n: 6,
  total: 6,
  labels: [
   "Tyrant GT",
   "Apex EVO",
   "Stratos E",
   "Material",
   "Interior",
   "Aerodynamics tunnel"
  ]
 },
 "impact-09": {
  n: 6,
  total: 6,
  labels: [
   "Lunar Descent",
   "Orbital Halo",
   "Mars Catalyst",
   "Starship",
   "Telemetry HUD",
   "Space helmet"
  ]
 },
 "impact-10": {
  n: 8,
  total: 26,
  labels: [
   "Prestige Room",
   "Deluxe Suite",
   "Grand Suite",
   "Espace Étoile",
   "Espace Étoile",
   "Bar Lumière",
   null,
   null
  ]
 },
 "impact-100": {
  n: 4,
  total: 4,
  labels: [
   "The Obsidian Loft",
   "Lumière Office HQ",
   "Aura Boutique Hotel",
   "Architectural Minimal"
  ]
 },
 "impact-103": {
  n: 5,
  total: 5,
  labels: [
   "Regulatory Affairs",
   "Julian Thorne",
   "Elena Rossi",
   "Law Office",
   "Legal Gavel"
  ]
 },
 "impact-104": {
  n: 1,
  total: 1,
  labels: [
   "Cérémonie de mariage"
  ]
 },
 "impact-105": {
  n: 2,
  total: 2,
  labels: [
   "Atelier Bloom fleuriste Strasbourg",
   "Fleurs saisonnières artisanales"
  ]
 },
 "impact-106": {
  n: 8,
  total: 8,
  labels: [
   "Flux Identity",
   "Prism Launch",
   "Ember Editorial",
   "Studio",
   "Mia Versa",
   "Mia Versa",
   "Theo Nakamura",
   "Sasha Okafor"
  ]
 },
 "impact-107": {
  n: 5,
  total: 5,
  labels: [
   "Karakoram Traverse",
   "Svalbard Polar",
   "Namib Desert Crossing",
   "Mountains",
   "CTA"
  ]
 },
 "impact-108": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   "Expert-comptable Bordeaux"
  ]
 },
 "impact-109": {
  n: 3,
  total: 3,
  labels: [
   "A1 Monitor",
   "A1 Monitor",
   "Aether Tube"
  ]
 },
 "impact-110": {
  n: 4,
  total: 4,
  labels: [
   "Spa Background",
   "Relaxation Area",
   "Relaxation Area",
   "Botanical oils"
  ]
 },
 "impact-111": {
  n: 4,
  total: 4,
  labels: [
   "Stone House",
   "Stone House",
   "Cedar Pavilion",
   "Clay Studio"
  ]
 },
 "impact-114": {
  n: 8,
  total: 12,
  labels: [
   "Forêts Primaires",
   "Sommets Alpins",
   "Océans Profonds",
   "Déserts Dorés",
   "Arctique Bleu",
   "Forêts Primaires",
   "Sommets Alpins",
   "Océans Profonds"
  ]
 },
 "impact-115": {
  n: 7,
  total: 7,
  labels: [
   "Verdant Canopy",
   "The Glass House",
   "Moss Pavilion",
   "Bamboo Node",
   "Tonnes CO₂ sequestered",
   "Kenji Watanabe",
   null
  ]
 },
 "impact-116": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   "Showreel"
  ]
 },
 "impact-117": {
  n: 2,
  total: 2,
  labels: [
   "V1 Courier",
   "V2 Hauler"
  ]
 },
 "impact-118": {
  n: 3,
  total: 3,
  labels: [
   "Horology One",
   "Deep Sea",
   "Chronos Watch"
  ]
 },
 // Son unique image est le logo du client, pas une photographie : ce thème SaaS
 // n'a aucun emplacement où poser une photo d'entreprise.
 "impact-119": {
  n: 0,
  total: 0,
  labels: []
 },
 "impact-12": {
  n: 8,
  total: 16,
  labels: [
   "Monochrome",
   "Monochrome",
   "Silences et structures",
   "Noir absolu, texture absolue",
   "Noir absolu, texture absolue",
   "Manteau Asymétrique",
   "Manteau Asymétrique",
   null
  ]
 },
 "impact-120": {
  n: 2,
  total: 2,
  labels: [
   null,
   null
  ]
 },
 "impact-121": {
  n: 8,
  total: 9,
  labels: [
   null,
   null,
   null,
   "Art Direction",
   "Detail Obsession",
   "Elias Valenti",
   "Sarah Chen",
   "Marcus Thorne"
  ]
 },
 "impact-122": {
  n: 4,
  total: 4,
  labels: [
   "When Machines Dream: The End of Human Art?",
   "The Deep Sea Mining Rush",
   "Architecture",
   null
  ]
 },
 "impact-123": {
  n: 6,
  total: 6,
  labels: [
   "V1 Prototype",
   "V1 Prototype",
   "Iron Lung S",
   "Hypercar Detail",
   "Track",
   null
  ]
 },
 "impact-124": {
  n: 4,
  total: 4,
  labels: [
   "Motion Engineering",
   "Neon Genesis",
   "Aether Protocol",
   "Void Analytics"
  ]
 },
 "impact-125": {
  n: 4,
  total: 4,
  labels: [
   "Atlas Heavy",
   "Atlas Heavy",
   "Nebula One",
   null
  ]
 },
 "impact-126": {
  n: 3,
  total: 3,
  labels: [
   "Portrait",
   null,
   null
  ]
 },
 "impact-127": {
  n: 8,
  total: 10,
  labels: [
   "NEON PULSE",
   "MIDNIGHT CRESCENDO",
   "BASS COMMUNION",
   "AURORA SESSIONS",
   "Concert",
   "Nova Collective",
   "Nova Collective",
   "The Archivists"
  ]
 },
 "impact-128": {
  n: 6,
  total: 6,
  labels: [
   "The Belvedere Penthouse",
   "Château des Vignes",
   "Marina Bay Residence",
   "Hampstead Manor",
   "Estate",
   "CTA"
  ]
 },
 "impact-13": {
  n: 5,
  total: 5,
  labels: [
   "Atelier Mécanique — Horlogerie de prestige",
   null,
   "Savoir-faire horloger",
   null,
   null
  ]
 },
 "impact-130": {
  n: 8,
  total: 9,
  labels: [
   "Altitude Collective",
   "Helix Pharma",
   "Quartier Libre",
   "Novae Cosmetics",
   "Swiss Rail Heritage",
   "Brand Identity",
   "Brand Identity",
   "Brand Identity"
  ]
 },
 "impact-131": {
  n: 4,
  total: 4,
  labels: [
   "Cuvée Prestige",
   "Cuvée Prestige",
   "Cuvée Réserve",
   "Jean-Pierre Valroc"
  ]
 },
 "impact-132": {
  n: 8,
  total: 10,
  labels: [
   null,
   null,
   null,
   "Democracy",
   "Private Equity",
   null,
   "Inside the Race to Build Carbon-Negative Steel",
   "Inside the Race to Build Carbon-Negative Steel"
  ]
 },
 "impact-134": {
  n: 4,
  total: 4,
  labels: [
   "Lumière Beauty — Soins premium",
   null,
   "Rituel beauté Lumière",
   "Atelier Lumière Beauty"
  ]
 },
 "impact-136": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   "Digital Platforms",
   "Abstract background",
   "Founder"
  ]
 },
 "impact-137": {
  n: 6,
  total: 6,
  labels: [
   "Ethiopian Yirgacheffe",
   "Colombian Huila",
   "Kenyan Nyeri AA",
   "Guatemala Antigua",
   "Coffee",
   "CTA"
  ]
 },
 "impact-138": {
  n: 2,
  total: 2,
  labels: [
   "Opticien Vision Claire Nantes",
   "Opticien conseil lunettes"
  ]
 },
 "impact-139": {
  n: 5,
  total: 5,
  labels: [
   "FORGE",
   "BLITZ",
   "RECOVER",
   "Gym",
   "CTA"
  ]
 },
 "impact-14": {
  n: 8,
  total: 12,
  labels: [
   "M/Y Lumière",
   "M/Y Étoile",
   "M/Y Odyssey",
   "S/Y Chronos",
   "Monaco & French Riviera",
   "Santorini & Cyclades",
   "Maldives Atolls",
   "St. Barts & Grenadines"
  ]
 },
 "impact-140": {
  n: 5,
  total: 5,
  labels: [
   "Namib Desert",
   "Atacama Plateau",
   "Cappadocia",
   "Wadi Rum",
   "Safari"
  ]
 },
 "impact-141": {
  n: 6,
  total: 6,
  labels: [
   "Neon Genesis",
   "Midnight Drive",
   "Cybernetic Heart",
   "Artist",
   "Artist",
   "Artist"
  ]
 },
 "impact-142": {
  n: 6,
  total: 6,
  labels: [
   "Waste Diverted",
   "Ocean Cleanup",
   "Clean Energy",
   "Forest",
   "CTA",
   "Sustainability work"
  ]
 },
 "impact-143": {
  n: 6,
  total: 6,
  labels: [
   "Villa Serena",
   "Villa Serena",
   "Maison Noire",
   "Interior",
   "CTA",
   "Atelier workspace"
  ]
 },
 "impact-144": {
  n: 7,
  total: 7,
  labels: [
   "Neon Drift",
   "Neon Drift",
   "Apex Protocol",
   "Silk Thread",
   "Aki Sato",
   "Aki Sato",
   "Leo Croft"
  ]
 },
 "impact-145": {
  n: 4,
  total: 4,
  labels: [
   "The Obsidian Penthouse",
   "The Obsidian Penthouse",
   "Azure Cliff Villa",
   "Luxury Property"
  ]
 },
 "impact-146": {
  n: 5,
  total: 5,
  labels: [
   "Chef Hands",
   "Sushi Close-up",
   null,
   null,
   "Chef"
  ]
 },
 "impact-147": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   null
  ]
 },
 "impact-148": {
  n: 4,
  total: 4,
  labels: [
   "Glitch Angel",
   "Glitch Angel",
   "Neo Tokyo",
   null
  ]
 },
 "impact-149": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   "Spa Detail"
  ]
 },
 "impact-15": {
  n: 2,
  total: 2,
  labels: [
   "Piscine sur-mesure",
   "Pisciniste certifié Toulouse"
  ]
 },
 "impact-151": {
  n: 2,
  total: 2,
  labels: [
   "The Crimson Sovereign",
   "Morning Mist over Vineyards"
  ]
 },
 "impact-152": {
  n: 6,
  total: 6,
  labels: [
   "Projets livrés",
   "Penthouse panoramique",
   "Maison de maître",
   "Loft industriel",
   "Boutique concept store",
   "Intérieur Studio Noma"
  ]
 },
 "impact-154": {
  n: 8,
  total: 11,
  labels: [
   "The Renaissance Veil",
   "Gilded Manuscripts",
   "The Obsidian Triptych",
   "Veduta of the Lost City",
   "Reliquary of the Silent Order",
   null,
   "Sous la surface : l",
   null
  ]
 },
 "impact-155": {
  n: 6,
  total: 6,
  labels: [
   "Satisfaction clients",
   "Penthouse vue Eiffel",
   "Villa contemporaine",
   "Loft design",
   "Résidence Belle Époque",
   "Immobilier de prestige Pierre & Co"
  ]
 },
 "impact-156": {
  n: 2,
  total: 2,
  labels: [
   "Lumière Yoga Studio Bordeaux",
   "Pratique yoga Lumière Studio"
  ]
 },
 "impact-157": {
  n: 7,
  total: 7,
  labels: [
   "Éternité",
   "Soleil d",
   "Lumière",
   "Héritage",
   "Prestige",
   null,
   null
  ]
 },
 "impact-158": {
  n: 8,
  total: 14,
  labels: [
   "Kyoto en automne : l",
   "Les gorges du Todra à l",
   "Machu Picchu avant l",
   "Machu Picchu avant l",
   null,
   "Japon",
   "Japon",
   "Japon"
  ]
 },
 "impact-16": {
  n: 8,
  total: 8,
  labels: [
   "La Lumière de Minuit",
   "La Lumière de Minuit",
   "Couture Invisible",
   "Mémoire des Rues",
   "Béton & Lumière",
   "Femme en Avant",
   "Obscura Photography",
   "Elena Korr Obscura"
  ]
 },
 "impact-160": {
  n: 2,
  total: 2,
  labels: [
   null,
   "Server Room Corridor"
  ]
 },
 "impact-162": {
  n: 8,
  total: 10,
  labels: [
   "Le Matin Doré",
   "Notre histoire",
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-163": {
  n: 1,
  total: 1,
  labels: [
   null
  ]
 },
 "impact-166": {
  n: 3,
  total: 3,
  labels: [
   null,
   "Iris Studio hero",
   "Iris Beaumont"
  ]
 },
 "impact-167": {
  n: 5,
  total: 5,
  labels: [
   "Appartement Haussmannien",
   "Trocadéro, XVIe",
   "Marais, IVe",
   "Saint-Germain",
   "Île Saint-Louis"
  ]
 },
 "impact-17": {
  n: 7,
  total: 7,
  labels: [
   "La Maison du Vent",
   "Pavillon Zénith",
   "Ateliers Kéops",
   "Villa Terracotta",
   "Cour des Arts",
   "Kéops Architecture",
   "Kéops Agence"
  ]
 },
 "impact-171": {
  n: 6,
  total: 6,
  labels: [
   "Dr. Claire Fontaine",
   "Dr. Marc Leclerc",
   "Dr. Sophie Renard",
   "Dr. Antoine Moreau",
   "Cabinet médical",
   null
  ]
 },
 "impact-172": {
  n: 6,
  total: 6,
  labels: [
   "Philippe Legrand",
   "Philippe Legrand",
   "Marie-Sophie Renault",
   "Thomas Vigneron",
   "Palais de justice",
   "Cabinet Legrand"
  ]
 },
 "impact-174": {
  n: 4,
  total: 4,
  labels: [
   "Alexis Romain",
   "Sofia Marchetti",
   "Kenji Watanabe",
   "FORGE athlete"
  ]
 },
 "impact-175": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   null
  ]
 },
 "impact-176": {
  n: 1,
  total: 1,
  labels: [
   "Analytics dashboard"
  ]
 },
 "impact-177": {
  n: 4,
  total: 4,
  labels: [
   "Piscine miroir Presqu",
   "Villa Les Pins",
   "Couloir de nage Croix-Rousse",
   "Piscine sur-mesure"
  ]
 },
 "impact-178": {
  n: 5,
  total: 5,
  labels: [
   "Haussmannien d",
   "Villa contemporaine à toit-terrasse",
   "Duplex vue panoramique",
   "Immobilier prestige Paris",
   "Bien immobilier prestige"
  ]
 },
 "impact-179": {
  n: 4,
  total: 4,
  labels: [
   "Devis gratuit sous 48h",
   "Piscine miroir 10×4 m · Villa",
   "Rénovation liner & margelles",
   "Piscine sur-mesure"
  ]
 },
 "impact-180": {
  n: 1,
  total: 1,
  labels: [
   "Chauffagiste intervention chaudière"
  ]
 },
 "impact-181": {
  n: 4,
  total: 4,
  labels: [
   "Entretien & hivernage",
   "Piscine béton 9×4 m · Villa",
   "Rénovation liner & plage",
   "Piscine sur-mesure"
  ]
 },
 "impact-182": {
  n: 3,
  total: 3,
  labels: [
   "Extension 45 m² · Villa provençale",
   "Extension 45 m² · Villa provençale",
   "Maçon construction gros œuvre"
  ]
 },
 "impact-183": {
  n: 1,
  total: 1,
  labels: [
   "Piscine sur-mesure"
  ]
 },
 "impact-184": {
  n: 1,
  total: 1,
  labels: [
   "Nettoyage professionnel intérieur"
  ]
 },
 "impact-185": {
  n: 2,
  total: 2,
  labels: [
   "Barbier rasage traditionnel",
   "Intérieur barbier vintage"
  ]
 },
 "impact-186": {
  n: 1,
  total: 1,
  labels: [
   "Cabinet dentaire moderne lumineux"
  ]
 },
 "impact-187": {
  n: 1,
  total: 1,
  labels: [
   "Coach sportif entraînement intense"
  ]
 },
 "impact-188": {
  n: 1,
  total: 1,
  labels: [
   "Vétérinaire avec animal"
  ]
 },
 "impact-189": {
  n: 6,
  total: 6,
  labels: [
   "Salon de coiffure élégant",
   "Coiffure femme",
   "Coiffure femme",
   "Couleur cheveux",
   "Couleur cheveux",
   "Balayage"
  ]
 },
 "impact-19": {
  n: 1,
  total: 1,
  labels: [
   null
  ]
 },
 "impact-190": {
  n: 1,
  total: 1,
  labels: [
   "Garage automobile moderne"
  ]
 },
 "impact-191": {
  n: 4,
  total: 4,
  labels: [
   "Jardin paysagé luxuriant",
   "Jardin créé",
   "Jardin créé",
   "Potager"
  ]
 },
 "impact-192": {
  n: 1,
  total: 1,
  labels: [
   "Serrurier professionnel sécurité"
  ]
 },
 "impact-193": {
  n: 2,
  total: 2,
  labels: [
   "Traitement ostéopathique manuel",
   "Cabinet ostéopathie"
  ]
 },
 "impact-194": {
  n: 1,
  total: 1,
  labels: [
   "Table gastronomique traiteur"
  ]
 },
 "impact-195": {
  n: 6,
  total: 6,
  labels: [
   "Mariage élégant décoration florale",
   "Mariage",
   "Mariage",
   "Décoration florale",
   "Décoration florale",
   "Couple"
  ]
 },
 "impact-196": {
  n: 2,
  total: 2,
  labels: [
   "Cabinet kiné Mouvement Nantes",
   "Rééducation cabinet kiné"
  ]
 },
 "impact-197": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   null
  ]
 },
 "impact-198": {
  n: 3,
  total: 3,
  labels: [
   null,
   "Lumière Beauty salon",
   null
  ]
 },
 "impact-199": {
  n: 8,
  total: 14,
  labels: [
   "Traditional",
   "Japanese",
   "Blackwork",
   "Neo-Traditional",
   "Geometric",
   "Théo Marck",
   "Léa Sorel",
   "Serpent Tribal"
  ]
 },
 "impact-20": {
  n: 6,
  total: 6,
  labels: [
   "Solitaire Éternité",
   "La pureté absolue",
   "Lumière sur la peau",
   "Un fleuve de lumière",
   "La grâce à l",
   "Héritage gravé"
  ]
 },
 "impact-200": {
  n: 8,
  total: 10,
  labels: [
   "Coordination Complète",
   "Décoration Florale",
   "Animation Musicale",
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-201": {
  n: 3,
  total: 3,
  labels: [
   null,
   "Gastronomie",
   "Chef Antoine Lefèvre"
  ]
 },
 "impact-208": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-21": {
  n: 6,
  total: 6,
  labels: [
   "Capsule Pro",
   "Capsule Pro",
   "HaloKit",
   "Bloom Series",
   "Bloom Series",
   null
  ]
 },
 "impact-217": {
  n: 2,
  total: 2,
  labels: [
   null,
   null
  ]
 },
 "impact-218": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-219": {
  n: 1,
  total: 1,
  labels: [
   "Sophie Laurent"
  ]
 },
 "impact-220": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-221": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-222": {
  n: 8,
  total: 8,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-223": {
  n: 5,
  total: 5,
  labels: [
   "Chantiers neufs & rénovation",
   "Villa contemporaine · 280 m²",
   "Immeuble 12 logements · Bordeaux",
   "Électricien au travail sur tableau électrique",
   "Câblage électrique moderne"
  ]
 },
 "impact-226": {
  n: 2,
  total: 2,
  labels: [
   "Studio tatouage Encre Noire Paris",
   "Artiste tatoueur au travail"
  ]
 },
 "impact-227": {
  n: 2,
  total: 2,
  labels: [
   "Le Barber Club Lyon",
   "Barbier rasage traditionnel"
  ]
 },
 "impact-228": {
  n: 2,
  total: 2,
  labels: [
   "Plombier chauffagiste AquaTherm Lille",
   "Artisan plombier certifié"
  ]
 },
 "impact-229": {
  n: 2,
  total: 2,
  labels: [
   "Institut spa Éclat Nice",
   "Soin visage naturel"
  ]
 },
 "impact-23": {
  n: 8,
  total: 11,
  labels: [
   "Les Heures Perdues",
   "Poussière de Lumière",
   "Poussière de Lumière",
   "Fragments",
   "Fragments",
   null,
   "Écriture",
   "Tournage"
  ]
 },
 "impact-230": {
  n: 2,
  total: 2,
  labels: [
   "Atelier menuisier ébéniste Bordeaux",
   "Atelier bois massif artisan"
  ]
 },
 "impact-231": {
  n: 2,
  total: 2,
  labels: [
   "Diététicienne nutritionniste Lyon",
   "Consultation diététique personnalisée"
  ]
 },
 "impact-232": {
  n: 2,
  total: 2,
  labels: [
   "Paysagiste jardinier Bordeaux",
   "Jardinier éco-responsable Bordeaux"
  ]
 },
 "impact-233": {
  n: 2,
  total: 2,
  labels: [
   "Cabinet ostéopathie Lyon",
   "Séance ostéopathie cabinet"
  ]
 },
 "impact-235": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-236": {
  n: 2,
  total: 2,
  labels: [
   "INSTALLATION ÉLECTRIQUE",
   "DOMOTIQUE & SMART HOME"
  ]
 },
 "impact-237": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-238": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-239": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-24": {
  n: 8,
  total: 11,
  labels: [
   "Flux AI",
   "Flux AI",
   "Vanta Pay",
   "NeuraStack",
   "Clio Health",
   "Arco Climate",
   "Forma Studio",
   "Sarah Chen"
  ]
 },
 "impact-240": {
  n: 5,
  total: 5,
  labels: [
   "COACHING PRIVÉ",
   "COACHING PRIVÉ",
   "Coaching privé",
   "Stage intensif",
   "Séance de coaching au Studio Athletic Lyon 6e"
  ]
 },
 "impact-241": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-242": {
  n: 5,
  total: 5,
  labels: [
   "COMPTABILITÉ & FISCALITÉ",
   "Tenue comptable",
   "Cabinet expert-comptable Marchand & Partners Nantes",
   null,
   "Cabinet Marchand & Partners — expertise et proximité"
  ]
 },
 "impact-243": {
  n: 2,
  total: 2,
  labels: [
   "Consultation générale",
   null
  ]
 },
 "impact-244": {
  n: 7,
  total: 7,
  labels: [
   null,
   "CÉRÉMONIE",
   "RÉCEPTION",
   "Cérémonie de mariage romantique fleurie",
   null,
   "Bouquet de mariée artisanal",
   "Image de présentation"
  ]
 },
 "impact-245": {
  n: 3,
  total: 3,
  labels: [
   null,
   "LA PÂTE",
   "LA CUISSON"
  ]
 },
 "impact-246": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-247": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-248": {
  n: 5,
  total: 5,
  labels: [
   "STRUCTURE",
   "VISCÉRAL",
   "CRÂNIEN",
   "Camille & Thomas B.",
   "Ostéopathie crânienne — soin délicat sur le crâne"
  ]
 },
 "impact-249": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   "ROMAIN",
   null
  ]
 },
 "impact-25": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   "Agence web Pixel Republic Paris",
   "Equipe Pixel Republic"
  ]
 },
 "impact-250": {
  n: 7,
  total: 7,
  labels: [
   null,
   "CONCEPTION",
   "CONCEPTION",
   "Éclairage extérieur",
   null,
   "Jardin formel conçu par Atelier Terra à Nantes",
   "Image de présentation"
  ]
 },
 "impact-251": {
  n: 3,
  total: 3,
  labels: [
   null,
   "LA CÉRÉMONIE",
   "LA CÉRÉMONIE"
  ]
 },
 "impact-252": {
  n: 4,
  total: 4,
  labels: [
   "SOINS CONSERVATEURS",
   "SOINS CONSERVATEURS",
   "ESTHÉTIQUE",
   "Antoine M."
  ]
 },
 "impact-253": {
  n: 6,
  total: 6,
  labels: [
   "BLESSURES SPORTIVES",
   "POST-OPÉRATOIRE",
   "PERFORMANCE",
   "Yasmine B.",
   "Kinésithérapeute du sport au travail",
   "Rééducation sportive — méthode KinéSport Élite"
  ]
 },
 "impact-254": {
  n: 1,
  total: 1,
  labels: [
   null
  ]
 },
 "impact-255": {
  n: 3,
  total: 3,
  labels: [
   null,
   "Cabinet d",
   "Maître Voss — Tribunal de Commerce de Toulouse"
  ]
 },
 "impact-256": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-257": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-258": {
  n: 7,
  total: 7,
  labels: [
   null,
   "ROBES DE SOIRÉE",
   "ROBES DE SOIRÉE",
   "MARIÉES",
   "Détail de couture — Maison Solal Marseille",
   null,
   "Image de présentation"
  ]
 },
 "impact-259": {
  n: 8,
  total: 10,
  labels: [
   "LES PAINS",
   "LA PÂTISSERIE",
   "LE CAFÉ",
   "Commandes traiteur",
   null,
   "Thomas K.",
   "Fournil du Parlement — pains au levain en boulangerie artisanale",
   null
  ]
 },
 "impact-26": {
  n: 5,
  total: 5,
  labels: [
   "Nuit Absolue",
   "Aube Dorée",
   "Lumière Claire",
   "Éther Parfums",
   "Atelier Éther"
  ]
 },
 "impact-260": {
  n: 4,
  total: 4,
  labels: [
   null,
   "PLOMBERIE",
   "PLOMBERIE",
   "Technicien certifié RGE Aqua Confort Lyon"
  ]
 },
 "impact-261": {
  n: 1,
  total: 1,
  labels: [
   "COMPTABILITÉ & PAIE"
  ]
 },
 "impact-262": {
  n: 7,
  total: 7,
  labels: [
   null,
   "ILLUSTRATION",
   "NEO-TRADITIONNEL",
   "BOTANICA & GRAVURE",
   "Studio Noir Absolu — Fine Art Tattoo Paris 3e",
   "Hygiène et protocoles — Studio Noir Absolu",
   "Image de présentation"
  ]
 },
 "impact-263": {
  n: 6,
  total: 6,
  labels: [
   "JARDINS PRIVATIFS",
   "Jardins d\\",
   null,
   "Jardin paysager réalisé par Jardins Vivants à Bordeaux",
   null,
   "Jardin écologique conçu selon les principes de la permaculture"
  ]
 },
 "impact-264": {
  n: 7,
  total: 7,
  labels: [
   null,
   "MUSCULO-SQUELETTIQUE",
   "MUSCULO-SQUELETTIQUE",
   "VISCÉRAL & FONCTIONNEL",
   "Cabinet Ostéo Atlantique — salle de soin lumineuse",
   "Soin ostéopathique doux — Ostéo Atlantique",
   "Image de présentation"
  ]
 },
 "impact-265": {
  n: 7,
  total: 7,
  labels: [
   null,
   "SOIE & ORGANZA",
   "BRODERIE MAIN",
   "SCÈNE & SPECTACLE",
   "Atelier de couture soie naturelle Lyon",
   "Atelier L",
   "Image de présentation"
  ]
 },
 "impact-266": {
  n: 5,
  total: 5,
  labels: [
   null,
   "VILLA PRIVÉE",
   "VILLA PRIVÉE",
   "Honeymoon & transfers",
   "Planning de mariage Côte d"
  ]
 },
 "impact-267": {
  n: 8,
  total: 9,
  labels: [
   "GÉOMÉTRIQUE",
   "GÉOMÉTRIQUE",
   "VÉGÉTAL & BOTANIQUE",
   "PORTRAITURE",
   "ELENA",
   "ELENA",
   "LUCAS",
   "Artiste en train de tatouer un motif géométrique"
  ]
 },
 "impact-268": {
  n: 4,
  total: 4,
  labels: [
   null,
   "JARDINS CONTEMPORAINS",
   "JARDINS CONTEMPORAINS",
   "Jardin contemporain Vert Horizon Île-de-France"
  ]
 },
 "impact-269": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   "Canelé bordelais",
   "Thomas Lefranc",
   "Devanture de la Boulangerie des Chartrons à Bordeaux",
   "Pains artisanaux en cuisson au four à sole"
  ]
 },
 "impact-27": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   "Three.js"
  ]
 },
 "impact-270": {
  n: 4,
  total: 4,
  labels: [
   null,
   "NATURE & PLUMES",
   "NATURE & PLUMES",
   "SURRÉALISME"
  ]
 },
 "impact-271": {
  n: 8,
  total: 9,
  labels: [
   null,
   "JARDINS ALSACIENS",
   "JARDINS ALSACIENS",
   "Arrosage automatique",
   null,
   "Jardin alsacien fleuri par Jardins d",
   null,
   "Jardin alsacien en automne"
  ]
 },
 "impact-272": {
  n: 8,
  total: 8,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-273": {
  n: 8,
  total: 8,
  labels: [
   "SOINS PRÉVENTIFS",
   "SOINS PRÉVENTIFS",
   "DENTISTERIE ESTHÉTIQUE",
   "Orthodontie invisible",
   null,
   "Cabinet dentaire Rosenfeld Strasbourg",
   null,
   "Technologies de pointe Cabinet Rosenfeld"
  ]
 },
 "impact-274": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-275": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-276": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-277": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-278": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-279": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-28": {
  n: 7,
  total: 7,
  labels: [
   "Brutco Architecture",
   "Brutco studio",
   "Concrete",
   "Concrete",
   "Structure",
   "Project",
   "CTA architecture"
  ]
 },
 "impact-280": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-281": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-282": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-283": {
  n: 8,
  total: 8,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-284": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-285": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-286": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-287": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-288": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-289": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-29": {
  n: 6,
  total: 6,
  labels: [
   "Code",
   "Code",
   "Terminal",
   "vaultkey",
   "noctua.dev",
   "axon-query"
  ]
 },
 "impact-290": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-291": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-292": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-293": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-294": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-295": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-296": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-297": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-298": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-299": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-30": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   null
  ]
 },
 "impact-300": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-301": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-302": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-303": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-304": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-305": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-306": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-307": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-308": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-309": {
  n: 6,
  total: 6,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-310": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-311": {
  n: 8,
  total: 9,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-312": {
  n: 8,
  total: 18,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-313": {
  n: 8,
  total: 11,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-314": {
  n: 8,
  total: 9,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-315": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-316": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-317": {
  n: 8,
  total: 9,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-318": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-319": {
  n: 8,
  total: 8,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-321": {
  n: 8,
  total: 12,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-322": {
  n: 8,
  total: 11,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-324": {
  n: 8,
  total: 9,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-325": {
  n: 8,
  total: 8,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-326": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   "Immobilier",
   "Notaire associé de l"
  ]
 },
 "impact-327": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   "Cuisine sur mesure"
  ]
 },
 "impact-328": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   "Organisation d",
   "Horizon paisible au petit matin"
  ]
 },
 "impact-331": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   null
  ]
 },
 "impact-332": {
  n: 1,
  total: 1,
  labels: [
   "Serrure de porte en gros plan"
  ]
 },
 "impact-333": {
  n: 1,
  total: 1,
  labels: [
   "Signature d"
  ]
 },
 "impact-334": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   null
  ]
 },
 "impact-335": {
  n: 2,
  total: 2,
  labels: [
   "Lys blancs déposés sur la pierre",
   "Horizon marin au matin"
  ]
 },
 "impact-336": {
  n: 1,
  total: 1,
  labels: [
   "Comptoir de la pharmacie"
  ]
 },
 "impact-337": {
  n: 1,
  total: 1,
  labels: [
   "Rendez-vous conseil avec un client"
  ]
 },
 "impact-338": {
  n: 1,
  total: 1,
  labels: [
   "Poignée de main en fin de rendez-vous"
  ]
 },
 "impact-339": {
  n: 1,
  total: 1,
  labels: [
   "Examen de l"
  ]
 },
 "impact-340": {
  n: 1,
  total: 1,
  labels: [
   "Réglage d"
  ]
 },
 "impact-341": {
  n: 1,
  total: 1,
  labels: [
   "Véhicule d"
  ]
 },
 "impact-342": {
  n: 1,
  total: 1,
  labels: [
   "Élève au volant en conduite urbaine"
  ]
 },
 "impact-343": {
  n: 1,
  total: 1,
  labels: [
   "Atelier de pressing en activité"
  ]
 },
 "impact-344": {
  n: 1,
  total: 1,
  labels: [
   "Linge plié à la main"
  ]
 },
 "impact-345": {
  n: 1,
  total: 1,
  labels: [
   "Vitrine de la boucherie"
  ]
 },
 "impact-346": {
  n: 1,
  total: 1,
  labels: [
   "Comptoir de la fromagerie"
  ]
 },
 "impact-347": {
  n: 1,
  total: 1,
  labels: [
   "Session de formation en salle"
  ]
 },
 "impact-348": {
  n: 1,
  total: 1,
  labels: [
   "Travaux pratiques en atelier"
  ]
 },
 "impact-349": {
  n: 1,
  total: 1,
  labels: [
   "Véhicule sur le pont de contrôle"
  ]
 },
 "impact-350": {
  n: 1,
  total: 1,
  labels: [
   "Inspection sous le véhicule"
  ]
 },
 "impact-351": {
  n: 1,
  total: 1,
  labels: [
   "Couvreurs sur une toiture"
  ]
 },
 "impact-352": {
  n: 1,
  total: 1,
  labels: [
   "Flèche en ardoise restaurée"
  ]
 },
 "impact-353": {
  n: 1,
  total: 1,
  labels: [
   "Temps de jeu à la micro-crèche"
  ]
 },
 "impact-354": {
  n: 1,
  total: 1,
  labels: [
   "Lecture partagée avec un enfant"
  ]
 },
 "impact-355": {
  n: 1,
  total: 1,
  labels: [
   "Soins à domicile auprès d"
  ]
 },
 "impact-356": {
  n: 1,
  total: 1,
  labels: [
   "Visite infirmière au domicile"
  ]
 },
 "impact-357": {
  n: 1,
  total: 1,
  labels: [
   "Technicienne au laboratoire"
  ]
 },
 "impact-358": {
  n: 1,
  total: 1,
  labels: [
   "Tubes de prélèvement au laboratoire"
  ]
 },
 "impact-359": {
  n: 1,
  total: 1,
  labels: [
   "Grue mobile disponible à la location"
  ]
 },
 "impact-360": {
  n: 1,
  total: 1,
  labels: [
   "Chapiteau dressé pour une réception"
  ]
 },
 "impact-361": {
  n: 1,
  total: 1,
  labels: [
   "Application du rouleau sur le mur"
  ]
 },
 "impact-362": {
  n: 1,
  total: 1,
  labels: [
   "Duo de peintres en chantier"
  ]
 },
 "impact-363": {
  n: 1,
  total: 1,
  labels: [
   "Soin de pédicurie au cabinet"
  ]
 },
 "impact-364": {
  n: 1,
  total: 1,
  labels: [
   "Séance de soin du pied"
  ]
 },
 "impact-365": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   null
  ]
 },
 "impact-366": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   "Les rangs du potager en été"
  ]
 },
 "impact-367": {
  n: 1,
  total: 1,
  labels: [
   "Consultation de suivi de grossesse"
  ]
 },
 "impact-368": {
  n: 1,
  total: 1,
  labels: [
   "Échographie de contrôle"
  ]
 },
 "impact-369": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   "Cérémonie dans le parc du domaine"
  ]
 },
 "impact-37": {
  n: 5,
  total: 5,
  labels: [
   "Clos Ardent",
   "Pierre Blanche",
   "Nuit Rousse",
   "Vent d",
   "Dernière Heure"
  ]
 },
 "impact-370": {
  n: 4,
  total: 4,
  labels: [
   null,
   null,
   null,
   "Le studio attenant de la halle"
  ]
 },
 "impact-371": {
  n: 1,
  total: 1,
  labels: [
   "Agent de sécurité en poste"
  ]
 },
 "impact-372": {
  n: 1,
  total: 1,
  labels: [
   "Ronde de surveillance devant un commerce"
  ]
 },
 "impact-373": {
  n: 1,
  total: 1,
  labels: [
   "Chauffeur et berline à la prise en charge"
  ]
 },
 "impact-374": {
  n: 1,
  total: 1,
  labels: [
   "Habitacle prêt pour la course"
  ]
 },
 "impact-375": {
  n: 1,
  total: 1,
  labels: [
   "Pose d"
  ]
 },
 "impact-376": {
  n: 1,
  total: 1,
  labels: [
   "Paroi de verre sur mesure"
  ]
 },
 "impact-377": {
  n: 1,
  total: 1,
  labels: [
   "Cours de piano en duo"
  ]
 },
 "impact-378": {
  n: 1,
  total: 1,
  labels: [
   "Étude de portefeuille avec le client"
  ]
 },
 "impact-379": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   null
  ]
 },
 "impact-380": {
  n: 1,
  total: 1,
  labels: [
   "Brasseur devant les cuves"
  ]
 },
 "impact-381": {
  n: 1,
  total: 1,
  labels: [
   "Cave du caviste"
  ]
 },
 "impact-382": {
  n: 1,
  total: 1,
  labels: [
   "Entretien de recrutement"
  ]
 },
 "impact-383": {
  n: 1,
  total: 1,
  labels: [
   "Toilettage sur table"
  ]
 },
 "impact-43": {
  n: 2,
  total: 2,
  labels: [
   "Serene spa landscape",
   "Thermal circuit"
  ]
 },
 "impact-45": {
  n: 8,
  total: 10,
  labels: [
   null,
   null,
   null,
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-46": {
  n: 5,
  total: 5,
  labels: [
   null,
   null,
   null,
   null,
   null
  ]
 },
 "impact-47": {
  n: 3,
  total: 3,
  labels: [
   "Jardin de Printemps",
   "Jardin de Printemps",
   "Blossom Drift"
  ]
 },
 "impact-50": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   "Psychologue bienveillante"
  ]
 },
 "impact-55": {
  n: 2,
  total: 2,
  labels: [
   "Cabinet avocat Maître Renard Paris",
   "Cabinet juridique Paris"
  ]
 },
 "impact-56": {
  n: 2,
  total: 2,
  labels: [
   "Vignoble de Margaux au lever du soleil",
   null
  ]
 },
 "impact-57": {
  n: 1,
  total: 1,
  labels: [
   "MASK_UNIT studio"
  ]
 },
 "impact-59": {
  n: 2,
  total: 2,
  labels: [
   "Wellness Hero",
   "La méthode Luminale — nature et méditation"
  ]
 },
 "impact-60": {
  n: 3,
  total: 3,
  labels: [
   "Watch Macro",
   "Watch Gears",
   "Atelier"
  ]
 },
 "impact-61": {
  n: 4,
  total: 4,
  labels: [
   "Maison C.",
   "Maison C.",
   "Médiathèque Évry",
   "Tour Belvedere"
  ]
 },
 "impact-62": {
  n: 5,
  total: 5,
  labels: [
   "Fine Dining Hero",
   null,
   null,
   null,
   "Table Satori"
  ]
 },
 "impact-65": {
  n: 2,
  total: 2,
  labels: [
   "High Performance Car",
   "Racing Detail"
  ]
 },
 "impact-66": {
  n: 4,
  total: 4,
  labels: [
   "Beauty Hero",
   "Beauty Protocol",
   null,
   "Atelier Detail"
  ]
 },
 "impact-67": {
  n: 4,
  total: 4,
  labels: [
   "Penthouse Trinity",
   "Penthouse Trinity",
   "HQ Montparnasse",
   "Vision Hero"
  ]
 },
 "impact-70": {
  n: 1,
  total: 1,
  labels: [
   "Club Atmosphere"
  ]
 },
 "impact-71": {
  n: 1,
  total: 1,
  labels: [
   "Zen Hero"
  ]
 },
 "impact-73": {
  n: 2,
  total: 2,
  labels: [
   "Conservatoire Accord école de musique Lyon",
   "Cours de musique enfant Lyon"
  ]
 },
 "impact-74": {
  n: 7,
  total: 7,
  labels: [
   null,
   null,
   null,
   null,
   "Déjeuner d",
   "Salle gastronomique Aevia Kitchen",
   "Chef exécutif Aevia Kitchen"
  ]
 },
 "impact-75": {
  n: 8,
  total: 12,
  labels: [
   "Helix Noir",
   "Aurora S",
   "Meridian GMT",
   "Helix Noir",
   "Helix Noir",
   "Aurora S",
   "Meridian GMT",
   "Solstice Blanc"
  ]
 },
 "impact-76": {
  n: 8,
  total: 8,
  labels: [
   "VILLA_AETHER",
   "KINETIC_TOWER",
   "VOID_STUDIO",
   "MERIDIAN_HOUSE",
   "Projets livrés",
   "Naomi Sato",
   "Daan Mulder",
   "Structura Hero"
  ]
 },
 "impact-77": {
  n: 8,
  total: 10,
  labels: [
   "Alpine Meridian",
   "Alpine Meridian",
   "Alpine Meridian",
   "Identity Study I",
   "Glass Tension",
   "Desert Void",
   "Product Noir",
   "Luminance"
  ]
 },
 "impact-78": {
  n: 4,
  total: 4,
  labels: [
   "VOID_BREW",
   "SOLAR_ORIGIN",
   "LUNAR_FREQ",
   "Aether Hero"
  ]
 },
 "impact-79": {
  n: 4,
  total: 4,
  labels: [
   "THE_VOID_LOAF",
   "SOLAR_CROISSANT",
   "NEBULA_TART",
   "Bakery Hero"
  ]
 },
 "impact-80": {
  n: 8,
  total: 8,
  labels: [
   "The Obsidian Villa",
   "Glass Monolith",
   "Serene Heights",
   "Meridian House",
   "RIBA Awards",
   "Mara Solis",
   "Kenji Arao",
   "Architectural Minimal"
  ]
 },
 "impact-81": {
  n: 6,
  total: 6,
  labels: [
   null,
   "Editorial",
   "Les silhouettes de la saison",
   "Les silhouettes de la saison",
   "Le maquillage qui parle le plus",
   "Studio Perrin"
  ]
 },
 "impact-82": {
  n: 8,
  total: 8,
  labels: [
   "Résidence Ithaque",
   "Le Domaine de Chambord",
   "Horizon Business Center",
   "Édouard Marchand",
   "Claire Fontaine",
   "Thomas Renard",
   "Sophie Leroux",
   null
  ]
 },
 "impact-83": {
  n: 7,
  total: 7,
  labels: [
   "Constellation Noir",
   "Constellation Noir",
   "Éclipse Royale",
   "Heritage Tourbillon",
   null,
   null,
   null
  ]
 },
 "impact-84": {
  n: 3,
  total: 3,
  labels: [
   null,
   null,
   "Clinique Cypher"
  ]
 },
 "impact-85": {
  n: 4,
  total: 4,
  labels: [
   "Luminos Sérum",
   "Cellulaire Crème",
   "Photon SPF 50+",
   null
  ]
 },
 "impact-86": {
  n: 8,
  total: 8,
  labels: [
   "Le rituel du soir : ralentir pour mieux dormir",
   "Comprendre les actifs botaniques de votre soin",
   null,
   "Offrir un soin : le cadeau qui prend soin",
   "Aura Wellness sanctuary",
   null,
   "Aura Wellness thermal pools",
   null
  ]
 },
 "impact-87": {
  n: 2,
  total: 2,
  labels: [
   "Salle CrossFit Iron Club Lyon",
   "Entraînement CrossFit"
  ]
 },
 "impact-88": {
  n: 4,
  total: 4,
  labels: [
   "Nail art salon photography",
   null,
   null,
   "Velvet Nails concept"
  ]
 },
 "impact-89": {
  n: 8,
  total: 9,
  labels: [
   "FAQ",
   "Skull Architecture",
   "Portrait Machiné",
   "Americana Eagle",
   "Botanical Fine Line",
   "Neo-Tribal Full Back",
   "Mandala Sternum",
   null
  ]
 },
 "impact-90": {
  n: 3,
  total: 3,
  labels: [
   "Miche au Levain",
   "Pain de Seigle",
   "Brioche Feuilletée"
  ]
 },
 "impact-91": {
  n: 4,
  total: 4,
  labels: [
   "Bijoux Aurelia",
   null,
   "Atelier Aurelia",
   "Localisation Aurelia"
  ]
 },
 "impact-92": {
  n: 5,
  total: 5,
  labels: [
   "The Obsidian Penthouse",
   "Villa L",
   "The Glass Pavilion",
   "Luxury Penthouse",
   "Mountain View"
  ]
 },
 "impact-93": {
  n: 2,
  total: 2,
  labels: [
   "Global 7500",
   "Private Jet"
  ]
 },
 "impact-94": {
  n: 8,
  total: 9,
  labels: [
   "FAQ",
   "Pivoine Atlas",
   "Isabelle de Montblanc",
   "Arnaud Leclercq",
   "Clémentine Faure",
   "Bouquet de fleurs botanica",
   "Atelier Botanica — Art botanique",
   "Atelier Botanica — Savoir-faire artisanal"
  ]
 },
 "impact-95": {
  n: 4,
  total: 4,
  labels: [
   "Dr. Sophie Lemaire",
   "Camille Martin",
   "Camille Martin",
   null
  ]
 },
 "impact-97": {
  n: 3,
  total: 3,
  labels: [
   "Azure Odyssey",
   "Solaris Voyager",
   "Yacht Deck"
  ]
 },
 "impact-98": {
  n: 4,
  total: 4,
  labels: [
   "Astra Chrono",
   "Deep Horizon",
   "Legacy Perpetual",
   "Watch Movement"
  ]
 },
 "impact-99": {
  n: 4,
  total: 4,
  labels: [
   "Dry-Aged Wagyu",
   "Smoked Ember Octopus",
   "The Ember Cellar Selection",
   "Fire & Smoke"
  ]
 },

  /*
    Cinquante-deux thèmes ne portent aucune photographie : ils composent avec
    de la typographie, des aplats et des dégradés. Absents de cette table, ils
    héritaient du réglage par défaut — une photo réclamée au client — qui ne
    s'affichait alors nulle part. Déclarés à zéro, le formulaire cesse de la
    demander et le dit franchement.
  */
  "impact-102": { n: 0, total: 0, labels: [] },
  "impact-11": { n: 0, total: 0, labels: [] },
  "impact-113": { n: 0, total: 0, labels: [] },
  "impact-135": { n: 0, total: 0, labels: [] },
  "impact-153": { n: 0, total: 0, labels: [] },
  "impact-164": { n: 0, total: 0, labels: [] },
  "impact-168": { n: 0, total: 0, labels: [] },
  "impact-212": { n: 0, total: 0, labels: [] },
  "impact-216": { n: 0, total: 0, labels: [] },
  "impact-22": { n: 0, total: 0, labels: [] },
  "impact-31": { n: 0, total: 0, labels: [] },
  "impact-39": { n: 0, total: 0, labels: [] },
  "impact-51": { n: 0, total: 0, labels: [] },
  "impact-129": { n: 0, total: 0, labels: [] },
  "impact-150": { n: 0, total: 0, labels: [] },
  "impact-161": { n: 0, total: 0, labels: [] },
  "impact-165": { n: 0, total: 0, labels: [] },
  "impact-169": { n: 0, total: 0, labels: [] },
  "impact-18": { n: 0, total: 0, labels: [] },
  "impact-213": { n: 0, total: 0, labels: [] },
  "impact-330": { n: 0, total: 0, labels: [] },
  "impact-36": { n: 0, total: 0, labels: [] },
  "impact-40": { n: 0, total: 0, labels: [] },
  "impact-44": { n: 0, total: 0, labels: [] },
  "impact-48": { n: 0, total: 0, labels: [] },
  "impact-52": { n: 0, total: 0, labels: [] },
  "impact-64": { n: 0, total: 0, labels: [] },
  "impact-68": { n: 0, total: 0, labels: [] },
  "impact-72": { n: 0, total: 0, labels: [] },
  "impact-96": { n: 0, total: 0, labels: [] },
  "impact-03": { n: 0, total: 0, labels: [] },
  "impact-133": { n: 0, total: 0, labels: [] },
  "impact-159": { n: 0, total: 0, labels: [] },
  "impact-173": { n: 0, total: 0, labels: [] },
  "impact-207": { n: 0, total: 0, labels: [] },
  "impact-214": { n: 0, total: 0, labels: [] },
  "impact-35": { n: 0, total: 0, labels: [] },
  "impact-41": { n: 0, total: 0, labels: [] },
  "impact-49": { n: 0, total: 0, labels: [] },
  "impact-53": { n: 0, total: 0, labels: [] },
  "impact-69": { n: 0, total: 0, labels: [] },
  "impact-101": { n: 0, total: 0, labels: [] },
  "impact-112": { n: 0, total: 0, labels: [] },
  "impact-170": { n: 0, total: 0, labels: [] },
  "impact-211": { n: 0, total: 0, labels: [] },
  "impact-215": { n: 0, total: 0, labels: [] },
  "impact-32": { n: 0, total: 0, labels: [] },
  "impact-329": { n: 0, total: 0, labels: [] },
  "impact-34": { n: 0, total: 0, labels: [] },
  "impact-42": { n: 0, total: 0, labels: [] },
  "impact-54": { n: 0, total: 0, labels: [] },
  "impact-58": { n: 0, total: 0, labels: [] },
};

/** Les emplacements du thème choisi. Un thème inconnu n'en demande qu'une. */
export function photoSlotsFor(templateId: string | undefined): PhotoSlots {
  return (templateId && THEME_PHOTOS[templateId]) || { n: 1, total: 1, labels: [null] };
}
