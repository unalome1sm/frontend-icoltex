"use client";

import { useCallback, useState } from "react";
import { authenticateWithGoogleIdToken } from "@/lib/auth";

export function useGoogleAuth(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      setError("");
      setLoading(true);
      try {
        await authenticateWithGoogleIdToken(idToken);
        onSuccess?.();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al iniciar sesión con Google";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  return { signInWithGoogle, loading, error, setError };
}
