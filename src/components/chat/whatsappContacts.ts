export type WhatsAppContact = {
  id: string;
  label: string;
  phone: string;
  message: string;
};

/** Update these phones/labels when the business confirms both lines. */
export const WHATSAPP_CONTACTS: readonly WhatsAppContact[] = [
  {
    id: "sales",
    label: "Ventas",
    phone: "573138718187",
    message: "Hola, quiero información sobre productos Icoltex.",
  },
  
   /* Add the support phone number when the business confirms it.
   */
  {
    id: "support",
    label: "Soporte",
    phone: "57XXXXXXXXXX",
    message: "Hola, necesito ayuda con mi pedido.",
  },
];

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.startsWith("57") ? digits : `57${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}
