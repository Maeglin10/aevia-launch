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
import { useRef, useState, useEffect, useCallback } from "react";

/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
  bg:      "#0B080C",
  bgCard:  "#150F18",
  velvet:  "#1E1422",
  rose:    "#D4889A",
  roseDeep:"#A85A72",
  gold:    "#C9A86C",
  goldSoft:"#E8CFA8",
  cream:   "#F5EAE8",
  muted:   "#8A7A80",
  border:  "rgba(212,136,154,0.12)",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');`;

/* ─── Data ───────────────────────────────────────────────────── */
const SERVICES = [
  { id: 1, name: "Gel Manicure", duration: "60 min", price: "55", desc: "Long-lasting gel formula with UV curing. Perfect finish, chip-resistant for 3 weeks.", icon: "💅" },
  { id: 2, name: "Nail Art Session", duration: "90–120 min", price: "95+", desc: "Custom hand-painted designs, from minimalist lines to intricate florals and 3D elements.", icon: "✦" },
  { id: 3, name: "Full Set Acrylics", duration: "90 min", price: "75", desc: "Strong acrylic extensions sculpted to your desired length and shape.", icon: "◆" },
  { id: 4, name: "Nail Extensions", duration: "75 min", price: "65", desc: "Press-on or gel extensions for instant length with a natural, flexible feel.", icon: "▲" },
  { id: 5, name: "Luxury Spa Mani", duration: "75 min", price: "70", desc: "Deep hydration treatment with hot towels, cuticle care, and premium polish.", icon: "◇" },
  { id: 6, name: "Removal + Prep", duration: "30 min", price: "25", desc: "Safe removal of old product with nail health assessment and cuticle prep.", icon: "○" },
];

const SHADES = [
  { name: "Velvet Noir",     gradient: "linear-gradient(135deg, #1C0F1A 0%, #2D1530 100%)", shimmer: "#D4889A" },
  { name: "Dust Rose",       gradient: "linear-gradient(135deg, #C27080 0%, #E8A0B0 100%)", shimmer: "#FFD4E0" },
  { name: "Antique Gold",    gradient: "linear-gradient(135deg, #C9A86C 0%, #E8CFA8 100%)", shimmer: "#FFF5E0" },
  { name: "Midnight Plum",   gradient: "linear-gradient(135deg, #2D0B3A 0%, #4A1550 100%)", shimmer: "#C880F0" },
  { name: "Ballet Blush",    gradient: "linear-gradient(135deg, #E8C8C0 0%, #F5E0DC 100%)", shimmer: "#FFFFFF" },
  { name: "Bordeaux",        gradient: "linear-gradient(135deg, #5C1520 0%, #8A2030 100%)", shimmer: "#FF8090" },
  { name: "Chrome Rose",     gradient: "linear-gradient(135deg, #B8829A 0%, #D4B0C0 100%)", shimmer: "#FFE8F0" },
  { name: "Obsidian",        gradient: "linear-gradient(135deg, #080608 0%, #1A1418 100%)", shimmer: "#808080" },
];

const GALLERY = [
  { id: 1, style: "Floral", desc: "Delicate cherry blossoms on nude base", accent: "#FFB8C8" },
  { id: 2, style: "Minimalist", desc: "Single gold line on dusty rose", accent: C.gold },
  { id: 3, style: "Abstract", desc: "Marble swirl, rose quartz palette", accent: "#D4B0C0" },
  { id: 4, style: "3D Gems", desc: "Crystal Swarovski, dark velvet base", accent: "#C880F0" },
  { id: 5, style: "French Ombré", desc: "Blush to ivory, barely-there tip", accent: "#F5E8E4" },
  { id: 6, style: "Glitter Fade", desc: "Rose gold glitter ombré on black", accent: C.rose },
];

const TESTIMONIALS = [
  { name: "Camille R.", text: "The nail art session was a full luxury experience. My nails looked like wearable art for three weeks straight.", service: "Nail Art Session" },
  { name: "Sofia M.", text: "I've been to many nail salons — Velvet Nails is in a completely different category. The attention to detail is unreal.", service: "Gel Manicure" },
  { name: "Léonie B.", text: "Absolutely stunning acrylics. Strong, beautiful, and the consultation beforehand made all the difference.", service: "Full Set Acrylics" },
];

const SHADE_NAMES = SHADES.map(s => s.name);

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
  const items = [...SHADE_NAMES, ...SHADE_NAMES];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "10px 0", background: C.bgCard }}>
      <motion.div
        style={{ display: "flex", gap: 56, whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        {items.map((name, i) => (
          <span key={i} style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.15em", color: C.muted, fontStyle: "italic" }}>
            {name}
            <span style={{ marginLeft: 56, color: C.rose, fontSize: 8 }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── IridescentNail — Signature Element ─────────────────────── */
function IridescentNail() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smx = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smy = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const [activeShade, setActiveShade] = useState(0);

  const shimmerX = useTransform(smx, [0, 1], ["20%", "80%"]);
  const shimmerY = useTransform(smy, [0, 1], ["20%", "80%"]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const timer = setInterval(() => setActiveShade(p => (p + 1) % SHADES.length), 3200);
    return () => clearInterval(timer);
  }, []);

  const shade = SHADES[activeShade];

  return (
    <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
      {/* Giant nail SVG */}
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}
        style={{ position: "relative", flexShrink: 0, cursor: "crosshair" }}
      >
        <svg width="220" height="320" viewBox="0 0 220 320" style={{ display: "block" }}>
          <defs>
            <clipPath id="nailClip">
              <path d="M110,8 C60,8 24,52 24,110 L24,260 C24,286 44,306 70,306 L150,306 C176,306 196,286 196,260 L196,110 C196,52 160,8 110,8 Z" />
            </clipPath>
            <radialGradient id="shadeGrad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor={shade.shimmer} stopOpacity="0.35" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Nail body */}
          <motion.path
            d="M110,8 C60,8 24,52 24,110 L24,260 C24,286 44,306 70,306 L150,306 C176,306 196,286 196,260 L196,110 C196,52 160,8 110,8 Z"
            animate={{ fill: shade.gradient.includes("linear") ? undefined : shade.gradient }}
            style={{ fill: "url(#shadeGradFill)" as any }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />

          {/* Animated gradient fill */}
          <defs>
            <linearGradient id="shadeGradFill" x1="0" y1="0" x2="1" y2="1">
              <motion.stop
                offset="0%"
                animate={{ stopColor: shade.gradient.match(/#[0-9A-Fa-f]+/g)?.[0] ?? "#1C0F1A" }}
                transition={{ duration: 1.4 }}
              />
              <motion.stop
                offset="100%"
                animate={{ stopColor: shade.gradient.match(/#[0-9A-Fa-f]+/g)?.[1] ?? "#2D1530" }}
                transition={{ duration: 1.4 }}
              />
            </linearGradient>
          </defs>

          <path d="M110,8 C60,8 24,52 24,110 L24,260 C24,286 44,306 70,306 L150,306 C176,306 196,286 196,260 L196,110 C196,52 160,8 110,8 Z" fill="url(#shadeGradFill)" />

          {/* Iridescent shimmer layer — follows mouse */}
          <g clipPath="url(#nailClip)">
            <motion.circle
              style={{ cx: useTransform(smx, [0, 1], [60, 160]), cy: useTransform(smy, [0, 1], [80, 240]) }}
              r="80"
              fill="url(#shadeGrad)"
            />
            {/* Highlight streak */}
            <motion.ellipse
              cx={70}
              cy={100}
              rx={24}
              ry={60}
              fill="white"
              opacity={0.08}
              style={{ rotate: -20 }}
            />
          </g>

          {/* Nail cuticle edge */}
          <path d="M110,8 C60,8 24,52 24,110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M110,8 C160,8 196,52 196,110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* Subtle sparkle dots */}
          {[
            [140, 80], [155, 120], [130, 60], [160, 100],
          ].map(([cx, cy], i) => (
            <motion.circle key={i} cx={cx} cy={cy} r={1.5} fill={shade.shimmer}
              animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>

        {/* Reflection blur */}
        <div style={{ position: "absolute", bottom: -24, left: "50%", transform: "translateX(-50%)", width: 120, height: 20, background: shade.shimmer, opacity: 0.08, borderRadius: "50%", filter: "blur(12px)" }} />
      </div>

      {/* Shade selector */}
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, letterSpacing: "0.3em", color: C.rose, textTransform: "uppercase", marginBottom: 20 }}>Current Shade</p>
        <AnimatePresence mode="wait">
          <motion.h3
            key={activeShade}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: C.cream, marginBottom: 32, fontStyle: "italic" }}
          >
            {shade.name}
          </motion.h3>
        </AnimatePresence>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {SHADES.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveShade(i)}
              style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
            >
              <motion.div
                whileHover={{ scale: 1.12 }}
                style={{
                  width: "100%",
                  aspectRatio: "1/2",
                  borderRadius: "50px",
                  background: s.gradient,
                  border: i === activeShade ? `2px solid ${C.rose}` : `2px solid transparent`,
                  boxShadow: i === activeShade ? `0 0 16px ${s.shimmer}40` : "none",
                  transition: "box-shadow 0.3s, border-color 0.3s",
                }}
              />
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: i === activeShade ? C.cream : C.muted, marginTop: 6, textAlign: "center", letterSpacing: "0.05em" }}>
                {s.name.split(" ")[0]}
              </p>
            </button>
          ))}
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.muted, marginTop: 24, lineHeight: 1.65 }}>
          Each shade is curated from our seasonal collection. Hover the nail to see the iridescent shimmer effect.
        </p>
      </div>
    </div>
  );
}

/* ─── ServiceCard ────────────────────────────────────────────── */
function ServiceCard({ service }: { service: typeof SERVICES[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ padding: "28px", background: C.bgCard, border: `1px solid ${hovered ? C.rose : C.border}`, borderRadius: 4, cursor: "pointer", transition: "border-color 0.3s" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.rose}18`, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="1.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: C.cream, letterSpacing: "-0.02em" }}>€{service.price}</span>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: C.cream, marginBottom: 8, lineHeight: 1.3 }}>{service.name}</h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.muted, marginBottom: 16, letterSpacing: "0.05em" }}>{service.duration}</p>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{service.desc}</p>
      <motion.div style={{ marginTop: 20, height: 1, background: C.rose, scaleX: hovered ? 1 : 0, transformOrigin: "left" }} transition={{ duration: 0.3 }} />
    </motion.div>
  );
}

/* ─── GalleryCard ────────────────────────────────────────────── */
function GalleryCard({ item }: { item: typeof GALLERY[0] }) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotBg = useTransform([mouseX, mouseY], ([x, y]) =>
    `radial-gradient(200px circle at ${x}px ${y}px, ${item.accent}20 0%, transparent 70%)`
  );
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  };
  return (
    <motion.div
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", background: spotBg as any, overflow: "hidden", borderRadius: 4, border: `1px solid ${C.border}`, cursor: "pointer" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
    >
      {/* Simulated nail art preview */}
      <div style={{ aspectRatio: "4/5", display: "flex", alignItems: "center", justifyContent: "center", background: C.bgCard, position: "relative", overflow: "hidden" }}>
        <svg width="80%" height="80%" viewBox="0 0 200 240">
          <defs>
            <linearGradient id={`g-${item.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.velvet} />
              <stop offset="100%" stopColor={C.bgCard} />
            </linearGradient>
          </defs>
          {/* Nail shape */}
          <path d="M100,6 C56,6 20,46 20,96 L20,200 C20,222 38,240 60,240 L140,240 C162,240 180,222 180,200 L180,96 C180,46 144,6 100,6 Z" fill={`url(#g-${item.id})`} stroke={item.accent} strokeWidth="0.5" strokeOpacity="0.5" />
          {/* Art decoration based on style */}
          {item.style === "Floral" && (
            <>
              {[100, 80, 120, 90, 110].map((cx, i) => (
                <circle key={i} cx={cx} cy={120 + i * 15} r={4 + i % 2 * 2} fill={item.accent} opacity={0.6} />
              ))}
            </>
          )}
          {item.style === "Minimalist" && (
            <line x1="60" y1="180" x2="140" y2="100" stroke={item.accent} strokeWidth="1.5" opacity="0.8" />
          )}
          {item.style === "Abstract" && (
            <path d="M60,80 Q120,140 80,200 Q140,160 140,100" fill="none" stroke={item.accent} strokeWidth="2" opacity="0.6" />
          )}
          {item.style === "3D Gems" && (
            <>
              {[[100, 120], [85, 145], [115, 145], [100, 170]].map(([cx, cy], i) => (
                <polygon key={i} points={`${cx},${cy - 8} ${cx + 7},${cy} ${cx},${cy + 8} ${cx - 7},${cy}`} fill={item.accent} opacity={0.7} />
              ))}
            </>
          )}
          {item.style === "French Ombré" && (
            <path d="M40,200 Q100,180 160,200 L180,200 L180,220 L20,220 L20,200 Z" fill={item.accent} opacity="0.3" />
          )}
          {item.style === "Glitter Fade" && (
            <>
              {Array.from({ length: 14 }, (_, i) => (
                <circle key={i} cx={50 + (i * 23) % 100} cy={100 + i * 10} r={1.5} fill={item.accent} opacity={0.5 + (i % 3) * 0.15} />
              ))}
            </>
          )}
          {/* Shimmer */}
          <ellipse cx={65} cy={90} rx={18} ry={40} fill="white" opacity="0.05" transform="rotate(-15,65,90)" />
        </svg>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, background: "rgba(11,8,12,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ textAlign: "center", padding: 16 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.cream, fontStyle: "italic", marginBottom: 8 }}>{item.style}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.muted }}>{item.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontStyle: "italic", color: C.cream }}>{item.style}</p>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Page() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

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
    <main style={{ background: C.bg, color: C.cream, minHeight: "100vh", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(11,8,12,0.88)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Velvet Nails logomark */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 5 6 5 10 L5 18 C5 20.2 6.8 22 9 22 L15 22 C17.2 22 19 20.2 19 18 L19 10 C19 6 16 2 12 2 Z" fill={C.rose} fillOpacity="0.9" />
            <ellipse cx="9" cy="8" rx="2" ry="3" fill="white" fillOpacity="0.12" />
          </svg>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: C.cream, letterSpacing: "0.05em" }}>Velvet Nails</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Services", "Gallery", "Shades", "Book"].map(item => (
            <button key={item} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.muted, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.03em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              {item}
            </button>
          ))}
          <MagneticButton style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.bg, background: C.rose, padding: "8px 20px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
            Book Now
          </MagneticButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 64, overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          {/* Velvet texture ambient */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,136,154,0.08) 0%, transparent 65%)" }} />
          {/* Floating nail shapes */}
          {[
            { x: "8%", y: "20%", size: 48, delay: 0 },
            { x: "85%", y: "15%", size: 36, delay: 0.6 },
            { x: "12%", y: "65%", size: 28, delay: 1.1 },
            { x: "88%", y: "70%", size: 52, delay: 0.3 },
            { x: "50%", y: "8%", size: 20, delay: 0.9 },
          ].map((item, i) => (
            <motion.div
              key={i}
              style={{ position: "absolute", left: item.x, top: item.y }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.18, y: 0 }}
              transition={{ duration: 1, delay: item.delay }}
            >
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width={item.size} height={item.size * 1.4} viewBox="0 0 24 34">
                  <path d="M12 2C7 2 3 7 3 12 L3 26 C3 29 5.6 32 9 32 L15 32 C18.4 32 21 29 21 26 L21 12 C21 7 17 2 12 2 Z" fill={C.rose} />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860, padding: "0 24px" }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, letterSpacing: "0.35em", color: C.rose, textTransform: "uppercase", marginBottom: 28, fontStyle: "italic" }}
          >
            Nail Atelier · Paris 9e
          </motion.p>
          <h1 style={{ fontSize: "clamp(52px, 10vw, 118px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.03em", marginBottom: 40, fontFamily: "'Playfair Display', serif" }}>
            <TextReveal text="Nails as" delay={0.3} style={{ display: "block", color: C.cream }} />
            <TextReveal text="wearable" delay={0.5} style={{ display: "block", fontStyle: "italic", color: C.rose }} />
            <TextReveal text="art." delay={0.7} style={{ display: "block", color: C.goldSoft }} />
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 48px", fontWeight: 300 }}
          >
            Bespoke gel, acrylic and hand-painted nail art crafted in a private atelier setting. Seasonal collections, premium materials, and a finish that lasts.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center" }}
          >
            <MagneticButton style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.bg, background: C.cream, padding: "15px 36px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
              Book a Session
            </MagneticButton>
            <MagneticButton style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.cream, background: "transparent", padding: "15px 36px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${C.border}` }}>
              View Gallery
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Iridescent Nail — Signature Element ── */}
      <section style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.4em", color: C.rose, textTransform: "uppercase", marginBottom: 16 }}>Shade Collection</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.cream, fontFamily: "'Playfair Display', serif" }}>
            <TextReveal text="Curated palettes," />
            <TextReveal text="iridescent finishes." delay={0.15} style={{ fontStyle: "italic", color: C.rose }} />
          </h2>
        </div>
        <IridescentNail />
      </section>

      {/* ── Services ── */}
      <section style={{ padding: "80px 0", background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.4em", color: C.rose, textTransform: "uppercase", marginBottom: 16 }}>Services</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.cream, fontFamily: "'Playfair Display', serif" }}>
              <TextReveal text="Every service," />
              <TextReveal text="a ritual." delay={0.15} style={{ fontStyle: "italic" }} />
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {SERVICES.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                <ServiceCard service={s} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.4em", color: C.rose, textTransform: "uppercase", marginBottom: 16 }}>Nail Art Gallery</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.cream, fontFamily: "'Playfair Display', serif" }}>
              <TextReveal text="Styles & Designs" />
            </h2>
          </div>
          <MagneticButton style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.rose, background: "transparent", border: `1px solid ${C.rose}`, padding: "10px 24px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            All Looks
          </MagneticButton>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {GALLERY.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}>
              <GalleryCard item={item} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "80px 0", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", paddingInline: 40, textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.4em", color: C.rose, textTransform: "uppercase", marginBottom: 48 }}>Client Reviews</p>

          <div style={{ position: "relative", minHeight: 180 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45 }}
              >
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(16px, 2.5vw, 24px)", fontWeight: 400, color: C.cream, lineHeight: 1.6, marginBottom: 32, fontStyle: "italic" }}>
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.rose, fontWeight: 500 }}>{TESTIMONIALS[activeTestimonial].name}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.muted, marginTop: 4 }}>{TESTIMONIALS[activeTestimonial].service}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 36 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 28 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? C.rose : C.bgCard, border: `1px solid ${i === activeTestimonial ? C.rose : C.border}`, cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Booking ── */}
      <section style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.4em", color: C.rose, textTransform: "uppercase", marginBottom: 20 }}>Atelier</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24, fontFamily: "'Playfair Display', serif", color: C.cream }}>
              <TextReveal text="Your nails," />
              <TextReveal text="our obsession." delay={0.15} style={{ fontStyle: "italic", color: C.rose }} />
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 40, fontWeight: 300 }}>
              Private appointments only. Located in a quiet studio in Paris 9e, a short walk from Pigalle. Consultations are always included — we take the time to understand what you want before we begin.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <MagneticButton style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.bg, background: C.rose, padding: "15px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                Book Now
              </MagneticButton>
              <MagneticButton style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.cream, background: "transparent", border: `1px solid ${C.border}`, padding: "15px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                View Availability
              </MagneticButton>
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {[
              { label: "Location", value: "12 rue de la Victoire, Paris 9e" },
              { label: "Hours", value: "Tue–Sat, 10:00–19:00" },
              { label: "Booking", value: "Online only — 48hr notice minimum" },
              { label: "Contact", value: "studio@velvetnails.fr" },
            ].map(item => (
              <div key={item.label} style={{ padding: "20px 24px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.rose, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.cream }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 40px", background: C.bgCard }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: C.muted, fontStyle: "italic" }}>Velvet Nails · Paris</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.05em" }}>© 2025 — All rights reserved</p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Instagram", "Pinterest", "Contact"].map(link => (
              <button key={link} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
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
