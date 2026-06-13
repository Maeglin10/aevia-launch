'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import {
  Zap,
  Battery,
  Gauge,
  Cpu,
  ArrowRight,
  ArrowDown,
  Check,
  MapPin,
  Quote,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   LUMYX — Electric urban mobility brand (Radian-inspired)
   Full-screen scroll-snap sections + Canvas 2D vehicle renders
   ════════════════════════════════════════════════════════════════════════════ */

const C = {
  bg: '#060810',
  bgSoft: '#0a0e1a',
  bgCard: '#0e1424',
  border: '#1a2236',
  borderBright: '#243150',
  blue: '#00d4ff',
  blueDeep: '#0096c7',
  blueGlow: 'rgba(0,212,255,0.5)',
  text: '#f0f4f8',
  textSoft: '#9fb0c4',
  muted: '#5d6e85',
  font: "'Inter', system-ui, -apple-system, sans-serif",
} as const;

const pageStyle: React.CSSProperties = {
  background: C.bg,
  color: C.text,
  fontFamily: C.font,
  WebkitFontSmoothing: 'antialiased',
};

const sectionStyle: React.CSSProperties = {
  height: '100vh',
  width: '100%',
  scrollSnapAlign: 'start',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingInline: 'clamp(20px, 6vw, 96px)',
  overflow: 'hidden',
};

/* ─────────────────────────────────────────────────────────────────────────────
   Canvas: draw the electric scooter/vehicle silhouette
   ──────────────────────────────────────────────────────────────────────────── */

function drawVehicle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  rotation: number,
  glow: boolean,
  explode: number, // 0..1 exploded view
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  if (glow) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = C.blue;
  }

  const wheelR = 56;
  const wheelOffX = 150;
  const ex = explode; // shortcut

  // --- WHEELS ---
  const drawWheel = (x: number, ox: number) => {
    ctx.save();
    ctx.translate(x + ox * ex, 0);
    ctx.beginPath();
    ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#1c2436';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, wheelR - 6, 0, Math.PI * 2);
    ctx.strokeStyle = C.blue;
    ctx.lineWidth = 2;
    ctx.stroke();
    // hub spokes
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + rotation * 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * (wheelR - 10), Math.sin(a) * (wheelR - 10));
      ctx.strokeStyle = C.borderBright;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = C.blue;
    ctx.fill();
    ctx.restore();
  };
  drawWheel(-wheelOffX, -90);
  drawWheel(wheelOffX, 90);

  // --- FRAME (sleek swoosh) ---
  ctx.save();
  ctx.translate(0, -ex * 80);
  ctx.beginPath();
  ctx.moveTo(-wheelOffX, -8);
  ctx.quadraticCurveTo(-60, -70, 30, -64);
  ctx.lineTo(wheelOffX - 20, -10);
  ctx.quadraticCurveTo(60, -20, -30, -18);
  ctx.closePath();
  const frameGrad = ctx.createLinearGradient(-wheelOffX, -70, wheelOffX, 0);
  frameGrad.addColorStop(0, '#16223a');
  frameGrad.addColorStop(0.5, '#1e2e4d');
  frameGrad.addColorStop(1, '#16223a');
  ctx.fillStyle = frameGrad;
  ctx.fill();
  ctx.strokeStyle = C.blue;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // handlebar stem
  ctx.beginPath();
  ctx.moveTo(wheelOffX - 24, -12);
  ctx.lineTo(wheelOffX - 6, -120);
  ctx.lineTo(wheelOffX + 26, -126);
  ctx.lineWidth = 9;
  ctx.strokeStyle = '#1e2e4d';
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // --- BATTERY BOX ---
  ctx.save();
  ctx.translate(-20, 18 + ex * 110);
  const batGrad = ctx.createLinearGradient(0, -20, 0, 20);
  batGrad.addColorStop(0, '#0e1a2e');
  batGrad.addColorStop(1, '#08101e');
  ctx.fillStyle = batGrad;
  ctx.beginPath();
  ctx.roundRect(-70, -22, 140, 44, 6);
  ctx.fill();
  ctx.strokeStyle = C.blue;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // battery cells indicator
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = C.blue;
    ctx.globalAlpha = 0.4 + (i % 2) * 0.4;
    ctx.fillRect(-58 + i * 24, -8, 16, 16);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // --- MOTOR HUB (on rear wheel) ---
  ctx.save();
  ctx.translate(-wheelOffX - 90 * ex, 0);
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  const motorGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
  motorGrad.addColorStop(0, C.blue);
  motorGrad.addColorStop(1, '#0a2840');
  ctx.fillStyle = motorGrad;
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // --- LABELS in exploded view ---
  if (ex > 0.4) {
    ctx.save();
    ctx.globalAlpha = (ex - 0.4) / 0.6;
    ctx.fillStyle = C.textSoft;
    ctx.font = `12px ${C.font}`;
    ctx.textAlign = 'center';
    const labels: [number, number, string][] = [
      [cx - 20 * scale, cy + 18 * scale + 110 * scale * ex + 36, 'BATTERIE 48V'],
      [cx - wheelOffX * scale - 90 * scale * ex, cy - 40, 'MOTEUR 350W'],
      [cx, cy - 80 * scale - 64, 'CADRE ALU'],
      [cx + wheelOffX * scale + 90 * scale * ex, cy + wheelR * scale + 22, 'ROUE 10"'],
    ];
    labels.forEach(([x, y, t]) => ctx.fillText(t, x, y));
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 1 — Hero canvas
   ──────────────────────────────────────────────────────────────────────────── */

function HeroVehicle(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      w = parent ? parent.clientWidth : window.innerWidth;
      h = parent ? parent.clientHeight : 420;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w, h) / 620;
      const wobble = hoverRef.current ? Math.sin(t * 0.6) * 0.08 : Math.sin(t * 0.3) * 0.02;
      drawVehicle(ctx, w / 2, h / 2, scale, wobble, true, 0);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      style={{ position: 'absolute', inset: 0 }}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 2 — Exploded canvas (scroll triggered)
   ──────────────────────────────────────────────────────────────────────────── */

function ExplodedVehicle({ active }: { active: boolean }): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const explodeRef = useRef(0);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      w = parent ? parent.clientWidth : 400;
      h = parent ? parent.clientHeight : 400;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const target = activeRef.current ? 1 : 0;
      explodeRef.current += (target - explodeRef.current) * 0.06;
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w, h) / 760;
      drawVehicle(ctx, w / 2, h / 2, scale, Math.sin(t * 0.3) * 0.02, true, explodeRef.current);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Count-up stat
   ──────────────────────────────────────────────────────────────────────────── */

function CountUp({ target, suffix = '', label }: { target: number; suffix?: string; label: string }): React.JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const dur = 1600;
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

  const display = target % 1 !== 0 ? val.toFixed(1) : Math.round(val).toString();

  return (
    <div
      ref={ref}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: '28px 24px',
      }}
    >
      <div style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: C.blue, lineHeight: 1, letterSpacing: '-0.02em' }}>
        {display}
        <span style={{ fontSize: '0.5em', color: C.textSoft, marginLeft: 4 }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 13, letterSpacing: '0.14em', color: C.muted, marginTop: 12, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Animated tech icons
   ──────────────────────────────────────────────────────────────────────────── */

function PulseBattery(): React.JSX.Element {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64}>
      <rect x={18} y={20} width={40} height={44} rx={5} fill="none" stroke={C.blue} strokeWidth={2.5} />
      <rect x={32} y={14} width={16} height={7} rx={2} fill={C.blue} />
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={24}
          y={52 - i * 12}
          width={28}
          height={8}
          rx={2}
          fill={C.blue}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </svg>
  );
}

function SpinTurbine(): React.JSX.Element {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64}>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ originX: '40px', originY: '40px' }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          const x = 40 + Math.cos(a) * 22;
          const y = 40 + Math.sin(a) * 22;
          return <ellipse key={i} cx={x} cy={y} rx={9} ry={4} fill={C.blue} opacity={0.8} transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />;
        })}
      </motion.g>
      <circle cx={40} cy={40} r={9} fill={C.bg} stroke={C.blue} strokeWidth={2.5} />
    </svg>
  );
}

function PhoneMock(): React.JSX.Element {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64}>
      <rect x={26} y={12} width={28} height={56} rx={6} fill="none" stroke={C.blue} strokeWidth={2.5} />
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={31}
          y={24 + i * 12}
          width={18}
          height={6}
          rx={2}
          fill={C.blueDeep}
          animate={{ width: [10, 18, 14] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      <circle cx={40} cy={62} r={2.5} fill={C.blue} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Reserve countdown
   ──────────────────────────────────────────────────────────────────────────── */

function ReserveForm(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setJoined(true);
      }}
      style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 520, width: '100%' }}
    >
      <input
        type="email"
        required
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: '1 1 240px',
          background: C.bgCard,
          border: `1px solid ${C.borderBright}`,
          borderRadius: 8,
          padding: '16px 18px',
          color: C.text,
          fontFamily: C.font,
          fontSize: 16,
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          background: joined ? C.blueDeep : C.blue,
          color: C.bg,
          border: 'none',
          borderRadius: 8,
          padding: '16px 28px',
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: `0 0 30px ${C.blueGlow}`,
        }}
      >
        {joined ? (
          <>
            <Check size={18} /> Inscrit
          </>
        ) : (
          <>
            Rejoindre la liste <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Model lineup card
   ──────────────────────────────────────────────────────────────────────────── */

interface ModelInfo {
  name: string;
  tagline: string;
  price: string;
  range: string;
  speed: string;
  weight: string;
  featured: boolean;
}

function ModelCard({ model, index }: { model: ModelInfo; index: number }): React.JSX.Element {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: model.featured ? `linear-gradient(160deg, #0d1b30, ${C.bgCard})` : C.bgCard,
        border: `1px solid ${model.featured ? C.blueDeep : C.border}`,
        borderRadius: 14,
        padding: '34px 30px',
        transition: 'transform .4s, box-shadow .4s',
        transform: hover ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hover ? `0 26px 50px rgba(0,0,0,0.45)` : 'none',
      }}
    >
      {model.featured && (
        <div
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: C.bg,
            background: C.blue,
            padding: '5px 12px',
            borderRadius: 20,
          }}
        >
          POPULAIRE
        </div>
      )}
      <h3 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.01em' }}>{model.name}</h3>
      <p style={{ fontSize: 14, color: C.textSoft, margin: '0 0 22px' }}>{model.tagline}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 26 }}>
        <span style={{ fontSize: 38, fontWeight: 800, color: model.featured ? C.blue : C.text }}>{model.price}</span>
      </div>
      <div style={{ display: 'grid', gap: 12, marginBottom: 28 }}>
        {[
          { l: 'Autonomie', v: model.range },
          { l: 'Vitesse', v: model.speed },
          { l: 'Poids', v: model.weight },
        ].map((row) => (
          <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 14, color: C.muted }}>{row.l}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{row.v}</span>
          </div>
        ))}
      </div>
      <button
        style={{
          width: '100%',
          background: model.featured ? C.blue : 'transparent',
          color: model.featured ? C.bg : C.text,
          border: model.featured ? 'none' : `1px solid ${C.borderBright}`,
          borderRadius: 8,
          padding: '13px 18px',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        Configurer <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────────── */

export default function LumyxPage(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const barScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const specsRef = useRef<HTMLDivElement | null>(null);
  const specsInView = useInView(specsRef, { margin: '-30%' });

  const testimonials = [
    { city: 'Paris', name: 'Camille D.', text: 'Mon trajet quotidien République–Bastille est devenu un plaisir. Silencieux, rapide, et zéro émission.' },
    { city: 'Lyon', name: 'Théo R.', text: 'L’autonomie tient toute la semaine. Je recharge le vendredi soir, et c’est reparti.' },
    { city: 'Bordeaux', name: 'Inès M.', text: 'Le design attire tous les regards. L’appli est ultra fluide pour suivre la batterie en temps réel.' },
  ];

  const features = [
    { icon: <PulseBattery />, title: 'Batterie LFP 48V', desc: 'Cellules lithium fer phosphate, 1 200 cycles garantis, charge ultra-rapide et zéro perte de mémoire.' },
    { icon: <SpinTurbine />, title: 'Moteur sans balai', desc: 'Moteur-roue 350W à couple instantané. Montée à 30% sans effort, régénération au freinage.' },
    { icon: <PhoneMock />, title: 'Application connectée', desc: 'Verrouillage à distance, suivi GPS, diagnostic en direct et mises à jour OTA du firmware.' },
  ];

  const models: ModelInfo[] = [
    { name: 'Lumyx City', tagline: 'L’essentiel urbain', price: '1 290 €', range: '90 km', speed: '25 km/h', weight: '16 kg', featured: false },
    { name: 'Lumyx Pro', tagline: 'Performance & autonomie', price: '1 890 €', range: '160 km', speed: '45 km/h', weight: '19 kg', featured: true },
    { name: 'Lumyx Max', tagline: 'Longue distance', price: '2 490 €', range: '230 km', speed: '45 km/h', weight: '22 kg', featured: false },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        ...pageStyle,
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
      }}
    >
      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.06)', zIndex: 50 }}>
        <motion.div style={{ height: '100%', background: C.blue, transformOrigin: '0%', scaleX: barScale, boxShadow: `0 0 12px ${C.blueGlow}` }} />
      </div>

      {/* Fixed brand mark */}
      <div style={{ position: 'fixed', top: 24, left: 'clamp(20px, 6vw, 96px)', zIndex: 40, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Zap size={20} color={C.blue} fill={C.blue} />
        <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '0.04em' }}>LUMYX</span>
      </div>

      {/* SECTION 1 — HERO */}
      <section style={{ ...sectionStyle, alignItems: 'center', textAlign: 'center' }}>
        <HeroVehicle />
        <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ fontSize: 13, letterSpacing: '0.4em', color: C.blue, marginBottom: 20 }}
          >
            MOBILITÉ ÉLECTRIQUE NOUVELLE GÉNÉRATION
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            style={{ fontSize: 'clamp(44px, 8vw, 110px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.03em', margin: 0 }}
          >
            Redéfinir le
            <br />
            <span style={{ color: C.blue, textShadow: `0 0 40px ${C.blueGlow}` }}>mouvement urbain</span>
          </motion.h1>
        </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', color: C.muted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <span style={{ fontSize: 11, letterSpacing: '0.2em' }}>DÉFILER</span>
          <ArrowDown size={18} />
        </motion.div>
      </section>

      {/* SECTION 2 — SPECS */}
      <section style={{ ...sectionStyle, background: C.bgSoft }}>
        <div ref={specsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(30px, 5vw, 70px)', alignItems: 'center', width: '100%' }}>
          <div style={{ height: 'min(46vh, 420px)' }}>
            <ExplodedVehicle active={specsInView} />
          </div>
          <div>
            <div style={{ fontSize: 13, letterSpacing: '0.3em', color: C.blue, marginBottom: 14 }}>VUE ÉCLATÉE</div>
            <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, margin: '0 0 28px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              L&apos;ingénierie dans le détail
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <CountUp target={230} suffix="km" label="Autonomie" />
              <CountUp target={45} suffix="km/h" label="Vitesse max" />
              <CountUp target={2.5} suffix="h" label="Charge complète" />
              <CountUp target={95} suffix="%" label="Efficience" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — TECHNOLOGY */}
      <section style={{ ...sectionStyle, background: C.bg }}>
        <div style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(30px, 5vh, 56px)' }}>
            <div style={{ fontSize: 13, letterSpacing: '0.3em', color: C.blue, marginBottom: 14 }}>TECHNOLOGIE</div>
            <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Pensé pour durer
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: '36px 30px',
                }}
              >
                <div style={{ marginBottom: 22 }}>{f.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: C.textSoft, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — STORIES */}
      <section style={{ ...sectionStyle, background: C.bgSoft }}>
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: 'clamp(24px, 4vh, 48px)' }}>
            <div style={{ fontSize: 13, letterSpacing: '0.3em', color: C.blue, marginBottom: 14 }}>ILS ROULENT EN LUMYX</div>
            <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Des villes en mouvement
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 12, scrollSnapType: 'x mandatory' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{
                  flex: '0 0 clamp(280px, 32vw, 400px)',
                  scrollSnapAlign: 'start',
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: '32px 30px',
                }}
              >
                <Quote size={28} color={C.blueDeep} />
                <p style={{ fontSize: 17, lineHeight: 1.7, color: C.text, margin: '18px 0 24px' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} color={C.blue} />
                  <span style={{ fontWeight: 700 }}>{t.name}</span>
                  <span style={{ color: C.muted, fontSize: 14 }}>· {t.city}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4.5 — GAMME */}
      <section style={{ ...sectionStyle, background: C.bg }}>
        <div style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vh, 50px)' }}>
            <div style={{ fontSize: 13, letterSpacing: '0.3em', color: C.blue, marginBottom: 14 }}>LA GAMME</div>
            <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Trois modèles, un seul ADN
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 980, marginInline: 'auto' }}>
            {models.map((m, i) => (
              <ModelCard key={m.name} model={m} index={i} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: C.muted }}>
            Tous les modèles incluent 2 ans de garantie et l&apos;accès à l&apos;application Lumyx.
          </div>
        </div>
      </section>

      {/* SECTION 5 — RESERVE */}
      <section style={{ ...sectionStyle, alignItems: 'center', textAlign: 'center', background: `radial-gradient(circle at 50% 40%, #0a1830, ${C.bg})` }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${C.blueGlow}, transparent 55%)`, opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 13, letterSpacing: '0.3em', color: C.blue, marginBottom: 18 }}>ÉDITION DE LANCEMENT</div>
          <h2 style={{ fontSize: 'clamp(40px, 7vw, 86px)', fontWeight: 800, margin: 0, lineHeight: 0.98, letterSpacing: '-0.03em' }}>
            Réservez le vôtre
          </h2>
          <p style={{ fontSize: 18, color: C.textSoft, margin: '20px 0 36px', maxWidth: 520 }}>
            Les 1 000 premières unités bénéficient d&apos;un tarif fondateur et d&apos;un accès prioritaire.
          </p>
          <ReserveForm />
          <div style={{ marginTop: 30, display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', color: C.textSoft, fontSize: 14 }}>
            <span suppressHydrationWarning style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Battery size={16} color={C.blue} /> Plus que 100 unités
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Gauge size={16} color={C.blue} /> +12 000 inscrits
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Cpu size={16} color={C.blue} /> Livraison Q1 2025
            </span>
          </div>
        </div>
        <footer style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', color: C.muted, fontSize: 13 }}>
          © 2024 Lumyx Mobility · Conçu à Paris · Assemblé en France
        </footer>
      </section>
    </div>
  );
}
