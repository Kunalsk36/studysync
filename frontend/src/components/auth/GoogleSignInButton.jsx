"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

/**
 * Renders Google's own "Sign In With Google" button via the official GIS
 * SDK (approved decision — no @react-oauth/google wrapper). Google issues
 * an ID token client-side; the backend verifies it via google-auth-library.
 */
export function GoogleSignInButton({ onError }) {
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        setScriptReady(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scriptReady || !containerRef.current) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          await loginWithGoogle(response.credential);
          router.push("/dashboard");
        } catch (err) {
          onError?.(err.message || "Google Sign-In failed. Please try again.");
        }
      },
    });

    window.google.accounts.id.renderButton(containerRef.current, {
      theme: theme === "dark" ? "filled_black" : "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
      width: containerRef.current.offsetWidth || 320,
    });
  }, [scriptReady, theme, loginWithGoogle, router, onError]);

  return <div ref={containerRef} className="flex w-full justify-center [&>div]:w-full" />;
}
