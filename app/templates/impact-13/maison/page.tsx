"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("am-fonts")) return;
    const s = document.createElement("style");
    s.id = "am-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap');`;
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

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0C0B09]/90 backdrop-blur-md border border-[#B49A6A]/20 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/templates/impact-13" className="text-[#B49A6A] tracking-widest text-sm cursor-pointer text-decoration-none" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1rem" }}>
            Atelier Mécanique
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/50 text-xs tracking-widest uppercase">
            {[
              { name: "Accueil", target: "/templates/impact-13" },
              { name: "Montres", target: "/templates/impact-13/montres" },
              { name: "Manufacture", target: "/templates/impact-13/manufacture" },
              { name: "Maison", target: "/templates/impact-13/maison" },
              { name: "Contact", target: "/templates/impact-13/contact" }
            ].map(item => (
              <Link key={item.name} href={item.target} className="hover:text-[#B49A6A] transition-colors cursor-pointer text-decoration-none">
                {item.name}
              </Link>
            ))}
          </div>
          <Link href="/templates/impact-13/montres" className="hidden md:inline-flex border border-[#B49A6A]/40 text-[#B49A6A] text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#B49A6A] hover:text-[#0C0B09] transition-all cursor-pointer rounded-lg bg-transparent text-decoration-none">
            Catalogue
          </Link>
          <button className="md:hidden text-white cursor-pointer bg-transparent border-0" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#0C0B09] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#B49A6A] text-xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>Atelier Mécanique</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer bg-transparent border-0"><X className="w-6 h-6 text-white" /></button>
            </div>
            {[
              { name: "Accueil", target: "/templates/impact-13" },
              { name: "Montres", target: "/templates/impact-13/montres" },
              { name: "Manufacture", target: "/templates/impact-13/manufacture" },
              { name: "Maison", target: "/templates/impact-13/maison" },
              { name: "Contact", target: "/templates/impact-13/contact" }
            ].map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href={item.target} className="block text-white text-3xl mb-6 cursor-pointer text-decoration-none" style={{ fontFamily: "'Libre Baskerville', serif" }} onClick={() => setMobileOpen(false)}>
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-[#080807] border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
        <div>
          <p className="text-[#B49A6A] text-lg mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>Atelier Mécanique</p>
          <p className="text-white/30 text-sm leading-relaxed">Manufacture horlogère. Place Vendôme, Paris — Depuis 1887.</p>
        </div>
        {[
          { title: "Montres", links: [{ name: "Tourbillons", url: "/templates/impact-13/montres" }, { name: "Chronographes", url: "/templates/impact-13/montres" }, { name: "Calendriers", url: "/templates/impact-13/montres" }, { name: "Éditions limitées", url: "/templates/impact-13/montres" }] },
          { title: "Maison", links: [{ name: "L'histoire", url: "/templates/impact-13/maison" }, { name: "La manufacture", url: "/templates/impact-13/manufacture" }, { name: "Nos horlogers", url: "/templates/impact-13/manufacture" }, { name: "Presse", url: "/templates/impact-13/maison" }] },
          { title: "Services", links: [{ name: "SAV & Révision", url: "/templates/impact-13/contact" }, { name: "Certification", url: "/templates/impact-13/contact" }, { name: "Showroom", url: "/templates/impact-13/contact" }, { name: "Commande sur mesure", url: "/templates/impact-13/contact" }] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="text-white/40 text-xs tracking-widest uppercase mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(l => (
                <li key={l.name}>
                  <Link href={l.url} className="text-white/30 text-sm hover:text-[#B49A6A] transition-colors cursor-pointer text-decoration-none">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto border-t border-white/5 mt-10 pt-8 flex justify-between items-center text-xs text-white/20">
        <span>© 2026 Atelier Mécanique. Tous droits réservés.</span>
        <Link href="/templates/impact-13/legal" className="hover:text-[#B49A6A] transition-colors cursor-pointer text-decoration-none">
          Mentions légales
        </Link>
      </div>
    </footer>
  );
}

export default function MaisonPage() {
  useFonts();

  const historyTimeline = [
    { year: "1887", title: "Fondation", desc: "Edouard Lecomte ouvre son premier atelier à Genève, se spécialisant dans la réparation de chronomètres de poche de haute précision." },
    { year: "1923", title: "Le premier Tourbillon", desc: "Création et brevet du premier mouvement tourbillon maison, salué par les observatoires astronomiques de Genève et de kkew pour sa régularité de marche." },
    { year: "1961", title: "Collection Heritage", desc: "Lancement d'une gamme de garde-temps au design intemporel, marquant le début de l'exportation internationale de la marque." },
    { year: "1998", title: "Installation dans la Vallée", desc: "Rachat d'une ancienne ferme horlogère à La Vallée de Joux, regroupant l'ensemble de nos ateliers de création, de décoration et d'assemblage sous le même toit." },
    { year: "2019", title: "Le Titane Grade 5", desc: "Innovation technologique majeure avec un modèle entièrement squelette en titane microbillé pesant moins de 32 grammes." },
  ];

  return (
    <div className="min-h-screen bg-[#0C0B09]" style={{ fontFamily: "'Jost', sans-serif", overflowX: "clip" }}>
      <Navbar />
      <section className="py-32 px-6 bg-[#0C0B09] text-white min-h-screen">
        <div className="max-w-4xl mx-auto space-y-16">
          <Reveal>
            <div className="text-center space-y-4">
              <p className="text-[#B49A6A] text-xs tracking-widest uppercase">Notre Histoire</p>
              <h1 className="text-5xl md:text-7xl font-light" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                137 ans d'<em>Héritage</em>
              </h1>
              <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                Découvrez les jalons historiques d'une maison horlogère familiale qui a su préserver son indépendance créative et son obsession de la précision mécanique.
              </p>
            </div>
          </Reveal>

          <div className="space-y-12">
            {historyTimeline.map((item, idx) => (
              <Reveal key={item.year} delay={idx * 0.08}>
                <div className="flex gap-8 py-8 border-b border-white/10 items-start">
                  <span className="text-[#B49A6A] text-3xl font-light shrink-0 w-24" style={{ fontFamily: "'Libre Baskerville', serif" }}>{item.year}</span>
                  <div className="space-y-2">
                    <h3 className="text-white text-lg font-medium">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
