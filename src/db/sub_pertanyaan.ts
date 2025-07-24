// db/schema/sub_pertanyaan.ts

import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { question_options } from './question_options'; // pastikan ini mengarah ke schema yang benar

export const sub_pertanyaan = pgTable('sub_question_option', {
  id: serial('id').primaryKey(),
  questionOptionId: integer('question_option_id').notNull().references(() => question_options.id),
  text: text('text'),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow(),
});
