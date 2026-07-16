"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, ChevronDown, Upload, X, Check, Loader2, Globe, Phone, Mail, MapPin, Plus, Link } from "lucide-react";
import Image from "next/image";
import {
  SITE_PRICES, ADDONS, DEFAULT_CURRENCY,
  priceIn, formatPrice, isCurrency, type Currency,
} from "@/lib/pricing";
import { useLang, LOCALE_META, type Locale } from "@/lib/LangContext";

function OnboardingLangSwitcher() {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const current = LOCALE_META.find((l) => l.code === locale) ?? LOCALE_META[0];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Changer de langue"
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{current.flag} {current.code.toUpperCase()}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
          {LOCALE_META.map((l) => (
            <button key={l.code} onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-zinc-800 ${l.code === locale ? "text-white font-semibold" : "text-zinc-400"}`}
            >
              <span>{l.flag}</span><span>{l.label}</span>
              {l.code === locale && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  name: string;
  description: string;
}

interface BriefData {
  // Step 1 — Identité
  company: string;
  industry: string;
  tagline: string;
  colorPrimary: string;
  colorSecondary: string;
  description: string;
  // Step 2 — Visuels
  logoUrl: string;
  photoUrls: string[];
  inspirations: string;
  // Step 3 — Contenu
  services: Service[];
  about: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  linkedin: string;
  website: string;
  notes: string;
}

const INITIAL: BriefData = {
  company: "", industry: "", tagline: "", colorPrimary: "#6d28d9",
  colorSecondary: "#0f172a", description: "",
  logoUrl: "", photoUrls: [], inspirations: "",
  services: [{ name: "", description: "" }, { name: "", description: "" }, { name: "", description: "" }],
  about: "", phone: "", email: "", address: "",
  instagram: "", linkedin: "", website: "", notes: "",
};

const STEPS = ["Votre entreprise", "Vos visuels", "Votre contenu"];

const INDUSTRIES = [
  "Restaurant / Food", "Hôtel / Tourisme", "Mode / Beauté", "Santé / Bien-être",
  "Immobilier", "Construction / BTP", "Tech / SaaS", "Conseil / Coaching",
  "E-commerce", "Art / Design", "Événementiel", "ONG / Association", "Autre",
];

// ─── Upload helper ─────────────────────────────────────────────────────────────

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload échoué");
  const data = await res.json() as { url: string };
  return data.url;
}

// ─── Field components ─────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-widest text-white/40 uppercase">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-red-500 transition-colors text-sm"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-red-500 transition-colors text-sm resize-none"
    />
  );
}

// ─── Image uploader ────────────────────────────────────────────────────────────

function ImageUploader({ url, onUpload, label, className = "" }: {
  url: string; onUpload: (url: string) => void; label: string; className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLoading(true);
    try {
      const uploaded = await uploadFile(file);
      onUpload(uploaded);
    } finally {
      setLoading(false);
    }
  }, [onUpload]);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${url ? "border-red-500" : "border-white/10 hover:border-white/30"} ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); }}
      />
      {url ? (
        <Image src={url} alt={label} fill className="object-cover" />
      ) : loading ? (
        <Loader2 size={20} className="text-red-400 animate-spin" />
      ) : (
        <>
          <Upload size={18} className="text-white/30" />
          <span className="text-[11px] text-white/30 text-center px-2">{label}</span>
        </>
      )}
    </button>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ data, onChange }: { data: BriefData; onChange: (d: Partial<BriefData>) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Nom de l'entreprise">
        <Input value={data.company} onChange={(v) => onChange({ company: v })} placeholder="ex : Maison Dupont" />
      </Field>
      <Field label="Secteur d'activité">
        <select
          value={data.industry}
          onChange={(e) => onChange({ industry: e.target.value })}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors text-sm appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-900">Choisir un secteur...</option>
          {INDUSTRIES.map((i) => <option key={i} value={i} className="bg-gray-900">{i}</option>)}
        </select>
      </Field>
      <Field label="Tagline / Accroche">
        <Input value={data.tagline} onChange={(v) => onChange({ tagline: v })} placeholder="ex : L'excellence artisanale depuis 1985" />
      </Field>
      <Field label="Description courte (2-3 phrases)">
        <Textarea value={data.description} onChange={(v) => onChange({ description: v })} placeholder="Décrivez votre activité, vos clients, ce qui vous rend unique..." rows={3} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Couleur principale">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <input
              type="color"
              value={data.colorPrimary}
              onChange={(e) => onChange({ colorPrimary: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <span className="text-sm text-white/60 font-mono">{data.colorPrimary}</span>
          </div>
        </Field>
        <Field label="Couleur secondaire">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <input
              type="color"
              value={data.colorSecondary}
              onChange={(e) => onChange({ colorSecondary: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <span className="text-sm text-white/60 font-mono">{data.colorSecondary}</span>
          </div>
        </Field>
      </div>
    </div>
  );
}

function Step2({ data, onChange }: { data: BriefData; onChange: (d: Partial<BriefData>) => void }) {
  const [uploading, setUploading] = useState(false);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const handlePhotos = useCallback(async (files: FileList) => {
    setUploading(true);
    try {
      const uploads = await Promise.all(Array.from(files).slice(0, 6 - data.photoUrls.length).map(uploadFile));
      onChange({ photoUrls: [...data.photoUrls, ...uploads] });
    } finally {
      setUploading(false);
    }
  }, [data.photoUrls, onChange]);

  const removePhoto = (idx: number) => {
    onChange({ photoUrls: data.photoUrls.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col gap-6">
      <Field label="Logo de l'entreprise">
        <ImageUploader
          url={data.logoUrl}
          onUpload={(url) => onChange({ logoUrl: url })}
          label="Cliquer pour uploader votre logo (PNG / SVG recommandé)"
          className="h-36"
        />
      </Field>

      <Field label={`Photos d'ambiance (${data.photoUrls.length}/6)`}>
        <div className="grid grid-cols-3 gap-3">
          {data.photoUrls.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden group">
              <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
          {data.photoUrls.length < 6 && (
            <button
              type="button"
              onClick={() => photosInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <input
                ref={photosInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => { if (e.target.files) void handlePhotos(e.target.files); }}
              />
              {uploading ? <Loader2 size={16} className="text-red-400 animate-spin" /> : <Plus size={16} className="text-white/30" />}
              <span className="text-[10px] text-white/30">Ajouter</span>
            </button>
          )}
        </div>
        <p className="text-xs text-white/30 mt-1">Extérieur, intérieur, produits, équipe... Photos que vous possédez. Minimum 3 recommandées.</p>
      </Field>

      <Field label="Sites / marques inspirants (optionnel)">
        <Textarea
          value={data.inspirations}
          onChange={(v) => onChange({ inspirations: v })}
          placeholder="Collez des URLs de sites que vous aimez, ou décrivez l'ambiance voulue..."
          rows={3}
        />
      </Field>
    </div>
  );
}

function Step3({ data, onChange }: { data: BriefData; onChange: (d: Partial<BriefData>) => void }) {
  const updateService = (idx: number, field: keyof Service, value: string) => {
    const services = data.services.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    onChange({ services });
  };

  const addService = () => {
    if (data.services.length < 6) onChange({ services: [...data.services, { name: "", description: "" }] });
  };

  const removeService = (idx: number) => {
    if (data.services.length > 1) onChange({ services: data.services.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col gap-6">
      <Field label="Vos services / produits">
        <div className="flex flex-col gap-3">
          {data.services.map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30 w-4">{i + 1}.</span>
                <input
                  value={s.name}
                  onChange={(e) => updateService(i, "name", e.target.value)}
                  placeholder="Nom du service..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
                />
                {data.services.length > 1 && (
                  <button type="button" onClick={() => removeService(i)}>
                    <X size={14} className="text-white/20 hover:text-white/50 transition-colors" />
                  </button>
                )}
              </div>
              <input
                value={s.description}
                onChange={(e) => updateService(i, "description", e.target.value)}
                placeholder="Description courte..."
                className="bg-transparent text-xs text-white/60 placeholder:text-white/20 focus:outline-none w-full pl-6"
              />
            </div>
          ))}
          {data.services.length < 6 && (
            <button type="button" onClick={addService} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors mt-1">
              <Plus size={14} /> Ajouter un service
            </button>
          )}
        </div>
      </Field>

      <Field label="À propos">
        <Textarea value={data.about} onChange={(v) => onChange({ about: v })} placeholder="Histoire de l'entreprise, valeurs, équipe, expertise..." rows={3} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Téléphone">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <Phone size={14} className="text-white/30 shrink-0" />
            <input value={data.phone} onChange={(e) => onChange({ phone: e.target.value })} placeholder="+33 6 00 00 00 00" className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none flex-1" />
          </div>
        </Field>
        <Field label="Email">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <Mail size={14} className="text-white/30 shrink-0" />
            <input value={data.email} onChange={(e) => onChange({ email: e.target.value })} placeholder="contact@..." className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none flex-1" />
          </div>
        </Field>
      </div>

      <Field label="Adresse (optionnel)">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <MapPin size={14} className="text-white/30 shrink-0" />
          <input value={data.address} onChange={(e) => onChange({ address: e.target.value })} placeholder="12 rue des Arts, 75001 Paris" className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none flex-1" />
        </div>
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Instagram">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
            <Link size={14} className="text-white/30 shrink-0" />
            <input value={data.instagram} onChange={(e) => onChange({ instagram: e.target.value })} placeholder="@handle" className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none flex-1 min-w-0" />
          </div>
        </Field>
        <Field label="LinkedIn">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
            <Link size={14} className="text-white/30 shrink-0" />
            <input value={data.linkedin} onChange={(e) => onChange({ linkedin: e.target.value })} placeholder="URL ou handle" className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none flex-1 min-w-0" />
          </div>
        </Field>
        <Field label="Site actuel">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
            <Globe size={14} className="text-white/30 shrink-0" />
            <input value={data.website} onChange={(e) => onChange({ website: e.target.value })} placeholder="https://..." className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none flex-1 min-w-0" />
          </div>
        </Field>
      </div>

      <Field label="Demandes spéciales / informations complémentaires">
        <Textarea value={data.notes} onChange={(v) => onChange({ notes: v })} placeholder="Tout ce qui pourrait nous aider à créer le site parfait pour vous..." rows={3} />
      </Field>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type  = searchParams.get("type")  ?? "vitrine";
  const theme = searchParams.get("theme") ?? "";
  const maint = searchParams.get("maintenance") ?? "0";
  const brand = searchParams.get("branding") ?? "0";
  const currencyParam = searchParams.get("currency");
  const currency: Currency = isCurrency(currencyParam) ? currencyParam : DEFAULT_CURRENCY;
  const sessionId = searchParams.get("session");

  const [step, setStep] = useState(0);
  const [data, setData] = useState<BriefData>({
    ...INITIAL,
    company: searchParams.get("name") ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [acceptedCgv, setAcceptedCgv] = useState(false);

  const update = useCallback((patch: Partial<BriefData>) => {
    setData((d) => ({ ...d, ...patch }));
  }, []);

  // If a session ID was passed (from /configure), pre-fill the brief with
  // what we already collected during the IA preview step.
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/sessions?id=${encodeURIComponent(sessionId)}`);
        if (!res.ok) return;
        const json = await res.json() as { formData?: Record<string, unknown> };
        if (cancelled || !json.formData) return;
        const f = json.formData;
        update({
          company: typeof f.businessName === "string" ? f.businessName : "",
          industry: typeof f.businessType === "string" ? f.businessType : "",
          tagline: typeof f.tagline === "string" ? f.tagline : "",
          description: typeof f.mainService === "string" ? f.mainService : "",
          colorPrimary: typeof f.brandColor === "string" ? f.brandColor : "#6d28d9",
          email: typeof f.email === "string" ? f.email : "",
          phone: typeof f.phone === "string" ? f.phone : "",
          instagram: typeof f.instagram === "string" ? f.instagram : "",
          linkedin: typeof f.linkedin === "string" ? f.linkedin : "",
          logoUrl: typeof f.logoUrl === "string" ? f.logoUrl : "",
          photoUrls: Array.isArray(f.photoUrls) ? f.photoUrls.filter((u): u is string => typeof u === "string") : [],
        });
      } catch {
        // Fail silent — user can fill the form manually
      }
    })();
    return () => { cancelled = true; };
  }, [sessionId, update]);

  const canNext = () => {
    if (step === 0) return data.company.trim().length > 0 && data.industry.length > 0;
    if (step === 1) return true; // visuals are optional
    if (step === 2) return data.services.some(s => s.name.trim().length > 0) && acceptedCgv;
    return false;
  };

  // Price recap shown before payment (canonical EUR amounts resolved to the
  // chosen currency via the shared pricing table).
  const basePriceEur = (SITE_PRICES[type] ?? SITE_PRICES["landing"]).price;
  const withBranding = brand === "1";
  const withMaintenance = maint === "1";
  const oneTimeEur = basePriceEur + (withBranding ? ADDONS.branding.price : 0);

  const handleSubmit = async () => {
    setError("");

    // ── Pre-submit validation ───────────────────────────────────────────────
    // We can't recover from a half-formed brief once the customer is on Stripe,
    // so block the submit here with a clear message rather than letting Stripe
    // checkout open against an empty payload.
    if (!data.company.trim()) {
      setError("Le nom de l'entreprise est requis.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      setError("Email invalide. Vérifiez l'adresse de contact.");
      return;
    }
    const hasValidService = data.services.some(
      s => s.name.trim().length > 0 && s.description.trim().length > 0,
    );
    if (!hasValidService) {
      setError("Renseignez au moins un service avec un nom ET une description.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: data.company,
          theme,
          maintenance: withMaintenance,
          branding: withBranding,
          currency,
          brief: data,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la création du paiement");
      const { url } = await res.json() as { url: string };
      router.push(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue");
      setSubmitting(false);
    }
  };

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  const [dir, setDir] = useState(1);

  const goNext = () => { setDir(1); setStep(s => s + 1); };
  const goPrev = () => { setDir(-1); setStep(s => s - 1); };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <span className="font-black text-lg tracking-tight">skylaunch</span>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                i < step ? "bg-red-500 text-white" :
                i === step ? "bg-red-500/20 border border-red-500 text-red-400" :
                "bg-white/5 text-white/20"
              }`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs hidden md:block transition-colors ${i === step ? "text-white/60" : "text-white/20"}`}>{label}</span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
          </div>
          <OnboardingLangSwitcher />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="mb-8">
                <p className="text-xs text-red-400 font-semibold tracking-widest uppercase mb-2">Étape {step + 1} / {STEPS.length}</p>
                <h1 className="text-3xl font-black">{STEPS[step]}</h1>
              </div>

              {step === 0 && <Step1 data={data} onChange={update} />}
              {step === 1 && <Step2 data={data} onChange={update} />}
              {step === 2 && <Step3 data={data} onChange={update} />}
            </motion.div>
          </AnimatePresence>

          {/* Price recap + CGV — only on last step */}
          {step === STEPS.length - 1 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-red-400 uppercase mb-3">Récapitulatif</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">{(SITE_PRICES[type] ?? SITE_PRICES["landing"]).label}</span>
                    <span className="text-white font-medium">{formatPrice(basePriceEur, currency)}</span>
                  </div>
                  {withBranding && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">{ADDONS.branding.label}</span>
                      <span className="text-white font-medium">{formatPrice(ADDONS.branding.price, currency)}</span>
                    </div>
                  )}
                  {withMaintenance && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Maintenance (premier mois)</span>
                      <span className="text-white font-medium">{formatPrice(ADDONS.maintenance.price, currency)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-white font-semibold">Total TTC</span>
                    <span className="text-white font-bold text-lg">{formatPrice(oneTimeEur, currency)}</span>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedCgv}
                  onChange={(e) => setAcceptedCgv(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-red-500 focus:ring-red-500 cursor-pointer accent-red-500"
                />
                <span className="text-xs text-white/60 leading-relaxed">
                  J&apos;accepte les{" "}
                  <a href="/legal/cgu" target="_blank" rel="noopener noreferrer" className="text-red-400 underline hover:text-red-300">
                    Conditions générales de vente
                  </a>{" "}
                  et la{" "}
                  <a href="/legal/confidentialite" target="_blank" rel="noopener noreferrer" className="text-red-400 underline hover:text-red-300">
                    politique de confidentialité
                  </a>
                  . Je confirme que le paiement est définitif après livraison de l&apos;aperçu.
                </span>
              </label>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
            {step > 0 ? (
              <button onClick={goPrev} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                <ChevronLeft size={16} /> Retour
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button
                onClick={goNext}
                disabled={!canNext()}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-white/5 disabled:text-white/20 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Continuer <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => void handleSubmit()}
                disabled={submitting || !canNext()}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-white/5 disabled:text-white/20 text-white text-sm font-semibold px-8 py-3 rounded-full transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {submitting ? "Redirection..." : "Procéder au paiement →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
