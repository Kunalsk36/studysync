const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Normalizes HTTP errors into friendly messages.
 */
function normalizeError(status, body) {
  let message = body.message || "Something went wrong. Please try again.";

  switch (status) {
    case 401:
      message = "Your session has expired. Please log in again.";
      break;
    case 403:
      message = "You do not have permission to perform this action.";
      break;
    case 404:
      message = "The requested item could not be found.";
      break;
    case 409:
      message = "This record already exists.";
      break;
    case 422:
      message = "Please check the entered information.";
      break;
    case 429:
      message = "Too many requests. Please try again later.";
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      message = "Something went wrong. Please try again.";
      break;
  }

  const error = new Error(message);
  error.status = status;
  error.errors = body.errors || [];
  return error;
}

/**
 * Shared fetch wrapper for API requests. 
 * Automatically includes credentials for HTTP-only cookies.
 */
export async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}/api${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw normalizeError(res.status, body);
    }

    return body;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      const error = new Error("Unable to connect to the server.");
      error.status = 0;
      error.errors = [];
      throw error;
    }
    throw err;
  }
}
