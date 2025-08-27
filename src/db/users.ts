import { serial, varchar, integer } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';
import { roles } from './roles'; // Import dari roles

export const users = eppnSchema.table('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  roleId: integer('role_id').notNull().references(() => roles.id),
  nama: varchar('nama', { length: 100 }).notNull()
});
