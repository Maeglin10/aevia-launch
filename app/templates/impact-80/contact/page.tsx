"use client";

import React, { useState } from "react";
import { Reveal } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-24 bg-white text-[#1a1a1a] min-h-screen relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Reveal>
          <div className="w-20 h-20 mx-auto mb-16 border-4 border-black flex items-center justify-center font-black text-3xl">
            S
          </div>
          <h1 className="text-5xl md:text-[8vw] font-light uppercase tracking-tighter leading-[1.15] mb-12 text-center pb-4">
            Build The <br />{" "}
            <span className="not-italic font-bold opacity-10 italic">Absolute.</span>
          </h1>
          <p className="text-xl text-black/40 font-light mb-16 leading-relaxed italic max-w-xl mx-auto text-center">
            We accept a limited number of commissions each cycle to ensure the
            structural integrity and conceptual purity of every space.
          </p>
        </Reveal>

        {submitted ? (
          <Reveal className="border border-black/5 p-12 bg-[#fcfcfc] text-center max-w-lg mx-auto shadow-xl">
            <h2 className="text-2xl font-bold uppercase tracking-tighter text-black italic mb-4">
              Project Initiated
            </h2>
            <p className="text-sm text-black/30 font-light italic">
              Thank you. Our design committee will analyze your parameters and get back to you within 3 business days.
            </p>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-8 max-w-xl mx-auto text-left"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-3">
                  COMMISSIONER_NAME
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-[#fcfcfc] border border-black/10 px-6 py-4 text-xs font-bold outline-none focus:border-black text-black uppercase tracking-widest"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-3">
                  COMMUNICATION_EMAIL
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-[#fcfcfc] border border-black/10 px-6 py-4 text-xs font-bold outline-none focus:border-black text-black uppercase tracking-widest"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-3">
                  PROJECT_LOCATION
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-[#fcfcfc] border border-black/10 px-6 py-4 text-xs font-bold outline-none focus:border-black text-black uppercase tracking-widest"
                  placeholder="e.g. Kyoto, JP / Malibu, CA"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-3">
                  SPECIFIC_OBJECTIVES
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full bg-[#fcfcfc] border border-black/10 px-6 py-4 text-xs font-bold outline-none focus:border-black text-black uppercase tracking-widest resize-none"
                  placeholder="Describe your site parameters and structural goals..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:py-7 transition-all duration-700 italic shadow-2xl"
              >
                Initiate Consultation
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
