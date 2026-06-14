"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, CheckCircle2, Minus, Plus, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WINES, Reveal } from "../shared";

export default function CommandePage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [step, setStep] = useState<"select" | "form" | "confirm">("select");
  const [formData, setFormData] = useState({ nom: "", adresse: "", codePostal: "", ville: "", email: "" });

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  const cartItems = WINES.filter(w => (quantities[w.id] ?? 0) > 0);
  const total = cartItems.reduce((acc, w) => acc + w.price * (quantities[w.id] ?? 0), 0);
  const totalBottles = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirm");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=1600&q=80&fit=crop"
          alt="Commander nos vins"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans font-bold">Vente Directe Propriété</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight leading-none pb-2">Commander</h1>
          </Reveal>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        {/* Legal notice */}
        <Reveal>
          <div className="bg-[#2D1B0E]/5 border border-[#2D1B0E]/15 px-6 py-4 mb-12 font-sans flex items-start gap-3">
            <Award className="w-5 h-5 text-[#2D1B0E] shrink-0 mt-0.5" />
            <p className="text-sm text-[#2D1B0E] font-medium">
              La vente d'alcool est réservée aux personnes majeures (+18 ans). En passant commande, vous confirmez avoir l'âge légal requis dans votre pays de résidence. L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
            </p>
          </div>
        </Reveal>

        {step === "confirm" ? (
          <Reveal>
            <div className="max-w-2xl mx-auto bg-[#2D1B0E] text-white p-16 text-center font-sans">
              <CheckCircle2 className="w-16 h-16 text-[#C4A265] mx-auto mb-8" />
              <h2 className="text-3xl font-serif mb-6 leading-snug pb-1">Commande reçue</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Merci, {formData.nom}. Votre commande a été enregistrée. Vous recevrez sous 24h un email de confirmation à <strong className="text-white">{formData.email}</strong> avec les instructions de paiement par virement.
              </p>
              <p className="text-xs text-zinc-400 mb-10">Montant total estimé : {total.toLocaleString("fr-FR")} €</p>
              <button
                type="button"
                onClick={() => { setStep("select"); setQuantities({}) }}
                className="px-8 py-3 border border-white/30 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Nouvelle commande
              </button>
            </div>
          </Reveal>
        ) : step === "form" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Summary */}
            <Reveal>
              <div>
                <h2 className="text-2xl font-serif text-[#2D1B0E] mb-8 leading-snug pb-1">Récapitulatif</h2>
                <div className="space-y-4 mb-8">
                  {cartItems.map(w => (
                    <div key={w.id} className="flex items-center justify-between bg-white border border-[#2D1B0E]/8 px-6 py-4 font-sans">
                      <div>
                        <div className="font-serif text-[#2D1B0E]">{w.name}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{quantities[w.id]} × {w.price} €</div>
                      </div>
                      <div className="text-lg font-serif text-[#2D1B0E]">
                        {(w.price * (quantities[w.id] ?? 0)).toLocaleString("fr-FR")} €
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#2D1B0E] text-white px-6 py-4 flex justify-between items-center font-sans">
                  <span className="text-sm uppercase tracking-widest font-bold">Total</span>
                  <span className="text-2xl font-serif">{total.toLocaleString("fr-FR")} €</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans mt-4 leading-relaxed">
                  Paiement sécurisé par virement bancaire ou chèque — confirmation par email sous 24h. Livraison sous température dirigée, offerte à partir de 6 bouteilles.
                </p>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.1}>
              <form onSubmit={handleOrder} className="space-y-5 font-sans">
                <h2 className="text-2xl font-serif text-[#2D1B0E] mb-8 leading-snug pb-1">Coordonnées de livraison</h2>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Nom & Prénom</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Adresse</label>
                  <input type="text" name="adresse" value={formData.adresse} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Code postal</label>
                    <input type="text" name="codePostal" value={formData.codePostal} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Ville</label>
                    <input type="text" name="ville" value={formData.ville} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2D1B0E]" />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setStep("select")} className="flex-1 py-4 border border-[#2D1B0E] text-[#2D1B0E] text-xs font-bold uppercase tracking-widest hover:bg-[#2D1B0E]/5 transition-colors">
                    Retour
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-[#2D1B0E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4A2820] transition-colors">
                    Valider la commande
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        ) : (
          <>
            {/* Wine selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {WINES.map((w, i) => (
                <Reveal key={w.id} delay={i * 0.08}>
                  <div className="bg-white border border-[#2D1B0E]/8 overflow-hidden">
                    <div className="flex gap-0">
                      <div className="relative w-32 shrink-0">
                        <Image src={w.image} alt={w.name} fill className="object-cover" loading="lazy" />
                      </div>
                      <div className="p-6 font-sans flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-[#C4A265] font-bold mb-1">{w.appellation}</div>
                          <h3 className="text-lg font-serif text-[#2D1B0E] mb-1 leading-snug pb-1">{w.name}</h3>
                          <p className="text-sm text-zinc-500 mb-4">{w.priceRange} / btl</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateQty(w.id, -1)}
                            className="w-8 h-8 border border-zinc-200 flex items-center justify-center hover:border-[#2D1B0E] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-[#2D1B0E]">
                            {quantities[w.id] ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(w.id, 1)}
                            className="w-8 h-8 border border-zinc-200 flex items-center justify-center hover:border-[#2D1B0E] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Cart bar */}
            <AnimatePresence>
              {totalBottles > 0 && (
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto bg-[#2D1B0E] text-white px-8 py-5 flex items-center justify-between font-sans shadow-2xl z-40"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5 text-[#C4A265]" />
                    <span className="text-sm font-bold">{totalBottles} bouteille{totalBottles > 1 ? "s" : ""}</span>
                  </div>
                  <div className="text-xl font-serif">{total.toLocaleString("fr-FR")} €</div>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="px-6 py-2 bg-[#C4A265] text-[#2D1B0E] text-xs font-bold uppercase tracking-widest hover:bg-[#D4B878] transition-colors"
                  >
                    Commander
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </section>
    </div>
  );
}
