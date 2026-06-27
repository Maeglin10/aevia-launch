"use client";

import React from "react";
import Link from "next/link";
import { Plane, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function CGU() {
  return (
    <div className="premium-theme min-h-screen bg-[#050505] text-[#ffffff] font-sans selection:bg-[#00f2ff] selection:text-black">
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
              Conditions
            </span>
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-8">
              Conditions Générales <span className="not-italic font-thin text-white">d'Utilisation.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto prose prose-invert prose-p:text-white/40 prose-p:font-light prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:italic prose-headings:tracking-tight prose-a:text-[#00f2ff] hover:prose-a:text-white prose-a:transition-colors">
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) encadrent juridiquement l'utilisation des services du site VELOCITY AVIATION GROUP. L'accès au site implique l'acceptation sans réserve des présentes CGU.
          </p>

          <h2>2. Accès au site</h2>
          <p>
            Le site est accessible gratuitement en tout lieu à tout utilisateur ayant un accès à Internet. Tous les frais supportés par l'utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.
          </p>

          <h2>3. Réservation et vols</h2>
          <p>
            Les informations sur la disponibilité des appareils, les tarifs et les temps de vol sont données à titre indicatif. Toute demande de vol via notre formulaire fera l'objet d'un devis formel envoyé par notre équipe d'opérations. Ce devis constituera l'offre contractuelle ferme.
          </p>

          <h2>4. Responsabilité</h2>
          <p>
            VELOCITY AVIATION GROUP s'efforce de fournir sur son site des informations aussi précises que possible. Toutefois, la société ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
          </p>

          <h2>5. Droit applicable</h2>
          <p>
            Les présentes conditions générales d'utilisation sont régies par la loi applicable en vigueur. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents seront saisis.
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
