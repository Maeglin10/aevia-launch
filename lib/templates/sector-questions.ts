export interface SectorQuestion {
  key: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  label: Record<string, string>;
  placeholder?: Record<string, string>;
  options?: Record<string, string[]>; // locale → options
  required?: boolean;
}

export interface SectorQuestionGroup {
  groupLabel?: Record<string, string>;
  questions: SectorQuestion[];
}

/** Extra questions shown in Step 4 based on the selected sector. */
export const SECTOR_EXTRA_QUESTIONS: Record<string, SectorQuestion[]> = {
  medecin: [
    {
      key: 'speciality',
      type: 'text',
      label: { fr: 'Spécialité médicale', en: 'Medical specialty', es: 'Especialidad', de: 'Fachrichtung', pt: 'Especialidade' },
      placeholder: { fr: 'ex : Généraliste, Pédiatre, Cardiologue…', en: 'e.g. GP, Paediatrician, Cardiologist…', es: 'ej: Médico general, Cardiólogo…', de: 'z.B. Allgemeinmediziner, Kardiologe…', pt: 'ex: Clínico geral, Cardiologista…' },
    },
    {
      key: 'conventionSecu',
      type: 'select',
      label: { fr: 'Secteur conventionné', en: 'Health system tier', es: 'Sector sanitario', de: 'Kassenärztliche Zulassung', pt: 'Convenção' },
      options: {
        fr: ['Secteur 1 (tarifs sécu)', 'Secteur 2 (dépassements)', 'Secteur 3 (non conventionné)', 'Non applicable'],
        en: ['NHS / Insured', 'Private', 'Both', 'N/A'],
        es: ['Seguridad Social', 'Privado', 'Ambos', 'N/A'],
        de: ['Kassenpatient', 'Privatpatient', 'Beides', 'N/A'],
        pt: ['SNS', 'Privado', 'Ambos', 'N/A'],
      },
    },
    {
      key: 'telemedicine',
      type: 'select',
      label: { fr: 'Téléconsultation disponible ?', en: 'Telemedicine available?', es: '¿Teleconsulta disponible?', de: 'Telemedizin verfügbar?', pt: 'Teleconsulta disponível?' },
      options: {
        fr: ['Oui', 'Non', 'Sur demande'],
        en: ['Yes', 'No', 'On request'],
        es: ['Sí', 'No', 'A petición'],
        de: ['Ja', 'Nein', 'Auf Anfrage'],
        pt: ['Sim', 'Não', 'A pedido'],
      },
    },
    {
      key: 'openingHours',
      type: 'text',
      label: { fr: 'Horaires de consultation', en: 'Consultation hours', es: 'Horario de consultas', de: 'Sprechzeiten', pt: 'Horário de consultas' },
      placeholder: { fr: 'ex : Lun-Ven 9h-19h, Sam 9h-12h', en: 'e.g. Mon-Fri 9am-7pm', es: 'ej: Lun-Vie 9h-19h', de: 'z.B. Mo-Fr 9-19 Uhr', pt: 'ex: Seg-Sex 9h-19h' },
    },
    {
      key: 'languages',
      type: 'text',
      label: { fr: 'Langues parlées (optionnel)', en: 'Languages spoken (optional)', es: 'Idiomas hablados (opcional)', de: 'Gesprochene Sprachen (optional)', pt: 'Idiomas falados (opcional)' },
      placeholder: { fr: 'ex : Français, Anglais, Arabe', en: 'e.g. English, French, Arabic', es: 'ej: Español, Inglés, Francés', de: 'z.B. Deutsch, Englisch', pt: 'ex: Português, Inglês, Francês' },
    },
  ],

  dentiste: [
    {
      key: 'specialties',
      type: 'text',
      label: { fr: 'Spécialités / soins proposés', en: 'Specialties / treatments', es: 'Especialidades', de: 'Spezialgebiete', pt: 'Especialidades' },
      placeholder: { fr: 'ex : Implantologie, Orthodontie, Facettes, Blanchiment', en: 'e.g. Implants, Braces, Veneers, Whitening', es: 'ej: Implantes, Ortodoncia, Blanqueamiento', de: 'z.B. Implantate, Kieferorthopädie', pt: 'ex: Implantes, Ortodontia, Branqueamento' },
    },
    {
      key: 'invisalign',
      type: 'select',
      label: { fr: 'Orthodontie invisible (Invisalign / aligneurs) ?', en: 'Clear aligners (Invisalign)?', es: '¿Ortodoncia invisible?', de: 'Unsichtbare Spange?', pt: 'Alinhadores transparentes?' },
      options: {
        fr: ['Oui', 'Non'],
        en: ['Yes', 'No'],
        es: ['Sí', 'No'],
        de: ['Ja', 'Nein'],
        pt: ['Sim', 'Não'],
      },
    },
    {
      key: 'mutuelle',
      type: 'select',
      label: { fr: 'Prise en charge mutuelle', en: 'Insurance accepted', es: 'Seguros aceptados', de: 'Krankenversicherung', pt: 'Seguros aceites' },
      options: {
        fr: ['Toutes mutuelles', 'Conventionné sect. 1', 'Conventionné sect. 2', 'Non conventionné'],
        en: ['All insurance', 'NHS', 'Private', 'Self-pay only'],
        es: ['Todos los seguros', 'Solo privado', 'Ambos'],
        de: ['Alle Kassen', 'Nur Privatpatienten', 'Beides'],
        pt: ['Todos seguros', 'SNS', 'Privado'],
      },
    },
    {
      key: 'openingHours',
      type: 'text',
      label: { fr: 'Horaires du cabinet', en: 'Practice hours', es: 'Horario de la clínica', de: 'Praxiszeiten', pt: 'Horário do consultório' },
      placeholder: { fr: 'ex : Lun-Ven 8h30-19h30, Sam 9h-13h', en: 'e.g. Mon-Fri 8:30am-7:30pm', es: 'ej: Lun-Vie 8h30-19h30', de: 'z.B. Mo-Fr 8:30-19:30 Uhr', pt: 'ex: Seg-Sex 8h30-19h30' },
    },
  ],

  kine: [
    {
      key: 'specialties',
      type: 'text',
      label: { fr: 'Spécialités en kiné', en: 'Physiotherapy specialties', es: 'Especialidades en fisioterapia', de: 'Physiotherapie-Spezialisierungen', pt: 'Especialidades em fisioterapia' },
      placeholder: { fr: 'ex : Sport, Neurologie, Pédiatrie, Post-opératoire', en: 'e.g. Sports, Neurology, Paediatrics, Post-op', es: 'ej: Deportiva, Neurología, Pediátrica', de: 'z.B. Sport, Neurologie, Pädiatrie', pt: 'ex: Desportiva, Neurologia, Pediátrica' },
    },
    {
      key: 'homeVisits',
      type: 'select',
      label: { fr: 'Soins à domicile ?', en: 'Home visits?', es: '¿Atención domiciliaria?', de: 'Hausbesuche?', pt: 'Visitas ao domicílio?' },
      options: {
        fr: ['Oui', 'Non', 'Sur demande'],
        en: ['Yes', 'No', 'On request'],
        es: ['Sí', 'No', 'A petición'],
        de: ['Ja', 'Nein', 'Auf Anfrage'],
        pt: ['Sim', 'Não', 'A pedido'],
      },
    },
    {
      key: 'equipment',
      type: 'text',
      label: { fr: 'Équipements spéciaux (optionnel)', en: 'Special equipment (optional)', es: 'Equipamiento especial (opcional)', de: 'Spezialgeräte (optional)', pt: 'Equipamentos especiais (opcional)' },
      placeholder: { fr: 'ex : Balnéothérapie, Électrostimulation, Laser', en: 'e.g. Hydrotherapy, Electrostimulation, Laser', es: 'ej: Hidroterapia, Electroestimulación', de: 'z.B. Hydrotherapie, Elektrotherapie', pt: 'ex: Hidroterapia, Laser' },
    },
    {
      key: 'openingHours',
      type: 'text',
      label: { fr: 'Horaires du cabinet', en: 'Practice hours', es: 'Horario del gabinete', de: 'Praxiszeiten', pt: 'Horário do gabinete' },
      placeholder: { fr: 'ex : Lun-Ven 8h-20h, Sam 8h-14h', en: 'e.g. Mon-Fri 8am-8pm, Sat 8am-2pm', es: 'ej: Lun-Vie 8h-20h', de: 'z.B. Mo-Fr 8-20 Uhr', pt: 'ex: Seg-Sex 8h-20h' },
    },
  ],

  osteo: [
    {
      key: 'approach',
      type: 'text',
      label: { fr: 'Approches pratiquées', en: 'Approaches practiced', es: 'Enfoques practicados', de: 'Angewandte Techniken', pt: 'Abordagens praticadas' },
      placeholder: { fr: 'ex : Structurel, Viscéral, Crânien, Fascia', en: 'e.g. Structural, Visceral, Cranial, Fascial', es: 'ej: Estructural, Visceral, Craneal', de: 'z.B. Strukturell, Viszeral, Kranial', pt: 'ex: Estrutural, Visceral, Cranial' },
    },
    {
      key: 'targetPatients',
      type: 'text',
      label: { fr: 'Patients cibles', en: 'Target patients', es: 'Pacientes objetivo', de: 'Zielgruppe', pt: 'Pacientes alvo' },
      placeholder: { fr: 'ex : Nourrissons, Femmes enceintes, Sportifs, Séniors', en: 'e.g. Infants, Pregnant women, Athletes, Seniors', es: 'ej: Bebés, Embarazadas, Deportistas, Mayores', de: 'z.B. Babys, Schwangere, Sportler, Senioren', pt: 'ex: Bebés, Grávidas, Desportistas, Seniores' },
    },
    {
      key: 'sessionDuration',
      type: 'text',
      label: { fr: 'Durée d\'une séance', en: 'Session duration', es: 'Duración de la sesión', de: 'Sitzungsdauer', pt: 'Duração da sessão' },
      placeholder: { fr: 'ex : 45 min — 1h', en: 'e.g. 45 min — 1h', es: 'ej: 45 min — 1h', de: 'z.B. 45 Min. — 1 Std.', pt: 'ex: 45 min — 1h' },
    },
    {
      key: 'openingHours',
      type: 'text',
      label: { fr: 'Horaires du cabinet', en: 'Practice hours', es: 'Horario del gabinete', de: 'Praxiszeiten', pt: 'Horário do gabinete' },
      placeholder: { fr: 'ex : Lun-Sam 9h-19h', en: 'e.g. Mon-Sat 9am-7pm', es: 'ej: Lun-Sáb 9h-19h', de: 'z.B. Mo-Sa 9-19 Uhr', pt: 'ex: Seg-Sáb 9h-19h' },
    },
  ],

  avocat: [
    {
      key: 'practiceAreas',
      type: 'text',
      label: { fr: 'Domaines du droit', en: 'Practice areas', es: 'Áreas de práctica', de: 'Rechtsgebiete', pt: 'Áreas de prática' },
      placeholder: { fr: 'ex : Droit social, Droit des affaires, Droit pénal, RGPD', en: 'e.g. Employment, Corporate, Criminal, GDPR', es: 'ej: Laboral, Mercantil, Penal', de: 'z.B. Arbeitsrecht, Gesellschaftsrecht, Strafrecht', pt: 'ex: Laboral, Empresarial, Penal' },
    },
    {
      key: 'clientTypes',
      type: 'text',
      label: { fr: 'Clientèle (particuliers, entreprises, mixte)', en: 'Clients (individuals, companies, both)', es: 'Clientes (particulares, empresas, mixto)', de: 'Mandanten (Privat, Unternehmen, beides)', pt: 'Clientes (particulares, empresas, ambos)' },
      placeholder: { fr: 'ex : Particuliers & PME', en: 'e.g. Individuals & SMEs', es: 'ej: Particulares y pymes', de: 'z.B. Privatpersonen & KMU', pt: 'ex: Particulares e PME' },
    },
    {
      key: 'freeConsult',
      type: 'select',
      label: { fr: 'Première consultation offerte ?', en: 'Free first consultation?', es: '¿Primera consulta gratuita?', de: 'Erste Beratung kostenlos?', pt: 'Primeira consulta gratuita?' },
      options: {
        fr: ['Oui, 30 min offertes', 'Non', 'Sur devis'],
        en: ['Yes, 30 min free', 'No', 'On request'],
        es: ['Sí, 30 min gratis', 'No', 'A consultar'],
        de: ['Ja, 30 Min. kostenlos', 'Nein', 'Auf Anfrage'],
        pt: ['Sim, 30 min grátis', 'Não', 'A consultar'],
      },
    },
    {
      key: 'languages',
      type: 'text',
      label: { fr: 'Langues pratiquées', en: 'Languages spoken', es: 'Idiomas', de: 'Sprachen', pt: 'Idiomas' },
      placeholder: { fr: 'ex : Français, Anglais, Espagnol', en: 'e.g. English, French, Spanish', es: 'ej: Español, Inglés, Francés', de: 'z.B. Deutsch, Englisch, Französisch', pt: 'ex: Português, Inglês, Espanhol' },
    },
  ],

  comptable: [
    {
      key: 'clientTypes',
      type: 'text',
      label: { fr: 'Types de clients accompagnés', en: 'Client types', es: 'Tipos de clientes', de: 'Mandantentypen', pt: 'Tipos de clientes' },
      placeholder: { fr: 'ex : TPE, PME, Auto-entrepreneurs, Créateurs de contenu', en: 'e.g. SMEs, Freelancers, Content creators', es: 'ej: Pymes, Autónomos, Creadores de contenido', de: 'z.B. KMU, Freelancer, Selbständige', pt: 'ex: PME, Freelancers, Criadores de conteúdo' },
    },
    {
      key: 'specialties',
      type: 'text',
      label: { fr: 'Spécialités comptables', en: 'Accounting specialties', es: 'Especialidades contables', de: 'Steuerliche Spezialisierungen', pt: 'Especialidades contabilísticas' },
      placeholder: { fr: 'ex : E-commerce, Startups, Professions libérales, Holding', en: 'e.g. E-commerce, Startups, Liberal professions', es: 'ej: E-commerce, Startups, Profesiones liberales', de: 'z.B. E-Commerce, Startups, Freiberufler', pt: 'ex: E-commerce, Startups, Profissões liberais' },
    },
    {
      key: 'software',
      type: 'text',
      label: { fr: 'Logiciels utilisés', en: 'Software used', es: 'Software utilizado', de: 'Eingesetzte Software', pt: 'Software utilizado' },
      placeholder: { fr: 'ex : Sage, Cegid, QuickBooks, Pennylane', en: 'e.g. Xero, QuickBooks, Sage, Pennylane', es: 'ej: Holded, Sage, QuickBooks', de: 'z.B. DATEV, Lexware, Sage', pt: 'ex: TOCOnline, Sage, QuickBooks' },
    },
    {
      key: 'remotePossible',
      type: 'select',
      label: { fr: 'Suivi 100% en ligne possible ?', en: 'Fully remote possible?', es: '¿Gestión 100% online posible?', de: '100% digital möglich?', pt: 'Gestão 100% online possível?' },
      options: {
        fr: ['Oui', 'Non', 'Mixte (présentiel + distanciel)'],
        en: ['Yes', 'No', 'Hybrid'],
        es: ['Sí', 'No', 'Mixto'],
        de: ['Ja', 'Nein', 'Hybrid'],
        pt: ['Sim', 'Não', 'Híbrido'],
      },
    },
  ],

  coach: [
    {
      key: 'trainingTypes',
      type: 'text',
      label: { fr: 'Types d\'entraînement proposés', en: 'Training types offered', es: 'Tipos de entrenamiento', de: 'Angebotene Trainingsarten', pt: 'Tipos de treino oferecidos' },
      placeholder: { fr: 'ex : Musculation, Running, HIIT, Yoga, Boxe', en: 'e.g. Strength, Running, HIIT, Yoga, Boxing', es: 'ej: Musculación, Running, HIIT, Yoga', de: 'z.B. Krafttraining, Laufen, HIIT, Yoga', pt: 'ex: Musculação, Running, HIIT, Yoga' },
    },
    {
      key: 'format',
      type: 'select',
      label: { fr: 'Format des séances', en: 'Session format', es: 'Formato de las sesiones', de: 'Format der Einheiten', pt: 'Formato das sessões' },
      options: {
        fr: ['Individuel uniquement', 'Groupe uniquement', 'Individuel + groupe', 'En ligne uniquement', 'En ligne + présentiel'],
        en: ['1-to-1 only', 'Group only', '1-to-1 + group', 'Online only', 'Online + in-person'],
        es: ['Individual solo', 'Grupo solo', 'Individual + grupo', 'Solo online', 'Online + presencial'],
        de: ['Nur Einzel', 'Nur Gruppe', 'Einzel + Gruppe', 'Nur online', 'Online + vor Ort'],
        pt: ['Só individual', 'Só grupo', 'Individual + grupo', 'Só online', 'Online + presencial'],
      },
    },
    {
      key: 'certifications',
      type: 'text',
      label: { fr: 'Certifications / diplômes', en: 'Certifications / qualifications', es: 'Certificaciones / titulaciones', de: 'Zertifizierungen / Abschlüsse', pt: 'Certificações / diplomas' },
      placeholder: { fr: 'ex : BPJEPS, Licence STAPS, CrossFit L1, Nutrition', en: 'e.g. Personal Training cert., CrossFit L1, Nutrition', es: 'ej: TAFAD, TSEAS, Nutrición', de: 'z.B. Übungsleiter, B-Lizenz, NASM', pt: 'ex: CNA, Nutrição, CrossFit L1' },
    },
    {
      key: 'targetClients',
      type: 'text',
      label: { fr: 'Clients cibles', en: 'Target clients', es: 'Clientes objetivo', de: 'Zielgruppe', pt: 'Clientes alvo' },
      placeholder: { fr: 'ex : Femmes actives 30-50 ans, Sportifs compétition, Remise en forme', en: 'e.g. Active women 30-50, Competitive athletes, General fitness', es: 'ej: Mujeres activas, Deportistas, Pérdida de peso', de: 'z.B. Frauen 30-50, Wettkampfsportler', pt: 'ex: Mulheres ativas, Atletas, Perda de peso' },
    },
  ],

  plombier: [
    {
      key: 'interventionZone',
      type: 'text',
      label: { fr: 'Zone d\'intervention', en: 'Coverage area', es: 'Zona de actuación', de: 'Einsatzgebiet', pt: 'Zona de intervenção' },
      placeholder: { fr: 'ex : Lyon et agglomération (30 km)', en: 'e.g. London and within 30 km', es: 'ej: Madrid y alrededores (30 km)', de: 'z.B. Berlin und Umgebung (30 km)', pt: 'ex: Lisboa e região (30 km)' },
    },
    {
      key: 'emergency24h',
      type: 'select',
      label: { fr: 'Urgences 24h/7j ?', en: '24/7 emergency service?', es: '¿Urgencias 24h/7d?', de: '24/7-Notdienst?', pt: 'Urgências 24h/7d?' },
      options: {
        fr: ['Oui, 24h/7j', 'Oui, en semaine', 'Non'],
        en: ['Yes, 24/7', 'Yes, weekdays', 'No'],
        es: ['Sí, 24h/7d', 'Sí, días laborables', 'No'],
        de: ['Ja, 24/7', 'Ja, werktags', 'Nein'],
        pt: ['Sim, 24h/7d', 'Sim, dias úteis', 'Não'],
      },
    },
    {
      key: 'specialties',
      type: 'text',
      label: { fr: 'Spécialités / prestations principales', en: 'Main specialties / services', es: 'Especialidades / servicios principales', de: 'Hauptleistungen', pt: 'Especialidades / serviços principais' },
      placeholder: { fr: 'ex : PAC, Chauffe-eau, Débouchage, Salle de bain, Solaire', en: 'e.g. Heat pump, Boiler, Drainage, Bathroom, Solar', es: 'ej: Bomba calor, Caldera, Desatasco, Baño, Solar', de: 'z.B. Wärmepumpe, Heizung, Verstopfung, Bad, Solar', pt: 'ex: Bomba calor, Caldeira, Desentupimento, Casa de banho' },
    },
    {
      key: 'quoteType',
      type: 'select',
      label: { fr: 'Devis', en: 'Quote', es: 'Presupuesto', de: 'Kostenvoranschlag', pt: 'Orçamento' },
      options: {
        fr: ['Gratuit et sans engagement', 'Payant (déduit de la prestation)', 'Sur demande'],
        en: ['Free, no obligation', 'Paid (deducted from invoice)', 'On request'],
        es: ['Gratis, sin compromiso', 'De pago (descontado)', 'A petición'],
        de: ['Kostenlos und unverbindlich', 'Kostenpflichtig (wird verrechnet)', 'Auf Anfrage'],
        pt: ['Gratuito, sem compromisso', 'Pago (descontado)', 'A pedido'],
      },
    },
  ],

  electricien: [
    {
      key: 'interventionZone',
      type: 'text',
      label: { fr: 'Zone d\'intervention', en: 'Coverage area', es: 'Zona de actuación', de: 'Einsatzgebiet', pt: 'Zona de intervenção' },
      placeholder: { fr: 'ex : Paris et Île-de-France', en: 'e.g. London and Greater London', es: 'ej: Madrid y alrededores', de: 'z.B. Berlin und Brandenburg', pt: 'ex: Lisboa e Grande Lisboa' },
    },
    {
      key: 'certifications',
      type: 'text',
      label: { fr: 'Certifications (RGE, Quali\'PV, IRVE…)', en: 'Certifications (RGE, EV charger, etc.)', es: 'Certificaciones', de: 'Zertifizierungen', pt: 'Certificações' },
      placeholder: { fr: 'ex : RGE QualiPV, IRVE, Qualifelec', en: 'e.g. EV charger certified, Solar PV installer', es: 'ej: RGE, Instalador fotovoltaico', de: 'z.B. Meister, VDE, Solarinstallateur', pt: 'ex: RGE, IRVE, Fotovoltaica' },
    },
    {
      key: 'specialties',
      type: 'text',
      label: { fr: 'Spécialités principales', en: 'Main specialties', es: 'Especialidades principales', de: 'Hauptbereiche', pt: 'Especialidades principais' },
      placeholder: { fr: 'ex : Domotique, Bornes recharge, Photovoltaïque, Tertiaire', en: 'e.g. Smart home, EV chargers, Solar, Commercial', es: 'ej: Domótica, Puntos de carga, Fotovoltaica', de: 'z.B. Smart Home, Ladestation, Solar, Gewerbe', pt: 'ex: Domótica, Carregadores VE, Fotovoltaica' },
    },
    {
      key: 'quoteType',
      type: 'select',
      label: { fr: 'Devis', en: 'Quote', es: 'Presupuesto', de: 'Kostenvoranschlag', pt: 'Orçamento' },
      options: {
        fr: ['Gratuit et sans engagement', 'Payant (déduit de la prestation)', 'Sur demande'],
        en: ['Free, no obligation', 'Paid (deducted from invoice)', 'On request'],
        es: ['Gratis, sin compromiso', 'De pago (descontado)', 'A petición'],
        de: ['Kostenlos und unverbindlich', 'Kostenpflichtig (wird verrechnet)', 'Auf Anfrage'],
        pt: ['Gratuito, sem compromisso', 'Pago (descontado)', 'A pedido'],
      },
    },
  ],

  boulangerie: [
    {
      key: 'specialties',
      type: 'text',
      label: { fr: 'Spécialités de la maison', en: 'House specialties', es: 'Especialidades de la casa', de: 'Hausbesonderheiten', pt: 'Especialidades da casa' },
      placeholder: { fr: 'ex : Pain au levain, Croissants pur beurre, Tarte tropézienne', en: 'e.g. Sourdough, Croissants, Tarts, Éclairs', es: 'ej: Pan de masa madre, Croissants, Tartas', de: 'z.B. Sauerteigbrot, Croissants, Torten', pt: 'ex: Pão de fermentação natural, Croissants, Tartes' },
    },
    {
      key: 'openingHours',
      type: 'text',
      label: { fr: 'Horaires d\'ouverture', en: 'Opening hours', es: 'Horario de apertura', de: 'Öffnungszeiten', pt: 'Horário de funcionamento' },
      placeholder: { fr: 'ex : Mar-Sam 7h-20h, Dim 7h-13h', en: 'e.g. Tue-Sat 7am-8pm, Sun 7am-1pm', es: 'ej: Mar-Sáb 7h-20h, Dom 7h-13h', de: 'z.B. Di-Sa 7-20 Uhr, So 7-13 Uhr', pt: 'ex: Ter-Sáb 7h-20h, Dom 7h-13h' },
    },
    {
      key: 'orderOnline',
      type: 'select',
      label: { fr: 'Commandes en ligne / click & collect ?', en: 'Online orders / click & collect?', es: '¿Pedidos online / click & collect?', de: 'Online-Bestellung / Click & Collect?', pt: 'Encomendas online / click & collect?' },
      options: {
        fr: ['Oui', 'Non', 'En cours de mise en place'],
        en: ['Yes', 'No', 'Coming soon'],
        es: ['Sí', 'No', 'Próximamente'],
        de: ['Ja', 'Nein', 'Demnächst'],
        pt: ['Sim', 'Não', 'Em breve'],
      },
    },
    {
      key: 'glutenFree',
      type: 'select',
      label: { fr: 'Produits sans gluten ?', en: 'Gluten-free products?', es: '¿Productos sin gluten?', de: 'Glutenfreie Produkte?', pt: 'Produtos sem glúten?' },
      options: {
        fr: ['Oui', 'Partiellement', 'Non'],
        en: ['Yes', 'Partially', 'No'],
        es: ['Sí', 'Parcialmente', 'No'],
        de: ['Ja', 'Teilweise', 'Nein'],
        pt: ['Sim', 'Parcialmente', 'Não'],
      },
    },
  ],

  mariage: [
    {
      key: 'serviceType',
      type: 'text',
      label: { fr: 'Prestations proposées', en: 'Services offered', es: 'Servicios ofrecidos', de: 'Angebotene Leistungen', pt: 'Serviços oferecidos' },
      placeholder: { fr: 'ex : Organisation complète, Coordination jour J, Décoration florale, EVJF', en: 'e.g. Full planning, Day-of coordination, Floral decor', es: 'ej: Organización completa, Coordinación, Decoración floral', de: 'z.B. Komplettorganisation, Tageskoordination, Floristik', pt: 'ex: Organização completa, Coordenação dia J, Decoração floral' },
    },
    {
      key: 'guestCapacity',
      type: 'text',
      label: { fr: 'Capacité (min – max invités)', en: 'Guest capacity (min – max)', es: 'Capacidad (mín – máx invitados)', de: 'Gästekapazität (min – max)', pt: 'Capacidade (mín – máx convidados)' },
      placeholder: { fr: 'ex : 20 à 200 personnes', en: 'e.g. 20 to 200 guests', es: 'ej: 20 a 200 invitados', de: 'z.B. 20 bis 200 Gäste', pt: 'ex: 20 a 200 convidados' },
    },
    {
      key: 'avgBudget',
      type: 'text',
      label: { fr: 'Budget mariage moyen accompagné', en: 'Average wedding budget managed', es: 'Presupuesto medio de bodas gestionado', de: 'Durchschnittliches Hochzeitsbudget', pt: 'Orçamento médio de casamentos gerido' },
      placeholder: { fr: 'ex : 15 000 € à 50 000 €', en: 'e.g. £10,000 to £50,000', es: 'ej: 15 000 € a 50 000 €', de: 'z.B. 15.000 € bis 50.000 €', pt: 'ex: 10 000 € a 50 000 €' },
    },
    {
      key: 'laicCeremony',
      type: 'select',
      label: { fr: 'Cérémonie laïque possible ?', en: 'Civil / secular ceremony possible?', es: '¿Ceremonia laica posible?', de: 'Standesamtliche / freie Trauung möglich?', pt: 'Cerimónia laica possível?' },
      options: {
        fr: ['Oui', 'Non', 'Uniquement'],
        en: ['Yes', 'No', 'Only'],
        es: ['Sí', 'No', 'Solo laica'],
        de: ['Ja', 'Nein', 'Nur standesamtlich'],
        pt: ['Sim', 'Não', 'Apenas'],
      },
    },
  ],

  couture: [
    {
      key: 'orderTypes',
      type: 'text',
      label: { fr: 'Types de commandes acceptées', en: 'Order types accepted', es: 'Tipos de encargos aceptados', de: 'Auftragsarten', pt: 'Tipos de encomendas aceites' },
      placeholder: { fr: 'ex : Sur mesure, Retouches, Prêt-à-porter, Collection capsule', en: 'e.g. Bespoke, Alterations, Ready-to-wear, Capsule collection', es: 'ej: A medida, Arreglos, Prêt-à-porter, Cápsula', de: 'z.B. Maßanfertigung, Änderungen, Kollektion', pt: 'ex: Sob medida, Arranjos, Prêt-à-porter' },
    },
    {
      key: 'deliveryTime',
      type: 'text',
      label: { fr: 'Délai de confection moyen', en: 'Average turnaround time', es: 'Plazo de confección medio', de: 'Durchschnittliche Fertigungszeit', pt: 'Prazo médio de confeção' },
      placeholder: { fr: 'ex : 3 à 6 semaines', en: 'e.g. 3 to 6 weeks', es: 'ej: 3 a 6 semanas', de: 'z.B. 3 bis 6 Wochen', pt: 'ex: 3 a 6 semanas' },
    },
    {
      key: 'materials',
      type: 'text',
      label: { fr: 'Matières de prédilection', en: 'Preferred materials', es: 'Materiales preferidos', de: 'Bevorzugte Materialien', pt: 'Materiais preferidos' },
      placeholder: { fr: 'ex : Soie, Lin, Laine, Upcycling, Coton bio', en: 'e.g. Silk, Linen, Wool, Upcycled, Organic cotton', es: 'ej: Seda, Lino, Lana, Algodón ecológico', de: 'z.B. Seide, Leinen, Wolle, Upcycling', pt: 'ex: Seda, Linho, Lã, Algodão biológico' },
    },
    {
      key: 'virtualConsult',
      type: 'select',
      label: { fr: 'Consultation / essayage à distance ?', en: 'Remote consultation / fitting?', es: '¿Consulta / prueba a distancia?', de: 'Fernberatung / Anprobe möglich?', pt: 'Consulta / prova à distância?' },
      options: {
        fr: ['Oui', 'Non', 'Sur demande'],
        en: ['Yes', 'No', 'On request'],
        es: ['Sí', 'No', 'A petición'],
        de: ['Ja', 'Nein', 'Auf Anfrage'],
        pt: ['Sim', 'Não', 'A pedido'],
      },
    },
  ],

  tatoueur: [
    {
      key: 'styles',
      type: 'text',
      label: { fr: 'Styles pratiqués', en: 'Styles practiced', es: 'Estilos practicados', de: 'Praktizierte Stile', pt: 'Estilos praticados' },
      placeholder: { fr: 'ex : Réalisme, Fineline, Aquarelle, Japonais, Géométrique, Old School', en: 'e.g. Realism, Fineline, Watercolour, Japanese, Geometric', es: 'ej: Realismo, Fineline, Acuarela, Japonés, Geométrico', de: 'z.B. Realismus, Fineline, Aquarell, Japanisch', pt: 'ex: Realismo, Fineline, Aquarela, Japonês' },
    },
    {
      key: 'appointmentOnly',
      type: 'select',
      label: { fr: 'Sur rendez-vous uniquement ?', en: 'By appointment only?', es: '¿Solo con cita previa?', de: 'Nur nach Termin?', pt: 'Apenas com marcação?' },
      options: {
        fr: ['Oui, sur RDV uniquement', 'Walk-in accepté', 'Walk-in et RDV'],
        en: ['Appointment only', 'Walk-ins welcome', 'Both'],
        es: ['Solo con cita', 'Se aceptan sin cita', 'Ambos'],
        de: ['Nur nach Termin', 'Walk-ins willkommen', 'Beides'],
        pt: ['Apenas marcação', 'Walk-ins aceites', 'Ambos'],
      },
    },
    {
      key: 'flashAvail',
      type: 'select',
      label: { fr: 'Flash disponibles ?', en: 'Flash designs available?', es: '¿Flash disponibles?', de: 'Flash-Designs verfügbar?', pt: 'Designs flash disponíveis?' },
      options: {
        fr: ['Oui, sur Instagram', 'Oui, en studio', 'Non, sur-mesure uniquement'],
        en: ['Yes, on Instagram', 'Yes, in studio', 'No, custom only'],
        es: ['Sí, en Instagram', 'Sí, en el estudio', 'No, solo personalizados'],
        de: ['Ja, auf Instagram', 'Ja, im Studio', 'Nein, nur individuell'],
        pt: ['Sim, no Instagram', 'Sim, no estúdio', 'Não, só personalizados'],
      },
    },
    {
      key: 'touchUpPolicy',
      type: 'text',
      label: { fr: 'Politique de retouche', en: 'Touch-up policy', es: 'Política de retoques', de: 'Nachstechen-Politik', pt: 'Política de retoques' },
      placeholder: { fr: 'ex : Retouche gratuite dans les 3 mois', en: 'e.g. Free touch-up within 3 months', es: 'ej: Retoque gratuito en 3 meses', de: 'z.B. Kostenlos nachstechen binnen 3 Monaten', pt: 'ex: Retoque gratuito em 3 meses' },
    },
  ],

  paysagiste: [
    {
      key: 'serviceTypes',
      type: 'text',
      label: { fr: 'Types de prestations', en: 'Service types', es: 'Tipos de servicios', de: 'Leistungsarten', pt: 'Tipos de serviços' },
      placeholder: { fr: 'ex : Création de jardin, Entretien, Terrasses, Piscine, Arrosage automatique', en: 'e.g. Garden design, Maintenance, Terraces, Pool, Irrigation', es: 'ej: Diseño de jardín, Mantenimiento, Terrazas, Piscina', de: 'z.B. Gartengestaltung, Pflege, Terrassen, Pool, Bewässerung', pt: 'ex: Design jardim, Manutenção, Terraços, Piscina, Rega' },
    },
    {
      key: 'interventionZone',
      type: 'text',
      label: { fr: 'Zone d\'intervention', en: 'Coverage area', es: 'Zona de actuación', de: 'Einsatzgebiet', pt: 'Zona de intervenção' },
      placeholder: { fr: 'ex : Bordeaux et 50 km autour', en: 'e.g. London and 50 km radius', es: 'ej: Barcelona y 50 km alrededor', de: 'z.B. München und Umgebung 50 km', pt: 'ex: Porto e 50 km em redor' },
    },
    {
      key: 'ecoApproach',
      type: 'select',
      label: { fr: 'Approche écologique / plantes locales ?', en: 'Ecological / native plants approach?', es: '¿Enfoque ecológico / plantas autóctonas?', de: 'Ökologischer Ansatz / heimische Pflanzen?', pt: 'Abordagem ecológica / plantas autóctones?' },
      options: {
        fr: ['Oui, c\'est notre cœur de métier', 'Oui, option proposée', 'Non'],
        en: ['Yes, it\'s our core approach', 'Yes, offered as option', 'No'],
        es: ['Sí, es nuestro enfoque principal', 'Sí, como opción', 'No'],
        de: ['Ja, unser Kernansatz', 'Ja, als Option', 'Nein'],
        pt: ['Sim, é a nossa abordagem principal', 'Sim, como opção', 'Não'],
      },
    },
    {
      key: 'maintenanceContract',
      type: 'select',
      label: { fr: 'Contrats d\'entretien annuels ?', en: 'Annual maintenance contracts?', es: '¿Contratos de mantenimiento anuales?', de: 'Jährliche Pflegeverträge?', pt: 'Contratos anuais de manutenção?' },
      options: {
        fr: ['Oui', 'Non', 'Sur demande'],
        en: ['Yes', 'No', 'On request'],
        es: ['Sí', 'No', 'A petición'],
        de: ['Ja', 'Nein', 'Auf Anfrage'],
        pt: ['Sim', 'Não', 'A pedido'],
      },
    },
  ],

  restaurant: [
    {
      key: 'cuisineType',
      type: 'text',
      label: { fr: 'Type de cuisine', en: 'Cuisine type', es: 'Tipo de cocina', de: 'Küchenstil', pt: 'Tipo de cozinha' },
      placeholder: { fr: 'ex : Gastronomique française, Méditerranéenne, Fusion asiatique', en: 'e.g. French gastronomic, Mediterranean, Asian fusion', es: 'ej: Francesa gourmet, Mediterránea, Fusión asiática', de: 'z.B. Französische Küche, Mediterran, Fusion', pt: 'ex: Francesa gourmet, Mediterrânea, Fusão asiática' },
    },
    {
      key: 'openingHours',
      type: 'text',
      label: { fr: 'Horaires d\'ouverture', en: 'Opening hours', es: 'Horario de apertura', de: 'Öffnungszeiten', pt: 'Horário de funcionamento' },
      placeholder: { fr: 'ex : Mar-Dim 12h-14h30 et 19h-22h30', en: 'e.g. Tue-Sun 12pm-2:30pm and 7pm-10:30pm', es: 'ej: Mar-Dom 12h-14h30 y 19h-22h30', de: 'z.B. Di-So 12-14:30 und 19-22:30 Uhr', pt: 'ex: Ter-Dom 12h-14h30 e 19h-22h30' },
    },
    {
      key: 'reservation',
      type: 'select',
      label: { fr: 'Réservation', en: 'Reservations', es: 'Reservas', de: 'Reservierungen', pt: 'Reservas' },
      options: {
        fr: ['En ligne (TheFork / Resy)', 'Par téléphone uniquement', 'En ligne + téléphone', 'Sans réservation'],
        en: ['Online (OpenTable / Resy)', 'Phone only', 'Online + phone', 'Walk-ins only'],
        es: ['Online (ElTenedor)', 'Solo teléfono', 'Online + teléfono', 'Sin reserva'],
        de: ['Online (TheFork)', 'Nur telefonisch', 'Online + Telefon', 'Keine Reservierung'],
        pt: ['Online (The Fork)', 'Só telefone', 'Online + telefone', 'Sem reserva'],
      },
    },
    {
      key: 'covers',
      type: 'text',
      label: { fr: 'Nombre de couverts', en: 'Seating capacity', es: 'Número de cubiertos', de: 'Sitzplätze', pt: 'Número de lugares' },
      placeholder: { fr: 'ex : 40 couverts en salle, 20 en terrasse', en: 'e.g. 40 inside, 20 on terrace', es: 'ej: 40 en sala, 20 en terraza', de: 'z.B. 40 innen, 20 auf der Terrasse', pt: 'ex: 40 na sala, 20 na esplanada' },
    },
    {
      key: 'chefStory',
      type: 'textarea',
      label: { fr: 'Histoire du chef / de la maison (2-3 phrases)', en: 'Chef / restaurant story (2-3 sentences)', es: 'Historia del chef / del restaurante (2-3 frases)', de: 'Geschichte des Chefs / des Restaurants', pt: 'História do chef / do restaurante (2-3 frases)' },
      placeholder: { fr: 'ex : "Julien Moreau, formé aux côtés de Michel Bras, ouvre cette table en 2018…"', en: 'e.g. "Chef Emma Davies trained under Gordon Ramsay and opened this restaurant in 2018…"', es: 'ej: "El chef Carlos López, formado en el Bulli, abre este restaurante en 2018…"', de: 'z.B. "Küchenchef Thomas Müller, ausgebildet bei…"', pt: 'ex: "O chef João Silva, formado com Henrique Sá Pessoa, abre este restaurante em 2018…"' },
    },
  ],

  restauration_rapide: [
    {
      key: 'cuisineType',
      type: 'text',
      label: { fr: 'Type de restauration rapide', en: 'Fast food type', es: 'Tipo de comida rápida', de: 'Fast-Food-Typ', pt: 'Tipo de fast food' },
      placeholder: { fr: 'ex : Burgers, Pizza, Kebab, Sushi, Tacos, Poké bowls', en: 'e.g. Burgers, Pizza, Kebab, Sushi, Tacos, Poké bowls', es: 'ej: Hamburguesas, Pizza, Kebab, Sushi, Tacos', de: 'z.B. Burger, Pizza, Döner, Sushi, Tacos', pt: 'ex: Hambúrgueres, Pizza, Kebab, Sushi, Tacos' },
    },
    {
      key: 'delivery',
      type: 'select',
      label: { fr: 'Livraison à domicile ?', en: 'Home delivery?', es: '¿Entrega a domicilio?', de: 'Lieferservice?', pt: 'Entrega ao domicílio?' },
      options: {
        fr: ['Oui (Uber Eats / Deliveroo / Just Eat)', 'Oui, livraison propre', 'Non, sur place uniquement'],
        en: ['Yes (Uber Eats / Deliveroo / Just Eat)', 'Yes, own delivery', 'No, eat-in only'],
        es: ['Sí (Uber Eats / Glovo / JustEat)', 'Sí, reparto propio', 'No, solo local'],
        de: ['Ja (Lieferando / Uber Eats)', 'Ja, eigener Lieferdienst', 'Nein, nur vor Ort'],
        pt: ['Sim (Uber Eats / Glovo)', 'Sim, entrega própria', 'Não, só no local'],
      },
    },
    {
      key: 'clickCollect',
      type: 'select',
      label: { fr: 'Click & Collect ?', en: 'Click & Collect?', es: '¿Click & Collect?', de: 'Click & Collect?', pt: 'Click & Collect?' },
      options: {
        fr: ['Oui', 'Non', 'En cours'],
        en: ['Yes', 'No', 'Coming soon'],
        es: ['Sí', 'No', 'Próximamente'],
        de: ['Ja', 'Nein', 'Demnächst'],
        pt: ['Sim', 'Não', 'Em breve'],
      },
    },
    {
      key: 'openingHours',
      type: 'text',
      label: { fr: 'Horaires d\'ouverture', en: 'Opening hours', es: 'Horario de apertura', de: 'Öffnungszeiten', pt: 'Horário de funcionamento' },
      placeholder: { fr: 'ex : Tous les jours 11h-23h', en: 'e.g. Every day 11am-11pm', es: 'ej: Todos los días 11h-23h', de: 'z.B. Täglich 11-23 Uhr', pt: 'ex: Todos os dias 11h-23h' },
    },
    {
      key: 'avgTicket',
      type: 'text',
      label: { fr: 'Ticket moyen', en: 'Average ticket', es: 'Ticket medio', de: 'Durchschnittlicher Bon', pt: 'Ticket médio' },
      placeholder: { fr: 'ex : 10 € – 15 €', en: 'e.g. £8 – £12', es: 'ej: 10 € – 15 €', de: 'z.B. 10 € – 15 €', pt: 'ex: 10 € – 15 €' },
    },
  ],
};
