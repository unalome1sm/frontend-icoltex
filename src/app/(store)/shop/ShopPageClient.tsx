"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { BannerCarousel } from "@/components/home";
import { ShopFilters, ProductGrid, ShopSortBar } from "@/components/shop";
import type { ProductCardData } from "@/components/shop";
import { fetchGroupedProductsPage, groupedRowToCardData } from "@/lib/catalog";
import {
  DEFAULT_SHOP_FILTERS,
  fetchCatalogFilterMeta,
  shopFiltersActiveCount,
  shopFiltersFromSearchParams,
  shopFiltersToSearchParams,
  type CatalogFilterMeta,
  type ShopFilterState,
} from "@/lib/catalog";

const PAGE_SIZE = 12;

function filtersToQuery(filters: ShopFilterState, page: number) {
  const precioMin = filters.precioMin.trim() ? Number(filters.precioMin) : undefined;
  const precioMax = filters.precioMax.trim() ? Number(filters.precioMax) : undefined;

  return {
    page,
    limit: PAGE_SIZE,
    filtro1: filters.filtro1 || undefined,
    filtro2: filters.filtro2.length ? filters.filtro2 : undefined,
    filtro3: filters.filtro3.length ? filters.filtro3 : undefined,
    nombre: filters.nombre.trim() || undefined,
    colors: filters.colors.length ? filters.colors : undefined,
    inStock: filters.inStock || undefined,
    precioMin: precioMin != null && !Number.isNaN(precioMin) ? precioMin : undefined,
    precioMax: precioMax != null && !Number.isNaN(precioMax) ? precioMax : undefined,
    q: filters.q.trim() || undefined,
    sort: filters.sort,
  };
}

export function ShopPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ShopFilterState>(() =>
    shopFiltersFromSearchParams(searchParams),
  );
  const [meta, setMeta] = useState<CatalogFilterMeta | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get("page")) || 1));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const syncUrl = useCallback(
    (nextFilters: ShopFilterState, nextPage: number) => {
      const sp = shopFiltersToSearchParams(nextFilters, nextPage);
      const qs = sp.toString();
      router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    fetchCatalogFilterMeta()
      .then(setMeta)
      .catch(() => setMeta(null))
      .finally(() => setLoadingMeta(false));
  }, []);

  useEffect(() => {
    const fromUrl = shopFiltersFromSearchParams(searchParams);
    const urlPage = Math.max(1, Number(searchParams.get("page")) || 1);
    setFilters(fromUrl);
    setPage(urlPage);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchGroupedProductsPage(filtersToQuery(filters, page))
      .then((data) => {
        const list = data.groups ?? [];
        setProducts(list.map(groupedRowToCardData));
        if (data.pagination) {
          setPagination({
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          });
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filters, page]);

  const handleFiltersChange = (next: ShopFilterState) => {
    setFilters(next);
    setPage(1);
    syncUrl(next, 1);
  };

  const handleSortChange = (sort: string) => {
    const next = { ...filters, sort: sort as ShopFilterState["sort"] };
    setFilters(next);
    syncUrl(next, page);
  };

  const activeCount = shopFiltersActiveCount(filters);

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
          <ShopFilters
            meta={meta}
            filters={filters}
            onChange={handleFiltersChange}
            loadingMeta={loadingMeta}
          />
        </div>

        <div className="min-w-0 flex-1 border-slate-200 bg-white p-4 lg:p-6">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Catálogo</h1>
                {!loading && (
                  <p className="text-sm text-slate-500">
                    {pagination.total} producto{pagination.total !== 1 ? "s" : ""}
                    {activeCount > 0
                      ? ` · ${activeCount} filtro${activeCount !== 1 ? "s" : ""} activo${
                          activeCount !== 1 ? "s" : ""
                        }`
                      : ""}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filtros{activeCount > 0 ? ` (${activeCount})` : ""}</span>
              </button>
            </div>
            <ShopSortBar value={filters.sort} onChange={handleSortChange} />
          </div>

          {loading ? (
            <p className="py-8 text-center text-slate-500">Cargando productos…</p>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-600">No hay productos con estos filtros.</p>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => handleFiltersChange({ ...DEFAULT_SHOP_FILTERS, sort: filters.sort })}
                  className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
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
                    onClick={() => {
                      const p = Math.max(1, page - 1);
                      setPage(p);
                      syncUrl(filters, p);
                    }}
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
                    onClick={() => {
                      const p = Math.min(pagination.totalPages || 1, page + 1);
                      setPage(p);
                      syncUrl(filters, p);
                    }}
                    disabled={page >= (pagination.totalPages || 1)}
                    className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setFiltersOpen(false)}
            aria-label="Cerrar filtros"
          />
          <div className="relative flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="font-medium text-slate-900">Filtros</span>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar filtros"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ShopFilters
                meta={meta}
                filters={filters}
                onChange={(next) => {
                  handleFiltersChange(next);
                }}
                loadingMeta={loadingMeta}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

