import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maître Renard & Associés — Cabinet d'avocats à Paris",
  description: "Cabinet d'avocats parisien. Droit des affaires, droit du travail, droit de la famille, RGPD. 22 ans d'exercice au Barreau de Paris.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
