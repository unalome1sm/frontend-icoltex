"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { GoogleIcon } from "./GoogleIcon";

type GoogleSignInButtonProps = {
  label: string;
  onCredential: (idToken: string) => void | Promise<void>;
  onError?: (message: string) => void;
  disabled?: boolean;
  className?: string;
};

export function GoogleSignInButton({
  label,
  onCredential,
  onError,
  disabled = false,
  className = "",
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => setWidth(Math.max(200, Math.floor(element.offsetWidth)));

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleSuccess = useCallback(
    (response: CredentialResponse) => {
      if (!response.credential) {
        onError?.("No se recibió credencial de Google");
        return;
      }
      void onCredential(response.credential);
    },
    [onCredential, onError],
  );

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white"
        aria-hidden
      >
        {label}
        <GoogleIcon />
      </div>

      <div
        className={[
          "absolute inset-0 overflow-hidden opacity-[0.01]",
          disabled ? "pointer-events-none" : "",
        ].join(" ")}
        aria-label={label}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => onError?.("No se pudo conectar con Google")}
          useOneTap={false}
          width={width}
          text="signin_with"
          shape="rectangular"
          theme="outline"
          size="large"
        />
      </div>
    </div>
  );
}
