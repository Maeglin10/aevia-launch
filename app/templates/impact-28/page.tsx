"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react"
import { Reveal, ScrollImage, projects, services, team } from "./shared"

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [openService, setOpenService] = useState<number | null>(null)

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15])

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
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
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16">
            <div className="flex items-end justify-between">
              <h2 className="font-black text-5xl md:text-7xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                SELECTED<br />WORK
              </h2>
              <Link 
                href="/templates/impact-28/work"
                className="text-sm font-bold uppercase tracking-widest text-black hover:underline underline-offset-4 flex items-center gap-2"
              >
                View full catalogue <ArrowRight className="w-4 h-4" />
              </Link>
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
                <Link href="/templates/impact-28/services" className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-gray-100 transition-colors cursor-pointer">
                  Our methodology <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6">
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
  )
}
