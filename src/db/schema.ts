import { pgTable, text, timestamp, boolean, pgEnum, varchar, numeric, jsonb } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
// ======================
// USER TABLE
// ======================
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").$defaultFn(() => false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// ======================
// SESSION TABLE
// ======================
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// ======================
// ACCOUNT TABLE (OAuth)
// ======================
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// ======================
// VERIFICATION TABLE
// ======================
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});




// Enum for role types
export const agentRoleEnum = pgEnum("agent_role", [
  "INTERVIEWER",
  "COACH",
  "RESUME",
  "VOICE_EMOTION",
  "RESEARCH",
  "SCHEDULER",
  "CUSTOM",
]);

export const agents = pgTable("agents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  name: text("name").notNull(),

  // link each agent to its creator (user)
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  slug: varchar("slug", { length: 60 }).notNull(),
  role: agentRoleEnum("role").notNull(),
  model: varchar("model", { length: 60 }).notNull(),
  instructions: text("instructions").notNull(),
  
  isEnabled: boolean("is_enabled").notNull().default(true),
  voice: varchar("voice", { length: 50 }),
  avatarUrl: text("avatar_url"),
  description: text("description"),
  configJson: jsonb("config_json"),

  createdAt: timestamp("created_at")
    .notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
});