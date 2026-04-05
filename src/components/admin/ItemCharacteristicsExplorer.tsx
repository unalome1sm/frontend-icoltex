"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchItemCharacteristics,
  distinctClases,
  categoriasForClase,
  type ItemCharacteristic,
} from "@/lib/catalog";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Loader2,
  RefreshCw,
} from "lucide-react";

type SortKey = "clase" | "categoria" | "color";

function compareStr(a: string, b: string, dir: "asc" | "desc"): number {
  const m = dir === "asc" ? 1 : -1;
  const r = a.localeCompare(b, "es");
  return r === 0 ? 0 : r * m;
}

export function ItemCharacteristicsExplorer() {
  const [items, setItems] = useState<ItemCharacteristic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("clase");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [filterClase, setFilterClase] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterColor, setFilterColor] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItemCharacteristics();
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar características");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clasesOptions = useMemo(() => distinctClases(items), [items]);

  const categoriasOptions = useMemo(() => {
    if (!filterClase.trim()) return [];
    return categoriasForClase(items, filterClase);
  }, [items, filterClase]);

  const filtered = useMemo(() => {
    const c = filterClase.trim();
    const cat = filterCategoria.trim();
    const col = filterColor.trim().toLocaleLowerCase("es");
    return items.filter((row) => {
      if (c && row.clase !== c) return false;
      if (cat && row.categoria !== cat) return false;
      if (col && !row.color.toLocaleLowerCase("es").includes(col)) return false;
      return true;
    });
  }, [items, filterClase, filterCategoria, filterColor]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      compareStr(a[sortKey], b[sortKey], sortDir)
    );
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, pageSafe, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filterClase, filterCategoria, filterColor, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const claseCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) {
      const k = r.clase.trim() || "—";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) {
      return <ChevronsUpDown className="inline h-3.5 w-3.5 opacity-40" aria-hidden />;
    }
    return sortDir === "asc" ? (
      <ChevronUp className="inline h-3.5 w-3.5" aria-hidden />
    ) : (
      <ChevronDown className="inline h-3.5 w-3.5" aria-hidden />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Características de catálogo (Tangara)
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Datos del webhook{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">
            caracterisiticas_items_icoltex
          </code>{" "}
          vía <code className="rounded bg-slate-100 px-1 text-xs">GET /api/catalog/item-characteristics</code>.
          Una fila por combinación clase + categoría + color.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Recargar
        </button>
        <label className="flex min-w-[160px] flex-col gap-1 text-xs font-medium text-slate-600">
          Clase
          <select
            value={filterClase}
            onChange={(e) => {
              setFilterClase(e.target.value);
              setFilterCategoria("");
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
          >
            <option value="">Todas</option>
            {clasesOptions.map((cl: string) => (
              <option key={cl} value={cl}>
                {cl}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[180px] flex-col gap-1 text-xs font-medium text-slate-600">
          Categoría
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            disabled={!filterClase.trim()}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 disabled:opacity-50"
          >
            <option value="">Todas</option>
            {categoriasOptions.map((ca: string) => (
              <option key={ca} value={ca}>
                {ca}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-medium text-slate-600">
          Color (contiene)
          <input
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            placeholder="ej. AZUL"
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Por página
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
          >
            {[50, 100, 200, 500].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="max-h-[70vh] overflow-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-800">
                    <button
                      type="button"
                      onClick={() => toggleSort("clase")}
                      className="inline-flex items-center gap-1 hover:text-slate-950"
                    >
                      Clase
                      <SortIcon column="clase" />
                    </button>
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-800">
                    <button
                      type="button"
                      onClick={() => toggleSort("categoria")}
                      className="inline-flex items-center gap-1 hover:text-slate-950"
                    >
                      Categoría
                      <SortIcon column="categoria" />
                    </button>
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-800">
                    <button
                      type="button"
                      onClick={() => toggleSort("color")}
                      className="inline-flex items-center gap-1 hover:text-slate-950"
                    >
                      Color
                      <SortIcon column="color" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-12 text-center text-slate-500">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                      Sin resultados
                    </td>
                  </tr>
                ) : (
                  pageRows.map((r, idx) => (
                    <tr
                      key={`${r.clase}|${r.categoria}|${r.color}|${idx}`}
                      className="border-b border-slate-100 hover:bg-slate-50/80"
                    >
                      <td className="px-3 py-2 text-slate-800">{r.clase}</td>
                      <td className="px-3 py-2 text-slate-700">{r.categoria}</td>
                      <td className="px-3 py-2 text-slate-700">{r.color}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
            <span>
              Cargados: <strong className="text-slate-900">{items.length}</strong>
              {" · "}
              Tras filtros:{" "}
              <strong className="text-slate-900">{filtered.length}</strong>
              {" · "}
              Página{" "}
              <strong className="text-slate-900">
                {pageSafe} / {totalPages}
              </strong>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pageSafe <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={pageSafe >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Por clase (filtrado)
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Filas que cumplen clase / categoría / color buscado.
          </p>
          <ul className="mt-3 max-h-[50vh] space-y-1.5 overflow-auto text-sm">
            {claseCounts.map(([name, count]) => (
              <li
                key={name}
                className="flex justify-between gap-2 border-b border-slate-100 pb-1 text-slate-700"
              >
                <span className="truncate" title={name}>
                  {name}
                </span>
                <span className="shrink-0 tabular-nums font-medium text-slate-900">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
