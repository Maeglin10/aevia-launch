"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, ChevronRight, Instagram, ShoppingBag } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("nc-fonts")) return;
    const s = document.createElement("style");
    s.id = "nc-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Helvetica+Neue:wght@300;400&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const collections = [
  { name: "Couture Noire", season: "SS 2026", pieces: 24, tag: "Nouvelle collection" },
  { name: "L'Invisible", season: "AW 2025", pieces: 18, tag: "Archive" },
  { name: "Monochrome", season: "Resort 2026", pieces: 12, tag: "Exclusif" },
];

const editorials = [
  { title: "La nuit appartient aux audacieuses", category: "Editorial", src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { title: "Silences et structures", category: "Fashion", src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" },
  { title: "L'héritage revisité", category: "Interview", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
  { title: "Noir absolu, texture absolue", category: "Campaign", src: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?w=600&q=80" },
];

const looks = [
  { name: "Manteau Asymétrique", price: "2 400€", src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80" },
  { name: "Robe Colonne", price: "1 800€", src: "https://images.unsplash.com/photo-1566479179817-e4067b2c1a83?w=400&q=80" },
  { name: "Tailleur Structuré", price: "3 200€", src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80" },
];

export default function NoirCouturePage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[1px] bg-black origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-black tracking-[0.3em] text-sm uppercase font-light" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>
            Noir Couture
          </Link>
          <div className="hidden md:flex items-center gap-10 text-black text-xs tracking-widest uppercase font-light">
            {["Collections", "Editorial", "Boutique", "Atelier", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:opacity-50 transition-opacity cursor-pointer">{item}</Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="cursor-pointer hover:opacity-60 transition-opacity"><ShoppingBag className="w-5 h-5 text-black" /></button>
          </div>
          <button className="md:hidden text-black cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-black flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-white tracking-widest text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>Noir Couture</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Collections", "Editorial", "Boutique", "Atelier", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-3xl font-light mb-6 cursor-pointer tracking-widest uppercase" onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — B&W split */}
      <section ref={heroRef} className="relative h-screen overflow-hidden pt-20">
        <div className="grid grid-cols-2 h-full">
          <motion.div className="relative overflow-hidden" style={{ y: heroY }}>
            <Image src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=90" alt="Noir Couture" fill className="object-cover" priority />
          </motion.div>
          <div className="bg-black flex flex-col items-start justify-end p-12">
            <motion.div style={{ opacity: heroOpacity }}>
              <Reveal>
                <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Maison fondée en 1998</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-white text-5xl md:text-7xl leading-none mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
                  Couture<br /><em>Noire</em>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-10">
                  L'art de la silhouette. Chaque pièce est une déclaration. Chaque collection, un manifeste.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <button className="border border-white/30 text-white text-xs tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                  Voir la collection
                </button>
              </Reveal>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>Collections</h2>
              <Link href="#" className="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                Voir tout <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </Reveal>
          <div className="flex gap-3 mb-10">
            {collections.map((c, i) => (
              <button key={c.name} onClick={() => setActiveCollection(i)} className={`text-xs tracking-widest uppercase px-5 py-2.5 transition-all cursor-pointer border ${i === activeCollection ? "bg-white text-black border-white" : "border-white/20 text-white/50 hover:border-white/60"}`}>
                {c.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeCollection} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-0">
              <div className="relative h-[500px] overflow-hidden">
                <Image src={editorials[activeCollection]?.src || editorials[0].src} alt={collections[activeCollection].name} fill className="object-cover" />
              </div>
              <div className="bg-[#0A0A0A] p-12 flex flex-col justify-between">
                <div>
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-4">{collections[activeCollection].season}</p>
                  <h3 className="text-white text-4xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{collections[activeCollection].name}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-8">{collections[activeCollection].pieces} pièces. Une vision sans compromis du vêtement contemporain. Des silhouettes qui défient l'évidence et cherchent la beauté dans la rigueur.</p>
                  <span className="text-white/30 text-xs border border-white/20 px-3 py-1">{collections[activeCollection].tag}</span>
                </div>
                <button className="flex items-center gap-3 text-white text-xs tracking-widest uppercase hover:gap-5 transition-all cursor-pointer mt-8">
                  Explorer la collection <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Editorial grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-black text-4xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>Editorial</h2>
              <Link href="#" className="text-black/40 text-xs tracking-widest uppercase hover:text-black transition-colors cursor-pointer">Tout voir</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {editorials.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.08}>
                <div className="relative overflow-hidden group cursor-pointer" style={{ aspectRatio: "3/4" }}>
                  <Image src={e.src} alt={e.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white/60 text-xs tracking-widest uppercase mb-1">{e.category}</p>
                    <p className="text-white text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{e.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Shop looks */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-white text-4xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>Boutique</h2>
              <Link href="#" className="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors cursor-pointer">Tout voir</Link>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {looks.map((look, i) => (
              <Reveal key={look.name} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "3/4" }}>
                    <Image src={look.src} alt={look.name} fill className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                    <button className="absolute bottom-4 left-4 right-4 bg-white text-black text-xs tracking-widest uppercase py-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center gap-2">
                      <ShoppingBag className="w-3 h-3" /> Ajouter au panier
                    </button>
                  </div>
                  <h3 className="text-white text-sm mb-1">{look.name}</h3>
                  <p className="text-white/40 text-sm">{look.price}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-black text-4xl mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>L'avant-première</h2>
            <p className="text-black/50 text-sm leading-relaxed mb-8">Soyez les premiers informés des nouvelles collections, des défilés et des événements exclusifs Noir Couture.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input type="email" placeholder="votre@email.com" className="flex-1 border border-black/20 px-4 py-3 text-sm outline-none focus:border-black" />
              <button className="bg-black text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-black/80 transition-colors cursor-pointer">S'inscrire</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <p className="text-white text-xl mb-4 tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem" }}>Noir Couture</p>
              <p className="text-white/30 text-sm leading-relaxed">Maison de couture parisienne. Fondée en 1998.</p>
            </div>
            {[
              { title: "Univers", links: ["Collections", "Editorial", "Campagnes", "Archives"] },
              { title: "Boutique", links: ["Femme", "Homme", "Accessoires", "Bijoux"] },
              { title: "Maison", links: ["L'atelier", "Savoir-faire", "Presse", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white/50 text-xs tracking-widest uppercase mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => <li key={l}><Link href="#" className="text-white/30 text-sm hover:text-white transition-colors cursor-pointer">{l}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
            <span>© 2026 Noir Couture. Tous droits réservés.</span>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors cursor-pointer">Mentions légales</Link>
              <button className="cursor-pointer hover:text-white transition-colors"><Instagram className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
