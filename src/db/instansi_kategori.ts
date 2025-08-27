// db/agency_category.ts
import { serial, varchar } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';

export const instansi_kategori = eppnSchema.table('instansi_kategori', {
  id: serial('id').primaryKey(),
  name: varchar('kat_instansi', { length: 255 }).notNull(),
});
