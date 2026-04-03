"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductAccordion } from "./ProductAccordion";
import { ProductCard } from "./ProductCard";
import type { ProductCardData } from "./ProductCard";
import { useCart } from "@/contexts/CartContext";

export type ProductDetailData = {
  id: string;
  nombre: string;
  codigo?: string;
  categoria?: string;
  claseFamilia?: string;
  stock: number;
  precioMetro?: number;
  precioKilos?: number;
  imageUrls?: string[];
  colores?: string;
  caracteristica?: string;
  recomendacionesUsos?: string;
  recomendacionesCuidados?: string;
  unidadMedida?: string;
};

type Props = {
  product: ProductDetailData;
  relatedProducts?: ProductCardData[];
};

const MEASURE_OPTIONS = [
  { id: "metro", label: "Metro" },
  { id: "rollo", label: "Rollo" },
  { id: "peso", label: "Peso" },
];

function parseColors(colores?: string): string[] {
  if (!colores?.trim()) return [];
  return colores.split(/[,;]/).map((c) => c.trim()).filter(Boolean);
}

/** Mapeo simple de nombre de color a clase de fondo (placeholder) */
function colorToBg(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("azul") && n.includes("marino")) return "bg-blue-900";
  if (n.includes("negro")) return "bg-gray-900";
  if (n.includes("rojo")) return "bg-red-600";
  if (n.includes("verde")) return "bg-green-600";
  if (n.includes("azul")) return "bg-blue-500";
  if (n.includes("morado") || n.includes("púrpura")) return "bg-purple-600";
  if (n.includes("naranja")) return "bg-orange-500";
  if (n.includes("amarillo")) return "bg-yellow-400";
  if (n.includes("rosa")) return "bg-pink-400";
  return "bg-slate-400";
}

export function ProductDetail({ product, relatedProducts = [] }: Props) {
  const { addItem } = useCart();
  const [measure, setMeasure] = useState<"metro" | "rollo" | "peso">("metro");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const colors = parseColors(product.colores);
  const mainColor = selectedColor ?? colors[0] ?? "Azul marino";
  const images = product.imageUrls?.length ? product.imageUrls : [];

  function handleAddToCart() {
    addItem({
      productId: product.id,
      nombre: product.nombre,
      imageUrl: product.imageUrls?.[0],
      precioMetro: product.precioMetro ?? 0,
      quantity,
      measure,
      color: mainColor ?? undefined,
    });
  }

  const breadcrumbSegments = [
    product.claseFamilia || "Antifluido",
    product.categoria || "Categoría",
    product.nombre,
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/shop" className="hover:text-slate-700">
              Tienda
            </Link>
          </li>
          {breadcrumbSegments.map((segment, i) => (
            <li key={i} className="flex items-center gap-1">
              <span aria-hidden>/</span>
              {i === breadcrumbSegments.length - 1 ? (
                <span className="text-slate-700">{segment}</span>
              ) : (
                <span>{segment}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Contenido principal: galería + info */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Columna izquierda: galería */}
        <div className="lg:sticky lg:top-4">
          {images.length > 0 ? (
            <ProductImageGallery images={images} alt={product.nombre} />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400">
              Sin imagen
            </div>
          )}
        </div>

        {/* Columna derecha: información y opciones */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              {product.nombre}
            </h1>
            {product.stock > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                <Check className="h-3.5 w-3.5" />
                Stock
              </span>
            )}
          </div>

          {/* Uso recomendado */}
          {product.recomendacionesUsos && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
                Uso recomendado
              </span>
              <span className="text-sm text-slate-700">
                {product.recomendacionesUsos}
              </span>
            </div>
          )}

          {/* Precio */}
          <p className="text-2xl font-bold text-slate-900">
            $ {(product.precioMetro ?? 0).toLocaleString("es-CO")} COL
          </p>

          {/* Cantidad y tipo de medida */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-800">Cantidad</p>
            <div className="flex flex-wrap gap-2">
              {MEASURE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMeasure(opt.id as "metro" | "rollo" | "peso")}
                  className={`rounded border px-4 py-2 text-sm font-medium transition ${
                    measure === opt.id
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={product.stock || 999}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 rounded border border-slate-200 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              {product.stock > 0 && quantity >= product.stock && (
                <p className="text-xs text-slate-500">
                  *Has alcanzado el stock máximo disponible del producto por ahora.
                </p>
              )}
            </div>
          </div>

          {/* Color */}
          {colors.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-800">
                Color: {mainColor}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`h-8 w-8 rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      selectedColor === color || (!selectedColor && color === colors[0])
                        ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                        : "border-slate-200 hover:border-slate-400"
                    } ${colorToBg(color)}`}
                  />
                ))}
                <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400">
                  +
                </span>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Agregar al carrito
            </button>
            <button
              type="button"
              className="rounded bg-red-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Comprar ahora
            </button>
          </div>

          {/* Acordeones */}
          <div className="border-t border-slate-200 pt-4">
            <ProductAccordion title="Características" defaultOpen>
              <p className="whitespace-pre-wrap text-slate-600">
                {product.caracteristica || "Sin características especificadas."}
              </p>
            </ProductAccordion>
            <ProductAccordion title="Envíos y devoluciones">
              <p className="text-slate-600">
                Envíos a todo el país en 48-72 horas. Consulta términos y condiciones para devoluciones.
              </p>
            </ProductAccordion>
            <ProductAccordion title="Recomendaciones y cuidados">
              <p className="whitespace-pre-wrap text-slate-600">
                {product.recomendacionesCuidados || "Sin recomendaciones especificadas."}
              </p>
            </ProductAccordion>
            <ProductAccordion title="Evaluaciones (0)">
              <p className="text-slate-600">Aún no hay evaluaciones. Sé el primero en opinar.</p>
              <div className="mt-2 flex gap-0.5 text-slate-300" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-lg">★</span>
                ))}
              </div>
            </ProductAccordion>
          </div>
        </div>
      </div>

      {/* Productos relacionados: carrusel en mobile y grid en pantallas grandes */}
      <section className="mb-12 border-t border-slate-200 pt-8">
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Productos relacionados con este artículo
        </h2>
        {relatedProducts.length > 0 ? (
          <>
            {/* Carrusel solo en mobile */}
            <div className="sm:hidden -mx-2 overflow-x-auto overscroll-x-contain px-5 pb-2 snap-x snap-mandatory">
              <div className="flex gap-[10px]">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="w-[75vw] max-w-[320px] flex-shrink-0 snap-start"
                  >
                    <ProductCard product={{ ...p, isNew: true }} variant="related" />
                  </div>
                ))}
              </div>
            </div>

            {/* Grid desde sm en adelante */}
            <div className="hidden sm:grid grid-cols-2 gap-6 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={{ ...p, isNew: true }} variant="related" />
              ))}
            </div>
          </>
        ) : (
          <p className="py-6 text-center text-slate-500">
            No hay otros productos para mostrar por ahora.
          </p>
        )}
      </section>
    </div>
  );
}
