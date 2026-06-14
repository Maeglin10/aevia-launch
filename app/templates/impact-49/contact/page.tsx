"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Reveal } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-40 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <div className="max-w-3xl mb-20">
          <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-3">
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1B4B] mb-6">
            Besoin d'aide ou d'un conseil ?
          </h1>
          <p className="text-[#6B7280] font-medium leading-relaxed italic">
            Une question sur un parcours, une demande d'adaptation d'un cours pour vos équipes, ou simplement envie de nous dire bonjour ? Écrivez-nous !
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Contact info list */}
        <div className="space-y-6">
          <Reveal>
            <div className="p-8 rounded-[2rem] bg-white border border-[#E5E7EB] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#1E1B4B] mb-1">Email</h4>
                <p className="text-sm text-[#6B7280] font-medium mb-1">
                  support@skillbridge.fr
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  Réponse moyenne sous 2 heures
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="p-8 rounded-[2rem] bg-white border border-[#E5E7EB] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#1E1B4B] mb-1">Téléphone</h4>
                <p className="text-sm text-[#6B7280] font-medium mb-1">
                  +33 4 74 12 34 56
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  Du lundi au vendredi de 9h à 18h
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="p-8 rounded-[2rem] bg-white border border-[#E5E7EB] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#1E1B4B] mb-1">Siège social</h4>
                <p className="text-sm text-[#6B7280] font-medium">
                  Bourg-en-Bresse, France
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Reveal>
            <div className="p-10 md:p-12 rounded-[2.5rem] bg-white border border-[#E5E7EB] shadow-sm">
              {submitted ? (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-extrabold text-[#1E1B4B] mb-4">
                    Message bien reçu !
                  </h3>
                  <p className="text-sm text-[#6B7280] font-medium italic">
                    Merci pour votre message. Notre équipe va l'étudier et vous répondre au plus vite.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-2">
                        Prénom & Nom
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3.5 text-[#1E1B4B] text-sm focus:border-[#6366F1] focus:outline-none transition-colors"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3.5 text-[#1E1B4B] text-sm focus:border-[#6366F1] focus:outline-none transition-colors"
                        placeholder="jean@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3.5 text-[#1E1B4B] text-sm focus:border-[#6366F1] focus:outline-none transition-colors"
                      placeholder="Ex: Renseignement parcours Frontend"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3.5 text-[#1E1B4B] text-sm focus:border-[#6366F1] focus:outline-none transition-colors"
                      placeholder="Comment pouvons-nous vous aider ?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#6366F1] text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-[#4F46E5] transition-colors"
                  >
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
