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
      try {
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const client = new Anthropic({ apiKey });

        const prompt = `Tu es un copywriter web pro. Génère le contenu d'un site pour ce business en français professionnel.
- Nom: ${formData.businessName}
- Type: ${formData.businessType}
- Tagline: ${formData.tagline}
- Service principal: ${formData.mainService}
- Bénéfices clés: ${formData.benefits?.join(", ")}
- Cible: ${formData.targetAudience}
- Ton: ${formData.tone}
- Ville: ${formData.city}
- Tarifs: ${formData.priceRange ?? "sur devis"}

Réponds UNIQUEMENT avec un objet JSON valide (pas de \`\`\`json wrapper, pas d'explication) avec exactement ces clés:
{
  "heroHeadline": "accroche principale 6-10 mots",
  "heroSubline": "sous-titre 12-20 mots",
  "aboutTitle": "titre section à propos",
  "aboutText": "paragraphe à propos 40-60 mots",
  "services": [{"title":"...","description":"35-50 mots"},{"title":"...","description":"35-50 mots"},{"title":"...","description":"35-50 mots"}],
  "testimonials": [{"name":"prénom + initiale","role":"contexte court","text":"avis 25-40 mots","rating":5},{"name":"...","role":"...","text":"...","rating":5},{"name":"...","role":"...","text":"...","rating":5}],
  "ctaText": "appel à action 4-7 mots",
  "metaTitle": "titre SEO 50-60 chars avec ville",
  "metaDescription": "meta description SEO 140-160 chars"
}`;

        const message = await client.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          messages: [{ role: "user", content: prompt }],
        });

        let text = message.content[0].type === "text" ? message.content[0].text : "";

        // Strip markdown JSON wrappers (Claude sometimes adds ```json ... ```)
        text = text.trim();
        const fence = text.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
        if (fence) text = fence[1].trim();

        // Extract first JSON object even if Claude added preamble/postamble
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          text = text.slice(firstBrace, lastBrace + 1);
        }

        try {
          generatedContent = JSON.parse(text) as GeneratedContent;
        } catch (parseErr) {
          console.error("[generate] Claude JSON parse failed, falling back to mock. Raw:", text.slice(0, 200));
          generatedContent = generateMockContent(formData);
        }
      } catch (claudeErr) {
        console.error("[generate] Claude API call failed, falling back to mock:", claudeErr);
        generatedContent = generateMockContent(formData);
      }
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
