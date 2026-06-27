import { NextRequest, NextResponse } from "next/server";
import { saveSession, saveSessionToBlob, getSessionFromBlob } from "@/lib/sessions";
import type { GeneratedContent, FormData } from "@/lib/sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple in-memory rate limiter: max 30 session requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const maxRequests = 30;
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

  return NextResponse.json(session);
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
  const data = { id, formData: body.formData, createdAt: new Date() };

  // Persist to Blob so the session survives across serverless instances.
  // Without this, /api/generate (next call) lands on a different instance
  // and cannot read the freshly created session.
  try {
    await saveSessionToBlob(id, data);
  } catch (err) {
    console.error("[sessions POST] Blob save failed, falling back to in-memory:", err);
    saveSession(id, data);
  }

  return NextResponse.json({ sessionId: id });
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

  const body = await req.json() as {
    generatedContent?: Partial<GeneratedContent>;
    formData?: Partial<FormData>;
  };

  const updated = {
    ...session,
    ...(body.formData && { formData: { ...session.formData, ...body.formData } }),
    ...(body.generatedContent && {
      generatedContent: { ...session.generatedContent, ...body.generatedContent },
    }),
  };

  try {
    await saveSessionToBlob(id, updated);
  } catch {
    saveSession(id, updated);
  }

  return NextResponse.json({ ok: true });
}
