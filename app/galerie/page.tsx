import type { Metadata } from "next";
import GalleryShowcase from "./GalleryShowcase";

export const metadata: Metadata = {
  title: "Galerie de Templates | Aevia Launch",
  description: "Découvrez notre collection de templates professionnels et responsives conçus sur mesure pour votre secteur d'activité par Aevia Launch.",
  alternates: {
    canonical: "/galerie",
  },
};

export default function GaleriePage() {
  return <GalleryShowcase />;
}
