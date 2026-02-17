'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

type Step = 'credentials' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/api/auth/login/request', {
        method: 'POST',
        body: { email, password },
      });
      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar código');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch<{ user: { id: string; email: string }; token?: string }>(
        '/api/auth/login/verify',
        { method: 'POST', body: { email, code } }
      );
      if (data.token) {
        localStorage.setItem('icoltex_token', data.token);
      }
      router.push('/account');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código incorrecto o expirado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Iniciar sesión</h1>

      {step === 'credentials' ? (
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar código al correo'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-slate-600">
            Revisa tu correo. Ingresa el código de 6 dígitos.
          </p>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Código</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
              placeholder="000000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-[0.5em]"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar y entrar'}
          </button>
          <button
            type="button"
            onClick={() => setStep('credentials')}
            className="w-full text-sm text-slate-500 hover:text-slate-700"
          >
            Volver
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-medium text-slate-900 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
