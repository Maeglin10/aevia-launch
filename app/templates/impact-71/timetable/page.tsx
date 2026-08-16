"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";
// @ts-nocheck

import { Badge } from "@/components/ui/badge";
import { SCHEDULE, Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function TimetablePage() {
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

  const triggerBooking = () => {
    window.dispatchEvent(new CustomEvent("open-zenspace-booking"));
  };

  return (
    <div className="py-20 bg-[#faf9f6]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
        <Reveal className="max-w-2xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#c9a84c] mb-6 block">
            Weekly Flow
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase italic text-[#33302c] leading-[1.15] pb-4">
            The Timetable.
          </h2>
          <p className="text-sm text-stone-400 font-bold uppercase tracking-widest italic mt-4">
            Daily rituals to align mind, body, and breath.
          </p>
        </Reveal>

        <div className="overflow-x-auto bg-white border border-stone-200/50 rounded-3xl p-8 md:p-12 shadow-sm text-left max-w-5xl mx-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="border-b border-stone-200/50 text-[10px] uppercase tracking-widest text-stone-400">
                <th className="pb-8 font-black">Time_Slot</th>
                <th className="pb-8 font-black">Practice_Name</th>
                <th className="pb-8 font-black">Guide</th>
                <th className="pb-8 font-black">Energy_Type</th>
                <th className="pb-8 font-black text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {SCHEDULE.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-stone-100 last:border-b-0 hover:bg-stone-50 transition-colors group"
                >
                  <td className="py-8 font-black text-stone-300 tabular-nums">
                    {row.time}
                  </td>
                  <td className="py-8 font-light text-[#33302c] group-hover:text-[#c9a84c] transition-colors uppercase italic tracking-tight text-lg">
                    {row.class}
                  </td>
                  <td className="py-8 text-stone-400 uppercase tracking-widest text-[10px] font-bold">
                    {row.teacher}
                  </td>
                  <td className="py-8">
                    <Badge className="bg-stone-100 text-stone-500 border-none text-[10px] uppercase tracking-widest px-3 py-1 font-black">
                      {row.type}
                    </Badge>
                  </td>
                  <td className="py-8 text-right">
                    <button
                      onClick={triggerBooking}
                      className="text-[10px] font-black uppercase tracking-widest text-[#c9a84c] hover:text-[#33302c] transition-colors bg-transparent border-none cursor-pointer"
                    >
                      Reserve_Mat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
