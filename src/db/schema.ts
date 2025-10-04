
import { pgTable, text, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// users
export const users = pgTable("users", {
  id: varchar("id", { length: 191 }).primaryKey(), // better-auth uses string ids
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  name: varchar("name", { length: 255 }),
  image: text("image"),
  // if you use email+password
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// sessions
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 191 }).primaryKey(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
});

// accounts (for OAuth providers)
export const accounts = pgTable("accounts", {
  id: varchar("id", { length: 191 }).primaryKey(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
});

// email verification / reset tokens
export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
});
