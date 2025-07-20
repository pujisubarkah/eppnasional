// server/database/schema/provinsi.ts
import { pgTable, serial, varchar, integer, text } from 'drizzle-orm/pg-core';

export const provinsi = pgTable('provinsi', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull(),
  svg_path: text('svg_path'),
  id_provinsi: integer('id_provinsi'),
});
