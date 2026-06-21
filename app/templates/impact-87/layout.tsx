import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Iron Club Lyon — Salle de sport & CrossFit Lyon 7e",
  description:
    "Iron Club, la salle de sport et CrossFit certifiée à Lyon 7e. 800+ membres, 40 cours/semaine, 8 coachs certifiés. Essai gratuit disponible.",
};

export default function IronClubLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
