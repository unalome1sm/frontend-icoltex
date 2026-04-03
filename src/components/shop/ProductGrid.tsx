"use client";

import type { ProductCardData } from "./ProductCard";
import { ProductCard } from "./ProductCard";

type Props = {
  products: ProductCardData[];
};

export function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
