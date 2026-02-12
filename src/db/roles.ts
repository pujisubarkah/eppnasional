import { serial, varchar } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';

export const roles = eppnSchema.table('role', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
});
