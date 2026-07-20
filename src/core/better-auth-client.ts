const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function betterAuthClient<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

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

export async function betterAuthGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
  });

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
