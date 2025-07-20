"use client";

import { useState, useEffect } from "react";

const instansiList = [
  "Kementerian",
  "Lembaga",
  "Pemerintah Daerah",
  "Badan Usaha",
  "Lainnya",
];

export default function ReviewProfilePage() {
  const [jabatanList, setJabatanList] = useState<{ id: string; nama: string }[]>([]);
  const [form, setForm] = useState({
    namaAlumni: "",
    jabatanAlumni: "",
    namaAnda: "",
    instansi: "",
    jabatanAnda: "",
    hubungan: "",
    pelatihan: "",
    telepon: "",
  });

  useEffect(() => {
    fetch("/api/jabatan")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setJabatanList(data))
      .catch(() => setJabatanList([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit form logic
    alert("Data berhasil disimpan (dummy)");
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto mt-6 mb-8 bg-white/80 rounded-2xl shadow p-6 border border-[#B3E5FC]">
        <div className="text-xl font-bold text-[#1976D2] mb-2 text-center">
          Evaluasi Pasca Pelatihan Nasional - Atasan/Rekan Kerja/Bawahan <span className="text-base font-normal">(Draf)</span>
        </div>
        <div className="text-gray-700 text-base leading-relaxed mb-2">
          Sebagai bagian dari upaya peningkatan mutu pelatihan, Direktorat Penjaminan Mutu Pengembangan Kapasitas Lembaga Administrasi Negara menyelenggarakan Evaluasi Pascapelatihan Nasional untuk mengidentifikasi hasil pelatihan, khususnya pada level perilaku (behaviour) dan dampak yang ditimbulkan dari pelaksanaan pelatihan.
          <br /><br />
          Formulir ini ditujukan bagi Alumni Pelatihan Tahun 2021-2024 pada:
          <ol className="list-decimal list-inside ml-4 my-2">
            <li>Pelatihan Kepemimpinan Nasional Tingkat I</li>
            <li>Pelatihan Kepemimpinan Nasional Tingkat II</li>
            <li>Pelatihan Kepemimpinan Administrator</li>
            <li>Pelatihan Kepemimpinan Pengawas</li>
            <li>Pelatihan Dasar CPNS</li>
          </ol>
          Kami mohon kesediaan Bapak/Ibu untuk mengisi formulir ini secara objektif. Masukan Anda sangat berharga dalam mendukung perbaikan berkelanjutan pelatihan ASN. Data dan informasi pribadi yang Bapak/Ibu sampaikan akan dijaga kerahasiaannya, digunakan hanya untuk keperluan evaluasi, dan tidak akan disebarluaskan tanpa izin.
          <br /><br />
          <span className="font-semibold">Waktu pengisian membutuhkan 3 - 5 menit.</span>
          <br /><span className="italic text-sm">Catatan: Jika Anda pernah mengikuti lebih dari satu pelatihan, silahkan gunakan informasi Pelatihan terakhir Anda</span>
        </div>
      </div>
      <form
        className="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
          Informasi Profil Penilai Alumni
        </h2>
        <div className="space-y-6">
          {/* Nama Alumni */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
              Nama Alumni <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="namaAlumni"
              value={form.namaAlumni}
              onChange={handleChange}
              required
              className="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
              placeholder="Masukkan nama alumni"
            />
          </div>
          {/* Jabatan Alumni Saat Ini */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
              Jabatan Alumni Saat Ini <span className="text-red-500">*</span>
            </label>
            <select
              name="jabatanAlumni"
              value={form.jabatanAlumni}
              onChange={handleChange}
              required
              className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
            >
              <option value="" disabled>Pilih Jabatan Alumni</option>
              {jabatanList.map((item) => (
                <option key={item.id} value={item.nama}>{item.nama}</option>
              ))}
            </select>
          </div>
          {/* Nama Lengkap Anda */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
              Nama Lengkap Anda <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="namaAnda"
              value={form.namaAnda}
              onChange={handleChange}
              required
              className="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
              placeholder="Masukkan nama Anda"
            />
          </div>
          {/* Instansi */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
              Instansi <span className="text-red-500">*</span>
            </label>
            <select
              name="instansi"
              value={form.instansi}
              onChange={handleChange}
              required
              className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
            >
              <option value="" disabled>Pilih Instansi</option>
              {instansiList.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          {/* Jabatan Anda */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
              Jabatan Anda <span className="text-red-500">*</span>
            </label>
            <select
              name="jabatanAnda"
              value={form.jabatanAnda}
              onChange={handleChange}
              required
              className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
            >
              <option value="" disabled>Pilih Jabatan Anda</option>
              {jabatanList.map((item) => (
                <option key={item.id} value={item.nama}>{item.nama}</option>
              ))}
            </select>
          </div>
          {/* Hubungan dengan Alumni */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
              Hubungan dengan Alumni <span className="text-red-500">*</span>
            </label>
            <select
              name="hubungan"
              value={form.hubungan}
              onChange={handleChange}
              required
              className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
            >
              <option value="" disabled>Pilih Hubungan</option>
              <option>Atasan</option>
              <option>Rekan Kerja</option>
              <option>Bawahan</option>
            </select>
          </div>
          {/* Pelatihan yang diikuti Alumni */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
              Pelatihan yang diikuti Alumni <span className="text-red-500">*</span>
            </label>
            <select
              name="pelatihan"
              value={form.pelatihan}
              onChange={handleChange}
              required
              className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
            >
              <option value="" disabled>Pilih Pelatihan</option>
              <option>Pelatihan Kepemimpinan Nasional (PKN) Tingkat I</option>
              <option>Pelatihan Kepemimpinan Nasional (PKN) Tingkat II</option>
              <option>Pelatihan Kepemimpinan Administrator (PKA)</option>
              <option>Pelatihan Kepemimpinan Pengawas (PKP)</option>
              <option>Pelatihan Dasar CPNS</option>
            </select>
          </div>
          {/* Nomor Telepon */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="telepon"
              value={form.telepon}
              onChange={handleChange}
              required
              className="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
              placeholder="Masukkan nomor telepon"
            />
          </div>
        </div>
        <div className="text-center pt-2">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}