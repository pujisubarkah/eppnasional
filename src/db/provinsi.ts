// server/database/schema/provinsi.ts
import { serial, varchar, integer, text } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';

export const provinsi = eppnSchema.table('provinsi', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull(),
  svg_path: text('svg_path'),
  id_provinsi: integer('id_provinsi'),
});
