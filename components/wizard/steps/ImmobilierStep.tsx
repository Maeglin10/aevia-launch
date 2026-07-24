"use client";

import { Plus, X } from "lucide-react";
import type { BusinessProfile } from "@/lib/sessions";
import { useAutoSaveStep } from "@/components/wizard/useAutoSaveStep";

const LISTING_STATUSES = ["Disponible", "Sous compromis", "Vendu", "Loué"];

const input = "px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-red-500 transition-colors";
const label = "text-xs font-semibold tracking-wide text-zinc-400 uppercase";

type Listing = NonNullable<BusinessProfile["listings"]>[number];
type TeamMember = NonNullable<BusinessProfile["team"]>[number];

export function ImmobilierStep({
  value,
  onChange,
  sessionId,
}: {
  value: BusinessProfile | undefined;
  onChange: (bp: BusinessProfile) => void;
  sessionId: string | null;
}) {
  useAutoSaveStep(sessionId, "businessProfile", value);

  const listings = value?.listings ?? [];
  const team = value?.team ?? [];
  const serviceAreas = value?.geo?.serviceAreas ?? [];

  const patch = (partial: Partial<BusinessProfile>) => onChange({ ...value, ...partial });

  // ─── Listings ────────────────────────────────────────────────────────────
  const updateListing = (idx: number, field: keyof Listing, v: string) => {
    const next = listings.map((l, i) => (i === idx ? { ...l, [field]: v } : l));
    patch({ listings: next });
  };
  const addListing = () => patch({ listings: [...listings, { title: "" }] });
  const removeListing = (idx: number) => patch({ listings: listings.filter((_, i) => i !== idx) });

  // ─── Team (agents) ───────────────────────────────────────────────────────
  const updateTeam = (idx: number, field: keyof TeamMember, v: string) => {
    const next = team.map((m, i) => (i === idx ? { ...m, [field]: v } : m));
    patch({ team: next });
  };
  const addTeam = () => patch({ team: [...team, { name: "", role: "Agent immobilier" }] });
  const removeTeam = (idx: number) => patch({ team: team.filter((_, i) => i !== idx) });

  // ─── Service areas ───────────────────────────────────────────────────────
  const updateArea = (idx: number, v: string) => {
    const next = serviceAreas.map((a, i) => (i === idx ? v : a));
    patch({ geo: { ...value?.geo, serviceAreas: next } });
  };
  const addArea = () => patch({ geo: { ...value?.geo, serviceAreas: [...serviceAreas, ""] } });
  const removeArea = (idx: number) => patch({ geo: { ...value?.geo, serviceAreas: serviceAreas.filter((_, i) => i !== idx) } });

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-white">Vos biens</h2>

      {/* Listings */}
      <div className="space-y-2">
        <p className={label}>Annonces</p>
        <div className="flex flex-col gap-3">
          {listings.map((l, i) => (
            <div key={i} className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  className={`${input} flex-1`}
                  value={l.title}
                  onChange={(e) => updateListing(i, "title", e.target.value)}
                  placeholder="Titre de l'annonce"
                />
                <input
                  className={`${input} w-24`}
                  value={l.price ?? ""}
                  onChange={(e) => updateListing(i, "price", e.target.value)}
                  placeholder="Prix"
                />
                <button type="button" onClick={() => removeListing(i)} aria-label="Supprimer">
                  <X size={14} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className={`${input} w-24`}
                  value={l.surface ?? ""}
                  onChange={(e) => updateListing(i, "surface", e.target.value)}
                  placeholder="Surface (m²)"
                />
                <input
                  className={`${input} w-20`}
                  value={l.rooms ?? ""}
                  onChange={(e) => updateListing(i, "rooms", e.target.value)}
                  placeholder="Pièces"
                />
                <input
                  className={`${input} flex-1`}
                  value={l.city ?? ""}
                  onChange={(e) => updateListing(i, "city", e.target.value)}
                  placeholder="Ville"
                />
                <select
                  className={`${input} w-40`}
                  value={l.status ?? ""}
                  onChange={(e) => updateListing(i, "status", e.target.value)}
                >
                  <option value="">Statut…</option>
                  {LISTING_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <button type="button" onClick={addListing} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors">
            <Plus size={14} /> Ajouter une annonce
          </button>
        </div>
      </div>

      {/* Team / agents */}
      <div className="space-y-2">
        <p className={label}>Agents</p>
        <div className="flex flex-col gap-2">
          {team.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
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
          ))}
          <button type="button" onClick={addTeam} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors w-fit">
            <Plus size={14} /> Ajouter un agent
          </button>
        </div>
      </div>

      {/* Service areas */}
      <div className="space-y-2">
        <p className={label}>Zones d&apos;intervention</p>
        <div className="flex flex-wrap gap-2">
          {serviceAreas.map((a, i) => (
            <div key={i} className="flex items-center gap-1">
              <input
                className={`${input} w-36`}
                value={a}
                onChange={(e) => updateArea(i, e.target.value)}
                placeholder="Ville / secteur"
              />
              <button type="button" onClick={() => removeArea(i)} aria-label="Supprimer">
                <X size={14} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addArea} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors">
            <Plus size={14} /> Ajouter une zone
          </button>
        </div>
      </div>
    </div>
  );
}
