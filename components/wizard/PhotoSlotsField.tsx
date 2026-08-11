"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { photoSlotsFor } from "@/lib/templates/photoSlots";
import { checkImage } from "@/lib/wizard/imageCheck";

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
  metier,
}: {
  templateId: string | undefined;
  photoUrls: string[];
  /** Le metier du client, pour chercher dans les banques d'images. */
  metier?: string;
  onChange: (next: string[]) => void;
  /** Téléverse et rend l'URL, ou une chaîne vide en cas d'échec. */
  onUpload: (file: File) => Promise<string>;
  uploading: boolean;
  emptyLabel: string;
}) {
  const slots = photoSlotsFor(templateId);

  /*
    Cinquante-deux thèmes ne portent aucune photographie : ils composent avec
    de la typographie, des aplats et des dégradés. Leur réclamer une photo
    serait lui faire perdre son temps pour une image qui ne paraîtrait nulle
    part — et le laisser devant une zone vide, sans explication, serait pire.
    On le dit, et on passe à la suite.
  */
  if (slots.n === 0) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-300">
          Ce thème n&apos;utilise pas de photographie.
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Il compose avec la typographie, les couleurs et les formes. Vous
          n&apos;avez donc aucune image à fournir ici — votre logo et vos
          couleurs suffisent.
        </p>
      </div>
    );
  }
  /*
    Les banques d'images, pour le client qui n'a pas de photo de son atelier.

    Sans elles, il garde celles de la demonstration — les memes que tous les
    clients de sa niche. Pexels et Pixabay sont interroges ensemble et leurs
    resultats alternes, si bien que deux clients du meme metier ne tombent pas
    sur la meme premiere image.
  */
  const [banqueOuverte, setBanqueOuverte] = useState<number | null>(null);
  const [propositions, setPropositions] = useState<
    { url: string; apercu: string; auteur: string; source: string }[]
  >([]);
  const [chargeBanque, setChargeBanque] = useState(false);

  async function ouvrirBanque(i: number, requete: string) {
    setBanqueOuverte(i);
    setChargeBanque(true);
    try {
      const r = await fetch(`/api/stock?q=${encodeURIComponent(requete)}&n=12`);
      const { images } = await r.json();
      setPropositions(images ?? []);
    } catch {
      setPropositions([]);
    } finally {
      setChargeBanque(false);
    }
  }
  /** Ce qu'on a à dire sur la photo de chaque emplacement. */
  const [verdicts, setVerdicts] = useState<Record<number, { texte: string; grave: boolean }>>({});

  const setAt = (i: number, url: string) => {
    const next = [...photoUrls];
    while (next.length < i) next.push("");
    next[i] = url;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {banqueOuverte !== null && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4" onClick={() => setBanqueOuverte(null)}>
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Images libres de droits</p>
              <button type="button" className="text-zinc-400 hover:text-white" onClick={() => setBanqueOuverte(null)} aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            {chargeBanque ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-500" /></div>
            ) : propositions.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">Aucune image trouvee. Essayez un autre emplacement.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {propositions.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    className="group overflow-hidden rounded-lg border border-zinc-700 transition-colors hover:border-red-500"
                    onClick={() => {
                      setAt(banqueOuverte, img.url);
                      setBanqueOuverte(null);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.apercu} alt="" className="aspect-square w-full object-cover" />
                    <span className="block truncate px-2 py-1 text-[10px] text-zinc-500">
                      {img.auteur} · {img.source}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
                      // Mesurer avant d'envoyer : inutile de téléverser un
                      // fichier qu'on refusera, et le client veut savoir tout
                      // de suite, pas une fois son site en ligne.
                      const v = await checkImage(f, i);
                      setVerdicts((prev) => ({
                        ...prev,
                        [i]: v.erreur
                          ? { texte: v.erreur, grave: true }
                          : v.avertissement
                            ? { texte: v.avertissement, grave: false }
                            : { texte: "", grave: false },
                      }));
                      if (!v.ok) {
                        e.target.value = "";
                        return;
                      }
                      const uploaded = await onUpload(f);
                      if (uploaded) setAt(i, uploaded);
                    }}
                  />
                </label>
              )}
              <p className="truncate text-xs text-zinc-500" title={label ?? undefined}>
                {label ?? emptyLabel}
              </p>
              <button
                type="button"
                className="text-[11px] text-zinc-400 underline underline-offset-2 hover:text-white transition-colors"
                onClick={() => ouvrirBanque(i, [metier, label].filter(Boolean).join(" "))}
              >
                Choisir une image
              </button>
              {verdicts[i]?.texte && (
                <p
                  role={verdicts[i].grave ? "alert" : undefined}
                  className={`text-xs ${verdicts[i].grave ? "text-red-400" : "text-amber-400"}`}
                >
                  {verdicts[i].texte}
                </p>
              )}
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
