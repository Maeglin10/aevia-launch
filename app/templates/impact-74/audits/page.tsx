"use client";
// @ts-nocheck

import { ShieldCheck, Terminal } from "lucide-react";
import { AUDIT_LOGS, Reveal, Counter } from "../shared";

export default function AuditsPage() {
  return (
    <div className="py-20 bg-[#05060a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-500 mb-6 block">
                Immutable Integrity
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.15] mb-12 text-white uppercase italic pb-4">
                Neural <br /> <span className="text-emerald-500">Audit.</span>
              </h2>
              <p className="text-lg text-white/20 leading-relaxed font-bold mb-16 uppercase tracking-tight italic">
                Every internal system event is cross-referenced against 12
                separate integrity nodes to ensure zero unauthorized
                manipulation.
              </p>

              <div className="space-y-6">
                {[
                  {
                    label: "Audit Latency",
                    val: 2,
                    suffix: "ms",
                    desc: "Real-time verification of kernel-level instructions.",
                  },
                  {
                    label: "Compliance Score",
                    val: 100,
                    suffix: "%",
                    desc: "Always-on auditing for SOC2, HIPAA, and PCI-DSS.",
                  },
                  {
                    label: "Active Perimeters",
                    val: 840,
                    suffix: "+",
                    desc: "Institutional networks monitored by Aevia Neural Hub.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group border-l border-emerald-500/20 pl-8 hover:border-emerald-500 transition-all"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-2 text-white/60">
                      {item.label}
                    </h4>
                    <div className="text-3xl font-black text-emerald-500 mb-2 uppercase italic tabular-nums">
                      <Counter to={item.val} suffix={item.suffix} />
                    </div>
                    <p className="text-[10px] text-white/10 leading-relaxed font-bold uppercase tracking-widest">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal className="space-y-4">
              {AUDIT_LOGS.map((log, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-white mb-1">
                        {log.event}
                      </h4>
                      <span className="text-[9px] font-bold text-white/20 uppercase">
                        Node: {log.node}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                      {log.status}
                    </div>
                    <span className="text-[9px] font-bold text-white/10 uppercase italic">
                      Response: {log.latency}
                    </span>
                  </div>
                </div>
              ))}
              <div className="p-12 bg-emerald-600/5 border border-emerald-500/20 rounded-3xl mt-12 text-center">
                <Terminal className="w-8 h-8 text-emerald-500 mx-auto mb-6" />
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic">
                  Request Protocol Audit
                </h3>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-8 leading-relaxed">
                  Full system integrity check across all global sectors.
                  Duration: ~140ms.
                </p>
                <button className="px-12 py-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">
                  INITIATE_FULL_SCAN
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
