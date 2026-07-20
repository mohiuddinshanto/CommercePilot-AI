const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface BetterAuthResponse {
  data?: unknown;
  error?: { code: string; message: string; status: number; statusText: string };
}

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

  const data: BetterAuthResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "Auth request failed");
  }

  return data as T;
}

export async function betterAuthGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
  });

  const data: BetterAuthResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "Auth request failed");
  }

  return data as T;
}
