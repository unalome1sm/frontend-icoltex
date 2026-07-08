"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "newest", label: "Lo más nuevo" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Nombre" },
];

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export function ShopSortBar({ value = "relevance", onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  return (
    <div className="relative flex items-center gap-2">
      <span className="text-sm text-slate-600">Ordenar por</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {current.label}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 top-full z-20 mt-1 min-w-[200px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {SORT_OPTIONS.map((opt) => (
              <li key={opt.value} role="option" aria-selected={value === opt.value}>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
