// db/agency_category.ts
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const instansi_kategori = pgTable('instansi_kategori', {
  id: serial('id').primaryKey(),
  name: varchar('kat_instansi', { length: 255 }).notNull(),
});
