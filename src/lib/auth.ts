import { betterAuth } from "better-auth";
import { db } from  "@/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema"

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true, // turns on email+password flow
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema:  schema,
    }),
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.5.66:3000",
  ],
});
