import { getApiUrl, getAuthHeaders } from "@/lib/api";

export const AUTH_TOKEN_KEY = "icoltex_token";
export const AUTH_CHANGE_EVENT = "icoltex-auth-change";

export type SessionUser = {
  id: string;
  email: string;
  nombre?: string;
};

export function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  notifyAuthChange();
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  notifyAuthChange();
}

export async function logoutSession(): Promise<void> {
  try {
    await fetch(getApiUrl("/api/auth/logout"), {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
    });
  } catch {
    // ignore network errors during logout
  }
  clearAuthToken();
}
