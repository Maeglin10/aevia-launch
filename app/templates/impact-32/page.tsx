"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Calendar,
  Menu,
  X,
  Users,
  Heart,
  Shield,
  Award,
  Stethoscope,
  Syringe,
  ArrowRight,
  Send,
} from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";

// ─── Page Types ────────────────────────────────────────────────────────────────
type VetPage = "home" | "services" | "equipe" | "reservation" | "blog" | "contact" | "mentions" | "privacy";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#fafffe",
  bgLight: "#d8f3dc",
  bgSection: "#f2fbf5",
  text: "#1a3a2a",
  textMuted: "#4a7060",
  accent: "#2d6a4f",
  accentLight: "#d8f3dc",
  accentDark: "#1e4d38",
  sand: "#f4a261",
  sandLight: "#fef3e8",
  white: "#FFFFFF",
  border: "#b7d9c4",
  shadow: "0 4px 24px rgba(45,106,79,0.09)",
  shadowLg: "0 12px 48px rgba(45,106,79,0.16)",
};

const FONT = "'Nunito', system-ui, sans-serif";

// ─── Shared helpers ────────────────────────────────────────────────────────────
function SectionBadge({ label }: { label: string }) {
  return (
    <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase" as const, letterSpacing: 0.8 }}>
      {label}
    </div>
  );
}

// ─── Animated Paw SVG ─────────────────────────────────────────────────────────
function AnimatedPaw() {
  return (
    <motion.div
      style={{ position: "relative", width: 380, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.svg
        viewBox="0 0 200 200" width={230} height={230}
        style={{ position: "relative", zIndex: 1 }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, type: "spring", stiffness: 120, damping: 10 }}
      >
        <motion.ellipse cx="100" cy="130" rx="42" ry="38" fill={C.accent}
          animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="60" cy="82" r="22" fill={C.accent}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.1 }} />
        <motion.circle cx="100" cy="68" r="24" fill={C.accent}
          animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.25 }} />
        <motion.circle cx="140" cy="82" r="22" fill={C.accent}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.15 }} />
        <motion.path
          d="M100 115 C100 115, 86 100, 86 90 C86 84, 91 79, 100 88 C109 79, 114 84, 114 90 C114 100, 100 115, 100 115 Z"
          fill="rgba(255,255,255,0.85)"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        />
      </motion.svg>
      <motion.div
        style={{ position: "absolute", top: 24, right: 8, background: C.sand, color: C.white, borderRadius: 12, padding: "7px 15px", fontSize: 13, fontWeight: 800, fontFamily: FONT, boxShadow: "0 4px 16px rgba(244,162,97,0.4)", zIndex: 2 }}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.5 }}
      >
        Urgences 24h/7j
      </motion.div>
      <motion.div
        style={{ position: "absolute", bottom: 36, left: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "9px 17px", fontSize: 13, fontWeight: 700, fontFamily: FONT, color: C.text, boxShadow: C.shadow, zIndex: 2 }}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.5 }}
      >
        4.8 / 5 — 2 400+ avis
      </motion.div>
    </motion.div>
  );
}

// ─── Pet Species Tabs ──────────────────────────────────────────────────────────
function PetTabs() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const species = [
    { label: "Chiens", emoji: "🐕", services: ["Vaccination annuelle", "Stérilisation", "Bilan santé senior", "Traitement antiparasitaire", "Chirurgie douce", "Dentisterie vétérinaire"] },
    { label: "Chats", emoji: "🐈", services: ["Primo-vaccination", "Identification puce", "Castration / Stérilisation", "Traitement leucose FIV", "Soins dermatologiques", "Gestion diabète félin"] },
    { label: "Exotiques", emoji: "🐇", services: ["Lapins & rongeurs", "Oiseaux & reptiles", "Poissons & tortues", "Examen complet", "Chirurgie spécialisée", "Alimentation conseils"] },
  ];
  return (
    <div ref={ref} style={{ fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
        {species.map((s, i) => (
          <motion.button type="button" key={s.label} onClick={() => setActive(i)}
            style={{ background: active === i ? C.accent : C.white, color: active === i ? C.white : C.text, border: `2px solid ${active === i ? C.accent : C.border}`, borderRadius: 30, padding: "10px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <TemplateIcon emoji={s.emoji} size={18} />{s.label}
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, maxWidth: 800, margin: "0 auto" }}>
          {species[active].services.map((service) => (
            <div key={service} style={{ background: C.white, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, boxShadow: C.shadow }}>
              <CheckCircle size={16} color={C.accent} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{service}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, goTo }: { page: VetPage; goTo: (p: VetPage) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links: { label: string; key: VetPage }[] = [
    { label: "Services", key: "services" },
    { label: "Notre équipe", key: "equipe" },
    { label: "Rendez-vous", key: "reservation" },
    { label: "Blog", key: "blog" },
    { label: "Contact", key: "contact" },
  ];

  return (
    <>
      <motion.nav
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(250,255,254,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", boxShadow: scrolled ? C.shadow : "none", transition: "all 0.3s ease", fontFamily: FONT }}
      >
        <motion.button type="button" onClick={() => goTo("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "none", border: "none" }} whileHover={{ scale: 1.03 }}>
          <div style={{ width: 38, height: 38, background: C.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TemplateIcon emoji="🐾" size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: -0.5 }}>
            Paw<span style={{ color: C.accent }}>Care</span>
          </span>
        </motion.button>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((link) => (
            <motion.button type="button" key={link.key} onClick={() => { goTo(link.key); setMenuOpen(false); }}
              style={{ color: page === link.key ? C.accent : C.text, fontWeight: page === link.key ? 800 : 600, fontSize: 15, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, textDecoration: page === link.key ? "underline" : "none", textUnderlineOffset: 4 }}
              whileHover={{ color: C.accent }} transition={{ duration: 0.15 }}>
              {link.label}
            </motion.button>
          ))}
          <motion.button type="button" onClick={() => goTo("reservation")}
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
            whileHover={{ background: C.accentDark, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Prendre RDV
          </motion.button>
        </div>

        <motion.button type="button" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.text }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: C.bg, padding: "24px 48px", borderBottom: `1px solid ${C.border}`, boxShadow: C.shadow, fontFamily: FONT }}>
            {links.map((link) => (
              <button type="button" key={link.key} onClick={() => { goTo(link.key); setMenuOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", color: C.text, fontWeight: 600, background: "none", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer", fontFamily: FONT, fontSize: 16 }}>
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ goTo }: { goTo: (p: VetPage) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} style={{ minHeight: "100vh", background: `linear-gradient(140deg, ${C.bg} 0%, ${C.accentLight} 100%)`, display: "flex", alignItems: "center", padding: "100px 80px 60px", position: "relative", overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 68%)`, opacity: 0.5, pointerEvents: "none" }} />
      <motion.div style={{ flex: 1, maxWidth: 580, position: "relative", zIndex: 1, y: textY, opacity: textOpacity }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.white, border: `1px solid ${C.accent}`, borderRadius: 20, padding: "7px 16px", marginBottom: 24 }}>
          <Shield size={14} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>Clinique vétérinaire agréée CNOV</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          style={{ fontSize: "clamp(36px, 4vw, 58px)", fontWeight: 800, color: C.text, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 24 }}>
          Vos animaux méritent{" "}<span style={{ color: C.accent }}>le meilleur soin</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{ fontSize: 18, color: C.textMuted, lineHeight: 1.72, marginBottom: 36, maxWidth: 490 }}>
          PawCare Clinic, c'est une équipe de vétérinaires passionnés à Bordeaux, dédiée à la santé et au bonheur de vos compagnons à poils, plumes ou écailles.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
          <motion.button type="button" onClick={() => goTo("reservation")}
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "16px 32px", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}
            whileHover={{ background: C.accentDark, scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Calendar size={18} /> Prendre rendez-vous
          </motion.button>
          <motion.button type="button" onClick={() => goTo("contact")}
            style={{ background: C.sandLight, color: C.sand, border: `2px solid ${C.sand}`, borderRadius: 10, padding: "14px 24px", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Phone size={16} /> Urgences 24h
          </motion.button>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", gap: 36 }}>
          {[{ value: "3 500+", label: "Animaux soignés" }, { value: "4.8★", label: "Note Google" }, { value: "20 ans", label: "D'expertise" }].map((s) => (
            <div key={s.label}>
              <div style={{ fontWeight: 900, fontSize: 22, color: C.text }}>{s.value}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <AnimatedPaw />
      </motion.div>
    </section>
  );
}

// ─── Home Services Preview ─────────────────────────────────────────────────────
const SERVICES_DATA = [
  { icon: <Stethoscope size={26} color="#2d6a4f" />, title: "Consultations", desc: "Bilan de santé complet, suivi régulier et prévention pour votre animal.", tag: "Essentiel" },
  { icon: <Syringe size={26} color="#2d6a4f" />, title: "Vaccinations", desc: "Protocoles vaccinaux adaptés à chaque espèce et mode de vie.", tag: "Prévention" },
  { icon: <Shield size={26} color="#2d6a4f" />, title: "Chirurgie", desc: "Chirurgie douce avec anesthésie sécurisée et monitoring cardiaque.", tag: "Spécialisé" },
  { icon: <Heart size={26} color="#2d6a4f" />, title: "Cardiologie", desc: "Échographie cardiaque et suivi des pathologies cardiovasculaires.", tag: "Expert" },
  { icon: <Award size={26} color="#2d6a4f" />, title: "Dermatologie", desc: "Diagnostic et traitement des affections cutanées chroniques.", tag: "Spécialisé" },
  { icon: <Users size={26} color="#2d6a4f" />, title: "Urgences 24h/7j", desc: "Équipe d'astreinte pour les urgences vitales, 24h/24, 7j/7.", tag: "Urgent", urgent: true },
];

function HomeServices({ goTo }: { goTo: (p: VetPage) => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="Nos services" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>Des soins adaptés à chaque animal</h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto" }}>Technologies de pointe, équipe bienveillante — pour que votre compagnon soit entre les meilleures mains.</p>
      </motion.div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto 48px" }}>
        {SERVICES_DATA.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 44 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: (s as any).urgent ? C.text : C.white, borderRadius: 18, padding: "28px 26px", border: `1px solid ${(s as any).urgent ? C.text : C.border}`, boxShadow: C.shadow, position: "relative" }}>
            <div style={{ position: "absolute", top: 16, right: 16, background: (s as any).urgent ? C.sand : C.accentLight, color: (s as any).urgent ? C.white : C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{s.tag}</div>
            <div style={{ width: 52, height: 52, background: (s as any).urgent ? "rgba(255,255,255,0.12)" : C.accentLight, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              {(s as any).urgent ? <Heart size={26} color="#fff" /> : s.icon}
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: (s as any).urgent ? C.white : C.text, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: (s as any).urgent ? "rgba(255,255,255,0.7)" : C.textMuted, lineHeight: 1.65 }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <motion.button type="button" onClick={() => goTo("services")}
          style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "14px 32px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 8 }}
          whileHover={{ background: C.accentDark, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Voir tous nos services <ArrowRight size={16} />
        </motion.button>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const stats = [
    { value: "3 500+", label: "Animaux soignés / an", icon: "🐾" },
    { value: "4.8/5", label: "Note Google Maps", icon: "⭐" },
    { value: "20 ans", label: "D'expertise vétérinaire", icon: "🏆" },
    { value: "24h/7j", label: "Service urgences", icon: "🚨" },
  ];
  return (
    <section ref={ref} style={{ padding: "90px 80px", background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDark} 100%)`, fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, maxWidth: 960, margin: "0 auto" }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.82 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 12 }}><TemplateIcon emoji={s.icon} size={36} /></div>
            <div style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 900, color: C.white, letterSpacing: -1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 15 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Team preview (home) ───────────────────────────────────────────────────────
const TEAM_DATA = [
  { name: "Dr. Marie Fontaine", role: "Vétérinaire généraliste", specialty: "Chiens & chats, chirurgie douce", exp: "14 ans", initials: "MF", color: C.accent, photo: "photo-1559839734-2b71ea197ec2" },
  { name: "Dr. Pierre Leroy", role: "Vétérinaire spécialisé", specialty: "Cardiologie & imagerie médicale", exp: "10 ans", initials: "PL", color: "#4a7aa0", photo: "photo-1612349317150-e413f6a5b16d" },
  { name: "Dr. Nadia Sall", role: "Vétérinaire exotiques", specialty: "NAC — oiseaux, reptiles, rongeurs", exp: "8 ans", initials: "NS", color: "#7a5ea0", photo: "photo-1594824476967-48c8b964273f" },
  { name: "Dr. Lucas Martin", role: "Vétérinaire urgentiste", specialty: "Médecine d'urgence & réanimation", exp: "6 ans", initials: "LM", color: "#a05e5e", photo: "photo-1582750433449-648ed127bb54" },
];

function HomeTeam({ goTo }: { goTo: (p: VetPage) => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="Notre équipe" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>Des vétérinaires passionnés</h2>
      </motion.div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, maxWidth: 960, margin: "0 auto 48px" }}>
        {TEAM_DATA.slice(0, 3).map((doc, i) => (
          <motion.div key={doc.name} initial={{ opacity: 0, y: 44 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: i * 0.12 }} whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.bgSection, borderRadius: 20, padding: 32, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: doc.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24, fontWeight: 800, color: C.white, letterSpacing: 1 }}>{doc.initials}</div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: C.text, marginBottom: 4 }}>{doc.name}</h3>
            <div style={{ fontSize: 14, fontWeight: 700, color: doc.color, marginBottom: 8 }}>{doc.role}</div>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.55 }}>{doc.specialty}</p>
            <div style={{ display: "inline-block", background: C.accentLight, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 700, color: C.accent }}>{doc.exp} d'expérience</div>
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <motion.button type="button" onClick={() => goTo("equipe")}
          style={{ background: "transparent", color: C.accent, border: `2px solid ${C.accent}`, borderRadius: 10, padding: "13px 32px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 8 }}
          whileHover={{ background: C.accentLight, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Rencontrer toute l'équipe <ArrowRight size={16} />
        </motion.button>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Julie & Max (Border Collie)", text: "L'équipe PawCare a sauvé la vie de Max lors d'une urgence nocturne. Réactivité exemplaire, soins impeccables. Nous ne changerons jamais de clinique.", stars: 5 },
  { name: "Antoine & ses 2 chats", text: "Dr. Fontaine est une perle. Elle prend le temps d'expliquer chaque diagnostic, elle est douce avec les chats et toujours disponible pour répondre à nos questions.", stars: 5 },
  { name: "Léa & Noisette (lapin)", text: "Difficile de trouver un vétérinaire pour les lapins. Dr. Sall est une vraie spécialiste NAC — Noisette est en parfaite santé grâce à elle !", stars: 5 },
];

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="Témoignages" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>Des propriétaires heureux</h2>
      </motion.div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ background: C.white, borderRadius: 18, padding: 28, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              {Array.from({ length: t.stars }).map((_, k) => <Star key={k} size={14} color="#f59e0b" fill="#f59e0b" />)}
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 18, fontStyle: "italic" }}>"{t.text}"</p>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.accent }}>— {t.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS = [
  { name: "Basic Care", price: "25", period: "/ consultation", desc: "Pour les soins courants et le suivi préventif.", features: ["Consultation vétérinaire", "Déparasitage interne", "Conseils nutrition", "Carnet de santé digital", "Devis gratuit"], cta: "Prendre RDV", highlight: false, emoji: "🐾" },
  { name: "Complete Care", price: "89", period: "/ mois", desc: "La formule tout-inclus pour un suivi serein.", features: ["Consultations illimitées", "Vaccinations annuelles", "Bilan sanguin semestriel", "Détartrage dentaire", "Urgences prioritaires", "Application suivi santé"], cta: "S'abonner", highlight: true, emoji: "⭐" },
  { name: "Premium Care", price: "149", period: "/ mois", desc: "Le meilleur pour les animaux qui méritent tout.", features: ["Tout Complete Care", "Chirurgies incluses (hors implants)", "Suivi nutritionnel personnalisé", "Téléconsultation 7j/7", "Assurance accidents incluse", "Livraison médicaments"], cta: "Choisir Premium", highlight: false, emoji: "💎" },
];

function Pricing({ goTo }: { goTo: (p: VetPage) => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="Tarifs" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>Plans de soins transparents</h2>
        <p style={{ color: C.textMuted, fontSize: 16 }}>Remboursement assurance animaux partenaires — Sans engagement</p>
      </motion.div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, maxWidth: 980, margin: "0 auto", alignItems: "start" }}>
        {PLANS.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 44 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: i * 0.1 }}
            style={{ background: p.highlight ? C.text : C.bgSection, borderRadius: 24, padding: "38px 32px", border: p.highlight ? "none" : `1.5px solid ${C.border}`, boxShadow: p.highlight ? C.shadowLg : C.shadow, position: "relative", overflow: "hidden" }}>
            {p.highlight && (
              <>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.accent}, #52b788)` }} />
                <div style={{ position: "absolute", top: 20, right: 20, background: C.accent, color: C.white, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>Le plus choisi</div>
              </>
            )}
            <div style={{ marginBottom: 14 }}><TemplateIcon emoji={p.emoji} size={28} /></div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: p.highlight ? C.white : C.text, marginBottom: 8 }}>{p.name}</h3>
            <p style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.6)" : C.textMuted, marginBottom: 24, lineHeight: 1.55 }}>{p.desc}</p>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: 42, fontWeight: 900, color: p.highlight ? C.white : C.text, letterSpacing: -1 }}>€{p.price}</span>
              <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.55)" : C.textMuted, marginLeft: 6 }}>{p.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 11 }}>
              {p.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle size={16} color={p.highlight ? C.sand : C.accent} />
                  <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.82)" : C.text }}>{f}</span>
                </li>
              ))}
            </ul>
            <motion.button type="button" onClick={() => goTo("reservation")}
              style={{ width: "100%", background: p.highlight ? C.accent : "transparent", color: p.highlight ? C.white : C.text, border: p.highlight ? "none" : `1.5px solid ${C.border}`, borderRadius: 10, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
              whileHover={{ background: p.highlight ? C.accentDark : C.accentLight, borderColor: C.accent, color: p.highlight ? C.white : C.accent, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              {p.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Comment prendre rendez-vous en urgence ?", a: "Appelez directement notre ligne urgences disponible 24h/24 et 7j/7. Pour les urgences vitales, notre équipe d'astreinte intervient en moins de 30 minutes." },
  { q: "Acceptez-vous les animaux exotiques (lapins, oiseaux, reptiles) ?", a: "Oui ! Dr. Nadia Sall est spécialisée NAC (Nouveaux Animaux de Compagnie). Elle reçoit lapins, cobayes, oiseaux, reptiles et poissons du lundi au vendredi sur rendez-vous." },
  { q: "Travaillez-vous avec les assurances animaux ?", a: "Nous collaborons avec les principaux assureurs vétérinaires : Agria, Santévet, Assur O'Poil et April. Nous émettons les factures dans le format requis pour vos remboursements." },
  { q: "Proposez-vous la téléconsultation ?", a: "Oui, la téléconsultation est disponible pour les abonnés Complete Care et Premium Care. Idéale pour les questions de suivi, l'interprétation de résultats ou les conseils comportementaux." },
  { q: "Quelle est la durée d'une consultation standard ?", a: "Une consultation standard dure entre 20 et 30 minutes. Les consultations spécialisées (cardiologie, dermatologie) peuvent durer jusqu'à 45 minutes. Nous ne consultons jamais en flux tendu." },
];

function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="FAQ" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>Questions fréquentes</h2>
      </motion.div>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQS.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 18 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{ background: C.white, borderRadius: 14, border: `1px solid ${open === i ? C.accent : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
            <button type="button" onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", fontFamily: FONT }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
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

// ─── SUB-PAGE: Services ────────────────────────────────────────────────────────
const FULL_SERVICES = [
  { icon: <Stethoscope size={28} color={C.accent} />, title: "Consultation générale", price: "À partir de 25 €", desc: "Examen clinique complet : auscultation, palpation, bilan cutané et buccal. Compte-rendu digital remis en fin de consultation.", details: ["Bilan annuel de prévention", "Suivi de pathologie chronique", "Deuxième avis vétérinaire", "Consultation pré-opératoire"] },
  { icon: <Syringe size={28} color={C.accent} />, title: "Vaccinations", price: "À partir de 38 €", desc: "Protocoles vaccinaux personnalisés selon l'espèce, le mode de vie (intérieur / extérieur) et les risques géographiques.", details: ["Primo-vaccination chiot / chaton", "Rappels annuels", "Vaccin rage (voyage)", "Certificat international"] },
  { icon: <Shield size={28} color={C.accent} />, title: "Chirurgie", price: "Sur devis", desc: "Bloc opératoire équipé : monitoring cardiaque, respirateur, écho Doppler. Réveil en salle de soins intensifs.", details: ["Stérilisation / Castration", "Chirurgie des tissus mous", "Orthopédie", "Chirurgie dentaire"] },
  { icon: <Heart size={28} color={C.accent} />, title: "Cardiologie", price: "À partir de 90 €", desc: "Échocardiographie Doppler couleur, holter cardiaque 24h, suivi des insuffisances cardiaques congénitales et acquises.", details: ["Échocardiographie", "Holter cardiaque", "Traitement HTAP", "Suivi CMD / RCM"] },
  { icon: <Award size={28} color={C.accent} />, title: "Dentisterie", price: "À partir de 60 €", desc: "Détartrage ultrasonique, radiographie dentaire numérique, extraction et soins endodontiques pour chiens, chats et NAC.", details: ["Détartrage sous AG", "Extraction dentaire", "Traitement parodontal", "Bilan dentaire digital"] },
  { icon: <Users size={28} color={C.accent} />, title: "NAC — Exotiques", price: "À partir de 40 €", desc: "Spécialiste dédiée aux nouveaux animaux de compagnie : lapins, cochons d'Inde, furets, perroquets, reptiles, poissons.", details: ["Lapins & rongeurs", "Reptiles & amphibiens", "Oiseaux psittacidés", "Chirurgie NAC"] },
  { icon: <Stethoscope size={28} color={C.sand} />, title: "Urgences 24h/7j", price: "Supplément urgence : 35 €", desc: "Médecin urgentiste d'astreinte toutes les nuits et week-ends. Salle de triage et soins intensifs disponibles.", details: ["Intoxications", "Traumatismes", "Détresse respiratoire", "Choc anaphylactique"] },
  { icon: <Heart size={28} color={C.accent} />, title: "Dermatologie", price: "À partir de 65 €", desc: "Test d'allergènes, biopsies cutanées, traitement des dermatoses chroniques et suivi des pathologies auto-immunes.", details: ["Test d'intradermoréaction", "Traitement atopie", "Gale, teigne", "Dermatoses hormonales"] },
];

function ServicesPage({ goTo }: { goTo: (p: VetPage) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: "100px 80px 80px", fontFamily: FONT, background: C.bg }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <SectionBadge label="Tous nos services" />
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 18 }}>Soins complets pour chaque animal</h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto" }}>De la consultation de routine à la chirurgie spécialisée — notre plateau technique est au service de vos compagnons.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, maxWidth: 1200, margin: "0 auto 64px" }}>
        {FULL_SERVICES.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -5, boxShadow: C.shadowLg }}
            style={{ background: C.white, borderRadius: 20, padding: "32px 28px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div style={{ width: 56, height: 56, background: C.accentLight, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
              <span style={{ background: C.bgSection, color: C.accent, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 700, border: `1px solid ${C.border}` }}>{s.price}</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 18 }}>{s.desc}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {s.details.map((d) => (
                <li key={d} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.text }}>
                  <CheckCircle size={14} color={C.accent} /> {d}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <motion.button type="button" onClick={() => goTo("reservation")}
          style={{ background: C.accent, color: C.white, border: "none", borderRadius: 12, padding: "16px 40px", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 10 }}
          whileHover={{ background: C.accentDark, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Calendar size={18} /> Prendre rendez-vous
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── SUB-PAGE: Équipe ──────────────────────────────────────────────────────────
function EquipePage({ goTo }: { goTo: (p: VetPage) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: "100px 80px 80px", fontFamily: FONT, background: C.bg }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <SectionBadge label="Notre équipe" />
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 18 }}>Des vétérinaires passionnés</h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto" }}>Une équipe pluridisciplinaire unie par l'amour des animaux et l'exigence des meilleurs soins.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, maxWidth: 1100, margin: "0 auto 64px" }}>
        {TEAM_DATA.map((doc, i) => (
          <motion.div key={doc.name} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.white, borderRadius: 24, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
              <img src={`https://images.unsplash.com/${doc.photo}?w=800&q=80&fit=crop`} alt={doc.name} loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${doc.color}cc 100%)` }} />
              <div style={{ position: "absolute", bottom: 16, left: 20, color: C.white, fontWeight: 800, fontSize: 18 }}>{doc.name}</div>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: doc.color, marginBottom: 10 }}>{doc.role}</div>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 18 }}>{doc.specialty}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>{doc.exp} d'expérience</span>
                <span style={{ background: C.bgSection, color: C.textMuted, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.border}` }}>Disponible sur RDV</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ background: `linear-gradient(135deg, ${C.accentLight} 0%, ${C.bg} 100%)`, borderRadius: 24, padding: "48px", textAlign: "center", maxWidth: 700, margin: "0 auto", border: `1px solid ${C.border}` }}>
        <TemplateIcon emoji="🐾" size={40} />
        <h3 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: "16px 0 12px" }}>Rejoignez notre équipe</h3>
        <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 24 }}>Nous recrutons des vétérinaires passionnés. Envoyez votre candidature à contact@pawcare-bordeaux.fr</p>
        <motion.button type="button" onClick={() => goTo("contact")}
          style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "13px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
          whileHover={{ background: C.accentDark, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Nous contacter
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── SUB-PAGE: Réservation ────────────────────────────────────────────────────
function ReservationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ petName: "", ownerName: "", species: "", date: "", time: "", reason: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "100px 80px 80px", fontFamily: FONT, background: C.bg, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
            style={{ width: 80, height: 80, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <CheckCircle size={40} color={C.accent} />
          </motion.div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 16 }}>Demande envoyée !</h2>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 12 }}>
            Votre demande de rendez-vous pour <strong style={{ color: C.text }}>{form.petName}</strong> a bien été reçue.
          </p>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 32 }}>Notre équipe vous confirme votre créneau par email dans les 2 heures ouvrées.</p>
          <motion.button type="button" onClick={() => setSubmitted(false)}
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "13px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
            whileHover={{ background: C.accentDark, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Nouveau rendez-vous
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "13px 16px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 15, fontFamily: FONT, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" as const };
  const labelStyle: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: C.text, display: "block", marginBottom: 7 };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: "100px 80px 80px", fontFamily: FONT, background: C.bg }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <SectionBadge label="Prise de rendez-vous" />
        <h1 style={{ fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 16 }}>Réserver une consultation</h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>Remplissez ce formulaire, notre équipe confirme votre créneau par email sous 2 heures ouvrées.</p>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <form onSubmit={handleSubmit} style={{ background: C.white, borderRadius: 24, padding: "48px 44px", boxShadow: C.shadowLg, border: `1px solid ${C.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <label style={labelStyle} htmlFor="ownerName">Votre nom</label>
              <input id="ownerName" name="ownerName" type="text" required placeholder="Jean Dupont" value={form.ownerName} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="petName">Nom de votre animal</label>
              <input id="petName" name="petName" type="text" required placeholder="Rex" value={form.petName} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle} htmlFor="species">Espèce</label>
            <select id="species" name="species" required value={form.species} onChange={handleChange} style={inputStyle}>
              <option value="">Sélectionner l'espèce…</option>
              <option value="chien">Chien</option>
              <option value="chat">Chat</option>
              <option value="lapin">Lapin / Rongeur</option>
              <option value="oiseau">Oiseau</option>
              <option value="reptile">Reptile</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <label style={labelStyle} htmlFor="date">Date souhaitée</label>
              <input id="date" name="date" type="date" required value={form.date} onChange={handleChange} style={inputStyle} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="time">Heure souhaitée</label>
              <select id="time" name="time" required value={form.time} onChange={handleChange} style={inputStyle}>
                <option value="">Choisir un créneau…</option>
                {["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle} htmlFor="reason">Motif de la consultation</label>
            <textarea id="reason" name="reason" required placeholder="Décrivez brièvement le motif de votre visite…" value={form.reason} onChange={handleChange}
              style={{ ...inputStyle, resize: "vertical", minHeight: 110 }} />
          </div>

          <div style={{ background: C.bgSection, borderRadius: 12, padding: "14px 18px", marginBottom: 28, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Shield size={16} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: C.textMuted, margin: 0, lineHeight: 1.55 }}>Vos données sont utilisées uniquement pour la gestion de votre rendez-vous. Aucune donnée n'est partagée avec des tiers. Conformément au RGPD, vous pouvez exercer vos droits à contact@pawcare-bordeaux.fr</p>
          </div>

          <motion.button type="submit"
            style={{ width: "100%", background: C.accent, color: C.white, border: "none", borderRadius: 12, padding: "16px", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
            whileHover={{ background: C.accentDark, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Send size={18} /> Envoyer ma demande
          </motion.button>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }}>
          {[
            { icon: <Phone size={16} color={C.accent} />, title: "Urgences", text: "Ligne 24h/7j" },
            { icon: <Clock size={16} color={C.accent} />, title: "Horaires", text: "Lun–Sam 8h–20h" },
          ].map((item) => (
            <div key={item.title} style={{ background: C.white, borderRadius: 14, padding: "18px 20px", border: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, background: C.accentLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{item.title}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── SUB-PAGE: Blog ───────────────────────────────────────────────────────────
const BLOG_ARTICLES = [
  {
    slug: "vaccinations-chien-chat",
    title: "Calendrier vaccinal : ce qu'il faut savoir pour votre chien ou chat",
    excerpt: "La vaccination est la première ligne de défense contre les maladies infectieuses graves. Découvrez le calendrier recommandé par nos vétérinaires.",
    date: "3 juin 2026",
    readTime: "5 min",
    photo: "photo-1587300003388-59208cc962cb",
    tag: "Prévention",
    content: `La vaccination protège votre animal contre des maladies potentiellement mortelles : parvovirose, maladie de Carré, calicivirose féline, leucose… \n\nPour les chiens, la primo-vaccination débute à 7-8 semaines, avec un rappel à 12 semaines, puis annuellement. Pour les chats, le protocole commence à 8 semaines avec un rappel à 12 semaines.\n\nCertains vaccins sont obligatoires pour les pensions ou les voyages (rage, toux du chenil). D'autres sont recommandés selon le mode de vie : leptospirose pour les chiens en contact avec l'eau, leucose pour les chats d'extérieur.\n\nChaque consultation vaccinale est aussi l'occasion d'un bilan complet. Votre vétérinaire adapte le calendrier à l'âge, au poids et au mode de vie de votre animal.`,
  },
  {
    slug: "alimentation-sante-chats",
    title: "Bien nourrir son chat : les erreurs fréquentes à éviter",
    excerpt: "Croquettes, pâtée, alimentation raw… Nos vétérinaires décryptent les bonnes pratiques nutritionnelles pour garder votre chat en pleine santé.",
    date: "27 mai 2026",
    readTime: "7 min",
    photo: "photo-1514888286974-6c03e2ca1dba",
    tag: "Nutrition",
    content: `Le chat est un carnivore strict. Contrairement au chien, il ne peut pas synthétiser certains acides aminés (taurine, arginine) — ils doivent être présents dans son alimentation.\n\nPrincipales erreurs à éviter :\n\n• Donner uniquement des croquettes sans eau accessible : le chat ne ressent pas bien la soif, ce qui favorise les maladies rénales et les FLUTD (troubles urinaires).\n• Les aliments humains : oignon, ail, raisin, chocolat et alcool sont toxiques pour les chats.\n• L'alimentation végétarienne ou végane : biologiquement inadaptée pour un carnivore strict.\n\nNos recommandations : alternez croquettes de qualité (label FEDIAF, sans céréales en tête de liste) et pâtée pour l'apport hydrique. En cas de doute, consultez notre vétérinaire nutritionniste.`,
  },
  {
    slug: "animaux-exotiques-veterinaire",
    title: "Mon lapin est-il malade ? Les signes d'alerte à connaître",
    excerpt: "Les lapins sont des proies dans la nature — ils cachent leurs symptômes. Apprenez à repérer les signaux discrets qui doivent vous alerter.",
    date: "18 mai 2026",
    readTime: "6 min",
    photo: "photo-1585110396000-c9ffd4e4b308",
    tag: "Exotiques",
    content: `Le lapin est un animal de proie qui dissimule sa douleur par instinct de survie. C'est pourquoi il est crucial de connaître les signes subtils d'alerte.\n\nSignes d'urgence immédiats :\n• Arrêt de l'alimentation (même 12h, c'est grave — risque de GI stasis)\n• Respiration laborieuse ou bruits respiratoires\n• Posture prostrée, refus de se déplacer\n• Tête penchée (torticolis = encéphalitozoonose)\n• Diarrhée liquide chez un jeune lapin\n\nSignes à surveiller :\n• Baisse d'appétit progressive\n• Poil terne ou chute excessive\n• Selles plus petites ou irrégulières\n• Dents qui claquent (bruxisme de douleur)\n\nDr. Nadia Sall reçoit les lapins et rongeurs du lundi au vendredi. N'attendez pas pour consulter — chez les lapins, les situations évoluent très vite.`,
  },
];

function BlogPage() {
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const current = BLOG_ARTICLES.find((a) => a.slug === openArticle);

  if (current) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: "100px 80px 80px", fontFamily: FONT, background: C.bg, maxWidth: 820, margin: "0 auto" }}>
        <button type="button" onClick={() => setOpenArticle(null)}
          style={{ background: C.accentLight, color: C.accent, border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FONT, marginBottom: 36, display: "flex", alignItems: "center", gap: 6 }}>
          ← Retour au blog
        </button>
        <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 20, display: "inline-block" }}>{current.tag}</span>
        <h1 style={{ fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 16, lineHeight: 1.2 }}>{current.title}</h1>
        <div style={{ display: "flex", gap: 16, marginBottom: 32, color: C.textMuted, fontSize: 14 }}>
          <span>{current.date}</span><span>•</span><span>{current.readTime} de lecture</span>
        </div>
        <img src={`https://images.unsplash.com/${current.photo}?w=800&q=80&fit=crop`} alt={current.title} loading="lazy"
          style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 18, marginBottom: 36 }} />
        {current.content.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontSize: 16, color: para.startsWith("•") ? C.text : C.textMuted, lineHeight: 1.8, marginBottom: 20, whiteSpace: "pre-line" }}>{para}</p>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: "100px 80px 80px", fontFamily: FONT, background: C.bg }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionBadge label="Blog" />
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 18 }}>Conseils santé & bien-être</h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto" }}>Nos vétérinaires partagent leurs conseils pour mieux comprendre et prendre soin de vos animaux.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, maxWidth: 1100, margin: "0 auto" }}>
        {BLOG_ARTICLES.map((article, i) => (
          <motion.div key={article.slug} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: C.white, borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow, cursor: "pointer" }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }} onClick={() => setOpenArticle(article.slug)}>
            <div style={{ height: 200, overflow: "hidden" }}>
              <img src={`https://images.unsplash.com/${article.photo}?w=800&q=80&fit=crop`} alt={article.title} loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }} />
            </div>
            <div style={{ padding: "24px 26px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{article.tag}</span>
                <span style={{ fontSize: 12, color: C.textMuted }}>{article.readTime}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 10, lineHeight: 1.3 }}>{article.title}</h3>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 20 }}>{article.excerpt}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: C.textMuted }}>{article.date}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, display: "flex", alignItems: "center", gap: 4 }}>Lire l'article <ChevronRight size={14} /></span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── SUB-PAGE: Contact ────────────────────────────────────────────────────────
function ContactPage({ goTo }: { goTo: (p: VetPage) => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "13px 16px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 15, fontFamily: FONT, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" as const };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: "100px 80px 80px", fontFamily: FONT, background: C.bg }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <SectionBadge label="Contact" />
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 18 }}>Nous contacter</h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>Une question, une urgence ou un renseignement — notre équipe vous répond dans les plus brefs délais.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 1100, margin: "0 auto", alignItems: "start" }}>
        {/* Info */}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 28 }}>Informations pratiques</h2>

          {/* Map placeholder */}
          <div style={{ background: C.bgSection, borderRadius: 18, height: 220, marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}`, flexDirection: "column", gap: 10 }}>
            <MapPin size={32} color={C.accent} />
            <span style={{ fontSize: 14, color: C.textMuted, fontWeight: 600 }}>Bordeaux, Gironde (33)</span>
            <span style={{ fontSize: 13, color: C.textMuted }}>Adresse communiquée sur demande à contact@aevia.io</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { icon: <Phone size={18} color={C.accent} />, label: "Téléphone urgences", value: "Disponible 24h/7j — contactez-nous par email" },
              { icon: <Mail size={18} color={C.accent} />, label: "Email", value: "contact@pawcare-bordeaux.fr" },
              { icon: <MapPin size={18} color={C.accent} />, label: "Adresse", value: "Communiquée sur demande à contact@aevia.io" },
              { icon: <Clock size={18} color={C.accent} />, label: "Horaires", value: "Lun–Ven 8h–20h | Sam 9h–18h | Urgences 24h/7j" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: C.textMuted }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: C.white, borderRadius: 20, padding: "48px 40px", border: `1px solid ${C.border}`, boxShadow: C.shadow, textAlign: "center" }}>
              <CheckCircle size={48} color={C.accent} style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 12 }}>Message envoyé !</h3>
              <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 28 }}>Nous vous répondons sous 24h ouvrées.</p>
              <button type="button" onClick={() => setSent(false)} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT }}>Nouveau message</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: C.white, borderRadius: 20, padding: "40px 36px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 28 }}>Envoyer un message</h3>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: C.text, display: "block", marginBottom: 7 }} htmlFor="cname">Votre nom</label>
                <input id="cname" name="name" type="text" required placeholder="Jean Dupont" value={form.name} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: C.text, display: "block", marginBottom: 7 }} htmlFor="cemail">Email</label>
                <input id="cemail" name="email" type="email" required placeholder="jean@exemple.fr" value={form.email} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: C.text, display: "block", marginBottom: 7 }} htmlFor="cmessage">Message</label>
                <textarea id="cmessage" name="message" required placeholder="Votre message…" value={form.message} onChange={handleChange} style={{ ...inputStyle, resize: "vertical", minHeight: 120 }} />
              </div>
              <motion.button type="submit"
                style={{ width: "100%", background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "15px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                whileHover={{ background: C.accentDark, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Send size={16} /> Envoyer
              </motion.button>
            </form>
          )}
        </div>
      </div>

      <div style={{ marginTop: 56, textAlign: "center" }}>
        <motion.button type="button" onClick={() => goTo("reservation")}
          style={{ background: C.sand, color: C.white, border: "none", borderRadius: 12, padding: "15px 36px", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 10 }}
          whileHover={{ opacity: 0.9, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Calendar size={18} /> Prendre rendez-vous en ligne
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── SUB-PAGE: Legal ──────────────────────────────────────────────────────────
function LegalPage({ variant }: { variant: "mentions" | "privacy" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: "100px 80px 80px", fontFamily: FONT, background: C.bg, maxWidth: 820, margin: "0 auto" }}>
      {variant === "mentions" ? (
        <>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 32 }}>Mentions légales</h1>
          <div style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.85, display: "flex", flexDirection: "column", gap: 20 }}>
            <div><strong style={{ color: C.text }}>Éditeur du site</strong><br />Aevia WS — SIREN 852 546 225 — Auto-entrepreneur, éditeur de sites web.<br />Contact : <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a><br />Adresse du siège social communiquée sur demande à contact@aevia.io</div>
            <div><strong style={{ color: C.text }}>Directeur de la publication</strong><br />Le gérant d'Aevia WS.</div>
            <div><strong style={{ color: C.text }}>Hébergement</strong><br />Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA — <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: C.accent }}>vercel.com</a></div>
            <div><strong style={{ color: C.text }}>Propriété intellectuelle</strong><br />L'ensemble du contenu de ce site (textes, images, graphismes) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.</div>
            <div><strong style={{ color: C.text }}>Liens hypertextes</strong><br />Ce site peut contenir des liens vers des sites tiers. Aevia WS n'est pas responsable du contenu de ces sites.</div>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 32 }}>Politique de confidentialité</h1>
          <div style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.85, display: "flex", flexDirection: "column", gap: 20 }}>
            <div><strong style={{ color: C.text }}>Responsable du traitement</strong><br />Aevia WS — contact@aevia.io</div>
            <div><strong style={{ color: C.text }}>Données collectées</strong><br />Ce site collecte uniquement les données que vous fournissez volontairement via les formulaires de contact et de prise de rendez-vous : nom, email, informations relatives à votre animal. Ces données sont utilisées exclusivement pour traiter votre demande.</div>
            <div><strong style={{ color: C.text }}>Durée de conservation</strong><br />Vos données sont conservées le temps nécessaire au traitement de votre demande, et au maximum 3 ans conformément aux recommandations de la CNIL.</div>
            <div><strong style={{ color: C.text }}>Vos droits (RGPD)</strong><br />Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a></div>
            <div><strong style={{ color: C.text }}>Cookies</strong><br />Ce site n'utilise pas de cookies de suivi ou de profilage. Aucune donnée de navigation n'est transmise à des tiers à des fins publicitaires.</div>
            <div><strong style={{ color: C.text }}>Hébergement</strong><br />Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA. Les données peuvent transiter par des serveurs situés en dehors de l'Union Européenne, dans le cadre des garanties offertes par le Data Privacy Framework.</div>
          </div>
        </>
      )}
    </motion.div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ goTo }: { goTo: (p: VetPage) => void }) {
  return (
    <footer style={{ background: C.text, color: C.white, padding: "70px 80px 32px", fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 52 }}>
        <div>
          <button type="button" onClick={() => goTo("home")} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ width: 38, height: 38, background: C.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><TemplateIcon emoji="🐾" size={20} color="#fff" /></div>
            <span style={{ fontWeight: 800, fontSize: 20, color: C.white }}>PawCare Clinic</span>
          </button>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>Clinique vétérinaire bienveillante à Bordeaux. Parce que votre animal mérite les mêmes soins d'excellence que vous.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { icon: <Mail size={15} />, text: "contact@pawcare-bordeaux.fr" },
              { icon: <MapPin size={15} />, text: "Adresse communiquée sur demande à contact@aevia.io" },
              { icon: <Clock size={15} />, text: "Lun–Sam 8h–20h | Urgences 24h/7j" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
                <span style={{ color: C.sand }}>{item.icon}</span>{item.text}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase" as const, letterSpacing: 0.8 }}>Services</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(["services", "reservation"] as VetPage[]).map((key, i) => (
              <button type="button" key={key} onClick={() => goTo(key)} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: FONT }}>
                {["Nos services", "Prendre RDV"][i]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase" as const, letterSpacing: 0.8 }}>Clinique</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(["equipe", "blog", "contact"] as VetPage[]).map((key, i) => (
              <button type="button" key={key} onClick={() => goTo(key)} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: FONT }}>
                {["Notre équipe", "Blog", "Contact"][i]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase" as const, letterSpacing: 0.8 }}>Légal</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button type="button" onClick={() => goTo("mentions")} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: FONT }}>Mentions légales</button>
            <button type="button" onClick={() => goTo("privacy")} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: FONT }}>Confidentialité</button>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14 }}>© 2026 PawCare Clinic — Site réalisé par <a href="mailto:contact@aevia.io" style={{ color: "rgba(255,255,255,0.38)", textDecoration: "none" }}>Aevia WS</a></p>
        <div style={{ display: "flex", gap: 20 }}>
          <button type="button" onClick={() => goTo("mentions")} style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, background: "none", border: "none", cursor: "pointer", fontFamily: FONT }}>Mentions légales</button>
          <button type="button" onClick={() => goTo("privacy")} style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, background: "none", border: "none", cursor: "pointer", fontFamily: FONT }}>Confidentialité</button>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Impact32() {
  const [page, setPage] = useState<VetPage>("home");
  const goTo = (p: VetPage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ background: C.bg, fontFamily: FONT, overflowX: "clip" }}>
      <Navbar page={page} goTo={goTo} />

      {/* HOME */}
      {page === "home" && (
        <>
          <Hero goTo={goTo} />
          <HomeServices goTo={goTo} />
          <Stats />
          <HomeTeam goTo={goTo} />
          <Testimonials />
          <Pricing goTo={goTo} />
          <FAQ />
        </>
      )}

      {/* SUB-PAGES */}
      {page === "services" && <ServicesPage goTo={goTo} />}
      {page === "equipe" && <EquipePage goTo={goTo} />}
      {page === "reservation" && <ReservationPage />}
      {page === "blog" && <BlogPage />}
      {page === "contact" && <ContactPage goTo={goTo} />}
      {page === "mentions" && <LegalPage variant="mentions" />}
      {page === "privacy" && <LegalPage variant="privacy" />}

      <Footer goTo={goTo} />
    </div>
  );
}
