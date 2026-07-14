"use client";

import React from "react";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <section className="py-24 bg-[#0C0C0A] min-h-dvh text-[#6A6058] font-sans">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <h1 className="text-3xl md:text-4xl font-light mb-12 text-[#F0EBE0]" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Mentions Légales
          </h1>

          <div className="space-y-10 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Éditeur du site</h2>
              <p>Ce site est édité par <strong className="text-[#C9A86C]">Valentin Milliand</strong> (propriétaire de l&apos;enseigne Aevia WS), auto-entrepreneur immatriculé au registre du commerce et des sociétés de Bourg-en-Bresse sous le numéro SIREN <strong className="text-[#C9A86C]">852 546 225</strong>.</p>
              <p className="mt-3">Email de contact : <a href="mailto:valentinmilliand@aevia.services" className="text-[#C9A86C] hover:text-[#F0EBE0] transition-colors">valentinmilliand@aevia.services</a></p>
              <p className="mt-1">Adresse du siège social : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à valentinmilliand@aevia.services).</p>
            </div>
            
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Régime Fiscal</h2>
              <p>Régime micro-entrepreneur. TVA non applicable, article 293 B du Code Général des Impôts (CGI).</p>
            </div>

            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Directeur de publication</h2>
              <p>Le directeur de publication est Valentin Milliand.</p>
            </div>
            
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Hébergement</h2>
              <p>Ce site est hébergé par <strong className="text-[#C9A86C]">Vercel Inc.</strong>, 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.</p>
            </div>
            
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Conditions d&apos;utilisation</h2>
              <p>
                L&apos;utilisation de ce site se fait sous votre seule responsabilité. L&apos;ensemble des informations publiées le sont à titre informatif uniquement et ne sauraient en aucun cas remplacer une consultation médicale.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
