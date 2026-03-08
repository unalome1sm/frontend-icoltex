"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FilterSection = {
  id: string;
  title: string;
  options: string[];
};

const MOCK_FILTERS: FilterSection[] = [
  { id: "1", title: "Filtro especial", options: ["Opción", "Opción", "Opción"] },
  { id: "2", title: "Filtro especial", options: ["Opción", "Opción", "Opción"] },
  { id: "3", title: "Filtro especial", options: ["Opción", "Opción", "Opción"] },
  { id: "4", title: "Filtro especial", options: ["Opción", "Opción", "Opción"] },
  { id: "5", title: "Filtro especial", options: ["Opción", "Opción", "Opción"] },
  { id: "6", title: "Filtro especial", options: ["Opción", "Opción", "Opción"] },
  { id: "7", title: "Filtro especial", options: ["Opción", "Opción", "Opción"] },
];

export function ShopFilters() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "1": true,
    "2": true,
    "3": true,
  });

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-full shrink-0 border-r border-slate-200 bg-white lg:w-[280px]">
      <h2 className="border-b border-slate-200 px-4 py-4 text-lg font-semibold text-slate-900">
        Filtros
      </h2>
      <nav className="flex flex-col">
        {MOCK_FILTERS.map((section, i) => {
          const isOpen = expanded[section.id] ?? i < 3;
          return (
            <div
              key={section.id}
              className="border-b border-slate-100"
            >
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                <span>{section.title}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                )}
              </button>
              {isOpen && (
                <ul className="space-y-1 px-4 pb-3 pt-0">
                  {section.options.map((opt, j) => (
                    <li key={`${section.id}-${j}`}>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                        />
                        <span>{opt}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
