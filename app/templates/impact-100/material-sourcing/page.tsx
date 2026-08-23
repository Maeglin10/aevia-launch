/* Sous-page coquille résorbée (P0) : redirection vers l'ancre de l'accueil.
   Un sitemap qui annonce des pages vides dessert la vente. */
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/templates/impact-100#methode");
}
