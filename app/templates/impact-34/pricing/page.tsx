"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, HelpCircle, ArrowRight } from "lucide-react"
import { C, PLANS, Reveal, GlassCard } from "../shared"

const COMPARISON_ROWS = [
  { feature: "Stockage audio / mois", Starter: "5 heures", Creator: "Illimité", Studio: "Illimité" },
  { feature: "Distribution automatique", Starter: "3 plateformes", Creator: "15+ plateformes", Studio: "15+ plateformes" },
  { feature: "Statistiques d'audience", Starter: "Basiques", Creator: "Avancées & Temps réel", Studio: "Avancées & API" },
  { feature: "Transcription audio IA", Starter: "Non disponible", Creator: "Illimitée", Studio: "Illimitée" },
  { feature: "Monétisation (Dons & Subs)", Starter: "Non disponible", Creator: "Inclus (2% frais)", Studio: "Inclus (0% frais)" },
  { feature: "Insertion de pub dynamique", Starter: "Non disponible", Creator: "Non disponible", Studio: "Inclus" },
  { feature: "Site web + Nom de domaine", Starter: "Player uniquement", Creator: "Inclus", Studio: "Inclus (White-label)" },
  { feature: "Membres de l'équipe", Starter: "1 utilisateur", Creator: "3 utilisateurs", Studio: "Illimité" },
  { feature: "Support client", Starter: "Standard", Creator: "Prioritaire (24h)", Studio: "Dédié + Tél" },
]

export default function PricingPage() {
  const [billingAnnual, setBillingAnnual] = useState(false)
  const [activePlan, setActivePlan] = useState<string>("Creator")
  const [registered, setRegistered] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    podcastName: "",
    category: "Technologie & Business",
  })

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.email && formData.podcastName) {
      setRegistered(true)
    }
  }

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      {/* Intro */}
      <Reveal>
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
            Pricing Plans
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Des tarifs simples,<br />
            <span style={{ color: C.accent }}>sans engagement</span>
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Commencez gratuitement et faites évoluer votre offre en fonction du succès de votre podcast.
          </p>
        </div>
      </Reveal>

      {/* Annual toggle */}
      <Reveal delay={0.05}>
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium ${!billingAnnual ? "text-[#F8FAFC]" : "text-[#64748B]"}`}>
            Mensuel
          </span>
          <button
            onClick={() => setBillingAnnual(!billingAnnual)}
            className="relative w-12 h-6 rounded-full transition-colors outline-none"
            style={{ backgroundColor: billingAnnual ? C.accent : "#1E293B" }}
          >
            <motion.div
              animate={{ x: billingAnnual ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
          <span className={`text-sm font-medium ${billingAnnual ? "text-[#F8FAFC]" : "text-[#64748B]"}`}>
            Annuel (Économisez 25%)
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: "#10B98120", color: "#10B981" }}
          >
            -25%
          </span>
        </div>
      </Reveal>

      {/* Plans cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">
        {PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              onClick={() => setActivePlan(plan.name)}
              className={`relative rounded-2xl p-8 border transition-all cursor-pointer h-full flex flex-col justify-between ${
                plan.highlight
                  ? "border-[#F97316]/60 shadow-[0_0_60px_rgba(249,115,22,0.2)]"
                  : activePlan === plan.name
                  ? "border-white/20"
                  : "border-white/8"
              }`}
              style={{
                backgroundColor: plan.highlight
                  ? "rgba(249, 115, 22, 0.06)"
                  : "rgba(255, 255, 255, 0.03)",
              }}
            >
              <div>
                {plan.highlight && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap"
                    style={{ backgroundColor: C.accent }}
                  >
                    Le plus populaire
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-black text-[#F8FAFC] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[#64748B]">{plan.description}</p>
                </div>

                <div className="mb-8">
                  {plan.price === "0" ? (
                    <span className="text-4xl font-black text-[#F8FAFC]">Gratuit</span>
                  ) : (
                    <>
                      <span className="text-4xl font-black text-[#F8FAFC]">
                        {billingAnnual
                          ? Math.round(parseInt(plan.price) * 0.75)
                          : plan.price}€
                      </span>
                      <span className="text-sm text-[#64748B] ml-1">{plan.period}</span>
                    </>
                  )}
                  {plan.price !== "0" && billingAnnual && (
                    <div className="text-xs text-[#10B981] mt-1">Facturé annuellement</div>
                  )}
                </div>

                <ul className="flex flex-col gap-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: plan.color + "20" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: plan.color }}
                        />
                      </span>
                      <span className="text-[#94A3B8]">{feature}</span>
                    </li>
                  ))}
                  {plan.missing.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm opacity-30">
                      <div className="w-4 h-4 rounded-full border border-[#475569] flex-shrink-0" />
                      <span className="text-[#475569]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 mt-4"
                style={{
                  backgroundColor: plan.highlight ? C.accent : "rgba(255,255,255,0.06)",
                  color: plan.highlight ? "white" : "#F8FAFC",
                  border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {plan.cta}
              </button>
            </motion.div>
          </Reveal>
        ))}
      </div>

      {/* Comparison Table */}
      <Reveal y={40}>
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">Comparez les fonctionnalités</h2>
            <p className="text-[#64748B] text-sm mt-2">Découvrez en détail l'ensemble des fonctionnalités de chaque offre.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 text-sm font-bold text-white uppercase tracking-wider w-1/2">Fonctionnalité</th>
                  <th className="py-4 text-sm font-bold text-center text-[#94A3B8]">Starter</th>
                  <th className="py-4 text-sm font-bold text-center text-[#F97316]">Creator</th>
                  <th className="py-4 text-sm font-bold text-center text-[#8B5CF6]">Studio</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 text-sm font-medium text-[#F8FAFC]">{row.feature}</td>
                    <td className="py-4 text-sm text-[#94A3B8] text-center">{row.Starter}</td>
                    <td className="py-4 text-sm text-white font-semibold text-center">{row.Creator}</td>
                    <td className="py-4 text-sm text-[#94A3B8] text-center">{row.Studio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Form Section */}
      <Reveal y={30}>
        <GlassCard className="max-w-2xl mx-auto p-8 border-[#F97316]/30 relative overflow-hidden bg-white/[0.02]">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-[60px] pointer-events-none" style={{ backgroundColor: C.accent }} />

          <AnimatePresence mode="wait">
            {!registered ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-white">Lancez votre podcast aujourd'hui</h3>
                  <p className="text-sm text-[#64748B] mt-2">Sélectionnez la formule <strong className="text-white">{activePlan}</strong>. Remplissez ces informations pour générer votre studio.</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Nom du podcast</label>
                    <input
                      type="text"
                      value={formData.podcastName}
                      onChange={(e) => setFormData({ ...formData, podcastName: e.target.value })}
                      placeholder="Ex: Le Déclic Tech"
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#F97316]/50 transition-colors placeholder-[#475569] text-sm"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Votre nom</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Sarah"
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#F97316]/50 transition-colors placeholder-[#475569] text-sm"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Catégorie principale</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#F97316]/50 transition-colors text-sm"
                      >
                        <option value="Technologie & Business">Technologie & Business</option>
                        <option value="Santé & Sport">Santé & Sport</option>
                        <option value="True Crime & Fiction">True Crime & Fiction</option>
                        <option value="Actualités & Culture">Actualités & Culture</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Adresse email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nom@exemple.com"
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#F97316]/50 transition-colors placeholder-[#475569] text-sm"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-4 py-4 rounded-xl text-white font-bold text-sm transition-all hover:opacity-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: C.accent }}
                  >
                    Valider et accéder à mon Studio WaveForm <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-[#10B981]" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4">Félicitations {formData.name} !</h3>
                <p className="text-[#94A3B8] leading-relaxed mb-6 text-sm max-w-md">
                  Votre podcast <strong className="text-white">"{formData.podcastName}"</strong> est pré-enregistré en formule <strong className="text-white">{activePlan}</strong>.
                  Un e-mail d'activation a été envoyé à <strong className="text-white">{formData.email}</strong>.
                </p>
                <button
                  onClick={() => setRegistered(false)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-[#64748B] hover:text-white transition-colors"
                >
                  Modifier les informations
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </Reveal>
    </div>
  )
}
