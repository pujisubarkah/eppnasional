import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { roles } from './roles'; // Import dari roles

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  roleId: integer('role_id').notNull().references(() => roles.id),
  nama: varchar('nama', { length: 100 }).notNull()
});
