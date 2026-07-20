"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Compass, Calendar, Users, Star, ArrowLeft, Globe, Sun, Cloud, Wind, Search, Menu, X, Plane, Coffee, Camera } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================== */

const DESTINATIONS = [
  {
    id: "dst-01",
    title: "Namib Desert",
    country: "Namibia",
    price: "$4,200",
    days: "8 Days",
    desc: "Traverse the oldest desert in the world. Witness the towering red dunes of Sossusvlei and the surreal dead-tree valleys of Deadvlei.",
    image:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop",
    color: "#d97736",
  },
  {
    id: "dst-02",
    title: "Atacama Plateau",
    country: "Chile",
    price: "$3,800",
    days: "10 Days",
    desc: "High-altitude salt flats, active geysers, and the clearest night skies on Earth. An alien landscape waiting to be explored.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
    color: "#b45309",
  },
  {
    id: "dst-03",
    title: "Cappadocia",
    country: "Turkey",
    price: "$2,900",
    days: "6 Days",
    desc: "Fairy chimneys, underground cities, and dawn balloon flights over ancient volcanic valleys.",
    image:
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1600&auto=format&fit=crop",
    color: "#c2410c",
  },
  {
    id: "dst-04",
    title: "Wadi Rum",
    country: "Jordan",
    price: "$3,100",
    days: "5 Days",
    desc: "The Valley of the Moon. Sleep in luxury glass domes under the stars and ride through sandstone canyons.",
    image:
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=1600&auto=format&fit=crop",
    color: "#9a3412",
  },
];

const EXPERIENCES = [
  {
    title: "Private Expeditions",
    icon: <Compass className="w-6 h-6 text-amber-500" />,
    desc: "Fully tailored itineraries crafted by local experts. Go where the guidebooks don't.",
  },
  {
    title: "Aerial Safaris",
    icon: <Plane className="w-6 h-6 text-amber-500" />,
    desc: "Gain a new perspective. Charter flights over inaccessible terrain and untouched wilderness.",
  },
  {
    title: "Cultural Immersion",
    icon: <Coffee className="w-6 h-6 text-amber-500" />,
    desc: "Spend time with indigenous communities, learning ancient survival and crafting techniques.",
  },
  {
    title: "Photography Tours",
    icon: <Camera className="w-6 h-6 text-amber-500" />,
    desc: "Led by National Geographic award winners. Master landscape and wildlife photography.",
  },
];

const REVIEWS = [
  {
    text: "The Atacama expedition changed the way I see the world. The logistics were flawless, allowing us to just focus on the overwhelming beauty of the landscape.",
    author: "Marcus T.",
    role: "Photographer",
  },
  {
    text: "Sleeping in the Namib desert under a billion stars, with nothing but silence around us. Absolute perfection from start to finish.",
    author: "Elena R.",
    role: "Travel Writer",
  },
  {
    text: "Wanderlust doesn't just book trips; they architect life-changing moments. Worth every single penny.",
    author: "Julian S.",
    role: "Entrepreneur",
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

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
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function WanderlustPage() {
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

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 1;
    const _photoArrays: any[] = [DESTINATIONS];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [activeDst, setActiveDst] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const nextDst = () =>
    setActiveDst((prev) => (prev + 1) % DESTINATIONS.length);
  const prevDst = () =>
    setActiveDst(
      (prev) => (prev - 1 + DESTINATIONS.length) % DESTINATIONS.length,
    );

  return (
    <div className="premium-theme min-h-dvh bg-[#0c0a09] text-stone-100 font-sans selection:bg-amber-500/30 selection:text-white">
      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0c0a09]/90 backdrop-blur-md py-4 border-b border-amber-900/20" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="#hero"
            className="text-xl md:text-2xl font-bold tracking-tighter uppercase flex items-center gap-2"
          >
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                Wander<span className="text-amber-500">Lust.</span>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest">
            <Link href="#hero" className="hover:text-amber-500 transition-colors">
              Destinations
            </Link>
            <Link href="#hero" className="hover:text-amber-500 transition-colors">
              Expeditions
            </Link>
            <Link href="#apropos" className="hover:text-amber-500 transition-colors">
              Journal
            </Link>
            <Link href="#apropos" className="hover:text-amber-500 transition-colors">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-stone-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="px-6 py-2.5 bg-amber-500 text-stone-900 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors rounded-sm">
              Plan Your Trip
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-stone-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-[#0c0a09] p-6 pt-24 flex flex-col"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-6 text-stone-400"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-8 text-3xl font-light">
              <Link href="#hero" onClick={() => setMenuOpen(false)}>
                Destinations
              </Link>
              <Link href="#hero" onClick={() => setMenuOpen(false)}>
                Expeditions
              </Link>
              <Link href="#apropos" onClick={() => setMenuOpen(false)}>
                Journal
              </Link>
              <Link href="#apropos" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
            </div>
            <div className="mt-auto mb-8">
              <button className="w-full py-4 bg-amber-500 text-[#0c0a09] text-xs font-bold uppercase tracking-widest rounded-sm">
                Plan Your Trip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO CAROUSEL
          ========================================== */}
      <section id="hero" className="relative w-full h-[100svh] overflow-hidden bg-[#0c0a09]">
        {/* Background Images */}
        <AnimatePresence initial={false}>
          <motion.div
            key={activeDst}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={DESTINATIONS[activeDst].image}
              alt={DESTINATIONS[activeDst].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a09]/80 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-24 md:pb-32 pt-32 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end w-full">
            {/* Left Info */}
            <div className="lg:col-span-8 pointer-events-auto">
              <motion.div
                key={`info-${activeDst}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 text-amber-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-6">
                  <MapPin className="w-4 h-4" />{" "}
                  {DESTINATIONS[activeDst].country}
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-6">{c?.heroHeadline ?? <>
                  {DESTINATIONS[activeDst].title}
                </>}</h1>
                <p className="text-lg md:text-xl text-stone-300 max-w-2xl leading-relaxed mb-8 font-light">{c?.heroSubline ?? fd?.tagline ?? <>
                  {DESTINATIONS[activeDst].desc}
                </>}</p>
                <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />{" "}
                    {DESTINATIONS[activeDst].days}
                  </div>
                  <div className="flex items-center gap-2 text-amber-500">
                    {DESTINATIONS[activeDst].price}{" "}
                    <span className="text-stone-500">/pp</span>
                  </div>
                </div>
                <button className="mt-10 px-8 py-4 bg-amber-500 text-stone-900 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors rounded-sm flex items-center gap-3">
                  View Itinerary <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            {/* Right Controls & Thumbnails */}
            <div className="lg:col-span-4 flex flex-col items-end gap-8 pointer-events-auto hidden md:flex">
              <div className="flex gap-4">
                <button
                  onClick={prevDst}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors backdrop-blur-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextDst}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors backdrop-blur-md"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4">
                {DESTINATIONS.map((dst, i) => (
                  <button
                    key={dst.id}
                    onClick={() => setActiveDst(i)}
                    className={`relative w-24 h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${activeDst === i ? "border-amber-500 scale-110" : "border-transparent opacity-50 hover:opacity-100"}`}
                  >
                    <Image
                      src={dst.image}
                      alt={dst.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. METRICS / STATS
          ========================================== */}
      <section className="py-12 bg-amber-500 text-[#0c0a09] relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-amber-600/30">
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-black tracking-tighter mb-1">
              15+
            </div>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">
              Years Experience
            </div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-black tracking-tighter mb-1">
              42
            </div>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">
              Remote Destinations
            </div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-black tracking-tighter mb-1">
              4.9/5
            </div>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">
              Guest Satisfaction
            </div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-black tracking-tighter mb-1">
              100%
            </div>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">
              Carbon Offset
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. EXPERIENCES GRID
          ========================================== */}
      <section id="apropos" className="py-32 bg-[#0c0a09] border-y border-stone-800/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[10px] text-amber-500 uppercase tracking-[0.3em] font-bold block mb-4">
              Curated Journeys
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">{c?.aboutTitle ?? fd?.businessName ?? <>
              Redefining Exploration.
            </>}</h2>
            <p className="text-stone-400 text-lg font-light leading-relaxed">{c?.aboutText ?? <>
              We design travel experiences for those who seek the extraordinary.
              Away from the crowds, immersed in the authentic rhythm of the
              planet.
            </>}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EXPERIENCES.map((exp, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 rounded-2xl bg-stone-900/30 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-900/80 transition-all group">
                  <div className="w-14 h-14 rounded-xl bg-[#0c0a09] border border-stone-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {exp.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{exp.title}</h3>
                  <p className="text-stone-400 leading-relaxed font-light">
                    {exp.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. FEATURED ITINERARY (Split Layout)
          ========================================== */}
      <section id="contact" className="py-32 bg-[#0a0807] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal className="relative aspect-[4/5] rounded-2xl overflow-hidden order-2 lg:order-1">
              <Image
                src={photo(0, "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200&auto=format&fit=crop")}
                alt="Safari"
                fill
                className="object-cover hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest rounded-sm backdrop-blur-sm">
                    Wildlife
                  </span>
                  <span className="px-3 py-1 bg-black/40 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm backdrop-blur-sm">
                    12 Days
                  </span>
                </div>
                <h3 className="text-3xl font-bold">The Great Migration</h3>
              </div>
            </Reveal>

            <div className="order-1 lg:order-2">
              <Reveal>
                <span className="text-[10px] text-amber-500 uppercase tracking-[0.3em] font-bold block mb-4">
                  Featured Signature Trip
                </span>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                  Witness the greatest show on earth.
                </h2>
                <p className="text-stone-400 text-lg leading-relaxed font-light mb-10">
                  Track millions of wildebeest and zebra across the Serengeti
                  and Masai Mara. Stay in exclusive mobile camps that move with
                  the herds, ensuring you are always at the heart of the action.
                </p>

                <ul className="space-y-6 mb-12">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-1">
                      <Star className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">
                        Luxury Mobile Camps
                      </h4>
                      <p className="text-sm text-stone-500">
                        Uncompromising comfort in the most remote locations.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-1">
                      <Users className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">
                        Expert Trackers
                      </h4>
                      <p className="text-sm text-stone-500">
                        Guided by Maasai warriors with generations of knowledge.
                      </p>
                    </div>
                  </li>
                </ul>

                <button className="px-8 py-4 border border-amber-500 text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-[#0c0a09] transition-colors rounded-sm">
                  View Full Itinerary
                </button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. TESTIMONIALS MARQUEE
          ========================================== */}
      <section className="py-32 bg-[#0c0a09] border-y border-stone-800/50 overflow-hidden">
        <div className="mb-16 text-center px-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500 block mb-4">
            Traveler Stories
          </span>
          <h2 className="text-4xl font-bold tracking-tighter">
            Words from the Wild
          </h2>
        </div>

        <div className="relative flex whitespace-nowrap">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0c0a09] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0c0a09] to-transparent z-10" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 px-4"
          >
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div
                key={i}
                className="w-[400px] md:w-[500px] border border-stone-800 p-10 bg-[#0a0807] whitespace-normal shrink-0 rounded-xl"
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <p className="text-lg italic text-stone-300 leading-relaxed mb-8 font-light">
                  "{r.text}"
                </p>
                <div>
                  <div className="font-bold text-stone-100">{r.author}</div>
                  <div className="text-xs text-stone-500 uppercase tracking-widest">
                    {r.role}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          6. MEGA FOOTER
          ========================================== */}
      <footer className="bg-[#0a0807] pt-32 pb-12 px-6 md:px-12 border-t border-amber-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
            <div>
              <Reveal>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
                  Ready for the <br />
                  <span className="text-amber-500">Unknown?</span>
                </h2>
                <p className="text-stone-400 text-lg max-w-md">
                  Our expedition designers are ready to craft your next great
                  adventure.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <button className="px-10 py-5 bg-amber-500 text-stone-900 text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors rounded-sm flex items-center gap-3">
                Start Planning <ArrowRight className="w-5 h-5" />
              </button>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 border-t border-stone-800 mb-16">
            <div className="lg:col-span-1">
              <Link
                href="#hero"
                className="text-2xl font-bold tracking-tighter uppercase mb-6 block"
              >
                Wander<span className="text-amber-500">Lust.</span>
              </Link>
              <p className="text-stone-500 text-sm leading-relaxed mb-8">
                Curators of extraordinary journeys to the most remote corners of
                the globe.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-6">
                Destinations
              </h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Africa & Safaris
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Polar Regions
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Latin America
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Asia & Himalayas
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-6">
                Company
              </h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Sustainability Impact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Travel Journal
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-6">
                Dispatch Newsletter
              </h4>
              <p className="text-sm text-stone-400 mb-4">
                Field notes, photography, and exclusive expedition
                announcements.
              </p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-transparent border-b border-stone-700 px-0 py-3 flex-1 text-sm focus:outline-none focus:border-amber-500 text-white transition-colors"
                />
                <button
                  type="submit"
                  className="border-b border-stone-700 px-4 py-3 text-[10px] uppercase tracking-widest font-bold hover:text-amber-500 text-stone-500 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-stone-800 text-[10px] uppercase tracking-widest font-bold text-stone-600">
            <span>
              &copy; {new Date().getFullYear()} Wanderlust Expeditions. All
              rights reserved.
            </span>
            <div className="flex gap-6">
              <Link href="#contact" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#contact" className="hover:text-white transition-colors">
                Terms of Booking
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
