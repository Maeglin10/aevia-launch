"use client";

import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, ArrowRight, ArrowLeft, Star, Plus, Minus, Filter, Grid3X3, LayoutList, Truck, RotateCcw, Shield, Sparkles } from "lucide-react";
import "../premium.css";

/* --- Data ----------------------------------------------------------- */

const PRODUCTS = [
  { id: 1, name: "Elysium Chronograph", category: "Watches", price: 18500, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop", badge: "New", rating: 4.9, reviews: 124, desc: "An unprecedented fusion of haute horlogerie and contemporary design. Swiss-made automatic movement with 72-hour power reserve, housed in a 40mm rose gold case." },
  { id: 2, name: "Onyx Collar Necklace", category: "Jewelry", price: 6800, image: "https://images.unsplash.com/photo-1599643478524-fb524419877d?q=80&w=800&auto=format&fit=crop", badge: null, rating: 4.8, reviews: 89, desc: "Hand-polished black onyx stones set in brushed 18k white gold. Each collar is individually numbered and comes with a certificate of authenticity." },
  { id: 3, name: "Diamond Eternity Band", category: "Jewelry", price: 12400, image: "https://images.unsplash.com/photo-1605100804763-247f67b80a0e?q=80&w=800&auto=format&fit=crop", badge: "Bestseller", rating: 5.0, reviews: 213, desc: "21 perfectly matched round brilliant diamonds, each F color and VVS1 clarity, totaling 3.15 carats. Set in a platinum micro-pavé band of exceptional lightness." },
  { id: 4, name: "Silk Evening Clutch", category: "Accessories", price: 2900, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop", badge: null, rating: 4.7, reviews: 67, desc: "Artisanally constructed with a sculpted brass frame covered in Mikado silk. Interior fitted with hand-stitched lambskin and a mirror pocket." },
  { id: 5, name: "Maison Timepiece", category: "Watches", price: 32000, image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=800&auto=format&fit=crop", badge: "Limited", rating: 4.9, reviews: 42, desc: "Only 50 pieces worldwide. Skeletonized tourbillon movement visible through sapphire crystal caseback. Alligator strap with deployant clasp." },
  { id: 6, name: "Pearl Drop Earrings", category: "Jewelry", price: 4200, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop", badge: null, rating: 4.6, reviews: 156, desc: "South Sea pearls of exceptional luster, suspended from delicate 18k rose gold chains. Each pearl is hand-selected for its unique overtone." },
];

const CATEGORIES = ["All", "Watches", "Jewelry", "Accessories"];

const LOOKBOOK = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=600&auto=format&fit=crop",
];

/* --- Scroll Reveal -------------------------------------------------- */

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* --- 3D Tilt Card --------------------------------------------------- */

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --- Main Component ------------------------------------------------- */

export default function LuxuryEcommerceSPA() {
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.15]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product?.price ?? 0) * item.qty;
  }, 0);

  const addToCart = (id: number) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === id);
      if (exists) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, qty: 1 }];
    });
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filtered = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);
  const selected = selectedProduct ? PRODUCTS.find(p => p.id === selectedProduct) : null;

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="premium-theme bg-[#faf8f5] text-[#1a1714] min-h-screen selection:bg-[#c9a96e] selection:text-white overflow-x-hidden" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#faf8f5]/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center">
          <div className="hidden lg:flex items-center gap-10">
            {["Collection", "Lookbook", "About"].map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-[10px] uppercase tracking-[0.3em] font-sans font-semibold text-[#1a1714]/40 hover:text-[#1a1714] transition-colors">
                {item}
              </button>
            ))}
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <span className="text-2xl md:text-3xl tracking-[-0.02em]">
              <span className="font-light">Maison</span> <span className="italic">Dorée</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <button className="hidden lg:block">
              <Search className="w-4 h-4 text-[#1a1714]/40 hover:text-[#1a1714] transition-colors" />
            </button>
            <button onClick={() => setCartOpen(true)} className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#c9a96e] text-white text-[9px] flex items-center justify-center font-sans font-bold">
                  {cartCount}
                </motion.span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-[#faf8f5]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8">
            {["Collection", "Lookbook", "About"].map((item, i) => (
              <motion.button key={item} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => scrollTo(item.toLowerCase())} className="text-3xl italic hover:text-[#c9a96e] transition-colors">
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===============================================================
          SECTION 1: HERO — Luxury product zoom reveal
         ============================================================= */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#1a1714]">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-209977?w=800&q=80" fill className="object-cover opacity-40" alt="Luxury" priority />
        </motion.div>

        {/* Gold Particle Simulation */}
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [Math.random() * 100 + "%", "-10%"],
                x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                opacity: [0, 0.6, 0],
              }}
              transition={{ duration: 8 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
              className="absolute w-1 h-1 rounded-full bg-[#c9a96e]"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center text-white px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <span className="text-[11px] uppercase tracking-[0.6em] text-[#c9a96e] font-sans font-semibold mb-8 block">Established 1987 · Geneva</span>
          </motion.div>

          <div className="overflow-hidden mb-4">
            <motion.h1 initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }} className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-light tracking-[-0.03em] leading-[0.85]">
              Timeless
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1 initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.85 }} className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] italic tracking-[-0.03em] leading-[0.85]">
              Elegance<span className="text-[#c9a96e]">.</span>
            </motion.h1>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-white/50 text-lg font-sans max-w-lg mx-auto mb-12 leading-relaxed">
            Exquisite craftsmanship meets modern desire. Discover our curated collection of fine jewelry, haute horlogerie, and artisanal accessories.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
            <button onClick={() => scrollTo("collection")} className="px-10 py-4 bg-[#c9a96e] text-[#1a1714] text-[11px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-white transition-colors duration-500">
              Explore Collection
            </button>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* ===============================================================
          SECTION 2: FEATURED PRODUCT — Split hero
         ============================================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 border-b border-black/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <TiltCard className="relative aspect-square rounded-3xl overflow-hidden bg-[#f0ece6] cursor-pointer" >
              <Image src={PRODUCTS[4].image} alt={PRODUCTS[4].name} fill className="object-cover p-12 mix-blend-multiply" />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#1a1714] text-white text-[9px] uppercase tracking-widest font-sans font-bold rounded-full">
                Limited Edition
              </div>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.2}>
            <span className="text-[#c9a96e] text-[10px] uppercase tracking-[0.4em] font-sans font-bold mb-4 block">Featured Piece</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6">
              The <span className="italic">Maison</span><br />Timepiece
            </h2>
            <p className="text-[#1a1714]/50 font-sans text-base leading-relaxed mb-8 max-w-md">
              {PRODUCTS[4].desc}
            </p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#c9a96e] text-[#c9a96e]" />
                ))}
              </div>
              <span className="text-sm font-sans text-[#1a1714]/40">{PRODUCTS[4].reviews} reviews</span>
            </div>
            <div className="flex items-center gap-8 mb-10">
              <span className="text-3xl font-light">${PRODUCTS[4].price.toLocaleString()}</span>
              <span className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-sans font-bold">Only 50 pieces</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => addToCart(PRODUCTS[4].id)} className="px-10 py-4 bg-[#1a1714] text-white text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#c9a96e] transition-colors duration-500 flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
              <button onClick={() => toggleWishlist(PRODUCTS[4].id)} className={`w-14 h-14 border flex items-center justify-center transition-all ${wishlist.includes(PRODUCTS[4].id) ? "bg-[#c9a96e] border-[#c9a96e] text-white" : "border-black/10 hover:border-[#c9a96e]"}`}>
                <Heart className={`w-5 h-5 ${wishlist.includes(PRODUCTS[4].id) ? "fill-white" : ""}`} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===============================================================
          SECTION 3: PRODUCT CATALOGUE — 3D tilt grid
         ============================================================= */}
      <section id="collection" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <span className="text-[#c9a96e] text-[10px] uppercase tracking-[0.4em] font-sans font-bold mb-4 block">The Collection</span>
                <h2 className="text-4xl md:text-6xl leading-[1.05]">
                  Curated <span className="italic">Pieces</span>
                </h2>
              </div>
              <div className="flex gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-wider font-sans font-bold transition-all duration-300 ${
                      activeCategory === cat ? "bg-[#1a1714] text-white" : "text-[#1a1714]/40 hover:text-[#1a1714] border border-black/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((product, i) => (
                <Reveal key={product.id} delay={i * 0.08}>
                  <TiltCard className="group cursor-pointer">
                    <div className="relative aspect-[3/4] bg-[#f0ece6] rounded-2xl overflow-hidden mb-6" onClick={() => setSelectedProduct(product.id)}>
                      <Image src={product.image} alt={product.name} fill className="object-cover p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />

                      {product.badge && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-[#1a1714] text-white text-[8px] uppercase tracking-widest font-sans font-bold rounded-full">
                          {product.badge}
                        </div>
                      )}

                      {/* Quick actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                            wishlist.includes(product.id) ? "bg-[#c9a96e] text-white" : "bg-white/80 hover:bg-[#c9a96e] hover:text-white"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-white" : ""}`} />
                        </button>
                      </div>

                      {/* Add to cart overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <button onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                          className="w-full py-3 bg-[#1a1714] text-white text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#c9a96e] transition-colors flex items-center justify-center gap-2 rounded-xl"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg mb-1 group-hover:text-[#c9a96e] transition-colors cursor-pointer" onClick={() => setSelectedProduct(product.id)}>
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-[#c9a96e] text-[#c9a96e]" : "text-black/10"}`} />
                            ))}
                          </div>
                          <span className="text-[10px] font-sans text-[#1a1714]/30">({product.reviews})</span>
                        </div>
                      </div>
                      <span className="text-lg font-light">${product.price.toLocaleString()}</span>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ===============================================================
          SECTION 4: LOOKBOOK — Masonry gallery
         ============================================================= */}
      <section id="lookbook" className="py-32 md:py-40 bg-[#1a1714] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <Reveal>
            <span className="text-[#c9a96e] text-[10px] uppercase tracking-[0.4em] font-sans font-bold mb-4 block">Lookbook</span>
            <h2 className="text-4xl md:text-6xl font-light">
              The Art of <span className="italic">Wearing</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-2 md:px-6">
          {LOOKBOOK.map((img, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className={`relative overflow-hidden group cursor-pointer ${i === 0 || i === 3 ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image src={img} alt={`Lookbook ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===============================================================
          SECTION 5: ABOUT — Maison story + trust signals
         ============================================================= */}
      <section id="about" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <Reveal>
              <span className="text-[#c9a96e] text-[10px] uppercase tracking-[0.4em] font-sans font-bold mb-6 block">Our Heritage</span>
              <h2 className="text-4xl md:text-5xl leading-[1.1] mb-8">
                Three generations<br />of <span className="italic">excellence</span>
              </h2>
              <p className="text-[#1a1714]/50 font-sans leading-relaxed mb-6">
                Founded in Geneva in 1987 by master jeweler Antoine Dorée, our maison has grown from a single atelier to a globally recognized name in luxury craftsmanship. Every piece that bears our name is a testament to the uncompromising standards set by our founder.
              </p>
              <p className="text-[#1a1714]/30 font-sans leading-relaxed">
                Today, Maison Dorée continues to push the boundaries of design while honoring traditional techniques passed down through three generations. Our artisans spend an average of 400 hours on each haute joaillerie piece.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop" alt="Atelier" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/50 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-white text-[10px] uppercase tracking-[0.3em] font-sans font-bold">Geneva Atelier · Est. 1987</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: <Truck className="w-6 h-6" />, title: "Complimentary Shipping", desc: "Insured worldwide delivery with signature required." },
              { icon: <RotateCcw className="w-6 h-6" />, title: "30-Day Returns", desc: "Effortless returns with prepaid shipping labels." },
              { icon: <Shield className="w-6 h-6" />, title: "Lifetime Warranty", desc: "Every piece includes a certificate and lifetime guarantee." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center p-8 border border-black/5 rounded-2xl hover:border-[#c9a96e]/30 transition-colors">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-lg mb-2">{item.title}</h3>
                  <p className="text-sm font-sans text-[#1a1714]/40">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===============================================================
          SECTION 6: NEWSLETTER + FOOTER
         ============================================================= */}
      <section className="bg-[#1a1714] text-white py-24 px-6 md:px-12">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <Sparkles className="w-8 h-8 text-[#c9a96e] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-light mb-4">Join the <span className="italic">Maison</span></h2>
            <p className="text-white/40 font-sans text-sm mb-10">Receive exclusive previews, private sale invitations, and stories from our atelier.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-sm font-sans focus:border-[#c9a96e] focus:outline-none transition-colors rounded-none" />
              <button className="px-8 py-4 bg-[#c9a96e] text-[#1a1714] text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-white transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="bg-[#1a1714] text-white border-t border-white/5 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <span className="text-2xl block mb-6"><span className="font-light">Maison</span> <span className="italic">Dorée</span></span>
            <p className="text-white/30 font-sans text-sm leading-relaxed max-w-sm">Exquisite craftsmanship from Geneva since 1987. Every piece tells a story of passion, heritage, and uncompromising beauty.</p>
          </div>
          <div>
            <h4 className="text-[9px] uppercase tracking-[0.3em] font-sans font-bold text-[#c9a96e] mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm font-sans text-white/40">
              {["Collection", "Lookbook", "Our Heritage", "Stores"].map(i => <li key={i}><button className="hover:text-white transition-colors">{i}</button></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[9px] uppercase tracking-[0.3em] font-sans font-bold text-[#c9a96e] mb-6">Client Services</h4>
            <ul className="space-y-3 text-sm font-sans text-white/40">
              {["Shipping", "Returns", "Care Guide", "Contact"].map(i => <li key={i}><button className="hover:text-white transition-colors">{i}</button></li>)}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[9px] font-sans text-white/20 uppercase tracking-wider">
          <span>&copy; 2026 Maison Dorée. All rights reserved.</span>
          <span>Privacy · Terms · Cookies</span>
        </div>
      </footer>

      {/* --- Cart Drawer --- */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-md z-[100] bg-[#faf8f5] shadow-2xl flex flex-col">
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-lg">Shopping Bag ({cartCount})</h3>
                <button onClick={() => setCartOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <p className="text-center text-[#1a1714]/30 font-sans py-20">Your bag is empty</p>
                ) : (
                  cart.map(item => {
                    const p = PRODUCTS.find(pr => pr.id === item.id)!;
                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-24 bg-[#f0ece6] rounded-lg relative overflow-hidden shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover p-2 mix-blend-multiply" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm mb-1">{p.name}</h4>
                          <span className="text-sm text-[#1a1714]/40 font-sans">${p.price.toLocaleString()}</span>
                          <div className="flex items-center gap-3 mt-3">
                            <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} className="w-7 h-7 border border-black/10 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                            <span className="text-sm font-sans">{item.qty}</span>
                            <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} className="w-7 h-7 border border-black/10 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-black/5">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-sans text-[#1a1714]/40">Subtotal</span>
                    <span className="text-xl">${cartTotal.toLocaleString()}</span>
                  </div>
                  <button className="w-full py-4 bg-[#1a1714] text-white text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#c9a96e] transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Product Detail Modal --- */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#faf8f5] overflow-y-auto">
            <button onClick={() => setSelectedProduct(null)} className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-[#1a1714] text-white flex items-center justify-center hover:bg-[#c9a96e] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-[#f0ece6] flex items-center justify-center p-16 min-h-[60vh] lg:min-h-screen relative">
                <Image src={selected.image} alt={selected.name} fill className="object-cover p-16 mix-blend-multiply" />
              </div>
              <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center">
                <span className="text-[#c9a96e] text-[10px] uppercase tracking-[0.4em] font-sans font-bold mb-4">{selected.category}</span>
                <h1 className="text-4xl md:text-5xl mb-4">{selected.name}</h1>
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(selected.rating) ? "fill-[#c9a96e] text-[#c9a96e]" : "text-black/10"}`} />)}</div>
                  <span className="text-sm font-sans text-[#1a1714]/40">{selected.reviews} reviews</span>
                </div>
                <p className="text-[#1a1714]/50 font-sans leading-relaxed mb-10">{selected.desc}</p>
                <div className="text-3xl font-light mb-10">${selected.price.toLocaleString()}</div>
                <div className="flex gap-4">
                  <button onClick={() => { addToCart(selected.id); setCartOpen(true); setSelectedProduct(null); }} className="flex-1 py-4 bg-[#1a1714] text-white text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#c9a96e] transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </button>
                  <button onClick={() => toggleWishlist(selected.id)} className={`w-14 border flex items-center justify-center transition-all ${wishlist.includes(selected.id) ? "bg-[#c9a96e] border-[#c9a96e] text-white" : "border-black/10"}`}>
                    <Heart className={`w-5 h-5 ${wishlist.includes(selected.id) ? "fill-white" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
