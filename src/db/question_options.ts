// server/database/schema/provinsi.ts
import { integer, text  } from 'drizzle-orm/pg-core';
import { eppnSchema } from './eppn-schema';

export const question_options = eppnSchema.table('question_options', {
  id: integer('id').primaryKey(),
  question_id: integer('question_id').notNull(),
  option_text: text('option_text').notNull(),
  option_value: integer('option_value').notNull(), // This will store sub_agenda_id
  ordering: integer('ordering').notNull().default(0),
});