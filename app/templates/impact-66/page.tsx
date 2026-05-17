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
import { ArrowRight, ArrowUpRight, Star, Check, Menu, X, Globe, Clock, Quote, Search, ShoppingBag, Sparkles, Heart, Scissors, Ruler, Palette, Camera, MapPin, Phone, Mail, Calendar, User, CreditCard, Droplets, Flower2, Brush, Eye, Smile, Zap } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const SERVICES = [
  {
    id: 1,
    name: "Architectural Nails",
    tag: "Sculpted & Structured",
    price: "from €85",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80",
    desc: "A minimalist approach to nail architecture. Focused on structural health and clean aesthetic lines.",
  },
  {
    id: 2,
    name: "Velvet Lashes",
    tag: "Couture Volume",
    price: "from €120",
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80",
    desc: "Weightless silk extensions applied with surgical precision for a natural yet profound gaze.",
  },
  {
    id: 3,
    name: "Pure Facial Ritual",
    tag: "Bio-Active Glow",
    price: "from €145",
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80",
    desc: "Cellular rejuvenation using botanical extracts and lymphatic drainage techniques.",
  },
  {
    id: 4,
    name: "Brow Architecture",
    tag: "Lamination & Tint",
    price: "from €65",
    img: "https://picsum.photos/seed/beauty/1200/750",
    desc: "Framing the face through geometric mapping and custom pigment blending.",
  },
];

const PROTOCOLS = [
  {
    title: "Consultation",
    desc: "Mapping facial geometry and identifying skin bio-types.",
    icon: <Search className="w-5 h-5" />,
  },
  {
    title: "Preparation",
    desc: "Deep thermal cleansing using ozonated steam.",
    icon: <Droplets className="w-5 h-5" />,
  },
  {
    title: "Infusion",
    desc: "Active serum delivery through micro-current technology.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    title: "Regeneration",
    desc: "Cold-pressed botanical mask for immediate recovery.",
    icon: <Flower2 className="w-5 h-5" />,
  },
];

const REVIEWS = [
  {
    author: "Elena V.",
    text: "The most clinical yet calming environment I've ever experienced. My nails have never been this healthy.",
    role: "Paris",
  },
  {
    author: "Sophie L.",
    text: "L'Atelier is more like a laboratory than a salon. The precision is unmatched.",
    role: "Lyon",
  },
  {
    author: "Marc A.",
    text: "The facial ritual is a total sensory reset. My skin feels architectural.",
    role: "Bordeaux",
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

export default function AtelierBeautePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);

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
      className="premium-theme min-h-screen bg-[#faf9f6] text-[#1a1814] font-sans selection:bg-[#c9b7a1] selection:text-white overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-[#faf9f6]/95 backdrop-blur-md py-4 border-b border-[#1a1814]/5 shadow-sm" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-[10px] md:text-[12px] font-light uppercase tracking-[0.6em] text-[#1a1814]/40 mb-1">
              L'Atelier
            </span>
            <span className="text-xl md:text-2xl font-light tracking-[0.5em] uppercase">
              BEAUTÉ
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a1814]/30">
            <Link
              href="#services"
              className="hover:text-[#1a1814] transition-colors"
            >
              Services
            </Link>
            <Link
              href="#rituals"
              className="hover:text-[#1a1814] transition-colors"
            >
              Rituals
            </Link>
            <Link
              href="#philosophie"
              className="hover:text-[#1a1814] transition-colors"
            >
              Philosophie
            </Link>
            <Link
              href="#contact"
              className="hover:text-[#1a1814] transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>PARIS VIII</span>
            </div>
            <MagneticBtn
              onClick={() => setBookingOpen(true)}
              className="px-8 py-3 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#c9b7a1] transition-all shadow-xl"
            >
              RÉSERVER
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
            className="fixed inset-0 z-[100] bg-[#faf9f6] p-8 pt-32 flex flex-col border-l border-black/5"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-light tracking-tighter uppercase italic">
              <Link href="#services" onClick={() => setMenuOpen(false)}>
                Services
              </Link>
              <Link href="#rituals" onClick={() => setMenuOpen(false)}>
                Rituals
              </Link>
              <Link href="#philosophie" onClick={() => setMenuOpen(false)}>
                Atelier
              </Link>
              <Link href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO (Cinematic Beauty)
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
            src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1600&q=80"
            alt="Beauty Hero"
            fill
            className="object-cover brightness-95"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-[#faf9f6]/40" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur rounded-full border border-[#1a1814]/10 text-[#1a1814]/60 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#c9b7a1]" />
              L'Excellence du Soin Architectural
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-light leading-[0.8] tracking-tighter mb-12">
              The Art of <br />{" "}
              <span className="italic font-normal text-[#c9b7a1]">
                Precision.
              </span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-[#1a1814]/40 leading-relaxed font-light mb-12 italic">
              Un sanctuaire dédié à la beauté structurelle. Onglerie, regard et
              rituels visage conçus comme des œuvres d'art.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn
                onClick={() => setBookingOpen(true)}
                className="px-12 py-5 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-[#c9b7a1] transition-all cursor-pointer shadow-2xl"
              >
                Réserver un Soin
              </MagneticBtn>
              <button className="px-12 py-5 border border-[#1a1814]/10 text-[#1a1814] text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-white transition-all cursor-pointer">
                Découvrir la Carte
              </button>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 right-12 hidden md:block"
        >
          <div className="flex flex-col items-end gap-3">
            <span className="text-[9px] font-bold text-[#1a1814]/20 uppercase tracking-[0.5em]">
              PARIS VIII // ATELIER PRIVÉ
            </span>
            <div className="w-24 h-[1px] bg-[#c9b7a1]/40" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. SERVICES (Minimalist Boutique)
          ========================================== */}
      <section
        id="services"
        className="py-32 bg-[#faf9f6] border-y border-[#1a1814]/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#1a1814]/40 mb-6 block">
                La Carte des Soins
              </span>
              <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[0.9]">
                The <br />{" "}
                <span className="italic text-[#c9b7a1]">Signature Edit.</span>
              </h2>
            </Reveal>
            <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/30 leading-relaxed italic text-right">
              Chaque prestation est une immersion dans le détail. Nous utilisons
              exclusivement des produits bio-actifs et des techniques de pointe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <div
                  onClick={() => setActiveService(i)}
                  className="group cursor-pointer bg-white p-2 rounded-2xl shadow-sm border border-[#1a1814]/5 hover:shadow-2xl transition-all"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-[#1a1814]/40 hover:text-red-500 transition-colors shadow-sm">
                      <Heart className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-[#c9b7a1] font-black mb-2">
                      {item.tag}
                    </div>
                    <h3 className="text-xl font-light tracking-tight mb-2 group-hover:text-[#1a1814]/60 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#1a1814]">
                        {item.price}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#1a1814]/20 italic group-hover:text-[#1a1814] transition-colors">
                        Détails →
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. RITUALS (Protocol Deep Dive)
          ========================================== */}
      <section id="rituals" className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#c9b7a1] mb-6 block">
                  Le Protocole Visage
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-12 uppercase">
                  Cellular <br /> <span className="italic">Infusion.</span>
                </h2>
                <p className="text-lg text-[#1a1814]/40 leading-relaxed font-light mb-16 italic max-w-lg">
                  Une approche scientifique du soin. Nous combinons la sagesse
                  botanique aux technologies de micro-courants pour une
                  régénération profonde.
                </p>

                <div className="space-y-8">
                  {PROTOCOLS.map((item, i) => (
                    <div
                      key={i}
                      className="group flex gap-8 items-start border-l border-black/[0.05] pl-8 hover:border-[#c9b7a1] transition-all"
                    >
                      <div className="text-[#c9b7a1] group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-[#1a1814] mb-2">
                          0{i + 1}. {item.title}
                        </h4>
                        <p className="text-[11px] text-[#1a1814]/40 leading-relaxed font-bold uppercase tracking-widest italic">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal className="relative aspect-square md:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80"
                  alt="Beauty Protocol"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#c9b7a1]/10 mix-blend-multiply" />
                <div className="absolute bottom-10 left-10 flex gap-4">
                  <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                    90 MIN RITUAL
                  </div>
                  <div className="px-6 py-3 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-widest shadow-xl">
                    Bio-Active Plus
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. PHILOSOPHIE (Artisan Profile)
          ========================================== */}
      <section
        id="philosophie"
        className="py-32 bg-[#faf9f6] border-y border-[#1a1814]/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal className="max-w-2xl mx-auto mb-24">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#1a1814]/30 mb-6 block">
              Notre Philosophie
            </span>
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase italic mb-8">
              Less but <span className="text-[#c9b7a1]">Better.</span>
            </h2>
            <p className="text-[#1a1814]/40 italic font-medium leading-relaxed">
              Nous croyons en une beauté qui ne s'impose pas. Une esthétique
              naturelle, raffinée et durable.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 items-center">
            <Reveal className="text-left">
              <div className="mb-10 p-10 bg-white border border-black/5 rounded-2xl shadow-sm">
                <Quote className="w-8 h-8 text-[#c9b7a1] mb-6" />
                <p className="text-xl font-light italic leading-relaxed text-[#1a1814]/60 mb-10">
                  "Chaque ongle, chaque cil est une structure. Nous ne faisons
                  pas que de l'esthétique, nous faisons de l'architecture."
                </p>
                <div className="flex items-center gap-6">
                  <Avatar className="w-16 h-16 border-2 border-[#c9b7a1]/20">
                    <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" />
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest">
                      Sophie Laurent
                    </h4>
                    <span className="text-[9px] font-bold text-[#c9b7a1] uppercase tracking-widest">
                      Fondatrice & Head Artisan
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://picsum.photos/seed/beauty/1200/750"
                alt="Atelier Detail"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </Reveal>

            <div className="text-left space-y-12">
              {[
                {
                  t: "Exclusivité",
                  d: "Seulement 6 rdv par jour pour une attention totale.",
                },
                { t: "Ethique", d: "Produits 100% Vegan & Cruelty-Free." },
                {
                  t: "Précision",
                  d: "Techniques japonaises et russes certifiées.",
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-6 group">
                    <div className="w-10 h-10 rounded-full border border-[#c9b7a1]/30 flex items-center justify-center text-[#c9b7a1] group-hover:bg-[#c9b7a1] group-hover:text-white transition-all">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-[#1a1814] mb-2">
                        {item.t}
                      </h4>
                      <p className="text-[11px] text-[#1a1814]/40 leading-relaxed font-bold uppercase tracking-widest italic">
                        {item.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. REVIEWS (Editorial Testimonials)
          ========================================== */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-16">
          {REVIEWS.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-center p-12 bg-[#faf9f6] rounded-3xl border border-black/[0.03] group hover:border-[#c9b7a1]/20 transition-all">
                <div className="flex justify-center gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#c9b7a1] text-[#c9b7a1]"
                    />
                  ))}
                </div>
                <p className="text-lg font-light italic leading-relaxed text-[#1a1814]/50 mb-10">
                  "{r.text}"
                </p>
                <div className="pt-8 border-t border-black/5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">
                    {r.author}
                  </h4>
                  <span className="text-[9px] font-bold text-[#c9b7a1] uppercase tracking-widest">
                    {r.role}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          6. STATS (Counter)
          ========================================== */}
      <section className="py-24 bg-[#1a1814] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {[
            { label: "Clients_Fidèles", val: 1200, suffix: "+" },
            { label: "Soin_Signature", val: 14, suffix: "" },
            { label: "Expertise_Années", val: 12, suffix: "+" },
            { label: "Certification", val: 100, suffix: "%" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-5xl md:text-7xl font-light text-[#c9b7a1] mb-4 italic tabular-nums">
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
          7. FAQ (Accordion)
          ========================================== */}
      <section className="py-32 bg-[#faf9f6]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter leading-none uppercase italic">
              Intel_Buffer
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "Quels produits utilisez-vous ?",
                a: "Nous travaillons exclusivement avec Biologique Recherche et notre propre gamme d'huiles artisanales pressées à froid.",
              },
              {
                q: "Comment se déroule une première séance ?",
                a: "Chaque nouveau client bénéficie d'une consultation de 15 minutes pour analyser la morphologie et les besoins spécifiques.",
              },
              {
                q: "Quelle est votre politique d'annulation ?",
                a: "Toute annulation doit être effectuée 24h à l'avance. Passé ce délai, 50% de la prestation sera facturée.",
              },
              {
                q: "Proposez-vous des cartes cadeaux ?",
                a: "Oui, nos cartes sont disponibles à l'Atelier ou en version digitale, valables sur tous nos rituels.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-black/[0.05]"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-[#c9b7a1] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#1a1814]/40 leading-relaxed font-bold uppercase tracking-widest pb-8 italic">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ==========================================
          8. MEGA FOOTER (Premium Minimal)
          ========================================== */}
      <footer className="bg-[#1a1814] pt-32 pb-12 px-6 md:px-12 relative overflow-hidden text-white">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/30 mb-1">
                    L'Atelier
                  </span>
                  <span className="text-2xl font-light tracking-[0.4em] uppercase">
                    BEAUTÉ
                  </span>
                </div>
                <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  Une exploration architecturale de la beauté. Précision, pureté
                  et rituels d'exception au cœur de Paris.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="EMAIL_AUTHENTICATION"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-[#c9b7a1] text-white transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#c9b7a1] hover:text-white transition-colors uppercase tracking-[0.3em]"
                  >
                    ENROLL
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9b7a1] mb-10">
                Services
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors"
                  >
                    Nail_Architecture
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors"
                  >
                    Lash_Couture
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors"
                  >
                    Ritual_Facials
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors"
                  >
                    Brow_Geometry
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9b7a1] mb-10">
                L'Atelier
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors"
                  >
                    Philosophie
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors"
                  >
                    Nos_Artisans
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors"
                  >
                    Carte_Cadeau
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors"
                  >
                    Presse_Buffer
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9b7a1] mb-10">
                Network
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> X_Protocol
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#c9b7a1] transition-colors flex items-center gap-3"
                  >
                    <Mail className="w-3 h-3" /> Contact_IRL
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} L'Atelier de Beauté SAS.
              </span>
              <Link href="#" className="hover:text-white transition-colors">
                Regulatory_Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy_Buffer
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Paris VIII // Lyon // Bordeaux</span>
              <span>The Art of Precision</span>
            </div>
          </div>
        </div>
      </footer>

      {/* BOOKING MODAL */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="bg-[#faf9f6] border border-[#1a1814]/10 max-w-2xl p-12 rounded-3xl shadow-2xl relative text-[#1a1814]">
          <button
            onClick={() => setBookingOpen(false)}
            className="absolute top-8 right-8 text-[#1a1814]/20 hover:text-[#c9b7a1] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9b7a1] mb-4 block">
              Espace Réservation
            </span>
            <h3 className="text-4xl font-light uppercase tracking-tighter italic">
              Book your Ritual.
            </h3>
          </div>

          <Tabs defaultValue="service" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-10 bg-black/5 p-1 rounded-full">
              <TabsTrigger
                value="service"
                className="rounded-full text-[9px] uppercase tracking-widest font-black data-[state=active]:bg-white"
              >
                1. Service
              </TabsTrigger>
              <TabsTrigger
                value="date"
                className="rounded-full text-[9px] uppercase tracking-widest font-black data-[state=active]:bg-white"
              >
                2. Date
              </TabsTrigger>
              <TabsTrigger
                value="confirm"
                className="rounded-full text-[9px] uppercase tracking-widest font-black data-[state=active]:bg-white"
              >
                3. Confirm
              </TabsTrigger>
            </TabsList>

            <TabsContent value="service" className="space-y-4">
              {SERVICES.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center p-6 border border-black/5 hover:border-[#c9b7a1] rounded-2xl cursor-pointer group transition-all"
                >
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">
                      {s.name}
                    </h4>
                    <span className="text-[10px] text-[#1a1814]/40 font-bold uppercase tracking-widest">
                      {s.tag}
                    </span>
                  </div>
                  <span className="text-sm font-black text-[#c9b7a1]">
                    {s.price}
                  </span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="date" className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#1a1814]/30">
                  Select Date
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(14)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded-xl text-[10px] font-bold cursor-pointer border ${i === 3 ? "bg-[#1a1814] text-white" : "border-black/5 hover:border-[#c9b7a1]"}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#1a1814]/30">
                  Select Time
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map(
                    (t) => (
                      <div
                        key={t}
                        className="py-3 px-4 border border-black/5 rounded-xl text-[10px] font-bold text-center cursor-pointer hover:border-[#c9b7a1]"
                      >
                        {t}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="confirm" className="space-y-8 py-10">
              <div className="p-8 bg-black/5 rounded-2xl space-y-4">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest border-b border-black/5 pb-2">
                  <span className="text-[#1a1814]/40">Service</span>
                  <span>Architectural Nails</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest border-b border-black/5 pb-2">
                  <span className="text-[#1a1814]/40">Date</span>
                  <span>12 Mai 2026 @ 14:00</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest pt-2">
                  <span className="text-[#1a1814]/40">Total</span>
                  <span className="text-[#c9b7a1]">85.00 €</span>
                </div>
              </div>
              <button className="w-full py-5 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#c9b7a1] transition-all">
                Finaliser la Réservation
              </button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <style>{`::-webkit-scrollbar{width:4px;background:#faf9f6}::-webkit-scrollbar-thumb{background:#c9b7a140}`}</style>
    </div>
  );
}
