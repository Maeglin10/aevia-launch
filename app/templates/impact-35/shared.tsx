"use client"

import React, { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Wifi,
  Coffee,
  Printer,
  Calendar,
  Monitor,
  Lock,
  Clock,
  Zap,
  Building2,
  ChevronDown,
} from "lucide-react"

// ─── Design Tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg: "#f8f8f6",
  bgAlt: "#f0f0ec",
  text: "#1e293b",
  textMuted: "#64748b",
  accent: "#84cc16",
  accentDark: "#65a30d",
  accentLight: "#f0fdf4",
  white: "#ffffff",
  border: "#e2e8f0",
  slate: "#1e293b",
  slateMid: "#334155",
}

export const FONT = "'Outfit', system-ui, sans-serif"

// ─── Datasets ─────────────────────────────────────────────────────────────────
export const PLANS_FR = [
  {
    name: "Day Pass",
    price: "25",
    priceMensuel: "25",
    priceAnnuel: "21",
    period: "jour",
    features: [
      "Open Space (hot desk)",
      "Café inclus",
      "WiFi 1 Gbps",
      "Accès 9h–19h",
      "Espace lounge",
    ],
    cta: "Réserver",
    highlight: false,
  },
  {
    name: "Hot Desk",
    price: "180",
    priceMensuel: "180",
    priceAnnuel: "153",
    period: "mois",
    features: [
      "5 jours/semaine",
      "Casier dédié",
      "Adresse postale",
      "Café illimité",
      "Événements communauté",
      "4h salle de réunion/mois",
    ],
    cta: "Commencer",
    highlight: true,
  },
  {
    name: "Bureau Fixe Solo",
    price: "350",
    priceMensuel: "350",
    priceAnnuel: "298",
    period: "mois",
    features: [
      "Bureau attitré 24/7",
      "Adresse domiciliation",
      "10h salle de réunion/mois",
      "Café illimité",
      "Impression illimitée",
      "Accès invités (2/mois)",
    ],
    cta: "Réserver",
    highlight: false,
  },
  {
    name: "Bureau Équipe",
    price: "650",
    priceMensuel: "650",
    priceAnnuel: "553",
    period: "mois",
    features: [
      "2 à 4 personnes",
      "Bureau privatif",
      "Domiciliation incluse",
      "Salles de réunion illimitées",
      "Support prioritaire",
      "Accès 24/7",
    ],
    cta: "Réserver",
    highlight: false,
  },
]

export const AMENITIES = [
  { icon: Wifi, label: "Fibre 1 Gbps", desc: "Double connexion redondante avec options VPN privé" },
  { icon: Coffee, label: "Café Premium", desc: "Machine café haut de gamme, thés, eaux pétillantes" },
  { icon: Printer, label: "Impression & Scan", desc: "Imprimantes laser couleur, A3, plastification, reliure" },
  { icon: Calendar, label: "Espace Événement", desc: "Salle jusqu'à 150 personnes, scène modulable, catering" },
  { icon: Monitor, label: "Écrans 4K", desc: "Salles de réunion avec écrans 75\" et visioconférence" },
  { icon: Lock, label: "Accès 24/7", desc: "Badge d'entrée sécurisé, CCTV, réception colis" },
  { icon: Clock, label: "Horaires flexibles", desc: "Ouvert en permanence pour les membres permanents" },
  { icon: Zap, label: "Vélos & Douches", desc: "Vélos en libre-service, parking vélos sécurisé, douches" },
]

export const SPACE_TYPES = [
  {
    name: "Hot Desk",
    icon: "HD",
    tagline: "Flexibilité maximale",
    desc: "Choisissez n'importe quel bureau disponible dans notre open space. Idéal pour les freelances et télétravailleurs qui veulent un environnement productif sans engagement.",
    from: 25,
    perDay: true,
  },
  {
    name: "Bureau Dédié",
    icon: "BD",
    tagline: "Votre coin personnel",
    desc: "Un bureau permanent que vous pouvez personnaliser. Laissez vos équipements, rangez vos dossiers, arrivez prêt à travailler chaque matin.",
    from: 350,
    perDay: false,
  },
  {
    name: "Bureau Privé",
    icon: "BP",
    tagline: "Productivité en équipe",
    desc: "Bureaux fermés de 2 à 10 personnes. Personnalisez l'espace, tenez des réunions confidentielles et évoluez selon votre croissance.",
    from: 650,
    perDay: false,
  },
]

export const TESTIMONIALS = [
  {
    name: "Sophie Marchand",
    role: "Co-fondatrice, Luminary SaaS",
    avatar: "SM",
    rating: 5,
    text: "Nous sommes passés de 2 à 14 personnes en 18 mois. La flexibilité de passer des hot desks à un bureau privé sans déménager a été inestimable.",
  },
  {
    name: "Marc Chen",
    role: "Consultant Stratégie Indépendant",
    avatar: "MC",
    rating: 5,
    text: "L'atmosphère à elle seule vaut le prix. Je signe 40% plus de contrats quand je reçois mes clients ici plutôt qu'en café. Nexus Hub inspire le sérieux.",
  },
  {
    name: "Amara Diallo",
    role: "Head of Growth, FinPath",
    avatar: "AD",
    rating: 5,
    text: "La communauté ici est unique. Deux partenariats et une mise en relation investisseur sont directement sortis de connexions faites dans le lounge.",
  },
]

export const FAQS = [
  {
    q: "Puis-je tester avant de m'engager ?",
    a: "Absolument. Achetez un Day Pass à 25€ et découvrez l'ensemble des installations. Si vous rejoignez un abonnement mensuel dans les 7 jours, votre Day Pass est crédité sur votre premier mois.",
  },
  {
    q: "Qu'inclut le service de domiciliation ?",
    a: "Vous bénéficiez d'une adresse prestigieuse pour l'enregistrement de votre entreprise, la réception du courrier, la numérisation sur demande et la réception de colis. Inclus jusqu'à 20 articles par mois.",
  },
  {
    q: "Comment fonctionne la réservation des salles de réunion ?",
    a: "Les membres réservent via notre app ou la réception. Les abonnements mensuels incluent des heures créditées. Les heures supplémentaires sont à 35€/h. Les salles peuvent être réservées le jour même si disponibles.",
  },
  {
    q: "Puis-je résilier mon abonnement à tout moment ?",
    a: "Les abonnements Hot Desk nécessitent un préavis de 30 jours. Les Bureaux Fixes et Équipes requièrent 60 jours. Aucun contrat annuel obligatoire.",
  },
  {
    q: "Organisez-vous des événements communautaires ?",
    a: "Oui — afterworks mensuels, workshops, pitch sessions, meetups tech : tous les événements sont gratuits pour les membres. Nous organisons 80+ événements par an.",
  },
  {
    q: "Y a-t-il un essai gratuit ?",
    a: "Oui ! Nous offrons 1 journée d'essai gratuite sur présentation de votre projet. Contactez-nous à valentinmilliand@aevia.services pour en bénéficier.",
  },
]

export const STATS = [
  { value: "250+", label: "Membres actifs" },
  { value: "80+", label: "Entreprises" },
  { value: "30+", label: "Nationalités" },
  { value: "4.9", label: "Note membres" },
]

// ─── Helper Components ────────────────────────────────────────────────────────
export function FloorPlan() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  const zones = [
    { id: "hotdesk", label: "Open Space", x: 40, y: 40, w: 180, h: 120, color: C.accent },
    { id: "dedicated", label: "Bureaux Dédiés", x: 240, y: 40, w: 140, h: 120, color: "#3b82f6" },
    { id: "offices", label: "Bureaux Privés", x: 400, y: 40, w: 120, h: 260, color: "#8b5cf6" },
    { id: "meeting", label: "Salles Réunion", x: 40, y: 180, w: 180, h: 120, color: "#f59e0b" },
    { id: "lounge", label: "Lounge Membres", x: 240, y: 180, w: 140, h: 120, color: "#ec4899" },
    { id: "event", label: "Espace Événement", x: 40, y: 320, w: 340, h: 80, color: "#14b8a6" },
  ]

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox="0 0 560 430"
        style={{
          width: "100%",
          maxWidth: 620,
          borderRadius: 16,
          background: C.bgAlt,
          border: `2px solid ${C.border}`,
          display: "block",
        }}
      >
        <rect x="20" y="20" width="520" height="400" rx="8" fill="none" stroke={C.border} strokeWidth="2" />
        {zones.map((z) => (
          <g key={z.id}>
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              rx={6}
              fill={hoveredZone === z.id ? z.color : `${z.color}22`}
              stroke={z.color}
              strokeWidth={hoveredZone === z.id ? 2.5 : 1.5}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={() => setHoveredZone(z.id)}
              onMouseLeave={() => setHoveredZone(null)}
            />
            <text
              x={z.x + z.w / 2}
              y={z.y + z.h / 2 + 5}
              textAnchor="middle"
              fill={hoveredZone === z.id ? "#ffffff" : z.color}
              fontSize={11}
              fontWeight="600"
              fontFamily={FONT}
              style={{ pointerEvents: "none" }}
            >
              {z.label}
            </text>
          </g>
        ))}
      </svg>
      {hoveredZone && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.slate,
            color: C.white,
            padding: "8px 20px",
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {zones.find((z) => z.id === hoveredZone)?.label}
        </div>
      )}
    </div>
  )
}

export function FAQItem({ faq, delay }: { faq: { q: string; a: string }; delay: number }) {
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: C.slate }}>{faq.q}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
            <ChevronDown size={20} color={C.textMuted} />
          </motion.div>
        </div>
        {open && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 14, fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}
          >
            {faq.a}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
