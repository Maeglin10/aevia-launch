'use client';

import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Font Loader ─────────────────────────────────────────────────────────────
const useFonts = () => {
  useEffect(() => {
    if (document.getElementById('gp-fonts-v2')) return;
    const s = document.createElement('style');
    s.id = 'gp-fonts-v2';
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
    `;
    document.head.appendChild(s);
  }, []);
};

// ─── Design Tokens ───────────────────────────────────────────────────────────
const CREAM   = '#f5f0e8';
const DARK    = '#1a1208';
const GOLD    = '#b8965a';
const GOLD_DIM = '#8a6f3e';
const CREAM_DIM = '#ede5d4';
const MID     = '#2e2318';

const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS  = "'Jost', system-ui, sans-serif";

// ─── Data ────────────────────────────────────────────────────────────────────
const ROOMS = [
  {
    num: '01',
    name: 'Prestige Room',
    size: '38 m²',
    view: 'Courtyard Garden',
    price: '€480',
    tag: 'Most Requested',
    desc: 'A sanctuary of refined calm. Hand-stitched linen, aged oak flooring, and a private terrace overlooking the sculpted inner garden.',
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85',
  },
  {
    num: '02',
    name: 'Deluxe Suite',
    size: '65 m²',
    view: 'Panoramic Park',
    price: '€780',
    tag: 'Guest Favourite',
    desc: 'Soaring ceilings, a double marble bathroom, and floor-to-ceiling windows that frame the park like a living painting.',
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85',
  },
  {
    num: '03',
    name: 'Grand Suite',
    size: '110 m²',
    view: 'City Skyline',
    price: '€1,200',
    tag: 'Signature',
    desc: 'Our most coveted address. A private dining room, butler antechamber, and a rooftop terrace overlooking the golden skyline at dusk.',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
  },
];

const EXPERIENCES = [
  {
    label: 'L\'Atelier',
    sub: 'Two Michelin Stars',
    desc: 'Chef Margaux Vernet elevates classical French gastronomy with ingredients sourced from our estate gardens and trusted regional producers.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=85',
  },
  {
    label: 'Espace Étoile',
    sub: 'Spa & Thermal Circuit',
    desc: 'Seven treatment rooms, a Roman hammam, and a 25m heated pool. Every ritual is bespoke, every moment restorative.',
    img: 'https://images.unsplash.com/photo-1540541338537-1220059a0de6?w=1000&q=85',
  },
  {
    label: 'Bar Lumière',
    sub: 'Rare Spirits & Cellar',
    desc: 'An intimate bar presided over by our Maître d\'Alcools. Three thousand labels. One extraordinary conversation.',
    img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1000&q=85',
  },
];

const STATS = [
  { n: '1887', l: 'Founded' },
  { n: '87',   l: 'Rooms & Suites' },
  { n: '2 ✦',  l: 'Michelin Stars' },
  { n: '4',    l: 'Hectares of Gardens' },
];

const NAV_LINKS = ['Rooms', 'Experiences', 'Dining', 'Location', 'Reserve'];

// ─── Multi-page navigation config ─────────────────────────────────────────────
// PATTERN (reused identically from impact-46 / impact-48 vitrine themes): a single
// `page` state drives in-page navigation. The original single-page content renders
// VERBATIM under page === "home"; every other key renders a theme-native sub-page
// built from the SAME tokens (CREAM/DARK/GOLD…), fonts (Cormorant Garamond + Jost)
// and section/card styling. Additive only — the home experience is untouched.
type HotelPage =
  | 'home'
  | 'chambres'
  | 'services'
  | 'blog'
  | 'contact'
  | 'mentions'
  | 'privacy';

const NAV_PAGES: { key: HotelPage; label: string }[] = [
  { key: 'home', label: 'Accueil' },
  { key: 'chambres', label: 'Chambres' },
  { key: 'services', label: 'Services' },
  { key: 'blog', label: 'Blog' },
  { key: 'contact', label: 'Contact' },
  { key: 'mentions', label: 'Mentions légales' },
];

// ─── Fuller rooms & suites catalogue (Chambres sub-page) ──────────────────────
type RoomFull = {
  slug: string;
  name: string;
  size: string;
  view: string;
  price: string;
  tag: string;
  desc: string;
  long: string;
  img: string;
  gallery: string[];
  amenities: string[];
};

const ROOMS_FULL: RoomFull[] = [
  {
    slug: 'prestige-room',
    name: 'Prestige Room',
    size: '38 m²',
    view: 'Jardin intérieur',
    price: '€480',
    tag: 'La plus demandée',
    desc: "Un havre de calme raffiné. Lin brodé à la main, parquet de chêne ancien et terrasse privative sur le jardin sculpté.",
    long: "Nichée autour du jardin intérieur, la Prestige Room incarne l'art de vivre du Grand Palais dans sa forme la plus essentielle. Chaque matière y a été choisie pour le toucher autant que pour l'œil : linge de maison brodé à la main, parquet de chêne patiné par le temps, marbre veiné dans la salle de bain. Une terrasse privative ouvre sur le jardin sculpté, refuge de silence au cœur de la ville.",
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=85',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
    ],
    amenities: ['Terrasse privative', 'Lit king-size en lin', 'Salle de bain en marbre', 'Service de majordome', 'Wi-Fi fibre', 'Minibar de prestige'],
  },
  {
    slug: 'deluxe-suite',
    name: 'Deluxe Suite',
    size: '65 m²',
    view: 'Parc panoramique',
    price: '€780',
    tag: 'Coup de cœur',
    desc: "Plafonds vertigineux, double salle de bain en marbre et baies vitrées qui encadrent le parc comme un tableau vivant.",
    long: "La Deluxe Suite déploie ses volumes généreux sous des plafonds à la française. Les baies toute hauteur cadrent le parc comme une toile en perpétuel mouvement, du premier feuillage du printemps aux ors de l'automne. Un salon distinct, une double salle de bain en marbre de Carrare et un dressing complet en font une adresse à part entière, pensée pour les séjours qui s'étirent.",
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85',
    ],
    amenities: ['Salon séparé', 'Double salle de bain en marbre', 'Dressing complet', 'Vue panoramique sur le parc', 'Machine à café de barista', 'Service de majordome'],
  },
  {
    slug: 'grand-suite',
    name: 'Grand Suite',
    size: '110 m²',
    view: 'Skyline de la ville',
    price: '€1,200',
    tag: 'Signature',
    desc: "Notre adresse la plus convoitée. Salle à manger privée, antichambre de majordome et terrasse sur les toits.",
    long: "Joyau de la maison, la Grand Suite occupe l'angle le plus prisé du palace. Une salle à manger privée accueille jusqu'à huit convives, une antichambre dédie un espace au majordome attaché à la suite, et la terrasse sur les toits embrasse le skyline doré au crépuscule. Ici, chaque détail relève du sur-mesure, du choix des oreillers à la carte des thés rares.",
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85',
    ],
    amenities: ['Salle à manger privée', 'Terrasse sur les toits', 'Majordome dédié 24h/24', 'Antichambre de réception', 'Cave à vins privée', 'Accès spa illimité'],
  },
  {
    slug: 'suite-presidentielle',
    name: 'Suite Présidentielle',
    size: '180 m²',
    view: 'Vue 360° sur la ville',
    price: '€2,800',
    tag: 'Exception',
    desc: "L'expression ultime du séjour. Deux chambres, bibliothèque, piano à queue et terrasse-jardin suspendue.",
    long: "Au dernier étage du Grand Palais, la Suite Présidentielle s'étend sur cent quatre-vingts mètres carrés d'élégance absolue. Deux chambres principales, une bibliothèque lambrissée, un piano à queue accordé chaque semaine et une terrasse-jardin suspendue offrant une vue à 360° composent le décor d'un séjour sans équivalent. Chef privé, voiture avec chauffeur et conciergerie personnelle complètent l'expérience.",
    img: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85',
    ],
    amenities: ['Deux chambres principales', 'Bibliothèque & piano à queue', 'Terrasse-jardin suspendue', 'Chef privé sur demande', 'Voiture avec chauffeur', 'Conciergerie personnelle'],
  },
];

// ─── Hotel services / experiences (Services sub-page) ─────────────────────────
const SERVICES = [
  {
    glyph: '✦',
    label: 'Espace Étoile',
    sub: 'Spa & circuit thermal',
    desc: "Sept cabines de soin, un hammam romain et une piscine chauffée de 25 mètres. Chaque rituel est sur-mesure, chaque instant restaurateur.",
    img: 'https://images.unsplash.com/photo-1540541338537-1220059a0de6?w=1000&q=85',
    points: ['Hammam romain & sauna', 'Piscine chauffée 25 m', 'Soins signature sur-mesure', 'Salle de fitness 24h/24'],
  },
  {
    glyph: '✶',
    label: "L'Atelier",
    sub: 'Restaurant deux étoiles',
    desc: "La cheffe Margaux Vernet réinvente le canon français avec des produits cultivés à cinquante mètres des cuisines. Le menu dégustation change avec la lune.",
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=85',
    points: ['Menu dégustation saisonnier', 'Potager du domaine', 'Accord mets & vins', 'Table du chef privatisable'],
  },
  {
    glyph: '◈',
    label: 'Bar Lumière',
    sub: 'Spiritueux rares & cave',
    desc: "Un bar intime présidé par notre Maître d'Alcools. Trois mille références. Une conversation extraordinaire.",
    img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1000&q=85',
    points: ['3000 références', 'Maître d\'Alcools dédié', 'Cocktails signatures', 'Soirées dégustation privées'],
  },
  {
    glyph: '◎',
    label: 'Conciergerie Clefs d\'Or',
    sub: 'Disponible 24 heures sur 24',
    desc: "Réservations, transferts privés, accès culturels d'exception : notre conciergerie compose chaque séjour comme une partition unique.",
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&q=85',
    points: ['Transferts privés & jet', 'Accès culturels exclusifs', 'Réservations spectacles', 'Personal shopping'],
  },
  {
    glyph: '❖',
    label: 'Événements privés',
    sub: 'Salons & jardins d\'honneur',
    desc: "Mariages, dîners de gala, séminaires de direction : nos salons d'apparat et nos quatre hectares de jardins accueillent vos plus belles occasions.",
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&q=85',
    points: ['Salons d\'apparat', '4 hectares de jardins', 'Traiteur étoilé', 'Coordination dédiée'],
  },
  {
    glyph: '✧',
    label: 'Voiture & chauffeur',
    sub: 'Mobilité d\'exception',
    desc: "Une flotte de berlines de prestige et de chauffeurs discrets pour rejoindre l'aéroport ou parcourir la ville en toute sérénité.",
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=85',
    points: ['Berlines de prestige', 'Chauffeurs anglophones', 'Transferts aéroport', 'Excursions sur-mesure'],
  },
];

// ─── Blog mock data (FR — art de vivre / voyage / gastronomie) ────────────────
const BLOG_POSTS = [
  {
    slug: 'art-de-la-table',
    title: "L'art de la table à la française, un héritage vivant",
    date: '5 juin 2026',
    category: 'Art de vivre',
    excerpt:
      "Du pli de la nappe au choix du cristal, la table française est une chorégraphie silencieuse. Plongée dans un savoir-faire que le Grand Palais perpétue chaque soir.",
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85',
    body: [
      "Dresser une table n'est pas un geste utilitaire : c'est une forme de politesse adressée à celui que l'on reçoit. À la française, l'ordonnancement obéit à une grammaire précise, héritée des grandes maisons et transmise de génération en génération.",
      "Tout commence par la nappe, dont le pli central doit courir parfaitement au milieu de la table. Les couverts se disposent de l'extérieur vers l'intérieur, dans l'ordre du service ; les verres s'alignent en oblique, du plus grand au plus petit, au-dessus de la pointe du couteau.",
      "Au Grand Palais, nos maîtres d'hôtel perpétuent ces codes sans nostalgie. Le cristal taillé y côtoie la porcelaine contemporaine, et chaque dîner devient une mise en scène discrète où le confort de l'invité prime toujours sur l'apparat.",
      "Car le véritable luxe, en matière de table comme ailleurs, n'est pas l'ostentation : c'est cette aisance acquise qui fait que tout paraît simple, évident, naturel.",
    ],
  },
  {
    slug: 'echappee-vallee-loire',
    title: 'Échappée dans la vallée de la Loire',
    date: '22 mai 2026',
    category: 'Voyage',
    excerpt:
      "À deux heures du palace, les châteaux de la Loire dévoilent jardins à la française et caves troglodytes. Notre conciergerie compose l'itinéraire idéal d'une journée.",
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85',
    body: [
      "Quand l'envie d'horizon se fait sentir, la vallée de la Loire s'offre comme une parenthèse enchantée. À deux heures à peine du Grand Palais, elle déroule ses châteaux Renaissance le long d'un fleuve royal, classé au patrimoine mondial.",
      "Notre conciergerie compose pour vous une journée sur-mesure : visite privée d'un château à l'ouverture, avant l'arrivée des groupes, déjeuner dans une demeure d'hôtes, puis dégustation dans une cave troglodyte creusée à même le tuffeau.",
      "Les amateurs de jardins ne manqueront pas les parterres à la française, dessinés au cordeau, où l'art du jardinier rivalise avec celui de l'architecte. Les passionnés d'histoire, eux, s'attarderont dans les escaliers à double révolution attribués à Léonard de Vinci.",
      "Le soir venu, la voiture vous ramène au palace, où un dîner léger vous attend. La Loire, c'est l'art français du voyage : ni précipité, ni démonstratif, simplement juste.",
    ],
  },
  {
    slug: 'menu-dune-cheffe',
    title: "Le menu d'une cheffe : Margaux Vernet se confie",
    date: '8 mai 2026',
    category: 'Gastronomie',
    excerpt:
      "Deux étoiles, un potager à cinquante mètres des fourneaux et une philosophie de la saison. Rencontre avec la cheffe de L'Atelier, au Grand Palais.",
    img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=85',
    body: [
      "« Un menu, c'est d'abord une saison qu'on écoute. » Ainsi parle Margaux Vernet, cheffe doublement étoilée de L'Atelier, le restaurant du Grand Palais. Dans son univers, la carte n'est jamais figée : elle respire au rythme du potager.",
      "Cinquante mètres séparent les fourneaux des planches de culture. Cette proximité change tout : les herbes sont cueillies à la dernière minute, les légumes récoltés à maturité parfaite, et le gaspillage tend vers zéro. « La distance la plus courte entre la terre et l'assiette », résume-t-elle.",
      "Sa cuisine revisite le canon français avec une retenue rare. Pas d'effet de manche, pas de surenchère technique : une sauce réduite avec patience, une cuisson exacte, un assaisonnement millimétré. L'émotion naît de la justesse, jamais de la démonstration.",
      "Quand on lui demande sa définition du luxe, elle sourit : « C'est de pouvoir offrir à un client une tomate qui a le goût d'une tomate. Le reste n'est que décor. »",
    ],
  },
  {
    slug: 'rituel-spa-hiver',
    title: 'Le rituel spa de l\'hiver à Espace Étoile',
    date: '24 avril 2026',
    category: 'Art de vivre',
    excerpt:
      "Hammam romain, modelage aux huiles chaudes et tisanerie : découvrez le parcours de soin que notre spa réserve à la saison froide.",
    img: 'https://images.unsplash.com/photo-1540541338537-1220059a0de6?w=1200&q=85',
    body: [
      "Lorsque la ville se couvre de gris, Espace Étoile devient un cocon. Notre spa a conçu pour l'hiver un parcours de soin pensé comme un voyage intérieur, du premier souffle de vapeur à la dernière gorgée de tisane.",
      "Le rituel débute par le hammam romain, dont la chaleur humide prépare la peau et apaise l'esprit. Vient ensuite un gommage aux sels minéraux, puis un modelage corps complet aux huiles chaudes, dont les fragrances changent au fil de la saison.",
      "Le parcours se prolonge dans la piscine chauffée, où la lumière tamisée invite au lâcher-prise, avant un temps de repos à la tisanerie, autour d'infusions composées par notre herboriste.",
      "Quatre-vingt-dix minutes plus tard, on ressort de l'Espace Étoile avec cette sensation rare : celle d'avoir, pour un moment, suspendu le cours du temps.",
    ],
  },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useParallax(ref: React.RefObject<HTMLElement | null>, speed = 0.4) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return useTransform(scrollYProgress, [0, 1], [`${-speed * 100 * 0.5}%`, `${speed * 100 * 0.5}%`]);
}

// ─── BlurReveal ──────────────────────────────────────────────────────────────
function BlurReveal({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── ParallaxSection ─────────────────────────────────────────────────────────
function ParallaxSection({
  imgSrc,
  speed = 0.4,
  height = '60vh',
  children,
  overlay = 'rgba(26,18,8,0.45)',
}: {
  imgSrc: string;
  speed?: number;
  height?: string;
  children?: React.ReactNode;
  overlay?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgY = useParallax(ref, speed);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        height,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: '-20%',
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: imgY,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, ${overlay} 0%, transparent 40%, transparent 60%, ${overlay} 100%)`,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// ─── NavBar ──────────────────────────────────────────────────────────────────
// Visual layout is IDENTICAL to the original (brand left, links + Reserve right).
// The links now drive in-page navigation via goTo instead of dead `href="#"`.
function NavBar({ scrolled, page, goTo }: { scrolled: boolean; page: HotelPage; goTo: (p: HotelPage) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Desktop bar shows the primary destinations; legal pages live in the mobile
  // drawer + footer (mirrors the original which showed only the first links).
  const desktopPages = NAV_PAGES.filter((p) => p.key !== 'mentions');

  return (
    <>
      <motion.nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
          height: '72px',
          transition: 'background 0.5s ease, border-color 0.5s ease',
          background: scrolled ? `${CREAM}f5` : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? `1px solid ${GOLD}30` : '1px solid transparent',
        }}
      >
        <button
          onClick={() => goTo('home')}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: SERIF, fontSize: '1.5rem', color: scrolled ? DARK : CREAM, letterSpacing: '0.08em', fontWeight: 300 }}
        >
          Grand Palais
        </button>

        {/* Desktop links */}
        <div className="gp-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {desktopPages.map((l) => (
            <button
              key={l.key}
              onClick={() => goTo(l.key)}
              style={{
                fontFamily: SANS,
                fontSize: '0.72rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: page === l.key ? GOLD : scrolled ? `${DARK}99` : `${CREAM}99`,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = page === l.key ? GOLD : scrolled ? `${DARK}99` : `${CREAM}99`; }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => goTo('contact')}
            style={{
              fontFamily: SANS,
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: GOLD,
              color: CREAM,
              border: 'none',
              padding: '0.6rem 1.4rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = GOLD_DIM; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = GOLD; }}
          >
            Réserver
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="gp-nav-burger"
          onClick={() => setMobileOpen(true)}
          aria-label="Menu"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: scrolled ? DARK : CREAM, fontSize: '1.4rem', lineHeight: 1, padding: 0 }}
        >
          ☰
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: DARK,
              display: 'flex',
              flexDirection: 'column',
              padding: '2.5rem',
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: CREAM, cursor: 'pointer', fontSize: '1.5rem', marginBottom: '3rem' }}
            >
              ✕
            </button>
            {NAV_PAGES.map((l, i) => (
              <motion.div key={l.key} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <button
                  onClick={() => { goTo(l.key); setMobileOpen(false); }}
                  style={{ fontFamily: SERIF, fontSize: '2.2rem', color: page === l.key ? GOLD : CREAM, display: 'block', marginBottom: '1.4rem', textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                >
                  {l.label}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive toggle: desktop links hidden on small screens, burger shown */}
      <style>{`
        @media (max-width: 820px) {
          .gp-nav-desktop { display: none !important; }
          .gp-nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax image
  const bgY = useTransform(heroProgress, [0, 1], ['0%', '30%']);

  // Color shift overlay: deep navy → warm amber as user scrolls
  const r = useTransform(heroProgress, [0, 1], [8, 60]);
  const g = useTransform(heroProgress, [0, 1], [14, 35]);
  const b = useTransform(heroProgress, [0, 1], [40, 14]);
  const overlayColor = useMotionTemplate`rgba(${r}, ${g}, ${b}, 0.72)`;

  // Foreground fade
  const contentOpacity = useTransform(heroProgress, [0, 0.65], [1, 0]);
  const contentY = useTransform(heroProgress, [0, 0.65], ['0px', '-40px']);

  // Heading sweep from below
  const headingY = useTransform(heroProgress, [0, 0.5], ['0px', '-25px']);

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: DARK,
      }}
    >
      {/* Parallax background image */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-10%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&q=90)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          y: bgY,
        }}
      />

      {/* Color-shifting overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: overlayColor,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.4, delay: 0.3 }}
          style={{
            fontFamily: SANS,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            color: GOLD,
            letterSpacing: '0.3em',
            marginBottom: '2rem',
          }}
        >
          Palace — Founded 1887
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(4.5rem, 12vw, 10rem)',
            fontWeight: 300,
            lineHeight: 0.9,
            color: CREAM,
            marginBottom: '2.5rem',
            y: headingY,
          }}
        >
          Grand<br />
          <em style={{ fontStyle: 'italic' }}>Palais</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.55 }}
          style={{
            fontFamily: SERIF,
            fontSize: '1.15rem',
            color: `${CREAM}aa`,
            maxWidth: '32rem',
            lineHeight: 1.7,
            marginBottom: '3rem',
            fontWeight: 300,
            fontStyle: 'italic',
          }}
        >
          Where time is measured not in hours, but in moments that endure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            style={{
              fontFamily: SANS,
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              background: GOLD,
              color: CREAM,
              border: 'none',
              padding: '1rem 2.5rem',
              cursor: 'pointer',
            }}
          >
            Discover Our Suites
          </button>
          <button
            style={{
              fontFamily: SANS,
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              background: 'transparent',
              color: CREAM,
              border: `1px solid ${CREAM}50`,
              padding: '1rem 2.5rem',
              cursor: 'pointer',
            }}
          >
            Virtual Journey
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '50px',
            background: `linear-gradient(to bottom, ${CREAM}00, ${CREAM}80)`,
          }}
        />
        <span style={{ fontFamily: SANS, fontSize: '0.55rem', letterSpacing: '0.2em', color: `${CREAM}60`, textTransform: 'uppercase' }}>
          Scroll
        </span>
      </motion.div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <div
      style={{
        background: GOLD,
        padding: '2rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
      }}
    >
      {STATS.map(({ n, l }) => (
        <div key={l} style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: SERIF, fontSize: '2.2rem', fontWeight: 300, color: DARK, lineHeight: 1, marginBottom: '0.3rem' }}>
            {n}
          </p>
          <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${DARK}80` }}>
            {l}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Horizontal Scroll Rooms ─────────────────────────────────────────────────
function RoomsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Each card is ~520px + 32px gap. We have 3 cards so total - viewport ~= 2 * 552
  const CARD_W = 520;
  const GAP = 32;
  const TOTAL_SHIFT = -(CARD_W + GAP) * (ROOMS.length - 1);

  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, TOTAL_SHIFT]);
  const springX = useSpring(x, { stiffness: 80, damping: 22 });

  // Decorative large number opacity/position driven by scroll
  const numOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: `${100 + ROOMS.length * 60}vh`,
        background: CREAM,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Section label */}
        <div style={{ padding: '0 3rem', marginBottom: '3rem' }}>
          <BlurReveal>
            <p style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.6rem' }}>
              Accommodations
            </p>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 300,
                color: DARK,
                lineHeight: 1.05,
              }}
            >
              Rooms & Suites
            </h2>
          </BlurReveal>
        </div>

        {/* Horizontal rail */}
        <div style={{ position: 'relative', overflow: 'hidden', paddingLeft: '3rem' }}>
          <motion.div
            style={{
              display: 'flex',
              gap: `${GAP}px`,
              x: springX,
              willChange: 'transform',
            }}
          >
            {ROOMS.map((room, i) => (
              <RoomCard key={room.num} room={room} index={i} scrollYProgress={scrollYProgress} />
            ))}
          </motion.div>
        </div>

        {/* Decorative room number watermark */}
        <motion.div
          style={{
            position: 'absolute',
            right: '3rem',
            bottom: '4rem',
            fontFamily: SERIF,
            fontSize: 'clamp(8rem, 20vw, 18rem)',
            fontWeight: 300,
            color: `${GOLD}15`,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            opacity: numOpacity,
          }}
        >
          {/* Active room number driven by scroll */}
          <ScrollRoomNumber scrollYProgress={scrollYProgress} />
        </motion.div>
      </div>
    </section>
  );
}

function ScrollRoomNumber({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      if (v < 0.35) setActive(0);
      else if (v < 0.68) setActive(1);
      else setActive(2);
    });
  }, [scrollYProgress]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={active}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
      >
        {ROOMS[active].num}
      </motion.span>
    </AnimatePresence>
  );
}

function RoomCard({
  room,
  index,
  scrollYProgress,
}: {
  room: typeof ROOMS[0];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const SEGMENTS = ROOMS.length;
  const start = index / SEGMENTS;
  const end = (index + 1) / SEGMENTS;

  const cardOpacity = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start + 0.05, end - 0.05, Math.min(1, end + 0.1)], [0.45, 1, 1, 0.45]);
  const cardScale = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start + 0.05, end - 0.05, Math.min(1, end + 0.1)], [0.96, 1, 1, 0.96]);

  return (
    <motion.div
      style={{
        flex: '0 0 520px',
        height: '520px',
        background: DARK,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: cardOpacity,
        scale: cardScale,
      }}
    >
      {/* Image */}
      <div
        style={{
          flex: '0 0 55%',
          backgroundImage: `url(${room.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(26,18,8,0.6) 100%)' }} />
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.5rem',
            fontFamily: SANS,
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: GOLD,
            background: `${DARK}cc`,
            padding: '0.3rem 0.8rem',
          }}
        >
          {room.tag}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: SANS, fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${CREAM}50`, marginBottom: '0.4rem' }}>
            {room.size} · {room.view}
          </p>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: '1.75rem',
              fontWeight: 300,
              color: CREAM,
              marginBottom: '0.75rem',
              lineHeight: 1.1,
            }}
          >
            {room.name}
          </h3>
          <p style={{ fontFamily: SERIF, fontSize: '0.9rem', color: `${CREAM}70`, lineHeight: 1.7, fontStyle: 'italic' }}>
            {room.desc}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1.25rem' }}>
          <div>
            <p style={{ fontFamily: SANS, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: `${CREAM}40`, marginBottom: '0.2rem' }}>
              From
            </p>
            <p style={{ fontFamily: SERIF, fontSize: '2.2rem', fontWeight: 300, color: GOLD, lineHeight: 1 }}>
              {room.price}
              <span style={{ fontFamily: SANS, fontSize: '0.65rem', color: `${CREAM}40`, marginLeft: '0.3rem' }}>/night</span>
            </p>
          </div>
          <button
            style={{
              fontFamily: SANS,
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: GOLD,
              color: CREAM,
              border: 'none',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
            }}
          >
            Reserve
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Experience Section ───────────────────────────────────────────────────────
function ExperienceSection() {
  return (
    <section style={{ background: DARK, padding: '8rem 0' }}>
      <div style={{ maxWidth: '75rem', margin: '0 auto', padding: '0 3rem' }}>
        <BlurReveal>
          <div style={{ marginBottom: '5rem' }}>
            <p style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.75rem' }}>
              The Experience
            </p>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 300,
                color: CREAM,
                lineHeight: 1.1,
                maxWidth: '28rem',
              }}
            >
              Every Sense,<br />
              <em>Attended To</em>
            </h2>
          </div>
        </BlurReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          {EXPERIENCES.map((exp, i) => (
            <ExperienceRow key={exp.label} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceRow({ exp, index }: { exp: typeof EXPERIENCES[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start end', 'center center'] });

  // Parallax on image
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={rowRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
      }}
    >
      {/* Image side */}
      <div
        style={{
          gridColumn: isEven ? '1' : '2',
          gridRow: '1',
          position: 'relative',
          height: '480px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: '-15%',
            backgroundImage: `url(${exp.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: imgY,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,8,0.25)' }} />
      </div>

      {/* Text side */}
      <BlurReveal
        delay={0.1}
        style={{
          gridColumn: isEven ? '2' : '1',
          gridRow: '1',
        }}
      >
        <div>
          <p style={{ fontFamily: SANS, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>
            {exp.sub}
          </p>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 300,
              color: CREAM,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            {exp.label}
          </h3>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: '1.05rem',
              color: `${CREAM}70`,
              lineHeight: 1.8,
              fontStyle: 'italic',
              marginBottom: '2.5rem',
              maxWidth: '28rem',
            }}
          >
            {exp.desc}
          </p>
          <button
            style={{
              fontFamily: SANS,
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              background: 'transparent',
              color: GOLD,
              border: `1px solid ${GOLD}50`,
              padding: '0.9rem 2rem',
              cursor: 'pointer',
            }}
          >
            Discover More
          </button>
        </div>
      </BlurReveal>
    </motion.div>
  );
}

// ─── Parallax Divider ─────────────────────────────────────────────────────────
function ParallaxDivider() {
  return (
    <ParallaxSection
      imgSrc="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85"
      speed={0.35}
      height="55vh"
      overlay="rgba(26,18,8,0.55)"
    >
      <BlurReveal>
        <div style={{ textAlign: 'center', padding: '0 2rem' }}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: CREAM,
              maxWidth: '38rem',
              lineHeight: 1.4,
            }}
          >
            "Luxury is the ease of a t-shirt in a very expensive dress."
          </p>
          <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginTop: '1.5rem' }}>
            — Karl Lagerfeld
          </p>
        </div>
      </BlurReveal>
    </ParallaxSection>
  );
}

// ─── Dining Section ───────────────────────────────────────────────────────────
function DiningSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section
      ref={sectionRef}
      style={{ background: CREAM, padding: '9rem 0', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle textured bg element */}
      <motion.div
        style={{
          position: 'absolute',
          right: '-5rem',
          top: '5rem',
          width: '45vw',
          height: '80%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: bgY,
          opacity: 0.18,
          filter: 'saturate(0)',
        }}
      />

      <div style={{ maxWidth: '75rem', margin: '0 auto', padding: '0 3rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <BlurReveal>
            <div>
              <p style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>
                Gastronomy
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                  fontWeight: 300,
                  color: DARK,
                  lineHeight: 1.1,
                  marginBottom: '1.75rem',
                }}
              >
                L'Atelier<br />
                <em style={{ fontStyle: 'italic', color: GOLD_DIM }}>Restaurant</em>
              </h2>
              <p
                style={{
                  fontFamily: SERIF,
                  fontSize: '1.05rem',
                  color: `${DARK}80`,
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                  marginBottom: '2rem',
                  maxWidth: '30rem',
                }}
              >
                Two Michelin stars. Chef Margaux Vernet reimagines the French canon with produce grown fifty metres from the kitchen. The tasting menu changes with the moon.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {[['Breakfast', '7—11h'], ['Déjeuner', '12—14h30'], ['Dîner', '19—22h']].map(([m, t]) => (
                  <div key={m} style={{ borderLeft: `1px solid ${GOLD}50`, paddingLeft: '1rem' }}>
                    <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: DARK, marginBottom: '0.2rem' }}>{m}</p>
                    <p style={{ fontFamily: SERIF, fontSize: '0.85rem', color: `${DARK}70` }}>{t}</p>
                  </div>
                ))}
              </div>
              <button
                style={{
                  fontFamily: SANS,
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  background: DARK,
                  color: CREAM,
                  border: 'none',
                  padding: '1rem 2.2rem',
                  cursor: 'pointer',
                }}
              >
                Reserve a Table
              </button>
            </div>
          </BlurReveal>

          <BlurReveal delay={0.15}>
            <div
              style={{
                height: '560px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=85)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', bottom: '-1.5rem', left: '-1.5rem', background: GOLD, padding: '1.5rem 2rem' }}>
                <p style={{ fontFamily: SERIF, fontSize: '2rem', fontWeight: 300, color: CREAM, lineHeight: 1 }}>2 ✦</p>
                <p style={{ fontFamily: SANS, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: `${CREAM}80`, marginTop: '0.3rem' }}>
                  Michelin Stars
                </p>
              </div>
            </div>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}

// ─── Location Section ─────────────────────────────────────────────────────────
function LocationSection() {
  return (
    <section style={{ background: MID, padding: '9rem 0' }}>
      <div style={{ maxWidth: '75rem', margin: '0 auto', padding: '0 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>
          <BlurReveal>
            <div>
              <p style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>
                Location
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                  fontWeight: 300,
                  color: CREAM,
                  lineHeight: 1.1,
                  marginBottom: '2rem',
                }}
              >
                At the Heart of<br />
                <em>the City of Light</em>
              </h2>
              <p
                style={{
                  fontFamily: SERIF,
                  fontSize: '1.05rem',
                  color: `${CREAM}70`,
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                  marginBottom: '3rem',
                }}
              >
                Eight hundred metres from the Opéra. A fifteen-minute walk to the Louvre. Paris unfolds at your threshold.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { icon: '◎', label: 'Address', val: '8 Avenue de la Paix, 75009 Paris' },
                  { icon: '◎', label: 'Telephone', val: '+33 1 40 00 00 00' },
                  { icon: '◎', label: 'Reservations', val: 'reservations@grandpalais.fr' },
                  { icon: '◎', label: 'Concierge', val: 'Available 24 hours' },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <span style={{ color: GOLD, fontSize: '0.7rem', marginTop: '0.15rem', flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: `${CREAM}50`, marginBottom: '0.2rem' }}>
                        {label}
                      </p>
                      <p style={{ fontFamily: SERIF, fontSize: '0.95rem', color: CREAM_DIM }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurReveal>

          <BlurReveal delay={0.2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  height: '340px',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=85)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,8,0.2)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                  { label: 'Opéra Garnier', dist: '5 min' },
                  { label: 'Louvre', dist: '15 min' },
                  { label: 'Eiffel Tower', dist: '20 min' },
                  { label: 'CDG Airport', dist: '35 min' },
                ].map(({ label, dist }) => (
                  <div key={label} style={{ background: `${CREAM}08`, padding: '1.25rem 1.5rem', borderLeft: `2px solid ${GOLD}` }}>
                    <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: `${CREAM}60`, marginBottom: '0.3rem' }}>
                      {label}
                    </p>
                    <p style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 300, color: GOLD }}>{dist}</p>
                  </div>
                ))}
              </div>
            </div>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Sophie R.', origin: 'Paris', text: 'An experience that redefined our expectations of hospitality. Every detail, every gesture — flawless.', stars: 5 },
  { name: 'James W.', origin: 'London', text: 'The Grand Palais is beyond comparison. The suite views, the silence, the staff — we return every autumn.', stars: 5 },
  { name: 'Hana T.', origin: 'Tokyo', text: 'The most extraordinary stay of our lives. Nothing prepares you for the quiet perfection of this place.', stars: 5 },
];

function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ background: GOLD, padding: '8rem 3rem' }}>
      <div style={{ maxWidth: '52rem', margin: '0 auto', textAlign: 'center' }}>
        <BlurReveal>
          <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: `${DARK}70`, marginBottom: '3.5rem' }}>
            Guest Voices
          </p>
        </BlurReveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginBottom: '2rem' }}>
              {Array.from({ length: TESTIMONIALS[active].stars }).map((_, i) => (
                <span key={i} style={{ color: DARK, fontSize: '0.9rem' }}>✦</span>
              ))}
            </div>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: DARK,
                lineHeight: 1.5,
                marginBottom: '2rem',
              }}
            >
              "{TESTIMONIALS[active].text}"
            </p>
            <p style={{ fontFamily: SANS, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: DARK, fontWeight: 500 }}>
              {TESTIMONIALS[active].name}
            </p>
            <p style={{ fontFamily: SANS, fontSize: '0.62rem', color: `${DARK}60`, marginTop: '0.25rem' }}>
              {TESTIMONIALS[active].origin}
            </p>
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '3rem' }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? '2rem' : '0.45rem',
                height: '0.45rem',
                borderRadius: '9999px',
                background: i === active ? DARK : `${DARK}40`,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Booking CTA ──────────────────────────────────────────────────────────────
function BookingCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section ref={sectionRef} style={{ position: 'relative', overflow: 'hidden', background: DARK }}>
      {/* Parallax background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-15%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: bgY,
          opacity: 0.2,
          filter: 'saturate(0)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '10rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <BlurReveal>
          <p style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '1.5rem' }}>
            Reservations
          </p>
        </BlurReveal>

        <BlurReveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              fontWeight: 300,
              color: CREAM,
              lineHeight: 0.95,
              marginBottom: '2rem',
            }}
          >
            Live the<br />
            <em style={{ fontStyle: 'italic', color: GOLD }}>Grand Palais</em>
          </h2>
        </BlurReveal>

        <BlurReveal delay={0.2}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: '1.1rem',
              color: `${CREAM}70`,
              maxWidth: '30rem',
              lineHeight: 1.8,
              fontStyle: 'italic',
              marginBottom: '3.5rem',
            }}
          >
            Our concierge team is available at every hour to craft a stay that is entirely, irreducibly yours.
          </p>
        </BlurReveal>

        {/* Booking widget */}
        <BlurReveal delay={0.3}>
          <div
            style={{
              background: CREAM,
              padding: '2.5rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '2.5rem',
            }}
          >
            {[
              { label: 'Arrival', placeholder: 'DD / MM / YYYY' },
              { label: 'Departure', placeholder: 'DD / MM / YYYY' },
              { label: 'Guests', placeholder: '2 Adults' },
            ].map(({ label, placeholder }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label
                  style={{
                    fontFamily: SANS,
                    fontSize: '0.58rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: `${DARK}80`,
                  }}
                >
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  style={{
                    fontFamily: SERIF,
                    fontSize: '0.95rem',
                    color: DARK,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${DARK}30`,
                    padding: '0.5rem 0',
                    width: '160px',
                    outline: 'none',
                  }}
                />
              </div>
            ))}
            <button
              style={{
                fontFamily: SANS,
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                background: GOLD,
                color: CREAM,
                border: 'none',
                padding: '0.9rem 2rem',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Check Availability
            </button>
          </div>
        </BlurReveal>

        <BlurReveal delay={0.4}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="tel:+33140000000"
              style={{
                fontFamily: SANS,
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: `${CREAM}70`,
                textDecoration: 'none',
                borderBottom: `1px solid ${CREAM}30`,
                paddingBottom: '2px',
              }}
            >
              +33 1 40 00 00 00
            </a>
            <a
              href="mailto:reservations@grandpalais.fr"
              style={{
                fontFamily: SANS,
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: `${CREAM}70`,
                textDecoration: 'none',
                borderBottom: `1px solid ${CREAM}30`,
                paddingBottom: '2px',
              }}
            >
              reservations@grandpalais.fr
            </a>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ goTo }: { goTo: (p: HotelPage) => void }) {
  const footerCols: { title: string; links: { label: string; page: HotelPage }[] }[] = [
    {
      title: 'Séjour',
      links: [
        { label: 'Chambres & Suites', page: 'chambres' },
        { label: 'Prestige Room', page: 'chambres' },
        { label: 'Grand Suite', page: 'chambres' },
        { label: 'Suite Présidentielle', page: 'chambres' },
      ],
    },
    {
      title: 'Expériences',
      links: [
        { label: "L'Atelier Restaurant", page: 'services' },
        { label: 'Espace Étoile Spa', page: 'services' },
        { label: 'Bar Lumière', page: 'services' },
        { label: 'Événements privés', page: 'services' },
      ],
    },
    {
      title: 'Informations',
      links: [
        { label: 'Blog & art de vivre', page: 'blog' },
        { label: 'Contact', page: 'contact' },
        { label: 'Mentions légales', page: 'mentions' },
        { label: 'Confidentialité', page: 'privacy' },
      ],
    },
  ];

  return (
    <footer style={{ background: '#0f0b06', borderTop: `1px solid ${GOLD}25`, padding: '5rem 3rem 3rem' }}>
      <div style={{ maxWidth: '75rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <button
              onClick={() => goTo('home')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 300, color: GOLD, marginBottom: '1rem', letterSpacing: '0.05em', display: 'block' }}
            >
              Grand Palais
            </button>
            <p style={{ fontFamily: SERIF, fontSize: '0.9rem', color: `${CREAM}50`, lineHeight: 1.7, fontStyle: 'italic', maxWidth: '20rem', marginBottom: '1.5rem' }}>
              Un palace de distinction tranquille au cœur de Paris depuis 1887.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['IG', 'FB', 'TW'].map((s) => (
                <button
                  key={s}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    background: `${GOLD}20`,
                    border: `1px solid ${GOLD}30`,
                    color: GOLD,
                    fontFamily: SANS,
                    fontSize: '0.55rem',
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${CREAM}60`, marginBottom: '1.25rem' }}>
                {col.title}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => goTo(l.page)}
                      style={{
                        fontFamily: SERIF,
                        fontSize: '0.9rem',
                        color: `${CREAM}50`,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontStyle: 'italic',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = `${CREAM}50`; }}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: `1px solid ${CREAM}12`,
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span style={{ fontFamily: SANS, fontSize: '0.58rem', color: `${CREAM}35`, letterSpacing: '0.08em' }}>
            © 2026 Grand Palais. Tous droits réservés.
          </span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {([
              { label: 'Mentions légales', page: 'mentions' as HotelPage },
              { label: 'Confidentialité', page: 'privacy' as HotelPage },
              { label: 'Contact', page: 'contact' as HotelPage },
            ]).map((l) => (
              <button
                key={l.label}
                onClick={() => goTo(l.page)}
                style={{
                  fontFamily: SANS,
                  fontSize: '0.58rem',
                  color: `${CREAM}35`,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = `${CREAM}35`; }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 28 });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: GOLD,
        transformOrigin: 'left',
        scaleX,
        zIndex: 200,
      }}
    />
  );
}

// ─── Shared sub-page hero (theme-native: parallax band + gold eyebrow) ────────
function SubPageHero({ eyebrow, title, subtitle, img }: { eyebrow: string; title: string; subtitle?: string; img: string }) {
  return (
    <ParallaxSection imgSrc={img} speed={0.3} height="58vh" overlay="rgba(26,18,8,0.6)">
      <BlurReveal>
        <div style={{ textAlign: 'center', padding: '0 1.5rem', maxWidth: '44rem' }}>
          <p style={{ fontFamily: SANS, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1.5rem' }}>
            {eyebrow}
          </p>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 300, color: CREAM, lineHeight: 1, marginBottom: subtitle ? '1.5rem' : 0 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontFamily: SERIF, fontSize: '1.1rem', fontStyle: 'italic', color: `${CREAM}aa`, lineHeight: 1.7, maxWidth: '34rem', margin: '0 auto' }}>
              {subtitle}
            </p>
          )}
        </div>
      </BlurReveal>
    </ParallaxSection>
  );
}

// ─── Room detail view (own component so hooks stay unconditional) ─────────────
function RoomDetail({ room, setRoomSlug, goTo }: { room: RoomFull; setRoomSlug: (s: string | null) => void; goTo: (p: HotelPage) => void }) {
  const [activeImg, setActiveImg] = useState(0);
  return (
    <div>
      <section style={{ background: CREAM, padding: '7rem 0 6rem' }}>
          <div style={{ maxWidth: '75rem', margin: '0 auto', padding: '0 3rem' }}>
            <button
              onClick={() => setRoomSlug(null)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: `${DARK}80`, cursor: 'pointer', fontFamily: SANS, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2.5rem' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = `${DARK}80`; }}
            >
              ← Toutes les chambres
            </button>

            <div className="gp-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
              {/* Gallery */}
              <BlurReveal>
                <div>
                  <div style={{ height: 'clamp(280px, 42vw, 460px)', backgroundImage: `url(${room.gallery[activeImg]})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '1rem' }} />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {room.gallery.map((g, i) => (
                      <button
                        key={g}
                        onClick={() => setActiveImg(i)}
                        style={{ flex: 1, height: '5rem', backgroundImage: `url(${g})`, backgroundSize: 'cover', backgroundPosition: 'center', border: i === activeImg ? `2px solid ${GOLD}` : '2px solid transparent', cursor: 'pointer', padding: 0 }}
                      />
                    ))}
                  </div>
                </div>
              </BlurReveal>

              {/* Info */}
              <BlurReveal delay={0.1}>
                <div>
                  <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.8rem' }}>
                    {room.tag}
                  </p>
                  <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 300, color: DARK, lineHeight: 1.05, marginBottom: '0.6rem' }}>
                    {room.name}
                  </h2>
                  <p style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${DARK}70`, marginBottom: '1.5rem' }}>
                    {room.size} · {room.view}
                  </p>
                  <p style={{ fontFamily: SERIF, fontSize: '1.05rem', color: `${DARK}88`, lineHeight: 1.8, fontStyle: 'italic', marginBottom: '2rem' }}>
                    {room.long}
                  </p>

                  <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${DARK}60`, marginBottom: '1rem' }}>
                    Équipements
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                    {room.amenities.map((a) => (
                      <li key={a} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontFamily: SERIF, fontSize: '0.95rem', color: `${DARK}80` }}>
                        <span style={{ color: GOLD, flexShrink: 0 }}>✦</span>
                        {a}
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', borderTop: `1px solid ${GOLD}40`, paddingTop: '1.75rem' }}>
                    <div>
                      <p style={{ fontFamily: SANS, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: `${DARK}50`, marginBottom: '0.2rem' }}>
                        À partir de
                      </p>
                      <p style={{ fontFamily: SERIF, fontSize: '2.6rem', fontWeight: 300, color: GOLD, lineHeight: 1 }}>
                        {room.price}
                        <span style={{ fontFamily: SANS, fontSize: '0.7rem', color: `${DARK}50`, marginLeft: '0.3rem' }}>/ nuit</span>
                      </p>
                    </div>
                    <button
                      onClick={() => goTo('contact')}
                      style={{ fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', background: GOLD, color: CREAM, border: 'none', padding: '1rem 2.5rem', cursor: 'pointer' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD_DIM; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </BlurReveal>
            </div>
          </div>
        </section>
      <style>{`@media (max-width: 820px){ .gp-detail-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

// ─── CHAMBRES & SUITES (listing + room detail), theme room-card design ─────────
function ChambresPage({ roomSlug, setRoomSlug, goTo }: { roomSlug: string | null; setRoomSlug: (s: string | null) => void; goTo: (p: HotelPage) => void }) {
  const room = roomSlug ? ROOMS_FULL.find((r) => r.slug === roomSlug) : null;

  if (room) {
    return <RoomDetail room={room} setRoomSlug={setRoomSlug} goTo={goTo} />;
  }

  return (
    <div>
      <SubPageHero
        eyebrow="Hébergements"
        title="Chambres & Suites"
        subtitle="Quatre catégories d'exception, chacune une variation sur le même art de recevoir. Choisissez votre refuge."
        img="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1800&q=85"
      />
      <section style={{ background: CREAM, padding: '7rem 0' }}>
        <div style={{ maxWidth: '75rem', margin: '0 auto', padding: '0 3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {ROOMS_FULL.map((r, i) => (
              <motion.div
                key={r.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => { setRoomSlug(r.slug); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' }); }}
                style={{ background: DARK, display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{ height: '15rem', backgroundImage: `url(${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(26,18,8,0.6) 100%)' }} />
                  <div style={{ position: 'absolute', top: '1.25rem', left: '1.5rem', fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, background: `${DARK}cc`, padding: '0.3rem 0.8rem' }}>
                    {r.tag}
                  </div>
                </div>
                <div style={{ flex: 1, padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontFamily: SANS, fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${CREAM}50`, marginBottom: '0.4rem' }}>
                      {r.size} · {r.view}
                    </p>
                    <h3 style={{ fontFamily: SERIF, fontSize: '1.75rem', fontWeight: 300, color: CREAM, marginBottom: '0.75rem', lineHeight: 1.1 }}>
                      {r.name}
                    </h3>
                    <p style={{ fontFamily: SERIF, fontSize: '0.9rem', color: `${CREAM}70`, lineHeight: 1.7, fontStyle: 'italic' }}>
                      {r.desc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                    <div>
                      <p style={{ fontFamily: SANS, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: `${CREAM}40`, marginBottom: '0.2rem' }}>
                        À partir de
                      </p>
                      <p style={{ fontFamily: SERIF, fontSize: '2.2rem', fontWeight: 300, color: GOLD, lineHeight: 1 }}>
                        {r.price}
                        <span style={{ fontFamily: SANS, fontSize: '0.65rem', color: `${CREAM}40`, marginLeft: '0.3rem' }}>/nuit</span>
                      </p>
                    </div>
                    <span style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      Découvrir →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── SERVICES (hotel experiences), theme card design ──────────────────────────
function ServicesPage({ goTo }: { goTo: (p: HotelPage) => void }) {
  return (
    <div>
      <SubPageHero
        eyebrow="L'expérience"
        title="Services & expériences"
        subtitle="Spa, gastronomie, conciergerie : chaque service du Grand Palais est conçu pour que tout vous paraisse simple et naturel."
        img="https://images.unsplash.com/photo-1540541338537-1220059a0de6?w=1800&q=85"
      />
      <section style={{ background: DARK, padding: '7rem 0' }}>
        <div style={{ maxWidth: '75rem', margin: '0 auto', padding: '0 3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
                style={{ background: MID, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderTop: `2px solid ${GOLD}` }}
              >
                <div style={{ height: '12rem', backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,8,0.3)' }} />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '1.6rem', color: GOLD }}>{s.glyph}</div>
                </div>
                <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p style={{ fontFamily: SANS, fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.6rem' }}>
                    {s.sub}
                  </p>
                  <h3 style={{ fontFamily: SERIF, fontSize: '1.7rem', fontWeight: 300, color: CREAM, lineHeight: 1.1, marginBottom: '0.9rem' }}>
                    {s.label}
                  </h3>
                  <p style={{ fontFamily: SERIF, fontSize: '0.95rem', color: `${CREAM}70`, lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.5rem', flex: 1 }}>
                    {s.desc}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {s.points.map((p) => (
                      <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.55rem', fontFamily: SANS, fontSize: '0.8rem', color: `${CREAM}65`, letterSpacing: '0.02em' }}>
                        <span style={{ color: GOLD, flexShrink: 0, fontSize: '0.7rem', marginTop: '0.1rem' }}>✦</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ background: GOLD, marginTop: '4rem', padding: '3.5rem clamp(2rem, 5vw, 4rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 300, color: DARK, lineHeight: 1.1, marginBottom: '0.5rem' }}>
                Composons votre séjour ensemble
              </h2>
              <p style={{ fontFamily: SERIF, fontSize: '1rem', fontStyle: 'italic', color: `${DARK}80`, margin: 0, maxWidth: '32rem' }}>
                Notre conciergerie est disponible à chaque heure pour orchestrer un séjour entièrement vôtre.
              </p>
            </div>
            <button
              onClick={() => goTo('contact')}
              style={{ fontFamily: SANS, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', background: DARK, color: CREAM, border: 'none', padding: '1rem 2.5rem', cursor: 'pointer', flexShrink: 0 }}
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── BLOG (index + single article), theme styling ─────────────────────────────
function BlogPage({ blogSlug, setBlogSlug }: { blogSlug: string | null; setBlogSlug: (s: string | null) => void }) {
  const post = blogSlug ? BLOG_POSTS.find((b) => b.slug === blogSlug) : null;

  if (post) {
    return (
      <div>
        <ParallaxSection imgSrc={post.img} speed={0.3} height="56vh" overlay="rgba(26,18,8,0.62)">
          <BlurReveal>
            <div style={{ textAlign: 'center', padding: '0 1.5rem', maxWidth: '46rem' }}>
              <p style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: '1.2rem' }}>
                {post.category} · {post.date}
              </p>
              <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 300, color: CREAM, lineHeight: 1.1 }}>
                {post.title}
              </h1>
            </div>
          </BlurReveal>
        </ParallaxSection>

        <section style={{ background: CREAM, padding: '5rem 0 6rem' }}>
          <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 1.75rem' }}>
            <button
              onClick={() => setBlogSlug(null)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: `${DARK}80`, cursor: 'pointer', fontFamily: SANS, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2.5rem' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = `${DARK}80`; }}
            >
              ← Tous les articles
            </button>
            {post.body.map((para, i) => (
              <p key={i} style={{ fontFamily: SERIF, fontSize: '1.15rem', color: `${DARK}90`, lineHeight: 1.9, marginBottom: '1.6rem' }}>
                {para}
              </p>
            ))}
            <div style={{ borderTop: `1px solid ${GOLD}40`, marginTop: '2rem', paddingTop: '1.5rem', fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.95rem', color: `${DARK}70` }}>
              Rédigé par la rédaction du Grand Palais. Le Journal du palace, publié tout au long de l'année.
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <SubPageHero
        eyebrow="Le Journal du palace"
        title="Blog & art de vivre"
        subtitle="Nos chroniques d'art de vivre, de voyage et de gastronomie, écrites au rythme des saisons."
        img="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1800&q=85"
      />
      <section style={{ background: CREAM, padding: '7rem 0' }}>
        <div style={{ maxWidth: '75rem', margin: '0 auto', padding: '0 3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {BLOG_POSTS.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => { setBlogSlug(p.slug); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' }); }}
                style={{ background: DARK, display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer', borderTop: `2px solid ${GOLD}` }}
              >
                <div style={{ height: '12rem', backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(26,18,8,0.55) 100%)' }} />
                </div>
                <div style={{ padding: '1.6rem 1.9rem 2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
                    <span style={{ fontFamily: SANS, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD }}>{p.category}</span>
                    <span style={{ fontFamily: SANS, fontSize: '0.62rem', color: `${CREAM}45` }}>· {p.date}</span>
                  </div>
                  <h2 style={{ fontFamily: SERIF, fontSize: '1.45rem', fontWeight: 300, color: CREAM, lineHeight: 1.25, marginBottom: '0.8rem' }}>
                    {p.title}
                  </h2>
                  <p style={{ fontFamily: SERIF, fontSize: '0.92rem', color: `${CREAM}65`, lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.2rem', flex: 1 }}>
                    {p.excerpt}
                  </p>
                  <span style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    Lire l'article →
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── CONTACT (info + reservation form, inputs ≥16px) ──────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1rem', background: CREAM,
    border: `1px solid ${GOLD}40`, color: DARK,
    fontSize: 16, // ≥16px to avoid iOS zoom on focus
    outline: 'none', fontFamily: SERIF, marginBottom: '1.1rem',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS, fontSize: '0.6rem', color: GOLD_DIM,
    letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
    marginBottom: '0.45rem', display: 'block',
  };

  return (
    <div>
      <SubPageHero
        eyebrow="Réservations & conciergerie"
        title="Contact"
        subtitle="Notre équipe est à votre écoute à chaque heure pour composer un séjour qui vous ressemble."
        img="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85"
      />
      <section style={{ background: CREAM, padding: '7rem 0' }}>
        <div className="gp-contact-grid" style={{ maxWidth: '70rem', margin: '0 auto', padding: '0 3rem', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(3rem, 5vw, 5rem)', alignItems: 'start' }}>
          {/* Info */}
          <div>
            {[
              { label: 'Téléphone', val: '+33 1 40 00 00 00' },
              { label: 'Réservations', val: 'reservations@grandpalais.fr' },
              { label: 'Adresse', val: '8 Avenue de la Paix, 75009 Paris' },
              { label: 'Conciergerie', val: 'Disponible 24 heures sur 24' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.75rem', borderBottom: `1px solid ${GOLD}30`, paddingBottom: '1.4rem' }}>
                <span style={{ color: GOLD, fontSize: '0.9rem', marginTop: '0.2rem', flexShrink: 0 }}>◎</span>
                <div>
                  <p style={{ fontFamily: SANS, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD_DIM, marginBottom: '0.35rem' }}>{item.label}</p>
                  <p style={{ fontFamily: SERIF, fontSize: '1.25rem', color: DARK }}>{item.val}</p>
                </div>
              </div>
            ))}
            <p style={{ fontFamily: SERIF, fontSize: '1rem', fontStyle: 'italic', color: `${DARK}75`, lineHeight: 1.8, marginTop: '0.5rem' }}>
              Pour les demandes de privatisation, d'événements ou de séjours longue durée, notre conciergerie vous répond sous 24 heures.
            </p>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ background: DARK, padding: '3.5rem 2.5rem', textAlign: 'center', borderTop: `2px solid ${GOLD}` }}>
                <p style={{ fontSize: '1.8rem', color: GOLD, marginBottom: '1rem' }}>✦</p>
                <h3 style={{ fontFamily: SERIF, fontSize: '1.8rem', fontWeight: 300, color: CREAM, marginBottom: '0.8rem' }}>Demande envoyée</h3>
                <p style={{ fontFamily: SERIF, fontSize: '1rem', fontStyle: 'italic', color: `${CREAM}70`, lineHeight: 1.7, margin: 0 }}>
                  Merci. Notre conciergerie vous répondra sous 24 heures.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ background: DARK, padding: '2.75rem 2.5rem', borderTop: `2px solid ${GOLD}` }}>
                <label style={labelStyle}>Nom complet</label>
                <input style={inputStyle} type="text" placeholder="Votre nom" required />
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="votre@email.fr" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Arrivée</label>
                    <input style={inputStyle} type="text" placeholder="JJ / MM / AAAA" />
                  </div>
                  <div>
                    <label style={labelStyle}>Départ</label>
                    <input style={inputStyle} type="text" placeholder="JJ / MM / AAAA" />
                  </div>
                </div>
                <label style={labelStyle}>Catégorie souhaitée</label>
                <input style={inputStyle} type="text" placeholder="Ex. : Deluxe Suite, Grand Suite…" />
                <label style={labelStyle}>Message</label>
                <textarea style={{ ...inputStyle, minHeight: '8rem', resize: 'vertical' }} placeholder="Précisez votre demande (nombre de personnes, occasion…)." required />
                <button
                  type="submit"
                  style={{ width: '100%', padding: '1rem', background: GOLD, color: CREAM, border: 'none', fontFamily: SANS, fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD_DIM; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
                >
                  Envoyer ma demande
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <style>{`@media (max-width: 820px){ .gp-contact-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

// ─── MENTIONS LÉGALES & CONFIDENTIALITÉ ───────────────────────────────────────
// `mentions` content is verbatim per legal requirement. NEVER print a street address.
function LegalPage({ variant }: { variant: 'mentions' | 'privacy' }) {
  const sectionTitle: React.CSSProperties = {
    fontFamily: SERIF, fontSize: '1.7rem', fontWeight: 300, color: DARK, margin: '2.5rem 0 0.9rem',
  };
  const para: React.CSSProperties = {
    fontFamily: SERIF, fontSize: '1.05rem', color: `${DARK}88`, lineHeight: 1.85, marginBottom: '0.9rem',
  };
  const strong: React.CSSProperties = { color: DARK, fontWeight: 500 };

  if (variant === 'mentions') {
    return (
      <div>
        <SubPageHero
          eyebrow="Informations légales"
          title="Mentions légales"
          img="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&q=85"
        />
        <section style={{ background: CREAM, padding: '5rem 0 7rem' }}>
          <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 1.75rem' }}>
            <h2 style={{ ...sectionTitle, marginTop: 0 }}>Éditeur du site</h2>
            <p style={para}><span style={strong}>Aevia WS</span> — entrepreneur individuel (auto-entrepreneur).</p>
            <p style={para}>Directeur de la publication : <span style={strong}>Valentin Milliand</span>.</p>
            <p style={para}>SIREN : <span style={strong}>852 546 225</span> — RCS Bourg-en-Bresse.</p>
            <p style={para}>Contact : <span style={strong}>contact@aevia.io</span></p>
            <p style={para}>Adresse du siège social communiquée sur demande à contact@aevia.io.</p>

            <h2 style={sectionTitle}>TVA</h2>
            <p style={para}>TVA non applicable, art. 293 B du CGI.</p>

            <h2 style={sectionTitle}>Hébergeur</h2>
            <p style={para}>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

            <h2 style={sectionTitle}>Propriété intellectuelle</h2>
            <p style={para}>
              L'ensemble des contenus présents sur ce site (textes, visuels, logo, mise en page) est protégé par le droit
              de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable
              de l'éditeur.
            </p>

            <h2 style={sectionTitle}>Responsabilité</h2>
            <p style={para}>
              Les informations diffusées sur ce site sont fournies à titre indicatif. Les visuels et tarifs présentés ne
              sont pas contractuels et peuvent évoluer sans préavis.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <SubPageHero
        eyebrow="Protection des données"
        title="Confidentialité"
        img="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=85"
      />
      <section style={{ background: CREAM, padding: '5rem 0 7rem' }}>
        <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 1.75rem' }}>
          <p style={{ ...para, fontStyle: 'italic', color: `${DARK}60` }}>Dernière mise à jour : juin 2026.</p>

          <h2 style={{ ...sectionTitle, marginTop: '1.5rem' }}>Responsable du traitement</h2>
          <p style={para}>
            Le responsable du traitement des données personnelles est <span style={strong}>Aevia WS</span>, éditeur du
            site. Pour toute question, écrivez à <span style={strong}>contact@aevia.io</span>.
          </p>

          <h2 style={sectionTitle}>Données collectées</h2>
          <p style={para}>
            Nous collectons uniquement les données que vous nous transmettez volontairement via le formulaire de contact
            (nom, email, dates de séjour, catégorie souhaitée et message), aux seules fins de traiter votre demande de
            réservation ou de renseignement.
          </p>

          <h2 style={sectionTitle}>Finalité et base légale</h2>
          <p style={para}>
            Vos données sont traitées sur la base de votre consentement et de l'intérêt légitime du palace à répondre aux
            sollicitations. Elles ne font l'objet d'aucune cession à des tiers à des fins commerciales.
          </p>

          <h2 style={sectionTitle}>Durée de conservation</h2>
          <p style={para}>
            Les données issues du formulaire de contact sont conservées le temps nécessaire au traitement de votre demande,
            puis archivées ou supprimées conformément aux obligations légales applicables.
          </p>

          <h2 style={sectionTitle}>Vos droits</h2>
          <p style={para}>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et
            d'opposition au traitement de vos données. Pour exercer ces droits, écrivez à contact@aevia.io.
          </p>

          <h2 style={sectionTitle}>Cookies</h2>
          <p style={para}>
            Ce site ne dépose pas de cookies de suivi publicitaire. Seuls des cookies techniques strictement nécessaires
            au fonctionnement du site peuvent être utilisés.
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function GrandPalaisPage() {
  useFonts();

  const [scrolled, setScrolled] = useState(false);
  const [page, setPage] = useState<HotelPage>('home');
  const [roomSlug, setRoomSlug] = useState<string | null>(null);
  const [blogSlug, setBlogSlug] = useState<string | null>(null);

  const goTo = useCallback((p: HotelPage) => {
    setPage(p);
    setRoomSlug(null);
    setBlogSlug(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: CREAM,
        fontFamily: SANS,
        color: DARK,
        overflowX: 'hidden',
      }}
    >
      <ScrollProgress />
      <NavBar scrolled={scrolled} page={page} goTo={goTo} />

      {/* ══════════ HOME (original single-page content, unchanged) ══════════ */}
      {page === 'home' && (
        <>
          <HeroSection />
          <StatsBar />
          <RoomsSection />
          <ParallaxDivider />
          <ExperienceSection />
          <DiningSection />
          <TestimonialsSection />
          <LocationSection />
          <BookingCTA />
        </>
      )}

      {/* ══════════ EXTRA PAGES (theme-native, built from the same tokens) ══════════ */}
      {page === 'chambres' && <ChambresPage roomSlug={roomSlug} setRoomSlug={setRoomSlug} goTo={goTo} />}
      {page === 'services' && <ServicesPage goTo={goTo} />}
      {page === 'blog' && <BlogPage blogSlug={blogSlug} setBlogSlug={setBlogSlug} />}
      {page === 'contact' && <ContactPage />}
      {page === 'mentions' && <LegalPage variant="mentions" />}
      {page === 'privacy' && <LegalPage variant="privacy" />}

      <Footer goTo={goTo} />
    </div>
  );
}
