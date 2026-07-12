// Free-tier LLM provider chain for Aevia Launch generation.
//
// The /api/generate route tries each provider in order until one succeeds.
// All providers are zero-dependency (plain `fetch`) and respect the same
// system prompt + JSON output contract, so swapping is invisible to callers.
//
// Order (cheapest first → best fallback last):
//   1. Gemini 2.0 Flash       — Google AI Studio free tier (1500 req/day, 1M tokens/day)
//   2. Groq Llama 3.3 70B     — Groq free tier (14400 req/day, very fast)
//   3. caller's mock fallback — generateMockContent() in /api/generate
//
// Env vars:
//   GEMINI_API_KEY  https://aistudio.google.com/app/apikey  (no credit card)
//   GROQ_API_KEY    https://console.groq.com/keys           (no credit card)
//
// Adding a paid provider for real clients (e.g. Anthropic when revenue starts):
// extend `PROVIDER_ORDER` and add a `tryX` function below. Mocking + parsing
// are shared so the new provider only handles its own request shape.

import type { FormData, GeneratedContent } from "./sessions";

type ProviderName = "gemini" | "groq";
type ProviderResult =
  | { ok: true; provider: ProviderName; content: GeneratedContent }
  | { ok: false; provider: ProviderName; reason: string };

// Order matters — first successful provider wins.
const PROVIDER_ORDER: ProviderName[] = ["gemini", "groq"];

export interface LLMGenerationOutcome {
  content: GeneratedContent | null;
  provider: ProviderName | "mock" | "none";
  attempts: Array<{ provider: ProviderName; ok: boolean; reason?: string }>;
}

export async function generateWithFreeProviders(
  formData: FormData,
): Promise<LLMGenerationOutcome> {
  const prompt = buildPrompt(formData);
  const attempts: LLMGenerationOutcome["attempts"] = [];

  for (const name of PROVIDER_ORDER) {
    const result = await runProvider(name, prompt);
    attempts.push({
      provider: result.provider,
      ok: result.ok,
      reason: result.ok ? undefined : result.reason,
    });
    if (result.ok) {
      return { content: result.content, provider: result.provider, attempts };
    }
  }

  return { content: null, provider: "none", attempts };
}

async function runProvider(name: ProviderName, prompt: string): Promise<ProviderResult> {
  try {
    switch (name) {
      case "gemini":
        return await tryGemini(prompt);
      case "groq":
        return await tryGroq(prompt);
    }
  } catch (err) {
    return {
      ok: false,
      provider: name,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── Gemini 2.5 Flash (with auto-fallback to 2.5-flash-lite on 429) ──────────
// Free tier quotas vary by project; we try the better model first, then the
// lite model if quota is exhausted, so a single project can absorb more bursts.
async function tryGemini(prompt: string): Promise<ProviderResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, provider: "gemini", reason: "no_key" };

  const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
  let lastReason = "unknown";

  for (const model of models) {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      `${model}:generateContent?key=` +
      encodeURIComponent(key);

    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      lastReason = `http_${res.status}_${model}`;
      // 429 (quota) and 5xx (Google capacity issues, very common on 2.5 Flash)
      // → try the next model. Other 4xx errors mean the request itself is bad
      // and retrying with a different model won't help.
      if (res.status === 429 || res.status >= 500) continue;
      return { ok: false, provider: "gemini", reason: lastReason };
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const parsed = parseJsonResponse(text);
    if (!parsed) {
      lastReason = `json_parse_failed_${model}`;
      continue;
    }

    return { ok: true, provider: "gemini", content: parsed };
  }

  return { ok: false, provider: "gemini", reason: lastReason };
}

// ─── Groq Llama 3.3 70B ───────────────────────────────────────────────────────
async function tryGroq(prompt: string): Promise<ProviderResult> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return { ok: false, provider: "groq", reason: "no_key" };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    return { ok: false, provider: "groq", reason: `http_${res.status}` };
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  const parsed = parseJsonResponse(text);
  if (!parsed) return { ok: false, provider: "groq", reason: "json_parse_failed" };

  return { ok: true, provider: "groq", content: parsed };
}

// ─── Shared JSON extraction ──────────────────────────────────────────────────
// Handles raw JSON, ```json ... ``` fences, and content surrounded by prose.
function parseJsonResponse(rawText: string): GeneratedContent | null {
  let text = rawText.trim();

  // Strip ```json ... ``` wrappers if present.
  const fence = text.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
  if (fence) text = fence[1].trim();

  // Even if response_format=json_object failed, salvage the first {...} block.
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(text) as GeneratedContent;
  } catch {
    return null;
  }
}

// ─── Dedicated menu extraction ────────────────────────────────────────────────
// Extracting a pasted menu is a DIFFERENT job from copywriting. Bundled into the
// one big generation call, the model prioritises the creative task and silently
// drops menuItems on long/complex menus (observed on real 1700-char menus). A
// focused, low-temperature call that does ONLY extraction is reliable. Called as
// a fallback by the generate route whenever a menu was pasted but came back empty.
export interface ExtractedMenuItem {
  name: string;
  price: string;
  description?: string;
  category?: string;
}

const MENU_EXTRACT_PROMPT = `Tu extrais un menu de restaurant en JSON. Recopie nom et prix EXACTEMENT comme fournis — ne corrige, n'arrondis, n'invente JAMAIS un prix. Si une section est visible (Entrées, Burgers, Sides…), mets-la en category. Si un plat a deux prix (ex: 7,90 € / 10,90 €), garde le premier (le plus bas). N'invente AUCUN plat absent du texte. Laisse "description" VIDE (chaîne vide) pour garder la réponse courte.
Réponds UNIQUEMENT avec: {"items":[{"name":"...","price":"...","category":"","description":""}]}
Menu:
"""
`;

export async function extractMenuItems(rawMenu: string): Promise<ExtractedMenuItem[] | null> {
  const menu = rawMenu.trim();
  if (!menu) return null;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    encodeURIComponent(key);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${MENU_EXTRACT_PROMPT}${menu}\n"""` }] }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          // gemini-2.5-flash thinks by default and that reasoning eats the output
          // budget — on a long menu it truncated the JSON (finishReason=MAX_TOKENS)
          // → parse failed → no menu. Disable thinking: extraction needs none.
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const parsed = parseJsonResponse(text) as unknown as { items?: ExtractedMenuItem[] } | null;
    const items = parsed?.items;
    if (!Array.isArray(items)) return null;
    return items
      .filter((i) => i && typeof i.name === "string" && i.name.trim())
      .map((i) => ({
        name: String(i.name).trim(),
        price: String(i.price ?? "").trim(),
        category: i.category ? String(i.category).trim() : "",
        description: i.description ? String(i.description).trim() : "",
      }));
  } catch {
    return null;
  }
}

// ─── Shared prompt builder ───────────────────────────────────────────────────
function buildPrompt(formData: FormData): string {
  const sectorExtras = (formData as unknown as Record<string, unknown>).sectorData as Record<string, string> | undefined;
  const sectorLines = sectorExtras && Object.keys(sectorExtras).length > 0
    ? Object.entries(sectorExtras).map(([k, v]) => `- ${k}: ${v}`).join("\n")
    : "";
  const rawMenu = sectorExtras?.menuItems?.trim();

  return `Tu es un copywriter web expert. Génère le contenu d'un site pour ce business en français professionnel et percutant.
- Nom: ${formData.businessName}
- Type / métier: ${formData.businessType}
- Thème visuel: ${formData.template ?? ""}
- Tagline: ${formData.tagline ?? ""}
- Service principal: ${formData.mainService ?? ""}
- Bénéfices clés: ${(formData.benefits ?? []).join(", ")}
- Cible: ${formData.targetAudience ?? ""}
- Ton: ${formData.tone ?? "professionnel"}
- Ville: ${formData.city ?? ""}
- Tarifs: ${formData.priceRange ?? "sur devis"}
${sectorLines ? `- Infos secteur:\n${sectorLines}` : ""}

IMPORTANT: Tout le contenu doit être 100% spécifique à ce business. Aucun contenu générique. Les services doivent refléter exactement le métier "${formData.businessType}". Les témoignages doivent être crédibles pour ce secteur.
${rawMenu ? `
Le client a fourni son VRAI menu ci-dessous. Extrais-en une liste structurée de plats — nom et prix EXACTEMENT comme fournis, ne modifie JAMAIS un prix, n'invente AUCUN plat qui n'y figure pas. Description courte optionnelle si le nom seul est ambigu, sinon laisse vide. Menu fourni :
"""
${rawMenu}
"""` : ""}

Réponds UNIQUEMENT avec un objet JSON valide (pas de \`\`\`json wrapper, pas d'explication) avec exactement ces clés:
{
  "heroHeadline": "accroche principale 6-10 mots",
  "heroSubline": "sous-titre 12-20 mots",
  "aboutTitle": "titre section à propos",
  "aboutText": "paragraphe à propos 40-60 mots",
  "services": [{"title":"...","description":"35-50 mots"},{"title":"...","description":"35-50 mots"},{"title":"...","description":"35-50 mots"}],
  "testimonials": [{"name":"prénom + initiale","role":"contexte court","text":"avis 25-40 mots","rating":5},{"name":"...","role":"...","text":"...","rating":5},{"name":"...","role":"...","text":"...","rating":5}],
  "ctaText": "appel à action 4-7 mots",
  "metaTitle": "titre SEO 50-60 chars axé sur le SEO local avec la ville",
  "metaDescription": "méta description SEO 140-160 chars axée sur la qualité des prestations, le SEO local et la connexion Google Search Console & Analytics native"${rawMenu ? `,
  "menuItems": [{"name":"nom exact du plat","price":"prix exact tel que fourni","description":"courte description ou vide","category":"catégorie si déductible sinon vide"}]` : ""}
}`;
}
