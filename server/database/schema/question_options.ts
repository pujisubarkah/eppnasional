// server/database/schema/provinsi.ts
import { pgTable,  integer, text  } from 'drizzle-orm/pg-core';

export const question_options = pgTable('question_options', {
  id: integer('id').primaryKey(),
  question_id: integer('question_id').notNull(),
  option_text: text('option_text').notNull(),
  option_value: integer('option_value').notNull(), // This will store sub_agenda_id
  ordering: integer('ordering').notNull().default(0),
});