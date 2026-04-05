/**
 * Extrae el file id de enlaces típicos de Google Drive (compartir, /file/d/, open?id=).
 */
export function extractGoogleDriveFileId(input: string): string | null {
  const t = input.trim();
  const filePath = t.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (filePath) return filePath[1];
  const openId = t.match(/[?&]id=([^&]+)/);
  if (openId) return openId[1];
  if (/^[a-zA-Z0-9_-]{15,}$/.test(t)) return t;
  return null;
}

/**
 * URL del reproductor embebido (iframe) para video en Drive.
 * `autoplay=1` pide inicio automático (Drive / el navegador pueden seguir pidiendo interacción o silencio).
 */
export function googleDriveVideoPreviewUrl(shareUrlOrId: string): string | null {
  const id = extractGoogleDriveFileId(shareUrlOrId);
  if (!id) return null;
  const base = `https://drive.google.com/file/d/${id}/preview`;
  const q = new URLSearchParams();
  q.set("autoplay", "1");
  return `${base}?${q.toString()}`;
}
