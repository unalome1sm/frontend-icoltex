"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { InfoSidebar } from "@/components/info/InfoSidebar";
import { ICOLTEX_INFO_SECTIONS } from "@/components/info/infoNav";

const NAV_LOGO_MOBILE_SRC = "/icons/LOGOS-03.svg";

export function InfoMobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:hidden">
        <div className="relative flex w-full items-center px-4 py-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center text-slate-700"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            aria-label="Icoltex - Inicio"
            onClick={close}
          >
            <Image
              src={NAV_LOGO_MOBILE_SRC}
              alt="Icoltex"
              width={1920}
              height={1080}
              className="h-5 w-auto max-h-5 max-w-[6rem] object-contain object-center"
              priority
              unoptimized
            />
          </Link>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <aside
            className="relative flex h-full w-[18.5rem] max-w-[85vw] flex-col bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="font-medium text-slate-900">Menú</span>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar menú"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <InfoSidebar
                sections={ICOLTEX_INFO_SECTIONS}
                showBrand={false}
                onNavigate={close}
              />
            </div>
          </aside>
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={close}
            aria-label="Cerrar menú"
          />
        </div>
      )}
    </>
  );
}
