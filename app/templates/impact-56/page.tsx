"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Menu, X, Star, Clock, Shield, Award, ChevronRight, Play, MapPin, Phone, Mail, Camera, Grape, Map, Droplets, Sun, Wind, CheckCircle2, Globe } from "lucide-react"

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
const NAV_LINKS = [
  { label: "Le Domaine", href: "#domaine" },
  { label: "Nos Vins", href: "#vins" },
  { label: "Le Terroir", href: "#terroir" },
  { label: "Dégustation", href: "#degustation" },
]

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
    image: "https://picsum.photos/seed/restaurant/800/800"
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
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1596404495574-8b15d9a941ea?w=800&q=80"
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

const PRICING = [
  {
    id: "amateur",
    title: "Le Second Vin",
    subtitle: "L'Héritier de Vestige",
    price: "120 €",
    unit: "/ bouteille",
    description: "Gourmand et accessible plus rapidement, il offre une introduction brillante au style du domaine.",
    features: [
      "Assemblage majorité Merlot",
      "Élevage 12 mois en barriques",
      "Prêt à boire ou garde 10-15 ans",
      "Caisse bois de 6 bouteilles",
      "Livraison sous température dirigée"
    ],
    recommended: false
  },
  {
    id: "connaisseur",
    title: "Le Grand Vin",
    subtitle: "Château Vestige, 1er GCC",
    price: "850 €",
    unit: "/ bouteille",
    description: "L'expression ultime de notre terroir. Puissance, élégance et potentiel de garde infini.",
    features: [
      "Sélection des plus vieilles vignes",
      "80% Cabernet Sauvignon",
      "Élevage 24 mois (80% bois neuf)",
      "Potentiel de garde : 50 ans+",
      "Certificat d'authenticité NFT",
      "Puce NFC anti-contrefaçon"
    ],
    recommended: true
  },
  {
    id: "maitre",
    title: "Le Club Privilège",
    subtitle: "Allocation Primeurs",
    price: "Sur Demande",
    unit: "/ allocation",
    description: "Pour les collectionneurs exigeants. Accès exclusif à nos vieux millésimes et grands formats.",
    features: [
      "Accès garanti aux primeurs",
      "Formats spéciaux (Magnum, Jéroboam)",
      "Stockage offert dans nos caves (5 ans)",
      "Dîner privé au Château annuel",
      "Dégustations avec le Maître de Chai",
      "Conciergerie dédiée"
    ],
    recommended: false
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

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function ChateauVestigeTemplate() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  // Parallax Values
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-serif" style={{ overflowX: "hidden", scrollBehavior: "smooth" }}>
      
      {/* ─── 1. NAVBAR STICKY ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#3A1C20]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center group cursor-pointer">
            <span className="text-2xl font-serif tracking-[0.2em] uppercase text-[#3A1C20]">
              Château Vestige
            </span>
            <span className="text-[10px] tracking-widest uppercase text-zinc-500 mt-1">Margaux</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-600 hover:text-[#3A1C20] transition-all duration-200 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-xs font-bold tracking-widest uppercase text-[#3A1C20] hover:opacity-70 transition-opacity cursor-pointer">
              FR / EN
            </button>
            <button className="px-6 py-3 bg-[#3A1C20] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#5A2E33] transition-colors duration-300 cursor-pointer">
              Allouer
            </button>
          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 text-[#3A1C20] cursor-pointer">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#FDFBF7] border-l border-[#3A1C20]/10 text-[#1A1A1A] w-[300px]">
              <div className="flex flex-col gap-8 mt-12">
                {NAV_LINKS.map((link) => (
                  <Link 
                    key={link.label} 
                    href={link.href} 
                    className="text-lg font-serif tracking-widest uppercase text-zinc-600 hover:text-[#3A1C20] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                ))}
                <Separator className="bg-[#3A1C20]/10" />
                <button className="px-6 py-4 bg-[#3A1C20] text-white text-sm font-bold tracking-widest uppercase cursor-pointer">
                  Accéder aux Vins
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* ─── 2. HERO PARALLAX ─── */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
        <motion.div style={{ y: heroY, opacity: opacityHero }} className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=2000&q=80" 
            alt="Vignoble de Margaux au lever du soleil" 
            fill 
            className="object-cover brightness-50"
            priority
          />
        </motion.div>

        <motion.div style={{ y: textY }} className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white mt-20">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#D4AF37]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-sans">Grand Cru Classé en 1855</span>
              <div className="h-px w-12 bg-[#D4AF37]" />
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

          <Reveal delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-6 font-sans">
            <button className="w-full sm:w-auto px-10 py-4 bg-[#3A1C20] text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#3A1C20] transition-colors duration-300 cursor-pointer">
              Découvrir le Millésime
            </button>
            <button className="w-full sm:w-auto px-10 py-4 border border-white/30 bg-black/20 backdrop-blur-md text-white font-bold uppercase tracking-widest text-sm hover:bg-white/20 transition-colors duration-300 cursor-pointer flex items-center justify-center gap-3">
              <Play className="w-4 h-4" /> Le Film
            </button>
          </Reveal>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-white/50 rotate-90" />
        </div>
      </section>

      {/* ─── 3. STATS BAR ─── */}
      <section className="py-20 border-b border-[#3A1C20]/10 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-4 divide-x-0 md:divide-x divide-[#3A1C20]/10">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center cursor-pointer group">
                  <div className="text-4xl lg:text-5xl font-serif text-[#3A1C20] mb-3">
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

      {/* ─── 4. FEATURES (TABS) ─── */}
      <section id="domaine" className="py-32 relative bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <Reveal>
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-4">Le Domaine</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-[#3A1C20] mb-6">L'Art du Grand Vin</h3>
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
                    className="justify-start px-8 py-6 text-left data-[state=active]:bg-[#3A1C20] data-[state=active]:text-white text-zinc-500 hover:text-[#3A1C20] transition-all duration-300 cursor-pointer rounded-none border border-transparent data-[state=active]:shadow-xl"
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
                      className="bg-white border border-[#3A1C20]/5 overflow-hidden shadow-2xl"
                    >
                      <div className="aspect-[16/9] relative w-full overflow-hidden">
                        <Image src={feature.image} alt={feature.title} fill className="object-cover hover:scale-105 transition-transform duration-1000" />
                      </div>
                      <div className="p-10 md:p-14">
                        <h4 className="text-3xl font-serif text-[#3A1C20] mb-6">{feature.title}</h4>
                        <p className="text-zinc-600 font-sans leading-relaxed mb-10 text-lg">{feature.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 font-sans">
                          {feature.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
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

      {/* ─── 5. TESTIMONIALS CAROUSEL ─── */}
      <section className="py-32 bg-[#3A1C20] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
          <Grape className="w-96 h-96" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-4">La Critique</h2>
              <h3 className="text-4xl md:text-5xl font-serif">Ils en parlent</h3>
            </div>
          </Reveal>

          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {TESTIMONIALS.map((testi, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/2 pl-6">
                  <Reveal delay={i * 0.1}>
                    <Card className="bg-[#4A262B] border-none shadow-xl h-full font-sans">
                      <CardContent className="p-10 flex flex-col h-full justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3A1C20] font-bold px-4 py-2 text-xl font-serif rounded-bl-xl">
                          {testi.score}
                        </div>
                        <div>
                          <div className="flex gap-1 mb-8 mt-2">
                            {[...Array(testi.rating)].map((_, j) => (
                              <Star key={j} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                            ))}
                          </div>
                          <p className="text-white/90 text-xl leading-relaxed font-serif italic mb-10">
                            "{testi.content}"
                          </p>
                        </div>
                        <div className="flex items-center gap-5 pt-6 border-t border-white/10 mt-auto">
                          <Avatar className="w-14 h-14 border-2 border-[#D4AF37]">
                            <AvatarImage src={testi.avatar} />
                            <AvatarFallback>CV</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-white font-bold text-sm tracking-wider uppercase">{testi.name}</div>
                            <div className="text-[#D4AF37] text-xs uppercase tracking-widest mt-1">{testi.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-6 mt-16">
              <CarouselPrevious className="relative inset-auto translate-y-0 bg-transparent border-white/20 text-white hover:bg-white hover:text-[#3A1C20] w-12 h-12 transition-colors" />
              <CarouselNext className="relative inset-auto translate-y-0 bg-transparent border-white/20 text-white hover:bg-white hover:text-[#3A1C20] w-12 h-12 transition-colors" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* ─── 6. PRICING ─── */}
      <section id="vins" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <Reveal>
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-4">Acquisition</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-[#3A1C20] mb-6">Nos Vins & Allocations</h3>
              <p className="text-zinc-500 font-sans max-w-xl mx-auto text-lg">
                Pour garantir la parfaite traçabilité, nos vins sont disponibles en direct de la propriété.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end font-sans">
            {PRICING.map((tier, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Card className={`relative bg-[#FDFBF7] border ${tier.recommended ? 'border-[#3A1C20] shadow-2xl z-10' : 'border-zinc-200'} transition-all duration-300 cursor-pointer overflow-hidden`}>
                  {tier.recommended && (
                    <div className="absolute top-0 inset-x-0 bg-[#3A1C20] text-[#D4AF37] text-xs font-bold uppercase tracking-widest text-center py-2">
                      Le Vin Signature
                    </div>
                  )}
                  <CardContent className={`p-10 ${tier.recommended ? 'pt-14' : ''}`}>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">{tier.subtitle}</div>
                    <h4 className="text-3xl font-serif text-[#3A1C20] mb-4">{tier.title}</h4>
                    <p className="text-sm text-zinc-600 mb-8 h-12 leading-relaxed">{tier.description}</p>
                    
                    <div className="flex items-baseline gap-2 mb-10 border-b border-zinc-200 pb-10">
                      <span className="text-4xl font-light text-[#3A1C20]">{tier.price}</span>
                      <span className="text-sm text-zinc-500">{tier.unit}</span>
                    </div>

                    <ul className="space-y-5 mb-12">
                      {tier.features.map((feat, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-zinc-700">
                          <Grape className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${tier.recommended ? 'bg-[#3A1C20] text-white hover:bg-[#5A2E33]' : 'bg-transparent border border-[#3A1C20] text-[#3A1C20] hover:bg-[#3A1C20] hover:text-white'}`}>
                      {tier.price === "Sur Demande" ? "Nous Contacter" : "Commander"}
                    </button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. FAQ ACCORDION ─── */}
      <section className="py-32 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-4">Service</h2>
              <h3 className="text-4xl font-serif text-[#3A1C20]">Questions Fréquentes</h3>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <Accordion type="single" collapsible className="w-full font-sans">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-zinc-300">
                  <AccordionTrigger className="text-left text-[#3A1C20] hover:text-[#D4AF37] hover:no-underline font-bold text-lg py-6 transition-colors">
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

      {/* ─── 8. CTA BANNER ─── */}
      <section className="py-24 px-6 relative z-10 bg-white">
        <Reveal>
          <div className="max-w-6xl mx-auto bg-[#3A1C20] text-white p-12 md:p-24 text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596404495574-8b15d9a941ea?w=1600&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-1000 mix-blend-luminosity" />
            
            <div className="relative z-10 font-sans">
              <div className="w-16 h-px bg-[#D4AF37] mx-auto mb-8" />
              <h2 className="text-4xl md:text-6xl font-serif mb-8">Vivez l'expérience Vestige</h2>
              <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                Une dégustation privée, une visite de nos chais ou une réservation pour notre prochain millésime. Entrez dans le cercle intime du Château.
              </p>
              <button className="px-12 py-5 bg-[#D4AF37] text-[#3A1C20] font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 cursor-pointer">
                Réserver une Visite
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── 9. FOOTER ─── */}
      <footer className="bg-[#1A1A1A] pt-32 pb-12 text-zinc-400 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div>
              <Link href="/" className="flex flex-col items-start gap-1 mb-8 cursor-pointer">
                <span className="text-2xl font-serif tracking-[0.2em] uppercase text-white">
                  Château Vestige
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#D4AF37]">Margaux</span>
              </Link>
              <p className="text-sm leading-relaxed mb-8">
                1er Grand Cru Classé. Un patrimoine viticole d'exception cultivé avec passion depuis 1789.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-white hover:bg-[#3A1C20] transition-colors cursor-pointer"><Camera className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-white hover:bg-[#3A1C20] transition-colors cursor-pointer"><Globe className="w-4 h-4" /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Le Domaine</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors text-sm cursor-pointer">Histoire</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm cursor-pointer">Le Terroir</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm cursor-pointer">La Vinification</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm cursor-pointer">Développement Durable</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Les Vins</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors text-sm cursor-pointer">Château Vestige</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm cursor-pointer">L'Héritier</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm cursor-pointer">Millésimes</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm cursor-pointer">Acheter en primeur</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Contact & Visite</h4>
              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-sm">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span>Route des Châteaux<br/>33460 Margaux-Cantenac<br/>France</span>
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Phone className="w-5 h-5 text-[#D4AF37]" /> +33 (0)5 56 00 00 00
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Mail className="w-5 h-5 text-[#D4AF37]" /> visite@chateauvestige.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest">
            <p>&copy; 2026 Château Vestige. L'abus d'alcool est dangereux pour la santé.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors cursor-pointer">Mentions Légales</a>
              <a href="#" className="hover:text-white transition-colors cursor-pointer">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
