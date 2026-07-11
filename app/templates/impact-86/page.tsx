"use client";
// @ts-nocheck

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Leaf,
  Sparkles,
  Clock,
  Star,
  ChevronRight,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Heart,
  Droplets,
  Wind,
  Sun,
  CheckCircle,
} from "lucide-react";
import { TemplateIcon } from '@/components/TemplateIcon';

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("aura-fonts")) return;
    const style = document.createElement("style");
    style.id = "aura-fonts";
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');`;
    document.head.appendChild(style);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

const rituals = [
  {
    id: "restore",
    label: "Restore",
    icon: <Droplets className="w-5 h-5" />,
    title: "Deep Restore Ritual",
    duration: "3h",
    price: "380€",
    description: "A full-body immersion in botanical hydration. Seaweed wrap, hot stone massage, and a signature facial tailored to your skin's needs.",
    steps: ["Botanical foot bath", "Seaweed body wrap (60 min)", "Hot stone full-body (75 min)", "Signature hydra facial (45 min)"],
    tag: "Bestseller",
  },
  {
    id: "rebalance",
    label: "Rebalance",
    icon: <Wind className="w-5 h-5" />,
    title: "Inner Harmony Journey",
    duration: "2h",
    price: "260€",
    description: "Restore equilibrium through breath, movement, and mindful touch. Combines pranayama, craniosacral therapy, and forest oil diffusion.",
    steps: ["Guided pranayama (20 min)", "Craniosacral session (60 min)", "Chakra oil diffusion (20 min)", "Herbal tea ceremony (20 min)"],
    tag: "New",
  },
  {
    id: "renew",
    label: "Renew",
    icon: <Sun className="w-5 h-5" />,
    title: "Radiance Renewal",
    duration: "2h30",
    price: "310€",
    description: "Luminous skin from within. A brightening enzyme peel, vitamin C infusion, and lymphatic drainage massage for a lit-from-within glow.",
    steps: ["Enzyme peel exfoliation (30 min)", "Vitamin C infusion (45 min)", "Lymphatic drainage (45 min)", "Gua sha sculpting (30 min)"],
    tag: "Popular",
  },
  {
    id: "cocoon",
    label: "Cocoon",
    icon: <Heart className="w-5 h-5" />,
    title: "Cocoon Escape",
    duration: "4h",
    price: "490€",
    description: "Our most indulgent offering. Full-day sanctuary access, private pool suite, four-hand massage, and a curated botanical lunch.",
    steps: ["Private pool & sauna (90 min)", "Four-hand synchronised massage (75 min)", "Gold leaf facial (60 min)", "Botanical wellness lunch"],
    tag: "Signature",
  },
];

const amenities = [
  { icon: <Droplets className="w-6 h-6" />, label: "Thermal Pools", desc: "Three mineral pools at 32°, 37° and 40°" },
  { icon: <Wind className="w-6 h-6" />, label: "Steam Grotto", desc: "Himalayan salt-infused steam room" },
  { icon: <Leaf className="w-6 h-6" />, label: "Botanical Garden", desc: "Private herb garden & quiet meadow" },
  { icon: <Sun className="w-6 h-6" />, label: "Infrared Sauna", desc: "Full-spectrum therapeutic heat" },
  { icon: <Sparkles className="w-6 h-6" />, label: "Ice Fountain", desc: "Invigorating contrast therapy" },
  { icon: <Heart className="w-6 h-6" />, label: "Meditation Loft", desc: "Soundproofed Tibetan singing bowls" },
];

const testimonials = [
  {
    name: "Isabelle M.",
    role: "Photographe",
    text: "J'arrive chez Aura dans un état de tension extrême et je repars comme une nouvelle personne. Chaque détail — les huiles, la lumière, le silence — est pensé pour vous libérer.",
    rating: 5,
    ritual: "Deep Restore Ritual",
  },
  {
    name: "Thomas L.",
    role: "Directeur artistique",
    text: "Le rituel Cocoon Escape est dans une autre dimension. Le massage à quatre mains est une expérience quasi mystique. Je réserve chaque trimestre.",
    rating: 5,
    ritual: "Cocoon Escape",
  },
  {
    name: "Camille R.",
    role: "Médecin",
    text: "Rare de trouver un spa qui allie rigueur scientifique et véritable savoir-faire sensoriel. Les soins sont efficaces, les thérapeutes exceptionnels.",
    rating: 5,
    ritual: "Radiance Renewal",
  },
];

const botanicals = [
  { name: "Centella Asiatica", origin: "Sri Lanka", benefit: "Régénération cellulaire", icon: "🌿" },
  { name: "Huile de Marula", origin: "Afrique du Sud", benefit: "Hydratation profonde", icon: "🌰" },
  { name: "Extrait de Lotus Bleu", origin: "Inde", benefit: "Apaisement & éclat", icon: "🪷" },
  { name: "Romarin Côtier", origin: "Méditerranée", benefit: "Circulation & détox", icon: "🌱" },
];

const team = [
  { name: "Amélie Fontaine", role: "Directrice Wellness", years: 14, specialty: "Massage Ayurvédique" },
  { name: "Nour El-Kadi", role: "Experte Soin Visage", years: 9, specialty: "Peeling & Gua Sha" },
  { name: "Pierre Lecomte", role: "Thérapeute Holistique", years: 11, specialty: "Craniosacral & Breath" },
];

// ─── Multi-page navigation (additive) ─────────────────────────────────────────
// PATTERN (reused from the impact vitrine references, e.g. impact-46): a single
// `page` state drives in-page navigation. The original single-page content is
// rendered verbatim under page === "home"; every other key renders a
// theme-native sub-page built from the SAME palette (#F6F3EE / #2C2820 /
// #7C9E87 / #6B5E52 / #D8D0C4 / #EDE9E2), the SAME fonts (Cormorant Garamond +
// Jost) and the SAME card/section styling. Nav + footer live OUTSIDE the gate.
type AuraPage = "home" | "soins" | "reservation" | "blog" | "about" | "contact" | "mentions" | "privacy";

const NAV_PAGES: { key: AuraPage; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "soins", label: "Soins" },
  { key: "reservation", label: "Réservation" },
  { key: "blog", label: "Blog" },
  { key: "about", label: "À propos" },
  { key: "contact", label: "Contact" },
];

// ─── Soins / rituels — fuller listing for the "Soins" sub-page ─────────────────
const soinsList = [
  {
    id: "restore",
    title: "Deep Restore Ritual",
    duration: "3h",
    price: "380€",
    tag: "Bestseller",
    description:
      "Une immersion corps entier dans l'hydratation botanique. Enveloppement aux algues, massage aux pierres chaudes et soin du visage signature, ajusté aux besoins de votre peau.",
    steps: ["Bain de pieds botanique", "Enveloppement algues (60 min)", "Pierres chaudes corps entier (75 min)", "Soin visage hydra signature (45 min)"],
    benefits: ["Hydratation intense", "Détente musculaire profonde", "Éclat retrouvé"],
  },
  {
    id: "rebalance",
    title: "Inner Harmony Journey",
    duration: "2h",
    price: "260€",
    tag: "Nouveau",
    description:
      "Retrouvez l'équilibre par le souffle, le mouvement et le toucher conscient. Associe pranayama, thérapie craniosacrale et diffusion d'huiles forestières.",
    steps: ["Pranayama guidé (20 min)", "Séance craniosacrale (60 min)", "Diffusion d'huiles chakra (20 min)", "Cérémonie du thé aux herbes (20 min)"],
    benefits: ["Apaisement du système nerveux", "Recentrage mental", "Sommeil amélioré"],
  },
  {
    id: "renew",
    title: "Radiance Renewal",
    duration: "2h30",
    price: "310€",
    tag: "Populaire",
    description:
      "Une peau lumineuse de l'intérieur. Peeling enzymatique éclaircissant, infusion de vitamine C et drainage lymphatique pour un teint illuminé.",
    steps: ["Exfoliation enzymatique (30 min)", "Infusion vitamine C (45 min)", "Drainage lymphatique (45 min)", "Sculpting gua sha (30 min)"],
    benefits: ["Teint unifié", "Effet bonne mine", "Stimulation circulatoire"],
  },
  {
    id: "cocoon",
    title: "Cocoon Escape",
    duration: "4h",
    price: "490€",
    tag: "Signature",
    description:
      "Notre offrande la plus généreuse. Accès au sanctuaire en journée complète, suite piscine privée, massage à quatre mains et déjeuner botanique sur mesure.",
    steps: ["Piscine & sauna privés (90 min)", "Massage synchronisé 4 mains (75 min)", "Soin visage feuille d'or (60 min)", "Déjeuner wellness botanique"],
    benefits: ["Coupure totale", "Lâcher-prise absolu", "Expérience d'exception"],
  },
  {
    id: "express",
    title: "Pause Sérénité",
    duration: "1h",
    price: "120€",
    tag: "Découverte",
    description:
      "Une parenthèse courte mais complète pour s'extraire du tumulte. Massage du dos, modelage crânien et rituel de respiration guidée.",
    steps: ["Accueil & infusion (10 min)", "Massage dos & nuque (35 min)", "Modelage crânien (10 min)", "Respiration guidée (5 min)"],
    benefits: ["Anti-stress immédiat", "Idéal pause déjeuner", "Énergie relancée"],
  },
  {
    id: "duo",
    title: "Rituel Duo Botanique",
    duration: "2h",
    price: "540€",
    tag: "À deux",
    description:
      "Un moment partagé dans notre suite duo. Deux thérapeutes, deux massages aux huiles botaniques en simultané, puis accès aux pools thermales en privatif.",
    steps: ["Suite duo privative", "Massages simultanés aux huiles (75 min)", "Accès pools thermales (40 min)", "Champagne botanique sans alcool"],
    benefits: ["Moment à partager", "Cadre intimiste", "Détente synchronisée"],
  },
];

// ─── Réservation — créneaux & horaires ────────────────────────────────────────
const horaires = [
  { day: "Lundi", hours: "10h — 20h" },
  { day: "Mardi", hours: "10h — 20h" },
  { day: "Mercredi", hours: "10h — 21h" },
  { day: "Jeudi", hours: "10h — 21h" },
  { day: "Vendredi", hours: "10h — 21h" },
  { day: "Samedi", hours: "9h — 19h" },
  { day: "Dimanche", hours: "10h — 17h" },
];

const creneaux = ["10h00", "11h30", "13h00", "14h30", "16h00", "17h30", "19h00"];

// ─── Blog — articles wellness FR (index + single) ─────────────────────────────
const blogArticles = [
  {
    slug: "rituel-du-soir",
    title: "Le rituel du soir : ralentir pour mieux dormir",
    date: "5 juin 2026",
    category: "Bien-être",
    readTime: "4 min",
    cover: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80",
    excerpt:
      "Un sommeil réparateur ne s'improvise pas. Découvrez le rituel apaisant que nos thérapeutes recommandent pour préparer le corps au repos.",
    body: [
      "Le sommeil est le plus puissant des soins, et pourtant le plus négligé. Avant de rejoindre votre lit, accordez-vous trente minutes de transition consciente : tamisez les lumières, éteignez les écrans et laissez votre système nerveux comprendre que la journée est terminée.",
      "Commencez par une infusion sans théine — verveine, camomille ou tilleul. La chaleur de la tasse entre les mains est déjà un signal d'apaisement. Profitez-en pour respirer lentement, en allongeant chaque expiration.",
      "Un automassage des pieds avec quelques gouttes d'huile de marula prolonge ce moment. Les points réflexes plantaires sont une porte directe vers la détente globale du corps. Trois minutes suffisent.",
      "Enfin, quelques étirements doux du dos et de la nuque libèrent les tensions accumulées. Ce rituel, répété chaque soir, recrée un rythme que le corps finit par anticiper — et le sommeil vient plus facilement.",
    ],
  },
  {
    slug: "actifs-botaniques",
    title: "Comprendre les actifs botaniques de votre soin",
    date: "22 mai 2026",
    category: "Ingrédients",
    readTime: "5 min",
    cover: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80",
    excerpt:
      "Centella, marula, lotus bleu : derrière chaque nom se cache une histoire et une vertu précise. Petit guide des plantes qui composent nos formules.",
    body: [
      "Chez Aura, chaque soin repose sur une sélection d'actifs botaniques tracés. Connaître leurs propriétés, c'est comprendre ce que votre peau reçoit réellement.",
      "La Centella Asiatica, surnommée « l'herbe du tigre », est reconnue pour stimuler la régénération cellulaire et apaiser les peaux réactives. Elle est la base de nos soins réparateurs.",
      "L'huile de Marula, extraite d'un fruit d'Afrique australe, est l'une des plus riches en acides gras et antioxydants. Légère et pénétrante, elle hydrate en profondeur sans effet gras.",
      "Le Lotus bleu, enfin, apporte éclat et apaisement. Utilisé depuis l'Égypte antique, il referme notre rituel Radiance Renewal sur une note lumineuse et sereine.",
    ],
  },
  {
    slug: "respiration-anti-stress",
    title: "Trois respirations pour évacuer le stress en 5 minutes",
    date: "8 mai 2026",
    category: "Pratiques",
    readTime: "3 min",
    cover: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=80",
    excerpt:
      "Pas besoin de longues séances pour retrouver son calme. Voici trois exercices de respiration que vous pouvez pratiquer partout, à tout moment.",
    body: [
      "La respiration est l'outil de régulation le plus immédiat dont nous disposons. En cinq minutes, ces trois exercices simples peuvent transformer votre état intérieur.",
      "La respiration carrée d'abord : inspirez sur quatre temps, retenez quatre temps, expirez quatre temps, retenez à vide quatre temps. Répétez cinq cycles. Elle apaise l'esprit et clarifie le mental avant une échéance.",
      "La cohérence cardiaque ensuite : six respirations par minute pendant cinq minutes. Cet exercice synchronise rythme cardiaque et respiration, et fait baisser le taux de cortisol de façon mesurable.",
      "Enfin, le soupir physiologique : deux inspirations brèves par le nez suivies d'une longue expiration par la bouche. C'est la façon la plus rapide de désamorcer une montée de stress aiguë.",
    ],
  },
  {
    slug: "spa-en-couple",
    title: "Offrir un soin : le cadeau qui prend soin",
    date: "26 avril 2026",
    category: "Inspiration",
    readTime: "4 min",
    cover: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80",
    excerpt:
      "Un soin offert, c'est offrir du temps et de l'attention. Nos conseils pour choisir le rituel qui correspondra vraiment à la personne qui vous est chère.",
    body: [
      "Offrir un soin, ce n'est pas offrir un objet : c'est offrir une parenthèse. Dans un quotidien saturé, c'est l'un des cadeaux les plus précieux que l'on puisse faire.",
      "Pour une personne très sollicitée, privilégiez un rituel court mais intense comme la Pause Sérénité : elle pourra l'intégrer facilement à son emploi du temps.",
      "Pour célébrer un moment particulier, le Cocoon Escape ou le Rituel Duo Botanique transforment une journée en souvenir durable.",
      "Nos bons cadeaux sont valables un an et personnalisables. Vous choisissez le montant ou le rituel, nous nous occupons du reste — y compris d'un mot manuscrit si vous le souhaitez.",
    ],
  },
];

// ─── Shared sub-page header (theme-native) ────────────────────────────────────
const PageHero = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <section className="pt-36 pb-16 px-6 bg-[#EDE9E2] border-b border-[#D8D0C4]">
    <div className="max-w-6xl mx-auto">
      <Reveal>
        <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">{eyebrow}</p>
        <h1 className="text-[#2C2820] text-4xl md:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
          {title}
        </h1>
        {subtitle && <p className="text-[#6B5E52] text-base max-w-2xl mt-5 leading-relaxed">{subtitle}</p>}
      </Reveal>
    </div>
  </section>
);

// ─── Soins (treatments/rituals listing + optional detail view) ────────────────

const FAQS = [
  { q: "Comment sont vérifiées vos huiles essentielles ?", a: "Chaque lot subit des analyses par chromatographie en phase gazeuse (GC-MS) pour garantir une pureté de 100%. Nous nous approvisionnons exclusivement auprès de domaines certifiés à Grasse et dans la vallée des roses en Bulgarie." },
  { q: "Quel est votre protocole de filtration de l'eau ?", a: "Nos circuits d'hydrothérapie utilisent un système de filtration breveté en 7 étapes, incluant une restructuration moléculaire et une minéralisation cristalline pour reproduire la pureté d'une eau de source de haute montagne." },
  { q: "Les rituels sont-ils adaptés à mon type de peau ?", a: "Oui. Chaque rituel Aura commence par un diagnostic d'analyse cutanée personnalisé. Nous ajustons ensuite les dosages de nos actifs botaniques et l'intensité des modelages en fonction de vos besoins." },
  { q: "Quelle est votre politique en matière de bruit et de tranquillité ?", a: "Notre sanctuaire est une zone certifiée à 'Zéro Décibel'. Tous nos espaces utilisent des matériaux isolants de qualité acoustique et nous proposons une neutralisation active du bruit dans nos suites privées." }
];


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function AuraWellnessPage() {
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

  useFonts();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRitual, setActiveRitual] = useState("restore");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [reservationSubmitted, setReservationSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const amenitiesRef = useRef(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  const { scrollYProgress: amenitiesScroll } = useScroll({ target: amenitiesRef, offset: ["start end", "end start"] });
  const amenitiesX = useTransform(amenitiesScroll, [0, 1], ["0%", "-8%"]);

  const currentRitual = rituals.find((r) => r.id === activeRitual)!;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const navItems = [
    { label: "Accueil", href: "#hero" },
    { label: "Soins", href: "#soins" },
    { label: "Espace", href: "#amenities" },
    { label: "Équipe", href: "#equipe" },
    { label: "Témoignages", href: "#temoignages" },
    { label: "FAQ", href: "#faq" },
    { label: "Réservation", href: "#reservation" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <div className="min-h-screen bg-[#F6F3EE]" style={{ fontFamily: "'Jost', sans-serif" }}>
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#7C9E87] origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#F6F3EE]/90 backdrop-blur-md border border-[#D8D0C4] rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="#about" className="flex items-center gap-2 cursor-pointer">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Leaf className="w-5 h-5 text-[#7C9E87]" />
                <span className="text-[#2C2820] tracking-widest text-sm uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>{fd?.businessName ?? "Aura Wellness"}</span>
              </>
            )}
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[#2C2820]/70 text-sm tracking-wide">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors duration-200 cursor-pointer hover:text-[#7C9E87]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="#reservation"
            className="hidden md:inline-flex items-center gap-2 bg-[#7C9E87] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer"
          >
            Réserver
          </Link>
          <button
            className="md:hidden text-[#2C2820] cursor-pointer"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#F6F3EE] flex flex-col p-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-4">
              {fd?.logoBase64 ? (
                <img
                  src={fd.logoBase64}
                  alt={fd?.businessName ?? 'logo'}
                  style={{ height: 28, maxWidth: 140, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <span className="text-[#2C2820] tracking-widest text-sm uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>{fd?.businessName ?? "Aura Wellness"}</span>
              )}
              <button onClick={() => setMobileOpen(false)} className="text-[#2C2820] cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-6 pt-10">
              {navItems.map((item) => (
                <motion.div key={item.label} whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                  <Link
                    href={item.href}
                    className="text-[#2C2820] text-3xl font-light hover:text-[#7C9E87] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section id="hero" ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1600&q=85"
            alt="Aura Wellness sanctuary"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C2820]/40 via-transparent to-[#F6F3EE]/60" />
        </motion.div>
        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: heroOpacity }}
        >
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-white text-xs tracking-widest uppercase mb-8">
              <Leaf className="w-3 h-3" />
              Sanctuary — Bordeaux
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="text-white text-6xl md:text-8xl leading-none mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >{c?.heroHeadline ?? <>
              Retrouver<br />
              <em>l'essentiel</em>
            </>}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/80 text-lg max-w-lg mb-10 leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>
              Un sanctuaire de soins botaniques et de rituels ancestraux pour celles et ceux qui cherchent à s'ancrer, se restaurer, s'éveiller.
            </>}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#soins" className="bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer">
                Découvrir les rituels
              </Link>
              <Link href="#amenities" className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-white/30 transition-colors duration-200 cursor-pointer">
                Visiter l'espace
              </Link>
            </div>
          </Reveal>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            className="w-px h-12 bg-white/50 mx-auto"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </section>

      {/* Intro Statement */}
      <section id="about" className="py-24 px-6 max-w-4xl mx-auto text-center">
        <Reveal>
          <p
            className="text-[#2C2820] text-3xl md:text-5xl leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            "Le soin n'est pas un luxe.<br />C'est <em>un acte de retour à soi.</em>"
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[#6B5E52] text-base max-w-2xl mx-auto leading-relaxed">{c?.aboutText ?? <>
            Fondé en 2014, Aura Wellness propose des soins conçus à partir d'ingrédients botaniques traçables, administrés par des thérapeutes formés aux traditions ayurvédiques, taoïstes et méditerranéennes.
          </>}</p>
        </Reveal>
      </section>

      {/* Rituals */}
      <section id="soins" className="py-20 px-6 bg-[#EDE9E2]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Soins & Rituels</p>
              <h2
                className="text-[#2C2820] text-4xl md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Choisissez votre voyage
              </h2>
            </div>
          </Reveal>
          <div className="flex gap-3 mb-10 flex-wrap">
            {rituals.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRitual(r.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer border ${
                  activeRitual === r.id
                    ? "bg-[#7C9E87] text-white border-[#7C9E87]"
                    : "bg-white text-[#2C2820]/70 border-[#D8D0C4] hover:border-[#7C9E87] hover:text-[#7C9E87]"
                }`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRitual}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden border border-[#D8D0C4]"
            >
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs bg-[#7C9E87]/10 text-[#7C9E87] px-3 py-1 rounded-full border border-[#7C9E87]/20">
                    {currentRitual.tag}
                  </span>
                  <span className="text-[#6B5E52] text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {currentRitual.duration}
                  </span>
                </div>
                <h3
                  className="text-[#2C2820] text-3xl mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                >
                  {currentRitual.title}
                </h3>
                <p className="text-[#6B5E52] leading-relaxed mb-8 text-sm">
                  {currentRitual.description}
                </p>
                <div className="space-y-3 mb-8">
                  {currentRitual.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#2C2820]/80">
                      <CheckCircle className="w-4 h-4 text-[#7C9E87] shrink-0" />
                      {step}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[#2C2820] text-4xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {currentRitual.price}
                  </span>
                  <Link href="#reservation" className="flex items-center gap-2 bg-[#2C2820] text-white px-6 py-3 rounded-xl text-sm hover:bg-[#3D3830] transition-colors duration-200 cursor-pointer">
                    Réserver <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="relative min-h-[320px]">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"
                  alt={currentRitual.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" ref={amenitiesRef} className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">L'Espace</p>
              <h2
                className="text-[#2C2820] text-4xl md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Un sanctuaire complet
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.07}>
                <div className="bg-white rounded-2xl p-6 border border-[#D8D0C4] hover:border-[#7C9E87] transition-colors duration-200 group cursor-pointer">
                  <div className="w-10 h-10 bg-[#7C9E87]/10 rounded-xl flex items-center justify-center text-[#7C9E87] mb-4 group-hover:bg-[#7C9E87] group-hover:text-white transition-colors duration-200">
                    {a.icon}
                  </div>
                  <h3 className="text-[#2C2820] font-medium text-sm mb-1">{a.label}</h3>
                  <p className="text-[#6B5E52] text-xs leading-relaxed">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <motion.div
          className="max-w-6xl mx-auto mt-10 rounded-3xl overflow-hidden relative h-64 md:h-96"
          style={{ x: amenitiesX }}
        >
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80"
            alt="Aura Wellness thermal pools"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C2820]/30 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="text-white text-xs tracking-widest uppercase mb-1">Bordeaux, France</p>
            <p
              className="text-white text-2xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              2 000 m² d'espace dédié
            </p>
          </div>
        </motion.div>
      </section>

      {/* Botanicals */}
      <section id="botanicals" className="py-24 px-6 bg-[#2C2820]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Formules Botaniques</p>
              <h2
                className="text-white text-4xl md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Des actifs d'exception
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {botanicals.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                  <div className="mb-4"><TemplateIcon emoji={b.icon} size={30} /></div>
                  <h3
                    className="text-white text-lg mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {b.name}
                  </h3>
                  <p className="text-[#7C9E87] text-xs mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {b.origin}
                  </p>
                  <p className="text-white/60 text-sm">{b.benefit}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
              <Leaf className="w-8 h-8 text-[#7C9E87] shrink-0" />
              <div>
                <p className="text-white text-sm font-medium mb-1">Traçabilité 100% garantie</p>
                <p className="text-white/50 text-sm leading-relaxed">
                  Chaque ingrédient utilisé chez Aura est sourcé directement auprès d'exploitations certifiées biologiques et équitables. Nos formules sont testées dermatologiquement et ne contiennent aucun perturbateur endocrinien.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section id="equipe" className="py-24 px-6 bg-[#EDE9E2]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Notre Équipe</p>
              <h2
                className="text-[#2C2820] text-4xl md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Des thérapeutes d'exception
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden border border-[#D8D0C4] group cursor-pointer">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-${["1559599101-f09722fb4948", "1573496359142-b8d87734a5a2", "1507003211169-0a1dd7228f2d"][i]}?w=600&q=80`}
                      alt={t.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-[#2C2820] text-xl mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {t.name}
                    </h3>
                    <p className="text-[#7C9E87] text-xs tracking-wide uppercase mb-3">{t.role}</p>
                    <div className="flex items-center gap-4 text-sm text-[#6B5E52]">
                      <span>{t.years} ans d'expérience</span>
                      <span className="text-[#D8D0C4]">·</span>
                      <span>{t.specialty}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="temoignages" className="py-24 px-6 bg-[#7C9E87]">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="text-white/60 text-xs tracking-widest uppercase mb-12">Témoignages</p>
          </Reveal>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-white fill-white" />
                ))}
              </div>
              <p
                className="text-white text-2xl md:text-3xl leading-relaxed mb-8"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
              >
                "{testimonials[activeTestimonial].text}"
              </p>
              <p className="text-white font-medium text-sm">{testimonials[activeTestimonial].name}</p>
              <p className="text-white/60 text-xs mt-1">{testimonials[activeTestimonial].role} · {testimonials[activeTestimonial].ritual}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeTestimonial ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#EDE9E2] border-t border-[#D8D0C4]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3 block">
              Sourcing & Éthique
            </span>
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#2C2820]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Audit Botanique & FAQ
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-6">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-[#D8D0C4] px-4"
              >
                <AccordionTrigger className="text-left font-sans font-bold uppercase tracking-widest text-[11px] text-[#2C2820] py-6 hover:text-[#7C9E87] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm font-light text-[#6B5E52] leading-relaxed pb-6 italic">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Réservation */}
      <section id="reservation" className="py-24 px-6 bg-white border-t border-[#D8D0C4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Réservation</p>
            <h2 className="text-[#2C2820] text-3xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Réserver votre rituel
            </h2>
          </div>
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
            {/* Form */}
            <Reveal>
              <div className="bg-[#EDE9E2] rounded-3xl border border-[#D8D0C4] p-8 md:p-10">
                {reservationSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-[#7C9E87] mx-auto mb-6" />
                    <h3 className="text-[#2C2820] text-3xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Demande envoyée
                    </h3>
                    <p className="text-[#6B5E52] text-sm max-w-sm mx-auto leading-relaxed">
                      Merci. Notre équipe vous recontacte sous 24h pour confirmer votre rituel. À très vite chez Aura.
                    </p>
                    <button
                      onClick={() => setReservationSubmitted(false)}
                      className="mt-8 text-[#7C9E87] text-sm hover:underline cursor-pointer"
                    >
                      Faire une autre demande
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setReservationSubmitted(true);
                    }}
                    className="space-y-6"
                    style={{ fontSize: "16px" }}
                  >
                    <div>
                      <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="soin">Soin souhaité</label>
                      <select id="soin" required className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} defaultValue="">
                        <option value="" disabled>Choisir un rituel</option>
                        {rituals.map((s) => (
                          <option key={s.id} value={s.id}>{s.title} — {s.duration} · {s.price}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="date">Date</label>
                        <input id="date" type="date" required className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} />
                      </div>
                      <div>
                        <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="heure">Heure</label>
                        <select id="heure" required className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} defaultValue="">
                          <option value="" disabled>Choisir un créneau</option>
                          {creneaux.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="nom">Nom complet</label>
                      <input id="nom" type="text" required placeholder="Votre nom" className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="email">Email</label>
                        <input id="email" type="email" required placeholder="vous@email.com" className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} />
                      </div>
                      <div>
                        <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="tel">Téléphone</label>
                        <input id="tel" type="tel" required placeholder="+33 6 00 00 00 00" className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="message">Message (optionnel)</label>
                      <textarea id="message" rows={3} placeholder="Une demande particulière ?" className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      Confirmer ma demande <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[#6B5E52] text-xs text-center font-light mt-3">Annulation gratuite jusqu'à 48h avant votre réservation.</p>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Horaires info */}
            <Reveal delay={0.1}>
              <div className="bg-[#EDE9E2] rounded-3xl border border-[#D8D0C4] p-8 md:p-10 h-full">
                <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Horaires</p>
                <h3 className="text-[#2C2820] text-2xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Nous vous accueillons
                </h3>
                <ul className="space-y-3 mb-8">
                  {horaires.map((h) => (
                    <li key={h.day} className="flex items-center justify-between text-sm border-b border-[#D8D0C4] pb-3 last:border-0">
                      <span className="text-[#2C2820]/80">{h.day}</span>
                      <span className="text-[#6B5E52]">{h.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-[#F6F3EE] border-t border-[#D8D0C4]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Coordonnées */}
          <Reveal>
            <div className="bg-[#EDE9E2] rounded-3xl border border-[#D8D0C4] p-8 md:p-10 h-full">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Coordonnées</p>
              <h3 className="text-[#2C2820] text-2xl mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Aura Wellness — Bordeaux
              </h3>
              <ul className="space-y-5 text-sm text-[#6B5E52]">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#7C9E87] shrink-0 mt-0.5" />
                  <span>Adresse communiquée sur demande<br /><span className="text-[#2C2820]/50 text-xs">Bordeaux, France</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#7C9E87] shrink-0" /> +33 5 56 00 00 00
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#7C9E87] shrink-0" />{fd?.email ?? "contact@aurawellness.fr"}</li>
              </ul>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-3xl border border-[#D8D0C4] p-8 md:p-10 h-full">
              {contactSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-[#7C9E87] mx-auto mb-6" />
                  <h3 className="text-[#2C2820] text-3xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Message envoyé
                  </h3>
                  <p className="text-[#6B5E52] text-sm max-w-sm mx-auto leading-relaxed">
                    Merci, nous vous répondrons sous 24h.
                  </p>
                  <button onClick={() => setContactSubmitted(false)} className="mt-8 text-[#7C9E87] text-sm hover:underline cursor-pointer">
                    Écrire un autre message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-6"
                  style={{ fontSize: "16px" }}
                >
                  <div>
                    <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="c-nom">Nom complet</label>
                    <input id="c-nom" type="text" required placeholder="Votre nom" className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} />
                  </div>
                  <div>
                    <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" required placeholder="vous@email.com" className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} />
                  </div>
                  <div>
                    <label className="block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2" htmlFor="c-message">Message</label>
                    <textarea id="c-message" rows={5} required placeholder="Votre message…" className="w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors" style={{ fontSize: "16px" }} />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Envoyer le message <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#EDE9E2] border-t border-[#D8D0C4] py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-4 h-4 text-[#7C9E87]" />
              <span
                className="text-[#2C2820] text-lg"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >{fd?.businessName ?? "Aura Wellness"}</span>
            </div>
            <p className="text-[#6B5E52] text-sm leading-relaxed mb-4">
              Sanctuary de soins botaniques & rituels holistiques. Bordeaux, France.
            </p>
            <div className="space-y-1 text-xs text-[#6B5E52]">
              <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Adresse communiquée sur demande</div>
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> +33 5 56 00 00 00</div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" />{fd?.email ?? "contact@aurawellness.fr"}</div>
            </div>
          </div>
          {[
            { title: "Soins", links: [["Deep Restore", "#soins"], ["Inner Harmony", "#soins"], ["Radiance Renewal", "#soins"], ["Cocoon Escape", "#soins"]] },
            { title: "L'Espace", links: [["Le sanctuaire", "#about"], ["Notre philosophie", "#about"], ["L'équipe", "#equipe"]] },
            { title: "Informations", links: [["Réserver", "#reservation"], ["Contact", "#contact"], ["FAQ", "#faq"]] }
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[#2C2820] text-sm font-medium mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([l, target]) => (
                  <li key={l}>
                    <Link href={target} className="text-[#6B5E52] text-sm hover:text-[#7C9E87] transition-colors duration-200 cursor-pointer text-left">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-[#D8D0C4] mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#6B5E52]">
          <span>© 2026 Aura Wellness. Tous droits réservés.</span>
          <div className="flex gap-6">
            <Link href="/templates/impact-86/mentions-legales" className="hover:text-[#7C9E87] transition-colors cursor-pointer">Mentions légales</Link>
            <Link href="/templates/impact-86/cgu" className="hover:text-[#7C9E87] transition-colors cursor-pointer">CGU</Link>
            <Link href="/templates/impact-86/confidentialite" className="hover:text-[#7C9E87] transition-colors cursor-pointer">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
