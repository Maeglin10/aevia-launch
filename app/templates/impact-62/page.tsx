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
import { ArrowRight, ArrowUpRight, Star, Check, Menu, X, Clock, MapPin, Phone, Mail, ChevronDown, ChevronRight, ShieldCheck, Globe, Quote, Search, ShoppingBag, Zap, BookOpen, Utensils, Wine, Coffee, Flame, Camera, Palette, Ruler, Layers, Activity, FlaskConical } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const MENUS = [
  {
    id: 1,
    category: "The Beginning",
    items: [
      {
        name: "Osciètre Dore",
        desc: "30g Iranian caviar, blini au beurre noisette, crème d'oursin",
        price: "€ 110",
      },
      {
        name: "Langoustines Rôties",
        desc: "Langoustines de Saint-Gilles, beurre blanc à l'estragon, gel citron yuzu",
        price: "€ 68",
      },
      {
        name: "Foie Gras Mi-Cuit",
        desc: "Torchon de foie gras, pain brioché, confiture de figue noire",
        price: "€ 52",
      },
    ],
  },
  {
    id: 2,
    category: "The Core",
    items: [
      {
        name: "Bœuf Wagyu A5",
        desc: "Entrecôte 200g, jus de truffe noire, gratin dauphinois, haricots verts fins",
        price: "€ 145",
      },
      {
        name: "Turbot Sauvage",
        desc: "Turbot de ligne, beurre mousseux aux câpres, pommes château, épinards",
        price: "€ 98",
      },
      {
        name: "Pigeon en Deux Services",
        desc: "Filet rôti à la braise, cuisse confite, sauce au sang, gnocchi truffés",
        price: "€ 115",
      },
    ],
  },
  {
    id: 3,
    category: "The Finale",
    items: [
      {
        name: "Soufflé au Grand Marnier",
        desc: "Soufflé chaud, glace vanille Bourbon, tuiles dentelles",
        price: "€ 38",
      },
      {
        name: "Chocolat Araguani",
        desc: "Fondant 72%, sorbet cacao, praliné feuilleté, fleur de sel",
        price: "€ 32",
      },
      {
        name: "Tarte Fine aux Pommes",
        desc: "Pâte feuilletée caramélisée, pommes Golden, crème Calvados",
        price: "€ 28",
      },
    ],
  },
];

const WINE_PAIRINGS = [
  {
    title: "Old World Journey",
    wines: 9,
    focus: "Classic European Vintages",
    price: "€ 145",
  },
  {
    title: "Grand Cru Experience",
    wines: 7,
    focus: "Rare & Auction Exclusive",
    price: "€ 290",
  },
  {
    title: "Artisan Natural",
    wines: 8,
    focus: "Minimal Intervention Gems",
    price: "€ 120",
  },
];

const ARTISANS = [
  {
    name: "Le Potager d'Antony",
    specialty: "Rare heirloom vegetables",
    loc: "Versailles",
  },
  {
    name: "Maison Bordier",
    specialty: "Artisan baratte butter",
    loc: "Saint-Malo",
  },
  {
    name: "Pêcherie de la Cotinière",
    specialty: "Line-caught wild fish",
    loc: "Oléron",
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

export default function SatoriRestaurantPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState(0);

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
      className="premium-theme min-h-screen bg-[#0f0d0b] text-[#f5efe0] font-sans selection:bg-[#b8860b] selection:text-black overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-[#0f0d0b]/95 backdrop-blur-md py-4 border-b border-[#b8860b]/10" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b] mb-1">
              Restaurant
            </span>
            <span className="text-xl md:text-3xl font-light tracking-[0.3em] uppercase">
              SATORI
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5efe0]/30">
            <Link
              href="#menu"
              className="hover:text-[#b8860b] transition-colors"
            >
              The_Menu
            </Link>
            <Link
              href="#wine"
              className="hover:text-[#b8860b] transition-colors"
            >
              Maître_Caviste
            </Link>
            <Link
              href="#chef"
              className="hover:text-[#b8860b] transition-colors"
            >
              The_Chef
            </Link>
            <Link
              href="#contact"
              className="hover:text-[#b8860b] transition-colors"
            >
              Locations
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#b8860b]">
              {[1, 2, 3].map((i) => (
                <Star key={i} className="w-3 h-3 fill-[#b8860b]" />
              ))}
              <span className="ml-2">Michelin 2026</span>
            </div>
            <MagneticBtn
              onClick={() => setReserveOpen(true)}
              className="px-8 py-3 border border-[#b8860b]/30 text-[#b8860b] text-[10px] font-bold uppercase tracking-widest hover:bg-[#b8860b] hover:text-black transition-all rounded-sm shadow-2xl"
            >
              RESERVE
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
            className="fixed inset-0 z-[100] bg-[#0f0d0b] p-8 pt-32 flex flex-col border-l border-[#b8860b]/10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-light tracking-tighter uppercase italic">
              <Link href="#menu" onClick={() => setMenuOpen(false)}>
                Menu
              </Link>
              <Link href="#wine" onClick={() => setMenuOpen(false)}>
                Wine
              </Link>
              <Link href="#chef" onClick={() => setMenuOpen(false)}>
                Chef
              </Link>
              <Link href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO (Dark Editorial Gastronomy)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[100svh] flex flex-col justify-end overflow-hidden pb-32"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80"
            alt="Fine Dining Hero"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0b] via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-light leading-[0.8] tracking-tighter mb-12">
              Surrender <br />{" "}
              <span className="italic font-normal text-[#b8860b]">
                to fire.
              </span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-[#f5efe0]/40 leading-relaxed font-light mb-12 italic">
              Chef Anatol Voss transforms memory, season, and flame into a
              dining experience that transcends cuisine.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn
                onClick={() => setReserveOpen(true)}
                className="px-12 py-5 bg-[#b8860b] text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all cursor-pointer shadow-2xl"
              >
                Secure a Table
              </MagneticBtn>
              <button className="px-12 py-5 border border-[#f5efe0]/10 text-[#f5efe0] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#f5efe0] hover:text-black transition-all cursor-pointer">
                The Tasting Menu
              </button>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 right-12 hidden md:block"
        >
          <div className="flex flex-col items-end gap-3">
            <span className="text-[9px] font-bold text-[#f5efe0]/20 uppercase tracking-[0.5em]">
              Paris // Geneva // Tokyo
            </span>
            <div className="w-24 h-[1px] bg-[#b8860b]/30" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. THE MENU (Tabs + Minimalist)
          ========================================== */}
      <section
        id="menu"
        className="py-32 bg-[#0f0d0b] border-y border-[#b8860b]/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#b8860b] mb-6 block">
                À La Carte
              </span>
              <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[0.9]">
                The <br />{" "}
                <span className="italic text-[#b8860b]">Curated.</span>
              </h2>
            </Reveal>
            <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest text-[#f5efe0]/30 leading-relaxed italic">
              A hand-picked selection of seasonal masterpieces, updated daily
              based on the morning's harvest.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4">
              <div className="sticky top-40 space-y-4">
                {MENUS.map((menu, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMenuTab(i)}
                    className={`w-full text-left p-10 border transition-all flex items-center justify-between group ${activeMenuTab === i ? "border-[#b8860b] bg-[#b8860b]/5" : "border-white/5 hover:border-white/10"}`}
                  >
                    <span
                      className={`text-xl font-light uppercase tracking-widest ${activeMenuTab === i ? "text-[#b8860b]" : "text-white/40"}`}
                    >
                      {menu.category}
                    </span>
                    <ArrowRight
                      className={`w-5 h-5 transition-transform ${activeMenuTab === i ? "text-[#b8860b] translate-x-2" : "text-white/10"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMenuTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12"
                >
                  {MENUS[activeMenuTab].items.map((item, i) => (
                    <div
                      key={i}
                      className="group border-b border-white/5 pb-10 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl font-light tracking-tight group-hover:text-[#b8860b] transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-xl font-light text-[#b8860b] italic">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-[#f5efe0]/30 italic font-light max-w-xl">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. MAÎTRE CAVISTE (Wine Section)
          ========================================== */}
      <section id="wine" className="py-32 bg-[#0a0806]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <Reveal className="relative aspect-square md:aspect-[4/5] rounded-sm overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80"
                alt="Wine Cellar"
                fill
                className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-transparent to-transparent" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <Badge className="bg-[#b8860b] text-black w-fit mb-4">
                  Maître Caviste
                </Badge>
                <h3 className="text-4xl font-light italic mb-2 text-white uppercase tracking-tighter">
                  Liquid History.
                </h3>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#b8860b] mb-6 block">
                  The Oenology Protocol
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-12 uppercase">
                  The <br /> <span className="italic">Pairing.</span>
                </h2>
                <p className="text-lg text-[#f5efe0]/40 leading-relaxed font-light mb-16 italic max-w-lg">
                  Our cellar houses over 12,000 bottles, including rare vertical
                  collections of Romanée-Conti and Château d'Yquem.
                </p>

                <div className="space-y-8">
                  {WINE_PAIRINGS.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-white/5 pb-8 group"
                    >
                      <div>
                        <h4 className="text-lg font-bold uppercase tracking-widest mb-1 group-hover:text-[#b8860b] transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic">
                          {p.wines} Glasses // {p.focus}
                        </p>
                      </div>
                      <span className="text-xl font-light italic text-[#b8860b]">
                        {p.price}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. THE CHEF (Editorial)
          ========================================== */}
      <section
        id="chef"
        className="py-32 bg-[#0f0d0b] border-y border-[#b8860b]/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#b8860b] mb-6 block">
                  The Architect of Fire
                </span>
                <h2 className="text-5xl md:text-8xl font-light tracking-tighter leading-tight mb-12 uppercase">
                  Anatol <br /> <span className="italic">Voss.</span>
                </h2>
                <p className="text-lg text-[#f5efe0]/40 leading-relaxed font-light mb-12 italic">
                  "Gastronomy is the only art form that enters the bloodstream
                  directly. We don't just cook; we manage sensory memory."
                </p>

                <div className="grid grid-cols-2 gap-8 mb-16">
                  {[
                    { label: "Michelin_Stars", val: 3 },
                    { label: "Global_Rank", val: 7, prefix: "#" },
                    { label: "Years_Mastery", val: 18 },
                    { label: "Artisan_Partners", val: 42 },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-2 p-8 border border-white/5 bg-white/[0.02] hover:border-[#b8860b]/30 transition-all"
                    >
                      <div className="text-4xl font-light text-[#b8860b]">
                        <Counter to={stat.val} prefix={stat.prefix} />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <Reveal className="relative aspect-square md:aspect-[16/9] rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/chef/1200/800"
                  alt="Chef Portrait"
                  fill
                  className="object-cover grayscale brightness-50"
                />
                <div className="absolute inset-0 bg-[#b8860b]/5 mix-blend-overlay" />
                <div className="absolute bottom-10 right-10 flex gap-4">
                  <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                    Est. 2006
                  </div>
                  <div className="px-6 py-3 bg-[#b8860b] text-black text-[10px] font-bold uppercase tracking-widest shadow-xl">
                    Legion d'Honneur
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. ARTISAN COLLECTIVE
          ========================================== */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal className="max-w-2xl mx-auto mb-20">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#b8860b] mb-6 block">
              The Terroir
            </span>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase italic mb-8">
              Artisan Partners.
            </h2>
            <p className="text-black/40 italic font-medium leading-relaxed">
              We source from 42 master producers, each representing a lifetime
              of dedication to a single ingredient.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {ARTISANS.map((a, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-12 border-l border-black/5 text-left group">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#b8860b] mb-4">
                    Location // {a.loc}
                  </div>
                  <h4 className="text-3xl font-light tracking-tighter uppercase italic mb-6 group-hover:text-[#b8860b] transition-colors">
                    {a.name}
                  </h4>
                  <p className="text-black/40 text-sm font-bold uppercase tracking-widest mb-10">
                    {a.specialty}
                  </p>
                  <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] hover:text-[#b8860b] transition-colors">
                    View_Protocol <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. GASTRONOMY LABS (R&D)
          ========================================== */}
      <section className="py-32 bg-[#0f0d0b] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <Utensils className="w-full h-full text-white" />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#b8860b] mb-6 block">
                  Innovation Hub
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-12 uppercase">
                  The <br /> <span className="italic">Laboratory.</span>
                </h2>
                <p className="text-lg text-[#f5efe0]/30 leading-relaxed font-light italic mb-16">
                  Satori Labs is where we develop our proprietary ferments and
                  charcoal extractions. 30% of our R&D never reaches the plate —
                  it exists solely to push the boundaries of flavor.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      label: "Molecular Extraction",
                      icon: <FlaskConical className="w-4 h-4" />,
                      prog: 92,
                    },
                    {
                      label: "Charcoal Distillation",
                      icon: <Flame className="w-4 h-4" />,
                      prog: 78,
                    },
                    {
                      label: "Oenology Research",
                      icon: <Wine className="w-4 h-4" />,
                      prog: 85,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-8 border border-white/5 bg-white/[0.01]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-[#b8860b]">{item.icon}</div>
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#b8860b]">
                          {item.prog}% COMPLETE
                        </span>
                      </div>
                      <Progress
                        value={item.prog}
                        className="h-0.5 bg-white/5 [&>div]:bg-[#b8860b]"
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="relative aspect-square rounded-sm overflow-hidden shadow-2xl border-t border-r border-white/10 p-1">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80"
                  alt="Laboratory"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b] mb-4 block">
                      Confidential Data
                    </span>
                    <h4 className="text-4xl font-light italic text-white uppercase tracking-tighter">
                      Protocol 042.
                    </h4>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FAQ (Accordion)
          ========================================== */}
      <section className="py-32 bg-[#0a0806]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter leading-none uppercase italic">
              Intel_Buffer
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "Do you accommodate dietary requirements?",
                a: "Chef Anatol personally oversees all dietary adaptations. Please inform us at reservation.",
              },
              {
                q: "What is your dress code policy?",
                a: "We welcome smart to formal attire. Jacket is preferred for gentlemen in the main dining room.",
              },
              {
                q: "Is there a sommelier-led wine pairing?",
                a: "Our Maître Caviste offers three pairing options: Old World, Grand Cru, and Artisan Natural.",
              },
              {
                q: "How far in advance should we reserve?",
                a: "The main dining room books 6–8 weeks ahead. The Chef's Table requires 8–10 weeks.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/5"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-[#b8860b] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/30 leading-relaxed font-bold uppercase tracking-widest pb-8 italic">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ==========================================
          8. MEGA FOOTER (Premium Dark)
          ========================================== */}
      <footer className="bg-[#0f0d0b] pt-32 pb-12 px-6 md:px-12 border-t border-[#b8860b]/10 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b] mb-1">
                    Restaurant
                  </span>
                  <span className="text-2xl font-light tracking-[0.3em] uppercase">
                    SATORI
                  </span>
                </div>
                <p className="text-[#f5efe0]/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  The pinnacle of three-Michelin-star gastronomy. Where fire
                  meets master precision.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="MAILING_PROTOCOL"
                    className="w-full bg-[#0a0806] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-[#b8860b] text-[#f5efe0] transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#b8860b] hover:text-white transition-colors uppercase tracking-[0.3em]"
                  >
                    ENROLL
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b] mb-10">
                Dining
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors"
                  >
                    Tasting_Menu
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors"
                  >
                    Wine_Archives
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors"
                  >
                    Chef's_Table
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors"
                  >
                    Private_Suites
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b] mb-10">
                Atelier
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors"
                  >
                    The_Chef
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors"
                  >
                    Satori_Labs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors"
                  >
                    Artisan_Network
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors"
                  >
                    Careers_Buffer
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b] mb-10">
                Connect
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors flex items-center gap-3"
                  >
                    <Mail className="w-3 h-3" /> Paris_Studio
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors flex items-center gap-3"
                  >
                    <Phone className="w-3 h-3" /> Booking_Line
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#b8860b] transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> Tokyo_Hub
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} Satori Gastronomy Group.
              </span>
              <Link href="#" className="hover:text-white transition-colors">
                Reservation_Protocols
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy_Buffer
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Paris // Geneva // Tokyo</span>
              <span>Surrender to Fire</span>
            </div>
          </div>
        </div>
      </footer>

      {/* RESERVATION MODAL */}
      <AnimatePresence>
        {reserveOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setReserveOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0f0d0b] border border-[#b8860b]/20 max-w-2xl w-full p-12 rounded-sm shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setReserveOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-[#b8860b] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b] mb-4 block">
                  Secure a Table
                </span>
                <h3 className="text-4xl font-light uppercase tracking-tighter italic">
                  Reservation Protocol.
                </h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Guest_Count
                    </label>
                    <input
                      type="number"
                      placeholder="2"
                      className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Service_Time
                    </label>
                    <input
                      type="time"
                      className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    Authentication_Email
                  </label>
                  <input
                    type="email"
                    placeholder="client@vault.com"
                    className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    Special_Directives
                  </label>
                  <textarea
                    placeholder="Dietary adjustments, allergens, or floor preferences..."
                    className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] transition-all h-32"
                  />
                </div>
                <button className="w-full py-5 bg-[#b8860b] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all cursor-pointer">
                  Initialize_Request
                </button>
                <p className="text-[9px] text-center text-white/20 uppercase tracking-widest font-bold">
                  Requests are processed within 24 business hours.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`::-webkit-scrollbar{width:4px;background:#0f0d0b}::-webkit-scrollbar-thumb{background:#b8860b20}`}</style>
    </div>
  );
}
