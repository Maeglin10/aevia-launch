export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

// Allowlist — only these paths are proxied, no open proxy.
// /auth/ = SSO session check (Aevia unified login).
// /user-sites = Launch CMS site management, moved here from the Inbox
// frontend (it never belonged there) — same backend, same SSO cookie.
const ALLOWED_PREFIXES = ["/auth/", "/user-sites"];

const IDP_BASE =
  process.env.AEVIA_IDP_URL ||
  "https://skybot-inbox-production.up.railway.app/api/v1";

async function proxy(req: NextRequest, path: string): Promise<NextResponse> {
  if (!ALLOWED_PREFIXES.some((p) => path.startsWith(p))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const upstream = new URL(`${IDP_BASE}${path}${url.search}`);

  const headers = new Headers();
  req.headers.forEach((v, k) => {
    if (!["host", "connection", "transfer-encoding"].includes(k))
      headers.set(k, v);
  });
  // Forward the Aevia SSO cookie so /auth/me validates correctly.
  const cookie = req.cookies.get("accessToken");
  if (cookie) headers.set("Cookie", `accessToken=${cookie.value}`);

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

  const res = await fetch(upstream, {
    method: req.method,
    headers,
    body: body ?? undefined,
  });

  const out = new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers({ "content-type": res.headers.get("content-type") ?? "application/json" }),
  });

  // Relay Set-Cookie individually to avoid undici comma-folding bug.
  for (const cookie of res.headers.getSetCookie?.() ?? []) {
    out.headers.append("Set-Cookie", cookie);
  }

  return out;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, "/" + path.join("/"));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, "/" + path.join("/"));
}
