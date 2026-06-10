import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Site in 5 Steps | AeviaLaunch",
  description: "Fill in 5 quick steps, our AI writes your headlines and copy, then preview your site instantly before we deploy it live. No design skills needed.",
  openGraph: {
    title: "Build Your Site in 5 Steps | AeviaLaunch",
    description: "5-step AI website builder. Preview instantly, deployed in 2 hours.",
    url: "https://launch.aevia.services/configure",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  robots: { index: false, follow: false },
  alternates: { canonical: "https://launch.aevia.services/configure" },
};

export default function ConfigureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
