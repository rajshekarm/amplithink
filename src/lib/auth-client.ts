// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined"
    ? window.location.origin           // browser uses current origin (works for A’s IP)
    : (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"), // SSR fallback
});
