"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, X, Menu, Camera, AtSign, Mail, MapPin, ExternalLink, Plus, Minus, ChevronRight } from "lucide-react";
import "../premium.css";

/* ==========================================================================
   DATA
   ========================================================================== */

const PROJECTS = [
  { id: 1, title: "Fluid Horizons", category: "Photography", year: "2026", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop", color: "#6366f1", desc: "Capturing the ephemeral dance between sky and sea along the Icelandic coastline. A study in vastness, silence, and the weight of light at dusk.", role: "Photographer & Art Director", client: "National Geographic", duration: "3 Months" },
  { id: 2, title: "Tokyo Neon", category: "Street", year: "2025", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop", color: "#f43f5e", desc: "A nocturnal exploration of Shinjuku's electric veins — where neon bleeds into rain-slicked asphalt and human stories unfold in 1/125th of a second.", role: "Street Photographer", client: "Personal Project", duration: "6 Weeks" },
  { id: 3, title: "Concrete Poetry", category: "Architecture", year: "2025", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop", color: "#10b981", desc: "Brutalist structures reimagined as sculptural poems. Exploring the tension between mass and void in post-war European architecture.", role: "Architecture Photographer", client: "Wallpaper Magazine", duration: "4 Months" },
  { id: 4, title: "Skin & Silk", category: "Fashion", year: "2024", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop", color: "#d97706", desc: "Editorial series for Maison Lumière's haute couture collection. Merging classical portraiture with contemporary fashion storytelling.", role: "Fashion Photographer", client: "Maison Lumière", duration: "2 Months" },
  { id: 5, title: "Volcanic Silence", category: "Landscape", year: "2024", image: "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?q=80&w=1200&auto=format&fit=crop", color: "#8b5cf6", desc: "The aftermath of eruption — where destruction creates a canvas more beautiful than any human could conceive. Shot over three expeditions.", role: "Documentary Photographer", client: "BBC Earth", duration: "8 Months" },
  { id: 6, title: "Human Form", category: "Portrait", year: "2026", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop", color: "#ec4899", desc: "An intimate portrait series celebrating the raw beauty of the human form — unretouched, unfiltered, unapologetically real.", role: "Portrait Photographer", client: "Vogue Italia", duration: "5 Weeks" },
  { id: 7, title: "Desert Shadows", category: "Landscape", year: "2025", image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=1200&auto=format&fit=crop", color: "#f59e0b", desc: "A minimalist approach to the Sahara. Using harsh midday light to create striking geometric compositions out of shifting dunes.", role: "Photographer", client: "Condé Nast Traveler", duration: "4 Weeks" },
  { id: 8, title: "Urban Pulse", category: "Street", year: "2023", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop", color: "#3b82f6", desc: "The chaos of New York City distilled into frozen moments. A monochrome series focusing on the isolation within the crowd.", role: "Street Photographer", client: "The New Yorker", duration: "3 Months" },
];

const CATEGORIES = ["All", "Photography", "Street", "Architecture", "Fashion", "Landscape", "Portrait"];

const SERVICES = [
  {
    id: "01",
    title: "Editorial Photography",
    desc: "High-end fashion and lifestyle imagery for magazines and global campaigns. Focused on narrative-driven compositions that elevate brand storytelling.",
    colSpan: "lg:col-span-8",
    bgImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Art Direction",
    desc: "Comprehensive visual strategy from concept to final execution, ensuring cohesive brand identity.",
    colSpan: "lg:col-span-4",
    bgImage: "https://images.unsplash.com/photo-1600607688066-890987febe51?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Commercial",
    desc: "Product and brand photography designed to convert, crafted with meticulous attention to lighting and detail.",
    colSpan: "lg:col-span-4",
    bgImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "Portraiture",
    desc: "Intimate, character-driven portraits for artists, executives, and public figures seeking authentic representation.",
    colSpan: "lg:col-span-8",
    bgImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
];

const PROCESS = [
  { phase: "01 / Discovery", title: "Concept & Strategy", desc: "We begin by understanding your vision, target audience, and the core message. We develop moodboards, lighting plans, and a comprehensive shoot strategy to ensure alignment." },
  { phase: "02 / Pre-Production", title: "Planning & Casting", desc: "Securing locations, assembling the creative team (stylists, MUA, set designers), casting talent, and finalizing the call sheet for a seamless shoot day." },
  { phase: "03 / Production", title: "The Shoot", desc: "Executing the vision with precision. Using state-of-the-art medium format cameras and lighting setups to capture high-fidelity imagery on set or on location." },
  { phase: "04 / Post-Production", title: "Retouching & Delivery", desc: "Meticulous color grading, compositing, and high-end retouching to polish the final assets, delivered in all necessary formats for print and digital." },
];

const TESTIMONIALS = [
  { name: "Sarah Jenkins", role: "Creative Director, Vogue", text: "Elena doesn't just take photographs; she crafts cinematic narratives. Her ability to command light and direct talent is unparalleled in the industry today." },
  { name: "Marcus Thorne", role: "Founder, Thorne Architecture", text: "She captured our brutalist structures with a sensitivity we didn't know was possible. The resulting images completely redefined our portfolio presentation." },
  { name: "Claire Dubois", role: "CMO, Maison Lumière", text: "Working with Elena elevated our campaign to fine art. Her pre-production planning is exhaustive, and her execution on set is flawlessly calm and decisive." },
];

const FAQS = [
  { question: "Are you available for international travel?", answer: "Yes. While based between Paris and Tokyo, I frequently travel globally for campaigns and editorial assignments. Travel fees are calculated based on the project scope." },
  { question: "What is your typical turnaround time?", answer: "For editorial and commercial projects, the standard turnaround time for the first contact sheet is 48 hours. Final retouched assets are typically delivered within 2-3 weeks post-shoot." },
  { question: "Do you handle full production?", answer: "Absolutely. I work with a dedicated team of producers who can handle everything from location scouting and casting to permits and catering, offering a turnkey solution." },
  { question: "What camera systems do you use?", answer: "I primarily shoot on Hasselblad medium format digital systems for unparalleled detail and color depth, complemented by Leica systems for documentary and street work." },
  { question: "How do we secure booking dates?", answer: "Dates are secured upon signature of the contract and receipt of a 50% retainer. Given my travel schedule, I recommend booking at least 2-3 months in advance." },
];

const AWARDS = [
  { title: "World Press Photo", year: "2025", category: "Nature" },
  { title: "Sony World Photography", year: "2024", category: "Architecture" },
  { title: "Hasselblad Masters", year: "2024", category: "Fashion" },
  { title: "IPA International", year: "2023", category: "Fine Art" },
  { title: "D&AD Awards", year: "2022", category: "Photography" },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function AccordionItem({ item, isOpen, onClick }: { item: typeof FAQS[0]; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-white/10">
      <button onClick={onClick} className="w-full py-8 flex items-center justify-between text-left group">
        <span className="text-xl md:text-2xl font-light group-hover:text-amber-400 transition-colors pr-8">{item.question}</span>
        <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="absolute w-full h-[1px] bg-white group-hover:bg-amber-400 transition-colors" />
          <motion.div animate={{ rotate: isOpen ? 180 : 90 }} className="absolute w-full h-[1px] bg-white group-hover:bg-amber-400 transition-colors" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
            <p className="pb-8 text-white/50 text-lg leading-relaxed max-w-3xl">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function CreativePortfolioSPA() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, -80]);
  
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  const filtered = activeFilter === "All" ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const selected = selectedProject !== null ? PROJECTS.find(p => p.id === selectedProject) : null;

  return (
    <div className="premium-theme bg-[#0a0a0a] text-white min-h-screen selection:bg-amber-400 selection:text-black overflow-x-hidden font-sans">
      
      {/* Custom Cursor */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="fixed top-0 left-0 w-4 h-4 rounded-full border border-white/30 pointer-events-none z-[200] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden lg:block"
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex justify-between items-center">
          <Link href="/" className="relative z-50 group">
            <span className="text-lg font-light tracking-[0.3em] uppercase transition-colors group-hover:text-amber-400">
              Elena<span className="font-black">Korr</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {["Work", "Expertise", "About", "Process", "Awards", "Contact"].map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-[11px] uppercase tracking-[0.25em] font-medium text-white/50 hover:text-white transition-colors">
                {item}
              </button>
            ))}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8">
            {["Work", "Expertise", "About", "Process", "Awards", "Contact"].map((item, i) => (
              <motion.button key={item} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => scrollTo(item.toLowerCase())} className="text-3xl font-light tracking-wider uppercase hover:text-amber-400 transition-colors">
                {item}
              </motion.button>
            ))}
            <div className="flex gap-6 mt-8">
              <Camera className="w-5 h-5 text-white/50" />
              <AtSign className="w-5 h-5 text-white/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO SECTION
          ========================================== */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: scaleProgress }} className="absolute inset-0 z-0 origin-bottom">
          <Image src="https://picsum.photos/seed/photo/1600/1000" fill className="object-cover" alt="Hero" priority />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, y: heroTextY }} className="relative z-10 text-center px-6 mt-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }}>
            <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.5em] text-white/40 font-medium mb-8">
              <span className="w-8 h-[1px] bg-white/40" /> Visual Storyteller <span className="w-8 h-[1px] bg-white/40" />
            </span>
          </motion.div>

          <div className="overflow-hidden mb-2">
            <motion.h1 initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }} className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-extralight tracking-[-0.04em] leading-[0.85]">
              Elena
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.h1 initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.85 }} className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-black tracking-[-0.04em] leading-[0.85] italic">
              Korr<span className="text-amber-400">.</span>
            </motion.h1>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-base md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
            Capturing the world through a lens of emotion, light, and uncompromising beauty. Cinematic photography for global brands.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 96 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-amber-400 to-transparent origin-top" />
      </section>

      {/* ==========================================
          2. PORTFOLIO GALLERY
          ========================================== */}
      <section id="work" className="py-32 md:py-40 px-6 md:px-12 relative z-10 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-20">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
              <div>
                <span className="flex items-center gap-3 text-amber-400 text-[11px] uppercase tracking-[0.3em] font-semibold mb-6">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Portfolio
                </span>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-none">
                  Selected <span className="font-black italic">Works</span>
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 lg:max-w-xl justify-start xl:justify-end">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-2.5 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all duration-300 ${
                      activeFilter === cat ? "bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div key={activeFilter} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.05}>
                  <div onClick={() => setSelectedProject(project.id)} className={`group cursor-pointer relative overflow-hidden rounded-2xl ${i % 4 === 0 || i % 4 === 3 ? "md:row-span-2 aspect-[3/4]" : "aspect-square"}`}>
                    <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-[1.5s] ease-out grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <div className="flex justify-between items-start">
                        <span className="px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-bold backdrop-blur-md border border-white/20 text-white">
                          {project.category}
                        </span>
                        <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-xl">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-3xl md:text-4xl font-light mb-2">{project.title}</h3>
                        <p className="text-sm font-mono text-white/50">{project.year}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ==========================================
          3. SERVICES BENTO GRID
          ========================================== */}
      <section id="expertise" className="py-32 md:py-40 px-6 md:px-12 border-t border-white/5 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-20">
            <span className="text-amber-400 text-[11px] uppercase tracking-[0.3em] font-semibold mb-6 block">Capabilities</span>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <h2 className="text-5xl md:text-7xl font-extralight tracking-tight leading-none">
                Creative <span className="font-black italic">Expertise</span>
              </h2>
              <p className="text-white/50 max-w-md text-lg font-light leading-relaxed">
                Delivering uncompromising quality across multiple disciplines. Each project is approached with the same cinematic eye and obsessive attention to detail.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {SERVICES.map((srv, i) => (
              <Reveal key={srv.id} delay={i * 0.1} className={srv.colSpan}>
                <div className="group relative h-[400px] rounded-3xl overflow-hidden bg-[#111]">
                  <Image src={srv.bgImage} alt={srv.title} fill className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-10 flex flex-col justify-between">
                    <span className="text-amber-400 font-mono text-xl">{srv.id}</span>
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-3xl md:text-4xl font-light mb-4">{srv.title}</h3>
                      <p className="text-white/60 text-lg font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-xl">
                        {srv.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. ABOUT SECTION
          ========================================== */}
      <section id="about" className="py-32 md:py-40 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white/5">
                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop" alt="Elena Korr" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s]" />
              </div>
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-amber-400 text-black flex items-center justify-center text-center shadow-[0_0_40px_rgba(251,191,36,0.3)] backdrop-blur-md">
                <div>
                  <div className="text-4xl font-black leading-none tracking-tighter">15+</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] font-bold mt-1">Years</div>
                </div>
              </motion.div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-7">
            <span className="text-amber-400 text-[11px] uppercase tracking-[0.3em] font-semibold mb-6 block">About the Artist</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-[1.05] mb-10">
              I see the world in<br />
              <span className="font-black italic">frames of light<span className="text-amber-400">.</span></span>
            </h2>
            <p className="text-white/60 text-xl leading-relaxed mb-8 font-light">
              Based between Paris and Tokyo, I specialize in capturing moments that transcend the ordinary. My work has been featured in National Geographic, Vogue, and BBC Earth — but the images I am most proud of are the ones that make strangers feel something they cannot quite name.
            </p>
            <p className="text-white/40 text-lg leading-relaxed mb-12 font-light">
              With a background in fine arts from École des Beaux-Arts, I bring a deeply personal yet universally resonant perspective. Whether documenting street life in Shinjuku or creating haute couture editorials, I seek the same truth wrapped in beauty.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
              {["Leica M11", "Hasselblad H6D", "Profoto Lighting", "Phase One", "Capture One Pro", "Analog 35mm"].map((gear, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-1 h-1 bg-white/20 group-hover:bg-amber-400 transition-colors" />
                  <span className="text-sm font-mono text-white/50 group-hover:text-amber-400 transition-colors">{gear}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          5. PROCESS TIMELINE
          ========================================== */}
      <section id="process" className="py-32 md:py-40 px-6 md:px-12 border-t border-white/5 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-24 text-center">
            <span className="text-amber-400 text-[11px] uppercase tracking-[0.3em] font-semibold mb-6 block">Methodology</span>
            <h2 className="text-5xl md:text-7xl font-extralight tracking-tight">
              The <span className="font-black italic">Process</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
            <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-white/10" />
            
            {PROCESS.map((proc, i) => (
              <Reveal key={i} delay={i * 0.15} className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-[#111] border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative">
                  <span className="text-amber-400 font-mono text-xl">{proc.phase.split(" ")[0]}</span>
                  <div className="absolute inset-0 rounded-full border border-amber-400/0 hover:border-amber-400/50 scale-110 transition-all duration-500" />
                </div>
                <h3 className="text-2xl font-light mb-4 text-white">{proc.title}</h3>
                <p className="text-white/50 font-light leading-relaxed">{proc.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. TESTIMONIALS MARQUEE
          ========================================== */}
      <section className="py-32 overflow-hidden border-t border-white/5">
        <div className="mb-16 px-6 md:px-12 max-w-[1400px] mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-extralight tracking-tight text-white/50">
             Trusted by visionary <span className="text-white font-medium">brands & agencies</span>
           </h2>
        </div>
        
        <div className="relative flex whitespace-nowrap group">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex gap-8 px-4">
            {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="w-[400px] md:w-[500px] bg-[#111] border border-white/5 p-10 rounded-3xl shrink-0 hover:border-white/20 transition-colors">
                <div className="text-amber-400 mb-6 flex gap-1">
                  {[...Array(5)].map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-xl font-light text-white leading-relaxed mb-8 whitespace-normal">"{t.text}"</p>
                <div>
                  <div className="font-medium text-white">{t.name}</div>
                  <div className="text-sm font-mono text-white/40">{t.role}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          7. AWARDS & PRESS
          ========================================== */}
      <section id="awards" className="py-32 md:py-40 bg-[#07070a] border-t border-white/5">
        <div className="overflow-hidden mb-24 border-y border-white/5 py-8">
          <motion.div animate={{ x: ["-50%", "0%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap">
            {[...Array(4)].map((_, k) => (
              <span key={k} className="text-7xl md:text-9xl font-extralight tracking-tight opacity-[0.03] mx-10 uppercase">
                Awards · Recognition · Press · Exhibitions · 
              </span>
            ))}
          </motion.div>
        </div>

        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <Reveal className="mb-16">
            <span className="text-amber-400 text-[11px] uppercase tracking-[0.3em] font-semibold mb-4 block">Recognition</span>
            <h2 className="text-5xl md:text-7xl font-extralight tracking-tight">
              Selected <span className="font-black italic">Honors</span>
            </h2>
          </Reveal>

          <div className="flex flex-col">
            {AWARDS.map((award, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-white/10 hover:border-amber-400 transition-colors cursor-pointer gap-6">
                  <div className="flex items-center gap-8">
                    <span className="text-4xl font-mono text-white/20 group-hover:text-amber-400 transition-colors w-12">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-2xl md:text-4xl font-light group-hover:text-white transition-colors">{award.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-12 md:w-1/3">
                    <span className="text-lg text-white/40 font-light">{award.category}</span>
                    <span className="text-lg font-mono text-amber-400">{award.year}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. FAQ SECTION
          ========================================== */}
      <section className="py-32 md:py-40 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1000px] mx-auto">
          <Reveal className="mb-16">
            <span className="text-amber-400 text-[11px] uppercase tracking-[0.3em] font-semibold mb-4 block">Information</span>
            <h2 className="text-5xl md:text-7xl font-extralight tracking-tight">
              Frequently Asked <span className="font-black italic">Questions</span>
            </h2>
          </Reveal>

          <div className="border-t border-white/10">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <AccordionItem 
                  item={faq} 
                  isOpen={openFaqIndex === i} 
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} 
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. CONTACT / CTA
          ========================================== */}
      <section id="contact" className="py-32 md:py-40 px-6 md:px-12 relative overflow-hidden bg-amber-400 text-black">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop")', backgroundSize: 'cover' }} />
        
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          <Reveal>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 uppercase italic">
              Let's Shoot.
            </h2>
            <p className="text-black/70 text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-medium">
              Available for commissions, editorial work, and creative collaborations worldwide. Bookings open for Q4 2026.
            </p>
            
            <a href="mailto:hello@elenakorr.com" className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300">
              hello@elenakorr.com <ArrowUpRight className="w-5 h-5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          10. MEGA FOOTER
          ========================================== */}
      <footer className="bg-[#050505] pt-32 pb-12 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="lg:col-span-1">
              <span className="text-3xl font-light tracking-[0.2em] uppercase block mb-6">Elena<span className="font-black">Korr</span></span>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                Fine art and commercial photography studio operating globally. Crafting timeless visual narratives for visionaries.
              </p>
              <div className="flex gap-4">
                {[<AtSign key="tw" className="w-4 h-4"/>, <Camera key="ig" className="w-4 h-4"/>, <Mail key="ml" className="w-4 h-4"/>].map((icon, i) => (
                  <a key={i} href="#work" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-amber-400 hover:text-black transition-colors">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-xs">Studio</h4>
              <ul className="space-y-4 text-white/50 text-sm">
                <li><a href="#contact" className="hover:text-amber-400 transition-colors">12 Rue de Paradis, Paris</a></li>
                <li><a href="#contact" className="hover:text-amber-400 transition-colors">Aoyama, Minato City, Tokyo</a></li>
                <li><a href="tel:+33145678900" className="hover:text-amber-400 transition-colors">+33 (0) 1 45 67 89 00</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-xs">Explore</h4>
              <ul className="space-y-4 text-white/50 text-sm">
                {["Portfolio", "Expertise", "About", "Journal", "Contact"].map(link => (
                  <li key={link}><a href="#contact" className="hover:text-amber-400 transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-xs">Newsletter</h4>
              <p className="text-white/40 text-sm mb-4">Subscribe for studio updates, print releases, and travel dates.</p>
              <form className="relative" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Email address" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 text-white placeholder-white/30 transition-colors" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-amber-400 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-xs text-white/30 uppercase tracking-widest font-mono">
            <span>&copy; {new Date().getFullYear()} Elena Korr Studio</span>
            <div className="flex gap-6">
              <a href="#contact" className="hover:text-white transition-colors">Privacy</a>
              <a href="#contact" className="hover:text-white transition-colors">Terms</a>
              <a href="#contact" className="hover:text-white transition-colors">Credits</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODAL OVERLAY (PROJECT DETAIL)
          ========================================== */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-3xl overflow-y-auto">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              
              <button onClick={() => setSelectedProject(null)} className="fixed top-8 right-8 md:top-12 md:right-12 z-50 w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/10 shadow-2xl">
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full h-[80vh] md:h-[90vh]">
                <Image src={selected.image} alt={selected.title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
              </div>

              <div className="max-w-[1200px] mx-auto px-6 md:px-12 -mt-40 relative z-10 pb-40">
                <span className="px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold mb-8 inline-block backdrop-blur-md" style={{ background: `${selected.color}20`, color: selected.color, border: `1px solid ${selected.color}40` }}>
                  {selected.category}
                </span>
                
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tight mb-8">
                  {selected.title}<span className="text-amber-400 font-black">.</span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-white/70 font-light leading-relaxed max-w-4xl mb-20">
                  {selected.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 border-y border-white/10 py-16 mb-24 bg-white/[0.02] px-8 rounded-3xl">
                  {[
                    { label: "Role", value: selected.role },
                    { label: "Client", value: selected.client },
                    { label: "Duration", value: selected.duration },
                  ].map((meta, i) => (
                    <div key={i}>
                      <div className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-semibold mb-3">{meta.label}</div>
                      <div className="text-xl font-medium text-white">{meta.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-12">
                  <h3 className="text-3xl font-light mb-8">More from this series</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {PROJECTS.filter(p => p.id !== selected.id).slice(0, 2).map(p => (
                      <div key={p.id} className="relative aspect-[16/10] rounded-2xl overflow-hidden group cursor-pointer" onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setSelectedProject(p.id);
                      }}>
                        <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                          <h4 className="text-2xl font-light text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{p.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => setSelectedProject(null)} className="flex items-center gap-3 text-sm uppercase tracking-widest font-semibold text-white/40 hover:text-amber-400 transition-colors mx-auto mt-24">
                  <ArrowLeft className="w-4 h-4" /> Return to Gallery
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
