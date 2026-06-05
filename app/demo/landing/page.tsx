import { redirect } from "next/navigation";

// Standalone demo retired — redirect to a representative current Tech/SaaS landing theme.
export default function LandingDemoPage() {
  redirect("/themes/landing");
}
