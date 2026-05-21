'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import { TemplateIcon } from '@/components/TemplateIcon';
import { Flame } from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0a0c10',
  bgAlt: '#0f1218',
  bgCard: '#13171f',
  text: '#e8edf5',
  textMuted: '#8a95a8',
  accent: '#e85c0c',
  accentDark: '#b84208',
  accentLight: '#ff7a30',
  border: '#1e2530',
  borderLight: '#2a3340',
  white: '#ffffff',
};

// ─── Google Fonts + Global Reset + Responsive Grid Classes ───────────────────
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.bg}; color: ${C.text}; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
    ::selection { background: ${C.accent}; color: ${C.white}; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${C.bg}; }
    ::-webkit-scrollbar-thumb { background: ${C.accent}; border-radius: 3px; }

    @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.82} 75%{opacity:0.95} }
    @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px ${C.accent}44} 50%{box-shadow:0 0 40px ${C.accent}88} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes fadeup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

    /* ── Responsive Grid System ──────────────────────────────── */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
      align-items: start;
    }
    .grid-2-center {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
      align-items: center;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    .grid-6 {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1rem;
    }
    .grid-footer {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem;
    }
    .grid-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    /* ── Nav responsive ─────────────────────────────────────── */
    .nav-desktop { display: flex; align-items: center; gap: 2rem; }
    .nav-hamburger { display: none; }

    /* ── Section padding ─────────────────────────────────────── */
    .section-pad { padding: 6.25rem 1.5rem; }

    /* ── Tablet ─────────────────────────────────────────────── */
    @media (max-width: 1100px) {
      .nav-desktop { display: none !important; }
      .nav-hamburger { display: flex !important; }
      .grid-footer { grid-template-columns: 1fr 1fr; }
      .grid-6 { grid-template-columns: repeat(3, 1fr); }
    }

    @media (max-width: 900px) {
      .grid-2 { grid-template-columns: 1fr !important; gap: 3rem !important; }
      .grid-2-center { grid-template-columns: 1fr !important; gap: 3rem !important; }
      .grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
      .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      .section-pad { padding: 4.5rem 1.25rem; }
    }

    /* ── Mobile ─────────────────────────────────────────────── */
    @media (max-width: 640px) {
      .grid-3 { grid-template-columns: 1fr !important; }
      .grid-4 { grid-template-columns: 1fr !important; }
      .grid-6 { grid-template-columns: repeat(2, 1fr) !important; }
      .grid-footer { grid-template-columns: 1fr !important; }
      .grid-form { grid-template-columns: 1fr !important; }
      .section-pad { padding: 3.5rem 1rem; }
      .hero-ctas { flex-direction: column !important; }
      .hero-ctas a { width: 100% !important; text-align: center !important; justify-content: center !important; }
      .hero-stats { grid-template-columns: 1fr !important; }
      .contact-info-cards { gap: 1rem !important; }
      .footer-bottom { flex-direction: column !important; align-items: flex-start !important; }
      .footer-badges { flex-wrap: wrap !important; }
    }

    @media (max-width: 420px) {
      .grid-6 { grid-template-columns: 1fr !important; }
    }

    /* ── Touch hover overrides ───────────────────────────────── */
    @media (hover: none) {
      button:active { opacity: 0.8; }
    }
  `}</style>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatCardProps   { value: number; suffix: string; label: string; prefix?: string; }
interface ServiceCardProps { icon: string; title: string; desc: string; badge?: string; index: number; }
interface ProcessStepProps { num: string; title: string; desc: string; index: number; }
interface CertCardProps   { icon: string; title: string; sub: string; index: number; }
interface ProjectCardProps { type: string; location: string; surface: string; year: string; tag: string; index: number; }
interface TeamCardProps   { name: string; role: string; years: number; specialty: string; index: number; }
interface TestimonialCardProps { name: string; city: string; text: string; service: string; index: number; }
interface FAQItemProps    { q: string; a: string; isOpen: boolean; onToggle: () => void; index: number; }

// ─── Animated Counter Hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, prefix = '' }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const count = useCounter(value, 2000, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        textAlign: 'center',
        padding: '2.25rem 1.5rem',
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${C.accentDark}, ${C.accent}, ${C.accentLight})`,
      }} />
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 'clamp(40px, 6vw, 68px)',
        fontWeight: 900,
        color: C.accent,
        lineHeight: 1,
        letterSpacing: '-1px',
      }}>
        {prefix}{count.toLocaleString('fr-FR')}{suffix}
      </div>
      <div style={{
        color: C.textMuted, fontSize: 13, marginTop: 8,
        fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </motion.div>
  );
}

// ─── ServiceCard ──────────────────────────────────────────────────────────────
function ServiceCard({ icon, title, desc, badge, index }: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(135deg, ${C.bgCard}, #1a1f2b)` : C.bgCard,
        border: `1px solid ${hovered ? C.accent : C.border}`,
        borderRadius: 20,
        padding: 'clamp(1.25rem, 3vw, 2.25rem)',
        cursor: 'default',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {badge && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: C.accent, color: C.white,
          fontSize: 10, fontWeight: 700, padding: '3px 10px',
          borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>{badge}</div>
      )}
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: `linear-gradient(135deg, ${C.accent}22, ${C.accent}44)`,
        border: `1px solid ${C.accent}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
        transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
      }}><TemplateIcon emoji={icon} size={26} /></div>
      <h3 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 'clamp(18px, 2.5vw, 22px)',
        fontWeight: 700, color: C.white,
        marginBottom: 8, letterSpacing: '0.02em',
      }}>{title}</h3>
      <p style={{ color: C.textMuted, fontSize: 'clamp(13px, 1.5vw, 14.5px)', lineHeight: 1.7 }}>{desc}</p>
      <div style={{
        marginTop: 18,
        display: 'flex', alignItems: 'center', gap: 6,
        color: C.accent, fontSize: 13, fontWeight: 600,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease',
      }}>En savoir plus <span>→</span></div>
    </motion.div>
  );
}

// ─── ProcessStep ──────────────────────────────────────────────────────────────
function ProcessStep({ num, title, desc, index }: ProcessStepProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
    >
      <div style={{
        flexShrink: 0, width: 60, height: 60, borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 24, fontWeight: 900, color: C.white,
        boxShadow: `0 0 28px ${C.accent}44`,
      }}>{num}</div>
      <div style={{ flex: 1, paddingTop: 6 }}>
        <h3 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'clamp(17px, 2vw, 20px)',
          fontWeight: 700, color: C.white, marginBottom: 6, letterSpacing: '0.02em',
        }}>{title}</h3>
        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── CertCard ─────────────────────────────────────────────────────────────────
function CertCard({ icon, title, sub, index }: CertCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: '1.5rem 1rem', textAlign: 'center',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 300, delay: index * 0.08 + 0.25 }}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
        }}
      ><TemplateIcon emoji={icon} size={20} /></motion.div>
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 'clamp(13px, 1.5vw, 16px)', fontWeight: 700, color: C.white, marginBottom: 4,
      }}>{title}</div>
      <div style={{ color: C.textMuted, fontSize: 11.5 }}>{sub}</div>
    </motion.div>
  );
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────
function ProjectCard({ type, location, surface, year, tag, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);

  const gradients = [
    'linear-gradient(135deg, #1a0f05, #2d1a0a)',
    'linear-gradient(135deg, #0a1a1f, #0d2530)',
    'linear-gradient(135deg, #1a1005, #2d2008)',
    'linear-gradient(135deg, #150a1a, #22103a)',
    'linear-gradient(135deg, #0a1a12, #0d2a1a)',
    'linear-gradient(135deg, #1a0a0a, #2d1010)',
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.09 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: gradients[index % 6],
        border: `1px solid ${hovered ? C.accent + '88' : C.border}`,
        borderRadius: 16, padding: '1.75rem 1.5rem',
        cursor: 'default', transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle, ${C.accent}22, transparent)`,
        borderRadius: '0 16px 0 80px',
      }} />
      <div style={{
        display: 'inline-block',
        background: `${C.accent}22`, border: `1px solid ${C.accent}44`,
        color: C.accent, fontSize: 10.5, fontWeight: 700,
        padding: '3px 10px', borderRadius: 20,
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14,
      }}>{tag}</div>
      <h3 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 'clamp(16px, 2vw, 19px)',
        fontWeight: 700, color: C.white, marginBottom: 12,
      }}>{type}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'Lieu', val: location },
          { label: 'Surface', val: surface },
          { label: 'Année', val: year },
        ].map(({ label, val }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: C.textMuted }}>{label}</span>
            <span style={{ color: C.text, fontWeight: 500 }}>{val}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── TeamCard ─────────────────────────────────────────────────────────────────
function TeamCard({ name, role, years, specialty, index }: TeamCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);
  const avatarColors = ['#e85c0c', '#0c8ae8', '#0ce87a'];
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bgCard, border: `1px solid ${hovered ? C.accent : C.border}`,
        borderRadius: 20, padding: '2.25rem 1.75rem', textAlign: 'center',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}
    >
      <div style={{
        width: 76, height: 76, borderRadius: '50%',
        background: `linear-gradient(135deg, ${avatarColors[index % 3]}, ${avatarColors[index % 3]}88)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 18px',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 28, fontWeight: 800, color: C.white,
        border: `3px solid ${avatarColors[index % 3]}44`,
        boxShadow: `0 0 20px ${avatarColors[index % 3]}33`,
      }}>{initials}</div>
      <h3 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 'clamp(18px, 2.5vw, 22px)',
        fontWeight: 700, color: C.white, marginBottom: 4,
      }}>{name}</h3>
      <div style={{ color: C.accent, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{role}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{
          background: `${C.accent}18`, border: `1px solid ${C.accent}33`,
          color: C.textMuted, fontSize: 12, padding: '3px 10px', borderRadius: 20,
        }}>{years} ans d'exp.</div>
        <div style={{
          background: C.bgAlt, border: `1px solid ${C.border}`,
          color: C.textMuted, fontSize: 12, padding: '3px 10px', borderRadius: 20,
        }}>{specialty}</div>
      </div>
    </motion.div>
  );
}

// ─── TestimonialCard ──────────────────────────────────────────────────────────
function TestimonialCard({ name, city, text, service, index }: TestimonialCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      style={{
        background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: 16, padding: '1.75rem 1.5rem', position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', top: -1, left: 24, right: 24, height: 2,
        background: `linear-gradient(90deg, transparent, ${C.accent}66, transparent)`,
      }} />
      <div style={{ color: '#f5a623', fontSize: 15, marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
      <p style={{
        color: C.text, fontSize: 'clamp(13px, 1.5vw, 14.5px)',
        lineHeight: 1.75, fontStyle: 'italic', marginBottom: 20,
      }}>"{text}"</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.white }}>{name}</div>
          <div style={{ color: C.textMuted, fontSize: 12 }}>{city}</div>
        </div>
        <div style={{
          background: `${C.accent}18`, border: `1px solid ${C.accent}33`,
          color: C.accent, fontSize: 11, padding: '3px 10px',
          borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap',
        }}>{service}</div>
      </div>
    </motion.div>
  );
}

// ─── FAQItem ──────────────────────────────────────────────────────────────────
function FAQItem({ q, a, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        border: `1px solid ${isOpen ? C.accent + '66' : C.border}`,
        borderRadius: 12, overflow: 'hidden',
        transition: 'border-color 0.3s ease',
        background: isOpen ? `${C.accent}08` : C.bgCard,
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '1.25rem 1.5rem',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'clamp(16px, 2vw, 18px)',
          fontWeight: 700, color: isOpen ? C.accent : C.white,
          transition: 'color 0.3s ease', flex: 1, paddingRight: 16,
        }}>{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            flexShrink: 0, width: 26, height: 26,
            background: isOpen ? C.accent : C.border,
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: C.white, fontSize: 18, fontWeight: 300,
            transition: 'background 0.3s ease',
          }}
        >+</motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 1.5rem 1.25rem',
              color: C.textMuted, fontSize: 14.5, lineHeight: 1.8,
            }}>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── FireBar ──────────────────────────────────────────────────────────────────
function FireBar({ delay, left, height }: { delay: number; left: string; height: number }) {
  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: [0.15, 0.35, 0.15] }}
      transition={{
        scaleY: { duration: 1.2, delay },
        opacity: { duration: 2.5, delay, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute', bottom: 0, left,
        width: 3, height, borderRadius: '2px 2px 0 0',
        background: `linear-gradient(to top, ${C.accentDark}, ${C.accent}, ${C.accentLight}aa, transparent)`,
        transformOrigin: 'bottom', filter: 'blur(1px)', pointerEvents: 'none',
      }}
    />
  );
}

// ─── SectionHeading ───────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, accent, subtitle }: { eyebrow: string; title: string; accent: string; subtitle?: string; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: 'center', marginBottom: '4rem' }}
    >
      <div style={{
        color: C.accent, fontSize: 12, fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14,
      }}>{eyebrow}</div>
      <h2 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 'clamp(32px, 5vw, 56px)',
        fontWeight: 800, color: C.white,
        lineHeight: 1.1, marginBottom: subtitle ? 16 : 0,
      }}>
        {title}<br />
        <span style={{ color: C.accent }}>{accent}</span>
      </h2>
      {subtitle && (
        <p style={{
          color: C.textMuted, fontSize: 'clamp(14px, 1.8vw, 16px)',
          maxWidth: 520, margin: '0 auto', lineHeight: 1.7,
        }}>{subtitle}</p>
      )}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ThermaProPage() {

  // ── State ────────────────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [openFaq, setOpenFaq]     = useState<number | null>(null);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData]   = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ── Scroll / parallax ───────────────────────────────────────────────────
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY    = useTransform(heroProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const barsY    = useTransform(heroProgress, [0, 1], ['0%', '25%']);

  const springScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 });
  const navBg     = useTransform(springScrollY, [0, 80], ['rgba(10,12,16,0)', 'rgba(10,12,16,0.97)']);
  const navShadow = useTransform(springScrollY, [0, 80], ['0 0 0 rgba(0,0,0,0)', '0 4px 40px rgba(0,0,0,0.6)']);

  // Unused but declared to satisfy the useMotionValue import requirement
  const _mv = useMotionValue(0);

  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  // ── Form submit ──────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setTimeout(() => setFormState('success'), 2200);
  };

  // ── Static data ──────────────────────────────────────────────────────────
  const navLinks = [
    { label: 'Services',      href: '#services' },
    { label: 'Réalisations',  href: '#realisations' },
    { label: 'Équipe',        href: '#equipe' },
    { label: 'Avis clients',  href: '#avis' },
    { label: 'Contact',       href: '#contact' },
  ];

  const services = [
    {
      icon: '🔥', title: 'Chaudières gaz & fuel',
      desc: 'Installation et remplacement de chaudières à condensation haute performance. Marques Viessmann, Bosch, Vaillant. Jusqu\'à 30% d\'économies garanties sur votre facture énergétique.',
      badge: 'RGE',
    },
    {
      icon: '♨️', title: 'Pompes à chaleur',
      desc: 'PAC air/eau, air/air et géothermiques certifiées QualiPAC. Systèmes inverter ultra-silencieux, performants même à −20°C. Éligible MaPrimeRénov\' et CEE.',
      badge: 'Primes',
    },
    {
      icon: '❄️', title: 'Climatisation',
      desc: 'Systèmes split mono et multisplit pour maison ou bureau. Climatisation réversible pour chauffer en hiver et rafraîchir en été, avec régulation intelligente.',
    },
    {
      icon: '🛠️', title: 'Entretien & contrats',
      desc: 'Contrats annuels pour chaudières et PAC. Vérification complète, nettoyage, réglages optimaux et rapport d\'intervention détaillé remis immédiatement.',
    },
    {
      icon: '🚨', title: 'Urgences 24h/7j',
      desc: 'Panne de chauffage ? Notre équipe d\'astreinte intervient dans toute la métropole lyonnaise en moins de 2h, week-ends et jours fériés inclus.',
      badge: '24/7',
    },
    {
      icon: '🌡️', title: 'Plancher chauffant',
      desc: 'Installation de plancher chauffant hydraulique ou électrique. Confort thermique optimal, chaleur homogène du sol au plafond. Économies de 15 à 20% versus radiateurs.',
    },
  ];

  const process = [
    {
      num: '01', title: 'Diagnostic gratuit à domicile',
      desc: 'Un technicien certifié RGE se déplace chez vous pour évaluer votre installation existante, vos besoins énergétiques et la configuration du logement. Devis détaillé offert sous 48h.',
    },
    {
      num: '02', title: 'Aide au financement',
      desc: 'Nos conseillers vous accompagnent pour maximiser vos aides : MaPrimeRénov\', CEE, éco-prêt à taux zéro (jusqu\'à 50 000€), subventions locales. Jusqu\'à 70% du coût pris en charge.',
    },
    {
      num: '03', title: 'Installation certifiée RGE',
      desc: 'Nos techniciens qualifiés réalisent l\'installation dans les règles de l\'art. Chantier propre, respect des délais, mise en service complète avec démonstration et prise en main.',
    },
    {
      num: '04', title: 'Suivi & garantie 5 ans',
      desc: 'Garantie pièces et main d\'œuvre pendant 5 ans. Suivi de performance via notre application, maintenance préventive incluse la première année, assistance téléphonique permanente.',
    },
  ];

  const certs = [
    { icon: '🏅', title: 'RGE QualiPAC', sub: 'Pompes à chaleur certifiées' },
    { icon: '🪵', title: 'Qualibois',    sub: 'Chauffage au bois certifié' },
    { icon: '🔵', title: 'Qualigaz',     sub: 'Gaz naturel & propane' },
    { icon: '🎯', title: 'MaPrimeRénov\'', sub: 'Partenaire agréé ANAH' },
    { icon: '⚡', title: 'QualiPV',      sub: 'Photovoltaïque & solaire' },
    { icon: '🏆', title: 'Viessmann Gold', sub: 'Partenaire distributeur officiel' },
  ];

  const projects = [
    { type: 'PAC air/eau + plancher chauffant',       location: 'Lyon 6e',            surface: '180 m²',   year: '2024', tag: 'Résidentiel' },
    { type: 'Chaudière condensation gaz',              location: 'Villeurbanne',       surface: '95 m²',    year: '2024', tag: 'Résidentiel' },
    { type: 'Climatisation multisplit 5 groupes',      location: 'Bron',               surface: '220 m²',   year: '2024', tag: 'Commercial'  },
    { type: 'PAC géothermique sol/eau',                location: 'Caluire-et-Cuire',   surface: '350 m²',   year: '2023', tag: 'Résidentiel' },
    { type: 'Remplacement fuel → PAC air/eau',         location: 'Écully',             surface: '145 m²',   year: '2023', tag: 'Rénovation'  },
    { type: 'Réseau de chauffage collectif',           location: 'Décines-Charpieu',   surface: '1 200 m²', year: '2023', tag: 'Collectif'   },
  ];

  const team = [
    { name: 'Marc Durand',    role: 'Directeur Technique',      years: 22, specialty: 'PAC & Géothermie'      },
    { name: 'Sophie Laurent', role: 'Responsable Chantiers',    years: 14, specialty: 'Planchers chauffants'  },
    { name: 'Karim Benali',   role: 'Chef Technicien',          years: 17, specialty: 'Chaudières & gaz'      },
  ];

  const testimonials = [
    { name: 'Pierre M.',       city: 'Lyon 3e',           text: 'Intervention ultra rapide un dimanche soir pour une panne de chaudière. Technicien très compétent, prix honnête, chaudière réparée en 1h. Je recommande chaudement !',                                service: 'Urgence'      },
    { name: 'Nathalie B.',     city: 'Villeurbanne',      text: 'Installation d\'une PAC air/eau complète avec plancher chauffant. Chantier propre et dans les délais annoncés. Les économies sont au rendez-vous : −40% sur ma facture de gaz.',                     service: 'PAC'          },
    { name: 'François T.',     city: 'Bron',              text: 'Therma Pro a géré l\'intégralité des démarches MaPrimeRénov\' pour moi. Simple, rapide, et l\'équipe est vraiment professionnelle. Je n\'ai eu qu\'à signer. Merci !',                             service: 'Financement'  },
    { name: 'Isabelle C.',     city: 'Caluire-et-Cuire',  text: 'Devis clair et honnête, pas de mauvaise surprise à la facture. L\'installation de la clim réversible est parfaite, vraiment silencieuse, et économique. Top service !',                             service: 'Climatisation'},
    { name: 'Julien R.',       city: 'Écully',            text: 'Remplacement de ma vieille chaudière fuel par une PAC. Marc a été transparent sur tout depuis le début. Le résultat est bluffant — maison bien chaude et économies immédiates.',                     service: 'Rénovation'   },
    { name: 'Marie-Anne D.',   city: 'Décines-Charpieu',  text: 'Contrat d\'entretien annuel depuis 3 ans, toujours ponctuel, toujours professionnel. On sent que ce sont des gens qui aiment leur métier. Bravo à toute l\'équipe de Therma Pro.',                   service: 'Entretien'    },
  ];

  const faqs = [
    {
      q: 'Quelles aides financières puis-je obtenir pour une pompe à chaleur ?',
      a: 'En 2024, plusieurs dispositifs sont cumulables : MaPrimeRénov\' (jusqu\'à 5 000€ selon revenus), les Certificats d\'Économie d\'Énergie (CEE), l\'éco-prêt à taux zéro (jusqu\'à 50 000€ sur 20 ans), et certaines aides régionales. Nos conseillers font le point gratuit avec vous et gèrent les dossiers de A à Z. En moyenne, nos clients financent 60 à 70% du coût total via ces aides cumulées.',
    },
    {
      q: 'Quelle est la durée d\'une installation de pompe à chaleur ?',
      a: 'Une installation PAC air/eau standard prend généralement 2 à 3 jours de chantier selon la configuration du logement. Une installation incluant le plancher chauffant peut prendre 1 à 2 semaines. Nous planifions l\'intervention pour limiter les interruptions de chauffage et pouvons fournir un système de chauffage temporaire si nécessaire.',
    },
    {
      q: 'Ma chaudière tombe en panne la nuit, comment vous joindre ?',
      a: 'Notre service d\'urgence est disponible 24h/24, 7j/7, y compris les jours fériés. Appelez le 04 78 00 00 00, notre astreinte répond en moins de 5 minutes. Un technicien est dépêché chez vous en 2h maximum dans la métropole lyonnaise. Ce service est inclus dans nos contrats d\'entretien et disponible à la demande pour les autres clients.',
    },
    {
      q: 'Quelle est la différence entre une PAC air/air et air/eau ?',
      a: 'La PAC air/air capte les calories de l\'air extérieur et les distribue directement dans l\'air intérieur via des unités murales — idéale pour la climatisation réversible. La PAC air/eau transfère les calories à votre circuit de chauffage central (radiateurs basse température ou plancher chauffant) et peut aussi produire votre eau chaude sanitaire. L\'air/eau est généralement recommandée pour une rénovation thermique complète.',
    },
    {
      q: 'L\'entretien annuel est-il obligatoire pour les chaudières ?',
      a: 'Oui, l\'entretien annuel est obligatoire pour les chaudières au gaz, au fioul et au biogaz d\'une puissance comprise entre 4 et 400 kW (décret du 2 avril 2009). Le non-respect peut entraîner la nullité de votre assurance habitation en cas de sinistre. Nos contrats d\'entretien incluent la visite annuelle, le certificat légal, et un diagnostic complet de votre installation.',
    },
  ];

  const fireBars = [
    { left: '5%',  height: 320, delay: 0    },
    { left: '12%', height: 480, delay: 0.2  },
    { left: '20%', height: 240, delay: 0.4  },
    { left: '28%', height: 560, delay: 0.1  },
    { left: '36%', height: 300, delay: 0.35 },
    { left: '44%', height: 420, delay: 0.15 },
    { left: '52%', height: 280, delay: 0.45 },
    { left: '60%', height: 500, delay: 0.25 },
    { left: '68%', height: 360, delay: 0.05 },
    { left: '76%', height: 440, delay: 0.3  },
    { left: '84%', height: 320, delay: 0.5  },
    { left: '92%', height: 400, delay: 0.18 },
  ];

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    background: C.bgCard,
    border: `1px solid ${focusedField === name ? C.accent : C.border}`,
    borderRadius: 10, padding: '14px 16px',
    color: C.text, fontSize: 15,
    fontFamily: 'Inter, sans-serif', outline: 'none',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    boxShadow: focusedField === name ? `0 0 0 3px ${C.accent}22` : 'none',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', color: C.textMuted,
    fontSize: 12.5, fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6,
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <FontImport />

      {/* ════════════════════════════════════════════════════════════════════
          NAV
      ════════════════════════════════════════════════════════════════════ */}
      <motion.nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: navBg as any,
          boxShadow: navShadow as any,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'backdrop-filter 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72,
        }}>
          {/* Logo */}
          <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 14px ${C.accent}44`,
            }}><Flame style={{ width: 20, height: 20 }} /></div>
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(18px, 3vw, 22px)',
                fontWeight: 800, color: C.white, letterSpacing: '0.04em', lineHeight: 1,
              }}>THERMA PRO</div>
              <div style={{ color: C.accent, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em' }}>
                CHAUFFAGE · CLIMATISATION
              </div>
            </div>
          </a>

          {/* Desktop links */}
          <div className="nav-desktop">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} style={{
                color: C.textMuted, textDecoration: 'none',
                fontSize: 14, fontWeight: 500, transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
              >{link.label}</a>
            ))}
            <a href="tel:+33478000000" style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              color: C.white, textDecoration: 'none',
              padding: '10px 20px', borderRadius: 50,
              fontSize: 13.5, fontWeight: 700,
              boxShadow: `0 4px 20px ${C.accent}44`, whiteSpace: 'nowrap',
            }}>04 78 00 00 00</a>
          </div>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'none', border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '8px 12px',
              cursor: 'pointer', color: C.text, fontSize: 18,
            }}
          >{menuOpen ? '✕' : '☰'}</button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                overflow: 'hidden', background: C.bgAlt,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navLinks.map(link => (
                  <a key={link.label} href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      color: C.text, textDecoration: 'none',
                      padding: '0.85rem 0', fontSize: 16, fontWeight: 500,
                      borderBottom: `1px solid ${C.border}`,
                    }}>{link.label}</a>
                ))}
                <a href="tel:+33478000000" style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                  color: C.white, textDecoration: 'none',
                  padding: '14px 20px', borderRadius: 10,
                  fontSize: 15, fontWeight: 700, textAlign: 'center', marginTop: 12,
                }}>Appeler maintenant</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', alignItems: 'center',
          overflow: 'hidden', background: C.bg,
        }}
      >
        {/* Parallax fire bars */}
        <motion.div style={{ y: barsY, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {fireBars.map((bar, i) => (
            <FireBar key={i} left={bar.left} height={bar.height} delay={bar.delay} />
          ))}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${C.accent}0a, transparent 70%)`,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, transparent 40%, ${C.bg} 100%)`,
          }} />
        </motion.div>

        {/* Hero text */}
        <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(80px, 14vh, 120px) 1.5rem 5rem' }}>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: `${C.accent}18`, border: `1px solid ${C.accent}44`,
                borderRadius: 50, padding: '6px 16px', marginBottom: 28,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, animation: 'pulse-glow 2s infinite' }} />
              <span style={{ color: C.accent, fontSize: 'clamp(10px, 1.5vw, 12.5px)', fontWeight: 600, letterSpacing: '0.08em' }}>
                TECHNICIENS RGE CERTIFIÉS · RÉGION LYONNAISE
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(48px, 9vw, 110px)',
                fontWeight: 900, lineHeight: 0.92,
                color: C.white, marginBottom: 24,
                letterSpacing: '-1px', maxWidth: 900,
              }}
            >
              VOTRE CONFORT<br />
              <span style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>THERMIQUE</span><br />
              ENTRE NOS MAINS.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{
                color: C.textMuted, fontSize: 'clamp(15px, 2.2vw, 18px)', lineHeight: 1.7,
                maxWidth: 540, marginBottom: 40,
              }}
            >
              Spécialiste du chauffage, de la climatisation et des pompes à chaleur depuis 2009. Installation, entretien et dépannage 24h/7j dans toute la métropole lyonnaise.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="hero-ctas"
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}
            >
              <a href="#contact" style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                color: C.white, textDecoration: 'none',
                padding: '16px 32px', borderRadius: 50,
                fontSize: 'clamp(14px, 2vw, 15.5px)', fontWeight: 700,
                boxShadow: `0 8px 30px ${C.accent}55`,
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>Devis gratuit en 48h</a>
              <a href="tel:+33478000000" style={{
                background: 'none', border: `2px solid ${C.border}`,
                color: C.white, textDecoration: 'none',
                padding: '16px 32px', borderRadius: 50,
                fontSize: 'clamp(14px, 2vw, 15.5px)', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'border-color 0.3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >Urgence 24/7</a>
            </motion.div>

            {/* Inline hero stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="hero-stats"
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1, maxWidth: 600,
                background: C.border, borderRadius: 16,
                overflow: 'hidden', border: `1px solid ${C.border}`,
              }}
            >
              {[
                { val: '3 200+', label: 'Installations' },
                { val: '15 ans', label: 'D\'expérience' },
                { val: '< 2h',   label: 'Intervention urgence' },
              ].map(s => (
                <div key={s.label} style={{ background: C.bgCard, padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, color: C.accent,
                  }}>{s.val}</div>
                  <div style={{ color: C.textMuted, fontSize: 'clamp(10px, 1.5vw, 12px)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute', bottom: 28, left: '50%',
            transform: 'translateX(-50%)', color: C.textMuted,
            fontSize: 11, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 8, zIndex: 3,
          }}
        >
          <span style={{ letterSpacing: '0.1em' }}>DÉFILER</span>
          <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${C.accent}, transparent)` }} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
        className="section-pad"
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="grid-4">
            <StatCard value={3200} suffix="+"   label="Installations réalisées" />
            <StatCard value={98}   suffix="%"   label="Clients satisfaits"       />
            <StatCard value={15}   suffix=" ans" label="D'expertise métier"       />
            <StatCard value={2}    suffix="h"   label="Délai urgence max."       />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════════════════════════════════ */}
      <section id="services" style={{ background: C.bg }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeading
            eyebrow="Ce que nous faisons"
            title="Nos Services"
            accent="d'Expertise"
            subtitle="Solutions complètes pour le chauffage, la climatisation et la rénovation énergétique de votre logement."
          />
          <div className="grid-3">
            {services.map((s, i) => (
              <ServiceCard key={s.title} index={i} icon={s.icon} title={s.title} desc={s.desc} badge={s.badge} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PROCESS
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bgAlt }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="grid-2-center">
            {/* Left */}
            <div>
              <div style={{ color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>
                Comment ça marche
              </div>
              <h2 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(32px, 5vw, 54px)',
                fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 16,
              }}>
                Notre Processus<br />
                <span style={{ color: C.accent }}>en 4 Étapes</span>
              </h2>
              <p style={{ color: C.textMuted, fontSize: 'clamp(14px, 1.8vw, 15.5px)', lineHeight: 1.75, marginBottom: 32 }}>
                De la prise de contact au suivi long terme, chaque étape est pensée pour vous garantir sérénité et performance.
              </p>
              <a href="#contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                color: C.white, textDecoration: 'none',
                padding: '14px 28px', borderRadius: 50,
                fontSize: 14.5, fontWeight: 700,
                boxShadow: `0 6px 24px ${C.accent}44`,
              }}>Commencer mon projet →</a>
            </div>
            {/* Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
              {process.map((p, i) => (
                <ProcessStep key={p.num} index={i} num={p.num} title={p.title} desc={p.desc} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CERTIFICATIONS
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeading
            eyebrow="Qualifications & Labels"
            title="Certifications"
            accent="& Accréditations"
          />

          {/* Promo banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: `linear-gradient(135deg, ${C.accent}22, ${C.accentDark}11)`,
              border: `1px solid ${C.accent}44`, borderRadius: 20,
              padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(1.25rem, 3vw, 2.25rem)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800,
                color: C.white, marginBottom: 6,
              }}>Jusqu'à 70% d'aides sur votre installation</div>
              <div style={{ color: C.textMuted, fontSize: 'clamp(13px, 1.5vw, 14.5px)' }}>
                Grâce à notre statut RGE, vous êtes éligible à toutes les aides de l'État. Nos conseillers gèrent les dossiers pour vous.
              </div>
            </div>
            <a href="#contact" style={{
              flexShrink: 0, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              color: C.white, textDecoration: 'none',
              padding: '12px 24px', borderRadius: 50,
              fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
            }}>Je vérifie mes aides →</a>
          </motion.div>

          <div className="grid-6">
            {certs.map((c, i) => (
              <CertCard key={c.title} index={i} icon={c.icon} title={c.title} sub={c.sub} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          RÉALISATIONS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="realisations" style={{ background: C.bgAlt }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeading
            eyebrow="Nos Réalisations"
            title="Chantiers"
            accent="Récents"
            subtitle="Quelques exemples concrets de nos installations dans la métropole lyonnaise."
          />
          <div className="grid-3">
            {projects.map((p, i) => (
              <ProjectCard key={i} index={i} type={p.type} location={p.location} surface={p.surface} year={p.year} tag={p.tag} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TEAM
      ════════════════════════════════════════════════════════════════════ */}
      <section id="equipe" style={{ background: C.bg }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeading
            eyebrow="L'Équipe"
            title="Des Techniciens"
            accent="Passionnés"
            subtitle="Notre équipe cumule plus de 50 ans d'expérience combinée dans le génie climatique et thermique."
          />
          <div className="grid-3">
            {team.map((t, i) => (
              <TeamCard key={t.name} index={i} name={t.name} role={t.role} years={t.years} specialty={t.specialty} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="avis" style={{ background: C.bgAlt }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <div style={{ color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Témoignages</div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 12,
            }}>Ce que Disent<br /><span style={{ color: C.accent }}>Nos Clients</span></h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ color: '#f5a623', fontSize: 17, letterSpacing: 3 }}>★★★★★</div>
              <div style={{ color: C.textMuted, fontSize: 14 }}>4.9/5 sur 847 avis Google</div>
            </div>
          </motion.div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} index={i} name={t.name} city={t.city} text={t.text} service={t.service} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg }} className="section-pad">
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <SectionHeading
            eyebrow="Questions Fréquentes"
            title="Vos Questions,"
            accent="Nos Réponses"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i} index={i} q={faq.q} a={faq.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════════════════════════════════ */}
      <section id="contact" style={{ background: C.bgAlt }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="grid-2">
            {/* Left info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div style={{ color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>
                Demande de devis
              </div>
              <h2 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(32px, 5vw, 54px)',
                fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 16,
              }}>Parlons de<br /><span style={{ color: C.accent }}>Votre Projet</span></h2>
              <p style={{ color: C.textMuted, fontSize: 'clamp(14px, 1.8vw, 15.5px)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                Remplissez ce formulaire et un conseiller Therma Pro vous rappelle sous 24h pour un diagnostic gratuit à domicile.
              </p>

              <div className="contact-info-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: '📞', title: 'Urgence chauffage',    val: '04 78 00 00 00',    sub: 'Disponible 24h/7j'    },
                  { icon: '📍', title: 'Zone d\'intervention', val: 'Métropole de Lyon', sub: 'Ain, Isère, Rhône'    },
                  { icon: '✉️', title: 'Email',               val: 'contact@thermapro.fr', sub: 'Réponse sous 24h'  },
                ].map(info => (
                  <div key={info.title} style={{
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    padding: '1.25rem', background: C.bgCard,
                    border: `1px solid ${C.border}`, borderRadius: 14,
                  }}>
                    <div style={{
                      flexShrink: 0, width: 42, height: 42, borderRadius: 11,
                      background: `${C.accent}22`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}><TemplateIcon emoji={info.icon} size={20} /></div>
                    <div>
                      <div style={{ color: C.textMuted, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>{info.title}</div>
                      <div style={{ color: C.white, fontWeight: 600, fontSize: 14.5 }}>{info.val}</div>
                      <div style={{ color: C.textMuted, fontSize: 12.5 }}>{info.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div style={{
                background: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: 24, padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              }}>
                <AnimatePresence mode="wait">
                  {formState === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{ textAlign: 'center', padding: '2.5rem 1rem' }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                        style={{
                          width: 80, height: 80, borderRadius: '50%',
                          background: `linear-gradient(135deg, #22c55e, #16a34a)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto 24px', fontSize: 36,
                          boxShadow: '0 0 40px #22c55e44',
                        }}
                      >✓</motion.div>
                      <h3 style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 12,
                      }}>Demande envoyée !</h3>
                      <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.7 }}>
                        Merci {formData.name.split(' ')[0] || ''} ! Un conseiller Therma Pro vous contactera dans les 24h pour organiser votre diagnostic gratuit.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                    >
                      <div className="grid-form">
                        <div>
                          <label style={labelStyle}>Nom complet *</label>
                          <input
                            required value={formData.name}
                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Jean Dupont"
                            style={inputStyle('name')}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Téléphone *</label>
                          <input
                            required type="tel" value={formData.phone}
                            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="06 XX XX XX XX"
                            style={inputStyle('phone')}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Email</label>
                        <input
                          type="email" value={formData.email}
                          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="jean.dupont@email.fr"
                          style={inputStyle('email')}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>Type de service *</label>
                        <select
                          required value={formData.service}
                          onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                          onFocus={() => setFocusedField('service')}
                          onBlur={() => setFocusedField(null)}
                          style={{ ...inputStyle('service'), cursor: 'pointer' }}
                        >
                          <option value="">Sélectionnez un service</option>
                          <option value="pac">Pompe à chaleur</option>
                          <option value="chaudiere">Chaudière gaz / fuel</option>
                          <option value="clim">Climatisation</option>
                          <option value="plancher">Plancher chauffant</option>
                          <option value="entretien">Contrat d'entretien</option>
                          <option value="urgence">Urgence / dépannage</option>
                          <option value="autre">Autre / Question</option>
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>Votre message</label>
                        <textarea
                          rows={4} value={formData.message}
                          onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Décrivez votre projet (surface, installation actuelle, urgence…)"
                          style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 110 }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formState === 'loading'}
                        style={{
                          background: formState === 'loading'
                            ? C.borderLight
                            : `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                          color: C.white, border: 'none',
                          padding: '16px 28px', borderRadius: 50,
                          fontSize: 15.5, fontWeight: 700,
                          cursor: formState === 'loading' ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                          boxShadow: formState === 'loading' ? 'none' : `0 6px 24px ${C.accent}44`,
                          transition: 'all 0.3s ease', width: '100%',
                        }}
                      >
                        {formState === 'loading' ? (
                          <>
                            <div style={{
                              width: 18, height: 18, borderRadius: '50%',
                              border: `2px solid ${C.textMuted}44`,
                              borderTopColor: C.white,
                              animation: 'spin 0.7s linear infinite',
                            }} />
                            Envoi en cours…
                          </>
                        ) : 'Demander mon devis gratuit'}
                      </button>

                      <p style={{ color: C.textMuted, fontSize: 11.5, textAlign: 'center', lineHeight: 1.6 }}>
                        En soumettant ce formulaire, vous acceptez d'être recontacté par Therma Pro. Aucun démarchage, aucun spam.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: '#070910',
        borderTop: `1px solid ${C.border}`,
        padding: '4rem 1.5rem 2rem',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="grid-footer" style={{ marginBottom: '3.5rem', paddingBottom: '3rem', borderBottom: `1px solid ${C.border}` }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Flame style={{ width: 20, height: 20 }} /></div>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 20, fontWeight: 800, color: C.white, letterSpacing: '0.04em',
                  }}>THERMA PRO</div>
                  <div style={{ color: C.accent, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em' }}>
                    CHAUFFAGE · CLIMATISATION
                  </div>
                </div>
              </div>
              <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.75, maxWidth: 280, marginBottom: '1.5rem' }}>
                Votre expert en chauffage, climatisation et pompes à chaleur dans la métropole lyonnaise depuis 2009. RGE certifié, qualité garantie.
              </p>
              <a href="tel:+33478000000" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                color: C.white, textDecoration: 'none',
                padding: '11px 18px', borderRadius: 50,
                fontSize: 13.5, fontWeight: 700,
                boxShadow: `0 4px 18px ${C.accent}44`,
              }}>04 78 00 00 00 — 24h/7j</a>
            </div>

            {/* Services */}
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.white, marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
                Services
              </div>
              {['Chaudières gaz & fuel', 'Pompes à chaleur', 'Climatisation', 'Plancher chauffant', 'Entretien annuel', 'Urgences 24/7'].map(s => (
                <div key={s} style={{ marginBottom: 9 }}>
                  <a href="#services" style={{
                    color: C.textMuted, textDecoration: 'none', fontSize: 13.5, transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
                  >{s}</a>
                </div>
              ))}
            </div>

            {/* Zone */}
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.white, marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
                Zone d'intervention
              </div>
              {['Lyon (tous arrondissements)', 'Villeurbanne', 'Bron', 'Caluire-et-Cuire', 'Décines-Charpieu', 'Écully', 'Vénissieux', 'Tassin-la-Demi-Lune'].map(z => (
                <div key={z} style={{ marginBottom: 9 }}>
                  <span style={{ color: C.textMuted, fontSize: 13.5 }}>{z}</span>
                </div>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: C.white, marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
                Informations
              </div>
              {['Mentions légales', 'Politique de confidentialité', 'CGV', 'Certifications RGE', 'Aides & subventions', 'Blog thermique', 'Nous rejoindre'].map(l => (
                <div key={l} style={{ marginBottom: 9 }}>
                  <a href="#" style={{
                    color: C.textMuted, textDecoration: 'none', fontSize: 13.5, transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
                  >{l}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom" style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: '0.75rem',
          }}>
            <div style={{ color: C.textMuted, fontSize: 12.5 }}>
              © 2024 Therma Pro SAS · SIRET 123 456 789 00012 · RGE n° E-E200050
            </div>
            <div className="footer-badges" style={{ display: 'flex', gap: '0.75rem' }}>
              {['RGE Certifié', '4.9/5 Google', 'Garantie 5 ans'].map(badge => (
                <span key={badge} style={{
                  color: C.textMuted, fontSize: 12,
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap',
                }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
