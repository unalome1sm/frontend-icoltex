"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import {
  WHATSAPP_CONTACTS,
  buildWhatsAppUrl,
} from "./whatsappContacts";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.139-1.688-.867-1.948-.967-.261-.1-.451-.139-.64.139-.189.278-.734.867-.9 1.045-.166.178-.332.2-.629.06-.297-.139-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.641-1.546-.879-2.119-.232-.558-.468-.482-.64-.491-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.688-.689 1.927-1.355.238-.666.238-1.237.166-1.355-.072-.118-.261-.198-.56-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsAppFab() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      <div
        id={menuId}
        role="menu"
        aria-hidden={!open}
        className="pointer-events-none flex flex-col items-end gap-2.5"
      >
        {[...WHATSAPP_CONTACTS].reverse().map((contact, index) => {
          const delayMs = open ? index * 70 : 0;
          return (
            <a
              key={contact.id}
              role="menuitem"
              href={buildWhatsAppUrl(contact.phone, contact.message)}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              style={{
                transitionDelay: `${delayMs}ms`,
              }}
              className={[
                "pointer-events-auto group flex items-center gap-3 rounded-full border border-slate-200/80 bg-white py-2.5 pl-3 pr-4 shadow-[0_8px_28px_-8px_rgba(15,23,42,0.35)]",
                "origin-bottom-right transition-all duration-300 ease-out",
                "hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_12px_32px_-8px_rgba(15,23,42,0.4)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2",
                open
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-3 scale-90 opacity-0",
              ].join(" ")}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <span className="flex min-w-[5.5rem] flex-col leading-tight">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  WhatsApp
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {contact.label}
                </span>
              </span>
            </a>
          );
        })}
      </div>

      <button
        type="button"
        aria-label={open ? "Cerrar chat" : "Chatear por WhatsApp"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full",
          "bg-red-600 text-white shadow-[0_10px_30px_-6px_rgba(220,38,38,0.55)]",
          "transition-all duration-300 ease-out",
          "hover:bg-red-700 hover:shadow-[0_14px_36px_-6px_rgba(220,38,38,0.65)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2",
          "active:scale-95",
          open ? "rotate-0" : "",
        ].join(" ")}
      >
        <span
          className={[
            "absolute inset-0 rounded-full bg-red-500/40 transition-opacity duration-500",
            open ? "opacity-0" : "animate-ping opacity-20",
          ].join(" ")}
          aria-hidden="true"
        />
        <MessageCircle
          className={[
            "absolute h-6 w-6 transition-all duration-300 ease-out",
            open
              ? "scale-50 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100",
          ].join(" ")}
          strokeWidth={2}
        />
        <X
          className={[
            "absolute h-6 w-6 transition-all duration-300 ease-out",
            open
              ? "scale-100 rotate-0 opacity-100"
              : "scale-50 -rotate-90 opacity-0",
          ].join(" ")}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}
