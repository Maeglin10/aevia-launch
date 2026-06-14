"use client";

import React, { useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Reveal } from "../shared";

export default function MembersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "Berlin",
    bio: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Application received. The Council will review your invitation request.`);
  };

  return (
    <section className="py-20 bg-[#050005] min-h-[70vh]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
          <div>
            <Reveal>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff00ff] block mb-6">Join The Circle</span>
              <h2 className="text-5xl md:text-[6vw] font-light uppercase tracking-tighter text-white leading-none mb-10 italic">
                Request <br /> <span className="font-bold not-italic">Invitation.</span>
              </h2>
              <p className="text-white/40 leading-relaxed text-lg mb-10 italic font-light">
                Membership is strictly regulated to preserve the atmosphere. Provide your credentials below.
              </p>

              <div className="space-y-6 text-white/50 text-sm italic font-light">
                <p>✓ Access to private rooms across Berlin, Ibiza, Tokyo, and Miami.</p>
                <p>✓ Custom sensory key card with encrypted NFC security.</p>
                <p>✓ Private invitations to pop-up secret architectural stages.</p>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <form onSubmit={handleSubmit} className="space-y-8 bg-white/[0.02] border border-white/5 p-10 md:p-12 rounded-[2rem]">
                <h3 className="text-xl font-bold uppercase tracking-widest text-[#ff00ff] mb-6 flex items-center gap-3 italic">
                  <Sparkles className="w-5 h-5" /> Membership_Application
                </h3>

                <div className="space-y-2 text-left">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="SECURE_IDENTIFIER"
                    className="w-full bg-[#050005] border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#ff00ff] transition-all text-white uppercase tracking-widest"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="SECURE_ROUTING_EMAIL"
                    className="w-full bg-[#050005] border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#ff00ff] transition-all text-white uppercase tracking-widest"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Primary Node</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#050005] border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#ff00ff] transition-all text-white uppercase tracking-widest"
                  >
                    <option>Berlin Hub</option>
                    <option>Ibiza Retreat</option>
                    <option>Tokyo Underground</option>
                    <option>Miami Penthouse</option>
                  </select>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Brief Statement of Intent</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="WHAT DRAWS YOU TO THE SHADOWS..."
                    className="w-full bg-[#050005] border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#ff00ff] transition-all text-white uppercase tracking-widest resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-white/20 italic">
                  <ShieldCheck className="w-4 h-4 text-[#ff00ff]" />
                  Secure Invitation Port Link
                </div>

                <button type="submit" className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#ff00ff] hover:text-white transition-all cursor-pointer border-none shadow-xl">
                  Apply_For_Node_Access
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
