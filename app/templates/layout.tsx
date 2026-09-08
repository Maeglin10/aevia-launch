import { WebchatBridge } from "./WebchatBridge";
import { BarreBoutique } from "./BarreBoutique";
import { GardeCertifications } from "./GardeCertifications";
import { LienMentionsLegales } from "./LienMentionsLegales";
import { MetaSiteClient } from "./MetaSiteClient";
import { FormulairesVivants } from "./FormulairesVivants";
import { BarreActionMobile } from "./BarreActionMobile";
import { BrandColorVar } from "./BrandColorVar";
import { SiteSchema } from "./SiteSchema";
import { SiteImages } from "./SiteImages";
import { TemplateAnalytics } from "./TemplateAnalytics";
import { TexteAlternatif } from "./TexteAlternatif";

export const dynamic = 'force-dynamic';

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BrandColorVar />
      {/* Titre, description, canonical et OpenGraph du CLIENT : les pages de
          thème sont des composants client et portaient encore les métadonnées
          d'Aevia — canonical compris, ce qui empêchait l'indexation du site
          vendu. */}
      <MetaSiteClient />
      {/* Les demandes envoyées depuis le site du client lui parviennent
          vraiment : au moins 113 thèmes se contentaient d'afficher « Message
          envoyé » sans rien transmettre. */}
      <FormulairesVivants />
      <SiteSchema />
      <SiteImages />
      <TemplateAnalytics />
      {/* 698 images sur 1 034 n'avaient aucun texte alternatif, sur 245 des
          373 thèmes. Posé ici plutôt que dans 245 fichiers, comme les
          correctifs catalogue ci-dessous. */}
      <TexteAlternatif />
      {/* Tap targets. The catalogue sweep measured nav and footer links at
          15-21px tall on 259 templates — well under the 44px that makes a
          link comfortably hittable with a thumb. Growing the hit area here,
          once, rather than editing 315 files: the text does not move, only
          the box around it grows, and it is scoped to narrow viewports so
          desktop layouts are untouched. */}
      {/* Sans JavaScript, framer-motion ne s'exécute jamais : les éléments
          rendus avec initial={{opacity:0}} restent invisibles POUR TOUJOURS —
          titre principal et bouton d'appel compris (mesuré sur 4 thèmes sur 8).
          Cette règle ne s'applique qu'en l'absence de JS, donc elle n'entre
          jamais en conflit avec les animations. */}
      <noscript>
        <style>{`
          [style*="opacity:0"], [style*="opacity: 0"] {
            opacity: 1 !important;
            transform: none !important;
          }
        `}</style>
      </noscript>
      <style>{`
        /* Le contour de focus est supprimé par 193 thèmes sans rien mettre à
           la place : au clavier, on ne voit jamais où l'on est. On le rétablit
           pour tout le catalogue, uniquement pour la navigation clavier
           (:focus-visible), donc sans halo au clic à la souris. */
        #main-content :focus-visible,
        nav :focus-visible,
        footer :focus-visible {
          outline: 3px solid currentColor !important;
          outline-offset: 2px !important;
          border-radius: 2px;
        }
        @media (max-width: 900px) {
          /* Grow the hit area with padding only. Forcing display:inline-flex
             collapsed column-stacked footer lists onto one line. */
          nav a, nav button, footer a, footer button {
            padding-block: max(0px, calc((44px - 1em * 1.4) / 2));
          }
        }
        /* Fixed-count grids written as inline styles never reflow. A 1fr track
           cannot shrink below its longest word, so at 390px a multi-column row
           grows wider than the viewport and the trailing columns are clipped
           away by the page's overflow-x — whole stats, service cards and
           footer columns simply vanished on phones. The selector list is
           generated from every gridTemplateColumns literal in app/templates,
           so it covers the ~200 inline grids at once rather than editing each
           of the 315 files; regenerate it if new patterns are introduced.
           Order matters: a 4-track value also substring-matches the 2-track
           selectors, so the auto-fit rule is stated last and wins for those. */
        @media (max-width: 768px) {
          #main-content [style*="0.85fr 1.15fr"],
          #main-content [style*="0.92fr 1.08fr"],
          #main-content [style*="0.95fr 1.05fr"],
          #main-content [style*="0.9fr 1.1fr"],
          #main-content [style*="1.1fr 0.9fr"],
          #main-content [style*="1.1fr 1fr"],
          #main-content [style*="1.2fr 1fr"],
          #main-content [style*="1.3fr 1fr"],
          #main-content [style*="1.3fr repeat(3, 1fr)"],
          #main-content [style*="1.4fr 1fr"],
          #main-content [style*="1.4fr 1fr 1fr"],
          #main-content [style*="1.4fr repeat(3, 1fr)"],
          #main-content [style*="1.5fr 1fr 1fr"],
          #main-content [style*="1.5fr repeat(3, 1fr)"],
          #main-content [style*="1.6fr 1fr"],
          #main-content [style*="1.6fr 1fr 1fr"],
          #main-content [style*="1.6fr repeat(3, 1fr)"],
          #main-content [style*="1fr 0.85fr"],
          #main-content [style*="1fr 0.9fr"],
          #main-content [style*="1fr 1.1fr"],
          #main-content [style*="1fr 1.2fr"],
          #main-content [style*="1fr 1.35fr"],
          #main-content [style*="1fr 1.4fr"],
          #main-content [style*="1fr 1.6fr"],
          #main-content [style*="1fr 1fr"],
          #main-content [style*="1fr 1fr 1fr"],
          #main-content [style*="1fr 2fr"],
          #main-content [style*="1fr 300px"],
          #main-content [style*="1fr 320px"],
          #main-content [style*="1fr 360px"],
          #main-content [style*="1fr 380px"],
          #main-content [style*="1fr 3fr"],
          #main-content [style*="1fr 420px"],
          #main-content [style*="1fr 480px"],
          #main-content [style*="280px 1fr"],
          #main-content [style*="2fr 1fr"],
          #main-content [style*="2fr 1fr 1fr"],
          #main-content [style*="340px 1fr"],
          #main-content [style*="360px 1fr"],
          #main-content [style*="3fr 2fr"],
          #main-content [style*="3rem 1fr auto"],
          #main-content [style*="400px 1fr"],
          #main-content [style*="56px 1fr auto"],
          #main-content [style*="5rem 1fr 1fr"],
          #main-content [style*="5rem 1fr auto"],
          #main-content [style*="6rem 1fr auto"],
          #main-content [style*="72px 1fr 1fr"],
          #main-content [style*="80px 1fr auto"],
          #main-content [style*="80px 48px 1fr"],
          #main-content [style*="auto 1fr auto"],
          #main-content [style*="repeat(3, 1fr)"] { grid-template-columns: minmax(0,1fr) !important; }
          /* auto-fit rather than a hard column count: where the section's own
             padding leaves too little room for two readable tracks it drops to
             one instead of breaking words mid-syllable ("Rembo/ursé"). */
          #main-content [style*="1.4fr 1fr 1fr 1fr"],
          #main-content [style*="1.5fr 1fr 1fr 1fr"],
          #main-content [style*="1.6fr 1fr 1fr 1.3fr"],
          #main-content [style*="100px 1fr 200px 100px 120px"],
          #main-content [style*="140px 1fr 200px 80px"],
          #main-content [style*="1fr 1fr 1fr 1fr"],
          #main-content [style*="1fr auto auto auto"],
          #main-content [style*="2.2fr 1fr 1fr 1fr"],
          #main-content [style*="2.5fr 1fr 1fr 1fr"],
          #main-content [style*="2fr 1fr 1fr 1fr"],
          #main-content [style*="2fr 1fr 1fr 1fr 1fr"],
          #main-content [style*="4rem 1fr auto auto"],
          #main-content [style*="56px 1fr auto auto"],
          #main-content [style*="5rem 1fr 2fr auto"],
          #main-content [style*="5rem 1fr auto auto"],
          #main-content [style*="5rem 1fr auto auto auto"],
          #main-content [style*="64px 1fr 160px 80px"],
          #main-content [style*="auto 1fr auto auto"],
          #main-content [style*="minmax(0, 1fr) minmax(240px, 300px)"],
          #main-content [style*="repeat(4, 1fr)"],
          #main-content [style*="repeat(4,1fr)"],
          #main-content [style*="repeat(5, 1fr)"],
          #main-content .imx-stats { grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)) !important; }
          /* a shrunken track must not be escaped by a long unbreakable word */
          #main-content [style*="display:grid"] > * { overflow-wrap: break-word; }
        }
      `}</style>
      {/* The root layout renders a "Skip to main content" link targeting
          #main-content. That id exists on Aevia's own pages but on none of the
          315 templates, so the skip link — the first stop for a keyboard or
          screen-reader user — went nowhere on every client site. */}
      {/* Domaine client : la session arrive par cookie (le rewrite du
          middleware garde l'URL nue). On l'amorce dans sessionStorage avant
          l'hydratation — l'endroit que chaque thème sait déjà lire. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var m=document.cookie.match(/(?:^|; )aevia-session=([^;]+)/);var t=document.cookie.match(/(?:^|; )aevia-template=([^;]+)/);if(!m)return;var sid=decodeURIComponent(m[1]);var cles=["apercu-session:"+String(location.pathname.split("/")[2])];if(t)cles.push("apercu-session:"+decodeURIComponent(t[1]));for(var i=0;i<cles.length;i++){if(!sessionStorage.getItem(cles[i]))sessionStorage.setItem(cles[i],sid);}}catch(e){}})();`,
        }}
      />
      <div id="main-content">{children}</div>
      {/* Accès aux mentions légales garanti (LCEN 6-III) : 103 thèmes n'en
          avaient aucune, d'autres ne les liaient pas. Ne s'affiche que si le
          thème n'a pas déjà son propre lien. */}
      <LienMentionsLegales />
      {/* La barre d'appel du pouce. Mesuré en 390 × 844 sur les 317 thèmes
          antérieurs à la série 328-383 : 144 sans appel à l'action au premier
          écran, 298 sans appel à l'action une fois la page défilée — le bouton
          de la barre fixe vit dans le menu déroulant, qui passe en
          display:none sur téléphone. Posée ici plutôt que dans trois cents
          fichiers, comme les deux correctifs catalogue ci-dessus ; elle
          s'efface d'elle-même sur les thèmes qui ont déjà un appel à l'action
          épinglé. */}
      <BarreActionMobile />
      {/* La vente en ligne du catalogue : panier + Stripe Connect quand le
          marchand l'a activée, lien vers sa boutique existante sinon. Posée
          ici, une fois, comme les autres correctifs catalogue. */}
      <BarreBoutique />
      {/* Jamais de certification héritée de la démo sous le nom d'un client
          (RGE, Qualibat… — usage réglementé). Correctif catalogue. */}
      <GardeCertifications />
      <WebchatBridge />
    </>
  );
}
