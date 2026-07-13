"use client";
// @ts-nocheck

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
import { Building2, Key, ShieldCheck, Globe, Star, Mail, Phone, ChevronRight, ArrowRight, X, Menu, Gem, Briefcase, MapPin, Search, Plane, Users, Award, Calendar, Compass } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

const LISTINGS = [
  {
    id: 1,
    title: "The Obsidian Penthouse",
    location: "Billionaire's Row, NYC",
    price: "$84,000,000",
    sqft: "12,400",
    features: ["Private Helipad", "100ft Infinity Pool", "24/7 Butler"],
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  },
  {
    id: 2,
    title: "Villa L'Horizon",
    location: "Saint-Jean-Cap-Ferrat",
    price: "€62,500,000",
    sqft: "18,000",
    features: ["Private Beach Access", "Wine Cave", "Grotto Spa"],
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  },
  {
    id: 3,
    title: "The Glass Pavilion",
    location: "Bel Air, CA",
    price: "$45,000,000",
    sqft: "9,800",
    features: ["Automotive Gallery", "Outdoor Cinema", "Zen Garden"],
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
];

const SERVICES = [
  {
    title: "Asset Acquisition",
    desc: "Off-market access to the world's most exclusive real estate, yachts, and private aviation.",
    icon: Key,
  },
  {
    title: "Lifestyle Management",
    desc: "24/7 dedicated concierge for travel, security, and global event access.",
    icon: Compass,
  },
  {
    title: "Family Office Support",
    desc: "Confidential wealth transition and lifestyle infrastructure for high-net-worth families.",
    icon: ShieldCheck,
  },
];

const STATS = [
  { label: "Assets Managed", value: "$4.2B+" },
  { label: "Off-Market Deals", value: "94%" },
  { label: "Global Offices", value: "12" },
  { label: "Client Satisfaction", value: "NPS 98" },
];

const NAV_LINKS = [
  { label: "Estates", href: "#estates" },
  { label: "Concierge", href: "#concierge" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
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


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function SkylineConciergePage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeListing, setActiveListing] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);

  return (
    <div className="premium-theme min-h-screen bg-[#0a0a0a] text-[#ffffff] font-sans selection:bg-[#c9a96e] selection:text-black overflow-x-hidden">
      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="group flex items-center gap-3">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-[#c9a96e] to-[#8c7246] rounded-sm flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
                  <Building2 className="w-5 h-5 text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter uppercase leading-none">
                    Skyline
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#c9a96e] -mt-1">
                    Concierge Group
                  </span>
                </div>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-[#c9a96e] transition-colors cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden md:flex items-center gap-3 group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-[#c9a96e] transition-colors">
                Client_Login
              </span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#c9a96e] group-hover:text-black transition-all">
                <Key className="w-4 h-4" />
              </div>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-[#c9a96e]"
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] p-12 flex flex-col justify-center gap-10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-[#c9a96e]"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-6 text-5xl font-black italic uppercase text-white/10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="relative h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80"
            alt="Luxury Penthouse"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <Badge className="bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 text-[10px] font-bold uppercase tracking-[0.5em] mb-10 px-4 py-1.5 rounded-sm">
              Private Advisory // Global Access
            </Badge>
            <h1 className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter mb-10 uppercase">{c?.heroHeadline ?? <>
              The Standard of <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a96e] via-[#ffffff] to-[#c9a96e]">
                Absolute Luxury.
              </span>
            </>}</h1>
            <p className="max-w-2xl text-lg text-white/40 leading-relaxed font-light italic mb-12">{c?.heroSubline ?? fd?.tagline ?? <>
              Confidential brokerage and lifestyle management for the world's
              most discerning families. From off-market penthouses to global
              asset security.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="#contact">
                <MagneticBtn className="px-12 py-5 bg-[#c9a96e] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-white transition-all cursor-pointer shadow-2xl shadow-[#c9a96e]/20">
                  Request_Membership
                </MagneticBtn>
              </Link>
              <Link
                href="#estates"
                className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-white/5 transition-all flex items-center justify-center gap-3"
              >
                View Private Listings <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 left-12 flex flex-col gap-4">
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-1 h-8 bg-[#c9a96e]/20 group-hover:bg-[#c9a96e] transition-all" />
              <div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                  {stat.label}
                </div>
                <div className="text-lg font-black">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section id="concierge" className="py-32 px-6 md:px-12 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="text-center mb-24">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] mb-4 block">
                The Ecosystem
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                Comprehensive{" "}
                <span className="not-italic font-thin text-white">
                  Asset Control.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-12 border border-white/5 bg-black/40 hover:border-[#c9a96e]/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-[#c9a96e]/10 transition-colors">
                    <s.icon className="w-32 h-32" />
                  </div>
                  <div className="w-12 h-12 rounded-sm bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] mb-8 group-hover:bg-[#c9a96e] group-hover:text-black transition-all">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">
                    {s.title}
                  </h3>
                  <p className="text-sm text-white/30 leading-relaxed font-light italic mb-8">
                    {s.desc}
                  </p>
                  <button className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-[#c9a96e] group-hover:gap-5 transition-all">
                    Explore Capability <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="py-32 px-6 md:px-12 bg-[#0a0a0a] border-b border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] mb-8 block">
              Our Creed
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-8">{c?.aboutTitle ?? fd?.businessName ?? <>
              The Philosophy of <br />
              <span className="not-italic font-thin text-white">Absolute Discretion.</span>
            </>}</h2>
            <p className="text-white/40 text-lg leading-relaxed mb-8 font-light italic">{c?.aboutText ?? <>
              At Skyline Concierge Group, we operate at the unique intersection of wealth infrastructure, private security, and lifestyle orchestration.
            </>}</p>
            <p className="text-white/30 text-sm leading-relaxed mb-12 font-light">
              Our mission is to create a seamless operational environment for the world's most discerning individuals. By managing the complexities of luxury asset coordination, physical security detail, and private travel logistics, we restore the ultimate luxury: absolute freedom.
            </p>
            <div className="border-t border-white/10 pt-8 flex gap-8">
              <div>
                <div className="text-2xl font-black text-[#c9a96e]">CONFIDENTIAL</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">OPERATIONAL RULE</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">ISO 27001</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">INFORMATION SECURITY</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="relative aspect-video lg:aspect-[4/3] bg-neutral-900 border border-white/5">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Skyline Headquarter Consultation Room"
                fill
                className="object-cover opacity-60"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#c9a96e] animate-pulse" />
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#c9a96e]">
                  SALON PRIVÉ // LONDON
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRIVATE LISTINGS ── */}
      <section id="estates" className="py-32 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div>
                <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none mb-6 uppercase">
                  Private <br />{" "}
                  <span className="text-[#c9a96e]">Inventory.</span>
                </h2>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                  Restricted Access Listings // Required NDA
                </p>
              </div>
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-[#c9a96e] hover:text-black transition-all">
                  Request_NDA
                </button>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LISTINGS.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <div
                  className="group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer"
                  onMouseEnter={() => setActiveListing(item.id)}
                  onMouseLeave={() => setActiveListing(null)}
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a96e] mb-3">
                      {item.location}
                    </span>
                    <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter leading-none">
                      {item.title}
                    </h3>

                    <AnimatePresence>
                      {activeListing === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-6 pt-6 border-t border-white/10"
                        >
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <span>{item.sqft} SQ.FT</span>
                            <span className="text-white">{item.price}</span>
                          </div>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.features.map((f, j) => (
                              <li
                                key={j}
                                className="text-[8px] font-bold uppercase tracking-widest text-[#c9a96e] flex items-center gap-2"
                              >
                                <div className="w-1 h-1 bg-[#c9a96e] rounded-full" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-8 flex justify-between items-center">
                      <button className="px-6 py-3 bg-[#c9a96e] text-black text-[9px] font-black uppercase tracking-widest">
                        Inquire_Now
                      </button>
                      <Star className="w-4 h-4 text-white/20 group-hover:text-[#c9a96e] transition-colors" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section id="testimonials" className="py-32 px-6 md:px-12 bg-[#0d0d0d] border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="text-center mb-24">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] mb-4 block">
                Client Endorsements
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                Trusted by <br />
                <span className="not-italic font-thin text-white">Discerning Leaders.</span>
              </h2>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Skyline managed the off-market acquisition of our alpine estate and the security logistics for our family office within 48 hours. Absolute excellence.",
                author: "Family Office Principal",
                location: "Geneva",
              },
              {
                quote: "The lifestyle desk is truly outstanding. From securing last-minute yacht charters to private aviation coordination, their response time is unparalleled.",
                author: "Venture Partner",
                location: "Silicon Valley",
              },
              {
                quote: "Discretion is their currency. Skyline has become our trusted advisor for all non-financial infrastructure and global assets.",
                author: "Managing Director",
                location: "London",
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-12 border border-white/5 bg-black/40 hover:border-[#c9a96e]/30 transition-all relative">
                  <div className="text-5xl text-[#c9a96e]/20 font-serif absolute top-6 left-8 font-black leading-none">“</div>
                  <p className="text-sm text-white/50 leading-relaxed font-light italic mb-8 relative z-10 pt-4">
                    {t.quote}
                  </p>
                  <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a96e]">
                      {t.author}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                      {t.location}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBAL INFRASTRUCTURE ── */}
      <section id="global" className="py-32 bg-[#c9a96e] text-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/40 mb-8 block">
              Global Infrastructure
            </span>
            <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none mb-10 uppercase">
              Presence <br />{" "}
              <span className="text-white">Without Borders.</span>
            </h2>
            <p className="text-black/60 text-lg leading-relaxed mb-12 italic font-light">
              Our network spans across 12 strategic global hubs, providing
              seamless lifestyle continuity and asset security for clients in
              transit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { city: "New York", focus: "Fin_District" },
                { city: "London", focus: "Mayfair" },
                { city: "Dubai", focus: "DIFC" },
                { city: "Monaco", focus: "Monte_Carlo" },
              ].map((l, i) => (
                <div key={i} className="border-l border-black/10 pl-6 group">
                  <div className="text-3xl font-black uppercase tracking-tighter group-hover:text-white transition-colors">
                    {l.city}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-black/40">
                    {l.focus}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative aspect-square bg-black p-1">
              <Image
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
                alt="Mountain View"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Globe className="w-12 h-12 text-[#c9a96e]" />
                </div>
              </div>
              <div className="absolute top-10 right-10 flex flex-col gap-2">
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">
                  Secure_Node_Active
                </span>
                <div className="w-full h-[1px] bg-white/20" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" className="py-32 px-6 md:px-12 bg-[#0a0a0a] border-b border-white/5">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] mb-4 block">
                Information Desk
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                Frequently <br />
                <span className="not-italic font-thin text-white">Asked Questions.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                {
                  q: "How do I obtain membership?",
                  a: "Membership in Skyline Concierge Group is strictly limited. It is accessible by direct referral from an existing member, or by requesting an application via our private advisory desk for verification.",
                },
                {
                  q: "What private assets do you handle?",
                  a: "We specialize in off-market ultra-luxury real estate brokerage, yacht chartering, private aviation logistics, and bespoke security detail for high-net-worth individuals and families.",
                },
                {
                  q: "Are your lifestyle concierge services globally active?",
                  a: "Yes. With coordinate offices in Monaco, London, Dubai, and New York, our dispatch desk operates 24/7 globally to ensure continuity of service anywhere in transit.",
                },
                {
                  q: "Is an NDA required for private listings?",
                  a: "Yes. All off-market inventory viewings require a signed Non-Disclosure Agreement (NDA) and financial verification prior to sharing detailed specifications or scheduling private viewings.",
                },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-white/5 bg-black/40 px-6 rounded-sm">
                  <AccordionTrigger className="text-[11px] font-bold uppercase tracking-widest text-[#c9a96e] hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/40 text-sm font-light italic leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section id="contact" className="py-32 px-6 md:px-12 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] mb-8 block">
              Initiate Consultation
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-8">
              Secure <br />
              <span className="not-italic font-thin text-white">Communications.</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-12 font-light italic">
              Contact our private desk for membership inquiries or asset advisory. All transmissions are encrypted and treated with absolute confidentiality.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-sm bg-white/5 flex items-center justify-center text-[#c9a96e]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">EMAIL DESK</div>
                  <div className="text-sm font-bold">{fd?.email ?? "advisory@skylineconcierge.com"}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-sm bg-white/5 flex items-center justify-center text-[#c9a96e]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">SECURE VOICE</div>
                  <div className="text-sm font-bold">+377 97 97 XX XX (Monaco)</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-sm bg-white/5 flex items-center justify-center text-[#c9a96e]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">PRINCIPAL OFFICE</div>
                  <div className="text-sm font-bold">Monte Carlo, Monaco</div>
                </div>
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div className="p-12 border border-white/5 bg-black/40">
              {contactSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full border border-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e] mx-auto mb-6 bg-[#c9a96e]/5">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">SECURE TRANSMISSION RECEIVED</h3>
                  <p className="text-sm text-white/40 font-light italic">
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">FULL NAME</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a96e] transition-colors rounded-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">SECURE EMAIL</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a96e] transition-colors rounded-sm"
                        placeholder="j.doe@confidential.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">PHONE NUMBER</label>
                      <input
                        type="tel"
                        className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a96e] transition-colors rounded-sm"
                        placeholder="+44 20 7946 XXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">INQUIRY TYPE</label>
                    <select
                      className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white/60 focus:outline-none focus:border-[#c9a96e] transition-colors rounded-sm"
                    >
                      <option value="membership">Request Private Membership</option>
                      <option value="acquisition">Asset Acquisition</option>
                      <option value="security">Global Security Infrastructure</option>
                      <option value="other">General Consultation</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-white/40">SECURE TRANSMISSION</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a96e] transition-colors rounded-sm resize-none"
                      placeholder="Please outline the nature of your request..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#c9a96e] text-black text-[9px] font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
                  >
                    SEND ENCRYPTED MESSAGE
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0a0a] pt-32 pb-12 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-24 mb-32">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-[#c9a96e] rounded-sm flex items-center justify-center rotate-45">
                  <Building2 className="w-5 h-5 text-black -rotate-45" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter uppercase leading-none">
                    Skyline
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#c9a96e] -mt-1">
                    Concierge Group
                  </span>
                </div>
              </div>
              <p className="text-white/20 max-w-sm mb-12 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed italic">
                The intersection of high-net-worth wealth transition and
                absolute lifestyle sovereignty. Confidential by design.
              </p>
              <div className="flex gap-6">
                {[Globe, Globe, Globe].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:bg-[#c9a96e] hover:text-black transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9a96e] mb-10">
              Inventory
            </h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Residential_Estates
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Yacht_Charter
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Private_Aviation
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Art_Advisory
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9a96e] mb-10">
              Concierge
            </h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Lifestyle_Mgmt
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Global_Security
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Event_Access
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Health_Concierge
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9a96e] mb-10">
              Group
            </h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  The_Vault
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Offices
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#c9a96e] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-white/10">
          <div className="flex items-center gap-10">
            <span>
              &copy; {new Date().getFullYear()} SKYLINE CONCIERGE GROUP. ALL
              RIGHTS RESERVED.
            </span>
            <div className="flex gap-6">
              <span>SECURE_ENCRYPTION_V4.2</span>
              <span>ISO_27001_COMPLIANT</span>
            </div>
          </div>
          <div className="flex gap-10">
            <Link href="#contact" className="hover:text-[#c9a96e] transition-colors">Mentions Légales</Link>
            <Link href="#contact" className="hover:text-[#c9a96e] transition-colors">Confidentialité</Link>
            <Link href="#contact" className="hover:text-[#c9a96e] transition-colors">CGU</Link>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#0a0a0a}
        ::-webkit-scrollbar-thumb{background:#c9a96e}
      `}</style>
    </div>
  );
}
