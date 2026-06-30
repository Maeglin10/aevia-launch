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
import { ArrowRight, ChevronDown, Leaf, MapPin, Send } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   JARDINS VIVANTS — Paysagiste-Concepteur & Permaculture · Bordeaux
   Chorégraphie de défilement éditoriale : crossfade collant 320vh, panneau
   écologique sticky, formulaire de devis interactif. Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Work+Sans:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f2f5ee',
  bgAlt: '#e4eade',
  bgDark: '#0c1a08',
  bgDarkAlt: '#080f04',
  bgCard: '#ffffff',
  accent: '#386c2e',
  accentDark: '#28501e',
  accentLight: '#c4dcbc',
  white: '#ffffff',
  ink: '#0c1a08',
  textMuted: '#243820',
  textFaint: '#6a8860',
  border: '#bcd4b4',
  borderDark: 'rgba(56,108,46,0.2)',
  earth: '#7a5c38',
} as const;

const SERIF = "'Cormorant Garamond', Georgia, serif" as const;
const SANS = "'Work Sans', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces de données typées
   ════════════════════════════════════════════════════════════════════════════ */

interface Project {
  id: string;
  src: string;
  index: string;
  title: string;
  sub: string;
}

interface Service {
  icon: string;
  title: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface EcoItem {
  num: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Données
   ════════════════════════════════════════════════════════════════════════════ */

const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    src: 'https://images.unsplash.com/photo-1558618047-b62e0e6e8517?q=80&w=1600&auto=format&fit=crop',
    index: 'I',
    title: 'JARDINS PRIVATIFS',
    sub: 'Du plan 3D à la dernière pierre — jardins contemporains, anglais ou méditerranéens selon votre vision et votre sol.',
  },
  {
    id: 'proj-2',
    src: 'https://images.unsplash.com/photo-1416879347-58da7a5ecbb7?q=80&w=1600&auto=format&fit=crop',
    index: 'II',
    title: 'POTAGER & PERMACULTURE',
    sub: 'Buttes de culture, association de plantes, compost intégré — produire chez soi intelligemment et durablement.',
  },
  {
    id: 'proj-3',
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop',
    index: 'III',
    title: 'ESPACES PROS & COLLECTIFS',
    sub: "Cours d\'immeuble, jardins de copropriété, espaces verts d\'entreprise — le végétal au cœur de votre image.",
  },
];

const SERVICES: Service[] = [
  { icon: '⬡', title: 'Conception 3D', desc: 'Plans en perspective, rendu photoréaliste et visite virtuelle avant la première pelletée de terre.' },
  { icon: '⬡', title: 'Jardin naturel', desc: "Jardins en harmonie avec l\'écosystème local, plantations mellifères, zéro pesticide de synthèse." },
  { icon: '⬡', title: 'Potager biologique', desc: 'Buttes lasagne, association de cultures, bâches de paillage biodégradables, autonomie alimentaire.' },
  { icon: '⬡', title: 'Terrasse végétalisée', desc: "Dalles sur plots, pergolas végétales, mobilier sur mesure — l\'extérieur comme une pièce de vie." },
  { icon: '⬡', title: 'Entretien annuel', desc: "Contrats d\'entretien personnalisés : taille raisonnée, fertilisation organique, bilan saisonnier." },
  { icon: '⬡', title: "Jardins d\'eau", desc: 'Mares écologiques, bassins naturels, noues et rigoles de phytoépuration adaptés à votre terrain.' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre démarche',
    imgId: '1558618047-b62e0e6e8517?w=800',
    title: (
      <>
        Le sol /{' '}
        <em>d&apos;abord.</em>
      </>
    ),
    body: 'Chaque projet commence par une analyse pédologique complète — pH, texture, vie microbienne, drainage. Avant de planter quoi que ce soit, nous signons une charte zéro pesticide de synthèse et priorisons systématiquement les plantes indigènes adaptées au terroir bordelais, pour des jardins autonomes et résistants.',
    reverse: false,
  },
  {
    eyebrow: 'Bordeaux & Gironde',
    imgId: '1416879347-58da7a5ecbb7?w=800',
    title: (
      <>
        Racines /{' '}
        <em>dans le Bordelais.</em>
      </>
    ),
    body: "Dix-huit ans d\'expertise locale, une maîtrise intime du climat atlantique et de ses caprices. Nous intervenons en Gironde, Dordogne et Lot-et-Garonne — des coteaux calcaires aux plaines alluviales. Chaque essence choisie est testée pour sa résistance aux hivers humides et aux étés de plus en plus secs.",
    reverse: true,
  },
];

const ECO_ITEMS: EcoItem[] = [
  {
    num: 'I',
    title: 'Sol vivant',
    body: "Apports de compost, semis d\'engrais verts, microbiorisation des sols. Jamais d\'herbicide, jamais de désherbant thermique systématique. Le sol se régénère et travaille pour vous.",
  },
  {
    num: 'II',
    title: 'Eau économisée',
    body: "Récupération pluviale, paillage épais pour limiter l\'évaporation, irrigation au goutte-à-goutte programmée. Un jardin bien conçu consomme jusqu\'à 60 % d\'eau en moins.",
  },
  {
    num: 'III',
    title: 'Biodiversité intégrée',
    body: "Haies mellifères multi-strates, mares et points d\'eau, abris à hérissons et à insectes. Votre jardin devient un maillon vivant dans le corridor écologique local.",
  },
  {
    num: 'IV',
    title: 'Garantie reprise 2 ans',
    body: "Toutes nos plantations sont garanties deux ans. Si une essence ne reprend pas, nous la remplaçons sans supplément. Parce que nous choisissons des variétés locales et adaptées, les reprises sont l\'exception.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Nous avions une cour bétonnée sans âme. Aujourd\'hui c\'est une forêt comestible de 80 m². Dès le quatrième mois, nous récoltions herbes aromatiques, fraises et courgettes. L\'équipe de Jardins Vivants a transformé notre regard sur notre extérieur.",
    name: 'Laure & Pierre Moreau',
    role: 'Propriétaires · Bordeaux Caudéran',
  },
  {
    quote:
      "Nous avons confié la refonte du jardin d\'entrée de notre propriété viticole à Jardins Vivants. Le résultat est saisissant : les visiteurs photographient désormais le jardin avant même le château. L\'investissement s\'est rentabilisé en une saison touristique.",
    name: 'Antoine de Larroque',
    role: 'Propriétaire · Château viticole, Saint-Émilion',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet vert. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
  dark = false,
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}) {
  void dark;
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
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.38em',
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
  y = 36,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
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

/** Bouton vert, hover lift. */
function GreenButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 11,
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    opacity: disabled ? 0.5 : 1,
  };
  const hov: React.CSSProperties =
    hover && !disabled
      ? filled
        ? { background: C.accentDark, transform: 'translateY(-2px)', boxShadow: '0 12px 32px -12px rgba(56,108,46,0.5)' }
        : { background: 'rgba(56,108,46,0.08)', transform: 'translateY(-2px)' }
      : {};
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...hov }}
    >
      {children}
      <ArrowRight
        size={14}
        style={{
          transform: hover && !disabled ? 'translateX(5px)' : 'none',
          transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · Nav : transparente → sombre au défilement
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Démarche', href: '#demarche' },
    { label: 'Projets', href: '#projets' },
    { label: 'Services', href: '#services' },
    { label: 'Éco-conception', href: '#eco' },
    { label: 'Témoignages', href: '#temoignages' },
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
    padding: solid ? '14px clamp(20px,5vw,64px)' : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(12,26,8,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid ? `1px solid rgba(56,108,46,0.3)` : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 'clamp(17px,1.6vw,22px)',
    letterSpacing: '0.08em',
    color: C.white,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2vw,36px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
        <Leaf size={18} color={C.accentLight} strokeWidth={1.5} />
        Jardins Vivants
      </a>
      <div style={linkRow} className="jv-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="jv-navcta">
        <a href="#devis" style={{ textDecoration: 'none' }}>
          <GreenButton filled>Devis gratuit</GreenButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="jv-burger"
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
        @media (max-width: 860px) {
          .jv-navlinks { display: none !important; }
          .jv-burger { display: flex !important; flex-direction: column; }
          .jv-navcta { display: none !important; }
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
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: h ? C.accentLight : 'rgba(255,255,255,0.88)',
        textDecoration: 'none',
        transition: 'color .4s',
        position: 'relative',
        paddingBottom: 4,
        fontWeight: 400,
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
          background: C.accentLight,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · Hero 100vh — parallaxe
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={section} id="hero">
      {/* Photo plein cadre avec parallaxe */}
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
          src="https://images.unsplash.com/photo-1558618047-b62e0e6e8517?q=80&w=2000&auto=format&fit=crop"
          alt="Jardin paysager réalisé par Jardins Vivants à Bordeaux"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-fetch="high"
        />
      </motion.div>

      {/* Voile dégradé */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(12,26,8,0.92) 0%, rgba(12,26,8,0.30) 45%, rgba(12,26,8,0.52) 100%)',
        }}
      />

      {/* Contenu parallaxe */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(32px,6vw,90px)',
          paddingBottom: 'clamp(60px,8vw,110px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow color={C.accentLight}>
            Paysagiste-Concepteur · Bordeaux &amp; Gironde
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,7.5vw,9rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: '22px 0 18px',
            textShadow: '0 12px 60px rgba(0,0,0,0.4)',
            maxWidth: '14ch',
          }}
        >
          Jardins /{' '}
          <span style={{ color: C.accentLight }}>qui respirent.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.6vw,20px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 500,
            lineHeight: 1.7,
            marginBottom: 38,
          }}
        >
          Conception paysagère, permaculture et éco-jardinage sur mesure. Chaque projet commence par écouter votre sol.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
        >
          <GreenButton filled>
            <a href="#devis" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
              Devis gratuit
            </a>
          </GreenButton>
        </motion.div>
      </motion.div>

      {/* Indicateur défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,4vw,64px)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            writingMode: 'vertical-rl',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · Intro — citation éditoriale centrée
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px,12vw,160px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="demarche">
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 34 }}>
          <Eyebrow color={C.accentDark} align="center">
            Notre philosophie
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.36,
            fontWeight: 400,
            maxWidth: 960,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          "Un jardin n&apos;est pas un décor. C&apos;est un écosystème dont vous êtes responsable."
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '52px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · ProjectSequence — crossfade collant 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function ProjectImage({
  project,
  i,
  total,
  progress,
}: {
  project: Project;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeIn = seg * 0.3;

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
        src={project.src}
        alt={project.title}
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

function ProjectLabel({
  project,
  i,
  total,
  progress,
}: {
  project: Project;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.24;

  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    i === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [28, -28]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 'clamp(90px,10vw,130px)',
        right: 'clamp(24px,4vw,64px)',
        textAlign: 'right',
        opacity,
        y,
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(60px,10vw,130px)',
          color: 'rgba(196,220,188,0.18)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {project.index}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(10px,1vw,12px)',
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: C.accentLight,
          fontWeight: 500,
          marginTop: 8,
        }}
      >
        {project.title}
      </div>
    </motion.div>
  );
}

function ProjectCaption({
  project,
  i,
  total,
  progress,
}: {
  project: Project;
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
  const y = useTransform(progress, [start, end], [36, -36]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: 'clamp(50px,8vw,100px)',
        left: 'clamp(24px,6vw,90px)',
        maxWidth: 560,
        opacity,
        y,
      }}
    >
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px,1.6vw,20px)',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.84)',
          margin: 0,
        }}
      >
        {project.sub}
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
    [0.28, 1, 1, 0.28],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [8, 32]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity, borderRadius: 1 }}
    />
  );
}

function ProjectSequence() {
  const n = PROJECTS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="projets"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Images crossfade */}
        {PROJECTS.map((p, i) => (
          <ProjectImage
            key={p.id}
            project={p}
            i={i}
            total={PROJECTS.length}
            progress={progress}
          />
        ))}

        {/* Voile de lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(12,26,8,0.75) 0%, rgba(12,26,8,0.08) 50%, rgba(12,26,8,0.40) 100%)',
          }}
        />

        {/* Labels top-right */}
        {PROJECTS.map((p, i) => (
          <ProjectLabel
            key={p.id}
            project={p}
            i={i}
            total={PROJECTS.length}
            progress={progress}
          />
        ))}

        {/* Captions bas-gauche */}
        {PROJECTS.map((p, i) => (
          <ProjectCaption
            key={p.id}
            project={p}
            i={i}
            total={PROJECTS.length}
            progress={progress}
          />
        ))}

        {/* Dots de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
          }}
        >
          {PROJECTS.map((p, i) => (
            <ProgressDot
              key={p.id}
              i={i}
              total={PROJECTS.length}
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
   5 · ServiceCards — 6 cartes, bordure verte gauche, hover lift
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.border : C.borderDark}`,
    borderLeft: `3px solid ${hover ? C.accent : C.accentLight}`,
    padding: 'clamp(24px,3vw,36px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -32px rgba(56,108,46,0.28)'
      : '0 8px 24px -16px rgba(12,26,8,0.1)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
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
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(28px,3vw,40px)',
            color: hover ? C.accent : C.accentLight,
            lineHeight: 1,
            marginBottom: 16,
            transition: 'color .4s',
          }}
        >
          {s.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,1.8vw,26px)',
            fontWeight: 600,
            color: C.ink,
            margin: '0 0 12px',
            lineHeight: 1.15,
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(14px,1.2vw,16px)',
            lineHeight: 1.72,
            color: C.textMuted,
            margin: 0,
            fontWeight: 300,
          }}
        >
          {s.desc}
        </p>
      </article>
    </Reveal>
  );
}

function ServiceCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(20px,2.4vw,32px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow color={C.accent}>Nos prestations</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5vw,68px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Six expertises,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>un seul engagement.</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EditorialRows — 2 rangées alternées avec numeraux fantômes
   ════════════════════════════════════════════════════════════════════════════ */
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

function EditorialRow({ row, num }: { row: EditRow; num: string }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,90px)',
    alignItems: 'center',
    position: 'relative',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '4 / 5',
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };
  return (
    <div style={wrap} className="jv-editrow">
      <Reveal y={52} style={imgWrap}>
        <ParallaxImg
          src={`https://images.unsplash.com/photo-${row.imgId}&auto=format&fit=crop`}
          alt={row.eyebrow}
        />
      </Reveal>
      <div style={txt}>
        {/* Numéral fantôme */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -40,
            left: row.reverse ? 'auto' : -30,
            right: row.reverse ? -30 : 'auto',
            fontFamily: SERIF,
            fontSize: 'clamp(100px,14vw,200px)',
            fontWeight: 600,
            color: C.earth,
            opacity: 0.08,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {num}
        </div>
        <Reveal>
          <Eyebrow color={C.accentDark}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,3.8vw,54px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 22px',
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.4vw,18px)',
              lineHeight: 1.82,
              color: C.textMuted,
              maxWidth: 460,
              fontWeight: 300,
              margin: 0,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .jv-editrow { grid-template-columns: 1fr !important; }
          .jv-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,10vw,150px) clamp(24px,6vw,96px)',
  };
  return (
    <section id="about" style={sec}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditorialRow key={r.eyebrow} row={r} num={String(i + 1)} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · EcoPanel — image sticky gauche, 4 principes qui défilent à droite
   ════════════════════════════════════════════════════════════════════════════ */
function EcoStep({ item, i }: { item: EcoItem; i: number }) {
  return (
    <Reveal delay={i * 0.06}>
      <div
        style={{
          display: 'flex',
          gap: 'clamp(20px,3vw,40px)',
          alignItems: 'baseline',
          padding: 'clamp(28px,3.5vw,44px) 0',
          borderTop: `1px solid rgba(196,220,188,0.22)`,
        }}
      >
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(20px,2vw,28px)',
            color: C.earth,
            minWidth: 52,
            opacity: 0.8,
            flexShrink: 0,
          }}
        >
          {item.num}
        </span>
        <div>
          <h4
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(22px,2vw,30px)',
              fontWeight: 600,
              color: C.white,
              margin: '0 0 12px',
              lineHeight: 1.15,
            }}
          >
            {item.title}
          </h4>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(14px,1.2vw,16px)',
              lineHeight: 1.78,
              color: 'rgba(255,255,255,0.68)',
              margin: 0,
              fontWeight: 300,
            }}
          >
            {item.body}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function EcoPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,10vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickySide: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };
  return (
    <section style={sec} id="eco">
      <div style={grid} className="jv-ecopanel">
        {/* Image sticky */}
        <div style={stickySide} className="jv-ecopanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(56,108,46,0.35)`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=900&auto=format&fit=crop"
              alt="Jardin écologique conçu selon les principes de la permaculture"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: C.accentLight,
                marginBottom: 10,
                fontWeight: 500,
              }}
            >
              Éco-conception · Charte verte
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(16px,1.4vw,20px)',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.6,
              }}
            >
              "Créer de la biodiversité, c&apos;est aussi investir dans votre propre qualité de vie."
            </div>
          </div>
        </div>

        {/* Principes qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Nos engagements</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.4vw,60px)',
                fontWeight: 400,
                color: C.white,
                margin: '18px 0 32px',
                lineHeight: 1.06,
              }}
            >
              Design écologique /{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                quatre principes.
              </span>
            </h2>
          </Reveal>
          <div>
            {ECO_ITEMS.map((item, i) => (
              <EcoStep key={item.num} item={item} i={i} />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .jv-ecopanel { grid-template-columns: 1fr !important; }
          .jv-ecopanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · Testimonials — fond bgAlt, icône feuille, citation SERIF italic
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          padding: 'clamp(32px,4vw,48px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 20px 56px -36px rgba(56,108,46,0.28)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Leaf size={30} color={C.accent} strokeWidth={1.3} />
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(17px,1.7vw,22px)',
            lineHeight: 1.68,
            color: C.ink,
            margin: '22px 0 28px',
            flex: 1,
          }}
        >
          "{t.quote}"
        </blockquote>
        <figcaption style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 18,
              fontWeight: 600,
              color: C.accentDark,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.textFaint,
              marginTop: 6,
              fontWeight: 400,
            }}
          >
            {t.role}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,3.5vw,52px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1180, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.accentDark} align="center">
            Ce que disent nos clients
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,4.8vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.08,
            }}
          >
            Des jardins qui{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>parlent d&apos;eux-mêmes.</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · QuoteForm — formulaire de devis interactif
   ════════════════════════════════════════════════════════════════════════════ */
function QuoteForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [typeProjet, setTypeProjet] = useState('');
  const [surface, setSurface] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validate = () => {
    const e: Record<string, boolean> = {};
    if (!prenom.trim()) e.prenom = true;
    if (!email.trim() || !email.includes('@')) e.email = true;
    if (!typeProjet) e.typeProjet = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(56,108,46,0.45)`,
    padding: '14px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelBase: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: C.accentLight,
    display: 'block',
    marginBottom: 4,
    fontWeight: 500,
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    color: '#e07a5f',
    marginTop: 4,
    letterSpacing: '0.06em',
  };

  return (
    <section style={sec} id="devis">
      {/* Image de fond subtile */}
      <img
        src="https://images.unsplash.com/photo-1416879347-58da7a5ecbb7?q=80&w=1600&auto=format&fit=crop"
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.08,
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
            Devis gratuit
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(34px,5.5vw,72px)',
              fontWeight: 400,
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.06,
            }}
          >
            Parlons de votre jardin.
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.76,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Nous vous proposons une visite de diagnostic gratuite sur site, partout en Gironde, Dordogne et Lot-et-Garonne.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(56,108,46,0.55)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(56,108,46,0.08)',
              }}
            >
              <Leaf size={36} color={C.accentLight} strokeWidth={1.2} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(26px,2.8vw,36px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '18px 0 14px',
                }}
              >
                Merci {prenom},
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: 'rgba(255,255,255,0.78)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                nous vous proposons une visite de diagnostic gratuite sur site. Vous recevrez un message à{' '}
                <span style={{ color: C.accentLight }}>{email}</span> pour convenir d&apos;un rendez-vous.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <form
              onSubmit={onSubmit}
              noValidate
              style={{ display: 'flex', flexDirection: 'column', gap: 30, textAlign: 'left' }}
            >
              {/* Prénom */}
              <div>
                <label style={labelBase} htmlFor="jv-prenom">
                  Prénom *
                </label>
                <input
                  id="jv-prenom"
                  style={{
                    ...fieldBase,
                    borderBottomColor: errors.prenom
                      ? '#e07a5f'
                      : 'rgba(56,108,46,0.45)',
                  }}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Marie"
                  autoComplete="given-name"
                />
                {errors.prenom && (
                  <p style={errorStyle}>Veuillez indiquer votre prénom.</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelBase} htmlFor="jv-email">
                  Adresse e-mail *
                </label>
                <input
                  id="jv-email"
                  style={{
                    ...fieldBase,
                    borderBottomColor: errors.email
                      ? '#e07a5f'
                      : 'rgba(56,108,46,0.45)',
                  }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@exemple.fr"
                  autoComplete="email"
                />
                {errors.email && (
                  <p style={errorStyle}>Veuillez entrer une adresse e-mail valide.</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelBase} htmlFor="jv-telephone">
                  Téléphone
                </label>
                <input
                  id="jv-telephone"
                  style={fieldBase}
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              {/* Type de projet */}
              <div>
                <label style={labelBase} htmlFor="jv-type">
                  Type de projet *
                </label>
                <select
                  id="jv-type"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: typeProjet ? C.white : 'rgba(255,255,255,0.40)',
                    borderBottomColor: errors.typeProjet
                      ? '#e07a5f'
                      : 'rgba(56,108,46,0.45)',
                  }}
                  value={typeProjet}
                  onChange={(e) => setTypeProjet(e.target.value)}
                >
                  <option value="" style={{ color: '#000', background: '#fff' }}>
                    Choisir un type…
                  </option>
                  <option value="Jardin privatif" style={{ color: '#000', background: '#fff' }}>
                    Jardin privatif
                  </option>
                  <option value="Potager biologique" style={{ color: '#000', background: '#fff' }}>
                    Potager biologique
                  </option>
                  <option value="Terrasse & patio" style={{ color: '#000', background: '#fff' }}>
                    Terrasse &amp; patio
                  </option>
                  <option value="Jardin d'eau" style={{ color: '#000', background: '#fff' }}>
                    Jardin d&apos;eau
                  </option>
                  <option value="Espaces verts pro" style={{ color: '#000', background: '#fff' }}>
                    Espaces verts pro
                  </option>
                  <option value="Autre" style={{ color: '#000', background: '#fff' }}>
                    Autre
                  </option>
                </select>
                {errors.typeProjet && (
                  <p style={errorStyle}>Veuillez sélectionner un type de projet.</p>
                )}
              </div>

              {/* Surface */}
              <div>
                <label style={labelBase} htmlFor="jv-surface">
                  Surface approximative (m²)
                </label>
                <input
                  id="jv-surface"
                  style={fieldBase}
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  placeholder="Ex : 200"
                />
              </div>

              {/* Message */}
              <div>
                <label style={labelBase} htmlFor="jv-message">
                  Décrivez votre projet
                </label>
                <textarea
                  id="jv-message"
                  style={{
                    ...fieldBase,
                    minHeight: 120,
                    resize: 'vertical',
                    lineHeight: 1.7,
                    border: 'none',
                    borderBottom: `1px solid rgba(56,108,46,0.45)`,
                    display: 'block',
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Parlez-nous de votre terrain, vos envies, vos contraintes…"
                />
              </div>

              {/* Submit */}
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <button
                  type="submit"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.accentDark;
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 16px 40px -16px rgba(56,108,46,0.55)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.accent;
                    (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 36px',
                    fontFamily: SANS,
                    fontSize: 12,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: `1px solid ${C.accent}`,
                    background: C.accent,
                    color: C.white,
                    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
                  }}
                >
                  Envoyer ma demande
                  <Send size={14} />
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Footer — 4 colonnes, fond bgDarkAlt, en-têtes verts
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Le Studio',
      items: [
        { label: 'Notre démarche', href: '#demarche' },
        { label: 'Éco-conception', href: '#eco' },
        { label: 'Notre équipe', href: '#demarche' },
        { label: 'Partenaires', href: '#demarche' },
      ],
    },
    {
      title: 'Prestations',
      items: [
        { label: 'Conception 3D', href: '#services' },
        { label: 'Jardins naturels', href: '#services' },
        { label: 'Potagers bio', href: '#services' },
        { label: 'Entretien', href: '#services' },
      ],
    },
    {
      title: 'Réalisations',
      items: [
        { label: 'Jardins privatifs', href: '#projets' },
        { label: 'Potager & permaculture', href: '#projets' },
        { label: 'Espaces professionnels', href: '#projets' },
        { label: 'Témoignages', href: '#temoignages' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Devis gratuit', href: '#devis' },
        { label: 'Bordeaux & Gironde', href: '#devis' },
        { label: 'Dordogne · L47', href: '#devis' },
        { label: 'contact@jardins-vivants.fr', href: '#devis' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(56,108,46,0.25)`,
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer id="contact" style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.3fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.5vw,64px)',
        }}
        className="jv-footgrid"
      >
        {/* Brand column */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(20px,1.8vw,26px)',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Leaf size={20} color={C.accentLight} strokeWidth={1.4} />
            Jardins Vivants
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.78,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 22,
              maxWidth: 300,
            }}
          >
            Paysagiste-concepteur et permaculture à Bordeaux. Chaque jardin commence par une écoute du sol.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <MapPin size={13} color={C.accentLight} strokeWidth={1.5} />
            Bordeaux · Gironde · Aquitaine
          </div>
        </div>

        {/* Content columns */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accentLight,
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              {col.title}
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {col.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    style={{
                      fontFamily: SANS,
                      fontSize: 14,
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.65)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        'rgba(255,255,255,0.65)')
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1240,
          margin: '64px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(56,108,46,0.18)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>© 2006–2026 Jardins Vivants · Paysagiste-Concepteur · Bordeaux</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#demarche" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#demarche" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
          <a href="#devis" style={{ color: 'inherit', textDecoration: 'none' }}>
            Contact
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .jv-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .jv-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE ROOT
   ════════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const root: React.CSSProperties = {
    background: C.bgDark,
    color: C.ink,
    fontFamily: SANS,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  return (
    <main style={root} suppressHydrationWarning>
      {/* Google Fonts */}
      <style>{`@import url('${FONTS_URL}');`}</style>

      <Nav />
      <Hero />
      <Intro />
      <ProjectSequence />
      <ServiceCards />
      <EditorialRows />
      <EcoPanel />
      <Testimonials />
      <QuoteForm />
      <Footer />
    </main>
  );
}
