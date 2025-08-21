import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  totalDuration: integer("total_duration").default(0), // in seconds
  focusedTime: integer("focused_time").default(0), // in seconds
  drowsyTime: integer("drowsy_time").default(0), // in seconds
  distractedTime: integer("distracted_time").default(0), // in seconds
  stressedTime: integer("stressed_time").default(0), // in seconds
  focusScore: real("focus_score").default(0), // percentage
  currentState: text("current_state").default("FOCUSED"), // FOCUSED | DROWSY | DISTRACTED | STRESSED
});

export const sessionEvents = pgTable("session_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  state: text("state").notNull(), // FOCUSED | DROWSY | DISTRACTED | STRESSED
  confidence: real("confidence").default(0), // 0-1
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  startTime: true,
});

export const insertSessionEventSchema = createInsertSchema(sessionEvents).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type SessionEvent = typeof sessionEvents.$inferSelect;
export type InsertSessionEvent = z.infer<typeof insertSessionEventSchema>;
