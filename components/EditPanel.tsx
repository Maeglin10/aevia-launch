"use client";

import { useState } from "react";
import { X, Plus, Trash2, Save, Loader2, Check } from "lucide-react";
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

const T = {
  title: "Modifier le contenu",
  hero: "Section principale",
  headline: "Titre principal",
  subline: "Sous-titre",
  cta: "Texte du bouton",
  heroImage: "URL de l'image hero",
  heroImageHint: "Lien direct vers une image (jpg, png, webp)",
  about: "À propos",
  aboutTitle: "Titre",
  aboutText: "Texte",
  services: "Services",
  serviceTitle: "Titre du service",
  serviceDesc: "Description",
  addService: "+ Ajouter un service",
  contact: "Coordonnées",
  phone: "Téléphone",
  email: "Email",
  city: "Ville",
  save: "Sauvegarder",
  saved: "Sauvegardé !",
  saving: "Sauvegarde…",
};

export function EditPanel({ session, onClose, onChange, onSave }: EditPanelProps) {
  const gc = session.generatedContent;
  const fd = session.formData;

  const [heroHeadline, setHeroHeadline] = useState(gc?.heroHeadline ?? "");
  const [heroSubline, setHeroSubline] = useState(gc?.heroSubline ?? "");
  const [ctaText, setCtaText] = useState(gc?.ctaText ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(fd.heroImageUrl ?? "");
  const [aboutTitle, setAboutTitle] = useState(gc?.aboutTitle ?? "");
  const [aboutText, setAboutText] = useState(gc?.aboutText ?? "");
  const [services, setServices] = useState(gc?.services ?? []);
  const [phone, setPhone] = useState(fd.phone ?? "");
  const [email, setEmail] = useState(fd.email ?? "");
  const [city, setCity] = useState(fd.city ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  function buildPayload(): EditableData {
    return {
      generatedContent: { heroHeadline, heroSubline, ctaText, aboutTitle, aboutText, services },
      formData: { phone, email, city, heroImageUrl },
    };
  }

  function notify() {
    onChange(buildPayload());
  }

  function field(
    label: string,
    value: string,
    setter: (v: string) => void,
    multiline = false,
    hint?: string,
  ) {
    return (
      <div className="mb-4">
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
          {label}
        </label>
        {hint && <p className="text-xs text-zinc-500 mb-1">{hint}</p>}
        {multiline ? (
          <textarea
            value={value}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
            onChange={(e) => { setter(e.target.value); notify(); }}
          />
        ) : (
          <input
            type="text"
            value={value}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            onChange={(e) => { setter(e.target.value); notify(); }}
          />
        )}
      </div>
    );
  }

  function updateService(i: number, key: "title" | "description", val: string) {
    const next = services.map((s, idx) => idx === i ? { ...s, [key]: val } : s);
    setServices(next);
    onChange({ generatedContent: { ...buildPayload().generatedContent, services: next }, formData: buildPayload().formData });
  }

  function addService() {
    const next = [...services, { title: "Nouveau service", description: "Description du service" }];
    setServices(next);
    onChange({ generatedContent: { ...buildPayload().generatedContent, services: next }, formData: buildPayload().formData });
  }

  function removeService(i: number) {
    const next = services.filter((_, idx) => idx !== i);
    setServices(next);
    onChange({ generatedContent: { ...buildPayload().generatedContent, services: next }, formData: buildPayload().formData });
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
        <h2 className="text-sm font-bold text-white">{T.title}</h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Hero */}
        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">{T.hero}</p>
        {field(T.headline, heroHeadline, setHeroHeadline)}
        {field(T.subline, heroSubline, setHeroSubline)}
        {field(T.cta, ctaText, setCtaText)}
        {field(T.heroImage, heroImageUrl, setHeroImageUrl, false, T.heroImageHint)}

        <div className="border-t border-zinc-800 my-4" />

        {/* About */}
        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">{T.about}</p>
        {field(T.aboutTitle, aboutTitle, setAboutTitle)}
        {field(T.aboutText, aboutText, setAboutText, true)}

        <div className="border-t border-zinc-800 my-4" />

        {/* Services */}
        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">{T.services}</p>
        {services.map((s, i) => (
          <div key={i} className="bg-zinc-900 rounded-xl p-3 mb-3 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500">Service {i + 1}</span>
              <button
                onClick={() => removeService(i)}
                className="text-zinc-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <input
              type="text"
              value={s.title}
              placeholder={T.serviceTitle}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white mb-2 focus:outline-none focus:border-violet-500"
              onChange={(e) => updateService(i, "title", e.target.value)}
            />
            <textarea
              value={s.description}
              placeholder={T.serviceDesc}
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white resize-none focus:outline-none focus:border-violet-500"
              onChange={(e) => updateService(i, "description", e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={addService}
          className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors mb-4"
        >
          <Plus size={14} /> {T.addService}
        </button>

        <div className="border-t border-zinc-800 my-4" />

        {/* Contact */}
        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">{T.contact}</p>
        {field(T.phone, phone, setPhone)}
        {field(T.email, email, setEmail)}
        {field(T.city, city, setCity)}
      </div>

      {/* Save button */}
      <div className="px-5 py-4 border-t border-zinc-800 shrink-0">
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
        >
          {saveState === "saving" && <Loader2 size={16} className="animate-spin" />}
          {saveState === "saved" && <Check size={16} />}
          {saveState === "idle" && <Save size={16} />}
          {saveState === "saving" ? T.saving : saveState === "saved" ? T.saved : T.save}
        </button>
      </div>
    </div>
  );
}
