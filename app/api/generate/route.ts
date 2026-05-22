import { NextRequest, NextResponse } from "next/server";
import { saveSession, getSession, type FormData, type GeneratedContent } from "@/lib/sessions";
import { generateMockContent } from "@/lib/mockContent";

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

    let generatedContent: GeneratedContent;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && !apiKey.includes("REPLACE")) {
      // Real Claude generation
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey });

      const prompt = `You are a professional copywriter. Generate website content for this business:
- Name: ${formData.businessName}
- Type: ${formData.businessType}
- What they do: ${formData.tagline}
- Main service: ${formData.mainService}
- Key benefits: ${formData.benefits?.join(", ")}
- Target audience: ${formData.targetAudience}
- Tone: ${formData.tone}
- Location: ${formData.city}

Generate JSON with exactly these fields:
{
  "heroHeadline": "...",
  "heroSubline": "...",
  "aboutTitle": "...",
  "aboutText": "...",
  "services": [{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."}],
  "testimonials": [{"name":"...","role":"...","text":"...","rating":5},{"name":"...","role":"...","text":"...","rating":5},{"name":"...","role":"...","text":"...","rating":5}],
  "ctaText": "...",
  "metaTitle": "...",
  "metaDescription": "..."
}
Return only valid JSON, no markdown, no explanation.`;

      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "";
      generatedContent = JSON.parse(text) as GeneratedContent;
    } else {
      // Mock generation (no API key)
      generatedContent = generateMockContent(formData);
    }

    // Save or update session
    const existing = getSession(sessionId);
    saveSession(sessionId, {
      id: sessionId,
      formData,
      generatedContent,
      createdAt: existing?.createdAt ?? new Date(),
    });

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
