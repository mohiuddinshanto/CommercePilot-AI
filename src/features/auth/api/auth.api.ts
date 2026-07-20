import { betterAuthClient, betterAuthGet } from "@/core/better-auth-client";
import type { Session } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
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
  const result = await betterAuthClient<{ data?: Session }>(
    "/api/auth/sign-up/email",
    params
  );
  if (!result.data) throw new Error("Registration failed");
  return result.data;
}

export async function signIn(params: SignInParams): Promise<Session> {
  const result = await betterAuthClient<{ data?: Session }>(
    "/api/auth/sign-in/email",
    params
  );
  if (!result.data) throw new Error("Login failed");
  return result.data;
}

export function signInWithGoogle(): void {
  const callbackURL = `${APP_URL}/dashboard`;
  window.location.href = `${BASE_URL}/api/auth/signin/social?provider=google&callbackURL=${encodeURIComponent(callbackURL)}`;
}

export async function signOut(): Promise<void> {
  await betterAuthClient("/api/auth/sign-out");
}

export async function getSession(): Promise<Session | null> {
  try {
    const result = await betterAuthGet<{ data?: Session }>(
      "/api/auth/get-session"
    );
    return result.data ?? null;
  } catch {
    return null;
  }
}
