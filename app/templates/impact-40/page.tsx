// @ts-nocheck
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Sun,
  Flower2,
  TreeDeciduous,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Check,
  Star,
  ArrowRight,
  Clock,
  Users,
  Heart,
  Menu,
  X,
  UtensilsCrossed,
  Award,
  ChefHat,
  Wine,
  Calendar,
  Snowflake,
} from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";

// ─── Types ────────────────────────────────────────────────────────────────────
type RestoPage = "home" | "menu" | "carte" | "reservation" | "chef" | "contact" | "mentions" | "privacy";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#fdf9ee",
  bgAlt: "#f5efdc",
  bgDark: "#1e3a0f",
  bgDark2: "#2d5016",
  text: "#1a2e08",
  textLight: "#5a6e48",
  textMuted: "#8a9a78",
  accent: "#f0c040",
  accentDark: "#c8a020",
  earth: "#8b5e3c",
  earthLight: "#b8845a",
  white: "#ffffff",
  border: "#ddd5ba",
  shadow: "rgba(45, 80, 22, 0.12)",
  headingFont: "'Playfair Display', Georgia, serif",
  bodyFont: "'Merriweather Sans', system-ui, sans-serif",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const seasons = ["spring", "summer", "fall", "winter"] as const;
type Season = (typeof seasons)[number];

const seasonData: Record<
  Season,
  { label: string; icon: React.ReactNode; color: string; items: { name: string; desc: string; emoji: string }[] }
> = {
  spring: {
    label: "Printemps",
    icon: <Flower2 size={18} />,
    color: "#7bb85a",
    items: [
      { name: "Asperges vertes", desc: "Tendres et croquantes, récoltées à l'aube", emoji: "🌿" },
      { name: "Radis multicolores", desc: "Rose, blanc et violet — croquant garanti", emoji: "🌈" },
      { name: "Épinards baby", desc: "Doux et riches en fer, parfaits crus", emoji: "🥬" },
      { name: "Petits pois", desc: "Sucrés et frais, à croquer directement", emoji: "🫛" },
      { name: "Fraises Gariguette", desc: "Parfumées et juteuses, cuites au soleil", emoji: "🍓" },
      { name: "Ail des ours", desc: "Sauvage, récolté dans nos bois adjacents", emoji: "🌱" },
    ],
  },
  summer: {
    label: "Été",
    icon: <Sun size={18} />,
    color: "#f0c040",
    items: [
      { name: "Tomates anciennes", desc: "12 variétés — noir de Crimée, Green Zebra, Cœur de bœuf", emoji: "🍅" },
      { name: "Courgettes", desc: "Rondes et longues, cueillie avant maturité", emoji: "🥒" },
      { name: "Maïs doux", desc: "Bicolore, à cuire le jour même", emoji: "🌽" },
      { name: "Melons charentais", desc: "Sucrés et odorants, elevés sous filets", emoji: "🍈" },
      { name: "Haricots verts fins", desc: "Croquants, sans fil, récoltés à la main", emoji: "🫘" },
      { name: "Basilic grand vert", desc: "Aromatique et copieux, en bouquet", emoji: "🌿" },
    ],
  },
  fall: {
    label: "Automne",
    icon: <TreeDeciduous size={18} />,
    color: "#c4703a",
    items: [
      { name: "Courges Butternut", desc: "Fondantes et sucrées, parfaites en velouté", emoji: "🎃" },
      { name: "Pommes reinette", desc: "Acidulées et croquantes, verger biologique", emoji: "🍎" },
      { name: "Champignons cultivés", desc: "Shiitake, pleurotes et Paris rosé", emoji: "🍄" },
      { name: "Poireaux", desc: "Doux et tendres, blancs sur 30 cm", emoji: "🧅" },
      { name: "Noix fraîches", desc: "Récoltées de nos noyers centenaires", emoji: "🪨" },
      { name: "Betteraves chioggia", desc: "Rayées rose et blanc, crues ou rôties", emoji: "🟣" },
    ],
  },
  winter: {
    label: "Hiver",
    icon: <Snowflake size={18} />,
    color: "#6ea8d0",
    items: [
      { name: "Choux de Bruxelles", desc: "Tendres et légèrement sucrés après gelée", emoji: "🥦" },
      { name: "Carottes de sable", desc: "Extra-sucrées, élevées en pleine terre", emoji: "🥕" },
      { name: "Endives bressanes", desc: "Blanches et tendres, culture traditionnelle", emoji: "🌿" },
      { name: "Mâche", desc: "Douce et délicate, sans assaisonnement", emoji: "🥗" },
      { name: "Topinambours", desc: "Rustiques et gourmands, en velouté ou sautés", emoji: "🌰" },
      { name: "Céleris-raves", desc: "Denses et parfumés, crus en rémoulade", emoji: "⚪" },
    ],
  },
};

const testimonials = [
  {
    name: "Isabelle Marchand",
    role: "Critique gastronomique, Le Monde",
    text: "Une expérience sensorielle rare. La cuisine de Gabriel Renaud dialogue avec la saison d'une façon que peu de chefs osent encore. Chaque plat est une révélation.",
    rating: 5,
    avatar: "IM",
  },
  {
    name: "Thomas & Élise Bonnet",
    role: "Anniversaire de mariage",
    text: "Le menu Prestige nous a transportés. L'accord mets et vins était d'une justesse absolue. Le service, d'une discrétion et d'une attention incomparables.",
    rating: 5,
    avatar: "TE",
  },
  {
    name: "Chef Olivier Payet",
    role: "3 étoiles Michelin, Marseille",
    text: "Gabriel est l'un des rares chefs à avoir su préserver l'âme d'un terroir tout en proposant une cuisine résolument contemporaine. Une adresse incontournable.",
    rating: 5,
    avatar: "OP",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2rem 0" }}>
      <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.accent }} />
      <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
    </div>
  );
}

// ─── MenuPage ─────────────────────────────────────────────────────────────────
function MenuPage({ goTo }: { goTo: (p: RestoPage) => void }) {
  const menus = [
    {
      name: "Menu Découverte",
      subtitle: "4 plats",
      price: "68€",
      priceNote: "par personne",
      tag: null,
      courses: [
        { label: "Entrée", dish: "Velouté d'asperges vertes, émulsion de parmesan vieilli, chips de jambon Ibérique et ail des ours sauvage" },
        { label: "Poisson", dish: "Filet de sole meunière, risotto aux morilles du Jura, beurre noisette aux câpres et citron confit" },
        { label: "Viande", dish: "Carré d'agneau de lait en croûte d'herbes, jus réduit au thym, légumes primeurs du maraîcher voisin" },
        { label: "Dessert", dish: "Millefeuille croustillant à la vanille de Tahiti, fraises Gariguette marinées au basilic" },
      ],
      bg: C.bg,
      border: C.border,
    },
    {
      name: "Menu Prestige",
      subtitle: "7 plats",
      price: "110€",
      priceNote: "par personne",
      tag: "Accord mets & vins +45€",
      courses: [
        { label: "Amuse-bouche", dish: "Trilogie de la saison : radis glacé au beurre, tartare de tomate ancienne, croquette de chèvre frais" },
        { label: "Première entrée", dish: "Velouté glacé d'asperges blanches, huile de truffe noire du Périgord, œuf mollet poché" },
        { label: "Deuxième entrée", dish: "Carpaccio de saint-jacques en ceviche légère, concombre aux fleurs, caviar d'Aquitaine" },
        { label: "Poisson", dish: "Daurade royale en croûte de sel aux herbes aromatiques, légumes croquants à l'huile d'olive primeur" },
        { label: "Viande", dish: "Agneau de lait des Pyrénées en deux cuissons, jus au romarin, gratin dauphinois à la crème" },
        { label: "Fromages", dish: "Sélection affinée par Maître fromager : Comté 24 mois, Époisses, Roquefort Papillon" },
        { label: "Dessert", dish: "Sphère chocolat Valrhona, cœur coulant au caramel beurre salé, glace vanille maison" },
      ],
      bg: C.bgDark,
      border: "rgba(240,192,64,0.2)",
      dark: true,
    },
    {
      name: "Menu Végétal",
      subtitle: "5 plats",
      price: "78€",
      priceNote: "par personne",
      tag: null,
      courses: [
        { label: "Mise en bouche", dish: "Gaspacho de tomates anciennes au basilic, chantilly au fromage blanc et graines de courge torréfiées" },
        { label: "Première entrée", dish: "Terrine de légumes du moment en gelée d'herbes, vinaigrette aux fleurs de capucine" },
        { label: "Deuxième entrée", dish: "Risotto crémeux aux morilles et parmesan, herbes sauvages, copeaux de truffe de saison" },
        { label: "Plat principal", dish: "Tarte fine de légumes provençaux, pesto de roquette, burrata crémeuse et tomate rôtie lentement" },
        { label: "Dessert", dish: "Pavlova aux fruits rouges, coulis de fraises Gariguette, chantilly légère à la fleur d'oranger" },
      ],
      bg: C.bgAlt,
      border: C.border,
    },
    {
      name: "Formule Déjeuner",
      subtitle: "Mardi – Vendredi",
      price: "38€",
      priceNote: "par personne",
      tag: "Entrée + Plat + Dessert",
      courses: [
        { label: "Entrée au choix", dish: "Salade de saison aux herbes du jardin — ou — Velouté du jour selon arrivages du marché" },
        { label: "Plat au choix", dish: "Poisson du pêcheur local avec légumes de saison — ou — Viande du boucher artisan, sauce maison" },
        { label: "Dessert au choix", dish: "Dessert du chef selon inspiration du matin — ou — Sélection de fromages affinés (supplément 4€)" },
      ],
      bg: C.bg,
      border: C.border,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Gastronomie saisonnière
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              Nos Menus
            </h1>
            <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 540, margin: "0 auto", lineHeight: 1.85 }}>
              Chaque menu est une composition pensée autour des saisons, des producteurs locaux et du dialogue entre la terre et l'assiette.
            </p>
          </div>
        </SectionReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {menus.map((m, idx) => (
            <SectionReveal key={m.name} delay={idx * 0.08}>
              <div
                style={{
                  backgroundColor: m.bg,
                  borderRadius: "1.75rem",
                  border: `1px solid ${m.border}`,
                  overflow: "hidden",
                  boxShadow: `0 4px 32px ${C.shadow}`,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "2rem 2.5rem 1.5rem",
                    borderBottom: `1px solid ${m.dark ? "rgba(240,192,64,0.15)" : C.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                      <UtensilsCrossed size={16} color={C.accent} />
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {m.subtitle}
                      </span>
                    </div>
                    <h2 style={{ fontFamily: C.headingFont, fontSize: "1.6rem", fontWeight: 700, color: m.dark ? C.bg : C.text, margin: 0 }}>
                      {m.name}
                    </h2>
                    {m.tag && (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "0.5rem",
                          backgroundColor: "rgba(240,192,64,0.15)",
                          border: "1px solid rgba(240,192,64,0.35)",
                          color: C.accent,
                          padding: "0.25rem 0.85rem",
                          borderRadius: "2rem",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          fontFamily: C.bodyFont,
                        }}
                      >
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: C.headingFont, fontSize: "2.4rem", fontWeight: 700, color: C.accent, lineHeight: 1 }}>
                      {m.price}
                    </div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: m.dark ? "rgba(253,249,238,0.5)" : C.textMuted, marginTop: "0.2rem" }}>
                      {m.priceNote}
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div style={{ padding: "1.75rem 2.5rem 2rem" }}>
                  {m.courses.map((course, ci) => (
                    <div
                      key={ci}
                      style={{
                        display: "flex",
                        gap: "1.25rem",
                        alignItems: "flex-start",
                        paddingBottom: ci < m.courses.length - 1 ? "1.25rem" : 0,
                        marginBottom: ci < m.courses.length - 1 ? "1.25rem" : 0,
                        borderBottom: ci < m.courses.length - 1 ? `1px solid ${m.dark ? "rgba(240,192,64,0.08)" : C.border}` : "none",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 110,
                          fontFamily: C.bodyFont,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: C.accent,
                          textTransform: "uppercase",
                          letterSpacing: "0.09em",
                          paddingTop: "0.18rem",
                          flexShrink: 0,
                        }}
                      >
                        {course.label}
                      </div>
                      <p
                        style={{
                          fontFamily: C.bodyFont,
                          fontSize: "0.9rem",
                          color: m.dark ? "rgba(253,249,238,0.72)" : C.textLight,
                          lineHeight: 1.75,
                          margin: 0,
                        }}
                      >
                        {course.dish}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.3}>
          <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.textMuted, marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Tous nos menus sont élaborés avec des produits frais du terroir local. Nous adaptons nos compositions selon les arrivages. Allergies et régimes alimentaires : merci de nous prévenir à la réservation.
            </p>
            <button
              type="button"
              onClick={() => goTo("reservation")}
              style={{
                backgroundColor: C.bgDark,
                color: C.accent,
                padding: "1rem 2.5rem",
                borderRadius: "3rem",
                border: "none",
                fontWeight: 700,
                fontFamily: C.bodyFont,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Réserver une table <ArrowRight size={16} />
            </button>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

// ─── CartePage ────────────────────────────────────────────────────────────────
function CartePage({ goTo }: { goTo: (p: RestoPage) => void }) {
  const entrees = [
    { name: "Tartare de légumes du moment", desc: "Concombre, radis, tomate ancienne, herbes du jardin, vinaigrette citronnée à la moutarde de Meaux", price: "18€" },
    { name: "Velouté d'asperges au parmesan", desc: "Asperges vertes du Val de Loire, émulsion de parmesan 24 mois, tuile aux graines de sésame noir", price: "22€" },
    { name: "Foie gras de canard maison", desc: "Terrine mi-cuit, chutney de figues et raisins, brioche toastée au beurre de Normandie", price: "28€" },
    { name: "Saint-Jacques snackées", desc: "Noix de saint-jacques de la Baie de Saint-Brieuc, purée de topinambour, émulsion de beurre fumé", price: "26€" },
    { name: "Œuf parfait du jardin", desc: "Œuf basse température 65°C, crème de morilles, lardons fumés, croûtons maison et persil plat", price: "19€" },
  ];

  const poissons = [
    { name: "Sole meunière", desc: "Sole entière de Bretagne, beurre noisette aux câpres de Pantelleria, persil et citron confit maison", price: "38€" },
    { name: "Daurade en croûte de sel", desc: "Daurade royale de Méditerranée, herbes aromatiques du jardin, légumes primeurs sautés à l'huile d'olive", price: "42€" },
    { name: "Turbot rôti au four", desc: "Filet de turbot sauvage, jus de coquillages réduit, risotto aux courgettes jaunes et fleurs de courgette", price: "44€" },
  ];

  const viandes = [
    { name: "Agneau de lait en deux cuissons", desc: "Carré et épaule confite, jus au romarin et thym du jardin, gratin dauphinois à la crème fraîche", price: "42€" },
    { name: "Filet de bœuf Rossini", desc: "Cœur de filet Charolais, escalope de foie gras poêlé, sauce Périgueux à la truffe noire du Périgord", price: "48€" },
    { name: "Pigeon farci aux champignons", desc: "Pigeon de Racan, farce aux morilles et foie gras, purée de pommes de terre truffée, jus au porto", price: "38€" },
  ];

  const desserts = [
    { name: "Millefeuille à la vanille", desc: "Pâte feuilletée caramélisée maison, crème diplomate vanille de Madagascar, coulis de fraise Gariguette", price: "16€" },
    { name: "Soufflé chaud au Grand Marnier", desc: "Soufflé aérien à l'orange confite, glace vanille maison, crème anglaise légère (20 min de préparation)", price: "18€" },
    { name: "Tarte Tatin revisitée", desc: "Pommes Reinette caramélisées au beurre demi-sel, pâte brisée sablée, crème fraîche épaisse du Calvados", price: "14€" },
    { name: "Assiette de fromages affinés", desc: "Sélection par notre maître fromager : Comté, Époisses, Saint-Nectaire fermier, Roquefort Papillon", price: "18€" },
  ];

  const vins = [
    { name: "Gevrey-Chambertin 1er Cru", producer: "Domaine Rossignol-Trapet", appellation: "Bourgogne Rouge", vintage: "2019", price: "145€" },
    { name: "Puligny-Montrachet Les Pucelles", producer: "Domaine Leflaive", appellation: "Bourgogne Blanc", vintage: "2020", price: "210€" },
    { name: "Côte-Rôtie La Mouline", producer: "Guigal", appellation: "Rhône Nord", vintage: "2018", price: "185€" },
    { name: "Sauternes Premier Cru Classé", producer: "Château d'Yquem", appellation: "Sauternes Liquoreux", vintage: "2017", price: "290€" },
  ];

  const Section = ({ title, items, isWine = false }: { title: string; items: any[]; isWine?: boolean }) => (
    <SectionReveal>
      <div style={{ marginBottom: "3.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "1.8rem", fontWeight: 700, color: C.text, margin: 0 }}>{title}</h2>
          <div style={{ flex: 1, height: 1, backgroundColor: C.border, marginLeft: "0.5rem" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1.5rem",
                padding: "1.35rem 0",
                borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: C.headingFont, fontSize: "1.05rem", fontWeight: 700, color: C.text, marginBottom: "0.35rem" }}>
                  {item.name}
                </div>
                {isWine ? (
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted }}>{item.producer}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.accent }}>·</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textLight }}>{item.appellation}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.accent }}>·</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textLight }}>{item.vintage}</span>
                  </div>
                ) : (
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, lineHeight: 1.7, margin: 0 }}>
                    {item.desc}
                  </p>
                )}
              </div>
              <div
                style={{
                  fontFamily: C.headingFont,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: C.accentDark,
                  flexShrink: 0,
                  paddingTop: "0.1rem",
                }}
              >
                {item.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Cuisine à la demande
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              À la Carte
            </h1>
            <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.85 }}>
              Composez votre repas selon vos envies. Chaque plat est préparé à la minute, avec les meilleurs produits du moment.
            </p>
          </div>
        </SectionReveal>

        <Section title="Entrées" items={entrees} />
        <Section title="Poissons & Fruits de Mer" items={poissons} />
        <Section title="Viandes & Volailles" items={viandes} />
        <Section title="Desserts" items={desserts} />

        <SectionReveal>
          <div
            style={{
              backgroundColor: C.bgDark,
              borderRadius: "1.75rem",
              padding: "2.5rem",
              marginTop: "1rem",
              marginBottom: "3rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
              <Wine size={20} color={C.accent} />
              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.6rem", fontWeight: 700, color: C.bg, margin: 0 }}>
                Sélection de la Cave
              </h2>
            </div>
            {vins.map((v, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1.5rem",
                  padding: "1.25rem 0",
                  borderBottom: i < vins.length - 1 ? "1px solid rgba(240,192,64,0.1)" : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: C.headingFont, fontSize: "1rem", fontWeight: 700, color: C.bg, marginBottom: "0.3rem" }}>
                    {v.name}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.45)" }}>{v.producer}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.accent }}>·</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.55)" }}>{v.appellation}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.accent }}>·</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.45)" }}>{v.vintage}</span>
                  </div>
                </div>
                <div style={{ fontFamily: C.headingFont, fontSize: "1.1rem", fontWeight: 700, color: C.accent, flexShrink: 0 }}>
                  {v.price}
                </div>
              </div>
            ))}
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(253,249,238,0.35)", marginTop: "1.5rem", marginBottom: 0 }}>
              Notre sommelier vous guide dans le choix des accords mets et vins. Carte des vins complète disponible en salle.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => goTo("reservation")}
              style={{
                backgroundColor: C.bgDark,
                color: C.accent,
                padding: "1rem 2.5rem",
                borderRadius: "3rem",
                border: "none",
                fontWeight: 700,
                fontFamily: C.bodyFont,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Réserver une table <ArrowRight size={16} />
            </button>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

// ─── ReservationPage ──────────────────────────────────────────────────────────
function ReservationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    covers: "2",
    name: "",
    phone: "",
    email: "",
    occasion: "",
    dietary: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 1.1rem",
    borderRadius: "0.75rem",
    border: `1.5px solid ${C.border}`,
    backgroundColor: C.white,
    fontFamily: C.bodyFont,
    fontSize: "0.92rem",
    color: C.text,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: C.bodyFont,
    fontSize: "0.8rem",
    fontWeight: 700,
    color: C.textLight,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: "0.45rem",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Réserver votre soirée
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              Réservation
            </h1>
            <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 480, margin: "0 auto", lineHeight: 1.85 }}>
              Nous serons heureux de vous accueillir. Réservez votre table en ligne, confirmée sous 24h.
            </p>
          </div>
        </SectionReveal>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              style={{
                backgroundColor: C.bgDark,
                borderRadius: "1.75rem",
                padding: "3.5rem 2.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: "rgba(240,192,64,0.14)",
                  border: `2px solid ${C.accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <Check size={28} color={C.accent} />
              </div>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.75rem", color: C.bg, fontWeight: 700, marginBottom: "1rem" }}>
                Demande envoyée
              </h2>
              <p style={{ fontFamily: C.bodyFont, fontSize: "1rem", color: "rgba(253,249,238,0.65)", lineHeight: 1.8, maxWidth: 400, margin: "0 auto" }}>
                Votre réservation est bien enregistrée. Confirmation par email sous 24h.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{
                  backgroundColor: C.white,
                  borderRadius: "1.75rem",
                  padding: "2.5rem",
                  border: `1px solid ${C.border}`,
                  boxShadow: `0 4px 40px ${C.shadow}`,
                }}
              >
                {/* Date, time, covers */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Heure</label>
                    <select name="time" value={form.time} onChange={handleChange} required style={inputStyle}>
                      <option value="">Choisir</option>
                      <option value="12h30">12h30</option>
                      <option value="13h00">13h00</option>
                      <option value="20h00">20h00</option>
                      <option value="20h30">20h30</option>
                      <option value="21h00">21h00</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Couverts</label>
                    <select name="covers" value={form.covers} onChange={handleChange} required style={inputStyle}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? "personne" : "personnes"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name, phone, email */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Nom complet</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Votre nom" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label style={labelStyle}>Téléphone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+33 6 00 00 00 00" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="vous@exemple.fr" style={inputStyle} />
                  </div>
                </div>

                {/* Occasion */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Occasion (optionnel)</label>
                  <select name="occasion" value={form.occasion} onChange={handleChange} style={inputStyle}>
                    <option value="">Aucune occasion particulière</option>
                    <option value="birthday">Anniversaire</option>
                    <option value="anniversary">Anniversaire de mariage</option>
                    <option value="business">Repas d'affaires</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                {/* Dietary */}
                <div style={{ marginBottom: "2rem" }}>
                  <label style={labelStyle}>Régimes & allergies (optionnel)</label>
                  <textarea
                    name="dietary"
                    value={form.dietary}
                    onChange={handleChange}
                    placeholder="Allergies, intolérances, préférences alimentaires..."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" as const }}
                  />
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(240,192,64,0.08)",
                    border: `1px solid rgba(240,192,64,0.25)`,
                    borderRadius: "0.75rem",
                    padding: "0.85rem 1.1rem",
                    marginBottom: "2rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.65rem",
                  }}
                >
                  <Users size={15} color={C.accentDark} style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: C.earth, lineHeight: 1.6, margin: 0 }}>
                    Pour les groupes de 8 personnes et plus, merci de nous contacter directement par téléphone ou par email.
                  </p>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    backgroundColor: C.bgDark,
                    color: C.accent,
                    padding: "1.1rem",
                    borderRadius: "1rem",
                    border: "none",
                    fontWeight: 700,
                    fontFamily: C.bodyFont,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  Confirmer ma réservation <ArrowRight size={16} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── ChefPage ─────────────────────────────────────────────────────────────────
function ChefPage() {
  const foodPhotos = [
    "photo-1414235077428-338989a2e8c0",
    "photo-1504674900247-0877df9cc836",
    "photo-1551218808-94e220e084d2",
    "photo-1559339352-11d035aa65de",
    "photo-1565299624946-b28f40a0ae38",
    "photo-1476224203421-9ac39bcb3327",
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Derrière les fourneaux
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              Le Chef
            </h1>
          </div>
        </SectionReveal>

        {/* Chef profile */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "start", marginBottom: "5rem" }}>
          <SectionReveal>
            <div
              style={{
                borderRadius: "2rem",
                overflow: "hidden",
                backgroundColor: C.bgDark,
                aspectRatio: "4/5",
                position: "relative",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80&fit=crop"
                alt="Chef Gabriel Renaud"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "2rem",
                  background: "linear-gradient(transparent, rgba(30,58,15,0.92))",
                }}
              >
                <div style={{ fontFamily: C.headingFont, fontSize: "1.5rem", fontWeight: 700, color: C.bg }}>
                  Gabriel Renaud
                </div>
                <div style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.accent, marginTop: "0.3rem" }}>
                  Chef exécutif & Propriétaire
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.14}>
            <div>
              <div
                style={{
                  backgroundColor: C.bgDark,
                  borderRadius: "1.35rem",
                  padding: "1.75rem",
                  marginBottom: "2rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ color: C.accent, flexShrink: 0, marginTop: "0.15rem" }}>
                  <Award size={22} />
                </div>
                <div>
                  <div style={{ fontFamily: C.headingFont, fontSize: "1rem", fontWeight: 700, color: C.bg, marginBottom: "0.35rem" }}>
                    2 Étoiles Michelin
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: "rgba(253,249,238,0.55)", lineHeight: 1.7, margin: 0 }}>
                    Distingué par le Guide Michelin depuis 2019. Récompense d'une cuisine ancrée dans le terroir et portée par une vision contemporaine exigeante.
                  </p>
                </div>
              </div>

              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "0.6rem" }}>
                La cuisine comme dialogue entre la terre et la saison
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.93rem", marginBottom: "1.2rem" }}>
                Né à Lyon en 1981, Gabriel Renaud grandit entre les marchés de la Presqu'île et la cuisine de sa grand-mère savoyarde. Très tôt passionné par les produits bruts, il entre à l'École Ferrandi Paris à 18 ans, où il apprend la rigueur classique tout en développant un regard sensible sur les matières premières.
              </p>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.93rem", marginBottom: "1.2rem" }}>
                Après des stages formateurs auprès de Paul Bocuse à Collonges-au-Mont-d'Or et chez Alain Ducasse au Louis XV à Monaco, il passe deux ans au Japon où il découvre le concept de <em>shun</em> — cuisiner l'instant exact de la maturité d'un ingrédient. Cette philosophie du temps juste deviendra le cœur de son identité culinaire.
              </p>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.93rem", marginBottom: "2rem" }}>
                En 2012, il ouvre son restaurant dans le Beaujolais, à deux pas des vignobles. Sa cuisine célèbre les producteurs locaux — maraîchers, éleveurs, fromagers — avec qui il entretient des relations étroites depuis le premier jour. Chaque assiette raconte un territoire, une saison, un moment précis de l'année.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  { icon: <ChefHat size={15} />, label: "Formation Ferrandi Paris, promotion 2001" },
                  { icon: <Star size={15} />, label: "Stage chez Paul Bocuse, Collonges-au-Mont-d'Or" },
                  { icon: <MapPin size={15} />, label: "2 ans au Japon — apprentissage du shun" },
                  { icon: <Award size={15} />, label: "Première étoile Michelin en 2016" },
                  { icon: <Award size={15} />, label: "Deuxième étoile Michelin en 2019" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ color: C.accent }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Philosophy quote */}
        <SectionReveal>
          <div
            style={{
              backgroundColor: C.bgDark,
              borderRadius: "2rem",
              padding: "3.5rem",
              textAlign: "center",
              marginBottom: "5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, rgba(240,192,64,0.6) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontFamily: C.headingFont, fontSize: "3rem", color: C.accent, opacity: 0.3, lineHeight: 0.8, marginBottom: "1rem" }}>"</div>
              <blockquote
                style={{
                  fontFamily: C.headingFont,
                  fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
                  color: C.bg,
                  lineHeight: 1.65,
                  maxWidth: 680,
                  margin: "0 auto 1.5rem",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                La cuisine, pour moi, c'est un dialogue permanent entre la terre et la saison. Je n'invente rien — j'écoute ce que les produits ont à dire et je les mets en scène le plus fidèlement possible.
              </blockquote>
              <div style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.accent, fontWeight: 700 }}>
                — Gabriel Renaud
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Food photo grid */}
        <SectionReveal>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "1.75rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem", textAlign: "center" }}>
            En cuisine
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {foodPhotos.map((photoId, i) => (
              <motion.div
                key={photoId}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                style={{
                  borderRadius: "1.1rem",
                  overflow: "hidden",
                  aspectRatio: "1/1",
                  backgroundColor: C.bgAlt,
                }}
              >
                <img
                  src={`https://images.unsplash.com/${photoId}?w=800&q=80&fit=crop`}
                  alt={`Création culinaire ${i + 1}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

// ─── ContactPage ──────────────────────────────────────────────────────────────
function ContactPage({ goTo }: { goTo: (p: RestoPage) => void }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Venez nous rendre visite
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              Contact & Accès
            </h1>
          </div>
        </SectionReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
          <SectionReveal>
            <div style={{ backgroundColor: C.bgDark, borderRadius: "1.75rem", padding: "2.5rem", height: "100%" }}>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.3rem", fontWeight: 700, color: C.bg, marginBottom: "1.75rem" }}>
                Nous trouver
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  { icon: <MapPin size={18} />, label: "Adresse", value: "Adresse communiquée sur demande à contact@aevia.io — Beaujolais, France" },
                  { icon: <Phone size={18} />, label: "Téléphone", value: "+33 4 74 XX XX XX" },
                  { icon: <Mail size={18} />, label: "Email", value: "contact@aevia.io" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "0.6rem",
                        backgroundColor: "rgba(240,192,64,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: C.accent,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.72rem", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.9rem", color: "rgba(253,249,238,0.7)", lineHeight: 1.55 }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div style={{ backgroundColor: C.white, borderRadius: "1.75rem", padding: "2.5rem", border: `1px solid ${C.border}`, height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.75rem" }}>
                <Clock size={18} color={C.accentDark} />
                <h2 style={{ fontFamily: C.headingFont, fontSize: "1.3rem", fontWeight: 700, color: C.text, margin: 0 }}>
                  Horaires d'ouverture
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { day: "Mardi – Samedi", service: "Déjeuner", hours: "12h00 – 14h00" },
                  { day: "Mardi – Samedi", service: "Dîner", hours: "19h30 – 22h00" },
                  { day: "Dimanche", service: "", hours: "Fermé" },
                  { day: "Lundi", service: "", hours: "Fermé" },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem 0",
                      borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", fontWeight: 600, color: C.text }}>{s.day}</div>
                      {s.service && <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, marginTop: "0.15rem" }}>{s.service}</div>}
                    </div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", color: s.hours === "Fermé" ? C.textMuted : C.accentDark, fontWeight: 600 }}>
                      {s.hours}
                    </div>
                  </div>
                ))}
              </div>

              <GoldDivider />

              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {[
                  { icon: "🅿️", text: "Parking disponible sur place" },
                  { icon: "♿", text: "Accès PMR — Restaurant de plain-pied" },
                  { icon: "🚗", text: "Service voiturier vendredi et samedi soir" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.textLight }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal delay={0.15}>
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => goTo("reservation")}
              style={{
                backgroundColor: C.bgDark,
                color: C.accent,
                padding: "1rem 2.5rem",
                borderRadius: "3rem",
                border: "none",
                fontWeight: 700,
                fontFamily: C.bodyFont,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Réserver une table <Calendar size={16} />
            </button>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

// ─── LegalPage ────────────────────────────────────────────────────────────────
function LegalPage({ type }: { type: "mentions" | "privacy" }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "6rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <h1 style={{ fontFamily: C.headingFont, fontSize: "2.5rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem" }}>
            {type === "mentions" ? "Mentions légales" : "Politique de confidentialité"}
          </h1>
          <GoldDivider />
        </SectionReveal>

        <SectionReveal delay={0.1}>
          {type === "mentions" ? (
            <div style={{ fontFamily: C.bodyFont, fontSize: "0.92rem", color: C.textLight, lineHeight: 1.9 }}>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.text, fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
                Éditeur du site
              </h2>
              <p>
                Ce site est édité par <strong style={{ color: C.text }}>Aevia WS</strong>, auto-entrepreneur.<br />
                SIREN : 852 546 225<br />
                Contact : <a href="mailto:contact@aevia.io" style={{ color: C.accentDark }}>contact@aevia.io</a><br />
                Adresse du siège social : communiquée sur demande.
              </p>

              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.text, fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
                Hébergement
              </h2>
              <p>
                <strong style={{ color: C.text }}>Vercel Inc.</strong><br />
                340 Pine Street, Suite 701, San Francisco, CA 94104, USA<br />
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: C.accentDark }}>vercel.com</a>
              </p>

              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.text, fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
                Propriété intellectuelle
              </h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, visuels, logos) est la propriété exclusive d'Aevia WS, sauf mentions contraires. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
              </p>

              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.text, fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
                Responsabilité
              </h2>
              <p>
                Aevia WS s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exhaustivité ou l'absence d'erreur. Les informations tarifaires et les disponibilités sont susceptibles d'évoluer sans préavis.
              </p>
            </div>
          ) : (
            <div style={{ fontFamily: C.bodyFont, fontSize: "0.92rem", color: C.textLight, lineHeight: 1.9 }}>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.text, fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
                Données collectées
              </h2>
              <p>
                Dans le cadre de la prise de réservation en ligne, nous collectons les données suivantes : nom et prénom, adresse email, numéro de téléphone, date et heure souhaitées, nombre de convives, informations relatives à l'occasion et aux régimes alimentaires.
              </p>

              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.text, fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
                Finalité du traitement
              </h2>
              <p>
                Ces données sont utilisées exclusivement pour la gestion et la confirmation de votre réservation, et pour vous contacter en cas de nécessité. Elles ne sont ni revendues ni transmises à des tiers.
              </p>

              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.text, fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
                Conservation & droits
              </h2>
              <p>
                Les données sont conservées pour une durée maximale de 3 ans à compter de votre dernière interaction. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, contactez-nous à{" "}
                <a href="mailto:contact@aevia.io" style={{ color: C.accentDark }}>contact@aevia.io</a>.
              </p>

              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.text, fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
                Cookies
              </h2>
              <p>
                Ce site n'utilise pas de cookies tiers à des fins publicitaires ou de suivi. Des cookies techniques essentiels peuvent être utilisés pour assurer le bon fonctionnement du site.
              </p>

              <p style={{ marginTop: "2rem", fontSize: "0.83rem", color: C.textMuted }}>
                Responsable du traitement : Aevia WS — SIREN 852 546 225 — contact@aevia.io
              </p>
            </div>
          )}
        </SectionReveal>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function GastronomyPage() {
  const [page, setPage] = useState<RestoPage>("home");
  const [activeSeason, setActiveSeason] = useState<Season>("spring");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  const goTo = (p: RestoPage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks: { label: string; page: RestoPage }[] = [
    { label: "Menus", page: "menu" },
    { label: "À la Carte", page: "carte" },
    { label: "Réservation", page: "reservation" },
    { label: "Le Chef", page: "chef" },
    { label: "Contact", page: "contact" },
  ];

  const isOnHome = page === "home";
  const navBg = scrolled || !isOnHome ? "rgba(253,249,238,0.96)" : "transparent";
  const navShadow = scrolled || !isOnHome ? `0 1px 24px ${C.shadow}` : "none";
  const navBlur = scrolled || !isOnHome ? "blur(14px)" : "none";
  const logoColor = scrolled || !isOnHome ? C.bgDark : C.bg;
  const linkColor = scrolled || !isOnHome ? C.textLight : "rgba(253,249,238,0.8)";
  const linkHoverColor = scrolled || !isOnHome ? C.bgDark : C.accent;

  return (
    <div style={{ fontFamily: C.bodyFont, backgroundColor: C.bg, color: C.text, overflowX: "clip" }}>

      {/* ── NAVBAR (always visible) ── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: scrolled || !isOnHome ? "0.7rem 2.5rem" : "1.3rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: navBg,
          backdropFilter: navBlur,
          boxShadow: navShadow,
          transition: "all 0.38s ease",
        }}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => goTo("home")}
          style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <div
            style={{
              width: 38, height: 38,
              borderRadius: "50%",
              backgroundColor: C.bgDark,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <UtensilsCrossed size={17} color={C.accent} />
          </div>
          <span style={{ fontFamily: C.headingFont, fontSize: "1.4rem", fontWeight: 700, color: logoColor, transition: "color 0.3s" }}>
            Gabriel Renaud
          </span>
        </button>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {navLinks.map((l) => (
            <button
              key={l.page}
              type="button"
              onClick={() => goTo(l.page)}
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.88rem",
                color: page === l.page ? C.accent : linkColor,
                textDecoration: "none",
                fontWeight: page === l.page ? 700 : 500,
                transition: "color 0.2s",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                borderBottom: page === l.page ? `2px solid ${C.accent}` : "2px solid transparent",
                paddingBottom: "2px",
              }}
              onMouseEnter={(e) => { if (page !== l.page) (e.currentTarget as HTMLButtonElement).style.color = linkHoverColor; }}
              onMouseLeave={(e) => { if (page !== l.page) (e.currentTarget as HTMLButtonElement).style.color = linkColor; }}
            >
              {l.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goTo("reservation")}
            style={{
              backgroundColor: C.bgDark,
              color: C.accent,
              padding: "0.55rem 1.35rem",
              borderRadius: "2rem",
              fontSize: "0.87rem",
              fontWeight: 700,
              fontFamily: C.bodyFont,
              border: "none",
              cursor: "pointer",
            }}
          >
            Réserver
          </button>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }}
          aria-label="Menu"
        >
          {menuOpen ? <X color={logoColor} size={24} /> : <Menu color={logoColor} size={24} />}
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              position: "fixed",
              top: 64, left: 0, right: 0,
              zIndex: 99,
              backgroundColor: C.bg,
              padding: "1.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              boxShadow: `0 8px 32px ${C.shadow}`,
            }}
          >
            {navLinks.map((l) => (
              <button
                key={l.page}
                type="button"
                onClick={() => { goTo(l.page); setMenuOpen(false); }}
                style={{
                  color: page === l.page ? C.accentDark : C.text,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.05rem",
                  fontFamily: C.bodyFont,
                  fontWeight: page === l.page ? 700 : 500,
                  textAlign: "left",
                  padding: 0,
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { goTo("reservation"); setMenuOpen(false); }}
              style={{
                backgroundColor: C.bgDark,
                color: C.accent,
                padding: "0.7rem 1.5rem",
                borderRadius: "2rem",
                fontWeight: 700,
                fontFamily: C.bodyFont,
                border: "none",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Réserver
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PAGE GATE ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {page === "home" && (
            <>
              {/* ── HERO ── */}
              <section
                ref={heroRef}
                style={{
                  minHeight: "100vh",
                  backgroundColor: C.bgDark,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  paddingTop: "5rem",
                }}
              >
                {/* Background image */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop"
                    alt="Cuisine gastronomique"
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }}
                  />
                </div>

                {/* Background rings */}
                {[340, 220, 120].map((size, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: "12%",
                      right: `${6 + i * 5}%`,
                      width: size,
                      height: size,
                      borderRadius: "50%",
                      border: `1.5px solid rgba(240,192,64,${0.08 + i * 0.04})`,
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />
                ))}

                {/* Texture dots */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "radial-gradient(circle, rgba(240,192,64,0.06) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />

                <motion.div
                  style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 860, padding: "2rem 1.5rem", position: "relative", zIndex: 2 }}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      display: "inline-block",
                      backgroundColor: "rgba(240,192,64,0.12)",
                      border: `1px solid rgba(240,192,64,0.35)`,
                      color: C.accent,
                      padding: "0.35rem 1.1rem",
                      borderRadius: "2rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: "1.75rem",
                      fontFamily: C.bodyFont,
                    }}
                  >
                    2 étoiles Michelin · Beaujolais
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.14 }}
                    style={{
                      fontFamily: C.headingFont,
                      fontSize: "clamp(3rem, 7.5vw, 5.8rem)",
                      fontWeight: 700,
                      color: C.bg,
                      lineHeight: 1.08,
                      marginBottom: "1.5rem",
                    }}
                  >
                    La cuisine comme<br />
                    <span style={{ color: C.accent }}>dialogue avec la saison</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.28 }}
                    style={{
                      fontFamily: C.bodyFont,
                      fontSize: "1.12rem",
                      color: "rgba(253,249,238,0.72)",
                      maxWidth: 560,
                      margin: "0 auto 2.75rem",
                      lineHeight: 1.8,
                    }}
                  >
                    Restaurant gastronomique saisonnier. Chef Gabriel Renaud compose chaque assiette autour des producteurs locaux du Beaujolais, au rythme de la nature.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.42 }}
                    style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
                  >
                    <button
                      type="button"
                      onClick={() => goTo("reservation")}
                      style={{
                        backgroundColor: C.accent,
                        color: C.bgDark,
                        padding: "1rem 2.4rem",
                        borderRadius: "3rem",
                        border: "none",
                        fontWeight: 800,
                        fontFamily: C.bodyFont,
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow: "0 8px 32px rgba(240,192,64,0.32)",
                        cursor: "pointer",
                      }}
                    >
                      Réserver une table <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goTo("menu")}
                      style={{
                        border: `2px solid rgba(253,249,238,0.28)`,
                        color: C.bg,
                        padding: "1rem 2.4rem",
                        borderRadius: "3rem",
                        background: "none",
                        fontWeight: 600,
                        fontFamily: C.bodyFont,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                      }}
                    >
                      Découvrir nos menus
                    </button>
                  </motion.div>

                  {/* Hero stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.58 }}
                    style={{ display: "flex", gap: "3rem", justifyContent: "center", marginTop: "4rem", flexWrap: "wrap" }}
                  >
                    {[
                      { val: "2", label: "étoiles Michelin" },
                      { val: "12", label: "années d'excellence" },
                      { val: "85+", label: "producteurs partenaires" },
                      { val: "4", label: "menus de saison" },
                    ].map((s) => (
                      <div key={s.label} style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: C.headingFont, fontSize: "2.1rem", fontWeight: 700, color: C.accent }}>{s.val}</div>
                        <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.55)", marginTop: "0.2rem", letterSpacing: "0.02em" }}>{s.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  animate={{ y: [0, 9, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}
                >
                  <ChevronDown color={C.accent} size={30} opacity={0.55} />
                </motion.div>
              </section>

              {/* ── SEASONAL PRODUCE ── */}
              <section style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
                <div style={{ maxWidth: 1140, margin: "0 auto" }}>
                  <SectionReveal>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.earth }}>
                        Notre philosophie
                      </span>
                      <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.text, marginTop: "0.6rem", marginBottom: "1rem", fontWeight: 700 }}>
                        Les produits du moment
                      </h2>
                      <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
                        Nos menus évoluent chaque semaine avec les arrivages de nos producteurs partenaires. Chaque saison offre sa palette de saveurs.
                      </p>
                    </div>
                  </SectionReveal>

                  {/* Season tabs */}
                  <SectionReveal delay={0.1}>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" }}>
                      {seasons.map((s) => {
                        const sd = seasonData[s];
                        const isActive = activeSeason === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setActiveSeason(s)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                              padding: "0.6rem 1.5rem",
                              borderRadius: "2rem",
                              border: `2px solid ${isActive ? sd.color : C.border}`,
                              backgroundColor: isActive ? sd.color : "transparent",
                              color: isActive ? C.white : C.textLight,
                              fontFamily: C.bodyFont,
                              fontSize: "0.88rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.25s ease",
                            }}
                          >
                            {sd.icon}
                            {sd.label}
                          </button>
                        );
                      })}
                    </div>
                  </SectionReveal>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSeason}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.38 }}
                      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.25rem" }}
                    >
                      {seasonData[activeSeason].items.map((item, i) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.07 }}
                          whileHover={{ y: -5, boxShadow: `0 16px 44px ${C.shadow}` }}
                          style={{
                            backgroundColor: C.white,
                            borderRadius: "1.35rem",
                            padding: "1.6rem",
                            border: `1px solid ${C.border}`,
                            cursor: "default",
                            transition: "box-shadow 0.3s",
                          }}
                        >
                          <div style={{ marginBottom: "0.8rem" }}><TemplateIcon emoji={item.emoji} size={32} /></div>
                          <h3 style={{ fontFamily: C.headingFont, fontSize: "1.05rem", color: C.text, fontWeight: 700, marginBottom: "0.45rem" }}>
                            {item.name}
                          </h3>
                          <p style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, lineHeight: 1.65 }}>{item.desc}</p>
                          <div style={{ marginTop: "1.1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: seasonData[activeSeason].color }} />
                            <span style={{ fontSize: "0.77rem", color: seasonData[activeSeason].color, fontWeight: 700, fontFamily: C.bodyFont }}>
                              {seasonData[activeSeason].label}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </section>

              {/* ── CHEF TEASER ── */}
              <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
                <div style={{ maxWidth: 1140, margin: "0 auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "5rem", alignItems: "center" }}>
                    <SectionReveal>
                      <div
                        style={{
                          backgroundColor: C.bgDark,
                          borderRadius: "2rem",
                          overflow: "hidden",
                          position: "relative",
                          minHeight: 380,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&fit=crop"
                          alt="Chef Gabriel Renaud au travail"
                          loading="lazy"
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
                        />
                        <div style={{ position: "relative", zIndex: 2, padding: "2.5rem" }}>
                          <div style={{ fontFamily: C.headingFont, fontSize: "2rem", color: C.bg, fontWeight: 700 }}>Gabriel Renaud</div>
                          <div style={{ fontFamily: C.bodyFont, color: C.accent, fontSize: "0.88rem", marginTop: "0.3rem" }}>
                            Chef exécutif · 2 étoiles Michelin
                          </div>
                        </div>
                      </div>
                    </SectionReveal>

                    <SectionReveal delay={0.14}>
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.earth }}>
                        L'âme du restaurant
                      </span>
                      <h2
                        style={{
                          fontFamily: C.headingFont,
                          fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)",
                          color: C.text,
                          fontWeight: 700,
                          margin: "0.75rem 0 1.35rem",
                          lineHeight: 1.2,
                        }}
                      >
                        Une cuisine ancrée dans le terroir, portée par l'instant
                      </h2>
                      <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.94rem", marginBottom: "1.25rem" }}>
                        Formé à Ferrandi Paris, passé par les cuisines de Bocuse et de Ducasse, Gabriel Renaud a construit une philosophie culinaire autour d'un seul principe : cuisiner l'instant exact de maturité d'un produit.
                      </p>
                      <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.94rem", marginBottom: "2.25rem" }}>
                        Son séjour au Japon lui a révélé le concept de <em>shun</em> — cet instant fugace où un ingrédient est à son apogée. Chaque plat est une invitation à vivre cet instant avec lui.
                      </p>
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => goTo("chef")}
                          style={{
                            backgroundColor: C.bgDark,
                            color: C.accent,
                            padding: "0.85rem 2rem",
                            borderRadius: "2rem",
                            border: "none",
                            fontWeight: 700,
                            fontFamily: C.bodyFont,
                            fontSize: "0.9rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          Rencontrer le Chef <ArrowRight size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => goTo("menu")}
                          style={{
                            border: `2px solid ${C.border}`,
                            color: C.textLight,
                            padding: "0.85rem 2rem",
                            borderRadius: "2rem",
                            background: "none",
                            fontWeight: 600,
                            fontFamily: C.bodyFont,
                            fontSize: "0.9rem",
                            cursor: "pointer",
                          }}
                        >
                          Voir les menus
                        </button>
                      </div>
                    </SectionReveal>
                  </div>
                </div>
              </section>

              {/* ── TESTIMONIALS ── */}
              <section style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
                <div style={{ maxWidth: 1140, margin: "0 auto" }}>
                  <SectionReveal>
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.earth }}>
                        Ce qu'ils en disent
                      </span>
                      <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.9rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0" }}>
                        Avis & Critiques
                      </h2>
                    </div>
                  </SectionReveal>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
                    {testimonials.map((t, i) => (
                      <SectionReveal key={t.name} delay={i * 0.1}>
                        <div
                          style={{
                            backgroundColor: C.white,
                            borderRadius: "1.6rem",
                            padding: "2.25rem",
                            border: `1px solid ${C.border}`,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: `0 2px 20px ${C.shadow}`,
                          }}
                        >
                          <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1.35rem" }}>
                            {Array.from({ length: t.rating }).map((_, j) => (
                              <Star key={j} size={15} color={C.accent} fill={C.accent} />
                            ))}
                          </div>
                          <p style={{ fontFamily: C.bodyFont, fontSize: "0.93rem", color: C.textLight, lineHeight: 1.82, flex: 1, fontStyle: "italic" }}>
                            "{t.text}"
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginTop: "1.75rem" }}>
                            <div
                              style={{
                                width: 46, height: 46,
                                borderRadius: "50%",
                                backgroundColor: C.bgDark,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: C.headingFont,
                                fontSize: "0.85rem",
                                color: C.accent,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {t.avatar}
                            </div>
                            <div>
                              <div style={{ fontFamily: C.bodyFont, fontWeight: 700, fontSize: "0.9rem", color: C.text }}>{t.name}</div>
                              <div style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted, marginTop: "0.1rem" }}>{t.role}</div>
                            </div>
                          </div>
                        </div>
                      </SectionReveal>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── CTA BAND ── */}
              <section style={{ backgroundColor: C.bgDark, padding: "5rem 2rem" }}>
                <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
                  <SectionReveal>
                    <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: C.bg, fontWeight: 700, marginBottom: "1rem", lineHeight: 1.2 }}>
                      Vivez l'expérience<br />
                      <span style={{ color: C.accent }}>Gabriel Renaud</span>
                    </h2>
                    <p style={{ fontFamily: C.bodyFont, color: "rgba(253,249,238,0.6)", fontSize: "1rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
                      Tables disponibles le mardi au samedi, déjeuner et dîner. Réservation conseillée 2 à 3 semaines à l'avance.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => goTo("reservation")}
                        style={{
                          backgroundColor: C.accent,
                          color: C.bgDark,
                          padding: "1rem 2.5rem",
                          borderRadius: "3rem",
                          border: "none",
                          fontWeight: 800,
                          fontFamily: C.bodyFont,
                          fontSize: "0.95rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          boxShadow: "0 8px 32px rgba(240,192,64,0.28)",
                        }}
                      >
                        Réserver ma table <ArrowRight size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo("menu")}
                        style={{
                          border: `2px solid rgba(253,249,238,0.22)`,
                          color: C.bg,
                          padding: "1rem 2.5rem",
                          borderRadius: "3rem",
                          background: "none",
                          fontWeight: 600,
                          fontFamily: C.bodyFont,
                          fontSize: "0.95rem",
                          cursor: "pointer",
                        }}
                      >
                        Nos menus
                      </button>
                    </div>
                  </SectionReveal>
                </div>
              </section>
            </>
          )}

          {page === "menu" && <MenuPage goTo={goTo} />}
          {page === "carte" && <CartePage goTo={goTo} />}
          {page === "reservation" && <ReservationPage />}
          {page === "chef" && <ChefPage />}
          {page === "contact" && <ContactPage goTo={goTo} />}
          {(page === "mentions" || page === "privacy") && <LegalPage type={page} />}
        </motion.div>
      </AnimatePresence>

      {/* ── FOOTER (always visible) ── */}
      <footer style={{ backgroundColor: C.bgDark, padding: "5rem 2.5rem 2.5rem" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1.35rem" }}>
                <div
                  style={{
                    width: 38, height: 38,
                    borderRadius: "50%",
                    backgroundColor: "rgba(240,192,64,0.14)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <UtensilsCrossed size={17} color={C.accent} />
                </div>
                <span style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.bg, fontWeight: 700 }}>Gabriel Renaud</span>
              </div>
              <p style={{ fontFamily: C.bodyFont, fontSize: "0.86rem", color: "rgba(253,249,238,0.5)", lineHeight: 1.8, maxWidth: 290 }}>
                Restaurant gastronomique saisonnier dans le Beaujolais. Cuisine du marché, produits locaux, 2 étoiles Michelin.
              </p>
              <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {[
                  { icon: <MapPin size={13} />, text: "Adresse sur demande — Beaujolais" },
                  { icon: <Phone size={13} />, text: "+33 4 74 XX XX XX" },
                  { icon: <Mail size={13} />, text: "contact@aevia.io" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: C.accent }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(253,249,238,0.45)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Navigation",
                links: [
                  { label: "Menus", page: "menu" as RestoPage },
                  { label: "À la Carte", page: "carte" as RestoPage },
                  { label: "Réservation", page: "reservation" as RestoPage },
                  { label: "Le Chef", page: "chef" as RestoPage },
                ],
              },
              {
                title: "Le Restaurant",
                links: [
                  { label: "Contact & Accès", page: "contact" as RestoPage },
                  { label: "Notre philosophie", page: "chef" as RestoPage },
                  { label: "Réservation privée", page: "reservation" as RestoPage },
                  { label: "Carte des vins", page: "carte" as RestoPage },
                ],
              },
              {
                title: "Légal",
                links: [
                  { label: "Mentions légales", page: "mentions" as RestoPage },
                  { label: "Confidentialité", page: "privacy" as RestoPage },
                  { label: "Contact", page: "contact" as RestoPage },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: C.headingFont, fontSize: "1rem", color: C.bg, fontWeight: 700, marginBottom: "1.35rem" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={() => goTo(link.page)}
                        style={{
                          fontFamily: C.bodyFont,
                          fontSize: "0.875rem",
                          color: "rgba(253,249,238,0.45)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.accent)}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(253,249,238,0.45)")}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(253,249,238,0.09)",
              paddingTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(253,249,238,0.3)" }}>
              © 2026 Aevia WS · SIREN 852 546 225. Tous droits réservés.
            </p>
            <div style={{ display: "flex", gap: "1.75rem" }}>
              {[
                { label: "Mentions légales", page: "mentions" as RestoPage },
                { label: "Confidentialité", page: "privacy" as RestoPage },
              ].map((l) => (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => goTo(l.page)}
                  style={{
                    fontFamily: C.bodyFont,
                    fontSize: "0.8rem",
                    color: "rgba(253,249,238,0.3)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(253,249,238,0.6)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(253,249,238,0.3)")}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
