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

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0C0B09]" style={{ fontFamily: "'Jost', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#B49A6A] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0C0B09]/90 backdrop-blur-md border border-[#B49A6A]/20 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[#B49A6A] tracking-widest text-sm" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1rem" }}>
            Atelier Mécanique
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/50 text-xs tracking-widest uppercase">
            {["Montres", "Collections", "Manufacture", "Maison", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#B49A6A] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <button className="hidden md:inline-flex border border-[#B49A6A]/40 text-[#B49A6A] text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#B49A6A] hover:text-[#0C0B09] transition-all cursor-pointer rounded-lg">
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
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Montres", "Collections", "Manufacture", "Maison", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-3xl mb-6 cursor-pointer" style={{ fontFamily: "'Libre Baskerville', serif" }} onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
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
                <button className="bg-[#B49A6A] text-[#0C0B09] px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#A08A5E] transition-colors cursor-pointer rounded-lg">
                  Découvrir les montres
                </button>
                <button className="border border-white/20 text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-white/10 transition-colors cursor-pointer rounded-lg">
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
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#B49A6A] text-xs tracking-widest uppercase mb-3">Collections</p>
              <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>Nos garde-temps</h2>
            </div>
          </Reveal>
          <div className="flex gap-3 mb-8 flex-wrap">
            {collections.map((c, i) => (
              <button key={c} onClick={() => setActiveCollection(i)} className={`px-5 py-2.5 text-xs tracking-widest uppercase transition-all cursor-pointer border rounded-lg ${i === activeCollection ? "bg-[#B49A6A] text-[#0C0B09] border-[#B49A6A]" : "border-white/10 text-white/40 hover:border-[#B49A6A]/40"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {models.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.1}>
                <div onClick={() => setActiveModel(i)} className={`bg-[#111009] border rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-[#B49A6A]/40 ${i === activeModel ? "border-[#B49A6A]/50" : "border-white/10"}`}>
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
                      <button className="flex items-center gap-1 text-white/40 text-xs hover:text-[#B49A6A] transition-colors cursor-pointer">
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
              <button className="flex items-center gap-2 text-[#B49A6A] text-xs tracking-widest uppercase mt-10 hover:gap-4 transition-all cursor-pointer">
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
                <div className="flex gap-8 py-6 border-b border-white/10 group cursor-pointer">
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
              <button className="mt-10 bg-[#B49A6A] text-[#0C0B09] px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#A08A5E] transition-colors cursor-pointer rounded-lg">
                Prendre rendez-vous
              </button>
            </div>
          </Reveal>
        </div>
      </section>

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
                {col.links.map(l => <li key={l}><Link href="#" className="text-white/30 text-sm hover:text-[#B49A6A] transition-colors cursor-pointer">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 mt-10 pt-8 flex justify-between items-center text-xs text-white/20">
          <span>© 2026 Atelier Mécanique. Tous droits réservés.</span>
          <Link href="#" className="hover:text-[#B49A6A] transition-colors cursor-pointer">Mentions légales</Link>
        </div>
      </footer>
    </div>
  );
}
