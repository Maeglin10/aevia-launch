"use client";

import { useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import type { BusinessProfile } from "@/lib/sessions";
import { blocksForTheme, type ContentBlock } from "@/lib/templates/capabilities";
import { copyFor } from "@/lib/wizard/lexicon";
import CollerDesAvis from "./CollerDesAvis";

/**
 * Les questions que le thème choisi rend nécessaires.
 *
 * Les avis figurent dans 89 % des thèmes, les engagements dans 74 %, les
 * chiffres clés dans 42 % — et le wizard n'en demandait aucun. Ces sections
 * restaient donc sur le contenu de démonstration quel que soit le câblage :
 * la donnée n'existait pas. On ne montre ici que ce que le thème sait afficher,
 * pour ne pas allonger le formulaire avec des champs qui n'iront nulle part.
 */

const input =
  "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-colors";
const labelCls = "text-xs font-medium text-zinc-400 uppercase tracking-wide";

function Repeater<T>({
  rows,
  onChange,
  empty,
  render,
  addLabel,
  max = 6,
}: {
  rows: T[];
  onChange: (next: T[]) => void;
  empty: T;
  render: (row: T, set: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel: string;
  max?: number;
}) {
  const list = rows.length ? rows : [empty];
  return (
    <div className="flex flex-col gap-3">
      {list.map((row, i) => (
        <div
          key={i}
          className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 flex items-start gap-2"
        >
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {render(row, (patch) =>
              onChange(list.map((r, n) => (n === i ? { ...r, ...patch } : r))),
            )}
          </div>
          {list.length > 1 && (
            <button
              type="button"
              onClick={() => onChange(list.filter((_, n) => n !== i))}
              aria-label="Supprimer cette entrée"
              className="shrink-0 p-2"
            >
              <X size={14} className="text-zinc-500 hover:text-zinc-300 transition-colors" />
            </button>
          )}
        </div>
      ))}
      {list.length < max && (
        <button
          type="button"
          onClick={() => onChange([...list, empty])}
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors self-start"
        >
          <Plus size={14} /> {addLabel}
        </button>
      )}
    </div>
  );
}

/**
 * Une section repliée par défaut.
 *
 * L'étape « Votre offre » faisait 1856 px et treize champs une fois tous les
 * blocs du thème dépliés — près de deux écrans avant d'atteindre « Continuer ».
 * Un formulaire de cette longueur se fait abandonner ou remplir à la va-vite,
 * et c'est exactement ce qu'on essaie d'éviter.
 *
 * Le pli montre combien d'entrées sont déjà remplies, pour que le client sache
 * ce qu'il a fait sans avoir à ouvrir, et il s'ouvre tout seul dès qu'il y a
 * quelque chose dedans — on ne cache jamais une donnée déjà saisie.
 */
function Section({
  title,
  hint,
  rempli,
  children,
}: {
  title: string;
  /* Le lexique ne garantit pas la précision : trois blocs — méthode,
     réalisations, horaires — n'en ont pas encore. */
  hint?: string;
  /** Nombre d'entrées renseignées, affiché sur le pli. */
  rempli: number;
  children: React.ReactNode;
}) {
  const [ouvert, setOuvert] = useState(rempli > 0);
  return (
    <div className="rounded-xl border border-zinc-800">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        className="flex w-full items-center gap-3 px-3 py-3 text-left"
      >
        <ChevronDown
          size={16}
          className={`shrink-0 text-zinc-500 transition-transform ${ouvert ? "" : "-rotate-90"}`}
        />
        <span className="min-w-0 flex-1">
          <span className={`${labelCls} block`}>{title}</span>
          {!ouvert && <span className="mt-0.5 block truncate text-xs text-zinc-500">{hint}</span>}
        </span>
        <span className="shrink-0 text-xs text-zinc-500">
          {rempli > 0 ? `${rempli} renseigné${rempli > 1 ? "s" : ""}` : "facultatif"}
        </span>
      </button>
      {ouvert && (
        <div className="space-y-2 px-3 pb-3">
          <p className="text-xs text-zinc-500">{hint}</p>
          {children}
        </div>
      )}
    </div>
  );
}

export function ThemeBlocks({
  templateId,
  sector,
  profile,
  onChange,
}: {
  templateId: string | undefined;
  /** Le métier choisi à l'étape 1 : il donne son vocabulaire à chaque bloc. */
  sector: string | undefined;
  profile: BusinessProfile;
  onChange: (next: BusinessProfile) => void;
}) {
  const blocks = blocksForTheme(templateId);
  const say = (b: ContentBlock) => copyFor(sector, b);
  const has = (b: ContentBlock) => blocks.includes(b);
  const patch = (p: Partial<BusinessProfile>) => onChange({ ...profile, ...p });

  const reviews = profile.reputation?.featuredReviews ?? [];
  const stats = profile.keyStats ?? [];
  const certs = profile.certifications ?? [];
  const faq = profile.faq ?? [];
  const team = profile.team ?? [];

  // Rien à demander : le thème n'affiche que le socle, déjà couvert ailleurs.
  if (blocks.length <= 1) return null;

  return (
    <div className="space-y-3">
      {has("avis") && (
        <Section
          rempli={reviews.filter((r) => r.text?.trim()).length}
          title={say("avis").label!}
          hint={`${say("avis").hint} Laissez vide si vous n'en avez pas encore : le thème gardera ses exemples et nous vous le rappellerons.`}
        >
          {/* Coller d'abord, corriger ensuite : personne ne retape quarante avis. */}
          <div className="mb-3">
            <CollerDesAvis
              onAjouter={(lus) =>
                patch({
                  reputation: {
                    ...(profile.reputation ?? {}),
                    featuredReviews: [...reviews.filter((r) => r.text?.trim()), ...lus],
                  },
                })
              }
            />
          </div>
          <Repeater
            rows={reviews}
            empty={{ author: "", text: "", rating: 5, source: "" }}
            onChange={(next) =>
              patch({ reputation: { ...(profile.reputation ?? {}), featuredReviews: next } })
            }
            addLabel="Ajouter un avis"
            render={(r, set) => (
              <>
                <input
                  className={input}
                  value={r.text}
                  onChange={(e) => set({ text: e.target.value })}
                  placeholder={say("avis").ph?.text}
                />
                <div className="flex gap-2">
                  <input
                    className={`${input} flex-1 min-w-0`}
                    value={r.author}
                    onChange={(e) => set({ author: e.target.value })}
                    placeholder={say("avis").ph?.author}
                  />
                  <input
                    className={`${input} w-44 shrink-0`}
                    value={r.source ?? ""}
                    onChange={(e) => set({ source: e.target.value })}
                    placeholder={say("avis").ph?.source}
                  />
                </div>
              </>
            )}
          />
        </Section>
      )}

      {has("chiffres") && (
        <Section
          rempli={stats.filter((x) => x.value?.trim()).length}
          title={say("chiffres").label!}
          hint={say("chiffres").hint!}
        >
          <Repeater
            rows={stats}
            empty={{ value: "", label: "" }}
            onChange={(next) => patch({ keyStats: next })}
            addLabel="Ajouter un chiffre"
            max={4}
            render={(s, set) => (
              <div className="flex gap-2">
                <input
                  className={`${input} w-32 shrink-0`}
                  value={s.value}
                  onChange={(e) => set({ value: e.target.value })}
                  placeholder={say("chiffres").ph?.value}
                />
                <input
                  className={`${input} flex-1 min-w-0`}
                  value={s.label}
                  onChange={(e) => set({ label: e.target.value })}
                  placeholder={say("chiffres").ph?.label}
                />
              </div>
            )}
          />
        </Section>
      )}

      {has("engagements") && (
        <Section
          rempli={certs.filter(Boolean).length}
          title={say("engagements").label!}
          hint={say("engagements").hint!}
        >
          <Repeater
            rows={certs.map((c) => ({ v: c }))}
            empty={{ v: "" }}
            onChange={(next) => patch({ certifications: next.map((n) => n.v).filter(Boolean) })}
            addLabel="Ajouter une garantie"
            render={(c, set) => (
              <input
                className={input}
                value={c.v}
                onChange={(e) => set({ v: e.target.value })}
                placeholder={say("engagements").ph?.item}
              />
            )}
          />
        </Section>
      )}

      {has("faq") && (
        <Section
          rempli={faq.filter((f) => f.q?.trim()).length}
          title={say("faq").label!}
          hint={say("faq").hint!}
        >
          <Repeater
            rows={faq}
            empty={{ q: "", a: "" }}
            onChange={(next) => patch({ faq: next })}
            addLabel="Ajouter une question"
            render={(f, set) => (
              <>
                <input
                  className={input}
                  value={f.q}
                  onChange={(e) => set({ q: e.target.value })}
                  placeholder={say("faq").ph?.q}
                />
                <input
                  className={input}
                  value={f.a}
                  onChange={(e) => set({ a: e.target.value })}
                  placeholder={say("faq").ph?.a}
                />
              </>
            )}
          />
        </Section>
      )}

      {has("equipe") && (
        <Section
          rempli={team.filter((m) => m.name?.trim()).length}
          title={say("equipe").label!}
          hint={say("equipe").hint!}
        >
          <Repeater
            rows={team}
            empty={{ name: "", role: "" }}
            onChange={(next) => patch({ team: next })}
            addLabel="Ajouter une personne"
            render={(m, set) => (
              <div className="flex gap-2">
                <input
                  className={`${input} flex-1 min-w-0`}
                  value={m.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder={say("equipe").ph?.name}
                />
                <input
                  className={`${input} flex-1 min-w-0`}
                  value={m.role}
                  onChange={(e) => set({ role: e.target.value })}
                  placeholder={say("equipe").ph?.role}
                />
              </div>
            )}
          />
        </Section>
      )}

      {has("zones") && (
        <Section
          rempli={(profile.geo?.serviceAreas ?? []).length}
          title={say("zones").label!}
          hint={say("zones").hint!}
        >
          <input
            className={`${input} w-full`}
            value={profile.geo?.serviceAreas?.join(", ") ?? ""}
            onChange={(e) =>
              patch({
                geo: {
                  ...(profile.geo ?? {}),
                  serviceAreas: e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean),
                },
              })
            }
            placeholder={say("zones").ph?.areas}
          />
        </Section>
      )}

      {/*
         Les horaires et les réalisations : deux blocs que soixante-dix et cent
         trente et un thèmes affichent, et que le formulaire ne demandait pas.
         Leurs sections restaient donc sur l'exemple du thème quoi que fasse le
         client — mesuré sur le parcours réel.
      */}
      {has("horaires") && (
        <Section
          rempli={(profile.openingHours ?? []).filter((h) => h.day?.trim()).length}
          title={say("horaires").label!}
          hint={say("horaires").hint}
        >
          <Repeater
            rows={profile.openingHours ?? []}
            empty={{ day: "", open: "", close: "" }}
            onChange={(next) => patch({ openingHours: next })}
            addLabel="Ajouter un horaire"
            render={(h, set) => (
              <>
                <input
                  className={input}
                  value={h.day ?? ""}
                  onChange={(e) => set({ day: e.target.value })}
                  placeholder={say("horaires").ph?.day}
                />
                <input
                  className={input}
                  value={h.open ?? ""}
                  onChange={(e) => set({ open: e.target.value })}
                  placeholder={say("horaires").ph?.hours}
                />
              </>
            )}
          />
        </Section>
      )}

      {/*
         La méthode : cent quarante-neuf thèmes affichent « comment ça se
         passe » et aucun ne pouvait le remplir. La section gardait donc les
         étapes d'une agence web sur le site d'un couvreur.
      */}
      {has("methode") && (
        <Section
          rempli={(profile.methode ?? []).filter((e) => e.name?.trim()).length}
          title={say("methode").label!}
          hint={say("methode").hint}
        >
          <Repeater
            rows={profile.methode ?? []}
            empty={{ name: "", desc: "" }}
            onChange={(next) => patch({ methode: next })}
            addLabel="Ajouter une étape"
            render={(e, set) => (
              <>
                <input
                  className={input}
                  value={e.name ?? ""}
                  onChange={(x) => set({ name: x.target.value })}
                  placeholder={say("methode").ph?.name}
                />
                <input
                  className={input}
                  value={e.desc ?? ""}
                  onChange={(x) => set({ desc: x.target.value })}
                  placeholder={say("methode").ph?.desc}
                />
              </>
            )}
          />
        </Section>
      )}

      {has("realisations") && (
        <Section
          rempli={(profile.beforeAfter ?? []).filter((r) => r.caption?.trim()).length}
          title={say("realisations").label!}
          hint={say("realisations").hint}
        >
          <Repeater
            rows={profile.beforeAfter ?? []}
            empty={{ beforeUrl: "", afterUrl: "", caption: "" }}
            onChange={(next) => patch({ beforeAfter: next })}
            addLabel="Ajouter une réalisation"
            render={(r, set) => (
              <input
                className={`${input} w-full`}
                value={r.caption ?? ""}
                onChange={(e) => set({ caption: e.target.value })}
                placeholder={say("realisations").ph?.caption}
              />
            )}
          />
        </Section>
      )}
    </div>
  );
}
