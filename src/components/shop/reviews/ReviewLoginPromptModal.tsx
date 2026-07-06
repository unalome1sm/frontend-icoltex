"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useAuthSidebar } from "@/contexts/AuthSidebarContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ReviewLoginPromptModal({ open, onClose }: Props) {
  const { openAuth } = useAuthSidebar();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleLogin() {
    onClose();
    openAuth("login");
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-login-title"
        className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id="review-login-title" className="pr-8 text-lg font-semibold text-slate-900">
          Inicia sesión
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Inicia sesión para poder agregar un comentario en este producto.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleLogin}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
