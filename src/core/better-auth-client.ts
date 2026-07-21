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

function extractSessionCookie(headers: Headers): void {
  try {
    const getSetCookie = headers.getSetCookie;
    if (typeof getSetCookie === "function") {
      const setCookies = getSetCookie.call(headers);
      const sessionCookie = setCookies.find(
        (c: string) =>
          c.startsWith("__Secure-better-auth.session_token=") ||
          c.startsWith("better-auth.session_token=")
      );
      if (sessionCookie) {
        persistSessionCookie(sessionCookie);
        return;
      }
    }
  } catch {
    // getSetCookie not available
  }

  try {
    const setCookie = (headers as unknown as { get: (k: string) => string | null }).get("set-cookie");
    if (setCookie) {
      const cookies = setCookie.split(",").map((c: string) => c.trim());
      const sessionCookie = cookies.find(
        (c: string) =>
          c.startsWith("__Secure-better-auth.session_token=") ||
          c.startsWith("better-auth.session_token=")
      );
      if (sessionCookie) persistSessionCookie(sessionCookie);
    }
  } catch {
    // fallback not available either
  }
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

  extractSessionCookie(response.headers);

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
