"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Camera, Eye, Award, Instagram, ChevronRight, MapPin, Mail, Tag } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("obs-fonts")) return;
    const s = document.createElement("style");
    s.id = "obs-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Space+Grotesk:wght@400;500&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const categories = ["Tous", "Portrait", "Mode", "Reportage", "Architecture", "Nature"];

const works = [
  { title: "La Lumière de Minuit", category: "Portrait", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", year: "2025" },
  { title: "Couture Invisible", category: "Mode", src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", year: "2025" },
  { title: "Mémoire des Rues", category: "Reportage", src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", year: "2024" },
  { title: "Béton & Lumière", category: "Architecture", src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80", year: "2024" },
  { title: "Femme en Avant", category: "Mode", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", year: "2025" },
  { title: "Le Temps Suspendu", category: "Portrait", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", year: "2023" },
];

const services = [
  { title: "Portraits & Éditorial", desc: "Portraits intimes et éditoriaux pour magazines, agences et particuliers. Studio ou extérieur.", from: "600€" },
  { title: "Campagnes Mode", desc: "Direction artistique et photographie pour collections et lookbooks. Équipe complète sur demande.", from: "2 400€" },
  { title: "Reportage Événementiel", desc: "Mariage, lancement produit, conférence. Documentation professionnelle haute définition.", from: "900€" },
  { title: "Architecture & Intérieur", desc: "Valorisation de projets architecturaux et d'espaces de vie. Post-production cinématographique.", from: "1 200€" },
];

const awards = [
  { name: "World Photography Awards", year: "2025", category: "Portrait" },
  { name: "IPA — International Photography Awards", year: "2024", category: "Mode" },
  { name: "Prix Roger-Viollet", year: "2023", category: "Reportage" },
];

const clients = ["Vogue France", "Le Monde", "LVMH", "Chanel", "Elle", "Air France"];

export default function ObscuraPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tous");

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const filteredWorks = activeCategory === "Tous" ? works : works.filter(w => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0A0806]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0A0806]/90 backdrop-blur-md border border-[#C9A86C]/15 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[#C9A86C] tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }}>
            Obscura
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/40 text-sm">
            {["Portfolio", "Services", "À propos", "Récompenses", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <button className="hidden md:inline-flex border border-[#C9A86C]/30 text-[#C9A86C] text-xs px-5 py-2.5 rounded-xl hover:bg-[#C9A86C] hover:text-black transition-all cursor-pointer tracking-wide uppercase">
            Réserver
          </button>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#0A0806] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#C9A86C] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Obscura</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Portfolio", "Services", "À propos", "Récompenses", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-3xl mb-6 cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }} onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&q=85" alt="Obscura Photography" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806]/70 via-[#0A0806]/20 to-[#0A0806]/90" />
        </motion.div>
        <motion.div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" style={{ opacity: heroOpacity }}>
          <Reveal>
            <div className="flex items-center gap-2 text-[#C9A86C] text-xs tracking-widest uppercase mb-8">
              <Camera className="w-4 h-4" /> Photographe · Paris
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-white text-6xl md:text-9xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Obscura
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/50 text-lg max-w-md leading-relaxed mb-12">
              L'art de capturer l'imperceptible. Portrait, mode et reportage au service de l'émotion pure.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <button className="border border-[#C9A86C]/40 text-[#C9A86C] text-xs tracking-widest uppercase px-10 py-4 hover:bg-[#C9A86C] hover:text-black transition-all cursor-pointer rounded-xl">
              Voir le portfolio
            </button>
          </Reveal>
        </motion.div>
      </section>

      {/* Portfolio */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Portfolio</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Œuvres sélectionnées</h2>
              </div>
              <div className="flex gap-2 flex-wrap mt-6 md:mt-0">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-xs tracking-wide transition-all cursor-pointer rounded-lg border ${activeCategory === cat ? "bg-[#C9A86C] text-black border-[#C9A86C]" : "border-white/10 text-white/40 hover:border-[#C9A86C]/40"}`}>{cat}</button>
                ))}
              </div>
            </div>
          </Reveal>
          <motion.div layout className="columns-2 md:columns-3 gap-3 space-y-3">
            <AnimatePresence>
              {filteredWorks.map((w, i) => (
                <motion.div key={w.title} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, delay: i * 0.05 }} className="relative overflow-hidden rounded-xl group cursor-pointer break-inside-avoid">
                  <div className="relative" style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/3" }}>
                    <Image src={w.src} alt={w.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <span className="text-[#C9A86C] text-xs tracking-widest uppercase">{w.category}</span>
                      <p className="text-white text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{w.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 bg-[#0E0B08]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Prestations</p>
              <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Services photographiques</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="bg-[#131008] border border-white/5 rounded-2xl p-8 hover:border-[#C9A86C]/20 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-white text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h3>
                    <span className="text-[#C9A86C] text-sm group-hover:translate-x-1 transition-transform" style={{ fontFamily: "'Cormorant Garamond', serif" }}>À partir de {s.from}</span>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-12">
            <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Distinctions</p>
            <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Récompenses</h2>
          </Reveal>
          <div className="space-y-0">
            {awards.map((a, i) => (
              <Reveal key={a.name} delay={i * 0.08}>
                <div className="flex items-center justify-between py-6 border-b border-white/10 group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Award className="w-5 h-5 text-[#C9A86C]" />
                    <div>
                      <p className="text-white text-sm group-hover:text-[#C9A86C] transition-colors">{a.name}</p>
                      <p className="text-white/30 text-xs">{a.category}</p>
                    </div>
                  </div>
                  <span className="text-white/30 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{a.year}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-16 px-6 bg-[#0E0B08] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-8"><p className="text-white/20 text-xs tracking-widest uppercase">Ils m'ont fait confiance</p></Reveal>
          <div className="flex flex-wrap justify-center gap-8">
            {clients.map((c, i) => (
              <Reveal key={c} delay={i * 0.06}><span className="text-white/30 text-sm tracking-widest hover:text-[#C9A86C] transition-colors cursor-pointer">{c}</span></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4">Contact</p>
            <h2 className="text-white text-5xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>Travaillons ensemble</h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-10">
              Disponible pour des projets éditoriaux, campagnes et reportages en France et à l'international.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#C9A86C] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B8975E] transition-colors cursor-pointer flex items-center justify-center gap-2"><Mail className="w-4 h-4" />contact@obscura.fr</button>
              <button className="border border-white/10 text-white text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center gap-2"><Instagram className="w-4 h-4" />@obscuraphoto</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060402] border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <span className="text-[#C9A86C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Obscura · Photographe Paris</span>
          <span>© 2026 Tous droits réservés · <Link href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">Mentions légales</Link></span>
        </div>
      </footer>
    </div>
  );
}
