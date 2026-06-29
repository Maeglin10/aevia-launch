"use client";

import React, { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf, Sun, Snowflake, Wind, Heart, Gift, Briefcase, Camera, Package
} from "lucide-react";

export const C = {
  bg: "#fffdf8",
  bgPink: "#fce4ec",
  bgCard: "#ffffff",
  bgSage: "rgba(85,139,47,0.06)",
  text: "#2d1a1f",
  textMuted: "#7a5c62",
  textDim: "#b89ea2",
  accent: "#880e4f",
  accentLight: "rgba(136,14,79,0.1)",
  accentHover: "#6a0b3d",
  sage: "#558b2f",
  sageMid: "#689f38",
  sageLight: "rgba(85,139,47,0.12)",
  blush: "#fce4ec",
  rose: "#f48fb1",
  roseLight: "rgba(244,143,177,0.15)",
  border: "rgba(45,26,31,0.08)",
  borderAccent: "rgba(136,14,79,0.2)",
  borderSage: "rgba(85,139,47,0.2)",
  white: "#ffffff",
};

export const navLinks = [
  { label: "Accueil", href: "/templates/impact-47" },
  { label: "Boutique", href: "/templates/impact-47/boutique" },
  { label: "Blog", href: "/templates/impact-47/blog" },
  { label: "À propos", href: "/templates/impact-47/about" },
  { label: "Contact", href: "/templates/impact-47/contact" },
];

export const petalPaths = [
  { x: [0, -60, 80, -40], y: [0, 200, 480, 700], rotate: [0, 45, -30, 90], scale: [1, 0.8, 1.1, 0.7] },
  { x: [0, 80, -50, 60], y: [0, 150, 400, 680], rotate: [0, -60, 40, -80], scale: [0.8, 1.1, 0.9, 1.2] },
  { x: [0, -90, 40, -70], y: [0, 250, 500, 720], rotate: [0, 70, -20, 100], scale: [1.1, 0.7, 1, 0.8] },
  { x: [0, 50, -80, 30], y: [0, 180, 420, 660], rotate: [0, -40, 80, -60], scale: [0.9, 1.2, 0.8, 1] },
  { x: [0, -70, 90, -50], y: [0, 220, 460, 700], rotate: [0, 55, -45, 70], scale: [1.2, 0.9, 1.1, 0.8] },
  { x: [0, 100, -30, 80], y: [0, 170, 390, 650], rotate: [0, -80, 30, -100], scale: [0.85, 1, 0.9, 1.15] },
];

export const petalColors = [C.accent, C.rose, "#e91e8c", C.sage, "#f06292", C.accent];

export function FallingPetal({ index }: { index: number }) {
  const path = petalPaths[index];
  const color = petalColors[index];
  const delay = index * 0.6;
  const startX = 10 + (index / petalPaths.length) * 80;

  return (
    <motion.div
      style={{ position: "absolute", top: "-40px", left: `${startX}%`, pointerEvents: "none", zIndex: 1 }}
      animate={{
        x: path.x,
        y: path.y,
        rotate: path.rotate,
        scale: path.scale,
        opacity: [0, 1, 1, 0.7, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 40 50" style={{ width: 28, height: 34 }} fill={color} opacity={0.7}>
        <path d="M20 2 C28 2, 38 15, 38 28 C38 42, 28 48, 20 48 C12 48, 2 42, 2 28 C2 15, 12 2, 20 2 Z" />
        <path d="M20 8 C20 8, 20 40, 20 48" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
      </svg>
    </motion.div>
  );
}

export const seasons = [
  {
    id: "spring",
    label: "Spring",
    icon: Leaf,
    accent: C.sage,
    desc: "Tulips, peonies, ranunculus, and cherry blossom — the season of fresh beginnings.",
    arrangements: [
      { name: "Jardin de Printemps", price: "€65", desc: "Peonies, tulipes, and garden roses in blush and cream.", image: "https://images.unsplash.com/photo-1490750967868-88df5691cc17?w=400&h=400&fit=crop&q=80" },
      { name: "Blossom Drift", price: "€85", desc: "Cherry blossom stems with delicate sweet peas and freesia.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80" },
      { name: "Green Awakening", price: "€55", desc: "Eucalyptus, ferns, and seasonal greens with white blooms.", image: "https://images.unsplash.com/photo-1487530811015-2780cf3b336f?w=400&h=400&fit=crop&q=80" },
    ],
  },
  {
    id: "summer",
    label: "Summer",
    icon: Sun,
    accent: "#f57f17",
    desc: "Sunflowers, dahlias, lavender, and lush garden roses at their peak.",
    arrangements: [
      { name: "Soleil de Provence", price: "€70", desc: "Sunflowers, lavender, and golden dahlias in warm abundance.", image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=400&h=400&fit=crop&q=80" },
      { name: "Rose Vif", price: "€95", desc: "Garden roses in deep coral and orange with jasmine vine.", image: "https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=400&h=400&fit=crop&q=80" },
      { name: "Tropical Luxe", price: "€120", desc: "Birds of paradise, proteas, and tropical foliage statement piece.", image: "https://images.unsplash.com/photo-1544991936-9464fa57a7cf?w=400&h=400&fit=crop&q=80" },
    ],
  },
  {
    id: "fall",
    label: "Autumn",
    icon: Wind,
    accent: "#bf360c",
    desc: "Dahlias, chrysanthemums, dried botanicals, and warm seasonal textures.",
    arrangements: [
      { name: "Automne Doré", price: "€75", desc: "Rust dahlias, orange chrysanthemums, and dried wheat stems.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80" },
      { name: "Dried Luxe", price: "€90", desc: "Pampas, lunaria, preserved botanicals in sculptural composition.", image: "https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&h=400&fit=crop&q=80" },
      { name: "Forest Floor", price: "€60", desc: "Wild mushrooms, moss, pine branches, and seasonal berries.", image: "https://images.unsplash.com/photo-1601796913936-5f659e5d2936?w=400&h=400&fit=crop&q=80" },
    ],
  },
  {
    id: "winter",
    label: "Winter",
    icon: Snowflake,
    accent: "#1565c0",
    desc: "White amaryllis, hellebores, pine, and the deep red of winterberries.",
    arrangements: [
      { name: "Blanc de Noël", price: "€80", desc: "White amaryllis, eucalyptus, and silver-dusted pine branches.", image: "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=400&h=400&fit=crop&q=80" },
      { name: "Velvet Crimson", price: "€90", desc: "Deep red roses, winterberry, and dark greenery.", image: "https://images.unsplash.com/photo-1543168256-418811576931?w=400&h=400&fit=crop&q=80" },
      { name: "Hiver Minimaliste", price: "€65", desc: "Single-variety hellebore and dried cotton stems in clean lines.", image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=400&h=400&fit=crop&q=80" },
    ],
  },
];

export const occasions = [
  { icon: Heart, title: "Weddings", desc: "Bridal bouquets, ceremony installations, reception centrepieces, and full floral direction from initial brief to last petal on the day.", color: C.accent },
  { icon: Sun, title: "Funerals & Tribute", desc: "Respectful, beautiful arrangements for memorial services. We work directly with families and funeral homes with sensitivity and care.", color: C.textMuted },
  { icon: Gift, title: "Birthdays & Events", desc: "Statement arrangements delivered directly to the door, or a workshop where guests create their own bouquet — memorable both ways.", color: C.sage },
  { icon: Briefcase, title: "Corporate", desc: "Weekly office flowers, event installations for product launches, showrooms, and galas. Invoiced monthly, fully managed.", color: C.accent },
];

export const testimonials = [
  {
    name: "Isabelle Fontaine",
    location: "Paris, 7e",
    rating: 5,
    text: "Pétales & Co did our entire wedding — 18 arrangements, 4 arches, bridal party bouquets. Every single piece was more beautiful than I imagined. They understood our vision perfectly.",
    occasion: "Wedding",
  },
  {
    name: "Laurent Brunel",
    location: "Neuilly-sur-Seine",
    rating: 5,
    text: "I have a monthly subscription for my law office lobby. The team selects seasonally and the arrangements always receive comments from clients. It has genuinely changed the feel of the space.",
    occasion: "Corporate",
  },
  {
    name: "Chloé Morin",
    location: "Paris, 16e",
    rating: 5,
    text: "We did the bouquet workshop for my sister's birthday. Eight of us, two hours, incredible instruction and a gorgeous takeaway. The best afternoon we've had together in years.",
    occasion: "Workshop",
  },
  {
    name: "Thomas Aubry",
    location: "Versailles",
    rating: 5,
    text: "Weekly delivery of the seasonal arrangement. I've been a subscriber for 14 months and they have never repeated themselves. Each week is a small surprise.",
    occasion: "Monthly Sub",
  },
];

export const subscriptionTiers = [
  {
    name: "Hebdomadaire",
    price: "€48",
    duration: "per week",
    desc: "One artisan bouquet delivered each week. Seasonal selection, curated by our florists.",
    includes: ["Seasonal arrangement", "Free delivery Paris", "Kraft wrapping + ribbon", "Care card"],
    cta: "Subscribe Weekly",
    featured: false,
  },
  {
    name: "Bimensuelle",
    price: "€80",
    duration: "per month",
    desc: "Two bouquets per month — the perfect rhythm for those who love flowers but want flexibility.",
    includes: ["2 seasonal arrangements", "Free delivery Paris", "Choice of style", "Care card + seasonal note"],
    cta: "Subscribe Biweekly",
    featured: true,
  },
  {
    name: "Mensuelle",
    price: "€55",
    duration: "per month",
    desc: "One statement piece per month — larger, more dramatic, a real focal point for your home.",
    includes: ["1 large seasonal piece", "Free delivery Île-de-France", "Statement composition", "Seasonal story card"],
    cta: "Subscribe Monthly",
    featured: false,
  },
];

export const faqs = [
  {
    q: "What areas do you deliver to?",
    a: "We deliver within Paris and the Île-de-France region. Paris deliveries are free for all subscriptions. Île-de-France deliveries have a €12 surcharge for one-off orders — free for monthly subscribers.",
  },
  {
    q: "Can I request specific flowers or colours?",
    a: "Absolutely. At checkout or when setting up a subscription, leave your preferences. We'll do our best to honour them subject to seasonal availability. Some flowers are simply unavailable out of season — part of what makes them special.",
  },
  {
    q: "How far in advance should I order for a wedding?",
    a: "We recommend 3–6 months for weddings. Summer dates (June–September) are extremely popular and book out 6+ months ahead. Contact us as early as possible and we'll confirm availability.",
  },
  {
    q: "Do you offer workshops?",
    a: "Yes — we run weekly public workshops at our studio (€65/person, 2 hours, includes materials and takeaway bouquet) and private group bookings for up to 12 people. Email us or book via our website.",
  },
  {
    q: "Can I pause or cancel my subscription?",
    a: "Yes. You can pause for up to 4 weeks per year or cancel anytime with one week's notice. No penalties, no questions.",
  },
  {
    q: "Do you do same-day delivery?",
    a: "For in-stock arrangements ordered before 10h, we offer same-day delivery in Paris (€18 express fee). For custom orders or workshop bookings, advance notice is required.",
  },
];

export const PRODUCTS = [
  {
    name: "Jardin de Printemps",
    price: 65,
    oldPrice: null,
    tag: "Saison",
    tagType: "season",
    collection: "Printemps",
    material: "Pivoines · tulipes · roses de jardin",
    desc: "Pivoines, tulipes et roses de jardin dans des tons blush et crème, noués à la main.",
    colors: [C.rose, C.blush, "#f8bbd0"],
    rating: 4.9,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1490750967868-88df5691cc17?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Soleil de Provence",
    price: 70,
    oldPrice: null,
    tag: null,
    tagType: null,
    collection: "Été",
    material: "Tournesols · lavande · dahlias",
    desc: "Tournesols, lavande et dahlias dorés dans une abondance chaleureuse aux accents du Sud.",
    colors: ["#f9a825", "#9575cd", "#fbc02d"],
    rating: 4.8,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Bouquet Blanc Éternel",
    price: 80,
    oldPrice: null,
    tag: "Bestseller",
    tagType: "best",
    collection: "Mariages",
    material: "Roses blanches · eucalyptus · lisianthus",
    desc: "Composition immaculée de roses blanches, eucalyptus et lisianthus pour les grandes occasions.",
    colors: ["#ffffff", C.sageLight, "#e8f5e9"],
    rating: 5.0,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Automne Doré",
    price: 75,
    oldPrice: 90,
    tag: "–17%",
    tagType: "sale",
    collection: "Automne",
    material: "Dahlias rouille · chrysanthèmes · blé séché",
    desc: "Dahlias rouille, chrysanthèmes orangés et épis de blé séché aux textures de saison.",
    colors: ["#bf360c", "#e64a19", "#d7ccc8"],
    rating: 4.7,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Blanc de Noël",
    price: 80,
    oldPrice: null,
    tag: "Édition limitée",
    tagType: "limited",
    collection: "Hiver",
    material: "Amaryllis · pin argenté · eucalyptus",
    desc: "Amaryllis blanc, eucalyptus et branches de pin saupoudrées d'argent pour les fêtes.",
    colors: ["#ffffff", C.sage, "#cfd8dc"],
    rating: 4.9,
    reviews: 54,
    image: "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Roseraie Romantique",
    price: 95,
    oldPrice: null,
    tag: null,
    tagType: null,
    collection: "Romance",
    material: "Roses de jardin · pivoines · renoncules",
    desc: "Un débordement de roses de jardin, pivoines et renoncules dans les tons rose profond.",
    colors: [C.accent, C.rose, "#ad1457"],
    rating: 5.0,
    reviews: 121,
    image: "https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Champêtre Sauvage",
    price: 55,
    oldPrice: null,
    tag: null,
    tagType: null,
    collection: "Champêtre",
    material: "Fleurs des champs · graminées · feuillages",
    desc: "Un bouquet libre et naturel de fleurs des champs, graminées légères et feuillages frais.",
    colors: [C.sageMid, "#aed581", C.rose],
    rating: 4.8,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1487530811015-2780cf3b336f?w=600&h=600&fit=crop&q=80",
  },
  {
    name: "Plante d'Intérieur Apaisante",
    price: 48,
    oldPrice: null,
    tag: "Nouveau",
    tagType: "new",
    collection: "Plantes",
    material: "Plante verte · cache-pot artisanal",
    desc: "Une plante verte sélectionnée dans son cache-pot artisanal, livrée avec carte d'entretien.",
    colors: [C.sage, C.sageMid, "#a5d6a7"],
    rating: 4.9,
    reviews: 110,
    image: "https://images.unsplash.com/photo-1544991936-9464fa57a7cf?w=600&h=600&fit=crop&q=80",
  },
];

export const BLOG_POSTS = [
  {
    slug: "fleurs-de-saison",
    title: "Pourquoi choisir des fleurs de saison",
    date: "12 juin 2026",
    category: "Saisons",
    excerpt:
      "Plus fraîches, plus durables et plus belles : les raisons pour lesquelles nous composons exclusivement avec les fleurs du moment.",
    cover: C.rose,
    coverImage: "https://images.unsplash.com/photo-1490750967868-88df5691cc17?w=1200&h=600&fit=crop&q=80",
    body: [
      "Une fleur de saison est cueillie à maturité, au plus près de sa floraison naturelle. Elle tient plus longtemps en vase, dégage un parfum plus intense et affiche des couleurs que les variétés forcées hors saison n'égalent jamais.",
      "Travailler avec les saisons, c'est aussi soutenir les producteurs locaux et réduire l'empreinte du transport réfrigéré. Chez Pétales & Co, nous privilégions les petits cultivateurs français dès que la saison le permet.",
      "Concrètement, cela signifie que nos compositions évoluent au fil de l'année : pivoines au printemps, tournesols en été, dahlias à l'automne, amaryllis en hiver. Chaque bouquet raconte le moment précis où il a été créé.",
    ],
  },
  {
    slug: "entretien-bouquet",
    title: "Faire durer son bouquet plus longtemps",
    date: "3 juin 2026",
    category: "Conseils",
    excerpt:
      "Coupe en biseau, eau renouvelée, emplacement idéal : nos gestes d'atelier pour prolonger la vie de vos fleurs coupées.",
    cover: C.sage,
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&q=80",
    body: [
      "La première règle est de recouper les tiges en biseau, sous l'eau si possible, afin que les fleurs continuent de s'abreuver sans bulle d'air dans le canal.",
      "Changez l'eau tous les deux jours et retirez les feuilles immergées qui pourrissent et accélèrent le flétrissement. Un vase propre fait toute la différence.",
      "Enfin, éloignez votre bouquet des sources de chaleur, des courants d'air et de la corbeille de fruits : l'éthylène dégagé par les fruits mûrs fait faner les fleurs prématurément.",
    ],
  },
  {
    slug: "fleurs-mariage",
    title: "Choisir les fleurs de son mariage",
    date: "21 mai 2026",
    category: "Mariages",
    excerpt:
      "Du bouquet de mariée aux compositions de cérémonie : comment penser une direction florale cohérente pour le grand jour.",
    cover: C.accent,
    coverImage: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=1200&h=600&fit=crop&q=80",
    body: [
      "Un mariage floral réussi commence par une palette restreinte de deux ou trois couleurs, déclinée du bouquet de la mariée aux centres de table. La cohérence prime sur la profusion.",
      "Nous recommandons de réserver trois à six mois à l'avance, en particulier pour les dates estivales très demandées. Cela nous laisse le temps de sourcer les variétés exactes que vous imaginez.",
      "Le jour J, notre équipe installe et veille sur chaque composition. Du premier brief à la dernière pétale posée sur l'arche, nous assurons une direction florale complète.",
    ],
  },
  {
    slug: "langage-des-fleurs",
    title: "Le langage des fleurs, mode d'emploi",
    date: "9 mai 2026",
    category: "Culture",
    excerpt:
      "La rose pour l'amour, la pivoine pour la prospérité, l'eucalyptus pour la sérénité : décryptage des symboles floraux.",
    cover: C.sageMid,
    coverImage: "https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=1200&h=600&fit=crop&q=80",
    body: [
      "Né au XIXe siècle, le langage des fleurs attribuait à chaque variété un message précis. La rose rouge déclarait l'amour, la pivoine annonçait la prospérité, le lilas évoquait les premiers émois.",
      "Aujourd'hui encore, ces symboles inspirent nos compositions. Offrir un bouquet, c'est transmettre une intention autant qu'une beauté.",
      "Lorsque vous commandez, n'hésitez pas à nous préciser l'occasion et l'émotion à transmettre : nous composons un bouquet qui parle pour vous.",
    ],
  },
];

export const SERIF = "'Libre Baskerville', Georgia, serif";
export const SANS = "'Poppins', system-ui";

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div style={{ background: C.bgPink, padding: "140px 24px 64px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 75% 20%, rgba(244,143,177,0.25) 0%, transparent 60%)`, pointerEvents: "none" }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 32, height: 1, background: C.accent }} />
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>{eyebrow}</span>
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px, 6vw, 72px)", color: C.accent, margin: 0, fontWeight: 700, lineHeight: 1.04 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontFamily: SANS, fontSize: 17, color: C.textMuted, lineHeight: 1.7, maxWidth: 560, marginTop: 24 }}>{subtitle}</p>
        )}
      </motion.div>
    </div>
  );
}

// ─── CART CONTEXT ────────────────────────────────────────────────────────────
export interface CartContextType {
  cartCount: number;
  addToCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const addToCart = () => setCartCount(c => c + 1);

  return (
    <CartContext.Provider value={{ cartCount, addToCart, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}
