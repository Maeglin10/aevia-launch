"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Reveal, gridOverlay, monoStyle, Label } from "../shared"
import {
  ArrowRight, CheckCircle, Zap, Box, Layers,
  Globe, Cpu, Mail, MapPin, Clock, ChevronRight
} from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  { id: "3d-viz", label: "3D Product Visualization", icon: <Box className="w-4 h-4" /> },
  { id: "ar", label: "Augmented Reality (WebAR)", icon: <Layers className="w-4 h-4" /> },
  { id: "virtual-env", label: "Virtual Environment / Showroom", icon: <Globe className="w-4 h-4" /> },
  { id: "gpu", label: "GPU / Shader Optimization", icon: <Cpu className="w-4 h-4" /> },
  { id: "other", label: "Something else", icon: <Zap className="w-4 h-4" /> },
]

const BUDGET_OPTIONS = [
  { id: "b1", label: "< $5k", desc: "Discovery sprint" },
  { id: "b2", label: "$5k – $20k", desc: "Single project" },
  { id: "b3", label: "$20k – $60k", desc: "Full production" },
  { id: "b4", label: "$60k+", desc: "Enterprise / ongoing" },
]

const TIMELINE_OPTIONS = [
  { id: "t1", label: "< 1 month", desc: "Urgent" },
  { id: "t2", label: "1 – 3 months", desc: "Standard" },
  { id: "t3", label: "3 – 6 months", desc: "Complex" },
  { id: "t4", label: "6 months+", desc: "Strategic partnership" },
]

const FAQ = [
  {
    q: "How quickly do you respond?",
    a: "We reply to every inquiry within 24 business hours. If your project is urgent, mention it in the brief and we'll fast-track the conversation.",
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Yes. We have a Discovery Sprint package starting at $4,800 that's designed for teams exploring 3D for the first time without a large commitment.",
  },
  {
    q: "Can you embed with our internal team?",
    a: "Absolutely. Our Enterprise tier is structured as a dedicated team embed. We've worked embedded inside Fortune 500 digital product teams for months at a time.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, we sign NDAs before discussing any proprietary details. Send us a request and we'll turn it around within the same day.",
  },
]

// ─── Form State Types ─────────────────────────────────────────────────────────

interface FormState {
  name: string
  email: string
  company: string
  projectType: string
  budget: string
  timeline: string
  description: string
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  timeline: "",
  description: "",
}

// ─── Step 1: Project Type ─────────────────────────────────────────────────────

function StepProjectType({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">What type of project?</h3>
      <p className="text-white/40 text-sm mb-6">Select the closest match — we can explore combinations later.</p>
      <div className="grid grid-cols-1 gap-3">
        {PROJECT_TYPES.map(pt => (
          <button
            key={pt.id}
            onClick={() => onChange(pt.id)}
            type="button"
            className={`w-full flex items-center gap-4 text-left rounded-xl border p-4 transition-all cursor-pointer ${
              value === pt.id
                ? "bg-[#9B5CF6]/10 border-[#9B5CF6]/50 text-white"
                : "bg-white/[0.03] border-white/8 text-white/55 hover:border-white/15 hover:text-white"
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              value === pt.id ? "bg-[#9B5CF6] text-white" : "bg-white/5 text-white/35"
            }`}>
              {pt.icon}
            </div>
            <span className="font-medium text-sm">{pt.label}</span>
            {value === pt.id && (
              <CheckCircle className="w-4 h-4 text-[#9B5CF6] ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 2: Budget & Timeline ────────────────────────────────────────────────

function StepBudgetTimeline({
  budget,
  timeline,
  onBudget,
  onTimeline,
}: {
  budget: string
  timeline: string
  onBudget: (v: string) => void
  onTimeline: (v: string) => void
}) {
  return (
    <div className="space-y-8">
      {/* Budget */}
      <div>
        <h3 className="text-lg font-semibold mb-1">What's your budget range?</h3>
        <p className="text-white/40 text-sm mb-5">This helps us recommend the right package.</p>
        <div className="grid grid-cols-2 gap-3">
          {BUDGET_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => onBudget(opt.id)}
              type="button"
              className={`flex flex-col items-start rounded-xl border p-4 transition-all cursor-pointer ${
                budget === opt.id
                  ? "bg-[#9B5CF6]/10 border-[#9B5CF6]/50"
                  : "bg-white/[0.03] border-white/8 hover:border-white/15"
              }`}
            >
              <span className={`font-bold text-base mb-0.5 ${budget === opt.id ? "text-[#9B5CF6]" : "text-white"}`} style={monoStyle}>
                {opt.label}
              </span>
              <span className="text-white/35 text-xs">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-lg font-semibold mb-1">What's your timeline?</h3>
        <p className="text-white/40 text-sm mb-5">When do you need this live?</p>
        <div className="grid grid-cols-2 gap-3">
          {TIMELINE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => onTimeline(opt.id)}
              type="button"
              className={`flex flex-col items-start rounded-xl border p-4 transition-all cursor-pointer ${
                timeline === opt.id
                  ? "bg-[#9B5CF6]/10 border-[#9B5CF6]/50"
                  : "bg-white/[0.03] border-white/8 hover:border-white/15"
              }`}
            >
              <span className={`font-bold text-base mb-0.5 ${timeline === opt.id ? "text-[#9B5CF6]" : "text-white"}`} style={monoStyle}>
                {opt.label}
              </span>
              <span className="text-white/35 text-xs">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Contact Details + Description ────────────────────────────────────

function StepDetails({
  form,
  onChange,
}: {
  form: FormState
  onChange: (key: keyof FormState, value: string) => void
}) {
  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#9B5CF6]/50 transition-colors"

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">Tell us about you</h3>
      <p className="text-white/40 text-sm mb-6">Last step — then we'll review and reach out within 24 hours.</p>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider" style={monoStyle}>
              Full name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => onChange("name", e.target.value)}
              placeholder="Alex Martin"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider" style={monoStyle}>
              Work email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => onChange("email", e.target.value)}
              placeholder="alex@company.com"
              className={inputClass}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider" style={monoStyle}>
            Company / brand
          </label>
          <input
            type="text"
            value={form.company}
            onChange={e => onChange("company", e.target.value)}
            placeholder="Acme Corp"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider" style={monoStyle}>
            Project brief *
          </label>
          <textarea
            value={form.description}
            onChange={e => onChange("description", e.target.value)}
            placeholder="Describe your project — what do you want to build, what problem does it solve, who are the end users? The more detail, the better."
            rows={5}
            className={`${inputClass} resize-none`}
            required
          />
        </div>
      </div>
    </div>
  )
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-10"
    >
      {/* Animated check */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="w-24 h-24 rounded-full bg-[#9B5CF6]/15 border border-[#9B5CF6]/30 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <CheckCircle className="w-12 h-12 text-[#9B5CF6]" />
          </motion.div>
        </div>
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-[#9B5CF6]/20"
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
        />
      </div>

      <h2 className="text-3xl md:text-4xl font-bold mb-4">Brief received.</h2>
      <p className="text-white/50 text-base mb-8 max-w-sm mx-auto leading-relaxed">
        We'll review your project and get back to you within 24 hours. Check your inbox — including spam.
      </p>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 max-w-sm mx-auto mb-8 text-left">
        <p className="text-xs text-[#9B5CF6] uppercase tracking-widest mb-3" style={monoStyle}>What happens next</p>
        {[
          "We read your brief carefully (today)",
          "A senior team member prepares a custom response",
          "You receive a scope outline + timeline estimate",
          "We schedule a 20-minute call if it's a fit",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3 mb-2.5 last:mb-0">
            <span
              className="w-5 h-5 bg-[#9B5CF6]/15 text-[#9B5CF6] rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
              style={monoStyle}
            >
              {i + 1}
            </span>
            <span className="text-white/55 text-sm">{step}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/templates/impact-27/work"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          Browse our work <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/templates/impact-27"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          Back to home <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section>
      <Reveal className="mb-8">
        <Label>FAQ</Label>
        <h2 className="text-2xl md:text-3xl font-bold">Common questions</h2>
      </Reveal>
      <div className="divide-y divide-white/5">
        {FAQ.map((item, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="py-4">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                aria-expanded={openIdx === i}
              >
                <span className={`font-semibold text-base transition-colors ${openIdx === i ? "text-[#9B5CF6]" : "text-white/80 group-hover:text-white"}`}>
                  {item.q}
                </span>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 text-white/30 group-hover:text-[#9B5CF6] transition-all ${openIdx === i ? "rotate-90 text-[#9B5CF6]" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-white/50 text-sm leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── Multi-step Form ──────────────────────────────────────────────────────────

const STEP_LABELS = ["Project type", "Budget & timeline", "Your details"]
const TOTAL_STEPS = 3

function MultiStepForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const setField = useCallback((key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }, [])

  const canNext = useCallback(() => {
    if (step === 0) return !!form.projectType
    if (step === 1) return !!form.budget && !!form.timeline
    if (step === 2) return !!form.name && !!form.email && !!form.description
    return false
  }, [step, form])

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1)
    } else {
      // Simulate submission
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setSubmitted(true)
      }, 1200)
    }
  }, [step])

  if (submitted) {
    return <SuccessState />
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                i < step ? "bg-[#9B5CF6] text-white" :
                i === step ? "bg-[#9B5CF6]/20 border border-[#9B5CF6]/60 text-[#9B5CF6]" :
                "bg-white/5 border border-white/10 text-white/30"
              }`} style={monoStyle}>
                {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block transition-colors ${
                i === step ? "text-white" : i < step ? "text-[#9B5CF6]" : "text-white/30"
              }`} style={monoStyle}>
                {label}
              </span>
              {i < TOTAL_STEPS - 1 && (
                <div className={`h-px w-8 md:w-16 transition-all ${i < step ? "bg-[#9B5CF6]" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
        {/* Bar */}
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#9B5CF6] rounded-full"
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <StepProjectType
                value={form.projectType}
                onChange={v => setField("projectType", v)}
              />
            )}
            {step === 1 && (
              <StepBudgetTimeline
                budget={form.budget}
                timeline={form.timeline}
                onBudget={v => setField("budget", v)}
                onTimeline={v => setField("timeline", v)}
              />
            )}
            {step === 2 && (
              <StepDetails form={form} onChange={setField} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm text-white/40 hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canNext() || isLoading}
          className="flex items-center gap-2 bg-[#9B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-full transition-all text-sm cursor-pointer"
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
              Sending...
            </>
          ) : step === TOTAL_STEPS - 1 ? (
            <>Send brief <Zap className="w-4 h-4" /></>
          ) : (
            <>Next step <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none" style={gridOverlay} />

      {/* Purple glow top-right */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-[#9B5CF6]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto relative">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <Reveal className="mb-16">
          <Label>New project</Label>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Let's build<br />
            <span className="text-[#9B5CF6]">something spatial.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            Fill in the project brief below. We'll get back to you within 24 hours with a scope, timeline, and initial recommendations — no sales call required.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── Left: Form ─────────────────────────────────────────────── */}
          <div>
            <Reveal>
              <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-8 md:p-10">
                <MultiStepForm />
              </div>
            </Reveal>
          </div>

          {/* ── Right: Info sidebar ─────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Contact info */}
            <Reveal delay={0.1}>
              <div className="bg-[#120B1A] border border-white/5 rounded-2xl p-8">
                <h3 className="font-bold text-lg mb-6">Studio contact</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Mail className="w-4 h-4 text-[#9B5CF6]" />,
                      label: "Email",
                      value: "hello@vertexstudio.io",
                    },
                    {
                      icon: <MapPin className="w-4 h-4 text-[#9B5CF6]" />,
                      label: "Location",
                      value: "Paris, France (Remote-first)",
                    },
                    {
                      icon: <Clock className="w-4 h-4 text-[#9B5CF6]" />,
                      label: "Response time",
                      value: "Within 24 business hours",
                    },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#9B5CF6]/10 rounded-lg flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-[10px] text-white/35 uppercase tracking-wider" style={monoStyle}>{item.label}</div>
                        <div className="text-sm text-white/75 font-medium mt-0.5">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Social proof */}
            <Reveal delay={0.15}>
              <div className="bg-gradient-to-br from-[#9B5CF6]/10 to-[#120B1A] border border-[#9B5CF6]/20 rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-[#9B5CF6] text-[#9B5CF6]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed italic mb-5">
                  "Vertex replied to our brief within 6 hours. By day 3 we had a working prototype. The speed and quality were unlike any agency we'd worked with."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#9B5CF6]/20 flex items-center justify-center text-xs font-bold text-[#9B5CF6]" style={monoStyle}>
                    JR
                  </div>
                  <div>
                    <div className="text-sm font-semibold">James Roux</div>
                    <div className="text-xs text-white/35">Head of Product, Forma Studios</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.2}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: "24h", label: "Avg. response" },
                  { val: "200+", label: "Projects" },
                  { val: "40+", label: "Clients" },
                ].map(({ val, label }) => (
                  <div key={label} className="bg-[#120B1A] border border-white/5 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-[#9B5CF6]" style={monoStyle}>{val}</div>
                    <div className="text-[10px] text-white/35 mt-1 uppercase tracking-wider" style={monoStyle}>{label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Clients list */}
            <Reveal delay={0.25}>
              <div className="bg-[#120B1A] border border-white/5 rounded-2xl p-6">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4" style={monoStyle}>Trusted by</p>
                <div className="flex flex-wrap gap-2">
                  {["Phantom Motors", "ArcSpace", "Luminary", "Valo Corp", "Studio Levi", "Forma", "Nexus Cloud", "Helio Medical"].map(c => (
                    <span key={c} className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-default border border-white/5 rounded-full px-3 py-1">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <div className="mt-20 max-w-2xl">
          <FAQSection />
        </div>
      </div>
    </div>
  )
}
