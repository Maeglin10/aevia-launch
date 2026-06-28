"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
} from "framer-motion"
import {

  Sparkles,
  Star,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Award,
  Users,
  Check,
} from "lucide-react"

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
        </motion.div>
      ))}

      {/* Parallax hero image overlay */}
      <motion.div style={{ y: bgY, opacity: heroOpacity }} className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80"
              alt="Nail art salon photography"
              fill
              className="object-cover object-center opacity-30"
              sizes="50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FDF2F8] via-[#FDF2F8]/60 to-transparent" />
          </div>
        </div>
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 pt-[80px] w-full"
      >
        <div className="max-w-[640px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EC4899]/10 rounded-full mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
            <span
              className="text-[11px] font-[600] uppercase tracking-[0.3em] text-[#EC4899]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Nail Atelier · Paris 9e
            </span>
          </motion.div>

          <h1
            className="text-[clamp(52px,8vw,96px)] font-[700] italic leading-[0.92] tracking-[-0.02em] text-[#831843] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              L'Art de
            </motion.span>
            <motion.span
              className="block text-[#EC4899]"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              l'Ongle
            </motion.span>
            <motion.span
              className="block not-italic font-[400] text-[#8B5CF6]"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Parfait.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-[16px] font-[300] text-[#9D174D] leading-[1.75] max-w-[460px] mb-10"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Pose gel, nail art sur-mesure et extensions résine dans un salon premium au cœur de Paris. Des mains qui racontent votre style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap gap-4"
          >
            <button className="px-8 py-4 bg-[#EC4899] text-white text-[13px] font-[600] uppercase tracking-[0.12em] rounded-full hover:bg-[#DB2777] transition-all duration-200 shadow-[0_8px_28px_rgba(236,72,153,0.4)] flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              <Calendar className="w-4 h-4" /> Réserver ma séance
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur text-[#831843] text-[13px] font-[500] uppercase tracking-[0.12em] rounded-full border border-[rgba(236,72,153,0.2)] hover:border-[#EC4899] transition-all duration-200 flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              <Heart className="w-4 h-4 text-[#EC4899]" /> Voir le Portfolio
            </button>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            {[
              { icon: Star, label: "4.9/5 — 280+ avis" },
              { icon: Users, label: "3 artistes expertes" },
              { icon: Award, label: "10 ans d'expertise" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#EC4899]" />
                <span className="text-[12px] text-[#9D174D] font-[400]" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#EC4899]/30 flex justify-center pt-2">
          <motion.div
            className="w-1 h-2 rounded-full bg-[#EC4899]"
            animate={{ opacity: [1, 0, 1], y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}

/* ==========================================================================
   SECTION 3: PORTFOLIO FILTERABLE
   ========================================================================== */
function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("Tout")

  const filtered = activeFilter === "Tout"
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((p) => p.category === activeFilter)

  return (
    <section className="py-[100px] bg-[#FFF0F6]" id="portfolio">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal>
          <p
            className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Portfolio
          </p>
          <h2
            className="text-[clamp(36px,5vw,64px)] font-[700] italic text-[#831843] leading-[1.05] mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Nos créations <span className="not-italic font-[400] text-[#8B5CF6]">en images</span>
          </h2>
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-3 mb-12">
            {PORTFOLIO_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-[12px] font-[500] uppercase tracking-[0.1em] transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-[#EC4899] text-white shadow-[0_4px_16px_rgba(236,72,153,0.35)]"
                    : "bg-white text-[#9D174D] border border-[rgba(236,72,153,0.2)] hover:border-[#EC4899]"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {filter}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid with AnimatePresence */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-[16px] bg-white shadow-[0_2px_20px_rgba(236,72,153,0.06)] hover:shadow-[0_8px_40px_rgba(236,72,153,0.15)] transition-all duration-400 cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/${item.img}?w=500&q=75`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5"
                    style={{ background: "linear-gradient(to top, rgba(131,24,67,0.85) 0%, transparent 55%)" }}
                  >
                    <div>
                      <p className="text-white text-[15px] font-[600] italic mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</p>
                      <p className="text-white/70 text-[11px] font-[400]" style={{ fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
                    </div>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-[600] uppercase tracking-[0.1em] text-white"
                      style={{ background: item.accent, fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[15px] font-[500] italic text-[#831843]" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 4: SERVICES
   ========================================================================== */
function ServicesSection() {
  return (
    <section className="py-[100px] bg-white" id="services">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <Reveal>
            <p
              className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Services
            </p>
            <h2
              className="text-[clamp(36px,5vw,64px)] font-[700] italic text-[#831843] leading-[1.05]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Chaque soin,
              <br />
              <span className="not-italic font-[400] text-[#8B5CF6]">un rituel.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              className="text-[14px] text-[#9D174D] max-w-[360px] leading-[1.75] font-[300]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              6 prestations conçues pour sublimer vos ongles avec des produits professionnels et un savoir-faire d'exception.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.07}>
              <div className="group p-7 bg-[#FDF2F8] border border-[rgba(236,72,153,0.1)] rounded-[20px] hover:border-[#EC4899]/40 hover:shadow-[0_8px_40px_rgba(236,72,153,0.12)] transition-all duration-400 cursor-pointer relative overflow-hidden">
                {/* Pink bloom on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-[20px]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#EC4899]/10 flex items-center justify-center group-hover:bg-[#EC4899]/20 transition-colors duration-300">
                      <Sparkles className="w-5 h-5 text-[#EC4899]" />
                    </div>
                    <span
                      className="text-[28px] font-[700] text-[#831843] leading-none"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {service.price}
                    </span>
                  </div>
                  <h3
                    className="text-[20px] font-[600] italic text-[#831843] mb-1.5 leading-[1.2]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Clock className="w-3.5 h-3.5 text-[#EC4899]" />
                    <span className="text-[11px] text-[#BE185D] font-[500] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {service.duration}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#9D174D] leading-[1.7] font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {service.desc}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[12px] font-[600] uppercase tracking-[0.12em]" style={{ fontFamily: "'Inter', sans-serif" }}>Réserver</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 5: ARTISTES
   ========================================================================== */
function ArtistesSection() {
  return (
    <section className="py-[100px] bg-gradient-to-b from-[#FCE7F3] to-[#FDF2F8]" id="artistes">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Notre Équipe
          </p>
          <h2 className="text-[clamp(36px,5vw,64px)] font-[700] italic text-[#831843] leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Les <span className="not-italic text-[#8B5CF6]">Artistes</span>
          </h2>
          <p className="text-[15px] text-[#9D174D] max-w-[520px] mx-auto mt-5 leading-[1.75] font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Trois expertes passionnées, chacune avec sa spécialité, unies par l'amour du détail et la recherche de la perfection.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {ARTISTS.map((artist, i) => (
            <Reveal key={artist.id} delay={i * 0.1}>
              <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_24px_rgba(236,72,153,0.06)] hover:shadow-[0_12px_48px_rgba(236,72,153,0.14)] transition-all duration-500 group">
                {/* Photo area */}
                <div className="relative h-[260px] overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/${artist.img}?w=600&q=80`}
                    alt={artist.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#831843]/60 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="text-white text-[18px] font-[600] italic" style={{ fontFamily: "'Playfair Display', serif" }}>{artist.name}</p>
                    <p className="text-white/80 text-[11px] font-[400] uppercase tracking-[0.1em] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{artist.title}</p>
                  </div>
                </div>

                {/* Info area */}
                <div className="p-6">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-[600] uppercase tracking-[0.1em] mb-5"
                    style={{ background: `${artist.color}14`, color: artist.color, fontFamily: "'Inter', sans-serif" }}
                  >
                    <Award className="w-3 h-3" />
                    {artist.specialty}
                  </div>
                  <p className="text-[13px] text-[#9D174D] leading-[1.7] mb-5 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {artist.bio}
                  </p>
                  {/* Certifications */}
                  <div className="space-y-2 mb-6">
                    {artist.certs.map((cert, ci) => (
                      <div key={ci} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#EC4899] flex-shrink-0" />
                        <span className="text-[12px] text-[#BE185D]" style={{ fontFamily: "'Inter', sans-serif" }}>{cert}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="w-full py-3 text-[12px] font-[600] uppercase tracking-[0.12em] rounded-full border-2 text-[#EC4899] border-[#EC4899] hover:bg-[#EC4899] hover:text-white transition-all duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Réserver avec {artist.name.split(" ")[0]}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 6: BOOKING PROCESS
   ========================================================================== */
function BookingProcess() {
  return (
    <section className="py-[100px] bg-[#831843]" id="soins">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#F9A8D4] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Comment réserver
          </p>
          <h2 className="text-[clamp(36px,5vw,60px)] font-[700] italic text-white leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Simple comme <span className="not-italic font-[400] text-[#F9A8D4]">un clic.</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BOOKING_STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  {/* Number + connector */}
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto relative">
                      <Icon className="w-6 h-6 text-white" />
                      <span
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#EC4899] text-white text-[11px] font-[700] flex items-center justify-center"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    {i < BOOKING_STEPS.length - 1 && (
                      <div className="flex-1 h-[1px] bg-white/15 ml-4 hidden lg:block" />
                    )}
                  </div>
                  <h3
                    className="text-[18px] font-[600] italic text-white mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {step.label}
                  </h3>
                  <p
                    className="text-[13px] text-white/60 font-[300] leading-[1.65]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.4} className="text-center mt-14">
          <button className="px-10 py-4 bg-white text-[#831843] text-[13px] font-[600] uppercase tracking-[0.14em] rounded-full hover:bg-[#F9A8D4] transition-all duration-300 shadow-[0_8px_28px_rgba(0,0,0,0.2)] flex items-center gap-2 mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            <Calendar className="w-4 h-4" /> Prendre rendez-vous maintenant
          </button>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 7: BRANDS
   ========================================================================== */
function BrandsSection() {
  return (
    <section className="py-[80px] bg-white border-t border-b border-[rgba(236,72,153,0.08)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-12">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Produits professionnels
          </p>
          <h2 className="text-[28px] font-[500] italic text-[#831843]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Nous travaillons exclusivement avec les meilleures marques
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {BRANDS.map((brand, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="group p-7 bg-[#FDF2F8] rounded-[20px] border border-[rgba(236,72,153,0.1)] text-center hover:border-[#EC4899]/40 hover:shadow-[0_6px_28px_rgba(236,72,153,0.1)] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#EC4899]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#EC4899]/20 transition-colors duration-300">
                  <Award className="w-5 h-5 text-[#EC4899]" />
                </div>
                <p
                  className="text-[18px] font-[700] italic text-[#831843] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {brand.name}
                </p>
                <p
                  className="text-[11px] text-[#BE185D] font-[400]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {brand.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 8: TÉMOIGNAGES
   ========================================================================== */
function TestimonialsSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-[100px] bg-gradient-to-br from-[#FDF2F8] to-[#F5D0FE]/30" id="temoignages">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Témoignages
          </p>
          <h2 className="text-[clamp(36px,5vw,60px)] font-[700] italic text-[#831843] leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ce qu'elles <span className="not-italic text-[#8B5CF6]">disent</span>
          </h2>
        </Reveal>

        {/* Featured testimonial */}
        <div className="max-w-[820px] mx-auto mb-12">
          <div className="relative bg-white rounded-[28px] shadow-[0_4px_40px_rgba(236,72,153,0.08)] p-10 text-center min-h-[220px] flex flex-col justify-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="w-8 h-8 rounded-full bg-[#EC4899] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <StarRating />
                <div className="flex justify-center mb-5 mt-3" />
                <p
                  className="text-[18px] md:text-[22px] font-[400] italic text-[#831843] leading-[1.55] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  &ldquo;{TESTIMONIALS[active].quote}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] flex items-center justify-center text-white text-[14px] font-[700]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {TESTIMONIALS[active].avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-[600] text-[#831843]" style={{ fontFamily: "'Inter', sans-serif" }}>{TESTIMONIALS[active].name}</p>
                    <p className="text-[12px] text-[#EC4899]" style={{ fontFamily: "'Inter', sans-serif" }}>{TESTIMONIALS[active].service}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mb-16">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "w-8 h-2.5 bg-[#EC4899]" : "w-2.5 h-2.5 bg-[#EC4899]/25"
              }`}
            />
          ))}
        </div>

        {/* All cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div
                onClick={() => setActive(i)}
                className={`p-6 rounded-[20px] border cursor-pointer transition-all duration-300 ${
                  i === active
                    ? "bg-white border-[#EC4899]/40 shadow-[0_4px_24px_rgba(236,72,153,0.12)]"
                    : "bg-white/50 border-[rgba(236,72,153,0.1)] hover:border-[#EC4899]/30"
                }`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 fill-[#EC4899] text-[#EC4899]" />
                  ))}
                </div>
                <p className="text-[13px] italic text-[#9D174D] leading-[1.65] mb-4 font-[400]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  &ldquo;{t.quote.slice(0, 80)}…&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] flex items-center justify-center text-white text-[11px] font-[700]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[12px] font-[600] text-[#831843]" style={{ fontFamily: "'Inter', sans-serif" }}>{t.name}</p>
                    <p className="text-[10px] text-[#EC4899]" style={{ fontFamily: "'Inter', sans-serif" }}>{t.service}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 9: TARIFS COMPLETS
   ========================================================================== */
function TarifsSection() {
  return (
    <section className="py-[100px] bg-white" id="tarifs">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Tarifs
          </p>
          <h2 className="text-[clamp(36px,5vw,64px)] font-[700] italic text-[#831843] leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Grille tarifaire <span className="not-italic font-[400] text-[#8B5CF6]">complète</span>
          </h2>
          <p className="text-[15px] text-[#9D174D] mt-5 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Tous nos prix incluent la consultation initiale et les produits de qualité professionnelle.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FULL_PRICES.map((cat, ci) => (
            <Reveal key={ci} delay={ci * 0.08}>
              <div className="bg-[#FDF2F8] rounded-[20px] p-6 border border-[rgba(236,72,153,0.1)] hover:border-[#EC4899]/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#EC4899]" />
                  <h3
                    className="text-[14px] font-[600] uppercase tracking-[0.1em] text-[#831843]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {cat.category}
                  </h3>
                </div>
                <div className="space-y-3">
                  {cat.items.map((item, ii) => (
                    <div key={ii} className="flex items-center justify-between py-2 border-b border-[rgba(236,72,153,0.08)] last:border-0">
                      <span
                        className="text-[13px] text-[#9D174D] font-[300]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-[14px] font-[700] text-[#EC4899]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-[#FCE7F3] rounded-full">
            <Sparkles className="w-4 h-4 text-[#EC4899]" />
            <p className="text-[12px] text-[#831843] font-[400]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Forfaits mariée & groupe sur devis — Contactez-nous pour un rendez-vous personnalisé
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 10: CONTACT + FOOTER MEGA
   ========================================================================== */
function ContactFooter() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setEmail("")
  }

  return (
    <footer className="bg-[#831843]">
      {/* Contact info band */}
      <div className="py-[80px] border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Address */}
            <Reveal>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-[#F9A8D4]" />
                  <span className="text-[11px] font-[600] uppercase tracking-[0.2em] text-[#F9A8D4]" style={{ fontFamily: "'Inter', sans-serif" }}>Adresse</span>
                </div>
                <p className="text-white text-[14px] font-[300] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  24 rue des Petites Écuries<br />
                  75009 Paris<br />
                  Métro Bonne Nouvelle (L8/9)
                </p>
              </div>
            </Reveal>

            {/* Hours */}
            <Reveal delay={0.1}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-[#F9A8D4]" />
                  <span className="text-[11px] font-[600] uppercase tracking-[0.2em] text-[#F9A8D4]" style={{ fontFamily: "'Inter', sans-serif" }}>Horaires</span>
                </div>
                <div className="space-y-2">
                  {[
                    { j: "Lun", h: "Fermé" },
                    { j: "Mar – Ven", h: "9h – 19h" },
                    { j: "Samedi", h: "9h – 18h" },
                    { j: "Dimanche", h: "Fermé" },
                  ].map(({ j, h }) => (
                    <div key={j} className="flex justify-between items-center">
                      <span className="text-[13px] text-white/60 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>{j}</span>
                      <span className={`text-[13px] font-[400] ${h === "Fermé" ? "text-white/40" : "text-white"}`} style={{ fontFamily: "'Inter', sans-serif" }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Contact */}
            <Reveal delay={0.15}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="w-4 h-4 text-[#F9A8D4]" />
                  <span className="text-[11px] font-[600] uppercase tracking-[0.2em] text-[#F9A8D4]" style={{ fontFamily: "'Inter', sans-serif" }}>Contact</span>
                </div>
                <div className="space-y-3">
                  <a href="tel:+33123456789" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[13px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Phone className="w-3.5 h-3.5" />
                    +33 1 23 45 67 89
                  </a>
                  <a href="mailto:bonjour@velvetnails.fr" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[13px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Mail className="w-3.5 h-3.5" />
                    bonjour@velvetnails.fr
                  </a>
                  <a href="#contact" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[13px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Instagram className="w-3.5 h-3.5" />
                    @velvetnails.paris
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Newsletter */}
            <Reveal delay={0.2}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-4 h-4 text-[#F9A8D4]" />
                  <span className="text-[11px] font-[600] uppercase tracking-[0.2em] text-[#F9A8D4]" style={{ fontFamily: "'Inter', sans-serif" }}>Newsletter</span>
                </div>
                <p className="text-[13px] text-white/60 mb-4 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Collections saisonnières, offres exclusives & conseils beauté.
                </p>
                {sent ? (
                  <div className="flex items-center gap-2 text-[#F9A8D4] text-[13px]">
                    <Check className="w-4 h-4" />
                    <span style={{ fontFamily: "'Inter', sans-serif" }}>Merci, vous êtes inscrite !</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter} className="space-y-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.fr"
                      required
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 text-[13px] focus:outline-none focus:border-[#F9A8D4] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#EC4899] text-white text-[12px] font-[600] uppercase tracking-[0.12em] rounded-lg hover:bg-[#DB2777] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      S'abonner
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>

          {/* Google Maps embed placeholder */}
          <Reveal delay={0.25} className="mt-14">
            <div className="w-full h-[200px] rounded-[16px] overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[#F9A8D4] mx-auto mb-2" />
                <p className="text-white/60 text-[13px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  24 rue des Petites Écuries, 75009 Paris
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-[#F9A8D4] text-[12px] hover:text-white transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Voir sur Google Maps <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="py-6">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F9A8D4]" />
            <span className="text-[15px] font-[500] italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Velvet Nails</span>
            <span className="text-white/40 text-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>· Paris 9e</span>
          </div>
          <p className="text-[11px] text-white/40 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2025 Velvet Nails — Tous droits réservés
          </p>
          <div className="flex gap-5">
            <Link href="/templates/impact-88/mentions-legales" className="text-[11px] text-white/40 hover:text-white/80 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              Mentions légales
            </Link>
            <Link href="/templates/impact-88/confidentialite" className="text-[11px] text-white/40 hover:text-white/80 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              Confidentialité
            </Link>
            <Link href="/templates/impact-88/cgu" className="text-[11px] text-white/40 hover:text-white/80 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ==========================================================================
   SECTION: CONCEPT (ABOUT)
   ========================================================================== */
function AboutSection() {
  return (
    <section className="py-[100px] bg-white border-b border-[rgba(236,72,153,0.08)]" id="concept">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-[0_4px_30px_rgba(236,72,153,0.1)]">
              <Image
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Velvet Nails concept"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <p
                className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Notre Philosophie
              </p>
              <h2
                className="text-[clamp(36px,5vw,56px)] font-[700] italic text-[#831843] leading-[1.1] mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                La beauté <br />
                <span className="not-italic font-[400] text-[#8B5CF6]">jusqu'au bout des doigts.</span>
              </h2>
              <p
                className="text-[15px] text-[#9D174D] leading-[1.8] font-[300] mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Chez Velvet Nails, nous croyons que la manucure est une extension de votre personnalité. Notre salon parisien a été pensé comme un havre de détente où le soin de l'ongle naturel rencontre l'excellence artistique.
              </p>
              <p
                className="text-[15px] text-[#9D174D] leading-[1.8] font-[300] mb-8"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Nous travaillons uniquement avec des marques certifiées respectueuses de la santé de vos ongles (sans composants toxiques) et formons continuellement nos artistes aux dernières techniques de nail art de précision.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[rgba(236,72,153,0.1)]">
                <div>
                  <h4 className="text-[18px] font-[600] italic text-[#831843] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Produits Clean</h4>
                  <p className="text-[12px] text-[#BE185D] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>Sans composants nocifs pour préserver vos ongles.</p>
                </div>
                <div>
                  <h4 className="text-[18px] font-[600] italic text-[#831843] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Nail Art Précis</h4>
                  <p className="text-[12px] text-[#BE185D] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>Des tracés haute définition réalisés au pinceau fin.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION: FAQ
   ========================================================================== */
const FAQS_88 = [
  { q: "Quelle est la différence entre le gel et le semi-permanent ?", a: "Le semi-permanent est un vernis cuit sous lampe UV qui dure 2 à 3 semaines, idéal pour les ongles naturels sains. Le gel permet de renforcer l'ongle, de corriger sa forme ou de l'allonger (extensions) avec une tenue de 3 à 4 semaines." },
  { q: "Vos prestations abîment-elles les ongles naturels ?", a: "Non, si la pose et surtout la dépose sont effectuées correctement. Nous utilisons des techniques douces et des produits de haute qualité. Nous recommandons de faire retirer votre gel ou semi-permanent dans notre salon pour éviter d'arracher la kératine." },
  { q: "Comment se passe la création d'un Nail Art ?", a: "Vous pouvez venir avec des inspirations (photos, motifs, couleurs). Lors de votre rendez-vous, nous prenons quelques minutes pour discuter de votre projet et l'adapter à la longueur et à la forme de vos ongles." },
  { q: "Puis-je annuler ou déplacer mon rendez-vous ?", a: "Oui, vous pouvez modifier ou annuler votre rendez-vous gratuitement jusqu'à 24 heures à l'avance. Au-delà, des frais peuvent s'appliquer conformément à nos conditions." }
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="py-[100px] bg-white border-b border-[rgba(236,72,153,0.08)]" id="faq">
      <div className="max-w-[800px] mx-auto px-6">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>FAQ</p>
          <h2 className="text-[clamp(36px,5vw,56px)] font-[700] italic text-[#831843] leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Questions <span className="not-italic font-[400] text-[#8B5CF6]">Fréquentes</span>
          </h2>
        </Reveal>
        <div className="space-y-4">
          {FAQS_88.map((faq, idx) => (
            <Reveal key={idx} delay={idx * 0.05}>
              <div className="border border-[rgba(236,72,153,0.15)] rounded-[16px] bg-[#FDF2F8]/30 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-[500] text-[#831843] hover:text-[#EC4899] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-light">{openIndex === idx ? "−" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-[14px] text-[#9D174D]/80 leading-relaxed font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION: CONTACT FORM
   ========================================================================== */
function ContactSection() {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  return (
    <section className="py-[100px] bg-[#FFF0F6]" id="contact">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Contact</p>
            <h2 className="text-[clamp(36px,5vw,56px)] font-[700] italic text-[#831843] leading-[1.1] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Écrivez-nous <span className="not-italic font-[400] text-[#8B5CF6]">un message</span>
            </h2>
            <p className="text-[15px] text-[#9D174D] leading-[1.75] font-[300] mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Pour toute demande spécifique, projet de nail art sur-mesure ou question sur nos prestations, n'hésitez pas à nous envoyer un message. Notre équipe vous répondra sous 24h.
            </p>
            <div className="space-y-4 font-[300] text-[#9D174D] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#EC4899]" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#EC4899]" />
                <span>bonjour@velvetnails.fr</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="bg-white rounded-[24px] p-8 border border-[rgba(236,72,153,0.1)] shadow-[0_4px_30px_rgba(236,72,153,0.05)] text-left">
              {contactSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-[#EC4899]/10 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-6 h-6 text-[#EC4899]" />
                  </div>
                  <h3 className="text-[20px] font-[600] italic text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Message envoyé</h3>
                  <p className="text-[#9D174D] text-sm leading-relaxed max-w-xs mx-auto text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Merci, nous vous répondrons sous 24h.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="mt-8 px-6 py-2.5 bg-[#EC4899] text-white text-[12px] font-[600] uppercase tracking-[0.12em] rounded-full hover:bg-[#DB2777] transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Nouveau message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-6 text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <div>
                    <label className="block text-xs font-[600] uppercase tracking-wider text-[#9D174D] mb-2" htmlFor="c-nom">Nom complet</label>
                    <input
                      id="c-nom"
                      type="text"
                      required
                      placeholder="Votre nom"
                      className="w-full bg-[#FDF2F8]/50 border border-[rgba(236,72,153,0.15)] rounded-xl px-4 py-3 text-[#831843] outline-none focus:border-[#EC4899] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-[600] uppercase tracking-wider text-[#9D174D] mb-2" htmlFor="c-email">Email</label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      placeholder="vous@email.com"
                      className="w-full bg-[#FDF2F8]/50 border border-[rgba(236,72,153,0.15)] rounded-xl px-4 py-3 text-[#831843] outline-none focus:border-[#EC4899] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-[600] uppercase tracking-wider text-[#9D174D] mb-2" htmlFor="c-message">Message</label>
                    <textarea
                      id="c-message"
                      rows={4}
                      required
                      placeholder="Votre message..."
                      className="w-full bg-[#FDF2F8]/50 border border-[rgba(236,72,153,0.15)] rounded-xl px-4 py-3 text-[#831843] outline-none focus:border-[#EC4899] focus:bg-white transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#EC4899] text-white text-[12px] font-[600] uppercase tracking-[0.12em] rounded-full hover:bg-[#DB2777] transition-all cursor-pointer shadow-[0_4px_16px_rgba(236,72,153,0.3)]"
                  >
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   PAGE EXPORT
   ========================================================================== */
export default function Impact88Page() {
  useFonts()

  return (
    <main className="bg-[#FDF2F8] text-[#831843] min-h-screen overflow-x-hidden">
      <ScrollProgressBar />
      <Nav />
      <Hero />

      {/* Section: Concept (About) */}
      <AboutSection />

      {/* Section 3: Portfolio */}
      <PortfolioSection />

      {/* Section 4: Services */}
      <ServicesSection />

      {/* Section 5: Artistes */}
      <ArtistesSection />

      {/* Section 6: Booking Process */}
      <BookingProcess />

      {/* Section 7: Brands */}
      <BrandsSection />

      {/* Section 8: Témoignages */}
      <TestimonialsSection />

      {/* Section 9: Tarifs complets */}
      <TarifsSection />

      {/* Section: FAQ */}
      <FaqSection />

      {/* Section: Contact Form */}
      <ContactSection />

      {/* Section 10: Contact + Footer mega */}
      <ContactFooter />
    </main>
  )
}
