'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
  useMotionValue,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Quote,
  Scale,
  MapPin,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   MOREAU DELACROIX AVOCATS — Cabinet d'avocats · Paris 16e
   Photographie réelle + chorégraphie de défilement éditoriale (style
   juridique premium × élégance chapitrée). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f9f6f0',
  bgAlt: '#f0ebe0',
  bgDark: '#0f0c08',
  bgDarkAlt: '#1a1510',
  bgCard: '#ffffff',
  accent: '#c4943a',
  accentDark: '#a37a2e',
  accentLight: '#f5e6c8',
  white: '#ffffff',
  ink: '#0f0c08',
  textMuted: '#6b5e42',
  textFaint: '#a0917a',
  border: '#ddd0b8',
  borderDark: 'rgba(196,148,58,0.28)',
} as const;

const SERIF = "Georgia, 'Times New Roman', Cambria, serif" as const;
const SANS =
  "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photographie (URLs Unsplash pré-vérifiées) ──────────────────────────── */
const PHOTO = {
  courthouse:
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2000&auto=format&fit=crop',
  courthouseWide:
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1600&auto=format&fit=crop',
  courthouseSm:
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
  library:
    'https://images.unsplash.com/photo-1521587760698-8c06e6f9ebce?q=80&w=1600&auto=format&fit=crop',
  librarySm:
    'https://images.unsplash.com/photo-1521587760698-8c06e6f9ebce?q=80&w=800&auto=format&fit=crop',
  handshake:
    'https://images.unsplash.com/photo-1575505586569-646b2ca898af?q=80&w=1600&auto=format&fit=crop',
  stickyPanel:
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=900&auto=format&fit=crop',
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Types de données
   ════════════════════════════════════════════════════════════════════════════ */
type Domain = {
  numeral: string;
  title: string;
  tag: string;
};

type Case = {
  numeral: string;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  img: string;
  alt: string;
};

type Review = {
  quote: string;
  author: string;
  role: string;
};

type Spec = {
  numeral: string;
  label: string;
  description: string;
};

type EditRow = {
  numeral: string;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  img: string;
  alt: string;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

/* ── Données ─────────────────────────────────────────────────────────────── */

const PRACTICE_PHASES: { img: string; alt: string; numeral: string; caption: string; sub: string }[] = [
  {
    img: PHOTO.courthouse,
    alt: "Colonnes d'un palais de justice",
    numeral: 'I',
    caption: 'DROIT DES AFFAIRES',
    sub: "Fusions-acquisitions, contrats commerciaux, contentieux d'entreprise — nous protégeons votre patrimoine et vos intérêts.",
  },
  {
    img: PHOTO.library,
    alt: 'Bibliothèque juridique de référence',
    numeral: 'II',
    caption: 'DROIT DE LA FAMILLE',
    sub: 'Divorce, garde, succession, adoption — accompagnement humain dans les moments qui comptent.',
  },
  {
    img: PHOTO.handshake,
    alt: "Signature d'un contrat immobilier",
    numeral: 'III',
    caption: 'DROIT IMMOBILIER',
    sub: 'Transactions, baux, copropriété, litiges — expertise foncière et immobilière depuis 1998.',
  },
];

const DOMAINS: Domain[] = [
  { numeral: 'I', title: 'Droit des affaires', tag: 'Corporate' },
  { numeral: 'II', title: 'Droit de la famille', tag: 'Famille' },
  { numeral: 'III', title: 'Droit pénal', tag: 'Pénal' },
  { numeral: 'IV', title: 'Droit immobilier', tag: 'Immobilier' },
  { numeral: 'V', title: 'Droit du travail', tag: 'Social' },
  { numeral: 'VI', title: 'Droit international', tag: 'International' },
];

const EDIT_ROWS: EditRow[] = [
  {
    numeral: 'I',
    eyebrow: 'Notre histoire',
    title: (
      <>
        Fondé en 1998,{' '}
        <span style={{ fontStyle: 'italic' }}>construit sur la confiance.</span>
      </>
    ),
    body: 'Depuis plus de vingt-cinq ans, Moreau Delacroix Avocats représente ses clients devant les juridictions parisiennes et nationales. Composé de trois associés issus des meilleures formations juridiques françaises, le cabinet a bâti sa réputation sur une exigence absolue : la qualité du conseil avant la quantité des dossiers.',
    img: PHOTO.courthouseSm,
    alt: 'Façade du Palais de justice de Paris',
  },
  {
    numeral: 'II',
    eyebrow: 'Notre méthode',
    title: (
      <>
        L&apos;écoute avant{' '}
        <span style={{ fontStyle: 'italic' }}>la stratégie.</span>
      </>
    ),
    body: 'Avant de concevoir la stratégie juridique, nous prenons le temps de comprendre la situation dans sa globalité : les enjeux humains, financiers et relationnels. Cette écoute active nous permet d&apos;élaborer des solutions sur mesure, combinant rigueur technique et approche pragmatique, dans l&apos;intérêt exclusif de nos clients.',
    img: PHOTO.librarySm,
    alt: 'Bibliothèque de droit du cabinet',
  },
];

const EXPERTISE_ITEMS: Spec[] = [
  {
    numeral: 'I',
    label: 'Analyse et conseil juridique préventif',
    description:
      'Avant tout litige, nous sécurisons vos actes et vos décisions. Notre veille juridique permanente vous protège en amont des contentieux.',
  },
  {
    numeral: 'II',
    label: 'Rédaction et négociation de contrats',
    description:
      "Chaque contrat porte la marque d'une rédaction millimétrée. Nous négocions vos termes avec la rigueur d'un praticien et la vision d'un stratège.",
  },
  {
    numeral: 'III',
    label: 'Représentation judiciaire et arbitrale',
    description:
      'Devant les tribunaux comme devant les instances arbitrales, nous défendons vos droits avec une plaidoirie préparée et argumentée au plus haut niveau.',
  },
  {
    numeral: 'IV',
    label: 'Accompagnement stratégique continu',
    description:
      'Au-delà du dossier ponctuel, nous devenons votre partenaire juridique de long terme — disponibles, réactifs, impliqués dans la durée de votre projet.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Notre entreprise traversait une fusion complexe qui menaçait de tourner au contentieux. L'équipe de Moreau Delacroix a pris en charge l'ensemble du dossier avec une maîtrise et une réactivité qui m'ont profondément impressionné. Grâce à leur intervention, nous avons conclu l'opération dans des conditions bien supérieures à ce que nous espérions. Je leur fais confiance les yeux fermés.",
    name: 'Alexandre Fontaine',
    role: 'PDG · Groupe Fontaine Industries',
  },
  {
    quote:
      "Mon divorce impliquait plusieurs nationalités et un patrimoine international : une situation que peu d'avocats acceptent de traiter. Moreau Delacroix l'a fait avec une humanité rare, sans jamais perdre de vue la technicité juridique requise. Ils ont su protéger mes enfants et mes intérêts tout en préservant autant que possible le dialogue. Une équipe d'exception.",
    name: 'Sophie Marchand-Leclercq',
    role: 'Cliente · Droit de la famille international',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet doré. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
}) {
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 46,
    height: 1,
    background: color,
    opacity: 0.7,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.42em',
    textTransform: 'uppercase',
    color,
    fontWeight: 500,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' ? <span style={rule} /> : null}
    </div>
  );
}

/** Révélation au scroll : fondu + translation verticale, une seule fois. */
function Reveal({
  children,
  delay = 0,
  y = 38,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton doré, contour fin, flèche qui glisse au survol. */
function GoldButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  dark = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  dark?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.ink : dark ? C.accent : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(196,148,58,0.10)', transform: 'translateY(-2px)' }
    : {};
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...hov }}
    >
      {children}
      <ArrowRight
        size={15}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/** Image avec léger drift parallaxe interne. */
function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '116%', objectFit: 'cover', y }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Nav : transparente → solide au défilement
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Le Cabinet', href: '#cabinet' },
    { label: 'Domaines', href: '#domaines' },
    { label: 'Notre approche', href: '#approche' },
    { label: 'Contact', href: '#contact' },
  ];

  const bar: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: solid
      ? '16px clamp(20px,5vw,64px)'
      : '26px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(15,12,8,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(196,148,58,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 21,
    letterSpacing: '0.06em',
    color: C.white,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,38px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
        <Scale size={20} color={C.accent} strokeWidth={1.4} />
        Moreau Delacroix
      </a>
      <div style={linkRow} className="mda-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="mda-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <GoldButton filled>Prendre contact</GoldButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mda-burger"
          aria-label="Menu"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <span style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(0, 7px)' : 'none' }} />
          <span style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1, display: 'block', opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <span style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(0, -7px)' : 'none' }} />
        </button>
        <style>{`
        @media (max-width: 900px){
          .mda-navlinks{ display:none !important; }
          .mda-burger { display: flex !important; flex-direction: column; }
          .mda-navcta{ display:none !important; }
        }
      `}</style>
    </nav>
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 58,
          left: 0,
          right: 0,
          zIndex: 98,
          background: 'rgba(10,10,10,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '20px clamp(20px,5vw,48px) 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 15,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: 0.85,
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SANS,
        fontSize: 11.5,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: h ? C.accent : C.white,
        textDecoration: 'none',
        transition: 'color .4s',
        position: 'relative',
        paddingBottom: 4,
      }}
    >
      {label}
      <span
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 1,
          width: h ? '100%' : '0%',
          background: C.accent,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO — parallaxe plein cadre
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-46%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={section} id="hero">
      {/* Photo plein cadre */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-8% 0 0 0',
          height: '116%',
          scale: imgScale,
          y: imgY,
        }}
      >
        <img
          src={PHOTO.courthouse}
          alt="Façade néoclassique d'un palais de justice"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile bas lourd + radial */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(15,12,8,0.45) 0%, rgba(15,12,8,0.08) 36%, rgba(15,12,8,0.42) 68%, rgba(15,12,8,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 80% 30%, transparent 40%, rgba(15,12,8,0.52) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Texte bas-gauche parallaxe */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding:
            'clamp(32px,6vw,88px) clamp(24px,6vw,96px) clamp(56px,8vw,110px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
        >
          <Eyebrow color={C.accentLight}>
            Cabinet d&apos;avocats · Paris · Depuis 1998
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.18 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,8vw,9rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: '28px 0 26px',
            textShadow: '0 14px 70px rgba(0,0,0,0.55)',
            maxWidth: 820,
          }}
        >
          Le droit
          <br />à votre
          <br />service
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.48 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(15px,1.8vw,21px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 540,
            lineHeight: 1.64,
            marginBottom: 42,
          }}
        >
          Un cabinet parisien fondé sur l&apos;exigence, l&apos;écoute et
          vingt-cinq ans d&apos;engagement au service de nos clients.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <GoldButton filled>Prendre contact</GoldButton>
          <GoldButton>Nos domaines</GoldButton>
        </motion.div>
      </motion.div>

      {/* Indicateur de défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 34,
          right: 'clamp(24px,6vw,96px)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.66)',
            writingMode: 'vertical-rl',
            marginBottom: 8,
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.accentLight} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · Manifeste — citation centrée
   ════════════════════════════════════════════════════════════════════════════ */
function Manifesto() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    color: C.ink,
    padding: 'clamp(96px, 14vw, 200px) clamp(24px, 8vw, 160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="cabinet">
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 34 }}>
          <Eyebrow color={C.textMuted} align="center">
            Notre philosophie
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px, 3.2vw, 46px)',
            lineHeight: 1.38,
            fontWeight: 400,
            maxWidth: 900,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Le droit n&apos;est pas une fin en soi — c&apos;est l&apos;instrument
          par lequel{' '}
          <span style={{ fontStyle: 'italic', color: C.accentDark }}>
            la justice devient possible
          </span>
          . Nous pratiquons le droit comme un art : avec rigueur, nuance et une
          conviction inébranlable que chaque client mérite une défense à la
          hauteur de ses enjeux.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 90,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '56px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · PracticeSequence — crossfade collant 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function PracticeImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: (typeof PRACTICE_PHASES)[0];
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeIn = seg * 0.28;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - fadeIn), start, end - fadeIn, Math.min(1, end)],
    i === 0
      ? [1, 1, 1, 0]
      : i === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeIn, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={phase.img}
        alt={phase.alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          scale,
        }}
      />
    </motion.div>
  );
}

function PracticeCaption({
  phase,
  i,
  total,
  progress,
}: {
  phase: (typeof PRACTICE_PHASES)[0];
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.22;

  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    i === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [30, -30]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 clamp(24px,6vw,96px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(56px,10vw,140px)',
          color: 'rgba(196,148,58,0.28)',
          lineHeight: 1,
          marginBottom: 6,
          display: 'block',
        }}
      >
        {phase.numeral}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(28px,5.5vw,76px)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 1,
          margin: '0 0 22px',
          letterSpacing: '0.08em',
          textShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}
      >
        {phase.caption}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px, 1.7vw, 21px)',
          color: 'rgba(255,255,255,0.84)',
          maxWidth: 520,
          lineHeight: 1.68,
        }}
      >
        {phase.sub}
      </p>
    </motion.div>
  );
}

function ProgressDot({
  i,
  total,
  progress,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const opacity = useTransform(
    progress,
    [i * seg, i * seg + 0.02, (i + 1) * seg - 0.02, (i + 1) * seg],
    [0.3, 1, 1, 0.3],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 34]);
  return (
    <motion.div style={{ height: 2, width, background: C.accent, opacity }} />
  );
}

function PracticeSequence() {
  const n = PRACTICE_PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {PRACTICE_PHASES.map((p, i) => (
          <PracticeImage
            key={p.numeral}
            phase={p}
            i={i}
            total={PRACTICE_PHASES.length}
            progress={progress}
          />
        ))}
        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(15,12,8,0.32), rgba(15,12,8,0.08) 40%, rgba(15,12,8,0.60))',
          }}
        />
        {PRACTICE_PHASES.map((p, i) => (
          <PracticeCaption
            key={p.numeral}
            phase={p}
            i={i}
            total={PRACTICE_PHASES.length}
            progress={progress}
          />
        ))}

        {/* Indicateur de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 42,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
          }}
        >
          {PRACTICE_PHASES.map((p, i) => (
            <ProgressDot
              key={p.numeral}
              i={i}
              total={PRACTICE_PHASES.length}
              progress={progress}
            />
          ))}
        {/* Carousel navigation */}
        <button
          onClick={() => goTo((active - 1 + n) % n)}
          aria-label="Slide précédent"
          style={{ position: 'absolute', left: 'clamp(16px,3vw,36px)', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
        >&#8249;</button>
        <button
          onClick={() => goTo((active + 1) % n)}
          aria-label="Slide suivant"
          style={{ position: 'absolute', right: 'clamp(16px,3vw,36px)', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
        >&#8250;</button>
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
          {Array.from({ length: n }, (_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} style={{ width: 8, height: 8, borderRadius: '50%', background: active === i ? '#fff' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', padding: 0, transition: 'background 0.3s' }} />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · DomainCards — 6 cartes domaines d'intervention
   ════════════════════════════════════════════════════════════════════════════ */
function DomainCard({ d, i }: { d: Domain; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    padding: 'clamp(28px,3.5vw,44px)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 32px 72px -28px rgba(15,12,8,0.22)'
      : '0 8px 24px -16px rgba(15,12,8,0.10)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  };
  return (
    <Reveal delay={i * 0.08}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: C.accent,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 24,
              height: 1,
              background: C.accent,
              display: 'inline-block',
            }}
          />
          {d.tag}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(48px,5vw,72px)',
            color: hover ? C.accent : 'rgba(196,148,58,0.20)',
            lineHeight: 1,
            transition: 'color .5s cubic-bezier(.16,1,.3,1)',
          }}
        >
          {d.numeral}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2.2vw,28px)',
            fontWeight: 400,
            color: C.ink,
            margin: 0,
            lineHeight: 1.22,
          }}
        >
          {d.title}
        </h3>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: hover ? C.accent : C.textFaint,
            marginTop: 6,
            transition: 'color .5s cubic-bezier(.16,1,.3,1)',
          }}
        >
          En savoir plus
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(5px)' : 'none',
              transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
      </article>
    </Reveal>
  );
}

function DomainCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(96px, 13vw, 180px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(16px, 2vw, 28px)',
    maxWidth: 1260,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="domaines">
      <div style={{ maxWidth: 1260, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow color={C.textMuted}>Domaines d&apos;intervention</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5.5vw, 72px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.05,
            }}
          >
            Six piliers d&apos;{' '}
            <span style={{ fontStyle: 'italic', color: C.accentDark }}>
              expertise
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {DOMAINS.map((d, i) => (
          <DomainCard key={d.numeral} d={d} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · EditorialRows — lignes alternées image / texte
   ════════════════════════════════════════════════════════════════════════════ */
function EditRow({ row, reverse }: { row: EditRow; reverse: boolean }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px, 6vw, 90px)',
    alignItems: 'center',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: reverse ? 2 : 1,
    aspectRatio: '5 / 6',
  };
  const txt: React.CSSProperties = { order: reverse ? 1 : 2 };

  return (
    <div style={wrap} className="mda-editrow">
      <Reveal y={50} style={imgWrap}>
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>
      <div style={txt}>
        {/* Ghost roman numeral */}
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(64px,8vw,110px)',
            color: 'rgba(196,148,58,0.14)',
            lineHeight: 1,
            marginBottom: -12,
            userSelect: 'none',
          }}
        >
          {row.numeral}
        </div>
        <Reveal>
          <Eyebrow color={C.textMuted}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 56px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 24px',
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              lineHeight: 1.82,
              color: C.textMuted,
              maxWidth: 470,
              margin: 0,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 900px){
          .mda-editrow{ grid-template-columns: 1fr !important; }
          .mda-editrow > *{ order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px, 11vw, 160px) clamp(24px, 6vw, 96px)',
  };
  return (
    <section style={sec} id="approche">
      <div
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px, 11vw, 150px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditRow key={r.eyebrow} row={r} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · ExpertisePanel — image collante + items défilants
   ════════════════════════════════════════════════════════════════════════════ */
function ExpertisePanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px, 11vw, 150px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px, 6vw, 96px)',
    maxWidth: 1260,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickySide: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec}>
      <div style={grid} className="mda-expanel">
        {/* Image collante gauche */}
        <div style={stickySide} className="mda-expanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={PHOTO.stickyPanel}
              alt="Le cabinet Moreau Delacroix Avocats"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 8,
              }}
            >
              Moreau Delacroix · Paris 16e
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.6,
              }}
            >
              « L&apos;excellence juridique au service de l&apos;humain. »
            </div>
          </div>
        </div>

        {/* Items défilants droite */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Notre approche</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(30px, 4.5vw, 62px)',
                fontWeight: 400,
                color: C.white,
                margin: '20px 0 54px',
                lineHeight: 1.06,
              }}
            >
              Ce que nous{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                faisons
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {EXPERTISE_ITEMS.map((item, i) => (
              <Reveal key={item.numeral} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,40px) 0',
                    borderTop: `1px solid rgba(196,148,58,0.28)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 22,
                      color: 'rgba(196,148,58,0.55)',
                      minWidth: 36,
                    }}
                  >
                    {item.numeral}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(18px,2vw,24px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {item.label}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 15.5,
                        lineHeight: 1.72,
                        color: 'rgba(255,255,255,0.62)',
                        margin: 0,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px){
          .mda-expanel{ grid-template-columns: 1fr !important; }
          .mda-expanel-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · Testimonials — deux grandes cartes premium
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,4vw,56px)',
    maxWidth: 1260,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div
        style={{
          maxWidth: 1260,
          margin: '0 auto 62px',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Témoignages
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,66px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            La parole de nos{' '}
            <span style={{ fontStyle: 'italic', color: C.accentDark }}>
              clients
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                padding: 'clamp(36px,4.5vw,56px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 24px 64px -40px rgba(15,12,8,0.22)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Quote
                size={36}
                color={C.accent}
                strokeWidth={1.2}
                style={{ marginBottom: 28 }}
              />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.9vw,22px)',
                  lineHeight: 1.68,
                  color: C.ink,
                  margin: '0 0 32px',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 22,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 20,
                    color: C.ink,
                    marginBottom: 6,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: C.textFaint,
                  }}
                >
                  {t.role}
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · ContactForm — champs soulignés, fond sombre, confirmation animée
   ════════════════════════════════════════════════════════════════════════════ */
function ContactForm() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [domaine, setDomaine] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email) return;
    setSent(true);
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(196,148,58,0.4)',
    padding: '16px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.white,
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 6,
  };

  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <section style={sec} id="contact">
      {/* Texture fond subtile */}
      <img
        src={PHOTO.courthouse}
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.07,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.accentLight} align="center">
            Nous contacter
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,6vw,76px)',
              fontWeight: 400,
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.05,
            }}
          >
            Prenez{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              rendez-vous
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.7vw,19px)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.76)',
              maxWidth: 540,
              margin: '0 auto 52px',
            }}
          >
            Décrivez-nous votre situation. Un avocat du cabinet vous rappellera
            sous 24h pour un premier échange confidentiel et sans engagement.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(38px,5vw,58px)',
                background: 'rgba(196,148,58,0.06)',
                textAlign: 'center',
              }}
            >
              <Scale
                size={36}
                color={C.accentLight}
                strokeWidth={1.2}
                style={{ marginBottom: 20 }}
              />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(26px,3vw,36px)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom}, nous revenons vers vous sous 24h.
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.72)',
                  margin: 0,
                }}
              >
                Votre demande a bien été transmise à l&apos;équipe de Moreau
                Delacroix Avocats. Un avocat prendra contact avec vous à{' '}
                <span style={{ color: C.accentLight }}>{email}</span>.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <form
              onSubmit={onSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 34,
                textAlign: 'left',
              }}
            >
              {/* Ligne Prénom + Nom */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 28,
                }}
                className="mda-formrow"
              >
                <div>
                  <label style={labelStyle} htmlFor="mda-prenom">
                    Prénom
                  </label>
                  <input
                    id="mda-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Sophie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="mda-nom">
                    Nom
                  </label>
                  <input
                    id="mda-nom"
                    style={fieldBase}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="mda-email">
                  Adresse e-mail
                </label>
                <input
                  id="mda-email"
                  type="email"
                  style={fieldBase}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sophie@exemple.fr"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="mda-telephone">
                  Téléphone
                </label>
                <input
                  id="mda-telephone"
                  type="tel"
                  style={fieldBase}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Domaine */}
              <div>
                <label style={labelStyle} htmlFor="mda-domaine">
                  Domaine juridique
                </label>
                <select
                  id="mda-domaine"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: domaine ? C.white : 'rgba(255,255,255,0.40)',
                  }}
                  value={domaine}
                  onChange={(e) => setDomaine(e.target.value)}
                >
                  <option value="" style={{ color: '#111' }}>
                    Choisir un domaine…
                  </option>
                  <option value="Droit des affaires" style={{ color: '#111' }}>
                    Droit des affaires
                  </option>
                  <option value="Droit de la famille" style={{ color: '#111' }}>
                    Droit de la famille
                  </option>
                  <option value="Droit pénal" style={{ color: '#111' }}>
                    Droit pénal
                  </option>
                  <option value="Droit immobilier" style={{ color: '#111' }}>
                    Droit immobilier
                  </option>
                  <option value="Droit du travail" style={{ color: '#111' }}>
                    Droit du travail
                  </option>
                  <option value="Autre" style={{ color: '#111' }}>
                    Autre
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="mda-message">
                  Votre message
                </label>
                <textarea
                  id="mda-message"
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 110,
                    fontFamily: SERIF,
                    lineHeight: 1.7,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez brièvement votre situation juridique…"
                  rows={4}
                />
              </div>

              {/* Submit */}
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <GoldButton filled type="submit">
                  Envoyer ma demande
                </GoldButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 900px){
          .mda-formrow{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · Footer — 4 colonnes, fond sombre alternatif
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Domaines',
      items: [
        { label: 'Droit des affaires', href: '#domaines' },
        { label: 'Droit de la famille', href: '#domaines' },
        { label: 'Droit pénal', href: '#domaines' },
        { label: 'Droit immobilier', href: '#domaines' },
        { label: 'Droit du travail', href: '#domaines' },
      ],
    },
    {
      title: 'Le Cabinet',
      items: [
        { label: 'Notre histoire', href: '#cabinet' },
        { label: 'Notre méthode', href: '#approche' },
        { label: "L\u2019\u00e9quipe", href: '#cabinet' },
        { label: 'Publications', href: '#cabinet' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Prendre rendez-vous', href: '#contact' },
        { label: 'Paris 16e', href: '#contact' },
        { label: '+33 1 45 00 00 00', href: 'tel:+33145000000' },
        { label: 'contact@mda-avocats.fr', href: 'mailto:contact@mda-avocats.fr' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: '1px solid rgba(196,148,58,0.18)',
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,70px)',
        }}
        className="mda-footgrid"
      >
        {/* Colonne marque */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              color: C.white,
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <Scale size={22} color={C.accent} strokeWidth={1.4} />
            Moreau Delacroix
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.58)',
              maxWidth: 320,
              margin: '0 0 22px',
            }}
          >
            Cabinet d&apos;avocats fondé à Paris en 1998. Trois associés,
            une exigence : le droit au service de vos intérêts.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.48)',
            }}
          >
            <MapPin size={14} color={C.accent} strokeWidth={1.5} />
            Paris 16e · Barreau de Paris
          </div>
        </div>

        {/* Trois colonnes de liens */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 22,
                fontWeight: 600,
              }}
            >
              {c.title}
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {c.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 16,
                      color: 'rgba(255,255,255,0.68)',
                      textDecoration: 'none',
                      transition: 'color .35s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        'rgba(255,255,255,0.68)')
                    }
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Barre du bas */}
      <div
        style={{
          maxWidth: 1260,
          margin: '64px auto 0',
          paddingTop: 28,
          borderTop: '1px solid rgba(196,148,58,0.14)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.40)',
        }}
      >
        <span>
          © 1998–2026 Moreau Delacroix Avocats. Tous droits réservés.
        </span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a
            href="#cabinet"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Mentions légales
          </a>
          <a
            href="#cabinet"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Confidentialité
          </a>
          <a
            href="#cabinet"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Barreau de Paris
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 900px){
          .mda-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px){
          .mda-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — composition finale
   ════════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const root: React.CSSProperties = {
    background: C.bgDark,
    color: C.ink,
    fontFamily: SERIF,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
  };
  return (
    <main style={root} suppressHydrationWarning>
      <Nav />
      <Hero />
      <Manifesto />
      <PracticeSequence />
      <DomainCards />
      <EditorialRows />
      <ExpertisePanel />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
}
