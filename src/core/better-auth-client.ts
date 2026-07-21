const BASE_URL = "";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function persistSessionCookie(setCookieHeader: string) {
  if (typeof document === "undefined") return;
  const eqIdx = setCookieHeader.indexOf("=");
  const semicolonIdx = setCookieHeader.indexOf(";");
  const cookieToken =
    semicolonIdx > eqIdx
      ? setCookieHeader.substring(eqIdx + 1, semicolonIdx)
      : setCookieHeader.substring(eqIdx + 1);

  if (!cookieToken) {
    document.cookie = `better-auth.session_token=; path=/; max-age=0; SameSite=Lax; Secure`;
    return;
  }

  document.cookie = `better-auth.session_token=${cookieToken}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax; Secure`;
}

export async function betterAuthClient<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Auth request failed (${response.status})`);
  }

  try {
    const setCookies = response.headers.getSetCookie?.() ?? [];
    const sessionCookie = setCookies.find(
      (c) =>
        c.startsWith("__Secure-better-auth.session_token=") ||
        c.startsWith("better-auth.session_token=")
    );
    if (sessionCookie) persistSessionCookie(sessionCookie);
  } catch {
    // getSetCookie not available
  }

  const raw = await response.json();

  if (raw && typeof raw === "object" && "data" in raw) {
    if (raw.error) {
      throw new Error(raw.error.message || "Auth request failed");
    }
    return raw.data as T;
  }

  return raw as T;
}

export async function betterAuthGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Auth request failed (${response.status})`);
  }

  const raw = await response.json();

  if (raw && typeof raw === "object" && "data" in raw) {
    if (raw.error) {
      throw new Error(raw.error.message || "Auth request failed");
    }
    return raw.data as T;
  }

  return raw as T;
}
