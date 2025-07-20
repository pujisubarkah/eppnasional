import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(), // gunakan serial agar auto increment
  question_id: integer("question_id").notNull(),
  user_id: integer("user_id").notNull(),
  answer: text("answer").notNull(),
  created_at: timestamp("created_at").notNull(),
});