import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Extract a structured menu from a photo the client uploaded (or pasted text).
// Uses Gemini 2.5 Flash vision — same key as /api/generate, no extra dependency.
// The client ALWAYS validates/edits the result before it's saved, so an OCR
// slip never silently ships a wrong price.

interface MenuItem {
  name: string;
  price: string;
  category?: string;
  description?: string;
}

const EXTRACT_PROMPT = `Tu reçois la photo d'une carte / d'un menu de restaurant (ou une liste de prestations).
Extrais TOUS les articles visibles en JSON. Règles STRICTES :
- Recopie le nom et le prix EXACTEMENT comme écrits — ne corrige, n'arrondis, n'invente JAMAIS un prix.
- Si un article n'a pas de prix lisible, mets "price": "".
- Déduis la catégorie si un intitulé de section est visible (Entrées, Plats, Desserts, Boissons…), sinon "".
- N'invente AUCUN article qui ne figure pas sur l'image.
Réponds UNIQUEMENT avec un objet JSON: {"items":[{"name":"...","price":"...","category":"...","description":""}]}`;

async function fetchImageAsInlineData(url: string): Promise<{ mimeType: string; data: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image fetch failed: ${res.status}`);
  const mimeType = res.headers.get("content-type") ?? "image/jpeg";
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > 8 * 1024 * 1024) throw new Error("image too large (max 8MB)");
  return { mimeType, data: buf.toString("base64") };
}

function parseItems(rawText: string): MenuItem[] | null {
  let text = rawText.trim();
  const fence = text.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
  if (fence) text = fence[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last > first) text = text.slice(first, last + 1);
  try {
    const parsed = JSON.parse(text) as { items?: MenuItem[] };
    if (!Array.isArray(parsed.items)) return null;
    return parsed.items
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

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "no_key" }, { status: 503 });

  let body: { imageUrl?: string };
  try {
    body = (await req.json()) as { imageUrl?: string };
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (!body.imageUrl) return NextResponse.json({ error: "missing_imageUrl" }, { status: 400 });

  // Only accept images we host on our own Blob store — never fetch arbitrary
  // external URLs on the caller's behalf (SSRF guard).
  if (!/^https:\/\/[^/]*\.public\.blob\.vercel-storage\.com\//.test(body.imageUrl)) {
    return NextResponse.json({ error: "url_not_allowed" }, { status: 400 });
  }

  let inline: { mimeType: string; data: string };
  try {
    inline = await fetchImageAsInlineData(body.imageUrl);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "image_error" },
      { status: 400 },
    );
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    encodeURIComponent(key);

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: EXTRACT_PROMPT },
            { inlineData: { mimeType: inline.mimeType, data: inline.data } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        // Disable gemini-2.5-flash's default thinking — it eats the output budget
        // and truncates the JSON on long menus (finishReason=MAX_TOKENS).
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: `gemini_http_${res.status}` }, { status: 502 });
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const items = parseItems(text);
  if (!items) return NextResponse.json({ error: "parse_failed" }, { status: 502 });

  return NextResponse.json({ items });
}
