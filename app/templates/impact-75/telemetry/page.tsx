"use client";
import { useEffect, useState } from "react";
// @ts-nocheck

import { motion } from "framer-motion";
import { Radio, Shield, Binary, Cpu, Activity, Terminal } from "lucide-react";
import { Reveal, GridBackground } from "../shared";


// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

export default function TelemetryPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
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
    <div className="py-20 bg-[#050810]">
      <GridBackground />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <Reveal className="text-center mb-24 max-w-4xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-cyan-500 block mb-10 italic">
            Active Telemetry
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[1.15] italic mb-12 pb-4">
            System Telemetry.
          </h1>
          <p className="text-xl text-white/30 italic font-light leading-relaxed">
            Sub-millisecond data encryption and downlinks.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="p-10 bg-white/5 border border-white/10 rounded group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-cyan-500/10">
                <Binary className="w-40 h-40" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="text-xs font-black text-cyan-500 tracking-widest uppercase italic border-b border-white/5 pb-4">
                  Encryption Protocols
                </div>
                <div className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/40 leading-relaxed">
                  <div className="flex justify-between">
                    <span>Uplink Protocol:</span>
                    <span className="text-white">QUIC / TLS 1.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cryptographic Core:</span>
                    <span className="text-white">Kyber-1024 (Post-Quantum)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Hash:</span>
                    <span className="text-white">SHA3-512 Immutable</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transmission Integrity:</span>
                    <span className="text-white">FEC Reed-Solomon Active</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="p-10 bg-white/5 border border-white/10 rounded group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-cyan-500/10">
                <Cpu className="w-40 h-40" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="text-xs font-black text-cyan-500 tracking-widest uppercase italic border-b border-white/5 pb-4">
                  Hardware Speeds
                </div>
                <div className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/40 leading-relaxed">
                  <div className="flex justify-between">
                    <span>Processor Node:</span>
                    <span className="text-white">TENSORCORE H100 GPU</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downlink Bandwidth:</span>
                    <span className="text-white">100 Gbps Dedicated</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payload Latency:</span>
                    <span className="text-white">&lt; 2.4ms Hardware Isolated</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Buffer Memory:</span>
                    <span className="text-white">64GB ECC HBM3</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
