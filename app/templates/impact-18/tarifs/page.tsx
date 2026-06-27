"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Layers, CheckCircle } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("sl-fonts")) return;
    const s = document.createElement("style");
    s.id = "sl-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

export default function TarifsPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(true);

  const plans = [
    { name: "Starter", price: "0", desc: "Pour les petites équipes", features: ["5 utilisateurs", "10 projets", "2 Go stockage", "Intégrations basiques", "Support communauté"], highlight: false, cta: "Gratuit pour toujours" },
    { name: "Growth", price: "29", desc: "Pour les équipes qui grandissent", features: ["Utilisateurs illimités", "Projets illimités", "100 Go stockage", "350+ intégrations", "Analytics avancés", "Support prioritaire"], highlight: true, cta: "Essai 14 jours" },
    { name: "Enterprise", price: "99", desc: "Pour les grandes organisations", features: ["Tout Growth inclus", "SSO & SAML", "SLA 99.99%", "Déploiement on-prem", "CISO dédié", "Support 24/7"], highlight: false, cta: "Contacter les ventes" },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white overflow-x-clip flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0D1117]/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/templates/impact-18" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Layers className="w-4 h-4 text-white" /></div>
            <span className="text-white font-bold text-lg">Streamline</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
            <Link href="/templates/impact-18/features" className="hover:text-white transition-colors">Fonctionnalités</Link>
            <Link href="/templates/impact-18/integrations" className="hover:text-white transition-colors">Intégrations</Link>
            <Link href="/templates/impact-18/tarifs" className="text-[#3B82F6] font-bold hover:text-white transition-colors">Tarifs</Link>
            <Link href="/templates/impact-18/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="/templates/impact-18/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/templates/impact-18/tarifs" className="text-gray-400 text-sm px-4 py-2 hover:text-white transition-colors">Se connecter</Link>
            <Link href="/templates/impact-18/tarifs" className="bg-[#3B82F6] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#2563EB] transition-colors font-medium">Essai gratuit</Link>
          </div>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#0D1117] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-white font-bold text-xl">Streamline</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            <Link href="/templates/impact-18" className="block text-white text-2xl font-bold mb-6">Accueil</Link>
            <Link href="/templates/impact-18/features" className="block text-white text-2xl font-bold mb-6">Fonctionnalités</Link>
            <Link href="/templates/impact-18/integrations" className="block text-white text-2xl font-bold mb-6">Intégrations</Link>
            <Link href="/templates/impact-18/tarifs" className="block text-[#3B82F6] text-2xl font-bold mb-6">Tarifs</Link>
            <Link href="/templates/impact-18/docs" className="block text-white text-2xl font-bold mb-6">Docs</Link>
            <Link href="/templates/impact-18/blog" className="block text-white text-2xl font-bold mb-6">Blog</Link>
            <Link href="/templates/impact-18/legal" className="block text-white text-2xl font-bold mb-6">Mentions Légales</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-32">
        <section className="py-24 px-6 bg-[#0D1117]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#3B82F6] text-sm font-semibold mb-3 block">Tarification</span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Simple et transparent</h1>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button onClick={() => setBillingAnnual(false)} className={`text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer ${!billingAnnual ? "bg-white/10 text-white" : "text-gray-500"}`}>Mensuel</button>
                <button onClick={() => setBillingAnnual(true)} className={`text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer ${billingAnnual ? "bg-white/10 text-white" : "text-gray-500"}`}>Annuel <span className="text-[#10B981] text-xs font-bold ml-1">-20%</span></button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.name} className={`rounded-2xl p-8 flex flex-col justify-between ${plan.highlight ? "bg-gradient-to-b from-[#3B82F6] to-[#2563EB] scale-105 shadow-2xl" : "bg-[#1E2535] border border-white/5"}`}>
                  <div>
                    <h3 className="font-bold text-xl mb-1 text-white">{plan.name}</h3>
                    <p className={`text-sm mb-4 ${plan.highlight ? "text-blue-200" : "text-gray-500"}`}>{plan.desc}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-extrabold text-white">{plan.price === "0" ? "Gratuit" : `${billingAnnual ? Math.round(parseInt(plan.price) * 0.8) : plan.price}€`}</span>
                      {plan.price !== "0" && <span className={`text-sm ${plan.highlight ? "text-blue-200" : "text-gray-500"}`}>/mois</span>}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-[#3B82F6]"}`} />
                          <span className={plan.highlight ? "text-white/90" : "text-gray-400"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className={`w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-colors mt-6 ${plan.highlight ? "bg-white text-[#2563EB] hover:bg-gray-100" : "bg-[#3B82F6] text-white hover:bg-[#2563EB]"}`}>{plan.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0D1117] border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link href="/templates/impact-18" className="flex items-center gap-2 mb-4 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Layers className="w-4 h-4 text-white" /></div>
              <span className="text-white font-bold text-lg">Streamline</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">La plateforme de productivité pour les équipes modernes. Gérez tout votre travail en un seul endroit.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Produit</h4>
            <ul className="space-y-2">
              <li><Link href="/templates/impact-18/features" className="text-gray-500 text-sm hover:text-white transition-colors">Fonctionnalités</Link></li>
              <li><Link href="/templates/impact-18/integrations" className="text-gray-500 text-sm hover:text-white transition-colors">Intégrations</Link></li>
              <li><Link href="/templates/impact-18/tarifs" className="text-gray-500 text-sm hover:text-white transition-colors">Tarifs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Ressources</h4>
            <ul className="space-y-2">
              <li><Link href="/templates/impact-18/docs" className="text-gray-500 text-sm hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/templates/impact-18/blog" className="text-gray-500 text-sm hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Légal</h4>
            <ul className="space-y-2">
              <li><Link href="/templates/impact-18/legal" className="text-gray-500 text-sm hover:text-white transition-colors">Mentions Légales</Link></li>
              <li><Link href="/templates/impact-18/legal" className="text-gray-500 text-sm hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex justify-between text-xs text-gray-600">
          <span>© 2026 Streamline. Tous droits réservés.</span>
          <span>Made in 🇫🇷 Paris</span>
        </div>
      </footer>
    </div>
  );
}
