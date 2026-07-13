"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, ChevronRight, Coffee, Leaf, Package, Flame, Clock, Zap, ChevronLeft, ChevronDown, Globe, Award, Heart, Users, TrendingUp, CheckCircle, Play } from "lucide-react";
import Link from "next/link";
import {
  C,
  SERIF,
  SANS,
  STATS,
  PROCESS_STEPS,
  ORIGINS,
  REVIEWS,
  FAQS,
  ABONNEMENT_PLANS,
  CoffeeBeanSVG,
  OriginMap,
  FAQItem,
  SectionReveal,
} from "./shared";

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

// ─── Additional page-level constants ──────────────────────────────────────────

const TICKER_ORIGINS = [
  "Éthiopie · Yirgacheffe",
  "Colombie · Huila",
  "Guatemala · Antigua",
  "Indonésie · Sumatra",
  "Brésil · Cerrado",
  "Kenya · Kirinyaga",
  "Rwanda · Nyamasheke",
  "Pérou · Cajamarca",
  "Mexique · Chiapas",
  "Tanzanie · Kilimanjaro",
];

const ALL_PRODUCTS = [
  {
    id: "eth-yirg",
    name: "Éthiopie Yirgacheffe",
    origin: "Éthiopie",
    region: "Afrique",
    process: "Washed",
    altitude: "1 800–2 200m",
    roast: "Light",
    price: "19",
    intensity: 3,
    grind: ["Filtre", "Espresso", "Grain entier"],
    flavor: ["Jasmin", "Bergamote", "Fruits à noyau", "Acidité vive"],
    description: "Un café floral et délicat — la quintessence du café de spécialité éthiopien.",
    badge: "Coup de cœur",
    badgeColor: "#22c55e",
    available: true,
  },
  {
    id: "col-huila",
    name: "Colombie Huila Natural",
    origin: "Colombie",
    region: "Amérique Latine",
    process: "Natural",
    altitude: "1 600–1 900m",
    roast: "Medium",
    price: "17",
    intensity: 5,
    grind: ["Filtre", "Espresso", "Grain entier"],
    flavor: ["Cerise noire", "Chocolat", "Cassonade", "Corps plein"],
    description: "Riche et fruité, séché au soleil 25 jours sur des lits surélevés.",
    badge: "Best-seller",
    badgeColor: C.caramel,
    available: true,
  },
  {
    id: "guat-ant",
    name: "Guatemala Antigua",
    origin: "Guatemala",
    region: "Amérique Centrale",
    process: "Washed",
    altitude: "1 500–1 700m",
    roast: "Medium",
    price: "15",
    intensity: 4,
    grind: ["Filtre", "Espresso", "Grain entier"],
    flavor: ["Caramel", "Toffee", "Agrumes légers", "Corps moyen"],
    description: "Sol volcanique, microclimat exceptionnel. L'équilibre parfait pour un quotidien.",
    badge: null,
    badgeColor: null,
    available: true,
  },
  {
    id: "sum-man",
    name: "Sumatra Mandheling",
    origin: "Indonésie",
    region: "Asie-Pacifique",
    process: "Wet-Hulled",
    altitude: "1 200–1 500m",
    roast: "Dark",
    price: "16",
    intensity: 8,
    grind: ["Espresso", "French Press", "Grain entier"],
    flavor: ["Terreux", "Cèdre", "Chocolat amer", "Faible acidité"],
    description: "Un caractère unique né du déparchage humide — la signature de l'Indonésie.",
    badge: null,
    badgeColor: null,
    available: true,
  },
  {
    id: "blend-esp",
    name: "Blend Maison Espresso",
    origin: "Multi-origines",
    region: "Sélection",
    process: "Washed + Natural",
    altitude: "1 200–2 000m",
    roast: "Medium-Dark",
    price: "14",
    intensity: 7,
    grind: ["Espresso", "Grain entier"],
    flavor: ["Noisette", "Caramel brun", "Cacao", "Crème onctueuse"],
    description: "Notre assemblage signature, pensé pour un espresso parfait — cremeux, équilibré, constant.",
    badge: "Notre blend",
    badgeColor: "#8B4513",
    available: true,
  },
  {
    id: "decaf-mex",
    name: "Décaf Mexique SWP",
    origin: "Mexique",
    region: "Amérique Centrale",
    process: "Swiss Water Process",
    altitude: "1 400–1 800m",
    roast: "Medium",
    price: "18",
    intensity: 4,
    grind: ["Filtre", "Espresso", "Grain entier"],
    flavor: ["Amande", "Vanille", "Chocolat au lait", "Rondeur"],
    description: "100% sans caféine par le procédé Swiss Water. Tout le goût, zéro compromis.",
    badge: "Sans caféine",
    badgeColor: "#6366f1",
    available: true,
  },
  {
    id: "kenya-kir",
    name: "Kenya Kirinyaga AA",
    origin: "Kenya",
    region: "Afrique",
    process: "Double Washed",
    altitude: "1 700–2 100m",
    roast: "Light-Medium",
    price: "22",
    intensity: 4,
    grind: ["Filtre", "Grain entier"],
    flavor: ["Groseille", "Pamplemousse", "Tomate cerise", "Acidité éclatante"],
    description: "Un lot rare de grade AA — la crème des cafés kenyans, d'une vibrance exceptionnelle.",
    badge: "Édition limitée",
    badgeColor: "#ef4444",
    available: true,
  },
  {
    id: "bra-cer",
    name: "Brésil Cerrado Natural",
    origin: "Brésil",
    region: "Amérique du Sud",
    process: "Natural",
    altitude: "900–1 200m",
    roast: "Medium-Dark",
    price: "13",
    intensity: 6,
    grind: ["Espresso", "French Press", "Grain entier"],
    flavor: ["Noix", "Caramel", "Dattes", "Corps généreux"],
    description: "Le classique brésilien — puissant, rond, idéal comme base de blend ou en espresso.",
    badge: null,
    badgeColor: null,
    available: true,
  },
];

const TASTING_NOTES_CATEGORIES = [
  {
    category: "Fruités",
    color: "#e74c3c",
    notes: ["Cerise", "Framboise", "Myrtille", "Agrumes", "Pamplemousse", "Mangue", "Abricot", "Fruits rouges"],
  },
  {
    category: "Floraux",
    color: "#9b59b6",
    notes: ["Jasmin", "Rose", "Lavande", "Hibiscus", "Fleur d'oranger", "Bergamote", "Violette"],
  },
  {
    category: "Chocolatés",
    color: "#8B4513",
    notes: ["Cacao", "Chocolat noir", "Chocolat au lait", "Caramel", "Toffee", "Noisette", "Praline"],
  },
  {
    category: "Épicés & Terreux",
    color: "#7f8c8d",
    notes: ["Cèdre", "Tabac", "Épices", "Poivre", "Cannelle", "Cumin", "Terre humide"],
  },
  {
    category: "Doux & Sucrés",
    color: "#f39c12",
    notes: ["Vanille", "Miel", "Cassonade", "Sirop d'érable", "Caramel beurre salé", "Amande"],
  },
];

const TESTIMONIALS = [
  {
    name: "James Okafor",
    role: "Home Barista · Londres",
    avatar: "JO",
    rating: 5,
    coffee: "Ethiopian Yirgacheffe",
    text: "L'Yirgacheffe a changé ma vision du café. J'ai essayé des grains de chaque grande box d'abonnement — Origin Roast est dans une autre catégorie. Cette floralité est incroyable.",
  },
  {
    name: "Sophie Lindqvist",
    role: "Propriétaire de café · Stockholm",
    avatar: "SL",
    rating: 5,
    coffee: "Blend Maison Espresso",
    text: "Nous avons changé notre blend maison il y a 6 mois. Les retours clients sur notre espresso se sont nettement améliorés. La constance d'un lot à l'autre est remarquable.",
  },
  {
    name: "Tariq Hassan",
    role: "Abonné mensuel · Paris",
    avatar: "TH",
    rating: 5,
    coffee: "Colombie Huila Natural",
    text: "La box mensuelle est une vraie formation café. À chaque livraison j'apprends quelque chose de nouveau — sur la ferme, le procédé, la torréfaction. Je suis devenu vraiment connaisseur.",
  },
  {
    name: "Hana Mori",
    role: "Barista championne · Tokyo",
    avatar: "HM",
    rating: 5,
    coffee: "Kenya Kirinyaga AA",
    text: "J'ai utilisé le Kenya Kirinyaga pour le championnat de France. L'acidité éclatante, la pureté du fruit — c'est le café que tout compétiteur cherche. Parfaitement préparé.",
  },
  {
    name: "Carlos Mendes",
    role: "Chef étoilé · Porto",
    avatar: "CM",
    rating: 5,
    coffee: "Guatemala Antigua",
    text: "En cuisine, la qualité du café en fin de repas est critique. L'Antigua offre cette douceur équilibrée qui convient à tous mes clients. Nous commandons pour nos deux restaurants.",
  },
];

const PROCESS_TIMELINE = [
  {
    step: "01",
    title: "Sélection des parcelles",
    detail: "Chaque année en janvier–mars, notre équipe visite nos 47 partenaires agricoles dans 18 pays. Nous cuuppons chaque lot sur place avant de confirmer l'achat.",
    icon: Globe,
    month: "Jan–Mar",
  },
  {
    step: "02",
    title: "Transport & quarantaine",
    detail: "Les cafés verts voyagent en conteneurs réfrigérés. Dès l'arrivée, nos grains passent 2 semaines en quarantaine contrôlée pour stabiliser leur humidité.",
    icon: Package,
    month: "Avr–Mai",
  },
  {
    step: "03",
    title: "Profils de torréfaction",
    detail: "Chaque lot reçoit un profil sur mesure développé pendant 4 à 8 semaines sur notre Loring S35. On cible 196–204°C selon l'origine et le traitement.",
    icon: Flame,
    month: "En continu",
  },
  {
    step: "04",
    title: "Repos & analyse sensorielle",
    detail: "Le café repose 5–14 jours post-torréfaction. Notre équipe cuppe chaque lot avant expédition selon le protocole SCA pour valider la conformité.",
    icon: Clock,
    month: "Après torréfaction",
  },
];

const SUBSCRIPTION_HIGHLIGHTS = [
  { icon: Leaf, title: "Torréfié à la commande", desc: "Votre café part à la torréfaction dès que votre commande est confirmée. Jamais de stock dormant." },
  { icon: Award, title: "Sélection curative mensuelle", desc: "Notre torréfacteur sélectionne chaque mois les meilleurs lots disponibles dans notre portefeuille." },
  { icon: Heart, title: "Pause & résiliation libres", desc: "Aucun engagement. Suspendez, sautez une livraison ou résiliez à tout moment depuis votre espace." },
  { icon: TrendingUp, title: "Économies progressives", desc: "Plus votre abonnement dure, plus vous bénéficiez de remises et d'accès prioritaire aux lots rares." },
];

const IMPACT_STATS = [
  { value: "47", label: "Fermes partenaires", icon: Leaf },
  { value: "18", label: "Pays d'origine", icon: Globe },
  { value: "32k+", label: "Sacs torréfiés", icon: Coffee },
  { value: "4.9/5", label: "Note moyenne", icon: Star },
  { value: "€0.18", label: "Prime par kg vs marché", icon: TrendingUp },
  { value: "97%", label: "Abonnés satisfaits", icon: Heart },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function ParticleField() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 4,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: C.caramel,
            opacity: 0.3,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function OriginTicker() {
  return (
    <div style={{ background: C.caramel, overflow: "hidden", padding: "12px 0" }}>
      <div
        style={{
          display: "flex",
          gap: 48,
          animation: "ticker 28s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {[...TICKER_ORIGINS, ...TICKER_ORIGINS].map((origin, i) => (
          <span
            key={i}
            style={{
              fontFamily: SERIF,
              fontSize: 13,
              fontWeight: 700,
              color: C.espresso,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            {origin}
            <span style={{ marginLeft: 48, opacity: 0.5 }}>·</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function IntensityBar({ level }: { level: number }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 6,
            borderRadius: 2,
            background: i < level ? C.caramel : `${C.caramel}25`,
            transition: "background 0.2s",
          }}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, index }: { product: typeof ALL_PRODUCTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <SectionReveal delay={index * 0.08}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: C.white,
          borderRadius: 16,
          border: `1px solid ${hovered ? C.caramel : C.border}`,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
          boxShadow: hovered ? "0 12px 40px rgba(26,10,0,0.10)" : "none",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          position: "relative",
        }}
      >
        {product.badge && (
          <div style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: product.badgeColor ?? C.caramel,
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            padding: "3px 10px",
            borderRadius: 20,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            {product.badge}
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            {product.region} · {product.origin}
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.espresso, marginBottom: 4 }}>{product.name}</h3>
          <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, fontWeight: 300 }}>{product.description}</p>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Intensité
          </div>
          <IntensityBar level={product.intensity} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Traitement", val: product.process },
            { label: "Altitude", val: product.altitude },
            { label: "Torréfaction", val: product.roast },
          ].map((d) => (
            <div key={d.label} style={{ background: C.bgAlt, borderRadius: 6, padding: "5px 10px" }}>
              <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
              <div style={{ fontSize: 12, color: C.espresso, fontWeight: 600, marginTop: 2 }}>{d.val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {product.flavor.map((f) => (
            <span key={f} style={{ background: `${C.caramel}15`, color: C.caramel, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}>{f}</span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${C.borderLight}` }}>
          <div>
            <span style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: C.caramel }}>{product.price}€</span>
            <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 4 }}>/ 250g</span>
          </div>
          <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none" }}>
            <button type="button" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: hovered ? C.caramel : C.caramelLight,
              color: hovered ? C.white : C.caramel,
              padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13,
              border: "none", cursor: "pointer", transition: "all 0.2s",
            }}>
              Commander <ArrowRight size={13} />
            </button>
          </Link>
        </div>
      </div>
    </SectionReveal>
  );
}

function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 20,
            padding: "48px 52px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 24 }}>
            {Array.from({ length: TESTIMONIALS[current].rating }).map((_, i) => (
              <Star key={i} size={16} fill={C.caramel} color={C.caramel} />
            ))}
          </div>
          <p style={{
            fontFamily: SERIF,
            fontSize: 18,
            color: C.sand,
            lineHeight: 1.85,
            fontStyle: "italic",
            fontWeight: 400,
            marginBottom: 28,
          }}>
            "{TESTIMONIALS[current].text}"
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: `${C.caramel}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 15,
              color: C.caramel,
            }}>
              {TESTIMONIALS[current].avatar}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 16, color: C.cream }}>
                {TESTIMONIALS[current].name}
              </div>
              <div style={{fontSize: 12, color: brand ?? '#7a5c3a', fontWeight: 300 }}>
                {TESTIMONIALS[current].role}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: C.caramel, fontWeight: 600 }}>
            {TESTIMONIALS[current].coffee}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 28 }}>
        <button type="button" onClick={prev} style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <ChevronLeft size={18} color={C.sand} />
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? C.caramel : "rgba(255,255,255,0.20)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
        <button type="button" onClick={next} style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <ChevronRight size={18} color={C.sand} />
        </button>
      </div>
    </div>
  );
}

function TastingWheelGrid() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {TASTING_NOTES_CATEGORIES.map((cat) => (
        <div key={cat.category}>
          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              padding: "10px 0",
            }}
          >
            <div style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: cat.color,
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: C.espresso }}>
              {cat.category}
            </span>
            <motion.div
              animate={{ rotate: activeCategory === cat.category ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ marginLeft: "auto" }}
            >
              <ChevronDown size={16} color={C.textMuted} />
            </motion.div>
          </button>
          <AnimatePresence>
            {activeCategory === cat.category && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 10, paddingBottom: 14 }}>
                  {cat.notes.map((note) => (
                    <span
                      key={note}
                      style={{
                        background: `${cat.color}18`,
                        color: cat.color,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "5px 12px",
                        borderRadius: 20,
                        border: `1px solid ${cat.color}30`,
                      }}
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ height: 1, background: C.borderLight }} />
        </div>
      ))}
    </div>
  );
}

function ImpactMetric({ stat, index }: { stat: typeof IMPACT_STATS[0]; index: number }) {
  return (
    <SectionReveal delay={index * 0.08}>
      <div style={{
        textAlign: "center",
        padding: "28px 16px",
        background: C.white,
        borderRadius: 14,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{
          width: 48,
          height: 48,
          background: C.caramelLight,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
        }}>
          <stat.icon size={20} color={C.caramel} />
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: C.espresso }}>
          {stat.value}
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6, fontWeight: 300 }}>
          {stat.label}
        </div>
      </div>
    </SectionReveal>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
export default function OriginRoastPage() {
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

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const [filterRegion, setFilterRegion] = useState<string>("Tous");
  const [filterRoast, setFilterRoast] = useState<string>("Tous");

  const regions = ["Tous", "Afrique", "Amérique Latine", "Amérique Centrale", "Amérique du Sud", "Asie-Pacifique", "Sélection"];
  const roasts = ["Tous", "Light", "Light-Medium", "Medium", "Medium-Dark", "Dark"];

  const filteredProducts = ALL_PRODUCTS.filter((p) => {
    const regionOk = filterRegion === "Tous" || p.region === filterRegion;
    const roastOk = filterRoast === "Tous" || p.roast === filterRoast;
    return regionOk && roastOk;
  });

  
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
    <div style={{ background: C.bg, color: C.text }}>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", background: C.espresso, overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, scale: heroScale, backgroundImage: `radial-gradient(${C.caramel}12 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
        <div style={{ position: "absolute", top: "8%", right: "4%", width: 560, height: 560, background: `radial-gradient(circle, ${C.caramel}18 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-12%", left: "12%", width: 440, height: 440, background: `radial-gradient(circle, ${C.caramel}12 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />
        <ParticleField />

        <motion.div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "80px 5%", width: "100%", opacity: heroOpacity, y: heroY }}>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 80, alignItems: "center" }}>
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: C.caramel, marginBottom: 20 }}>
                Specialty Coffee Roastery — Direct Trade
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ fontFamily: SERIF, fontSize: "clamp(48px, 6vw, 82px)", fontWeight: 900, color: C.cream, lineHeight: 1.03, marginBottom: 28 }}>{c?.heroHeadline ?? <>
                From Bean
                <br />
                <span style={{ color: C.caramel, fontStyle: "italic" }}>to Cup.</span>
              </>}</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
                style={{ fontFamily: SANS, fontSize: 18, color: C.sand, lineHeight: 1.8, marginBottom: 44, maxWidth: 480, fontWeight: 300 }}>{c?.heroSubline ?? fd?.tagline ?? <>
                Café de spécialité en petits lots — 47 fermes partenaires, 18 pays. Torréfié à la commande et expédié au pic de fraîcheur.
              </>}</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 52 }}>
                <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none" }}>
                  <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.espresso, padding: "16px 32px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
                    S'abonner <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/templates/impact-38/origins" style={{ textDecoration: "none" }}>
                  <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.cream, padding: "16px 32px", borderRadius: 8, fontWeight: 600, fontSize: 16, border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
                    Explorer les origines
                  </button>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: C.caramel }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: C.sand, marginTop: 4, fontWeight: 300 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40 }}>
                <CoffeeBeanSVG />
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", color: C.caramel }}>
                    Torréfié aujourd'hui
                  </div>
                  <div style={{marginTop: 6, fontFamily: SANS, fontSize: 12, color: brand ?? '#7a5c3a', fontWeight: 300 }}>
                    Ethiopian Yirgacheffe — Lot 2024-112
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ─── ORIGIN TICKER ────────────────────────────────────────────────── */}
      <OriginTicker />

      {/* ─── IMPACT STATS ─────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 12 }}>
                Notre impact
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 900, color: C.espresso }}>
                Des chiffres qui parlent
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
            {IMPACT_STATS.map((stat, i) => (
              <ImpactMetric key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS GRID ────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                Notre sélection
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, color: C.espresso, marginBottom: 16 }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                8 références, soigneusement choisies
              </>}</h2>
              <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>{c?.aboutText ?? <>
                Moins de 8% des lots que nous recevons passent notre sélection. Chaque référence est cuuppée à l'aveugle par notre équipe.
              </>}</p>
            </div>
          </SectionReveal>

          {/* Filters */}
          <SectionReveal delay={0.1}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", marginBottom: 48, marginTop: 36 }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>Région</span>
                {regions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFilterRegion(r)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: `1px solid ${filterRegion === r ? C.caramel : C.border}`,
                      background: filterRegion === r ? C.caramelLight : C.white,
                      color: filterRegion === r ? C.caramel : C.textMuted,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>Torréfaction</span>
                {roasts.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFilterRoast(r)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: `1px solid ${filterRoast === r ? C.caramel : C.border}`,
                      background: filterRoast === r ? C.caramelLight : C.white,
                      color: filterRoast === r ? C.caramel : C.textMuted,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: C.textMuted }}>
              <Coffee size={40} color={C.caramelLight} style={{ marginBottom: 16 }} />
              <p style={{ fontFamily: SERIF, fontSize: 18 }}>Aucun café disponible pour ces filtres.</p>
            </div>
          )}

          <SectionReveal delay={0.2}>
            <div style={{ textAlign: "center", marginTop: 52 }}>
              <Link href="/templates/impact-38/origins" style={{ textDecoration: "none" }}>
                <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.white, padding: "15px 36px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                  Voir le catalogue complet <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── PROCESS TIMELINE ─────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.espresso }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                De l'origine à votre tasse
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: C.cream, marginBottom: 16 }}>
                Un processus sans compromis
              </h2>
              <p style={{ fontSize: 16, color: C.sand, maxWidth: 480, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                Aucun raccourci. Chaque étape est délibérée, documentée et traçable jusqu'au producteur.
              </p>
            </div>
          </SectionReveal>

          {/* Animated Timeline */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: `${C.caramel}30`, transform: "translateX(-50%)" }} />
            {PROCESS_TIMELINE.map((step, i) => (
              <SectionReveal key={step.step} delay={i * 0.15}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "1fr auto 1fr" : "1fr auto 1fr",
                  gap: 32,
                  alignItems: "center",
                  marginBottom: 52,
                }}>
                  <div style={{ textAlign: i % 2 === 0 ? "right" : "left", order: i % 2 === 0 ? 0 : 2 }}>
                    {i % 2 === 0 ? (
                      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: 28 }}>
                        <div style={{ fontFamily: SERIF, fontSize: 12, letterSpacing: "0.1em", color: C.caramel, textTransform: "uppercase", marginBottom: 8 }}>{step.month}</div>
                        <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.cream, marginBottom: 10 }}>{step.title}</h3>
                        <p style={{ fontSize: 14, color: C.sand, lineHeight: 1.75, fontWeight: 300 }}>{step.detail}</p>
                      </div>
                    ) : <div />}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", order: 1, zIndex: 2 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.caramel, display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${C.espresso}` }}>
                      <step.icon size={22} color={C.espresso} />
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: 11, fontWeight: 700, color: C.caramel, marginTop: 8, letterSpacing: "0.1em" }}>{step.step}</div>
                  </div>
                  <div style={{ order: i % 2 === 0 ? 2 : 0 }}>
                    {i % 2 !== 0 ? (
                      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: 28 }}>
                        <div style={{ fontFamily: SERIF, fontSize: 12, letterSpacing: "0.1em", color: C.caramel, textTransform: "uppercase", marginBottom: 8 }}>{step.month}</div>
                        <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.cream, marginBottom: 10 }}>{step.title}</h3>
                        <p style={{ fontSize: 14, color: C.sand, lineHeight: 1.75, fontWeight: 300 }}>{step.detail}</p>
                      </div>
                    ) : <div />}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Also show all 6 process steps */}
          <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PROCESS_STEPS.map((step, i) => (
              <SectionReveal key={step.title} delay={i * 0.08}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, background: `${C.caramel}20`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <step.icon size={20} color={C.caramel} />
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: 12, fontWeight: 700, color: C.caramel, letterSpacing: "0.1em" }}>Étape {step.step}</div>
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: C.cream, marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: C.sand, lineHeight: 1.75, fontWeight: 300 }}>{step.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SUBSCRIPTION SECTION ─────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                L'abonnement mensuel
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, color: C.espresso, marginBottom: 16 }}>
                Votre café, chaque mois. Sans effort.
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                Torréfié à la commande, reposé à la perfection, livré à domicile. Pas d'engagement — résiliez en un clic.
              </p>
            </div>
          </SectionReveal>

          {/* Subscription Highlights */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 60 }}>
            {SUBSCRIPTION_HIGHLIGHTS.map((h, i) => (
              <SectionReveal key={h.title} delay={i * 0.09}>
                <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, background: C.caramelLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <h.icon size={22} color={C.caramel} />
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: C.espresso, marginBottom: 8 }}>{h.title}</div>
                  <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, fontWeight: 300 }}>{h.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Plans Preview */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
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
                }}>
                  {plan.badge && (
                    <div style={{ position: "absolute", top: -1, right: 24, background: plan.highlight ? C.caramel : C.caramelLight, color: plan.highlight ? C.espresso : C.caramel, fontSize: 10, fontWeight: 800, padding: "4px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: plan.highlight ? C.cream : C.espresso, marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ fontSize: 13, color: plan.highlight ? C.sand : C.textMuted, marginBottom: 20, fontWeight: 300 }}>{plan.weight} · {plan.origins}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 700, color: plan.highlight ? C.caramel : C.espresso, marginBottom: 28 }}>
                    {plan.price}€<span style={{ fontSize: 14, fontWeight: 400, color: plan.highlight ? C.sand : C.textMuted, marginLeft: 4 }}>/{plan.period}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {plan.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <CheckCircle size={13} color={C.caramel} style={{ marginTop: 1, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: plan.highlight ? C.sand : C.text, fontWeight: 300, lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none" }}>
                    <button type="button" style={{ display: "block", width: "100%", background: plan.highlight ? C.caramel : C.caramelLight, color: plan.highlight ? C.espresso : C.caramel, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                      Choisir {plan.name}
                    </button>
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TASTING NOTES ────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <SectionReveal>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                  Vocabulaire sensoriel
                </div>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 900, color: C.espresso, marginBottom: 20 }}>
                  La roue aromatique du café de spécialité
                </h2>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.85, fontWeight: 300, marginBottom: 32 }}>
                  Chaque café de spécialité est évalué selon le protocole SCA (Specialty Coffee Association). Nos notes de dégustation vous guident pour identifier ce que vous percevez dans votre tasse.
                </p>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.85, fontWeight: 300 }}>
                  Cliquez sur chaque catégorie pour explorer le vocabulaire associé. Ces notes apparaissent sur nos fiches produit et sur les cartes insérées dans chaque sachet.
                </p>
              </div>
            </SectionReveal>
            <SectionReveal delay={0.15}>
              <div style={{ background: C.white, borderRadius: 16, padding: 36, border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: C.espresso, marginBottom: 24 }}>
                  Explorer les arômes
                </div>
                <TastingWheelGrid />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS CAROUSEL ────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.espresso }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                Ils nous font confiance
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, color: C.cream, marginBottom: 12 }}>
                Ce que disent nos abonnés
              </h2>
              <p style={{ fontSize: 16, color: C.sand, maxWidth: 440, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                Baristas professionnels, amateurs passionnés, chefs étoilés — ils ont tous trouvé leur café.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <TestimonialsCarousel />
          </SectionReveal>
        </div>
      </section>

      {/* ─── ORIGINS MAP ──────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                Traçabilité totale
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 900, color: C.espresso }}>
                D'où vient votre café ?
              </h2>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <OriginMap />
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/templates/impact-38/origins" style={{ textDecoration: "none" }}>
                <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.white, padding: "14px 32px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                  Explorer toutes les origines <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 16 }}>
                FAQ
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: C.espresso, marginBottom: 12 }}>
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

      {/* ─── ANIMATED CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5%", background: C.espresso, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: `radial-gradient(circle, ${C.caramel}15 0%, transparent 65%)`, borderRadius: "50%", pointerEvents: "none" }} />
        <ParticleField />
        <div style={{ position: "relative", zIndex: 2 }}>
          <SectionReveal>
            <motion.div
              animate={{ scale: [1, 1.015, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: C.caramel, marginBottom: 20 }}>
                Prêt à commencer ?
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px, 5vw, 66px)", fontWeight: 900, color: C.cream, lineHeight: 1.08, marginBottom: 24 }}>
                Votre premier sac à{" "}
                <span style={{ color: C.caramel, fontStyle: "italic" }}>13€</span>.
              </h2>
              <p style={{ fontSize: 17, color: C.sand, lineHeight: 1.8, marginBottom: 44, maxWidth: 440, margin: "0 auto 44px", fontWeight: 300 }}>
                Torréfié demain, livré cette semaine. Aucun abonnement requis pour la première commande.
              </p>
            </motion.div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none" }}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: C.caramel,
                    color: C.espresso,
                    padding: "18px 40px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 17,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Commander maintenant <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link href="/templates/impact-38/contact" style={{ textDecoration: "none" }}>
                <button type="button" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  color: C.cream,
                  padding: "18px 40px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 17,
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                }}>
                  Nous contacter
                </button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

    </div>
  );
}
