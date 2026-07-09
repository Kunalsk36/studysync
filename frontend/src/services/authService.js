const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Thin fetch wrapper for the six documented /api/auth/* endpoints plus
 * /api/auth/me. `credentials: "include"` is required on every call so the
 * httpOnly auth cookie is sent/received (approved storage decision) —
 * never read or written from JavaScript.
 */
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}/api/auth${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body.message || "Something went wrong.");
    error.errors = body.errors || [];
    error.status = res.status;
    throw error;
  }

  return body;
}

export const authService = {
  register: (data) => request("/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/login", { method: "POST", body: JSON.stringify(data) }),
  loginWithGoogle: (idToken) =>
    request("/google", { method: "POST", body: JSON.stringify({ idToken }) }),
  logout: () => request("/logout", { method: "POST" }),
  forgotPassword: (email) =>
    request("/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (data) =>
    request("/reset-password", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/me"),
};
