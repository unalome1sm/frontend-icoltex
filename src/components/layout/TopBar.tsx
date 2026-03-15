"use client";

import Link from "next/link";
import { useAuthSidebar } from "@/contexts/AuthSidebarContext";

const TOP_BAR_BG = "#F5F5F5";

export function TopBar() {
  const { openAuth } = useAuthSidebar();

  return (
    <div
      className="w-full text-sm text-slate-700"
      style={{ backgroundColor: TOP_BAR_BG }}
    >
      <div className="flex w-full items-center justify-end px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/contact" className="hover:underline">
          Ayuda
        </Link>
        <span className="mx-3 text-slate-300" aria-hidden>
          |
        </span>
        <button
          type="button"
          onClick={() => openAuth("register")}
          className="hover:underline"
        >
          Registrarse
        </button>
        <span className="mx-3 text-slate-300" aria-hidden>
          |
        </span>
        <button
          type="button"
          onClick={() => openAuth("login")}
          className="hover:underline"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
