"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductGrid, ProductCard } from "@/components/shop";
import type { ProductCardData } from "@/components/shop";
import { fetchGroupedProductsPage, groupedRowToCardData } from "@/lib/groupedCatalog";

const FALLBACK: ProductCardData[] = [
  { id: "f1", nombre: "Nombre ítem", descripcion: "Descripción ítem", colores: "A,B,C", precioMetro: 25000, isNew: true },
  { id: "f2", nombre: "Nombre ítem", descripcion: "Descripción ítem", colores: "A,B", precioMetro: 32000 },
  { id: "f3", nombre: "Nombre ítem", descripcion: "Descripción ítem", colores: "A,B,C,D", precioMetro: 18000, isNew: true },
  { id: "f4", nombre: "Nombre ítem", descripcion: "Descripción ítem", colores: "A,B,C", precioMetro: 41000 },
];

export function DestacadosSection() {
  const [products, setProducts] = useState<ProductCardData[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupedProductsPage({ page: 1, limit: 8 })
      .then((data) => {
        const list = data.groups ?? [];
        const listForUI = list.length > 0 ? list.map(groupedRowToCardData) : FALLBACK;
        setProducts(listForUI);
      })
      .catch(() => setProducts(FALLBACK))
      .finally(() => setLoading(false));
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
      ) : (
        <>
          {/* Carrusel solo en mobile: scroll horizontal con snap */}
          <div className="sm:hidden -mx-2 overflow-x-auto overscroll-x-contain px-5 pb-2 snap-x snap-mandatory">
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

          {/* Grid desde sm en adelante */}
          <div className="hidden sm:block">
            <ProductGrid products={products} />
          </div>
        </>
      )}
    </section>
  );
}
