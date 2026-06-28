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
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
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
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.brown, lineHeight: 1 }}>Maison Laval</p>
            <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 9, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>Boulangerie Artisanale</p>
          </div>
        </div>
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
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

          <h1 style={{ fontSize: "clamp(52px, 9vw, 112px)", fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 40, fontFamily: "'Playfair Display', serif" }}>
            <TextReveal text="Le pain" delay={0.3} style={{ display: "block", color: C.brown }} />
            <TextReveal text="comme" delay={0.5} style={{ display: "block", fontStyle: "italic", color: C.terracotta }} />
            <TextReveal text="il se doit." delay={0.7} style={{ display: "block", color: C.brown }} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Cabin', sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 48px", fontWeight: 400 }}
          >
            Boulangerie artisanale à Lyon depuis 1987. Pains au levain, viennoiseries feuilletées, et ateliers de boulangerie. Tout est fait à la main, dans le respect du temps.
          </motion.p>

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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.35em", color: C.terracotta, textTransform: "uppercase", marginBottom: 20 }}>Notre Méthode</p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.brown, fontFamily: "'Playfair Display', serif", marginBottom: 40 }}>
              <TextReveal text="Chaque étape," />
              <TextReveal text="faite à la main." delay={0.15} style={{ fontStyle: "italic", color: C.terracotta }} />
            </h2>
            <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 36 }}>
              Il n'y a pas de raccourcis. La boulangerie artisanale prend du temps — c'est sa force. Chaque pain que vous achetez est le résultat de 36 à 48 heures de travail.
            </p>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
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
              <p style={{ fontFamily: "'Cabin', sans-serif", fontSize: 16, color: C.brown, fontWeight: 600, marginBottom: 6 }}>Maison Laval</p>
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
            <Link href="#contact" style={{ fontFamily: "'Cabin', sans-serif", fontSize: 12, color: C.muted, textDecoration: "none" }}>
              Mentions légales
            </Link>
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
