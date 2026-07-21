import { betterAuthClient } from "@/core/better-auth-client";
import type { Session } from "@/types/user";

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

export async function signUp(params: SignUpParams): Promise<Session> {
  const result = await betterAuthClient<Session>(
    "/api/auth/sign-up/email",
    params
  );
  if (!result) throw new Error("Registration failed");
  return result;
}

export async function signIn(params: SignInParams): Promise<Session> {
  const result = await betterAuthClient<Session>(
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
  await betterAuthClient("/api/auth/sign-out");
}

export async function getSession(): Promise<Session | null> {
  try {
    const response = await fetch("/api/auth/session");
    if (!response.ok) return null;
    const data = await response.json();
    return data ?? null;
  } catch {
    return null;
  }
}
