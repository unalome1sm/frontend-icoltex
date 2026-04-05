/**
 * Medios de la home (banner, bloques de imagen).
 * Videos del banner: archivos en `public/media/banner/` (Drive no permite iframe en tu dominio).
 */

/** Nombres de archivo en `public/media/banner/` (el carrusel los recorre en este orden). */
export const HOME_BANNER_CLIP_FILES = [
  "CLIPS PORTADA.mov",
  "ICOLTEX27(1).mov",
  "ICOLTEX21.mov",
] as const;

function toPublicBannerPath(filename: string): string {
  return `/media/banner/${encodeURIComponent(filename)}`;
}

/**
 * Lista de URLs públicas de los videos del carrusel.
 * - `NEXT_PUBLIC_BANNER_VIDEO_SRCS`: varias rutas/URLs separadas por coma o `;`.
 * - Si no, `NEXT_PUBLIC_BANNER_VIDEO_SRC` (una sola) sustituye toda la lista por ese único clip.
 * - Si no hay env: se usan `HOME_BANNER_CLIP_FILES`.
 */
export function getBannerVideoSources(): string[] {
  if (typeof process === "undefined") {
    return [...HOME_BANNER_CLIP_FILES].map(toPublicBannerPath);
  }

  const multi = process.env.NEXT_PUBLIC_BANNER_VIDEO_SRCS?.trim() ?? "";
  if (multi.length > 0) {
    return multi
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const single = process.env.NEXT_PUBLIC_BANNER_VIDEO_SRC?.trim() ?? "";
  if (single.length > 0) return [single];

  return [...HOME_BANNER_CLIP_FILES].map(toPublicBannerPath);
}

/** @deprecated Usa `getBannerVideoSources()`; devuelve el primer clip por compatibilidad. */
export function getBannerVideoSrc(): string {
  const all = getBannerVideoSources();
  return all[0] ?? "";
}

/** Enlace al archivo fuente en Drive (solo referencia). */
export const HOME_BANNER_VIDEO_DRIVE_URL =
  "https://drive.google.com/file/d/1pVZTsax2WqnMDnn1cTpfNpwOM98AINzt/view?usp=drive_link";

export const HOME_BANNER_IMAGE_SLIDES: { driveOrImageUrl: string; alt: string }[] = [
  // { driveOrImageUrl: "https://drive.google.com/file/d/XXXX/view", alt: "Colección" },
];

/** Sub-banner (dos columnas): rutas en `public/media/banner/` — imagen (.webp, etc.) o video (.mov, .mp4). */
export const HOME_TWO_PANEL_IMAGES: { left?: string; right?: string } = {
  left: toPublicBannerPath("ICOLTEX10(1).mov"),
  right: toPublicBannerPath("ICOLTEX18.mov"),
};
