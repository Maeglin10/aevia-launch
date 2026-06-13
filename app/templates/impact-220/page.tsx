'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Cog,
  Watch,
  Gem,
  Award,
  ArrowRight,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Check,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   HORA VIVA — Ultra-luxury Swiss watch manufacture (Cartier-inspired)
   Scroll-driven Canvas 2D watch-mechanism reveal + editorial chapters
   ════════════════════════════════════════════════════════════════════════════ */

const C = {
  bg: '#030712',
  bgSoft: '#070b18',
  bgCard: '#0b1120',
  border: '#1c2438',
  borderGold: '#3a3018',
  gold: '#c9a24b',
  goldBright: '#e3bd6a',
  goldDeep: '#8c6f30',
  cream: '#e8d5a3',
  creamSoft: '#cdbd95',
  ink: '#f4ecd8',
  muted: '#8b8470',
  faint: '#5a5644',
  steel: '#9aa3b2',
  serif: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  sans: "'Inter', system-ui, -apple-system, sans-serif",
} as const;

const pageStyle: React.CSSProperties = {
  background: C.bg,
  color: C.ink,
  fontFamily: C.serif,
  overflowX: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

const pad: React.CSSProperties = { paddingInline: 'clamp(20px, 6vw, 110px)' };

/* ─────────────────────────────────────────────────────────────────────────────
   Canvas drawing primitives
   ──────────────────────────────────────────────────────────────────────────── */

function drawGear(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  teeth: number,
  rotation: number,
  fill: string,
  stroke: string,
): void {
  const toothDepth = r * 0.18;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a2 = ((i + 1) / teeth) * Math.PI * 2;
    const rOut = r + toothDepth;
    if (i === 0) ctx.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
    ctx.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
    ctx.lineTo(Math.cos(a0 + 0.04) * rOut, Math.sin(a0 + 0.04) * rOut);
    ctx.lineTo(Math.cos(a1 - 0.04) * rOut, Math.sin(a1 - 0.04) * rOut);
    ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
    ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = stroke;
  ctx.stroke();

  // hub
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2);
  ctx.fillStyle = '#0b1120';
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // spokes
  const spokes = 5;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = r * 0.06;
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.18, Math.sin(a) * r * 0.18);
    ctx.lineTo(Math.cos(a) * r * 0.4, Math.sin(a) * r * 0.4);
    ctx.stroke();
  }

  // center pin
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = stroke;
  ctx.fill();
  ctx.restore();
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  length: number,
  angle: number,
  width: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-width * 1.5, width);
  ctx.lineTo(0, -length);
  ctx.lineTo(width * 1.5, width);
  ctx.lineTo(0, width * 3);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.restore();
}

function drawTourbillon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  rotation: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  // cage triangle
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  // outer ring
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.strokeStyle = C.goldDeep;
  ctx.lineWidth = 1;
  ctx.stroke();
  // balance wheel inside (counter-rotating)
  ctx.rotate(-rotation * 2.4);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
  ctx.strokeStyle = C.goldBright;
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6);
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = C.goldBright;
  ctx.fill();
  ctx.restore();
}

function drawWatchCase(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  openAmount: number,
): void {
  // openAmount 0 = closed, 1 = fully split. We translate top half up, bottom down.
  const split = openAmount * radius * 0.9;

  // Lugs (4 corners) — drawn behind
  ctx.save();
  const lugW = radius * 0.28;
  const lugL = radius * 0.42;
  const lugPositions = [
    { a: -2.35, dir: -1 },
    { a: -0.79, dir: -1 },
    { a: 0.79, dir: 1 },
    { a: 2.35, dir: 1 },
  ];
  lugPositions.forEach((l) => {
    const lx = cx + Math.cos(l.a) * radius * 0.92;
    const ly = cy + Math.sin(l.a) * radius * 0.92 + (Math.sin(l.a) < 0 ? -split : split);
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(l.a + Math.PI / 2);
    const grad = ctx.createLinearGradient(-lugW, 0, lugW, 0);
    grad.addColorStop(0, '#3a3424');
    grad.addColorStop(0.5, C.gold);
    grad.addColorStop(1, '#3a3424');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(-lugW / 2, -lugL / 2, lugW, lugL, 6);
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();

  // OUTER CASE — top half (clipped) shifts up, bottom half shifts down
  const drawCaseHalf = (top: boolean) => {
    ctx.save();
    ctx.beginPath();
    if (top) ctx.rect(cx - radius * 1.6, cy - radius * 1.6, radius * 3.2, radius * 1.6);
    else ctx.rect(cx - radius * 1.6, cy, radius * 3.2, radius * 1.6);
    ctx.clip();
    const offset = top ? -split : split;
    // case ring
    const ringGrad = ctx.createRadialGradient(cx, cy + offset, radius * 0.7, cx, cy + offset, radius * 1.12);
    ringGrad.addColorStop(0, '#1a1407');
    ringGrad.addColorStop(0.7, C.goldDeep);
    ringGrad.addColorStop(0.85, C.goldBright);
    ringGrad.addColorStop(1, C.goldDeep);
    ctx.beginPath();
    ctx.arc(cx, cy + offset, radius * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = ringGrad;
    ctx.fill();
    // bezel
    ctx.beginPath();
    ctx.arc(cx, cy + offset, radius * 1.02, 0, Math.PI * 2);
    ctx.strokeStyle = C.goldDeep;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };
  drawCaseHalf(true);
  drawCaseHalf(false);
}

function drawDial(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  alpha: number,
  hourAngle: number,
  minAngle: number,
  secAngle: number,
): void {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  // dial face
  const faceGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
  faceGrad.addColorStop(0, '#101725');
  faceGrad.addColorStop(0.6, '#0a0f1c');
  faceGrad.addColorStop(1, '#05080f');
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = faceGrad;
  ctx.fill();
  ctx.strokeStyle = C.goldDeep;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // guilloché rings
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius * (0.4 + i * 0.1), 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,162,75,0.07)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // indices
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 3 === 0;
    const rOuter = radius * 0.9;
    const rInner = radius * (isMajor ? 0.78 : 0.84);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * rOuter, cy + Math.sin(a) * rOuter);
    ctx.lineTo(cx + Math.cos(a) * rInner, cy + Math.sin(a) * rInner);
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = isMajor ? 3 : 1.4;
    ctx.stroke();
  }

  // logo text
  ctx.fillStyle = C.cream;
  ctx.font = `italic ${radius * 0.13}px ${C.serif}`;
  ctx.textAlign = 'center';
  ctx.fillText('HORA VIVA', cx, cy - radius * 0.32);
  ctx.font = `${radius * 0.06}px ${C.sans}`;
  ctx.fillStyle = C.muted;
  ctx.fillText('GENÈVE', cx, cy - radius * 0.2);
  ctx.fillStyle = C.goldDeep;
  ctx.font = `${radius * 0.055}px ${C.sans}`;
  ctx.fillText('TOURBILLON', cx, cy + radius * 0.5);

  // hands
  drawHand(ctx, cx, cy, radius * 0.5, hourAngle, radius * 0.022, C.cream);
  drawHand(ctx, cx, cy, radius * 0.72, minAngle, radius * 0.016, C.cream);
  drawHand(ctx, cx, cy, radius * 0.78, secAngle, radius * 0.007, C.goldBright);

  // center cap
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.035, 0, Math.PI * 2);
  ctx.fillStyle = C.goldBright;
  ctx.fill();
  ctx.restore();
}

function drawMovement(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  alpha: number,
  rotation: number,
): void {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  // movement plate
  const plate = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
  plate.addColorStop(0, '#1a2236');
  plate.addColorStop(1, '#0a1020');
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = plate;
  ctx.fill();
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Côtes de Genève stripes
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.95, 0, Math.PI * 2);
  ctx.clip();
  for (let i = -10; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy + i * radius * 0.12);
    ctx.lineTo(cx + radius, cy + i * radius * 0.12 + radius * 0.3);
    ctx.strokeStyle = 'rgba(154,163,178,0.05)';
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();
  }
  ctx.restore();

  // 3 gears at different speeds
  drawGear(ctx, cx - radius * 0.42, cy - radius * 0.3, radius * 0.28, 18, rotation, '#16203a', C.goldDeep);
  drawGear(ctx, cx + radius * 0.38, cy - radius * 0.1, radius * 0.34, 22, -rotation * 0.6, '#16203a', C.gold);
  drawGear(ctx, cx + radius * 0.05, cy + radius * 0.42, radius * 0.22, 14, rotation * 1.8, '#16203a', C.goldDeep);

  // ruby jewels
  const jewels = [
    [cx - radius * 0.42, cy - radius * 0.3],
    [cx + radius * 0.38, cy - radius * 0.1],
    [cx + radius * 0.05, cy + radius * 0.42],
    [cx - radius * 0.1, cy - radius * 0.55],
  ];
  jewels.forEach(([jx, jy]) => {
    ctx.beginPath();
    ctx.arc(jx, jy, radius * 0.035, 0, Math.PI * 2);
    ctx.fillStyle = '#9b2335';
    ctx.shadowColor = '#ff4d6d';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // tourbillon
  drawTourbillon(ctx, cx - radius * 0.05, cy + radius * 0.02, radius * 0.28, rotation * 1.2);
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
   Hero canvas section (scroll-driven)
   ──────────────────────────────────────────────────────────────────────────── */

function WatchHero(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -el.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(1, scrolled / Math.max(1, total)));
      progressRef.current = p;
    };

    const start = performance.now();
    const render = (now: number) => {
      const t = (now - start) / 1000;
      const p = progressRef.current;
      ctx.clearRect(0, 0, width, height);

      // radial bg
      const bg = ctx.createRadialGradient(width / 2, height / 2, 60, width / 2, height / 2, Math.max(width, height) * 0.7);
      bg.addColorStop(0, '#0a1224');
      bg.addColorStop(1, C.bg);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.26;

      // phase mapping
      // 0-0.3 closed → opening; 0.3-0.6 case open, dial fades, movement appears; 0.6-1 disassembly
      const openAmount = Math.min(1, p / 0.4);
      const dialAlpha = 1 - Math.min(1, Math.max(0, (p - 0.25) / 0.25));
      const movementAlpha = Math.min(1, Math.max(0, (p - 0.4) / 0.25));

      // 10:10 hands + subtle running seconds
      const hourAngle = (Math.PI * 2 * 10) / 12 + t * 0.02;
      const minAngle = (Math.PI * 2 * 10) / 60 - Math.PI;
      const secAngle = t * (Math.PI / 30) * 4;

      const gearRotation = t * 0.6 + p * 14;

      // disassembly float for parts (progress 0.6-1)
      const disassembly = Math.max(0, (p - 0.6) / 0.4);
      const floatY = disassembly * radius * 1.4;

      drawWatchCase(ctx, cx, cy, radius, openAmount);
      drawDial(ctx, cx, cy - floatY * 0.4, radius * 0.92, dialAlpha, hourAngle, minAngle, secAngle);
      drawMovement(ctx, cx, cy + floatY * 0.2, radius * 0.92, movementAlpha, gearRotation);

      // floating disassembled gears at high progress
      if (disassembly > 0) {
        ctx.save();
        ctx.globalAlpha = disassembly;
        drawGear(ctx, cx - radius * 1.6, cy - radius * 0.8 - floatY * 0.3, radius * 0.2, 16, gearRotation, '#16203a', C.gold);
        drawGear(ctx, cx + radius * 1.7, cy + radius * 0.4 + floatY * 0.3, radius * 0.26, 20, -gearRotation * 0.7, '#16203a', C.goldBright);
        drawGear(ctx, cx + radius * 1.3, cy - radius * 1.1 - floatY * 0.2, radius * 0.16, 12, gearRotation * 1.5, '#16203a', C.goldDeep);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: '350vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh' }} />
        {/* Overlaid text cues */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(28px, 5vw, 64px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div
              style={{
                fontFamily: C.serif,
                fontStyle: 'italic',
                fontSize: 'clamp(22px, 2.2vw, 30px)',
                letterSpacing: '0.18em',
                color: C.cream,
              }}
            >
              HORA VIVA
            </div>
            <div style={{ fontSize: 12, letterSpacing: '0.3em', color: C.muted, fontFamily: C.sans }}>
              MANUFACTURE · GENÈVE 1920
            </div>
          </div>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(40px, 7vw, 96px)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.02,
                letterSpacing: '-0.01em',
                color: C.ink,
                margin: 0,
              }}
            >
              L&apos;art de mesurer
              <br />
              <span style={{ color: C.gold }}>l&apos;éternité</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{
                marginTop: 20,
                fontSize: 'clamp(14px, 1.4vw, 18px)',
                color: C.creamSoft,
                fontFamily: C.sans,
                letterSpacing: '0.04em',
              }}
            >
              Faites défiler pour révéler le mouvement
            </motion.p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, opacity: 0.7 }}>
            {['Boîtier', 'Cadran', 'Mouvement', 'Éclatée'].map((s, i) => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  color: i === 0 ? C.gold : C.faint,
                  fontFamily: C.sans,
                }}
              >
                {s.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Animated SVG gear cluster
   ──────────────────────────────────────────────────────────────────────────── */

interface GearProps {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  dur: number;
  dir: 1 | -1;
  color: string;
}

function Gear({ cx, cy, r, teeth, dur, dir, color }: GearProps): React.JSX.Element {
  const path: string[] = [];
  const toothDepth = r * 0.18;
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = ((i + 0.5) / teeth) * Math.PI * 2;
    const rOut = r + toothDepth;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a0 + 0.05) * rOut;
    const y1 = cy + Math.sin(a0 + 0.05) * rOut;
    const x2 = cx + Math.cos(a1 - 0.05) * rOut;
    const y2 = cy + Math.sin(a1 - 0.05) * rOut;
    const x3 = cx + Math.cos(a1) * r;
    const y3 = cy + Math.sin(a1) * r;
    path.push(`${i === 0 ? 'M' : 'L'}${x0} ${y0} L${x1} ${y1} L${x2} ${y2} L${x3} ${y3}`);
  }
  return (
    <motion.g
      animate={{ rotate: dir * 360 }}
      transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
      style={{ originX: `${cx}px`, originY: `${cy}px` }}
    >
      <path d={`${path.join(' ')} Z`} fill="#0b1120" stroke={color} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r * 0.4} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r * 0.1} fill={color} />
    </motion.g>
  );
}

function GearCluster(): React.JSX.Element {
  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 460 }}>
      <Gear cx={150} cy={150} r={70} teeth={22} dur={28} dir={1} color={C.gold} />
      <Gear cx={280} cy={200} r={50} teeth={16} dur={20} dir={-1} color={C.goldBright} />
      <Gear cx={200} cy={290} r={42} teeth={14} dur={16} dir={1} color={C.goldDeep} />
      <Gear cx={110} cy={280} r={30} teeth={11} dur={11} dir={-1} color={C.gold} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Chapter section wrapper
   ──────────────────────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }): React.JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div
      style={{
        fontFamily: C.sans,
        fontSize: 12,
        letterSpacing: '0.34em',
        color: C.gold,
        marginBottom: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{ width: 34, height: 1, background: C.goldDeep }} />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Collection face (CSS-drawn dial)
   ──────────────────────────────────────────────────────────────────────────── */

function CollectionFace({ name, ref: refLabel, accent }: { name: string; ref: string; accent: string }): React.JSX.Element {
  return (
    <Reveal>
      <div
        style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
          padding: '38px 28px',
          textAlign: 'center',
          transition: 'transform .5s, border-color .5s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.borderColor = C.goldDeep;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = C.border;
        }}
      >
        <div
          style={{
            width: 130,
            height: 130,
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, #16203a, #05080f)`,
            border: `4px solid ${accent}`,
            position: 'relative',
            boxShadow: `0 0 30px rgba(201,162,75,0.18), inset 0 0 24px rgba(0,0,0,0.6)`,
          }}
        >
          {/* indices */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: i % 3 === 0 ? 3 : 1.5,
                  height: i % 3 === 0 ? 9 : 6,
                  background: C.gold,
                  transform: `translate(-50%,-50%) rotate(${(a * 180) / Math.PI + 90}deg) translateY(-52px)`,
                }}
              />
            );
          })}
          {/* hands */}
          <span style={{ position: 'absolute', left: '50%', top: '50%', width: 2, height: 32, background: C.cream, transformOrigin: 'bottom center', transform: 'translate(-50%,-100%) rotate(300deg)' }} />
          <span style={{ position: 'absolute', left: '50%', top: '50%', width: 1.5, height: 46, background: C.cream, transformOrigin: 'bottom center', transform: 'translate(-50%,-100%) rotate(50deg)' }} />
          <span style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: 6, borderRadius: '50%', background: C.goldBright, transform: 'translate(-50%,-50%)' }} />
        </div>
        <div style={{ fontStyle: 'italic', fontSize: 22, color: C.ink }}>{name}</div>
        <div style={{ fontFamily: C.sans, fontSize: 12, letterSpacing: '0.2em', color: C.muted, marginTop: 6 }}>{refLabel}</div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Order form
   ──────────────────────────────────────────────────────────────────────────── */

function QuoteForm(): React.JSX.Element {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', collection: 'La Régence' });
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 3,
    padding: '14px 16px',
    color: C.ink,
    fontFamily: C.sans,
    fontSize: 15,
    outline: 'none',
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      style={{ display: 'grid', gap: 16, maxWidth: 520 }}
    >
      <input
        style={inputStyle}
        placeholder="Nom complet"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        style={inputStyle}
        type="email"
        placeholder="Adresse e-mail"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <select
        style={inputStyle}
        value={form.collection}
        onChange={(e) => setForm({ ...form, collection: e.target.value })}
      >
        <option>La Régence</option>
        <option>Tourbillon Céleste</option>
        <option>Méridienne</option>
        <option>Grande Complication</option>
      </select>
      <button
        type="submit"
        style={{
          marginTop: 6,
          background: sent ? C.goldDeep : C.gold,
          color: C.bg,
          border: 'none',
          borderRadius: 3,
          padding: '15px 20px',
          fontFamily: C.sans,
          fontWeight: 600,
          letterSpacing: '0.1em',
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {sent ? (
          <>
            <Check size={16} /> DEMANDE ENVOYÉE
          </>
        ) : (
          <>
            DEMANDER UN DEVIS <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────────── */

export default function HoraVivaPage(): React.JSX.Element {
  const materials = [
    { name: 'Titane Grade 5', detail: 'Léger, hypoallergénique, microbillé', spec: '4.43 g/cm³' },
    { name: 'Saphir synthétique', detail: 'Verre bombé, traitement antireflet double face', spec: '9 Mohs' },
    { name: 'Acier 904L', detail: 'Résistance supérieure à la corrosion, poli miroir', spec: '316L+' },
    { name: 'Or rose 18 ct', detail: 'Alliage maison, teinte chaude exclusive', spec: '750‰' },
  ];

  const timeline = [
    { year: '1920', label: 'Fondation de la manufacture à Genève' },
    { year: '1948', label: 'Premier chronographe à rattrapante' },
    { year: '1972', label: 'Calibre tourbillon volant maison' },
    { year: '1999', label: 'Certification Poinçon de Genève' },
    { year: '2024', label: 'Atelier Haute Horlogerie nouvelle génération' },
  ];

  const collections = [
    { name: 'La Régence', ref: 'RÉF. HV-1920', accent: C.gold },
    { name: 'Tourbillon Céleste', ref: 'RÉF. HV-TC72', accent: C.goldBright },
    { name: 'Méridienne', ref: 'RÉF. HV-MD48', accent: C.creamSoft },
    { name: 'Grande Complication', ref: 'RÉF. HV-GC99', accent: C.gold },
  ];

  return (
    <main style={pageStyle}>
      <WatchHero />

      {/* CHAPTER 1 — Le Mouvement */}
      <section style={{ ...pad, paddingBlock: 'clamp(80px, 12vh, 160px)', background: C.bg }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(40px, 6vw, 90px)',
            alignItems: 'center',
          }}
        >
          <div>
            <Reveal>
              <Eyebrow>CHAPITRE I · LE MOUVEMENT</Eyebrow>
              <h2 style={{ fontSize: 'clamp(34px, 5vw, 62px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.05, margin: 0, color: C.ink }}>
                Une mécanique
                <br />
                <span style={{ color: C.gold }}>vivante</span>
              </h2>
              <p style={{ marginTop: 24, fontFamily: C.sans, fontSize: 17, lineHeight: 1.8, color: C.creamSoft, maxWidth: 460 }}>
                Chaque calibre Hora Viva est assemblé à la main par un seul maître horloger.
                288 composants, 31 rubis, et un tourbillon volant qui bat à 28&apos;800 alternances
                par heure — visible à travers le fond saphir.
              </p>
              <div style={{ marginTop: 32, display: 'flex', gap: 40 }}>
                {[
                  { v: '288', l: 'Composants' },
                  { v: '31', l: 'Rubis' },
                  { v: '72h', l: 'Réserve de marche' },
                ].map((s) => (
                  <div key={s.l}>
                    <div style={{ fontSize: 40, fontStyle: 'italic', color: C.gold }}>{s.v}</div>
                    <div style={{ fontFamily: C.sans, fontSize: 12, letterSpacing: '0.16em', color: C.muted, marginTop: 4 }}>
                      {s.l.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div style={{ display: 'flex', justifyContent: 'center', filter: 'drop-shadow(0 0 40px rgba(201,162,75,0.15))' }}>
              <GearCluster />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CHAPTER 2 — Le Boîtier */}
      <section style={{ ...pad, paddingBlock: 'clamp(80px, 12vh, 160px)', background: C.bgSoft }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(40px, 6vw, 90px)',
            alignItems: 'center',
          }}
        >
          <Reveal>
            <div
              style={{
                aspectRatio: '4/5',
                borderRadius: 4,
                background: `linear-gradient(135deg, #1a1407 0%, ${C.goldDeep} 30%, ${C.goldBright} 50%, ${C.goldDeep} 70%, #0a0f1c 100%)`,
                position: 'relative',
                overflow: 'hidden',
                border: `1px solid ${C.borderGold}`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.22), transparent 50%)',
                }}
              />
              <Gem size={64} color={C.bg} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', opacity: 0.55 }} />
              <div style={{ position: 'absolute', bottom: 24, left: 24, fontFamily: C.sans, fontSize: 12, letterSpacing: '0.2em', color: C.bg }}>
                BOÎTIER 41 MM · FINITION MIROIR
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <Eyebrow>CHAPITRE II · LE BOÎTIER</Eyebrow>
              <h2 style={{ fontSize: 'clamp(34px, 5vw, 62px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.05, margin: 0, color: C.ink }}>
                Matières
                <br />
                <span style={{ color: C.gold }}>nobles</span>
              </h2>
            </Reveal>
            <div style={{ marginTop: 34, display: 'grid', gap: 2 }}>
              {materials.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.08}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 16,
                      alignItems: 'center',
                      padding: '18px 4px',
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div>
                      <div style={{ fontStyle: 'italic', fontSize: 21, color: C.ink }}>{m.name}</div>
                      <div style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, marginTop: 4 }}>{m.detail}</div>
                    </div>
                    <div style={{ fontFamily: C.sans, fontSize: 14, color: C.gold, letterSpacing: '0.08em' }}>{m.spec}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 3 — L'Héritage (timeline) */}
      <section style={{ ...pad, paddingBlock: 'clamp(80px, 12vh, 160px)', background: C.bg }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 70 }}>
            <Eyebrow>
              <span style={{ marginInline: 'auto' }}>CHAPITRE III · L&apos;HÉRITAGE</span>
            </Eyebrow>
            <h2 style={{ fontSize: 'clamp(34px, 5vw, 62px)', fontWeight: 300, fontStyle: 'italic', margin: 0, color: C.ink }}>
              Un siècle de <span style={{ color: C.gold }}>maîtrise</span>
            </h2>
          </div>
        </Reveal>
        <div style={{ position: 'relative', maxWidth: 920, margin: '0 auto' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 7, height: 1, background: C.border }} />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${timeline.length}, 1fr)`, gap: 12 }}>
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.1}>
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'block',
                      width: 15,
                      height: 15,
                      borderRadius: '50%',
                      background: C.gold,
                      margin: '0 auto 22px',
                      boxShadow: `0 0 0 5px rgba(201,162,75,0.15)`,
                    }}
                  />
                  <div style={{ fontSize: 28, fontStyle: 'italic', color: C.gold }}>{t.year}</div>
                  <div style={{ fontFamily: C.sans, fontSize: 13, color: C.creamSoft, marginTop: 8, lineHeight: 1.5 }}>{t.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS GRID */}
      <section style={{ ...pad, paddingBlock: 'clamp(70px, 10vh, 130px)', background: C.bgSoft }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Eyebrow>
              <span style={{ marginInline: 'auto' }}>COLLECTIONS</span>
            </Eyebrow>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 300, fontStyle: 'italic', margin: 0, color: C.ink }}>
              Quatre garde-temps d&apos;exception
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {collections.map((c) => (
            <CollectionFace key={c.name} name={c.name} ref={c.ref} accent={c.accent} />
          ))}
        </div>
      </section>

      {/* ORDER CTA + FORM */}
      <section style={{ ...pad, paddingBlock: 'clamp(80px, 12vh, 150px)', background: C.bg }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(40px, 6vw, 90px)',
            alignItems: 'center',
          }}
        >
          <div>
            <Reveal>
              <Eyebrow>SUR RENDEZ-VOUS</Eyebrow>
              <h2 style={{ fontSize: 'clamp(34px, 5vw, 58px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.06, margin: 0, color: C.ink }}>
                Composez votre
                <br />
                <span style={{ color: C.gold }}>garde-temps</span>
              </h2>
              <p style={{ marginTop: 22, fontFamily: C.sans, fontSize: 16, lineHeight: 1.8, color: C.creamSoft, maxWidth: 440 }}>
                Nos conseillers horlogers vous accueillent en atelier pour une création
                personnalisée. Chaque pièce est gravée, numérotée et accompagnée de son
                certificat d&apos;authenticité.
              </p>
              <div style={{ marginTop: 30, display: 'grid', gap: 14, fontFamily: C.sans, fontSize: 14, color: C.creamSoft }}>
                {([
                  { Icon: Award, label: 'Garantie à vie sur le mouvement' },
                  { Icon: Watch, label: 'Personnalisation complète du cadran' },
                  { Icon: Cog, label: 'Service après-vente en manufacture' },
                ] as const).map(({ Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon size={18} color={C.gold} /> {label}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: 'clamp(28px, 4vw, 44px)' }}>
              <div style={{ fontStyle: 'italic', fontSize: 26, marginBottom: 24, color: C.ink }}>Demander un devis</div>
              <QuoteForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ ...pad, paddingBlock: 64, background: C.bgSoft, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          <div>
            <div style={{ fontStyle: 'italic', fontSize: 24, letterSpacing: '0.16em', color: C.cream }}>HORA VIVA</div>
            <p style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, marginTop: 14, lineHeight: 1.7, maxWidth: 260 }}>
              Manufacture de haute horlogerie. Genève, depuis 1920.
            </p>
          </div>
          <div style={{ fontFamily: C.sans, fontSize: 14, color: C.creamSoft, display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><MapPin size={15} color={C.gold} /> Rue du Rhône 42, Genève</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Phone size={15} color={C.gold} /> +41 22 000 00 00</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Mail size={15} color={C.gold} /> atelier@horaviva.ch</div>
          </div>
          <div style={{ fontFamily: C.sans, fontSize: 14, color: C.creamSoft, display: 'grid', gap: 10 }}>
            {['Collections', 'Manufacture', 'Service client', 'Presse'].map((l) => (
              <a key={l} href="#" style={{ color: C.creamSoft, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ChevronRight size={13} color={C.goldDeep} /> {l}
              </a>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.border}`, fontFamily: C.sans, fontSize: 12, color: C.faint, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span>© 2024 Hora Viva Manufacture SA · Poinçon de Genève</span>
          <span>Genève · Paris · Tokyo · New York</span>
        </div>
      </footer>
    </main>
  );
}
