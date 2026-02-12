// server/database/schema/provinsi.ts
import { serial, varchar } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';

export const pelatihan = eppnSchema.table('pelatihan', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull(),
 

});
