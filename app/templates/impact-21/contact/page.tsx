"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Mail, Clock, Send, Calendar, CheckCircle, Globe } from "lucide-react";

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

const pricingTiers = [
  {
    name: "Essentiel",
    price: "3 500 €",
    desc: "Idéal pour un premier projet ou un packaging simple.",
    features: ["Brief & recherche initiale", "2 pistes créatives", "1 rendu 3D final", "Fichiers de production", "1 cycle de révision"],
  },
  {
    name: "Studio",
    price: "9 000 €",
    desc: "Pour des projets complets nécessitant prototypage.",
    features: ["Brief approfondi & benchmark", "3 pistes créatives", "Rendus 3D photoréalistes", "Prototype physique 1:1", "Suivi de production", "3 cycles de révision"],
    popular: true,
  },
  {
    name: "Sur mesure",
    price: "Sur devis",
    desc: "Collections, programmes multi-produits, consulting.",
    features: ["Audit design complet", "Direction artistique", "Prototypage illimité", "Suivi fournisseurs", "Assets marketing", "Support 12 mois"],
  },
];

export default function ContactPage() {
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
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              Travaillons ensemble
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-none mb-6">
              Vous avez un <em className="font-light text-[#F97316]">projet ?</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
              Parlez-nous de votre produit, de vos contraintes et de vos ambitions. On vous répond sous 48h.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              <Reveal>
                <h2 className="text-gray-900 text-2xl font-bold mb-8">Décrivez votre projet</h2>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-600 text-sm font-medium mb-2 block">Nom complet</label>
                      <input type="text" placeholder="Jean Dupont" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#F97316] transition-colors" />
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium mb-2 block">Entreprise</label>
                      <input type="text" placeholder="Acme Corp" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#F97316] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium mb-2 block">Email</label>
                    <input type="email" placeholder="jean@acme.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#F97316] transition-colors" />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium mb-2 block">Type de projet</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white">
                      <option>Packaging & Branding</option>
                      <option>Mobilier & Objets</option>
                      <option>Product Design Tech</option>
                      <option>Design de Concept</option>
                      <option>Workshop de co-design</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium mb-2 block">Budget indicatif</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white">
                      <option>Moins de 5 000 €</option>
                      <option>5 000 € – 10 000 €</option>
                      <option>10 000 € – 25 000 €</option>
                      <option>Plus de 25 000 €</option>
                      <option>À définir</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium mb-2 block">Décrivez votre projet</label>
                    <textarea rows={5} placeholder="Racontez-nous votre idée, le contexte, les contraintes…" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#F97316] transition-colors resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-[#F97316] transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Envoyer la demande
                  </button>
                </form>
              </Reveal>
            </div>
            <div className="md:col-span-2">
              <Reveal delay={0.2}>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="w-5 h-5 text-[#F97316]" />
                      <h4 className="text-gray-900 font-bold">Email</h4>
                    </div>
                    <p className="text-gray-500 text-sm">hello@formedstudio.fr</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-[#F97316]" />
                      <h4 className="text-gray-900 font-bold">Délai de réponse</h4>
                    </div>
                    <p className="text-gray-500 text-sm">Sous 48 heures ouvrées</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-[#F97316]" />
                      <h4 className="text-gray-900 font-bold">Studio</h4>
                    </div>
                    <p className="text-gray-500 text-sm">42 rue Oberkampf<br />75011 Paris, France</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-[#F97316]" />
                      <h4 className="text-gray-900 font-bold">Workshops</h4>
                    </div>
                    <p className="text-gray-500 text-sm">Sessions de 2 jours, sur rendez-vous. Prochaine session disponible : juillet 2026.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[#F97316] text-sm font-semibold mb-3">Tarification indicative</p>
            <h2 className="text-gray-900 text-4xl font-bold mb-4">Nos formules</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Chaque projet est unique. Ces tarifs sont indicatifs et servent de base à la discussion.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.1}>
                <div className={`bg-white rounded-2xl p-8 border ${tier.popular ? "border-[#F97316] shadow-lg relative" : "border-gray-100"} flex flex-col h-full`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-xs font-bold px-4 py-1 rounded-full">
                      Le plus choisi
                    </div>
                  )}
                  <h3 className="text-gray-900 text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-[#F97316] text-3xl font-bold mb-2">{tier.price}</p>
                  <p className="text-gray-500 text-sm mb-6">{tier.desc}</p>
                  <ul className="space-y-3 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-gray-600 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full mt-8 py-3 rounded-xl font-bold transition-colors cursor-pointer ${tier.popular ? "bg-[#F97316] text-white hover:bg-[#F97316]/90" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}>
                    Choisir cette formule
                  </button>
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
