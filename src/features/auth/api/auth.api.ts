import { api } from "@/lib/api/client";
import type { AuthResult, UserProfile } from "@/features/auth/types/auth.types";

/** Authentication calls against the .NET API. */
export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResult>("/api/auth/login", { json: { email, password } }),

  me: (token: string) => api.get<UserProfile>("/api/auth/me", { token }),

  forgotPassword: (email: string) =>
    api.post<void>("/api/auth/forgot-password", { json: { email } }),

  resetPassword: (email: string, token: string, newPassword: string) =>
    api.post<void>("/api/auth/reset-password", {
      json: { email, token, newPassword },
    }),
};
