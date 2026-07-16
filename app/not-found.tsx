import Link from "next/link";
import { Rocket, ArrowLeft } from "lucide-react";
import { LegalFooter } from "@/components/LegalFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
            <Rocket className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-3">404</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Page introuvable</h1>
          <p className="text-zinc-400 mb-8">
            La page que vous cherchez n&apos;existe pas. Explorez nos templates et lancez votre site en 2 heures.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 hover:bg-zinc-800/40 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
}
