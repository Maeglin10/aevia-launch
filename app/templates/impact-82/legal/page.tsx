"use client"

import React from "react"
import { Shield, FileText, UserCheck, HelpCircle } from "lucide-react"
import { Reveal } from "../shared"

export default function LegalPage() {
  return (
    <div className="bg-[#F7F5F2] pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Reveal>
          <div className="mb-12 border-b border-[#E0D8CC] pb-8">
            <h1 className="text-4xl font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Mentions <em>légales</em>
            </h1>
            <p className="text-[#8A7860] text-sm mt-3 font-light uppercase tracking-wider">
              Dernière mise à jour : Juin 2026
            </p>
          </div>
        </Reveal>

        <div className="space-y-10">
          {/* Éditeur du Site */}
          <Reveal delay={0.05}>
            <div className="bg-white border border-[#E0D8CC] p-8 hover:border-[#C9A86C] transition-colors duration-300">
              <div className="flex items-center gap-3 text-[#C9A86C] mb-4">
                <UserCheck className="w-5 h-5" />
                <h2 className="text-lg font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Éditeur du site</h2>
              </div>
              <div className="text-[#6B5A40] text-sm font-light space-y-2.5 leading-relaxed">
                <p>
                  Le présent site est édité par <strong className="text-[#1A1612] font-semibold">Valentin Milliand</strong>, sous le régime micro-entrepreneur.
                </p>
                <p>
                  <strong className="text-[#1A1612] font-semibold">SIREN :</strong> 852 546 225
                </p>
                <p>
                  <strong className="text-[#1A1612] font-semibold">RCS :</strong> Bourg-en-Bresse
                </p>
                <p>
                  <strong className="text-[#1A1612] font-semibold">Adresse physique :</strong> adresse physique communiquée sur simple demande à{" "}
                  <a href="mailto:contact@aevia.io" className="text-[#C9A86C] underline hover:text-[#1A1612] transition-colors">
                    contact@aevia.io
                  </a>.
                </p>
                <p>
                  <strong className="text-[#1A1612] font-semibold">Contact :</strong>{" "}
                  <a href="mailto:contact@aevia.io" className="text-[#C9A86C] underline hover:text-[#1A1612] transition-colors">
                    contact@aevia.io
                  </a>
                </p>
              </div>
            </div>
          </Reveal>

          {/* Hébergement */}
          <Reveal delay={0.1}>
            <div className="bg-white border border-[#E0D8CC] p-8 hover:border-[#C9A86C] transition-colors duration-300">
              <div className="flex items-center gap-3 text-[#C9A86C] mb-4">
                <Shield className="w-5 h-5" />
                <h2 className="text-lg font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Hébergement du site</h2>
              </div>
              <div className="text-[#6B5A40] text-sm font-light leading-relaxed">
                <p className="mb-2">
                  Le présent site est hébergé par la société <strong className="text-[#1A1612] font-semibold">Vercel Inc.</strong>
                </p>
                <p className="mb-2">
                  Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
                </p>
                <p>
                  Site internet :{" "}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#C9A86C] underline hover:text-[#1A1612] transition-colors">
                    vercel.com
                  </a>
                </p>
              </div>
            </div>
          </Reveal>

          {/* Propriété Intellectuelle */}
          <Reveal delay={0.15}>
            <div className="bg-white border border-[#E0D8CC] p-8 hover:border-[#C9A86C] transition-colors duration-300">
              <div className="flex items-center gap-3 text-[#C9A86C] mb-4">
                <FileText className="w-5 h-5" />
                <h2 className="text-lg font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Propriété intellectuelle</h2>
              </div>
              <div className="text-[#6B5A40] text-sm font-light leading-relaxed space-y-3">
                <p>
                  L&apos;ensemble des contenus (images, textes, logos, designs, codes source) présentés sur ce site est protégé par les lois internationales et françaises sur la propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, distribution, modification ou utilisation, totale ou partielle, de ces éléments sans autorisation écrite expresse de l&apos;éditeur est strictement interdite et peut faire l&apos;objet de poursuites judiciaires.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Conditions Générales d'Utilisation */}
          <Reveal delay={0.2}>
            <div className="bg-white border border-[#E0D8CC] p-8 hover:border-[#C9A86C] transition-colors duration-300">
              <div className="flex items-center gap-3 text-[#C9A86C] mb-4">
                <HelpCircle className="w-5 h-5" />
                <h2 className="text-lg font-normal font-serif text-[#1A1612]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Conditions d&apos;utilisation</h2>
              </div>
              <div className="text-[#6B5A40] text-sm font-light leading-relaxed space-y-3">
                <p>
                  L&apos;utilisation de ce site implique l&apos;acceptation pleine et entière des mentions légales décrites ci-dessus. L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées, mais ne saurait être tenu responsable d&apos;éventuelles erreurs ou omissions.
                </p>
                <p>
                  Pour toute réclamation, demande d&apos;autorisation ou question relative à l&apos;utilisation de nos contenus, merci de nous écrire directement à{" "}
                  <a href="mailto:contact@aevia.io" className="text-[#C9A86C] underline hover:text-[#1A1612] transition-colors">
                    contact@aevia.io
                  </a>.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
