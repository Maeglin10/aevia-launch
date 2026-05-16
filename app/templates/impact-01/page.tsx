"use client";

import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Menu, X, ChevronDown, Layers, Monitor, Palette, Code2, Sparkles, Star, Quote, Mail, MapPin, Phone } from "lucide-react";
import "../premium.css";

/* --- Data ----------------------------------------------------------- */

const SERVICES = [
  { icon: <Monitor className="w-7 h-7" />, title: "Web Design", desc: "Bespoke interfaces crafted with pixel-perfect precision and strategic UX thinking.", tag: "UI/UX" },
  { icon: <Code2 className="w-7 h-7" />, title: "Development", desc: "High-performance applications built on modern stacks with seamless integrations.", tag: "Engineering" },
  { icon: <Palette className="w-7 h-7" />, title: "Branding", desc: "Distinctive visual identities that resonate deeply with your target audience.", tag: "Identity" },
  { icon: <Layers className="w-7 h-7" />, title: "Strategy", desc: "Data-driven growth strategies that convert visitors into loyal advocates.", tag: "Growth" },
];

const PROJECTS = [
  { id: 1, title: "Aether Labs", category: "Web Ecosystem", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop", color: "#6366f1" },
  { id: 2, title: "Noir Studio", category: "Brand Identity", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop", color: "#f43f5e" },
  { id: 3, title: "Prisme Finance", category: "Fintech App", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop", color: "#10b981" },
  { id: 4, title: "Lumina Health", category: "Healthcare Portal", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop", color: "#3b82f6" },
  { id: 5, title: "Onyx Records", category: "E-commerce", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop", color: "#a855f7" },
];

const TESTIMONIALS = [
  { name: "Clara Dubois", role: "CEO, Aether Labs", quote: "They didn't just build a website — they engineered a conversion machine. Our leads doubled in 8 weeks.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
  { name: "Marcus Chen", role: "CTO, Prisme Finance", quote: "The attention to micro-interactions is insane. Every pixel feels intentional. World-class execution.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  { name: "Sofia Al-Rashid", role: "Founder, Onyx Records", quote: "From concept to launch in 6 weeks. The site performs beautifully and our customers love the experience.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" },
];

const STATS = [
  { value: "200+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15+", label: "Design Awards" },
  { value: "12", label: "Team Members" },
];

/* --- Magnetic Button ------------------------------------------------ */

function MagneticButton({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* --- Scroll Reveal Section ------------------------------------------ */

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --- Main Component ------------------------------------------------- */

export default function AgencyVitrineSPA() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="premium-theme bg-[#050508] text-white min-h-screen selection:bg-violet-500 selection:text-white overflow-x-hidden">

      {/* --- Scroll Progress Bar --- */}
      <motion.div
        style={{ width: progressWidth }}
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 z-[100]"
      />

      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-500">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-6 flex justify-between items-center">
          <Link href="/" className="relative z-50">
            <span className="text-xl font-black tracking-tight">
              NOVA<span className="text-violet-500">.</span>studio
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {["Services", "Portfolio", "About", "Testimonials", "Contact"].map(item => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-violet-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <MagneticButton
              onClick={() => scrollTo("contact")}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Let&apos;s Talk
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#050508]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {["Services", "Portfolio", "About", "Testimonials", "Contact"].map((item, i) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-3xl font-black uppercase tracking-tight hover:text-violet-400 transition-colors"
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===============================================================
          SECTION 1: HERO — Full-screen animated hero with stagger text
         ============================================================= */}
      <section ref={heroRef} id="hero" className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1109543?w=800&q=80"
            fill
            className="object-cover opacity-[0.07]"
            alt="Agency Background"
            priority
          />
        </motion.div>

        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1.2, 1, 1.2] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[150px]"
          />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }} />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 mb-10"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[11px] font-semibold text-violet-300 uppercase tracking-widest">Award-Winning Agency</span>
          </motion.div>

          {/* Hero Title — Stagger Reveal */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black leading-[0.85] tracking-tighter"
            >
              We craft
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.65 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black leading-[0.85] tracking-tighter"
            >
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                digital
              </span>{" "}
              <span className="italic font-serif font-normal">magic.</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-14 leading-relaxed"
          >
            Full-service creative agency specializing in brand strategy, immersive web experiences, and digital products that drive results.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <MagneticButton
              onClick={() => scrollTo("portfolio")}
              className="group px-10 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-full hover:bg-violet-500 hover:text-white transition-all duration-300 flex items-center gap-3"
            >
              View our work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <button
              onClick={() => scrollTo("services")}
              className="px-10 py-4 border border-white/20 rounded-full text-sm font-semibold uppercase tracking-wider hover:border-violet-500 hover:text-violet-400 transition-all"
            >
              Our Services
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-semibold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 text-zinc-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===============================================================
          SECTION 2: STATS BAR
         ============================================================= */}
      <section className="border-y border-white/5 bg-[#08080c]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <RevealSection key={i} delay={i * 0.1} className="text-center">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold">{stat.label}</div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ===============================================================
          SECTION 3: SERVICES — Animated grid with hover effects
         ============================================================= */}
      <section id="services" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <RevealSection className="mb-20">
            <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-4 block">What we do</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]">
              Services built<br />
              <span className="text-zinc-500">for impact.</span>
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="group relative p-8 md:p-12 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 overflow-hidden cursor-pointer">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 70%)" }} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
                        {service.icon}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold px-3 py-1 rounded-full border border-white/5">
                        {service.tag}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-violet-300 transition-colors">{service.title}</h3>
                    <p className="text-zinc-400 leading-relaxed mb-6">{service.desc}</p>
                    <div className="flex items-center gap-2 text-sm text-violet-400 font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Learn more <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===============================================================
          SECTION 4: PORTFOLIO — Horizontal scroll carousel
         ============================================================= */}
      <section id="portfolio" className="py-32 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <RevealSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-4 block">Selected work</span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]">
                  Our latest<br />
                  <span className="italic font-serif font-normal text-zinc-500">projects.</span>
                </h2>
              </div>
              <button className="text-sm font-semibold text-violet-400 flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-wider">
                View all projects <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </RevealSection>
        </div>

        {/* Horizontal Carousel */}
        <div className="relative">
          <motion.div
            className="flex gap-6 px-6 md:px-12 pb-8 overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -1200, right: 0 }}
            style={{ scrollbarWidth: "none" }}
          >
            {PROJECTS.map((project, i) => (
              <RevealSection key={project.id} delay={i * 0.1}>
                <div className="group min-w-[340px] md:min-w-[500px] snap-center">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-zinc-900">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Hover overlay */}
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <span className="px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold" style={{ background: `${project.color}30`, color: project.color, border: `1px solid ${project.color}50` }}>
                        {project.category}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-violet-300 transition-colors">{project.title}</h3>
                  <p className="text-sm text-zinc-500">{project.category}</p>
                </div>
              </RevealSection>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===============================================================
          SECTION 5: ABOUT — Split layout with floating elements
         ============================================================= */}
      <section id="about" className="py-32 md:py-40 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <RevealSection>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1109543?w=800&q=80"
                  alt="Our Team"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -right-4 md:-right-8 bg-violet-600 text-white p-6 rounded-2xl shadow-2xl"
              >
                <div className="text-3xl font-black mb-1">12+</div>
                <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">Years of<br />Experience</div>
              </motion.div>
            </div>
          </RevealSection>

          <RevealSection delay={0.2}>
            <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6 block">About us</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-8">
              We don&apos;t just build websites.
              <span className="text-zinc-500 block mt-2">We build empires.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              Founded in 2014, NOVA studio is a collective of designers, engineers, and strategists who believe that exceptional digital experiences are the cornerstone of modern brand success.
            </p>
            <p className="text-zinc-500 leading-relaxed mb-12">
              We partner with ambitious brands — from seed-stage startups to Fortune 500 — delivering end-to-end solutions that combine aesthetic excellence with measurable business impact.
            </p>

            {/* Mini Feature List */}
            <div className="grid grid-cols-2 gap-6">
              {["Strategic Thinking", "Pixel Perfection", "Clean Code", "Fast Delivery"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-sm font-semibold text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===============================================================
          SECTION 6: TESTIMONIALS — Auto-rotating cards
         ============================================================= */}
      <section id="testimonials" className="py-32 md:py-40 px-6 md:px-12 bg-[#08080c] border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <RevealSection>
            <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-20">
              What our clients<br />
              <span className="italic font-serif font-normal text-zinc-500">say about us.</span>
            </h2>
          </RevealSection>

          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <Quote className="w-10 h-10 text-violet-500/30 mb-8" />
                <p className="text-xl md:text-3xl font-light leading-relaxed mb-10 max-w-3xl italic text-zinc-200">
                  &ldquo;{TESTIMONIALS[activeTestimonial].quote}&rdquo;
                </p>
                <div className="w-14 h-14 rounded-full overflow-hidden mb-4 border-2 border-violet-500">
                  <Image
                    src={TESTIMONIALS[activeTestimonial].avatar}
                    alt={TESTIMONIALS[activeTestimonial].name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-sm font-bold">{TESTIMONIALS[activeTestimonial].name}</div>
                <div className="text-xs text-zinc-500">{TESTIMONIALS[activeTestimonial].role}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-10">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === activeTestimonial ? "bg-violet-500 w-8" : "bg-zinc-700 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===============================================================
          SECTION 7: CONTACT — Split layout with form
         ============================================================= */}
      <section id="contact" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <RevealSection>
            <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-6 block">Get in touch</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-8">
              Ready to start<br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">your project?</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-12">
              Let&apos;s discuss your vision. We typically respond within 24 hours.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Mail className="w-5 h-5" />, label: "Email", value: "hello@nova.studio" },
                { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+33 1 42 86 00 00" },
                { icon: <MapPin className="w-5 h-5" />, label: "Office", value: "12 Rue de Rivoli, Paris" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5 font-semibold">{item.label}</div>
                    <div className="font-semibold group-hover:text-violet-300 transition-colors">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-2 block">First name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-2 block">Last name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-2 block">Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none transition-colors" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-2 block">Project details</label>
                  <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none transition-colors h-36 resize-none" placeholder="Tell us about your project..." />
                </div>
                <MagneticButton className="w-full py-4 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                  Send Message <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </form>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===============================================================
          FOOTER
         ============================================================= */}
      <footer className="border-t border-white/5 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <span className="text-2xl font-black tracking-tight mb-4 block">
                NOVA<span className="text-violet-500">.</span>studio
              </span>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Award-winning creative agency crafting digital experiences that elevate brands and drive measurable growth.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600 mb-6">Navigation</h4>
              <ul className="space-y-3">
                {["Services", "Portfolio", "About", "Contact"].map(item => (
                  <li key={item}>
                    <button onClick={() => scrollTo(item.toLowerCase())} className="text-sm text-zinc-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600 mb-6">Connect</h4>
              <ul className="space-y-3">
                {["Globe", "Globe", "Globe", "LinkedIn"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-zinc-400 hover:text-violet-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
            <span className="text-xs text-zinc-600 mb-4 md:mb-0">&copy; 2026 NOVA Studio. All rights reserved.</span>
            <div className="flex gap-6 text-xs text-zinc-600">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
