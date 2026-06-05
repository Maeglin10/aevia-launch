import { NextRequest, NextResponse } from "next/server";
import { recordFunnelStep, getFunnelStats } from "@/lib/funnel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight per-IP rate limiter (the wizard fires one event per step).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 120) return true;
  entry.count += 1;
  return false;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// POST: record a wizard step for a visitor. Open + fire-and-forget; it must
// NEVER block the wizard, so failures return 200.
export async function POST(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  try {
    const body = await req.json();
    const funnelId = String(body.funnelId ?? "").slice(0, 64);
    const step = Number(body.step);
    const totalSteps = Number(body.totalSteps) || 0;
    if (!funnelId || !Number.isFinite(step)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await recordFunnelStep({
      funnelId,
      step,
      totalSteps,
      businessType: typeof body.businessType === "string" ? body.businessType.slice(0, 60) : undefined,
      completed: !!body.completed,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

// GET: aggregated funnel stats. Protected by FUNNEL_ADMIN_TOKEN
// (header x-admin-token or ?token=). Returns 401 if the env var is unset.
export async function GET(req: NextRequest) {
  const token =
    req.headers.get("x-admin-token") ??
    new URL(req.url).searchParams.get("token");
  if (!process.env.FUNNEL_ADMIN_TOKEN || token !== process.env.FUNNEL_ADMIN_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const stats = await getFunnelStats();
  return NextResponse.json(stats);
}
