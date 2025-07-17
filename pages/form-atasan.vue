<template>
  <section class="w-full py-12 px-2 sm:px-4">
    <h1 class="text-2xl md:text-3xl font-extrabold mb-6 text-[#2196F3] drop-shadow">Form Evaluasi Atasan/Rekan/Bawahan</h1>
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
          <span class="truncate">{{ tab }}</span>
        </button>
      </div>
      <div class="bg-white/80 rounded-b-xl shadow p-6">
        <div v-if="activeTab === 0">
          <InformasiProfile />
        </div>
        <div v-else-if="activeTab === 1">
          <EPPAtasanBawahan />
          <div class="w-full flex justify-end mt-8">
            <button type="button" class="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition">
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
const tabs = ['Profile', 'Evaluasi Pasca Pelatihan']
const activeTab = ref(0)
const profile = ref({
  nama: '',
  jabatan: '',
  instansi: '',
  domisili: '',
})
const evaluasi = ref({
  kompetensi: '',
  kedisiplinan: '',
  kerjasama: '',
  catatan: '',
})
</script>

<style scoped>
.tab-btn {
  box-shadow: 0 2px 8px #2196f322;
}
</style>
