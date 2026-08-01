import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// This endpoint is intentionally unauthenticated — the wizard uploads the
// client's logo/photos before any account exists. A per-IP rate limiter is the
// backstop against abuse (using the public Blob store as free file hosting or
// filling it). In-memory + per-instance, so it only catches naive bursts on a
// warm lambda; pair with a WAF/edge limit for a hard guarantee.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 20) return true;
  entry.count += 1;
  return false;
}

// Extension is derived from the (validated) MIME type, never from the
// user-supplied filename — a "logo.html" named image/png must not be stored
// with an .html extension the Blob CDN could serve as text/html.
const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many uploads. Try again in a minute." }, { status: 429 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
  const ext = MIME_EXT[file.type];
  if (!ext) return NextResponse.json({ error: "Invalid file type" }, { status: 415 });

  const slug = `brief/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(slug, file, { access: "public", contentType: file.type });
  return NextResponse.json({ url: blob.url });
}
