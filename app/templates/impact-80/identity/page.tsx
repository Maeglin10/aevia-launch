"use client";
import { useEffect, useState } from "react";

import React from "react";
import { Layers, Compass, Home } from "lucide-react";
import { Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function IdentityPage() {
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
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <section className="py-32 bg-white min-h-dvh flex flex-col justify-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20 text-center lg:text-left">
        <Reveal>
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 block mb-6">
            Structural Pillars
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter leading-[1.15] text-[#1a1a1a] uppercase pb-4">
            Our Architectural <br />
            <span className="font-bold italic">Identity.</span>
          </h1>
          <p className="text-xl text-black/40 font-light max-w-xl leading-relaxed italic mt-6">
            We follow axial logic, material honesty, and absolute geometric precision to create human sanctuaries.
          </p>
        </Reveal>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-32">
        {[
          {
            icon: Layers,
            t: "Material Integrity",
            d: "A relentless focus on the raw textures of concrete, glass, and steel.",
          },
          {
            icon: Compass,
            t: "Axial Logic",
            d: "Defining spaces through rigid geometric paths and visual alignments.",
          },
          {
            icon: Home,
            t: "Human Sanctuary",
            d: "Designing environments that provide absolute mental and physical clarity.",
          },
        ].map((p, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="group cursor-pointer">
              <div className="w-16 h-16 border border-black/5 flex items-center justify-center mb-10 group-hover:bg-black group-hover:text-white transition-all duration-700">
                <p.icon className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter italic">
                {p.t}
              </h3>
              <p className="text-black/30 leading-relaxed font-light text-sm italic">
                {p.d}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
