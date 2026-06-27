"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Building2, Layers, Users, Award } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("kp-fonts")) return;
    const s = document.createElement("style");
    s.id = "kp-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const services = [
  { icon: <Building2 className="w-5 h-5" />, title: "Architecture résidentielle", desc: "Villas, maisons individuelles et ensembles résidentiels. Du concept à la livraison." },
  { icon: <Layers className="w-5 h-5" />, title: "Espaces culturels & publics", desc: "Musées, bibliothèques, espaces éducatifs. Architecture au service du vivre-ensemble." },
  { icon: <Users className="w-5 h-5" />, title: "Programmes mixtes", desc: "Bureaux, commerces, logements intégrés. Quartiers vivants conçus pour le long terme." },
  { icon: <Award className="w-5 h-5" />, title: "Réhabilitation & Patrimoine", desc: "Transformation de bâtiments existants. Dialogue entre mémoire architecturale et contemporain." },
];

export default function ServicesPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);

  const steps = [
    { num: "01", title: "Diagnostic & Faisabilité", desc: "Analyse du terrain, contraintes d'urbanisme, orientation solaire et étude de sol préliminaire." },
    { num: "02", title: "Conception & Modélisation", desc: "Esquisses, plans 2D/3D détaillés et choix de matériaux durables (isolation paille, chanvre, ossature bois)." },
    { num: "03", title: "Permis de Construire", desc: "Constitution et suivi administratif rigoureux du dossier de demande auprès des municipalités." },
    { num: "04", title: "Suivi de Chantier", desc: "Coordination et pilotage des artisans labellisés RGE jusqu'à la réception des clés." }
  ];
  const content = (
    <section className="py-20 px-6 bg-[#F5F2ED]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4 block">Notre Expertise</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Services & Processus</h1>
          <p className="max-w-xl mx-auto text-[#1A1510]/60 text-sm leading-relaxed">
            De la première esquisse à la livraison définitive, nous pilotons chaque projet avec la même exigence de rigueur technique et d'élégance environnementale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {services.map((s, i) => (
            <div key={s.title} className="bg-white rounded-2xl p-8 border border-[#1A1510]/8 hover:border-[#C46A3E]/30 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#C46A3E]/10 rounded-xl flex items-center justify-center text-[#C46A3E] mb-6">{s.icon}</div>
                <h3 className="text-[#1A1510] font-medium text-xl mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>{s.title}</h3>
                <p className="text-[#1A1510]/50 text-sm leading-relaxed mb-6">{s.desc}</p>
              </div>
              <Link href="/templates/impact-17/contact" className="w-full block text-center py-3.5 border border-[#C46A3E]/30 hover:border-[#C46A3E] hover:bg-[#C46A3E] hover:text-white rounded-xl text-xs tracking-widest uppercase transition-all font-medium text-[#C46A3E]">
                Étudier mon projet
              </Link>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1A1510]/10 pt-16">
          <h2 className="text-3xl md:text-4xl text-[#1A1510] mb-12 text-center" style={{ fontFamily: "'Libre Baskerville', serif" }}>Notre méthodologie en 4 étapes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div key={st.num} className="bg-white/50 border border-[#1A1510]/5 rounded-2xl p-6 relative">
                <span className="text-5xl font-bold text-[#C46A3E]/15 absolute top-4 right-4">{st.num}</span>
                <h4 className="text-[#1A1510] font-medium text-lg mb-2 mt-4">{st.title}</h4>
                <p className="text-[#1A1510]/50 text-xs leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1510] overflow-x-clip flex flex-col" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#F5F2ED]/92 backdrop-blur-md border border-[#C46A3E]/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
          <Link href="/templates/impact-17" className="text-[#1A1510] tracking-wide text-lg font-medium cursor-pointer" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Kéops
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[#1A1510]/60 text-sm font-medium">
            {[
              { name: "Projets", path: "/templates/impact-17/projets" },
              { name: "Services", path: "/templates/impact-17/services" },
              { name: "L'agence", path: "/templates/impact-17/agence" },
              { name: "Équipe", path: "/templates/impact-17/equipe" },
              { name: "Contact", path: "/templates/impact-17/contact" }
            ].map(item => (
              <Link
                key={item.name}
                href={item.path}
                className={`hover:text-[#C46A3E] transition-colors cursor-pointer ${item.name === "Services" ? "text-[#C46A3E] font-bold" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link href="/templates/impact-17/contact" className="hidden md:inline-flex border border-[#C46A3E] text-[#C46A3E] text-sm px-5 py-2.5 rounded-xl hover:bg-[#C46A3E] hover:text-white transition-all cursor-pointer font-medium">
            Nous contacter
          </Link>
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
            {[
              { name: "Accueil", path: "/templates/impact-17" },
              { name: "Projets", path: "/templates/impact-17/projets" },
              { name: "Services", path: "/templates/impact-17/services" },
              { name: "L'agence", path: "/templates/impact-17/agence" },
              { name: "Équipe", path: "/templates/impact-17/equipe" },
              { name: "Contact", path: "/templates/impact-17/contact" },
              { name: "Mentions Légales", path: "/templates/impact-17/legal" }
            ].map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link
                  href={item.path}
                  className={`block text-3xl mb-6 cursor-pointer ${item.name === "Services" ? "text-[#C46A3E] font-bold" : "text-[#1A1510]"}`}
                  style={{ fontFamily: "'Libre Baskerville', serif" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-32">
        {content}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1510] py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <p className="text-white text-xl mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>Kéops</p>
            <p className="text-white/30 text-sm leading-relaxed">Agence d'architecture fondée à Paris. Projets résidentiels, culturels et mixtes.</p>
          </div>
          {[
            { title: "Projets", links: [
              { name: "Résidentiel", path: "/templates/impact-17/projets" },
              { name: "Culturel", path: "/templates/impact-17/projets" },
              { name: "Bureau mixte", path: "/templates/impact-17/projets" },
              { name: "Patrimoine", path: "/templates/impact-17/projets" }
            ]},
            { title: "Agence", links: [
              { name: "Notre histoire", path: "/templates/impact-17/agence" },
              { name: "L'équipe", path: "/templates/impact-17/equipe" },
              { name: "Distinctions", path: "/templates/impact-17/agence" },
              { name: "Presse", path: "/templates/impact-17/agence" }
            ]},
            { title: "Contact", links: [
              { name: "Prendre rendez-vous", path: "/templates/impact-17/contact" },
              { name: "Paris Showroom", path: "/templates/impact-17/contact" },
              { name: "Faire une demande", path: "/templates/impact-17/contact" }
            ]},
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white/40 text-xs tracking-widest uppercase mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l.name}><Link href={l.path} className="text-white/30 text-sm hover:text-[#C46A3E] transition-colors cursor-pointer">{l.name}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between text-xs text-white/20 gap-4">
          <span>© 2026 Kéops Architecture. Tous droits réservés.</span>
          <div className="flex gap-6">
            <Link href="/templates/impact-17/legal" className="hover:text-[#C46A3E] transition-colors">Mentions légales</Link>
            <Link href="/templates/impact-17/legal" className="hover:text-[#C46A3E] transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
