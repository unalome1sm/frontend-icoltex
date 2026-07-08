'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { setAuthToken } from "@/lib/auth";
import { GoogleAuthDivider } from "@/components/auth/google/GoogleAuthDivider";
import { GoogleSignInButton } from "@/components/auth/google/GoogleSignInButton";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

type Step = "credentials" | "otp";

function AppleIcon() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    signInWithGoogle,
    loading: googleLoading,
    error: googleError,
    setError: setGoogleError,
  } = useGoogleAuth(() => {
    router.push("/account");
    router.refresh();
  });

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/auth/login/request", {
        method: "POST",
        body: { email, password },
      });
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar código");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch<{ user: { id: string; email: string }; token?: string }>(
        "/api/auth/login/verify",
        { method: "POST", body: { email, code } }
      );
      if (data.token) {
        setAuthToken(data.token);
      }
      router.push("/account");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Código incorrecto o expirado");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <span className="font-serif text-5xl font-semibold text-red-600" aria-hidden>X</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Verifica tu correo</h2>
          <p className="mb-4 text-sm text-slate-600">
            Revisa tu correo e ingresa el código de 6 dígitos.
          </p>
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              placeholder="000000"
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-center text-lg tracking-[0.5em] text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            {error && (
              <div className="space-y-1">
                <p className="text-sm text-red-600">{error}</p>
                {error.toLowerCase().includes("administrador") && (
                  <p className="text-sm">
                    <Link href="/admin/login" className="font-medium text-slate-900 underline hover:no-underline">
                      Acceso para administradores →
                    </Link>
                  </p>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Verificar y entrar"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="w-full text-sm text-slate-500 hover:text-slate-700"
            >
              Volver
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-medium text-slate-900 underline hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Link href="/" className="font-serif text-5xl font-semibold text-red-600" aria-label="Icoltex">
          X
        </Link>
      </div>

      {/* Formulario */}
      <form onSubmit={handleRequest} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Correo electrónico"
          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Contraseña"
          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        {error && (
          <div className="space-y-1">
            <p className="text-sm text-red-600">{error}</p>
            {error.toLowerCase().includes("administrador") && (
              <p className="text-sm">
                <Link href="/admin/login" className="font-medium text-slate-900 underline hover:no-underline">
                  Acceso para administradores →
                </Link>
              </p>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Continuar"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <GoogleAuthDivider />

      {googleError && <p className="mb-3 text-sm text-red-600">{googleError}</p>}

      <GoogleSignInButton
        label="Iniciar con Google"
        onCredential={signInWithGoogle}
        onError={setGoogleError}
        disabled={loading || googleLoading}
      />

      {/* Iniciar con Apple */}
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
        onClick={() => {}}
      >
        Iniciar con Apple
        <AppleIcon />
      </button>

      <p className="mt-8 text-center text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-slate-900 underline hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
