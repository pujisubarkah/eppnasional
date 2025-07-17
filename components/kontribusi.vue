
<template>
  <div class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Kontribusi Pasca Pelatihan</h2>
    <div class="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
      <span class="font-bold">Petunjuk:</span> Pilih salah satu peran utama Anda dalam mendukung perwujudan Asta Cita setelah mengikuti pelatihan ini.
    </div>
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">1. Menurut Anda, setelah mengikuti pelatihan ini, bagaimana peran Anda dalam mendukung perwujudan Asta Cita?</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="item in astaCitaList" :key="item" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="item" v-model="selectedAstaCita" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ item }}</span>
        </label>
      </div>
    </div>
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">2. Hasil Pelatihan yang saya ikuti berkontribusi dalam peningkatan kinerja program prioritas presiden pada bidang <span class="text-[#2196F3]">(pilih 1)</span>:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="item in prioritasList" :key="item" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="item" v-model="selectedPrioritas" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ item }}</span>
        </label>
      </div>
      <div v-if="selectedPrioritas === 'Yang lain:'" class="mt-2">
        <input type="text" v-model="prioritasLain" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Tuliskan bidang lain..." />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const astaCitaList = [
  'Memperkuat ideologi Pancasila, demokrasi, dan hak asasi manusia',
  'Memantapkan sistem pertahanan keamanan negara dan mendorong kemandirian bangsa melalui swasembada pangan, energi, air, ekonomi syariah, ekonomi digital, ekonomi hijau, dan ekonomi biru',
  'Melanjutkan pengembangan infrastruktur dan meningkatkan lapangan kerja yang berkualitas, mendorong kewirausahaan, mengembangkan industri kreatif, serta mengembangkan agromaritim industri di sentra produksi melalui peran aktif koperasi',
  'Memperkuat pembangunan sumber daya manusia (SDM), sains, teknologi, pendidikan, kesehatan, prestasi olahraga, kesetaraan gender, serta penguatan peran perempuan, pemuda (generasi milenial dan generasi Z), dan penyandang disabilitas',
  'Melanjutkan hilirisasi dan mengembangkan industri berbasis sumber daya alam untuk meningkatkan nilai tambah di dalam negeri',
  'Membangun dari desa dan dari bawah untuk pertumbuhan ekonomi, pemerataan ekonomi, dan pemberantasan kemiskinan',
  'Memperkuat reformasi politik, hukum, dan birokrasi, serta memperkuat pencegahan dan pemberantasan korupsi, narkoba, judi, dan penyelundupan',
  'Memperkuat penyelarasan kehidupan yang harmonis dengan lingkungan alam dan budaya, serta peningkatan toleransi antarumat beragama untuk mencapai masyarakat yang adil dan makmur',
]
const selectedAstaCita = ref('')
const prioritasList = [
  'Mencapai Swasembada Pangan, Energi, dan Air',
  'Penyempurnaan Sistem Penerimaan negara',
  'Reformasi Politik, Hukum, dan Birokrasi',
  'Pencegahan dan Pemberantasan Korupsi',
  'Pemberantasan Kemiskinan',
  'Pencegahan dan Pemberantasan Narkoba',
  'Penjaminan tersedianya Pelayanan Kesehatan bagi Seluruh Rakyat',
  'Penguatan Pendidikan, Sains, dan Teknologi, serta Digitalisasi',
  'Penguatan Pertahanan dan Keamanan Negara dan Pemeliharaan Hubungan Internasional yang Kondusif',
  'Penguatan Kesetaraan Gender dan Perlindungan Hak Perempuan, Anak, serta Penyandang Disabilitas',
  'Menjamin Pelestarian Lingkungan Hidup',
  'Menjamin Ketersediaan Pupuk, Benih, dan Pestisida kepada Petani',
  'Menjamin Rumah Murah dan Sanitasi untuk Masyarakat Desa dan Rakyat yang Membutuhkan',
  'Melanjutkan Pemerataan Ekonomi, Penguatan UMKM, dan Pembangunan Ibu Kota Nusantara (IKN)',
  'Melanjutkan Hilirisasi dan Industrialisasi Berbasis Sumber Daya Alam dan Maritim untuk Membuka Lapangan Kerja',
  'Memastikan Kerukunan antar Umat Beragama, Kebebasan Beribadah, dan Perawatan Rumah Ibadah',
  'Pelestarian Seni Budaya, Peningkatan Ekonomi Kreatif, dan Peningkatan Prestasi Olahraga',
  'Yang lain:',
]

</script>
