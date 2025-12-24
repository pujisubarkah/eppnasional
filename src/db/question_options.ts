// server/database/schema/question_options.ts
import { serial, integer, varchar, text } from "drizzle-orm/pg-core";
import { pgSchema } from "drizzle-orm/pg-core";

export const eppnSchema = pgSchema("eppn");

export const question_options = eppnSchema.table("question_options", {
  id: serial("id").primaryKey(),
  question_id: integer("question_id").notNull(),
  option_text: varchar("option_text", { length: 255 }).notNull(),
  option_value: text("option_value"),
  ordering: integer("ordering"),
});