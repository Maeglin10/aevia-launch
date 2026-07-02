"use client";
// @ts-nocheck

import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <div className="py-20 bg-[#08080c] text-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-rose-500 mb-6 block text-center">
            Regulatory
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-center mb-16 leading-[1.15] pb-4">
            Mentions <span className="text-rose-500">Légales.</span>
          </h1>

          <div className="space-y-12 text-xs text-white/40 font-bold uppercase tracking-widest leading-relaxed">
            <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 shadow-sm">
              <h2 className="text-white text-sm mb-4">Éditeur du Site</h2>
              <p className="font-normal text-white/40 normal-case mb-2">
                Le site internet StreamHub est édité par :
              </p>
              <ul className="space-y-1 list-none p-0">
                <li>Nom : <span className="text-white">Valentin Milliand</span></li>
                <li>Régime : <span className="text-white">Micro-entrepreneur (TVA non applicable, art. 293 B du CGI)</span></li>
                <li>SIREN : <span className="text-white">852 546 225</span></li>
                <li>RCS : <span className="text-white">Bourg-en-Bresse</span></li>
                <li>Adresse : <span className="text-white italic">Adresse physique communiquée sur simple demande à valentinmilliand@aevia.services</span></li>
                <li>Contact : <a href="mailto:valentinmilliand@aevia.services" className="text-rose-500 hover:underline">valentinmilliand@aevia.services</a></li>
              </ul>
            </section>

            <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 shadow-sm">
              <h2 className="text-white text-sm mb-4">Hébergement</h2>
              <p className="font-normal text-white/40 normal-case mb-2">
                Le site internet est hébergé par :
              </p>
              <ul className="space-y-1 list-none p-0">
                <li>Hébergeur : <span className="text-white">Firebase App Hosting / Google Cloud</span></li>
                <li>Adresse : <span className="text-white">Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</span></li>
              </ul>
            </section>

            <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 shadow-sm">
              <h2 className="text-white text-sm mb-4">Propriété Intellectuelle</h2>
              <p className="font-normal text-white/40 normal-case leading-normal">
                Tous les contenus présents sur ce site (textes, images, graphismes, logos, icônes, animations) sont la propriété exclusive de l'éditeur ou de ses partenaires. Toute reproduction, distribution ou modification de ces éléments sans autorisation écrite préalable est strictement interdite.
              </p>
            </section>

            <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 shadow-sm">
              <h2 className="text-white text-sm mb-4">Limitation de Responsabilité</h2>
              <p className="font-normal text-white/40 normal-case leading-normal">
                L'éditeur s'efforce d'assurer l'exactitude des informations diffusées sur ce site mais ne saurait être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour. L'utilisation du site se fait sous la seule responsabilité de l'utilisateur.
              </p>
            </section>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
