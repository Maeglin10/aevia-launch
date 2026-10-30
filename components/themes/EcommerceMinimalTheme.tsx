"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionData } from "@/lib/sessions";
import { ThemeWrapper } from "./ThemeWrapper";
import { Reveal, Stagger, StaggerItem } from "./AnimationHelpers";
import { X, ArrowRight, Minus, Plus, Award, HelpCircle, Activity, CheckCircle, TrendingUp, Quote, Search, Mail, Globe, Phone, Shield, Zap } from "lucide-react";
import { catalogueDuMarchand, demoVersAffichage } from "@/lib/boutique/catalogue";
import { usePanier } from "@/components/boutique/PanierProvider";

// --- Mock Data Generator ---
const generateProducts = (businessType: string) => {
  return [
    { id: 1, name: "Modular Object 01", price: 45.00, ref: "M-01" },
    { id: 2, name: "System Component 02", price: 120.00, ref: "S-02" },
    { id: 3, name: "Interface Element 03", price: 65.00, ref: "I-03" },
    { id: 4, name: "Structural Unit 04", price: 150.00, ref: "U-04" },
    { id: 5, name: "Functional Tool 05", price: 35.00, ref: "T-05" },
    { id: 6, name: "Base Module 06", price: 85.00, ref: "B-06" },
  ].map(p => ({
    ...p,
    image: `https://images.unsplash.com/photo-${1500000000000 + p.id * 8000}?w=800&q=80`,
  }));
};

export function EcommerceMinimalTheme({ session }: { session: SessionData }) {
  const { formData, generatedContent: c } = session;
  const brand = formData.brandColor || "#000000";
  // Catalogue réel du marchand, sinon la démo. Voir lib/boutique/catalogue.ts.
  const products = catalogueDuMarchand(session.businessProfile?.products) ??
    demoVersAffichage(generateProducts(formData.businessType));
  
  const [cart, setCart] = useState<{id: number, name: string, price: number, qty: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const panier = usePanier();
  const addToCart = (p: any) => {
    /*
      Panier RÉEL dès que le marchand a relié son compte Stripe : `p.id` est
      l'index du produit dans `businessProfile.products`, c'est-à-dire
      exactement le `produitIndex` que le paiement attend. Le panier local qui
      suit n'est conservé que pour l'aperçu et la démo, où aucun paiement
      n'existe — sans ce garde, le visiteur remplissait un panier qui ne menait
      nulle part.
    */
    if (panier) {
      panier.ajouter(p.id);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) return prev.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  return (
    <ThemeWrapper session={session} dark={false}>
      {/* Hero Section */}
      <section className="pt-48 pb-32 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h1 className="text-[12vw] font-bold leading-[0.8] tracking-tighter uppercase mb-20 text-black">
              {c?.heroHeadline}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-end">
              <p className="text-2xl text-gray-400 max-w-lg leading-tight uppercase font-medium">
                {c?.heroSubline}
              </p>
              <div className="flex justify-end gap-12 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                <span>EST. 2026</span>
                <span>SYSTEM VERSION // 1.0</span>
                <span>{formData.city}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Grid Shop */}
      <section id="shop" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-1">
            {products.map((p, i) => (
              <StaggerItem key={p.id}>
                <div className="group border p-12 hover:bg-gray-50 transition-colors cursor-crosshair">
                  <div className="flex justify-between items-start mb-12">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">REF: {p.ref}</span>
                    <span className="text-xl font-bold">${p.price.toFixed(2)}</span>
                  </div>
                  <div className="aspect-square bg-gray-100 mb-12 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src={p.image} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase mb-8">{p.name}</h3>
                  <button 
                    onClick={() => addToCart(p)}
                    className="w-full py-4 border-t border-black text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-between hover:bg-black hover:text-white transition-all px-4"
                  >
                    Add to Cart <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <Reveal>
              <h2 className="text-4xl font-bold uppercase tracking-tighter mb-8">Structural Intent.</h2>
              <p className="text-gray-400 leading-tight mb-12">
                {c?.aboutText}
              </p>
            </Reveal>
            <Reveal delay={0.2} className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-1 bg-gray-100 border">
                {formData.benefits.map((b, i) => (
                  <div key={i} className="bg-white p-12 border">
                    <div className="text-[10px] font-bold text-gray-300 mb-6 tracking-[0.2em] uppercase">PRINCIPLE 0{i+1}</div>
                    <div className="text-xl font-bold uppercase leading-none">{b}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: EFFICIENCY STATS ═══ */}
      <section className="py-24 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
           {[
             { val: "24h", label: "DISPATCH_CYCLE" },
             { val: "0.02%", label: "FAILURE_RATE" },
             { val: "100%", label: "SUSTAINABILITY" },
             { val: "∞", label: "RECYCLABILITY" },
           ].map((s, i) => (
             <Reveal key={i} delay={i * 0.1}>
                <div className="text-5xl font-black text-black mb-2 tracking-tighter italic">{s.val}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-300">{s.label}</div>
             </Reveal>
           ))}
        </div>
      </section>

      {/* ═══ SECTION 6: CURATED COLLECTIONS ═══ */}
      <section className="py-40 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-6">
           <Reveal className="mb-24">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Batch // Selections.</h2>
           </Reveal>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-1 border border-black/5 bg-gray-200">
              {[
                { title: "The Raw Series", cat: "01 // Industrial", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80" },
                { title: "The Mesh Protocol", cat: "02 // Structural", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
              ].map((c, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="relative aspect-video group cursor-pointer overflow-hidden bg-white">
                      <img src={c.img} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                      <div className="absolute inset-0 p-12 flex flex-col justify-between">
                         <div className="text-[10px] font-black uppercase tracking-widest text-black/20 group-hover:text-black transition-colors">{c.cat}</div>
                         <h3 className="text-3xl font-black uppercase italic text-black leading-none">{c.title}</h3>
                      </div>
                   </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* ═══ SECTION 7: PRODUCTION PROCESS ═══ */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
           <Reveal>
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-12 leading-[0.85] italic">The Origin <br/>Of Matter.</h2>
              <div className="space-y-12">
                 {[
                   { step: "01", title: "Molecular Selection", desc: "Rigorous vetting of raw components for structural integrity." },
                   { step: "02", title: "Precision Casting", desc: "High-density molding at our centralized fabrication hub." },
                   { step: "03", title: "Neutral QC", desc: "Triple-layer quality control for zero-defect output." },
                 ].map((p, i) => (
                   <div key={i} className="flex gap-8 group">
                      <div className="text-2xl font-black italic text-gray-200 group-hover:text-black transition-colors">{p.step}</div>
                      <div>
                         <h3 className="text-lg font-black uppercase tracking-tight text-black mb-2">{p.title}</h3>
                         <p className="text-sm text-gray-400 max-w-sm leading-tight italic">{p.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </Reveal>
           <Reveal delay={0.2} className="relative aspect-square border border-black/5 p-4 bg-gray-50">
              <img src="https://images.unsplash.com/photo-1551288049-bbda446b17ad?w=800&q=80" className="w-full h-full object-cover grayscale opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Activity className="w-20 h-20 text-black/5 animate-pulse" />
              </div>
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 8: CLIENT FEEDBACK ═══ */}
      <section className="py-40 bg-gray-50 border-y">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <Reveal>
              <Quote className="w-16 h-16 mx-auto mb-16 text-gray-200" />
              <p className="text-3xl md:text-5xl font-black italic text-black leading-tight mb-20 uppercase tracking-tighter">
                 &quot;The objects possess an inherent weight. A purity of form that is rarely achieved in modern commerce.&quot;
              </p>
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 italic">— Senior Architect // Collective Design</div>
           </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 9: RECOGNITION ═══ */}
      <section className="py-24 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <div className="flex flex-wrap justify-center gap-16 md:gap-32 opacity-10 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="text-2xl font-black italic tracking-tighter text-black uppercase">DESIGN_MUSEUM</div>
              <div className="text-2xl font-black italic tracking-tighter text-black uppercase">ARCH_DAILY</div>
              <div className="text-2xl font-black italic tracking-tighter text-black uppercase">DEZEEN_PRO</div>
              <div className="text-2xl font-black italic tracking-tighter text-black uppercase">STIR_WORLD</div>
           </div>
        </div>
      </section>

      {/* ═══ SECTION 10: NEWSLETTER ═══ */}
      <section className="py-40 bg-white border-b text-center">
        <div className="max-w-3xl mx-auto px-6">
           <Reveal>
              <div className="w-20 h-20 rounded-full border border-black/10 flex items-center justify-center mx-auto mb-12">
                 <Mail className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-12 italic">Join The Ledger.</h2>
              <p className="text-xl text-gray-400 mb-16 max-w-xl mx-auto italic font-medium">Be the first to access our quarterly release batches. No noise, just structural updates.</p>
              <div className="flex border-b-2 border-black pb-4 max-w-md mx-auto group">
                 <input type="email" placeholder="Email Address" className="bg-transparent font-black uppercase tracking-widest text-sm outline-none flex-1 text-black placeholder:text-gray-200" />
                 <button className="font-black uppercase tracking-widest text-xs hover:opacity-50 transition-opacity">Apply</button>
              </div>
           </Reveal>
        </div>
      </section>

      {/* Cart Drawer Minimal */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-white/80 z-[1000] backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white border-l z-[1001] flex flex-col"
            >
              <div className="p-12 border-b flex justify-between items-center">
                <div className="text-3xl font-bold uppercase tracking-tighter">Your Cart</div>
                <button onClick={() => setIsCartOpen(false)}><X className="w-8 h-8" /></button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="p-12 text-gray-300 text-sm font-bold uppercase tracking-widest">The list is empty.</div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="p-12 border-b flex gap-12 items-center">
                      <div className="w-24 h-24 bg-gray-50 border p-4 flex-shrink-0">
                        <img src={`https://images.unsplash.com/photo-${1500000000000 + item.id * 8000}?w=200&q=80`} className="w-full h-full object-cover grayscale" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-bold uppercase mb-2">{item.name}</div>
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">${item.price.toFixed(2)} / UNIT</div>
                        <div className="flex items-center gap-6">
                          <button onClick={() => setCart(prev => prev.map(i => i.id === item.id && i.qty > 1 ? {...i, qty: i.qty - 1} : i))}><Minus className="w-4 h-4" /></button>
                          <span className="font-bold">{item.qty}</span>
                          <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i))}><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-12 bg-black text-white">
                <div className="flex justify-between items-center mb-12">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Total Settlement</span>
                  <span className="text-4xl font-bold">${cart.reduce((a,b) => a + b.price * b.qty, 0).toFixed(2)}</span>
                </div>
                <button className="w-full py-6 border border-white text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all">
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ThemeWrapper>
  );
}
