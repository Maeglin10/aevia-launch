"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, MapPin, Mail, Phone, Clock } from "lucide-react"
import { Reveal } from "../shared"

const offices = [
  {
    city: "Paris",
    label: "Main Atelier",
    address: "14 Rue de la Roquette, 75011 Paris",
    phone: "+33 1 42 78 91 00",
    email: "paris@brutco-architecture.com",
    hours: "Mon – Fri, 09:00 – 18:30",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop&crop=center",
  },
  {
    city: "Lyon",
    label: "South-East Bureau",
    address: "3 Quai Saint-Vincent, 69001 Lyon",
    phone: "+33 4 72 41 88 60",
    email: "lyon@brutco-architecture.com",
    hours: "Mon – Fri, 09:00 – 18:00",
    img: "https://images.unsplash.com/photo-1512470359936-06c27eb03b54?w=800&h=500&fit=crop&crop=center",
  },
  {
    city: "Marseille",
    label: "Mediterranean Studio",
    address: "7 Rue de la République, 13001 Marseille",
    phone: "+33 4 91 33 72 50",
    email: "marseille@brutco-architecture.com",
    hours: "Mon – Thu, 09:30 – 17:30",
    img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=500&fit=crop&crop=center",
  },
]

const projectTypes = [
  "Residential",
  "Commercial",
  "Cultural / Institutional",
  "Mixed Use",
  "Heritage Renovation",
  "Urban Masterplan",
  "Interior Architecture",
  "Competition Strategy",
]

const budgetRanges = [
  "< €1M",
  "€1M — €5M",
  "€5M — €20M",
  "€20M — €100M",
  "> €100M",
  "To be determined",
]

const timelines = [
  "Starting immediately",
  "Within 6 months",
  "Within 1 year",
  "2+ years",
  "Flexible",
]

type FormState = {
  name: string
  org: string
  email: string
  phone: string
  type: string
  budget: string
  timeline: string
  message: string
}

export default function ContactPage() {
  const [activeOffice, setActiveOffice] = useState(0)
  const [formState, setFormState] = useState<FormState>({
    name: "",
    org: "",
    email: "",
    phone: "",
    type: "",
    budget: "",
    timeline: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {}
    if (!formState.name.trim()) newErrors.name = "Name is required"
    if (!formState.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(formState.email))
      newErrors.email = "Valid email is required"
    if (!formState.type) newErrors.type = "Please select a project type"
    if (!formState.message.trim() || formState.message.trim().length < 20)
      newErrors.message = "Please describe your project (min. 20 characters)"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelect = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    // Simulate async send
    await new Promise((r) => setTimeout(r, 1400))
    setSending(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen pt-[72px]">

      {/* ─── HERO BAR ─────────────────────────────────────────────────────────── */}
      <div className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/30 mb-6">New Commission</div>
            <h1
              className="font-black leading-[0.85] uppercase text-white"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "clamp(56px, 10vw, 140px)",
                letterSpacing: "-0.02em",
              }}
            >
              START A<br />PROJECT.
            </h1>
          </Reveal>
          <Reveal delay={0.15} className="mt-8 max-w-xl">
            <p className="text-white/50 text-lg leading-relaxed">
              We take on a limited number of projects each year. Every collaboration begins with a raw, honest conversation — no pitch decks, no formalities.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ─── CONTEXT STRIP ────────────────────────────────────────────────────── */}
      <div className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x-4 divide-black">
          {[
            { icon: Clock, label: "Response time", val: "48 hours" },
            { icon: MapPin, label: "Offices", val: "Paris · Lyon · Marseille" },
            { icon: Mail, label: "General enquiries", val: "contact@brutco-architecture.com" },
            { icon: Phone, label: "Phone (Paris)", val: "+33 1 42 78 91 00" },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="py-6 px-6 first:pl-0 last:pr-0">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Icon className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
              </div>
              <div className="font-bold text-sm text-black">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MAIN GRID ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* ─── FORM ─────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <Reveal className="mb-10">
            <h2
              className="font-black text-3xl md:text-4xl uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              PROJECT BRIEF
            </h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Fill in as much detail as you can. The more context you give us, the better our initial response will be.
            </p>
          </Reveal>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-4 border-black p-12 text-center"
              >
                <div className="w-16 h-16 border-4 border-black mx-auto mb-6 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="font-black text-3xl"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    ✓
                  </motion.div>
                </div>
                <h3
                  className="font-black text-3xl uppercase mb-4"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Merci
                </h3>
                <p className="text-gray-500 leading-relaxed max-w-md mx-auto mb-8">
                  Merci, nous vous répondrons sous 24h.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormState({ name: "", org: "", email: "", phone: "", type: "", budget: "", timeline: "", message: "" })
                  }}
                  className="border-4 border-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-black hover:text-white transition-colors cursor-pointer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Submit another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 1 }}
              >
                {/* Name + Org */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                      Your Name <span className="text-gray-300">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="VIKTOR BRUNEL"
                      className={`w-full border-4 px-5 py-4 font-bold uppercase tracking-wide text-sm focus:outline-none placeholder:text-gray-200 transition-colors ${
                        errors.name ? "border-red-500" : "border-black focus:border-black"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs font-bold uppercase mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                      Organisation
                    </label>
                    <input
                      type="text"
                      name="org"
                      value={formState.org}
                      onChange={handleChange}
                      placeholder="COMPANY / INSTITUTION"
                      className="w-full border-4 border-black px-5 py-4 font-bold uppercase tracking-wide text-sm focus:outline-none placeholder:text-gray-200 focus:border-black transition-colors"
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                      Email Address <span className="text-gray-300">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="YOUR@EMAIL.COM"
                      className={`w-full border-4 px-5 py-4 font-bold uppercase tracking-wide text-sm focus:outline-none placeholder:text-gray-200 transition-colors ${
                        errors.email ? "border-red-500" : "border-black"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs font-bold uppercase mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="+33 1 XX XX XX XX"
                      className="w-full border-4 border-black px-5 py-4 font-bold uppercase tracking-wide text-sm focus:outline-none placeholder:text-gray-200"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3">
                    Project Type <span className="text-gray-300">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {projectTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleSelect("type", type)}
                        className={`border-4 px-3 py-2 text-xs font-bold uppercase tracking-wide text-left transition-colors cursor-pointer ${
                          formState.type === type
                            ? "bg-black text-white border-black"
                            : "border-black bg-white hover:bg-gray-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.type && (
                    <p className="text-red-500 text-xs font-bold uppercase mt-2">{errors.type}</p>
                  )}
                </div>

                {/* Budget + Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3">Budget Range</label>
                    <div className="space-y-2">
                      {budgetRanges.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleSelect("budget", b)}
                          className={`w-full border-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-left flex items-center gap-3 transition-colors cursor-pointer ${
                            formState.budget === b
                              ? "bg-black text-white border-black"
                              : "border-black hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 border-2 shrink-0 ${
                              formState.budget === b
                                ? "bg-white border-white"
                                : "border-black"
                            }`}
                          />
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3">Timeline</label>
                    <div className="space-y-2">
                      {timelines.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleSelect("timeline", t)}
                          className={`w-full border-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-left flex items-center gap-3 transition-colors cursor-pointer ${
                            formState.timeline === t
                              ? "bg-black text-white border-black"
                              : "border-black hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 border-2 shrink-0 ${
                              formState.timeline === t
                                ? "bg-white border-white"
                                : "border-black"
                            }`}
                          />
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                    Describe Your Project <span className="text-gray-300">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="TELL US WHAT YOU WANT TO BUILD. WHERE, WHY, AND AT WHAT SCALE."
                    className={`w-full border-4 px-5 py-4 font-bold uppercase tracking-wide text-sm focus:outline-none placeholder:text-gray-200 resize-none transition-colors ${
                      errors.message ? "border-red-500" : "border-black"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs font-bold uppercase mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-black text-white font-black uppercase tracking-widest text-sm py-5 hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.05rem" }}
                >
                  {sending ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      SENDING...
                    </>
                  ) : (
                    <>
                      SEND PROJECT BRIEF <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest text-center">
                  We do not share your details with third parties. Response within 48 hours.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-8">

          {/* Office Selector */}
          <Reveal from="right">
            <h3
              className="font-black text-2xl uppercase mb-6"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              OUR OFFICES
            </h3>
            <div className="flex gap-2 mb-6">
              {offices.map((o, i) => (
                <button
                  key={o.city}
                  onClick={() => setActiveOffice(i)}
                  className={`px-4 py-2 border-4 font-black text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                    activeOffice === i
                      ? "bg-black text-white border-black"
                      : "border-black hover:bg-gray-100"
                  }`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {o.city}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeOffice}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="border-4 border-black overflow-hidden"
              >
                {/* Office image */}
                <div className="aspect-[16/9] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={offices[activeOffice].img}
                    alt={offices[activeOffice].city}
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-4 left-4">
                    <div
                      className="font-black text-white text-2xl uppercase"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {offices[activeOffice].city}
                    </div>
                    <div className="text-white/60 text-xs font-bold uppercase tracking-widest">
                      {offices[activeOffice].label}
                    </div>
                  </div>
                </div>

                {/* Office details */}
                <div className="p-6 space-y-4 bg-white">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                    <span className="text-sm font-semibold">{offices[activeOffice].address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 shrink-0 text-gray-400" />
                    <a href={`tel:${offices[activeOffice].phone}`} className="text-sm font-semibold hover:underline">
                      {offices[activeOffice].phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 shrink-0 text-gray-400" />
                    <a href={`mailto:${offices[activeOffice].email}`} className="text-sm font-semibold hover:underline break-all">
                      {offices[activeOffice].email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-black/10">
                    <Clock className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      {offices[activeOffice].hours}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>

          {/* What happens next */}
          <Reveal from="right" delay={0.1}>
            <div className="border-4 border-black bg-black text-white p-8">
              <h3
                className="font-black text-xl uppercase mb-6"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                WHAT HAPPENS NEXT?
              </h3>
              <div className="space-y-5">
                {[
                  { n: "01", t: "We read your brief", d: "Viktor or Anaïs personally reviews every submission within 48 hours." },
                  { n: "02", t: "Qualify the fit", d: "We assess scope, site conditions, and material ambition. Not all briefs are right for us — and we'll tell you why." },
                  { n: "03", t: "First call", d: "A 30-minute call with a founding partner. No slides. Just a raw conversation about what you want to build." },
                  { n: "04", t: "Atelier visit", d: "Come see our material testing lab and current scale models. That's when you'll know if this is right." },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4 items-start border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                    <span
                      className="font-black text-2xl text-white/20 leading-none shrink-0"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {item.n}
                    </span>
                    <div>
                      <div className="font-black text-sm uppercase tracking-wide mb-1">{item.t}</div>
                      <p className="text-white/50 text-xs leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Quick links */}
          <Reveal from="right" delay={0.2}>
            <div className="border-4 border-black p-6 space-y-3">
              <h4
                className="font-black text-lg uppercase mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                EXPLORE BEFORE YOU REACH OUT
              </h4>
              {[
                { href: "/templates/impact-28/work", label: "View All Projects", sub: "5 recent monoliths" },
                { href: "/templates/impact-28/services", label: "Our Services & Estimator", sub: "Interactive cost simulator" },
                { href: "/templates/impact-28/studio", label: "Meet the Atelier", sub: "Partners & timeline" },
              ].map(({ href, label, sub }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between py-3 border-b border-black/10 last:border-b-0 group cursor-pointer"
                >
                  <div>
                    <div className="font-black text-sm uppercase tracking-wide group-hover:underline">{label}</div>
                    <div className="text-gray-400 text-xs">{sub}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ─── BOTTOM MANIFESTO ─────────────────────────────────────────────────── */}
      <div className="bg-black text-white py-16 px-6 border-t-4 border-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/30 mb-4">Our commitment</div>
            <p
              className="font-black text-2xl md:text-3xl uppercase leading-[1.1]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              WE DON'T ACCEPT EVERY PROJECT.<br />WE ONLY BUILD WHAT WE BELIEVE IN.
            </p>
          </div>
          <div>
            <p className="text-white/50 leading-relaxed text-lg">
              Every brief we accept is one we would put our name to permanently — because concrete doesn't lie, and neither do we.
              If we don't think the conditions are right for honest architecture, we'll tell you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
