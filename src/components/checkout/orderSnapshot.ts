import type { CartItem } from "@/contexts/CartContext";
import {
  isDocumentType,
  isNaturalPerson,
  isPersonType,
  isTaxRegime,
  requiresVerificationDigit,
} from "@/lib/checkout";

export const CHECKOUT_DRAFT_KEY = "icoltex_checkout_draft";
export const LAST_ORDER_KEY = "icoltex_last_order";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PersonalData = {
  email: string;
  nombre: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  digitoVerificacion: string;
  tipoPersona: string;
  regimenTributario: string;
  razonSocial: string;
  telefono: string;
  movil: string;
  telefonoIgualMovil: boolean;
  emailCartera: string;
  emailCarteraIgual: boolean;
  emailFacturacion: string;
  emailFacturacionIgual: boolean;
  recibirNovedades: boolean;
};

export type BillingData = {
  departamento: string;
  ciudad: string;
  direccion: string;
  codigoDane: string;
};

export type ShippingData = {
  mismaFacturacion: boolean;
  departamento: string;
  ciudad: string;
  direccion: string;
  codigoDane: string;
  tipoVivienda: "casa" | "edificio";
  apartamento: string;
  notas: string;
};

export type PaymentMethod = "wompi";

export type PaymentData = {
  method: PaymentMethod;
  acceptTerms: boolean;
};

export type CheckoutDraft = {
  personal: PersonalData;
  billing: BillingData;
  shipping: ShippingData;
  payment: PaymentData;
};

export type CheckoutCustomerPayload = {
  email: string;
  nombre: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  digitoVerificacion?: string;
  tipoPersona: string;
  regimenTributario: string;
  razonSocial: string;
  telefono: string;
  movil: string;
  emailCartera: string;
  emailFacturacion: string;
  recibirNovedades: boolean;
};

export type CheckoutAddressPayload = {
  departamento: string;
  ciudad: string;
  direccion: string;
  codigoDane: string;
};

export type CheckoutShippingPayload = CheckoutAddressPayload & {
  tipoVivienda: "casa" | "edificio";
  apartamento?: string;
  notas?: string;
};

export type OrderSnapshot = {
  id: string;
  createdAt: string;
  customer: PersonalData;
  billing: BillingData;
  shipping: ShippingData;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  total: number;
};

export const EMPTY_PERSONAL: PersonalData = {
  email: "",
  nombre: "",
  apellidos: "",
  tipoDocumento: "",
  numeroDocumento: "",
  digitoVerificacion: "",
  tipoPersona: "",
  regimenTributario: "",
  razonSocial: "",
  telefono: "",
  movil: "",
  telefonoIgualMovil: true,
  emailCartera: "",
  emailCarteraIgual: true,
  emailFacturacion: "",
  emailFacturacionIgual: true,
  recibirNovedades: true,
};

export const EMPTY_BILLING: BillingData = {
  departamento: "",
  ciudad: "",
  direccion: "",
  codigoDane: "",
};

export const EMPTY_SHIPPING: ShippingData = {
  mismaFacturacion: true,
  departamento: "",
  ciudad: "",
  direccion: "",
  codigoDane: "",
  tipoVivienda: "casa",
  apartamento: "",
  notas: "",
};

export const EMPTY_PAYMENT: PaymentData = {
  method: "wompi",
  acceptTerms: false,
};

export function loadCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutDraft;
  } catch {
    return null;
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function clearCheckoutDraft() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function saveLastOrder(order: OrderSnapshot) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // ignore
  }
}

export function loadLastOrder(): OrderSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderSnapshot;
  } catch {
    return null;
  }
}

function digits(value: string): string {
  return value.replace(/\D/g, "");
}

function validEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function validatePersonal(data: PersonalData): string | null {
  if (!isPersonType(data.tipoPersona)) return "Selecciona el tipo de persona.";
  if (!isTaxRegime(data.regimenTributario)) return "Selecciona el régimen tributario.";
  if (!isDocumentType(data.tipoDocumento)) return "Selecciona un tipo de documento.";
  if (!data.numeroDocumento.trim()) return "El número de documento es obligatorio.";
  if (requiresVerificationDigit(data.tipoDocumento) && !/^\d$/.test(data.digitoVerificacion.trim())) {
    return "Indica el dígito de verificación del NIT.";
  }
  if (isNaturalPerson(data.tipoPersona)) {
    if (!data.nombre.trim()) return "El nombre es obligatorio.";
    if (!data.apellidos.trim()) return "Los apellidos son obligatorios.";
  } else if (!data.razonSocial.trim()) {
    return "La razón social es obligatoria.";
  }
  if (digits(data.movil).length < 7) return "El móvil es obligatorio.";
  if (!data.telefonoIgualMovil && digits(data.telefono).length < 7) {
    return "El teléfono es obligatorio.";
  }
  if (!validEmail(data.email)) return "Ingresa un correo electrónico válido.";
  if (!data.emailCarteraIgual && !validEmail(data.emailCartera)) {
    return "Ingresa un correo de cartera válido.";
  }
  if (!data.emailFacturacionIgual && !validEmail(data.emailFacturacion)) {
    return "Ingresa un correo de facturación electrónica válido.";
  }
  return null;
}

export function validateBilling(data: BillingData): string | null {
  return validateAddress(data, "facturación");
}

export function validateShipping(data: ShippingData): string | null {
  if (!data.mismaFacturacion) {
    const addressError = validateAddress(data, "entrega");
    if (addressError) return addressError;
  }
  if (data.tipoVivienda === "edificio" && !data.apartamento.trim()) {
    return "Indica el apartamento o piso.";
  }
  return null;
}

function validateAddress(
  data: { departamento: string; ciudad: string; direccion: string; codigoDane: string },
  label: string,
): string | null {
  if (!data.direccion.trim()) return `La dirección de ${label} es obligatoria.`;
  if (!data.departamento.trim()) return `El departamento de ${label} es obligatorio.`;
  if (!data.ciudad.trim() || !/^\d{5}$/.test(data.codigoDane.trim())) {
    return `Selecciona el municipio de ${label}.`;
  }
  return null;
}

export function validatePayment(data: PaymentData): string | null {
  if (!data.acceptTerms) {
    return "Debes aceptar los términos y condiciones para continuar.";
  }
  return null;
}

export function resolveCheckoutSubmission(
  personal: PersonalData,
  billing: BillingData,
  shipping: ShippingData,
): {
  customer: CheckoutCustomerPayload;
  billing: CheckoutAddressPayload;
  shipping: CheckoutShippingPayload;
} {
  const email = personal.email.trim().toLowerCase();
  const movil = digits(personal.movil);
  const telefono = personal.telefonoIgualMovil ? movil : digits(personal.telefono);
  const natural = isNaturalPerson(personal.tipoPersona);
  const nombre = personal.nombre.trim();
  const apellidos = natural ? personal.apellidos.trim() : personal.apellidos.trim();
  const razonSocial = natural
    ? personal.razonSocial.trim() || `${nombre} ${apellidos}`.trim()
    : personal.razonSocial.trim();
  const delivery = shipping.mismaFacturacion ? billing : shipping;

  return {
    customer: {
      email,
      nombre: nombre || razonSocial,
      apellidos,
      tipoDocumento: personal.tipoDocumento,
      numeroDocumento: personal.numeroDocumento.trim().replace(/\s+/g, ""),
      digitoVerificacion: requiresVerificationDigit(personal.tipoDocumento)
        ? personal.digitoVerificacion.trim()
        : undefined,
      tipoPersona: personal.tipoPersona,
      regimenTributario: personal.regimenTributario,
      razonSocial,
      telefono,
      movil,
      emailCartera: (personal.emailCarteraIgual ? email : personal.emailCartera.trim()).toLowerCase(),
      emailFacturacion: (
        personal.emailFacturacionIgual ? email : personal.emailFacturacion.trim()
      ).toLowerCase(),
      recibirNovedades: personal.recibirNovedades,
    },
    billing: {
      departamento: billing.departamento.trim(),
      ciudad: billing.ciudad.trim(),
      direccion: billing.direccion.trim(),
      codigoDane: billing.codigoDane.trim(),
    },
    shipping: {
      departamento: delivery.departamento.trim(),
      ciudad: delivery.ciudad.trim(),
      direccion: delivery.direccion.trim(),
      codigoDane: delivery.codigoDane.trim(),
      tipoVivienda: shipping.tipoVivienda,
      apartamento: shipping.tipoVivienda === "edificio" ? shipping.apartamento.trim() : undefined,
      notas: shipping.notas.trim() || undefined,
    },
  };
}

export function buildOrderSnapshot(input: {
  personal: PersonalData;
  billing: BillingData;
  shipping: ShippingData;
  payment: PaymentData;
  items: CartItem[];
  subtotal: number;
}): OrderSnapshot {
  return {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer: { ...input.personal },
    billing: { ...input.billing },
    shipping: { ...input.shipping },
    paymentMethod: "wompi",
    items: input.items.map((item) => ({ ...item })),
    subtotal: input.subtotal,
    total: input.subtotal,
  };
}
