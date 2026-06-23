import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse 291 Website Themes | AeviaLaunch",
  description: "Explore 291 professional website themes — 21 site builder templates and 270 impact vault designs. Preview any theme live, then build your site in minutes.",
  openGraph: {
    title: "Browse 291 Website Themes | AeviaLaunch",
    description: "21 site builder templates and 270 impact vault designs. Click any theme for a live preview.",
    url: "https://launch.aevia.services/themes",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://launch.aevia.services/themes" },
};

export default function ThemesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
