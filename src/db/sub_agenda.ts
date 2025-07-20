import { pgTable, integer, text } from 'drizzle-orm/pg-core';
import { pelatihan } from './pelatihan';
import { agenda } from './agenda';

export const subAgenda = pgTable("sub_agenda", {
  id: integer("id").primaryKey(),
  pelatihan_id: integer("pelatihan_id").references(() => pelatihan.id),
  agenda_id: integer("agenda_id").references(() => agenda.id),
  name: text("name"),
});