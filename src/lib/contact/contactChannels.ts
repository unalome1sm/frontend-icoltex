export type ContactSubjectOption = {
  value: string;
  label: string;
};

export type ContactSocialLink = {
  id: string;
  label: string;
  href: string;
  /** Path under /public, e.g. /icons/redes-sociales/icon-facebook.png */
  iconSrc: string;
};

export const CONTACT_HEADQUARTERS = {
  label: "Sede principal",
  addressLines: ["Cl. 42b Sur #52b-16", "Bogotá, Colombia"],
} as const;

export const CONTACT_PHONE = {
  label: "Teléfono",
  display: "+57 322 208 8441",
  href: "tel:+573222088441",
} as const;

export const CONTACT_EMAIL = {
  label: "Correo electrónico",
  display: "contacto@icoltex.com",
  href: "mailto:contacto@icoltex.com",
} as const;

export const CONTACT_HOURS = {
  label: "Horario de atención",
  lines: [
    "Lunes a viernes: 8:00 a.m. – 6:00 p.m.",
    "Sábados: 9:00 a.m. – 1:00 p.m.",
  ],
} as const;

export const CONTACT_SUBJECT_OPTIONS: readonly ContactSubjectOption[] = [
  { value: "cotizacion", label: "Cotización de telas" },
  { value: "pedido", label: "Consulta sobre un pedido" },
  { value: "showroom", label: "Visita a showroom / punto de venta" },
  { value: "otro", label: "Otro" },
];

export const CONTACT_SOCIAL_LINKS: readonly ContactSocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "#",
    iconSrc: "/icons/redes-sociales/icon-instagram.png",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "#",
    iconSrc: "/icons/redes-sociales/icon-facebook.png",
  },
  {
    id: "x",
    label: "X",
    href: "#",
    iconSrc: "/icons/redes-sociales/icon-x.png",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "#",
    iconSrc: "/icons/redes-sociales/icon-youtube.png",
  },
];
