import { put, list } from "@vercel/blob";

// Wizard funnel analytics: one lightweight blob per visitor, updated on every
// step so the final blob state = the furthest step the visitor reached. This
// lets us see exactly where prospects drop off (even when they never finish),
// without storing any PII (no email/name — just a random client id + step).

export interface FunnelEvent {
  funnelId: string;
  maxStep: number;
  totalSteps: number;
  businessType?: string;
  completed: boolean; // reached the final "generate" action
  firstSeen: string; // ISO
  lastSeen: string; // ISO
}

const PREFIX = "funnel/";

export async function recordFunnelStep(input: {
  funnelId: string;
  step: number;
  totalSteps: number;
  businessType?: string;
  completed?: boolean;
}): Promise<void> {
  const now = new Date().toISOString();

  // Read-modify-write so we keep the MAX step reached + the first-seen time.
  let existing: FunnelEvent | null = null;
  try {
    const { blobs } = await list({ prefix: `${PREFIX}${input.funnelId}.json` });
    if (blobs.length) {
      const res = await fetch(blobs[0].url);
      if (res.ok) existing = (await res.json()) as FunnelEvent;
    }
  } catch {
    // ignore — first write or transient read failure
  }

  const data: FunnelEvent = {
    funnelId: input.funnelId,
    maxStep: Math.max(existing?.maxStep ?? 0, input.step),
    totalSteps: input.totalSteps || existing?.totalSteps || 0,
    businessType: input.businessType || existing?.businessType,
    completed: (existing?.completed ?? false) || !!input.completed,
    firstSeen: existing?.firstSeen ?? now,
    lastSeen: now,
  };

  await put(`${PREFIX}${input.funnelId}.json`, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    allowOverwrite: true,
  });
}

export interface FunnelStats {
  visitors: number;
  completed: number;
  completionRate: number;
  byStep: Record<number, number>; // visitors whose furthest step === N (where they stopped)
  reachedStep: Record<number, number>; // visitors who reached AT LEAST step N
  byBusinessType: Record<string, number>;
}

export async function getFunnelStats(): Promise<FunnelStats> {
  const { blobs } = await list({ prefix: PREFIX });
  const events: FunnelEvent[] = [];
  for (const b of blobs) {
    try {
      const r = await fetch(b.url);
      if (r.ok) events.push((await r.json()) as FunnelEvent);
    } catch {
      // skip unreadable blob
    }
  }

  const byStep: Record<number, number> = {};
  const reachedStep: Record<number, number> = {};
  const byBusinessType: Record<string, number> = {};
  let completed = 0;

  for (const e of events) {
    byStep[e.maxStep] = (byStep[e.maxStep] ?? 0) + 1;
    for (let s = 1; s <= e.maxStep; s++) {
      reachedStep[s] = (reachedStep[s] ?? 0) + 1;
    }
    if (e.businessType) {
      byBusinessType[e.businessType] = (byBusinessType[e.businessType] ?? 0) + 1;
    }
    if (e.completed) completed++;
  }

  return {
    visitors: events.length,
    completed,
    completionRate: events.length ? completed / events.length : 0,
    byStep,
    reachedStep,
    byBusinessType,
  };
}
