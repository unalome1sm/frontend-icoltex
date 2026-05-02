export type InfoNavItem = {
  label: string;
  href: string;
};

export type InfoNavGroup = {
  label: string;
  items: InfoNavItem[];
};

export type InfoNavSection = {
  label: string;
  items?: InfoNavItem[];
  groups?: InfoNavGroup[];
};

export const ICOLTEX_INFO_SECTIONS: InfoNavSection[] = [
  {
    label: "Acerca de Icoltex",
    items: [
      { label: "Nuestra Historia", href: "/about/nuestra-historia" },
      {
        label: "Compromiso con la sostenibilidad",
        href: "/about/sostenibilidad",
      },
      { label: "Preguntas Frecuentes", href: "/about/preguntas-frecuentes" },
    ],
  },
  {
    label: "Políticas",
    groups: [
      {
        label: "Garantías y devoluciones",
        items: [
          { label: "Condiciones generales", href: "/about/condiciones-generales" },
          { label: "Qué cubre la garantía", href: "/about/que-cubre-la-garantia" },
          {
            label: "Condiciones para que aplique",
            href: "/about/condiciones-para-que-aplique",
          },
          { label: "Cómo hacer un reclamo", href: "/about/como-hacer-un-reclamo" },
          { label: "Tiempos de respuesta", href: "/about/tiempos-de-respuesta" },
          { label: "Soluciones posibles", href: "/about/soluciones-posibles" },
          { label: "Información adicional", href: "/about/informacion-adicional" },
        ],
      },
    ],
  },
  {
    label: "Tratamiento de datos",
    items: [
      { label: "Datos del responsable", href: "/about/tratamiento-datos" },
      { label: "Normatividad y ámbito", href: "/about/tratamiento-datos/normatividad" },
      { label: "Definiciones", href: "/about/tratamiento-datos/definiciones" },
      { label: "Finalidades del tratamiento", href: "/about/tratamiento-datos/finalidades" },
      { label: "Principios", href: "/about/tratamiento-datos/principios" },
      { label: "Derechos del titular", href: "/about/tratamiento-datos/derechos" },
      { label: "Deberes", href: "/about/tratamiento-datos/deberes" },
      { label: "Autorización y aviso de privacidad", href: "/about/tratamiento-datos/autorizacion-y-aviso" },
      { label: "Conservación y limitaciones", href: "/about/tratamiento-datos/limitaciones" },
      { label: "Datos sensibles y videovigilancia", href: "/about/tratamiento-datos/datos-sensibles" },
      { label: "PQRS y procedimiento", href: "/about/tratamiento-datos/pqrs" },
      { label: "Seguridad y modificaciones", href: "/about/tratamiento-datos/seguridad-y-modificaciones" },
      { label: "Vigencia, aceptación y notas", href: "/about/tratamiento-datos/vigencia" },
    ],
  },
  {
    label: "Términos y condiciones promociones",
    items: [
      {
        label: "T&C - Cyber black (Digital) 40% OFF",
        href: "/about/promociones/cyber-black-digital-40",
      },
    ],
  },
];
