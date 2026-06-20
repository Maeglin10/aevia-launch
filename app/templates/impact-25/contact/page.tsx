"use client"

import { useState } from "react"
import { Mail, MessageSquare, Zap } from "lucide-react"
import { Reveal } from "../shared"

export default function ContactPage() {
  const [contactSubmitted, setContactSubmitted] = useState(false)

  return (
    <div className="relative w-full overflow-hidden pb-24">
      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#6C47FF]/10 rounded-full blur-3xl" />
      </div>

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side text info */}
            <div className="lg:col-span-5 space-y-8">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#6C47FF]/10 border border-[#6C47FF]/30 text-[#A78BFA] text-sm font-medium px-4 py-2 rounded-full mb-6">
                  <MessageSquare className="w-4 h-4" /> Get in touch
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-none">
                  Talk to our<br />
                  <span className="bg-gradient-to-r from-[#6C47FF] to-[#A78BFA] bg-clip-text text-transparent">data experts.</span>
                </h1>
              </Reveal>
              
              <Reveal delay={0.1}>
                <p className="text-lg text-white/55 leading-relaxed">
                  Have questions about analytics, custom pricing, or how Prism fits into your current stack? Drop us a line.
                </p>
              </Reveal>

              <Reveal delay={0.2} className="space-y-6">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="w-12 h-12 bg-[#6C47FF]/10 rounded-xl flex items-center justify-center text-[#A78BFA]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Email support</h3>
                    <p className="text-xs text-white/40">contact@aevia.ws</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="w-12 h-12 bg-[#6C47FF]/10 rounded-xl flex items-center justify-center text-[#A78BFA]">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Enterprise inquiry</h3>
                    <p className="text-xs text-white/40">Dedicated support SLA & custom metrics</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right side form */}
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10">
                  {contactSubmitted ? (
                    <div className="text-center py-16 space-y-6">
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">Message sent</h3>
                      <p className="text-white/60 text-sm">Merci, nous vous répondrons sous 24h.</p>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        setContactSubmitted(true)
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">First & last name</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6C47FF] transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">Work email</label>
                          <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6C47FF] transition-all"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">Company website</label>
                          <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6C47FF] transition-all"
                            placeholder="example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">Company size</label>
                          <select className="w-full bg-[#0F1626] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6C47FF] transition-all">
                            <option>1 - 10 employees</option>
                            <option>11 - 50 employees</option>
                            <option>51 - 250 employees</option>
                            <option>250+ employees</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-white/60 mb-2">How can we help you?</label>
                        <textarea
                          required
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6C47FF] transition-all"
                          placeholder="Tell us about your analytics needs..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 bg-[#6C47FF] hover:bg-[#7C5CFF] text-white font-semibold rounded-full transition-all text-sm cursor-pointer"
                      >
                        Send message
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
