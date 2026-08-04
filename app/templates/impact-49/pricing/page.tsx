"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { Reveal, PLANS } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

type Plan = (typeof PLANS)[number];


export default function PricingPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const [billingAnnual, setBillingAnnual] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupNote, setSignupNote] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSent, setSignupSent] = useState(false);

  const openPlanModal = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    setSignupLoading(false);
    setSignupSent(false);
    setSignupName("");
    setSignupEmail("");
    setSignupPhone("");
    setSignupNote("");
  }, []);

  const closePlanModal = useCallback(() => {
    if (signupLoading) return;
    setSelectedPlan(null);
  }, [signupLoading]);

  const handlePlanSignup = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setTimeout(() => {
      setSignupLoading(false);
      setSignupSent(true);
    }, 2000);
  }, []);

  return (
    <main className="pt-40 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-3">
            Tarifs
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1B4B] mb-6">
            Des tarifs transparents, sans engagement
          </h1>
          <p className="text-[#6B7280] font-medium mb-10">
            Choisissez le plan adapté à vos ambitions d'apprentissage et commencez à monter en compétences dès aujourd'hui.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm font-semibold ${
                !billingAnnual ? "text-[#1E1B4B]" : "text-[#9CA3AF]"
              }`}
            >
              Mensuel
            </span>
            <button
              onClick={() => setBillingAnnual(!billingAnnual)}
              className="w-14 h-8 rounded-full bg-[#E0E7FF] p-1 flex items-center transition-colors relative"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#6366F1] shadow-sm transform transition-transform ${
                  billingAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm font-semibold flex items-center gap-1.5 ${
                billingAnnual ? "text-[#1E1B4B]" : "text-[#9CA3AF]"
              }`}
            >
              Annuel
              <span className="px-2 py-0.5 rounded-md bg-[#10B981] text-white text-[10px] font-bold uppercase">
                -20%
              </span>
            </span>
          </div>
        </div>
      </Reveal>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
        {PLANS.map((plan, i) => {
          const rawPrice = parseInt(plan.price.replace("€", ""));
          const calculatedPrice = billingAnnual
            ? Math.round(rawPrice * 0.8 * 12)
            : rawPrice;

          return (
            <Reveal key={plan.name} delay={i * 0.1}>
              <div
                style={{
                  borderColor: plan.highlight ? "#6366F1" : "#E5E7EB",
                  backgroundColor: plan.highlight ? "#white" : "rgba(255,255,255,0.6)",
                }}
                className={`p-10 rounded-[2.5rem] bg-white border flex flex-col justify-between h-full relative ${
                  plan.highlight ? "shadow-[0_20px_40px_rgba(99,102,241,0.06)]" : "shadow-sm"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute top-0 right-10 transform -translate-y-1/2 px-4 py-1.5 rounded-full bg-[#6366F1] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    Recommandé
                  </span>
                )}
                <div>
                  <h3 className="font-extrabold text-2xl mb-2 text-[#1E1B4B]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mb-8 min-h-[32px]">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black text-[#1E1B4B]">
                      {billingAnnual && /* PRIX_CALCULABLE */ Number.isFinite(parseFloat(String(plan.price).replace(/[^0-9.]/g, ""))) && plan.price !== "0€"
                        ? `${Math.round(calculatedPrice / 12)}€`
                        : plan.price}
                    </span>
                    <span className="text-sm font-semibold text-[#6B7280]">
                      /mois
                    </span>
                  </div>

                  <hr className="border-[#EEF2FF] mb-8" />

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-[#4B5563]">
                        <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                    {plan.missing?.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-[#9CA3AF] line-through">
                        <CheckCircle className="w-5 h-5 text-[#9CA3AF]/40 flex-shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => openPlanModal(plan)}
                  className={`w-full min-h-[44px] py-4 rounded-xl text-sm font-bold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 ${
                    plan.highlight
                      ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                      : "bg-[#EEF2FF] text-[#6366F1] hover:bg-[#E0E7FF]"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePlanModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B4B]/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-[2rem] bg-white p-8 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={closePlanModal}
                disabled={signupLoading}
                aria-label="Fermer"
                className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#1E1B4B] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {signupSent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, delay: 0.15 }}
                      className="w-16 h-16 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-2xl font-extrabold text-[#1E1B4B] mb-3">
                      Inscription confirmée
                    </h3>
                    <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
                      Vous êtes inscrit·e au plan <span className="font-bold text-[#1E1B4B]">{selectedPlan.name}</span> ({selectedPlan.price}{selectedPlan.period}). Un email de confirmation arrive dans votre boîte de réception sous quelques minutes.
                    </p>
                    <button
                      type="button"
                      onClick={closePlanModal}
                      className="mt-8 w-full min-h-[44px] py-3.5 rounded-xl text-sm font-bold bg-[#EEF2FF] text-[#6366F1] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
                    >
                      Fermer
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handlePlanSignup}
                  >
                    <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-2">
                      Plan sélectionné
                    </span>
                    <h3 id="plan-modal-title" className="text-2xl font-extrabold text-[#1E1B4B] mb-1">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-sm text-[#6B7280] font-medium mb-6">
                      {selectedPlan.price}{selectedPlan.period} · {selectedPlan.description}
                    </p>

                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="plan-signup-name"
                          className="block text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-2"
                        >
                          Nom complet
                        </label>
                        <input
                          id="plan-signup-name"
                          name="name"
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          disabled={signupLoading}
                          placeholder="Jean Dupont"
                          className="w-full min-h-[44px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3.5 text-[#1E1B4B] text-sm focus:border-[#6366F1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] transition-colors disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="plan-signup-email"
                          className="block text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-2"
                        >
                          Email
                        </label>
                        <input
                          id="plan-signup-email"
                          name="email"
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          disabled={signupLoading}
                          placeholder="jean@example.com"
                          className="w-full min-h-[44px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3.5 text-[#1E1B4B] text-sm focus:border-[#6366F1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] transition-colors disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="plan-signup-phone"
                          className="block text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-2"
                        >
                          Téléphone
                        </label>
                        <input
                          id="plan-signup-phone"
                          name="phone"
                          type="tel"
                          required
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          disabled={signupLoading}
                          placeholder="06 12 34 56 78"
                          className="w-full min-h-[44px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3.5 text-[#1E1B4B] text-sm focus:border-[#6366F1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] transition-colors disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="plan-signup-note"
                          className="block text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-2"
                        >
                          Pourquoi ce parcours vous intéresse ? (facultatif)
                        </label>
                        <textarea
                          id="plan-signup-note"
                          name="note"
                          rows={3}
                          value={signupNote}
                          onChange={(e) => setSignupNote(e.target.value)}
                          disabled={signupLoading}
                          placeholder="Ex: monter en compétences sur la data..."
                          className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3.5 text-[#1E1B4B] text-sm focus:border-[#6366F1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] transition-colors disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={signupLoading}
                      className="mt-8 w-full min-h-[44px] py-4 rounded-xl text-sm font-bold bg-[#6366F1] text-white hover:bg-[#4F46E5] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-3"
                    >
                      {signupLoading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white inline-block"
                          />
                          Envoi en cours…
                        </>
                      ) : (
                        selectedPlan.cta
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
