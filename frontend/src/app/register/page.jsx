"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.errors?.length ? err.errors.join(" ") : err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organizing your learning journey today."
      footer={
        <p className="text-[var(--fg-muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <GoogleSignInButton onError={setError} />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--fg-muted)]">or sign up with email</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        {error && (
          <div className="rounded-sm border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-sm border border-success/30 bg-success/10 px-3.5 py-2.5 text-sm text-success">
            Registration successful. Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            placeholder="Kunal Kavathekar"
            value={form.fullName}
            onChange={handleChange("fullName")}
            maxLength={100}
            required
          />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange("password")}
            required
          />
          <p className="text-xs text-[var(--fg-muted)]">
            Must include an uppercase letter, a lowercase letter, a number, and a special
            character.
          </p>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Create Account
          </Button>
          <p className="text-center text-xs text-[var(--fg-muted)]">
            By continuing, you agree to StudySync&apos;s Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
