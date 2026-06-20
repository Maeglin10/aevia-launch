"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { ArrowRight, GitBranch, Mail, Linkedin, Calendar, CheckCircle2, Terminal, Code2, Clock, MapPin, Shield } from "lucide-react"
import { Reveal, services, testimonials } from "../shared"
import Image from "next/image"

const faq = [
  {
    q: "What does a typical engagement look like?",
    a: "Most engagements start with a 1-week discovery, then move to 4–8 week delivery sprints with weekly Loom updates. I document everything as I go — no scramble at the end.",
  },
  {
    q: "Do you work on-site or remotely?",
    a: "Remote-first, but I'm available for 1–2 day on-site sessions per month for teams in Paris or within a 2h train/flight radius. Travel costs are billed at cost.",
  },
  {
    q: "What's your rate structure?",
    a: "Day rates for embedded work (€1,200/day), flat fees for audits and due diligence (€8,000 for a 2-week performance audit), and custom pricing for advisory retainers. Invoices in EUR via bank transfer or Stripe.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, standard NDA before any technical discovery. I have a template or can use yours. Turnaround is typically same-day.",
  },
  {
    q: "What's your current availability?",
    a: "I take on 1–2 engagements per quarter. For Q3 2026, I have capacity for one more focused engagement starting in July. Reach out early — the queue fills fast.",
  },
  {
    q: "Can you join as a fractional CTO?",
    a: "For the right team, yes. Fractional CTO engagements run 6–12 months with a minimum of 2 days/week. These are scoped separately from pure engineering work.",
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Occasionally, when the technical challenge is interesting and the founding team has strong domain expertise. Seed-stage pricing is available for bootstrapped companies.",
  },
  {
    q: "What's the fastest way to get a response?",
    a: "Email. I check it twice daily (09:00 and 16:00 Paris time) and respond within one business day. LinkedIn is slower — I batch it weekly.",
  },
]

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@aevia.ws",
    href: "mailto:hello@aevia.ws",
    note: "Response within 1 business day",
    primary: true,
  },
  {
    icon: GitBranch,
    label: "GitHub",
    value: "github.com/glitchdev",
    href: "https://github.com",
    note: "Source code and issue tracker",
    primary: false,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/raphael-genet",
    href: "https://linkedin.com",
    note: "Checked weekly",
    primary: false,
  },
  {
    icon: Calendar,
    label: "Cal.com",
    value: "cal.com/raphaelgenet",
    href: "https://cal.com",
    note: "Book a 30-min intro call",
    primary: false,
  },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
    budget: "",
  })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In production this would call an API endpoint
    setSubmitted(true)
  }

  return (
    <div className="pt-28 min-h-screen">

      {/* Header */}
      <section className="py-20 px-6 border-b border-[#00F5D4]/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `linear-gradient(rgba(0,245,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-[#00F5D4] text-xs mb-3"><span className="text-[#475569]">// </span>get_in_touch</div>
            <h1 className="font-bold leading-[1.05] mb-6" style={{ fontSize: "clamp(36px, 7vw, 80px)" }}>
              Contact
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00F5D4]" />
                Paris, France
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00F5D4]" />
                CET (UTC+1) · Replies by 16:00
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00F5D4]" />
                NDA same-day
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Channels + Form */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: channels + availability */}
          <div>
            <Reveal className="mb-10">
              <div className="text-[#00F5D4] text-xs mb-6"><span className="text-[#475569]">// </span>how_to_reach_me</div>
              <div className="space-y-3">
                {channels.map((ch) => (
                  <a
                    key={ch.label}
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 border p-5 hover:border-[#00F5D4]/50 transition-colors group cursor-pointer ${
                      ch.primary ? "border-[#00F5D4]/50 bg-[#00F5D4]/5" : "border-[#00F5D4]/15"
                    }`}
                  >
                    <ch.icon className="w-5 h-5 text-[#00F5D4] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#475569] mb-0.5">{ch.label}</div>
                      <div className="text-sm font-bold text-[#E2E8F0] group-hover:text-[#00F5D4] transition-colors truncate">{ch.value}</div>
                    </div>
                    <div className="text-xs text-[#475569] text-right shrink-0 hidden sm:block">{ch.note}</div>
                  </a>
                ))}
              </div>
            </Reveal>

            {/* Availability block */}
            <Reveal delay={0.1}>
              <div className="border border-[#00F5D4]/20 bg-[#0D1323] p-6 mb-10">
                <div className="text-[#00F5D4] text-xs mb-4"><span className="text-[#475569]">// </span>current_availability</div>
                <div className="space-y-3">
                  {[
                    { quarter: "Q3 2026 (Jul–Sep)", status: "1 slot open", color: "text-emerald-400" },
                    { quarter: "Q4 2026 (Oct–Dec)", status: "Taking inquiries", color: "text-yellow-400" },
                    { quarter: "Q1 2027 (Jan–Mar)", status: "Planning phase", color: "text-[#475569]" },
                  ].map((row) => (
                    <div key={row.quarter} className="flex items-center justify-between text-sm">
                      <span className="text-[#94A3B8]">{row.quarter}</span>
                      <span className={`font-bold ${row.color}`}>{row.status}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-[#00F5D4]/10 text-xs text-[#475569]">
                  <span className="text-[#00F5D4]">const </span>timezone = <span className="text-emerald-400">"Europe/Paris"</span>
                </div>
              </div>
            </Reveal>

            {/* Testimonial excerpt */}
            <Reveal delay={0.15}>
              <div className="border border-[#00F5D4]/10 p-6">
                <div className="text-[#00F5D4] text-base mb-4 select-none">&ldquo;</div>
                <blockquote className="text-[#E2E8F0] text-sm leading-relaxed mb-6">
                  {testimonials[0].quote}
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00F5D4]/20 shrink-0">
                    <Image src={testimonials[0].avatar} alt={testimonials[0].name} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{testimonials[0].name}</div>
                    <div className="text-xs text-[#475569]">{testimonials[0].role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <div>
            <Reveal>
              <div className="text-[#00F5D4] text-xs mb-6"><span className="text-[#475569]">// </span>send_a_message</div>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-[#00F5D4]/30 bg-[#00F5D4]/5 p-10 text-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-[#00F5D4] mx-auto mb-4" />
                    <div className="font-bold text-lg mb-2 text-[#E2E8F0]">Message sent</div>
                    <div className="text-[#94A3B8] text-sm mb-6">I'll reply within one business day. Check your spam folder if you don't hear from me by then.</div>
                    <div className="text-xs text-[#475569]">
                      <span className="text-[#00F5D4]">✓ </span>
                      Contact form submitted successfully
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#475569] mb-2">
                          <span className="text-[#00F5D4]">// </span>name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                          placeholder="Raphaël Genet"
                          className="w-full bg-[#0D1323] border border-[#00F5D4]/20 text-[#E2E8F0] text-sm px-4 py-3 focus:outline-none focus:border-[#00F5D4]/60 placeholder-[#475569] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#475569] mb-2">
                          <span className="text-[#00F5D4]">// </span>email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                          placeholder="you@company.com"
                          className="w-full bg-[#0D1323] border border-[#00F5D4]/20 text-[#E2E8F0] text-sm px-4 py-3 focus:outline-none focus:border-[#00F5D4]/60 placeholder-[#475569] transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#475569] mb-2">
                          <span className="text-[#00F5D4]">// </span>company
                        </label>
                        <input
                          type="text"
                          value={formState.company}
                          onChange={e => setFormState(s => ({ ...s, company: e.target.value }))}
                          placeholder="Acme Corp"
                          className="w-full bg-[#0D1323] border border-[#00F5D4]/20 text-[#E2E8F0] text-sm px-4 py-3 focus:outline-none focus:border-[#00F5D4]/60 placeholder-[#475569] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#475569] mb-2">
                          <span className="text-[#00F5D4]">// </span>budget_range
                        </label>
                        <select
                          value={formState.budget}
                          onChange={e => setFormState(s => ({ ...s, budget: e.target.value }))}
                          className="w-full bg-[#0D1323] border border-[#00F5D4]/20 text-[#E2E8F0] text-sm px-4 py-3 focus:outline-none focus:border-[#00F5D4]/60 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="text-[#475569]">Select range</option>
                          <option value="<10k">&lt; €10,000</option>
                          <option value="10-30k">€10,000 – €30,000</option>
                          <option value="30-60k">€30,000 – €60,000</option>
                          <option value="60k+">€60,000+</option>
                          <option value="retainer">Monthly retainer</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#475569] mb-2">
                        <span className="text-[#00F5D4]">// </span>service_type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {services.map(svc => (
                          <button
                            key={svc.id}
                            type="button"
                            onClick={() => setFormState(s => ({ ...s, service: svc.id }))}
                            className={`px-3 py-2 text-xs text-left border transition-all cursor-pointer ${
                              formState.service === svc.id
                                ? "border-[#00F5D4] bg-[#00F5D4]/10 text-[#00F5D4]"
                                : "border-[#00F5D4]/15 text-[#475569] hover:border-[#00F5D4]/40 hover:text-[#E2E8F0]"
                            }`}
                          >
                            <span className="text-[#475569] mr-1">{svc.id}</span> {svc.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#475569] mb-2">
                        <span className="text-[#00F5D4]">// </span>message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formState.message}
                        onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                        placeholder="Describe the problem you're trying to solve, the timeline, and the team context..."
                        className="w-full bg-[#0D1323] border border-[#00F5D4]/20 text-[#E2E8F0] text-sm px-4 py-3 focus:outline-none focus:border-[#00F5D4]/60 placeholder-[#475569] transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#00F5D4] text-[#0A0E1A] font-bold text-sm py-4 hover:bg-[#00E5C4] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Send message <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-[#475569] text-center">
                      No newsletter. No spam. Just a reply from me.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>frequently_asked</div>
            <h2 className="font-bold text-3xl md:text-4xl">FAQ</h2>
          </Reveal>
          <div className="space-y-px">
            {faq.map((item, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="border border-[#00F5D4]/10 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-8 py-5 flex items-center justify-between gap-4 hover:bg-[#0A0E1A] transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-[#E2E8F0]">{item.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#00F5D4] text-lg shrink-0 select-none"
                    >
                      +
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-5 text-sm text-[#94A3B8] leading-relaxed border-t border-[#00F5D4]/10 pt-4">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* More testimonials */}
      <section className="py-24 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>from_past_clients</div>
            <h2 className="font-bold text-3xl">More references</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(1).map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="border border-[#00F5D4]/15 p-6 hover:border-[#00F5D4]/30 transition-colors h-full flex flex-col">
                  <div className="text-[#00F5D4] text-lg mb-4 select-none">&ldquo;</div>
                  <blockquote className="text-[#94A3B8] text-sm leading-relaxed flex-1 mb-6">{t.quote}</blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00F5D4]/20 shrink-0">
                      <Image src={t.avatar} alt={t.name} width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{t.name}</div>
                      <div className="text-xs text-[#475569]">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal CTA */}
      <section className="py-20 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="bg-[#0D1323] border border-[#00F5D4]/20 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0F1729] border-b border-[#00F5D4]/10">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-xs text-[#475569] ml-2">glitch.dev — contact</span>
              </div>
              <div className="p-6 text-sm space-y-2">
                {[
                  { p: "$ ", t: "send-message --to hello@aevia.ws --priority high", c: "text-[#00F5D4]" },
                  { p: "  ", t: "Connecting to mail server...", c: "text-[#475569]" },
                  { p: "✓ ", t: "Message queued for delivery", c: "text-emerald-400" },
                  { p: "  ", t: "Expected response time: < 24h", c: "text-[#475569]" },
                  { p: "$ ", t: "", c: "text-[#00F5D4]" },
                ].map((line, i) => (
                  <div key={i} className="flex">
                    <span className={`${line.c} mr-2 shrink-0`}>{line.p}</span>
                    <span className="text-[#94A3B8]">{line.t}</span>
                    {i === 4 && <span className="inline-block w-2 h-4 bg-[#00F5D4] animate-pulse ml-0.5" />}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/templates/impact-29/work"
              className="border border-[#00F5D4]/20 text-[#00F5D4] text-sm px-6 py-3 hover:bg-[#00F5D4]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4" /> Browse the work
            </Link>
            <Link
              href="/templates/impact-29/studio"
              className="border border-[#00F5D4]/20 text-[#475569] text-sm px-6 py-3 hover:border-[#00F5D4]/40 hover:text-[#E2E8F0] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" /> The Studio
            </Link>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
