"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Building2, ChevronRight, MapPin, Mail, Phone, Award, Layers, Users } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("kp-fonts")) return;
    const s = document.createElement("style");
    s.id = "kp-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');`;
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

const projects = [
  { name: "La Maison du Vent", location: "Marseille", type: "Résidentiel", area: "480 m²", year: "2025", src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
  { name: "Pavillon Zénith", location: "Lyon", type: "Cultural", area: "2 200 m²", year: "2025", src: "https://images.unsplash.com/photo-1545580658-97698ec5f683?w=600&q=80" },
  { name: "Ateliers Kéops", location: "Paris XIe", type: "Bureau mixte", area: "1 400 m²", year: "2024", src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
  { name: "Villa Terracotta", location: "Nice", type: "Résidentiel", area: "320 m²", year: "2024", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { name: "Cour des Arts", location: "Bordeaux", type: "Mixte culturel", area: "3 800 m²", year: "2023", src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&q=80" },
  { name: "Bibliothèque Nomade", location: "Nantes", type: "Public", area: "1 900 m²", year: "2023", src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
];

const filters = ["Tous", "Résidentiel", "Cultural", "Bureau mixte", "Public"];

const services = [
  { icon: <Building2 className="w-5 h-5" />, title: "Architecture résidentielle", desc: "Villas, maisons individuelles et ensembles résidentiels. Du concept à la livraison." },
  { icon: <Layers className="w-5 h-5" />, title: "Espaces culturels & publics", desc: "Musées, bibliothèques, espaces éducatifs. Architecture au service du vivre-ensemble." },
  { icon: <Users className="w-5 h-5" />, title: "Programmes mixtes", desc: "Bureaux, commerces, logements intégrés. Quartiers vivants conçus pour le long terme." },
  { icon: <Award className="w-5 h-5" />, title: "Réhabilitation & Patrimoine", desc: "Transformation de bâtiments existants. Dialogue entre mémoire architecturale et contemporain." },
];

const team = [
  { name: "Nadia Kéops", role: "Architecte Fondatrice", years: "22 ans" },
  { name: "Luc Ferrand", role: "Associé — Construction", years: "16 ans" },
  { name: "Amina Belkacem", role: "Architecte DPLG", years: "9 ans" },
];

const distinctions = [
  "Prix de l'Architecture Contemporaine 2025",
  "Grand Prix Soleil de l'Habitat — Résidentiel Durable",
  "RIBA Award — Shortlist International 2024",
  "Label Inventerre — Architecture Bioclimatique",
];

export default function KeopsPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const filtered = activeFilter === "Tous" ? projects : projects.filter(p => p.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#F5F2ED]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C46A3E] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#F5F2ED]/92 backdrop-blur-md border border-[#C46A3E]/20 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[#1A1510] tracking-wide text-lg font-medium" style={{ fontFamily: "'Libre Baskerville', serif" }}>Kéops</Link>
          <div className="hidden md:flex items-center gap-8 text-[#1A1510]/60 text-sm">
            {["Projets", "Services", "L'agence", "Équipe", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#C46A3E] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <button className="hidden md:inline-flex border border-[#C46A3E] text-[#C46A3E] text-sm px-5 py-2.5 rounded-xl hover:bg-[#C46A3E] hover:text-white transition-all cursor-pointer font-medium">
            Nous contacter
          </button>
          <button className="md:hidden text-[#1A1510] cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#F5F2ED] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#1A1510] text-xl font-medium" style={{ fontFamily: "'Libre Baskerville', serif" }}>Kéops</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-[#1A1510]" /></button>
            </div>
            {["Projets", "Services", "L'agence", "Équipe", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-[#1A1510] text-3xl mb-6 cursor-pointer" style={{ fontFamily: "'Libre Baskerville', serif" }} onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&q=85" alt="Kéops Architecture" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1510]/50 to-[#F5F2ED]/80" />
        </motion.div>
        <motion.div className="relative z-10 h-full flex items-end pb-20 px-6" style={{ opacity: heroOpacity }}>
          <div className="max-w-6xl mx-auto w-full">
            <Reveal>
              <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4">Agence d'architecture · Paris</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-white text-7xl md:text-9xl leading-none mb-6" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>
                Kéops
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <p className="text-white/70 text-lg max-w-md leading-relaxed">Architecture vivante. Espaces pensés pour durer, bâtis avec intention, habités avec plaisir.</p>
                <button className="shrink-0 bg-[#C46A3E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#B5593A] transition-colors cursor-pointer flex items-center gap-2">
                  Voir les projets <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#C46A3E]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[["22 ans", "D'expérience"], ["140+", "Projets réalisés"], ["12", "Prix d'architecture"], ["4", "Villes d'agences"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="text-white text-3xl font-bold mb-1">{n}</p>
              <p className="text-white/60 text-xs uppercase tracking-widest">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-3">Réalisations</p>
                <h2 className="text-[#1A1510] text-4xl md:text-5xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>Nos projets</h2>
              </div>
              <div className="flex gap-2 flex-wrap mt-6 md:mt-0">
                {filters.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-xl text-sm transition-all cursor-pointer border ${activeFilter === f ? "bg-[#C46A3E] text-white border-[#C46A3E]" : "border-[#1A1510]/15 text-[#1A1510]/60 hover:border-[#C46A3E]"}`}>{f}</button>
                ))}
              </div>
            </div>
          </Reveal>
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div key={p.name} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: "4/3" }}>
                    <Image src={p.src} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full text-[#1A1510]">{p.type}</div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[#1A1510] font-medium mb-1">{p.name}</h3>
                      <p className="text-[#1A1510]/50 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location} · {p.area}</p>
                    </div>
                    <span className="text-[#C46A3E] text-sm">{p.year}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 bg-[#F5F2ED]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-3">Expertise</p>
              <h2 className="text-[#1A1510] text-4xl md:text-5xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>Services</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-8 border border-[#1A1510]/8 hover:border-[#C46A3E]/30 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-[#C46A3E]/10 rounded-xl flex items-center justify-center text-[#C46A3E] mb-5 group-hover:bg-[#C46A3E] group-hover:text-white transition-colors">{s.icon}</div>
                  <h3 className="text-[#1A1510] font-medium text-lg mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>{s.title}</h3>
                  <p className="text-[#1A1510]/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-[#1A1510]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-3">L'équipe</p>
              <h2 className="text-white text-4xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>Nos architectes</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {team.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-[#231E17] border border-white/5 rounded-2xl p-8 hover:border-[#C46A3E]/30 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-[#C46A3E] rounded-2xl flex items-center justify-center text-white text-2xl font-medium mb-6" style={{ fontFamily: "'Libre Baskerville', serif" }}>{t.name.charAt(0)}</div>
                  <h3 className="text-white text-lg mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{t.name}</h3>
                  <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-3">{t.role}</p>
                  <p className="text-white/40 text-sm">{t.years} d'expérience</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Distinctions */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-12">
            <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-3">Reconnaissances</p>
            <h2 className="text-[#1A1510] text-4xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>Distinctions</h2>
          </Reveal>
          <div className="space-y-0">
            {distinctions.map((d, i) => (
              <Reveal key={d} delay={i * 0.07}>
                <div className="flex items-center gap-4 py-5 border-b border-[#1A1510]/10 group cursor-pointer">
                  <Award className="w-4 h-4 text-[#C46A3E] shrink-0" />
                  <p className="text-[#1A1510] text-sm group-hover:text-[#C46A3E] transition-colors">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-6 bg-[#F5F2ED]">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-[#C46A3E] rounded-3xl p-10 md:p-16 text-center">
              <h2 className="text-white text-4xl mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>Parlons de votre projet</h2>
              <p className="text-white/70 max-w-lg mx-auto mb-10">Un projet résidentiel, un programme mixte, une réhabilitation ? Notre équipe est disponible pour un premier échange sans engagement.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#C46A3E] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">Prendre rendez-vous</button>
                <button className="border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2"><Phone className="w-4 h-4" />+33 1 42 00 00 00</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1510] py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <p className="text-white text-xl mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>Kéops</p>
            <p className="text-white/30 text-sm leading-relaxed">Agence d'architecture fondée à Paris. Projets résidentiels, culturels et mixtes.</p>
          </div>
          {[
            { title: "Projets", links: ["Résidentiel", "Culturel", "Bureau mixte", "Patrimoine"] },
            { title: "Agence", links: ["Notre histoire", "L'équipe", "Distinctions", "Presse"] },
            { title: "Contact", links: ["Paris — 11 Rue de la Paix", "+33 1 42 00 00 00", "contact@keops-archi.fr", "LinkedIn"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white/40 text-xs tracking-widest uppercase mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><span className="text-white/30 text-sm hover:text-[#C46A3E] transition-colors cursor-pointer">{l}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex justify-between text-xs text-white/20">
          <span>© 2026 Kéops Architecture. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
