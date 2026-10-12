"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  navMegaMenuHref,
  previewImageForLinea,
  previewImageForNavFilter,
  type CatalogFilterMeta,
  type NavCatalogItem,
  type NavMegaMenuLink,
  type NavMegaMenuSection,
} from "@/lib/catalog";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

type NavMegaMenuProps = {
  item: NavCatalogItem;
  linea: string;
  sections: NavMegaMenuSection[];
  meta: CatalogFilterMeta | null;
  loading?: boolean;
  onClose: () => void;
};

function resolveMenuImageSrc(src: string): string {
  if (src.startsWith("/") || src.startsWith("data:")) return src;
  return getImageDisplayUrl(toDirectImageUrl(src));
}

export function NavMegaMenu({
  item,
  linea,
  sections,
  meta,
  loading,
  onClose,
}: NavMegaMenuProps) {
  const linePreview = previewImageForLinea(meta, linea);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(linePreview);

  useEffect(() => {
    setPreviewUrl(previewImageForLinea(meta, linea));
  }, [meta, linea, item.id]);

  const resolvedImage = previewUrl ? resolveMenuImageSrc(previewUrl) : undefined;

  function handleLinkEnter(link: NavMegaMenuLink) {
    const next = previewImageForNavFilter(meta, linea, link.kind, link.filterValue);
    setPreviewUrl(next ?? linePreview);
  }

  function handleSectionsLeave() {
    setPreviewUrl(linePreview);
  }

  return (
    <div
      className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg"
      role="region"
      aria-label={`Menú ${item.label}`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-8 px-6 py-6 lg:gap-10 lg:px-8">
        <div className="min-w-0 flex-1">
          {loading ? (
            <p className="py-4 text-sm text-slate-500">Cargando filtros…</p>
          ) : sections.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">
              No hay filtros disponibles para {item.label}.
            </p>
          ) : (
            <div className="space-y-6" onMouseLeave={handleSectionsLeave}>
              {sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    {section.title}
                  </p>
                  <ul className="grid grid-cols-5 gap-x-8 gap-y-2.5">
                    {section.links.map((link) => (
                      <li key={`${link.kind}:${link.filterValue}`}>
                        <Link
                          href={navMegaMenuHref(linea, link)}
                          onClick={onClose}
                          onMouseEnter={() => handleLinkEnter(link)}
                          className="text-sm text-slate-600 transition-colors hover:text-red-600"
                        >
                          {link.displayLabel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative hidden h-[220px] w-[min(280px,28%)] shrink-0 overflow-hidden rounded-xl bg-slate-100 lg:block">
          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={`Colección ${item.label}`}
              fill
              className="object-cover"
              sizes="280px"
              unoptimized
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
