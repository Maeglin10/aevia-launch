"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Award, ShieldCheck } from "lucide-react";
import Image from "next/image";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("kp-fonts")) return;
    const s = document.createElement("style");
    s.id = "kp-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const distinctions = [
  "Prix de l'Architecture Contemporaine 2025",
  "Grand Prix Soleil de l'Habitat — Résidentiel Durable",
  "RIBA Award — Shortlist International 2024",
  "Label Inventerre — Architecture Bioclimatique",
];

export default function AgencePage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <section id="tarifs" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-20">
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
            <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="Kéops Agence" fill className="object-cover" />
          </div>
          <div className="lg:col-span-7">
            <span className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4 block">Notre histoire</span>
            <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Bâtir l'avenir sur des fondations durables.</h2>
            <p className="text-[#1A1510]/70 text-lg leading-relaxed mb-4">
              Fondée en 2004 par Nadia Kéops, l'agence s'est forgé une solide réputation nationale dans la conception d'architectures bioclimatiques et d'espaces durables.
            </p>
            <p className="text-[#1A1510]/50 text-sm leading-relaxed mb-6">
              Nos projets privilégient les circuits courts pour l'approvisionnement en matériaux biosourcés : la pierre sèche du Gard, le bois Douglas du Morvan et la terre cuite de l'arrière-pays méditerranéen. En alliant savoir-faire artisanal traditionnel et technologies numériques passives, nous façonnons des édifices à haute efficacité thermique et à empreinte environnementale minimale.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 border-t border-[#1A1510]/10 pt-16">
          <div>
            <h3 className="text-3xl font-light mb-8 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Distinctions & Prix</h3>
            <div className="space-y-4">
              {distinctions.map((d, i) => (
                <div key={d} className="flex items-center gap-4 py-4 border-b border-[#1A1510]/5">
                  <Award className="w-5 h-5 text-[#C46A3E] shrink-0" />
                  <p className="text-[#1A1510] text-sm font-medium">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-light mb-8 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Notre Engagement</h3>
            <p className="text-[#1A1510]/60 text-sm leading-relaxed mb-6">
              Tous nos bâtiments visent une conformité stricte RE2020 et intègrent l'analyse de cycle de vie (ACV) dès les premières étapes du design pour minimiser le carbone incorporé.
            </p>
            <div className="bg-[#F5F2ED] rounded-2xl p-6 border border-[#C46A3E]/10">
              <h4 className="text-[#1A1510] font-medium text-md mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#C46A3E]" /> Philosophie Bioclimatique</h4>
              <p className="text-[#1A1510]/50 text-xs leading-relaxed">
                Utilisation de la ventilation transversale naturelle, de la masse thermique pour le lissage des températures, et de protections solaires passives calculées selon l'azimut local.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-dvh bg-[#F5F2ED] text-[#1A1510] overflow-x-clip flex flex-col" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
                className={`hover:text-[#C46A3E] transition-colors cursor-pointer ${item.name === "L'agence" ? "text-[#C46A3E] font-bold" : ""}`}
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
                  className={`block text-3xl mb-6 cursor-pointer ${item.name === "L'agence" ? "text-[#C46A3E] font-bold" : "text-[#1A1510]"}`}
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
