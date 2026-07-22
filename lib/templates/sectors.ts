export interface SectorInfo {
  id: string;
  label: string; // FR default
  labels: Record<string, string>; // en, es, de, pt
  emoji: string;
  accentColor: string;
}

export interface IndustryInfo {
  id: string;
  label: string;
  labels: Record<string, string>;
  emoji: string;
  specialties: SectorInfo[];
}

/** 2-level taxonomy: broad industries → specialties. */
export const INDUSTRIES: IndustryInfo[] = [
  {
    id: 'sante',
    label: 'Santé',
    labels: { en: 'Health', es: 'Salud', de: 'Gesundheit', pt: 'Saúde' },
    emoji: '🏥',
    specialties: [
      { id: 'medecin',  label: 'Médecin',         labels: { en: 'Doctor',          es: 'Médico',        de: 'Arzt',              pt: 'Médico'         }, emoji: '🩺', accentColor: '#2d5a3d' },
      { id: 'dentiste', label: 'Dentiste',         labels: { en: 'Dentist',         es: 'Dentista',      de: 'Zahnarzt',          pt: 'Dentista'       }, emoji: '🦷', accentColor: '#0c2340' },
      { id: 'kine',     label: 'Kinésithérapeute', labels: { en: 'Physiotherapist', es: 'Fisioterapeuta', de: 'Physiotherapeut',  pt: 'Fisioterapeuta' }, emoji: '🏃', accentColor: '#1a5f7a' },
      { id: 'osteo',    label: 'Ostéopathe',       labels: { en: 'Osteopath',       es: 'Osteópata',     de: 'Osteopath',         pt: 'Osteopata'      }, emoji: '🙌', accentColor: '#2a4a35' },
      { id: 'veterinaire', label: 'Vétérinaire',  labels: { en: 'Veterinarian',    es: 'Veterinario',   de: 'Tierarzt',          pt: 'Veterinário'    }, emoji: '🐾', accentColor: '#3a6b52' },
    ],
  },
  {
    id: 'services',
    label: 'Services & Artisanat',
    labels: { en: 'Home Services', es: 'Servicios', de: 'Dienstleistungen', pt: 'Serviços' },
    emoji: '🔧',
    specialties: [
      { id: 'plombier',    label: 'Plombier',    labels: { en: 'Plumber',      es: 'Fontanero',    de: 'Klempner',   pt: 'Canalizador' }, emoji: '🔧', accentColor: '#8b2020' },
      { id: 'electricien', label: 'Électricien', labels: { en: 'Electrician',  es: 'Electricista', de: 'Elektriker', pt: 'Eletricista'  }, emoji: '⚡', accentColor: '#003b8e' },
      { id: 'paysagiste',  label: 'Paysagiste',  labels: { en: 'Landscaper',   es: 'Paisajista',   de: 'Landschaftsgärtner', pt: 'Paisagista' }, emoji: '🌿', accentColor: '#2a5c3a' },
      { id: 'menage',      label: 'Ménage / Nettoyage', labels: { en: 'Cleaning Service', es: 'Limpieza', de: 'Reinigungsservice', pt: 'Limpeza' }, emoji: '🧹', accentColor: '#0e7c86' },
      { id: 'garage_auto', label: 'Garage automobile', labels: { en: 'Auto Garage', es: 'Taller mecánico', de: 'Autowerkstatt', pt: 'Oficina automóvel' }, emoji: '🚗', accentColor: '#33261a' },
    ],
  },
  {
    id: 'droit_finance',
    label: 'Droit & Finance',
    labels: { en: 'Law & Finance', es: 'Derecho & Finanzas', de: 'Recht & Finanzen', pt: 'Direito & Finanças' },
    emoji: '⚖️',
    specialties: [
      { id: 'avocat',    label: 'Avocat',           labels: { en: 'Lawyer',      es: 'Abogado',   de: 'Anwalt',        pt: 'Advogado'    }, emoji: '⚖️', accentColor: '#1a3a5c' },
      { id: 'comptable', label: 'Expert-comptable', labels: { en: 'Accountant',  es: 'Contable',  de: 'Steuerberater', pt: 'Contabilista'}, emoji: '📊', accentColor: '#1c3f6e' },
    ],
  },
  {
    id: 'restauration',
    label: 'Restauration',
    labels: { en: 'Food & Restaurant', es: 'Restauración', de: 'Gastronomie', pt: 'Restauração' },
    emoji: '🍽️',
    specialties: [
      { id: 'restaurant',         label: 'Restaurant',          labels: { en: 'Restaurant',   es: 'Restaurante',         de: 'Restaurant',      pt: 'Restaurante'        }, emoji: '🍽️', accentColor: '#1a0a00' },
      { id: 'restauration_rapide', label: 'Fast-food / Snack',  labels: { en: 'Fast Food',    es: 'Comida rápida',       de: 'Fast Food',       pt: 'Fast food'           }, emoji: '🍔', accentColor: '#b33a00' },
      { id: 'boulangerie',        label: 'Boulangerie',         labels: { en: 'Bakery',       es: 'Panadería',           de: 'Bäckerei',        pt: 'Padaria'             }, emoji: '🥖', accentColor: '#5c3a1e' },
    ],
  },
  {
    id: 'sport_coaching',
    label: 'Sport & Coaching',
    labels: { en: 'Sports & Coaching', es: 'Deporte & Coaching', de: 'Sport & Coaching', pt: 'Desporto & Coaching' },
    emoji: '💪',
    specialties: [
      { id: 'coach', label: 'Coach sportif', labels: { en: 'Sports Coach', es: 'Entrenador', de: 'Sporttrainer', pt: 'Treinador' }, emoji: '💪', accentColor: '#111111' },
      { id: 'salle_sport', label: 'Salle de sport', labels: { en: 'Gym / Fitness Studio', es: 'Gimnasio', de: 'Fitnessstudio', pt: 'Ginásio' }, emoji: '🏋️', accentColor: '#a11d1d' },
    ],
  },
  {
    id: 'art_creation',
    label: 'Art & Création',
    labels: { en: 'Art & Creative', es: 'Arte & Creación', de: 'Kunst & Kreatives', pt: 'Arte & Criação' },
    emoji: '🎨',
    specialties: [
      { id: 'tatoueur', label: 'Tatoueur',      labels: { en: 'Tattoo Artist',    es: 'Tatuador',   de: 'Tätowierer',    pt: 'Tatuador'    }, emoji: '🎨', accentColor: '#1a1a1a' },
      { id: 'couture',  label: 'Couture / Mode', labels: { en: 'Fashion / Sewing', es: 'Moda / Costura', de: 'Mode / Schneiderei', pt: 'Moda / Costura' }, emoji: '✂️', accentColor: '#0d0d0d' },
      { id: 'photographe', label: 'Photographe', labels: { en: 'Photographer', es: 'Fotógrafo', de: 'Fotograf', pt: 'Fotógrafo' }, emoji: '📷', accentColor: '#101820' },
      { id: 'fleuriste',   label: 'Fleuriste',   labels: { en: 'Florist',      es: 'Floristería', de: 'Blumenladen', pt: 'Florista' }, emoji: '💐', accentColor: '#c25b7c' },
    ],
  },
  {
    id: 'evenementiel',
    label: 'Événementiel',
    labels: { en: 'Events', es: 'Eventos', de: 'Veranstaltungen', pt: 'Eventos' },
    emoji: '💍',
    specialties: [
      { id: 'mariage', label: 'Wedding Planner', labels: { en: 'Wedding Planner', es: 'Wedding Planner', de: 'Hochzeitsplaner', pt: 'Wedding Planner' }, emoji: '💍', accentColor: '#6b8f71' },
    ],
  },
  {
    id: 'beaute',
    label: 'Beauté',
    labels: { en: 'Beauty', es: 'Belleza', de: 'Schönheit', pt: 'Beleza' },
    emoji: '💇',
    specialties: [
      { id: 'coiffeur', label: 'Coiffeur / Barbier', labels: { en: 'Hair Salon / Barber', es: 'Peluquería / Barbería', de: 'Friseur / Barbier', pt: 'Cabeleireiro / Barbearia' }, emoji: '💇', accentColor: '#8a6d3f' },
    ],
  },
  {
    id: 'immobilier_architecture',
    label: 'Immobilier & Architecture',
    labels: { en: 'Real Estate & Architecture', es: 'Inmobiliaria y Arquitectura', de: 'Immobilien & Architektur', pt: 'Imobiliário & Arquitetura' },
    emoji: '🏛️',
    specialties: [
      { id: 'agent_immobilier',    label: 'Agence immobilière',    labels: { en: 'Real Estate Agency', es: 'Inmobiliaria',              de: 'Immobilienmakler', pt: 'Agência imobiliária' }, emoji: '🏠', accentColor: '#1c2e4a' },
      { id: 'architecte',          label: 'Architecte',            labels: { en: 'Architecture Firm',  es: 'Estudio de arquitectura',   de: 'Architekturbüro',  pt: 'Atelier de arquitetura' }, emoji: '📐', accentColor: '#44576b' },
      { id: 'decorateur_interieur', label: "Décorateur d'intérieur", labels: { en: 'Interior Designer', es: 'Diseño de interiores',     de: 'Innenarchitekt',   pt: 'Designer de interiores' }, emoji: '🛋️', accentColor: '#8a6a4f' },
    ],
  },
  {
    id: 'hebergement',
    label: 'Hôtellerie',
    labels: { en: 'Hospitality', es: 'Hostelería', de: 'Hotellerie', pt: 'Hotelaria' },
    emoji: '🏨',
    specialties: [
      { id: 'hotel', label: 'Hôtel', labels: { en: 'Hotel', es: 'Hotel', de: 'Hotel', pt: 'Hotel' }, emoji: '🏨', accentColor: '#12294a' },
    ],
  },
];

/** Flat sector list derived from INDUSTRIES (backward-compatible). */
export const SECTORS: SectorInfo[] = INDUSTRIES.flatMap((ind) => ind.specialties);

/** Map sector id → ordered template IDs (best first). */
export const SECTOR_TEMPLATES: Record<string, string[]> = {
  medecin:             ['impact-243', 'impact-257', 'impact-274', 'impact-285', 'impact-297'],
  dentiste:            ['impact-237', 'impact-252', 'impact-273', 'impact-284', 'impact-298'],
  kine:                ['impact-238', 'impact-253', 'impact-272', 'impact-283', 'impact-299'],
  osteo:               ['impact-248', 'impact-264', 'impact-279', 'impact-291', 'impact-300'],
  avocat:              ['impact-239', 'impact-255', 'impact-275', 'impact-286', 'impact-301'],
  comptable:           ['impact-242', 'impact-254', 'impact-261', 'impact-289', 'impact-302'],
  coach:               ['impact-240', 'impact-256', 'impact-276', 'impact-287', 'impact-303'],
  plombier:            ['impact-246', 'impact-260', 'impact-278', 'impact-290', 'impact-304'],
  electricien:         ['impact-236', 'impact-247', 'impact-277', 'impact-288', 'impact-305'],
  boulangerie:         ['impact-245', 'impact-259', 'impact-269', 'impact-282', 'impact-306'],
  mariage:             ['impact-244', 'impact-251', 'impact-266', 'impact-280', 'impact-307'],
  couture:             ['impact-235', 'impact-258', 'impact-265', 'impact-281', 'impact-308'],
  tatoueur:            ['impact-249', 'impact-262', 'impact-267', 'impact-270', 'impact-309'],
  paysagiste:          ['impact-250', 'impact-263', 'impact-268', 'impact-271', 'impact-310'],
  restaurant:          ['impact-04',  'impact-99',  'impact-189', 'impact-211'],
  restauration_rapide: ['impact-292', 'impact-293', 'impact-294', 'impact-295', 'impact-296'],
  veterinaire:         ['impact-32'],
  menage:              ['impact-178', 'impact-315', 'impact-316', 'impact-317', 'impact-318', 'impact-319'],
  garage_auto:         ['impact-311', 'impact-312'],
  salle_sport:         ['impact-119', 'impact-174'],
  photographe:         ['impact-02',  'impact-16',  'impact-60',  'impact-71',  'impact-77',  'impact-96',  'impact-166'],
  fleuriste:           ['impact-47',  'impact-94'],
  coiffeur:            ['impact-180', 'impact-209'],
  agent_immobilier:    ['impact-82',  'impact-92',  'impact-128', 'impact-167', 'impact-222', 'impact-241'],
  architecte:          ['impact-17',  'impact-28',  'impact-118', 'impact-147', 'impact-156', 'impact-186'],
  decorateur_interieur: ['impact-44', 'impact-100', 'impact-143'],
  hotel:               ['impact-10',  'impact-182'],
};

/** Short display name per template for the step-2 card. */
export const TEMPLATE_CITY_LABELS: Record<string, string> = {
  // Legacy templates
  'impact-04':  "L'Étoile Restaurant · Paris",
  'impact-99':  'Ember Grill · Lyon',
  'impact-189': 'Aura Dining · Bordeaux',
  'impact-211': 'Maison Éclat · Nice',
  // Batch 2023/2024
  'impact-235': 'Atelier Voss · Paris',
  'impact-236': 'ÉlectroPro · Île-de-France',
  'impact-237': 'Cabinet Sorrento · Nice',
  'impact-238': 'Kiné Atlantique · Rennes',
  'impact-239': 'Moreau Delacroix · Paris',
  'impact-240': 'Studio Athletic · Lyon',
  'impact-241': 'Clé de Voûte · Bordeaux',
  'impact-242': 'Fiduciaire Marchand · Nantes',
  'impact-243': 'Dr. Beaumont · Strasbourg',
  'impact-244': 'Atelier Céleste · Paris',
  'impact-245': 'Maison Brûlot · Lyon',
  'impact-246': 'ThermoFix Pro · Marseille',
  'impact-247': 'Volt & Lux · Toulouse',
  'impact-248': 'Ostéo République · Paris',
  'impact-249': 'Dermis Studio · Montpellier',
  'impact-250': 'Vert Nature · Nantes',
  'impact-251': 'Maison Nuptiale · Bordeaux',
  'impact-252': 'Smile & Co · Lyon',
  'impact-253': 'KinéSport Élite · Paris',
  'impact-254': 'Vaillant & Associés · Paris',
  'impact-255': 'Maître Voss · Toulouse',
  'impact-256': 'Force Brute · Marseille',
  'impact-257': 'Dr. Moulin · Bordeaux',
  'impact-258': 'Maison Solal · Marseille',
  'impact-259': 'Fournil du Parlement · Strasbourg',
  'impact-260': 'Aqua Confort · Lyon',
  'impact-261': 'Axiom Conseil · Bordeaux',
  'impact-262': 'Studio Noir Absolu · Paris',
  'impact-263': 'Jardins Vivants · Bordeaux',
  'impact-264': 'Ostéo Atlantique · Nantes',
  'impact-265': "L'Atelier Soie · Lyon",
  'impact-266': 'Villa Émeraude · Nice',
  'impact-267': 'Encre Vivante · Lyon',
  'impact-268': 'Vert Horizon · Île-de-France',
  'impact-269': 'Chartrons · Bordeaux',
  'impact-270': 'Peau & Plume · Lille',
  'impact-271': "Jardins d'Alsace · Strasbourg",
  'impact-272': 'KinéPédiatrie · Bordeaux',
  'impact-273': 'Cabinet Rosenfeld · Strasbourg',
  'impact-274': 'Dr. Renard · Lyon',
  'impact-275': 'Cabinet Faure · Marseille',
  'impact-276': 'Thomas Lebrun · Bordeaux',
  'impact-277': 'Électricité Dumont · Paris',
  'impact-278': 'Plomberie Garonne · Toulouse',
  'impact-279': 'Cabinet Soler · Lyon',
  'impact-280': "Épousailles d'Alsace · Strasbourg",
  'impact-281': 'Maison Céleste · Paris',
  'impact-282': 'Boulangerie du Beffroi · Lille',
  'impact-283': 'Kinésithérapie du Languedoc · Montpellier',
  'impact-284': "Cabinet Dent'Or · Bordeaux",
  'impact-285': 'Dr. Lecomte · Nantes',
  'impact-286': 'Cabinet Vidal · Lyon',
  'impact-287': "Côte d'Azur Coaching · Nice",
  'impact-288': 'Ampère & Fils · Nantes',
  'impact-289': 'Schreiber & Associés · Strasbourg',
  'impact-290': 'Eau & Habitat · Rennes',
  'impact-291': 'Ostéopathie Alsace · Strasbourg',
  // Fast-food batch (Antigravity impact-292..296)
  'impact-292': 'BurgerCo · Paris',
  'impact-293': 'Pizza Napoli · Lyon',
  'impact-294': 'Sultan Kebab · Marseille',
  'impact-295': 'Wok Master · Paris',
  'impact-296': 'Caliente Tacos · Bordeaux',
  // 5ème variantes (Antigravity impact-297..310)
  'impact-297': 'Dr. Faure · Toulouse',
  'impact-298': 'Dr. Blanc · Montpellier',
  'impact-299': 'KinéPro Sport · Lyon',
  'impact-300': 'Ostéo Périnatal · Nice',
  'impact-301': 'Dubois & Partenaires · Bordeaux',
  'impact-302': 'Nexus Compta · Toulouse',
  'impact-303': 'Studio Peak · Paris',
  'impact-304': 'Rapido Plomberie · Paris',
  'impact-305': 'Courant Fort · Bordeaux',
  'impact-306': 'La Miette Heureuse · Montpellier',
  'impact-307': 'Lumière & Vœux · Lyon',
  'impact-308': 'Re-Thread Studio · Bordeaux',
  'impact-309': 'Encre Délicate · Bordeaux',
  'impact-310': "Jardins de l'Hérault · Montpellier",
  // Cleaning / ménage
  'impact-178': 'Essential Cleaning · Toulouse',
  'impact-315': 'Brise de Propreté · Nantes',
  'impact-316': 'Pro-Nettoyage Services · Île-de-France',
  'impact-317': 'Sparkle Home · Marseille',
  'impact-318': 'Nettoyage Extrême · Lille',
  'impact-319': 'Éco-Clean Habitat · Montpellier',
  // Garage auto
  'impact-311': 'Atelier Performance · Lyon',
  'impact-312': 'Garage Minimalist · Rennes',
  // Salle de sport
  'impact-119': 'IronX Fitness · Marseille',
  'impact-174': 'FORGE · Lille',
  // Photographe
  'impact-02':  'Elena Korr · Paris',
  'impact-16':  'Obscura · Lyon',
  'impact-60':  'Stack OS · Marseille',
  'impact-71':  'Archive 35mm · Toulouse',
  'impact-77':  'Tilt Grid · Nice',
  'impact-96':  'Urban Pulse · Nantes',
  'impact-166': 'Iris Studio · Strasbourg',
  // Fleuriste
  'impact-47':  'Pétales & Co · Bordeaux',
  'impact-94':  'Botanica Flowers · Montpellier',
  // Coiffeur / Barbier
  'impact-180': 'Essential Salon · Rennes',
  'impact-209': "L'Atelier Coiffure · Lille",
  // Agence immobilière
  'impact-82':  'Blueprint Developments · Lyon',
  'impact-92':  'Skyline Concierge · Marseille',
  'impact-128': 'Haven Estates · Toulouse',
  'impact-167': 'Rive Gauche Immobilier · Paris',
  'impact-222': 'Solis Immobilier · Montpellier',
  // Architecte
  'impact-17':  'Kéops · Nantes',
  'impact-28':  'Brutco · Lille',
  'impact-118': 'Formwerk Studio · Strasbourg',
  'impact-147': 'Void Arch · Rennes',
  'impact-156': 'Bio Form Arch · Nice',
  'impact-186': 'ArchiTectura · Île-de-France',
  // Décorateur d'intérieur
  'impact-44':  'Espace Studio · Marseille',
  'impact-100': 'Nova Spaces · Paris',
  'impact-143': 'Atelier Interior · Lyon',
  // Hôtel
  'impact-10':  'Grand Palais · Nice',
  'impact-182': 'The Grand Hotel · Lille',
  // Vétérinaire
  'impact-32':  'PawCare Clinic · Nantes',
};
