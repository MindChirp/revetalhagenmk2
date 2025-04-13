import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_BASE_URL,
  plugins: [adminClient()],
});
