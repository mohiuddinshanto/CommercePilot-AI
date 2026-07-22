const TOKEN_KEY = "cp_auth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY) || getCookieToken();
  } catch {
    return getCookieToken();
  }
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      // Fallback cookies for any library/route needs
      document.cookie = `better-auth.session_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
      document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
    } else {
      clearStoredToken();
    }
  } catch {
    // ignore storage errors
  }
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = "better-auth.session_token=; path=/; max-age=0; SameSite=Lax; Secure";
    document.cookie = "__Secure-better-auth.session_token=; path=/; max-age=0; SameSite=Lax; Secure";
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax; Secure`;
  } catch {
    // ignore
  }
}

function getCookieToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)(?:better-auth\.session_token|__Secure-better-auth\.session_token|cp_auth_token)=([^;]*)/);
  return match ? match[1] : null;
}
