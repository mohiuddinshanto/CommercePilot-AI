import * as authApi from "@/features/auth/api/auth.api";

export async function signUpAction(
  name: string,
  email: string,
  password: string
) {
  return authApi.signUp({ name, email, password });
}

export async function signInAction(email: string, password: string) {
  return authApi.signIn({ email, password });
}

export function signInWithGoogleAction() {
  authApi.signInWithGoogle();
}

export async function signOutAction() {
  return authApi.signOut();
}

export async function getSessionAction() {
  return authApi.getSession();
}
