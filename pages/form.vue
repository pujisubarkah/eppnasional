
<template>
  <section class="w-full py-12 px-2 sm:px-4">
    <h1 class="text-2xl md:text-3xl font-extrabold mb-6 text-[#2196F3] drop-shadow">Form Kuesioner Evaluasi</h1>
    <div class="mb-6">
      <div class="flex flex-wrap w-full gap-0 mb-4 border-b border-[#C2E7F6] bg-white rounded-t-xl">
        <button
          v-for="(tab, idx) in tabs"
          :key="tab"
          @click="activeTab = idx"
          class="tab-btn flex-1 min-w-0 px-5 py-2 rounded-t-lg font-semibold transition-all duration-200 border-b-4 outline-none focus:ring-2 focus:ring-[#C2E7F6] flex items-center justify-center gap-2 whitespace-nowrap"
          :class="activeTab === idx
            ? 'bg-gradient-to-tr from-[#C2E7F6] to-[#E3F2FD] border-[#2196F3] text-[#1976D2] shadow-md scale-105 z-10'
            : 'bg-white border-transparent text-gray-500 hover:bg-blue-50 hover:text-[#1976D2] z-0'"
        >
          <span v-if="tabIcons[idx]">
            <component :is="tabIcons[idx]" class="w-5 h-5" :class="activeTab === idx ? 'text-[#2196F3]' : 'text-gray-400'" />
          </span>
          <span class="truncate">{{ tab }}</span>
        </button>
      </div>
      <div class="bg-white/80 rounded-b-xl shadow p-6">
        <div v-if="activeTab === 0">
          <Profile @nextTab="activeTab = 1" />
        </div>
        <div v-else-if="activeTab === 1">
          <EvaluasiPasca @nextTab="activeTab = 2" />
        </div>
        <div v-else-if="activeTab === 2">
          <DukunganLingkungan />
        </div>
        <div v-else-if="activeTab === 3">
          <SikapPerilaku />
        </div>
        <div v-else-if="activeTab === 4">
          <SesuaiWaktu />
        </div>
        <div v-else-if="activeTab === 5">
          <Kontribusi />
        </div>
      </div>
      <button class="bg-[#2196F3] text-white px-6 py-2 rounded shadow hover:bg-[#1976D2] font-semibold transition">Kirim</button>
    </div>
  </section>
</template>


<script setup>
import { ref } from 'vue'
import SikapPerilaku from '~/components/SikapPerilaku.vue'
import DukunganLingkungan from '~/components/DukunganLingkungan.vue'
import EvaluasiPasca from '~/components/EvaluasiPasca.vue'
import Profile from '~/components/Profile.vue'
import SesuaiWaktu from '~/components/SesuaiWaktu.vue'
import Kontribusi from '~/components/kontribusi.vue'
import { User, ClipboardList, Users, TrendingUp, Clock, Star } from 'lucide-vue-next'

const tabs = [
  'Profil',
  'Evaluasi Pasca Pelatihan Nasional',
  'Dukungan Lingkungan',
  'Perubahan Sikap Perilaku dan Peningkatan Kinerja',
  'Kesesuaian Waktu dan Manfaat',
  'Kontribusi pada Prioritas Nasional',
]
const tabIcons = [User, ClipboardList, Users, TrendingUp, Clock, Star]
const activeTab = ref(0)
</script>


<style scoped>
/* Custom tab shadow for active tab */
.tab-btn {
  box-shadow: 0 2px 8px #2196f322;
}
</style>
