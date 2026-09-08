/*
  Point d'entrée d'instrumentation exigé par Next depuis la version 15 :
  sans ce fichier, `sentry.server.config.ts` et `sentry.edge.config.ts` ne
  sont JAMAIS chargés. Conséquence mesurée : tous les `captureException` du
  webhook Stripe et des routes serveur étaient des appels sans effet — une
  commande perdue ne remontait nulle part, personne n'était prévenu.
*/
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export async function onRequestError(
  err: unknown,
  request: { path: string; method: string; headers: Record<string, string | undefined> },
  context: { routerKind: string; routePath: string; routeType: string },
) {
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(err, request as never, context as never);
}
