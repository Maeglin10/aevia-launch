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
    label: "L\'Atelier",
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
    desc: "An intimate bar presided over by our Maître d\'Alcools. Three thousand labels. One extraordinary conversation.",
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

// Top-nav destinations only — legal pages (mentions/privacy) live in the FOOTER,
// never in the top nav or the mobile drawer. Labels match the home language (EN).
const NAV_PAGES: { key: HotelPage; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'chambres', label: 'Rooms' },
  { key: 'services', label: 'Services' },
  { key: 'blog', label: 'Journal' },
  { key: 'contact', label: 'Contact' },
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
    view: 'Courtyard Garden',
    price: '€480',
    tag: 'Most Requested',
    desc: 'A sanctuary of refined calm. Hand-stitched linen, aged oak flooring and a private terrace overlooking the sculpted garden.',
    long: 'Nestled around the inner garden, the Prestige Room captures the art of living of the Grand Palais in its most essential form. Every material was chosen for touch as much as for the eye: hand-embroidered house linen, oak flooring softened by time, veined marble in the bathroom. A private terrace opens onto the sculpted garden — a refuge of silence at the heart of the city.',
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=85',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
    ],
    amenities: ['Private terrace', 'King-size linen bed', 'Marble bathroom', 'Butler service', 'Fibre Wi-Fi', 'Prestige minibar'],
  },
  {
    slug: 'deluxe-suite',
    name: 'Deluxe Suite',
    size: '65 m²',
    view: 'Panoramic Park',
    price: '€780',
    tag: 'Guest Favourite',
    desc: 'Soaring ceilings, a double marble bathroom and floor-to-ceiling windows that frame the park like a living painting.',
    long: 'The Deluxe Suite unfolds its generous volumes beneath classic French ceilings. Full-height windows frame the park like a canvas in perpetual motion, from the first foliage of spring to the golds of autumn. A separate sitting room, a double Carrara marble bathroom and a full dressing room make it a destination in its own right, conceived for stays that linger.',
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85',
    ],
    amenities: ['Separate sitting room', 'Double marble bathroom', 'Full dressing room', 'Panoramic park view', 'Barista coffee machine', 'Butler service'],
  },
  {
    slug: 'grand-suite',
    name: 'Grand Suite',
    size: '110 m²',
    view: 'City Skyline',
    price: '€1,200',
    tag: 'Signature',
    desc: 'Our most coveted address. A private dining room, a butler antechamber and a rooftop terrace over the skyline.',
    long: 'The jewel of the house, the Grand Suite occupies the most sought-after corner of the palace. A private dining room seats up to eight guests, an antechamber dedicates a space to the butler attached to the suite, and the rooftop terrace embraces the golden skyline at dusk. Here, every detail is bespoke — from the choice of pillows to the menu of rare teas.',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85',
    ],
    amenities: ['Private dining room', 'Rooftop terrace', '24-hour dedicated butler', 'Reception antechamber', 'Private wine cellar', 'Unlimited spa access'],
  },
  {
    slug: 'suite-presidentielle',
    name: 'Presidential Suite',
    size: '180 m²',
    view: '360° City View',
    price: '€2,800',
    tag: 'Exceptional',
    desc: 'The ultimate expression of the stay. Two bedrooms, a library, a grand piano and a suspended garden terrace.',
    long: 'On the top floor of the Grand Palais, the Presidential Suite extends across one hundred and eighty square metres of absolute elegance. Two principal bedrooms, a panelled library, a grand piano tuned each week and a suspended garden terrace offering a 360° view compose the setting of a stay without equal. A private chef, a chauffeured car and a personal concierge complete the experience.',
    img: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85',
    ],
    amenities: ['Two principal bedrooms', 'Library & grand piano', 'Suspended garden terrace', 'Private chef on request', 'Chauffeured car', 'Personal concierge'],
  },
];

// ─── Hotel services / experiences (Services sub-page) ─────────────────────────
const SERVICES = [
  {
    glyph: '✦',
    label: 'Espace Étoile',
    sub: 'Spa & Thermal Circuit',
    desc: 'Seven treatment rooms, a Roman hammam and a 25-metre heated pool. Every ritual is bespoke, every moment restorative.',
    img: 'https://images.unsplash.com/photo-1540541338537-1220059a0de6?w=1000&q=85',
    points: ['Roman hammam & sauna', '25 m heated pool', 'Bespoke signature treatments', '24-hour fitness suite'],
  },
  {
    glyph: '✶',
    label: "L'Atelier",
    sub: 'Two Michelin Stars',
    desc: 'Chef Margaux Vernet reimagines the French canon with produce grown fifty metres from the kitchen. The tasting menu changes with the moon.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=85',
    points: ['Seasonal tasting menu', 'Estate kitchen garden', 'Wine pairings', 'Private chef\'s table'],
  },
  {
    glyph: '◈',
    label: 'Bar Lumière',
    sub: 'Rare Spirits & Cellar',
    desc: "An intimate bar presided over by our Maître d\'Alcools. Three thousand labels. One extraordinary conversation.",
    img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1000&q=85',
    points: ['3,000 labels', 'Dedicated Maître d\'Alcools', 'Signature cocktails', 'Private tasting evenings'],
  },
  {
    glyph: '◎',
    label: "Clefs d\'Or Concierge",
    sub: 'Available 24 Hours',
    desc: 'Reservations, private transfers, exceptional cultural access: our concierge composes every stay like a unique score.',
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&q=85',
    points: ['Private transfers & jet', 'Exclusive cultural access', 'Theatre reservations', 'Personal shopping'],
  },
  {
    glyph: '❖',
    label: 'Private Events',
    sub: 'Salons & Honour Gardens',
    desc: 'Weddings, gala dinners, executive retreats: our state salons and four hectares of gardens host your finest occasions.',
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&q=85',
    points: ['State salons', '4 hectares of gardens', 'Michelin catering', 'Dedicated coordination'],
  },
  {
    glyph: '✧',
    label: 'Car & Chauffeur',
    sub: 'Exceptional Mobility',
    desc: 'A fleet of prestige saloons and discreet chauffeurs to reach the airport or explore the city in complete serenity.',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=85',
    points: ['Prestige saloons', 'English-speaking chauffeurs', 'Airport transfers', 'Bespoke excursions'],
  },
];

// ─── Blog mock data (EN — art of living / travel / gastronomy) ────────────────
const BLOG_POSTS = [
  {
    slug: 'art-of-the-table',
    title: 'The French Art of the Table, a Living Heritage',
    date: '5 June 2026',
    category: 'Art of Living',
    excerpt:
      'From the fold of the cloth to the choice of crystal, the French table is a silent choreography. A look inside a craft the Grand Palais perpetuates every evening.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85',
    body: [
      'Setting a table is not a utilitarian gesture: it is a form of courtesy addressed to the one you receive. In the French manner, the arrangement obeys a precise grammar, inherited from the great houses and passed down from generation to generation.',
      'Everything begins with the cloth, whose central fold must run perfectly down the middle of the table. The cutlery is laid from the outside in, in the order of service; the glasses align on a diagonal, from largest to smallest, above the tip of the knife.',
      "At the Grand Palais, our maîtres d\'hôtel uphold these codes without nostalgia. Cut crystal sits alongside contemporary porcelain, and every dinner becomes a discreet staging in which the comfort of the guest always prevails over display.",
      'For true luxury, at the table as elsewhere, is not ostentation: it is that acquired ease which makes everything appear simple, obvious, natural.',
    ],
  },
  {
    slug: 'loire-valley-escape',
    title: 'An Escape to the Loire Valley',
    date: '22 May 2026',
    category: 'Travel',
    excerpt:
      'Two hours from the palace, the châteaux of the Loire reveal formal gardens and troglodyte cellars. Our concierge composes the ideal day-long itinerary.',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85',
    body: [
      'When the longing for the horizon makes itself felt, the Loire Valley offers an enchanted interlude. Barely two hours from the Grand Palais, it unrolls its Renaissance châteaux along a royal river, listed as a World Heritage site.',
      'Our concierge composes a bespoke day for you: a private château visit at opening, before the groups arrive, lunch in a guest house, then a tasting in a troglodyte cellar carved straight into the tufa.',
      "Garden lovers will not miss the formal parterres, drawn with a string line, where the gardener\'s art rivals the architect\'s. History enthusiasts, for their part, will linger on the double-helix staircases attributed to Leonardo da Vinci.",
      'When evening comes, the car returns you to the palace, where a light dinner awaits. The Loire is the French art of travel: neither hurried nor demonstrative — simply right.',
    ],
  },
  {
    slug: 'menu-of-a-chef',
    title: 'The Menu of a Chef: Margaux Vernet Confides',
    date: '8 May 2026',
    category: 'Gastronomy',
    excerpt:
      "Two stars, a kitchen garden fifty metres from the stoves and a philosophy of the season. A meeting with the chef of L\'Atelier, at the Grand Palais.",
    img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=85',
    body: [
      "\"A menu is, first of all, a season you listen to.\" So speaks Margaux Vernet, the two-star chef of L\'Atelier, the restaurant of the Grand Palais. In her world, the menu is never fixed: it breathes to the rhythm of the kitchen garden.",
      'Fifty metres separate the stoves from the growing beds. That proximity changes everything: the herbs are picked at the last minute, the vegetables harvested at perfect ripeness, and waste tends towards zero. "The shortest distance between the earth and the plate," she sums up.',
      'Her cooking revisits the French canon with rare restraint. No flourishes, no technical excess: a sauce reduced with patience, an exact cooking time, a millimetric seasoning. The emotion is born of precision, never of demonstration.',
      'When asked for her definition of luxury, she smiles: "It is being able to offer a guest a tomato that tastes of a tomato. The rest is only décor."',
    ],
  },
  {
    slug: 'winter-spa-ritual',
    title: 'The Winter Spa Ritual at Espace Étoile',
    date: '24 April 2026',
    category: 'Art of Living',
    excerpt:
      'Roman hammam, warm-oil massage and a herbal tea room: discover the treatment journey our spa reserves for the cold season.',
    img: 'https://images.unsplash.com/photo-1540541338537-1220059a0de6?w=1200&q=85',
    body: [
      'When the city turns grey, Espace Étoile becomes a cocoon. For winter, our spa has designed a treatment journey conceived as an inner voyage, from the first breath of steam to the last sip of herbal tea.',
      'The ritual opens with the Roman hammam, whose moist heat prepares the skin and soothes the mind. Then comes a mineral-salt scrub, followed by a full-body massage with warm oils whose fragrances change with the season.',
      'The journey continues in the heated pool, where the dimmed light invites you to let go, before a moment of rest in the tea room, around infusions composed by our herbalist.',
      'Ninety minutes later, you leave Espace Étoile with that rare sensation: of having, for a moment, suspended the passing of time.',
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
// The links now drive in-page navigation via goTo instead of dead `href="#hero"`.
function NavBar({ scrolled, page, goTo }: { scrolled: boolean; page: HotelPage; goTo: (p: HotelPage) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // NAV_PAGES already excludes legal pages (those live only in the footer), so
  // both the desktop bar and the mobile drawer render the same content pages.
  const desktopPages = NAV_PAGES;

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
            Reserve
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
    <section id="hero"
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

// ─── Rooms Section ───────────────────────────────────────────────────────────
// PREVIOUSLY: a scroll-driven horizontal rail. The section was `${100 + N*60}vh`
// tall (≈280vh) with a `position: sticky` inner column whose horizontal
// transform (`x`) was tied to vertical scroll progress over that height. The
// root page wrapper sets `overflowX: 'hidden'`, which turns an ancestor into a
// scroll container and BREAKS `position: sticky` on descendants. With sticky
// dead, the 280vh section rendered as one huge empty gap and the rail never
// advanced — rooms were unbrowsable. Rewritten as a clean responsive grid
// (same dark room-card visual style, same data) so it is always browsable on
// desktop + mobile and occupies only its natural height — no empty gap. The
// root wrapper's `overflowX` is also switched to `clip` (see Root Page) so any
// remaining sticky/parallax descendants behave correctly.
function RoomsSection({ goTo }: { goTo: (p: HotelPage) => void }) {
  return (
    <section style={{ position: 'relative', background: CREAM, padding: '8rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '75rem', margin: '0 auto', padding: '0 3rem', position: 'relative' }}>
        {/* Section label */}
        <div style={{ marginBottom: '3.5rem' }}>
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
              Rooms &amp; Suites
            </h2>
          </BlurReveal>
        </div>

        {/* Decorative oversized watermark behind the grid (purely visual) */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '-1rem',
            fontFamily: SERIF,
            fontSize: 'clamp(7rem, 18vw, 16rem)',
            fontWeight: 300,
            color: `${GOLD}12`,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {ROOMS[0].num}
        </span>

        {/* Responsive grid of room cards (browsable on all viewports) */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {ROOMS.map((room, i) => (
            <RoomCard key={room.num} room={room} index={i} goTo={goTo} />
          ))}
        </div>

        {/* Browse-all link to the full catalogue */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <button
            onClick={() => goTo('chambres')}
            style={{
              fontFamily: SANS,
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              background: 'transparent',
              color: GOLD,
              border: `1px solid ${GOLD}60`,
              padding: '1rem 2.5rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => { const t = e.currentTarget as HTMLButtonElement; t.style.background = GOLD; t.style.color = CREAM; }}
            onMouseLeave={(e) => { const t = e.currentTarget as HTMLButtonElement; t.style.background = 'transparent'; t.style.color = GOLD; }}
          >
            View All Rooms &amp; Suites
          </button>
        </div>
      </div>
    </section>
  );
}

function RoomCard({
  room,
  index,
  goTo,
}: {
  room: typeof ROOMS[0];
  index: number;
  goTo: (p: HotelPage) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -6 }}
      onClick={() => goTo('chambres')}
      style={{
        background: DARK,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '15rem', overflow: 'hidden' }}>
        <img
          src={room.img}
          alt={room.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
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

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1.5rem' }}>
          <div>
            <p style={{ fontFamily: SANS, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: `${CREAM}40`, marginBottom: '0.2rem' }}>
              From
            </p>
            <p style={{ fontFamily: SERIF, fontSize: '2.2rem', fontWeight: 300, color: GOLD, lineHeight: 1 }}>
              {room.price}
              <span style={{ fontFamily: SANS, fontSize: '0.65rem', color: `${CREAM}40`, marginLeft: '0.3rem' }}>/night</span>
            </p>
          </div>
          <span
            style={{
              fontFamily: SANS,
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: GOLD,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            Discover →
          </span>
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
      title: 'Stay',
      links: [
        { label: 'Rooms & Suites', page: 'chambres' },
        { label: 'Prestige Room', page: 'chambres' },
        { label: 'Grand Suite', page: 'chambres' },
        { label: 'Presidential Suite', page: 'chambres' },
      ],
    },
    {
      title: 'Experiences',
      links: [
        { label: "L'Atelier Restaurant", page: 'services' },
        { label: 'Espace Étoile Spa', page: 'services' },
        { label: 'Bar Lumière', page: 'services' },
        { label: 'Private Events', page: 'services' },
      ],
    },
    {
      title: 'Information',
      links: [
        { label: 'The Journal', page: 'blog' },
        { label: 'Contact', page: 'contact' },
        { label: 'Legal Notice', page: 'mentions' },
        { label: 'Privacy Policy', page: 'privacy' },
      ],
    },
  ];

  // Social links are external and may remain external (they open in a new tab).
  const socials: { label: string; href: string }[] = [
    { label: 'IG', href: 'https://www.instagram.com' },
    { label: 'FB', href: 'https://www.facebook.com' },
    { label: 'TW', href: 'https://www.x.com' },
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
              A palace of quiet distinction at the heart of Paris since 1887.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    background: `${GOLD}20`,
                    border: `1px solid ${GOLD}30`,
                    color: GOLD,
                    fontFamily: SANS,
                    fontSize: '0.55rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  {s.label}
                </a>
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
            © 2026 Grand Palais. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {([
              { label: 'Legal Notice', page: 'mentions' as HotelPage },
              { label: 'Privacy Policy', page: 'privacy' as HotelPage },
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
              ← All rooms
            </button>

            <div className="gp-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
              {/* Gallery */}
              <BlurReveal>
                <div>
                  <img
                    src={room.gallery[activeImg]}
                    alt={room.name}
                    loading="lazy"
                    style={{ width: '100%', height: 'clamp(280px, 42vw, 460px)', objectFit: 'cover', display: 'block', marginBottom: '1rem' }}
                  />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {room.gallery.map((g, i) => (
                      <button
                        key={g}
                        onClick={() => setActiveImg(i)}
                        aria-label={`${room.name} photo ${i + 1}`}
                        style={{ flex: 1, height: '5rem', padding: 0, border: i === activeImg ? `2px solid ${GOLD}` : '2px solid transparent', cursor: 'pointer', overflow: 'hidden', background: 'none' }}
                      >
                        <img src={g} alt="Image de présentation" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </button>
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
                    Amenities
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
                        From
                      </p>
                      <p style={{ fontFamily: SERIF, fontSize: '2.6rem', fontWeight: 300, color: GOLD, lineHeight: 1 }}>
                        {room.price}
                        <span style={{ fontFamily: SANS, fontSize: '0.7rem', color: `${DARK}50`, marginLeft: '0.3rem' }}>/ night</span>
                      </p>
                    </div>
                    <button
                      onClick={() => goTo('contact')}
                      style={{ fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', background: GOLD, color: CREAM, border: 'none', padding: '1rem 2.5rem', cursor: 'pointer' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD_DIM; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
                    >
                      Reserve
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
        eyebrow="Accommodations"
        title="Rooms & Suites"
        subtitle="Four exceptional categories, each a variation on the same art of welcoming. Choose your refuge."
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
                <div style={{ height: '15rem', position: 'relative', overflow: 'hidden' }}>
                  <img src={r.img} alt={r.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
                        From
                      </p>
                      <p style={{ fontFamily: SERIF, fontSize: '2.2rem', fontWeight: 300, color: GOLD, lineHeight: 1 }}>
                        {r.price}
                        <span style={{ fontFamily: SANS, fontSize: '0.65rem', color: `${CREAM}40`, marginLeft: '0.3rem' }}>/night</span>
                      </p>
                    </div>
                    <span style={{ fontFamily: SANS, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      Discover →
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
        eyebrow="The Experience"
        title="Services & Experiences"
        subtitle="Spa, gastronomy, concierge: every service at the Grand Palais is designed so that everything feels simple and natural."
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
                <div style={{ height: '12rem', position: 'relative', overflow: 'hidden' }}>
                  <img src={s.img} alt={s.label} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
                Let us compose your stay together
              </h2>
              <p style={{ fontFamily: SERIF, fontSize: '1rem', fontStyle: 'italic', color: `${DARK}80`, margin: 0, maxWidth: '32rem' }}>
                Our concierge is available at every hour to orchestrate a stay that is entirely yours.
              </p>
            </div>
            <button
              onClick={() => goTo('contact')}
              style={{ fontFamily: SANS, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', background: DARK, color: CREAM, border: 'none', padding: '1rem 2.5rem', cursor: 'pointer', flexShrink: 0 }}
            >
              Contact Us
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
              ← All articles
            </button>
            {post.body.map((para, i) => (
              <p key={i} style={{ fontFamily: SERIF, fontSize: '1.15rem', color: `${DARK}90`, lineHeight: 1.9, marginBottom: '1.6rem' }}>
                {para}
              </p>
            ))}
            <div style={{ borderTop: `1px solid ${GOLD}40`, marginTop: '2rem', paddingTop: '1.5rem', fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.95rem', color: `${DARK}70` }}>
              Written by the editorial team of the Grand Palais. The Journal of the palace, published throughout the year.
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <SubPageHero
        eyebrow="The Journal of the Palace"
        title="The Journal"
        subtitle="Our chronicles of the art of living, travel and gastronomy, written to the rhythm of the seasons."
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
                <div style={{ height: '12rem', position: 'relative', overflow: 'hidden' }}>
                  <img src={p.img} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
                    Read the article →
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
    outline: "none', fontFamily: SERIF, marginBottom: '1.1rem",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS, fontSize: '0.6rem', color: GOLD_DIM,
    letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
    marginBottom: "0.45rem', display: 'block",
  };

  return (
    <div>
      <SubPageHero
        eyebrow="Reservations & Concierge"
        title="Contact"
        subtitle="Our team is at your service at every hour to compose a stay that reflects who you are."
        img="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85"
      />
      <section style={{ background: CREAM, padding: '7rem 0' }}>
        <div className="gp-contact-grid" style={{ maxWidth: '70rem', margin: '0 auto', padding: '0 3rem', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(3rem, 5vw, 5rem)', alignItems: 'start' }}>
          {/* Info */}
          <div>
            {[
              { label: 'Telephone', val: '+33 1 40 00 00 00' },
              { label: 'Reservations', val: 'reservations@grandpalais.fr' },
              { label: 'Address', val: '8 Avenue de la Paix, 75009 Paris' },
              { label: 'Concierge', val: 'Available 24 hours a day' },
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
              For private hire, events or long-stay enquiries, our concierge replies within 24 hours.
            </p>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ background: DARK, padding: '3.5rem 2.5rem', textAlign: 'center', borderTop: `2px solid ${GOLD}` }}>
                <p style={{ fontSize: '1.8rem', color: GOLD, marginBottom: '1rem' }}>✦</p>
                <h3 style={{ fontFamily: SERIF, fontSize: '1.8rem', fontWeight: 300, color: CREAM, marginBottom: '0.8rem' }}>Request sent</h3>
                <p style={{ fontFamily: SERIF, fontSize: '1rem', fontStyle: 'italic', color: `${CREAM}70`, lineHeight: 1.7, margin: 0 }}>
                  Thank you. Our concierge will reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ background: DARK, padding: '2.75rem 2.5rem', borderTop: `2px solid ${GOLD}` }}>
                <label style={labelStyle}>Full name</label>
                <input style={inputStyle} type="text" placeholder="Your name" required />
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="you@email.com" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Arrival</label>
                    <input style={inputStyle} type="text" placeholder="DD / MM / YYYY" />
                  </div>
                  <div>
                    <label style={labelStyle}>Departure</label>
                    <input style={inputStyle} type="text" placeholder="DD / MM / YYYY" />
                  </div>
                </div>
                <label style={labelStyle}>Preferred category</label>
                <input style={inputStyle} type="text" placeholder="e.g. Deluxe Suite, Grand Suite…" />
                <label style={labelStyle}>Message</label>
                <textarea style={{ ...inputStyle, minHeight: '8rem', resize: 'vertical' }} placeholder="Tell us about your request (number of guests, occasion…)." required />
                <button
                  type="submit"
                  style={{ width: '100%', padding: '1rem', background: GOLD, color: CREAM, border: 'none', fontFamily: SANS, fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD_DIM; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
                >
                  Send my request
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
          eyebrow="Legal Information"
          title="Legal Notice"
          img="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&q=85"
        />
        <section style={{ background: CREAM, padding: '5rem 0 7rem' }}>
          <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 1.75rem' }}>
            <h2 style={{ ...sectionTitle, marginTop: 0 }}>Site publisher</h2>
            <p style={para}><span style={strong}>Aevia WS</span> — sole trader (auto-entrepreneur).</p>
            <p style={para}>Publication director: <span style={strong}>Valentin Milliand</span>.</p>
            <p style={para}>SIREN: <span style={strong}>852 546 225</span> — RCS Bourg-en-Bresse.</p>
            <p style={para}>Contact: <span style={strong}>valentinmilliand@aevia.services</span></p>
            <p style={para}>Registered office address provided on request at valentinmilliand@aevia.services.</p>

            <h2 style={sectionTitle}>VAT</h2>
            <p style={para}>VAT not applicable, art. 293 B of the French Tax Code (CGI).</p>

            <h2 style={sectionTitle}>Hosting</h2>
            <p style={para}>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

            <h2 style={sectionTitle}>Intellectual property</h2>
            <p style={para}>
              All content on this site (text, visuals, logo, layout) is protected by intellectual property law. Any
              reproduction, even partial, is prohibited without the prior authorisation of the publisher.
            </p>

            <h2 style={sectionTitle}>Liability</h2>
            <p style={para}>
              The information published on this site is provided for guidance only. The visuals and rates shown are not
              contractual and may change without notice.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <SubPageHero
        eyebrow="Data Protection"
        title="Privacy Policy"
        img="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=85"
      />
      <section id="contact" style={{ background: CREAM, padding: '5rem 0 7rem' }}>
        <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 1.75rem' }}>
          <p style={{ ...para, fontStyle: 'italic', color: `${DARK}60` }}>Last updated: June 2026.</p>

          <h2 style={{ ...sectionTitle, marginTop: '1.5rem' }}>Data controller</h2>
          <p style={para}>
            The controller of personal data is <span style={strong}>Aevia WS</span>, publisher of the site. For any
            question, write to <span style={strong}>valentinmilliand@aevia.services</span>.
          </p>

          <h2 style={sectionTitle}>Data collected</h2>
          <p style={para}>
            We collect only the data you voluntarily provide through the contact form (name, email, stay dates, preferred
            category and message), solely to process your reservation or enquiry request.
          </p>

          <h2 style={sectionTitle}>Purpose and legal basis</h2>
          <p style={para}>
            Your data is processed on the basis of your consent and the palace's legitimate interest in responding to
            enquiries. It is never sold or transferred to third parties for commercial purposes.
          </p>

          <h2 style={sectionTitle}>Retention period</h2>
          <p style={para}>
            Data from the contact form is kept for the time necessary to process your request, then archived or deleted in
            accordance with applicable legal obligations.
          </p>

          <h2 style={sectionTitle}>Your rights</h2>
          <p style={para}>
            In accordance with the GDPR, you have the right to access, rectify, erase, port and object to the processing of
            your data. To exercise these rights, write to valentinmilliand@aevia.services.
          </p>

          <h2 style={sectionTitle}>Cookies</h2>
          <p style={para}>
            This site does not place advertising tracking cookies. Only technical cookies strictly necessary for the
            operation of the site may be used.
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
  const [page, setPage] = useState<HotelPage>('blog');
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
        // `clip` (not `hidden`) prevents horizontal overflow WITHOUT turning this
        // wrapper into a scroll container — which is what breaks `position: sticky`
        // and parallax on descendant sections.
        overflowX: 'clip',
      }}
    >
      <ScrollProgress />
      <NavBar scrolled={scrolled} page={page} goTo={goTo} />

      {/* ══════════ HOME (original single-page content, unchanged) ══════════ */}
      {page === 'home' && (
        <>
          <HeroSection />
          <StatsBar />
          <RoomsSection goTo={goTo} />
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
