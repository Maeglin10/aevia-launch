"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, ChevronDown, Check, Calendar, MapPin, Layers, Award, Info, FileText } from "lucide-react"

function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-28-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-28-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');`
    document.head.appendChild(style)
  }, [])
}

function ScrollImage({ src, alt, width, height, className = "", dir = 1, yRange = 60 }: {
  src: string; alt: string; width: number; height: number; className?: string; dir?: number; yRange?: number
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-6 * dir, 6 * dir])
  const y = useTransform(scrollYProgress, [0, 1], [-yRange, yRange])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.0, 1.12])
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ rotate, y, scale }}>
        <Image src={src} alt={alt} width={width} height={height} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  )
}

function Reveal({ children, className = "", delay = 0, from = "bottom" }: {
  children: React.ReactNode; className?: string; delay?: number; from?: "bottom" | "left" | "right"
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const initial = from === "left" ? { opacity: 0, x: -40 } : from === "right" ? { opacity: 0, x: 40 } : { opacity: 0, y: 32 }
  return (
    <motion.div ref={ref} initial={initial} animate={inView ? { opacity: 1, x: 0, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

type ActivePage = "home" | "work" | "services" | "studio" | "legal"

const projects = [
  { 
    name: "BLOC K — Social Housing Complex", 
    loc: "Paris 19ème", 
    year: "2024", 
    type: "Residential", 
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop&crop=center",
    area: "8,200 sqm",
    concrete: "CEM III/A with local Seine aggregate",
    structure: "Load-bearing raw concrete facade & precast slabs",
    description: "A compact block designed with raw grey textures and strict modular layouts. Features passive thermal mass management and open-gallery circulation."
  },
  { 
    name: "BUNKER OFFICE — HQ Renovation", 
    loc: "La Défense", 
    year: "2023", 
    type: "Commercial", 
    img: "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=800&h=600&fit=crop&crop=center",
    area: "14,500 sqm",
    concrete: "Recycled aggregate concrete with matte finish",
    structure: "Exposed waffle slabs and central core reinforcement",
    description: "Transformation of a 1980s tower basement into high-concept brutalist workspaces. The raw structural concrete remains visible in all boardrooms."
  },
  { 
    name: "CONCRETE CHAPEL", 
    loc: "Marseille", 
    year: "2023", 
    type: "Cultural", 
    img: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=600&fit=crop&crop=center",
    area: "420 sqm",
    concrete: "Ultra-high performance white concrete with silica sand",
    structure: "Self-supporting monolithic cast-in-place shell",
    description: "A spiritual structure carved from light and stone. Sound is absorbed by raw bush-hammered concrete walls, creating an acoustics sanctuary."
  },
  { 
    name: "SILOS — Mixed Use Development", 
    loc: "Lyon", 
    year: "2022", 
    type: "Mixed Use", 
    img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&h=600&fit=crop&crop=center",
    area: "22,000 sqm",
    concrete: "Raw exposed grey Portland cement",
    structure: "Steel frame integrated with pre-cast ribbed panels",
    description: "Conversion of former grain silos into mixed-use cultural hubs and micro-apartments. Keeps the industrial concrete cylindrical volumes intact."
  },
  { 
    name: "RAW TOWER — Office Tower", 
    loc: "Bordeaux", 
    year: "2022", 
    type: "Commercial", 
    img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&h=600&fit=crop&crop=center",
    area: "31,000 sqm",
    concrete: "High-performance concrete C60/75 with dark dye pigment",
    structure: "Post-tensioned suspended slabs & core shear walls",
    description: "An imposing dark concrete tower asserting its presence on the skyline. Uses horizontal wood-formwork impressions to soften light reflection."
  },
]

const services = [
  { n: "01", title: "Architecture", desc: "New construction from concept to delivery. We design buildings that endure." },
  { n: "02", title: "Urban Planning", desc: "Master plans for districts, campuses, and large-scale developments." },
  { n: "03", title: "Interior Architecture", desc: "Raw material interiors — concrete, steel, glass. No compromise." },
  { n: "04", title: "Heritage Renovation", desc: "Transforming industrial heritage into contemporary programme." },
  { n: "05", title: "Competition", desc: "Architectural competition strategy. We win because we think differently." },
]

const team = [
  { name: "Viktor Brunel", role: "Founding Partner", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
  { name: "Anaïs Cornet", role: "Associate Architect", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" },
  { name: "Marc Delvaux", role: "Urban Planning", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  { name: "Sonia Lehmann", role: "Project Director", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" },
]

export default function Impact28() {
  useFonts()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [openService, setOpenService] = useState<number | null>(null)
  const [page, setPage] = useState<ActivePage>("home")

  // Work page filters & selection
  const [filter, setFilter] = useState<string>("All")
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null)

  // Services page calculator state
  const [calcType, setCalcType] = useState<string>("Residential")
  const [calcArea, setCalcArea] = useState<number>(5000)

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15])

  const goTo = (p: ActivePage) => {
    setPage(p)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  // Calculate project estimates
  const getTimelineEstimates = (type: string, area: number) => {
    let baseMonths = 12
    let baseCost = 2500 // per sqm
    if (type === "Commercial") {
      baseMonths = 18
      baseCost = 3000
    } else if (type === "Cultural") {
      baseMonths = 24
      baseCost = 4200
    } else if (type === "Mixed Use") {
      baseMonths = 20
      baseCost = 2800
    }

    const areaFactor = Math.max(0.5, Math.min(2.5, area / 5000))
    const designMonths = Math.round(6 * areaFactor)
    const constructionMonths = Math.round(baseMonths * areaFactor)
    const totalEstCost = Math.round((area * baseCost) / 1000000) // Millions

    return {
      design: designMonths,
      construction: constructionMonths,
      cost: totalEstCost,
      concreteVolume: Math.round(area * 0.45), // average concrete volume multiplier
    }
  }

  const est = getTimelineEstimates(calcType, calcArea)

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black select-none selection:bg-black selection:text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            onClick={() => goTo("home")}
            className="font-black text-xl tracking-[0.15em] uppercase cursor-pointer transition-transform hover:-translate-y-[2px]" 
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.4rem", letterSpacing: "0.2em" }}
          >
            BRUTCO
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold uppercase tracking-widest">
            <button onClick={() => goTo("work")} className={`hover:underline hover:underline-offset-4 transition-all cursor-pointer ${page === 'work' ? 'underline underline-offset-4' : ''}`}>Work</button>
            <button onClick={() => goTo("services")} className={`hover:underline hover:underline-offset-4 transition-all cursor-pointer ${page === 'services' ? 'underline underline-offset-4' : ''}`}>Services</button>
            <button onClick={() => goTo("studio")} className={`hover:underline hover:underline-offset-4 transition-all cursor-pointer ${page === 'studio' ? 'underline underline-offset-4' : ''}`}>Studio</button>
            <button onClick={() => {
              if (page !== "home") goTo("home")
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }, 100)
            }} className="hover:underline hover:underline-offset-4 transition-all cursor-pointer">Contact</button>
          </div>
          <button 
            onClick={() => {
              if (page !== "home") goTo("home")
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }, 100)
            }} 
            className="hidden md:block bg-black text-white text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-gray-900 transition-colors cursor-pointer border-2 border-black hover:border-gray-900"
          >
            Get in touch →
          </button>
          <button className="md:hidden font-black text-xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t-4 border-black bg-white"
            >
              <div className="px-6 py-4 flex flex-col gap-4 text-sm font-bold uppercase tracking-widest">
                <button onClick={() => goTo("work")} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Work</button>
                <button onClick={() => goTo("services")} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Services</button>
                <button onClick={() => goTo("studio")} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Studio</button>
                <button onClick={() => {
                  setMenuOpen(false)
                  if (page !== "home") goTo("home")
                  setTimeout(() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                }} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Contact</button>
                <button onClick={() => goTo("legal")} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Legal</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HOME PAGE */}
      <div style={{ display: page === "home" ? "block" : "none" }}>
        {/* Hero */}
        <section className="min-h-screen flex flex-col relative pt-[72px] overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=900&fit=crop&crop=center"
                alt="Brutco Architecture"
                fill
                className="object-cover grayscale"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
            <div className="relative h-full flex items-end pb-12 px-6 max-w-7xl mx-auto w-full">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-white"
                >
                  <div className="text-xs font-bold tracking-[0.4em] uppercase mb-6 opacity-70">Paris · Founded 2008</div>
                  <h1 className="font-black leading-[0.85] text-white mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(64px, 12vw, 160px)", letterSpacing: "-0.02em" }}>
                    WE BUILD<br />WHAT<br />MATTERS.
                  </h1>
                </motion.div>
              </div>
            </div>
          </div>
          {/* Black bar stats */}
          <div className="bg-black text-white px-6 py-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { val: "140+", label: "Projects built" },
                { val: "16", label: "Years active" },
                { val: "8", label: "National awards" },
                { val: "€800M+", label: "Construction value" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="font-black text-4xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{val}</div>
                  <div className="text-white/50 text-xs uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section id="work" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="mb-16">
              <div className="flex items-end justify-between">
                <h2 className="font-black text-5xl md:text-7xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  SELECTED<br />WORK
                </h2>
                <button 
                  onClick={() => goTo("work")}
                  className="text-sm font-bold uppercase tracking-widest text-black hover:underline underline-offset-4 flex items-center gap-2"
                >
                  View full catalogue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>

            <div className="space-y-4">
              {projects.slice(0, 3).map((p, i) => (
                <Reveal key={p.name} delay={i * 0.06}>
                  <div
                    className="border-t-4 border-black cursor-pointer group overflow-hidden"
                    onClick={() => setActiveProject(activeProject === i ? null : i)}
                  >
                    <div className="flex items-center justify-between py-6 gap-4">
                      <div className="flex items-center gap-6">
                        <span className="text-gray-300 font-bold text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>0{i + 1}</span>
                        <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight group-hover:translate-x-2 transition-transform" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {p.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <span className="text-sm text-gray-400 font-semibold hidden md:block">{p.type}</span>
                        <span className="text-sm text-gray-400">{p.loc}</span>
                        <span className="font-black text-sm">{p.year}</span>
                        <motion.div animate={{ rotate: activeProject === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                          <ArrowUpRight className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {activeProject === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 320, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <ScrollImage
                            src={p.img}
                            alt={p.name}
                            width={800}
                            height={320}
                            className="w-full h-80"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              ))}
              <div className="border-t-4 border-black" />
            </div>
          </div>
        </section>

        {/* Split section */}
        <section className="py-0 bg-black text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
            <ScrollImage
              src="https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=800&h=600&fit=crop&crop=center"
              alt="Brutco studio"
              width={800}
              height={600}
              className="w-full h-full min-h-[400px]"
              dir={-1}
            />
            <div className="flex items-center px-12 py-16">
              <div>
                <Reveal from="right">
                  <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/40 mb-6">Our approach</div>
                  <h2 className="font-black text-4xl md:text-5xl uppercase leading-[0.9] mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    CONCRETE IS HONEST.<br />WE ARE BRUTAL.
                  </h2>
                  <p className="text-white/60 leading-relaxed mb-8 text-lg">
                    We don't design for awards. We design for people and cities. Brutalism is not a style — it's a conviction that architecture should be truthful about its materials and its purpose.
                  </p>
                  <button onClick={() => goTo("services")} className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-gray-100 transition-colors cursor-pointer">
                    Our methodology <ArrowRight className="w-4 h-4" />
                  </button>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="mb-16">
              <h2 className="font-black text-5xl md:text-7xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                SERVICES
              </h2>
            </Reveal>
            <div className="space-y-0">
              {services.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.06}>
                  <div
                    className="border-t-4 border-black cursor-pointer group"
                    onClick={() => setOpenService(openService === i ? null : i)}
                  >
                    <div className="flex items-start justify-between py-8 gap-4">
                      <div className="flex items-baseline gap-6">
                        <span className="text-gray-200 font-black text-6xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.n}</span>
                        <h3 className="font-black text-2xl md:text-3xl uppercase tracking-tight group-hover:underline" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {s.title}
                        </h3>
                      </div>
                      <motion.div animate={{ rotate: openService === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="mt-2">
                        <ChevronDown className="w-6 h-6" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {openService === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-8 text-gray-500 text-lg max-w-2xl leading-relaxed pl-24">{s.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              ))}
              <div className="border-t-4 border-black" />
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Reveal className="mb-16">
              <h2 className="font-black text-5xl md:text-7xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                MATERIAL<br />TRUTH
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ScrollImage src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=600&h=800&fit=crop&crop=center" alt="Concrete" width={600} height={800} className="rounded-none w-full aspect-[3/4]" dir={-1} yRange={80} />
              <ScrollImage src="https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&h=800&fit=crop&crop=center" alt="Structure" width={600} height={800} className="rounded-none w-full aspect-[3/4] mt-16" dir={1} yRange={60} />
              <ScrollImage src="https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=800&fit=crop&crop=center" alt="Space" width={600} height={800} className="rounded-none w-full aspect-[3/4]" dir={-1} yRange={80} />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="studio" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="mb-16">
              <h2 className="font-black text-5xl md:text-7xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                THE<br />STUDIO
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.1}>
                  <div className="group cursor-default">
                    <div className="aspect-square overflow-hidden mb-4 border-4 border-black">
                      <Image
                        src={m.img}
                        alt={m.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="font-black text-lg uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{m.name}</div>
                    <div className="text-sm text-gray-500 font-semibold uppercase tracking-widest">{m.role}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section className="py-32 px-6 bg-black text-white">
          <div className="max-w-5xl mx-auto text-center">
            <Reveal>
              <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/30 mb-8">Manifesto</div>
              <p className="font-black leading-[0.9] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(36px, 6vw, 80px)" }}>
                "BUILDINGS ARE NOT OBJECTS. THEY ARE THE INFRASTRUCTURE OF HUMAN LIFE."
              </p>
              <div className="text-white/30 text-sm font-semibold uppercase tracking-widest mt-8">— Viktor Brunel, Founding Partner</div>
            </Reveal>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="border-4 border-black p-12 md:p-16">
              <Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <h2 className="font-black text-5xl md:text-6xl uppercase mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      START A<br />PROJECT.
                    </h2>
                    <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                      Every project starts with a conversation. Tell us what you want to build and we'll tell you if we're the right firm.
                    </p>
                    <div className="space-y-2 text-sm font-semibold">
                      <div>contact@brutco-architecture.com</div>
                      <div>+33 1 42 78 91 00</div>
                      <div className="text-gray-400">Main Atelier: Paris, France</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input type="text" placeholder="YOUR NAME" className="w-full border-4 border-black px-5 py-4 font-bold uppercase tracking-widest text-sm focus:outline-none placeholder:text-gray-300" />
                    <input type="email" placeholder="YOUR EMAIL" className="w-full border-4 border-black px-5 py-4 font-bold uppercase tracking-widest text-sm focus:outline-none placeholder:text-gray-300" />
                    <textarea placeholder="DESCRIBE YOUR PROJECT" rows={4} className="w-full border-4 border-black px-5 py-4 font-bold uppercase tracking-widest text-sm focus:outline-none placeholder:text-gray-300 resize-none" />
                    <button className="w-full bg-black text-white font-black uppercase tracking-widest text-sm py-5 hover:bg-gray-900 transition-colors cursor-pointer" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.1rem" }}>
                      SEND MESSAGE →
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      {/* WORK CATALOGUE PAGE */}
      <AnimatePresence>
        {page === "work" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[110px] min-h-screen px-6 pb-24"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="border-b-4 border-black pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-2">Architectural Registry</div>
                  <h1 className="font-black text-5xl md:text-8xl uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    ALL PROJECTS
                  </h1>
                </div>
                <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed">
                  An uncompromising collection of monoliths and structures defined by material honesty.
                </p>
              </div>

              {/* Filtering */}
              <div className="flex flex-wrap gap-3 mb-12">
                {["All", "Commercial", "Residential", "Cultural", "Mixed Use"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilter(cat)
                      setSelectedWorkId(null)
                    }}
                    className={`px-6 py-2 border-4 border-black font-bold uppercase tracking-wider text-xs transition-colors ${
                      filter === cat ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Dynamic blueprint / layout split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Project List */}
                <div className="lg:col-span-7 space-y-4">
                  {projects
                    .filter((p) => filter === "All" || p.type === filter)
                    .map((p, idx) => (
                      <div
                        key={p.name}
                        onClick={() => setSelectedWorkId(idx)}
                        className={`border-4 border-black p-6 cursor-pointer transition-all ${
                          selectedWorkId === idx ? "bg-black text-white translate-x-2" : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-60">{p.type} — {p.loc}</span>
                            <h3 className="font-black text-2xl uppercase mt-1 leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                              {p.name}
                            </h3>
                          </div>
                          <span className="font-black text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.year}</span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Right: Technical Blueprint Specs */}
                <div className="lg:col-span-5">
                  {selectedWorkId !== null ? (
                    <div className="border-4 border-black p-8 bg-black text-white relative sticky top-32">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <span className="font-mono text-xs text-gray-400">PLAN_SPEC_V{selectedWorkId + 1}.EXE</span>
                          <span className="bg-white text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Selected Monolith</span>
                        </div>

                        <div className="aspect-[4/3] relative w-full mb-6 border-2 border-white overflow-hidden bg-gray-950">
                          <Image 
                            src={projects[selectedWorkId].img} 
                            alt={projects[selectedWorkId].name}
                            fill
                            className="object-cover grayscale opacity-85"
                          />
                          {/* Crosshairs */}
                          <div className="absolute top-2 left-2 text-[10px] font-mono text-white/50">SEC_ELEV_0{selectedWorkId + 1}</div>
                          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/50">GRID: B-12</div>
                          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/35 pointer-events-none" />
                          <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-white/35 pointer-events-none" />
                        </div>

                        <h3 className="font-black text-3xl uppercase leading-none mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {projects[selectedWorkId].name}
                        </h3>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                          {projects[selectedWorkId].description}
                        </p>

                        <div className="space-y-3 font-mono text-xs border-t border-white/20 pt-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">TOPOLOGY:</span>
                            <span>{projects[selectedWorkId].type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">TOTAL AREA:</span>
                            <span>{projects[selectedWorkId].area}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">CONCRETE COMPOSITION:</span>
                            <span className="text-right max-w-[200px]">{projects[selectedWorkId].concrete}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">STRUCTURAL SYSTEM:</span>
                            <span className="text-right max-w-[200px]">{projects[selectedWorkId].structure}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-4 border-black p-8 flex flex-col justify-center items-center text-center bg-gray-50 min-h-[400px]">
                      <div className="border-2 border-black border-dashed rounded-full p-4 mb-4">
                        <Layers className="w-8 h-8" />
                      </div>
                      <h4 className="font-black text-xl uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Select a Structure</h4>
                      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                        Click on any project to view its raw technical specification, blueprint drawings, and material matrix.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SERVICES DETAIL PAGE */}
      <AnimatePresence>
        {page === "services" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[110px] min-h-screen px-6 pb-24"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="border-b-4 border-black pb-8 mb-12">
                <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-2">Our Capabilities</div>
                <h1 className="font-black text-5xl md:text-8xl uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  SERVICES & METHODOLOGY
                </h1>
              </div>

              {/* Detailed Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {[
                  {
                    num: "01",
                    title: "ARCHITECTURAL DESIGN",
                    scope: ["Concept Modeling", "Material Sourcing", "Construction Drawings", "Permit Strategy"],
                    body: "End-to-end design from sketch to concrete pouring. We operate with structural honesty as our primary directive, refusing visual compromises."
                  },
                  {
                    num: "02",
                    title: "URBAN MASTERPLANNING",
                    scope: ["District Development", "Campus Masterplans", "Circulation Infrastructure", "Public Commons"],
                    body: "Large-scale layout strategies for public institutions and campuses. We design masterplans that anchor architectural clusters with logical brutalist layouts."
                  },
                  {
                    num: "03",
                    title: "INTERIOR ARCHITECTURE",
                    scope: ["Bespoke Casting", "Ribbed Slabs", "Steel Details", "Exposed Conduits"],
                    body: "We leave steel, concrete, and conduits exposed, making interior systems an integral part of the aesthetic rather than hiding them behind plaster."
                  },
                  {
                    num: "04",
                    title: "HERITAGE REHABILITATION",
                    scope: ["Reinforced Structures", "Industrial Preservation", "Adaptive Reuse", "Masonry Stabilization"],
                    body: "Retrofitting historic industrial relics with modern brutalist interventions, maintaining original material values while upgrading structural safety."
                  },
                  {
                    num: "05",
                    title: "COMPETITION STRATEGY",
                    scope: ["Massing Prototypes", "Structural Studies", "Feasibility Audits", "Render Layouts"],
                    body: "We collaborate with developers and public committees on international tenders, creating robust, cost-effective design solutions."
                  }
                ].map((s) => (
                  <div key={s.num} className="border-4 border-black p-8 bg-white flex flex-col justify-between">
                    <div>
                      <div className="font-black text-6xl text-gray-200 mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.num}</div>
                      <h3 className="font-black text-2xl uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">{s.body}</p>
                    </div>
                    <div className="border-t-2 border-black pt-4">
                      <h4 className="font-bold text-xs uppercase tracking-widest mb-2">Scope of Work:</h4>
                      <ul className="space-y-1.5">
                        {s.scope.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                            <span className="w-1.5 h-1.5 bg-black" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive estimator tool */}
              <div className="border-4 border-black p-8 md:p-12 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/50 mb-2 block">Phase Simulator</span>
                    <h2 className="font-black text-4xl md:text-5xl uppercase leading-none mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      ESTIMATE DESIGN TIMELINE
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-8">
                      Select your topology and specify your target usable area (sqm) to simulate our design phases, concrete volume, and structural planning metrics.
                    </p>

                    <div className="space-y-6">
                      {/* Select Project Type */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-3">Project Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Residential", "Commercial", "Cultural", "Mixed Use"].map((type) => (
                            <button
                              key={type}
                              onClick={() => setCalcType(type)}
                              className={`py-3 border-2 font-bold uppercase tracking-wider text-xs transition-colors ${
                                calcType === type ? "bg-white text-black border-white" : "bg-transparent text-white border-white/30 hover:border-white"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Area Input (sqm) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-3">Target Usable Area ({calcArea.toLocaleString()} sqm)</label>
                        <input 
                          type="range" 
                          min={1000} 
                          max={50000} 
                          step={500} 
                          value={calcArea}
                          onChange={(e) => setCalcArea(parseInt(e.target.value))}
                          className="w-full h-2 bg-white/20 appearance-none cursor-pointer accent-white" 
                        />
                        <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
                          <span>1,000 SQM</span>
                          <span>50,000 SQM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculations breakdown */}
                  <div className="bg-white text-black p-8 border-4 border-white flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-2xl uppercase border-b-2 border-black pb-4 mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        SIMULATED PHASES
                      </h3>

                      <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">SCHEMATIC DESIGN PHASE:</span>
                          <span className="font-bold">{est.design} MONTHS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">CONSTRUCTION TIMELINE:</span>
                          <span className="font-bold">{est.construction} MONTHS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">EST. CONCRETE VOLUME:</span>
                          <span className="font-bold">{est.concreteVolume.toLocaleString()} M³</span>
                        </div>
                        <div className="flex justify-between border-t border-black/10 pt-4 text-base">
                          <span className="text-black font-bold">TOTAL EST. COST:</span>
                          <span className="font-black text-xl">€{est.cost}M — €{Math.round(est.cost * 1.25)}M</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 border-t-2 border-black pt-4 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                      *Estimates are calculated based on raw structural concrete finishes. Actual project metrics will vary.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STUDIO MANIFESTO & TIMELINE PAGE */}
      <AnimatePresence>
        {page === "studio" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[110px] min-h-screen px-6 pb-24"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="border-b-4 border-black pb-8 mb-12">
                <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-2">Our Convictions</div>
                <h1 className="font-black text-5xl md:text-8xl uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  ATELIER & MANIFESTO
                </h1>
              </div>

              {/* Tenets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                  {
                    t: "HONEST MATERIALS",
                    desc: "We work with raw concrete, steel, and industrial glass. We refuse to hide the integrity of materials behind plasterboard or paint."
                  },
                  {
                    t: "STRUCTURAL TRUTH",
                    desc: "The columns, slabs, and shear walls that hold the building up are the architecture itself. Form follows structure."
                  },
                  {
                    t: "MONOLITHIC GEOMETRY",
                    desc: "Mass, weight, and light create spatial meaning. We build block-like forms that capture the shifting paths of natural light."
                  },
                  {
                    t: "ENDURING PURPOSE",
                    desc: "A structure should survive generations. We build with permanent textures that require zero maintenance and age gracefully."
                  }
                ].map((tenet, i) => (
                  <div key={tenet.t} className="border-4 border-black p-6 bg-white">
                    <span className="font-mono text-xs text-gray-400 block mb-4">TENET_0{i + 1}</span>
                    <h3 className="font-black text-xl uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{tenet.t}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{tenet.desc}</p>
                  </div>
                ))}
              </div>

              {/* Philosophy & Timeline split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                <div className="lg:col-span-5">
                  <h2 className="font-black text-4xl uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    FOUNDED IN PARIS, 2008.
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Atelier Brunel was founded by Viktor Brunel in Paris with a simple commitment: to return architecture to its raw, structural roots. Rejecting the glass-and-plasterboard standards of commercial offices, the studio pioneered raw concrete formulations suited for both residential and institutional buildings.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Today, the office comprises 24 architects, engineers, and material scientists, working from three ateliers in Paris, Lyon, and Marseille. We maintain our own aggregate testing facility to ensure concrete composition complies with structural and thermal requirements.
                  </p>
                </div>

                <div className="lg:col-span-7 border-l-4 border-black pl-8 lg:pl-12 space-y-8">
                  <h3 className="font-black text-3xl uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    STUDIO TIMELINE
                  </h3>

                  <div className="space-y-6">
                    {[
                      { y: "2008", t: "Atelier Founded", d: "Viktor Brunel establishes the office in the 10th Arrondissement of Paris." },
                      { y: "2013", t: "First Major Public Commission", d: "Awarded contract for the Lyon Industrial Heritage Silos refurbishment." },
                      { y: "2017", t: "National Brutalist Award", d: "Winner of the Grand Prix d'Architecture for the Concrete Chapel in Marseille." },
                      { y: "2021", t: "Research Laboratory", d: "Launches the 'Material Truth' research program investigating zero-carbon structural concrete." },
                      { y: "2024", t: "140+ Built Projects", d: "Celebrating 16 years of honest structures and expansion to public masterplanning." }
                    ].map((step) => (
                      <div key={step.y} className="relative">
                        <div className="absolute -left-[45px] top-1.5 w-[22px] h-[22px] border-4 border-black bg-white rounded-none" />
                        <span className="font-black text-xl text-black block leading-none mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{step.y}</span>
                        <h4 className="font-bold text-sm uppercase tracking-wide mb-1">{step.t}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed max-w-md">{step.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Team bios */}
              <div className="border-t-4 border-black pt-12">
                <h3 className="font-black text-4xl uppercase mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  ATELIER PARTNERS & DIRECTORS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {team.map((m) => (
                    <div key={m.name} className="border-4 border-black p-4 bg-white">
                      <div className="aspect-square relative w-full mb-4 overflow-hidden border-2 border-black">
                        <Image 
                          src={m.img} 
                          alt={m.name}
                          fill
                          className="object-cover grayscale"
                        />
                      </div>
                      <h4 className="font-black text-lg uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{m.name}</h4>
                      <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{m.role}</span>
                      <p className="text-gray-500 text-xs leading-relaxed mt-3 border-t border-black/10 pt-3">
                        Over 10 years of experience managing complex concrete structures and structural detailing.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEGAL PAGE */}
      <AnimatePresence>
        {page === "legal" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[110px] min-h-screen px-6 pb-24"
          >
            <div className="max-w-3xl mx-auto border-4 border-black p-8 md:p-12 bg-white">
              <h1 className="font-black text-4xl md:text-6xl uppercase mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                LEGAL NOTICE
              </h1>

              <div className="space-y-8 text-sm leading-relaxed text-gray-700">
                <section className="border-b border-black/10 pb-6">
                  <h2 className="font-bold text-xs uppercase tracking-widest text-black mb-3">1. Website Publisher</h2>
                  <p className="font-semibold text-black">Aevia WS — Valentin Milliand</p>
                  <p>SIREN: 852 546 225</p>
                  <p>RCS: Bourg-en-Bresse</p>
                  <p>Email: <a href="mailto:contact@aevia.ws" className="underline hover:text-black">contact@aevia.ws</a></p>
                  <p className="mt-2 text-xs text-gray-400 font-mono">Physical address is available upon request in compliance with local regulations.</p>
                </section>

                <section className="border-b border-black/10 pb-6">
                  <h2 className="font-bold text-xs uppercase tracking-widest text-black mb-3">2. Hosting Provider</h2>
                  <p className="font-semibold text-black">Vercel Inc.</p>
                  <p>Address: 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
                  <p>Website: <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">vercel.com</a></p>
                </section>

                <section className="border-b border-black/10 pb-6">
                  <h2 className="font-bold text-xs uppercase tracking-widest text-black mb-3">3. Intellectual Property</h2>
                  <p>
                    All content, including text, logos, custom vector diagrams, and layout forms presented on this website are protected under international copyright and intellectual property laws. Any reproduction or adaptation without explicit authorization is strictly prohibited.
                  </p>
                </section>

                <section>
                  <h2 className="font-bold text-xs uppercase tracking-widest text-black mb-3">4. Privacy Policy & Data Collection</h2>
                  <p>
                    This showcase template collects no personal tracking data or cookies. Form submissions are simulated locally and no data is shared with external services. For inquiries regarding data protection, reach out to contact@aevia.ws.
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6 border-t-4 border-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div 
            onClick={() => goTo("home")}
            className="font-black text-xl uppercase tracking-[0.2em] cursor-pointer hover:opacity-80" 
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            BRUTCO
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-white/40">
            <button onClick={() => goTo("work")} className="hover:text-white transition-colors cursor-pointer">Work</button>
            <button onClick={() => goTo("services")} className="hover:text-white transition-colors cursor-pointer">Services</button>
            <button onClick={() => goTo("studio")} className="hover:text-white transition-colors cursor-pointer">Studio</button>
            <button onClick={() => goTo("legal")} className="hover:text-white transition-colors cursor-pointer">Privacy & Legal</button>
          </div>
          <div className="text-white/30 text-xs uppercase tracking-widest">© 2026 Brutco Architecture</div>
        </div>
      </footer>
    </div>
  )
}
