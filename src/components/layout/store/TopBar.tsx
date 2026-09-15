"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthSidebar } from "@/contexts/AuthSidebarContext";
import { useAuth } from "@/contexts/AuthContext";

const TOP_BAR_BG = "#F5F5F5";

function TopBarDivider() {
  return (
    <span className="mx-3 text-slate-300" aria-hidden>
      |
    </span>
  );
}

export function TopBar() {
  const router = useRouter();
  const { openAuth } = useAuthSidebar();
  const { isAuthenticated, logout, loading } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="w-full text-label text-slate-700"
      style={{ backgroundColor: TOP_BAR_BG }}
    >
      <div className="flex w-full items-center justify-end px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/about" className="hover:underline">
          Acerca de Icoltex
        </Link>
        <TopBarDivider />
        <Link href="/contact" className="hover:underline">
          Ayuda
        </Link>

        {!loading && isAuthenticated ? (
          <>
            <TopBarDivider />
            <Link href="/account" className="hover:underline">
              Mi cuenta
            </Link>
            <TopBarDivider />
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="hover:underline"
            >
              Cerrar sesión
            </button>
          </>
        ) : !loading ? (
          <>
            <TopBarDivider />
            <button
              type="button"
              onClick={() => openAuth("register")}
              className="hover:underline"
            >
              Registrarse
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
