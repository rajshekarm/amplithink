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
    schema: { ...schema },
  }),
});
