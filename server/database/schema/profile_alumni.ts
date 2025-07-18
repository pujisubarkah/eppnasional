import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const alumni = pgTable('informasi_profile', {
  id: serial('id').primaryKey(),
  namaAlumni: varchar('nama_alumni', { length: 255 }),
  nipNrpNik: varchar('nip_nrp_nik', { length: 100 }),
  instansiKategoriId: integer('instansi_kategori_id'), // ini diperbaiki
  instansiId: integer('instansi_id'),
  domisiliId: integer('domisili_id'),
  jabatanId: integer('jabatan_id'),
  pelatihanId: integer('pelatihan_id'),
  tahunPelatihanId: integer('tahun_pelatihan_id'),
  lemdik: varchar('lemdik', { length: 255 }),
  handphone: varchar('telepon', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow(),
});
