import type { Metadata } from "next";
import { ICOLTEX_INFO_SECTIONS } from "@/components/info/infoNav";
import { pageMetadata } from "./seo";

const EXTRA_ABOUT_META: Record<string, { title: string; description: string }> = {
  politicas: {
    title: "Políticas",
    description:
      "Políticas de garantías, devoluciones y condiciones de compra en Icoltex.",
  },
  promociones: {
    title: "Promociones",
    description:
      "Términos y condiciones de las promociones vigentes en Icoltex.",
  },
};

function buildAboutMetaMap(): Record<string, { title: string; description: string }> {
  const map: Record<string, { title: string; description: string }> = {
    ...EXTRA_ABOUT_META,
  };

  for (const section of ICOLTEX_INFO_SECTIONS) {
    if (section.items) {
      for (const item of section.items) {
        const slug = item.href.replace(/^\/about\//, "");
        map[slug] = {
          title: item.label,
          description: `${item.label} — información oficial de Icoltex, tienda de telas en Colombia.`,
        };
      }
    }
    if (section.groups) {
      for (const group of section.groups) {
        for (const item of group.items) {
          const slug = item.href.replace(/^\/about\//, "");
          map[slug] = {
            title: item.label,
            description: `${item.label} — ${group.label.toLowerCase()} en Icoltex.`,
          };
        }
      }
    }
  }

  return map;
}

const ABOUT_META = buildAboutMetaMap();

export function aboutPageMetadata(slug: string): Metadata {
  const entry = ABOUT_META[slug];
  if (!entry) {
    return pageMetadata({
      title: "Acerca de Icoltex",
      path: `/about/${slug}`,
    });
  }

  return pageMetadata({
    title: entry.title,
    description: entry.description,
    path: `/about/${slug}`,
  });
}

export function getAllAboutPaths(): string[] {
  return Object.keys(ABOUT_META).map((slug) => `/about/${slug}`);
}
