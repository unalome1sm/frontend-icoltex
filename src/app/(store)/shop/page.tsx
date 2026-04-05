"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { ShopFilters, ProductGrid, ShopSortBar } from "@/components/shop";
import type { ProductCardData } from "@/components/shop";
import { fetchGroupedProductsPage, groupedRowToCardData } from "@/lib/groupedCatalog";

const FALLBACK_PRODUCTS: ProductCardData[] = [
  { id: "fallback-1", nombre: "Nombre ítem", descripcion: "Descripción ítem", colores: "A,B,C,D,E", precioMetro: 25000, isNew: true },
  { id: "fallback-2", nombre: "Nombre ítem", descripcion: "Descripción ítem", colores: "A,B,C", precioMetro: 32000 },
  { id: "fallback-3", nombre: "Nombre ítem", descripcion: "Descripción ítem", colores: "A,B,C,D,E,F", precioMetro: 18000, isNew: true },
  { id: "fallback-4", nombre: "Nombre ítem", descripcion: "Descripción ítem", colores: "A,B", precioMetro: 41000 },
];

export default function ShopPage() {
  const [sort, setSort] = useState("relevance");
  const [products, setProducts] = useState<ProductCardData[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    setLoading(true);
    fetchGroupedProductsPage({ page, limit: 10 })
      .then((data) => {
        const list = data.groups ?? [];
        const listForUI = list.length > 0 ? list.map(groupedRowToCardData) : FALLBACK_PRODUCTS;
        setProducts(listForUI);
        if (data.pagination) {
          setPagination({
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          });
        }
      })
      .catch(() => setProducts(FALLBACK_PRODUCTS))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-0">
      <section
        className="-mt-8 w-screen max-w-none"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <BannerCarousel />
      </section>

      <div className="flex w-full flex-col lg:flex-row">
        <div className="hidden lg:block">
          <ShopFilters />
        </div>
        <main className="min-w-0 flex-1 border-slate-200 bg-white p-4 lg:p-6">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">Destacados</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filtros</span>
              </button>
            </div>
            <ShopSortBar value={sort} onChange={setSort} />
          </div>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Cargando productos...</p>
          ) : (
            <>
              <ProductGrid products={products} />
              {pagination.totalPages > 1 && (
                <nav
                  className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 pt-6"
                  aria-label="Paginación"
                >
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-2 text-sm text-slate-600">
                    Página {pagination.page} de {pagination.totalPages || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
                    disabled={page >= (pagination.totalPages || 1)}
                    className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              )}
            </>
          )}
        </main>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setFiltersOpen(false)}
            aria-label="Cerrar filtros"
          />
          <div className="relative h-full w-80 max-w-[80vw] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar filtros"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ShopFilters />
          </div>
        </div>
      )}
    </div>
  );
}
