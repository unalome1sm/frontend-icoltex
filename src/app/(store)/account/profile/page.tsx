'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const EMPTY_DEPS: [] = [];
import { getApiUrl, getAuthHeaders, apiFetch } from '@/lib/api';

type ProfileUser = {
  id: string;
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
};

export default function AccountProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tieneOficina, setTieneOficina] = useState(false);
  const [form, setForm] = useState<ProfileUser>({
    id: '',
    email: '',
    nombre: '',
    segundoNombre: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    tipoVivienda: 'casa',
    direccionCasa: '',
    apartamento: '',
    direccionOficina: '',
    pisoOficina: '',
    numeroOficina: '',
  });

  useEffect(() => {
    fetch(getApiUrl('/api/auth/me'), {
      credentials: 'include',
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          const u = data.user;
          setUser(u);
          setForm({
            id: u.id || '',
            email: u.email || '',
            nombre: u.nombre || '',
            segundoNombre: u.segundoNombre || '',
            apellidos: u.apellidos || '',
            cedula: u.cedula || '',
            telefono: u.telefono || '',
            tipoVivienda: u.tipoVivienda === 'edificio' ? 'edificio' : 'casa',
            direccionCasa: u.direccionCasa || '',
            apartamento: u.apartamento || '',
            direccionOficina: u.direccionOficina || '',
            pisoOficina: u.pisoOficina || '',
            numeroOficina: u.numeroOficina || '',
          });
          setTieneOficina(!!(u.direccionOficina || u.pisoOficina || u.numeroOficina));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, EMPTY_DEPS);

  function handleChange(field: keyof ProfileUser, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        nombre: form.nombre || undefined,
        segundoNombre: form.segundoNombre || undefined,
        apellidos: form.apellidos || undefined,
        cedula: form.cedula || undefined,
        telefono: form.telefono || undefined,
        tipoVivienda: form.tipoVivienda || undefined,
        direccionCasa: form.direccionCasa || undefined,
        apartamento: form.tipoVivienda === 'edificio' ? (form.apartamento || undefined) : undefined,
        tieneOficina: tieneOficina,
      };
      if (tieneOficina) {
        body.direccionOficina = form.direccionOficina || undefined;
        body.pisoOficina = form.pisoOficina || undefined;
        body.numeroOficina = form.numeroOficina || undefined;
      }
      const res = await apiFetch<{ user: ProfileUser; message: string }>('/api/auth/profile', {
        method: 'PATCH',
        body,
      });
      setUser(res.user);
      setForm((prev) => ({ ...prev, ...res.user }));
      setTieneOficina(!!(res.user.direccionOficina || res.user.pisoOficina || res.user.numeroOficina));
      router.push('/account');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-500">Cargando perfil...</p>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Configuración de perfil</h2>
      <p className="mb-6 text-sm text-slate-600">
        Actualiza tus datos personales. Los campos marcados con asterisco son obligatorios para
        envíos y facturación.
      </p>

      {message && (
        <div
          className={`mb-6 rounded-lg px-4 py-3 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Email (no editable)</label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            />
          </div>
          <div />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Primer nombre"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Segundo nombre</label>
            <input
              type="text"
              value={form.segundoNombre}
              onChange={(e) => handleChange('segundoNombre', e.target.value)}
              placeholder="Opcional"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              placeholder="Apellido(s)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Cédula <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.cedula}
              onChange={(e) => handleChange('cedula', e.target.value.replace(/\D/g, ''))}
              placeholder="Solo números"
              maxLength={15}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="tel"
              value={form.telefono}
              onChange={(e) => handleChange('telefono', e.target.value.replace(/\D/g, ''))}
              placeholder="Solo números"
              maxLength={15}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
        </div>

        {/* Dirección de vivienda */}
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <h3 className="text-sm font-medium text-slate-900">Dirección de vivienda</h3>
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-600">
              Tipo <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="tipoVivienda"
                  value="casa"
                  checked={form.tipoVivienda === 'casa'}
                  onChange={() => handleChange('tipoVivienda', 'casa')}
                  className="h-4 w-4"
                />
                <span className="text-sm">Casa</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="tipoVivienda"
                  value="edificio"
                  checked={form.tipoVivienda === 'edificio'}
                  onChange={() => handleChange('tipoVivienda', 'edificio')}
                  className="h-4 w-4"
                />
                <span className="text-sm">Edificio</span>
              </label>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.direccionCasa}
              onChange={(e) => handleChange('direccionCasa', e.target.value)}
              placeholder={form.tipoVivienda === 'edificio' ? 'Calle, número, torre, barrio, ciudad' : 'Calle, número, barrio, ciudad'}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
          {form.tipoVivienda === 'edificio' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Apartamento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.apartamento}
                onChange={(e) => handleChange('apartamento', e.target.value)}
                placeholder="Ej: 301, 4B"
                className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          )}
        </div>

        {/* Dirección de oficina */}
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="tieneOficina"
              checked={tieneOficina}
              onChange={(e) => setTieneOficina(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <label htmlFor="tieneOficina" className="cursor-pointer text-sm font-medium text-slate-700">
              Agregar dirección de oficina
            </label>
          </div>
          {tieneOficina && (
            <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Dirección oficina <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.direccionOficina}
                  onChange={(e) => handleChange('direccionOficina', e.target.value)}
                  placeholder="Calle, edificio, ciudad"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Piso</label>
                  <input
                    type="text"
                    value={form.pisoOficina}
                    onChange={(e) => handleChange('pisoOficina', e.target.value)}
                    placeholder="Ej: 3, PB"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Número de oficina</label>
                  <input
                    type="text"
                    value={form.numeroOficina}
                    onChange={(e) => handleChange('numeroOficina', e.target.value)}
                    placeholder="Ej: 302, Oficina A"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-slate-200 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <Link
            href="/account"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
