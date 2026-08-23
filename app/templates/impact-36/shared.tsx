"use client"

/*
  impact-36 — Apex Talent, cabinet de recrutement de dirigeants. Francisé :
  le thème est vendu à des cabinets français (recrutement, avocats,
  comptables) — le corps parle leur langue, l'adresse n'est plus à New York.
  Fontes P10 Spectral + IBM Plex Sans · palette #f4f5f8 / #28415e.
*/

import React, { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Target,
  Users,
  BarChart2,
  ChevronDown,
} from "lucide-react"

// ─── Jetons ───────────────────────────────────────────────────────────────────
export const C = {
  bg: "#f4f5f8",
  bgAlt: "#ffffff",
  text: "#1c2839",
  textMuted: "#5a6b80",
  accent: "var(--brand, #28415e)",
  accentFixe: "#28415e",
  accentLight: "#e3e9f1",
  accentDark: "#1d3047",
  navy: "#1d2c3f",
  white: "#ffffff",
  border: "#dfe3ea",
  borderLight: "#edf0f5",
  /* Sur les bandes marine : le bleu acier clair qui remplace l'électrique. */
  surMarine: "#a9bdd3",
}

export const FONT = "'IBM Plex Sans', system-ui, sans-serif"
export const SERIF = "'Spectral', Georgia, serif"

// ─── Données ──────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    icon: Target,
    name: "Chasse de dirigeants",
    desc: "Directions générales, comités exécutifs, postes clés : nous allons chercher les candidats qui ne répondent pas aux annonces.",
    details: [
      "Mandats de direction générale",
      "Comité exécutif et cadres clés",
      "Recherches confidentielles",
      "Approche directe de profils en poste",
      "Garantie de remplacement 6 mois",
    ],
    href: "/templates/impact-36/services#executive",
  },
  {
    icon: Users,
    name: "Recrutement délégué",
    desc: "Pour les recrutements en volume : nous devenons votre équipe de recrutement intégrée, de la marque employeur à la signature.",
    details: [
      "Processus de bout en bout",
      "Marque employeur",
      "Outils et vivier dédiés",
      "Plan de recrutement pluriannuel",
      "Recruteurs dédiés à votre compte",
    ],
    href: "/templates/impact-36/services#rpo",
  },
  {
    icon: BarChart2,
    name: "Conseil RH",
    desc: "Organisation, rémunérations, fidélisation : la stratégie des équipes pour les entreprises qui grandissent vite.",
    details: [
      "Organigrammes et réorganisations",
      "Étude de rémunérations",
      "Entretiens et cadres d'évaluation",
      "Plans de fidélisation",
      "Choix des outils RH",
    ],
    href: "/templates/impact-36/services#consulting",
  },
]

export const SECTORS = [
  "Industrie & production",
  "Numérique & logiciel",
  "Banque & assurance",
  "Santé",
  "BTP & immobilier",
  "Distribution & commerce",
  "Transport & logistique",
  "Énergie & environnement",
  "Agroalimentaire",
  "Services aux entreprises",
  "Juridique & chiffre",
  "Secteur public & associatif",
]

export const CASE_STUDIES = [
  {
    company: "ETI industrielle, 400 salariés",
    sector: "Industrie",
    challenge: "Trouver un directeur de site et trois chefs d'atelier en moins de trois mois, avant le lancement d'une nouvelle ligne.",
    outcome: "Les quatre postes pourvus en 67 jours — dont deux profils approchés en poste, absents du marché.",
    metric: "67 jours",
    metricLabel: "pour pourvoir les quatre postes",
  },
  {
    company: "Groupe de cliniques régional",
    sector: "Santé",
    challenge: "Passer de 80 à 300 salariés sur six nouveaux sites, sans service recrutement interne.",
    outcome: "220 recrutements menés en quatorze mois en équipe déléguée, coût par embauche réduit d'un tiers.",
    metric: "-34 %",
    metricLabel: "de coût par embauche",
  },
  {
    company: "Cabinet d'expertise comptable",
    sector: "Juridique & chiffre",
    challenge: "Harmoniser les grilles et retenir les collaborateurs après le rapprochement de trois cabinets.",
    outcome: "Cadre commun déployé en 90 jours ; la rétention progresse de 28 % dès la première année.",
    metric: "+28 %",
    metricLabel: "de rétention à un an",
  },
]

export const TESTIMONIALS = [
  {
    name: "Directrice générale",
    role: "PME industrielle, 250 salariés",
    avatar: "DG",
    text: "Notre directeur industriel a été trouvé en cinq semaines — un poste que nous n'arrivions pas à pourvoir depuis six mois. Le niveau des candidatures était sans comparaison.",
    rating: 5,
  },
  {
    name: "Président fondateur",
    role: "Éditeur de logiciel",
    avatar: "PF",
    text: "Leur force, c'est le réseau : ils nous ont présenté des candidats qui ne cherchaient pas — dont notre actuelle directrice des opérations.",
    rating: 5,
  },
  {
    name: "DRH",
    role: "Groupe de distribution",
    avatar: "RH",
    text: "Le conseil RH a transformé notre façon de recruter : en trois mois, nous sommes passés de l'urgence permanente à un vrai plan d'équipe.",
    rating: 5,
  },
]

export const STATS = [
  { end: 2400, suffix: "+", label: "Recrutements menés" },
  { end: 340, suffix: "+", label: "Entreprises clientes" },
  { end: 94, suffix: " %", label: "Toujours en poste à un an" },
  { end: 18, suffix: " ans", label: "De pratique du métier" },
]

export const FAQS = [
  {
    q: "Quel est votre délai moyen pour un poste de direction ?",
    a: "Trente-huit jours en moyenne entre le lancement du mandat et l'offre signée pour un poste de cadre dirigeant. Les mandats de direction générale ou confidentiels demandent plutôt soixante à quatre-vingt-dix jours.",
  },
  {
    q: "Travaillez-vous au succès ou au mandat ?",
    a: "Les recherches de dirigeants sont menées au mandat exclusif ; le recrutement délégué est facturé au forfait mensuel. Nous ne travaillons pas au succès sur les postes sensibles : cela pousse à la vitesse au détriment de la qualité.",
  },
  {
    q: "Quels secteurs couvrez-vous ?",
    a: "Douze secteurs, avec des réseaux particulièrement profonds dans l'industrie, le numérique, la santé et les métiers du chiffre et du droit.",
  },
  {
    q: "Quelle est votre garantie ?",
    a: "Toute recherche de dirigeant inclut une garantie de remplacement de six mois : si le candidat recruté quitte son poste dans ce délai, quelle qu'en soit la raison, la recherche est relancée sans frais.",
  },
  {
    q: "Recrutez-vous hors de France ?",
    a: "Oui. Les mandats en Europe francophone sont menés par l'équipe interne ; au-delà, nous nous appuyons sur un réseau de cabinets partenaires.",
  },
  {
    q: "Comment approchez-vous les candidats en poste ?",
    a: "Par dix-huit ans de relations entretenues, un vivier qualifié et un travail de cartographie propre à chaque mandat. Les annonces ne représentent qu'une petite part de nos recrutements.",
  },
]

// ─── Composants ───────────────────────────────────────────────────────────────
export function Counter({
  end,
  suffix,
  label,
  delay,
}: {
  end: number
  suffix: string
  label: string
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * end))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      style={{ textAlign: "center" }}
    >
      <div
        style={{
          fontSize: "clamp(40px, 4vw, 56px)",
          fontWeight: 700,
          color: C.white,
          fontFamily: SERIF,
          lineHeight: 1,
        }}
      >
        {count.toLocaleString("fr-FR")}
        {suffix}
      </div>
      <div
        style={{
          fontSize: 15,
          color: C.surMarine,
          marginTop: 8,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </motion.div>
  )
}

export function FAQItem({
  faq,
  delay,
}: {
  faq: { q: string; a: string }
  delay: number
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: C.white,
          border: `1px solid ${open ? C.accent : C.border}`,
          borderRadius: 12,
          padding: "20px 24px",
          cursor: "pointer",
          marginBottom: 8,
          transition: "border-color 0.2s",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 16, color: C.navy }}>{faq.q}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ flexShrink: 0 }}
          >
            <ChevronDown size={20} color={C.textMuted} />
          </motion.div>
        </div>
        {open && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: 14,
              fontSize: 15,
              color: C.textMuted,
              lineHeight: 1.75,
            }}
          >
            {faq.a}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export function SectionReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export function MatchScore({ score, label }: { score: number; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          fontWeight: 600,
          color: C.white,
        }}
      >
        <span>{label}</span>
        <span style={{ color: C.surMarine }}>{score} %</span>
      </div>
      <div
        style={{
          height: 6,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${score}%` } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${C.surMarine}, #d3deea)`,
            borderRadius: 99,
          }}
        />
      </div>
    </div>
  )
}
