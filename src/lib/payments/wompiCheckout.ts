import { apiFetch } from "@/lib/api";

export type WompiCheckoutResponse = {
  order: {
    reference: string;
    status: string;
    amountInCents: number;
    total: number;
  };
  checkout: {
    reference: string;
    publicKey: string;
    currency: string;
    amountInCents: number;
    integritySignature: string;
    redirectUrl: string;
    checkoutUrl: string;
    env: "sandbox" | "production";
  };
};

export type CreateOrderPayload = {
  customer: {
    email: string;
    nombre: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    telefono: string;
    recibirNovedades: boolean;
  };
  shipping: {
    departamento: string;
    ciudad: string;
    direccion: string;
    tipoVivienda: "casa" | "edificio";
    apartamento?: string;
    notas?: string;
  };
  items: Array<{
    productId: string;
    nombre: string;
    quantity: number;
    measure: "metro" | "rollo" | "peso";
    color?: string;
    precioMetro: number;
    imageUrl?: string;
  }>;
};

export async function createOrderAndGetWompiCheckout(
  payload: CreateOrderPayload,
): Promise<WompiCheckoutResponse> {
  return apiFetch<WompiCheckoutResponse>("/api/orders", {
    method: "POST",
    body: payload,
  });
}

export type OrderStatusResponse = {
  order: {
    reference: string;
    status: "PENDING" | "APPROVED" | "DECLINED" | "VOIDED" | "ERROR";
    currency: string;
    amountInCents: number;
    total: number;
    customer: CreateOrderPayload["customer"];
    shipping: CreateOrderPayload["shipping"];
    items: Array<{
      productId: string;
      nombre: string;
      quantity: number;
      measure: string;
      color?: string;
      unitPrice: number;
      lineTotal: number;
      imageUrl?: string;
    }>;
    wompiTransactionId?: string;
    paymentMethodType?: string;
    statusMessage?: string;
    createdAt: string;
    updatedAt: string;
  };
};

export async function fetchOrderByReference(
  reference: string,
): Promise<OrderStatusResponse> {
  return apiFetch<OrderStatusResponse>(
    `/api/orders/${encodeURIComponent(reference)}`,
  );
}

/** Submits a GET form to Wompi Web Checkout (redirect). */
export function redirectToWompiCheckout(
  checkout: WompiCheckoutResponse["checkout"],
) {
  const form = document.createElement("form");
  form.method = "GET";
  form.action = checkout.checkoutUrl;
  form.style.display = "none";

  // Required fields only (+ redirect when public HTTPS). Do not send customer/
  // shipping query params (CloudFront WAF). Localhost redirect-url also 403s.
  const fields: Record<string, string> = {
    "public-key": checkout.publicKey,
    currency: checkout.currency,
    "amount-in-cents": String(checkout.amountInCents),
    reference: checkout.reference,
    "signature:integrity": checkout.integritySignature,
  };

  if (checkout.redirectUrl && isSafeWompiRedirectUrl(checkout.redirectUrl)) {
    fields["redirect-url"] = checkout.redirectUrl;
  } else {
    // After paying in local, open /checkout/result?reference=…
    try {
      sessionStorage.setItem("icoltex_pending_order_ref", checkout.reference);
    } catch {
      // ignore
    }
  }

  for (const [name, value] of Object.entries(fields)) {
    if (!value) continue;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

function isSafeWompiRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return host !== "localhost" && host !== "127.0.0.1" && !host.endsWith(".local");
  } catch {
    return false;
  }
}
