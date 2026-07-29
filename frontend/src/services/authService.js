import { request } from "./api";

export const authService = {
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  loginWithGoogle: (idToken) =>
    request("/auth/google", { method: "POST", body: JSON.stringify({ idToken }) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  forgotPassword: (email) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (data) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/auth/me"),
};
