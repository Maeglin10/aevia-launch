"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
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
  BarChart2,
  ChevronDown,
  Quote,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   FIDUCIAIRE MARCHAND & PARTNERS — Expert-comptable · Nantes · Agréé CSOEC
   Chorégraphie de défilement éditoriale premium. Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONT_LINK = `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`;

/* ── Palette ─────────────────────────────────────────────────────────────── */

// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: '#f4f6fb',
  bgAlt: '#e8ecf5',
  bgDark: '#0a0f1e',
  bgDarkAlt: '#111828',
  bgCard: '#ffffff',
  accent: '#2251cc',
  accentDark: '#1a3fa3',
  accentLight: '#dce7ff',
  white: '#ffffff',
  ink: '#0a0f1e',
  textMuted: '#4a5578',
  textFaint: '#8a93b0',
  border: '#c8d4ee',
  borderDark: 'rgba(34,81,204,0.22)',
};

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces de données
   ════════════════════════════════════════════════════════════════════════════ */
interface Service {
  id: string;
  num: string;
  caption: string;
  sub: string;
  img: string;
  alt: string;
}

interface Offer {
  num: string;
  title: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  alt: string;
  title: React.ReactNode;
  body: string;
  ghost: string;
  reverse: boolean;
}

interface ExpertiseItem {
  num: string;
  title: string;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

/* ── Données ─────────────────────────────────────────────────────────────── */
const PHASES: Service[] = [
  {
    id: 'comptabilite',
    num: '01',
    caption: 'COMPTABILITÉ & FISCALITÉ',
    sub: 'Tenue comptable, déclarations TVA, liasses fiscales, optimisation IS — accompagnement complet pour TPE et PME.',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    alt: 'Expert-comptable analysant des liasses fiscales',
  },
  {
    id: 'conseil',
    num: '02',
    caption: 'CONSEIL EN GESTION',
    sub: 'Tableaux de bord, prévisionnel, analyse de rentabilité — prenez vos décisions avec des chiffres clairs.',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    alt: "Réunion de conseil en gestion d'entreprise",
  },
  {
    id: 'creation',
    num: '03',
    caption: 'CRÉATION & JURIDIQUE',
    sub: 'Choix de statut, rédaction des statuts, formalités — nous constituons votre société de A à Z.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1600&auto=format&fit=crop',
    alt: "Documents juridiques de création d'entreprise",
  },
];

const OFFERS: Offer[] = [
  {
    num: '01',
    title: 'Tenue comptable',
    desc: 'Saisie, lettrage, révision et clôture annuelle — une comptabilité irréprochable, en temps réel.',
  },
  {
    num: '02',
    title: 'Déclarations fiscales',
    desc: 'TVA, IS, IR, CFE, CVAE — toutes vos obligations fiscales traitées sans effort de votre côté.',
  },
  {
    num: '03',
    title: 'Paie & RH',
    desc: 'Bulletins de salaire, DSN, DPAE, gestion des entrées/sorties — la paie sans souci.',
  },
  {
    num: '04',
    title: 'Conseil de gestion',
    desc: 'Prévisionnel, trésorerie, tableaux de bord mensuels pour piloter votre activité sereinement.',
  },
  {
    num: '05',
    title: "Création d'entreprise",
    desc: 'Choix de statut, business plan, immatriculation, ouverture de compte — tout en un.',
  },
  {
    num: '06',
    title: 'Audit & Commissariat',
    desc: 'CAC légal et contractuel, audit de gestion, due diligence pour vos cessions ou acquisitions.',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre philosophie',
    imgId: '1554224155-8d04cb38fc7?w=800',
    alt: 'Expert comptable en consultation',
    title: (
      <>
        Au-delà des chiffres, <br />
        <span style={{ fontStyle: 'italic', fontWeight: 300 }}>un partenaire.</span>
      </>
    ),
    body: "Chez Marchand & Partners, nous refusons le rôle de simple prestataire technique. Chaque client bénéficie d'un expert dédié qui anticipe, alerte et conseille — avant même que vous ne posez la question. Notre approche proactive transforme la comptabilité en levier de croissance.",
    ghost: '01',
    reverse: false,
  },
  {
    eyebrow: 'Nos outils',
    imgId: '1507679799987-c73779587ccf?w=800',
    alt: 'Dashboard de gestion en temps réel',
    title: (
      <>
        100% digital, <br />
        <span style={{ fontStyle: 'italic', fontWeight: 300 }}>0% paperasse.</span>
      </>
    ),
    body: "Pennylane, QuickBooks, Dext — nous travaillons avec les meilleurs outils cloud du marché. Vos documents sont collectés automatiquement, votre comptabilité mise à jour en continu. Un dashboard en temps réel accessible depuis votre téléphone, à tout moment.",
    ghost: '02',
    reverse: true,
  },
];

const EXPERTISE_ITEMS: ExpertiseItem[] = [
  {
    num: '01',
    title: 'Réponse garantie sous 24h ouvrées',
    body: 'Un email, un message — vous obtenez une réponse de votre expert le jour ouvré suivant. Sans exception.',
  },
  {
    num: '02',
    title: 'Accès illimité à votre expert dédié',
    body: 'Pas de standard, pas de ticket. Vous avez le contact direct de votre expert-comptable attitré.',
  },
  {
    num: '03',
    title: 'Tableau de bord en temps réel 24/7',
    body: 'Vos chiffres, votre trésorerie, vos indicateurs — disponibles à tout moment depuis notre espace client sécurisé.',
  },
  {
    num: '04',
    title: 'Conseils proactifs, pas seulement réactifs',
    body: "Nous vous alertons des opportunités fiscales, des changements réglementaires et des risques — avant qu'ils vous impactent.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Depuis que je travaille avec Marchand & Partners, j'ai récupéré 3 heures par semaine et découvert plus de 4 000 € de déductions que j'ignorais. Leur approche proactive a complètement changé ma façon de piloter mon activité.",
    name: 'Sophie Renard',
    role: 'Consultante indépendante',
    company: 'Auto-entrepreneur',
  },
  {
    quote:
      "Nous avons créé notre SARL en moins de deux semaines, statuts inclus. L'équipe a tout géré : choix du statut, immatriculation, ouverture de compte pro. Six mois plus tard, notre comptabilité tourne en pilote automatique.",
    name: 'Thomas & Aline Moreau',
    role: 'Co-gérants',
    company: 'SARL — Commerce de détail, Nantes',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Ligne accent bleue 28px + label uppercase. */
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
    width: 28,
    height: 2,
    background: color,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: '0.30em',
    textTransform: 'uppercase',
    color,
    fontWeight: 600,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' ? <span style={rule} /> : null}
    </div>
  );
}

/** Révélation au scroll — fondu + translation verticale, une seule fois. */
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
      transition={{ duration: 1.0, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton bleu ou contour, flèche qui glisse au survol. */
function BlueButton({
  children,
  onClick,
  filled = true,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '15px 28px',
    fontFamily: FONT,
    fontSize: 12,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: C.accentLight, transform: 'translateY(-2px)' }
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
        size={14}
        style={{
          transform: hover ? 'translateX(4px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Navigation : transparente → foncée au défilement
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Notre approche', href: '#approche' },
    { label: 'Résultats', href: '#resultats' },
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
    padding: solid ? '14px clamp(20px,5vw,64px)' : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(10,15,30,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid ? `1px solid ${C.borderDark}` : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 'clamp(15px,1.4vw,18px)',
    fontWeight: 700,
    color: C.white,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    letterSpacing: '-0.01em',
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.2vw,36px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#services" style={brand}>
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <BarChart2 size={20} color={C.accent} strokeWidth={2} />
            Marchand &amp; Partners
          </>
        )}
      </a>
      <div style={linkRow} className="fm-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="fm-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <BlueButton>Première consultation offerte</BlueButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fm-burger"
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
          .fm-navlinks{ display:none !important; }
          .fm-burger { display: flex !important; flex-direction: column; }
          .fm-navcta{ display:none !important; }
        }
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
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
        fontFamily: FONT,
        fontSize: 12.5,
        letterSpacing: '0.06em',
        fontWeight: 500,
        color: h ? C.white : 'rgba(255,255,255,0.80)',
        textDecoration: 'none',
        transition: 'color .35s',
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
          height: 1.5,
          width: h ? '100%' : '0%',
          background: C.accent,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO parallaxe — texte bas-gauche
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section id="hero"
      ref={ref}
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: 640,
        overflow: 'hidden',
        background: C.bgDark,
      }}
    >
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
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop"
          alt="Cabinet expert-comptable Marchand & Partners Nantes"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile bas-gauche + voile global */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.40) 45%, rgba(10,15,30,0.18) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(10,15,30,0.72) 0%, transparent 60%)',
        }}
      />

      {/* Contenu bas-gauche */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 'clamp(60px,9vh,110px)',
          left: 'clamp(24px,6vw,96px)',
          zIndex: 2,
          maxWidth: 720,
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.05 }}
        >
          <Eyebrow color="rgba(255,255,255,0.75)">
            Expert-comptable · Nantes · Agréé CSOEC
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            color: C.white,
            fontSize: 'clamp(3rem,9vw,10rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
            margin: 'clamp(20px,3vw,32px) 0 clamp(18px,2.5vw,28px)',
            textShadow: '0 16px 60px rgba(0,0,0,0.45)',
          }}
        >
          VOS CHIFFRES
          <br />
          ENFIN CLAIRS.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize: 'clamp(16px,1.8vw,21px)',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.65,
            maxWidth: 520,
            marginBottom: 36,
          }}
        >
          Cabinet d&apos;expertise comptable à Nantes — comptabilité, fiscalité, paie
          et conseil de gestion pour TPE, PME et indépendants.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.68 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <a href="#contact" style={{ textDecoration: 'none' }}>
            <BlueButton filled>Première consultation offerte</BlueButton>
          </a>
          <a href="#services" style={{ textDecoration: 'none' }}>
            <BlueButton filled={false}>Nos services</BlueButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,5vw,64px)',
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
            fontFamily: FONT,
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color="rgba(255,255,255,0.55)" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · Manifeste — texte centré sur bgAlt
   ════════════════════════════════════════════════════════════════════════════ */
function Manifesto() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,13vw,180px) clamp(24px,8vw,160px)',
        textAlign: 'center',
      }}
    >
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Eyebrow color={C.accent} align="center">
            Notre conviction
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.38,
            fontWeight: 300,
            fontStyle: 'italic',
            maxWidth: 900,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          La comptabilité ne devrait pas être une source de stress. Elle devrait
          être{' '}
          <span style={{ fontWeight: 700, fontStyle: 'normal', color: C.accent }}>
            un avantage compétitif
          </span>
          . Nous sommes là pour ça — en langage clair, sans jargon, avec des
          conseils qui font vraiment la différence.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '52px auto 0',
            opacity: 0.5,
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · ServiceSequence — crossfade sticky 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceLayer({
  service,
  i,
  total,
  progress,
}: {
  service: Service;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeSpan = seg * 0.26;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - fadeSpan), start, end - fadeSpan, Math.min(1, end)],
    i === 0
      ? [1, 1, 1, 0]
      : i === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeSpan, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={service.img}
        alt={service.alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', scale }}
      />
    </motion.div>
  );
}

function ServiceCaption({
  service,
  i,
  total,
  progress,
}: {
  service: Service;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.20;

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
        bottom: 'clamp(70px,10vh,110px)',
        left: 'clamp(24px,6vw,96px)',
        right: 'clamp(24px,6vw,96px)',
        opacity,
        y,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 'clamp(56px,10vw,130px)',
          fontWeight: 800,
          color: 'rgba(255,255,255,0.06)',
          lineHeight: 1,
          position: 'absolute',
          bottom: '100%',
          left: 0,
          userSelect: 'none',
        }}
      >
        {service.num}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 11,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          marginBottom: 14,
          fontWeight: 500,
        }}
      >
        {service.num} / 0{total}
      </div>
      <h2
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 'clamp(28px,4.5vw,64px)',
          color: C.white,
          letterSpacing: '-0.01em',
          lineHeight: 1.05,
          margin: '0 0 16px',
          textShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {service.caption}
      </h2>
      <p
        style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontSize: 'clamp(15px,1.6vw,19px)',
          color: 'rgba(255,255,255,0.78)',
          maxWidth: 560,
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {service.sub}
      </p>
    </motion.div>
  );
}

function ServiceSequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="services"
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Couches images */}
        {PHASES.map((s, i) => (
          <ServiceLayer
            key={s.id}
            service={s}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Voile bas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.15) 40%, rgba(10,15,30,0.25) 100%)',
            zIndex: 1,
          }}
        />

        {/* Label eyebrow haut-droite */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(90px,12vh,110px)',
            right: 'clamp(24px,5vw,64px)',
            zIndex: 3,
          }}
        >
          <Eyebrow color="rgba(255,255,255,0.45)" align="left">
            Nos domaines d&apos;expertise
          </Eyebrow>
        </div>

        {/* Captions */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {PHASES.map((s, i) => (
            <ServiceCaption
              key={s.id}
              service={s}
              i={i}
              total={PHASES.length}
              progress={progress}
            />
          ))}
        </div>

        {/* ProgressDots */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 'clamp(24px,5vw,64px)',
            display: 'flex',
            gap: 10,
            zIndex: 3,
          }}
        >
          {PHASES.map((s, i) => (
            <ProgressDot
              key={s.id}
              i={i}
              total={PHASES.length}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity, borderRadius: 2 }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · OfferCards — 6 cartes sur bg
   ════════════════════════════════════════════════════════════════════════════ */
function OfferCard({ offer, i }: { offer: Offer; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.bgCard,
          border: `1.5px solid ${hover ? C.accent : C.border}`,
          padding: 'clamp(26px,3vw,38px)',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          transition: 'border-color .4s, box-shadow .4s, transform .4s cubic-bezier(.16,1,.3,1)',
          transform: hover ? 'translateY(-6px)' : 'none',
          boxShadow: hover
            ? '0 24px 56px -20px rgba(34,81,204,0.22)'
            : '0 2px 12px -6px rgba(10,15,30,0.08)',
          cursor: 'default',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            background: hover ? C.accent : C.accentLight,
            borderRadius: 6,
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 700,
            color: hover ? C.white : C.accent,
            letterSpacing: '0.06em',
            transition: 'all .4s',
            flexShrink: 0,
          }}
        >
          {offer.num}
        </div>
        <h3
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(17px,1.6vw,20px)',
            fontWeight: 700,
            color: C.ink,
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          {offer.title}
        </h3>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(14px,1.2vw,15.5px)',
            fontWeight: 400,
            color: C.textMuted,
            lineHeight: 1.65,
            margin: 0,
            flex: 1,
          }}
        >
          {offer.desc}
        </p>
      </article>
    </Reveal>
  );
}

function OfferCards() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 24,
            marginBottom: 'clamp(48px,6vw,72px)',
          }}
        >
          <div>
            <Reveal>
              <Eyebrow>Nos prestations</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 'clamp(32px,5vw,66px)',
                  color: C.ink,
                  margin: 'clamp(16px,2vw,22px) 0 0',
                  lineHeight: 1.06,
                  letterSpacing: '-0.02em',
                }}
              >
                Tout ce dont votre
                <br />
                entreprise a besoin.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <a href="#contact" style={{ textDecoration: 'none' }}>
              <BlueButton>Demander un devis</BlueButton>
            </a>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 'clamp(16px,2vw,24px)',
          }}
        >
          {OFFERS.map((o, i) => (
            <OfferCard key={o.num} offer={o} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · EditorialRows — 2 rangées alternées image / texte
   ════════════════════════════════════════════════════════════════════════════ */
function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '116%', objectFit: 'cover', y, display: 'block' }}
      />
    </div>
  );
}

function EditorialRow({ row, index }: { row: EditRow; index: number }) {
  return (
    <div style={{ position: 'relative' }} className="fm-editrow">
      {/* Numéro fantôme */}
      <div
        style={{
          position: 'absolute',
          top: '-0.1em',
          right: row.reverse ? 'auto' : 0,
          left: row.reverse ? 0 : 'auto',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 'clamp(80px,14vw,200px)',
          lineHeight: 1,
          color: 'rgba(34,81,204,0.045)',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {row.ghost}
      </div>

      <div className="imx-mobstack"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(36px,6vw,88px)',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Image */}
        <Reveal
          y={50}
          style={{
            overflow: 'hidden',
            aspectRatio: '4 / 5',
            order: row.reverse ? 2 : 1,
          }}
        >
          <ParallaxImg
            src={`https://images.unsplash.com/photo-${row.imgId}&auto=format&fit=crop`}
            alt={row.alt}
          />
        </Reveal>

        {/* Texte */}
        <div style={{ order: row.reverse ? 1 : 2 }}>
          <Reveal>
            <Eyebrow>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.09}>
            <h3
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 'clamp(28px,4vw,56px)',
                color: C.ink,
                margin: 'clamp(18px,2.5vw,28px) 0 clamp(18px,2.2vw,26px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {row.title}
            </h3>
          </Reveal>
          <Reveal delay={0.17}>
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: 'clamp(15px,1.5vw,18px)',
                color: C.textMuted,
                lineHeight: 1.75,
                maxWidth: 480,
              }}
            >
              {row.body}
            </p>
          </Reveal>
          <Reveal delay={0.26} style={{ marginTop: 'clamp(24px,3vw,36px)' }}>
            <a href="#contact" style={{ textDecoration: 'none' }}>
              <BlueButton>En savoir plus</BlueButton>
            </a>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px){
          .fm-editrow > div[style*="grid-template-columns"]{
            grid-template-columns: 1fr !important;
          }
          .fm-editrow > div[style*="grid-template-columns"] > *{
            order: initial !important;
          }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  return (
    <section
      id="approche"
      style={{
        background: C.bg,
        padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditorialRow key={r.eyebrow} row={r} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · ExpertisePanel — sticky image gauche, 4 items scrollent à droite
   ════════════════════════════════════════════════════════════════════════════ */
function ExpertisePanel() {
  return (
    <section
      id="resultats"
      style={{
        background: C.bgDark,
        padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px,7vw,100px)',
          alignItems: 'start',
        }}
        className="fm-expanel"
      >
        {/* Image sticky gauche */}
        <div
          style={{
            position: 'sticky',
            top: 100,
            alignSelf: 'start',
          }}
          className="fm-expanel-sticky"
        >
          <Reveal>
            <div
              style={{
                overflow: 'hidden',
                border: `1px solid ${C.borderDark}`,
                aspectRatio: '3 / 4',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=900&auto=format&fit=crop"
                alt="Cabinet Marchand & Partners — expertise et proximité"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 28 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.textFaint,
                fontWeight: 500,
              }}
            >
              Depuis 1998 · Nantes
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 'clamp(28px,3vw,42px)',
                color: C.white,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginTop: 10,
              }}
            >
              +350 clients
              <br />
              accompagnés.
            </div>
          </Reveal>
        </div>

        {/* Items qui scrollent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Notre engagement</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 'clamp(30px,4vw,54px)',
                color: C.white,
                margin: 'clamp(18px,2.5vw,28px) 0 clamp(38px,5vw,56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Un niveau de service
              <br />
              que vous sentirez
              <br />
              dès le premier jour.
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {EXPERTISE_ITEMS.map((item, i) => (
              <Reveal key={item.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,40px) 0',
                    borderTop: `1.5px solid ${C.borderDark}`,
                    display: 'flex',
                    gap: 'clamp(20px,2.5vw,32px)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: '0.20em',
                      color: C.accent,
                      minWidth: 30,
                      paddingTop: 5,
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: 'clamp(17px,1.7vw,21px)',
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.25,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.3vw,16px)',
                        lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.60)',
                        margin: 0,
                      }}
                    >
                      {item.body}
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
          .fm-expanel{ grid-template-columns: 1fr !important; }
          .fm-expanel-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · Témoignages — 2 cartes blanches sur bgAlt
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
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 16px 48px -32px rgba(10,15,30,0.18)',
        }}
      >
        <Quote size={32} color={C.accent} strokeWidth={1.5} />
        <blockquote
          style={{
            fontFamily: FONT,
            fontStyle: 'italic',
            fontSize: 'clamp(17px,1.8vw,21px)',
            fontWeight: 300,
            lineHeight: 1.65,
            color: C.ink,
            margin: '22px 0 28px',
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
              fontFamily: FONT,
              fontSize: 'clamp(16px,1.4vw,18px)',
              fontWeight: 700,
              color: C.ink,
              marginBottom: 6,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.textFaint,
              fontWeight: 500,
            }}
          >
            {t.role}
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: C.accent,
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            {t.company}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Testimonials() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,72px)' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <Eyebrow color={C.accent} align="center">
                Ils nous font confiance
              </Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 'clamp(30px,4.5vw,58px)',
                color: C.ink,
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Ce que disent
              <br />
              nos clients.
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(20px,3vw,36px)',
          }}
          className="fm-testimonials"
        >
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} i={i} />
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px){
          .fm-testimonials{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · ContactForm — centré 720px sur bgDark
   ════════════════════════════════════════════════════════════════════════════ */
function ContactForm() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [typeEntreprise, setTypeEntreprise] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!prenom || !nom || !email) return;
    setSent(true);
  };

  const labelStyle = (name: string): React.CSSProperties => ({
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 600,
    color: focused === name ? C.accent : 'rgba(255,255,255,0.55)',
    display: 'block',
    marginBottom: 8,
    transition: 'color .3s',
  });

  const fieldStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1.5px solid ${focused === name ? C.accent : 'rgba(255,255,255,0.18)'}`,
    padding: '12px 0',
    fontFamily: FONT,
    fontWeight: 400,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  });

  const fieldEvents = (name: string) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
  });

  return (
    <section
      id="contact"
      style={{
        background: C.bgDark,
        padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Lueur accent en arrière-plan */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(34,81,204,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}>
            <Eyebrow color={C.accent} align="center">
              Première consultation offerte
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 'clamp(32px,5vw,64px)',
              color: C.white,
              margin: '0 0 clamp(14px,2vw,20px)',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            Parlons de votre
            <br />
            projet.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              color: 'rgba(255,255,255,0.62)',
              lineHeight: 1.7,
              maxWidth: 520,
              margin: '0 auto clamp(44px,6vw,64px)',
            }}
          >
            30 minutes, sans engagement, avec un expert qui connaît votre secteur.
            Nous répondons sous 24h ouvrées.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1.5px solid ${C.borderDark}`,
                padding: 'clamp(40px,6vw,60px)',
                background: 'rgba(34,81,204,0.07)',
              }}
            >
              <BarChart2 size={36} color={C.accent} strokeWidth={1.5} />
              <h3
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 'clamp(24px,3vw,34px)',
                  color: C.white,
                  margin: '18px 0 12px',
                  letterSpacing: '-0.01em',
                }}
              >
                Merci {prenom}, votre message est envoyé.
              </h3>
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.65)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Notre équipe vous contacte sous 24h ouvrées à l&apos;adresse{' '}
                <strong style={{ color: C.accent, fontWeight: 600 }}>{email}</strong>.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 32,
                textAlign: 'left',
              }}
            >
              {/* Prénom + Nom */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 24,
                }}
                className="fm-form-namegrid"
              >
                <div>
                  <label style={labelStyle('prenom')} htmlFor="fm-prenom">
                    Prénom
                  </label>
                  <input
                    id="fm-prenom"
                    style={fieldStyle('prenom')}
                    {...fieldEvents('prenom')}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle('nom')} htmlFor="fm-nom">
                    Nom
                  </label>
                  <input
                    id="fm-nom"
                    style={fieldStyle('nom')}
                    {...fieldEvents('nom')}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle('email')} htmlFor="fm-email">
                  Email
                </label>
                <input
                  id="fm-email"
                  style={fieldStyle('email')}
                  {...fieldEvents('email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@exemple.fr"
                  autoComplete="email"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle('tel')} htmlFor="fm-tel">
                  Téléphone
                </label>
                <input
                  id="fm-tel"
                  style={fieldStyle('tel')}
                  {...fieldEvents('tel')}
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              {/* Type d'entreprise */}
              <div>
                <label style={labelStyle('type')} htmlFor="fm-type">
                  Type d&apos;entreprise
                </label>
                <select
                  id="fm-type"
                  style={{
                    ...fieldStyle('type'),
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: typeEntreprise ? C.white : 'rgba(255,255,255,0.35)',
                  }}
                  {...fieldEvents('type')}
                  value={typeEntreprise}
                  onChange={(e) => setTypeEntreprise(e.target.value)}
                >
                  <option value="" style={{ background: C.bgDark, color: C.white }}>
                    Choisir une structure…
                  </option>
                  <option value="autoentrepreneur" style={{ background: C.bgDark, color: C.white }}>
                    Auto-entrepreneur
                  </option>
                  <option value="eurl-sarl" style={{ background: C.bgDark, color: C.white }}>
                    EURL / SARL
                  </option>
                  <option value="sas-sasu" style={{ background: C.bgDark, color: C.white }}>
                    SAS / SASU
                  </option>
                  <option value="liberale" style={{ background: C.bgDark, color: C.white }}>
                    Profession libérale
                  </option>
                  <option value="association" style={{ background: C.bgDark, color: C.white }}>
                    Association
                  </option>
                  <option value="autre" style={{ background: C.bgDark, color: C.white }}>
                    Autre
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle('message')} htmlFor="fm-message">
                  Message
                </label>
                <textarea
                  id="fm-message"
                  rows={4}
                  style={{
                    ...fieldStyle('message'),
                    resize: 'vertical',
                    minHeight: 100,
                  }}
                  {...fieldEvents('message')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre situation en quelques mots…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <BlueButton type="button" onClick={handleSubmit} filled>
                  Envoyer ma demande
                </BlueButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 900px){
          .fm-form-namegrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · Footer — 4 colonnes sur bgDarkAlt
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Services',
      items: [
        { label: 'Tenue comptable', href: '#services' },
        { label: 'Déclarations fiscales', href: '#services' },
        { label: 'Paie & RH', href: '#services' },
        { label: 'Conseil de gestion', href: '#services' },
        { label: "Création d'entreprise", href: '#services' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre approche', href: '#approche' },
        { label: 'Notre équipe', href: '#approche' },
        { label: 'Nos engagements', href: '#resultats' },
        { label: 'Témoignages clients', href: '#resultats' },
      ],
    },
    {
      title: 'Légal',
      items: [
        { label: 'Mentions légales', href: '#contact' },
        { label: 'Politique de confidentialité', href: '#contact' },
        { label: 'CGV', href: '#contact' },
        { label: 'Ordre des experts-comptables', href: 'https://www.experts-comptables.fr' },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.bgDarkAlt,
        borderTop: `1px solid ${C.borderDark}`,
        padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 36px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="fm-footgrid"
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <BarChart2 size={22} color={C.accent} strokeWidth={2} />
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 17,
                color: C.white,
                letterSpacing: '-0.01em',
              }}
            >
              Marchand &amp; Partners
            </span>
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize: 15,
              color: 'rgba(255,255,255,0.52)',
              lineHeight: 1.7,
              maxWidth: 300,
              margin: '0 0 24px',
            }}
          >
            Expert-comptable agréé CSOEC à Nantes — comptabilité, fiscalité et
            conseil pour TPE, PME et indépendants.
          </p>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 13,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
            }}
          >
            <div>📍 12 rue de la Paix, 44000 Nantes</div>
            <div style={{ marginTop: 6 }}>📞 02 40 XX XX XX</div>
            <div style={{ marginTop: 6 }}>✉️ contact@marchand-partners.fr</div>
          </div>
        </div>

        {/* Link cols */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 11,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: C.accent,
                marginBottom: 22,
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
                gap: 12,
              }}
            >
              {c.items.map((it) => (
                <li key={it.label}>
                  <FooterLink label={it.label} href={it.href} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: 'clamp(48px,6vw,72px) auto 0',
          paddingTop: 24,
          borderTop: `1px solid ${C.borderDark}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: FONT,
          fontSize: 11,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.35)',
        }}
      >
        <span>
          © {new Date().getFullYear()} Fiduciaire Marchand &amp; Partners. Tous droits réservés. Membre de l&apos;OEC.
        </span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            CGV
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 900px){
          .fm-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px){
          .fm-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: FONT,
        fontSize: 14,
        fontWeight: 400,
        color: h ? C.white : 'rgba(255,255,255,0.55)',
        textDecoration: 'none',
        transition: 'color .3s',
      }}
    >
      {label}
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Page() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  if (brand) {
    C = {
      ...C,
      accent: brand,
      accentDark: shadeColor(brand, -20),
    };
  }

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <main
      suppressHydrationWarning
      style={{
        background: C.bg,
        color: C.ink,
        fontFamily: FONT,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href={FONT_LINK} rel="stylesheet" />

      <Nav />
      <Hero />
      <Manifesto />
      <ServiceSequence />
      <OfferCards />
      <EditorialRows />
      <ExpertisePanel />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
}
