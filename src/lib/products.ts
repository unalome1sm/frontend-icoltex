import { getApiUrl } from "./api";

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

export function toDirectImageUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  if (/drive\.google\.com\/uc\?export=view&id=/.test(t)) return t;
  const file = t.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (file) return `https://drive.google.com/uc?export=view&id=${file[1]}`;
  const open = t.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (open) return `https://drive.google.com/uc?export=view&id=${open[1]}`;
  return t;
}

export function getImageDisplayUrl(directUrl: string): string {
  if (!directUrl) return "";
  if (
    directUrl.includes("drive.google.com") ||
    directUrl.includes("lh3.googleusercontent.com")
  ) {
    return getApiUrl(`/api/images/proxy?url=${encodeURIComponent(directUrl)}`);
  }
  return directUrl;
}

export function toProductCardData(p: ProductResponse): ProductCardData {
  const imageUrls = (p.imageUrls ?? [])
    .map((u) => getImageDisplayUrl(toDirectImageUrl(u)))
    .filter(Boolean);
  return {
    id: p._id,
    nombre: p.nombre,
    descripcion: p.caracteristica,
    precioMetro: p.precioMetro,
    colores: p.colores,
    imageUrls: imageUrls.length ? imageUrls : undefined,
  };
}
