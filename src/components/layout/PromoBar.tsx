"use client";

import Link from "next/link";
import { Percent, Truck, Tag } from "lucide-react";
import { useState, useEffect } from "react";

const PROMO_BAR_BG = "#E5DFDF";
const ROTATE_INTERVAL_MS = 5000;

const PROMOS = [
  {
    id: 1,
    icon: Percent,
    text: "Envíos gratis por compras superiores a $$$",
    link: { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
  },
  {
    id: 2,
    icon: Truck,
    text: "Despacho a todo el país en 48-72 horas",
    link: { label: "Ver cobertura", href: "/contact" },
  },
  {
    id: 3,
    icon: Tag,
    text: "Cortes desde 1 metro · Sin mínimo por referencia",
    link: { label: "Ver catálogo", href: "/shop" },
  },
];

export function PromoBar() {
  const [index, setIndex] = useState(0);
  const current = PROMOS[index];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PROMOS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="w-full text-sm"
      style={{ backgroundColor: PROMO_BAR_BG }}
    >
      <div className="flex w-full flex-col items-center justify-center gap-0 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
        <div className="relative w-full overflow-hidden text-center">
          <div
            key={current.id}
            className="flex flex-col items-center gap-1"
            style={{
              animation: "promo-slide-in 0.4s ease-out forwards",
            }}
          >
            <span className="inline-flex items-center gap-2 text-slate-800">
              <span
                className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-600 text-white"
                aria-hidden
              >
                <current.icon className="h-4 w-4" />
              </span>
              <span>{current.text}</span>
            </span>
            <Link
              href={current.link.href}
              className="text-slate-700 underline underline-offset-2 hover:text-slate-900"
            >
              {current.link.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
