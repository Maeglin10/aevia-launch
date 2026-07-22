import { redirect } from "next/navigation";

// The former /galerie business-niche gallery has been merged into the unified
// /themes gallery (category + industry/specialty + page-type filters, all 315
// templates). Keep this route alive as a redirect so existing links/bookmarks
// don't 404.
export default function GaleriePage() {
  redirect("/themes");
}
