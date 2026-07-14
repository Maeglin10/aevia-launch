"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Info } from "lucide-react";
import { APPLICATION_STEPS, Reveal, StyleInjector } from "../shared";

type FormData = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  retraite: string;
  dates: string;
  motivation: string;
  decouverte: string;
};

const INITIAL_FORM: FormData = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  retraite: "",
  dates: "",
  motivation: "",
  decouverte: "",
};

export default function ApplyPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [activeStep, setActiveStep] = useState(0);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.prenom.trim()) newErrors.prenom = "Requis";
    if (!form.nom.trim()) newErrors.nom = "Requis";
    if (!form.email.includes("@")) newErrors.email = "Email invalide";
    if (!form.retraite) newErrors.retraite = "Veuillez choisir une retraite";
    if (form.motivation.trim().length < 200)
      newErrors.motivation = `Minimum 200 caractères (${form.motivation.trim().length}/200)`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full bg-[#f8f5f0] border ${
      errors[field] ? "border-red-400" : "border-black/10"
    } px-5 py-4 text-sm text-[#2a2a2a] outline-none focus:border-[#3d7a5e] transition-colors rounded-sm font-sans placeholder:text-black/25`;

  const labelClass =
    "block text-[10px] uppercase tracking-[0.35em] text-black/40 font-bold mb-2 font-sans";

  return (
    <div className="min-h-dvh bg-[#f8f5f0]">
      <StyleInjector />

      {/* ==========================================
          HERO
          ========================================== */}
      <section className="pt-24 pb-20 px-6 md:px-12 bg-[#2a2a2a]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-6 font-sans font-bold">
              Processus de candidature · Programme 2026
            </p>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-[#f8f5f0] mb-8 leading-tight"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Candidater
              <br />
              <span className="font-light italic" style={{ fontFamily: "Lora, Georgia, serif" }}>
                au programme
              </span>
            </h1>
            <p
              className="max-w-xl text-lg text-[#f8f5f0]/40 leading-relaxed"
              style={{ fontFamily: "Lora, Georgia, serif" }}
            >
              Chaque candidature est examinée individuellement. Nous répondons sous 48 heures ouvrées.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          APPLICATION STEPS — horizontal stepper
          ========================================== */}
      <section className="py-16 px-6 md:px-12 bg-[#f8f5f0] border-b border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d7a5e] mb-8 font-sans font-bold">
              Le processus en 4 étapes
            </p>
          </Reveal>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-7 left-0 right-0 h-[1px] bg-black/5 z-0" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              {APPLICATION_STEPS.map((step, i) => (
                <Reveal key={step.step} delay={i * 0.1}>
                  <button
                    onClick={() => setActiveStep(i)}
                    className="text-left bg-transparent border-none cursor-pointer group"
                  >
                    {/* Step node */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-all duration-300 ${
                        activeStep === i
                          ? "bg-[#3d7a5e] text-white shadow-lg"
                          : "bg-white border border-black/10 text-black/30 group-hover:border-[#3d7a5e]/40 group-hover:text-[#3d7a5e]"
                      }`}
                    >
                      <span
                        className="text-base font-semibold"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {step.step}
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-bold uppercase tracking-wide mb-2 transition-colors ${
                        activeStep === i ? "text-[#3d7a5e]" : "text-[#2a2a2a]"
                      }`}
                      style={{ fontFamily: "Cinzel, Georgia, serif" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-xs text-black/40 leading-relaxed"
                      style={{ fontFamily: "Lora, Georgia, serif" }}
                    >
                      {step.desc}
                    </p>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FORM
          ========================================== */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[800px] mx-auto">
          <AnimatePresence mode="wait">
            {submitted ? (
              /* Success state */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-[#3d7a5e] flex items-center justify-center mx-auto mb-10 shadow-xl">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#2a2a2a] mb-4"
                  style={{ fontFamily: "Cinzel, Georgia, serif" }}
                >
                  Candidature reçue
                </h2>
                <p
                  className="text-lg text-black/50 leading-relaxed mb-4 max-w-md mx-auto"
                  style={{ fontFamily: "Lora, Georgia, serif" }}
                >
                  Merci, nous vous répondrons sous 24h.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/templates/impact-59/retreats"
                    className="inline-flex items-center gap-3 px-10 py-4 border border-black/10 text-[#2a2a2a] text-[10px] uppercase tracking-[0.4em] font-bold font-sans hover:bg-black hover:text-white transition-colors rounded-full"
                    style={{ textDecoration: "none" }}
                  >
                    Voir les retraites
                  </Link>
                  <Link
                    href="/templates/impact-59"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-[#3d7a5e] text-white text-[10px] uppercase tracking-[0.4em] font-bold font-sans hover:bg-[#2a5e45] transition-colors rounded-full"
                    style={{ textDecoration: "none" }}
                  >
                    Retour à l&apos;accueil
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* Form */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Reveal>
                  <h2
                    className="text-3xl font-bold uppercase tracking-tight text-[#2a2a2a] mb-3"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    Votre candidature
                  </h2>
                  <p
                    className="text-sm text-black/40 leading-relaxed mb-12"
                    style={{ fontFamily: "Lora, Georgia, serif" }}
                  >
                    Toutes les informations ci-dessous sont traitées de manière strictement confidentielle et utilisées uniquement pour évaluer la compatibilité avec notre programme.
                  </p>
                </Reveal>

                <form onSubmit={handleSubmit} noValidate className="space-y-8">
                  {/* Name row */}
                  <Reveal delay={0.05}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>Prénom *</label>
                        <input
                          type="text"
                          name="prenom"
                          value={form.prenom}
                          onChange={handleChange}
                          placeholder="Marie"
                          className={inputClass("prenom")}
                        />
                        {errors.prenom && (
                          <p className="text-red-400 text-[10px] mt-1 font-sans">{errors.prenom}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>Nom *</label>
                        <input
                          type="text"
                          name="nom"
                          value={form.nom}
                          onChange={handleChange}
                          placeholder="Dupont"
                          className={inputClass("nom")}
                        />
                        {errors.nom && (
                          <p className="text-red-400 text-[10px] mt-1 font-sans">{errors.nom}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>

                  {/* Contact row */}
                  <Reveal delay={0.08}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="marie@example.com"
                          className={inputClass("email")}
                        />
                        {errors.email && (
                          <p className="text-red-400 text-[10px] mt-1 font-sans">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>Téléphone</label>
                        <input
                          type="tel"
                          name="telephone"
                          value={form.telephone}
                          onChange={handleChange}
                          placeholder="+33 6 00 00 00 00"
                          className={inputClass("telephone")}
                        />
                      </div>
                    </div>
                  </Reveal>

                  {/* Retreat select */}
                  <Reveal delay={0.1}>
                    <div>
                      <label className={labelClass}>Retraite souhaitée *</label>
                      <select
                        name="retraite"
                        value={form.retraite}
                        onChange={handleChange}
                        className={`${inputClass("retraite")} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>
                          Choisissez une retraite...
                        </option>
                        <option value="Sonoran Silence — Arizona Desert (Oct–Apr, dès $4,200)">
                          Sonoran Silence — Arizona Desert (Oct–Apr · dès $4,200)
                        </option>
                        <option value="Icelandic Deep Reset — Islande (Jun–Aug, dès $5,800)">
                          Icelandic Deep Reset — Islande (Jun–Aug · dès $5,800)
                        </option>
                        <option value="Kyoto Forest Immersion — Japon (Mar–May, dès $6,100)">
                          Kyoto Forest Immersion — Japon (Mar–May · dès $6,100)
                        </option>
                      </select>
                      {errors.retraite && (
                        <p className="text-red-400 text-[10px] mt-1 font-sans">{errors.retraite}</p>
                      )}
                    </div>
                  </Reveal>

                  {/* Preferred dates */}
                  <Reveal delay={0.12}>
                    <div>
                      <label className={labelClass}>Dates préférées</label>
                      <input
                        type="text"
                        name="dates"
                        value={form.dates}
                        onChange={handleChange}
                        placeholder="Ex. : Octobre 2026, ou toute la saison"
                        className={inputClass("dates")}
                      />
                    </div>
                  </Reveal>

                  {/* Motivation textarea */}
                  <Reveal delay={0.15}>
                    <div>
                      <label className={labelClass}>
                        Votre motivation * — minimum 200 caractères
                      </label>
                      <textarea
                        name="motivation"
                        value={form.motivation}
                        onChange={handleChange}
                        rows={7}
                        placeholder="Décrivez votre situation actuelle, ce qui vous amène vers Luminal, et ce que vous espérez vivre ou trouver lors de cette retraite..."
                        className={`${inputClass("motivation")} resize-none`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.motivation ? (
                          <p className="text-red-400 text-[10px] font-sans">{errors.motivation}</p>
                        ) : (
                          <span />
                        )}
                        <p
                          className={`text-[10px] font-sans tabular-nums ${
                            form.motivation.trim().length >= 200
                              ? "text-[#3d7a5e]"
                              : "text-black/25"
                          }`}
                        >
                          {form.motivation.trim().length} / 200
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  {/* How did you find us */}
                  <Reveal delay={0.18}>
                    <div>
                      <label className={labelClass}>Comment nous avez-vous connus ?</label>
                      <select
                        name="decouverte"
                        value={form.decouverte}
                        onChange={handleChange}
                        className={`${inputClass("decouverte")} appearance-none cursor-pointer`}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Bouche à oreille">Bouche à oreille</option>
                        <option value="Réseaux sociaux">Réseaux sociaux (Instagram, LinkedIn...)</option>
                        <option value="Presse / Médias">Presse ou médias</option>
                        <option value="Recherche internet">Recherche internet</option>
                        <option value="Un alumni Luminal">Un alumni Luminal</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </Reveal>

                  {/* Confidentiality note */}
                  <Reveal delay={0.2}>
                    <div className="flex items-start gap-3 p-5 bg-[#3d7a5e]/5 border border-[#3d7a5e]/10 rounded-sm">
                      <Info className="w-4 h-4 text-[#3d7a5e] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-black/50 leading-relaxed font-sans">
                        Chaque candidature est examinée individuellement par notre équipe. Nous répondons sous 48 heures ouvrées. Les informations fournies restent strictement confidentielles et ne sont jamais partagées avec des tiers.
                      </p>
                    </div>
                  </Reveal>

                  {/* Submit */}
                  <Reveal delay={0.22}>
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-5 bg-[#3d7a5e] text-white text-[10px] uppercase tracking-[0.4em] font-bold font-sans hover:bg-[#2a5e45] transition-colors cursor-pointer rounded-sm flex items-center justify-center gap-3"
                      >
                        Soumettre ma candidature
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-center text-[10px] text-black/25 font-sans mt-4 uppercase tracking-[0.25em]">
                        Réponse sous 48 heures · Places limitées à 9 par retraite
                      </p>
                    </div>
                  </Reveal>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ==========================================
          BOTTOM REASSURANCE STRIP
          ========================================== */}
      {!submitted && (
        <section className="py-16 px-6 md:px-12 bg-[#2a2a2a]">
          <div className="max-w-[1400px] mx-auto">
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  {
                    label: "Confidentialité totale",
                    desc: "Vos informations ne sont jamais partagées.",
                  },
                  {
                    label: "Réponse sous 48h",
                    desc: "Chaque candidature reçoit une réponse personnalisée.",
                  },
                  {
                    label: "Sans engagement",
                    desc: "Candidater n'implique aucun paiement immédiat.",
                  },
                ].map((item, i) => (
                  <div key={i} className="border-t border-[#f8f5f0]/10 pt-8">
                    <h4
                      className="text-sm font-semibold uppercase tracking-wide text-[#f8f5f0] mb-2"
                      style={{ fontFamily: "Cinzel, Georgia, serif" }}
                    >
                      {item.label}
                    </h4>
                    <p
                      className="text-xs text-[#f8f5f0]/30 leading-relaxed"
                      style={{ fontFamily: "Lora, Georgia, serif" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}
