import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  username: text("username").unique(),
  password: text("password"),
  profilePicture: text("profile_picture"),
  invitationCode: text("invitation_code").notNull().unique(),
  partnerId: varchar("partner_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const statuses = pgTable("statuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // 'free', 'busy', 'meeting', 'sleeping', 'custom'
  title: text("title").notNull(),
  message: text("message"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = insertUserSchema.omit({
  invitationCode: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertStatusSchema = createInsertSchema(statuses).omit({
  id: true,
  createdAt: true,
  expiresAt: true,
}).extend({
  expiresAt: z.union([z.string(), z.date()]).optional().nullable().transform((val) => {
    if (val === null || val === undefined) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertStatus = z.infer<typeof insertStatusSchema>;
export type Status = typeof statuses.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

export const statusTypes = {
  free: {
    title: "Free",
    icon: "check",
    color: "success",
    message: "Available now"
  },
  busy: {
    title: "Busy", 
    icon: "times",
    color: "danger",
    message: "Do not disturb"
  },
  meeting: {
    title: "Meeting",
    icon: "briefcase", 
    color: "info",
    message: "In a meeting"
  },
  sleeping: {
    title: "Sleeping",
    icon: "moon",
    color: "purple", 
    message: "Catching some Z's"
  }
} as const;
