import type { CartItem } from "@/contexts/CartContext";

export const CHECKOUT_DRAFT_KEY = "icoltex_checkout_draft";
export const LAST_ORDER_KEY = "icoltex_last_order";

export type PersonalData = {
  email: string;
  nombre: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  recibirNovedades: boolean;
};

export type ShippingData = {
  departamento: string;
  ciudad: string;
  direccion: string;
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
  shipping: ShippingData;
  payment: PaymentData;
};

export type OrderSnapshot = {
  id: string;
  createdAt: string;
  customer: PersonalData;
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
  telefono: "",
  recibirNovedades: true,
};

export const EMPTY_SHIPPING: ShippingData = {
  departamento: "",
  ciudad: "",
  direccion: "",
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

export function validatePersonal(data: PersonalData): string | null {
  if (!data.email.trim()) return "El correo electrónico es obligatorio.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return "Ingresa un correo electrónico válido.";
  }
  if (!data.nombre.trim()) return "El nombre es obligatorio.";
  if (!data.apellidos.trim()) return "Los apellidos son obligatorios.";
  if (!data.tipoDocumento) return "Selecciona un tipo de documento.";
  if (!data.numeroDocumento.trim()) return "El número de documento es obligatorio.";
  if (!data.telefono.trim()) return "El número celular es obligatorio.";
  return null;
}

export function validateShipping(data: ShippingData): string | null {
  if (!data.departamento.trim()) return "El departamento es obligatorio.";
  if (!data.ciudad.trim()) return "La ciudad es obligatoria.";
  if (!data.direccion.trim()) return "La dirección es obligatoria.";
  if (data.tipoVivienda === "edificio" && !data.apartamento.trim()) {
    return "Indica el apartamento o piso.";
  }
  return null;
}

export function validatePayment(data: PaymentData): string | null {
  if (!data.acceptTerms) {
    return "Debes aceptar los términos y condiciones para continuar.";
  }
  return null;
}

export function buildOrderSnapshot(input: {
  personal: PersonalData;
  shipping: ShippingData;
  payment: PaymentData;
  items: CartItem[];
  subtotal: number;
}): OrderSnapshot {
  return {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer: { ...input.personal },
    shipping: { ...input.shipping },
  paymentMethod: "wompi",
  items: input.items.map((i) => ({ ...i })),
  subtotal: input.subtotal,
  total: input.subtotal,
};
}
