<template>
  <div class="max-w-3xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-2xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Penilaian Investasi Waktu</h2>
    <div class="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
      <span class="font-bold">Petunjuk:</span> Beri penilaian pada pernyataan berikut dengan menggunakan skala <b>1</b> hingga <b>4</b>, di mana <b>1</b> berarti <b>Sangat Tidak Setuju</b> dan <b>4</b> berarti <b>Sangat Setuju</b>.
    </div>
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 flex flex-col gap-3 hover:shadow-lg transition">
      <label class="block font-semibold text-[#1976D2] text-base mb-4">Investasi waktu yang saya habiskan untuk mengikuti pelatihan sepadan dengan manfaat atau perkembangan yang saya peroleh</label>
      <div class="flex justify-between gap-4 mt-2">
        <label v-for="val in 4" :key="val" class="flex flex-col items-center text-xs font-medium cursor-pointer">
          <input type="radio" :value="val" v-model="jawaban" class="accent-[#2196F3] scale-125 mb-1" />
          <span class="text-[#1976D2] font-bold">{{ val }}</span>
        </label>
      </div>
      <div class="flex justify-between gap-2 mt-1 text-xs text-gray-500">
        <span>1 = Sangat Tidak Setuju</span>
        <span>2 = Tidak Setuju</span>
        <span>3 = Setuju</span>
        <span>4 = Sangat Setuju</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const jawaban = ref(null)
</script>
