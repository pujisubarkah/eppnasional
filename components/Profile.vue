<template>
  <div class="max-w-4xl mx-auto mt-6 mb-8 bg-white/80 rounded-2xl shadow p-6 border border-[#B3E5FC]">
    <div class="text-xl font-bold text-[#1976D2] mb-2 text-center">Evaluasi Pascapelatihan Nasional - Alumni <span class="text-base font-normal">(Draf)</span></div>
    <div class="text-gray-700 text-base leading-relaxed mb-2">
      Sebagai bagian dari upaya peningkatan mutu pelatihan, Direktorat Penjaminan Mutu Pengembangan Kapasitas Lembaga Administrasi Negara menyelenggarakan Evaluasi Pascapelatihan Nasional untuk mengidentifikasi hasil pelatihan, khususnya pada level perilaku (behaviour) dan dampak yang ditimbulkan dari pelaksanaan pelatihan.
      <br><br>
      Formulir ini ditujukan bagi Alumni Pelatihan Tahun 2021-2024 pada:
      <ol class="list-decimal list-inside ml-4 my-2">
        <li>Pelatihan Kepemimpinan Nasional Tingkat I</li>
        <li>Pelatihan Kepemimpinan Nasional Tingkat II</li>
        <li>Pelatihan Kepemimpinan Administrator</li>
        <li>Pelatihan Kepemimpinan Pengawas</li>
        <li>Pelatihan Dasar CPNS</li>
      </ol>
      Kami mohon kesediaan Bapak/Ibu untuk mengisi formulir ini secara objektif. Masukan Anda sangat berharga dalam mendukung perbaikan berkelanjutan pelatihan ASN. Data dan informasi pribadi yang Bapak/Ibu sampaikan akan dijaga kerahasiaannya, digunakan hanya untuk keperluan evaluasi, dan tidak akan disebarluaskan tanpa izin.
      <br><br>
      <span class="font-semibold">Waktu pengisian membutuhkan 3 - 5 menit.</span>
      <br><span class="italic text-sm">Catatan: Jika Anda pernah mengikuti lebih dari satu pelatihan, silahkan gunakan informasi Pelatihan terakhir Anda</span>
    </div>
  </div>
  <form class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Profil Responden</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Nama Lengkap</label></div>
      <div><input type="text" v-model="form.nama" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan nama lengkap" /></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">NIP/NRP/NIK</label></div>
      <div><input type="text" v-model="form.nip" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan NIP/NRP/NIK" /></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Instansi</label></div>
      <div><select v-model="form.instansi" class="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
        <option value="" disabled>Pilih Instansi</option>
        <option v-for="item in instansiList" :key="item" :value="item">{{ item }}</option>
      </select></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Jenis Instansi</label></div>
      <div><input type="text" v-model="form.jenisInstansi" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" :placeholder="form.instansi ? 'Jenis dari ' + form.instansi : 'Pilih instansi dulu'" :readonly="!form.instansi" /></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Domisili Instansi</label></div>
      <div><select v-model="form.domisili" class="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
        <option value="" disabled>Pilih Domisili</option>
        <option v-for="item in domisiliList" :key="item" :value="item">{{ item }}</option>
      </select></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Jabatan</label></div>
      <div><input type="text" v-model="form.jabatan" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan jabatan" /></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Nama Pelatihan</label></div>
      <div><select v-model="form.pelatihan" class="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
        <option value="" disabled>Pilih Nama Pelatihan</option>
        <option v-for="item in pelatihanList" :key="item" :value="item">{{ item }}</option>
      </select></div>
    </div>
    <div class="text-center pt-2">
      <button type="submit" class="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition">Simpan</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const instansiList = [
  'Kementerian',
  'Lembaga',
  'Pemerintah Daerah',
  'Badan Usaha',
  'Lainnya',
]
const domisiliList = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Sumatera Utara', 'Sulawesi Selatan', 'Kalimantan Timur', 'Papua', 'Lainnya'
]
const pelatihanList = [
  'Pelatihan Dasar CPNS',
  'Pelatihan Kepemimpinan',
  'Pelatihan Teknis',
  'Pelatihan Fungsional',
  'Pelatihan Lainnya',
]

const form = ref({
  nama: '',
  nip: '',
  instansi: '',
  jenisInstansi: '',
  domisili: '',
  jabatan: '',
  pelatihan: '',
})

// Otomatis update jenisInstansi sesuai instansi
watch(() => form.value.instansi, (val) => {
  if (val === 'Kementerian') form.value.jenisInstansi = 'Pusat'
  else if (val === 'Pemerintah Daerah') form.value.jenisInstansi = 'Daerah'
  else if (val) form.value.jenisInstansi = 'Lainnya'
  else form.value.jenisInstansi = ''
})
</script>
