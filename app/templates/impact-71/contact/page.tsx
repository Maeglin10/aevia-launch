"use client";
// @ts-nocheck

import { useState } from "react";
import { Check, Mail, Phone, MapPin, Globe } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const triggerBooking = () => {
    window.dispatchEvent(new CustomEvent("open-zenspace-booking"));
  };

  return (
    <div className="py-20 bg-[#faf9f6]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* ==========================================
            PRICING (Membership)
            ========================================== */}
        <section className="mb-32">
          <Reveal className="max-w-2xl mx-auto mb-24 text-center">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#c9a84c] mb-6 block">
              The Membership
            </span>
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase italic mb-8 leading-[1.15] text-[#33302c] pb-4">
              Sacred <br /> <span className="text-[#c9a84c]">Tiers.</span>
            </h2>
            <p className="text-stone-400 italic font-medium leading-relaxed uppercase tracking-tight">
              Invest in your evolution. We offer flexible memberships designed
              for the dedicated practitioner.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-stone-200/50 rounded-3xl overflow-hidden bg-white shadow-sm">
            {[
              {
                title: "Trial Ritual",
                val: "€45",
                desc: "Un accès illimité de 7 jours pour découvrir notre sanctuaire et nos guides.",
                features: [
                  "7 Days Unlimited",
                  "Locker Access",
                  "Mat & Towel Rental",
                  "Consultation",
                ],
              },
              {
                title: "Sanctuary Pass",
                val: "€160",
                desc: "L'abonnement mensuel standard pour le pratiquant régulier. Sans engagement.",
                features: [
                  "Unlimited Classes",
                  "Priority Booking",
                  "Member Workshops",
                  "Guest Passes (1/mo)",
                ],
              },
              {
                title: "Eternal Path",
                val: "€1400",
                desc: "Accès illimité d'un an avec accompagnement personnalisé et retraites exclusives.",
                features: [
                  "Annual Unlimited",
                  "1:1 Private Session",
                  "Retreat Discount",
                  "Private Locker",
                ],
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1} className="h-full">
                <div className="p-12 border-r border-stone-200/50 last:border-r-0 hover:bg-[#faf9f6]/20 transition-all flex flex-col h-full text-[#33302c]">
                  <div className="text-3xl font-black text-[#c9a84c] mb-6 italic">
                    {item.val}
                  </div>
                  <h4 className="text-lg font-light uppercase tracking-widest text-[#33302c] mb-6 italic">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-bold uppercase tracking-widest italic mb-10 flex-1">
                    {item.desc}
                  </p>
                  <ul className="space-y-4 mb-12 list-none p-0">
                    {item.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-stone-500"
                      >
                        <Check className="w-3.5 h-3.5 text-[#c9a84c]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={triggerBooking}
                    className="w-full py-5 border border-[#c9a84c] bg-transparent text-[#c9a84c] text-[10px] font-bold uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#33302c] transition-all cursor-pointer rounded-xl"
                  >
                    ENROLL_NOW
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ==========================================
            CONTACT COORDINATES & FORM
            ========================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
          <div className="lg:col-span-5 space-y-12">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#c9a84c] mb-6 block">
                Connect
              </span>
              <h3 className="text-4xl md:text-5xl font-light uppercase tracking-tighter italic text-[#33302c] leading-[1.15] mb-6">
                Sanctuary <br /> <span className="text-[#c9a84c]">Coordinates.</span>
              </h3>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest leading-relaxed italic mb-10">
                Reach out to reserve private sessions, coordinate events, or clarify practices.
              </p>
            </Reveal>

            <div className="space-y-6 text-xs text-stone-500 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-4 p-4 bg-white border border-stone-200/50 rounded-2xl">
                <Mail className="w-5 h-5 text-[#c9a84c]" />
                <div>
                  <h4 className="text-[9px] text-stone-300">Direct Message</h4>
                  <a href="mailto:contact@aevia.io" className="text-[#33302c] hover:text-[#c9a84c] transition-colors">contact@aevia.io</a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white border border-stone-200/50 rounded-2xl">
                <MapPin className="w-5 h-5 text-[#c9a84c]" />
                <div>
                  <h4 className="text-[9px] text-stone-300">HQ Address</h4>
                  <span className="text-[#33302c]">Bourg-en-Bresse, France</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white border border-stone-200/50 rounded-2xl">
                <Globe className="w-5 h-5 text-[#c9a84c]" />
                <div>
                  <h4 className="text-[9px] text-stone-300">Global Hubs</h4>
                  <span className="text-[#33302c]">Geneva // Kyoto // London</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-stone-200/50 rounded-3xl p-8 md:p-12 shadow-sm">
            <Reveal>
              {submitted ? (
                <div className="bg-white border border-stone-200/50 rounded-3xl p-8 md:p-12 shadow-sm text-center py-16">
                  <p className="text-sm font-bold uppercase tracking-widest text-[#c9a84c]">Merci, nous vous répondrons sous 24h.</p>
                </div>
              ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">First Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#faf9f6] border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#c9a84c] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Last Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#faf9f6] border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#c9a84c] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-[#faf9f6] border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#c9a84c] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Message</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full bg-[#faf9f6] border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#c9a84c] transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#33302c] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#c9a84c] transition-all border-none cursor-pointer"
                >
                  SEND_MESSAGE
                </button>
              </form>
              )}
            </Reveal>
          </div>
        </section>

        {/* ==========================================
            FAQ (The Buffer)
            ========================================== */}
        <section className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter leading-none uppercase italic text-[#33302c]">
              Zen_Buffer
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "Je suis débutant, par où commencer ?",
                a: "Nous recommandons le cours 'Hatha Awakening' ou 'Yin' pour commencer. Nos guides adaptent chaque posture selon votre niveau actuel.",
              },
              {
                q: "Faut-il apporter son propre tapis ?",
                a: "Nous fournissons des tapis Lululemon haut de gamme et des serviettes purifiées. Vous pouvez bien sûr apporter le vôtre si vous préférez.",
              },
              {
                q: "Quelle est votre politique d'annulation ?",
                a: "Toute réservation peut être annulée sans frais jusqu'à 6 heures avant le début du cours via l'application ZenSpace.",
              },
              {
                q: "Proposez-vous des cours privés ?",
                a: "Oui, nos guides sont disponibles pour des sessions 1:1 personnalisées selon vos objectifs spécifiques (flexibilité, force, méditation).",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-stone-200/50"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-[#c9a84c] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-stone-400 leading-relaxed font-bold uppercase tracking-widest pb-8 italic">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
