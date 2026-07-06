
export type ProductCardData = {
  id: string;
  nombre: string;
  descripcion?: string;
  precioMetro?: number;
  colores?: string;
  imageUrls?: string[];
  isNew?: boolean;
};

export type ProductResponse = {
  _id: string;
  nombre: string;
  caracteristica?: string;
  precioMetro?: number;
  colores?: string;
  imageUrls?: string[];
};

const PROXY_PATH = "/api/images/proxy";

function isDriveImageUrl(url: string): boolean {
  return (
    url.includes("drive.google.com") || url.includes("lh3.googleusercontent.com")
  );
}

/** Normaliza URLs ya proxied (absolutas o relativas) a ruta relativa same-origin. */
function normalizeProxiedImageUrl(url: string): string | null {
  if (!url.includes(PROXY_PATH)) return null;
  if (url.startsWith(`${PROXY_PATH}?`)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.endsWith(PROXY_PATH) || parsed.pathname.includes(`${PROXY_PATH}`)) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    const idx = url.indexOf(PROXY_PATH);
    if (idx >= 0) return url.slice(idx);
  }
  return null;
}

function buildProxiedImageUrl(directUrl: string): string {
  return `${PROXY_PATH}?url=${encodeURIComponent(directUrl)}`;
}

export function toDirectImageUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  const proxied = normalizeProxiedImageUrl(t);
  if (proxied) {
    try {
      const params = new URL(proxied, "http://local").searchParams;
      const inner = params.get("url");
      if (inner) return inner;
    } catch {
      /* keep original */
    }
  }
  if (/drive\.google\.com\/uc\?export=view&id=/.test(t)) return t;
  const file = t.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (file) return `https://drive.google.com/uc?export=view&id=${file[1]}`;
  const open = t.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (open) return `https://drive.google.com/uc?export=view&id=${open[1]}`;
  return t;
}

export function getImageDisplayUrl(directUrl: string): string {
  if (!directUrl) return "";
  const proxied = normalizeProxiedImageUrl(directUrl);
  if (proxied) return proxied;
  if (isDriveImageUrl(directUrl)) {
    return buildProxiedImageUrl(directUrl);
  }
  return directUrl;
}

export function mapImageUrlsForDisplay(urls: string[]): string[] {
  return urls
    .map((u) => getImageDisplayUrl(toDirectImageUrl(u)))
    .filter(Boolean);
}

export function toProductCardData(p: ProductResponse): ProductCardData {
  const imageUrls = mapImageUrlsForDisplay(p.imageUrls ?? []);
  return {
    id: p._id,
    nombre: p.nombre,
    descripcion: p.caracteristica,
    precioMetro: p.precioMetro,
    colores: p.colores,
    imageUrls: imageUrls.length ? imageUrls : undefined,
  };
}
