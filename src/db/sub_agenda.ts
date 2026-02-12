import { integer, text } from 'drizzle-orm/pg-core';
import { pelatihan } from './pelatihan';
import { agenda } from './agenda';
import { eppnSchema } from './eppn-schema';

export const subAgenda = eppnSchema.table("sub_agenda", {
  id: integer("id").primaryKey(),
  pelatihan_id: integer("pelatihan_id").references(() => pelatihan.id),
  agenda_id: integer("agenda_id").references(() => agenda.id),
  name: text("name"),
});