"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const NAV_LINKS = [
  { label: "Antifluidos", href: "/shop?category=antifluidos" },
  { label: "Antifluidos", href: "/shop?category=antifluidos" },
  { label: "Antifluidos", href: "/shop?category=antifluidos" },
  { label: "Antifluidos", href: "/shop?category=antifluidos" },
  { label: "Icoltex", href: "/shop" },
];

export function Navbar() {
  const { openCart, itemCount } = useCart();

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo - izquierda */}
        <Link
          href="/"
          className="shrink-0 text-xl font-bold text-red-600"
          aria-label="Icoltex - Inicio"
        >
          X
        </Link>

        {/* Enlaces centrados */}
        <nav className="hidden flex-1 justify-center items-center gap-6 text-sm font-medium text-slate-900 md:flex">
          {NAV_LINKS.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              href={item.href}
              className="mx-4 hover:text-slate-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Búsqueda (pequeña) + carrito - derecha */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="relative w-40 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-full rounded-full border border-slate-200 bg-slate-100 py-1.5 pl-8 pr-3 text-sm placeholder:text-slate-500 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
              aria-label="Buscar productos"
            />
          </div>
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center text-slate-700 transition-colors hover:text-slate-900"
            aria-label="Carrito de compras"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
