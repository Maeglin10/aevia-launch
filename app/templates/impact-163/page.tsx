"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search, Menu, X, Clock, BookOpen, TrendingUp, Users, Star, Check, Rss, MessageSquare, Camera, Link2, ChevronRight, Calendar } from "lucide-react";

const C = {
  bg: "#FAFAFA",
  bgAlt: "#F2F0EB",
  bgDark: "#111111",
  text: "#111111",
  textMuted: "#6B6B6B",
  accent: "#E63946",
  accentLight: "rgba(230,57,70,0.08)",
  border: "#E2DFD9",
  white: "#FFFFFF",
  gold: "#C9A84C",
  serif: "'Playfair Display', 'Georgia', serif",
  sans: "system-ui, -apple-system, sans-serif",
};

const FEATURED_ARTICLE = {
  cat: "STRATÉGIE",
  catColor: C.accent,
  title: "Pourquoi 94 % des startups B2B ratent leur go-to-market — et comment faire partie des 6 %",
  excerpt: "Analyse de 340 startups européennes sur 5 ans : les patterns qui séparent les gagnants des outsiders, les erreurs fatales commises avant même le premier client, et le playbook que personne ne vous montre.",
  author: "Marc Delacroix",
  authorRole: "Ex-VP Growth, Spendr · 18 min de lecture",
  date: "8 mai 2026",
  readTime: "18 min",
  img: "photo-1460925895917-afdab827c52f",
};

const ARTICLES = [
  {
    cat: "PRODUCT",
    title: "Le product-led growth est mort. Vive le product-led sales.",
    excerpt: "Les SaaS qui ont explosé leurs revenus en 2025 n'ont pas misé sur le PLG pur. Voici ce qu'ils ont fait à la place.",
    author: "Sophie Chen",
    readTime: "8 min",
    date: "5 mai 2026",
    img: "photo-1551288049-bebda4e38f71",
  },
  {
    cat: "MARKETING",
    title: "SEO en 2026 : les 5 signaux qui comptent vraiment",
    excerpt: "Google a changé 4 fois son algorithme en 18 mois. Voici ce qui reste stable et ce que vous pouvez ignorer sans regret.",
    author: "Thomas Müller",
    readTime: "11 min",
    date: "2 mai 2026",
    img: "photo-1432888622747-4eb9a8efeb07",
  },
  {
    cat: "FINANCEMENT",
    title: "Lever 2 M€ en pre-seed sans VC : le playbook d'une fondatrice",
    excerpt: "Louise Aubert a bootstrappé puis levé sans dilution excessive. Elle partage tout — chiffres, emails de refus, et ce qui a finalement convaincu.",
    author: "Camille Aubert",
    readTime: "15 min",
    date: "28 avr. 2026",
    img: "photo-1507679799987-c73779587ccf",
  },
  {
    cat: "IA & TECH",
    title: "RAG vs Fine-tuning : guide décisionnel pour équipes produit",
    excerpt: "Vous n'êtes pas chercheur. Vous avez un produit à livrer. Ce guide coupe le superflu et vous dit quoi choisir selon votre cas.",
    author: "Kevin Park",
    readTime: "9 min",
    date: "24 avr. 2026",
    img: "photo-1677442135703-1787eea5ce01",
  },
  {
    cat: "CULTURE",
    title: "Remote-first à 80 personnes : les rituels qui ont sauvé notre équipe",
    excerpt: "Après 3 ans en full remote, voici les pratiques qui ont survécu et celles qu'on a abandonnées. Avec les données d'engagement à l'appui.",
    author: "Julie Fontaine",
    readTime: "7 min",
    date: "21 avr. 2026",
    img: "photo-1522071820081-009f0129c71c",
  },
  {
    cat: "VENTES",
    title: "Cold outreach en 2026 : les séquences à 40 % de reply rate",
    excerpt: "Notre équipe a testé 68 variantes sur 6 mois. Voici les 3 formats qui surpassent tout le reste et pourquoi ils fonctionnent neurologiquement.",
    author: "Antoine Lebrun",
    readTime: "10 min",
    date: "18 avr. 2026",
    img: "photo-1563013544-824ae1b704d3",
  },
];

const CATEGORIES = [
  { name: "Stratégie", count: 48 },
  { name: "Product", count: 61 },
  { name: "Marketing", count: 74 },
  { name: "IA & Tech", count: 39 },
  { name: "Financement", count: 27 },
  { name: "Culture", count: 33 },
  { name: "Ventes", count: 55 },
];

const STATS = [
  { val: "52 000", suffix: "+", label: "Lecteurs actifs chaque semaine" },
  { val: "2×", suffix: "", label: "Articles publiés par semaine" },
  { val: "380", suffix: "+", label: "Articles en archive" },
  { val: "4.9", suffix: "/5", label: "Note lecteurs (App + Web)" },
];

const AUTHORS = [
  {
    name: "Marc Delacroix",
    role: "Ex-VP Growth, Spendr",
    topics: "Stratégie · Go-to-Market",
    articles: 42,
    initials: "MD",
    color: "#E63946",
  },
  {
    name: "Sophie Chen",
    role: "Head of Product, NordX",
    topics: "Product · UX Research",
    articles: 38,
    initials: "SC",
    color: "#7C3AED",
  },
  {
    name: "Thomas Müller",
    role: "CMO, DataFlux",
    topics: "Marketing · SEO · Ads",
    articles: 51,
    initials: "TM",
    color: "#059669",
  },
  {
    name: "Camille Aubert",
    role: "Fondatrice, Crisalide",
    topics: "Financement · Fundraising",
    articles: 29,
    initials: "CA",
    color: "#D97706",
  },
];

const TESTIMONIALS = [
  {
    name: "Claire Dupont",
    role: "CMO, Spendr",
    rating: 5,
    text: "La seule newsletter que j'ouvre toujours en premier. L'article sur le PLG m'a fait repenser toute notre stratégie produit du jour au lendemain.",
    avatar: "CD",
  },
  {
    name: "Alexandre Martin",
    role: "Fondateur, NordX",
    rating: 5,
    text: "Le niveau d'analyse est incomparable. Pas de superflu, pas de checklists vides — juste des insights actionnables avec des vraies données.",
    avatar: "AM",
  },
  {
    name: "Sophie Renard",
    role: "Partner, Accel Paris",
    rating: 5,
    text: "Je partage les articles à tous mes portfolios. Qualité proche de HBR mais avec une praticité que HBR n'a pas.",
    avatar: "SR",
  },
  {
    name: "Thomas Girard",
    role: "CEO, Growthly",
    rating: 5,
    text: "J'ai recruté 3 membres de mon équipe grâce aux offres dans la newsletter. La communauté est exactement le réseau dont j'avais besoin.",
    avatar: "TG",
  },
  {
    name: "Marie Chen",
    role: "Head of Growth, Aevia",
    rating: 5,
    text: "La série 'Go-to-market réel' est la meilleure ressource que j'ai trouvée. Des cas pratiques avec de vrais chiffres — du jamais vu.",
    avatar: "MC",
  },
  {
    name: "Julien Brard",
    role: "CTO, Scalar",
    rating: 5,
    text: "Je lis peu de médias business. L'Essentiel est l'exception. Chaque article m'apprend quelque chose que je n'aurais pas trouvé ailleurs.",
    avatar: "JB",
  },
];

const PLANS = [
  {
    name: "Gratuit",
    price: "0",
    desc: "Pour découvrir",
    features: [
      "2 articles complets / semaine",
      "Newsletter hebdo résumé",
      "Archive 30 derniers jours",
      "App mobile iOS & Android",
    ],
    cta: "Commencer gratuitement",
    featured: false,
  },
  {
    name: "Pro",
    price: "12",
    desc: "Pour les pros sérieux",
    features: [
      "Accès illimité 380+ articles",
      "Newsletter premium 2×/semaine",
      "Synthèses audio 10-15 min",
      "Accès Slack privé (2 800 membres)",
      "Replays des événements live",
      "Téléchargement PDF & ePub",
      "Fiches de synthèse actionnables",
    ],
    cta: "S'abonner Pro",
    featured: true,
  },
  {
    name: "Équipe",
    price: "39",
    desc: "Pour toute votre équipe",
    features: [
      "Tout Pro inclus",
      "Jusqu'à 10 sièges inclus",
      "Tableau de bord lecture équipe",
      "Annotations & articles partagés",
      "Onboarding dédié",
      "Facturation entreprise & TVA",
    ],
    cta: "Essai équipe 14 jours",
    featured: false,
  },
];

const FAQS = [
  {
    q: "À quelle fréquence publiez-vous ?",
    a: "Deux articles longs formats par semaine (mardi et jeudi), plus une synthèse de curation le vendredi. Les abonnés Pro reçoivent une newsletter premium le dimanche avec analyses exclusives et fiches actionnables.",
  },
  {
    q: "Qui écrit les articles ?",
    a: "Notre équipe de 8 rédacteurs spécialisés, tous anciens opérationnels — ex-fondateurs, VP Product, CMO. Chaque article est édité par notre rédacteur en chef et fact-checké par un expert externe.",
  },
  {
    q: "Puis-je accéder aux anciens articles ?",
    a: "Les abonnés gratuits ont accès aux 30 derniers jours. Les abonnés Pro ont accès à l'intégralité de l'archive depuis 2019 — 380+ articles classés par thème et niveau de séniorité.",
  },
  {
    q: "Y a-t-il une version audio ?",
    a: "Oui, les abonnés Pro bénéficient de synthèses audio de 10-15 minutes pour chaque article long format, disponibles dès la publication. Parfait pour écouter en transports ou en sport.",
  },
  {
    q: "Comment fonctionne la communauté Slack ?",
    a: "Les abonnés Pro rejoignent un Slack privé de 2 800 professionnels. Des fils thématiques, des AMA réguliers avec des experts invités et des offres emploi exclusives partagées avant tout autre canal.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, annulation possible à tout moment depuis votre espace abonné. Aucun engagement, aucun frais de résiliation. Vous conservez l'accès jusqu'à la fin de votre période payée.",
  },
];

const ARCHIVE_MONTHS = [
  { month: "Mai 2026", count: 8 },
  { month: "Avril 2026", count: 9 },
  { month: "Mars 2026", count: 8 },
  { month: "Février 2026", count: 8 },
  { month: "Janvier 2026", count: 9 },
  { month: "Décembre 2025", count: 7 },
];

function CountUp({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count.toLocaleString("fr-FR")}</span>;
}

function Reveal({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const initial = direction === "up" ? { opacity: 0, y: 28 } : direction === "left" ? { opacity: 0, x: -28 } : { opacity: 0, x: 28 };
  return (
    <motion.div ref={ref} initial={initial} animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function EssentialBlogPage() {
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollY } = useScroll();

  const heroTitleX = useTransform(scrollY, [0, 600], ["0%", "-6%"]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.06]);

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    
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
return () => clearInterval(t);
  }, []);

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: C.sans, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.accentLight}; color: ${C.accent}; }
      `}</style>

      {/* READING PROGRESS BAR */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: 3, background: C.accent, width: progressWidth, zIndex: 200, transformOrigin: "left" }} />

      {/* NAVIGATION */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: C.bgDark, borderBottom: "none",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", height: 58 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: 48 }}>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div style={{ width: 28, height: 28, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={14} color="#fff" />
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.bg, fontFamily: C.serif, fontStyle: "italic", letterSpacing: "0.02em" }}>{fd?.businessName ?? "L'Essentiel"}</span>
              </>
            )}
          </div>

          {/* Categories nav */}
          <div style={{ display: "flex", gap: 28, flex: 1, alignItems: "center" }}>
            {CATEGORIES.slice(0, 5).map(cat => (
              <motion.button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                whileHover={{ color: C.accent }}
                style={{
                  background: "none", border: "none",
                  fontSize: 11, color: activeCategory === cat.name ? C.accent : "rgba(250,250,250,0.45)",
                  fontFamily: C.sans, fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s",
                }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <motion.button
              onClick={() => setSearchOpen(true)}
              whileHover={{ color: C.bg }}
              style={{ background: "none", border: "none", color: "rgba(250,250,250,0.5)", cursor: "pointer", padding: 6 }}
            >
              <Search size={17} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                padding: "8px 20px", background: C.accent, color: C.white,
                border: "none", fontSize: 11, fontFamily: C.sans, fontWeight: 800,
                letterSpacing: "0.08em", cursor: "pointer",
              }}
            >
              S'ABONNER
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 300,
              background: "rgba(17,17,17,0.95)", display: "flex", alignItems: "flex-start",
              justifyContent: "center", paddingTop: 140,
            }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 700, padding: "0 40px" }}
            >
              <div style={{ position: "relative" }}>
                <Search size={20} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: "rgba(250,250,250,0.3)" }} />
                <input
                  autoFocus
                  placeholder="Rechercher un article, un auteur, un sujet..."
                  style={{
                    width: "100%", padding: "20px 20px 20px 56px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#FAFAFA", fontSize: 18, fontFamily: C.sans, outline: "none",
                  }}
                />
              </div>
              <button onClick={() => setSearchOpen(false)}
                style={{ position: "fixed", top: 32, right: 40, background: "none", border: "none", color: "rgba(250,250,250,0.4)", cursor: "pointer" }}>
                <X size={24} />
              </button>
              <div style={{ marginTop: 24, fontSize: 12, color: "rgba(250,250,250,0.25)", fontFamily: C.sans, letterSpacing: "0.06em" }}>
                TENDANCES : Product-led growth · SEO 2026 · Lever des fonds · Remote work
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO — NEWSPAPER STYLE */}
      <section id="hero" style={{ paddingTop: 58, background: C.bgDark, overflow: "hidden" }}>
        {/* Scrolling marquee headline */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", paddingBottom: 0 }}>
          <motion.div style={{ x: heroTitleX, display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{
              fontSize: "clamp(72px, 11vw, 150px)", fontWeight: 900, lineHeight: 0.88,
              letterSpacing: "-0.04em", color: "rgba(255,255,255,0.05)",
              padding: "32px 48px 24px", fontFamily: C.sans,
              whiteSpace: "nowrap",
            }}>
              STRATÉGIE · PRODUCT · GROWTH · MARKETING · IA · FINANCEMENT · CULTURE · VENTES ·
            </div>
          </motion.div>
        </div>

        {/* Featured story */}
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, alignItems: "stretch", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 56 }}>
            {/* Left: article content */}
            <div style={{ paddingTop: 48 }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                  <div style={{ padding: "4px 12px", background: C.accent, fontSize: 10, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.12em", color: C.white }}>
                    {FEATURED_ARTICLE.cat}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(250,250,250,0.3)", fontFamily: C.sans, letterSpacing: "0.06em" }}>
                    À LA UNE
                  </div>
                </div>
                <h1 style={{
                  fontFamily: C.serif, fontSize: "clamp(30px, 3.5vw, 52px)",
                  fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em",
                  color: C.bg, marginBottom: 24,
                }}>{c?.heroHeadline ?? <>
                  {FEATURED_ARTICLE.title}
                </>}</h1>
                <p style={{ fontSize: 16, color: "rgba(250,250,250,0.55)", fontFamily: C.sans, lineHeight: 1.75, marginBottom: 32, maxWidth: 580 }}>{c?.heroSubline ?? fd?.tagline ?? <>
                  {FEATURED_ARTICLE.excerpt}
                </>}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 36, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.white }}>MD</div>
                    <span style={{ fontSize: 13, color: "rgba(250,250,250,0.5)", fontFamily: C.sans }}>{FEATURED_ARTICLE.author}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(250,250,250,0.3)", fontFamily: C.sans }}>
                    <Calendar size={12} />{FEATURED_ARTICLE.date}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(250,250,250,0.3)", fontFamily: C.sans }}>
                    <Clock size={12} />{FEATURED_ARTICLE.readTime} de lecture
                  </div>
                </div>
                <motion.button
                  whileHover={{ gap: 16, paddingRight: 32 }} whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    padding: "14px 28px", background: C.accent, color: C.white,
                    border: "none", fontSize: 12, fontFamily: C.sans, fontWeight: 800,
                    letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.3s",
                  }}
                >
                  LIRE L'ARTICLE <ArrowRight size={15} />
                </motion.button>
              </motion.div>
            </div>

            {/* Right: secondary articles sidebar */}
            <div style={{ paddingTop: 48, borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 64 }}>
              <div style={{ fontSize: 10, fontFamily: C.sans, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(250,250,250,0.3)", marginBottom: 24, textTransform: "uppercase" }}>
                Également cette semaine
              </div>
              {ARTICLES.slice(0, 3).map((a, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  style={{
                    paddingBottom: 20, marginBottom: 20,
                    borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "inline-block", padding: "2px 8px", background: "rgba(255,255,255,0.06)", fontSize: 9, fontFamily: C.sans, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(250,250,250,0.4)", marginBottom: 8 }}>
                    {a.cat}
                  </div>
                  <div style={{ fontFamily: C.serif, fontSize: 15, fontWeight: 600, color: "rgba(250,250,250,0.85)", lineHeight: 1.35, marginBottom: 6 }}>
                    {a.title}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(250,250,250,0.3)", fontFamily: C.sans }}>
                    {a.author} · {a.readTime}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: C.accent, padding: "28px 48px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 48, justifyContent: "center", alignItems: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.white, fontFamily: C.sans, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {s.val}<span style={{ fontSize: 18 }}>{s.suffix}</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.05em", marginTop: 4, maxWidth: 160 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.4}>
            <motion.button
              whileHover={{ background: C.bgDark }} whileTap={{ scale: 0.97 }}
              style={{
                padding: "12px 28px", background: C.white, color: C.accent,
                border: "none", fontSize: 12, fontFamily: C.sans, fontWeight: 800,
                letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s",
              }}
            >
              REJOINDRE 52 000 LECTEURS
            </motion.button>
          </Reveal>
        </div>
      </section>

      {/* MAIN CONTENT — 2 column layout with sidebar */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "72px 48px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 72 }}>
        {/* Articles grid */}
        <div>
          {/* Section header with category filter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, borderBottom: `3px solid ${C.bgDark}`, paddingBottom: 12 }}>
            <Reveal>
              <h2 style={{ fontFamily: C.serif, fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Derniers articles
              </h2>
            </Reveal>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Tous", ...CATEGORIES.slice(0, 4).map(c => c.name)].map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.04 }}
                  style={{
                    padding: "5px 12px", fontSize: 11, fontFamily: C.sans, fontWeight: 600,
                    letterSpacing: "0.06em", cursor: "pointer",
                    background: activeCategory === cat ? C.bgDark : "transparent",
                    color: activeCategory === cat ? C.white : C.textMuted,
                    border: `1px solid ${activeCategory === cat ? C.bgDark : C.border}`,
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Featured large card */}
          <Reveal>
            <motion.div
              whileHover={{ y: -4 }}
              onHoverStart={() => setHoveredArticle(-1)}
              onHoverEnd={() => setHoveredArticle(null)}
              style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
                marginBottom: 2, cursor: "pointer",
                border: `1px solid ${C.border}`,
                background: hoveredArticle === -1 ? "rgba(17,17,17,0.02)" : C.white,
                transition: "all 0.2s",
              }}
            >
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#E5E1D9" }}>
                <motion.div
                  animate={{ scale: hoveredArticle === -1 ? 1.05 : 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ position: "absolute", inset: 0, backgroundImage: `url(https://images.unsplash.com/${ARTICLES[0].img}?w=600&q=80)`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
              </div>
              <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ padding: "3px 10px", background: C.accentLight, color: C.accent, fontSize: 10, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.1em" }}>
                      {ARTICLES[0].cat}
                    </div>
                  </div>
                  <h3 style={{ fontFamily: C.serif, fontSize: 22, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 12, color: C.text }}>
                    {ARTICLES[0].title}
                  </h3>
                  <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.75 }}>{ARTICLES[0].excerpt}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
                  <div style={{ fontSize: 12, color: C.textMuted, fontFamily: C.sans }}>
                    {ARTICLES[0].author} · {ARTICLES[0].readTime}
                  </div>
                  <motion.div whileHover={{ x: 4 }} style={{ color: C.accent }}>
                    <ArrowRight size={18} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* Grid of smaller articles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 2 }}>
            {ARTICLES.slice(1).map((article, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}
                  onHoverStart={() => setHoveredArticle(i)}
                  onHoverEnd={() => setHoveredArticle(null)}
                  style={{
                    padding: "28px 24px", background: C.white,
                    border: `1px solid ${C.border}`, cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ padding: "2px 8px", background: C.bgDark, color: C.white, fontSize: 9, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.1em" }}>
                      {article.cat}
                    </div>
                    <span style={{ fontSize: 11, color: C.textMuted }}><Clock size={10} style={{ display: "inline", marginRight: 3 }} />{article.readTime}</span>
                  </div>
                  <h3 style={{ fontFamily: C.serif, fontSize: 16, fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.01em", marginBottom: 10, color: C.text }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.65, marginBottom: 16 }}>{article.excerpt}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{article.author}</span>
                    <motion.div whileHover={{ x: 4 }} style={{ color: C.accent }}>
                      <ChevronRight size={16} />
                    </motion.div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Load more */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <motion.button
              whileHover={{ background: C.accent, color: C.white }} whileTap={{ scale: 0.97 }}
              style={{
                padding: "14px 40px", background: "transparent", color: C.text,
                border: `2px solid ${C.bgDark}`, fontSize: 12, fontFamily: C.sans,
                fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.25s",
              }}
            >
              VOIR PLUS D'ARTICLES
            </motion.button>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside>
          {/* Newsletter mini */}
          <Reveal direction="right">
            <div style={{ background: C.bgDark, padding: "28px 24px", marginBottom: 32 }}>
              <div style={{ fontSize: 10, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.1em", color: C.accent, marginBottom: 12 }}>NEWSLETTER GRATUITE</div>
              <p style={{ fontFamily: C.serif, fontSize: 16, fontWeight: 600, color: C.bg, lineHeight: 1.4, marginBottom: 20 }}>
                Deux articles chaque semaine. Rien de plus.
              </p>
              <input
                type="email" placeholder="votre@email.com"
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: C.bg, fontSize: 13, fontFamily: C.sans, outline: "none", marginBottom: 10 }}
              />
              <motion.button
                whileHover={{ background: "#cc2d38" }} whileTap={{ scale: 0.97 }}
                style={{ width: "100%", padding: "11px", background: C.accent, color: C.white, border: "none", fontSize: 12, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer" }}
              >
                S'ABONNER GRATUITEMENT
              </motion.button>
              <div style={{ fontSize: 10, color: "rgba(250,250,250,0.3)", fontFamily: C.sans, marginTop: 8, letterSpacing: "0.04em" }}>
                RGPD · Désabonnement en 1 clic
              </div>
            </div>
          </Reveal>

          {/* Categories */}
          <Reveal direction="right" delay={0.1}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "24px", marginBottom: 32 }}>
              <div style={{ fontSize: 10, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.1em", color: C.textMuted, marginBottom: 20, borderBottom: `2px solid ${C.bgDark}`, paddingBottom: 10 }}>
                CATÉGORIES
              </div>
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 6 }}
                  onClick={() => setActiveCategory(cat.name)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0", borderBottom: i < CATEGORIES.length - 1 ? `1px solid ${C.border}` : "none",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 13, fontFamily: C.sans, color: activeCategory === cat.name ? C.accent : C.text, fontWeight: activeCategory === cat.name ? 700 : 400, transition: "color 0.2s" }}>
                    {cat.name}
                  </span>
                  <span style={{ fontSize: 11, color: C.textMuted, fontFamily: C.sans }}>
                    {cat.count}
                  </span>
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Archive by month */}
          <Reveal direction="right" delay={0.2}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "24px", marginBottom: 32 }}>
              <div style={{ fontSize: 10, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.1em", color: C.textMuted, marginBottom: 20, borderBottom: `2px solid ${C.bgDark}`, paddingBottom: 10 }}>
                ARCHIVES
              </div>
              {ARCHIVE_MONTHS.map((m, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  style={{
                    display: "flex", justifyContent: "space-between", padding: "9px 0",
                    borderBottom: i < ARCHIVE_MONTHS.length - 1 ? `1px solid ${C.border}` : "none",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={11} color={C.textMuted} />
                    <span style={{ fontSize: 12, fontFamily: C.sans, color: C.text }}>{m.month}</span>
                  </div>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{m.count} articles</span>
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Trending */}
          <Reveal direction="right" delay={0.3}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "24px" }}>
              <div style={{ fontSize: 10, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.1em", color: C.textMuted, marginBottom: 20, borderBottom: `2px solid ${C.bgDark}`, paddingBottom: 10 }}>
                EN CE MOMENT
              </div>
              {ARTICLES.slice(0, 4).map((a, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  style={{
                    display: "flex", gap: 12, padding: "12px 0",
                    borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 900, color: C.border, fontFamily: C.sans, lineHeight: 1, minWidth: 32 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontFamily: C.sans, fontWeight: 700, letterSpacing: "0.1em", color: C.accent, marginBottom: 4 }}>{a.cat}</div>
                    <div style={{ fontSize: 12, fontFamily: C.serif, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{a.title}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </aside>
      </section>

      {/* AUTHORS SECTION */}
      <section style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 48, borderBottom: `3px solid ${C.bgDark}`, paddingBottom: 12 }}>
              <h2 style={{ fontFamily: C.serif, fontSize: "clamp(22px, 2.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Nos auteurs
              </h2>
              <motion.a whileHover={{ color: C.accent }} href="#contact" style={{ fontSize: 12, fontFamily: C.sans, fontWeight: 600, color: C.textMuted, textDecoration: "none", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
                VOIR TOUS <ArrowRight size={13} />
              </motion.a>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 2 }}>
            {AUTHORS.map((author, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
                  style={{ background: C.white, padding: "32px 28px", border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.25s" }}
                >
                  <div style={{ width: 52, height: 52, background: author.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: C.white, marginBottom: 20 }}>
                    {author.initials}
                  </div>
                  <div style={{ fontFamily: C.serif, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>{author.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, fontFamily: C.sans, marginBottom: 16 }}>{author.role}</div>
                  <div style={{ fontSize: 11, color: author.color, fontFamily: C.sans, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 16 }}>{author.topics}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, fontFamily: C.sans }}>
                    <BookOpen size={11} style={{ display: "inline", marginRight: 4 }} />{author.articles} articles publiés
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA — bold split */}
      <section style={{ background: C.bgDark, padding: "96px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>
          <Reveal direction="left">
            <div>
              {/* Oversized number */}
              <div style={{ fontSize: "clamp(72px, 10vw, 140px)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.04em", color: C.white, fontFamily: C.sans, marginBottom: 24 }}>
                52K<br /><span style={{ color: C.accent }}>lecteurs</span><br />ne peuvent<br />pas avoir<br />tort.
              </div>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <div>
              <p style={{ fontSize: 17, color: "rgba(250,250,250,0.55)", fontFamily: C.sans, lineHeight: 1.8, marginBottom: 36 }}>{c?.aboutText ?? <>
                Les meilleurs articles sur la stratégie, le product et la croissance — deux fois par semaine. Gratuit. Toujours.
              </>}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <input type="email" placeholder="votre@email.com"
                  style={{ padding: "15px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: C.bg, fontSize: 15, fontFamily: C.sans, outline: "none" }} />
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 8px 32px rgba(230,57,70,0.4)` }}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: "15px", background: C.accent, color: C.white, border: "none", fontSize: 13, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer" }}
                >
                  S'ABONNER GRATUITEMENT
                </motion.button>
              </div>
              <p style={{ fontSize: 11, color: "rgba(250,250,250,0.25)", fontFamily: C.sans, letterSpacing: "0.04em" }}>
                Aucun spam. Désabonnement en 1 clic. RGPD compliant.
              </p>

              {/* Social proof mini */}
              <div style={{ display: "flex", gap: 16, marginTop: 32, alignItems: "center" }}>
                <div style={{ display: "flex" }}>
                  {["MD", "SC", "TM", "CA"].map((init, i) => (
                    <div key={i} style={{ width: 28, height: 28, background: ["#E63946", "#7C3AED", "#059669", "#D97706"][i], border: `2px solid ${C.bgDark}`, borderRadius: "50%", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: C.white }}>
                      {init}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 12, color: "rgba(250,250,250,0.4)", fontFamily: C.sans }}>
                  +52 000 professionnels nous font confiance
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 48px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 48, borderBottom: `3px solid ${C.bgDark}`, paddingBottom: 12 }}>
              <h2 style={{ fontFamily: C.serif, fontSize: "clamp(22px, 2.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Ce qu'en disent nos lecteurs
              </h2>
              <div style={{ display: "flex", gap: 8 }}>
                {TESTIMONIALS.map((_, i) => (
                  <motion.button
                    key={i} onClick={() => setTestimonialIdx(i)}
                    style={{ width: i === testimonialIdx ? 24 : 8, height: 8, background: i === testimonialIdx ? C.accent : C.border, border: "none", cursor: "pointer", transition: "all 0.3s" }}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 2 }}>
            {[TESTIMONIALS[testimonialIdx], TESTIMONIALS[(testimonialIdx + 1) % TESTIMONIALS.length], TESTIMONIALS[(testimonialIdx + 2) % TESTIMONIALS.length]].map((t, i) => (
              <Reveal key={`${testimonialIdx}-${i}`} delay={i * 0.1}>
                <div style={{ padding: "32px 28px", border: `1px solid ${C.border}`, background: C.bg }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={12} fill={C.accent} color={C.accent} />
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: C.text, fontFamily: C.sans, lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: C.bgDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.accent }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: C.sans }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: C.sans }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" style={{ padding: "80px 48px", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: C.serif, fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
                Accès illimité.
              </h2>
              <p style={{ fontSize: 17, color: C.textMuted, fontFamily: C.sans, marginBottom: 32 }}>
                Le prix d'un café par semaine pour les pros qui veulent tout.
              </p>
            </div>
          </Reveal>

          {/* Billing toggle */}
          <Reveal delay={0.1}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 48 }}>
              <span style={{ fontSize: 13, fontFamily: C.sans, color: !billingAnnual ? C.text : C.textMuted, fontWeight: !billingAnnual ? 700 : 400 }}>Mensuel</span>
              <motion.div
                onClick={() => setBillingAnnual(!billingAnnual)}
                style={{ width: 52, height: 28, background: billingAnnual ? C.accent : C.border, borderRadius: 14, cursor: "pointer", position: "relative" }}
              >
                <motion.div
                  animate={{ x: billingAnnual ? 26 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ position: "absolute", top: 3, width: 22, height: 22, background: C.white, borderRadius: "50%" }}
                />
              </motion.div>
              <span style={{ fontSize: 13, fontFamily: C.sans, color: billingAnnual ? C.text : C.textMuted, fontWeight: billingAnnual ? 700 : 400 }}>
                Annuel <span style={{ color: C.accent, fontWeight: 800 }}>-20%</span>
              </span>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 0, border: `2px solid ${C.bgDark}` }}>
            {PLANS.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  padding: "36px 32px", borderRight: i < 2 ? `2px solid ${C.bgDark}` : "none",
                  background: plan.featured ? C.bgDark : "transparent", position: "relative",
                }}>
                  {plan.featured && (
                    <div style={{ position: "absolute", top: -2, left: 0, right: 0, height: 4, background: C.accent }} />
                  )}
                  {plan.featured && (
                    <div style={{ position: "absolute", top: 16, right: 16, padding: "3px 10px", background: C.accent, fontSize: 9, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.1em", color: C.white }}>
                      POPULAIRE
                    </div>
                  )}
                  <h3 style={{ fontSize: 20, fontWeight: 900, fontFamily: C.sans, color: plan.featured ? C.bg : C.bgDark, marginBottom: 6 }}>{plan.name}</h3>
                  <p style={{ fontSize: 12, color: plan.featured ? "rgba(250,250,250,0.45)" : C.textMuted, fontFamily: C.sans, marginBottom: 24 }}>{plan.desc}</p>
                  <div style={{ marginBottom: 28 }}>
                    <span style={{ fontSize: 44, fontWeight: 900, fontFamily: C.sans, color: plan.featured ? C.accent : C.bgDark, letterSpacing: "-0.03em" }}>
                      {billingAnnual && plan.price !== "0" ? Math.floor(Number(plan.price) * 0.8) : plan.price}€
                    </span>
                    {plan.price !== "0" && (
                      <span style={{ fontSize: 13, color: plan.featured ? "rgba(250,250,250,0.4)" : C.textMuted, fontFamily: C.sans }}>/mois</span>
                    )}
                    {plan.price === "0" && (
                      <span style={{ fontSize: 13, color: plan.featured ? "rgba(250,250,250,0.4)" : C.textMuted, fontFamily: C.sans }}> pour toujours</span>
                    )}
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: plan.featured ? "rgba(250,250,250,0.75)" : C.text, fontFamily: C.sans }}>
                        <Check size={13} color={plan.featured ? C.accent : C.bgDark} style={{ marginTop: 2, flexShrink: 0 }} />{f}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{
                      width: "100%", padding: "13px",
                      background: plan.featured ? C.accent : C.bgDark,
                      color: C.white, border: "none",
                      fontSize: 12, fontFamily: C.sans, fontWeight: 800,
                      letterSpacing: "0.08em", cursor: "pointer",
                    }}
                  >
                    {plan.cta.toUpperCase()}
                  </motion.button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 48px", background: C.bgAlt }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: C.serif, fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 48, borderBottom: `3px solid ${C.bgDark}`, paddingBottom: 12 }}>
              Questions fréquentes
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{ borderBottom: `1px solid ${C.border}` }}>
                  <motion.button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: C.sans, paddingRight: 24 }}>{faq.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                      style={{ fontSize: 22, color: C.accent, fontWeight: 300, flexShrink: 0 }}>+</motion.span>
                  </motion.button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                        <p style={{ paddingBottom: 22, fontSize: 14, color: C.textMuted, fontFamily: C.sans, lineHeight: 1.85 }}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="contact" style={{ background: C.accent, padding: "80px 48px", textAlign: "center" }}>
        <Reveal>
          <div style={{ fontFamily: C.serif, fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 700, color: C.white, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 24 }}>
            Rejoignez les 52 000<br />professionnels informés.
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", fontFamily: C.sans, marginBottom: 40 }}>
            Gratuit. Deux fois par semaine. Sans spam.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ background: C.bgDark }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 40px", background: C.white, color: C.accent, border: "none", fontSize: 14, fontFamily: C.sans, fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.2s" }}
            >
              S'ABONNER GRATUITEMENT
            </motion.button>
            <motion.button
              whileHover={{ background: "rgba(255,255,255,0.15)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 40px", background: "transparent", color: C.white, border: "2px solid rgba(255,255,255,0.5)", fontSize: 14, fontFamily: C.sans, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.2s" }}
            >
              VOIR LES OFFRES PRO
            </motion.button>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.bgDark, padding: "56px 48px 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 80, marginBottom: 56, paddingBottom: 56, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 24, height: 24, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={12} color="#fff" />
                </div>
                <span style={{ fontFamily: C.serif, fontSize: 18, fontStyle: "italic", fontWeight: 700, color: C.bg }}>{fd?.businessName ?? "L'Essentiel"}</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(250,250,250,0.35)", fontFamily: C.sans, lineHeight: 1.7, maxWidth: 240 }}>
                Le media indépendant des professionnels du digital — stratégie, product, growth, culture.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                {[MessageSquare, Camera, Link2, Rss].map((Icon, i) => (
                  <motion.button
                    key={i} whileHover={{ scale: 1.15, background: C.accent }}
                    style={{ width: 30, height: 30, background: "rgba(255,255,255,0.06)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(250,250,250,0.4)", transition: "all 0.2s" }}
                  >
                    <Icon size={13} />
                  </motion.button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
              {[
                { title: "Catégories", links: ["Stratégie", "Product", "Marketing", "IA & Tech", "Financement"] },
                { title: "L'Essentiel", links: ["À propos", "Notre équipe", "Partenariats", "Publicité"] },
                { title: "Abonnés", links: ["Se connecter", "Mon compte", "Newsletter Pro", "Communauté"] },
                { title: "Légal", links: ["Mentions légales", "Politique de conf.", "CGU", "RGPD"] },
              ].map(col => (
                <div key={col.title}>
                  <h4 style={{ fontSize: 10, fontWeight: 800, color: C.accent, letterSpacing: "0.1em", fontFamily: C.sans, marginBottom: 16, textTransform: "uppercase" }}>{col.title}</h4>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {col.links.map(l => (
                      <li key={l}>
                        <motion.a href={col.title === "Légal" ? "#contact" : "#hero"} whileHover={{ color: C.bg }} style={{ fontSize: 12, color: "rgba(250,250,250,0.35)", textDecoration: "none", fontFamily: C.sans, transition: "color 0.2s" }}>{l}</motion.a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 11, color: "rgba(250,250,250,0.18)", fontFamily: C.sans }}>
              © 2026 L'Essentiel — Media indépendant · ISSN 2698-XXXX
            </p>
            <p style={{ fontSize: 11, color: "rgba(250,250,250,0.18)", fontFamily: C.sans }}>{fd?.city ?? "Paris"}, France</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
