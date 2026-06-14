"use client";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <main className="pt-40 pb-20 max-w-[1400px] mx-auto px-6 md:px-12">
      <Reveal>
        <div className="max-w-3xl mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-6 block">
            LEGAL MENTIONS
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-10">
            MENTIONS LÉGALES.
          </h1>
          <p className="text-xl text-white/60 font-light leading-relaxed italic">
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
        <Reveal>
          <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-6">
              ÉDITEUR DU SITE
            </h3>
            <div className="space-y-4 text-sm text-white/60 font-light leading-relaxed">
              <p>
                Le site <strong>NeuralMesh</strong> est édité par :
              </p>
              <p className="font-mono text-cyan-400">
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
                <strong>Contact :</strong> mesh@neuralmesh.org
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-6">
              HÉBERGEMENT & CONCEPTION
            </h3>
            <div className="space-y-4 text-sm text-white/60 font-light leading-relaxed">
              <p>
                <strong>Hébergeur :</strong>
              </p>
              <p className="font-mono text-cyan-400">
                Aevia Web Solutions
              </p>
              <p>
                <strong>Adresse :</strong> Bourg-en-Bresse, France
              </p>
              <p>
                <strong>Directeur de la publication :</strong> Valentin Milliand
              </p>
              <p>
                <strong>Propriété intellectuelle :</strong>
              </p>
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
