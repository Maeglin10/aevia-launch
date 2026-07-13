"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Menu, X, Clock, MapPin, Phone, Mail, Star, ChevronDown, ArrowRight, Leaf, Flame, Wine, Utensils, CalendarDays, Users, Camera, Award, Globe, CheckCircle2 } from "lucide-react"

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const MENU_ITEMS: Record<string, { name: string; desc: string; price: string; tag?: string; allergens?: string }[]> = {
  starters: [
    { name: "Burrata Pugliese", desc: "Creamy burrata, heirloom tomatoes from Marmande, aged 12-year balsamic reduction, Ligurian basil oil, fleur de sel", price: "24", tag: "Chef's Pick", allergens: "Dairy" },
    { name: "Tartare de Saumon Écossais", desc: "Hand-cut Scottish salmon, avocado mousse, yuzu gel, crispy shallots, Oscietra caviar", price: "32", tag: "New", allergens: "Fish" },
    { name: "Velouté de Cèpes", desc: "Wild porcini mushroom velouté, truffle cream foam, sourdough croutons, aged parmesan snow", price: "22", allergens: "Gluten, Dairy" },
    { name: "Carpaccio di Manzo Wagyu", desc: "A5 Wagyu beef carpaccio, wild rocket, 36-month parmesan, lemon-caper dressing, truffle oil", price: "38", allergens: "Dairy" },
    { name: "Foie Gras de Canard", desc: "48-hour terrine of duck foie gras, Sauternes gel, toasted brioche, Périgord black truffle shavings", price: "42", tag: "Signature", allergens: "Gluten, Dairy" },
  ],
  mains: [
    { name: "Filet de Bœuf Rossini", desc: "220g prime Charolais tenderloin, pan-seared foie gras, black truffle jus, pomme purée Joël Robuchon", price: "68", tag: "Signature", allergens: "Dairy" },
    { name: "Homard Breton Entier", desc: "Whole Blue Lobster from Brittany, coral thermidor sauce, gratin dauphinois, seasonal micro greens", price: "84" },
    { name: "Risotto al Tartufo Nero", desc: "Carnaroli rice cooked 18 minutes, shaved fresh Périgord truffle, 36-month parmesan, Normandy brown butter", price: "52", allergens: "Dairy" },
    { name: "Sole de Petit Bateau", desc: "Dover sole meunière, capers, lemon beurre blanc, pommes vapeur, samphire", price: "58", allergens: "Fish, Dairy" },
    { name: "Canard de Challans", desc: "48-hour slow-confit duck leg, Griotte cherry reduction, roasted root vegetables, crispy skin", price: "54", tag: "New" },
    { name: "Agneau de Lozère", desc: "Rack of lamb, herb crust, Provençal jus, flageolet bean cassoulet, lamb sweetbread", price: "62", allergens: "Gluten, Dairy" },
  ],
  desserts: [
    { name: "Soufflé Grand Marnier", desc: "Classic soufflé with Valrhona 70% dark chocolate, vanilla bean crème anglaise, candied orange zest", price: "24", tag: "Must Try", allergens: "Gluten, Dairy, Eggs" },
    { name: "Tarte Tatin Tradition", desc: "Caramelized Granny Smith tart, Pays d'Auge calvados ice cream, salted butter caramel", price: "22", allergens: "Gluten, Dairy" },
    { name: "Crème Brûlée Tahitienne", desc: "Double Tahitian vanilla custard, caramelized sugar lacquer, Gariguette strawberries", price: "19", allergens: "Dairy, Eggs" },
    { name: "Assiette Fromagère", desc: "Five aged raw-milk French cheeses, Landes honeycomb, walnut bread, seasonal fruit preserves", price: "28", allergens: "Dairy, Gluten" },
  ],
  wines: [
    { name: "Chablis Premier Cru 'Montée de Tonnerre'", desc: "Domaine William Fèvre · Burgundy, France · 2022 — Mineral, flint, and white stone fruit", price: "90", allergens: "Sulfites" },
    { name: "Châteauneuf-du-Pape Blanc", desc: "Château de Beaucastel · Rhône Valley · 2020 — White peach, honeysuckle, extraordinary weight", price: "145", tag: "Sommelier Pick", allergens: "Sulfites" },
    { name: "Barolo Riserva 'Monfortino'", desc: "Giacomo Conterno · Piedmont, Italy · 2016 — Tar, roses, great tannin structure", price: "220", allergens: "Sulfites" },
    { name: "Dom Pérignon Rosé", desc: "Vintage Champagne · Épernay, France · 2013 — Raspberry, toast, exceptional mousse", price: "390", tag: "Prestige", allergens: "Sulfites" },
    { name: "Pétrus", desc: "Pomerol AOC · Bordeaux, France · 2015 — Truffles, dark plum, iron — the pinnacle", price: "980", allergens: "Sulfites" },
  ],
}

// Real menu from the client's wizard input (c?.menuItems) takes priority over
// the demo dishes above. Categories are derived from the items' `category`
// field (fallback "Menu"); prices are kept EXACTLY as provided (already strings).
function buildMenuRecord(items: { name: string; price: string; description?: string; category?: string }[]): Record<string, { name: string; desc: string; price: string; tag?: string; allergens?: string }[]> {
  const record: Record<string, { name: string; desc: string; price: string; tag?: string; allergens?: string }[]> = {};
  for (const item of items) {
    const cat = item.category || "Menu";
    (record[cat] = record[cat] || []).push({ name: item.name, desc: item.description || "", price: item.price });
  }
  return record;
}

const MENU_TAB_ICONS = [Leaf, Flame, Utensils, Wine];

const STATS = [
  { value: "2★", label: "Michelin Stars", icon: <Award className="w-5 h-5" /> },
  { value: "98/100", label: "Wine Spectator", icon: <Wine className="w-5 h-5" /> },
  { value: "#4", label: "Best Restaurants France", icon: <Globe className="w-5 h-5" /> },
  { value: "2018", label: "Founded", icon: <CalendarDays className="w-5 h-5" /> },
  { value: "8,400+", label: "Dinners Served", icon: <Users className="w-5 h-5" /> },
  { value: "240+", label: "Wine References", icon: <Leaf className="w-5 h-5" /> },
]

const TESTIMONIALS = [
  {
    name: "Pierre Manchon",
    role: "Michelin Inspector (Retired)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    rating: 5,
    text: "The Rossini is without question the finest interpretation of this classic I have encountered in forty years of criticism. Chef Beaumont has an almost supernatural sense of harmony between richness and restraint.",
    date: "March 2026",
  },
  {
    name: "Claire Dubois",
    role: "Editor, Le Fooding",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "An evening at L'Étoile is not dinner — it is theatre, literature, and fine art served simultaneously. The sommelier's pairing of the Barolo with the Wagyu carpaccio was a revelation I will revisit in memory for years.",
    date: "February 2026",
  },
  {
    name: "Thomas Wentworth",
    role: "CEO, Meridian Capital Partners",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    text: "We celebrated our twentieth anniversary here. Every detail, from the temperature of the bread to the timing between courses, was impeccably calibrated. L'Étoile is where memories are made.",
    date: "January 2026",
  },
  {
    name: "Yuki Tanaka",
    role: "Culinary Director, Ginza Six",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "I travel to Paris specifically for the tasting menu. The seven-course journey is as coherent as a great novel — each dish the inevitable consequence of the last. Nowhere else achieves this narrative in cuisine.",
    date: "December 2025",
  },
  {
    name: "Marcus Lehmann",
    role: "Food Critic, Der Feinschmecker",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    rating: 5,
    text: "The homard thermidor sauce alone deserves preservation as cultural heritage. L'Étoile operates at a level that transcends fashion entirely — this cooking will still be relevant in thirty years.",
    date: "November 2025",
  },
]

const PRICING = [
  {
    name: "À La Carte",
    price: "From €85",
    period: "per person",
    desc: "Full freedom to compose your evening from our seasonal menu.",
    features: [
      "Complete menu access",
      "À la carte wine selection",
      "Aperitif service",
      "Valet parking included",
      "Complimentary amuse-bouches",
    ],
    cta: "Reserve A La Carte",
    popular: false,
  },
  {
    name: "Tasting Menu",
    price: "€145",
    period: "per person",
    desc: "Seven courses curated by Chef Beaumont around the season's finest ingredients.",
    features: [
      "7 signature courses",
      "Wine pairing available +€85",
      "Cheese trolley service",
      "Digestif selection",
      "Complimentary transport home",
      "Signed menu card keepsake",
    ],
    cta: "Reserve Tasting Menu",
    popular: true,
  },
  {
    name: "Private Dining",
    price: "From €220",
    period: "per person",
    desc: "Exclusive use of our salon privé for groups of 8–20 guests.",
    features: [
      "Exclusive private room",
      "Bespoke menu by the Chef",
      "Dedicated sommelier",
      "Floral arrangement included",
      "Custom printed menus",
      "Full event management",
    ],
    cta: "Enquire About Private Dining",
    popular: false,
  },
]

const FAQS = [
  { q: "How far in advance should I book?", a: "We strongly recommend reserving at least three to four weeks in advance for Friday and Saturday evenings. Midweek tables are sometimes available with shorter notice. Private dining events require a minimum of two weeks." },
  { q: "Is there a dress code?", a: "We maintain a smart elegant dress code. Jackets are appreciated for gentlemen at dinner. We politely ask that sportswear and open footwear are not worn in the dining room." },
  { q: "Can you accommodate dietary requirements?", a: "Absolutely. Chef Beaumont and our team can adapt the tasting menu for vegetarian, vegan, gluten-free, and most allergy requirements when notified at time of booking. Please specify any requirements in your reservation." },
  { q: "Is a deposit required for reservations?", a: "A credit card guarantee is required for all bookings. For the tasting menu and private dining, a €50 per person deposit is charged at booking. Cancellations within 48 hours forfeit the deposit." },
  { q: "Do you offer gift vouchers?", a: "Yes. Gift vouchers are available for specific experiences (tasting menu, private dining) or in fixed monetary denominations from €100. They may be purchased online or by contacting us directly." },
  { q: "Is the wine list available to preview?", a: "Our full wine list of 240+ references is available on request. Our sommelier Camille Lefebvre is delighted to discuss pairings and curate a selection for your evening before you arrive." },
  { q: "What is the nearest parking?", a: "We have a partnership with Parking de l'Élysée on Avenue de Marigny (3-minute walk). Valet parking is also available Thursday through Saturday evenings from 19h." },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function LEtoileRestaurant() {
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

  // Real client menu (from the wizard) or template demo dishes.
  const hasRealMenu = !!(c?.menuItems && c.menuItems.length > 0);
  const menuData = hasRealMenu ? buildMenuRecord(c.menuItems) : MENU_ITEMS;
  const menuTabs = hasRealMenu
    ? Object.keys(menuData).map((cat, i) => {
        const TabIcon = MENU_TAB_ICONS[i % MENU_TAB_ICONS.length];
        return { id: cat, label: cat, icon: <TabIcon className="w-4 h-4" /> };
      })
    : [
        { id: "starters", label: "Starters", icon: <Leaf className="w-4 h-4" /> },
        { id: "mains", label: "Main Courses", icon: <Flame className="w-4 h-4" /> },
        { id: "desserts", label: "Desserts", icon: <Utensils className="w-4 h-4" /> },
        { id: "wines", label: "Wine List", icon: <Wine className="w-4 h-4" /> },
      ];

  const [reservationOpen, setReservationOpen] = useState(false)
  const [guests, setGuests] = useState(2)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  type ActivePage = 'home' | 'menu' | 'reservation' | 'about' | 'contact' | 'mentions' | 'privacy';
  const [page, setPage] = useState<ActivePage>('home');
  const goTo = (p: ActivePage) => {
    setPage(p);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
  };

  
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
    <div className="bg-[#0c0a08] text-[#f5efe6] min-h-screen selection:bg-amber-700 selection:text-white" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", overflowX: "clip" }}>
      
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0c0a08]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center">
          <button onClick={() => goTo('home')} className="bg-transparent border-none text-[#f5efe6] text-left cursor-pointer">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <><span className="text-2xl tracking-wide"><span className="font-light">L&apos;</span><span className="italic">Étoile</span></span></>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'Menu', 'Reservation', 'About', 'Contact'].map(item => {
              const key = item.toLowerCase() as ActivePage;
              return (
                <button
                  key={item}
                  onClick={() => goTo(key)}
                  className={`text-[10px] uppercase tracking-[0.25em] font-sans font-medium bg-transparent border-none transition-all duration-200 cursor-pointer ${page === key ? 'text-[#f5efe6]' : 'text-[#f5efe6]/40 hover:text-[#f5efe6]'}`}
                >
                  {item}
                </button>
              );
            })}
            <button onClick={() => goTo('reservation')} className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-[10px] uppercase tracking-[0.2em] font-sans font-bold transition-all duration-200 rounded-sm cursor-pointer">
              Reserve a Table
            </button>
          </div>

          <Sheet>
            <SheetTrigger className="lg:hidden cursor-pointer"><Menu className="w-5 h-5" /></SheetTrigger>
            <SheetContent side="right" className="bg-[#0c0a08] border-white/10 text-[#f5efe6]">
              <div className="flex flex-col gap-8 mt-12">
                <span className="text-xl mb-6"><span className="font-light">L&apos;</span><span className="italic">Étoile</span></span>
                {['Home', 'Menu', 'Reservation', 'About', 'Contact'].map(item => {
                  const key = item.toLowerCase() as ActivePage;
                  return (
                    <button key={item} onClick={() => goTo(key)} className="text-2xl font-light italic text-left bg-transparent border-none text-[#f5efe6] hover:text-amber-500 transition-all duration-200 cursor-pointer">{item}</button>
                  );
                })}
                <button onClick={() => goTo('reservation')} className="mt-4 px-8 py-3 bg-amber-700 hover:bg-amber-600 text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer">
                  Reserve a Table
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {page === 'home' && (
      <>
      {/* ── HERO ── */}
      <section ref={heroRef} id="hero" className="relative h-screen overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroImgY }} className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" fill className="object-cover" alt="L'Étoile dining room" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08] via-[#0c0a08]/50 to-[#0c0a08]/20" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(12,10,8,0.85) 100%)" }} />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-amber-700/60" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-amber-500 font-sans font-semibold">Fine Dining · 8e Arrondissement · Paris</span>
              <div className="h-px w-16 bg-amber-700/60" />
            </div>
          </motion.div>

          <div className="overflow-hidden mb-4">
            <motion.h1 initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }} className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light tracking-[-0.02em] leading-[0.85] text-[#f5efe6]">{c?.heroHeadline ?? <>{fd?.businessName ?? "L'Étoile Restaurant"}</>}</motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.p initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.85 }} className="text-xl md:text-2xl text-[#f5efe6]/35 font-light italic">{c?.heroSubline ?? fd?.tagline ?? <>
              Where every dish tells a story
            </>}</motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={() => setReservationOpen(true)} className="px-10 py-4 bg-amber-700 hover:bg-amber-600 text-[11px] uppercase tracking-[0.3em] font-sans font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer">
              <CalendarDays className="w-4 h-4" /> Reserve Your Table
            </button>
            <button onClick={() => document.getElementById("menu")?.scrollIntoView({behavior:"smooth"})} className="px-10 py-4 border border-[#f5efe6]/15 text-[11px] uppercase tracking-[0.3em] font-sans font-semibold hover:border-amber-600 hover:text-amber-500 transition-all duration-200 cursor-pointer">
              View Menu
            </button>
          </motion.div>

          {/* Floating stat cards */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: <Award className="w-4 h-4 text-amber-500" />, label: "Michelin ★★", sub: "2022 — Present" },
              { icon: <Clock className="w-4 h-4 text-amber-500" />, label: "Tue–Sun 19h–23h", sub: "Sunday Lunch 12h" },
              { icon: <MapPin className="w-4 h-4 text-amber-500" />, label: "8e Arrondissement", sub: "Paris, France" },
            ].map((s, i) => (
              <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 1.2, ease: "easeInOut" }} className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-xl">
                {s.icon}
                <div className="text-left">
                  <div className="text-[11px] font-sans font-semibold text-[#f5efe6]/80">{s.label}</div>
                  <div className="text-[9px] font-sans text-[#f5efe6]/30 uppercase tracking-wider">{s.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 cursor-pointer">
          <ChevronDown className="w-5 h-5 text-[#f5efe6]/20" />
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-16 px-6 bg-[#0f0d0a] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="text-center group cursor-default">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-700/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-700 group-hover:text-white transition-all duration-200">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-light text-amber-500 mb-1">{stat.value}</div>
                  <div className="text-[9px] uppercase tracking-[0.25em] font-sans text-[#f5efe6]/30 font-semibold">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES (MENU) WITH TABS ── */}
      <section id="menu" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-sans font-semibold mb-4 block">La Carte · Saison 2026</span>
              <h2 className="text-5xl md:text-7xl font-light">{c?.aboutTitle ?? fd?.businessName ?? <>
                Our <span className="italic">Menu</span>
              </>}</h2>
              <p className="mt-4 text-[#f5efe6]/40 font-sans text-sm max-w-xl mx-auto leading-relaxed">{c?.aboutText ?? <>
                Each dish is composed around the finest seasonal ingredients, sourced from trusted suppliers across France and Europe.
              </>}</p>
            </div>
          </Reveal>

          <Tabs key={hasRealMenu ? "real-menu" : "demo-menu"} defaultValue={menuTabs[0]?.id ?? "starters"} className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent mb-12">
              {menuTabs.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2 px-6 py-3 rounded-full font-sans text-[11px] uppercase tracking-wider font-semibold data-[state=active]:bg-amber-700 data-[state=active]:text-white text-[#f5efe6]/40 border border-white/10 hover:text-[#f5efe6] hover:border-white/30 transition-all duration-200 cursor-pointer">
                  {cat.icon}{cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(menuData).map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-0">
                  {items.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      className="group flex items-start justify-between py-8 border-b border-white/5 hover:border-amber-700/30 transition-all duration-200 cursor-default"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl md:text-2xl font-light group-hover:text-amber-400 transition-colors duration-200">{item.name}</h3>
                          {item.tag && <Badge className="bg-amber-700/20 text-amber-400 border-amber-700/30 text-[8px] uppercase tracking-widest font-bold">{item.tag}</Badge>}
                        </div>
                        <p className="text-sm font-sans text-[#f5efe6]/30 max-w-lg leading-relaxed">{item.desc}</p>
                        {item.allergens && <p className="text-[9px] font-sans text-[#f5efe6]/15 uppercase tracking-wider mt-1">Contains: {item.allergens}</p>}
                      </div>
                      <div className="flex items-center gap-3 ml-8 shrink-0 pt-1">
                        <div className="hidden md:block h-px w-10 bg-white/5 group-hover:bg-amber-700/30 transition-colors duration-200" />
                        <span className="text-xl font-light text-amber-500">{hasRealMenu ? item.price : `${item.price}€`}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                <div className="mt-10 text-center">
                  <p className="text-[10px] font-sans text-[#f5efe6]/20 uppercase tracking-wider">All dishes prepared fresh daily · Seasonal availability may vary</p>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <Reveal>
            <Card className="mt-16 bg-amber-700/10 border-amber-700/20">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-light mb-1">Menu Dégustation <span className="italic">Saison</span></h3>
                  <p className="text-sm font-sans text-[#f5efe6]/50">Seven-course seasonal journey · Wine pairing available</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-light text-amber-500 mb-1">€145 <span className="text-sm text-[#f5efe6]/40">+ €85 pairing</span></div>
                  <button onClick={() => setReservationOpen(true)} className="text-[10px] uppercase tracking-widest font-sans font-bold text-amber-400 hover:text-amber-300 flex items-center gap-2 ml-auto transition-all duration-200 cursor-pointer">
                    Reserve now <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="py-32 md:py-40 bg-[#0f0d0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-sans font-semibold mb-4 block">Ambiance</span>
                <h2 className="text-4xl md:text-6xl font-light">A <span className="italic">Sensory</span> Journey</h2>
              </div>
              <a href={`https://instagram.com/${fd?.instagram ?? "letoile.paris"}`} className="text-sm font-sans text-amber-500 flex items-center gap-2 hover:gap-4 transition-all duration-200 cursor-pointer">
                <Globe className="w-4 h-4" /> @letoile.paris
              </a>
            </div>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-2 md:px-6">
          {[
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
            "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
          ].map((img, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className={`relative overflow-hidden group cursor-pointer ${i === 0 || i === 5 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}>
                <Image src={img} alt={`Restaurant ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      <section id="story" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80" alt="Chef Antoine Beaumont" fill className="object-cover" />
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-6 -right-6 bg-amber-700 text-white p-6 rounded-2xl shadow-2xl">
                <div className="text-3xl font-light mb-1">★★</div>
                <div className="text-[9px] uppercase tracking-widest font-sans font-bold opacity-80">Michelin<br />Stars</div>
              </motion.div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <span className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-sans font-semibold mb-6 block">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-light leading-[1.1] mb-8">
              Born from a passion<br />for <span className="italic">Provence</span>
            </h2>
            <p className="text-[#f5efe6]/50 font-sans leading-relaxed mb-6">
              Chef Antoine Beaumont grew up among the lavender fields and olive groves of the Var, where his grandmother taught him that great cooking begins with reverence for the ingredient. After training at Le Cordon Bleu Paris and a seven-year apprenticeship under Alain Ducasse at Louis XV in Monaco, he opened L'Étoile in 2018 with a singular vision: cuisine that honours its origins.
            </p>
            <p className="text-[#f5efe6]/30 font-sans leading-relaxed mb-10">
              The first Michelin star arrived in 2020. The second followed in 2022. Today, L'Étoile holds a permanent position among France's most coveted dining destinations — a place where classical French technique and contemporary sensitivity produce something entirely its own.
            </p>

            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
              {[
                { value: "2018", label: "Founded" },
                { value: "★★", label: "Michelin" },
                { value: "#4", label: "France Ranking" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl text-amber-500 mb-1">{stat.value}</div>
                  <div className="text-[9px] uppercase tracking-wider font-sans text-[#f5efe6]/30 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {["Seasonal ingredients", "Biodynamic wines", "Zero food waste", "Local producers"].map(tag => (
                <div key={tag} className="flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-wider text-[#f5efe6]/40">
                  <CheckCircle2 className="w-3 h-3 text-amber-600" />{tag}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS CAROUSEL ── */}
      <section id="reviews" className="py-32 md:py-40 bg-[#0f0d0a] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-sans font-semibold mb-4 block">Guest Reviews</span>
              <h2 className="text-4xl md:text-6xl font-light">What our guests <span className="italic">say</span></h2>
            </div>
          </Reveal>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-white/[0.03] border-white/5 h-full">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex gap-1 mb-5">
                        {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
                      </div>
                      <p className="text-[#f5efe6]/65 font-light italic leading-relaxed text-sm mb-8 flex-1">&ldquo;{t.text}&rdquo;</p>
                      <Separator className="bg-white/5 mb-6" />
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={t.avatar} alt={t.name} />
                          <AvatarFallback className="bg-amber-700 text-white text-xs">{t.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-sans font-semibold text-[#f5efe6]">{t.name}</div>
                          <div className="text-[10px] font-sans text-[#f5efe6]/30">{t.role}</div>
                        </div>
                        <div className="ml-auto text-[9px] font-sans text-[#f5efe6]/20 uppercase tracking-wider">{t.date}</div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-white/10 bg-transparent text-[#f5efe6] hover:bg-amber-700 hover:border-amber-700 transition-all duration-200 cursor-pointer -left-4" />
            <CarouselNext className="border-white/10 bg-transparent text-[#f5efe6] hover:bg-amber-700 hover:border-amber-700 transition-all duration-200 cursor-pointer -right-4" />
          </Carousel>

          <Reveal>
            <div className="flex items-center justify-center gap-6 mt-12 text-sm font-sans text-[#f5efe6]/30">
              <div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}</div>
              <span>4.98/5 from 847 verified reservations</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-sans font-semibold mb-4 block">Dining Experiences</span>
              <h2 className="text-4xl md:text-6xl font-light">Choose your <span className="italic">evening</span></h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`relative rounded-3xl p-8 border h-full flex flex-col transition-all duration-200 hover:-translate-y-1 ${plan.popular ? "border-amber-700/50 bg-amber-700/10 shadow-lg shadow-amber-900/20" : "border-white/5 bg-white/[0.02]"}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-700 rounded-full text-[9px] uppercase tracking-wider font-bold font-sans">
                      Recommended
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-light mb-2">{plan.name}</h3>
                    <p className="text-sm font-sans text-[#f5efe6]/40 mb-5">{plan.desc}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light text-amber-500">{plan.price}</span>
                      <span className="text-sm font-sans text-[#f5efe6]/30">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-10 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm font-sans text-[#f5efe6]/60">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setReservationOpen(true)} className={`w-full py-3.5 rounded-full text-[11px] uppercase tracking-widest font-sans font-bold transition-all duration-200 cursor-pointer ${plan.popular ? "bg-amber-700 hover:bg-amber-600 text-white" : "border border-white/10 hover:border-amber-700/50 text-[#f5efe6]"}`}>
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-32 md:py-40 px-6 md:px-12 bg-[#0f0d0a] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-sans font-semibold mb-4 block">Questions</span>
              <h2 className="text-4xl md:text-5xl font-light">Frequently <span className="italic">Asked</span></h2>
            </div>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-0">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-white/5">
                <AccordionTrigger className="text-left text-[#f5efe6]/80 hover:text-amber-400 transition-all duration-200 py-6 font-light text-base cursor-pointer hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm font-sans text-[#f5efe6]/45 leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section id="reservations" className="py-32 md:py-40 px-6 md:px-12">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at center, rgba(180,80,20,0.12) 0%, transparent 70%)" }} />
            <span className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-sans font-semibold mb-6 block">Reservations</span>
            <h2 className="text-5xl md:text-7xl font-light mb-8">
              Your table <span className="italic">awaits</span>
            </h2>
            <p className="text-[#f5efe6]/40 font-sans max-w-lg mx-auto mb-12 leading-relaxed text-sm">
              We recommend reserving at least three weeks in advance. For private events or large parties, our team is at your service.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={() => setReservationOpen(true)} className="px-12 py-5 bg-amber-700 hover:bg-amber-600 text-[11px] uppercase tracking-[0.3em] font-sans font-bold transition-all duration-200 inline-flex items-center gap-3 cursor-pointer">
                <CalendarDays className="w-4 h-4" /> Make a Reservation
              </button>
              <a href={`tel:${fd?.phone ?? "+33142651516"}`} className="px-12 py-5 border border-white/10 hover:border-amber-700/40 text-[11px] uppercase tracking-[0.3em] font-sans font-semibold transition-all duration-200 inline-flex items-center gap-3 cursor-pointer">
                <Phone className="w-4 h-4" /> Call Us
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 pt-16 border-t border-white/5">
              {[
                { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "42 Rue du Faubourg\nSaint-Honoré, 75008 Paris" },
                { icon: <Clock className="w-5 h-5" />, label: "Hours", value: "Tue–Sat: 19:00–23:00\nSun: 12:00–15:00" },
                { icon: <Phone className="w-5 h-5" />, label: "Contact", value: "+33 1 42 65 15 16\nreserve@letoile.paris" },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center group">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-700/10 flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-700 group-hover:text-white transition-all duration-200 cursor-default">
                      {item.icon}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.3em] font-sans text-[#f5efe6]/30 font-semibold mb-2">{item.label}</div>
                    <div className="text-sm font-sans text-[#f5efe6]/55 whitespace-pre-line leading-relaxed">{item.value}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
      </>
      )}

      {/* ── SUB-PAGES ROUTING ── */}
      {page === 'menu' && <MenuPage />}
      {page === 'reservation' && <ReservationPage guests={guests} setGuests={setGuests} />}
      {page === 'about' && <AboutPage />}
      {page === 'contact' && <ContactPage />}
      {page === 'mentions' && <LegalPage variant="mentions" />}
      {page === 'privacy' && <LegalPage variant="privacy" />}

      {/* ── FOOTER ── */}
      <footer id="contact" className="border-t border-white/5 bg-[#0a0806] py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl mb-4 block"><span className="font-light">L&apos;</span><span className="italic">Étoile</span></span>
            <p className="text-sm font-sans text-[#f5efe6]/30 leading-relaxed">Two Michelin star restaurant in the heart of Paris. Cuisine driven by season, instinct, and provenance.</p>
          </div>
          {[
            { title: "Experience", items: [{ label: "Menu", key: "menu" as const }, { label: "Reservations", key: "reservation" as const }] },
            { title: "About", items: [{ label: "Our Story", key: "about" as const }, { label: "Contact", key: "contact" as const }] },
            { title: "Legal", items: [{ label: "Mentions Légales", key: "mentions" as const }, { label: "Confidentialité", key: "privacy" as const }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[9px] font-sans font-bold text-[#f5efe6]/30 uppercase tracking-[0.3em] mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.items.map(item => (
                  <li key={item.label}>
                    <button
                      onClick={() => goTo(item.key)}
                      className="text-sm font-sans text-[#f5efe6]/50 hover:text-amber-400 transition-all duration-200 cursor-pointer bg-transparent border-none p-0 text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="bg-white/5 mb-10" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[9px] font-sans text-[#f5efe6]/15 uppercase tracking-wider">&copy; 2026 L&apos;Étoile Paris · All Rights Reserved</span>
          <div className="flex gap-4">
            {[<Globe key="ig" className="w-4 h-4" />, <Globe key="fb" className="w-4 h-4" />, <Globe key="tw" className="w-4 h-4" />, <Mail key="mail" className="w-4 h-4" />].map((icon, i) => (
              <a key={i} href="#hero" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#f5efe6]/30 hover:text-amber-500 hover:border-amber-600 transition-all duration-200 cursor-pointer">
                {icon}
              </a>
            ))}
          </div>
          <span className="text-[9px] font-sans text-[#f5efe6]/15 uppercase tracking-wider">Michelin ★★ · Paris, France</span>
        </div>
      </footer>

      {/* ── RESERVATION DIALOG ── */}
      <Dialog open={reservationOpen} onOpenChange={setReservationOpen}>
        <DialogContent className="bg-[#1a1714] border-white/10 text-[#f5efe6] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">Reserve a <span className="italic">Table</span></DialogTitle>
          </DialogHeader>
          <p className="text-sm font-sans text-[#f5efe6]/35 mb-6">Complete the form below and we will confirm within 24 hours.</p>
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] uppercase tracking-widest font-sans text-[#f5efe6]/30 font-semibold mb-1.5 block">Date</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-sans focus:border-amber-600 focus:outline-none transition-all duration-200 rounded-lg text-[#f5efe6] cursor-pointer" />
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest font-sans text-[#f5efe6]/30 font-semibold mb-1.5 block">Time</label>
                <select className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-sans focus:border-amber-600 focus:outline-none transition-all duration-200 rounded-lg text-[#f5efe6] appearance-none cursor-pointer">
                  {["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map(t => <option key={t} className="bg-[#1a1714]">{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-widest font-sans text-[#f5efe6]/30 font-semibold mb-1.5 block">Guests</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-amber-600 transition-all duration-200 cursor-pointer">−</button>
                <span className="text-xl font-light w-8 text-center">{guests}</span>
                <button type="button" onClick={() => setGuests(Math.min(12, guests + 1))} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-amber-600 transition-all duration-200 cursor-pointer">+</button>
                <span className="text-xs font-sans text-[#f5efe6]/25">{guests === 1 ? "guest" : "guests"}</span>
              </div>
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-widest font-sans text-[#f5efe6]/30 font-semibold mb-1.5 block">Full Name</label>
              <input type="text" placeholder="Your full name" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-sans placeholder:text-[#f5efe6]/15 focus:border-amber-600 focus:outline-none transition-all duration-200 rounded-lg" />
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-widest font-sans text-[#f5efe6]/30 font-semibold mb-1.5 block">Email</label>
              <input type="email" placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-sans placeholder:text-[#f5efe6]/15 focus:border-amber-600 focus:outline-none transition-all duration-200 rounded-lg" />
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-widest font-sans text-[#f5efe6]/30 font-semibold mb-1.5 block">Special Requests</label>
              <textarea placeholder="Allergies, dietary requirements, celebrations..." className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-sans placeholder:text-[#f5efe6]/15 focus:border-amber-600 focus:outline-none transition-all duration-200 rounded-lg h-20 resize-none" />
            </div>
            <button type="submit" className="w-full py-4 bg-amber-700 hover:bg-amber-600 text-[11px] uppercase tracking-[0.2em] font-sans font-bold transition-all duration-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
              Confirm Reservation <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: MENU
───────────────────────────────────────────────────────────────────────────── */
function MenuPage() {
  // Real client menu (from the wizard) or template demo dishes.
  const hasRealMenu = !!(c?.menuItems && c.menuItems.length > 0);
  const menuData = hasRealMenu ? buildMenuRecord(c.menuItems) : MENU_ITEMS;
  return (
    <div style={{ padding: '120px 24px 100px', maxWidth: 1000, margin: '0 auto', fontFamily: "'Georgia', serif" }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <span className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-sans font-semibold mb-4 block">La Carte · Saison 2026</span>
        <h1 className="text-5xl md:text-7xl font-light text-[#f5efe6]">
          Our <span className="italic">Menu</span>
        </h1>
        <p className="mt-4 text-[#f5efe6]/40 font-sans text-sm max-w-xl mx-auto leading-relaxed">
          Discover our selection of starters, mains, desserts, and curated wines.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        {Object.entries(menuData).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl font-light text-amber-500 mb-8 border-b border-white/10 pb-2 uppercase tracking-widest font-sans text-xs">
              {hasRealMenu ? category : category === 'starters' ? 'Starters' : category === 'mains' ? 'Main Courses' : category === 'desserts' ? 'Desserts' : 'Wine List'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {items.map((item, i) => (
                <div key={i} className="flex justify-between py-6 border-b border-white/5">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <h3 className="text-xl font-light text-[#f5efe6]">{item.name}</h3>
                      {item.tag && <span className="px-2 py-0.5 bg-amber-700/20 text-amber-400 border border-amber-700/30 text-[8px] uppercase tracking-widest font-bold font-sans rounded">{item.tag}</span>}
                    </div>
                    <p className="text-sm font-sans text-[#f5efe6]/35 leading-relaxed">{item.desc}</p>
                    {item.allergens && <p className="text-[9px] font-sans text-[#f5efe6]/15 uppercase tracking-wider mt-1">Contains: {item.allergens}</p>}
                  </div>
                  <div style={{ marginLeft: 32, fontSize: 20, color: 'text-amber-500', fontWeight: 300, alignSelf: 'center' }}>
                    <span className="text-amber-500">{hasRealMenu ? item.price : `${item.price}€`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: RESERVATION
───────────────────────────────────────────────────────────────────────────── */
function ReservationPage({ guests, setGuests }: { guests: number; setGuests: (n: number) => void }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ padding: '120px 24px 100px', maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <span className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-sans font-semibold mb-4 block">Booking</span>
        <h1 className="text-4xl md:text-5xl font-light text-[#f5efe6] font-serif mb-4">
          Reserve a <span className="italic">Table</span>
        </h1>
        <p className="text-sm text-[#f5efe6]/35 leading-relaxed">
          Please complete the form below. We will confirm your reservation within 24 hours.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#f5efe6/30', fontWeight: 600, marginBottom: 8, display: 'block' }} className="uppercase">Date</label>
              <input required type="date" style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', fontSize: 13, background: 'rgba(255,255,255,0.05)', color: '#f5efe6', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#f5efe6/30', fontWeight: 600, marginBottom: 8, display: 'block' }} className="uppercase">Time</label>
              <select style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', fontSize: 13, background: 'rgba(255,255,255,0.05)', color: '#f5efe6', outline: 'none' }}>
                {["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map(t => <option key={t} style={{ background: '#1a1714' }}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#f5efe6/30', fontWeight: 600, marginBottom: 8, display: 'block' }} className="uppercase">Guests</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#f5efe6', cursor: 'pointer', borderRadius: 8 }}>−</button>
              <span style={{ fontSize: 20, width: 32, textAlign: 'center' }}>{guests}</span>
              <button type="button" onClick={() => setGuests(Math.min(12, guests + 1))} style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#f5efe6', cursor: 'pointer', borderRadius: 8 }}>+</button>
              <span style={{ fontSize: 12, color: '#f5efe6/30' }}>{guests === 1 ? "guest" : "guests"}</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#f5efe6/30', fontWeight: 600, marginBottom: 8, display: 'block' }} className="uppercase">Full Name</label>
            <input required type="text" style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', fontSize: 13, background: 'rgba(255,255,255,0.05)', color: '#f5efe6', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#f5efe6/30', fontWeight: 600, marginBottom: 8, display: 'block' }} className="uppercase">Email</label>
            <input required type="email" style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', fontSize: 13, background: 'rgba(255,255,255,0.05)', color: '#f5efe6', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#f5efe6/30', fontWeight: 600, marginBottom: 8, display: 'block' }} className="uppercase">Special Requests</label>
            <textarea style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', fontSize: 13, background: 'rgba(255,255,255,0.05)', color: '#f5efe6', outline: 'none', resize: 'none', height: 80 }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '16px', background: '#b45014', border: 'none', color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 8 }} className="uppercase">
            Confirm Reservation
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#f5efe6/60' }}>
          <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 300, color: '#f5efe6', marginBottom: 12 }}>Thank you.</h3>
          <p style={{ fontSize: 14 }}>Your reservation enquiry has been received. Our team will contact you shortly to confirm.</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: ABOUT
───────────────────────────────────────────────────────────────────────────── */
function AboutPage() {
  return (
    <div style={{ padding: '120px 24px 100px', maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <span className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-sans font-semibold mb-4 block">History</span>
        <h1 className="text-4xl md:text-5xl font-light text-[#f5efe6] font-serif mb-4">
          Our <span className="italic">Story</span>
        </h1>
        <p className="text-sm text-[#f5efe6]/35 leading-relaxed">
          Learn about our culinary heritage and vision.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 15, lineHeight: 1.8, color: 'rgba(245,239,230,0.6)' }}>
        <p>
          Chef Antoine Beaumont grew up among the lavender fields and olive groves of the Var, where his grandmother taught him that great cooking begins with reverence for the ingredient. After training at Le Cordon Bleu Paris and a seven-year apprenticeship under Alain Ducasse at Louis XV in Monaco, he opened L&apos;Étoile in 2018 with a singular vision: cuisine that honours its origins.
        </p>
        <p>
          The first Michelin star arrived in 2020. The second followed in 2022. Today, L&apos;Étoile holds a permanent position among France&apos;s most coveted dining destinations — a place where classical French technique and contemporary sensitivity produce something entirely its own.
        </p>
        <p>
          We source all our ingredients from local organic farms and biodynamic vineyards, upholding a zero food waste policy and supporting small-scale producers.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: CONTACT
───────────────────────────────────────────────────────────────────────────── */
function ContactPage() {
  const [formSent, setFormSent] = useState(false);

  return (
    <div style={{ padding: '120px 24px 100px', maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <span className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-sans font-semibold mb-4 block">Connect</span>
        <h1 className="text-4xl md:text-5xl font-light text-[#f5efe6] font-serif mb-4">
          Contact <span className="italic">Us</span>
        </h1>
        <p className="text-sm text-[#f5efe6]/35 leading-relaxed">
          Enquire about private bookings, media, or career opportunities.
        </p>
      </div>

      {!formSent ? (
        <form onSubmit={(e) => { e.preventDefault(); setFormSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#f5efe6/30', fontWeight: 600, marginBottom: 8, display: 'block' }} className="uppercase">Name</label>
            <input required type="text" style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', fontSize: 13, background: 'rgba(255,255,255,0.05)', color: '#f5efe6', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#f5efe6/30', fontWeight: 600, marginBottom: 8, display: 'block' }} className="uppercase">Email</label>
            <input required type="email" style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', fontSize: 13, background: 'rgba(255,255,255,0.05)', color: '#f5efe6', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: '#f5efe6/30', fontWeight: 600, marginBottom: 8, display: 'block' }} className="uppercase">Message</label>
            <textarea required rows={5} style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', fontSize: 13, background: 'rgba(255,255,255,0.05)', color: '#f5efe6', outline: 'none', resize: 'none' }}></textarea>
          </div>
          <button type="submit" style={{ width: '100%', padding: '16px', background: '#b45014', border: 'none', color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 8 }} className="uppercase">
            Send Message
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#f5efe6/60' }}>
          <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 300, color: '#f5efe6', marginBottom: 12 }}>Thank you.</h3>
          <p style={{ fontSize: 14 }}>Your message has been sent. We will get back to you shortly.</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: LEGAL
───────────────────────────────────────────────────────────────────────────── */
function LegalPage({ variant }: { variant: 'mentions' | 'privacy' }) {
  return (
    <div style={{ padding: '120px 24px 100px', maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif', color: 'rgba(245,239,230,0.6)' }}>
      {variant === 'mentions' ? (
        <>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 36, fontWeight: 300, color: '#f5efe6', marginBottom: 40 }}>Mentions Légales</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 14, lineHeight: 1.8 }}>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: 'rgb(217, 119, 6)', marginBottom: 12 }} className="text-amber-500">Éditeur</h2>
              <p>
                Aevia WS — Valentin Milliand<br />
                Entrepreneur individuel<br />
                SIREN 852 546 225<br />
                RCS Bourg-en-Bresse<br />{fd?.email ?? "valentinmilliand@aevia.services"}</p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: 'rgb(217, 119, 6)', marginBottom: 12 }} className="text-amber-500">Hébergeur</h2>
              <p>
                Vercel Inc.<br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789, USA
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: 'rgb(217, 119, 6)', marginBottom: 12 }} className="text-amber-500">Adresse</h2>
              <p>Communiquée sur demande.</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 36, fontWeight: 300, color: '#f5efe6', marginBottom: 40 }}>Politique de Confidentialité</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 14, lineHeight: 1.8 }}>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: 'rgb(217, 119, 6)', marginBottom: 12 }} className="text-amber-500">1. Données collectées</h2>
              <p>Nous collectons uniquement les informations requises pour le traitement de votre demande de réservation (nom, email, téléphone, préférences alimentaires).</p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: 'rgb(217, 119, 6)', marginBottom: 12 }} className="text-amber-500">2. Utilisation des données</h2>
              <p>Vos données personnelles ne sont jamais vendues ou partagées avec des tiers et sont conservées uniquement pour le bon déroulement de votre dîner.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
