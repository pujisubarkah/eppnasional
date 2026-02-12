// server/database/schema/provinsi.ts
import { serial, varchar } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';

export const tahun_pelatihan = eppnSchema.table('tahun_pelatihan', {
  id: serial('id').primaryKey(),
  tahun: varchar('tahun', { length: 100 }).notNull(),
 

});
