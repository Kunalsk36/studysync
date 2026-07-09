"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Visual-only: this is a prototype, there is no authentication API.
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your study streak."
      footer={
        <p className="text-[var(--fg-muted)]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <GoogleButton>Continue with Google</GoogleButton>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--fg-muted)]">or continue with email</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email address" type="email" placeholder="you@example.com" required />
          <div>
            <Input label="Password" type="password" placeholder="••••••••" required />
            <div className="mt-2 text-right">
              <Link href="#" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Log In
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
