"use client"

/*
  impact-35 — Carré Daviel, cabinet pluridisciplinaire chiffre & droit.
  L'ex-coworking a été réécrit : le thème est vendu aux avocats, aux
  experts-comptables et aux conseillers en patrimoine — le corps parle
  désormais leur métier. Jetons, données de démonstration et composants
  partagés entre l'accueil et les sous-pages.
  Fontes P2 Playfair Display + Space Grotesk · palette #f7f6f3 / #1f3a5f.
*/

import React, { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Scale, Calculator, Landmark, FileText, Briefcase, ShieldCheck } from "lucide-react"

// ─── Jetons ───────────────────────────────────────────────────────────────────
export const C = {
  bg: "#f7f6f3",
  bgAlt: "#efede7",
  white: "#ffffff",
  text: "#1c2430",
  textMuted: "#5d6673",
  navy: "var(--brand, #1f3a5f)",
  navyFixe: "#1f3a5f",
  navyDark: "#16293f",
  or: "#b08d4f",
  border: "#e2ded6",
}

export const SERIF = "'Playfair Display', Georgia, serif"
export const SANS = "'Space Grotesk', system-ui, sans-serif"

// ─── Données ──────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Expertises", href: "/templates/impact-35/services" },
  { label: "Le cabinet", href: "/templates/impact-35/spaces" },
  { label: "Honoraires", href: "/templates/impact-35/pricing" },
  { label: "L'équipe", href: "/templates/impact-35/community" },
]

export const EXPERTISES = [
  {
    icon: Briefcase,
    title: "Droit des affaires",
    desc: "Constitution, pactes d'associés, contrats commerciaux, cession : la vie juridique de l'entreprise, sécurisée à chaque étape.",
  },
  {
    icon: Calculator,
    title: "Comptabilité & paie",
    desc: "Tenue, révision, bilans et bulletins : des comptes tenus au fil de l'eau, pas reconstitués en avril.",
  },
  {
    icon: FileText,
    title: "Fiscalité",
    desc: "Déclarations, options fiscales, contrôles : l'impôt juste — celui que la loi prévoit, ni plus, ni moins.",
  },
  {
    icon: Landmark,
    title: "Gestion de patrimoine",
    desc: "Audit patrimonial, placements, immobilier, prévoyance : une stratégie écrite, revue chaque année.",
  },
  {
    icon: ShieldCheck,
    title: "Transmission",
    desc: "Donation, succession, cession d'entreprise : préparer tôt ce qui se joue une seule fois.",
  },
  {
    icon: Scale,
    title: "Contentieux",
    desc: "Négociation d'abord, plaidoirie s'il le faut : commercial, social et fiscal, devant toutes les juridictions.",
  },
]

export const FORFAITS = [
  {
    name: "Première consultation",
    price: "120",
    period: "l'heure",
    features: [
      "Au cabinet ou en visio",
      "Analyse de votre situation",
      "Plan d'action écrit sous 48 h",
      "Déductible si mission confiée",
    ],
    cta: "Prendre rendez-vous",
    highlight: false,
  },
  {
    name: "Entreprise — suivi annuel",
    price: "180",
    period: "mois",
    features: [
      "Comptabilité tenue au fil de l'eau",
      "Bilans et liasses fiscales",
      "Questions juridiques courantes incluses",
      "Point trimestriel avec votre associé référent",
      "Tableau de bord mensuel",
    ],
    cta: "Demander une proposition",
    highlight: true,
  },
  {
    name: "Audit patrimonial",
    price: "690",
    period: "forfait",
    features: [
      "Bilan complet : actifs, fiscalité, prévoyance",
      "Stratégie écrite et chiffrée",
      "Restitution de deux heures",
      "Mise à jour annuelle proposée",
    ],
    cta: "Commander l'audit",
    highlight: false,
  },
]

export const EQUIPE = [
  { nom: "Me Claire Daviel", role: "Avocate associée", detail: "Droit des affaires & contentieux" },
  { nom: "Antoine Rey", role: "Expert-comptable associé", detail: "Comptabilité, paie & fiscalité" },
  { nom: "Sarah Benkacem", role: "Conseillère patrimoniale", detail: "Placements & transmission" },
  { nom: "Julien Morvan", role: "Juriste", detail: "Rédaction & veille" },
]

export const TEMOIGNAGES = [
  {
    text: "Un seul cabinet pour la compta, le juridique et ma transmission : je n'explique plus mon dossier trois fois.",
    author: "Dirigeant de PME",
    detail: "suivi annuel",
  },
  {
    text: "Les honoraires sont écrits avant la mission, et tenus. C'est plus rare qu'on ne croit.",
    author: "Artisan, 12 salariés",
    detail: "création puis suivi",
  },
  {
    text: "L'audit patrimonial a mis à plat dix ans de décisions empilées. On sait enfin où on va.",
    author: "Profession libérale",
    detail: "audit patrimonial",
  },
]

export const FAQS = [
  {
    q: "Comment sont fixés les honoraires ?",
    a: "Chaque mission fait l'objet d'une convention d'honoraires écrite avant tout engagement : forfait quand le périmètre est connu, taux horaire communiqué d'avance sinon. Aucune diligence facturable n'est engagée sans votre accord.",
  },
  {
    q: "La première consultation m'engage-t-elle ?",
    a: "Non. Vous repartez avec une analyse et un plan d'action écrit ; vous êtes libre de le mettre en œuvre seul, avec nous, ou pas du tout. Son montant est déduit si vous nous confiez la mission.",
  },
  {
    q: "Mes informations sont-elles protégées ?",
    a: "Oui. Les avocats du cabinet sont tenus au secret professionnel, et l'ensemble de l'équipe à une stricte confidentialité. Vos pièces sont échangées par un espace sécurisé, jamais par simple courriel.",
  },
  {
    q: "Travaillez-vous à distance ?",
    a: "Le cabinet reçoit sur place et en visioconférence. La signature électronique et l'espace documentaire permettent de mener une mission entière sans déplacement.",
  },
  {
    q: "Pouvez-vous reprendre un dossier en cours ?",
    a: "Oui, dans le respect des règles de succession entre confrères et de transfert de mandat comptable. Le cabinet s'occupe des formalités de reprise.",
  },
]

export const STATS = [
  { value: "3", label: "métiers sous un même toit" },
  { value: "18 ans", label: "de pratique moyenne" },
  { value: "48 h", label: "pour un plan d'action écrit" },
  { value: "100 %", label: "des honoraires écrits d'avance" },
]

/* Photos du thème (déjà présentes au dépôt — aucune URL inventée). */
export const PHOTOS_CABINET = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80&fit=crop",
]

// ─── Composants ───────────────────────────────────────────────────────────────

export function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function FAQItem({ faq, delay }: { faq: { q: string; a: string }; delay: number }) {
  const [open, setOpen] = useState(false)
  return (
    <SectionReveal delay={delay}>
      <div style={{ borderBottom: `1px solid ${C.border}` }}>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          style={{
            width: "100%",
            textAlign: "left",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "22px 4px",
            minHeight: 44,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 18,
            color: C.text,
          }}
        >
          <span style={{ fontFamily: SERIF, fontSize: "clamp(17px,1.6vw,21px)", fontWeight: 500 }}>{faq.q}</span>
          <span aria-hidden style={{ fontFamily: SANS, fontSize: 20, color: C.or, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.3s", lineHeight: 1 }}>+</span>
        </button>
        <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.45s ease" }}>
          <p style={{ fontFamily: SANS, color: C.textMuted, fontSize: 14.5, lineHeight: 1.8, padding: "0 4px 24px", margin: 0, maxWidth: 720 }}>
            {faq.a}
          </p>
        </div>
      </div>
    </SectionReveal>
  )
}

/* L'en-tête rituel des sections : sur-titre espacé, titre serif. */
export function TitreSection({ surtitre, children, centre = false }: { surtitre: string; children: React.ReactNode; centre?: boolean }) {
  return (
    <div style={{ textAlign: centre ? "center" : "left", marginBottom: "clamp(34px,4.5vw,56px)" }}>
      <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: C.or, fontWeight: 600, marginBottom: 14 }}>{surtitre}</div>
      <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.8vw,48px)", fontWeight: 600, color: C.text, lineHeight: 1.12, letterSpacing: "-0.01em", margin: 0 }}>{children}</h2>
    </div>
  )
}
