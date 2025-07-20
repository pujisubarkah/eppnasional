// schema/agenda.ts
import { pgTable, integer, text } from 'drizzle-orm/pg-core';

export const agenda = pgTable("agendas", {
  id: integer("id").primaryKey(),
  name: text("name"),
});