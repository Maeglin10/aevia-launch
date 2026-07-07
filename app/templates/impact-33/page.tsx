"use client";
// @ts-nocheck

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Heart,
  Award,
  Users,
  Leaf,
  CheckCircle,
  ShoppingBag,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { TemplateIcon } from '@/components/TemplateIcon';

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#fdf8f0",
  bgLight: "#f5e6c8",
  bgSection: "#fdf3e3",
  text: "#5c3317",
  textMuted: "#8c6440",
  accent: brand ?? '#d4832a',
  accentDark: "#b86e1e",
  accentLight: "#fdedc8",
  brown: "#5c3317",
  brownLight: "#8c6440",
  cream: "#f5e6c8",
  white: "#FFFFFF",
  border: "#e8d5b0",
  shadow: "0 4px 24px rgba(92,51,23,0.09)",
  shadowLg: "0 12px 48px rgba(92,51,23,0.15)",
};

const FONT_HEADING = "'Playfair Display', Georgia, serif";
const FONT_BODY = "'Source Sans Pro', system-ui, sans-serif";

// ─── Marquee Products ──────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    { emoji: "🥐", name: "Croissant pur beurre" },
    { emoji: "🍞", name: "Pain de campagne" },
    { emoji: "🥖", name: "Baguette tradition" },
    { emoji: "🧁", name: "Madeleine au miel" },
    { emoji: "🎂", name: "Tarte aux fraises" },
    { emoji: "🥨", name: "Bretzel artisanal" },
    { emoji: "🍰", name: "Mille-feuille" },
    { emoji: "🫓", name: "Fougasse aux olives" },
    { emoji: "🍩", name: "Kouign-amann" },
    { emoji: "🥧", name: "Éclair au chocolat" },
  ];

  const doubled = [...items, ...items];

  return (
    <div style={{ overflow: "hidden", width: "100%", padding: "20px 0" }}>
      <motion.div
        style={{ display: "flex", gap: 20, width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              background: C.white,
              borderRadius: 14,
              padding: "14px 22px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <TemplateIcon emoji={item.emoji} size={22} />
            <span style={{ fontFamily: FONT_HEADING, fontSize: 15, color: C.text, fontWeight: 600 }}>
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Accueil", "Menu", "Notre histoire", "Boutique", "Contact"];

  return (
    <>
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 48px", height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(253,248,240,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.3s ease", fontFamily: FONT_BODY,
        }}
      >
        <motion.div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} whileHover={{ scale: 1.03 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? 'logo'} style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
          ) : (
            <>
              <div style={{ width: 40, height: 40, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TemplateIcon emoji="🥖" size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 20, color: C.text, lineHeight: 1 }}>{fd?.businessName ?? "La Fournée"}</div>
                <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>Artisan Boulanger</div>
              </div>
            </>
          )}
        </motion.div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((link) => (
            <motion.a key={link} href="/templates/impact-33" style={{ color: C.text, fontWeight: 400, fontSize: 16, textDecoration: "none", fontFamily: FONT_BODY }} whileHover={{ color: C.accent }} transition={{ duration: 0.15 }}>
              {link}
            </motion.a>
          ))}
          <motion.button
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 7 }}
            whileHover={{ background: C.accentDark, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <ShoppingBag size={16} />
            Commander
          </motion.button>
        </div>

        <motion.button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.text }} whileTap={{ scale: 0.9 }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: C.bg, padding: "24px 48px", borderBottom: `1px solid ${C.border}`, boxShadow: C.shadow, fontFamily: FONT_BODY }}
          >
            {links.map((link) => (
              <a key={link} href="/templates/impact-33" style={{ display: "block", padding: "12px 0", color: C.text, textDecoration: "none", borderBottom: `1px solid ${C.border}` }}>{link}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        fontFamily: FONT_BODY,
      }}
    >
      {/* Background warm gradient */}
      <motion.div
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgLight} 50%, ${C.cream} 100%)`,
          scale: bgScale,
        }}
      />

      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 70%)`, opacity: 0.6, zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${C.cream} 0%, transparent 70%)`, zIndex: 0 }} />

      {/* Large decorative emoji */}
      <motion.div
        style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", opacity: 0.12, zIndex: 0, userSelect: "none" }}
        animate={{ rotate: [0, 3, 0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <TemplateIcon emoji="🥖" size={180} />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ position: "relative", zIndex: 1, padding: "120px 80px 80px", maxWidth: 760, y: textY, opacity: textOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.accentLight, border: `1px solid ${C.accent}`, borderRadius: 20, padding: "7px 16px", marginBottom: 28 }}
        >
          <Leaf size={14} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>Artisan boulanger depuis 1987 · Paris 11e</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          style={{ fontFamily: FONT_HEADING, fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 700, color: C.text, lineHeight: 1.08, letterSpacing: -1.5, marginBottom: 24 }}
        >
          Le pain, l'art,{" "}
          <em style={{ color: C.accent, fontStyle: "italic" }}>la tradition</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
          style={{ fontSize: 19, color: C.textMuted, lineHeight: 1.76, marginBottom: 40, maxWidth: 560 }}
        >
          La Fournée, c'est l'amour du pain au levain, des viennoiseries pur beurre et des pâtisseries
          de saison. Tout est fait maison chaque jour dès 4h du matin dans notre fournil ouvert sur la rue.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.32 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}
        >
          <motion.button
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "16px 34px", fontWeight: 700, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY }}
            whileHover={{ background: C.accentDark, scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <ShoppingBag size={19} /> Commander en ligne
          </motion.button>
          <motion.button
            style={{ background: "transparent", color: C.text, border: `2px solid ${C.border}`, borderRadius: 10, padding: "14px 28px", fontWeight: 600, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY }}
            whileHover={{ borderColor: C.accent, color: C.accent }}
            whileTap={{ scale: 0.97 }}
          >
            Notre carte <ChevronRight size={18} />
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", gap: 36 }}>
          {[{ value: "37 ans", label: "De savoir-faire" }, { value: "4.9★", label: "Google Avis" }, { value: "100%", label: "Fait maison" }].map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 24, color: C.accent }}>{s.value}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Marquee Section ──────────────────────────────────────────────────────────
function MarqueeSection() {
  return (
    <section style={{ padding: "48px 0", background: C.bgSection, overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 28, fontFamily: FONT_HEADING, fontSize: 16, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>
        Nos créations du moment
      </div>
      <Marquee />
    </section>
  );
}

// ─── Menu Categories ──────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: "Pains & Miches",
    emoji: "🍞",
    items: [
      { name: "Pain de campagne", desc: "Levain naturel, croûte croustillante, mie alvéolée", price: "5,50 €" },
      { name: "Baguette Tradition", desc: "Farine de blé T65, façonnée à la main", price: "1,40 €" },
      { name: "Pain aux noix", desc: "Mie dense, noix françaises, levain de seigle", price: "4,80 €" },
      { name: "Épi de froment", desc: "Classique festif, idéal pour le partage", price: "2,20 €" },
    ],
  },
  {
    name: "Viennoiseries",
    emoji: "🥐",
    items: [
      { name: "Croissant pur beurre", desc: "Feuilletage 27 couches, beurre AOP Poitou-Charentes", price: "1,80 €" },
      { name: "Pain au chocolat", desc: "Deux barres Valrhona, pâte feuilletée maison", price: "2,10 €" },
      { name: "Kouign-amann", desc: "Spécialité bretonne, caramélisé minute", price: "3,20 €" },
      { name: "Brioche tressée", desc: "Pur beurre, sucre perlé, vanille Bourbon", price: "5,90 €" },
    ],
  },
  {
    name: "Pâtisseries",
    emoji: "🎂",
    items: [
      { name: "Tarte aux fraises", desc: "Fraises Gariguette, crème pâtissière vanille", price: "4,50 €" },
      { name: "Éclair café", desc: "Ganache café, glaçage satiné, crème légère", price: "3,80 €" },
      { name: "Mille-feuille", desc: "Feuilletage caramélisé, crème diplomate vanille", price: "4,20 €" },
      { name: "Opéra maison", desc: "Biscuit joconde, ganache café, praliné", price: "5,00 €" },
    ],
  },
];

function MenuSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="menu" ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Notre carte
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Fait avec amour, chaque matin
        </h2>
      </motion.div>

      {/* Category tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
        style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 44 }}
      >
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.name}
            onClick={() => setActiveCategory(i)}
            style={{
              background: activeCategory === i ? C.accent : C.white,
              color: activeCategory === i ? C.white : C.text,
              border: `1.5px solid ${activeCategory === i ? C.accent : C.border}`,
              borderRadius: 25, padding: "10px 22px",
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <TemplateIcon emoji={cat.emoji} size={18} />
            {cat.name}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}
        >
          {CATEGORIES[activeCategory].items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: C.shadowLg }}
              style={{ background: C.bgSection, borderRadius: 16, padding: "24px 26px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
            >
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>{item.name}</h3>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
              <div style={{ fontWeight: 700, color: C.accent, fontSize: 18, fontFamily: FONT_HEADING }}>{item.price}</div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

// ─── Our Story ────────────────────────────────────────────────────────────────
function Story() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
          <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 24, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Notre histoire
          </div>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 700, color: C.text, lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 24 }}>
            Une boulangerie de quartier, <em style={{ color: C.accent }}>depuis 1987</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 20 }}>
            La Fournée est née de la passion de Marcel Girard pour le pain au levain naturel. À l'époque où les industriels envahissaient les boulangeries, Marcel choisissait l'artisanat, la lenteur et le respect des céréales.
          </p>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 32 }}>
            Aujourd'hui, sa fille Camille perpétue cet héritage avec la même exigence : farines Label Rouge, beurre AOP, levain vivant nourri depuis 20 ans. Chaque baguette est façonnée à la main, chaque croissant feuilleté à la main.
          </p>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { icon: <Leaf size={18} color="#d4832a" />, text: "Farines Bio Label Rouge" },
              { icon: <Heart size={18} color="#d4832a" />, text: "Beurre AOP Poitou" },
              { icon: <Award size={18} color="#d4832a" />, text: "Meilleur artisan 2023" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, lineHeight: 1.3 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {["🥐", "🍞", "🎂", "🥖"].map((emoji, i) => (
            <motion.div
              key={i}
              style={{
                background: C.cream,
                borderRadius: 20,
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${C.border}`,
              }}
              whileHover={{ scale: 1.05, y: -4 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              <TemplateIcon emoji={emoji} size={60} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const stats = [
    { value: "37 ans", label: "De savoir-faire artisanal", emoji: "🏆" },
    { value: "4.9★", label: "Note Google Maps", emoji: "⭐" },
    { value: "300+", label: "Commandes par jour", emoji: "🥖" },
    { value: "20 ans", label: "Notre levain naturel", emoji: "🌾" },
  ];

  return (
    <section
      ref={ref}
      style={{ padding: "90px 80px", background: C.text, fontFamily: FONT_BODY }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, maxWidth: 960, margin: "0 auto" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ marginBottom: 12 }}><TemplateIcon emoji={s.emoji} size={36} /></div>
            <div style={{ fontFamily: FONT_HEADING, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, color: C.white, marginBottom: 8 }}>{s.value}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Products Showcase ────────────────────────────────────────────────────────
function ProductsShowcase() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const products = [
    { name: "Box Week-end Découverte", desc: "Baguette tradition + 4 viennoiseries + une pâtisserie du jour. Idéale pour un brunch en famille.", price: "18,90 €", badge: "Best-seller", emoji: "🧺" },
    { name: "Abonnement Pain Hebdo", desc: "Recevez votre pain de campagne ou baguette tradition 5j/7 directement en boutique. -10 % de remise.", price: "28 € / mois", badge: "Économique", emoji: "📅" },
    { name: "Plateau Pâtisseries Prestige", desc: "Sélection de 8 pâtisseries de saison pour vos événements ou cadeaux gourmands.", price: "38,00 €", badge: "Cadeau", emoji: "🎁" },
    { name: "Kit Boulangerie Maison", desc: "Levain vivant, farine Label Rouge et guide personnalisé pour faire votre premier pain.", price: "24,90 €", badge: "Atelier", emoji: "🫙" },
  ];

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          À emporter
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Nos offres spéciales
        </h2>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
        {products.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.bgSection, borderRadius: 20, padding: 28, border: `1px solid ${C.border}`, boxShadow: C.shadow, position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", top: 16, right: 16, background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{p.badge}</div>
            <div style={{ marginBottom: 18 }}><TemplateIcon emoji={p.emoji} size={44} /></div>
            <h3 style={{ fontFamily: FONT_HEADING, fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 10 }}>{p.name}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 20 }}>{p.desc}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: C.accent, fontSize: 20 }}>{p.price}</span>
              <motion.button
                style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT_BODY }}
                whileHover={{ background: C.accentDark, scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Commander
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Isabelle T.", text: "La meilleure baguette tradition de Paris, sans hésitation. Le croissant est à se damner — feuilleté, aérien, pur beurre. J'y vais chaque samedi matin depuis 8 ans.", stars: 5 },
  { name: "Grégoire M.", text: "L'abonnement hebdomadaire est une révélation. Du pain frais sans y penser, livré directement en boutique avant mon passage. Qualité constante, équipe adorable.", stars: 5 },
  { name: "Sakina B.", text: "J'ai commandé le plateau prestige pour l'anniversaire de ma mère — succès total. Chaque pâtisserie était un chef-d'œuvre de saveurs. Merci Camille !", stars: 5 },
];

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Avis clients
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Ils nous font confiance
        </h2>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ background: C.white, borderRadius: 18, padding: 28, border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              {Array.from({ length: t.stars }).map((_, k) => (<Star key={k} size={14} color={C.accent} fill={C.accent} />))}
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.72, marginBottom: 20, fontStyle: "italic", fontFamily: FONT_HEADING }}>"{t.text}"</p>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.accent }}>— {t.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Horaires & Contact ────────────────────────────────────────────────────────
function HorairesContact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const horaires = [
    { day: "Mardi – Vendredi", time: "07h00 – 20h00" },
    { day: "Samedi", time: "07h00 – 19h30" },
    { day: "Dimanche", time: "07h00 – 13h30" },
    { day: "Lundi", time: "Fermé" },
  ];

  return (
    <section ref={ref} id="contact" style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, maxWidth: 1000, margin: "0 auto" }}>
        {/* Horaires */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
          <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 24, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Horaires
          </div>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 32, letterSpacing: -0.3 }}>
            Quand nous rendre visite
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {horaires.map((h) => (
              <div
                key={h.day}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", borderRadius: 12,
                  background: h.time === "Fermé" ? C.bgSection : C.white,
                  border: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontWeight: 600, color: h.time === "Fermé" ? C.textMuted : C.text }}>{h.day}</span>
                <span style={{ fontWeight: 700, color: h.time === "Fermé" ? C.textMuted : C.accent }}>{h.time}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: "14px 20px", background: C.accentLight, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.5 }}>
              En été (juillet–août) et jours fériés, horaires réduits. Consultez notre Camera pour les fermetures exceptionnelles.
            </span>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }}>
          <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 24, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Nous trouver
          </div>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 32, letterSpacing: -0.3 }}>
            Adresse & contact
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { icon: <MapPin size={20} color={C.accent} />, title: "Adresse", text: "42 Rue de la Roquette, 75011 Paris" },
              { icon: <Phone size={20} color={C.accent} />, title: "Téléphone", text: "01 43 55 67 89" },
              { icon: <Mail size={20} color={C.accent} />, title: "Email", text: "bonjour@lafournee.paris" },
              { icon: <ShoppingBag size={20} color={C.accent} />, title: "Commande", text: "Disponible en ligne 24h/24" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: C.textMuted, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontWeight: 600, color: C.text }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
          <motion.button
            style={{ marginTop: 32, width: "100%", background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "15px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: FONT_BODY }}
            whileHover={{ background: C.accentDark, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Commander en ligne
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Proposez-vous la livraison à domicile ?", a: "Oui, nous livrons dans un rayon de 3 km autour de la boutique du mardi au samedi, de 8h à 12h. Commandez en ligne avant 20h la veille. Livraison offerte à partir de 25 € d'achat." },
  { q: "Puis-je commander des pâtisseries personnalisées ?", a: "Absolument ! Camille réalise des gâteaux sur commande pour vos anniversaires, mariages et événements professionnels. Délai minimum : 5 jours ouvrés. Contactez-nous pour un devis gratuit." },
  { q: "Utilisez-vous des farines biologiques ?", a: "Nous utilisons principalement des farines Label Rouge provenant de moulins français. Notre farine de tradition T65 vient du Moulin Decollogne en Bourgogne. Certains pains spéciaux sont en agriculture biologique certifiée." },
  { q: "Avez-vous des produits sans gluten ou végans ?", a: "Nous proposons quelques références véganes (pain aux céréales, brioche végane). Pour le sans gluten, nos équipements partagés ne permettent pas de garantir l'absence totale de contamination croisée." },
  { q: "Comment fonctionne l'abonnement pain hebdomadaire ?", a: "Vous choisissez votre pain favori (baguette tradition ou pain de campagne), votre fréquence (5j/7 ou 3j/7) et un créneau de récupération. Facturation mensuelle, résiliable à tout moment. -10 % garanti." },
];

function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          FAQ
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Vos questions, nos réponses
        </h2>
      </motion.div>

      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{ background: C.white, borderRadius: 14, border: `1px solid ${open === i ? C.accent : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", fontFamily: FONT_BODY }}
            >
              <span style={{ fontWeight: 600, fontSize: 16, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
                <ChevronDown size={20} color={open === i ? C.accent : C.textMuted} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: C.textMuted, lineHeight: 1.72 }}>{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.brown, color: C.white, padding: "70px 80px 32px", fontFamily: FONT_BODY }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 52 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><TemplateIcon emoji="🥖" size={20} color="#fff" /></div>
            <div>
              <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 20 }}>{fd?.businessName ?? "La Fournée"}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 1.5, textTransform: "uppercase" }}>Artisan Boulanger</div>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
            Boulangerie artisanale au levain naturel depuis 1987. Chaque jour, nous pétrissons, façonnons et cuisons avec passion pour votre quartier.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { icon: <MapPin size={15} />, text: "42 Rue de la Roquette, 75011 Paris" },
              { icon: <Phone size={15} />, text: "01 43 55 67 89" },
              { icon: <Clock size={15} />, text: "Mar–Ven 7h–20h | Sam 7h–19h30 | Dim 7h–13h30" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
        {[
          { title: "Notre carte", links: ["Pains & Miches", "Viennoiseries", "Pâtisseries", "Café & Boissons"] },
          { title: "Services", links: ["Commande en ligne", "Abonnements", "Commandes spéciales", "Livraison"] },
          { title: "La boulangerie", links: ["Notre histoire", "Camille Girard", "Nos engagements", "Actualités"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase", letterSpacing: 0.8 }}>{col.title}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((link) => (<a key={link} href="/templates/impact-33" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none" }}>{link}</a>))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14 }}>© 2025 La Fournée · Artisan Boulanger Paris. Tous droits réservés.</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Mentions légales", "Confidentialité", "CGV"].map((link) => (<a key={link} href="/templates/impact-33" style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none" }}>{link}</a>))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
export default function Impact33() {
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
    <main style={{ background: C.bg, overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <MarqueeSection />
<MenuSection />
      <Story />
      <Stats />
      <ProductsShowcase />
      <Testimonials />
      <HorairesContact />
      <FAQ />
      <Footer />
    </main>
  );
}
