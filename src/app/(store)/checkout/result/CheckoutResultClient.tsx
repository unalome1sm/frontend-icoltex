"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { getImageDisplayUrl } from "@/lib/products";
import {
  fetchOrderByReference,
  type OrderStatusResponse,
} from "@/lib/payments";
import { clearCheckoutDraft } from "@/components/checkout/orderSnapshot";

type Order = OrderStatusResponse["order"];

const POLL_MS = 2500;
const MAX_POLLS = 12; // ~30s

export function CheckoutResultClient() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference")?.trim() || "";
  const { clearCart } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const clearedRef = useRef(false);
  const pollsRef = useRef(0);

  const load = useCallback(async () => {
    if (!reference) {
      setError("No se encontró la referencia del pedido.");
      setLoading(false);
      return;
    }
    try {
      const data = await fetchOrderByReference(reference);
      setOrder(data.order);
      setError(null);

      if (data.order.status === "APPROVED" && !clearedRef.current) {
        clearedRef.current = true;
        clearCart();
        clearCheckoutDraft();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el pedido.");
    } finally {
      setLoading(false);
    }
  }, [reference, clearCart]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!reference || !order || order.status !== "PENDING") return;
    if (pollsRef.current >= MAX_POLLS) return;

    const id = window.setInterval(() => {
      pollsRef.current += 1;
      void load();
      if (pollsRef.current >= MAX_POLLS) {
        window.clearInterval(id);
      }
    }, POLL_MS);

    return () => window.clearInterval(id);
  }, [reference, order?.status, load]);

  if (loading && !order) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Consultando el estado del pago…
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">No se encontró el pedido</h1>
        <p className="text-slate-600">{error}</p>
        <Link
          href="/checkout"
          className="inline-flex rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Volver al checkout
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const statusTitle =
    order.status === "APPROVED"
      ? "¡Pago aprobado!"
      : order.status === "PENDING"
        ? "Pago en proceso"
        : order.status === "DECLINED"
          ? "Pago rechazado"
          : "No se pudo completar el pago";

  const statusHint =
    order.status === "APPROVED"
      ? "Tu pedido quedó confirmado. Te contactaremos con los detalles de envío."
      : order.status === "PENDING"
        ? "Wompi aún está confirmando la transacción. Esta página se actualiza sola."
        : order.statusMessage ||
          "Puedes intentar de nuevo desde el checkout. Tu carrito se mantuvo si el pago no fue aprobado.";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2 text-center">
        <p
          className={`text-sm font-medium ${
            order.status === "APPROVED"
              ? "text-green-700"
              : order.status === "PENDING"
                ? "text-amber-700"
                : "text-red-600"
          }`}
        >
          {order.status}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {statusTitle}
        </h1>
        <p className="text-sm text-slate-600">
          Pedido: <span className="font-semibold text-slate-900">{order.reference}</span>
        </p>
        <p className="text-sm text-slate-500">{statusHint}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item, idx) => {
            const imgUrl = item.imageUrl ? getImageDisplayUrl(item.imageUrl) : null;
            return (
              <div
                key={`${item.productId}-${idx}`}
                className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={item.nombre}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                      —
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{item.nombre}</p>
                  <p className="text-xs text-slate-600">
                    {item.quantity} {item.measure}
                    {item.color ? ` · ${item.color}` : ""}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    $ {item.lineTotal.toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
          <span>Total</span>
          <span>$ {order.total.toLocaleString("es-CO")}</span>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        {order.status === "APPROVED" ? (
          <Link
            href="/shop"
            className="inline-flex rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Seguir comprando
          </Link>
        ) : (
          <>
            <Link
              href="/checkout"
              className="inline-flex rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Volver al checkout
            </Link>
            <Link
              href="/shop"
              className="inline-flex rounded-lg border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Ir a la tienda
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
