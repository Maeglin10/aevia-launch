"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, ChevronRight, Clock, MapPin, Phone, Mail, Award, Settings } from "lucide-react";

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

const models = [
  { name: "Calibre Tourbillon I", movement: "Manufacture LM-01", reserve: "72h", complications: "Tourbillon, grande date", price: "68 000€", year: "2024", limited: true },
  { name: "Chronographe Rattrapante", movement: "Manufacture LM-07", reserve: "48h", complications: "Chronographe, rattrapante", price: "38 500€", year: "2023", limited: false },
  { name: "Perpétuel Calendrier", movement: "Manufacture LM-14", reserve: "80h", complications: "Calendrier perpétuel, phases de lune", price: "52 000€", year: "2025", limited: true },
];

const collections = ["Manufacture", "Heritage", "Complications", "Métiers d'Art"];

const savoirFaire = [
  { title: "Finition anglée", desc: "Chaque angle biseauté et poli à la main par nos maîtres horlogers. Une exigence héritée des grandes traditions horlogères suisses." },
  { title: "Cadran guilloché", desc: "Motifs guilloché réalisés sur machines à guillocher d'époque, offrant une profondeur de lumière incomparable." },
  { title: "Mouvement manufacture", desc: "100% de nos mouvements sont conçus, assemblés et réglés dans notre manufacture de La Vallée de Joux." },
];

const timeline = [
  { year: "1887", event: "Fondation par Édouard Lecomte à Genève" },
  { year: "1923", event: "Premier tourbillon maison breveté" },
  { year: "1961", event: "Lancement de la collection Heritage" },
  { year: "1998", event: "Acquisition de la manufacture de La Vallée de Joux" },
  { year: "2019", event: "Première montre entièrement en titane Grade 5" },
];

export default function AtelierMecaniquePage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeModel, setActiveModel] = useState(0);
  const [activeCollection, setActiveCollection] = useState(0);

  type ActivePage = "home" | "montres" | "manufacture" | "maison" | "contact" | "legal";
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
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0C0B09]" style={{ fontFamily: "'Jost', sans-serif", overflowX: "clip" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#B49A6A] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0C0B09]/90 backdrop-blur-md border border-[#B49A6A]/20 rounded-2xl px-6 py-4 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); goTo("home"); }}
            className="text-[#B49A6A] tracking-widest text-sm cursor-pointer text-decoration-none"
            style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1rem" }}
          >
            Atelier Mécanique
          </a>
          <div className="hidden md:flex items-center gap-8 text-white/50 text-xs tracking-widest uppercase">
            {[
              { name: "Accueil", target: "home" },
              { name: "Montres", target: "montres" },
              { name: "Manufacture", target: "manufacture" },
              { name: "Maison", target: "maison" },
              { name: "Contact", target: "contact" }
            ].map(item => (
              <a
                key={item.name}
                href="#"
                onClick={(e) => { e.preventDefault(); goTo(item.target as any); }}
                className={`hover:text-[#B49A6A] transition-colors cursor-pointer text-decoration-none ${
                  page === item.target ? "text-[#B49A6A]" : ""
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <button
            onClick={() => goTo("montres")}
            className="hidden md:inline-flex border border-[#B49A6A]/40 text-[#B49A6A] text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#B49A6A] hover:text-[#0C0B09] transition-all cursor-pointer rounded-lg bg-transparent"
          >
            Catalogue
          </button>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#0C0B09] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#B49A6A] text-xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>Atelier Mécanique</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer bg-transparent border-0"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Accueil", "Montres", "Manufacture", "Maison", "Contact"].map((item, i) => {
              const target = item === "Accueil" ? "home" : item.toLowerCase();
              return (
                <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <a
                    href="#"
                    className="block text-white text-3xl mb-6 cursor-pointer text-decoration-none"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
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
          {/* Hero */}
          <section id="hero" ref={heroRef} className="relative h-screen overflow-hidden">
            <motion.div className="absolute inset-0" style={{ y: heroY }}>
              <Image src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1600&q=85" alt="Atelier Mécanique — Horlogerie de prestige" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0C0B09]/90 via-[#0C0B09]/50 to-transparent" />
            </motion.div>
            <motion.div className="relative z-10 h-full flex items-center px-6" style={{ opacity: heroOpacity }}>
              <div className="max-w-6xl mx-auto w-full">
                <Reveal>
                  <p className="text-[#B49A6A] text-xs tracking-widest uppercase mb-6">Manufacture horlogère · Depuis 1887</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="text-white text-6xl md:text-8xl leading-none mb-8" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>
                    L'art du<br /><em>mouvement</em>
                  </h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-white/60 text-lg max-w-md leading-relaxed mb-10">
                    Chaque montre est une œuvre de précision. Assemblée à la main par nos maîtres horlogers dans notre manufacture de La Vallée de Joux.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex gap-4">
                    <button onClick={() => goTo("montres")} className="bg-[#B49A6A] text-[#0C0B09] px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#A08A5E] transition-colors cursor-pointer rounded-lg border-0">
                      Découvrir les montres
                    </button>
                    <button onClick={() => goTo("manufacture")} className="border border-white/20 text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-white/10 transition-colors cursor-pointer rounded-lg bg-transparent">
                      Visite manufacture
                    </button>
                  </div>
                </Reveal>
              </div>
            </motion.div>
          </section>

          {/* Stats */}
          <section className="py-12 bg-[#B49A6A]">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
              {[["137", "Ans d'histoire"], ["100%", "Manufacture"], ["72h", "Réserve max."], ["500", "Pièces / an"]].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-[#0C0B09] text-3xl font-light mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{n}</p>
                  <p className="text-[#0C0B09]/60 text-xs tracking-widest uppercase">{l}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Collections tab */}
          <section id="realisations" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="mb-12">
                  <p className="text-[#B49A6A] text-xs tracking-widest uppercase mb-3">Collections</p>
                  <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>Nos garde-temps</h2>
                </div>
              </Reveal>
              <div className="flex gap-3 mb-8 flex-wrap">
                {collections.map((c, i) => (
                  <button key={c} onClick={() => setActiveCollection(i)} className={`px-5 py-2.5 text-xs tracking-widest uppercase transition-all cursor-pointer border rounded-lg bg-transparent ${i === activeCollection ? "bg-[#B49A6A] text-[#0C0B09] border-[#B49A6A]" : "border-white/10 text-white/40 hover:border-[#B49A6A]/40"}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {models.map((m, i) => (
                  <Reveal key={m.name} delay={i * 0.1}>
                    <div onClick={() => { setActiveModel(i); goTo("montres"); }} className={`bg-[#111009] border rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-[#B49A6A]/40 ${i === activeModel ? "border-[#B49A6A]/50" : "border-white/10"}`}>
                      <div className="relative h-48 bg-[#181610]">
                        <Image src="https://images.unsplash.com/photo-1619134778706-7015533a6150?w=500&q=80" alt={m.name} fill className="object-cover opacity-70" />
                        {m.limited && (
                          <div className="absolute top-3 right-3 bg-[#B49A6A] text-[#0C0B09] text-xs px-2.5 py-1 tracking-widest uppercase">
                            Édition Limitée
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-white text-lg mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{m.name}</h3>
                        <p className="text-[#B49A6A] text-xs tracking-widest mb-4">{m.movement}</p>
                        <div className="space-y-2 text-xs text-white/40 mb-6">
                          <div className="flex justify-between"><span>Réserve de marche</span><span className="text-white/70">{m.reserve}</span></div>
                          <div className="flex justify-between"><span>Complications</span><span className="text-white/70 text-right max-w-[120px]">{m.complications}</span></div>
                          <div className="flex justify-between"><span>Millésime</span><span className="text-white/70">{m.year}</span></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#B49A6A] text-xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>{m.price}</span>
                          <button className="flex items-center gap-1 text-white/40 text-xs hover:text-[#B49A6A] transition-colors cursor-pointer bg-transparent border-0">
                            Découvrir <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Savoir-faire */}
          <section className="py-24 px-6 bg-[#0F0E0C]">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div className="relative h-[500px] rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800&q=80" alt="Savoir-faire horloger" fill className="object-cover" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div>
                  <p className="text-[#B49A6A] text-xs tracking-widest uppercase mb-4">Manufacture</p>
                  <h2 className="text-white text-4xl md:text-5xl mb-8" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>
                    L'excellence<br /><em>du geste</em>
                  </h2>
                  <div className="space-y-6">
                    {savoirFaire.map((sf, i) => (
                      <div key={sf.title} className="border-l-2 border-[#B49A6A]/30 pl-5">
                        <h3 className="text-white font-medium text-sm mb-2">{sf.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed">{sf.desc}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => goTo("manufacture")} className="flex items-center gap-2 text-[#B49A6A] text-xs tracking-widest uppercase mt-10 hover:gap-4 transition-all cursor-pointer bg-transparent border-0">
                    Visiter la manufacture <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <Reveal className="mb-12">
                <p className="text-[#B49A6A] text-xs tracking-widest uppercase mb-3">Histoire</p>
                <h2 className="text-white text-4xl" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>137 ans d'héritage</h2>
              </Reveal>
              <div className="space-y-0">
                {timeline.map((t, i) => (
                  <Reveal key={t.year} delay={i * 0.08}>
                    <div onClick={() => goTo("maison")} className="flex gap-8 py-6 border-b border-white/10 group cursor-pointer">
                      <span className="text-[#B49A6A] text-xl shrink-0 w-16" style={{ fontFamily: "'Libre Baskerville', serif" }}>{t.year}</span>
                      <p className="text-white/60 group-hover:text-white transition-colors text-sm leading-relaxed">{t.event}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="py-24 px-6 bg-[#0F0E0C]">
            <div className="max-w-4xl mx-auto">
              <Reveal>
                <div className="bg-[#141310] border border-[#B49A6A]/20 rounded-3xl p-10 md:p-16">
                  <p className="text-[#B49A6A] text-xs tracking-widest uppercase mb-6">Contact & Showroom</p>
                  <h2 className="text-white text-4xl mb-8" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>
                    Rencontrez nos<br />horlogers
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { icon: <MapPin className="w-4 h-4" />, label: "Showroom Paris", value: "18 Place Vendôme, 75001" },
                      { icon: <Phone className="w-4 h-4" />, label: "Téléphone", value: "+33 1 42 60 00 00" },
                      { icon: <Clock className="w-4 h-4" />, label: "Horaires", value: "Lun–Sam 10h–19h" },
                    ].map(c => (
                      <div key={c.label}>
                        <div className="flex items-center gap-2 text-[#B49A6A] mb-2">{c.icon}<span className="text-xs tracking-widest uppercase">{c.label}</span></div>
                        <p className="text-white/60 text-sm">{c.value}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => goTo("contact")} className="mt-10 bg-[#B49A6A] text-[#0C0B09] px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#A08A5E] transition-colors cursor-pointer rounded-lg border-0">
                    Prendre rendez-vous
                  </button>
                </div>
              </Reveal>
            </div>
          </section>
        </>
      )}

      {page === "montres" && (
        <MontresSubPage goTo={goTo} activeModel={activeModel} setActiveModel={setActiveModel} />
      )}
      {page === "manufacture" && <ManufactureSubPage goTo={goTo} />}
      {page === "maison" && <MaisonSubPage />}
      {page === "contact" && <ContactSubPage />}
      {page === "legal" && <LegalSubPage />}

      {/* Footer */}
      <footer className="bg-[#080807] border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <p className="text-[#B49A6A] text-lg mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>Atelier Mécanique</p>
            <p className="text-white/30 text-sm leading-relaxed">Manufacture horlogère. Place Vendôme, Paris — Depuis 1887.</p>
          </div>
          {[
            { title: "Montres", links: ["Tourbillons", "Chronographes", "Calendriers", "Éditions limitées"] },
            { title: "Maison", links: ["L'histoire", "La manufacture", "Nos horlogers", "Presse"] },
            { title: "Services", links: ["SAV & Révision", "Certification", "Showroom", "Commande sur mesure"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white/40 text-xs tracking-widest uppercase mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => {
                  let clickHandler = (e: React.MouseEvent) => e.preventDefault();
                  if (col.title === "Montres") {
                    clickHandler = (e) => { e.preventDefault(); goTo("montres"); };
                  } else if (l === "L'histoire" || l === "Presse") {
                    clickHandler = (e) => { e.preventDefault(); goTo("maison"); };
                  } else if (l === "La manufacture" || l === "Nos horlogers") {
                    clickHandler = (e) => { e.preventDefault(); goTo("manufacture"); };
                  } else if (col.title === "Services") {
                    clickHandler = (e) => { e.preventDefault(); goTo("contact"); };
                  }
                  return (
                    <li key={l}>
                      <a
                        href="#"
                        onClick={clickHandler}
                        className="text-white/30 text-sm hover:text-[#B49A6A] transition-colors cursor-pointer text-decoration-none"
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
        <div className="max-w-6xl mx-auto border-t border-white/5 mt-10 pt-8 flex justify-between items-center text-xs text-white/20">
          <span>© 2026 Atelier Mécanique. Tous droits réservés.</span>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); goTo("legal"); }}
            className="hover:text-[#B49A6A] transition-colors cursor-pointer text-decoration-none"
          >
            Mentions légales
          </a>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-PAGE COMPONENTS (FRENCH)
   ───────────────────────────────────────────── */

function MontresSubPage({ goTo, activeModel, setActiveModel }: { goTo: (p: any) => void; activeModel: number; setActiveModel: (i: number) => void }) {
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
    <section className="py-32 px-6 bg-[#0C0B09] text-white min-h-screen">
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

            <button
              onClick={() => goTo("contact")}
              className="w-full bg-[#B49A6A] text-[#0C0B09] px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#A08A5E] transition-colors cursor-pointer rounded-lg border-0 font-medium"
            >
              Demander une présentation privée
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManufactureSubPage({ goTo }: { goTo: (p: any) => void }) {
  return (
    <section id="about" className="py-32 px-6 bg-[#0F0E0C] text-white min-h-screen">
      <div className="max-w-5xl mx-auto space-y-16">
        <Reveal>
          <div className="text-center space-y-4">
            <p className="text-[#B49A6A] text-xs tracking-widest uppercase">La Manufacture</p>
            <h1 className="text-5xl md:text-7xl font-light" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              L'excellence du <em>Geste</em>
            </h1>
            <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
              Située au cœur de La Vallée de Joux, berceau de la haute horlogerie suisse, notre manufacture abrite nos maîtres horlogers qui assemblent chaque mouvement à la main.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[450px] rounded-2xl overflow-hidden border border-[#B49A6A]/20">
            <Image src="https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800&q=80" alt="Horloger au travail" fill className="object-cover" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-light" style={{ fontFamily: "'Libre Baskerville', serif" }}>Finition anglée & polie</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              L'anglage consiste à éliminer les arêtes vives des composants de mouvement en façonnant un biseau à 45 degrés, poli pour capter la lumière. Cette technique, entièrement manuelle, requiert des années d'expérience et une concentration absolue. Chaque pièce d'un calibre LM subit ce processus, même les parties invisibles à l'œil nu.
            </p>
            <div className="border-l-2 border-[#B49A6A] pl-4 space-y-2 text-xs text-white/40">
              <p><strong>Guillochage :</strong> Motifs géométriques réguliers gravés à la main sur les cadrans à l'aide de tours à guillocher centenaires.</p>
              <p><strong>Ajustage :</strong> Réglage chronométrique précis dans cinq positions différentes sous température contrôlée.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-16 grid md:grid-cols-3 gap-8 text-sm text-white/50">
          <div className="space-y-2">
            <h3 className="text-[#B49A6A] text-lg font-light" style={{ fontFamily: "'Libre Baskerville', serif" }}>1. Conception</h3>
            <p className="text-xs leading-relaxed">Notre bureau technique dessine chaque calibre de A à Z. Plus de 300 composants sont modélisés en 3D puis usinés au micron près avant de passer aux ateliers de décoration.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-[#B49A6A] text-lg font-light" style={{ fontFamily: "'Libre Baskerville', serif" }}>2. Décoration</h3>
            <p className="text-xs leading-relaxed">Côtes de Genève, perlage des platines, et étirage des flancs. C'est à cette étape que le métal brut devient une œuvre d'art horlogère, révélant ses reflets subtils.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-[#B49A6A] text-lg font-light" style={{ fontFamily: "'Libre Baskerville', serif" }}>3. Assemblage</h3>
            <p className="text-xs leading-relaxed">Un seul horloger assemble l'intégralité d'un mouvement de haute complication, réglant le spiral et le balancier avant de procéder aux tests d'étanchéité.</p>
          </div>
        </div>

        <div className="text-center pt-8">
          <button onClick={() => goTo("contact")} className="bg-[#B49A6A] text-[#0C0B09] px-10 py-5 text-xs tracking-widest uppercase hover:bg-[#A08A5E] transition-colors cursor-pointer rounded-lg border-0 font-medium">
            Prendre rendez-vous avec un conseiller
          </button>
        </div>
      </div>
    </section>
  );
}

function MaisonSubPage() {
  const historyTimeline = [
    { year: "1887", title: "Fondation", desc: "Edouard Lecomte ouvre son premier atelier à Genève, se spécialisant dans la réparation de chronomètres de poche de haute précision." },
    { year: "1923", title: "Le premier Tourbillon", desc: "Création et brevet du premier mouvement tourbillon maison, salué par les observatoires astronomiques de Genève et de kkew pour sa régularité de marche." },
    { year: "1961", title: "Collection Heritage", desc: "Lancement d'une gamme de garde-temps au design intemporel, marquant le début de l'exportation internationale de la marque." },
    { year: "1998", title: "Installation dans la Vallée", desc: "Rachat d'une ancienne ferme horlogère à La Vallée de Joux, regroupant l'ensemble de nos ateliers de création, de décoration et d'assemblage sous le même toit." },
    { year: "2019", title: "Le Titane Grade 5", desc: "Innovation technologique majeure avec un modèle entièrement squelette en titane microbillé pesant moins de 32 grammes." },
  ];

  return (
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
  );
}

function ContactSubPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="py-32 px-6 bg-[#0F0E0C] text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-16 space-y-4">
            <p className="text-[#B49A6A] text-xs tracking-widest uppercase">Showroom & Showroom Privé</p>
            <h1 className="text-5xl md:text-7xl font-light" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Prendre <em>Rendez-vous</em>
            </h1>
            <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
              Nous vous accueillons Place Vendôme à Paris ou au cœur de notre manufacture pour vous présenter notre collection de garde-temps de prestige.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-8 text-sm text-white/60">
            <div className="space-y-2">
              <h3 className="text-[#B49A6A] text-xs tracking-widest uppercase">Showroom Vendôme</h3>
              <p>18 Place Vendôme, 75001 Paris</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[#B49A6A] text-xs tracking-widest uppercase">Manufacture Suisse</h3>
              <p>Route du Solliat 12, 1347 Le Sentier, Suisse</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[#B49A6A] text-xs tracking-widest uppercase">Téléphone</h3>
              <p>+33 1 42 60 00 00</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[#B49A6A] text-xs tracking-widest uppercase">Email</h3>
              <p>contact@atelier-mecanique.com</p>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#141310] border border-[#B49A6A]/20 p-8 rounded-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <h3 className="text-xl font-light text-[#B49A6A]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Demande Transmise</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Votre demande d'entretien a bien été enregistrée. Un concierge de la maison vous contactera sous 24 heures pour convenir des détails.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      className="w-full bg-[#0C0B09] border border-white/10 text-white p-3 text-xs outline-none focus:border-[#B49A6A] transition-all rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="nom@email.com"
                      className="w-full bg-[#0C0B09] border border-white/10 text-white p-3 text-xs outline-none focus:border-[#B49A6A] transition-all rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Lieu souhaité</label>
                    <select className="w-full bg-[#0C0B09] border border-white/10 text-white p-3 text-xs outline-none focus:border-[#B49A6A] transition-all rounded-lg">
                      <option>Showroom Paris Vendôme</option>
                      <option>Manufacture Vallée de Joux</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Date souhaitée</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-[#0C0B09] border border-white/10 text-white p-3 text-xs outline-none focus:border-[#B49A6A] transition-all rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Modèle d'intérêt</label>
                  <select className="w-full bg-[#0C0B09] border border-white/10 text-white p-3 text-xs outline-none focus:border-[#B49A6A] transition-all rounded-lg">
                    <option>Calibre Tourbillon I</option>
                    <option>Chronographe Rattrapante</option>
                    <option>Perpétuel Calendrier</option>
                    <option>Classique Trois Aiguilles</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#B49A6A] text-[#0C0B09] text-xs tracking-widest uppercase py-4 font-bold hover:bg-[#A08A5E] transition-colors cursor-pointer rounded-lg border-0"
                >
                  Demander une consultation privée
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
        <h1 className="text-4xl font-light mb-8" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          Mentions <em>Légales</em>
        </h1>

        <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-lg space-y-6 text-sm text-neutral-600 leading-relaxed">
          <div>
            <h3 className="text-black font-semibold text-base mb-2">Éditeur du site</h3>
            <p>
              Le site Atelier Mécanique est édité par :<br />
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
