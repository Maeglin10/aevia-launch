"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useTransform, useInView, MotionValue } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const C = {
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

export const SERIF = "'Cormorant Garamond', Georgia, serif";
export const SANS = "'Lato', system-ui, sans-serif";

// ─── Datasets ─────────────────────────────────────────────────────────────────
export const WINE_REGIONS = [
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

export const EVENTS = [
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

export const MEMBERSHIP_TIERS = [
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

export const TESTIMONIALS = [
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

export const FAQS = [
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

export const CARTE_SECTIONS = [
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

export const CAVE_BOTTLES = [
  { name: "Château Margaux", appellation: "Margaux · 1er Grand Cru Classé", year: "2018", price: "680", region: "Bordeaux", note: "Élégance veloutée, tanins soyeux, garde 30 ans." },
  { name: "Pommard Les Rugiens", appellation: "Pommard · Premier Cru", year: "2019", price: "92", region: "Bourgogne", note: "Pinot Noir structuré, fruits noirs et sous-bois." },
  { name: "Hermitage La Chapelle", appellation: "Hermitage · Rhône Nord", year: "2017", price: "245", region: "Rhône", note: "Syrah septentrionale, profondeur épicée." },
  { name: "Sassicaia", appellation: "Bolgheri · Toscane", year: "2019", price: "320", region: "Italie", note: "Assemblage bordelais solaire, grande allonge." },
  { name: "Meursault Les Charmes", appellation: "Meursault · Premier Cru", year: "2020", price: "118", region: "Bourgogne", note: "Chardonnay beurré, minéralité ciselée." },
  { name: "La Rioja Alta Gran Reserva 904", appellation: "Rioja · Espagne", year: "2015", price: "78", region: "Espagne", note: "Tempranillo patiné, cuir et vanille douce." },
];

export const BLOG_POSTS = [
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
      "En bouche enfin, l'attaque, le milieu, la finale. Une grande bouteille se reconnaissance à sa longueur : ces secondes où le vin persiste après la déglutition. C'est là, dans ce silence, que le terroir signe son œuvre.",
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

// ─── Visual & Helper Components ────────────────────────────────────────────────
export function WineBottleSVG({ fillProgress }: { fillProgress: MotionValue<string> | any }) {
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
        <defs>
          <clipPath id="bottleClip">
            <path d="M32,10 L32,40 C20,50 16,65 16,80 L16,190 C16,200 24,210 40,210 C56,210 64,200 64,190 L64,80 C64,65 60,50 48,40 L48,10 Z" />
          </clipPath>
        </defs>

        <path
          d="M32,10 L32,40 C20,50 16,65 16,80 L16,190 C16,200 24,210 40,210 C56,210 64,200 64,190 L64,80 C64,65 60,50 48,40 L48,10 Z"
          fill="none"
          stroke={C.gold}
          strokeWidth="1.5"
          opacity="0.6"
        />

        <rect x="30" y="4" width="20" height="10" rx="3" fill={C.gold} opacity="0.7" />

        <motion.rect
          x="0"
          width="80"
          height="220"
          fill={`${C.burgundy}cc`}
          clipPath="url(#bottleClip)"
          style={{ y: fillY }}
        />

        <motion.rect
          x="0"
          width="80"
          height="4"
          fill={`${C.rose}80`}
          clipPath="url(#bottleClip)"
          style={{ y: fillY }}
        />

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

export function FAQItem({
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

export function SectionReveal({
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

// ─── Shared sub-page helpers ──────────────────────────────────────────────────
export const fieldStyle: React.CSSProperties = {
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

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: SERIF,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: C.gold,
  marginBottom: 8,
};

export function PageHeader({
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
