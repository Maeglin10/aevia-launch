"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { BusinessProfile } from "@/lib/sessions";
import { useAutoSaveStep } from "@/components/wizard/useAutoSaveStep";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const BOOKING_PROVIDERS = ["Planity", "Doctolib", "Calendly", "Autre"];

// No width baked in — every call site sets its own (w-full, flex-1, w-24…);
// baking w-full in here fought with those per-field widths (Tailwind's CSS
// source order decides the winner, not class order, so it silently clipped
// inputs like "Nom de la prestation" down to a few pixels).
const input = "px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-red-500 transition-colors";
const label = "text-xs font-semibold tracking-wide text-zinc-400 uppercase";

type Service = NonNullable<BusinessProfile["services"]>[number];
type TeamMember = NonNullable<BusinessProfile["team"]>[number];
type ReputationSource = NonNullable<NonNullable<BusinessProfile["reputation"]>["sources"]>[number];
type OpeningHour = NonNullable<BusinessProfile["openingHours"]>[number];

async function uploadPhoto(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) return null;
  const { url } = (await res.json()) as { url: string };
  return url;
}

export function ServiceRdvStep({
  value,
  onChange,
  sessionId,
  variant = "default",
}: {
  value: BusinessProfile | undefined;
  onChange: (bp: BusinessProfile) => void;
  sessionId: string | null;
  // "sante" adds practitioner specialty/credentials fields to each team row
  // and an emergency-contact section — reused as-is for médecin/dentiste/
  // kiné/ostéo (same service_rdv archetype, no separate step needed).
  variant?: "default" | "sante";
}) {
  useAutoSaveStep(sessionId, "businessProfile", value);

  const services = value?.services ?? [];
  const team = value?.team ?? [];
  const openingHours = value?.openingHours ?? DAYS.map((day) => ({ day, closed: false } as OpeningHour));
  const sources = value?.reputation?.sources ?? [];

  const patch = (partial: Partial<BusinessProfile>) => onChange({ ...value, ...partial });

  // ─── Services ────────────────────────────────────────────────────────────
  const updateService = (idx: number, field: keyof Service, v: string) => {
    const next = services.map((s, i) => (i === idx ? { ...s, [field]: v } : s));
    patch({ services: next });
  };
  const addService = () => patch({ services: [...services, { name: "" }] });
  const removeService = (idx: number) => patch({ services: services.filter((_, i) => i !== idx) });

  // ─── Team ────────────────────────────────────────────────────────────────
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const updateTeam = (idx: number, field: keyof TeamMember, v: string) => {
    const next = team.map((m, i) => (i === idx ? { ...m, [field]: v } : m));
    patch({ team: next });
  };
  const addTeam = () => patch({ team: [...team, { name: "", role: "" }] });
  const removeTeam = (idx: number) => patch({ team: team.filter((_, i) => i !== idx) });
  const handleTeamPhoto = async (idx: number, file: File) => {
    setUploadingIdx(idx);
    try {
      const url = await uploadPhoto(file);
      if (url) updateTeam(idx, "photoUrl", url);
    } finally {
      setUploadingIdx(null);
    }
  };

  // ─── Opening hours ───────────────────────────────────────────────────────
  const updateHour = (idx: number, field: keyof OpeningHour, v: string | boolean) => {
    const next = openingHours.map((h, i) => (i === idx ? { ...h, [field]: v } : h));
    patch({ openingHours: next });
  };

  // ─── Reputation sources ──────────────────────────────────────────────────
  const updateSource = <K extends keyof ReputationSource>(idx: number, field: K, v: ReputationSource[K]) => {
    const next = sources.map((s, i) => (i === idx ? { ...s, [field]: v } : s));
    patch({ reputation: { ...value?.reputation, sources: next } });
  };
  const addSource = () => patch({ reputation: { ...value?.reputation, sources: [...sources, { platform: "", url: "" }] } });
  const removeSource = (idx: number) =>
    patch({ reputation: { ...value?.reputation, sources: sources.filter((_, i) => i !== idx) } });

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-white">Votre offre</h2>

      {/* Services */}
      <div className="space-y-2">
        <p className={label}>Prestations</p>
        <div className="flex flex-col gap-3">
          {services.map((s, i) => (
            <div key={i} className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  className={`${input} flex-1`}
                  value={s.name}
                  onChange={(e) => updateService(i, "name", e.target.value)}
                  placeholder="Nom de la prestation"
                />
                <input
                  className={`${input} w-24`}
                  value={s.price ?? ""}
                  onChange={(e) => updateService(i, "price", e.target.value)}
                  placeholder="Prix"
                />
                <input
                  className={`${input} w-24`}
                  value={s.duration ?? ""}
                  onChange={(e) => updateService(i, "duration", e.target.value)}
                  placeholder="Durée"
                />
                <button type="button" onClick={() => removeService(i)} aria-label="Supprimer">
                  <X size={14} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
                </button>
              </div>
              <input
                className={`${input} w-full`}
                value={s.description ?? ""}
                onChange={(e) => updateService(i, "description", e.target.value)}
                placeholder="Description courte (optionnel)"
              />
            </div>
          ))}
          <button type="button" onClick={addService} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors">
            <Plus size={14} /> Ajouter une prestation
          </button>
        </div>
      </div>

      {/* Team */}
      <div className="space-y-2">
        <p className={label}>Équipe</p>
        <div className="flex flex-col gap-3">
          {team.map((m, i) => (
            <div key={i} className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  className={`${input} flex-1`}
                  value={m.name}
                  onChange={(e) => updateTeam(i, "name", e.target.value)}
                  placeholder="Nom"
                />
                <input
                  className={`${input} flex-1`}
                  value={m.role}
                  onChange={(e) => updateTeam(i, "role", e.target.value)}
                  placeholder="Rôle"
                />
                <button type="button" onClick={() => removeTeam(i)} aria-label="Supprimer">
                  <X size={14} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
                </button>
              </div>
              {variant === "sante" && (
                <div className="flex items-center gap-2">
                  <input
                    className={`${input} flex-1`}
                    value={m.specialty ?? ""}
                    onChange={(e) => updateTeam(i, "specialty", e.target.value)}
                    placeholder="Spécialité (ex : Pédiatrie)"
                  />
                  <input
                    className={`${input} flex-1`}
                    value={m.credentials ?? ""}
                    onChange={(e) => updateTeam(i, "credentials", e.target.value)}
                    placeholder="Diplômes / certifications"
                  />
                </div>
              )}
              <label className="inline-flex items-center gap-2 text-xs text-zinc-400 cursor-pointer w-fit">
                {uploadingIdx === i ? "Envoi…" : m.photoUrl ? "Photo ajoutée ✓" : "Ajouter une photo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={uploadingIdx === i}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleTeamPhoto(i, f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={addTeam} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors">
            <Plus size={14} /> Ajouter un membre
          </button>
        </div>
      </div>

      {/* Booking system */}
      <div className="space-y-2">
        <p className={label}>Système de réservation</p>
        <div className="flex gap-2">
          <select
            className={`${input} w-40`}
            value={value?.bookingSystem?.provider ?? ""}
            onChange={(e) => patch({ bookingSystem: { ...value?.bookingSystem, provider: e.target.value } })}
          >
            <option value="">…</option>
            {BOOKING_PROVIDERS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input
            className={`${input} flex-1`}
            value={value?.bookingSystem?.url ?? ""}
            onChange={(e) => patch({ bookingSystem: { ...value?.bookingSystem, url: e.target.value } })}
            placeholder="Lien de réservation"
          />
        </div>
      </div>

      {/* Opening hours */}
      <div className="space-y-2">
        <p className={label}>Horaires</p>
        <div className="flex flex-col gap-1.5">
          {openingHours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-2 text-sm">
              <span className="w-20 text-zinc-400 shrink-0">{h.day}</span>
              <label className="flex items-center gap-1.5 text-xs text-zinc-500 shrink-0">
                <input
                  type="checkbox"
                  checked={!!h.closed}
                  onChange={(e) => updateHour(i, "closed", e.target.checked)}
                />
                Fermé
              </label>
              {!h.closed && (
                <>
                  <input
                    type="time"
                    className={`${input} w-28`}
                    value={h.open ?? ""}
                    onChange={(e) => updateHour(i, "open", e.target.value)}
                  />
                  <span className="text-zinc-600">→</span>
                  <input
                    type="time"
                    className={`${input} w-28`}
                    value={h.close ?? ""}
                    onChange={(e) => updateHour(i, "close", e.target.value)}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reputation sources */}
      <div className="space-y-2">
        <p className={label}>Avis clients</p>
        <p className="text-xs text-zinc-500">Si tu as ton lien Planity/Google, ajoute-le, sinon laisse vide.</p>
        <div className="flex flex-col gap-2">
          {sources.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`${input} w-28`}
                value={s.platform}
                onChange={(e) => updateSource(i, "platform", e.target.value)}
                placeholder="Plateforme"
              />
              <input
                className={`${input} flex-1`}
                value={s.url}
                onChange={(e) => updateSource(i, "url", e.target.value)}
                placeholder="URL"
              />
              <input
                className={`${input} w-16`}
                value={s.rating != null ? String(s.rating) : ""}
                onChange={(e) => updateSource(i, "rating", e.target.value === "" ? undefined : Number(e.target.value))}
                placeholder="Note"
              />
              <button type="button" onClick={() => removeSource(i)} aria-label="Supprimer">
                <X size={14} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addSource} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors w-fit">
            <Plus size={14} /> Ajouter une source
          </button>
        </div>
      </div>

      {/* Emergency contact (santé only) */}
      {variant === "sante" && (
        <div className="space-y-2">
          <p className={label}>Urgences</p>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={!!value?.emergency?.enabled}
              onChange={(e) => patch({ emergency: { ...value?.emergency, enabled: e.target.checked } })}
            />
            Nous prenons les urgences
          </label>
          {value?.emergency?.enabled && (
            <div className="flex items-center gap-2">
              <input
                className={`${input} w-40`}
                value={value?.emergency?.phone ?? ""}
                onChange={(e) => patch({ emergency: { ...value?.emergency, enabled: true, phone: e.target.value } })}
                placeholder="Téléphone d'urgence"
              />
              <input
                className={`${input} flex-1`}
                value={value?.emergency?.note ?? ""}
                onChange={(e) => patch({ emergency: { ...value?.emergency, enabled: true, note: e.target.value } })}
                placeholder="Note (ex : soir et week-end)"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
