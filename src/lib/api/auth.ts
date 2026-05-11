/**
 * Auth API surface.
 *
 * The dashboard only sees these three endpoints. Whether the backend
 * authenticates with cookie sessions, bearer tokens, OAuth, or anything
 * else, this module's signature stays the same — that's the auth seam
 * the rest of the app codes against.
 */
import { apiFetch } from "./client";

export interface User {
  id: string;
  email: string;
  name: string;
  org_id: string;
}

export interface LoginResponse {
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  await apiFetch("/api/v1/auth/logout", { method: "POST" });
}

export async function me(): Promise<User> {
  return apiFetch<User>("/api/v1/auth/me");
}
