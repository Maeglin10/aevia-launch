// Google OAuth for the "Connect Google Analytics & Search Console" flow on
// the preview page. Reuses the Aevia Inbox's existing OAuth client
// (GOOGLE_OAUTH_CLIENT_ID/SECRET) — same Google Cloud project, separate
// redirect URI registered for this domain. See docs/plans for the Console
// setup steps (webmasters scope + redirect URI) required before this works.

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const ANALYTICS_ADMIN_BASE = "https://analyticsadmin.googleapis.com/v1beta";
const SITE_VERIFICATION_BASE = "https://www.googleapis.com/siteVerification/v1";

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.edit",
  "https://www.googleapis.com/auth/webmasters",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function getRedirectUri(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return `${base}/api/google/callback`;
}

export function getGoogleAuthUrl(sessionId: string): string {
  const clientId = requireEnv("GOOGLE_OAUTH_CLIENT_ID");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    state: Buffer.from(sessionId).toString("base64url"),
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export function decodeState(state: string): string {
  const decoded = Buffer.from(state, "base64url").toString("utf-8");
  if (!decoded) throw new Error("Invalid OAuth state");
  return decoded;
}

interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleTokens> {
  const clientId = requireEnv("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = requireEnv("GOOGLE_OAUTH_CLIENT_SECRET");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(),
    }).toString(),
  });
  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// ─── Google Analytics (GA4) ────────────────────────────────────────────────

interface Ga4AccountSummary {
  account: string; // "accounts/12345"
  propertySummaries?: { property: string; displayName: string }[];
}

/**
 * Best-effort GA4 setup: reuses the caller's first Analytics account (GA
 * accounts can't be created via API — only properties under an existing
 * account), finds a property matching businessName or creates one, and
 * returns its Measurement ID. Returns null if the user has zero GA accounts
 * (nothing we can automate — they need to create one manually first).
 */
export async function autoProvisionGa4(
  accessToken: string,
  businessName: string,
  siteUrl: string,
): Promise<string | null> {
  const headers = { Authorization: `Bearer ${accessToken}` };

  const summariesRes = await fetch(`${ANALYTICS_ADMIN_BASE}/accountSummaries?pageSize=200`, { headers });
  if (!summariesRes.ok) throw new Error(`accountSummaries failed: ${summariesRes.status}`);
  const { accountSummaries = [] } = (await summariesRes.json()) as { accountSummaries?: Ga4AccountSummary[] };
  if (accountSummaries.length === 0) return null; // no GA account to attach to

  const account = accountSummaries[0];
  const existing = account.propertySummaries?.find(
    (p) => p.displayName.toLowerCase() === businessName.toLowerCase(),
  );

  const propertyName = existing
    ? existing.property
    : await createGa4Property(accessToken, account.account, businessName);

  return getOrCreateWebDataStream(accessToken, propertyName, siteUrl);
}

async function createGa4Property(accessToken: string, accountResourceName: string, businessName: string): Promise<string> {
  const res = await fetch(`${ANALYTICS_ADMIN_BASE}/properties`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      parent: accountResourceName,
      displayName: businessName.slice(0, 100),
      timeZone: "Europe/Paris",
      currencyCode: "EUR",
    }),
  });
  if (!res.ok) throw new Error(`GA4 property creation failed: ${res.status} ${await res.text()}`);
  const property = (await res.json()) as { name: string };
  return property.name; // "properties/12345"
}

async function getOrCreateWebDataStream(accessToken: string, propertyName: string, siteUrl: string): Promise<string> {
  const headers = { Authorization: `Bearer ${accessToken}` };

  const listRes = await fetch(`${ANALYTICS_ADMIN_BASE}/${propertyName}/dataStreams`, { headers });
  if (listRes.ok) {
    const { dataStreams = [] } = (await listRes.json()) as {
      dataStreams?: { webStreamData?: { measurementId?: string } }[];
    };
    const existing = dataStreams.find((s) => s.webStreamData?.measurementId);
    if (existing?.webStreamData?.measurementId) return existing.webStreamData.measurementId;
  }

  const createRes = await fetch(`${ANALYTICS_ADMIN_BASE}/${propertyName}/dataStreams`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "WEB_DATA_STREAM",
      webStreamData: { defaultUri: siteUrl },
      displayName: "Site web",
    }),
  });
  if (!createRes.ok) throw new Error(`GA4 data stream creation failed: ${createRes.status} ${await createRes.text()}`);
  const stream = (await createRes.json()) as { webStreamData?: { measurementId?: string } };
  if (!stream.webStreamData?.measurementId) throw new Error("GA4 data stream created without a measurementId");
  return stream.webStreamData.measurementId;
}

// ─── Google Search Console ─────────────────────────────────────────────────

/**
 * Fetches the HTML-tag verification token for a URL. Doesn't require the
 * site to be live yet — the token itself is the value that goes in
 * <meta name="google-site-verification" content="TOKEN">. Actual
 * verification (confirming Google can see the tag) has to happen once the
 * site is live — from the client's own Search Console, or a later
 * automated step once we track final domains.
 */
export async function fetchGscVerificationToken(accessToken: string, siteUrl: string): Promise<string> {
  const res = await fetch(`${SITE_VERIFICATION_BASE}/token`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      site: { type: "SITE", identifier: siteUrl },
      verificationMethod: "META",
    }),
  });
  if (!res.ok) throw new Error(`Search Console token fetch failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { token: string };
  return data.token;
}
