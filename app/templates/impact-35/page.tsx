"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  Wifi,
  Coffee,
  Printer,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  Star,
  Check,
  Zap,
  Monitor,
  Lock,
  Clock,
  MessageSquare,
  Link2,
  Users2,
  Camera,
  Building2,
  Layers,
  Menu,
  X,
  Mic,
  Music,
  Package,
  Bike,
  FileText,
  PartyPopper,
  ChevronRight,
} from "lucide-react";

const C = {
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
};

type CoworkPage =
  | "home"
  | "espaces"
  | "tarifs"
  | "services"
  | "communaute"
  | "contact"
  | "mentions"
  | "privacy";

const PLANS_FR = [
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
];

const AMENITIES = [
  { icon: Wifi, label: "Fibre 1 Gbps", desc: "Double connexion redondante avec options VPN privé" },
  { icon: Coffee, label: "Café Premium", desc: "Machine café haut de gamme, thés, eaux pétillantes" },
  { icon: Printer, label: "Impression & Scan", desc: "Imprimantes laser couleur, A3, plastification, reliure" },
  { icon: Calendar, label: "Espace Événement", desc: "Salle jusqu'à 150 personnes, scène modulable, catering" },
  { icon: Monitor, label: "Écrans 4K", desc: "Salles de réunion avec écrans 75\" et visioconférence" },
  { icon: Lock, label: "Accès 24/7", desc: "Badge d'entrée sécurisé, CCTV, réception colis" },
  { icon: Clock, label: "Horaires flexibles", desc: "Ouvert en permanence pour les membres permanents" },
  { icon: Zap, label: "Vélos & Douches", desc: "Vélos en libre-service, parking vélos sécurisé, douches" },
];

const SPACE_TYPES = [
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
];

const TESTIMONIALS = [
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
];

const FAQS = [
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
    a: "Oui ! Nous offrons 1 journée d'essai gratuite sur présentation de votre projet. Contactez-nous à contact@aevia.io pour en bénéficier.",
  },
];

const STATS = [
  { value: "250+", label: "Membres actifs" },
  { value: "80+", label: "Entreprises" },
  { value: "30+", label: "Nationalités" },
  { value: "4.9", label: "Note membres" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FloorPlan() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const zones = [
    { id: "hotdesk", label: "Open Space", x: 40, y: 40, w: 180, h: 120, color: C.accent },
    { id: "dedicated", label: "Bureaux Dédiés", x: 240, y: 40, w: 140, h: 120, color: "#3b82f6" },
    { id: "offices", label: "Bureaux Privés", x: 400, y: 40, w: 120, h: 260, color: "#8b5cf6" },
    { id: "meeting", label: "Salles Réunion", x: 40, y: 180, w: 180, h: 120, color: "#f59e0b" },
    { id: "lounge", label: "Lounge Membres", x: 240, y: 180, w: 140, h: 120, color: "#ec4899" },
    { id: "event", label: "Espace Événement", x: 40, y: 320, w: 340, h: 80, color: "#14b8a6" },
  ];

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
              fontFamily="'Outfit', system-ui"
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
  );
}

function FAQItem({ faq, delay }: { faq: { q: string; a: string }; delay: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

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
  );
}

function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── EspacesPage ─────────────────────────────────────────────────────────────

function EspacesPage({ goTo }: { goTo: (p: CoworkPage) => void }) {
  const spaces = [
    {
      id: "openspace",
      name: "Open Space",
      tagline: "Hot desks & accès flexible",
      photo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop",
      capacity: "Jusqu'à 60 personnes",
      hours: "Lun–Ven 9h–19h",
      equipment: ["WiFi 1 Gbps", "Café illimité", "Casier disponible", "Espaces de détente", "Impression 20 pages/j"],
      cta: "Réserver un Day Pass",
      target: "tarifs" as CoworkPage,
    },
    {
      id: "bureau-dedie",
      name: "Bureau Dédié",
      tagline: "Bureau fermé 1–4 personnes",
      photo: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80&fit=crop",
      capacity: "1 à 4 personnes",
      hours: "Accès 24h/24 7j/7",
      equipment: ["Adresse domiciliation", "Gestion courrier", "Accès 24/7", "Téléphone dédié", "Impression illimitée"],
      cta: "Réserver ce bureau",
      target: "tarifs" as CoworkPage,
    },
    {
      id: "salle-reunion",
      name: "Salle de Réunion",
      tagline: "4 à 12 personnes",
      photo: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80&fit=crop",
      capacity: "4 à 12 personnes",
      hours: "Réservation à l'heure",
      equipment: ["Écran 75\"", "Visioconférence HD", "Tableau blanc", "Système son", "Café & eau inclus"],
      cta: "Réserver à l'heure",
      target: "tarifs" as CoworkPage,
    },
    {
      id: "studio-podcast",
      name: "Studio Podcast",
      tagline: "Isolation acoustique totale",
      photo: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop",
      capacity: "1 à 4 personnes",
      hours: "Sur réservation",
      equipment: ["Isolation acoustique", "Micro professionnel", "Table de mixage", "Streaming live", "Enregistrement HD"],
      cta: "Réserver le studio",
      target: "contact" as CoworkPage,
    },
    {
      id: "espace-event",
      name: "Espace Événement",
      tagline: "Jusqu'à 150 personnes",
      photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop",
      capacity: "150 personnes debout",
      hours: "Sur réservation",
      equipment: ["Scène modulable", "Système son professionnel", "Vidéoprojecteur 4K", "Catering possible", "Équipe technique"],
      cta: "Organiser un événement",
      target: "contact" as CoworkPage,
    },
  ];

  return (
    <div style={{ padding: "80px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accentLight,
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 16,
              }}
            >
              <Building2 size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Nos Espaces</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 800,
                color: C.slate,
                marginBottom: 16,
              }}
            >
              Des espaces pensés pour votre productivité
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Du hot desk au studio podcast, chaque espace est conçu pour que vous soyez dans les meilleures conditions de travail.
            </p>
          </div>
        </SectionReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {spaces.map((space, i) => (
            <SectionReveal key={space.id} delay={i * 0.1}>
              <div
                style={{
                  background: C.white,
                  borderRadius: 24,
                  overflow: "hidden",
                  border: `1px solid ${C.border}`,
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
                  direction: i % 2 !== 0 ? "rtl" : "ltr",
                }}
              >
                <div style={{ direction: "ltr" }}>
                  <img
                    src={space.photo}
                    alt={space.name}
                    loading="lazy"
                    style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "center", direction: "ltr" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: C.accentLight,
                      borderRadius: 20,
                      padding: "4px 12px",
                      marginBottom: 12,
                      alignSelf: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.accentDark }}>{space.tagline}</span>
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.slate, marginBottom: 8 }}>{space.name}</h2>
                  <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                    <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                      <Users size={13} /> {space.capacity}
                    </span>
                    <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={13} /> {space.hours}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                    {space.equipment.map((eq) => (
                      <div key={eq} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: C.accentLight,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Check size={10} color={C.accent} />
                        </div>
                        <span style={{ fontSize: 14, color: C.text }}>{eq}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo(space.target)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: C.accent,
                      color: C.white,
                      padding: "12px 24px",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 15,
                      border: "none",
                      cursor: "pointer",
                      alignSelf: "flex-start",
                    }}
                  >
                    {space.cta} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TarifsPage ──────────────────────────────────────────────────────────────

function TarifsPage({ goTo }: { goTo: (p: CoworkPage) => void }) {
  const [billing, setBilling] = useState<"mensuel" | "annuel">("mensuel");

  const plans = [
    {
      name: "Day Pass",
      price: billing === "mensuel" ? "25" : "21",
      period: "jour",
      features: ["Open Space (hot desk)", "Café inclus", "WiFi 1 Gbps", "Accès 9h–19h", "Espace lounge"],
      cta: "Essayer",
      highlight: false,
      note: null,
    },
    {
      name: "Hot Desk",
      price: billing === "mensuel" ? "180" : "153",
      period: "mois",
      features: [
        "5 jours/semaine",
        "Casier dédié",
        "Adresse postale",
        "Café illimité",
        "4h réunion/mois",
        "Événements communauté",
      ],
      cta: "Commencer",
      highlight: true,
      note: "Populaire",
    },
    {
      name: "Bureau Fixe Solo",
      price: billing === "mensuel" ? "350" : "298",
      period: "mois",
      features: [
        "Bureau attitré 24/7",
        "Adresse domiciliation",
        "10h réunion/mois",
        "Café illimité",
        "Impression illimitée",
        "2 accès invités/mois",
      ],
      cta: "Réserver",
      highlight: false,
      note: null,
    },
    {
      name: "Bureau Équipe (2–4p)",
      price: billing === "mensuel" ? "650" : "553",
      period: "mois",
      features: [
        "Bureau privatif fermé",
        "Domiciliation incluse",
        "Réunions illimitées",
        "Support prioritaire",
        "Accès 24/7",
        "Personnalisation espace",
      ],
      cta: "Réserver",
      highlight: false,
      note: null,
    },
  ];

  const meetingRoom = {
    heure: "35",
    demiJournee: "120",
    journee: "200",
  };

  const comparisonFeatures = [
    { feature: "Open Space / hot desk", dayPass: true, hotDesk: true, solo: true, equipe: true },
    { feature: "Café illimité", dayPass: true, hotDesk: true, solo: true, equipe: true },
    { feature: "WiFi 1 Gbps", dayPass: true, hotDesk: true, solo: true, equipe: true },
    { feature: "Casier dédié", dayPass: false, hotDesk: true, solo: true, equipe: true },
    { feature: "Adresse domiciliation", dayPass: false, hotDesk: false, solo: true, equipe: true },
    { feature: "Accès 24/7", dayPass: false, hotDesk: false, solo: true, equipe: true },
    { feature: "Bureau privatif", dayPass: false, hotDesk: false, solo: false, equipe: true },
    { feature: "Réunions illimitées", dayPass: false, hotDesk: false, solo: false, equipe: true },
  ];

  return (
    <div style={{ padding: "80px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accentLight,
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 16,
              }}
            >
              <Zap size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Tarifs transparents</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
              Choisissez votre formule
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Sans frais cachés. Sans engagement annuel obligatoire. Résiliez avec 30 jours de préavis.
            </p>

            {/* Toggle mensuel / annuel */}
            <div
              style={{
                display: "inline-flex",
                background: C.bgAlt,
                borderRadius: 40,
                padding: 4,
                border: `1px solid ${C.border}`,
              }}
            >
              {(["mensuel", "annuel"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBilling(b)}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 36,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: billing === b ? C.slate : "transparent",
                    color: billing === b ? C.white : C.textMuted,
                    transition: "all 0.2s",
                  }}
                >
                  {b === "mensuel" ? "Mensuel" : "Annuel −15%"}
                </button>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Essai gratuit banner */}
        <SectionReveal delay={0.1}>
          <div
            style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              borderRadius: 16,
              padding: "20px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 40,
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Star size={20} color={C.white} fill={C.white} />
              <span style={{ fontWeight: 700, fontSize: 16, color: C.white }}>
                Essai gratuit — 1 journée offerte sur présentation de votre projet
              </span>
            </div>
            <button
              type="button"
              onClick={() => goTo("contact")}
              style={{
                background: C.white,
                color: C.accentDark,
                padding: "10px 20px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              En profiter
            </button>
          </div>
        </SectionReveal>

        {/* Plans grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginBottom: 72,
          }}
        >
          {plans.map((plan, i) => (
            <SectionReveal key={plan.name} delay={i * 0.1}>
              <div
                style={{
                  background: plan.highlight ? C.slate : C.white,
                  borderRadius: 20,
                  padding: 32,
                  border: plan.highlight ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {plan.note && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: C.accent,
                      color: C.white,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 30,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {plan.note}
                  </div>
                )}
                <h3 style={{ fontSize: 17, fontWeight: 700, color: plan.highlight ? C.white : C.slate, marginBottom: 8 }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 38, fontWeight: 900, color: plan.highlight ? C.accent : C.slate }}>
                    {plan.price}€
                  </span>
                  <span style={{ fontSize: 13, color: plan.highlight ? "#94a3b8" : C.textMuted, marginLeft: 4 }}>
                    /{plan.period}
                  </span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: plan.highlight ? `${C.accent}30` : C.accentLight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Check size={10} color={C.accent} />
                      </div>
                      <span style={{ fontSize: 13, color: plan.highlight ? "#cbd5e1" : C.text }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => goTo("contact")}
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: plan.highlight ? C.accent : C.accentLight,
                    color: plan.highlight ? C.white : C.accentDark,
                    padding: "13px 20px",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 14,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Bureau entreprise */}
        <SectionReveal delay={0.15}>
          <div
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: "32px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 64,
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Grand compte
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: C.slate, marginBottom: 8 }}>Bureau Entreprise (5–10 personnes)</h3>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 520 }}>
                Solution sur mesure : espace privatif personnalisé, SLA dédié, facturation consolidée, gestionnaire de compte attitré.
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 12 }}>Tarif sur devis</div>
              <button
                type="button"
                onClick={() => goTo("contact")}
                style={{
                  background: C.slate,
                  color: C.white,
                  padding: "12px 24px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Nous contacter
              </button>
            </div>
          </div>
        </SectionReveal>

        {/* Salle de réunion */}
        <SectionReveal delay={0.2}>
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Salle de Réunion — à la carte</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { label: "À l'heure", price: `${meetingRoom.heure}€/h`, desc: "Réservation flexible, disponibilité en temps réel" },
                { label: "Demi-journée", price: `${meetingRoom.demiJournee}€`, desc: "4h consécutives, café inclus" },
                { label: "Journée complète", price: `${meetingRoom.journee}€`, desc: "8h, repas partenaire disponible" },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, marginBottom: 8 }}>{r.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: C.slate, marginBottom: 6 }}>{r.price}</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Tableau comparatif */}
        <SectionReveal delay={0.25}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Tableau comparatif</h2>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.bgAlt }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontSize: 13, fontWeight: 700, color: C.textMuted }}>Fonctionnalité</th>
                  {["Day Pass", "Hot Desk", "Solo", "Équipe"].map((h) => (
                    <th key={h} style={{ padding: "16px 20px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.slate }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={row.feature} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : `${C.bg}80` }}>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: C.text }}>{row.feature}</td>
                    {[row.dayPass, row.hotDesk, row.solo, row.equipe].map((val, j) => (
                      <td key={j} style={{ padding: "14px 20px", textAlign: "center" }}>
                        {val ? (
                          <Check size={16} color={C.accent} style={{ margin: "0 auto" }} />
                        ) : (
                          <span style={{ color: C.border, fontSize: 16 }}>—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

// ─── ServicesPage ─────────────────────────────────────────────────────────────

function ServicesPage() {
  const services = [
    {
      icon: MessageSquare,
      title: "Conciergerie",
      color: "#3b82f6",
      items: [
        "Réception courrier & colis",
        "Accueil visiteurs",
        "Secrétariat mutualisé",
        "Mise à disposition de salle",
        "Service coursier sur demande",
      ],
    },
    {
      icon: Wifi,
      title: "IT & Télécom",
      color: C.accent,
      items: [
        "Fibre 1 Gbps redondante",
        "VPN privé disponible",
        "Impression / scan / copie",
        "Support technique on-site",
        "Réseau invité séparé",
      ],
    },
    {
      icon: Bike,
      title: "Bien-être",
      color: "#ec4899",
      items: [
        "Salle de sport partenaire",
        "Vélos en libre-service",
        "Douches & vestiaires",
        "Espace détente & terrasse",
        "Méditation guidée hebdo",
      ],
    },
    {
      icon: Coffee,
      title: "Restauration",
      color: "#f59e0b",
      items: [
        "Machine café premium",
        "Cuisine équipée partagée",
        "Livraison déjeuner partenaire",
        "Micro-marchés en libre-service",
        "Fontaine eau pétillante",
      ],
    },
    {
      icon: FileText,
      title: "Domiciliation",
      color: "#8b5cf6",
      items: [
        "Adresse commerciale Paris",
        "Gestion courrier complète",
        "KBIS compatible",
        "Numérisation sur demande",
        "Archivage sécurisé",
      ],
    },
    {
      icon: PartyPopper,
      title: "Événements & Communauté",
      color: "#14b8a6",
      items: [
        "Afterworks mensuels",
        "Workshops & formations",
        "Pitch sessions",
        "Meetups tech & business",
        "Réseau alumni actif",
      ],
    },
  ];

  return (
    <div style={{ padding: "80px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accentLight,
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 16,
              }}
            >
              <Zap size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Services inclus</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
              Tout ce dont vous avez besoin
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Pas de frais cachés, pas de suppléments. Tous nos services sont inclus dans votre abonnement dès le premier jour.
            </p>
          </div>
        </SectionReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <SectionReveal key={service.title} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: `${service.color}18`,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Icon size={24} color={service.color} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: C.slate, marginBottom: 16 }}>{service.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    {service.items.map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: service.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 14, color: C.text }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <SectionReveal delay={0.3}>
          <div
            style={{
              marginTop: 72,
              background: C.slate,
              borderRadius: 24,
              padding: "48px 56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
            }}
          >
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 12 }}>
                Prêt à rejoindre la communauté ?
              </h2>
              <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 480 }}>
                Tous ces services sont inclus dans nos abonnements. Pas de surprises sur votre facture.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0 })}
                style={{
                  background: C.accent,
                  color: C.white,
                  padding: "14px 28px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Voir les tarifs
              </button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

// ─── CommunautePage ───────────────────────────────────────────────────────────

function CommunautePage({ goTo }: { goTo: (p: CoworkPage) => void }) {
  const members = [
    { name: "Luminary SaaS", type: "Startup B2B", founding: "2023", avatar: "LS", color: "#3b82f6" },
    { name: "Sophie M.", type: "Freelance Design", founding: "2021", avatar: "SM", color: "#ec4899" },
    { name: "FinPath", type: "Scale-up Fintech", founding: "2020", avatar: "FP", color: "#8b5cf6" },
    { name: "Studio Krea", type: "Agence Créative", founding: "2022", avatar: "SK", color: "#f59e0b" },
    { name: "Marc Chen", type: "Consultant Stratégie", founding: "2019", avatar: "MC", color: "#14b8a6" },
    { name: "DataFlow", type: "Scale-up Data", founding: "2021", avatar: "DF", color: C.accent },
  ];

  const events = [
    {
      date: "19 Juin",
      title: "Workshop Design Thinking",
      type: "Workshop",
      attendees: 24,
      color: "#3b82f6",
      desc: "Méthodologie DT appliquée à votre produit. Animé par un expert UX senior.",
    },
    {
      date: "26 Juin",
      title: "Afterwork Networking",
      type: "Social",
      attendees: 60,
      color: C.accent,
      desc: "Cocktails, rencontres et bonne humeur. Mensuel et gratuit pour tous les membres.",
    },
    {
      date: "3 Juil.",
      title: "Pitch Day",
      type: "Business",
      attendees: 40,
      color: "#8b5cf6",
      desc: "5 minutes pour présenter votre projet à des investisseurs et mentors.",
    },
  ];

  const testimonials = [
    {
      name: "Amara Diallo",
      role: "Head of Growth, FinPath",
      avatar: "AD",
      text: "La communauté ici est unique. Deux partenariats et une mise en relation investisseur sont directement sortis de connexions faites dans le lounge.",
    },
    {
      name: "Sophie Marchand",
      role: "Co-fondatrice, Luminary SaaS",
      avatar: "SM",
      text: "Nous sommes passés de 2 à 14 personnes en 18 mois grâce à l'écosystème. La flexibilité d'évoluer sans déménager a été déterminante.",
    },
    {
      name: "Marc Chen",
      role: "Consultant Stratégie",
      avatar: "MC",
      text: "Je signe 40% plus de contrats quand je reçois mes clients ici. L'atmosphère inspire le sérieux et l'ambition.",
    },
  ];

  return (
    <div style={{ padding: "80px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accentLight,
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 16,
              }}
            >
              <Users2 size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Notre communauté</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
              Plus qu'un espace — un écosystème
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              250+ membres, 80+ entreprises, 30+ nationalités. Un réseau vivant d'entrepreneurs, freelances et scale-ups.
            </p>
          </div>
        </SectionReveal>

        {/* Stats */}
        <SectionReveal delay={0.1}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              marginBottom: 72,
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: "28px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 900, color: C.accent, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 14, color: C.textMuted, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Featured members */}
        <SectionReveal delay={0.15}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Membres à la une</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 72 }}>
            {members.map((m, i) => (
              <div
                key={m.name}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${m.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 15,
                    color: m.color,
                    flexShrink: 0,
                  }}
                >
                  {m.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.slate }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{m.type}</div>
                  <div style={{ fontSize: 12, color: C.accent, marginTop: 2 }}>Membre depuis {m.founding}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Upcoming events */}
        <SectionReveal delay={0.2}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Prochains événements</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 72 }}>
            {events.map((ev) => (
              <div
                key={ev.title}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div
                    style={{
                      background: `${ev.color}18`,
                      color: ev.color,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 20,
                    }}
                  >
                    {ev.type}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>{ev.date}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.slate }}>{ev.title}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{ev.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <Users size={13} color={C.textMuted} />
                  <span style={{ fontSize: 13, color: C.textMuted }}>{ev.attendees} participants attendus</span>
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Testimonials */}
        <SectionReveal delay={0.25}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Ils en parlent</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 64 }}>
            {testimonials.map((t) => (
              <div
                key={t.name}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={C.accent} color={C.accent} />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.75, flex: 1 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: C.accentLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      color: C.accentDark,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.slate }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* CTA rejoindre */}
        <SectionReveal delay={0.3}>
          <div
            style={{
              background: `linear-gradient(135deg, ${C.slate}, ${C.slateMid})`,
              borderRadius: 24,
              padding: "56px 64px",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, marginBottom: 16 }}>
              Rejoignez la communauté
            </h2>
            <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.7 }}>
              250 membres vous attendent. Venez travailler, créer des connexions et grandir ensemble.
            </p>
            <button
              type="button"
              onClick={() => goTo("tarifs")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accent,
                color: C.white,
                padding: "16px 36px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
              }}
            >
              Voir les tarifs <ArrowRight size={18} />
            </button>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

// ─── ContactPage ──────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", objet: "visite", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div style={{ padding: "80px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accentLight,
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 16,
              }}
            >
              <MapPin size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Nous contacter</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
              Venez nous rendre visite
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              Notre équipe est disponible pour vous accueillir, répondre à vos questions et organiser une visite.
            </p>
          </div>
        </SectionReveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
          {/* Infos */}
          <SectionReveal delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {/* Adresse */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.slate, marginBottom: 12 }}>Adresse</h3>
                <div
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <MapPin size={20} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6 }}>
                        Adresse communiquée sur demande à{" "}
                        <a href="mailto:contact@aevia.io" style={{ color: C.accent, fontWeight: 600 }}>
                          contact@aevia.io
                        </a>
                      </p>
                      <p style={{ fontSize: 13, color: C.textMuted, marginTop: 8 }}>
                        Paris — accès métro, RER et parking disponible
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.slate, marginBottom: 12 }}>Coordonnées</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { icon: Mail, label: "contact@aevia.io", href: "mailto:contact@aevia.io" },
                    { icon: Phone, label: "+33 1 23 45 67 89", href: "tel:+33123456789" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          background: C.white,
                          border: `1px solid ${C.border}`,
                          borderRadius: 12,
                          padding: "16px 20px",
                          textDecoration: "none",
                          color: C.text,
                        }}
                      >
                        <Icon size={18} color={C.accent} />
                        <span style={{ fontSize: 15, fontWeight: 500 }}>{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Horaires */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.slate, marginBottom: 12 }}>Horaires</h3>
                <div
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 16,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {[
                    { label: "Accueil & réception", hours: "Lun–Ven 9h–19h" },
                    { label: "Membres permanents", hours: "24h/24 — 7j/7" },
                    { label: "Support email", hours: "Réponse sous 2h" },
                  ].map((h) => (
                    <div key={h.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, color: C.textMuted }}>{h.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Form */}
          <SectionReveal delay={0.15}>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: 40,
              }}
            >
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      background: C.accentLight,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <Check size={28} color={C.accent} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: C.slate, marginBottom: 10 }}>Message envoyé !</h3>
                  <p style={{ fontSize: 15, color: C.textMuted }}>
                    Notre équipe vous répondra dans les 2 heures ouvrées.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.slate, marginBottom: 24 }}>
                    Réserver une visite ou nous écrire
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        placeholder="Sophie Marchand"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: 10,
                          border: `1px solid ${C.border}`,
                          fontSize: 15,
                          outline: "none",
                          boxSizing: "border-box",
                          fontFamily: "'Outfit', system-ui",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="sophie@startup.io"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: 10,
                          border: `1px solid ${C.border}`,
                          fontSize: 15,
                          outline: "none",
                          boxSizing: "border-box",
                          fontFamily: "'Outfit', system-ui",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>
                        Objet
                      </label>
                      <select
                        value={form.objet}
                        onChange={(e) => setForm({ ...form, objet: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: 10,
                          border: `1px solid ${C.border}`,
                          fontSize: 15,
                          outline: "none",
                          background: C.white,
                          boxSizing: "border-box",
                          fontFamily: "'Outfit', system-ui",
                        }}
                      >
                        <option value="visite">Réserver une visite (30 min)</option>
                        <option value="tarif">Question tarif</option>
                        <option value="essai">Journée d'essai gratuite</option>
                        <option value="event">Organiser un événement</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Bonjour, je souhaite..."
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: 10,
                          border: `1px solid ${C.border}`,
                          fontSize: 15,
                          outline: "none",
                          resize: "vertical",
                          boxSizing: "border-box",
                          fontFamily: "'Outfit', system-ui",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        background: C.accent,
                        color: C.white,
                        padding: "14px 28px",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 15,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      Envoyer <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}

// ─── LegalPage ────────────────────────────────────────────────────────────────

function LegalPage({ type }: { type: "mentions" | "privacy" }) {
  return (
    <div style={{ padding: "80px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <SectionReveal>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.slate, marginBottom: 8 }}>
            {type === "mentions" ? "Mentions légales" : "Politique de confidentialité"}
          </h1>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 48 }}>Dernière mise à jour : juin 2026</p>

          {type === "mentions" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                {
                  title: "Éditeur du site",
                  content:
                    "Aevia WS — SIREN 852 546 225\nAuto-entrepreneur\nEmail : contact@aevia.io\nAdresse du siège social communiquée sur demande.",
                },
                {
                  title: "Hébergement",
                  content: "Vercel Inc.\n340 Pine Street, Suite 701\nSan Francisco, CA 94104 — États-Unis\nhttps://vercel.com",
                },
                {
                  title: "Responsable de publication",
                  content: "Le responsable de publication est le gérant d'Aevia WS. Pour tout contact : contact@aevia.io",
                },
                {
                  title: "Propriété intellectuelle",
                  content:
                    "L'ensemble du contenu de ce site (textes, images, visuels) est la propriété exclusive d'Aevia WS, sauf mention contraire. Toute reproduction est interdite sans autorisation écrite préalable.",
                },
                {
                  title: "Limitation de responsabilité",
                  content:
                    "Aevia WS s'efforce d'assurer l'exactitude des informations diffusées sur ce site, mais ne peut garantir leur exhaustivité. Aevia WS ne saurait être tenu responsable des dommages résultant de l'utilisation de ce site.",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: C.slate, marginBottom: 12 }}>{section.title}</h2>
                  <div
                    style={{
                      background: C.white,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      padding: 24,
                      fontSize: 15,
                      color: C.text,
                      lineHeight: 1.75,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                {
                  title: "Données collectées",
                  content:
                    "Nous collectons uniquement les données que vous nous transmettez volontairement via le formulaire de contact (nom, email, message). Aucune donnée n'est collectée automatiquement sans votre consentement.",
                },
                {
                  title: "Utilisation des données",
                  content:
                    "Vos données sont utilisées exclusivement pour répondre à vos demandes. Elles ne sont jamais vendues, partagées ou cédées à des tiers à des fins commerciales.",
                },
                {
                  title: "Conservation",
                  content:
                    "Les données sont conservées pendant 3 ans à compter du dernier contact, puis supprimées automatiquement.",
                },
                {
                  title: "Vos droits",
                  content:
                    "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits : contact@aevia.io",
                },
                {
                  title: "Cookies",
                  content:
                    "Ce site n'utilise pas de cookies de tracking tiers. Seuls des cookies techniques strictement nécessaires au fonctionnement du site peuvent être déposés.",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: C.slate, marginBottom: 12 }}>{section.title}</h2>
                  <div
                    style={{
                      background: C.white,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      padding: 24,
                      fontSize: 15,
                      color: C.text,
                      lineHeight: 1.75,
                    }}
                  >
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionReveal>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function NexusHubPage() {
  const [page, setPage] = useState<CoworkPage>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (p: CoworkPage) => {
    setPage(p);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const navLinks: { label: string; page: CoworkPage }[] = [
    { label: "Nos Espaces", page: "espaces" },
    { label: "Tarifs", page: "tarifs" },
    { label: "Services", page: "services" },
    { label: "Communauté", page: "communaute" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Outfit', system-ui, sans-serif",
        background: C.bg,
        color: C.text,
        overflowX: "clip",
      }}
    >
      {/* ── NAVBAR (always visible) ─────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          padding: "0 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 72,
            gap: 40,
          }}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => goTo("home")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: C.accent,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={20} color={C.white} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: C.slate }}>Nexus Hub</span>
          </button>

          <div style={{ flex: 1 }} />

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {navLinks.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => goTo(item.page)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 15,
                  fontWeight: page === item.page ? 700 : 500,
                  color: page === item.page ? C.accent : C.textMuted,
                  cursor: "pointer",
                  padding: "4px 0",
                  borderBottom: page === item.page ? `2px solid ${C.accent}` : "2px solid transparent",
                  transition: "color 0.15s",
                  fontFamily: "'Outfit', system-ui",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo("tarifs")}
            style={{
              background: C.accent,
              color: C.white,
              padding: "10px 22px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              fontFamily: "'Outfit', system-ui",
            }}
          >
            Réserver
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} color={C.slate} /> : <Menu size={24} color={C.slate} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            style={{
              background: C.white,
              borderTop: `1px solid ${C.border}`,
              padding: "16px 5%",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {navLinks.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => goTo(item.page)}
                style={{
                  background: page === item.page ? C.accentLight : "none",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  color: page === item.page ? C.accentDark : C.text,
                  cursor: "pointer",
                  padding: "12px 16px",
                  borderRadius: 10,
                  textAlign: "left",
                  fontFamily: "'Outfit', system-ui",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── PAGE CONTENT ──────────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 72 }}>
        {page === "espaces" && <EspacesPage goTo={goTo} />}
        {page === "tarifs" && <TarifsPage goTo={goTo} />}
        {page === "services" && <ServicesPage />}
        {page === "communaute" && <CommunautePage goTo={goTo} />}
        {page === "contact" && <ContactPage />}
        {page === "mentions" && <LegalPage type="mentions" />}
        {page === "privacy" && <LegalPage type="privacy" />}

        {page === "home" && (
          <>
            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section
              ref={heroRef}
              style={{
                position: "relative",
                minHeight: "calc(100vh - 72px)",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                background: C.slate,
              }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  y: heroY,
                  backgroundImage: `radial-gradient(${C.accent}18 1px, transparent 1px)`,
                  backgroundSize: "32px 32px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "5%",
                  right: "0%",
                  width: 600,
                  height: 600,
                  background: `radial-gradient(circle, ${C.accent}28 0%, transparent 70%)`,
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />

              <motion.div
                style={{
                  position: "relative",
                  zIndex: 2,
                  maxWidth: 1200,
                  margin: "0 auto",
                  padding: "80px 5%",
                  width: "100%",
                  opacity: heroOpacity,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 80,
                    alignItems: "center",
                  }}
                >
                  {/* Left: Copy */}
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: `${C.accent}22`,
                        border: `1px solid ${C.accent}44`,
                        borderRadius: 30,
                        padding: "6px 16px",
                        marginBottom: 28,
                      }}
                    >
                      <Zap size={14} color={C.accent} />
                      <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>
                        Ouvert — expansion niveau 3 terminée
                      </span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                      style={{
                        fontSize: "clamp(40px, 5vw, 66px)",
                        fontWeight: 800,
                        color: C.white,
                        lineHeight: 1.1,
                        marginBottom: 24,
                      }}
                    >
                      Travaillez là où{" "}
                      <span style={{ color: C.accent }}>l'ambition</span>{" "}
                      prend vie
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.25 }}
                      style={{
                        fontSize: 18,
                        color: "#94a3b8",
                        lineHeight: 1.75,
                        marginBottom: 40,
                        maxWidth: 480,
                      }}
                    >
                      Un espace de coworking premium à Paris. Hot desks, bureaux dédiés, salles de réunion, studio podcast — et une communauté pensée pour grandir.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.35 }}
                      style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
                    >
                      <button
                        type="button"
                        onClick={() => goTo("tarifs")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          background: C.accent,
                          color: C.white,
                          padding: "16px 32px",
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 16,
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "'Outfit', system-ui",
                        }}
                      >
                        Day Pass — 25€ <ArrowRight size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo("espaces")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          background: "transparent",
                          color: C.white,
                          padding: "16px 32px",
                          borderRadius: 10,
                          fontWeight: 600,
                          fontSize: 16,
                          border: "1.5px solid rgba(255,255,255,0.25)",
                          cursor: "pointer",
                          fontFamily: "'Outfit', system-ui",
                        }}
                      >
                        Nos espaces
                      </button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{ display: "flex", gap: 40, marginTop: 52 }}
                    >
                      {STATS.slice(0, 3).map((s) => (
                        <div key={s.label}>
                          <div style={{ fontSize: 26, fontWeight: 800, color: C.accent }}>{s.value}</div>
                          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Right: Floor plan */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <div
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 20,
                        padding: 24,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <Layers size={16} color={C.accent} />
                        <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>
                          Plan interactif — Niveau 2
                        </span>
                      </div>
                      <FloorPlan />
                      <p style={{ marginTop: 12, fontSize: 12, color: "#475569", textAlign: "center" }}>
                        Survolez les zones pour explorer les espaces
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* ── SPACE TYPES ───────────────────────────────────────────────── */}
            <section style={{ padding: "100px 5%", background: C.bg }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <SectionReveal>
                  <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: C.accentLight,
                        borderRadius: 30,
                        padding: "6px 16px",
                        marginBottom: 16,
                      }}
                    >
                      <Building2 size={14} color={C.accentDark} />
                      <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Nos Espaces</span>
                    </div>
                    <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
                      Un espace pour chaque façon de travailler
                    </h2>
                    <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                      Du Day Pass spontané au bureau privatif permanent — Nexus Hub s'adapte à votre rythme.
                    </p>
                  </div>
                </SectionReveal>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
                  {SPACE_TYPES.map((space, i) => (
                    <SectionReveal key={space.name} delay={i * 0.12}>
                      <div
                        style={{
                          background: C.white,
                          borderRadius: 20,
                          padding: 36,
                          border: `1px solid ${C.border}`,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "box-shadow 0.2s, transform 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.10)";
                          el.style.transform = "translateY(-4px)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.boxShadow = "none";
                          el.style.transform = "translateY(0)";
                        }}
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            background: C.accentLight,
                            borderRadius: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 20,
                            fontSize: 16,
                            fontWeight: 800,
                            color: C.accentDark,
                          }}
                        >
                          {space.icon}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: C.accent,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 8,
                          }}
                        >
                          {space.tagline}
                        </div>
                        <h3 style={{ fontSize: 24, fontWeight: 800, color: C.slate, marginBottom: 14 }}>{space.name}</h3>
                        <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, flex: 1 }}>{space.desc}</p>
                        <div
                          style={{
                            marginTop: 28,
                            paddingTop: 24,
                            borderTop: `1px solid ${C.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <span style={{ fontSize: 13, color: C.textMuted }}>À partir de </span>
                            <span style={{ fontSize: 28, fontWeight: 800, color: C.slate }}>{space.from}€</span>
                            <span style={{ fontSize: 13, color: C.textMuted }}>/{space.perDay ? "jour" : "mois"}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => goTo("tarifs")}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              background: C.accentLight,
                              color: C.accentDark,
                              padding: "10px 18px",
                              borderRadius: 8,
                              fontWeight: 600,
                              fontSize: 14,
                              border: "none",
                              cursor: "pointer",
                              fontFamily: "'Outfit', system-ui",
                            }}
                          >
                            Voir les formules <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ── AMENITIES ─────────────────────────────────────────────────── */}
            <section style={{ padding: "100px 5%", background: C.slate }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <SectionReveal>
                  <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.white, marginBottom: 16 }}>
                      Tout est inclus, dès le premier jour
                    </h2>
                    <p style={{ fontSize: 17, color: "#94a3b8", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                      Pas de frais cachés. Chaque équipement fait partie de votre abonnement.
                    </p>
                  </div>
                </SectionReveal>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                  {AMENITIES.map((a, i) => (
                    <SectionReveal key={a.label} delay={i * 0.08}>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          borderRadius: 16,
                          padding: 28,
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                          transition: "all 0.2s",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = `${C.accent}18`;
                          el.style.borderColor = `${C.accent}50`;
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "rgba(255,255,255,0.05)";
                          el.style.borderColor = "rgba(255,255,255,0.09)";
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            background: `${C.accent}20`,
                            borderRadius: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <a.icon size={22} color={C.accent} />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: C.white }}>{a.label}</div>
                        <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{a.desc}</div>
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ── STATS BAND ────────────────────────────────────────────────── */}
            <section style={{ padding: "80px 5%", background: C.accent }}>
              <div
                style={{
                  maxWidth: 1200,
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 40,
                }}
              >
                {STATS.map((s, i) => (
                  <SectionReveal key={s.label} delay={i * 0.1}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, color: C.white }}>{s.value}</div>
                      <div style={{ fontSize: 15, color: "#dcfce7", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </section>

            {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
            <section style={{ padding: "100px 5%", background: C.bg }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <SectionReveal>
                  <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: C.accentLight,
                        borderRadius: 30,
                        padding: "6px 16px",
                        marginBottom: 16,
                      }}
                    >
                      <Users2 size={14} color={C.accentDark} />
                      <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Témoignages membres</span>
                    </div>
                    <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
                      Rejoignez 250+ membres satisfaits
                    </h2>
                  </div>
                </SectionReveal>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
                  {TESTIMONIALS.map((t, i) => (
                    <SectionReveal key={t.name} delay={i * 0.1}>
                      <div
                        style={{
                          background: C.white,
                          borderRadius: 20,
                          padding: 32,
                          border: `1px solid ${C.border}`,
                          display: "flex",
                          flexDirection: "column",
                          gap: 20,
                        }}
                      >
                        <div style={{ display: "flex", gap: 4 }}>
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <Star key={j} size={16} fill={C.accent} color={C.accent} />
                          ))}
                        </div>
                        <p style={{ fontSize: 15, color: C.text, lineHeight: 1.75, flex: 1 }}>"{t.text}"</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: "50%",
                              background: C.accentLight,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 14,
                              color: C.accentDark,
                              flexShrink: 0,
                            }}
                          >
                            {t.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: C.slate }}>{t.name}</div>
                            <div style={{ fontSize: 13, color: C.textMuted }}>{t.role}</div>
                          </div>
                        </div>
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ── PRICING ───────────────────────────────────────────────────── */}
            <section style={{ padding: "100px 5%", background: C.bgAlt }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <SectionReveal>
                  <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
                      Des tarifs simples et transparents
                    </h2>
                    <p style={{ fontSize: 17, color: C.textMuted }}>
                      Sans frais d'installation. Sans engagement annuel obligatoire.{" "}
                      <button
                        type="button"
                        onClick={() => goTo("tarifs")}
                        style={{
                          color: C.accent,
                          fontWeight: 700,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 17,
                          textDecoration: "underline",
                          fontFamily: "'Outfit', system-ui",
                        }}
                      >
                        Voir tous les tarifs
                      </button>
                    </p>
                  </div>
                </SectionReveal>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                  {PLANS_FR.map((plan, i) => (
                    <SectionReveal key={plan.name} delay={i * 0.1}>
                      <div
                        style={{
                          background: plan.highlight ? C.slate : C.white,
                          borderRadius: 20,
                          padding: 32,
                          border: plan.highlight ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          overflow: "hidden",
                          height: "100%",
                        }}
                      >
                        {plan.highlight && (
                          <div
                            style={{
                              position: "absolute",
                              top: 16,
                              right: 16,
                              background: C.accent,
                              color: C.white,
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "4px 12px",
                              borderRadius: 30,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Populaire
                          </div>
                        )}
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: plan.highlight ? C.white : C.slate, marginBottom: 8 }}>
                          {plan.name}
                        </h3>
                        <div style={{ marginBottom: 24 }}>
                          <span style={{ fontSize: 40, fontWeight: 900, color: plan.highlight ? C.accent : C.slate }}>
                            {plan.priceMensuel}€
                          </span>
                          <span style={{ fontSize: 13, color: plan.highlight ? "#94a3b8" : C.textMuted, marginLeft: 4 }}>
                            /{plan.period}
                          </span>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                          {plan.features.map((f) => (
                            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  background: plan.highlight ? `${C.accent}30` : C.accentLight,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Check size={11} color={C.accent} />
                              </div>
                              <span style={{ fontSize: 13, color: plan.highlight ? "#cbd5e1" : C.text }}>{f}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => goTo("contact")}
                          style={{
                            display: "block",
                            textAlign: "center",
                            background: plan.highlight ? C.accent : C.accentLight,
                            color: plan.highlight ? C.white : C.accentDark,
                            padding: "14px 24px",
                            borderRadius: 10,
                            fontWeight: 700,
                            fontSize: 15,
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "'Outfit', system-ui",
                          }}
                        >
                          {plan.cta}
                        </button>
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────────────────────── */}
            <section style={{ padding: "100px 5%", background: C.bg }}>
              <div style={{ maxWidth: 760, margin: "0 auto" }}>
                <SectionReveal>
                  <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: C.slate, marginBottom: 12 }}>
                      Questions fréquentes
                    </h2>
                    <p style={{ fontSize: 16, color: C.textMuted }}>
                      Vous ne trouvez pas la réponse ?{" "}
                      <button
                        type="button"
                        onClick={() => goTo("contact")}
                        style={{
                          color: C.accent,
                          fontWeight: 600,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 16,
                          fontFamily: "'Outfit', system-ui",
                        }}
                      >
                        Contactez-nous
                      </button>
                    </p>
                  </div>
                </SectionReveal>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {FAQS.map((faq, i) => (
                    <FAQItem key={i} faq={faq} delay={i * 0.07} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* ── FOOTER (always visible) ─────────────────────────────────────────── */}
      <footer style={{ background: C.slate, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 60,
              marginBottom: 60,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: C.accent,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Building2 size={20} color={C.white} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 20, color: C.white }}>Nexus Hub</span>
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75, maxWidth: 280 }}>
                Un espace de coworking premium à Paris où freelances, startups et scale-ups réalisent leurs meilleures ambitions.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[MessageSquare, Link2, Camera].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Icon size={16} color="#94a3b8" />
                  </a>
                ))}
              </div>
            </div>

            {/* Espaces */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Espaces
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(["espaces", "tarifs", "services"] as CoworkPage[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goTo(p)}
                    style={{
                      fontSize: 14,
                      color: "#94a3b8",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: 0,
                      fontFamily: "'Outfit', system-ui",
                      textTransform: "capitalize",
                    }}
                  >
                    {p === "espaces" ? "Nos espaces" : p === "tarifs" ? "Tarifs" : "Services"}
                  </button>
                ))}
              </div>
            </div>

            {/* Communauté */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Communauté
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(["communaute", "contact"] as CoworkPage[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goTo(p)}
                    style={{
                      fontSize: 14,
                      color: "#94a3b8",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: 0,
                      fontFamily: "'Outfit', system-ui",
                    }}
                  >
                    {p === "communaute" ? "Notre communauté" : "Contact"}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "contact@aevia.io",
                  "+33 1 23 45 67 89",
                  "Paris — sur demande",
                  "Lun–Ven 9h–19h",
                ].map((item) => (
                  <span key={item} style={{ fontSize: 14, color: "#94a3b8" }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <p style={{ fontSize: 13, color: "#475569" }}>
              © 2026 Aevia WS — SIREN 852 546 225. Tous droits réservés.
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => goTo("mentions")}
                style={{
                  fontSize: 13,
                  color: "#475569",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Outfit', system-ui",
                }}
              >
                Mentions légales
              </button>
              <button
                type="button"
                onClick={() => goTo("privacy")}
                style={{
                  fontSize: 13,
                  color: "#475569",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Outfit', system-ui",
                }}
              >
                Politique de confidentialité
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
