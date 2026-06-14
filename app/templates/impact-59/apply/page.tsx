"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Compass, ArrowRight, Check } from "lucide-react";
import { APPLICATION_STEPS, Reveal } from "../shared";

export default function ApplyPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] pb-24">
      {/* ==========================================
          5. APPLICATION WORKFLOW
          ========================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#3d7a5e] mb-6 block font-sans">
                  The Intake
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-12 uppercase font-serif">
                  How We <br /> <span className="italic">Begin.</span>
                </h2>
                <p className="text-lg text-black/50 leading-relaxed font-light mb-16 max-w-lg">
                  Because of our small group sizes and the depth of our work,
                  every participant goes through a multi-stage application
                  process to ensure psychological safety and group synergy.
                </p>

                <div className="space-y-12 font-sans">
                  {APPLICATION_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="text-4xl font-black text-black/5 group-hover:text-[#3d7a5e]/20 transition-colors">
                        {step.step}
                      </div>
                      <div className="flex-1 border-b border-black/5 pb-8 group-last:border-0">
                        <h4 className="text-xl font-bold uppercase mb-2 text-black">
                          {step.title}
                        </h4>
                        <p className="text-sm text-black/40 leading-relaxed font-light italic">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div>
              <Reveal className="relative aspect-square md:aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1530124560677-bdaea92c5a3b?q=80&w=1200&auto=format&fit=crop"
                  alt="Preparation"
                  fill
                  className="object-cover grayscale brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d7a5e]/20 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="p-10 bg-white/10 backdrop-blur-md border border-white/20 text-white font-sans">
                    <Compass className="w-8 h-8 mb-6" />
                    <h3 className="text-3xl font-light uppercase tracking-tighter italic mb-4 font-serif">
                      The Alumni Collective.
                    </h3>
                    <p className="text-sm font-light leading-relaxed mb-8 opacity-70">
                      Membership in our alumni community provides ongoing support
                      and priority access to new retreats for life.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SUBMIT FORM
          ========================================== */}
      <section className="py-24 bg-[#f8f5f0] border-t border-black/5">
        <div className="max-w-2xl mx-auto px-6 font-sans">
          {submitted ? (
            <div className="bg-[#3d7a5e] text-white p-12 text-center shadow-xl">
              <Check className="w-12 h-12 mx-auto mb-6 bg-white/10 rounded-full p-2" />
              <h3 className="text-2xl font-serif mb-4 italic">Intake Initiated</h3>
              <p className="text-sm font-light opacity-80 leading-relaxed">
                We have registered your request. An invite code for your secure dashboard and questionnaire has been dispatched to {email}.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-black/5 p-12 shadow-md">
              <h3 className="text-3xl font-light uppercase font-serif tracking-tighter mb-4 text-center">
                Submit Intake Request
              </h3>
              <p className="text-sm text-black/40 leading-relaxed mb-10 text-center max-w-md mx-auto">
                Enter your details to request access to the Luminal selection process for Q3 2026.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-black/40 font-bold mb-2">
                    Primary Contact Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="intake@domain.tld"
                    className="w-full bg-[#f8f5f0] border border-black/5 px-6 py-4 text-sm font-medium outline-none focus:border-[#3d7a5e] text-black"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-[#3d7a5e] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all cursor-pointer"
                >
                  INITIALIZE INTAKE PROCESS
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
