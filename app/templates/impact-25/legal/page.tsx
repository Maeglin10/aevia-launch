"use client"

import { Shield } from "lucide-react"
import { Reveal } from "../shared"

export default function LegalPage() {
  return (
    <div className="relative w-full overflow-hidden pb-24">
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-xs px-4 py-2 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5" /> Legal Notice & Terms
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-8">Legal Notice</h1>
          </Reveal>
          
          <Reveal delay={0.1}>
            <div className="space-y-8">
              {[
                { title: "Publisher", content: "Prism Analytics is a service provided by Aevia WS — Valentin Milliand, sole proprietorship. Registered under SIREN: 852 546 225 at RCS Bourg-en-Bresse, France." },
                { title: "Contact", content: "For any inquiries, please contact us at: contact@aevia.ws" },
                { title: "Hosting", content: "This site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA." },
                { title: "Intellectual Property", content: "All text, design, and code are protected. Any unauthorized distribution or reuse is strictly prohibited." },
                { title: "Data Protection (GDPR)", content: "We do not store PII without your consent. Your usage data is secure, encrypted, and compliant with all European privacy standards." }
              ].map((item, i) => (
                <div key={item.title} className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-base mb-2 text-[#A78BFA]">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
