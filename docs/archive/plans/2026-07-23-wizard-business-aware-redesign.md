# Wizard Business-Aware Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Launch wizard capture real business data (services+prices, team, catalogue, legal info) and make templates actually render it, so a generated preview needs near-zero manual retouching before sale — starting with 4 pilot niches (beauté, restaurant, immobilier, santé).

**Architecture:** Two-layer fix. (1) A new `businessProfile` field on the session schema, filled via a dynamic niche-conditional wizard step + debounced auto-save (endpoint already exists). (2) A shared `resolveList()` injection helper that templates call instead of mutating hardcoded const arrays by index — falls back to demo content when a field is absent, so untouched templates keep working. Pilot niches wire the pattern end-to-end; other niches repeat the same recipe later.

**Tech Stack:** Next.js 16 App Router, TypeScript, Vercel Blob (session persistence), existing `/api/sessions` PATCH endpoint, Playwright/pdf-lib unaffected.

**Design reference:** `WIZARD_DESIGN.local.md` (repo root, gitignored) — full schema, 12 archetypes, all 315-template audit findings, UX funnel decisions. This plan implements Milestone 2 (pilot niches) of that design; read it first for the "why" behind every field below.

---

## Milestone 0 — Shared data model & injection infrastructure

Foundation every other milestone depends on. No niche-specific work yet.

### Task 0.1: Extend the session schema with `businessProfile`

**Files:**
- Modify: `lib/sessions.ts:1-47`

**Step 1: Add the new interfaces**

Add after the existing `FormData` interface (line 32), before `GeneratedContent`:

```ts
// ─── Business Profile — real, structured client data (not AI-invented) ─────
// Filled progressively by the niche-aware wizard steps (Phase 1-2). Optional
// on the type because legacy sessions and non-pilot niches won't have it —
// every consumer must fall back to demo/generic content when a field is
// absent (see lib/templates/resolveList.ts).
export interface BusinessCore {
  niche?: string;                    // sectors.ts niche id, drives archetype
  foundedYear?: number;
  contacts?: {
    general?: { email?: string; phone?: string };
    booking?: { email?: string; phone?: string };
  };
  openingHours?: { day: string; open?: string; close?: string; closed?: boolean }[];
  paymentMethods?: string[];
  bookingSystem?: { provider?: string; url?: string };
  emergency?: { enabled: boolean; phone?: string; note?: string };
  geo?: {
    address?: string;
    primaryCity?: string;
    serviceAreas?: string[];
    radiusKm?: number;
  };
  reputation?: {
    sources?: { platform: string; url: string; rating?: number; reviewCount?: number }[];
    featuredReviews?: { author: string; text: string; rating: number; source?: string }[];
  };
  keyStats?: { value: string; label: string }[];
  certifications?: string[];
  faq?: { q: string; a: string }[];
  hasQuoteRequest?: boolean;
  chatWidget?: { interested: boolean };
}

export interface Catalogues {
  services?: { name: string; price?: string; duration?: string; description?: string }[];
  products?: { name: string; price?: string; description?: string; photoUrl?: string }[];
  menu?: { category: string; name: string; price?: string; description?: string }[];
  listings?: { title: string; price?: string; surface?: string; rooms?: string; status?: string; photoUrl?: string; city?: string }[];
  team?: { name: string; role: string; photoUrl?: string; bio?: string; specialty?: string; credentials?: string }[];
  beforeAfter?: { beforeUrl: string; afterUrl: string; caption?: string }[];
  commerce?: { mode: "showcase" | "external" | "stripe"; storeUrl?: string };
}

export interface LegalProfile {
  legalForm?: string;
  siret?: string;
  companyAddress?: string;
  capitalSocial?: string;
}

export interface BusinessProfile extends BusinessCore, Catalogues {
  legal?: LegalProfile;
}
```

**Step 2: Wire it onto `SessionData`**

In `SessionData` (line 49-59), add:

```ts
export interface SessionData {
  id: string;
  formData: FormData;
  businessProfile?: BusinessProfile;   // ← new
  generatedContent?: GeneratedContent;
  createdAt: Date;
  accountId?: string;
}
```

**Step 3: Verify — zero regressions**

```bash
git stash push -- lib/sessions.ts
npx tsc --noEmit 2>&1 | grep "lib/sessions.ts" | wc -l   # note BEFORE count
git stash pop
npx tsc --noEmit 2>&1 | grep "lib/sessions.ts" | wc -l   # must equal BEFORE
```

**Step 4: Commit**

```bash
git add lib/sessions.ts
git commit -m "feat(wizard): add BusinessProfile schema to session data"
```

---

### Task 0.2: Build the `resolveList` injection helper

This replaces the fragile `_photoArrays` / `typeof SERVICES !== 'undefined'` mutation pattern found in `app/templates/impact-92/page.tsx:207-284` — see `WIZARD_DESIGN.local.md` § "CAUSE RACINE" for why the current mechanism only ever fills 3 titles and never prices, teams, listings, FAQ, etc.

**Files:**
- Create: `lib/templates/resolveList.ts`
- Test: `lib/templates/resolveList.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { resolveList } from "./resolveList";

describe("resolveList", () => {
  const demo = [
    { title: "Demo Service A", price: "0€" },
    { title: "Demo Service B", price: "0€" },
  ];

  it("returns demo data when real data is undefined", () => {
    expect(resolveList(undefined, demo)).toBe(demo);
  });

  it("returns demo data when real data is an empty array", () => {
    expect(resolveList([], demo)).toBe(demo);
  });

  it("returns real data unchanged when present", () => {
    const real = [{ name: "Vraie prestation", price: "45€" }];
    expect(resolveList(real, demo)).toBe(real);
  });
});
```

**Step 2: Run test, verify it fails**

Run: `npx vitest run lib/templates/resolveList.test.ts`
Expected: FAIL — `resolveList` not defined / module not found.

**Step 3: Write minimal implementation**

```ts
// Single contract every template uses to read business data instead of
// mutating hardcoded const arrays by index. Returns the real array when the
// client provided one (non-empty), otherwise the template's own demo data —
// so untouched templates keep rendering exactly as before.
export function resolveList<T>(real: T[] | undefined, demo: T[]): T[] {
  return real && real.length > 0 ? real : demo;
}
```

**Step 4: Run test, verify it passes**

Run: `npx vitest run lib/templates/resolveList.test.ts`
Expected: PASS, 3/3.

**Step 5: Commit**

```bash
git add lib/templates/resolveList.ts lib/templates/resolveList.test.ts
git commit -m "feat(wizard): add resolveList template injection helper"
```

---

## Milestone 1 — Wizard auto-save wiring

**Discovery: no new endpoint needed.** `app/api/sessions/route.ts:80-116` already has a `PATCH` handler that merges partial `formData`/`generatedContent` updates into an existing session. It just needs a `businessProfile` branch and the wizard needs to call it.

### Task 1.1: Extend PATCH to accept `businessProfile`

**Files:**
- Modify: `app/api/sessions/route.ts:80-116`

**Step 1: Write the failing test**

Create `app/api/sessions/route.test.ts` (or extend if one exists — check first):

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
// mock lib/sessions saveSessionToBlob/getSessionFromBlob per existing test conventions in this repo
```

(Follow whatever mocking pattern the repo already uses for other `/api/*` route tests — check `app/api/checkout/route.test.ts` if one exists before inventing a new pattern.)

Core assertion: PATCH with `{ businessProfile: { services: [...] } }` on an existing session merges into `session.businessProfile.services` without clobbering `session.businessProfile.team` set by a previous PATCH call.

**Step 2: Run, verify fails** (businessProfile ignored today — merge silently drops it).

**Step 3: Implement**

In `app/api/sessions/route.ts`, update the PATCH body type and merge logic:

```ts
const body = await req.json() as {
  generatedContent?: Partial<GeneratedContent>;
  formData?: Partial<FormData>;
  businessProfile?: Partial<BusinessProfile>;   // ← new
};

const updated = {
  ...session,
  ...(body.formData && { formData: { ...session.formData, ...body.formData } as FormData }),
  ...(body.businessProfile && {
    businessProfile: { ...session.businessProfile, ...body.businessProfile } as BusinessProfile,
  }),
  ...(body.generatedContent && {
    generatedContent: { ...session.generatedContent, ...body.generatedContent } as GeneratedContent,
  }),
} satisfies SessionData;
```

Note: this is a shallow merge — a PATCH with `businessProfile.services` replaces the whole `services` array, doesn't merge item-by-item. That's correct: each wizard step owns a distinct top-level key (`services`, `team`, `openingHours`...), never partial-updates within the same key from two different steps.

Add `BusinessProfile` to the import from `@/lib/sessions`.

**Step 4: Run test, verify passes.**

**Step 5: Commit**

```bash
git add app/api/sessions/route.ts app/api/sessions/route.test.ts
git commit -m "feat(wizard): accept businessProfile in session PATCH"
```

---

### Task 1.2: Debounced auto-save hook in the wizard

**Files:**
- Create: `components/wizard/useAutoSaveStep.ts`
- Modify: `components/StepForm.tsx` (wire the hook — exact insertion point in Task 2.x once the new steps exist)

**Step 1: Write the hook**

```ts
import { useEffect, useRef } from "react";

// Fires a debounced PATCH to /api/sessions whenever `data` changes, so a
// client who abandons mid-wizard still has their progress captured for a
// commercial follow-up. Silent — no loading spinner, no user-facing failure
// state (best-effort, matches the rest of this codebase's non-fatal pattern
// for background persistence).
export function useAutoSaveStep(sessionId: string | null, key: "formData" | "businessProfile", data: unknown) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sessionId || !data) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetch(`/api/sessions?id=${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: data }),
      }).catch((err) => console.error("[wizard] auto-save failed", err));
    }, 800);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [sessionId, key, data]);
}
```

**Step 2: No unit test for this one** — it's a thin debounce wrapper around `fetch`, already covered by Task 1.1's endpoint test. Verify manually in Task 2.x once wired (Chrome DevTools MCP: fill a step, wait 1s, confirm network PATCH fires).

**Step 3: Commit**

```bash
git add components/wizard/useAutoSaveStep.ts
git commit -m "feat(wizard): add debounced auto-save hook"
```

---

## Milestone 2 — Niche archetype config engine

### Task 2.1: Define the archetype registry

**Files:**
- Create: `lib/wizard/archetypes.ts`

**Step 1: Write the config**

```ts
// Which BusinessCore/Catalogues fields each niche archetype's wizard step
// asks for. Drives which fields render in Phase 2 of the funnel — see
// WIZARD_DESIGN.local.md § "12 archétypes (A-L)" for the full audit this
// table is derived from. Pilot = the 4 niches wired end-to-end first.
export type ArchetypeId =
  | "service_rdv" | "food" | "produits" | "portfolio_projets"
  | "expertise_b2b" | "immobilier" | "hotellerie" | "domicile";

export interface ArchetypeConfig {
  id: ArchetypeId;
  catalogueFields: Array<keyof import("@/lib/sessions").Catalogues>;
  coreFields: Array<keyof import("@/lib/sessions").BusinessCore>;
}

export const ARCHETYPES: Record<ArchetypeId, ArchetypeConfig> = {
  service_rdv: {
    id: "service_rdv",
    catalogueFields: ["services", "team", "beforeAfter"],
    coreFields: ["bookingSystem", "openingHours", "reputation", "certifications"],
  },
  food: {
    id: "food",
    catalogueFields: ["menu"],
    coreFields: ["openingHours", "bookingSystem", "reputation"],
  },
  produits: {
    id: "produits",
    catalogueFields: ["products", "commerce"],
    coreFields: ["reputation"],
  },
  immobilier: {
    id: "immobilier",
    catalogueFields: ["listings", "team"],
    coreFields: ["geo", "keyStats", "faq"],
  },
  // portfolio_projets, expertise_b2b, hotellerie, domicile:
  // same shape, filled when those niches move from design to implementation
  // (see WIZARD_DESIGN.local.md table — not pilot niches, stub only).
  portfolio_projets: { id: "portfolio_projets", catalogueFields: ["services"], coreFields: ["certifications", "geo"] },
  expertise_b2b:      { id: "expertise_b2b",      catalogueFields: ["services"], coreFields: ["keyStats", "faq"] },
  hotellerie:         { id: "hotellerie",         catalogueFields: ["services"], coreFields: ["openingHours", "bookingSystem"] },
  domicile:           { id: "domicile",           catalogueFields: ["services"], coreFields: ["geo", "faq"] },
};

// Pilot niche id (sectors.ts) → archetype. Extend this map as more niches
// move from design to implementation.
export const NICHE_ARCHETYPE: Record<string, ArchetypeId> = {
  institut_beaute: "service_rdv",
  coiffeur: "service_rdv",
  restaurant: "food",
  agent_immobilier: "immobilier",
  medecin: "service_rdv",
  dentiste: "service_rdv",
};
```

**Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep "lib/wizard/archetypes.ts"
```
Expected: no output.

**Step 3: Commit**

```bash
git add lib/wizard/archetypes.ts
git commit -m "feat(wizard): add niche archetype registry"
```

---

## Milestone 3 — Pilot niche: Beauté / Institut (reference implementation)

This is the fully-detailed vertical slice. Milestone 4 repeats this exact recipe for Restaurant, Immobilier, Santé — do not re-derive the pattern, copy it.

### Task 3.1: Add the "Cœur métier" wizard step for `service_rdv` archetype

**Files:**
- Create: `components/wizard/steps/ServiceRdvStep.tsx`
- Modify: `components/StepForm.tsx` — insert as new step 4 (renumber existing step 4 "Votre offre" generic block to step 4a fallback for non-pilot niches, new step 4b for pilot niches gated on `NICHE_ARCHETYPE[form.sector] === "service_rdv"`)

**Step 1: Write the component**

Fields: repeatable `services[]` (name/price/duration/description), repeatable `team[]` (name/role/photo), `bookingSystem.provider` (select: Planity/Doctolib/Calendly/Autre) + `bookingSystem.url`, `openingHours[]` (7-row day grid), `reputation.sources[]` (platform + url + rating + reviewCount, optional pre-fill note: "si tu as ton lien Planity/Google, ajoute-le, sinon laisse vide").

Use the same repeatable-row UI pattern already in `app/onboarding/page.tsx:340-362` (`addService`/`removeService` — grep that file for the exact JSX before writing this, so the new component matches existing styling instead of inventing a new one).

**Step 2: Wire into StepForm**

In `components/StepForm.tsx`, import `NICHE_ARCHETYPE` from `lib/wizard/archetypes` and `ServiceRdvStep`. At the step-4 render branch (`step === 4 &&`, line 706), branch:

```tsx
{step === 4 && (
  NICHE_ARCHETYPE[form.sector] === "service_rdv"
    ? <ServiceRdvStep value={form.businessProfile} onChange={(bp) => set("businessProfile", bp)} />
    : /* existing generic "Votre offre" block, unchanged */
)}
```

(`form.businessProfile` needs adding to the `FormState` local type in `StepForm.tsx` — check the existing `FormState` shape near line 222 first and extend it there, same pattern as `template`/`sector`.)

**Step 3: Wire auto-save**

Inside `ServiceRdvStep`, call `useAutoSaveStep(sessionId, "businessProfile", value)` from Task 1.2. `sessionId` needs to exist before step 4 — confirm the wizard already creates the session at step 1 or 2 (check `StepForm.tsx` for the existing `/api/sessions` POST call timing) rather than only at final submit; if it currently only POSTs at the end, add an early POST at step 1 completion so there's an id to auto-save against.

**Step 4: Manual verification**

Run dev server, walk through wizard picking `institut_beaute`, fill 2 services + 1 team member, wait 1s, confirm (Chrome DevTools MCP `list_network_requests`) a PATCH to `/api/sessions?id=...` fired with the data.

**Step 5: Commit**

```bash
git add components/wizard/steps/ServiceRdvStep.tsx components/StepForm.tsx
git commit -m "feat(wizard): add service_rdv archetype step (beauté pilot)"
```

---

### Task 3.2: Map & wire injection for the beauté template family

**Files:**
- Read first (mapping, not yet fully done): every template id in `sectors.ts`'s `institut_beaute` + `coiffeur` arrays — `impact-84, 85, 86, 88, 95, 148, 191, 192, 198, 210, 229, 180, 209`.
- Modify: each of those `app/templates/impact-N/page.tsx`.

**Step 1: For each template, document the section→field mapping**

Reuse the method from this session's design phase: `grep -noiE` the section comment headers, read the const arrays feeding each section. Record in a comment block at the top of each file (or in a scratch table first, developer's choice) before touching JSX — this catches intra-niche variation the design doc flagged as the residual risk.

Reference mapping already done for `impact-84` (see `WIZARD_DESIGN.local.md` § "MAPPING template→champ"):
- PROTOCOLES section → `businessProfile.services`
- TÉMOIGNAGES → `businessProfile.reputation.featuredReviews`
- MÉDECINS section → `businessProfile.team`
- RDV CTA → `businessProfile.bookingSystem`

**Step 2: Replace the mutation pattern with `resolveList`**

Example for `impact-84`'s services section — find the existing `const SERVICES = [...]` (demo array) and the render loop. Change to:

```tsx
import { resolveList } from "@/lib/templates/resolveList";
// ...
const services = resolveList(fd?.businessProfile?.services, SERVICES);
// render `services.map(...)` instead of `SERVICES.map(...)`
```

Same pattern per section: `resolveList(fd?.businessProfile?.team, TEAM_DEMO)`, `resolveList(fd?.businessProfile?.reputation?.featuredReviews, TESTIMONIALS_DEMO)`.

Delete the old `useEffect` mutation block (the `services_arrays`/`testimonials_arrays` `typeof X !== 'undefined'` pattern) once `resolveList` replaces it — it becomes dead code.

**Step 3: Verify per template (zero tsc regressions, matches this session's established method)**

```bash
git stash push -- app/templates/impact-84/page.tsx
BEFORE=$(npx tsc --noEmit 2>&1 | grep "impact-84/page.tsx" | wc -l)
git stash pop
AFTER=$(npx tsc --noEmit 2>&1 | grep "impact-84/page.tsx" | wc -l)
echo "BEFORE=$BEFORE AFTER=$AFTER"   # must be equal
```

**Step 4: Visual verification on at least impact-84**

Chrome DevTools MCP: load `/templates/impact-84?session=<test-session-with-real-services>`, screenshot, confirm real service names/prices render (not demo copy), confirm untouched-session fallback (`?session=<empty>`) still shows original demo content unchanged.

**Step 5: Commit per template (or batched if mechanical)**

```bash
git add app/templates/impact-84/page.tsx
git commit -m "feat(templates): wire businessProfile injection into impact-84 (institut beauté)"
```
Repeat for the remaining 12 templates in the beauté/coiffeur family.

---

### Task 3.3: Legal profile step + document generation

**Files:**
- Create: `components/wizard/steps/LegalStep.tsx` (SIRET, legalForm, companyAddress, capitalSocial — simple form, not archetype-conditional, shown to every niche as the last wizard phase)
- Create: `lib/legal/generateLegalPages.ts`
- Modify: `app/api/webhook/route.ts` (call legal doc generation alongside existing preview generation, same place `generatedContent` gets built — see `webhook/route.ts:581-627`)

**Step 1: Write the legal step** — 4 fields, gated on nothing (every business needs these), inserted as the wizard's final phase before submit.

**Step 2: Write `generateLegalPages`**

```ts
import type { BusinessProfile, FormData } from "@/lib/sessions";

export interface LegalPages {
  mentionsLegales: string;
  cgv: string;
  confidentialite: string;
  cgu: string;
}

// Template-string generation from captured legal data — no AI call needed,
// these are boilerplate legal structures with fields substituted in. Mirrors
// the hand-written maison-maria legal pages already shipped
// (app/maison-maria/legal/*) — read those first for tone/structure before
// writing the generic templates so output style stays consistent site-wide.
export function generateLegalPages(fd: FormData, legal: BusinessProfile["legal"]): LegalPages {
  // ... string templates, fields substituted: fd.businessName, legal.siret,
  // legal.companyAddress, legal.legalForm, legal.capitalSocial, fd.email
}
```

**Step 3: Test** — snapshot test confirming all 4 legal fields (siret, address, legalForm, capitalSocial) appear verbatim in the relevant generated page, and that a missing optional field (e.g. no `capitalSocial` for an auto-entreprise) omits that clause instead of rendering "undefined".

**Step 4: Wire into webhook** — where `generatedContent` is built (`app/api/webhook/route.ts` around line 620), also call `generateLegalPages` and persist the 4 strings onto the session (extend `SessionData` with `legalPages?: LegalPages` in Task 0.1's file while there, or a follow-up small task).

**Step 5: Render** — new dynamic route `app/templates/[template]/legal/[page]/page.tsx` or per-template `legal/` subdirectory matching the pattern already used by `app/maison-maria/legal/*`. Confirm with a quick grep of an existing `fullsite`-classified template's `legal/` folder structure before choosing the exact route shape (reuse, don't invent a second convention).

**Step 6: Commit**

```bash
git add components/wizard/steps/LegalStep.tsx lib/legal/generateLegalPages.ts lib/legal/generateLegalPages.test.ts app/api/webhook/route.ts
git commit -m "feat(wizard): generate legal pages from captured SIRET/address data"
```

---

## Milestone 4 — Repeat for Restaurant, Immobilier, Santé

Same 3-task recipe as Milestone 3, per niche. Do not restart design — pull field lists directly from `WIZARD_DESIGN.local.md`.

- **Restaurant** (archetype `food`): new `components/wizard/steps/FoodStep.tsx` (menu[] grouped by category, openingHours, bookingSystem provider=TheFork). Template family: `impact-04, 99, 189, 211, 126, 74, 201` (+ `restauration_rapide` family if in scope). Mapping reference already done for `impact-04` in design doc.
- **Immobilier** (archetype `immobilier`): `ImmobilierStep.tsx` (listings[], team=agents, geo.serviceAreas). Family: `impact-82, 92, 128, 167, 222, 241, 67`. Mapping reference: `impact-92` already done in design doc (STATS→keyStats, LISTINGS→listings, GLOBAL section→serviceAreas, FAQ→faq).
- **Santé** (archetype `service_rdv`, reuse — team gets `specialty`/`credentials` fields populated, `emergency` core field activated): `SanteStep.tsx` extends `ServiceRdvStep` fields with practitioner specialty/credentials + `emergency.enabled`. Family: `impact-243, 257, 274, 285, 297, 226, 171, 231` (médecin) + dentiste/kine/osteo families.

Each niche: Task X.1 (wizard step) → Task X.2 (template family mapping + `resolveList` wiring, per-template tsc verification) → reuse Milestone 3's `LegalStep`/`generateLegalPages` unchanged (legal is niche-agnostic already).

---

## Verification (full pilot, all 4 niches)

1. For each pilot niche: run wizard end-to-end with realistic test data (use maison-maria's real Planity services as the beauté test fixture — it's the concrete case that started this project).
2. Confirm auto-save: abandon wizard at step 4, reload with the session id, confirm data persisted.
3. Confirm preview: generated site shows real services/team/reviews, not demo/AI-invented content.
4. Confirm legal pages: `/legal/mentions-legales` etc. render with real SIRET/address.
5. Confirm untouched templates (non-pilot niches, or pilot niche session with empty `businessProfile`) render identically to before — `resolveList` fallback path.
6. Full `npx tsc --noEmit` diff (stash/pop method) across every touched file — zero new errors.
7. Regression: existing maison-maria site + ebook flow untouched (different code path, but re-confirm nothing in `lib/sessions.ts`/`app/api/sessions/route.ts` broke it).

### Critical files (all milestones)
- `lib/sessions.ts` — schema
- `lib/templates/resolveList.ts` — injection contract
- `app/api/sessions/route.ts` — auto-save endpoint
- `lib/wizard/archetypes.ts` — niche→archetype config
- `components/StepForm.tsx` — funnel orchestration
- `components/wizard/steps/*.tsx` — per-archetype step UI
- `app/templates/impact-{84,85,86,88,95,148,191,192,198,210,229,180,209}/page.tsx` — beauté pilot templates
- `lib/legal/generateLegalPages.ts` — legal doc generation
- `WIZARD_DESIGN.local.md` — source of truth for every field decision (gitignored, not in this repo's history — keep local)
