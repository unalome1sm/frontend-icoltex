"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CartItem } from "@/contexts/CartContext";
import { getImageDisplayUrl } from "@/lib/products";
import { loadLastOrder, type OrderSnapshot } from "@/components/checkout";

const MEASURE_LABELS: Record<CartItem["measure"], string> = {
  metro: "m",
  rollo: "rollo",
  peso: "kg",
};

const PAYMENT_LABELS: Record<OrderSnapshot["paymentMethod"], string> = {
  wompi: "Wompi",
};

export function CheckoutSuccessClient() {
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrder(loadLastOrder());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Cargando pedido…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">No hay pedido reciente</h1>
        <p className="text-slate-600">
          Si ya confirmaste una compra, el resumen solo está disponible en esta sesión.
        </p>
        <Link
          href="/shop"
          className="inline-flex rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2 text-center">
        <p className="text-sm font-medium text-red-600">Pedido registrado</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          ¡Gracias, {order.customer.nombre}!
        </h1>
        <p className="text-sm text-slate-600">
          Número de pedido:{" "}
          <span className="font-semibold text-slate-900">{order.id}</span>
        </p>
        <p className="text-sm text-slate-500">
          Te contactaremos a {order.customer.email} para confirmar el pago (
          {PAYMENT_LABELS[order.paymentMethod]}).
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => {
            const lineTotal = item.precioMetro * item.quantity;
            const imgUrl = item.imageUrl ? getImageDisplayUrl(item.imageUrl) : null;
            return (
              <div
                key={item.id}
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
                    {item.quantity} {MEASURE_LABELS[item.measure]}
                    {item.color ? ` · ${item.color}` : ""}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    $ {lineTotal.toLocaleString("es-CO")}
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
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          <p className="font-medium text-slate-900">Envío a</p>
          <p>
            {order.shipping.direccion}
            {order.shipping.apartamento ? `, apt. ${order.shipping.apartamento}` : ""}
          </p>
          <p>
            {order.shipping.ciudad}, {order.shipping.departamento}
          </p>
        </div>
      </section>

      <div className="flex justify-center">
        <Link
          href="/shop"
          className="inline-flex rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
