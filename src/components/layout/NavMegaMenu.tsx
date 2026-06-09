"use client";

import Link from "next/link";
import {
  chunkCategorias,
  shopUrlForClase,
  type NavCatalogItem,
} from "@/lib/navCatalog";

type NavMegaMenuProps = {
  item: NavCatalogItem;
  classFamily: string;
  categorias: string[];
  loading?: boolean;
  onClose: () => void;
};

export function NavMegaMenu({
  item,
  classFamily,
  categorias,
  loading,
  onClose,
}: NavMegaMenuProps) {
  const columns = chunkCategorias(categorias);
  const verTodoHref = shopUrlForClase(classFamily);

  return (
    <div
      className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg"
      role="region"
      aria-label={`Menú ${item.label}`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <Link
            href={verTodoHref}
            onClick={onClose}
            className="text-sm font-semibold text-slate-900 hover:text-red-600"
          >
            Ver todo en {item.label}
          </Link>
        </div>

        {loading ? (
          <p className="py-4 text-sm text-slate-500">Cargando categorías…</p>
        ) : columns.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">
            No hay categorías disponibles para {item.label}.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            {columns.map((column, colIndex) => (
              <ul key={colIndex} className="space-y-2.5">
                {column.map((categoria) => (
                  <li key={categoria}>
                    <Link
                      href={shopUrlForClase(classFamily, categoria)}
                      onClick={onClose}
                      className="text-sm text-slate-700 transition-colors hover:text-red-600"
                    >
                      {categoria}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
