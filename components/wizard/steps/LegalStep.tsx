"use client";

import type { LegalProfile } from "@/lib/sessions";

const input = "px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-red-500 transition-colors w-full";
const label = "text-xs font-semibold tracking-wide text-zinc-400 uppercase";

const LEGAL_FORMS = ["Auto-entrepreneur", "EI", "EURL", "SASU", "SARL", "SAS", "Autre"];

// Shown as the wizard's final phase, before submit, for every niche — every
// business needs mentions légales/CGV regardless of archetype. Feeds
// lib/legal/generateLegalPages.ts once the site is generated.
export function LegalStep({
  value,
  onChange,
}: {
  value: LegalProfile | undefined;
  onChange: (legal: LegalProfile) => void;
}) {
  const patch = (partial: Partial<LegalProfile>) => onChange({ ...value, ...partial });

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-white">Informations légales</h2>
      <p className="text-zinc-400 text-sm">
        Ces informations servent à générer automatiquement vos pages légales (mentions légales, CGV, confidentialité). Tout est optionnel — vous pourrez les compléter plus tard.
      </p>

      <div className="space-y-1.5">
        <p className={label}>Forme juridique</p>
        <select
          className={input}
          value={value?.legalForm ?? ""}
          onChange={(e) => patch({ legalForm: e.target.value })}
        >
          <option value="">…</option>
          {LEGAL_FORMS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <p className={label}>SIRET</p>
        <input
          className={input}
          value={value?.siret ?? ""}
          onChange={(e) => patch({ siret: e.target.value })}
          placeholder="123 456 789 00012"
        />
      </div>

      <div className="space-y-1.5">
        <p className={label}>Adresse de l&apos;entreprise</p>
        <input
          className={input}
          value={value?.companyAddress ?? ""}
          onChange={(e) => patch({ companyAddress: e.target.value })}
          placeholder="10 rue de la Paix, 75002 Paris"
        />
      </div>

      <div className="space-y-1.5">
        <p className={label}>Capital social (optionnel)</p>
        <input
          className={input}
          value={value?.capitalSocial ?? ""}
          onChange={(e) => patch({ capitalSocial: e.target.value })}
          placeholder="5 000 € — laissez vide si auto-entreprise"
        />
      </div>
    </div>
  );
}
