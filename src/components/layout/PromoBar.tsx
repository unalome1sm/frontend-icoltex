"use client";

import Link from "next/link";
import { Percent, Truck, Tag } from "lucide-react";
import { useState, useEffect } from "react";

const PROMO_BAR_BG = "#E5DFDF";
const ROTATE_INTERVAL_MS = 5000;

type PromoLink = { label: string; href: string };

const PROMOS: {
  id: number;
  icon: typeof Percent;
  text: string;
  link: PromoLink | null;
}[] = [
  {
    id: 1,
    icon: Percent,
    text: "Envíos gratis por compras superiores a $$$",
    // /terminos-y-condiciones — página pendiente
    link: null,
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
      className="w-full"
      style={{ backgroundColor: PROMO_BAR_BG }}
    >
      <div className="flex w-full flex-col items-center justify-center gap-0 px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8">
        <div className="relative w-full overflow-hidden text-center">
          <div
            key={current.id}
            className="flex flex-col items-center gap-0 leading-none"
            style={{
              animation: "promo-slide-in 0.4s ease-out forwards",
            }}
          >
            <span
              className="inline-flex items-center gap-0.5 text-base font-normal leading-[100%] tracking-normal text-slate-800"
              style={{ fontFamily: "Sarabun, sans-serif" }}
            >
              <span
                className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-600 text-white"
                aria-hidden
              >
                <current.icon className="h-3 w-3" />
              </span>
              <span>{current.text}</span>
            </span>
            {current.link ? (
              <Link
                href={current.link.href}
                className="text-sm text-slate-700 leading-none border-b border-slate-700 hover:border-slate-900 hover:text-slate-900 transition-colors"
              >
                {current.link.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
