"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

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

export default function MontresPage() {
  useFonts();
  const [activeModel, setActiveModel] = useState(0);

  const watchModels = [
    {
      name: "Calibre Tourbillon I",
      movement: "Manufacture LM-01",
      reserve: "72h",
      complications: "Tourbillon, grande date",
      price: "68 000€",
      year: "2024",
      limited: true,
      category: "Complications",
      desc: "L'expression ultime de la précision mécanique. Le tourbillon compense les effets de la gravité terrestre sur l'échappement, offrant une régularité chronométrique exceptionnelle.",
      details: "Boîtier en or rose 18k de 41mm. Cadran en émail grand feu noir. Fond saphir transparent révélant les ponts anglés à la main.",
    },
    {
      name: "Chronographe Rattrapante",
      movement: "Manufacture LM-07",
      reserve: "48h",
      complications: "Chronographe, rattrapante",
      price: "38 500€",
      year: "2023",
      limited: false,
      category: "Chronographes",
      desc: "Une complication reine pour mesurer les temps intermédiaires. Le double aiguillage permet de mesurer deux événements simultanés.",
      details: "Boîtier en acier chirurgical 316L satiné. Cadran noir mat avec aiguilles rattrapante dorée. Roue à colonnes visible.",
    },
    {
      name: "Perpétuel Calendrier",
      movement: "Manufacture LM-14",
      reserve: "80h",
      complications: "Calendrier perpétuel, phases de lune",
      price: "52 000€",
      year: "2025",
      limited: true,
      category: "Complications",
      desc: "Le temps astronomique au poignet. Conçu pour afficher la date exacte en tenant compte automatiquement de la durée des mois et des années bissextiles jusqu'en 2100.",
      details: "Boîtier en platine 950 de 40mm. Indicateur des phases de lune en aventurine. Masse oscillante en or 22 carats.",
    },
    {
      name: "Classique Trois Aiguilles",
      movement: "Manufacture LM-03",
      reserve: "60h",
      complications: "Heures, minutes, secondes",
      price: "18 000€",
      year: "2025",
      limited: false,
      category: "Classique",
      desc: "La pureté absolue de la mesure du temps. Une lisibilité parfaite, débarrassée du superflu pour se concentrer sur l'essentiel.",
      details: "Boîtier en or blanc 18k, cadran guilloché main argenté, aiguilles en acier bleui à la flamme.",
    }
  ];

  const [filter, setFilter] = useState("Tout");
  const filteredList = filter === "Tout" ? watchModels : watchModels.filter(m => m.category === filter);

  return (
    <div className="min-h-dvh bg-[#0C0B09]" style={{ fontFamily: "'Jost', sans-serif", overflowX: "clip" }}>
      <Navbar />
      <section className="py-32 px-6 bg-[#0C0B09] text-white min-h-dvh">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <p className="text-[#B49A6A] text-xs tracking-widest uppercase mb-4">Le Catalogue</p>
                <h1 className="text-5xl md:text-7xl font-light" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Nos <em>Garde-Temps</em>
                </h1>
              </div>
              <div className="flex gap-4 mt-8 md:mt-0 border-b border-white/10 pb-2">
                {["Tout", "Complications", "Chronographes", "Classique"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`text-xs tracking-widest uppercase bg-transparent border-0 cursor-pointer pb-1 ${
                      filter === cat ? "text-[#B49A6A] font-bold border-b-2 border-[#B49A6A]" : "text-white/40 hover:text-[#B49A6A]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="relative h-[480px] bg-[#181610] rounded-2xl overflow-hidden border border-[#B49A6A]/20">
                <Image src="https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800&q=80" alt={watchModels[activeModel].name} fill className="object-cover opacity-80" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {watchModels.map((m, idx) => (
                  <button
                    key={m.name}
                    onClick={() => setActiveModel(idx)}
                    className={`relative h-20 bg-[#141310] rounded-lg overflow-hidden border cursor-pointer ${
                      idx === activeModel ? "border-[#B49A6A]" : "border-white/10"
                    }`}
                  >
                    <Image src="https://images.unsplash.com/photo-1619134778706-7015533a6150?w=200&q=80" alt={m.name} fill className="object-cover opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-[#B49A6A] text-xs tracking-widest uppercase">{watchModels[activeModel].movement}</span>
                <h2 className="text-4xl font-light mt-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>{watchModels[activeModel].name}</h2>
                <p className="text-2xl text-[#B49A6A] font-light mt-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>{watchModels[activeModel].price}</p>
              </div>

              <p className="text-white/60 text-sm leading-relaxed">{watchModels[activeModel].desc}</p>
              <p className="text-white/60 text-xs italic">{watchModels[activeModel].details}</p>

              <div className="border-t border-[#B49A6A]/20 pt-6 space-y-3 text-xs text-white/40">
                <div className="flex justify-between"><span>Complications :</span><span className="text-white">{watchModels[activeModel].complications}</span></div>
                <div className="flex justify-between"><span>Réserve de marche :</span><span className="text-white">{watchModels[activeModel].reserve}</span></div>
                <div className="flex justify-between"><span>Millésime :</span><span className="text-white">{watchModels[activeModel].year}</span></div>
                <div className="flex justify-between"><span>Édition :</span><span className="text-white">{watchModels[activeModel].limited ? "Édition Limitée" : "Série Standard"}</span></div>
              </div>

              <Link
                href="/templates/impact-13/contact"
                className="inline-block text-center w-full bg-[#B49A6A] text-[#0C0B09] px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#A08A5E] transition-colors cursor-pointer rounded-lg border-0 font-medium text-decoration-none"
              >
                Demander une présentation privée
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
