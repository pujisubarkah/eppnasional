// schema/agenda.ts
import { integer, text } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';

export const agenda = eppnSchema.table("agendas", {
  id: integer("id").primaryKey(),
  name: text("name"),
});