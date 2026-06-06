"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Menu, X, Phone, Mail, MapPin, Clock, Star, ChevronDown,
  ArrowRight, Check, Leaf, Sun, Snowflake, Wind, Heart,
  Gift, Briefcase, Users, Camera, MessageSquare, ShoppingBag,
  ChevronLeft, Truck, RefreshCw, Package
} from "lucide-react";

const C = {
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

const navLinks = [
  { label: "Collections", href: "#collections" },
  { label: "Occasions", href: "#occasions" },
  { label: "Workshop", href: "#workshop" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Subscribe", href: "#subscribe" },
  { label: "FAQ", href: "#faq" },
];

const petalPaths = [
  { x: [0, -60, 80, -40], y: [0, 200, 480, 700], rotate: [0, 45, -30, 90], scale: [1, 0.8, 1.1, 0.7] },
  { x: [0, 80, -50, 60], y: [0, 150, 400, 680], rotate: [0, -60, 40, -80], scale: [0.8, 1.1, 0.9, 1.2] },
  { x: [0, -90, 40, -70], y: [0, 250, 500, 720], rotate: [0, 70, -20, 100], scale: [1.1, 0.7, 1, 0.8] },
  { x: [0, 50, -80, 30], y: [0, 180, 420, 660], rotate: [0, -40, 80, -60], scale: [0.9, 1.2, 0.8, 1] },
  { x: [0, -70, 90, -50], y: [0, 220, 460, 700], rotate: [0, 55, -45, 70], scale: [1.2, 0.9, 1.1, 0.8] },
  { x: [0, 100, -30, 80], y: [0, 170, 390, 650], rotate: [0, -80, 30, -100], scale: [0.85, 1, 0.9, 1.15] },
];

const petalColors = [C.accent, C.rose, "#e91e8c", C.sage, "#f06292", C.accent];

function FallingPetal({ index }: { index: number }) {
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

const seasons = [
  {
    id: "spring",
    label: "Spring",
    icon: Leaf,
    accent: C.sage,
    desc: "Tulips, peonies, ranunculus, and cherry blossom — the season of fresh beginnings.",
    arrangements: [
      { name: "Jardin de Printemps", price: "€65", desc: "Peonies, tulipes, and garden roses in blush and cream." },
      { name: "Blossom Drift", price: "€85", desc: "Cherry blossom stems with delicate sweet peas and freesia." },
      { name: "Green Awakening", price: "€55", desc: "Eucalyptus, ferns, and seasonal greens with white blooms." },
    ],
  },
  {
    id: "summer",
    label: "Summer",
    icon: Sun,
    accent: "#f57f17",
    desc: "Sunflowers, dahlias, lavender, and lush garden roses at their peak.",
    arrangements: [
      { name: "Soleil de Provence", price: "€70", desc: "Sunflowers, lavender, and golden dahlias in warm abundance." },
      { name: "Rose Vif", price: "€95", desc: "Garden roses in deep coral and orange with jasmine vine." },
      { name: "Tropical Luxe", price: "€120", desc: "Birds of paradise, proteas, and tropical foliage statement piece." },
    ],
  },
  {
    id: "fall",
    label: "Autumn",
    icon: Wind,
    accent: "#bf360c",
    desc: "Dahlias, chrysanthemums, dried botanicals, and warm seasonal textures.",
    arrangements: [
      { name: "Automne Doré", price: "€75", desc: "Rust dahlias, orange chrysanthemums, and dried wheat stems." },
      { name: "Dried Luxe", price: "€90", desc: "Pampas, lunaria, preserved botanicals in sculptural composition." },
      { name: "Forest Floor", price: "€60", desc: "Wild mushrooms, moss, pine branches, and seasonal berries." },
    ],
  },
  {
    id: "winter",
    label: "Winter",
    icon: Snowflake,
    accent: "#1565c0",
    desc: "White amaryllis, hellebores, pine, and the deep red of winterberries.",
    arrangements: [
      { name: "Blanc de Noël", price: "€80", desc: "White amaryllis, eucalyptus, and silver-dusted pine branches." },
      { name: "Velvet Crimson", price: "€90", desc: "Deep red roses, winterberry, and dark greenery." },
      { name: "Hiver Minimaliste", price: "€65", desc: "Single-variety hellebore and dried cotton stems in clean lines." },
    ],
  },
];

const occasions = [
  { icon: Heart, title: "Weddings", desc: "Bridal bouquets, ceremony installations, reception centrepieces, and full floral direction from initial brief to last petal on the day.", color: C.accent },
  { icon: Sun, title: "Funerals & Tribute", desc: "Respectful, beautiful arrangements for memorial services. We work directly with families and funeral homes with sensitivity and care.", color: C.textMuted },
  { icon: Gift, title: "Birthdays & Events", desc: "Statement arrangements delivered directly to the door, or a workshop where guests create their own bouquet — memorable both ways.", color: C.sage },
  { icon: Briefcase, title: "Corporate", desc: "Weekly office flowers, event installations for product launches, showrooms, and galas. Invoiced monthly, fully managed.", color: C.accent },
];

const testimonials = [
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

const subscriptionTiers = [
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

const faqs = [
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

// ════════════════════════════════════════════════════════════════════════════
// MULTI-PAGE PATTERN (reused identically from impact-168 / impact-215): a single
// `page` state drives in-page navigation. NAV_PAGES maps route key -> label. The
// original single-page content renders verbatim under page === "home"; every
// other key renders a theme-native sub-page built from the same `C` tokens,
// 'Libre Baskerville'/'Poppins' typography, nav and footer.
// ════════════════════════════════════════════════════════════════════════════
type FloristPage = "home" | "boutique" | "blog" | "about" | "contact" | "cgv" | "mentions";

const NAV_PAGES: { key: FloristPage; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "boutique", label: "Boutique" },
  { key: "blog", label: "Blog" },
  { key: "about", label: "À propos" },
  { key: "contact", label: "Contact" },
  { key: "cgv", label: "CGV" },
  { key: "mentions", label: "Mentions" },
];

// ─── Boutique product data (FR florist) ─────────────────────────────────────
const PRODUCTS = [
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
  },
];

// ─── Blog mock data (FR florist) ────────────────────────────────────────────
const BLOG_POSTS = [
  {
    slug: "fleurs-de-saison",
    title: "Pourquoi choisir des fleurs de saison",
    date: "12 juin 2026",
    category: "Saisons",
    excerpt:
      "Plus fraîches, plus durables et plus belles : les raisons pour lesquelles nous composons exclusivement avec les fleurs du moment.",
    cover: C.rose,
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
    body: [
      "Né au XIXe siècle, le langage des fleurs attribuait à chaque variété un message précis. La rose rouge déclarait l'amour, la pivoine annonçait la prospérité, le lilas évoquait les premiers émois.",
      "Aujourd'hui encore, ces symboles inspirent nos compositions. Offrir un bouquet, c'est transmettre une intention autant qu'une beauté.",
      "Lorsque vous commandez, n'hésitez pas à nous préciser l'occasion et l'émotion à transmettre : nous composons un bouquet qui parle pour vous.",
    ],
  },
];

function Navbar({ page, goTo, cartCount, onCartOpen }: { page: FloristPage; goTo: (p: FloristPage) => void; cartCount: number; onCartOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Home keeps its original transparent-on-top behaviour; sub-pages always get a
  // solid background so the nav stays legible without a full-screen hero behind it.
  const solid = scrolled || page !== "home";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: solid ? "rgba(255,253,248,0.97)" : "transparent",
      borderBottom: solid ? `1px solid ${C.border}` : "none",
      backdropFilter: solid ? "blur(16px)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="#" onClick={e => { e.preventDefault(); goTo("home"); }} style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 28 28" style={{ width: 28, height: 28 }}>
                <circle cx="14" cy="14" r="5" fill={C.accent} />
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <ellipse key={i} cx={14 + 9 * Math.cos((angle * Math.PI) / 180)} cy={14 + 9 * Math.sin((angle * Math.PI) / 180)} rx="3.5" ry="5.5" fill={C.rose} opacity="0.85" transform={`rotate(${angle + 90} ${14 + 9 * Math.cos((angle * Math.PI) / 180)} ${14 + 9 * Math.sin((angle * Math.PI) / 180)})`} />
                ))}
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.accent, letterSpacing: "0.02em" }}>Pétales & Co</div>
              <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 9, color: C.sage, letterSpacing: "0.18em", textTransform: "uppercase" as const }}>Artisan Florist</div>
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="florist-desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_PAGES.map((l) => (
            <a key={l.key} href="#"
              onClick={e => { e.preventDefault(); goTo(l.key); }}
              style={{ color: page === l.key ? C.accent : C.textMuted, fontSize: 13, letterSpacing: "0.04em", textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: page === l.key ? 600 : 400, borderBottom: page === l.key ? `1px solid ${C.accent}` : "1px solid transparent", paddingBottom: 2, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={e => (e.currentTarget.style.color = page === l.key ? C.accent : C.textMuted)}
            >{l.label}</a>
          ))}
          <button onClick={onCartOpen}
            style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, background: C.accent, color: C.white, padding: "10px 22px", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "'Poppins', system-ui", fontWeight: 600, borderRadius: 2, border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >
            <ShoppingBag size={14} /> Panier
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, background: C.sage, color: C.white, borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
            )}
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="florist-mobile-toggle" onClick={() => setMenuOpen(o => !o)}
          style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", color: C.accent, padding: 4 }}
          aria-label="Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", background: "rgba(255,253,248,0.99)", borderBottom: `1px solid ${C.border}` }}
          >
            <div style={{ display: "flex", flexDirection: "column" as const, padding: "12px 24px 20px", gap: 4 }}>
              {NAV_PAGES.map((l) => (
                <a key={l.key} href="#"
                  onClick={e => { e.preventDefault(); setMenuOpen(false); goTo(l.key); }}
                  style={{ color: page === l.key ? C.accent : C.textMuted, fontSize: 15, padding: "10px 0", textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: page === l.key ? 600 : 400, borderBottom: `1px solid ${C.border}` }}
                >{l.label}</a>
              ))}
              <button onClick={() => { setMenuOpen(false); onCartOpen(); }}
                style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.accent, color: C.white, padding: "12px", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "'Poppins', system-ui", fontWeight: 600, borderRadius: 2, border: "none", cursor: "pointer" }}
              ><ShoppingBag size={15} /> Panier ({cartCount})</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100vh", background: C.bgPink, display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Falling petals */}
      {petalPaths.map((_, i) => (
        <FallingPetal key={i} index={i} />
      ))}

      {/* Soft gradient background */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 30%, rgba(244,143,177,0.3) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(136,14,79,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%", textAlign: "center" as const }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}
        >
          <Leaf size={14} color={C.sage} />
          <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.sage, fontWeight: 500 }}>Artisan Florist · Paris, France</span>
          <Leaf size={14} color={C.sage} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 700, color: C.accent, lineHeight: 0.95, margin: "0 0 28px" }}
        >
          For Every<br />
          <span style={{ color: C.text }}>Moment.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ fontFamily: "'Poppins', system-ui", fontSize: 18, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}
        >
          Hand-crafted seasonal arrangements, botanical bouquet subscriptions, and wedding floral direction from our Parisian studio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}
        >
          <button onClick={() => document.getElementById("subscribe")?.scrollIntoView({behavior:"smooth"})}
            style={{ background: C.accent, color: C.white, padding: "16px 40px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >Shop Subscriptions <ArrowRight size={15} /></button>
          <button onClick={() => document.getElementById("occasions")?.scrollIntoView({behavior:"smooth"})}
            style={{ border: `1.5px solid ${C.borderAccent}`, color: C.accent, padding: "16px 40px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 600, background: "rgba(255,255,255,0.6)" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.color = C.accent; }}
          >Browse Occasions</button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 72, flexWrap: "wrap" as const }}
        >
          {[
            { val: "12 ans", label: "d'expérience" },
            { val: "4,000+", label: "arrangements créés" },
            { val: "98%", label: "clients satisfaits" },
            { val: "350+", label: "mariages floraux" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" as const }}>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 28, fontWeight: 700, color: C.accent }}>{s.val}</div>
              <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function CollectionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeSeason, setActiveSeason] = useState("spring");
  const active = seasons.find(s => s.id === activeSeason) || seasons[0];

  return (
    <section id="collections" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 56 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Seasonal Collections</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: 0, fontWeight: 700 }}>Nature's Calendar</h2>
        </motion.div>

        {/* Season tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 48 }}>
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: activeSeason === s.id ? C.accent : "transparent", color: activeSeason === s.id ? C.white : C.textMuted, border: activeSeason === s.id ? "none" : `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Poppins', system-ui", fontSize: 13, fontWeight: activeSeason === s.id ? 600 : 400, letterSpacing: "0.04em", transition: "all 0.2s" }}
            >
              <s.icon size={14} />
              {s.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeason}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, marginBottom: 40, maxWidth: 560 }}>{active.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {active.arrangements.map((arr, i) => (
                <motion.div
                  key={arr.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "0 0 32px", overflow: "hidden", cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderAccent; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.transition = "all 0.2s"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: 200, background: `linear-gradient(135deg, ${C.blush}, rgba(244,143,177,0.4))`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Camera size={36} color={C.borderAccent} />
                  </div>
                  <div style={{ padding: "0 24px" }}>
                    <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, color: C.text, margin: "0 0 8px", fontWeight: 700 }}>{arr.name}</h3>
                    <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 16px" }}>{arr.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: C.accent, fontWeight: 700 }}>{arr.price}</span>
                      <Link href="#" style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.accent, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>Order <ArrowRight size={13} /></Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function OccasionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="occasions" ref={ref} style={{ background: C.blush, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64, textAlign: "center" as const }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Occasions</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>Flowers for Every Chapter</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>From the most joyful celebration to the most tender farewell — we're here for every occasion that matters.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {occasions.map((occ, i) => (
            <motion.div
              key={occ.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: C.bgCard, padding: 40, display: "flex", gap: 24, alignItems: "flex-start", border: `1px solid ${C.border}` }}
            >
              <div style={{ width: 56, height: 56, background: `rgba(136,14,79,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: "50%" }}>
                <occ.icon size={24} color={C.accent} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: C.text, margin: "0 0 10px", fontWeight: 700 }}>{occ.title}</h3>
                <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.65, margin: "0 0 20px" }}>{occ.desc}</p>
                <Link href="#" style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: C.accent, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  Learn more <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkshopSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="workshop" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ background: `linear-gradient(135deg, ${C.sageLight}, ${C.roseLight})`, height: 480, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.borderSage}` }}
        >
          <div style={{ textAlign: "center" as const, padding: 40 }}>
            <Leaf size={48} color={C.sage} style={{ marginBottom: 16 }} />
            <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 20, color: C.sage, fontStyle: "italic" }}>Our Parisian Studio</p>
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: C.textMuted, marginTop: 8 }}>18 Rue du Marché, Paris 11e</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.sage }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.sage }}>Our Story</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", color: C.text, margin: "0 0 24px", fontWeight: 700 }}>Made by Hand,<br />With Intention.</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginBottom: 24 }}>Pétales & Co was born from a simple belief: flowers shouldn't be an afterthought. Founded in 2014 by florist Amélie Rousseau, our studio in the 11th arrondissement has become a gathering place for people who care about natural beauty.</p>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginBottom: 40 }}>We work with small French growers wherever possible, choose seasonal flowers over imported blooms, and make every arrangement by hand — from a single stem to a wedding arch.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
            {[
              { val: "€65", label: "Workshop from" },
              { val: "2h", label: "Session length" },
              { val: "12", label: "Max per group" },
              { val: "Weekly", label: "Public sessions" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "20px 24px", background: C.bgPink, border: `1px solid ${C.borderAccent}` }}>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 24, color: C.accent, fontWeight: 700 }}>{s.val}</div>
                <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <Link href="#"
            style={{ background: C.sage, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.sageMid)}
            onMouseLeave={e => (e.currentTarget.style.background = C.sage)}
          >Book a Workshop <ArrowRight size={15} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" ref={ref} style={{ background: C.bgPink, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64, textAlign: "center" as const }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Testimonials</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: 0, fontWeight: 700 }}>What Our Clients Say</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}` }}
            >
              <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill={C.accent} color={C.accent} />
                ))}
              </div>
              <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 16, color: C.text, lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <div>
                  <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: C.text, margin: "0 0 2px", fontWeight: 600 }}>{t.name}</p>
                  <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textDim, margin: 0 }}>{t.location}</p>
                </div>
                <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, border: `1px solid ${C.borderAccent}`, padding: "3px 8px" }}>{t.occasion}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubscribeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="subscribe" ref={ref} style={{ background: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" as const, marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>Bouquet Subscriptions</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.text, margin: "0 0 16px", fontWeight: 700 }}>Always Fresh. Never Repeated.</h2>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>Seasonal bouquets, curated by hand, delivered to your door on schedule. Pause or cancel anytime.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {subscriptionTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ background: tier.featured ? C.accent : C.bgCard, padding: 40, border: tier.featured ? "none" : `1px solid ${C.border}`, display: "flex", flexDirection: "column" as const, position: "relative" }}
            >
              {tier.featured && (
                <div style={{ position: "absolute", top: 20, right: 20, background: C.white, color: C.accent, fontSize: 10, fontFamily: "'Poppins', system-ui", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "3px 8px" }}>Best Value</div>
              )}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, color: tier.featured ? "rgba(255,255,255,0.7)" : C.textDim, letterSpacing: "0.12em", textTransform: "uppercase" as const, margin: "0 0 8px" }}>{tier.duration}</p>
                <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 8px", fontWeight: 700 }}>{tier.name}</h3>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 36, color: tier.featured ? C.white : C.accent, fontWeight: 700 }}>{tier.price}</div>
              </div>
              <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: tier.featured ? "rgba(255,255,255,0.85)" : C.textMuted, lineHeight: 1.65, marginBottom: 28, flex: 1 }}>{tier.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                {tier.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Check size={14} color={tier.featured ? C.white : C.sage} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: tier.featured ? "rgba(255,255,255,0.9)" : C.textMuted }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="#"
                style={{ display: "block", textAlign: "center" as const, background: tier.featured ? C.white : C.accent, color: tier.featured ? C.accent : C.white, padding: "14px 24px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: 700 }}
              >{tier.cta}</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} style={{ background: C.blush, padding: "120px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: C.accent }}>FAQ</span>
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", color: C.text, margin: 0, fontWeight: 700 }}>Questions & Answers</h2>
        </motion.div>

        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            style={{ borderBottom: `1px solid ${C.borderAccent}`, background: openIdx === i ? "rgba(255,255,255,0.6)" : "transparent" }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
            >
              <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, color: C.text, fontWeight: 600 }}>{faq.q}</span>
              <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={18} color={C.accent} />
              </motion.div>
            </button>
            <motion.div
              initial={false}
              animate={{ height: openIdx === i ? "auto" : 0, opacity: openIdx === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, padding: "0 24px 24px", margin: 0 }}>{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer({ goTo }: { goTo: (p: FloristPage) => void }) {
  const footerCols: { title: string; links: { label: string; page: FloristPage }[] }[] = [
    { title: "Boutique", links: [
      { label: "Tous les bouquets", page: "boutique" },
      { label: "Créations de saison", page: "boutique" },
      { label: "Plantes & cache-pots", page: "boutique" },
      { label: "Compositions sur mesure", page: "boutique" },
    ] },
    { title: "Atelier", links: [
      { label: "Notre histoire", page: "about" },
      { label: "Le blog", page: "blog" },
      { label: "Nous contacter", page: "contact" },
      { label: "Accueil", page: "home" },
    ] },
    { title: "Infos", links: [
      { label: "CGV", page: "cgv" },
      { label: "Mentions légales", page: "mentions" },
      { label: "Contact", page: "contact" },
      { label: "Blog", page: "blog" },
    ] },
  ];
  return (
    <footer style={{ background: C.text, padding: "80px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <svg viewBox="0 0 28 28" style={{ width: 28, height: 28 }}>
                <circle cx="14" cy="14" r="5" fill={C.accent} />
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <ellipse key={i} cx={14 + 9 * Math.cos((angle * Math.PI) / 180)} cy={14 + 9 * Math.sin((angle * Math.PI) / 180)} rx="3.5" ry="5.5" fill={C.rose} opacity="0.7" transform={`rotate(${angle + 90} ${14 + 9 * Math.cos((angle * Math.PI) / 180)} ${14 + 9 * Math.sin((angle * Math.PI) / 180)})`} />
                ))}
              </svg>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.white }}>Pétales & Co</div>
                <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 9, color: C.rose, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Artisan Florist</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>Hand-crafted floral arrangements, seasonal subscriptions, and wedding floral direction. Paris, France.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={14} color={C.rose} />
              <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>@petalesandco</span>
            </div>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.rose, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 20 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link, li) => (
                  <li key={li} style={{ marginBottom: 12 }}>
                    <a href="#"
                      onClick={e => { e.preventDefault(); goTo(link.page); }}
                      style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const }}>
            {[
              { Icon: MapPin, text: "18 Rue du Marché, Paris 11e" },
              { Icon: Phone, text: "+33 1 43 00 00 00" },
              { Icon: Clock, text: "Mar–Sam, 9h–19h" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={13} color={C.rose} />
                <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            <a href="#" onClick={e => { e.preventDefault(); goTo("mentions"); }} style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.rose)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>Mentions légales</a>
            ·
            <a href="#" onClick={e => { e.preventDefault(); goTo("cgv"); }} style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.rose)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>CGV</a>
            · © 2026 Pétales & Co.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function FloristTemplate() {
  // Multi-page state (pattern from impact-168 / impact-215)
  const [page, setPage] = useState<FloristPage>("home");
  const [productDetail, setProductDetail] = useState<number | null>(null);
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  const goTo = (p: FloristPage) => {
    setPage(p);
    setProductDetail(null);
    setBlogSlug(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  };
  const addToCart = () => setCartCount(c => c + 1);

  return (
    <main style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 860px) {
          .florist-desktop-nav { display: none !important; }
          .florist-mobile-toggle { display: flex !important; }
        }
      `}</style>

      <Navbar page={page} goTo={goTo} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      {/* ══════════ HOME (original single-page content, unchanged) ══════════ */}
      {page === "home" && (
        <>
          <HeroSection />
          <CollectionsSection />
          <OccasionsSection />
          <WorkshopSection />
          <TestimonialsSection />
          <SubscribeSection />
          <FAQSection />
        </>
      )}

      {/* ══════════ SUB-PAGES ══════════ */}
      {page === "boutique" && (
        <BoutiquePage productDetail={productDetail} setProductDetail={setProductDetail} onAddToCart={addToCart} />
      )}
      {page === "blog" && <BlogPage blogSlug={blogSlug} setBlogSlug={setBlogSlug} />}
      {page === "about" && <AboutPage goTo={goTo} />}
      {page === "contact" && <ContactPage />}
      {page === "cgv" && <LegalPage variant="cgv" />}
      {page === "mentions" && <LegalPage variant="mentions" />}

      <Footer goTo={goTo} />

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(45,26,31,0.45)", zIndex: 200 }}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 90vw)", background: C.white, borderLeft: `1px solid ${C.border}`, zIndex: 201, display: "flex", flexDirection: "column" }}
            >
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 20, color: C.accent, fontWeight: 700 }}>Votre panier ({cartCount})</div>
                <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><X size={20} /></button>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: 24 }}>
                <ShoppingBag size={32} color={C.textDim} />
                <p style={{ fontSize: 14, color: C.textMuted, fontFamily: "'Poppins', system-ui", textAlign: "center" as const }}>
                  {cartCount === 0
                    ? "Votre panier est vide pour le moment."
                    : `${cartCount} article${cartCount > 1 ? "s" : ""} ajouté${cartCount > 1 ? "s" : ""} à votre panier.`}
                </p>
              </div>
              <div style={{ padding: "24px 28px", borderTop: `1px solid ${C.border}` }}>
                <button
                  disabled={cartCount === 0}
                  style={{ width: "100%", padding: "16px", background: cartCount === 0 ? C.textDim : C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: cartCount === 0 ? "not-allowed" : "pointer", fontFamily: "'Poppins', system-ui", borderRadius: 2 }}
                >Passer commande</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SUB-PAGE COMPONENTS — styled exclusively from the `C` tokens and the theme's
// 'Libre Baskerville' / 'Poppins' typography, so they render natively inside the
// Pétales & Co florist design.
// ════════════════════════════════════════════════════════════════════════════

const SERIF = "'Libre Baskerville', Georgia, serif";
const SANS = "'Poppins', system-ui";

// Shared editorial page header (matches home section eyebrow + serif title).
function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
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

// ─── BOUTIQUE ───────────────────────────────────────────────────────────────
function BoutiquePage({ productDetail, setProductDetail, onAddToCart }: {
  productDetail: number | null; setProductDetail: (i: number | null) => void; onAddToCart: () => void;
}) {
  if (productDetail !== null && PRODUCTS[productDetail]) {
    return <ProductDetail p={PRODUCTS[productDetail]} onBack={() => setProductDetail(null)} onAddToCart={onAddToCart} />;
  }
  return (
    <div>
      <PageHero
        eyebrow="La boutique"
        title="Nos bouquets & créations"
        subtitle="Compositions de saison, plantes et créations sur mesure, façonnées à la main dans notre atelier parisien. Cliquez sur une création pour découvrir sa fiche."
      />
      <section style={{ background: C.bg, padding: "72px 24px 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {PRODUCTS.map((p, i) => (
            <ShopCard key={p.name} p={p} i={i} onOpen={() => {
              setProductDetail(i);
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
            }} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Boutique card — reuses the home CollectionsSection card visual language.
function ShopCard({ p, i, onOpen }: { p: typeof PRODUCTS[0]; i: number; onOpen: () => void }) {
  const tagColors: Record<string, string> = {
    season: C.sage, sale: "#bf360c", best: C.accent, limited: "#1565c0", new: C.sageMid,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
      onClick={onOpen}
      style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "0 0 32px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderAccent; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
    >
      <div style={{ height: 220, background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, position: "relative" }}>
        <Camera size={34} color="rgba(255,255,255,0.55)" />
        {p.tag && (
          <div style={{ position: "absolute", top: 14, left: 14, background: p.tagType ? tagColors[p.tagType] : C.accent, color: C.white, padding: "4px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", fontFamily: SANS, textTransform: "uppercase" as const }}>{p.tag}</div>
        )}
      </div>
      <div style={{ padding: "0 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, color: C.sage, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>{p.collection}</div>
        <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.text, margin: "0 0 8px", fontWeight: 700 }}>{p.name}</h3>
        <p style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted, lineHeight: 1.6, margin: "0 0 14px" }}>{p.desc}</p>
        <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 14 }}>
          {[...Array(5)].map((_, j) => (<Star key={j} size={11} fill={C.accent} color={C.accent} />))}
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: SANS, marginLeft: 4 }}>{p.rating} ({p.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontFamily: SERIF, fontSize: 22, color: C.accent, fontWeight: 700 }}>{p.price} €</span>
            {p.oldPrice && (<span style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, textDecoration: "line-through" }}>{p.oldPrice} €</span>)}
          </div>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.accent, display: "flex", alignItems: "center", gap: 4 }}>Voir <ArrowRight size={13} /></span>
        </div>
      </div>
    </motion.div>
  );
}

// Product detail — large visual + color/qty selector + add-to-cart, theme styling.
function ProductDetail({ p, onBack, onAddToCart }: { p: typeof PRODUCTS[0]; onBack: () => void; onAddToCart: () => void }) {
  const [activeColor, setActiveColor] = useState(0);
  const [added, setAdded] = useState(false);
  const handleAdd = () => { onAddToCart(); setAdded(true); setTimeout(() => setAdded(false), 2000); };
  return (
    <section style={{ background: C.bg, padding: "120px 24px 100px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <button onClick={onBack}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontFamily: SANS, fontSize: 13, marginBottom: 36 }}
          onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
          onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
        ><ChevronLeft size={16} /> Retour à la boutique</button>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(32px, 5vw, 72px)", alignItems: "start" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ height: "clamp(380px, 56vw, 560px)", background: `linear-gradient(135deg, ${p.colors[activeColor]}, ${p.colors[(activeColor + 1) % p.colors.length]})`, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
          >
            <Camera size={48} color="rgba(255,255,255,0.5)" />
            {p.tag && (<div style={{ position: "absolute", top: 18, left: 18, background: C.accent, color: C.white, padding: "5px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", fontFamily: SANS, textTransform: "uppercase" as const }}>{p.tag}</div>)}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.sage, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 12 }}>{p.collection}</div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 46px)", color: C.accent, margin: "0 0 16px", fontWeight: 700 }}>{p.name}</h1>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 24 }}>
              {[...Array(5)].map((_, j) => (<Star key={j} size={14} fill={C.accent} color={C.accent} />))}
              <span style={{ fontSize: 12, color: C.textMuted, fontFamily: SANS, marginLeft: 6 }}>{p.rating} · {p.reviews} avis vérifiés</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 28 }}>
              <span style={{ fontFamily: SERIF, fontSize: 34, color: C.accent, fontWeight: 700 }}>{p.price} €</span>
              {p.oldPrice && (<span style={{ fontSize: 17, color: C.textDim, textDecoration: "line-through", fontFamily: SANS }}>{p.oldPrice} €</span>)}
            </div>
            <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.8, marginBottom: 28, maxWidth: 460 }}>
              {p.desc} Composé à la main dans notre atelier parisien avec des fleurs de saison ({p.material.toLowerCase()}), livré dans un emballage kraft avec ruban et carte d'entretien.
            </p>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>Palette</div>
              <div style={{ display: "flex", gap: 10 }}>
                {p.colors.map((color, ci) => (
                  <button key={ci} onClick={() => setActiveColor(ci)}
                    style={{ width: 30, height: 30, borderRadius: "50%", background: color, border: `2px solid ${activeColor === ci ? C.accent : C.border}`, cursor: "pointer", padding: 0 }} />
                ))}
              </div>
            </div>
            <button onClick={handleAdd}
              style={{ width: "100%", maxWidth: 460, padding: "17px", background: added ? C.sage : C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: "pointer", transition: "all 0.2s", fontFamily: SANS, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >{added ? (<><Check size={16} /> Ajouté au panier</>) : (<><ShoppingBag size={16} /> Ajouter au panier</>)}</button>
            <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap" as const }}>
              <span style={{ fontSize: 12, color: C.textMuted, fontFamily: SANS, display: "flex", alignItems: "center", gap: 6 }}><Truck size={13} color={C.sage} /> Livraison Paris offerte</span>
              <span style={{ fontSize: 12, color: C.textMuted, fontFamily: SANS, display: "flex", alignItems: "center", gap: 6 }}><Leaf size={13} color={C.sage} /> Fleurs fraîches de saison</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── BLOG ───────────────────────────────────────────────────────────────────
function BlogPage({ blogSlug, setBlogSlug }: { blogSlug: string | null; setBlogSlug: (s: string | null) => void }) {
  const post = blogSlug ? BLOG_POSTS.find(b => b.slug === blogSlug) : null;
  if (post) {
    return (
      <section style={{ background: C.bg, padding: "120px 24px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <button onClick={() => setBlogSlug(null)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontFamily: SANS, fontSize: 13, marginBottom: 32 }}
            onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
          ><ChevronLeft size={16} /> Tous les articles</button>
          <div style={{ fontFamily: SANS, fontSize: 11, color: C.sage, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 14 }}>{post.category} · {post.date}</div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 52px)", color: C.accent, margin: "0 0 32px", fontWeight: 700, lineHeight: 1.1 }}>{post.title}</h1>
          <div style={{ height: "clamp(220px, 38vw, 360px)", background: `linear-gradient(135deg, ${post.cover}, ${C.blush})`, border: `1px solid ${C.border}`, marginBottom: 40 }} />
          {post.body.map((paraTxt, i) => (
            <p key={i} style={{ fontFamily: SANS, fontSize: 17, color: C.textMuted, lineHeight: 1.9, marginBottom: 24 }}>{paraTxt}</p>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 24, fontSize: 13, color: C.textDim, fontFamily: SERIF, fontStyle: "italic" }}>
            Rédigé par l'équipe de Pétales & Co.
          </div>
        </div>
      </section>
    );
  }
  return (
    <div>
      <PageHero eyebrow="Le journal" title="Le Blog de l'atelier" subtitle="Conseils d'entretien, fleurs de saison, inspirations mariage et culture florale, par nos fleuristes." />
      <section style={{ background: C.bg, padding: "72px 24px 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {BLOG_POSTS.map((post, i) => (
            <motion.article key={post.slug}
              initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => { setBlogSlug(post.slug); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }); }}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column" as const }}
            >
              <div style={{ height: 190, background: `linear-gradient(135deg, ${post.cover}, ${C.blush})` }} />
              <div style={{ padding: "24px 26px 28px" }}>
                <div style={{ fontFamily: SANS, fontSize: 10, color: C.sage, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 12 }}>{post.category} · {post.date}</div>
                <h2 style={{ fontFamily: SERIF, fontSize: 21, color: C.text, lineHeight: 1.3, margin: "0 0 14px", fontWeight: 700 }}>{post.title}</h2>
                <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: "0 0 18px" }}>{post.excerpt}</p>
                <span style={{ fontFamily: SANS, fontSize: 12, color: C.accent, display: "inline-flex", alignItems: "center", gap: 6 }}>Lire l'article <ArrowRight size={13} /></span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── À PROPOS ───────────────────────────────────────────────────────────────
function AboutPage({ goTo }: { goTo: (p: FloristPage) => void }) {
  const values = [
    { icon: <Leaf size={22} />, title: "Fleurs de saison", text: "Nous composons avec les fleurs du moment et privilégions les petits cultivateurs français dès que la saison le permet." },
    { icon: <Heart size={22} />, title: "Fait main, avec intention", text: "Chaque création est façonnée à la main dans notre atelier, du simple bouquet à l'arche de mariage." },
    { icon: <Package size={22} />, title: "Emballage soigné", text: "Papier kraft, ruban et carte d'entretien : un soin du détail jusque dans la livraison, à votre porte." },
  ];
  return (
    <div>
      <PageHero eyebrow="Notre histoire" title="Fait main, avec amour." subtitle="Pétales & Co est née d'une conviction simple : les fleurs ne devraient jamais être un détail. Elles racontent nos moments les plus précieux." />
      <section style={{ background: C.bg, padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {[
            "Fondé en 2014 par la fleuriste Amélie Rousseau, notre atelier du 11e arrondissement est devenu un lieu de rendez-vous pour celles et ceux qui aiment la beauté naturelle.",
            "Nous travaillons avec de petits producteurs français dès que possible, choisissons les fleurs de saison plutôt que les variétés importées, et composons chaque arrangement à la main — d'une simple tige à une arche de mariage.",
            "Notre raison d'être : transformer une émotion en bouquet. Un anniversaire, un mariage, un adieu, ou simplement l'envie d'égayer un intérieur. Pour chaque moment, une fleur.",
          ].map((paraTxt, i) => (
            <p key={i} style={{ fontFamily: SANS, fontSize: 17, color: C.textMuted, lineHeight: 1.9, marginBottom: 24 }}>{paraTxt}</p>
          ))}
        </div>
      </section>
      <section style={{ background: C.blush, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {values.map((v, i) => (
            <motion.div key={v.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "40px 32px" }}
            >
              <div style={{ width: 56, height: 56, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, marginBottom: 20 }}>{v.icon}</div>
              <h3 style={{ fontFamily: SERIF, fontSize: 21, color: C.text, margin: "0 0 12px", fontWeight: 700 }}>{v.title}</h3>
              <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section style={{ background: C.bg, padding: "90px 24px", textAlign: "center" as const }}>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 44px)", color: C.accent, margin: "0 0 20px", fontWeight: 700 }}>Une création vous attend.</h2>
        <p style={{ fontFamily: SANS, fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.7 }}>Découvrez nos bouquets de saison et nos compositions sur mesure.</p>
        <button onClick={() => goTo("boutique")}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.accent, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: SANS, fontWeight: 700, border: "none", borderRadius: 2, cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
          onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
        >Découvrir la boutique <ArrowRight size={15} /></button>
      </section>
    </div>
  );
}

// ─── CONTACT ────────────────────────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", background: C.white, border: `1px solid ${C.border}`, color: C.text,
    fontSize: 16, /* ≥16px to avoid iOS zoom */ outline: "none", fontFamily: SANS, marginBottom: 16, borderRadius: 2,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" as const, fontFamily: SANS, marginBottom: 8, display: "block",
  };
  return (
    <div>
      <PageHero eyebrow="Restons en contact" title="Nous contacter" subtitle="Une question sur une commande, un mariage ou un atelier ? Notre équipe vous répond sous 24h ouvrées." />
      <section style={{ background: C.bg, padding: "72px 24px 100px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(32px, 5vw, 64px)" }}>
          <div>
            {[
              { Icon: Mail, label: "Email", value: "contact@aevia.io" },
              { Icon: Phone, label: "Téléphone", value: "+33 1 43 00 00 00" },
              { Icon: MapPin, label: "Atelier", value: "18 Rue du Marché, Paris 11e" },
              { Icon: Clock, label: "Horaires", value: "Mar – Sam · 9h – 19h" },
            ].map(({ Icon, label, value }) => (
              <div key={label} style={{ marginBottom: 28, borderBottom: `1px solid ${C.border}`, paddingBottom: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={18} color={C.accent} /></div>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.sage, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 19, color: C.text, fontWeight: 700 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            {sent ? (
              <div style={{ border: `1px solid ${C.border}`, padding: "48px 36px", textAlign: "center" as const, background: C.bgCard }}>
                <div style={{ width: 56, height: 56, background: C.sageLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Check size={26} color={C.sage} /></div>
                <div style={{ fontFamily: SERIF, fontSize: 24, color: C.accent, marginBottom: 10, fontWeight: 700 }}>Message envoyé</div>
                <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>Merci ! Notre équipe vous répond sous 24h ouvrées.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
                <label style={labelStyle}>Nom complet</label>
                <input style={inputStyle} type="text" placeholder="Votre nom" required />
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="votre@email.fr" required />
                <label style={labelStyle}>Sujet</label>
                <input style={inputStyle} type="text" placeholder="Objet de votre message" />
                <label style={labelStyle}>Message</label>
                <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical" as const }} placeholder="Comment pouvons-nous vous aider ?" required />
                <button type="submit"
                  style={{ width: "100%", padding: "16px", background: C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: SANS, borderRadius: 2 }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                >Envoyer le message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── CGV & MENTIONS LÉGALES ─────────────────────────────────────────────────
// Long-form legal pages. `mentions` content is verbatim per legal requirement.
function LegalPage({ variant }: { variant: "cgv" | "mentions" }) {
  const sectionTitle: React.CSSProperties = { fontFamily: SERIF, fontSize: 23, color: C.accent, marginTop: 40, marginBottom: 14, fontWeight: 700 };
  const para: React.CSSProperties = { fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.9, marginBottom: 14 };

  if (variant === "mentions") {
    return (
      <div>
        <PageHero eyebrow="Informations légales" title="Mentions légales" />
        <section style={{ background: C.bg, padding: "64px 24px 100px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={sectionTitle}>Éditeur du site</h2>
            <p style={para}><strong style={{ color: C.text }}>Aevia WS</strong> — entrepreneur individuel (auto-entrepreneur).</p>
            <p style={para}>Directeur de la publication : <strong style={{ color: C.text }}>Valentin Milliand</strong>.</p>
            <p style={para}>SIREN : <strong style={{ color: C.text }}>852 546 225</strong> — RCS Bourg-en-Bresse.</p>
            <p style={para}>Contact : <strong style={{ color: C.text }}>contact@aevia.io</strong></p>
            <p style={para}>Adresse du siège social communiquée sur demande à contact@aevia.io.</p>

            <h2 style={sectionTitle}>TVA</h2>
            <p style={para}>TVA non applicable, art. 293 B du CGI.</p>

            <h2 style={sectionTitle}>Hébergeur</h2>
            <p style={para}>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

            <h2 style={sectionTitle}>Propriété intellectuelle</h2>
            <p style={para}>L'ensemble des contenus présents sur ce site (textes, visuels, logo, mise en page) est protégé par le droit de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable de l'éditeur.</p>

            <h2 style={sectionTitle}>Données personnelles</h2>
            <p style={para}>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, écrivez à contact@aevia.io.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero eyebrow="Conditions générales" title="Conditions générales de vente" />
      <section style={{ background: C.bg, padding: "64px 24px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ ...para, fontStyle: "italic", color: C.textDim }}>Dernière mise à jour : juin 2026.</p>

          <h2 style={sectionTitle}>Article 1 — Objet</h2>
          <p style={para}>Les présentes conditions générales de vente régissent les relations contractuelles entre Pétales & Co et tout client effectuant un achat sur le site. Toute commande implique l'acceptation sans réserve des présentes CGV.</p>

          <h2 style={sectionTitle}>Article 2 — Prix</h2>
          <p style={para}>Les prix sont indiqués en euros, toutes taxes comprises. Pétales & Co se réserve le droit de modifier ses prix à tout moment ; les articles sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>

          <h2 style={sectionTitle}>Article 3 — Commande</h2>
          <p style={para}>La commande est validée après confirmation du paiement. Un email récapitulatif est adressé au client. Pétales & Co se réserve le droit d'annuler toute commande en cas de litige de paiement ou de rupture de stock saisonnière.</p>

          <h2 style={sectionTitle}>Article 4 — Paiement</h2>
          <p style={para}>Le règlement s'effectue par carte bancaire via un prestataire de paiement sécurisé. Aucune donnée bancaire n'est conservée par Pétales & Co.</p>

          <h2 style={sectionTitle}>Article 5 — Livraison</h2>
          <p style={para}>Nous livrons dans Paris et l'Île-de-France. La livraison est offerte dans Paris ; un supplément peut s'appliquer en Île-de-France pour les commandes ponctuelles. Les fleurs étant des produits périssables, le client veille à être disponible au créneau de livraison convenu.</p>

          <h2 style={sectionTitle}>Article 6 — Droit de rétractation</h2>
          <p style={para}>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux biens périssables tels que les fleurs fraîches et compositions florales. Toute réclamation relative à la fraîcheur doit être signalée dans les 24h suivant la réception, photo à l'appui.</p>

          <h2 style={sectionTitle}>Article 7 — Garanties</h2>
          <p style={para}>Nous garantissons la fraîcheur de nos fleurs à la livraison. En cas de produit non conforme, un remplacement ou un avoir sera proposé après examen de la réclamation.</p>

          <h2 style={sectionTitle}>Article 8 — Droit applicable</h2>
          <p style={para}>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.</p>
        </div>
      </section>
    </div>
  );
}
