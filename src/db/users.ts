import { serial, varchar, text } from "drizzle-orm/pg-core";
import { eppnSchema } from './eppn-schema';

export const users = eppnSchema.table("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password"),
  nama: varchar("nama", { length: 255 }).notNull(),
});
