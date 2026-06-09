// @ts-nocheck
"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight, Menu, Star, Clock, Award, Play, MapPin, Phone, Mail,
  Camera, Grape, Map, Droplets, Sun, CheckCircle2, Globe, ShoppingCart,
  Plus, Minus, Users, Calendar, ChevronRight, Leaf, Thermometer
} from "lucide-react"

// ─── PAGE TYPE ───────────────────────────────────────────────────────────────
type DomainePage = "home" | "vins" | "terroir" | "visite" | "commande" | "contact" | "mentions" | "privacy"

// ─── REVEAL COMPONENT ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "1789", label: "Fondation", suffix: "" },
  { value: "45", label: "Hectares de Vignes", suffix: "Ha" },
  { value: "1er", label: "Grand Cru Classé", suffix: "" },
  { value: "24", label: "Mois d'Élevage", suffix: "m" },
  { value: "12", label: "Générations", suffix: "" },
]

const FEATURES = [
  {
    id: "terroir",
    title: "Le Terroir",
    icon: <Map className="w-6 h-6" />,
    description: "Niché au cœur de Margaux, notre vignoble repose sur des croupes de graves profondes. Ce sol exceptionnel, pauvre et bien drainé, oblige la vigne à s'enraciner profondément, offrant à nos vins leur élégance légendaire.",
    bullets: [
      "Graves garonnaises du quaternaire",
      "Sous-sol argilo-calcaire",
      "Micro-climat exceptionnel",
      "Rendements naturellement limités"
    ],
    image: "https://images.unsplash.com/photo-1474623809196-26b4a6764487?w=800&q=80&fit=crop"
  },
  {
    id: "vinification",
    title: "La Vinification",
    icon: <Grape className="w-6 h-6" />,
    description: "Une approche respectueuse où la technologie sert la tradition. La vendange, entièrement manuelle, est triée grain par grain avant une fermentation parcellaire en cuves tronconiques bois.",
    bullets: [
      "Vendanges 100% manuelles",
      "Tri optique de haute précision",
      "Extraction douce et lente",
      "Zéro intrant de synthèse"
    ],
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80&fit=crop"
  },
  {
    id: "elevage",
    title: "L'Élevage en Barrique",
    icon: <Clock className="w-6 h-6" />,
    description: "Dans le silence de nos chais souterrains, le vin repose pendant 18 à 24 mois. Nous utilisons exclusivement des barriques de chêne français à grain fin, renouvelées selon la puissance du millésime.",
    bullets: [
      "Chêne des forêts de Tronçais",
      "Chauffe moyenne sur mesure",
      "Soutirage traditionnel à la bougie",
      "Collage au blanc d'œuf frais"
    ],
    image: "https://images.unsplash.com/photo-1596404495574-8b15d9a941ea?w=800&q=80&fit=crop"
  }
]

const TESTIMONIALS = [
  {
    name: "Jean-Marc Quarin",
    role: "Critique Indépendant",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    content: "Le Château Vestige 2026 redéfinit l'élégance de l'appellation. Une texture de velours qui enveloppe un fruit d'une pureté saisissante. Magistral.",
    rating: 5,
    score: "98/100"
  },
  {
    name: "Jancis Robinson",
    role: "Master of Wine",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    content: "Un vin d'une aristocratie naturelle. Les tanins sont d'une finesse incomparable, promettant une garde de plusieurs décennies.",
    rating: 5,
    score: "19/20"
  },
  {
    name: "Robert Parker",
    role: "The Wine Advocate",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    content: "Probablement le plus grand millésime produit par la propriété depuis 1982. La complexité aromatique est vertigineuse.",
    rating: 5,
    score: "99/100"
  },
  {
    name: "Antonio Galloni",
    role: "Vinous",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    content: "L'assemblage est d'une symétrie parfaite. Le Cabernet Sauvignon y dicte sa structure avec une grâce souveraine.",
    rating: 5,
    score: "97/100"
  }
]

const FAQS = [
  {
    question: "Comment garantissez-vous l'authenticité des bouteilles ?",
    answer: "Depuis le millésime 2022, chaque bouteille de Château Vestige est équipée d'une puce NFC intégrée sous l'étiquette et d'un scellé holographique sur la capsule. En scannant la puce avec votre smartphone, vous accédez à la blockchain vérifiant la provenance de la bouteille."
  },
  {
    question: "Est-il possible de visiter le domaine et les chais ?",
    answer: "Nous accueillons les amateurs sur rendez-vous uniquement. La visite privée comprend la découverte du vignoble, l'explication de notre cuvier gravitaire, le passage dans nos chais souterrains et s'achève par une dégustation de 3 millésimes. Veuillez contacter la conciergerie."
  },
  {
    question: "Quelles sont vos pratiques environnementales ?",
    answer: "Le Château Vestige est certifié HVE 3 et en conversion vers la biodynamie. Nous pratiquons l'enherbement naturel, la confusion sexuelle pour limiter les traitements, et entretenons plusieurs hectares de biodiversité (forêts, haies) autour du vignoble."
  },
  {
    question: "Puis-je faire conserver mes vins directement au Château ?",
    answer: "Oui, les membres du Club Privilège bénéficient d'un espace dédié dans nos caves historiques. L'hygrométrie (80%) et la température (13°C) y sont parfaites et constantes."
  },
  {
    question: "Comment expédiez-vous les vins à l'international ?",
    answer: "Nous utilisons exclusivement des transporteurs spécialisés. Les vins voyagent dans des caisses isolées thermiquement, par voie aérienne avec contrôle continu de la température. Toutes les expéditions sont couvertes par notre assurance."
  },
  {
    question: "Quand dois-je boire mon Grand Vin ?",
    answer: "Un Grand Vin du Château Vestige requiert généralement 10 à 15 ans de garde pour que ses tanins se fondent. Les très grands millésimes peuvent aisément traverser 50 ans ou plus. Consultez notre charte des millésimes pour nos recommandations précises."
  }
]

const WINES = [
  {
    id: "grand-vin",
    name: "Château Vestige",
    subtitle: "Grand Vin du Domaine",
    appellation: "Margaux AOC — 1er Grand Cru Classé",
    millesimes: ["2019", "2018", "2016"],
    price: 480,
    priceRange: "420 – 480 €",
    cepages: "Cabernet Sauvignon 80%, Merlot 15%, Petit Verdot 5%",
    robe: "Robe grenat profond aux reflets pourpres",
    nez: "Cassis, violette, tabac blond, notes de cèdre et de sous-bois",
    bouche: "Tanins soyeux et précis, finale longue et minérale",
    service: "17–18°C",
    garde: "20–25 ans et au-delà",
    image: "https://images.unsplash.com/photo-1474623809196-26b4a6764487?w=800&q=80&fit=crop",
    badge: "Signature"
  },
  {
    id: "second-vin",
    name: "L'Héritier de Vestige",
    subtitle: "Second Vin",
    appellation: "Margaux AOC",
    millesimes: ["2020", "2019"],
    price: 85,
    priceRange: "85 €",
    cepages: "Merlot 60%, Cabernet Sauvignon 35%, Petit Verdot 5%",
    robe: "Robe rubis brillante aux reflets grenat",
    nez: "Fruits rouges croquants, cerise, légères notes vanillées",
    bouche: "Souple et gourmand, tanins fondus, belle fraîcheur",
    service: "16–17°C",
    garde: "10–15 ans",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80&fit=crop",
    badge: null
  },
  {
    id: "blanc",
    name: "Blanc du Domaine",
    subtitle: "Bordeaux Blanc Sec",
    appellation: "Bordeaux Blanc AOC",
    millesimes: ["2023", "2022"],
    price: 65,
    priceRange: "65 €",
    cepages: "Sauvignon Blanc 70%, Sémillon 30%",
    robe: "Robe jaune pâle aux reflets dorés",
    nez: "Agrumes frais, fleurs blanches, léger boisé grillé",
    bouche: "Vif et élégant, belle tension minérale, finale citronnée",
    service: "10–12°C",
    garde: "5–8 ans",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop",
    badge: null
  },
  {
    id: "coffret",
    name: "Coffret Prestige",
    subtitle: "Sélection Curatée — 6 bouteilles",
    appellation: "Assortiment Grand Cru",
    millesimes: ["2019", "2018", "2016"],
    price: 290,
    priceRange: "290 €",
    cepages: "2× Grand Vin · 2× Second Vin · 2× Blanc",
    robe: "Coffret bois gravé, papier de soie, ficelle naturelle",
    nez: "Idéal pour offrir ou découvrir le style du domaine",
    bouche: "Livraison sous température dirigée, certificat d'authenticité inclus",
    service: "Voir chaque vin",
    garde: "Voir chaque vin",
    image: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=800&q=80&fit=crop",
    badge: "Cadeau"
  }
]

// ─── SUB-PAGES ────────────────────────────────────────────────────────────────

function VinsPage({ goTo }: { goTo: (p: DomainePage) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const wine = selected ? WINES.find(w => w.id === selected) : null

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1474623809196-26b4a6764487?w=1600&q=80&fit=crop"
          alt="Cave à vins"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans">Margaux · 1er Grand Cru Classé</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">Nos Vins</h1>
          </Reveal>
        </div>
      </section>

      {/* Wine Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {WINES.map((w, i) => (
            <Reveal key={w.id} delay={i * 0.1}>
              <div
                className="group bg-white border border-[#2D1B0E]/8 overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-500"
                onClick={() => setSelected(w.id === selected ? null : w.id)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={w.image}
                    alt={w.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                  />
                  {w.badge && (
                    <div className="absolute top-4 right-4 bg-[#C4A265] text-[#2D1B0E] text-xs font-bold uppercase tracking-widest px-3 py-1.5">
                      {w.badge}
                    </div>
                  )}
                </div>
                <div className="p-8 font-sans">
                  <div className="text-xs uppercase tracking-widest text-[#C4A265] font-bold mb-1">{w.appellation}</div>
                  <h3 className="text-2xl font-serif text-[#2D1B0E] mb-1">{w.name}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{w.subtitle}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {w.millesimes.map(m => (
                      <span key={m} className="px-3 py-1 border border-[#2D1B0E]/20 text-xs font-bold text-[#2D1B0E] tracking-wider">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif text-[#2D1B0E]">{w.priceRange}</span>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2D1B0E] hover:text-[#C4A265] transition-colors"
                      onClick={(e) => { e.stopPropagation(); setSelected(w.id === selected ? null : w.id) }}
                    >
                      {selected === w.id ? "Fermer" : "Détails"} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {selected === w.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-t border-[#2D1B0E]/8"
                    >
                      <div className="px-8 pb-8 pt-6 font-sans bg-[#FDFBF7] grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Cépages</div>
                          <p className="text-sm text-zinc-700">{w.cepages}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Robe</div>
                          <p className="text-sm text-zinc-700">{w.robe}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Nez</div>
                          <p className="text-sm text-zinc-700">{w.nez}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Bouche</div>
                          <p className="text-sm text-zinc-700">{w.bouche}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Service</div>
                          <p className="text-sm text-zinc-700">{w.service}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Garde</div>
                          <p className="text-sm text-zinc-700">{w.garde}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <button
                            type="button"
                            onClick={() => goTo("commande")}
                            className="w-full py-3 bg-[#2D1B0E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4A2820] transition-colors"
                          >
                            Commander ce vin
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Note alcool */}
      <div className="max-w-7xl mx-auto px-6 pb-16 font-sans">
        <p className="text-xs text-zinc-400 text-center">
          L'abus d'alcool est dangereux pour la santé. La vente d'alcool est réservée aux personnes majeures (+18 ans). À consommer avec modération.
        </p>
      </div>
    </div>
  )
}

function TerroirPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80&fit=crop"
          alt="Vignoble de Margaux"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans">Médoc · Bordeaux</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">Le Terroir</h1>
          </Reveal>
        </div>
      </section>

      {/* Géologie */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1474623809196-26b4a6764487?w=800&q=80&fit=crop"
                  alt="Sol de graves garonnaises"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="font-sans">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#2D1B0E] flex items-center justify-center">
                    <Map className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C4A265] font-bold">Géologie</span>
                </div>
                <h2 className="text-4xl font-serif text-[#2D1B0E] mb-6">Les Graves de Margaux</h2>
                <p className="text-zinc-600 leading-relaxed mb-8 text-lg">
                  Notre vignoble repose sur les graves garonnaises du quaternaire, dépôts alluviaux anciens apportés par la Garonne. Ces cailloux ronds, réchauffés le jour et restitués la nuit, créent un micro-climat unique. Le sous-sol argilo-calcaire offre une réserve hydrique parfaite.
                </p>
                <div className="space-y-4">
                  {[
                    "Graves garonnaises du quaternaire",
                    "Sous-sol argilo-calcaire profond",
                    "Excellent drainage naturel",
                    "Micro-climat tempéré et lumineux"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C4A265] shrink-0" />
                      <span className="text-sm text-zinc-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Viticulture */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <Reveal delay={0.1} className="order-2 lg:order-1">
              <div className="font-sans">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#2D1B0E] flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C4A265] font-bold">Viticulture</span>
                </div>
                <h2 className="text-4xl font-serif text-[#2D1B0E] mb-6">La Vigne Raisonnée</h2>
                <p className="text-zinc-600 leading-relaxed mb-8 text-lg">
                  Nous pratiquons la lutte raisonnée depuis 1998, avec une conversion progressive vers la biodynamie. Les vendanges sont intégralement manuelles. Le rendement volontairement limité à 35 hectolitres par hectare concentre l'expression du terroir dans chaque grain de raisin.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white border border-[#2D1B0E]/8 p-6 text-center">
                    <div className="text-3xl font-serif text-[#2D1B0E] mb-2">35</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">hl/ha maximum</div>
                  </div>
                  <div className="bg-white border border-[#2D1B0E]/8 p-6 text-center">
                    <div className="text-3xl font-serif text-[#2D1B0E] mb-2">100%</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Vendanges manuelles</div>
                  </div>
                  <div className="bg-white border border-[#2D1B0E]/8 p-6 text-center">
                    <div className="text-3xl font-serif text-[#2D1B0E] mb-2">45</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Hectares de vignes</div>
                  </div>
                  <div className="bg-white border border-[#2D1B0E]/8 p-6 text-center">
                    <div className="text-3xl font-serif text-[#2D1B0E] mb-2">HVE 3</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Certification</div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80&fit=crop"
                  alt="Vendanges manuelles"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>

          {/* Vinification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1596404495574-8b15d9a941ea?w=800&q=80&fit=crop"
                  alt="Chai de vinification"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="font-sans">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#2D1B0E] flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C4A265] font-bold">Vinification</span>
                </div>
                <h2 className="text-4xl font-serif text-[#2D1B0E] mb-6">L'Art de la Transformation</h2>
                <p className="text-zinc-600 leading-relaxed mb-8 text-lg">
                  La vinification s'effectue en cuves inox thermorégulées permettant un contrôle précis des températures de fermentation. L'élevage de 18 à 24 mois en barriques françaises neuves à 60% suit la méthode de l'œnologue-conseil Denis Dubourdieu, privilégiant l'expression du fruit.
                </p>
                <div className="space-y-4">
                  {[
                    "Cuves inox thermorégulées — fermentation à 28°C",
                    "Élevage 18–24 mois en barriques françaises",
                    "60% bois neuf — Tronçais, chauffe moyenne",
                    "Méthode Dubourdieu — respect du fruit",
                    "Soutirage à la bougie, collage au blanc d'œuf"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C4A265] shrink-0" />
                      <span className="text-sm text-zinc-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Équipe */}
          <Reveal>
            <div className="bg-[#2D1B0E] text-white p-12 md:p-16">
              <div className="text-center mb-12">
                <div className="h-px w-12 bg-[#C4A265] mx-auto mb-6" />
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4">L'Équipe Technique</h2>
                <h3 className="text-3xl font-serif">Les Gardiens du Style</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto font-sans">
                <div className="bg-white/5 p-8 text-center">
                  <div className="w-16 h-16 bg-[#C4A265]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-[#C4A265]" />
                  </div>
                  <div className="text-lg font-serif text-[#C4A265] mb-1">Jean-Pierre Launay</div>
                  <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Maître de Chai</div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    30 ans au service du domaine. Gardien de la mémoire des millésimes, il conduit chaque élevage avec une précision horlogère.
                  </p>
                </div>
                <div className="bg-white/5 p-8 text-center">
                  <div className="w-16 h-16 bg-[#C4A265]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Grape className="w-8 h-8 text-[#C4A265]" />
                  </div>
                  <div className="text-lg font-serif text-[#C4A265] mb-1">Méthode Dubourdieu</div>
                  <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Conseil Œnologique</div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    L'héritage de la méthode Denis Dubourdieu guide nos choix vinificatoires : respect absolu du raisin, révélation du terroir.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function VisitePage() {
  const [formData, setFormData] = useState({
    experience: "classique",
    date: "",
    groupSize: "",
    nom: "",
    email: "",
    telephone: "",
    message: ""
  })
  const [submitted, setSubmitted] = useState(false)

  const experiences = [
    {
      id: "classique",
      title: "Visite & Dégustation Classique",
      duration: "1h30",
      price: "25 € / pers.",
      group: "6 à 15 personnes",
      description: "Découverte du vignoble et des chais, dégustation de 3 millésimes commentée par notre équipe.",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80&fit=crop",
      includes: ["Visite guidée du vignoble", "Visite des chais et cuvier", "Dégustation 3 millésimes", "Livret du domaine offert"]
    },
    {
      id: "prestige",
      title: "Visite Prestige avec Déjeuner",
      duration: "4h",
      price: "120 € / pers.",
      group: "Max. 8 personnes",
      description: "Immersion complète : vignoble, chais historiques, caves, suivie d'un déjeuner gastronomique au Château.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop",
      includes: ["Visite approfondie en petit groupe", "Accès aux caves du XVIIIe siècle", "Déjeuner 4 services au Château", "Dégustation verticale 6 millésimes", "1 bouteille offerte"]
    },
    {
      id: "seminaire",
      title: "Séminaire & Événements Privés",
      duration: "Sur mesure",
      price: "Sur devis",
      group: "Jusqu'à 50 personnes",
      description: "La salle de réception du Château accueille vos événements d'entreprise, lancements de produits ou célébrations privées.",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80&fit=crop",
      includes: ["Salle historique de 50 personnes", "Traiteur partenaire sur demande", "Programme œnologique personnalisé", "Hébergement partenaire disponible", "Devis sur mesure sous 48h"]
    },
    {
      id: "vendanges",
      title: "Week-end Vendanges",
      duration: "2 jours / 1 nuit",
      price: "380 € / pers.",
      group: "Max. 12 personnes",
      description: "En octobre, vivez les vendanges de l'intérieur. Cueillez le raisin aux côtés de notre équipe, vinifiez votre propre cuvée.",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80&fit=crop",
      includes: ["Participation aux vendanges manuelles", "Vinification guidée par le Maître de Chai", "Nuit en chambre d'hôtes partenaire", "2 dîners et 1 déjeuner au Château", "6 bouteilles personnalisées offertes"]
    }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1600&q=80&fit=crop"
          alt="Visite du domaine"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans">Sur Rendez-vous</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">Visites & Expériences</h1>
          </Reveal>
        </div>
      </section>

      {/* Experiences */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
          {experiences.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 0.1}>
              <div
                className={`bg-white border overflow-hidden transition-all duration-300 cursor-pointer ${formData.experience === exp.id ? "border-[#2D1B0E] shadow-2xl" : "border-[#2D1B0E]/8 hover:shadow-lg"}`}
                onClick={() => setFormData(prev => ({ ...prev, experience: exp.id }))}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={exp.image} alt={exp.title} fill className="object-cover" loading="lazy" />
                  {formData.experience === exp.id && (
                    <div className="absolute inset-0 bg-[#2D1B0E]/40 flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-[#C4A265]" />
                    </div>
                  )}
                </div>
                <div className="p-8 font-sans">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs uppercase tracking-widest text-[#C4A265] font-bold">{exp.duration}</div>
                    <div className="text-lg font-serif text-[#2D1B0E]">{exp.price}</div>
                  </div>
                  <h3 className="text-xl font-serif text-[#2D1B0E] mb-2">{exp.title}</h3>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-4">{exp.group}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">{exp.description}</p>
                  <ul className="space-y-2">
                    {exp.includes.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-zinc-600">
                        <CheckCircle2 className="w-4 h-4 text-[#C4A265] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Booking Form */}
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-px w-12 bg-[#C4A265] mx-auto mb-6" />
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4">Réservation</h2>
              <h3 className="text-3xl font-serif text-[#2D1B0E]">Réserver votre visite</h3>
            </div>

            {submitted ? (
              <div className="bg-[#2D1B0E] text-white p-12 text-center font-sans">
                <CheckCircle2 className="w-12 h-12 text-[#C4A265] mx-auto mb-6" />
                <h4 className="text-2xl font-serif mb-4">Demande envoyée</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Nous vous confirmerons votre réservation par email dans les 24 heures ouvrées.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[#2D1B0E]/8 p-10 font-sans space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Expérience choisie</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm text-[#2D1B0E] focus:outline-none focus:border-[#2D1B0E] bg-white"
                  >
                    {experiences.map(exp => (
                      <option key={exp.id} value={exp.id}>{exp.title} — {exp.price}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Date souhaitée</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Nombre de personnes</label>
                    <input
                      type="number"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleChange}
                      placeholder="Ex. 4"
                      min={1}
                      required
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Nom & Prénom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Message (optionnel)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#2D1B0E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4A2820] transition-colors"
                >
                  Envoyer ma demande de réservation
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function CommandePage({ goTo }: { goTo: (p: DomainePage) => void }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [step, setStep] = useState<"select" | "form" | "confirm">("select")
  const [formData, setFormData] = useState({ nom: "", adresse: "", codePostal: "", ville: "", email: "" })

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const next = Math.max(0, (prev[id] ?? 0) + delta)
      return { ...prev, [id]: next }
    })
  }

  const cartItems = WINES.filter(w => (quantities[w.id] ?? 0) > 0)
  const total = cartItems.reduce((acc, w) => acc + w.price * (quantities[w.id] ?? 0), 0)
  const totalBottles = Object.values(quantities).reduce((a, b) => a + b, 0)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("confirm")
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=1600&q=80&fit=crop"
          alt="Commander nos vins"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans">Vente Directe Propriété</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">Commander</h1>
          </Reveal>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        {/* Legal notice */}
        <Reveal>
          <div className="bg-[#2D1B0E]/5 border border-[#2D1B0E]/15 px-6 py-4 mb-12 font-sans flex items-start gap-3">
            <Award className="w-5 h-5 text-[#2D1B0E] shrink-0 mt-0.5" />
            <p className="text-sm text-[#2D1B0E] font-medium">
              La vente d'alcool est réservée aux personnes majeures (+18 ans). En passant commande, vous confirmez avoir l'âge légal requis dans votre pays de résidence. L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
            </p>
          </div>
        </Reveal>

        {step === "confirm" ? (
          <Reveal>
            <div className="max-w-2xl mx-auto bg-[#2D1B0E] text-white p-16 text-center font-sans">
              <CheckCircle2 className="w-16 h-16 text-[#C4A265] mx-auto mb-8" />
              <h2 className="text-3xl font-serif mb-6">Commande reçue</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Merci, {formData.nom}. Votre commande a été enregistrée. Vous recevrez sous 24h un email de confirmation à <strong className="text-white">{formData.email}</strong> avec les instructions de paiement par virement.
              </p>
              <p className="text-xs text-zinc-400 mb-10">Montant total estimé : {total.toLocaleString("fr-FR")} €</p>
              <button
                type="button"
                onClick={() => { setStep("select"); setQuantities({}) }}
                className="px-8 py-3 border border-white/30 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Nouvelle commande
              </button>
            </div>
          </Reveal>
        ) : step === "form" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Summary */}
            <Reveal>
              <div>
                <h2 className="text-2xl font-serif text-[#2D1B0E] mb-8">Récapitulatif</h2>
                <div className="space-y-4 mb-8">
                  {cartItems.map(w => (
                    <div key={w.id} className="flex items-center justify-between bg-white border border-[#2D1B0E]/8 px-6 py-4 font-sans">
                      <div>
                        <div className="font-serif text-[#2D1B0E]">{w.name}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{quantities[w.id]} × {w.price} €</div>
                      </div>
                      <div className="text-lg font-serif text-[#2D1B0E]">
                        {(w.price * (quantities[w.id] ?? 0)).toLocaleString("fr-FR")} €
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#2D1B0E] text-white px-6 py-4 flex justify-between items-center font-sans">
                  <span className="text-sm uppercase tracking-widest font-bold">Total</span>
                  <span className="text-2xl font-serif">{total.toLocaleString("fr-FR")} €</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans mt-4 leading-relaxed">
                  Paiement sécurisé par virement bancaire ou chèque — confirmation par email sous 24h. Livraison sous température dirigée, offerte à partir de 6 bouteilles.
                </p>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.1}>
              <form onSubmit={handleOrder} className="space-y-5 font-sans">
                <h2 className="text-2xl font-serif text-[#2D1B0E] mb-8">Coordonnées de livraison</h2>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Nom & Prénom</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Adresse</label>
                  <input type="text" name="adresse" value={formData.adresse} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Code postal</label>
                    <input type="text" name="codePostal" value={formData.codePostal} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Ville</label>
                    <input type="text" name="ville" value={formData.ville} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setStep("select")} className="flex-1 py-4 border border-[#2D1B0E] text-[#2D1B0E] text-xs font-bold uppercase tracking-widest hover:bg-[#2D1B0E]/5 transition-colors">
                    Retour
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-[#2D1B0E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4A2820] transition-colors">
                    Valider la commande
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        ) : (
          <>
            {/* Wine selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {WINES.map((w, i) => (
                <Reveal key={w.id} delay={i * 0.08}>
                  <div className="bg-white border border-[#2D1B0E]/8 overflow-hidden">
                    <div className="flex gap-0">
                      <div className="relative w-32 shrink-0">
                        <Image src={w.image} alt={w.name} fill className="object-cover" loading="lazy" />
                      </div>
                      <div className="p-6 font-sans flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-[#C4A265] font-bold mb-1">{w.appellation}</div>
                          <h3 className="text-lg font-serif text-[#2D1B0E] mb-1">{w.name}</h3>
                          <p className="text-sm text-zinc-500 mb-4">{w.priceRange} / btl</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateQty(w.id, -1)}
                            className="w-8 h-8 border border-zinc-200 flex items-center justify-center hover:border-[#2D1B0E] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-[#2D1B0E]">
                            {quantities[w.id] ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(w.id, 1)}
                            className="w-8 h-8 border border-zinc-200 flex items-center justify-center hover:border-[#2D1B0E] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Cart bar */}
            <AnimatePresence>
              {totalBottles > 0 && (
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto bg-[#2D1B0E] text-white px-8 py-5 flex items-center justify-between font-sans shadow-2xl z-40"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5 text-[#C4A265]" />
                    <span className="text-sm font-bold">{totalBottles} bouteille{totalBottles > 1 ? "s" : ""}</span>
                  </div>
                  <div className="text-xl font-serif">{total.toLocaleString("fr-FR")} €</div>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="px-6 py-2 bg-[#C4A265] text-[#2D1B0E] text-xs font-bold uppercase tracking-widest hover:bg-[#D4B878] transition-colors"
                  >
                    Commander
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </section>
    </div>
  )
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1559131397-f94da358f7ca?w=1600&q=80&fit=crop"
          alt="Contact Château Vestige"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans">Disponible sur Rendez-vous</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">Contact</h1>
          </Reveal>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <Reveal>
            <div className="font-sans">
              <h2 className="text-3xl font-serif text-[#2D1B0E] mb-10">Nous Contacter</h2>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#2D1B0E] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Adresse</div>
                    <p className="text-zinc-700 text-sm leading-relaxed">
                      Adresse communiquée sur demande à <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a>.<br />
                      Appellation Margaux-Cantenac, Gironde, France.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#2D1B0E] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Téléphone</div>
                    <p className="text-zinc-700 text-sm">+33 (0)5 56 00 00 00</p>
                    <p className="text-xs text-zinc-400 mt-1">Lun–Ven · 9h–17h · Hors juillet–août sur RDV</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#2D1B0E] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Email</div>
                    <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] text-sm hover:text-[#C4A265] transition-colors">
                      contact@aevia.io
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#2D1B0E] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Visites</div>
                    <p className="text-zinc-700 text-sm leading-relaxed">
                      Le domaine est ouvert aux visites uniquement sur rendez-vous. Merci de nous contacter pour planifier votre venue.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#2D1B0E]/5 border border-[#2D1B0E]/10 p-6">
                <div className="text-xs uppercase tracking-widest text-[#C4A265] font-bold font-sans mb-3">Commandes Professionnelles</div>
                <p className="text-sm text-zinc-600 font-sans leading-relaxed">
                  Pour les commandes professionnelles (négoce, restauration, grandes surfaces spécialisées), contactez notre service caveau directement à <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a>.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Contact form */}
          <Reveal delay={0.15}>
            {submitted ? (
              <div className="bg-[#2D1B0E] text-white p-16 text-center font-sans">
                <CheckCircle2 className="w-12 h-12 text-[#C4A265] mx-auto mb-6" />
                <h3 className="text-2xl font-serif mb-4">Message envoyé</h3>
                <p className="text-zinc-300 text-sm">Nous vous répondrons dans les 48 heures ouvrées.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-5 font-sans">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Nom & Prénom</label>
                  <input type="text" name="nom" value={form.nom} onChange={handleChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Sujet</label>
                  <select name="sujet" value={form.sujet} onChange={handleChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E] bg-white">
                    <option value="">Choisir un sujet…</option>
                    <option value="commande">Commande de vins</option>
                    <option value="visite">Réservation visite</option>
                    <option value="professionnel">Commande professionnelle</option>
                    <option value="presse">Presse & Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E] resize-none" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#2D1B0E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4A2820] transition-colors">
                  Envoyer
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function LegalPage({ type }: { type: "mentions" | "privacy" }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <section className="relative h-48 flex items-end bg-[#2D1B0E]">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
          <h1 className="text-4xl font-serif text-white">
            {type === "mentions" ? "Mentions Légales" : "Politique de Confidentialité"}
          </h1>
        </div>
      </section>

      <section className="py-20 max-w-3xl mx-auto px-6 font-sans text-zinc-600 prose prose-zinc">
        {type === "mentions" ? (
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Éditeur du site</h2>
              <p className="text-sm leading-relaxed">
                Ce site est édité par <strong className="text-[#2D1B0E]">Aevia WS</strong>, entreprise individuelle (auto-entrepreneur).<br />
                <strong>SIREN :</strong> 852 546 225<br />
                <strong>Contact :</strong> <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a><br />
                <strong>Adresse du siège social :</strong> Communiquée sur demande à <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Hébergement</h2>
              <p className="text-sm leading-relaxed">
                Ce site est hébergé par <strong className="text-[#2D1B0E]">Vercel Inc.</strong><br />
                340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.<br />
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#2D1B0E] underline underline-offset-2">vercel.com</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Propriété intellectuelle</h2>
              <p className="text-sm leading-relaxed">
                L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes) est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Responsabilité</h2>
              <p className="text-sm leading-relaxed">
                L'éditeur s'efforce de maintenir le site accessible et les informations exactes, mais ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des informations publiées. L'éditeur décline toute responsabilité pour des dommages directs ou indirects résultant de l'utilisation du site.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Avertissement — Alcool</h2>
              <p className="text-sm leading-relaxed">
                La vente et la consommation d'alcool sont réservées aux personnes majeures (18 ans et plus). L'abus d'alcool est dangereux pour la santé. À consommer avec modération. La vente à distance de boissons alcoolisées est régie par les articles L. 3342-1 et suivants du Code de la santé publique.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Responsable du traitement</h2>
              <p className="text-sm leading-relaxed">
                <strong className="text-[#2D1B0E]">Aevia WS</strong> — SIREN 852 546 225<br />
                Contact DPO : <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Données collectées</h2>
              <p className="text-sm leading-relaxed mb-3">
                Dans le cadre de l'utilisation de ce site, nous collectons uniquement les données que vous nous transmettez volontairement via les formulaires de contact, de réservation ou de commande :
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Adresse postale (uniquement pour les commandes)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Finalité et base légale</h2>
              <p className="text-sm leading-relaxed">
                Vos données sont utilisées exclusivement pour traiter vos demandes (réservations, commandes, contact), dans le cadre de l'exécution d'un contrat ou de votre consentement (RGPD, art. 6). Elles ne sont jamais cédées ou vendues à des tiers.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Conservation</h2>
              <p className="text-sm leading-relaxed">
                Les données sont conservées le temps nécessaire au traitement de votre demande, puis archivées conformément aux obligations légales (5 ans pour les données à caractère commercial).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Vos droits</h2>
              <p className="text-sm leading-relaxed">
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition au traitement de vos données. Pour exercer ces droits, contactez-nous à <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a>. En cas de litige, vous pouvez saisir la CNIL (cnil.fr).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#2D1B0E] mb-4">Cookies</h2>
              <p className="text-sm leading-relaxed">
                Ce site n'utilise pas de cookies de traçage ou publicitaires. Des cookies techniques strictement nécessaires au fonctionnement peuvent être déposés sans consentement préalable (art. 5§3 directive ePrivacy).
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function ChateauVestigeTemplate() {
  const [page, setPage] = useState<DomainePage>("home")
  const [mobileOpen, setMobileOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const goTo = (p: DomainePage) => {
    setPage(p)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const NAV_ITEMS: { label: string; key: DomainePage }[] = [
    { label: "Nos Vins", key: "vins" },
    { label: "Le Terroir", key: "terroir" },
    { label: "Visites", key: "visite" },
    { label: "Commander", key: "commande" },
    { label: "Contact", key: "contact" },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-serif" style={{ overflowX: "clip" }}>

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#2D1B0E]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goTo("home")}
            className="flex flex-col items-center group cursor-pointer"
          >
            <span className="text-2xl font-serif tracking-[0.2em] uppercase text-[#2D1B0E]">
              Château Vestige
            </span>
            <span className="text-[10px] tracking-widest uppercase text-zinc-500 mt-1">Margaux</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => goTo(item.key)}
                className={`text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer ${
                  page === item.key
                    ? "text-[#2D1B0E] border-b-2 border-[#C4A265] pb-0.5"
                    : "text-zinc-500 hover:text-[#2D1B0E]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2D1B0E]">FR / EN</span>
            <button
              type="button"
              onClick={() => goTo("vins")}
              className="px-6 py-3 bg-[#2D1B0E] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#4A2820] transition-colors duration-300 cursor-pointer"
            >
              Nos Vins
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-[#2D1B0E] cursor-pointer"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-[#FDFBF7] z-50 border-l border-[#2D1B0E]/10 shadow-2xl flex flex-col pt-24 px-8 gap-6"
            >
              <button
                type="button"
                className="absolute top-6 right-6 text-[#2D1B0E]"
                onClick={() => setMobileOpen(false)}
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => goTo(item.key)}
                  className={`text-left text-lg font-serif tracking-widest uppercase transition-colors cursor-pointer ${
                    page === item.key ? "text-[#2D1B0E]" : "text-zinc-500 hover:text-[#2D1B0E]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Separator className="bg-[#2D1B0E]/10" />
              <button
                type="button"
                onClick={() => goTo("vins")}
                className="px-6 py-4 bg-[#2D1B0E] text-white text-sm font-bold tracking-widest uppercase cursor-pointer"
              >
                Accéder aux Vins
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── PAGE GATE ─── */}
      <AnimatePresence mode="wait">
        {page !== "home" && (
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-24"
          >
            {page === "vins" && <VinsPage goTo={goTo} />}
            {page === "terroir" && <TerroirPage />}
            {page === "visite" && <VisitePage />}
            {page === "commande" && <CommandePage goTo={goTo} />}
            {page === "contact" && <ContactPage />}
            {(page === "mentions" || page === "privacy") && <LegalPage type={page} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HOME PAGE ─── */}
      {page === "home" && (
        <>
          {/* ─── HERO PARALLAX ─── */}
          <section className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
            <motion.div style={{ y: heroY, opacity: opacityHero }} className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=2000&q=80&fit=crop"
                alt="Vignoble de Margaux au lever du soleil"
                fill
                className="object-cover brightness-50"
                priority
              />
            </motion.div>

            <motion.div style={{ y: textY }} className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white mt-20">
              <Reveal>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-px w-12 bg-[#C4A265]" />
                  <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans">Grand Cru Classé en 1855</span>
                  <div className="h-px w-12 bg-[#C4A265]" />
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light tracking-tighter mb-8 leading-none drop-shadow-xl">
                  L'Âme de <br /> <span className="italic">Margaux.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-lg md:text-xl font-sans font-light tracking-wide max-w-2xl mx-auto mb-12 text-zinc-200">
                  Une terre de graves, des vignes centenaires et le temps pour seul allié. L'expression la plus pure d'un grand terroir.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-sans">
                  <button
                    type="button"
                    onClick={() => goTo("vins")}
                    className="w-full sm:w-auto px-10 py-4 bg-[#2D1B0E] text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#2D1B0E] transition-colors duration-300 cursor-pointer"
                  >
                    Découvrir nos Vins
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo("visite")}
                    className="w-full sm:w-auto px-10 py-4 border border-white/30 bg-black/20 backdrop-blur-md text-white font-bold uppercase tracking-widest text-sm hover:bg-white/20 transition-colors duration-300 cursor-pointer flex items-center justify-center gap-3"
                  >
                    <Play className="w-4 h-4" /> Visiter le Château
                  </button>
                </div>
              </Reveal>
            </motion.div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
              <ArrowRight className="w-6 h-6 text-white/50 rotate-90" />
            </div>
          </section>

          {/* ─── STATS BAR ─── */}
          <section className="py-20 border-b border-[#2D1B0E]/10 bg-white relative z-10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-4 divide-x-0 md:divide-x divide-[#2D1B0E]/10">
                {STATS.map((stat, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl lg:text-5xl font-serif text-[#2D1B0E] mb-3">
                        {stat.value}<span className="text-zinc-400 font-sans text-2xl">{stat.suffix}</span>
                      </div>
                      <div className="text-xs uppercase tracking-widest text-zinc-500 font-sans font-bold">
                        {stat.label}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ─── FEATURES (TABS) ─── */}
          <section className="py-32 relative bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-20">
                <Reveal>
                  <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4">Le Domaine</h2>
                  <h3 className="text-4xl md:text-5xl font-serif text-[#2D1B0E] mb-6">L'Art du Grand Vin</h3>
                  <p className="text-zinc-600 font-sans max-w-2xl mx-auto text-lg leading-relaxed">
                    De la vigne à la bouteille, chaque étape est guidée par l'exigence absolue et le respect d'une nature généreuse.
                  </p>
                </Reveal>
              </div>

              <Tabs defaultValue="terroir" className="w-full flex flex-col lg:flex-row gap-16">
                <div className="lg:w-1/3">
                  <TabsList className="flex flex-col h-auto bg-transparent gap-4 items-stretch font-sans">
                    {FEATURES.map((feature) => (
                      <TabsTrigger
                        key={feature.id}
                        value={feature.id}
                        className="justify-start px-8 py-6 text-left data-[state=active]:bg-[#2D1B0E] data-[state=active]:text-white text-zinc-500 hover:text-[#2D1B0E] transition-all duration-300 cursor-pointer rounded-none border border-transparent data-[state=active]:shadow-xl"
                      >
                        <div className="flex items-center gap-6">
                          <div className="opacity-70">{feature.icon}</div>
                          <span className="text-sm font-bold uppercase tracking-widest">{feature.title}</span>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="lg:w-2/3">
                  <AnimatePresence mode="wait">
                    {FEATURES.map((feature) => (
                      <TabsContent key={feature.id} value={feature.id} className="mt-0 outline-none">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white border border-[#2D1B0E]/5 overflow-hidden shadow-2xl"
                        >
                          <div className="aspect-[16/9] relative w-full overflow-hidden">
                            <Image src={feature.image} alt={feature.title} fill className="object-cover hover:scale-105 transition-transform duration-1000" />
                          </div>
                          <div className="p-10 md:p-14">
                            <h4 className="text-3xl font-serif text-[#2D1B0E] mb-6">{feature.title}</h4>
                            <p className="text-zinc-600 font-sans leading-relaxed mb-10 text-lg">{feature.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 font-sans">
                              {feature.bullets.map((bullet, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-[#C4A265]" />
                                  <span className="text-sm text-zinc-700 font-medium">{bullet}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </TabsContent>
                    ))}
                  </AnimatePresence>
                </div>
              </Tabs>
            </div>
          </section>

          {/* ─── TESTIMONIALS ─── */}
          <section className="py-32 bg-[#2D1B0E] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <Grape className="w-96 h-96" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <Reveal>
                <div className="text-center mb-20">
                  <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4">La Critique</h2>
                  <h3 className="text-4xl md:text-5xl font-serif">Ils en parlent</h3>
                </div>
              </Reveal>

              <Carousel className="w-full max-w-6xl mx-auto">
                <CarouselContent>
                  {TESTIMONIALS.map((testi, i) => (
                    <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/2 pl-6">
                      <Reveal delay={i * 0.1}>
                        <Card className="bg-[#3D1C22] border-none shadow-xl h-full font-sans">
                          <CardContent className="p-10 flex flex-col h-full justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-[#C4A265] text-[#2D1B0E] font-bold px-4 py-2 text-xl font-serif rounded-bl-xl">
                              {testi.score}
                            </div>
                            <div>
                              <div className="flex gap-1 mb-8 mt-2">
                                {[...Array(testi.rating)].map((_, j) => (
                                  <Star key={j} className="w-4 h-4 fill-[#C4A265] text-[#C4A265]" />
                                ))}
                              </div>
                              <p className="text-white/90 text-xl leading-relaxed font-serif italic mb-10">
                                "{testi.content}"
                              </p>
                            </div>
                            <div className="flex items-center gap-5 pt-6 border-t border-white/10 mt-auto">
                              <Avatar className="w-14 h-14 border-2 border-[#C4A265]">
                                <AvatarImage src={testi.avatar} />
                                <AvatarFallback>CV</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-white font-bold text-sm tracking-wider uppercase">{testi.name}</div>
                                <div className="text-[#C4A265] text-xs uppercase tracking-widest mt-1">{testi.role}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Reveal>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-6 mt-16">
                  <CarouselPrevious className="relative inset-auto translate-y-0 bg-transparent border-white/20 text-white hover:bg-white hover:text-[#2D1B0E] w-12 h-12 transition-colors" />
                  <CarouselNext className="relative inset-auto translate-y-0 bg-transparent border-white/20 text-white hover:bg-white hover:text-[#2D1B0E] w-12 h-12 transition-colors" />
                </div>
              </Carousel>
            </div>
          </section>

          {/* ─── FAQ ─── */}
          <section className="py-32 bg-[#FDFBF7]">
            <div className="max-w-4xl mx-auto px-6">
              <Reveal>
                <div className="text-center mb-16">
                  <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4">Service</h2>
                  <h3 className="text-4xl font-serif text-[#2D1B0E]">Questions Fréquentes</h3>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <Accordion type="single" collapsible className="w-full font-sans">
                  {FAQS.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-zinc-300">
                      <AccordionTrigger className="text-left text-[#2D1B0E] hover:text-[#C4A265] hover:no-underline font-bold text-lg py-6 transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-zinc-600 leading-relaxed pb-6 text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            </div>
          </section>

          {/* ─── CTA BANNER ─── */}
          <section className="py-24 px-6 relative z-10 bg-white">
            <Reveal>
              <div className="max-w-6xl mx-auto bg-[#2D1B0E] text-white p-12 md:p-24 text-center relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596404495574-8b15d9a941ea?w=1600&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-1000 mix-blend-luminosity" />
                <div className="relative z-10 font-sans">
                  <div className="w-16 h-px bg-[#C4A265] mx-auto mb-8" />
                  <h2 className="text-4xl md:text-6xl font-serif mb-8">Vivez l'expérience Vestige</h2>
                  <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                    Une dégustation privée, une visite de nos chais ou une réservation pour notre prochain millésime. Entrez dans le cercle intime du Château.
                  </p>
                  <button
                    type="button"
                    onClick={() => goTo("visite")}
                    className="px-12 py-5 bg-[#C4A265] text-[#2D1B0E] font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 cursor-pointer"
                  >
                    Réserver une Visite
                  </button>
                </div>
              </div>
            </Reveal>
          </section>
        </>
      )}

      {/* ─── FOOTER (always visible) ─── */}
      <footer className="bg-[#1A1A1A] pt-32 pb-12 text-zinc-400 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div>
              <button
                type="button"
                onClick={() => goTo("home")}
                className="flex flex-col items-start gap-1 mb-8 cursor-pointer"
              >
                <span className="text-2xl font-serif tracking-[0.2em] uppercase text-white">
                  Château Vestige
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#C4A265]">Margaux</span>
              </button>
              <p className="text-sm leading-relaxed mb-8">
                1er Grand Cru Classé. Un patrimoine viticole d'exception cultivé avec passion depuis 1789.
              </p>
              <div className="flex gap-4">
                <button type="button" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-white hover:bg-[#2D1B0E] transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" />
                </button>
                <button type="button" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-white hover:bg-[#2D1B0E] transition-colors cursor-pointer">
                  <Globe className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Le Domaine</h4>
              <ul className="space-y-4">
                <li>
                  <button type="button" onClick={() => goTo("terroir")} className="hover:text-white transition-colors text-sm cursor-pointer">
                    Le Terroir
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => goTo("terroir")} className="hover:text-white transition-colors text-sm cursor-pointer">
                    La Vinification
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => goTo("visite")} className="hover:text-white transition-colors text-sm cursor-pointer">
                    Visites & Expériences
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => goTo("contact")} className="hover:text-white transition-colors text-sm cursor-pointer">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Les Vins</h4>
              <ul className="space-y-4">
                {WINES.map(w => (
                  <li key={w.id}>
                    <button type="button" onClick={() => goTo("vins")} className="hover:text-white transition-colors text-sm cursor-pointer">
                      {w.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={() => goTo("commande")} className="hover:text-white transition-colors text-sm cursor-pointer">
                    Commander en ligne
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Contact & Visite</h4>
              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-sm">
                  <MapPin className="w-5 h-5 text-[#C4A265] shrink-0" />
                  <span>Appellation Margaux<br />Gironde, France<br /><span className="text-xs text-zinc-500">Adresse sur demande</span></span>
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Phone className="w-5 h-5 text-[#C4A265]" /> +33 (0)5 56 00 00 00
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Mail className="w-5 h-5 text-[#C4A265]" /> contact@aevia.io
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest">
            <p>&copy; 2026 Château Vestige — Aevia WS. L'abus d'alcool est dangereux pour la santé.</p>
            <div className="flex gap-8">
              <button
                type="button"
                onClick={() => goTo("mentions")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Mentions Légales
              </button>
              <button
                type="button"
                onClick={() => goTo("privacy")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Confidentialité
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
