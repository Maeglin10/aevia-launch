// @ts-nocheck
"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Star,
  Check,
  ChevronDown,
  ChevronLeft,
  MapPin,
  Phone,
  Shield,
  Clock,
  Package,
  Truck,
  Home,
  Building2,
  Calendar,
  Users,
  MessageSquare,
  Link2,
  Camera,
  Zap,
  CheckCircle,
  Menu,
  X,
  Mail,
  Warehouse,
  BookOpen,
  ChevronRight,
} from "lucide-react";

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  bg: "#ffffff",
  bgAlt: "#f1f5f9",
  text: "#1e3a5f",
  textMuted: "#64748b",
  orange: "#ea580c",
  orangeLight: "#fff7ed",
  orangeDark: "#c2410c",
  navy: "#1e3a5f",
  navyLight: "#2d5282",
  white: "#ffffff",
  border: "#e2e8f0",
  borderLight: "#f8fafc",
};

// ─── Page type ────────────────────────────────────────────────────────────────
type MovePage = "home" | "services" | "devis" | "stockage" | "conseils" | "contact" | "mentions" | "privacy";

// ─── Static data ─────────────────────────────────────────────────────────────
const SERVICES_DATA = [
  {
    icon: Home,
    name: "Déménagement local",
    tagline: "Même ville",
    shortDesc: "Forfait à partir de 299 € — 2 déménageurs + camion 20 m³",
    desc: "Votre déménagement dans la même ville géré de A à Z : emballage des cartons fragiles, chargement soigné, transport sécurisé et installation dans votre nouveau logement.",
    features: ["2 déménageurs expérimentés", "Camion 20 m³ inclus", "Protection sol et murs", "Démontage/remontage meubles"],
    from: "299 €",
  },
  {
    icon: Truck,
    name: "Déménagement longue distance",
    tagline: "France entière",
    shortDesc: "Devis sur mesure — suivi GPS en temps réel",
    desc: "Nous couvrons toute la France métropolitaine. Votre mobilier est inventorié, assuré et livré à la date convenue, avec suivi GPS tout au long du trajet.",
    features: ["Suivi GPS en temps réel", "Date de livraison garantie", "Assurance valeur déclarée", "Stockage tampon disponible"],
    from: "Sur devis",
  },
  {
    icon: Building2,
    name: "Déménagement international",
    tagline: "Europe & monde",
    shortDesc: "Emballage douanes inclus — coordination sur mesure",
    desc: "Déménagement en Europe ou hors UE : gestion des formalités douanières, emballage export renforcé et coordination avec nos partenaires locaux à destination.",
    features: ["Assistance douanière incluse", "Emballage export renforcé", "Partenaires locaux à destination", "Assurance internationale"],
    from: "Sur devis",
  },
  {
    icon: Building2,
    name: "Déménagement d'entreprise",
    tagline: "Bureaux & locaux pro",
    shortDesc: "Planification dédiée — IT, mobilier, archives",
    desc: "Transferts de bureaux planifiés pour minimiser l'interruption d'activité. Inventaire détaillé, étiquetage, manutention IT et remise en place dans vos nouveaux locaux.",
    features: ["Chef de projet dédié", "Manutention matériel IT", "Interventions week-end/nuit", "Traçabilité complète des actifs"],
    from: "Sur devis",
  },
  {
    icon: Package,
    name: "Piano & objets précieux",
    tagline: "Manutention spécialisée",
    shortDesc: "Assurance renforcée — équipe certifiée",
    desc: "Pianos droits et à queue, œuvres d'art, antiquités, caves à vin, coffres-forts : notre équipe spécialisée prend en charge vos biens les plus précieux avec l'équipement adapté.",
    features: ["Équipe certifiée piano", "Sangles et chariots spéciaux", "Assurance valeur déclarée", "Conditionnement sur mesure"],
    from: "Sur devis",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Demandez un devis", desc: "Renseignez votre déménagement en ligne. Vous recevez une estimation ferme sous 2 h, sans surprise." },
  { step: "02", title: "Réservez votre date", desc: "Choisissez votre créneau. Nous confirmons votre équipe et le camion 48 h avant le jour J." },
  { step: "03", title: "Nous emballons & chargeons", desc: "Notre équipe arrive à l'heure, protège vos affaires et charge avec soin. Chaque article est documenté." },
  { step: "04", title: "Livré & installé", desc: "Nous livrons, déchargeons et installons vos meubles exactement où vous le souhaitez." },
];

const STATS = [
  { value: "18 400+", label: "Déménagements réussis" },
  { value: "47", label: "Départements couverts" },
  { value: "4,9", label: "Note moyenne" },
  { value: "12", label: "Ans d'expérience" },
];

const PRICING_CARDS = [
  {
    name: "Studio / T1",
    price: "299 €",
    suffix: "à partir de",
    period: "déménagement local",
    features: ["2 déménageurs", "Jusqu'à 4 h", "Camion inclus", "Protection de base", "Protection parquet"],
    highlight: false,
  },
  {
    name: "T2 / T3",
    price: "549 €",
    suffix: "à partir de",
    period: "déménagement local",
    features: ["3 déménageurs", "Jusqu'à 7 h", "Grand camion inclus", "Protection complète", "Démontage meubles", "Protection sols & murs", "3 cartons-penderies"],
    highlight: true,
  },
  {
    name: "T4 et plus",
    price: "899 €",
    suffix: "à partir de",
    period: "déménagement local",
    features: ["4 déménageurs", "Journée complète", "Camion 26 m³", "Protection premium", "Emballage complet", "Service blanc", "Coordinateur dédié", "Garde-meuble 30 j offerts"],
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Sophie Marchand",
    role: "Propriétaire, Paris 11e",
    avatar: "SM",
    rating: 5,
    text: "L'équipe a déménagé notre appartement de 4 pièces en 6 h chrono, sans aucun dommage. Professionnels, ponctuels et vraiment attentionnés. Je ne ferai plus jamais appel à quelqu'un d'autre.",
  },
  {
    name: "David Renaud",
    role: "DG, TechParis",
    avatar: "DR",
    rating: 5,
    text: "Ils ont déménagé nos 60 postes de travail pendant le week-end. Le lundi matin, tout était branché et étiqueté. Zéro interruption d'activité. Vraiment impressionnant.",
  },
  {
    name: "Lucie Fontaine",
    role: "Locataire, Lyon",
    avatar: "LF",
    rating: 5,
    text: "Déménagement Paris → Lyon en solo, j'avais peur de confier mes affaires. Suivi GPS tout au long du trajet, livraison 2 h en avance. Je recommande les yeux fermés.",
  },
];

const FAQS = [
  { q: "Combien de temps à l'avance dois-je réserver ?", a: "Pour un déménagement local, 1 à 2 semaines suffisent. Pour une longue distance ou un déménagement d'entreprise, prévoyez 3 à 4 semaines. Nous pouvons parfois intervenir en urgence sous 48 à 72 h selon les disponibilités." },
  { q: "Mes meubles sont-ils assurés pendant le transport ?", a: "Tous nos déménagements incluent une assurance responsabilité civile. Nous recommandons fortement l'assurance valeur déclarée qui couvre réparation ou remplacement à la valeur réelle. Demandez le détail à votre coordinateur." },
  { q: "Fournissez-vous les cartons et matériaux d'emballage ?", a: "Oui. Cartons, adhésif, papier bulle, couvertures de protection, cartons-penderies — tout le matériel est disponible. Le service emballage complet ou partiel est également proposé en option." },
  { q: "Quels objets ne pouvez-vous pas transporter ?", a: "Matières dangereuses (peinture, gaz), plantes (hors région), animaux vivants. Nous conseillons de transporter soi-même bijoux, espèces et documents importants. Votre coordinateur vous guidera lors de l'état des lieux." },
  { q: "Quelle est votre politique d'annulation ?", a: "Annulation gratuite jusqu'à 7 jours avant la date. Entre 3 et 7 jours : frais de 10 %. Moins de 72 h : frais de 25 %. Contactez-nous le plus tôt possible, nous trouvons toujours une solution." },
  { q: "Proposez-vous un garde-meuble si mon nouveau logement n'est pas disponible ?", a: "Oui, notre entrepôt sécurisé et climatisé peut accueillir vos affaires le temps nécessaire. Le premier mois est offert pour les déménagements T4+ locaux. Tarifs à partir de 79 €/mois." },
];

const STORAGE_BOXES = [
  { size: "5 m²", price: "79 €/mois", desc: "Idéal studio ou petite cave", features: ["Accès 7j/7 8h-20h", "Vidéosurveillance 24/7", "Climatisé", "Serrure personnelle"] },
  { size: "10 m²", price: "139 €/mois", desc: "Parfait pour un T2/T3", features: ["Accès 7j/7 8h-20h", "Vidéosurveillance 24/7", "Climatisé", "Serrure personnelle", "Rayonnages inclus"] },
  { size: "20 m²", price: "239 €/mois", desc: "Grande maison ou local pro", features: ["Accès 7j/7 8h-20h", "Vidéosurveillance 24/7", "Climatisé", "Serrure personnelle", "Rayonnages inclus", "Rampe de chargement"] },
];

const ARTICLES = [
  {
    id: 1,
    category: "Organisation",
    readTime: "5 min",
    title: "Comment préparer votre déménagement 8 semaines à l'avance",
    excerpt: "Une check-list semaine par semaine pour ne rien oublier et arriver serein le jour J.",
    full: `**Semaine 8 — Planifier**\nDécidez de la date, obtenez vos devis, réservez votre équipe. Prévenez votre employeur, votre école, votre banque.\n\n**Semaine 7 — Trier**\nFaites le tour de chaque pièce : donnez, vendez ou jetez ce que vous ne souhaitez plus emmener. Moins vous déménagez, moins c'est cher.\n\n**Semaine 6 — Commandez les cartons**\nPrévoyez large : 10 cartons par pièce en moyenne. Commandez aussi papier bulle, film étirable et marqueurs.\n\n**Semaines 5-4 — Emballez les affaires non courantes**\nLivres, décorations, vêtements hors-saison, photos. Étiquetez chaque carton : contenu + pièce de destination.\n\n**Semaine 3 — Démarches administratives**\nChangement d'adresse : La Poste, impôts, CAF, médecin, assurances, abonnements. Résiliez eau/gaz/électricité à l'ancienne adresse, ouvrez les contrats à la nouvelle.\n\n**Semaine 2 — Finaliser la logistique**\nConfirmez l'heure avec vos déménageurs, réservez les Monte-charge ou parkings si besoin, organisez la garde des enfants/animaux le jour J.\n\n**Veille — Préparer l'essentiel**\nPréparez un sac "premier jour" : draps, cafetière, chargeurs, médicaments, documents importants. Ce sac voyage avec vous, pas dans le camion.\n\n**Jour J — Superviser**\nSoyez présent pour l'état des lieux de départ et d'arrivée. Vérifiez chaque pièce avant le départ du camion.`,
  },
  {
    id: 2,
    category: "Emballage",
    readTime: "4 min",
    title: "Emballer sa vaisselle : les 5 erreurs à éviter",
    excerpt: "Une assiette fêlée est vite arrivée. Voici les pièges classiques et comment les contourner.",
    full: `**Erreur 1 — Utiliser des cartons trop grands**\nLes cartons volumineux deviennent trop lourds et se déforment. Utilisez des cartons "vaisselle" de petite taille, robustes double cannelure.\n\n**Erreur 2 — Ne pas tasser les espaces vides**\nUn vide dans le carton = vaisselle qui bouge = casse assurée. Comblez avec du papier froissé, des torchons ou du papier bulle.\n\n**Erreur 3 — Poser les assiettes à plat**\nContre-intuitif mais vrai : posez vos assiettes debout (sur la tranche), comme dans un lave-vaisselle. Elles résistent beaucoup mieux aux chocs verticaux.\n\n**Erreur 4 — Emballer les verres sans protection intérieure**\nGlissez une feuille de papier froissé à l'intérieur de chaque verre, puis enroulez-le dans une deuxième feuille à l'extérieur. Doublez la protection pour les verres à pied.\n\n**Erreur 5 — Ne pas indiquer "FRAGILE" et "HAUT"**\nUn carton non étiqueté risque d'être posé à l'envers ou sous une pile lourde. Marquez les quatre faces avec "FRAGILE" et une flèche "HAUT" bien visible.`,
  },
  {
    id: 3,
    category: "Conseils pratiques",
    readTime: "4 min",
    title: "Déménager avec des enfants et des animaux",
    excerpt: "Le déménagement peut être stressant pour les plus jeunes et pour vos compagnons à quatre pattes. Nos conseils.",
    full: `**Pour les enfants**\n\n- **Impliquez-les** dans le projet : laissez-les choisir la couleur de leur future chambre, emballer leurs jouets préférés.\n- **Gardez la routine** jusqu'au dernier moment : mêmes horaires de repas, de coucher, d'école.\n- **Prévoyez une garde** le jour du déménagement pour les moins de 6 ans : un chantier n'est pas un lieu sûr pour un enfant.\n- **Installez leur chambre en premier** à la nouvelle adresse pour qu'ils retrouvent rapidement leurs repères.\n\n**Pour les chats**\n\n- Confinés dans une pièce vide la veille, puis dans leur caisse le jour J.\n- À l'arrivée, enfermez-les dans une pièce avec litière, eau et gamelle le temps de déposer les cartons.\n- Ne les laissez pas sortir avant 2 semaines : ils risquent de tenter de retourner à l'ancien logement.\n\n**Pour les chiens**\n\n- Sortez-les le matin avant l'arrivée des déménageurs pour les fatiguer.\n- Confiez-les à un ami ou à un dog-sitter pour la journée si possible.\n- À l'arrivée, faites-leur visiter le nouveau logement en laisse avant de les libérer.`,
  },
  {
    id: 4,
    category: "Guide",
    readTime: "6 min",
    title: "Choisir la bonne taille de camion",
    excerpt: "Volume, poids, accès : tout ce qu'il faut savoir pour ne pas se retrouver avec un camion trop petit.",
    full: `**Calculer votre volume**\n\nEn moyenne : studio ≈ 10-15 m³ / T2 ≈ 20-25 m³ / T3 ≈ 30-35 m³ / T4 ≈ 40-50 m³.\nAjoutez 15-20 % si vous avez beaucoup de livres, un piano, une cave bien fournie ou des équipements sportifs.\n\n**Les tailles de camions**\n\n| Camion | Volume | Idéal pour |\n|--------|--------|------------|\n| 12 m³ | 12 m³ | Studio, T1 |\n| 20 m³ | 20 m³ | T2, petite T3 |\n| 26 m³ | 26 m³ | T3/T4 standard |\n| 33 m³ | 33 m³ | Grande maison |\n\n**Points de vigilance**\n\n- **Poids total autorisé (PTAC)** : un camion de 20 m³ dépasse 3,5 t. Des restrictions peuvent s'appliquer en centre-ville (crit'air, ZFE).\n- **Gabarit** : vérifiez la hauteur des passages sous voitures et les largeurs de rues dans les deux adresses.\n- **Hayon ou rampe** : indispensable pour lourds équipements. Précisez-le à votre devis.\n\n**Notre recommandation**\n\nEn cas de doute, prenez un camion légèrement plus grand. Le surcoût est faible et vous évitez d'avoir à faire deux rotations.`,
  },
];

// ─── Shared utilities ─────────────────────────────────────────────────────────
function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function FAQItem({ faq, delay }: { faq: { q: string; a: string }; delay: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ background: C.bg, border: `1px solid ${open ? C.orange : C.border}`, borderRadius: 12, padding: "20px 24px", cursor: "pointer", marginBottom: 8, transition: "border-color 0.2s" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: C.navy }}>{faq.q}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
            <ChevronDown size={20} color={C.textMuted} />
          </motion.div>
        </div>
        {open && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
            style={{ marginTop: 14, fontSize: 15, color: C.textMuted, lineHeight: 1.75 }}>
            {faq.a}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function StepTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 28, left: 0, right: 0, height: 2, background: C.border }} />
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: "100%" } : {}}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        style={{ position: "absolute", top: 28, left: 0, height: 2, background: C.orange }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
        {HOW_IT_WORKS.map((step, i) => (
          <motion.div key={step.step} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 + i * 0.2 }} style={{ textAlign: "center", padding: "0 16px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative", zIndex: 1, fontFamily: "'Manrope', system-ui", fontWeight: 800, fontSize: 16, color: C.white }}>
              {step.step}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{step.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay }} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Manrope', system-ui", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, color: C.white }}>{stat.value}</div>
      <div style={{ fontSize: 15, color: "#93c5fd", marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
    </motion.div>
  );
}

// ─── TruckSVG (hero animation) ────────────────────────────────────────────────
function TruckSVG({ truckX }: { truckX: any }) {
  return (
    <motion.div style={{ x: truckX, position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)" }}>
      <svg viewBox="0 0 200 80" style={{ width: 220, height: 88 }}>
        <rect x="60" y="10" width="130" height="50" rx="4" fill={C.orange} />
        <rect x="10" y="20" width="55" height="40" rx="4" fill={C.orangeDark} />
        <rect x="15" y="24" width="42" height="22" rx="2" fill="#93c5fd" opacity="0.7" />
        <circle cx="35" cy="62" r="12" fill={C.navy} />
        <circle cx="35" cy="62" r="6" fill="#94a3b8" />
        <circle cx="155" cy="62" r="12" fill={C.navy} />
        <circle cx="155" cy="62" r="6" fill="#94a3b8" />
        <circle cx="135" cy="62" r="12" fill={C.navy} />
        <circle cx="135" cy="62" r="6" fill="#94a3b8" />
        <line x1="0" y1="74" x2="200" y2="74" stroke={C.border} strokeWidth="2" />
        <text x="125" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily="'Manrope', system-ui">SWIFT MOVE</text>
      </svg>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-PAGES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── ServicesPage ─────────────────────────────────────────────────────────────
function ServicesPage({ goTo }: { goTo: (p: MovePage) => void }) {
  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: C.bg }}>
      {/* Hero band */}
      <div style={{ background: C.navy, padding: "72px 5% 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 24 }}>
            <Truck size={14} color={C.orange} />
            <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Nos prestations</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 900, color: C.white, lineHeight: 1.1, marginBottom: 18 }}>
            Tous vos déménagements,<br />
            <span style={{ color: C.orange }}>une seule équipe</span>
          </h1>
          <p style={{ fontSize: 18, color: "#93c5fd", maxWidth: 540, lineHeight: 1.75 }}>
            Du studio au bureau, du local à l'international — nous avons l'expérience, le matériel et les équipes pour chaque projet.
          </p>
        </div>
      </div>

      {/* Service cards */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {SERVICES_DATA.map((svc, i) => (
            <SectionReveal key={svc.name} delay={i * 0.08}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 0, background: C.bg, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(30,58,95,0.05)" }}>
                {/* Left accent */}
                <div style={{ background: i % 2 === 0 ? C.navy : C.bgAlt, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ width: 60, height: 60, background: C.orange, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <svc.icon size={30} color={C.white} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{svc.tagline}</div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: i % 2 === 0 ? C.white : C.navy, marginBottom: 12 }}>{svc.name}</h2>
                  <p style={{ fontSize: 14, color: i % 2 === 0 ? "#93c5fd" : C.textMuted, lineHeight: 1.7 }}>{svc.shortDesc}</p>
                  <div style={{ marginTop: 28 }}>
                    <span style={{ fontSize: 13, color: i % 2 === 0 ? "#93c5fd" : C.textMuted }}>À partir de </span>
                    <span style={{ fontSize: 26, fontWeight: 900, color: C.orange }}>{svc.from}</span>
                  </div>
                </div>
                {/* Right detail */}
                <div style={{ padding: "48px 48px" }}>
                  <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 32 }}>{svc.desc}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36 }}>
                    {svc.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Check size={12} color={C.orange} />
                        </div>
                        <span style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo("devis")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orange, color: C.white, padding: "14px 28px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                  >
                    Demander un devis <ArrowRight size={16} />
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

// ─── DevisPage ────────────────────────────────────────────────────────────────
function DevisPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    departCp: "", departEtage: "", departAscenseur: "non",
    arriveeCp: "", arriveeEtage: "", arriveeAscenseur: "non",
    volume: "T2/T3", date: "", flexibilite: "non",
    emballage: false, gardeMeuble: false, nettoyage: false,
    nom: "", email: "", tel: "",
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const inputStyle = { width: "100%", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 } as const;

  if (submitted) {
    return (
      <div style={{ paddingTop: 72, minHeight: "100vh", background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: C.white, borderRadius: 24, padding: "64px 48px", maxWidth: 520, textAlign: "center", boxShadow: "0 24px 80px rgba(30,58,95,0.10)" }}>
          <div style={{ width: 72, height: 72, background: C.orangeLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle size={36} color={C.orange} />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: C.navy, marginBottom: 16 }}>Demande envoyée !</h2>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75 }}>
            Votre devis vous sera envoyé sous 24 h. Merci, {form.nom || "cher client"} !
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: C.bgAlt }}>
      <div style={{ background: C.navy, padding: "60px 5% 56px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: C.white, marginBottom: 12 }}>
            Votre devis <span style={{ color: C.orange }}>gratuit</span>
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", lineHeight: 1.7 }}>Estimation ferme envoyée sous 24 h. Aucun engagement.</p>
          {/* Step indicator */}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= s ? C.orange : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: step >= s ? C.white : "#93c5fd", transition: "background 0.2s" }}>
                  {s}
                </div>
                <span style={{ fontSize: 13, color: step >= s ? C.orange : "#64748b", fontWeight: 700 }}>
                  {s === 1 ? "Adresses" : s === 2 ? "Votre déménagement" : "Contact"}
                </span>
                {s < 3 && <ChevronRight size={14} color="#64748b" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 5%" }}>
        <div style={{ background: C.white, borderRadius: 20, padding: "48px 40px", boxShadow: "0 8px 40px rgba(30,58,95,0.08)" }}>

          {/* Step 1 */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Adresses de départ et d'arrivée</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Code postal départ</label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} color={C.orange} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input value={form.departCp} onChange={(e) => set("departCp", e.target.value)} placeholder="75011" style={{ ...inputStyle, paddingLeft: 40 }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Code postal arrivée</label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} color={C.orange} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input value={form.arriveeCp} onChange={(e) => set("arriveeCp", e.target.value)} placeholder="69001" style={{ ...inputStyle, paddingLeft: 40 }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Étage départ</label>
                  <input value={form.departEtage} onChange={(e) => set("departEtage", e.target.value)} placeholder="3" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Étage arrivée</label>
                  <input value={form.arriveeEtage} onChange={(e) => set("arriveeEtage", e.target.value)} placeholder="2" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ascenseur au départ ?</label>
                  <select value={form.departAscenseur} onChange={(e) => set("departAscenseur", e.target.value)} style={inputStyle}>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Ascenseur à l'arrivée ?</label>
                  <select value={form.arriveeAscenseur} onChange={(e) => set("arriveeAscenseur", e.target.value)} style={inputStyle}>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} style={{ background: C.orange, color: C.white, padding: "14px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                Étape suivante <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Votre déménagement</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Volume estimé</label>
                  <select value={form.volume} onChange={(e) => set("volume", e.target.value)} style={inputStyle}>
                    <option>Studio / T1</option>
                    <option>T2 / T3</option>
                    <option>T4 / T5</option>
                    <option>Maison individuelle</option>
                    <option>Bureaux / local pro</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date souhaitée</label>
                  <div style={{ position: "relative" }}>
                    <Calendar size={16} color={C.orange} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} style={{ ...inputStyle, paddingLeft: 40 }} />
                  </div>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Flexibilité sur la date ?</label>
                  <select value={form.flexibilite} onChange={(e) => set("flexibilite", e.target.value)} style={inputStyle}>
                    <option value="non">Non, date fixe</option>
                    <option value="semaine">Flexible sur la semaine</option>
                    <option value="mois">Flexible sur le mois</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 14 }}>Services additionnels</p>
                {[
                  { key: "emballage", label: "Service emballage (cartons + matériaux fournis)" },
                  { key: "gardeMeuble", label: "Garde-meuble temporaire" },
                  { key: "nettoyage", label: "Nettoyage de fin de bail" },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => set(key, e.target.checked)} style={{ width: 18, height: 18, accentColor: C.orange }} />
                    <span style={{ fontSize: 15, color: C.text }}>{label}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} style={{ background: C.bgAlt, color: C.navy, padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                  <ChevronLeft size={16} /> Retour
                </button>
                <button type="button" onClick={() => setStep(3)} style={{ background: C.orange, color: C.white, padding: "14px 28px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                  Étape suivante <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Vos coordonnées</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
                <div>
                  <label style={labelStyle}>Nom complet</label>
                  <input value={form.nom} onChange={(e) => set("nom", e.target.value)} placeholder="Marie Dupont" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="marie@email.fr" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <input type="tel" value={form.tel} onChange={(e) => set("tel", e.target.value)} placeholder="+33 6 12 34 56 78" style={inputStyle} />
                </div>
              </div>
              <div style={{ background: C.orangeLight, borderRadius: 12, padding: "16px 20px", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Shield size={18} color={C.orange} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>Vos données ne sont jamais revendues. Nous les utilisons uniquement pour vous envoyer votre devis.</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setStep(2)} style={{ background: C.bgAlt, color: C.navy, padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                  <ChevronLeft size={16} /> Retour
                </button>
                <button type="submit" onClick={() => setSubmitted(true)} style={{ background: C.orange, color: C.white, padding: "14px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                  Envoyer ma demande <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── StockagePage ─────────────────────────────────────────────────────────────
function StockagePage({ goTo }: { goTo: (p: MovePage) => void }) {
  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: C.bg }}>
      {/* Hero */}
      <div style={{ background: C.navy, padding: "72px 5% 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 24 }}>
            <Warehouse size={14} color={C.orange} />
            <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Garde-meuble</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, color: C.white, marginBottom: 20 }}>
            Votre mobilier en sécurité,<br />
            <span style={{ color: C.orange }}>le temps qu'il faut</span>
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", lineHeight: 1.75 }}>
            Garde-meuble sécurisé 24/7, climatisé, accessible 7j/7. Sans engagement de durée.
          </p>
        </div>
      </div>

      {/* Photo */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 5% 0" }}>
        <SectionReveal>
          <div style={{ borderRadius: 20, overflow: "hidden", height: 340 }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop"
              alt="Entrepôt de garde-meuble climatisé"
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </SectionReveal>
      </div>

      {/* Box sizes */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 5%" }}>
        <SectionReveal>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 900, color: C.navy, textAlign: "center", marginBottom: 16 }}>
            Choisissez votre espace
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, textAlign: "center", marginBottom: 56 }}>
            3 tailles disponibles. Accès sécurisé 7j/7. Résiliation sans préavis.
          </p>
        </SectionReveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {STORAGE_BOXES.map((box, i) => (
            <SectionReveal key={box.size} delay={i * 0.1}>
              <div style={{ background: i === 1 ? C.navy : C.bg, borderRadius: 20, padding: 36, border: i === 1 ? `2px solid ${C.orange}` : `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "relative" }}>
                {i === 1 && (
                  <div style={{ position: "absolute", top: -1, right: 24, background: C.orange, color: C.white, fontSize: 11, fontWeight: 800, padding: "5px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>
                    Populaire
                  </div>
                )}
                <div style={{ fontSize: 36, fontWeight: 900, color: C.orange, marginBottom: 4 }}>{box.size}</div>
                <div style={{ fontSize: 14, color: i === 1 ? "#93c5fd" : C.textMuted, marginBottom: 20 }}>{box.desc}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: i === 1 ? C.white : C.navy, marginBottom: 28 }}>
                  {box.price}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 28 }}>
                  {box.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CheckCircle size={15} color={C.orange} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: i === 1 ? "#cbd5e1" : C.text }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => goTo("devis")}
                  style={{ background: i === 1 ? C.orange : C.orangeLight, color: i === 1 ? C.white : C.orange, padding: "14px 24px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                >
                  Réserver
                </button>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>

      {/* Trust band */}
      <div style={{ background: C.bgAlt, padding: "60px 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }}>
          {[
            { icon: Shield, title: "Vidéosurveillance 24/7", desc: "Caméras HD et agents de sécurité" },
            { icon: Clock, title: "Accès 7j/7", desc: "De 8 h à 20 h, tous les jours" },
            { icon: Zap, title: "Climatisé", desc: "Température et hygrométrie contrôlées" },
            { icon: CheckCircle, title: "Sans engagement", desc: "Résiliation à tout moment" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <div style={{ width: 52, height: 52, background: C.orangeLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Icon size={24} color={C.orange} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: C.navy, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ConseilsPage ─────────────────────────────────────────────────────────────
function ConseilsPage() {
  const [openArticle, setOpenArticle] = useState<number | null>(null);

  if (openArticle !== null) {
    const article = ARTICLES.find((a) => a.id === openArticle)!;
    const paragraphs = article.full.split("\n\n");
    return (
      <div style={{ paddingTop: 72, minHeight: "100vh", background: C.bg }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 5%" }}>
          <button
            type="button"
            onClick={() => setOpenArticle(null)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, color: C.orange, padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", marginBottom: 40, fontFamily: "'Manrope', system-ui" }}
          >
            <ChevronLeft size={16} /> Retour aux conseils
          </button>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, borderRadius: 30, padding: "5px 14px", marginBottom: 20 }}>
            <span style={{ color: C.orange, fontSize: 12, fontWeight: 700 }}>{article.category} · {article.readTime}</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: C.navy, marginBottom: 32, lineHeight: 1.2 }}>{article.title}</h1>
          {paragraphs.map((p, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              {p.startsWith("**") && p.includes("**\n") ? (
                <>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 10 }}>
                    {p.split("**\n")[0].replace(/\*\*/g, "")}
                  </h3>
                  <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8 }}>
                    {p.split("**\n")[1]}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8 }}>{p}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: C.bg }}>
      <div style={{ background: C.navy, padding: "72px 5% 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 24 }}>
            <BookOpen size={14} color={C.orange} />
            <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Conseils déménagement</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, color: C.white, marginBottom: 16 }}>
            Nos <span style={{ color: C.orange }}>guides pratiques</span>
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", maxWidth: 540, lineHeight: 1.75 }}>
            Conseils d'experts pour préparer, organiser et réussir votre déménagement sans stress.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }}>
          {ARTICLES.map((article, i) => (
            <SectionReveal key={article.id} delay={i * 0.1}>
              <div style={{ background: C.bg, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(30,58,95,0.05)", height: "100%" }}>
                <div style={{ background: C.bgAlt, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={`https://images.unsplash.com/photo-${["1558618666-fcd25c85cd64", "1586023492125-27272f38b37e", "1530103862676-de8c9debad1d", "1558618047-3c8c76ca7d13"][i]}?w=800&q=80&fit=crop`}
                    alt={article.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                    <span style={{ background: C.orangeLight, color: C.orange, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>{article.category}</span>
                    <span style={{ fontSize: 12, color: C.textMuted }}>{article.readTime} de lecture</span>
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: C.navy, marginBottom: 12, lineHeight: 1.3 }}>{article.title}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, flex: 1, marginBottom: 24 }}>{article.excerpt}</p>
                  <button
                    type="button"
                    onClick={() => setOpenArticle(article.id)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, color: C.orange, padding: "12px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui", alignSelf: "flex-start" }}
                  >
                    Lire l'article <ArrowRight size={14} />
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

// ─── ContactPage ──────────────────────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputStyle = { width: "100%", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: C.bg }}>
      <div style={{ background: C.navy, padding: "72px 5% 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, color: C.white, marginBottom: 16 }}>
            Contactez-<span style={{ color: C.orange }}>nous</span>
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", lineHeight: 1.75, maxWidth: 500 }}>
            Notre équipe répond du lundi au samedi de 8 h à 19 h.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
          {/* Info column */}
          <div>
            <SectionReveal>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Informations pratiques</h2>
            </SectionReveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: MapPin, title: "Zone d'intervention", content: "Île-de-France + France entière\nAdresse communiquée sur demande à contact@aevia.io" },
                { icon: Phone, title: "Téléphone", content: "+33 1 XX XX XX XX" },
                { icon: Mail, title: "Email", content: "contact@aevia.io" },
                { icon: Clock, title: "Horaires", content: "Lundi – Samedi : 8 h – 19 h\nDimanche : fermé" },
              ].map(({ icon: Icon, title, content }) => (
                <SectionReveal key={title}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, background: C.orangeLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={20} color={C.orange} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: C.navy, marginBottom: 4 }}>{title}</div>
                      {content.split("\n").map((line, i) => (
                        <div key={i} style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{line}</div>
                      ))}
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>

            {/* Zone map placeholder */}
            <SectionReveal delay={0.2}>
              <div style={{ marginTop: 36, background: C.bgAlt, borderRadius: 16, padding: "24px", border: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: 800, color: C.navy, marginBottom: 12, fontSize: 15 }}>Zone d'intervention principale</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Paris (75)", "Hauts-de-Seine (92)", "Seine-Saint-Denis (93)", "Val-de-Marne (94)", "Yvelines (78)", "Essonne (91)", "Val-d'Oise (95)", "Seine-et-Marne (77)", "France entière sur devis"].map((zone) => (
                    <span key={zone} style={{ background: C.orangeLight, color: C.orange, fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20 }}>{zone}</span>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Contact form */}
          <SectionReveal delay={0.15}>
            <div style={{ background: C.white, borderRadius: 20, padding: "40px 36px", boxShadow: "0 8px 40px rgba(30,58,95,0.08)", border: `1px solid ${C.border}` }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <CheckCircle size={48} color={C.orange} style={{ margin: "0 auto 20px" }} />
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: C.navy, marginBottom: 10 }}>Message envoyé !</h3>
                  <p style={{ color: C.textMuted }}>Nous vous répondrons dans les 24 h.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: C.navy, marginBottom: 24 }}>Envoyez-nous un message</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Nom complet</label>
                      <input placeholder="Marie Dupont" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Email</label>
                      <input type="email" placeholder="marie@email.fr" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Téléphone</label>
                      <input type="tel" placeholder="+33 6 12 34 56 78" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Message</label>
                      <textarea placeholder="Décrivez votre besoin..." rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                    </div>
                    <button
                      type="submit"
                      onClick={() => setSent(true)}
                      style={{ background: C.orange, color: C.white, padding: "14px 28px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    >
                      Envoyer <ArrowRight size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}

// ─── LegalPage ────────────────────────────────────────────────────────────────
function LegalPage({ isPrivacy }: { isPrivacy?: boolean }) {
  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: C.bg }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 5% 80px" }}>
        {isPrivacy ? (
          <>
            <h1 style={{ fontSize: 36, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Politique de confidentialité</h1>
            <div style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.85 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Responsable du traitement</h2>
              <p>Aevia WS — SIREN 852 546 225 — contact@aevia.io</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Données collectées</h2>
              <p>Nous collectons uniquement les données nécessaires à l'établissement d'un devis et à la prestation de services de déménagement : nom, email, téléphone, adresses de départ et d'arrivée.</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Finalités</h2>
              <p>Vos données sont utilisées pour vous envoyer un devis, vous contacter dans le cadre de votre déménagement et améliorer nos services. Elles ne sont jamais revendues à des tiers.</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Durée de conservation</h2>
              <p>Vos données sont conservées 3 ans à compter du dernier contact, puis supprimées.</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Vos droits</h2>
              <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité. Pour exercer ces droits, écrivez à contact@aevia.io.</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Hébergement</h2>
              <p>Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.</p>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 36, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Mentions légales</h1>
            <div style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.85 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Éditeur du site</h2>
              <p><strong style={{ color: C.navy }}>Aevia WS</strong><br />
              SIREN 852 546 225<br />
              Email : contact@aevia.io<br />
              Adresse du siège social communiquée sur demande.</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Hébergement</h2>
              <p>Vercel Inc. — 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Propriété intellectuelle</h2>
              <p>L'ensemble du contenu de ce site (textes, images, graphismes, logo) est la propriété exclusive d'Aevia WS. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Responsabilité</h2>
              <p>Aevia WS s'efforce d'assurer l'exactitude des informations diffusées sur ce site, mais ne saurait être tenu responsable des erreurs ou omissions, ni des dommages résultant de leur utilisation.</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginTop: 32, marginBottom: 12 }}>Contact</h2>
              <p>Pour toute question : contact@aevia.io</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function SwiftMovePage() {
  const [page, setPage] = useState<MovePage>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (p: MovePage) => {
    setPage(p);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hero parallax (only used on home)
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const truckX = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const NAV_LINKS: { label: string; page: MovePage }[] = [
    { label: "Nos Services", page: "services" },
    { label: "Devis Gratuit", page: "devis" },
    { label: "Garde-Meuble", page: "stockage" },
    { label: "Conseils", page: "conseils" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <div style={{ fontFamily: "'Manrope', system-ui, sans-serif", background: C.bg, color: C.text, overflowX: "clip" }}>

      {/* ── NAVBAR (always visible) ─────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 72, gap: 32 }}>
          {/* Logo */}
          <button
            type="button"
            onClick={() => goTo("home")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 0 }}
          >
            <div style={{ width: 38, height: 38, background: C.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Truck size={22} color={C.white} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: C.navy }}>Swift Move</span>
          </button>

          <div style={{ flex: 1 }} />

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                type="button"
                onClick={() => goTo(link.page)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: page === link.page ? C.orange : C.textMuted,
                  fontFamily: "'Manrope', system-ui",
                  padding: "4px 0",
                  borderBottom: page === link.page ? `2px solid ${C.orange}` : "2px solid transparent",
                  transition: "color 0.15s",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="tel:+33100000000" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: C.navy, textDecoration: "none" }}>
              <Phone size={15} color={C.orange} />
              +33 1 XX XX XX XX
            </a>
            <button
              type="button"
              onClick={() => goTo("devis")}
              style={{ background: C.orange, color: C.white, padding: "10px 22px", borderRadius: 8, fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
            >
              Devis gratuit
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} color={C.navy} /> : <Menu size={24} color={C.navy} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: "16px 5%" }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                type="button"
                onClick={() => goTo(link.page)}
                style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "12px 0", fontSize: 16, fontWeight: 700, color: page === link.page ? C.orange : C.navy, fontFamily: "'Manrope', system-ui", borderBottom: `1px solid ${C.border}` }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── PAGE ROUTING ─────────────────────────────────────────────────── */}
      {page === "services" && <ServicesPage goTo={goTo} />}
      {page === "devis" && <DevisPage />}
      {page === "stockage" && <StockagePage goTo={goTo} />}
      {page === "conseils" && <ConseilsPage />}
      {page === "contact" && <ContactPage />}
      {page === "mentions" && <LegalPage />}
      {page === "privacy" && <LegalPage isPrivacy />}

      {/* ── HOME (gated) ─────────────────────────────────────────────────── */}
      {page === "home" && (
        <>
          {/* HERO */}
          <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: C.navy, overflow: "hidden", paddingTop: 72 }}>
            <motion.div style={{
              position: "absolute", inset: 0, y: heroY,
              backgroundImage: `linear-gradient(rgba(234,88,12,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(234,88,12,0.06) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }} />
            <div style={{ position: "absolute", top: "0", right: "-5%", width: 600, height: 600, background: `radial-gradient(circle, ${C.orange}18 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />
            {/* Road */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: `${C.navy}cc` }}>
              <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", gap: 60, paddingLeft: 80 }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ width: 60, height: 4, background: C.orange, opacity: 0.3, borderRadius: 2 }} />
                ))}
              </div>
            </div>
            <TruckSVG truckX={truckX} />

            <motion.div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "60px 5% 140px", width: "100%", opacity: heroOpacity }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                {/* Left copy */}
                <div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 28 }}>
                    <Zap size={14} color={C.orange} />
                    <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>N°1 de la confiance — Île-de-France & France entière</span>
                  </motion.div>

                  <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                    style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 900, color: C.white, lineHeight: 1.05, marginBottom: 24 }}>
                    Votre déménagement<br />
                    <span style={{ color: C.orange }}>serein</span> & bien fait
                  </motion.h1>

                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
                    style={{ fontSize: 18, color: "#93c5fd", lineHeight: 1.8, marginBottom: 40, maxWidth: 460, fontWeight: 400 }}>
                    Déménagement local, longue distance, international, garde-meuble. Équipes professionnelles, estimation ferme sous 24 h.
                  </motion.p>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                    style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => goTo("devis")}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orange, color: C.white, padding: "16px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                    >
                      Devis gratuit <ArrowRight size={18} />
                    </button>
                    <a href="tel:+33100000000" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.white, padding: "16px 32px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.25)" }}>
                      <Phone size={16} /> Appeler
                    </a>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    style={{ display: "flex", gap: 32, marginTop: 52 }}>
                    {[
                      { val: "4,9★", label: "Avis Google" },
                      { val: "18 K+", label: "Clients satisfaits" },
                      { val: "100 %", label: "Agréé & assuré" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: C.orange }}>{s.val}</div>
                        <div style={{ fontSize: 13, color: "#93c5fd", marginTop: 4 }}>{s.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Right: quick quote card */}
                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <div style={{ background: C.white, borderRadius: 20, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,0.30)" }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Obtenez votre devis gratuit</h3>
                    <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Estimation ferme sous 24 h. Aucun engagement.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[
                        { label: "Code postal départ", placeholder: "75011" },
                        { label: "Code postal arrivée", placeholder: "69001" },
                      ].map((field) => (
                        <div key={field.label}>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{field.label}</label>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
                            <MapPin size={16} color={C.orange} />
                            <input placeholder={field.placeholder} style={{ background: "none", border: "none", outline: "none", fontSize: 15, color: C.text, width: "100%", fontFamily: "'Manrope', system-ui" }} />
                          </div>
                        </div>
                      ))}
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Logement</label>
                        <select style={{ width: "100%", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", outline: "none", appearance: "none", cursor: "pointer" }}>
                          <option>Studio / T1</option>
                          <option>T2 / T3</option>
                          <option>T4 / T5</option>
                          <option>Maison individuelle</option>
                          <option>Bureaux / local pro</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Date souhaitée</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
                          <Calendar size={16} color={C.orange} />
                          <input type="date" style={{ background: "none", border: "none", outline: "none", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", width: "100%" }} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => goTo("devis")}
                        style={{ background: C.orange, color: C.white, padding: "16px 24px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Manrope', system-ui" }}
                      >
                        Obtenir mon devis <ArrowRight size={18} />
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, justifyContent: "center" }}>
                      <Shield size={14} color={C.textMuted} />
                      <span style={{ fontSize: 12, color: C.textMuted }}>Aucun démarchage. Estimation ferme uniquement.</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* SERVICES preview */}
          <section style={{ padding: "100px 5%", background: C.bg }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
                    <Truck size={14} color={C.orange} />
                    <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Nos prestations</span>
                  </div>
                  <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 16 }}>Tous les types de déménagement</h2>
                  <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Du studio au bureau, du local à l'international — une seule équipe pour chaque projet.</p>
                </div>
              </SectionReveal>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                {SERVICES_DATA.slice(0, 4).map((service, i) => (
                  <SectionReveal key={service.name} delay={i * 0.1}>
                    <div
                      style={{ background: C.bg, borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, height: "100%", display: "flex", flexDirection: "column", transition: "all 0.2s", cursor: "pointer" }}
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 16px 48px rgba(234,88,12,0.12)"; el.style.borderColor = `${C.orange}50`; el.style.transform = "translateY(-4px)"; }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.borderColor = C.border; el.style.transform = "translateY(0)"; }}
                      onClick={() => goTo("services")}
                    >
                      <div style={{ width: 50, height: 50, background: C.orangeLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <service.icon size={24} color={C.orange} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{service.tagline}</div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{service.name}</h3>
                      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, flex: 1, marginBottom: 16 }}>{service.shortDesc}</p>
                      <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 13, color: C.textMuted }}>À partir de </span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>{service.from}</span>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>

              <SectionReveal delay={0.3}>
                <div style={{ textAlign: "center", marginTop: 40 }}>
                  <button
                    type="button"
                    onClick={() => goTo("services")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, color: C.orange, padding: "14px 28px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                  >
                    Voir tous nos services <ArrowRight size={16} />
                  </button>
                </div>
              </SectionReveal>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section style={{ padding: "100px 5%", background: C.bgAlt }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ textAlign: "center", marginBottom: 72 }}>
                  <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 14 }}>Comment ça marche</h2>
                  <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>Quatre étapes simples. Zéro surprise. Vos affaires déplacées avec soin.</p>
                </div>
              </SectionReveal>
              <StepTimeline />
            </div>
          </section>

          {/* STATS */}
          <section style={{ padding: "80px 5%", background: C.navy }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
              {STATS.map((s, i) => <StatCard key={s.label} stat={s} delay={i * 0.1} />)}
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section style={{ padding: "100px 5%", background: C.bg }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, borderRadius: 30, padding: "6px 16px", marginBottom: 16 }}>
                    <Users size={14} color={C.orange} />
                    <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Avis clients</span>
                  </div>
                  <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>18 400+ déménagements réussis</h2>
                </div>
              </SectionReveal>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {TESTIMONIALS.map((t, i) => (
                  <SectionReveal key={t.name} delay={i * 0.1}>
                    <div style={{ background: C.bgAlt, borderRadius: 16, padding: 32, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 18 }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={16} fill={C.orange} color={C.orange} />)}
                      </div>
                      <p style={{ fontSize: 15, color: C.text, lineHeight: 1.75, flex: 1 }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: C.orange, flexShrink: 0 }}>
                          {t.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15, color: C.navy }}>{t.name}</div>
                          <div style={{ fontSize: 13, color: C.textMuted }}>{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section style={{ padding: "100px 5%", background: C.bgAlt }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                  <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 900, color: C.navy, marginBottom: 14 }}>Tarifs transparents</h2>
                  <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>Estimation ferme uniquement. Ce que nous annonçons, vous payez. Pas de surprise.</p>
                </div>
              </SectionReveal>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto" }}>
                {PRICING_CARDS.map((plan, i) => (
                  <SectionReveal key={plan.name} delay={i * 0.12}>
                    <div style={{ background: plan.highlight ? C.navy : C.white, borderRadius: 16, padding: 32, border: plan.highlight ? `2px solid ${C.orange}` : `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "relative", height: "100%" }}>
                      {plan.highlight && (
                        <div style={{ position: "absolute", top: -1, right: 20, background: C.orange, color: C.white, fontSize: 11, fontWeight: 800, padding: "5px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>
                          Le plus demandé
                        </div>
                      )}
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: plan.highlight ? C.white : C.navy, marginBottom: 4 }}>{plan.name}</h3>
                      <div style={{ fontSize: 12, color: plan.highlight ? "#93c5fd" : C.textMuted, marginBottom: 20 }}>{plan.period}</div>
                      <div style={{ marginBottom: 24 }}>
                        <span style={{ fontSize: 11, color: plan.highlight ? "#93c5fd" : C.textMuted, textTransform: "uppercase", fontWeight: 700 }}>{plan.suffix} </span>
                        <span style={{ fontSize: 36, fontWeight: 900, color: plan.highlight ? C.orange : C.navy }}>{plan.price}</span>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                        {plan.features.map((f) => (
                          <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: plan.highlight ? `${C.orange}30` : C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Check size={11} color={C.orange} />
                            </div>
                            <span style={{ fontSize: 13, color: plan.highlight ? "#cbd5e1" : C.text }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => goTo("devis")}
                        style={{ background: plan.highlight ? C.orange : C.orangeLight, color: plan.highlight ? C.white : C.orange, padding: "14px 24px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                      >
                        Demander un devis
                      </button>
                    </div>
                  </SectionReveal>
                ))}
              </div>
              <SectionReveal delay={0.3}>
                <div style={{ marginTop: 40, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
                  {[
                    { icon: Shield, label: "Agréé & assuré" },
                    { icon: Clock, label: "Ponctualité garantie" },
                    { icon: CheckCircle, label: "Estimation ferme" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon size={16} color={C.orange} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{label}</span>
                    </div>
                  ))}
                </div>
              </SectionReveal>
            </div>
          </section>

          {/* FAQ */}
          <section style={{ padding: "100px 5%", background: C.bg }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <SectionReveal>
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                  <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: C.navy, marginBottom: 12 }}>Questions fréquentes</h2>
                  <p style={{ fontSize: 16, color: C.textMuted }}>Une autre question ? Appelez-nous au +33 1 XX XX XX XX — 7j/7.</p>
                </div>
              </SectionReveal>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} delay={i * 0.07} />)}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── FOOTER (always visible) ───────────────────────────────────────── */}
      <footer style={{ background: C.navy, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 60 }}>
            <div>
              <button
                type="button"
                onClick={() => goTo("home")}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: 0 }}
              >
                <div style={{ width: 38, height: 38, background: C.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Truck size={22} color={C.white} />
                </div>
                <span style={{ fontWeight: 800, fontSize: 20, color: C.white }}>Swift Move</span>
              </button>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75, maxWidth: 260 }}>
                Société agréée et assurée, intervenant en Île-de-France et dans toute la France. Votre déménagement confié à des professionnels.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[MessageSquare, Link2, Camera].map((Icon, i) => (
                  <a key={i} href="#" style={{ width: 36, height: 36, background: "rgba(255,255,255,0.07)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <Icon size={15} color="#64748b" />
                  </a>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={15} color={C.orange} />
                <a href="tel:+33100000000" style={{ fontSize: 16, fontWeight: 800, color: C.white, textDecoration: "none" }}>+33 1 XX XX XX XX</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Prestations</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Déménagement local", page: "services" as MovePage },
                  { label: "Longue distance", page: "services" as MovePage },
                  { label: "International", page: "services" as MovePage },
                  { label: "Entreprises", page: "services" as MovePage },
                  { label: "Garde-meuble", page: "stockage" as MovePage },
                ].map((link) => (
                  <button key={link.label} type="button" onClick={() => goTo(link.page)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#64748b", textAlign: "left", padding: 0, fontFamily: "'Manrope', system-ui" }}>
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Informations</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Conseils déménagement", page: "conseils" as MovePage },
                  { label: "Devis gratuit", page: "devis" as MovePage },
                  { label: "Contact", page: "contact" as MovePage },
                ].map((link) => (
                  <button key={link.label} type="button" onClick={() => goTo(link.page)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#64748b", textAlign: "left", padding: 0, fontFamily: "'Manrope', system-ui" }}>
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Zone d'intervention</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Paris (75)", "Hauts-de-Seine (92)", "Val-de-Marne (94)", "Yvelines (78)", "France entière"].map((zone) => (
                  <span key={zone} style={{ fontSize: 14, color: "#64748b" }}>{zone}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "#334155" }}>© 2025 Aevia WS — SIREN 852 546 225 — contact@aevia.io</p>
            <div style={{ display: "flex", gap: 24 }}>
              <button type="button" onClick={() => goTo("mentions")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#334155", fontFamily: "'Manrope', system-ui" }}>
                Mentions légales
              </button>
              <button type="button" onClick={() => goTo("privacy")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#334155", fontFamily: "'Manrope', system-ui" }}>
                Confidentialité
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
