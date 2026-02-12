import { serial, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';

export const jawaban = eppnSchema.table('answers_json', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  answers: jsonb('answers').notNull(), // ← ini penting!
  category_id: integer('category_id').notNull(), // Tambahkan kolom category_id
});
