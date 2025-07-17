

<template>
  <div class="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
    <section class="w-full max-w-6xl mt-8 mb-10">
      <div class="flex flex-col items-end mb-4">
        <div class="w-full bg-white/80 rounded-lg shadow p-4 mb-2">
          <div class="font-semibold text-gray-800 mb-2">
            Apakah anda mengikuti <span class="font-bold text-[#1976D2]">Pelatihan Kepemimpinan Nasional Tingkat I</span>, <span class="font-bold text-[#1976D2]">Pelatihan Kepemimpinan Nasional Tingkat II</span>, <span class="font-bold text-[#1976D2]">Pelatihan Kepemimpinan Administrator</span>, <span class="font-bold text-[#1976D2]">Pelatihan Kepemimpinan Pengawas</span>, atau <span class="font-bold text-[#1976D2]">Pelatihan Dasar CPNS</span> pada rentang tahun 2021–2024?
          </div>
          <div class="flex gap-4">
            <button @click="eligible = true; notEligible = false" class="bg-[#1976D2] hover:bg-[#1565C0] text-white font-bold py-2 px-6 rounded-lg shadow transition-colors duration-200">Ya</button>
            <button @click="eligible = false; notEligible = true" class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-lg shadow transition-colors duration-200">Tidak</button>
          </div>
        </div>
        <NuxtLink
          to="/form"
          class="inline-block font-bold py-3 px-8 rounded-lg shadow transition-colors duration-200"
          :class="eligible ? 'bg-[#1976D2] hover:bg-[#1565C0] text-white cursor-pointer' : 'bg-gray-300 text-gray-400 cursor-not-allowed'"
          :tabindex="eligible ? 0 : -1"
          :aria-disabled="!eligible"
          @click.prevent="!eligible && $event.preventDefault()"
        >
          Survey
        </NuxtLink>
        <template v-if="notEligible">
          <div class="w-full bg-red-50 border border-red-200 text-red-700 rounded-lg shadow p-4 text-center">
            Terima kasih atas perhatian anda.<br />
            Maaf, anda tidak memenuhi syarat sebagai responden.<br />
            Survey ini ditujukan bagi alumni pelatihan pada rentang tahun 2021 - 2024.
          </div>
        </template>
      </div>
      <DashboardSummaryCard />
      <DashboardMap />
      <DashboardCharts />
    </section>
    <section class="w-full max-w-2xl mx-auto mb-16">
      <faq />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DashboardSummaryCard from '~/components/DashboardSummaryCard.vue'
import DashboardMap from '~/components/DashboardMap.vue'
import DashboardCharts from '~/components/DashboardCharts.vue'
import faq from '~/components/faq.vue'

const eligible = ref(null)
const notEligible = ref(false)
</script>
