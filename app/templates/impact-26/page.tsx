
"use client";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
// @ts-nocheck

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Heart, ChevronLeft, ChevronRight, Star, Leaf, Droplets, Wind, ShoppingBag, X, Check } from "lucide-react"
import {
  clientCity,
  clientName,
  clientReviews,
  clientServices,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les prestations, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const PRESTATIONS_INLINE_SOURCE = [
  { step: "01", title: "Sourcing", desc: "Nous sélectionnons chaque ingrédient à la source, directement chez le producteur." },
              { step: "02", title: "Macération", desc: "Les matières reposent 6 à 8 semaines pour révéler leur plein potentiel aromatique." },
              { step: "03", title: "Composition", desc: "Notre nez assemble les accords, ajustant jusqu'à l'accord parfait — parfois 200 essais." },
              { step: "04", title: "Mise en flacon", desc: "Chaque flacon est rempli et cacheté à la main dans notre atelier parisien." }
];
let PRESTATIONS_INLINE = PRESTATIONS_INLINE_SOURCE;

let c: any = null;
let brand: any = null;

function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-26-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-26-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap');`
    document.head.appendChild(style)
  }, [])
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Each fragrance is sold in three bottle sizes, each at its own price — the
// size is a required variant choice before a fragrance can be added to bag.
const fragrances = [
  {
    name: "Nuit Absolue",
    desc: "Oud noir, rose de Turquie, ambre gris",
    family: "Oriental",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=600&fit=crop&crop=center",
    notes: ["Oud", "Rose", "Ambre"],
    sizes: [
      { ml: "30ml", price: 215 },
      { ml: "50ml", price: 285 },
      { ml: "100ml", price: 395 },
    ],
  },
  {
    name: "Aube Dorée",
    desc: "Bergamote italienne, jasmin sambac, santal blanc",
    family: "Floral",
    img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=600&fit=crop&crop=center",
    notes: ["Bergamote", "Jasmin", "Santal"],
    sizes: [
      { ml: "30ml", price: 185 },
      { ml: "50ml", price: 245 },
      { ml: "100ml", price: 340 },
    ],
  },
  {
    name: "Brume Sauvage",
    desc: "Cèdre de l'Atlas, vétiver fumé, mousse de chêne",
    family: "Boisé",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=600&fit=crop&crop=center",
    notes: ["Cèdre", "Vétiver", "Mousse"],
    sizes: [
      { ml: "30ml", price: 200 },
      { ml: "50ml", price: 265 },
      { ml: "100ml", price: 365 },
    ],
  },
  {
    name: "Lumière Claire",
    desc: "Fleur d'oranger, musc blanc, poivre rose",
    family: "Frais",
    img: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400&h=600&fit=crop&crop=center",
    notes: ["Oranger", "Musc", "Poivre"],
    sizes: [
      { ml: "30ml", price: 170 },
      { ml: "50ml", price: 225 },
      { ml: "100ml", price: 310 },
    ],
  },
]

type CartItem = { id: string; name: string; price: number; qty: number; size: string };
function formatEUR(n: number): string {
  return `€${n.toLocaleString("fr-FR")}`;
}

function testimonials_SOURCE_LIVE() {
  return [
  { text: "Un parfum qui raconte une histoire. Nuit Absolue est devenu mon identité olfactive.", name: "Camille R.", location: (clientCity({ formData: fd }) ?? "Paris") },
  { text: "La qualité des matières premières est incomparable. Je ne peux plus porter autre chose.", name: "Thomas V.", location: "Lyon" },
  { text: "Éther comprend ce que la parfumerie de niche devrait être — art, pas commerce.", name: "Isabelle M.", location: "Bordeaux" },
];
}
let testimonials_SOURCE = testimonials_SOURCE_LIVE();
let testimonials = testimonials_SOURCE;

type ActivePage =
  | "home"
  | "collection"
  | "maison"
  | "savoir-faire"
  | "contact"
  | "mentions"
  | "cgv"
  | "privacy";


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function Impact26() {
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
  testimonials_SOURCE = testimonials_SOURCE_LIVE();

  testimonials = resolveList(
    clientReviews(session)?.map((r: any, i: number) => ({ ...testimonials_SOURCE[i % testimonials_SOURCE.length], text: r.text, name: r.author })),
    testimonials_SOURCE,
  );

  PRESTATIONS_INLINE = resolveList(

    clientServices(session)?.map((s: any, i: number) => ({

      ...PRESTATIONS_INLINE_SOURCE[i % PRESTATIONS_INLINE_SOURCE.length],

      title: s.title, desc: s.desc || "",

    })),

    PRESTATIONS_INLINE_SOURCE,

  );

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 2;
    const _photoArrays: any[] = [fragrances];
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
  brand = fd?.brandColor ?? null; // null = keep template's original color

  useFonts()
  const [page, setPage] = useState<ActivePage>("home");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const goTo = (p: ActivePage) => {
    setPage(p);
    setSelectedProduct(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const [activeFragrance, setActiveFragrance] = useState(0)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const cartCount = cart.reduce((sum, it) => sum + it.qty, 0)
  const [homeSize, setHomeSize] = useState<string | null>(null)

  // The size choice doesn't carry over when the featured fragrance changes.
  useEffect(() => {
    setHomeSize(null)
  }, [activeFragrance])

  const handleAddToCart = (item: { name: string }, sizeMl: string, price: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((it) => it.id === item.name && it.size === sizeMl)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        return next
      }
      return [...prev, { id: item.name, name: item.name, price, qty: 1, size: sizeMl }]
    })
  }

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  const toggleWishlist = (i: number) => {
    setWishlist(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div ref={containerRef} className="min-h-dvh bg-[#1A0F1E] text-[#F5EDE8]" style={{ fontFamily: "'Jost', sans-serif", overflowX: "clip" }}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-px bg-[var(--brand,#c9956a)] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#1A0F1E]/90 backdrop-blur-md border-b border-[var(--brand,#c9956a)]/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            onClick={() => goTo("home")}
            className="text-2xl tracking-[0.3em] uppercase cursor-pointer"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            {fd?.logoBase64 ? (
              // Client logo (uploaded in the brief) replaces the placeholder mark —
              // essential for the client to recognise their brand in the render.
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              fd?.businessName ?? (clientName({ formData: fd }) ?? (clientName({ formData: fd }) ?? "Éther"))
            )}
          </div>
          <div className="hidden md:flex items-center gap-10 text-xs tracking-widest uppercase text-[#F5EDE8]/50">
            <button
              onClick={() => goTo("collection")}
              className="hover:text-[var(--brand,#c9956a)] transition-colors cursor-pointer text-[#F5EDE8]/50 text-xs tracking-widest uppercase"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              Collection
            </button>
            <button
              onClick={() => goTo("maison")}
              className="hover:text-[var(--brand,#c9956a)] transition-colors cursor-pointer text-[#F5EDE8]/50 text-xs tracking-widest uppercase"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              La Maison
            </button>
            <button
              onClick={() => goTo("savoir-faire")}
              className="hover:text-[var(--brand,#c9956a)] transition-colors cursor-pointer text-[#F5EDE8]/50 text-xs tracking-widest uppercase"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              Savoir-Faire
            </button>
            <button
              onClick={() => goTo("contact")}
              className="hover:text-[var(--brand,#c9956a)] transition-colors cursor-pointer text-[#F5EDE8]/50 text-xs tracking-widest uppercase"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              Contact
            </button>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => goTo("collection")}
              className="border border-[var(--brand,#c9956a)]/50 text-[var(--brand,#c9956a)] text-xs tracking-widest uppercase px-6 py-2.5 hover:bg-[var(--brand,#c9956a)]/10 transition-colors cursor-pointer"
              style={{ background: "none", fontFamily: "'Jost', sans-serif" }}
            >
              Commander
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={cartCount > 0 ? `Ouvrir le panier, ${cartCount} article${cartCount > 1 ? "s" : ""}` : "Ouvrir le panier"}
              className="relative flex items-center justify-center text-[#F5EDE8] hover:text-[var(--brand,#c9956a)] transition-colors cursor-pointer"
              style={{ background: "none", border: "none", minWidth: 44, minHeight: 44 }}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[var(--brand,#c9956a)] text-[#1A0F1E] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setCartOpen(true)}
              aria-label={cartCount > 0 ? `Ouvrir le panier, ${cartCount} article${cartCount > 1 ? "s" : ""}` : "Ouvrir le panier"}
              className="relative flex items-center justify-center text-[#F5EDE8] cursor-pointer"
              style={{ background: "none", border: "none", minWidth: 44, minHeight: 44 }}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[var(--brand,#c9956a)] text-[#1A0F1E] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{ background: "none", border: "none", minWidth: 44, minHeight: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="w-5 h-px bg-[#F5EDE8] mb-1.5" />
              <div className="w-5 h-px bg-[#F5EDE8] mb-1.5" />
              <div className="w-5 h-px bg-[#F5EDE8]" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[var(--brand,#c9956a)]/10"
            >
              <div className="px-6 py-4 flex flex-col gap-4 text-xs tracking-widest uppercase text-[#F5EDE8]/60 items-start">
                {[
                  { label: "Collection", key: "collection" as const },
                  { label: "La Maison", key: "maison" as const },
                  { label: "Savoir-Faire", key: "savoir-faire" as const },
                  { label: "Contact", key: "contact" as const },
                ].map(({ label, key }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMenuOpen(false);
                      goTo(key);
                    }}
                    className="hover:text-[var(--brand,#c9956a)] transition-colors cursor-pointer text-[#F5EDE8]/60 text-xs tracking-widest uppercase"
                    style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {page === "home" && (
        <>
          {/* Hero */}
          <section id="hero" className="min-h-dvh flex items-end relative overflow-hidden pt-20">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src={photo(0, "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=1600&h=900&fit=crop&crop=center")}
            alt="Éther Parfums"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F1E] via-[#1A0F1E]/60 to-transparent" />
        </motion.div>
        <div className="relative max-w-6xl mx-auto px-6 pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[var(--brand,#c9956a)] text-xs tracking-[0.4em] uppercase mb-6"
          >
            Parfumerie de Niche · {clientCity({ formData: fd }) ?? "Paris"}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-6xl md:text-9xl leading-[0.9] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >{c?.heroHeadline ?? <>
            L'art de<br />
            <em>l'invisible.</em>
          </>}</motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#F5EDE8]/60 text-lg max-w-xl mb-10 leading-relaxed"
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Chaque flacon est une œuvre. Chaque note, une promesse. Éther compose des parfums pour ceux qui refusent l'ordinaire.
          </>}</motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center gap-6"
          >
            <button
              onClick={() => goTo("collection")}
              className="bg-[var(--brand,#c9956a)] text-[#1A0F1E] text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-[var(--brand-light,#d9a57a)] transition-colors flex items-center gap-3 cursor-pointer"
              style={{background: brand ?? 'var(--brand,#c9956a)', border: "none", fontFamily: "'Jost', sans-serif" }}
            >
              Découvrir la collection <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo("maison")}
              className="text-[var(--brand,#c9956a)] text-xs tracking-widest uppercase border-b border-[var(--brand,#c9956a)]/40 pb-0.5 hover:border-[var(--brand,#c9956a)] transition-colors cursor-pointer"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              Notre histoire
            </button>
          </motion.div>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16">
            <p className="text-[var(--brand,#c9956a)] text-xs tracking-[0.4em] uppercase mb-4">Collection 2026</p>
            <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Quatre essences,<br /><em>un monde.</em>
            </h2>
          </Reveal>

          {/* Main feature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <Reveal>
              <div className="relative group cursor-pointer">
                <div className="overflow-hidden aspect-[3/4] rounded-sm">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFragrance}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6 }}
                      className="w-full h-full"
                    >
                      <Image
                        src={fragrances[activeFragrance].img}
                        alt={fragrances[activeFragrance].name}
                        width={400}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => toggleWishlist(activeFragrance)}
                  className="absolute top-4 right-4 w-10 h-10 bg-[#1A0F1E]/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 transition-colors ${wishlist.has(activeFragrance) ? "fill-[var(--brand,#c9956a)] text-[var(--brand,#c9956a)]" : "text-[#F5EDE8]/60"}`} />
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <div className="text-[var(--brand,#c9956a)] text-xs tracking-widest uppercase mb-3">{fragrances[activeFragrance].family}</div>
                <h3 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  {fragrances[activeFragrance].name}
                </h3>
                <p className="text-[#F5EDE8]/60 italic text-lg mb-8 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {fragrances[activeFragrance].desc}
                </p>
                <div className="flex gap-3 mb-8">
                  {fragrances[activeFragrance].notes.map(note => (
                    <span key={note} className="border border-[var(--brand,#c9956a)]/30 text-[var(--brand,#c9956a)] text-xs tracking-widest uppercase px-4 py-2">
                      {note}
                    </span>
                  ))}
                </div>
                {/* Bottle size — required before this fragrance can be added to the bag */}
                <div role="group" aria-label={`Choisir une contenance pour ${fragrances[activeFragrance].name}`} className="flex gap-3 mb-6">
                  {fragrances[activeFragrance].sizes.map((s) => (
                    <button
                      key={s.ml}
                      type="button"
                      aria-pressed={homeSize === s.ml}
                      onClick={() => setHomeSize(s.ml)}
                      className={`text-xs tracking-widest uppercase px-4 py-2.5 border transition-colors cursor-pointer ${
                        homeSize === s.ml
                          ? "bg-[var(--brand,#c9956a)] text-[#1A0F1E] border-[var(--brand,#c9956a)]"
                          : "border-[var(--brand,#c9956a)]/30 text-[var(--brand,#c9956a)] hover:border-[var(--brand,#c9956a)]/60"
                      }`}
                      style={{ minHeight: 44 }}
                    >
                      {s.ml}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {formatEUR((fragrances[activeFragrance].sizes.find((s) => s.ml === homeSize) ?? fragrances[activeFragrance].sizes[1]).price)}
                    </div>
                    <div className="text-[#F5EDE8]/40 text-xs tracking-widest">{homeSize ?? "Choisissez une contenance"} · Eau de Parfum</div>
                  </div>
                  <button
                    disabled={!homeSize}
                    onClick={() => homeSize && handleAddToCart(fragrances[activeFragrance], homeSize, fragrances[activeFragrance].sizes.find((s) => s.ml === homeSize)!.price)}
                    className={`text-xs tracking-widest uppercase px-8 py-3 transition-colors ${
                      homeSize ? "bg-[var(--brand,#c9956a)] text-[#1A0F1E] hover:bg-[var(--brand-light,#d9a57a)] cursor-pointer" : "bg-[var(--brand,#c9956a)]/20 text-[#F5EDE8]/30 cursor-not-allowed"
                    }`}
                    style={{ border: "none", minHeight: 44 }}
                  >
                    {homeSize ? "Ajouter au panier" : "Choisir une contenance"}
                  </button>
                </div>
                {/* Thumbnails */}
                <div className="flex gap-3">
                  {fragrances.map((f, i) => (
                    <button
                      key={f.name}
                      onClick={() => setActiveFragrance(i)}
                      className={`w-16 h-20 overflow-hidden rounded-sm transition-all cursor-pointer ${activeFragrance === i ? "ring-1 ring-[var(--brand,#c9956a)]" : "opacity-40 hover:opacity-70"}`}
                    >
                      <Image src={f.img} alt={f.name} width={64} height={80} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* La Maison */}
      <section id="maison" className="py-24 px-6 bg-[#150C18]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <Reveal delay={0.1}>
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden rounded-sm">
                  <Image
                    src={photo(1, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=750&fit=crop&crop=center")}
                    alt="Atelier Éther"
                    width={600}
                    height={750}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-6 left-6 bg-[#1A0F1E]/90 backdrop-blur-sm border border-[var(--brand,#c9956a)]/20 p-6">
                  <div className="text-3xl text-[var(--brand,#c9956a)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1987</div>
                  <div className="text-[#F5EDE8]/50 text-xs tracking-widest uppercase mt-1">Fondé à {clientCity({ formData: fd }) ?? "Paris"}</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <p className="text-[var(--brand,#c9956a)] text-xs tracking-[0.4em] uppercase mb-6">La Maison Éther</p>
                <h2 className="text-4xl md:text-5xl mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  Trente-sept ans de<br /><em>création olfactive.</em>
                </>}</h2>
                <div className="space-y-6 text-[#F5EDE8]/60 leading-relaxed">
                  <p>{c?.aboutText ?? <>Éther est née d'une conviction : que le parfum est le dernier art intime. Fondée en 1987 par la nez Hélène Varenne, notre maison n'a jamais renoncé à l'exigence absolue.</>}</p>
                  <p>Chaque fragrance est composée dans notre atelier du Marais, avec des matières premières sourcing directement auprès des producteurs — fleurs de Grasse, oud du Camboge, résines d'Éthiopie.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                  {[
                    { icon: <Leaf className="w-5 h-5" />, label: "Ingrédients naturels", val: "93%" },
                    { icon: <Droplets className="w-5 h-5" />, label: "Concentrés parfum", val: "25–30%" },
                    { icon: <Wind className="w-5 h-5" />, label: "Tenue garantie", val: "12h+" },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="border-t border-[var(--brand,#c9956a)]/20 pt-4">
                      <div className="text-[var(--brand,#c9956a)] mb-2">{icon}</div>
                      <div className="text-2xl text-[#F5EDE8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</div>
                      <div className="text-[#F5EDE8]/40 text-xs mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Savoir-faire */}
      <section id="savoir-faire" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[var(--brand,#c9956a)] text-xs tracking-[0.4em] uppercase mb-4">Savoir-Faire</p>
            <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Le processus de création
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PRESTATIONS_INLINE.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="border-t border-[var(--brand,#c9956a)]/20 pt-6">
                  <div className="text-[var(--brand,#c9956a)]/30 text-4xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.step}</div>
                  <h3 className="text-xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h3>
                  <p className="text-[#F5EDE8]/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#150C18]">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="text-[var(--brand,#c9956a)] text-xs tracking-[0.4em] uppercase mb-12">Ils portent Éther</p>
            <div className="relative min-h-[180px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--brand,#c9956a)] text-[var(--brand,#c9956a)]" />
                    ))}
                  </div>
                  <p className="text-2xl leading-relaxed text-[#F5EDE8]/80 italic mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                    "{testimonials[testimonialIdx].text}"
                  </p>
                  <div className="text-sm tracking-widest uppercase text-[#F5EDE8]/50">
                    {testimonials[testimonialIdx].name} · {testimonials[testimonialIdx].location}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`transition-all cursor-pointer ${testimonialIdx === i ? "w-8 h-0.5 bg-[var(--brand,#c9956a)]" : "w-2 h-0.5 bg-[var(--brand,#c9956a)]/30 hover:bg-[var(--brand,#c9956a)]/60"}`}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-[var(--brand,#c9956a)] text-xs tracking-[0.4em] uppercase mb-6">Commander</p>
            <h2 className="text-5xl md:text-7xl mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Votre parfum<br /><em>vous attend.</em>
            </h2>
            <p className="text-[#F5EDE8]/50 text-lg mb-12 max-w-lg mx-auto">
              Livraison mondiale. Emballage cadeau offert. Retours sous 30 jours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => goTo("collection")}
                className="bg-[var(--brand,#c9956a)] text-[#1A0F1E] text-xs tracking-widest uppercase px-10 py-4 font-medium hover:bg-[var(--brand-light,#d9a57a)] transition-colors cursor-pointer"
                style={{background: brand ?? 'var(--brand,#c9956a)', border: "none", fontFamily: "'Jost', sans-serif" }}
              >
                Explorer la collection
              </button>
              <button
                onClick={() => goTo("contact")}
                className="border border-[var(--brand,#c9956a)]/40 text-[var(--brand,#c9956a)] text-xs tracking-widest uppercase px-10 py-4 hover:border-[var(--brand,#c9956a)] hover:bg-[var(--brand,#c9956a)]/5 transition-colors cursor-pointer"
                style={{ background: "none", fontFamily: "'Jost', sans-serif" }}
              >
                Nous contacter
              </button>
            </div>
          </Reveal>
        </div>
      </section>
      </>
      )}

      {/* ── SUB-PAGES ROUTING ── */}
      {page === "collection" && (
        <BoutiquePage
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          goTo={goTo}
          onAddToCart={handleAddToCart}
        />
      )}
      {page === "maison" && <MaisonPage />}
      {page === "savoir-faire" && <SavoirFairePage />}
      {page === "contact" && <ContactPage />}
      {page === "mentions" && <LegalPage variant="mentions" />}
      {page === "cgv" && <LegalPage variant="cgv" />}
      {page === "privacy" && <LegalPage variant="privacy" />}

      {/* Cart drawer — line items + total → contact form → confirmation */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} />

      {/* Footer */}
      <footer className="border-t border-[var(--brand,#c9956a)]/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl tracking-[0.3em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{fd?.businessName ?? (clientName({ formData: fd }) ?? (clientName({ formData: fd }) ?? "Éther"))}</div>
          <div className="flex flex-wrap gap-6 text-xs tracking-widest uppercase text-[#F5EDE8]/30">
            {[
              { label: "Collection", key: "collection" as const },
              { label: "La Maison", key: "maison" as const },
              { label: "Savoir-Faire", key: "savoir-faire" as const },
              { label: "Contact", key: "contact" as const },
              { label: "Mentions Légales", key: "mentions" as const },
              { label: "CGV", key: "cgv" as const },
              { label: "Confidentialité", key: "privacy" as const },
            ].map(({ label, key }) => (
              <button
                key={key}
                onClick={() => goTo(key)}
                className="hover:text-[var(--brand,#c9956a)] transition-colors cursor-pointer"
                style={{ background: "none", border: "none", color: "inherit", fontFamily: "'Jost', sans-serif", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit", padding: 0 }}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[#F5EDE8]/20 text-xs tracking-widest">© 2026 Éther Parfums, Paris{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}</p>
        </div>
      </footer>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-PAGE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Checkout input — real label/htmlFor + visible focus state, matching the
// dark-glass field styling already used on the contact form below.
function CheckoutField({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = true,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
      <label htmlFor={id} style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F5EDE8", opacity: 0.5 }}>
        {label}{required ? " *" : ""}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${focused ? (brand ?? "var(--brand,#c9956a)") : "rgba(201, 149, 106, 0.2)"}`,
          borderRadius: 2,
          padding: "14px 16px",
          minHeight: 44,
          boxSizing: "border-box",
          color: "#F5EDE8",
          outline: "none",
          fontFamily: "'Jost', sans-serif",
          fontSize: 13,
          transition: "border-color 0.2s",
        }}
      />
    </div>
  );
}

// Cart drawer — bag → checkout contact form → confirmation. Mounted at the
// page root so it's reachable from any sub-page via the nav's bag icon.
function CartDrawer({
  isOpen,
  onClose,
  cart,
  setCart,
}: {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}) {
  type Step = "cart" | "contact" | "confirmed";
  const [step, setStep] = useState<Step>("cart");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState<{ items: CartItem[]; total: number } | null>(null);
  const [contact, setContact] = useState({ name: "", email: "", address: "" });

  const total = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const itemCount = cart.reduce((sum, it) => sum + it.qty, 0);

  const removeItem = (id: string, size: string) => {
    setCart((prev) => prev.filter((it) => !(it.id === id && it.size === size)));
  };

  const handleClose = () => {
    onClose();
    // Reset to the bag view after the close animation finishes so re-opening
    // never resumes mid-checkout on a stale step.
    setTimeout(() => setStep("cart"), 300);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderLoading(true);
    setTimeout(() => {
      setOrderLoading(false);
      setOrderSummary({ items: cart, total });
      setCart([]);
      setStep("confirmed");
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(440px, 100%)",
              background: "#1A0F1E",
              borderLeft: "1px solid rgba(201, 149, 106, 0.15)",
              zIndex: 201,
              display: "flex",
              flexDirection: "column",
              fontFamily: "'Jost', sans-serif",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px", borderBottom: "1px solid rgba(201, 149, 106, 0.15)" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: "#F5EDE8" }}>
                {step === "cart" && "Votre Panier"}
                {step === "contact" && "Finaliser la commande"}
                {step === "confirmed" && "Commande Confirmée"}
              </h2>
              <button
                onClick={handleClose}
                aria-label="Fermer le panier"
                style={{ background: "none", border: "none", color: "#F5EDE8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44 }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <AnimatePresence mode="wait">
                {step === "cart" && (
                  <motion.div key="cart-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    {cart.length === 0 ? (
                      <p style={{ textAlign: "center", padding: "60px 0", color: "#F5EDE8", opacity: 0.4, fontSize: 13 }}>Votre panier est vide.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {cart.map((item) => (
                          <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 16, alignItems: "center", borderBottom: "1px solid rgba(201, 149, 106, 0.1)", paddingBottom: 20 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#F5EDE8", marginBottom: 4 }}>{item.name}</div>
                              <div style={{ fontSize: 11, color: "#F5EDE8", opacity: 0.45, letterSpacing: "0.05em" }}>
                                {item.size} · Qté {item.qty}
                              </div>
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "#F5EDE8", whiteSpace: "nowrap" }}>
                              {formatEUR(item.price * item.qty)}
                            </div>
                            <button
                              onClick={() => removeItem(item.id, item.size)}
                              aria-label={`Retirer ${item.name}, ${item.size}, du panier`}
                              style={{ background: "none", border: "none", color: "#F5EDE8", opacity: 0.4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44 }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === "contact" && (
                  <motion.form
                    key="contact-step"
                    id="i26-checkout-form"
                    onSubmit={handlePlaceOrder}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CheckoutField id="i26-checkout-name" label="Nom complet" value={contact.name} onChange={(v) => setContact((c) => ({ ...c, name: v }))} autoComplete="name" />
                    <CheckoutField id="i26-checkout-email" label="Email" type="email" value={contact.email} onChange={(v) => setContact((c) => ({ ...c, email: v }))} autoComplete="email" />
                    <CheckoutField id="i26-checkout-address" label="Adresse de livraison" value={contact.address} onChange={(v) => setContact((c) => ({ ...c, address: v }))} autoComplete="street-address" />
                  </motion.form>
                )}

                {step === "confirmed" && orderSummary && (
                  <motion.div
                    key="confirmed-step"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ textAlign: "center", padding: "40px 0" }}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: brand ?? "var(--brand,#c9956a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <Check className="w-6 h-6" style={{ color: "#1A0F1E" }} />
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: "#F5EDE8", marginBottom: 12 }}>
                      Merci{contact.name ? `, ${contact.name.split(" ")[0]}` : ""}.
                    </h3>
                    <p style={{ fontSize: 13, color: "#F5EDE8", opacity: 0.6, lineHeight: 1.7 }}>
                      Votre commande de {orderSummary.items.reduce((n, it) => n + it.qty, 0)} flacon
                      {orderSummary.items.reduce((n, it) => n + it.qty, 0) > 1 ? "s" : ""} ({formatEUR(orderSummary.total)}) a bien été reçue. Une confirmation a été envoyée à {contact.email}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {step === "cart" && cart.length > 0 && (
              <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(201, 149, 106, 0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#F5EDE8" }}>
                  <span>Total ({itemCount} article{itemCount > 1 ? "s" : ""})</span>
                  <span>{formatEUR(total)}</span>
                </div>
                <button
                  onClick={() => setStep("contact")}
                  style={{ width: "100%", minHeight: 44, padding: "16px", background: brand ?? "var(--brand,#c9956a)", color: "#1A0F1E", fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Commander
                </button>
              </div>
            )}

            {step === "contact" && (
              <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(201, 149, 106, 0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#F5EDE8" }}>
                  <span>Total</span>
                  <span>{formatEUR(total)}</span>
                </div>
                <button
                  type="submit"
                  form="i26-checkout-form"
                  disabled={orderLoading}
                  style={{
                    width: "100%",
                    minHeight: 44,
                    padding: "16px",
                    background: orderLoading ? "rgba(201, 149, 106, 0.4)" : (brand ?? "var(--brand,#c9956a)"),
                    color: "#1A0F1E",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: orderLoading ? "not-allowed" : "pointer",
                    fontWeight: 600,
                  }}
                >
                  {orderLoading ? "Confirmation en cours…" : "Confirmer la commande"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface BoutiquePageProps {
  selectedProduct: any | null;
  setSelectedProduct: (p: any | null) => void;
  goTo: (p: any) => void;
  onAddToCart: (item: { name: string }, sizeMl: string, price: number) => void;
}

function BoutiquePage({ selectedProduct, setSelectedProduct, goTo, onAddToCart }: BoutiquePageProps) {
  const [successMsg, setSuccessMsg] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const products = fragrances;

  // Reset the chosen bottle size whenever a different fragrance is opened so
  // a stale selection can't slip into the next add-to-cart.
  useEffect(() => {
    setSize(null);
    setSuccessMsg(false);
  }, [selectedProduct?.name]);

  if (selectedProduct) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "160px 24px 100px",
          maxWidth: 1000,
          margin: "0 auto",
          minHeight: "80vh",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        <button
          onClick={() => setSelectedProduct(null)}
          style={{background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: brand ?? 'var(--brand,#c9956a)',
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 48,
            padding: 0,
          }}
        >
          ← Retour à la collection
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 64 }}>
          {/* Visual wrapper */}
          <div
            style={{
              aspectRatio: "3/4",
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(201, 149, 106, 0.15)",
            }}
          >
            <Image
              src={selectedProduct.img}
              alt={selectedProduct.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              {selectedProduct.family}
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: "#F5EDE8", marginBottom: 16 }}>
              {selectedProduct.name}
            </h1>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#F5EDE8", marginBottom: 24 }}>
              {formatEUR((selectedProduct.sizes.find((s: any) => s.ml === size) ?? selectedProduct.sizes[1]).price)}
            </div>

            <p style={{ color: "#F5EDE8", opacity: 0.75, fontSize: 15, lineHeight: 1.8, marginBottom: 28, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              {selectedProduct.desc}. Une composition unique issue des matières premières les plus nobles, sélectionnées avec un soin absolu pour une expérience sensorielle singulière et persistante.
            </p>

            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 32 }}>
              {selectedProduct.notes.map((note: string) => (
                <span key={note} className="border border-[var(--brand,#c9956a)]/30 text-[var(--brand,#c9956a)] text-[10px] tracking-widest uppercase px-3 py-1.5">
                  {note}
                </span>
              ))}
            </div>

            {/* Bottle size — required before this fragrance can be added to the bag */}
            <div style={{ marginBottom: 28 }}>
              <label
                id="pdp-size-label"
                style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5EDE8", opacity: 0.5, marginBottom: 12, display: "block" }}
              >
                Contenance {!size && "(requise)"}
              </label>
              <div role="group" aria-labelledby="pdp-size-label" style={{ display: "flex", gap: 10 }}>
                {selectedProduct.sizes.map((s: any) => (
                  <button
                    key={s.ml}
                    type="button"
                    aria-pressed={size === s.ml}
                    onClick={() => setSize(s.ml)}
                    style={{
                      minWidth: 64,
                      minHeight: 44,
                      padding: "0 16px",
                      background: size === s.ml ? (brand ?? "var(--brand,#c9956a)") : "transparent",
                      color: size === s.ml ? "#1A0F1E" : (brand ?? "var(--brand,#c9956a)"),
                      border: `1px solid ${size === s.ml ? (brand ?? "var(--brand,#c9956a)") : "rgba(201, 149, 106, 0.35)"}`,
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 12,
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {s.ml}
                  </button>
                ))}
              </div>
            </div>

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{padding: "16px 24px",
                  border: "1px solid #C9956A",
                  color: brand ?? 'var(--brand,#c9956a)',
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                ✦ Ajouté au panier ✦
              </motion.div>
            )}
            <button
              disabled={!size}
              onClick={() => {
                if (!size) return;
                const chosen = selectedProduct.sizes.find((s: any) => s.ml === size)!;
                onAddToCart(selectedProduct, size, chosen.price);
                setSuccessMsg(true);
                setTimeout(() => setSuccessMsg(false), 2000);
              }}
              style={{background: size ? (brand ?? 'var(--brand,#c9956a)') : "rgba(201, 149, 106, 0.2)",
                border: "none",
                color: size ? "#1A0F1E" : "#F5EDE8",
                opacity: size ? 1 : 0.35,
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "18px 40px",
                minHeight: 44,
                cursor: size ? "pointer" : "not-allowed",
                fontWeight: 600,
                marginBottom: 32,
                width: "fit-content",
              }}
            >
              {size ? "Ajouter au panier" : "Choisir une contenance"}
            </button>

            <div style={{ fontSize: 12, color: "#F5EDE8", opacity: 0.4, lineHeight: 1.8, borderTop: "1px solid rgba(201, 149, 106, 0.1)", paddingTop: 24 }}>
              • Livraison offerte à domicile sous 2 à 4 jours ouvrés<br />
              • Un échantillon de la même essence inclus dans votre envoi pour essayer avant d'ouvrir<br />
              • Retours simplifiés acceptés sous 30 jours
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "80vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <p style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Collection 2026</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: "#F5EDE8", marginBottom: 20 }}>
          {c?.heroHeadline ?? "La Collection Éther"}
        </h1>
        <p style={{ color: "#F5EDE8", opacity: 0.6, fontSize: 15, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
          Découvrez nos créations olfactives d'exception, formulées à partir de matières premières rares et précieuses.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(250px, 100%), 1fr))", gap: 32 }}>
        {products.map((product) => (
          <div
            key={product.name}
            onClick={() => {
              setSelectedProduct(product);
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
            }}
            style={{
              cursor: "pointer",
              background: "rgba(255, 255, 255, 0.01)",
              border: "1px solid rgba(201, 149, 106, 0.1)",
              borderRadius: 4,
              padding: "24px",
              transition: "border-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201, 149, 106, 0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(201, 149, 106, 0.1)")}
          >
            <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden", borderRadius: 2, marginBottom: 20 }}>
              <Image src={product.img} alt={product.name} fill className="object-cover" />
            </div>
            <p style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
              {product.family}
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#F5EDE8", marginBottom: 8 }}>
              {product.name}
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, color: "#F5EDE8" }}>
                Dès {formatEUR(Math.min(...product.sizes.map((s: any) => s.price)))}
              </span>
              <span style={{fontSize: 11, color: brand ?? 'var(--brand,#c9956a)', letterSpacing: "0.1em" }}>Découvrir →</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MaisonPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 800,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Notre Histoire</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: "#F5EDE8", marginBottom: 20 }}>
          {c?.heroHeadline ?? "La Maison Éther"}
        </h1>
        <div style={{width: 48, height: 1, background: brand ?? 'var(--brand,#c9956a)', margin: "0 auto" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36, fontSize: 16, lineHeight: 1.8, color: "#F5EDE8", opacity: 0.75 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: "italic", textAlign: "center" }}>
          "Le parfum est la forme la plus intense du souvenir. C'est l'art de l'invisible."
        </p>
        <p>
          Fondée en 1987 à {clientCity({ formData: fd }) ?? "Paris"} par la nez Hélène Varenne, la Maison Éther est née d'un désir de liberté créative absolue. Éloignée des diktats de la parfumerie industrielle, elle explore des contrées olfactives singulières où les émotions brutes guident le nez.
        </p>
        <p>
          Notre atelier historique, situé au cœur du Marais parisien, abrite nos formules et nos secrets de macération. C'est là que chaque flacon prend vie, fruit d'un minutieux assemblage de molécules naturelles et synthétiques soigneusement sélectionnées.
        </p>
        <p>
          Maison Éther s'engage pour une parfumerie responsable. Nous développons des partenariats à long terme avec nos producteurs de matières premières à travers le monde, garantissant une rémunération équitable et le respect de la biodiversité.
        </p>
      </div>
    </motion.div>
  );
}

function SavoirFairePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 900,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Savoir-Faire</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: "#F5EDE8", marginBottom: 20 }}>
          {c?.heroHeadline ?? "Le Processus de Création"}
        </h1>
        <div style={{width: 48, height: 1, background: brand ?? 'var(--brand,#c9956a)', margin: "0 auto" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48 }}>
        {[
          {
            num: "01",
            title: "Le Sourcing Éthique",
            desc: "Chaque fleur de Grasse, chaque bois d'oud précieux d'Asie et chaque résine d'Éthiopie est issu d'un approvisionnement direct et éco-responsable auprès de petits producteurs partenaires.",
          },
          {
            num: "02",
            title: "La Formulation d'Auteur",
            desc: "Notre processus commence par une formulation libre de toute contrainte de coût ou de temps. Hélène Varenne teste des centaines d'accords pour capturer l'esprit exact d'un instant ou d'un souvenir.",
          },
          {
            num: "03",
            title: "La Macération en Cuve",
            desc: "Les concentrés parfumés reposent dans nos cuves entre 6 et 8 semaines. Ce repos permet aux matières de fusionner et de développer leur sillage caractéristique, stable et complexe.",
          },
          {
            num: "04",
            title: "Le Flaconnage à la Main",
            desc: "Chaque flacon est rempli, bouché et cacheté manuellement dans notre atelier parisien, scellant un produit d'artisanat français d'exception.",
          },
        ].map((step) => (
          <div key={step.num} style={{ display: "flex", gap: 32, paddingBottom: 32, borderBottom: "1px solid rgba(201, 149, 106, 0.1)" }}>
            <span style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: brand ?? 'var(--brand,#c9956a)', opacity: 0.5, lineHeight: 1 }}>
              {step.num}
            </span>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#F5EDE8", marginBottom: 12 }}>
                {step.title}
              </h3>
              <p style={{ color: "#F5EDE8", opacity: 0.6, fontSize: 14, lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", msg: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.msg) {
      setSubmitted(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 900,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Prendre Contact</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: "#F5EDE8", marginBottom: 20 }}>
          {c?.heroHeadline ?? "Nous Écrire"}
        </h1>
        <div style={{width: 48, height: 1, background: brand ?? 'var(--brand,#c9956a)', margin: "0 auto" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 64 }}>
        {/* Form */}
        <div>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form key="form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F5EDE8", opacity: 0.5 }}>Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(201, 149, 106, 0.2)",
                      borderRadius: 2,
                      padding: "14px 16px",
                      color: "#F5EDE8",
                      outline: "none",
                      fontFamily: "'Jost', sans-serif",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F5EDE8", opacity: 0.5 }}>Adresse e-mail</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(201, 149, 106, 0.2)",
                      borderRadius: 2,
                      padding: "14px 16px",
                      color: "#F5EDE8",
                      outline: "none",
                      fontFamily: "'Jost', sans-serif",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F5EDE8", opacity: 0.5 }}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.msg}
                    onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(201, 149, 106, 0.2)",
                      borderRadius: 2,
                      padding: "14px 16px",
                      color: "#F5EDE8",
                      outline: "none",
                      resize: "none",
                      fontFamily: "'Jost', sans-serif",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{background: brand ?? 'var(--brand,#c9956a)',
                    border: "none",
                    color: "#1A0F1E",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "16px 32px",
                    cursor: "pointer",
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                >
                  Envoyer
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "40px 24px",
                  border: "1px solid #C9956A",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <p style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>✦ Message envoyé ✦</p>
                <p style={{ color: "#F5EDE8", opacity: 0.6, fontSize: 13 }}>Nous vous répondrons dans les meilleurs délais.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Address */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: "#F5EDE8", marginBottom: 12 }}>
              L'Atelier Le Marais
            </h2>
            <p style={{ color: "#F5EDE8", opacity: 0.6, fontSize: 14, lineHeight: 1.7 }}>
              Rue des Francs-Bourgeois, 75004 {clientCity({ formData: fd }) ?? "Paris"}<br />
              Du lundi au vendredi, de 10h à 18h.<br />
              E-mail : {fd?.email ?? "contact@ether-parfums.com"}<br />
              Téléphone : +33 1 44 55 66 77
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LegalPage({ variant }: { variant: "mentions" | "cgv" | "privacy" }) {
  if (variant === "mentions") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: "160px 24px 100px",
          maxWidth: 800,
          margin: "0 auto",
          minHeight: "80vh",
          fontFamily: "'Jost', sans-serif",
          lineHeight: 1.8,
        }}
      >
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: "#F5EDE8", marginBottom: 40 }}>{c?.heroHeadline ?? "Mentions Légales"}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, color: "#F5EDE8", opacity: 0.8 }}>
          <div>
            <h3 style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Éditeur du site</h3>
            <p>
              Aevia WS — Valentin Milliand<br />
              Entrepreneur individuel<br />
              SIREN : <LegalIdentity /><br />
              {clientName({ formData: fd }) ? "" : "RCS : Bourg-en-Bresse"}<br />
              Adresse : communiquée sur demande<br />
              E-mail : {fd?.email ?? "contact@exemple.fr"}
            </p>
          </div>
          <div>
            <h3 style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Hébergement</h3>
            <p>
              Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, États-Unis
            </p>
          </div>
          <div>
            <h3 style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Propriété intellectuelle</h3>
            <p>
              Le contenu de ce site web (visuels, textes, marques) est protégé au titre de la propriété intellectuelle. Toute exploitation sans accord préalable est illicite.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "cgv") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: "160px 24px 100px",
          maxWidth: 800,
          margin: "0 auto",
          minHeight: "80vh",
          fontFamily: "'Jost', sans-serif",
          lineHeight: 1.8,
        }}
      >
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: "#F5EDE8", marginBottom: 40 }}>{c?.heroHeadline ?? "Conditions Générales de Vente"}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, color: "#F5EDE8", opacity: 0.8 }}>
          <div>
            <h3 style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>1. Commandes</h3>
            <p>
              Les commandes d'essences de parfum s'effectuent en ligne. Le client reçoit un échantillon dans sa livraison pour pouvoir essayer la fragrance sans rompre l'emballage sécurisé du flacon.
            </p>
          </div>
          <div>
            <h3 style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>2. Prix & Paiement</h3>
            <p>
              Les prix de vente indiqués s'entendent toutes taxes comprises (TTC). Le règlement s'effectue de manière sécurisée en ligne.
            </p>
          </div>
          <div>
            <h3 style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>3. Rétractation</h3>
            <p>
              Le client dispose de 30 jours à compter de la livraison pour retourner le produit dans son emballage d'origine non ouvert s'il ne souhaite pas le conserver.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 800,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "'Jost', sans-serif",
        lineHeight: 1.8,
      }}
    >
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: "#F5EDE8", marginBottom: 40 }}>{c?.heroHeadline ?? "Politique de Confidentialité"}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, color: "#F5EDE8", opacity: 0.8 }}>
        <div>
          <h3 style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Données personnelles</h3>
          <p>
            Les données recueillies sont destinées uniquement à la gestion de vos commandes et au suivi personnalisé de notre relation client.
          </p>
        </div>
        <div>
          <h3 style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Confidentialité absolue</h3>
          <p>
            Maison Éther s'engage à ne jamais communiquer vos informations personnelles à des tiers à des fins publicitaires.
          </p>
        </div>
        <div>
          <h3 style={{color: brand ?? 'var(--brand,#c9956a)', fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Vos droits</h3>
          <p>
            Vous disposez d'un droit d'accès, de modification et d'effacement de vos données personnelles en contactant notre service client à : contact@exemple.fr.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
