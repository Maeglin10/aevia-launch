// @ts-nocheck
"use client"

import React, { useState, useEffect, useRef } from "react"
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useInView, 
  useSpring 
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  GlassWater, Map, Wind, Sun, 
  ArrowRight, Menu, X, Plus, 
  Maximize2, Share2, Download, ExternalLink, 
  Archive, Search, Clock, Hash, 
  Layers, Frame, Droplets, Landmark,
  Award, Star, ShieldCheck, Thermometer,
  CloudRain, MapPin, ChevronRight, Play,
  Lock, Key, BookOpen, PenTool
} from "lucide-react"

/* ==========================================================================
   THE AETHELGARD DATASET (PREMIUM DENSITY)
   ========================================================================== */

const VINTAGES = [
  {
    id: "v-2022",
    name: "The Crimson Sovereign",
    type: "Reserve Cabernet",
    notes: ["Blackberry", "Leather", "Graphite"],
    score: "98 pts",
    stock: "Limited",
    image: "https://images.unsplash.com/photo-1510850473394-d236d1e3d0cd?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "v-2024",
    name: "Lunar Blanc",
    type: "Harvest Sauvignon",
    notes: ["Citrus", "Wet Stone", "Elderflower"],
    score: "96 pts",
    stock: "Pre-order",
    image: "https://images.unsplash.com/photo-1559156155-573549723223?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "s-spirit",
    name: "Aethelgard 12yr Single Malt",
    type: "Small Batch Whisky",
    notes: ["Peat Smoke", "Sea Salt", "Dark Toffee"],
    score: "Platinum",
    stock: "In-Vault",
    image: "https://images.unsplash.com/photo-1527281021233-ad0376ce21f5?q=80&w=1200&auto=format&fit=crop"
  }
]

const TERROIR_DATA = [
  { label: "Elevation", value: "450m", icon: <Layers className="w-4 h-4" /> },
  { label: "Soil Type", value: "Jurassic Limestone", icon: <Map className="w-4 h-4" /> },
  { label: "Avg Temp", value: "18.4°C", icon: <Thermometer className="w-4 h-4" /> },
  { label: "Hydration", value: "Clay-Filtered", icon: <Droplets className="w-4 h-4" /> }
]

/* ==========================================================================
   ANIMATION COMPONENTS
   ========================================================================== */

function Reveal({ children, delay = 0, y = 50 }: { children: React.ReactNode, delay?: number, y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ subtitle, title, alignment = "center" }: { subtitle: string, title: string, alignment?: "center" | "left" }) {
  return (
    <div className={`mb-32 ${alignment === "center" ? "text-center" : "text-left"}`}>
       <Reveal>
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c4a661] mb-8 block italic underline underline-offset-8">
             {subtitle}
          </span>
          <h2 className="text-6xl md:text-8xl font-light italic leading-none tracking-tighter uppercase text-white" style={{ fontFamily: "serif" }}>
             {title}
          </h2>
       </Reveal>
    </div>
  )
}

/* ==========================================================================
   THE AETHELGARD ESTATE - MAIN PAGE
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function AethelgardEstatePremium() {
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

  const [activeVintage, setActiveVintage] = useState(0)
  const [memberPortal, setMemberPortal] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax & Transition Effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05])
  const bgTransition = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.9], ["#0a0a0b", "#1a1614", "#2d1b1b", "#0a0a0b"])

  
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
    <motion.div 
      ref={containerRef} 
      style={{ backgroundColor: bgTransition }}
      className="text-[#f8f9fa] font-sans selection:bg-[#c4a661] selection:text-white min-h-screen overflow-x-hidden transition-colors duration-1000"
    >
      
      {/* ==========================================
          DYNAMIC OVERLAY NAVIGATION
          ========================================== */}
      <nav className="fixed top-0 left-0 w-full h-24 z-[100] px-8 md:px-20 flex items-center justify-between pointer-events-none">
         <div className="pointer-events-auto">
            <Link href="#hero" className="flex flex-col group">
               <span className="text-3xl font-light tracking-[0.4em] uppercase text-white group-hover:text-[#c4a661] transition-colors">AETHELGARD</span>
               <span className="text-[8px] font-black tracking-[0.6em] text-[#c4a661]/40 uppercase italic">The Estate & Spirits Group</span>
            </Link>
         </div>

         <div className="flex items-center gap-12 pointer-events-auto">
            <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
               <Link href="#terroir" className="hover:text-white transition-colors">The Terroir</Link>
               <Link href="#cellar" className="hover:text-white transition-colors">The Cellar</Link>
               <Link href="#alchemist" className="hover:text-white transition-colors">The Alchemist</Link>
               <Link href="#circle" className="hover:text-white transition-colors">The Circle</Link>
            </div>
            <button 
              onClick={() => setMemberPortal(true)}
              className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#c4a661] hover:text-white transition-all shadow-xl bg-black/40 backdrop-blur-xl"
            >
               <Menu className="w-5 h-5" />
            </button>
         </div>
      </nav>

      <main>
        {/* ==========================================
            1. THE PROLOGUE (HERO)
            ========================================== */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=2400&auto=format&fit=crop" 
                alt="Morning Mist over Vineyards" 
                fill 
                className="object-cover opacity-30 grayscale"
                priority
             />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0b_100%)]" />
          </motion.div>

          <div className="relative z-10 text-center max-w-6xl px-8">
             <Reveal>
                <h1 className="text-7xl md:text-[14vw] font-light italic leading-[0.8] tracking-tighter uppercase mb-16" style={{ fontFamily: "serif" }}>{c?.heroHeadline ?? <>
                   Time <br/> <span className="not-italic font-black text-[#c4a661]/5 italic">Is_The_Master.</span>
                </>}</h1>
                <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-32">
                   <div className="flex flex-col items-center">
                      <span className="text-4xl font-light tracking-tighter">1842</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Establishment</span>
                   </div>
                   <div className="w-px h-16 bg-white/10 hidden md:block" />
                   <p className="max-w-xs text-xs text-white/40 leading-loose uppercase tracking-widest font-light italic">{c?.heroSubline ?? fd?.tagline ?? <>
                      Dans le silence de nos caves, chaque goutte écrit l'histoire d'un héritage inébranlable.
                   </>}</p>
                   <div className="w-px h-16 bg-white/10 hidden md:block" />
                   <div className="flex flex-col items-center">
                      <span className="text-4xl font-light tracking-tighter">Gold</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Heritage Status</span>
                   </div>
                </div>
             </Reveal>
          </div>
        </section>

        {/* ==========================================
            2. THE TERROIR (TECHNICAL DENSITY)
            ========================================== */}
        <section id="terroir" className="py-60 relative overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <SectionTitle subtitle="Chapitre I // La Terre" title="The Terroir Analysis." alignment="left" />
              
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                    {TERROIR_DATA.map((data, i) => (
                      <Reveal key={i} delay={i * 0.1}>
                         <div className="bg-black/20 backdrop-blur-3xl p-12 hover:bg-[#c4a661] hover:text-black transition-all group">
                            <div className="mb-8 opacity-40 group-hover:opacity-100">{data.icon}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 mb-2">{data.label}</div>
                            <div className="text-3xl font-light tracking-tighter">{data.value}</div>
                         </div>
                      </Reveal>
                    ))}
                 </div>

                 <div className="space-y-12">
                    <Reveal delay={0.3}>
                       <p className="text-2xl font-light text-white/60 leading-relaxed italic">{c?.aboutText ?? <>
                          "Notre sol de calcaire jurassique insuffle à nos vins une tension minérale unique, signature indélébile de l'Aethelgard."
                       </>}</p>
                       <div className="h-px w-32 bg-[#c4a661] my-12" />
                       <div className="space-y-8">
                          {[
                            { t: "The Micro-Climate", d: "Une vallée protégée par des falaises de granit, retenant la chaleur solaire." },
                            { t: "Organic Harmony", d: "Culture biodynamique sans aucun compromis chimique depuis 1992." }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-8 group">
                               <span className="text-[10px] font-black text-[#c4a661]">0{i+1}</span>
                               <div>
                                  <h4 className="text-sm font-black uppercase tracking-widest mb-2 italic">{item.t}</h4>
                                  <p className="text-xs text-white/20 uppercase tracking-widest font-bold leading-relaxed">{item.d}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ==========================================
            3. THE CELLAR (PRODUCT MATRIX)
            ========================================== */}
        <section id="cellar" className="py-60 bg-black/20 border-y border-white/5">
           <div className="max-w-[1600px] mx-auto px-8 md:px-20">
              <SectionTitle subtitle="Chapitre II // Le Cellier" title="Private Vintages." />

              <div className="grid md:grid-cols-3 gap-12">
                 {VINTAGES.map((vin, i) => (
                   <Reveal key={vin.id} delay={i * 0.1}>
                      <div className="group relative bg-white/5 border border-white/5 p-12 overflow-hidden hover:border-[#c4a661]/50 transition-all duration-700 cursor-pointer">
                         <div className="absolute top-0 right-0 p-40 bg-[#c4a661] opacity-0 group-hover:opacity-[0.03] blur-[100px] rounded-full transition-opacity" />
                         
                         <div className="aspect-[3/4] relative mb-12 overflow-hidden">
                            <Image 
                               src={vin.image} 
                               alt={vin.name} 
                               fill 
                               className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                         </div>

                         <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                               <h3 className="text-3xl font-light italic uppercase tracking-tighter text-white group-hover:text-[#c4a661] transition-colors">{vin.name}</h3>
                               <span className="text-[10px] font-black text-[#c4a661]">{vin.score}</span>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-8">
                               {vin.notes.map(note => (
                                 <span key={note} className="text-[8px] font-black uppercase tracking-widest text-white/20 border border-white/10 px-3 py-1">{note}</span>
                               ))}
                            </div>
                            <div className="flex justify-between items-end border-t border-white/10 pt-8">
                               <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{vin.type}</span>
                               <button className="text-[10px] font-black uppercase tracking-widest text-[#c4a661] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                  Reserve <ChevronRight className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            4. THE ALCHEMIST (DISTILLATION STORY)
            ========================================== */}
        <section id="alchemist" className="py-60">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div className="order-2 lg:order-1">
                    <Reveal>
                       <SectionTitle subtitle="Chapitre III // L'Alchimie" title="Spirits of Aethelgard." alignment="left" />
                       <p className="text-xl font-light text-white/40 leading-relaxed italic mb-16 uppercase tracking-widest">
                          Le temps n'est pas un ennemi, c'est notre principal allié. Nos spiritueux sont élevés en fûts de chêne séculaires, capturant l'essence même de la patience.
                       </p>
                       <div className="grid grid-cols-2 gap-8">
                          {[
                            { label: "Distillation", value: "Triple Copper Pot" },
                            { label: "Aging", value: "Minimum 12 Years" },
                            { label: "Finish", value: "Oloroso Cask" },
                            { label: "Purity", value: "Non-Chill Filtered" }
                          ].map((stat, i) => (
                            <div key={i} className="border-b border-white/10 pb-6">
                               <div className="text-[8px] font-black text-[#c4a661] uppercase tracking-[0.4em] mb-2">{stat.label}</div>
                               <div className="text-xl font-light text-white italic">{stat.value}</div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
                 <div className="order-1 lg:order-2 relative aspect-square">
                    <Reveal delay={0.3}>
                       <Image 
                          src="https://images.unsplash.com/photo-1527281021233-ad0376ce21f5?q=80&w=1200&auto=format&fit=crop" 
                          alt="Copper Still" 
                          fill 
                          className="object-cover grayscale"
                       />
                       <div className="absolute inset-0 border-[30px] border-black/20" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-20 h-20 text-[#c4a661] opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ==========================================
            5. THE CIRCLE (MEMBERSHIP)
            ========================================== */}
        <section id="circle" className="py-60 bg-white text-black relative">
           <div className="max-w-[1200px] mx-auto px-8 md:px-20 text-center">
              <Reveal>
                 <SectionTitle subtitle="Privilège // Adhésion" title="Join The Circle." />
                 <p className="max-w-2xl mx-auto text-xl font-light text-black/40 leading-relaxed italic mb-20">
                    Accédez à des millésimes exclusifs, des dégustations privées au domaine et une conciergerie dédiée à votre cave personnelle.
                 </p>
                 
                 <form className="max-w-xl mx-auto space-y-12" onSubmit={e => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="border-b border-black/10 py-4 text-left">
                          <label className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Surname</label>
                          <input type="text" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="Sterling" />
                       </div>
                       <div className="border-b border-black/10 py-4 text-left">
                          <label className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Location</label>
                          <input type="text" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="London, UK" />
                       </div>
                    </div>
                    <div className="border-b border-black/10 py-4 text-left">
                       <label className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Digital Signature</label>
                       <input type="email" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="alistair@sterling.com" />
                    </div>
                    <button className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#c4a661] transition-all shadow-2xl">
                       Request Invitation
                    </button>
                 </form>
              </Reveal>
           </div>
        </section>

        {/* ==========================================
            6. MEGA FOOTER
            ========================================== */}
        <footer id="contact" className="bg-black pt-60 pb-12 px-8 md:px-20 relative z-50 border-t border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-32 mb-60 text-white">
              <div className="lg:col-span-2">
                 <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 bg-[#c4a661] flex items-center justify-center rounded-sm">
                       <Landmark className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-3xl font-light tracking-[0.4em] uppercase">AETHELGARD</span>
                 </div>
                 <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm mb-16 italic">
                    "Le temps n'est pas un luxe, c'est notre ingrédient secret." — Domaine Aethelgard V.4
                 </p>
                 <div className="flex gap-12">
                    {["Camera", "Vogue", "Decanter", "Forbes"].map(s => (
                       <Link key={s} href="#terroir" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#c4a661] transition-colors italic">{s}</Link>
                    ))}
                 </div>
              </div>

              {[
                { t: "DOMAINE", l: ["Terroir", "Heritage", "Vineyards", "Spirits"] },
                { t: "SERVICES", l: ["Private Circle", "Concierge", "Cellar Mgmt", "Tastings"] },
                { t: "SUPPORT", l: ["Shipments", "Returns", "Terms", "Contact"] }
              ].map((col, i) => (
                <div key={i} className="flex flex-col gap-12">
                   <h4 className="text-[10px] font-black text-[#c4a661] uppercase tracking-[0.5em] italic">{col.t}</h4>
                   <ul className="flex flex-col gap-6">
                      {col.l.map(link => (
                         <li key={link} className="text-[10px] font-bold text-white/20 hover:text-white transition-colors cursor-pointer uppercase tracking-widest italic">{link}</li>
                      ))}
                   </ul>
                </div>
              ))}
           </div>

           <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-12 text-[8px] font-black text-white/10 uppercase tracking-[0.4em] italic">
              <span>© 2026 AETHELGARD ESTATE & SPIRITS GROUP SA. // ALL_RIGHTS_RESERVED</span>
              <div className="flex gap-12">
                 <span>BORDEAUX</span>
                 <span>TUSCANY</span>
                 <span>HIGHLANDS</span>
              </div>
           </div>
        </footer>
      </main>

      {/* MEMBER PORTAL OVERLAY */}
      <AnimatePresence>
        {memberPortal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
          >
             <div className="max-w-2xl w-full border border-white/10 p-16 relative bg-[#1a1614]">
                <button onClick={() => setMemberPortal(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                   <X className="w-8 h-8" />
                </button>
                <div className="flex flex-col items-center gap-12">
                   <SectionTitle subtitle="Security // Handshake" title="The Portal." />
                   <div className="w-full space-y-8">
                      <div className="border-b border-white/10 pb-4">
                         <label className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 block mb-2">Key Identifier</label>
                         <input type="text" className="w-full bg-transparent outline-none text-2xl font-light italic text-white" placeholder="AE-7402-X" />
                      </div>
                      <button className="w-full py-6 bg-[#c4a661] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                         Validate Access
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
