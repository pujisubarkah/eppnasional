<template>
  <form class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Informasi Profil Penilai Alumni</h2>
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <label class="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">Nama Alumni <span class="text-red-500">*</span></label>
        <input type="text" v-model="form.namaAlumni" required class="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan nama alumni" />
      </div>
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <label class="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">Jabatan Alumni Saat Ini <span class="text-red-500">*</span></label>
        <input type="text" v-model="form.jabatanAlumni" required class="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan jabatan alumni" />
      </div>
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <label class="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">Nama Lengkap Anda <span class="text-red-500">*</span></label>
        <input type="text" v-model="form.namaAnda" required class="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan nama Anda" />
      </div>
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <label class="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">Instansi <span class="text-red-500">*</span></label>
        <select v-model="form.instansi" required class="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
          <option value="" disabled>Pilih Instansi</option>
          <option v-for="item in instansiList" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <label class="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">Jabatan Anda <span class="text-red-500">*</span></label>
        <input type="text" v-model="form.jabatanAnda" required class="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan jabatan Anda" />
      </div>
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <label class="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">Hubungan dengan Alumni <span class="text-red-500">*</span></label>
        <select v-model="form.hubungan" required class="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
          <option value="" disabled>Pilih Hubungan</option>
          <option>Atasan</option>
          <option>Rekan Kerja</option>
          <option>Bawahan</option>
        </select>
      </div>
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <label class="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">Pelatihan yang diikuti Alumni <span class="text-red-500">*</span></label>
        <select v-model="form.pelatihan" required class="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
          <option value="" disabled>Pilih Pelatihan</option>
          <option>Pelatihan Kepemimpinan Nasional (PKN) Tingkat I</option>
          <option>Pelatihan Kepemimpinan Nasional (PKN) Tingkat II</option>
          <option>Pelatihan Kepemimpinan Administrator (PKA)</option>
          <option>Pelatihan Kepemimpinan Pengawas (PKP)</option>
          <option>Pelatihan Dasar CPNS</option>
        </select>
      </div>
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <label class="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">Nomor Telepon <span class="text-red-500">*</span></label>
        <input type="tel" v-model="form.telepon" required class="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan nomor telepon" />
      </div>
    </div>
    <div class="text-center pt-2">
      <button type="submit" class="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition">Simpan</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const instansiList = [
  'Kementerian',
  'Lembaga',
  'Pemerintah Daerah',
  'Badan Usaha',
  'Lainnya',
]
const form = ref({
  namaAlumni: '',
  jabatanAlumni: '',
  namaAnda: '',
  instansi: '',
  jabatanAnda: '',
  hubungan: '',
  pelatihan: '',
  telepon: '',
})
</script>

<style scoped>
</style>
