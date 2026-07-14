"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Reveal } from "../shared";

export default function VisitePage() {
  const [formData, setFormData] = useState({
    experience: "classique",
    date: "",
    groupSize: "",
    nom: "",
    email: "",
    telephone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const experiences = [
    {
      id: "classique",
      title: "Visite & Dégustation Classique",
      duration: "1h30",
      price: "25 € / pers.",
      group: "6 à 15 personnes",
      description: "Découverte du vignoble et des chais, dégustation de 3 millésimes commentée par notre équipe.",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80&fit=crop",
      includes: ["Visite guidée du vignoble", "Visite des chais et cuvier", "Dégustation 3 millésimes", "Livret du domaine offert"]
    },
    {
      id: "prestige",
      title: "Visite Prestige avec Déjeuner",
      duration: "4h",
      price: "120 € / pers.",
      group: "Max. 8 personnes",
      description: "Immersion complète : vignoble, chais historiques, caves, suivie d'un déjeuner gastronomique au Château.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop",
      includes: ["Visite approfondie en petit groupe", "Accès aux caves du XVIIIe siècle", "Déjeuner 4 services au Château", "Dégustation verticale 6 millésimes", "1 bouteille offerte"]
    },
    {
      id: "seminaire",
      title: "Séminaire & Événements Privés",
      duration: "Sur mesure",
      price: "Sur devis",
      group: "Jusqu'à 50 personnes",
      description: "La salle de réception du Château accueille vos événements d'entreprise, lancements de produits ou célébrations privées.",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80&fit=crop",
      includes: ["Salle historique de 50 personnes", "Traiteur partenaire sur demande", "Programme œnologique personnalisé", "Hébergement partenaire disponible", "Devis sur mesure sous 48h"]
    },
    {
      id: "vendanges",
      title: "Week-end Vendanges",
      duration: "2 jours / 1 nuit",
      price: "380 € / pers.",
      group: "Max. 12 personnes",
      description: "En octobre, vivez les vendanges de l'intérieur. Cueillez le raisin aux côtés de notre équipe, vinifiez votre propre cuvée.",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80&fit=crop",
      includes: ["Participation aux vendanges manuelles", "Vinification guidée par le Maître de Chai", "Nuit en chambre d'hôtes partenaire", "2 dîners et 1 déjeuner au Château", "6 bouteilles personnalisées offertes"]
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-dvh bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1600&q=80&fit=crop"
          alt="Visite du domaine"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans font-bold">Sur Rendez-vous</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight leading-none pb-2">Visites & Expériences</h1>
          </Reveal>
        </div>
      </section>

      {/* Experiences */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
          {experiences.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 0.1}>
              <div
                className={`bg-white border overflow-hidden transition-all duration-300 cursor-pointer ${formData.experience === exp.id ? "border-[#2D1B0E] shadow-2xl" : "border-[#2D1B0E]/8 hover:shadow-lg"}`}
                onClick={() => setFormData(prev => ({ ...prev, experience: exp.id }))}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={exp.image} alt={exp.title} fill className="object-cover" loading="lazy" />
                  {formData.experience === exp.id && (
                    <div className="absolute inset-0 bg-[#2D1B0E]/40 flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-[#C4A265]" />
                    </div>
                  )}
                </div>
                <div className="p-8 font-sans">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs uppercase tracking-widest text-[#C4A265] font-bold">{exp.duration}</div>
                    <div className="text-lg font-serif text-[#2D1B0E]">{exp.price}</div>
                  </div>
                  <h3 className="text-xl font-serif text-[#2D1B0E] mb-2 leading-snug pb-1">{exp.title}</h3>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-4">{exp.group}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">{exp.description}</p>
                  <ul className="space-y-2">
                    {exp.includes.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-zinc-600">
                        <CheckCircle2 className="w-4 h-4 text-[#C4A265] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Booking Form */}
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-px w-12 bg-[#C4A265] mx-auto mb-6" />
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#C4A265] font-bold mb-4 font-sans">Réservation</h2>
              <h3 className="text-3xl font-serif text-[#2D1B0E] leading-snug pb-1">Réserver votre visite</h3>
            </div>

            {submitted ? (
              <div className="bg-[#2D1B0E] text-white p-12 text-center font-sans">
                <CheckCircle2 className="w-12 h-12 text-[#C4A265] mx-auto mb-6" />
                <h4 className="text-2xl font-serif mb-4 leading-snug pb-1">Demande envoyée</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Merci, nous vous répondrons sous 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[#2D1B0E]/8 p-10 font-sans space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Expérience choisie</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm text-[#2D1B0E] focus:outline-none focus:border-[#2D1B0E] bg-white"
                  >
                    {experiences.map(exp => (
                      <option key={exp.id} value={exp.id}>{exp.title} — {exp.price}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Date souhaitée</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Nombre de personnes</label>
                    <input
                      type="number"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleChange}
                      placeholder="Ex. 4"
                      min={1}
                      required
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Nom & Prénom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Message (optionnel)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#2D1B0E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4A2820] transition-colors font-sans"
                >
                  Envoyer ma demande de réservation
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
