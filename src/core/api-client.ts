import type { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.message || "API request failed");
  }

  return data.data as T;
}

export function get<T>(endpoint: string, token?: string): Promise<T> {
  return apiClient<T>(endpoint, { method: "GET", token });
}

export function post<T>(
  endpoint: string,
  body?: unknown,
  token?: string
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    token,
  });
}

export function patch<T>(
  endpoint: string,
  body?: unknown,
  token?: string
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
    token,
  });
}

export function del<T>(endpoint: string, token?: string): Promise<T> {
  return apiClient<T>(endpoint, { method: "DELETE", token });
}
