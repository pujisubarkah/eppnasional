import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { provinsi } from './provinsi'; // pastikan kamu punya definisinya

export const alumni = pgTable('informasi_profile', {
  id: serial('id').primaryKey(),
  namaAlumni: varchar('nama_alumni', { length: 255 }),
  nipNrpNik: varchar('nip_nrp_nik', { length: 100 }),
  instansiKategoriId: integer('instansi_kategori_id'),
  instansiId: integer('instansi_id'),
  domisiliId: integer('domisili_id').references(() => provinsi.id), // ini menambahkan constraint FK di level Drizzle
  jabatanId: integer('jabatan_id'),
  pelatihanId: integer('pelatihan_id'),
  tahunPelatihanId: integer('tahun_pelatihan_id'),
  lemdik: varchar('lemdik', { length: 255 }),
  handphone: varchar('telepon', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow(),
  name: varchar('nama', { length: 255 }),
  hubungan: varchar('hubungan', { length: 100 }),
  jabatan_alumni: varchar('jabatan_alumni', { length: 100 }),
  
});
