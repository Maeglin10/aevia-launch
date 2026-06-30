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
  Shield,
  Phone,
  MapPin,
  CheckCircle2,
  Wrench,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   AQUA CONFORT LYON — Plombier-Chauffagiste & Énergies Renouvelables · Lyon 7e
   Scroll choreography éditoriale (InterventionSequence 320vh crossfade + sticky
   CertPanel). 'use client'. Autonome, sans layout.tsx.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts (chargement inline, aucune dépendance next/font) ──────── */
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap';

/* ── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  bg: '#f2f6f8',
  bgAlt: '#e4ecf2',
  bgDark: '#071018',
  bgDarkAlt: '#040a10',
  bgCard: '#ffffff',
  accent: '#0e7490',
  accentDark: '#0c5f78',
  accentLight: '#c8e8f0',
  white: '#ffffff',
  ink: '#071018',
  textMuted: '#1e4058',
  textFaint: '#6a8898',
  border: '#b8d4e0',
  borderDark: 'rgba(14,116,144,0.2)',
  green: '#2d8a4a',
} as const;

const SERIF = "'Playfair Display', Georgia, serif" as const;
const SANS = "'Nunito Sans', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo helper ────────────────────────────────────────────────────────── */
const ph = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

/* ════════════════════════════════════════════════════════════════════════════
   Typed interfaces
   ════════════════════════════════════════════════════════════════════════════ */
interface Service {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface Intervention {
  img: string;
  index: string;
  label: string;
  title: string;
  body: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  alt: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
  ghost: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface CertItem {
  num: string;
  title: string;
  desc: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */
const INTERVENTIONS: Intervention[] = [
  {
    img: ph('1581578485-dea47a32cc3f'),
    index: 'I',
    label: 'PLOMBERIE',
    title: 'Plomberie',
    body: 'Fuites détectées à la caméra, réfection de réseaux, sanitaires — intervention le jour même sur Lyon Métropole.',
  },
  {
    img: ph('1585771724684-38269d6639fd'),
    index: 'II',
    label: 'CHAUFFAGE',
    title: 'Chauffage',
    body: 'Chaudières gaz condensation, radiateurs basse température, entretien annuel obligatoire — certifié RGE.',
  },
  {
    img: ph('1621905252507-b35492cc74b4'),
    index: 'III',
    label: 'ÉNERGIES RENOUVELABLES',
    title: 'Énergies renouvelables',
    body: "Pompes à chaleur air/eau, chauffe-eau thermodynamique, solaire thermique — aides MaPrimeRénov' incluses.",
  },
];

const SERVICES: Service[] = [
  { icon: <Wrench size={20} strokeWidth={1.6} />, title: 'Dépannage urgent', desc: "Intervention d'urgence sous 2h sur Lyon Métropole, 7j/7 et 24h/24." },
  { icon: <Wrench size={20} strokeWidth={1.6} />, title: 'Installation chauffe-eau', desc: 'Pose et remplacement de ballon électrique ou thermodynamique, toutes marques.' },
  { icon: <Wrench size={20} strokeWidth={1.6} />, title: 'Chaudière gaz', desc: 'Installation, entretien et dépannage de chaudières à condensation — certificat RGE.' },
  { icon: <Wrench size={20} strokeWidth={1.6} />, title: 'Pompe à chaleur', desc: "Air/eau, géothermique : conception, pose, mise en service. MaPrimeRénov' incluse." },
  { icon: <Wrench size={20} strokeWidth={1.6} />, title: 'Climatisation réversible', desc: 'Climatiseur gainable ou multi-split, installation propre et garantie 2 ans.' },
  { icon: <Wrench size={20} strokeWidth={1.6} />, title: 'Rénovation salle de bain', desc: 'Refonte complète : carrelage, mobilier, plomberie — devis offert sur place.' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre engagement',
    img: ph('1581578485-dea47a32cc3f') + '&w=800',
    alt: 'Plombier Aqua Confort Lyon au travail',
    title: (
      <>
        Réactif{' '}
        <span style={{ fontStyle: 'italic', color: C.accent }}>
          et transparent.
        </span>
      </>
    ),
    body: "Réponse garantie sous 2h sur Lyon Métropole. Tarification fixe communiquée avant intervention — aucune mauvaise surprise. Garantie décennale sur toutes nos installations.",
    reverse: false,
    ghost: '01',
  },
  {
    eyebrow: "Aides de l'État",
    img: ph('1621905252507-b35492cc74b4') + '&w=800',
    alt: 'Pompe à chaleur installée par Aqua Confort Lyon',
    title: (
      <>
        MaPrimeRénov&apos;{' '}
        <span style={{ fontStyle: 'italic', color: C.accent }}>
          on s&apos;en charge.
        </span>
      </>
    ),
    body: "Nous prenons en charge l'intégralité des démarches administratives : MaPrimeRénov', CEE, Éco-prêt à taux zéro. Jusqu'à 70 % de vos travaux financés.",
    reverse: true,
    ghost: '02',
  },
];

const CERTS: CertItem[] = [
  {
    num: '01',
    title: 'RGE QualiPAC & Qualibois',
    desc: 'Habilitations pompes à chaleur et chaudières biomasse — obligatoires pour déclencher vos aides.',
  },
  {
    num: '02',
    title: 'IRVE certifié',
    desc: 'Pose de bornes de recharge pour véhicules électriques, conforme aux normes en vigueur.',
  },
  {
    num: '03',
    title: 'Garantie décennale & RC professionnelle',
    desc: 'Couverture totale de nos installations pendant 10 ans. Assurances à jour, justificatifs fournis.',
  },
  {
    num: '04',
    title: 'Attestation CONSUEL & Cerfa de fin de travaux',
    desc: "Documents officiels remis à la fin de chaque chantier pour vos démarches auprès de l'administration.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Nous avons remplacé notre vieille chaudière et installé une pompe à chaleur air/eau. Aqua Confort a géré MaPrimeRénov' de A à Z — 65 % financés, et on économise 800 € par an sur nos factures. Équipe sérieuse, délais tenus.",
    name: 'Famille Renard',
    role: 'Propriétaires · Lyon 7e',
  },
  {
    quote:
      "Fuite importante un dimanche matin. Technicien sur place en 90 minutes, problème résolu avant midi. Pas de dégât des eaux. Le tarif forfaitaire annoncé par téléphone a été respecté à l'euro près. Je recommande sans hésiter.",
    name: 'Marc Vidal',
    role: 'Propriétaire bailleur · Villeurbanne',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, filet teal. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
  light = false,
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 40,
    height: 1,
    background: color,
    opacity: light ? 0.5 : 0.7,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.40em',
    textTransform: 'uppercase',
    color,
    fontWeight: 700,
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
      transition={{ duration: 1.0, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton teal, flèche animée. */
function TealButton({
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
  const bg = filled
    ? hover
      ? C.accentDark
      : C.accent
    : hover
      ? 'rgba(14,116,144,0.12)'
      : 'transparent';
  const textCol = filled ? C.white : dark ? C.accent : C.accent;
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 28px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: `1.5px solid ${C.accent}`,
    background: bg,
    color: textCol,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-2px)' : 'none',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={base}
    >
      {children}
      <ArrowRight
        size={14}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
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
   Nav : transparente → bgDark au défilement
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
    { label: 'Services', href: '#services' },
    { label: 'Notre engagement', href: '#engagement' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Témoignages', href: '#temoignages' },
    { label: 'Contact', href: '#devis' },
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
      ? '14px clamp(20px,5vw,64px)'
      : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(7,16,24,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(14,116,144,0.22)`
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 18,
    fontWeight: 800,
    color: C.white,
    letterSpacing: '-0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  return (
    <>
      <nav style={bar}>
      <div style={brand}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="13" r="12" stroke={C.accent} strokeWidth="1.5" />
          <path d="M13 7v6l4 3" stroke={C.accentLight} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Aqua Confort
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,2.2vw,34px)' }} className="ac-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <a
        href="tel:0400000000"
        style={{ textDecoration: 'none' }}
        className="ac-navcta"
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: C.accent,
            color: C.white,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.16em',
            padding: '12px 20px',
            textTransform: 'uppercase',
          }}
        >
          <Phone size={13} strokeWidth={2} />
          Appel urgent
        </span>
      </a>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ac-burger"
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
          <span style={{ width: 22, height: 2, background: '#1a1a1a', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(0, 7px)' : 'none' }} />
          <span style={{ width: 22, height: 2, background: '#1a1a1a', borderRadius: 1, display: 'block', opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <span style={{ width: 22, height: 2, background: '#1a1a1a', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(0, -7px)' : 'none' }} />
        </button>
        <style>{`
        @media (max-width: 860px){
          .ac-navlinks{ display:none !important; }
          .ac-burger { display: flex !important; flex-direction: column; }
        }
        @media (max-width: 600px){
          .ac-navcta{ display:none !important; }
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
          background: 'rgba(250,248,244,0.98)',
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
                color: '#1a1a1a',
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
        fontWeight: 600,
        color: h ? C.accentLight : 'rgba(255,255,255,0.85)',
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
          height: 1,
          width: h ? '100%' : '0%',
          background: C.accent,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · Hero 100vh, parallaxe scale + imgY
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Photo parallaxe */}
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
          src={ph('1581578485-dea47a32cc3f') + '&w=2000'}
          alt="Plombier Aqua Confort Lyon en intervention"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-hint="high"
        />
      </motion.div>

      {/* Voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(7,16,24,0.50) 0%, rgba(7,16,24,0.10) 35%, rgba(7,16,24,0.55) 70%, rgba(7,16,24,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 70% at 30% 60%, transparent 45%, rgba(7,16,24,0.50) 100%)',
        }}
      />

      {/* Badge urgence top-right */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
        style={{
          position: 'absolute',
          top: 'clamp(80px,10vw,120px)',
          right: 'clamp(20px,5vw,64px)',
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: C.green,
          color: C.white,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          padding: '10px 18px',
          borderRadius: 100,
          boxShadow: '0 8px 32px rgba(45,138,74,0.45)',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#7fff9f',
            display: 'inline-block',
          }}
        />
        Urgence 24h
      </motion.div>

      {/* Titre parallaxe bas-gauche */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 'clamp(48px,8vw,100px)',
          left: 'clamp(20px,5vw,64px)',
          zIndex: 3,
          maxWidth: 720,
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color={C.accentLight} light>
            Plombier-Chauffagiste · Lyon
          </Eyebrow>
        </Reveal>
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.02em',
            margin: 'clamp(16px,2.5vw,28px) 0 clamp(14px,2vw,22px)',
            textShadow: '0 12px 50px rgba(0,0,0,0.55)',
          }}
        >
          Confort garanti{' '}
          <br />
          <span style={{ fontStyle: 'normal', fontWeight: 300, color: C.accentLight }}>
            24h / 7j.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.48 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.7vw,19px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 480,
            lineHeight: 1.65,
            marginBottom: 'clamp(24px,3vw,40px)',
          }}
        >
          Plomberie, chauffage et énergies renouvelables — intervention rapide
          sur Lyon Métropole, devis offert et aides de l&apos;État incluses.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.7 }}
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
        >
          <TealButton filled>Devis gratuit</TealButton>
          <TealButton>Nos services</TealButton>
        </motion.div>
      </motion.div>

      {/* Indice scroll */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
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
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · Intro : phrase SERIF centrée sur bgAlt
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px,12vw,160px) clamp(24px,8vw,140px)',
    textAlign: 'center',
  };
  return (
    <section id="contact" style={sec}>
      <Reveal>
        <Eyebrow color={C.accent} align="center">
          Aqua Confort Lyon
        </Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(22px,3.2vw,44px)',
            lineHeight: 1.35,
            fontWeight: 400,
            maxWidth: 960,
            margin: 'clamp(20px,3vw,32px) auto 0',
            color: C.ink,
          }}
        >
          Votre confort, c&apos;est notre métier.{' '}
          <span style={{ color: C.accent }}>
            Votre facture d&apos;énergie, c&apos;est notre combat.
          </span>
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: 'clamp(40px,5vw,64px) auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · InterventionSequence : crossfade 320vh, bgDark, ProgressDot, label top-right
   ════════════════════════════════════════════════════════════════════════════ */
function InterventionImage({
  iv,
  i,
  total,
  progress,
}: {
  iv: Intervention;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.3;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - fade), start, end - fade, Math.min(1, end)],
    i === 0
      ? [1, 1, 1, 0]
      : i === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fade, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={iv.img}
        alt={iv.title}
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

function InterventionCaption({
  iv,
  i,
  total,
  progress,
}: {
  iv: Intervention;
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
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [28, -28]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: 'clamp(40px,6vw,90px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(44px,8vw,110px)',
          color: 'rgba(14,116,144,0.25)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {iv.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(36px,5.5vw,78px)',
          fontWeight: 600,
          color: C.white,
          lineHeight: 1.02,
          margin: 0,
          textShadow: '0 8px 36px rgba(0,0,0,0.6)',
        }}
      >
        {iv.title}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(14px,1.6vw,18px)',
          color: 'rgba(255,255,255,0.82)',
          marginTop: 14,
          maxWidth: 500,
          lineHeight: 1.65,
        }}
      >
        {iv.body}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 38]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity }}
    />
  );
}

function SectionLabel({
  iv,
  i,
  total,
  progress,
}: {
  iv: Intervention;
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
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 'clamp(80px,10vw,120px)',
        right: 'clamp(20px,4vw,60px)',
        opacity,
        textAlign: 'right',
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: C.accentLight,
          fontWeight: 700,
        }}
      >
        {iv.label}
      </div>
    </motion.div>
  );
}

function InterventionSequence() {
  const n = INTERVENTIONS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="services"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Photos crossfade */}
        {INTERVENTIONS.map((iv, i) => (
          <InterventionImage
            key={iv.index}
            iv={iv}
            i={i}
            total={INTERVENTIONS.length}
            progress={progress}
          />
        ))}

        {/* Voile bas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(7,16,24,0.35) 0%, transparent 28%, rgba(7,16,24,0.72) 70%, rgba(7,16,24,0.92) 100%)',
          }}
        />

        {/* Légendes animées */}
        {INTERVENTIONS.map((iv, i) => (
          <InterventionCaption
            key={iv.index}
            iv={iv}
            i={i}
            total={INTERVENTIONS.length}
            progress={progress}
          />
        ))}

        {/* Labels section top-right */}
        {INTERVENTIONS.map((iv, i) => (
          <SectionLabel
            key={iv.index}
            iv={iv}
            i={i}
            total={INTERVENTIONS.length}
            progress={progress}
          />
        ))}

        {/* Dots de progression teal */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(28px,4vw,50px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
          }}
        >
          {INTERVENTIONS.map((iv, i) => (
            <ProgressDot
              key={iv.index}
              i={i}
              total={INTERVENTIONS.length}
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
   4 · ServiceCards : 6 cards, border-left teal, hover lift
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ svc, i }: { svc: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    borderLeft: `3px solid ${hover ? C.accent : C.accentLight}`,
    padding: 'clamp(24px,3vw,36px)',
    boxShadow: hover
      ? '0 28px 60px -20px rgba(14,116,144,0.20)'
      : '0 6px 24px -12px rgba(7,16,24,0.10)',
    transform: hover ? 'translateY(-8px)' : 'none',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    cursor: 'default',
    height: '100%',
    boxSizing: 'border-box',
  };
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            color: hover ? C.accent : C.textFaint,
            transition: 'color .4s',
          }}
        >
          {svc.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(18px,2vw,22px)',
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {svc.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 14.5,
            lineHeight: 1.65,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {svc.desc}
        </p>
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: hover ? C.accent : C.textFaint,
            transition: 'color .4s',
          }}
        >
          En savoir plus
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(5px)' : 'none',
              transition: 'transform .4s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
      </article>
    </Reveal>
  );
}

function ServiceCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,150px) clamp(20px,5vw,80px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(16px,2.4vw,32px)',
    maxWidth: 1280,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1280, margin: '0 auto clamp(48px,6vw,72px)' }}>
        <Reveal>
          <Eyebrow>Nos prestations</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.4vw,60px)',
              fontWeight: 600,
              color: C.ink,
              margin: 'clamp(14px,2vw,22px) 0 0',
              lineHeight: 1.06,
            }}
          >
            Tous vos besoins,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              un seul artisan.
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} svc={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · EditorialRows : 2 rangées image/texte alternées, ghost numéraux
   ════════════════════════════════════════════════════════════════════════════ */
function EditRowItem({ row }: { row: EditRow }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(32px,5.5vw,80px)',
    alignItems: 'center',
    position: 'relative',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '5 / 6',
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };
  return (
    <div style={wrap} className="ac-editrow">
      <Reveal y={48} style={imgWrap}>
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>
      <div style={txt}>
        {/* Ghost numeral */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -40,
            right: row.reverse ? 'auto' : -20,
            left: row.reverse ? -20 : 'auto',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(80px,12vw,160px)',
            lineHeight: 1,
            color: C.green,
            opacity: 0.1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {row.ghost}
        </div>
        <Reveal>
          <Eyebrow color={C.accent}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(26px,3.8vw,52px)',
              fontWeight: 600,
              color: C.ink,
              margin: 'clamp(14px,2vw,22px) 0 clamp(16px,2.2vw,26px)',
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 'clamp(15px,1.55vw,17.5px)',
              lineHeight: 1.75,
              color: C.textMuted,
              maxWidth: 460,
            }}
          >
            {row.body}
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <div style={{ marginTop: 'clamp(22px,3vw,36px)' }}>
            <TealButton dark>En savoir plus</TealButton>
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px){
          .ac-editrow{ grid-template-columns: 1fr !important; }
          .ac-editrow > *{ order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,10vw,140px) clamp(20px,5vw,80px)',
  };
  return (
    <section style={sec} id="engagement">
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,10vw,130px)',
        }}
      >
        {EDIT_ROWS.map((r) => (
          <EditRowItem key={r.eyebrow} row={r} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · CertPanel : bgDark, image gauche sticky, 4 certifs droite avec dividers
   ════════════════════════════════════════════════════════════════════════════ */
function CertPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(20px,5vw,80px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1280,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickySide: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="certifications">
      <div style={grid} className="ac-certpanel">
        {/* Image gauche collante */}
        <div style={stickySide} className="ac-certpanel-sticky">
          <Reveal>
            <div
              style={{
                overflow: 'hidden',
                border: `1px solid ${C.borderDark}`,
                aspectRatio: '4 / 5',
              }}
            >
              <img
                src={ph('1585771724684-38269d6639fd') + '&w=900'}
                alt="Technicien certifié RGE Aqua Confort Lyon"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              style={{
                marginTop: 22,
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: C.textFaint,
              }}
            >
              Certifications · Aqua Confort Lyon
            </div>
          </Reveal>
        </div>

        {/* Certifications défilantes droite */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight} light>
              Qualifications officielles
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px,4vw,56px)',
                fontWeight: 600,
                color: C.white,
                margin: 'clamp(14px,2vw,24px) 0 clamp(32px,4vw,56px)',
                lineHeight: 1.06,
              }}
            >
              Des garanties{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                vérifiables.
              </span>
            </h2>
          </Reveal>
          <div>
            {CERTS.map((cert, i) => (
              <Reveal key={cert.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(24px,3vw,36px) 0',
                    borderTop: `1px solid rgba(14,116,144,0.28)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,40px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px,2.5vw,30px)',
                      color: C.green,
                      minWidth: 36,
                      lineHeight: 1,
                    }}
                  >
                    {cert.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SANS,
                        fontWeight: 700,
                        fontSize: 'clamp(15px,1.6vw,18px)',
                        color: C.white,
                        margin: '0 0 8px',
                      }}
                    >
                      {cert.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(13px,1.3vw,15px)',
                        lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.60)',
                        margin: 0,
                      }}
                    >
                      {cert.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            {/* Dernier divider bas */}
            <div
              style={{
                borderTop: '1px solid rgba(14,116,144,0.28)',
              }}
            />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .ac-certpanel{ grid-template-columns: 1fr !important; }
          .ac-certpanel-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · Testimonials : bgAlt, Shield teal, quote SERIF italic
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px,11vw,150px) clamp(20px,5vw,80px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(24px,3.5vw,48px)',
    maxWidth: 1280,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1280, margin: '0 auto clamp(48px,6vw,72px)', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.accent} align="center">
            Témoignages clients
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,4vw,56px)',
              fontWeight: 600,
              color: C.ink,
              margin: 'clamp(14px,2vw,22px) 0 0',
              lineHeight: 1.08,
            }}
          >
            Ils nous font{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              confiance.
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
                padding: 'clamp(28px,3.5vw,44px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 16px 48px -32px rgba(14,116,144,0.25)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Shield
                size={32}
                color={C.accent}
                strokeWidth={1.4}
                style={{ marginBottom: 20 }}
              />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(16px,1.7vw,20px)',
                  lineHeight: 1.62,
                  color: C.ink,
                  margin: '0 0 clamp(24px,3vw,36px)',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 15,
                    color: C.ink,
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
                    marginTop: 5,
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
   8 · QuoteForm : bgDark, 720px, état envoyé rassurant
   ════════════════════════════════════════════════════════════════════════════ */
function QuoteForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [type, setType] = useState('');
  const [cp, setCp] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(20px,5vw,80px)',
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid rgba(14,116,144,0.30)`,
    borderRadius: 0,
    padding: '14px 16px',
    fontFamily: SANS,
    fontWeight: 400,
    fontSize: 15,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: C.accentLight,
    display: 'block',
    marginBottom: 7,
  };

  const TYPES = [
    'Fuite',
    'Chauffe-eau',
    'Chaudière',
    'Pompe à chaleur',
    'Climatisation',
    'Autre',
  ];

  return (
    <section style={sec} id="devis">
      {/* Texture BG */}
      <img
        src={ph('1621905252507-b35492cc74b4')}
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
          <Eyebrow color={C.accentLight} align="center" light>
            Devis gratuit
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.5vw,62px)',
              fontWeight: 600,
              color: C.white,
              margin: 'clamp(14px,2vw,22px) 0 clamp(10px,1.5vw,18px)',
              lineHeight: 1.06,
            }}
          >
            Votre projet,{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              notre réponse.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(14px,1.5vw,17px)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.70)',
              maxWidth: 500,
              margin: '0 auto clamp(36px,4.5vw,56px)',
            }}
          >
            Remplissez ce formulaire — un technicien Aqua Confort vous rappelle
            dans les 2 heures pour étudier votre demande.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(14,116,144,0.45)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(14,116,144,0.08)',
                textAlign: 'center',
              }}
            >
              <CheckCircle2
                size={40}
                color={C.accent}
                strokeWidth={1.4}
                style={{ marginBottom: 18 }}
              />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(22px,2.8vw,34px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 12px',
                }}
              >
                Merci {prenom && <strong style={{ color: C.accentLight, fontStyle: 'normal' }}>{prenom}</strong>}{prenom ? ',' : ''} c&apos;est noté.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.70)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Un technicien vous rappelle dans les 2h à{' '}
                <strong style={{ color: C.accentLight, fontWeight: 600 }}>
                  {email}
                </strong>
                {tel ? ` ou au ${tel}` : ''}.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <form
              onSubmit={onSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(16px,2vw,22px)',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px,1.8vw,20px)' }} className="ac-form-2col">
                <div>
                  <label style={labelStyle} htmlFor="ac-prenom">
                    Prénom *
                  </label>
                  <input
                    id="ac-prenom"
                    required
                    style={fieldStyle}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Votre prénom"
                    autoComplete="given-name"
                    onFocus={(e) => (e.target.style.borderColor = C.accent)}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(14,116,144,0.30)')}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ac-email">
                    E-mail *
                  </label>
                  <input
                    id="ac-email"
                    required
                    type="email"
                    style={fieldStyle}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.fr"
                    autoComplete="email"
                    onFocus={(e) => (e.target.style.borderColor = C.accent)}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(14,116,144,0.30)')}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px,1.8vw,20px)' }} className="ac-form-2col">
                <div>
                  <label style={labelStyle} htmlFor="ac-tel">
                    Téléphone
                  </label>
                  <input
                    id="ac-tel"
                    type="tel"
                    style={fieldStyle}
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="06 00 00 00 00"
                    autoComplete="tel"
                    onFocus={(e) => (e.target.style.borderColor = C.accent)}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(14,116,144,0.30)')}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ac-cp">
                    Code postal
                  </label>
                  <input
                    id="ac-cp"
                    style={fieldStyle}
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                    placeholder="69007"
                    autoComplete="postal-code"
                    onFocus={(e) => (e.target.style.borderColor = C.accent)}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(14,116,144,0.30)')}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="ac-type">
                  Type d&apos;intervention
                </label>
                <select
                  id="ac-type"
                  style={{
                    ...fieldStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: type ? C.white : 'rgba(255,255,255,0.40)',
                  }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = C.accent)}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(14,116,144,0.30)')}
                >
                  <option value="" style={{ color: C.ink }}>
                    Choisir…
                  </option>
                  {TYPES.map((t) => (
                    <option key={t} value={t} style={{ color: C.ink }}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="ac-message">
                  Message
                </label>
                <textarea
                  id="ac-message"
                  rows={4}
                  style={{
                    ...fieldStyle,
                    resize: 'vertical',
                    minHeight: 100,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez brièvement votre problème ou projet…"
                  onFocus={(e) => (e.target.style.borderColor = C.accent)}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(14,116,144,0.30)')}
                />
              </div>

              <div style={{ textAlign: 'center', paddingTop: 6 }}>
                <TealButton filled type="submit">
                  Envoyer ma demande
                </TealButton>
              </div>
              <p
                style={{
                  textAlign: 'center',
                  fontFamily: SANS,
                  fontSize: 11.5,
                  color: 'rgba(255,255,255,0.38)',
                  margin: 0,
                }}
              >
                Réponse garantie sous 2h · Devis 100 % gratuit et sans engagement
              </p>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .ac-form-2col{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · Footer : bgDarkAlt, 4 colonnes, teal headers
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Nos services',
      items: [
        { label: 'Dépannage urgent', href: '#services' },
        { label: 'Chauffe-eau', href: '#services' },
        { label: 'Chaudière gaz', href: '#services' },
        { label: 'Pompe à chaleur', href: '#services' },
        { label: 'Climatisation', href: '#services' },
      ],
    },
    {
      title: 'Engagements',
      items: [
        { label: 'Réactivité 2h', href: '#engagement' },
        { label: 'Prix transparents', href: '#engagement' },
        { label: "Aides de l'État", href: '#engagement' },
        { label: 'Garantie décennale', href: '#certifications' },
      ],
    },
    {
      title: 'Certifications',
      items: [
        { label: 'RGE QualiPAC', href: '#certifications' },
        { label: 'Qualibois', href: '#certifications' },
        { label: 'IRVE', href: '#certifications' },
        { label: 'CONSUEL', href: '#certifications' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(14,116,144,0.18)`,
    padding:
      'clamp(64px,8vw,100px) clamp(20px,5vw,80px) clamp(32px,4vw,48px)',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px,4.5vw,64px)',
        }}
        className="ac-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 20,
              fontWeight: 800,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" stroke={C.accent} strokeWidth="1.5" />
              <path d="M13 7v6l4 3" stroke={C.accentLight} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Aqua Confort
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14.5,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 300,
              marginBottom: 22,
            }}
          >
            Plombier-Chauffagiste & Énergies Renouvelables. Certifié RGE.
            Intervention rapide sur Lyon Métropole.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <a
              href="tel:0400000000"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 700,
                color: C.accentLight,
                textDecoration: 'none',
              }}
            >
              <Phone size={13} strokeWidth={2} />
              04 00 00 00 00
            </a>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.50)',
              }}
            >
              <MapPin size={13} color={C.accent} strokeWidth={1.5} />
              Lyon 7e · Villeurbanne · Bron · Vénissieux
            </div>
          </div>
        </div>

        {/* Colonnes liens */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: C.accent,
                marginBottom: 20,
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
                gap: 11,
              }}
            >
              {c.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SANS,
                      fontSize: 14,
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.60)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color =
                        'rgba(255,255,255,0.60)')
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

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: 'clamp(48px,6vw,72px) auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(14,116,144,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.35)',
        }}
      >
        <span>
          © 2026 Aqua Confort Lyon — SIRET 000 000 000 00000 · RGE certifié
        </span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="/templates/impact-260" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="/templates/impact-260" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
          <a href="/templates/impact-260" style={{ color: 'inherit', textDecoration: 'none' }}>
            Cookies
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px){
          .ac-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px){
          .ac-footgrid{ grid-template-columns: 1fr !important; }
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
  };

  return (
    <main style={root} suppressHydrationWarning>
      {/* Google Fonts */}
      <style>{`@import url('${FONT_URL}');`}</style>

      <Nav />
      <Hero />
      <Intro />
      <InterventionSequence />
      <ServiceCards />
      <EditorialRows />
      <CertPanel />
      <Testimonials />
      <QuoteForm />
      <Footer />

      {/* Responsive global */}
      <style>{`
        *,*::before,*::after{ box-sizing: border-box; }
        html{ scroll-behavior: smooth; }
        img{ display: block; }

        /* Prevent iOS zoom on inputs */
        @media (max-width: 860px){
          input, select, textarea{ font-size: 16px !important; }
        }

        /* Interventions label hidden on small screens */
        @media (max-width: 600px){
          .ac-intervention-label{ display: none !important; }
        }
      `}</style>
    </main>
  );
}
