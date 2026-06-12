"use client"

import { Reveal } from "../shared"
import { Shield } from "lucide-react"

export default function LegalPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <Reveal className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-[#9B5CF6]" />
          <span className="text-[#9B5CF6] text-xs tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>Legal Info</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy & Legal</h1>
        <p className="text-white/40 text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>Last updated: June 12, 2026</p>
      </Reveal>

      <div className="space-y-8 text-white/70 text-sm leading-relaxed">
        <Reveal>
          <h2 className="text-xl font-bold text-white mb-3">1. Legal Entity & Publisher</h2>
          <p>
            The Vertex Studio template showcase is published by <strong>Valentin Milliand</strong>, registered under SIREN number <strong>852 546 225</strong> at the RCS of <strong>Bourg-en-Bresse</strong>.
          </p>
          <p className="mt-2">
            In compliance with our regulatory guidelines, no physical corporate address is listed on this public portal.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="text-xl font-bold text-white mb-3">2. Hosting & Services</h2>
          <p>
            This website is hosted by Vercel Inc., located at 340 S Lemon Ave #4133, Walnut, CA 91789, USA. 
          </p>
        </Reveal>

        <Reveal>
          <h2 className="text-xl font-bold text-white mb-3">3. Data Collection & Cookies</h2>
          <p>
            We do not track, profile, or sell user behavior details. Any details input in our client contact form are routed securely to answer customer inquiries and are never sold or shared with external third-party agencies.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h2>
          <p>
            The creative 3D mesh formulations, visual shader scripts, assets, custom graphics, and UI layouts showcased on this website are protected under international copyright regulations. Any unauthorized extraction, duplication, or deployment of these materials is strictly prohibited without explicit developer consent.
          </p>
        </Reveal>
      </div>
    </div>
  )
}
