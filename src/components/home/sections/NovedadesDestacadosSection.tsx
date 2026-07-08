"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/shop";
import type { ProductCardData } from "@/components/shop";
import { fetchGroupedProductsPage, groupedRowToCardData } from "@/lib/catalog";

type Tab = "novedades" | "destacados";

const TAB_LIMIT = 8;

async function fetchMerchProducts(tab: Tab): Promise<ProductCardData[]> {
  const data = await fetchGroupedProductsPage({
    page: 1,
    limit: TAB_LIMIT,
    novedad: tab === "novedades",
    destacado: tab === "destacados",
  });
  return (data.groups ?? []).map(groupedRowToCardData);
}

export function NovedadesDestacadosSection() {
  const [activeTab, setActiveTab] = useState<Tab>("destacados");
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMerchProducts(activeTab)
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return (
    <section className="w-full space-y-0">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("novedades")}
            className={`text-sm font-medium transition-colors ${
              activeTab === "novedades" ? "text-red-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Novedades
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("destacados")}
            className={`text-sm font-medium transition-colors ${
              activeTab === "destacados" ? "text-red-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Destacados
          </button>
        </div>
        <Link
          href="/shop"
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Ver todos
        </Link>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando…</p>
      ) : products.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          {activeTab === "novedades"
            ? "No hay novedades por ahora."
            : "No hay destacados por ahora."}
        </p>
      ) : (
        <>
          <div className="sm:hidden -mx-2 overflow-x-auto overscroll-x-contain px-5 pt-6 pb-2 snap-x snap-mandatory">
            <div className="flex gap-[10px]">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-[75vw] max-w-[320px] flex-shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden pt-6 sm:grid grid-cols-2 gap-[10px] md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
