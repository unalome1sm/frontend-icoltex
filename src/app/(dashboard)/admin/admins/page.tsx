'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const EMPTY_DEPS: [] = [];
import { getApiUrl, getAuthHeaders } from '@/lib/api';

type Admin = { _id: string; email: string; nombre?: string; activo: boolean; createdAt: string };

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(getApiUrl('/api/admins'), {
      credentials: 'include',
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAdmins(data.admins || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false));
  }, EMPTY_DEPS);

  if (loading) return <p className="text-slate-500">Cargando administradores...</p>;

  if (error) {
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
          <h2 className="text-base font-semibold text-slate-900">Administradores</h2>
          <p className="text-sm text-slate-600">
            Usuarios con acceso al panel de administración. Los administradores pueden ser creados
            por script o promovidos desde la tabla de usuarios.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Nombre</th>
                <th className="px-4 py-3 text-center font-medium text-slate-700">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Fecha creación</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">{a.email}</td>
                  <td className="px-4 py-3 text-slate-600">{a.nombre || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        a.activo ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {a.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(a.createdAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {admins.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No hay administradores registrados.
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <Link href="/admin/users" className="text-sm text-slate-600 hover:underline">
          Promover usuarios desde tabla de usuarios →
        </Link>
        <Link href="/admin" className="text-sm text-slate-600 hover:underline">
          ← Volver al panel
        </Link>
      </div>
    </div>
  );
}
