"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Reveal, ScrollImage, projects, services, team, testimonials, processSteps } from "./shared"

// Animated counter hook
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let startTime: number
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return { count, ref }
}

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [openService, setOpenService] = useState<number | null>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15])

  const { count: projCount, ref: projRef } = useCounter(140)
  const { count: yearsCount, ref: yearsRef } = useCounter(16)
  const { count: awardsCount, ref: awardsRef } = useCounter(8)
  const { count: sqmCount, ref: sqmRef } = useCounter(800)

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
        {/* Black bar stats — animated counters */}
        <div className="bg-black text-white px-6 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div ref={projRef}>
              <div className="font-black text-4xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{projCount}+</div>
              <div className="text-white/50 text-xs uppercase tracking-widest mt-1">Projects built</div>
            </div>
            <div ref={yearsRef}>
              <div className="font-black text-4xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{yearsCount}</div>
              <div className="text-white/50 text-xs uppercase tracking-widest mt-1">Years active</div>
            </div>
            <div ref={awardsRef}>
              <div className="font-black text-4xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{awardsCount}</div>
              <div className="text-white/50 text-xs uppercase tracking-widest mt-1">National awards</div>
            </div>
            <div ref={sqmRef}>
              <div className="font-black text-4xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>€{sqmCount}M+</div>
              <div className="text-white/50 text-xs uppercase tracking-widest mt-1">Construction value</div>
            </div>
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

      {/* ─── PROCESS STEPS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16">
            <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/30 mb-4">How We Work</div>
            <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              OUR<br />PROCESS
            </h2>
          </Reveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[calc(2.5rem+1px)] top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />

            <div className="space-y-0">
              {processSteps.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.08}>
                  <div className="relative border-t border-white/10 group">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 md:py-12">
                      {/* Number bubble */}
                      <div className="md:col-span-1 flex items-start">
                        <div className="w-10 h-10 border-2 border-white flex items-center justify-center relative z-10 bg-black group-hover:bg-white group-hover:text-black transition-colors duration-300">
                          <span className="font-black text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{step.n}</span>
                        </div>
                      </div>

                      <div className="md:col-span-4">
                        <h3 className="font-black text-2xl md:text-3xl uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {step.phase}
                        </h3>
                        <div className="text-xs font-bold tracking-widest text-white/30 uppercase mt-2">{step.duration}</div>
                      </div>

                      <div className="md:col-span-7">
                        <p className="text-white/60 leading-relaxed text-lg">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
              <div className="border-t border-white/10" />
            </div>
          </div>

          <Reveal className="mt-16">
            <Link
              href="/templates/impact-28/services"
              className="inline-flex items-center gap-3 border-2 border-white text-white font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
            >
              Full methodology <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─── TESTIMONIALS CAROUSEL ──────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-4">Client Accounts</div>
                <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  THEY<br />BUILT WITH US.
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Reveal>

          <div className="relative overflow-hidden min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
              >
                {/* Quote */}
                <div className="lg:col-span-8 border-4 border-black p-8 md:p-12 relative">
                  <div
                    className="font-black text-[100px] leading-none text-gray-100 absolute -top-4 left-6 select-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    "
                  </div>
                  <blockquote className="font-black text-xl md:text-2xl uppercase leading-[1.2] relative z-10 pt-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {testimonials[activeTestimonial].quote}
                  </blockquote>
                  <div className="mt-8 pt-6 border-t-2 border-black flex items-center gap-4">
                    <div className="w-12 h-12 overflow-hidden border-2 border-black shrink-0">
                      <Image
                        src={testimonials[activeTestimonial].img}
                        alt={testimonials[activeTestimonial].author}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div>
                      <div className="font-black text-sm uppercase tracking-wide">{testimonials[activeTestimonial].author}</div>
                      <div className="text-gray-500 text-xs font-semibold uppercase tracking-widest">{testimonials[activeTestimonial].title}</div>
                    </div>
                  </div>
                </div>

                {/* Project ref */}
                <div className="lg:col-span-4">
                  <div className="border-4 border-black bg-black text-white p-8">
                    <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/40 mb-4">Referenced Project</div>
                    <div className="font-black text-xl uppercase leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {testimonials[activeTestimonial].project}
                    </div>
                    <div className="mt-8 w-full aspect-[4/3] relative overflow-hidden border border-white/20">
                      <Image
                        src={projects.find(p => p.name.includes(testimonials[activeTestimonial].project.split("—")[0].trim().toUpperCase()))?.img
                          ?? "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=600&h=400&fit=crop&crop=center"}
                        alt="Project"
                        fill
                        className="object-cover grayscale opacity-80"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-3 mt-10 md:hidden">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`transition-all duration-200 cursor-pointer ${i === activeTestimonial ? "w-6 h-3 bg-black" : "w-3 h-3 border-2 border-black"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Desktop dots */}
          <div className="hidden md:flex items-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`transition-all duration-200 cursor-pointer ${i === activeTestimonial ? "w-6 h-3 bg-black" : "w-3 h-3 border-2 border-black hover:bg-gray-200"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AWARDS TICKER ──────────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-gray-50 border-y-4 border-black py-5">
        <motion.div
          animate={{ x: [0, -2400] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {[...Array(3)].flatMap(() => [
            "GRAND PRIX D'ARCHITECTURE 2024",
            "★",
            "EUROPEAN CONCRETE AWARD 2023",
            "★",
            "PRIX NATIONAL DE LA CONSTRUCTION 2022",
            "★",
            "RIBA INTERNATIONAL PRIZE — SHORTLIST",
            "★",
            "MIES VAN DER ROHE AWARD — NOMINATION",
            "★",
            "EQUERRE D'ARGENT 2015",
            "★",
          ]).map((item, i) => (
            <span
              key={i}
              className={`font-black uppercase tracking-widest text-sm ${item === "★" ? "text-gray-300" : "text-black"}`}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ─── TEAM GRID ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-4">The People</div>
                <h2 className="font-black text-5xl md:text-7xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  ATELIER
                </h2>
              </div>
              <Link href="/templates/impact-28/studio" className="text-sm font-bold uppercase tracking-widest text-black hover:underline underline-offset-4 flex items-center gap-2">
                Full studio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08} className="group cursor-pointer">
                <div className="border-4 border-black overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={m.img}
                      alt={m.name}
                      fill
                      className="object-cover grayscale group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-white text-xs font-bold uppercase tracking-widest">View Profile</div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="font-black text-base uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{m.name}</div>
                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{m.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section className="py-0">
        <div className="relative overflow-hidden min-h-[480px] flex items-center">
          {/* Background image */}
          <ScrollImage
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=700&fit=crop&crop=center"
            alt="CTA architecture"
            width={1600}
            height={700}
            className="absolute inset-0 w-full h-full"
            dir={1}
            yRange={40}
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
            <Reveal>
              <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/30 mb-6">Next Commission</div>
              <h2
                className="font-black leading-[0.85] text-white uppercase mb-10"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(40px, 8vw, 112px)" }}
              >
                HAVE A STRUCTURE<br />IN MIND?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/templates/impact-28/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-black font-black text-sm uppercase tracking-widest px-10 py-5 hover:bg-gray-100 transition-colors cursor-pointer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1rem" }}
                >
                  Start a project <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/templates/impact-28/work"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-black text-sm uppercase tracking-widest px-10 py-5 hover:bg-white hover:text-black transition-colors cursor-pointer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1rem" }}
                >
                  See all work <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── PRESS / MEDIA ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gray-50 border-y-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-10 text-center">As Seen In</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x-4 divide-black border-4 border-black">
            {[
              { pub: "Le Monde", year: "2025" },
              { pub: "Dezeen", year: "2024" },
              { pub: "Domus", year: "2024" },
              { pub: "Le Figaro", year: "2023" },
            ].map(({ pub, year }) => (
              <div key={pub} className="px-8 py-6 flex flex-col items-center justify-center text-center group hover:bg-black hover:text-white transition-colors duration-200 cursor-default">
                <div className="font-black text-xl md:text-2xl uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{pub}</div>
                <div className="text-xs font-bold tracking-widest text-gray-400 group-hover:text-white/50 mt-1">{year}</div>
              </div>
            ))}
          </div>
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
