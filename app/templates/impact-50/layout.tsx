import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Laurence Moreau — Psychologue clinicienne à Montpellier",
  description: "Psychologue clinicienne à Montpellier. Anxiété, dépression, burnout, thérapie de couple, suivi adolescents. Consultation présentiel ou visio. RDV sous 48h.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
