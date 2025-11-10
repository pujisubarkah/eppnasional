// db/schema/agency.ts
import { serial, varchar, integer } from 'drizzle-orm/pg-core';
import { pgSchema } from "drizzle-orm/pg-core";

export const eppnSchema = pgSchema("eppn");

export const instansi = eppnSchema.table("instansi", {
  id: serial("id").primaryKey(),
  agency_id: integer("agency_id"),
  agency_name: varchar("agency_name", { length: 255 }),
  agency_category_id: integer("agency_category_id"),
});
