
<template>
  <section class="max-w-3xl mx-auto py-16 px-4">
    <div class="bg-white/80 rounded-xl shadow-lg p-8">
      <div class="flex items-center gap-3 mb-4">
        <Award class="w-9 h-9 text-[#2196F3] drop-shadow" />
        <h1 class="text-3xl md:text-4xl font-extrabold text-[#2196F3] drop-shadow">Tentang EPP Nasional</h1>
      </div>
      <p class="text-lg text-gray-700 leading-relaxed mb-4">
        <span class="font-semibold text-[#1976D2]">Direktorat Penjaminan Mutu Pengembangan Kapasitas</span> adalah bagian integral dari Lembaga Administrasi Negara (LAN) yang mengemban tanggung jawab strategis dalam menjamin mutu pelatihan bagi Aparatur Sipil Negara (ASN). Melalui pendekatan evaluatif, pemantauan sistematis, serta pengembangan yang berkesinambungan, direktorat ini berkomitmen memastikan bahwa setiap program pelatihan tidak hanya berhenti pada transfer pengetahuan di ruang kelas, tetapi benar-benar memberikan dampak yang signifikan terhadap peningkatan kinerja individu maupun organisasi.
      </p>
      <div class="flex items-start gap-3 mb-4">
        <BarChart3 class="w-7 h-7 text-[#1976D2] mt-1" />
        <p class="text-lg text-gray-700 leading-relaxed">
          Sebagai wujud komitmen tersebut, kami menginisiasi <span class="font-semibold text-[#1976D2]">Evaluasi Pasca Pelatihan (EPP) Nasional</span> – sebuah upaya mendalam untuk mendengarkan kembali suara para alumni pelatihan, menilai sejauh mana hasil pelatihan diimplementasikan dalam lingkungan kerja, serta mengidentifikasi peluang peningkatan yang lebih baik ke depannya.
        </p>
      </div>
      <div class="flex items-start gap-3 mb-2">
        <Users2 class="w-7 h-7 text-[#1976D2] mt-1" />
        <p class="text-lg text-gray-700 leading-relaxed">
          Pada tahun 2025, EPP Nasional secara khusus menyasar alumni pelatihan yang mengikuti program LAN pada tahun 2021 hingga 2024. Evaluasi ini mencakup berbagai aspek penting seperti perubahan kompetensi individu, penerapan hasil pelatihan di tempat kerja, dukungan organisasi, serta dampak terhadap pencapaian kinerja unit kerja. Hasil dari evaluasi ini akan menjadi landasan berharga dalam memperkuat siklus pembelajaran dan merancang pelatihan ASN yang lebih adaptif, relevan, dan berdampak.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Award, BarChart3, Users2 } from 'lucide-vue-next'
</script>
