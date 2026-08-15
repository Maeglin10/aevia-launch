"use client";
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientCity,
  clientName,
  clientTeam,
} from "@/lib/templates/clientContent";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("kp-fonts")) return;
    const s = document.createElement("style");
    s.id = "kp-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

/* Recalculé après l'arrivée de la session : figé à l'import, le repli de la
   démonstration restait affiché. */
function team_DEMO_ANNEXE_LIVE() {
  return [
  { name: `Nadia ${clientName(sessionData) ?? "Kéops"}`, role: "Architecte Fondatrice", years: "22 ans", citation: "L'architecture n'est pas seulement esthétique, c'est l'art d'habiter le monde avec respect." },
  { name: "Luc Ferrand", role: "Associé — Construction", years: "16 ans", citation: "Chaque pierre posée doit avoir une fonction, chaque espace une raison d'être." },
  { name: "Amina Belkacem", role: "Architecte DPLG", years: "9 ans", citation: "Concevoir des lieux de rencontre fluides qui s'intègrent organiquement dans la ville." },
];
}
let team_DEMO_ANNEXE = team_DEMO_ANNEXE_LIVE();
function team_LIVE() {
  return resolveList(clientTeam(sessionData)?.map((m: any, i: number) => ({ ...team_DEMO_ANNEXE[i % team_DEMO_ANNEXE.length], name: m.name, role: m.role ?? team_DEMO_ANNEXE[i % team_DEMO_ANNEXE.length].role })), team_DEMO_ANNEXE);
}
let team = team_DEMO_ANNEXE;



export default function EquipePage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;

  team_DEMO_ANNEXE = team_DEMO_ANNEXE_LIVE();
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;
  team = team_LIVE();

  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <section className="py-20 px-6 bg-[#F5F2ED]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4 block">Notre ADN</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-[#1A1510]" style={{ fontFamily: "'Libre Baskerville', serif" }}>L'Équipe</h1>
          <p className="max-w-xl mx-auto text-[#1A1510]/60 text-sm leading-relaxed">
            Une synergie de talents complémentaires : architectes, ingénieurs thermiciens et conducteurs de chantiers animés par la même passion environnementale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((t, i) => (
            <div key={t.name} className="bg-white border border-[#1A1510]/5 rounded-2xl p-8 hover:border-[#C46A3E]/30 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-[#C46A3E] rounded-2xl flex items-center justify-center text-white text-2xl font-medium mb-6" style={{ fontFamily: "'Libre Baskerville', serif" }}>{t.name.charAt(0)}</div>
                <h3 className="text-[#1A1510] text-xl mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{t.name}</h3>
                <p className="text-[#C46A3E] text-xs tracking-widest uppercase mb-4">{t.role}</p>
                <p className="text-[#1A1510]/50 text-xs font-mono mb-4">{t.years} d'expérience</p>
                <p className="text-[#1A1510]/60 text-sm italic leading-relaxed">"{t.citation}"</p>
              </div>
            </div>
          ))}
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
                className={`hover:text-[#C46A3E] transition-colors cursor-pointer ${item.name === "Équipe" ? "text-[#C46A3E] font-bold" : ""}`}
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
                  className={`block text-3xl mb-6 cursor-pointer ${item.name === "Équipe" ? "text-[#C46A3E] font-bold" : "text-[#1A1510]"}`}
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
            <p className="text-white/30 text-sm leading-relaxed">Agence d'architecture fondée à {clientCity(sessionData) ?? "Paris"}. Projets résidentiels, culturels et mixtes.</p>
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
              { name: (clientCity(sessionData) ?? "Paris") + " Showroom", path: "/templates/impact-17/contact" },
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
