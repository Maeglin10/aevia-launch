"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";


const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("kp-fonts")) return;
    const s = document.createElement("style");
    s.id = "kp-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');`;
    document.head.appendChild(s);
  }, []);
};



export default function LegalPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <section id="contact" className="py-20 px-6 bg-white font-mono text-xs text-[#1A1510]/80">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <span className="text-[#C46A3E] text-[10px] uppercase tracking-widest mb-3 block font-bold">Réglementation</span>
          <h1 className="text-4xl md:text-5xl font-light uppercase text-[#1A1510] mb-8" style={{ fontFamily: "'Libre Baskerville', serif" }}>Mentions Légales</h1>
        </div>

        <div className="border border-[#C46A3E]/20 bg-[#F5F2ED]/50 p-8 rounded-2xl space-y-6">
          <div className="border-b border-[#1A1510]/10 pb-4">
            <div className="text-[#C46A3E] text-[10px] font-bold uppercase mb-2">ÉDITEUR</div>
            <p className="leading-relaxed font-sans">
              <strong>Aevia WS — Valentin Milliand</strong><br />
              Entrepreneur individuel<br />
              SIREN : 852 546 225<br />
              RCS : Bourg-en-Bresse<br />
              Email : valentinmilliand@aevia.services<br />
              Adresse : Communiquée sur demande
            </p>
          </div>

          <div className="border-b border-[#1A1510]/10 pb-4">
            <div className="text-[#C46A3E] text-[10px] font-bold uppercase mb-2">HÉBERGEUR</div>
            <p className="leading-relaxed font-sans">
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, USA
            </p>
          </div>

          <div>
            <div className="text-[#C46A3E] text-[10px] font-bold uppercase mb-2">PROPRIÉTÉ INTELLECTUELLE</div>
            <p className="leading-relaxed font-sans text-xs">
              Tous les visuels, photographies de chantiers, plans, esquisses architecturales, ainsi que le code source de ce site internet sont protégés par le droit d'auteur. Toute reproduction ou distribution non autorisée est passible de poursuites judiciaires.
            </p>
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
                className={`hover:text-[#C46A3E] transition-colors cursor-pointer ${item.name === "Mentions Légales" ? "text-[#C46A3E] font-bold" : ""}`}
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
                  className={`block text-3xl mb-6 cursor-pointer ${item.name === "Mentions Légales" ? "text-[#C46A3E] font-bold" : "text-[#1A1510]"}`}
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
