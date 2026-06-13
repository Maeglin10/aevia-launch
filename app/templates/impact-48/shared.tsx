"use client";

import React from "react";
import { motion } from "framer-motion";

export const C = {
  bg: '#fafaf7',
  bgDark: '#0f0f0f',
  bgCard: '#f4f3ef',
  text: '#0f0f0f',
  textMuted: '#5a5a52',
  textDim: '#9a9a90',
  accent: '#c9a84c',
  accentDim: 'rgba(201,168,76,0.18)',
  accentBorder: 'rgba(201,168,76,0.35)',
  border: 'rgba(15,15,15,0.08)',
  borderLight: 'rgba(15,15,15,0.04)',
  white: '#ffffff',
  gold: '#c9a84c',
};

export const F = {
  serif: "'Georgia', 'Times New Roman', serif",
  sans: "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
};

export const globalCss = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.bg}; color: ${C.text}; font-family: ${F.sans}; -webkit-font-smoothing: antialiased; }
  button { cursor: pointer; background: none; border: none; font: inherit; }
  a { text-decoration: none; }

  @keyframes draw-in {
    from { stroke-dashoffset: var(--total-length, 2000); }
    to   { stroke-dashoffset: 0; }
  }

  .blueprint-line {
    stroke-dasharray: var(--total-length, 2000);
    stroke-dashoffset: var(--total-length, 2000);
    animation: none;
  }

  .blueprint-line.animate {
    animation: draw-in 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .blueprint-line-2 {
    stroke-dasharray: var(--total-length, 1400);
    stroke-dashoffset: var(--total-length, 1400);
    animation: none;
  }

  .blueprint-line-2.animate {
    animation: draw-in 2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  }

  .blueprint-line-3 {
    stroke-dasharray: var(--total-length, 800);
    stroke-dashoffset: var(--total-length, 800);
    animation: none;
  }

  .blueprint-line-3.animate {
    animation: draw-in 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
  }

  @media (max-width: 900px) {
    .two-col { grid-template-columns: 1fr !important; }
    .three-col { grid-template-columns: 1fr !important; }
    .four-col { grid-template-columns: 1fr 1fr !important; }
  }
`;

export const navLinks = [
  { label: 'Accueil', href: '/templates/impact-48' },
  { label: 'Services', href: '/templates/impact-48/services' },
  { label: 'Projets', href: '/templates/impact-48/projects' },
  { label: 'Blog', href: '/templates/impact-48/blog' },
  { label: 'À propos', href: '/templates/impact-48/about' },
];

export const projects = [
  {
    id: 'p1',
    title: 'Maison Éclat',
    category: 'Private Residence',
    location: 'Geneva, CH',
    year: '2024',
    area: '640 m²',
    color: '#1a1a16',
    description:
      'A monolithic lakeside villa that reinterprets the Swiss chalet typology through elemental concrete and reclaimed oak. The building steps down the hillside in three planar volumes, each cantilevering over the one below to frame axial views of Lac Léman. Interior circulation is conceived as a promenade architecturale — each threshold reveals a new horizon.',
    specs: ['Reinforced concrete', 'Reclaimed white oak', 'Cantilevered terraces', 'Passive house standard'],
  },
  {
    id: 'p2',
    title: 'Tour Silhouette',
    category: 'Mixed-Use Tower',
    location: 'Paris 13e, FR',
    year: '2023',
    area: '18 400 m²',
    color: '#0d1a2a',
    description:
      'A 22-storey mixed-use tower in Paris\'s emerging Masséna district. The facade is composed of a unitised curtain wall where each panel carries a bronze anodised sunscreen fin, rotated between 0° and 45° according to solar orientation. The tower tapers at its crown, reading from the Seine as a vertical sliver that disappears into sky.',
    specs: ['Bronze anodised aluminium', 'Unitised curtain wall', 'Underground parking', 'BREEAM Excellent'],
  },
  {
    id: 'p3',
    title: 'Bibliothèque Luce',
    category: 'Cultural Institution',
    location: 'Lyon, FR',
    year: '2023',
    area: '4 200 m²',
    color: '#1a1208',
    description:
      'A public library conceived as a luminous lantern set into a 19th-century urban block. The reading rooms occupy a new top-lit volume inserted within the historic shell. Structural steel trusses transfer loads across the void, leaving the perimeter walls free of columns. The facade reopens as a sequence of bookshop vitrines activating the street.',
    specs: ['Exposed steel trusses', 'Heritage integration', 'Zenithal daylighting', 'LEED Gold'],
  },
  {
    id: 'p4',
    title: 'Résidence Terrasses',
    category: 'Collective Housing',
    location: 'Bordeaux, FR',
    year: '2022',
    area: '8 800 m²',
    color: '#12140a',
    description:
      'Seventy-two apartments organised around a communal garden court. Each unit is given a deep loggia — a private exterior room rather than a balcony — creating a layered facade that reads as solid and void in equal measure. The plan provides four apartment typologies while maintaining a consistent structural grid.',
    specs: ['Load-bearing brick', 'In-situ concrete', 'Deep loggias', 'BBC-Effinergie label'],
  },
  {
    id: 'p5',
    title: 'Siège Heliogen',
    category: 'Corporate HQ',
    location: 'Luxembourg City',
    year: '2022',
    area: '11 600 m²',
    color: '#0f0f14',
    description:
      'A headquarters building whose section is driven by workplace research rather than lettable floor plate efficiency. Three stacked "villages" of 3,800 m² are connected by generous interior staircases and shared terraces. The ground floor is fully public, containing a café, auditorium, and maker space accessible without security clearance.',
    specs: ['CLT structure', 'Biophilic interiors', 'Public ground floor', 'Carbon neutral'],
  },
  {
    id: 'p6',
    title: 'Villa Radieuse',
    category: 'Private Residence',
    location: 'Côte d\'Azur, FR',
    year: '2021',
    area: '420 m²',
    color: '#1a0f0a',
    description:
      'A clifftop house in white concrete and travertine whose plan rotates 11° from the grid to align every principal room with the sea horizon. An infinity pool at terrace level becomes a reflecting surface for the facade, doubling the building in light. All mechanical systems are buried within the hillside to the north.',
    specs: ['White in-situ concrete', 'Roman travertine', 'Infinity pool', 'Geothermal HVAC'],
  },
];

export const teamMembers = [
  {
    name: 'Isabelle Moreau',
    title: 'Founding Principal',
    credentials: 'DPLG · Pritzker Jury 2022',
    focus: 'Design vision, institutional work, competition strategy',
    bio: 'Isabelle established the studio in 2001 following seven years at OMA Rotterdam. Her work has been exhibited at the Venice Biennale three times and received the Grand Prix National de l\'Architecture in 2019.',
    projects: '62 built',
    awards: '28 prizes',
  },
  {
    name: 'Thomas Leroy',
    title: 'Principal — Technical',
    credentials: 'DPLG · LEED AP',
    focus: 'Building technology, facade engineering, sustainability',
    bio: 'Thomas leads technical delivery on all major projects. His command of structural and envelope systems bridges the gap between design ambition and construction reality, enabling forms that other offices consider unbuildable.',
    projects: '48 built',
    awards: '11 prizes',
  },
  {
    name: 'Sadia Rahman',
    title: 'Associate — Research',
    credentials: 'MArch Cambridge · PhD ENSA Paris',
    focus: 'Housing typology, post-occupancy evaluation, urban strategy',
    bio: 'Sadia directs the studio\'s research agenda and manages relationships with academic institutions. Her doctoral work on the social life of corridors has influenced the studio\'s approach to circulation as collective space.',
    projects: '19 built',
    awards: '6 prizes',
  },
];

export const processSteps = [
  { num: '01', title: 'Brief & Analysis', desc: 'We interrogate the brief until it becomes a genuine set of design questions. Site visits, precedent studies, and stakeholder workshops before a line is drawn.' },
  { num: '02', title: 'Concept', desc: 'A single coherent idea — spatial, material, or structural — that can survive the entire project. We resist clever moves that cannot be built, maintained, or explained.' },
  { num: '03', title: 'Design Development', desc: 'Iterative refinement through physical models, 1:20 section studies, and mock-ups. We resolve detail before RIBA Stage 3 so that Stage 4 is verification, not invention.' },
  { num: '04', title: 'Technical & Delivery', desc: 'Full technical packages authored in-house. We prefer Design & Build tender routes that keep us close to the construction process through Practical Completion.' },
];

export const serviceDetails = [
  {
    n: '01',
    title: 'Architecture',
    desc: "De la maison individuelle à l'équipement public, nous concevons des bâtiments pensés pour durer — sobres, structurellement honnêtes et généreux dans leurs espaces.",
    points: [
      'Maisons et villas privées',
      'Logement collectif et résidences',
      'Équipements culturels et publics',
      'Sièges et bâtiments tertiaires',
    ],
  },
  {
    n: '02',
    title: 'Urbanisme',
    desc: "We work on the scale of blocks, districts and towns. Each project has a civic duty: repair the urban fabric rather than enclose it.",
    points: [
      'Plans-guides et études urbaines',
      'Aménagement d\'espaces publics',
      'Stratégies de densification douce',
      'Concours et consultations urbaines',
    ],
  },
  {
    n: '03',
    title: 'Architecture intérieure',
    desc: "L'intérieur prolonge l'architecture : même rigueur, mêmes matériaux. Nous dessinons les ambiances, la lumière et le mobilier sur mesure jusqu'au moindre détail.",
    points: [
      'Aménagements résidentiels haut de gamme',
      'Espaces de travail et lieux de réception',
      'Mobilier et agencements sur mesure',
      'Scénographie et muséographie',
    ],
  },
  {
    n: '04',
    title: 'Rénovation & patrimoine',
    desc: "Intervenir sur l'existant exige humilité et précision. Nous réhabilitons le bâti ancien en révélant sa structure et en l'adaptant aux usages contemporains.",
    points: [
      'Réhabilitation de bâti ancien',
      'Intégration en site classé',
      'Surélévations et extensions',
      'Mise aux normes et performance énergétique',
    ],
  },
  {
    n: '05',
    title: 'Maîtrise d\'œuvre',
    desc: "Nous assurons la mission complète, de l'esquisse à la réception du chantier. Un interlocuteur unique, des dossiers techniques rédigés en interne, un suivi de chantier rapproché.",
    points: [
      'Études de faisabilité et esquisse',
      'Avant-projet et permis de construire',
      'Dossier de consultation des entreprises',
      'Direction et suivi des travaux',
    ],
  },
  {
    n: '06',
    title: 'Conseil & faisabilité',
    desc: "En amont de tout projet, nous éclairons vos décisions : potentiel d'un terrain, programme, budget et calendrier réalistes, avant le moindre engagement.",
    points: [
      'Analyse de site et de constructibilité',
      'Programmation et budgétisation',
      'Accompagnement à l\'acquisition foncière',
      'Expertise et second regard',
    ],
  },
];

export const studioValues = [
  { n: '01', title: 'Pérennité', text: "Nous bâtissons pour le siècle à venir. Des matériaux robustes, une structure assumée et des espaces généreux : des bâtiments faits pour être aimés et entretenus, non démolis." },
  { n: '02', title: 'Honnêteté', text: "Le béton ressemble au béton, la brique à la brique. Nous n'appliquons pas de placages pour simuler d'autres matières. L'authenticité vieillit mieux que la nouveauté." },
  { n: '03', title: 'Générosité urbaine', text: "Chaque édifice a une responsabilité civique : un rez-de-chaussée actif, une colonnade publique, un retrait planté. De petits gestes qui réparent la ville." },
];

export const blogPosts = [
  {
    slug: 'beton-brut',
    title: 'Le béton brut : matière noble ou parti-pris radical ?',
    date: '4 juin 2026',
    category: 'Matériaux',
    excerpt:
      "Décrié puis réhabilité, le béton apparent traverse les modes. Retour sur une matière qui exige une maîtrise totale du détail pour révéler sa beauté.",
    cover: '#1a1a16',
    body: [
      "Le béton brut de décoffrage — le fameux « béton apparent » — n'admet aucune approximation. Contrairement à un mur enduit, il porte la trace indélébile de sa fabrication : la texture du coffrage, les joints, les balèvres, les nuances de teinte.",
      "Cette exigence est précisément ce qui en fait une matière noble. Réussir un béton apparent suppose un calepinage des banches dessiné comme une façade, une formulation contrôlée et un savoir-faire d'entreprise irréprochable sur le chantier.",
      "Nous privilégions le béton matricé ou poli pour les espaces de réception, et le béton brut pour les éléments structurels que nous souhaitons exposer. Dans tous les cas, le béton n'est jamais un revêtement : il est la structure elle-même, donnée à voir.",
      "Bien mis en œuvre, le béton vieillit avec dignité. Sa masse thermique en fait par ailleurs un allié précieux du confort d'été, enjeu majeur de l'architecture des prochaines décennies.",
    ],
  },
  {
    slug: 'lumiere-naturelle',
    title: 'Concevoir avec la lumière naturelle',
    date: '20 mai 2026',
    category: 'Conception',
    excerpt:
      "Avant d'être une question d'énergie, la lumière naturelle est la matière première de l'architecture. Comment l'orchestrer du premier croquis au détail de menuiserie.",
    cover: '#1a1208',
    body: [
      "« Nous dessinons les sections avant les plans » : cet adage du studio tient en grande partie à la lumière. C'est la coupe qui détermine la manière dont le jour pénètre, ricoche et descend dans les espaces.",
      "Nous distinguons trois lumières : la lumière latérale, douce et orientée, qui qualifie les pièces de vie ; la lumière zénithale, égale et silencieuse, idéale pour les lieux de lecture ou d'exposition ; et la lumière rasante, qui révèle la texture des matériaux.",
      "Chaque ouverture est un arbitrage entre apport solaire, vues et confort. Les brise-soleil, les loggias profondes et les embrasures travaillées ne sont pas des ajouts décoratifs : ce sont des instruments de maîtrise de la lumière.",
      "Une architecture bien éclairée consomme moins, mais surtout, elle se vit mieux. La qualité d'un espace se mesure d'abord à la façon dont la lumière y évolue au fil des heures et des saisons.",
    ],
  },
  {
    slug: 'sobriete-construction',
    title: 'Sobriété constructive : moins, mais mieux',
    date: '6 mai 2026',
    category: 'Durabilité',
    excerpt:
      "Le bâtiment le plus écologique est souvent celui qu'on ne construit pas. Plaidoyer pour une architecture qui réemploie, conserve et n'ajoute qu'à bon escient.",
    cover: '#12140a',
    body: [
      "La construction neuve concentre une part considérable des émissions de carbone du secteur. La première question d'un projet responsable n'est donc pas « comment construire ? » mais « faut-il construire ? ».",
      "La réhabilitation du bâti existant, le réemploi des matériaux et la conservation des structures porteuses permettent souvent d'éviter l'énergie grise d'une démolition-reconstruction. Nous indiquons systématiquement cette hypothèse en amont.",
      "Lorsque la construction neuve s'impose, nous privilégions les matériaux biosourcés et géosourcés — bois, terre crue, pierre locale — et une structure dimensionnée au plus juste. La sobriété n'est pas une contrainte esthétique, c'est une discipline.",
      "Construire moins mais mieux suppose d'accepter une forme d'humilité : renoncer au geste gratuit, préférer la durabilité au spectaculaire. C'est, selon nous, la condition d'une architecture véritablement contemporaine.",
    ],
  },
  {
    slug: 'concours-architecture',
    title: 'Anatomie d\'un concours d\'architecture',
    date: '22 avril 2026',
    category: 'Studio',
    excerpt:
      "Comment naît un projet primé ? Coulisses de la démarche de concours, de la lecture du programme à la maquette finale, au sein de l'atelier.",
    cover: '#0d1a2a',
    body: [
      "Le concours est un exercice singulier : produire, en quelques semaines, une réponse architecturale complète à partir d'un programme et d'un site que l'on découvre. C'est aussi le moment où l'identité du studio s'exprime le plus librement.",
      "Tout commence par une lecture critique du programme. Nous cherchons la question que le maître d'ouvrage n'a pas formulée mais que le projet devra résoudre — un parti-pris fort, capable de tenir tout au long du développement.",
      "Vient ensuite l'itération : esquisses, maquettes d'étude au 1:200, coupes successives. Nous testons, abandonnons, recommençons. Une idée qui ne survit pas à la maquette ne survivra pas au chantier.",
      "La maquette finale et les images de concours doivent dire l'essentiel : l'ambiance, la lumière, le rapport au lieu. Un concours se gagne rarement sur la prouesse technique — il se gagne sur la justesse d'une intention clairement transmise.",
    ],
  },
];

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <section
      style={{
        background: C.bgDark,
        padding: '150px 40px 90px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Top gold line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
        }}
      />
      {/* Blueprint grid watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent 0, transparent 47px, rgba(201,168,76,0.03) 48px),
            repeating-linear-gradient(90deg, transparent 0, transparent 47px, rgba(201,168,76,0.03) 48px)
          `,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 2 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 28,
          }}
        >
          <div style={{ width: 48, height: 1, background: C.accent }} />
          <span
            style={{
              fontFamily: F.sans,
              fontSize: 10,
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              color: C.accent,
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </span>
        </div>
        <h1
          style={{
            fontFamily: F.sans,
            fontSize: 'clamp(44px, 5.5vw, 80px)',
            fontWeight: 700,
            color: C.white,
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
            margin: subtitle ? '0 0 28px' : 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontFamily: F.sans,
              fontSize: 16,
              color: 'rgba(255,255,255,0.48)',
              lineHeight: 1.8,
              maxWidth: 560,
              margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}
