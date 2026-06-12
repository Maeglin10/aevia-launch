"use client"

import React from "react"
import { Shield, Mail, FileText } from "lucide-react"
import { C, Reveal, GlassCard } from "../shared"

export default function LegalPage() {
  return (
    <div className="py-20 px-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <Reveal>
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
            Legal Information
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Legal Notice & Privacy
          </h1>
          <p className="text-lg text-[#64748B]">
            WaveForm is a demo website managed by Aevia WS. Find our legal details below.
          </p>
        </div>
      </Reveal>

      <div className="flex flex-col gap-8">
        {/* Legal Notice */}
        <Reveal delay={0.05}>
          <GlassCard className="p-8 bg-white/[0.02] border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-[#F97316]" />
              <h2 className="text-xl font-bold text-white">1. Editor Info</h2>
            </div>
            <div className="text-[#94A3B8] text-sm leading-relaxed flex flex-col gap-4">
              <p>
                The WaveForm website is a showcase demonstration operated by Aevia WS, represented by Valentin Milliand.
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-2">
                <li><strong>Publisher:</strong> Valentin Milliand</li>
                <li><strong>Legal Form:</strong> Auto-entrepreneur (Aevia WS)</li>
                <li><strong>Registration Number (SIREN):</strong> 852 546 225</li>
                <li><strong>RCS Registration:</strong> RCS Bourg-en-Bresse</li>
                <li>
                  <strong>Address:</strong> Physical address provided upon request in accordance with local regulations.
                </li>
                <li>
                  <strong>Contact Email:</strong>{" "}
                  <a href="mailto:contact@aevia.io" className="text-[#F97316] hover:underline font-semibold">
                    contact@aevia.io
                  </a>
                </li>
              </ul>
            </div>
          </GlassCard>
        </Reveal>

        {/* Web Hosting */}
        <Reveal delay={0.1}>
          <GlassCard className="p-8 bg-white/[0.02] border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#F97316]" />
              <h2 className="text-xl font-bold text-white">2. Hosting Services</h2>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              This template and overall website is hosted by <strong>Vercel Inc.</strong>, located at 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
              You can contact them directly on their official website (vercel.com) for any hosting compliance matters.
            </p>
          </GlassCard>
        </Reveal>

        {/* Intellectual Property & Mock Data */}
        <Reveal delay={0.15}>
          <GlassCard className="p-8 bg-white/[0.02] border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#F97316]" />
              <h2 className="text-xl font-bold text-white">3. Intellectual Property & Privacy</h2>
            </div>
            <div className="text-[#94A3B8] text-sm leading-relaxed flex flex-col gap-4">
              <p>
                All elements of the WaveForm showcase template (including logos, interactive charts, and page layout) are properties of Aevia WS.
                Any duplication or use without explicit authorization is prohibited.
              </p>
              <p>
                <strong>Personal Data & Privacy:</strong> We value your privacy. When you interact with forms on this demonstration site, any collected details (such as your mock podcast name and email address) are processed solely for the purpose of simulating features. We do not sell or distribute your data.
              </p>
              <p>
                You have the right to access, rectify, or request the deletion of your personal data at any time by contacting us at{" "}
                <a href="mailto:contact@aevia.io" className="text-[#F97316] hover:underline font-semibold">
                  contact@aevia.io
                </a>.
              </p>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </div>
  )
}
