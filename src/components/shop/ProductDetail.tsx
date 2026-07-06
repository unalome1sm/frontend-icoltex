"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductAccordion } from "./ProductAccordion";
import { ProductCard } from "./ProductCard";
import type { ProductCardData } from "./ProductCard";
import { useCart } from "@/contexts/CartContext";
import { mapImageUrlsForDisplay } from "@/lib/products";
import { ColorSwatchButton } from "./ColorSwatchButton";
import { ProductReviewsSection } from "./ProductReviewsSection";

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

export type ProductVariantOption = {
  mongoId: string;
  codigo: string;
  colorLabel: string;
  itemNameCompleto: string;
  stock: number;
  precioMetro?: number;
  precioKilos?: number;
  imageUrls?: string[];
  caracteristica?: string;
  recomendacionesUsos?: string;
  recomendacionesCuidados?: string;
  unidadMedida?: string;
};

type Props = {
  product: ProductDetailData;
  relatedProducts?: ProductCardData[];
  /** Título de vitrina cuando hay variantes por color (mismo producto, varios SKU). */
  tituloVitrina?: string;
  variantes?: ProductVariantOption[];
  /** Clave estable (ej. groupId) para resetear la variante al cambiar de producto agrupado. */
  variantesGroupId?: string;
  /** Imágenes de línea del grupo vitrina (fallback si la variante no tiene SKU). */
  groupImageUrls?: string[];
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

function variantToDetail(
  v: ProductVariantOption,
  groupImageUrls?: string[],
): ProductDetailData {
  const sourceUrls = v.imageUrls?.length ? v.imageUrls : (groupImageUrls ?? []);
  const imageUrls = mapImageUrlsForDisplay(sourceUrls);
  return {
    id: v.mongoId,
    nombre: v.itemNameCompleto,
    codigo: v.codigo,
    stock: v.stock,
    precioMetro: v.precioMetro,
    precioKilos: v.precioKilos,
    imageUrls: imageUrls.length ? imageUrls : undefined,
    colores: v.colorLabel,
    caracteristica: v.caracteristica,
    recomendacionesUsos: v.recomendacionesUsos,
    recomendacionesCuidados: v.recomendacionesCuidados,
    unidadMedida: v.unidadMedida,
  };
}

export function ProductDetail({
  product,
  relatedProducts = [],
  tituloVitrina,
  variantes,
  variantesGroupId,
  groupImageUrls,
}: Props) {
  const { addItem } = useCart();
  const [measure, setMeasure] = useState<"metro" | "rollo" | "peso">("metro");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [variantIndex, setVariantIndex] = useState(0);

  const hasVariantes = Boolean(variantes && variantes.length > 0);

  useEffect(() => {
    if (!hasVariantes || !variantes) return;
    const i = variantes.findIndex((v) => v.mongoId === product.id);
    setVariantIndex(i >= 0 ? i : 0);
    setSelectedColor(null);
    // variantesGroupId + product.id bastan; variantes se lee del closure al montar/cambiar grupo.
  }, [product.id, hasVariantes, variantesGroupId]);

  const activeVariant = useMemo(() => {
    if (!hasVariantes || !variantes?.length) return null;
    const i = Math.min(Math.max(0, variantIndex), variantes.length - 1);
    return variantes[i];
  }, [hasVariantes, variantes, variantIndex]);

  const displayProduct: ProductDetailData = useMemo(() => {
    if (activeVariant) {
      const d = variantToDetail(activeVariant, groupImageUrls);
      return {
        ...d,
        categoria: product.categoria,
        claseFamilia: product.claseFamilia,
      };
    }
    return product;
  }, [activeVariant, product, groupImageUrls]);

  const heading = tituloVitrina ?? displayProduct.nombre;
  const colors = hasVariantes && variantes
    ? variantes.map((v) => v.colorLabel)
    : parseColors(product.colores);
  const mainColor = selectedColor ?? colors[0] ?? "Azul marino";
  const images = displayProduct.imageUrls?.length ? displayProduct.imageUrls : [];

  function handleAddToCart() {
    addItem({
      productId: displayProduct.id,
      nombre: displayProduct.nombre,
      imageUrl: displayProduct.imageUrls?.[0],
      precioMetro: displayProduct.precioMetro ?? 0,
      quantity,
      measure,
      color: mainColor ?? undefined,
    });
  }

  const breadcrumbSegments = [
    displayProduct.claseFamilia || "Antifluido",
    displayProduct.categoria || "Categoría",
    heading,
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
            <ProductImageGallery images={images} alt={heading} />
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
              {heading}
            </h1>
            {hasVariantes && activeVariant && (
              <p className="w-full text-sm text-slate-600">
                Ref. <span className="font-mono text-slate-800">{activeVariant.codigo}</span>
                {" · "}
                {activeVariant.itemNameCompleto}
              </p>
            )}
            {displayProduct.stock > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                <Check className="h-3.5 w-3.5" />
                Stock
              </span>
            )}
          </div>

          {/* Uso recomendado */}
          {displayProduct.recomendacionesUsos && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
                Uso recomendado
              </span>
              <span className="text-sm text-slate-700">
                {displayProduct.recomendacionesUsos}
              </span>
            </div>
          )}

          {/* Precio */}
          <p className="text-2xl font-bold text-slate-900">
            $ {(displayProduct.precioMetro ?? 0).toLocaleString("es-CO")} COL
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
                max={displayProduct.stock || 999}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 rounded border border-slate-200 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              {displayProduct.stock > 0 && quantity >= displayProduct.stock && (
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
                {colors.map((color, idx) => (
                  <ColorSwatchButton
                    key={`${color}-${idx}`}
                    color={color}
                    selected={
                      selectedColor === color || (!selectedColor && color === colors[0])
                    }
                    onClick={() => {
                      setSelectedColor(color);
                      if (hasVariantes && variantes) {
                        const vIdx = variantes.findIndex((v) => v.colorLabel === color);
                        if (vIdx >= 0) setVariantIndex(vIdx);
                      }
                    }}
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
                {displayProduct.caracteristica || "Sin características especificadas."}
              </p>
            </ProductAccordion>
            <ProductAccordion title="Envíos y devoluciones">
              <p className="text-slate-600">
                Envíos a todo el país en 48-72 horas. Consulta términos y condiciones para devoluciones.
              </p>
            </ProductAccordion>
            <ProductAccordion title="Recomendaciones y cuidados">
              <p className="whitespace-pre-wrap text-slate-600">
                {displayProduct.recomendacionesCuidados || "Sin recomendaciones especificadas."}
              </p>
            </ProductAccordion>
            {variantesGroupId && (
              <ProductReviewsSection
                groupId={variantesGroupId}
                productName={heading}
                productImageUrl={images[0]}
                productPrice={displayProduct.precioMetro ?? 0}
              />
            )}
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
                    <ProductCard product={p} variant="related" />
                  </div>
                ))}
              </div>
            </div>

            {/* Grid desde sm en adelante */}
            <div className="hidden sm:grid grid-cols-2 gap-6 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} variant="related" />
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
