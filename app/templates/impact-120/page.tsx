// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Droplets, Wind, Menu, X, ArrowRight, Flower2, Moon, Sun, Star, Gem, Feather, Heart, Eye, Palette, CheckCircle2, FlaskConical, Quote } from "lucide-react"

// ─── UTILS & ANIMATION COMPONENTS ─────────────────────────────────────────────

function Reveal({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number, direction?: "up" | "left" | "right" }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  
  const y = direction === "up" ? 40 : 0;
  const x = direction === "left" ? 40 : direction === "right" ? -40 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ParallaxText({ children, baseVelocity = 100 }: { children: React.ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useTransform(scrollY, [0, 1000], [0, 5])
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })

  const x = useTransform(baseX, (v) => `${v}%`)

  useEffect(() => {
    let animationFrameId: number;
    let prevTime = performance.now();
    
    const animate = (time: number) => {
      const delta = (time - prevTime) / 1000;
      prevTime = time;
      
      let moveBy = baseVelocity * delta;
      moveBy += moveBy * velocityFactor.get();
      
      baseX.set(baseX.get() + moveBy);
      if (baseX.get() <= -100) baseX.set(0);
      else if (baseX.get() > 0) baseX.set(-100);
      
      animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [baseVelocity, baseX, velocityFactor]);

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0">
      <motion.div className="flex whitespace-nowrap text-[12vw] font-light italic leading-none tracking-tighter uppercase" style={{ x, fontFamily: "Georgia, serif" }}>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
      </motion.div>
    </div>
  )
}

// ─── DATA MANIFESTS ─────────────────────────────────────────────────────────

const MANIFEST = {
  hero: {
    title: "Éclat",
    subtitle: "L'Essence de l'Éternité",
    metrics: [
      { label: "Fragrances", val: "24", icon: <Wind className="w-4 h-4" /> },
      { label: "Botanicals", val: "200+", icon: <Flower2 className="w-4 h-4" /> },
      { label: "Ateliers", val: "3", icon: <Gem className="w-4 h-4" /> }
    ]
  },
  perfumes: [
    {
      id: "nocturne",
      name: "Nocturne // 01",
      notes: "Oud Wood / Black Amber / Vetiver Smoke",
      desc: "A visceral descent into the midnight hour. Dark, resinous, and unapologetic.",
      color: "from-zinc-900 to-[#1a1122]",
      accent: "#a855f7"
    },
    {
      id: "soleil",
      name: "Soleil // 02",
      notes: "Grasse Rose / Saffron / Sandalwood",
      desc: "Liquid gold trapped in crystal. The blinding warmth of a Mediterranean summer.",
      color: "from-[#221811] to-[#3a200e]",
      accent: "#fbbf24"
    },
    {
      id: "aether",
      name: "Aether // 03",
      notes: "Iris Pallida / White Musk / Violet Leaf",
      desc: "Weightless elegance. A translucent veil of pure olfactory architecture.",
      color: "from-[#111c22] to-[#0b1419]",
      accent: "#38bdf8"
    }
  ],
  ingredients: [
    { name: "Oud Assam", origin: "India", rarity: "Exceptional", desc: "First-press extraction yielding a profound, animalic depth." },
    { name: "Rose de Mai", origin: "Grasse, France", rarity: "Heritage", desc: "Hand-picked at dawn to preserve the volatile heart notes." },
    { name: "Iris Pallida", origin: "Florence, Italy", rarity: "Noble", desc: "Aged for three years in subterranean vaults." },
    { name: "Santal Mysore", origin: "India", rarity: "Endangered", desc: "Sourced exclusively from certified sustainable heartwood." }
  ],
  science: [
    { step: "01", title: "Maceration", desc: "Our extracts rest in oak barrels for up to 18 months, allowing complex esters to form and sharp edges to smooth into velvet." },
    { step: "02", title: "Distillation", desc: "Fractional distillation under vacuum ensures the delicate top notes are captured without thermal degradation." },
    { step: "03", title: "Synthesis", desc: "Our master nose blends the rare absolutes with precision molecular captive molecules for unprecedented sillage." }
  ],
  testimonials: [
    { name: "J. L. Thorne", role: "Fragrance Critic", text: "Éclat has redefined the boundaries of niche perfumery. A masterclass in tension and release." },
    { name: "M. Vreeland", role: "Vogue Paris", text: "To wear Nocturne is to wrap oneself in an invisible armor of pure, liquid luxury." },
    { name: "A. Sterling", role: "Collector", text: "The longevity is simply supernatural. A single drop lasts well into the next sunrise." }
  ],
  tiers: [
    {
      name: "Discovery",
      price: "185",
      desc: "The essential introduction to the Éclat universe.",
      features: ["3x 10ml Travel Sprays", "Signature Velvet Pouch", "Digital Scent Profile", "Priority Shipping"]
    },
    {
      name: "Signature",
      price: "420",
      desc: "The full manifestation of our olfactory art.",
      features: ["100ml Baccarat Crystal Flacon", "Personalized Engraving", "Invitation to Atelier", "Complimentary Refill"],
      recommended: true
    },
    {
      name: "Bespoke",
      price: "15,000+",
      desc: "A singular fragrance crafted exclusively for you.",
      features: ["Private Consultation in Grasse", "1-on-1 with Master Perfumer", "Lifetime Formula Vault", "Hand-blown Crystal Decanter"]
    }
  ],
  faq: [
    { q: "How long does the sillage last on the skin?", a: "Due to our 35% Extrait de Parfum concentration, you can expect a projection of 12-16 hours on skin, and up to 48 hours on textiles." },
    { q: "Are the ingredients ethically sourced?", a: "Absolutely. We maintain direct relationships with our growers, paying premiums for sustainable farming and ethical harvesting practices." },
    { q: "What is the return policy for a blind buy?", a: "Every full-size bottle comes with a complimentary 2ml sample. Try the sample first. If it does not resonate, return the unopened full bottle for a full refund." },
    { q: "Do you offer refill services?", a: "Yes, our crystal flacons are designed for eternity. We offer a white-glove refill service at 40% of the original retail price." },
    { q: "How should I store my Éclat fragrance?", a: "Store in a cool, dark environment. The custom vitrine box provided acts as a thermal and UV shield to prevent molecular degradation." }
  ]
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function EclatLuxuryPage() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleDown = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#050308] text-zinc-300 font-sans min-h-screen selection:bg-fuchsia-900 selection:text-white" style={{ overflowX: "hidden" }}>
      {/* ─── BACKGROUND MESH & PARTICLES ───────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-900/10 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-900/10 blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
      </div>

      {/* ─── NAVBAR ────────────────────────────────────────────────────── */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#050308]/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full border border-fuchsia-900/50 flex items-center justify-center bg-fuchsia-900/10 group-hover:bg-fuchsia-900/30 transition-all duration-500">
              <FlaskConical className="w-4 h-4 text-fuchsia-300" />
            </div>
            <span className="text-xl tracking-[0.3em] font-light text-white uppercase">ÉCLAT</span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-xs font-medium tracking-[0.2em] uppercase">
            {["Collection", "Atelier", "Science", "Bespoke"].map((link) => (
              <Link key={link} href={`#${link.toLowerCase()}`} className="text-zinc-400 hover:text-white transition-colors relative group">
                {link}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-fuchsia-500 group-hover:w-full transition-all duration-500 ease-out" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="#boutique" className="hidden md:inline-flex items-center justify-center px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-fuchsia-100 transition-colors">
              Acquire
            </Link>
            <Sheet>
              <SheetTrigger className="lg:hidden w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors">
                  <Menu className="w-6 h-6" />
                </SheetTrigger>
              <SheetContent side="right" className="bg-[#050308] border-l border-white/10 p-12">
                <div className="flex flex-col gap-12 mt-20">
                  {["Collection", "Atelier", "Science", "Bespoke", "Boutique"].map((link) => (
                    <Link key={link} href={`#${link.toLowerCase()}`} className="text-3xl font-light tracking-widest uppercase text-zinc-400 hover:text-white transition-colors" style={{ fontFamily: "Georgia, serif" }}>
                      {link}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10">
        {/* ─── HERO ──────────────────────────────────────────────────────── */}
        <section id="hero" className="relative h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden">
          <motion.div style={{ y: heroY, opacity: opacityFade, scale: scaleDown }} className="absolute inset-0 flex items-center justify-center">
            {/* Massive Abstract Bottle / Orb shape */}
            <div className="relative w-[300px] h-[500px] md:w-[400px] md:h-[600px]">
              <div className="absolute inset-0 rounded-[100px] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent backdrop-blur-[2px] shadow-[0_0_100px_rgba(255,255,255,0.02)]" />
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-fuchsia-900/20 blur-[80px] mix-blend-lighten rounded-full animate-pulse" />
              <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-16 h-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-t-lg" />
            </div>
          </motion.div>

          <div className="relative z-10 text-center w-full max-w-[1200px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mb-6 flex justify-center items-center gap-4"
            >
              <span className="h-[1px] w-12 bg-fuchsia-900/50 block" />
              <span className="text-[10px] tracking-[0.4em] text-fuchsia-300/80 uppercase font-bold">Haute Parfumerie</span>
              <span className="h-[1px] w-12 bg-fuchsia-900/50 block" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="text-7xl md:text-9xl lg:text-[12rem] leading-[0.8] tracking-tighter text-white mb-12"
              style={{ fontFamily: "Georgia, serif" }}
            >
              ÉCLAT <br/>
              <span className="text-zinc-600 italic font-light">ABSOLU</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 font-light italic tracking-wide"
            >
              Architectural scent structures crafted in Grasse. Where botanical rarity meets quantum precision.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center"
          >
            <div className="w-[1px] h-24 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </section>

        {/* ─── METRICS BAR ───────────────────────────────────────────────── */}
        <section id="realisations" className="border-y border-white/5 bg-[#08050d] relative z-20">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {MANIFEST.hero.metrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-center gap-8 py-12 px-6 group">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 group-hover:border-fuchsia-500/50 group-hover:text-fuchsia-400 transition-colors duration-500">
                  {metric.icon}
                </div>
                <div>
                  <div className="text-4xl font-light text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>{metric.val}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── COLLECTION (CAROUSEL) ─────────────────────────────────────── */}
        <section id="collection" className="py-40 relative">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight uppercase" style={{ fontFamily: "Georgia, serif" }}>
                The <span className="italic text-zinc-500">Collection</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-zinc-400 max-w-sm text-sm tracking-widest uppercase leading-relaxed">
                Olfactory masterpieces housed in monumental crystal architecture.
              </p>
            </Reveal>
          </div>

          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4 md:-ml-8">
                {MANIFEST.perfumes.map((perfume, i) => (
                  <CarouselItem key={perfume.id} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/3">
                    <Reveal delay={i * 0.1}>
                      <div className="group relative h-[600px] rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-[#0a0710]">
                        <div className={`absolute inset-0 bg-gradient-to-br ${perfume.color} opacity-40 group-hover:opacity-80 transition-opacity duration-700`} />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
                        
                        <div className="relative h-full p-10 flex flex-col justify-between z-10">
                          <div>
                            <span className="inline-block px-3 py-1 border border-white/20 rounded-full text-[10px] uppercase tracking-widest text-white backdrop-blur-md mb-6">
                              Extrait de Parfum
                            </span>
                            <h3 className="text-3xl text-white font-light uppercase tracking-widest" style={{ fontFamily: "Georgia, serif" }}>
                              {perfume.name}
                            </h3>
                          </div>
                          
                          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-sm text-zinc-300 font-light italic mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                              "{perfume.desc}"
                            </p>
                            <div className="w-full h-[1px] bg-white/20 mb-6" />
                            <p className="text-xs text-white/60 tracking-[0.2em] uppercase font-bold">
                              {perfume.notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end gap-4 mt-12">
                <CarouselPrevious className="relative inset-auto translate-y-0 w-14 h-14 bg-white/5 border-white/10 text-white hover:bg-white hover:text-black transition-colors rounded-full" />
                <CarouselNext className="relative inset-auto translate-y-0 w-14 h-14 bg-white/5 border-white/10 text-white hover:bg-white hover:text-black transition-colors rounded-full" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* ─── KINETIC MARQUEE ───────────────────────────────────────────── */}
        <section className="py-20 border-y border-white/5 overflow-hidden bg-[#030205]">
          <ParallaxText baseVelocity={-1}>Pure Botanical Extracts</ParallaxText>
          <div className="h-4" />
          <ParallaxText baseVelocity={1}>Olfactory Architecture</ParallaxText>
        </section>

        {/* ─── INGREDIENTS TABS ──────────────────────────────────────────── */}
        <section id="science" className="py-40 relative">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="text-center mb-24">
              <Reveal>
                <div className="inline-flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-400 mb-6">
                  <Droplets className="w-4 h-4" />
                  <span>The Raw Materials</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight uppercase mb-8" style={{ fontFamily: "Georgia, serif" }}>
                  Molecular <span className="italic text-zinc-500">Sourcing</span>
                </h2>
              </Reveal>
            </div>

            <Tabs defaultValue={MANIFEST.ingredients[0].name} className="w-full">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-white/10 mb-12 overflow-x-auto flex-nowrap">
                {MANIFEST.ingredients.map((ing) => (
                  <TabsTrigger 
                    key={ing.name} 
                    value={ing.name}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-fuchsia-500 data-[state=active]:bg-transparent text-zinc-500 data-[state=active]:text-white pb-4 px-6 uppercase tracking-widest text-xs font-bold transition-all"
                  >
                    {ing.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {MANIFEST.ingredients.map((ing) => (
                <TabsContent key={ing.name} value={ing.name} className="mt-0 outline-none">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
                  >
                    <div className="aspect-square relative rounded-2xl overflow-hidden border border-white/10 bg-[#111]">
                      <Image 
                        src={`https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=800&q=80`}
                        alt={ing.name} fill className="object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-1000"
                      />
                    </div>
                    <div>
                      <h3 className="text-4xl text-white font-light uppercase tracking-widest mb-6" style={{ fontFamily: "Georgia, serif" }}>{ing.name}</h3>
                      <p className="text-lg text-zinc-400 font-light italic mb-10 leading-relaxed">"{ing.desc}"</p>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Origin</div>
                          <div className="text-white text-sm tracking-wider uppercase">{ing.origin}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Rarity Level</div>
                          <div className="text-fuchsia-400 text-sm tracking-wider uppercase">{ing.rarity}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* ─── ATELIER PROCESS (STICKY SCROLL) ───────────────────────────── */}
        <section id="atelier" className="py-40 bg-zinc-950 relative border-y border-white/5">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="lg:sticky lg:top-40 h-fit">
                <Reveal>
                  <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight uppercase mb-8" style={{ fontFamily: "Georgia, serif" }}>
                    The <span className="italic text-zinc-500">Atelier</span>
                  </h2>
                  <p className="text-zinc-400 max-w-md text-lg tracking-wide italic font-light leading-relaxed mb-12">
                    A meticulous orchestration of time, temperature, and absolute precision. The creation of an Éclat fragrance takes no less than two years.
                  </p>
                </Reveal>
              </div>
              <div className="space-y-32 pt-20">
                {MANIFEST.science.map((step, i) => (
                  <Reveal key={i} direction="up" delay={0.2}>
                    <div className="relative pl-12 border-l border-white/10 group">
                      <div className="absolute top-0 left-0 w-[1px] h-0 bg-fuchsia-500 group-hover:h-full transition-all duration-1000 ease-out" />
                      <div className="text-[10px] text-fuchsia-500 font-black tracking-[0.3em] mb-4">PHASE {step.step}</div>
                      <h3 className="text-3xl text-white uppercase tracking-widest mb-6" style={{ fontFamily: "Georgia, serif" }}>{step.title}</h3>
                      <p className="text-zinc-400 leading-relaxed font-light">{step.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRICING / BOUTIQUE ────────────────────────────────────────── */}
        <section id="boutique" className="py-40 relative">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="text-center mb-24">
              <Reveal>
                <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight uppercase mb-6" style={{ fontFamily: "Georgia, serif" }}>
                  Acquire <span className="italic text-zinc-500">Éclat</span>
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MANIFEST.tiers.map((tier, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`relative h-full p-10 flex flex-col rounded-2xl border ${tier.recommended ? 'border-fuchsia-500/50 bg-fuchsia-950/10' : 'border-white/10 bg-[#0a0710]'} hover:border-white/30 transition-all duration-500`}>
                    {tier.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-fuchsia-900 text-white text-[9px] font-black tracking-widest uppercase rounded-full">
                        Curator's Choice
                      </div>
                    )}
                    <h3 className="text-2xl text-white uppercase tracking-widest mb-2" style={{ fontFamily: "Georgia, serif" }}>{tier.name}</h3>
                    <p className="text-sm text-zinc-400 font-light italic mb-8 h-10">{tier.desc}</p>
                    <div className="text-4xl text-white font-light tracking-tighter mb-12">
                      <span className="text-xl text-zinc-500 align-top mr-1">€</span>{tier.price}
                    </div>
                    
                    <ul className="space-y-5 mb-12 flex-1">
                      {tier.features.map((feat, j) => (
                        <li key={j} className="flex items-start gap-4 text-xs tracking-wider text-zinc-300 uppercase">
                          <CheckCircle2 className="w-4 h-4 text-fuchsia-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-4 uppercase text-xs font-bold tracking-[0.2em] transition-colors ${tier.recommended ? 'bg-white text-black hover:bg-zinc-200' : 'bg-white/5 text-white hover:bg-white hover:text-black border border-white/10'}`}>
                      {tier.name === "Bespoke" ? "Request Inquiry" : "Add to Cart"}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ──────────────────────────────────────────────── */}
        <section className="py-32 bg-[#050208] border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] text-white/[0.02] font-serif italic pointer-events-none">"</div>
          <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
            <Carousel opts={{ align: "center", loop: true }}>
              <CarouselContent>
                {MANIFEST.testimonials.map((t, i) => (
                  <CarouselItem key={i}>
                    <Reveal>
                      <Quote className="w-12 h-12 mx-auto text-fuchsia-900/50 mb-10" />
                      <p className="text-2xl md:text-4xl text-white font-light italic leading-relaxed mb-12" style={{ fontFamily: "Georgia, serif" }}>
                        "{t.text}"
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-fuchsia-500 text-fuchsia-500" />)}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-white">{t.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">{t.role}</div>
                    </Reveal>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-40 relative">
          <div className="max-w-[800px] mx-auto px-6 md:px-12">
            <div className="text-center mb-20">
              <Reveal>
                <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight uppercase" style={{ fontFamily: "Georgia, serif" }}>
                  Client <span className="italic text-zinc-500">Concierge</span>
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {MANIFEST.faq.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-white/10 bg-[#0a0710] px-6 rounded-xl overflow-hidden">
                    <AccordionTrigger className="text-sm tracking-widest uppercase hover:text-fuchsia-400 transition-colors text-left py-6">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-zinc-400 leading-relaxed font-light italic pb-6">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* ─── CTA BANNER ────────────────────────────────────────────────── */}
        <section id="contact" className="py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-fuchsia-950/20" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050308] via-transparent to-[#050308]" />
          
          <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
            <Reveal>
              <h2 className="text-6xl md:text-9xl text-white tracking-tighter uppercase mb-8" style={{ fontFamily: "Georgia, serif" }}>
                Unveil Your <br/> <span className="italic text-fuchsia-300 font-light">Signature</span>
              </h2>
              <p className="text-xl text-zinc-300 font-light italic mb-12 max-w-2xl mx-auto">
                Join the exclusive Éclat registry. Limited editions and private commissions await.
              </p>
              <button className="px-12 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.3em] hover:bg-fuchsia-100 transition-all hover:scale-105 active:scale-95">
                Join The Registry
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#050308] pt-32 pb-12 px-6 md:px-12 border-t border-white/10 relative z-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-32">
            <div className="col-span-1 md:col-span-2">
              <Link href="#hero" className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-full border border-fuchsia-900/50 flex items-center justify-center bg-fuchsia-900/10">
                  <FlaskConical className="w-3 h-3 text-fuchsia-300" />
                </div>
                <span className="text-lg tracking-[0.3em] font-light text-white uppercase">ÉCLAT</span>
              </Link>
              <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] leading-relaxed max-w-md italic">
                Haute parfumerie crafted with uncompromising precision. Paris, Grasse, New York.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">Maison</h4>
              <ul className="space-y-4 text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">
                <li><Link href="#boutique" className="hover:text-fuchsia-400 transition-colors">Our Story</Link></li>
                <li><Link href="#boutique" className="hover:text-fuchsia-400 transition-colors">The Noses</Link></li>
                <li><Link href="#boutique" className="hover:text-fuchsia-400 transition-colors">Sustainability</Link></li>
                <li><Link href="#boutique" className="hover:text-fuchsia-400 transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">Legal</h4>
              <ul className="space-y-4 text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">
                <li><Link href="#contact" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
            <div>© 2026 Éclat Parfums. All Rights Reserved.</div>
            <div className="flex items-center gap-8 text-white/50">
              <Link href="#boutique" className="hover:text-white transition-colors">Camera</Link>
              <Link href="#boutique" className="hover:text-white transition-colors">MessageSquare</Link>
              <Link href="#boutique" className="hover:text-white transition-colors">Bookmark</Link>
            </div>
          </div>
          
          <div className="w-full mt-20 text-center overflow-hidden">
            <h1 className="text-[15vw] leading-none font-light text-white/[0.02] tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
              ÉCLAT
            </h1>
          </div>
        </div>
      </footer>
    </div>
  );
}
