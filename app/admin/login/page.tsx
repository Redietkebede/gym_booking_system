"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin/bookings");
  };

  return (
    <section className="mx-auto mt-10 max-w-lg rounded-3xl border border-(--border-subtle) bg-(--surface) p-8 shadow-[0_30px_90px_var(--shadow-color)]">
      <h1 className="font-(--font-display) text-3xl text-(--brand-ink)">
        Admin login
      </h1>
      <p className="mt-2 text-sm text-(--brand-ink)/70">
        Use your admin credentials to manage bookings and services.
      </p>
      <form className="mt-6 grid gap-5" onSubmit={handleSubmit} noValidate>
        <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
          Email
          <input
            type="email"
            className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-(--brand-ink)">
          Password
          <input
            type="password"
            className="rounded-2xl border border-(--border-subtle) bg-(--surface-solid) px-4 py-3 text-base text-(--brand-ink)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          className="rounded-full border border-(--brand-ink) px-6 py-3 text-sm font-semibold uppercase tracking-wide text-(--brand-ink) transition hover:-translate-y-px hover:border-(--brand-ember) hover:text-(--brand-ember) disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        {error ? (
          <p className="text-xs text-(--brand-ember)">{error}</p>
        ) : (
          <p className="text-xs text-(--brand-ink)/60">
            Need access? Contact the studio owner.
          </p>
        )}
      </form>
    </section>
  );
}
