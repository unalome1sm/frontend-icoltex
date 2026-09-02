"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getApiUrl, getAuthHeaders } from "@/lib/api";
import { getImageDisplayUrl } from "@/lib/products";
import {
  createOrderAndGetWompiCheckout,
  redirectToWompiCheckout,
} from "@/lib/payments";
import { CheckoutPersonalForm } from "./steps/CheckoutPersonalForm";
import { CheckoutShippingForm } from "./steps/CheckoutShippingForm";
import { CheckoutPaymentStep } from "./steps/CheckoutPaymentStep";
import {
  EMPTY_PAYMENT,
  EMPTY_PERSONAL,
  EMPTY_SHIPPING,
  loadCheckoutDraft,
  saveCheckoutDraft,
  validatePayment,
  validatePersonal,
  validateShipping,
  type PaymentData,
  type PersonalData,
  type ShippingData,
} from "./orderSnapshot";

const MEASURE_LABELS: Record<CartItem["measure"], string> = {
  metro: "m",
  rollo: "rollo",
  peso: "kg",
};

type ProfilePrefill = {
  email?: string;
  nombre?: string;
  apellidos?: string;
  cedula?: string;
  telefono?: string;
  tipoVivienda?: "casa" | "edificio";
  direccionCasa?: string;
  apartamento?: string;
};

type Step = 0 | 1 | 2 | 3;

function AccordionHeader({
  title,
  open,
  muted,
  onToggle,
}: {
  title: string;
  open: boolean;
  muted?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
        open ? "bg-white hover:bg-slate-50" : muted ? "bg-slate-100" : "bg-white hover:bg-slate-50"
      }`}
      aria-expanded={open}
    >
      <span className="font-semibold text-slate-900">{title}</span>
      {open ? (
        <ChevronUp className="h-5 w-5 text-slate-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-slate-500" />
      )}
    </button>
  );
}

export function CheckoutContent() {
  const { items, subtotal, isHydrated, removeItem } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [stepOpen, setStepOpen] = useState<Step>(1);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(EMPTY_PERSONAL);
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);
  const [payment, setPayment] = useState<PaymentData>(EMPTY_PAYMENT);
  const [personalError, setPersonalError] = useState<string | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [prefillDone, setPrefillDone] = useState(false);

  useEffect(() => {
    const draft = loadCheckoutDraft();
    if (draft) {
      setPersonal({ ...EMPTY_PERSONAL, ...draft.personal });
      setShipping({ ...EMPTY_SHIPPING, ...draft.shipping });
      setPayment({ ...EMPTY_PAYMENT, ...draft.payment });
    }
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!draftReady || authLoading || prefillDone) return;

    async function prefill() {
      if (!isAuthenticated || !user) {
        setPrefillDone(true);
        return;
      }

      const draft = loadCheckoutDraft();
      const hasDraftPersonal = Boolean(draft?.personal?.email?.trim());

      setPersonal((prev) => ({
        ...prev,
        email: prev.email || user.email || "",
        nombre: prev.nombre || user.nombre || "",
      }));

      try {
        const res = await fetch(getApiUrl("/api/auth/me"), {
          credentials: "include",
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = (await res.json()) as { user?: ProfilePrefill };
          const u = data.user;
          if (u && !hasDraftPersonal) {
            setPersonal((prev) => ({
              ...prev,
              email: u.email || prev.email || user.email || "",
              nombre: u.nombre || prev.nombre || user.nombre || "",
              apellidos: u.apellidos || prev.apellidos,
              numeroDocumento: u.cedula || prev.numeroDocumento,
              telefono: u.telefono || prev.telefono,
              tipoDocumento: prev.tipoDocumento || (u.cedula ? "cc" : ""),
            }));
            setShipping((prev) => ({
              ...prev,
              tipoVivienda: u.tipoVivienda === "edificio" ? "edificio" : prev.tipoVivienda,
              direccion: u.direccionCasa || prev.direccion,
              apartamento: u.apartamento || prev.apartamento,
            }));
          }
        }
      } catch {
        // guest-compatible: ignore profile fetch errors
      } finally {
        setPrefillDone(true);
      }
    }

    void prefill();
  }, [draftReady, authLoading, isAuthenticated, user, prefillDone]);

  useEffect(() => {
    if (!draftReady) return;
    saveCheckoutDraft({ personal, shipping, payment });
  }, [personal, shipping, payment, draftReady]);

  const handlePersonalSubmit = useCallback(() => {
    const err = validatePersonal(personal);
    setPersonalError(err);
    if (!err) setStepOpen(2);
  }, [personal]);

  const handleShippingSubmit = useCallback(() => {
    const err = validateShipping(shipping);
    setShippingError(err);
    if (!err) setStepOpen(3);
  }, [shipping]);

  const handleConfirm = useCallback(async () => {
    const pErr = validatePersonal(personal);
    const sErr = validateShipping(shipping);
    const payErr = validatePayment(payment);
    setPersonalError(pErr);
    setShippingError(sErr);
    setPaymentError(payErr);

    if (pErr) {
      setStepOpen(1);
      return;
    }
    if (sErr) {
      setStepOpen(2);
      return;
    }
    if (payErr || items.length === 0) return;

    setSubmitting(true);
    setPaymentError(null);
    try {
      const { checkout } = await createOrderAndGetWompiCheckout({
        customer: personal,
        shipping,
        items: items.map((item) => ({
          productId: item.productId,
          nombre: item.nombre,
          quantity: item.quantity,
          measure: item.measure,
          color: item.color,
          precioMetro: item.precioMetro,
          imageUrl: item.imageUrl,
        })),
      });
      // Keep cart until APPROVED on /checkout/result (webhook is source of truth).
      redirectToWompiCheckout(checkout);
    } catch (e) {
      setPaymentError(
        e instanceof Error ? e.message : "No se pudo iniciar el pago con Wompi.",
      );
      setSubmitting(false);
    }
  }, [personal, shipping, payment, items]);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Cargando carrito…
      </div>
    );
  }

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

  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Checkout</h1>
      </header>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="min-w-0 flex-1 space-y-3 md:flex-[1.5]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionHeader
              title="1. Datos personales"
              open={stepOpen === 1}
              onToggle={() => setStepOpen((s) => (s === 1 ? 0 : 1))}
            />
            {stepOpen === 1 && (
              <CheckoutPersonalForm
                value={personal}
                error={personalError}
                onChange={setPersonal}
                onSubmit={handlePersonalSubmit}
              />
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionHeader
              title="2. Envío"
              open={stepOpen === 2}
              muted={stepOpen !== 2}
              onToggle={() => setStepOpen((s) => (s === 2 ? 0 : 2))}
            />
            {stepOpen === 2 && (
              <CheckoutShippingForm
                value={shipping}
                error={shippingError}
                onChange={setShipping}
                onSubmit={handleShippingSubmit}
                onBack={() => setStepOpen(1)}
              />
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionHeader
              title="3. Pago"
              open={stepOpen === 3}
              muted={stepOpen !== 3}
              onToggle={() => setStepOpen((s) => (s === 3 ? 0 : 3))}
            />
            {stepOpen === 3 && (
              <CheckoutPaymentStep
                error={paymentError}
                submitting={submitting}
                disabled={items.length === 0}
                acceptTerms={payment.acceptTerms}
                onAcceptTermsChange={(acceptTerms) =>
                  setPayment((prev) => ({ ...prev, acceptTerms, method: "wompi" }))
                }
                onSubmit={() => void handleConfirm()}
                onBack={() => setStepOpen(2)}
              />
            )}
          </div>
        </div>

        <aside className="w-full space-y-4 md:sticky md:top-8 md:w-auto md:flex-1 md:flex-shrink-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Resumen de compra</h2>

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

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>$ {subtotal.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Descuentos</span>
                <span className={discount > 0 ? "text-green-600" : ""}>
                  $ {discount > 0 ? "- " : ""}
                  {discount.toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 font-semibold text-slate-900">
                <span>Total</span>
                <span>$ {total.toLocaleString("es-CO")}</span>
              </div>
            </div>

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
                      {item.color && <p className="text-xs text-slate-500">{item.color}</p>}
                      <p className="text-xs text-slate-600">
                        {item.quantity} · ${" "}
                        {item.precioMetro.toLocaleString("es-CO")} / {MEASURE_LABELS[item.measure]}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        $ {lineTotal.toLocaleString("es-CO")}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="mt-1 text-xs text-slate-500 underline hover:text-red-600"
                      >
                        Quitar
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-red-600"
                      aria-label="Quitar del pedido"
                    >
                      <X className="h-4 w-4" />
                    </button>
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
