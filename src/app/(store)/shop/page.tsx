"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { ShopFilters, ProductGrid, ShopSortBar } from "@/components/shop";
import type { ProductCardData } from "@/components/shop";

function toDirectImageUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  if (/drive\.google\.com\/uc\?export=view&id=/.test(t)) return t;
  const file = t.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (file) return `https://drive.google.com/uc?export=view&id=${file[1]}`;
  const open = t.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (open) return `https://drive.google.com/uc?export=view&id=${open[1]}`;
  return t;
}

function getImageDisplayUrl(directUrl: string): string {
  if (!directUrl) return "";
  if (directUrl.includes("drive.google.com") || directUrl.includes("lh3.googleusercontent.com")) {
    return getApiUrl(`/api/images/proxy?url=${encodeURIComponent(directUrl)}`);
  }
  return directUrl;
}

type ProductResponse = {
  _id: string;
  nombre: string;
  caracteristica?: string;
  precioMetro?: number;
  colores?: string;
  imageUrls?: string[];
};

function toCardData(p: ProductResponse): ProductCardData {
  const imageUrls = (p.imageUrls ?? []).map((u) => getImageDisplayUrl(toDirectImageUrl(u))).filter(Boolean);
  return {
    id: p._id,
    nombre: p.nombre,
    descripcion: p.caracteristica,
    precioMetro: p.precioMetro,
    colores: p.colores,
    imageUrls: imageUrls.length ? imageUrls : undefined,
  };
}

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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    fetch(getApiUrl(`/api/products?${params}`))
      .then((res) => res.json())
      .then((data: {
        products?: ProductResponse[];
        pagination?: { page: number; limit: number; total: number; totalPages: number };
        error?: string;
      }) => {
        if (data.error) throw new Error(data.error);
        const list = data.products ?? [];
        setProducts(list.length > 0 ? list.map(toCardData) : FALLBACK_PRODUCTS);
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
      {/* Mismo banner que la home, ancho completo */}
      <section
        className="-mt-8 w-screen max-w-none"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <BannerCarousel />
      </section>

      {/* Dos columnas: filtros (izq) + listado (der) */}
      <div className="flex w-full flex-col lg:flex-row">
        <ShopFilters />
        <main className="min-w-0 flex-1 border-slate-200 bg-white p-4 lg:p-6">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Destacados</h2>
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
    </div>
  );
}
