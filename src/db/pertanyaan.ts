import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

// --- Categories Table ---
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

// --- Questions Table ---
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  category_id: integer("category_id").references(() => categories.id, {
    onDelete: "no action",
    onUpdate: "no action",
  }),
  created_at: timestamp("created_at", { precision: 6 }).defaultNow(),
});

// --- Question Options Table ---
export const question_options = pgTable("question_options", {
  id: serial("id").primaryKey(),
  question_id: integer("question_id")
    .notNull()
    .references(() => questions.id, {
      onDelete: "no action",
      onUpdate: "no action",
    }),
  option_text: varchar("option_text", { length: 255 }).notNull(),
  option_value: integer("option_value"),
  ordering: integer("ordering"),
});

// --- Answers Table ---
export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  question_id: integer("question_id").references(() => questions.id, {
    onDelete: "no action",
    onUpdate: "no action",
  }),
  user_id: integer("user_id"),
  answer: text("answer").notNull(),
  created_at: timestamp("created_at", { precision: 6 }).defaultNow(),
  updated_at: timestamp("updated_at", { precision: 6 }).defaultNow(),
});
