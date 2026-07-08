import type { Metadata } from "next";

export const SITE_NAME = "Icoltex";
export const DEFAULT_DESCRIPTION =
  "E‑commerce de telas de alta calidad. Catálogo de telas para confección, decoración y proyectos textiles en Colombia.";

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const segment = path.startsWith("/") ? path : `/${path}`;
  return `${base}${segment}`;
}

export function toAbsoluteImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return absoluteUrl(url);
}

const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export function noIndexMetadata(title?: string): Metadata {
  return {
    ...(title ? { title } : {}),
    robots: NOINDEX_ROBOTS,
  };
}

export function pageMetadata(input: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const description = input.description ?? DEFAULT_DESCRIPTION;
  const canonical = input.path;
  const image = toAbsoluteImageUrl(input.image);

  return {
    title: input.title,
    description,
    ...(canonical
      ? {
          alternates: { canonical },
        }
      : {}),
    openGraph: {
      title: input.title,
      description,
      siteName: SITE_NAME,
      locale: "es_CO",
      type: "website",
      ...(canonical ? { url: absoluteUrl(canonical) } : {}),
      ...(image ? { images: [{ url: image, alt: input.title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: input.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export type ProductJsonLdInput = {
  id: string;
  name: string;
  description?: string;
  imageUrls?: string[];
  price?: number;
  currency?: string;
  inStock: boolean;
  sku?: string;
  category?: string;
};

export function buildProductJsonLd(product: ProductJsonLdInput): Record<string, unknown> {
  const images = (product.imageUrls ?? [])
    .map((url) => toAbsoluteImageUrl(url))
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(images.length ? { image: images } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.category ? { category: product.category } : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/shop/${product.id}`),
      priceCurrency: product.currency ?? "COP",
      price: product.price ?? 0,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path?: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}
