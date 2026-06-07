"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
function SoinsPage({
  openSoin,
  setOpenSoin,
  goTo,
}: {
  openSoin: string | null;
  setOpenSoin: (s: string | null) => void;
  goTo: (p: AuraPage) => void;
}) {
  const detail = soinsList.find((s) => s.id === openSoin);

  if (detail) {
    return (
      <div>
        <PageHero eyebrow="Soins & Rituels" title={detail.title} subtitle={detail.description} />
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => setOpenSoin(null)}
              className="text-[#7C9E87] text-sm flex items-center gap-1 mb-10 hover:gap-2 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Tous les soins
            </button>
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden border border-[#D8D0C4]">
              <div className="relative min-h-[320px]">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"
                  alt={detail.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs bg-[#7C9E87]/10 text-[#7C9E87] px-3 py-1 rounded-full border border-[#7C9E87]/20">{detail.tag}</span>
                  <span className="text-[#6B5E52] text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {detail.duration}
                  </span>
                </div>
                <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Le déroulé</p>
                <div className="space-y-3 mb-8">
                  {detail.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#2C2820]/80">
                      <CheckCircle className="w-4 h-4 text-[#7C9E87] shrink-0" />
                      {step}
                    </div>
                  ))}
                </div>
                <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Les bienfaits</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {detail.benefits.map((b) => (
                    <span key={b} className="text-xs text-[#6B5E52] bg-[#EDE9E2] border border-[#D8D0C4] px-3 py-1.5 rounded-full">
                      {b}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2C2820] text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {detail.price}
                  </span>
                  <button
                    onClick={() => goTo("reservation")}
                    className="flex items-center gap-2 bg-[#2C2820] text-white px-6 py-3 rounded-xl text-sm hover:bg-[#3D3830] transition-colors duration-200 cursor-pointer"
                  >
                    Réserver <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Soins & Rituels"
        title="Nos soins & rituels"
        subtitle="Des protocoles botaniques conçus pour ralentir, restaurer et réveiller. Chaque rituel est ajusté à vos besoins lors de l'accueil."
      />
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soinsList.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.08}>
              <div className="bg-white rounded-3xl border border-[#D8D0C4] hover:border-[#7C9E87] transition-colors duration-200 p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-[#7C9E87]/10 text-[#7C9E87] px-3 py-1 rounded-full border border-[#7C9E87]/20">{s.tag}</span>
                  <span className="text-[#6B5E52] text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {s.duration}
                  </span>
                </div>
                <h3 className="text-[#2C2820] text-2xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {s.title}
                </h3>
                <p className="text-[#6B5E52] text-sm leading-relaxed mb-6 flex-1">{s.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#D8D0C4]">
                  <span className="text-[#2C2820] text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {s.price}
                  </span>
                  <button
                    onClick={() => {
                      setOpenSoin(s.id);
                      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
                    }}
                    className="flex items-center gap-1 text-[#7C9E87] text-sm hover:gap-2 transition-all cursor-pointer"
                  >
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="max-w-6xl mx-auto mt-12 bg-[#2C2820] rounded-3xl p-10 md:p-12 text-center">
            <Leaf className="w-7 h-7 text-[#7C9E87] mx-auto mb-5" />
            <h2 className="text-white text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Un soin sur mesure ?
            </h2>
            <p className="text-white/60 max-w-lg mx-auto leading-relaxed mb-8">
              Nos thérapeutes composent des protocoles personnalisés selon vos besoins. Réservez un échange pour construire votre rituel idéal.
            </p>
            <button
              onClick={() => goTo("reservation")}
              className="bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer"
            >
              Réserver mon soin
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ─── Réservation (booking form + horaires) ────────────────────────────────────
function ReservationPage() {
  const [sent, setSent] = useState(false);
  const inputCls =
    "w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors";
  const labelCls = "block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2";

  return (
    <div>
      <PageHero
        eyebrow="Réservation"
        title="Réserver votre rituel"
        subtitle="Choisissez votre soin, votre date et votre créneau. Nous confirmons votre réservation sous 24h."
      />
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.6fr_1fr] gap-8">
          {/* Form */}
          <Reveal>
            <div className="bg-white rounded-3xl border border-[#D8D0C4] p-8 md:p-10">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-[#7C9E87] mx-auto mb-6" />
                  <h3 className="text-[#2C2820] text-3xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Demande envoyée
                  </h3>
                  <p className="text-[#6B5E52] text-sm max-w-sm mx-auto leading-relaxed">
                    Merci. Notre équipe vous recontacte sous 24h pour confirmer votre rituel. À très vite chez Aura.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-8 text-[#7C9E87] text-sm hover:underline cursor-pointer"
                  >
                    Faire une autre demande
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="space-y-6"
                  style={{ fontSize: "16px" }}
                >
                  <div>
                    <label className={labelCls} htmlFor="soin">Soin souhaité</label>
                    <select id="soin" required className={inputCls} style={{ fontSize: "16px" }} defaultValue="">
                      <option value="" disabled>Choisir un rituel</option>
                      {soinsList.map((s) => (
                        <option key={s.id} value={s.id}>{s.title} — {s.duration} · {s.price}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls} htmlFor="date">Date</label>
                      <input id="date" type="date" required className={inputCls} style={{ fontSize: "16px" }} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="heure">Heure</label>
                      <select id="heure" required className={inputCls} style={{ fontSize: "16px" }} defaultValue="">
                        <option value="" disabled>Choisir un créneau</option>
                        {creneaux.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="nom">Nom complet</label>
                    <input id="nom" type="text" required placeholder="Votre nom" className={inputCls} style={{ fontSize: "16px" }} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls} htmlFor="email">Email</label>
                      <input id="email" type="email" required placeholder="vous@email.com" className={inputCls} style={{ fontSize: "16px" }} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="tel">Téléphone</label>
                      <input id="tel" type="tel" required placeholder="+33 6 00 00 00 00" className={inputCls} style={{ fontSize: "16px" }} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="message">Message (optionnel)</label>
                    <textarea id="message" rows={3} placeholder="Une demande particulière ?" className={inputCls} style={{ fontSize: "16px" }} />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Confirmer ma demande <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[#6B5E52] text-xs text-center">Annulation gratuite jusqu'à 48h avant votre réservation.</p>
                </form>
              )}
            </div>
          </Reveal>

          {/* Horaires */}
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
              <div className="space-y-2 text-xs text-[#6B5E52]">
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#7C9E87]" /> +33 5 56 00 00 00</div>
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#7C9E87]" /> contact@aurawellness.fr</div>
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#7C9E87]" /> Bordeaux — adresse communiquée sur demande</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ─── Blog (index + single article) ────────────────────────────────────────────
function BlogPage({
  blogSlug,
  setBlogSlug,
}: {
  blogSlug: string | null;
  setBlogSlug: (s: string | null) => void;
}) {
  const article = blogArticles.find((a) => a.slug === blogSlug);

  if (article) {
    return (
      <div>
        <PageHero eyebrow={article.category} title={article.title} />
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setBlogSlug(null)}
              className="text-[#7C9E87] text-sm flex items-center gap-1 mb-8 hover:gap-2 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Tous les articles
            </button>
            <div className="flex items-center gap-4 text-xs text-[#6B5E52] mb-8">
              <span>{article.date}</span>
              <span className="text-[#D8D0C4]">·</span>
              <span>{article.readTime} de lecture</span>
            </div>
            <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden mb-10 border border-[#D8D0C4]">
              <Image src={article.cover} alt={article.title} fill className="object-cover" />
            </div>
            <div className="space-y-6">
              {article.body.map((p, i) => (
                <p key={i} className="text-[#2C2820]/80 text-base leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Le Journal"
        title="Le blog Aura"
        subtitle="Rituels, ingrédients et pratiques de bien-être : nos thérapeutes partagent ce qui prolonge les bienfaits du sanctuaire à la maison."
      />
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {blogArticles.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 2) * 0.1}>
              <button
                onClick={() => {
                  setBlogSlug(a.slug);
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
                }}
                className="block text-left w-full bg-white rounded-3xl border border-[#D8D0C4] overflow-hidden hover:border-[#7C9E87] transition-colors duration-200 group cursor-pointer h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image src={a.cover} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 text-xs text-[#6B5E52] mb-3">
                    <span className="text-[#7C9E87] tracking-widest uppercase">{a.category}</span>
                    <span className="text-[#D8D0C4]">·</span>
                    <span>{a.date}</span>
                  </div>
                  <h3 className="text-[#2C2820] text-2xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {a.title}
                  </h3>
                  <p className="text-[#6B5E52] text-sm leading-relaxed mb-4">{a.excerpt}</p>
                  <span className="text-[#7C9E87] text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Lire l'article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── À propos (story / philosophy / team) ─────────────────────────────────────
function AboutPage({ goTo }: { goTo: (p: AuraPage) => void }) {
  const valeurs = [
    { icon: <Leaf className="w-6 h-6" />, title: "Botanique & traçable", text: "Chaque actif est sourcé auprès d'exploitations certifiées biologiques et équitables, sans perturbateur endocrinien." },
    { icon: <Heart className="w-6 h-6" />, title: "Le soin comme retour à soi", text: "Nous ne vendons pas du luxe, mais une parenthèse : un espace où ralentir, respirer et se retrouver." },
    { icon: <Sparkles className="w-6 h-6" />, title: "Savoir-faire d'exception", text: "Nos thérapeutes sont formés aux traditions ayurvédiques, taoïstes et méditerranéennes, et se forment en continu." },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Notre histoire"
        title="À propos d'Aura"
        subtitle="Fondé en 2014 à Bordeaux, Aura Wellness est né d'une conviction simple : prendre soin de soi n'est pas un luxe, c'est un besoin essentiel."
      />
      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative h-80 md:h-[28rem] rounded-3xl overflow-hidden border border-[#D8D0C4]">
              <Image
                src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1000&q=80"
                alt="Le sanctuaire Aura Wellness"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Notre philosophie</p>
              <h2 className="text-[#2C2820] text-3xl md:text-4xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                Un sanctuaire pensé dans le moindre détail
              </h2>
              <div className="space-y-4 text-[#6B5E52] text-sm leading-relaxed">
                <p>
                  Sur 2 000 m² au cœur de Bordeaux, Aura déploie pools thermales, grotte de vapeur, sauna infrarouge et jardin botanique privé. Tout y est pensé pour relâcher : la lumière, les matières, le silence.
                </p>
                <p>
                  Nous croyons que l'efficacité d'un soin tient autant à la rigueur du protocole qu'à la qualité du moment. C'est pourquoi nos rituels associent savoir-faire sensoriel et formules botaniques tracées.
                </p>
                <p>
                  Plus de dix ans après son ouverture, Aura reste fidèle à sa promesse : offrir à chacun un véritable retour à soi.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 px-6 bg-[#EDE9E2]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Nos valeurs</p>
              <h2 className="text-[#2C2820] text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                Ce qui nous guide
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {valeurs.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-7 border border-[#D8D0C4] h-full">
                  <div className="w-10 h-10 bg-[#7C9E87]/10 rounded-xl flex items-center justify-center text-[#7C9E87] mb-4">
                    {v.icon}
                  </div>
                  <h3 className="text-[#2C2820] text-xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{v.title}</h3>
                  <p className="text-[#6B5E52] text-sm leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-3">Notre Équipe</p>
              <h2 className="text-[#2C2820] text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                Des thérapeutes d'exception
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden border border-[#D8D0C4] group">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-${["1559599101-f09722fb4948", "1573496359142-b8d87734a5a2", "1507003211169-0a1dd7228f2d"][i]}?w=600&q=80`}
                      alt={t.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-[#2C2820] text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.name}</h3>
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
          <Reveal>
            <div className="text-center mt-14">
              <button
                onClick={() => goTo("reservation")}
                className="bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer"
              >
                Réserver votre rituel
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ─── Contact (address-on-request + form) ──────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputCls =
    "w-full bg-[#F6F3EE] border border-[#D8D0C4] rounded-xl px-4 py-3 text-[#2C2820] outline-none focus:border-[#7C9E87] transition-colors";
  const labelCls = "block text-[#2C2820]/70 text-xs tracking-widest uppercase mb-2";

  return (
    <div>
      <PageHero eyebrow="Contact" title="Nous contacter" subtitle="Une question, une demande particulière, un projet de soin sur mesure ? Écrivez-nous, nous répondons sous 24h." />
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
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
                  <Mail className="w-5 h-5 text-[#7C9E87] shrink-0" /> contact@aurawellness.fr
                </li>
              </ul>
              <div className="border-t border-[#D8D0C4] mt-8 pt-8">
                <p className="text-[#7C9E87] text-xs tracking-widest uppercase mb-4">Horaires</p>
                <ul className="space-y-2 text-sm">
                  {horaires.map((h) => (
                    <li key={h.day} className="flex items-center justify-between">
                      <span className="text-[#2C2820]/80">{h.day}</span>
                      <span className="text-[#6B5E52]">{h.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-3xl border border-[#D8D0C4] p-8 md:p-10 h-full">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-[#7C9E87] mx-auto mb-6" />
                  <h3 className="text-[#2C2820] text-3xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Message envoyé
                  </h3>
                  <p className="text-[#6B5E52] text-sm max-w-sm mx-auto leading-relaxed">
                    Merci de votre message. Notre équipe vous répond sous 24h.
                  </p>
                  <button onClick={() => setSent(false)} className="mt-8 text-[#7C9E87] text-sm hover:underline cursor-pointer">
                    Écrire un autre message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="space-y-6"
                  style={{ fontSize: "16px" }}
                >
                  <div>
                    <label className={labelCls} htmlFor="c-nom">Nom complet</label>
                    <input id="c-nom" type="text" required placeholder="Votre nom" className={inputCls} style={{ fontSize: "16px" }} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" required placeholder="vous@email.com" className={inputCls} style={{ fontSize: "16px" }} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="c-sujet">Sujet</label>
                    <input id="c-sujet" type="text" placeholder="L'objet de votre message" className={inputCls} style={{ fontSize: "16px" }} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="c-message">Message</label>
                    <textarea id="c-message" rows={5} required placeholder="Votre message…" className={inputCls} style={{ fontSize: "16px" }} />
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
    </div>
  );
}

// ─── Mentions légales / Confidentialité ───────────────────────────────────────
function LegalPage({ variant }: { variant: "mentions" | "privacy" }) {
  const h2 = "text-[#2C2820] text-2xl mt-10 mb-3";
  const h2Style = { fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 as const };
  const para = "text-[#6B5E52] text-base leading-relaxed mb-3";
  const strong = "text-[#2C2820] font-medium";

  if (variant === "mentions") {
    return (
      <div>
        <PageHero eyebrow="Informations légales" title="Mentions légales" />
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className={h2} style={{ ...h2Style, marginTop: 0 }}>Éditeur du site</h2>
            <p className={para}><span className={strong}>Aevia WS</span> — entrepreneur individuel (auto-entrepreneur).</p>
            <p className={para}>Directeur de la publication : <span className={strong}>Valentin Milliand</span>.</p>
            <p className={para}>SIREN : <span className={strong}>852 546 225</span> — RCS Bourg-en-Bresse.</p>
            <p className={para}>Contact : <span className={strong}>contact@aevia.io</span></p>
            <p className={para}>Adresse du siège social communiquée sur demande à contact@aevia.io.</p>

            <h2 className={h2} style={h2Style}>TVA</h2>
            <p className={para}>TVA non applicable, art. 293 B du CGI.</p>

            <h2 className={h2} style={h2Style}>Hébergeur</h2>
            <p className={para}>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

            <h2 className={h2} style={h2Style}>Propriété intellectuelle</h2>
            <p className={para}>
              L'ensemble des contenus présents sur ce site (textes, visuels, logo, mise en page) est protégé par le droit
              de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable
              de l'éditeur.
            </p>

            <h2 className={h2} style={h2Style}>Responsabilité</h2>
            <p className={para}>
              Les informations diffusées sur ce site sont fournies à titre indicatif. Les soins proposés ne se substituent
              en aucun cas à un avis médical. Elles ne sauraient engager la responsabilité de l'éditeur.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero eyebrow="Protection des données" title="Politique de confidentialité" />
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#6B5E52]/70 text-base italic mb-3">Dernière mise à jour : juin 2026.</p>

          <h2 className={h2} style={{ ...h2Style, marginTop: 24 }}>Responsable du traitement</h2>
          <p className={para}>
            Le responsable du traitement des données personnelles est <span className={strong}>Aevia WS</span>, éditeur du
            site. Pour toute question, écrivez à <span className={strong}>contact@aevia.io</span>.
          </p>

          <h2 className={h2} style={h2Style}>Données collectées</h2>
          <p className={para}>
            Nous collectons uniquement les données que vous nous transmettez volontairement via les formulaires de
            réservation et de contact (nom, email, téléphone, soin souhaité, message), aux seules fins de traiter votre demande.
          </p>

          <h2 className={h2} style={h2Style}>Finalité et base légale</h2>
          <p className={para}>
            Vos données sont traitées sur la base de votre consentement et de l'intérêt légitime du spa à répondre à vos
            sollicitations. Elles ne font l'objet d'aucune cession à des tiers à des fins commerciales.
          </p>

          <h2 className={h2} style={h2Style}>Durée de conservation</h2>
          <p className={para}>
            Les données issues des formulaires sont conservées le temps nécessaire au traitement de votre demande, puis
            archivées ou supprimées conformément aux obligations légales applicables.
          </p>

          <h2 className={h2} style={h2Style}>Vos droits</h2>
          <p className={para}>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et
            d'opposition au traitement de vos données. Pour exercer ces droits, écrivez à contact@aevia.io.
          </p>

          <h2 className={h2} style={h2Style}>Cookies</h2>
          <p className={para}>
            Ce site ne dépose pas de cookies de suivi publicitaire. Seuls des cookies techniques strictement nécessaires
            au fonctionnement du site peuvent être utilisés.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function AuraWellnessPage() {
  useFonts();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRitual, setActiveRitual] = useState("restore");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // ── Multi-page nav state (additive) ──
  const [page, setPage] = useState<AuraPage>("home");
  const [openSoin, setOpenSoin] = useState<string | null>(null);
  const [blogSlug, setBlogSlug] = useState<string | null>(null);

  const goTo = (p: AuraPage) => {
    setPage(p);
    setOpenSoin(null);
    setBlogSlug(null);
    setMobileOpen(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  };

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
          <button onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer">
            <Leaf className="w-5 h-5 text-[#7C9E87]" />
            <span className="text-[#2C2820] tracking-widest text-sm uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
              Aura Wellness
            </span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-[#2C2820]/70 text-sm tracking-wide">
            {NAV_PAGES.map((item) => (
              <button
                key={item.key}
                onClick={() => goTo(item.key)}
                className={`transition-colors duration-200 cursor-pointer ${
                  page === item.key ? "text-[#7C9E87]" : "hover:text-[#7C9E87]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => goTo("reservation")}
            className="hidden md:inline-flex items-center gap-2 bg-[#7C9E87] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer"
          >
            Réserver
          </button>
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
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#2C2820] tracking-widest text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Aura Wellness
              </span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer">
                <X className="w-6 h-6 text-[#2C2820]" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {NAV_PAGES.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <button
                    className={`text-3xl cursor-pointer text-left ${page === item.key ? "text-[#7C9E87]" : "text-[#2C2820]"}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    onClick={() => goTo(item.key)}
                  >
                    {item.label}
                  </button>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-3 pt-8 text-sm text-[#6B5E52]">
              <button onClick={() => goTo("mentions")} className="text-left cursor-pointer hover:text-[#7C9E87] transition-colors">Mentions légales</button>
              <button onClick={() => goTo("privacy")} className="text-left cursor-pointer hover:text-[#7C9E87] transition-colors">Confidentialité</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ HOME (original single-page content, unchanged) ══════════ */}
      {page === "home" && (
      <>
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
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
            >
              Retrouver<br />
              <em>l'essentiel</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/80 text-lg max-w-lg mb-10 leading-relaxed">
              Un sanctuaire de soins botaniques et de rituels ancestraux pour celles et ceux qui cherchent à s'ancrer, se restaurer, s'éveiller.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer">
                Découvrir les rituels
              </button>
              <button className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-white/30 transition-colors duration-200 cursor-pointer">
                Visiter l'espace
              </button>
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
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <Reveal>
          <p
            className="text-[#2C2820] text-3xl md:text-5xl leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            "Le soin n'est pas un luxe.<br />C'est <em>un acte de retour à soi.</em>"
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[#6B5E52] text-base max-w-2xl mx-auto leading-relaxed">
            Fondé en 2014, Aura Wellness propose des soins conçus à partir d'ingrédients botaniques traçables, administrés par des thérapeutes formés aux traditions ayurvédiques, taoïstes et méditerranéennes.
          </p>
        </Reveal>
      </section>

      {/* Rituals */}
      <section className="py-20 px-6 bg-[#EDE9E2]">
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
                  <button className="flex items-center gap-2 bg-[#2C2820] text-white px-6 py-3 rounded-xl text-sm hover:bg-[#3D3830] transition-colors duration-200 cursor-pointer">
                    Réserver <ArrowRight className="w-4 h-4" />
                  </button>
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
      <section ref={amenitiesRef} className="py-24 px-6 overflow-hidden">
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
      <section className="py-24 px-6 bg-[#2C2820]">
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
      <section className="py-24 px-6 bg-[#EDE9E2]">
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
      <section className="py-24 px-6 bg-[#7C9E87]">
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

      {/* Booking CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-[#2C2820] rounded-3xl p-10 md:p-16 text-center">
              <Leaf className="w-8 h-8 text-[#7C9E87] mx-auto mb-6" />
              <h2
                className="text-white text-4xl md:text-5xl mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                Votre rituel vous attend
              </h2>
              <p className="text-white/60 max-w-lg mx-auto leading-relaxed mb-10">
                Réservez en ligne en quelques secondes. Nos conseillers sont disponibles pour vous guider vers le rituel qui vous correspond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#7C9E87] text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-[#6A8D75] transition-colors duration-200 cursor-pointer">
                  Réserver en ligne
                </button>
                <button className="border border-white/20 text-white px-8 py-4 rounded-xl text-sm tracking-wide hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> +33 5 56 00 00 00
                </button>
              </div>
              <p className="text-white/30 text-xs mt-8">Annulation gratuite jusqu'à 48h avant votre réservation</p>
            </div>
          </Reveal>
        </div>
      </section>
      </>
      )}

      {/* ══════════ EXTRA PAGES (theme-native, built from the same tokens) ══════════ */}
      {page === "soins" && <SoinsPage openSoin={openSoin} setOpenSoin={setOpenSoin} goTo={goTo} />}
      {page === "reservation" && <ReservationPage />}
      {page === "blog" && <BlogPage blogSlug={blogSlug} setBlogSlug={setBlogSlug} />}
      {page === "about" && <AboutPage goTo={goTo} />}
      {page === "contact" && <ContactPage />}
      {page === "mentions" && <LegalPage variant="mentions" />}
      {page === "privacy" && <LegalPage variant="privacy" />}

      {/* Footer */}
      <footer className="bg-[#EDE9E2] border-t border-[#D8D0C4] py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-4 h-4 text-[#7C9E87]" />
              <span
                className="text-[#2C2820] text-lg"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Aura Wellness
              </span>
            </div>
            <p className="text-[#6B5E52] text-sm leading-relaxed mb-4">
              Sanctuary de soins botaniques & rituels holistiques. Bordeaux, France.
            </p>
            <div className="space-y-1 text-xs text-[#6B5E52]">
              <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Adresse communiquée sur demande</div>
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> +33 5 56 00 00 00</div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> contact@aurawellness.fr</div>
            </div>
          </div>
          {([
            { title: "Soins", links: [["Deep Restore", "soins"], ["Inner Harmony", "soins"], ["Radiance Renewal", "soins"], ["Cocoon Escape", "soins"], ["Tous les soins", "soins"]] as [string, AuraPage][] },
            { title: "L'Espace", links: [["Le sanctuaire", "about"], ["Notre philosophie", "about"], ["L'équipe", "about"], ["Le blog", "blog"], ["Nous contacter", "contact"]] as [string, AuraPage][] },
            { title: "Informations", links: [["Réserver", "reservation"], ["Contact", "contact"], ["Blog", "blog"], ["Mentions légales", "mentions"], ["Confidentialité", "privacy"]] as [string, AuraPage][] },
          ]).map((col) => (
            <div key={col.title}>
              <h4 className="text-[#2C2820] text-sm font-medium mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([l, target]) => (
                  <li key={l}>
                    <button onClick={() => goTo(target)} className="text-[#6B5E52] text-sm hover:text-[#7C9E87] transition-colors duration-200 cursor-pointer text-left">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-[#D8D0C4] mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#6B5E52]">
          <span>© 2026 Aura Wellness. Tous droits réservés.</span>
          <div className="flex gap-6">
            <button onClick={() => goTo("mentions")} className="hover:text-[#7C9E87] transition-colors cursor-pointer">Mentions légales</button>
            <button onClick={() => goTo("privacy")} className="hover:text-[#7C9E87] transition-colors cursor-pointer">Confidentialité</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
