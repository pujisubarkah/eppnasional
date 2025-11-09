// server/database/schema/question_options.ts
import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { pgSchema } from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const eppnSchema = pgSchema("eppn");

export const questionOptions = eppnSchema.table("question_options", {
  id: serial("id").primaryKey(),
  category_id: integer("category_id").references(() => categories.id).notNull(),
  question_key: varchar("question_key", { length: 50 }).notNull(),
  question_text: text("question_text").notNull(),
  order: integer("order"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});