<template>
  <section class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl md:text-4xl font-extrabold mb-8 text-[#2196F3] drop-shadow flex items-center gap-2">
      <svg class="w-8 h-8 text-[#1976D2]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>
      Ringkasan & Story Hasil Evaluasi
    </h1>

    <!-- Highlight Insight -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white/80 rounded-xl shadow p-6 flex flex-col items-center">
        <span class="text-4xl font-bold text-[#1976D2] mb-2">82%</span>
        <div class="text-gray-600 text-center">Responden merasa pelatihan sangat bermanfaat untuk pekerjaan mereka</div>
      </div>
      <div class="bg-white/80 rounded-xl shadow p-6 flex flex-col items-center">
        <span class="text-4xl font-bold text-[#1976D2] mb-2">3 Besar Kontribusi</span>
        <ul class="text-gray-600 text-center list-disc list-inside">
          <li>Penguatan SDM</li>
          <li>Inovasi Layanan</li>
          <li>Kolaborasi Tim</li>
        </ul>
      </div>
      <div class="bg-white/80 rounded-xl shadow p-6 flex flex-col items-center">
        <span class="text-4xl font-bold text-[#1976D2] mb-2">76%</span>
        <div class="text-gray-600 text-center">Mengaku terjadi perubahan sikap & perilaku positif setelah pelatihan</div>
      </div>
    </div>

    <!-- Story Section -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-8">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2]">Cerita Perubahan Nyata</h2>
      <div class="space-y-6">
        <div class="border-l-4 border-[#2196F3] pl-4 py-2 bg-blue-50/50 rounded">
          <p class="italic text-gray-700">"Setelah pelatihan, saya berhasil menginisiasi program digitalisasi arsip di instansi kami. Proses kerja jadi lebih efisien dan transparan."</p>
          <div class="text-sm text-gray-500 mt-1">- Rina, ASN Kementerian Pendidikan</div>
        </div>
        <div class="border-l-4 border-[#2196F3] pl-4 py-2 bg-blue-50/50 rounded">
          <p class="italic text-gray-700">"Tim saya kini lebih kompak dan inovatif. Banyak ide baru muncul setelah kami mengikuti pelatihan bersama."</p>
          <div class="text-sm text-gray-500 mt-1">- Budi, Kepala Bagian</div>
        </div>
      </div>
    </div>

    <!-- Rekomendasi Section -->
    <div class="bg-white/80 rounded-xl shadow p-8">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2]">Rekomendasi & Kesimpulan</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Perlu replikasi pelatihan ke lebih banyak unit kerja.</li>
        <li>Fokus pada penguatan soft skill dan kolaborasi tim.</li>
        <li>Monitoring tindak lanjut hasil pelatihan secara berkala.</li>
      </ul>
      <ul>
        <li v-for="(item, idx) in rekomendasi.slice(0,3)" :key="idx">
          <span class="font-semibold">{{ item.tanggal }}:</span> {{ item.teks }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
// Data dummy, ganti dengan data hasil nyata jika sudah ada
const rekomendasi = [
  { tanggal: '2025-07-17', teks: 'Perlu replikasi pelatihan ke lebih banyak unit kerja.' },
  { tanggal: '2025-07-16', teks: 'Fokus pada penguatan soft skill dan kolaborasi tim.' },
  { tanggal: '2025-07-15', teks: 'Monitoring tindak lanjut hasil pelatihan secara berkala.' },
  { tanggal: '2025-07-14', teks: 'Dorong inovasi digitalisasi di setiap unit.' },
]
</script>

<style scoped>
</style>
