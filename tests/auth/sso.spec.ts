/**
 * Aevia SSO E2E tests for Skylaunch.
 *
 * Strategy: mock all IdP calls with page.route() so tests never hit the real
 * inbox backend. This keeps the suite fast and offline-capable.
 *
 * Real full-stack OAuth (Google consent screen) cannot be automated in CI —
 * it is covered by manual QA documented at the bottom of this file.
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Fixtures — mock IdP responses
// ---------------------------------------------------------------------------

const IDP_ME_PATH = '/api/idp/auth/me';
const IDP_EXCHANGE_PATH = '/api/idp/auth/oauth-session';

const fakeUser = { id: 'aevia-test-123', email: 'sso-tester@aevia.services', username: 'tester' };

// ---------------------------------------------------------------------------
// AeviaAccountButton — header state
// ---------------------------------------------------------------------------

test.describe('AeviaAccountButton header state', () => {
  test('shows "Connexion" button when unauthenticated', async ({ page }) => {
    // IdP /me returns 401 → user is signed out
    await page.route(`**${IDP_ME_PATH}`, (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ message: 'UNAUTHORIZED' }) }),
    );

    await page.goto('/');

    // Wait for the header to finish the auth check (the button renders after fetch)
    const loginBtn = page.locator('[data-testid="aevia-login-btn"]').or(
      page.getByRole('link', { name: /connexion/i }),
    );
    await expect(loginBtn.first()).toBeVisible({ timeout: 5000 });
  });

  test('shows user email when authenticated', async ({ page }) => {
    await page.route(`**${IDP_ME_PATH}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakeUser),
      }),
    );

    await page.goto('/');

    // Authenticated state renders the email
    await expect(page.getByText(fakeUser.email)).toBeVisible({ timeout: 5000 });
  });
});

// ---------------------------------------------------------------------------
// /auth/callback — OAuth code exchange
// ---------------------------------------------------------------------------

test.describe('/auth/callback', () => {
  test('redirects to /?auth_error=missing_code when no c param', async ({ page }) => {
    await page.goto('/auth/callback');
    await expect(page).toHaveURL(/auth_error=missing_code/, { timeout: 5000 });
  });

  test('exchanges code and redirects to / on success', async ({ page }) => {
    // Mock the code exchange endpoint
    await page.route(`**${IDP_EXCHANGE_PATH}**`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      }),
    );
    // Mock /auth/me to confirm session after exchange
    await page.route(`**${IDP_ME_PATH}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakeUser),
      }),
    );

    await page.goto('/auth/callback?c=valid_code_abc123');

    // Should redirect to / (or sessionStorage returnTo — default is /)
    await expect(page).toHaveURL(/\/$/, { timeout: 5000 });
  });

  test('redirects to /?auth_error=oauth_failed when exchange fails', async ({ page }) => {
    await page.route(`**${IDP_EXCHANGE_PATH}**`, (route) =>
      route.fulfill({ status: 400, body: JSON.stringify({ message: 'invalid code' }) }),
    );

    await page.goto('/auth/callback?c=bad_code');

    await expect(page).toHaveURL(/auth_error=oauth_failed/, { timeout: 5000 });
  });

  test('redirects to /?auth_error=oauth_failed when /auth/me fails after exchange', async ({ page }) => {
    await page.route(`**${IDP_EXCHANGE_PATH}**`, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }),
    );
    // Exchange succeeds but session validation fails
    await page.route(`**${IDP_ME_PATH}`, (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ message: 'UNAUTHORIZED' }) }),
    );

    await page.goto('/auth/callback?c=stale_code');

    await expect(page).toHaveURL(/auth_error=oauth_failed/, { timeout: 5000 });
  });

  test('respects aevia_return_to stored in sessionStorage', async ({ page }) => {
    await page.route(`**${IDP_EXCHANGE_PATH}**`, (route) =>
      route.fulfill({ status: 200, body: '{}' }),
    );
    await page.route(`**${IDP_ME_PATH}`, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(fakeUser) }),
    );

    // Pre-seed the return_to value the way AeviaAccountButton does
    await page.goto('/');
    await page.evaluate(() => sessionStorage.setItem('aevia_return_to', '/templates'));

    await page.goto('/auth/callback?c=code_with_return');

    await expect(page).toHaveURL(/\/templates/, { timeout: 5000 });
  });
});

// ---------------------------------------------------------------------------
// IdP proxy allowlist
// ---------------------------------------------------------------------------

test.describe('IdP proxy allowlist', () => {
  test('allows /api/idp/auth/me (returns real upstream response shape)', async ({ request }) => {
    // Without mocking at the browser level we test the Next.js route handler
    // directly via the API request context. It will hit the real IdP which
    // returns 401 if no cookie — that's a valid "allowed" response (not a 404).
    const res = await request.get('/api/idp/auth/me');
    expect([200, 401]).toContain(res.status());
  });

  test('blocks paths outside /auth/ with 404', async ({ request }) => {
    const res = await request.get('/api/idp/admin/users');
    expect(res.status()).toBe(404);
  });

  test('blocks arbitrary paths with 404', async ({ request }) => {
    const res = await request.get('/api/idp/webhooks/stripe');
    expect(res.status()).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Manual QA checklist (not automatable — requires real Google account)
// ---------------------------------------------------------------------------
//
// 1. Go to https://launch.aevia.services
//    → Header shows "Connexion" button (signed-out state)
//
// 2. Click "Connexion" → redirect to Google OAuth consent screen
//    → URL: https://skybot-inbox-production.up.railway.app/api/v1/auth/google
//
// 3. Sign in with Google account registered on the inbox
//    → Redirect back to https://launch.aevia.services/auth/callback?c=<code>
//    → Brief spinner, then redirect to /
//    → Header now shows the signed-in email + logout button
//
// 4. Open https://security.aevia.services in the same browser
//    → The shared `.aevia.services` accessToken cookie is sent automatically
//    → Security dashboard is accessible (no new sign-in required)
//
// 5. Click "Déconnexion" on either product
//    → Cookie cleared → redirected to sign-in page
//    → Other product also shows signed-out state on next load
