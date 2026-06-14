"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  Database,
  Lock,
  Globe,
  Cpu,
} from "lucide-react";

export const C = {
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

export const mono = '"JetBrains Mono", "Fira Code", "Courier New", monospace';
export const sans = "system-ui, -apple-system, sans-serif";

// ─── LIVE THREAT FEED ────────────────────────────────────────────────────────
export const THREAT_POOL = [
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

export const SERVICES = [
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

export const STATS = [
  { value: 3800, suffix: "+", label: "Incidents traités en 2025" },
  { value: 99.98, suffix: "%", label: "SLA uptime garanti", decimals: 2 },
  { value: 8, suffix: "min", label: "Temps de réponse moyen" },
  { value: 140, suffix: "+", label: "Certifications ISO 27001" },
];

export const TESTIMONIALS = [
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

export const PRICING = [
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

export const TEAM = [
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

export const FAQ = [
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
export function useCounter(target: number, active: boolean, decimals = 0, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const steps = duration / 16;
    const step = target / steps;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return decimals > 0 ? count.toFixed(decimals) : Math.floor(count);
}

// ─── LIVE TERMINAL ────────────────────────────────────────────────────────
export function LiveTerminal() {
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
        setTimeout(() => {
          setKey((k) => k + 1);
        }, 800);
        return;
      }
      const item = THREAT_POOL[idx++];
      setLines((prev) => [...prev.slice(-11), { ...item, ts: getTs() }]);
      setTimeout(add, 600 + Math.random() * 900);
    };
    const timer = setTimeout(add, 400);
    return () => clearTimeout(timer);
  }, [key]);

  return (
    <div
      style={{
        background: C.bgCard,
        border: `1px solid ${C.greenBorder}`,
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: mono,
        boxShadow: `0 0 60px rgba(0,230,118,0.06), 0 24px 80px rgba(0,0,0,0.6)`,
      }}
    >
      <div
        style={{
          background: "#060f08",
          borderBottom: `1px solid ${C.greenBorder}`,
          padding: "0.65rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef5350" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffb74d" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00e676" }} />
        <span style={{ marginLeft: "0.75rem", fontSize: "0.7rem", color: C.textMuted }}>
          neuronsec-soc — threat-feed v3.1.0 — LIVE
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.65rem",
            color: C.green,
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: C.green,
              display: "inline-block",
              boxShadow: `0 0 6px ${C.green}`,
            }}
          />
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
              style={{
                fontSize: "0.71rem",
                lineHeight: 1.9,
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: C.textMuted, flexShrink: 0 }}>{l.ts}</span>
              <span style={{ color: l.color, fontWeight: 700, flexShrink: 0, minWidth: "42px" }}>
                [{l.severity}]
              </span>
              <span style={{ color: C.text, opacity: 0.85 }}>{l.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {lines.length < THREAT_POOL.length && <span style={{ color: C.green, fontSize: "0.8rem" }}>█</span>}
      </div>
      <div
        style={{
          background: "#060f08",
          borderTop: `1px solid ${C.greenBorder}`,
          padding: "0.55rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.68rem",
          color: C.textMuted,
        }}
      >
        <span style={{ color: C.green }}>● SOC ACTIF — PARIS</span>
        <span>Events/sec: 48 293</span>
        <span>TLS 1.3 · ISO 27001</span>
        <span>PRIS ANSSI ✓</span>
      </div>
    </div>
  );
}

export function StyleInjector() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      ::selection { background: rgba(0,230,118,0.25); color: #e8f5e9; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #030b05; }
      ::-webkit-scrollbar-thumb { background: rgba(0,230,118,0.3); border-radius: 2px; }
    `}} />
  );
}
