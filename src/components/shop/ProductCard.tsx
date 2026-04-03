"use client";

import Link from "next/link";
import Image from "next/image";

export type ProductCardData = {
  id: string;
  nombre: string;
  descripcion?: string;
  precioMetro?: number;
  colores?: string;
  imageUrls?: string[];
  isNew?: boolean;
};

type Props = {
  product: ProductCardData;
  /** En detalle de producto: etiqueta debajo de la imagen, solo nombre y descripción */
  variant?: "default" | "related";
};

export function ProductCard({ product, variant = "default" }: Props) {
  const imageUrl = product.imageUrls?.[0] ?? null;
  const colorCount = product.colores ? product.colores.split(/[,;]/).length : 0;
  const colorLabel = colorCount > 0 ? `${colorCount} colores` : "Ver colores";
  const isRelated = variant === "related";

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.nombre}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            Sin imagen
          </div>
        )}
        {product.isNew && !isRelated && (
          <span className="absolute bottom-2 left-2 rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
            Lo más nuevo
          </span>
        )}
      </div>
      {isRelated && product.isNew && (
        <div className="bg-white px-2 pt-1 pb-0">
          <span className="inline-block rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">
            Lo más nuevo
          </span>
        </div>
      )}
      <div className="flex flex-col gap-0.5 p-3">
        <h3 className="font-semibold text-slate-900">{product.nombre}</h3>
        {product.descripcion && (
          <p className={`text-slate-600 ${isRelated ? "text-sm" : "text-sm"}`}>{product.descripcion}</p>
        )}
        {!isRelated && (
          <>
            <p className="text-xs text-slate-500">{colorLabel}</p>
            {product.precioMetro != null && (
              <p className="text-sm font-medium text-slate-900">
                ${product.precioMetro.toLocaleString("es-CO")} / m
              </p>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
