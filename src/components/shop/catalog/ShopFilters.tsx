"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  DEFAULT_SHOP_FILTERS,
  prendasForLinea,
  usosForLinea,
  type CatalogFilterMeta,
  type ShopFilterState,
} from "@/lib/catalog";

type ShopFiltersProps = {
  meta: CatalogFilterMeta | null;
  filters: ShopFilterState;
  onChange: (filters: ShopFilterState) => void;
  loadingMeta?: boolean;
};

type SectionId = "linea" | "uso" | "prenda" | "color" | "precio" | "stock";

function FilterCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
      />
      <span className="leading-snug">{label}</span>
    </label>
  );
}

function hasActiveFilters(state: ShopFilterState) {
  return Boolean(
    state.filtro1 ||
      state.filtro2.length > 0 ||
      state.filtro3.length > 0 ||
      state.nombre.trim() ||
      state.colors.length > 0 ||
      state.inStock ||
      state.precioMin ||
      state.precioMax,
  );
}

export function ShopFilters({ meta, filters, onChange, loadingMeta }: ShopFiltersProps) {
  const lineaRadioName = useId();
  const [draft, setDraft] = useState<ShopFilterState>(filters);
  const [expanded, setExpanded] = useState<Record<SectionId, boolean>>({
    linea: true,
    uso: true,
    prenda: true,
    color: false,
    precio: true,
    stock: true,
  });
  const [colorSearch, setColorSearch] = useState("");

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const usos = useMemo(
    () => (meta ? usosForLinea(meta, draft.filtro1) : []),
    [meta, draft.filtro1],
  );

  const prendas = useMemo(
    () => (meta ? prendasForLinea(meta, draft.filtro1) : []),
    [meta, draft.filtro1],
  );

  const colores = useMemo(() => {
    if (!meta) return [];
    const q = colorSearch.trim().toLocaleLowerCase("es");
    if (!q) return meta.colores;
    return meta.colores.filter((c) => c.toLocaleLowerCase("es").includes(q));
  }, [meta, colorSearch]);

  const toggleSection = (id: SectionId) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const update = (patch: Partial<ShopFilterState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const toggleInList = (list: string[], value: string, checked: boolean) => {
    if (checked) return [...list, value];
    return list.filter((item) => item !== value);
  };

  const applyDraft = () => {
    onChange(draft);
  };

  const clearFilters = () => {
    const cleared = { ...DEFAULT_SHOP_FILTERS, sort: draft.sort };
    setDraft(cleared);
    onChange(cleared);
  };

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-slate-200 bg-white lg:w-[280px]">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
        {hasActiveFilters(draft) && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
      </div>

      {loadingMeta && (
        <p className="px-4 py-3 text-sm text-slate-500">Cargando opciones…</p>
      )}

      <nav className="flex flex-col">
        <div className="border-b border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection("linea")}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <span>Línea</span>
            {expanded.linea ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>
          {expanded.linea && (
            <ul className="max-h-48 space-y-2 overflow-y-auto px-4 pb-3">
              <li>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="radio"
                    name={lineaRadioName}
                    checked={!draft.filtro1}
                    onChange={() => update({ filtro1: "", filtro2: [], filtro3: [], nombre: "" })}
                    className="h-4 w-4 border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span>Todas</span>
                </label>
              </li>
              {(meta?.lineas ?? []).map((linea) => (
                <li key={linea}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                      type="radio"
                      name={lineaRadioName}
                      checked={draft.filtro1 === linea}
                      onChange={() =>
                        update({
                          filtro1: linea,
                          filtro2: draft.filtro2.filter((u) =>
                            (meta?.usosByLinea[linea] ?? []).includes(u),
                          ),
                          filtro3: draft.filtro3.filter((p) =>
                            (meta?.prendasByLinea[linea] ?? []).includes(p),
                          ),
                          nombre: "",
                        })
                      }
                      className="h-4 w-4 border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span>{linea}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-b border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection("uso")}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <span>Uso</span>
            {expanded.uso ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>
          {expanded.uso && (
            <ul className="max-h-48 space-y-2 overflow-y-auto px-4 pb-3">
              {usos.length === 0 ? (
                <li className="text-sm text-slate-500">Sin usos</li>
              ) : (
                usos.map((uso) => (
                  <li key={uso}>
                    <FilterCheckbox
                      checked={draft.filtro2.includes(uso)}
                      label={uso}
                      onChange={(checked) =>
                        update({ filtro2: toggleInList(draft.filtro2, uso, checked) })
                      }
                    />
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="border-b border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection("prenda")}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <span>Prenda</span>
            {expanded.prenda ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>
          {expanded.prenda && (
            <ul className="max-h-48 space-y-2 overflow-y-auto px-4 pb-3">
              {prendas.length === 0 ? (
                <li className="text-sm text-slate-500">Sin prendas</li>
              ) : (
                prendas.map((prenda) => (
                  <li key={prenda}>
                    <FilterCheckbox
                      checked={draft.filtro3.includes(prenda)}
                      label={prenda}
                      onChange={(checked) =>
                        update({ filtro3: toggleInList(draft.filtro3, prenda, checked) })
                      }
                    />
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="border-b border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection("color")}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <span>Color</span>
            {expanded.color ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>
          {expanded.color && (
            <div className="space-y-2 px-4 pb-3">
              <input
                type="search"
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                placeholder="Buscar color…"
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              />
              <ul className="max-h-40 space-y-2 overflow-y-auto">
                {colores.slice(0, 80).map((color) => (
                  <li key={color}>
                    <FilterCheckbox
                      checked={draft.colors.includes(color)}
                      label={color}
                      onChange={(checked) =>
                        update({ colors: toggleInList(draft.colors, color, checked) })
                      }
                    />
                  </li>
                ))}
                {colores.length > 80 && (
                  <li className="text-xs text-slate-500">
                    Refina la búsqueda para ver más colores.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="border-b border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection("precio")}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <span>Precio</span>
            {expanded.precio ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>
          {expanded.precio && (
            <div className="grid grid-cols-2 gap-2 px-4 pb-3">
              <label className="text-xs text-slate-500">
                Mínimo
                <input
                  type="number"
                  min={0}
                  value={draft.precioMin}
                  onChange={(e) => update({ precioMin: e.target.value })}
                  placeholder={meta?.precioMin != null ? String(meta.precioMin) : "0"}
                  className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="text-xs text-slate-500">
                Máximo
                <input
                  type="number"
                  min={0}
                  value={draft.precioMax}
                  onChange={(e) => update({ precioMax: e.target.value })}
                  placeholder={meta?.precioMax != null ? String(meta.precioMax) : ""}
                  className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                />
              </label>
            </div>
          )}
        </div>

        <div className="border-b border-slate-100 px-4 py-3">
          <FilterCheckbox
            checked={draft.inStock}
            label="Solo con stock disponible"
            onChange={(checked) => update({ inStock: checked })}
          />
        </div>
      </nav>

      <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white p-4">
        <button
          type="button"
          onClick={applyDraft}
          className="flex h-11 w-full items-center justify-center rounded bg-red-800 px-4 text-sm font-medium text-white transition hover:bg-red-900"
        >
          Aplicar filtros
        </button>
      </div>
    </aside>
  );
}
