// server/database/schema/provinsi.ts
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { provinsi } from './provinsi';

export const lemdik = pgTable('master_lemdik', {
  id: serial('id').primaryKey(),
  uuid: varchar('uuid', { length: 64 }),
  idsipka: integer('idsipka'),
  namalemdik: varchar('namalemdik', { length: 128 }),
  created_by: varchar('created_by', { length: 64 }),
  created: varchar('created', { length: 32 }),
  updatedon: varchar('updatedon', { length: 32 }),
  refbkn: varchar('refbkn', { length: 64 }),
  provinsi: integer('provinsi').references(() => provinsi.id),
  instansi: integer('instansi'),
});
