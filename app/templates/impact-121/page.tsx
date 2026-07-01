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
import { ArrowUpRight, CheckCircle2, Menu, X, Play, ArrowRight, Circle, Square, Triangle, Hexagon, Star, Award, Trophy, Medal } from "lucide-react"

// ─── UTILS & ANIMATION COMPONENTS ─────────────────────────────────────────────

function Reveal({ children, delay = 0, direction = "up", once = true }: { children: React.ReactNode; delay?: number, direction?: "up" | "left" | "right", once?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-80px" })
  
  const y = direction === "up" ? 60 : 0;
  const x = direction === "left" ? 60 : direction === "right" ? -60 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Magnetic({ children, strength = 0.5 }: { children: React.ReactNode; strength?: number }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt, speed = 0.5, className = "" }: { src: string; alt: string; speed?: number; className?: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute top-[-25%] left-0 w-full h-[150%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

// ─── DATA MANIFESTS ─────────────────────────────────────────────────────────

const MANIFEST = {
  hero: {
    headline: "We design digital products that defy the ordinary.",
    sub: "Folio is an independent creative studio based in Stockholm, focusing on art direction, digital product design, and front-end engineering.",
  },
  projects: [
    {
      client: "Aetherial",
      year: "2026",
      role: "Art Direction, WebGL",
      category: "E-Commerce",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80",
      color: "#f3f4f6"
    },
    {
      client: "Vanguard",
      year: "2025",
      role: "Brand Identity, UI/UX",
      category: "Fintech",
      img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1600&q=80",
      color: "#e5e7eb"
    },
    {
      client: "Synapse",
      year: "2025",
      role: "Motion Design",
      category: "SaaS",
      img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=80",
      color: "#d1d5db"
    },
    {
      client: "Chronos",
      year: "2024",
      role: "E-Commerce, Strategy",
      category: "Luxury",
      img: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1600&q=80",
      color: "#9ca3af"
    }
  ],
  services: [
    { title: "Art Direction", items: ["Brand Identity", "Visual Language", "Creative Strategy", "Content Production", "Typography", "Color Theory"] },
    { title: "Product Design", items: ["UI/UX Design", "Wireframing", "Prototyping", "Design Systems", "User Testing", "Information Architecture"] },
    { title: "Engineering", items: ["Front-end Dev", "Creative Coding", "WebGL / Three.js", "Headless CMS", "Performance Optimization", "Micro-interactions"] }
  ],
  awards: [
    { name: "Awwwards", wins: "14x Site of the Day", year: "2023-2026", icon: <Trophy className="w-4 h-4" /> },
    { name: "FWA", wins: "8x FWA of the Day", year: "2024-2026", icon: <Award className="w-4 h-4" /> },
    { name: "Webby", wins: "Best User Interface", year: "2025", icon: <Medal className="w-4 h-4" /> },
    { name: "CSS Design Awards", wins: "Agency of the Year", year: "2025", icon: <Star className="w-4 h-4" /> }
  ],
  culture: [
    { title: "Radical Candor", desc: "We believe in direct, honest feedback to push the work further. No egos, just excellence." },
    { title: "Relentless Iteration", desc: "The first idea is rarely the best. We iterate relentlessly until the solution feels inevitable." },
    { title: "Detail Obsession", desc: "The difference between good and great is in the details. We sweat the micro-interactions." }
  ],
  team: [
    { name: "Elias Valenti", role: "Design Director", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
    { name: "Sarah Chen", role: "Technical Lead", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
    { name: "Marcus Thorne", role: "Creative Strategist", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { name: "Lena Volkov", role: "Motion Designer", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" }
  ],
  pricing: [
    { name: "Consult", price: "5K", desc: "Audit and strategy direction", features: ["UX Audit", "Brand Positioning", "Technical Review", "Actionable Roadmap"] },
    { name: "Sprint", price: "25K", desc: "Intensive 4-week product sprint", features: ["Rapid Prototyping", "Core User Flows", "Visual Direction", "Dev Handoff"], recommended: true },
    { name: "Partner", price: "Custom", desc: "Long-term dedicated team", features: ["Full Product Lifecycle", "Dedicated Squad", "Continuous Integration", "Quarterly Strategy"] }
  ],
  faq: [
    { q: "What is your typical project timeline?", a: "Most product design engagements range from 8 to 16 weeks. Strategy and branding sprints can be completed in 4-6 weeks, while full-scale engineering builds may extend to 6 months depending on scope." },
    { q: "Do you work with startups or enterprises?", a: "Both. We thrive on the agility of early-stage startups needing to establish market presence, and we bring fresh, disruptive thinking to established enterprises looking to innovate." },
    { q: "What is your tech stack?", a: "Our front-end engineering primarily utilizes React, Next.js, Framer Motion, and Tailwind CSS. For 3D and creative coding, we leverage Three.js, React Three Fiber, and WebGL." },
    { q: "How do you handle project management?", a: "We run agile sprints with weekly stand-ups and deliverable reviews. Clients have direct access to our Slack channels and Notion boards for total transparency." },
    { q: "Do you offer post-launch support?", a: "Yes. We offer retainer agreements for ongoing optimization, feature additions, and technical maintenance after the initial launch." }
  ]
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function FolioStudioPage() {
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

  const [scrolled, setScrolled] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const { scrollYProgress } = useScroll()
  
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    
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
return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="bg-white text-zinc-900 font-sans min-h-screen selection:bg-zinc-900 selection:text-white overflow-x-hidden">
      
      {/* ─── NAVBAR ────────────────────────────────────────────────────── */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="text-xl font-bold tracking-tight flex items-center gap-2 group">
            <div className="w-6 h-6 bg-zinc-900 rounded-sm group-hover:rotate-45 transition-transform duration-500" />
            FOLIO
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {["Work", "Services", "Studio", "Contact"].map((link) => (
              <Magnetic key={link}>
                <Link href={`#${link.toLowerCase()}`} className="relative group px-4 py-2">
                  <span className="relative z-10">{link}</span>
                  <span className="absolute inset-0 bg-zinc-100 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 origin-center" />
                </Link>
              </Magnetic>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Magnetic>
              <Link href="#contact" className="hidden md:flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
                Start a project <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
            
            <Sheet>
              <SheetTrigger className="lg:hidden w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                  <Menu className="w-5 h-5" />
                </SheetTrigger>
              <SheetContent side="right" className="bg-white border-none p-12">
                <div className="flex flex-col gap-8 mt-20">
                  {["Work", "Services", "Studio", "Contact"].map((link) => (
                    <Link key={link} href={`#${link.toLowerCase()}`} className="text-5xl font-bold tracking-tighter text-zinc-900 hover:text-zinc-500 transition-colors">
                      {link}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>

      <main>
        {/* ─── HERO ──────────────────────────────────────────────────────── */}
        <section id="hero" className="relative pt-40 md:pt-60 pb-20 px-6 md:px-12 max-w-[1800px] mx-auto min-h-[90vh] flex flex-col justify-center">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-[1400px]">
            <Reveal>
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-medium tracking-tighter leading-[0.9] mb-12">{c?.heroHeadline ?? <>
                Digital craft <br />
                <span className="text-zinc-400">for ambitious brands.</span>
              </>}</h1>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-24 items-end">
              <div className="md:col-span-5 md:col-start-8">
                <Reveal delay={0.2}>
                  <p className="text-xl md:text-2xl text-zinc-600 leading-normal mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
                    {MANIFEST.hero.sub}
                  </>}</p>
                  <div className="flex items-center gap-6">
                    <Magnetic>
                      <button className="w-24 h-24 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300">
                        <ArrowRight className="w-8 h-8" />
                      </button>
                    </Magnetic>
                    <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Scroll to explore</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── SELECTED WORK (HOVER REVEAL) ──────────────────────────────── */}
        <section id="work" className="py-32 px-6 md:px-12 max-w-[1800px] mx-auto">
          <Reveal>
            <div className="flex items-center justify-between mb-20 border-b border-zinc-200 pb-8">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Selected Work</h2>
              <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">2024—2026</span>
            </div>
          </Reveal>

          <div className="flex flex-col relative">
            {/* The floating image reveal logic */}
            <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-40 hidden md:block" style={{ mixBlendMode: 'difference' }}>
              <AnimatePresence>
                {hoveredProject !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[500px] aspect-[4/3] rounded-xl overflow-hidden"
                  >
                    <Image src={MANIFEST.projects[hoveredProject].img} alt="Image de présentation" fill className="object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {MANIFEST.projects.map((project, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Link href="#work" 
                  onMouseEnter={() => setHoveredProject(i)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="group block border-b border-zinc-200 py-12 md:py-16 hover:px-8 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-zinc-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] -z-10" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-6 flex items-center gap-8">
                      <span className="text-sm font-mono text-zinc-400">0{i + 1}</span>
                      <h3 className="text-5xl md:text-7xl font-medium tracking-tighter group-hover:text-zinc-500 transition-colors">{project.client}</h3>
                    </div>
                    <div className="md:col-span-2 text-sm text-zinc-500 font-medium">{project.category}</div>
                    <div className="md:col-span-3 text-sm text-zinc-500 font-medium">{project.role}</div>
                    <div className="md:col-span-1 text-right">
                      <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all ml-auto">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          
          <div className="mt-20 flex justify-center">
            <Magnetic>
              <button className="px-8 py-4 border border-zinc-200 rounded-full font-medium hover:bg-zinc-50 transition-colors flex items-center gap-3">
                View All Archives <ArrowRight className="w-4 h-4" />
              </button>
            </Magnetic>
          </div>
        </section>

        {/* ─── FULL WIDTH IMAGE PARALLAX ─────────────────────────────────── */}
        <section className="py-20">
          <ParallaxImg src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80" alt="Office" className="h-[60vh] md:h-[80vh] w-full" />
        </section>

        {/* ─── SERVICES GRID ─────────────────────────────────────────────── */}
        <section id="services" className="py-32 bg-zinc-50 px-6 md:px-12">
          <div className="max-w-[1800px] mx-auto">
            <Reveal>
              <div className="flex items-center justify-between mb-24 border-b border-zinc-200 pb-8">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Expertise</h2>
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Services</span>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
              {MANIFEST.services.map((service, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div>
                    <h3 className="text-3xl font-medium mb-10 pb-6 border-b border-zinc-200">{service.title}</h3>
                    <ul className="space-y-4">
                      {service.items.map((item, j) => (
                        <li key={j} className="text-lg text-zinc-600 flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── AWARDS & RECOGNITION ──────────────────────────────────────── */}
        <section className="py-32 px-6 md:px-12 max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div>
              <Reveal>
                <h2 className="text-6xl md:text-8xl font-medium tracking-tighter mb-10 leading-none">{c?.aboutTitle ?? fd?.businessName ?? <>
                  Global <br /> Recognition.
                </>}</h2>
                <p className="text-xl text-zinc-500 max-w-md">{c?.aboutText ?? <>
                  Our work doesn't just meet industry standards—it sets them. Recognized by the most prestigious digital awarding bodies.
                </>}</p>
              </Reveal>
            </div>
            <div className="space-y-6">
              {MANIFEST.awards.map((award, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex items-center justify-between p-8 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-zinc-300 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-zinc-900 shadow-sm group-hover:scale-110 transition-transform">
                        {award.icon}
                      </div>
                      <div>
                        <div className="font-bold text-xl">{award.name}</div>
                        <div className="text-zinc-500">{award.wins}</div>
                      </div>
                    </div>
                    <div className="text-sm font-mono text-zinc-400">{award.year}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STUDIO CULTURE ────────────────────────────────────────────── */}
        <section id="studio" className="py-32 bg-zinc-900 text-white px-6 md:px-12">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5">
                <Reveal>
                  <h2 className="text-5xl md:text-7xl font-medium tracking-tighter mb-10">
                    A culture of <br /> extreme craft.
                  </h2>
                  <p className="text-xl text-zinc-400 max-w-md mb-12 leading-relaxed">
                    We're a tight-knit team of specialists who care deeply about the details. We operate with high autonomy and high alignment.
                  </p>
                  <Magnetic>
                    <button className="px-8 py-4 bg-white text-zinc-900 rounded-full font-bold hover:scale-105 transition-transform">
                      Join the team
                    </button>
                  </Magnetic>
                </Reveal>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <Accordion type="single" collapsible className="w-full space-y-6">
                  {MANIFEST.culture.map((item, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <AccordionItem value={`item-${i}`} className="border-zinc-800 bg-zinc-800/30 px-8 rounded-2xl">
                        <AccordionTrigger className="text-2xl font-medium hover:text-zinc-300 py-8 text-left">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-lg text-zinc-400 leading-relaxed pb-8">
                          {item.desc}
                        </AccordionContent>
                      </AccordionItem>
                    </Reveal>
                  ))}
                </Accordion>
              </div>
            </div>

            <div className="mt-32">
              <Reveal>
                <div className="flex items-center justify-between mb-16 border-b border-zinc-800 pb-8">
                  <h3 className="text-3xl font-medium tracking-tight">The Partners</h3>
                </div>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {MANIFEST.team.map((member, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="group cursor-pointer">
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-zinc-800">
                        <Image src={member.img} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                      </div>
                      <h4 className="text-xl font-bold">{member.name}</h4>
                      <p className="text-zinc-400">{member.role}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRICING TIERS ─────────────────────────────────────────────── */}
        <section id="tarifs" className="py-32 px-6 md:px-12 max-w-[1800px] mx-auto">
          <Reveal>
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter mb-6">Engagement Models</h2>
              <p className="text-xl text-zinc-500 max-w-2xl mx-auto">We partner with teams at various stages, offering flexible engagement structures tailored to your immediate needs.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MANIFEST.pricing.map((tier, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`p-10 rounded-3xl border ${tier.recommended ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200'} flex flex-col h-full relative`}>
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-zinc-900 text-white text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-zinc-500 mb-8">{tier.desc}</p>
                  <div className="text-5xl font-medium tracking-tighter mb-10">
                    {tier.price !== "Custom" && <span className="text-2xl text-zinc-400 mr-1">$</span>}
                    {tier.price}
                  </div>
                  
                  <div className="flex-1">
                    <ul className="space-y-4 mb-10">
                      {tier.features.map((feat, j) => (
                        <li key={j} className="flex items-center gap-3 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-zinc-900" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className={`w-full py-4 rounded-xl font-bold transition-all ${tier.recommended ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-white border border-zinc-200 hover:bg-zinc-50'}`}>
                    Start Engagement
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-32 bg-zinc-50 px-6 md:px-12">
          <div className="max-w-[1000px] mx-auto">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-16 text-center">Frequent Questions</h2>
            </Reveal>
            
            <Accordion type="single" collapsible className="w-full">
              {MANIFEST.faq.map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <AccordionItem value={`item-${i}`} className="border-zinc-200">
                    <AccordionTrigger className="text-xl md:text-2xl font-medium py-8 text-left hover:text-zinc-500 transition-colors">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-lg text-zinc-600 leading-relaxed pb-8">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </Reveal>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ─── HUGE FOOTER CTA ───────────────────────────────────────────── */}
        <section id="contact" className="py-32 md:py-40 px-6 md:px-12 bg-zinc-900 text-white rounded-t-[3rem] -mt-10 relative z-20 overflow-hidden">
          {/* Abstract geometric shapes in bg */}
          <div className="absolute top-[-20%] right-[-10%] w-[60%] aspect-square border-[1px] border-white/5 rounded-full" />
          <div className="absolute top-[-10%] right-[-5%] w-[50%] aspect-square border-[1px] border-white/5 rounded-full" />
          
          <div className="max-w-[1800px] mx-auto relative z-10 text-center">
            <Reveal>
              <h2 className="text-7xl md:text-[10rem] font-medium tracking-tighter leading-[0.85] mb-12">
                Let's build <br /> something <span className="text-zinc-500">epic.</span>
              </h2>
              <div className="flex justify-center mb-24">
                <Magnetic strength={0.3}>
                  <Link href={`mailto:${fd?.email ?? "hello@foliostudio.com"}`} className="group flex items-center justify-center w-40 h-40 md:w-48 md:h-48 bg-white text-zinc-900 rounded-full text-xl font-medium hover:scale-110 transition-transform duration-500 shadow-2xl">
                    Get in touch
                  </Link>
                </Magnetic>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left border-t border-white/10 pt-16">
              <div className="md:col-span-2">
                <Link href="#hero" className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-white rounded-sm" />
                  FOLIO
                </Link>
                <p className="text-zinc-400 max-w-sm text-lg">
                  An independent creative studio based in Stockholm, serving global clients.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-6 text-zinc-500 uppercase tracking-widest text-xs">Social</h4>
                <ul className="space-y-3 font-medium text-lg">
                  <li><Link href="#contact" className="hover:text-zinc-400 transition-colors">MessageSquare (X)</Link></li>
                  <li><Link href="#contact" className="hover:text-zinc-400 transition-colors">Camera</Link></li>
                  <li><Link href="#contact" className="hover:text-zinc-400 transition-colors">Dribbble</Link></li>
                  <li><Link href="#contact" className="hover:text-zinc-400 transition-colors">LinkedIn</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-zinc-500 uppercase tracking-widest text-xs">Location</h4>
                <address className="not-italic text-lg font-medium text-zinc-300">
                  Kungsgatan 12<br />
                  111 43 Stockholm<br />
                  Sweden
                </address>
                <div className="mt-6 text-lg font-medium">{fd?.email ?? "hello@foliostudio.com"}</div>
              </div>
            </div>

            <div className="mt-24 flex flex-col md:flex-row items-center justify-between text-zinc-500 font-medium">
              <div>© 2026 Folio Studio. All rights reserved.</div>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="#contact" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="#contact" className="hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
