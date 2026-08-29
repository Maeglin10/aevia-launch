import { NextRequest, NextResponse } from "next/server";
import { saveSession, saveSessionToBlob, getSession, getSessionFromBlob, type FormData, type GeneratedContent } from "@/lib/sessions";
import { contenuDepuisLeClient } from "@/lib/contenuDepuisLeClient";
import { generateWithFreeProviders, extractMenuItems } from "@/lib/llmProviders";
import { generateLegalPages } from "@/lib/legal/generateLegalPages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// First-line in-memory rate limiter: max 5 generate requests per IP per minute.
// NOTE: on serverless this Map is per-instance and cold-start-wiped, so it only
// catches naive bursts hitting the same warm lambda. The real backstop is the
// per-session generation cap below (rides the shared Blob store → distributed).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Hard cap on LLM generations per session, enforced against the persisted
// session (survives cold starts, holds across instances). Stops a single
// visitor — or a script reusing one session — from hammering the LLM path.
const MAX_GENERATIONS_PER_SESSION = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const maxRequests = 5;
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return false;
  }
  if (entry.count >= maxRequests) return true;
  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — protect against AI cost abuse
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

    const body = await req.json() as { formData: FormData; sessionId: string };
    const { formData, sessionId } = body;

    if (!formData || !sessionId) {
      return NextResponse.json({ error: "Missing formData or sessionId" }, { status: 400 });
    }

    // Basic input length guards to prevent prompt injection and runaway tokens
    if (typeof formData.businessName === "string" && formData.businessName.length > 200) {
      return NextResponse.json({ error: "businessName too long" }, { status: 400 });
    }
    if (typeof formData.tagline === "string" && formData.tagline.length > 500) {
      return NextResponse.json({ error: "tagline too long" }, { status: 400 });
    }

    // Distributed generation cap — load the persisted session first and refuse
    // once it has generated too many times. Rides the shared Blob store, so it
    // holds across serverless instances and cold starts (unlike the IP Map).
    const existing = getSession(sessionId) ?? (await getSessionFromBlob(sessionId));
    if ((existing?.genCount ?? 0) >= MAX_GENERATIONS_PER_SESSION) {
      return NextResponse.json(
        { error: "Generation limit reached for this session. Start a new site to continue." },
        { status: 429 },
      );
    }

    // Provider chain: Gemini → Groq → mock (see lib/llmProviders.ts).
    // Anthropic is intentionally NOT in this chain so test traffic does not
    // burn paid credits. When a real paying client comes in we'll either
    // top up Anthropic and add it to the chain, or keep relying on free
    // providers + the business-aware mock fallback.
    let generatedContent: GeneratedContent;
    const llmOutcome = await generateWithFreeProviders(formData);
    if (llmOutcome.content) {
      generatedContent = llmOutcome.content;
    } else {
      console.warn(
        "[generate] all free LLM providers failed, falling back to client-derived content:",
        JSON.stringify(llmOutcome.attempts),
      );
      /*
        Le repli se bâtit sur ce que le client a dit, dans sa langue. L'ancien
        jeu de phrases par métier servait « Digital experiences that convert »
        à un plombier, et seize de ses dix-neuf jeux étaient en anglais.
      */
      generatedContent = contenuDepuisLeClient(formData);
    }

    // A pasted menu is often dropped by the big generation call (it prioritises
    // copywriting over verbatim extraction, especially on long menus). If a menu
    // was provided but didn't come back, extract it in a focused, reliable call.
    const rawMenu = (
      (formData as unknown as { sectorData?: Record<string, string> }).sectorData?.menuItems ?? ""
    ).trim();
    if (rawMenu && !(generatedContent.menuItems && generatedContent.menuItems.length > 0)) {
      const menuItems = await extractMenuItems(rawMenu);
      if (menuItems && menuItems.length > 0) {
        generatedContent = { ...generatedContent, menuItems };
      }
    }

    // Save or update session — persist to Blob so the preview page (running
    // on another serverless instance) can read the generated content.
    // (`existing` was already loaded above for the generation cap.)
    // Auto-generate legal pages (mentions légales, CGV…) from whatever legal
    // data the wizard's step 7 captured — no-op boilerplate if the client
    // left those fields empty, never blocks generation.
    const legalPages = generateLegalPages(
      formData,
      existing?.businessProfile?.legal,
      existing?.businessProfile?.niche,
    );
    const sessionData = {
      id: sessionId,
      formData,
      // Preserve businessProfile — this route used to rebuild sessionData
      // from scratch here, silently dropping the businessProfile the wizard
      // PATCHed in right before calling /api/generate (services, team,
      // legal…), so every resolveList() in the templates would always fall
      // back to demo content on the actual generated site.
      businessProfile: existing?.businessProfile,
      generatedContent,
      legalPages,
      createdAt: existing?.createdAt ?? new Date(),
      accountId: existing?.accountId,
      genCount: (existing?.genCount ?? 0) + 1,
    };

    try {
      await saveSessionToBlob(sessionId, sessionData);
    } catch (blobErr) {
      console.error("[generate] Blob save failed, in-memory only:", blobErr);
      saveSession(sessionId, sessionData);
    }

    // SECURITY: do NOT submit /preview/<sessionId> or /site/<sessionId> to
    // IndexNow. The sessionId is the only capability protecting the session's
    // read/write API; publishing it to search engines made ids harvestable at
    // scale. Per-client sites get indexed under their own custom domain later,
    // never via the raw session URL on launch.aevia.services.

    return NextResponse.json({
      success: true,
      sessionId,
      generatedContent,
      previewUrl: `/preview/${sessionId}`,
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
