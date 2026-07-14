"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, ChevronRight, ShoppingBag } from "lucide-react";

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

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

function CollectionsSubPage({ activeCol, setActiveCol }: { activeCol: number; setActiveCol: (i: number) => void }) {
  const collectionsList = [
    {
      name: "Couture Noire",
      season: "SS 2026",
      desc: "Une exploration de la silhouette monochrome structurée. Des matières lourdes qui défient la gravité, des coupes asymétriques et des finitions à bords francs.",
      inspiration: "L'architecture brutaliste parisienne et la poésie des ombres portées.",
      piecesCount: "24 pièces exclusives",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    },
    {
      name: "L'Invisible",
      season: "AW 2025",
      desc: "Travailler la transparence et le vide. Organza de soie doublé, découpes laser ultra-précises et superpositions de noir et d'anthracite.",
      inspiration: "Les brumes d'automne sur la Seine et le travail des volumes de Cristobal Balenciaga.",
      piecesCount: "18 pièces d'archives",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    },
    {
      name: "Monochrome",
      season: "Resort 2026",
      desc: "L'élégance du voyage sans effort. Des silhouettes fluides en crêpe de soie, des manteaux de voyage en cachemire ultra-léger et des finitions satinées.",
      inspiration: "La lumière de la mer Égée en hiver et le minimalisme des années 90.",
      piecesCount: "12 pièces limitées",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    }
  ];

  return (
    <section className="py-32 px-6 bg-black text-white min-h-dvh">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Les Collections</p>
          <h1 className="text-5xl md:text-7xl font-light mb-16" style={{ fontFamily: "'Playfair Display', serif" }}>
            Manifestes de <em>style</em>
          </h1>
        </Reveal>

        <div className="flex gap-6 border-b border-white/10 pb-6 mb-12 flex-wrap">
          {collectionsList.map((col, idx) => (
            <button
              key={col.name}
              onClick={() => setActiveCol(idx)}
              className={`text-xs tracking-widest uppercase pb-2 transition-all cursor-pointer bg-transparent border-0 ${
                idx === activeCol ? "border-b-2 border-white text-white font-medium" : "text-white/40 hover:text-white"
              }`}
            >
              {col.name} {col.season}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[600px] overflow-hidden group">
            <img
              src={collectionsList[activeCol].image}
              alt={collectionsList[activeCol].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] filter grayscale"
            />
          </div>
          <div className="space-y-8">
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-2">{collectionsList[activeCol].season}</p>
              <h2 className="text-4xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                {collectionsList[activeCol].name}
              </h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{collectionsList[activeCol].desc}</p>
            <div className="border-t border-white/10 pt-6 space-y-4 text-xs text-white/50">
              <p><strong>Inspiration :</strong> {collectionsList[activeCol].inspiration}</p>
              <p><strong>Volume :</strong> {collectionsList[activeCol].piecesCount}</p>
            </div>
            <Link
              href="/templates/impact-12/boutique"
              className="inline-block border border-white/30 text-white text-xs tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer bg-transparent"
            >
              Découvrir les pièces
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeCol, setActiveCol] = useState(0);

  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-dvh bg-white" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", overflowX: "clip" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[1px] bg-black origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/templates/impact-12"
            className="text-black tracking-[0.3em] text-sm uppercase font-light cursor-pointer"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}
          >
            Noir Couture
          </Link>
          <div className="hidden md:flex items-center gap-10 text-black text-xs tracking-widest uppercase font-light">
            {[
              { name: "Accueil", target: "/templates/impact-12" },
              { name: "Collections", target: "/templates/impact-12/collections" },
              { name: "Editorial", target: "/templates/impact-12/editorial" },
              { name: "Boutique", target: "/templates/impact-12/boutique" },
              { name: "Atelier", target: "/templates/impact-12/atelier" },
              { name: "Contact", target: "/templates/impact-12/contact" }
            ].map(item => (
              <Link
                key={item.name}
                href={item.target}
                className={`hover:opacity-50 transition-opacity cursor-pointer ${item.target === "/templates/impact-12/collections" ? "border-b border-black pb-1" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/templates/impact-12/boutique" className="cursor-pointer hover:opacity-60 transition-opacity relative">
              <ShoppingBag className="w-5 h-5 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
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
            {[
              { name: "Accueil", target: "/templates/impact-12" },
              { name: "Collections", target: "/templates/impact-12/collections" },
              { name: "Editorial", target: "/templates/impact-12/editorial" },
              { name: "Boutique", target: "/templates/impact-12/boutique" },
              { name: "Atelier", target: "/templates/impact-12/atelier" },
              { name: "Contact", target: "/templates/impact-12/contact" }
            ].map((item, i) => (
                <motion.div key={item.name} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link
                    href={item.target}
                    className="block text-white text-3xl font-light mb-6 cursor-pointer tracking-widest uppercase"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CollectionsSubPage activeCol={activeCol} setActiveCol={setActiveCol} />

      <footer className="bg-black py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <p className="text-white text-xl mb-4 tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem" }}>Noir Couture</p>
              <p className="text-white/30 text-sm leading-relaxed">Maison de couture parisienne. Fondée en 1998.</p>
            </div>
            {[
              { title: "Univers", links: [{name: "Collections", target: "/templates/impact-12/collections"}, {name: "Editorial", target: "/templates/impact-12/editorial"}, {name: "Campagnes", target: "/templates/impact-12/collections"}, {name: "Archives", target: "/templates/impact-12/collections"}] },
              { title: "Boutique", links: [{name: "Femme", target: "/templates/impact-12/boutique"}, {name: "Homme", target: "/templates/impact-12/boutique"}, {name: "Accessoires", target: "/templates/impact-12/boutique"}, {name: "Bijoux", target: "/templates/impact-12/boutique"}] },
              { title: "Maison", links: [{name: "L'atelier", target: "/templates/impact-12/atelier"}, {name: "Savoir-faire", target: "/templates/impact-12/atelier"}, {name: "Presse", target: "/templates/impact-12/atelier"}, {name: "Contact", target: "/templates/impact-12/contact"}] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white/50 text-xs tracking-widest uppercase mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                      <li key={l.name}>
                        <Link
                          href={l.target}
                          className="text-white/30 text-sm hover:text-white transition-colors cursor-pointer text-decoration-none"
                        >
                          {l.name}
                        </Link>
                      </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
            <span>© 2026 Noir Couture. Tous droits réservés.</span>
            <div className="flex gap-6">
              <Link
                href="/templates/impact-12/legal"
                className="hover:text-white transition-colors cursor-pointer text-decoration-none"
              >
                Mentions légales
              </Link>
              <button className="cursor-pointer hover:text-white transition-colors"><Instagram className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
