// @ts-nocheck
"use client";

import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <div className="py-20 bg-[#faf9f6] text-[#33302c]">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#c9a84c] mb-6 block text-center">
            Regulatory
          </span>
          <h1 className="text-4xl md:text-6xl font-light uppercase tracking-tighter italic text-center mb-16 leading-[1.15] pb-4">
            Mentions <span className="text-[#c9a84c]">Légales.</span>
          </h1>

          <div className="space-y-12 text-xs text-stone-500 font-bold uppercase tracking-widest leading-relaxed">
            <section className="bg-white border border-stone-200/50 rounded-2xl p-8 shadow-sm">
              <h2 className="text-[#33302c] text-sm mb-4">Éditeur du Site</h2>
              <p className="font-normal text-stone-400 normal-case mb-2">
                Le site internet ZenSpace est édité par :
              </p>
              <ul className="space-y-1 list-none p-0">
                <li>Nom : <span className="text-[#33302c]">Valentin Milliand</span></li>
                <li>Régime : <span className="text-[#33302c]">Micro-entrepreneur (TVA non applicable, art. 293 B du CGI)</span></li>
                <li>SIREN : <span className="text-[#33302c]">852 546 225</span></li>
                <li>RCS : <span className="text-[#33302c]">Bourg-en-Bresse</span></li>
                <li>Adresse : <span className="text-[#33302c] italic">Adresse physique communiquée sur simple demande à contact@aevia.io</span></li>
                <li>Contact : <a href="mailto:contact@aevia.io" className="text-[#c9a84c] hover:underline">contact@aevia.io</a></li>
              </ul>
            </section>

            <section className="bg-white border border-stone-200/50 rounded-2xl p-8 shadow-sm">
              <h2 className="text-[#33302c] text-sm mb-4">Hébergement</h2>
              <p className="font-normal text-stone-400 normal-case mb-2">
                Le site internet est hébergé par :
              </p>
              <ul className="space-y-1 list-none p-0">
                <li>Hébergeur : <span className="text-[#33302c]">Firebase App Hosting / Google Cloud</span></li>
                <li>Adresse : <span className="text-[#33302c]">Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</span></li>
              </ul>
            </section>

            <section className="bg-white border border-stone-200/50 rounded-2xl p-8 shadow-sm">
              <h2 className="text-[#33302c] text-sm mb-4">Propriété Intellectuelle</h2>
              <p className="font-normal text-stone-400 normal-case leading-normal">
                Tous les contenus présents sur ce site (textes, images, graphismes, logos, icônes) sont la propriété exclusive de l'éditeur ou de ses partenaires. Toute reproduction, distribution ou modification de ces éléments sans autorisation préalable est strictement interdite.
              </p>
            </section>

            <section className="bg-white border border-stone-200/50 rounded-2xl p-8 shadow-sm">
              <h2 className="text-[#33302c] text-sm mb-4">Limitation de Responsabilité</h2>
              <p className="font-normal text-stone-400 normal-case leading-normal">
                L'éditeur s'efforce d'assurer l'exactitude des informations diffusées sur ce site mais ne saurait être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour. L'utilisation du site se fait sous la seule responsabilité de l'utilisateur.
              </p>
            </section>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
