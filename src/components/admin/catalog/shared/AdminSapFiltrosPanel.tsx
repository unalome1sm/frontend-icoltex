"use client";

import type { CatalogVitrinaFiltros } from "@/lib/catalog";

type Props = {
  filtros?: CatalogVitrinaFiltros[];
};

function ChipList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AdminSapFiltrosPanel({ filtros }: Props) {
  if (!filtros?.length) return null;

  const hasAny = filtros.some(
    (f) => f.filtro1.length > 0 || f.filtro2.length > 0 || f.filtro3.length > 0,
  );
  if (!hasAny) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Filtros SAP
      </h2>
      <div className="space-y-4">
        {filtros.map((f, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <ChipList label="Filtro 1" items={f.filtro1} />
            <ChipList label="Filtro 2" items={f.filtro2} />
            <ChipList label="Filtro 3" items={f.filtro3} />
          </div>
        ))}
      </div>
    </div>
  );
}
