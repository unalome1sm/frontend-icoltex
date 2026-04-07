"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

/** Marca compacta (misma en móvil y desktop; ancho responsive como el wordmark anterior). */
const NAV_LOGO_SRC = "/icons/LOGOS-03.svg";

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
    <header className="w-full overflow-visible border-b border-slate-200 bg-white">
      <div className="flex w-full items-center justify-between gap-3 overflow-visible px-4 py-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo: altura solo en la imagen + overflow visible para no recortar el SVG */}
        <Link
          href="/"
          className="m-0 flex shrink-0 items-center justify-start overflow-visible p-0 leading-none outline-offset-2 [-webkit-tap-highlight-color:transparent] -ml-4 sm:-ml-6 lg:-ml-8"
          aria-label="Icoltex - Inicio"
        >
          <Image
            src={NAV_LOGO_SRC}
            alt="Icoltex"
            width={1920}
            height={1080}
            className="m-0 block h-11 w-auto max-h-11 object-contain object-left p-0 max-w-[min(60vw,14rem)] sm:max-w-[min(54vw,16rem)] md:max-w-[17rem] lg:max-w-[20rem]"
            priority
            unoptimized
          />
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
            <Search className="pointer-events-none absolute left-2 top-1/2 m-0 h-3.5 w-3.5 -translate-y-1/2 p-0 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-full rounded-full border border-slate-200 bg-slate-100 py-1.5 pl-7 pr-3 text-sm placeholder:text-slate-500 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
              aria-label="Buscar productos"
            />
          </div>
          <button
            type="button"
            onClick={openCart}
            className="relative m-0 flex h-9 w-9 shrink-0 items-center justify-center p-0 text-slate-700 transition-colors hover:text-slate-900"
            aria-label="Carrito de compras"
          >
            <ShoppingCart className="m-0 h-5 w-5 shrink-0 p-0" />
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
