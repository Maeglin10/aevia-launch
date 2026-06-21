"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { PROTOCOLS, SPECIALISTS, Reveal } from "../shared";

export default function RdvPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#0C0C0A] py-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Prise en charge</p>
          <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Demande de <em>rendez-vous</em>
          </h1>
          <p className="text-[#6A6058] leading-relaxed mb-12">
            La consultation initiale (45 min) est gratuite et sans engagement. Notre coordinatrice vous contacte sous 24h ouvrées pour confirmer votre créneau.
          </p>
        </Reveal>

        {submitted ? (
          <Reveal>
            <div className="border border-[#C9A86C] p-12 text-center bg-[#141210]">
              <CheckCircle className="w-12 h-12 text-[#C9A86C] mx-auto mb-6" />
              <h2 className="text-2xl font-light mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Demande reçue</h2>
              <p className="text-[#8A8278] leading-relaxed">
                Merci, nous vous répondrons sous 24h.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom / Prénom */}
              <div className="grid grid-cols-2 gap-4">
                {["Prénom *", "Nom *"].map(f => (
                  <div key={f}>
                    <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">{f}</label>
                    <input required className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={f.replace(" *", "")} />
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">Email *</label>
                  <input required type="email" className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder="votre@email.fr" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">Téléphone *</label>
                  <input required type="tel" className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder="+33 6..." />
                </div>
              </div>

              {/* Âge */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">Âge * (18 ans minimum)</label>
                <input required type="number" min="18" max="99" className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder="Votre âge" />
              </div>

              {/* Protocole */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">Traitement souhaité</label>
                <select className="w-full bg-[#141210] border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors">
                  <option value="">Consultation initiale — bilan complet (conseillé)</option>
                  {PROTOCOLS.map(p => <option key={p.id} value={p.id}>{p.label} — {p.price}</option>)}
                </select>
              </div>

              {/* Médecin */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">Préférence médecin</label>
                <select className="w-full bg-[#141210] border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors">
                  <option value="">Sans préférence</option>
                  {SPECIALISTS.map(s => <option key={s.name} value={s.name}>{s.name} — {s.spec}</option>)}
                </select>
              </div>

              {/* Type consultation */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-3">Type de consultation</label>
                <div className="grid grid-cols-2 gap-3">
                  {[["Première consultation (gratuite)", "premiere"], ["Consultation de suivi", "suivi"]].map(([label, val]) => (
                    <label key={val} className="flex items-center gap-3 border border-[#2A2520] p-4 cursor-pointer hover:border-[#C9A86C] transition-colors has-[:checked]:border-[#C9A86C] has-[:checked]:bg-[#1A1714]">
                      <input type="radio" name="consultation-type" value={val} className="accent-[#C9A86C]" defaultChecked={val === "premiere"} />
                      <span className="text-xs text-[#8A8278]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">Date souhaitée</label>
                  <input type="date" className="w-full bg-[#141210] border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">Créneau préféré</label>
                  <select className="w-full bg-[#141210] border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors">
                    <option>Matin (9h – 12h)</option>
                    <option>Après-midi (14h – 17h)</option>
                    <option>Fin de journée (17h – 19h)</option>
                  </select>
                </div>
              </div>

              {/* Antécédents */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">Antécédents médicaux & allergies</label>
                <textarea rows={4} className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" placeholder="Merci de mentionner toute allergie connue, traitement en cours ou antécédent médical pertinent..." />
              </div>

              <p className="text-[10px] text-[#3A3028] leading-relaxed">
                Les informations recueillies sont destinées à Cypher Clinic afin de traiter votre demande de rendez-vous. Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès et de suppression — contact@aevia.io.
              </p>

              <button type="submit" className="w-full border border-[#C9A86C] text-[#C9A86C] py-4 text-xs tracking-widest uppercase hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
                Envoyer ma demande
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </div>
  );
}
