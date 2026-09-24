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
  type NavMegaMenuColumn,
  type NavMegaMenuLink,
} from "@/lib/catalog";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

type NavMegaMenuProps = {
  item: NavCatalogItem;
  linea: string;
  columns: NavMegaMenuColumn[];
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
  columns,
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

  function handleColumnsLeave() {
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
          ) : columns.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">
              No hay filtros disponibles para {item.label}.
            </p>
          ) : (
            <div
              className="flex items-start gap-x-8 lg:gap-x-10"
              onMouseLeave={handleColumnsLeave}
            >
              {columns.map((column, colIndex) => (
                <ul
                  key={`col-${colIndex}`}
                  className="min-w-0 flex-1 space-y-2.5"
                >
                  {column.cells.map((cell, cellIndex) => {
                    if (cell.kind === "heading") {
                      return (
                        <li
                          key={`h-${cell.title}-${cellIndex}`}
                          className="text-sm font-semibold text-slate-900"
                        >
                          {cell.title}
                        </li>
                      );
                    }
                    return (
                      <li key={`${cell.link.kind}:${cell.link.filterValue}:${cellIndex}`}>
                        <Link
                          href={navMegaMenuHref(linea, cell.link)}
                          onClick={onClose}
                          onMouseEnter={() => handleLinkEnter(cell.link)}
                          className="text-sm text-slate-600 transition-colors hover:text-red-600"
                        >
                          {cell.link.displayLabel}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
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
