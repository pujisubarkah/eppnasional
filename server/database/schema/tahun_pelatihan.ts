// server/database/schema/provinsi.ts
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tahun_pelatihan = pgTable('tahun_pelatihan', {
  id: serial('id').primaryKey(),
  tahun: varchar('tahun', { length: 100 }).notNull(),
 

});
