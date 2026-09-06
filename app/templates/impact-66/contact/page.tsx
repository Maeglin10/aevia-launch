"use client";
import {
  clientCity,
  clientEmail,
  memoriserSession,
  clientPhone,
} from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Reveal, MagneticBtn } from "../shared";

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

  const handleBook = () => {
    window.dispatchEvent(new Event("open-atelier-booking"));
  };

  return (
    <div className="bg-[#faf9f6] text-[#1a1814] py-24 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <Reveal>
          <div className="flex flex-col mb-24 text-center">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#1a1814]/40 mb-6 block">
              Contact & Booking
            </span>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4">
              Visit the <span className="italic text-[#c9b7a1]">Atelier.</span>
            </h1>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Reservation Prompt */}
          <Reveal>
            <div className="bg-white p-12 rounded-3xl border border-[#1a1814]/5 shadow-sm text-center">
              <h3 className="text-3xl font-light uppercase tracking-tighter italic mb-6">
                Online Scheduling
              </h3>
              <p className="text-sm font-light text-[#1a1814]/50 leading-relaxed mb-10">
                Secure your appointment immediately using our digital reservation portal. Selecting your artisan, date, and ritual takes less than 2 minutes.
              </p>
              <MagneticBtn
                onClick={handleBook}
                className="w-full py-5 bg-[#1a1814] text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-[#c9b7a1] transition-all cursor-pointer shadow-xl border-none"
              >
                Ouvrir les Réservations
              </MagneticBtn>
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={0.1}>
            <div className="space-y-12 pl-0 lg:pl-12">
              <div className="flex gap-6 items-start">
                <MapPin className="w-6 h-6 text-[#c9b7a1] flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#1a1814]/40 mb-2">Location</h4>
                  <p className="text-lg font-light text-[#1a1814]">
                    75008 {clientCity(sessionData) ?? "Paris"}, France
                  </p>
                  <p className="text-xs text-[#1a1814]/40 mt-1 italic">
                    Adresse physique communiquée sur simple demande à {clientEmail(sessionData) ?? fd?.email ?? "contact@exemple.fr"}.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <Clock className="w-6 h-6 text-[#c9b7a1] flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#1a1814]/40 mb-2">Hours</h4>
                  <p className="text-sm font-bold text-[#1a1814] uppercase tracking-wider">
                    Lundi - Samedi // 10:00 - 20:00
                  </p>
                  <p className="text-xs text-[#1a1814]/40 mt-1 italic">
                    Uniquement sur rendez-vous privé.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <Phone className="w-6 h-6 text-[#c9b7a1] flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#1a1814]/40 mb-2">Phone</h4>
                  <p className="text-lg font-light text-[#1a1814]">
                    {clientPhone(sessionData) ?? "+33 1 44 62 87 00"}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <Mail className="w-6 h-6 text-[#c9b7a1] flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#1a1814]/40 mb-2">Email</h4>
                  <p className="text-lg font-light text-[#1a1814]">
                    {clientEmail(sessionData) ?? fd?.email ?? "contact@exemple.fr"}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </div>
  );
}
