"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Compass, Map, Layers, Box, Maximize, Globe, Activity, Terminal, Cpu, Monitor, MousePointer2, Navigation, Wifi, Shield, Zap, Mail, Phone, Check, Menu, X, Star, MapPin, Clock, Lock, Plus, Search, Bell, Settings, ArrowRight, ArrowUpRight, ChevronRight, PenTool, Home } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const PROJECTS = [
  {
    id: 1,
    title: "VILLA_AETHER",
    location: "Swiss Alps, CH",
    year: "2025",
    type: "Residential",
    area: "850m²",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    desc: "A brutalist concrete sanctuary suspended over the valley. Zero-carbon geothermal integration.",
  },
  {
    id: 2,
    title: "KINETIC_TOWER",
    location: "Dubai, UAE",
    year: "2024",
    type: "Commercial",
    area: "42,000m²",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    desc: "Adaptive facade systems that react to solar intensity. Real-time thermal optimization.",
  },
  {
    id: 3,
    title: "VOID_STUDIO",
    location: "Tokyo, JP",
    year: "2026",
    type: "Cultural",
    area: "1,200m²",
    img: "https://picsum.photos/seed/realestate/1200/750",
    desc: "Subterranean art gallery utilizing natural light diffraction through glass fissures.",
  },
];

const PHILOSOPHY = [
  {
    title: "Precision",
    desc: "Every millimeter is calculated through generative algorithms for structural peak efficiency.",
    icon: <Compass className="w-5 h-5" />,
  },
  {
    title: "Entropy",
    desc: "Embracing the natural aging of raw materials. Concrete, steel, and glass in dialogue.",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    title: "Sustenance",
    desc: "Autonomous energy systems. Passive cooling. Reclaimed water cycles.",
    icon: <Zap className="w-5 h-5" />,
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================= */

function Reveal({
  children,
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let cur = 0;
    const step = to / 70;
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) {
        setCount(to);
        clearInterval(t);
      } else {
        setCount(Math.floor(cur));
      }
    }, 16);
    return () => clearInterval(t);
  }, [isInView, to]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function MagneticBtn({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    },
    [x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================= */

export default function StructuraArchPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="premium-theme min-h-screen bg-[#0a0a0c] text-white font-mono selection:bg-white selection:text-black overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-black/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 mb-1">
              Modern.
            </span>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white">
              STRUCTURA<span className="text-stone-500">.ARCH</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            <Link
              href="#archive"
              className="hover:text-white transition-colors"
            >
              Archive
            </Link>
            <Link
              href="#philosophy"
              className="hover:text-white transition-colors"
            >
              Philosophy
            </Link>
            <Link
              href="#process"
              className="hover:text-white transition-colors"
            >
              Process
            </Link>
            <Link href="#studio" className="hover:text-white transition-colors">
              Studio
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">
                Global Operations
              </span>
              <span className="text-[11px] font-black text-white/60 flex items-center gap-1">
                12 SITES_ACTIVE <Activity className="w-3 h-3" />
              </span>
            </div>
            <MagneticBtn className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-stone-200 transition-all">
              INQUIRE_PROJECT
            </MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black p-8 pt-32 flex flex-col border-l border-white/5"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/20"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase italic text-stone-500">
              <Link href="#archive" onClick={() => setMenuOpen(false)}>
                Archive
              </Link>
              <Link href="#philosophy" onClick={() => setMenuOpen(false)}>
                Philosophy
              </Link>
              <Link href="#process" onClick={() => setMenuOpen(false)}>
                Process
              </Link>
              <Link href="#studio" onClick={() => setMenuOpen(false)}>
                Studio
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO (Architecture Cinematic)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[100svh] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://picsum.photos/seed/realestate/1600/1000"
            alt="Structura Hero"
            fill
            className="object-cover brightness-50 grayscale-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
        </motion.div>

        {/* GLASSMOPHISM HUD ELEMENT */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 1, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="w-[80vw] h-[80vw] border border-white/5 rounded-full absolute"
          />
          <motion.div
            animate={{ rotate: [0, -1, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="w-[60vw] h-[60vw] border border-white/5 rounded-full absolute"
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-none border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Compass className="w-3.5 h-3.5" />
              Structural Intelligence // Generative Design
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.85] tracking-tighter mb-12 uppercase">
              Void & <br />{" "}
              <span className="text-stone-500 italic">Volume.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/20 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">
              Redefining the relationship between structure and environment.
              Pushing the limits of computational architecture.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn className="px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-stone-200 transition-all cursor-pointer shadow-2xl">
                View Projects
              </MagneticBtn>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer">
                Technical_Audit
              </button>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-12 hidden md:block"
        >
          <div className="flex flex-col items-start gap-3">
            <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">
              AEVIA_STRUCTURA // CORE_SYS_076
            </span>
            <div className="w-32 h-[1px] bg-white/10" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. PHILOSOPHY (Grid)
          ========================================== */}
      <section
        id="philosophy"
        className="py-32 bg-[#0a0a0c] border-y border-white/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center mb-32">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white">
              The <span className="text-stone-500 italic">Core.</span>
            </h2>
          </Reveal>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-16">
          {PHILOSOPHY.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group p-12 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all rounded-3xl h-full flex flex-col justify-between items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-black transition-all">
                  {p.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6 italic">
                  {p.title}
                </h3>
                <p className="text-[11px] text-white/20 leading-relaxed font-bold uppercase tracking-widest italic">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          3. ARCHIVE (Grid/Carousel)
          ========================================== */}
      <section id="archive" className="py-32 bg-[#0a0a0c]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white italic">
                Project <br />{" "}
                <span className="text-stone-500 not-italic">Archive.</span>
              </h2>
            </Reveal>
            <p className="max-w-sm text-sm text-white/10 leading-relaxed font-bold uppercase tracking-widest italic text-right">
              A non-exhaustive list of our structural explorations. Pushing
              materials to their absolute elastic limit.
            </p>
          </div>

          <div className="space-y-32">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
                  <div
                    className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <div
                      onClick={() => setActiveProject(i)}
                      className="relative aspect-[16/10] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border border-white/5"
                    >
                      <Image
                        src={p.img}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2]"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-1000" />
                      <div className="absolute bottom-8 left-8 flex items-center gap-4">
                        <Badge className="bg-white text-black border-none text-[10px] font-black tracking-widest uppercase px-4 py-1.5">
                          {p.year}
                        </Badge>
                        <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-none text-[10px] font-black uppercase tracking-widest text-white/80">
                          {p.area}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500 mb-6 block">
                      0{i + 1} // ARCH_LOG
                    </span>
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic mb-8">
                      {p.title}
                    </h3>
                    <div className="flex gap-12 mb-10 pb-10 border-b border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest mb-1">
                          Location
                        </span>
                        <span className="text-[11px] font-black text-white uppercase">
                          {p.location}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest mb-1">
                          Type
                        </span>
                        <span className="text-[11px] font-black text-white uppercase">
                          {p.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg text-white/30 leading-relaxed font-bold uppercase tracking-tight italic mb-12">
                      {p.desc}
                    </p>
                    <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors group">
                      TECHNICAL_SPECIFICATIONS{" "}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. STATS (Counters)
          ========================================== */}
      <section className="py-24 bg-[#0a0a0c] border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {[
            { label: "Completed_Sites", val: 84, suffix: "+" },
            { label: "Global_Awards", val: 42, suffix: "" },
            { label: "Material_Patents", val: 12, suffix: "" },
            { label: "Square_Meters", val: 1.2, suffix: "M" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-5xl md:text-7xl font-black text-stone-500 mb-4 italic tabular-nums">
                <Counter to={stat.val} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. FAQ (The Buffer)
          ========================================== */}
      <section id="process" className="py-32 bg-[#0a0a0c]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase italic text-white">
              Structural_Audit
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "How do you integrate generative AI in your process?",
                a: "We use proprietary neural networks to run millions of structural simulations, optimizing for wind resistance and thermal efficiency before the first blueprint is drawn.",
              },
              {
                q: "What is your approach to sustainable materials?",
                a: "We prioritize local, low-carbon materials such as cross-laminated timber (CLT) and recycled geopolymer concrete, aiming for negative carbon footprints in every project.",
              },
              {
                q: "Can you handle international project management?",
                a: "Yes. Our Aevia Cloud OS allows for real-time BIM synchronization across global time zones, ensuring seamless coordination between architects, engineers, and site managers.",
              },
              {
                q: "What are your standard consultation fees?",
                a: "Our fee structure is tiered based on project complexity. We typicaly operate on a percentage-of-cost basis or a flat institutional fee for large-scale urban planning.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/5"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-stone-500 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/20 leading-relaxed font-bold uppercase tracking-widest pb-8 italic">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ==========================================
          6. MEGA FOOTER (Premium Minimal)
          ========================================== */}
      <footer className="bg-[#0e0e11] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 mb-1">
                    Modern.
                  </span>
                  <span className="text-2xl font-black tracking-tighter uppercase text-white">
                    STRUCTURA<span className="text-stone-500">.ARCH</span>
                  </span>
                </div>
                <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  Defying gravity through computational precision. Est. 2026. A
                  collective of architects, engineers, and visionaries.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="JOIN_THE_MANIFESTO"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-stone-500 text-white transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
                  >
                    ENROLL
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-10">
                Archive
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Residential
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Commercial
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cultural
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Generative_Labs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-10">
                Philosophy
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    The_Void
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Computational_Peak
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Sustainability_Bonds
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact_Control
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-10">
                Network
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-3"
                  >
                    <Mail className="w-3 h-3" /> Headquarters
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} STRUCTURA ARCHITECTURE Inc.
              </span>
              <Link href="#" className="hover:text-white transition-colors">
                Regulatory_Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy_Buffer
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Zurich // Tokyo // Dubai</span>
              <span>In Volume We Trust</span>
            </div>
          </div>
        </div>
      </footer>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {activeProject !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0e0e11] border border-white/10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-8 right-8 text-white/20 hover:text-stone-500 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* IMAGE AREA */}
              <div className="lg:col-span-8 relative aspect-video lg:aspect-auto bg-black">
                <Image
                  src={PROJECTS[activeProject].img}
                  alt="Project"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-4xl font-black text-white italic">
                    {PROJECTS[activeProject].title}
                  </h3>
                </div>
              </div>

              {/* SIDEBAR AREA */}
              <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-[#0e0e11] border-l border-white/5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-stone-500" />
                    Structural Integrity Report
                  </div>
                  <div className="space-y-6 mb-12">
                    {[
                      { label: "Seismic Rating", val: "A+ Institutional" },
                      {
                        label: "Thermal Efficiency",
                        val: "98.4% Net Positive",
                      },
                      { label: "Material Load", val: "Optimized Composite" },
                      { label: "Generative Seed", val: "0x76_V14" },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b border-white/5 pb-4"
                      >
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                          {spec.label}
                        </span>
                        <span className="text-[10px] font-black text-white uppercase italic">
                          {spec.val}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-tight italic mb-10">
                    {PROJECTS[activeProject].desc}
                  </p>
                </div>

                <button className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all cursor-pointer shadow-xl">
                  REQUEST_FULL_BLUEPRINTS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#0a0a0c}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1)}
      `}</style>
    </div>
  );
}
