"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Flame, UtensilsCrossed, Wine, Star, Award, Globe, Mail, MapPin, ChevronRight, ArrowRight, X, Menu, Clock, Phone, Search, ShoppingBag, ChefHat, Beef, Droplets, GlassWater } from "lucide-react";

import "../../premium.css";

/* ==========================================================================
   PAGE NAVIGATION MODEL
   --------------------------------------------------------------------------
   PATTERN (reused from impact-10 / impact-46 / impact-168): a single `page`
   state drives in-page navigation. The original single-page content is rendered
   VERBATIM under page === "home"; every other key renders a theme-native
   sub-page built from the EXACT same design language (Tailwind classes, the
   #050505 / #ff4d00 palette, black uppercase italic typography, the Reveal /
   MagneticBtn helpers). Nav + footer stay OUTSIDE the gate so they appear on
   every page. No new styling is introduced — only the theme's own tokens.
   ========================================================================= */

type EmberPage =
  | "home"
  | "carte"
  | "reservation"
  | "blog"
  | "about"
  | "contact"
  | "mentions"
  | "privacy";

const NAV_PAGES: { key: EmberPage; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "carte", label: "Carte" },
  { key: "reservation", label: "Réservation" },
  { key: "blog", label: "Blog" },
  { key: "about", label: "À propos" },
  { key: "contact", label: "Contact" },
  { key: "mentions", label: "Mentions légales" },
];

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const MENU_HIGHLIGHTS = [
  {
    id: 1,
    name: "Dry-Aged Wagyu",
    category: "Signature",
    price: "$185",
    desc: "45-day dry-aged A5 Wagyu, seared over Japanese white oak charcoal and finished with smoked sea salt.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
  },
  {
    id: 2,
    name: "Smoked Ember Octopus",
    category: "Appetizer",
    price: "$34",
    desc: "Wood-fired octopus tentacle with chorizo emulsion, squid ink tuile, and pickled mustard seeds.",
    img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80",
  },
  {
    id: 3,
    name: "The Ember Cellar Selection",
    category: "Pairing",
    price: "$95",
    desc: "A curated flight of rare vintage reds, hand-selected to complement the intensity of wood-fired smoke.",
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80",
  },
];

const PHILOSOPHY = [
  {
    title: "The Fire Lab",
    desc: "We utilize three distinct wood types—Hickory, Cherry, and Oak—to create a complex smoke profile unique to every cut.",
    icon: Flame,
  },
  {
    title: "Ancestral Sourcing",
    desc: "Our cattle are raised on high-altitude pastures, following ethical farming lineages that span three generations.",
    icon: Beef,
  },
  {
    title: "Culinary Alchemy",
    desc: "Precision temperature control meets raw elemental fire, guided by our Executive Chef's 20-year mastery.",
    icon: ChefHat,
  },
];

const STATS = [
  { label: "Wood Species", value: "3" },
  { label: "Dry Aging Days", value: "45-90" },
  { label: "Michelin Stars", value: "2" },
  { label: "Wine Labels", value: "850+" },
];

/* ── CARTE (full menu) — theme-native FR data ───────────────────────────── */

const CARTE_SECTIONS = [
  {
    id: "entrees",
    label: "Entrées",
    icon: UtensilsCrossed,
    note: "Au feu de bois // Fumées du jour",
    items: [
      { name: "Poulpe Braisé aux Braises", price: "34 €", desc: "Tentacule fumé au bois, émulsion chorizo, tuile à l'encre de seiche, graines de moutarde marinées." },
      { name: "Tartare de Bœuf au Couteau", price: "28 €", desc: "Filet maturé taillé au couteau, jaune d'œuf fumé, câpres, échalote brûlée, huile de braise." },
      { name: "Os à Moelle Rôti", price: "24 €", desc: "Moelle rôtie au charbon de chêne, persillade fumée, pain au levain grillé." },
      { name: "Velouté de Potimarron Fumé", price: "19 €", desc: "Crème de potimarron, huile de noisette torréfiée, éclats de lard séché." },
    ],
  },
  {
    id: "plats",
    label: "Plats",
    icon: Beef,
    note: "Pièces maturées // Cuites sur flamme vive",
    items: [
      { name: "Wagyu A5 Maturé 45 Jours", price: "185 €", desc: "Wagyu A5 maturé à sec, saisi sur charbon de chêne blanc japonais, fleur de sel fumée." },
      { name: "Côte de Bœuf Black Angus", price: "92 €", desc: "Pour deux. Maturation 60 jours, beurre maître d'hôtel à la braise, pommes fondantes." },
      { name: "Filet de Bar de Ligne", price: "46 €", desc: "Bar entier flambé au bois de cerisier, beurre blanc fumé, légumes de saison grillés." },
      { name: "Agneau des Hautes Terres", price: "54 €", desc: "Carré d'agneau rôti à l'âtre, jus court à la sarriette, aubergine confite." },
      { name: "Champignons de Forêt Royaux", price: "38 €", desc: "Cèpes et girolles saisis, polenta crémeuse au parmesan, huile de truffe noire." },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    icon: Flame,
    note: "Flammés à table // Douceurs ardentes",
    items: [
      { name: "Soufflé au Chocolat Fumé", price: "18 €", desc: "Soufflé tiède au chocolat 72 %, glace à la vanille de Tahiti brûlée au chalumeau." },
      { name: "Tarte Tatin à la Braise", price: "16 €", desc: "Pommes caramélisées sur flamme, pâte feuilletée, crème crue de la ferme." },
      { name: "Ananas Rôti au Rhum", price: "15 €", desc: "Ananas flambé au rhum ambré, sorbet coco, éclats de praline fumée." },
    ],
  },
  {
    id: "vins",
    label: "Vins & Cave",
    icon: Wine,
    note: "850+ références // Accords fumés",
    items: [
      { name: "Châteauneuf-du-Pape Rouge", price: "24 € / verre", desc: "Grenache puissant, notes de garrigue et de cuir, accord idéal avec les pièces maturées." },
      { name: "Hermitage Rouge — Grand Cru", price: "180 € / btl", desc: "Syrah septentrionale, profondeur épicée taillée pour la fumée du bois de chêne." },
      { name: "Meursault Premier Cru Blanc", price: "32 € / verre", desc: "Chardonnay beurré et minéral, compagnon des poissons flambés au cerisier." },
      { name: "Flight de la Cave Ember", price: "95 €", desc: "Sélection de trois grands crus rares, accordés à l'intensité de la flamme." },
    ],
  },
];

/* ── BLOG — mock FR articles ─────────────────────────────────────────────── */

const BLOG_POSTS = [
  {
    slug: "art-maturation",
    title: "L'Art de la Maturation à Sec",
    date: "2 juin 2026",
    category: "Gastronomie",
    excerpt:
      "Quarante-cinq jours, parfois quatre-vingt-dix. Plongée dans notre cave de maturation, là où le temps sculpte le goût de la viande.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    body: [
      "La maturation à sec est une discipline de patience. Dans nos chambres à hygrométrie contrôlée, chaque pièce repose à 1°C pendant quarante-cinq à quatre-vingt-dix jours. L'eau s'évapore lentement, les enzymes naturelles attendrissent les fibres, et les arômes se concentrent jusqu'à atteindre une profondeur de noisette et de beurre noisette.",
      "Le secret tient autant dans la circulation de l'air que dans le choix des pièces. Nous ne sélectionnons que des bêtes élevées en pâturage d'altitude, dont le persillé supporte une longue maturation sans se dessécher.",
      "À la coupe, la croûte extérieure est retirée pour révéler un cœur d'un rouge profond. C'est ce cœur, et lui seul, qui rejoint la flamme — pour une expérience que le temps a rendue incomparable.",
    ],
  },
  {
    slug: "accords-fumes",
    title: "Accorder le Vin à la Fumée",
    date: "19 mai 2026",
    category: "Vin",
    excerpt:
      "La fumée du bois change tout. Notre chef sommelier dévoile les principes d'accord entre grands crus et cuisson à l'âtre.",
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80",
    body: [
      "La cuisson au feu de bois imprègne la viande de notes torréfiées et résineuses qui défient les accords classiques. Un vin trop délicat s'efface ; un vin trop tannique écrase le palais déjà sollicité par la fumée.",
      "Notre cave de 850 références s'articule autour d'un principe simple : la fumée appelle la profondeur. Les syrahs septentrionales, les grenaches solaires et les vieux bordeaux trouvent dans le bois de chêne un écho naturel.",
      "Pour les poissons flambés au cerisier, nous osons le grand chardonnay : sa rondeur beurrée enveloppe la fumée plutôt que de la combattre. L'accord n'est jamais une formule — c'est une conversation entre le feu et le terroir.",
    ],
  },
  {
    slug: "portrait-chef",
    title: "Portrait : Vingt Ans de Flamme",
    date: "4 mai 2026",
    category: "Chef",
    excerpt:
      "De l'apprentissage en brigade à la double étoile, le parcours de notre chef exécutif, gardien du laboratoire du feu.",
    img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80",
    body: [
      "Vingt années passées à apprivoiser la flamme. Notre chef exécutif a forgé sa maîtrise dans les plus grandes maisons avant de fonder Ember, avec une obsession : rendre au feu sa noblesse première.",
      "Le laboratoire du feu, comme il l'appelle, repose sur trois bois — hickory, cerisier et chêne — combinés pour composer un profil de fumée unique à chaque cuisson. Rien n'y est laissé au hasard : la densité de la braise, la distance à la flamme, le repos après la saisie.",
      "Sa philosophie tient en une phrase : « Le feu ne se commande pas, il se comprend. » C'est cette compréhension, patiemment acquise, qui a valu à Ember sa seconde étoile.",
    ],
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================= */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MagneticBtn({
  children,
  className = "",
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    },
    [x, y],
  );

  return (
    <motion.button
      ref={ref}
      type={type}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* Shared section header used across the theme-native sub-pages */
function PageHeader({
  kicker,
  title,
  accent,
  sub,
}: {
  kicker: string;
  title: string;
  accent?: string;
  sub?: string;
}) {
  return (
    <Reveal>
      <div className="mb-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff4d00] mb-8 block">
          {kicker}
        </span>
        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] uppercase text-white">
          {title}{" "}
          {accent && <span className="text-[#ff4d00] not-italic">{accent}</span>}
        </h1>
        {sub && (
          <p className="mt-10 max-w-xl text-white/30 text-sm font-light uppercase tracking-widest italic leading-loose">
            {sub}
          </p>
        )}
      </div>
    </Reveal>
  );
}

/* Shared input styling (font-size ≥ 16px enforced inline) */
const FIELD_CLASS =
  "w-full bg-white/[0.02] border border-white/10 rounded-sm px-6 py-4 text-white placeholder:text-white/20 focus:border-[#ff4d00] focus:outline-none transition-colors uppercase tracking-widest";
const LABEL_CLASS =
  "block text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff4d00] mb-4";

/* ==========================================================================
   SUB-PAGE: CARTE (full menu)
   ========================================================================= */

function CartePage() {
  return (
    <section id="hero" className="pt-44 pb-32 px-6 md:px-12 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <PageHeader
          kicker="Manifeste Saisonnier // Été 2026"
          title="La"
          accent="Carte."
          sub="Au feu de bois, chaque jour. Pièces maturées, poissons de ligne et grands crus rares, façonnés par la flamme."
        />

        <div className="space-y-32">
          {CARTE_SECTIONS.map((sec, si) => (
            <Reveal key={sec.id} delay={si * 0.05}>
              <div>
                <div className="flex items-end justify-between mb-14 gap-8 border-b border-white/5 pb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#ff4d00]">
                      <sec.icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
                      {sec.label}
                    </h2>
                  </div>
                  <span className="hidden md:block text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                    {sec.note}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
                  {sec.items.map((item, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-baseline gap-6 mb-3">
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic group-hover:text-[#ff4d00] transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex-1 mx-2 border-b border-dotted border-white/10 translate-y-[-4px]" />
                        <span className="text-lg font-black text-[#ff4d00] tracking-tighter whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-sm text-white/30 font-light leading-relaxed uppercase tracking-widest italic leading-loose">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-24 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
            Prix nets, service compris // Liste des allergènes communiquée sur demande
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   SUB-PAGE: RÉSERVATION
   ========================================================================= */

function ReservationPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="pt-44 pb-32 px-6 md:px-12 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <PageHeader
          kicker="Réserver une table"
          title="Votre"
          accent="Table."
          sub="Le service se déroule du mardi au samedi. Réservation conseillée pour la salle du feu et les dîners privés."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Form */}
          <Reveal>
            <div className="lg:col-span-7">
              {sent ? (
                <div className="p-16 border border-[#ff4d00]/30 bg-[#ff4d00]/5 rounded-sm">
                  <Flame className="w-10 h-10 text-[#ff4d00] mb-8" />
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
                    Demande Reçue.
                  </h3>
                  <p className="text-sm text-white/40 font-light uppercase tracking-widest italic leading-loose">
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
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div>
                      <label className={LABEL_CLASS}>Date</label>
                      <input
                        type="date"
                        required
                        style={{ fontSize: 16 }}
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Heure</label>
                      <input
                        type="time"
                        required
                        style={{ fontSize: 16 }}
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Couverts</label>
                      <select
                        required
                        defaultValue=""
                        style={{ fontSize: 16 }}
                        className={`${FIELD_CLASS} appearance-none`}
                      >
                        <option value="" disabled className="bg-[#0a0a0a]">
                          —
                        </option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n} className="bg-[#0a0a0a]">
                            {n} {n > 1 ? "personnes" : "personne"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLASS}>Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      style={{ fontSize: 16 }}
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className={LABEL_CLASS}>Téléphone</label>
                      <input
                        type="tel"
                        required
                        placeholder="06 00 00 00 00"
                        style={{ fontSize: 16 }}
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Email</label>
                      <input
                        type="email"
                        required
                        placeholder="vous@email.com"
                        style={{ fontSize: 16 }}
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLASS}>Demande particulière</label>
                    <textarea
                      rows={4}
                      placeholder="Allergies, occasion, table au feu…"
                      style={{ fontSize: 16 }}
                      className={`${FIELD_CLASS} resize-none`}
                    />
                  </div>

                  <MagneticBtn
                    type="submit"
                    className="px-14 py-6 bg-[#ff4d00] text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-105 transition-all cursor-pointer shadow-[0_0_40px_rgba(255,77,0,0.3)]"
                  >
                    Demander la réservation
                  </MagneticBtn>
                </form>
              )}
            </div>
          </Reveal>

          {/* Practical info */}
          <Reveal delay={0.15}>
            <div className="lg:col-span-5 space-y-12">
              <div className="p-12 border border-white/5 bg-white/[0.01] rounded-sm">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff4d00] mb-8 block">
                  Horaires
                </span>
                <ul className="space-y-6 text-[11px] font-bold uppercase tracking-widest text-white/40">
                  <li className="flex justify-between gap-6">
                    <span>Mardi – Jeudi</span>
                    <span className="text-white">19h00 – 22h30</span>
                  </li>
                  <li className="flex justify-between gap-6">
                    <span>Vendredi – Samedi</span>
                    <span className="text-white">19h00 – 23h30</span>
                  </li>
                  <li className="flex justify-between gap-6">
                    <span>Dimanche – Lundi</span>
                    <span className="text-white/20">Fermé</span>
                  </li>
                </ul>
              </div>

              <div className="p-12 border border-white/5 bg-white/[0.01] rounded-sm space-y-8">
                <div className="flex items-center gap-4 text-white/40 text-[11px] font-bold uppercase tracking-widest">
                  <Phone className="w-5 h-5 text-[#ff4d00]" /> 01 23 45 67 89
                </div>
                <div className="flex items-center gap-4 text-white/40 text-[11px] font-bold uppercase tracking-widest">
                  <Mail className="w-5 h-5 text-[#ff4d00]" /> contact@aevia.io
                </div>
                <div className="flex items-center gap-4 text-white/40 text-[11px] font-bold uppercase tracking-widest">
                  <MapPin className="w-5 h-5 text-[#ff4d00]" /> Adresse communiquée
                  sur demande
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SUB-PAGE: BLOG (index + single)
   ========================================================================= */

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
      <article className="pt-44 pb-32 px-6 md:px-12 min-h-screen">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <button
              onClick={() => setSlug(null)}
              className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff4d00] hover:gap-5 transition-all mb-16"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Retour au journal
            </button>
            <Badge className="bg-[#ff4d00]/10 text-[#ff4d00] border border-[#ff4d00]/30 text-[10px] font-bold uppercase tracking-[0.4em] mb-8 px-4 py-1.5 rounded-full">
              {post.category} // {post.date}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.85] uppercase text-white mb-12">
              {post.title}
            </h1>
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm mb-16 border border-white/5">
              <Image
                src={post.img}
                alt={post.title}
                fill
                className="object-cover contrast-125 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-8">
              {post.body.map((para, i) => (
                <p
                  key={i}
                  className="text-base md:text-lg text-white/50 font-light leading-relaxed italic"
                >
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </article>
    );
  }

  return (
    <section className="pt-44 pb-32 px-6 md:px-12 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <PageHeader
          kicker="Le Journal Ember"
          title="Le"
          accent="Feu."
          sub="Récits de gastronomie, de vin et de flamme. Les coulisses du laboratoire du feu."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {BLOG_POSTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <div
                onClick={() => setSlug(p.slug)}
                className="group cursor-pointer space-y-8"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-[1s]">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-[#050505]/40 group-hover:bg-transparent transition-colors duration-700" />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                      {p.category}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff4d00]">
                    {p.date}
                  </span>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic group-hover:text-[#ff4d00] transition-colors leading-none">
                    {p.title}
                  </h3>
                  <p className="text-sm text-white/30 font-light leading-relaxed uppercase tracking-widest italic leading-loose">
                    {p.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff4d00] group-hover:gap-5 transition-all pt-2">
                    Lire l'article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SUB-PAGE: À PROPOS
   ========================================================================= */

function AboutPage({ goTo }: { goTo: (p: EmberPage) => void }) {
  return (
    <section className="pt-44 pb-32 px-6 md:px-12 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <PageHeader
          kicker="La Maison"
          title="Notre"
          accent="Histoire."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-40">
          <Reveal>
            <div className="relative aspect-square rounded-sm overflow-hidden group border border-white/5">
              <Image
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80"
                alt="Le Chef au feu"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-[2s] contrast-125 grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="space-y-8 text-white/40 text-lg leading-relaxed font-light italic">
              <p>
                Ember est né d'une obsession : rendre au feu sa noblesse première.
                Là où la cuisine moderne multiplie les techniques, nous revenons à
                l'élément le plus ancien — le bois, la flamme, la braise.
              </p>
              <p>
                Notre chef exécutif a forgé sa maîtrise pendant vingt ans dans les
                plus grandes maisons avant de fonder Ember. Son laboratoire du feu
                combine trois bois — hickory, cerisier et chêne — pour composer un
                profil de fumée unique à chaque cuisson.
              </p>
              <p>
                Deux étoiles Michelin plus tard, notre exigence reste intacte : des
                pièces maturées avec patience, une cave de plus de 850 références, et
                le respect absolu du produit, de l'éleveur à l'assiette.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="text-center mb-24">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff4d00] mb-8 block">
              Nos Valeurs
            </span>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white">
              Feu. <span className="text-[#ff4d00] not-italic">Temps.</span>{" "}
              Produit.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-32">
          {PHILOSOPHY.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-16 border border-white/5 bg-white/[0.01] hover:border-[#ff4d00]/30 transition-all group h-full flex flex-col">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#ff4d00] mb-10 group-hover:bg-[#ff4d00] group-hover:text-white transition-all duration-500">
                  <s.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white">
                  {s.title}
                </h3>
                <p className="text-sm text-white/30 font-light leading-relaxed flex-1 tracking-wide uppercase italic leading-loose">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="text-center">
            <MagneticBtn
              onClick={() => goTo("reservation")}
              className="px-14 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-[#ff4d00] hover:text-white transition-all shadow-2xl"
            >
              Réserver une table
            </MagneticBtn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   SUB-PAGE: CONTACT
   ========================================================================= */

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="pt-44 pb-32 px-6 md:px-12 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <PageHeader
          kicker="Nous Joindre"
          title="Prenez"
          accent="Contact."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <Reveal>
            <div className="lg:col-span-5 space-y-12">
              <div className="p-12 border border-white/5 bg-white/[0.01] rounded-sm space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[#ff4d00]">
                    <MapPin className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                      Adresse
                    </span>
                  </div>
                  <p className="text-sm text-white/40 font-light uppercase tracking-widest italic leading-loose">
                    Adresse communiquée sur demande à contact@aevia.io
                  </p>
                </div>
                <Separator className="bg-white/5" />
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[#ff4d00]">
                    <Phone className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                      Téléphone
                    </span>
                  </div>
                  <p className="text-sm text-white/40 font-light uppercase tracking-widest italic">
                    01 23 45 67 89
                  </p>
                </div>
                <Separator className="bg-white/5" />
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[#ff4d00]">
                    <Mail className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                      Email
                    </span>
                  </div>
                  <p className="text-sm text-white/40 font-light uppercase tracking-widest italic">
                    contact@aevia.io
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="lg:col-span-7">
              {sent ? (
                <div className="p-16 border border-[#ff4d00]/30 bg-[#ff4d00]/5 rounded-sm">
                  <Mail className="w-10 h-10 text-[#ff4d00] mb-8" />
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
                    Message Envoyé.
                  </h3>
                  <p className="text-sm text-white/40 font-light uppercase tracking-widest italic leading-loose">
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
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className={LABEL_CLASS}>Nom</label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom"
                        style={{ fontSize: 16 }}
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Email</label>
                      <input
                        type="email"
                        required
                        placeholder="vous@email.com"
                        style={{ fontSize: 16 }}
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Sujet</label>
                    <input
                      type="text"
                      placeholder="Objet de votre message"
                      style={{ fontSize: 16 }}
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Message</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Votre message…"
                      style={{ fontSize: 16 }}
                      className={`${FIELD_CLASS} resize-none`}
                    />
                  </div>
                  <MagneticBtn
                    type="submit"
                    className="px-14 py-6 bg-[#ff4d00] text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-105 transition-all cursor-pointer shadow-[0_0_40px_rgba(255,77,0,0.3)]"
                  >
                    Envoyer le message
                  </MagneticBtn>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SUB-PAGE: LEGAL (Mentions légales / Confidentialité)
   ========================================================================= */

function LegalPage({ variant }: { variant: "mentions" | "privacy" }) {
  const isMentions = variant === "mentions";
  return (
    <section className="pt-44 pb-32 px-6 md:px-12 min-h-screen">
      <div className="max-w-[900px] mx-auto">
        <PageHeader
          kicker="Informations Légales"
          title={isMentions ? "Mentions" : "Confiden-"}
          accent={isMentions ? "Légales." : "tialité."}
        />

        <div className="space-y-12">
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
                Vos données sont conservées le temps nécessaire au traitement de votre
                demande, puis archivées ou supprimées conformément aux durées légales
                en vigueur.
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

function LegalBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="border-b border-white/5 pb-10">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#ff4d00] mb-5">
          {title}
        </h2>
        <p className="text-base md:text-lg text-white/50 font-light leading-relaxed italic">
          {children}
        </p>
      </div>
    </Reveal>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================= */

import { useRouter } from "next/navigation";

export default function EmberGrillPage() {
  const router = useRouter();
  const [page, setPage] = useState<EmberPage>("about");
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDish, setActiveDish] = useState<number | null>(null);

  const goTo = useCallback((p: EmberPage) => {
    setMenuOpen(false);
    if (p === "home") {
      router.push("/templates/impact-99");
    } else {
      router.push(`/templates/impact-99/${p}`);
    }
  }, [router]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#050505] text-[#dcdcdc] font-sans selection:bg-[#ff4d00] selection:text-white overflow-x-hidden">
      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled || page !== "home" ? "bg-[#050505]/95 backdrop-blur-2xl py-4 border-b border-white/5" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <button
            onClick={() => goTo("home")}
            className="group flex flex-col items-center cursor-pointer"
          >
            <span className="text-3xl font-black tracking-[-0.05em] uppercase leading-none italic text-white">
              Ember
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-[#ff4d00] -mt-1 ml-1">
              Grill & Cellar
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {NAV_PAGES.map((link) => (
              <button
                key={link.key}
                onClick={() => goTo(link.key)}
                className={`transition-colors cursor-pointer ${page === link.key ? "text-[#ff4d00]" : "hover:text-[#ff4d00]"}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => goTo("reservation")}
              className="hidden md:flex items-center gap-3 group"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-[#ff4d00] transition-colors">
                Réserver
              </span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#ff4d00] group-hover:text-white group-hover:border-[#ff4d00] transition-all">
                <Clock className="w-4 h-4" />
              </div>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-[#ff4d00]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[100] bg-[#050505] p-12 flex flex-col justify-center gap-6 overflow-y-auto"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-[#ff4d00]"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-5 text-4xl font-black italic uppercase">
              {NAV_PAGES.map((l) => (
                <button
                  key={l.key}
                  onClick={() => goTo(l.key)}
                  className={`text-left transition-colors ${page === l.key ? "text-[#ff4d00]" : "text-white/15 hover:text-[#ff4d00]"}`}
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => goTo("privacy")}
                className={`text-left transition-colors ${page === "privacy" ? "text-[#ff4d00]" : "text-white/15 hover:text-[#ff4d00]"}`}
              >
                Confidentialité
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ HOME (original single-page content, unchanged) ══════════ */}
      {page === "home" && (
        <>
          {/* ── HERO ── */}
          <section id="about" className="relative h-[100svh] flex items-center overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=80"
                alt="Fire & Smoke"
                fill
                className="object-cover opacity-50 contrast-125"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-[#050505]" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full">
              <Reveal>
                <Badge className="bg-[#ff4d00]/10 text-[#ff4d00] border border-[#ff4d00]/30 text-[10px] font-bold uppercase tracking-[0.5em] mb-10 px-4 py-1.5 rounded-full">
                  Awarded Two Michelin Stars // 2024
                </Badge>
                <h1 className="text-8xl md:text-[14rem] font-black leading-[0.75] tracking-tighter mb-12 uppercase text-white italic">
                  Primitive <br />{" "}
                  <span className="text-[#ff4d00] not-italic">Refinement.</span>
                </h1>
                <p className="max-w-md text-xl text-white/50 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Where wood-fired alchemy meets contemporary culinary precision.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <MagneticBtn
                    onClick={() => goTo("carte")}
                    className="px-12 py-5 bg-[#ff4d00] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all cursor-pointer shadow-[0_0_40px_rgba(255,77,0,0.3)]"
                  >
                    Explore The Menu
                  </MagneticBtn>
                  <button
                    onClick={() => goTo("about")}
                    className="px-12 py-5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                  >
                    Our Philosophy <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20 animate-bounce">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Scroll
              </span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#ff4d00] to-transparent" />
            </div>
          </section>

          {/* ── STATS SECTION ── */}
          <section className="py-24 border-y border-white/5 bg-[#0a0a0a]">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {STATS.map((stat, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="text-center md:text-left">
                      <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff4d00] mb-2">
                        {stat.label}
                      </div>
                      <div className="text-5xl font-black italic text-white">
                        {stat.value}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── THE MENU ── */}
          <section id="menu" className="py-32 px-6 md:px-12">
            <div className="max-w-[1600px] mx-auto">
              <Reveal>
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                  <div>
                    <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6 uppercase text-white">
                      The <br /> <span className="text-[#ff4d00]">Cuts.</span>
                    </h2>
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                      Seasonal Manifest // Wood-Fired Daily // Summer 2024
                    </p>
                  </div>
                  <button
                    onClick={() => goTo("carte")}
                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff4d00] border-b border-[#ff4d00] pb-2 hover:text-white hover:border-white transition-all"
                  >
                    View Full Wine List
                  </button>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {MENU_HIGHLIGHTS.map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.1}>
                    <div
                      className="group space-y-10 cursor-pointer"
                      onMouseEnter={() => setActiveDish(item.id)}
                      onMouseLeave={() => setActiveDish(null)}
                      onClick={() => goTo("carte")}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-[1s]">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-[2s] group-hover:scale-125"
                        />
                        <div className="absolute inset-0 bg-[#050505]/40 group-hover:bg-transparent transition-colors duration-700" />

                        <div className="absolute top-6 left-6">
                          <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                            {item.category}
                          </Badge>
                        </div>

                        <AnimatePresence>
                          {activeDish === item.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex items-center justify-center bg-[#ff4d00]/10 backdrop-blur-[2px]"
                            >
                              <span className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                View Provenance
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic group-hover:text-[#ff4d00] transition-colors">
                            {item.name}
                          </h3>
                          <span className="text-lg font-black text-[#ff4d00] tracking-tighter">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-sm text-white/30 font-light leading-relaxed uppercase tracking-widest italic leading-loose">
                          {item.desc}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="h-[1px] flex-1 bg-white/5" />
                          <Flame className="w-5 h-5 text-white/10 group-hover:text-[#ff4d00] transition-all" />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── FIRE PHILOSOPHY ── */}
          <section id="contact" className="py-40 bg-[#0a0a0a] overflow-hidden relative border-t border-white/5">
            <div className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] bg-[#ff4d00]/5 blur-[120px] rounded-full" />
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
              <Reveal>
                <div className="text-center mb-32">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff4d00] mb-8 block">
                    The Fire Lab
                  </span>
                  <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">
                    Elemental{" "}
                    <span className="text-[#ff4d00] not-italic">Mastery.</span>
                  </h2>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {PHILOSOPHY.map((s, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="p-16 border border-white/5 bg-white/[0.01] hover:border-[#ff4d00]/30 transition-all group h-full flex flex-col relative overflow-hidden">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#ff4d00] mb-10 group-hover:bg-[#ff4d00] group-hover:text-white transition-all duration-500">
                        <s.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white group-hover:translate-x-2 transition-transform">
                        {s.title}
                      </h3>
                      <p className="text-sm text-white/30 font-light leading-relaxed mb-12 flex-1 tracking-wide uppercase italic leading-loose">
                        {s.desc}
                      </p>
                      <button
                        onClick={() => goTo("about")}
                        className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff4d00] group-hover:gap-6 transition-all"
                      >
                        Sourcing Integrity <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── THE CELLAR ── */}
          <section className="py-40 px-6 md:px-12 bg-black">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <Reveal>
                <div className="relative aspect-square rounded-sm overflow-hidden group border border-white/5">
                  <Image
                    src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80"
                    alt="Wine Cellar"
                    fill
                    className="object-cover group-hover:scale-110 transition-all duration-[2s] contrast-125 grayscale hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-16 left-16 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block text-[#ff4d00]">
                      The Cellar
                    </span>
                    <h4 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                      Rare Vintages. <br /> Smoked Pairings.
                    </h4>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff4d00] mb-8 block">
                  The Experience
                </span>
                <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-12 uppercase text-white">
                  Deep <br />{" "}
                  <span className="text-[#ff4d00] not-italic">Immersion.</span>
                </h2>
                <p className="text-white/40 text-xl leading-relaxed mb-16 font-light uppercase tracking-wide italic">
                  Beyond the palate. We design sensory journeys that merge the
                  primal intensity of wood-smoke with the delicate complexity of
                  world-class viticulture.
                </p>
                <div className="grid grid-cols-2 gap-12">
                  {[
                    { icon: Wine, label: "Cellar_Master", desc: "Rare vintages" },
                    {
                      icon: UtensilsCrossed,
                      label: "Private_Chef",
                      desc: "Bespoke menu",
                    },
                    { icon: Droplets, label: "Dry_Aging", desc: "Internal lab" },
                    { icon: Star, label: "Michelin", desc: "2-Star rated" },
                  ].map((val, i) => (
                    <div key={i} className="space-y-4">
                      <val.icon className="w-6 h-6 text-[#ff4d00]" />
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-white">
                        {val.label}
                      </h4>
                      <p className="text-[10px] font-light text-white/30 uppercase tracking-widest leading-loose">
                        {val.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <MagneticBtn
                  onClick={() => goTo("reservation")}
                  className="mt-20 px-14 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-[#ff4d00] hover:text-white transition-all shadow-2xl"
                >
                  Request Private Dining
                </MagneticBtn>
              </Reveal>
            </div>
          </section>
        </>
      )}

      {/* ══════════ THEME-NATIVE SUB-PAGES ══════════ */}
      {page === "carte" && <CartePage />}
      {page === "reservation" && <ReservationPage />}
      {page === "blog" && <BlogPage slug={blogSlug} setSlug={setBlogSlug} />}
      {page === "about" && <AboutPage goTo={goTo} />}
      {page === "contact" && <ContactPage />}
      {page === "mentions" && <LegalPage variant="mentions" />}
      {page === "privacy" && <LegalPage variant="privacy" />}

      {/* ── FOOTER ── */}
      <footer className="bg-[#050505] pt-40 pb-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-32 mb-40">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex flex-col mb-12">
                <span className="text-5xl font-black tracking-[-0.05em] uppercase leading-none italic text-white">
                  Ember
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff4d00] -mt-1 ml-1">
                  Grill & Cellar
                </span>
              </div>
              <p className="text-white/20 max-w-md mb-16 text-[11px] font-bold uppercase tracking-[0.2em] leading-loose italic">
                The primal alchemy of wood, fire, and time. An uncompromising
                pursuit of culinary intensity.
              </p>
              <div className="flex gap-6">
                {[Globe, Globe, Mail].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#ff4d00] hover:text-white hover:border-[#ff4d00] transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#ff4d00] mb-12">
              Cuisine
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <button onClick={() => goTo("carte")} className="hover:text-white transition-colors">
                  La_Carte
                </button>
              </li>
              <li>
                <button onClick={() => goTo("carte")} className="hover:text-white transition-colors">
                  Wine_Archive
                </button>
              </li>
              <li>
                <button onClick={() => goTo("about")} className="hover:text-white transition-colors">
                  Dry_Aging_Program
                </button>
              </li>
              <li>
                <button onClick={() => goTo("about")} className="hover:text-white transition-colors">
                  Provenance
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#ff4d00] mb-12">
              Experience
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <button onClick={() => goTo("reservation")} className="hover:text-white transition-colors">
                  Réservation
                </button>
              </li>
              <li>
                <button onClick={() => goTo("blog")} className="hover:text-white transition-colors">
                  Le_Journal
                </button>
              </li>
              <li>
                <button onClick={() => goTo("about")} className="hover:text-white transition-colors">
                  À_Propos
                </button>
              </li>
              <li>
                <button onClick={() => goTo("contact")} className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#ff4d00] mb-12">
              Studio
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <button onClick={() => goTo("about")} className="hover:text-white transition-colors">
                  The_Maison
                </button>
              </li>
              <li>
                <button onClick={() => goTo("contact")} className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => goTo("mentions")} className="hover:text-white transition-colors">
                  Mentions_Légales
                </button>
              </li>
              <li>
                <button onClick={() => goTo("privacy")} className="hover:text-white transition-colors">
                  Confidentialité
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
          <div className="flex items-center gap-12">
            <span>
              &copy; {new Date().getFullYear()} EMBER GRILL & CELLAR GROUP.
            </span>
            <div className="flex gap-8">
              <span>USDA_PRIME_CERTIFIED</span>
              <span>WINE_SPECTATOR_GRAND_AWARD</span>
            </div>
          </div>
          <div className="flex gap-12 font-mono">
            <span>TEMP_22.5C</span>
            <span>SMOKE_DENSITY_NOMINAL</span>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#050505}
        ::-webkit-scrollbar-thumb{background:#ff4d00}
      `}</style>
    </div>
  );
}
