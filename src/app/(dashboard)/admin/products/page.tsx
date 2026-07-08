"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminCatalogGroupThumbnail } from "@/components/admin/catalog";
import {
  fetchGroupedProductsPage,
  formatGroupedPrice,
  groupImageSourceLabel,
  resolveGroupThumbnailUrl,
  type GroupedProductRow,
} from "@/lib/catalog";
import {
  categoriasForClase,
  fetchCatalogFilterMeta,
  type CatalogFilterMeta,
} from "@/lib/catalog";

type AdminFilters = {
  classFamily: string;
  category: string;
  color: string;
  precioMin: string;
  precioMax: string;
  q: string;
  activo: "" | "true" | "false";
  merch: "" | "destacado" | "novedad";
};

const EMPTY_FILTERS: AdminFilters = {
  classFamily: "",
  category: "",
  color: "",
  precioMin: "",
  precioMax: "",
  q: "",
  activo: "",
  merch: "",
};

function imageBadgeLabel(source: ReturnType<typeof groupImageSourceLabel>): string {
  if (source === "grupo") return "Línea";
  if (source === "sku") return "SKU";
  return "Sin img";
}

export default function AdminProductsPage() {
  const [groups, setGroups] = useState<GroupedProductRow[]>([]);
  const [meta, setMeta] = useState<CatalogFilterMeta | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [source, setSource] = useState<string>("");
  const [filters, setFilters] = useState<AdminFilters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (page: number, f: AdminFilters) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchGroupedProductsPage({
        page,
        limit: 50,
        classFamily: f.classFamily || undefined,
        categories: f.category ? [f.category] : undefined,
        colors: f.color ? [f.color] : undefined,
        q: f.q.trim() || undefined,
        precioMin: f.precioMin.trim() ? Number(f.precioMin) : undefined,
        precioMax: f.precioMax.trim() ? Number(f.precioMax) : undefined,
        activo: f.activo === "true" ? true : f.activo === "false" ? false : undefined,
        destacado: f.merch === "destacado" ? true : undefined,
        novedad: f.merch === "novedad" ? true : undefined,
      });
      setGroups(data.groups);
      setPagination(data.pagination);
      setSource(data.source ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar catálogo");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogFilterMeta()
      .then(setMeta)
      .catch(() => setMeta(null));
    load(1, EMPTY_FILTERS);
  }, [load]);

  function handleFilterChange<K extends keyof AdminFilters>(key: K, value: AdminFilters[K]) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "classFamily") next.category = "";
      return next;
    });
  }

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    load(1, filters);
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    load(1, EMPTY_FILTERS);
  }

  const categorias = meta ? categoriasForClase(meta, filters.classFamily) : [];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Catálogo vitrina</h2>
          <p className="mt-1 text-sm text-slate-600">
            Catálogo agrupado sincronizado desde <strong>info-items-x-ref</strong> +{" "}
            <strong>items_icoltex</strong> (misma vista que la tienda).
            {source && (
              <span className="ml-2 text-xs text-slate-400">Fuente: {source}</span>
            )}
          </p>

          <form onSubmit={handleApply} className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Buscar</label>
              <input
                type="search"
                value={filters.q}
                onChange={(e) => handleFilterChange("q", e.target.value)}
                placeholder="Nombre vitrina…"
                className="w-44 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Clase</label>
              <select
                value={filters.classFamily}
                onChange={(e) => handleFilterChange("classFamily", e.target.value)}
                className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Todas</option>
                {(meta?.clases ?? []).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Categoría</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Color</label>
              <select
                value={filters.color}
                onChange={(e) => handleFilterChange("color", e.target.value)}
                className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                {(meta?.colores ?? []).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Precio mín.</label>
              <input
                type="number"
                min="0"
                value={filters.precioMin}
                onChange={(e) => handleFilterChange("precioMin", e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Precio máx.</label>
              <input
                type="number"
                min="0"
                value={filters.precioMax}
                onChange={(e) => handleFilterChange("precioMax", e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Activo</label>
              <select
                value={filters.activo}
                onChange={(e) => handleFilterChange("activo", e.target.value as AdminFilters["activo"])}
                className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Merchandising</label>
              <select
                value={filters.merch}
                onChange={(e) => handleFilterChange("merch", e.target.value as AdminFilters["merch"])}
                className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                <option value="destacado">Solo destacados</option>
                <option value="novedad">Solo novedades</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Filtrar
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && groups.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">Cargando catálogo…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Imagen</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Vitrina</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-700">Etiquetas</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Clase</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Categoría</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-700">Variantes</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-700">Desde</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-700">Imágenes</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-700">Acción</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((row) => {
                  const imgSource = groupImageSourceLabel(row);
                  return (
                    <tr key={row.groupId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <AdminCatalogGroupThumbnail
                          url={resolveGroupThumbnailUrl(row)}
                          alt={row.nombreVitrina}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{row.nombreVitrina}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {row.esDestacado && (
                            <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                              Destacado
                            </span>
                          )}
                          {row.esNovedad && (
                            <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                              Novedad
                            </span>
                          )}
                          {!row.esDestacado && !row.esNovedad && (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.claseFamilia ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{row.categoria ?? "—"}</td>
                      <td className="px-4 py-3 text-center tabular-nums">{row.variantCount}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatGroupedPrice(row.precioDesde)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            imgSource === "ninguna"
                              ? "bg-slate-100 text-slate-500"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {imageBadgeLabel(imgSource)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/products/${encodeURIComponent(row.groupId)}`}
                          className="inline-block rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {groups.length === 0 && !loading && !error && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No hay grupos. Sincroniza el catálogo completo en{" "}
            <Link href="/admin/sync" className="font-medium text-slate-700 underline">
              Sincronizar
            </Link>
            .
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <p className="text-xs text-slate-500">
              Página {pagination.page} de {pagination.totalPages} · {pagination.total} grupos
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1 || loading}
                onClick={() => load(pagination.page - 1, filters)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => load(pagination.page + 1, filters)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">
        SKUs planos (sin agrupar):{" "}
        <Link href="/admin/productos-explorador" className="font-medium text-slate-700 underline">
          Explorador items_icoltex
        </Link>
      </p>

      <p>
        <Link href="/admin" className="text-sm text-slate-600 hover:underline">
          ← Volver al panel
        </Link>
      </p>
    </div>
  );
}
