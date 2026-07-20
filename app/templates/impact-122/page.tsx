"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring } from "framer-motion"
import { useState, useRef, useEffect } from "react"
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
import { Menu, X, ArrowRight, Play, Bookmark, Share2, Clock, Calendar, Search, Newspaper, Globe, Sparkles } from "lucide-react"

// ─── UTILS & ANIMATION COMPONENTS ─────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function RevealText({ text }: { text: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const words = text.split(" ")
  
  return (
    <div ref={ref} className="overflow-hidden flex flex-wrap">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

// ─── DATA MANIFESTS ─────────────────────────────────────────────────────────

const MANIFEST = {
  hero: {
    category: "Architecture",
    title: "The Brutalist Revival of Eastern Europe",
    author: "Elena Rostova",
    date: "Oct 14, 2026",
    readTime: "12 min read",
    excerpt: "Once symbols of strict utilitarianism, the concrete monoliths of the Soviet era are finding new life among a generation of architects determined to preserve their stark, unforgiving beauty."
  },
  latestNews: [
    { cat: "Politics", title: "The Shifting Sands of Global Trade Agreements", time: "2h ago" },
    { cat: "Science", title: "Quantum Computing Reaches Commercial Viability", time: "5h ago" },
    { cat: "Culture", title: "The Death and Rebirth of the American Novel", time: "12h ago" }
  ],
  featured: [
    {
      id: "ai-art",
      cat: "Technology",
      title: "When Machines Dream: The End of Human Art?",
      excerpt: "As generative models surpass human technical ability, we are forced to redefine what makes art inherently valuable.",
      author: "David Chen",
      img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80"
    },
    {
      id: "ocean",
      cat: "Environment",
      title: "The Deep Sea Mining Rush",
      excerpt: "A new gold rush is happening miles beneath the ocean surface, threatening ecosystems we barely understand.",
      author: "Sarah Jenkins",
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"
    },
    {
      id: "culinary",
      cat: "Gastronomy",
      title: "The Return to Fire: Primal Cooking",
      excerpt: "Top chefs are ditching sous-vide machines for open flames, wood smoke, and instinct.",
      author: "Marco Rossi",
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"
    }
  ],
  essays: [
    { title: "The Psychology of Infinite Scrolling", author: "Dr. Amanda Weir", date: "Sep 22" },
    { title: "Why We Still Need Physical Books", author: "Thomas Hardy", date: "Sep 18" },
    { title: "The Architecture of Silence", author: "Maya Lin", date: "Sep 10" },
    { title: "In Defense of Boredom", author: "Julian Barnes", date: "Sep 05" }
  ],
  subscription: {
    tiers: [
      { name: "Digital", price: "$5/mo", features: ["Unlimited web access", "Daily newsletter", "Audio articles", "Ad-free experience"] },
      { name: "Print + Digital", price: "$12/mo", features: ["Monthly print magazine", "Unlimited web access", "Exclusive events", "Archive access"], recommended: true },
      { name: "Patron", price: "$50/mo", features: ["Signed annual book", "Editor's dinner invite", "Print + Digital", "Gift subscriptions"] }
    ]
  },
  faq: [
    { q: "How do I manage my subscription?", a: "You can pause, upgrade, or cancel your subscription at any time through your account portal under the 'Membership' tab." },
    { q: "Do you offer student discounts?", a: "Yes, verified university students receive a 50% discount on the Digital tier." },
    { q: "Can I buy a gift subscription?", a: "Absolutely. During checkout, simply select 'This is a gift' and we will send a welcome email on the date of your choosing." },
    { q: "Where do you ship the print magazine?", a: "We ship globally. International shipping is included in the 'Print + Digital' tier price." },
    { q: "How often is the website updated?", a: "We publish 3-5 new long-form pieces daily, while our 'Latest' feed is updated continuously throughout the day." }
  ]
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function ChronicleEditorialPage() {
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

  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  
  // Reading progress bar
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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
  }, [c]);return (
    <div className="bg-[#fcfaf7] text-[#1a1814] min-h-dvh selection:bg-[#d64000] selection:text-white overflow-x-hidden font-sans">
      
      {/* ─── READING PROGRESS BAR ──────────────────────────────────────── */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#d64000] z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* ─── NAVBAR ────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#fcfaf7]/95 backdrop-blur-sm border-b border-[#1a1814]/10 py-3" : "bg-transparent py-6"}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Sheet>
              <SheetTrigger className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#d64000] transition-colors">
                  <Menu className="w-5 h-5" /> Menu
                </SheetTrigger>
              <SheetContent side="left" className="bg-[#1a1814] text-[#fcfaf7] border-r-0 p-12 w-full sm:w-[400px]">
                <div className="mt-12 flex flex-col gap-8">
                  {["Politics", "Culture", "Science", "Environment", "Essays", "Archive"].map(link => (
                    <Link key={link} href="#subscribe" className="text-4xl font-serif italic hover:text-[#d64000] transition-colors">
                      {link}
                    </Link>
                  ))}
                  <div className="w-full h-[1px] bg-white/10 my-4" />
                  <Link href="#subscribe" className="text-sm font-bold uppercase tracking-widest text-[#d64000] hover:text-white transition-colors">Subscribe</Link>
                  <Link href="#subscribe" className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Sign In</Link>
                </div>
              </SheetContent>
            </Sheet>
            <button className="hidden md:block hover:text-[#d64000] transition-colors"><Search className="w-5 h-5" /></button>
          </div>

          <Link href="#hero" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>{c?.heroHeadline ?? <>
                  Chronicle.
                </>}</h1>
                {!scrolled && <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1814]/50 mt-1">Est. 1924</span>}
              </>
            )}
          </Link>

          <div className="flex items-center gap-6">
            <Link href="#subscribe" className="hidden md:block text-xs font-bold uppercase tracking-widest hover:text-[#d64000] transition-colors">
              Subscribe
            </Link>
            <Link href="#subscribe" className="bg-[#d64000] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#a33000] transition-colors">
              Support Us
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* ─── DATE BAR ────────────────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 mb-12">
          <div className="w-full border-y border-[#1a1814]/10 py-3 flex flex-wrap items-center justify-between text-xs font-bold uppercase tracking-widest text-[#1a1814]/50">
            <div className="flex gap-8">
              <span>Wednesday, October 14, 2026</span>
              <span className="hidden md:inline">Today's Paper</span>
            </div>
            <div className="flex gap-8">
              <span className="hidden md:inline">Global Edition</span>
              <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> EN</span>
            </div>
          </div>
        </div>

        {/* ─── HERO SPLIT LAYOUT ───────────────────────────────────────── */}
        <section id="hero" className="max-w-[1400px] mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* LATEST NEWS SIDEBAR (LEFT) */}
            <div className="lg:col-span-3 order-2 lg:order-1 hidden md:block">
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-[#1a1814] pb-4 mb-6">The Latest</h3>
              <div className="flex flex-col gap-6">
                {MANIFEST.latestNews.map((news, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="group cursor-pointer">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#d64000] mb-2">{news.cat}</div>
                      <h4 className="font-serif text-lg leading-snug group-hover:underline decoration-2 underline-offset-4 decoration-[#d64000]/30 mb-2">
                        {news.title}
                      </h4>
                      <div className="text-[10px] text-[#1a1814]/40 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {news.time}
                      </div>
                    </div>
                    {i !== MANIFEST.latestNews.length - 1 && <div className="w-full h-[1px] bg-[#1a1814]/10 mt-6" />}
                  </Reveal>
                ))}
              </div>
              <div className="mt-8 p-6 bg-[#f0eee9] border border-[#1a1814]/10">
                <Newspaper className="w-8 h-8 text-[#d64000] mb-4" />
                <h4 className="font-serif italic text-xl mb-2">Morning Briefing</h4>
                <p className="text-sm text-[#1a1814]/60 mb-4 leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>Start your day with what you need to know.</>}</p>
                <button className="w-full py-2 bg-[#1a1814] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#d64000] transition-colors">{c?.ctaText ?? <>
                  Sign Up
                </>}</button>
              </div>
            </div>

            {/* MAIN FEATURE (CENTER/RIGHT) */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              <Reveal>
                <Link href="#subscribe" className="group block">
                  <div className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-[#e5e3de] mb-8 overflow-hidden">
                    <Image 
                      src={photo(0, "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80")} 
                      alt="Architecture" 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Cover Story
                    </div>
                  </div>
                  
                  <div className="max-w-3xl mx-auto text-center md:text-left">
                    <div className="text-xs font-black uppercase tracking-widest text-[#d64000] mb-4">
                      {MANIFEST.hero.category}
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-6 tracking-tight">
                      {MANIFEST.hero.title}
                    </h2>
                    <p className="text-lg md:text-2xl font-serif italic text-[#1a1814]/70 leading-relaxed mb-8">
                      {MANIFEST.hero.excerpt}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-y border-[#1a1814]/10">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <Avatar className="w-10 h-10 border border-[#1a1814]/10">
                          <AvatarImage src={photo(1, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80")} />
                          <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="text-xs font-bold uppercase tracking-widest">By {MANIFEST.hero.author}</div>
                          <div className="text-[10px] text-[#1a1814]/50 font-bold uppercase tracking-widest mt-1">
                            {MANIFEST.hero.date} • {MANIFEST.hero.readTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="w-8 h-8 rounded-full border border-[#1a1814]/20 flex items-center justify-center hover:bg-[#d64000] hover:text-white hover:border-[#d64000] transition-colors">
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full border border-[#1a1814]/20 flex items-center justify-center hover:bg-[#1a1814] hover:text-white hover:border-[#1a1814] transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── FEATURED STORIES GRID ─────────────────────────────────────── */}
        <section className="bg-[#f2efe9] py-24 border-y border-[#1a1814]/10">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-serif italic">Editors' Picks</h3>
              <Link href="#subscribe" className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[#d64000] transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {MANIFEST.featured.map((story, i) => (
                <Reveal key={story.id} delay={i * 0.1}>
                  <Link href="#subscribe" className="group flex flex-col h-full">
                    <div className="relative w-full aspect-[4/3] bg-[#e5e3de] mb-6 overflow-hidden">
                      <Image src={story.img} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#d64000] mb-3">{story.cat}</div>
                    <h4 className="text-2xl font-serif leading-snug mb-4 group-hover:text-[#d64000] transition-colors">
                      {story.title}
                    </h4>
                    <p className="text-[#1a1814]/70 font-serif leading-relaxed mb-6 flex-1">
                      {story.excerpt}
                    </p>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/40 mt-auto border-t border-[#1a1814]/10 pt-4">
                      By {story.author}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── DEEP READS & ESSAYS ───────────────────────────────────────── */}
        <section className="py-24 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <Reveal>
                <div className="w-16 h-[2px] bg-[#d64000] mb-8" />
                <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">{c?.aboutTitle ?? fd?.businessName ?? <>
                  The <br/><span className="italic">Sunday</span> Essays.
                </>}</h2>
                <p className="text-lg text-[#1a1814]/70 leading-relaxed mb-12 max-w-md">{c?.aboutText ?? <>
                  Long-form reflections on culture, society, and the human condition. Designed for slow reading and deep thought.
                </>}</p>
                <div className="flex flex-col border-t border-[#1a1814]/10">
                  {MANIFEST.essays.map((essay, i) => (
                    <Link key={i} href="#subscribe" className="group flex items-center justify-between py-6 border-b border-[#1a1814]/10 hover:bg-[#f2efe9] transition-colors -mx-6 px-6">
                      <div>
                        <h4 className="text-xl font-serif mb-2 group-hover:text-[#d64000] transition-colors">{essay.title}</h4>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/50">By {essay.author}</div>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1814]/30">
                        {essay.date}
                      </div>
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>
            
            <div className="order-1 lg:order-2">
              <Reveal delay={0.2}>
                <div className="relative w-full aspect-[3/4] bg-[#e5e3de] p-8 md:p-12 flex flex-col justify-end overflow-hidden group">
                  <Image src={photo(2, "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80")} alt="Writing" fill className="object-cover opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1814]/90 via-[#1a1814]/20 to-transparent" />
                  <div className="relative z-10 text-white">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#d64000] mb-4">Featured Essay</div>
                    <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-4">
                      The Lost Art of Letter Writing
                    </h3>
                    <p className="text-white/70 italic font-serif mb-6">
                      How instantaneous communication stripped language of its anticipation.
                    </p>
                    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#d64000] transition-colors">
                      Read Essay <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── SUBSCRIPTION PRICING ──────────────────────────────────────── */}
        <section id="subscribe" className="bg-[#1a1814] text-[#fcfaf7] py-32 border-y-[10px] border-[#d64000]">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-20">
              <Reveal>
                <Sparkles className="w-8 h-8 mx-auto text-[#d64000] mb-6" />
                <h2 className="text-4xl md:text-6xl font-serif mb-6">Support Independent Journalism</h2>
                <p className="text-[#fcfaf7]/60 max-w-xl mx-auto text-lg italic font-serif">
                  No clickbait. No intrusive ads. Just rigorous reporting and thoughtful cultural analysis. 
                  Choose the plan that suits you best.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MANIFEST.subscription.tiers.map((tier, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-10 border ${tier.recommended ? 'border-[#d64000] bg-[#2a261f]' : 'border-[#fcfaf7]/10 bg-[#1f1d18]'} relative flex flex-col h-full`}>
                    {tier.recommended && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d64000] text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                    <div className="text-4xl font-bold tracking-tighter mb-8">{tier.price}</div>
                    
                    <ul className="space-y-4 mb-10 flex-1">
                      {tier.features.map((feat, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-[#fcfaf7]/80">
                          <div className="w-1.5 h-1.5 bg-[#d64000] rounded-full mt-1.5 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-colors ${tier.recommended ? 'bg-[#d64000] text-white hover:bg-[#a33000]' : 'bg-[#fcfaf7] text-[#1a1814] hover:bg-[#d64000] hover:text-white'}`}>
                      Select Plan
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-32 max-w-[800px] mx-auto px-6">
          <div className="text-center mb-16">
            <Reveal>
              <h2 className="text-4xl font-serif mb-4">Questions?</h2>
              <p className="text-[#1a1814]/60 italic font-serif">Details regarding our subscriptions and publishing schedule.</p>
            </Reveal>
          </div>
          
          <Reveal delay={0.2}>
            <Accordion type="single" collapsible className="w-full">
              {MANIFEST.faq.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-[#1a1814]/10">
                  <AccordionTrigger className="text-lg font-serif py-6 hover:text-[#d64000] hover:no-underline text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#1a1814]/70 leading-relaxed pb-6 text-sm">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </section>

        {/* ─── NEWSLETTER BANNER ─────────────────────────────────────────── */}
        <section id="contact" className="py-24 bg-[#f2efe9] border-y border-[#1a1814]/10">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <Reveal>
              <Newspaper className="w-10 h-10 mx-auto text-[#d64000] mb-8" />
              <h2 className="text-4xl md:text-5xl font-serif mb-6">The Daily Chronicle</h2>
              <p className="text-[#1a1814]/70 max-w-lg mx-auto mb-10 font-serif italic text-lg">
                Our award-winning daily newsletter. The day's most important stories, curated by our editors and delivered straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 bg-white border border-[#1a1814]/20 px-6 py-4 text-sm focus:outline-none focus:border-[#d64000] transition-colors"
                />
                <button className="bg-[#1a1814] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#d64000] transition-colors">
                  Subscribe
                </button>
              </form>
            </Reveal>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#1a1814] text-[#fcfaf7]/60 pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-24">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[#fcfaf7] mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Chronicle.
            </h1>
            <p className="max-w-sm text-sm font-serif italic leading-relaxed mb-8">
              A journal of politics, culture, and science. Truth without compromise. Clarity without condescension.
            </p>
            <div className="flex gap-4">
              {['MessageSquare', 'Users2', 'Camera', 'LinkedIn'].map(social => (
                <Link key={social} href="#subscribe" className="w-10 h-10 border border-[#fcfaf7]/20 rounded-full flex items-center justify-center hover:bg-[#d64000] hover:text-white hover:border-[#d64000] transition-colors text-xs font-bold uppercase">
                  {social.charAt(0)}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-[#fcfaf7] text-xs font-bold uppercase tracking-widest mb-6">Sections</h4>
            <ul className="space-y-4 text-sm font-serif">
              {["Politics", "Business", "Science", "Culture", "Essays", "Opinion"].map(link => (
                <li key={link}><Link href="#subscribe" className="hover:text-[#d64000] transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#fcfaf7] text-xs font-bold uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-serif">
              {["About Us", "Careers", "Ethics Policy", "Contact", "Advertise", "Press"].map(link => (
                <li key={link}><Link href="#subscribe" className="hover:text-white transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#fcfaf7] text-xs font-bold uppercase tracking-widest mb-6">Account</h4>
            <ul className="space-y-4 text-sm font-serif">
              {["Manage Subscription", "Gift a Subscription", "Help Center", "Newsletters", "Apps"].map(link => (
                <li key={link}><Link href="#subscribe" className="hover:text-white transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto border-t border-[#fcfaf7]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest">
          <div>© 2026 The Chronicle Media Group.</div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#subscribe" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#subscribe" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#subscribe" className="hover:text-white transition-colors">Cookie Settings</Link>
            <Link href="#subscribe" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
