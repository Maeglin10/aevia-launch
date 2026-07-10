"use client";
// @ts-nocheck

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Search, User, ArrowRight, BookOpen, Clock, MessageSquare, Check, Link2, Camera, Bookmark, ChevronLeft, ChevronRight, Play } from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: "#FFFFFF",
  bgAlt: "#F7F5F0",
  bgDark: "#0D0D0D",
  text: "#0D0D0D",
  textMuted: "#6B6B6B",
  red: "#DC2626",
  redDark: "#B91C1C",
  redLight: "rgba(220,38,38,0.08)",
  border: "#E8E8E8",
  borderDark: "rgba(255,255,255,0.08)",
  cream: "#F7F5F0",
  serif: "'Playfair Display', 'Georgia', serif",
  sans: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Tech & Culture", color: "#7C3AED", count: 48 },
  { name: "Business", color: "#1D4ED8", count: 62 },
  { name: "Société", color: "#059669", count: 55 },
  { name: "Finance", color: "#D97706", count: 31 },
  { name: "Design", color: "#DB2777", count: 27 },
  { name: "Future du travail", color: "#0891B2", count: 39 },
];

const FEATURED_ARTICLE = {
  issue: "047",
  date: "Lundi 5 mai 2025",
  tag: "Tech & Culture",
  tagColor: "#7C3AED",
  title: "L'IA va-t-elle tuer la créativité — ou la sauver ?",
  subtitle: "Il y a trois ans, on nous promettait que l'IA allait éliminer des millions de métiers créatifs. Aujourd'hui, les designers, écrivains et musiciens les plus influents utilisent tous des outils génératifs. Ce n'est pas la mort de la créativité — c'est sa mutation profonde.",
  author: "Mathilde Aubert",
  authorRole: "Rédactrice en chef",
  readTime: "12 min",
  reads: "14 200",
};

const ARTICLES = [
  {
    issue: "046",
    date: "28 avr. 2025",
    tag: "Business",
    tagColor: "#1D4ED8",
    title: "Le retour du bureau : ce que les chiffres ne disent pas.",
    excerpt: "Les grandes entreprises imposent le retour en présentiel. Mais les données montrent que la productivité n'est pas là où on le croit.",
    author: "Théo Marchand",
    readTime: "8 min",
    reads: "11 800",
    premium: true,
  },
  {
    issue: "045",
    date: "21 avr. 2025",
    tag: "Société",
    tagColor: "#059669",
    title: "Quiet quitting 2025 : le mouvement s'est transformé en quelque chose de plus complexe.",
    excerpt: "Ce qu'on appelait démission silencieuse est devenu une philosophie de travail structurée, avec ses codes, ses influenceurs et ses manifestes.",
    author: "Léa Fontaine",
    readTime: "10 min",
    reads: "16 400",
    premium: false,
  },
  {
    issue: "044",
    date: "14 avr. 2025",
    tag: "Finance",
    tagColor: "#D97706",
    title: "Startup Winter : les levées de fonds européennes à la loupe.",
    excerpt: "Les chiffres Q1 2025 confirment le ralentissement. Qui finance encore, qui s'est arrêté, et pourquoi certains fondateurs s'en félicitent.",
    author: "Romain Lefèvre",
    readTime: "6 min",
    reads: "9 300",
    premium: true,
  },
  {
    issue: "043",
    date: "7 avr. 2025",
    tag: "Design",
    tagColor: "#DB2777",
    title: "La typographie comme prise de position politique.",
    excerpt: "Du New York Times à l'affiche de campagne — comment le choix d'une fonte encode des valeurs, une époque, un camp.",
    author: "Camille Renard",
    readTime: "7 min",
    reads: "7 900",
    premium: false,
  },
  {
    issue: "042",
    date: "31 mars 2025",
    tag: "Future du travail",
    tagColor: "#0891B2",
    title: "Les 4 jours, 2 ans après : bilan d'une révolution qui n'a pas eu lieu.",
    excerpt: "L'Islande avait montré la voie. La France a testé timidement. Pourquoi le passage aux 4 jours reste-t-il si difficile en pratique ?",
    author: "Théo Marchand",
    readTime: "9 min",
    reads: "13 100",
    premium: true,
  },
];

const AUTHORS = [
  {
    name: "Mathilde Aubert",
    role: "Rédactrice en chef",
    bio: "10 ans de journalisme tech. Ex-Wired France, Ex-Les Échos. Spécialiste IA et culture numérique.",
    articles: 112,
    initials: "MA",
    color: C.red,
  },
  {
    name: "Théo Marchand",
    role: "Économiste & Journaliste",
    bio: "Chercheur associé à Sciences Po Paris. Couvre les mutations du travail, l'économie comportementale.",
    articles: 78,
    initials: "TM",
    color: "#1D4ED8",
  },
  {
    name: "Léa Fontaine",
    role: "Correspondante Europe",
    bio: "Basée à Berlin. Sociologie des organisations et nouvelles formes de travail dans les pays nordiques.",
    articles: 64,
    initials: "LF",
    color: "#059669",
  },
  {
    name: "Camille Renard",
    role: "Critique design & media",
    bio: "Designer et critique. Contributrice régulière au MoMA et à la Design Week de Milan.",
    articles: 45,
    initials: "CR",
    color: "#DB2777",
  },
];

const TESTIMONIALS = [
  {
    quote: "Fréquence est la seule newsletter que j'ouvre en premier le lundi matin. Pas de superflu, des idées qui tiennent et qui transforment ma manière de penser le business.",
    name: "Alexandre M.",
    role: "Directeur Produit, Scale-up Paris",
    stars: 5,
  },
  {
    quote: "J'ai lu 3 articles et j'ai restructuré toute ma stratégie Q3. Ça mérite largement l'abonnement — c'est de la recherche condensée en format lisible.",
    name: "Cécile P.",
    role: "Founder, Studio indépendant",
    stars: 5,
  },
  {
    quote: "Enfin du contenu qui respecte l'intelligence du lecteur. Pas de listes de 10 conseils inutiles. Des analyses, des chiffres, des nuances.",
    name: "Romain L.",
    role: "VC Partner, Paris",
    stars: 5,
  },
  {
    quote: "Le podcast hebdo est ce que je préfère. 20 minutes d'analyse denses pendant mon trajet — j'arrive au bureau avec des idées.",
    name: "Sara K.",
    role: "Head of Strategy, Conseil",
    stars: 5,
  },
];

const PLANS = [
  {
    name: "Gratuit",
    price: "0 €",
    note: "pour toujours",
    features: [
      "1 article complet par semaine",
      "Archives des 3 derniers mois",
      "Newsletter résumée sans pub",
    ],
    cta: "Commencer gratuitement",
    highlight: false,
  },
  {
    name: "Lecteur",
    price: "9 €",
    note: "/mois · sans engagement",
    features: [
      "Accès illimité à tous les articles",
      "Archives complètes depuis 2019",
      "Newsletter intégrale sans pub",
      "Podcast hebdo 20 min inclus",
      "Sessions live Q&A mensuelles",
    ],
    cta: "S'abonner →",
    highlight: true,
  },
  {
    name: "Studio",
    price: "49 €",
    note: "/mois · équipe jusqu'à 10",
    features: [
      "Tout Lecteur × 10 comptes",
      "Rapports thématiques mensuels",
      "Accès sessions live Q&A",
      "Usage commercial des articles",
      "Facturation au nom de la société",
    ],
    cta: "Contacter l'équipe",
    highlight: false,
  },
];

const ARCHIVE_MONTHS = [
  { month: "Mai 2025", issues: 4, highlights: ["IA & Créativité", "Retour bureau", "Quiet quitting"] },
  { month: "Avril 2025", issues: 4, highlights: ["Startup Winter", "Typographie", "4 jours de travail"] },
  { month: "Mars 2025", issues: 4, highlights: ["Web3 bilan", "Médias indépendants", "Salaires réels"] },
  { month: "Février 2025", issues: 4, highlights: ["IA en entreprise", "Fusion-acquisition", "Burnout étude"] },
  { month: "Janvier 2025", issues: 4, highlights: ["Prédictions 2025", "Big tech régulation", "Remote work"] },
  { month: "Décembre 2024", issues: 3, highlights: ["Bilan 2024", "Tendances 2025", "Best-of articles"] },
];

const FAQS = [
  {
    q: "À quelle fréquence publiez-vous ?",
    a: "Chaque lundi — une grande analyse (2 000–3 000 mots) + 3 brèves commentées. Parfois un hors-série le jeudi sur un sujet brûlant.",
  },
  {
    q: "Puis-je annuler mon abonnement ?",
    a: "Oui, à tout moment depuis votre espace abonné. Pas de rétention abusive, pas d'email de culpabilisation.",
  },
  {
    q: "Acceptez-vous les articles invités ?",
    a: "Rarement. Nous publions des contributeurs de la communauté 2 fois par mois sur candidature ouverte. Rédacteurs académiques prioritaires.",
  },
  {
    q: "Avez-vous des publicités ?",
    a: "Un seul sponsor par numéro, clairement identifié et cohérent avec notre ligne éditoriale. Aucune donnée lecteur vendue. Jamais.",
  },
  {
    q: "Y a-t-il un podcast ?",
    a: "Oui — disponible pour les abonnés Lecteur. L'éditeur commente l'édition en 20 minutes denses chaque lundi dès 7h.",
  },
  {
    q: "Comment rejoindre la communauté Fréquence ?",
    a: "L'abonnement Lecteur donne accès à notre Discord privé (2 400 membres) et aux sessions mensuelles Q&A avec les auteurs.",
  },
];

const STATS = [
  { val: "15 200+", label: "Abonnés actifs" },
  { val: "89%", label: "Taux d'ouverture" },
  { val: "2019", label: "Depuis" },
  { val: "0", label: "Publicités intrusives" },
];

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ a, i }: { a: typeof ARTICLES[0]; i: number }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [hovering, setHovering] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      style={{
        borderBottom: `1px solid ${C.border}`,
        padding: "28px 0",
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "0 24px",
        alignItems: "start",
      }}
    >
      {/* Issue number */}
      <div
        style={{
          fontFamily: C.mono,
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: 2,
          paddingTop: 4,
          minWidth: 36,
        }}
      >
        #{a.issue}
      </div>

      {/* Content */}
      <div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: a.tagColor,
              fontFamily: C.mono,
              padding: "2px 8px",
              border: `1px solid ${a.tagColor}33`,
              background: `${a.tagColor}0D`,
            }}
          >
            {a.tag}
          </span>
          {a.premium && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: C.red,
                fontFamily: C.mono,
                textTransform: "uppercase",
              }}
            >
              Abonnés
            </span>
          )}
          <span
            style={{
              fontSize: 10,
              color: C.textMuted,
              fontFamily: C.mono,
              letterSpacing: 0.5,
            }}
          >
            {a.date}
          </span>
        </div>

        <motion.h3
          animate={{ color: hovering ? C.red : C.text }}
          transition={{ duration: 0.2 }}
          style={{
            fontFamily: C.serif,
            fontSize: 19,
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: -0.3,
            marginBottom: 10,
          }}
        >
          {a.title}
        </motion.h3>

        <p
          style={{
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.7,
            marginBottom: 12,
            maxWidth: 540,
            fontFamily: C.sans,
          }}
        >
          {a.excerpt}
        </p>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: C.textMuted, fontFamily: C.sans }}>
            Par {a.author}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} style={{ color: C.textMuted }} />
            <span style={{ fontSize: 11, color: C.textMuted, fontFamily: C.mono }}>{a.readTime}</span>
          </div>
          <span style={{ fontSize: 11, color: C.textMuted, fontFamily: C.mono }}>{a.reads} lectures</span>
        </div>
      </div>

      {/* Bookmark */}
      <button
        onClick={e => { e.stopPropagation(); setBookmarked(b => !b); }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          color: bookmarked ? C.red : C.textMuted,
          transition: "color 0.2s",
          paddingTop: 6,
        }}
      >
        <Bookmark size={16} fill={bookmarked ? C.red : "none"} />
      </button>
    </motion.article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ImpactFrequencePage() {
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
  if (brand) {
    C = { ...C, red: brand };
  }

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePlan, setActivePlan] = useState(1);
  const [archiveOpen, setArchiveOpen] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const pricingInView = useInView(pricingRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    
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
return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        fontFamily: C.sans,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        input::placeholder { color: #A0A0A0; }
      `}</style>

      {/* TOP BAR — newspaper date line */}
      <div
        style={{
          background: C.bgDark,
          padding: "9px 64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "none",
        }}
      >
        <span style={{ fontFamily: C.mono, fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>
          INDÉPENDANT · FONDÉ EN 2019 · PARIS
        </span>
        <span style={{ fontFamily: C.mono, fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>
          № 047 · Lundi 5 mai 2025 · +15 200 abonnés
        </span>
      </div>

      {/* NAV — newspaper masthead style */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: isScrolled ? "rgba(255,255,255,0.97)" : C.bg,
          backdropFilter: "blur(12px)",
          borderBottom: `2px solid ${C.text}`,
          padding: "0 64px",
          transition: "all 0.3s",
        }}
      >
        {/* Masthead */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <span
                style={{
                  fontFamily: C.serif,
                  fontSize: 30,
                  fontWeight: 900,
                  letterSpacing: -1,
                  color: C.red,
                  lineHeight: 1,
                }}
              >{fd?.businessName ?? "Fréquence"}</span>
            )}
          </motion.div>

          {/* Nav links — hidden on mobile */}
          <div className="freq-navlinks" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {["Archives", "Auteurs", "Podcast", "À propos"].map(l => (
              <a
                key={l}
                href={l === "Archives" ? "#archives" : l === "Auteurs" ? "#auteurs" : l === "À propos" ? "#apropos" : "#contact"}
                style={{
                  fontFamily: C.mono,
                  fontSize: 11,
                  letterSpacing: 2,
                  color: C.textMuted,
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = C.red)}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Search size={16} className="freq-search" style={{ color: C.textMuted, cursor: "pointer" }} />
            <User size={16} className="freq-user" style={{ color: C.textMuted, cursor: "pointer" }} />
            <motion.button
              whileHover={{ background: C.redDark }}
              whileTap={{ scale: 0.96 }}
              className="freq-subscribe"
              style={{
                padding: "9px 22px",
                background: C.red,
                color: "#fff",
                border: "none",
                fontFamily: C.mono,
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: 700,
                transition: "background 0.2s",
              }}
            >
              S'abonner
            </motion.button>
            {/* Hamburger — mobile only */}
            <button
              className="freq-burger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <span style={{ display: "block", width: 22, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
              <span style={{ display: "block", width: 22, height: 1.5, background: C.text, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 22, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Category nav strip */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 0,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(activeCategory === i ? null : i)}
              style={{
                padding: "10px 20px",
                background: activeCategory === i ? cat.color : "transparent",
                color: activeCategory === i ? "#fff" : C.textMuted,
                border: "none",
                borderRight: `1px solid ${C.border}`,
                fontFamily: C.mono,
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", top: 128, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `2px solid ${C.text}`, padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {[{ label: "Archives", href: "#archives" }, { label: "Auteurs", href: "#auteurs" }, { label: "Podcast", href: "#contact" }, { label: "À propos", href: "#apropos" }].map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMobileOpen(false)} style={{ fontFamily: C.mono, fontSize: 13, letterSpacing: 2, color: C.textMuted, textDecoration: "none", textTransform: "uppercase" }}>
              {label}
            </a>
          ))}
          <motion.button whileHover={{ background: C.redDark }} style={{ marginTop: 8, padding: "12px 22px", background: C.red, color: "#fff", border: "none", fontFamily: C.mono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontWeight: 700, width: "fit-content" }}>
            S'abonner
          </motion.button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .freq-navlinks { display: none !important; }
          .freq-search { display: none !important; }
          .freq-user { display: none !important; }
          .freq-subscribe { display: none !important; }
          .freq-burger { display: flex !important; }
        }
      `}</style>

      {/* HERO — featured article newspaper layout */}
      <section id="hero"
        ref={heroRef}
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          borderBottom: `2px solid ${C.text}`,
          minHeight: "80vh",
        }}
      >
        {/* Main story */}
        <motion.div
          style={{ y: heroParallax }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div
            style={{
              borderRight: `1px solid ${C.border}`,
              padding: "60px 64px 60px 64px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "80vh",
            }}
          >
            {/* Tag line */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 32 }}>
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: "#fff",
                  background: FEATURED_ARTICLE.tagColor,
                  padding: "4px 12px",
                  textTransform: "uppercase",
                }}
              >
                {FEATURED_ARTICLE.tag}
              </span>
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: 10,
                  color: C.textMuted,
                  letterSpacing: 2,
                }}
              >
                № {FEATURED_ARTICLE.issue} · {FEATURED_ARTICLE.date}
              </span>
            </div>

            {/* Headline */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                style={{
                  fontFamily: C.serif,
                  fontSize: "clamp(40px, 5vw, 72px)",
                  fontWeight: 900,
                  letterSpacing: -2,
                  lineHeight: 1.05,
                  color: C.text,
                  marginBottom: 28,
                }}
              >{c?.heroHeadline ?? <>
                {FEATURED_ARTICLE.title}
              </>}</motion.h1>

              {/* Body columns */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 32,
                  marginBottom: 40,
                }}
              >
                <p
                  style={{
                    fontFamily: C.serif,
                    fontSize: 17,
                    lineHeight: 1.85,
                    color: C.textMuted,
                    borderTop: `3px solid ${C.red}`,
                    paddingTop: 18,
                  }}
                >{c?.heroSubline ?? fd?.tagline ?? <>
                  {FEATURED_ARTICLE.subtitle.slice(0, 200)}
                </>}</p>
                <p
                  style={{
                    fontFamily: C.serif,
                    fontSize: 17,
                    lineHeight: 1.85,
                    color: C.textMuted,
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: 18,
                  }}
                >{c?.aboutText ?? <>
                  Une analyse exclusive de 400 créatifs professionnels révèle une fracture profonde — entre ceux qui se sont adaptés et ceux qui ont cessé de créer.
                </>}</p>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
                borderTop: `1px solid ${C.border}`,
                paddingTop: 24,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: C.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: C.serif,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                MA
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.sans }}>
                  {FEATURED_ARTICLE.author}
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: C.sans }}>
                  {FEATURED_ARTICLE.authorRole}
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginLeft: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={12} style={{ color: C.textMuted }} />
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.textMuted }}>
                    {FEATURED_ARTICLE.readTime}
                  </span>
                </div>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.textMuted }}>
                  {FEATURED_ARTICLE.reads} lectures
                </span>
                <motion.button
                  whileHover={{ background: C.red, color: "#fff", borderColor: C.red }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "10px 24px",
                    background: "transparent",
                    color: C.red,
                    border: `1px solid ${C.red}`,
                    fontFamily: C.mono,
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Lire l'article <ArrowRight size={12} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right sidebar — quick reads */}
        <div style={{ padding: "60px 40px" }}>
          <div
            style={{
              fontFamily: C.mono,
              fontSize: 10,
              letterSpacing: 3,
              color: C.textMuted,
              textTransform: "uppercase",
              marginBottom: 24,
              borderBottom: `1px solid ${C.border}`,
              paddingBottom: 12,
            }}
          >
            Dans ce numéro
          </div>

          {["Le coût caché du retour en présentiel", "3 outils IA pour les créatifs (que vous n'utilisez pas encore)", "Chiffre de la semaine : 67% des fondateurs regrettent leur A-round"].map(
            (item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.12 }}
                style={{
                  padding: "18px 0",
                  borderBottom: `1px solid ${C.border}`,
                  cursor: "pointer",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 11,
                    color: C.red,
                    fontWeight: 700,
                    minWidth: 20,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: C.serif, fontSize: 15, lineHeight: 1.5, color: C.text }}>
                  {item}
                </span>
              </motion.div>
            )
          )}

          {/* Podcast promo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              marginTop: 32,
              background: C.bgDark,
              padding: "24px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: C.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play size={14} fill="#fff" stroke="none" />
              </div>
              <div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>
                  Podcast · Épisode 047
                </div>
                <div style={{ fontFamily: C.sans, fontSize: 13, color: "#fff", fontWeight: 600, marginTop: 2 }}>
                  L'IA & la créativité — 22 min
                </div>
              </div>
            </div>
            <p style={{ fontFamily: C.mono, fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              Abonnés Lecteur uniquement
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section
        ref={statsRef}
        style={{ background: C.red, borderBottom: `2px solid ${C.text}` }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: "28px 40px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.2)" : undefined,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: C.serif,
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: -1,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontFamily: C.mono,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.65)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ARTICLES LIST */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 320px", borderBottom: `2px solid ${C.text}` }}>
        {/* Main articles */}
        <div style={{ borderRight: `1px solid ${C.border}`, padding: "60px 64px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                fontFamily: C.serif,
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: -0.5,
                color: C.text,
              }}
            >
              Dernières éditions
            </h2>
            <a
              href="#contact"
              style={{
                fontFamily: C.mono,
                fontSize: 10,
                letterSpacing: 3,
                color: C.red,
                textDecoration: "none",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Archives complètes <ArrowRight size={12} />
            </a>
          </div>

          {ARTICLES.map((a, i) => (
            <ArticleCard key={a.issue} a={a} i={i} />
          ))}
        </div>

        {/* Sidebar — categories + authors + newsletter */}
        <div style={{ padding: "60px 32px", position: "sticky", top: 120, alignSelf: "start" }}>
          {/* Categories */}
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                fontFamily: C.mono,
                fontSize: 10,
                letterSpacing: 3,
                color: C.textMuted,
                textTransform: "uppercase",
                marginBottom: 16,
                borderBottom: `2px solid ${C.text}`,
                paddingBottom: 10,
              }}
            >
              Rubriques
            </div>
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: `1px solid ${C.border}`,
                  cursor: "pointer",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = cat.color + "08")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      background: cat.color,
                    }}
                  />
                  <span style={{ fontFamily: C.sans, fontSize: 13, color: C.text, fontWeight: 500 }}>
                    {cat.name}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 11,
                    color: C.textMuted,
                  }}
                >
                  {cat.count}
                </span>
              </div>
            ))}
          </div>

          {/* Mini newsletter signup */}
          <div
            style={{
              background: C.bgDark,
              padding: "24px",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontFamily: C.serif,
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Chaque lundi.
            </div>
            <p
              style={{
                fontFamily: C.mono,
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              L'analyse qui transforme votre vision du monde en 10 minutes.
            </p>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              type="email"
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                fontFamily: C.mono,
                fontSize: 12,
                outline: "none",
                marginBottom: 10,
                letterSpacing: 0.5,
              }}
            />
            <motion.button
              onClick={() => { if (email) setSubscribed(true); }}
              whileHover={{ background: "#fff", color: C.red }}
              whileTap={{ scale: 0.96 }}
              style={{
                width: "100%",
                padding: "12px",
                background: C.red,
                color: "#fff",
                border: "none",
                fontFamily: C.mono,
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: 700,
              }}
            >
              {subscribed ? "✓ Bienvenue !" : "Accès gratuit →"}
            </motion.button>
          </div>
        </div>
      </section>

      {/* AUTHORS */}
      <section id="auteurs" style={{ padding: "80px 64px", borderBottom: `2px solid ${C.text}` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
          }}
        >
          <h2
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 900,
              letterSpacing: -1,
              color: C.text,
            }}
          >
            Notre équipe
          </h2>
          <span style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase" }}>
            4 rédacteurs permanents
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {AUTHORS.map((author, i) => (
            <motion.div
              key={author.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: `0 8px 32px rgba(0,0,0,0.08)` }}
              style={{
                border: `1px solid ${C.border}`,
                padding: "36px 28px",
                background: C.bg,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: author.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: C.serif,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 20,
                }}
              >
                {author.initials}
              </div>
              <div
                style={{
                  fontFamily: C.serif,
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 4,
                  letterSpacing: -0.3,
                }}
              >
                {author.name}
              </div>
              <div
                style={{
                  fontFamily: C.mono,
                  fontSize: 10,
                  color: author.color,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {author.role}
              </div>
              <p
                style={{
                  fontFamily: C.sans,
                  fontSize: 13,
                  color: C.textMuted,
                  lineHeight: 1.65,
                  marginBottom: 16,
                }}
              >
                {author.bio}
              </p>
              <div style={{ fontFamily: C.mono, fontSize: 11, color: C.textMuted }}>
                {author.articles} articles
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="apropos" style={{ background: C.bgAlt, padding: "80px 64px", borderBottom: `2px solid ${C.text}` }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 900,
              letterSpacing: -1,
              color: C.text,
              marginBottom: 12,
            }}
          >
            Ce que nos lecteurs disent.
          </h2>
          <p style={{ fontFamily: C.sans, fontSize: 15, color: C.textMuted }}>
            +15 200 abonnés actifs · 89% de taux d'ouverture
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                padding: "28px 24px",
              }}
            >
              <div
                style={{
                  fontFamily: C.serif,
                  fontSize: 40,
                  color: C.red,
                  lineHeight: 0.8,
                  marginBottom: 16,
                  fontWeight: 900,
                }}
              >
                "
              </div>
              <p
                style={{
                  fontFamily: C.serif,
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: C.text,
                  marginBottom: 20,
                }}
              >
                {t.quote}
              </p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                <div
                  style={{
                    fontFamily: C.sans,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 2,
                  }}
                >
                  {t.name}
                </div>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, letterSpacing: 0.5 }}>
                  {t.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section ref={pricingRef} style={{ borderBottom: `2px solid ${C.text}` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "60px 64px 48px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: C.mono,
                fontSize: 10,
                letterSpacing: 3,
                color: C.textMuted,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Simple et transparent
            </div>
            <h2
              style={{
                fontFamily: C.serif,
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 900,
                letterSpacing: -1,
                color: C.text,
              }}
            >
              Abonnements
            </h2>
          </div>
          <div
            style={{
              fontFamily: C.mono,
              fontSize: 11,
              color: C.textMuted,
              letterSpacing: 1,
            }}
          >
            Aucun engagement · Résiliation en 1 clic
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `1px solid ${C.border}` }}>
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              onClick={() => setActivePlan(i)}
              style={{
                borderRight: i < 2 ? `1px solid ${C.border}` : undefined,
                padding: "52px 48px",
                background: p.highlight ? C.bgDark : C.bg,
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              {p.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: C.red,
                  }}
                />
              )}
              <div
                style={{
                  fontFamily: C.mono,
                  fontSize: 10,
                  letterSpacing: 4,
                  color: p.highlight ? C.red : C.textMuted,
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontFamily: C.serif,
                  fontSize: 52,
                  fontWeight: 900,
                  letterSpacing: -2,
                  color: p.highlight ? "#fff" : C.text,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {p.price}
              </div>
              <div
                style={{
                  fontFamily: C.mono,
                  fontSize: 11,
                  color: p.highlight ? "rgba(255,255,255,0.4)" : C.textMuted,
                  marginBottom: 36,
                }}
              >
                {p.note}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <ArrowRight
                      size={13}
                      style={{
                        color: p.highlight ? C.red : C.textMuted,
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: C.mono,
                        fontSize: 12,
                        color: p.highlight ? "rgba(255,255,255,0.75)" : C.textMuted,
                        lineHeight: 1.5,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{
                  background: p.highlight ? C.red : C.bgDark,
                  color: "#fff",
                  borderColor: p.highlight ? C.red : C.bgDark,
                }}
                whileTap={{ scale: 0.96 }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "transparent",
                  color: p.highlight ? C.red : C.textMuted,
                  border: `1px solid ${p.highlight ? C.red : C.border}`,
                  fontFamily: C.mono,
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontWeight: 700,
                }}
              >
                {p.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ARCHIVE */}
      <section id="archives" style={{ padding: "80px 64px", borderBottom: `2px solid ${C.text}` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 40,
          }}
        >
          <h2
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 900,
              letterSpacing: -0.5,
              color: C.text,
            }}
          >
            Archives par mois
          </h2>
          <span style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, letterSpacing: 2 }}>
            {ARCHIVE_MONTHS.reduce((a, m) => a + m.issues, 0)} numéros depuis 2019
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {ARCHIVE_MONTHS.map((month, i) => (
            <div key={month.month}>
              <motion.button
                onClick={() => setArchiveOpen(archiveOpen === i ? null : i)}
                whileHover={{ background: C.red + "08" }}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 24px",
                  background: archiveOpen === i ? C.bgAlt : C.bg,
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                  fontFamily: C.sans,
                }}
              >
                <div>
                  <div style={{ fontFamily: C.serif, fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 2 }}>
                    {month.month}
                  </div>
                  <div style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, letterSpacing: 1 }}>
                    {month.issues} numéros
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: archiveOpen === i ? 45 : 0 }}
                  style={{ fontSize: 20, color: C.red, display: "block" }}
                >
                  +
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {archiveOpen === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden", border: `1px solid ${C.border}`, borderTop: "none" }}
                  >
                    <div style={{ padding: "16px 24px", background: C.bgAlt }}>
                      {month.highlights.map(h => (
                        <div
                          key={h}
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            padding: "8px 0",
                            borderBottom: `1px solid ${C.border}`,
                            cursor: "pointer",
                            fontFamily: C.sans,
                            fontSize: 13,
                            color: C.text,
                          }}
                        >
                          <ArrowRight size={12} style={{ color: C.red, flexShrink: 0 }} />
                          {h}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "80px 64px", borderBottom: `2px solid ${C.text}` }}>
        <h2
          style={{
            fontFamily: C.serif,
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 900,
            letterSpacing: -1,
            color: C.text,
            marginBottom: 48,
          }}
        >
          Questions fréquentes
        </h2>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "22px 0",
                background: "none",
                border: "none",
                color: C.text,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: C.sans,
              }}
            >
              <span style={{ fontFamily: C.serif, fontSize: 17, fontWeight: 700 }}>{f.q}</span>
              <motion.span
                animate={{ rotate: openFaq === i ? 45 : 0 }}
                style={{ fontSize: 22, color: C.red, minWidth: 22, display: "block" }}
              >
                +
              </motion.span>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    style={{
                      paddingBottom: 22,
                      fontFamily: C.mono,
                      fontSize: 13,
                      color: C.textMuted,
                      lineHeight: 1.85,
                    }}
                  >
                    {f.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* BIG NEWSLETTER CTA */}
      <section id="contact"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderBottom: `2px solid ${C.text}`,
        }}
      >
        <div
          style={{
            background: C.red,
            padding: "80px 64px",
            borderRight: `2px solid ${C.text}`,
          }}
        >
          <div
            style={{
              fontFamily: C.mono,
              fontSize: 10,
              letterSpacing: 4,
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Pour aller plus loin
          </div>
          <h2
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 24,
            }}
          >
            Lisez tout.<br />Pensez mieux.
          </h2>
          <p style={{ fontFamily: C.sans, fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
            9 €/mois. Archives complètes depuis 2019. Podcast inclus. Sans publicité. Sans algorithme.
          </p>
        </div>

        <div
          style={{
            padding: "80px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
            background: C.bgDark,
          }}
        >
          <div
            style={{
              fontFamily: C.mono,
              fontSize: 11,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Commencer gratuitement
          </div>
          <input
            placeholder="votre@email.fr"
            type="email"
            style={{
              padding: "16px 20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              fontFamily: C.mono,
              fontSize: 13,
              outline: "none",
              letterSpacing: 0.5,
            }}
          />
          <motion.button
            whileHover={{ background: "#fff", color: C.red }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "16px",
              background: C.red,
              color: "#fff",
              border: "none",
              fontFamily: C.mono,
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 700,
            }}
          >
            Accès gratuit →
          </motion.button>
          <div style={{ fontFamily: C.mono, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
            +15 200 abonnés · Aucun spam · Désabonnement en 1 clic
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: C.bgDark,
          padding: "48px 64px 28px",
          borderTop: `2px solid ${C.text}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 40,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: C.serif,
                fontSize: 28,
                fontWeight: 900,
                color: C.red,
                marginBottom: 16,
                letterSpacing: -0.5,
              }}
            >{fd?.businessName ?? "Fréquence"}</div>
            <p
              style={{
                fontFamily: C.sans,
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.7,
                maxWidth: 240,
                marginBottom: 20,
              }}
            >
              Publication indépendante hebdomadaire. Analyses de fond sur business, tech et société. Fondée en 2019.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[Camera, MessageSquare, Link2].map((Icon, i) => (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.red; (e.currentTarget as HTMLElement).style.color = C.red; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}
                >
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>
          {[
            { title: "Publication", links: ["Archives", "Rubriques", "Podcast", "Hors-séries"] },
            { title: "Abonnés", links: ["Connexion", "Gérer abonnement", "Newsletter", "Discord"] },
            { title: "À propos", links: ["Notre équipe", "Manifeste", "Publicité", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: C.mono,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              {col.links.map(l => (
                <div
                  key={l}
                  style={{
                    fontFamily: C.sans,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: 10,
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
                >
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: C.mono,
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: 1,
          }}
        >
          <span>© 2025 Fréquence · HEBDOMADAIRE · INDÉPENDANT · DEPUIS 2019</span>
          <span>Confidentialité · Mentions légales · CGU</span>
        </div>
      </footer>
    </div>
  );
}
