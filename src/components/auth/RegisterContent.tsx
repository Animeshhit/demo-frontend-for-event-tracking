"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { registerSchema, getFieldErrors } from "@/lib/validations/auth";
import { AuthField } from "./AuthField";

type Form = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterContent() {
  const router = useRouter();

  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Form;
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      setErrors(getFieldErrors<keyof Form>(result.error));
      return;
    }

    setSubmitting(true);
    try {
      const { name, email, password } = result.data;
      let req = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password, name: name }),
      });

      if (!req.ok) {
        setServerError("failed to register");
      }
      let data = await req.json();

      router.push("/");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-5 py-24 lg:py-32">
      <p className="text-xs uppercase tracking-[.18em] text-black/45">
        Account / Register
      </p>
      <h1 className="mt-3 text-5xl font-light tracking-[-.07em]">
        A quieter way to shop.
      </h1>
      <p className="mt-4 text-black/55">
        Create an account to save your bag and track your orders.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-4">
        <AuthField
          label="Full name"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <AuthField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <AuthField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        {serverError && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Creating account…" : "Create account"}
          {!submitting && <ArrowRight className="ml-2 inline size-4" />}
        </button>
      </form>

      <p className="mt-8 text-sm text-black/55">
        Already have an account?{" "}
        <Link href="/login" className="text-black underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
