"use client";

import React from "react";
import Link from "next/link";
import { Plane, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Confidentialite() {
  return (
    <div className="premium-theme min-h-dvh bg-[#050505] text-[#ffffff] font-sans selection:bg-[#00f2ff] selection:text-black">
      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-xl py-4 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-93" className="group flex items-center gap-3">
            <div className="relative">
              <Plane className="w-8 h-8 text-[#00f2ff] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#00f2ff]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none italic">
                Velocity
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#00f2ff] -mt-1">
                Jet Charter
              </span>
            </div>
          </Link>
          <Link
            href="/templates/impact-93"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-[#00f2ff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <section className="pt-40 pb-20 px-6 md:px-12 border-b border-white/5 bg-[#080808]">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] mb-6 block">
              Confidentialité
            </span>
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-8">
              Politique de <span className="not-italic font-thin text-white">Confidentialité.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto prose prose-invert prose-p:text-white/40 prose-p:font-light prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:italic prose-headings:tracking-tight prose-a:text-[#00f2ff] hover:prose-a:text-white prose-a:transition-colors">
          <h2>1. Collecte des données personnelles</h2>
          <p>
            Nous collectons les données personnelles suivantes lorsque vous utilisez notre site ou nos services :
          </p>
          <ul>
            <li>Informations de contact (nom, adresse email, numéro de téléphone)</li>
            <li>Préférences de vol et de catering</li>
            <li>Données de navigation et cookies</li>
          </ul>

          <h2>2. Utilisation des données</h2>
          <p>
            Les données collectées sont utilisées pour :
          </p>
          <ul>
            <li>Gérer vos demandes de vol et de devis</li>
            <li>Améliorer la qualité de nos services et de notre site</li>
            <li>Vous envoyer des communications commerciales (avec votre consentement)</li>
          </ul>

          <h2>3. Partage des données</h2>
          <p>
            Vos données peuvent être partagées avec nos partenaires opérationnels (opérateurs de vol, services de restauration) uniquement dans le but d'exécuter nos services. Nous ne vendons jamais vos données personnelles à des tiers.
          </p>

          <h2>4. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès, modification, divulgation ou destruction non autorisés. Tous nos protocoles respectent les standards les plus stricts de l'industrie aéronautique.
          </p>

          <h2>5. Vos droits</h2>
          <p>
            Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données personnelles. Vous pouvez exercer ces droits en nous contactant à ops@velocityjets.com.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050505] py-12 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-white/10">
          <span>&copy; {new Date().getFullYear()} VELOCITY AVIATION GROUP.</span>
          <div className="flex gap-6">
            <span>ICAO_REGULATORY_SYNC</span>
            <span>PLATINUM_ARGUS_SAFETY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
