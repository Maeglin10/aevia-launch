import { NextRequest, NextResponse } from "next/server";
import { saveSession, saveSessionToBlob, getSessionFromBlob } from "@/lib/sessions";
import type { GeneratedContent, FormData, SessionData, BusinessProfile } from "@/lib/sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple in-memory rate limiter: max 30 session requests per IP per minute.
//
// Relevable par SESSIONS_RATE_LIMIT, uniquement pour l'audit local des thèmes :
// scripts/theme-audit.mjs consomme trois requêtes par thème, soit plus de mille
// pour balayer le catalogue. À 30 par minute, les thèmes audités après la
// dixième minute paraissaient n'afficher aucune donnée client — c'est la mesure
// qui échouait, pas le câblage, et le diagnostic a failli partir de travers.
// La valeur par défaut reste 30 : la production ne change pas.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const MAX_REQUESTS = Number(process.env.SESSIONS_RATE_LIMIT) || 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const maxRequests = MAX_REQUESTS;
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return false;
  }
  if (entry.count >= maxRequests) return true;
  entry.count += 1;
  return false;
}

export async function GET(req: NextRequest) {
  // Rate limiting — prevent session enumeration or brute force
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const session = await getSessionFromBlob(id);
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Never expose the edit token — returning it would let any reader of a shared
  // preview link steal write access to the session.
  const { editToken: _editToken, ...safe } = session;
  return NextResponse.json(safe);
}

export async function POST(req: NextRequest) {
  // Rate limiting — prevent session spam
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const id = crypto.randomUUID();
  // Secret write capability, returned to the creator only (stored client-side in
  // localStorage). PATCH requires it — see below — so a leaked/shared session id
  // no longer lets a stranger overwrite the site.
  const editToken = crypto.randomUUID();
  const data = { id, formData: body.formData, createdAt: new Date(), editToken };

  // Persist to Blob so the session survives across serverless instances.
  // Without this, /api/generate (next call) lands on a different instance
  // and cannot read the freshly created session.
  try {
    await saveSessionToBlob(id, data);
  } catch (err) {
    console.error("[sessions POST] Blob save failed, falling back to in-memory:", err);
    saveSession(id, data);
  }

  return NextResponse.json({ sessionId: id, editToken });
}

// PATCH — update generatedContent and/or formData fields for an existing session.
// Used by the inline editor when the client saves their customizations.
export async function PATCH(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const session = await getSessionFromBlob(id);
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  /*
    Autorisation d'écriture.

    Une session frappée avec un `editToken` ne se modifie qu'en le présentant —
    l'identifiant seul, qui circule dans une URL d'aperçu partagée, ne suffit
    pas.

    Restait le trou : les sessions créées avant l'existence du jeton n'en
    portent aucun et étaient donc modifiables par quiconque avait le lien. On ne
    peut pas les refuser sèchement sans casser un client en train de travailler,
    alors on adopte à la première écriture : la session sans jeton en reçoit un,
    rendu à l'appelant, et toute écriture suivante devra le présenter. Passé
    24 h une session sans jeton n'a plus de propriétaire plausible : elle est
    refusée.
  */
  const presented = req.headers.get("x-edit-token");
  let adopte: string | null = null;

  if (session.editToken) {
    if (presented !== session.editToken) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else {
    const age = Date.now() - new Date(session.createdAt ?? 0).getTime();
    if (!Number.isFinite(age) || age > 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { error: "Session expirée — relancez la personnalisation." },
        { status: 403 },
      );
    }
    adopte = crypto.randomUUID();
  }

  const body = await req.json() as {
    generatedContent?: Partial<GeneratedContent>;
    formData?: Partial<FormData>;
    businessProfile?: Partial<BusinessProfile>;
    sectionOverrides?: Record<string, string>;
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
    /*
      Les retouches de section se cumulent : le client en corrige une, puis une
      autre, sans que la première disparaisse. Une valeur vide efface la
      retouche et rend au thème son texte d'origine.
    */
    ...(body.sectionOverrides && {
      sectionOverrides: Object.fromEntries(
        Object.entries({ ...session.sectionOverrides, ...body.sectionOverrides })
          .filter(([, v]) => typeof v === "string" && v.trim() !== ""),
      ),
    }),
    ...(adopte ? { editToken: adopte } : {}),
  } satisfies SessionData;

  try {
    await saveSessionToBlob(id, updated);
  } catch {
    saveSession(id, updated);
  }

  // Le jeton adopté n'est rendu qu'à l'appelant qui vient de l'obtenir, pour
  // qu'il le range comme le fait POST. Les écritures suivantes l'exigeront.
  return NextResponse.json(adopte ? { ok: true, editToken: adopte } : { ok: true });
}
