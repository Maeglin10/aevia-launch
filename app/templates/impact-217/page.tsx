'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Check,
  Zap,
  Camera,
  AtSign,
  PlayCircle,
  ChevronDown,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   AirForge — Premium Sneaker / Streetwear E-commerce
   Real photography + reference-grade scroll choreography
   (Nike SNKRS × rideradian.com × Apple product pages)
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  bg: '#0a0a0b',
  bgAlt: '#101012',
  bgCard: '#141417',
  bgCardHover: '#1b1b1f',
  accent: '#d4ff00', // acid yellow
  accentDim: '#aacc00',
  white: '#f5f6f7',
  textMuted: '#8d909a',
  textFaint: '#5a5d66',
  border: '#222227',
  borderBright: '#34343b',
} as const;

const FONT_STACK =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/* ── Photography (15 pre-verified Unsplash URLs — DO NOT alter photo IDs) ──── */
const u = (id: string, w = 1600, q = 80): string =>
  `https://images.unsplash.com/photo-${id}?q=${q}&w=${w}&auto=format&fit=crop`;

const IMG = {
  hero: u('1542291026-7eec264c27ff', 2000, 85),
  seq1: u('1460353581641-37baddab0fa2'),
  seq2: u('1556906781-9a412961c28c'),
  seq3: u('1595950653106-6c9ebd614d3a'),
  drop1: u('1549298916-b41d501d3772', 1200),
  drop2: u('1600185365926-3a2ce3cdb9eb', 1200),
  drop3: u('1606107557195-0e29a4b5b4aa', 1200),
  drop4: u('1543508282-6319a3e2621f', 1200),
  story1: u('1525966222134-fcfa99b8ae77'),
  story2: u('1514989940723-e8e51635b782'),
  spec: u('1491553895911-0055eca6402d', 1400, 85),
  look1: u('1597045566677-8cf032ed6634', 1000),
  look2: u('1608231387042-66d1773070a5', 1000),
  look3: u('1539185441755-769473a23570', 1000),
  cta: u('1551107696-a4b0c5a0d9a2', 2000, 85),
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Shared motion + small helpers
   ════════════════════════════════════════════════════════════════════════════ */

const easeOut = [0.16, 1, 0.3, 1] as const;

const revealUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOut },
  },
};

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  as?: 'div' | 'section' | 'header' | 'li';
}

function Reveal({ children, className, style, delay = 0, as = 'div' }: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, ease: easeOut, delay },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

/* Tiny utility for the eyebrow accent label */
function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: C.accent,
        ...style,
      }}
    >
      <span
        style={{
          width: 28,
          height: 1.5,
          background: C.accent,
          display: 'inline-block',
        }}
      />
      {children}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

interface Product {
  id: string;
  name: string;
  edition: string;
  price: number;
  img: string;
  badge?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'af-01',
    name: 'Forge Runner OG',
    edition: "Vol. 01 — Carbon",
    price: 229,
    img: IMG.drop1,
    badge: 'Limited',
  },
  {
    id: 'af-02',
    name: 'Street Anvil Mid',
    edition: 'Vol. 02 — Ember',
    price: 259,
    img: IMG.drop2,
    badge: 'New Drop',
  },
  {
    id: 'af-03',
    name: 'Molten Low Pro',
    edition: 'Vol. 03 — Ash',
    price: 199,
    img: IMG.drop3,
  },
  {
    id: 'af-04',
    name: 'Ironclad Hi',
    edition: 'Vol. 04 — Onyx',
    price: 289,
    img: IMG.drop4,
    badge: 'Limited',
  },
];

interface SeqPhase {
  img: string;
  caption: string;
  sub: string;
}

const SEQUENCE: SeqPhase[] = [
  {
    img: IMG.seq1,
    caption: 'AIR-CUSHIONED SOLE',
    sub: 'Nitrogen-charged midsole tuned for 14% more energy return.',
  },
  {
    img: IMG.seq2,
    caption: 'PREMIUM SUEDE',
    sub: 'Full-grain Italian suede, hand-finished in small batches.',
  },
  {
    img: IMG.seq3,
    caption: 'FORGED OUTSOLE',
    sub: 'Vulcanized carbon-rubber traction that refuses to quit.',
  },
];

interface Spec {
  k: string;
  title: string;
  body: string;
}

const SPECS: Spec[] = [
  {
    k: '01',
    title: 'Nitro-Forge midsole',
    body: 'A pressurized nitrogen core wrapped in supercritical foam. Lighter than the air it traps, springier than anything we have built.',
  },
  {
    k: '02',
    title: 'Italian full-grain suede',
    body: 'Tanned in Tuscany, cut by hand. Each upper develops its own patina, so no two pairs age the same way.',
  },
  {
    k: '03',
    title: 'Carbon traction plate',
    body: 'A forged carbon-rubber outsole with directional lugs engineered for wet concrete, gravel, and everything between.',
  },
  {
    k: '04',
    title: 'Recycled knit collar',
    body: 'A breathable, moisture-wicking ankle collar spun from 92% recycled ocean-bound plastics.',
  },
];

interface Look {
  img: string;
  tall?: boolean;
  label: string;
}

const LOOKBOOK: Look[] = [
  { img: IMG.look1, tall: true, label: 'Concrete Editorial' },
  { img: IMG.story1, label: 'Studio 04' },
  { img: IMG.look2, label: 'Night Shift' },
  { img: IMG.story2, label: 'On Foot' },
  { img: IMG.look3, tall: true, label: 'City Run' },
  { img: IMG.seq2, label: 'Detail Macro' },
];

interface Review {
  name: string;
  handle: string;
  stars: number;
  text: string;
}

const REVIEWS: Review[] = [
  {
    name: 'Marcus T.',
    handle: '@marcusruns',
    stars: 5,
    text: 'These replaced three pairs in my rotation. The sole is unreal — I forget I am wearing them on a 10k.',
  },
  {
    name: 'Léa B.',
    handle: '@lea.streetwear',
    stars: 5,
    text: 'The suede is genuinely premium. People stop me on the street. Worth every euro and then some.',
  },
  {
    name: 'Devon K.',
    handle: '@dvnkicks',
    stars: 4,
    text: 'Copped the Vol. 02 drop in seconds. Build quality crushes brands twice the price. Shipping was fast too.',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   NAV — transparent over hero → solid on scroll
   ════════════════════════════════════════════════════════════════════════════ */

interface NavProps {
  cartCount: number;
}

function Nav({ cartCount }: NavProps) {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setSolid(v > 80));
    return () => unsub();
  }, [scrollY]);

  const links = ['Shop', 'Drops', 'Craft', 'Lookbook'];

  return (
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
        padding: solid ? '14px clamp(20px, 5vw, 64px)' : '24px clamp(20px, 5vw, 64px)',
        background: solid ? 'rgba(10,10,11,0.82)' : 'transparent',
        backdropFilter: solid ? 'blur(18px) saturate(140%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(18px) saturate(140%)' : 'none',
        borderBottom: solid ? `1px solid ${C.border}` : '1px solid transparent',
        transition:
          'padding 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: 22,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Zap size={20} color={C.accent} fill={C.accent} strokeWidth={1} />
        AirForge
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(18px, 3vw, 38px)',
        }}
      >
        <div
          className="af-nav-links"
          style={{ display: 'flex', gap: 'clamp(16px, 2.4vw, 34px)' }}
        >
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                color: C.white,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                opacity: 0.78,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.78')}
            >
              {l}
            </a>
          ))}
        </div>

        <button
          aria-label="Cart"
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: C.white,
            display: 'flex',
            alignItems: 'center',
            padding: 4,
          }}
        >
          <ShoppingBag size={22} strokeWidth={1.6} />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -8,
                  minWidth: 18,
                  height: 18,
                  padding: '0 5px',
                  borderRadius: 9,
                  background: C.accent,
                  color: '#0a0a0b',
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HERO — parallax photo + parallax headline
   ════════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Photo: scale + drift down slower
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  // Headline parallax (moves up faster than the photo)
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const subY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section id="hero"
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 640,
        overflow: 'hidden',
        background: C.bg,
      }}
    >
      {/* Parallax photo */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-6% 0 0 0',
          height: '112%',
          scale: imgScale,
          y: imgY,
          willChange: 'transform',
        }}
      >
        <img
          src={IMG.hero}
          alt="AirForge sneaker hero"
          loading="eager"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            display: 'block',
          }}
        />
      </motion.div>

      {/* Scrims for legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.15) 35%, rgba(10,10,11,0.35) 70%, rgba(10,10,11,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 100%, rgba(10,10,11,0.7) 0%, transparent 55%)',
        }}
      />

      {/* Headline cluster */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 clamp(20px, 5vw, 64px) clamp(56px, 9vh, 110px)',
          zIndex: 5,
        }}
      >
        <motion.div style={{ y: subY, opacity: titleOpacity }}>
          <Eyebrow style={{ marginBottom: 20 }}>Vol. 04 — Onyx · Out now</Eyebrow>
        </motion.div>

        <motion.h1
          style={{
            y: titleY,
            opacity: titleOpacity,
            margin: 0,
            fontWeight: 900,
            fontSize: 'clamp(3rem, 12vw, 12rem)',
            lineHeight: 0.86,
            letterSpacing: '-0.045em',
            textTransform: 'uppercase',
            color: C.white,
            maxWidth: '14ch',
            willChange: 'transform',
          }}
        >
          Forged for
          <br />
          the{' '}
          <span
            style={{
              color: 'transparent',
              WebkitTextStroke: `2px ${C.accent}`,
            }}
          >
            streets
          </span>
        </motion.h1>

        <motion.div
          style={{
            y: subY,
            opacity: titleOpacity,
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              margin: 0,
              maxWidth: 420,
              color: C.textMuted,
              fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
              lineHeight: 1.5,
            }}
          >
            Performance-grade sneakers, built like industrial machinery and
            finished like couture. Limited runs. Forged to outlast.
          </p>
          <a
            href="#drops"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: C.accent,
              color: '#0a0a0b',
              padding: '16px 28px',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 2,
            }}
          >
            Shop the drop <ArrowRight size={18} strokeWidth={2.4} />
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          x: '-50%',
          opacity: cueOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 6,
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: C.textMuted,
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.accent} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MARQUEE
   ════════════════════════════════════════════════════════════════════════════ */

function Marquee() {
  const items = [
    'NEW DROP',
    'LIMITED EDITION',
    'FREE SHIPPING OVER €150',
    'FORGED IN ITALY',
    '30-DAY RETURNS',
  ];
  const loop = [...items, ...items, ...items];
  return (
    <div
      style={{
        background: C.accent,
        color: '#0a0a0b',
        overflow: 'hidden',
        borderTop: `1px solid ${C.bg}`,
        borderBottom: `1px solid ${C.bg}`,
        padding: '14px 0',
      }}
    >
      <motion.div
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', whiteSpace: 'nowrap', gap: 0 }}
      >
        {loop.map((t, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 28,
              paddingRight: 28,
              fontWeight: 900,
              fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {t}
            <Zap size={16} fill="#0a0a0b" strokeWidth={0} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   STICKY CROSSFADE SEQUENCE (Apple-style, real photos)
   ════════════════════════════════════════════════════════════════════════════ */

function SeqLayer({
  phase,
  index,
  progress,
}: {
  phase: SeqPhase;
  index: number;
  progress: MotionValue<number>;
}) {
  const n = SEQUENCE.length;
  const seg = 1 / n;
  const start = index * seg;
  const end = start + seg;

  // crossfade windows
  const fadeIn = start + seg * 0.12;
  const fadeOut = end - seg * 0.12;

  const opacity = useTransform(
    progress,
    index === 0
      ? [0, fadeOut, end]
      : index === n - 1
        ? [start, fadeIn, 1]
        : [start, fadeIn, fadeOut, end],
    index === 0
      ? [1, 1, 0]
      : index === n - 1
        ? [0, 1, 1]
        : [0, 1, 1, 0],
  );

  const scale = useTransform(progress, [start, end], [1.08, 1.0]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        willChange: 'opacity',
      }}
    >
      <motion.img
        src={phase.img}
        alt={phase.caption}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          scale,
          willChange: 'transform',
        }}
      />
    </motion.div>
  );
}

function CaptionLayer({
  phase,
  index,
  progress,
}: {
  phase: SeqPhase;
  index: number;
  progress: MotionValue<number>;
}) {
  const n = SEQUENCE.length;
  const seg = 1 / n;
  const start = index * seg;
  const end = start + seg;
  const mid = start + seg / 2;

  const opacity = useTransform(
    progress,
    [start, start + seg * 0.2, end - seg * 0.2, end],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, mid, end], [30, 0, -30]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 'clamp(20px, 5vw, 64px)',
        bottom: 'clamp(48px, 10vh, 96px)',
        opacity,
        y,
        maxWidth: 560,
        willChange: 'transform, opacity',
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.3em',
          color: C.accent,
        }}
      >
        0{index + 1} / 0{n}
      </span>
      <h3
        style={{
          margin: '12px 0 14px',
          fontWeight: 900,
          fontSize: 'clamp(2rem, 6vw, 5rem)',
          lineHeight: 0.94,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color: C.white,
        }}
      >
        {phase.caption}
      </h3>
      <p style={{ margin: 0, color: C.textMuted, fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)', lineHeight: 1.5 }}>
        {phase.sub}
      </p>
    </motion.div>
  );
}

function CrossfadeSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // progress bar
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      style={{ position: 'relative', height: '320vh', background: C.bg }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {SEQUENCE.map((p, i) => (
          <SeqLayer key={i} phase={p} index={i} progress={scrollYProgress} />
        ))}

        {/* darkening scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.25) 45%, transparent 70%), linear-gradient(0deg, rgba(10,10,11,0.7) 0%, transparent 40%)',
          }}
        />

        {/* section label top-right */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(90px, 14vh, 140px)',
            right: 'clamp(20px, 5vw, 64px)',
            textAlign: 'right',
          }}
        >
          <Eyebrow style={{ justifyContent: 'flex-end' }}>The Anatomy</Eyebrow>
        </div>

        {SEQUENCE.map((p, i) => (
          <CaptionLayer key={i} phase={p} index={i} progress={scrollYProgress} />
        ))}

        {/* progress bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 3,
            width: '100%',
            background: 'rgba(255,255,255,0.12)',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: C.accent,
              transformOrigin: 'left',
              scaleX: barScale,
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURED DROPS — product cards
   ════════════════════════════════════════════════════════════════════════════ */

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      variants={revealUp}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      {/* image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4 / 5' }}>
        <motion.img
          src={product.img}
          alt={product.name}
          loading="lazy"
          animate={{ scale: hover ? 1.08 : 1 }}
          transition={{ duration: 0.7, ease: easeOut }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              background: C.accent,
              color: '#0a0a0b',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '6px 10px',
              borderRadius: 2,
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Add to cart reveal */}
        <AnimatePresence>
          {hover && (
            <motion.button
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
              style={{
                position: 'absolute',
                left: 14,
                right: 14,
                bottom: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: added ? C.accent : 'rgba(10,10,11,0.88)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: added ? '#0a0a0b' : C.white,
                border: `1px solid ${added ? C.accent : C.borderBright}`,
                padding: '14px',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 2,
              }}
            >
              {added ? (
                <>
                  <Check size={16} strokeWidth={3} /> Added
                </>
              ) : (
                <>
                  <Plus size={16} strokeWidth={3} /> Add to cart
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* meta */}
      <div style={{ padding: '20px 20px 24px' }}>
        <div style={{ fontSize: 12, color: C.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          {product.edition}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 12,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.02em',
              color: C.white,
            }}
          >
            {product.name}
          </h3>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: C.accent }}>
            €{product.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedDrops({ onAdd }: { onAdd: () => void }) {
  return (
    <section
      id="drops"
      style={{
        background: C.bg,
        padding: 'clamp(80px, 12vh, 140px) clamp(20px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 24,
              marginBottom: 'clamp(40px, 6vh, 72px)',
            }}
          >
            <div>
              <Eyebrow style={{ marginBottom: 18 }}>Featured Drops</Eyebrow>
              <h2
                style={{
                  margin: 0,
                  fontWeight: 900,
                  fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  color: C.white,
                }}
              >
                This season&apos;s
                <br />
                forged icons
              </h2>
            </div>
            <a
              href="#shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: C.white,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${C.accent}`,
                paddingBottom: 4,
              }}
            >
              View all 24 styles <ArrowUpRight size={18} />
            </a>
          </div>
        </Reveal>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 'clamp(16px, 2vw, 28px)',
          }}
        >
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EDITORIAL SPLIT ROWS
   ════════════════════════════════════════════════════════════════════════════ */

interface StoryRow {
  img: string;
  index: string;
  title: string;
  body: string;
  reverse?: boolean;
}

const STORY_ROWS: StoryRow[] = [
  {
    img: IMG.story1,
    index: '01',
    title: 'Built in the workshop, not the boardroom',
    body: 'AirForge started in a Lyon garage with a heat press and an obsession. Every silhouette is prototyped by hand, stress-tested on real streets, and refined until it earns the name.',
  },
  {
    img: IMG.story2,
    index: '02',
    title: 'Materials that age with you',
    body: 'We source full-grain suede and recycled knits that develop character. Your pair will not look like anyone else’s after a year — that is the point.',
    reverse: true,
  },
];

function EditorialRows() {
  return (
    <section
      id="craft"
      style={{
        background: C.bgAlt,
        padding: 'clamp(80px, 12vh, 150px) clamp(20px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(80px, 12vh, 140px)' }}>
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
            <Eyebrow style={{ marginBottom: 18 }}>The Craft</Eyebrow>
            <h2
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.035em',
                textTransform: 'uppercase',
                color: C.white,
              }}
            >
              Obsession, forged
              <br /> into every pair
            </h2>
          </div>
        </Reveal>

        {STORY_ROWS.map((row) => (
          <div
            key={row.index}
            className="af-split-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(32px, 5vw, 80px)',
              alignItems: 'center',
            }}
          >
            <Reveal style={{ order: row.reverse ? 2 : 1 }}>
              <div style={{ overflow: 'hidden', aspectRatio: '4 / 5' }}>
                <img
                  src={row.img}
                  alt={row.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} style={{ order: row.reverse ? 1 : 2 }}>
              <div
                style={{
                  fontSize: 'clamp(3rem, 7vw, 6rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: `1.5px ${C.borderBright}`,
                  marginBottom: 18,
                }}
              >
                {row.index}
              </div>
              <h3
                style={{
                  margin: '0 0 20px',
                  fontWeight: 800,
                  fontSize: 'clamp(1.7rem, 3.2vw, 2.8rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: C.white,
                }}
              >
                {row.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: C.textMuted,
                  fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                  lineHeight: 1.65,
                  maxWidth: 480,
                }}
              >
                {row.body}
              </p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   STICKY-SIDE SPEC SHOWCASE
   ════════════════════════════════════════════════════════════════════════════ */

function SpecShowcase() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(60px, 9vh, 120px) clamp(20px, 5vw, 64px)',
      }}
    >
      <div
        className="af-spec-wrap"
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px, 5vw, 80px)',
          alignItems: 'flex-start',
        }}
      >
        {/* sticky image side */}
        <div
          className="af-spec-sticky"
          style={{
            position: 'sticky',
            top: 100,
            alignSelf: 'start',
          }}
        >
          <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3 / 4' }}>
            <img
              src={IMG.spec}
              alt="AirForge construction detail"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(0deg, rgba(10,10,11,0.6) 0%, transparent 45%)',
              }}
            />
            <div style={{ position: 'absolute', left: 24, bottom: 24 }}>
              <Eyebrow>Tech Spec</Eyebrow>
              <div
                style={{
                  marginTop: 10,
                  fontWeight: 900,
                  fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  color: C.white,
                }}
              >
                Forge Runner OG
              </div>
            </div>
          </div>
        </div>

        {/* scrolling specs */}
        <div style={{ paddingTop: 'clamp(0px, 4vh, 40px)' }}>
          <Reveal>
            <h2
              style={{
                margin: '0 0 clamp(32px, 6vh, 64px)',
                fontWeight: 900,
                fontSize: 'clamp(2rem, 4.5vw, 4rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.035em',
                textTransform: 'uppercase',
                color: C.white,
              }}
            >
              Engineered down
              <br /> to the stitch
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SPECS.map((s, i) => (
              <Reveal
                key={s.k}
                delay={i * 0.05}
                style={{
                  padding: 'clamp(28px, 5vh, 44px) 0',
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: C.accent,
                      letterSpacing: '0.1em',
                      paddingTop: 6,
                      minWidth: 30,
                    }}
                  >
                    {s.k}
                  </span>
                  <div>
                    <h3
                      style={{
                        margin: '0 0 12px',
                        fontWeight: 800,
                        fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)',
                        letterSpacing: '-0.02em',
                        color: C.white,
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: C.textMuted,
                        fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
                        lineHeight: 1.6,
                      }}
                    >
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LOOKBOOK / LIFESTYLE GALLERY
   ════════════════════════════════════════════════════════════════════════════ */

function Lookbook() {
  return (
    <section
      id="lookbook"
      style={{
        background: C.bgAlt,
        padding: 'clamp(80px, 12vh, 140px) clamp(20px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: 'clamp(40px, 6vh, 64px)' }}>
            <Eyebrow style={{ marginBottom: 18 }}>Lookbook · SS26</Eyebrow>
            <h2
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                textTransform: 'uppercase',
                color: C.white,
              }}
            >
              On the street
            </h2>
          </div>
        </Reveal>

        <div
          className="af-masonry"
          style={{
            columns: 3,
            columnGap: 'clamp(12px, 1.8vw, 22px)',
          }}
        >
          {LOOKBOOK.map((look, i) => (
            <Reveal
              key={i}
              delay={(i % 3) * 0.08}
              style={{
                breakInside: 'avoid',
                marginBottom: 'clamp(12px, 1.8vw, 22px)',
              }}
            >
              <div
                className="af-look-card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: look.tall ? '3 / 4.4' : '3 / 3.4',
                }}
              >
                <img
                  src={look.img}
                  alt={look.label}
                  loading="lazy"
                  className="af-look-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(0deg, rgba(10,10,11,0.7) 0%, transparent 50%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  }}
                  className="af-look-scrim"
                />
                <div
                  className="af-look-label"
                  style={{
                    position: 'absolute',
                    left: 18,
                    bottom: 18,
                    color: C.white,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    opacity: 0,
                    transform: 'translateY(8px)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                  }}
                >
                  {look.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   REVIEWS
   ════════════════════════════════════════════════════════════════════════════ */

function Reviews() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(80px, 12vh, 140px) clamp(20px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
              marginBottom: 'clamp(40px, 6vh, 64px)',
            }}
          >
            <div>
              <Eyebrow style={{ marginBottom: 18 }}>Worn &amp; rated</Eyebrow>
              <h2
                style={{
                  margin: 0,
                  fontWeight: 900,
                  fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  color: C.white,
                }}
              >
                4.9 / 5 from
                <br /> 12,400 forgers
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={26} fill={C.accent} color={C.accent} strokeWidth={0} />
              ))}
            </div>
          </div>
        </Reveal>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(16px, 2vw, 28px)',
          }}
        >
          {REVIEWS.map((r) => (
            <motion.div
              key={r.handle}
              variants={revealUp}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                padding: 'clamp(28px, 3vw, 40px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < r.stars ? C.accent : 'transparent'}
                    color={i < r.stars ? C.accent : C.textFaint}
                    strokeWidth={i < r.stars ? 0 : 1.5}
                  />
                ))}
              </div>
              <p
                style={{
                  margin: 0,
                  color: C.white,
                  fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                  lineHeight: 1.55,
                  fontWeight: 500,
                  flexGrow: 1,
                }}
              >
                &ldquo;{r.text}&rdquo;
              </p>
              <div>
                <div style={{ fontWeight: 700, color: C.white, fontSize: 15 }}>{r.name}</div>
                <div style={{ color: C.textFaint, fontSize: 13 }}>{r.handle}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   NEWSLETTER / FINAL CTA — full-bleed parallax photo
   ════════════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);

  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section
      id="shop"
      ref={ref}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: C.bg,
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: '-12% 0',
          y: imgY,
          scale: imgScale,
          willChange: 'transform',
        }}
      >
        <img
          src={IMG.cta}
          alt="AirForge lifestyle"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </motion.div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(10,10,11,0.9) 0%, rgba(10,10,11,0.55) 50%, rgba(10,10,11,0.3) 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1400,
          margin: '0 auto',
          padding: 'clamp(60px, 10vh, 120px) clamp(20px, 5vw, 64px)',
          width: '100%',
        }}
      >
        <Reveal>
          <Eyebrow style={{ marginBottom: 22 }}>Join the forge</Eyebrow>
          <h2
            style={{
              margin: '0 0 22px',
              fontWeight: 900,
              fontSize: 'clamp(2.6rem, 8vw, 7rem)',
              lineHeight: 0.86,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: C.white,
              maxWidth: '12ch',
            }}
          >
            Get the next drop first
          </h2>
          <p
            style={{
              margin: '0 0 36px',
              color: C.textMuted,
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              lineHeight: 1.55,
              maxWidth: 480,
            }}
          >
            Drops sell out in minutes. Members get a 24-hour early window, exclusive
            colorways, and free express shipping.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setDone(true);
            }}
            style={{
              display: 'flex',
              gap: 12,
              maxWidth: 520,
              flexWrap: 'wrap',
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              style={{
                flex: '1 1 240px',
                background: 'rgba(10,10,11,0.6)',
                border: `1px solid ${C.borderBright}`,
                color: C.white,
                padding: '17px 20px',
                fontSize: 15,
                outline: 'none',
                borderRadius: 2,
                fontFamily: FONT_STACK,
              }}
            />
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: done ? '#1b1b1f' : C.accent,
                color: done ? C.accent : '#0a0a0b',
                border: done ? `1px solid ${C.accent}` : 'none',
                padding: '17px 30px',
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 2,
                whiteSpace: 'nowrap',
              }}
            >
              {done ? (
                <>
                  <Check size={18} strokeWidth={3} /> You&apos;re in
                </>
              ) : (
                <>
                  Notify me <ArrowRight size={18} strokeWidth={2.4} />
                </>
              )}
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              gap: 28,
              marginTop: 40,
              flexWrap: 'wrap',
              color: C.textMuted,
              fontSize: 13,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Truck size={16} color={C.accent} /> Free express over €150
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color={C.accent} /> 30-day forge guarantee
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════════════════════ */

function ContactSection() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section
      id="contact"
      style={{
        background: C.bgAlt,
        borderTop: `1px solid ${C.border}`,
        padding: 'clamp(60px, 8vh, 96px) clamp(20px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow style={{ marginBottom: 16 }}>Get in touch</Eyebrow>
          <h2
            style={{
              margin: '0 0 24px',
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: C.white,
            }}
          >
            Contact us
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
            Have a question about our drops, sizing, or shipping? Drop us a line.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim() && msg.trim()) setDone(true);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email"
              style={{
                width: '100%',
                background: 'rgba(10,10,11,0.6)',
                border: `1px solid ${C.borderBright}`,
                color: C.white,
                padding: '16px 20px',
                fontSize: 15,
                outline: 'none',
                borderRadius: 2,
                fontFamily: FONT_STACK,
              }}
            />
            <textarea
              required
              rows={4}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Your message..."
              aria-label="Message"
              style={{
                width: '100%',
                background: 'rgba(10,10,11,0.6)',
                border: `1px solid ${C.borderBright}`,
                color: C.white,
                padding: '16px 20px',
                fontSize: 15,
                outline: 'none',
                borderRadius: 2,
                fontFamily: FONT_STACK,
                resize: 'vertical',
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                background: done ? '#1b1b1f' : C.accent,
                color: done ? C.accent : '#0a0a0b',
                border: done ? `1px solid ${C.accent}` : 'none',
                padding: '16px 30px',
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 2,
              }}
            >
              {done ? 'Sent' : 'Send Message'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const cols: { title: string; items: string[] }[] = [
    { title: 'Shop', items: ['New Drops', 'Runners', 'Mid Tops', 'Hi Tops', 'Sale'] },
    { title: 'Brand', items: ['Our Story', 'The Forge', 'Sustainability', 'Press'] },
    { title: 'Support', items: ['Shipping', 'Returns', 'Size Guide', 'Contact'] },
  ];

  const getAnchor = (item: string) => {
    const normalized = item.toLowerCase();
    if (normalized === 'contact' || normalized.includes('shipping') || normalized.includes('returns') || normalized.includes('size')) {
      return '#contact';
    }
    if (normalized === 'new drops' || normalized === 'runners') {
      return '#drops';
    }
    if (normalized.includes('top') || normalized === 'sale') {
      return '#shop';
    }
    if (normalized.includes('story') || normalized.includes('forge') || normalized.includes('sustain') || normalized.includes('press')) {
      return '#lookbook';
    }
    return '#contact';
  };

  return (
    <footer
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        padding: 'clamp(60px, 8vh, 96px) clamp(20px, 5vw, 64px) 40px',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div
          className="af-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr repeat(3, 1fr)',
            gap: 'clamp(32px, 4vw, 60px)',
            paddingBottom: 'clamp(40px, 6vh, 72px)',
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 28,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: C.white,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 18,
              }}
            >
              <Zap size={24} color={C.accent} fill={C.accent} strokeWidth={1} />
              AirForge
            </div>
            <p style={{ margin: '0 0 24px', color: C.textMuted, fontSize: 15, lineHeight: 1.6, maxWidth: 320 }}>
              Performance sneakers forged in Lyon. Limited runs, built to outlast
              the hype.
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              {[Camera, AtSign, PlayCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#contact"
                  aria-label="social"
                  style={{
                    width: 42,
                    height: 42,
                    border: `1px solid ${C.border}`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: C.white,
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.accent;
                    e.currentTarget.style.color = C.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.color = C.white;
                  }}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  margin: '0 0 18px',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: C.textFaint,
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href={getAnchor(item)}
                      style={{
                        color: C.textMuted,
                        textDecoration: 'none',
                        fontSize: 14,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 28,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            color: C.textFaint,
            fontSize: 13,
          }}
        >
          <span>© 2026 AirForge. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#contact" style={{ color: C.textFaint, textDecoration: 'none' }}>
              Privacy
            </a>
            <a href="#contact" style={{ color: C.textFaint, textDecoration: 'none' }}>
              Terms
            </a>
            <a href="#contact" style={{ color: C.textFaint, textDecoration: 'none' }}>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */

export default function ImpactSneakerPage() {
  const [cart, setCart] = useState(0);

  return (
    <main
      suppressHydrationWarning
      style={{
        background: C.bg,
        color: C.white,
        fontFamily: FONT_STACK,
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
      }}
    >
      {/* Scoped responsive + hover styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .af-look-card:hover .af-look-img { transform: scale(1.07); }
        .af-look-card:hover .af-look-scrim { opacity: 1; }
        .af-look-card:hover .af-look-label { opacity: 1; transform: translateY(0); }

        @media (max-width: 900px) {
          .af-nav-links { display: none !important; }
          .af-split-row { grid-template-columns: 1fr !important; }
          .af-split-row > * { order: unset !important; }
          .af-spec-wrap { grid-template-columns: 1fr !important; }
          .af-spec-sticky { position: relative !important; top: 0 !important; }
          .af-masonry { columns: 2 !important; }
          .af-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .af-masonry { columns: 1 !important; }
          .af-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav cartCount={cart} />
      <Hero />
      <Marquee />
      <CrossfadeSequence />
      <FeaturedDrops onAdd={() => setCart((c) => c + 1)} />
      <EditorialRows />
      <SpecShowcase />
      <Lookbook />
      <Reviews />
      <FinalCTA />
      <ContactSection />
      <Footer />
    </main>
  );
}
