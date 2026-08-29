"use client";

import { useState } from "react";
import { ClipboardPaste } from "lucide-react";
import { lireLesAvisColles, type AvisLu } from "@/lib/avisColles";

/*
  Coller ses avis plutôt que les retaper.

  La saisie ligne à ligne existait déjà, et restait vide : un couvreur qui a
  quarante avis Google n'en recopie pas trois à la main. Le champ vide laissait
  le thème afficher ses exemples, et le site partait sans preuve sociale — le
  seul bloc qu'un visiteur lit vraiment avant d'appeler.

  On accepte donc la sélection brute de n'importe quelle page — Google, Planity,
  Doctolib, un ancien site, un courriel — et l'on montre ce qu'on en a compris
  AVANT d'ajouter quoi que ce soit. Le client corrige, puis valide.

  Rien n'est inventé : ce qui sort du collage vient du collage.
*/

const input =
  "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 w-full";

const SOURCES = ["Google", "Planity", "Doctolib", "Trustpilot", "Facebook", "PagesJaunes"];

export default function CollerDesAvis({
  onAjouter,
}: {
  /** Reçoit les avis relus, à concaténer à ceux déjà saisis. */
  onAjouter: (avis: AvisLu[]) => void;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [brut, setBrut] = useState("");
  const [source, setSource] = useState("Google");
  const [lus, setLus] = useState<AvisLu[] | null>(null);

  const lire = () => setLus(lireLesAvisColles(brut, source));

  const valider = () => {
    /* Un avis dont on a effacé le texte ne part pas. */
    const gardes = (lus ?? []).filter((a) => a.text.trim());
    if (gardes.length) onAjouter(gardes);
    setBrut("");
    setLus(null);
    setOuvert(false);
  };

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-2 transition-colors cursor-pointer"
      >
        <ClipboardPaste className="w-4 h-4" />
        Coller mes avis depuis Google, Planity…
      </button>
    );
  }

  return (
    <div className="border border-zinc-700 rounded-lg p-3 space-y-3 bg-zinc-900/40">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide" htmlFor="avis-source">
          Source
        </label>
        <select
          id="avis-source"
          className={`${input} w-auto cursor-pointer`}
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <label className="block">
        <span className="sr-only">Vos avis, collés depuis leur page</span>
        <textarea
          className={`${input} min-h-32 font-mono text-xs`}
          value={brut}
          onChange={(e) => setBrut(e.target.value)}
          placeholder={
            "Ouvrez votre page Google, sélectionnez vos avis, copiez, collez ici.\n" +
            "Peu importe la mise en forme : on reconnaît l'auteur, la note et le texte."
          }
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={lire}
          disabled={!brut.trim()}
          className="text-sm bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors cursor-pointer"
        >
          Relire ce collage
        </button>
        <button
          type="button"
          onClick={() => {
            setOuvert(false);
            setLus(null);
          }}
          className="text-sm text-zinc-400 hover:text-white px-3 py-2 transition-colors cursor-pointer"
        >
          Annuler
        </button>
      </div>

      {lus !== null && (
        <div className="space-y-2">
          {lus.length === 0 ? (
            <p className="text-sm text-amber-300">
              Rien de reconnu dans ce collage. Ajoutez vos avis à la main juste en dessous — c&apos;est
              plus sûr que de deviner à votre place.
            </p>
          ) : (
            <>
              <p className="text-sm text-zinc-300">
                {lus.length} avis reconnu{lus.length > 1 ? "s" : ""} — relisez avant d&apos;ajouter.
              </p>
              {lus.map((a, i) => (
                <div key={i} className="border border-zinc-700 rounded-lg p-2 space-y-2">
                  <textarea
                    className={`${input} min-h-16`}
                    value={a.text}
                    onChange={(e) =>
                      setLus(lus.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))
                    }
                  />
                  <div className="flex gap-2">
                    <input
                      className={`${input} flex-1 min-w-0`}
                      value={a.author}
                      onChange={(e) =>
                        setLus(lus.map((x, j) => (j === i ? { ...x, author: e.target.value } : x)))
                      }
                      placeholder="Auteur"
                      aria-label="Auteur de l'avis"
                    />
                    <select
                      className={`${input} w-28 shrink-0 cursor-pointer`}
                      value={a.rating}
                      onChange={(e) =>
                        setLus(lus.map((x, j) => (j === i ? { ...x, rating: Number(e.target.value) } : x)))
                      }
                      aria-label="Note de l'avis"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} ★
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={valider}
                className="text-sm bg-red-600 hover:bg-red-500 text-white rounded-lg px-3 py-2 transition-colors cursor-pointer"
              >
                Ajouter ces {lus.filter((a) => a.text.trim()).length} avis
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
