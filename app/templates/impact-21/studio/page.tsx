"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Globe, Award, Target, Heart, Star } from "lucide-react";

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

const timeline = [
  { year: "2014", title: "Fondation", desc: "Création de Forme Studio à Paris par deux designers industriels passionnés par le design durable." },
  { year: "2016", title: "Premier prix", desc: "Red Dot Design Award pour le projet « Aéro » — ventilateur sans pale en bambou." },
  { year: "2017", title: "Expansion", desc: "Ouverture de l'atelier de prototypage dans le 11ᵉ arrondissement, équipé d'imprimantes 3D industrielles." },
  { year: "2019", title: "International", desc: "Premiers projets export avec Cassina (Italie) et Sony Design (Japon). Équipe de 6 designers." },
  { year: "2021", title: "Engagement durable", desc: "Certification B Corp. 100% des matériaux sourcés de manière responsable." },
  { year: "2023", title: "50 produits lancés", desc: "Cap symbolique franchi avec le lancement de la Kinetic Lamp pour Foscarini." },
  { year: "2025", title: "Nouveau chapitre", desc: "Déménagement dans un studio de 400m² avec showroom ouvert au public." },
];

const awards = [
  { name: "Red Dot Design Award", count: 5, years: "2016, 2018, 2020, 2022, 2024" },
  { name: "iF Design Award", count: 4, years: "2017, 2019, 2021, 2023" },
  { name: "A' Design Award Gold", count: 3, years: "2018, 2020, 2024" },
  { name: "French Design Award", count: 4, years: "2016, 2019, 2022, 2025" },
  { name: "Good Design Award", count: 2, years: "2021, 2023" },
];

export default function StudioPage() {
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

      <section className="pt-32 pb-16 px-6 bg-[#F8F4F0]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              Qui nous sommes
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-none mb-6">
              Le <em className="font-light text-[#F97316]">studio</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">
              Fondé en 2014, Forme Studio est un collectif de designers industriels, ingénieurs et artisans qui croient que le beau objet est aussi l'objet utile.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-[#F97316] text-sm font-semibold mb-3">Notre manifeste</p>
                <h2 className="text-gray-900 text-4xl font-bold mb-8">Le design qui dure est un acte de responsabilité</h2>
                <div className="space-y-6 text-gray-500 leading-relaxed">
                  <p>
                    Nous refusons l'obsolescence programmée et le design cosmétique. Chaque ligne que nous traçons, chaque matériau que nous choisissons, est pensé pour créer un objet qui accompagnera son utilisateur pendant des années.
                  </p>
                  <p>
                    Notre philosophie repose sur trois piliers : la justesse formelle, l'intégrité des matériaux et la pertinence d'usage. Un produit bien conçu n'a pas besoin d'être redessiné chaque saison.
                  </p>
                  <p>
                    Nous croyons que le design industriel a le pouvoir de transformer les habitudes de consommation. En créant des objets désirables ET durables, nous prouvons que ces deux qualités ne sont pas antinomiques.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="space-y-6">
                {[
                  { icon: <Heart className="w-5 h-5" />, title: "Design responsable", desc: "100% de nos matériaux sont sourcés de manière éthique. Certification B Corp depuis 2021." },
                  { icon: <Target className="w-5 h-5" />, title: "Précision & Justesse", desc: "Chaque projet passe par au minimum 3 itérations de prototypage avant validation finale." },
                  { icon: <Star className="w-5 h-5" />, title: "Excellence artisanale", desc: "Partenariats avec les meilleurs artisans et fabricants européens depuis plus de 10 ans." },
                  { icon: <Globe className="w-5 h-5" />, title: "Rayonnement international", desc: "Des projets pour des clients dans 12 pays, avec une sensibilité culturelle adaptée." },
                ].map((v, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] shrink-0">{v.icon}</div>
                    <div>
                      <h4 className="text-gray-900 font-bold mb-1">{v.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-16 text-center">
            <p className="text-[#F97316] text-sm font-semibold mb-3">Notre parcours</p>
            <h2 className="text-gray-900 text-4xl font-bold">Une décennie de design</h2>
          </Reveal>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.1}>
                <div className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}>
                    <div className={`bg-white rounded-2xl p-6 border border-gray-100 inline-block max-w-sm ${i % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
                      <p className="text-[#F97316] font-bold text-lg mb-1">{t.year}</p>
                      <h4 className="text-gray-900 font-bold mb-2">{t.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F97316] border-4 border-white shadow-sm z-10 mt-2" />
                  <div className="flex-1 md:hidden pl-10">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                      <p className="text-[#F97316] font-bold text-lg mb-1">{t.year}</p>
                      <h4 className="text-gray-900 font-bold mb-2">{t.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-12">
            <p className="text-[#F97316] text-sm font-semibold mb-3">Reconnaissance</p>
            <h2 className="text-gray-900 text-4xl font-bold">18 prix internationaux</h2>
          </Reveal>
          <div className="space-y-4">
            {awards.map((a, i) => (
              <Reveal key={a.name} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Award className="w-6 h-6 text-[#F97316]" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-lg">{a.name}</h3>
                      <p className="text-gray-500 text-sm">{a.years}</p>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 text-gray-900 font-bold text-sm inline-flex items-center gap-2 self-start md:self-auto">
                    <span className="text-[#F97316]">{a.count}x</span> Lauréat
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
