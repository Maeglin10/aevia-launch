"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// Launch CMS site list — moved here from the Inbox frontend (it never
// belonged there, it is a Launch feature). Talks to the same Aevia
// backend via the SSO-cookie proxy at /api/idp/user-sites. Editing still
// deep-links to the existing Inbox CMS editor (not ported yet — that is a
// separate, larger piece of work).

interface UserSite {
  id: string;
  siteName: string;
  themeId: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const INBOX_ORIGIN =
  process.env.NEXT_PUBLIC_AEVIA_INBOX_URL || "https://inbox.aevia.services";

export default function DashboardPage() {
  const router = useRouter();
  const [sites, setSites] = useState<UserSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/idp/user-sites", { credentials: "include" });
      if (res.status === 401) {
        router.push("/login?next=/dashboard");
        return;
      }
      if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
      const data = (await res.json()) as UserSite[] | { data: UserSite[] };
      setSites(Array.isArray(data) ? data : (data.data ?? []));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger vos sites");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadSites();
  }, [loadSites]);

  const handleCreate = useCallback(async () => {
    const name = prompt("Nom du site :");
    if (!name?.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/idp/user-sites", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: name.trim(),
          themeId: "default",
          config: { content: [], root: { props: {} } },
        }),
      });
      if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
      const site = (await res.json()) as UserSite;
      window.location.href = `${INBOX_ORIGIN}/fr/cms/editor/${site.id}`;
    } catch (err) {
      alert(`Erreur : ${err instanceof Error ? err.message : "création impossible"}`);
    } finally {
      setCreating(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Mes sites</h1>
            <p className="text-zinc-400 text-sm mt-1">Gérez et éditez vos sites Aevia Launch</p>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 text-white text-sm font-semibold transition-colors"
          >
            {creating ? "Création..." : "+ Nouveau site"}
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && <div className="text-center py-16 text-zinc-500">Chargement...</div>}

        {!loading && !error && sites.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
            <p className="text-zinc-500 mb-4">Aucun site pour l&apos;instant</p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
            >
              Créer mon premier site
            </button>
          </div>
        )}

        {!loading && sites.length > 0 && (
          <div className="flex flex-col gap-3">
            {sites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/10 bg-white/5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{site.siteName}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        site.published
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {site.published ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Modifié le {new Date(site.updatedAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <a
                  href={`${INBOX_ORIGIN}/fr/cms/editor/${site.id}`}
                  className="px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Éditer
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
