import type { AuthResult, UserProfile } from "@/features/auth/types/auth.types";

/**
 * Client-side session storage. The token is kept in localStorage for API calls
 * and mirrored to a cookie so server middleware can guard portal routes later.
 * (A production hardening step is to move to an httpOnly cookie set by a route
 * handler; the API surface here stays the same.)
 */

const TOKEN_KEY = "be.token";
const USER_KEY = "be.user";
const COOKIE_NAME = "be_token";

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveSession(result: AuthResult): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    const expires = new Date(result.expiresAtUtc).toUTCString();
    document.cookie = `${COOKIE_NAME}=${result.token}; path=/; expires=${expires}; SameSite=Lax`;
  } catch {
    /* storage unavailable (private mode); the app still works per-request */
  }
}

export function clearSession(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): UserProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}
