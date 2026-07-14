"use client";

import React, { useState } from "react";
import { Mail, Phone, Clock, Heart } from "lucide-react";
import Link from "next/link";
import { Reveal } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const basePath = "/templates/impact-84";

  return (
    <div className="min-h-dvh bg-[#0C0C0A] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Nous contacter</p>
              <h1 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                Commencez votre<br /><em>parcours</em>
              </h1>
              <p className="text-[#6A6058] leading-relaxed mb-10">
                Toute prise en charge débute par une consultation médicale de 45 minutes. Bilan complet, diagnostic objectif, proposition de protocole personnalisé. Aucun geste sans accord éclairé. Consultation initiale gratuite et sans engagement.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5 mb-10">
                {[
                  { Icon: Mail, label: "Adresse", text: "Adresse physique communiquée sur simple demande à valentinmilliand@aevia.services" },
                  { Icon: Phone, label: "Téléphone", text: "+33 1 45 01 82 00" },
                  { Icon: Mail, label: "Email", text: "rdv@cypherclinic.fr" },
                  { Icon: Clock, label: "Horaires", text: "Lun – Ven : 9h – 19h · Sam : 9h – 16h" },
                ].map(({ Icon, label, text }) => (
                  <div key={label} className="flex items-start gap-4 text-sm">
                    <div className="w-8 h-8 border border-[#2A2520] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[#C9A86C]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#C9A86C] uppercase tracking-wider mb-0.5">{label}</div>
                      <div className="text-[#6A6058]">{text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="border border-[#2A2520] p-6 bg-[#141210]">
                <Heart className="w-5 h-5 text-[#C9A86C] mb-3" />
                <p className="text-sm font-light mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>Consultation initiale</p>
                <p className="text-xs text-[#5A5248] leading-relaxed">
                  Gratuite · 45 minutes · Sans engagement. Rencontrez votre médecin, discutez de vos objectifs et recevez un protocole personnalisé.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            {submitted ? (
              <div className="border border-[#C9A86C] p-12 text-center bg-[#141210]">
                <h2 className="text-2xl font-light mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Demande envoyée</h2>
                <p className="text-[#8A8278]">Merci, nous vous répondrons sous 24h.</p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                <div className="grid grid-cols-2 gap-4">
                  {["Prénom", "Nom"].map(f => (
                    <div key={f}>
                      <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">{f}</label>
                      <input className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={f} />
                    </div>
                  ))}
                </div>
                {[["Email", "email", "votre@email.fr"], ["Téléphone", "tel", "+33 6..."]].map(([label, type, ph]) => (
                  <div key={label}>
                    <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">{label}</label>
                    <input type={type} className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={ph} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">Votre message</label>
                  <textarea rows={5} className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" placeholder="Comment pouvons-nous vous aider ?" />
                </div>
                <button type="submit" className="w-full border border-[#C9A86C] text-[#C9A86C] py-4 text-xs tracking-widest uppercase hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
                  Envoyer
                </button>
                <p className="text-center">
                  <Link href={`${basePath}/rdv`} className="text-xs text-[#C9A86C] underline cursor-pointer hover:text-[#F0EBE0] transition-colors">
                    Remplir le formulaire de rendez-vous complet →
                  </Link>
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
