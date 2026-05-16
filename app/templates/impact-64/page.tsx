"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Terminal,
  AlertTriangle,
  Lock,
  Server,
  Eye,
  Cpu,
  Globe,
  ArrowRight,
  Check,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Activity,
  Database,
  Zap,
  Code2,
  GitBranch,
  MessageSquare,
  Link2,
} from "lucide-react";

const C = {
  bg: "#030b05",
  bgAlt: "#060f08",
  bgCard: "#091209",
  text: "#e8f5e9",
  textMuted: "#6b8f6e",
  green: "#00e676",
  greenDim: "rgba(0,230,118,0.65)",
  greenGlow: "rgba(0,230,118,0.12)",
  greenBorder: "rgba(0,230,118,0.18)",
  greenBorderHover: "rgba(0,230,118,0.45)",
  red: "#ef5350",
  orange: "#ffb74d",
  blue: "#40c4ff",
  border: "rgba(0,230,118,0.12)",
  white: "#ffffff",
};

const mono = '"JetBrains Mono", "Fira Code", "Courier New", monospace';
const sans = "system-ui, -apple-system, sans-serif";

// ─── LIVE THREAT FEED ────────────────────────────────────────────────────────
const THREAT_POOL = [
  { severity: "CRIT", msg: "Brute-force SSH bloquée — 185.234.219.4 → srv-db-02", color: "#ef5350" },
  { severity: "HIGH", msg: "SQL injection tentée — endpoint /api/auth — IP 91.108.4.18", color: "#ffb74d" },
  { severity: "CRIT", msg: "Scan de ports détecté — 0.0.0.0/0 — 4 096 ports en 2.3s", color: "#ef5350" },
  { severity: "BLOCK", msg: "DDoS SYN flood mitigé — 2.4Gbps absorbés — origin AS16509", color: "#00e676" },
  { severity: "WARN", msg: "Certificat TLS expiré — cdn-static.prod.internal", color: "#ffb74d" },
  { severity: "HIGH", msg: "Exfiltration DNS suspectée — domaine: exfil-c2-87.ru", color: "#ffb74d" },
  { severity: "CRIT", msg: "Privilege escalation — user 'deploy' → root — srv-api-01", color: "#ef5350" },
  { severity: "BLOCK", msg: "XSS persistant neutralisé — payload injecté via cookie", color: "#00e676" },
  { severity: "INFO", msg: "Patch CVE-2025-1337 appliqué — 14 hosts mis à jour", color: "rgba(0,230,118,0.65)" },
  { severity: "HIGH", msg: "RDP exposé — 3389/tcp public — violation policy ISO 27001", color: "#ffb74d" },
  { severity: "CRIT", msg: "Ransomware signature détectée — LockBit 3.0 — quarantaine", color: "#ef5350" },
  { severity: "BLOCK", msg: "C2 callback bloqué — beacon Cobalt Strike — IP 104.21.98.7", color: "#00e676" },
];

const SERVICES = [
  {
    icon: Shield,
    title: "SOC 24/7",
    subtitle: "Centre opérationnel permanent",
    desc: "Surveillance active de votre infrastructure en continu. Nos analystes Level 1 à Level 3 traitent chaque alerte en moins de 8 minutes, 365 jours par an.",
    metrics: ["MTTR < 8 min", "99.98% uptime", "24/7/365"],
    price: "À partir de 2 400 €/mois",
  },
  {
    icon: Eye,
    title: "Red Team",
    subtitle: "Pentest offensif avancé",
    desc: "Simulation d'attaquants réels : APT, social engineering, physical breach. Rapport complet avec CVSS scoring et roadmap de remédiation priorisée.",
    metrics: ["PTES methodology", "CVSSv3 scoring", "Rapport ISO 27001"],
    price: "À partir de 8 500 €/mission",
  },
  {
    icon: Database,
    title: "SIEM & EDR",
    subtitle: "Détection & réponse aux incidents",
    desc: "Déploiement et gestion de votre SIEM (Splunk / Elastic) et EDR (CrowdStrike / SentinelOne). Corrélation de 50 000+ événements/seconde.",
    metrics: ["50K events/sec", "MITRE ATT&CK", "SOAR intégré"],
    price: "À partir de 1 800 €/mois",
  },
  {
    icon: Lock,
    title: "Conformité",
    subtitle: "ISO 27001 · NIS2 · RGPD",
    desc: "Audit de conformité, gap analysis et accompagnement à la certification. Nos consultants ont accompagné 140+ entreprises vers la certification ISO 27001.",
    metrics: ["140+ certifications", "Gap analysis", "Plan de traitement"],
    price: "À partir de 6 000 €/audit",
  },
  {
    icon: Globe,
    title: "Threat Intel",
    subtitle: "Renseignement sur les menaces",
    desc: "Flux de threat intelligence propriétaires + MISP. Surveillance du dark web, analyse d'IoCs, profiling d'acteurs malveillants spécifiques à votre secteur.",
    metrics: ["Dark web monitoring", "IoC correlation", "MISP intégré"],
    price: "À partir de 900 €/mois",
  },
  {
    icon: Cpu,
    title: "Hardening",
    subtitle: "Durcissement systèmes & réseaux",
    desc: "CIS Benchmarks, segmentation réseau Zero Trust, hardening Cloud (AWS/Azure/GCP). Score de conformité garanti ≥ 85% CIS Level 2.",
    metrics: ["CIS Benchmarks", "Zero Trust", "≥85% CIS L2"],
    price: "À partir de 4 500 €/périmètre",
  },
];

const STATS = [
  { value: 3800, suffix: "+", label: "Incidents traités en 2025" },
  { value: 99.98, suffix: "%", label: "SLA uptime garanti", decimals: 2 },
  { value: 8, suffix: "min", label: "Temps de réponse moyen" },
  { value: 140, suffix: "+", label: "Certifications ISO 27001" },
];

const TESTIMONIALS = [
  {
    name: "Alexandre Morin",
    role: "RSSI — Groupe Crédit Mutuel Arkéa",
    text: "NeuronSec a détecté en 6 heures ce que notre équipe interne n'avait pas vu en 3 semaines. L'incident a été contenu avant toute exfiltration. Leur SOC est d'un autre niveau.",
    stars: 5,
  },
  {
    name: "Isabelle Fontaine",
    role: "DSI — CHU de Nantes",
    text: "Après le ransomware de 2024, nous avions besoin d'un partenaire capable de tout reconstruire proprement. NeuronSec a livré un périmètre ISO 27001 en 4 mois. Incroyable.",
    stars: 5,
  },
  {
    name: "Renaud Castets",
    role: "CTO — Ledger SAS",
    text: "Le Red Team NeuronSec a trouvé une chaîne d'exploitation critique que 2 audits précédents avaient ratée. Rapport précis, remédiation claire, équipe de haut vol.",
    stars: 5,
  },
  {
    name: "Sophie Dalmau",
    role: "Directrice Conformité — BPCE",
    text: "Accompagnement NIS2 exemplaire. NeuronSec connaît les textes européens par cœur et sait les traduire en actions concrètes. Certification obtenue du premier coup.",
    stars: 5,
  },
  {
    name: "Marc-Antoine Lheureux",
    role: "CISO — Dalkia (EDF Group)",
    text: "Nos infrastructures OT/IT étaient un angle mort total. NeuronSec a cartographié l'ensemble et déployé une segmentation Zero Trust en 3 mois. Niveau de risque divisé par 8.",
    stars: 5,
  },
];

const PRICING = [
  {
    name: "Sentinel",
    price: "900",
    period: "/mois",
    highlight: false,
    tag: null,
    desc: "Threat intelligence et monitoring passif pour PME",
    features: [
      "Flux threat intel quotidien",
      "Dark web monitoring",
      "Alertes email/Slack",
      "Dashboard conformité RGPD",
      "Support ticket 9h-18h",
      "Rapport mensuel PDF",
    ],
  },
  {
    name: "Guardian",
    price: "2 400",
    period: "/mois",
    highlight: true,
    tag: "RECOMMANDÉ",
    desc: "SOC 24/7 + SIEM géré pour ETI et scale-ups",
    features: [
      "SOC 24/7/365 — Level 1 à 3",
      "SIEM Elastic déployé et géré",
      "EDR SentinelOne inclus",
      "MTTR garanti < 8 minutes",
      "Astreinte téléphonique 24h",
      "Rapport hebdomadaire executive",
      "1 pentest web/an inclus",
    ],
  },
  {
    name: "Fortress",
    price: "Sur devis",
    period: "",
    highlight: false,
    tag: "ENTERPRISE",
    desc: "Programme complet pour grands comptes et OIV",
    features: [
      "Tout Guardian +",
      "Red Team trimestriel",
      "ISO 27001 / NIS2 accompagnement",
      "Threat hunting proactif",
      "CSIRT dédié on-call",
      "SLA contractuel personnalisé",
      "vCISO à temps partiel",
    ],
  },
];

const TEAM = [
  {
    name: "Théo Marchetti",
    role: "CEO & Co-fondateur",
    bio: "Ex-ANSSI 8 ans. Expert APT et cyberguerre étatique. Certifié CISSP, OSCP. Conférencier au FIC et RSA Conference.",
    certs: ["CISSP", "OSCP", "CEH"],
  },
  {
    name: "Camille Dufresne",
    role: "Head of Red Team",
    bio: "Ancienne offensive security analyst chez Orange Cyberdefense. 12 ans de pentest. CVE discoverer. Bug bounty top 0.1% HackerOne.",
    certs: ["OSEP", "CRTO", "GXPN"],
  },
  {
    name: "Ibrahim Al-Rashid",
    role: "SIEM & Threat Intel Lead",
    bio: "Spécialiste Splunk Enterprise Security et MITRE ATT&CK. Ex-Thales Cybersecurity. Construit le SOC de 3 banques systémiques.",
    certs: ["Splunk SIEM", "GCIH", "GREM"],
  },
  {
    name: "Nora Blanchard",
    role: "GRC & Conformité",
    bio: "Auditrice principale ISO 27001:2022 et NIS2. 140 accompagnements réussis. Formatrice certifiée BSI. Docteure en droit numérique.",
    certs: ["ISO 27001 LA", "CISM", "CRISC"],
  },
];

const FAQ = [
  {
    q: "Combien de temps pour déployer un SOC 24/7 ?",
    a: "Entre 5 et 15 jours ouvrés selon la complexité de votre SI. Nous commençons par un audit d'inventaire, puis déployons les agents SIEM/EDR, configurons les règles de détection et formons votre équipe. Aucune interruption de service.",
  },
  {
    q: "Que couvre exactement la certification ISO 27001 ?",
    a: "L'ISO 27001:2022 certifie votre Système de Management de la Sécurité de l'Information (SMSI). Elle couvre 93 mesures de sécurité réparties en 4 domaines. Nous vous accompagnons de l'analyse d'écart jusqu'à l'audit de certification par un organisme accrédité COFRAC.",
  },
  {
    q: "Vos équipes accèdent-elles à nos données ?",
    a: "Nos analystes SOC voient uniquement les logs et métadonnées réseau nécessaires à la détection. Aucun accès aux données métier. Tout est contractualisé via DPA RGPD, accord de confidentialité NDA, et les données restent hébergées en France (datacenters Tier IV à Lyon et Paris).",
  },
  {
    q: "Comment fonctionne le Red Team / pentest ?",
    a: "Nous simulons un attaquant réel avec autorisation contractuelle. Trois phases : reconnaissance (OSINT), exploitation (applicatif, réseau, social engineering), post-exploitation (élévation de privilèges, persistance). Rapport CVSS v3.1 avec preuves vidéo et POC de correction.",
  },
  {
    q: "Êtes-vous qualifiés ANSSI ?",
    a: "NeuronSec est prestataire qualifié PRIS (Prestataire de Réponse aux Incidents de Sécurité) niveau Expert par l'ANSSI. Nos analystes sont habilités pour intervenir sur les OIV (Opérateurs d'Importance Vitale) et les OES (Opérateurs de Services Essentiels).",
  },
];

// ─── COUNTER HOOK ──────────────────────────────────────────────────────────
function useCounter(target: number, active: boolean, decimals = 0, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const steps = duration / 16;
    const step = target / steps;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return decimals > 0 ? count.toFixed(decimals) : Math.floor(count);
}

// ─── LIVE TERMINAL ────────────────────────────────────────────────────────
function LiveTerminal() {
  const [lines, setLines] = useState<{ severity: string; msg: string; color: string; ts: string }[]>([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setLines([]);
    let idx = 0;
    const getTs = () => {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    };
    const add = () => {
      if (idx >= THREAT_POOL.length) {
        setTimeout(() => { setKey(k => k + 1); }, 800);
        return;
      }
      const item = THREAT_POOL[idx++];
      setLines(prev => [...prev.slice(-11), { ...item, ts: getTs() }]);
      setTimeout(add, 600 + Math.random() * 900);
    };
    const timer = setTimeout(add, 400);
    return () => clearTimeout(timer);
  }, [key]);

  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.greenBorder}`,
      borderRadius: "8px",
      overflow: "hidden",
      fontFamily: mono,
      boxShadow: `0 0 60px rgba(0,230,118,0.06), 0 24px 80px rgba(0,0,0,0.6)`,
    }}>
      <div style={{
        background: "#060f08",
        borderBottom: `1px solid ${C.greenBorder}`,
        padding: "0.65rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef5350" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffb74d" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00e676" }} />
        <span style={{ marginLeft: "0.75rem", fontSize: "0.7rem", color: C.textMuted }}>
          neuronsec-soc — threat-feed v3.1.0 — LIVE
        </span>
        <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: C.green, display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green, display: "inline-block", boxShadow: `0 0 6px ${C.green}` }} />
          ACTIF
        </span>
      </div>
      <div style={{ padding: "1rem 1.25rem", minHeight: "320px", maxHeight: "320px", overflowY: "hidden" }}>
        <AnimatePresence mode="popLayout">
          {lines.map((l, i) => (
            <motion.div
              key={`${key}-${i}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: "0.71rem", lineHeight: 1.9, display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
            >
              <span style={{ color: C.textMuted, flexShrink: 0 }}>{l.ts}</span>
              <span style={{ color: l.color, fontWeight: 700, flexShrink: 0, minWidth: "42px" }}>[{l.severity}]</span>
              <span style={{ color: C.text, opacity: 0.85 }}>{l.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {lines.length < THREAT_POOL.length && (
          <span style={{ color: C.green, fontSize: "0.8rem" }}>█</span>
        )}
      </div>
      <div style={{
        background: "#060f08",
        borderTop: `1px solid ${C.greenBorder}`,
        padding: "0.55rem 1.25rem",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.68rem",
        color: C.textMuted,
      }}>
        <span style={{ color: C.green }}>● SOC ACTIF — PARIS</span>
        <span>Events/sec: 48 293</span>
        <span>TLS 1.3 · ISO 27001</span>
        <span>PRIS ANSSI ✓</span>
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Solutions", "SOC 24/7", "Conformité", "Red Team", "Tarifs"];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.9 }}
        style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`, transformOrigin: "left" }}
      />
      <div style={{
        background: scrolled ? "rgba(3,11,5,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.greenBorder}` : "none",
        padding: "0 2.5rem",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.3s",
      }}>
        <span style={{ fontFamily: mono, fontSize: "0.9rem", fontWeight: 700, color: C.green, letterSpacing: "0.05em" }}>
          NEURON<span style={{ color: C.text }}>SEC</span>
        </span>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {links.map(l => (
            <Link key={l} href="#" style={{ fontFamily: mono, fontSize: "0.72rem", color: C.textMuted, textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.green)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
            >
              {l.toUpperCase()}
            </Link>
          ))}
          <Link href="#" style={{
            fontFamily: mono, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em",
            background: C.green, color: C.bg, padding: "0.55rem 1.2rem",
            borderRadius: "4px", textDecoration: "none", transition: "box-shadow 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px rgba(0,230,118,0.4)`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
          >
            AUDIT GRATUIT
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function Impact64Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: "-80px" });

  const terminalRef = useRef(null);
  const terminalInView = useInView(terminalRef, { once: true, margin: "-80px" });

  const pricingRef = useRef(null);
  const pricingInView = useInView(pricingRef, { once: true, margin: "-80px" });

  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const stat0 = useCounter(STATS[0].value, statsInView, 0);
  const stat1 = useCounter(STATS[1].value, statsInView, 2);
  const stat2 = useCounter(STATS[2].value, statsInView, 0);
  const stat3 = useCounter(STATS[3].value, statsInView, 0);
  const statValues = [stat0, stat1, stat2, stat3];

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(0,230,118,0.25); color: #e8f5e9; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030b05; }
        ::-webkit-scrollbar-thumb { background: rgba(0,230,118,0.3); border-radius: 2px; }
      `}</style>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "8rem 2.5rem 4rem", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(0,230,118,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(0,230,118,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: "1400px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,230,118,0.08)", border: `1px solid ${C.greenBorder}`, borderRadius: "4px", padding: "0.4rem 0.9rem", marginBottom: "2rem" }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}`, display: "inline-block" }} />
              <span style={{ fontFamily: mono, fontSize: "0.68rem", color: C.green, letterSpacing: "0.12em" }}>PRIS ANSSI · NIS2 COMPLIANT · SOC ACTIF 24/7</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              style={{ fontFamily: mono, fontSize: "clamp(42px, 6vw, 88px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "1.75rem" }}
            >
              <span style={{ color: C.text }}>Votre infrastructure.</span>
              <br />
              <span style={{ color: C.green }}>Nos sentinelles.</span>
              <br />
              <span style={{ color: C.textMuted, fontSize: "0.55em", fontWeight: 400 }}>SOC · Red Team · ISO 27001</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ fontFamily: sans, fontSize: "1.1rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "500px", marginBottom: "2.5rem" }}
            >
              NeuronSec est le centre opérationnel de cybersécurité des entreprises qui ne peuvent pas se permettre d'être hackées. SOC 24/7, Red Team offensif, conformité NIS2 et ISO 27001.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
            >
              <Link href="#" style={{
                fontFamily: mono, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em",
                background: C.green, color: C.bg, padding: "0.9rem 2rem",
                borderRadius: "4px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem",
                transition: "box-shadow 0.2s, transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px rgba(0,230,118,0.5)`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                AUDIT GRATUIT <ArrowRight size={14} />
              </Link>
              <Link href="#" style={{
                fontFamily: mono, fontSize: "0.78rem", letterSpacing: "0.1em",
                background: "transparent", color: C.green, padding: "0.9rem 2rem",
                borderRadius: "4px", textDecoration: "none", border: `1px solid ${C.greenBorder}`,
                transition: "border-color 0.2s, background 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.background = "rgba(0,230,118,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.greenBorder; e.currentTarget.style.background = "transparent"; }}
              >
                VOIR LE SOC
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              style={{ marginTop: "3rem", display: "flex", gap: "2rem" }}
            >
              {[{ v: "3 800+", l: "incidents traités" }, { v: "99.98%", l: "SLA garanti" }, { v: "<8 min", l: "MTTR moyen" }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: mono, fontSize: "1.3rem", fontWeight: 700, color: C.green }}>{s.v}</div>
                  <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, letterSpacing: "0.08em" }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <LiveTerminal />
          </motion.div>
        </motion.div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────────────── */}
      <section id="solutions" style={{ padding: "1.5rem 0", borderTop: `1px solid ${C.greenBorder}`, borderBottom: `1px solid ${C.greenBorder}`, overflow: "hidden", background: C.bgAlt }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: "4rem", whiteSpace: "nowrap" }}
        >
          {[...Array(2)].map((_, rep) => (
            ["3 847 incidents bloqués cette année", "● SOC ACTIF 24H/24", "ISO 27001:2022 certifié", "PRIS ANSSI — niveau Expert", "99.98% uptime SLA", "NIS2 compliant", "CVSSv3.1 scoring", "MITRE ATT&CK framework"].map((item, i) => (
              <span key={`${rep}-${i}`} style={{ fontFamily: mono, fontSize: "0.72rem", color: item.startsWith("●") ? C.green : C.textMuted, letterSpacing: "0.1em" }}>
                {item}
              </span>
            ))
          ))}
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section id="soc" ref={statsRef} style={{ padding: "8rem 2.5rem", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              style={{
                padding: "3rem 2rem",
                border: `1px solid ${C.greenBorder}`,
                background: i % 2 === 0 ? C.bgCard : "transparent",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 700, color: C.green, lineHeight: 1 }}>
                {statValues[i]}{stat.suffix}
              </div>
              <div style={{ fontFamily: mono, fontSize: "0.7rem", color: C.textMuted, marginTop: "0.75rem", letterSpacing: "0.08em" }}>{stat.label.toUpperCase()}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────── */}
      <section id="conformite" ref={servicesRef} style={{ padding: "8rem 2.5rem", background: C.bgAlt }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "4rem" }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// SOLUTIONS</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, lineHeight: 1.15, color: C.text }}>
              Architecture de sécurité<br /><span style={{ color: C.green }}>complète et opérationnelle.</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: C.greenBorder }}>
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              const hovered = hoveredService === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}
                  style={{
                    background: hovered ? "rgba(0,230,118,0.04)" : C.bgCard,
                    padding: "2.5rem",
                    cursor: "default",
                    transition: "background 0.3s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {hovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                        background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`,
                      }}
                    />
                  )}
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "8px",
                    background: hovered ? "rgba(0,230,118,0.12)" : "rgba(0,230,118,0.05)",
                    border: `1px solid ${hovered ? C.greenBorderHover : C.greenBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.5rem", transition: "all 0.3s",
                  }}>
                    <Icon size={20} color={hovered ? C.green : C.textMuted} />
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, letterSpacing: "0.12em", marginBottom: "0.5rem" }}>{svc.subtitle.toUpperCase()}</div>
                  <h3 style={{ fontFamily: mono, fontSize: "1.1rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>{svc.title}</h3>
                  <p style={{ fontFamily: sans, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.7, marginBottom: "1.5rem" }}>{svc.desc}</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                    {svc.metrics.map(m => (
                      <span key={m} style={{
                        fontFamily: mono, fontSize: "0.62rem", color: C.green,
                        background: "rgba(0,230,118,0.06)", border: `1px solid ${C.greenBorder}`,
                        borderRadius: "3px", padding: "0.2rem 0.5rem", letterSpacing: "0.05em",
                      }}>{m}</span>
                    ))}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "0.72rem", color: hovered ? C.green : C.textMuted, transition: "color 0.3s" }}>{svc.price}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────── */}
      <section id="red-team" style={{ padding: "8rem 2.5rem", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "5rem", textAlign: "center" }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// PROCESSUS</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: C.text }}>
              Opérationnel en <span style={{ color: C.green }}>5 à 15 jours.</span>
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0", position: "relative" }}>
            <div style={{ position: "absolute", top: "28px", left: "10%", right: "10%", height: "1px", background: C.greenBorder, zIndex: 0 }} />
            {[
              { step: "01", title: "Audit SI", desc: "Cartographie de votre infrastructure, inventaire des assets et identification des risques critiques." },
              { step: "02", title: "Gap Analysis", desc: "Analyse d'écart vis-à-vis de ISO 27001, NIS2 et des best practices CIS Benchmarks." },
              { step: "03", title: "Déploiement", desc: "Installation des agents SIEM/EDR sans interruption. Formation de vos équipes internes." },
              { step: "04", title: "Calibration", desc: "Tuning des règles de détection pour réduire les faux positifs. Paramétrage des alertes." },
              { step: "05", title: "Go Live", desc: "SOC opérationnel 24/7. Votre tableau de bord disponible immédiatement. Premier rapport sous 7 jours." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ padding: "0 1.5rem", textAlign: "center", position: "relative", zIndex: 1 }}
              >
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: C.bg, border: `2px solid ${C.green}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  boxShadow: `0 0 20px rgba(0,230,118,0.15)`,
                }}>
                  <span style={{ fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, color: C.green }}>{s.step}</span>
                </div>
                <h4 style={{ fontFamily: mono, fontSize: "0.8rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", letterSpacing: "0.05em" }}>{s.title.toUpperCase()}</h4>
                <p style={{ fontFamily: sans, fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.65 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE THREAT SECTION ───────────────────────────────────────── */}
      <section id="tarifs" ref={terminalRef} style={{ padding: "8rem 2.5rem", background: C.bgAlt }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={terminalInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1.5rem" }}>// SIGNATURE ELEMENT — SOC LIVE</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1.5rem" }}>
              Chaque menace, en<br /><span style={{ color: C.green }}>temps réel.</span>
            </h2>
            <p style={{ fontFamily: sans, fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "2.5rem" }}>
              Notre SOC surveille en permanence 50 000+ événements par seconde. Ce flux en direct représente le type d'activité que nous traitons pour nos clients.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: Shield, text: "Corrélation MITRE ATT&CK en temps réel" },
                { icon: Zap, text: "Temps de réponse moyen < 8 minutes" },
                { icon: Activity, text: "50 000+ événements analysés par seconde" },
                { icon: Lock, text: "Données hébergées en France — Tier IV" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={terminalInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                  >
                    <Icon size={16} color={C.green} />
                    <span style={{ fontFamily: sans, fontSize: "0.875rem", color: C.textMuted }}>{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={terminalInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {terminalInView && <LiveTerminal />}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "4rem" }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// CLIENTS</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, color: C.text }}>Ils nous font confiance.</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: C.greenBorder }}>
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ background: C.bgCard, padding: "2.5rem" }}
              >
                <div style={{ display: "flex", gap: "2px", marginBottom: "1.5rem" }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: C.green, fontSize: "0.8rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontFamily: sans, fontSize: "0.875rem", color: C.text, lineHeight: 1.75, marginBottom: "2rem", opacity: 0.85 }}>"{t.text}"</p>
                <div>
                  <div style={{ fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, color: C.text }}>{t.name}</div>
                  <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, marginTop: "0.25rem", letterSpacing: "0.06em" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: C.greenBorder, marginTop: "1px" }}>
            {TESTIMONIALS.slice(3).map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ background: C.bgCard, padding: "2.5rem" }}
              >
                <div style={{ display: "flex", gap: "2px", marginBottom: "1.5rem" }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: C.green, fontSize: "0.8rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontFamily: sans, fontSize: "0.875rem", color: C.text, lineHeight: 1.75, marginBottom: "2rem", opacity: 0.85 }}>"{t.text}"</p>
                <div>
                  <div style={{ fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, color: C.text }}>{t.name}</div>
                  <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, marginTop: "0.25rem", letterSpacing: "0.06em" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────── */}
      <section ref={pricingRef} style={{ padding: "8rem 2.5rem", background: C.bgAlt }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// TARIFS</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, color: C.text }}>Choisissez votre niveau de protection.</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: C.greenBorder }}>
            {PRICING.map((plan, i) => {
              const hovered = hoveredPlan === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setHoveredPlan(i)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  style={{
                    background: plan.highlight ? "rgba(0,230,118,0.05)" : C.bgCard,
                    padding: "2.5rem",
                    position: "relative",
                    cursor: "default",
                    transition: "background 0.3s",
                  }}
                >
                  {plan.highlight && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, transparent, ${C.green}, transparent)` }} />}
                  {plan.tag && (
                    <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}>
                      <span style={{ fontFamily: mono, fontSize: "0.6rem", color: C.green, background: "rgba(0,230,118,0.1)", border: `1px solid ${C.greenBorder}`, borderRadius: "3px", padding: "0.2rem 0.5rem", letterSpacing: "0.1em" }}>
                        {plan.tag}
                      </span>
                    </div>
                  )}
                  <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, letterSpacing: "0.12em", marginBottom: "0.5rem" }}>{plan.name.toUpperCase()}</div>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <span style={{ fontFamily: mono, fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: plan.highlight ? C.green : C.text }}>
                      {plan.price === "Sur devis" ? plan.price : `${plan.price} €`}
                    </span>
                    {plan.period && <span style={{ fontFamily: mono, fontSize: "0.75rem", color: C.textMuted }}>{plan.period}</span>}
                  </div>
                  <p style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.6, marginBottom: "2rem" }}>{plan.desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2.5rem" }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                        <Check size={13} color={C.green} style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="#" style={{
                    display: "block", textAlign: "center",
                    fontFamily: mono, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
                    background: plan.highlight ? C.green : "transparent",
                    color: plan.highlight ? C.bg : C.green,
                    border: `1px solid ${plan.highlight ? C.green : C.greenBorder}`,
                    padding: "0.85rem", borderRadius: "4px", textDecoration: "none",
                    transition: "all 0.2s",
                  }}>
                    {plan.price === "Sur devis" ? "CONTACTER L'ÉQUIPE" : "COMMENCER"}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "4rem" }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// ÉQUIPE</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, color: C.text }}>
              Des experts qui ont vu<br /><span style={{ color: C.green }}>des vraies attaques.</span>
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: C.greenBorder }}>
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ background: C.bgCard, padding: "2rem" }}
              >
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  background: "rgba(0,230,118,0.08)", border: `1px solid ${C.greenBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.25rem",
                }}>
                  <span style={{ fontFamily: mono, fontSize: "1rem", fontWeight: 700, color: C.green }}>
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <h4 style={{ fontFamily: mono, fontSize: "0.85rem", fontWeight: 700, color: C.text, marginBottom: "0.25rem" }}>{member.name}</h4>
                <div style={{ fontFamily: mono, fontSize: "0.62rem", color: C.green, letterSpacing: "0.08em", marginBottom: "1rem" }}>{member.role}</div>
                <p style={{ fontFamily: sans, fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.65, marginBottom: "1.25rem" }}>{member.bio}</p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {member.certs.map(c => (
                    <span key={c} style={{
                      fontFamily: mono, fontSize: "0.58rem", color: C.textMuted,
                      background: "rgba(0,230,118,0.04)", border: `1px solid ${C.greenBorder}`,
                      borderRadius: "3px", padding: "0.15rem 0.4rem", letterSpacing: "0.06em",
                    }}>{c}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: C.bgAlt }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "3rem" }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// FAQ</span>
            <h2 style={{ fontFamily: mono, fontSize: "clamp(24px, 2.5vw, 38px)", fontWeight: 700, color: C.text }}>Questions fréquentes.</h2>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: C.greenBorder }}>
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{ background: C.bgCard, overflow: "hidden" }}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{
                    width: "100%", padding: "1.5rem 2rem",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: mono, fontSize: "0.85rem", fontWeight: 700, color: faqOpen === i ? C.green : C.text }}>{item.q}</span>
                  <motion.div animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} color={faqOpen === i ? C.green : C.textMuted} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 2rem 1.5rem", paddingTop: "1.25rem", fontFamily: sans, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.75, borderTop: `1px solid ${C.greenBorder}` }}>
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: C.bg, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,230,118,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse, rgba(0,230,118,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative" }}
        >
          <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1.5rem" }}>// COMMENCER</span>
          <h2 style={{ fontFamily: mono, fontSize: "clamp(32px, 5vw, 72px)", fontWeight: 700, color: C.text, lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Audit de sécurité<br /><span style={{ color: C.green }}>offert.</span> Sans engagement.
          </h2>
          <p style={{ fontFamily: sans, fontSize: "1.1rem", color: C.textMuted, maxWidth: "560px", margin: "0 auto 3rem", lineHeight: 1.7 }}>
            2 heures avec nos experts. Rapport complet offert. Vous repartez avec une vision claire de votre exposition aux risques.
          </p>
          <Link href="#" style={{
            fontFamily: mono, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em",
            background: C.green, color: C.bg, padding: "1rem 2.5rem",
            borderRadius: "4px", textDecoration: "none",
            boxShadow: `0 0 40px rgba(0,230,118,0.25)`,
            transition: "box-shadow 0.2s, transform 0.15s",
            display: "inline-block",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 60px rgba(0,230,118,0.45)`; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 40px rgba(0,230,118,0.25)`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            DEMANDER MON AUDIT GRATUIT
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgCard, borderTop: `1px solid ${C.greenBorder}`, padding: "4rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: "1rem", fontWeight: 700, color: C.green, marginBottom: "1rem", letterSpacing: "0.05em" }}>
                NEURON<span style={{ color: C.text }}>SEC</span>
              </div>
              <p style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.7, maxWidth: "300px", marginBottom: "1.5rem" }}>
                Centre opérationnel de cybersécurité. SOC 24/7, Red Team, ISO 27001. Qualifié PRIS ANSSI niveau Expert. Paris, France.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[{ icon: MessageSquare, label: "Contact" }, { icon: Link2, label: "LinkedIn" }, { icon: GitBranch, label: "GitHub" }].map(s => {
                  const Icon = s.icon;
                  return (
                    <Link key={s.label} href="#" style={{
                      width: "36px", height: "36px", borderRadius: "6px",
                      background: "rgba(0,230,118,0.05)", border: `1px solid ${C.greenBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.background = "rgba(0,230,118,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.greenBorder; e.currentTarget.style.background = "rgba(0,230,118,0.05)"; }}
                    >
                      <Icon size={14} color={C.textMuted} />
                    </Link>
                  );
                })}
              </div>
            </div>
            {[
              { title: "Solutions", links: ["SOC 24/7", "Red Team", "SIEM & EDR", "Conformité", "Threat Intel", "Hardening"] },
              { title: "Entreprise", links: ["À propos", "Équipe", "Certifications", "Blog sécurité", "Presse", "Carrières"] },
              { title: "Contact", links: ["Paris — 10ème arr.", "+33 1 44 62 87 00", "soc@neuronsec.fr", "Astreinte 24/7", "Urgence cyber"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.green, letterSpacing: "0.15em", marginBottom: "1.25rem" }}>{col.title.toUpperCase()}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {col.links.map(l => (
                    <Link key={l} href="#" style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.green)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.greenBorder}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted }}>© 2026 NeuronSec SAS — Tous droits réservés</span>
            <div style={{ display: "flex", gap: "2rem" }}>
              {["Mentions légales", "CGU", "RGPD", "Politique de sécurité"].map(l => (
                <Link key={l} href="#" style={{ fontFamily: mono, fontSize: "0.62rem", color: C.textMuted, textDecoration: "none", letterSpacing: "0.05em" }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
