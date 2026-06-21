"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Radio, Shield } from "lucide-react";
import { Reveal, MagneticBtn } from "../shared";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    property: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-[#050505] min-h-[70vh]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-start">
          <div>
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-600 mb-6 block">
                Get In Touch
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-12 text-white uppercase italic">
                Request <br /> <span className="text-rose-600">Consultation.</span>
              </h2>
              <p className="text-lg text-white/30 leading-relaxed font-bold mb-16 uppercase tracking-tight italic">
                Initialize scanner drone dispatch or consult on custom spatial integrations.
              </p>

              <div className="space-y-8">
                {[
                  { label: "Secure Email", val: "contact@aevia.io", icon: <Mail className="w-4 h-4 text-rose-600" /> },
                  { label: "Secure Line", val: "+33 1 XX XX XX XX", icon: <Phone className="w-4 h-4 text-rose-600" /> },
                  { label: "Central Node", val: "Bourg-en-Bresse, France", icon: <MapPin className="w-4 h-4 text-rose-600" /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group pl-4 border-l border-white/5 hover:border-rose-600 transition-all">
                    {item.icon}
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/20">{item.label}</div>
                      <div className="text-sm font-bold uppercase text-white/60 mt-1">{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

           <div>
            <Reveal>
              {submitted ? (
                <div className="text-center py-16 space-y-4 bg-white/[0.01] border border-white/5 p-10 md:p-12">
                  <p className="text-sm font-bold text-rose-600 uppercase tracking-widest">Merci, nous vous répondrons sous 24h.</p>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-8 bg-white/[0.01] border border-white/5 p-10 md:p-12">
                <h3 className="text-xl font-black uppercase tracking-widest text-rose-600 mb-8 italic">
                  Node_Initialization_Form
                </h3>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    Authentication_Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="SECURE_IDENTIFIER"
                    className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold outline-none focus:border-rose-600 transition-all text-white uppercase tracking-widest"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    Routing_Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="SECURE_EMAIL_ROUTING"
                    className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold outline-none focus:border-rose-600 transition-all text-white uppercase tracking-widest"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    Target_Property_Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    placeholder="E.G. TRIBECA_PENTHOUSE_0x"
                    className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold outline-none focus:border-rose-600 transition-all text-white uppercase tracking-widest"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    Special_Directives
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="INPUT_SCAN_PARAMETERS..."
                    className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold outline-none focus:border-rose-600 transition-all text-white uppercase tracking-widest resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-white/20 italic">
                  <Shield className="w-4 h-4 text-rose-600" />
                  FIPS 140-2 Encrypted Submission
                </div>

                <MagneticBtn className="w-full py-5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer border-none">
                  Submit_Scan_Request
                </MagneticBtn>
              </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
