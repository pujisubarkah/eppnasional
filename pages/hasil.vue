
<template>
  <section class="max-w-6xl mx-auto py-12 px-4">
    <h1 class="text-3xl md:text-4xl font-extrabold mb-8 text-[#2196F3] drop-shadow flex items-center gap-2">
      <BarChart3 class="w-8 h-8 text-[#1976D2]" />
      Hasil Evaluasi Pasca Pelatihan
    </h1>

    <!-- 1. Profil Responden -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <Users2 class="w-6 h-6 text-[#1976D2]" />
        Profil Responden
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col items-center">
          <PieChart class="w-8 h-8 text-[#2196F3] mb-2" />
          <span class="text-gray-600">Distribusi Instansi</span>
          <div class="h-32 flex items-center justify-center text-gray-400">Chart Instansi</div>
        </div>
        <div class="flex flex-col items-center">
          <PieChart class="w-8 h-8 text-[#2196F3] mb-2" />
          <span class="text-gray-600">Distribusi Domisili</span>
          <div class="h-32 flex items-center justify-center text-gray-400">Chart Domisili</div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div class="flex flex-col items-center">
          <PieChart class="w-8 h-8 text-[#2196F3] mb-2" />
          <span class="text-gray-600">Distribusi Jabatan</span>
          <div class="h-32 flex items-center justify-center text-gray-400">Chart Jabatan</div>
        </div>
        <div class="flex flex-col items-center">
          <PieChart class="w-8 h-8 text-[#2196F3] mb-2" />
          <span class="text-gray-600">Distribusi Pelatihan</span>
          <div class="h-32 flex items-center justify-center text-gray-400">Chart Pelatihan</div>
        </div>
      </div>
    </div>

    <!-- 2. Evaluasi Pasca Pelatihan Nasional -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <TrendingUp class="w-6 h-6 text-[#1976D2]" />
        Evaluasi Pasca Pelatihan Nasional
      </h2>
      <div class="h-40 flex items-center justify-center text-gray-400">Chart/Analitik Evaluasi Pasca Pelatihan</div>
    </div>

    <!-- 3. Dukungan Lingkungan -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <CheckCircle2 class="w-6 h-6 text-[#1976D2]" />
        Dukungan Lingkungan
      </h2>
      <div class="h-40 flex items-center justify-center text-gray-400">Chart Dukungan Lingkungan (Likert)</div>
    </div>

    <!-- 4. Perubahan Sikap Perilaku dan Peningkatan Kinerja -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <BarChart3 class="w-6 h-6 text-[#1976D2]" />
        Perubahan Sikap Perilaku & Peningkatan Kinerja
      </h2>
      <div class="h-40 flex items-center justify-center text-gray-400">Chart Sikap/Kinerja/Dampak/Tematik</div>
    </div>

    <!-- 5. Kesesuaian Waktu dan Manfaat -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <Clock class="w-6 h-6 text-[#1976D2]" />
        Kesesuaian Waktu & Manfaat
      </h2>
      <div class="h-40 flex items-center justify-center text-gray-400">Chart Kesesuaian Waktu & Manfaat</div>
    </div>

    <!-- 6. Kontribusi pada Prioritas Nasional -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <Star class="w-6 h-6 text-[#1976D2]" />
        Kontribusi pada Prioritas Nasional
      </h2>
      <div class="h-40 flex items-center justify-center text-gray-400">Chart Kontribusi AstaCita & Prioritas</div>
    </div>
  </section>
</template>

<script setup>
import { BarChart3, Users2, TrendingUp, CheckCircle2, PieChart } from 'lucide-vue-next'
</script>
