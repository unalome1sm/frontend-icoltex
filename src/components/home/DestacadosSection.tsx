"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductGrid, ProductCard } from "@/components/shop";
import type { ProductCardData } from "@/components/shop";
import { fetchGroupedProductsPage, groupedRowToCardData } from "@/lib/groupedCatalog";

const DESTACADOS_LIMIT = 8;

async function fetchDestacadosRows(): Promise<ProductCardData[]> {
  const data = await fetchGroupedProductsPage({
    page: 1,
    limit: DESTACADOS_LIMIT,
    destacado: true,
  });
  return (data.groups ?? []).map(groupedRowToCardData);
}

export function DestacadosSection() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const listForUI = await fetchDestacadosRows();
        if (!cancelled) setProducts(listForUI);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Destacados
        </h2>
        <Link
          href="/shop"
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Ver todos
        </Link>
      </div>

      {loading ? (
        <p className="py-8 text-center text-slate-500">Cargando destacados...</p>
      ) : products.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No hay productos destacados por ahora.
        </p>
      ) : (
        <>
          <div className="sm:hidden -mx-2 overflow-x-auto overscroll-x-contain px-5 pb-2 snap-x snap-mandatory">
            <div className="flex items-stretch gap-[10px]">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex w-[75vw] max-w-[320px] flex-shrink-0 snap-start self-stretch"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:block">
            <ProductGrid products={products} />
          </div>
        </>
      )}
    </section>
  );
}
