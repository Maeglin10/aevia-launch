"use client";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Reveal } from "../shared";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-40 pb-20 max-w-[1400px] mx-auto px-6 md:px-12">
      <Reveal>
        <div className="max-w-3xl mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-6 block">
            GET IN TOUCH
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-10">
            CONNECT TO THE MESH.
          </h1>
          <p className="text-xl text-white/60 font-light leading-relaxed italic">
            Whether you want to deploy nodes, build applications, or query the decentralized layer, our core team is here to assist.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Contact Form */}
        <Reveal>
          <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
            {submitted ? (
              <div className="text-center py-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-6 block">
                  SUCCESS
                </span>
                <h3 className="text-3xl font-bold uppercase tracking-tight mb-4">
                  MESSAGE SECURED.
                </h3>
                <p className="text-white/40 leading-relaxed font-light italic">
                  Merci, nous vous répondrons sous 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">
                    NAME
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#02040a] border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-[#02040a] border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">
                    MESSAGE
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full bg-[#02040a] border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Describe your project, node specs, or query..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Send Transmission
                </button>
              </form>
            )}
          </div>
        </Reveal>

        {/* Contact Info */}
        <div className="space-y-8">
          {[
            {
              icon: <Mail className="w-6 h-6 text-cyan-400" />,
              title: "Email Channels",
              value: "mesh@neuralmesh.org",
              desc: "For node operations, developer access, and security reports.",
            },
            {
              icon: <Phone className="w-6 h-6 text-blue-400" />,
              title: "Direct Access",
              value: "+33 4 74 12 34 56",
              desc: "Core developer escalation channel.",
            },
            {
              icon: <MessageSquare className="w-6 h-6 text-green-400" />,
              title: "Community Forum",
              value: "discord.gg/neuralmesh",
              desc: "Join our active developers and node operators globally.",
            },
          ].map((info, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-start gap-8">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold uppercase tracking-tight text-white mb-1">
                    {info.title}
                  </h4>
                  <p className="text-sm font-mono text-cyan-400 mb-2">{info.value}</p>
                  <p className="text-xs text-white/30 leading-relaxed font-light">
                    {info.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
