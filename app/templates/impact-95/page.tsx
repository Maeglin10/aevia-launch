"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import React, { useRef, useState, useEffect, useCallback } from "react";

/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
  bg:      "#FAFAF8",
  bgCard:  "#F4F1EC",
  bgDark:  "#0E100E",
  gold:    "#C9A86C",
  goldSoft:"#E8D5A8",
  platinum:"#D8D4CE",
  dark:    "#181410",
  muted:   "#8A8278",
  border:  "rgba(201,168,108,0.16)",
  teal:    "#3A8080",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');`;

/* ─── Data ───────────────────────────────────────────────────── */
const TREATMENTS = [
  { id: 1, cat: "Injectables", name: "Hyaluronic Acid Filler", desc: "Precise volume restoration and contour refinement using premium French-manufactured HA fillers. Results immediate, lasting 12–18 months.", duration: "30–45 min", price: "From €350" },
  { id: 2, cat: "Injectables", name: "Botulinum Toxin", desc: "Targeted relaxation of dynamic wrinkles — frown lines, crow's feet, forehead. Natural-looking result with zero downtime.", duration: "20 min", price: "From €200" },
  { id: 3, cat: "Laser", name: "Fraxel Dual Resurfacing", desc: "Fractional laser for skin texture, pigmentation and fine lines. Clinically proven with 3–5 day social downtime.", duration: "60 min", price: "From €480" },
  { id: 4, cat: "Laser", name: "Alexandrite Laser", desc: "Permanent hair reduction on all skin types. Course of 6 sessions. Fast, comfortable, and precise.", duration: "20–60 min", price: "From €150" },
  { id: 5, cat: "Skin", name: "HydraFacial MD", desc: "Medical-grade deep cleanse, exfoliation, extraction and serum infusion. Immediate glow, no downtime. Monthly maintenance recommended.", duration: "45 min", price: "From €190" },
  { id: 6, cat: "Skin", name: "Chemical Peel Protocol", desc: "Customised acid peel (AHA/BHA/TCA) tailored to your skin concern — hyperpigmentation, acne, aging. Series of 3 recommended.", duration: "30 min", price: "From €120" },
];

const TEAM = [
  { name: "Dr. Sophie Lemaire", role: "Aesthetic Medicine Physician", bio: "15 years of experience. Former resident at Hôpital Lariboisière. Specialist in facial anatomy and injection techniques.", cert: "DIU Médecine Esthétique" },
  { name: "Dr. Martin Delacroix", role: "Dermatologist & Laser Specialist", bio: "Board-certified dermatologist with a subspeciality in cutaneous lasers. Published author in Journal of Dermatology.", cert: "DES Dermatologie" },
];

const TESTIMONIALS = [
  { name: "Amélie R.", treatment: "Hyaluronic Acid Filler", text: "Dr Lemaire has an exceptional eye. The result looked completely natural — exactly what I wanted. I've been her patient for three years." },
  { name: "Charlotte B.", treatment: "Fraxel Resurfacing", text: "I was nervous about lasers. The team explained everything, the downtime was minimal, and my skin texture is noticeably better three months on." },
  { name: "Isabelle M.", treatment: "HydraFacial MD", text: "I come every month. It's become part of my routine. My skin has never been this consistent and healthy-looking." },
];

const TREATMENT_NAMES = [
  "Hyaluronic Filler", "Botulinum Toxin", "Fraxel Dual", "HydraFacial MD",
  "Chemical Peel", "Alexandrite Laser", "Mesotherapy", "Profhilo",
];

const CATEGORIES = ["All", "Injectables", "Laser", "Skin"];

/* ─── TextReveal ─────────────────────────────────────────────── */
function TextReveal({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : { y: "110%" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.div>
    </div>
  );
}

/* ─── MagneticButton ─────────────────────────────────────────── */
function MagneticButton({ children, style = {}, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  return (
    <motion.button ref={ref} style={{ x: sx, y: sy, cursor: "pointer", background: "none", border: "none", ...style }}
      onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }} onClick={onClick}>
      {children}
    </motion.button>
  );
}

/* ─── MarqueeStrip ───────────────────────────────────────────── */
function MarqueeStrip() {
  const items = [...TREATMENT_NAMES, ...TREATMENT_NAMES, ...TREATMENT_NAMES];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "10px 0", background: C.bgCard }}>
      <motion.div
        style={{ display: "flex", gap: 56, whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {items.map((name, i) => (
          <span key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase" }}>
            {name}
            <span style={{ marginLeft: 56, color: C.gold, fontSize: 8 }}>◇</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── LightRing — Signature Element ─────────────────────────── */
function LightRing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smx = useSpring(mouseX, { stiffness: 100, damping: 24 });
  const smy = useSpring(mouseY, { stiffness: 100, damping: 24 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  }, [mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  const cx = 200, cy = 200;
  const R_outer = 160, R_inner = 120, n = 24;

  // Polar-coordinate arc helpers
  const polarX = (angle: number, r: number) => cx + r * Math.cos(angle);
  const polarY = (angle: number, r: number) => cy + r * Math.sin(angle);

  // Ring segments
  const segments = Array.from({ length: n }, (_, i) => {
    const a0 = (i * Math.PI * 2) / n - 0.05;
    const a1 = ((i + 1) * Math.PI * 2) / n + 0.05;
    const d = [
      `M${polarX(a0, R_inner).toFixed(1)},${polarY(a0, R_inner).toFixed(1)}`,
      `A${R_inner},${R_inner} 0 0 1 ${polarX(a1, R_inner).toFixed(1)},${polarY(a1, R_inner).toFixed(1)}`,
      `L${polarX(a1, R_outer).toFixed(1)},${polarY(a1, R_outer).toFixed(1)}`,
      `A${R_outer},${R_outer} 0 0 0 ${polarX(a0, R_outer).toFixed(1)},${polarY(a0, R_outer).toFixed(1)}`,
      "Z",
    ].join(" ");
    return { d, angle: (a0 + a1) / 2 };
  });

  // Computed light angle from mouse
  const lightAngle = useTransform([smx, smy], ([x, y]: number[]) =>
    Math.atan2(y - 0.5, x - 0.5)
  );

  return (
    <div style={{ display: "flex", gap: 64, alignItems: "center" }}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ position: "relative", flexShrink: 0, cursor: "crosshair" }}
      >
        <svg width="400" height="400" viewBox="0 0 400 400" style={{ display: "block" }}>
          <defs>
            <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={C.gold} stopOpacity="0.06" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="segGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient glow */}
          <circle cx={cx} cy={cy} r={R_outer + 20} fill="url(#ringGlow)" />

          {/* Ring segments */}
          {segments.map((seg, i) => (
            <motion.path
              key={i}
              d={seg.d}
              fill={C.bgCard}
              stroke={C.bg}
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? {
                opacity: 1,
                scale: 1,
                fill: C.bgCard,
              } : { opacity: 0, scale: 0.9 }}
              style={{ originX: `${cx}px`, originY: `${cy}px` }}
              transition={{
                opacity: { duration: 0.3, delay: 0.03 * i },
                scale: { duration: 0.6, delay: 0.03 * i, ease: [0.16, 1, 0.3, 1] },
              }}
              whileHover={{ fill: C.goldSoft }}
            />
          ))}

          {/* Illuminated arc that follows mouse */}
          <motion.g>
            {segments.map((seg, i) => {
              const segAngle = seg.angle;
              return (
                <motion.path
                  key={`lit-${i}`}
                  d={seg.d}
                  style={{
                    fill: C.gold,
                    opacity: useTransform(lightAngle, (la: number) => {
                      const diff = Math.abs(((segAngle - la + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
                      return Math.max(0, 0.65 - diff * 0.55);
                    }) as any,
                  }}
                  filter="url(#segGlow)"
                />
              );
            })}
          </motion.g>

          {/* Center area — subtle face profile suggestion */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {/* Abstract face oval */}
            <ellipse cx={cx} cy={cy - 5} rx={52} ry={64} fill="none" stroke={C.platinum} strokeWidth="0.8" strokeOpacity="0.7" />
            {/* Brow line */}
            <path d={`M${cx - 22},${cy - 30} Q${cx - 8},${cy - 36} ${cx},${cy - 34} Q${cx + 8},${cy - 36} ${cx + 22},${cy - 30}`} fill="none" stroke={C.platinum} strokeWidth="0.8" strokeOpacity="0.5" />
            <path d={`M${cx - 22},${cy - 30} Q${cx - 36},${cy - 24} ${cx - 32},${cy - 18}`} fill="none" stroke={C.platinum} strokeWidth="0.8" strokeOpacity="0.5" />
            <path d={`M${cx + 22},${cy - 30} Q${cx + 36},${cy - 24} ${cx + 32},${cy - 18}`} fill="none" stroke={C.platinum} strokeWidth="0.8" strokeOpacity="0.5" />
            {/* Nose bridge */}
            <path d={`M${cx - 6},${cy - 18} Q${cx - 8},${cy + 4} ${cx - 4},${cy + 12} Q${cx},${cy + 16} ${cx + 4},${cy + 12} Q${cx + 8},${cy + 4} ${cx + 6},${cy - 18}`} fill="none" stroke={C.platinum} strokeWidth="0.8" strokeOpacity="0.4" />
            {/* Lips */}
            <path d={`M${cx - 16},${cy + 28} Q${cx - 8},${cy + 24} ${cx},${cy + 26} Q${cx + 8},${cy + 24} ${cx + 16},${cy + 28}`} fill="none" stroke={C.platinum} strokeWidth="0.8" strokeOpacity="0.4" />
            {/* Golden ratio guide point */}
            <circle cx={cx} cy={cy} r={2} fill={C.gold} fillOpacity="0.35" />
          </motion.g>

          {/* Rotating outer ring decoration */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ originX: `${cx}px`, originY: `${cy}px` }}
          >
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI * 2) / 8;
              const rx = cx + (R_outer + 12) * Math.cos(a);
              const ry = cy + (R_outer + 12) * Math.sin(a);
              return <circle key={i} cx={rx} cy={ry} r={2} fill={C.gold} fillOpacity="0.4" />;
            })}
          </motion.g>
        </svg>
      </div>

      {/* Description */}
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 24 }}>The Lumière Method</p>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 28, color: C.dark, fontFamily: "'Playfair Display', serif" }}>
          <TextReveal text="Precision in" />
          <TextReveal text="every treatment." delay={0.15} style={{ fontStyle: "italic", color: C.gold }} />
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 28, fontWeight: 300 }}>
          Move your cursor around the ring to illuminate different segments — the same precision guides how we approach each treatment area. Every zone of the face has different tissue depth, different vascular anatomy, different aesthetic goals.
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 40, fontWeight: 300 }}>
          All treatments at Lumière are performed exclusively by board-certified physicians using only CE-marked and FDA-cleared devices and medical-grade injectables.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { val: "2 MD", label: "Medical physicians" },
            { val: "15+", label: "Years combined" },
            { val: "CE/FDA", label: "All devices certified" },
          ].map(item => (
            <div key={item.label} style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: C.dark, lineHeight: 1 }}>{item.val}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: "0.04em" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── TreatmentCard ──────────────────────────────────────────── */
function TreatmentCard({ t }: { t: typeof TREATMENTS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      style={{ background: hovered ? C.bgCard : C.bg, border: `1px solid ${hovered ? C.gold : C.border}`, borderRadius: 4, padding: "28px", cursor: "pointer", transition: "background 0.25s, border-color 0.25s" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: C.gold, background: `${C.gold}16`, padding: "3px 10px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase" }}>{t.cat}</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: C.dark, fontStyle: "italic" }}>{t.price}</span>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: C.dark, marginBottom: 10, lineHeight: 1.3 }}>{t.name}</h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16, fontWeight: 300 }}>{t.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.muted }}>{t.duration}</span>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Page() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const filtered = activeCategory === "All" ? TREATMENTS : TREATMENTS.filter(t => t.cat === activeCategory);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <main style={{ background: C.bg, color: C.dark, minHeight: "100vh", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(250,250,248,0.95)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Ring mark */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" fill="none" stroke={C.gold} strokeWidth="1.2" />
            <circle cx="12" cy="12" r="4.5" fill="none" stroke={C.gold} strokeWidth="0.8" strokeOpacity="0.5" />
            <circle cx="12" cy="12" r="1.5" fill={C.gold} fillOpacity="0.6" />
          </svg>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: C.dark, lineHeight: 1 }}>Lumière Clinic</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1 }}>Aesthetic Medicine</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[
            { label: "Treatments", id: "treatments" },
            { label: "Medical Team", id: "team" },
            { label: "Technology", id: "technology" },
            { label: "About", id: "about" },
          ].map(({ label, id }) => (
            <button key={label}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.muted, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.02em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}>
              {label}
            </button>
          ))}
          <MagneticButton style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.bg, background: C.dark, padding: "9px 22px", borderRadius: 2, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
            Book Consultation
          </MagneticButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 64, overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #f7f2ec 0%, #faf8f4 40%, #f0ebe3 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(201,168,108,0.12) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 40% 40% at 80% 70%, rgba(180,160,130,0.08) 0%, transparent 60%)" }} />
          {/* Subtle ring watermark */}
          <motion.div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
            animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
            <svg width="800" height="800" viewBox="0 0 800 800" opacity="0.025">
              <circle cx="400" cy="400" r="320" fill="none" stroke={C.gold} strokeWidth="1" />
              <circle cx="400" cy="400" r="240" fill="none" stroke={C.gold} strokeWidth="0.5" />
              {Array.from({ length: 24 }, (_, i) => {
                const a = (i * Math.PI * 2) / 24;
                return <line key={i} x1={400 + 240 * Math.cos(a)} y1={400 + 240 * Math.sin(a)} x2={400 + 320 * Math.cos(a)} y2={400 + 320 * Math.sin(a)} stroke={C.gold} strokeWidth="0.8" />;
              })}
            </svg>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860, padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 36 }}
          >
            <div style={{ height: "0.5px", width: 48, background: C.gold, opacity: 0.6 }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase" }}>Medical Aesthetic Clinic · Paris 8e</p>
            <div style={{ height: "0.5px", width: 48, background: C.gold, opacity: 0.6 }} />
          </motion.div>

          <h1 style={{ fontSize: "clamp(52px, 9.5vw, 120px)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 44, fontFamily: "'Playfair Display', serif" }}>
            <TextReveal text="The science" delay={0.3} style={{ display: "block", color: C.dark }} />
            <TextReveal text="of beauty," delay={0.5} style={{ display: "block", fontStyle: "italic", color: C.gold }} />
            <TextReveal text="illuminated." delay={0.7} style={{ display: "block", color: C.dark }} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.8, maxWidth: 540, margin: "0 auto 52px", fontWeight: 300 }}
          >
            Medical-grade aesthetic treatments delivered by board-certified physicians. Injectables, laser therapy, and advanced skincare — results you can see, safety you can trust.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center" }}
          >
            <MagneticButton
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.bg, background: C.dark, padding: "16px 40px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
              Book Free Consultation
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById("treatments")?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.dark, background: "transparent", padding: "16px 40px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase", border: `1px solid ${C.border}` }}>
              View Treatments
            </MagneticButton>
          </motion.div>

          {/* Trust signal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{ marginTop: 56, display: "flex", justifyContent: "center", gap: 40 }}
          >
            {[{ val: "2,000+", label: "Patients treated" }, { val: "4.9/5", label: "Average rating" }, { val: "100%", label: "Board-certified MDs" }].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: C.dark }}>{item.val}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.muted, marginTop: 4, letterSpacing: "0.04em" }}>{item.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Light Ring — Signature Element ── */}
      <section id="technology" style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <LightRing />
      </section>

      {/* ── Treatments ── */}
      <section id="treatments" style={{ padding: "80px 0", background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Our Treatments</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.dark, fontFamily: "'Playfair Display', serif" }}>
                <TextReveal text="Evidence-based" />
                <TextReveal text="aesthetic medicine." delay={0.15} style={{ fontStyle: "italic", color: C.gold }} />
              </h2>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: activeCategory === cat ? C.bg : C.muted, background: activeCategory === cat ? C.dark : "transparent", border: `1px solid ${activeCategory === cat ? C.dark : C.border}`, padding: "7px 18px", borderRadius: 2, cursor: "pointer", letterSpacing: "0.05em", transition: "all 0.2s" }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((t, i) => (
                <motion.div key={t.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
                  <TreatmentCard t={t} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Medical Team ── */}
      <section id="team" style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Medical Team</p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.dark, fontFamily: "'Playfair Display', serif", marginBottom: 56 }}>
          <TextReveal text="Your safety," />
          <TextReveal text="their expertise." delay={0.15} style={{ fontStyle: "italic", color: C.gold }} />
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {TEAM.map((member, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ padding: "32px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: C.dark, marginBottom: 4 }}>{member.name}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.gold, letterSpacing: "0.05em", marginBottom: 16 }}>{member.role}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.75, marginBottom: 16, fontWeight: 300 }}>{member.bio}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.gold}12`, border: `1px solid ${C.border}`, borderRadius: 2, padding: "5px 12px" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill={C.gold}>
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.gold, letterSpacing: "0.06em" }}>{member.cert}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "80px 0", background: C.bgDark }}>
        <div style={{ maxWidth: 800, margin: "0 auto", paddingInline: 40, textAlign: "center" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 48 }}>Patient Reviews</p>
          <div style={{ position: "relative", minHeight: 180 }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(17px, 2.5vw, 24px)", fontWeight: 400, color: C.bg, lineHeight: 1.6, marginBottom: 32, fontStyle: "italic" }}>
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.gold }}>{TESTIMONIALS[activeTestimonial].name}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(250,250,248,0.45)", marginTop: 4 }}>{TESTIMONIALS[activeTestimonial].treatment}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 28 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? C.gold : "#2A2620", border: `1px solid ${i === activeTestimonial ? C.gold : "#3A3530"}`, cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Book CTA ── */}
      <section id="about" style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Your Consultation</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24, fontFamily: "'Playfair Display', serif", color: C.dark }}>
              <TextReveal text="Start with" />
              <TextReveal text="a conversation." delay={0.15} style={{ fontStyle: "italic", color: C.gold }} />
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 40, fontWeight: 300 }}>
              All treatments begin with a 30-minute consultation — no charge, no obligation. We take the time to understand your concerns, examine your skin, and propose a personalised treatment plan.
            </p>
            <MagneticButton style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.bg, background: C.dark, padding: "16px 44px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
              Book Consultation
            </MagneticButton>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { label: "Location", value: "24 Avenue George V, Paris 8e" },
              { label: "Hours", value: "Mon–Fri 9:00–19:00 · Sat 9:00–14:00" },
              { label: "Phone", value: "+33 1 42 00 00 00" },
              { label: "Email", value: "contact@lumiere-clinic.fr" },
            ].map(item => (
              <div key={item.label} style={{ padding: "18px 24px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.dark }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 40px", background: C.bgCard }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.dark, fontStyle: "italic" }}>Lumière Clinic · Paris 8e</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.muted }}>© 2025 — All rights reserved. Medical Disclaimer applies.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Instagram", "Appointments", "Privacy"].map(link => (
              <button key={link} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
