'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Building2,
  MapPin,
  Search,
  ArrowRight,
  ArrowUpRight,
  Quote,
  Mail,
  Phone,
  Clock,
  Check,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   SOLIS IMMOBILIER — Premium real estate & architecture (Geolava-inspired)
   Warm-white editorial layout, Canvas building facade, count-ups, property grid
   ════════════════════════════════════════════════════════════════════════════ */

const C = {
  bg: '#fafaf8',
  bgSoft: '#f3f2ee',
  bgCard: '#ffffff',
  navy: '#1a1a2e',
  navySoft: '#2c2c46',
  gold: '#b8944a',
  goldSoft: '#cdab66',
  goldFaint: '#efe6d4',
  text: '#1a1a2e',
  textSoft: '#55556a',
  muted: '#8a8a9c',
  border: '#e6e4dc',
  borderDark: '#d6d4c8',
  font: "'Inter', system-ui, -apple-system, sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
} as const;

const pageStyle: React.CSSProperties = {
  background: C.bg,
  color: C.text,
  fontFamily: C.font,
  overflowX: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

const pad: React.CSSProperties = { paddingInline: 'clamp(20px, 6vw, 100px)' };
const radius = 2;

/* ─────────────────────────────────────────────────────────────────────────────
   Canvas: 12-floor building facade, windows light up sequentially
   ──────────────────────────────────────────────────────────────────────────── */

function BuildingFacade(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let w = 0;
    let h = 0;

    const floors = 12;
    const cols = 5;
    // Each window gets a lit-up "on time" so they light sequentially.
    const lit: number[] = [];
    for (let f = 0; f < floors; f++) {
      for (let c = 0; c < cols; c++) {
        lit.push((f * cols + c) * 90 + Math.random() * 200);
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      w = parent ? parent.clientWidth : 400;
      h = parent ? parent.clientHeight : 600;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const start = performance.now();
    const loop = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, w, h);

      const buildingW = Math.min(w * 0.7, 320);
      const margin = h * 0.08;
      const buildingH = h - margin * 2 - 30;
      const bx = (w - buildingW) / 2;
      const by = margin + 30;

      // sky gradient behind
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#f3f2ee');
      sky.addColorStop(1, '#e9e7df');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // building body
      const body = ctx.createLinearGradient(bx, 0, bx + buildingW, 0);
      body.addColorStop(0, '#23233a');
      body.addColorStop(0.5, '#2e2e4a');
      body.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = body;
      ctx.fillRect(bx, by, buildingW, buildingH);

      // subtle edge highlight
      ctx.strokeStyle = 'rgba(184,148,74,0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, buildingW, buildingH);

      // spire with pulse
      const spireH = 30 + Math.sin(t / 600) * 4;
      ctx.beginPath();
      ctx.moveTo(w / 2, by - spireH);
      ctx.lineTo(w / 2 - 4, by);
      ctx.lineTo(w / 2 + 4, by);
      ctx.closePath();
      ctx.fillStyle = C.gold;
      ctx.shadowColor = C.gold;
      ctx.shadowBlur = 12 + Math.sin(t / 400) * 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // windows
      const padX = buildingW * 0.1;
      const padY = buildingH * 0.05;
      const gridW = buildingW - padX * 2;
      const gridH = buildingH - padY * 2;
      const winW = (gridW / cols) * 0.62;
      const winH = (gridH / floors) * 0.55;
      const gapX = gridW / cols;
      const gapY = gridH / floors;

      let idx = 0;
      for (let f = 0; f < floors; f++) {
        for (let c = 0; c < cols; c++) {
          const wx = bx + padX + c * gapX + (gapX - winW) / 2;
          const wy = by + padY + f * gapY + (gapY - winH) / 2;
          const onTime = lit[idx];
          const isOn = t > onTime;
          // flicker some windows off slowly
          const flick = isOn ? 0.85 + Math.sin((t + idx * 300) / 1400) * 0.15 : 0.08;
          ctx.fillStyle = isOn ? `rgba(255,222,150,${flick})` : 'rgba(120,124,150,0.12)';
          if (isOn) {
            ctx.shadowColor = 'rgba(255,210,120,0.6)';
            ctx.shadowBlur = 6;
          }
          ctx.fillRect(wx, wy, winW, winH);
          ctx.shadowBlur = 0;
          // mullion
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(wx + winW / 2, wy);
          ctx.lineTo(wx + winW / 2, wy + winH);
          ctx.stroke();
          idx++;
        }
      }

      // entrance
      ctx.fillStyle = '#11111e';
      const doorW = buildingW * 0.22;
      ctx.fillRect(w / 2 - doorW / 2, by + buildingH - 28, doorW, 28);
      ctx.fillStyle = C.gold;
      ctx.fillRect(w / 2 - doorW / 2, by + buildingH - 4, doorW, 2);

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} suppressHydrationWarning style={{ display: 'block', width: '100%', height: '100%' }} />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Count-up stat
   ──────────────────────────────────────────────────────────────────────────── */

function CountUp({
  target,
  prefix = '',
  suffix = '',
  decimals = 0,
  label,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}): React.JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const dur = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return (
    <div
      ref={ref}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: radius,
        padding: '34px 28px',
        boxShadow: '0 1px 3px rgba(26,26,46,0.04)',
      }}
    >
      <div style={{ fontFamily: C.serif, fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600, color: C.navy, lineHeight: 1 }}>
        {prefix}
        {val.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </div>
      <div style={{ fontSize: 13, letterSpacing: '0.1em', color: C.muted, marginTop: 14, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   France SVG map with animated dots
   ──────────────────────────────────────────────────────────────────────────── */

function FranceMap(): React.JSX.Element {
  // simplified hexagon-ish France outline
  const outline =
    'M120 30 L180 40 L230 30 L260 70 L300 90 L290 140 L320 180 L290 230 L250 260 L210 290 L170 280 L130 250 L90 230 L60 180 L70 130 L50 90 L80 55 Z';
  // city coordinates within viewBox
  const cities: { name: string; x: number; y: number }[] = [
    { name: 'Paris', x: 175, y: 95 },
    { name: 'Lyon', x: 235, y: 175 },
    { name: 'Bordeaux', x: 115, y: 205 },
    { name: 'Marseille', x: 250, y: 250 },
    { name: 'Nantes', x: 95, y: 140 },
    { name: 'Toulouse', x: 165, y: 245 },
  ];
  return (
    <svg viewBox="0 0 360 320" style={{ width: '100%', maxWidth: 480 }}>
      <path d={outline} fill={C.bgSoft} stroke={C.borderDark} strokeWidth={1.5} />
      {cities.map((c, i) => (
        <g key={c.name}>
          <motion.circle
            cx={c.x}
            cy={c.y}
            r={14}
            fill={C.gold}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: [0, 0.3, 0], scale: [0, 2.2, 2.6] }}
            viewport={{ once: true }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
          />
          <motion.circle
            cx={c.x}
            cy={c.y}
            r={5}
            fill={C.gold}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.18 }}
          />
          <motion.text
            x={c.x + 10}
            y={c.y + 4}
            fontSize={12}
            fill={C.navy}
            fontFamily={C.font}
            fontWeight={600}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.18 }}
          >
            {c.name}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Reveal wrapper
   ──────────────────────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }): React.JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }): React.JSX.Element {
  return (
    <div
      style={{
        fontSize: 12,
        letterSpacing: '0.26em',
        color: C.gold,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: center ? 'center' : 'flex-start',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      <span style={{ width: 28, height: 1, background: C.gold }} />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Property card
   ──────────────────────────────────────────────────────────────────────────── */

function PropertyCard({
  name,
  area,
  price,
  location,
  gradient,
  delay,
}: {
  name: string;
  area: string;
  price: string;
  location: string;
  gradient: string;
  delay: number;
}): React.JSX.Element {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: radius,
          overflow: 'hidden',
          transition: 'transform .45s ease, box-shadow .45s ease',
          transform: hover ? 'translateY(-10px)' : 'translateY(0)',
          boxShadow: hover ? '0 24px 50px rgba(26,26,46,0.16)' : '0 2px 8px rgba(26,26,46,0.05)',
        }}
      >
        <div style={{ position: 'relative', aspectRatio: '4/3', background: gradient, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,46,0.55), transparent 55%)' }} />
          <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(250,250,248,0.92)', borderRadius: radius, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: C.navy, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={13} color={C.gold} /> {location}
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(26,26,46,0.55)',
              opacity: hover ? 1 : 0,
              transition: 'opacity .4s',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 600, letterSpacing: '0.04em', border: '1px solid rgba(255,255,255,0.6)', padding: '12px 22px', borderRadius: radius }}>
              Voir le projet <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
        <div style={{ padding: '24px 26px' }}>
          <div style={{ fontFamily: C.serif, fontSize: 26, fontWeight: 600, color: C.navy }}>{name}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
            <span style={{ fontSize: 14, color: C.textSoft }}>{area}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.gold }}>{price}</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Process step icons (animated SVG)
   ──────────────────────────────────────────────────────────────────────────── */

function PinIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 64 64" width={48} height={48}>
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        <path d="M32 10 C22 10 16 18 16 27 C16 38 32 54 32 54 C32 54 48 38 48 27 C48 18 42 10 32 10 Z" fill="none" stroke={C.gold} strokeWidth={2.5} />
        <circle cx={32} cy={26} r={6} fill={C.gold} />
      </motion.g>
      <motion.ellipse cx={32} cy={56} rx={10} ry={3} fill={C.gold} animate={{ opacity: [0.15, 0.4, 0.15], scaleX: [1, 1.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ originX: '32px', originY: '56px' }} />
    </svg>
  );
}

function HandshakeIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 64 64" width={48} height={48}>
      <motion.path
        d="M14 30 L24 24 L34 30 L44 24 L50 30"
        fill="none"
        stroke={C.gold}
        strokeWidth={2.5}
        strokeLinecap="round"
        animate={{ rotate: [0, 4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        style={{ originX: '32px', originY: '30px' }}
      />
      <path d="M14 30 L14 42 L26 46 L40 46 L50 42 L50 30" fill="none" stroke={C.gold} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KeyIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 64 64" width={48} height={48}>
      <motion.g animate={{ rotate: [0, 25, 0] }} transition={{ duration: 2.4, repeat: Infinity }} style={{ originX: '24px', originY: '28px' }}>
        <circle cx={24} cy={28} r={11} fill="none" stroke={C.gold} strokeWidth={2.5} />
        <circle cx={24} cy={28} r={4} fill={C.gold} />
        <path d="M33 33 L50 50 M44 44 L50 38 M40 48 L46 54" stroke={C.gold} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Contact form
   ──────────────────────────────────────────────────────────────────────────── */

function ContactForm(): React.JSX.Element {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', tel: '', type: 'Acquisition', message: '' });
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: radius,
    padding: '13px 15px',
    color: C.text,
    fontFamily: C.font,
    fontSize: 15,
    outline: 'none',
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      style={{ display: 'grid', gap: 14 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <input style={inputStyle} placeholder="Nom" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
        <input style={inputStyle} type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <input style={inputStyle} placeholder="Téléphone" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} />
        <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option>Acquisition</option>
          <option>Vente</option>
          <option>Investissement</option>
          <option>Conseil patrimonial</option>
        </select>
      </div>
      <textarea
        style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
        placeholder="Votre projet"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <button
        type="submit"
        style={{
          background: sent ? C.navySoft : C.navy,
          color: '#fff',
          border: 'none',
          borderRadius: radius,
          padding: '15px 22px',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {sent ? (
          <>
            <Check size={17} /> Message envoyé
          </>
        ) : (
          <>
            Prendre rendez-vous <ArrowRight size={17} />
          </>
        )}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FAQ accordion
   ──────────────────────────────────────────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '24px 4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 16,
        }}
      >
        <span style={{ fontFamily: C.serif, fontSize: 22, fontWeight: 600, color: C.navy }}>{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, color: C.gold, fontSize: 26, lineHeight: 1 }}>
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <p style={{ fontSize: 16, lineHeight: 1.75, color: C.textSoft, margin: '0 4px 24px', maxWidth: 720 }}>{a}</p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────────── */

export default function SolisPage(): React.JSX.Element {
  const properties = [
    { name: 'Le Domaine des Cèdres', area: 'Villa · 450 m²', price: '4,2 M€', location: 'Provence', gradient: 'linear-gradient(135deg, #c9b894, #8a7a55 60%, #5a4f38)' },
    { name: 'Tour Lumière', area: 'Penthouse · 280 m²', price: '6,8 M€', location: 'Paris 8ème', gradient: 'linear-gradient(135deg, #9aa3b8, #5a6480 60%, #2e3450)' },
    { name: 'Mas Garrigue', area: 'Maison · 320 m²', price: '2,9 M€', location: 'Saint-Rémy-de-Provence', gradient: 'linear-gradient(135deg, #d4c2a0, #a88f63 55%, #6e5c3c)' },
  ];

  const steps = [
    { icon: <PinIcon />, title: 'Prospection', desc: 'Identification des biens d’exception correspondant à votre cahier des charges et à vos objectifs patrimoniaux.' },
    { icon: <HandshakeIcon />, title: 'Négociation', desc: 'Nos experts négocient les meilleures conditions et sécurisent chaque étape juridique de la transaction.' },
    { icon: <KeyIcon />, title: 'Accompagnement', desc: 'De la remise des clés à la gestion locative, un interlocuteur dédié vous accompagne dans la durée.' },
  ];

  const testimonials = [
    { name: 'Alexandre M.', role: 'Directeur financier', text: 'Solis a transformé une recherche complexe en une expérience fluide. Leur connaissance du marché parisien est inégalée.' },
    { name: 'Marie-Sophie L.', role: 'Architecte', text: 'Un accompagnement d’une rare exigence. Chaque détail a été anticipé, de la visite à la signature.' },
  ];

  const faqs = [
    { q: 'Quels types de biens proposez-vous ?', a: 'Notre portefeuille couvre l’immobilier de prestige : villas, penthouses, hôtels particuliers, propriétés viticoles et immeubles de rapport. Chaque bien est sélectionné selon des critères stricts de qualité architecturale et d’emplacement.' },
    { q: 'Intervenez-vous en dehors de Paris ?', a: 'Oui. Nous opérons dans 14 villes françaises, avec une présence renforcée à Paris, Lyon, Bordeaux, Marseille, Nantes et Toulouse, ainsi que sur les marchés balnéaires et de montagne.' },
    { q: 'Comment se déroule l’accompagnement ?', a: 'Un conseiller dédié pilote l’ensemble du projet : définition du cahier des charges, sélection des biens, visites privées, négociation, montage juridique et financier, puis suivi post-acquisition incluant la gestion locative si souhaité.' },
    { q: 'Proposez-vous du conseil en investissement ?', a: 'Absolument. Notre pôle patrimonial analyse la rentabilité, la fiscalité et le potentiel de valorisation de chaque opération afin de structurer un investissement aligné sur vos objectifs.' },
  ];

  return (
    <main style={pageStyle}>
      {/* SECTION 1 — HERO */}
      <section style={{ ...pad, minHeight: '100vh', display: 'flex', alignItems: 'center', paddingBlock: 'clamp(90px, 12vh, 130px)', background: C.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 'clamp(30px, 5vw, 70px)', alignItems: 'center', width: '100%' }} className="solis-hero-grid">
          <div>
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <Building2 size={22} color={C.gold} />
                <span style={{ fontFamily: C.serif, fontSize: 24, fontWeight: 600, letterSpacing: '0.04em' }}>SOLIS</span>
                <span style={{ fontSize: 12, letterSpacing: '0.2em', color: C.muted, marginLeft: 4 }}>IMMOBILIER</span>
              </div>
              <h1 style={{ fontFamily: C.serif, fontSize: 'clamp(42px, 6.5vw, 88px)', fontWeight: 600, lineHeight: 1.02, letterSpacing: '-0.01em', margin: 0, color: C.navy }}>
                Des espaces
                <br />
                qui <span style={{ color: C.gold }}>transforment</span>
                <br />
                des vies
              </h1>
              <p style={{ marginTop: 26, fontSize: 18, lineHeight: 1.75, color: C.textSoft, maxWidth: 480 }}>
                Conseil en immobilier de prestige et architecture. Nous concevons, sélectionnons
                et révélons les lieux d&apos;exception, partout en France.
              </p>
              <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a
                  href="#properties"
                  style={{
                    background: C.navy,
                    color: '#fff',
                    borderRadius: radius,
                    padding: '15px 28px',
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  Découvrir nos biens <ArrowRight size={17} />
                </a>
                <a
                  href="#contact"
                  style={{
                    background: 'transparent',
                    color: C.navy,
                    border: `1px solid ${C.borderDark}`,
                    borderRadius: radius,
                    padding: '15px 28px',
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Search size={16} /> Nous contacter
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div style={{ height: 'min(70vh, 560px)', borderRadius: radius, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 30px 60px rgba(26,26,46,0.12)' }}>
              <BuildingFacade />
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2 — CHIFFRES */}
      <section style={{ ...pad, paddingBlock: 'clamp(70px, 10vh, 120px)', background: C.bgSoft }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <Eyebrow center>Chiffres qui parlent</Eyebrow>
            <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 600, margin: 0, color: C.navy }}>
              Une expertise éprouvée
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 70 }}>
          <CountUp target={847} label="Projets livrés" />
          <CountUp target={2.3} decimals={1} prefix="€" suffix=" Md" label="Investis" />
          <CountUp target={14} label="Villes" />
          <CountUp target={96} suffix=" %" label="Satisfaction" />
        </div>
        <Reveal delay={0.2}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <FranceMap />
          </div>
        </Reveal>
      </section>

      {/* SECTION 3 — SÉLECTION EXCLUSIVE */}
      <section id="properties" style={{ ...pad, paddingBlock: 'clamp(70px, 10vh, 130px)', background: C.bg }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 54 }}>
            <div>
              <Eyebrow>Sélection exclusive</Eyebrow>
              <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 600, margin: 0, color: C.navy }}>
                Biens d&apos;exception
              </h2>
            </div>
            <a href="#contact" style={{ color: C.gold, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              Voir tout le portefeuille <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
          {properties.map((p, i) => (
            <PropertyCard key={p.name} {...p} delay={i * 0.12} />
          ))}
        </div>
      </section>

      {/* SECTION 4 — NOTRE APPROCHE */}
      <section style={{ ...pad, paddingBlock: 'clamp(70px, 10vh, 130px)', background: C.navy, color: '#fff' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Eyebrow center>Notre approche</Eyebrow>
            <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 600, margin: 0, color: '#fff' }}>
              Trois étapes, une exigence
            </h2>
          </div>
        </Reveal>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
          {/* dashed connector */}
          <svg style={{ position: 'absolute', top: 30, left: '12%', right: '12%', width: '76%', height: 2, pointerEvents: 'none' }} className="solis-connector" preserveAspectRatio="none" viewBox="0 0 100 2">
            <motion.line
              x1={0}
              y1={1}
              x2={100}
              y2={1}
              stroke={C.gold}
              strokeWidth={1}
              strokeDasharray="3 3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6 }}
            />
          </svg>
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.18}>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: '50%',
                    background: C.navySoft,
                    border: `1px solid rgba(184,148,74,0.4)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}
                >
                  {s.icon}
                </div>
                <div style={{ fontSize: 13, letterSpacing: '0.2em', color: C.gold, marginBottom: 10 }}>0{i + 1}</div>
                <h3 style={{ fontFamily: C.serif, fontSize: 28, fontWeight: 600, margin: '0 0 12px', color: '#fff' }}>{s.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#b8b8c8', margin: 0, maxWidth: 300, marginInline: 'auto' }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SECTION 4.5 — FAQ */}
      <section style={{ ...pad, paddingBlock: 'clamp(70px, 10vh, 120px)', background: C.bgSoft }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(30px, 5vw, 70px)', alignItems: 'start' }}>
          <Reveal>
            <div style={{ position: 'sticky', top: 40 }}>
              <Eyebrow>Questions fréquentes</Eyebrow>
              <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 600, margin: 0, color: C.navy, lineHeight: 1.05 }}>
                Tout ce que vous
                <br />
                devez savoir
              </h2>
              <p style={{ marginTop: 22, fontSize: 16, lineHeight: 1.75, color: C.textSoft, maxWidth: 360 }}>
                Une question qui n&apos;apparaît pas ici ? Notre équipe vous répond personnellement
                sous 24 heures.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              {faqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 5 — TÉMOIGNAGES + CONTACT */}
      <section id="contact" style={{ ...pad, paddingBlock: 'clamp(70px, 10vh, 130px)', background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 50 }}>
            <Eyebrow>Ils nous font confiance</Eyebrow>
            <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 600, margin: 0, color: C.navy }}>
              Témoignages
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 26, marginBottom: 90 }}>
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.14}>
              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: radius, padding: '36px 34px', boxShadow: '0 2px 10px rgba(26,26,46,0.05)' }}>
                <Quote size={30} color={C.goldSoft} />
                <p style={{ fontFamily: C.serif, fontSize: 24, fontStyle: 'italic', lineHeight: 1.5, color: C.navy, margin: '18px 0 26px' }}>
                  « {t.text} »
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg, ${C.gold}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: C.navy }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Contact form + office card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(30px, 5vw, 60px)', alignItems: 'start' }}>
          <Reveal>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: radius, padding: 'clamp(28px, 4vw, 44px)', boxShadow: '0 4px 20px rgba(26,26,46,0.06)' }}>
              <h3 style={{ fontFamily: C.serif, fontSize: 30, fontWeight: 600, margin: '0 0 8px', color: C.navy }}>Parlons de votre projet</h3>
              <p style={{ fontSize: 15, color: C.textSoft, margin: '0 0 28px' }}>Un conseiller dédié vous répond sous 24 heures.</p>
              <ContactForm />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: 'grid', gap: 24 }}>
              <div style={{ background: C.navy, borderRadius: radius, padding: '34px 32px', color: '#fff' }}>
                <h3 style={{ fontFamily: C.serif, fontSize: 26, fontWeight: 600, margin: '0 0 22px' }}>Notre bureau</h3>
                <div style={{ display: 'grid', gap: 16, fontSize: 15, color: '#cfcfdc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><MapPin size={17} color={C.gold} /> 18 Avenue Montaigne, Paris 8ème</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Phone size={17} color={C.gold} /> +33 1 00 00 00 00</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Mail size={17} color={C.gold} /> contact@solis-immobilier.fr</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Clock size={17} color={C.gold} /> Lun – Sam · 9h – 19h</div>
                </div>
              </div>
              {/* map placeholder — CSS grid lines */}
              <div
                style={{
                  borderRadius: radius,
                  height: 220,
                  border: `1px solid ${C.border}`,
                  background: `
                    linear-gradient(${C.border} 1px, transparent 1px),
                    linear-gradient(90deg, ${C.border} 1px, transparent 1px),
                    ${C.bgSoft}`,
                  backgroundSize: '28px 28px, 28px 28px, 100% 100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', left: '38%', top: '14%', width: '24%', height: '60%', background: 'rgba(184,148,74,0.12)', border: `1px solid ${C.goldSoft}`, borderRadius: radius }} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <MapPin size={28} color={C.gold} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.navy, background: 'rgba(250,250,248,0.9)', padding: '3px 8px', borderRadius: radius }}>Solis Immobilier</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ ...pad, paddingBlock: 50, background: C.navy, color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building2 size={20} color={C.gold} />
            <span style={{ fontFamily: C.serif, fontSize: 22, fontWeight: 600 }}>SOLIS</span>
            <span style={{ fontSize: 12, letterSpacing: '0.2em', color: '#9a9ab0' }}>IMMOBILIER</span>
          </div>
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', fontSize: 14, color: '#b8b8c8' }}>
            {['Biens', 'Approche', 'À propos', 'Mentions légales'].map((l) => (
              <a key={l} href="#" style={{ color: '#b8b8c8', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 30, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: '#8a8aa0' }}>
          © 2024 Solis Immobilier · Carte professionnelle CPI 7501 · Paris
        </div>
      </footer>

      {/* responsive: stack hero on small screens */}
      <style>{`
        @media (max-width: 880px) {
          .solis-hero-grid { grid-template-columns: 1fr !important; }
          .solis-connector { display: none !important; }
        }
      `}</style>
    </main>
  );
}
