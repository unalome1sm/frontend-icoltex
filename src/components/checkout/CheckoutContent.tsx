"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { getImageDisplayUrl } from "@/lib/products";

const MEASURE_LABELS: Record<CartItem["measure"], string> = {
  metro: "m",
  rollo: "rollo",
  peso: "kg",
};

const DOC_TYPES = [
  { value: "", label: "Seleccione un tipo" },
  { value: "cc", label: "Cédula de ciudadanía" },
  { value: "ce", label: "Cédula de extranjería" },
  { value: "nit", label: "NIT" },
  { value: "pasaporte", label: "Pasaporte" },
];

export function CheckoutContent() {
  const { items, subtotal } = useCart();
  const [stepOpen, setStepOpen] = useState<0 | 1 | 2 | 3>(1);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellidos: "",
    tipoDocumento: "",
    numeroDocumento: "",
    telefono: "",
    recibirNovedades: true,
  });

  const discount = 0;
  const total = subtotal - discount;

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStepOpen(2);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Tu bolsa está vacía</h1>
        <p className="text-slate-600">
          Agrega productos al carrito para proceder al checkout.
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
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Checkout
        </h1>
      </header>

      {/* Fila de dos columnas: formulario | resumen de compra */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {/* Columna 1: formulario para finalizar la compra */}
        <div className="min-w-0 flex-1 space-y-3 md:flex-[1.5]">
          {/* Paso 1: Datos personales */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setStepOpen((s) => (s === 1 ? 0 : 1))}
              className="flex w-full items-center justify-between bg-white px-5 py-4 text-left transition hover:bg-slate-50"
              aria-expanded={stepOpen === 1}
            >
              <span className="font-semibold text-slate-900">1. Datos personales</span>
              {stepOpen === 1 ? (
                <ChevronUp className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-500" />
              )}
            </button>
            {stepOpen === 1 && (
              <div className="border-t border-slate-200 px-5 pb-5 pt-2">
                <p className="mb-4 text-sm text-slate-600">
                  Solicitamos únicamente la información esencial para la finalización de la compra.
                </p>
                <form onSubmit={handleSubmitStep1} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Correo Electrónico *"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      placeholder="Nombre *"
                      value={formData.nombre}
                      onChange={(e) => setFormData((p) => ({ ...p, nombre: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Apellidos *"
                      value={formData.apellidos}
                      onChange={(e) => setFormData((p) => ({ ...p, apellidos: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <select
                      value={formData.tipoDocumento}
                      onChange={(e) => setFormData((p) => ({ ...p, tipoDocumento: e.target.value }))}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      {DOC_TYPES.map((opt) => (
                        <option key={opt.value || "empty"} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Número de documento *"
                      value={formData.numeroDocumento}
                      onChange={(e) => setFormData((p) => ({ ...p, numeroDocumento: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Numero celular *"
                      value={formData.telefono}
                      onChange={(e) => setFormData((p) => ({ ...p, telefono: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <p className="text-sm">
                    <button
                      type="button"
                      className="text-red-600 underline hover:no-underline"
                    >
                      Sumar datos de empresa
                    </button>
                  </p>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="novedades"
                      checked={formData.recibirNovedades}
                      onChange={(e) => setFormData((p) => ({ ...p, recibirNovedades: e.target.checked }))}
                      className="h-4 w-4 accent-red-600"
                    />
                    <span className="text-sm text-slate-700">
                      Quiero recibir novedades con promociones
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Guardar y continuar
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Paso 2: Envío */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setStepOpen((s) => (s === 2 ? 0 : 2))}
              className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                stepOpen === 2 ? "bg-white" : "bg-slate-100"
              }`}
              aria-expanded={stepOpen === 2}
            >
              <span className="font-semibold text-slate-900">2. Envío</span>
              {stepOpen === 2 ? (
                <ChevronUp className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-500" />
              )}
            </button>
            {stepOpen === 2 && (
              <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-4">
                <p className="text-sm text-slate-600">
                  Contenido de envío (dirección, método, etc.). Por implementar.
                </p>
                <button
                  type="button"
                  onClick={() => setStepOpen(3)}
                  className="mt-4 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Continuar al pago
                </button>
              </div>
            )}
          </div>

          {/* Paso 3: Pago */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setStepOpen((s) => (s === 3 ? 0 : 3))}
              className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                stepOpen === 3 ? "bg-white" : "bg-slate-100"
              }`}
              aria-expanded={stepOpen === 3}
            >
              <span className="font-semibold text-slate-900">3. Pago</span>
              {stepOpen === 3 ? (
                <ChevronUp className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-500" />
              )}
            </button>
            {stepOpen === 3 && (
              <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-4">
                <p className="text-sm text-slate-600">
                  Método de pago. Por ahora solo diseño; se integrará procesador de pagos más adelante.
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Confirmar pedido
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Columna 2: Resumen de compra (siempre al lado del formulario en row) */}
        <aside className="w-full space-y-4 md:sticky md:top-8 md:w-auto md:flex-1 md:flex-shrink-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Resumen de compra
            </h2>

            {/* Código promocional expandible */}
            <div className="mt-4 border-b border-slate-200 pb-4">
              <button
                type="button"
                onClick={() => setPromoOpen(!promoOpen)}
                className="flex w-full items-center justify-between text-sm text-slate-700 hover:text-slate-900"
              >
                <span>¿Tienes un código promocional?</span>
                {promoOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {promoOpen && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Código"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Aplicar
                  </button>
                </div>
              )}
            </div>

            {/* Totales */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>$ {subtotal.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Descuentos</span>
                <span className={discount > 0 ? "text-green-600" : ""}>
                  $ {discount > 0 ? "- " : ""}{discount.toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 font-semibold text-slate-900">
                <span>Total</span>
                <span>$ {total.toLocaleString("es-CO")}</span>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="mt-6 space-y-3">
              {items.map((item) => {
                const lineTotal = item.precioMetro * item.quantity;
                const imgUrl = item.imageUrl ? getImageDisplayUrl(item.imageUrl) : null;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={item.nombre}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{item.nombre}</p>
                      {item.color && (
                        <p className="text-xs text-slate-500">{item.color}</p>
                      )}
                      <p className="text-xs text-slate-600">
                        {item.quantity} {MEASURE_LABELS[item.measure]} · $ {item.precioMetro.toLocaleString("es-CO")} / {MEASURE_LABELS[item.measure]}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        $ {lineTotal.toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
