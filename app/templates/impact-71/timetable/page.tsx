"use client";
// @ts-nocheck

import { Badge } from "@/components/ui/badge";
import { SCHEDULE, Reveal } from "../shared";

export default function TimetablePage() {
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
                    <Badge className="bg-stone-100 text-stone-500 border-none text-[9px] uppercase tracking-widest px-3 py-1 font-black">
                      {row.type}
                    </Badge>
                  </td>
                  <td className="py-8 text-right">
                    <button
                      onClick={triggerBooking}
                      className="text-[9px] font-black uppercase tracking-widest text-[#c9a84c] hover:text-[#33302c] transition-colors bg-transparent border-none cursor-pointer"
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
