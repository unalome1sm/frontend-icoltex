"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiUrl } from "@/lib/api";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Loader2,
  RefreshCw,
} from "lucide-react";

export type ExplorerProductRow = {
  _id: string;
  codigo: string;
  nombre: string;
  claseFamilia?: string;
  categoria?: string;
  colores?: string;
  stock: number;
  precioMetro?: number;
  activo: boolean;
};

type SortKey =
  | "codigo"
  | "nombre"
  | "claseFamilia"
  | "categoria"
  | "colores"
  | "stock"
  | "precioMetro"
  | "activo";

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: "codigo", label: "Código", className: "whitespace-nowrap" },
  { key: "nombre", label: "Nombre", className: "min-w-[220px] max-w-[320px]" },
  { key: "claseFamilia", label: "Clase / familia", className: "whitespace-nowrap" },
  { key: "categoria", label: "Categoría", className: "whitespace-nowrap" },
  { key: "colores", label: "Colores (campo)", className: "max-w-[120px]" },
  { key: "stock", label: "Stock", className: "text-right" },
  { key: "precioMetro", label: "Precio / m", className: "text-right" },
  { key: "activo", label: "Activo", className: "text-center" },
];

function compare(a: unknown, b: unknown, dir: "asc" | "desc"): number {
  const m = dir === "asc" ? 1 : -1;
  if (a == null && b == null) return 0;
  if (a == null) return 1 * m;
  if (b == null) return -1 * m;
  if (typeof a === "number" && typeof b === "number") {
    if (a === b) return 0;
    return a < b ? -1 * m : 1 * m;
  }
  if (typeof a === "boolean" && typeof b === "boolean") {
    if (a === b) return 0;
    return a ? 1 * m : -1 * m;
  }
  const sa = String(a).toLocaleLowerCase("es");
  const sb = String(b).toLocaleLowerCase("es");
  return sa.localeCompare(sb, "es") * m;
}

function sortRows(
  rows: ExplorerProductRow[],
  key: SortKey,
  dir: "asc" | "desc"
): ExplorerProductRow[] {
  return [...rows].sort((r1, r2) =>
    compare(r1[key] as unknown, r2[key] as unknown, dir)
  );
}

export function ProductDataExplorer() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [rows, setRows] = useState<ExplorerProductRow[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("nombre");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [draftClase, setDraftClase] = useState("");
  const [draftCategoria, setDraftCategoria] = useState("");
  const [appliedClase, setAppliedClase] = useState("");
  const [appliedCategoria, setAppliedCategoria] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (appliedClase.trim()) params.set("classFamily", appliedClase.trim());
      if (appliedCategoria.trim()) params.set("category", appliedCategoria.trim());

      const res = await fetch(getApiUrl(`/api/products?${params}`));
      const data = (await res.json()) as {
        products?: ExplorerProductRow[];
        pagination?: { total: number; totalPages: number };
        error?: string;
      };
      if (!res.ok || data.error) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const list = data.products ?? [];
      setRows(list);
      if (data.pagination) {
        setPagination({
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, appliedClase, appliedCategoria]);

  useEffect(() => {
    load();
  }, [load]);

  const sortedRows = useMemo(
    () => sortRows(rows, sortKey, sortDir),
    [rows, sortKey, sortDir]
  );

  const claseCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of sortedRows) {
      const k = (r.claseFamilia || "—").trim() || "—";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [sortedRows]);

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
          Explorador de datos de productos
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Tabla para revisar cómo vienen los ítems del API (una fila por SKU / variante).
          El orden de columnas es solo en esta página cargada; el servidor ordena por{" "}
          <code className="rounded bg-slate-100 px-1">nombre</code>.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Por página
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
          >
            {[50, 100, 200, 500].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[140px] flex-col gap-1 text-xs font-medium text-slate-600">
          Filtro clase (API)
          <input
            value={draftClase}
            onChange={(e) => setDraftClase(e.target.value)}
            placeholder="ej. Impermeables"
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex min-w-[140px] flex-col gap-1 text-xs font-medium text-slate-600">
          Filtro categoría (API)
          <input
            value={draftCategoria}
            onChange={(e) => setDraftCategoria(e.target.value)}
            placeholder="ej. Adidas"
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setAppliedClase(draftClase.trim());
            setAppliedCategoria(draftCategoria.trim());
            setPage(1);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Aplicar filtros
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="max-h-[70vh] overflow-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm">
                <tr>
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className={`border-b border-slate-200 px-3 py-2 font-semibold text-slate-800 ${col.className ?? ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-slate-950"
                      >
                        {col.label}
                        <SortIcon column={col.key} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : sortedRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      Sin resultados
                    </td>
                  </tr>
                ) : (
                  sortedRows.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-slate-100 hover:bg-slate-50/80"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-slate-700">
                        {r.codigo}
                      </td>
                      <td className="px-3 py-2 text-slate-800">{r.nombre}</td>
                      <td className="px-3 py-2 text-slate-600">
                        {r.claseFamilia ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {r.categoria ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-600">{r.colores ?? "—"}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                        {r.stock}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                        {r.precioMetro != null
                          ? r.precioMetro.toLocaleString("es-CO")
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.activo ? "Sí" : "No"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
            <span>
              Total en catálogo:{" "}
              <strong className="text-slate-900">{pagination.total}</strong>
              {" · "}
              Página{" "}
              <strong className="text-slate-900">
                {page} / {Math.max(1, pagination.totalPages)}
              </strong>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={page >= pagination.totalPages || loading}
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
            En esta página (por clase)
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Recuento de filas visibles tras ordenar; útil para ver mezcla de familias.
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
