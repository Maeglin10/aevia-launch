"use client";

import { Plus, X } from "lucide-react";
import type { BusinessProfile } from "@/lib/sessions";
import { blocksForTheme, type ContentBlock } from "@/lib/templates/capabilities";
import { copyFor } from "@/lib/wizard/lexicon";

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

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className={labelCls}>{title}</p>
      <p className="text-xs text-zinc-500">{hint}</p>
      {children}
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
    <div className="space-y-6">
      {has("avis") && (
        <Section
          title={say("avis").label!}
          hint={`${say("avis").hint} Laissez vide si vous n'en avez pas encore : le thème gardera ses exemples et nous vous le rappellerons.`}
        >
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
        <Section title={say("chiffres").label!} hint={say("chiffres").hint!}>
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
        <Section title={say("engagements").label!} hint={say("engagements").hint!}>
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
        <Section title={say("faq").label!} hint={say("faq").hint!}>
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
        <Section title={say("equipe").label!} hint={say("equipe").hint!}>
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
        <Section title={say("zones").label!} hint={say("zones").hint!}>
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
    </div>
  );
}
