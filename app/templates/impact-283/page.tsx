"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
  useMotionValue,
} from 'framer-motion';
import {
  Activity,
  Wind,
  Brain,
  ArrowRight,
  Star,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  CreditCard,
  FileText,
  Droplets,
  Zap,
  Dumbbell,
  PersonStanding,
  ChevronDown,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { resolveList } from "@/lib/templates/resolveList";

/* ════════════════════════════════════════════════════════════════════════════
   KINÉSITHÉRAPIE DU LANGUEDOC — Cabinet kiné & rééducation · Montpellier Antigone
   Palette méditerranéenne · Typographie Merriweather + Inter · Autonome.
   ════════════════════════════════════════════════════════════════════════════ */

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
  blue: '#1a5f7a',
  blueDeep: '#134657',
  blueMid: '#226e8a',
  blueLight: '#2a7d9c',
  sand: '#f2e8d5',
  sandDeep: '#e8d9be',
  sandLight: '#f8f2e8',
  turq: '#4ecdc4',
  turqLight: '#6ed8d1',
  turqDeep: '#3bb8b0',
  dark: '#2c3e50',
  darkMid: '#3d5166',
  white: '#ffffff',
  offWhite: '#fafaf8',
  textBody: '#374151',
  textMuted: '#6b7280',
  border: 'rgba(26,95,122,0.15)',
};

/* ── Typographie ─────────────────────────────────────────────────────────── */
const SERIF = "'Merriweather', Georgia, serif" as const;
const SANS = "'Inter', system-ui, sans-serif" as const;

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const PHOTO = {
  cabinet:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop',
  reeducation:
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop',
  therapeute:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1600&auto=format&fit=crop',
  balnео:
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1600&auto=format&fit=crop',
  team1:
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
  team2:
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&auto=format&fit=crop',
  team3:
    'https://images.unsplash.com/photo-1559839914-17aae19cec71?q=80&w=800&auto=format&fit=crop',
  massage:
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1600&auto=format&fit=crop',
};

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, filet turquoise. */
function Eyebrow({
  children,
  color = C.turq,
  align = 'left',
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
}) {
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 40,
    height: 1,
    background: color,
    opacity: 0.8,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.36em',
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

/** Révélation au scroll : fondu + translation verticale. */
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

/** Bouton principal — bleu méditerranéen avec flèche animée. */
function PrimaryButton({
  children,
  onClick,
  type = 'button',
  filled = true,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  filled?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '15px 32px',
    fontFamily: SANS,
    fontSize: 13,
    letterSpacing: '0.08em',
    fontWeight: 600,
    cursor: 'pointer',
    border: `2px solid ${C.blue}`,
    borderRadius: 4,
    background: filled ? C.blue : 'transparent',
    color: filled ? C.white : C.blue,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.blueDeep, borderColor: C.blueDeep, transform: 'translateY(-2px)' }
      : { background: 'rgba(26,95,122,0.08)', transform: 'translateY(-2px)' }
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
        size={16}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/** Étoiles de notation. */
function Stars({ n = 5 }: { n?: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < n ? C.turq : 'none'}
          color={i < n ? C.turq : C.textMuted}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Navigation fixe : transparente → bleu foncé au scroll
   ════════════════════════════════════════════════════════════════════════════ */
function NavSection() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Spécialités', href: '#specialites' },
    { label: 'Techniques', href: '#techniques' },
    { label: 'Équipe', href: '#equipe' },
    { label: 'Cabinet', href: '#materiel' },
    { label: 'Infos pratiques', href: '#pratique' },
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
    padding: solid ? '14px clamp(20px,5vw,64px)' : '22px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(20,52,68,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(120%)' : 'none',
    borderBottom: solid ? `1px solid rgba(78,205,196,0.20)` : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 17,
    letterSpacing: '0.04em',
    color: C.white,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2vw,34px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
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
            <Activity size={20} color={C.turq} strokeWidth={2} />{fd?.businessName ?? "Kinésithérapie du Languedoc"}
          </>
        )}
      </a>
      <div style={linkRow} className="r283-navlinks">
        {links.map((l) => (
          <NavLink283 key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r283-navcta">
        <a href="#rdv" style={{ textDecoration: 'none' }}>
          <PrimaryButton>Prendre RDV</PrimaryButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r283-burger"
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
          .r283-navlinks { display: none !important; }
          .r283-burger { display: flex !important; flex-direction: column; }
          .r283-navcta { display: none !important; }
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

function NavLink283({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SANS,
        fontSize: 13,
        letterSpacing: '0.04em',
        color: h ? C.turqLight : 'rgba(255,255,255,0.88)',
        textDecoration: 'none',
        transition: 'color .35s',
        position: 'relative',
        paddingBottom: 3,
        fontWeight: 500,
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
          background: C.turq,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO SECTION — lumineux méditerranéen
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(progress, [0, 1], [1, 1.10]);
  const imgY = useTransform(progress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(progress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(progress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(progress, [0, 0.15], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.blueDeep,
  };

  return (
    <section id="hero" ref={ref} style={section}>
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
          src={PHOTO.cabinet}
          alt="Cabinet de kinésithérapie moderne Montpellier Antigone"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile principal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(19,70,87,0.55) 0%, rgba(19,70,87,0.15) 40%, rgba(19,70,87,0.50) 72%, rgba(19,70,87,0.92) 100%)',
        }}
      />
      {/* Voile radial latéral */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 60% 40%, transparent 35%, rgba(26,95,122,0.50) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Contenu centré */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color={C.turqLight} align="center">
            Cabinet kiné & rééducation · Montpellier Antigone
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.18 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            color: C.white,
            fontSize: 'clamp(40px, 7.5vw, 110px)',
            lineHeight: 1.06,
            letterSpacing: '-0.02em',
            margin: '28px 0 20px',
            textShadow: '0 8px 48px rgba(0,0,0,0.45)',
            maxWidth: 820,
          }}
        >
          Retrouver le{' '}
          <span style={{ fontStyle: 'italic', color: C.turqLight }}>
            mouvement
          </span>
          ,{' '}
          <br />
          retrouver la{' '}
          <span style={{ fontStyle: 'italic', color: C.turqLight }}>vie</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(15px, 1.8vw, 19px)',
            color: 'rgba(242,232,213,0.90)',
            maxWidth: 540,
            lineHeight: 1.7,
            marginBottom: 40,
            fontWeight: 400,
          }}
        >
          Kinésithérapeutes diplômés d'État, spécialisés en rééducation
          orthopédique, respiratoire et neurologique. Équipements de pointe au
          cœur du quartier Antigone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.64 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href="#rdv" style={{ textDecoration: 'none' }}>
            <PrimaryButton>Prendre RDV</PrimaryButton>
          </a>
          <a href="#specialites" style={{ textDecoration: 'none' }}>
            <PrimaryButton filled={false}>
              <span style={{ color: C.white }}>Nos spécialités</span>
            </PrimaryButton>
          </a>
        </motion.div>

        {/* Badges de confiance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.90 }}
          style={{
            marginTop: 52,
            display: 'flex',
            gap: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { val: '15+', label: "années d'expérience" },
            { val: '3', label: 'kinésithérapeutes' },
            { val: 'Secteur 1 & 2', label: 'remboursé SS' },
          ].map((b) => (
            <div key={b.val} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(22px,3.5vw,36px)',
                  color: C.turqLight,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {b.val}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  color: 'rgba(242,232,213,0.75)',
                  letterSpacing: '0.05em',
                  marginTop: 5,
                }}
              >
                {b.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Cue scroll */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          opacity: cueOpacity,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} color="rgba(242,232,213,0.6)" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · SCROLL CROSSFADE — 320vh sticky, 3 visuels avec ProgressDots
   ════════════════════════════════════════════════════════════════════════════ */
function ScrollCrossfade() {
  
const n = 3;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  // Opacités des 3 images
  const opacity0 = useTransform(progress, [0, 0.28, 0.38], [1, 1, 0]);
  const opacity1 = useTransform(progress, [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0]);
  const opacity2 = useTransform(progress, [0.62, 0.72, 1], [0, 1, 1]);

  // Dot actif
  const dotIndex = useTransform(progress, [0, 0.38, 0.72, 1], [0, 1, 1, 2]);

  const slides = [
    {
      src: PHOTO.balnео,
      alt: 'Balnéothérapie — piscine thérapeutique',
      title: 'Balnéothérapie',
      sub: "La puissance thérapeutique de l'eau pour une rééducation douce et efficace. Nos bassins chauffés accompagnent votre récupération à chaque séance.",
    },
    {
      src: PHOTO.reeducation,
      alt: 'Rééducation fonctionnelle guidée par kiné',
      title: 'Rééducation fonctionnelle',
      sub: "Protocoles personnalisés conçus pour restaurer mobilité, force et autonomie — du post-opératoire au retour à l'activité sportive.",
    },
    {
      src: PHOTO.therapeute,
      alt: 'Électrothérapie et soins paramédicaux',
      title: 'Électrothérapie',
      sub: 'Stimulations électriques ciblées pour soulager la douleur, accélérer la cicatrisation et activer la régénération musculaire.',
    },
  ];


  const opacities = [opacity0, opacity1, opacity2];

  return (
    <div style={{ height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          background: C.dark,
        }}
      >
        {/* Images empilées */}
        {slides.map((s, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: opacities[i],
            }}
          >
            <img
              src={s.src}
              alt={s.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, rgba(26,95,122,0.88) 0%, rgba(26,95,122,0.45) 55%, transparent 100%)',
              }}
            />
            {/* Texte de la slide */}
            <div
              style={{
                position: 'absolute',
                left: 'clamp(28px,8vw,100px)',
                top: '50%',
                transform: 'translateY(-50%)',
                maxWidth: 480,
                zIndex: 2,
              }}
            >
              <Eyebrow color={C.turqLight} align="left">
                {`0${i + 1} / 03`}
              </Eyebrow>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(32px, 5.5vw, 72px)',
                  color: C.white,
                  fontWeight: 700,
                  margin: '20px 0 18px',
                  lineHeight: 1.12,
                  letterSpacing: '-0.02em',
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(15px,1.6vw,18px)',
                  color: 'rgba(242,232,213,0.88)',
                  lineHeight: 1.7,
                }}
              >
                {s.sub}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Progress Dots */}
        <motion.div
          style={{
            position: 'absolute',
            right: 36,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            zIndex: 10,
          }}
        >
          {slides.map((_, i) => {
            return (
              <ProgressDot
                key={i}
                index={i}
                dotIndex={dotIndex}
              />
            );
          })}
        </motion.div>
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
  );
}

function ProgressDot({
  index,
  dotIndex,
}: {
  index: number;
  dotIndex: MotionValue<number>;
}) {
  const [active, setActive] = useState(false);
  React.useEffect(() => {
    const unsub = dotIndex.on('change', (v: number) => {
      setActive(Math.round(v) === index);
    });
    return unsub;
  }, [dotIndex, index]);

  return (
    <div
      style={{
        width: active ? 10 : 7,
        height: active ? 10 : 7,
        borderRadius: '50%',
        background: active ? C.turq : 'rgba(255,255,255,0.40)',
        transition: 'all .4s cubic-bezier(.16,1,.3,1)',
        boxShadow: active ? `0 0 0 3px rgba(78,205,196,0.28)` : 'none',
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · SPÉCIALITÉS — 3 cartes avec icônes Lucide
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialitesSection() {
  const specs = [
    {
      icon: Activity,
      title: 'Rééducation orthopédique',
      sub: 'Post-opératoire & traumatologie',
      desc: "Prise en charge complète après chirurgies (prothèse de hanche, genou, ligaments), fractures, entorses et pathologies musculo-squelettiques. Protocoles adaptés de la phase aiguë au retour à l'activité physique.",
      highlights: ['Prothèse de genou & hanche', 'Ligamentoplasties', 'Fractures & entorses', 'Tendinopathies chroniques'],
    },
    {
      icon: Wind,
      title: 'Kinésithérapie respiratoire',
      sub: 'Drainage & réentraînement',
      desc: "Techniques de drainage bronchique, désencombrement des voies aériennes et réentraînement à l'effort pour patients BPCO, asthmatiques, mucoviscidose ou en post-COVID. Prise en charge de tous âges.",
      highlights: ["BPCO & emphysème', 'Post-COVID pulmonaire', 'Mucoviscidose', 'Réentraînement à l'effort"],
    },
    {
      icon: Brain,
      title: 'Rééducation neurologique',
      sub: 'AVC · SEP · Parkinson',
      desc: 'Accompagnement spécialisé des patients présentant des séquelles neurologiques : AVC, sclérose en plaques, maladie de Parkinson, traumatismes crâniens. Approche pluridisciplinaire et travail de la plasticité cérébrale.',
      highlights: ["Rééducation post-AVC', 'Sclérose en plaques', 'Maladie de Parkinson', 'Troubles de l'équilibre"],
    },
  ];

  return (
    <section
      id="specialites"
      style={{
        background: C.sandLight,
        padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,64px)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow color={C.blue} align="center">
            Nos domaines d'expertise
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4.5vw, 54px)',
              color: C.dark,
              fontWeight: 700,
              textAlign: 'center',
              margin: '18px 0 16px',
              letterSpacing: '-0.02em',
              lineHeight: 1.18,
            }}
          >
            Trois spécialités,{' '}
            <span style={{ color: C.blue, fontStyle: 'italic' }}>
              une expertise
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 17,
              color: C.textMuted,
              textAlign: 'center',
              maxWidth: 560,
              margin: '0 auto 56px',
              lineHeight: 1.7,
            }}
          >
            Chaque patient est unique. Nos kinésithérapeutes élaborent un
            programme de soins personnalisé en lien avec votre médecin prescripteur.
          </p>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 28,
          }}
        >
          {specs.map((sp, i) => (
            <SpecCard key={sp.title} spec={sp} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecCard({
  spec,
  delay,
}: {
  spec: {
    icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
    title: string;
    sub: string;
    desc: string;
    highlights: string[];
  };
  delay: number;
}) {
  const [hover, setHover] = useState(false);
  const Icon = spec.icon;

  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.white,
          border: `1px solid ${hover ? C.blue : C.border}`,
          borderRadius: 12,
          padding: '36px 32px',
          cursor: 'default',
          transition: 'all .4s cubic-bezier(.16,1,.3,1)',
          boxShadow: hover
            ? '0 16px 48px rgba(26,95,122,0.14)'
            : '0 2px 12px rgba(26,95,122,0.06)',
          transform: hover ? 'translateY(-4px)' : 'none',
        }}
      >
        {/* Icône */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: hover ? C.blue : 'rgba(26,95,122,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 22,
            transition: 'background .4s',
          }}
        >
          <Icon
            size={26}
            color={hover ? C.white : C.blue}
            strokeWidth={1.8}
          />
        </div>
        {/* Texte */}
        <p
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: C.turq,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          {spec.sub}
        </p>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            color: C.dark,
            fontWeight: 700,
            marginBottom: 14,
            lineHeight: 1.3,
          }}
        >
          {spec.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 15,
            color: C.textBody,
            lineHeight: 1.68,
            marginBottom: 22,
          }}
        >
          {spec.desc}
        </p>
        {/* Highlights */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {spec.highlights.map((h) => (
            <li
              key={h}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: SANS,
                fontSize: 13,
                color: C.textMuted,
                marginBottom: 7,
              }}
            >
              <CheckCircle size={14} color={C.turq} strokeWidth={2} />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · TECHNIQUE SECTION — left sticky photo + right scroll 4 techniques
   ════════════════════════════════════════════════════════════════════════════ */
function TechniqueSection() {
  const techniques = [
    {
      icon: PersonStanding,
      number: '01',
      title: 'Massages thérapeutiques',
      desc: 'Techniques manuelles approfondies — pétrissage, effleurage, frictions et mobilisations — pour libérer les tensions, améliorer la circulation et réduire les douleurs myofasciales. Chaque massage est adapté à votre pathologie et à votre sensibilité.',
      detail: 'Massage transverse profond · Drainage lymphatique · Techniques myofasciales · Trigger points',
    },
    {
      icon: Zap,
      number: '02',
      title: 'Électrothérapie',
      desc: 'Utilisation de courants électriques thérapeutiques (TENS, ionophorèse, ultrasons) pour antalgie, renforcement musculaire et cicatrisation. Nos appareils de dernière génération permettent un paramétrage précis selon votre protocole.',
      detail: 'TENS antalgique · Électrostimulation musculaire · Ultrasons · Ionophorèse',
    },
    {
      icon: Droplets,
      number: '03',
      title: 'Balnéothérapie',
      desc: "Rééducation en milieu aquatique dans notre bain à remous professionnel. La chaleur de l'eau (35–37 °C) et la poussée d'Archimède permettent des mobilisations impossibles à sec, idéales en phase post-opératoire précoce.",
      detail: 'Bain à jets · Hydrokinésithérapie · Rééducation aquatique · Relaxation musculaire',
    },
    {
      icon: Dumbbell,
      number: '04',
      title: 'Exercices actifs',
      desc: "Programmes de renforcement musculaire, proprioception et réathlétisation sur plateau de rééducation, tapis roulant instrumenté et équipements isocinétiques. L'objectif : vous rendre autonome et prévenir les récidives.",
      detail: 'Proprioception · Renforcement isocinétique · Réathlétisation · Bilan fonctionnel',
    },
  ];

  return (
    <section
      id="techniques"
      style={{
        background: C.white,
        padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,64px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow color={C.blue} align="left">
            Nos techniques de soin
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,4.5vw,52px)',
              color: C.dark,
              fontWeight: 700,
              margin: '18px 0 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              maxWidth: 520,
            }}
          >
            Des soins{' '}
            <span style={{ color: C.blue, fontStyle: 'italic' }}>
              fondés sur la science
            </span>
          </h2>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            marginTop: 56,
          }}
          className="r283-tech-grid"
        >
          {/* Left — photo sticky */}
          <div className="r283-tech-sticky-col">
            <div
              style={{
                position: 'sticky',
                top: 100,
                borderRadius: 16,
                overflow: 'hidden',
                aspectRatio: '4/5',
                boxShadow: '0 24px 64px rgba(26,95,122,0.18)',
              }}
            >
              <img
                src={PHOTO.therapeute}
                alt="Kinésithérapeute en séance de massage thérapeutique"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Badge flottant */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 28,
                  left: 28,
                  right: 28,
                  background: 'rgba(26,95,122,0.92)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <CheckCircle size={22} color={C.turq} strokeWidth={2} />
                <div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 13,
                      color: C.white,
                      fontWeight: 600,
                    }}
                  >
                    Kinésithérapeutes D.E.
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.70)',
                    }}
                  >
                    Diplômés d'État · Formation continue
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — scroll de techniques */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
            {techniques.map((t, i) => (
              <TechCard key={t.title} tech={t} delay={i * 0.10} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r283-tech-grid { grid-template-columns: 1fr !important; }
          .r283-tech-sticky-col { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function TechCard({
  tech,
  delay,
}: {
  tech: {
    icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
    number: string;
    title: string;
    desc: string;
    detail: string;
  };
  delay: number;
}) {
  const Icon = tech.icon;
  const [hover, setHover] = useState(false);

  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          gap: 22,
          padding: '28px 24px',
          borderLeft: `3px solid ${hover ? C.turq : C.border}`,
          transition: 'border-color .4s',
          cursor: 'default',
        }}
      >
        {/* Numéro + icône */}
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 10,
              background: hover ? C.blue : 'rgba(26,95,122,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background .4s',
            }}
          >
            <Icon
              size={24}
              color={hover ? C.white : C.blue}
              strokeWidth={1.8}
            />
          </div>
        </div>
        {/* Texte */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              color: C.turq,
              letterSpacing: '0.22em',
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Technique {tech.number}
          </div>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              color: C.dark,
              fontWeight: 700,
              marginBottom: 10,
              lineHeight: 1.3,
            }}
          >
            {tech.title}
          </h3>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              color: C.textBody,
              lineHeight: 1.68,
              marginBottom: 12,
            }}
          >
            {tech.desc}
          </p>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 12.5,
              color: C.turqDeep,
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            {tech.detail}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TÉMOIGNAGES — 3 patients avec étoiles et durée de suivi
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const testimonials_demo = [
    {
      name: 'Martine D.',
      age: '62 ans',
      motif: 'Post-opératoire genou',
      duree: '4 mois de suivi',
      stars: 5,
      text: "Après ma prothèse de genou, j'étais inquiète de ne jamais retrouver ma mobilité. L'équipe du cabinet m'a accompagnée avec une patience et un professionnalisme exceptionnels. Au bout de quatre mois, je marche sans canne et je fais à nouveau mon jardin. Je recommande sans hésiter.",
    },
    {
      name: 'Karim B.',
      age: '41 ans',
      motif: 'Hernie discale L4-L5',
      duree: '6 semaines de suivi',
      stars: 5,
      text: "Les douleurs lombaires me paralysaient depuis deux ans. Grâce aux techniques manuelles et aux exercices prescrits par mon kiné, j'ai pu reprendre le travail et même le sport. La prise en charge est vraiment individualisée — on ne se sent pas un numéro. Merci à toute l'équipe.",
    },
    {
      name: 'Claudine R.',
      age: '71 ans',
      motif: 'Séquelles AVC',
      duree: '8 mois de suivi',
      stars: 5,
      text: "Suite à mon AVC, j'ai retrouvé dans ce cabinet une équipe spécialisée en neurologie qui a cru en ma récupération quand moi-même j'en doutais. La progression a été lente mais régulière. Aujourd'hui je marche sans aide technique et je regagne en autonomie chaque semaine.",
    },
  ];
  const testimonials = resolveList(
    bp?.reputation?.featuredReviews?.map((r: any) => ({
      name: r.name ?? r.author,
      age: undefined,
      motif: undefined,
      duree: undefined,
      stars: r.stars ?? r.rating ?? 5,
      text: r.text ?? r.quote,
    })),
    testimonials_demo
  );

  return (
    <section
      style={{
        background: C.blue,
        padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,64px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fond décoratif */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'rgba(78,205,196,0.08)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Eyebrow color={C.turqLight} align="center">
            Ce que disent nos patients
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(26px,4vw,48px)',
              color: C.white,
              fontWeight: 700,
              textAlign: 'center',
              margin: '18px 0 52px',
              letterSpacing: '-0.02em',
            }}
          >
            Des{' '}
            <span style={{ fontStyle: 'italic', color: C.turqLight }}>
              résultats concrets
            </span>
            , des vies changées
          </h2>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 24,
          }}
        >
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.14}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 14,
                  padding: '32px 28px',
                }}
              >
                {/* Étoiles */}
                <Stars n={t.stars} />

                {/* Texte */}
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 15,
                    color: 'rgba(242,232,213,0.92)',
                    lineHeight: 1.72,
                    margin: '20px 0 24px',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Patient info */}
                <div
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.12)',
                    paddingTop: 18,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 14,
                        color: C.white,
                        fontWeight: 600,
                      }}
                    >
                      {t.name}
                    </div>
                    {(t.age || t.motif) && (
                      <div
                        style={{
                          fontFamily: SANS,
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.60)',
                          marginTop: 3,
                        }}
                      >
                        {[t.age, t.motif].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                  {t.duree && (
                    <div
                      style={{
                        background: 'rgba(78,205,196,0.20)',
                        border: '1px solid rgba(78,205,196,0.35)',
                        borderRadius: 20,
                        padding: '4px 12px',
                        fontFamily: SANS,
                        fontSize: 11,
                        color: C.turqLight,
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {t.duree}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA vers Doctolib */}
        <Reveal delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: 52 }}>
            <a
              href="https://www.doctolib.fr"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 40,
                  fontFamily: SANS,
                  fontSize: 13,
                  color: C.white,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all .35s',
                }}
              >
                <Star size={15} color={C.turqLight} fill={C.turqLight} strokeWidth={0} />
                Voir tous les avis sur Doctolib
                <ExternalLink size={13} color={C.turqLight} />
              </div>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · FORMULAIRE RDV
   ════════════════════════════════════════════════════════════════════════════ */
function RdvFormSection() {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    motif: '',
    medecin: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontFamily: SANS,
    fontSize: 15,
    color: C.dark,
    background: C.white,
    border: `1.5px solid ${C.border}`,
    borderRadius: 8,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 13,
    fontWeight: 600,
    color: C.dark,
    display: 'block',
    marginBottom: 6,
    letterSpacing: '0.02em',
  };

  return (
    <section
      id="rdv"
      style={{
        background: C.sandLight,
        padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,64px)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}
        className="r283-rdv-grid"
      >
        {/* Colonne gauche — texte */}
        <div>
          <Reveal>
            <Eyebrow color={C.blue} align="left">
              Prise de rendez-vous
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(26px,4.5vw,48px)',
                color: C.dark,
                fontWeight: 700,
                margin: '18px 0 20px',
                lineHeight: 1.18,
                letterSpacing: '-0.02em',
              }}
            >
              Votre premier pas vers la{' '}
              <span style={{ color: C.blue, fontStyle: 'italic' }}>
                guérison
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 16,
                color: C.textBody,
                lineHeight: 1.72,
                marginBottom: 32,
              }}
            >
              Remplissez ce formulaire de pré-inscription et notre secrétariat
              vous rappellera sous 24 heures pour confirmer votre rendez-vous.
              Une ordonnance de votre médecin est nécessaire pour la prise en
              charge par la Sécurité Sociale.
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: Phone, text: '04 67 XX XX XX — Lun-Ven 8h–19h' },
                { icon: MapPin, text: '12 Avenue de Palavas, 34000 Montpellier' },
                { icon: FileText, text: 'Ordonnance médicale requise' },
                { icon: CreditCard, text: 'Secteur 1 & 2 — CB, chèque, espèces' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: 'rgba(26,95,122,0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} color={C.blue} strokeWidth={2} />
                    </div>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 14,
                        color: C.textBody,
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Colonne droite — formulaire */}
        <Reveal delay={0.15}>
          <div
            style={{
              background: C.white,
              borderRadius: 16,
              padding: 'clamp(28px,4vw,44px)',
              boxShadow: '0 8px 40px rgba(26,95,122,0.10)',
              border: `1px solid ${C.border}`,
            }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'rgba(78,205,196,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 22px',
                  }}
                >
                  <CheckCircle size={36} color={C.turq} strokeWidth={1.8} />
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 22,
                    color: C.dark,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Demande bien reçue !
                </h3>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 15,
                    color: C.textBody,
                    lineHeight: 1.65,
                    marginBottom: 28,
                  }}
                >
                  Notre secrétariat vous contactera sous{' '}
                  <strong>24 heures ouvrées</strong> pour confirmer votre
                  rendez-vous.
                  <br />
                  Pensez à préparer votre ordonnance médicale.
                </p>
                <div
                  style={{
                    background: 'rgba(26,95,122,0.06)',
                    borderRadius: 10,
                    padding: '14px 18px',
                    fontFamily: SANS,
                    fontSize: 13,
                    color: C.blue,
                    fontWeight: 500,
                  }}
                >
                  04 67 XX XX XX · cabinet@kinetherapeute-montpellier.fr
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 20,
                    color: C.dark,
                    fontWeight: 700,
                    marginBottom: 28,
                  }}
                >
                  Demande de rendez-vous
                </h3>

                {/* Prénom / Nom sur deux colonnes */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    marginBottom: 18,
                  }}
                  className="r283-form-row"
                >
                  <div>
                    <label htmlFor="prenom" style={labelStyle}>
                      Prénom *
                    </label>
                    <input
                      id="prenom"
                      name="prenom"
                      type="text"
                      required
                      value={form.prenom}
                      onChange={handleChange}
                      placeholder="Marie"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" style={labelStyle}>
                      Nom *
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Dupont"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="telephone" style={labelStyle}>
                    Téléphone *
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    required
                    value={form.telephone}
                    onChange={handleChange}
                    placeholder="06 XX XX XX XX"
                    style={inputStyle}
                  />
                </div>

                {/* Motif */}
                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="motif" style={labelStyle}>
                    Motif de consultation *
                  </label>
                  <select
                    id="motif"
                    name="motif"
                    required
                    value={form.motif}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      color: form.motif ? C.dark : C.textMuted,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a5f7a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: 42,
                    }}
                  >
                    <option value="" disabled>
                      Sélectionnez un motif
                    </option>
                    <option value="postop">Post-opératoire</option>
                    <option value="douleur">Douleur chronique</option>
                    <option value="sport">Sport & traumatologie</option>
                    <option value="neuro">Neurologique</option>
                    <option value="respi">Respiratoire</option>
                  </select>
                </div>

                {/* Médecin prescripteur */}
                <div style={{ marginBottom: 28 }}>
                  <label htmlFor="medecin" style={labelStyle}>
                    Médecin prescripteur
                  </label>
                  <input
                    id="medecin"
                    name="medecin"
                    type="text"
                    value={form.medecin}
                    onChange={handleChange}
                    placeholder="Dr. Nom du médecin"
                    style={inputStyle}
                  />
                </div>

                {/* Mention légale */}
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 11.5,
                    color: C.textMuted,
                    lineHeight: 1.6,
                    marginBottom: 22,
                  }}
                >
                  En soumettant ce formulaire, vous acceptez que vos données
                  soient utilisées pour la prise de rendez-vous. Conformément au
                  RGPD, vous disposez d'un droit d'accès et de suppression.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: loading ? C.blueMid : C.blue,
                    color: C.white,
                    border: 'none',
                    borderRadius: 8,
                    fontFamily: SANS,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    transition: 'background .35s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    letterSpacing: '0.04em',
                  }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: 18,
                          height: 18,
                          border: '2px solid rgba(255,255,255,0.35)',
                          borderTopColor: C.white,
                          borderRadius: '50%',
                        }}
                      />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      Envoyer ma demande
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r283-rdv-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .r283-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · ÉQUIPE — 3 kinésithérapeutes
   ════════════════════════════════════════════════════════════════════════════ */
function EquipeSection() {
  const equipe_demo = [
    {
      photo: PHOTO.team1,
      prenom: 'Dr. Sophie',
      nom: 'Marchetti',
      specialite: 'Rééducation orthopédique & sportive',
      diplome: 'D.E. Kinésithérapie · Université de Montpellier 2006',
      formation: 'DU Traumatologie du sport · Physiothérapie manuelle ORTHO',
      annees: "18 ans d'expérience",
      langues: 'Français · Anglais · Italien',
    },
    {
      photo: PHOTO.team2,
      prenom: 'Baptiste',
      nom: 'Ferrara',
      specialite: 'Kinésithérapie respiratoire & cardio',
      diplome: 'D.E. Kinésithérapie · Université Lyon 1 2012',
      formation: "Certificat Drainage bronchique · Réentraînement à l'effort",
      annees: "12 ans d'expérience",
      langues: 'Français · Anglais',
    },
    {
      photo: PHOTO.team3,
      prenom: 'Nadia',
      nom: 'Bensalem',
      specialite: 'Rééducation neurologique & gériatrique',
      diplome: 'D.E. Kinésithérapie · Université Aix-Marseille 2016',
      formation: 'DU Rééducation neurologique · Bobath avancé',
      annees: "8 ans d'expérience",
      langues: 'Français · Arabe · Anglais',
    },
  ];
  const equipe = resolveList(
    bp?.team?.map((m: any, i: number) => {
      const [prenom, ...rest] = (m.name ?? "").split(" ");
      return {
        photo: m.photoUrl ?? equipe_demo[i % equipe_demo.length].photo,
        prenom: prenom || m.name,
        nom: rest.join(" "),
        specialite: m.specialty ?? m.role,
        diplome: m.credentials ?? m.bio ?? m.role,
        formation: m.bio && m.credentials ? m.bio : undefined,
        annees: undefined,
        langues: undefined,
      };
    }),
    equipe_demo
  );

  return (
    <section
      id="equipe"
      style={{
        background: C.white,
        padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,64px)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow color={C.blue} align="center">
            Notre équipe
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(26px,4.5vw,50px)',
              color: C.dark,
              fontWeight: 700,
              textAlign: 'center',
              margin: '18px 0 16px',
              letterSpacing: '-0.02em',
              lineHeight: 1.18,
            }}
          >
            Des spécialistes{' '}
            <span style={{ color: C.blue, fontStyle: 'italic' }}>à votre écoute</span>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 16,
              color: C.textMuted,
              textAlign: 'center',
              maxWidth: 520,
              margin: '0 auto 52px',
              lineHeight: 1.7,
            }}
          >
            Trois kinésithérapeutes diplômés d'État, en formation continue,
            qui vous accompagnent avec rigueur et bienveillance.
          </p>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 28,
          }}
        >
          {equipe.map((kine, i) => (
            <KineCard key={kine.nom} kine={kine} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

function KineCard({
  kine,
  delay,
}: {
  kine: {
    photo: string;
    prenom: string;
    nom: string;
    specialite: string;
    diplome: string;
    formation: string;
    annees: string;
    langues: string;
  };
  delay: number;
}) {
  const [hover, setHover] = useState(false);

  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          border: `1px solid ${hover ? C.blue : C.border}`,
          boxShadow: hover
            ? '0 16px 48px rgba(26,95,122,0.14)'
            : '0 2px 12px rgba(26,95,122,0.06)',
          transition: 'all .4s cubic-bezier(.16,1,.3,1)',
          transform: hover ? 'translateY(-4px)' : 'none',
          background: C.white,
        }}
      >
        {/* Photo portrait */}
        <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
          <img
            src={kine.photo}
            alt={`${kine.prenom} ${kine.nom} kinésithérapeute Montpellier`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hover ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform .6s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>

        {/* Infos */}
        <div style={{ padding: '24px 24px 28px' }}>
          {/* Badge spécialité */}
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(78,205,196,0.12)',
              border: '1px solid rgba(78,205,196,0.30)',
              borderRadius: 20,
              padding: '4px 12px',
              fontFamily: SANS,
              fontSize: 11,
              color: C.turqDeep,
              fontWeight: 600,
              marginBottom: 12,
              letterSpacing: '0.04em',
            }}
          >
            {kine.specialite}
          </div>

          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              color: C.dark,
              fontWeight: 700,
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {kine.prenom} {kine.nom}
          </h3>

          <p
            style={{
              fontFamily: SANS,
              fontSize: 13,
              color: C.textMuted,
              marginBottom: 16,
            }}
          >
            {kine.diplome}
          </p>

          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {kine.formation && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <CheckCircle
                  size={14}
                  color={C.turq}
                  strokeWidth={2}
                  style={{ flexShrink: 0, marginTop: 2 }}
                />
                <span
                  style={{ fontFamily: SANS, fontSize: 12.5, color: C.textBody }}
                >
                  {kine.formation}
                </span>
              </div>
            )}
            {kine.annees && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Activity
                  size={14}
                  color={C.blue}
                  strokeWidth={2}
                  style={{ flexShrink: 0 }}
                />
                <span
                  style={{ fontFamily: SANS, fontSize: 12.5, color: C.textBody }}
                >
                  {kine.annees}
                </span>
              </div>
            )}
            {kine.langues && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Mail
                  size={14}
                  color={C.blue}
                  strokeWidth={2}
                  style={{ flexShrink: 0 }}
                />
                <span
                  style={{ fontFamily: SANS, fontSize: 12.5, color: C.textMuted }}
                >
                  {kine.langues}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · MATÉRIEL SECTION — 4 équipements du cabinet
   ════════════════════════════════════════════════════════════════════════════ */
function MaterialSection() {
  const equipements = [
    {
      icon: Droplets,
      titre: 'Bain à remous thérapeutique',
      description:
        'Balnéothérapie dans notre bassin professionnel chauffé à 36 °C. Jets orientables à pression variable, idéal pour la rééducation précoce et la relaxation musculaire profonde.',
      specs: 'Capacité 1 patient · Eau traitée UV · T° contrôlée',
    },
    {
      icon: Zap,
      titre: 'Électrostimulateur multifonction',
      description:
        'Appareil de dernière génération proposant TENS, FES, interférentiels et courants de Träbert. Paramétrage numérique précis pour chaque protocole antalgique ou de renforcement.',
      specs: 'TENS · FES · Interférentiel · Galvanique',
    },
    {
      icon: Activity,
      titre: 'Tapis roulant instrumenté',
      description:
        'Tapis anti-gravité permettant la réathlétisation à charge partielle. Capteurs de force intégrés, analyse de la foulée en temps réel et adaptation automatique de la vitesse.',
      specs: 'Décharge 20–100% · Analyse foulée · Max 20km/h',
    },
    {
      icon: PersonStanding,
      titre: 'Plateau de rééducation',
      description:
        "Plateforme proprioceptive dynamique couplée à un système de biofeedback visuel. Utilisée pour la rééducation des entorses, prothèses et l'entraînement de l'équilibre neurologique.",
      specs: 'Proprioception · Biofeedback visuel · Posturologie',
    },
  ];

  return (
    <section
      id="materiel"
      style={{
        background: C.sandLight,
        padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,64px)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow color={C.blue} align="center">
            Nos équipements
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(26px,4.5vw,50px)',
              color: C.dark,
              fontWeight: 700,
              textAlign: 'center',
              margin: '18px 0 16px',
              letterSpacing: '-0.02em',
            }}
          >
            Un cabinet{' '}
            <span style={{ color: C.blue, fontStyle: 'italic' }}>
              à la pointe
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 16,
              color: C.textMuted,
              textAlign: 'center',
              maxWidth: 540,
              margin: '0 auto 52px',
              lineHeight: 1.7,
            }}
          >
            Des équipements professionnels de dernière génération pour une
            rééducation efficace, sûre et personnalisée dans un cadre moderne.
          </p>
        </Reveal>

        {/* Photo du cabinet au centre */}
        <Reveal delay={0.2}>
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 52,
              aspectRatio: '16/7',
              boxShadow: '0 16px 56px rgba(26,95,122,0.14)',
            }}
          >
            <img
              src={PHOTO.reeducation}
              alt="Salle de rééducation équipée cabinet Kinésithérapie du Languedoc"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: 22,
          }}
        >
          {equipements.map((eq, i) => {
            const Icon = eq.icon;
            return (
              <Reveal key={eq.titre} delay={i * 0.10}>
                <MaterialCard equip={eq} Icon={Icon} />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MaterialCard({
  equip,
  Icon,
}: {
  equip: { titre: string; description: string; specs: string };
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.white,
        border: `1px solid ${hover ? C.blue : C.border}`,
        borderRadius: 12,
        padding: '28px 24px',
        transition: 'all .4s cubic-bezier(.16,1,.3,1)',
        boxShadow: hover
          ? '0 12px 36px rgba(26,95,122,0.12)'
          : '0 2px 10px rgba(26,95,122,0.05)',
        transform: hover ? 'translateY(-3px)' : 'none',
        cursor: 'default',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: hover ? C.blue : 'rgba(26,95,122,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          transition: 'background .4s',
        }}
      >
        <Icon size={22} color={hover ? C.white : C.blue} strokeWidth={1.8} />
      </div>
      <h3
        style={{
          fontFamily: SERIF,
          fontSize: 17,
          color: C.dark,
          fontWeight: 700,
          marginBottom: 10,
          lineHeight: 1.3,
        }}
      >
        {equip.titre}
      </h3>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 14,
          color: C.textBody,
          lineHeight: 1.65,
          marginBottom: 14,
        }}
      >
        {equip.description}
      </p>
      <div
        style={{
          background: 'rgba(26,95,122,0.06)',
          borderRadius: 6,
          padding: '8px 12px',
          fontFamily: SANS,
          fontSize: 11.5,
          color: C.blue,
          fontWeight: 500,
          letterSpacing: '0.03em',
        }}
      >
        {equip.specs}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · INFOS PRATIQUES — adresse, transport, horaires, remboursements
   ════════════════════════════════════════════════════════════════════════════ */
function PracticalSection() {
  const horaires = [
    { jour: 'Lundi', h: '8h00 – 19h00' },
    { jour: 'Mardi', h: '8h00 – 19h00' },
    { jour: 'Mercredi', h: '8h00 – 19h00' },
    { jour: 'Jeudi', h: '8h00 – 19h00' },
    { jour: 'Vendredi', h: '8h00 – 18h00' },
    { jour: 'Samedi', h: '9h00 – 13h00' },
    { jour: 'Dimanche', h: 'Fermé' },
  ];

  return (
    <section
      id="pratique"
      style={{
        background: C.dark,
        padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,64px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Cercle décoratif */}
      <div
        style={{
          position: 'absolute',
          bottom: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(78,205,196,0.05)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Eyebrow color={C.turqLight} align="center">
            Informations pratiques
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(26px,4.5vw,50px)',
              color: C.white,
              fontWeight: 700,
              textAlign: 'center',
              margin: '18px 0 52px',
              letterSpacing: '-0.02em',
            }}
          >
            Tout pour{' '}
            <span style={{ color: C.turqLight, fontStyle: 'italic' }}>
              préparer votre venue
            </span>
          </h2>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 24,
          }}
        >
          {/* Adresse & transport */}
          <Reveal delay={0.1}>
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '30px 26px',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(78,205,196,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={20} color={C.turq} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 17,
                    color: C.white,
                    fontWeight: 700,
                  }}
                >
                  Adresse & Accès
                </h3>
              </div>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.65,
                  marginBottom: 18,
                }}
              >
                12 Avenue de Palavas
                <br />
                Quartier Antigone
                <br />
                34000 Montpellier
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  'Tram ligne 1 — arrêt Antigone (2 min à pied)',
                  "Parking gratuit Place du Nombre d'Or",
                  'Accessible PMR — ascenseur + rampe',
                  'À 10 min du centre-ville à vélo',
                ].map((t) => (
                  <div
                    key={t}
                    style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}
                  >
                    <CheckCircle
                      size={14}
                      color={C.turq}
                      strokeWidth={2}
                      style={{ flexShrink: 0, marginTop: 3 }}
                    />
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 13.5,
                        color: 'rgba(255,255,255,0.72)',
                      }}
                    >
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Horaires */}
          <Reveal delay={0.18}>
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '30px 26px',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(78,205,196,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock size={20} color={C.turq} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 17,
                    color: C.white,
                    fontWeight: 700,
                  }}
                >
                  Horaires d'ouverture
                </h3>
              </div>
              {horaires.map((h) => (
                <div
                  key={h.jour}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 13.5,
                      color:
                        h.jour === 'Dimanche'
                          ? 'rgba(255,255,255,0.35)'
                          : 'rgba(255,255,255,0.80)',
                      fontWeight: h.jour === 'Samedi' ? 600 : 400,
                    }}
                  >
                    {h.jour}
                  </span>
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 13.5,
                      color:
                        h.jour === 'Dimanche'
                          ? 'rgba(255,255,255,0.35)'
                          : C.turqLight,
                      fontWeight: 500,
                    }}
                  >
                    {h.h}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Remboursements & ordonnance */}
          <Reveal delay={0.26}>
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '30px 26px',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(78,205,196,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CreditCard size={20} color={C.turq} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 17,
                    color: C.white,
                    fontWeight: 700,
                  }}
                >
                  Tarifs & Remboursements
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
                {[
                  {
                    label: 'Secteur 1',
                    val: 'Tarif conventionné — remboursé Sécu à 60%',
                    highlight: true,
                  },
                  {
                    label: 'Secteur 2',
                    val: "Dépassements d'honoraires selon acte",
                    highlight: false,
                  },
                  {
                    label: 'Mutuelles',
                    val: 'Prise en charge complémentaire possible',
                    highlight: false,
                  },
                  {
                    label: 'Paiement',
                    val: 'CB, chèque, espèces — pas de paiement tiers',
                    highlight: false,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: item.highlight
                        ? 'rgba(78,205,196,0.10)'
                        : 'transparent',
                      borderRadius: 8,
                      padding: item.highlight ? '10px 14px' : '0',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 11,
                        color: C.turqLight,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: 3,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 13.5,
                        color: 'rgba(255,255,255,0.78)',
                      }}
                    >
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ordonnance */}
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.10)',
                  paddingTop: 16,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <FileText
                  size={18}
                  color={C.turq}
                  strokeWidth={2}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Ordonnance obligatoire
                  </strong>{' '}
                  pour toute prise en charge Sécurité Sociale. Consultez votre
                  médecin généraliste ou spécialiste avant votre première
                  séance.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* CTA contact */}
        <Reveal delay={0.32}>
          <div
            style={{
              marginTop: 48,
              background: 'rgba(78,205,196,0.10)',
              border: '1px solid rgba(78,205,196,0.25)',
              borderRadius: 14,
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 18,
                  color: C.white,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Une question avant de venir ?
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.68)',
                }}
              >
                Notre secrétariat est disponible du lundi au vendredi de 8h à 19h.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a
                href={`tel:${fd?.phone ?? "+33467000000"}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 22px',
                  background: C.turq,
                  color: C.dark,
                  borderRadius: 8,
                  fontFamily: SANS,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <Phone size={15} strokeWidth={2} />
                04 67 XX XX XX
              </a>
              <a
                href={`mailto:${fd?.email ?? "cabinet@kinetherapeute-montpellier.fr"}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 22px',
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  color: C.white,
                  borderRadius: 8,
                  fontFamily: SANS,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <Mail size={15} strokeWidth={2} />
                Email
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const footerLinks = [
    {
      titre: 'Le cabinet',
      liens: [
        { label: 'Nos spécialités', href: '#specialites' },
        { label: 'Techniques de soin', href: '#techniques' },
        { label: 'Notre équipe', href: '#equipe' },
        { label: 'Équipements', href: '#materiel' },
      ],
    },
    {
      titre: 'Patients',
      liens: [
        { label: 'Prendre rendez-vous', href: '#rdv' },
        { label: 'Informations pratiques', href: '#pratique' },
        { label: 'Doctolib', href: 'https://www.doctolib.fr' },
        { label: 'Remboursements', href: '#pratique' },
      ],
    },
    {
      titre: 'Contact',
      liens: [
        { label: '04 67 XX XX XX', href: 'tel:+33467000000' },
        { label: 'cabinet@kinetherapeute-montpellier.fr', href: 'mailto:cabinet@kinetherapeute-montpellier.fr' },
        { label: '12 Av. de Palavas, Antigone', href: '#pratique' },
        { label: 'Urgences : Hôpital Lapeyronie', href: "/templates/impact-283" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.blueDeep,
        padding: 'clamp(52px,8vw,96px) clamp(20px,5vw,64px) 0',
        borderTop: `1px solid rgba(78,205,196,0.15)`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Top footer */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48,
            paddingBottom: 52,
          }}
          className="r283-footer-grid"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 18,
              }}
            >
              <Activity size={22} color={C.turq} strokeWidth={2} />
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 16,
                  color: C.white,
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >{fd?.businessName ?? "Kinésithérapie du Languedoc"}</span>
            </div>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 14,
                color: 'rgba(255,255,255,0.62)',
                lineHeight: 1.68,
                maxWidth: 280,
                marginBottom: 22,
              }}
            >
              Cabinet de kinésithérapie et rééducation fonctionnelle au cœur
              du quartier Antigone de Montpellier. Soins remboursés Sécurité
              Sociale.
            </p>

            {/* Numéro ADELI */}
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  color: C.turqLight,
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Numéro ADELI
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 13.5,
                  color: 'rgba(255,255,255,0.80)',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                }}
              >
                34 93 0000 0 · RPPS 10000000000
              </div>
            </div>

            {/* Doctolib CTA */}
            <a
              href="https://www.doctolib.fr"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: C.turq,
                color: C.blueDeep,
                borderRadius: 8,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <ExternalLink size={14} strokeWidth={2.5} />
              Prendre RDV sur Doctolib
            </a>
          </div>

          {/* Colonnes de liens */}
          {footerLinks.map((col) => (
            <div key={col.titre}>
              <h4
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: C.turqLight,
                  fontWeight: 700,
                  marginBottom: 18,
                }}
              >
                {col.titre}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.liens.map((l) => (
                  <FooterLink283 key={l.label} label={l.label} href={l.href} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '22px 0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <p
            style={{
              fontFamily: SANS,
              fontSize: 12,
              color: 'rgba(255,255,255,0.40)',
            }}
          >
            © 2025 {fd?.businessName ?? 'Kinésithérapie du Languedoc'} — Tous droits réservés
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Mentions légales', href: "/templates/impact-283" },
              { label: 'Politique de confidentialité', href: "/templates/impact-283" },
              { label: 'RGPD', href: "/templates/impact-283" },
            ].map((l) => (
              <FooterLink283 key={l.label} label={l.label} href={l.href} small />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r283-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
        }
        @media (max-width: 540px) {
          .r283-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterLink283({
  label,
  href,
  small = false,
}: {
  label: string;
  href: string;
  small?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SANS,
        fontSize: small ? 11.5 : 13.5,
        color: h
          ? C.turqLight
          : small
          ? 'rgba(255,255,255,0.38)'
          : 'rgba(255,255,255,0.60)',
        textDecoration: 'none',
        transition: 'color .3s',
        lineHeight: 1.4,
      }}
    >
      {label}
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;
function Impact283Page() {
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
    businessProfile?: any;
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
  bp = session?.businessProfile;
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, blue: brand, blueLight: shadeColor(brand, 25) };
  }

  // Client-uploaded photos (uploaded in the brief) replace the stock
  // Unsplash placeholders — hero/cabinet shot and therapist portrait first.
  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    const p = fd.photoUrls;
    if (p[0]) PHOTO.cabinet = p[0];
    if (p[1]) PHOTO.reeducation = p[1];
    if (p[2]) PHOTO.therapeute = p[2];
    if (p[3]) PHOTO.massage = p[3];
    if (p[4]) PHOTO.team1 = p[4];
    if (p[5]) PHOTO.team2 = p[5];
    if (p[6]) PHOTO.team3 = p[6];
  });


return (
    <main id="hero">
      {/* Police Google Fonts via @import dans style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
          -webkit-text-size-adjust: 100%;
        }

        body {
          background: ${C.white};
          color: ${C.textBody};
          font-family: ${SANS};
          line-height: 1.6;
          overflow-x: hidden;
        }

        img {
          display: block;
          max-width: 100%;
        }

        a {
          color: inherit;
        }

        button {
          font-family: inherit;
        }

        /* ── Inputs focus ring ────────────────────────────────────── */
        input:focus, select:focus, textarea:focus {
          border-color: ${C.blue} !important;
          box-shadow: 0 0 0 3px rgba(26,95,122,0.14);
          outline: none;
        }

        /* ── Responsive global ────────────────────────────────────── */
        @media (max-width: 860px) {
          .r283-navlinks { display: none !important; }
          .r283-navcta { display: none !important; }
          .r283-tech-grid { grid-template-columns: 1fr !important; }
          .r283-tech-sticky-col { display: none !important; }
          .r283-rdv-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .r283-form-row { grid-template-columns: 1fr !important; }
          .r283-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 480px) {
          .r283-footer-grid { grid-template-columns: 1fr !important; }
        }

        /* ── Reduced motion ───────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ── Scrollbar discrète ───────────────────────────────────── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: rgba(26,95,122,0.30);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(26,95,122,0.55);
        }
      `}</style>

      {/* Navigation */}
      <NavSection />

      {/* 1 · Hero méditerranéen */}
      <HeroSection />

      {/* 2 · ScrollCrossfade — 3 visuels en crossfade */}
      <ScrollCrossfade />

      {/* 3 · Spécialités — rééducation orthopédique, respiratoire, neurologique */}
      <SpecialitesSection />

      {/* 4 · Techniques — massages, électrothérapie, balnéo, exercices actifs */}
      <TechniqueSection />

      {/* 5 · Témoignages patients */}
      <TestimonialsSection />

      {/* 6 · Formulaire RDV */}
      <RdvFormSection />

      {/* 7 · Équipe */}
      <EquipeSection />

      {/* 8 · Matériel & équipements */}
      <MaterialSection />

      {/* 9 · Infos pratiques */}
      <PracticalSection />

      {/* 10 · Footer */}
      <FooterSection />
    </main>
  );
}

export default Impact283Page;
