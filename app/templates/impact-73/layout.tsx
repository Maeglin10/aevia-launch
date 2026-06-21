import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conservatoire Accord — École de musique à Lyon",
  description: "École de musique à Lyon 6e. Piano, guitare, chant, batterie, solfège pour enfants et adultes. Cours essai gratuit. 18 ans d'expérience.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
