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

export default function ExpertisesPage() {
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
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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

      <section id="services" className="pt-32 pb-16 px-6 bg-[#F8F4F0]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              Nos savoir-faire
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-none mb-6">
              Nos <em className="font-light text-[#F97316]">expertises</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">
              Quatre disciplines complémentaires pour couvrir l'ensemble du spectre du design produit. Chaque expertise s'enrichit des autres.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Packaging & Branding */}
          <Reveal>
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2">
                <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-6">
                  <Package className="w-7 h-7" />
                </div>
                <h2 className="text-gray-900 text-3xl font-bold mb-4">Packaging & Branding</h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Nous concevons des packagings qui capturent l'essence de votre marque. Du concept au fichier de production, chaque détail est pensé pour maximiser l'impact en rayon et sur les réseaux sociaux.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Notre approche combine analyse sémiotique, étude des tendances matières et prototypage rapide pour valider les concepts avant l'investissement en outillage.
                </p>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "Identité visuelle", desc: "Logo, charte graphique, direction artistique pour packagings primaires et secondaires." },
                  { title: "Modélisation 3D", desc: "Rendus photoréalistes pour validation client et présentation en comité de direction." },
                  { title: "Production", desc: "Fichiers d'exécution, suivi d'impression et contrôle qualité jusqu'à la livraison." },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h4 className="text-gray-900 font-bold mb-2">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Mobilier & Objets */}
          <Reveal>
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2">
                <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-6">
                  <Layers className="w-7 h-7" />
                </div>
                <h2 className="text-gray-900 text-3xl font-bold mb-4">Mobilier & Objets</h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Des pièces qui traversent les années. Notre studio conçoit du mobilier et des objets du quotidien alliant fonctionnalité, esthétique et durabilité des matériaux.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Nous travaillons avec des artisans et des industriels pour garantir la qualité de fabrication, que ce soit en édition limitée ou en grande série.
                </p>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "Esquisse & CAO", desc: "Du croquis à la modélisation surfacique. Chaque courbe est définie avec précision." },
                  { title: "Prototypage", desc: "Impression 3D, usinage CNC, maquettes d'aspect et prototypes fonctionnels." },
                  { title: "Édition & Série", desc: "Dossiers techniques complets pour la mise en production industrielle." },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h4 className="text-gray-900 font-bold mb-2">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Product Design Tech */}
          <Reveal>
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2">
                <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-6">
                  <Cpu className="w-7 h-7" />
                </div>
                <h2 className="text-gray-900 text-3xl font-bold mb-4">Product Design Tech</h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  À la croisée du hardware et du software, nous concevons des produits connectés qui offrent une expérience utilisateur cohérente du physique au digital.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Notre équipe pluridisciplinaire intègre les contraintes électroniques dès la phase de design pour éviter les compromis en aval.
                </p>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "UX Produit", desc: "Cartographie des usages, scénarios d'interaction et tests utilisateurs en conditions réelles." },
                  { title: "Design industriel", desc: "Boîtiers, interfaces physiques, CMF (couleur, matière, finition) optimisés." },
                  { title: "Intégration", desc: "Collaboration étroite avec les équipes hardware et firmware pour un résultat sans compromis." },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h4 className="text-gray-900 font-bold mb-2">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Design de Concept */}
          <Reveal>
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2">
                <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-6">
                  <Eye className="w-7 h-7" />
                </div>
                <h2 className="text-gray-900 text-3xl font-bold mb-4">Design de Concept</h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Anticiper les usages de demain pour les marques visionnaires. Nos projets de design fiction permettent d'explorer des territoires créatifs inédits et de prendre de l'avance sur la concurrence.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Nous organisons des workshops de prospective immersifs pour aligner votre équipe autour d'une vision design commune.
                </p>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "Design Fiction", desc: "Scénarios prospectifs, prototypes provocateurs et récits de marque pour les 5 prochaines années." },
                  { title: "Veille & Tendances", desc: "Rapports trimestriels sur les innovations matériaux, technologiques et sociétales." },
                  { title: "Workshops créatifs", desc: "Sessions de co-création de 2 jours avec vos équipes produit, marketing et R&D." },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h4 className="text-gray-900 font-bold mb-2">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Workshop CTA */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mx-auto mb-6">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h2 className="text-gray-900 text-4xl font-bold mb-4">Workshops de co-design</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
              Deux jours d'immersion créative avec notre équipe. Idéation, prototypage rapide et feuille de route design pour votre prochain lancement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/templates/impact-21/contact" className="bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer flex items-center gap-2 mx-auto sm:mx-0">
                Réserver un workshop <Calendar className="w-4 h-4" />
              </Link>
            </div>
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
