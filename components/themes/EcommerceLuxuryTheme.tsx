"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionData } from "@/lib/sessions";
import { ThemeWrapper } from "./ThemeWrapper";
import { Reveal, Stagger, StaggerItem, MagneticButton } from "./AnimationHelpers";
import { ShoppingBag, X, Plus, Minus, Star, ShieldCheck, Truck, RotateCcw, ArrowRight, Mail, MapPin, Phone, Award, HelpCircle, Zap, Clock, Shield, Globe, Quote, PlayCircle } from "lucide-react";
import { catalogueDuMarchand, demoVersAffichage } from "@/lib/boutique/catalogue";

// --- Mock Data Generator ---
const generateProducts = (businessType: string) => {
  return [
    { id: 1, name: "The Signature Timepiece", price: 2450, cat: "Elite" },
    { id: 2, name: "Noir Essence Parfum", price: 320, cat: "Fragrance" },
    { id: 3, name: "Velvet Evening Gown", price: 1850, cat: "Couture" },
    { id: 4, name: "Gold Inlay Cufflinks", price: 540, cat: "Jewelry" },
    { id: 5, name: "Luxe Leather Carryall", price: 980, cat: "Accessories" },
    { id: 6, name: "Silk Monogram Scarf", price: 210, cat: "Essentials" },
  ].map(p => ({
    ...p,
    image: `https://images.unsplash.com/photo-${1500000000000 + p.id * 5000}?w=800&q=80`,
    rating: 4.9
  }));
};

export function EcommerceLuxuryTheme({ session }: { session: SessionData }) {
  const { formData, generatedContent: c } = session;
  const brand = formData.brandColor || "#c9a84c"; // Gold fallback
  // Catalogue réel du marchand, sinon la démo. Voir lib/boutique/catalogue.ts.
  const products = catalogueDuMarchand(session.businessProfile?.products) ??
    demoVersAffichage(generateProducts(formData.businessType));
  
  const [cart, setCart] = useState<{id: number, name: string, price: number, qty: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (p: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) return prev.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  return (
    <ThemeWrapper session={session} dark={true}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=Montserrat:wght@100;300;600&display=swap');
        .luxury-text { font-family: 'Playfair Display', serif; }
        .luxury-sans { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={formData.heroImageUrl || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80"} 
            className="w-full h-full object-cover opacity-50" 
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050505]" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <Reveal>
            <div className="inline-block px-6 py-1 rounded-full border border-white/20 text-[10px] luxury-sans uppercase tracking-[0.5em] mb-12 text-white/40">
              Collection Privée
            </div>
            <h1 className="text-6xl md:text-9xl luxury-text italic text-white mb-12 leading-none">
              {c?.heroHeadline}
            </h1>
            <p className="text-lg md:text-xl text-white/50 luxury-sans font-light tracking-[0.1em] max-w-2xl mx-auto mb-16 italic">
              {c?.heroSubline}
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ border: `1px solid ${brand}`, color: brand }}
                className="px-16 py-5 luxury-sans uppercase text-[10px] font-bold tracking-[0.4em] hover:bg-white hover:text-black hover:border-white transition-all duration-700"
              >
                Discover The Gallery
              </button>
            </div>
          </Reveal>
        </div>

        {/* Decorative Lines */}
        <div className="absolute left-10 top-0 h-full w-[1px] bg-white/5 hidden lg:block" />
        <div className="absolute right-10 top-0 h-full w-[1px] bg-white/5 hidden lg:block" />
      </section>

      {/* Philosophy Section */}
      <section className="py-40 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
          <Reveal>
            <h2 className="text-5xl luxury-text text-white mb-12 italic leading-tight">The Art of <br/>Exceptional Choice.</h2>
            <p className="text-lg text-white/30 luxury-sans font-light leading-relaxed mb-16">
              {c?.aboutText}
            </p>
            <div className="space-y-10">
              {formData.benefits.map((b, i) => (
                <div key={i} className="flex gap-6 items-center">
                  <div className="text-[10px] luxury-sans text-white/20">0{i+1}</div>
                  <div className="h-[1px] w-12 bg-white/10" />
                  <div className="text-sm luxury-sans uppercase tracking-widest text-white/70">{b}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2} className="relative">
            <div className="aspect-[3/4] border border-white/10 p-4">
              <img src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=800&q=80" className="w-full h-full object-cover grayscale opacity-80" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-white/10 p-2 hidden lg:block">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80" className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Grid Shop */}
      <section id="shop" className="py-40 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32">
            <Reveal>
              <span className="text-[10px] luxury-sans text-white/20 uppercase tracking-[0.4em] mb-4 block">The Archives</span>
              <h2 className="text-6xl luxury-text text-white italic">Elite Selection<span style={{ color: brand }}>.</span></h2>
            </Reveal>
            <div className="text-white/20 luxury-sans text-[10px] uppercase tracking-widest hidden md:block">
              Ref 0x2026 // Archive_Series
            </div>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-y-32 gap-x-12">
            {products.map((p, i) => (
              <StaggerItem key={p.id}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden mb-8 border border-white/5">
                    <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                      <button 
                        onClick={() => addToCart(p)}
                        className="luxury-sans text-[10px] uppercase tracking-[0.5em] text-white border-b border-white pb-2 hover:opacity-50"
                      >
                        Add to Private Collection
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="luxury-sans text-[10px] uppercase tracking-[0.2em] text-white/30">{p.cat}</div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 text-[#c9a84c] fill-current" />)}
                    </div>
                  </div>
                  <h3 className="text-2xl luxury-text text-white mb-2 italic tracking-wide">{p.name}</h3>
                  <div className="luxury-sans font-bold text-lg" style={{ color: brand }}>${p.price.toLocaleString()}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══ SECTION 4: ARTISAN SPOTLIGHT ═══ */}
      <section className="py-40 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
           <Reveal className="relative aspect-square">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" className="w-full h-full object-cover grayscale opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-px h-60 bg-white/20" />
              </div>
           </Reveal>
           <Reveal delay={0.2}>
              <span className="text-[10px] luxury-sans text-white/20 uppercase tracking-[0.5em] mb-8 block">The Mastermind</span>
              <h2 className="text-5xl luxury-text text-white mb-12 italic leading-tight">Craftsmanship <br/>Without Compromise.</h2>
              <p className="text-lg text-white/30 luxury-sans font-light leading-relaxed mb-16 italic">
                 Meet the artisans behind our collection. Each piece is hand-finished in our atelier, preserving centuries-old techniques for a modern era of luxury.
              </p>
              <button className="flex items-center gap-4 text-[10px] luxury-sans uppercase tracking-[0.4em] text-white/50 hover:text-white transition-colors group">
                 Read The Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-4 transition-transform" />
              </button>
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 5: COLLECTION LOOKBOOK ═══ */}
      <section className="py-60 bg-[#050505] relative overflow-hidden">
        <motion.div 
           initial={{ y: 0 }}
           whileInView={{ y: -100 }}
           transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
           className="absolute top-0 right-0 w-1/2 h-[200%] opacity-10 pointer-events-none"
        >
           <div className="text-[20vw] luxury-text text-white italic whitespace-nowrap">ETHEREAL // 2026 // COLLECTION</div>
        </motion.div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <Reveal className="text-center mb-40">
              <h2 className="text-7xl luxury-text text-white italic">Ethereal Series</h2>
           </Reveal>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "https://images.unsplash.com/photo-1539109132381-31a1b973f0ea?w=400&q=80",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
                "https://images.unsplash.com/photo-1529139513055-119712d289b5?w=400&q=80",
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
              ].map((img, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="aspect-[2/3] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-white/5">
                      <img src={img} className="w-full h-full object-cover" />
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ═══ SECTION 6: LUXURY BENEFITS ═══ */}
      <section className="py-40 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20">
           {[
             { icon: <Truck />, title: "Concierge Delivery", desc: "Complimentary global shipping with white-glove assembly services." },
             { icon: <ShieldCheck />, title: "Authenticity Safe", desc: "Digital ownership certificates secured by encrypted blockchain technology." },
             { icon: <RotateCcw />, title: "Lifetime Service", desc: "Unlimited complimentary maintenance and refinishing for every piece." },
           ].map((b, i) => (
             <Reveal key={i} delay={i * 0.1} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-10 flex items-center justify-center border border-white/10 group-hover:border-white transition-all duration-700">
                   <div style={{ color: brand }}>{b.icon}</div>
                </div>
                <h3 className="text-xl luxury-text text-white italic mb-6">{b.title}</h3>
                <p className="text-sm luxury-sans text-white/30 font-light leading-relaxed px-10">{b.desc}</p>
             </Reveal>
           ))}
        </div>
      </section>

      {/* ═══ SECTION 7: CLIENT TESTIMONIALS ═══ */}
      <section className="py-60 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <Reveal>
              <Quote className="w-12 h-12 mx-auto mb-20 text-white/10" />
              <p className="text-4xl md:text-6xl luxury-text text-white italic leading-tight mb-20">
                 &quot;Possessing an {formData.businessName} piece is more than an acquisition; it is a legacy passed down through generations.&quot;
              </p>
              <div className="luxury-sans text-[10px] uppercase tracking-[0.5em] text-white/40 italic">— Countess Eleonora von Berg</div>
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 8: BRAND HERITAGE ═══ */}
      <section className="py-40 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
           <Reveal>
              <h2 className="text-5xl luxury-text text-white mb-12 italic">A Century of <br/>Refinement.</h2>
              <div className="space-y-16">
                 {[
                   { year: "1926", title: "Foundation", desc: "The first atelier opens in the heart of Florence." },
                   { year: "1958", title: "Global Expansion", desc: "Boutiques established in Paris, New York, and Tokyo." },
                   { year: "2026", title: "The New Era", desc: "Redefining luxury for the digital avant-garde." },
                 ].map((h, i) => (
                   <div key={i} className="flex gap-12 group">
                      <div className="text-2xl luxury-text italic text-white/10 group-hover:text-white transition-colors">{h.year}</div>
                      <div>
                         <h3 className="text-lg luxury-sans uppercase tracking-widest text-white mb-2">{h.title}</h3>
                         <p className="text-sm luxury-sans text-white/30 font-light max-w-sm">{h.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </Reveal>
           <Reveal delay={0.2} className="relative aspect-[4/5] border border-white/5 p-4 bg-zinc-900/50 backdrop-blur-xl">
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?w=800&q=80" className="w-full h-full object-cover grayscale opacity-40" />
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 9: THE INNER CIRCLE ═══ */}
      <section className="py-40 bg-[#050505] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-20">
           <Reveal className="max-w-xl">
              <h2 className="text-5xl luxury-text text-white italic mb-10 leading-tight">The Inner Circle.</h2>
              <p className="text-lg text-white/30 luxury-sans font-light mb-16 italic">Join our private registry for early access to limited collections, private viewing invites, and bespoke tailoring services.</p>
              <div className="flex border-b border-white/20 pb-4">
                 <input type="email" placeholder="Your Private Email" className="bg-transparent luxury-sans text-sm outline-none flex-1 text-white placeholder:text-white/10" />
                 <button className="luxury-sans text-[10px] font-black uppercase tracking-widest text-white hover:opacity-50">Apply</button>
              </div>
           </Reveal>
           <Reveal delay={0.2} className="relative w-64 h-64 border border-white/5 p-8 flex flex-col items-center justify-center text-center">
              <Award className="w-12 h-12 text-white/20 mb-6" />
              <div className="text-[10px] luxury-sans text-white/50 uppercase tracking-[0.3em]">Exclusive <br/>Benefits</div>
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 10: PRESS MENTIONS ═══ */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-wrap justify-center gap-20 opacity-10 grayscale hover:grayscale-0 transition-all duration-1000">
              <div className="text-2xl luxury-text italic text-white uppercase tracking-tighter">VOGUE</div>
              <div className="text-2xl luxury-text italic text-white uppercase tracking-tighter">ELLE_LUXE</div>
              <div className="text-2xl luxury-text italic text-white uppercase tracking-tighter">GQ_ELITE</div>
              <div className="text-2xl luxury-text italic text-white uppercase tracking-tighter">FORBES</div>
              <div className="text-2xl luxury-text italic text-white uppercase tracking-tighter">TATLER</div>
           </div>
        </div>
      </section>

      {/* ═══ SECTION 11: INSTAGRAM WALL ═══ */}
      <section className="py-40 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-20 flex justify-between items-end">
           <Reveal>
              <h2 className="text-4xl luxury-text text-white italic">Seen in Public.</h2>
           </Reveal>
           <div className="luxury-sans text-[10px] uppercase tracking-widest text-white/20">@ {formData.businessName.replace(/\s+/g, '_').toLowerCase()}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {[
             "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
             "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
             "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
             "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&q=80",
             "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
             "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
           ].map((img, i) => (
             <Reveal key={i} delay={i * 0.05} className="aspect-square grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer border border-white/5">
                <img src={img} className="w-full h-full object-cover" />
             </Reveal>
           ))}
        </div>
      </section>

      {/* ═══ SECTION 12: FAQ & CONCIERGE ═══ */}
      <section className="py-40 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-6">
           <Reveal className="text-center mb-24">
              <h2 className="text-4xl luxury-text text-white italic mb-6">Concierge Support</h2>
              <p className="luxury-sans text-[10px] uppercase tracking-widest text-white/20">Assisting your every need</p>
           </Reveal>
           <div className="space-y-4">
              {[
                { q: "Bespoke Personalization", a: "We offer tailored modifications for select pieces. Contact our concierge to discuss your vision." },
                { q: "International Insurance", a: "Every acquisition is fully insured during transit through our Lloyd's of London partnership." },
                { q: "Private Showings", a: "Book a digital or in-person viewing of our collection at your convenience." },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="p-12 border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                      <div className="flex justify-between items-center mb-8">
                         <span className="text-sm luxury-sans uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors">{f.q}</span>
                         <HelpCircle className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-sm luxury-sans text-white/20 font-light italic leading-relaxed group-hover:text-white/40 transition-colors">{f.a}</p>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ═══ SECTION 13: FLAGSHIP LOCATIONS ═══ */}
      <section className="py-40 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <Reveal>
              <h2 className="text-5xl luxury-text text-white italic mb-12">The Flagship.</h2>
              <div className="space-y-12">
                 <div>
                    <div className="text-[10px] luxury-sans uppercase tracking-[0.5em] text-white/20 mb-4 font-black">Place Vendôme // Paris</div>
                    <p className="text-xl luxury-text text-white italic">12 Rue de la Paix, <br/>75002 Paris, France</p>
                 </div>
                 <div className="flex gap-12 pt-12 border-t border-white/5">
                    <div>
                       <div className="text-[10px] luxury-sans uppercase tracking-[0.2em] text-white/20 mb-2">Mon — Fri</div>
                       <div className="text-sm luxury-sans text-white">10:00 — 19:00</div>
                    </div>
                    <div>
                       <div className="text-[10px] luxury-sans uppercase tracking-[0.2em] text-white/20 mb-2">Sat</div>
                       <div className="text-sm luxury-sans text-white">11:00 — 18:00</div>
                    </div>
                 </div>
              </div>
           </Reveal>
           <Reveal delay={0.2} className="relative aspect-video lg:aspect-square border border-white/5 p-4">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80" className="w-full h-full object-cover grayscale opacity-40" />
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 14: PRE-FOOTER PROMO ═══ */}
      <section className="py-60 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle at center, ${brand}20, transparent)` }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
           <Reveal>
              <h2 className="text-7xl luxury-text text-white italic mb-16 leading-[0.85]">The Future <br/>Of Rare Acquisitions<span style={{ color: brand }}>.</span></h2>
              <button 
                style={{ background: brand }}
                className="px-20 py-8 luxury-sans text-[10px] uppercase font-black tracking-[0.6em] text-black shadow-[0_0_80px_rgba(201,168,76,0.3)] hover:scale-105 transition-transform"
              >
                 Enter The Archives
              </button>
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 15: FINAL CTA / FOOTER ═══ */}
      <section className="py-20 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
           <div className="col-span-1 md:col-span-2">
              <div className="text-3xl luxury-text text-white italic mb-8">{formData.businessName}</div>
              <p className="text-sm luxury-sans text-white/30 font-light max-w-sm italic">{c?.heroSubline}</p>
           </div>
           <div>
              <div className="text-[10px] luxury-sans uppercase tracking-[0.3em] text-white/50 mb-8 font-black">Private Line</div>
              <div className="space-y-4 text-xs luxury-sans text-white/30">
                 <div className="flex items-center gap-3"><Mail className="w-4 h-4 opacity-30" /> {formData.email}</div>
                 <div className="flex items-center gap-3"><Phone className="w-4 h-4 opacity-30" /> {formData.phone || "Request Access"}</div>
              </div>
           </div>
           <div>
              <div className="text-[10px] luxury-sans uppercase tracking-[0.3em] text-white/50 mb-8 font-black">Global Offices</div>
              <div className="space-y-4 text-xs luxury-sans text-white/30">
                 <div>Paris // New York</div>
                 <div>London // Tokyo</div>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-40 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] luxury-sans text-white/10 uppercase tracking-[0.5em]">
           <span>© 2026 {formData.businessName} // Rights Reserved</span>
           <span>Luxury CMS // AeviaLaunch</span>
        </div>
      </section>

      {/* Cart Drawer Luxury */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/90 z-[1000] backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#0a0a0a] border-l border-white/5 z-[1001] flex flex-col p-12"
            >
              <div className="flex justify-between items-center mb-20">
                <div className="luxury-text text-3xl text-white italic">Private Selection</div>
                <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6 text-white/20 hover:text-white transition-colors" /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-12">
                {cart.length === 0 ? (
                  <div className="text-center text-white/10 luxury-text text-xl italic pt-20">Your collection is empty</div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-8 items-center border-b border-white/5 pb-8">
                      <div className="w-20 h-24 bg-white/5 grayscale">
                        <img src={`https://images.unsplash.com/photo-${1500000000000 + item.id * 5000}?w=200&q=80`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="luxury-text text-xl text-white mb-2">{item.name}</div>
                        <div className="luxury-sans text-[10px] text-white/40 uppercase tracking-widest">${item.price.toLocaleString()} // Qty {item.qty}</div>
                      </div>
                      <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}><X className="w-4 h-4 text-white/10" /></button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-12 mt-auto">
                <div className="flex justify-between items-center mb-12">
                  <div className="luxury-sans text-[10px] text-white/30 uppercase tracking-[0.3em]">Total Investment</div>
                  <div className="luxury-text text-3xl text-white italic">${cart.reduce((a,b) => a + b.price * b.qty, 0).toLocaleString()}</div>
                </div>
                <button 
                  style={{ background: brand }}
                  className="w-full py-6 luxury-sans text-[10px] uppercase font-bold tracking-[0.4em] text-black shadow-2xl hover:scale-[1.02] transition-transform"
                >
                  Finalize Acquisition
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ThemeWrapper>
  );
}
