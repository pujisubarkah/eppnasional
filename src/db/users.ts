import { serial, varchar, integer } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';
import { roles } from './roles'; // Import dari roles
import { lemdik } from './master_lemdik'; // Import dari master_lemdik

export const users = eppnSchema.table('users', {
  id: serial('id').primaryKey(),
  username: varchar('username').notNull(),
  password: varchar('password').notNull(),
  roleId: integer('role_id').notNull().references(() => roles.id),
  nama: varchar('nama').notNull(),
  lemdikId: integer('lemdik_id').references(() => lemdik.id)
});
