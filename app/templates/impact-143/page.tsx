"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Palette, Sofa, Lamp, Menu, X, ArrowRight, Star, Users, Award, Mail, Phone, MapPin, CheckCircle2, Brush, Layers, Eye } from "lucide-react";
import "../premium.css";

const SERVICES = [
  { icon: <Palette className="w-6 h-6" />, title: "Interior Design", desc: "Full-service residential and commercial design. From concept boards to final installation." },
  { icon: <Layers className="w-6 h-6" />, title: "Space Planning", desc: "Optimized floor plans that maximize flow, light, and function for every room." },
  { icon: <Brush className="w-6 h-6" />, title: "Custom Furniture", desc: "Bespoke pieces designed and crafted by our in-house atelier. Made to your exact specifications." },
  { icon: <Eye className="w-6 h-6" />, title: "3D Visualization", desc: "Photorealistic renders of your space before construction begins. See it before you build it." },
  { icon: <Lamp className="w-6 h-6" />, title: "Lighting Design", desc: "Layered lighting plans that set mood, enhance architecture, and reduce energy costs." },
  { icon: <Sofa className="w-6 h-6" />, title: "Styling & Staging", desc: "Property staging for luxury real estate and editorial photoshoots." },
];

const PROJECTS = [
  { id: "p1", title: "The Marble Residence", category: "RESIDENTIAL", location: "Manhattan, NY" },
  { id: "p2", title: "Nobu Hotel Suite", category: "HOSPITALITY", location: "Malibu, CA" },
  { id: "p3", title: "Vanguard Office", category: "COMMERCIAL", location: "London, UK" },
  { id: "p4", title: "Lake Como Villa", category: "RESIDENTIAL", location: "Como, Italy" },
];

const TESTIMONIALS = [
  { name: "Catherine Moore", role: "Homeowner, Manhattan", quote: "Atelier transformed our apartment into something out of Architectural Digest. Every detail was considered." },
  { name: "James Rivera", role: "Director, Nobu Hospitality", quote: "Their understanding of luxury hospitality spaces is unmatched. Guests consistently comment on the design." },
  { name: "Dr. Lisa Park", role: "Founder, Vanguard Capital", quote: "Our new office space directly impacted employee satisfaction scores. The ROI on great design is real." },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function AtelierInteriorPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#faf7f2] text-[#2a2420] font-mono selection:bg-[#a0845c] selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#faf7f2]/90 backdrop-blur-xl py-4 border-b border-[#2a2420]/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#a0845c] rounded-full flex items-center justify-center text-white"><Palette className="w-4 h-4" /></div>
            <span className="group-hover:text-[#a0845c] transition-colors">ATELIER // <span className="text-[#2a2420]/30">INTERIOR</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2a2420]/30">
            {["Services", "Portfolio", "About", "Contact"].map(l => <Link key={l} href="#" className="hover:text-[#a0845c] transition-colors">{l}</Link>)}
          </div>
          <button className="px-6 py-2.5 bg-[#2a2420] text-[#faf7f2] text-[10px] font-black uppercase tracking-widest hover:bg-[#a0845c] transition-all hidden md:block">Book_Consultation</button>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-[#2a2420]/40"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#faf7f2] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-[#2a2420]/40"><X className="w-10 h-10" /></button>
          {["Services", "Portfolio", "About", "Contact"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#a0845c]/10 border border-[#a0845c]/30 text-[#a0845c] text-[9px] font-bold uppercase tracking-widest">ACCEPTING_PROJECTS</div>
              <div className="text-[9px] text-[#2a2420]/20 tracking-widest uppercase">EST. 2011 // PARIS & NEW YORK</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Design <br /> That <br /> <span className="text-[#a0845c]">Lives.</span>
            </h1>
            <p className="max-w-xl text-lg text-[#2a2420]/40 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              Luxury interior design studio. Residential, hospitality, and commercial spaces crafted with precision.
            </p>
            <button className="px-12 py-5 bg-[#2a2420] text-[#faf7f2] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#a0845c] transition-all">View_Portfolio</button>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-40 bg-white border-y border-[#2a2420]/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <Reveal>
              <span className="text-[10px] text-[#a0845c] font-bold uppercase tracking-[0.4em] mb-6 block">About Us</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-8 uppercase">Crafting <span className="text-[#a0845c]">Spaces</span> Since 2011.</h2>
              <p className="text-base text-[#2a2420]/40 leading-relaxed mb-6">Founded in Paris by architect duo Marie Laurent and Thomas Becker, Atelier Interior has grown into a 40-person studio spanning two continents. We believe that great design is invisible — it simply makes life better.</p>
              <p className="text-base text-[#2a2420]/40 leading-relaxed mb-12">Our work spans luxury residences, five-star hotels, and forward-thinking offices. Every project begins with listening and ends with a space that feels inevitable.</p>
              <div className="flex gap-16">
                {[{ val: "280+", label: "PROJECTS" }, { val: "14", label: "AWARDS" }, { val: "40", label: "TEAM" }].map((s, i) => (
                  <div key={i}><div className="text-3xl font-black text-[#a0845c]">{s.val}</div><div className="text-[9px] font-bold text-[#2a2420]/20 uppercase tracking-widest">{s.label}</div></div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="w-full aspect-square bg-gradient-to-br from-[#a0845c]/10 to-[#a0845c]/5 rounded-3xl flex items-center justify-center">
                <Sofa className="w-20 h-20 text-[#a0845c]/15" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-40 bg-[#faf7f2]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Our <span className="text-[#a0845c]">Services.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="group p-10 bg-white border border-[#2a2420]/5 hover:border-[#a0845c]/30 rounded-3xl transition-all">
                  <div className="w-14 h-14 bg-[#a0845c]/10 rounded-2xl flex items-center justify-center text-[#a0845c] mb-8 group-hover:bg-[#a0845c] group-hover:text-white transition-all">{s.icon}</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#a0845c] transition-colors">{s.title}</h3>
                  <p className="text-sm text-[#2a2420]/40 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="py-40 bg-white border-y border-[#2a2420]/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Selected <span className="text-[#a0845c]">Work.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <div className="group cursor-pointer">
                  <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#a0845c]/10 to-[#a0845c]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:from-[#a0845c]/20 transition-all">
                    <Lamp className="w-12 h-12 text-[#a0845c]/15" />
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[9px] font-bold text-[#a0845c] uppercase tracking-widest">{p.category}</span>
                    <span className="text-[9px] text-[#2a2420]/20 uppercase tracking-widest">{p.location}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-[#a0845c] transition-colors">{p.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-40 bg-[#faf7f2]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Client <span className="text-[#a0845c]">Words.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 bg-white border border-[#2a2420]/5 rounded-3xl h-full flex flex-col">
                  <div className="flex gap-1 mb-6">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-[#a0845c] fill-[#a0845c]" />)}</div>
                  <p className="text-base text-[#2a2420]/50 italic leading-relaxed flex-1 mb-8">&ldquo;{t.quote}&rdquo;</p>
                  <div className="pt-6 border-t border-[#2a2420]/5">
                    <div className="font-black uppercase text-sm">{t.name}</div>
                    <div className="text-[10px] text-[#2a2420]/30 uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-40 bg-[#2a2420] text-[#faf7f2]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Start Your <span className="text-[#a0845c]">Project.</span></h2>
            <p className="max-w-xl mx-auto text-sm text-[#faf7f2]/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Schedule a complimentary consultation at our Paris or New York studio.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-16 py-6 bg-[#a0845c] text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#faf7f2] hover:text-[#2a2420] transition-all">Book_Consultation</button>
              <button className="px-16 py-6 border border-[#faf7f2]/10 text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#faf7f2] hover:text-[#2a2420] transition-all">Call_Studio</button>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#2a2420] border-t border-[#faf7f2]/5 py-32 px-6 md:px-12 text-[#faf7f2]">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#a0845c] text-white rounded-full flex items-center justify-center"><Palette className="w-4 h-4" /></div><span>ATELIER // INTERIOR</span></Link>
            <p className="text-[11px] text-[#faf7f2]/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Luxury interior design studio. Paris & New York.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#a0845c]">Studio</h4><ul className="space-y-5 text-[10px] font-bold text-[#faf7f2]/20 uppercase tracking-widest">{["Services", "Portfolio", "Process", "Press"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#a0845c]">Connect</h4><ul className="space-y-5 text-[10px] font-bold text-[#faf7f2]/20 uppercase tracking-widest">{["Instagram", "Pinterest", "LinkedIn", "Contact"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-[#faf7f2]/5 text-center text-[9px] font-bold text-[#faf7f2]/10 uppercase tracking-widest">&copy; 2026 ATELIER INTERIOR</div>
      </footer>
    </div>
  );
}
