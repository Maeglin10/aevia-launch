"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Home, MapPin, Bed, Bath, Maximize, Menu, X, ArrowRight, Phone, Mail, Star, Building2, TreePine, Car } from "lucide-react";
import "../premium.css";

const PROPERTIES = [
  { id: "p1", title: "The Meridian Penthouse", address: "42 Park Avenue, Manhattan", price: "$4,200,000", beds: 4, baths: 3, sqft: "3,200", type: "PENTHOUSE", status: "NEW" },
  { id: "p2", title: "Willow Creek Estate", address: "18 Elm Drive, Greenwich", price: "$2,850,000", beds: 5, baths: 4, sqft: "4,800", type: "ESTATE", status: "OPEN_HOUSE" },
  { id: "p3", title: "Harbor View Loft", address: "7 Wharf Street, Brooklyn", price: "$1,650,000", beds: 2, baths: 2, sqft: "1,800", type: "LOFT", status: "FEATURED" },
  { id: "p4", title: "Summit Ridge Villa", address: "92 Canyon Road, Aspen", price: "$6,500,000", beds: 6, baths: 5, sqft: "7,200", type: "VILLA", status: "EXCLUSIVE" },
  { id: "p5", title: "The Atelier Townhouse", address: "155 Charles Street, West Village", price: "$3,900,000", beds: 3, baths: 3, sqft: "2,600", type: "TOWNHOUSE", status: "NEW" },
  { id: "p6", title: "Coastal Modern Residence", address: "31 Ocean Blvd, Malibu", price: "$8,200,000", beds: 5, baths: 4, sqft: "5,400", type: "RESIDENCE", status: "EXCLUSIVE" },
];

const STATS = [{ label: "PROPERTIES_SOLD", val: "840+" }, { label: "TOTAL_VALUE", val: "$2.1B" }, { label: "AVG_DAYS_MARKET", val: "18" }, { label: "CLIENT_RETENTION", val: "94%" }];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function HavenRealEstatePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#faf8f4] text-[#1a1a1a] font-mono selection:bg-[#b8860b] selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#faf8f4]/90 backdrop-blur-xl py-4 border-b border-black/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#b8860b] rounded-full flex items-center justify-center text-white"><Home className="w-4 h-4" /></div>
            <span className="group-hover:text-[#b8860b] transition-colors">HAVEN // <span className="text-black/30">ESTATES</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">
            {["Properties", "Neighborhoods", "Agents", "Contact"].map(l => <Link key={l} href="#" className="hover:text-[#b8860b] transition-colors">{l}</Link>)}
          </div>
          <button className="px-6 py-2.5 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#b8860b] transition-all hidden md:block">Schedule_Tour</button>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-black/40"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#faf8f4] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-black/40"><X className="w-10 h-10" /></button>
          {["Properties", "Neighborhoods", "Agents", "Contact"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#b8860b]/10 border border-[#b8860b]/30 text-[#b8860b] text-[9px] font-bold uppercase tracking-widest">ACCEPTING_CLIENTS</div>
              <div className="text-[9px] text-black/20 tracking-widest uppercase">EST. 2008 // NEW YORK</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Find <br /> Your <br /> <span className="text-[#b8860b]">Haven.</span>
            </h1>
            <p className="max-w-xl text-lg text-black/40 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              Curated luxury properties across the tri-state area. White-glove service from search to close.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#b8860b] transition-all">View_Properties</button>
              <button className="px-12 py-5 border border-black/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all">Book_Consultation</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROPERTIES GRID */}
      <section className="py-40 bg-white border-y border-black/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Featured <span className="text-[#b8860b]">Listings.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {PROPERTIES.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <div className="group bg-[#faf8f4] border border-black/5 rounded-3xl overflow-hidden hover:border-[#b8860b]/30 hover:shadow-xl transition-all duration-500 cursor-pointer">
                  {/* Image placeholder */}
                  <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#b8860b]/10 to-[#b8860b]/5 flex items-center justify-center relative">
                    <Building2 className="w-12 h-12 text-[#b8860b]/20" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase tracking-widest">{p.type}</span>
                      <span className="px-2 py-0.5 bg-[#b8860b] text-white text-[8px] font-black uppercase tracking-widest">{p.status}</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="text-2xl font-black text-[#b8860b] mb-2">{p.price}</div>
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-[#b8860b] transition-colors">{p.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-black/30 uppercase tracking-widest mb-6">
                      <MapPin className="w-3 h-3" />{p.address}
                    </div>
                    <div className="flex items-center gap-6 pt-6 border-t border-black/5 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      <div className="flex items-center gap-2"><Bed className="w-3.5 h-3.5" />{p.beds} Beds</div>
                      <div className="flex items-center gap-2"><Bath className="w-3.5 h-3.5" />{p.baths} Baths</div>
                      <div className="flex items-center gap-2"><Maximize className="w-3.5 h-3.5" />{p.sqft} sqft</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-40 bg-[#faf8f4]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase">Our <span className="text-[#b8860b]">Services.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[{ name: "BUYER // ADVISORY", items: ["Market Analysis", "Property Matching", "Negotiation", "Due Diligence"] },
              { name: "SELLER // SERVICES", items: ["Valuation", "Staging", "Photography", "Marketing"] },
              { name: "INVESTMENT // COUNSEL", items: ["Portfolio Review", "ROI Analysis", "Tax Strategy", "1031 Exchange"] }
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-12 bg-white border border-black/5 hover:border-[#b8860b]/30 hover:bg-[#1a1a1a] hover:text-white transition-all rounded-3xl">
                  <h3 className="text-2xl font-black uppercase mb-8 tracking-tighter group-hover:text-[#b8860b] transition-colors">{s.name}</h3>
                  <div className="space-y-5 pt-8 border-t border-black/5 group-hover:border-white/10">
                    {s.items.map((item, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-black/20 group-hover:text-white/30 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#b8860b] rotate-45" />{item}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-40 bg-[#1a1a1a] text-white text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {STATS.map((s, i) => (
                <div key={i} className="group"><div className="text-4xl md:text-5xl font-black text-white mb-4 group-hover:text-[#b8860b] transition-colors">{s.val}</div><div className="text-[9px] font-black text-white/20 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#faf8f4] text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Your <span className="text-[#b8860b]">Move.</span></h2>
            <p className="max-w-xl mx-auto text-sm text-black/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Schedule a private consultation with one of our senior advisors.</p>
            <button className="px-16 py-6 bg-[#1a1a1a] text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#b8860b] transition-all">Get_Started</button>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#1a1a1a] text-white py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#b8860b] text-white rounded-full flex items-center justify-center"><Home className="w-4 h-4" /></div><span>HAVEN // ESTATES</span></Link>
            <p className="text-[11px] text-white/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Curated luxury real estate. White-glove service since 2008.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#b8860b]">Browse</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Buy", "Sell", "Invest", "Neighborhoods"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#b8860b]">Connect</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Contact", "Instagram", "LinkedIn", "Press"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">&copy; 2026 HAVEN ESTATES</div>
      </footer>
    </div>
  );
}
