/**
 * Generic API client for the Specter cloud backend.
 *
 * One choke point — every cross-origin call routes through here. Adding
 * auth headers, retry logic, observability, etc. happens in one place.
 *
 * Cookies travel automatically when `credentials: "include"` is set; the
 * backend issues HttpOnly session cookies on /api/v1/auth/login. The
 * dashboard never reads the cookie value directly (HttpOnly).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(public status: number, public detail: string) {
    super(detail);
    this.name = "ApiError";
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") detail = body.detail;
    } catch {
      // ignore parse failure; use statusText
    }
    throw new ApiError(res.status, detail);
  }

  // Some endpoints (e.g., logout) return JSON, others return 204. Handle both.
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
