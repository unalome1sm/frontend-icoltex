"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";

const RECURSOS_LINKS = [
  { label: "Buscar tienda", href: "/stores" },
  { label: "Regístrate para recibir correos", href: "/" },
  // { label: "Eventos Icoltex", href: "/eventos" },
  { label: "Blog", href: "/blog" },
];

const AYUDA_LINKS = [
  // { label: "Obtener ayuda", href: "/ayuda" },
  // { label: "Preguntas frecuentes", href: "/faq" },
  // { label: "Estado de pedido", href: "/account/orders" },
  // { label: "Envío y entrega", href: "/envio" },
  // { label: "Devoluciones", href: "/devoluciones" },
  // { label: "Opciones de pago", href: "/pago" },
  { label: "Comunícate con nosotros", href: "/contact" },
];

const ACERCA_LINKS = [
  { label: "Acerca de Icoltex", href: "/about" },
  { label: "Sostenibilidad", href: "/about/sostenibilidad" },
  // { label: "Noticias", href: "/noticias" },
  // { label: "Inversionistas", href: "/inversionistas" },
  // { label: "Propósito", href: "/proposito" },
  // { label: "Sostenibilidad", href: "/sostenibilidad" },
];

const LEGAL_LINKS = [
  { label: "Políticas", href: "/about/politicas" },
  { label: "Tratamiento de datos", href: "/about/tratamiento-datos" },
  { label: "Términos y condiciones promociones", href: "/about/promociones" },
];

const PUNTOS_LINKS = [
  { label: "Bogotá", href: "/stores?ciudad=bogota" },
  { label: "Medellín", href: "/stores?ciudad=medellin" },
  { label: "Barranquilla", href: "/stores?ciudad=barranquilla" },
  { label: "Ciudad", href: "/stores" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "YouTube", href: "#", Icon: Youtube },
  { label: "Sitio web", href: "#", Icon: Globe },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="w-full py-12 pl-8 pr-4 sm:pl-12 sm:pr-6 lg:pl-16 lg:pr-8">
        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Recursos Icoltex + redes */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
              Recursos Icoltex
            </h3>
            <ul className="flex flex-col gap-2">
              {RECURSOS_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 pt-1" aria-label="Redes sociales">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-red-600 text-red-600 transition hover:bg-red-600 hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Ayuda" links={AYUDA_LINKS} />
          <FooterColumn title="Acerca de Icoltex" links={ACERCA_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
          <FooterColumn title="Puntos de venta" links={PUNTOS_LINKS} />
        </div>

        {/* Líneas y copyright */}
        <div className="mt-12 w-full space-y-0">
          <div className="border-t border-gray-200" />
          <p className="py-3 text-center text-xs uppercase tracking-wide text-gray-500">
            Copyright © · Todos los derechos reservados.
          </p>
          <div className="border-t border-gray-200" />
        </div>
      </div>
    </footer>
  );
}
