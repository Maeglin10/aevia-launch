/**
 * Contrôle des photos avant téléversement.
 *
 * Une photo de 640 px étirée sur un hero pleine largeur est floue sur tous les
 * écrans depuis dix ans, et le client ne le voit qu'une fois le site en ligne —
 * moment où il nous écrit. Le dire au moment du choix coûte une seconde et
 * évite l'aller-retour.
 *
 * On mesure dans le navigateur : c'est immédiat, gratuit, et ça évite de
 * téléverser un fichier qu'on refusera ensuite.
 */

export interface ImageVerdict {
  ok: boolean;
  /** Bloquant : le fichier ne part pas. */
  erreur?: string;
  /** Non bloquant : le fichier part, le client est prévenu. */
  avertissement?: string;
  width?: number;
  height?: number;
}

/** Le hero est pleine largeur : il demande plus que les vignettes de section. */
const MIN_HERO = 1600;
const MIN_SECTION = 800;
/** En dessous, l'image est inutilisable quelle que soit sa place. */
const MIN_ABSOLU = 500;
const MAX_OCTETS = 5 * 1024 * 1024;

const FORMATS = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

export async function checkImage(file: File, slotIndex: number): Promise<ImageVerdict> {
  if (!FORMATS.has(file.type)) {
    return { ok: false, erreur: "Format non accepté. Utilisez un JPG, un PNG ou un WebP." };
  }
  if (file.size > MAX_OCTETS) {
    const mo = (file.size / 1024 / 1024).toFixed(1);
    return {
      ok: false,
      erreur: `Fichier trop lourd (${mo} Mo, maximum 5 Mo). Réduisez la taille avant d'envoyer.`,
    };
  }

  let width = 0;
  let height = 0;
  try {
    const bitmap = await createImageBitmap(file);
    width = bitmap.width;
    height = bitmap.height;
    bitmap.close?.();
  } catch {
    // Un fichier que le navigateur n'ouvre pas n'est pas une image, quel que
    // soit ce que dit son type MIME.
    return { ok: false, erreur: "Ce fichier n'est pas une image lisible." };
  }

  const petitCote = Math.min(width, height);
  const grandCote = Math.max(width, height);

  if (grandCote < MIN_ABSOLU) {
    return {
      ok: false,
      erreur: `Image trop petite (${width}×${height}). Il en faut au moins ${MIN_ABSOLU} px de large.`,
      width,
      height,
    };
  }

  const attendu = slotIndex === 0 ? MIN_HERO : MIN_SECTION;
  if (grandCote < attendu) {
    return {
      ok: true,
      avertissement:
        slotIndex === 0
          ? `${width}×${height} — un peu juste pour l'image principale, qui s'affiche pleine largeur. ${MIN_HERO} px conseillés.`
          : `${width}×${height} — ${MIN_SECTION} px conseillés pour rester net.`,
      width,
      height,
    };
  }

  // Une photo très allongée sera recadrée au centre par le thème : autant que
  // le client le sache avant de découvrir que le sujet a disparu.
  if (grandCote / petitCote > 3) {
    return {
      ok: true,
      avertissement: `Format très allongé (${width}×${height}) : le thème recadrera au centre.`,
      width,
      height,
    };
  }

  return { ok: true, width, height };
}
