import type { Metadata } from "next";
import {
  clientName,
  clientNameOr,
} from "@/lib/templates/clientContent";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  get title() { return `${clientNameOr("Iron Club")} — Salle de sport & CrossFit`; },
  description:
    `${clientNameOr("Iron Club")}, salle de sport et CrossFit. Essai gratuit disponible.`,
};

export default function IronClubLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
