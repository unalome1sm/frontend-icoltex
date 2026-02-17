'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';

type Product = {
  _id: string;
  codigo: string;
  nombre: string;
  claseFamilia?: string;
  categoria?: string;
  stock: number;
  precioMetro?: number;
  precioKilos?: number;
  activo: boolean;
  colores?: string;
  unidadMedida?: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type Filters = {
  category: string;
  classFamily: string;
  precioMin: string;
  precioMax: string;
  activo: string; // '' | 'true' | 'false'
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({
    category: '',
    classFamily: '',
    precioMin: '',
    precioMax: '',
    activo: '',
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);

  function buildParams(page: number, f: Filters): URLSearchParams {
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    if (f.category) params.set('category', f.category);
    if (f.classFamily) params.set('classFamily', f.classFamily);
    if (f.precioMin) params.set('precioMin', f.precioMin);
    if (f.precioMax) params.set('precioMax', f.precioMax);
    if (f.activo) params.set('activo', f.activo);
    return params;
  }

  function fetchProducts(page = 1, filtersOverride?: Filters) {
    setLoading(true);
    setError('');
    const f = filtersOverride ?? filters;
    const params = buildParams(page, f);
    fetch(getApiUrl(`/api/products?${params}`), {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProducts(data.products || []);
        setPagination(data.pagination || null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar productos'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(getApiUrl('/api/products/meta/categories'), { credentials: 'include' }).then((r) => r.json()),
      fetch(getApiUrl('/api/products/meta/classes'), { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([cats, cls]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setClasses(Array.isArray(cls) ? cls : []);
      })
      .catch(() => {});
  }, []);

  function handleFilterChange(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleApplyFilters(e: React.FormEvent) {
    e.preventDefault();
    fetchProducts(1);
  }

  const emptyFilters: Filters = {
    category: '',
    classFamily: '',
    precioMin: '',
    precioMax: '',
    activo: '',
  };

  function handleClearFilters() {
    setFilters(emptyFilters);
    fetchProducts(1, emptyFilters);
  }

  if (loading && products.length === 0) {
    return <p className="text-slate-500">Cargando productos...</p>;
  }

  if (error && products.length === 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-red-600">{error}</p>
        <Link href="/admin" className="mt-4 inline-block text-sm text-slate-600 hover:underline">
          ← Volver al panel
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Productos</h2>
          <p className="text-sm text-slate-600">
            Listado de productos sincronizados desde Icoltex.
          </p>
          <form onSubmit={handleApplyFilters} className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Categoría</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Familia / Clase</label>
              <select
                value={filters.classFamily}
                onChange={(e) => handleFilterChange('classFamily', e.target.value)}
                className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="">Todas</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Precio mín. ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.precioMin}
                onChange={(e) => handleFilterChange('precioMin', e.target.value)}
                placeholder="0"
                className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Precio máx. ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.precioMax}
                onChange={(e) => handleFilterChange('precioMax', e.target.value)}
                placeholder="∞"
                className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Estado</label>
              <select
                value={filters.activo}
                onChange={(e) => handleFilterChange('activo', e.target.value)}
                className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
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
                onClick={handleClearFilters}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-700">Código</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Clase/Familia</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Categoría</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">Stock</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">Precio/m</th>
                <th className="px-4 py-3 text-center font-medium text-slate-700">Activo</th>
                <th className="px-4 py-3 text-center font-medium text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-900">{p.codigo}</td>
                  <td className="px-4 py-3 text-slate-900">{p.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{p.claseFamilia || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.categoria || '-'}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{p.stock}</td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {p.precioMetro != null ? `$${p.precioMetro.toLocaleString('es-CO')}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.activo ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.activo ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/admin/products/${p._id}`}
                      className="inline-block rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <p className="text-xs text-slate-500">
              Mostrando {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => fetchProducts(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
        {products.length === 0 && !loading && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No hay productos. Sincroniza desde Icoltex para cargar el catálogo.
          </div>
        )}
      </div>

      <p>
        <Link href="/admin" className="text-sm text-slate-600 hover:underline">
          ← Volver al panel
        </Link>
      </p>
    </div>
  );
}
