import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';


export const alumni = pgTable('informasi_profile', {
  id: serial('id').primaryKey(),
  name: varchar('nama', { length: 255 }),
  jenisinstansi: integer('instansi_kategori_id'),
  instansiId: integer('instansi_id'),
  jabatanId: integer('jabatan_id'),
  namaAlumni: varchar('nama_alumni', { length: 255 }),
  hubungan: varchar('hubungan', { length: 100 }),
  jabatan_alumni: varchar('jabatan_alumni', { length: 100 }),
  instansiKategoriId: integer('instansi_kategori_id'),
  pelatihanId: integer('pelatihan_id'),
  createdAt: timestamp('created_at').defaultNow(),
});
