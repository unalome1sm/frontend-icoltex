"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { NavMegaMenu } from "./NavMegaMenu";
import {
  NAV_CATALOG_ITEMS,
  isNavItemActive,
  navMegaMenuHref,
  navMegaMenuLinksForLinea,
  resolveLineaForNav,
  shopUrlForLinea,
  shopUrlForSearch,
} from "@/lib/catalog";
import { fetchCatalogFilterMeta, type CatalogFilterMeta } from "@/lib/catalog";

const NAV_LOGO_DESKTOP_SRC = "/icons/LOGOS-02.svg";
const NAV_LOGO_MOBILE_SRC = "/icons/LOGOS-03.svg";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  useEffect(() => {
    setSearch(typeof window !== "undefined" ? window.location.search : "");
  }, [pathname]);
  const lineaParam = useMemo(
    () => (search ? new URLSearchParams(search).get("linea") : null),
    [search],
  );

  const { openCart, itemCount } = useCart();
  const headerRef = useRef<HTMLElement>(null);
  const closeMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [meta, setMeta] = useState<CatalogFilterMeta | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCatalogFilterMeta()
      .then(setMeta)
      .catch(() => setMeta(null))
      .finally(() => setLoadingMeta(false));
  }, []);

  const closeMenus = useCallback(() => {
    if (closeMenuTimerRef.current) {
      clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
    setOpenMenuId(null);
    setMobileOpen(false);
    setMobileExpandedId(null);
  }, []);

  const openDesktopMenu = useCallback((id: string) => {
    if (closeMenuTimerRef.current) {
      clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
    setOpenMenuId(id);
  }, []);

  const scheduleCloseDesktopMenu = useCallback(() => {
    if (closeMenuTimerRef.current) clearTimeout(closeMenuTimerRef.current);
    closeMenuTimerRef.current = setTimeout(() => {
      setOpenMenuId(null);
      closeMenuTimerRef.current = null;
    }, 120);
  }, []);

  const cancelCloseDesktopMenu = useCallback(() => {
    if (closeMenuTimerRef.current) {
      clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (closeMenuTimerRef.current) clearTimeout(closeMenuTimerRef.current);
    };
  }, []);

  useEffect(() => {
    closeMenus();
  }, [pathname, search, closeMenus]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMenus]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!openMenuId) return;
      if (headerRef.current?.contains(e.target as Node)) return;
      setOpenMenuId(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openMenuId]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = shopUrlForSearch(searchQuery);
    closeMenus();
    router.push(url);
  }

  const openItem = NAV_CATALOG_ITEMS.find((item) => item.id === openMenuId);

  return (
    <header
      ref={headerRef}
      className="relative w-full overflow-visible border-b border-slate-200 bg-white"
      onMouseEnter={cancelCloseDesktopMenu}
      onMouseLeave={scheduleCloseDesktopMenu}
    >
      <div className="relative flex w-full items-center justify-between gap-3 overflow-visible px-4 py-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Izquierda: hamburger (móvil) + logo (desktop) */}
        <div className="flex min-w-9 shrink-0 items-center justify-start lg:min-w-0">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center text-slate-700 lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href="/"
            className="m-0 hidden shrink-0 items-center justify-start overflow-visible p-0 leading-none outline-offset-2 [-webkit-tap-highlight-color:transparent] lg:flex -ml-4 sm:-ml-6 lg:-ml-8"
            aria-label="Icoltex - Inicio"
            onClick={closeMenus}
          >
            <Image
              src={NAV_LOGO_DESKTOP_SRC}
              alt="Icoltex"
              width={1920}
              height={1080}
              className="m-0 block h-12 w-auto max-h-12 object-contain object-left p-0 max-w-[18rem] lg:max-w-[22rem]"
              priority
              unoptimized
            />
          </Link>
        </div>

        {/* Centro: logo compacto (móvil) */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:hidden"
          aria-label="Icoltex - Inicio"
          onClick={closeMenus}
        >
          <Image
            src={NAV_LOGO_MOBILE_SRC}
            alt="Icoltex"
            width={1920}
            height={1080}
            className="h-9 w-auto max-h-9 max-w-[10rem] object-contain object-center"
            priority
            unoptimized
          />
        </Link>

        {/* Desktop: menú de categorías */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 text-sm font-medium text-slate-900 lg:flex"
          aria-label="Categorías"
        >
          {NAV_CATALOG_ITEMS.map((item) => {
            const isExternal = "href" in item && item.href;
            const isOpen = openMenuId === item.id;
            const isActive =
              isOpen || isNavItemActive(item.label, pathname, lineaParam, meta);

            if (isExternal) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="mx-3 py-2 text-slate-900 transition-colors hover:text-slate-600"
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => openDesktopMenu(item.id)}
                onFocus={() => openDesktopMenu(item.id)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={`relative mx-3 py-2 transition-colors hover:text-slate-600 ${
                  isActive ? "font-semibold text-slate-900" : "text-slate-900"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Búsqueda (desktop) + bolsa */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden w-40 sm:block sm:w-48">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-full border border-slate-200 bg-slate-100 py-1.5 pl-8 pr-3 text-sm placeholder:text-slate-500 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
              aria-label="Buscar productos"
            />
          </form>

          <button
            type="button"
            onClick={openCart}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center text-slate-700 transition-colors hover:text-slate-900"
            aria-label="Bolsa de compras"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop mega menú */}
      {openItem && !("href" in openItem && openItem.href) && (
        <NavMegaMenu
          item={openItem}
          linea={resolveLineaForNav(openItem.label, meta)}
          links={navMegaMenuLinksForLinea(openItem.label, meta)}
          loading={loadingMeta}
          onClose={() => setOpenMenuId(null)}
        />
      )}

      {/* Móvil: drawer de navegación */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <form onSubmit={handleSearchSubmit} className="relative border-b border-slate-100 px-4 py-3">
            <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-full border border-slate-200 bg-slate-100 py-2 pl-9 pr-3 text-sm"
              aria-label="Buscar productos"
            />
          </form>

          <nav className="max-h-[70vh] overflow-y-auto px-2 py-2" aria-label="Categorías móvil">
            {NAV_CATALOG_ITEMS.map((item) => {
              if ("href" in item && item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={closeMenus}
                    className="block rounded-md px-3 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                );
              }

              const expanded = mobileExpandedId === item.id;
              const linea = resolveLineaForNav(item.label, meta);
              const navLinks = navMegaMenuLinksForLinea(item.label, meta);
              const isActive = isNavItemActive(item.label, pathname, lineaParam, meta);

              return (
                <div key={item.id} className="border-b border-slate-100 last:border-0">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpandedId((prev) => (prev === item.id ? null : item.id))
                    }
                    className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-slate-50 ${
                      isActive ? "text-red-600" : "text-slate-900"
                    }`}
                    aria-expanded={expanded}
                  >
                    {item.label}
                    <span className="text-slate-400">{expanded ? "−" : "+"}</span>
                  </button>

                  {expanded && (
                    <div className="space-y-1 px-3 pb-3">
                      <Link
                        href={shopUrlForLinea(linea)}
                        onClick={closeMenus}
                        className="block py-1.5 text-sm font-semibold text-slate-800 hover:text-red-600"
                      >
                        Ver todo en {item.label}
                      </Link>
                      {loadingMeta ? (
                        <p className="py-2 text-sm text-slate-500">Cargando…</p>
                      ) : navLinks.length === 0 ? (
                        <p className="py-2 text-sm text-slate-500">Sin filtros disponibles</p>
                      ) : (
                        navLinks.map((entry) => (
                          <Link
                            key={`${entry.kind}:${entry.label}`}
                            href={navMegaMenuHref(linea, entry)}
                            onClick={closeMenus}
                            className="block py-1.5 text-sm text-slate-600 hover:text-red-600"
                          >
                            {entry.label}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
