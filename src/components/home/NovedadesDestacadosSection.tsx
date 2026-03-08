"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const ITEMS = [
  { id: "1", name: "Nombre ítem", description: "Descripción ítem", price: "Precio", href: "/shop" },
  { id: "2", name: "Nombre ítem", description: "Descripción ítem", price: "Precio", href: "/shop" },
  { id: "3", name: "Nombre ítem", description: "Descripción ítem", price: "Precio", href: "/shop" },
  { id: "4", name: "Nombre ítem", description: "Descripción ítem", price: "Precio", href: "/shop" },
  { id: "5", name: "Nombre ítem", description: "Descripción ítem", price: "Precio", href: "/shop" },
];

type Tab = "novedades" | "destacados";

export function NovedadesDestacadosSection() {
  const [activeTab, setActiveTab] = useState<Tab>("destacados");

  return (
    <section className="w-full space-y-0">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("novedades")}
            className={`text-sm font-medium transition-colors ${
              activeTab === "novedades" ? "text-red-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Novedades
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("destacados")}
            className={`text-sm font-medium transition-colors ${
              activeTab === "destacados" ? "text-red-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Destacados
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {ITEMS.map((item) => (
          <Link key={item.id} href={item.href} className="flex flex-col">
            <div className="relative aspect-[3/4] w-full min-h-[200px] overflow-hidden rounded-lg bg-slate-200 md:min-h-[260px]">
              <span className="absolute bottom-3 left-3 rounded bg-red-600 px-2.5 py-1 text-xs font-medium text-white">
                Lo más nuevo
              </span>
            </div>
            <div className="mt-4 space-y-0.5">
              <p className="text-base font-semibold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-600">{item.description}</p>
              <p className="text-sm font-medium text-slate-900">{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
