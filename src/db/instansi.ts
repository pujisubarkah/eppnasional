// db/schema/agency.ts
import { pgTable, bigint, varchar, integer } from 'drizzle-orm/pg-core';
import { instansi_kategori } from './instansi_kategori';

export const instansi = pgTable('instansi', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  agency_name: varchar('agency_name', { length: 255 }).notNull(),
  agency_category_id: integer('agency_category_id')
    .references(() => instansi_kategori.id)
    .notNull(),
});
