"use client";
// @ts-nocheck

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

/* ─── Design Tokens ─────────────────────────────────────────── */
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
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
  bg:       "#FAF6EF",
  bgWarm:   "#F0E6D3",
  bgCard:   "#EEDFCA",
  brown:    "#3D2010",
  browndark:"#2A1508",
  amber:    "#C47A35",
  terracotta:"#9B4E28",
  crust:    "#7A5230",
  muted:    "#8A7060",
  border:   "rgba(90,50,24,0.12)",
  cream:    "#FAF6EF",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Cabin:wght@400;500;600&display=swap');
@media (max-width: 900px) {
  .ml90-navlinks { display: none !important; }
  .ml90-burger { display: flex !important; }
}`;

/* ─── Data ───────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Pains", href: "#pains" },
  { label: "Services", href: "#services" },
  { label: "Ateliers", href: "#workshops" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" }
];

const BREADS = [
  { id: 1, name: "Miche au Levain", tag: "Signature", price: "8.50", desc: "24h fermentation, stone-ground T65 flour, open crumb, caramelised crust. Our most beloved loaf.", baked: "Daily 7:00" },
  { id: 2, name: "Pain de Seigle", tag: "Classic", price: "6.90", desc: "40% dark rye, light sour, dense and moist. Exceptional with butter and smoked salmon.", baked: "Tue / Thu / Sat" },
  { id: 3, name: "Épi de Blé", tag: "Seasonal", price: "4.20", desc: "Pull-apart wheat stalk, soft crumb with a crisp crust. Made fresh each morning.", baked: "Daily 8:00" },
  { id: 4, name: "Fougasse aux Olives", tag: "Southern", price: "5.50", desc: "Provençal flatbread with Kalamata olives, rosemary, and olive oil. Limited quantity.", baked: "Fri / Sat" },
  { id: 5, name: "Brioche Feuilletée", tag: "Weekend", price: "3.80", desc: "Laminated butter brioche — flaky, rich, golden. Sells out by 10am every Saturday.", baked: "Sat only" },
  { id: 6, name: "Tourte de Meule", tag: "Artisan", price: "9.20", desc: "Wholegrain sourdough milled on-site, complex flavour, thick crust, exceptional shelf life.", baked: "Wed / Sat" },
];

const PROCESS = [
  { step: "01", title: "The Starter", time: "72h", desc: "Our levain has been alive for 11 years, fed daily with spring water and organic flour. It's the soul of every loaf." },
  { step: "02", title: "Autolyse", time: "1h", desc: "Flour and water rest together before salt is added. Gluten develops naturally, without force." },
  { step: "03", title: "Bulk Ferment", time: "8–12h", desc: "The dough rises slowly at cool temperature. Flavour develops. Bubbles form. Patience is the only ingredient." },
  { step: "04", title: "Shape & Proof", time: "overnight", desc: "Hand-shaped and placed in linen bannetons. Cold retard overnight. The tension holds everything together." },
  { step: "05", title: "Score & Bake", time: "45 min", desc: "Into the deck oven at 250°C with steam. The score blooms. The crust caramelises. The kitchen fills with bread." },
];

const WORKSHOPS = [
  { name: "Introduction to Sourdough", date: "Sat 17 May", price: "85", spots: 3 },
  { name: "Pain de Campagne Masterclass", date: "Sat 24 May", price: "95", spots: 6 },
  { name: "Viennoiserie Weekend", date: "Sat–Sun 7–8 Jun", price: "160", spots: 2 },
];

const SPECIALTIES = ["Levain Signature", "Seigle 40%", "Brioche feuilletée", "Fougasse Olive", "Tourte de Meule", "Épi de Blé"];

/* ─── TextReveal ─────────────────────────────────────────────── */
function TextReveal({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : { y: "110%" }}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
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
  const items = [...SPECIALTIES, ...SPECIALTIES];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "11px 0", background: C.brown }}>
      <motion.div
        style={{ display: "flex", gap: 56, whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {items.map((name, i) => (
          <span key={i} style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.12em", color: C.bgWarm, fontStyle: "italic" }}>
            {name}
            <span style={{ marginLeft: 56, color: C.amber, fontSize: 10 }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── SteamingLoaf — Signature Element ───────────────────────── */
function SteamingLoaf() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} style={{ display: "flex", gap: 64, alignItems: "center" }}>
      {/* Loaf SVG */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width="340" height="260" viewBox="0 0 340 260" style={{ display: "block" }}>
          <defs>
            <radialGradient id="crustGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#E8A84C" />
              <stop offset="50%" stopColor="#C47A35" />
              <stop offset="100%" stopColor="#7A4820" />
            </radialGradient>
            <radialGradient id="crustShine" cx="30%" cy="25%" r="45%">
              <stop offset="0%" stopColor="rgba(255,220,140,0.3)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="softShadow">
              <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#5C3520" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Loaf body */}
          <ellipse cx="170" cy="180" rx="148" ry="72" fill="url(#crustGrad)" filter="url(#softShadow)" />

          {/* Dome top */}
          <path d="M40,180 Q60,80 170,72 Q280,80 300,180 Z" fill="url(#crustGrad)" />
          <path d="M40,180 Q60,80 170,72 Q280,80 300,180 Z" fill="url(#crustShine)" />

          {/* Score marks — animated pathLength */}
          {[
            "M140,100 Q170,88 200,100",
            "M120,125 Q170,108 220,125",
            "M110,150 Q170,130 230,150",
            "M115,170 Q170,152 225,170",
          ].map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke={C.browndark}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1, delay: 0.4 + i * 0.2, ease: [0.4, 0, 0.2, 1] }}
            />
          ))}

          {/* Diagonal score */}
          <motion.path
            d="M120,110 Q148,105 175,102 Q202,98 230,104"
            fill="none"
            stroke={C.browndark}
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.45 } : {}}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Crust texture dots */}
          {[
            [90, 175], [110, 190], [130, 196], [200, 196], [240, 190], [270, 178], [285, 162],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={2.5} fill={C.browndark} opacity={0.15} />
          ))}

          {/* Steam plumes */}
          {[130, 170, 210].map((x, i) => (
            <g key={i}>
              <motion.path
                d={`M${x},72 Q${x - 8},56 ${x},42 Q${x + 8},28 ${x},14`}
                fill="none"
                stroke="rgba(200,160,100,0.35)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, y: 12 }}
                animate={inView
                  ? { pathLength: [0, 1, 0], opacity: [0, 0.5, 0], y: [10, 0, -8] }
                  : {}}
                transition={{ duration: 2.5, delay: 1.5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Process stats */}
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 20 }}>Craft & Patience</p>
        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 28, color: C.brown, fontFamily: "'Playfair Display', serif" }}>
          <TextReveal text="Eleven years" />
          <TextReveal text="of the same starter." delay={0.15} style={{ fontStyle: "italic", color: C.terracotta }} />
        </h2>
        <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 36 }}>
          Our levain is not a recipe — it's a living thing. Fed every morning, kept at 18°C, it's been producing the same complex sour note since 2013. Every loaf carries that history.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { val: "24h", label: "Min ferment" },
            { val: "11", label: "Years of levain" },
            { val: "4:00", label: "First bake daily" },
          ].map(item => (
            <div key={item.label} style={{ paddingTop: 16, borderTop: `2px solid ${C.amber}` }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.brown, letterSpacing: "-0.02em", lineHeight: 1 }}>{item.val}</p>
              <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.muted, marginTop: 6, letterSpacing: "0.03em" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── BreadCard ──────────────────────────────────────────────── */
function BreadCard({ bread }: { bread: typeof BREADS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      style={{ background: hovered ? C.bgCard : C.bgWarm, border: `1px solid ${hovered ? C.amber : C.border}`, borderRadius: 6, padding: "24px", cursor: "pointer", transition: "background 0.3s, border-color 0.3s" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: C.brown, marginBottom: 4, lineHeight: 1.3 }}>{bread.name}</h3>
          <span style={{ fontFamily: "'Cabin', sans-serif", fontSize: 10, color: C.terracotta, background: `${C.terracotta}18`, padding: "2px 8px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>{bread.tag}</span>
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: C.brown }}>€{bread.price}</span>
      </div>
      <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 16 }}>{bread.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span style={{ fontFamily: "'Cabin', sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.05em" }}>Baked {bread.baked}</span>
      </div>
    </motion.div>
  );
}

/* ─── ProcessStep ────────────────────────────────────────────── */
function ProcessStep({ step, index }: { step: typeof PROCESS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      style={{ display: "flex", gap: 28, paddingBottom: 32, borderBottom: `1px solid ${C.border}` }}
    >
      <div style={{ flexShrink: 0, paddingTop: 4 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: C.amber, fontStyle: "italic", letterSpacing: "0.1em" }}>{step.step}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: C.brown }}>{step.title}</h3>
          <span style={{ fontFamily: "'Cabin', sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.08em", background: C.bgCard, padding: "3px 10px", borderRadius: 2 }}>{step.time}</span>
        </div>
        <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{step.desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── ServicesSection ───────────────────────────────────────── */
const SERVICES_90 = [
  { name: "Pain Sur-Mesure", desc: "Commandes spéciales pour événements, restaurants et banquets. Formes et farines adaptées.", icon: "🥖" },
  { name: "Click & Collect", desc: "Réservez votre pain en ligne et venez le récupérer dès l'ouverture sans faire la queue.", icon: "🛍️" },
  { name: "Ateliers Levain", desc: "Découvrez nos masterclass le samedi matin pour apprendre à dompter le levain sauvage.", icon: "🎓" }
];

function ServicesSection() {
  return (
    <section id="services" style={{ padding: "80px 0", background: C.bgCard, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 16 }}>Nos Services</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, color: C.brown, fontFamily: "'Playfair Display', serif" }}>
            Au-delà de <span style={{ fontStyle: "italic", color: C.terracotta }}>la fournée</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {SERVICES_90.map((svc, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 20 }}>{svc.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: C.brown, marginBottom: 12 }}>{svc.name}</h3>
              <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TestimonialsSection ────────────────────────────────────── */
const TESTIMONIALS_90 = [
  { name: "Jean-Pierre D.", review: "Le pain de meule est extraordinaire, il se garde 5 jours sans aucun problème. La croûte est bien caramélisée, exactement comme j'aime.", origin: "Croix-Rousse" },
  { name: "Marie-Laure G.", review: "J'ai participé à l'atelier levain du samedi matin. Une révélation ! Je fais maintenant mon propre pain à la maison grâce aux conseils du chef.", origin: "Lyon 6e" },
  { name: "Antoine S.", review: "La brioche feuilletée du samedi matin est un chef-d'œuvre. Beurre parfait, croustillante et fondante à la fois. Pensez à réserver !", origin: "Caluire" }
];

function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ padding: "80px 0", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 16 }}>Témoignages</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, color: C.brown, fontFamily: "'Playfair Display', serif" }}>
            Paroles de <span style={{ fontStyle: "italic", color: C.terracotta }}>passionnés</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {TESTIMONIALS_90.map((t, i) => (
            <div key={i} style={{ background: C.bgCard, borderRadius: 6, padding: 28, border: `1px solid ${C.border}` }}>
              <div style={{ color: C.amber, fontSize: 18, marginBottom: 12 }}>★★★★★</div>
              <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.brown, lineHeight: 1.6, fontStyle: "italic", marginBottom: 20 }}>
                "{t.review}"
              </p>
              <div style={{ fontSize: 12, fontFamily: "'Cabin', sans-serif", color: C.muted }}>
                <strong>{t.name}</strong> · {t.origin}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FaqSection ────────────────────────────────────────────── */
const FAQS_90 = [
  { q: "Qu'est-ce que le levain naturel ?", a: "Le levain naturel est un mélange de farine et d'eau où se développent des levures sauvages et des bactéries lactiques. Contrairement à la levure de boulangerie industrielle, il fermente lentement (24h à 48h), ce qui rend le pain plus digeste, aromatique et durable." },
  { q: "Proposez-vous du pain sans gluten ?", a: "Nous travaillons principalement des farines de blé ancien, de seigle et d'épeautre qui contiennent du gluten. Bien que notre fermentation longue dégrade une grande partie du gluten, nous n'avons pas d'environnement certifié 'sans allergènes' pour les personnes cœliaques." },
  { q: "Comment réserver un atelier de boulangerie ?", a: "Vous pouvez réserver directement sur notre site via la liste des ateliers ci-dessus. Les places étant limitées (6 personnes max), nous vous conseillons de réserver 3 à 4 semaines à l'avance." },
  { q: "Peut-on commander son pain en avance ?", a: "Oui, via notre service de Click & Collect. Les commandes doivent être passées avant 16h pour un retrait le lendemain matin." }
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section id="faq" style={{ padding: "80px 0", background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 800, margin: "0 auto", paddingInline: 40 }}>
        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 16 }}>Des réponses à vos questions</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, color: C.brown, fontFamily: "'Playfair Display', serif" }}>
            Questions <span style={{ fontStyle: "italic", color: C.terracotta }}>Fréquentes</span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS_90.map((faq, idx) => (
            <div key={idx} style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", background: "#FAF6EF" }}>
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: C.brown,
                  textAlign: "left"
                }}
              >
                <span>{faq.q}</span>
                <span style={{ fontSize: 18, color: C.amber }}>{openIndex === idx ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ padding: "0 24px 20px", fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.65 }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ContactSection ────────────────────────────────────────── */
function ContactSection() {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  return (
    <section id="contact" style={{ padding: "80px 0", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 20 }}>Contact</p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.brown, fontFamily: "'Playfair Display', serif", marginBottom: 36 }}>
              Écrivez à <br /><span style={{ fontStyle: "italic", color: C.terracotta }}>la Maison.</span>
            </h2>
            <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 36 }}>
              Une question sur nos ateliers, une commande spéciale pour un événement ou simplement envie de nous dire bonjour ? Remplissez le formulaire ci-contre et nous vous répondrons sous 24h.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.brown }}>
              <p>📞 <strong>Téléphone :</strong> +33 4 78 28 00 00</p>
              <p>✉ <strong>Email :</strong>{fd?.email ?? "contact@maisonlaval.fr"}</p>
              <p>📍 <strong>Adresse :</strong> 47 Grande Rue de la Croix-Rousse, 69004 Lyon</p>
            </div>
          </div>

          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, padding: 36 }}>
            {contactSubmitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{
                  width: 48, height: 48,
                  borderRadius: "50%",
                  border: `2px solid ${C.amber}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px"
                }}>
                  <span style={{ color: C.amber, fontSize: 20 }}>✓</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: C.brown, marginBottom: 12 }}>Message envoyé</h3>
                <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 24 }}>
                  Merci, nous vous répondrons sous 24h.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  style={{
                    background: C.brown,
                    color: C.bg,
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 3,
                    fontFamily: "'Cabin', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "uppercase"
                  }}
                >
                  Nouveau message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <div>
                  <label style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, fontWeight: 600, color: C.brown, display: "block", marginBottom: 8 }}>Nom complet</label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, padding: "12px", fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.brown, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, fontWeight: 600, color: C.brown, display: "block", marginBottom: 8 }}>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="vous@email.com"
                    style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, padding: "12px", fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.brown, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, fontWeight: 600, color: C.brown, display: "block", marginBottom: 8 }}>Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Votre message..."
                    style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, padding: "12px", fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.brown, outline: "none", resize: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: C.brown,
                    color: C.bg,
                    border: "none",
                    padding: "16px",
                    borderRadius: 3,
                    fontFamily: "'Cabin', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

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
    C = { ...C, brown: brand };
  }

  const [activeProcess, setActiveProcess] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

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
    <main style={{ background: C.bg, color: C.brown, minHeight: "100vh", fontFamily: "'Cabin', sans-serif", overflowX: "hidden" }}>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(250,246,239,0.94)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        {fd?.logoBase64 ? (
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Wheat SVG mark */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <line x1="14" y1="26" x2="14" y2="6" stroke={C.amber} strokeWidth="1.5" />
              {[8, 11, 14, 17, 20].map((y, i) => (
                <g key={i}>
                  <ellipse cx={9} cy={y} rx={4} ry={2.5} fill={C.amber} opacity={0.8} transform={`rotate(-25,9,${y})`} />
                  <ellipse cx={19} cy={y} rx={4} ry={2.5} fill={C.amber} opacity={0.8} transform={`rotate(25,19,${y})`} />
                </g>
              ))}
            </svg>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.brown, lineHeight: 1 }}>{fd?.businessName ?? "Maison Laval"}</p>
              <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 9, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>Boulangerie Artisanale</p>
            </div>
          </div>
        )}
        <div className="ml90-navlinks" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map(link => (
            <Link key={link.label} href={link.href} style={{ fontFamily: "'Cabin', sans-serif", fontSize: 13, color: C.muted, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.brown)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              {link.label}
            </Link>
          ))}
          <MagneticButton style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.bg, background: C.brown, padding: "8px 20px", borderRadius: 3, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }} onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>
            Commander
          </MagneticButton>
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="ml90-burger" aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <span style={{ width: 22, height: 2, background: C.brown, borderRadius: 1, display: "block", transition: "transform 0.3s", transform: mobileOpen ? "rotate(45deg) translate(0, 7px)" : "none" }} />
          <span style={{ width: 22, height: 2, background: C.brown, borderRadius: 1, display: "block", opacity: mobileOpen ? 0 : 1, transition: "opacity 0.3s" }} />
          <span style={{ width: 22, height: 2, background: C.brown, borderRadius: 1, display: "block", transition: "transform 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(0, -7px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 49, background: "rgba(250,246,239,0.97)", borderTop: `1px solid ${C.border}`, padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
          {NAV_LINKS.map(link => (
            <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ fontFamily: "'Cabin', sans-serif", fontSize: 15, color: C.brown, textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
              {link.label}
            </Link>
          ))}
          <button onClick={() => { setMobileOpen(false); document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}); }}
            style={{ fontFamily: "'Cabin', sans-serif", fontSize: 13, color: C.bg, background: C.brown, padding: "12px 20px", borderRadius: 3, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, border: "none", cursor: "pointer", marginTop: 8 }}>
            Commander
          </button>
        </div>
      )}

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 64, overflow: "hidden", background: C.bgWarm }}>
        {/* Warm ambient */}
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 35%, rgba(196,122,53,0.12) 0%, transparent 65%)" }} />
          {/* Wheat pattern bg */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} viewBox="0 0 800 600">
            {[...Array(10)].map((_, i) => (
              <g key={i} transform={`translate(${80 * i}, ${i % 2 === 0 ? 50 : 150})`}>
                <line x1="20" y1="200" x2="20" y2="20" stroke={C.brown} strokeWidth="1.5" />
                {[40, 60, 80, 100, 120].map((y, j) => (
                  <g key={j}>
                    <ellipse cx={10} cy={y} rx={8} ry={4} fill={C.brown} opacity="0.7" transform={`rotate(-25,10,${y})`} />
                    <ellipse cx={30} cy={y} rx={8} ry={4} fill={C.brown} opacity="0.7" transform={`rotate(25,30,${y})`} />
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860, padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 32 }}
          >
            <div style={{ height: 1, width: 48, background: C.amber }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, letterSpacing: "0.3em", color: C.terracotta, fontStyle: "italic" }}>Depuis 1987 · Lyon, Croix-Rousse</p>
            <div style={{ height: 1, width: 48, background: C.amber }} />
          </motion.div>

          <h1 style={{ fontSize: "clamp(52px, 9vw, 112px)", fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 40, fontFamily: "'Playfair Display', serif" }}>{c?.heroHeadline ?? <>
            <TextReveal text="Le pain" delay={0.3} style={{ display: "block", color: C.brown }} />
            <TextReveal text="comme" delay={0.5} style={{ display: "block", fontStyle: "italic", color: C.terracotta }} />
            <TextReveal text="il se doit." delay={0.7} style={{ display: "block", color: C.brown }} />
          </>}</h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Cabin', sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 48px", fontWeight: 400 }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Boulangerie artisanale à Lyon depuis 1987. Pains au levain, viennoiseries feuilletées, et ateliers de boulangerie. Tout est fait à la main, dans le respect du temps.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center" }}
          >
            <MagneticButton style={{ fontFamily: "'Cabin', sans-serif", fontSize: 13, color: C.bg, background: C.brown, padding: "15px 36px", borderRadius: 3, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
              Nos Pains
            </MagneticButton>
            <MagneticButton style={{ fontFamily: "'Cabin', sans-serif", fontSize: 13, color: C.brown, background: "transparent", padding: "15px 36px", borderRadius: 3, letterSpacing: "0.08em", textTransform: "uppercase", border: `1px solid ${C.border}` }}>
              Commander en Ligne
            </MagneticButton>
          </motion.div>

          {/* Opening hours pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{ marginTop: 48, display: "inline-flex", alignItems: "center", gap: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 40, padding: "10px 24px" }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4CAF50" }} />
            <span style={{ fontFamily: "'Cabin', sans-serif", fontSize: 13, color: C.brown, fontWeight: 500 }}>Ouvert aujourd'hui · 7h00–19h30</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Steaming Loaf — Signature Element ── */}
      <section style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <SteamingLoaf />
      </section>

      {/* ── Services ── */}
      <ServicesSection />

      {/* ── Bread Menu ── */}
      <section id="pains" style={{ padding: "80px 0", background: C.bgWarm, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 16 }}>La Gamme</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.brown, fontFamily: "'Playfair Display', serif" }}>
              <TextReveal text="Nos Pains" />
              <TextReveal text="de la Semaine" delay={0.15} style={{ fontStyle: "italic" }} />
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {BREADS.map((bread, i) => (
              <motion.div
                key={bread.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <BreadCard bread={bread} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 20 }}>Notre Méthode</p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.brown, fontFamily: "'Playfair Display', serif", marginBottom: 40 }}>{c?.aboutTitle ?? fd?.businessName ?? <>
              <TextReveal text="Chaque étape," />
              <TextReveal text="faite à la main." delay={0.15} style={{ fontStyle: "italic", color: C.terracotta }} />
            </>}</h2>
            <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 36 }}>{c?.aboutText ?? <>
              Il n'y a pas de raccourcis. La boulangerie artisanale prend du temps — c'est sa force. Chaque pain que vous achetez est le résultat de 36 à 48 heures de travail.
            </>}</p>
            {/* Wheat illustration */}
            <svg width="160" height="200" viewBox="0 0 160 200" style={{ opacity: 0.6 }}>
              <line x1="80" y1="195" x2="80" y2="30" stroke={C.amber} strokeWidth="2" />
              {[60, 85, 110, 135, 160].map((y, i) => (
                <g key={i}>
                  <motion.ellipse
                    cx={52}
                    cy={y}
                    rx={18}
                    ry={9}
                    fill={C.amber}
                    opacity={0.7}
                    transform={`rotate(-30,52,${y})`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                  />
                  <motion.ellipse
                    cx={108}
                    cy={y}
                    rx={18}
                    ry={9}
                    fill={C.amber}
                    opacity={0.7}
                    transform={`rotate(30,108,${y})`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i + 0.05 }}
                  />
                </g>
              ))}
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {PROCESS.map((step, i) => (
              <ProcessStep key={step.step} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Workshops ── */}
      <section id="workshops" style={{ padding: "80px 0", background: C.brown }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.amber, textTransform: "uppercase", marginBottom: 16 }}>Ateliers</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, lineHeight: 1.1, color: C.bg, fontFamily: "'Playfair Display', serif" }}>
                <TextReveal text="Apprenez à faire" />
                <TextReveal text="votre pain." delay={0.15} style={{ fontStyle: "italic", color: C.amber }} />
              </h2>
            </div>
            <MagneticButton style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.bg, background: C.amber, padding: "12px 28px", borderRadius: 3, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
              Tous les Ateliers
            </MagneticButton>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {WORKSHOPS.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ padding: "28px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 6, cursor: "pointer" }}
                whileHover={{ background: "rgba(255,255,255,0.10)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <span style={{ fontFamily: "'Cabin', sans-serif", fontSize: 11, color: C.amber, letterSpacing: "0.1em", textTransform: "uppercase", background: `${C.amber}20`, padding: "3px 10px", borderRadius: 2 }}>
                    {w.spots} places
                  </span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: C.bgWarm }}>€{w.price}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: C.bg, marginBottom: 8, lineHeight: 1.3 }}>{w.name}</h3>
                <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: "rgba(250,246,239,0.55)", marginBottom: 20 }}>{w.date}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: "rgba(250,246,239,0.45)" }}>3h · Matériaux inclus</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="1.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hours & Location ── */}
      <section style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 20 }}>Horaires</p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, lineHeight: 1.1, color: C.brown, fontFamily: "'Playfair Display', serif", marginBottom: 36 }}>
              <TextReveal text="On vous attend" />
              <TextReveal text="dès l'aube." delay={0.15} style={{ fontStyle: "italic" }} />
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { days: "Mardi – Vendredi", hours: "07:00 – 19:30" },
                { days: "Samedi", hours: "06:30 – 19:30" },
                { days: "Dimanche", hours: "07:00 – 13:00" },
                { days: "Lundi", hours: "Fermé" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.brown }}>{item.days}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: item.hours === "Fermé" ? C.muted : C.terracotta, fontStyle: "italic" }}>{item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 20 }}>Adresse</p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, lineHeight: 1.1, color: C.brown, fontFamily: "'Playfair Display', serif", marginBottom: 36 }}>
              <TextReveal text="Croix-Rousse," />
              <TextReveal text="Lyon 4e." delay={0.15} style={{ fontStyle: "italic" }} />
            </h2>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, padding: "28px", marginBottom: 20 }}>
              <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 16, color: C.brown, fontWeight: 600, marginBottom: 6 }}>{fd?.businessName ?? "Maison Laval"}</p>
              <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.6 }}>47 Grande Rue de la Croix-Rousse<br />69004 Lyon, France</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <MagneticButton style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.bg, background: C.brown, padding: "12px 24px", borderRadius: 3, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
                Itinéraire
              </MagneticButton>
              <MagneticButton style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.brown, background: "transparent", border: `1px solid ${C.border}`, padding: "12px 24px", borderRadius: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Commander en Ligne
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── Contact Form ── */}
      <ContactSection />

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 40px", background: C.bgWarm }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.brown, fontStyle: "italic" }}>Maison Laval · depuis 1987</p>
          <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.05em" }}>© 2025 — Boulangerie Artisanale</p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="#contact" style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.muted, textDecoration: "none" }}>{c?.ctaText ?? <>
              Mentions légales
            </>}</Link>
            <Link href="#contact" style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.muted, textDecoration: "none" }}>
               Confidentialité
            </Link>
            <Link href="#contact" style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.muted, textDecoration: "none" }}>
               CGU
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
