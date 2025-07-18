// schema/agenda.ts
import { pgTable, integer } from 'drizzle-orm/pg-core';
import { pelatihan } from './pelatihan';
import { agenda } from './agenda';

export const pelatihanAgenda = pgTable("pelatihan_agenda", {
  id: integer("id").primaryKey(),
  pelatihan_id: integer("pelatihan_id").references(() => pelatihan.id),
  agenda_id: integer("agenda_id").references(() => agenda.id),
});