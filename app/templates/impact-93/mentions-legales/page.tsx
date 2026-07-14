"use client";

import React from "react";
import Link from "next/link";
import { Plane, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function MentionsLegales() {
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
              Légal
            </span>
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-8">
              Mentions <span className="not-italic font-thin text-white">Légales.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto prose prose-invert prose-p:text-white/40 prose-p:font-light prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:italic prose-headings:tracking-tight prose-a:text-[#00f2ff] hover:prose-a:text-white prose-a:transition-colors">
          <h2>1. Éditeur du site</h2>
          <p>
            Le présent site est édité par VELOCITY AVIATION GROUP, dont le siège social est situé au Teterboro Airport (KTEB), NJ.
          </p>
          <p>
            Directeur de la publication : Le CEO de VELOCITY AVIATION GROUP.
          </p>

          <h2>2. Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
          </p>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
          </p>

          <h2>4. Limites de responsabilité</h2>
          <p>
            Les informations contenues sur ce site sont aussi précises que possibles et le site est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes. Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par courriel à ops@velocityjets.com en décrivant le problème de la manière la plus précise possible.
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
