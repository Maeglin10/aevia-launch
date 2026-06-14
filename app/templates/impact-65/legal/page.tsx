"use client";

import React from "react";
import { Reveal, GridBackground } from "../shared";

export default function LegalPage() {
  return (
    <div className="bg-[#050505] text-[#888] font-sans min-h-screen py-24 px-6 relative">
      <GridBackground />
      <div className="max-w-[800px] mx-auto relative z-10">
        
        {/* Header */}
        <Reveal>
          <div className="border-b border-white/5 pb-16 mb-24">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0070f3] block mb-6">Regulations</span>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
              Legal <br /> <span className="font-light not-italic opacity-20 text-white">Mentions.</span>
            </h1>
          </div>
        </Reveal>

        <div className="space-y-12 text-sm font-light leading-relaxed italic opacity-80">
          <div>
            <h2 className="text-lg font-black uppercase text-white tracking-wider mb-4">Éditeur</h2>
            <p>
              Ce site internet est édité par Aevia WS, entreprise individuelle de Valentin Milliand.
            </p>
            <p className="mt-2">
              <strong>SIREN :</strong> 852 546 225<br />
              <strong>RCS :</strong> Bourg-en-Bresse<br />
              <strong>Régime :</strong> Micro-entrepreneur (TVA non applicable, art. 293 B du CGI)<br />
              <strong>Contact :</strong> contact@aevia.io
            </p>
            <p className="mt-4 text-xs opacity-50">
              Adresse physique communiquée sur simple demande à contact@aevia.io (Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase text-white tracking-wider mb-4">Hébergement</h2>
            <p>
              Ce site est hébergé par Aevia WS.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase text-white tracking-wider mb-4">Propriété intellectuelle</h2>
            <p>
              Toute reproduction, représentation, modification ou exploitation totale ou partielle des contenus textuels ou visuels présents sur ce site est interdite sauf autorisation préalable écrite.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-black uppercase text-white tracking-wider mb-4">Données Personnelles (RGPD)</h2>
            <p>
              Les données personnelles collectées via les formulaires de ce site sont destinées à la qualification exclusive de vos demandes de devis et partenariats. Elles ne sont en aucun cas vendues ou cédées à des tiers. Vous disposez d’un droit d'accès et de suppression de vos données en écrivant à contact@aevia.io.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
