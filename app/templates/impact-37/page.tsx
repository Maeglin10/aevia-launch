"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Star,
  Check,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  MessageSquare,
  Link2,
  Camera,
  Bookmark,
  Users2,
  Wine,
  Grape,
  Globe,
  Award,
  Menu,
  X,
} from "lucide-react";

/* ==========================================================================
   PAGE NAVIGATION MODEL
   --------------------------------------------------------------------------
   PATTERN (reused from impact-99 / impact-168): a single `page` state drives
   in-page navigation. The original single-page content is rendered VERBATIM
   under page === "home"; every other key renders a theme-native sub-page built
   from the EXACT same design language — the C palette (burgundy/gold/cream),
   Cormorant Garamond + Lato fonts, the SectionReveal helper, and the same
   card/section styling. Nav + footer stay OUTSIDE the gate so they appear on
   every page. No new styling is introduced — only the theme's own tokens.
   Clos du Soir is a wine BAR / sommelier experience (vitrine), so the page set
   is bar-leaning: Accueil · Carte · Cave · Réservation · Blog · Contact ·
   Mentions (+ Confidentialité). No CGV (no cart / checkout).
   ========================================================================= */

type SoirPage =
  | "home"
  | "carte"
  | "cave"
  | "reservation"
  | "blog"
  | "contact"
  | "mentions"
  | "privacy";

const NAV_PAGES: { key: SoirPage; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "carte", label: "La Carte" },
  { key: "cave", label: "La Cave" },
  { key: "reservation", label: "Réservation" },
  { key: "blog", label: "Journal" },
  { key: "contact", label: "Contact" },
];

const C = {
  bg: "#fdf6ec",
  bgAlt: "#f9efe0",
  text: "#2d1a0e",
  textMuted: "#7a5c40",
  burgundy: "#4a0e2e",
  burgundyDark: "#35091f",
  burgundyLight: "#6b1a45",
  gold: "#c9a84c",
  goldLight: "#f5e9c6",
  rose: "#e8a5b0",
  roseLight: "#fdf0f2",
  cream: "#fdf6ec",
  border: "#e8d4b8",
  white: "#ffffff",
};

const WINE_REGIONS = [
  {
    region: "Bordeaux",
    flag: "FR",
    description: "Left Bank Cabernet-forward blends with profound structure and cellaring potential.",
    selections: [
      { name: "Chateau Margaux 2018", grape: "Cab. Sauvignon", price: "42", glass: true },
      { name: "Pomerol Petite Reserve", grape: "Merlot", price: "28", glass: true },
      { name: "Saint-Emilion Grand Cru", grape: "Merlot Blend", price: "22", glass: true },
    ],
  },
  {
    region: "Burgundy",
    flag: "FR",
    description: "Pinot Noir and Chardonnay from the Cote d'Or — the spiritual heart of French wine.",
    selections: [
      { name: "Gevrey-Chambertin 1er Cru", grape: "Pinot Noir", price: "38", glass: true },
      { name: "Meursault Blanc", grape: "Chardonnay", price: "26", glass: true },
      { name: "Pommard Villages", grape: "Pinot Noir", price: "19", glass: true },
    ],
  },
  {
    region: "Tuscany",
    flag: "IT",
    description: "Sangiovese-based wines from Chianti Classico and Brunello — earthy, bold, expressive.",
    selections: [
      { name: "Brunello di Montalcino", grape: "Sangiovese", price: "48", glass: true },
      { name: "Chianti Classico Riserva", grape: "Sangiovese", price: "24", glass: true },
      { name: "Bolgheri Sassicaia 2019", grape: "Cab. Blend", price: "55", glass: true },
    ],
  },
  {
    region: "Rioja & Natural",
    flag: "ES",
    description: "Tempranillo from Spain's Rioja alongside our curated natural wine selection.",
    selections: [
      { name: "La Rioja Alta Gran Reserva", grape: "Tempranillo", price: "32", glass: true },
      { name: "Envinate Migan", grape: "Listan Negro", price: "18", glass: true },
      { name: "Gut Oggau Josephine", grape: "Natural Blend", price: "22", glass: true },
    ],
  },
];

const EVENTS = [
  {
    date: "15 Jun",
    title: "Bordeaux Grands Crus Evening",
    desc: "6 wines including two 2016 first growths, guided by Maison Bourgeois.",
    spots: 14,
    price: "145",
    sold: false,
  },
  {
    date: "22 Jun",
    title: "Natural Wine Discovery Night",
    desc: "Low-intervention wines from small producers in France, Spain, and Georgia.",
    spots: 0,
    price: "85",
    sold: true,
  },
  {
    date: "6 Jul",
    title: "Champagne & Food Pairing",
    desc: "Grower Champagnes paired with fine fromage and charcuterie by Chef Dupont.",
    spots: 8,
    price: "120",
    sold: false,
  },
  {
    date: "20 Jul",
    title: "Burgundy Masterclass",
    desc: "Vertical tasting of Gevrey-Chambertin across three vintages with Marie-Helene Fabre MW.",
    spots: 12,
    price: "180",
    sold: false,
  },
];

const MEMBERSHIP_TIERS = [
  {
    name: "Cave",
    price: "89",
    period: "per month",
    tagline: "For the curious",
    features: [
      "2 complimentary glasses/month",
      "10% off all bottles & events",
      "Monthly tasting notes newsletter",
      "Early access to events",
      "Member welcome kit",
    ],
    highlight: false,
    color: C.gold,
  },
  {
    name: "Sommelier",
    price: "189",
    period: "per month",
    tagline: "For the devoted",
    features: [
      "1 curated bottle/month to keep",
      "4 complimentary glasses/month",
      "15% off all purchases",
      "Priority event reservation",
      "Quarterly sommelier consultation",
      "Cellar storage (12 bottles)",
      "Birthday bottle gift",
    ],
    highlight: true,
    color: C.burgundy,
  },
  {
    name: "Grand Cru",
    price: "390",
    period: "per month",
    tagline: "For the connoisseur",
    features: [
      "3 curated prestige bottles/month",
      "Unlimited complimentary pours",
      "Private dining reservation priority",
      "Annual en primeur allocation",
      "Dedicated sommelier on-call",
      "Unlimited cellar storage",
      "Exclusive members-only events",
      "Airport lounge wine gift kit",
    ],
    highlight: false,
    color: C.gold,
  },
];

const TESTIMONIALS = [
  {
    name: "Helene Beaumont",
    role: "Grand Cru Member",
    avatar: "HB",
    text: "Clos du Soir is where I celebrate everything that matters. The sommelier team's knowledge and warmth make every visit feel like coming home — only with better wine.",
    rating: 5,
  },
  {
    name: "Antoine Mercier",
    role: "Cave Member",
    avatar: "AM",
    text: "I joined knowing nothing about wine. Twelve months later I'm cellaring bottles with confidence. The education is embedded in every experience here.",
    rating: 5,
  },
  {
    name: "Isabella Conti",
    role: "Sommelier Member",
    avatar: "IC",
    text: "The monthly bottle curation is extraordinary. They sourced a Barolo I'd been searching for three years — delivered to my home with handwritten tasting notes.",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "Do I need wine knowledge to visit or join?",
    a: "Absolutely not. Clos du Soir welcomes everyone from curious newcomers to seasoned collectors. Our team adapts to your level — we speak wine, not jargon.",
  },
  {
    q: "Can I purchase bottles to take home?",
    a: "Yes. Our retail cellar carries 280+ references. Members receive 10-15% discount. We offer professional packing for travel and can arrange delivery within France.",
  },
  {
    q: "How does cellar storage work for Sommelier and Grand Cru members?",
    a: "We maintain a climate-controlled cellar at 12-14°C with 70% humidity. Bottles are tracked digitally. You can access or add to your collection any time we're open.",
  },
  {
    q: "Are private events possible?",
    a: "Yes — we host private tastings for groups of 8-40, corporate events, and intimate dinners. Our sommelier team creates bespoke programs. Contact us for availability.",
  },
  {
    q: "What food is served?",
    a: "Our kitchen offers curated cheese and charcuterie boards, seasonal small plates designed to complement the evening's wines, and special menus for tasting events.",
  },
  {
    q: "How do I pause or cancel my membership?",
    a: "Memberships can be paused once per year for up to 2 months. Cancellation requires 30 days notice. We process everything seamlessly — no penalties.",
  },
];

/* ── LA CARTE — vins au verre + planches (theme-native FR data) ──────────── */

const CARTE_SECTIONS = [
  {
    id: "blancs",
    label: "Vins au Verre — Blancs",
    note: "Servis 12cl // Sélection du soir",
    items: [
      { name: "Meursault Premier Cru", origin: "Bourgogne · Chardonnay", year: "2020", price: "26" },
      { name: "Sancerre Les Monts Damnés", origin: "Loire · Sauvignon Blanc", year: "2022", price: "14" },
      { name: "Riesling Grand Cru Schlossberg", origin: "Alsace · Riesling", year: "2019", price: "16" },
      { name: "Chablis Vieilles Vignes", origin: "Bourgogne · Chardonnay", year: "2021", price: "13" },
    ],
  },
  {
    id: "rouges",
    label: "Vins au Verre — Rouges",
    note: "Servis 12cl // Carafés à la demande",
    items: [
      { name: "Châteauneuf-du-Pape", origin: "Rhône · Grenache", year: "2019", price: "18" },
      { name: "Gevrey-Chambertin 1er Cru", origin: "Bourgogne · Pinot Noir", year: "2018", price: "24" },
      { name: "Saint-Émilion Grand Cru", origin: "Bordeaux · Merlot", year: "2017", price: "17" },
      { name: "Brunello di Montalcino", origin: "Toscane · Sangiovese", year: "2018", price: "22" },
    ],
  },
  {
    id: "bulles",
    label: "Champagnes & Bulles",
    note: "Vignerons indépendants // Faible dosage",
    items: [
      { name: "Champagne Blanc de Blancs", origin: "Côte des Blancs · Chardonnay", year: "Brut", price: "19" },
      { name: "Champagne Rosé de Saignée", origin: "Vallée de la Marne · Pinot Noir", year: "Brut Nature", price: "23" },
      { name: "Crémant de Bourgogne", origin: "Bourgogne · Chardonnay", year: "Extra-Brut", price: "12" },
    ],
  },
  {
    id: "planches",
    label: "Planches & Accompagnements",
    note: "À partager // Produits de petits producteurs",
    items: [
      { name: "Planche de Fromages Affinés", origin: "Cinq fromages, confiture de figue, noix", year: "—", price: "24" },
      { name: "Charcuterie de la Maison", origin: "Jambon de pays, saucisson, terrine", year: "—", price: "22" },
      { name: "Planche Mixte du Sommelier", origin: "Fromages, charcuterie, pain au levain", year: "—", price: "32" },
      { name: "Assortiment d'Olives & Amandes", origin: "Olives Lucques, amandes torréfiées", year: "—", price: "9" },
    ],
  },
];

/* ── LA CAVE — bouteilles à la vente (vitrine, sans panier) ──────────────── */

const CAVE_BOTTLES = [
  { name: "Château Margaux", appellation: "Margaux · 1er Grand Cru Classé", year: "2018", price: "680", region: "Bordeaux", note: "Élégance veloutée, tanins soyeux, garde 30 ans." },
  { name: "Pommard Les Rugiens", appellation: "Pommard · Premier Cru", year: "2019", price: "92", region: "Bourgogne", note: "Pinot Noir structuré, fruits noirs et sous-bois." },
  { name: "Hermitage La Chapelle", appellation: "Hermitage · Rhône Nord", year: "2017", price: "245", region: "Rhône", note: "Syrah septentrionale, profondeur épicée." },
  { name: "Sassicaia", appellation: "Bolgheri · Toscane", year: "2019", price: "320", region: "Italie", note: "Assemblage bordelais solaire, grande allonge." },
  { name: "Meursault Les Charmes", appellation: "Meursault · Premier Cru", year: "2020", price: "118", region: "Bourgogne", note: "Chardonnay beurré, minéralité ciselée." },
  { name: "La Rioja Alta Gran Reserva 904", appellation: "Rioja · Espagne", year: "2015", price: "78", region: "Espagne", note: "Tempranillo patiné, cuir et vanille douce." },
];

/* ── JOURNAL — articles mock FR (dégustation / accords / vignobles) ──────── */

const BLOG_POSTS = [
  {
    slug: "art-degustation",
    title: "L'Art de la Dégustation",
    date: "2 juin 2026",
    category: "Dégustation",
    excerpt:
      "Œil, nez, bouche : les trois temps d'une dégustation. Notre chef sommelier dévoile sa méthode pour lire un verre comme un récit.",
    body: [
      "Déguster, ce n'est pas boire. C'est suspendre le geste, observer la robe à la lumière d'une bougie, plonger le nez dans le verre avant même la première gorgée. Chaque vin raconte d'où il vient — le sol, le climat, la main du vigneron.",
      "L'œil révèle l'âge et la concentration : un rubis profond pour un jeune Pomerol, des reflets tuilés pour un grand Bourgogne assagi. Le nez se déploie en deux temps — les arômes primaires du fruit, puis les notes tertiaires du temps : sous-bois, cuir, truffe.",
      "En bouche enfin, l'attaque, le milieu, la finale. Une grande bouteille se reconnaît à sa longueur : ces secondes où le vin persiste après la déglutition. C'est là, dans ce silence, que le terroir signe son œuvre.",
    ],
  },
  {
    slug: "accords-mets-vins",
    title: "Accords Mets & Vins : la Liberté",
    date: "19 mai 2026",
    category: "Accords",
    excerpt:
      "Oubliez les règles rigides. L'accord parfait est une conversation entre une assiette, un verre et le moment. Quelques principes pour oser.",
    body: [
      "Le vieux dogme « viande rouge–vin rouge » a fait son temps. L'accord juste cherche l'équilibre des intensités, des textures et des saveurs, bien plus que la couleur du verre.",
      "Un Riesling sec accompagne magnifiquement une charcuterie fumée ; un Champagne blanc de blancs sublime un comté affiné mieux qu'aucun rouge. La règle d'or : que ni le plat ni le vin n'écrase l'autre.",
      "Et puis il y a l'audace heureuse — un Sauternes sur un roquefort, un Sancerre rouge légèrement frais sur un poisson grillé. Chez Clos du Soir, nos sommeliers composent chaque accord comme une rencontre, jamais comme une formule.",
    ],
  },
  {
    slug: "voyage-vignobles",
    title: "Voyage au Cœur des Vignobles",
    date: "4 mai 2026",
    category: "Vignobles",
    excerpt:
      "De la Côte d'Or aux collines de Toscane, récit de nos visites chez les vignerons qui composent notre cave de 280 références.",
    body: [
      "Notre cave ne se remplit pas par catalogue. Chaque année, l'équipe parcourt les vignobles — la Bourgogne au printemps, le Rhône en été, l'Italie à l'automne — pour goûter, écouter, et nouer des liens avec celles et ceux qui font le vin.",
      "À Gevrey-Chambertin, nous avons passé une matinée dans une cave creusée au XVIIᵉ siècle, à comparer trois millésimes d'un même climat. En Toscane, un vigneron nous a fait goûter son Sangiovese directement à la cuve, encore tumultueux.",
      "Ce sont ces rencontres qui donnent leur âme à nos bouteilles. Derrière chaque référence de la carte, il y a un visage, une parcelle, une histoire que nos sommeliers se feront un plaisir de vous raconter.",
    ],
  },
];

// Wine bottle SVG with scroll-driven fill
function WineBottleSVG({ fillProgress }: { fillProgress: any }) {
  const fillY = useTransform(fillProgress, [0, 1], ["100%", "0%"]);

  return (
    <div
      style={{
        position: "relative",
        width: 120,
        height: 320,
        margin: "0 auto",
      }}
    >
      <svg
        viewBox="0 0 80 220"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        {/* Clip path for bottle shape */}
        <defs>
          <clipPath id="bottleClip">
            <path d="M32,10 L32,40 C20,50 16,65 16,80 L16,190 C16,200 24,210 40,210 C56,210 64,200 64,190 L64,80 C64,65 60,50 48,40 L48,10 Z" />
          </clipPath>
        </defs>

        {/* Bottle outline */}
        <path
          d="M32,10 L32,40 C20,50 16,65 16,80 L16,190 C16,200 24,210 40,210 C56,210 64,200 64,190 L64,80 C64,65 60,50 48,40 L48,10 Z"
          fill="none"
          stroke={C.gold}
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Bottle neck cork */}
        <rect x="30" y="4" width="20" height="10" rx="3" fill={C.gold} opacity="0.7" />

        {/* Animated fill */}
        <motion.rect
          x="0"
          width="80"
          height="220"
          fill={`${C.burgundy}cc`}
          clipPath="url(#bottleClip)"
          style={{ y: fillY }}
        />

        {/* Wine shimmer */}
        <motion.rect
          x="0"
          width="80"
          height="4"
          fill={`${C.rose}80`}
          clipPath="url(#bottleClip)"
          style={{ y: fillY }}
        />

        {/* Label area */}
        <rect
          x="20"
          y="110"
          width="40"
          height="55"
          rx="4"
          fill={C.goldLight}
          opacity="0.9"
        />
        <text
          x="40"
          y="132"
          textAnchor="middle"
          fontSize="7"
          fontWeight="700"
          fill={C.burgundy}
          fontFamily="'Cormorant Garamond', Georgia, serif"
        >
          CLOS
        </text>
        <text
          x="40"
          y="144"
          textAnchor="middle"
          fontSize="5"
          fill={C.textMuted}
          fontFamily="Georgia, serif"
        >
          DU SOIR
        </text>
        <line
          x1="24"
          y1="150"
          x2="56"
          y2="150"
          stroke={C.gold}
          strokeWidth="0.5"
        />
        <text
          x="40"
          y="160"
          textAnchor="middle"
          fontSize="5"
          fill={C.textMuted}
          fontFamily="Georgia, serif"
        >
          PARIS
        </text>
      </svg>
    </div>
  );
}

function FAQItem({
  faq,
  delay,
}: {
  faq: { q: string; a: string };
  delay: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: C.white,
          border: `1px solid ${open ? C.gold : C.border}`,
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
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              fontSize: 17,
              color: C.burgundy,
            }}
          >
            {faq.q}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ flexShrink: 0 }}
          >
            <ChevronDown size={18} color={C.gold} />
          </motion.div>
        </div>
        {open && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: 14,
              fontFamily: "'Lato', system-ui",
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
  );
}

function SectionReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   SHARED SUB-PAGE HELPERS (theme-native — C palette + fonts)
   ========================================================================= */

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Lato', system-ui, sans-serif";

// Shared field styling for forms — font-size ≥ 16px enforced inline
const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: 4,
  padding: "13px 16px",
  fontSize: 16,
  fontFamily: SANS,
  color: C.text,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: SERIF,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: C.gold,
  marginBottom: 8,
};

function PageHeader({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <SectionReveal>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 13,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 16,
          }}
        >
          {kicker}
        </div>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            color: C.burgundy,
            lineHeight: 1.08,
            marginBottom: sub ? 18 : 0,
          }}
        >
          {title}
        </h1>
        {sub && (
          <p
            style={{
              fontSize: 16,
              color: C.textMuted,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </SectionReveal>
  );
}

/* ── SUB-PAGE: LA CARTE ──────────────────────────────────────────────────── */

function CartePage() {
  return (
    <section style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <PageHeader
          kicker="La Carte des Vins"
          title="Vins au verre & planches"
          sub="Une carte qui tourne au gré des saisons et des rencontres. Vins servis au verre, planches à partager — pour une soirée qui prend son temps."
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {CARTE_SECTIONS.map((sec, si) => (
            <SectionReveal key={sec.id} delay={si * 0.06}>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 16,
                    borderBottom: `1px solid ${C.border}`,
                    paddingBottom: 16,
                    marginBottom: 24,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(24px, 3vw, 34px)",
                      fontWeight: 700,
                      color: C.burgundy,
                    }}
                  >
                    {sec.label}
                  </h2>
                  <span
                    style={{
                      fontSize: 12,
                      color: C.gold,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {sec.note}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "8px 48px",
                  }}
                >
                  {sec.items.map((item) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 16,
                        padding: "14px 0",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: SERIF,
                            fontSize: 17,
                            fontWeight: 600,
                            color: C.text,
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: C.textMuted,
                            marginTop: 3,
                            fontStyle: "italic",
                          }}
                        >
                          {item.origin}
                          {item.year !== "—" ? ` · ${item.year}` : ""}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontSize: 18,
                          fontWeight: 700,
                          color: C.burgundy,
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {item.price} €
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal>
          <p
            style={{
              marginTop: 56,
              textAlign: "center",
              fontSize: 12,
              color: C.textMuted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontStyle: "italic",
            }}
          >
            Prix nets, service compris · L'abus d'alcool est dangereux pour la santé
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ── SUB-PAGE: LA CAVE (boutique vins — vitrine, sans panier) ────────────── */

function CavePage({ goTo }: { goTo: (p: SoirPage) => void }) {
  return (
    <section style={{ padding: "140px 5% 100px", background: C.bgAlt, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <PageHeader
          kicker="La Cave à Emporter"
          title="Nos bouteilles d'exception"
          sub="Au-delà du bar, notre cave réunit 280 références à emporter. Les flacons ci-dessous, sélectionnés par notre sommelière, sont disponibles à la réservation en boutique."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {CAVE_BOTTLES.map((b, i) => (
            <SectionReveal key={b.name} delay={i * 0.08}>
              <div
                style={{
                  background: C.white,
                  borderRadius: 4,
                  padding: 32,
                  border: `1px solid ${C.border}`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      background: C.goldLight,
                      color: C.gold,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 2,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {b.region}
                  </span>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.textMuted,
                    }}
                  >
                    {b.year}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 24,
                    fontWeight: 700,
                    color: C.burgundy,
                    marginBottom: 4,
                  }}
                >
                  {b.name}
                </h3>
                <div
                  style={{
                    fontSize: 13,
                    color: C.textMuted,
                    fontStyle: "italic",
                    marginBottom: 16,
                  }}
                >
                  {b.appellation}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: C.textMuted,
                    lineHeight: 1.7,
                    fontWeight: 300,
                    flex: 1,
                    marginBottom: 24,
                  }}
                >
                  {b.note}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: 18,
                  }}
                >
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.burgundy,
                    }}
                  >
                    {b.price} €
                  </div>
                  <button
                    onClick={() => goTo("contact")}
                    style={{
                      background: C.burgundy,
                      color: C.cream,
                      padding: "10px 20px",
                      borderRadius: 2,
                      fontSize: 12,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontFamily: SANS,
                    }}
                  >
                    Réserver en boutique
                  </button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal>
          <p
            style={{
              marginTop: 48,
              textAlign: "center",
              fontSize: 13,
              color: C.textMuted,
              maxWidth: 560,
              margin: "48px auto 0",
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            Retrait sur place uniquement. Pour découvrir l'intégralité des 280
            références ou organiser une dégustation privée, contactez notre équipe.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ── SUB-PAGE: RÉSERVATION ───────────────────────────────────────────────── */

function ReservationPage() {
  const [sent, setSent] = useState(false);

  return (
    <section style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <PageHeader
          kicker="Réserver une table"
          title="Votre soirée au Clos"
          sub="Le service se déroule du mardi au dimanche, de 18h30 à 23h30. Réservation conseillée, en particulier pour les flights de dégustation."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <SectionReveal>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: 36,
              }}
            >
              {sent ? (
                <div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.burgundy,
                      marginBottom: 12,
                    }}
                  >
                    Demande reçue.
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textMuted,
                      lineHeight: 1.75,
                      fontWeight: 300,
                    }}
                  >
                    Merci. Notre maître d'hôtel vous confirmera votre table par
                    téléphone dans les meilleurs délais.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Date</label>
                      <input type="date" required style={fieldStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Heure</label>
                      <input type="time" required style={fieldStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Couverts</label>
                      <select required defaultValue="" style={fieldStyle}>
                        <option value="" disabled>
                          —
                        </option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n > 1 ? "personnes" : "personne"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      style={fieldStyle}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Téléphone</label>
                      <input
                        type="tel"
                        required
                        placeholder="06 00 00 00 00"
                        style={fieldStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        required
                        placeholder="vous@email.com"
                        style={fieldStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Demande particulière</label>
                    <textarea
                      rows={4}
                      placeholder="Occasion, allergies, accord souhaité…"
                      style={{ ...fieldStyle, resize: "none" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      alignSelf: "flex-start",
                      background: C.gold,
                      color: C.burgundyDark,
                      padding: "15px 32px",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontFamily: SANS,
                    }}
                  >
                    Demander la réservation
                  </button>
                </form>
              )}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div
              style={{
                background: C.burgundy,
                borderRadius: 4,
                padding: 36,
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 24,
                }}
              >
                Horaires & Accès
              </div>
              {[
                ["Mardi – Jeudi", "18h30 – 23h00"],
                ["Vendredi – Samedi", "18h30 – 23h30"],
                ["Dimanche", "18h30 – 22h30"],
                ["Lundi", "Fermé"],
              ].map(([d, h], i) => (
                <div
                  key={d}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    paddingBottom: 14,
                    marginBottom: 14,
                    borderBottom:
                      i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    fontSize: 14,
                    color: "#c4a882",
                    fontWeight: 300,
                  }}
                >
                  <span>{d}</span>
                  <span style={{ color: C.cream }}>{h}</span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 14,
                    color: "#c4a882",
                  }}
                >
                  <Phone size={16} color={C.gold} /> +33 1 42 60 80 20
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 14,
                    color: "#c4a882",
                  }}
                >
                  <Mail size={16} color={C.gold} /> contact@aevia.io
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    fontSize: 14,
                    color: "#c4a882",
                  }}
                >
                  <MapPin size={16} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />{" "}
                  Adresse communiquée sur demande
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

/* ── SUB-PAGE: JOURNAL (index + article) ─────────────────────────────────── */

function BlogPage({
  slug,
  setSlug,
}: {
  slug: string | null;
  setSlug: (s: string | null) => void;
}) {
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : null;

  if (post) {
    return (
      <article style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100vh" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionReveal>
            <button
              onClick={() => setSlug(null)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: C.gold,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 28,
                fontFamily: SANS,
              }}
            >
              <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Retour au journal
            </button>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 13,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 16,
              }}
            >
              {post.category} · {post.date}
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 700,
                color: C.burgundy,
                lineHeight: 1.1,
                marginBottom: 32,
              }}
            >
              {post.title}
            </h1>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {post.body.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 17,
                    color: C.text,
                    lineHeight: 1.9,
                    fontWeight: 300,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </SectionReveal>
        </div>
      </article>
    );
  }

  return (
    <section style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <PageHeader
          kicker="Le Journal"
          title="Récits de cave & de comptoir"
          sub="Dégustation, accords mets-vins, visites de vignobles — les pages de carnet de notre équipe de sommeliers."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
          }}
        >
          {BLOG_POSTS.map((p, i) => (
            <SectionReveal key={p.slug} delay={i * 0.1}>
              <div
                onClick={() => setSlug(p.slug)}
                style={{
                  background: C.white,
                  borderRadius: 4,
                  padding: 32,
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 12,
                  }}
                >
                  {p.category} · {p.date}
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 24,
                    fontWeight: 700,
                    color: C.burgundy,
                    lineHeight: 1.15,
                    marginBottom: 14,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: C.textMuted,
                    lineHeight: 1.75,
                    fontWeight: 300,
                    flex: 1,
                    marginBottom: 18,
                  }}
                >
                  {p.excerpt}
                </p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.gold,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Lire l'article <ArrowRight size={14} />
                </span>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SUB-PAGE: CONTACT ───────────────────────────────────────────────────── */

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section style={{ padding: "140px 5% 100px", background: C.bgAlt, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <PageHeader
          kicker="Nous Joindre"
          title="Prenez contact"
          sub="Pour une réservation, une dégustation privée, un événement ou une question sur la cave — écrivez-nous, nous répondons avec soin."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <SectionReveal>
            <div
              style={{
                background: C.burgundy,
                borderRadius: 4,
                padding: 36,
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              {[
                {
                  Icon: MapPin,
                  label: "Adresse",
                  value: "Adresse communiquée sur demande à contact@aevia.io",
                },
                { Icon: Phone, label: "Téléphone", value: "+33 1 42 60 80 20" },
                { Icon: Mail, label: "Email", value: "contact@aevia.io" },
                { Icon: Clock, label: "Horaires", value: "Mardi – Dimanche · 18h30 – 23h30" },
              ].map(({ Icon, label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: C.gold,
                      marginBottom: 8,
                    }}
                  >
                    <Icon size={16} />
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 13,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#c4a882",
                      lineHeight: 1.7,
                      fontWeight: 300,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: 36,
              }}
            >
              {sent ? (
                <div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.burgundy,
                      marginBottom: 12,
                    }}
                  >
                    Message envoyé.
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textMuted,
                      lineHeight: 1.75,
                      fontWeight: 300,
                    }}
                  >
                    Merci de nous avoir écrit. Nous vous répondrons dans les plus
                    brefs délais.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Nom</label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom"
                        style={fieldStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        required
                        placeholder="vous@email.com"
                        style={fieldStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Sujet</label>
                    <input
                      type="text"
                      placeholder="Objet de votre message"
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Votre message…"
                      style={{ ...fieldStyle, resize: "none" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      alignSelf: "flex-start",
                      background: C.gold,
                      color: C.burgundyDark,
                      padding: "15px 32px",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontFamily: SANS,
                    }}
                  >
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

/* ── SUB-PAGE: À PROPOS (sommelier story) ────────────────────────────────── */

function AboutPage({ goTo }: { goTo: (p: SoirPage) => void }) {
  return (
    <section style={{ padding: "140px 5% 100px", background: C.burgundyDark, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 13,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 16,
              }}
            >
              La Maison
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 700,
                color: C.cream,
                lineHeight: 1.08,
              }}
            >
              Notre histoire
            </h1>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {[
              "Clos du Soir est né d'une conviction simple : le vin se partage mieux quand on en raconte l'histoire. Au cœur du 1er arrondissement de Paris, nous avons imaginé un lieu intime, à la lumière des bougies, où chaque bouteille porte la voix d'un vigneron.",
              "Notre cheffe sommelière, Claire Vidal, Master of Wine, a passé une décennie comme acheteuse pour une table triplement étoilée de Lyon avant de dédier son savoir à une seule vision : un bar à vins où le terroir, le millésime et l'intention du vigneron se transmettent avec patience et générosité.",
              "Chaque soir, Claire ou l'un des membres de son équipe formée avec soin accompagne nos hôtes à travers le langage du vin — sans jargon, sans solennité. Une carte qui tourne au gré des saisons, une cave de 280 références bâtie sur des rencontres, et des accords pensés comme des conversations.",
              "Du curieux qui pousse la porte pour la première fois au collectionneur aguerri, chacun trouve ici sa place. C'est cela, l'esprit du Clos du Soir : l'exigence d'une grande cave, la chaleur d'une maison.",
            ].map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: 17,
                  color: "#c4a882",
                  lineHeight: 1.95,
                  fontWeight: 300,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div
            style={{
              marginTop: 48,
              display: "flex",
              gap: 48,
              flexWrap: "wrap",
              justifyContent: "center",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 40,
            }}
          >
            {[
              { value: "280+", label: "Références en cave" },
              { value: "12", label: "Années Master of Wine" },
              { value: "40+", label: "Vignerons partenaires" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 38,
                    fontWeight: 700,
                    color: C.gold,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#c4a882",
                    marginTop: 6,
                    fontWeight: 300,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button
              onClick={() => goTo("reservation")}
              style={{
                background: C.gold,
                color: C.burgundyDark,
                padding: "15px 36px",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 13,
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: SANS,
              }}
            >
              Réserver une table
            </button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ── SUB-PAGE: LEGAL (Mentions légales / Confidentialité) ────────────────── */

function LegalBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SectionReveal>
      <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 24 }}>
        <h2
          style={{
            fontFamily: SERIF,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 10,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 16,
            color: C.text,
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          {children}
        </p>
      </div>
    </SectionReveal>
  );
}

function LegalPage({ variant }: { variant: "mentions" | "privacy" }) {
  const isMentions = variant === "mentions";
  return (
    <section style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <PageHeader
          kicker="Informations Légales"
          title={isMentions ? "Mentions légales" : "Confidentialité"}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {isMentions ? (
            <>
              <LegalBlock title="Éditeur">
                Aevia WS — entrepreneur individuel (auto-entrepreneur)
              </LegalBlock>
              <LegalBlock title="Directeur de la publication">
                Valentin Milliand
              </LegalBlock>
              <LegalBlock title="Immatriculation">
                SIREN 852 546 225 — RCS Bourg-en-Bresse
              </LegalBlock>
              <LegalBlock title="Contact">contact@aevia.io</LegalBlock>
              <LegalBlock title="Siège social">
                Adresse du siège social communiquée sur demande à contact@aevia.io
              </LegalBlock>
              <LegalBlock title="TVA">
                TVA non applicable, art. 293 B du CGI
              </LegalBlock>
              <LegalBlock title="Hébergeur">
                Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA
              </LegalBlock>
            </>
          ) : (
            <>
              <LegalBlock title="Responsable du traitement">
                Aevia WS, représentée par Valentin Milliand, est responsable du
                traitement des données collectées sur ce site. Contact :
                contact@aevia.io.
              </LegalBlock>
              <LegalBlock title="Données collectées">
                Les informations transmises via les formulaires de réservation et de
                contact (nom, téléphone, email, message) sont utilisées uniquement
                pour traiter votre demande et ne sont jamais cédées à des tiers à des
                fins commerciales.
              </LegalBlock>
              <LegalBlock title="Conservation">
                Vos données sont conservées le temps nécessaire au traitement de
                votre demande, puis archivées ou supprimées conformément aux durées
                légales en vigueur.
              </LegalBlock>
              <LegalBlock title="Vos droits">
                Conformément au RGPD, vous disposez d'un droit d'accès, de
                rectification, d'effacement et d'opposition sur vos données. Pour
                l'exercer, écrivez à contact@aevia.io.
              </LegalBlock>
              <LegalBlock title="Cookies">
                Ce site n'utilise que des cookies strictement nécessaires à son
                fonctionnement. Aucun traceur publicitaire n'est déposé sans votre
                consentement.
              </LegalBlock>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ClosDuSoirPage() {
  const [page, setPage] = useState<SoirPage>("home");
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (p: SoirPage) => {
    setPage(p);
    setBlogSlug(null);
    setMenuOpen(false);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "auto" });
  };

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const wineBottleFill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontFamily: "'Lato', system-ui, sans-serif",
        background: C.bg,
        color: C.text,
        overflowX: "hidden",
      }}
    >
      {/* NAVBAR — transparent over dark hero */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "transparent",
          padding: "0 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 80,
          }}
        >
          <button
            onClick={() => goTo("home")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: 26,
                color: C.gold,
                letterSpacing: "0.04em",
              }}
            >
              Clos du Soir
            </span>
          </button>

          <div style={{ flex: 1 }} />

          <div
            className="cds-navlinks"
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
            }}
          >
            {NAV_PAGES.map((item) => (
              <button
                key={item.key}
                onClick={() => goTo(item.key)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "'Lato', system-ui",
                  fontSize: 14,
                  fontWeight: page === item.key ? 700 : 400,
                  color: page === item.key ? C.gold : C.goldLight,
                  letterSpacing: "0.04em",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => goTo("reservation")}
            style={{
              marginLeft: 32,
              background: "transparent",
              color: C.gold,
              padding: "10px 24px",
              borderRadius: 2,
              fontFamily: "'Lato', system-ui",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              border: `1px solid ${C.gold}`,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Réserver
          </button>

          <button
            className="cds-burger"
            onClick={() => setMenuOpen(true)}
            style={{
              display: "none",
              marginLeft: 16,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: C.gold,
              padding: 0,
            }}
            aria-label="Menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: C.burgundyDark,
            padding: "32px 8%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              alignSelf: "flex-end",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: C.gold,
              padding: 0,
              marginBottom: 24,
            }}
            aria-label="Fermer"
          >
            <X size={30} />
          </button>
          {NAV_PAGES.map((item) => (
            <button
              key={item.key}
              onClick={() => goTo(item.key)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "12px 0",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 30,
                fontWeight: 700,
                color: page === item.key ? C.gold : C.cream,
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => goTo("mentions")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "12px 0",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 20,
              fontWeight: 400,
              color: page === "mentions" ? C.gold : "#c4a882",
            }}
          >
            Mentions légales
          </button>
        </div>
      )}

      {/* ══════════ HOME (original single-page content, unchanged) ══════════ */}
      {page === "home" && (
      <>
      {/* HERO — dark full-bleed */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: C.burgundyDark,
          overflow: "hidden",
        }}
      >
        {/* Background texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(${C.gold}08 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Rose glow bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "10%",
            width: 500,
            height: 500,
            background: `radial-gradient(circle, ${C.burgundyLight}40 0%, transparent 65%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Gold glow right */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "-5%",
            width: 400,
            height: 400,
            background: `radial-gradient(circle, ${C.gold}15 0%, transparent 65%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "120px 5% 80px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left: Text */}
            <motion.div style={{ y: heroTextY, opacity: heroOpacity }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 13,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 28,
                }}
              >
                Paris 1er Arrondissement
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15 }}
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(48px, 6vw, 86px)",
                  fontWeight: 700,
                  color: C.cream,
                  lineHeight: 1.05,
                  marginBottom: 28,
                }}
              >
                Where the evening
                <br />
                <span style={{ color: C.gold, fontStyle: "italic" }}>
                  reveals itself
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{
                  fontSize: 17,
                  color: "#c4a882",
                  lineHeight: 1.85,
                  marginBottom: 44,
                  maxWidth: 440,
                  fontWeight: 300,
                }}
              >
                A curated wine bar and sommelier experience in the heart of Paris. Intimate evenings, rare bottles, and the stories they carry.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <button onClick={() => document.getElementById("lacarte")?.scrollIntoView({behavior:"smooth"})}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: C.gold,
                    color: C.burgundyDark,
                    padding: "16px 32px",
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Explore the Wine List
                </button>
                <button onClick={() => document.getElementById("membership")?.scrollIntoView({behavior:"smooth"})}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "transparent",
                    color: C.gold,
                    padding: "16px 32px",
                    borderRadius: 2,
                    fontWeight: 400,
                    fontSize: 13,
                    textDecoration: "none",
                    border: `1px solid ${C.gold}60`,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Membership
                </button>
              </motion.div>
            </motion.div>

            {/* Right: Wine bottle with scroll-fill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <WineBottleSVG fillProgress={wineBottleFill} />
              <p
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  fontSize: 12,
                  color: C.gold,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                Scroll to fill
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WINE LIST BY REGION */}
      <section
        id="lacarte"
        style={{ padding: "100px 5%", background: C.bgAlt }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 16,
                }}
              >
                La Carte des Vins
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 16,
                }}
              >
                Curated from the world's finest regions
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: C.textMuted,
                  maxWidth: 480,
                  margin: "0 auto",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                Our 280-reference cellar is personally curated by Head Sommelier Claire Vidal MW. Updated seasonally with small-production gems.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 32,
            }}
          >
            {WINE_REGIONS.map((region, i) => (
              <SectionReveal key={region.region} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Globe size={16} color={C.gold} />
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 24,
                        fontWeight: 700,
                        color: C.burgundy,
                      }}
                    >
                      {region.region}
                    </span>
                    <span
                      style={{
                        background: C.goldLight,
                        color: C.gold,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 2,
                      }}
                    >
                      {region.flag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.7,
                      marginBottom: 24,
                      fontStyle: "italic",
                    }}
                  >
                    {region.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                    }}
                  >
                    {region.selections.map((wine, j) => (
                      <div
                        key={wine.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 0",
                          borderBottom:
                            j < region.selections.length - 1
                              ? `1px solid ${C.border}`
                              : "none",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', Georgia, serif",
                              fontSize: 15,
                              fontWeight: 600,
                              color: C.text,
                            }}
                          >
                            {wine.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: C.textMuted,
                              marginTop: 2,
                              fontStyle: "italic",
                            }}
                          >
                            {wine.grape}
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                          }}
                        >
                          <div
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', Georgia, serif",
                              fontSize: 18,
                              fontWeight: 700,
                              color: C.burgundy,
                            }}
                          >
                            {wine.price}
                          </div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>
                            EUR / glass
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE EXPERIENCE — Sommelier story */}
      <section
        style={{ padding: "100px 5%", background: C.burgundy }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <SectionReveal>
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 13,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 20,
                  }}
                >
                  L'Experience
                </div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(32px, 4vw, 50px)",
                    fontWeight: 700,
                    color: C.cream,
                    lineHeight: 1.15,
                    marginBottom: 24,
                  }}
                >
                  Guided by Claire Vidal,{" "}
                  <span style={{ fontStyle: "italic", color: C.rose }}>
                    Master of Wine
                  </span>
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    color: "#c4a882",
                    lineHeight: 1.9,
                    marginBottom: 20,
                    fontWeight: 300,
                  }}
                >
                  Claire spent a decade as a buyer for a Michelin three-star in Lyon before dedicating herself to a single vision: a wine bar where the story of every bottle is told with care.
                </p>
                <p
                  style={{
                    fontSize: 16,
                    color: "#c4a882",
                    lineHeight: 1.9,
                    fontWeight: 300,
                  }}
                >
                  Each evening at Clos du Soir, she or one of her carefully trained team guides guests through the language of terroir, vintage, and winemaker intention — making every glass a conversation.
                </p>
                <div
                  style={{
                    marginTop: 36,
                    display: "flex",
                    gap: 40,
                  }}
                >
                  {[
                    { value: "280+", label: "References in cellar" },
                    { value: "12", label: "Years as MW" },
                    { value: "40+", label: "Producer relationships" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', Georgia, serif",
                          fontSize: 32,
                          fontWeight: 700,
                          color: C.gold,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#c4a882",
                          marginTop: 4,
                          fontWeight: 300,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  padding: 36,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 13,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 24,
                  }}
                >
                  An Evening at Clos du Soir
                </div>
                {[
                  {
                    time: "19:00",
                    desc: "Arrival — complimentary amuse-bouche and first pour selected by the sommelier",
                  },
                  {
                    time: "19:30",
                    desc: "La Carte exploration with tableside guidance from our team",
                  },
                  {
                    time: "20:30",
                    desc: "Optional tasting flight — 3 wines from a single region with tasting notes",
                  },
                  {
                    time: "21:30",
                    desc: "The cave moment — browse our retail cellar with 15% member discount",
                  },
                  {
                    time: "22:30",
                    desc: "Last service — closing glass and sommelier recommendation for home",
                  },
                ].map((step, i) => (
                  <div
                    key={step.time}
                    style={{
                      display: "flex",
                      gap: 20,
                      marginBottom: 20,
                      paddingBottom: 20,
                      borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.gold,
                        flexShrink: 0,
                        width: 44,
                      }}
                    >
                      {step.time}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#c4a882",
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* TASTING EVENTS */}
      <section
        id="experiences"
        style={{ padding: "100px 5%", background: C.bg }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(30px, 4vw, 50px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 14,
                }}
              >
                Upcoming Tasting Events
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: C.textMuted,
                  maxWidth: 440,
                  margin: "0 auto",
                  fontWeight: 300,
                }}
              >
                Intimate evenings curated for curiosity. Members receive priority booking.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            {EVENTS.map((ev, i) => (
              <SectionReveal key={ev.title} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 28,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    gap: 24,
                    alignItems: "flex-start",
                    opacity: ev.sold ? 0.7 : 1,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      background: ev.sold ? C.border : C.goldLight,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: ev.sold ? C.textMuted : C.burgundy,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {ev.date}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <h3
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', Georgia, serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: C.burgundy,
                        }}
                      >
                        {ev.title}
                      </h3>
                      {ev.sold && (
                        <span
                          style={{
                            background: "#fef2f2",
                            color: "#dc2626",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 2,
                            textTransform: "uppercase",
                          }}
                        >
                          Full
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: C.textMuted,
                        lineHeight: 1.65,
                        marginBottom: 14,
                        fontWeight: 300,
                      }}
                    >
                      {ev.desc}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily:
                              "'Cormorant Garamond', Georgia, serif",
                            fontSize: 20,
                            fontWeight: 700,
                            color: C.burgundy,
                          }}
                        >
                          {ev.price} EUR
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: ev.spots === 0 ? "#dc2626" : C.gold,
                            fontWeight: 600,
                          }}
                        >
                          {ev.spots === 0
                            ? "No spots left"
                            : `${ev.spots} spots left`}
                        </span>
                      </div>
                      {!ev.sold && (
                        <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                          style={{
                            background: C.burgundy,
                            color: C.cream,
                            padding: "8px 18px",
                            borderRadius: 2,
                            fontSize: 12,
                            fontWeight: 700,
                            textDecoration: "none",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Reserve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 12,
                }}
              >
                What our members say
              </h2>
            </div>
          </SectionReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 32,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        fill={C.gold}
                        color={C.gold}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', Georgia, serif",
                      fontSize: 16,
                      color: C.text,
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      flex: 1,
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: C.goldLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: C.burgundy,
                        flexShrink: 0,
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', Georgia, serif",
                          fontWeight: 700,
                          fontSize: 15,
                          color: C.burgundy,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: C.textMuted }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TIERS */}
      <section
        id="membership"
        style={{ padding: "100px 5%", background: C.burgundyDark }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 16,
                }}
              >
                Adhésion
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(30px, 4vw, 50px)",
                  fontWeight: 700,
                  color: C.cream,
                  marginBottom: 16,
                }}
              >
                Become a member
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "#c4a882",
                  maxWidth: 440,
                  margin: "0 auto",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                Membership unlocks privileges, curated bottles, and a community of like-minded enthusiasts.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {MEMBERSHIP_TIERS.map((tier, i) => (
              <SectionReveal key={tier.name} delay={i * 0.12}>
                <div
                  style={{
                    background: tier.highlight
                      ? C.burgundy
                      : "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    padding: 36,
                    border: tier.highlight
                      ? `2px solid ${C.gold}`
                      : "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    height: "100%",
                  }}
                >
                  {tier.highlight && (
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: C.gold,
                        color: C.burgundyDark,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Most Popular
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', Georgia, serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: tier.color,
                      marginBottom: 6,
                    }}
                  >
                    {tier.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#c4a882",
                      fontStyle: "italic",
                      marginBottom: 20,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {tier.tagline}
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <span
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', Georgia, serif",
                        fontSize: 44,
                        fontWeight: 700,
                        color: C.cream,
                      }}
                    >
                      {tier.price}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#c4a882",
                        marginLeft: 4,
                      }}
                    >
                      EUR/{tier.period}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 28,
                    }}
                  >
                    {tier.features.map((f) => (
                      <div
                        key={f}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <Check
                          size={14}
                          color={C.gold}
                          style={{ flexShrink: 0, marginTop: 2 }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: "#c4a882",
                            lineHeight: 1.5,
                            fontWeight: 300,
                          }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: tier.highlight ? C.gold : "transparent",
                      color: tier.highlight ? C.burgundyDark : C.gold,
                      padding: "14px 24px",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 12,
                      textDecoration: "none",
                      border: tier.highlight ? "none" : `1px solid ${C.gold}60`,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Join {tier.name}
                  </button>
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
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 12,
                }}
              >
                Questions frequentes
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

      </>
      )}

      {/* ══════════ THEME-NATIVE SUB-PAGES ══════════ */}
      {page === "carte" && <CartePage />}
      {page === "cave" && <CavePage goTo={goTo} />}
      {page === "reservation" && <ReservationPage />}
      {page === "blog" && <BlogPage slug={blogSlug} setSlug={setBlogSlug} />}
      {page === "contact" && <ContactPage />}
      {page === "mentions" && <LegalPage variant="mentions" />}
      {page === "privacy" && <LegalPage variant="privacy" />}

      {/* FOOTER */}
      <footer
        style={{ background: C.burgundyDark, padding: "80px 5% 40px" }}
      >
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
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 700,
                  fontSize: 28,
                  color: C.gold,
                  marginBottom: 16,
                  letterSpacing: "0.04em",
                }}
              >
                Clos du Soir
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#7a5c40",
                  lineHeight: 1.75,
                  maxWidth: 260,
                  fontWeight: 300,
                }}
              >
                A curated wine bar in Paris. Open Tuesday through Sunday from 18h30 to 23h30.
              </p>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  gap: 12,
                }}
              >
                {[MessageSquare, Camera, Link2].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Icon size={15} color="#7a5c40" />
                  </a>
                ))}
              </div>
            </div>

            {([
              {
                title: "La Maison",
                links: [
                  { label: "La Carte", key: "carte" as SoirPage },
                  { label: "La Cave", key: "cave" as SoirPage },
                  { label: "Réservation", key: "reservation" as SoirPage },
                  { label: "Le Journal", key: "blog" as SoirPage },
                  { label: "Contact", key: "contact" as SoirPage },
                ],
              },
              {
                title: "Informations",
                links: [
                  { label: "Mentions légales", key: "mentions" as SoirPage },
                  { label: "Confidentialité", key: "privacy" as SoirPage },
                  { label: "Nous contacter", key: "contact" as SoirPage },
                ],
              },
              {
                title: "Nous Trouver",
                links: [
                  { label: "contact@aevia.io", key: null },
                  { label: "+33 1 42 60 80 20", key: null },
                  { label: "Adresse sur demande", key: null },
                  { label: "Mar-Dim : 18h30-23h30", key: null },
                ],
              },
            ] as { title: string; links: { label: string; key: SoirPage | null }[] }[]).map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', Georgia, serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.gold,
                    marginBottom: 16,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  {col.title}
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {col.links.map((link) =>
                    link.key ? (
                      <button
                        key={link.label}
                        onClick={() => goTo(link.key as SoirPage)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                          fontSize: 13,
                          color: "#7a5c40",
                          fontWeight: 300,
                          fontFamily: "'Lato', system-ui",
                        }}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <span
                        key={link.label}
                        style={{
                          fontSize: 13,
                          color: "#7a5c40",
                          fontWeight: 300,
                        }}
                      >
                        {link.label}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 13,
                color: "#4a3020",
                fontStyle: "italic",
              }}
            >
              2025 Clos du Soir. L'abus d'alcool est dangereux pour la sante.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {([
                { label: "Mentions légales", key: "mentions" as const },
                { label: "Confidentialité", key: "privacy" as const },
              ]).map((item) => (
                <button
                  key={item.key}
                  onClick={() => goTo(item.key)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 12,
                    color: "#4a3020",
                    fontFamily: "'Lato', system-ui",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .cds-navlinks { display: none !important; }
          .cds-burger { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}
