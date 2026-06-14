// @ts-nocheck
"use client";

import Image from "next/image";
import { Zap, Globe } from "lucide-react";
import { CREATORS, Reveal, Counter } from "../shared";

export default function CreatorsPage() {
  return (
    <div className="py-20 bg-[#08080c] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center mb-32">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-500 mb-6 block">
                Creator Alpha
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.15] mb-12 text-white uppercase italic pb-4">
                Spotlight <br />{" "}
                <span className="text-rose-500">Engine.</span>
              </h2>
              <p className="text-lg text-white/20 leading-relaxed font-bold mb-16 uppercase tracking-tight italic">
                We don't just host creators. We amplify them. Proprietary
                discovery algorithms that prioritize quality over clicks.
              </p>

              <div className="space-y-6">
                {[
                  {
                    label: "New Creators Monthly",
                    val: 120,
                    suffix: "K+",
                    desc: "A rapidly growing ecosystem of global talent.",
                  },
                  {
                    label: "Creator Revenue Share",
                    val: 95,
                    suffix: "%",
                    desc: "Industry-leading payout structure. You keep your gains.",
                  },
                  {
                    label: "Sub-Second Latency",
                    val: 80,
                    suffix: "ms",
                    desc: "Near-instant interaction between you and your audience.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group border-l border-rose-500/20 pl-8 hover:border-rose-500 transition-all"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-2 text-white/60">
                      {item.label}
                    </h4>
                    <div className="text-3xl font-black text-rose-500 mb-2 uppercase italic tabular-nums">
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

          {/* CREATORS LIST GRAPHICS */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
            {CREATORS.map((c, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group bg-white/[0.02] border border-white/5 hover:border-rose-500/30 rounded-2xl p-6 text-center transition-all">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-8 border border-white/10">
                    <Image
                      src={c.img}
                      alt={c.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase mb-2 tracking-tight">
                    {c.name}
                  </h4>
                  <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-4">
                    {c.sub} Subscribers
                  </div>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold leading-relaxed">
                    Partner Creator broadcasting live in 8K HDR.
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
