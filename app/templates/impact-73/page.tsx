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
import { Video, Play, Radio, Users, Heart, MessageSquare, Share2, Search, Bell, Plus, Settings, Shield, Flame, Trophy, Monitor, Smartphone, Globe, Activity, Terminal, Mail, Phone, Check, Menu, X, Star, MapPin, Clock, Lock, ArrowRight, ArrowUpRight, ChevronRight, Zap } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const STREAMS = [
  {
    id: 1,
    title: "NEON_NIGHTS // 4K 60FPS // CHILL BEATS",
    streamer: "AURA_VOID",
    viewers: "12.4K",
    tags: ["Music", "Chill", "Coding"],
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    status: "LIVE",
  },
  {
    id: 2,
    title: "BUILDING THE FUTURE // Q_PAY INTEGRATION",
    streamer: "DEV_X",
    viewers: "4.2K",
    tags: ["Tech", "Finance", "Web3"],
    img: "https://picsum.photos/seed/gaming/800/800",
    status: "LIVE",
  },
  {
    id: 3,
    title: "CYBERPUNK 2077 // PATH TRACING MAX",
    streamer: "GLITCH_ONE",
    viewers: "28.1K",
    tags: ["Gaming", "4K", "NVIDIA"],
    img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80",
    status: "LIVE",
  },
  {
    id: 4,
    title: "MORNING BREATH // ZEN_SPACE RITUAL",
    streamer: "MAYA_ZEN",
    viewers: "850",
    tags: ["Wellness", "Yoga", "Mindful"],
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    status: "LIVE",
  },
];

const CHAT_LOGS = [
  {
    user: "ZEN_MASTER",
    msg: "LFG! The quality is insane today.",
    color: "#3b82f6",
  },
  {
    user: "DEV_GOD",
    msg: "Are you using the new QuantumPay API?",
    color: "#10b981",
  },
  { user: "CYBER_PUNK", msg: "Wait, is this really 8K?", color: "#ec4899" },
  {
    user: "AURA_FAN",
    msg: "Subbing for the 12th month straight! 💜",
    color: "#8b5cf6",
  },
];

const CREATORS = [
  {
    name: "AURA_VOID",
    sub: "1.2M",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
  },
  {
    name: "GLITCH_ONE",
    sub: "2.4M",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "MAYA_ZEN",
    sub: "850K",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
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

export default function StreamHubPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStream, setActiveStream] = useState<number | null>(null);
  const [liveViewers, setLiveViewers] = useState(142852);

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
    const t = setInterval(
      () => setLiveViewers((prev) => prev + Math.floor(Math.random() * 100)),
      1000,
    );
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(t);
    };
  }, []);

  return (
    <div
      className="premium-theme min-h-screen bg-[#08080c] text-white font-mono selection:bg-rose-500 selection:text-white overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-[#08080c]/95 backdrop-blur-md py-4 border-b border-rose-500/10" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-rose-500/40 mb-1">
              Live.
            </span>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white">
              STREAM<span className="text-rose-500">HUB.</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            <Link
              href="#browse"
              className="hover:text-rose-400 transition-colors"
            >
              Browse
            </Link>
            <Link
              href="#creators"
              className="hover:text-rose-400 transition-colors"
            >
              Creators
            </Link>
            <Link
              href="#go-live"
              className="hover:text-rose-400 transition-colors"
            >
              Go_Live
            </Link>
            <Link
              href="#about"
              className="hover:text-rose-400 transition-colors"
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">
                Aggregate Global Reach
              </span>
              <span className="text-[11px] font-black text-rose-500 flex items-center gap-1">
                {liveViewers.toLocaleString()} ONLINE{" "}
                <Activity className="w-3 h-3" />
              </span>
            </div>
            <MagneticBtn className="px-8 py-3 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20">
              START_STREAMING
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
            className="fixed inset-0 z-[100] bg-[#08080c] p-8 pt-32 flex flex-col border-l border-rose-500/10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/20"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase italic text-rose-500">
              <Link href="#browse" onClick={() => setMenuOpen(false)}>
                Browse
              </Link>
              <Link href="#creators" onClick={() => setMenuOpen(false)}>
                Creators
              </Link>
              <Link href="#go-live" onClick={() => setMenuOpen(false)}>
                Go_Live
              </Link>
              <Link href="#about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO (Cyber-Entertainment)
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
            src="https://picsum.photos/seed/gaming/1600/1000"
            alt="StreamHub Hero"
            fill
            className="object-cover brightness-[0.2] opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/40 to-transparent" />
        </motion.div>

        {/* ROSE GRID OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(225,29,72,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(225,29,72,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)]" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-600/10 rounded-md border border-rose-600/30 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Radio className="w-3.5 h-3.5" />
              Live: 8K HDR 120FPS Deployment Complete
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.85] tracking-tighter mb-12 uppercase">
              Own The <br />{" "}
              <span className="text-rose-500 italic">Spectrum.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/30 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">
              Ultra-low latency streaming for the modern creator. Zero
              compression. Infinite scale. Direct-to-creator monetization.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn className="px-12 py-5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-md hover:bg-rose-500 transition-all cursor-pointer shadow-2xl shadow-rose-600/20">
                Join The Stream
              </MagneticBtn>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-md hover:bg-white hover:text-black transition-all cursor-pointer">
                Partner_Inquiry
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
              STREAM_HUB_OS // V8.4.2
            </span>
            <div className="w-32 h-[1px] bg-rose-500/40" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. LIVE GRID (Browse)
          ========================================== */}
      <section
        id="browse"
        className="py-32 bg-[#08080c] border-y border-white/5"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white">
                Live <br /> <span className="text-rose-500 italic">Now.</span>
              </h2>
            </Reveal>
            <p className="max-w-sm text-sm text-white/20 leading-relaxed font-bold uppercase tracking-widest italic text-right">
              Real-time content across all spectrums. Instant engagement. No
              delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STREAMS.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.1}>
                <div
                  onClick={() => setActiveStream(i)}
                  className="group cursor-pointer bg-white/[0.02] border border-white/5 hover:border-rose-500/40 transition-all rounded-2xl p-4 shadow-sm overflow-hidden"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-rose-600 text-white border-none text-[8px] font-black tracking-widest uppercase px-3 py-1 animate-pulse">
                        LIVE
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 text-[9px] font-black text-white/80 bg-black/50 backdrop-blur-md px-2 py-1 rounded">
                      {s.viewers} VIEWERS
                    </div>
                    <div className="absolute inset-0 bg-rose-600/10 mix-blend-overlay" />
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-white truncate">
                      {s.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-6 h-6 rounded-full bg-rose-600/10 border border-rose-600/20" />
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                        {s.streamer}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[8px] font-black uppercase tracking-widest text-white/20 bg-white/[0.02] px-2 py-1 rounded border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. CREATOR SPOTLIGHT (Spotlight)
          ========================================== */}
      <section id="creators" className="py-32 bg-[#08080c]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-500 mb-6 block">
                  Creator Alpha
                </span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-12 text-white uppercase italic">
                  Spotlight <br />{" "}
                  <span className="text-rose-500">Engine.</span>
                </h2>
                <p className="text-lg text-white/20 leading-relaxed font-bold mb-16 uppercase tracking-tight italic">
                  We don't just host creators. We amplify them. Proprietary
                  discovery algorithms that prioritize quality over clicks.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      label: "New Creators Monthly",
                      val: 120,
                      suffix: "K+",
                      desc: "A rapidly growing ecosystem of global talent.",
                    },
                    {
                      label: "Creator Revenue Share",
                      val: 95,
                      suffix: "%",
                      desc: "Industry-leading payout structure. You keep your gains.",
                    },
                    {
                      label: "Sub-Second Latency",
                      val: 80,
                      suffix: "ms",
                      desc: "Near-instant interaction between you and your audience.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="group border-l border-rose-500/20 pl-8 hover:border-rose-500 transition-all"
                    >
                      <h4 className="text-sm font-bold uppercase tracking-tight mb-2 text-white/60">
                        {item.label}
                      </h4>
                      <div className="text-3xl font-black text-rose-500 mb-2 uppercase italic tabular-nums">
                        <Counter to={item.val} suffix={item.suffix} />
                      </div>
                      <p className="text-[10px] text-white/10 leading-relaxed font-bold uppercase tracking-widest">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-[#0a0a14] p-1 group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1)_0%,transparent_70%)] animate-pulse" />
                <div className="relative h-full w-full border border-white/5 bg-[#08080c] p-8 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <Radio className="w-5 h-5 text-rose-500" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-500">
                        NETWORK_FEED_MONITOR
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-rose-500/30 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {CHAT_LOGS.map((chat, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/[0.03] rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] border border-white/10">
                          <MessageSquare className="w-4 h-4 text-white/20" />
                        </div>
                        <div>
                          <h4
                            className="text-[10px] font-black uppercase"
                            style={{ color: chat.color }}
                          >
                            {chat.user}
                          </h4>
                          <p className="text-xs font-bold text-white/60 uppercase tracking-tight">
                            {chat.msg}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                        Global Watch Time Today
                      </span>
                      <div className="text-4xl font-black text-white italic tabular-nums">
                        4.2M HOURS
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-rose-600/10 border border-rose-600/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-rose-500" />
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-rose-600/10 border border-rose-600/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-rose-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. STATS (Counters)
          ========================================== */}
      <section className="py-24 bg-[#08080c] border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {[
            { label: "Active_Creators", val: 840, suffix: "K+" },
            { label: "Monthly_Viewers", val: 120, suffix: "M+" },
            { label: "Data_Throughput", val: 42, suffix: " PB" },
            { label: "Payouts_Processed", val: 850, suffix: "M+" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-5xl md:text-7xl font-black text-rose-600 mb-4 italic tabular-nums">
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
      <section id="about" className="py-32 bg-[#08080c]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase italic text-white">
              Stream_Buffer
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "What is your payout model?",
                a: "Creators keep 95% of all subscription revenue and 100% of direct tips. We only take a 5% fee to cover infrastructure and global CDN costs.",
              },
              {
                q: "What hardware do I need to stream in 8K?",
                a: "8K streaming requires an NVIDIA 40-series GPU or equivalent, a minimum 100Mbps upload speed, and our proprietary StreamHub Encoder v4.",
              },
              {
                q: "How do you handle moderation?",
                a: "We use a hybrid AI-human moderation system. Our NeuralMod AI flags violations in 50ms, which are then reviewed by our 24/7 global safety team.",
              },
              {
                q: "Can I multi-stream to other platforms?",
                a: "Yes. Our Partner tier allows for simultaneous broadcasting to up to 5 external platforms with zero additional CPU overhead.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/5"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-rose-500 hover:no-underline">
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
          6. MEGA FOOTER (Premium Tech)
          ========================================== */}
      <footer className="bg-[#0a0a14] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 mb-1">
                    Live.
                  </span>
                  <span className="text-2xl font-black tracking-tighter uppercase text-white">
                    STREAM<span className="text-rose-500">HUB.</span>
                  </span>
                </div>
                <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  The infrastructure for the next generation of digital
                  performance. Est. 2026. Empowering creators globally.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="ENROLL_IN_THE_MANIFESTO"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-rose-600 text-white transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
                  >
                    ENROLL
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-10">
                Platform
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors"
                  >
                    Browse_Streams
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors"
                  >
                    Top_Creators
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors"
                  >
                    Partner_Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors"
                  >
                    Creator_Tools
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-10">
                Company
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors"
                  >
                    Our_Mission
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors"
                  >
                    Press_Kit
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors"
                  >
                    Security_Audit
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-10">
                Terminal
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> X_Mission
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-rose-500 transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> API_Docs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} STREAM HUB Technologies Inc.
              </span>
              <Link href="#" className="hover:text-white transition-colors">
                Regulatory_Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy_Buffer
              </Link>
            </div>
            <div className="flex gap-10">
              <span>San Francisco // Tokyo // Berlin</span>
              <span>StreamHub OS v8.4.2</span>
            </div>
          </div>
        </div>
      </footer>

      {/* STREAM MODAL */}
      <AnimatePresence>
        {activeStream !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setActiveStream(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0e0e1a] border border-white/10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveStream(null)}
                className="absolute top-8 right-8 text-white/20 hover:text-rose-500 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* VIDEO AREA */}
              <div className="lg:col-span-8 relative aspect-video lg:aspect-auto bg-black flex items-center justify-center">
                <Image
                  src={STREAMS[activeStream].img}
                  alt="Stream"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-rose-600/20 border border-rose-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-rose-500 fill-rose-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white mt-6">
                    Connecting to node...
                  </span>
                </div>
                {/* OVERLAYS */}
                <div className="absolute top-8 left-8 flex gap-4">
                  <Badge className="bg-rose-600 text-white border-none text-[10px] font-black uppercase tracking-widest animate-pulse px-4 py-1.5">
                    LIVE
                  </Badge>
                  <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded text-[10px] font-black uppercase tracking-widest text-white/80">
                    {STREAMS[activeStream].viewers} VIEWERS
                  </div>
                </div>
              </div>

              {/* SIDEBAR AREA */}
              <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-[#0e0e1a] border-l border-white/5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-600" />
                    Real-Time Metadata
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-6 leading-tight">
                    {STREAMS[activeStream].title}
                  </h3>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-full bg-rose-600/10 border border-rose-600/20" />
                    <div>
                      <div className="text-sm font-black text-white">
                        {STREAMS[activeStream].streamer}
                      </div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">
                        Partner Creator
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10 h-[300px] overflow-y-auto pr-4 scrollbar-hide">
                    {CHAT_LOGS.map((chat, i) => (
                      <div key={i} className="text-[11px] leading-relaxed">
                        <span
                          className="font-black uppercase tracking-tight mr-2"
                          style={{ color: chat.color }}
                        >
                          {chat.user}:
                        </span>
                        <span className="text-white/60 font-bold uppercase tracking-tight italic">
                          {chat.msg}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full py-5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 transition-all cursor-pointer shadow-xl shadow-rose-600/20">
                    SEND_CRYPTO_GIFT
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-4 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer">
                      FOLLOW
                    </button>
                    <button className="py-4 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer">
                      SUBSCRIBE
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#08080c}
        ::-webkit-scrollbar-thumb{background:rgba(225,29,72,0.2)}
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
