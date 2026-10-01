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
import { CheckoutIdentityForm } from "./steps/CheckoutIdentityForm";
import { CheckoutBillingForm } from "./steps/CheckoutBillingForm";
import { CheckoutShippingForm } from "./steps/CheckoutShippingForm";
import { CheckoutPaymentStep } from "./steps/CheckoutPaymentStep";
import {
  EMPTY_BILLING,
  EMPTY_PAYMENT,
  EMPTY_PERSONAL,
  EMPTY_SHIPPING,
  loadCheckoutDraft,
  resolveCheckoutSubmission,
  saveCheckoutDraft,
  validateBilling,
  validatePayment,
  validatePersonal,
  validateShipping,
  type BillingData,
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
  tipoDocumento?: string;
  numeroDocumento?: string;
  digitoVerificacion?: string;
  tipoPersona?: string;
  regimenTributario?: string;
  razonSocial?: string;
  movil?: string;
  emailCartera?: string;
  emailFacturacion?: string;
  direccionFacturacion?: string;
  ciudadFacturacion?: string;
  departamentoFacturacion?: string;
  codigoDaneFacturacion?: string;
  direccionEntrega?: string;
  ciudadEntrega?: string;
  departamentoEntrega?: string;
  codigoDaneEntrega?: string;
};

type Step = 0 | 1 | 2 | 3 | 4;

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
  const [billing, setBilling] = useState<BillingData>(EMPTY_BILLING);
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);
  const [payment, setPayment] = useState<PaymentData>(EMPTY_PAYMENT);
  const [personalError, setPersonalError] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [prefillDone, setPrefillDone] = useState(false);

  useEffect(() => {
    const draft = loadCheckoutDraft();
    if (draft) {
      setPersonal({ ...EMPTY_PERSONAL, ...draft.personal });
      setBilling({ ...EMPTY_BILLING, ...(draft.billing ?? {}) });
      const nextShipping = { ...EMPTY_SHIPPING, ...draft.shipping };
      if (
        draft.shipping &&
        draft.shipping.mismaFacturacion === undefined &&
        draft.shipping.direccion?.trim()
      ) {
        nextShipping.mismaFacturacion = false;
      }
      setShipping(nextShipping);
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
            const email = u.email || user.email || "";
            const movil = u.movil || u.telefono || "";
            const telefono = u.telefono || movil;
            const billingAddress = {
              departamento: u.departamentoFacturacion || "",
              ciudad: u.ciudadFacturacion || "",
              codigoDane: u.codigoDaneFacturacion || "",
              direccion: u.direccionFacturacion || u.direccionCasa || "",
            };
            const hasDelivery = Boolean(u.direccionEntrega || u.departamentoEntrega || u.codigoDaneEntrega);
            setPersonal((prev) => ({
              ...prev,
              email,
              nombre: u.nombre || prev.nombre || user.nombre || "",
              apellidos: u.apellidos || prev.apellidos,
              tipoDocumento: u.tipoDocumento || prev.tipoDocumento || (u.cedula ? "13" : ""),
              numeroDocumento: u.numeroDocumento || u.cedula || prev.numeroDocumento,
              digitoVerificacion: u.digitoVerificacion || prev.digitoVerificacion,
              tipoPersona: u.tipoPersona || prev.tipoPersona,
              regimenTributario: u.regimenTributario || prev.regimenTributario,
              razonSocial: u.razonSocial || prev.razonSocial,
              movil: movil || prev.movil,
              telefono: telefono || prev.telefono,
              telefonoIgualMovil: !telefono || telefono === movil,
              emailCartera: u.emailCartera || "",
              emailCarteraIgual: !u.emailCartera || u.emailCartera === email,
              emailFacturacion: u.emailFacturacion || "",
              emailFacturacionIgual: !u.emailFacturacion || u.emailFacturacion === email,
            }));
            setBilling(billingAddress);
            setShipping((prev) => ({
              ...prev,
              mismaFacturacion: !hasDelivery,
              departamento: hasDelivery ? u.departamentoEntrega || "" : prev.departamento,
              ciudad: hasDelivery ? u.ciudadEntrega || "" : prev.ciudad,
              codigoDane: hasDelivery ? u.codigoDaneEntrega || "" : prev.codigoDane,
              direccion: hasDelivery ? u.direccionEntrega || "" : prev.direccion,
              tipoVivienda: u.tipoVivienda === "edificio" ? "edificio" : prev.tipoVivienda,
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
    saveCheckoutDraft({ personal, billing, shipping, payment });
  }, [personal, billing, shipping, payment, draftReady]);

  const handlePersonalSubmit = useCallback(() => {
    const err = validatePersonal(personal);
    setPersonalError(err);
    if (!err) setStepOpen(2);
  }, [personal]);

  const handleBillingSubmit = useCallback(() => {
    const err = validateBilling(billing);
    setBillingError(err);
    if (!err) setStepOpen(3);
  }, [billing]);

  const handleShippingSubmit = useCallback(() => {
    const err = validateShipping(shipping);
    setShippingError(err);
    if (!err) setStepOpen(4);
  }, [shipping]);

  const handleConfirm = useCallback(async () => {
    const pErr = validatePersonal(personal);
    const bErr = validateBilling(billing);
    const sErr = validateShipping(shipping);
    const payErr = validatePayment(payment);
    setPersonalError(pErr);
    setBillingError(bErr);
    setShippingError(sErr);
    setPaymentError(payErr);

    if (pErr) {
      setStepOpen(1);
      return;
    }
    if (bErr) {
      setStepOpen(2);
      return;
    }
    if (sErr) {
      setStepOpen(3);
      return;
    }
    if (payErr || items.length === 0) return;

    setSubmitting(true);
    setPaymentError(null);
    try {
      const resolved = resolveCheckoutSubmission(personal, billing, shipping);
      const { checkout } = await createOrderAndGetWompiCheckout({
        customer: resolved.customer,
        billing: resolved.billing,
        shipping: resolved.shipping,
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
  }, [personal, billing, shipping, payment, items]);

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
              title="1. Identificación y contacto"
              open={stepOpen === 1}
              onToggle={() => setStepOpen((s) => (s === 1 ? 0 : 1))}
            />
            {stepOpen === 1 && (
              <CheckoutIdentityForm
                value={personal}
                error={personalError}
                onChange={setPersonal}
                onSubmit={handlePersonalSubmit}
              />
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionHeader
              title="2. Facturación"
              open={stepOpen === 2}
              muted={stepOpen !== 2}
              onToggle={() => setStepOpen((s) => (s === 2 ? 0 : 2))}
            />
            {stepOpen === 2 && (
              <CheckoutBillingForm
                value={billing}
                error={billingError}
                onChange={setBilling}
                onSubmit={handleBillingSubmit}
                onBack={() => setStepOpen(1)}
              />
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionHeader
              title="3. Entrega"
              open={stepOpen === 3}
              muted={stepOpen !== 3}
              onToggle={() => setStepOpen((s) => (s === 3 ? 0 : 3))}
            />
            {stepOpen === 3 && (
              <CheckoutShippingForm
                value={shipping}
                error={shippingError}
                onChange={setShipping}
                onSubmit={handleShippingSubmit}
                onBack={() => setStepOpen(2)}
              />
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AccordionHeader
              title="4. Pago"
              open={stepOpen === 4}
              muted={stepOpen !== 4}
              onToggle={() => setStepOpen((s) => (s === 4 ? 0 : 4))}
            />
            {stepOpen === 4 && (
              <CheckoutPaymentStep
                error={paymentError}
                submitting={submitting}
                disabled={items.length === 0}
                acceptTerms={payment.acceptTerms}
                onAcceptTermsChange={(acceptTerms) =>
                  setPayment((prev) => ({ ...prev, acceptTerms, method: "wompi" }))
                }
                onSubmit={() => void handleConfirm()}
                onBack={() => setStepOpen(3)}
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
