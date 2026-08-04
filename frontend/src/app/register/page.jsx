"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { mapValidationErrors } from "@/utils/validation";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { register } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    try {
      await register(form);
      toast.showSuccess("Registration successful. Welcome!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setFieldErrors(mapValidationErrors(err.errors));
        setError("Please correct the highlighted fields.");
      } else {
        setError(err.message || "Registration failed.");
      }
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            placeholder="Kunal Kavathekar"
            value={form.fullName}
            onChange={handleChange("fullName")}
            error={fieldErrors.fullName}
            maxLength={100}
            required
          />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            error={fieldErrors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange("password")}
            error={fieldErrors.password}
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
