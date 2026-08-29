/*
  Écrire le contenu d'un site depuis ce que le client a dit, dans sa langue.

  Le repli de génération — celui qui sert quand les fournisseurs libres ne
  répondent pas — choisissait un jeu de phrases toutes faites selon le métier et
  n'employait aucune donnée du client. Un plombier de Bourg-en-Bresse tombant sur
  le jeu « Agency » recevait « Digital experiences that convert », trois
  prestations nommées « Web Design », « Development », « SEO & Growth », et des
  avis signés « James K., CEO, TechStart ».

  Seize des dix-neuf jeux étaient en anglais. La consigne de génération, elle,
  imposait le français quelle que soit la langue choisie par le visiteur : un
  client espagnol recevait un site français, et si la génération échouait, un
  site anglais.

  Ici, chaque phrase est bâtie sur ce que le formulaire a recueilli — le nom, le
  métier, la ville, la prestation principale, les bénéfices, la cible — et dans
  la langue du visiteur. Rien n'est inventé : ce que le client n'a pas dit
  n'apparaît pas.

  Les avis font exception, et c'est délibérément le minimum : trois lignes
  neutres qui ne prêtent au client aucun fait vérifiable. Un site marchand qui
  publie des avis fabriqués s'expose au titre des pratiques commerciales
  trompeuses ; c'est au client de les remplacer par les siens, et le formulaire
  le lui demande.
*/
import type { FormData, GeneratedContent } from "./sessions";

interface Cadre {
  /* « Notre histoire », « About us »… */
  aProposTitre: string;
  /* Ce que fait le métier, quand le client n'a rien précisé. */
  metierParDefaut: string;
  a: (lieu: string) => string;
  pour: (cible: string) => string;
  accrocheSansService: (metier: string) => string;
  sousTitre: (parts: string[]) => string;
  aPropos: (d: Donnees) => string;
  prestationTitres: string[];
  prestation: (titre: string, d: Donnees) => string;
  appel: string;
  avis: Array<{ name: string; role: string; text: string }>;
  meta: (d: Donnees) => string;
}

interface Donnees {
  nom: string;
  metier: string;
  ville: string;
  service: string;
  benefices: string[];
  cible: string;
  tarifs: string;
  accroche: string;
}

const capitale = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const liste = (xs: string[], et: string) =>
  xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} ${et} ${xs.at(-1)}`;

const CADRES: Record<string, Cadre> = {
  fr: {
    aProposTitre: "Notre métier",
    metierParDefaut: "notre métier",
    a: (l) => ` à ${l}`,
    pour: (c) => ` pour ${c}`,
    accrocheSansService: (m) => `${capitale(m)}, fait comme il faut`,
    sousTitre: (p) => p.join(" · "),
    aPropos: (d) =>
      `${d.nom} exerce${d.ville ? ` à ${d.ville}` : ""} ${d.metier === "notre métier" ? "" : `comme ${d.metier} `}` +
      `et travaille ${d.cible ? `avec ${d.cible}` : "au cas par cas"}. ` +
      (d.benefices.length
        ? `Ce sur quoi nous ne cédons rien : ${liste(d.benefices.slice(0, 3), "et")}.`
        : `Chaque demande est étudiée sur place, et chiffrée avant d'engager quoi que ce soit.`),
    prestationTitres: ["Le premier échange", "L'intervention", "Après"],
    prestation: (titre, d) =>
      titre === "Le premier échange"
        ? `Vous nous exposez le besoin, nous vous disons ce qui est possible et ce qui ne l'est pas. ${d.tarifs ? `Tarifs : ${d.tarifs}.` : "Devis avant tout engagement."}`
        : titre === "L'intervention"
          ? `${d.service ? capitale(d.service) : capitale(d.metier)}, mené par la même personne du début à la fin${d.ville ? `, ${d.ville} et alentour` : ""}.`
          : `Nous restons joignables après coup. Une reprise, une question, un réglage : vous appelez, nous répondons.`,
    appel: "Nous écrire",
    avis: [
      { name: "Avis à venir", role: "", text: "Cette place attend le premier avis de vos clients." },
      { name: "Avis à venir", role: "", text: "Vous pourrez les recopier ici depuis Google ou vos courriels." },
      { name: "Avis à venir", role: "", text: "Trois avis suffisent à rassurer un visiteur qui hésite." },
    ],
    meta: (d) => `${d.nom}${d.ville ? ` à ${d.ville}` : ""} — ${d.service || d.metier}. Devis et prise de contact directe.`,
  },

  en: {
    aProposTitre: "What we do",
    metierParDefaut: "our trade",
    a: (l) => ` in ${l}`,
    pour: (c) => ` for ${c}`,
    accrocheSansService: (m) => `${capitale(m)}, done properly`,
    sousTitre: (p) => p.join(" · "),
    aPropos: (d) =>
      `${d.nom} works${d.ville ? ` in ${d.ville}` : ""} ${d.metier ? `as ${d.metier} ` : ""}` +
      `${d.cible ? `with ${d.cible}` : "case by case"}. ` +
      (d.benefices.length
        ? `What we never compromise on: ${liste(d.benefices.slice(0, 3), "and")}.`
        : `Every request is assessed on site and quoted before anything is committed.`),
    prestationTitres: ["The first conversation", "The work", "Afterwards"],
    prestation: (titre, d) =>
      titre === "The first conversation"
        ? `You tell us what you need, we tell you what is and isn't possible. ${d.tarifs ? `Rates: ${d.tarifs}.` : "A quote before any commitment."}`
        : titre === "The work"
          ? `${d.service ? capitale(d.service) : capitale(d.metier)}, handled by the same person from start to finish${d.ville ? `, in and around ${d.ville}` : ""}.`
          : `We stay reachable afterwards. A touch-up, a question, an adjustment: you call, we answer.`,
    appel: "Get in touch",
    avis: [
      { name: "Review pending", role: "", text: "This space is waiting for your first customer review." },
      { name: "Review pending", role: "", text: "You can copy them here from Google or from your emails." },
      { name: "Review pending", role: "", text: "Three reviews are enough to reassure a hesitant visitor." },
    ],
    meta: (d) => `${d.nom}${d.ville ? ` in ${d.ville}` : ""} — ${d.service || d.metier}. Quotes and direct contact.`,
  },

  es: {
    aProposTitre: "Nuestro oficio",
    metierParDefaut: "nuestro oficio",
    a: (l) => ` en ${l}`,
    pour: (c) => ` para ${c}`,
    accrocheSansService: (m) => `${capitale(m)}, hecho como se debe`,
    sousTitre: (p) => p.join(" · "),
    aPropos: (d) =>
      `${d.nom} trabaja${d.ville ? ` en ${d.ville}` : ""} ${d.metier ? `como ${d.metier} ` : ""}` +
      `${d.cible ? `con ${d.cible}` : "caso por caso"}. ` +
      (d.benefices.length
        ? `Aquello en lo que no cedemos: ${liste(d.benefices.slice(0, 3), "y")}.`
        : `Cada solicitud se estudia sobre el terreno y se presupuesta antes de comprometer nada.`),
    prestationTitres: ["El primer contacto", "La intervención", "Después"],
    prestation: (titre, d) =>
      titre === "El primer contacto"
        ? `Nos cuenta lo que necesita y le decimos qué es posible y qué no. ${d.tarifs ? `Tarifas: ${d.tarifs}.` : "Presupuesto antes de cualquier compromiso."}`
        : titre === "La intervención"
          ? `${d.service ? capitale(d.service) : capitale(d.metier)}, con la misma persona de principio a fin${d.ville ? `, en ${d.ville} y alrededores` : ""}.`
          : `Seguimos disponibles después. Un retoque, una duda, un ajuste: usted llama, nosotros respondemos.`,
    appel: "Escríbanos",
    avis: [
      { name: "Opinión pendiente", role: "", text: "Este espacio espera la primera opinión de sus clientes." },
      { name: "Opinión pendiente", role: "", text: "Podrá copiarlas aquí desde Google o desde sus correos." },
      { name: "Opinión pendiente", role: "", text: "Tres opiniones bastan para tranquilizar a quien duda." },
    ],
    meta: (d) => `${d.nom}${d.ville ? ` en ${d.ville}` : ""} — ${d.service || d.metier}. Presupuesto y contacto directo.`,
  },

  de: {
    aProposTitre: "Unser Handwerk",
    metierParDefaut: "unser Handwerk",
    a: (l) => ` in ${l}`,
    pour: (c) => ` für ${c}`,
    accrocheSansService: (m) => `${capitale(m)} — richtig gemacht`,
    sousTitre: (p) => p.join(" · "),
    aPropos: (d) =>
      `${d.nom} arbeitet${d.ville ? ` in ${d.ville}` : ""} ${d.metier ? `als ${d.metier} ` : ""}` +
      `${d.cible ? `mit ${d.cible}` : "von Fall zu Fall"}. ` +
      (d.benefices.length
        ? `Worauf wir nicht verzichten: ${liste(d.benefices.slice(0, 3), "und")}.`
        : `Jede Anfrage wird vor Ort geprüft und vor jeder Zusage kalkuliert.`),
    prestationTitres: ["Das erste Gespräch", "Die Ausführung", "Danach"],
    prestation: (titre, d) =>
      titre === "Das erste Gespräch"
        ? `Sie schildern Ihr Vorhaben, wir sagen Ihnen, was geht und was nicht. ${d.tarifs ? `Preise: ${d.tarifs}.` : "Angebot vor jeder Zusage."}`
        : titre === "Die Ausführung"
          ? `${d.service ? capitale(d.service) : capitale(d.metier)} — von Anfang bis Ende in derselben Hand${d.ville ? `, in ${d.ville} und Umgebung` : ""}.`
          : `Wir bleiben danach erreichbar. Eine Nacharbeit, eine Frage, eine Einstellung: Sie rufen an, wir antworten.`,
    appel: "Schreiben Sie uns",
    avis: [
      { name: "Bewertung folgt", role: "", text: "Dieser Platz wartet auf die erste Bewertung Ihrer Kunden." },
      { name: "Bewertung folgt", role: "", text: "Sie können sie hier aus Google oder aus Ihren E-Mails übernehmen." },
      { name: "Bewertung folgt", role: "", text: "Drei Bewertungen genügen, um einen zögernden Besucher zu überzeugen." },
    ],
    meta: (d) => `${d.nom}${d.ville ? ` in ${d.ville}` : ""} — ${d.service || d.metier}. Angebot und direkter Kontakt.`,
  },

  pt: {
    aProposTitre: "O nosso ofício",
    metierParDefaut: "o nosso ofício",
    a: (l) => ` em ${l}`,
    pour: (c) => ` para ${c}`,
    accrocheSansService: (m) => `${capitale(m)}, feito como deve ser`,
    sousTitre: (p) => p.join(" · "),
    aPropos: (d) =>
      `${d.nom} trabalha${d.ville ? ` em ${d.ville}` : ""} ${d.metier ? `como ${d.metier} ` : ""}` +
      `${d.cible ? `com ${d.cible}` : "caso a caso"}. ` +
      (d.benefices.length
        ? `Aquilo em que não cedemos: ${liste(d.benefices.slice(0, 3), "e")}.`
        : `Cada pedido é avaliado no local e orçamentado antes de qualquer compromisso.`),
    prestationTitres: ["O primeiro contacto", "A intervenção", "Depois"],
    prestation: (titre, d) =>
      titre === "O primeiro contacto"
        ? `Diz-nos o que precisa e dizemos-lhe o que é possível e o que não é. ${d.tarifs ? `Preços: ${d.tarifs}.` : "Orçamento antes de qualquer compromisso."}`
        : titre === "A intervenção"
          ? `${d.service ? capitale(d.service) : capitale(d.metier)}, com a mesma pessoa do início ao fim${d.ville ? `, em ${d.ville} e arredores` : ""}.`
          : `Continuamos disponíveis depois. Um retoque, uma dúvida, um ajuste: liga, respondemos.`,
    appel: "Fale connosco",
    avis: [
      { name: "Avaliação pendente", role: "", text: "Este espaço aguarda a primeira avaliação dos seus clientes." },
      { name: "Avaliação pendente", role: "", text: "Poderá copiá-las aqui do Google ou dos seus e-mails." },
      { name: "Avaliação pendente", role: "", text: "Três avaliações bastam para tranquilizar quem hesita." },
    ],
    meta: (d) => `${d.nom}${d.ville ? ` em ${d.ville}` : ""} — ${d.service || d.metier}. Orçamento e contacto direto.`,
  },
};

/** La langue du visiteur, ou le français à défaut. */
export function cadrePour(locale: string | undefined): Cadre {
  return CADRES[(locale ?? "fr").slice(0, 2).toLowerCase()] ?? CADRES.fr;
}

export function contenuDepuisLeClient(formData: FormData): GeneratedContent {
  const cadre = cadrePour(formData.locale);
  const propre = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const d: Donnees = {
    nom: propre(formData.businessName) || cadre.aProposTitre,
    metier: propre(formData.businessType) || cadre.metierParDefaut,
    ville: propre(formData.city),
    service: propre(formData.mainService),
    benefices: (formData.benefits ?? []).map(propre).filter(Boolean),
    cible: propre(formData.targetAudience),
    tarifs: propre(formData.priceRange),
    accroche: propre(formData.tagline),
  };

  /*
     L'ordre compte. La prestation principale est ce que le client a écrit de
     plus précis ; son slogan vient ensuite ; le métier ne sert qu'à défaut, et
     jamais seul — « Couvreur zingueur, fait comme il faut » sonnait comme une
     page non remplie, alors que la ville était là.
  */
  const accroche = d.service
    ? `${capitale(d.service)}${d.ville ? cadre.a(d.ville) : ""}`
    : d.accroche
      ? d.accroche
      : `${capitale(d.metier)}${d.ville ? cadre.a(d.ville) : ""}`;

  const sousTitre = cadre.sousTitre(
    [
      d.accroche === accroche ? "" : d.accroche,
      d.benefices.slice(0, 2).join(" · "),
      d.cible ? cadre.pour(d.cible).trim() : "",
    ].map(propre).filter(Boolean),
  ) || cadre.aPropos(d);

  return {
    heroHeadline: accroche,
    heroSubline: sousTitre,
    aboutTitle: cadre.aProposTitre,
    aboutText: cadre.aPropos(d),
    services: cadre.prestationTitres.map((titre) => ({ title: titre, description: cadre.prestation(titre, d) })),
    testimonials: cadre.avis.map((a) => ({ ...a, rating: 5 })),
    ctaText: cadre.appel,
    metaTitle: `${d.nom}${d.accroche ? ` — ${d.accroche}` : d.service ? ` — ${d.service}` : ""}`.slice(0, 60),
    metaDescription: cadre.meta(d).slice(0, 160),
  };
}
