"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Star,
  Check,
  ChevronDown,
  Package,
  Leaf,
  Flame,
  Globe,
  Clock,
  Zap,
  MessageSquare,
  Link2,
  Camera,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Coffee,
  Calendar,
  Users,
  ChevronRight,
} from "lucide-react";

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg: "#fdf8f3",
  bgAlt: "#f7f0e6",
  text: "#1a0a00",
  textMuted: "#7a5c3a",
  espresso: "#1a0a00",
  caramel: "#c4813a",
  caramelLight: "#f5ddb8",
  cream: "#fdf8f3",
  sand: "#e8d5b7",
  white: "#ffffff",
  border: "#e2cba8",
  borderLight: "#f0e4cc",
};

// ─── Page type union ─────────────────────────────────────────────────────────
type CoffeePage =
  | "home"
  | "origins"
  | "menu"
  | "workshops"
  | "abonnement"
  | "contact"
  | "mentions"
  | "privacy";

// ─── Data ────────────────────────────────────────────────────────────────────
const ORIGINS = [
  {
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    process: "Washed",
    altitude: "1,800–2,200m",
    flavor: ["Jasmine", "Bergamot", "Stone fruit", "Bright acidity"],
    roast: "Light",
    price: "19",
    region: "Africa",
    description:
      "A floral, tea-like cup from the birthplace of coffee. Hand-picked from small family farms in the Gedeo Zone.",
    longDescription:
      "L'Ethiopian Yirgacheffe est considéré comme l'un des cafés les plus exceptionnels au monde. Cultivé à plus de 1 800 mètres d'altitude dans la zone Gedeo, chaque cerise est récoltée à la main par des familles qui pratiquent la caféiculture depuis des générations. Le processus washed révèle toute la complexité florale du grain — jasmin, bergamote, fruits à noyau — avec une acidité lumineuse caractéristique des grands cafés d'Éthiopie.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80&fit=crop",
  },
  {
    name: "Colombian Huila Natural",
    origin: "Colombia",
    process: "Natural",
    altitude: "1,600–1,900m",
    flavor: ["Dark cherry", "Chocolate", "Brown sugar", "Full body"],
    roast: "Medium",
    price: "17",
    region: "Latin America",
    description:
      "Rich and fruit-forward from Colombia's most celebrated region. Sun-dried for 25 days on raised beds.",
    longDescription:
      "La région de Huila, au sud de la Colombie, produit certains des meilleurs cafés d'Amérique Latine. Ce lot Natural est séché au soleil pendant 25 jours sur des lits surélevés, ce qui développe une richesse fruitée exceptionnelle. La cerise fermente doucement autour du grain, conférant des notes de cerise noire, de chocolat noir et de cassonade avec un corps plein et velouté.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80&fit=crop",
  },
  {
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    process: "Wet-Hulled",
    altitude: "1,200–1,500m",
    flavor: ["Earthy", "Cedar", "Dark chocolate", "Low acidity"],
    roast: "Dark",
    price: "16",
    region: "Asia-Pacific",
    description:
      "A unique wet-hulled processing gives this Sumatran coffee its distinctively earthy, full-bodied character.",
    longDescription:
      "Le Sumatra Mandheling est l'un des cafés les plus distinctifs au monde, grâce au processus de déparchage humide unique à l'Indonésie (Giling Basah). Cette méthode confère au café ses notes terreuses caractéristiques, évoquant le cèdre, la forêt après la pluie et le chocolat amer. Faible en acidité, il convient parfaitement aux amateurs de cafés foncés et intenses.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&fit=crop",
  },
  {
    name: "Guatemala Antigua",
    origin: "Guatemala",
    process: "Washed",
    altitude: "1,500–1,700m",
    flavor: ["Toffee", "Caramel", "Mild citrus", "Medium body"],
    roast: "Medium",
    price: "15",
    region: "Latin America",
    description:
      "Volcanic soil and consistent climate produce a balanced, approachable cup with classic Central American character.",
    longDescription:
      "Cultivé sur les flancs des volcans entourant la vallée d'Antigua, ce café bénéficie d'un sol volcanique riche en minéraux et d'un microclimat exceptionnel. Le processus washed met en valeur la clarté et la balance de ce terroir unique — des notes de caramel, toffee et agrumes légers pour une tasse équilibrée et accessible, idéale pour découvrir les cafés d'Amérique Centrale.",
    image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80&fit=crop",
  },
];

const PROCESS_STEPS = [
  {
    icon: Leaf,
    step: "01",
    title: "Source",
    desc: "We visit farms annually. Every lot is traceable to the specific producer and harvest. No middlemen.",
  },
  {
    icon: Package,
    step: "02",
    title: "Select",
    desc: "Green coffee is cupped blind by our team. Less than 8% of samples we receive make it to roasting.",
  },
  {
    icon: Flame,
    step: "03",
    title: "Roast",
    desc: "Small-batch roasting on our Loring S35. Every profile is developed over months and documented precisely.",
  },
  {
    icon: Clock,
    step: "04",
    title: "Rest",
    desc: "All coffee rests 5–14 days after roasting before shipping — peak degassing for optimal extraction.",
  },
  {
    icon: Package,
    step: "05",
    title: "Pack",
    desc: "Nitrogen-flushed valve bags preserve freshness. Shipped within 48h of packing.",
  },
  {
    icon: Zap,
    step: "06",
    title: "Brew",
    desc: "Every bag includes QR-linked brew guides for that specific lot and roast level.",
  },
];

const REVIEWS = [
  {
    name: "James Okafor",
    role: "Home Barista",
    avatar: "JO",
    rating: 5,
    text: "The Ethiopian Yirgacheffe changed how I think about coffee. I've tried beans from every major subscription — Origin Roast is in another category.",
  },
  {
    name: "Sophie Lindqvist",
    role: "Café Owner, Stockholm",
    avatar: "SL",
    rating: 5,
    text: "We switched our cafe's house blend to Origin Roast six months ago. Customer feedback on our espresso has improved measurably. The consistency is remarkable.",
  },
  {
    name: "Tariq Hassan",
    role: "Monthly Subscriber",
    avatar: "TH",
    rating: 5,
    text: "The monthly box is a coffee education. Each arrival I learn something new — about the farm, the process, the roast. It's made me genuinely knowledgeable.",
  },
];

const FAQS = [
  {
    q: "How fresh is the coffee when it arrives?",
    a: "We roast to order. Your coffee is roasted within 48 hours of your order, rested 5–14 days (depending on process), then shipped. Most subscribers receive coffee 7–10 days off-roast — ideal for espresso and filter.",
  },
  {
    q: "What grind options are available?",
    a: "Whole bean, coarse filter (French press/cold brew), medium filter (pour over/drip), fine filter (Aeropress), and espresso. We recommend whole bean for peak freshness.",
  },
  {
    q: "Can I skip or pause my subscription?",
    a: "Yes — skip up to 4 consecutive deliveries per year, or pause for up to 3 months. Manage everything from your account dashboard or email us.",
  },
  {
    q: "Do you offer decaffeinated options?",
    a: "Yes. We carry a Swiss Water Process decaf single origin, rotated seasonally. All subscription plans can include decaf as one of your selections.",
  },
  {
    q: "Do you ship internationally?",
    a: "We ship to 22 countries across Europe and North America. International orders include expedited shipping to ensure freshness. DHL tracked, typically 3–5 days.",
  },
  {
    q: "What is your sourcing philosophy?",
    a: "Direct trade where possible — we visit producers annually and pay above Fair Trade minimums. All partners are paid before harvest via crop financing. Full transparency on every bag.",
  },
];

const STATS = [
  { value: "47", label: "Farm Partners" },
  { value: "18", label: "Countries Sourced" },
  { value: "32k+", label: "Bags Roasted" },
  { value: "4.9", label: "Avg. Rating" },
];

const WORKSHOPS = [
  {
    title: "Initiation à la dégustation",
    duration: "2h",
    price: "45",
    unit: "pers",
    image: "https://images.unsplash.com/photo-1516743619420-154b70a65fea?w=800&q=80&fit=crop",
    description:
      "Découvrez les fondamentaux de la dégustation du café — arômes, textures, acidité, amertume — guidé par notre responsable torréfaction.",
    whatYouLearn: [
      "Vocabulaire sensoriel du café de spécialité",
      "Différences entre les méthodes de traitement",
      "Comment identifier les défauts et les qualités",
      "Protocole de cupping professionnel",
    ],
    includes: ["Dégustation de 6 origines", "Guide sensoriel illustré", "1 sachet de café à emporter"],
    groupSize: "4–8 personnes",
    level: "Débutant",
  },
  {
    title: "Barista pour un jour",
    duration: "3h",
    price: "75",
    unit: "pers",
    image: "https://images.unsplash.com/photo-1620905770869-ccaabc65b9b0?w=800&q=80&fit=crop",
    description:
      "Maîtrisez l'extraction espresso et les bases du latte art lors d'une session intensive derrière le comptoir de notre café.",
    whatYouLearn: [
      "Réglage du moulin et extraction espresso",
      "Technique de mousse de lait",
      "Bases du latte art (cœur, tulipe)",
      "Paramètres d'extraction pour différents profils",
    ],
    includes: ["Accès machine espresso professionnelle", "1 kg de café pour pratiquer", "Livret technique barista"],
    groupSize: "2–4 personnes",
    level: "Intermédiaire",
  },
  {
    title: "Torréfaction découverte",
    duration: "4h",
    price: "120",
    unit: "pers",
    image: "https://images.unsplash.com/photo-1606791422814-b32c705e3e2f?w=800&q=80&fit=crop",
    description:
      "Plongez dans l'univers de la torréfaction artisanale : de la sélection du café vert jusqu'à la dégustation du lot que vous aurez torréfié.",
    whatYouLearn: [
      "Chimie de la torréfaction (réaction de Maillard, first crack)",
      "Lecture et interprétation d'un profil de torréfaction",
      "Influence du niveau de torréfaction sur les arômes",
      "Comment déguster et évaluer son propre lot",
    ],
    includes: ["Torréfaction de votre propre lot (250g)", "Emportez votre café fraîchement torréfié", "Fiche de profil personnalisée"],
    groupSize: "2–3 personnes",
    level: "Tout niveau",
  },
];

const ABONNEMENT_PLANS = [
  {
    name: "Découverte",
    weight: "250g",
    origins: "1 origine",
    price: "18",
    priceBi: "16",
    period: "mois",
    features: [
      "1 origine sélectionnée par notre torréfacteur",
      "Notes de dégustation incluses",
      "Grain entier ou moulu",
      "Livraison offerte",
      "Pause ou annulation libre",
    ],
    highlight: false,
    badge: null,
  },
  {
    name: "Amateur",
    weight: "500g",
    origins: "2 origines",
    price: "32",
    priceBi: "28",
    period: "mois",
    features: [
      "2 origines complémentaires",
      "1 café filtre + 1 café espresso",
      "Guide de préparation par lot",
      "Livraison offerte",
      "Accès prioritaire aux nouveaux lots",
      "Pause ou annulation libre",
    ],
    highlight: true,
    badge: "Populaire",
  },
  {
    name: "Connaisseur",
    weight: "1 kg",
    origins: "3 origines",
    price: "55",
    priceBi: "48",
    period: "mois",
    features: [
      "3 origines de notre sélection premium",
      "Moulu sur commande selon votre méthode",
      "Notes de dégustation détaillées + histoire du producteur",
      "Livraison offerte en express",
      "Accès réserves exclusives",
      "Invitation aux ateliers à tarif préférentiel",
      "Pause ou annulation libre",
    ],
    highlight: false,
    badge: "Premium",
  },
];

const MENU_SECTIONS = [
  {
    title: "Espressos",
    icon: "☕",
    items: [
      { name: "Espresso", desc: "Ristretto ou lungo, grain du jour", price: "3,00" },
      { name: "Lungo", desc: "Extraction longue, rondeur assurée", price: "3,50" },
      { name: "Americano", desc: "Espresso allongé à l'eau chaude", price: "3,00" },
      { name: "Macchiato", desc: "Espresso, nuage de mousse", price: "3,50" },
    ],
  },
  {
    title: "Lattes & Milk",
    icon: "🥛",
    items: [
      { name: "Flat White", desc: "Double ristretto, micro-mousse onctueuse", price: "4,50" },
      { name: "Cortado", desc: "Espresso et lait chaud à parts égales", price: "4,00" },
      { name: "Oat Latte", desc: "Espresso, lait d'avoine, latte art", price: "5,00" },
      { name: "Cappuccino", desc: "Espresso, lait chaud, mousse épaisse", price: "4,50" },
    ],
  },
  {
    title: "Cold Brew",
    icon: "🧊",
    items: [
      { name: "Cold Brew", desc: "Infusion 18h, velouté et sans amertume", price: "5,00" },
      { name: "Nitro Cold Brew", desc: "Cold brew infusé à l'azote", price: "6,00" },
      { name: "Cold Brew Tonic", desc: "Cold brew sur eau tonique, citron", price: "6,00" },
    ],
  },
  {
    title: "Filtres & Spécialités",
    icon: "🫖",
    items: [
      { name: "V60 du jour", desc: "Préparation manuelle, origine du moment", price: "5,50" },
      { name: "AeroPress", desc: "Corps intense, préparation minute", price: "4,50" },
      { name: "Café viennois", desc: "Espresso, chantilly légère, cacao", price: "5,00" },
    ],
  },
  {
    title: "Restauration",
    icon: "🥐",
    items: [
      { name: "Croissant partenaire", desc: "Boulangerie artisanale locale, beurre AOP", price: "3,50" },
      { name: "Banana bread", desc: "Maison, noix et caramel brun", price: "4,00" },
      { name: "Cookie café-chocolat", desc: "Généreux, cuit minute", price: "3,00" },
      { name: "Muffin saisonnier", desc: "Recette qui change chaque semaine", price: "3,50" },
    ],
  },
];

// ─── Utility components ───────────────────────────────────────────────────────
function CoffeeBeanSVG() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ width: 180, height: 180, margin: "0 auto" }}
    >
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <ellipse cx="50" cy="50" rx="32" ry="44" fill={C.caramel} opacity="0.9" transform="rotate(-20 50 50)" />
        <ellipse cx="50" cy="50" rx="30" ry="42" fill="none" stroke={C.espresso} strokeWidth="1.5" opacity="0.4" transform="rotate(-20 50 50)" />
        <path d="M35,30 Q50,50 65,70" fill="none" stroke={C.espresso} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" transform="rotate(-20 50 50)" />
        <ellipse cx="40" cy="38" rx="8" ry="5" fill="white" opacity="0.12" transform="rotate(-20 50 50)" />
      </svg>
    </motion.div>
  );
}

function OriginMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox="0 0 800 400"
        style={{ width: "100%", background: `${C.espresso}12`, borderRadius: 16, border: `1px solid ${C.border}` }}
      >
        <path d="M 380 80 L 430 85 L 450 130 L 440 190 L 410 230 L 390 250 L 370 220 L 355 170 L 360 120 Z"
          fill={hovered === "Africa" ? C.caramel : `${C.caramel}30`} stroke={C.caramel}
          strokeWidth={hovered === "Africa" ? 2 : 1} style={{ cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={() => setHovered("Africa")} onMouseLeave={() => setHovered(null)} />
        <path d="M 200 80 L 240 85 L 255 140 L 245 200 L 220 240 L 200 220 L 185 160 L 190 110 Z"
          fill={hovered === "Latin America" ? C.caramel : `${C.caramel}30`} stroke={C.caramel}
          strokeWidth={hovered === "Latin America" ? 2 : 1} style={{ cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={() => setHovered("Latin America")} onMouseLeave={() => setHovered(null)} />
        <path d="M 580 80 L 660 90 L 680 150 L 650 190 L 600 180 L 570 140 L 565 100 Z"
          fill={hovered === "Asia-Pacific" ? C.caramel : `${C.caramel}30`} stroke={C.caramel}
          strokeWidth={hovered === "Asia-Pacific" ? 2 : 1} style={{ cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={() => setHovered("Asia-Pacific")} onMouseLeave={() => setHovered(null)} />
        <text x="400" y="280" textAnchor="middle" fontSize="11" fill={C.caramel} fontFamily="'Fraunces', Georgia, serif" fontWeight="600">Africa</text>
        <text x="218" y="270" textAnchor="middle" fontSize="11" fill={C.caramel} fontFamily="'Fraunces', Georgia, serif" fontWeight="600">Latin America</text>
        <text x="625" y="215" textAnchor="middle" fontSize="11" fill={C.caramel} fontFamily="'Fraunces', Georgia, serif" fontWeight="600">Asia-Pacific</text>
        {hovered && (
          <text x="400" y="340" textAnchor="middle" fontSize="12" fill={C.textMuted} fontFamily="'DM Sans', system-ui">
            {ORIGINS.find((o) => o.region === hovered)?.name || hovered}
          </text>
        )}
        <line x1="100" y1="160" x2="700" y2="160" stroke={C.caramel} strokeWidth="0.5" strokeDasharray="6,6" opacity="0.3" />
        <text x="108" y="155" fontSize="9" fill={C.caramel} opacity="0.5" fontFamily="'DM Sans', system-ui">Equator</text>
      </svg>
      <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 10 }}>
        Survolez pour explorer les régions de culture
      </p>
    </div>
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
        style={{ background: C.white, border: `1px solid ${open ? C.caramel : C.border}`, borderRadius: 10, padding: "20px 24px", cursor: "pointer", marginBottom: 8, transition: "border-color 0.2s" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 16, color: C.espresso }}>{faq.q}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
            <ChevronDown size={18} color={C.caramel} />
          </motion.div>
        </div>
        {open && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
            style={{ marginTop: 14, fontFamily: "'DM Sans', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.75 }}>
            {faq.a}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function PageHeader({ title, subtitle, dark = false }: { title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div style={{ padding: "80px 5% 60px", background: dark ? C.espresso : C.bgAlt, borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : C.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, color: dark ? C.cream : C.espresso, marginBottom: subtitle ? 16 : 0 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontSize: 17, color: dark ? C.sand : C.textMuted, maxWidth: 520, lineHeight: 1.8, fontWeight: 300 }}>
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ─── Sub-page components ──────────────────────────────────────────────────────

function OriginsPage({ goTo }: { goTo: (p: CoffeePage) => void }) {
  const roastColor = (level: string) => {
    if (level === "Light") return "#c4813a";
    if (level === "Medium") return "#8B4513";
    return "#1a0a00";
  };

  return (
    <div>
      <PageHeader
        title="Nos Origines"
        subtitle="Chaque café que nous proposons est sélectionné lors de visites directes chez nos producteurs. Moins de 8% des échantillons reçus passent notre sélection."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: 60 }}>
              <OriginMap />
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))", gap: 32 }}>
            {ORIGINS.map((coffee, i) => (
              <SectionReveal key={coffee.name} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                    <img
                      src={coffee.image}
                      alt={coffee.name}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,10,0,0.6) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ display: "inline-block", background: `${C.caramel}cc`, color: C.white, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 6, letterSpacing: "0.06em" }}>
                          {coffee.region} — {coffee.origin}
                        </div>
                        <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.white, margin: 0 }}>
                          {coffee.name}
                        </h3>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 30, fontWeight: 700, color: C.caramelLight }}>{coffee.price}€</div>
                        <div style={{ fontSize: 11, color: C.sand }}>/ 100g</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                    <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                      {coffee.longDescription}
                    </p>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {[
                        { label: "Traitement", val: coffee.process },
                        { label: "Altitude", val: coffee.altitude },
                      ].map((d) => (
                        <div key={d.label} style={{ background: C.bgAlt, borderRadius: 8, padding: "8px 14px" }}>
                          <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{d.label}</div>
                          <div style={{ fontSize: 13, color: C.espresso, fontWeight: 600, marginTop: 2 }}>{d.val}</div>
                        </div>
                      ))}
                      <div style={{ background: C.bgAlt, borderRadius: 8, padding: "8px 14px" }}>
                        <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Torréfaction</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: roastColor(coffee.roast), marginTop: 2 }}>{coffee.roast}</div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                        Notes de dégustation
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {coffee.flavor.map((f) => (
                          <span key={f} style={{ background: `${C.caramel}18`, color: C.caramel, fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, border: `1px solid ${C.caramel}30` }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
                      <button
                        type="button"
                        onClick={() => goTo("abonnement")}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.white, padding: "12px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", flex: 1, justifyContent: "center" }}
                      >
                        Ajouter au panier <ArrowRight size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo("abonnement")}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramelLight, color: C.caramel, padding: "12px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}
                      >
                        S'abonner
                      </button>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuPage() {
  return (
    <div>
      <PageHeader
        title="Menu Café"
        subtitle="Tout ce que nous servons est préparé avec nos propres cafés de spécialité, fraîchement torréfiés. Notre grain du jour change chaque semaine."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {MENU_SECTIONS.map((section, si) => (
            <SectionReveal key={section.title} delay={si * 0.08}>
              <div style={{ marginBottom: 56 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                  <span style={{ fontSize: 28 }}>{section.icon}</span>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 800, color: C.espresso, margin: 0 }}>
                    {section.title}
                  </h2>
                </div>
                <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  {section.items.map((item, ii) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px 28px",
                        borderBottom: ii < section.items.length - 1 ? `1px solid ${C.borderLight}` : "none",
                        gap: 20,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.espresso, marginBottom: 4 }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 300, lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.caramel, flexShrink: 0 }}>
                        {item.price} €
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}

          <SectionReveal delay={0.3}>
            <div style={{ background: C.bgAlt, borderRadius: 14, padding: 32, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 12 }}>🫘</div>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.espresso, marginBottom: 10 }}>
                Cafés à emporter
              </h3>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, maxWidth: 420, margin: "0 auto", fontWeight: 300 }}>
                Tous nos cafés sont disponibles en sac à emporter. Nos torréfactions ont lieu le mardi et vendredi matin — venez chercher votre café quelques heures après la torréfaction.
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}

function WorkshopsPage({ goTo }: { goTo: (p: CoffeePage) => void }) {
  const [bookingWorkshop, setBookingWorkshop] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", date: "", workshop: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <PageHeader
        title="Ateliers"
        subtitle="Des expériences immersives pour mieux comprendre, déguster et préparer le café. Animés par notre équipe de torréfacteurs et baristas."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 32, marginBottom: 80 }}>
            {WORKSHOPS.map((ws, i) => (
              <SectionReveal key={ws.title} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <img src={ws.image} alt={ws.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,10,0,0.65) 0%, transparent 55%)" }} />
                    <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
                      <span style={{ background: C.caramel, color: C.white, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                        {ws.duration}
                      </span>
                      <span style={{ background: "rgba(255,255,255,0.15)", color: C.white, fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, backdropFilter: "blur(4px)" }}>
                        {ws.level}
                      </span>
                    </div>
                    <div style={{ position: "absolute", bottom: 16, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.white, margin: 0, flex: 1, paddingRight: 12 }}>
                        {ws.title}
                      </h3>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.caramelLight }}>{ws.price}€</div>
                        <div style={{ fontSize: 11, color: C.sand }}>/{ws.unit}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
                    <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>{ws.description}</p>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                        Ce que vous apprendrez
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {ws.whatYouLearn.map((item) => (
                          <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <Check size={13} color={C.caramel} style={{ marginTop: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: C.text, fontWeight: 300, lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                        Inclus
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {ws.includes.map((inc) => (
                          <div key={inc} style={{ fontSize: 13, color: C.caramel, fontWeight: 500 }}>• {inc}</div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                      <Users size={14} color={C.textMuted} />
                      <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 300 }}>{ws.groupSize}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setBookingWorkshop(ws.title); setFormData(f => ({ ...f, workshop: ws.title })); }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.caramel, color: C.white, padding: "13px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", width: "100%" }}
                    >
                      Réserver cet atelier <Calendar size={15} />
                    </button>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Booking form */}
          {bookingWorkshop && !submitted && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, maxWidth: 600, margin: "0 auto" }}>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 8 }}>
                Réserver — {bookingWorkshop}
              </h3>
              <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28, fontWeight: 300 }}>
                Nous vous confirmerons la disponibilité par email sous 24h.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(f => ({ ...f, date: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="submit"
                    style={{ flex: 1, background: C.caramel, color: C.white, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                    Envoyer la demande
                  </button>
                  <button type="button" onClick={() => setBookingWorkshop(null)}
                    style={{ background: C.bgAlt, color: C.textMuted, padding: "14px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {submitted && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>☕</div>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 12 }}>
                Demande reçue !
              </h3>
              <p style={{ fontSize: 15, color: C.textMuted, fontWeight: 300, lineHeight: 1.75 }}>
                Nous revenons vers vous sous 24h pour confirmer votre réservation. Merci pour votre intérêt !
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function AbonnementPage() {
  const [billing, setBilling] = useState<"mensuel" | "bimestriel">("mensuel");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", plan: "", grind: "whole" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <PageHeader
        title="Abonnement"
        subtitle="Recevez votre café de spécialité chaque mois, fraîchement torréfié et prêt à brasser. Résiliable à tout moment."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Billing toggle */}
          <SectionReveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-flex", background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4, gap: 4 }}>
                {(["mensuel", "bimestriel"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setBilling(option)}
                    style={{
                      padding: "10px 28px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', system-ui",
                      fontSize: 14,
                      fontWeight: 700,
                      background: billing === option ? C.caramel : "transparent",
                      color: billing === option ? C.white : C.textMuted,
                      transition: "all 0.2s",
                      position: "relative",
                    }}
                  >
                    {option === "mensuel" ? "Mensuel" : "Bimestriel"}
                    {option === "bimestriel" && (
                      <span style={{ position: "absolute", top: -10, right: -8, background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        -10%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Plans */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginBottom: 80 }}>
            {ABONNEMENT_PLANS.map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.1}>
                <div style={{
                  background: plan.highlight ? C.espresso : C.white,
                  borderRadius: 16,
                  padding: 36,
                  border: plan.highlight ? `2px solid ${C.caramel}` : `1px solid ${C.border}`,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}>
                  {plan.badge && (
                    <div style={{ position: "absolute", top: -1, right: 24, background: plan.highlight ? C.caramel : C.caramelLight, color: plan.highlight ? C.espresso : C.caramel, fontSize: 10, fontWeight: 800, padding: "4px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ marginBottom: 4, fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: plan.highlight ? C.cream : C.espresso }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: 13, color: plan.highlight ? C.sand : C.textMuted, marginBottom: 20, fontWeight: 300 }}>
                    {plan.weight} · {plan.origins}
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <motion.span
                      key={billing + plan.name}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ display: "inline-block", fontFamily: "'Fraunces', Georgia, serif", fontSize: 48, fontWeight: 700, color: plan.highlight ? C.caramel : C.espresso }}
                    >
                      {billing === "mensuel" ? plan.price : plan.priceBi}€
                    </motion.span>
                    <span style={{ fontSize: 13, color: plan.highlight ? C.sand : C.textMuted, marginLeft: 6 }}>/{plan.period}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                    {plan.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <Check size={14} color={C.caramel} style={{ marginTop: 1, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: plan.highlight ? C.sand : C.text, fontWeight: 300, lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(fd => ({ ...fd, plan: plan.name }))}
                    style={{ display: "block", width: "100%", background: plan.highlight ? C.caramel : C.caramelLight, color: plan.highlight ? C.espresso : C.caramel, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}
                  >
                    Choisir {plan.name}
                  </button>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Subscription form */}
          {formData.plan && !submitted && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, maxWidth: 560, margin: "0 auto" }}>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 8 }}>
                Commencer — Plan {formData.plan}
              </h3>
              <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28, fontWeight: 300 }}>
                Renseignez vos coordonnées et nous vous contacterons pour finaliser votre abonnement.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Nom complet</label>
                  <input type="text" required value={formData.name}
                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Email</label>
                  <input type="email" required value={formData.email}
                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Mouture souhaitée</label>
                  <select value={formData.grind} onChange={(e) => setFormData(f => ({ ...f, grind: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }}>
                    <option value="whole">Grain entier (recommandé)</option>
                    <option value="filter-coarse">Filtre grossier (French press)</option>
                    <option value="filter-medium">Filtre moyen (V60, dripper)</option>
                    <option value="espresso">Espresso</option>
                    <option value="aeropress">AeroPress</option>
                  </select>
                </div>
                <button type="submit"
                  style={{ background: C.caramel, color: C.white, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                  Démarrer mon abonnement
                </button>
              </form>
            </motion.div>
          )}

          {submitted && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>☕</div>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 12 }}>
                Bienvenue dans la famille Origin Roast !
              </h3>
              <p style={{ fontSize: 15, color: C.textMuted, fontWeight: 300, lineHeight: 1.75 }}>
                Nous vous contacterons dans les 24h pour confirmer votre abonnement et recueillir vos préférences de livraison.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const hours = [
    { day: "Lundi – Vendredi", time: "7h – 19h" },
    { day: "Samedi", time: "8h – 18h" },
    { day: "Dimanche", time: "9h – 14h" },
  ];

  return (
    <div>
      <PageHeader
        title="Contact"
        subtitle="Une question sur nos cafés, nos abonnements ou nos ateliers ? Écrivez-nous, nous répondons sous 24h."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "start" }}>

          {/* Info panel */}
          <div>
            <SectionReveal>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MapPin size={18} color={C.caramel} />
                    </div>
                    <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.espresso, margin: 0 }}>Adresse</h3>
                  </div>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, fontWeight: 300 }}>
                    Adresse communiquée sur demande à{" "}
                    <a href="mailto:contact@aevia.io" style={{ color: C.caramel, fontWeight: 600, textDecoration: "none" }}>contact@aevia.io</a>
                  </p>
                  <p style={{ fontSize: 13, color: C.textMuted, marginTop: 8, fontWeight: 300 }}>
                    Nos torréfactions ont lieu le <strong>mardi et vendredi matin</strong>.
                  </p>
                </div>

                <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={18} color={C.caramel} />
                    </div>
                    <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.espresso, margin: 0 }}>Horaires</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {hours.map((h) => (
                      <div key={h.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 14, color: C.text, fontWeight: 400 }}>{h.day}</span>
                        <span style={{ fontSize: 14, color: C.caramel, fontWeight: 700 }}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={18} color={C.caramel} />
                    </div>
                    <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.espresso, margin: 0 }}>Email & Téléphone</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <a href="mailto:contact@aevia.io" style={{ fontSize: 14, color: C.caramel, fontWeight: 600, textDecoration: "none" }}>contact@aevia.io</a>
                    <a href="tel:+33600000000" style={{ fontSize: 14, color: C.textMuted, fontWeight: 300, textDecoration: "none" }}>+33 (0)6 00 00 00 00</a>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Form */}
          <SectionReveal delay={0.15}>
            {!submitted ? (
              <div style={{ background: C.white, borderRadius: 16, padding: 40, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.espresso, marginBottom: 24 }}>
                  Envoyer un message
                </h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Nom</label>
                      <input type="text" required value={formData.name}
                        onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Email</label>
                      <input type="email" required value={formData.email}
                        onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Sujet</label>
                    <input type="text" required value={formData.subject}
                      onChange={(e) => setFormData(f => ({ ...f, subject: e.target.value }))}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Message</label>
                    <textarea required rows={5} value={formData.message}
                      onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box", resize: "vertical" }} />
                  </div>
                  <button type="submit"
                    style={{ background: C.caramel, color: C.white, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                    Envoyer le message
                  </button>
                </form>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 12 }}>
                  Message envoyé !
                </h3>
                <p style={{ fontSize: 15, color: C.textMuted, fontWeight: 300, lineHeight: 1.75 }}>
                  Nous vous répondons sous 24h ouvrées. À bientôt !
                </p>
              </motion.div>
            )}
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}

function LegalPage({ type }: { type: "mentions" | "privacy" }) {
  if (type === "mentions") {
    return (
      <div>
        <PageHeader title="Mentions légales" dark={false} />
        <div style={{ padding: "80px 5%", background: C.bg }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {[
              {
                title: "Éditeur du site",
                content: "Aevia WS\nSIREN : 852 546 225\nEmail : contact@aevia.io\nAdresse du siège social communiquée sur demande.",
              },
              {
                title: "Hébergement",
                content: "Vercel Inc.\n440 N Barranca Ave #4133\nCovina, CA 91723, USA\nhttps://vercel.com",
              },
              {
                title: "Responsable de la publication",
                content: "Aevia WS — contact@aevia.io",
              },
              {
                title: "Propriété intellectuelle",
                content: "L'ensemble des contenus présents sur ce site (textes, images, logos) est protégé par le droit de la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans accord préalable écrit.",
              },
              {
                title: "Limitation de responsabilité",
                content: "Aevia WS ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de l'inaccessibilité du service.",
              },
              {
                title: "Droit applicable",
                content: "Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.",
              },
            ].map((section, i) => (
              <SectionReveal key={section.title} delay={i * 0.08}>
                <div style={{ marginBottom: 40 }}>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.espresso, marginBottom: 14 }}>
                    {section.title}
                  </h2>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-line" }}>
                    {section.content}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Politique de confidentialité" dark={false} />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {[
            {
              title: "Données collectées",
              content: "Nous collectons les données que vous nous transmettez volontairement via nos formulaires (nom, adresse email, préférences de café). Ces données sont utilisées exclusivement pour répondre à vos demandes et gérer vos abonnements.",
            },
            {
              title: "Responsable du traitement",
              content: "Aevia WS\nSIREN : 852 546 225\nEmail : contact@aevia.io",
            },
            {
              title: "Durée de conservation",
              content: "Vos données sont conservées pendant la durée de notre relation commerciale, et au maximum 3 ans après votre dernier contact avec nous.",
            },
            {
              title: "Vos droits",
              content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition. Pour exercer ces droits, contactez-nous à contact@aevia.io.",
            },
            {
              title: "Cookies",
              content: "Ce site utilise uniquement des cookies techniques nécessaires au bon fonctionnement de la navigation. Aucun cookie publicitaire ou de tracking tiers n'est utilisé.",
            },
            {
              title: "Hébergement",
              content: "Le site est hébergé par Vercel Inc. (USA). Les données sont traitées dans l'Espace Économique Européen conformément aux clauses contractuelles types de la Commission Européenne.",
            },
          ].map((section, i) => (
            <SectionReveal key={section.title} delay={i * 0.08}>
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.espresso, marginBottom: 14 }}>
                  {section.title}
                </h2>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-line" }}>
                  {section.content}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function OriginRoastPage() {
  const [page, setPage] = useState<CoffeePage>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const goTo = (p: CoffeePage) => {
    setPage(p);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const NAV_LINKS: { label: string; page: CoffeePage }[] = [
    { label: "Nos Origines", page: "origins" },
    { label: "Menu Café", page: "menu" },
    { label: "Ateliers", page: "workshops" },
    { label: "Abonnement", page: "abonnement" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: C.bg, color: C.text, overflowX: "clip" }}>

      {/* ── NAVBAR (always visible) ─────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: C.espresso, padding: "0 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 72, gap: 32 }}>
          <button
            type="button"
            onClick={() => goTo("home")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 0 }}
          >
            <div style={{ width: 32, height: 32, background: C.caramel, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14 }}>☕</span>
            </div>
            <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 20, color: C.cream }}>
              Origin Roast
            </span>
          </button>

          <div style={{ flex: 1 }} />

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                type="button"
                onClick={() => goTo(link.page)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', system-ui",
                  fontSize: 14,
                  fontWeight: page === link.page ? 700 : 500,
                  color: page === link.page ? C.caramel : C.sand,
                  padding: 0,
                  transition: "color 0.15s",
                  textDecoration: page === link.page ? "underline" : "none",
                  textUnderlineOffset: 4,
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo("abonnement")}
            style={{ background: C.caramel, color: C.espresso, padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}
          >
            S'abonner
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: 0, color: C.cream }}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} color={C.cream} /> : <Menu size={24} color={C.cream} />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 0 24px" }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                type="button"
                onClick={() => goTo(link.page)}
                style={{ display: "flex", width: "100%", padding: "12px 5%", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', system-ui", fontSize: 16, fontWeight: 600, color: page === link.page ? C.caramel : C.sand, textAlign: "left" }}
              >
                {link.label}
              </button>
            ))}
            <div style={{ padding: "8px 5% 0" }}>
              <button type="button" onClick={() => goTo("abonnement")}
                style={{ display: "block", width: "100%", background: C.caramel, color: C.espresso, padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                S'abonner
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ── PAGE CONTENT ────────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 72 }}>
        {page === "home" && (
          <div>
            {/* HERO */}
            <section ref={heroRef} style={{ position: "relative", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", background: C.espresso, overflow: "hidden" }}>
              <motion.div style={{ position: "absolute", inset: 0, scale: heroScale, backgroundImage: `radial-gradient(${C.caramel}10 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
              <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, background: `radial-gradient(circle, ${C.caramel}20 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-10%", left: "15%", width: 400, height: 400, background: `radial-gradient(circle, ${C.caramel}15 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />

              <motion.div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "80px 5%", width: "100%", opacity: heroOpacity }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 80, alignItems: "center" }}>
                  <div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                      style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: C.caramel, marginBottom: 20 }}>
                      Specialty Coffee Roastery
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                      style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(44px, 5.5vw, 76px)", fontWeight: 900, color: C.cream, lineHeight: 1.05, marginBottom: 24 }}>
                      From Farm
                      <br />
                      <span style={{ color: C.caramel }}>to Cup.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
                      style={{ fontFamily: "'DM Sans', system-ui", fontSize: 18, color: C.sand, lineHeight: 1.8, marginBottom: 40, maxWidth: 460, fontWeight: 300 }}>
                      Small-batch specialty coffee sourced directly from 47 farm partners across 18 countries. Roasted to order and shipped at peak freshness.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                      style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <button type="button" onClick={() => goTo("abonnement")}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.espresso, padding: "16px 32px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
                        S'abonner <ArrowRight size={18} />
                      </button>
                      <button type="button" onClick={() => goTo("origins")}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.cream, padding: "16px 32px", borderRadius: 8, fontWeight: 600, fontSize: 16, border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
                        Explorer les origines
                      </button>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      style={{ display: "flex", gap: 40, marginTop: 52 }}>
                      {STATS.map((s) => (
                        <div key={s.label}>
                          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.caramel }}>{s.value}</div>
                          <div style={{ fontSize: 13, color: C.sand, marginTop: 4, fontWeight: 300 }}>{s.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40 }}>
                      <CoffeeBeanSVG />
                      <div style={{ textAlign: "center", marginTop: 20 }}>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", color: C.caramel }}>
                          Roasted Today
                        </div>
                        <div style={{ marginTop: 6, fontFamily: "'DM Sans', system-ui", fontSize: 12, color: "#7a5c3a", fontWeight: 300 }}>
                          Ethiopian Yirgacheffe — Lot 2024-112
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* PROCESS */}
            <section style={{ padding: "100px 5%", background: C.bgAlt }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <SectionReveal>
                  <div style={{ textAlign: "center", marginBottom: 72 }}>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                      Notre Processus
                    </div>
                    <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: C.espresso, marginBottom: 16 }}>
                      Six étapes, de l'origine à vous
                    </h2>
                    <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                      Aucun raccourci. Chaque étape est délibérée. Chaque décision documentée et traçable.
                    </p>
                  </div>
                </SectionReveal>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
                  {PROCESS_STEPS.map((step, i) => (
                    <SectionReveal key={step.title} delay={i * 0.1}>
                      <div style={{ background: C.white, borderRadius: 14, padding: 32, border: `1px solid ${C.border}`, transition: "box-shadow 0.2s, transform 0.2s" }}
                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 16px 48px rgba(26,10,0,0.10)"; el.style.transform = "translateY(-4px)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                          <div style={{ width: 44, height: 44, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <step.icon size={22} color={C.caramel} />
                          </div>
                          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, fontWeight: 700, color: C.caramel, letterSpacing: "0.1em" }}>
                            {step.step}
                          </div>
                        </div>
                        <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.espresso, marginBottom: 10 }}>{step.title}</h3>
                        <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, fontWeight: 300 }}>{step.desc}</p>
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ORIGINS PREVIEW */}
            <section style={{ padding: "100px 5%", background: C.bg }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <SectionReveal>
                  <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: C.espresso, marginBottom: 16 }}>
                      Notre catalogue actuel
                    </h2>
                    <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 440, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                      Tous nos lots sont disponibles jusqu'à épuisement. Nouveaux arrivages toutes les 4–6 semaines.
                    </p>
                  </div>
                </SectionReveal>
                <SectionReveal delay={0.1}>
                  <div style={{ marginBottom: 60 }}>
                    <OriginMap />
                  </div>
                </SectionReveal>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
                  {ORIGINS.map((coffee, i) => (
                    <SectionReveal key={coffee.name} delay={i * 0.1}>
                      <div style={{ background: C.white, borderRadius: 14, padding: 32, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ display: "inline-block", background: C.caramelLight, color: C.caramel, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 10, letterSpacing: "0.04em" }}>
                              {coffee.region} — {coffee.origin}
                            </div>
                            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.espresso }}>{coffee.name}</h3>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: C.caramel }}>{coffee.price}</div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>EUR / 250g</div>
                          </div>
                        </div>
                        <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, fontWeight: 300 }}>{coffee.description}</p>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          {[{ label: "Traitement", val: coffee.process }, { label: "Altitude", val: coffee.altitude }, { label: "Torréfaction", val: coffee.roast }].map((d) => (
                            <div key={d.label} style={{ background: C.bgAlt, borderRadius: 6, padding: "6px 12px" }}>
                              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
                              <div style={{ fontSize: 13, color: C.espresso, fontWeight: 600 }}>{d.val}</div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Notes de dégustation</div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {coffee.flavor.map((f) => (
                              <span key={f} style={{ background: `${C.caramel}15`, color: C.caramel, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>{f}</span>
                            ))}
                          </div>
                        </div>
                        <button type="button" onClick={() => goTo("abonnement")}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.caramelLight, color: C.caramel, padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
                          Ajouter à l'abonnement <ArrowRight size={14} />
                        </button>
                      </div>
                    </SectionReveal>
                  ))}
                </div>
                <SectionReveal delay={0.2}>
                  <div style={{ textAlign: "center", marginTop: 40 }}>
                    <button type="button" onClick={() => goTo("origins")}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.white, padding: "14px 32px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                      Voir toutes les origines <ChevronRight size={16} />
                    </button>
                  </div>
                </SectionReveal>
              </div>
            </section>

            {/* REVIEWS */}
            <section style={{ padding: "100px 5%", background: C.espresso }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <SectionReveal>
                  <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: C.cream, marginBottom: 12 }}>
                      Ce que disent nos abonnés
                    </h2>
                  </div>
                </SectionReveal>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                  {REVIEWS.map((r, i) => (
                    <SectionReveal key={r.name} delay={i * 0.1}>
                      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 32, display: "flex", flexDirection: "column", gap: 18 }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} size={15} fill={C.caramel} color={C.caramel} />
                          ))}
                        </div>
                        <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 15, color: C.sand, lineHeight: 1.8, flex: 1, fontStyle: "italic", fontWeight: 400 }}>
                          "{r.text}"
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 42, height: 42, borderRadius: "50%", background: `${C.caramel}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 14, color: C.caramel, flexShrink: 0 }}>
                            {r.avatar}
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 15, color: C.cream }}>{r.name}</div>
                            <div style={{ fontSize: 12, color: "#7a5c3a", fontWeight: 300 }}>{r.role}</div>
                          </div>
                        </div>
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: "100px 5%", background: C.bg }}>
              <div style={{ maxWidth: 760, margin: "0 auto" }}>
                <SectionReveal>
                  <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: C.espresso, marginBottom: 12 }}>
                      Questions fréquentes
                    </h2>
                  </div>
                </SectionReveal>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {FAQS.map((faq, i) => (
                    <FAQItem key={i} faq={faq} delay={i * 0.07} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {page === "origins" && <OriginsPage goTo={goTo} />}
        {page === "menu" && <MenuPage />}
        {page === "workshops" && <WorkshopsPage goTo={goTo} />}
        {page === "abonnement" && <AbonnementPage />}
        {page === "contact" && <ContactPage />}
        {page === "mentions" && <LegalPage type="mentions" />}
        {page === "privacy" && <LegalPage type="privacy" />}
      </div>

      {/* ── FOOTER (always visible) ─────────────────────────────────────────── */}
      <footer style={{ background: C.espresso, padding: "80px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 60 }}>
            <div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: 24, color: C.caramel, marginBottom: 16 }}>
                Origin Roast
              </div>
              <p style={{ fontSize: 14, color: "#7a5c3a", lineHeight: 1.75, maxWidth: 260, fontWeight: 300 }}>
                Specialty coffee sourced directly from farms, roasted in small batches, shipped at peak freshness.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[Camera, MessageSquare, Link2].map((Icon, i) => (
                  <a key={i} href="#" style={{ width: 36, height: 36, background: "rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    <Icon size={15} color="#7a5c3a" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, fontWeight: 700, color: C.caramel, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Boutique
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Nos Origines", page: "origins" as CoffeePage },
                  { label: "Abonnement", page: "abonnement" as CoffeePage },
                  { label: "Menu Café", page: "menu" as CoffeePage },
                  { label: "Ateliers", page: "workshops" as CoffeePage },
                ].map((link) => (
                  <button key={link.label} type="button" onClick={() => goTo(link.page)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#7a5c3a", textAlign: "left", padding: 0, fontWeight: 300, fontFamily: "'DM Sans', system-ui" }}>
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, fontWeight: 700, color: C.caramel, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Entreprise
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Notre histoire", "Producteurs partenaires", "Durabilité", "Blog"].map((link) => (
                  <a key={link} href="#" style={{ fontSize: 13, color: "#7a5c3a", textDecoration: "none", fontWeight: 300 }}>{link}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, fontWeight: 700, color: C.caramel, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="mailto:contact@aevia.io" style={{ fontSize: 13, color: "#7a5c3a", textDecoration: "none", fontWeight: 300 }}>contact@aevia.io</a>
                <button type="button" onClick={() => goTo("contact")}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#7a5c3a", textAlign: "left", padding: 0, fontWeight: 300, fontFamily: "'DM Sans', system-ui" }}>
                  Nous écrire
                </button>
                <span style={{ fontSize: 13, color: "#3d2010", fontWeight: 300 }}>Lun–Ven 7h–19h</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "#3d2010", margin: 0 }}>© 2025 Origin Roast — Aevia WS</p>
            <div style={{ display: "flex", gap: 24 }}>
              <button type="button" onClick={() => goTo("privacy")}
                style={{ fontSize: 13, color: "#3d2010", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', system-ui", padding: 0 }}>
                Confidentialité
              </button>
              <button type="button" onClick={() => goTo("mentions")}
                style={{ fontSize: 13, color: "#3d2010", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', system-ui", padding: 0 }}>
                Mentions légales
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
