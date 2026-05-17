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
import { useState, useRef, useEffect } from "react";
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
import { Wind, Leaf, Sun, Moon, Mountain, Heart, Check, Star, Menu, ArrowRight, ChevronRight, MapPin, Users, Clock, Globe, Flower, Waves, Flame, Eye, Quote, ShieldCheck, Timer, Search, ShoppingBag, Sparkles, Anchor, BookOpen, Compass, X, Activity } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================== */

const RETREATS = [
  {
    id: 1,
    name: "Sonoran Silence",
    location: "Arizona Desert, USA",
    duration: "7 Nights",
    price: "from $4,200",
    theme: "Stillness",
    season: "Oct–Apr",
    img: "https://picsum.photos/seed/wellness/1200/750",
    desc: "Seven days in an ancient desert landscape. Dawn somatic practice, silent midday walks, and evening fire ceremonies. No agenda. No schedule beyond your own unfolding.",
    details: [
      ["Group Size", "Max 9 participants"],
      ["Setting", "Private desert sanctuary"],
      ["Practice", "Somatic therapy + silence"],
      ["Meals", "Biodynamic plant cuisine"],
    ],
  },
  {
    id: 2,
    name: "Icelandic Deep Reset",
    location: "Westfjords, Iceland",
    duration: "5 Nights",
    price: "from $5,800",
    theme: "Clarity",
    season: "Jun–Aug",
    img: "https://images.unsplash.com/photo-1540555700478-4be709347c63?w=1200&q=80",
    desc: "Geothermal pools at midnight beneath the aurora. Five days designed to dissolve the residue of over-functioning and restore access to your own thinking.",
    details: [
      ["Group Size", "Max 9 participants"],
      ["Setting", "Isolated fjord lodge"],
      ["Practice", "Breathwork + thermal immersion"],
      ["Meals", "Icelandic foraged cuisine"],
    ],
  },
  {
    id: 3,
    name: "Kyoto Forest Immersion",
    location: "Arashiyama, Japan",
    duration: "6 Nights",
    price: "from $6,100",
    theme: "Presence",
    season: "Mar–May",
    img: "https://images.unsplash.com/photo-1571017853234-0b220809f68a?w=1200&q=80",
    desc: "Shinrin-yoku through Arashiyama bamboo groves. Zen walking sequences with a lineage-trained teacher. Tea ceremony as contemplative practice.",
    details: [
      ["Group Size", "Max 9 participants"],
      ["Setting", "Private ryokan retreat"],
      ["Practice", "Zen practice + forest bathing"],
      ["Meals", "Kaiseki plant cuisine"],
    ],
  },
];

const LINEAGE = [
  {
    name: "Dr. Clara Metz",
    role: "Founder & Lead Clinician",
    bio: "Former neuropsychologist specialized in burnout recovery, Clara developed the Luminal Method after a decade in clinical practice.",
    avatar: "CM",
  },
  {
    name: "Master Juro Nakano",
    role: "Contemplative Guide",
    bio: "A Zen monk with 30 years of practice in the Rinzai lineage, Juro oversees all meditation and walking sequences.",
    avatar: "JN",
  },
  {
    name: "Elena Rossi",
    role: "Somatic Therapist",
    bio: "Expert in nervous system regulation and trauma release, Elena leads the somatic re-patterning sessions.",
    avatar: "ER",
  },
];

const SCIENTIFIC_PILLARS = [
  {
    title: "Neuro-Plasticity",
    desc: "Our environments are chosen to maximize cognitive flexibility through novel sensory input and radical reduction of digital noise.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    title: "Circadian Sync",
    desc: "Protocols are timed to natural light cycles to reset the hypothalamic-pituitary-adrenal axis and restore sleep architecture.",
    icon: <Sun className="w-5 h-5" />,
  },
  {
    title: "Somatic Recall",
    desc: "Body-based interventions that target the vagus nerve to down-regulate high-stress arousal states permanently.",
    icon: <Activity className="w-5 h-5" />,
  },
];

const APPLICATION_STEPS = [
  {
    step: "01",
    title: "Intake Survey",
    desc: "A detailed questionnaire mapping your current psychological and physiological baseline.",
  },
  {
    step: "02",
    title: "Inquiry Call",
    desc: "A 45-minute consultation with a guide to ensure alignment with our method and group dynamics.",
  },
  {
    step: "03",
    title: "Placement",
    desc: "Selection of the retreat landscape best suited to your specific restorative needs.",
  },
  {
    step: "04",
    title: "Preparation",
    desc: "A 21-day pre-arrival protocol to begin the process of digital and cognitive deceleration.",
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

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

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
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
      {count}
      {suffix}
    </span>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */

export default function LuminalRetreatsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRetreat, setActiveRetreat] = useState<number | null>(null);

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
      className="premium-theme min-h-screen bg-[#f8f5f0] text-[#2a2a2a] font-serif selection:bg-[#3d7a5e] selection:text-white overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-[#f8f5f0]/90 backdrop-blur-md py-4 border-b border-black/5" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#3d7a5e] flex items-center justify-center text-white">
              <Leaf className="w-4 h-4" />
            </div>
            LUMINAL
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
            <Link href="#" className="hover:text-[#3d7a5e] transition-colors">
              Retreats
            </Link>
            <Link href="#" className="hover:text-[#3d7a5e] transition-colors">
              The_Method
            </Link>
            <Link href="#" className="hover:text-[#3d7a5e] transition-colors">
              Lineage
            </Link>
            <Link href="#" className="hover:text-[#3d7a5e] transition-colors">
              Apply
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden md:block hover:text-[#3d7a5e] transition-colors text-black/30">
              <Search className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 bg-[#3d7a5e] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">
              Begin_Intake
            </button>
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
            className="fixed inset-0 z-[100] bg-[#f8f5f0] p-8 pt-32 flex flex-col border-l border-black/5"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-light italic tracking-tighter uppercase">
              <Link href="#" onClick={() => setMenuOpen(false)}>
                Retreats
              </Link>
              <Link href="#" onClick={() => setMenuOpen(false)}>
                The_Method
              </Link>
              <Link href="#" onClick={() => setMenuOpen(false)}>
                Lineage
              </Link>
              <Link href="#" onClick={() => setMenuOpen(false)}>
                Apply
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO (Atmospheric)
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
            src="https://picsum.photos/seed/wellness/1600/1000"
            alt="Wellness Hero"
            fill
            className="object-cover grayscale brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5f0] via-[#f8f5f0]/30 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold text-[#3d7a5e] mb-8 block">
              Maximum 9 Participants · No Devices
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[0.85] tracking-tighter mb-12">
              Rest is <br />{" "}
              <span className="italic font-light">the work.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-black/50 leading-relaxed font-light mb-12">
              Luminal designs profound retreat experiences in the world's most
              transformative landscapes. We create the conditions for genuine
              rest through carefully calibrated stillness.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold rounded-full hover:bg-[#3d7a5e] transition-all cursor-pointer shadow-xl">
                Explore 2026 Programme
              </button>
              <button className="px-12 py-5 border border-black/10 text-black text-[10px] uppercase tracking-[0.4em] font-bold rounded-full hover:bg-black hover:text-white transition-all cursor-pointer">
                The Luminal Method
              </button>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[8px] uppercase tracking-[0.3em] text-black/30">
              Descend into Stillness
            </span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-black/20 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. THE PHILOSOPHY (Scientific Pillars)
          ========================================== */}
      <section className="py-32 bg-[#f8f5f0] border-y border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#3d7a5e] mb-6 block">
                  Deep Inquiry
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-12 uppercase">
                  Silence is <br />{" "}
                  <span className="italic font-normal text-[#3d7a5e]">
                    Structural.
                  </span>
                </h2>
                <p className="text-lg text-black/50 leading-relaxed font-light mb-16">
                  We don't offer spa treatments. We offer nervous system
                  restoration. Every element of a Luminal retreat is backed by
                  neurological research into how the high-functioning mind
                  achieves true baseline reset.
                </p>

                <div className="space-y-10">
                  {SCIENTIFIC_PILLARS.map((pillar, i) => (
                    <div key={i} className="group flex gap-8">
                      <div className="w-14 h-14 bg-white border border-black/5 flex items-center justify-center text-[#3d7a5e] group-hover:bg-[#3d7a5e] group-hover:text-white transition-all shadow-sm">
                        {pillar.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold uppercase tracking-tight mb-2">
                          {pillar.title}
                        </h4>
                        <p className="text-sm text-black/40 leading-relaxed font-light">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal className="relative aspect-square md:aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be709347c63?w=1200&q=80"
                  alt="Meditation Detail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#3d7a5e]/5 mix-blend-multiply" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="bg-white/90 backdrop-blur-md p-8 border border-black/5">
                    <Quote className="w-8 h-8 text-[#3d7a5e] mb-4" />
                    <p className="text-xl italic text-black/70 leading-relaxed">
                      "The quality of your rest determines the quality of your
                      contribution. We do not help you rest. We help you learn
                      how."
                    </p>
                    <div className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e]">
                      Dr. Clara Metz // Founder
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. RETREATS PROGRAMME
          ========================================== */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-[0.9]">
                2026 <br /> <span className="italic">Destinations.</span>
              </h2>
            </Reveal>
            <p className="max-w-sm text-sm text-black/40 leading-relaxed italic font-light">
              Three landscapes chosen because the terrain itself exerts a
              corrective pressure on the depleted mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {RETREATS.map((retreat, i) => (
              <Reveal key={retreat.id} delay={i * 0.1}>
                <div
                  onClick={() => setActiveRetreat(i)}
                  className="group cursor-pointer bg-[#f8f5f0] border border-black/5 hover:border-[#3d7a5e]/30 transition-all p-1"
                >
                  <div className="relative aspect-[4/5] overflow-hidden mb-8">
                    <Image
                      src={retreat.img}
                      alt={retreat.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5f0] via-transparent to-transparent" />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-[#3d7a5e] text-white rounded-none px-4 py-1 text-[9px] font-bold uppercase tracking-widest">
                        {retreat.theme}
                      </Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-[9px] uppercase tracking-[0.4em] text-black/40 mb-2">
                        {retreat.location}
                      </div>
                      <h3 className="text-3xl font-bold uppercase tracking-tighter group-hover:text-[#3d7a5e] transition-colors">
                        {retreat.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-8 pt-0">
                    <p className="text-sm text-black/50 leading-relaxed font-light mb-8 italic">
                      "{retreat.desc.slice(0, 100)}..."
                    </p>
                    <div className="flex items-center justify-between border-t border-black/5 pt-6">
                      <span className="text-xl font-bold text-black">
                        {retreat.price}
                      </span>
                      <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e] group-hover:translate-x-2 transition-transform">
                        Enquire <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. THE LINEAGE (Team)
          ========================================== */}
      <section className="py-32 bg-[#f8f5f0] border-y border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#3d7a5e] mb-6 block">
              The Custodians
            </span>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase italic">
              The Lineage.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {LINEAGE.map((member, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group text-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-10 shadow-2xl border-4 border-white group-hover:border-[#3d7a5e] transition-colors">
                    <div className="absolute inset-0 bg-[#3d7a5e] flex items-center justify-center text-4xl font-bold text-white uppercase italic">
                      {member.avatar}
                    </div>
                    <Image
                      src={`https://images.unsplash.com/photo-${1500000000000 + i * 2000000}?q=80&w=400&auto=format&fit=crop`}
                      alt={member.name}
                      fill
                      className="object-cover mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <h4 className="text-2xl font-bold uppercase tracking-tight mb-2">
                    {member.name}
                  </h4>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#3d7a5e] mb-6 block">
                    {member.role}
                  </span>
                  <p className="text-sm text-black/50 leading-relaxed font-light italic max-w-xs mx-auto">
                    {member.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. APPLICATION WORKFLOW (Multi-step)
          ========================================== */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#3d7a5e] mb-6 block">
                  The Intake
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-12 uppercase">
                  How We <br /> <span className="italic">Begin.</span>
                </h2>
                <p className="text-lg text-black/50 leading-relaxed font-light mb-16 max-w-lg">
                  Because of our small group sizes and the depth of our work,
                  every participant goes through a multi-stage application
                  process to ensure psychological safety and group synergy.
                </p>

                <div className="space-y-12">
                  {APPLICATION_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="text-4xl font-black text-black/5 group-hover:text-[#3d7a5e]/20 transition-colors">
                        {step.step}
                      </div>
                      <div className="flex-1 border-b border-black/5 pb-8 group-last:border-0">
                        <h4 className="text-xl font-bold uppercase mb-2 text-black">
                          {step.title}
                        </h4>
                        <p className="text-sm text-black/40 leading-relaxed font-light italic">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="relative aspect-square md:aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1530124560677-bdaea92c5a3b?q=80&w=1200&auto=format&fit=crop"
                alt="Preparation"
                fill
                className="object-cover grayscale brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3d7a5e]/20 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <div className="p-10 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <Compass className="w-8 h-8 mb-6" />
                  <h3 className="text-3xl font-light uppercase tracking-tighter italic mb-4">
                    The Alumni Collective.
                  </h3>
                  <p className="text-sm font-light leading-relaxed mb-8 opacity-70">
                    Membership in our alumni community provides ongoing support
                    and priority access to new retreats for life.
                  </p>
                  <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                    Learn_More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. STATS (Large Display)
          ========================================== */}
      <section className="py-24 bg-[#3d7a5e] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {[
            { label: "Retreats_Delivered", val: 214, suffix: "" },
            { label: "Locations_Archive", val: 18, suffix: "" },
            { label: "Max_Group_Size", val: 9, suffix: "" },
            { label: "Participants_Served", val: 1830, suffix: "+" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-5xl md:text-7xl font-bold mb-4">
                <Counter to={stat.val} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.5em]">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          7. FAQ (The Buffer)
          ========================================== */}
      <section className="py-32 bg-[#f8f5f0]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter leading-none uppercase italic">
              Intel_Buffer
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "Who is Luminal designed for?",
                a: "Luminal serves high-functioning individuals experiencing burnout or creative depletion. We do not offer clinical therapy. We offer conditions for genuine rest.",
              },
              {
                q: "Is technology permitted during retreats?",
                a: "Devices are surrendered on arrival and returned on departure. This is non-negotiable and constitutes the first transformative act of the retreat.",
              },
              {
                q: "How small are the groups?",
                a: "Every Luminal retreat is capped at nine participants. This is not scalable and is entirely intentional for depth of practice.",
              },
              {
                q: "What does a typical day look like?",
                a: "There is no schedule distributed in advance. Mornings are for somatic practice, afternoons for solitude, evenings for shared inquiry.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-black/5"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-[#3d7a5e] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-black/40 leading-relaxed font-light italic pb-8">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ==========================================
          8. MEGA FOOTER (Editorial)
          ========================================== */}
      <footer className="bg-white pt-32 pb-12 px-6 md:px-12 border-t border-black/5 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="text-2xl font-bold tracking-[0.2em] uppercase mb-10 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3d7a5e] flex items-center justify-center text-white">
                    <Leaf className="w-3 h-3" />
                  </div>
                  LUMINAL
                </div>
                <p className="text-black/40 max-w-sm mb-12 uppercase tracking-widest text-[11px] leading-relaxed italic">
                  Immersive retreat experiences in the world's most
                  transformative landscapes. Maximum nine participants.
                  Stillness as practice.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Your_Intake_Email"
                    className="w-full bg-[#f8f5f0] border border-black/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-[#3d7a5e] text-black transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#3d7a5e] hover:text-black transition-colors uppercase tracking-[0.3em]"
                  >
                    AUTHENTICATE
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e] mb-10">
                Programmes
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-black/30">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors"
                  >
                    Sonoran_Silence
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors"
                  >
                    Icelandic_Reset
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors"
                  >
                    Kyoto_Immersion
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors"
                  >
                    Patagonian_Edge
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e] mb-10">
                Intel
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-black/30">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors"
                  >
                    The_Method
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors"
                  >
                    Scientific_Pillars
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors"
                  >
                    Lineage_Log
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors"
                  >
                    FAQ_Buffer
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e] mb-10">
                Network
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-black/30">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> X_Protocol
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#3d7a5e] transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> World_View
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-black/5 text-[9px] font-bold uppercase tracking-widest text-black/20">
            <div className="flex items-center gap-10">
              <span>&copy; {new Date().getFullYear()} Luminal Ltd.</span>
              <Link href="#" className="hover:text-black transition-colors">
                Privacy_Protocol
              </Link>
              <Link href="#" className="hover:text-black transition-colors">
                Terms_of_Access
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Switzerland // Japan // USA</span>
              <span>Crafted with Stillness</span>
            </div>
          </div>
        </div>
      </footer>

      {/* RETREAT MODAL (Placeholder logic) */}
      <AnimatePresence>
        {activeRetreat !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setActiveRetreat(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#f8f5f0] border border-black/10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square md:aspect-auto">
                <Image
                  src={RETREATS[activeRetreat].img}
                  alt="Retreat"
                  fill
                  className="object-cover grayscale brightness-75"
                />
                <div className="absolute inset-0 bg-[#3d7a5e]/5 mix-blend-screen" />
              </div>
              <div className="p-12 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#3d7a5e] font-bold mb-4">
                    {RETREATS[activeRetreat].location} //{" "}
                    {RETREATS[activeRetreat].theme}
                  </div>
                  <h3 className="text-4xl font-bold uppercase tracking-tighter text-black mb-6 leading-none">
                    {RETREATS[activeRetreat].name}
                  </h3>
                  <p className="text-sm text-black/40 leading-relaxed font-light mb-10 italic">
                    "{RETREATS[activeRetreat].desc}"
                  </p>

                  <div className="grid grid-cols-1 gap-4 mb-10">
                    {RETREATS[activeRetreat].details.map(([k, v], i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs border-b border-black/5 pb-2"
                      >
                        <span className="uppercase tracking-widest text-black/20 font-bold">
                          {k}
                        </span>
                        <span className="font-bold text-black/60">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full py-5 bg-[#3d7a5e] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all cursor-pointer">
                  Initialize_Intake &mdash; {RETREATS[activeRetreat].price}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`::-webkit-scrollbar{width:4px;background:#f8f5f0}::-webkit-scrollbar-thumb{background:#3d7a5e20}`}</style>
    </div>
  );
}
