"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { toProductCardData, type ProductResponse } from "@/lib/products";
import { ProductGrid } from "@/components/shop";
import type { ProductCardData } from "@/components/shop";

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
    fetch(getApiUrl("/api/products?limit=8"))
      .then((res) => res.json())
      .then((data: { products?: ProductResponse[]; error?: string }) => {
        if (data.error) throw new Error(data.error);
        const list = data.products ?? [];
        setProducts(list.length > 0 ? list.map(toProductCardData) : FALLBACK);
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
        <ProductGrid products={products} />
      )}
    </section>
  );
}
