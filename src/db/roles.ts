import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const roles = pgTable('role', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
});
