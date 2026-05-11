"use client";

import { type FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { user } = await login(email, password);
      setUser(user);
      const redirect = searchParams.get("from") || "/";
      router.replace(redirect);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 423) {
          setError("Account temporarily locked. Wait a few minutes and try again.");
        } else if (err.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(err.detail || "Sign-in failed. Try again.");
        }
      } else {
        setError("Network error. Check your connection.");
      }
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-8 bg-surface-container rounded"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter text-primary font-headline">
          SPECTER
        </h1>
        <p className="font-headline tracking-wider uppercase text-xs font-bold text-primary/60">
          Operational Intelligence
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-on-surface-variant font-headline font-bold">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            autoComplete="email"
            autoFocus
            className="bg-surface text-on-surface px-4 py-3 rounded outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-on-surface-variant font-headline font-bold">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            autoComplete="current-password"
            className="bg-surface text-on-surface px-4 py-3 rounded outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="text-sm text-error-container bg-error/15 border border-error/40 px-4 py-3 rounded"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !email || !password}
        className="bg-primary text-on-primary px-6 py-3 rounded font-headline tracking-widest uppercase text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
