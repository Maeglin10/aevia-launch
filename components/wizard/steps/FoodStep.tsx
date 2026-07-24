"use client";

import { Plus, X } from "lucide-react";
import type { BusinessProfile } from "@/lib/sessions";
import { useAutoSaveStep } from "@/components/wizard/useAutoSaveStep";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const BOOKING_PROVIDERS = ["TheFork", "Zenchef", "OpenTable", "Autre"];

const input = "px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-red-500 transition-colors";
const label = "text-xs font-semibold tracking-wide text-zinc-400 uppercase";

type MenuItem = NonNullable<BusinessProfile["menu"]>[number];
type OpeningHour = NonNullable<BusinessProfile["openingHours"]>[number];

export function FoodStep({
  value,
  onChange,
  sessionId,
}: {
  value: BusinessProfile | undefined;
  onChange: (bp: BusinessProfile) => void;
  sessionId: string | null;
}) {
  useAutoSaveStep(sessionId, "businessProfile", value);

  const menu = value?.menu ?? [];
  const openingHours = value?.openingHours ?? DAYS.map((day) => ({ day, closed: false } as OpeningHour));

  const patch = (partial: Partial<BusinessProfile>) => onChange({ ...value, ...partial });

  // ─── Menu ────────────────────────────────────────────────────────────────
  const updateItem = (idx: number, field: keyof MenuItem, v: string) => {
    const next = menu.map((m, i) => (i === idx ? { ...m, [field]: v } : m));
    patch({ menu: next });
  };
  const addItem = (category: string) => patch({ menu: [...menu, { category, name: "" }] });
  const removeItem = (idx: number) => patch({ menu: menu.filter((_, i) => i !== idx) });

  // Group by category, preserving first-seen order.
  const categories: string[] = [];
  for (const m of menu) if (m.category && !categories.includes(m.category)) categories.push(m.category);
  if (categories.length === 0) categories.push("Entrées", "Plats", "Desserts");

  // ─── Opening hours ───────────────────────────────────────────────────────
  const updateHour = (idx: number, field: keyof OpeningHour, v: string | boolean) => {
    const next = openingHours.map((h, i) => (i === idx ? { ...h, [field]: v } : h));
    patch({ openingHours: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-white">Votre carte</h2>

      {/* Menu grouped by category */}
      <div className="space-y-4">
        <p className={label}>Menu</p>
        {categories.map((cat) => (
          <div key={cat} className="space-y-2">
            <input
              className={`${input} w-48 font-semibold`}
              value={cat}
              onChange={(e) => {
                const next = menu.map((m) => (m.category === cat ? { ...m, category: e.target.value } : m));
                patch({ menu: next });
              }}
              placeholder="Catégorie (ex : Entrées)"
            />
            <div className="flex flex-col gap-2 pl-2">
              {menu.map((m, i) =>
                m.category === cat ? (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className={`${input} flex-1`}
                      value={m.name}
                      onChange={(e) => updateItem(i, "name", e.target.value)}
                      placeholder="Nom du plat"
                    />
                    <input
                      className={`${input} w-24`}
                      value={m.price ?? ""}
                      onChange={(e) => updateItem(i, "price", e.target.value)}
                      placeholder="Prix"
                    />
                    <input
                      className={`${input} flex-1`}
                      value={m.description ?? ""}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Description (optionnel)"
                    />
                    <button type="button" onClick={() => removeItem(i)} aria-label="Supprimer">
                      <X size={14} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
                    </button>
                  </div>
                ) : null
              )}
              <button type="button" onClick={() => addItem(cat)} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors w-fit">
                <Plus size={14} /> Ajouter un plat
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const name = "Nouvelle catégorie";
            patch({ menu: [...menu, { category: name, name: "" }] });
          }}
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          <Plus size={14} /> Ajouter une catégorie
        </button>
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
    </div>
  );
}
