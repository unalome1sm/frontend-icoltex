'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

type Step = 'email' | 'otp' | 'password';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/api/auth/register/request', {
        method: 'POST',
        body: { email },
      });
      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar código');
    } finally {
      setLoading(false);
    }
  }

  function handleOtpNext(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!code || code.length !== 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }
    setStep('password');
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch<{ user: { id: string; email: string }; token?: string }>(
        '/api/auth/register/verify',
        {
          method: 'POST',
          body: { email, code, password, confirmPassword, nombre: nombre || undefined },
        }
      );
      if (data.token) {
        localStorage.setItem('icoltex_token', data.token);
      }
      router.push('/account');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Crear cuenta</h1>

      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
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
            <label className="mb-1 block text-sm text-slate-600">Nombre (opcional)</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpNext} className="space-y-4">
          <p className="text-sm text-slate-600">
            Revisa tu correo <strong>{email}</strong>. Ingresa el código de 6 dígitos.
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
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Continuar
          </button>
          <button
            type="button"
            onClick={() => setStep('email')}
            className="w-full text-sm text-slate-500 hover:text-slate-700"
          >
            Volver
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <p className="text-sm text-slate-600">Crea tu contraseña (mín. 6 caracteres)</p>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
          <button
            type="button"
            onClick={() => setStep('otp')}
            className="w-full text-sm text-slate-500 hover:text-slate-700"
          >
            Volver
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-slate-900 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
