"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Calendar, CheckCircle2 } from "lucide-react";
import { Reveal } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1559131397-f94da358f7ca?w=1600&q=80&fit=crop"
          alt="Contact Château Vestige"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans font-bold">Disponible sur Rendez-vous</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight leading-none pb-2">Contact</h1>
          </Reveal>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <Reveal>
            <div className="font-sans">
              <h2 className="text-3xl font-serif text-[#2D1B0E] mb-10 leading-snug pb-1">Nous Contacter</h2>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#2D1B0E] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Adresse</div>
                    <p className="text-zinc-700 text-sm leading-relaxed">
                      Adresse communiquée sur demande à <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a>.<br />
                      Appellation Margaux-Cantenac, Gironde, France.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#2D1B0E] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Téléphone</div>
                    <p className="text-zinc-700 text-sm">+33 (0)5 56 00 00 00</p>
                    <p className="text-xs text-zinc-400 mt-1">Lun–Ven · 9h–17h · Hors juillet–août sur RDV</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#2D1B0E] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Email</div>
                    <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] text-sm hover:text-[#C4A265] transition-colors">
                      contact@aevia.io
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#2D1B0E] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#C4A265]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Visites</div>
                    <p className="text-zinc-700 text-sm leading-relaxed">
                      Le domaine est ouvert aux visites uniquement sur rendez-vous. Merci de nous contacter pour planifier votre venue.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#2D1B0E]/5 border border-[#2D1B0E]/10 p-6">
                <div className="text-xs uppercase tracking-widest text-[#C4A265] font-bold font-sans mb-3">Commandes Professionnelles</div>
                <p className="text-sm text-zinc-600 font-sans leading-relaxed">
                  Pour les commandes professionnelles (négoce, restauration, grandes surfaces spécialisées), contactez notre service caveau directement à <a href="mailto:contact@aevia.io" className="text-[#2D1B0E] underline underline-offset-2">contact@aevia.io</a>.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Contact form */}
          <Reveal delay={0.15}>
            {submitted ? (
              <div className="bg-[#2D1B0E] text-white p-16 text-center font-sans">
                <CheckCircle2 className="w-12 h-12 text-[#C4A265] mx-auto mb-6" />
                <h3 className="text-2xl font-serif mb-4 leading-snug pb-1">Merci</h3>
                <p className="text-zinc-300 text-sm">Merci, nous vous répondrons sous 24h.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-5 font-sans">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Nom & Prénom</label>
                  <input type="text" name="nom" value={form.nom} onChange={handleChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Sujet</label>
                  <select name="sujet" value={form.sujet} onChange={handleChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E] bg-white">
                    <option value="">Choisir un sujet…</option>
                    <option value="commande">Commande de vins</option>
                    <option value="visite">Réservation visite</option>
                    <option value="professionnel">Commande professionnelle</option>
                    <option value="presse">Presse & Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E] resize-none" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#2D1B0E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4A2820] transition-colors">
                  Envoyer
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
