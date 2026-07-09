"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Visual-only: this is a prototype, there is no registration API.
    setTimeout(() => setLoading(false), 1200);
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
        <GoogleButton>Sign up with Google</GoogleButton>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--fg-muted)]">or sign up with email</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" type="text" placeholder="Kunal Kavathekar" required />
          <Input label="Email address" type="email" placeholder="you@example.com" required />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            required
          />
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
