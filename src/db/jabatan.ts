// server/database/schema/provinsi.ts
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const jabatan = pgTable('jabatan', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull(),
 

});
