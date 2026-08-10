"use client";

import Link from "next/link";
import {
  chunkCategorias,
  shopUrlForLinea,
  type NavCatalogItem,
} from "@/lib/catalog";

type NavMegaMenuProps = {
  item: NavCatalogItem;
  linea: string;
  productos: string[];
  loading?: boolean;
  onClose: () => void;
};

export function NavMegaMenu({
  item,
  linea,
  productos,
  loading,
  onClose,
}: NavMegaMenuProps) {
  const columns = chunkCategorias(productos);
  const verTodoHref = shopUrlForLinea(linea);

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
          <p className="py-4 text-sm text-slate-500">Cargando productos…</p>
        ) : columns.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">
            No hay productos disponibles para {item.label}.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            {columns.map((column, colIndex) => (
              <ul key={colIndex} className="space-y-2.5">
                {column.map((producto) => (
                  <li key={producto}>
                    <Link
                      href={shopUrlForLinea(linea, producto)}
                      onClick={onClose}
                      className="text-sm text-slate-700 transition-colors hover:text-red-600"
                    >
                      {producto}
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
