"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MapPin, Mail, Phone } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("kp-fonts")) return;
    const s = document.createElement("style");
    s.id = "kp-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');`;
    document.head.appendChild(s);
  }, []);
};



export default function ContactPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4 block">Contact</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Parlons de votre projet</h1>
          <p className="max-w-xl mx-auto text-[#1A1510]/60 text-sm leading-relaxed">
            Vous avez un projet résidentiel, public ou mixte ? Remplissez ce formulaire et un de nos architectes vous recontactera sous 48 heures.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-6 bg-[#F5F2ED] p-8 rounded-2xl border border-[#1A1510]/5">
            <h3 className="text-xl font-medium text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Coordonnées</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-[#1A1510]/70">
                <MapPin className="w-4 h-4 text-[#C46A3E] shrink-0" />
                <span>Showroom Privé, 11 Rue de la Paix, 75002 Paris</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#1A1510]/70">
                <Mail className="w-4 h-4 text-[#C46A3E] shrink-0" />
                <span>contact@keops-archi.fr</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#1A1510]/70">
                <Phone className="w-4 h-4 text-[#C46A3E] shrink-0" />
                <span>+33 1 42 00 00 00</span>
              </div>
            </div>
            <div className="border-t border-[#1A1510]/10 pt-4">
              <p className="text-xs text-[#1A1510]/40 font-mono">
                Horaires d'ouverture :<br />
                Lundi au Vendredi : 9h00 - 18h00<br />
                Samedi : Sur rendez-vous uniquement
              </p>
            </div>
          </div>

          <div className="md:col-span-7 bg-white p-8 rounded-2xl border border-[#1A1510]/10 flex flex-col gap-4">
            <input type="text" placeholder="Votre nom complet" className="bg-[#F5F2ED] border border-[#1A1510]/10 text-[#1A1510] text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C46A3E] placeholder-[#1A1510]/30" />
            <input type="email" placeholder="Votre adresse email" className="bg-[#F5F2ED] border border-[#1A1510]/10 text-[#1A1510] text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C46A3E] placeholder-[#1A1510]/30" />
            <select className="bg-[#F5F2ED] border border-[#1A1510]/10 text-[#1A1510]/60 text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C46A3E] cursor-pointer">
              <option>Type de programme</option>
              <option>Villa & Résidentiel</option>
              <option>Espace Public / Culturel</option>
              <option>Réhabilitation & Rénovation</option>
              <option>Autre</option>
            </select>
            <textarea rows={4} placeholder="Décrivez les grandes lignes de votre projet (surface, localisation, budget estimé...)" className="bg-[#F5F2ED] border border-[#1A1510]/10 text-[#1A1510] text-sm px-4 py-3.5 rounded-xl outline-none focus:border-[#C46A3E] placeholder-[#1A1510]/30 resize-none" />
            <button className="bg-[#C46A3E] text-white font-medium px-6 py-4 rounded-xl hover:bg-[#B5593A] transition-colors cursor-pointer text-sm">
              Envoyer ma demande d'étude
            </button>
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
                className={`hover:text-[#C46A3E] transition-colors cursor-pointer ${item.name === "Contact" ? "text-[#C46A3E] font-bold" : ""}`}
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
                  className={`block text-3xl mb-6 cursor-pointer ${item.name === "Contact" ? "text-[#C46A3E] font-bold" : "text-[#1A1510]"}`}
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
