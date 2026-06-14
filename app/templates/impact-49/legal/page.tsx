"use client";

import React from "react";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <main className="pt-40 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <div className="max-w-3xl mb-20">
          <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-3">
            Mentions Légales
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1B4B] mb-6">
            Mentions Légales & CGU
          </h1>
          <p className="text-[#6B7280] font-medium leading-relaxed italic">
            Conformément aux dispositions de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        <Reveal>
          <div className="p-10 md:p-12 rounded-[2.5rem] bg-white border border-[#E5E7EB] shadow-sm space-y-6">
            <h3 className="font-extrabold text-2xl text-[#1E1B4B] mb-6">
              Éditeur du site
            </h3>
            <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed">
              <p>
                Le site <strong>Skillbridge</strong> est édité par :
              </p>
              <p className="font-semibold text-[#6366F1]">
                Valentin Milliand, micro-entrepreneur
              </p>
              <p>
                <strong>SIREN :</strong> 852 546 225
              </p>
              <p>
                <strong>RCS :</strong> Bourg-en-Bresse
              </p>
              <p>
                <strong>Siège social :</strong> Bourg-en-Bresse, France
              </p>
              <p>
                <strong>Contact :</strong> support@skillbridge.fr
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="p-10 md:p-12 rounded-[2.5rem] bg-white border border-[#E5E7EB] shadow-sm space-y-6">
            <h3 className="font-extrabold text-2xl text-[#1E1B4B] mb-6">
              Hébergement & Réalisation
            </h3>
            <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed">
              <p>
                <strong>Hébergeur :</strong>
              </p>
              <p className="font-semibold text-[#6366F1]">
                Aevia Web Solutions
              </p>
              <p>
                <strong>Siège de l'hébergeur :</strong> Bourg-en-Bresse, France
              </p>
              <p>
                <strong>Directeur de la publication :</strong> Valentin Milliand
              </p>
              <p>
                <strong>Propriété intellectuelle :</strong>
              </p>
              <p>
                Tous les textes, illustrations, codes et designs présents sur ce site sont la propriété exclusive de Skillbridge et de ses partenaires, protégés par le droit d'auteur.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
