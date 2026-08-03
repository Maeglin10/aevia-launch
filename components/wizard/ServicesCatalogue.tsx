"use client";

import { Plus, X } from "lucide-react";

export interface ServiceEntry {
  name: string;
  price?: string;
  duration?: string;
  description?: string;
}

/**
 * Saisie des prestations, avec leur tarif.
 *
 * Onze métiers sur soixante-huit passaient par un archétype qui collectait
 * cette liste ; les cinquante-sept autres n'avaient qu'un « service principal »
 * en une ligne et une fourchette de prix en texte libre. Leurs thèmes se
 * retrouvaient donc sans rien à afficher et servaient les prestations de
 * démonstration — un couvreur lyonnais annonçait celles d'un couvreur d'Angers.
 *
 * Le prix est demandé ici, à côté du service, parce que les deux se décident
 * ensemble : une prestation sans tarif ne se vend pas.
 */
export function ServicesCatalogue({
  services,
  onChange,
  label = "Vos prestations et leurs tarifs",
  hint = "Ce que vous vendez, tel que vous le diriez à un client. Le tarif peut être un montant, une fourchette ou « sur devis ».",
  namePlaceholder = "Nom de la prestation",
}: {
  services: ServiceEntry[];
  onChange: (next: ServiceEntry[]) => void;
  label?: string;
  hint?: string;
  namePlaceholder?: string;
}) {
  const input =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-colors";

  const update = (idx: number, field: keyof ServiceEntry, v: string) =>
    onChange(services.map((s, i) => (i === idx ? { ...s, [field]: v } : s)));

  const add = () => onChange([...services, { name: "" }]);

  const remove = (idx: number) =>
    onChange(services.length > 1 ? services.filter((_, i) => i !== idx) : services);

  const rows = services.length ? services : [{ name: "" }];

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</p>
      <p className="text-xs text-zinc-500">{hint}</p>
      <div className="flex flex-col gap-3">
        {rows.map((s, i) => (
          <div
            key={i}
            className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <input
                className={`${input} flex-1 min-w-0`}
                value={s.name}
                onChange={(e) => update(i, "name", e.target.value)}
                placeholder={namePlaceholder}
                aria-label={`Prestation ${i + 1}`}
              />
              <input
                className={`${input} w-28 shrink-0`}
                value={s.price ?? ""}
                onChange={(e) => update(i, "price", e.target.value)}
                placeholder="Tarif"
                aria-label={`Tarif de la prestation ${i + 1}`}
              />
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label={`Supprimer la prestation ${i + 1}`}
                  className="shrink-0 p-2"
                >
                  <X size={14} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
                </button>
              )}
            </div>
            <input
              className={`${input} w-full`}
              value={s.description ?? ""}
              onChange={(e) => update(i, "description", e.target.value)}
              placeholder="Description courte (optionnel)"
              aria-label={`Description de la prestation ${i + 1}`}
            />
          </div>
        ))}
        {rows.length < 8 && (
          <button
            type="button"
            onClick={add}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors self-start"
          >
            <Plus size={14} /> Ajouter une prestation
          </button>
        )}
      </div>
    </div>
  );
}
