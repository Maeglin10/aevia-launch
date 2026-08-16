"use client";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Reveal } from "../shared";
import {
  clientAddress,
  clientCity,
  clientEmail,
  clientName,
  clientPhone,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ContactPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

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
            {clientName(sessionData) ? `Nous écrire · ${clientName(sessionData)}` : "GET IN TOUCH"}
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-10">
            {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ??
              (clientCity(sessionData) ? `Parlons de votre projet à ${clientCity(sessionData)}.` : "CONNECT TO THE MESH.")}
          </h1>
          <p className="text-xl text-white/60 font-light leading-relaxed italic">
            {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
              (clientName(sessionData)
                ? "Un appel, un message : on vous répond dans la journée, et le devis est gratuit."
                : "Whether you want to deploy nodes, build applications, or query the decentralized layer, our core team is here to assist.")}
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
              title: clientName(sessionData) ? "Courriel" : "Email Channels",
              value: clientEmail(sessionData) ?? fd?.email ?? "mesh@neuralmesh.org",
              desc: clientName(sessionData) ? "Pour un devis, une question, une visite sur place." : "For node operations, developer access, and security reports.",
            },
            {
              icon: <Phone className="w-6 h-6 text-blue-400" />,
              title: clientName(sessionData) ? "Téléphone" : "Direct Access",
              value: clientPhone(sessionData) ?? "+33 4 74 12 34 56",
              desc: clientName(sessionData) ? "Du lundi au vendredi, et le samedi matin." : "Core developer escalation channel.",
            },
            {
              icon: <MessageSquare className="w-6 h-6 text-green-400" />,
              /* L'adresse de l'atelier remplace le forum : un artisan n'a pas de Discord. */
              title: clientName(sessionData) ? "Adresse" : "Community Forum",
              value: clientAddress(sessionData) ?? clientCity(sessionData) ?? "discord.gg/neuralmesh",
              desc: clientName(sessionData) ? "On vous reçoit sur rendez-vous." : "Join our active developers and node operators globally.",
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
