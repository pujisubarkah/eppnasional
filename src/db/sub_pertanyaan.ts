// db/schema/sub_pertanyaan.ts

import { serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { question_options } from './question_options'; // pastikan ini mengarah ke schema yang benar
import { eppnSchema } from './eppn-schema';

export const sub_pertanyaan = eppnSchema.table('sub_question_option', {
  id: serial('id').primaryKey(),
  questionOptionId: integer('question_option_id').notNull().references(() => question_options.id),
  text: text('text'),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow(),
});
