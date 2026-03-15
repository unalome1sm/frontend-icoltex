"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuthSidebar } from "@/contexts/AuthSidebarContext";

type LoginStep = "credentials" | "otp";
type RegisterStep = "email" | "otp" | "password";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";
const btnPrimaryClass =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50";

export function AuthSidebar() {
  const router = useRouter();
  const { isOpen, mode, closeAuth, setMode } = useAuthSidebar();

  // Login state
  const [loginStep, setLoginStep] = useState<LoginStep>("credentials");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regStep, setRegStep] = useState<RegisterStep>("email");
  const [regEmail, setRegEmail] = useState("");
  const [regNombre, setRegNombre] = useState("");
  const [regCode, setRegCode] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  // Reset body scroll when open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleAuthSuccess = () => {
    closeAuth();
    router.push("/account");
    router.refresh();
  };

  // —— Login ——
  async function handleLoginRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await apiFetch("/api/auth/login/request", { method: "POST", body: { email: loginEmail, password: loginPassword } });
      setLoginStep("otp");
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Error al enviar código");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLoginVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const data = await apiFetch<{ token?: string }>("/api/auth/login/verify", {
        method: "POST",
        body: { email: loginEmail, code: loginCode },
      });
      if (data.token) localStorage.setItem("icoltex_token", data.token);
      handleAuthSuccess();
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Código incorrecto o expirado");
    } finally {
      setLoginLoading(false);
    }
  }

  // —— Register ——
  async function handleRegEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);
    try {
      await apiFetch("/api/auth/register/request", { method: "POST", body: { email: regEmail } });
      setRegStep("otp");
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : "Error al enviar código");
    } finally {
      setRegLoading(false);
    }
  }

  function handleRegOtpNext(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    if (!regCode || regCode.length !== 6) {
      setRegError("Ingresa el código de 6 dígitos");
      return;
    }
    setRegStep("password");
  }

  async function handleRegPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    if (regPassword !== regConfirmPassword) {
      setRegError("Las contraseñas no coinciden");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setRegLoading(true);
    try {
      const data = await apiFetch<{ token?: string }>("/api/auth/register/verify", {
        method: "POST",
        body: { email: regEmail, code: regCode, password: regPassword, confirmPassword: regConfirmPassword, nombre: regNombre || undefined },
      });
      if (data.token) localStorage.setItem("icoltex_token", data.token);
      handleAuthSuccess();
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setRegLoading(false);
    }
  }

  if (!mode) return null;

  return (
    <>
      {/* Overlay: fade coordinado con el panel */}
      <div
        role="presentation"
        className="fixed inset-0 z-40 bg-black/40"
        onClick={closeAuth}
        aria-hidden
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      />
      {/* Panel: recorrido visible de derecha a izquierda (450ms, curva suave) */}
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        aria-modal
        aria-label={mode === "login" ? "Iniciar sesión" : "Registrarse"}
      >
        <div className="flex h-full flex-col">
          {/* Header: close button */}
          <div className="flex shrink-0 items-center justify-end border-b border-slate-200 p-4">
            <button
              type="button"
              onClick={closeAuth}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Content: scrollable */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
            {mode === "login" ? (
              <LoginContent
                step={loginStep}
                email={loginEmail}
                setEmail={setLoginEmail}
                password={loginPassword}
                setPassword={setLoginPassword}
                code={loginCode}
                setCode={setLoginCode}
                loading={loginLoading}
                error={loginError}
                onRequest={handleLoginRequest}
                onVerify={handleLoginVerify}
                onBackToCredentials={() => setLoginStep("credentials")}
                onSwitchToRegister={() => setMode("register")}
                inputClass={inputClass}
                btnPrimaryClass={btnPrimaryClass}
                GoogleIcon={GoogleIcon}
                AppleIcon={AppleIcon}
              />
            ) : (
              <RegisterContent
                step={regStep}
                email={regEmail}
                setEmail={setRegEmail}
                nombre={regNombre}
                setNombre={setRegNombre}
                code={regCode}
                setCode={setRegCode}
                password={regPassword}
                setPassword={setRegPassword}
                confirmPassword={regConfirmPassword}
                setConfirmPassword={setRegConfirmPassword}
                loading={regLoading}
                error={regError}
                onEmailSubmit={handleRegEmailSubmit}
                onOtpNext={handleRegOtpNext}
                onPasswordSubmit={handleRegPasswordSubmit}
                onBackToEmail={() => setRegStep("email")}
                onBackToOtp={() => setRegStep("otp")}
                onSwitchToLogin={() => setMode("login")}
                inputClass={inputClass}
                btnPrimaryClass={btnPrimaryClass}
                GoogleIcon={GoogleIcon}
                AppleIcon={AppleIcon}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function LoginContent({
  step,
  email,
  setEmail,
  password,
  setPassword,
  code,
  setCode,
  loading,
  error,
  onRequest,
  onVerify,
  onBackToCredentials,
  onSwitchToRegister,
  inputClass,
  btnPrimaryClass,
  GoogleIcon,
  AppleIcon,
}: {
  step: LoginStep;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  loading: boolean;
  error: string;
  onRequest: (e: React.FormEvent) => void;
  onVerify: (e: React.FormEvent) => void;
  onBackToCredentials: () => void;
  onSwitchToRegister: () => void;
  inputClass: string;
  btnPrimaryClass: string;
  GoogleIcon: () => JSX.Element;
  AppleIcon: () => JSX.Element;
}) {
  if (step === "otp") {
    return (
      <div className="w-full">
        <div className="mb-6 flex justify-center">
          <span className="font-serif text-4xl font-semibold text-red-600" aria-hidden>X</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Verifica tu correo</h2>
          <p className="mb-4 text-sm text-slate-600">Revisa tu correo e ingresa el código de 6 dígitos.</p>
          <form onSubmit={onVerify} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              placeholder="000000"
              className={`${inputClass} text-center text-lg tracking-[0.5em]`}
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
            <button type="submit" disabled={loading} className={btnPrimaryClass}>
              {loading ? "Verificando..." : "Verificar y entrar"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={onBackToCredentials} className="w-full text-sm text-slate-500 hover:text-slate-700">
              Volver
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          <button type="button" onClick={onSwitchToRegister} className="font-medium text-slate-900 underline hover:no-underline">
            Regístrate
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-center">
        <span className="font-serif text-4xl font-semibold text-red-600" aria-hidden>X</span>
      </div>
      <form onSubmit={onRequest} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Correo electrónico" className={inputClass} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Contraseña" className={inputClass} />
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
        <button type="submit" disabled={loading} className={btnPrimaryClass}>
          {loading ? "Enviando..." : "Continuar"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-300" />
        <span className="text-sm font-medium text-slate-700">O</span>
        <span className="h-px flex-1 bg-slate-300" />
      </div>
      <button type="button" className={`${btnPrimaryClass} mb-3`}>
        Iniciar con Google
        <GoogleIcon />
      </button>
      <button type="button" className={btnPrimaryClass}>
        Iniciar con Apple
        <AppleIcon />
      </button>
      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <button type="button" onClick={onSwitchToRegister} className="font-medium text-slate-900 underline hover:underline">
          Regístrate
        </button>
      </p>
    </div>
  );
}

function RegisterContent({
  step,
  email,
  setEmail,
  nombre,
  setNombre,
  code,
  setCode,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  error,
  onEmailSubmit,
  onOtpNext,
  onPasswordSubmit,
  onBackToEmail,
  onBackToOtp,
  onSwitchToLogin,
  inputClass,
  btnPrimaryClass,
  GoogleIcon,
  AppleIcon,
}: {
  step: RegisterStep;
  email: string;
  setEmail: (v: string) => void;
  nombre: string;
  setNombre: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  loading: boolean;
  error: string;
  onEmailSubmit: (e: React.FormEvent) => void;
  onOtpNext: (e: React.FormEvent) => void;
  onPasswordSubmit: (e: React.FormEvent) => void;
  onBackToEmail: () => void;
  onBackToOtp: () => void;
  onSwitchToLogin: () => void;
  inputClass: string;
  btnPrimaryClass: string;
  GoogleIcon: () => JSX.Element;
  AppleIcon: () => JSX.Element;
}) {
  if (step === "otp") {
    return (
      <div className="w-full">
        <div className="mb-6 flex justify-center">
          <span className="font-serif text-4xl font-semibold text-red-600" aria-hidden>X</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Verifica tu correo</h2>
          <p className="mb-4 text-sm text-slate-600">
            Revisa <strong>{email}</strong> e ingresa el código de 6 dígitos.
          </p>
          <form onSubmit={onOtpNext} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              placeholder="000000"
              className={`${inputClass} text-center text-lg tracking-[0.5em]`}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className={btnPrimaryClass}>
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={onBackToEmail} className="w-full text-sm text-slate-500 hover:text-slate-700">
              Volver
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <button type="button" onClick={onSwitchToLogin} className="font-medium text-slate-900 underline hover:underline">
            Inicia sesión
          </button>
        </p>
      </div>
    );
  }

  if (step === "password") {
    return (
      <div className="w-full">
        <div className="mb-6 flex justify-center">
          <span className="font-serif text-4xl font-semibold text-red-600" aria-hidden>X</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Crea tu contraseña</h2>
          <p className="mb-4 text-sm text-slate-600">Mínimo 6 caracteres.</p>
          <form onSubmit={onPasswordSubmit} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Contraseña" className={inputClass} />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} placeholder="Confirmar contraseña" className={inputClass} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className={btnPrimaryClass}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={onBackToOtp} className="w-full text-sm text-slate-500 hover:text-slate-700">
              Volver
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <button type="button" onClick={onSwitchToLogin} className="font-medium text-slate-900 underline hover:underline">
            Inicia sesión
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-center">
        <span className="font-serif text-4xl font-semibold text-red-600" aria-hidden>X</span>
      </div>
      <form onSubmit={onEmailSubmit} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Correo electrónico" className={inputClass} />
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre (opcional)" className={inputClass} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className={btnPrimaryClass}>
          {loading ? "Enviando..." : "Continuar"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-300" />
        <span className="text-sm font-medium text-slate-700">O</span>
        <span className="h-px flex-1 bg-slate-300" />
      </div>
      <button type="button" className={`${btnPrimaryClass} mb-3`}>
        Registrarse con Google
        <GoogleIcon />
      </button>
      <button type="button" className={btnPrimaryClass}>
        Registrarse con Apple
        <AppleIcon />
      </button>
      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <button type="button" onClick={onSwitchToLogin} className="font-medium text-slate-900 underline hover:underline">
          Inicia sesión
        </button>
      </p>
    </div>
  );
}
