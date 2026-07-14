"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Layers, Lock, Server } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("sl-fonts")) return;
    const s = document.createElement("style");
    s.id = "sl-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

export default function DocsPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[#0D1117] text-white overflow-x-clip flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0D1117]/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/templates/impact-18" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center"><Layers className="w-4 h-4 text-white" /></div>
            <span className="text-white font-bold text-lg">Streamline</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
            <Link href="/templates/impact-18/features" className="hover:text-white transition-colors">Fonctionnalités</Link>
            <Link href="/templates/impact-18/integrations" className="hover:text-white transition-colors">Intégrations</Link>
            <Link href="/templates/impact-18/tarifs" className="hover:text-white transition-colors">Tarifs</Link>
            <Link href="/templates/impact-18/docs" className="text-[#3B82F6] font-bold hover:text-white transition-colors">Docs</Link>
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
            <Link href="/templates/impact-18/tarifs" className="block text-white text-2xl font-bold mb-6">Tarifs</Link>
            <Link href="/templates/impact-18/docs" className="block text-[#3B82F6] text-2xl font-bold mb-6">Docs</Link>
            <Link href="/templates/impact-18/blog" className="block text-white text-2xl font-bold mb-6">Blog</Link>
            <Link href="/templates/impact-18/legal" className="block text-white text-2xl font-bold mb-6">Mentions Légales</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-32">
        <section className="py-24 px-6 bg-[#0E131F]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <span className="text-[#3B82F6] text-sm font-semibold mb-3 block">Développeurs</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation API</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Consultez nos guides techniques pour authentifier vos requêtes, écouter nos webhooks et automatiser la création de tâches.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-[#161B27] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Lock className="w-5 h-5 text-[#3B82F6]" /> Authentification</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Passez votre jeton API dans le header HTTP `Authorization` comme suit :
                </p>
                <pre className="bg-[#0D1117] p-4 rounded-xl text-xs text-gray-300 overflow-x-auto font-mono">
                  Authorization: Bearer st_live_abc123xyz...
                </pre>
              </div>

              <div className="bg-[#161B27] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Server className="w-5 h-5 text-[#3B82F6]" /> Récupérer les tâches (GET)</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Requête API standard pour lister les tâches actives :
                </p>
                <pre className="bg-[#0D1117] p-4 rounded-xl text-xs text-gray-300 overflow-x-auto font-mono">
                  GET https://api.streamline.sh/v1/tasks?status=active
                </pre>
              </div>
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
