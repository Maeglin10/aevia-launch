"use client";

import { useState, useRef } from "react";
import { X, Plus, Trash2, Save, Loader2, Check, Image, Palette, Tag, Briefcase, Star, Share2, ChevronDown, ChevronRight } from "lucide-react";
import type { SessionData, GeneratedContent, FormData } from "@/lib/sessions";

type EditableData = {
  generatedContent: Partial<GeneratedContent>;
  formData: Partial<FormData>;
};

interface EditPanelProps {
  session: SessionData;
  onClose: () => void;
  onChange: (data: EditableData) => void;
  onSave: (data: EditableData) => Promise<void>;
}

const SECTIONS = ["hero", "about", "services", "contact", "brand"] as const;
type Section = typeof SECTIONS[number];

const SECTION_LABELS: Record<Section, string> = {
  hero: "Section principale",
  about: "À propos",
  services: "Services",
  contact: "Coordonnées & Réseaux",
  brand: "Identité de marque",
};

const SECTION_ICONS: Record<Section, typeof Image> = {
  hero: Image,
  about: Tag,
  services: Briefcase,
  contact: Share2,
  brand: Palette,
};

const PRESET_COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#dc2626", "#d97706",
  "#db2777", "#0891b2", "#7c2d12", "#1e3a5f", "#14532d",
];

function SectionHeader({
  id,
  openSection,
  setOpenSection,
}: {
  id: Section;
  openSection: Section;
  setOpenSection: (s: Section) => void;
}) {
  const Icon = SECTION_ICONS[id];
  const isOpen = openSection === id;
  return (
    <button
      type="button"
      onClick={() => setOpenSection(isOpen ? id : id)}
      className="w-full flex items-center justify-between py-2.5 text-left group"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-2">
        <Icon size={13} className={isOpen ? "text-violet-400" : "text-zinc-500"} />
        <span className={`text-xs font-bold uppercase tracking-widest ${isOpen ? "text-violet-400" : "text-zinc-400"}`}>
          {SECTION_LABELS[id]}
        </span>
      </div>
      {isOpen
        ? <ChevronDown size={13} className="text-zinc-500" />
        : <ChevronRight size={13} className="text-zinc-600" />}
    </button>
  );
}

export function EditPanel({ session, onClose, onChange, onSave }: EditPanelProps) {
  const gc = session.generatedContent;
  const fd = session.formData;

  // Hero
  const [heroHeadline, setHeroHeadline] = useState(gc?.heroHeadline ?? "");
  const [heroSubline, setHeroSubline] = useState(gc?.heroSubline ?? "");
  const [ctaText, setCtaText] = useState(gc?.ctaText ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(fd.heroImageUrl ?? "");
  const [tagline, setTagline] = useState(fd.tagline ?? "");
  // About
  const [aboutTitle, setAboutTitle] = useState(gc?.aboutTitle ?? "");
  const [aboutText, setAboutText] = useState(gc?.aboutText ?? "");
  // Services
  const [services, setServices] = useState(gc?.services ?? []);
  const [mainService, setMainService] = useState(fd.mainService ?? "");
  const [benefits, setBenefits] = useState<[string, string, string]>(
    fd.benefits ?? ["", "", ""]
  );
  // Contact & social
  const [phone, setPhone] = useState(fd.phone ?? "");
  const [email, setEmail] = useState(fd.email ?? "");
  const [city, setCity] = useState(fd.city ?? "");
  const [instagram, setInstagram] = useState(fd.instagram ?? "");
  const [linkedin, setLinkedin] = useState(fd.linkedin ?? "");
  // Brand
  const [brandColor, setBrandColor] = useState(fd.brandColor ?? "#7c3aed");

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [openSection, setOpenSection] = useState<Section>("hero");
  const [imgError, setImgError] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  function buildPayload(): EditableData {
    return {
      generatedContent: { heroHeadline, heroSubline, ctaText, aboutTitle, aboutText, services },
      formData: {
        heroImageUrl, tagline, mainService, benefits,
        phone, email, city, instagram, linkedin, brandColor,
      },
    };
  }

  function notify() {
    onChange(buildPayload());
  }

  function notifyWith(patch: Partial<EditableData>) {
    const base = buildPayload();
    onChange({
      generatedContent: { ...base.generatedContent, ...patch.generatedContent },
      formData: { ...base.formData, ...patch.formData },
    });
  }

  function field(
    label: string,
    value: string,
    setter: (v: string) => void,
    multiline = false,
    hint?: string,
    placeholder?: string,
  ) {
    return (
      <div className="mb-3">
        <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
          {label}
        </label>
        {hint && <p className="text-[11px] text-zinc-500 mb-1">{hint}</p>}
        {multiline ? (
          <textarea
            value={value}
            rows={3}
            placeholder={placeholder}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none transition-colors"
            onChange={(e) => { setter(e.target.value); notify(); }}
          />
        ) : (
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
            onChange={(e) => { setter(e.target.value); notify(); }}
          />
        )}
      </div>
    );
  }

  function updateBenefit(i: 0 | 1 | 2, val: string) {
    const next: [string, string, string] = [...benefits] as [string, string, string];
    next[i] = val;
    setBenefits(next);
    notifyWith({ formData: { benefits: next } });
  }

  function updateService(i: number, key: "title" | "description", val: string) {
    const next = services.map((s, idx) => idx === i ? { ...s, [key]: val } : s);
    setServices(next);
    notifyWith({ generatedContent: { services: next } });
  }

  function addService() {
    const next = [...services, { title: "Nouveau service", description: "Description du service" }];
    setServices(next);
    notifyWith({ generatedContent: { services: next } });
  }

  function removeService(i: number) {
    const next = services.filter((_, idx) => idx !== i);
    setServices(next);
    notifyWith({ generatedContent: { services: next } });
  }

  async function handleSave() {
    setSaveState("saving");
    await onSave(buildPayload());
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2500);
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-zinc-950 border-l border-zinc-800 z-[60] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
        <h2 className="text-sm font-bold text-white">Personnaliser</h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-3">

        {/* ── HERO ── */}
        <div className="border-b border-zinc-800 pb-1 mb-1">
          <SectionHeader id="hero" openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === "hero" && (
            <div className="pb-4">
              {field("Titre principal", heroHeadline, setHeroHeadline, false, undefined, "Ex: Votre expert comptable à Paris")}
              {field("Sous-titre", heroSubline, setHeroSubline, true, undefined, "Décrivez votre valeur en 1-2 phrases")}
              {field("Texte du bouton CTA", ctaText, setCtaText, false, undefined, "Ex: Demander un devis")}
              {field("Accroche courte", tagline, setTagline, false, undefined, "Ex: 10 ans d'expertise")}

              {/* Hero image */}
              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Image principale
                </label>
                {/* Only preview http(s) URLs — the field is free text, and a
                    javascript:/data: URL must never reach an active sink. */}
                {heroImageUrl && /^https?:\/\//i.test(heroImageUrl) && !imgError && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-zinc-700 aspect-video bg-zinc-800">
                    <img
                      src={heroImageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                      onLoad={() => setImgError(false)}
                    />
                  </div>
                )}
                <input
                  type="url"
                  value={heroImageUrl}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                  onChange={(e) => { setHeroImageUrl(e.target.value); setImgError(false); notify(); }}
                />
                <p className="text-[11px] text-zinc-600 mt-1">URL directe d'une image (Unsplash, etc.)</p>
              </div>
            </div>
          )}
        </div>

        {/* ── ABOUT ── */}
        <div className="border-b border-zinc-800 pb-1 mb-1">
          <SectionHeader id="about" openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === "about" && (
            <div className="pb-4">
              {field("Titre À propos", aboutTitle, setAboutTitle, false, undefined, "Ex: Pourquoi nous choisir ?")}
              {field("Texte À propos", aboutText, setAboutText, true, undefined, "Présentez votre activité...")}
            </div>
          )}
        </div>

        {/* ── SERVICES ── */}
        <div className="border-b border-zinc-800 pb-1 mb-1">
          <SectionHeader id="services" openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === "services" && (
            <div className="pb-4">
              {field("Service principal", mainService, setMainService, false, undefined, "Ex: Expertise comptable")}

              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Points forts (3 USP)
                </label>
                {([0, 1, 2] as const).map((i) => (
                  <input
                    key={i}
                    type="text"
                    value={benefits[i]}
                    placeholder={["Qualité", "Rapidité", "Fiabilité"][i]}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors mb-2"
                    onChange={(e) => updateBenefit(i, e.target.value)}
                  />
                ))}
              </div>

              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Services détaillés
              </label>
              {services.map((s, i) => (
                <div key={i} className="bg-zinc-900 rounded-xl p-3 mb-2 border border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-zinc-500 font-medium">Service {i + 1}</span>
                    <button onClick={() => removeService(i)} className="text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={s.title}
                    placeholder="Titre du service"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white mb-2 focus:outline-none focus:border-violet-500 transition-colors"
                    onChange={(e) => updateService(i, "title", e.target.value)}
                  />
                  <textarea
                    value={s.description}
                    placeholder="Description"
                    rows={2}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white resize-none focus:outline-none focus:border-violet-500 transition-colors"
                    onChange={(e) => updateService(i, "description", e.target.value)}
                  />
                </div>
              ))}
              {services.length < 8 && (
                <button
                  onClick={addService}
                  className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Plus size={13} /> Ajouter un service
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── CONTACT & SOCIAL ── */}
        <div className="border-b border-zinc-800 pb-1 mb-1">
          <SectionHeader id="contact" openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === "contact" && (
            <div className="pb-4">
              {field("Téléphone", phone, setPhone, false, undefined, "+33 6 00 00 00 00")}
              {field("Email", email, setEmail, false, undefined, "contact@votresite.fr")}
              {field("Ville", city, setCity, false, undefined, "Paris")}
              {field("Instagram", instagram, setInstagram, false, undefined, "@votrecompte")}
              {field("LinkedIn", linkedin, setLinkedin, false, undefined, "linkedin.com/in/votre-profil")}
            </div>
          )}
        </div>

        {/* ── BRAND ── */}
        <div className="pb-1 mb-1">
          <SectionHeader id="brand" openSection={openSection} setOpenSection={setOpenSection} />
          {openSection === "brand" && (
            <div className="pb-4">
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Couleur principale
              </label>
              {/* Color preview + native picker */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => colorInputRef.current?.click()}
                  className="w-10 h-10 rounded-xl border-2 border-zinc-600 shadow-lg flex-shrink-0 transition-transform hover:scale-105"
                  style={{ backgroundColor: brandColor }}
                  aria-label="Choisir une couleur"
                />
                <input
                  type="text"
                  value={brandColor}
                  maxLength={7}
                  placeholder="#7c3aed"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                  onChange={(e) => {
                    const v = e.target.value;
                    setBrandColor(v);
                    if (/^#[0-9a-fA-F]{6}$/.test(v)) notifyWith({ formData: { brandColor: v } });
                  }}
                />
                <input
                  ref={colorInputRef}
                  type="color"
                  value={brandColor}
                  className="sr-only"
                  onChange={(e) => {
                    setBrandColor(e.target.value);
                    notifyWith({ formData: { brandColor: e.target.value } });
                  }}
                />
              </div>
              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setBrandColor(c);
                      notifyWith({ formData: { brandColor: c } });
                    }}
                    className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 ${brandColor === c ? "border-white scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
              </div>
              <p className="text-[11px] text-zinc-600 mt-2">
                Modifie la couleur d'accentuation sur tout le site.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Save button */}
      <div className="px-5 py-4 border-t border-zinc-800 shrink-0">
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
        >
          {saveState === "saving" && <Loader2 size={15} className="animate-spin" />}
          {saveState === "saved" && <Check size={15} />}
          {saveState === "idle" && <Save size={15} />}
          {saveState === "saving" ? "Sauvegarde…" : saveState === "saved" ? "Sauvegardé !" : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
