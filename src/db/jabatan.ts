// server/database/schema/provinsi.ts
import { serial, varchar } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';

export const jabatan = eppnSchema.table('jabatan', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull(),
 

});
