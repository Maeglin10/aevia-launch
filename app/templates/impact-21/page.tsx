"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Layers, Cpu, Package, Eye, ChevronRight, Globe, Award, Users, Mail } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("fs-fonts")) return;
    const s = document.createElement("style");
    s.id = "fs-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const projects = [
  { name: "Capsule Pro", category: "Packaging", client: "L'Oréal", year: "2025", angle: "-3deg", color: "#F97316", src: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80" },
  { name: "Archeus Chair", category: "Furniture", client: "Cassina", year: "2025", angle: "2deg", color: "#6366F1", src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { name: "HaloKit", category: "Consumer Electronics", client: "Sony Design", year: "2024", angle: "-2deg", color: "#0EA5E9", src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
  { name: "Bloom Series", category: "Tableware", client: "Seletti", year: "2024", angle: "4deg", color: "#10B981", src: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=600&q=80" },
  { name: "Kinetic Lamp", category: "Lighting", client: "Foscarini", year: "2023", angle: "-1deg", color: "#F59E0B", src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
];

const disciplines = [
  { icon: <Package className="w-5 h-5" />, title: "Packaging & Branding", desc: "Identités visuelles et packaging qui s'imposent en linéaire et survivent sur les feeds Instagram." },
  { icon: <Layers className="w-5 h-5" />, title: "Mobilier & Objets", desc: "De l'esquisse 3D à la pièce finale. Prototypage rapide, édition limitée ou production en série." },
  { icon: <Cpu className="w-5 h-5" />, title: "Product Design Tech", desc: "Appareils connectés, interfaces physiques et expériences produit qui fusionnent hardware et software." },
  { icon: <Eye className="w-5 h-5" />, title: "Design de Concept", desc: "Explorations futures pour des marques en mutation. Design fiction, tendances et veille prospective." },
];

const clients = ["L'Oréal", "Sony", "Cassina", "Seletti", "Foscarini", "Hermès Design", "Renault", "Swatch Group"];

const process = [
  { n: "01", title: "Brief & Recherche", desc: "Immersion dans votre marché, analyse des usages, benchmark concurrentiel et identification des leviers d'innovation." },
  { n: "02", title: "Concept & Direction", desc: "3 pistes de direction créative avec mood boards, palettes matière et maquettes volumétriques." },
  { n: "03", title: "Design & Prototypage", desc: "Rendu 3D photoréaliste, puis prototype physique pour valider l'ergonomie et la production." },
  { n: "04", title: "Production & Lancement", desc: "Suivi des fournisseurs, contrôle qualité, photographie produit et assets marketing pour le lancement." },
];

export default function FormeStudioPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#F97316] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-white/92 backdrop-blur-md border border-gray-200 shadow-sm rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#F97316] rounded-lg" />
            <span className="text-gray-900 font-bold text-lg tracking-tight">Forme Studio</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-gray-500 text-sm font-medium">
            {["Travaux", "Expertises", "Process", "Studio", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#F97316] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <button className="hidden md:inline-flex bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer font-medium">
            Nouveau projet
          </button>
          <button className="md:hidden text-gray-900 cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-white flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-gray-900 font-bold text-xl">Forme Studio</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6" /></button>
            </div>
            {["Travaux", "Expertises", "Process", "Studio", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-gray-900 text-2xl font-bold mb-6 cursor-pointer" onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-16 px-6 overflow-hidden bg-[#F8F4F0]">
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: heroY }}>
          <div className="absolute top-20 right-0 w-1/2 h-full opacity-20">
            <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" alt="bg" fill className="object-cover" priority />
          </div>
        </motion.div>
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
              Studio de design produit · Paris
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-gray-900 text-6xl md:text-8xl font-bold leading-none mb-8">
              Design<br />
              <em className="font-light text-[#F97316]">qui dure.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-gray-500 text-xl max-w-lg leading-relaxed mb-10">
              Packaging, mobilier, objets tech. Forme Studio crée des produits qui se distinguent, se vendent, et résistent au temps.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer flex items-center gap-2">
                Voir les projets <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-[#F97316] hover:text-[#F97316] transition-colors cursor-pointer">
                En savoir plus
              </button>
            </div>
          </Reveal>
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-sm">
            {[["50+", "Produits lancés"], ["12 ans", "D'expérience"], ["18", "Récompenses design"]].map(([n, l]) => (
              <Reveal key={l}>
                <div>
                  <p className="text-gray-900 text-2xl font-bold">{n}</p>
                  <p className="text-gray-400 text-xs mt-1">{l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects — diagonal hover stack */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#F97316] text-sm font-semibold mb-3">Travaux récents</p>
              <h2 className="text-gray-900 text-4xl font-bold">Projets sélectionnés</h2>
            </div>
            <Link href="#" className="text-gray-400 text-sm hover:text-[#F97316] transition-colors cursor-pointer flex items-center gap-1">
              Tout voir <ChevronRight className="w-4 h-4" />
            </Link>
          </Reveal>
          <div className="space-y-4">
            {projects.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <motion.div
                  className="relative overflow-hidden rounded-2xl cursor-pointer"
                  initial={{ height: 80 }}
                  whileHover={{ height: 280 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}
                >
                  <div className="flex items-center justify-between px-8 py-6">
                    <div className="flex items-center gap-6">
                      <span className="text-gray-300 text-sm font-bold">0{i + 1}</span>
                      <div>
                        <h3 className="text-gray-900 font-bold text-lg">{p.name}</h3>
                        <p className="text-gray-400 text-sm">{p.category} · {p.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 text-sm">{p.year}</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: p.color }}>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-52 overflow-hidden">
                    <Image src={p.src} alt={p.name} fill className="object-cover object-top opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <p className="text-[#F97316] text-sm font-semibold mb-3">Expertises</p>
            <h2 className="text-gray-900 text-4xl font-bold">Ce que nous faisons</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {disciplines.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#F97316]/20 hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-5 group-hover:bg-[#F97316] group-hover:text-white transition-colors">{d.icon}</div>
                  <h3 className="text-gray-900 font-bold text-lg mb-3">{d.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{d.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <p className="text-[#F97316] text-sm font-semibold mb-3">Notre méthode</p>
            <h2 className="text-white text-4xl font-bold">Du brief au lancement</h2>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <div className="relative">
                  <div className="text-5xl font-black text-white/5 mb-4 leading-none">{step.n}</div>
                  <h3 className="text-white font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-16 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-8"><p className="text-gray-400 text-sm">Ils nous ont fait confiance</p></Reveal>
          <div className="flex flex-wrap justify-center gap-8">
            {clients.map((c, i) => <Reveal key={c} delay={i * 0.04}><span className="text-gray-300 text-sm font-medium hover:text-[#F97316] transition-colors cursor-pointer">{c}</span></Reveal>)}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-6 bg-[#F8F4F0]">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-[#F97316] text-sm font-semibold mb-4">Travaillons ensemble</p>
            <h2 className="text-gray-900 text-5xl font-bold mb-4">Vous avez un projet ?</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto mb-10">On est curieux. Parlez-nous de votre produit, de vos contraintes et de vos ambitions.</p>
            <button className="bg-gray-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer text-lg flex items-center gap-2 mx-auto">
              <Mail className="w-5 h-5" /> hello@formedstudio.fr
            </button>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#F97316] rounded" /><span className="text-white font-bold">Forme Studio</span></div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-[#F97316] transition-colors cursor-pointer">Politique de conf.</Link>
            <Link href="#" className="hover:text-[#F97316] transition-colors cursor-pointer">Mentions légales</Link>
          </div>
          <span>© 2026 Forme Studio. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
