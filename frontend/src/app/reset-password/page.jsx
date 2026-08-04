"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { mapValidationErrors } from "@/utils/validation";

function ResetPasswordForm() {
  const token = useSearchParams().get("token");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { resetPassword } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }

    setLoading(true);
    setFieldErrors({});
    try {
      await resetPassword({ token, newPassword });
      toast.showSuccess("Password reset successful.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setFieldErrors(mapValidationErrors(err.errors));
        setError("Please correct the highlighted fields.");
      } else {
        setError(err.message || "Reset failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Choose a new password for your account."
      footer={
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-sm border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {error}
          </div>
          )}
          {!token && (
            <div className="rounded-sm border border-warning/30 bg-warning/10 px-3.5 py-2.5 text-sm text-warning">
              This link is missing a reset token. Please use the link from your email.
            </div>
          )}
        <Input
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          value={newPassword}
          onChange={(e) => { setNewPassword(e.target.value); setFieldErrors(prev => ({ ...prev, newPassword: null })) }}
          error={fieldErrors.newPassword}
          required
        />
          <p className="text-xs text-[var(--fg-muted)]">
            Must include an uppercase letter, a lowercase letter, a number, and a special
            character.
          </p>
          <Button type="submit" size="lg" className="w-full" loading={loading} disabled={!token}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
