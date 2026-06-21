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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Anchor, Compass, Ship, ShieldCheck, Star, Globe, Mail, MapPin, ChevronRight, ArrowRight, X, Menu, Waves, Wind, Sun, Map, Clock, Phone, Search, ShoppingBag, Maximize, Activity, Droplets } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const FLEET = [
  {
    id: 1,
    name: "Azure Odyssey",
    length: "85m",
    guests: 12,
    price: "From €850k/week",
    desc: "A masterpiece of naval architecture featuring a glass-bottom infinity pool and private helipad.",
    img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=80",
  },
  {
    id: 2,
    name: "Lumière Grandeur",
    length: "110m",
    guests: 18,
    price: "From €1.2M/week",
    desc: "The pinnacle of luxury with a three-deck spa, underwater lounge, and Michelin-star culinary team.",
    img: "https://images.unsplash.com/photo-1605281317010-fe5ffe798156?w=1200&q=80",
  },
  {
    id: 3,
    name: "Solaris Voyager",
    length: "72m",
    guests: 10,
    price: "From €620k/week",
    desc: "Sustainable exploration vessel equipped with hybrid propulsion and a sub-surface exploration pod.",
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
  },
];

const DESTINATIONS = [
  {
    name: "French Riviera",
    season: "May — September",
    highlights: "Monaco, St. Tropez, Cannes",
  },
  {
    name: "Amalfi Coast",
    season: "June — August",
    highlights: "Positano, Capri, Ravello",
  },
  {
    name: "Cyclades",
    season: "July — September",
    highlights: "Mykonos, Santorini, Paros",
  },
  {
    name: "Caribbean",
    season: "December — March",
    highlights: "St. Barths, Mustique, Grenadines",
  },
];

const STATS = [
  { label: "Global Charter Ports", value: "140+" },
  { label: "Vessels in Management", value: "85" },
  { label: "Crew Members", value: "1.2k" },
  { label: "Client Satisfaction", value: "99.8%" },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================= */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
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
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    },
    [x, y],
  );

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
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

export default function HorizonYachtPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeVessel, setActiveVessel] = useState<number | null>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#020a13] text-[#f4f4f4] font-sans selection:bg-[#c5a059] selection:text-white overflow-x-hidden">
      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-[#020a13]/90 backdrop-blur-2xl py-4 border-b border-white/5" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-4">
            <div className="w-12 h-12 border border-[#c5a059] rounded-full flex items-center justify-center text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-[#020a13] transition-all duration-500">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase leading-none italic">
                Horizon
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-[#c5a059] -mt-1 ml-1">
                Maritime Group
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {[
              "The_Fleet",
              "Charter",
              "Brokerage",
              "Destinations",
              "Concierge",
            ].map((link) => (
              <Link
                key={link}
                href="#fleet"
                className="hover:text-[#c5a059] transition-colors cursor-pointer"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden md:flex items-center gap-3 group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-[#c5a059] transition-colors">
                Client_Login
              </span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#c5a059] group-hover:text-[#020a13] group-hover:border-[#c5a059] transition-all">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-[#c5a059]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            className="fixed inset-0 z-[100] bg-[#020a13] p-12 flex flex-col justify-center gap-10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-[#c5a059]"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-6 text-6xl font-black italic uppercase text-white/10">
              {["Fleet", "Charter", "Brokerage", "Contact"].map((l) => (
                <Link
                  key={l}
                  href="#fleet"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-[#c5a059] transition-colors"
                >
                  {l}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1600&q=80"
            alt="Yacht Deck"
            fill
            className="object-cover opacity-60 contrast-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020a13] via-[#020a13]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 items-center">
          <Reveal>
            <Badge className="bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 text-[10px] font-bold uppercase tracking-[0.5em] mb-10 px-4 py-1.5 rounded-full">
              Global Maritime Excellence // Est. 1988
            </Badge>
            <h1 className="text-8xl md:text-[12rem] font-black leading-[0.8] tracking-tighter mb-12 uppercase text-white italic">
              Mastering <br />{" "}
              <span className="text-[#c5a059] not-italic">The Deep.</span>
            </h1>
            <p className="max-w-md text-lg text-white/50 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
              The world's most exclusive superyacht fleet, curated for the
              modern navigator.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn className="px-12 py-5 bg-[#c5a059] text-[#020a13] text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all cursor-pointer">
                View Current Fleet
              </MagneticBtn>
              <Link
                href="#fleet"
                className="px-12 py-5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-[#020a13] transition-all flex items-center justify-center gap-3"
              >
                Charter Portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-end gap-2 text-white/20">
          <span className="text-[10px] font-bold uppercase tracking-widest italic">
            Monte Carlo // Miami // Dubai
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Global Logistics Support 24/7
          </span>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-24 border-y border-white/5 bg-[#03101d]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center md:text-left">
                  <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c5a059] mb-2">
                    {stat.label}
                  </div>
                  <div className="text-5xl font-black italic text-white">
                    {stat.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FLEET ── */}
      <section id="fleet" className="py-32 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div>
                <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6 uppercase text-white">
                  The <br /> <span className="text-[#c5a059]">Vessels.</span>
                </h2>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                  Charter Manifest // Global Availability // Summer 2024
                </p>
              </div>
              <Link
                href="#"
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059] border-b border-[#c5a059] pb-2 hover:text-white hover:border-white transition-all"
              >
                Download Full Deck
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {FLEET.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <div
                  className="group space-y-10 cursor-pointer"
                  onMouseEnter={() => setActiveVessel(item.id)}
                  onMouseLeave={() => setActiveVessel(null)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-[#020a13]/30 group-hover:bg-transparent transition-colors duration-700" />

                    <div className="absolute top-6 left-6">
                      <Badge className="bg-[#020a13]/60 backdrop-blur-md text-white border-white/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                        {item.length}
                      </Badge>
                    </div>

                    <AnimatePresence>
                      {activeVessel === item.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-[#c5a059]/10 backdrop-blur-[2px]"
                        >
                          <button className="px-10 py-4 bg-white text-[#020a13] text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all shadow-2xl">
                            Explore Deck
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic group-hover:text-[#c5a059] transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/60 transition-colors">
                        {item.guests} Guests
                      </span>
                    </div>
                    <p className="text-sm text-white/30 font-light leading-relaxed uppercase tracking-widest italic">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-[#c5a059] tracking-tighter">
                        {item.price}
                      </span>
                      <div className="h-[1px] flex-1 bg-white/5" />
                      <Anchor className="w-5 h-5 text-white/10 group-hover:text-[#c5a059] transition-all" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARITIME SERVICES ── */}
      <section className="py-40 bg-[#03101d] overflow-hidden relative">
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] bg-[#c5a059]/5 blur-[120px] rounded-full" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-32">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059] mb-8 block">
                Operational Mastery
              </span>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">
                Naval{" "}
                <span className="text-[#c5a059] not-italic">
                  Infrastructure.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: "Charter Management",
                desc: "Maximizing the commercial potential of your vessel through global network integration.",
                icon: Ship,
              },
              {
                title: "New Build Advisory",
                desc: "Naval architecture and engineering oversight for the world's most ambitious builds.",
                icon: Anchor,
              },
              {
                title: "Crew Logistics",
                desc: "Rigorous selection and management of the world's most elite maritime professionals.",
                icon: Waves,
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-16 border border-white/5 bg-white/[0.01] hover:border-[#c5a059]/30 transition-all group h-full flex flex-col relative overflow-hidden">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[#c5a059] mb-10 group-hover:bg-[#c5a059] group-hover:text-[#020a13] transition-all duration-500">
                    <s.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white group-hover:translate-x-2 transition-transform">
                    {s.title}
                  </h3>
                  <p className="text-sm text-white/30 font-light leading-relaxed mb-12 flex-1 tracking-wide uppercase italic">
                    {s.desc}
                  </p>
                  <button className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#c5a059] group-hover:gap-6 transition-all">
                    Read Strategy <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="py-40 px-6 md:px-12 bg-[#020a13]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <Reveal>
            <div className="relative aspect-square rounded-sm overflow-hidden group border border-white/5">
              <Image
                src="https://images.unsplash.com/photo-1605281317010-fe5ffe798156?w=1200&q=80"
                alt="Destination"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-[3s] grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020a13] via-[#020a13]/20 to-transparent" />
              <div className="absolute bottom-16 left-16 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block text-[#c5a059]">
                  Monaco Grand Prix
                </span>
                <h4 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                  The Front Row <br /> of the World.
                </h4>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059] mb-8 block">
              Itinerary Design
            </span>
            <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-12 uppercase text-white">
              Infinite <br />{" "}
              <span className="text-[#c5a059] not-italic">Horizons.</span>
            </h2>
            <p className="text-white/40 text-xl leading-relaxed mb-16 font-light uppercase tracking-wide italic">
              Beyond the coordinates. We design bespoke experiences that merge
              absolute privacy with unprecedented access to the world's most
              guarded enclaves.
            </p>
            <div className="grid grid-cols-1 gap-8">
              {DESTINATIONS.map((d, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-6 border-b border-white/5 group hover:border-[#c5a059]/30 transition-all"
                >
                  <div>
                    <h4 className="text-2xl font-black uppercase italic text-white group-hover:text-[#c5a059] transition-colors">
                      {d.name}
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">
                      {d.highlights}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                    {d.season}
                  </span>
                </div>
              ))}
            </div>
            <MagneticBtn className="mt-20 px-14 py-6 border border-[#c5a059] text-[#c5a059] text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-[#c5a059] hover:text-[#020a13] transition-all shadow-2xl">
              Consult With A Specialist
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#020a13] pt-40 pb-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-32 mb-40">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 border border-[#c5a059] rounded-full flex items-center justify-center text-[#c5a059]">
                  <Compass className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black tracking-tighter uppercase leading-none italic">
                    Horizon
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059] -mt-1 ml-1">
                    Maritime Group
                  </span>
                </div>
              </div>
              <p className="text-white/20 max-w-md mb-16 text-[11px] font-bold uppercase tracking-[0.2em] leading-loose italic">
                The global authority in superyacht brokerage, charter, and naval
                management. Headquartered in Monaco, serving the world's most
                discerning navigators.
              </p>
              <div className="flex gap-6">
                {[Globe, Globe, Mail].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#c5a059] hover:text-[#020a13] hover:border-[#c5a059] transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#c5a059] mb-12">
              Portfolio
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Sales_Listings
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Charter_Fleet
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  New_Construction
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Case_Studies
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#c5a059] mb-12">
              Services
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Management
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Crewing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Charter_Marketing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Technical_Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#c5a059] mb-12">
              Contact
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Our_Bureaus
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Private_Consult
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Media_Inquiries
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
          <div className="flex items-center gap-12">
            <span>
              &copy; {new Date().getFullYear()} HORIZON MARITIME GROUP MONACO.
            </span>
            <div className="flex gap-8">
              <span>SOLAS_CERT_COMPLIANT</span>
              <span>LY3_CODE_VERIFIED</span>
            </div>
          </div>
          <div className="flex gap-12 font-mono">
            <span>COURSE_AUTO_NAV</span>
            <span>DEPTH_STATUS_OPTIMAL</span>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#020a13}
        ::-webkit-scrollbar-thumb{background:#c5a059}
      `}</style>
    </div>
  );
}
