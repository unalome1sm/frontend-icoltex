import { apiFetch } from "@/lib/api";
import { setAuthToken } from "@/lib/auth/session";

export type GoogleAuthResponse = {
  message: string;
  token?: string;
  user?: { id: string; email: string; nombre?: string };
  isNewUser?: boolean;
};

export async function authenticateWithGoogleIdToken(
  idToken: string,
): Promise<GoogleAuthResponse> {
  const data = await apiFetch<GoogleAuthResponse>("/api/auth/google", {
    method: "POST",
    body: { idToken },
  });

  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
}
