"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ChevronDown } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { getImageDisplayUrl, toProductCardData, type ProductCardData } from "@/lib/products";

type ProductResponse = {
  _id: string;
  nombre: string;
  precioMetro?: number;
  colores?: string;
  imageUrls?: string[];
  caracteristica?: string;
};

const MEASURE_LABELS: Record<CartItem["measure"], string> = {
  metro: "m",
  rollo: "rollo",
  peso: "kg",
};

const MEASURE_OPTIONS: { value: CartItem["measure"]; label: string }[] = [
  { value: "metro", label: "Metro" },
  { value: "rollo", label: "Rollo" },
  { value: "peso", label: "Peso" },
];

function parseFirstColor(colores?: string): string | undefined {
  if (!colores?.trim()) return undefined;
  const first = colores.split(/[,;]/).map((c) => c.trim()).filter(Boolean)[0];
  return first;
}

function CartLineItem({ item, onRemove, onUpdateQuantity }: {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}) {
  const displayUrl = item.imageUrl ? getImageDisplayUrl(item.imageUrl) : null;
  const lineTotal = item.precioMetro * item.quantity;

  return (
    <div className="flex gap-3 border-b border-slate-200 bg-white p-4 last:border-b-0">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={item.nombre}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            Sin imagen
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900">{item.nombre}</p>
        {item.color && (
          <p className="text-xs text-slate-500">{item.color}</p>
        )}
        <p className="text-sm font-medium text-slate-700">
          $ {item.precioMetro.toLocaleString("es-CO")} / {MEASURE_LABELS[item.measure]}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded border border-slate-200">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="flex h-7 w-7 items-center justify-center text-slate-600 hover:bg-slate-100"
              aria-label="Menos"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-slate-600 hover:bg-slate-100"
              aria-label="Más"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            $ {lineTotal.toLocaleString("es-CO")} COP
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="mt-1 text-xs text-slate-500 underline hover:text-red-600"
        >
          Quitar
        </button>
      </div>
    </div>
  );
}

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, addItem } = useCart();
  const [suggestedProduct, setSuggestedProduct] = useState<ProductCardData | null>(null);
  const [suggestedLoading, setSuggestedLoading] = useState(false);
  const [suggestedMeasure, setSuggestedMeasure] = useState<CartItem["measure"]>("metro");

  const fetchRandomSuggestion = useCallback((excludeIds: string[]) => {
    setSuggestedLoading(true);
    fetch(getApiUrl("/api/products?limit=30"))
      .then((res) => res.json())
      .then((data: { products?: ProductResponse[]; error?: string }) => {
        if (data.error) throw new Error(data.error);
        const list = data.products ?? [];
        const available = list.filter((p) => !excludeIds.includes(p._id));
        if (available.length === 0) {
          setSuggestedProduct(null);
          return;
        }
        const picked = available[Math.floor(Math.random() * available.length)];
        setSuggestedProduct(toProductCardData(picked));
      })
      .catch(() => setSuggestedProduct(null))
      .finally(() => setSuggestedLoading(false));
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const cartIds = items.map((i) => i.productId);
      fetchRandomSuggestion(cartIds);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, fetchRandomSuggestion]); // eslint-disable-line react-hooks/exhaustive-deps -- only run when isOpen changes

  useEffect(() => {
    if (!isOpen) return;
    const cartIds = items.map((i) => i.productId);
    if (suggestedProduct && cartIds.includes(suggestedProduct.id)) {
      fetchRandomSuggestion(cartIds);
    }
  }, [items, isOpen, suggestedProduct, fetchRandomSuggestion]);

  function handleAddSuggestion() {
    if (!suggestedProduct) return;
    const color = parseFirstColor(suggestedProduct.colores);
    addItem({
      productId: suggestedProduct.id,
      nombre: suggestedProduct.nombre,
      imageUrl: suggestedProduct.imageUrls?.[0],
      precioMetro: suggestedProduct.precioMetro ?? 0,
      quantity: 1,
      measure: suggestedMeasure,
      color,
    });
    const excludeIds = [...items.map((i) => i.productId), suggestedProduct.id];
    fetchRandomSuggestion(excludeIds);
  }

  return (
    <>
      <div
        role="presentation"
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={closeCart}
        aria-hidden
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      />
      <aside
        className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        aria-modal
        aria-label="Mi bolsa"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 className="text-lg font-semibold uppercase tracking-tight text-slate-900">
            Mi bolsa
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Empty state or list */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col">
            <div className="bg-slate-100 px-4 py-6 text-center text-sm text-slate-600">
              Tu bolsa está vacía actualmente.
            </div>
            <div className="flex-1" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
        )}

        {/* Antes de que te vayas */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-100 p-4">
          <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-tight text-slate-800">
            Antes de que te vayas
          </h3>
          {suggestedLoading ? (
            <div className="flex items-center justify-center rounded-lg bg-white py-8">
              <p className="text-sm text-slate-500">Cargando sugerencia...</p>
            </div>
          ) : suggestedProduct ? (
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                  {suggestedProduct.imageUrls?.[0] ? (
                    <Image
                      src={suggestedProduct.imageUrls[0]}
                      alt={suggestedProduct.nombre}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{suggestedProduct.nombre}</p>
                  <p className="text-sm font-semibold text-slate-700">
                    $ {(suggestedProduct.precioMetro ?? 0).toLocaleString("es-CO")} COP
                  </p>
                  {parseFirstColor(suggestedProduct.colores) && (
                    <p className="text-xs text-slate-500">
                      {parseFirstColor(suggestedProduct.colores)}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <select
                        value={suggestedMeasure}
                        onChange={(e) => setSuggestedMeasure(e.target.value as CartItem["measure"])}
                        className="w-full appearance-none rounded border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-8 text-sm text-slate-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        aria-label="Seleccionar medida"
                      >
                        {MEASURE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSuggestion}
                      className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Summary + CTA */}
        <div className="shrink-0 border-t border-slate-200 bg-white p-4">
          <div className="flex justify-between text-sm font-medium text-slate-900">
            <span>Subtotal</span>
            <span>$ {subtotal.toLocaleString("es-CO")} COP</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Aranceles e impuestos aplicados al momento de pagar
          </p>
          {items.length === 0 ? (
            <div className="mt-4 flex w-full items-center justify-center rounded-lg bg-slate-200 px-4 py-3 text-sm font-medium text-slate-500">
              Proceder al pago
            </div>
          ) : (
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-900"
            >
              Proceder al pago
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}