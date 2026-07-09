import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Compass className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-6xl font-bold text-[var(--fg)]">404</h1>
      <p className="max-w-sm text-[var(--fg-muted)]">
        This page doesn&apos;t exist. Let&apos;s get you back to somewhere productive.
      </p>
      <div className="mt-2 flex gap-3">
        <Button href="/" variant="secondary">
          Go to Landing Page
        </Button>
        <Button href="/dashboard">Go to Dashboard</Button>
      </div>
      <Link href="/" className="sr-only">
        Home
      </Link>
    </div>
  );
}
