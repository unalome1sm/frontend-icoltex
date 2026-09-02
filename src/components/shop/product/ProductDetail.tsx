"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus } from "lucide-react";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductAccordion } from "./ProductAccordion";
import { ProductCard } from "./ProductCard";
import type { ProductCardData } from "./ProductCard";
import { useCart } from "@/contexts/CartContext";
import { mapImageUrlsForDisplay } from "@/lib/products";
import { buildColorSwatches, resolveWinningIndexForVariant } from "@/lib/catalog";
import { ColorSwatchButton } from "./ColorSwatchButton";
import { ProductReviewsSection } from "./ProductReviewsSection";

export type ProductDetailData = {
  id: string;
  nombre: string;
  codigo?: string;
  categoria?: string;
  claseFamilia?: string;
  /** Primera línea comercial (filtro1) para breadcrumbs */
  lineaComercial?: string;
  stock: number;
  precioMetro?: number;
  precioKilos?: number;
  imageUrls?: string[];
  colores?: string;
  /** Badge variante (promo/outlet) */
  caracteristica?: string;
  /** Specs técnicos del grupo vitrina */
  caracteristicasGrupo?: string;
  descripcionCorta?: string;
  descripcionLarga?: string;
  recomendacionesUsos?: string;
  recomendacionesCuidados?: string;
  unidadMedida?: string;
};

export type ProductVariantOption = {
  mongoId: string;
  codigo: string;
  colorLabel: string;
  colorHex?: string;
  itemNameCompleto: string;
  stock: number;
  activo?: boolean;
  precioMetro?: number;
  precioKilos?: number;
  tienePrecio?: boolean;
  imageUrls?: string[];
  caracteristica?: string;
  recomendacionesUsos?: string;
  recomendacionesCuidados?: string;
  unidadMedida?: string;
};

type ShopMeasure = "metro" | "peso";

type MeasureOption = {
  id: ShopMeasure;
  label: string;
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

const QUANTITY_MIN = 1;
const QUANTITY_STEP = 1;

function parseColors(colores?: string): string[] {
  if (!colores?.trim()) return [];
  return colores.split(/[,;]/).map((c) => c.trim()).filter(Boolean);
}

function isNoUtilizarName(name: string): boolean {
  return /^NO\s*UTILIZAR\b/i.test(name.trim());
}

function variantHasPrice(v: ProductVariantOption): boolean {
  if (v.tienePrecio === false) return false;
  if (v.tienePrecio === true) return true;
  return (
    (v.precioMetro != null && !Number.isNaN(v.precioMetro)) ||
    (v.precioKilos != null && !Number.isNaN(v.precioKilos))
  );
}

function isSellableVariant(v: ProductVariantOption): boolean {
  if (v.activo === false) return false;
  if (isNoUtilizarName(v.itemNameCompleto)) return false;
  return variantHasPrice(v);
}

function unitToMeasure(unidad?: string): ShopMeasure | null {
  const u = unidad?.trim().toUpperCase();
  if (u === "KG") return "peso";
  if (u === "METRO") return "metro";
  return null;
}

function measureToSapUnit(measure: ShopMeasure): "METRO" | "KG" {
  return measure === "peso" ? "KG" : "METRO";
}

function colorKey(label: string): string {
  return label.trim().toLocaleLowerCase("es");
}

function unitPriceOf(
  p: Pick<ProductDetailData, "unidadMedida" | "precioMetro" | "precioKilos">,
): number {
  const isKg = p.unidadMedida?.toUpperCase() === "KG";
  if (isKg) return p.precioKilos ?? p.precioMetro ?? 0;
  return p.precioMetro ?? p.precioKilos ?? 0;
}

function measureSuffix(measure: ShopMeasure): string {
  return measure === "peso" ? "kg" : "m";
}

function clampQuantity(value: number, maxStock: number): number {
  const min = QUANTITY_MIN;
  if (!Number.isFinite(value) || value < min) return min;
  const capped = maxStock > 0 ? Math.min(value, maxStock) : value;
  return Math.round(capped * 100) / 100;
}

function findVariantIndexForMeasure(
  rows: ProductVariantOption[],
  color: string | null,
  measure: ShopMeasure,
): number {
  const unit = measureToSapUnit(measure);
  const wantedColor = color ? colorKey(color) : "";
  const matchesUnit = (v: ProductVariantOption) =>
    isSellableVariant(v) && v.unidadMedida?.toUpperCase() === unit;

  if (wantedColor) {
    const sameColor = rows.findIndex(
      (v) => matchesUnit(v) && colorKey(v.colorLabel) === wantedColor,
    );
    if (sameColor >= 0) return sameColor;
  }
  return rows.findIndex(matchesUnit);
}

function measuresFromVariants(rows: ProductVariantOption[]): ShopMeasure[] {
  const found = new Set<ShopMeasure>();
  for (const v of rows) {
    if (!isSellableVariant(v)) continue;
    const measure = unitToMeasure(v.unidadMedida);
    if (measure) found.add(measure);
  }
  const ordered: ShopMeasure[] = [];
  if (found.has("metro")) ordered.push("metro");
  if (found.has("peso")) ordered.push("peso");
  return ordered;
}

function measuresFromProduct(p: ProductDetailData): ShopMeasure[] {
  const fromUnit = unitToMeasure(p.unidadMedida);
  if (fromUnit) return [fromUnit];
  const ordered: ShopMeasure[] = [];
  if (p.precioMetro != null && !Number.isNaN(p.precioMetro)) ordered.push("metro");
  if (p.precioKilos != null && !Number.isNaN(p.precioKilos)) ordered.push("peso");
  return ordered.length ? ordered : ["metro"];
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
  const router = useRouter();
  const [measure, setMeasure] = useState<ShopMeasure>("metro");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [variantIndex, setVariantIndex] = useState(0);

  const hasVariantes = Boolean(variantes && variantes.length > 0);

  useEffect(() => {
    if (!hasVariantes || !variantes) return;
    const i = variantes.findIndex((v) => v.mongoId === product.id);
    const baseIndex = i >= 0 ? i : 0;
    const winnerIndex = resolveWinningIndexForVariant(variantes, baseIndex);
    setVariantIndex(winnerIndex);
    const winner = variantes[winnerIndex];
    setSelectedColor(winner?.colorLabel?.trim() || null);
    const winnerMeasure = unitToMeasure(winner?.unidadMedida);
    if (winnerMeasure) setMeasure(winnerMeasure);
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
        lineaComercial: product.lineaComercial,
        caracteristicasGrupo: product.caracteristicasGrupo,
        descripcionCorta: product.descripcionCorta,
        descripcionLarga: product.descripcionLarga,
        recomendacionesUsos: d.recomendacionesUsos || product.recomendacionesUsos,
        recomendacionesCuidados:
          d.recomendacionesCuidados || product.recomendacionesCuidados,
      };
    }
    return product;
  }, [activeVariant, product, groupImageUrls]);

  const measureOptions: MeasureOption[] = useMemo(() => {
    const fromGroup =
      hasVariantes && variantes?.length ? measuresFromVariants(variantes) : [];
    const ids = fromGroup.length ? fromGroup : measuresFromProduct(product);
    const labels: Record<ShopMeasure, string> = { metro: "Metro", peso: "Peso" };
    return ids.map((id) => ({ id, label: labels[id] }));
  }, [hasVariantes, variantes, product]);

  useEffect(() => {
    if (measureOptions.length === 0) return;
    if (!measureOptions.some((opt) => opt.id === measure)) {
      setMeasure(measureOptions[0].id);
    }
  }, [measureOptions, measure]);

  useEffect(() => {
    const fromUnit = unitToMeasure(product.unidadMedida);
    if (!hasVariantes && fromUnit) setMeasure(fromUnit);
  }, [hasVariantes, product.id, product.unidadMedida]);

  const heading = tituloVitrina ?? displayProduct.nombre;
  const colorSwatches = useMemo(() => {
    if (hasVariantes && variantes?.length) {
      return buildColorSwatches(variantes);
    }
    return parseColors(product.colores).map((label) => ({
      colorLabel: label,
      colorHex: undefined as string | undefined,
      variantIndex: 0,
    }));
  }, [hasVariantes, variantes, product.colores]);

  const mainColor =
    selectedColor ?? colorSwatches[0]?.colorLabel ?? "Azul marino";
  const images = displayProduct.imageUrls?.length ? displayProduct.imageUrls : [];
  const unitPrice = unitPriceOf(displayProduct);
  const stockMax = displayProduct.stock > 0 ? displayProduct.stock : 0;

  useEffect(() => {
    setQuantity((current) => clampQuantity(current, stockMax));
  }, [stockMax, measure, displayProduct.id]);

  function handleMeasureChange(next: ShopMeasure) {
    setMeasure(next);
    if (!hasVariantes || !variantes?.length) return;
    const nextIndex = findVariantIndexForMeasure(variantes, selectedColor, next);
    if (nextIndex >= 0) setVariantIndex(nextIndex);
  }

  function handleColorChange(colorLabel: string, fallbackIndex: number) {
    setSelectedColor(colorLabel);
    if (!hasVariantes || !variantes?.length) {
      setVariantIndex(fallbackIndex);
      return;
    }
    const kept = findVariantIndexForMeasure(variantes, colorLabel, measure);
    if (kept >= 0) {
      setVariantIndex(kept);
      return;
    }
    setVariantIndex(fallbackIndex);
    const fallbackMeasure = unitToMeasure(variantes[fallbackIndex]?.unidadMedida);
    if (fallbackMeasure) setMeasure(fallbackMeasure);
  }

  function handleQuantityInput(raw: string) {
    const parsed = parseFloat(raw.replace(",", "."));
    setQuantity(clampQuantity(parsed, stockMax));
  }

  function bumpQuantity(delta: number) {
    setQuantity((current) => clampQuantity(current + delta, stockMax));
  }

  function cartLine() {
    return {
      productId: displayProduct.id,
      nombre: displayProduct.nombre,
      imageUrl: displayProduct.imageUrls?.[0],
      precioMetro: unitPrice,
      quantity,
      measure,
      color: mainColor ?? undefined,
    };
  }

  function handleAddToCart() {
    addItem(cartLine());
  }

  function handleBuyNow() {
    addItem(cartLine(), { open: false });
    router.push("/checkout");
  }

  const breadcrumbItems = [
    ...(displayProduct.lineaComercial
      ? [
          {
            label: displayProduct.lineaComercial,
            href: `/shop?linea=${encodeURIComponent(displayProduct.lineaComercial)}`,
          },
        ]
      : []),
    ...(tituloVitrina && tituloVitrina !== heading
      ? [
          {
            label: tituloVitrina,
            href: displayProduct.lineaComercial
              ? `/shop?linea=${encodeURIComponent(displayProduct.lineaComercial)}&nombre=${encodeURIComponent(tituloVitrina)}`
              : `/shop?nombre=${encodeURIComponent(tituloVitrina)}`,
          },
        ]
      : []),
    { label: heading, href: null as string | null },
  ];

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
          {breadcrumbItems.map((item, i) => (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              <span aria-hidden>/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-slate-700">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-700">{item.label}</span>
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
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                <Check className="h-3.5 w-3.5" />
                Stock
              </span>
            )}
          </div>

          {displayProduct.descripcionCorta?.trim() && (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {displayProduct.descripcionCorta}
            </p>
          )}

          {/* Uso recomendado */}
          {displayProduct.recomendacionesUsos && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-medium text-white">
                Uso recomendado
              </span>
              <span className="text-sm text-slate-700">
                {displayProduct.recomendacionesUsos}
              </span>
            </div>
          )}

          {/* Precio */}
          <p className="text-2xl font-bold text-slate-900">
            $ {unitPrice.toLocaleString("es-CO")} COL
            <span className="ml-1 text-base font-medium text-slate-500">
              / {measureSuffix(measure)}
            </span>
          </p>

          {/* Cantidad y tipo de medida */}
          {measureOptions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-800">Cantidad</p>
              <div className="flex flex-wrap gap-2">
                {measureOptions.map((opt) => {
                  const selected = measure === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleMeasureChange(opt.id)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "bg-brand text-white"
                          : "bg-neutral-100 text-slate-800 hover:bg-neutral-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => bumpQuantity(-QUANTITY_STEP)}
                    className="flex h-10 w-9 items-center justify-center text-slate-600 hover:bg-neutral-100"
                    aria-label="Menos"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={QUANTITY_MIN}
                    max={stockMax || undefined}
                    step={QUANTITY_STEP}
                    value={quantity}
                    onChange={(e) => handleQuantityInput(e.target.value)}
                    aria-label={
                      measure === "peso"
                        ? "Cantidad en kilos"
                        : "Cantidad en metros"
                    }
                    className="w-16 bg-white py-2 text-center text-sm font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                  <button
                    type="button"
                    onClick={() => bumpQuantity(QUANTITY_STEP)}
                    className="flex h-10 w-9 items-center justify-center bg-brand text-white transition hover:bg-brand/90"
                    aria-label="Más"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {stockMax > 0 && quantity >= stockMax && (
                  <p className="text-xs text-slate-500">
                    *Has alcanzado el stock máximo disponible del producto por ahora.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Color */}
          {colorSwatches.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-800">
                Color: {mainColor}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {colorSwatches.map((swatch) => (
                  <ColorSwatchButton
                    key={swatch.colorLabel}
                    color={swatch.colorLabel}
                    colorHex={swatch.colorHex}
                    selected={
                      selectedColor === swatch.colorLabel ||
                      (!selectedColor && swatch.colorLabel === colorSwatches[0]?.colorLabel)
                    }
                    onClick={() => handleColorChange(swatch.colorLabel, swatch.variantIndex)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded border border-brand bg-white px-6 py-3 text-sm font-medium text-brand transition hover:bg-brand/5"
            >
              Agregar al carrito
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="rounded bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand/90"
            >
              Comprar ahora
            </button>
          </div>

          {/* Acordeones */}
          <div className="border-t border-slate-200 pt-4">
            {displayProduct.descripcionLarga?.trim() && (
              <ProductAccordion
                title="Descripción"
                defaultOpen={!displayProduct.descripcionCorta?.trim()}
              >
                <p className="whitespace-pre-wrap text-slate-600">
                  {displayProduct.descripcionLarga}
                </p>
              </ProductAccordion>
            )}
            <ProductAccordion title="Características" defaultOpen>
              <p className="whitespace-pre-wrap text-slate-600">
                {displayProduct.caracteristicasGrupo ||
                  displayProduct.caracteristica ||
                  "Sin características especificadas."}
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
                productPrice={unitPrice}
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
