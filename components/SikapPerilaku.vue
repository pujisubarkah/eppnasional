<template>
  <div class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Sikap & Perilaku Pasca Pelatihan</h2>
    <div class="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
      <span class="font-bold">Petunjuk:</span> Silahkan centang pada poin yang sesuai dengan pernyataan berikut.
    </div>
    <!-- 1. Pilihan perubahan sikap perilaku (radio) -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">1. Perubahan sikap perilaku dalam berkinerja yang dirasakan setelah mengikuti pelatihan:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="item in sikapList" :key="item" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="item" v-model="sikap" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ item }}</span>
        </label>
      </div>
    </div>

    <!-- 2. Pilih 3 dari 7+ opsi -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">2. Peningkatan kinerja yang dirasakan setelah mengikuti pelatihan <span class="text-[#2196F3]">(pilih 3)</span>:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="item in kinerjaList" :key="item" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="checkbox" :value="item" v-model="kinerja" :disabled="kinerja.length >= 3 && !kinerja.includes(item)" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ item }}</span>
        </label>
      </div>
      <div v-if="kinerja.length > 3" class="text-red-500 text-xs mt-2">Maksimal 3 pilihan.</div>
    </div>

    <!-- 3. Pilih salah satu nilai ekonomi -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">3. Berapa perkiraan nilai ekonomi yang dihasilkan dari proyek perubahan atau dari penerapan hasil pelatihan yang Anda ikuti?</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="item in ekonomiList" :key="item" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="item" v-model="ekonomi" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ item }}</span>
        </label>
      </div>
    </div>

    <!-- 4. Dampak keberlanjutan, pilih max 3, ada input lain -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">4. Dampak yang diperoleh dari keberlanjutan proyek perubahan pada skala nasional/daerah <span class="text-[#2196F3]">(pilih maksimal 3)</span>:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="item in dampakList" :key="item" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="checkbox" :value="item" v-model="dampak" :disabled="dampak.length >= 3 && !dampak.includes(item) && item !== 'Yang lain:'" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ item }}</span>
        </label>
      </div>
      <div v-if="dampak.includes('Yang lain:')" class="mt-2">
        <input type="text" v-model="dampakLain" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Tuliskan dampak lain..." />
      </div>
      <div v-if="dampak.length > 3" class="text-red-500 text-xs mt-2">Maksimal 3 pilihan.</div>
    </div>

    <!-- 5. Tema RB Tematik, radio -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">5. Apa tema Reformasi Birokrasi Tematik yang terkait dengan proyek perubahan Anda?</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="item in temaList" :key="item" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="item" v-model="tema" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ item }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'
const sikapList = [
  'Peningkatan Motivasi dalam Penyusunan kebijakan dan strategi etika dan integritas',
  'Peningkatan Percaya diri dalam mengelola kebijakan',
  'Peningkatan inovasi/kreatifitas dalam berkinerja',
  'Peningkatan kemampuan mengembangkan kepemimpinan kolaboratif',
]
const sikap = ref('')

const kinerjaList = [
  'Peningkatan Kinerja Individu',
  'Peningkatan Pengetahuan dan Keterampilan',
  'Mengelola Perubahan',
  'Peningkatan Kualitas Pelayanan Publik',
  'Peningkatan Kemampuan, Menggerakkan Stakeholders',
  'Peningkatan Jejaring Kerja',
  'Peningkatan Kepuasan Pelanggan',
]
const kinerja = ref([])

const ekonomiList = [
  'Kurang dari Rp.100.000.000,- (seratus juta rupiah)',
  'Rp100.000.000,- s.d. Rp1.000.000.000,-',
  'Rp1.000.000.001,- s.d. Rp10.000.000.000,-',
  'Lebih dari Rp10.000.000.000,- (sepuluh miliar rupiah)',
]
const ekonomi = ref('')

const dampakList = [
  'Meningkatkan Nilai Investasi',
  'Meningkatkan Penerimaan Negara/Pendapatan Asli Daerah (PAD)',
  'Meningkatkan Kesejahteraan Masyarakat',
  'Menurunkan Angka Kriminalitas',
  'Meningkatkan Kunjungan Wisatawan',
  'Menurunkan Angka Kemiskinan',
  'Meningkatkan Hasil Produksi Pertanian, Perikanan, Peternakan, Perkebunan',
  'Meningkatkan Kualitas Lingkungan Hidup',
  'Meningkatkan Kualitas Kesehatan Masyarakat',
  'Meningkatkan Inklusivitas Pendidikan',
  'Meningkatkan Keamanan Masyarakat',
  'Yang lain:',
]
const dampak = ref([])
const dampakLain = ref('')

const temaList = [
  'Pengentasan kemiskinan',
  'Peningkatan investasi',
  'Digitalisasi administrasi pemerintahan',
  'Percepatan prioritas aktual presiden',
]
const tema = ref('')
</script>
