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
  const [cartCount, setCartCount] = useState(0);

  type ActivePage = "home" | "collections" | "editorial" | "boutique" | "atelier" | "contact" | "legal";
  const [page, setPage] = useState<ActivePage>("home");

  const goTo = (p: ActivePage) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", overflowX: "clip" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[1px] bg-black origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a
            href="/templates/impact-12"
            onClick={(e) => { e.preventDefault(); goTo("home"); }}
            className="text-black tracking-[0.3em] text-sm uppercase font-light cursor-pointer"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}
          >
            Noir Couture
          </a>
          <div className="hidden md:flex items-center gap-10 text-black text-xs tracking-widest uppercase font-light">
            {[
              { name: "Accueil", target: "home" },
              { name: "Collections", target: "collections" },
              { name: "Editorial", target: "editorial" },
              { name: "Boutique", target: "boutique" },
              { name: "Atelier", target: "atelier" },
              { name: "Contact", target: "contact" }
            ].map(item => (
              <a
                key={item.name}
                href="/templates/impact-12"
                onClick={(e) => { e.preventDefault(); goTo(item.target as any); }}
                className={`hover:opacity-50 transition-opacity cursor-pointer ${page === item.target ? "border-b border-black pb-1" : ""}`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => goTo("boutique")} className="cursor-pointer hover:opacity-60 transition-opacity relative">
              <ShoppingBag className="w-5 h-5 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
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
            {["Accueil", "Collections", "Editorial", "Boutique", "Atelier", "Contact"].map((item, i) => {
              const target = item === "Accueil" ? "home" : item.toLowerCase();
              return (
                <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <a
                    href="/templates/impact-12"
                    className="block text-white text-3xl font-light mb-6 cursor-pointer tracking-widest uppercase"
                    onClick={(e) => { e.preventDefault(); setMobileOpen(false); goTo(target as any); }}
                  >
                    {item}
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {page === "home" && (
        <>
          {/* Hero — B&W split */}
          <section id="hero" ref={heroRef} className="relative h-screen overflow-hidden pt-20">
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
                    <button onClick={() => goTo("collections")} className="border border-white/30 text-white text-xs tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                      Voir la collection
                    </button>
                  </Reveal>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Collections */}
          <section id="realisations" className="py-24 px-6 bg-black">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="flex items-end justify-between mb-12">
                  <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>Collections</h2>
                  <a href="/templates/impact-12" onClick={(e) => { e.preventDefault(); goTo("collections"); }} className="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                    Voir tout <ChevronRight className="w-3 h-3" />
                  </a>
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
                    <button onClick={() => goTo("collections")} className="flex items-center gap-3 text-white text-xs tracking-widest uppercase hover:gap-5 transition-all cursor-pointer mt-8">
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
                  <a href="/templates/impact-12" onClick={(e) => { e.preventDefault(); goTo("editorial"); }} className="text-black/40 text-xs tracking-widest uppercase hover:text-black transition-colors cursor-pointer">Tout voir</a>
                </div>
              </Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editorials.map((e, i) => (
                  <Reveal key={e.title} delay={i * 0.08}>
                    <div onClick={() => goTo("editorial")} className="relative overflow-hidden group cursor-pointer" style={{ aspectRatio: "3/4" }}>
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
                  <a href="/templates/impact-12" onClick={(e) => { e.preventDefault(); goTo("boutique"); }} className="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors cursor-pointer">Tout voir</a>
                </div>
              </Reveal>
              <div className="grid md:grid-cols-3 gap-6">
                {looks.map((look, i) => (
                  <Reveal key={look.name} delay={i * 0.1}>
                    <div className="group cursor-pointer">
                      <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "3/4" }}>
                        <Image src={look.src} alt={look.name} fill className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                        <button onClick={() => goTo("boutique")} className="absolute bottom-4 left-4 right-4 bg-white text-black text-xs tracking-widest uppercase py-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center gap-2">
                          Voir dans la boutique
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
        </>
      )}

      {page === "collections" && (
        <CollectionsSubPage goTo={goTo} activeCol={activeCollection} setActiveCol={setActiveCollection} />
      )}
      {page === "editorial" && <EditorialSubPage />}
      {page === "boutique" && <BoutiqueSubPage cartCount={cartCount} setCartCount={setCartCount} />}
      {page === "atelier" && <AtelierSubPage goTo={goTo} />}
      {page === "contact" && <ContactSubPage />}
      {page === "legal" && <LegalSubPage />}

      {/* Footer */}
      <footer className="bg-black py-16 px-6 border-t border-white/5">
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
                  {col.links.map(l => {
                    let clickHandler = (e: React.MouseEvent) => e.preventDefault();
                    if (l === "Collections" || l === "Campagnes" || l === "Archives") {
                      clickHandler = (e) => { e.preventDefault(); goTo("collections"); };
                    } else if (l === "Editorial") {
                      clickHandler = (e) => { e.preventDefault(); goTo("editorial"); };
                    } else if (l === "Femme" || l === "Homme" || l === "Accessoires" || l === "Bijoux") {
                      clickHandler = (e) => { e.preventDefault(); goTo("boutique"); };
                    } else if (l === "L'atelier" || l === "Savoir-faire" || l === "Presse") {
                      clickHandler = (e) => { e.preventDefault(); goTo("atelier"); };
                    } else if (l === "Contact") {
                      clickHandler = (e) => { e.preventDefault(); goTo("contact"); };
                    }
                    return (
                      <li key={l}>
                        <a
                          href="/templates/impact-12"
                          onClick={clickHandler}
                          className="text-white/30 text-sm hover:text-white transition-colors cursor-pointer text-decoration-none"
                        >
                          {l}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
            <span>© 2026 Noir Couture. Tous droits réservés.</span>
            <div className="flex gap-6">
              <a
                href="/templates/impact-12"
                onClick={(e) => { e.preventDefault(); goTo("legal"); }}
                className="hover:text-white transition-colors cursor-pointer text-decoration-none"
              >
                Mentions légales
              </a>
              <button className="cursor-pointer hover:text-white transition-colors"><Instagram className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-PAGE COMPONENTS (FRENCH)
   ───────────────────────────────────────────── */

function CollectionsSubPage({ goTo, activeCol, setActiveCol }: { goTo: (p: any) => void; activeCol: number; setActiveCol: (i: number) => void }) {
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
    <section className="py-32 px-6 bg-black text-white min-h-screen">
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
            <button
              onClick={() => goTo("boutique")}
              className="border border-white/30 text-white text-xs tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer bg-transparent"
            >
              Découvrir les pièces
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorialSubPage() {
  const editorialItems = [
    { title: "La nuit appartient aux audacieuses", category: "Editorial / SS 2026", src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", text: "Une campagne photographiée à minuit dans les rues désertes du Quartier Latin. Une célébration de la silhouette structurée sous la lumière artificielle des lampadaires parisiens." },
    { title: "Silences et structures", category: "Fashion / AW 2025", src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", text: "L'art de sculpter le vide. Ce projet explore la tension entre le corps et le tissu rigide, créant des drapés volumineux et géométriques." },
    { title: "L'héritage revisité", category: "Interview", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", text: "Entretien exclusif avec notre directeur artistique sur l'importance du noir absolu dans la garde-robe moderne et le refus des tendances éphémères." },
    { title: "Noir absolu, texture absolue", category: "Campaign", src: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?w=800&q=80", text: "Macro-photographie de matières premières : laines bouillies, cuirs de veau pleine fleur patinés, et organza de soie brut. La matière comme origine du dessin." },
  ];

  return (
    <section className="py-32 px-6 bg-white text-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-black/40 text-xs tracking-widest uppercase mb-4">Editorial</p>
          <h1 className="text-5xl md:text-7xl font-light mb-16" style={{ fontFamily: "'Playfair Display', serif" }}>
            Récits & <em>Visions</em>
          </h1>
        </Reveal>

        <div className="space-y-24">
          {editorialItems.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.1}>
              <div className={`grid md:grid-cols-12 gap-12 items-center ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className={`md:col-span-7 relative h-[500px] overflow-hidden ${idx % 2 === 1 ? "md:order-last" : ""}`}>
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-[1.2s]"
                  />
                </div>
                <div className="md:col-span-5 space-y-6">
                  <p className="text-black/40 text-xs uppercase tracking-widest">{item.category}</p>
                  <h2 className="text-3xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.title}
                  </h2>
                  <p className="text-black/60 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BoutiqueSubPage({ cartCount, setCartCount }: { cartCount: number; setCartCount: React.Dispatch<React.SetStateAction<number>> }) {
  const shopItems = [
    { name: "Manteau Asymétrique", price: "2 400€", category: "Prêt-à-porter", src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80", desc: "Coupe décontractée asymétrique en laine bouillie italienne. Entièrement doublé soie." },
    { name: "Robe Colonne", price: "1 800€", category: "Prêt-à-porter", src: "https://images.unsplash.com/photo-1566479179817-e4067b2c1a83?w=600&q=80", desc: "Robe longue en crêpe de soie noir mat. Dos nu architectural et fente latérale." },
    { name: "Tailleur Structuré", price: "3 200€", category: "Prêt-à-porter", src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", desc: "Veste épaulée à double boutonnage et pantalon droit assorti en laine vierge." },
    { name: "Sac Seau en Cuir", price: "1 200€", category: "Accessoires", src: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80", desc: "Cuir de veau tannage végétal noir profond. Détails métalliques gravés Noir Couture." },
    { name: "Veste Couture Déstructurée", price: "2 900€", category: "Prêt-à-porter", src: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?w=600&q=80", desc: "Veste d'atelier déstructurée en cachemire mélangé noir charbon." },
    { name: "Pantalon Fluide Noir", price: "950€", category: "Prêt-à-porter", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", desc: "Pantalon ample fluide en satin de soie. Ceinture ajustable intégrée." }
  ];

  const [filter, setFilter] = useState("Tout");
  const filteredItems = filter === "Tout" ? shopItems : shopItems.filter(item => item.category === filter);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleAddToCart = (name: string) => {
    setCartCount(prev => prev + 1);
    setAddedItem(name);
    setTimeout(() => {
      setAddedItem(null);
    }, 2000);
  };

  return (
    <section className="py-32 px-6 bg-[#0A0A0A] text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">La Boutique</p>
              <h1 className="text-5xl md:text-7xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                Les <em>Pièces</em>
              </h1>
            </div>
            <div className="flex gap-6 mt-8 md:mt-0 border-b border-white/10 pb-2">
              {["Tout", "Prêt-à-porter", "Accessoires"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-xs tracking-widest uppercase transition-all cursor-pointer bg-transparent border-0 pb-1 ${
                    filter === cat ? "text-white font-bold border-b-2 border-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {addedItem && (
          <div className="fixed top-24 right-6 bg-white text-black text-xs tracking-widest uppercase py-3 px-6 z-50 shadow-xl border border-black/10 transition-all duration-300">
            ✓ {addedItem} ajouté au panier
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {filteredItems.map((look, i) => (
            <Reveal key={look.name} delay={i * 0.08}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={look.src}
                    alt={look.name}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => handleAddToCart(look.name)}
                    className="absolute bottom-4 left-4 right-4 bg-white text-black text-xs tracking-widest uppercase py-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center gap-2 border-0"
                  >
                    Ajouter au panier
                  </button>
                </div>
                <h3 className="text-white text-sm mb-1">{look.name}</h3>
                <p className="text-white/40 text-xs mb-2 italic">{look.desc}</p>
                <p className="text-white/80 text-sm font-medium">{look.price}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AtelierSubPage({ goTo }: { goTo: (p: any) => void }) {
  return (
    <section id="about" className="py-32 px-6 bg-white text-black min-h-screen">
      <div className="max-w-5xl mx-auto space-y-16">
        <Reveal>
          <div className="text-center space-y-4">
            <p className="text-black/40 text-xs tracking-widest uppercase">L'Atelier</p>
            <h1 className="text-5xl md:text-7xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
              Savoir-Faire & <em>Rigueur</em>
            </h1>
            <p className="text-black/50 text-sm max-w-xl mx-auto leading-relaxed">
              Dans le secret de notre atelier de la place Vendôme, nos artisans façonnent des pièces uniques qui unissent tradition et innovation technique.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[450px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"
              alt="Atelier couture"
              className="w-full h-full object-cover filter grayscale"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
              L'Art du Sur-Mesure
            </h2>
            <p className="text-black/60 text-sm leading-relaxed">
              Fondée en 1998, Noir Couture perpétue la haute tradition tailleur parisienne. Chaque silhouette sur-mesure nécessite plus de 120 heures de travail manuel. Nous collaborons directement avec les tisseurs les plus prestigieux de Lyon et d'Italie du Nord pour créer des toiles et des étoffes exclusives.
            </p>
            <div className="border-l-2 border-black/20 pl-4 space-y-2 text-xs text-black/50">
              <p><strong>Bâtissage :</strong> Réalisé entièrement au fil de coton naturel pour ajuster les volumes sur le mannequin d'atelier.</p>
              <p><strong>Finitions :</strong> Boutonnières à la main en fil de soie ciré.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 pt-16 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-light mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Le Dessin Originel</h3>
            <p className="text-black/60 text-xs leading-relaxed">
              Tout commence par un croquis à l'encre noire, jeté sur le papier à l'atelier. C'est l'essence géométrique du vêtement, libérée de toute fioriture superflue.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-light mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>La Coupe Rigoureuse</h3>
            <p className="text-black/60 text-xs leading-relaxed">
              Le patronage d'une veste Noir Couture respecte des règles géométriques très strictes. L'asymétrie est calculée pour équilibrer parfaitement les épaules et affiner la silhouette.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-light mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Les Essayages</h3>
            <p className="text-black/60 text-xs leading-relaxed">
              Dans notre salon privé, nos couturiers procèdent à trois essayages successifs sur toile avant de couper l'étoffe définitive, garantissant un tombé absolument irréprochable.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => goTo("contact")}
            className="bg-black text-white text-xs tracking-widest uppercase px-10 py-5 hover:bg-black/80 transition-all cursor-pointer border-0"
          >
            Prendre rendez-vous pour un sur-mesure
          </button>
        </div>
      </div>
    </section>
  );
}

function ContactSubPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="py-32 px-6 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-16 space-y-4">
            <p className="text-white/40 text-xs tracking-widest uppercase">Contact & Rendez-Vous</p>
            <h1 className="text-5xl md:text-7xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
              Le <em>Showroom</em>
            </h1>
            <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
              Notre salon privé de la Place Vendôme vous accueille exclusivement sur rendez-vous pour la présentation des collections et les essayages de haute couture.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-8 text-sm text-white/60">
            <div className="space-y-2">
              <h3 className="text-white text-xs tracking-widest uppercase">Showroom Vendôme</h3>
              <p>18 Place Vendôme, 75001 Paris</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white text-xs tracking-widest uppercase">Horaires</h3>
              <p>Du lundi au samedi — de 10h à 19h</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white text-xs tracking-widest uppercase">Téléphone</h3>
              <p>+33 1 42 60 00 00</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white text-xs tracking-widest uppercase">Email</h3>
              <p>showroom@noir-couture.com</p>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#0A0A0A] border border-white/10 p-8 rounded-lg">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <h3 className="text-xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>Demande Transmise</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Votre demande de rendez-vous a bien été reçue. Un membre de la maison vous contactera sous 24 heures pour confirmer le créneau.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Nom"
                      className="w-full bg-[#121212] border border-white/10 text-white p-3 text-xs outline-none focus:border-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="votre@email.com"
                      className="w-full bg-[#121212] border border-white/10 text-white p-3 text-xs outline-none focus:border-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Date souhaitée</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-[#121212] border border-white/10 text-white p-3 text-xs outline-none focus:border-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Service</label>
                    <select
                      className="w-full bg-[#121212] border border-white/10 text-white p-3 text-xs outline-none focus:border-white transition-all"
                    >
                      <option>Présentation Collection SS 2026</option>
                      <option>Essayage Haute Couture</option>
                      <option>Sur-Mesure Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Précisez ici vos attentes ou demandes particulières..."
                    className="w-full bg-[#121212] border border-white/10 text-white p-3 text-xs outline-none focus:border-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black text-xs tracking-widest uppercase py-4 font-bold hover:bg-white/80 transition-colors cursor-pointer border-0"
                >
                  Demander un rendez-vous privé
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LegalSubPage() {
  return (
    <section id="contact" className="py-32 px-6 bg-white text-black min-h-screen">
      <div className="max-w-3xl mx-auto space-y-8" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <h1 className="text-4xl font-light mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          Mentions <em>Légales</em>
        </h1>
        
        <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-lg space-y-6 text-sm text-neutral-600 leading-relaxed">
          <div>
            <h3 className="text-black font-semibold text-base mb-2">Éditeur du site</h3>
            <p>
              Le site Noir Couture est édité par :<br />
              <strong>Aevia WS — Valentin Milliand</strong><br />
              Entrepreneur individuel — SIREN : 852 546 225 — RCS Bourg-en-Bresse<br />
              <strong>Contact :</strong> contact@aevia.io<br />
              <strong>Adresse physique :</strong> communiquée sur demande.
            </p>
          </div>

          <div>
            <h3 className="text-black font-semibold text-base mb-2">Hébergement</h3>
            <p>
              Le site est hébergé par :<br />
              <strong>Vercel Inc.</strong><br />
              650 2nd St, San Francisco, CA 94107, USA.<br />
              Site internet : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline">vercel.com</a>
            </p>
          </div>

          <div>
            <h3 className="text-black font-semibold text-base mb-2">Propriété intellectuelle</h3>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </div>

          <div>
            <h3 className="text-black font-semibold text-base mb-2">Données personnelles</h3>
            <p>
              Conformément à la réglementation sur la protection des données personnelles (RGPD), vous disposez d'un droit d'accès, de rectification et d'opposition aux données vous concernant. Vous pouvez exercer ce droit en nous écrivant à contact@aevia.io.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
