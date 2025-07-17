<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
    <!-- Bar Chart Instansi -->
    <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
      <span class="text-gray-600 font-semibold mb-2">Distribusi Instansi</span>
      <Bar :data="instansiData" :options="{ responsive: true, plugins: { legend: { display: false } } }" />
    </div>
    <!-- Pie Chart Jenis Instansi -->
    <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
      <span class="text-gray-600 font-semibold mb-2">Distribusi Jenis Instansi</span>
      <Pie :data="jenisInstansiData" :options="{ responsive: true }" />
    </div>
    <!-- Bar Chart Nama Pelatihan -->
    <div class="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6 md:col-span-2">
      <span class="text-gray-600 font-semibold mb-2">Distribusi Nama Pelatihan</span>
      <Bar :data="pelatihanData" :options="{ responsive: true, plugins: { legend: { display: false } } }" />
    </div>
  </div>
</template>

<script setup>
import { Bar, Pie } from 'vue-chartjs'
import { Chart, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend)

const instansiData = {
  labels: ['Kementerian', 'Lembaga', 'Pemda', 'BUMN', 'Lainnya'],
  datasets: [{ label: 'Jumlah', data: [120, 80, 60, 30, 10], backgroundColor: '#1976D2' }]
}
const jenisInstansiData = {
  labels: ['Pusat', 'Daerah', 'Lainnya'],
  datasets: [{ label: 'Jumlah', data: [150, 90, 20], backgroundColor: ['#1976D2', '#2196F3', '#90CAF9'] }]
}
const pelatihanData = {
  labels: ['Dasar CPNS', 'Kepemimpinan', 'Teknis', 'Fungsional', 'Lainnya'],
  datasets: [{ label: 'Jumlah', data: [70, 60, 40, 30, 20], backgroundColor: '#1976D2' }]
}
</script>
