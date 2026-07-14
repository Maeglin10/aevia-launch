"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Layers, Cpu, Package, Eye, ChevronRight, Globe, Award, Users, Mail, Clock, Send, Calendar, CheckCircle, Star, Lightbulb, Target, Heart, Palette, Ruler, Cog, BookOpen } from "lucide-react";

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

const projectDetails = [
  {
    name: "Capsule Pro",
    category: "Packaging",
    client: "L'Oréal",
    year: "2025",
    color: "#F97316",
    src: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
    description: "Une gamme de flacons rechargeables en aluminium recyclé pour la ligne premium L'Oréal Professionnel. Le système de capsules magnétiques simplifie le rechargement tout en maintenant l'élégance du packaging.",
    materials: "Aluminium recyclé 100%, ABS biosourcé, aimants néodyme",
    processUsed: "Conception CAO → Impression 3D métal → Moulage série",
    ergonomics: "Prise en main optimisée pour une main mouillée, mécanisme d'ouverture à une seule main. Tests utilisateurs avec 120 professionnels de la coiffure.",
  },
  {
    name: "Archeus Chair",
    category: "Furniture",
    client: "Cassina",
    year: "2025",
    color: "#6366F1",
    src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    description: "Fauteuil d'accueil pour les espaces hôteliers haut de gamme. Structure en frêne massif et assise en cuir pleine fleur. L'Archeus revisite les codes du design mid-century avec une approche contemporaine.",
    materials: "Frêne massif FSC, cuir pleine fleur tannage végétal, mousse HR recyclée",
    processUsed: "Esquisse → Modélisation 3D → Prototype 1:1 → Essais fatigue",
    ergonomics: "Angle d'assise de 12° pour un confort prolongé, accoudoirs sculptés ergonomiquement. Conforme aux normes européennes EN 1022 et EN 1728.",
  },
  {
    name: "HaloKit",
    category: "Consumer Electronics",
    client: "Sony Design",
    year: "2024",
    color: "#0EA5E9",
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description: "Écouteurs sans fil à réduction de bruit active avec étui de charge en céramique. Le HaloKit combine performance audio et minimalisme esthétique pour le marché premium.",
    materials: "Céramique zircone, silicone médical, drivers titane 10mm",
    processUsed: "Design industriel → Prototype fonctionnel → Tests acoustiques → Certification",
    ergonomics: "Trois tailles d'embouts, poids de 4,8g par écouteur, autonomie 32h avec l'étui. Test de confort sur 200 utilisateurs pendant 8 heures consécutives.",
  },
  {
    name: "Bloom Series",
    category: "Tableware",
    client: "Seletti",
    year: "2024",
    color: "#10B981",
    src: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=600&q=80",
    description: "Collection de vaisselle en porcelaine inspirée des formes organiques des plantes succulentes. Chaque pièce est unique grâce à un procédé d'émaillage semi-aléatoire développé en interne.",
    materials: "Porcelaine de Limoges, émail réactif sans plomb, pigments naturels",
    processUsed: "Sculpture digitale → Impression 3D céramique → Émaillage artisanal",
    ergonomics: "Bords arrondis anti-ébréchure, base anti-dérapante, compatible lave-vaisselle et micro-ondes. Empilable pour un rangement optimal.",
  },
  {
    name: "Kinetic Lamp",
    category: "Lighting",
    client: "Foscarini",
    year: "2023",
    color: "#F59E0B",
    src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    description: "Luminaire cinétique dont l'abat-jour en lames d'aluminium réagit à la lumière naturelle pour créer des jeux d'ombres évolutifs tout au long de la journée.",
    materials: "Aluminium anodisé, moteur pas-à-pas silencieux, LED dimmable 2700K-5000K",
    processUsed: "Design paramétrique → Simulation lumière → Prototype mécanique → Production",
    ergonomics: "Contrôle via application et geste, rotation silencieuse < 20 dB, consommation 12W. Capteur crépusculaire intégré pour une adaptation automatique.",
  },
];

export default function TravauxPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navMap = {
    Travaux: "/templates/impact-21/travaux",
    Expertises: "/templates/impact-21/expertises",
    Process: "/templates/impact-21",
    Studio: "/templates/impact-21/studio",
    Contact: "/templates/impact-21/contact",
  };

  return (
    <div className="min-h-dvh bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-white/92 backdrop-blur-md border border-gray-200 shadow-sm rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/templates/impact-21" className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 bg-[#F97316] rounded-lg" />
            <span className="text-gray-900 font-bold text-lg tracking-tight">Forme Studio</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-gray-500 text-sm font-medium">
            {Object.entries(navMap).map(([label, target]) => (
              <Link key={label} href={target} className="hover:text-[#F97316] transition-colors cursor-pointer bg-transparent border-none p-0 font-medium text-sm text-gray-500">
                {label}
              </Link>
            ))}
          </div>
          <Link href="/templates/impact-21/contact" className="hidden md:inline-flex bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer font-medium">
            Nouveau projet
          </Link>
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
            {Object.entries(navMap).map(([label, target], i) => (
              <motion.div key={label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href={target} onClick={() => setMobileOpen(false)} className="block text-gray-900 text-2xl font-bold mb-6 cursor-pointer bg-transparent border-none p-0 text-left">{label}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section id="realisations" className="pt-32 pb-16 px-6 bg-[#F8F4F0]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              Portfolio complet
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-none mb-6">
              Nos <em className="font-light text-[#F97316]">travaux</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">
              Chaque projet est une collaboration étroite avec nos clients. Du brief initial au lancement commercial, nous concevons des produits qui marquent leur catégorie.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          {projectDetails.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden" style={{ border: `1px solid ${p.color}20` }}>
                  <Image src={p.src} alt={p.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">{p.category}</span>
                    <h3 className="text-white text-3xl font-bold mt-1">{p.name}</h3>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{p.client}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{p.year}</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: `${p.color}15`, color: p.color }}>{p.category}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{p.description}</p>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center gap-2 text-[#F97316] text-sm font-semibold mb-2">
                        <Cog className="w-4 h-4" /> Matériaux
                      </div>
                      <p className="text-gray-500 text-sm">{p.materials}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center gap-2 text-[#F97316] text-sm font-semibold mb-2">
                        <Ruler className="w-4 h-4" /> Process
                      </div>
                      <p className="text-gray-500 text-sm">{p.processUsed}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center gap-2 text-[#F97316] text-sm font-semibold mb-2">
                        <Users className="w-4 h-4" /> Ergonomie
                      </div>
                      <p className="text-gray-500 text-sm">{p.ergonomics}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-white text-4xl font-bold mb-4">Votre produit pourrait être ici</h2>
            <p className="text-gray-400 text-lg mb-8">Rejoignez les marques qui nous ont fait confiance pour donner forme à leurs idées.</p>
            <Link href="/templates/impact-21/contact" className="bg-[#F97316] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#F97316]/90 transition-colors cursor-pointer inline-flex items-center gap-2 mx-auto">
              Lancer un projet <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <Link href="/templates/impact-21" className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"><div className="w-5 h-5 bg-[#F97316] rounded" /><span className="text-white font-bold">Forme Studio</span></Link>
          <div className="flex gap-8">
            <Link href="/templates/impact-21/legal" className="hover:text-[#F97316] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-gray-500">Politique de conf.</Link>
            <Link href="/templates/impact-21/legal" className="hover:text-[#F97316] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-gray-500">Mentions légales</Link>
          </div>
          <span>© 2026 Forme Studio. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
