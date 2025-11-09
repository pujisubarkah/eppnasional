import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { pgSchema } from "drizzle-orm/pg-core";

export const eppnSchema = pgSchema("eppn");

export const categories = eppnSchema.table("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  order: integer("order"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});