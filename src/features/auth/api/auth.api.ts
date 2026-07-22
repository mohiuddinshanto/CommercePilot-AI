import { betterAuthClient } from "@/core/better-auth-client";
import type { Session, User } from "@/types/user";
import { getStoredToken, clearStoredToken } from "@/lib/token";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignInResponse {
  redirect: boolean;
  token: string;
  user: User;
}

export async function signUp(params: SignUpParams): Promise<SignInResponse> {
  const result = await betterAuthClient<SignInResponse>(
    "/api/auth/sign-up/email",
    params
  );
  if (!result) throw new Error("Registration failed");
  return result;
}

export async function signIn(params: SignInParams): Promise<SignInResponse> {
  const result = await betterAuthClient<SignInResponse>(
    "/api/auth/sign-in/email",
    params
  );
  if (!result) throw new Error("Login failed");
  return result;
}

export async function signInWithGoogle(): Promise<void> {
  const callbackURL = `${APP_URL}/dashboard`;

  const response = await fetch("/api/auth/sign-in/social", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "google", callbackURL }),
    redirect: "manual",
  });

  if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400)) {
    const location = response.headers.get("Location");
    if (location) {
      window.location.href = location;
      return;
    }
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Google sign-in failed (${response.status})`);
  }

  const data = await response.json().catch(() => null);
  const url = data?.url || data?.data?.url;

  if (url) {
    window.location.href = url;
    return;
  }

  throw new Error("Failed to initiate Google sign-in");
}

export async function signOut(): Promise<void> {
  clearStoredToken();
  await betterAuthClient("/api/auth/sign-out");
}

export async function getSession(): Promise<Session | null> {
  const token = getStoredToken();

  // Strategy 1: Call backend directly with Bearer token (bypasses Next.js route handler)
  if (token) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/auth/get-session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const raw: unknown = await response.json();
        const unwrapped = (raw as Record<string, unknown>)?.data ?? raw;
        if (unwrapped && typeof unwrapped === "object" && "user" in (unwrapped as Record<string, unknown>)) {
          return unwrapped as Session;
        }
      }
    } catch {
      // Fall through to strategy 2
    }
  }

  // Strategy 2: Route handler (uses cookies + Authorization header)
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch("/api/auth/session", { headers });
    if (!response.ok) {
      if (response.status === 401) clearStoredToken();
      return null;
    }
    const data = await response.json();
    return data ?? null;
  } catch {
    return null;
  }
}
