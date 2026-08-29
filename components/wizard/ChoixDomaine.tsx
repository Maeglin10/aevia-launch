"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

/*
  Le nom de domaine, choisi en connaissance de cause.

  Avant, le champ demandait « le nom souhaité » et promettait « on l'achète et
  on le configure pour vous » — sans dire combien, ni si le nom était libre. Le
  client découvrait le prix après, ou jamais.

  Ici il écrit son nom, voit s'il est libre, voit le prix, et reçoit deux ou
  trois autres pistes chiffrées. Il peut aussi tout refuser : son site vit
  alors sur une adresse en .vercel.app, sans frais. Le domaine est une option,
  jamais un péage à l'entrée.
*/

export type DomaineChoisi = { nom: string; prix: number } | null;

type Verdict = { domaine: string; libre: boolean | null; prix: number | null; note?: string };
type Reponse = {
  demande: Verdict;
  alternatives: Verdict[];
  sansDomaine: { prix: number; note: string };
  disponibiliteVerifiee: boolean;
  erreur?: string;
};

export function ChoixDomaine({
  valeur,
  onChange,
}: {
  valeur: DomaineChoisi;
  onChange: (choix: DomaineChoisi) => void;
}) {
  const [saisie, setSaisie] = useState(valeur?.nom ?? "");
  const [reponse, setReponse] = useState<Reponse | null>(null);
  const [cherche, setCherche] = useState(false);

  /*
    On interroge après une pause de frappe, pas à chaque touche : le service de
    disponibilité est distant, et le client tape son nom lettre par lettre.
  */
  useEffect(() => {
    const nom = saisie.trim();
    if (nom.length < 4 || !nom.includes(".")) { setReponse(null); return; }
    let annule = false;
    const t = setTimeout(async () => {
      setCherche(true);
      try {
        const r = await fetch(`/api/domains?q=${encodeURIComponent(nom)}`);
        const j = (await r.json()) as Reponse;
        if (!annule) setReponse(j);
      } catch {
        if (!annule) setReponse(null);
      } finally {
        if (!annule) setCherche(false);
      }
    }, 600);
    return () => { annule = true; clearTimeout(t); };
  }, [saisie]);

  const choisir = (v: Verdict) => {
    if (v.prix === null) return;
    onChange({ nom: v.domaine, prix: v.prix });
    setSaisie(v.domaine);
  };

  const Ligne = ({ v }: { v: Verdict }) => {
    const retenu = valeur?.nom === v.domaine;
    return (
      <button
        type="button"
        onClick={() => choisir(v)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
          retenu ? "border-white/40 bg-white/10" : "border-white/10 bg-white/5 hover:border-white/25"
        }`}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm text-white">{v.domaine}</span>
          {v.note && <span className="block truncate text-xs text-white/40">{v.note}</span>}
        </span>
        <span className="shrink-0 text-sm text-white/80">
          {v.libre === false ? "déjà pris" : `${v.prix} €`}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <Globe size={14} className="shrink-0 text-white/30" />
        <input
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder="mon-entreprise.fr"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
        />
        {cherche && <span className="shrink-0 text-xs text-white/40">recherche…</span>}
      </div>

      {reponse?.erreur && <p className="text-xs text-amber-300/80">{reponse.erreur}</p>}

      {reponse && !reponse.erreur && (
        <div className="space-y-2">
          {reponse.demande.prix !== null && <Ligne v={reponse.demande} />}
          {reponse.demande.prix === null && (
            <p className="text-xs text-amber-300/80">
              Nous ne savons pas encore rattacher cette extension automatiquement.
              Écrivez-nous : nous la traiterons à la main.
            </p>
          )}

          {reponse.alternatives.length > 0 && (
            <>
              <p className="pt-1 text-xs uppercase tracking-wider text-white/30">Autres pistes</p>
              {reponse.alternatives.map((a) => <Ligne key={a.domaine} v={a} />)}
            </>
          )}

          <button
            type="button"
            onClick={() => { onChange(null); }}
            className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              valeur === null ? "border-white/40 bg-white/10" : "border-white/10 bg-white/5 hover:border-white/25"
            }`}
          >
            <span className="min-w-0">
              <span className="block text-sm text-white">Sans nom de domaine</span>
              <span className="block truncate text-xs text-white/40">{reponse.sansDomaine.note}</span>
            </span>
            <span className="shrink-0 text-sm text-white/80">0 €</span>
          </button>

          {/*
            Ce qui se passe après le paiement, dit avant.

            L'enregistrement d'un nom de domaine n'est pas instantané chez nous :
            une personne l'achète et le branche. Le client qui paie 29 € croyait
            son adresse active à la seconde ; elle l'est sous un jour ouvré. Le
            site, lui, est en ligne tout de suite — c'est ce qu'il faut dire.
          */}
          {valeur !== null && (
            <p className="text-xs text-white/45">
              Nous enregistrons et branchons ce nom sous un jour ouvré. Votre site est
              en ligne immédiatement sur son adresse en .vercel.app, et bascule sur votre
              nom dès qu'il est actif.
            </p>
          )}

          {!reponse.disponibiliteVerifiee && (
            <p className="text-xs text-white/40">
              La disponibilité n&apos;a pas pu être vérifiée à l&apos;instant. Nous la
              confirmons avant tout enregistrement, et vous prévenons si le nom est pris.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
