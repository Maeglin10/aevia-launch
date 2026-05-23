import Link from "next/link";

interface LegalFooterProps {
  variant?: "dark" | "light";
}

export function LegalFooter({ variant = "dark" }: LegalFooterProps) {
  const isDark = variant === "dark";
  const wrapperCls = isDark
    ? "border-t border-white/5 bg-[#080808] text-white/40"
    : "border-t border-zinc-200 bg-white text-zinc-500";
  const linkCls = isDark
    ? "hover:text-white/80 transition-colors"
    : "hover:text-zinc-900 transition-colors";

  const year = new Date().getFullYear();

  return (
    <footer className={wrapperCls}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold mb-1">
              <span className={isDark ? "text-white" : "text-zinc-900"}>Aevia Launch</span>
              <span className="text-xs ml-2 opacity-60">par Aevia</span>
            </p>
            <p className="text-xs opacity-70">
              © {year} Aevia. Tous droits réservés.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <Link href="/pricing" className={linkCls}>
              Tarifs
            </Link>
            <Link href="/legal/mentions-legales" className={linkCls}>
              Mentions légales
            </Link>
            <Link href="/legal/cgu" className={linkCls}>
              CGV
            </Link>
            <Link href="/legal/confidentialite" className={linkCls}>
              Confidentialité
            </Link>
            <Link href="/legal/cookies" className={linkCls}>
              Cookies
            </Link>
            <a href="mailto:contact@aevia.io" className={linkCls}>
              Contact
            </a>
          </nav>
        </div>

        <p className="text-[10px] opacity-50 mt-6 leading-relaxed">
          Paiement sécurisé par Stripe. Livraison de l&apos;aperçu sous 2 heures.
          Site web livré en 2 à 4 heures après validation du brief.
          Maintenance optionnelle facturée mensuellement, résiliable à tout moment.
        </p>
      </div>
    </footer>
  );
}
