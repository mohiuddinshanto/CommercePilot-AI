import { betterAuthClient, betterAuthGet } from "@/core/better-auth-client";
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
  const result = await betterAuthClient<{ url: string }>(
    "/api/auth/sign-in/social",
    {
      provider: "google",
      callbackURL,
    }
  );
  if (result?.url) {
    window.location.href = result.url;
  } else {
    throw new Error("Failed to initiate Google sign-in");
  }
}

export async function signOut(): Promise<void> {
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
