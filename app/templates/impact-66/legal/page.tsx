"use client";

import React from "react";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <div className="bg-[#faf9f6] text-[#1a1814] py-24 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        
        {/* Header */}
        <Reveal>
          <div className="border-b border-[#1a1814]/10 pb-12 mb-20">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#c9b7a1] mb-6 block">
              Regulations
            </span>
            <h1 className="text-5xl md:text-6xl font-light tracking-tighter uppercase leading-[1.15] text-[#1a1814]">
              Legal <span className="italic text-[#c9b7a1]">Terms.</span>
            </h1>
          </div>
        </Reveal>

        <div className="space-y-12 text-sm leading-relaxed text-[#1a1814]/70">
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-[#1a1814] mb-4">Éditeur</h2>
            <p>
              Ce site internet est édité par Aevia WS, entreprise individuelle de Valentin Milliand.
            </p>
            <p className="mt-2">
              <strong>SIREN :</strong> 852 546 225<br />
              <strong>RCS :</strong> Bourg-en-Bresse<br />
              <strong>Régime :</strong> Micro-entrepreneur (TVA non applicable, art. 293 B du CGI)<br />
              <strong>Contact :</strong> valentinmilliand@aevia.services
            </p>
            <p className="mt-4 text-xs italic text-[#1a1814]/40">
              Adresse physique communiquée sur simple demande à valentinmilliand@aevia.services (Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse).
            </p>
          </div>

          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-[#1a1814] mb-4">Hébergement</h2>
            <p>
              Ce site est hébergé par la plateforme d'hébergement Aevia WS.
            </p>
          </div>

          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-[#1a1814] mb-4">Propriété Intellectuelle</h2>
            <p>
              L’ensemble des contenus présents sur ce site (textes, visuels, logos, code source) est la propriété exclusive de l'éditeur ou de ses partenaires. Toute reproduction, représentation ou distribution est strictement interdite sans consentement écrit préalable.
            </p>
          </div>

          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-[#1a1814] mb-4">Données Personnelles & CGU</h2>
            <p>
              Les informations collectées dans l'espace de réservation de soin et les formulaires sont destinées uniquement au traitement de vos rendez-vous et ne sont en aucun cas vendues ou partagées avec des tiers. Conformément au règlement général sur la protection des données (RGPD), vous disposez d'un droit d'accès et d'effacement en contactant valentinmilliand@aevia.services.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
