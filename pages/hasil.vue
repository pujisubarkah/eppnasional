<template>
  <section class="max-w-6xl mx-auto py-12 px-4">
    <!-- Summary Card -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
        <Users2 class="w-8 h-8 text-[#0D47A1] mb-2" />
        <div class="text-2xl font-bold text-[#0D47A1]">1.234</div>
        <div class="text-gray-600 text-sm">Total Responden</div>
      </div>
      <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
        <PieChart class="w-8 h-8 text-[#0D47A1] mb-2" />
        <div class="text-2xl font-bold text-[#0D47A1]">56</div>
        <div class="text-gray-600 text-sm">Total Instansi</div>
      </div>
      <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
        <BarChart3 class="w-8 h-8 text-[#0D47A1] mb-2" />
        <div class="text-2xl font-bold text-[#0D47A1]">12</div>
        <div class="text-gray-600 text-sm">Total Pelatihan</div>
      </div>
    </div>
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
      <!-- Distribusi Instansi -->
      <div class="mb-8">
        <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
          <PieChart class="w-8 h-8 text-[#0D47A1] mb-2" />
          <span class="text-gray-600 font-semibold mb-2">Distribusi Instansi</span>
          <VueApexCharts width='220' height='220' type='pie' :options="chartOptions" :series="chartSeries" />
        </div>
      </div>
      <!-- Distribusi Domisili (Peta) -->
      <div class="mb-8">
        <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
          <PieChart class="w-8 h-8 text-[#0D47A1] mb-2" />
          <span class="text-gray-600 font-semibold mb-2">Distribusi Domisili</span>
          <img src="/peta-indonesia.svg" alt="Peta Indonesia" class="w-96 h-40 object-contain mb-2" />
          <div class="flex flex-wrap gap-2 text-xs text-gray-500 justify-center">
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-[#2196F3]"></span>Sumatera</span>
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-[#4CAF50]"></span>Jawa</span>
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-[#FFC107]"></span>Bali/NTT/NTB</span>
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-[#F44336]"></span>Kalimantan</span>
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-[#9C27B0]"></span>Sulawesi</span>
            <span class="flex items-center gap-1"><span class="inline-block w-3 h-3 rounded bg-[#00BCD4]"></span>Papua</span>
          </div>
        </div>
      </div>
      <!-- Distribusi Jabatan -->
      <div class="mb-8">
        <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
          <PieChart class="w-8 h-8 text-[#0D47A1] mb-2" />
          <span class="text-gray-600 font-semibold mb-2">Distribusi Jabatan</span>
          <VueApexCharts width='220' height='220' type='pie' :options="jabatanOptions" :series="jabatanSeries" />
          <div class="flex flex-wrap gap-2 mt-2 text-xs text-gray-500 justify-center">
            <span class="px-2 py-1 rounded bg-gray-100">Struktural</span>
            <span class="px-2 py-1 rounded bg-gray-100">Fungsional</span>
            <span class="px-2 py-1 rounded bg-gray-100">Pelaksana</span>
            <span class="px-2 py-1 rounded bg-gray-100">Lainnya</span>
          </div>
        </div>
      </div>
      <!-- Distribusi Pelatihan -->
      <div class="mb-8">
        <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
          <PieChart class="w-8 h-8 text-[#0D47A1] mb-2" />
          <span class="text-gray-600 font-semibold mb-2">Distribusi Pelatihan</span>
          <VueApexCharts width='220' height='220' type='pie' :options="chartOptions" :series="chartSeries" />
        </div>
      </div>
    </div>

    <!-- 2. Evaluasi Pasca Pelatihan Nasional -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <TrendingUp class="w-6 h-6 text-[#1976D2]" />
        Evaluasi Pasca Pelatihan Nasional
      </h2>
      <div class="h-64 flex items-center justify-center">
        <VueApexCharts width='480' height='260' type='bar' :options="barOptions" :series="barSeries" />
      </div>
    </div>

    <!-- 3. Dukungan Lingkungan -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <CheckCircle2 class="w-6 h-6 text-[#1976D2]" />
        Dukungan Lingkungan
      </h2>
      <div class="h-40 flex items-center justify-center">
        <VueApexCharts width='320' height='140' type='bar' :options="barOptions" :series="barSeries" />
      </div>
    </div>

    <!-- 4. Perubahan Sikap Perilaku dan Peningkatan Kinerja -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <BarChart3 class="w-6 h-6 text-[#1976D2]" />
        Perubahan Sikap Perilaku & Peningkatan Kinerja
      </h2>
      <div class="h-40 flex items-center justify-center">
        <VueApexCharts width='320' height='140' type='bar' :options="barOptions" :series="barSeries" />
      </div>
    </div>

    <!-- 5. Kesesuaian Waktu dan Manfaat -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <Clock class="w-6 h-6 text-[#1976D2]" />
        Kesesuaian Waktu & Manfaat
      </h2>
      <div class="h-40 flex items-center justify-center">
        <VueApexCharts width='320' height='140' type='bar' :options="barOptions" :series="barSeries" />
      </div>
    </div>

    <!-- 6. Kontribusi pada Prioritas Nasional -->
    <div class="bg-white/80 rounded-xl shadow p-8 mb-10">
      <h2 class="text-xl font-bold mb-4 text-[#1976D2] flex items-center gap-2">
        <Star class="w-6 h-6 text-[#1976D2]" />
        Kontribusi pada Prioritas Nasional
      </h2>
      <div class="h-40 flex items-center justify-center">
        <VueApexCharts width='320' height='140' type='bar' :options="barOptions" :series="barSeries" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { BarChart3, Users2, TrendingUp, CheckCircle2, PieChart } from 'lucide-vue-next'

import { ref } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

const chartOptions = ref({
  chart: { type: 'pie' },
  labels: ['A', 'B', 'C', 'D'],
  legend: { show: false },
  dataLabels: { enabled: false },
})
const chartSeries = ref([44, 33, 12, 11])

const jabatanOptions = ref({
  chart: { type: 'pie' },
  labels: ['Struktural', 'Fungsional', 'Pelaksana', 'Lainnya'],
  legend: { show: false },
  dataLabels: { enabled: false },
})
const jabatanSeries = ref([40, 30, 20, 10])

const barOptions = ref({
  chart: { type: 'bar' },
  xaxis: { categories: ['A', 'B', 'C', 'D'] },
  dataLabels: { enabled: false },
})
const barSeries = ref([{ name: 'Nilai', data: [30, 40, 25, 50] }])
</script>
