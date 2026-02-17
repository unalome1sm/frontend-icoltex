'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const EMPTY_DEPS: [] = [];
import { getApiUrl, getAuthHeaders } from '@/lib/api';

type User = {
  _id: string;
  email: string;
  nombre?: string;
  segundoNombre?: string;
  apellidos?: string;
  cedula?: string;
  telefono?: string;
  tipoVivienda?: 'casa' | 'edificio';
  direccionCasa?: string;
  apartamento?: string;
  direccionOficina?: string;
  pisoOficina?: string;
  numeroOficina?: string;
  activo: boolean;
  isAdmin?: boolean;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activoFilter, setActivoFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  function fetchUsers(page = 1, activoOverride?: string) {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    const act = activoOverride ?? activoFilter;
    if (act) params.set('activo', act);
    fetch(getApiUrl(`/api/users?${params}`), {
      credentials: 'include',
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setUsers(data.users || []);
        setPagination(data.pagination || null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchUsers(1);
  }, EMPTY_DEPS);

  async function handlePromote(userId: string) {
    if (!confirm('¿Promover este usuario a administrador? Podrá acceder al panel de admin con el mismo correo y contraseña.')) return;
    setPromotingId(userId);
    try {
      const res = await fetch(getApiUrl(`/api/users/${userId}/promote`), {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al promover');
      fetchUsers(pagination?.page || 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al promover');
    } finally {
      setPromotingId(null);
    }
  }

  function handleApplyFilter(e: React.FormEvent) {
    e.preventDefault();
    fetchUsers(1);
  }

  function handleClearFilter() {
    setActivoFilter('');
    fetchUsers(1, '');
  }

  function fullName(u: User) {
    const parts = [u.nombre, u.segundoNombre, u.apellidos].filter(Boolean);
    return parts.length ? parts.join(' ') : '-';
  }

  function shortAddress(u: User) {
    if (!u.direccionCasa) return '-';
    const apt = u.tipoVivienda === 'edificio' && u.apartamento ? ` Apt ${u.apartamento}` : '';
    return u.direccionCasa.length > 40 ? u.direccionCasa.slice(0, 40) + '…' + apt : u.direccionCasa + apt;
  }

  if (loading && users.length === 0) {
    return <p className="text-slate-500">Cargando usuarios...</p>;
  }

  if (error && users.length === 0) {
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
          <h2 className="text-base font-semibold text-slate-900">Usuarios registrados</h2>
          <p className="text-sm text-slate-600">
            Usuarios de la plataforma. Puedes ver el perfil completo y promover a administrador.
          </p>
          <form onSubmit={handleApplyFilter} className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Estado</label>
              <select
                value={activoFilter}
                onChange={(e) => setActivoFilter(e.target.value)}
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
                onClick={handleClearFilter}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Nombre completo</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Cédula</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Dirección</th>
                <th className="px-4 py-3 text-center font-medium text-slate-700">Estado</th>
                <th className="px-4 py-3 text-center font-medium text-slate-700">Admin</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Registro</th>
                <th className="px-4 py-3 text-center font-medium text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <React.Fragment key={u._id}>
                  <tr
                    key={u._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-900">{u.email}</td>
                    <td className="px-4 py-3 text-slate-700">{fullName(u)}</td>
                    <td className="px-4 py-3 text-slate-600">{u.cedula || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{u.telefono || '-'}</td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-slate-600" title={u.direccionCasa}>
                      {shortAddress(u)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.activo ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {u.isAdmin ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Sí
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(u.createdAt).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedId(expandedId === u._id ? null : u._id)}
                          className="text-xs text-slate-600 underline hover:text-slate-900"
                        >
                          {expandedId === u._id ? 'Ocultar' : 'Ver perfil'}
                        </button>
                        {!u.isAdmin && (
                          <button
                            type="button"
                            onClick={() => handlePromote(u._id)}
                            disabled={!!promotingId}
                            className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                          >
                            {promotingId === u._id ? '...' : 'Promover'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === u._id && (
                    <tr key={`${u._id}-exp`} className="border-b border-slate-100 bg-slate-50/50">
                      <td colSpan={9} className="px-4 py-4">
                        <div className="grid gap-4 text-sm sm:grid-cols-2">
                          <div>
                            <p className="font-medium text-slate-700">Vivienda</p>
                            <p className="text-slate-600">
                              Tipo: {u.tipoVivienda === 'edificio' ? 'Edificio' : 'Casa'}
                            </p>
                            <p className="text-slate-600">Dirección: {u.direccionCasa || '-'}</p>
                            {u.tipoVivienda === 'edificio' && (
                              <p className="text-slate-600">Apto: {u.apartamento || '-'}</p>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Oficina (opcional)</p>
                            <p className="text-slate-600">{u.direccionOficina || '-'}</p>
                            {(u.pisoOficina || u.numeroOficina) && (
                              <p className="text-slate-600">
                                Piso {u.pisoOficina || '-'} / Oficina {u.numeroOficina || '-'}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
        {users.length === 0 && !loading && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No hay usuarios registrados.
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <Link href="/admin/admins" className="text-sm text-slate-600 hover:underline">
          Ver tabla de administradores →
        </Link>
        <Link href="/admin" className="text-sm text-slate-600 hover:underline">
          ← Volver al panel
        </Link>
      </div>
    </div>
  );
}
