"use client";
// @ts-nocheck

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { TemplateIcon } from '@/components/TemplateIcon';
import { Droplets, Bell } from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  bg: '#060e14',
  bgAlt: '#0b1825',
  bgCard: '#0f2030',
  text: '#e4eef5',
  textMuted: '#7fa8c4',
  accent: '#1e8fbf',
  accentLight: '#3ab5e8',
  accentDark: '#155f80',
  border: '#1a3a52',
  borderLight: '#2a5a7a',
  white: '#ffffff',
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Processus', href: '#processus' },
  { label: 'Urgences', href: '#urgences' },
  { label: 'Réalisations', href: '#portfolio' },
  { label: 'Équipe', href: '#equipe' },
  { label: 'Témoignages', href: '#temoignages' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const STATS = [
  { value: 2100, suffix: '+', label: 'Interventions réalisées', icon: '🔧' },
  { value: 15, suffix: ' ans', label: "D'expérience", icon: '⭐' },
  { value: 24, suffix: '/7', label: 'Urgence disponible', icon: '🚨' },
  { value: 30, suffix: ' min', label: 'Délai moyen d\'arrivée', icon: '⚡' },
];

const SERVICES = [
  {
    icon: '💧',
    title: 'Dépannage Fuite',
    desc: "Intervention rapide pour toute fuite d\'eau, tuyauterie ou joint. Disponible 24h/24, 7j/7 pour les urgences.",
    badge: 'Urgence 24/7',
  },
  {
    icon: '🛁',
    title: 'Salle de Bains',
    desc: "Installation et rénovation complète : douche à l\'italienne, baignoire, mobilier vasque, carrelage, plomberie.",
    badge: 'Clé en main',
  },
  {
    icon: '🚿',
    title: 'Débouchage',
    desc: 'Débouchage haute pression de canalisations, WC, éviers. Inspection vidéo incluse pour un diagnostic précis.',
    badge: 'Haute pression',
  },
  {
    icon: '🔩',
    title: 'Robinetterie',
    desc: 'Remplacement et installation de robinets, mitigeurs, douchettes. Grandes marques au meilleur prix.',
    badge: 'Toutes marques',
  },
  {
    icon: '♨️',
    title: 'Chauffe-Eau',
    desc: 'Installation, entretien et remplacement de chauffe-eau thermodynamique, électrique ou gaz. Devis gratuit.',
    badge: 'Éco-certifié',
  },
  {
    icon: '🌬️',
    title: 'VMC & Ventilation',
    desc: "Installation et entretien de VMC simple ou double flux. Amélioration de la qualité de l\'air intérieur.",
    badge: 'Certifié RGE',
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Appel & Devis',
    desc: 'Contactez-nous par téléphone ou formulaire. Nous établissons un devis transparent et sans surprise sous 1h.',
    icon: '📞',
  },
  {
    num: '02',
    title: 'Diagnostic',
    desc: 'Nos techniciens arrivent équipés pour un diagnostic précis. Inspection visuelle et vidéo si nécessaire.',
    icon: '🔍',
  },
  {
    num: '03',
    title: 'Réparation',
    desc: 'Intervention professionnelle avec des pièces certifiées. Travail propre, rapide et durable.',
    icon: '🔧',
  },
  {
    num: '04',
    title: 'Garantie',
    desc: "Tous nos travaux sont garantis 2 ans pièces et main d\'œuvre. Votre satisfaction est notre priorité.",
    icon: '✅',
  },
];

const ZONES = [
  "Paris 1-20', 'Boulogne-Billancourt', 'Neuilly-sur-Seine",
  "Levallois-Perret', 'Vincennes', 'Saint-Denis', 'Montreuil",
  "Nanterre', 'Créteil', 'Versailles",
];

const PORTFOLIO = [
  { style: 'Industriel Chic', surface: '8 m²', budget: '4 500 – 6 000 €', city: 'Paris 11e', before: '🏚️', after: '✨' },
  { style: 'Scandinave Épuré', surface: '12 m²', budget: '6 000 – 8 500 €', city: 'Boulogne-B.', before: '🏚️', after: '✨' },
  { style: 'Marbre & Laiton', surface: '10 m²', budget: '7 000 – 10 000 €', city: 'Neuilly', before: '🏚️', after: '✨' },
  { style: 'Zen Japonais', surface: '6 m²', budget: '3 800 – 5 500 €', city: 'Vincennes', before: '🏚️', after: '✨' },
  { style: 'Rétro Carreaux', surface: '9 m²', budget: '5 200 – 7 200 €', city: 'Paris 18e', before: '🏚️', after: '✨' },
  { style: 'Contemporain Dark', surface: '14 m²', budget: '8 000 – 12 000 €', city: 'Levallois', before: '🏚️', after: '✨' },
];

const TEAM = [
  {
    name: 'Karim Aziz',
    role: 'Fondateur & Maître Plombier',
    exp: '15 ans',
    certs: ['CAP Plomberie', 'Qualibat RGE', 'Certifié Grohe Pro'],
    bio: "Passionné de plomberie depuis son apprentissage à l\'âge de 17 ans, Karim a fondé Aqua Prestige en 2010 avec l\'ambition de proposer des services haut de gamme à prix juste.",
    emoji: '👨‍🔧',
    color: C.accent,
  },
  {
    name: 'Marine Pelletier',
    role: 'Technicienne Senior',
    exp: '8 ans',
    certs: ['BTS Génie Sanitaire', 'Certifiée VMC', 'Expert Salle de Bains'],
    bio: 'Spécialisée dans les rénovations de salles de bains haut de gamme, Marine supervise tous les projets complexes et assure le suivi qualité de chaque chantier.',
    emoji: '👩‍🔧',
    color: C.accentLight,
  },
  {
    name: 'Théo Brun',
    role: 'Apprenti Qualifié',
    exp: '3 ans',
    certs: ['CAP Installations Sanitaires', 'Formation Thermodynamique'],
    bio: 'Jeune talent formé directement par Karim, Théo apporte énergie et maîtrise des nouvelles technologies comme les chauffe-eaux thermodynamiques et les VMC double flux.',
    emoji: '👦‍🔧',
    color: '#4ecdc4',
  },
];

const TESTIMONIALS = [
  {
    name: 'Isabelle M.',
    city: 'Paris 11e',
    rating: 5,
    text: "Fuite sous l\'évier un dimanche soir — Karim était là en 25 minutes ! Travail impeccable, prix honnête. Je recommande vivement Aqua Prestige.",
    service: 'Dépannage fuite',
  },
  {
    name: 'Romain T.',
    city: 'Boulogne-B.',
    rating: 5,
    text: 'Rénovation complète de ma salle de bains en 5 jours chrono. Résultat bluffant, Marine a un œil incroyable pour les détails.',
    service: 'Rénovation SdB',
  },
  {
    name: 'Chantal & Pierre D.',
    city: 'Neuilly',
    rating: 5,
    text: 'Devis transparent, équipe ponctuelle, chantier propre. Notre nouvelle salle de bains en marbre est un rêve. Merci Aqua Prestige !',
    service: 'Installation premium',
  },
  {
    name: 'Mehdi B.',
    city: 'Vincennes',
    rating: 5,
    text: "Débouchage efficace et rapide. Théo a utilisé l\'inspection vidéo pour identifier le problème exact. Plus de souci depuis 6 mois !",
    service: 'Débouchage',
  },
  {
    name: 'Sophie L.',
    city: 'Paris 18e',
    rating: 5,
    text: "Installation de mon nouveau chauffe-eau thermodynamique en une journée. Économies d\'énergie visibles dès la première facture !",
    service: 'Chauffe-eau',
  },
  {
    name: 'François K.',
    city: 'Levallois',
    rating: 4,
    text: "Très satisfait de l\'installation VMC. Marine a pris le temps d\'expliquer le fonctionnement. Appartement bien plus sain maintenant.",
    service: 'VMC Installation',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Quels sont vos tarifs pour une urgence la nuit ou le week-end ?',
    a: "Nos tarifs d\'urgence nocturne (20h–8h) et week-end sont majorés de 40% par rapport au tarif normal. Nous vous communiquons toujours le devis avant toute intervention. Tarif de déplacement : 49€ en journée, 79€ la nuit.",
  },
  {
    q: "Quelle est votre zone d\'intervention ?",
    a: 'Nous intervenons dans Paris intramuros (1er au 20e) et dans les communes limitrophes : Boulogne-Billancourt, Neuilly, Levallois, Vincennes, Saint-Denis, Montreuil, Nanterre, Créteil et Versailles.',
  },
  {
    q: 'Quelle garantie proposez-vous sur vos travaux ?',
    a: "Tous nos travaux bénéficient d\'une garantie de 2 ans sur la main d\'œuvre et les pièces posées. En cas de problème dans ce délai, nous revenons gratuitement. Nos installations sont également couvertes par notre assurance décennale.",
  },
  {
    q: 'Quelles marques de matériaux utilisez-vous ?',
    a: 'Nous travaillons exclusivement avec des matériaux de qualité professionnelle : Grohe, Hansgrohe, Porcelanosa, Villeroy & Boch, Jacob Delafon, Atlantic pour les chauffe-eaux. Nous privilégions les produits avec label NF ou équivalent européen.',
  },
  {
    q: 'Quel est le délai pour une rénovation complète de salle de bains ?',
    a: "Une rénovation complète de salle de bains prend en général 4 à 7 jours ouvrés selon la surface et les prestations. Nous réalisons un planning détaillé avant le début du chantier et vous tenons informé chaque jour de l\'avancement des travaux.",
  },
];

/* ─────────────────────────────────────────────
   WATER DROP SVG PARTICLE
───────────────────────────────────────────── */
interface WaterDropProps {
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function WaterDrop({ x, size, duration, delay, opacity }: WaterDropProps) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: '-60px',
        width: size,
        height: size * 1.3,
        opacity,
        pointerEvents: 'none',
      }}
      animate={{ y: ['0vh', '110vh'] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <path
          d="M20 2 C20 2 4 22 4 34 C4 43.9 11.2 50 20 50 C28.8 50 36 43.9 36 34 C36 22 20 2 20 2Z"
          fill={C.accent}
          fillOpacity="0.5"
        />
        <path
          d="M14 30 C14 30 10 35 12 40"
          stroke={C.accentLight}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
interface CounterProps {
  target: number;
  suffix: string;
}

function AnimatedCounter({ target, suffix }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
}

function SectionHeader({ badge, title, subtitle }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{ textAlign: 'center', marginBottom: '4rem' }}
    >
      <span
        style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
          color: C.white,
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          padding: '0.35rem 1.1rem',
          borderRadius: '999px',
          marginBottom: '1rem',
        }}
      >
        {badge}
      </span>
      <h2
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 800,
          color: C.text,
          lineHeight: 1.1,
          margin: '0 0 1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: C.textMuted,
          fontSize: '1.05rem',
          lineHeight: 1.7,
          maxWidth: '580px',
          margin: '0 auto',
        }}
      >
        {subtitle}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────────── */
interface ServiceCardProps {
  icon: string;
  title: string;
  desc: string;
  badge: string;
  index: number;
}

function ServiceCard({ icon, title, desc, badge, index }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${C.bgCard}, #0d2840)`
          : C.bgCard,
        border: `1px solid ${hovered ? C.accent : C.border}`,
        borderRadius: '16px',
        padding: '2rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 60px rgba(30,143,191,0.2)` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
          }}
        />
      )}
      <div style={{ marginBottom: '1rem' }}><TemplateIcon emoji={icon} size={40} /></div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
        <h3
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '1.3rem',
            fontWeight: 700,
            color: C.text,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            margin: 0,
          }}
        >
          {title}
        </h3>
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: C.accentLight,
            background: `rgba(30,143,191,0.15)`,
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            border: `1px solid rgba(30,143,191,0.3)`,
          }}
        >
          {badge}
        </span>
      </div>
      <p style={{ color: C.textMuted, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{desc}</p>
      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: hovered ? C.accentLight : C.accent,
          fontSize: '0.85rem',
          fontWeight: 600,
          transition: 'color 0.3s',
        }}
      >
        En savoir plus
        <span style={{ transform: hovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.3s' }}>→</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PROCESS STEP
───────────────────────────────────────────── */
interface ProcessStepProps {
  num: string;
  title: string;
  desc: string;
  icon: string;
  index: number;
  isLast: boolean;
}

function ProcessStep({ num, title, desc, icon, index, isLast }: ProcessStepProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 0 6px rgba(30,143,191,0.15)`,
          }}
        >
          <TemplateIcon emoji={icon} size={22} />
        </div>
        {!isLast && (
          <div
            style={{
              width: '2px',
              flex: 1,
              background: `linear-gradient(to bottom, ${C.accent}, transparent)`,
              marginTop: '0.75rem',
              minHeight: '60px',
            }}
          />
        )}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : '2.5rem', flex: 1 }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '0.75rem',
            fontWeight: 700,
            color: C.accent,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '0.3rem',
          }}
        >
          Étape {num}
        </div>
        <h3
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '1.4rem',
            fontWeight: 800,
            color: C.text,
            textTransform: 'uppercase',
            margin: '0 0 0.5rem',
          }}
        >
          {title}
        </h3>
        <p style={{ color: C.textMuted, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PORTFOLIO CARD
───────────────────────────────────────────── */
interface PortfolioCardProps {
  style: string;
  surface: string;
  budget: string;
  city: string;
  index: number;
}

function PortfolioCard({ style, surface, budget, city, index }: PortfolioCardProps) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const gradients = [
    'linear-gradient(135deg, #0f2030, #1a3a55)',
    'linear-gradient(135deg, #0e1e30, #1a4a60)',
    'linear-gradient(135deg, #14202e, #2a4a65)',
    'linear-gradient(135deg, #0c1e2e, #1e3850)',
    'linear-gradient(135deg, #10202e, #1a3548)',
    'linear-gradient(135deg, #0a1c2c, #1e4060)',
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${hovered ? C.accent : C.border}`,
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 16px 48px rgba(30,143,191,0.2)` : 'none',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          height: '180px',
          background: gradients[index % gradients.length],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '0.5rem' }}><TemplateIcon emoji="🛁" size={56} /></div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: C.white,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {style}
          </div>
        </div>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: `rgba(30,143,191,0.15)`,
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: C.white,
                fontWeight: 700,
                fontSize: '0.9rem',
                background: C.accent,
                padding: '0.5rem 1.5rem',
                borderRadius: '999px',
              }}
            >
              Voir le projet →
            </span>
          </motion.div>
        )}
      </div>
      <div style={{ padding: '1.25rem', background: C.bgCard }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: C.accent,
            }}
          >
            {city}
          </span>
          <span style={{ fontSize: '0.75rem', color: C.textMuted }}>{surface}</span>
        </div>
        <div style={{ color: C.textMuted, fontSize: '0.85rem', fontWeight: 600 }}>
          Budget : <span style={{ color: C.text }}>{budget}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   TEAM CARD
───────────────────────────────────────────── */
interface TeamCardProps {
  name: string;
  role: string;
  exp: string;
  certs: string[];
  bio: string;
  emoji: string;
  color: string;
  index: number;
}

function TeamCard({ name, role, exp, certs, bio, emoji, color, index }: TeamCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: '20px',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.bgAlt}, ${C.bgCard})`,
          border: `3px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: `0 0 0 6px ${color}22`,
        }}
      >
        <TemplateIcon emoji={emoji} size={40} />
      </div>
      <h3
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '1.4rem',
          fontWeight: 800,
          color: C.text,
          textTransform: 'uppercase',
          margin: '0 0 0.25rem',
        }}
      >
        {name}
      </h3>
      <p style={{ color, fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.25rem' }}>{role}</p>
      <p style={{ color: C.textMuted, fontSize: '0.8rem', margin: '0 0 1rem' }}>
        {exp} d&apos;expérience
      </p>
      <p style={{ color: C.textMuted, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 1.25rem' }}>{bio}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {certs.map((cert) => (
          <div
            key={cert}
            style={{
              fontSize: '0.75rem',
              color: C.textMuted,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ color, fontSize: '0.6rem' }}>◆</span>
            {cert}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIAL CARD
───────────────────────────────────────────── */
interface TestimonialCardProps {
  name: string;
  city: string;
  rating: number;
  text: string;
  service: string;
  index: number;
}

function TestimonialCard({ name, city, rating, text, service, index }: TestimonialCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: i < rating ? '#f4c542' : C.border, fontSize: '1rem' }}>
            ★
          </span>
        ))}
      </div>
      <p
        style={{
          color: C.text,
          fontSize: '0.92rem',
          lineHeight: 1.75,
          fontStyle: 'italic',
          margin: 0,
          flex: 1,
        }}
      >
        &ldquo;{text}&rdquo;
      </p>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontWeight: 700, color: C.text, fontSize: '0.9rem' }}>{name}</div>
          <div style={{ color: C.textMuted, fontSize: '0.78rem' }}>{city}</div>
        </div>
        <span
          style={{
            fontSize: '0.7rem',
            color: C.accent,
            background: 'rgba(30,143,191,0.12)',
            padding: '0.2rem 0.7rem',
            borderRadius: '999px',
            border: `1px solid rgba(30,143,191,0.25)`,
            fontWeight: 600,
          }}
        >
          {service}
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────────── */
interface FaqItemProps {
  q: string;
  a: string;
  index: number;
}

function FaqItem({ q, a, index }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        border: `1px solid ${open ? C.accent : C.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: open ? `rgba(30,143,191,0.08)` : C.bgCard,
          border: 'none',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          cursor: 'pointer',
          transition: 'background 0.3s',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '1.05rem',
            fontWeight: 700,
            color: open ? C.accentLight : C.text,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            transition: 'color 0.3s',
          }}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            color: C.accent,
            fontSize: '1.2rem',
            flexShrink: 0,
            display: 'inline-block',
          }}
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 1.5rem 1.25rem',
                color: C.textMuted,
                fontSize: '0.9rem',
                lineHeight: 1.75,
                background: C.bgCard,
              }}
            >
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  icon: string;
  index: number;
}

function StatCard({ value, suffix, label, icon, index }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      style={{ textAlign: 'center', padding: '1rem' }}
    >
      <div style={{ marginBottom: '0.5rem' }}><TemplateIcon emoji={icon} size={32} /></div>
      <div
        className="stats-value"
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '3.5rem',
          fontWeight: 900,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
        }}
      >
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <div style={{ color: C.textMuted, fontSize: '0.88rem', fontWeight: 500 }}>{label}</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   CLOCK ANIMATION
───────────────────────────────────────────── */
function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const s = time.getSeconds();
  const m = time.getMinutes();
  const h = time.getHours() % 12;
  const sDeg = s * 6;
  const mDeg = m * 6 + s * 0.1;
  const hDeg = h * 30 + m * 0.5;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="38" stroke={C.accent} strokeWidth="2" fill="rgba(30,143,191,0.08)" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="40"
          y1="6"
          x2="40"
          y2={deg % 90 === 0 ? '12' : '9'}
          stroke={C.borderLight}
          strokeWidth={deg % 90 === 0 ? '2' : '1'}
          transform={`rotate(${deg}, 40, 40)`}
        />
      ))}
      <line x1="40" y1="40" x2="40" y2="20" stroke={C.text} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${hDeg}, 40, 40)`} />
      <line x1="40" y1="40" x2="40" y2="14" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${mDeg}, 40, 40)`} />
      <line x1="40" y1="40" x2="40" y2="10" stroke={C.accent} strokeWidth="1" strokeLinecap="round" transform={`rotate(${sDeg}, 40, 40)`} />
      <circle cx="40" cy="40" r="3" fill={C.accent} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────── */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function AquaPrestigePage() {
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

  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [formSent, setFormSent] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const drops = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * 100,
      size: 14 + Math.random() * 22,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  );

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
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
return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, []);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  }, []);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  }, []);

  /* ── SECTION PADDING ── */
  const sectionPad: React.CSSProperties = {
    padding: '7rem 0',
    position: 'relative',
  };

  const container: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
  };

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: ${C.bg};
          color: ${C.text};
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        ::selection { background: ${C.accent}; color: #fff; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}; border-radius: 3px; }

        /* LAYOUT GRID CLASSES */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .grid-6 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .grid-process { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem 4rem; }
        .zones-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; }
        .hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .zones-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 900px) {
          .grid-3 { grid-template-columns: repeat(2, 1fr); }
          .grid-6 { grid-template-columns: repeat(2, 1fr); }
          .grid-process { grid-template-columns: 1fr; gap: 0; }
        }

        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .grid-4 { grid-template-columns: 1fr 1fr; }
          .grid-6 { grid-template-columns: 1fr; }
          .grid-process { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .zones-grid { grid-template-columns: repeat(2, 1fr); }
          .form-row { grid-template-columns: 1fr; }
          .section-pad { padding: 4rem 0 !important; }
          .hide-mobile { display: none !important; }
          .hero-ctas { flex-direction: column; align-items: flex-start; }
          .hero-ctas a, .hero-ctas button { width: 100%; text-align: center; justify-content: center; }
          .urgence-inner { flex-direction: column !important; text-align: center; }
          .urgence-inner > * { align-items: center !important; }
        }

        @media (max-width: 600px) {
          .grid-4 { grid-template-columns: 1fr; }
          .zones-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .hero-ctas a, .hero-ctas button { width: 100%; display: block; }
          .stats-value { font-size: 2.5rem !important; }
        }

        /* INPUT STYLES */
        .ap-input {
          width: 100%;
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          borderRadius: 10px;
          padding: 0.85rem 1.1rem;
          color: ${C.text};
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.25s;
        }
        .ap-input:focus { border-color: ${C.accent}; }
        .ap-input::placeholder { color: ${C.textMuted}; }
      `}</style>

      {/* ════════════════════════════════════════
          1. NAVIGATION
      ════════════════════════════════════════ */}
      <motion.nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: navScrolled ? '0.75rem 1.5rem' : '1.25rem 1.5rem',
          background: navScrolled
            ? `rgba(6,14,20,0.95)`
            : 'transparent',
          backdropFilter: navScrolled ? 'blur(16px)' : 'none',
          borderBottom: navScrolled ? `1px solid ${C.border}` : 'none',
          transition: 'all 0.4s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '100%',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Droplets style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.3rem',
                fontWeight: 900,
                color: C.white,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >{fd?.businessName ?? "Aqua Prestige"}</div>
            <div style={{ fontSize: '0.62rem', color: C.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Plomberie & Sanitaire
            </div>
          </div>
        </div>

        {/* Desktop Links */}
        <div
          className="hide-mobile"
          style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}
        >
          {NAV_LINKS.slice(0, 6).map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                color: C.textMuted,
                fontSize: '0.8rem',
                fontWeight: 500,
                textDecoration: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                transition: 'all 0.2s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = C.white;
                (e.currentTarget as HTMLElement).style.background = `rgba(255,255,255,0.06)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = C.textMuted;
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href={`tel:${fd?.phone ?? "+33142000000"}`}
            className="hide-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
              color: C.white,
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '0.5rem 1.1rem',
              borderRadius: '999px',
              textDecoration: 'none',
              letterSpacing: '0.02em',
              boxShadow: `0 4px 16px rgba(30,143,191,0.35)`,
            }}
          >
            Urgence 24/7
          </a>
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${C.border}`,
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              color: C.text,
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(300px, 85vw)',
              background: C.bgAlt,
              borderLeft: `1px solid ${C.border}`,
              zIndex: 1100,
              padding: '5rem 2rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  color: C.textMuted,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '0.75rem 0',
                  borderBottom: `1px solid ${C.border}`,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.white)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${fd?.phone ?? "+33142000000"}`}
              style={{
                display: 'block',
                marginTop: '1.5rem',
                background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
                color: C.white,
                fontSize: '1rem',
                fontWeight: 700,
                padding: '0.85rem 1.5rem',
                borderRadius: '12px',
                textDecoration: 'none',
                textAlign: 'center',
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Appeler Maintenant
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 1050,
            }}
          />
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════
          2. HERO
      ════════════════════════════════════════ */}
      <section id="hero"
        ref={heroRef}
        style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(30,143,191,0.12) 0%, transparent 70%), ${C.bg}`,
        }}
      >
        {/* Water Drop Particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {drops.current.map((d, i) => (
            <WaterDrop key={i} {...d} />
          ))}
        </div>

        {/* Mesh grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(30,143,191,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,143,191,0.04) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          style={{ y: heroParallax, position: 'relative', zIndex: 2, ...container, textAlign: 'center', paddingTop: '8rem', paddingBottom: '6rem' }}
        >
          {/* Urgence Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,80,80,0.12)',
              border: '1px solid rgba(255,80,80,0.3)',
              color: brand ?? '#ff6b6b',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              marginBottom: '2rem',
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              style={{width: '6px', height: '6px', borderRadius: '50%', background: brand ?? '#ff6b6b', display: 'inline-block' }}
            />
            Disponible 24h/24 — Intervention en 30 min
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(2.8rem, 9vw, 7rem)',
              fontWeight: 900,
              lineHeight: 0.95,
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
              marginBottom: '1.5rem',
              color: C.white,
            }}
          >{c?.heroHeadline ?? <>
            Votre Plombier{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              de Confiance
            </span>
            <br />
            À Paris
          </>}</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              color: C.textMuted,
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              lineHeight: 1.7,
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Dépannage, installation et rénovation de salles de bains. Artisans certifiés, tarifs transparents, intervention rapide dans tout Paris et l&apos;Île-de-France.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="hero-ctas"
            style={{ justifyContent: 'center' }}
          >
            <a
              href={`tel:${fd?.phone ?? "+33142000000"}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
                color: C.white,
                fontSize: '1rem',
                fontWeight: 700,
                padding: '0.95rem 2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: `0 8px 32px rgba(30,143,191,0.4)`,
                letterSpacing: '0.02em',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(30,143,191,0.55)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(30,143,191,0.4)`;
              }}
            >
              Urgence 24/7 — Appeler
            </a>
            <a
              href="#services"
              onClick={(e) => handleNavClick(e, '#services')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.06)',
                color: C.text,
                fontSize: '1rem',
                fontWeight: 600,
                padding: '0.95rem 2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                border: `1px solid ${C.border}`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = C.borderLight;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = C.border;
              }}
            >
              Nos services →
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: C.textMuted, fontSize: '0.75rem', letterSpacing: '0.1em' }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              style={{ fontSize: '1.4rem', color: C.accent }}
            >
              ↓
            </motion.div>
            DÉFILER
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          3. STATS
      ════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} className="section-pad">
        <div style={container}>
          <div className="grid-4">
            {STATS.map((stat, i) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                icon={stat.icon}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. SERVICES
      ════════════════════════════════════════ */}
      <section id="services" style={sectionPad} className="section-pad">
        <div style={container}>
          <SectionHeader
            badge="Nos Prestations"
            title="Services de Plomberie Haut de Gamme"
            subtitle="De l'urgence au projet de rénovation complet, nos artisans certifiés interviennent avec rapidité et professionnalisme."
          />
          <div className="grid-6">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. PROCESS
      ════════════════════════════════════════ */}
      <section id="processus" style={{ ...sectionPad, background: C.bgAlt }} className="section-pad">
        <div style={container}>
          <SectionHeader
            badge="Notre Méthode"
            title="Un Processus Rodé en 4 Étapes"
            subtitle="Transparence, efficacité et qualité — chaque intervention suit un protocole strict pour garantir votre satisfaction."
          />
          <div className="grid-process" style={{ alignItems: 'start' }}>
            {PROCESS_STEPS.map((step, i) => (
              <ProcessStep key={step.num} {...step} index={i} isLast={i === PROCESS_STEPS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          6. URGENCES
      ════════════════════════════════════════ */}
      <section id="urgences" style={{ ...sectionPad, background: `linear-gradient(135deg, ${C.accentDark}22, ${C.bg})`, position: 'relative', overflow: 'hidden' }} className="section-pad">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, rgba(30,143,191,0.08) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{ ...container, position: 'relative', zIndex: 1 }}>
          {/* Main urgence card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            style={{
              background: `linear-gradient(135deg, ${C.bgCard}, #0a1e30)`,
              border: `2px solid ${C.accent}`,
              borderRadius: '24px',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              boxShadow: `0 0 80px rgba(30,143,191,0.15), 0 0 0 1px rgba(30,143,191,0.1)`,
              marginBottom: '3rem',
            }}
          >
            <div
              className="urgence-inner"
              style={{ display: 'flex', alignItems: 'center', gap: '3rem', justifyContent: 'space-between' }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,80,80,0.15)',
                    border: '1px solid rgba(255,80,80,0.3)',
                    color: brand ?? '#ff6b6b',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 1rem',
                    borderRadius: '999px',
                    marginBottom: '1.25rem',
                  }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Bell style={{ width: 16, height: 16 }} />
                  </motion.span>
                  Urgence Plomberie
                </div>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    fontWeight: 900,
                    color: C.white,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    marginBottom: '1rem',
                  }}
                >{c?.aboutTitle ?? fd?.businessName ?? <>
                  Fuite ? Dégât des eaux ?
                  <br />
                  <span style={{ color: C.accentLight }}>Appelez Maintenant.</span>
                </>}</h2>
                <p style={{ color: C.textMuted, fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '480px' }}>{c?.aboutText ?? <>
                  Notre équipe d&apos;urgence est disponible 24h/24, 7j/7, 365 jours par an. Intervention garantie en moins de 30 minutes dans Paris et petite couronne.
                </>}</p>
                <a
                  href={`tel:${fd?.phone ?? "+33142000000"}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: `linear-gradient(135deg, #cc2200, #ff4422)`,
                    color: C.white,
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    padding: '1rem 2.5rem',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    boxShadow: '0 8px 32px rgba(255,68,34,0.4)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
                >
                  01 42 00 00 00
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <AnalogClock />
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      color: C.accentLight,
                      lineHeight: 1,
                    }}
                  >
                    24/7
                  </div>
                  <div style={{ color: C.textMuted, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Disponible
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Zones */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.4rem',
                fontWeight: 800,
                color: C.text,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
              }}
            >
              Zones d&apos;intervention
            </h3>
            <p style={{ color: C.textMuted, fontSize: '0.88rem' }}>Intervention rapide dans toutes ces communes</p>
          </div>
          <div className="zones-grid">
            {ZONES.map((zone) => (
              <div
                key={zone}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  padding: '0.65rem 1rem',
                  textAlign: 'center',
                  color: C.textMuted,
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.accent;
                  (e.currentTarget as HTMLElement).style.color = C.text;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.border;
                  (e.currentTarget as HTMLElement).style.color = C.textMuted;
                }}
              >
                {zone}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          7. PORTFOLIO
      ════════════════════════════════════════ */}
      <section id="portfolio" style={sectionPad} className="section-pad">
        <div style={container}>
          <SectionHeader
            badge="Réalisations"
            title="Nos Plus Belles Salles de Bains"
            subtitle="Chaque projet est unique. Découvrez nos réalisations et trouvez l'inspiration pour votre future salle de bains."
          />
          <div className="grid-6">
            {PORTFOLIO.map((p, i) => (
              <PortfolioCard key={p.style} {...p} index={i} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ textAlign: 'center', marginTop: '2.5rem' }}
          >
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: `2px solid ${C.accent}`,
                color: C.accent,
                fontSize: '0.95rem',
                fontWeight: 700,
                padding: '0.85rem 2.25rem',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.25s',
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = C.accent;
                (e.currentTarget as HTMLElement).style.color = C.white;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = C.accent;
              }}
            >
              Demander un devis pour ma salle de bains →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          8. TEAM
      ════════════════════════════════════════ */}
      <section id="equipe" style={{ ...sectionPad, background: C.bgAlt }} className="section-pad">
        <div style={container}>
          <SectionHeader
            badge="Notre Équipe"
            title="Des Artisans Passionnés & Certifiés"
            subtitle="Derrière chaque intervention, des professionnels dédiés à votre satisfaction. Nos techniciens sont formés, assurés et régulièrement recertifiés."
          />
          <div className="grid-3">
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} {...member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          9. TESTIMONIALS
      ════════════════════════════════════════ */}
      <section id="temoignages" style={sectionPad} className="section-pad">
        <div style={container}>
          <SectionHeader
            badge="Avis Clients"
            title="Ce Que Disent Nos Clients"
            subtitle="Plus de 2100 interventions réalisées. Voici ce que pensent ceux qui nous ont fait confiance."
          />
          <div className="grid-6">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} {...t} index={i} />
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              marginTop: '3rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: '⭐', label: '4.9/5 sur Google' },
              { icon: '🏆', label: 'Qualibat certifié' },
              { icon: '🛡️', label: 'Assurance décennale' },
              { icon: '🌿', label: 'Certifié RGE' },
            ].map((badge) => (
              <div
                key={badge.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: '0.6rem 1.25rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  color: C.textMuted,
                  fontWeight: 500,
                }}
              >
                <TemplateIcon emoji={badge.icon} size={16} />
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          10. FAQ
      ════════════════════════════════════════ */}
      <section id="faq" style={{ ...sectionPad, background: C.bgAlt }} className="section-pad">
        <div style={{ ...container, maxWidth: '780px' }}>
          <SectionHeader
            badge="Questions Fréquentes"
            title="Tout Ce Que Vous Devez Savoir"
            subtitle="Vous avez des questions ? Retrouvez ci-dessous les réponses aux interrogations les plus fréquentes de nos clients."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={item.q} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          11. CONTACT FORM
      ════════════════════════════════════════ */}
      <section id="contact" style={sectionPad} className="section-pad">
        <div style={container}>
          <div className="grid-2" style={{ alignItems: 'start', gap: '4rem' }}>
            {/* Left: info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
                  color: C.white,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '0.35rem 1.1rem',
                  borderRadius: '999px',
                  marginBottom: '1.25rem',
                }}
              >
                Nous Contacter
              </span>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 900,
                  color: C.text,
                  textTransform: 'uppercase',
                  lineHeight: 1.05,
                  marginBottom: '1rem',
                }}
              >
                Parlons de votre{' '}
                <span style={{ color: C.accent }}>projet</span>
              </h2>
              <p style={{ color: C.textMuted, fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                Urgence ou projet de rénovation, notre équipe est à votre écoute. Devis gratuit sous 1h, intervention rapide garantie.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: '📞', label: 'Téléphone', value: '01 42 00 00 00', sub: 'Urgences 24h/24' },
                  { icon: '📧', label: 'Email', value: 'contact@aquaprestige.fr', sub: 'Réponse sous 2h en journée' },
                  { icon: '📍', label: 'Adresse', value: '15 Rue de la Pompe, Paris 16e', sub: 'Bureau ouvert lun-sam 8h-19h' },
                ].map((info) => (
                  <div key={info.label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `rgba(30,143,191,0.12)`,
                        border: `1px solid rgba(30,143,191,0.25)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <TemplateIcon emoji={info.icon} size={20} />
                    </div>
                    <div>
                      <div style={{ color: C.textMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{info.label}</div>
                      <div style={{ color: C.text, fontWeight: 600, fontSize: '0.95rem' }}>{info.value}</div>
                      <div style={{ color: C.textMuted, fontSize: '0.78rem' }}>{info.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: '20px',
                  padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                }}
              >
                <AnimatePresence mode="wait">
                  {formSent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ textAlign: 'center', padding: '3rem 1rem' }}
                    >
                      <div style={{ marginBottom: '1rem' }}><TemplateIcon emoji="✅" size={56} /></div>
                      <h3
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: '1.8rem',
                          fontWeight: 800,
                          color: C.text,
                          textTransform: 'uppercase',
                          marginBottom: '0.75rem',
                        }}
                      >
                        Message envoyé !
                      </h3>
                      <p style={{ color: C.textMuted, fontSize: '0.95rem', lineHeight: 1.7 }}>
                        Merci pour votre message. Notre équipe vous contactera dans les meilleurs délais, généralement sous 1h en journée.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleFormSubmit}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                    >
                      <h3
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: '1.5rem',
                          fontWeight: 800,
                          color: C.text,
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Demande de Devis Gratuit
                      </h3>
                      <div className="form-row">
                        <div>
                          <label style={{ display: 'block', color: C.textMuted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                            Nom complet *
                          </label>
                          <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="Jean Dupont"
                            className="ap-input"
                            style={{
                              width: '100%',
                              background: C.bgAlt,
                              border: `1px solid ${C.border}`,
                              borderRadius: '10px',
                              padding: '0.85rem 1.1rem',
                              color: C.text,
                              fontFamily: "'Inter', sans-serif",
                              fontSize: '0.92rem',
                              outline: 'none',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: C.textMuted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                            Téléphone *
                          </label>
                          <input
                            required
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            placeholder="06 00 00 00 00"
                            className="ap-input"
                            style={{
                              width: '100%',
                              background: C.bgAlt,
                              border: `1px solid ${C.border}`,
                              borderRadius: '10px',
                              padding: '0.85rem 1.1rem',
                              color: C.text,
                              fontFamily: "'Inter', sans-serif",
                              fontSize: '0.92rem',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', color: C.textMuted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                          Adresse email *
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="jean@email.com"
                          className="ap-input"
                          style={{
                            width: '100%',
                            background: C.bgAlt,
                            border: `1px solid ${C.border}`,
                            borderRadius: '10px',
                            padding: '0.85rem 1.1rem',
                            color: C.text,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.92rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: C.textMuted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                          Service souhaité
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleFormChange}
                          className="ap-input"
                          style={{
                            width: '100%',
                            background: C.bgAlt,
                            border: `1px solid ${C.border}`,
                            borderRadius: '10px',
                            padding: '0.85rem 1.1rem',
                            color: formData.service ? C.text : C.textMuted,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.92rem',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="">Sélectionner un service...</option>
                          {SERVICES.map((s) => (
                            <option key={s.title} value={s.title}>{s.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', color: C.textMuted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                          Décrivez votre besoin *
                        </label>
                        <textarea
                          required
                          name="message"
                          value={formData.message}
                          onChange={handleFormChange}
                          rows={4}
                          placeholder="Ex: Fuite sous l'évier cuisine, eau qui coule depuis ce matin..."
                          className="ap-input"
                          style={{
                            width: '100%',
                            background: C.bgAlt,
                            border: `1px solid ${C.border}`,
                            borderRadius: '10px',
                            padding: '0.85rem 1.1rem',
                            color: C.text,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.92rem',
                            outline: 'none',
                            resize: 'vertical',
                            minHeight: '110px',
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          width: '100%',
                          background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
                          color: C.white,
                          border: 'none',
                          borderRadius: '12px',
                          padding: '1rem',
                          fontSize: '1rem',
                          fontWeight: 700,
                          fontFamily: "'Barlow Condensed', sans-serif",
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          boxShadow: `0 8px 28px rgba(30,143,191,0.35)`,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 36px rgba(30,143,191,0.5)`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px rgba(30,143,191,0.35)`;
                        }}
                      >
                        Envoyer ma demande →
                      </button>
                      <p style={{ color: C.textMuted, fontSize: '0.75rem', textAlign: 'center' }}>
                        🔒 Vos données sont protégées — Devis gratuit et sans engagement
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          12. FOOTER
      ════════════════════════════════════════ */}
      <footer
        style={{
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          padding: '4rem 0 0',
        }}
      >
        <div style={container}>
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Droplets style={{ width: 21, height: 21 }} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: C.white,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                    }}
                  >{fd?.businessName ?? "Aqua Prestige"}</div>
                  <div style={{ fontSize: '0.65rem', color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Plomberie & Sanitaire
                  </div>
                </div>
              </div>
              <p style={{ color: C.textMuted, fontSize: '0.88rem', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '280px' }}>
                Artisans plombiers certifiés depuis 2010. Dépannage, installation et rénovation dans Paris et Île-de-France.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                  <div
                    key={social}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${C.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: C.textMuted,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = C.accent;
                      (e.currentTarget as HTMLElement).style.color = C.accent;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = C.border;
                      (e.currentTarget as HTMLElement).style.color = C.textMuted;
                    }}
                    title={social}
                  >
                    {social === 'Facebook' ? 'f' : social === 'Instagram' ? 'ig' : 'in'}
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: C.text,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '1.25rem',
                }}
              >
                Services
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {SERVICES.map((s) => (
                  <li key={s.title}>
                    <a
                      href="#services"
                      onClick={(e) => handleNavClick(e, '#services')}
                      style={{
                        color: C.textMuted,
                        textDecoration: 'none',
                        fontSize: '0.88rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.accentLight)}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Liens */}
            <div>
              <h4
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: C.text,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '1.25rem',
                }}
              >
                Liens rapides
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      style={{
                        color: C.textMuted,
                        textDecoration: 'none',
                        fontSize: '0.88rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.accentLight)}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: C.text,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '1.25rem',
                }}
              >
                Contact
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <a
                  href={`tel:${fd?.phone ?? "+33142000000"}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
                    color: C.white,
                    padding: '0.7rem 1.1rem',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: `0 4px 16px rgba(30,143,191,0.3)`,
                  }}
                >
                  01 42 00 00 00
                </a>
                <div style={{ color: C.textMuted, fontSize: '0.83rem', lineHeight: 1.7 }}>
                  <div>{fd?.email ?? "contact@aquaprestige.fr"}</div>
                  <div style={{ marginTop: '0.4rem' }}>15 Rue de la Pompe, Paris 16e</div>
                  <div style={{ marginTop: '0.4rem' }}>Lun–Sam : 8h – 19h</div>
                  <div>Urgences : 24h/24</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              marginTop: '3rem',
              padding: '1.25rem 0',
              borderTop: `1px solid ${C.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <p style={{ color: C.textMuted, fontSize: '0.78rem' }}>
              © {new Date().getFullYear()} Aqua Prestige — Tous droits réservés. SIRET : 512 345 678 00019
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Mentions légales', 'Politique de confidentialité', 'CGV'].map((item) => (
                <a
                  key={item}
                  href="#contact"
                  style={{
                    color: C.textMuted,
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.text)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
