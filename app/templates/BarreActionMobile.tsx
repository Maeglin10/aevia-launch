"use client";

import { useEffect, useState } from "react";

/**
 * La barre d'appel du pouce, posée une fois pour tout le catalogue.
 *
 * Ce qui a été mesuré au navigateur en 390 × 844, avant d'écrire ce fichier :
 * sur les 317 thèmes antérieurs à la série 328-383, 144 n'affichaient AUCUN
 * appel à l'action au premier écran et 298 n'en avaient plus aucun une fois
 * la page défilée. La barre de navigation est pourtant fixe presque partout,
 * mais son bouton d'action vit dans le bloc du menu déroulant, qui passe en
 * `display: none` sur téléphone — largeur relevée : 0.
 *
 * Pourquoi ici et pas dans chaque thème : les thèmes anciens n'ont pas de
 * charpente de barre commune. Sur 317, 212 n'ont aucune classe de bouton de
 * menu repérable et 96 aucune variable d'appel. Le correctif posé thème par
 * thème sur la série 328-383 n'en couvrait que 7. Ce fichier suit la voie que
 * `app/templates/layout.tsx` emploie déjà deux fois — cibles tactiles, reflow
 * des grilles — : un seul endroit plutôt que trois cents fichiers.
 *
 * Le principe : ne rien supposer du thème, tout lire dans la page rendue.
 *
 *   - la cible d'appel est le premier lien `tel:` du document, à défaut un
 *     `mailto:`, à défaut l'ancre de contact. Le numéro y est déjà résolu —
 *     celui du client quand il y a une session, celui de la démonstration
 *     sinon — donc rien à aller chercher côté serveur ;
 *   - les couleurs sont celles d'un bouton existant du thème, relevées en
 *     style calculé, et l'encre est retenue par le rapport de contraste, pas
 *     par la teinte qu'on aurait devinée ;
 *   - la barre s'efface d'elle-même si le thème possède déjà un appel à
 *     l'action épinglé et visible. Les 56 thèmes de la série 328-383 en ont
 *     un depuis leur propre correctif : ils ne verront jamais cette barre.
 */

/** Luminance relative, au sens du calcul de contraste WCAG. */
function luminance(couleur: string): number {
  const m = couleur.match(/[\d.]+/g);
  if (!m || m.length < 3) return 0;
  const [r, g, b] = m.slice(0, 3).map((v) => {
    const x = Number(v) / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/**
 * La cible retenue.
 *
 * `href` quand la page offre un lien — le cas le plus courant. `agir` sinon :
 * dix-neuf thèmes du catalogue portent leur menu et leur « Contact » en
 * `<button>`, sans aucun `<a>` pour les joindre. On ne peut pas loger cela
 * dans un `href` ; on amène alors soi-même à la section de contact, ou l'on
 * transmet le clic au bouton du thème.
 */
type Etat =
  | { href: string; agir?: never; libelle: string; fond: string; encre: string }
  | { href?: never; agir: () => void; libelle: string; fond: string; encre: string }
  | null;

/** Un élément est-il réellement visible à l'écran, et non recouvert ? */
function visible(el: Element): boolean {
  const r = el.getBoundingClientRect();
  if (r.width < 24 || r.height < 18) return false;
  if (r.bottom < 0 || r.top > window.innerHeight) return false;
  const s = getComputedStyle(el);
  if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.2) return false;
  return true;
}

/** L'élément vit-il dans un conteneur épinglé ? */
function epingle(el: Element): boolean {
  for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
    const p = getComputedStyle(n).position;
    if (p === "fixed" || p === "sticky") return true;
  }
  return false;
}

/**
 * Deux états disent-ils la même chose ?
 *
 * On réexamine à chaque image de défilement : sans cette comparaison, chaque
 * passage poserait un objet neuf et ferait rendre la barre en continu.
 */
function memeEtat(a: Etat, b: Etat): boolean {
  if (a === null || b === null) return a === b;
  return a.href === b.href && a.libelle === b.libelle && a.fond === b.fond && a.encre === b.encre && !a.agir === !b.agir;
}

const MOTS =
  /(r[ée]serv|rendez|devis|appel|contact|rappel|essai|inscri|demande|commander|joindre|visite|bilan|estimation|chiffrer|parler|organiser|bloquer|confier|panier|course|projet|audit|d[ée]gustation|urgence|book|call|quote)/i;

export function BarreActionMobile() {
  const [etat, setEtat] = useState<Etat>(null);

  useEffect(() => {
    /*
      On attend que la page soit posée. Les thèmes vont chercher leur session
      après le montage : le numéro du client n'est dans le DOM qu'ensuite, et
      les animations d'entrée durent jusqu'à une seconde et demie. Plusieurs
      passages valent mieux qu'un seul trop tôt — certains thèmes ne rendent
      leur pied de page, et donc leur adresse, qu'après quatre secondes.
    */
    const minuteries = [1400, 3200, 6000].map((delai) => setTimeout(examiner, delai));

    /*
      Et l'on réexamine au défilement.

      Sans cela, un thème dont la barre de navigation se masque en descendant
      passait entre les mailles : à l'arrêt son bouton de contact est bien
      épinglé et visible, donc notre barre s'efface — puis la barre du thème
      disparaît et il ne reste plus rien. Mesuré sur impact-311. Le sens
      inverse vaut aussi : si la barre du thème revient, la nôtre repart.
    */
    let enAttente = false;
    const auDefilement = () => {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(() => {
        enAttente = false;
        examiner();
      });
    };
    window.addEventListener("scroll", auDefilement, { passive: true });

    /*
      Et après chaque clic : c'est ainsi que la bannière de consentement s'en
      va. Sans ce réexamen, la barre resterait cachée jusqu'au premier
      défilement alors que la place est libre.
    */
    let apresClic: ReturnType<typeof setTimeout>[] = [];
    const auClic = () => {
      apresClic.forEach(clearTimeout);
      /*
        Deux passages, pas un. La bannière ne quitte pas l'écran à l'instant du
        clic : elle s'en va en fondu. Vérifié — à 400 ms elle était encore
        posée, et la barre restait cachée jusqu'au premier défilement.
      */
      apresClic = [400, 1300].map((d) => setTimeout(examiner, d));
    };
    document.addEventListener("click", auClic, { passive: true, capture: true });

    /** Ne remplace l'état que s'il a changé. */
    const poser = (suivant: Etat) => setEtat((avant) => (memeEtat(avant, suivant) ? avant : suivant));

    function examiner() {
      /* Cette barre ne s'affiche que sur téléphone : inutile d'examiner
         au-delà, et le style s'en charge de toute façon. */
      if (window.innerWidth > 900) return;

      /*
        Le thème a-t-il déjà un appel à l'action qui reste à l'écran ? On
        cherche large — la classe posée par lib/templates/ActionMobile sur la
        série 328-383, ou n'importe quel lien d'action épinglé et visible.
      */
      if (document.querySelector(".aevia-action-mobile")) return poser(null);
      const dejaEpingle = [...document.querySelectorAll("a[href], button")].some((el) => {
        if (el.closest("[data-barre-action]")) return false;
        const href = (el.getAttribute("href") ?? "").toLowerCase();
        const texte = (el.textContent ?? "").trim();
        const estAction =
          href.startsWith("tel:") || href.startsWith("mailto:") || (texte.length > 2 && texte.length < 60 && MOTS.test(texte));
        return estAction && visible(el) && epingle(el);
      });
      if (dejaEpingle) return poser(null);

      /*
        Tant que la bannière de consentement est là, on s'efface.

        Vu à l'écran : notre barre, en z-index 90, recouvrait les boutons
        « Tout refuser / Personnaliser / Tout accepter » d'une bannière posée
        en z-index 50 au bas de l'écran. Le visiteur ne pouvait plus répondre.
        Un appel à l'action ne vaut pas qu'on bloque un choix réglementaire :
        la barre revient dès que la bannière est écartée.
      */
      const consentement = [...document.querySelectorAll<HTMLElement>("body *")].some((el) => {
        if (el.closest("[data-barre-action]")) return false;
        const st = getComputedStyle(el);
        if (st.position !== "fixed") return false;
        const b = el.getBoundingClientRect();
        if (b.height < 60 || b.bottom < window.innerHeight - 60) return false;
        return /cookie|consent|accepter|refuser|personnaliser/i.test(el.textContent ?? "");
      });
      if (consentement) return poser(null);

      /*
        La cible, par ordre de préférence mesuré sur le catalogue. Le lien
        `tel:` porte le numéro déjà résolu par le thème — celui du client s'il
        y a une session, celui de la démonstration sinon. Aller le rechercher
        côté serveur reviendrait à refaire ce travail, et à risquer de ne pas
        dire la même chose que le reste de la page.

        La page de contact vient après les ancres : une bonne part du
        catalogue est en plusieurs pages et n'a pas de section #contact —
        chercher une ancre seule laissait cent trois thèmes sans rien, alors
        que leur contact existe, à /templates/impact-N/contact.
      */
      /*
        Un lien qui revient à la page courante ne mène nulle part. Le cas
        existe : certains thèmes portent une barre de navigation dont TOUS les
        liens — « Accueil », « Boutique », « Contact » — pointent vers
        /templates/impact-N, la page elle-même. Le repli par le texte tombait
        droit dedans et aurait affiché un bouton « Nous contacter » sans
        destination. Mieux vaut pas de barre qu'une barre qui ment.
      */
      const mene = (a: HTMLAnchorElement | undefined | null) => {
        if (!a) return null;
        const brut = a.getAttribute("href") ?? "";
        if (!brut || brut === "#") return null;
        if (/^(tel:|mailto:)/i.test(brut)) return a;
        try {
          const u = new URL(brut, location.href);
          if (u.pathname === location.pathname && !u.hash) return null;
        } catch {
          return null;
        }
        return a;
      };

      const lien =
        mene(document.querySelector<HTMLAnchorElement>('a[href^="tel:"]')) ??
        mene(document.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')) ??
        mene(document.querySelector<HTMLAnchorElement>('a[href*="#contact"]')) ??
        mene(
          document.querySelector<HTMLAnchorElement>('a[href$="/contact"], a[href*="/contact?"], a[href*="/contact#"]'),
        ) ??
        [...document.querySelectorAll<HTMLAnchorElement>("a[href]")]
          .filter((a) => /contact|nous joindre|rendez-vous|devis/i.test((a.textContent ?? "").trim()))
          .map(mene)
          .find(Boolean);

      /*
        À défaut de lien : la section de contact elle-même.

        Essayé d'abord avec le bouton « Contact » du thème, relayé par un
        clic. Vérifié à l'écran : sur impact-21 la page ne bougeait pas — ce
        bouton vit dans la barre de bureau masquée, largeur 0, et son
        gestionnaire ne répond pas. La section, elle, porte bien un
        id="contact". On y va donc directement, ce qui ne dépend d'aucun
        état de menu. Le relais par bouton ne sert plus qu'en dernier ressort.
      */
      const candidate = lien
        ? null
        : (document.getElementById("contact") ??
          [...document.querySelectorAll<HTMLElement>("[id]")].find((el) => /^contact/i.test(el.id)) ??
          null);
      /*
        Encore faut-il qu'y aller déplace la page. Certains thèmes empilent
        leurs panneaux au même endroit et changent d'écran au clic plutôt que
        de défiler : leur section de contact est à offsetTop 0, et
        scrollIntoView n'y fait rien. Vérifié sur impact-21 — la barre
        s'affichait et le bouton ne bougeait rien. Un bouton mort est pire que
        pas de bouton.
      */
      const section = candidate && candidate.offsetTop > 200 ? candidate : null;

      const relais =
        lien || section
          ? null
          : [...document.querySelectorAll<HTMLButtonElement>("button")].find((el) => {
              if (el.closest("[data-barre-action]")) return false;
              if (el.getBoundingClientRect().width < 10) return false; /* bouton masqué : son gestionnaire ne répond pas */
              const t = (el.textContent ?? "").trim();
              return t.length > 2 && t.length < 40 && /contact|rendez-vous|rdv|devis|appel|commander|r[ée]serv/i.test(t);
            }) ?? null;

      if (!lien && !section && !relais) return poser(null);

      const href = lien?.getAttribute("href") ?? null;
      const libelle = !href
        ? "Nous contacter"
        : href.startsWith("tel:")
          ? "Appeler"
          : href.startsWith("mailto:")
            ? "Nous écrire"
            : "Nous contacter";

      /*
        Les couleurs sont celles du thème, relevées sur un bouton existant :
        on prend l'aplat le plus fréquent parmi les liens et boutons qui en
        portent un, ce qui donne l'accent de la page sans le deviner.
      */
      const aplats = new Map<string, number>();
      for (const el of document.querySelectorAll("a, button")) {
        const f = getComputedStyle(el).backgroundColor;
        if (!f || f === "rgba(0, 0, 0, 0)" || f === "transparent") continue;
        if (luminance(f) > 0.92) continue; /* un bouton blanc n'est pas l'accent */
        aplats.set(f, (aplats.get(f) ?? 0) + 1);
      }
      const fond = [...aplats.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "rgb(17,17,17)";

      /* L'encre est celle qui contraste le mieux — mesurée, pas choisie. */
      const encre = contraste(fond, "rgb(255,255,255)") >= contraste(fond, "rgb(16,16,16)") ? "#ffffff" : "#101010";

      poser(
        href
          ? { href, libelle, fond, encre }
          : {
              agir: section
                ? () => section.scrollIntoView({ behavior: "smooth", block: "start" })
                : () => relais!.click(),
              libelle,
              fond,
              encre,
            },
      );
    }

    return () => {
      minuteries.forEach(clearTimeout);
      apresClic.forEach(clearTimeout);
      window.removeEventListener("scroll", auDefilement);
      document.removeEventListener("click", auClic, { capture: true });
    };
  }, []);

  /*
    Le pied de page doit pouvoir se lire en entier : la barre le recouvrirait
    sinon. On rend la hauteur au document plutôt que d'espérer que personne ne
    défile jusqu'en bas.
  */
  useEffect(() => {
    if (!etat) return;
    const avant = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "calc(68px + env(safe-area-inset-bottom, 0px))";
    return () => {
      document.body.style.paddingBottom = avant;
    };
  }, [etat]);

  if (!etat) return null;

  /*
    Un lien quand la page en offre un, un bouton relais sinon : on ne peut pas
    loger un <button> du thème dans un href, alors on lui transmet le clic.
    Même dessin dans les deux cas, seule la balise change.
  */
  const habit = {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    width: "100%",
    gap: 9,
    /* 48 px : au-dessus des 44 px de cible tactile que le balayage du
       catalogue applique déjà aux liens de barre et de pied de page. */
    minHeight: 48,
    border: "none",
    borderRadius: 10,
    background: etat.fond,
    color: etat.encre,
    fontSize: 15.5,
    fontWeight: 700,
    letterSpacing: "0.01em",
    textDecoration: "none",
    fontFamily: "inherit",
    cursor: "pointer",
  };

  const contenu = (
    <>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1l-2.22 2.2Z"
          fill="currentColor"
        />
      </svg>
      {etat.libelle}
    </>
  );

  return (
    <div
      data-barre-action=""
      className="aevia-barre-action"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 90,
        padding: "10px 14px calc(10px + env(safe-area-inset-bottom, 0px))",
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(12px) saturate(140%)",
        WebkitBackdropFilter: "blur(12px) saturate(140%)",
        borderTop: "1px solid rgba(0,0,0,0.10)",
        boxShadow: "0 -8px 28px -18px rgba(0,0,0,0.5)",
      }}
    >
      {etat.href ? (
        <a href={etat.href} style={habit}>
          {contenu}
        </a>
      ) : (
        <button type="button" onClick={() => etat.agir?.()} style={habit}>
          {contenu}
        </button>
      )}
    </div>
  );
}
