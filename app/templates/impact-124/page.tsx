// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring, useMotionValue } from "framer-motion"
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
import { Menu, X, ArrowRight, ArrowUpRight, Play, Box, Layers, Cpu, Zap, Maximize, Activity, Code, Orbit, Disc3, Sparkles } from "lucide-react"

// ─── UTILS & ANIMATION COMPONENTS ─────────────────────────────────────────────

function Reveal({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number, direction?: "up" | "left" | "right" }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const y = direction === "up" ? 40 : 0;
  const x = direction === "left" ? 40 : direction === "right" ? -40 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      <div className="relative z-10 p-8 h-full">
        {children}
      </div>
    </div>
  )
}

function GridBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none perspective-[1000px] overflow-hidden flex items-center justify-center">
      {/* 3D Grid Floor */}
      <motion.div 
        animate={{ backgroundPosition: ["0px 0px", "0px 100px"] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute bottom-[-20%] w-[200%] h-[100%] opacity-20"
        style={{
          backgroundImage: "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          transform: "rotateX(60deg) translateY(0)",
          transformOrigin: "center center"
        }}
      />
      {/* Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px] mix-blend-screen" />
    </div>
  )
}

// ─── DATA MANIFESTS ─────────────────────────────────────────────────────────

const MANIFEST = {
  hero: {
    status: "SYSTEMS ONLINE",
    title: "MORPH STUDIO",
    desc: "We engineer immersive 3D interfaces, WebGL experiences, and spatial computing environments for the next era of the web."
  },
  services: [
    { id: "S-01", title: "Spatial Web", icon: <Box className="w-6 h-6" />, desc: "Transforming flat pages into interactive 3D environments using Three.js and WebGL." },
    { id: "S-02", title: "Generative Systems", icon: <Zap className="w-6 h-6" />, desc: "Algorithmic design architectures that react in real-time to user input and audio." },
    { id: "S-03", title: "Motion Engineering", icon: <Activity className="w-6 h-6" />, desc: "Physics-based animations, fluid simulations, and complex particle systems." }
  ],
  projects: [
    { title: "Neon Genesis", tech: "Three.js / GLSL", desc: "Interactive product configurator for hyper-cars.", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80" },
    { title: "Aether Protocol", tech: "React Three Fiber", desc: "Spatial data visualization for blockchain nodes.", img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80" },
    { title: "Void Analytics", tech: "WebGL / Canvas", desc: "Real-time particle system for tracking server loads.", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80" },
    { title: "Cybernetics", tech: "Spline / React", desc: "Interactive 3D narrative for a tech hardware launch.", img: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=800&q=80" }
  ],
  stats: [
    { label: "Vertices Rendered", val: "14.2B" },
    { label: "FPS Target", val: "120" },
    { label: "Shaders Written", val: "840+" },
    { label: "Global Clients", val: "32" }
  ],
  stack: ["Three.js", "WebGL", "GLSL", "React Three Fiber", "Blender", "Framer Motion", "GSAP", "Lenis", "Next.js"],
  pricing: [
    { name: "Prototyping", price: "15k", desc: "Proof of concept and visual direction.", features: ["3D Asset Optimization", "Lighting Setup", "Basic Interactions", "Performance Audit"] },
    { name: "Production", price: "45k", desc: "Full-scale WebGL experience.", features: ["Custom GLSL Shaders", "Physics Engine", "Audio Reactivity", "Post-processing FX"], recommended: true },
    { name: "Enterprise", price: "Custom", desc: "Dedicated spatial computing team.", features: ["VR/AR Integration", "Backend Data Vis", "Infinite Scalability", "24/7 Support"] }
  ],
  faq: [
    { q: "How does 3D affect website performance?", a: "We heavily optimize all models and textures, utilizing DRACO compression and efficient instancing. Our WebGL experiences typically run at a smooth 60fps even on mobile devices." },
    { q: "Do you create the 3D assets in-house?", a: "Yes, our team includes technical artists who build, rig, and optimize assets specifically for real-time web rendering in Blender and Maya." },
    { q: "What is your typical project timeline?", a: "A standard interactive 3D landing page takes 6-8 weeks from concept to deployment. Complex data visualizations or configurators may take 12-16 weeks." }
  ]
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function MorphStudioPage() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.5])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="bg-[#050505] text-[#e0e0e0] font-mono min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      <GridBackground />

      {/* ─── NAVBAR ────────────────────────────────────────────────────── */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#050505]/80 backdrop-blur-lg border-b border-white/10 py-4" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group">
            <Orbit className="w-8 h-8 text-cyan-400 group-hover:rotate-180 transition-transform duration-1000" />
            <span className="text-xl font-bold tracking-widest text-white uppercase">MORPH</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-[0.2em] uppercase">
            {["Engine", "Projects", "Stack", "Access"].map((link) => (
              <Link key={link} href="#hero" className="text-zinc-400 hover:text-cyan-400 transition-colors relative group">
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="#hero" className="hidden md:flex items-center justify-center px-6 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all rounded-full">
              Initialize
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden text-white hover:text-cyan-400 transition-colors">
                  <Menu className="w-8 h-8" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0a0a] border-l border-white/10 p-12 text-white">
                <div className="flex flex-col gap-8 mt-20">
                  {["Engine", "Projects", "Stack", "Access"].map((link) => (
                    <Link key={link} href="#hero" className="text-3xl font-bold tracking-widest uppercase hover:text-cyan-400 transition-colors">
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
        <section id="hero" className="relative h-screen min-h-[800px] flex items-center pt-20">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative z-10">
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">{MANIFEST.hero.status}</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-none text-white mb-8">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    MORPH
                  </span><br/>
                  STUDIO.
                </h1>
                
                <p className="max-w-xl text-lg md:text-xl text-zinc-400 leading-relaxed mb-12">
                  {MANIFEST.hero.desc}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-colors flex items-center justify-center gap-3">
                    View Demo Reel <Play className="w-4 h-4" />
                  </button>
                  <button className="px-8 py-4 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors">
                    System Architecture
                  </button>
                </div>
              </Reveal>
            </div>

            {/* 3D Placeholder Graphic */}
            <div className="hidden lg:flex items-center justify-center relative">
              <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative w-[500px] h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-full blur-[80px]" />
                <motion.div 
                  animate={{ rotateY: 360, rotateX: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 border-[2px] border-cyan-400/30 rounded-3xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 border-[2px] border-purple-500/30 rounded-3xl" style={{ transform: "rotateX(90deg)" }} />
                  <div className="absolute inset-0 border-[2px] border-white/20 rounded-3xl" style={{ transform: "rotateY(90deg)" }} />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-black/80 border border-white/20 rounded-full backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.3)]">
                    <Zap className="w-10 h-10 text-cyan-400" />
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ─── SCROLLING STATS MARQUEE ───────────────────────────────────── */}
        <section id="services" className="py-10 border-y border-white/10 bg-black/50 backdrop-blur-md overflow-hidden flex whitespace-nowrap">
          <motion.div 
            animate={{ x: [0, -1000] }} 
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="flex items-center gap-32 px-16 text-2xl font-black uppercase tracking-widest text-zinc-600"
          >
            {Array(4).fill(MANIFEST.stats).flat().map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-cyan-400">{stat.val}</span>
                <span>{stat.label}</span>
                <Disc3 className="w-6 h-6 ml-8 text-zinc-800" />
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── SERVICES (GLASS CARDS) ────────────────────────────────────── */}
        <section className="py-32 relative">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-purple-400 mb-4 block">Core Modules</span>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Capabilities.</span></h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MANIFEST.services.map((service, i) => (
                <Reveal key={service.id} delay={i * 0.1}>
                  <GlassCard className="group">
                    <div className="flex justify-between items-start mb-16">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500">
                        {service.icon}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-600 tracking-widest">{service.id}</span>
                    </div>
                    <h3 className="text-2xl font-bold uppercase tracking-widest mb-4 text-white">{service.title}</h3>
                    <p className="text-zinc-400 leading-relaxed text-sm">{service.desc}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PROJECTS GALLERY ──────────────────────────────────────────── */}
        <section id="realisations" className="py-32 relative">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-end justify-between mb-20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-400 mb-4 block">Case Studies</span>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Rendered <span className="text-zinc-600">Outputs.</span></h2>
                </div>
                <Link href="#realisations" className="hidden md:flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-white transition-colors">
                  View Repository <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {MANIFEST.projects.map((project, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <Link href="#realisations" className="group block">
                    <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 border border-white/10 bg-[#111]">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-60" />
                      <Image src={project.img} alt={project.title} fill className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal" />
                      <div className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-bold uppercase tracking-widest mb-2 text-white group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                        <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">{project.desc}</p>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-zinc-400">
                        {project.tech}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TECH STACK ────────────────────────────────────────────────── */}
        <section className="py-32 border-y border-white/10 bg-gradient-to-b from-black/0 via-cyan-900/10 to-black/0 relative">
          <div className="max-w-[1600px] mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-3xl font-black uppercase tracking-[0.3em] text-zinc-600 mb-16">Technology Stack</h2>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {MANIFEST.stack.map((tech, i) => (
                  <div key={i} className="px-6 py-3 bg-black/50 border border-white/10 rounded-full text-sm font-bold uppercase tracking-widest text-white hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all cursor-default">
                    {tech}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── PRICING ───────────────────────────────────────────────────── */}
        <section id="tarifs" className="py-32 relative">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-purple-400 mb-4 block">Deployment Plans</span>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Licensing <span className="text-zinc-600">Models.</span></h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MANIFEST.pricing.map((tier, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <GlassCard className={`flex flex-col h-full ${tier.recommended ? 'border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.1)]' : ''}`}>
                    {tier.recommended && (
                      <div className="absolute top-6 right-6 px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-cyan-500/30">
                        Optimum
                      </div>
                    )}
                    <h3 className="text-2xl font-bold uppercase tracking-widest mb-2 text-white">{tier.name}</h3>
                    <p className="text-sm text-zinc-400 mb-10 h-10">{tier.desc}</p>
                    <div className="text-5xl font-black tracking-tighter text-white mb-10">
                      {tier.price !== "Custom" && <span className="text-2xl text-zinc-600 mr-2">$</span>}
                      {tier.price}
                    </div>
                    
                    <ul className="space-y-4 mb-12 flex-1">
                      {tier.features.map((feat, j) => (
                        <li key={j} className="flex items-center gap-4 text-sm font-medium text-zinc-300">
                          <Code className="w-4 h-4 text-cyan-400 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${tier.recommended ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'bg-white/5 text-white hover:bg-white border border-white/10 hover:text-black'}`}>
                      Initialize
                    </button>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-32 max-w-[1000px] mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-16">
              <Activity className="w-8 h-8 text-cyan-400" />
              <h2 className="text-4xl font-black uppercase tracking-widest">System Queries</h2>
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {MANIFEST.faq.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-black/40 backdrop-blur-sm px-6 rounded-2xl">
                  <AccordionTrigger className="text-sm font-bold uppercase tracking-widest py-6 hover:text-cyan-400 hover:no-underline text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 leading-relaxed pb-6 text-sm">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </section>

        {/* ─── CTA BANNER ────────────────────────────────────────────────── */}
        <section id="about" className="py-40 relative overflow-hidden border-y border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl aspect-video rounded-full bg-cyan-500/10 blur-[120px] mix-blend-screen animate-pulse" />
          </div>
          
          <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
            <Reveal>
              <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-8">
                Ready to <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Morph?</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
                Initiate a secure connection with our lead engineers to discuss your spatial computing requirements.
              </p>
              <button className="px-12 py-5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                Establish Connection
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer id="contact" className="bg-[#050505] pt-32 pb-12 px-6 md:px-12 relative z-20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-8">
              <Orbit className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold tracking-widest text-white uppercase">MORPH</span>
            </Link>
            <p className="max-w-md text-sm text-zinc-500 leading-relaxed">
              Pioneering the spatial web. We combine aesthetic discipline with extreme technical capabilities to build the digital future.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-8">Protocols</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <li><Link href="#contact" className="hover:text-cyan-400 transition-colors">Documentation</Link></li>
              <li><Link href="#contact" className="hover:text-cyan-400 transition-colors">API Reference</Link></li>
              <li><Link href="#contact" className="hover:text-cyan-400 transition-colors">Status</Link></li>
              <li><Link href="#contact" className="hover:text-cyan-400 transition-colors">GitBranch</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-8">Terminal</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <li><Link href="#contact" className="hover:text-white transition-colors">Transmission</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
          <div>© 2026 MORPH STUDIO INC.</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            ALL SYSTEMS NOMINAL
          </div>
        </div>
      </footer>
    </div>
  )
}
