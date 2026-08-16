"use client";
import { useEffect, useState } from "react";
import { Brain, Cpu, Network, Shield } from "lucide-react";
import { Reveal } from "../shared";
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientCity,
  clientName,
  clientServices,
  clientTagline,
  clientText,
  clientTrade,
  memoriserSession,
} from "@/lib/templates/clientContent";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function AboutPage() {
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
         création, elle peut n'être pas encore lisible. Trois tentatives. */
      for (const attente of [0, 600, 2000]) {
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

  /*
    Cette page racontait NeuralMesh — « the decentralized cognitive layer » —
    sur le site d'un client qui n'a rien à voir avec l'intelligence artificielle
    distribuée. Elle chargeait pourtant sa session sans jamais s'en servir.
    Chaque bloc lit désormais le contrat, et ne retombe sur la démonstration que
    si le client n'a rien rempli.
  */
  const nom = clientName(sessionData);
  const metier = clientTrade(sessionData);
  const ville = clientCity(sessionData);

  const CARTES_DEMO = [
    {
      icon: <Cpu className="w-8 h-8 text-cyan-400" />,
      title: "Decentralized Compute",
      desc: "Pooling heterogeneous GPUs worldwide to form a single, massive neural processor capable of executing complex models with zero single point of failure.",
    },
    {
      icon: <Network className="w-8 h-8 text-blue-400" />,
      title: "Zero-Latency Routing",
      desc: "Our proprietary consensus mechanism distributes token requests intelligently across nearest nodes, maintaining a global average latency below 0.02ms.",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "zk-Proof Inference",
      desc: "Verify that model outputs have been generated correctly without exposing weights or prompts, utilizing zero-knowledge proof architecture.",
    },
  ];
  /* Les prestations du client gardent l'icône du thème : le dessin ne bouge pas. */
  const CARTES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...CARTES_DEMO[i % CARTES_DEMO.length],
      title: s.title,
      desc: s.description ?? CARTES_DEMO[i % CARTES_DEMO.length].desc,
    })),
    CARTES_DEMO,
  );

  return (
    <main className="pt-40 pb-20 max-w-[1400px] mx-auto px-6 md:px-12">
      <Reveal>
        <div className="max-w-3xl mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-6 block">
            {nom ? `À propos · ${nom}` : "ABOUT NEURALMESH"}
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-10">
            {/* TEXTE_SECTION */ clientText(sessionData, "apropos.titre") ??
              (metier ? `${metier}${ville ? ` à ${ville}` : ""}.` : "THE DECENTRALIZED COGNITIVE LAYER.")}
          </h1>
          <p className="text-xl text-white/60 font-light leading-relaxed italic">
            {/* TEXTE_SECTION */ clientText(sessionData, "apropos.texte") ??
              clientTagline(sessionData) ??
              "NeuralMesh is building the protocol for globally distributed artificial intelligence. By connecting computing power through a decentralized consensus model, we enable latency-free neural inference."}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {CARTES.map((feat: any, idx: number) => (
          <Reveal key={idx} delay={idx * 0.1}>
            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 h-full flex flex-col justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">
                  {feat.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed font-light">
                  {feat.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-6 italic">
                {/* TEXTE_SECTION */ clientText(sessionData, "vision.titre") ?? (nom ? "Notre métier" : "Our Vision")}
              </h2>
              <p className="text-white/60 leading-relaxed font-light mb-6">
                {/* TEXTE_SECTION */ clientText(sessionData, "vision.texte") ??
                  clientTagline(sessionData) ??
                  "We believe that cognition should not be hoarded by centralized hyper-corporations. The future of intelligence is open, distributed, and owned by the network participants who power it."}
              </p>
              <p className="text-white/60 leading-relaxed font-light">
                {/* TEXTE_SECTION */ clientText(sessionData, "vision.texte2") ??
                  (nom
                    ? `${nom} intervient ${ville ? `à ${ville} et alentour` : "sur toute la région"}. Chaque chantier est suivi par la même équipe, du devis à la réception.`
                    : "By participating in the NeuralMesh consensus, developers, node operators, and consumers create a robust and censorship-resistant digital mind.")}
              </p>
            </div>
            <div className="aspect-video bg-black rounded-3xl border border-white/5 flex items-center justify-center p-8">
              <Brain className="w-32 h-32 text-cyan-500/20 animate-pulse" />
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
