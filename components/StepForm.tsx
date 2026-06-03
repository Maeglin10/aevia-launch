"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Loader2, Check,
  Rocket, Zap, Palette, Building2, Target, Briefcase, ShoppingBag,
  UtensilsCrossed, BedDouble, Stethoscope, Home, Dumbbell, CalendarDays,
  Heart, Star, Gem, Square, Newspaper, Sparkles, Hexagon, Minus,
  type LucideIcon,
} from "lucide-react";

const THEME_ICONS: Record<string, LucideIcon> = {
  landing: Rocket, saas: Zap, agency: Palette, vitrine: Building2,
  consultant: Target, portfolio: Briefcase, ecommerce: ShoppingBag, restaurant: UtensilsCrossed,
  hotel: BedDouble, healthcare: Stethoscope, realestate: Home, fitness: Dumbbell,
  event: CalendarDays, nonprofit: Heart, startup: Star, luxury: Gem,
  brutalist: Square, magazine: Newspaper, aurora: Sparkles, "3d-tech": Hexagon, "minimal-pro": Minus,
};

const THEME_LABELS: Record<string, string> = {
  landing: "Landing Page", saas: "SaaS Product", agency: "Creative Agency",
  vitrine: "Business Vitrine", consultant: "Consultant & Coach", portfolio: "Portfolio",
  ecommerce: "E-commerce Store", restaurant: "Restaurant & Food", hotel: "Hotel & B&B",
  healthcare: "Healthcare & Clinic", realestate: "Real Estate", fitness: "Fitness & Wellness",
  event: "Event & Conference", nonprofit: "Non-profit & NGO", startup: "Startup Launch",
  luxury: "Luxury & Couture", brutalist: "Brutalist Editorial", magazine: "Magazine & Editorial",
  aurora: "Aurora & Wellness", "3d-tech": "3D Tech & Web3", "minimal-pro": "Minimal Pro",
};

const BUSINESS_TYPES = [
  "Restaurant", "Agency", "Coach", "Consultant",
  "E-commerce", "Portfolio", "Artisan", "Healthcare", "Other",
];

const TONES = ["Professional", "Friendly", "Bold", "Luxurious"];

const TEMPLATES: Array<{ id: string; label: string; desc: string; icon: LucideIcon; category: string }> = [
  // Marketing
  { id: "landing", label: "Landing Page", desc: "High-conversion single page", icon: Rocket, category: "Marketing" },
  { id: "saas", label: "SaaS Product", desc: "Software product with features & pricing", icon: Zap, category: "Tech" },
  { id: "agency", label: "Creative Agency", desc: "Bold portfolio-first agency site", icon: Palette, category: "Agency" },
  // Business
  { id: "vitrine", label: "Business Vitrine", desc: "Professional multi-page presence", icon: Building2, category: "Business" },
  { id: "consultant", label: "Consultant / Coach", desc: "Authority-building personal brand", icon: Target, category: "Personal" },
  { id: "portfolio", label: "Portfolio", desc: "Work showcase for creatives & devs", icon: Briefcase, category: "Personal" },
  // Commerce
  { id: "ecommerce", label: "E-commerce Store", desc: "Full online store with cart", icon: ShoppingBag, category: "Commerce" },
  { id: "restaurant", label: "Restaurant / Food", desc: "Menu, reservations, ambiance", icon: UtensilsCrossed, category: "Hospitality" },
  { id: "hotel", label: "Hotel / B&B", desc: "Rooms, gallery, booking CTA", icon: BedDouble, category: "Hospitality" },
  // Services
  { id: "healthcare", label: "Healthcare / Clinic", desc: "Trust-first medical practice site", icon: Stethoscope, category: "Health" },
  { id: "realestate", label: "Real Estate", desc: "Property listings & agent profile", icon: Home, category: "Property" },
  { id: "fitness", label: "Fitness / Wellness", desc: "Classes, trainers, transformation", icon: Dumbbell, category: "Health" },
  // Events & Social
  { id: "event", label: "Event / Conference", desc: "Speakers, schedule, tickets", icon: CalendarDays, category: "Events" },
  { id: "nonprofit", label: "Non-profit / NGO", desc: "Mission-driven, donation-focused", icon: Heart, category: "Social" },
  { id: "startup", label: "Startup Launch", desc: "Pre-launch waitlist & social proof", icon: Star, category: "Tech" },
  // Premium
  { id: "luxury", label: "Luxury / Couture", desc: "Dark marble, gold accents, haute couture", icon: Gem, category: "Premium" },
  { id: "brutalist", label: "Brutalist Editorial", desc: "Bold, raw, massive typography", icon: Square, category: "Premium" },
  { id: "magazine", label: "Magazine / Editorial", desc: "Grid-based journalistic layout", icon: Newspaper, category: "Premium" },
  { id: "aurora", label: "Aurora / Wellness", desc: "Iridescent gradients, soft glow", icon: Sparkles, category: "Premium" },
  { id: "3d-tech", label: "3D Tech / Web3", desc: "Holographic grid, glitch effects", icon: Hexagon, category: "Premium" },
  { id: "minimal-pro", label: "Minimal Pro", desc: "Architecture-grade negative space", icon: Minus, category: "Premium" },
];

// Group templates by category, preserving insertion order
const TEMPLATE_CATEGORIES = TEMPLATES.reduce<{ category: string; templates: typeof TEMPLATES }[]>((acc, t) => {
  const existing = acc.find((g) => g.category === t.category);
  if (existing) {
    existing.templates.push(t);
  } else {
    acc.push({ category: t.category, templates: [t] });
  }
  return acc;
}, []);

const TOTAL_STEPS = 5;

type FormState = {
  businessName: string; businessType: string; tagline: string; city: string;
  mainService: string; benefit1: string; benefit2: string; benefit3: string;
  priceRange: string; targetAudience: string;
  brandColor: string; tone: string; template: string;
  email: string; phone: string; instagram: string; linkedin: string;
};

const initial: FormState = {
  businessName: "", businessType: "", tagline: "", city: "",
  mainService: "", benefit1: "", benefit2: "", benefit3: "",
  priceRange: "", targetAudience: "",
  brandColor: "#7c3aed", tone: "Professional", template: "landing",
  email: "", phone: "", instagram: "", linkedin: "",
};

export function StepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam) {
      setForm(f => ({ ...f, template: templateParam }));
      setSelectedTemplate(templateParam);
    }
  }, [searchParams]);

  // Tracks whether the user attempted to advance a given step, so we only show
  // validation errors after an attempt (not on first render).
  const [attempted, setAttempted] = useState<Record<number, boolean>>({});

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "template") {
      setSelectedTemplate(v);
    }
  };

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Returns the set of invalid required-field keys for a given step.
  // Empty set === step is valid and the user may advance.
  const getStepErrors = (s: number): Partial<Record<keyof FormState, string>> => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (s === 1) {
      if (!form.businessName.trim()) errs.businessName = "Business name is required";
      if (!form.businessType) errs.businessType = "Please pick a business type";
      if (!form.tagline.trim()) errs.tagline = "Tell us what you do";
    } else if (s === 2) {
      if (!form.mainService.trim()) errs.mainService = "Your main service is required";
      if (!form.benefit1.trim()) errs.benefit1 = "At least one benefit is required";
    } else if (s === 5) {
      if (!form.email.trim()) errs.email = "Email address is required";
      else if (!isEmail(form.email)) errs.email = "Enter a valid email address";
    }
    return errs;
  };

  // Only surface errors for a field once the step has been attempted.
  const stepErrors = attempted[step] ? getStepErrors(step) : {};
  const errFor = (k: keyof FormState) => stepErrors[k];

  const canNext = () => Object.keys(getStepErrors(step)).length === 0;

  // Guarded navigation: mark the step attempted; only advance when valid.
  const goNext = () => {
    setAttempted((a) => ({ ...a, [step]: true }));
    if (Object.keys(getStepErrors(step)).length === 0) {
      setStep((s) => s + 1);
    }
  };

  const handleGenerate = async () => {
    // Final-step guard: validate required fields before submitting.
    setAttempted((a) => ({ ...a, [step]: true }));
    if (Object.keys(getStepErrors(step)).length > 0) return;
    setLoading(true);
    setError("");
    try {
      // Create session
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: {
            businessName: form.businessName, businessType: form.businessType,
            tagline: form.tagline, city: form.city,
            mainService: form.mainService,
            benefits: [form.benefit1, form.benefit2, form.benefit3],
            priceRange: form.priceRange, targetAudience: form.targetAudience,
            brandColor: form.brandColor, tone: form.tone, template: form.template,
            email: form.email, phone: form.phone,
            instagram: form.instagram, linkedin: form.linkedin,
          },
        }),
      });
      const { sessionId } = await sessionRes.json();

      // Generate content
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          formData: {
            businessName: form.businessName, businessType: form.businessType,
            tagline: form.tagline, city: form.city,
            mainService: form.mainService,
            benefits: [form.benefit1, form.benefit2, form.benefit3],
            priceRange: form.priceRange, targetAudience: form.targetAudience,
            brandColor: form.brandColor, tone: form.tone, template: form.template,
            email: form.email, phone: form.phone,
            instagram: form.instagram, linkedin: form.linkedin,
          },
        }),
      });

      const { previewUrl } = await genRes.json();

      // Redirect to order confirmation page with summary params.
      // The order page lets the client review pricing before payment.
      // After payment, we surface the previewUrl from the session.
      const orderParams = new URLSearchParams({
        type:  form.template,
        name:  form.businessName,
        theme: form.template,
        // Pass sessionId so checkout can retrieve the generated preview later.
        session: sessionId,
      });
      // Suppress unused-variable warning — previewUrl is stored in the session
      void previewUrl;
      router.push(`/order?${orderParams.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const SelectedTemplateIcon = (selectedTemplate && THEME_ICONS[selectedTemplate]) || Palette;

  const variants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="w-full max-w-xl">
      {/* Template pre-selection banner */}
      {selectedTemplate && THEME_LABELS[selectedTemplate] && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <SelectedTemplateIcon className="w-7 h-7 text-violet-400" />
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold">{THEME_LABELS[selectedTemplate]}</div>
            <div className="text-violet-400 text-xs">Template selected</div>
          </div>
          <a href="/themes" className="text-zinc-400 hover:text-white text-xs transition-colors shrink-0">
            Change →
          </a>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i + 1 < step
                  ? "bg-violet-600 text-white"
                  : i + 1 === step
                  ? "bg-violet-600 text-white ring-4 ring-violet-600/20"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div className={`flex-1 h-0.5 rounded ${i + 1 < step ? "bg-violet-600" : "bg-zinc-800"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 space-y-5"
        >
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-white">Your business</h2>
              <Field label="Business name" required error={errFor("businessName")}>
                <input className={`${input} ${errFor("businessName") ? inputError : ""}`} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Nexxa Studio" />
              </Field>
              <Field label="Type of business" required error={errFor("businessType")}>
                <div className={`flex flex-wrap gap-2 ${errFor("businessType") ? "rounded-xl ring-1 ring-red-500 p-2" : ""}`}>
                  {BUSINESS_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("businessType", t)}
                      className={`px-3 py-1.5 rounded-full text-base transition-all ${
                        form.businessType === t
                          ? "bg-violet-600 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="What you do" required error={errFor("tagline")}>
                <textarea className={`${input} resize-none ${errFor("tagline") ? inputError : ""}`} rows={2} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="We design and build websites for small businesses..." />
              </Field>
              <Field label="City">
                <input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Paris, France" />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-white">Your offer</h2>
              <Field label="Main service / product" required error={errFor("mainService")}>
                <input className={`${input} ${errFor("mainService") ? inputError : ""}`} value={form.mainService} onChange={(e) => set("mainService", e.target.value)} placeholder="Custom website design" />
              </Field>
              <Field label="3 key benefits" required error={errFor("benefit1")}>
                {(["benefit1", "benefit2", "benefit3"] as const).map((k, i) => (
                  <input key={k} className={`${input} mb-2 ${k === "benefit1" && errFor("benefit1") ? inputError : ""}`} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={`Benefit ${i + 1}${i === 0 ? " (required)" : " (optional)"}`} />
                ))}
              </Field>
              <Field label="Price range">
                <input className={input} value={form.priceRange} onChange={(e) => set("priceRange", e.target.value)} placeholder="From €500 / €29 per month" />
              </Field>
              <Field label="Target audience">
                <input className={input} value={form.targetAudience} onChange={(e) => set("targetAudience", e.target.value)} placeholder="Small business owners, freelancers..." />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-white">Style & tone</h2>
              <Field label="Brand colour">
                <div className="flex items-center gap-3">
                  <input type="color" value={form.brandColor} onChange={(e) => set("brandColor", e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                  <span className="text-zinc-400 text-base font-mono">{form.brandColor}</span>
                </div>
              </Field>
              <Field label="Tone of voice">
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button key={t} type="button" onClick={() => set("tone", t)}
                      className={`px-4 py-2 rounded-full text-base transition-all ${form.tone === t ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Template">
                <div className="space-y-6">
                  {TEMPLATE_CATEGORIES.map((group) => (
                    <div key={group.category}>
                      <div className="text-base font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                        {group.category}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {group.templates.map((t) => {
                          const TIcon = t.icon;
                          return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => set("template", t.id)}
                            className={`flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all ${
                              form.template === t.id
                                ? "border-violet-600 bg-violet-600/10"
                                : "border-zinc-700 hover:border-zinc-500"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <TIcon className="w-5 h-5 text-zinc-300" />
                              {form.template === t.id && <Check className="w-4 h-4 text-violet-400" />}
                            </div>
                            <div>
                              <div className="text-white font-medium text-base leading-tight">{t.label}</div>
                              <div className="text-zinc-500 text-base mt-0.5 leading-snug">{t.desc}</div>
                            </div>
                          </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-xl font-bold text-white">Photos & media</h2>
              <p className="text-zinc-400 text-base">Optional — you can add these later.</p>
              <Field label="Logo (PNG or SVG)">
                <input type="file" accept="image/*" className={input} onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => setForm((s) => ({ ...s, logoBase64: reader.result as string }));
                  reader.readAsDataURL(f);
                }} />
              </Field>
              <Field label="Hero image">
                <input type="file" accept="image/*" className={input} onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => setForm((s) => ({ ...s, heroImageBase64: reader.result as string }));
                  reader.readAsDataURL(f);
                }} />
                <p className="text-zinc-500 text-base mt-1">Or we'll use a professional stock image matching your business.</p>
              </Field>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-xl font-bold text-white">Almost there!</h2>
              <Field label="Email address" required error={errFor("email")}>
                <input type="email" className={`${input} ${errFor("email") ? inputError : ""}`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
              </Field>
              <Field label="Phone">
                <input type="tel" className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+33 6 00 00 00 00" />
              </Field>
              <Field label="Instagram">
                <input className={input} value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@yourbrand" />
              </Field>
              <Field label="LinkedIn">
                <input className={input} value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" />
              </Field>
              {error && <p className="text-red-400 text-base bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-6">
        {step > 1 ? (
          <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-zinc-400 text-base hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : <div />}

        {step < TOTAL_STEPS ? (
          <button
            onClick={goNext}
            aria-disabled={!canNext()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-base font-semibold transition-all ${
              canNext() ? "" : "opacity-50"
            }`}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            aria-disabled={!canNext()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-base font-semibold transition-all ${
              canNext() || loading ? "" : "opacity-50"
            }`}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <>Generate my site <ArrowRight className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-lg font-medium text-zinc-300">
        {label}
        {required && <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-base" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Base input style: text-base === 16px to avoid iOS Safari focus auto-zoom and
// meet the accessibility font-size floor on all form fields.
const input = "w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-base focus:outline-none focus:border-violet-500 transition-colors";
// Applied additionally when a required field is invalid after a submit attempt.
const inputError = "border-red-500 focus:border-red-500";
