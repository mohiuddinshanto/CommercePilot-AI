import { betterAuthClient, betterAuthGet } from "@/core/better-auth-client";
import type { Session } from "@/types/user";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SESSION_COOKIE = "better-auth.session_token";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setSessionCookie(token: string) {
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax; Secure`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax; Secure`;
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export async function signUp(params: SignUpParams): Promise<Session> {
  const result = await betterAuthClient<Session>(
    "/api/auth/sign-up/email",
    params
  );
  if (!result) throw new Error("Registration failed");

  const token =
    (result as unknown as { token?: string }).token ||
    (result as unknown as { session?: { token?: string } }).session?.token;
  if (token) setSessionCookie(token);

  return result;
}

export async function signIn(params: SignInParams): Promise<Session> {
  const result = await betterAuthClient<Session>(
    "/api/auth/sign-in/email",
    params
  );
  if (!result) throw new Error("Login failed");

  const token =
    (result as unknown as { token?: string }).token ||
    (result as unknown as { session?: { token?: string } }).session?.token;
  if (token) setSessionCookie(token);

  return result;
}

export async function signInWithGoogle(): Promise<void> {
  const callbackURL = `${APP_URL}/dashboard`;
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const response = await fetch(`${BASE}/api/auth/sign-in/social`, {
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
  clearSessionCookie();
  await betterAuthClient("/api/auth/sign-out");
}

export async function getSession(): Promise<Session | null> {
  try {
    const result = await betterAuthGet<Session>(
      "/api/auth/get-session"
    );
    return result ?? null;
  } catch {
    return null;
  }
}
