const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Shared fetch wrapper for API requests. 
 * Automatically includes credentials for HTTP-only cookies.
 */
export async function request(path, options = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
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
