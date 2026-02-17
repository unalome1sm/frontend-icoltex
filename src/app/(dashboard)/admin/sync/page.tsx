'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function AdminSyncPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  async function runSync(type: string) {
    setLoading(type);
    setError('');
    setResult(null);
    try {
      const data = await apiFetch(`/api/sync/${type}`, { method: 'POST' });
      setResult(data as Record<string, unknown>);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al sincronizar');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Sincronizar datos</h2>
      <p className="mb-6 text-sm text-slate-600">
        Sincroniza clientes, productos, clases y categorías desde Icoltex.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => runSync('clients')}
          disabled={!!loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading === 'clients' ? 'Sincronizando...' : 'Clientes'}
        </button>
        <button
          type="button"
          onClick={() => runSync('products')}
          disabled={!!loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading === 'products' ? 'Sincronizando...' : 'Productos'}
        </button>
        <button
          type="button"
          onClick={() => runSync('classes')}
          disabled={!!loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading === 'classes' ? 'Sincronizando...' : 'Clases'}
        </button>
        <button
          type="button"
          onClick={() => runSync('categories')}
          disabled={!!loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading === 'categories' ? 'Sincronizando...' : 'Categorías'}
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {result && (
        <pre className="mt-4 overflow-auto rounded border border-slate-200 bg-slate-50 p-4 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      <p className="mt-6">
        <Link href="/admin" className="text-sm text-slate-600 hover:underline">
          ← Volver al panel
        </Link>
      </p>
    </div>
  );
}
