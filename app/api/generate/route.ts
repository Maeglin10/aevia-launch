import { NextRequest, NextResponse } from "next/server";
import { saveSession, saveSessionToBlob, getSession, getSessionFromBlob, type FormData, type GeneratedContent } from "@/lib/sessions";
import { generateMockContent } from "@/lib/mockContent";
import { generateWithFreeProviders } from "@/lib/llmProviders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple in-memory rate limiter: max 5 generate requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

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
        "[generate] all free LLM providers failed, using mock:",
        JSON.stringify(llmOutcome.attempts),
      );
      generatedContent = generateMockContent(formData);
    }

    // Save or update session — persist to Blob so the preview page (running
    // on another serverless instance) can read the generated content.
    const existing = getSession(sessionId) ?? (await getSessionFromBlob(sessionId));
    const sessionData = {
      id: sessionId,
      formData,
      generatedContent,
      createdAt: existing?.createdAt ?? new Date(),
    };

    try {
      await saveSessionToBlob(sessionId, sessionData);
    } catch (blobErr) {
      console.error("[generate] Blob save failed, in-memory only:", blobErr);
      saveSession(sessionId, sessionData);
    }

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
