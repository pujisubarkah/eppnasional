<template>
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
</template>

<script setup>
import { Users2, PieChart, BarChart3 } from 'lucide-vue-next'
</script>
