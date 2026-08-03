"use client";

import { Loader2, Plus, X } from "lucide-react";
import { photoSlotsFor } from "@/lib/templates/photoSlots";

/**
 * Une photo par emplacement du thème, à la place exacte où il la lit.
 *
 * La saisie précédente était une grille plate plafonnée à six, sans ordre ni
 * étiquette. Le client téléversait six photos, le thème n'en affichait qu'une —
 * `photoUrls[0]`, dans le hero — et toutes les autres images du site restaient
 * celles de la démonstration. Un client qui a fourni ses photos et n'en voit
 * qu'une conclut, à juste titre, que le site n'est pas le sien.
 *
 * Les libellés viennent du thème : son texte `alt`, ou le titre de la carte à
 * laquelle l'image appartient. On demande donc « Couvreurs sur une toiture »
 * plutôt que « photo 3 », et le client sait quoi téléverser.
 */
export function PhotoSlotsField({
  templateId,
  photoUrls,
  onChange,
  onUpload,
  uploading,
  emptyLabel,
}: {
  templateId: string | undefined;
  photoUrls: string[];
  onChange: (next: string[]) => void;
  /** Téléverse et rend l'URL, ou une chaîne vide en cas d'échec. */
  onUpload: (file: File) => Promise<string>;
  uploading: boolean;
  emptyLabel: string;
}) {
  const slots = photoSlotsFor(templateId);

  const setAt = (i: number, url: string) => {
    const next = [...photoUrls];
    while (next.length < i) next.push("");
    next[i] = url;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: slots.n }, (_, i) => {
          const url = photoUrls[i];
          const label = slots.labels[i];
          return (
            <div key={i} className="space-y-1">
              {url ? (
                <div className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={label ?? `photo ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setAt(i, "")}
                    aria-label={`Retirer la photo ${i + 1}`}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-700 transition-colors hover:border-red-500">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-red-400" />
                  ) : (
                    <Plus className="h-5 w-5 text-zinc-500" />
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    aria-label={label ?? `Photo ${i + 1}`}
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const uploaded = await onUpload(f);
                      if (uploaded) setAt(i, uploaded);
                    }}
                  />
                </label>
              )}
              <p className="truncate text-xs text-zinc-500" title={label ?? undefined}>
                {label ?? emptyLabel}
              </p>
            </div>
          );
        })}
      </div>
      {slots.total > slots.n && (
        <p className="text-xs text-zinc-500">
          Ce thème contient {slots.total} images. Les {slots.total - slots.n} dernières garderont
          celles du thème — nous vous le rappellerons sur l&apos;aperçu.
        </p>
      )}
    </div>
  );
}
