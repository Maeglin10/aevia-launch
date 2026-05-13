"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";

const C = {
  bg: "#FAF7F2",
  bgWarm: "#F5EFE4",
  bgDark: "#1C1810",
  text: "#1C1810",
  textLight: "#FAF7F2",
  textMuted: "#7A6E60",
  textDim: "#B8AD9E",
  border: "#E8E0D0",
  borderWarm: "#D4C8B0",
  sand: "#C8A87A",
  sandLight: "#E8D5A8",
  sandDark: "#8A6840",
  sage: "#7A8A70",
  rose: "#C8907A",
};

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap');
`;

const RITUALS = [
  {
    id: "hammam",
    name: "Hammam Doré",
    duration: "90 min",
    price: "€ 195",
    desc: "Bain de vapeur aux huiles de rose centifolia. Gommage au savon noir et kessa. Enveloppement au ghassoul minéral. Massage aux pierres chaudes.",
    category: "Corps",
    intensity: "Profond",
  },
  {
    id: "ceremony",
    name: "Cérémonie de l'Eau",
    duration: "120 min",
    price: "€ 280",
    desc: "Parcours aquatique privatif. Bains de fleurs. Soins visage à la rose musquée. Massage Kobido japonais. Thé aux herbes et miel de manuka.",
    category: "Signature",
    intensity: "Sensoriel",
  },
  {
    id: "gold",
    name: "Fusion Or 24K",
    duration: "75 min",
    price: "€ 340",
    desc: "Sérum à l'or colloïdal 24 carats. Masque liftant aux peptides. Modelage du visage Kobido. Luminosité et fermeté immédiates.",
    category: "Visage",
    intensity: "Anti-âge",
  },
  {
    id: "body",
    name: "Rituel Nuit du Désert",
    duration: "60 min",
    price: "€ 165",
    desc: "Huile de soin à l'argan pur pressé à froid. Massage aux bougies fondantes parfumées. Enveloppement à la boue du Sahara.",
    category: "Corps",
    intensity: "Régénérant",
  },
];

const SPACES = [
  { name: "Hammam Privé", capacity: "1-2 pers.", available: "6 cabines" },
  { name: "Piscine Intérieure", capacity: "Jusqu'à 8", available: "Sur réservation" },
  { name: "Salon de Thé", capacity: "12 pers.", available: "Ouvert 10h-20h" },
  { name: "Terrasse Jardin", capacity: "Accès libre", available: "Membres uniquement" },
];

const PACKAGES = [
  {
    name: "Découverte",
    price: "€ 195",
    period: "journée",
    features: ["1 soin au choix", "Accès hammam", "Thé & collation", "Espace détente"],
    highlight: false,
  },
  {
    name: "Immersion",
    price: "€ 580",
    period: "journée privatisée",
    features: ["2 soins signature", "Hammam privé 2h", "Déjeuner végétalien", "Produits offerts", "Transport aller-retour Paris"],
    highlight: true,
  },
  {
    name: "Abonnement",
    price: "€ 390",
    period: "/ mois",
    features: ["4 visites / mois", "Accès illimité piscine", "10% sur les soins", "Invités à tarif membre"],
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    text: "Aura Wellness est le seul endroit à Paris où je ressors véritablement régénérée. La Cérémonie de l'Eau est transcendante.",
    author: "Charlotte M.",
    role: "Membre depuis 3 ans",
  },
  {
    text: "Le soin Or 24K a transformé l'éclat de ma peau. Je l'offre à chaque anniversaire à celles qui me sont chères.",
    author: "Isabelle R.",
    role: "Directrice artistique",
  },
  {
    text: "Un havre de paix en plein cœur de Paris. L'équipe d'Aura comprend le luxe véritable : l'absence de bruit.",
    author: "Sophie V.",
    role: "Membre fondatrice",
  },
];

// ── Ripple animation (signature element) ─────────────────────────────────────
function WaterRipple() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            border: `1px solid ${C.sand}`,
            width: `${i * 120}px`,
            height: `${i * 120}px`,
            opacity: 0,
          }}
          animate={{
            scale: [1, 1.8],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Center lotus */}
      <svg viewBox="0 0 80 80" style={{ width: "80px", height: "80px", opacity: 0.7 }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.ellipse
            key={i}
            cx={40 + 14 * Math.cos((angle * Math.PI) / 180)}
            cy={40 + 14 * Math.sin((angle * Math.PI) / 180)}
            rx="10"
            ry="18"
            fill="none"
            stroke={C.sand}
            strokeWidth="0.8"
            transform={`rotate(${angle + 90} ${40 + 14 * Math.cos((angle * Math.PI) / 180)} ${40 + 14 * Math.sin((angle * Math.PI) / 180)})`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        ))}
        <circle cx="40" cy="40" r="6" fill={C.sand} opacity="0.4" />
      </svg>
    </div>
  );
}

// ── Ritual card ──────────────────────────────────────────────────────────────
function RitualCard({ ritual, i }: { ritual: typeof RITUALS[0]; i: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => setOpen(!open)}
      style={{
        background: open ? C.bgDark : C.bgWarm,
        border: `1px solid ${open ? "transparent" : C.border}`,
        padding: "2.5rem",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.5s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: open ? C.sand : C.textDim, marginBottom: "0.5rem" }}>
            {ritual.category} · {ritual.intensity}
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 400, color: open ? C.textLight : C.text }}>
            {ritual.name}
          </h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300, color: open ? C.sandLight : C.sand }}>
            {ritual.price}
          </div>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: open ? C.textDim : C.textMuted }}>
            {ritual.duration}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ height: "1px", background: C.sandDark, margin: "1rem 0", opacity: 0.3 }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: C.textDim, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ritual.desc}
            </p>
            <motion.button
              whileHover={{ backgroundColor: C.sandLight, color: C.bgDark }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: C.sand,
                color: C.bgDark,
                border: "none",
                padding: "0.7rem 1.75rem",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              RÉSERVER CE SOIN
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plus/minus icon */}
      <motion.div
        style={{ position: "absolute", bottom: "1.5rem", right: "2rem", width: "20px", height: "20px", position: "absolute" }}
        animate={{ rotate: open ? 45 : 0 }}
      >
        <svg viewBox="0 0 20 20" style={{ width: "20px", height: "20px" }}>
          <line x1="10" y1="2" x2="10" y2="18" stroke={open ? C.sand : C.textDim} strokeWidth="1" />
          <line x1="2" y1="10" x2="18" y2="10" stroke={open ? C.sand : C.textDim} strokeWidth="1" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AuraWellness() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [bookingStep, setBookingStep] = useState<"idle" | "date" | "confirm">("idle");

  const { scrollYProgress } = useScroll({ target: containerRef });
  const navBg = useTransform(scrollYProgress, [0, 0.06], ["rgba(250,247,242,0)", "rgba(250,247,242,0.95)"]);
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 80]);

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'Jost', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 2.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Soins & Rituels", "Espaces", "Membership"].map((item) => (
            <motion.a key={item} href="#" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: C.textMuted, textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.text }}>
              {item}
            </motion.a>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, letterSpacing: "0.2em", color: C.text }}>
            AURA
          </div>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.5rem", letterSpacing: "0.35em", color: C.textDim }}>
            WELLNESS · PARIS
          </div>
        </div>

        <div style={{ display: "flex", gap: "2.5rem", justifyContent: "flex-end", alignItems: "center" }}>
          {["Le Spa", "Gift Cards"].map((item) => (
            <motion.a key={item} href="#" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: C.textMuted, textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.text }}>
              {item}
            </motion.a>
          ))}
          <motion.button
            whileHover={{ backgroundColor: C.sandDark }}
            style={{
              background: C.sand,
              color: C.bgDark,
              border: "none",
              padding: "0.5rem 1.25rem",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            RÉSERVER
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ height: "100vh", background: C.bgDark, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Ripple signature element */}
        <WaterRipple />

        {/* Texture overlay */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(200,168,122,0.08) 0%, transparent 70%)" }} />

        <motion.div style={{ y: heroY, textAlign: "center", position: "relative", zIndex: 1, padding: "0 2rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.4em", color: C.sand, marginBottom: "2rem" }}
          >
            LE SANCTUAIRE DE PARIS
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3.5rem, 9vw, 8rem)",
              fontWeight: 300,
              color: C.textLight,
              lineHeight: 0.9,
              letterSpacing: "0.05em",
              marginBottom: "2rem",
            }}
          >
            Le Temps<br />
            <em style={{ color: C.sand, fontStyle: "italic" }}>Suspendu</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontStyle: "italic", color: C.textDim, lineHeight: 1.8, maxWidth: "50ch", margin: "0 auto 3rem" }}
          >
            Un espace hors du monde, dédié à la régénération profonde du corps et de l'esprit. Rituels ancestraux, soins d'exception, silence absolu.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: C.sandLight }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: C.sand,
                color: C.bgDark,
                border: "none",
                padding: "0.9rem 2.5rem",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              DÉCOUVRIR LES RITUELS
            </motion.button>
            <motion.button
              whileHover={{ borderColor: C.sand, color: C.sand }}
              style={{
                background: "transparent",
                color: C.textDim,
                border: `1px solid rgba(200,168,122,0.3)`,
                padding: "0.9rem 2.5rem",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              OFFRIR UN SOIN
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Bottom scroll line */}
        <motion.div
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: "2rem", left: "50%", width: "1px", height: "3rem", background: `linear-gradient(180deg, transparent, ${C.sand})` }}
        />
      </section>

      {/* ── Opening quote ──────────────────────────────────────────────── */}
      <section style={{ padding: "6rem clamp(2rem, 6vw, 8rem)", background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: C.sandLight, lineHeight: 1, marginBottom: "1.5rem" }}>"</div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.3rem, 2.5vw, 2rem)", fontStyle: "italic", fontWeight: 300, color: C.text, lineHeight: 1.6 }}>
            Le luxe véritable, c'est le temps qu'on vous rend.
          </p>
          <div style={{ width: "40px", height: "1px", background: C.sand, margin: "1.5rem auto 1rem" }} />
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", color: C.textMuted }}>
            FONDATRICE, AURA WELLNESS
          </div>
        </div>
      </section>

      {/* ── Rituals ────────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem clamp(2rem, 5vw, 5rem)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
            <div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: C.textDim, marginBottom: "0.75rem" }}>
                NOS SOINS
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text }}>
                Rituels d'Exception
              </h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: C.textMuted, maxWidth: "35ch", lineHeight: 1.65, textAlign: "right" }}>
              Chaque rituel est une expérience sensorielle complète. Cliquez pour découvrir les détails et réserver.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {RITUALS.map((r, i) => <RitualCard key={r.id} ritual={r} i={i} />)}
          </div>
        </div>
      </section>

      {/* ── Spaces ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem clamp(2rem, 5vw, 5rem)", background: C.bgDark }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: C.sand, marginBottom: "0.75rem" }}>
              LE SPA
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.textLight }}>
              Nos Espaces
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "#2A2820" }}>
            {SPACES.map((space, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={space.name}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{ background: C.bgDark, padding: "2.5rem 2rem" }}
                >
                  <div style={{ width: "2rem", height: "1px", background: C.sandDark, marginBottom: "1.5rem" }} />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 400, color: C.textLight, marginBottom: "0.75rem" }}>
                    {space.name}
                  </h3>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", color: C.sand, marginBottom: "0.4rem" }}>
                    {space.capacity}
                  </div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", color: C.textDim }}>
                    {space.available}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Packages ───────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem clamp(2rem, 5vw, 5rem)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: C.textDim, marginBottom: "0.75rem" }}>
              OFFRES
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text }}>
              Votre Formule
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: C.border }}>
            {PACKAGES.map((pkg, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              const active = selectedPackage === i;
              return (
                <motion.div
                  key={pkg.name}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  onClick={() => setSelectedPackage(i)}
                  style={{
                    background: active ? C.bgDark : C.bg,
                    padding: "3rem 2.5rem",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.4s",
                  }}
                >
                  {pkg.highlight && (
                    <div style={{ position: "absolute", top: "1rem", right: "1rem", fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.sand, padding: "0.3rem 0.6rem", border: `1px solid ${C.sand}` }}>
                      SIGNATURE
                    </div>
                  )}
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: active ? C.sand : C.textMuted, marginBottom: "0.75rem" }}>
                    {pkg.name}
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300, color: active ? C.textLight : C.text, marginBottom: "0.25rem" }}>
                    {pkg.price}
                  </div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", color: active ? C.textDim : C.textMuted, marginBottom: "2rem" }}>
                    {pkg.period}
                  </div>
                  <div style={{ height: "1px", background: active ? "#2A2820" : C.border, marginBottom: "1.5rem" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {pkg.features.map((f) => (
                      <div key={f} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                        <div style={{ width: "4px", height: "4px", background: C.sand, borderRadius: "50%", marginTop: "0.45em", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: active ? C.textDim : C.textMuted, lineHeight: 1.5 }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => { e.stopPropagation(); setBookingStep("date"); }}
                    style={{
                      width: "100%",
                      marginTop: "2rem",
                      background: active ? C.sand : "transparent",
                      color: active ? C.bgDark : C.textMuted,
                      border: `1px solid ${active ? C.sand : C.border}`,
                      padding: "0.75rem",
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                  >
                    RÉSERVER
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section style={{ padding: "7rem clamp(2rem, 5vw, 5rem)", background: C.bgWarm, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: C.textDim, marginBottom: "0.75rem" }}>
              EXPÉRIENCES
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text }}>
              Ce Que Disent<br />
              <em style={{ color: C.sand }}>Nos Clientes</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: C.border }}>
            {TESTIMONIALS.map((t, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  style={{ background: C.bgWarm, padding: "2.5rem" }}
                >
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: C.sand, lineHeight: 1, marginBottom: "1rem" }}>"</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: C.text, lineHeight: 1.75, marginBottom: "1.5rem" }}>
                    {t.text}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "1.5rem", height: "1px", background: C.sandDark, opacity: 0.4 }} />
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 500, color: C.text }}>{t.author}</div>
                      <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", color: C.textMuted }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Book CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem clamp(2rem, 5vw, 5rem)", background: C.bgDark, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
          <WaterRipple />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "650px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: C.textLight, lineHeight: 0.95, marginBottom: "1.5rem" }}>
            Votre Escapade<br />
            <em style={{ color: C.sand }}>Commence Ici</em>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.05rem", color: C.textDim, lineHeight: 1.75, marginBottom: "2.5rem" }}>
            Le spa est disponible 7j/7, de 9h à 20h. Réservation conseillée 48h à l'avance pour les soins signature.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: C.sandLight }}
              style={{
                background: C.sand,
                color: C.bgDark,
                border: "none",
                padding: "1rem 3rem",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              RÉSERVER UNE EXPÉRIENCE
            </motion.button>
          </div>
          <div style={{ marginTop: "1.5rem", fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: C.textDim }}>
            +33 1 XX XX XX XX · contact@aurawellness.fr
          </div>
          <div style={{ marginTop: "0.5rem", fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#3A3020" }}>
            12 RUE DE LA PAIX · 75001 PARIS
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid #2A2820`, padding: "3rem clamp(2rem, 5vw, 5rem)", background: C.bgDark }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", letterSpacing: "0.2em", color: C.textLight, marginBottom: "0.25rem" }}>
              AURA
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.5rem", letterSpacing: "0.35em", color: "#3A3020", marginBottom: "1.5rem" }}>
              WELLNESS · PARIS
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.9rem", color: "#3A3020", lineHeight: 1.65 }}>
              Le sanctuaire de celles qui savent que le vrai luxe ne se voit pas — il se ressent.
            </p>
          </div>
          {[
            { title: "SOINS", items: ["Rituels corps", "Soins visage", "Massages", "Hammam privatif"] },
            { title: "LE SPA", items: ["Nos espaces", "Membership", "Gift cards", "Presse"] },
            { title: "RÉSERVER", items: ["Réservation en ligne", "Groupes & entreprises", "Mariées", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: "#3A3020", marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a key={item} href="#" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "#4A4030", textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.sand }}>
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1100px", margin: "2.5rem auto 0", paddingTop: "2rem", borderTop: "1px solid #1E1C10", display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: "#2A2820" }}>
            © 2025 AURA WELLNESS. TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Mentions légales", "Confidentialité"].map((item) => (
              <motion.a key={item} href="#" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", color: "#2A2820", textDecoration: "none", cursor: "pointer" }} whileHover={{ color: "#666" }}>
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
