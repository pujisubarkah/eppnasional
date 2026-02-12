import { pgTable, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./pertanyaan";

export const answersJson = pgTable("answers_json", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  category_id: integer("category_id").references(() => categories.id).notNull(),
  answers: jsonb("answers").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
