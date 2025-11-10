import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  nip: varchar("nip", { length: 50 }),
  instansi: varchar("instansi", { length: 255 }),
  unit_kerja: varchar("unit_kerja", { length: 255 }),
  password: text("password"),
  role: varchar("role", { length: 50 }).default("user"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
